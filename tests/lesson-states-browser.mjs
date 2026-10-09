import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import {
  createDatabase,
  userId as fixtureUserId,
} from "./learning-database.mjs";
import rawVocabulary from "../src/data/vocabulary.json" with { type: "json" };
import { readFile } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const context = await browser.newContext();
const page = await context.newPage();
let activeUserId;
let failSaves = false;
let failReads = false;
let lessonWrites = 0;
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("dialog", (dialog) => void dialog.accept());
page.setDefaultTimeout(20000);
page.on("console", (m) => {
  if (m.type() === "error") console.log("browser console:", m.text());
});
const db = await createDatabase();
const env = await readFile(new URL("../.env.local", import.meta.url), "utf8");
const projectUrl = env
  .match(/^NEXT_PUBLIC_SUPABASE_URL=(.*)$/m)?.[1]
  ?.trim()
  .replace(/^['"]|['"]$/g, "");
if (!projectUrl)
  throw new Error(
    "Set NEXT_PUBLIC_SUPABASE_URL in .env.local to run the browser flow test.",
  );
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const userId = env
  .match(/^NEXT_PUBLIC_LEGACY_LESSON_OWNER_ID=(.*)$/m)?.[1]
  ?.trim();
if (!userId)
  throw new Error(
    "Configure the verified legacy owner for this migration test",
  );
await db.exec("reset role");
await db.query(
  "insert into auth.users(id) values ($1) on conflict do nothing",
  [userId],
);
await db.exec(`set role authenticated; set request.jwt.claim.sub='${userId}'`);
activeUserId = userId;
const host = new URL(projectUrl).host;
const ref = new URL(projectUrl).hostname.split(".")[0];
await page.addInitScript(
  ({ userId, ref }) => {
    localStorage.setItem(
      "sb-" + ref + "-auth-token",
      JSON.stringify({
        access_token: "test-access",
        token_type: "bearer",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: "test-refresh",
        user: {
          id: sessionStorage.getItem("test-user-id") ?? userId,
          email: "learner@example.test",
          aud: "authenticated",
          role: "authenticated",
          app_metadata: { provider: "email", providers: ["email"] },
          user_metadata: {},
          created_at: new Date().toISOString(),
        },
      }),
    );
  },
  { userId, ref },
);
await context.route(projectUrl + "/**", async (route) => {
  const req = route.request(),
    u = new URL(req.url()),
    parts = u.pathname.split("/").filter(Boolean),
    headers = {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "*",
      "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
      "content-type": "application/json",
    };
  if (req.method() === "OPTIONS")
    return route.fulfill({ status: 204, headers });
  let status = 200,
    result = [];
  try {
    if (parts[0] === "auth" && parts[1] === "v1" && parts[2] === "user")
      result = {
        id: activeUserId,
        email: "learner@example.test",
        aud: "authenticated",
        role: "authenticated",
        app_metadata: { provider: "email", providers: ["email"] },
        user_metadata: {},
        created_at: new Date().toISOString(),
      };
    else if (
      parts[0] === "rest" &&
      parts[1] === "v1" &&
      parts[2] === "rpc" &&
      parts[3] === "learning_action"
    ) {
      const body = JSON.parse(req.postData());
      await db.query("select public.learning_action($1,$2::jsonb)", [
        body.action,
        JSON.stringify(body.payload),
      ]);
      result = null;
    } else if (
      parts[0] === "rest" &&
      parts[1] === "v1" &&
      parts[2] === "learner_lesson_states" &&
      req.method() === "POST"
    ) {
      lessonWrites += 1;
      if (failSaves)
        return route.fulfill({
          status: 503,
          headers,
          body: JSON.stringify({ message: "test offline" }),
        });
      const body = JSON.parse(req.postData());
      await db.query(
        `insert into learner_lesson_states(user_id,lesson_key,state) values ($1,$2,$3::jsonb)
        on conflict(user_id,lesson_key) ${req.headers()["prefer"]?.includes("ignore-duplicates") ? "do nothing" : "do update set state=excluded.state"}`,
        [body.user_id, body.lesson_key, JSON.stringify(body.state)],
      );
      result = null;
    } else if (parts[0] === "rest" && parts[1] === "v1") {
      const table = parts[2];
      if (table === "learner_lesson_states" && failReads)
        return route.fulfill({
          status: 503,
          headers,
          body: JSON.stringify({ message: "test read failure" }),
        });
      let rows = (await db.query("select * from public." + table)).rows;
      for (const [key, value] of u.searchParams) {
        if (
          key === "select" ||
          key === "order" ||
          key === "offset" ||
          key === "limit"
        )
          continue;
        if (["user_id", "lesson_key"].includes(key) && value.startsWith("eq."))
          rows = rows.filter((r) => r[key] === value.slice(3));
      }
      const range = req.headers()["range"];
      if (range) {
        const [lo, hi] = range.split("-").map(Number);
        rows = rows.slice(lo, hi + 1);
      }
      result = req.headers()["accept"]?.includes("vnd.pgrst.object")
        ? (rows[0] ?? null)
        : rows;
    } else {
      status = 404;
      result = { message: "mock endpoint not found" };
    }
  } catch (e) {
    status = 400;
    result = { message: e.message, code: "MOCK_DB_ERROR" };
  }
  return route.fulfill({ status, headers, body: JSON.stringify(result) });
});
const alphabet = JSON.parse(
  await readFile(new URL("../src/data/alphabet.json", import.meta.url), "utf8"),
);
const alphabetKey = "deutsch-trainer-alphabet-learning-v1-L01";
const imageKey = "deutsch-trainer-vocabulary-image-learning-v1-L01";
const legacyAlphabet = {
  version: 1,
  learnedItemIds: alphabet.items.map((i) => i.id),
  resumeIndex: 30,
  revisitIndex: null,
};
await page.addInitScript(
  ({ key, state }) => {
    if (!sessionStorage.getItem("legacy-seeded")) {
      localStorage.setItem(key, JSON.stringify(state));
      sessionStorage.setItem("legacy-seeded", "yes");
    }
  },
  { key: alphabetKey, state: legacyAlphabet },
);
async function waitSaved() {
  await page.waitForFunction(
    (userId) =>
      !localStorage.getItem(`deutsch-trainer-pending-lessons:${userId}`),
    userId,
  );
}
try {
  await page.goto(base + "/learn/L01/vocabulary/alphabet");
  await page.getByLabel("กระดานตัวอักษรภาษาเยอรมัน").waitFor();
  await waitSaved();
  assert.deepEqual(
    (
      await db.query(
        "select state from learner_lesson_states where lesson_key=$1",
        [alphabetKey],
      )
    ).rows[0].state,
    legacyAlphabet,
  );
  assert.equal(
    await page.evaluate((key) => localStorage.getItem(key), alphabetKey),
    null,
  );
  await page.getByRole("button", { name: "เรียนซ้ำ", exact: true }).click();
  await page.locator(".alphabet-item-progress-track").waitFor();
  await waitSaved();
  let state = (
    await db.query(
      "select state from learner_lesson_states where lesson_key=$1",
      [alphabetKey],
    )
  ).rows[0].state;
  assert.equal(state.revisitIndex, 0);
  assert.equal(state.resumeIndex, 30);
  assert.equal(state.learnedItemIds.length, 30);
  // Clear browser storage, keeping the auth token: resume must come from the database.
  await page.evaluate((ref) => {
    const token = localStorage.getItem("sb-" + ref + "-auth-token");
    localStorage.clear();
    localStorage.setItem("sb-" + ref + "-auth-token", token);
  }, ref);
  await page.reload();
  await page.locator(".alphabet-item-progress-track").waitFor();
  assert.equal(
    await page.locator(".alphabet-set-progress-count").innerText(),
    "เรียนแล้ว 0 / 30 คำ",
  );
  await page.goto(base + "/learn/L01/vocabulary/core-images");
  await page.locator(".vocabulary-image-matching").waitFor();
  await page.getByRole("button", { name: "Hallo", exact: true }).click();
  await page.locator(".vocabulary-image-picture").nth(2).click();
  await page.locator(".vocabulary-image-paired-card").waitFor();
  await waitSaved();
  const ids = (
    await db.query(
      "select state from learner_lesson_states where lesson_key=$1",
      [imageKey],
    )
  ).rows[0].state;
  assert.equal(ids.length, 1);
  await page.reload();
  await page.locator(".vocabulary-image-paired-card").waitFor();
  assert.equal(await page.locator(".vocabulary-image-word").count(), 3);
  // A failed save must retain the current board and offer a retry.
  failSaves = true;
  await page.getByRole("button", { name: "Guten Morgen", exact: true }).click();
  await page.locator(".vocabulary-image-picture").nth(2).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "บันทึกบทเรียนไม่สำเร็จ" })
    .waitFor();
  assert.equal(await page.locator(".vocabulary-image-paired-card").count(), 2);
  assert.equal(
    (
      await db.query(
        "select state from learner_lesson_states where lesson_key=$1",
        [imageKey],
      )
    ).rows[0].state.length,
    1,
  );
  // Refresh while saving is unavailable: the pending draft must survive.
  await page.reload();
  await page.locator(".vocabulary-image-paired-card").nth(1).waitFor();
  await page
    .getByRole("alert")
    .filter({ hasText: "บันทึกบทเรียนไม่สำเร็จ" })
    .waitFor();
  failSaves = false;
  await page.getByRole("button", { name: "ลองอีกครั้ง", exact: true }).click();
  await waitSaved();
  assert.equal(
    (
      await db.query(
        "select state from learner_lesson_states where lesson_key=$1",
        [imageKey],
      )
    ).rows[0].state.length,
    2,
  );
  // A different verified account in the same browser gets its own empty lesson.
  // An existing cloud record must win over stale local prototype data.
  await page.evaluate(
    ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
    {
      key: alphabetKey,
      state: { ...legacyAlphabet, learnedItemIds: [], resumeIndex: 0 },
    },
  );
  await page.reload();
  await page.locator(".vocabulary-image-paired-card").nth(1).waitFor();
  assert.equal(
    (
      await db.query(
        "select state from learner_lesson_states where lesson_key=$1",
        [alphabetKey],
      )
    ).rows[0].state.resumeIndex,
    30,
  );
  assert.equal(
    await page.evaluate((key) => localStorage.getItem(key), alphabetKey),
    null,
  );
  // A non-owner must neither import nor delete unowned prototype data.
  await page.evaluate(
    (key) => localStorage.setItem(key, JSON.stringify(["legacy-owner-only"])),
    imageKey,
  );
  activeUserId = fixtureUserId;
  await page.evaluate(
    (id) => sessionStorage.setItem("test-user-id", id),
    fixtureUserId,
  );
  await db.exec(`set request.jwt.claim.sub='${fixtureUserId}'`);
  // A read failure must block the lesson rather than overwrite cloud data with an empty draft.
  failReads = true;
  const writesBeforeReadFailure = lessonWrites;
  await page.reload();
  await page
    .getByRole("alert")
    .filter({ hasText: "โหลดสถานะบทเรียนไม่สำเร็จ" })
    .waitFor();
  assert.equal(await page.locator(".vocabulary-image-word").count(), 0);
  assert.equal(lessonWrites, writesBeforeReadFailure);
  failReads = false;
  await page.getByRole("button", { name: "ลองอีกครั้ง", exact: true }).click();
  await page.locator(".vocabulary-image-word").nth(3).waitFor();
  assert.equal(await page.locator(".vocabulary-image-paired-card").count(), 0);
  assert.equal(
    await page.evaluate((key) => localStorage.getItem(key), imageKey),
    JSON.stringify(["legacy-owner-only"]),
  );
  assert.equal(
    (await db.query("select * from learner_lesson_states")).rows.length,
    0,
  );
  activeUserId = userId;
  await page.evaluate(
    (id) => sessionStorage.setItem("test-user-id", id),
    userId,
  );
  await db.exec(`set request.jwt.claim.sub='${userId}'`);
  await page.reload();
  await page.locator(".vocabulary-image-paired-card").nth(1).waitFor();
  assert.equal(
    (await db.query("select * from learning_attempts")).rows.length,
    0,
  );
  assert.deepEqual(errors, []);
  console.log(
    "Legacy import/cloud priority, resume/replay, image matching, pending reload/retry, failed-read protection and account isolation passed.",
  );
} finally {
  await page.close({ runBeforeUnload: false });
  await db.close();
  await browser.close();
}
