# Source Metadata

Source Metadata records provenance for existing activity IDs. It is separate from learner state. No database migration or learner-progress write is required.

## Storage and ownership

| File | Responsibility |
|---|---|
| `src/lib/source-catalog.ts` | Shared source IDs, document titles, exact PDF filenames, page counts, SHA-256 fingerprints and individually inspected page/activity evidence |
| `src/lib/source-metadata.ts` | Versioned metadata types, reference validation, coverage checks and the backward-compatible legacy catalog inspector |
| `src/lib/l13-l14-source-metadata.ts` | Explicit topic-to-evidence mappings and a registry joined to the actual L13/L14 lesson, topic, guided-check, exercise-set and question IDs |
| `src/lib/l13-l14-source-reviews.ts` | Explicit per-activity review decisions; cannot override activity IDs or learner state |
| `scripts/source-metadata.ts` | Maintainer commands for validation, per-activity JSON reports and source-file identification |

The existing catalog stores `content_lessons.data` and `content_items.data` as JSONB. `Lesson` and `Item` accept an optional `sourceMetadata` field for future annotated catalog records. Existing `sources`, `sourceScope`, IDs and catalog rows stay readable without this field. The new course currently lives in TypeScript, so its metadata lives in a TypeScript side registry. It is not copied into a new database.

The maintained registry covers the new L13/L14 course. It does not claim to backfill the old vocabulary catalog or activities in other lessons. `inspectLegacySourceMetadata(item)` returns `legacy_unannotated` for those records and preserves their original source claims. The check command also validates any optional metadata already present in the existing seed catalog.

## Fields

| Field | Meaning |
|---|---|
| `schemaVersion` | Version of the provenance format, currently `1` |
| `recordKey` | Unique metadata lookup key; it is not a replacement activity ID |
| `activityId`, `entityType`, `parentKey` | Existing content ID, record kind and containing lesson/topic/set |
| `level`, `lessonId`, `category` | Application course level, Lektion and learning category |
| `knowledgeTopics` | Canonical topic IDs; old exercise-topic labels are resolved through an explicit alias map without changing stored IDs |
| `activityType` | Actual activity plugin or learning-block type |
| `contentSource` | Primary topic basis first, followed by any other topic pages and the origin of newly written web content |
| `exerciseSource` | Origin of the web exercise and any separately documented template or retrospective mechanic comparison |
| `authorship` | `source_original`, `adapted`, `newly_authored` or `unknown`; the current new web activities use `newly_authored` |
| `verificationStatus`, `reviewNote` | Whether the attribution is verified, needs review or remains unverified, with the scope/limits of that review |
| `legacyClaims` | Previous `sourceRefs` retained as unverified claims, not automatically upgraded to evidence |

Each source citation includes `sourceId`, `relationship`, `printedPage`, `pdfPage`, `originalActivityId`, `verificationStatus`, `evidenceId` and `note`. Pages are one-based and are explicit `null` for repository sources. Unknown page numbers must not be estimated. Source activity IDs belong to the printed document and never replace web activity IDs.

`relationship` distinguishes topic basis, code-authored material, actual exercise templates and `comparable_mechanic`. The last value means a similar exercise was found during retrospective inspection. It does not assert that the existing web prompt was originally authored using that page.

## Registered documents and evidence

The pilot is now accessible from `/practice/L13/grammar/dativ-pilot` for the two test-workspace accounts only. `build-preview.mjs` also generates `src/data/l13-dative-preview.json` from the same learner-only projection as the offline HTML. The app embeds that document with account-scoped browser storage; source audit/bindings remain in `docs/exercise-mapping/`, and no pilot result is imported into real learning evidence.

The 2026-10-20 prompt revision moves the explicit person cue in eleven newly authored questions from a parenthetical suffix to a separate context line. Their source bindings and answer keys are unchanged. Question text version 2 documents the learner-copy change; existing saved attempts retain their original answer snapshots while the preview presents the current wording for unfinished sessions.

