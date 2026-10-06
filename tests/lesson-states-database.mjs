import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createDatabase, userId } from "./learning-database.mjs";
const db = await createDatabase();
const other = "22222222-2222-4222-8222-222222222222";
const key = "deutsch-trainer-alphabet-learning-v1-L01";
const state = {
  version: 1,
  learnedItemIds: ["A"],
  resumeIndex: 1,
  revisitIndex: null,
};
try {
  await db.query("insert into learner_lesson_states values ($1,$2,$3::jsonb)", [
    userId,
    key,
    JSON.stringify(state),
  ]);
  await assert.rejects(
    db.query("insert into learner_lesson_states values ($1,$2,$3::jsonb)", [
      other,
      key,
      JSON.stringify(state),
    ]),
    /row-level security/,
  );
  await db.exec(`set request.jwt.claim.sub='${other}'`);
  assert.equal(
    (await db.query("select * from learner_lesson_states")).rows.length,
    0,
  );
  assert.equal(
    (
      await db.query(
        "update learner_lesson_states set state='{}'::jsonb returning *",
      )
    ).rows.length,
    0,
  );
  await db.query(
    "insert into learner_lesson_states values ($1,$2,'{}'::jsonb)",
    [other, key],
  );
  await db.exec(`set request.jwt.claim.sub='${userId}'`);
  const replay = { ...state, resumeIndex: 30, revisitIndex: 0 };
  await db.query(
    "insert into learner_lesson_states values ($1,$2,$3::jsonb) on conflict(user_id,lesson_key) do update set state=excluded.state",
    [userId, key, JSON.stringify(replay)],
  );
  assert.deepEqual(
    (await db.query("select state from learner_lesson_states")).rows[0].state,
    replay,
  );
  for (const table of [
    "item_exposures",
    "learning_attempts",
    "knowledge_state",
  ])
    assert.equal((await db.query(`select * from ${table}`)).rows.length, 0);
  await db.exec("reset role");
  await db.exec(
    await readFile(
      new URL(
        "../supabase/migrations/20261007000000_learner_lesson_states.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.equal(
    (await db.query("select * from learner_lesson_states")).rows.length,
    2,
  );
  await db.exec("set role anon");
  await assert.rejects(
    db.query("select * from learner_lesson_states"),
    /permission denied/,
  );
  console.log(
    "Lesson persistence, replay, account isolation, anonymous access and idempotent migration passed.",
  );
} finally {
  await db.close();
}
