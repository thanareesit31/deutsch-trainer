import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { createDatabase, userId } from "./learning-database.mjs";
import rawVocabulary from "../src/data/vocabulary.json" with { type: "json" };
import { readFile } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
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
          id: userId,
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
        id: userId,
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
      const body = JSON.parse(req.postData());
      await db.query(
        `insert into learner_lesson_states(user_id,lesson_key,state) values ($1,$2,$3::jsonb)
        on conflict(user_id,lesson_key) ${req.headers()["prefer"]?.includes("ignore-duplicates") ? "do nothing" : "do update set state=excluded.state"}`,
        [body.user_id, body.lesson_key, JSON.stringify(body.state)],
      );
      result = null;
    } else if (parts[0] === "rest" && parts[1] === "v1") {
      const table = parts[2];
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
try {
  await page.goto(base + "/");
  await page.getByRole("heading", { name: "Hallo, Sun ☀" }).waitFor();
  await page.getByRole("link", { name: "บทเรียน" }).first().click();
  await page.getByRole("heading", { name: "บทเรียนของคุณ" }).waitFor();
  await page.locator(".lesson-grid a").first().click();
  await page.locator(".skills-grid a").first().click();
  await page.getByRole("heading", { name: "เรียนคำศัพท์" }).waitFor();
  await page.getByText("บันทึกว่าเคยเรียนแล้ว").waitFor();
  const dbRows = await db.query("select * from item_exposures");
  assert.equal(dbRows.rows.length, 1);
  const seenId = dbRows.rows[0].item_id;
  await page.getByRole("link", { name: "แบบฝึกหัด" }).first().click();
  await page.getByRole("heading", { name: "แบบฝึกหัด" }).waitFor();
  assert.equal(
    await page.getByRole("heading", { name: "ทบทวน", exact: true }).count(),
    0,
  );
  await page.getByRole("link", { name: "ทบทวน" }).first().click();
  await page.getByRole("heading", { name: "ทบทวน", exact: true }).waitFor();
  await page
    .getByRole("heading", { name: "ยังไม่มีข้อที่ต้องทบทวน" })
    .waitFor();
  await page.getByRole("link", { name: "แบบฝึกหัด" }).first().click();
  await page.locator(".skills-grid a").first().click();
  await page.getByRole("heading", { name: "ฝึกคำศัพท์" }).waitFor();
  assert.match(
    await page.locator(".setup-panel .button.primary").innerText(),
    /เริ่มฝึก 1 ข้อ/,
  );
  await page.getByRole("button", { name: "เริ่มฝึก 1 ข้อ" }).click();
  await page.locator(".session-heading").getByText("ข้อ 1 / 1").waitFor();
  await page.reload();
  await page.locator(".session-heading").getByText("ข้อ 1 / 1").waitFor();
  const vocabulary = rawVocabulary.find((i) => i.Vocab_ID === seenId);
  assert(vocabulary);
  const choices = page.locator(".answer-options > button");
  let matched = false;
  for (let i = 0; i < (await choices.count()); i++) {
    const text = await choices.nth(i).innerText();
    if (text.includes(vocabulary.Word_Thai)) {
      await choices.nth(i).click();
      matched = true;
      break;
    }
  }
  assert.equal(
    matched,
    true,
    "correct Thai choice is present in the learned item question",
  );
  await page
    .getByRole("heading", { name: "ตอบข้อนี้รู้สึกอย่างไร?" })
    .waitFor();
  assert.equal(
    (await db.query("select confidence from learning_attempts")).rows[0]
      .confidence,
    null,
    "correct answer is persisted as pending before confidence",
  );
  assert.equal(
    (await db.query("select attempts from knowledge_state")).rows[0].attempts,
    0,
    "pending attempt is excluded from KnowledgeState",
  );

  await page.getByRole("link", { name: "ความก้าวหน้า" }).first().click();
  await page
    .getByRole("heading", { name: "เห็นทุกก้าวที่คุณเติบโต" })
    .waitFor();
  await page.getByLabel("ค้นหาคำศัพท์หรือหัวข้อ").fill(vocabulary.Word_German);
  const pendingRow = page.locator(".progress-table tbody tr").first();
  await pendingRow.waitFor();
  assert.match(await pendingRow.locator("td").nth(2).innerText(), /0\s*\/\s*0/);
  await pendingRow
    .getByRole("button", {
      name: /^ดูรายละเอียด /,
    })
    .click();
  const detail = page.locator(".detail-dialog");
  assert.equal(
    await detail.locator(".detail-stats strong").nth(0).innerText(),
    "0",
  );
  assert.equal(
    await detail.locator(".detail-stats strong").nth(1).innerText(),
    "0",
  );
  assert.doesNotMatch(await detail.innerText(), /\bms\b|วินาที/);
  await detail.getByRole("button", { name: "ปิดรายละเอียด" }).click();

  await page.getByRole("link", { name: "ทบทวน" }).first().click();
  await page.getByRole("heading", { name: "ทบทวน", exact: true }).waitFor();
  await page
    .getByRole("heading", { name: "ยังไม่มีข้อที่ต้องทบทวน" })
    .waitFor();
  const pendingSession = (
    await db.query("select id from practice_sessions where completed=false")
  ).rows[0];
  await page.goto(base + "/session?id=" + pendingSession.id);
  await page.locator(".session-heading").getByText("ข้อ 1 / 1").waitFor();
  await page
    .getByRole("heading", { name: "ตอบข้อนี้รู้สึกอย่างไร?" })
    .waitFor();

  await page.getByRole("button", { name: "ง่าย" }).click();
  await page.reload();
  await page
    .getByRole("heading", { name: "ตอบข้อนี้รู้สึกอย่างไร?" })
    .waitFor();
  assert.equal(
    (await db.query("select * from learning_attempts")).rows.length,
    1,
  );
  assert.equal(
    (await db.query("select attempts from knowledge_state")).rows[0].attempts,
    1,
    "selecting confidence completes and exposes the attempt to knowledge",
  );
  const next = page.getByRole("button", { name: "ดูผลการฝึก" });
  if (await next.isEnabled()) await next.click();
  await page
    .getByRole("heading", { name: "อีกก้าวเล็ก ๆ สำเร็จแล้ว" })
    .waitFor();
  await page.getByRole("link", { name: "ความก้าวหน้า" }).click();
  await page
    .getByRole("heading", { name: "เห็นทุกก้าวที่คุณเติบโต" })
    .waitFor();
  await page.getByLabel("ค้นหาคำศัพท์หรือหัวข้อ").fill(vocabulary.Word_German);
  const learnedItem = (
    await db.query("select data from content_items where id=$1", [seenId])
  ).rows[0].data;
  const progressRow = page
    .locator(".progress-table tbody tr")
    .filter({
      has: page.getByRole("button", {
        name: `ดูรายละเอียด ${learnedItem.title}`,
        exact: true,
      }),
    });
  await progressRow.waitFor();
  assert.match(await progressRow.innerText(), /1\s*\/\s*0/);
  await page.screenshot({
    path: "test-results/learning-progress.png",
    fullPage: true,
  });
  assert.equal(errors.length, 0, errors.join("\n"));
  console.log(
    "PASS: browser learn, persisted boundary, practice start, refresh resume, answer/confidence persistence and progress",
  );
} catch (error) {
  console.log("browser stopped at", page.url());
  console.log((await page.locator("body").innerText()).slice(0, 1800));
  throw error;
} finally {
  await page.close({ runBeforeUnload: false });
  await db.close();
  await browser.close();
}
