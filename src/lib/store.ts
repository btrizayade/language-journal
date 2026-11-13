import { useSyncExternalStore } from "react";
import { mergeVersions, versionId, type PendingVersion } from "./versions";

export interface Revision { id?: string | undefined; date: string; content: string }
export interface Entry {
  id: string;
  journalId: string;
  episodeId: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  status: "draft" | "complete";
  revisions: Revision[]; // earlier saved versions, oldest first
  clearedAt?: string | undefined; // explicit intentionally empty draft; never a missing record
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
export interface AssessmentAttempt { id: string; at: string; answers: number[][]; correct: number; total: number }
export interface State {
  completed: Record<string, string>;
  assessments: Record<string, AssessmentAttempt[]>;
  entries: Entry[];
  vocab: SavedVocab[];
  passages: Passage[];
  bookmarks: Record<string, string>; // "journalId/episodeId" -> iso date
  pending: Record<string, PendingVersion>; // persisted edits plus conflict/resolution records
  goals: Record<string, [number, number]>; // "journalId/episodeId" -> personal word goal
  opened: Record<string, string[]>; // journalId -> episodeIds visited
  lastVisit: Record<string, string>; // journalId -> iso date
  lastEpisode?: { journalId: string; episodeId: string; at: string };
}

export const GUEST_KEY = "language-journal:v1";
let KEY = GUEST_KEY;
export const emptyState: State = { completed: {}, assessments: {}, entries: [], vocab: [], passages: [], bookmarks: {}, pending: {}, goals: {}, opened: {}, lastVisit: {} };
const empty = emptyState;
let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();
let storageFailed = false;
const persistenceListeners = new Set<() => void>();
const setStorageFailed = (value: boolean) => { storageFailed = value; persistenceListeners.forEach((l) => l()); };
export const useStorageFailure = () => useSyncExternalStore((l) => { persistenceListeners.add(l); return () => persistenceListeners.delete(l); }, () => storageFailed, () => false);
export function retryLocalPersistence() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); setStorageFailed(false); return true; }
  catch { setStorageFailed(true); return false; }
}

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
    if (raw) state = normalizeState(JSON.parse(raw));
  } catch { /* ignore */ }
}
const changeHooks = new Set<(prev: State, next: State) => void>();
/** Lets the cloud sync see every local change. */
export function onStoreChange(fn: (prev: State, next: State) => void) { changeHooks.add(fn); return () => { changeHooks.delete(fn); }; }
function set(next: State) {
  const prev = state;
  state = next;
  const persisted = retryLocalPersistence();
  listeners.forEach((l) => l());
  changeHooks.forEach((h) => h(prev, next));
  if (!persisted) throw new Error("Local persistence failed; changes remain in memory");
}
export const normalizeState = (r: Partial<State>): State => ({ ...empty, ...r,
  entries: (r.entries ?? []).map((e) => ({ ...e, revisions: mergeVersions(e.id, e.revisions ?? []) })),
  // Only legacy copies lack this field: preserve their previously completed episodes.
  completed: r.completed ?? Object.fromEntries((r.entries ?? []).filter((e) => e.status === "complete").map((e) => [epKey(e.journalId, e.episodeId), e.updatedAt])),
  vocab: dedupeVocab((r.vocab ?? []).map(normalizeVocab)) });
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
  retryLocalPersistence();
  listeners.forEach((l) => l());
}
export const hasData = (s: State | null) => !!s && (s.entries.length + s.vocab.length + s.passages.length + Object.keys(s.bookmarks).length + Object.keys(s.opened).length + Object.keys(s.assessments).length + Object.keys(s.completed).length) > 0;

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
  const existing = id ? s.entries.find((e) => e.id === id && e.journalId === journalId && e.episodeId === episodeId) : undefined;
  let entry: Entry;
  if (existing) {
    const p = s.pending[existing.id];
    const revisions = mergeVersions(existing.id, existing.revisions,
      existing.content !== content ? [{ id: versionId(existing.id, existing.updatedAt, existing.content), date: existing.updatedAt, content: existing.content }] : [],
      [...(p && !p.resolved && p.content !== content ? [p] : []), ...(p?.conflicts ?? [])].map((v) => ({ id: v.id, date: v.savedAt, content: v.content })));
    entry = { ...existing, content, status, updatedAt: now, revisions, clearedAt: content === "" && status === "draft" ? now : undefined };
  } else {
    entry = { id: crypto.randomUUID(), journalId, episodeId, createdAt: now, updatedAt: now, content, status, revisions: [] };
  }
  const entries = existing ? s.entries.map((e) => (e.id === entry.id ? entry : e)) : [entry, ...s.entries];
  return { state: { ...s, entries }, entry };
}
export function persistEntry(...args: Parameters<typeof saveEntry> extends [State, ...infer R] ? R : never) {
  load();
  const r = saveEntry(state, ...args);
  const p = state.pending[r.entry.id];
  const pending = { ...r.state.pending };
  if (p) pending[r.entry.id] = { id: crypto.randomUUID(), content: r.entry.content, savedAt: r.entry.updatedAt, resolved: true,
    resolvedIds: [...new Set([...(p.resolvedIds ?? []), ...[p, ...(p.conflicts ?? [])].map((v) => v.id ?? versionId(r.entry.id, v.savedAt, v.content))])] };
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
  const existing = id ? s.entries.find((e) => e.id === id && e.journalId === journalId && e.episodeId === episodeId) : undefined;
  if (!existing && !content.trim()) return { state: s };
  const now = new Date().toISOString();
  if (!existing) { const r = saveEntry(s, journalId, episodeId, content, "draft"); return { state: r.state, id: r.entry.id }; }
  if (existing.content === content && !s.pending[existing.id]) return { state: s, id };
  if (existing.status === "draft") return { state: { ...s, entries: s.entries.map((e) => (e.id === id ? { ...e, content, updatedAt: now, clearedAt: content === "" ? now : undefined } : e)) }, id };
  const previous = s.pending[existing.id];
  if (previous && !previous.resolved && previous.content === content) return { state: s, id };
  return { state: { ...s, pending: { ...s.pending, [existing.id]: { id: crypto.randomUUID(), content, savedAt: now,
    conflicts: previous?.conflicts ?? [], resolvedIds: [...new Set([...(previous?.resolvedIds ?? []), ...(previous?.id ? [previous.id] : [])])] } } }, id };
}
export function autosave(...args: Parameters<typeof autosaveIn> extends [State, ...infer R] ? R : never) { load(); const r = autosaveIn(state, ...args); if (r.state !== state) set(r.state); return r.id; }
export function clearPending(id: string) { load(); const { [id]: _, ...pending } = state.pending; set({ ...state, pending }); }
export function setGoal(journalId: string, episodeId: string, goal: [number, number] | null) {
  load(); const k = epKey(journalId, episodeId); const { [k]: _, ...rest } = state.goals;
  set({ ...state, goals: goal ? { ...rest, [k]: goal } : rest });
}

