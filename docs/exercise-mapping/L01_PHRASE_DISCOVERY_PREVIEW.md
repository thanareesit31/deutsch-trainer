# L01 interactive phrase Learn preview

Initially implemented 2026-11-04 and extended 2026-11-05 for local tester accounts only. This is an interactive Learn prototype, separate from the existing A1.1 phrase Practice bank. L02–L12 remain content drafts.

## Entry and content

Open `/learn/L01/phrases/discovery` in the local test workspace. The existing tester banner has a `ลองเรียนประโยคบท 1` link. `isTestWorkspaceUser` gates both the entry and route. Normal accounts see the existing L01 lesson overview on a direct visit. Production builds cannot enable this tester predicate.

Version-1 runs retain five topics and ten learning checks across 15 screens. New version-2 full-lesson runs have nine topics and 17 checks across 26 screens. The added-only route `?part=supplement` has four topics and seven checks across 11 screens. Teaching screens precede their checks; the round proceeds without topic checkpoints. Learners can listen to the examples, select dialogue replies, or place and remove words to form a reply. Checking immediately shows the German answer, Thai meaning and an explanation. The preceding turn's Thai meaning appears only when its German text differs from the answer; the German prompt is not repeated in feedback. Submitted first answers remain locked when revisiting a screen. Completion offers replay and finish; replay retains older runs.

Sources for the communicative functions: the local Kursbuch, PDF 11/printed 9, PDF 12/printed 10, PDF 13/printed 12, and PDF 27/printed 26, as recorded in `a11-phrase-source-review.json`. All scenarios, distractors and feedback are product authored and received an author review, not independent instructor approval. `a11-phrase-expansion-draft.json` contains the source example IDs. Provenance is never rendered in the learner UI.

`python3 scripts/exercise-mapping/build-l01-phrase-discovery.py` builds the typed runtime projection `src/data/l01-phrase-discovery.ts`. It contains ten selected draft examples plus seven supplemental checks from `l01-phrase-supplement-activities.json`, with context-specific distractors. It does not expand every draft automatically. Ordinary learner phrase targets, answers and exposure IDs are not changed.

## Original assessment mapping

Each runtime check carries its candidate target ID, communicative objective, subskill, provisional difficulty/rationale, source example ID and a stable task ID ending in `-learn-v1`. Historical interpretation depends on these versioned definitions; changing an answer requires a new version, not rewriting an existing first response.

| Task ID | Target ID | What was taught | Subskill | Demand and assistance | What the check distinguishes |
| --- | --- | --- | --- | --- | --- |
| L01-COMM-01-D01-learn-v1 | L01-COMM-01-D01-target | Morning greeting | phrase_dialogue_response | Level 1, model plus time and German options | Greeting for morning versus evening or farewell |
| L01-COMM-01-D04-learn-v1 | L01-COMM-01-D04-target | Informal farewell | phrase_dialogue_response | Level 1, model plus leaving context/options | Ending the conversation versus greeting |
| L01-COMM-02-D01-learn-v1 | L01-COMM-02-D01-target | State your name | phrase_word_order | Level 2, model and all words supplied | Subject, finite verb and name order |
| L01-COMM-02-D03-learn-v1 | L01-COMM-02-D03-target | Introduce someone else | phrase_dialogue_response | Level 2, model, names/roles and options | Third person introduction versus self-introduction |
| L01-COMM-03-D02-learn-v1 | L01-COMM-03-D02-target | Reply and ask back politely | phrase_dialogue_response | Level 2, model, wellbeing/formality facts and options | Ihnen versus dir in the stated relationship |
| L01-COMM-03-D03-learn-v1 | L01-COMM-03-D03-target | Report feeling unwell | phrase_dialogue_response | Level 2, model, stated feeling and options | Negative wellbeing versus positive wellbeing or farewell |
| L01-COMM-04-D01-learn-v1 | L01-COMM-04-D01-target | State your origin | phrase_word_order | Level 2, model, country and all words supplied | Ich + komme + aus + country order |
| L01-COMM-04-D02-learn-v1 | L01-COMM-04-D02-target | State another person's origin | phrase_dialogue_response | Level 2, model, identity/country facts and options | Anna's origin versus your origin or her name |
| L01-COMM-05-D01-learn-v1 | L01-COMM-05-D01-target | Request repetition | phrase_dialogue_response | Level 1, model, unclear-name context and options | Asking for repetition versus departing or giving origin |
| L01-COMM-05-D03-learn-v1 | L01-COMM-05-D03-target | Thank someone after spelling help | phrase_dialogue_response | Level 1, model, completed-help context and options | Thanking versus asking a new question or greeting |

