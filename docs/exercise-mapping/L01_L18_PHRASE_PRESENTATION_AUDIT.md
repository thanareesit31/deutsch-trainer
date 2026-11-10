# L01–L18 phrase teaching presentation audit

Scope: local test-workspace phrase Learn pages, teaching examples, guided try-response and feedback. Preserve ordinary-account gates, existing source content, canonical answers, assessment bindings and saved history. Practice synchronization remains outside this task as requested earlier.

## Definition of done

Every existing phrase teaching topic in L01–L14 is checked against the nine principles in `../SENTENCE_ANNOTATION_STANDARD.md`. Fixes preserve question/answer identity and account evidence. All changed teaching examples and scored-feedback annotations reconstruct their original German text. Before-answer screens reveal no answer structure. Desktop and 375px/390px browser checks verify complete sentence rows, directly attached role explanations, consistent colors, per-example audio and usable response/feedback. A lesson without phrase content is explicitly marked missing, never passed by an empty check. L15–L18 currently fall in that category.

This is a presentation/content-integration run, not deployment, a migration of all historical evidence or implementation of a new adaptive selector.

## Workflow and checkpoints

- [x] Read the Principles section of poteto-mode and the project teaching, adaptive and practice standards.
- [x] Trace active routes, preserve the dirty working tree, quantify topics/cards/tasks and distinguish absent content from a display defect.
- [x] Capture canonical content/state contracts and build a rerunnable per-lesson audit before editing.
- [x] Complete shared annotations, audio and feedback for the shared L02–L12 renderer, retaining L11 as the approved reference.
- [x] Bring L01 presentation into the same standard without migrating its discovery state or saved queues.
- [x] Correct L13/L14 existing flows and record any integration gaps that require new teaching content.
- [x] Audit the empty L15–L18 entries and their explanatory copy without inventing lesson banks.
- [x] Run static content checks, TypeScript and desktop/mobile browser verification per unit; inspect actual screenshots.
- [x] Update the lesson matrix, assessment scope and changelog; complete root review and report the unavailable external review explicitly.

Rigor: canonical-data comparisons and live UI checks for existing lessons; explicit NOT IMPLEMENTED for missing content. Read-only audit workers inspect L01–L12 and L13–L18 independently. The parent is the only source writer. Progress and choices are logged in `.audit/l01-l18-phrase-presentation.tsv`.

## Initial scope census

| Lesson | Teaching topics | Visible model cards | Learn tasks | Response units | Initial presentation |
| --- | ---: | ---: | ---: | ---: | --- |
| L01 | 9 | 17 | 17 | 17 | Separate discovery controller |
| L02 | 7 | 14 | 18 | 20 | Shared dialogue renderer |
| L03 | 3 | 8 | 10 | 11 | Shared dialogue renderer |
| L04 | 3 | 7 | 8 | 8 | Shared dialogue renderer |
| L05 | 4 | 9 | 9 | 9 | Shared dialogue renderer |
| L06 | 3 | 9 | 10 | 10 | Shared dialogue renderer |
| L07 | 4 | 12 | 13 | 13 | Shared dialogue renderer |
| L08 | 3 | 11 | 12 | 12 | Shared dialogue renderer |
| L09 | 4 | 8 | 10 | 11 | Shared dialogue renderer |
| L10 | 4 | 9 | 10 | 10 | Shared dialogue renderer |
| L11 | 3 | 9 | 10 | 11 | Approved shared model/feedback annotations |
| L12 | 3 | 9 | 11 | 12 | Shared dialogue renderer |
| L13 | 4 groups | Catalog cards | Separate Practice | Separate Practice | 29 published phrases; generic learning cards |
| L14 | Dedicated flow | Dedicated flow | Dedicated flow | Dedicated flow | 17 authored learning phrases; separate controller |
| L15 | 0 | 0 | 0 | 0 | NOT IMPLEMENTED: no phrase content |
| L16 | 0 | 0 | 0 | 0 | NOT IMPLEMENTED: no phrase content |
| L17 | 0 | 0 | 0 | 0 | NOT IMPLEMENTED: no phrase content |
| L18 | 0 | 0 | 0 | 0 | NOT IMPLEMENTED: no phrase content |

Counts distinguish visible L11 comparison cards from its unused legacy model records. L01 old saved queues and supplemental scope must remain compatible. L02 state and presentation tag remain unchanged.

## Integration and assessment boundary (8 November 2026)

L01–L12 canonical banks remain byte-equivalent as parsed data to the captured pre-change banks. Presentation annotations, audio and contextual feedback are overlaid by `presentDialogueTopics`; target IDs, scoring, difficulty, assistance and history parsers are preserved. The exact-text authoring registry and its generator reject unreconstructed German and missing roles. Audio uses separate synthetic A/B voices.

