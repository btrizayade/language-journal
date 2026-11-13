<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Story content (journals, episodes, vocab, culture notes, prompts) lives as static data in src/lib/content.ts — it's predefined and consistent, not generated.
- Learner data (entries with revisions, saved vocab, progress) goes through src/lib/store.ts; editing an entry pushes the prior text into `revisions` so originals are never lost.
- Interface text lives in src/lib/i18n (pt.ts is the typed base, other locales must match its keys; pt-BR is the fallback); story text in content.ts is never translated, and explanations fall back to Portuguese when no localized version exists.
- New interface text for later features goes in src/lib/i18n/extra.ts as one row per key with all five locales, so a missing translation is a type error; reading/display preferences live in src/lib/reading.ts and are applied as classes/CSS variables on <html>.
- Explanatory story text (summaries, character bios, vocab meanings, grammar, culture, activity instructions) is translated in src/lib/content-l10n/<locale>.ts, index-aligned with content.ts, and applied via localizeJournal/useLocalizedJournal(s); content.ts keeps the pt-BR originals and story text is never translated, so a missing piece falls back to pt-BR and flags it.
- Signed-in learner data syncs through src/lib/sync.ts: store.ts stays the in-memory source; entry/state writes read-merge and compare-and-swap using existing updated_at fields, retrying conflicts under caller RLS. Guest data is only copied into an account by consent; account loading always preserves that account's local edits.
- Writing editors are keyed by account/journal/episode and flush captured dirty edits on unmount or page hiding; empty existing drafts are explicit records, not absence, so navigation and clearing cannot resurrect old text.
- Revision and pending identities live in existing JSON via src/lib/versions.ts; merge histories independently of current text, retain conflicting versions, and persist resolution IDs to prevent stale pending records from resurrecting.
- Local persistence failures retain memory and expose failure/retry; a local-save acknowledgement never implies successful cloud synchronization.
- Enchanted-library visual system: palette/shadow/font tokens and scrapbook utilities (paper-card, ruled-paper, lift, animate-*) live in src/styles.css; reusable scrapbook pieces in src/components/ui/scrapbook.tsx — reuse them instead of one-off decoration so the look stays consistent.
- Decorative magical illustrations live in src/assets/magical as optimized transparent WebP with a catalog in src/components/decorations; pages compose <Decoration>/<SparkleField>/<IllustratedBoundary> instead of one-off animated images, keeping reserved content-free accents, motion, a11y and reduced-motion consistent.
- Pointer/scroll interactions live in src/components/interactions (useInteractiveScene, useTilt, useMagnetic, Reveal, ReadingProgress, SparkleBurst); they write CSS variables via rAF (no React state per move) and activate only on fine-pointer devices without reduced motion — reuse them instead of per-page animation logic.
- Topbar scroll appearance updates a DOM attribute only when crossing its threshold; page scrollbar styling targets html on fine-pointer desktops so editor scrolling and mobile native behavior remain independent.
- Learning objectives and comprehension answer keys are predefined in src/lib/learning.ts; localized explanations use five-locale tuples so story text stays in its target language.
- Episode completion and assessment histories use separate user_state JSON fields mirrored by store/sync/merge; saving writing cannot implicitly complete a lesson, and legacy completion is backfilled without losing prior progress.
- Onboarding dismissal uses existing synced preferences; generated static recordings use CDN asset pointers referenced by predefined episode content, with measured durations rather than invented media URLs.
- Silent episode illustrations use video-only stream-copy CDN assets and the existing VideoPlayer with enforced muting and audio-free controls, preventing embedded audio from being exposed.