All checks require the topic's teaching screen to have been continued. Seeing both model turns is assistance, not independent mastery evidence. Reviewed word help is available on question words where it does not reveal the target answer. It is disabled when the preceding turn repeats the target formula. Word focus, hover or touch before the first check records the helped word. Model speech is available as a learner-started action; there is no listening assessment. Ordering checks accept the supplied words in the authored order and do not assess free production.

## Account evidence and selection boundary

| Link | Actual implementation | Status |
| --- | --- | --- |
| Learn → eligibility | Run `modelIds`; the continue action marks that topic's examples encountered | Implemented for supported Learn checks; not item_exposures and not eligibility for regular Practice |
| Response → target/subskill | Versioned runtime task ID joins to the original and supplemental mappings | Implemented for ten original and seven added checks |
| First response → account | `LessonStateProvider` writes `deutsch-trainer-phrase-discovery-v1-L01` to account-scoped `learner_lesson_states`; each response keeps selection, first text/correctness/time, modelSeen and prior helpWords | Implemented; tested with local API/RLS |
| Draft/resume/replay | Selection and step checkpoint use the same state; previous runs remain in `runs` | Implemented; reload, word removal, locked first answer and replay checked |
| Evidence → learner state | No competency aggregation or calibrated thresholds added | Not implemented; each subskill starts unknown |
| Learner state → next task | Guided fixed topic order, with manual previous/next | No adaptive selection or promotion; this sequence is teaching support |
| Shared recommendation | No new home/manual Practice recommendation or Progress percentage | Not integrated; tester banner is the only new entry |
| Deployment | Local test server only | No hosted database migration or production deployment |

The local adapter installs `scripts/test-workspace-phrase-discovery.sql` before restoring tester history. It extends the existing lesson-key check and retains existing RLS. The SQL is not part of the production migration list. Production cannot write this key under the current hosted allowlist. Existing provider pending-write recovery applies. This uses the existing Learn checkpoint mechanism, not a new Practice store. It does not provide the immutable server-side merging or grading guarantees of `learner_practice_sessions`; multi-device concurrent Learn editing remains a limitation.

## Verification

With the local workspace running, use Node 20.9+ to run `node tests/l01-phrase-discovery-browser.mjs`. The check uses local tester accounts and rejects requests to hosted Supabase. It retains old tester runs and appends a fixture run. It drives all five topics and ten checks, checks incorrect-first-answer retention, draft reload and removal, word-help evidence, completion/replay, account/RLS isolation, the normal-account route gate and a 390px viewport. Screenshots are kept under ignored `.tools/phrase-discovery-*.png`.

TypeScript and the browser flow passed. This verifies the local adapter, not hosted Supabase, production, audio quality or an independently reviewed language curriculum. The prototype has no scores or mastery claims in its learner completion view.

Wellbeing explanation clarification, 4 November 2026: the note spells out informal `Wie geht's dir?`, polite `Wie geht es Ihnen?`, and the corresponding `Und dir?`/`Und Ihnen?` follow-up. It separately explains that Gut/Nicht so gut describe the speaker's feelings. This revises teaching copy within L01-COMM-03; response IDs, difficulty, assistance and scoring bindings are preserved.

## Explanation and layout review, 4 November 2026

Reviewed all five teaching notes and ten check explanations, including greeting versus farewell, self-introduction versus introducing another person, polite versus informal wellbeing, your origin versus Anna's origin, and requesting repetition versus thanking after help. Notes use separate list items. Feedback uses short paragraphs tied to the stated facts, without repeating the whole answer as an explanation. Situation labels and shared instructions use plain Thai, and speaker labels state “อีกฝ่าย”/“คุณ”.

This pass preserves the target/subskill table, provisional demand and assistance, IDs, canonical answers and account history. It does not introduce new learning targets or a new progression policy. Runtime copy is regenerated from `build-l01-phrase-discovery.py`. Language explanations received an author review; independent instructor approval remains pending.

