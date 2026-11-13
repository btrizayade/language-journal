import { beforeEach, describe, expect, it, vi } from "vitest";
import { autosaveIn, emptyState, getState, GUEST_KEY, normalizeState, persistEntry, retryLocalPersistence, saveEntry, swapState, type Entry, type State } from "./store";
import { mergeStates } from "./merge";
const st = (entries: Entry[] = []): State => ({ ...emptyState, entries });
const entry = (text = "current", date = "2026-01-02"): Entry => ({ id: "e", journalId: "j", episodeId: "1", content: text, status: "draft", revisions: [], createdAt: "2026-01-01", updatedAt: date });
beforeEach(() => { vi.restoreAllMocks(); localStorage.clear(); swapState(st(), GUEST_KEY); });
describe("revision integrity", () => {
  it("merges histories independently of equal current text", () => {
    const a = { ...entry(), revisions: [{ id: "a", content: "original", date: "2026-01-01" }] };
    const b = { ...entry(), revisions: [{ id: "b", content: "other", date: "2026-01-02" }] };
    expect(mergeStates(st([a]), st([b])).entries[0]?.revisions.map((r) => r.id)).toEqual(["a", "b"]);
  });
  it("preserves histories and losing current content during concurrent changes", () => {
    const a = { ...entry("a"), revisions: [{ id: "a", content: "old a", date: "2026-01-01" }] };
    const b = { ...entry("b"), revisions: [{ id: "b", content: "old b", date: "2026-01-01" }] };
    const result = mergeStates(st([a]), st([b]));
    expect(result).toEqual(mergeStates(st([b]), st([a])));
    expect(result.entries[0]?.revisions.map((r) => r.content).sort()).toEqual(["a", "old a", "old b"]);
  });
  it("deduplicates identical records, not repeated text at distinct times", () => {
    const a = { ...entry(), revisions: [{ id: "a", content: "same", date: "2026-01-01" }, { id: "b", content: "same", date: "2026-01-02" }] };
    expect(mergeStates(st([a]), st([a])).entries[0]?.revisions).toHaveLength(2);
  });
  it("keeps a source history when the other history is empty and upgrades legacy IDs", () => {
    const a = { ...entry(), revisions: [{ content: "legacy", date: "2026-01-01" }] };
    const r = mergeStates(st([a]), st([entry()]));
    expect(r.entries[0]?.revisions).toHaveLength(1);
    expect(normalizeState(r).entries[0]?.revisions[0]?.id).toBe(r.entries[0]?.revisions[0]?.id);
  });
});
describe("explicit empty drafts and scoped writes", () => {
  it("persists an intentionally empty existing draft across reload and merge", () => {
    const a = entry("original"); const cleared = autosaveIn(st([a]), "j", "1", "", "e").state;
    localStorage.setItem(GUEST_KEY, JSON.stringify(cleared));
    const restored = normalizeState(JSON.parse(localStorage.getItem(GUEST_KEY) ?? "{}"));
    expect(restored.entries[0]?.content).toBe(""); expect(restored.entries[0]?.clearedAt).toBeTruthy();
    expect(mergeStates(st([a]), restored).entries[0]?.content).toBe("");
    expect(autosaveIn(st(), "j", "1", "").state.entries).toHaveLength(0);
  });
  it("never edits another episode even when given its ID", () => {
    const r = autosaveIn(st([entry()]), "j", "2", "new episode", "e");
    expect(r.state.entries.find((e) => e.id === "e")?.content).toBe("current");
    expect(r.state.entries.find((e) => e.episodeId === "2")?.content).toBe("new episode");
  });
  it("retains recoverable memory and reports quota failure instead of success", () => {
    const mock = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("full", "QuotaExceededError"); });
    expect(() => persistEntry("j", "1", "recoverable", "draft")).toThrow();
    expect(getState().entries[0]?.content).toBe("recoverable"); mock.mockRestore();
    expect(retryLocalPersistence()).toBe(true);
    expect(JSON.parse(localStorage.getItem(GUEST_KEY) ?? "{}").entries[0].content).toBe("recoverable");
  });
});
describe("pending conflict resolution", () => {
  for (const [name, cloudDate, localDate, winner] of [
    ["newer local", "2026-01-01", "2026-01-02", "local"],
    ["newer cloud", "2026-01-02", "2026-01-01", "cloud"],
    ["identical times", "2026-01-01", "2026-01-01", "local"],
    ["missing times", "", "", "local"],
  ]) it(name ?? "conflict", () => {
    const a = { ...st(), pending: { e: { id: "a", content: "cloud", savedAt: cloudDate ?? "" } } };
    const b = { ...st(), pending: { e: { id: "z", content: "local", savedAt: localDate ?? "" } } };
    const r = mergeStates(a, b); expect(r.pending["e"]?.content).toBe(winner);
    expect([r.pending["e"]?.content, ...r.pending["e"]?.conflicts?.map((x) => x.content) ?? []].sort()).toEqual(["cloud", "local"]);
    expect(r.pending).toEqual(mergeStates(b, a).pending);
  });
  it("saving a pending conflict keeps the losing text in accessible revisions", () => {
    const a = saveEntry(st(), "j", "1", "final", "complete");
    swapState({ ...a.state, pending: { [a.entry.id]: { id: "p", content: "new", savedAt: "2026-01-03", conflicts: [{ id: "c", content: "other", savedAt: "2026-01-02" }] } } }, GUEST_KEY);
    const saved = persistEntry("j", "1", "new", "complete", a.entry.id);
    expect(saved.revisions.map((r) => r.content)).toContain("other");
    expect(getState().pending[a.entry.id]?.resolved).toBe(true);
  });
  it("resolved pending IDs cannot resurrect after merging an older device", () => {
    const a = saveEntry(st(), "j", "1", "final", "complete");
    const stale = { ...a.state, pending: { [a.entry.id]: { id: "p", content: "new", savedAt: "2026-01-03" } } };
    swapState(stale, GUEST_KEY); persistEntry("j", "1", "new", "complete", a.entry.id);
    expect(mergeStates(getState(), stale).pending[a.entry.id]?.resolved).toBe(true);
  });
  it("a newer empty draft is not reclassified as a final entry by an old device", () => {
    const old = { ...entry("final", "2026-01-01"), status: "complete" as const };
    const newer = { ...entry("", "2026-01-02"), clearedAt: "2026-01-02" };
    const r = mergeStates(st([old]), st([newer])).entries[0];
    expect(r?.content).toBe(""); expect(r?.status).toBe("draft");
    expect(r?.revisions.map((v) => v.content)).toContain("final");
  });
});