# L14 vocabulary practice inventory

Reviewed 2026-10-26. This bank is built from the 25 published `L14-V` vocabulary items already taught in the L14 learning screens. The publisher page and exercise references stay on each catalog item in `supabase/seed/catalog.json` and the source catalog; no source label is rendered in practice. The recognition, Artikel, spelling, and context questions are original product exercises derived from those items and existing learning images or route diagrams. They are not publisher answer keys. The 25 newly authored German situations and Thai translations live in `src/lib/l14-vocabulary-context-bank.ts`; each response is tied to one taught target and three taught choices.

| Learning group | Target IDs | Count | Practice route |
| --- | --- | ---: | --- |
| Institutionen | `L14-V001`–`L14-V009` | 9 | `/practice/L14/vocabulary/institutions` |
| Plätze und Wege | `L14-V010`–`L14-V018` | 9 | `/practice/L14/vocabulary/places` |
| Wegbeschreibung | `L14-V019`–`L14-V024`, `L14-V026` | 7 | `/practice/L14/vocabulary/directions` |

All 25 items have a stable recognition question ID (`<item ID>-meaning`) and spelling question ID (`<item ID>-spelling`). The 18 nouns also have a singular Artikel question (`<item ID>-article`), giving 68 original question variants. Each of the 25 items now has two context variants (`<item ID>-context-supported` and `<item ID>-context`), for 118 variants total. The context route selects up to 15 eligible targets, one response per target, and requires the target and both distractors to have learning evidence. The guided and manual topic routes use up to five eligible targets per topic; the daily route uses up to ten across groups. The bank can draw on all eligible words over repeated rounds, so a five-question cap does not discard the remaining words.

Recognition shows the existing picture for place nouns or the direction diagram used in learning. Options are distinct German words; `das Zentrum` and `die Stadtmitte` never appear as distractors for each other because both can describe the city center. The Artikel task shows a noun without its article and asks for `der`, `die`, or `das`. The spelling task asks for the German word from its Thai meaning and a first-letter cue; the checked form excludes the article and preserves the German spelling. After checking, feedback gives the German answer and Thai meaning.

Eligibility is the union of completed image pairs, completed direction pairs, and recorded ItemExposure for the same L14 target. The tester control that marks items learned creates exposure evidence but does not mark interactive pairs complete. Both ordinary and test accounts see only targets with learning evidence. A saved queue containing an unlearned target is blocked until the target is learned. Draft answers, first checked answers, position, completion, and prior rounds are stored under `deutsch-trainer-vocabulary-practice-v1-L14` in the account's `learner_lesson_states`; pending writes remain in the existing local backup until upload succeeds. Migration `20261024010000_l14_vocabulary_practice_state.sql` adds the key to the database allowlist. The local build enables `NEXT_PUBLIC_L14_VOCABULARY_PRACTICE=true`; a deployed build must apply the migration and set the flag before build.

## Assessment plan and difficulty rationale

| Target and subskill | Question IDs / response | Difficulty and assistance | What the first answer shows |
| --- | --- | --- | --- |
| Each `L14-V` item · `vocabulary_meaning` | `<item ID>-meaning` · one answer | 1 · familiar image or route diagram, three visible German choices | Recognition of the taught word; supplied Artikel in the options does not demonstrate gender recall. |
| Each singular noun · `vocabulary_article` | `<item ID>-article` · one answer | 2 · bare noun and der/die/das choices; target gender and dot hidden until checking | Independent choice of singular Artikel. |
| Each `L14-V` item · `vocabulary_spelling` | `<item ID>-spelling` · one answer | 2 · Thai meaning and first letter; nouns show supplied Artikel beside the input | Noun-only spelling or spelling of a direction phrase; supplied Artikel is assistance. |
| Each `L14-V` item · `vocabulary_context` | `<item ID>-context-supported` · one answer | 2 · German situation, visible Thai translation and three German choices | Supported choice of a suitable word in context. |
| Each `L14-V` item · `vocabulary_context` | `<item ID>-context` · one answer | 3 · German situation and three choices; Thai translation can be requested | Choice in context with less language support; using the translation is recorded. |

The context situations use the published meanings and German phrases as the answer key. `das Zentrum` and `die Stadtmitte` are never offered against one another. Every context question lists the target and both distractors as required learned IDs. All answers are checked against one canonical option; the system does not infer that a wrong context choice also proves weak Artikel or spelling.

The shared run record still has version 1 so old rounds, drafts, and first answers stay readable. Newly checked answers add `evidence` containing target ID, subskill, difficulty, task version, assistance available and used, selection reason, and policy version `l14-vocab-2`. An optional translation request is saved with the draft and included in assistance used; a translated answer is never treated as an independent German-only result. Older answers have no such snapshot; they can guide review but cannot count as independent evidence for moving from the supported to the less supported context variant. Account persistence and pending-write recovery use the same lesson-state key above.

## Current selection policy

The guided and topic routes start with recognition for unmeasured words. For later daily rounds, an incorrect subskill is selected again; otherwise a subskill without an answer is tried before older successful work. Context is offered in daily rounds once the basic subskills for that target have been attempted. The optional context route selects eligible targets with recent errors or missing context evidence first. It begins with the translated situation. Two correct supported context answers in distinct runs permit a less supported probe; a wrong probe returns to the translated variant. These are provisional product rules, not a mastery threshold. Learners can still choose a topic directly. The entry recommendation reads the same stored run state, and only a round with a checked answer is offered as a resume recommendation.

| Data link | Implementation and status |
| --- | --- |
| Learning → target eligibility | Image matches, direction pairs, and ItemExposure in `l14VocabularyLearnedIds`; implemented. |
| Response → target/subskill | `questionBank` and response-specific `evidence` on newly checked answers; implemented. |
| First response → account | `learner_lesson_states` plus local pending backup; implemented. Legacy first answers remain unchanged. |
| Evidence → next activity | `selectQuestions` reads each target's subskill history and context assistance level; implemented with provisional policy above. |
| Shared recommendation | `recommendL14VocabularyPractice` uses the same run state for the vocabulary entry and global practice recommendation. |

The account state is not server-validated against a private question catalog like L13. The current basic recognition options can still include a distractor that the learner has not studied; context options require all three learned IDs. Neither the new difficulty labels nor a single correct answer constitutes a mastery judgment. Results remain outside main Progress.
