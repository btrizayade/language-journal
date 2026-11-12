import { useSyncExternalStore } from "react";

export interface Revision { date: string; content: string }
export interface Entry {
  id: string;
  journalId: string;
  episodeId: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  status: "draft" | "complete";
  revisions: Revision[]; // earlier saved versions, oldest first
}
export type VocabStatus = "new" | "learning" | "mastered";
export type VocabCategory = "word" | "expression";
export type ReviewAnswer = "hard" | "familiar" | "easy";
export interface SavedVocab {
  key: string; // languageCode:term — one item per word per language, reusable across journals
  journalId: string; episodeId: string; languageCode: string;
  term: string; translation: string; example: string; savedAt: string;
  category: VocabCategory; note: string; status: VocabStatus;
  interval: number; // days until next review
  due: string; // iso date of next review
}
export interface Passage { id: string; journalId: string; episodeId: string; text: string; note: string; createdAt: string }
export interface State {
  entries: Entry[];
  vocab: SavedVocab[];
  passages: Passage[];
  bookmarks: Record<string, string>; // "journalId/episodeId" -> iso date
  pending: Record<string, { content: string; savedAt: string }>; // unsaved edits of completed entries, by entry id
  goals: Record<string, [number, number]>; // "journalId/episodeId" -> personal word goal
  opened: Record<string, string[]>; // journalId -> episodeIds visited
  lastVisit: Record<string, string>; // journalId -> iso date
  lastEpisode?: { journalId: string; episodeId: string; at: string };
}

export const GUEST_KEY = "language-journal:v1";
let KEY = GUEST_KEY;
export const emptyState: State = { entries: [], vocab: [], passages: [], bookmarks: {}, pending: {}, goals: {}, opened: {}, lastVisit: {} };
const empty = emptyState;
let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    // A stored session means this browser belongs to an account: start from that account's local copy,
    // so anything done before the cloud answers never leaks into the guest area.
    const tokenKey = Object.keys(localStorage).find((k) => /^sb-.*-auth-token$/.test(k));
    const uid = tokenKey && (JSON.parse(localStorage.getItem(tokenKey) ?? "null")?.user?.id as string | undefined);
    if (uid) KEY = `language-journal:user:${uid}`;
    const raw = localStorage.getItem(KEY);
    if (raw) { const r = JSON.parse(raw); state = { ...empty, ...r, vocab: dedupeVocab((r.vocab ?? []).map(normalizeVocab)) }; }
  } catch { /* ignore */ }
}
const changeHooks = new Set<(prev: State, next: State) => void>();
/** Lets the cloud sync see every local change. */
export function onStoreChange(fn: (prev: State, next: State) => void) { changeHooks.add(fn); return () => { changeHooks.delete(fn); }; }
function set(next: State) {
  const prev = state;
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
  changeHooks.forEach((h) => h(prev, next));
}
export const normalizeState = (r: Partial<State>): State => ({ ...empty, ...r, vocab: dedupeVocab((r.vocab ?? []).map(normalizeVocab)) });
/** Reads a saved state without making it current (used to detect guest data before migration). */
export function readSaved(key: string): State | null {
  try { const raw = localStorage.getItem(key); return raw ? normalizeState(JSON.parse(raw)) : null; } catch { return null; }
}
/** The storage key currently in use (guest or a specific account). */
export const currentKey = () => { load(); return KEY; };
export const getState = () => { load(); return state; };
/** Switches the active data (guest ↔ account). Does not trigger sync hooks. */
export function swapState(next: State, key: string) {
  load();
  KEY = key; state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}
export const hasData = (s: State | null) => !!s && (s.entries.length + s.vocab.length + s.passages.length + Object.keys(s.bookmarks).length + Object.keys(s.opened).length) > 0;

export function useStore(): State {
  return useSyncExternalStore(
    (l) => { load(); listeners.add(l); l(); return () => listeners.delete(l); },
    () => { load(); return state; },
    () => empty,
  );
}

export function markOpened(journalId: string, episodeId: string) {
  load();
  const list = state.opened[journalId] ?? [];
  set({
    ...state,
    opened: { ...state.opened, [journalId]: list.includes(episodeId) ? list : [...list, episodeId] },
    lastVisit: { ...state.lastVisit, [journalId]: new Date().toISOString() },
    lastEpisode: { journalId, episodeId, at: new Date().toISOString() },
  });
}

