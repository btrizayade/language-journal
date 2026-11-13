# Learning experience — first implementation delivery

## Delivered

All six episodes retain their original narratives and now contain two observable learning objectives and four comprehension activities each (24 total). Questions remain in the target language; objectives, instructions and explanatory feedback support Portuguese, English, French, German and Spanish independently of the story language. Activities include multiple choice, true/false, chronological sequencing and grammatical completion. Feedback reveals story evidence only after submission; retrying retains previous attempt history.

| Episode | Practice focus | Media |
| --- | --- | --- |
| La lettre oubliée | Recipient, discovery, event order, negative form | Original reading |
| Le message d'Inès | Customer routine, invitation, sequence, depuis | Generated French recording, 45.36 seconds |
| Samedi au marché | Hélène's shop, destination, dates, être | Video not yet produced; original transcript retained |
| Das alte Foto | Flea market, photo clues, sequence, verb position | Original reading |
| In der Bäckerei | Order, cash payment, third floor, modal infinitive | Video not yet produced; original transcript retained |
| Die Stimme von Herrn Krüger | Family relationships, invitation, unexpected visits, Perfekt | Generated German recording, 48.92 seconds |

Audio recordings were generated from the existing scripts using the configured speech model, compressed to MP3 and externalized to CDN asset pointers. Both loaded and played in Chromium with advancing timestamps, no audio error, functional seeking and 1.25× speed. Native French/German pronunciation and exact spoken fidelity still need a listening review by a qualified speaker; generated recordings are not claimed to have passed that review.

Draft saving, finished-entry saving and episode completion are now separate. Completion is explicit, confirms the learner's intent and requires a saved finished entry; editing remains possible and earlier versions remain in revisions. Already-completed progress is preserved through a database backfill and browser-state normalization. Comprehension never completes an episode.

An additive migration extends the existing private user_state record with completion and assessment JSON fields. Existing grants and account isolation remain unchanged; no new authentication, roles, tables or storage buckets were introduced. Store, sync and merge carry the fields, deduplicate attempt IDs and retain guest/account data.

Reading estimates use original word counts at a configurable default of 90 words/minute; practice estimates use question count and suggested writing length. Available recording durations are used for the main modality rather than adding optional transcript reading to the mandatory total. Headers and journal episode lists use the same calculation. Missing video duration is never fabricated.

First-time library guidance is dismissible using existing synchronized preferences. Vocabulary, notes and writing empty states include clearly identified examples and direct starting actions; filtered empty results provide reset controls. No example creates personal progress. New transcript defaults are hidden; existing reader preferences are preserved.

## Verification

- Regression suite passed before the final merge-history test addition (38 tests); final suite result recorded in the closing checks.
- Preview build logs reported success after edits; no manual production build was run.
- Guest flow: four correct responses, draft save and reload, finished entry, edited revision, confirmed completion and reload.
- Authenticated flow: same actions, followed by fresh-session read-back and direct Cloud confirmation of one attempt, explicit completion and preserved revision.
- Audio: both recordings loaded, played, sought forward and changed speed.
- Desktop and 390px mobile screenshots inspected; no mobile horizontal overflow in the tested episode; no runtime errors recorded in that run.

## Still pending

This is the first delivery, not completion of the entire supplied brief. Original video scenes and original/translated subtitle tracks have not yet been produced. Sentence timestamps have not been aligned, so transcript highlighting, sentence seeking and sentence replay are deliberately not represented as functional. Full audiovisual playback-to-end checks, linguistic listening review, complete vocabulary gender/plural classification and CEFR review, five-language screen-by-screen inspection, tablet and complete accessibility checks remain outstanding. The integration supports these next steps without replacing missing media with fake URLs or static pictures masquerading as videos.