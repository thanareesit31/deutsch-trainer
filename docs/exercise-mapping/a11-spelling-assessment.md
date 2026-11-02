# A1.1–A1.2 spelling cues

Scope: all 243 vocabulary spelling targets in L01–L12, basic/daily banks; 669 total canonical question definitions remain unchanged. The 243 `*-a11-spelling` IDs, versions, accepted answers, target IDs and server grading remain stable. `a11-spelling-cues.json` is the per-target cue inventory. It contains 229 images and 14 context cues. Images reuse Learn's asset resolver, family aliases and published L02 profession concepts. Country flags and month-number calendars are code-authored vector assets; no new external source material is introduced. Provenance stays in project metadata.

## Assessment bindings

| Targets | Response and subskill | Difficulty and assistance | Grading |
| --- | --- | --- | --- |
| Every `cues` key in `a11-spelling-cues.json` | Existing itemId → `itemId-a11-spelling`, `vocabulary_spelling` | Level 2: produce the taught written form; image or short context, supplied Artikel for nouns, optional Thai meaning | Existing normalized accepted spelling variants; supplied Artikel is not gender-recall evidence |
| L02 profession targets | Same spelling binding | Single-person view from the corresponding half of Learn's existing scene; picture left, sole editable blank with supplied Artikel/color right; no Thai help or gender instruction | Original masculine/feminine answer forms |
| L12 months V170–V181 | Same spelling binding | Numbered calendar instead of season scenery or written month name | Original month spelling |
| 14 context targets listed in inventory | Same spelling binding | Relationship description or verb context when an image would be ambiguous; infinitive instructions where needed | Existing target-specific forms; no new grammar score |

## Evidence and next task

Learn → item_exposures or lesson image state → existing learned-target eligibility in A11VocabularyPractice → response scored by preview grader → sync_practice_session → canonical server validator → learner_practice_sessions.state.items[].attempt. New attempts store `spellingCueMode` (`image`/`context`), `translationUsed`, null confidence, first response and submission time. The item-level help flag persists before submission and across resume; feedback does not introduce assistance after grading.

`parsePracticeHistory` distinguishes help=true from help=false for new cue-tagged responses; older A11 spelling attempts without cue mode remain assistance unknown unless help is explicitly recorded. Historical answers are never rewritten as independent picture recall. BANK-level cue metadata lets unfinished historical rounds use current pictures without changing stored question IDs or first answers.

The existing shared daily selector prioritizes incorrect or assisted target/subskill evidence. This change preserves that selection and stable queues. It does not introduce new mastery thresholds, promotion/demotion, or a complete learner ability model. Picture-to-word spelling does not certify separate meaning, Artikel, or contextual production competence. Context-based and image-based results carry different modes in account history; the current selector still aggregates them under spelling and does not estimate separate image/context ability.

L02 override, 2026-11-01: all 17 spelling targets use a single-person picture and no translation control. `portrait` identifies the left masculine region or right feminine region of each existing image. The visible regions cover source x=0–46% or x=54–100%; all nine source scenes were visually inspected for subject placement. No raster asset is edited. New responses carry `spellingCuePresentation: single-person-inline`; old help flags and first answers remain intact even though the old hint is no longer rendered. Thai meaning remains available in feedback after submission. The inline input retains the original response ID, local persistence and server grading.

## Checks and release

- Generator asserts every target has a reviewed cue, verifies every referenced image file, and excludes SVGs containing the target spelling in visible text.
- Mobile browser check covers all 486 spelling presentations across 24 banks, with help or L02 picture-only behavior, reload and first-answer checks per bank.
- L02 targeted browser check covers all 17 targets at 390px and 1280px: sole inline input, matching portrait gender, no hints, Enter grading, no overflow, and historical assistance preservation.
- Database regression checks first-answer grading and retention of both help=true and help=false plus cue mode.
- Deployment is recorded separately from local checks; this document does not assert learner-account production verification.

## Shared inline practice presentation, 2026-11-02

All cloze tasks in the shared L01-L18 preview template now use one editable blank in the sentence. Image spelling tasks use a compact image left and the supplied noun prefix plus editable blank right. Thai hint buttons are removed. Context-only tasks retain their authored context. Group headings are removed in the shared template, the separate matching renderer and L14 practice screens. Question IDs, versions, accepted answers, eligibility and grading are preserved.

New preview attempts record responsePresentation=inline-v1 and wordHelpTokens; word help sets translationUsed before the first response. The shared word dictionary derives from existing catalog meanings and reviewed practice-thai-support metadata. Direct vocabulary meaning, spelling and Artikel targets do not expose translations before grading. Historical help flags and first answers remain intact. The new word-help availability changes assistance and must not be treated as independent success when used.

L13 story and riddle word help records response-specific draft and submitted wordHelpTokens; L14 context word help records wordHelpUsed and adds word-meanings to evidence. These changes collect assistance evidence; they do not establish a new adaptive ability model. Unknown dictionary words remain plain text rather than guessed translations. No production deployment is performed.

The L14 phrase flow now also records shared word help in draft progress and first attempts, including shared practice-session serialization. L13 crossword clues bind word help to the individual row. All previews and the React word-help dictionary can be regenerated together using `npm run build:practice-previews`.

Local verification for this update: 104 generated preview files have no unresolved template placeholders. The cross-lesson browser sweep covered 44 banks, 23 inline response examples with draft reload and Enter grading, and word-help evidence in 16 grammar banks. The spelling browser sweep covered all 486 presentations across 24 basic/daily banks. L02 additionally passed all 17 targets on mobile and desktop. The separate phrase matching check preserves pointer selection and attributes word help to its individual response. Canonical database grading passed all 887 L01-L12 definitions. TypeScript, 11 focused unit tests and the Webpack production build passed. These are local checks, not a production account rollout.

## L02 Learn completion count, 2026-11-02

The L02 lesson card now uses the current vocabularyTrackActivities number/profession selectors and the Familienstand image groups to define its denominator. It combines existing account exposures and imageVocabularyIds only for those targets. Retired activity IDs, old exposures, spelling responses and their assessment bindings remain untouched. No exposure or competence evidence is created by computing the card. A read-only check of the affected production account yields 88 learned of 88 current targets; the former exposure-only count was 81 of 99 catalog entries. The regression test verifies the former 82%, corrected 100%, a missing current target yielding 99%, and no evidence yielding 0%.