The current version 3 of these eleven prompts incorporates the referent into the German question itself and removes the separate context line. The underlying topic and mechanic bindings in `l13-dative-provenance.json` remain the same; the prompts, examples and explanations are newly authored. Old response and option snapshots remain intact while the pilot renderer displays the latest question text for an unfinished round.

The 2026-10-20 L13 Dativ pilot is documented in `docs/exercise-mapping/L13_DATIVE_PILOT.md`. Its 44 source records include per-blank decisions for all six dialogues in Das Training 32/1, primary Kursbuch/Arbeitsbuch activities and selected Grammatik aktiv subitems. The 15 newly authored preview questions have individual bindings in `l13-dative-provenance.json`. They are review artifacts, not imported learner activities. `build-preview.mjs` includes only the learner-question projection; source records and bindings remain outside the generated HTML. The inspected PDFs' SHA-256 values match the catalog. Publisher answer keys were not inspected.

The 2026-10-20 L13 Es gibt and Verben expansion is documented in `docs/exercise-mapping/L13_ES_GIBT_VERBEN_PILOT.md`. The source inventory `l13-other-topics-source-items.json` distinguishes in-scope tasks, worked examples, prerequisites and comparable mechanics at activity or blank level. Each of 30 new web questions has a binding in its topic-specific provenance JSON. The preview generator publishes only the learner-facing projection; source labels, pages and audit decisions stay in project metadata. This pass inspected Momente Kursbuch, Momente Arbeitsbuch and Grammatik A1 – das Training. The Grammatik aktiv PDF was unavailable in this workspace, so no new claim is based on its pages. The new banks have author review only and remain isolated from the main Progress system.

The reinspection corrects two scope assumptions: Grammatik aktiv 23 on printed 58/PDF 54 is explicitly A2, and every prompt of 21/3 on printed 54/PDF 50 combines Akkusativ and Dativ objects. `GA-VERB-58` and `GA-PRON-54` retain their evidence IDs with narrower notes; `GA-PRON-55` records the inspected short-answer exercise 21/4. A compatible mechanic does not approve an entire chapter for L13. The preview has isolated browser storage and does not create source-derived exposure or real learning evidence.

The learner page `/learn/L14/phrases` uses the phrase inventory and four communicative functions from `KB14-G6A` (MOMENTE volume for Lektionen 13–24, printed/PDF page 16, exercise 6a). The four short dialogue situations are newly authored applications of those functions. This source mapping is internal and is not rendered in the learner page.

The branching street layout in `public/images/lektion-14-vocabulary/phrase-city-map-branching.png` was newly generated for the app using the user-provided local reference `IMG_5659.heic` as a road-topology example. The reference image remains outside published assets. It is a visual-design reference, not evidence for the German sentences or a book-page citation; neither its filename nor source details appear in learner UI.

The L13 advanced vocabulary challenge originally used four interaction patterns from a user-supplied Arbeitsbuch screenshot. On 2026-10-24, the corresponding project-rendered Momente A1.2 AB printed p6 / PDF p5 was re-opened and checked against inventory entries AB12-13-1, AB12-13-2, AB12-13-3a and AB12-13-3b. Momente KB printed/PDF p12 Schnelltest W was visually reviewed for word-part assembly, and Wortschatz A1 – das Training printed p36 / PDF p35 B7/3 was reviewed for category sorting. The latter's food content is adapted only as a semantic-classification mechanic; the new activity content uses taught city vocabulary. The 50 added activities are newly authored, yielding a bank of 62 activities with 78 response slots. Existing project illustrations are reused; no publisher passage, image, map, grid or attribution is rendered to learners. Each activity's evidence ID, exact source page/activity, authored-content status and adaptation note appear in `docs/exercise-mapping/l13-vocabulary-challenge-sources.json`, reproducibly checked by `scripts/exercise-mapping/audit-l13-vocabulary-challenge.mjs`. This is format provenance, not a claim of publisher validation of new answers.

