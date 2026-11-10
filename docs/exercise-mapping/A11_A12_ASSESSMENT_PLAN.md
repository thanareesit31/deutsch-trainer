# A1.1–A1.2 practice assessment plan

Reviewed 2026-10-30. Scope: L01–L12 vocabulary, grammar and phrases. The generated inventories `a11-vocabulary-bank.json`, `a11-grammar-bank.json` and `a11-phrase-bank.json` contain every target ID, response ID, lesson, topic, subskill and canonical answer. This plan does not treat a question count as proof of mastery or of source review.

The 2026-10-30 Learn completion handoff is a navigation change. It preserves the exposure, target/subskill, grading and selector bindings below. Each final content screen links to that lesson and skill's `basic` practice bank; the existing eligibility gate still decides which learned targets can be asked.

## Scope and source status

| Skill | Target and scored response coverage | Learning source | Question source |
| --- | --- | --- | --- |
| Vocabulary | 243 published words; 669 response definitions across 12 lessons | Existing `supabase/seed/catalog.json` and image learning state | Generated from published words and meanings; distractors are product authored |
| Grammar | 156 definitions across 12 lessons | L01 seed grammar, L02 learning migration, L03–L12 `grammar-discovery.ts` topics | L01/L02 source answers and variants, including L01 Satzbau and L02 W-Frage; L03–L12 reuse the discovery observe/apply questions |
| Phrases | 117 phrases; 346 definitions across 12 lessons | L01 seed phrases, L02 published patterns/status examples, L03–L12 new guided Learn cards | L03–L12 examples and all new distractors are product authored, aligned to existing lesson topics; they have not been checked against individual publisher pages |

The local Moment A1 L01–L12 PDF is the baseline's primary source. The L03–L12 phrase corpus is explicitly product authored, not a transcription or verified publisher answer. The generated bank metadata keeps this distinction outside learner pages. A publisher page and language review is still required before claiming source equivalence. All old target IDs, answers and sessions remain readable; new response IDs use an `a11` suffix or `Lxx-Pnnn` targets.

## Source audit update, 4 November 2026

[A11_A12_PHRASE_SOURCE_AUDIT.md](A11_A12_PHRASE_SOURCE_AUDIT.md) compares the 117 current phrase targets across L01–L12 with visually reviewed Kursbuch communication goals and activities. Every existing target maps to a primary communicative function or supporting context. All 12 banks have gaps. The report records the source PDF fingerprint, separate PDF/printed page references, missing or reordered source pages, and target-specific scope concerns. The reviewed metadata is in `a11-phrase-source-review.json`; regenerate or check it with `python3 scripts/exercise-mapping/audit-a11-phrases.py [--check]`.

This completes a communicative-function gap audit of the existing bank. It does not complete phrase-by-phrase publisher wording verification, Thai/distractor approval, an exhaustive inventory of partner pages and supplements, or redesigned Learn activities. The authored corpus retains its original source status. No target IDs, accepted answers, runtime content, account records or deployment changed in this audit.

The current `phrase_situation_choice` tasks show the target's Thai translation and ask for its German equivalent. Treat these results as supported meaning recognition when designing progression. They do not establish dialogue-response ability. Keep the historical subskill field and attempts readable; a new contextual response task needs its own definition and reviewed context. The report specifies the proposed subskill/evidence boundaries and missing implementation links for that work.

## Phrase expansion design, 4 November 2026

[A11_A12_PHRASE_EXPANSION_DRAFT.md](A11_A12_PHRASE_EXPANSION_DRAFT.md) adds 114 authored example situations for the 41 partial or absent core communicative functions in the source audit. `a11-phrase-expansion-draft.json` stores each example's context, German and Thai turns, source-function references, legacy associations, candidate target/response IDs, required teaching content and a provisional demand rationale. Short formula responses use level 1; contextual role, fact or time choices use level 2. Source-function review does not make the new wording a publisher transcription.

These are proposed teaching examples and assessment bindings. They are not added to the runtime bank, content catalog, answer validator or learner eligibility. Illustrative replies are not exhaustive accepted-answer lists. Independent instructor review, vocabulary/prerequisite binding, distractors, alternative replies and actual interaction design remain open. L10 announcement examples measure written information extraction; audio and warning activities still need design. The report separates comprehension, dialogue response, ordering, production and listening evidence, and records each missing link from Learn to account evidence and next-task selection.

