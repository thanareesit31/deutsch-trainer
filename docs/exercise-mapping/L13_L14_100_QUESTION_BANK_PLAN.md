# L13–L14 question bank inventory and assessment plan

Reviewed 2026-10-29. Scope: at least 100 independently scored responses in each of Wortschatz, Grammatik and Redemittel for both lessons. Counts below refer to question/response definitions; one screen can contain multiple separately scored responses. This count is not proof of calibrated mastery.

## Bank coverage

| Lesson | Skill | Scored definitions available | Formats | Status |
|---|---|---:|---|---|
| L13 | Wortschatz | 137 standard variants, plus 88 challenge activities | meaning, Artikel, spelling, contextual use, image/article, story gaps, odd-one-out, riddles, word building, category, crossword | Existing bank exceeds 100; challenge screen count is not added to scored definitions without per-gap evidence. |
| L13 | Grammatik | 100 | choice, cloze, supplied-word order | 45-question guided bank plus 55 added target-bound definitions; 3 unrelated legacy verb prompts are retained in their source bank but excluded from the combined 100-question catalog. |
| L13 | Redemittel | 114 | contextual choice, matching, completion, comprehension, dialogue ordering, sentence ordering | Existing guided route remains 20; 94 additional definitions are available for history-selected practice. Four self-reviewed writing activities are not scored. |
| L14 | Wortschatz | 116 | meaning, spelling, Artikel, contextual choice | Existing generated bank exceeds 100. |
| L14 | Grammatik | 100 | choice, cloze, supplied-word order | 8 existing definitions plus 92 authored variants. Two older `dem Kino`/`dem Kaufhaus` prompts remain in the generator's historical source rows but are excluded from this target-bound catalog. |
| L14 | Redemittel | 100 | contextual choice, dialogue choice, matching, word order | 19 existing scored responses plus 81 authored context/dialogue variants. |

Vocabulary totals refer to the current bank definitions. Challenge activities remain a separate count unless their response storage splits each gap into an individual scored response. Never add screen counts to item counts without checking actual response units.

## Target and subskill bindings

- Reuse stable learning targets from `supabase/seed/catalog.json` and the existing phrase learning components. New response IDs are distinct from target IDs. The generated L13 Grammar catalog has 100 responses bound to 22 existing targets; L14 Grammar has 100 bound to 15 targets; L14 phrase variants add 81 responses across 17 existing phrase targets. L13 phrase extensions retain the existing 114-response mapping.
- Vocabulary evidence keeps meaning, Artikel, spelling and contextual use separate. Grammar keeps case/article, pronoun selection/production, verb use and word order separate. Redemittel keeps context, dialogue, matching, completion, comprehension and ordering separate. A shared story or screen never awards evidence to every word/rule it contains.
- L1–L12 material can appear as already-learned context, per the owner's progression assumption. It is not a new target and gets no current-lesson credit unless a response explicitly measures a separately registered target.
- Every new response has a difficulty rationale and assistance description. Variants offer different demand within a target/subskill; a format label or fixed easy-to-hard route is not learner-specific evidence.
- All nouns retain the shared Artikel and color-dot behavior. If Artikel itself is assessed, its correct gender color stays hidden until feedback. Spelling evidence remains distinct from Artikel recall.
- Provenance and exercise-source references live in project metadata only, never learner-facing prompts or feedback.

## Selection and evidence path

| Step | Current implementation and boundary |
|---|---|
| Learn → eligible | Existing L13/L14 lesson completion remains the gate for current targets. Previous-lesson material may be used as context without new mastery credit. |
| Response → target/subskill | Static L13 Grammar catalog and L14 phrase/grammar definitions carry target IDs and subskills. Matching response pairs remain separate. |
| Result → account evidence | Both phrase variant migrations and the new grammar validation migration have been applied to the production database. L13/L14 grammar sessions now sync to `learner_practice_sessions`; the server checks question definitions, learned-target exposure, canonical grading and account ownership. L14 vocabulary persistence remains as previously implemented. |
| Evidence → next task | L13/L14 Grammar daily selectors use target/subskill history in their 100-question catalogs. L14 phrase mixed/daily selection can choose a same-target variant after prior evidence, with one variant per target per round. These selectors prioritize available history; they do not establish a calibrated mastery model. |
| Production | Database migrations are applied. Application deployment is tracked in the dated changelog; availability requires the matching code deployment. |

## Content review notes

- L13 Grammar keeps the three old `finden`/`besuchen` responses in their original source bank and does not count them as current-target evidence in the combined catalog because they did not measure one of the existing L13 grammar targets. Their replacement responses measure existing `gefallen` subject-identification targets. Historical IDs and answers remain in the original bank files.
- L14 Grammar variants cover local-preposition forms and `Wo? + Dativ`, including dative plural nouns. `Häusern`, `Bäumen`, `Läden` and `Städten` add `-n`; `Museen`, `Kirchen`, `Straßen` and `Brücken` already end in `-n`. Masculine article variants use masculine nouns. Two historical responses with neuter nouns (`dem Kino`, `dem Kaufhaus`) do not measure the existing masculine `der → dem` target; their IDs and answers remain in the generator, while two new masculine examples replace them in the current 100-response catalog. Local-preposition questions show the spatial relation before the learner answers; the hidden hint alone is not needed to distinguish the answer.
- L14 Redemittel variants use authored situations and plausible alternatives tied to the 17 taught phrases. Only already-practiced targets become eligible for these variants in mixed/daily rounds; the guided first pass remains unchanged.
- Keep L13–L14 bank counts and format coverage reviewed when generators or content change. Do not infer deployment or learner ability from a complete authored bank.

## Verification state

Generation checks on 2026-10-28 produced 100 L13 Grammar definitions (22 targets, no missing target/subskill), 100 L14 Grammar definitions (15 targets, no missing target/subskill), and 81 new L14 phrase variants (17 targets; difficulty levels 1/2/3: 34/30/17). Including 19 existing L14 phrase responses gives 100. L13 phrase generation produced 114 scored definitions. Vocabulary counts were audited from the current generated inventories at 137 and 116.

The grammar account evidence path is implemented and validated for this scope. Selection uses first-answer history for the same target/subskill, assistance and time since practice. It does not yet estimate calibrated mastery or move these results into main Progress. L15–L18 remain outside this rollout.