The nine `Lokale Präpositionen` pictures in `public/images/lektion-14-vocabulary/positions-illustrated/` were generated for this app in the warm, detailed illustration style of the project's home scenes. They use a consistent wooden cubby and red ball to show spatial relations. They are not reproductions of source-book images and provide no bibliographic evidence for the grammar content. Their production note stays in project documentation, not learner UI.

The revised `Wo? + Dativ` learning table uses the three-column Nominativ / Wo? / Dativ comparison shown in the user-supplied grammar screenshot as a layout and teaching reference. The four clickable article choices and feedback are authored for the app; the screenshot itself is not a published asset. Its exact page and edition were not supplied with this screenshot, so no new page claim is made. This attribution stays internal and is never displayed to learners.

The `Sätze ergänzen` follow-up quiz uses only the look-at-a-picture-and-complete-a-sentence mechanic from the user-supplied screenshot headed “Vor dem Kaufhaus nach rechts”, exercise 4a. Its page number and exact source edition were not supplied, so neither is asserted here. The nine images in `public/images/lektion-14-vocabulary/position-quiz-scenes-v2/` were generated for this app in its warm illustration style. One orange cat appears with different reference objects: a bag, table, sofa, bed, door, fireplace, curtain, bicycle, and two chairs. The German sentences and Thai feedback are original to the app. This attribution is internal only and is never displayed to learners.

Shared IDs include `MOMENTE_A1_1_KB`, `MOMENTE_A1_2_KB`, `GRAMMATIK_AKTIV_A1_B1` and `WORTSCHATZ_A1_TRAINING`. Internal code content, the user's crossword preset and the still-unavailable L13 sheet have distinct IDs.

The 25 L13 picture-Artikel tasks are original web tasks requested after the user's two visual quiz references on 2026-10-24. They reuse the project's existing L13 picture vocabulary and assets; the screenshots are mechanic references only and are not shipped. Each task records its item-level Artikel assessment binding in `l13-vocabulary-challenge-sources.json` using `DEUTSCH_TRAINER_ORIGINAL` / repository inspection, with no publisher page claim. The bare noun is supplied to disambiguate synonyms with different genders. Details: `docs/exercise-mapping/L13_PICTURE_ARTICLE_PRACTICE.md`.

For `crossword-city-places`, the verified format reference is MOMENTE A1.2 AB printed p6 / PDF p5, L13/3b (`AB12-13-3b`). The new six-row puzzle uses project-authored clues and a highlighted vertical solution column. The user additionally reported this mechanic in the teacher's sheet; `SHEET_L13` remains uninspected with unknown page and fingerprint. This report does not establish a sheet page citation. The activity's format provenance is recorded in `l13-vocabulary-challenge-sources.json`; no provenance is shown to learners.

The 2026-10-19 A1.3 source review also registers `GRAMMATIK_A1_DAS_TRAINING` and `SCHREIBEN_A1_DAS_TRAINING` with exact PDF filenames, page counts and fingerprints. Individually inspected pages are evidence in `source-catalog.ts`; the corrected L13–L18 topic map and the distinction between book exercises and proposed web interactions are in `docs/A13_EXERCISE_SOURCE_MAPPING.md`. Registration alone does not assign either book to an existing learner activity.

The consolidated A1.3 exercise analysis is in `docs/exercise-mapping/A1_3_L13-L18_Exercise_Mapping_Codex.md`. It covers all 36 lesson and skill slots for L13–L18, records which source activities have been inspected, and lists the 90 tester-only grammar questions with their provenance bindings. The document explicitly marks uninspected exercises and missing banks. The JSON inventories, banks, and provenance files remain authoritative when this readable snapshot needs updating.

