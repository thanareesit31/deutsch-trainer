# Phase 2 — inventory and gap analysis (2026-10-16)

Scope: visual inspection of relevant activity pages, not a claim to have reviewed every page of either book. Printed and PDF locators below were read from rendered pages. All web prompts are newly authored using MOMENTE L13–14 knowledge. Supplemental A2 grammar is excluded unless already taught in those MOMENTE lessons.

## Exercise inventory

| Book | Printed / PDF | Activity | Instructions and answer mechanism | Primary / secondary | Difficulty* | Existing equivalent / decision |
|---|---|---|---|---|---|---|
| Grammatik aktiv | 48 / 44 | 18/1–2 | Read pictures/context, write definite/indefinite Dativ articles | Grammar / reading, writing | 2 | Cloze exists; no duplicate plugin |
| Grammatik aktiv | 54 / 50 | 21/1–3 | Match question/answer; fill Akk/Dat pronouns in sentences | Grammar / reading, writing | 1–2 | Matching and cloze exist; retain |
| Grammatik aktiv | 58 / 54 | 23/1–2 | Build sentences from picture and word cues | Grammar / writing | 3 | Word order and text response exist; no duplicate |
| Grammatik aktiv | 86 / 82 | 35/1–2 | Inspect spatial scene; write prepositions, in/an/auf | Grammar / visual reading, writing | 2 | Image hotspot and cloze exist; retain |
| Grammatik aktiv | 92 / 88 | 38/1 | Use local-preposition table to complete sentences | Grammar / reading | 2 | Cloze exists; exclude later A2 constructions |
| Wortschatz Training | 33 / 32 | B6/7–8 | Complete letter from bank; fill shared-cell crossword from text clues | Vocabulary / reading, spelling | 2–3 | Single-gap cloze and real picture crossword exist; add multi-gap context, retain crossword |
| Wortschatz Training | 36 / 35 | B7/1–3 | Match collocations, fill colours, categorize in table | Vocabulary / reading | 1–2 | Matching, cloze, categorization exist |
| Wortschatz Training | 37 / 36 | B7/4–5 | Complete market dialogue with bank and initial letters; name shops | Vocabulary / reading, writing | 2 | Add contextual multi-gap bank, no shopping content copied |
| Wortschatz Training | 38 / 37 | B7/6–9 | Complete dialogues, assign speaker roles, find odd word | Vocabulary / phrases, reading | 1–3 | Categorization exists; odd-one-out uses existing choices, no new plugin |
| Wortschatz Training | 39 / 38 | B7/10–12 | Fill dialogue, give possible fillers, form word pairs and sentences | Vocabulary / reading, writing | 2–3 | Existing matching/text response; add shared-bank context |
| Wortschatz Training | 41 / 40 | B8 tip | Construct own horizontal/vertical word search, fill spare cells, exchange | Vocabulary / spelling | 3 | Authoring puzzle is deferred; new learner word search uses horizontal/vertical paths |
| Wortschatz Training | 47 / 46 | B9/1–3 | Dialogue cloze and crossword with verbal clues | Vocabulary / reading, spelling | 2–3 | Crossword exists; no evidence here for picture-clue source |
| Wortschatz Training | 48 / 47 | B9/4–5a | Find verbs in letter grid and write them; match phrases to pictures | Vocabulary / spelling, visual discrimination | 1–2 | Genuine word search missing: ADD; image matching exists |
| Wortschatz Training | 49 / 48 | B9/5b–6 | Write sentences about pictures; fill two dialogues | Vocabulary / writing, reading | 2–3 | Existing text response; add multi-gap bank |
| Wortschatz Training | 61 / 60 | B12/2 | Complete connected dialogues with word banks | Vocabulary / reading, grammar | 2–3 | Add contextual multi-gap bank |
| Wortschatz Training | 62 / 61 | B12/3–5 | Write opposites/units; complete dialogue in correct word forms | Vocabulary / grammar, writing | 2–3 | Matching and text response exist; don't import later housing grammar |

*Difficulty is web adaptation analysis, not a publisher classification. Picture Crossword uses existing user preset; inspected supplemental crosswords have TEXT clues, so no invented picture-crossword attribution.

## Website census and gaps

Before Phase 2: 55 practice sets, 42 pattern IDs, 17 runtime mechanics across seven categories. Actual mechanics: multiple_choice, multi_select, matching, cloze, word_order, letter_slots, crossword, image_hotspot, categorization, true_false_evidence, text_response, audio_mcq, audio_route, recorded_speech, dialogue_builder, map_route, flashcard_recall. Learning topics also provide discovery examples and guided checks. Legacy catalogue outside the new course has vocabulary/image matching, grammar discovery/guided practice, conjugation pairing, and review exercises; these do not supply a real letter-grid search or connected multi-gap bank in L13–14.

