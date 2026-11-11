# Practice improvement L01–L14

## Scope and completion

Preserve all published question IDs, versions, accepted answers, first answers, assistance and pending queues. Add authored contextual transfer and bounded writing for suitable taught communicative objectives in each lesson. No fixed quota and no claim of free production or validated mastery. Existing vocabulary/grammar evidence remains distinct. L14 retains its current learner flow.

## Execution

- [x] Read adaptive/practice standards and inspect current banks; capture baseline before changes.
- [x] Author new contexts and response-specific explanations linked to taught target IDs, with scoped difficulty/support metadata.
- [x] Integrate staged eligibility from independent contexts and actual sessions, balanced new/weak/due selection, and recovery scaffolds.
- [x] Preserve canonical history, shared account persistence, help, drafts and explicit resume.
- [x] Verify real database, mobile UI, old queues and ordinary-account access.
- [ ] Apply additive catalog/gates before frontend, deploy and verify hosted release.

## Evidence policy

Learn exposure determines taught eligibility, not independent ability. New-context tasks require a real response on that target. Supported bounded writing requires correct first responses without help in two distinct contexts and two sessions for the specified prerequisite subskill. Less-supported writing requires equivalent bounded-writing evidence. Missing assistance is unknown. Wrong higher-stage responses return to an available scaffold. Store each task context/stage and reason; keep started queues stable. Thresholds are provisional product policy.

## Mapping and provenance

Each new scored response must carry targetId, subskill, requiredItemIds, contextId, stage, difficultyRationale, assistance and unlock metadata. Authored context/distractor provenance stays in project metadata. Inventory files will provide the concrete task-level mappings.

Decision trail: `.audit/practice-l01-l14.tsv`.

## Implemented content and assessment scope

There are145 additive phrase tasks across29 selected taught communicative objectives in14 lessons:58 contextual response choices,58 scaffolded whole-sentence cloze responses and29 constrained sentence responses from data/lemmas/start conditions. Mapping: `phrase-practice-upgrade-bindings.json`; source-authored status and reviewed lexical limits: `l01-l13-practice-extension-provenance.json` and `L14_PRACTICE_IMPROVEMENT.md`. This is selected-objective coverage, not every existing target migrated to writing. Early fixed expressions measure constrained phrase recall across settings, not lexical generalization.

Old346 A11 phrase definitions,114 current L13 definitions plus legacy tasks, and101 L14 canonical definitions are retained. Presentation relabels historical A11 situation questions as meaning matching; their historical subskill IDs stay unchanged and are not reinterpreted as dialogue evidence. Newly authored dialogue responses have separate IDs/subskill evidence. Shared daily selection also mixes weak/new/due lanes while retaining existing non-phrase topic eligibility.

Core context metadata groups existing variants conservatively by target rather than counting a format change as an independent situation. New-context and writing gates use two actual contexts/two shared sessionIDs and known independent assistance fields. Mirroring one session into two banks does not create a second session. Completed first responses, unknown assistance, drafts and existing higher queues survive recovery.

## Integration and checks

- Generic preview planner and L14 native controller both use target/subskill/context/session gates, while new server metadata validates those gates before starting a session. Old questions/canonical answers remain immutable.
- Normalized server assistance is consumed after uploads by both iframe and native clients. Delayed word help joins item and attempt records and updates archived native runs, preserving the first response. Unknown support is not silently made independent.
- 275 audio references use144 unique validated MP3 files for exact A/B texts with different German voices. Existing media bytes remain unchanged. These tasks do not score listening comprehension.
- Mobile corpus check covers130 generic new tasks at375/390/1360 with complete sentence rows and no horizontal overflow. At375 the longest annotations still require10.4px text; this is a layout check, not a learner readability study. Native L14 and actual account navigation are checked separately.
- Local test workspace recovery now treats restored queues as existing sessions, temporarily disabling only progression gates during the trusted transaction. Canonical grading/learned validators stay enabled, and gates are re-enabled before the server accepts requests.

Deployment remains pending until the new additive migrations and the ordinary-account hosted smoke are recorded.

## Final local verification

Actual ordinary-learner flag path passed all14 phrase entry routes. Four advanced writing flows L02/L11/L13/L14 saved canonical answers through the shared RPC, restored drafts after reload and kept each sentence in one row at375px. Live L11 stale-device response consumed server-normalized word help before subsequent selection. Native L14 uses the original guided/topic/mixed flows; adaptive extensions join daily rounds. L14 explicit resume opens the requested saved round and preserves other pending drafts. Actual annotation fonts in these four mobile flows were13.8/13/16/15.9px. Full generic corpus minimum10.4px remains a layout limitation, without a human readability-study claim.

Real database gates and isolation passed; existing L13 answers/matching and L15–18 shared sessions passed compatibility checks. Specific response feedback was checked for Partizip II, finite form/position, Artikel and capitalization. Cross-model reviewer gpt-6-astra reported no additional blocking issues after the assistance and resume fixes; reviewer scope was source/test inspection, not hosted verification.

Hosted schema is installed and public readiness is200 with14lessons/710metadata/145extensions. Frontend deployment and hosted account checks remain pending.
