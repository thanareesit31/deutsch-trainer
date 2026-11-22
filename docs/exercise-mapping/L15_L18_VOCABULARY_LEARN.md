# L15–L18 vocabulary Learn correction

Date: 2026-11-23.

## Scope and preserved contracts

Replace the shared grammar/phrase teaching-card entry with the existing grouped
vocabulary image-matching component. L15 has 24 targets, L16 has 24, L17 has 22,
and L18 has 27. All 97 canonical card/target IDs, task versions, accepted answers,
Practice banks, first answers and assistance history remain unchanged.

Sources remain in `docs/lesson-preparation/l15-content.json` through
`l18-content.json` and the existing source review/bindings. The presentation
inventory is `src/data/release-vocabulary-images.json`. Rebuild and verify its
assets with `node --import tsx scripts/build-release-vocabulary-images.mjs`. Preserve
30 existing raster illustrations, including the L15 pictures. Replace the 67 icon
or labeled-diagram assets with photographs of the actual object, person or
situation. No Thai answer captions, generic icons or stick figures belong in these
pictures. Body-part photographs can highlight the actual target area. Keep the
important subject visible in the shared 3:2 contain frame.

Prompts and targets are recorded in
`artifacts/vocabulary-image-correction/jobs.json`. Contact sheets and per-file
SHA-256 visual reviews are kept beside that inventory. The catalog builder refuses
unchecked or changed photographs and never generates placeholder icons. This is
supported Learn, not independent picture-recognition assessment. Earlier exposure
records are retained without treating the old translated-picture help as absent.
No internal source label appears in learner copy.

## Objectives and evidence

| Targets | Response and support | Evidence and scoring |
| --- | --- | --- |
| Existing L15-V001–V024, L16-V001–V024, L17-V001–V022, L18-V001–V027 | Pair the supplied German word/chunk with a meaningful picture. At most six pairs per page. Supplied Artikel, shared dot and audio; no translated answer labels inside the picture. | Correct pairing records the existing target as learned/exposed. Wrong pair permits another try. Neither creates a scored attempt, independent Artikel/spelling evidence or mastery. |
| Existing vocabulary Practice tasks | Original `targetId`, `subskill`, `requiredCardIds`, difficulty rationale, assistance and accepted answers | Preserve canonical meaning/chunk-meaning, Artikel and spelling bindings and grading. New Learn presentation does not change task demand. |

## Data flow

| Link | Implementation | Status |
| --- | --- | --- |
| Learn → account exposure | `VocabularyImageMatching` → `learnReleaseVocabulary` → existing `deutsch-trainer-release-course-v1-L15…L18-vocabulary` checkpoint via `LessonStateProvider` | Implemented; uses existing canonical card validator and RLS. |
| Previous exposure → new Learn | Existing release learned IDs are immediately readable. Existing image-learning IDs/account item exposures map only to matching canonical IDs; merge is additive. | Implemented, no invented answers. |
| Old pending Learn trial → resume | Existing `active`, draft, first response, help and attempts are retained. Finish that original trial with its original grader, then return to the grouped vocabulary entry. New learners never start the card/check sequence. | Implemented. |
| Practice response → account evidence | Existing `A13ReleasePractice`, canonical questions and shared `PracticeAccountSync` | Preserved. |
| Account evidence → next task | Existing `selectReleaseRound` and vocabulary recommendation paths retain target/subskill separation and taught eligibility | Preserved, no new adaptive policy. |
| Progress | Existing released-course learned count reads the same checkpoint | Preserved; matching is Learn completion, not mastery. |

New matching pages follow guided page/group unlocking, as in the existing
vocabulary Learn flow. That sequence is not learner-specific adaptive selection.
The Learn button opens the first eligible Practice task directly with `?from=learn`,
resuming an existing pending round before creating another one. Practice keeps its
existing evidence-based selection, pending rounds and unknown
historical assistance. This change introduces no new promotion thresholds.

## Verification and rollout

`tests/release-vocabulary-learning.test.ts` checks all targets/assets, stable
bindings, additive/idempotent exposure and preservation of a pending draft.
`tests/release-vocabulary-learning-browser.mjs` drives the app with ordinary
learner UI and an isolated local database using project migrations/SQL validators,
matching, persistence, reload, Practice eligibility and a second account. Auth is
simulated by the local test adapter; this does not verify hosted Auth/deployment.
`tests/release-vocabulary-resume-browser.mjs` restores an old draft and assistance,
checks its immutable first response, returns to the vocabulary entry and verifies
all four direct Learn-to-Practice buttons. Rebuild visual audit sheets with
`node scripts/review-release-vocabulary-images.mjs` while the local test server
runs. Screenshots belong under `artifacts/vocabulary-l15-l18/`.

No new schema or canonical question registration is needed. Hosted deployment
and hosted normal-account verification are separate from local completion.


Local verification completed on 23 November 2026: TypeScript and 19 unit checks
passed. Both existing release database suites passed canonical grading,
prerequisites, immutable first responses, resume and RLS account isolation.
Browser runs verified all 97 matches and persisted reloads, normal-account UI,
eligible Practice and a separate unlearned account. After a server interruption,
the isolated checkpoint was restored to finish the remaining checks. The separate
resume browser check passed the old draft/help/first response and all four direct
after-learning Practice links. Final asset audit sheets contain all 97 assets.
Recorded result: `artifacts/vocabulary-l15-l18/verification.json`. Hosted release
was not performed.


Image correction, 23 November 2026: the earlier SVG/Thai-label substitution was
incorrect and is superseded by 67 reviewed scene photographs. Thirty appropriate
existing raster pictures remain. The photographs were generated with the built-in
imagegen tool, and user approval covers its original-image cache outside this
repository. Project assets remain under public/images/lektion-16-vocabulary,
lektion-17-vocabulary and lektion-18-vocabulary. Prompts, original file receipts,
contact sheets and per-file SHA-256 reviews are in
artifacts/vocabulary-image-correction. The boat picture was regenerated as v3 to
show the complete hull, mast and sails. The new raster/landscape check failed on
the actual prior 67 SVG entries, then passed on the reviewed photo catalog. The
existing exposure, first-answer, assistance and eligibility checks are unchanged.
Twenty unit checks pass. This is local image replacement, not a new adaptive
policy or hosted deployment.

The photo browser check passes L16 help/repair, L17 plans and L18 body/pain at
390px and 1440px: actual new images decode, use contain layout and do not cause
horizontal overflow. TypeScript passes. These are presentation checks; they do
not create learner answers or claim a new hosted release.


Production activation, 23 November 2026: commit 60396e6 is deployed through the
existing Vercel Git integration at https://deutsch-trainer-gamma.vercel.app. The
release was built from an isolated source tree excluding unrelated local changes.
Two fresh ordinary accounts on hosted Supabase verified Learn checkpoints across
18 targets on the first pages of all four lessons, eligible canonical Practice,
four first answers, reload and new-login resume. A second account could not read
the first account's state or start an unlearned task. All 67 new image URLs return
PNG successfully; four downloaded samples match the reviewed local SHA-256.
Both temporary accounts were deleted and their absence verified. No existing
learner history was modified and no database migration was needed. This supersedes
the earlier local-only status. Evidence: `.audit/vocabulary-release.json`.
