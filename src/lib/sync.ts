import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { currentKey, emptyState, getState, GUEST_KEY, hasData, normalizeState, onStoreChange, readSaved, swapState, type Entry, type State } from "./store";
import { mergeStates } from "./merge";
import { getPrefs, onPrefsChange, setPrefs, type Prefs } from "./i18n";
import { getReading, onReadingChange, setReading, type ReadingPrefs } from "./reading";

export type SyncStatus = "guest" | "loading" | "saving" | "saved" | "error";
interface SyncInfo { user: User | null; status: SyncStatus; offer: State | null; ready: boolean }
const INITIAL: SyncInfo = { user: null, status: "guest", offer: null, ready: false };
let info: SyncInfo = INITIAL;
const listeners = new Set<() => void>();
const setInfo = (p: Partial<SyncInfo>) => { info = { ...info, ...p }; listeners.forEach((l) => l()); };
export const useSync = () => useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => info, () => INITIAL);

const userKey = (id: string) => `language-journal:user:${id}`;
const handledKey = (id: string) => `language-journal:guest-handled:${id}`;
const fingerprint = (s: State) => `${s.entries.map((e) => e.id + e.updatedAt).join()}|${s.vocab.length}|${s.passages.length}|${Object.keys(s.bookmarks).length}|${Object.keys(s.opened).length}|${JSON.stringify(s.assessments)}|${JSON.stringify(s.completed)}`;

let synced: State = emptyState; // what the account is known to hold
let timer: ReturnType<typeof setTimeout> | undefined;
let flushing: Promise<void> | null = null;
let accountLoaded = false;

/** Compare-and-swap uses the existing updated_at column; RLS remains the caller's. */
export async function writeWithRetry(table: "writing_entries" | "user_state", identity: Record<string, string>, build: (row: Record<string, unknown> | null) => Record<string, unknown>) {
  for (let attempt = 0; attempt < 5; attempt++) {
    let read = supabase.from(table).select("*");
    for (const [key, value] of Object.entries(identity)) read = read.eq(key, value);
    const { data, error } = await read.maybeSingle();
    if (error) throw error;
    const row = data as Record<string, unknown> | null;
    const prior = typeof row?.['updated_at'] === "string" ? row['updated_at'] : "";
    const date = new Date(Math.max(Date.now(), (Date.parse(prior) || 0) + 1)).toISOString();
    const value = { ...build(row), ...identity, updated_at: date };
    if (!row) {
      const result = await supabase.from(table).insert(value as never).select("*").maybeSingle();
      if (!result.error && result.data) return result.data;
      if (result.error?.code === "23505") continue;
      throw result.error ?? new Error("Insert did not persist");
    }
    let update = supabase.from(table).update(value as never).eq("updated_at", prior);
    for (const [key, id] of Object.entries(identity)) update = update.eq(key, id);
    const result = await update.select("*").maybeSingle();
    if (result.error) throw result.error;
    if (result.data) return result.data;
  }
  throw new Error("Concurrent changes; retry required");
}
function entryFromRow(r: Record<string, unknown>): Entry {
  return { id: String(r['id']), journalId: String(r['journal_id']), episodeId: String(r['episode_id']), content: String(r['content']),
    status: r['status'] as Entry["status"], revisions: (r['revisions'] ?? []) as Entry["revisions"], createdAt: String(r['created_at']), updatedAt: String(r['updated_at']),
    ...(r['content'] === "" && r['status'] === "draft" ? { clearedAt: String(r['updated_at']) } : {}) };
}