Run `python3 scripts/exercise-mapping/review-a11-phrase-expansion.py --check` to check every audited function has draft examples and that source/legacy references, IDs, assessment profiles and the generated report remain consistent. This is a content-structure check, not a browser test or language certification. Historical IDs, answers, sessions and production content remain unchanged.

## Target, response and assistance mapping

| Target ID pattern | Taught objective | Response ID pattern and subskill | Difficulty and assistance | Scoring boundary |
| --- | --- | --- | --- | --- |
| Existing vocabulary item ID | German word with meaning and, for nouns, Artikel | `*-a11-meaning`: meaning; `*-a11-article`: Artikel; `*-a11-spelling`: spelling | Meaning has four Thai choices (1); Artikel has three choices with the target's correct color hidden (2); spelling requires typed German with Thai meaning and supplied Artikel (2) | Each response scores only its named subskill. Supplied Artikel is assistance, not independent Artikel recall. |
| L01/L02 existing grammar item ID | Pronoun, verb form, sentence order or W-Frage | `*-a11-choice` / `*-a11-cloze`, L01 `*-a11-order`, L02 W-Frage IDs; recognition, production, order or context | Choices (1), typed form or supplied words (2), subject and infinitive or Thai context supplied | Server grades the one canonical answer per response. |
| `Lxx-GD-<topic>` | One Grammar Discovery rule topic | `*-observe`: form recognition; `*-apply`: context choice | Observe with options and hint (1), apply with options and hint (2) | The current bank reuses taught questions, so correctness is practice evidence, not independent transfer or mastery. |
| L01/L02 existing phrase ID; `Lxx-Pnnn` for L03–L12 | One taught phrase and Thai meaning | `*-a11-meaning`: comprehension; `*-a11-situation`: choose German phrase; `*-a11-order`: supplied word order | Four Thai choices (1), four German choices (2), supplied words and Thai context (3) | At most one variant of a target per daily round. Ordering with supplied words does not prove free production. |

Each definition has a stable ID, target ID, topic, subskill, difficulty rationale and assistance label in the preview bank. `docs/exercise-mapping/a11-*-bank.json` is the response-level mapping. Errors between semantically close Thai distractors still need a native-language content pass. No question measures listening or spontaneous speech.

## Progression and evidence policy

| Target/subskill | Initial state and evidence | Next activity | Review rule and status |
| --- | --- | --- | --- |
| Vocabulary meaning, Artikel, spelling | Unknown until its own first checked response; image learning or exposure only grants eligibility | The daily selector favors unseen responses, prior errors and responses due after three days within the same target/subskill | Same-subskill errors stay prioritized; one correct response never promotes another subskill. Implemented as a provisional selection rule, not a calibrated mastery threshold. |
| Grammar recognition, context and typed form | Unknown until a checked response; completing a discovery topic only grants eligibility | Daily selection uses target/subskill history; current L03–L12 discovery bank lacks independent harder variants | Revisit errors and old results. No claim of independent grammar transfer or mastery. |
| Phrase comprehension, situation choice, word order | Unknown per subskill; seeing or marking a phrase learned only grants eligibility | Guided round covers learned targets once, then daily selection chooses one variant per target using history | Earlier errors and unseen variants rank ahead of recent correct answers. Supplied-word ordering stays distinct from free production. |

The selector is `planDailyPractice` in `src/lib/practice-planner.ts`, embedded in the generated preview banks. It uses first checked answer, assistance flags, target/subskill, and time since answer; its three-day interval and weights are provisional policy values in code. The same bank history drives the skill landing and frame, but a calibrated learner state and recorded per-decision rationale are still missing. The general home recommendation is not yet wired for every A1.1–A1.2 bank.

## Data flow and verification state

| Link | Implementation | Status |
| --- | --- | --- |
| Learn target → eligibility | `item_exposures` for L01/L02 and phrases; `learner_lesson_states` image and Grammar Discovery completions for L03–L12 | Implemented; browser checked one L03 path |
| Response → target/subskill evidence | Generated definition IDs in each preview and private server question catalogs | Implemented; database tests cover every canonical answer |
| First answer and help → account history | `PracticeAccountSync` → `learner_practice_sessions`; local backup and resume in shared frame | Implemented; local browser checked L03 phrase write; server tests check ownership and answer forgery |
| History → learner state | `planDailyPractice` reads target/subskill attempts and assistance | Implemented as a provisional ranking, not mastery estimation |
| Learner state → next question | Daily selection in the preview frame | Implemented; no durable decision-reason event yet |
| Shared recommendation → home and practice | Skill landing reads account history; home uses existing recommendation logic | Partially integrated; not a unified cross-bank recommendation for all L01–L12 |
| Public deployment | Three migrations applied to the configured production database on 2026-10-30; application release enables all three flags unless explicitly set to `false` | Database verified at 669/156/346 definitions; Vercel marked commit `a93cb39` successful; authenticated production browser use remains unverified |

