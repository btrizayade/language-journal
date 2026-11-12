import { describe, it, expect } from "vitest";
import { saveEntry, completedEpisodes, type State } from "./store";

const empty: State = { entries: [], vocab: [], opened: {}, lastVisit: {} };

describe("writing entries", () => {
  it("keeps the original text as a revision when an entry is edited", () => {
    const a = saveEntry(empty, "j", "e1", "Premier texte", "complete");
    const b = saveEntry(a.state, "j", "e1", "Texte révisé", "complete", a.entry.id);
    expect(b.entry.content).toBe("Texte révisé");
    expect(b.entry.revisions.map((r) => r.content)).toEqual(["Premier texte"]);
    expect(b.state.entries).toHaveLength(1);
  });
  it("counts an episode complete only when its entry is marked complete", () => {
    const a = saveEntry(empty, "j", "e1", "brouillon", "draft");
    expect(completedEpisodes(a.state, "j").has("e1")).toBe(false);
    const b = saveEntry(a.state, "j", "e1", "fini", "complete", a.entry.id);
    expect(completedEpisodes(b.state, "j").has("e1")).toBe(true);
  });
});
