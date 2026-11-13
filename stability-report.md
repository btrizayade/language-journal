# Final stability and data integrity pass

## Corrections delivered

- Editor mounted identity includes account, journal and episode. Dirty text and entry ID are captured; navigation/unmount/page hiding flush the original episode before its editor is discarded. Store helpers reject an ID belonging to another episode.
- Revision merge is independent of current content, unions unique identities and orders by timestamps with deterministic ties. Legacy records receive deterministic IDs without rewriting narratives or changing the schema.
- An existing draft emptied intentionally remains an explicit empty entry with a local clearing marker; its empty content and updated timestamp persist through the existing cloud entry fields. New untouched empty episodes do not create entries.
- Pending merges compare timestamps, retain competing versions, expose them within the existing editor and retain them in history upon final save. Resolution IDs prevent old pending records from reappearing after save.
- Local storage/quota failures report failure, retain recoverable memory and offer retry. Local acknowledgement and cloud synchronization status are separate. Recovery does not duplicate drafts.
- Account loading always merges the account's cached edits, blocks cloud pushes until successful loading and retries failed loading without replacing valid cached work. Guest data is not automatically imported.
- Writing and learning-state cloud writes read the latest row, merge records and update only if its existing updated_at still matches; collisions retry. Attempts deduplicate by ID and completion records are unioned. No schema, authentication or RLS change was required.
- Minhas entradas now uses existing localized content and correct explanatory lang. All five languages distinguish final writing from episode completion and explain persisted pending changes. Save-time formatting follows interface locale; French writing controls match the instructions' treatment.

## Modified files

- src/components/WritingStudio.tsx
- src/lib/store.ts
- src/lib/merge.ts
- src/lib/sync.ts
- src/lib/versions.ts (small JSON identity/merge helper)
- src/routes/entradas.tsx
- src/lib/i18n/extra.ts
- src/lib/i18n/fr.ts
- AGENTS.md, roadmap.md, stability-report.md
- Regression files: src/components/WritingStudio.test.tsx, src/lib/stability.test.ts, src/lib/sync.test.ts

## Evidence

- Existing suite plus 23 added regressions: **62 tests passed across nine files**.
- Regressions cover rapid episode switch, unmount, page hiding, emptied draft across reload, quota failure/retry, same-content distinct histories, distinct/concurrent content, duplicate histories, empty history, legacy IDs, newer local/cloud pending edits, tied/missing timestamps, retained conflicts, resolution tombstones, scoped entry IDs, conditional cloud-write collision, network failure and account-loading failure/retry.
- Actual preview, disposable guest browser: rapid navigation flushed original text without leakage; cleared draft remained empty after reload; final entry and pending revision survived reload; previous revision kept its ID; explicit completion persisted; English instructions rendered in Minhas entradas; page navigation preserved the latest typing. No page exceptions in this run. English entries screenshot inspected.
- Latest automatic compilation diagnostics: **build OK**, 2026-11-13 15:55:26 UTC. A separate manual production-build command was **not executed**: the environment runs project compilation automatically and prohibits manual project builds. This result is not represented as a separately verified published production deployment.
- No user password, existing authenticated account or live learner records used. No new media, narratives, pages or learning mechanics added.

## Actually tested synchronization scenarios

Test doubles exercised conditional-write collision with another device adding an assessment, preservation of remote completions, rejected network writes and pre-login cached-account work surviving failed loading then recovery. Pure-state tests exercised revision/pending conflicts and deletion restoration. These are controlled simulations, **not hosted authenticated cross-device proof**.

## Unverified and exact manual checks

Use a disposable account or an explicitly authorized isolated test environment; do not use a personal learner's existing records.

1. Sign into the same disposable account in two independent browsers A and B. Wait for synchronization in both.
2. In A, save a draft, then clear all text and wait for local save and cloud sync. Reload A and B: draft remains empty, with no old text restored.
3. Save a final entry in A. Open it in B, disconnect B, edit its text and wait for local persistence. In A, edit the same entry and sync. Reconnect B: both texts remain available, selected text is deterministic, and prior history is retained.
4. Repeat with pending revisions to a final entry. Verify competing pending versions are accessible; save the chosen final text and verify losing versions in history. Reload both browsers: resolved pending records must not resurrect.
5. Starting from the same snapshot, answer different assessments in A and B and complete different episodes. Sync both, including overlapping writes. Reload: all attempt IDs occur once and both completion records remain.
6. Disconnect A, edit an entry, close/reopen the app while disconnected, then reconnect. Cached work must survive account loading and reach B after synchronization.
7. Simulate a cloud request failure and a storage quota failure separately. The UI must not report the failing layer as saved; recovery/retry retains the latest text without duplicate entries/revisions.
8. In Minhas entradas, repeat explanatory-language inspection with pt-BR/en/fr/de/es, including an explanation language different from the interface. Verify selected-language last-save formatting and final-entry vs episode-complete labels.

## Remaining limitations / risks

- Real authenticated two-browser flow, server timestamp comparison behavior, RLS under concurrent writes, and published production flow remain unverified without an authorized disposable environment.
- Client timestamps can be skewed across devices. Ties and missing times resolve deterministically and conflicting texts are preserved, but the automatically selected text is not guaranteed to reflect real-world chronology.
- If all durable storage is unavailable and the browser is killed, in-memory recovery cannot survive. Failure is displayed; keep the page open until a successful local/cloud save. Browser termination can also prevent network completion; local persistence is the recovery source.
- The conditional-write loop retries five conflicts, then reports sync failure and schedules the existing retry rather than silently replacing data.
- Unrelated vocabulary/bookmark/passage deletion semantics and account-management behavior were not redesigned. This pass does not certify every concurrent operation in those existing features.
- Media, complete pedagogical review and the original Phase 1 remaining work stay untouched.