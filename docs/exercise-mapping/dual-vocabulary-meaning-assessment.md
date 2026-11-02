# Dual vocabulary meaning assessment

Updated 2026-11-02. Scope: L01–L12 basic/daily, L13 vocabulary previews, and L14 vocabulary practice. Existing Learn words and image assets are reused. No external content source was added. Internal provenance remains in the vocabulary banks and source catalogs.

## Targets and response bindings

| Targets | Response and measured subskill | Difficulty and assistance | Grading |
| --- | --- | --- | --- |
| 218 eligible L01–L12 image targets in a11-vocabulary-bank.json | itemId → `itemId-a11-picture-meaning`, version 1, vocabulary_picture_meaning | Level 1 recognition with an image and four German choices; nouns include supplied Artikel | Canonical German label; does not assess independent gender or spelling |
| 25 eligible L13 image targets in l13-vocabulary-bank.json | itemId → `itemId-picture-meaning`, version 1, vocabulary_picture_meaning | Same supported recognition task | Canonical German label; known aliases excluded as distractors |
| Existing L01–L13 word meaning targets | Historical question IDs and vocabulary_meaning unchanged | German word and Thai choices | Existing accepted Thai meaning |
| L14 taught words in l14VocabularyQuestionBank | `itemId-word-meaning`, version 1, vocabulary_word_meaning | Level 1 recognition with German word and three Thai choices | Exact taught Thai meaning |
| Existing L14 image/route tasks | `itemId-meaning`, vocabulary_meaning unchanged | Existing image/route support and German choices | Existing German answer |

All new tasks require the target's existing Learn eligibility. German distractors are supplied recognition alternatives, not evidence of independent recall of those distractors. Ambiguous greeting and family scenes are excluded from the new image bank. L02 profession scenes use the matching single-person crop. Existing question IDs, versions, answers and saved queues remain readable.

## Evidence and selection

L01–L13: Learn exposure/image state → learned-target filtering → preview first response → sync_practice_session → canonical server grading → learner_practice_sessions. The migration adds new definitions without overwriting historical definitions. The database trigger validates image, interaction and the complete option set. New attempts record recognitionMode as image-to-german or german-to-thai, null confidence and existing help flags. The distinct subskill is retained in the saved question. Existing spelling and Artikel evidence are separate.

The shared daily planner ranks target/subskill history and now treats the two meaning formats separately when balancing a round. Guided selection uses a format cycle with unseen targets. That cycle is content coverage, not ability-based progression. This change does not add mastery thresholds or a promotion policy for these recognition tasks. Missing evidence remains unknown; historical answers are not reclassified as image recognition.

L14: existing exposure/image/direction Learn checks → question bank → first attempt and evidence → existing lesson-state persistence. New evidence uses policy l14-vocab-3 and explicit recognitionMode; historical l14-vocab-2 evidence remains readable. The selector considers word meaning separately from image recognition and chooses failed subskills first. Existing context assistance progression remains unchanged. L14 grading remains client-side lesson-state grading, unlike the canonical SQL question validator used by L01–L13. This is a remaining trust-boundary limitation.

## Completion and limits

Design and evidence bindings are implemented for the stated scope. Database checks cover canonical grading, learned eligibility, first-answer preservation, account isolation and changed picture metadata rejection. Browser checks cover the new preview image questions, image loading, choice grading, mobile overflow, recognitionMode and reload, plus the original L02 inline spelling behavior.

No production migration or deployment is performed by this continuation. These local checks do not establish production account behavior or a complete adaptive ability model across all lessons. Existing recommendation entry points continue using the shared planner; no new recommendation UI is added.

Local results on 2026-11-02: all 243 new picture questions passed the mobile browser test; all 17 L02 spelling targets passed mobile and desktop checks. Database tests passed 887 L01–L12 definitions and all 162 L13 questions with 168 accepted variants, including picture metadata forgery rejection. TypeScript passed. L14 bank and failed-subskill selection tests passed. The broader L02 learning test also passes after updating its stale asset assertion to use the application image resolver and checking that migration replay preserves the current catalog count instead of an obsolete fixed count. The production build passed with Next.js Webpack using the repository-local Node 20 runtime. Turbopack could not run because this environment lacks native SWC bindings.
