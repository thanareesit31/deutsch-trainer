// Run with Node 20: node --env-file=.env.local scripts/migrate-content.mjs
import pg from "pg";
import { readFile } from "node:fs/promises";
const connectionString = process.env.DATABASE_URL;
if (!connectionString)
  throw new Error("DATABASE_URL is required in .env.local");
const client = new pg.Client({
  connectionString,
  connectionTimeoutMillis: 15000,
});
try {
  await client.connect();
  for (const file of [
    "20261003010000_content_catalog.sql",
    "20261005000000_l01_verb_introductions.sql",
    "20261005010000_l01_verb_principles.sql",
    "20261005020000_l01_verb_pronoun_translations.sql",
    "20261007010000_l02_learning_content.sql",
    "20261008000000_l02_number_page_four.sql",
    "20261009000000_l02_model_spelling.sql",
    "20261009010000_l02_status_phrases.sql",
    "20261009030000_a13_lessons.sql",
    "20261009040000_a13_lesson_outlines.sql",
    "20261010000000_l13_learning_content.sql",
    "20261010010000_l13_image_learning_state.sql",
    "20261010020000_l13_verb_adjective_grammar.sql",
    "20261010030000_l13_grammar_card_split.sql",
    "20261010040000_l13_verb_learning_state.sql",
    "20261011010000_l13_place_image_vocabulary.sql",
  ]) {
    const sql = await readFile(
      new URL("../supabase/migrations/" + file, import.meta.url),
      "utf8",
    );
    await client.query(sql);
  }
  const result = await client.query(
    "select 'lessons' as kind,count(*)::int as count from public.content_lessons union all select 'items',count(*)::int from public.content_items",
  );
  console.log(JSON.stringify(result.rows));
} catch (err) {
  // Connection strings/passwords must never appear in logs.
  console.error("Content migration failed:", err.code || err.name);
  process.exitCode = 1;
} finally {
  await client.end();
}
