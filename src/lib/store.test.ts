import { describe, it, expect } from "vitest";
import { saveEntry, completedEpisodes, toggleVocabIn, scheduleReview, autosaveIn, addPassageIn, normalizeVocab } from "./store";

import { emptyState as empty } from "./store";

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

const word = { journalId: "j", episodeId: "e1", languageCode: "fr", term: "la carte", translation: "o mapa", example: "" };

describe("vocabulary", () => {
  it("never duplicates a word saved from two journals in the same language", () => {
    const a = toggleVocabIn(empty, word);
    const b = toggleVocabIn(a, { ...word, journalId: "other", term: "La carte " });
    expect(a.vocab).toHaveLength(1);
    expect(b.vocab).toHaveLength(0); // second save toggles the existing item off, not a copy
  });
  it("hard comes back tomorrow, easy waits at least a week", () => {
    const v = normalizeVocab({ ...word, savedAt: "2026-01-01T00:00:00.000Z" });
    const now = new Date("2026-01-01T00:00:00.000Z");
    expect(scheduleReview(v, "hard", now).interval).toBe(1);
    expect(scheduleReview(v, "familiar", now).interval).toBe(3);
    const easy = scheduleReview(v, "easy", now);
    expect(easy.interval).toBe(7);
    expect(easy.status).toBe("learning");
    expect(scheduleReview({ ...v, interval: 7 }, "easy", now).status).toBe("mastered");
  });
});

describe("autosave and passages", () => {
  it("autosave updates a draft in place without adding revisions", () => {
    const a = autosaveIn(empty, "j", "e1", "un");
    const b = autosaveIn(a.state, "j", "e1", "un deux", a.id);
    expect(b.state.entries).toHaveLength(1);
    expect(b.state.entries[0]!.revisions).toHaveLength(0);
    expect(b.state.entries[0]!.status).toBe("draft");
  });
  it("autosave never overwrites a completed entry", () => {
    const a = saveEntry(empty, "j", "e1", "fini", "complete");
    const b = autosaveIn(a.state, "j", "e1", "fini et revu", a.entry.id);
    expect(b.state.entries[0]!.content).toBe("fini");
    expect(b.state.pending[a.entry.id]!.content).toBe("fini et revu");
  });
  it("saving the same passage twice keeps one copy", () => {
    const a = addPassageIn(empty, "j", "e1", "Une phrase.");
    const b = addPassageIn(a.state, "j", "e1", " Une  phrase. ");
    expect(b.state.passages).toHaveLength(1);
  });
});
