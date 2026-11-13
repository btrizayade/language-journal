import { describe, expect, it } from "vitest";
import { journals } from "./content";
import { lessons, checkAnswers, lessonTiming } from "./learning";

describe("predefined episode practice", () => {
  for (const episode of journals.flatMap((j) => j.episodes)) {
    it(`${episode.id} contains four grounded activities with valid answer keys`, () => {
      const lesson = lessons[episode.id];
      expect(lesson?.questions).toHaveLength(4);
      if (!lesson) throw new Error("Missing lesson");
      expect(checkAnswers(lesson, lesson.questions.map((q) => q.answer))).toEqual([true, true, true, true]);
      expect(checkAnswers(lesson, lesson.questions.map(() => []))).toEqual([false, false, false, false]);
      for (const q of lesson.questions) expect(q.answer.every((n) => n >= 0 && n < q.options.length)).toBe(true);
    });
  }
  it("derives reading time from words and keeps media duration separate", () => {
    const e = journals[0]?.episodes[0];
    if (!e) throw new Error("Missing episode");
    expect(lessonTiming(e, 1).reading).toBe((e.body ?? []).join(" ").trim().split(/\s+/).length);
    expect(lessonTiming({ ...e, mediaSeconds: 61 }).total).toBe(2 + lessonTiming(e).practice);
  });
});