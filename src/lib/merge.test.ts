import { describe, expect, it } from "vitest";
import { mergeStates } from "./merge";
import { emptyState, normalizeVocab, type Entry, type State } from "./store";

const entry = (p: Partial<Entry>): Entry => ({ id: "e1", journalId: "j", episodeId: "ep1", createdAt: "2026-01-01", updatedAt: "2026-01-01", content: "a", status: "draft", revisions: [], ...p });
const st = (p: Partial<State>): State => ({ ...emptyState, ...p });

describe("guest data migration", () => {
  it("adds local entries the account doesn't have", () => {
    const m = mergeStates(st({ entries: [entry({ id: "c" })] }), st({ entries: [entry({ id: "l" })] }));
    expect(m.entries.map((e) => e.id).sort()).toEqual(["c", "l"]);
  });
  it("keeps both versions when the same entry differs: newer stays, older becomes a revision", () => {
    const cloud = st({ entries: [entry({ content: "cloud text", updatedAt: "2026-03-01" })] });
    const local = st({ entries: [entry({ content: "old local text", updatedAt: "2026-02-01" })] });
    const [e] = mergeStates(cloud, local).entries;
    expect(e!.content).toBe("cloud text");
    expect(e!.revisions.map((r) => r.content)).toContain("old local text");
  });
  it("never duplicates a word saved in both places", () => {
    const v = normalizeVocab({ journalId: "camille", term: "la lettre", languageCode: "fr", translation: "a carta" });
    const m = mergeStates(st({ vocab: [v] }), st({ vocab: [{ ...v }] }));
    expect(m.vocab).toHaveLength(1);
  });
  it("does not replace the account's word meaning with the older local one", () => {
    const v = normalizeVocab({ journalId: "camille", term: "la lettre", languageCode: "fr", translation: "a carta" });
    const m = mergeStates(st({ vocab: [{ ...v, translation: "carta (nova)" }] }), st({ vocab: [v] }));
    expect(m.vocab[0]!.translation).toBe("carta (nova)");
  });
  it("combines bookmarks and opened episodes from both", () => {
    const m = mergeStates(st({ bookmarks: { "j/1": "x" }, opened: { j: ["1"] } }), st({ bookmarks: { "j/2": "y" }, opened: { j: ["2"] } }));
    expect(Object.keys(m.bookmarks).sort()).toEqual(["j/1", "j/2"]);
    expect(m.opened.j!.sort()).toEqual(["1", "2"]);
  });
  it("a completed episode stays completed after merging", () => {
    const m = mergeStates(st({ entries: [entry({ status: "draft" })] }), st({ entries: [entry({ status: "complete" })] }));
    expect(m.entries[0]!.status).toBe("complete");
  });
});
