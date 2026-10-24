# Noun presentation audit

Date: 2026-10-25. Scope: active noun renderers in the current project, not unpublished lessons or a completed adaptive learner model. This is a presentation change; question/response IDs, first answers, drafts, target/subskill bindings and grading remain intact.

| Surface | Change / finding |
| --- | --- |
| Shared display | `NounText` and `NounPrefix` use catalog Artikel and plural metadata with existing ArticleDot colors. Proper names without an Artikel and contextual sentences remain unchanged. |
| Shared learning values and audio labels | Standalone noun values retain Artikel and dot. The month-summary labels and the Dativ table use the same shared palette. Guided noun activities show the shared legend. |
| Image learning, L01–L15 existing routes | Add missing dots outside the original pilot layouts, use plural metadata, preserve each synonym's own Artikel, and show the legend whenever noun entries are present. Existing profession and family-plural boards already provide Artikel/dots. |
| Generic vocabulary practice | Noun prompts, choices, typing hints, flash cards, feedback and result labels use the shared renderer. Correct Artikel targets remain hidden until checking. Legacy generic typing still expects the saved full answer; supplied Artikel is support, not proof of independent gender recall. |
| L13 basic vocabulary | Meaning and feedback keep complete nouns. All noun spelling inputs supply Artikel/dot separately; noun-only accepted answers are unchanged. Artikel tasks have no target color before checking. |
| L13 advanced vocabulary | Dictionary labels in story word banks and feedback, category prompts, construction prefix/feedback, crossword clues/vertical-word prefix/feedback, and standalone picture/riddle/odd options retain Artikel. Story gaps insert the existing word form, preserving case and contractions in the sentence. |
| L14 vocabulary | Meaning options and feedback use complete nouns/dots; spelling supplies Artikel; Artikel choices show their own colors without coloring the unanswered target. Add sticky legend. |
| Review / progress / learning detail | Standalone item labels and displayed plural forms carry the shared presentation. Historical ratings and attempts are preserved. |

## Verification

- `node --import tsx scripts/exercise-mapping/verify-noun-rendering.mjs`: render 267 catalog nouns and 177 plural forms with the correct shared colors; preserve contextual sentences and proper names without an Artikel.
- `node scripts/exercise-mapping/verify-noun-preview.mjs`: drive the generated L13 vocabulary bank in Chrome. Check 41 spelling tasks, 41 meaning tasks and 39 Artikel tasks, including supplied prefix, feedback and absence of target color leaks.
- Live local-account browser check: story, compound building, crossword, category and picture-Artikel renderers; L14 meaning, spelling and Artikel; mobile overflow and page errors. Temporary learner states are restored after checking.
- TypeScript and diff whitespace checks pass. Existing learning/challenge unit checks retain grading and history behavior.
- The seed catalog currently contains 282 core vocabulary items across lessons L01–L15, 59 extra vocabulary items, and 18 total lessons. The engine inventory test now asserts those current catalog counts.

Use the project's supported Node.js runtime. Shared generated HTML is rebuilt through `build-preview.mjs`, `build-l13-vocabulary.mjs`, `build-l13-phrases.mjs`, and `build-a13-grammar-banks.mjs`; do not patch generated banks by hand.
