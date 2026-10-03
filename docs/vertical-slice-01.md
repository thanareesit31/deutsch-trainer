# Vertical Slice 01 audit

- Reuse: existing shell, responsive CSS, UI primitives, content IDs, noun article + word, question controls, login and Supabase client.
- Refactor: navigation, lesson links, practice selection, feedback, session rendering, dashboard and progress.
- Replace: active learning counters/mastery with immutable attempt evidence and derived knowledge; in-memory session with persisted snapshots.
- New: Learn activity, exposure boundary, confidence, response time, transactional session RPC, RLS tables and knowledge view.

Legacy progress/settings remain intact. Legacy aggregate counters are not converted into exposures or invented attempts. No final mastery/review scheduling algorithm is introduced.

Persistence uses the existing authenticated Supabase project. Apply migrations in order, including `20261002000000_learning_history.sql`, before using the new flow. No cloud deployment is performed by this code change.

Validation: `bun test`, `bun run test:learning-db`, and (with the app running and `.env.local` configured) `bun run test:learning-browser`. The SQL test uses PGlite and exercises the real migration and RPC policies without writing to a live Supabase project.

KnowledgeState is a SQL view derived from exposures, attempts and dimension evidence. Session snapshots preserve question order/options, cursor and pending confidence. One first submission per session item is enforced by the database. Retrying mistakes creates a new session.

The Review page is separate from Practice in navigation. It includes a manual queue for items whose latest attempt was wrong or whose correct answer had confidence `thought` or `guess`. A later correct answer marked `easy` clears the item from this queue. Scheduled review intervals and mastery labels remain deferred.
