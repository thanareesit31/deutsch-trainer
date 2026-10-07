# Lektion 2 — pre-implementation audit

Date: 2026-10-07. Status: architecture audit completed; source extraction and implementation subsequently completed (see `lektion-2-content-inventory.md` and `lektion-2-implementation.md`).

This document preserves the initial audit findings and mapping. At audit time no production content or learner records were changed. The subsequent inventory and implementation report describe the completed work.

## Architecture and conventions

| Area | Observed implementation | Consequence for L02 |
| --- | --- | --- |
| Routing | `src/app/[[...path]]/page.tsx` renders `Trainer`; `trainer.tsx` dispatches paths using `usePathname` | Preserve `/learn`, `/lesson/L02`, `/learn/L02/vocabulary`, `/learn/L02/grammar` |
| Lesson entry | `LessonDetail` renders six skill cards; cards without catalog items are unavailable | Add L02 Wortschatz/Grammatik availability through existing catalog; avoid redesigning L01 |
| L01 vocabulary | Dedicated Alphabet and WORTSCHATZ entry points; image matching in five sequential categories | Keep these routes, content and behavior unchanged |
| Generic Learn | `LearnActivity` displays catalog cards and records exposure on visible content | Does not satisfy L02 retrieval-before-completion; use guided learning activities |
| Verb learning | Private `VerbLesson` in `learning-pages.tsx`; introduction, drag/tap conjugation matching, retry, summary and replay | Currently hard-coded to L01, including content filters, links and persistence key; cannot use unchanged for L02 |
| Grammar dispatch | `LearnActivity` routes grammar with `start` to `VerbLesson` without checking lesson ID | An L02 grammar route must not accidentally render L01 verbs |
| Matching | `VocabularyImageMatching` uses L01 groups, IDs, image paths and state; wrong pair retries without revealing answer | Reuse interaction conventions; extract a data-driven board rather than embedding profession names |
| Choice/audio | Alphabet `ListenAndChoose` and `FindSound`; Practice choice components use different scoring/evidence rules | Reuse Learn visual/feedback conventions; do not route L02 learning through Practice scoring |
| Audio | `german-audio.ts` supplies shared German browser voice; Alphabet audio hook plays files first and synthesizes when absent | Existing architecture is browser synthesis with optional file playback, not an established static Storage audio pipeline |
| Design | `globals.css` defines shared colors, cards, button styles and responsive layouts; `ui.tsx` has `Empty`, `Meter`, `SectionTitle` | Preserve visual language; category structure need not become menus |

Read `AGENTS.md`, `docs/PRODUCT_BASELINE.md`, `docs/content-database.md`, and the installed Next guide `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md` during this audit.

## Content source of truth and live database inspection

Production `ContentProvider` reads published `content_lessons` and `content_items`, paginated in batches of 500, ordered by position/ID. Only a missing-table `PGRST205` error activates the legacy `supabase/seed/catalog.json` bridge. Network/authorization/empty-catalog errors do not activate fallback. `src/data/*.json` is historical content, not the runtime source of truth.

Read-only checks against the configured Supabase project confirmed:

- `content_lessons`: `id`, `position`, `status`, `data JSONB`, `updated_at`.
- `content_items`: `id`, `lesson_id`, `skill`, `position`, `status`, `data JSONB`, `updated_at`.
- `learner_lesson_states`: `user_id`, `lesson_key`, `state JSONB`.
- L02 exists with title “Was macht ihr beruflich?” and 17 content items.
- Direct queries of `storage.buckets` and grouped `storage.objects` returned no rows. The Storage API also returned an empty bucket list. There is no existing bucket/path convention to reuse in this configured project.

Catalog migrations enforce JSON identity consistency, publication status and read-only learner RLS. `scripts/migrate-content.mjs` runs explicit ordered SQL files, idempotently, without touching learner history. New content belongs in SQL migrations using this pattern, not a duplicate local JSON catalog.

The historical L02 seed contains V008–V024: Ingenieur/Ingenieurin, Journalist/Journalistin, Student/Studentin, Friseur/Friseurin, Arzt/Ärztin, Lehrer/Lehrerin, Verkäufer/Verkäuferin, Kellner/Kellnerin, and Paketzusteller. These are existing catalog entries, **not a verified extraction from Moment A1**. Do not infer that they are the complete coursebook list or manufacture missing feminine forms. Existing IDs must remain stable because history references them.

## Persistence and progress

`LessonStateProvider` loads account-scoped state before rendering lessons. Supabase is authoritative; localStorage holds account-scoped pending writes only. Load failures block lesson initialization; save failures preserve pending data and expose retry. Account changes remount drafts. Legacy import requires the configured owner and verified identity.

