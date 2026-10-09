import { chromium } from "playwright-core";
import assert from "node:assert/strict";
import { createDatabase, userId } from "./learning-database.mjs";
import { readFile, mkdir } from "node:fs/promises";
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.setDefaultTimeout(8000);
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
await page.addInitScript(() => {
  window.__spoken = null;
  Object.defineProperty(window, "SpeechSynthesisUtterance", {configurable: true, value: class {constructor(text) {this.text = text;}}});
  Object.defineProperty(window, "speechSynthesis", {configurable: true, value: {
    getVoices: () => [{lang: "de-DE", name: "Test German"}],
    speak: utterance => {window.__spoken = utterance.text; utterance.onstart?.(); utterance.onend?.();},
    cancel: () => {}, addEventListener: () => {}, removeEventListener: () => {},
  }});
});
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
const verbKey = "deutsch-trainer-verb-learning-L01";
async function savedVerbState() {
  await page.waitForFunction(
    () =>
      !localStorage.getItem(
        "deutsch-trainer-pending-lessons:11111111-1111-4111-8111-111111111111",
      ),
  );
  return (
    await db.query(
      "select state from learner_lesson_states where lesson_key=$1",
      [verbKey],
    )
  ).rows[0]?.state;
}
async function replaceVerbState(state) {
  await db.query(
    "update learner_lesson_states set state=$1::jsonb where lesson_key=$2",
    [JSON.stringify(state), verbKey],
  );
}
async function reloadAndResume() {
  const state = await savedVerbState();
  await page.reload();
  if (state.showPrinciples) {
    await page
      .getByRole("heading", { name: "กริยาผันตามประธาน", exact: true })
      .waitFor();
  } else if (state.showSummary) {
    await page.locator(".verb-summary table").waitFor();
  } else if (state.showIntroduction) {
    await page
      .locator(".verb-introduction")
      .getByRole("heading", { name: state.verb, exact: true })
      .waitFor();
  } else {
    await page
      .getByLabel(`จับคู่รูปผัน ${state.verb}`, { exact: true })
      .waitFor();
  }
}
try {
  await page.goto(base + "/learn/L01/grammar");
  await page.locator(".grammar-learning-entry").waitFor();
  assert.equal(await page.locator(".alphabet-entry-card").count(), 1);
  assert.equal(await page.getByRole("link", {name: /Personalpronomen/}).count(), 0);
  await page.goto(base + "/learn/L01/grammar/pronouns");
  await page.waitForURL("**/learn/L01/grammar");
  assert.equal((await db.query("select * from item_exposures")).rows.length, 0);
  await page.getByRole("link", {name: /Verben/}).click();
  await page
    .getByRole("heading", { name: "กริยาผันตามประธาน", exact: true })
    .waitFor();
  assert.equal(await page.locator(".verb-principles tbody tr").count(), 6);
  assert.deepEqual(
    await page
      .locator(".verb-principles tbody tr td:first-of-type")
      .allTextContents(),
    [
      "ฉัน",
      "เธอ",
      "เขา / เธอ / มัน",
      "พวกเรา",
      "พวกเธอ",
      "พวกเขา / คุณ (สุภาพ)",
    ],
  );
  assert.equal(await page.locator(".verb-principles button").count(), 1);
  assert.equal(
    await page.getByRole("button", { name: "เริ่มเรียน", exact: true }).count(),
    0,
  );
  assert.equal((await db.query("select * from item_exposures")).rows.length, 0);
  await page.getByRole("button", { name: "หน้าถัดไป", exact: true }).click();
  const intro = page.locator(".verb-introduction");
  await intro.getByRole("heading", { name: "kommen", exact: true }).waitFor();
  await page.locator(".matching-board").waitFor();
  await page
    .locator(".verb-sequence")
    .getByRole("button", { name: "หลักการผัน", exact: true })
    .click();
  await page
    .getByRole("heading", { name: "กริยาผันตามประธาน", exact: true })
    .waitFor();
  await page
    .locator(".verb-sequence")
    .getByRole("button", { name: "kommen", exact: true })
    .click();
  await intro.waitFor();
  assert.deepEqual(
    await page.locator(".verb-sequence button").allTextContents(),
    ["หลักการผัน", "kommen", "heißen", "lernen", "sein", "สรุป"],
  );
  const lesson = (
    await db.query("select data from content_lessons where id='L01'")
  ).rows[0].data;
  const migration = await readFile(
    new URL(
      "../supabase/migrations/20261005000000_l01_verb_introductions.sql",
      import.meta.url,
    ),
    "utf8",
  );
  await db.exec("reset role");
  await db.exec(migration);
  assert.deepEqual(
    (await db.query("select data from content_lessons where id='L01'")).rows[0]
      .data,
    lesson,
  );
  await db.exec(
    `set role authenticated; set request.jwt.claim.sub='${userId}';`,
  );
  const catalog = (
    await db.query("select data from content_items order by position")
  ).rows.map((r) => r.data);
  for (const [index, entry] of lesson.verbIntroductions.entries()) {
    await intro
      .getByRole("heading", { name: entry.infinitive, exact: true })
      .waitFor();
    assert.equal(
      await intro.locator(".verb-introduction-examples > div").count(),
      index === 3 ? 3 : 1,
    );
    assert((await intro.innerText()).includes(entry.thaiMeaning));
    const thaiExample = intro
      .locator(".verb-introduction-examples .muted-text")
      .first();
    assert.equal(
      await thaiExample.evaluate((el) => getComputedStyle(el).textAlign),
      "center",
    );
    assert(
      parseFloat(
        await thaiExample.evaluate((el) => getComputedStyle(el).fontSize),
      ) >= 16,
    );
    for (const example of entry.examples) {
      assert((await intro.innerText()).includes(example.de));
      assert((await intro.innerText()).includes(example.th));
    }
    await page.locator(".matching-board").waitFor();
    await intro.getByRole("button", {name: `ฟังเสียง ${entry.infinitive}`, exact: true}).click();
    assert.equal(await page.evaluate(() => window.__spoken), entry.infinitive);
    await intro.getByRole("button", {name: `ฟังเสียง ${entry.examples[0].de}`, exact: true}).click();
    assert.equal(await page.evaluate(() => window.__spoken), entry.examples[0].de);
    assert.equal(await page.getByRole("button", { name: "เรียนการผัน", exact: true }).count(), 0);
    await page.waitForFunction(() => !document.querySelector(".conjugation-hint")?.textContent?.includes("กำลังบันทึก"));
    await reloadAndResume();
    await page.getByLabel(`จับคู่รูปผัน ${entry.infinitive}`, { exact: true }).waitFor();
    assert.equal(await page.getByRole("button", { name: "ตรวจการจับคู่" }).count(), 0);
    assert.equal(await page.evaluate(() => window.__spoken), null, "reload does not autoplay");
    const group =
      entry.infinitive === "sein"
        ? "sein"
        : `Verbkonjugation · ${entry.infinitive}`;
    const forms = catalog.filter(
      (i) => i.lessonId === "L01" && i.skill === "grammar" && i.group === group,
    );
    for (const [row, item] of forms.entries()) {
      if (row === 0) {
        const wrongForm = forms.find(
          (candidate) => candidate.answer !== item.answer,
        );
        const wrongToken = page
          .locator(".matching-bank")
          .getByRole("button", { name: wrongForm.answer, exact: true })
          .first();
        await wrongToken.dragTo(page.locator(".matching-subject").nth(row));
        await page.locator(".matching-drop.incorrect").waitFor();
        assert.equal(await page.locator(".matching-drop.correct").count(), 0);
        await page.locator(".matching-token.incorrect").waitFor();
        assert(
          (await page
            .locator(".matching-bank")
            .getByRole("button", { name: wrongForm.answer, exact: true })
            .count()) > 0,
        );
      }
      await page
        .locator(".matching-bank")
        .getByRole("button", { name: item.answer, exact: true })
        .first()
        .click();
      await page.locator(".matching-subject").nth(row).click();
      assert.equal(await page.evaluate(() => window.__spoken), `${item.title.split(" + ")[0].split("/")[0].trim()} ${item.answer}`);
      if (row < forms.length - 1)
        await page.locator(".matching-drop.correct").nth(row).waitFor();
      if (row === 0) {
        await reloadAndResume();
        await page.locator(".matching-board").waitFor();
        assert.equal(await page.locator(".matching-drop.correct").count(), 1);
        if (index === 1) {
          await page
            .locator('.learning-breadcrumbs a[href="/lesson/L01"]')
            .click();
          await page.waitForURL("**/lesson/L01");
          await page.goto(base + "/learn/L01/grammar/verbs");
          await page
            .getByLabel(`จับคู่รูปผัน ${entry.infinitive}`, { exact: true })
            .waitFor();
          assert.equal(await page.locator(".matching-drop.correct").count(), 1);
        }
      }
    }
    await page.locator(".matching-drop.correct").nth(5).waitFor();
    await page.locator(".matching-subject").first().click();
    assert.equal(await page.evaluate(() => window.__spoken), `ich ${forms[0].answer}`);
    assert.equal(await page.locator(".matching-drop.correct").count(), 6, "listening retains correct matches");
    assert.equal(await page.locator(".matching-feedback").count(), 0);
    assert.equal(await page.locator(".matching-result").count(), 0);
    assert.equal(
      await page.getByRole("button", { name: "ตรวจการจับคู่" }).count(),
      0,
    );
    if (index < 3) await page.getByRole("button", { name: "หน้าถัดไป" }).click();
    else await page.getByRole("button", { name: "หน้าถัดไป" }).click();
  }
  await page.locator(".verb-summary table").waitFor();
  await page.getByRole("button", { name: "ย้อนกลับ", exact: true }).click();
  await page.getByLabel("จับคู่รูปผัน sein", { exact: true }).waitFor();
  assert.equal(await page.locator(".matching-drop.correct").count(), 6);
  await page
    .locator(".verb-sequence")
    .getByRole("button", { name: "สรุป", exact: true })
    .click();
  await page.locator(".verb-summary table").waitFor();
  assert.deepEqual(
    await page.locator(".verb-summary thead th").allTextContents(),
    ["ประธาน", "kommen", "heißen", "lernen", "sein"],
  );
  assert.equal(await page.locator(".verb-summary tbody tr").count(), 6);
  assert.equal(await page.locator(".verb-summary td").count(), 24);
  assert.equal(await page.locator(".matching-result").count(), 0);
  assert.equal(
    (await db.query("select * from item_exposures")).rows.length,
    24,
  );
  await reloadAndResume();
  await page.locator(".verb-summary table").waitFor();
  await page
    .locator(".verb-sequence")
    .getByRole("button", { name: "heißen", exact: true })
    .click();
  await page.getByLabel("จับคู่รูปผัน heißen", { exact: true }).waitFor();
  await page.getByRole("button", { name: "หน้าถัดไป", exact: true }).click();
  await page
    .locator(".verb-introduction")
    .getByRole("heading", { name: "lernen", exact: true })
    .waitFor();
  await reloadAndResume();
  await page
    .locator(".verb-introduction")
    .getByRole("heading", { name: "lernen", exact: true })
    .waitFor();
  await page
    .locator(".verb-sequence")
    .getByRole("button", { name: "kommen", exact: true })
    .click();
  await page.locator(".matching-drop.correct").nth(5).waitFor();
  // Legacy saves keep their original activity and completion when the new field is absent.
  const legacyState = await savedVerbState();
  delete legacyState.showIntroduction;
  await replaceVerbState(legacyState);
  await reloadAndResume();
  await page.locator(".matching-drop.correct").nth(5).waitFor();
  // A legacy completion flag with one incorrect saved pair must resume the board.
  const validSavedState = await savedVerbState();
  const corruptState = structuredClone(validSavedState);
  const entries = catalog.filter(
    (item) =>
      item.lessonId === "L01" &&
      item.skill === "grammar" &&
      item.group === "Verbkonjugation · kommen",
  );
  corruptState.matchesByVerb.kommen[0] = entries.findIndex(
    (item) => item.answer !== entries[0].answer,
  );
  corruptState.showIntroduction = false;
  corruptState.showSummary = false;
  corruptState.verb = "kommen";
  await replaceVerbState(corruptState);
  await reloadAndResume();
  await page.locator(".matching-board").waitFor();
  assert.equal(await page.locator(".matching-drop.filled").count(), 5);
  assert.equal(await page.locator(".matching-feedback").count(), 0);
  assert(!(await savedVerbState()).completedVerbs.includes("kommen"));
  await replaceVerbState(validSavedState);
  await reloadAndResume();
  await page.locator(".matching-drop.correct").nth(5).waitFor();
  await page
    .locator(".verb-sequence")
    .getByRole("button", { name: "sein", exact: true })
    .click();
  await page.locator(".matching-drop.correct").nth(5).waitFor();
  await page.getByRole("button", { name: "ย้อนกลับ", exact: true }).click();
  await intro.getByRole("heading", {name: "lernen", exact: true}).waitFor();
  await page.locator(".verb-sequence").getByRole("button", {name: "sein", exact: true}).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await reloadAndResume();
  await intro.getByRole("heading", { name: "sein", exact: true }).waitFor();
  await mkdir("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/verb-introduction-mobile.png",
    fullPage: true,
  });
  assert(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  );
  const beforeReplay = await savedVerbState();
  const exposureBeforeReplay = (
    await db.query("select * from item_exposures order by item_id")
  ).rows;
  const attemptsBeforeReplay = (
    await db.query(
      "select * from learning_attempts order by session_id, ordinal",
    )
  ).rows;
  await page
    .getByRole("button", { name: "เรียนซ้ำคำนี้ · sein", exact: true })
    .click();
  await intro.getByRole("heading", { name: "sein", exact: true }).waitFor();
  await reloadAndResume();
  await intro.getByRole("heading", { name: "sein", exact: true }).waitFor();
  const singleReplay = await savedVerbState();
  assert.deepEqual(singleReplay.completedVerbs, beforeReplay.completedVerbs);
  for (const name of ["kommen", "heißen", "lernen"]) {
    assert.deepEqual(
      singleReplay.matchesByVerb[name],
      beforeReplay.matchesByVerb[name],
    );
    assert.deepEqual(
      singleReplay.resultsByVerb[name],
      beforeReplay.resultsByVerb[name],
    );
  }
  assert.equal(singleReplay.resultsByVerb.sein, undefined);
  await page.locator(".matching-board").waitFor();
  assert.equal(await page.locator(".matching-drop.filled").count(), 0);
  assert.equal(await page.locator(".matching-token").count(), 6);
  const seinItems = catalog.filter(
    (i) => i.lessonId === "L01" && i.skill === "grammar" && i.group === "sein",
  );
  await page
    .locator(".matching-bank")
    .getByRole("button", { name: seinItems[0].answer, exact: true })
    .first()
    .click();
  await page.locator(".matching-subject").first().click();
  await reloadAndResume();
  await page.locator(".matching-board").waitFor();
  assert.equal(await page.locator(".matching-drop.filled").count(), 1);
  await page
    .locator(".verb-sequence")
    .getByRole("button", { name: "สรุป", exact: true })
    .click();
  await page.getByRole("button", { name: "เรียนซ้ำ", exact: true }).click();
  await intro.getByRole("heading", { name: "kommen", exact: true }).waitFor();
  await reloadAndResume();
  await intro.getByRole("heading", { name: "kommen", exact: true }).waitFor();
  const fullReplay = await savedVerbState();
  assert.deepEqual(fullReplay.completedVerbs, beforeReplay.completedVerbs);
  assert.deepEqual(fullReplay.resultsByVerb, {});
  assert.deepEqual(fullReplay.matchesByVerb, {});
  for (const [index, entry] of lesson.verbIntroductions.entries()) {
    await intro
      .getByRole("heading", { name: entry.infinitive, exact: true })
      .waitFor();
    await page.locator(".matching-board").waitFor();
    assert.equal(await page.locator(".matching-drop.filled").count(), 0);
    const replayGroup =
      entry.infinitive === "sein"
        ? "sein"
        : `Verbkonjugation · ${entry.infinitive}`;
    const replayItems = catalog.filter(
      (i) =>
        i.lessonId === "L01" &&
        i.skill === "grammar" &&
        i.group === replayGroup,
    );
    for (let row = 0; row < replayItems.length; row++) {
      await page
        .locator(".matching-bank")
        .getByRole("button", { name: replayItems[row].answer, exact: true })
        .first()
        .click();
      await page.locator(".matching-subject").nth(row).click();
    }
    await page.locator(".matching-drop.correct").nth(5).waitFor();
    assert.equal(await page.locator(".matching-feedback").count(), 0);
    assert.equal(await page.locator(".matching-result").count(), 0);
    if (index < 3) await page.getByRole("button", { name: "หน้าถัดไป" }).click();
    else await page.getByRole("button", { name: "หน้าถัดไป" }).click();
  }
  await page.locator(".verb-summary table").waitFor();
  assert.deepEqual(
    (await db.query("select * from item_exposures order by item_id")).rows,
    exposureBeforeReplay,
  );
  assert.deepEqual(
    (
      await db.query(
        "select * from learning_attempts order by session_id, ordinal",
      )
    ).rows,
    attemptsBeforeReplay,
  );
  console.log(
    "PASS: single-verb and full replay, preserved completion/history, replay reload and complete flow",
  );
  assert.deepEqual(errors, []);
  console.log(
    "PASS: four inline explanations, principles before matching, matching, back, reload, legacy resume, endings, summary, migration idempotency and mobile layout",
  );
} finally {
  await page.close({ runBeforeUnload: false });
  await db.close();
  await browser.close();
}