On 2026-10-20 the user supplied the local Grammatik aktiv PDF path for a further visual review. `docs/exercise-mapping/a13-item-level-source-audit.json` records 545 source audit units across Momente Arbeitsbuch L15–L18, Grammatik aktiv, Grammatik A1 – das Training, and Schreiben A1 – das Training. These include response slots, activity records, groups, and printed examples. `labelKind` distinguishes printed numbers from internal table/group slot IDs. The count is not a count of deployable web questions. The 34 selected Momente Kursbuch activities have been checked against page images; they remain a selected subset. The supplied Kursbuch excerpt omits its printed solutions page 105, but separate [Kursbuch](https://www.hueber.de/media/36/Momente_A1_2_KB_Loesungen.pdf) and [Arbeitsbuch](https://edit.hueber.de/media/36/Momente_AB_A1_2_Loesungen.pdf) publisher keys were located online. The three supplied supplemental books contain answer sections; see `docs/exercise-mapping/a13-publisher-key-review.json` for the per-record location and review state. The per-record review currently compares 105 short fixed answers (71 Momente Arbeitsbuch and 34 Grammatik aktiv), 14 sentence rows (7 Momente Arbeitsbuch and 7 Grammatik A1 – das Training), and 5 multi-answer activities against the publisher solutions. All 107 `in_scope` source units now have a fixed, row, activity, or open-answer review state. Open responses, printed models, and the remaining unmatched slots are explicitly separate. This source review does not approve the previously authored prototype questions or make 545 web questions ready. Source labels remain project-side metadata and are not displayed to learners.

Source-volume identity is independent of application level. L13/L14 still use application level A1.3 according to the product baseline. Their source volume is registered under `MOMENTE_A1_2_KB`, identifying the supplied Kursbuch file for Lektionen 13–24. No learner-level migration is performed.

Examples checked visually in the exact fingerprinted PDFs:

| Source | Printed page | PDF page | Source activity |
|---|---:|---:|---|
| MOMENTE, Dativ pronouns | 11 | 11 | 5a |
| Grammatik aktiv, Dativ-pronoun cloze | 54 | 50 | 21/3 |
| Grammatik aktiv, spatial prepositions | 86 | 82 | 35/1 |
| Wortschatz, hotel crossword | 33 | 32 | B6/8 |
| Wortschatz, word search | 48 | 47 | B9/4 |

These are individual observations. The validator never applies a guessed offset to other pages. Source files and rendered book pages remain outside published application assets; the registry contains bibliographic and locator information only.

## Review rules

- A verified citation must match a registered evidence record exactly, including both page numbers and the original activity ID. Book evidence also identifies the inspected PDF by fingerprint.
- A verified topic attribution confirms that a topic occurs on the page. It does not certify every web prompt, answer or teaching decision.
- New prompts retain `needs_review` until their individual scope and exact mechanic attribution have been checked. A valid metadata record can therefore still produce a review warning.
- The current VOC-09 multi-select activities are explicitly flagged as different from the inspected word-search grid. They do not receive the word-search template citation merely because their pattern name says word search.
- The L14 reading/writing tasks and L13 added listening tasks distinguish a book knowledge basis from an identical source activity or official recording. Web audio scripts remain newly authored.
- No source details are inferred for old unannotated activities. Do not replace a missing page or activity code with a plausible number.

Initial implementation snapshot (before supplemental/Arbeitsbuch additions): 214 metadata records were present: 18 lesson/topic attribution records and one individually inspected cloze-question attribution have been verified; 195 guided-check/set/question records retain explicit individual-review warnings. Reviewing one question does not upgrade its parent set or neighboring questions. These counts are reported by the tool and may change when content or reviews change.

## Inspect and validate

```sh
npm run sources:check
npm run sources:report -- --id l13-gr-cloze-1
npm run sources:report -- --id L14-VOC-CROSSWORD
npm run sources:report > source-report.json
npm run sources:check -- --strict
npm run test:sources
```

`report` returns the source catalog, inspected evidence, matched metadata and review issues as JSON. An unknown ID fails rather than receiving a fabricated source. When an activity ID is reused in more than one parent, the report returns every match; pass the full `recordKey` to select one record.

The normal build runs `sources:check` before Next.js. Missing required metadata, unknown source IDs, invalid page numbers, evidence mismatches, broken parent/topic links and changed content IDs fail the check. Explicit pending-review statuses produce warnings; `--strict` treats them as a release blocker.

To confirm that a PDF is the same file as the reviewed edition:

```sh
npm run sources:verify-file -- GRAMMATIK_AKTIV_A1_B1 "/path/to/Grammatik aktiv A1-B1 [2. aktualisierte Ausgabe].pdf"
```

A different fingerprint fails. Inspect the new file and add new evidence before changing the registered document identity or page mappings.

## Add or review content

For a new knowledge topic, add its explicit evidence mapping in `l13-l14-source-metadata.ts`. Missing mappings fail immediately. New sets and questions inherit only the mapped topic basis and their code-authored origin, and enter the review queue. Record actual template use separately from retrospective similarity. To confirm a source page, inspect it, record the document fingerprint and both page numbers, then register a specific evidence record in `source-catalog.ts`.

After inspecting an individual activity, add a complete review decision under its existing `recordKey` in `l13-l14-source-reviews.ts`. State exactly what was verified and when. The registry rejects decisions with no matching activity, and validates overridden citations against the same evidence rules. The checked `l13-gr-cloze-1` question demonstrates this workflow.

The registry is a maintainer tool and is not imported by learner pages. Its reports do not read or modify cloud databases, sessions, attempts, Progress or Mastery.


## Phase 2 additions

Inventory and inspected page pairs: `docs/PHASE2_EXERCISE_INVENTORY.md`. New questions live in `src/lib/l13-l14-supplemental-exercises.ts`; explicit review decisions remain in `l13-l14-source-reviews.ts`. New activity IDs are `L13-SUP-SEARCH`, `L14-SUP-SEARCH`, `L13-SUP-CONTEXT`, `L14-SUP-CONTEXT`. All12Phase2 records are verified; at that phase the total was33verified/193needs_review. Picture Crossword remains the existing preset activity and its two metadata records were individually reviewed. Supplemental crossword citations remain comparable mechanics with text clues, not falsely attributed picture exercises.

Run `npm run test:phase2` for unit/metadata/regression coverage. `npm run test:phase2-browser` requires a local workspace and successful DB persistence; it must fail on rejected writes. `PHASE2_UI_ONLY=1 npm run test:phase2-browser` explicitly limits the claim to interactions and responsive layout, not result saving. At Phase2 conclusion, DB writes were blocked by allowlist rejection (23514). The Arbeitsbuch follow-up resolves this locally; see the current section below.


## MOMENTE Arbeitsbuch additions (2026-10-17)

Register IDs `MOMENTE_A1_1_AB` / `MOMENTE_A1_2_AB` in `source-catalog.ts`; actual page/activity evidence is driven by `src/data/momente-arbeitsbuch-inventory.json`. A1.1 identity evidence is separate from L13–14 exercise use; protected lessons are not modified. L14/4a includes a separate scene-page citation because its picture and answer locations span printed10–11/PDF9–10.

New content: `l13-l14-arbeitsbuch-exercises.ts`; explicit reviewed citations: `l13-l14-arbeitsbuch-source-reviews.ts`. Every new set/question cites Kursbuch in contentSource and Arbeitsbuch in exerciseSource, with project-authored public prompts. New records25allverified; registry total251records =58verified/193needs_review. Inventory45entries are source evidence, not45new web exercises. Inspect e.g. `npm run sources:report -- --id L14-AB-CODEWORD`.

The earlier DB allowlist blocker is resolved **locally** by `20261017000000_course_learning_state_keys.sql`, preserving the entire previous constraint expression and RLS. It remains unapplied to Production. The strict Phase2 browser gate now tests actual saving rather than UI-only behavior. No new storage table or schema-version migration is introduced for Source Metadata.


The 2026-10-21 practice UI revision adds `docs/exercise-mapping/practice-thai-support.json`, containing newly authored Thai sentence translations for all 90 prototype questions and word meanings. This is learner support, not a new book-source claim. The preview generators include these teaching fields while keeping source references and audit notes in project metadata. Answer keys and question versions remain unchanged.

The 2026-10-22 tooltip update adds newly authored Thai noun-phrase meanings to `practice-thai-support.json`. Phrase lookup groups articles and nouns before individual-word lookup; the generated learner projection contains teaching support only. No new external source claim or source text was added.

The 2026-10-22 Dativ feedback copy correction moves assessment-design remarks for DAT-010 and DAT-011 into internalReviewNotes, excluded by the learner projection. The new feedback explains the verb and Dativ form directly. Source bindings and accepted answers are unchanged.

The 2026-10-22 learner-feedback review covers all 90 prototype questions in L13–L18. `practice-feedback.json` stores newly authored, question-specific Thai explanations and is consumed by the bank generators. It contains teaching copy only and no source attribution. Existing source bindings and accepted answers remain unchanged. Generic duplicate error prose was removed from the shared renderer; historical attempts retain their original answer snapshots while feedback and summaries display the current explanation.


## L13 vocabulary practice, 22 October 2026

Internal manifest: docs/exercise-mapping/l13-vocabulary-bank.json. Generator: scripts/exercise-mapping/build-l13-vocabulary.mjs. Repository inspection covers all 49 L13 vocabulary item IDs from supabase/seed/catalog.json and groups from src/lib/vocabulary-image-content.ts. Created 137 original web tasks, with sourceId DEUTSCH_TRAINER_ORIGINAL and no asserted publisher page or copied exercise label. Provenance stays in the internal manifest; generated learner previews contain teaching content and stable learning item IDs only. Existing upstream book metadata is not a claim of new visual PDF inspection. Coverage and UX rationale: docs/exercise-mapping/L13_VOCABULARY_PRACTICE.md.


22 October2026 release check: compared all49 L13 vocabulary word/meaning records against the published real-account content catalog; zero mismatched IDs. The137 repository-derived exercises now also have a private server validation catalog generated from the same question definitions. This does not add or claim publisher exercise/page verification. Provenance stays internal; simplified learner feedback contains teaching content only.


## L13 phrases, 22 October2026

Generator: scripts/exercise-mapping/build-l13-phrases.mjs. Internal manifest: docs/exercise-mapping/l13-phrases-bank.json. Derived90 original web tasks from the29 existing L13 phrase items in supabase/seed/catalog.json and retained their source group IDs. Repository inspection plus comparison with published real-account answer/meaning records found zero mismatched IDs. Provenance uses DEUTSCH_TRAINER_ORIGINAL with publisherPage=null; this does not claim publisher exercise/page inspection or add rows to the545-record grammar source audit. Each dialogue records all required source item IDs. No source attribution or audit language is emitted to learner prompts or feedback.


## L13 phrase topic sequence, 2026-10-22

Source ID DEUTSCH_TRAINER_ORIGINAL. Existing answer phrases and meanings: supabase/seed/catalog.json, L13-R001–R029. New authored dialogue cues, factual contexts and distractors: scripts/exercise-mapping/l13-phrase-sequence.mjs. Active inventory: docs/exercise-mapping/L13_PHRASES_TOPIC_SEQUENCE.md and l13-phrases-bank.json. Twenty tasks use twenty distinct learned target items. Matching rows share a group and retain independent response IDs. No publisher page or exercise is asserted for these new prompts. Original learning content is unchanged; legacy question provenance remains in the internal inventory.
