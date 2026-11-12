import { describe, it, expect } from "vitest";
import { journals } from "@/lib/content";
import { localizeJournal, CONTENT_L10N } from "./index";

const locales = ["en", "fr", "de", "es"] as const;
describe("explanation translations", () => {
  for (const loc of locales) for (const j of journals) {
    it(`${loc} covers every explanation in ${j.id}`, () => {
      const l = CONTENT_L10N[loc]![j.id]!;
      expect(l.characters).toHaveLength(j.characters.length);
      for (const e of j.episodes) {
        const le = l.episodes[e.id]!;
        expect(le.vocab).toHaveLength(e.vocabulary.length);
        expect(le.expr).toHaveLength(e.expressions.length);
        expect(le.grammar).toHaveLength(e.grammar.length);
        expect(le.culture).toHaveLength(e.culture.length);
      }
      expect(localizeJournal(j, loc).fallback).toBe(false);
    });
  }
  it("keeps original story text and example sentences", () => {
    const j = journals[0]!, o = j.episodes[0]!;
    const e = localizeJournal(j, "en").journal.episodes[0]!;
    expect(e.body).toEqual(o.body);
    expect(e.vocabulary[0]!.example).toBe(o.vocabulary[0]!.example);
    expect(e.vocabulary[0]!.term).toBe("la librairie");
    expect(e.prompt.prompt).toBe(o.prompt.prompt);
    expect(e.vocabulary[0]!.translation).not.toBe(o.vocabulary[0]!.translation);
  });
});
