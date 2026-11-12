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
export interface SavedVocab { key: string; journalId: string; episodeId: string; term: string; translation: string; example: string; savedAt: string }
export interface State {
  entries: Entry[];
  vocab: SavedVocab[];
  opened: Record<string, string[]>; // journalId -> episodeIds visited
  lastVisit: Record<string, string>; // journalId -> iso date
}

const KEY = "language-journal:v1";
const empty: State = { entries: [], vocab: [], opened: {}, lastVisit: {} };
let state: State = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...empty, ...JSON.parse(raw) };
  } catch { /* ignore */ }
}
function set(next: State) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  listeners.forEach((l) => l());
}

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
  set(r.state);
  return r.entry;
}

export function toggleVocab(v: Omit<SavedVocab, "key" | "savedAt">) {
  load();
  const key = `${v.journalId}:${v.term}`;
  const has = state.vocab.some((x) => x.key === key);
  set({ ...state, vocab: has ? state.vocab.filter((x) => x.key !== key) : [...state.vocab, { ...v, key, savedAt: new Date().toISOString() }] });
}

export function completedEpisodes(s: State, journalId: string) {
  return new Set(s.entries.filter((e) => e.journalId === journalId && e.status === "complete").map((e) => e.episodeId));
}
