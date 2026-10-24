# L14 vocabulary practice inventory

Reviewed 2026-10-24. This bank is built from the 25 published `L14-V` vocabulary items already taught in the L14 learning screens. The publisher page and exercise references stay on each catalog item in `supabase/seed/catalog.json` and the source catalog; no source label is rendered in practice. The recognition, Artikel, and spelling questions are original product exercises derived from those items and existing learning images or route diagrams. They are not publisher answer keys.

| Learning group | Target IDs | Count | Practice route |
| --- | --- | ---: | --- |
| Institutionen | `L14-V001`–`L14-V009` | 9 | `/practice/L14/vocabulary/institutions` |
| Plätze und Wege | `L14-V010`–`L14-V018` | 9 | `/practice/L14/vocabulary/places` |
| Wegbeschreibung | `L14-V019`–`L14-V024`, `L14-V026` | 7 | `/practice/L14/vocabulary/directions` |

All 25 items have a stable recognition question ID (`<item ID>-meaning`) and spelling question ID (`<item ID>-spelling`). The 18 nouns also have a singular Artikel question (`<item ID>-article`), giving 68 generated question variants. One target may appear only once in a round. The first guided route and a manual topic route use up to five eligible targets per topic; the daily route uses up to ten across groups. The bank can draw on all eligible words over repeated rounds, so a five-question cap does not discard the remaining words.

Recognition shows the existing picture for place nouns or the direction diagram used in learning. Options are distinct German words; `das Zentrum` and `die Stadtmitte` never appear as distractors for each other because both can describe the city center. The Artikel task shows a noun without its article and asks for `der`, `die`, or `das`. The spelling task asks for the German word from its Thai meaning and a first-letter cue; the checked form excludes the article and preserves the German spelling. After checking, feedback gives the German answer and Thai meaning.

Eligibility is the union of completed image pairs, completed direction pairs, and recorded ItemExposure for the same L14 target. The tester control that marks items learned creates exposure evidence but does not mark interactive pairs complete. Both ordinary and test accounts see only targets with learning evidence. A saved queue containing an unlearned target is blocked until the target is learned. Draft answers, first checked answers, position, completion, and prior rounds are stored under `deutsch-trainer-vocabulary-practice-v1-L14` in the account's `learner_lesson_states`; pending writes remain in the existing local backup until upload succeeds. Migration `20261024010000_l14_vocabulary_practice_state.sql` adds the key to the database allowlist. The local build enables `NEXT_PUBLIC_L14_VOCABULARY_PRACTICE=true`; a deployed build must apply the migration and set the flag before build.

This bank's practice state differs internally from L13's validated `learner_practice_sessions` question catalog. It supports personalized review from its recorded results but does not claim server-validated scoring, main Progress, mastery, or other lessons' vocabulary readiness.