The current SQL check constraint and pending-write whitelist accept only three L01 keys (Alphabet, image matching, verbs). L02 requires an additive constraint update plus matching provider whitelist entries; reusing an L01 key would corrupt lesson separation. Legacy import must continue to consider only the original L01 keys.

Learning history remains separate: `item_exposures`, `practice_sessions`, `session_items`, `learning_attempts`, `attempt_evidence`; `knowledge_state` is a derived view. Correct Learn interactions can mark learned/exposed using the relevant existing mechanism without creating Practice attempts, confidence or mastery. Learned IDs and highest unfinished resume position must be separate; Back/revisit must not regress either. No progress redesign is required.

## Source-material gate (initial audit; subsequently resolved)

Both normal file discovery and `rg --files -uuu` (including ignored files) found no PDFs anywhere in this repository. The three requested documents are unavailable:

1. Moment A1 Lektion 1–12, especially printed pages 14–17.
2. Worksheet Lektion 1–12.
3. Teacher slides Lektion 1–4.

Consequently no final source inventory, number spelling verification, profession list/pair verification, pronoun `es` decision, examples or teacher-vocabulary comparison has been completed. Requirements in the task describe intended scope but do not replace the requested inspection of original materials. No curriculum has been inferred from general German knowledge or online substitutes.

Follow-up inspection: the user supplied five PDF paths under `/Users/tanareesitthichoksathit/Desktop/เรียนเยอรมัน`. All five actual PDF paths are missing locally. Searching Desktop, Documents and Downloads found matching hidden `.icloud` placeholders in that directory (including Moment, worksheet, vocabulary, Buch and teacher slides), but no downloaded copies of the requested PDFs. These placeholders cannot serve as source text/pages. No download was triggered: doing so at the supplied locations would create files outside the repository, contrary to the filesystem scope. The user must make the PDFs locally available or supply their contents before extraction can proceed.

## Proposed mapping after source verification

Retain the existing JSONB catalog instead of introducing parallel content tables or local JSON:

- Store reusable content as `content_items.data` with typed optional number/pronoun/profession metadata, Thai pronunciation and source provenance (`sourceScope`, document, printed page and PDF page). Profession concepts contain explicitly verified masculine/feminine forms; no automatic `+in` derivation.
- Store activity configurations and ordered Wortschatz/Grammatik flows in `content_lessons.data`, referencing content IDs. Activities specify type, prompt/content references and distractor references; content remains independently reusable.
- Reference existing L01 `sein` content IDs for reuse; do not seed a second copy. Keep its L02 activity completion distinct from L01 lesson state.
- Keep core, teacher extensions and worksheet support traceable. Do not populate an `es` pronoun or missing profession pair until verified.
- Numbers use grouped base/tens content and verified compound-pattern activities; Handynummer references the same number content.
- Build reusable choice, audio choice and matching interactions with immediate green completion/red retry; wrong answers never reveal or highlight the correct choice/pair. Compose pronoun discrimination before conjugation.
- Extend the existing lesson-state key constraint/whitelist without altering history tables or existing L01 keys. Persist correct IDs and forward-only resume independently from the visible revisited step.

This mapping is provisional: actual source inventory must precede final types, migrations, assets and flow configuration.

## Validation status and remaining work (at initial audit)

Only documentation was added. No implementation, migration, seed records, assets, components or product behavior changed; therefore no requirement changelog entry was added. Typecheck, tests, build and browser flow validation have not been run for an L02 implementation. There is no `lint` script in `package.json`. The declared typecheck/test/build scripts use Bun, which is not currently on PATH; a repository-local Node 20 binary is available.

After the PDFs become available: extract inventory with provenance → define objectives and raw data → finalize activities/feedback/dependencies → map to JSONB → add migrations/assets → implement reusable interactions and L02 flow → connect existing persistence → validate desktop/mobile, incorrect/correct/retry, Back/Continue, reload/resume/completion and L01 regression → run available checks. Update `docs/CHANGELOG_RE.md` when user-facing behavior changes.

Intentionally deferred: all production seeding and UI implementation before source verification; Alphabet/L01 redesign; mastery, spaced repetition, progress redesign; L03+ content; copied coursebook artwork; invented profession forms, examples or asset URLs.

## Source gate resolved

The user downloaded Moment, teacher slides, vocabulary PDF and the actual worksheet Lektion 1–12. These were read from the supplied Desktop directory without modifying source files. Moment/worksheet are scanned PDFs and were visually inspected using repository-local renderings. L02 is PDF pages 14–17, printed pages 13–16. The full verified inventory and ambiguities are in `lektion-2-content-inventory.md`; production implementation and validation are in `lektion-2-implementation.md`.
