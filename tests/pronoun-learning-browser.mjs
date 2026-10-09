import { chromium } from "playwright-core";
import { prepareL02GrammarFlow } from "../src/lib/pronoun-learning.ts";
import { grammarTrackActivities } from "../src/lib/grammar-learning.ts";
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
page.setDefaultTimeout(30000);
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
  Object.defineProperty(window, "SpeechSynthesisUtterance", {
    configurable: true,
    value: class {
      constructor(text) {
        this.text = text;
      }
    },
  });
  Object.defineProperty(window, "speechSynthesis", {
    configurable: true,
    value: {
      getVoices: () => [{ lang: "de-DE", name: "Test German" }],
      speak: (utterance) => {
        window.__spoken = utterance.text;
        (window.__utterances ??= []).push(utterance);
        utterance.onstart?.();
        if (!window.__manualSpeech) utterance.onend?.();
      },
      cancel: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
    },
  });
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

const catalog = (await db.query("select data from content_items")).rows.map(r => r.data);
const lesson = (await db.query("select data from content_lessons where id='L02'")).rows[0].data;
const flow = prepareL02GrammarFlow(lesson.learningFlows.grammar, catalog);
const boards = grammarTrackActivities(flow, catalog, "pronouns");
try {
  await mkdir("test-results", {recursive: true});
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto(base + "/learn/L02/grammar/pronouns");
  await page.locator(".pronoun-picture").first().waitFor();
  const tabs = page.locator('.learning-category-tabs button');
  assert.equal(await tabs.count(), 4);
  assert.deepEqual(await tabs.locator('.category-tab-german').allTextContents(), ["1. Person", "2. Person", "3. Person", "Übersicht"]);
  assert.equal(await tabs.nth(3).isDisabled(), true);
  for (const [index, board] of boards.entries()) {
    const pairs = board.pairs;
    const picture = id => page.locator(`[data-pronoun-id="${id}"]`);
    const word = id => page.locator('.pronoun-word-bank').getByRole('button', {name: catalog.find(i => i.id === id).pronounContent.pronoun, exact: true}).first();
    assert.equal(await page.locator('.pronoun-picture').count(), pairs.length);
    await page.waitForFunction(() => [...document.querySelectorAll('.pronoun-picture img')].every(img => img.complete && img.naturalWidth > 0));
    if (pairs.length > 1) {
      await word(pairs[0].id).click();
      await picture(pairs[1].id).click();
      assert.equal(await page.locator('.pronoun-picture.incorrect').count(), 1);
      assert.equal(await page.locator('.pronoun-picture.correct').count(), 0);
    }
    assert.equal(await page.getByText('เนื้อหาเสริมจากอาจารย์', {exact: true}).count(), 0);
    assert.equal(await page.locator('.pronoun-number-badge').count(), pairs.length + (index === 1 ? 1 : 0));
    const pluralIds = new Set(['L02-pronoun-wir', 'L02-pronoun-ihr', 'L02-pronoun-sie-pl']);
    for (const pair of pairs) {
      const badges = await picture(pair.id).locator('.pronoun-number-badge').allTextContents();
      assert.deepEqual(badges, pair.id === 'L02-pronoun-Sie' ? ['Singular · เอกพจน์', 'Plural · พหูพจน์'] : [pluralIds.has(pair.id) ? 'Plural · พหูพจน์' : 'Singular · เอกพจน์']);
    }
    if (index === 1) {
      const polite = picture('L02-pronoun-Sie');
      assert.equal(await polite.locator('.pronoun-scene').count(), 2);
      assert.equal(await polite.locator('.pronoun-person.group').count(), 1);
      assert.ok(await polite.getByText('พูดกับผู้ฟังหนึ่งคนแบบสุภาพ', {exact: true}).count());
      assert.ok(await polite.getByText('พูดกับผู้ฟังหลายคนแบบสุภาพ', {exact: true}).count());
    }
    for (const [n, pair] of pairs.entries()) {
      if (index === 2 && n === 1) await page.locator('[data-pronoun-word="L02-pronoun-sie-pl"]').dragTo(picture(pair.id), {targetPosition: {x: 30, y: 25}});
      else if (n === 1) await word(pair.id).dragTo(picture(pair.id), {targetPosition: {x: 30, y: 25}});
      else {await word(pair.id).click(); await picture(pair.id).click();}
      try {
        await page.waitForFunction(count => document.querySelectorAll('.pronoun-picture.correct').length === count, n + 1);
      } catch (error) {
        await page.screenshot({path: 'test-results/pronouns-failure.png', fullPage: true});
        console.error('Pronoun match failed:', board.id, pair.id, await page.locator('.guided-card').innerText());
        throw error;
      }
      assert.equal(await page.evaluate(() => window.__spoken), catalog.find(i => i.id === pair.id).pronounContent.pronoun);
      if (n === 0) {
        await page.waitForFunction(userId => !localStorage.getItem(`deutsch-trainer-pending-lessons:${userId}`), userId);
        await page.reload();
        if (index === boards.length - 1 && pairs.length === 1) {
          await page.locator('.pronoun-summary table').waitFor();
          await tabs.nth(index).click();
        }
        await picture(pair.id).waitFor();
        assert.equal(await page.locator('.pronoun-picture.correct').count(), 1);
        assert.equal(await page.evaluate(() => window.__spoken ?? null), null);
        await picture(pair.id).click();
        assert.equal(await page.evaluate(() => window.__spoken), catalog.find(i => i.id === pair.id).pronounContent.pronoun);
      }
    }
    await page.setViewportSize({width: 390, height: 844});
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({path: `test-results/pronouns-group-${index + 1}-mobile.png`, fullPage: true});
    await page.setViewportSize({width: 1440, height: 1000});
    await page.screenshot({path: `test-results/pronouns-group-${index + 1}-desktop.png`, fullPage: true});
    await page.getByRole('button', {name: 'หน้าถัดไป', exact: true}).click();
  }
  await page.locator('.pronoun-summary table').waitFor();
  assert.equal(await page.locator('.pronoun-summary tbody tr').count(), 9);
  assert.deepEqual((await page.locator('.pronoun-summary-word').allTextContents()).map(text => text.trim()), ['ich', 'wir', 'du', 'Sie', 'ihr', 'Sie', 'er', 'sie', 'sie']);
  assert.equal(await page.locator('.pronoun-summary img').count(), 0);
  assert.deepEqual(await page.locator('.pronoun-summary-group').allTextContents(), ['เกี่ยวกับตัวเอง', 'พูดกับผู้ฟังโดยตรง', 'พูดถึงคนอื่น']);
  await page.getByRole('button', {name: 'ฟังเสียง Sie', exact: true}).first().click();
  assert.equal(await page.evaluate(() => window.__spoken), 'Sie');
  await page.setViewportSize({width: 390, height: 844});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.screenshot({path: 'test-results/pronouns-summary-mobile.png', fullPage: true});
  await page.reload();
  await page.locator('.pronoun-summary table').waitFor();
  assert.equal(await page.evaluate(() => window.__spoken ?? null), null);
  await page.getByRole('button', {name: 'ย้อนกลับ', exact: true}).click();
  await page.locator('.pronoun-picture.correct').first().waitFor();
  assert.equal(await page.locator('.pronoun-word-bank button').count(), 0);
  await tabs.nth(3).click();
  await page.getByRole('link', {name: 'เรียนการผันกริยาต่อ', exact: true}).click();
  await page.waitForURL('**/learn/L02/grammar/verbs');
  assert.equal((await db.query('select * from item_exposures')).rows.length, 8);
  assert.equal((await db.query('select * from learning_attempts')).rows.length, 0);
  assert.deepEqual(errors, []);
  console.log('PASS: three person groups, singular/plural badges, preserved anime scenes and both polite Sie contexts, tap/drag, retry, audio, partial reload, summary, preserved progress and mobile layout; mock database only.');
} finally {
  await browser.close();
  await db.close();
}
