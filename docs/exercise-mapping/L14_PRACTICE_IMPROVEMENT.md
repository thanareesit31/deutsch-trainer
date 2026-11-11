# L14 contextual and bounded writing extension

Scope: three taught functions, asking whether walking to a destination is possible (`ask-walk`), locating a place (`ask-place`), and describing a turn at a landmark (`describe-turn`). Existing 101 independently scored canonical questions and all original guided/topic/matching flows retain their IDs, definitions and accepted answers. New mixed/daily rounds use up to ten distinct scored targets.

## Assessment and provenance

Fifteen authored activities add six contextual choices, six supported whole-sentence responses, and three less-supported whole-sentence responses. Tasks and exact bindings are in `l14-practice-extensions.json`; `l14-practice-progression-catalog.json` contains the fifteen new canonical definitions plus the baseline/extension context metadata. Situations and alternatives are product-authored, based on the already taught functions. This measures contextual response and bounded production; it does not measure free production.

New contexts require an actual earlier response in the specified prerequisite subskill. Supported writing requires first independent correct responses from two contexts and two actual Practice runs in dialogue response. Less-supported writing requires equivalent evidence in bounded production. These are provisional product thresholds. Correctness in another subskill does not promote writing. Missing help records remain unknown. Higher-stage errors cause an available lower scaffold to be chosen before a later challenge retry. Context and run counting uses saved first responses and latest evidence per context, while original historical responses remain stored.

## Account integration

Learn result map → existing learned target ID → eligible task → `learner_practice_sessions` first response/help/draft → target/subskill/context/run evidence → next new round. Existing queues remain eligible after later errors. Writing projects as canonical `cloze` questions for the shared RPC; shared bank keys and versions are unchanged. Root rollout must install new catalog and progression metadata/gates before exposing this extension to ordinary accounts.

## Presentation

Writing uses a full-sentence textarea with explicit start/skeleton/data instructions. Unanswered activities remain neutral. After checking, annotations reconstruct the exact canonical sentence with role/position metadata. Nouns in supplied vocabulary keep Artikel and shared dots/legend. Example audio uses the existing vocabulary audio service on the exact canonical answer. Choice errors and detectable destination, direction, finite verb and separable-tail errors receive response-specific explanations.

## Verification

`tests/l14-practice-progression.test.mjs` executes the actual component's pure selection, grading and restoration logic. It checks known-help requirements, two contexts versus two sessions, scaffold recovery after assisted failure, challenge retry, ten-target capacity, matching accounting, punctuation variants, wrong-writing/order restore and exact annotation reconstruction. `.audit/l14-practice-published-baseline.json` freezes all 101 published definitions, and the same test checks their equality. Full app TypeScript, mobile, database, ordinary-account and hosted rollout checks belong to root integration; they are not claimed here.
