/** Localized explanatory text for one journal. Arrays are index-aligned with content.ts. */
export interface EpisodeL10n {
  intro: string;
  context: string;
  vocab: string[];
  expr: string[];
  grammar: [title: string, explanation: string][];
  culture: [title: string, text: string][];
  prompt: [title: string, instructions: string];
}
export interface JournalL10n {
  tagline: string;
  synopsis: string;
  setting: string;
  culturalContext: string;
  characters: [role: string, description: string][];
  episodes: Record<string, EpisodeL10n>;
}
export type ContentL10n = Record<string, JournalL10n>;
