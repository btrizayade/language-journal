import { describe, it, expect } from "vitest";
import { saveEntry, completedEpisodes, completeEpisodeIn, saveAssessmentIn, normalizeState, toggleVocabIn, scheduleReview, autosaveIn, addPassageIn, normalizeVocab } from "./store";

import { emptyState as empty } from "./store";

describe("writing entries", () => {
  it("keeps the original text as a revision when an entry is edited", () => {
    const a = saveEntry(empty, "j", "e1", "Premier texte", "complete");
    const b = saveEntry(a.state, "j", "e1", "Texte révisé", "complete", a.entry.id);
    expect(b.entry.content).toBe("Texte révisé");
    expect(b.entry.revisions.map((r) => r.content)).toEqual(["Premier texte"]);
    expect(b.state.entries).toHaveLength(1);
  });
  it("saving either a draft or finished entry does not complete the episode", () => {
    const a = saveEntry(empty, "j", "e1", "brouillon", "draft");
    expect(completedEpisodes(a.state, "j").has("e1")).toBe(false);
    const b = saveEntry(a.state, "j", "e1", "fini", "complete", a.entry.id);
    expect(completedEpisodes(b.state, "j").has("e1")).toBe(false);
  });
  it("the explicit completion action marks an episode with a saved final entry", () => {
    const a = saveEntry(empty, "j", "e1", "fini", "complete");
    expect(completedEpisodes(completeEpisodeIn(a.state, "j", "e1"), "j").has("e1")).toBe(true);
  });
  it("cannot complete an episode with only a draft", () => {
    const a = saveEntry(empty, "j", "e1", "brouillon", "draft");
    expect(completeEpisodeIn(a.state, "j", "e1").completed).toEqual({});
  });
  it("assessment completion never completes the episode", () => {
    const s = saveAssessmentIn(empty, "j/e1", { id: "attempt", at: "2026-11-13", answers: [[0]], correct: 1, total: 1 });
    expect(s.assessments["j/e1"]).toHaveLength(1);
    expect(completedEpisodes(s, "j").size).toBe(0);
  });
  it("preserves completed progress in legacy browser copies", () => {
    const a = saveEntry(empty, "j", "e1", "fini", "complete");
    const { completed: _, ...legacy } = a.state;
    expect(completedEpisodes(normalizeState(legacy), "j").has("e1")).toBe(true);
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

import { episodeStatus as st, type State } from "./store";
describe("episode status", () => {
  it("opening and saving remain pending until explicit completion", () => {
    let s: State = { ...empty, opened: { j: ["e"] } };
    expect(st(empty, "j", "e")).toBe("notStarted");
    expect(st(s, "j", "e")).toBe("inProgress");
    s = saveEntry(s, "j", "e", "Bonjour", "draft").state;
    expect(st(s, "j", "e")).toBe("writingPending");
    s = saveEntry(s, "j", "e", "Bonjour", "complete", s.entries[0]!.id).state;
    expect(st(s, "j", "e")).toBe("writingPending");
    s = completeEpisodeIn(s, "j", "e");
    expect(st(s, "j", "e")).toBe("completed");
  });
});