async function pull(uid: string): Promise<{ state: State; prefs: Prefs | null; reading: ReadingPrefs | null }> {
  const [e, v, p, b, u] = await Promise.all([
    supabase.from("writing_entries").select("*").eq("user_id", uid),
    supabase.from("saved_vocabulary").select("*").eq("user_id", uid),
    supabase.from("reading_passages").select("*").eq("user_id", uid),
    supabase.from("bookmarks").select("*").eq("user_id", uid),
    supabase.from("user_state").select("*").eq("user_id", uid).maybeSingle(),
  ]);
  const err = e.error ?? v.error ?? p.error ?? b.error ?? u.error;
  if (err) throw err;
  const us = u.data;
  const state = normalizeState({
    entries: (e.data ?? []).map((r) => ({ id: r['id'], journalId: r['journal_id'], episodeId: r['episode_id'], content: r['content'], status: r['status'] as Entry["status"], revisions: r['revisions'] as unknown as Entry["revisions"], createdAt: r['created_at'], updatedAt: r['updated_at'] }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    vocab: (v.data ?? []).map((r) => r['data'] as unknown as State["vocab"][number]),
    passages: (p.data ?? []).map((r) => ({ id: r['id'], journalId: r['journal_id'], episodeId: r['episode_id'], text: r['text'], note: r['note'], createdAt: r['created_at'] })),
    bookmarks: Object.fromEntries((b.data ?? []).map((r) => [r['episode_key'], r['created_at']])),
    opened: (us?.opened ?? {}) as State["opened"], lastVisit: (us?.last_visit ?? {}) as State["lastVisit"],
    goals: (us?.goals ?? {}) as State["goals"], pending: (us?.pending ?? {}) as unknown as State["pending"],
    completed: (us?.completed ?? {}) as State["completed"], assessments: (us?.assessments ?? {}) as unknown as State["assessments"],
    ...(us?.last_episode ? { lastEpisode: us.last_episode as unknown as NonNullable<State["lastEpisode"]> } : {}),
  });
  return { state, prefs: (us?.prefs as Prefs | null) ?? null, reading: (us?.reading as ReadingPrefs | null) ?? null };
}

/** Sends only what changed since the last successful sync. Upserts by stable ids, so retries never duplicate. */
async function push(uid: string, from: State, to: State): Promise<State> {
  const ops: PromiseLike<{ error: unknown }>[] = [];
  let persisted = to;
  const changedEntries = to.entries.filter((e) => !from.entries.includes(e));
  for (const entry of changedEntries) {
    let merged = entry;
    const result = await writeWithRetry("writing_entries", { id: entry.id, user_id: uid }, (row) => {
      const remote = row ? entryFromRow(row) : undefined;
      merged = mergeStates({ ...emptyState, entries: remote ? [remote] : [] }, { ...emptyState, entries: [entry] }).entries[0] ?? entry;
      return { journal_id: merged.journalId, episode_id: merged.episodeId, content: merged.content, status: merged.status, revisions: merged.revisions, created_at: merged.createdAt };
    });
    // Preserve logical edit timestamps in memory until next remote read.
    const saved = { ...merged, updatedAt: String(result.updated_at) };
    persisted = { ...persisted, entries: persisted.entries.map((e) => e.id === saved.id ? saved : e) };
  }
  const goneEntries = from.entries.filter((e) => !to.entries.some((x) => x.id === e.id)).map((e) => e.id);
  if (goneEntries.length) ops.push(supabase.from("writing_entries").delete().eq("user_id", uid).in("id", goneEntries));

  const changedVocab = to.vocab.filter((v) => !from.vocab.includes(v));
  if (changedVocab.length) ops.push(supabase.from("saved_vocabulary").upsert(changedVocab.map((v) => ({ user_id: uid, key: v.key, language_code: v.languageCode, data: v as never, updated_at: new Date().toISOString() }))));
  const goneVocab = from.vocab.filter((v) => !to.vocab.some((x) => x.key === v.key)).map((v) => v.key);
  if (goneVocab.length) ops.push(supabase.from("saved_vocabulary").delete().eq("user_id", uid).in("key", goneVocab));

  const changedP = to.passages.filter((p) => !from.passages.includes(p));
  if (changedP.length) ops.push(supabase.from("reading_passages").upsert(changedP.map((p) => ({ id: p.id, user_id: uid, journal_id: p.journalId, episode_id: p.episodeId, text: p.text, note: p.note, created_at: p.createdAt }))));
  const goneP = from.passages.filter((p) => !to.passages.some((x) => x.id === p.id)).map((p) => p.id);
  if (goneP.length) ops.push(supabase.from("reading_passages").delete().eq("user_id", uid).in("id", goneP));

  const addB = Object.keys(to.bookmarks).filter((k) => !(k in from.bookmarks));
  if (addB.length) ops.push(supabase.from("bookmarks").upsert(addB.map((k) => ({ user_id: uid, episode_key: k, created_at: to.bookmarks[k] ?? new Date().toISOString() }))));
  const goneB = Object.keys(from.bookmarks).filter((k) => !(k in to.bookmarks));
  if (goneB.length) ops.push(supabase.from("bookmarks").delete().eq("user_id", uid).in("episode_key", goneB));

  if (from.opened !== to.opened || from.lastVisit !== to.lastVisit || from.lastEpisode !== to.lastEpisode || from.goals !== to.goals || from.pending !== to.pending || from.completed !== to.completed || from.assessments !== to.assessments) {
    await writeWithRetry("user_state", { user_id: uid }, (row) => {
      const remote = normalizeState({ opened: (row?.['opened'] ?? {}) as State["opened"], lastVisit: (row?.['last_visit'] ?? {}) as State["lastVisit"], goals: (row?.['goals'] ?? {}) as State["goals"], pending: (row?.['pending'] ?? {}) as State["pending"], completed: (row?.['completed'] ?? {}) as State["completed"], assessments: (row?.['assessments'] ?? {}) as State["assessments"], ...(row?.['last_episode'] ? { lastEpisode: row['last_episode'] as NonNullable<State["lastEpisode"]> } : {}) });
      const m = mergeStates(remote, persisted);
      persisted = { ...persisted, opened: m.opened, lastVisit: m.lastVisit, pending: m.pending, completed: m.completed, assessments: m.assessments, ...(m.lastEpisode ? { lastEpisode: m.lastEpisode } : {}) };
      return { opened: m.opened, last_visit: m.lastVisit, last_episode: m.lastEpisode ?? null, goals: to.goals, pending: m.pending, completed: m.completed, assessments: m.assessments };
    });
  }
  const results = await Promise.all(ops);
  const failed = results.find((r) => r['error']);
  if (failed) throw failed.error;
  return persisted;
}

export async function flush() {
  const uid = info.user?.id;
  if (!uid || !accountLoaded || currentKey() !== userKey(uid)) return;
  if (flushing) await flushing;
  const target = getState();
  if (target === synced) return;
  setInfo({ status: "saving" });
  flushing = push(uid, synced, target)
    .then((saved) => {
      if (info.user?.id !== uid || currentKey() !== userKey(uid)) return;
      const current = getState();
      const next = current === target ? saved : mergeStates(saved, current);
      synced = saved; swapState(next, userKey(uid));
      setInfo({ status: next === saved ? "saved" : "saving" }); if (next !== saved) schedule();
    })
    .catch((e) => { console.error("sync failed", e); setInfo({ status: "error" }); clearTimeout(timer); timer = setTimeout(flush, 8000); })
    .finally(() => { flushing = null; });
  await flushing;
}
const schedule = () => { clearTimeout(timer); timer = setTimeout(flush, 700); };

async function pushPrefs() {
  const uid = info.user?.id;
  if (!uid || !accountLoaded) return;
  const { error } = await supabase.from("user_state").upsert({ user_id: uid, prefs: getPrefs() as never, reading: getReading() as never, updated_at: new Date().toISOString() });
  if (error) { console.error("prefs sync failed", error); setInfo({ status: "error" }); }
}

async function signedIn(user: User) {
  accountLoaded = false;
  setInfo({ user, status: "loading" });
  const key = userKey(user.id);
  if (currentKey() !== key) swapState(readSaved(key) ?? emptyState, key);
  try {
    // Only an untouched copy of this same account may be replaced; anything done while loading is merged in.
    const cloud = await pull(user.id);
    if (info.user?.id !== user.id || currentKey() !== key) return;
    synced = cloud.state;
    const after = currentKey() === userKey(user.id) ? getState() : null;
    swapState(after ? mergeStates(cloud.state, after) : cloud.state, key);
    accountLoaded = true;
    if (getState() !== synced) schedule();
    if (cloud.prefs) setPrefs(cloud.prefs, true); else void pushPrefs();
    if (cloud.reading) setReading(cloud.reading, true);
    const guest = readSaved(GUEST_KEY);
    const offer = guest && hasData(guest) && localStorage.getItem(handledKey(user.id)) !== fingerprint(guest) ? guest : null;
    setInfo({ status: "saved", offer, ready: true });
  } catch (e) {
    console.error(e);
    // Fall back to this device's copy of the account so nothing is lost; it syncs once the connection returns.
    if (info.user?.id !== user.id) return;
    setInfo({ status: "error", ready: true });
    clearTimeout(timer); timer = setTimeout(() => { if (info.user?.id === user.id) void signedIn(user); }, 8000);
  }
}

/** Copies this browser's guest data into the account. Guest data is kept on the device as a backup. */
export async function acceptMigration() {
  const guest = info.offer; const uid = info.user?.id;
  if (!guest || !uid) return;
  const merged = mergeStates(getState(), guest);
  // swapState keeps object identity for unchanged items, so only new or merged items are sent.
  swapState(merged, userKey(uid));
  await flush();
  if (info.status === "error") throw new Error("migration failed");
  localStorage.setItem(handledKey(uid), fingerprint(guest));
  try { localStorage.setItem(`${GUEST_KEY}:backup`, JSON.stringify(guest)); } catch { /* ignore */ }
  setInfo({ offer: null });
}
export function declineMigration() {
  const uid = info.user?.id;
  if (uid && info.offer) localStorage.setItem(handledKey(uid), fingerprint(info.offer));
  setInfo({ offer: null });
}

let started = false;
/** Call once from the root component's effect. */
export function startSync() {
  if (started || typeof window === "undefined") return;
  started = true;
  onStoreChange(() => { if (info.user && accountLoaded && currentKey() === userKey(info.user.id)) schedule(); });
  onPrefsChange(() => void pushPrefs());
  onReadingChange(() => void pushPrefs());
  supabase.auth.getUser().then(({ data }) => { if (data.user) void signedIn(data.user); else setInfo({ ready: true }); });
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user && session.user.id !== info.user?.id) void signedIn(session.user);
    if (event === "USER_UPDATED" && session?.user) setInfo({ user: session.user });
    if (event === "SIGNED_OUT" && info.user) {
      accountLoaded = false;
      clearTimeout(timer);
      synced = emptyState;
      swapState(readSaved(GUEST_KEY) ?? emptyState, GUEST_KEY);
      setInfo({ user: null, status: "guest", offer: null });
    }
  });
  // Bring in changes made on another device when returning to this tab.
  window.addEventListener("focus", () => {
    const u = info.user;
    if (!u || getState() !== synced || flushing) return;
    pull(u.id).then((c) => { if (info.user?.id === u.id && getState() === synced) { const merged = mergeStates(c.state, getState()); synced = c.state; swapState(merged, userKey(u.id)); schedule(); } }).catch(() => setInfo({ status: "error" }));
  });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") void flush(); });
}

export async function signOut() {
  await flush().catch(() => {});
  await supabase.auth.signOut();
}