/** Saves an entry. When the content of an existing entry changes, the previous version is kept in revisions. */
export function saveEntry(s: State, journalId: string, episodeId: string, content: string, status: Entry["status"], id?: string): { state: State; entry: Entry } {
  const now = new Date().toISOString();
  const existing = id ? s.entries.find((e) => e.id === id) : undefined;
  let entry: Entry;
  if (existing) {
    const revisions = existing.content !== content && existing.content.trim()
      ? [...existing.revisions, { date: existing.updatedAt, content: existing.content }]
      : existing.revisions;
    entry = { ...existing, content, status, updatedAt: now, revisions };
  } else {
    entry = { id: crypto.randomUUID(), journalId, episodeId, createdAt: now, updatedAt: now, content, status, revisions: [] };
  }
  const entries = existing ? s.entries.map((e) => (e.id === entry.id ? entry : e)) : [entry, ...s.entries];
  return { state: { ...s, entries }, entry };
}
export function persistEntry(...args: Parameters<typeof saveEntry> extends [State, ...infer R] ? R : never) {
  load();
  const r = saveEntry(state, ...args);
  const { [r.entry.id]: _, ...pending } = r.state.pending;
  set({ ...r.state, pending });
  return r.entry;
}

export const vocabKey = (languageCode: string, term: string) => `${languageCode}:${term.trim().toLowerCase()}`;

/** Upgrades items saved by older versions (no status/language) to the current shape. */
export function normalizeVocab(v: Partial<SavedVocab> & { term: string; journalId: string }): SavedVocab {
  const languageCode = v.languageCode ?? (v.journalId.includes("camille") ? "fr" : "de");
  const savedAt = v.savedAt ?? new Date().toISOString();
  return {
    journalId: v.journalId, episodeId: v.episodeId ?? "", languageCode, term: v.term,
    translation: v.translation ?? "", example: v.example ?? "", savedAt,
    category: v.category ?? (v.term.trim().includes(" ") ? "expression" : "word"),
    note: v.note ?? "", status: v.status ?? "new", interval: v.interval ?? 0, due: v.due ?? savedAt,
    key: vocabKey(languageCode, v.term),
  };
}
function dedupeVocab(list: SavedVocab[]) {
  const seen = new Set<string>();
  return list.filter((v) => (seen.has(v.key) ? false : (seen.add(v.key), true)));
}

/** Adds a word, or removes it when already saved. Saving the same word twice never duplicates it. */
export function toggleVocabIn(s: State, v: Pick<SavedVocab, "journalId" | "episodeId" | "languageCode" | "term" | "translation" | "example"> & { category?: VocabCategory }): State {
  const key = vocabKey(v.languageCode, v.term);
  if (s.vocab.some((x) => x.key === key)) return { ...s, vocab: s.vocab.filter((x) => x.key !== key) };
  return { ...s, vocab: [...s.vocab, normalizeVocab({ ...v, savedAt: new Date().toISOString() })] };
}
export function toggleVocab(v: Parameters<typeof toggleVocabIn>[1]) { load(); set(toggleVocabIn(state, v)); }
export function updateVocab(key: string, patch: Partial<Pick<SavedVocab, "translation" | "note" | "status" | "category" | "example">>) {
  load(); set({ ...state, vocab: state.vocab.map((v) => (v.key === key ? { ...v, ...patch } : v)) });
}
export function deleteVocab(key: string) { load(); set({ ...state, vocab: state.vocab.filter((v) => v.key !== key) }); }

/** Spaced review: hard comes back tomorrow, familiar a little later, easy waits longer each time. */
export function scheduleReview(v: SavedVocab, answer: ReviewAnswer, now = new Date()): SavedVocab {
  const interval = answer === "hard" ? 1 : answer === "familiar" ? Math.max(3, Math.round(v.interval * 1.5)) : Math.max(7, Math.round(v.interval * 2.5));
  const due = new Date(now); due.setDate(due.getDate() + interval);
  const status: VocabStatus = answer === "easy" && interval >= 14 ? "mastered" : "learning";
  return { ...v, interval, due: due.toISOString(), status };
}
export function reviewVocab(key: string, answer: ReviewAnswer) {
  load(); set({ ...state, vocab: state.vocab.map((v) => (v.key === key ? scheduleReview(v, answer) : v)) });
}
export const dueVocab = (s: State, now = new Date()) => s.vocab.filter((v) => new Date(v.due) <= now).sort((a, b) => a.due.localeCompare(b.due));