VOC-09's old label mentions a word grid, but L13-VOC-SELECT and L14-VOC-SELECT are multi_select. Preserve their IDs, prompts and answers. Add SUP-VOC-SEARCH with a real selectable letter grid. Existing L14-VOC-CROSSWORD remains the picture crossword: actual shared letter cells and picture clues, not MCQ.

The second gap is a connected context with multiple editable blanks and one shared word bank. Old cloze accepts one string per question; the new SUP-VOC-CONTEXT checks all slots and word-bank use together. This is a distinct mechanism, not a collection of renamed multiple choices.

## Additive design

| New set | Pattern / difficulty | Primary | Secondary | MOMENTE content |
|---|---|---|---|---|
| L13-SUP-SEARCH | SUP-VOC-SEARCH / 1 | Vocabulary recognition | Spelling, visual discrimination | city places, p10–11 |
| L14-SUP-SEARCH | SUP-VOC-SEARCH / 1 | Vocabulary recognition | Spelling, visual discrimination | institutions, p14–15 |
| L13-SUP-CONTEXT | SUP-VOC-CONTEXT / 3 | Vocabulary in context | Reading, grammar | city places and gefallen, p10–11 |
| L14-SUP-CONTEXT | SUP-VOC-CONTEXT / 3 | Vocabulary in context | Reading, phrases | institutions and directions, p14–16 |

Each set has two prompts. Word search uses German word bank first, Thai meanings second. Learners select start and end cells with clicks/taps or keyboard; grading checks actual straight paths, not typed keywords. Context uses a shared bank and per-slot input; hints name a start cell or explain a blank, and assisted attempts remain assisted under existing rules. Existing difficulty-2 spelling/picture crossword bridges recognition and contextual use. No new listening/speaking assessment is inferred from these visual activities.

Progress payloads reuse version-1 CourseAttempt and existing account-scoped storage. At the Phase2 conclusion, DB persistence was blocked by the existing allowlist. The subsequent Arbeitsbuch task required Progress integration: a local-only additive constraint migration now resolves the blocker, with old-row/RLS regression tests. Production remains unchanged. The Phase2 content itself extended accepted pattern identifiers without a state-version migration or reset. Existing 42 patterns and 55 sets remain unchanged. Review only new prompts and specific evidence-supported legacy records; pending old records stay pending.


## Existing site code checked

`src/lib/content.ts` also registers flash, de-th, th-de, article, typing, choice, order and dialogue practice modes. `src/lib/guided-learning.ts` registers profession/number/image/pair/pronoun matching, number-word/audio-number conversion, compound pattern, choice, conjugation and sentence completion. Along with the course registry, these provide no real word-search letter-path mechanic and no connected multi-blank shared-bank mechanic. No new generic matching, choice or sentence-order plugin was added.

## Verification status

Source registry after Phase2: 226 records, **33 verified / 193 needs_review**. Newly added records: 4 sets + 8 questions, all verified. Legacy crossword set + question newly verified after actual page/preset review. Remaining old guided checks/sets/questions retain individual-prompt review requirements; VOC-09 specifically retains the label/mechanic mismatch warning. No blanket verification or automatic status upgrade.

Database finding: `learner_lesson_states_lesson_key_check` rejects the preexisting course keys `deutsch-trainer-course-learning-v1-L13` and `...-L14` (Postgres 23514). This was the observed failure before the local allowlist extension. Do not treat serialization unit tests or UI-only browser tests as evidence of successful DB saving. Strict browser tests assert actual API success and re-read persisted rows. Local resolution and verification are documented in `docs/ARBEITSBUCH_L13_L14_ANALYSIS.md`; Production migration still requires authorization.

Tests run locally: 26/26 course, supplemental and metadata unit/regression tests passed. Original 55-set digest passed. Browser UI-only run passed all8prompts, wrong answers, hints, keyboard, 320px overflow checks and original Picture Crossword. Production Webpack build passed (native SWC unavailable, supported WASM fallback used). `tsc --noEmit` is checked separately after final edits. Protected route smoke checks cover L01/L02 lesson entries and L02 pronoun/verb pages; no protected activity files changed. The existing database-driven L02 catalogue test fails on missing `publicverheiratet`, whose image value is in the unchanged migration `20261012030000_l02_familienstand_image_matching.sql`; it is not reported as a passing regression.

Historical Phase2 limit: DB rejection prevented successful saving. The Arbeitsbuch follow-up fixed this locally and the strict browser gate now passes actual persistence. No new listening/speaking/reading/writing-specific formats were added because inspected supplemental mechanics map to existing activities; secondary reading/writing support does not count as mastery of those separate skills. Own-puzzle authoring from printed41/PDF40 is recorded in inventory and deferred. This is a targeted visual review, not a whole-book audit. No deployment or push performed.
