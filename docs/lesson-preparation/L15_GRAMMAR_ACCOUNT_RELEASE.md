# L15 grammar account integration

2026-11-25. User requests replacing the old L15 grammar Learn experience on ordinary authenticated routes with the approved five-card design, rather than requiring the preview URL.

## Scope and compatibility

Use `/learn/L15/grammar` → topic → five approved cards. The old preview URL is an alias to the same account-backed implementation, not an independent bank. Preserve all existing release card/task IDs, canonical answers, attempts, pending legacy tasks, learned eligibility and stored practice queues. Existing umbrella exposure does not fabricate completion of the new cards. User explicitly rejected the old teacher. Do not render it on L15 Learn, including old resume links. Preserve its pending record and historical evidence without displaying the old teaching UI.

## Data and evidence

Extend the existing account-scoped `deutsch-trainer-release-course-v1-L15-grammar` checkpoint with validated versioned `guidedL15` UI state. Keep active card/page, seen teaching pages, drafts, selected tokens, reviewed-model assistance and checked feedback. Restore checked answers without re-answering. Add five canonical card exposures and ten new registered question definitions; preserve the old umbrella card and questions unchanged. Register specific owner/ending/combined-reference/word-order/plural-owner bindings with the existing release task schema, shared Practice eligibility and selection.

| Taught card | Target/subskill | New checks | Difficulty/support |
| --- | --- | --- | --- |
| Owner | L15-possessivartikel-owner / possessor_reference | A13-L15-GUIDED-OWNER-01/02 | 1, explicit owner picture and supplied noun, two choices |
| Nominativ | L15-possessivartikel-ending / possessive_case_ending | A13-L15-GUIDED-NOM-01/02 | 1, root and Artikel supplied; ending selection, no independent gender/spelling evidence |
| Akkusativ | L15-possessivartikel-ending / possessive_case_ending | A13-L15-GUIDED-AKK-01/02 | 1, root/Artikel and verb context supplied |
| Connected use | L15-possessivartikel / possessive_reference_and_inflection; declarative_word_order | A13-L15-GUIDED-USE-01/02 | 2, bounded single-word production or supplied-token order; not free production |
| Plural owners | L15-possessivartikel-plural-owner / possessor_reference_plural | A13-L15-GUIDED-PLURAL-01/02 | 1, explicit owner context, meaning/root recognition |

Question version 1. Teaching pages and summary must have been seen before entering a check. Entering the checks records exposure to that card; submitting retains one deterministic first-attempt ID per guided question, exact response, correctness and reviewed-model help. Canonical server grading validates all new attempts and their required-card exposure. UI checked feedback must reference the same canonical first attempt. No confidence/mastery is inferred. Completing all new cards also grants the old umbrella exposure, enabling its existing practice bank without rewriting past evidence.

## Storage, concurrency and selection

The existing provider merges remote release states before saving and applies account RLS. Merge checked guided responses by immutable first answer, retain drafts from the newest UI checkpoint, and preserve learned exposures and old active questions. Server validation also preserves guided UI when an older client omits it. New questions participate in the existing target/subskill-based Practice selector, which uses wrong answers, help and spaced history; no new promotion thresholds or claim of fully migrated adaptive learning. Production and normal-account verification remain separate facts.

## Required verification

- Literal grading, unknown/tampered question rejection, unlearned-question rejection, immutable firsts and legacy evidence preservation.
- Ordinary-account RLS/read/write isolation and server registration; fresh and historical accounts use the normal topic route.
- Draft, checked feedback and page resume after reload and sign-in; old pending question survives new Learn usage.
- Existing Practice entry and eligibility, stored queue compatibility, new target/subskill evidence affecting shared selection.
- Desktop/tablet/mobile layout and unchanged annotated sentence roles/colors.
- Record local checks, hosted migration, production build/deployment and actual hosted ordinary-account walkthrough independently.

## Verification before deployment

Local SQL/RLS tests pass for the question registry, taught-page boundaries, immutable first answers, legacy answers/pending drafts, old-client UI preservation and account isolation. Existing release unit tests pass, and the unchanged twelve-course database suite passes. The normal-route browser test passes with two ordinary authenticated accounts, including reload/sign-in resume, partial token and text drafts, annotated colors and starting a server-validated Practice round.

The isolated production build passes. It uses only the L15 changes, leaving unrelated local lesson drafts out. A separate production-runtime walkthrough against hosted Supabase verifies the five cards and ten checks, persistence, legacy records, read/write RLS and Practice entry. Two disposable audit accounts are used; no existing learner is edited. Hosted migration registers ten questions and preserves the existing L15 checkpoint contents. Actual deployment and post-deployment checks are recorded separately in the release audit.
