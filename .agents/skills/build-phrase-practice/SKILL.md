---
name: build-phrase-practice
description: Design or extend German sentence and Redemittel practice for a lesson in deutsch-trainer-next. Use when asked to build the phrase-practice flow for another lesson or add task formats to an existing phrase bank; not for vocabulary or grammar practice.
---

# Build sentence and Redemittel practice

Work from the repository root. This skill turns the lesson's **actual taught phrases** into a guided first round and later mixed practice. It is a design and implementation workflow, not a fixed question template. Follow `AGENTS.md`; read `docs/PRODUCT_BASELINE.md` and `docs/PRACTICE_FLOW_STANDARD.md` before changing behavior. The baseline wins if an older example differs.

Apply `../design-adaptive-learning/SKILL.md` and `docs/ADAPTIVE_LEARNING_STANDARD.md` as the shared assessment workflow. Bind each phrase task to its taught phrase or communicative objective and measured subskill; preserve separate evidence for comprehension, dialogue response, word order and production. The format sequence below is initial instructional scaffolding. Learner-specific demand and assistance must come from target/subskill evidence when adaptive selection is implemented, and must not be claimed from that sequence alone.

## Establish the lesson's evidence and coverage

1. Inspect the lesson's learning component, item IDs, topic groups, exposure/completion data, source catalog, and any existing practice bank. Read `docs/exercise-mapping/L13_PHRASES_PRACTICE.md` and `docs/exercise-mapping/L14_PHRASES_PRACTICE.md` for two implemented shapes, not as counts to copy.
2. Make a project-side inventory: taught phrase or communicative function, stable target ID, topic, proposed task, answer, Thai meaning, required situation, and source status. Keep page numbers, exercise labels, and provenance in metadata only. Mark authored scenarios and distractors as product-authored rather than publisher answers.
3. Check every question and alternative with the content the learner has actually encountered. If a dialogue sequence, fact, route, or response is missing, supply a clear authored context or omit the task. Do not pad a topic to five questions or invent an unsupported answer to reach a number.

## Shape the rounds

- The after-learning button opens question one directly. Cover the selected taught targets once each in a continuous guided round, in the lesson's topic order; no topic chooser or result screen interrupts it. Determine the count from eligible content: L13 uses 20 selected targets; L14 uses 17. Neither number is universal.
- A returning learner sees the same history-based recommendation on the home and practice overview pages: resume an unfinished round first; with no results, begin from the learned targets; after results exist, offer a short daily round (normally at most 10 scored targets). Give a short reason grounded in actual results. Offer topic selection as a secondary route when useful. Prioritize unseen targets, incorrect answers and targets due for review while mixing practiced topics. A matching screen counts its pairs as separate targets and stays together in a selected round. Preserve the selected queue, draft, checked answer and position across navigation or reload.
- Progress shows the current question and total. From question two onward, `ย้อนกลับ` reviews the previous question with its saved answer; breadcrumb navigation handles leaving the topic. Completion is a short action screen with the applicable choices to continue, practice more, or finish. Keep per-question results for later analysis without exposing a score table on this screen.
- Put recognition and context choices before dialogue response or matching, then word ordering or construction. Use only formats supported by the lesson. Multi-turn dialogue ordering and free production require a verified dialogue bank and belong in a separate advanced round.

## Reuse a phrase without repeating it

A phrase may support distinct skills. For example, first order `Kann ich zu Fuß zum Café gehen?`, then in a later mixed round show that question and choose a sensible reply. Give each variant its own stable question ID and the same target ID. Make the later variant eligible only after the original target has been practiced. Select **at most one variant of a target per round**; never inflate guided coverage by showing the same sentence in several forms back to back. Keep already-started rounds and historical attempts valid when extending the bank.

The second task must measure something new, such as understanding a question well enough to answer it. Provide any fact needed to distinguish the correct choice (`the café is nearby`, for example). Check distractors for accidental validity. A grammatical sentence can still be the wrong answer only when the given situation rules it out clearly.

## Make each question teach clearly

- Choice or dialogue tasks use a clear German question. Where a picture adds context, use the lesson's illustration style, show the relevant action or place at card size, and keep it beside vertically stacked choices on desktop and above them on narrow screens. Different situations need distinguishable pictures. Do not put source labels or the answer in the picture.
- Let learners reveal Thai meanings for words in a German prompt by pointer, focus, or tap. If one word changes meaning by context, provide a question-specific meaning. Keep the full Thai translation of the question and answer until feedback after checking.
- Matching must visibly join each chosen question and answer, permit correction before checking, and record/check each pair separately. Word-order tasks must let a learner return one placed word to its original option and preserve partial drafts.
- Show the German answer, natural Thai translation, and one short reason tied to what the task measured. Remove repeated instructions and feedback that merely repeats the prompt. For sentence construction, explain the necessary word positions and name the relevant grammar pattern; distinguish a real rule from a natural order used only in that example.

## Store, document, and verify

- Use stable task and target IDs. Preserve existing sessions, attempts, and item exposure; do not silently reset a learner when a bank grows. Phrase banks use the shared `learner_practice_sessions` store, `PracticeAccountSync`, and server-side `phrase_practice_questions` validation. Extend the existing validator to read the lesson's actual learned-target evidence source; do not create a separate lesson-state practice store for a new phrase bank. Before exposing practice to learner accounts, verify learned-target eligibility for new and saved queues (including both members of a match pair), account-scoped persistence and recovery, a database migration for new bank/question definitions, a lesson-specific feature flag, the lesson handoff, and the shared recommendation entry. Do not claim Progress integration, mastery, or production deployment unless the corresponding paths exist and have been verified.
- Update the lesson's exercise mapping/inventory, source metadata when sourced content changes, `docs/PRODUCT_BASELINE.md` for requirement changes, and dated `docs/CHANGELOG_RE.md` for every user-facing change. Source references stay out of learner-facing UI.
- Check task coverage and unique targets per round, answers and distractors, source eligibility, guided handoff, recommendation on home and practice pages, manual entry, account access, resume/back behavior, Thai feedback, image meaning and mobile layout. Run type checks and drive the changed flow in the browser with both a test account and a learner-account flag path. Stop once the changed behavior and remaining material risks are verified.