// Passages & bookmarks
export const epKey = (journalId: string, episodeId: string) => `${journalId}/${episodeId}`;
export function toggleBookmark(journalId: string, episodeId: string) {
  load();
  const k = epKey(journalId, episodeId);
  const { [k]: had, ...rest } = state.bookmarks;
  set({ ...state, bookmarks: had ? rest : { ...state.bookmarks, [k]: new Date().toISOString() } });
}
/** Saves a passage once per episode; saving the same text again returns the existing one. */
export function addPassageIn(s: State, journalId: string, episodeId: string, text: string, note = ""): { state: State; passage: Passage } {
  const clean = text.trim().replace(/\s+/g, " ");
  const existing = s.passages.find((p) => p.journalId === journalId && p.episodeId === episodeId && p.text === clean);
  if (existing) return { state: s, passage: existing };
  const passage = { id: crypto.randomUUID(), journalId, episodeId, text: clean, note, createdAt: new Date().toISOString() };
  return { state: { ...s, passages: [passage, ...s.passages] }, passage };
}
export function addPassage(journalId: string, episodeId: string, text: string) { load(); const r = addPassageIn(state, journalId, episodeId, text); set(r.state); return r.passage; }
export function updatePassage(id: string, note: string) { load(); set({ ...state, passages: state.passages.map((p) => (p.id === id ? { ...p, note } : p)) }); }
export function deletePassage(id: string) { load(); set({ ...state, passages: state.passages.filter((p) => p.id !== id) }); }

// Writing helpers
/** Autosave: drafts are updated in place (no revision per keystroke); completed entries keep edits pending until saved. */
export function autosaveIn(s: State, journalId: string, episodeId: string, content: string, id?: string): { state: State; id?: string | undefined } {
  if (!content.trim()) return { state: s, id };
  const existing = id ? s.entries.find((e) => e.id === id) : undefined;
  const now = new Date().toISOString();
  if (!existing) { const r = saveEntry(s, journalId, episodeId, content, "draft"); return { state: r.state, id: r.entry.id }; }
  if (existing.content === content) { const { [existing.id]: _, ...pending } = s.pending; return { state: { ...s, pending }, id }; }
  if (existing.status === "draft") return { state: { ...s, entries: s.entries.map((e) => (e.id === id ? { ...e, content, updatedAt: now } : e)) }, id };
  return { state: { ...s, pending: { ...s.pending, [existing.id]: { content, savedAt: now } } }, id };
}
export function autosave(...args: Parameters<typeof autosaveIn> extends [State, ...infer R] ? R : never) { load(); const r = autosaveIn(state, ...args); if (r.state !== state) set(r.state); return r.id; }
export function clearPending(id: string) { load(); const { [id]: _, ...pending } = state.pending; set({ ...state, pending }); }
export function setGoal(journalId: string, episodeId: string, goal: [number, number] | null) {
  load(); const k = epKey(journalId, episodeId); const { [k]: _, ...rest } = state.goals;
  set({ ...state, goals: goal ? { ...rest, [k]: goal } : rest });
}

export type EpisodeStatus = "notStarted" | "inProgress" | "writingPending" | "completed";
/** Completed only when a final writing entry is saved; opening alone never completes an episode. */
export function episodeStatus(s: State, journalId: string, episodeId: string): EpisodeStatus {
  const es = s.entries.filter((e) => e.journalId === journalId && e.episodeId === episodeId);
  if (es.some((e) => e.status === "complete")) return "completed";
  if (es.length) return "writingPending";
  if ((s.opened[journalId] ?? []).includes(episodeId)) return "inProgress";
  return "notStarted";
}
export function completedEpisodes(s: State, journalId: string) {
  return new Set(s.entries.filter((e) => e.journalId === journalId && e.status === "complete").map((e) => e.episodeId));
}
