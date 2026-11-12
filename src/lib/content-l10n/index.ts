import { useMemo } from "react";
import { journals, type Journal } from "@/lib/content";
import { useI18n, type Locale } from "@/lib/i18n";
import type { ContentL10n } from "./types";
import { en } from "./en";
import { fr } from "./fr";
import { de } from "./de";
import { es } from "./es";

/** Explanation translations; pt-BR is the original text in content.ts. */
export const CONTENT_L10N: Partial<Record<Locale, ContentL10n>> = { en, fr, de, es };

export interface Localized { journal: Journal; fallback: boolean; lang: Locale }

/**
 * Returns a copy of the journal with explanatory text in `locale`.
 * Story text (episode titles, body, transcripts, example sentences, prompts in the target language) is never touched.
 * Any missing piece keeps the Portuguese original and flags `fallback`.
 */
export function localizeJournal(j: Journal, locale: Locale): Localized {
  if (locale === "pt-BR") return { journal: j, fallback: false, lang: locale };
  const l = CONTENT_L10N[locale]?.[j.id];
  if (!l) return { journal: j, fallback: true, lang: "pt-BR" };
  let fallback = false;
  const pick = <T,>(v: T | undefined, orig: T): T => { if (v === undefined || v === "") { fallback = true; return orig; } return v; };
  const journal: Journal = {
    ...j,
    tagline: pick(l.tagline, j.tagline),
    synopsis: pick(l.synopsis, j.synopsis),
    setting: pick(l.setting, j.setting),
    culturalContext: pick(l.culturalContext, j.culturalContext),
    characters: j.characters.map((c, i) => ({ ...c, role: pick(l.characters[i]?.[0], c.role), description: pick(l.characters[i]?.[1], c.description) })),
    episodes: j.episodes.map((e) => {
      const le = l.episodes[e.id];
      if (!le) { fallback = true; return e; }
      return {
        ...e,
        intro: pick(le.intro, e.intro),
        context: pick(le.context, e.context),
        vocabulary: e.vocabulary.map((v, i) => ({ ...v, translation: pick(le.vocab[i], v.translation) })),
        expressions: e.expressions.map((x, i) => ({ ...x, meaning: pick(le.expr[i], x.meaning) })),
        grammar: e.grammar.map((g, i) => ({ ...g, title: pick(le.grammar[i]?.[0], g.title), explanation: pick(le.grammar[i]?.[1], g.explanation) })),
        culture: e.culture.map((c, i) => ({ title: pick(le.culture[i]?.[0], c.title), text: pick(le.culture[i]?.[1], c.text) })),
        prompt: { ...e.prompt, title: pick(le.prompt[0], e.prompt.title), instructions: pick(le.prompt[1], e.prompt.instructions) },
      };
    }),
  };
  return { journal, fallback, lang: fallback ? "pt-BR" : locale };
}

/** Journals with explanations in the learner's explanation language. */
export function useLocalizedJournals() {
  const { explanation } = useI18n();
  return useMemo(() => journals.map((j) => localizeJournal(j, explanation)), [explanation]);
}
export function useLocalizedJournal(id: string) {
  const all = useLocalizedJournals();
  return all.find((x) => x.journal.id === id);
}