export type EpisodeStatus = "notStarted" | "inProgress" | "writingPending" | "completed";
/** Saving writing or comprehension never completes an episode. */
export function episodeStatus(s: State, journalId: string, episodeId: string): EpisodeStatus {
  const es = s.entries.filter((e) => e.journalId === journalId && e.episodeId === episodeId);
  if (s.completed[epKey(journalId, episodeId)]) return "completed";
  if (es.length) return "writingPending";
  if ((s.opened[journalId] ?? []).includes(episodeId)) return "inProgress";
  return "notStarted";
}
export function completedEpisodes(s: State, journalId: string) {
  return new Set(Object.keys(s.completed).filter((k) => k.startsWith(`${journalId}/`)).map((k) => k.slice(journalId.length + 1)));
}
export function completeEpisodeIn(s: State, journalId: string, episodeId: string): State {
  if (s.completed[epKey(journalId, episodeId)] || !s.entries.some((e) => e.journalId === journalId && e.episodeId === episodeId && e.status === "complete" && (!s.pending[e.id] || s.pending[e.id]?.resolved))) return s;
  return { ...s, completed: { ...s.completed, [epKey(journalId, episodeId)]: new Date().toISOString() } };
}
export function completeEpisode(journalId: string, episodeId: string) { load(); set(completeEpisodeIn(state, journalId, episodeId)); }
export function saveAssessmentIn(s: State, key: string, attempt: AssessmentAttempt): State {
  if (s.assessments[key]?.some((a) => a.id === attempt.id)) return s;
  return { ...s, assessments: { ...s.assessments, [key]: [...(s.assessments[key] ?? []), attempt] } };
}
export function saveAssessment(key: string, attempt: AssessmentAttempt) { load(); set(saveAssessmentIn(state, key, attempt)); }
