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

The learner page `/learn/L14/phrases` uses the phrase inventory and four communicative functions from `KB14-G6A` (MOMENTE volume for Lektionen 13–24, printed/PDF page 16, exercise 6a). The four short dialogue situations are newly authored applications of those functions. This source mapping is internal and is not rendered in the learner page.

The branching street layout in `public/images/lektion-14-vocabulary/phrase-city-map-branching.png` was newly generated for the app using the user-provided local reference `IMG_5659.heic` as a road-topology example. The reference image remains outside published assets. It is a visual-design reference, not evidence for the German sentences or a book-page citation; neither its filename nor source details appear in learner UI.

The nine `Lokale Präpositionen` pictures in `public/images/lektion-14-vocabulary/positions-illustrated/` were generated for this app in the warm, detailed illustration style of the project's home scenes. They use a consistent wooden cubby and red ball to show spatial relations. They are not reproductions of source-book images and provide no bibliographic evidence for the grammar content. Their production note stays in project documentation, not learner UI.

The revised `Wo? + Dativ` learning table uses the three-column Nominativ / Wo? / Dativ comparison shown in the user-supplied grammar screenshot as a layout and teaching reference. The four clickable article choices and feedback are authored for the app; the screenshot itself is not a published asset. Its exact page and edition were not supplied with this screenshot, so no new page claim is made. This attribution stays internal and is never displayed to learners.

The `Sätze ergänzen` follow-up quiz uses only the look-at-a-picture-and-complete-a-sentence mechanic from the user-supplied screenshot headed “Vor dem Kaufhaus nach rechts”, exercise 4a. Its page number and exact source edition were not supplied, so neither is asserted here. The nine images in `public/images/lektion-14-vocabulary/position-quiz-scenes-v2/` were generated for this app in its warm illustration style. One orange cat appears with different reference objects: a bag, table, sofa, bed, door, fireplace, curtain, bicycle, and two chairs. The German sentences and Thai feedback are original to the app. This attribution is internal only and is never displayed to learners.

Shared IDs include `MOMENTE_A1_1_KB`, `MOMENTE_A1_2_KB`, `GRAMMATIK_AKTIV_A1_B1` and `WORTSCHATZ_A1_TRAINING`. Internal code content, the user's crossword preset and the still-unavailable L13 sheet have distinct IDs.

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