Copy-review verification: TypeScript passed, and all five teaching screens and ten feedback screens were driven at 390px with screenshots under `.tools/phrase-copy-*.png`. The visual review intercepted only this prototype's state to keep its review run isolated, then confirmed that the saved tester history was unchanged. The earlier local account/RLS checks are separate from this presentation check.

Supplement follow-up, 4 November 2026: [L01_PHRASE_SUPPLEMENT_REVIEW.md](L01_PHRASE_SUPPLEMENT_REVIEW.md) verifies the teacher-slide spelling request `Wie bitte? Wie schreibt man das?`, first/family-name distinctions and introduction replies. The current ten Learn checks do not cover those spelling responses. The addendum separates communication, supplied-letter order, copying and independent audio-based spelling evidence, and records the need to preserve pending/completed queues before adding screens. No runtime extension is included in that source review.

## Supplemental activities, 5 November 2026

Open `/learn/L01/phrases/discovery?part=supplement` or the tester banner's `ลองกิจกรรมที่เพิ่ม` entry. A completed old run also links to the added activities. Version 1 keeps the old queue and completion status. Missing bank/scope fields are read as version 1/full lesson. New runs record `bankVersion: 2` and scope `all` or `supplement`. Each scope resumes its own latest run; switching scope does not advance or erase the other run. Replay appends another run in the same scope.

| New task | Target | Function / subskill | Demand and actual assistance | Literal accepted reply |
| --- | --- | --- | --- | --- |
| L01-SUP-N01-learn-v1 | L01-SUP-N01-target | L01-COMM-02; phrase_dialogue_response | Level 2; model, written person facts and options | Mein Vorname ist Mali. |
| L01-SUP-N02-learn-v1 | L01-SUP-N02-target | L01-COMM-02; phrase_dialogue_response | Level 2; model, written person facts and options | Mein Familienname ist Sommer. |
| L01-SUP-S01-learn-v1 | L01-SUP-S01-target | L01-COMM-05; phrase_dialogue_response | Level 1; model, need-to-write-name context and options | Wie bitte? Wie schreibt man das? |
| L01-SUP-S02-learn-v1 | L01-SUP-S02-target | L01-COMM-05; name_letter_order | Level 2; model, visible name Mali and all supplied letters | M-A-L-I. |
| L01-SUP-P01-learn-v1 | L01-SUP-P01-target | L01-COMM-02; phrase_dialogue_response | Level 1; model, completed-introduction context and options | Freut mich! |
| L01-SUP-P02-learn-v1 | L01-SUP-P02-target | L01-COMM-02; phrase_dialogue_response | Level 1; model, reciprocal introduction context and options | Freut mich auch! |
| L01-SUP-G01-learn-v1 | L01-SUP-G01-target | L01-COMM-01; phrase_dialogue_response | Level 1; model, bedtime-farewell context and options | Gute Nacht! |

Source finding IDs, exact worksheet/teacher-slide pages and authoring status live in `l01-phrase-supplement-activities.json` and `l01-phrase-supplement-review.json`. The generated runtime projection omits detailed provenance, and the UI renders teaching content only. The first/surname questions preserve possessive determiners in their sentences. The spelling task supplies the name and letters; its result is supported letter ordering, not independently recalled spelling or listening comprehension. The example and feedback offer learner-started speech for each individual letter. Browser tests check the controls and flow, not speech quality.

New first responses capture `assistance` alongside modelSeen and prior word help. Historical responses without that field stay explicitly unknown (`null`), rather than inheriting today's assistance settings. Target IDs and subskills are read through the frozen task IDs. Original first responses, selections and timestamps remain intact. The same local account Learn checkpoint row, RLS and retry/recovery mechanism apply to both scopes. No new store, hosted migration, regular Practice exposure, Progress score or adaptive selector is added.

Verification: `node --import tsx --test tests/phrase-discovery.test.ts` covers completed/pending legacy runs, unknown historical assistance, both new queues, distinct letter-order grading and unsupported versions. With the test workspace running, `node tests/l01-phrase-supplement-browser.mjs` completes all seven added checks using the local second tester, retains an intentionally incorrect first reply, resumes a letter draft, removes/reorders letters, confirms the assistance snapshot, checks mobile/completion, returns to the unchanged old run and verifies the non-tester gate. The browser test appends a local tester run without deleting previous history. All five unit checks, the seven-check browser flow and TypeScript passed. No production release or independent instructor approval is claimed.