L13 retains all 29 published `L13-Rxxx` targets, in the original four groups. Each target has a contextual model followed by one supported response. Question targets ask the learner to supply A; answer targets supply B. Six checks assess supplied-word ordering (difficulty 2), the others dialogue selection (difficulty 1). Their explicit assistance and rationale live with each unit. Model continuation records exposure for that one target; it does not record mastery. First responses, drafts, help and resume use the shared validated dialogue history, in four new account keys. Existing Practice definitions and historical sessions are unchanged. Learn evidence is stored in lesson state; existing Practice recommendation still uses Practice evidence. Connecting new Learn responses to an active adaptive selector remains a gap.

L14 retains its version-14 parser, sorting, map, four scenario kinds, random destinations, guided choice, reorder and translation flipping. Seventeen concrete spoken models supplement the original templates in communication order: request → route → unknown route → thanks. Existing runs open their existing activity; the models remain available through the navigation. New first-observed observations are stored separately by function recognition, route selection and dialogue ordering, with response, context, assistance and difficulty. Historical true first responses are unknown and are never reconstructed from `solved` or misses. New observations are not yet consumed by the Practice selector. No mastery claim is made.

The L14 model cursor is navigation progress only. Audio/model viewing does not count as skill evidence. L13 and L14 use local test-workspace account-key extensions, without a hosted migration.

L15–L18 have no published phrase bank. They require approved curriculum/content before a teaching/practice compliance claim is possible.

## Verification commands

- `node --import tsx scripts/exercise-mapping/build-phrase-presentation.mjs`
- `PYTHONPATH=.tools/edge-tts python3 scripts/exercise-mapping/build-phrase-presentation-audio.py`
- `node --import tsx scripts/exercise-mapping/audit-phrase-presentation.mjs`
- `node --import tsx --test tests/a11-phrase-dialogues.test.ts tests/l02-phrase-discovery.test.ts tests/phrase-discovery.test.ts tests/l14-phrase-observations.test.ts tests/l13-phrase-learning.test.mjs`
- `node --import tsx tests/phrase-presentation-browser.mjs`
- `node --import tsx tests/phrase-presentation-special-browser.mjs`

Browser fixtures suppress account writes and use restored simulated histories for presentation inspection. They are not evidence of real learner mastery. The full original-history unit checks cover immutable first-response and parser contracts separately. External language/review agents exhausted their usage allocation; their review was not completed. Root verification continues locally.

## Scoped assessment plan: L13/L14 additions

The target and response IDs below are actual bindings, not new mastery labels. Existing L01–L12 grading and assessment plans remain unchanged.

| Target IDs | Taught objective | Measured subskill and response IDs | Learned context | Difficulty/support and scoring |
| --- | --- | --- | --- | --- |
| L13-R001–R029, excluding the six ordering targets below | Choose an appropriate expression for the supplied intention and dialogue | `phrase_dialogue_response`; `<target>-learn-dialogue-v1-response` | The same target's model precedes its check | 1: prior model, visible contextual facts, three supplied options; exact canonical choice; supports recognition in context, not free production |
| L13-R005, R011, R018, R022, R026, R027 | Assemble the expression just taught | `phrase_word_order`; `<target>-learn-dialogue-v1-response` | The same target's model and facts | 2: supplied words require sequence reconstruction; canonical word order; not independent sentence production |
| L14 phrase IDs such as `ask-help`, `describe-turn`, `unknown-local`, `thanks-heart` (all 17 retained IDs) | Distinguish asking, describing, not knowing and thanking | `phrase_function_recognition`; `sort:<phrase-id>` | Existing grouping activity; models are available | 1: four supplied function groups; existing translation help; evaluate against the retained group; store the first observed assignment separately from retries |
| `L14-route-<help/search/where/walk>-turn-<index>` | Select a contextually suitable turn | `route_dialogue_selection`; `choice:<kind>:<place>:<index>` | Existing map and prior dialogue turns | 2: supplied map and reply choices; keep existing accepted thanks variants; snapshot actual options, expected turn and destination |
| `L14-route-<help/search/where/walk>` | Order a complete situated dialogue | `dialogue_order`; `order:<kind>:<place>` | Existing guided dialogue and supplied turns | 3: reconstruct turn sequence; store first observed submitted sequence and correctness; this is not free spoken production |

