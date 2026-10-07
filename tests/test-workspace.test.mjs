import assert from "node:assert/strict";
import { test } from "node:test";
import { spawnSync } from "node:child_process";
import { createClient } from "@supabase/supabase-js";
import { startTestApi, password } from "../scripts/test-workspace-api.mjs";

test("catalog recovery keeps test lesson state and exposures while adding page-four numbers", async () => {
  const account = { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", email: "tester@deutsch.test", role: "authenticated", aud: "authenticated" };
  const state = { matches: { "L02-number-matching-21-100": ["L02-number-21"] } };
  const api = await startTestApi({ port: 0, restore: {
    accounts: [account],
    rows: {
      learner_lesson_states: [{ user_id: account.id, lesson_key: "deutsch-trainer-guided-learning-L02-vocabulary", state }],
      item_exposures: [{ user_id: account.id, item_id: "L02-number-21", seen_at: "2026-10-08T00:00:00Z" }],
      knowledge_state: [{ user_id: account.id, item_id: "L02-number-21", attempts: 0, correct: 0, errors: 0 }],
    },
  } });
  const client = createClient(api.url, "local-test-key", { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const login = await client.auth.signInWithPassword({ email: account.email, password });
    assert.ifError(login.error);
    const lessons = await client.from("learner_lesson_states").select("state");
    assert.ifError(lessons.error);
    assert.deepEqual(lessons.data.map((row) => row.state), [state]);
    const exposures = await client.from("item_exposures").select("item_id");
    assert.ifError(exposures.error);
    assert.deepEqual(exposures.data, [{ item_id: "L02-number-21" }]);
    const knowledge = await client.from("knowledge_state").select("item_id,attempts");
    assert.ifError(knowledge.error);
    assert.deepEqual(knowledge.data, [{ item_id: "L02-number-21", attempts: 0 }]);
    const content = await client.from("content_items").select("data").eq("lesson_id", "L02");
    assert.ifError(content.error);
    assert.deepEqual(content.data.map((row) => row.data.numberContent?.value).filter((n) => [21, 48, 63, 89, 100].includes(n)).sort((a,b) => a-b), [21,48,63,89,100]);
  } finally { await client.auth.stopAutoRefresh(); await api.close(); }
});

test("test configuration refuses production and hosted database connections", () => {
  for (const env of [
    {
      NODE_ENV: "production",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329",
    },
    {
      NODE_ENV: "development",
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
    },
    {
      NODE_ENV: "development",
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329@project.supabase.co",
    },
    {
      NODE_ENV: "development",
      DEUTSCH_TEST_WORKSPACE: "",
      NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
    },
  ]) {
    const result = spawnSync(
      process.execPath,
      ["--import", "tsx", "-e", "import('./next.config.ts')"],
      {
        env: {
          ...process.env,
          DEUTSCH_TEST_WORKSPACE: "1",
          NEXT_PUBLIC_TEST_WORKSPACE_ID: "test-config",
          ...env,
        },
        encoding: "utf8",
      },
    );
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /test workspace/);
  }
});

test("isolated workspace: Auth, actual SQL/RLS, persistence, fresh database and origin boundary", async () => {
  let api = await startTestApi({ port: 0 });
  const makeClient = () =>
    createClient(api.url, "local-test-key", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  const first = makeClient();
  const second = makeClient();
  const anonymous = makeClient();
  try {
    const content = await anonymous
      .from("content_items")
      .select("data")
      .eq("status", "published")
      .order("position")
      .range(0, 499);
    assert.ifError(content.error);
    assert.ok(content.data.length > 100);
    const forbidden = await anonymous.from("learner_lesson_states").select("*");
    assert.ok(forbidden.error, "anonymous cannot read histories");
    assert.ok(
      (
        await first.auth.signInWithPassword({
          email: api.accounts[0].email,
          password: "wrong-password",
        })
      ).error,
    );
    assert.ok(
      (
        await first.auth.signInWithPassword({
          email: "thanaree.sit@gmail.com",
          password,
        })
      ).error,
      "real account is not present",
    );
    const login = await first.auth.signInWithPassword({
      email: api.accounts[0].email,
      password,
    });
    assert.ifError(login.error);
    assert.equal((await first.auth.getUser()).data.user.id, api.accounts[0].id);
    assert.ifError((await first.auth.refreshSession()).error);
    assert.equal((await first.auth.getUser()).data.user.id, api.accounts[0].id);
    assert.ifError(
      (
        await second.auth.signInWithPassword({
          email: api.accounts[1].email,
          password,
        })
      ).error,
    );
    const [a, b] = api.accounts;
    const lesson_key = "deutsch-trainer-alphabet-learning-v1-L01";
    const state = {
      version: 1,
      learnedItemIds: ["A"],
      resumeIndex: 1,
      revisitIndex: null,
    };
    assert.ifError(
      (
        await first
          .from("learner_lesson_states")
          .upsert(
            { user_id: a.id, lesson_key, state },
            { onConflict: "user_id,lesson_key" },
          )
      ).error,
    );
    assert.deepEqual(
      (
        await first
          .from("learner_lesson_states")
          .select("state")
          .eq("user_id", a.id)
      ).data,
      [{ state }],
    );
    assert.deepEqual(
      (
        await second
          .from("learner_lesson_states")
          .select("*")
          .eq("user_id", a.id)
      ).data,
      [],
    );
    assert.ok(
      (
        await second
          .from("learner_lesson_states")
          .upsert({ user_id: a.id, lesson_key, state })
      ).error,
      "real SQL enforces RLS writes",
    );
    assert.ifError(
      (
        await first
          .from("learner_lesson_states")
          .upsert(
            { user_id: a.id, lesson_key, state: { version: 99 } },
            { onConflict: "user_id,lesson_key", ignoreDuplicates: true },
          )
      ).error,
    );
    assert.deepEqual(
      (await first.from("learner_lesson_states").select("state").single()).data
        .state,
      state,
    );
    // Concurrent requests must never run with another account's role/identity.
    const concurrent = await Promise.all(
      Array.from({ length: 12 }, (_, index) =>
        (index % 2 ? first : second).from("learner_lesson_states").select("*"),
      ),
    );
    concurrent.forEach((result, index) => {
      assert.ifError(result.error);
      assert.equal(result.data.length, index % 2 ? 1 : 0);
    });
    assert.ifError(
      (
        await first.rpc("learning_action", {
          action: "expose",
          payload: { itemId: "V001" },
        })
      ).error,
    );
    const sessionId = "33333333-3333-4333-8333-333333333333";
    assert.ifError(
      (
        await first.rpc("learning_action", {
          action: "start",
          payload: {
            sessionId,
            title: "Workspace test",
            origin: "/practice",
            questions: [
              { item: { id: "V001" }, answer: "Hallo", mode: "typing" },
            ],
          },
        })
      ).error,
    );
    assert.ifError(
      (
        await first.rpc("learning_action", {
          action: "submit",
          payload: {
            sessionId,
            position: 0,
            input: "Hallo",
            correct: true,
            evidence: [{ dimension: "spelling", correct: true }],
          },
        })
      ).error,
    );
    assert.equal(
      (await first.from("knowledge_state").select("*")).data[0].attempts,
      0,
    );
    assert.ifError(
      (
        await first.rpc("learning_action", {
          action: "confidence",
          payload: { sessionId, position: 0, confidence: "easy" },
        })
      ).error,
    );
    assert.ifError(
      (
        await first.rpc("learning_action", {
          action: "advance",
          payload: { sessionId, position: 0 },
        })
      ).error,
    );
    assert.equal(
      (await first.from("practice_sessions").select("*")).data[0].completed,
      true,
    );
    assert.deepEqual(
      (await second.from("practice_sessions").select("*")).data,
      [],
    );
    assert.ifError(
      (
        await first
          .from("learner_settings")
          .upsert({ user_id: a.id, settings: { dailyGoal: 5 } })
      ).error,
    );
    assert.deepEqual(
      (
        await second
          .from("learner_settings")
          .select("settings")
          .eq("user_id", b.id)
          .maybeSingle()
      ).data,
      null,
    );
    const contentCount = await anonymous
      .from("content_items")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .eq("skill", "vocabulary")
      .eq("data->>collection", "core");
    assert.ifError(contentCount.error);
    assert.ok(contentCount.count > 100);
    assert.equal(
      (
        await fetch(api.url + "/health", {
          headers: { Origin: "https://deutsch-trainer-gamma.vercel.app" },
        })
      ).status,
      403,
    );
    assert.equal(
      (
        await fetch(api.url + "/health", {
          headers: { Origin: "http://localhost:3002" },
        })
      ).status,
      200,
    );
    const oldId = a.id;
    const oldToken = (await first.auth.getSession()).data.session.access_token;
    assert.ifError((await first.auth.signOut()).error);
    assert.equal(
      (
        await fetch(api.url + "/auth/v1/user", {
          headers: { Authorization: `Bearer ${oldToken}` },
        })
      ).status,
      401,
    );
    await api.close();
    api = await startTestApi({ port: 0 });
    assert.notEqual(
      api.accounts[0].id,
      oldId,
      "restart rotates identity so stale browser drafts cannot be restored",
    );
    const fresh = makeClient();
    assert.ifError(
      (
        await fresh.auth.signInWithPassword({
          email: api.accounts[0].email,
          password,
        })
      ).error,
    );
    for (const table of [
      "learner_lesson_states",
      "practice_sessions",
      "learning_attempts",
      "item_exposures",
      "learner_settings",
    ])
      assert.deepEqual(
        (await fresh.from(table).select("*")).data,
        [],
        `${table} starts empty`,
      );
  } finally {
    await api.close();
  }
});
