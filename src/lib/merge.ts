import type { Entry, Passage, SavedVocab, State } from "./store";

/**
 * Combines account data (cloud) with data saved in this browser (local) without losing either.
 * Cloud wins on conflicts; anything that would be overwritten is kept (as a revision or appended note).
 */
export function mergeStates(cloud: State, local: State): State {
  const entries = new Map<string, Entry>(cloud.entries.map((e) => [e.id, e]));
  for (const l of local.entries) {
    const c = entries.get(l.id);
    if (!c) { entries.set(l.id, l); continue; }
    if (c.content === l.content) { entries.set(l.id, { ...c, status: c.status === "complete" || l.status === "complete" ? "complete" : "draft" }); continue; }
    const [newer, older] = c.updatedAt >= l.updatedAt ? [c, l] : [l, c];
    const revisions = [...c.revisions];
    for (const r of [...l.revisions, { date: older.updatedAt, content: older.content }]) {
      if (r.content.trim() && !revisions.some((x) => x.content === r.content)) revisions.push(r);
    }
    revisions.sort((a, b) => a.date.localeCompare(b.date));
    entries.set(l.id, { ...newer, status: c.status === "complete" || l.status === "complete" ? "complete" : "draft", revisions });
  }

  const vocab = new Map<string, SavedVocab>(cloud.vocab.map((v) => [v.key, v]));
  for (const v of local.vocab) {
    const c = vocab.get(v.key);
    if (!c) vocab.set(v.key, v);
    else if (v.note.trim() && v.note !== c.note && !c.note.includes(v.note)) vocab.set(v.key, { ...c, note: c.note ? `${c.note}\n\n${v.note}` : v.note });
  }

  const passages: Passage[] = [...cloud.passages];
  for (const p of local.passages) {
    const i = passages.findIndex((x) => x.id === p.id || (x.journalId === p.journalId && x.episodeId === p.episodeId && x.text === p.text));
    if (i < 0) { passages.push(p); continue; }
    const c = passages[i];
    if (!c) continue;
    if (p.note.trim() && p.note !== c.note && !c.note.includes(p.note)) passages[i] = { ...c, note: c.note ? `${c.note}\n\n${p.note}` : p.note };
  }

  const bookmarks = { ...local.bookmarks, ...cloud.bookmarks };
  const opened: State["opened"] = { ...cloud.opened };
  for (const [j, eps] of Object.entries(local.opened)) opened[j] = [...new Set([...(opened[j] ?? []), ...eps])];
  const lastVisit = { ...local.lastVisit };
  for (const [j, d] of Object.entries(cloud.lastVisit)) if (!lastVisit[j] || d > lastVisit[j]) lastVisit[j] = d;
  const lastEpisode = !cloud.lastEpisode ? local.lastEpisode : !local.lastEpisode ? cloud.lastEpisode : cloud.lastEpisode.at >= local.lastEpisode.at ? cloud.lastEpisode : local.lastEpisode;

  return {
    completed: { ...local.completed, ...cloud.completed },
    assessments: Object.fromEntries([...new Set([...Object.keys(cloud.assessments), ...Object.keys(local.assessments)])].map((key) => [key,
      [...new Map([...(local.assessments[key] ?? []), ...(cloud.assessments[key] ?? [])].map((a) => [a.id, a])).values()].sort((a, b) => a.at.localeCompare(b.at)),
    ])),
    entries: [...entries.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    vocab: [...vocab.values()],
    passages: passages.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    bookmarks,
    pending: { ...local.pending, ...cloud.pending },
    goals: { ...local.goals, ...cloud.goals },
    opened, lastVisit,
    ...(lastEpisode ? { lastEpisode } : {}),
  };
}