| Target/subskill | Initial evidence and state | Support and next challenge | Review/selection status |
| --- | --- | --- | --- |
| L13 contextual selection | Unknown until an independent first check; record prior model/options/help | The published model and choice exist; an independent production variant is absent | Current Learn curriculum order remains fixed; selector integration for these new Learn responses is missing |
| L13 supplied-word ordering | Separate from contextual selection; record supplied-word support | Ordering exists for six targets; a less-supported production task is absent | Existing Practice recommendations continue to use existing Practice history; do not infer mastery from one correct Learn answer |
| L14 function recognition, selection, dialogue order | Three distinct observation types; historical first responses remain unknown | Retained hints, translation flip, map and supplied turns; each observation snapshots the support that can be recorded | New observations do not yet update a learner-state aggregator or adaptive selector; successful skills must not be invalidated by another subskill's error |

| Data-flow link | Actual implementation | Status |
| --- | --- | --- |
| L13 Learn target → exposure | Shared `PhraseDialogueLearning.advance` calls `learning.act('expose')` for the target's one retained `legacyId` | Implemented; canonical bindings checked; existing exposure API unchanged |
| L13 response → evidence | `gradeDialogue` and each explicit `DialogueUnit`; first answers, help, plays and drafts in validated dialogue runs | Implemented; all 29 targets grade/restore in unit checks; actual A/B and ordering UI samples checked |
| L13 evidence → account history | `LessonStateProvider`; four `deutsch-trainer-phrase-discovery-v1-L13-<group>` keys | Implemented in local tester adapter; browser fixtures suppress writes; hosted integration is not deployed |
| L14 response → first observed evidence | `keepFirstObservation` and `readPhraseObservations`; `deutsch-trainer-phrase-observations-v1-L14` | Implemented; real UI check/retry verified with writes intercepted; version-14 activity state retained |
| New Learn history → target/subskill learner state | No new mastery/ability aggregator in this change | Missing integration; no learner ability claim |
| New learner state → next difficulty/support/task | Existing Learn sequence and Practice selectors remain | New evidence is not actively selected on; no adaptive-ready claim |
| Shared recommendation → Practice | Existing L13/L14 recommendation, eligibility and entry paths | Preserved; deferred Practice sync issue remains outside this work |
| Public deployment | Local tester preview only | Not deployed |

## Final verification, 9 November 2026

- TypeScript, canonical comparisons and 26 assessment/history tests cover the existing banks plus L13 bindings and L14 immutable observations.
- `tests/phrase-sentence-layout-browser.mjs` bundles the actual shared component and loads the app's compiled CSS. It renders all 349 exact strings in teaching and feedback contexts at 375/390/1360px: 4,716 sentence-row checks. It asserts literal German reconstruction, a complete single row, directly centered mobile labels and no page overflow. This is a component fixture, not a claim that every route was driven end to end.
- Actual local app fixtures cover all L01/L02/L03/L04/L05 model/check/feedback steps; L13 samples cover A-question targets, B-answer targets and word ordering. L14 covers all 17 supplemental models, all four scenario kinds in guided/reorder modes, and the 17-item first-check/retry flow. Fixtures suppress account writes; results are presentation/behavior evidence, not learner evidence.
- L14's retained card layout initially shrank a long route below readable size. Moving audio above the diagram and reclaiming padding resolves it; checked route cases now remain at least 11px, with complete one-line sentences. The longest shared sentence at 375px is 10.4px after using available space; it is fully visible rather than clipped or scrolled.
- All 166 generated dialogue assets and 388 voice turns are present and nonempty; 16 sampled dialogue formats are recognized by the local audio decoder. Existing preserved recordings remain referenced separately.
- External reviewer agents could not complete a second language review after their usage allocation was exhausted. Root checks and the rerunnable validators above are the completed verification.

Additional commands: `node tests/phrase-sentence-layout-browser.mjs`, `node --import tsx tests/l14-phrase-observations-browser.mjs`. The optional full route sweep is `node tests/phrase-presentation-audit-browser.mjs`; it is broader than the component-corpus and representative route checks used for this completion.

## Final lesson disposition

| Lessons | Result | Remaining boundary |
| --- | --- | --- |
| L01–L12 | Shared role palette, directly attached annotations, per-example audio and contextual feedback applied; original questions/answers/history contracts preserved | Existing assessment/selection bindings retained |
| L13 | All 29 retained targets have a contextual Learn model and supported check, grouped under the original four topics | New Learn evidence does not yet feed the adaptive selector |
| L14 | Original 17-item grouping, maps, guided selection, turn ordering and flipping retained; 17 spoken teaching models added; observed first responses stored separately | Historical firsts unknown; new observations do not yet feed the selector |
| L15–L18 | Audited as absent phrase content | No teaching bank invented; curriculum authoring remains necessary |

The Practice sync failure requested for deferral remains untouched. The local test workspace was restarted with its previous history restored; the browser may require a fresh login.
