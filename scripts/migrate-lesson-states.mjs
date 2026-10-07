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
