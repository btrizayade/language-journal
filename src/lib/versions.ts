/** JSON-compatible identities also work for legacy records without a UUID. */
export interface TextVersion { id?: string | undefined; content: string; date: string }
export interface PendingVersion { id?: string | undefined; content: string; savedAt: string; conflicts?: PendingVersion[]; resolvedIds?: string[]; resolved?: boolean }

export const versionId = (scope: string, date: string, content: string) => `legacy:${JSON.stringify([scope, date, content])}`;
export const timestamp = (date?: string) => { const value = Date.parse(date ?? ""); return Number.isFinite(value) ? value : 0; };
export function mergeVersions(scope: string, ...lists: TextVersion[][]): TextVersion[] {
  const unique = new Map<string, TextVersion>();
  for (const r of lists.flat()) {
    const id = r.id ?? versionId(scope, r.date ?? "", r.content);
    // A corrupt reused ID must not erase a different record.
    const previous = unique.get(id);
    const key = previous && (previous.date !== r.date || previous.content !== r.content) ? versionId(id, r.date, r.content) : id;
    unique.set(key, { ...r, id: key });
  }
  return [...unique.values()].sort((a, b) => timestamp(a.date) - timestamp(b.date) || (a.id ?? "").localeCompare(b.id ?? ""));
}

export function mergePending(scope: string, a?: PendingVersion, b?: PendingVersion): PendingVersion | undefined {
  if (!a && !b) return undefined;
  const sources = [a, b].filter((x): x is PendingVersion => !!x);
  const resolvedIds = [...new Set(sources.flatMap((x) => x.resolvedIds ?? []))].sort();
  const records = mergeVersions(scope, sources.flatMap((x) => [x, ...(x.conflicts ?? [])])
    .filter((x) => !x.resolved)
    .map((x) => ({ id: x.id, content: x.content, date: x.savedAt ?? "" })))
    .filter((x) => !resolvedIds.includes(x.id ?? ""));
  const winner = records.at(-1);
  if (!winner) {
    const latest = [...sources].sort((x, y) => timestamp(x.savedAt) - timestamp(y.savedAt)).at(-1);
    return { id: latest?.id, content: latest?.content ?? "", savedAt: latest?.savedAt ?? "", resolved: true, resolvedIds };
  }
  return { id: winner.id, content: winner.content, savedAt: winner.date, resolvedIds,
    conflicts: records.slice(0, -1).map((x) => ({ id: x.id, content: x.content, savedAt: x.date })) };
}