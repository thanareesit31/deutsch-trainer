// node --env-file=.env.local scripts/migrate-lesson-states.mjs
import pg from "pg";
import { readFile } from "node:fs/promises";
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
});
try {
  await client.connect();
  for (const file of [
    "20261007000000_learner_lesson_states.sql",
    "20261007020000_l02_lesson_states.sql",
    "20261012000000_l03_l12_vocabulary_image_states.sql",
    "20261012050000_a13_l14_l15_states.sql",
    "20261014120000_grammar_discovery_states.sql",
    "20261017000000_course_learning_state_keys.sql",
    "20261018000000_l14_phrase_learning_state.sql",
    "20261019000000_l14_position_quiz_state.sql",
    "20261019010000_l14_position_quiz_cat_state.sql",
    "20261031010000_restore_lesson_state_keys.sql",
    "20261109000000_release_course_lesson_states.sql",
    "20261109001000_a13_release_course_catalog.sql",
    "20261109002000_release_shared_practice.sql",
    "20261109003000_release_health.sql",
    "20261110000000_release_practice_progression.sql",
    "20261110001000_release_practice_extension_catalog.sql",
    "20261111000000_phrase_practice_progression.sql",
    "20261111001000_phrase_practice_extension_catalog.sql",
    "20261112000000_exercise_issue_reports.sql",
  ])
    await client.query(
      await readFile(
        new URL("../supabase/migrations/" + file, import.meta.url),
        "utf8",
      ),
    );
  console.log(
    "Lesson state migration applied; existing learning history preserved.",
  );
} catch (error) {
  console.error("Lesson state migration failed:", error.code || error.name);
  process.exitCode = 1;
} finally {
  await client.end();
}
