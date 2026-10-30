# A1.1–A1.2 practice assessment plan

Reviewed 2026-10-30. Scope: L01–L12 vocabulary, grammar and phrases. The generated inventories `a11-vocabulary-bank.json`, `a11-grammar-bank.json` and `a11-phrase-bank.json` contain every target ID, response ID, lesson, topic, subskill and canonical answer. This plan does not treat a question count as proof of mastery or of source review.

## Scope and source status

| Skill | Target and scored response coverage | Learning source | Question source |
| --- | --- | --- | --- |
| Vocabulary | 243 published words; 669 response definitions across 12 lessons | Existing `supabase/seed/catalog.json` and image learning state | Generated from published words and meanings; distractors are product authored |
| Grammar | 156 definitions across 12 lessons | L01 seed grammar, L02 learning migration, L03–L12 `grammar-discovery.ts` topics | L01/L02 source answers and variants, including L01 Satzbau and L02 W-Frage; L03–L12 reuse the discovery observe/apply questions |
| Phrases | 117 phrases; 346 definitions across 12 lessons | L01 seed phrases, L02 published patterns/status examples, L03–L12 new guided Learn cards | L03–L12 examples and all new distractors are product authored, aligned to existing lesson topics; they have not been checked against individual publisher pages |

The local Moment A1 L01–L12 PDF is the baseline's primary source. The L03–L12 phrase corpus is explicitly product authored, not a transcription or verified publisher answer. The generated bank metadata keeps this distinction outside learner pages. A publisher page and language review is still required before claiming source equivalence. All old target IDs, answers and sessions remain readable; new response IDs use an `a11` suffix or `Lxx-Pnnn` targets.

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
| Public deployment | Three migrations and feature flags required | Not verified or enabled in production as of this review |

The current corpus is below the L13/L14 benchmark of 100 scored definitions per lesson per skill in most slots, especially L03–L12 Grammar. The generated banks are an implemented prototype for review; do not report them as 36 fully equivalent production banks. Before general rollout, add and review independent grammar/phrase contexts and richer vocabulary variants to the agreed coverage target, inspect source scope, verify real-account sync and recovery for all three skills, then apply the migrations and enable the three flags in the deployed build.
