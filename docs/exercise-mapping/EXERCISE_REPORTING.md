# Per-question issue reporting

## Scope and contract

Add a report action before and after checking an exercise, with categories for incorrect key, another valid answer, unclear task/explanation, media trouble and design suggestion. Store only the current question snapshot, stable ID/version, route, optional current answer/result, and visible feedback. Never include hidden expected answers before checking. Reporting never grades, edits a task, changes evidence, consumes help or advances a session.

Report rows are separate from assessment tables. Authenticated learners submit their own reports; only explicitly assigned report administrators can read all reports and set received/reviewing/resolved/unchanged status. Final decisions require a reason. Learner access does not confer administrator access. Admin membership is assigned server-side, never from editable user metadata.

## Work and verification

- [x] Add RLS-protected report storage, idempotent submission and administrator review RPCs.
- [x] Add shared form and per-response context, covering iframe/native Practice engines and sentence Learn checks.
- [x] Add administrator list, filters, detail and status/reason controls.
- [x] Verify before/after-answer redaction, grading/history preservation, duplicate retry, account isolation, admin permissions, mobile and keyboard form behavior.
- [ ] Install schema before frontend; deploy and verify ordinary-user report access and admin access.

This is a presentation/support feature: existing assessment IDs, bindings, difficulty, grading and progression are preserved. Report counts are not learning evidence. The administrator email is a required setup input, requested while implementation proceeds.


## Verified implementation

- `tests/exercise-report-database.mjs`: actual PostgreSQL-compatible RLS/RPC checks passed for own reports, admin access, reason requirements, duplicate retry, hidden-answer redaction and no practice-session writes; migration can be applied again.
- `tests/exercise-report.test.ts`: context boundary tests passed, unknown legacy versions remain null, hidden answers and unrelated private fields are discarded.
- TypeScript and production webpack build passed. Generated all 104 preview artifacts from the shared source template.
- Native bindings: A1.3 Learn/Practice, L14 phrase/vocabulary Practice, L13 vocabulary challenge, phrase dialogue Learn including L02, L01 phrase discovery, L14 position and phrase Learn, and legacy `/session`. Other legacy course/Arbeitsbuch/Supplemental Learn activities are outside this first release.
- Administrator requested by the owner: `tester@deutsch.test`. Local admin membership is a test fixture; production membership must be installed independently for that exact account.
- Deployment order: prepare with `node scripts/prepare-lesson-release.mjs --exercise-reporting`, apply additive migration, assign the requested account server-side, then deploy frontend. Never seed fake reports or learning answers on production.

- `tests/exercise-report-browser.mjs`: passed on 375px mobile. Verified cancel/Escape, current draft preservation, failed request retaining form text, retry, before-check redaction, after-check answers, reason required for final admin status, saved status visible to reporter, ordinary account denied administrator page, and no page errors. Receipt: `.audit/exercise-report-browser.json`.

## Hosted installation

2026-11-11: installed the additive reporting migration. Public readiness RPC returned HTTP 200 with `ready: true, schemaVersion: 1`. The requested `tester@deutsch.test` account does not exist in hosted Auth, so no arbitrary account was granted rights and no test user was created in production. The owner has been asked for the email used on the real website; administrator assignment and production admin-page verification remain pending that input. Local administrator workflow is verified.
