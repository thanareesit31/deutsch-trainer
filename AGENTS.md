<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Filesystem scope

Only modify files inside this repository.

Do not create, edit, move, or delete files outside the current repository.

Do not modify system configuration, shell configuration, files in the home
directory, or files belonging to other projects.

## Product requirements and behavior

- Before changing product behavior, read `docs/PRODUCT_BASELINE.md`.
- If existing behavior conflicts with `docs/PRODUCT_BASELINE.md`, the baseline has higher priority.
- After changing a requirement or user-facing behavior, update `docs/CHANGELOG_RE.md` with the date, what changed, why, and impact.
- Do not change a core requirement without documenting its impact.

## Adaptive learning is a core requirement

For every creation or revision of lesson content or exercises, automatically apply `.agents/skills/design-adaptive-learning/SKILL.md`, even if the user does not name the skill. Read `docs/ADAPTIVE_LEARNING_STANDARD.md` with the baseline and practice flow standard. This applies to all lessons and skills.

Every changed learning target and scored response must have an explicit target/subskill mapping, a justified difficulty and assistance level, and a plan for account evidence and next-task selection. Keep recognition, meaning, Artikel, spelling, grammar, comprehension and production evidence distinct where the task supports that distinction. A fixed easy-to-hard format sequence or replaying wrong activities is not sufficient evidence of learner-specific adaptation.

Maintain the scoped assessment plan using the skill's reference template and trace Learn → response → stored evidence → learner state → next task. For presentation-only edits, preserve existing bindings and grading. Preserve historical IDs/answers and document any missing integration. Distinguish design, evidence collection, active adaptive selection and actual deployment when reporting completion; do not claim all existing lessons are migrated.

## Content source attribution protocol

- Keep source references, page numbers, exercise labels, audit notes, and provenance in project-side metadata (for example `sources`, source catalogs, inventories, and audit documents).
- Never render source attribution or internal provenance in learner-facing pages, cards, prompts, feedback, or navigation. This includes book/page/exercise labels such as `Kommunikation · Lektion 14 · Aufgabe 6a`.
- When adding or updating sourced learning content, record and review the source in the project metadata, then separately review the learner-facing copy to ensure it contains only teaching content and useful learner guidance. Show attribution only when the user explicitly asks for it.
- Apply this protocol on every content change that adds or records a source reference; update the source metadata and changelog as required, without copying the attribution into the UI.

## Practice flow standard

When implementing or changing Practice for any lesson or skill, read `docs/PRACTICE_FLOW_STANDARD.md` together with `docs/PRODUCT_BASELINE.md`. Apply the guided after-learning flow and shared recommendation/manual entry rules to the scope that has actual content and evidence. Keep the current prototype boundary explicit; do not claim other lessons or skills are implemented merely because the standard applies.

For sentence and Redemittel practice, also use the project skill at `.agents/skills/build-phrase-practice/SKILL.md` when the user asks to build or extend that practice in a lesson. The skill describes the reusable workflow; lesson-specific counts and content still come from the lesson inventory.

## Shared noun presentation

Always teach and display nouns with their Artikel, including in meaning and spelling practice. Spelling tasks show the supplied Artikel beside the answer area while assessing spelling separately. Hide the correct Artikel and its color only while that Artikel itself is the unanswered target; reveal the complete noun in feedback. Preserve grammatical case and contractions in contextual sentences rather than inserting a nominative article mechanically. Use `NounText`/`NounPrefix` from `src/components/noun-text.tsx` for standalone noun labels and supplied spelling prefixes rather than rendering bare noun strings. Reuse `ArticleDot` and `ArticleLegend` from `src/components/profession-matching.tsx` and the shared `articleColors` in `src/lib/profession-learning.ts`. Keep the color legend visible at the top while scrolling noun activities. Use blue for der, pink for die, green for das and yellow for plural die. Preserve the visible Artikel text and distinguish plural using item metadata. Do not reveal a noun's correct gender through its color when that gender itself is the unanswered assessment target.
