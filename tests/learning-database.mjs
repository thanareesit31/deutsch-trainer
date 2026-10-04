// Install the optional local test dependency as documented in docs/vertical-slice-01.md.
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
export const userId = "11111111-1111-4111-8111-111111111111";
export async function createDatabase() {
  const db = new PGlite();
  await db.exec(
    `create role authenticated; create role anon; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$; grant usage on schema auth to authenticated; grant execute on function auth.uid() to authenticated; insert into auth.users values ('${userId}'),('22222222-2222-4222-8222-222222222222');`
  );
  for (const file of [
    "20261001000000_learner_data.sql",
    "20261002000000_learning_history.sql",
    "20261003000000_completed_attempts_no_response_time.sql",
    "20261003010000_content_catalog.sql",
    "20261005000000_l01_verb_introductions.sql",
    "20261005010000_l01_verb_principles.sql",
    "20261005020000_l01_verb_pronoun_translations.sql",
  ])
    await db.exec(
      await readFile(
        new URL("../supabase/migrations/" + file, import.meta.url),
        "utf8"
      )
    );
  // Additive migrations must be safe to re-run after partial SQL Editor runs.
  await db.exec(
    await readFile(
      new URL(
        "../supabase/migrations/20261003000000_completed_attempts_no_response_time.sql",
        import.meta.url
      ),
      "utf8"
    )
  );
  await db.exec(
    `set role authenticated; set request.jwt.claim.sub='${userId}';`
  );
  return db;
}
export async function action(db, action, payload) {
  await db.query("select public.learning_action($1,$2::jsonb)", [
    action,
    JSON.stringify(payload),
  ]);
}
if (process.argv[1]?.endsWith("learning-database.mjs")) {
  const db = await createDatabase();
  const sessionId = "33333333-3333-4333-8333-333333333333";
  const question = {
    item: { id: "noun" },
    answer: "der Tisch",
    mode: "typing",
  };
  await assert.rejects(
    action(db, "start", {
      sessionId,
      title: "test",
      origin: "/practice",
      questions: [question],
    })
  );
  assert.equal(
    (await db.query("select * from practice_sessions")).rows.length,
    0,
    "unseen start rolls back whole session"
  );
  await action(db, "expose", { itemId: "noun" });
  await action(db, "expose", { itemId: "noun" });
  assert.equal((await db.query("select * from item_exposures")).rows.length, 1);
  await action(db, "start", {
    sessionId,
    title: "test",
    origin: "/practice",
    questions: [question],
  });
  await assert.rejects(action(db, "advance", { sessionId, position: 0 }));
  const attempt = {
    sessionId,
    position: 0,
    input: "der Tisch",
    correct: true,
    evidence: [
      { dimension: "article", correct: true },
      { dimension: "spelling", correct: true },
    ],
  };
  await assert.rejects(
    action(db, "submit", {
      ...attempt,
      evidence: [{ dimension: "unsupported", correct: false }],
    })
  );
  assert.equal(
    (await db.query("select * from learning_attempts")).rows.length,
    0,
    "evidence failure rolls back attempt"
  );
  await action(db, "submit", attempt);
  await action(db, "submit", { ...attempt, correct: false });
  assert.equal(
    (await db.query("select * from learning_attempts")).rows.length,
    1,
    "duplicate submission is idempotent"
  );
  const pendingRow = (await db.query("select * from learning_attempts"))
    .rows[0];
  assert.equal(pendingRow.correct, true);
  assert.equal(pendingRow.confidence, null, "correct answer starts pending");
  assert.equal(pendingRow.response_ms, 0, "legacy field uses neutral default");
  let knowledge = (await db.query("select * from knowledge_state")).rows[0];
  assert.equal(
    knowledge.attempts,
    0,
    "pending attempt is absent from knowledge"
  );
  assert.equal(knowledge.correct, 0, "pending correct does not count");
  await assert.rejects(action(db, "advance", { sessionId, position: 0 }));
  await action(db, "confidence", {
    sessionId,
    position: 0,
    confidence: "easy",
  });
  knowledge = (await db.query("select * from knowledge_state")).rows[0];
  assert.equal(knowledge.attempts, 1, "easy completes the attempt");
  assert.equal(knowledge.correct, 1);
  await action(db, "advance", { sessionId, position: 0 });
  await action(db, "advance", { sessionId, position: 0 });
  assert.equal(
    (await db.query("select * from practice_sessions")).rows[0].position,
    1
  );
  for (const [nextSession, confidence] of [
    ["44444444-4444-4444-8444-444444444444", "thought"],
    ["55555555-5555-4555-8555-555555555555", "guess"],
  ]) {
    await action(db, "start", {
      sessionId: nextSession,
      title: "confidence test",
      origin: "/practice",
      questions: [question],
    });
    await action(db, "submit", { ...attempt, sessionId: nextSession });
    assert.equal(
      (await db.query("select * from knowledge_state")).rows[0].attempts,
      1 + (confidence === "thought" ? 0 : 1),
      "correct attempt is excluded until confidence is chosen"
    );
    await action(db, "confidence", {
      sessionId: nextSession,
      position: 0,
      confidence,
    });
    const saved = (
      await db.query(
        "select confidence from learning_attempts where session_id=$1",
        [nextSession]
      )
    ).rows[0];
    assert.equal(
      saved.confidence,
      confidence,
      `${confidence} completes attempt`
    );
    await action(db, "advance", { sessionId: nextSession, position: 0 });
  }
  const wrongSession = "66666666-6666-4666-8666-666666666666";
  await action(db, "start", {
    sessionId: wrongSession,
    title: "wrong answer test",
    origin: "/practice",
    questions: [question],
  });
  await action(db, "submit", {
    ...attempt,
    sessionId: wrongSession,
    correct: false,
    evidence: [
      { dimension: "article", correct: false },
      { dimension: "spelling", correct: false },
    ],
  });
  knowledge = (await db.query("select * from knowledge_state")).rows[0];
  assert.equal(knowledge.attempts, 4);
  assert.equal(knowledge.correct, 3);
  assert.equal(
    knowledge.errors,
    2,
    "wrong attempt evidence is counted immediately"
  );
  await action(db, "advance", { sessionId: wrongSession, position: 0 });
  assert.equal(
    (
      await db.query(
        "select confidence from learning_attempts where session_id=$1",
        [wrongSession]
      )
    ).rows[0].confidence,
    null,
    "wrong attempt completes without confidence"
  );
  await assert.rejects(db.query("delete from learning_attempts"));
  await db.exec(
    "set request.jwt.claim.sub='22222222-2222-4222-8222-222222222222'"
  );
  for (const table of [
    "item_exposures",
    "practice_sessions",
    "session_items",
    "learning_attempts",
    "attempt_evidence",
    "knowledge_state",
  ])
    assert.equal(
      (await db.query("select * from " + table)).rows.length,
      0,
      "RLS " + table
    );
  await assert.rejects(action(db, "submit", attempt));
  await db.close();
  console.log(
    "PASS: migration, learned boundary, atomicity, deduplication, pending/completed attempts, no response-time input, derived knowledge and RLS"
  );
}
