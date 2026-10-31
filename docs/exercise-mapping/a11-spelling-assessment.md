# A1.1–A1.2 spelling cues

Scope: all 243 vocabulary spelling targets in L01–L12, basic/daily banks; 669 total canonical question definitions remain unchanged. The 243 `*-a11-spelling` IDs, versions, accepted answers, target IDs and server grading remain stable. `a11-spelling-cues.json` is the per-target cue inventory. It contains 229 images and 14 context cues. Images reuse Learn's asset resolver, family aliases and published L02 profession concepts. Country flags and month-number calendars are code-authored vector assets; no new external source material is introduced. Provenance stays in project metadata.

## Assessment bindings

| Targets | Response and subskill | Difficulty and assistance | Grading |
| --- | --- | --- | --- |
| Every `cues` key in `a11-spelling-cues.json` | Existing itemId → `itemId-a11-spelling`, `vocabulary_spelling` | Level 2: produce the taught written form; image or short context, supplied Artikel for nouns, optional Thai meaning | Existing normalized accepted spelling variants; supplied Artikel is not gender-recall evidence |
| L02 profession targets | Same spelling binding | Shared male/female scene plus requested gender; avoids two competing forms in one picture | Original masculine/feminine answer forms |
| L12 months V170–V181 | Same spelling binding | Numbered calendar instead of season scenery or written month name | Original month spelling |
| 14 context targets listed in inventory | Same spelling binding | Relationship description or verb context when an image would be ambiguous; infinitive instructions where needed | Existing target-specific forms; no new grammar score |

## Evidence and next task

Learn → item_exposures or lesson image state → existing learned-target eligibility in A11VocabularyPractice → response scored by preview grader → sync_practice_session → canonical server validator → learner_practice_sessions.state.items[].attempt. New attempts store `spellingCueMode` (`image`/`context`), `translationUsed`, null confidence, first response and submission time. The item-level help flag persists before submission and across resume; feedback does not introduce assistance after grading.

`parsePracticeHistory` distinguishes help=true from help=false for new cue-tagged responses; older A11 spelling attempts without cue mode remain assistance unknown unless help is explicitly recorded. Historical answers are never rewritten as independent picture recall. BANK-level cue metadata lets unfinished historical rounds use current pictures without changing stored question IDs or first answers.

The existing shared daily selector prioritizes incorrect or assisted target/subskill evidence. This change preserves that selection and stable queues. It does not introduce new mastery thresholds, promotion/demotion, or a complete learner ability model. Picture-to-word spelling does not certify separate meaning, Artikel, or contextual production competence. Context-based and image-based results carry different modes in account history; the current selector still aggregates them under spelling and does not estimate separate image/context ability.

## Checks and release

- Generator asserts every target has a reviewed cue, verifies every referenced image file, and excludes SVGs containing the target spelling in visible text.
- Mobile browser check covers all 486 spelling presentations across 24 banks, with help/reload/first-answer checks per bank.
- Database regression checks first-answer grading and retention of both help=true and help=false plus cue mode.
- Deployment is recorded separately from local checks; this document does not assert learner-account production verification.