The current corpus is below the L13/L14 benchmark of 100 scored definitions per lesson per skill in most slots, especially L03–L12 Grammar. The banks provide usable content-based coverage across all 36 lesson/skill slots; do not describe them as equal in question volume or format depth to L13/L14. Independent grammar transfer contexts, richer phrase formats, publisher-page review and a real-account browser check remain quality follow-up work. The current selection is a provisional history ranking, not calibrated mastery.

## Local L01 interactive Learn preview, 4 November 2026

[L01_PHRASE_DISCOVERY_PREVIEW.md](L01_PHRASE_DISCOVERY_PREVIEW.md) maps the ten tester-only Learn checks to candidate target IDs, source examples, objectives, subskills, assistance and account checkpoints. Five teaching screens precede the checks. The local workspace now serves this prototype; L02–L12 remain drafts. These supported learning checks do not join the regular phrase Practice validator, item exposures, Progress or adaptive selector. Local browser and type checks passed; hosted deployment and independent language approval remain outside this preview.

Supplement follow-up, 4 November 2026: [L01_PHRASE_SUPPLEMENT_REVIEW.md](L01_PHRASE_SUPPLEMENT_REVIEW.md) verifies the teacher-slide spelling request `Wie bitte? Wie schreibt man das?`, first/family-name distinctions and introduction replies. The current ten Learn checks do not cover those spelling responses. The addendum separates communication, supplied-letter order, copying and independent audio-based spelling evidence, and records the need to preserve pending/completed queues before adding screens. No runtime extension is included in that source review.

## L01 supplemental implementation, 5 November 2026

The seven additions mapped in [L01_PHRASE_DISCOVERY_PREVIEW.md](L01_PHRASE_DISCOVERY_PREVIEW.md#supplemental-activities-5-november-2026) are playable for local testers. The source-backed scenarios and response bindings are in `l01-phrase-supplement-activities.json`. First-name/surname and spelling-request choices use `phrase_dialogue_response`; visible-name/supplied-letter ordering uses a distinct `name_letter_order` target/subskill. New attempts store assistance snapshots. Legacy missing assistance is unknown, and legacy 15-screen queues are preserved by bank version. Evidence still stops at account-scoped supported Learn checkpoints; no calibrated learner state or adaptive next-task selection is implemented. Unit, browser and type checks passed locally; other lessons and hosted deployment remain outside this scope.

## L01 presentation review, 6 November 2026

All 17 local tester tasks retain their existing target/subskill, answer, demand and assistance bindings while visual context replaces long written situations. The per-task map is `l01-phrase-visual-contexts.json`. New first attempts preserve the configured visual version, historical missing versions stay unknown, and saved queue order remains unchanged. Visual context supplies facts and does not add a scored visual-comprehension target. Evidence still ends at supported Learn checkpoints; adaptive next-task selection is not implemented.

### S02 supported listening correction, 6 November 2026

Learn example → hidden-name audio letter-order response → first.listening target `L01-SUP-S02-listening-target`, subskill `name_letter_listening`, completed-play count and assistance → account Learn checkpoint. Demand is level 3 because the written name is withheld; prior example, supplied letters and replay remain assistance. Independent name spelling is not measured. Earlier visible-name first attempts retain their original assistance and null listening binding. No learner-state calibration or adaptive next-task selector is added.

Dialogue audio update, 6 November 2026: a tap now plays the German question followed by the spelled reply. Separate available German voices distinguish roles; a single-voice device uses different pitch. Completion is recorded only after both turns finish. Existing target/subskill, difficulty, assistance, account evidence and fixed next-task queue stay unchanged. This does not add a separately scored dialogue-comprehension target.

Fixed recording correction, 6 November 2026: the listening task now plays `/audio/l01/spelling-dialogue-v1.m4a`, generated with separate German Katja/Conrad voices and a half-second pause. `l01-dialogue-audio.json` records the authored text and synthetic voice provenance; `scripts/exercise-mapping/build-l01-dialogue-audio.py` regenerates the asset with edge-tts and afconvert. This supersedes the device-voice/pitch behavior above. The same listening binding, assistance and checkpoints remain; old attempts are preserved.