## Visual presentation, 6 November 2026

`l01-phrase-visual-contexts.json` maps every one of the 17 tasks to a scene, name badge, introduction or origin graphic. The generator checks complete coverage and scene asset existence. Images reuse existing project L01 illustrations; no exam or book images are copied. Short captions retain answer-relevant details such as formal address. Incidental classroom/office settings are simplified to match the illustration while canonical replies and assessment bindings stay unchanged.

Learn → response → account evidence remains the existing flow. First responses now store `visualContext: "l01-context-visuals-v1"` as the configured presentation version; historical missing values parse as null. This is not evidence of viewing, visual comprehension, independent spelling or mastery. Existing assistance tags and historical first attempts are preserved. Next tasks still follow the saved guided queue, with no adaptive selection.

Verification: five unit tests and TypeScript pass. `tests/l01-phrase-visual-browser.mjs` drives nine models and all 17 checks, decodes the illustrations, checks mobile overflow, confirms the visual version on first-response payloads and verifies that the tester’s stored history is unchanged. Writes for the isolated review fixture are intercepted. Desktop and mobile screenshots were inspected. This verifies presentation and checkpoint payloads, not a new adaptive or hosted persistence integration.

## Listening correction, 6 November 2026

The unanswered S02 task now hides the name and plays German letter names (`Em. A. El. I.`) through the shared speech helper, requiring an available German voice. Playback completion unlocks checking; failures retain a retry button without revealing the name. The badge appears after checking. Teaching examples remain visible before the task, so this is supported immediate listening practice.

The source catalog retains the historical visible-name `name_letter_order` binding. Its new `listening` metadata maps the runtime variant to `L01-SUP-S02-listening-target`, `name_letter_listening`, version `name-listening-v1`, difficulty 3: decode spoken letter names without a written name, with supplied letters, prior teaching and replay. New first attempts snapshot this binding and completed playback count; old missing listening data stays null. A completed playback is not proof of attention or comprehension. The same account Learn checkpoint stores the response and draft. Next-task selection remains the fixed guided queue, with no adaptive rollout.

Verification for the correction: six unit tests pass, including preservation of historical visible-name evidence and validation of completed-play counts. The isolated browser flow passes all 17 checks and verifies no written name before checking, playback failure, two successful replays, German speech text/language, listening payload and unchanged stored tester history. Speech synthesis is stubbed in the browser test; pronunciation quality is not certified by that test.

Dialogue audio update, 6 November 2026: a tap now plays the German question followed by the spelled reply. Separate available German voices distinguish roles; a single-voice device uses different pitch. Completion is recorded only after both turns finish. Existing target/subskill, difficulty, assistance, account evidence and fixed next-task queue stay unchanged. This does not add a separately scored dialogue-comprehension target.

Fixed recording correction, 6 November 2026: the listening task now plays `/audio/l01/spelling-dialogue-v1.m4a`, generated with separate German Katja/Conrad voices and a half-second pause. `l01-dialogue-audio.json` records the authored text and synthetic voice provenance; `scripts/exercise-mapping/build-l01-dialogue-audio.py` regenerates the asset with edge-tts and afconvert. This supersedes the device-voice/pitch behavior above. The same listening binding, assistance and checkpoints remain; old attempts are preserved.

Recording verification: TypeScript passes. The full isolated browser flow now uses native HTML audio with the real AAC clip, verifies two completed replays and duration, retries after an intentionally blocked file request, confirms hidden-name/evidence behavior, and preserves the stored tester history. It no longer stubs speech synthesis for this task.

Speaker-label presentation, 6 November 2026: all model dialogues use A/B consistently. Learner-addressed task context remains intact. Existing target/subskill mappings, difficulty, assistance, first responses and next-task behavior are preserved.

Entry correction, 6 November 2026: local testers open the revised lesson through the normal `/learn/L01/phrases` route. The banner has one phrase lesson link; the supplemental set is no longer advertised as a separate lesson. Existing `/discovery` and `?part=supplement` URLs remain available to resume saved work. No account history is reset and production remains outside this local rollout.
