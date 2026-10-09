import { chromium } from "playwright-core";
import { prepareL02GrammarFlow } from "../src/lib/pronoun-learning.ts";
import { grammarTrackActivities } from "../src/lib/grammar-learning.ts";
import { vocabularyTrackActivities } from "../src/lib/guided-learning.ts";
import { prepareL02VocabularyFlow } from "../src/lib/l02-number-learning.ts";
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
const catalog = (await db.query("select data from content_items")).rows.map(
  (r) => r.data,
);
const lesson = (
  await db.query("select data from content_lessons where id='L02'")
).rows[0].data;
lesson.learningFlows.vocabulary = prepareL02VocabularyFlow(lesson.learningFlows.vocabulary, catalog);
lesson.learningFlows.grammar = prepareL02GrammarFlow(lesson.learningFlows.grammar, catalog);
function value(option) {
  if (!option.ref) return option.text;
  const i = catalog.find((i) => i.id === option.ref.itemId),
    field = option.ref.field;
  if (field === "number") return String(i.numberContent.value);
  if (field === "written" || field === "pattern") return i.numberContent[field];
  if (field === "pronoun") return i.pronounContent.pronoun;
  if (field === "masculine" || field === "feminine")
    return i.professionContent[field];
  return i[field];
}
function pairsOf(a) {
  if (a.verbId)
    return catalog
      .find((i) => i.id === a.verbId)
      .verbContent.conjugations.map((r, index) => ({
        id: `${a.id}-${index}`,
        left: { text: r.subject },
        right: { text: r.form },
      }));
  return a.pairs ?? [];
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function saved(skill) {
  const key = `deutsch-trainer-guided-learning-L02-${skill}`;
  for (let n = 0; n < 50; n++) {
    const pending = await page.evaluate(
      (userId) =>
        localStorage.getItem(`deutsch-trainer-pending-lessons:${userId}`),
      userId,
    );
    if (!pending)
      return (
        await db.query(
          "select state from learner_lesson_states where lesson_key=$1",
          [key],
        )
      ).rows[0]?.state;
    await sleep(50);
  }
  throw new Error("Lesson draft did not flush");
}
async function pairButton(pair, side) {
  if (await page.locator(".matching-board").count()) {
    return side === "left"
      ? page.locator(`.matching-subject[data-pair-id="${pair.id}"]`)
      : page.locator(".matching-bank").getByRole("button", {name: value(pair.right), exact: true}).first();
  }
  const column = page
    .locator(".guided-match-board > div")
    .nth(side === "left" ? 0 : 1);
  const option = pair[side];
  if (option.ref?.field === "image")
    return column
      .locator("button")
      .filter({ has: page.locator(`img[src="${value(option)}"]`) });
  return column
    .getByRole("button", { name: value(option), exact: true })
    .first();
}
try {
  await page.goto(base + "/learn");
  await page
    .locator(".lesson-card")
    .filter({ hasText: "Was macht ihr beruflich?" })
    .click();
  await page.locator(".skill-card").first().waitFor();
  assert.equal(await page.locator(".skill-card").count(), 2);
  await page.locator(".skill-card").filter({ hasText: "Wortschatz" }).click();
  await page.locator(".alphabet-entry-card").first().waitFor();
  assert.equal(await page.locator(".alphabet-entry-card").count(), 2);
  assert.equal((await db.query("select * from item_exposures")).rows.length, 0);
  // Vocabulary can be opened directly, before learning any numbers.
  await page.locator('a[href="/learn/L02/vocabulary/core"]').click();
  await page.locator(".guided-card").waitFor();
  assert.equal(await page.locator(".profession-pair").count(), lesson.learningFlows.vocabulary.activities.find((a) => a.type === "profession_matching").pairs.length);
  await page.locator('.learning-breadcrumbs a[href="/learn/L02/vocabulary"]').click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".alphabet-entry-card").first().waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "entry cards fit mobile");
  await page.locator('a[href="/learn/L02/vocabulary/numbers"]').click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator(".guided-card").waitFor();
  const first = lesson.learningFlows.vocabulary.activities[0];
  const firstPairs = pairsOf(first);
  assert.deepEqual(await page.locator('.number-digit').allTextContents(), Array.from({length: 13}, (_, n) => String(n)));
  const orders = [];
  for (let n = 0; n < 3; n++) {
    orders.push((await page.locator('.number-word-bank button').allTextContents()).join(','));
    if (n < 2) { await page.reload(); await page.locator('.number-word-bank').waitFor(); }
  }
  assert.ok(new Set(orders).size > 1, 'German words reshuffle when entering again');
  await (await pairButton(firstPairs[0], 'left')).click();
  assert.equal(await page.evaluate(() => window.__spoken), 'null');
  await (await pairButton(firstPairs[1], 'right')).click();
  assert.equal(await page.locator('.guided-choice.wrong').count(), 2);
  assert.equal(await page.locator('.guided-locked-pair').count(), 0);
  assert.ok(await page.getByRole('button', {name: 'ไปต่อ', exact: true}).isDisabled());
  assert.equal((await db.query('select * from item_exposures')).rows.length, 0);
  await sleep(800);
  assert.equal(await page.locator('.guided-choice.wrong').count(), 0);
  assert.equal(await page.locator('.number-word-bank button').count(), 13);
  await page.setViewportSize({ width: 1440, height: 900 });
  await mkdir('test-results', { recursive: true });
  await page.screenshot({path: 'test-results/l02-number-grid-desktop.png', fullPage: true});
  assert.ok(await page.locator('.number-match-board').evaluate((board) => board.getBoundingClientRect().bottom <= window.innerHeight), 'initial number board fits the desktop viewport');
  assert.ok(await page.locator('.number-learning-card .guided-navigation').evaluate((nav) => nav.getBoundingClientRect().bottom <= window.innerHeight), 'number navigation fits the desktop viewport');
  for (let n = 0; n < firstPairs.length; n++) {
    await (await pairButton(firstPairs[n], 'left')).click();
    await (await pairButton(firstPairs[n], 'right')).click();
    await page.waitForFunction((count) => document.querySelectorAll('.guided-locked-pair').length === count, n + 1);
    assert.equal(await page.evaluate(() => window.__spoken), value(firstPairs[n].right), "correct number pair reads immediately");
    if (n === 0) {
      await page.getByRole("button", {name: `ฟังเสียง ${value(firstPairs[n].right)}`, exact: true}).click();
      assert.equal(await page.evaluate(() => window.__spoken), value(firstPairs[n].right));
      assert.equal(await page.locator(".guided-locked-pair").count(), 1);
    }
    if (n === 10) {
      assert.deepEqual(await page.locator('.number-digit-bank .number-digit').allTextContents(), ['11', '12']);
      assert.equal(await page.locator('.number-word-bank button').count(), 2);
      assert.ok(await page.locator('.number-match-board').evaluate((board) => board.getBoundingClientRect().height < 100), 'remaining choices stay close together');
      await page.screenshot({path: 'test-results/l02-number-grid-last-pairs.png', fullPage: true});
    }
    if (n === 0) {
      const partial = await saved('vocabulary');
      assert.equal(partial.resumeIndex, 0);
      assert.deepEqual(partial.matches[first.id], [firstPairs[0].id]);
      await page.reload(); await page.locator('.guided-card').waitFor();
      assert.equal(await page.locator('.guided-locked-pair').count(), 1);
    }
  }
  assert.equal((await saved('vocabulary')).resumeIndex, 1);
  await mkdir('test-results', { recursive: true });
  await page.screenshot({path: 'test-results/l02-numbers-0-12.png', fullPage: true});
  await page.getByRole('button', {name: 'ไปต่อ', exact: true}).click();
  assert.deepEqual(await page.locator('.number-digit').allTextContents(), Array.from({length: 7}, (_, n) => String(n + 13)));
  assert.ok(await page.locator('.teen-number-learning-card .guided-navigation').evaluate((nav) => nav.getBoundingClientRect().bottom <= window.innerHeight), 'teen example and matching navigation fit desktop');
  const exposuresBeforeExample = (await db.query('select * from item_exposures')).rows.length;
  await page.evaluate(() => { window.__manualSpeech = true; window.__utterances = []; });
  await page.getByRole('button', {name: 'ฟังตัวอย่างเลข 13 ช้า ๆ', exact: true}).click();
  await page.waitForFunction(() => document.querySelector('.teen-example-diagram')?.dataset.activePart === 'units');
  assert.equal(await page.evaluate(() => window.__spoken), 'drei');
  assert.ok(await page.evaluate(() => window.__utterances[0].rate < 0.8));
  await page.screenshot({path: 'test-results/l02-teen-example-units.png', fullPage: true});
  await page.evaluate(() => window.__utterances[0].onend());
  await page.waitForFunction(() => document.querySelector('.teen-example-diagram')?.dataset.activePart === 'tens');
  assert.equal(await page.evaluate(() => window.__spoken), 'zehn');
  assert.equal(await page.locator('.teen-tens-arrow').evaluate(el => getComputedStyle(el).stroke), 'rgb(188, 65, 65)');
  await page.screenshot({path: 'test-results/l02-teen-example-tens.png', fullPage: true});
  await page.evaluate(() => window.__utterances[1].onend());
  await page.waitForFunction(() => document.querySelector('.teen-example-diagram')?.dataset.activePart === 'none');
  await page.evaluate(() => { window.__manualSpeech = false; });
  assert.equal((await db.query('select * from item_exposures')).rows.length, exposuresBeforeExample);
  assert.equal((await saved('vocabulary')).resumeIndex, 1);
  await page.setViewportSize({width: 390, height: 844});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.screenshot({path: 'test-results/l02-teen-example-mobile.png', fullPage: true});
  await page.setViewportSize({width: 1440, height: 900});
  await page.getByRole('button', {name: 'ย้อนกลับ', exact: true}).click();
  await page.reload(); await page.locator('.guided-card').waitFor();
  assert.equal((await saved('vocabulary')).resumeIndex, 1);
  let testedPartial = false,
    testedWrongPair = false,
    testedDrag = false;
  for (const skill of ["vocabulary", "grammar"]) {
    const catalogFlow = lesson.learningFlows[skill];
    const flow = skill === "vocabulary" ? {...catalogFlow, activities: [...vocabularyTrackActivities(catalogFlow, catalog, "numbers"), ...vocabularyTrackActivities(catalogFlow, catalog, "core")]} : {...catalogFlow, activities: ["pronouns", "verbs", "sentences"].flatMap(track => grammarTrackActivities(catalogFlow, catalog, track))};
    if (skill === "grammar") {
      await page.goto(base + "/learn/L02/grammar");
      await page.locator(".grammar-learning-entry").waitFor();
      assert.equal(await page.locator(".alphabet-entry-card").count(), 3);
      await page.getByRole("link", {name: /Personalpronomen/}).click();
    }
    await page.locator(".guided-card").waitFor();
    let start = skill === "vocabulary" ? 1 : 0;
    for (let index = start; index < flow.activities.length; index++) {
      const a = flow.activities[index],
        pairs = pairsOf(a);
      if (skill === "grammar") {
        const track = ["pronoun_choice", "pronoun_matching"].includes(a.type) ? "pronouns" : a.verbId ? "verbs" : "sentences";
        const previous = flow.activities[index - 1];
        const previousTrack = ["pronoun_choice", "pronoun_matching"].includes(previous?.type) ? "pronouns" : previous?.verbId ? "verbs" : "sentences";
        if (index && track !== previousTrack) {
          await saved(skill);
          await page.goto(base + `/learn/L02/grammar/${track}`);
          await page.locator(".guided-card").waitFor();
        }
        if (track === "verbs") {
          assert.deepEqual(await page.locator(".category-tab-german").allTextContents(), ["arbeiten", "machen", "Übersicht"]);
          await page.locator(".guided-verb-intro").getByRole("heading", {name: a.verbId === "L02-verb-arbeiten" ? "arbeiten" : "machen", exact: true}).waitFor();
        }
      }
      if (skill === "vocabulary" && a.type === "profession_matching" && flow.activities[index - 1]?.type !== "profession_matching") {
        await page.locator('.learning-category-tabs [aria-current="page"]').filter({hasText:"จุดสังเกต"}).waitFor();
        assert.equal(await page.locator('.vocabulary-image-progress').innerText(), 'เรียนแล้ว 33 / 33 คำ');
        await page.getByRole('navigation', {name:'หมวดคำศัพท์'}).getByRole('button', {name:'0–12'}).click();
        await page.locator('.number-completed-pairs').waitFor();
        assert.equal(await page.locator('.vocabulary-image-progress').innerText(), 'เรียนแล้ว 33 / 33 คำ');
        await page.getByRole('navigation', {name:'หมวดคำศัพท์'}).getByRole('button', {name:'จุดสังเกต'}).click();
        await page.locator('.number-observation-card').first().waitFor();
        assert.equal(await page.locator('.number-observation-card').count(), 3);
        assert.ok(await page.locator('.number-observation-digit').evaluateAll(els => els.every(el => {const range = document.createRange(); range.selectNodeContents(el); return range.getClientRects().length === 1;})), 'observation digits stay on one line');
        assert.deepEqual(await page.locator('.number-removed-ending').allTextContents(), ['s', 's', 'en']);
        assert.deepEqual(await page.locator('.number-retained-root').allTextContents(), ['ein', 'sech', 'sech', 'sieb', 'sieb']);
        const exposuresBeforeSummary = (await db.query('select * from item_exposures')).rows.length;
        for (const [digit, word] of [[1,'eins'],[21,'einundzwanzig'],[6,'sechs'],[16,'sechzehn'],[60,'sechzig'],[7,'sieben'],[17,'siebzehn'],[70,'siebzig']]) {
          await page.getByRole('button', {name:`ฟังเสียง ${digit}`,exact:true}).click();
          assert.equal(await page.evaluate(() => window.__spoken), word);
          assert.equal(await page.evaluate(() => window.__utterances.at(-1).rate), 0.5);
        }
        assert.equal(await page.getByRole('button', {name:'ฟังเสียง 21',exact:true}).locator('.teen-tens').textContent(), 'zwanzig');
        assert.equal(await page.getByRole('button', {name:'ฟังเสียง 21',exact:true}).locator('.compound-connector').textContent(), 'und');
        assert.equal((await db.query('select * from item_exposures')).rows.length, exposuresBeforeSummary);
        await page.reload();
        await page.locator('.learning-category-tabs [aria-current="page"]').filter({hasText:'จุดสังเกต'}).waitFor();
        assert.equal((await db.query('select * from item_exposures')).rows.length, exposuresBeforeSummary);
        await page.screenshot({path: 'test-results/l02-number-observations.png', fullPage: true});
        await page.setViewportSize({width: 390, height: 844});
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
        await page.screenshot({path: 'test-results/l02-number-observations-mobile.png', fullPage: true});
        await page.setViewportSize({width: 1440, height: 900});
        await page.locator('.learning-breadcrumbs a[href="/learn/L02/vocabulary"]').click();
        await page.locator('a[href="/learn/L02/vocabulary/numbers"] .alphabet-entry-status').waitFor();
        assert.equal(await page.locator('a[href="/learn/L02/vocabulary/core"] .alphabet-entry-status').count(), 0);
        await page.locator('a[href="/learn/L02/vocabulary/numbers"]').click();
        await page.getByRole('button', {name: 'ไปต่อ', exact: true}).click();
        await page.locator('.number-summary-grid').waitFor();
        const expectedNumbers = [...Array.from({length: 22}, (_, n) => String(n)), '26','30','37','40','48','50','60','63','70','76','80','89','90','100'];
        assert.deepEqual(await page.locator('.number-summary-digit').allTextContents(), expectedNumbers);
        assert.equal(await page.locator('.number-summary-word').count(), 36);
        const firstRow = await page.locator('.number-summary-grid button').evaluateAll(buttons => buttons.filter(button => button.offsetTop === buttons[0].offsetTop).map(button => button.querySelector('.number-summary-digit').textContent));
        assert.deepEqual(firstRow, Array.from({length:6},(_,n)=>String(n)));
        await page.getByRole('button', {name: 'ฟังเสียง 100', exact: true}).click();
        assert.equal(await page.evaluate(() => window.__spoken), 'hundert');
        assert.equal((await db.query('select * from item_exposures')).rows.length, exposuresBeforeSummary);
        await saved('vocabulary');
        await page.reload();
        await page.locator('.number-summary-grid').waitFor();
        await page.screenshot({path: 'test-results/l02-number-summary.png', fullPage: true});
        await page.setViewportSize({width:390,height:844});
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
        await page.screenshot({path: 'test-results/l02-number-summary-mobile.png', fullPage: true});
        await page.setViewportSize({width:1440,height:900});
        await page.getByRole('button', {name:'ย้อนกลับ', exact:true}).click();
        await page.getByRole('heading', {name:'Beobachtungen', exact:true}).waitFor();
        await page.getByRole('button', {name:'ไปต่อ', exact:true}).click();
        await page.getByRole("link", { name: "เรียนคำศัพท์ต่อ", exact: true }).click();
      }
      if (a.type !== "profession_matching") {
        await page.locator(".guided-instruction").waitFor();
        assert.equal(await page.locator(".guided-instruction").innerText(), a.instruction);
      }
      if (a.id === 'L02-number-matching-21-100') {
        assert.deepEqual(await page.locator('.number-digit').allTextContents(), ['21', '48', '63', '89', '100']);
        for (const pair of pairs) {
          await (await pairButton(pair, "left")).click();
          assert.equal(await page.evaluate(() => window.__utterances.at(-1).rate), 0.65);
          const word = await pairButton(pair, "right");
          if (pair.id === "L02-number-100") {
            assert.equal(await word.locator('.teen-tens, .compound-connector').count(), 0);
            assert.equal(await word.textContent(), "hundert");
          } else {
            assert.equal(await word.locator('.compound-connector').textContent(), "und");
            assert.equal(await word.locator('.teen-tens').evaluate((el) => getComputedStyle(el).color), "rgb(188, 65, 65)");
          }
        }
        const before = (await db.query('select * from item_exposures')).rows.length;
        await page.evaluate(() => {window.__manualSpeech = true; window.__utterances = [];});
        await page.getByRole('button', {name: 'ฟังตัวอย่างเลข 21 ช้า ๆ', exact: true}).click();
        await page.waitForFunction(() => document.querySelector('.teen-example-diagram')?.dataset.activePart === 'units');
        assert.equal(await page.evaluate(() => window.__spoken), 'ein');
        await page.evaluate(() => window.__utterances[0].onend());
        await page.waitForFunction(() => document.querySelector('.teen-example-diagram')?.dataset.activePart === 'connector');
        assert.equal(await page.evaluate(() => window.__spoken), 'und');
        await page.evaluate(() => window.__utterances[1].onend());
        await page.waitForFunction(() => document.querySelector('.teen-example-diagram')?.dataset.activePart === 'tens');
        assert.equal(await page.evaluate(() => window.__spoken), 'zwanzig');
        await page.screenshot({path: 'test-results/l02-compound-example.png', fullPage: true});
        await page.evaluate(() => {window.__utterances[2].onend(); window.__manualSpeech = false;});
        assert.equal((await db.query('select * from item_exposures')).rows.length, before);
        await page.setViewportSize({width: 390, height: 844});
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
        await page.screenshot({path: 'test-results/l02-compound-mobile.png', fullPage: true});
        await page.setViewportSize({width: 1440, height: 900});
      }
      if (a.id === 'L02-number-matching-20-90') {
        assert.deepEqual(await page.locator('.number-digit').allTextContents(), Array.from({length: 8}, (_, n) => String((n + 2) * 10)));
        assert.equal(await page.locator('.teen-example-reading, .teen-example-explanation, .teen-example-place-value').count(), 0);
        const before = (await db.query('select * from item_exposures')).rows.length;
        await page.evaluate(() => {window.__manualSpeech = true; window.__utterances = [];});
        await page.getByRole('button', {name: 'ฟังตัวอย่างเลข 40 ช้า ๆ', exact: true}).click();
        await page.waitForFunction(() => document.querySelector('.teen-example-diagram')?.dataset.activePart === 'units');
        assert.equal(await page.evaluate(() => window.__spoken), 'vier');
        await page.evaluate(() => window.__utterances[0].onend());
        await page.waitForFunction(() => document.querySelector('.teen-example-diagram')?.dataset.activePart === 'tens');
        assert.equal(await page.evaluate(() => window.__spoken), 'zig');
        await page.screenshot({path: 'test-results/l02-tens-example.png', fullPage: true});
        await page.evaluate(() => {window.__utterances[1].onend(); window.__manualSpeech = false;});
        assert.equal((await db.query('select * from item_exposures')).rows.length, before);
      }
      if (a.type === "pronoun_matching") {
        await page.locator(".pronoun-picture").first().waitFor();
        assert.equal(await page.locator(".pronoun-picture").count(), pairs.length);
        assert.ok(await page.locator(".pronoun-picture img").evaluateAll(imgs => imgs.every(img => img.complete && img.naturalWidth > 0)));
        const word = p => page.locator(".pronoun-word-bank").getByRole("button", {name: value(p.right), exact: true}).first();
        const picture = p => page.locator(`[data-pronoun-id="${p.id}"]`);
        if (pairs.length > 1) {
        await word(pairs[0]).click();
        await picture(pairs[1]).click();
        assert.equal(await page.locator(".pronoun-picture.correct").count(), 0);
        assert.equal(await page.locator(".pronoun-picture.incorrect").count(), 1);
        assert.equal(await page.locator(".pronoun-word-bank button").count(), pairs.length);
        }
        for (let n = 0; n < pairs.length; n++) {
          if (n === 1) await word(pairs[n]).dragTo(picture(pairs[n]), {targetPosition: {x: 30, y: 25}});
          else {await word(pairs[n]).click(); await picture(pairs[n]).click();}
          try {
            await page.waitForFunction(count => document.querySelectorAll(".pronoun-picture.correct").length === count, n + 1);
          } catch (error) {
            await page.screenshot({path: "test-results/pronoun-failure.png", fullPage: true});
            console.error("Pronoun match failed", a.id, pairs[n].id, await page.locator(".guided-card").innerText());
            throw error;
          }
          assert.equal(await page.evaluate(() => window.__spoken), value(pairs[n].right));
          await picture(pairs[n]).click();
          assert.equal(await page.locator(".pronoun-picture.correct").count(), n + 1);
          if (n === 0) {
            await saved(skill);
            await page.reload(); await page.locator(".pronoun-picture").first().waitFor();
            assert.equal(await page.locator(".pronoun-picture.correct").count(), 1);
            assert.ok(!await page.evaluate(() => window.__spoken));
          }
        }
        await page.screenshot({path:`test-results/${a.id}-desktop.png`, fullPage:true});
        await page.setViewportSize({width:390,height:844});
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        await page.screenshot({path:`test-results/${a.id}-mobile.png`, fullPage:true});
        await page.setViewportSize({width:1440,height:1000});
      } else if (a.type === "profession_matching") {
        await page.locator(`[data-profession-id="${a.pairs[0].id}"]`).waitFor();
        for (const row of await page.locator('.profession-pair').all()) {
          const slot = row.locator('.profession-slot');
          if (!await slot.count()) continue;
          const id = await row.getAttribute('data-profession-id');
          const item = catalog.find(i => i.id === id);
          const form = await slot.locator('..').getAttribute('data-form');
          const article = item.professionContent.conceptKey === 'modell' ? 'das' : form === 'masculine' ? 'der' : 'die';
          await page.getByRole('button', {name:article+' '+item.professionContent[form], exact:true}).click();
          await slot.click();
          await row.locator('.profession-slot').waitFor({state:'detached'});
        }
      } else if (pairs.length) {
        if (!testedWrongPair && pairs.length > 1) {
          await (await pairButton(pairs[0], "left")).click();
          await (await pairButton(pairs[1], "right")).click();
          assert.equal(await page.locator(".guided-locked-pair").count(), 0);
          assert.ok(
            await page
              .getByRole("button", { name: "ไปต่อ", exact: true })
              .isDisabled(),
          );
          await sleep(800);
          testedWrongPair = true;
        }
        if (a.verbId) {
          assert.equal(await page.locator(".matching-subject").count(), 6);
          const wrongPair = pairs.find(p => value(p.right) !== value(pairs[0].right));
          await page.evaluate(() => {window.__spoken = "unchanged";});
          await (await pairButton(wrongPair, "right")).dragTo(await pairButton(pairs[0], "left"));
          await page.locator(".matching-drop.incorrect").waitFor();
          assert.equal(await page.locator(".matching-drop.correct").count(), 0);
          assert.equal(await page.evaluate(() => window.__spoken), "unchanged", "wrong drop does not read answer");
          assert.equal(await page.locator(".matching-token").count(), 6);
          await sleep(700);
        }
        for (let n = 0; n < pairs.length; n++) {
          const pair = pairs[n];
          if (a.verbId && !testedDrag) {
            await (
              await pairButton(pair, "right")
            ).dragTo(await pairButton(pair, "left"));
            testedDrag = true;
          } else if (a.verbId) {
            await (await pairButton(pair, "right")).click();
            await (await pairButton(pair, "left")).click();
          } else {
            await (await pairButton(pair, "left")).click();
            await (await pairButton(pair, "right")).click();
          }
          await page.waitForFunction(
            ({count, verb}) =>
              document.querySelectorAll(verb ? ".matching-drop.correct" : ".guided-locked-pair").length === count,
            {count: n + 1, verb: !!a.verbId},
          );
          if (a.verbId) {
            const expectedSpeech = `${value(pair.left).split("/")[0].trim()} ${value(pair.right)}`;
            assert.equal(await page.evaluate(() => window.__spoken), expectedSpeech);
            await (await pairButton(pair, "left")).click();
            assert.equal(await page.evaluate(() => window.__spoken), expectedSpeech);
            assert.equal(await page.locator(".matching-drop.correct").count(), n + 1);
            assert.equal(await page.locator(".guided-locked-pair").count(), 0, "correct forms stay in subject rows");
            assert.equal(await page.locator(".matching-subject").count(), 6);
            if (n === 0) {
              await saved(skill);
              await page.reload(); await page.locator(".matching-board").waitFor();
              assert.equal(await page.locator(".matching-drop.correct").count(), 1);
              assert.ok(!await page.evaluate(() => window.__spoken), "restoring pairs does not autoplay");
            }
          }
          if (!testedPartial && n === 0 && pairs.length > 1) {
            await saved(skill);
            await page.reload();
            await page.locator(".guided-card").waitFor();
            assert.equal(await page.locator(".guided-locked-pair").count(), 1);
            testedPartial = true;
          }
        }
        if (a.id === "L02-number-matching-21-100") {
          assert.equal(await page.locator('.number-matched-word .teen-tens').count(), 4);
          assert.equal(await page.locator('.number-matched-word .compound-connector').count(), 4);
          await page.getByRole('button', {name:'100', exact:true}).click();
          assert.equal(await page.evaluate(() => window.__utterances.at(-1).rate), 0.65);
          await page.screenshot({path: 'test-results/l02-compound-completed.png', fullPage:true});
          await page.setViewportSize({width:390,height:844});
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
          await page.screenshot({path: 'test-results/l02-compound-completed-mobile.png', fullPage:true});
          await page.setViewportSize({width:1440,height:900});
        }
      } else {
        if (a.audioIds) {
          await page
            .getByRole("button", { name: "ฟังเสียง", exact: true })
            .click();
          if (!(await page.evaluate(() => !!window.__spoken))) {
            await sleep(250);
            await page
              .getByRole("button", { name: "ฟังเสียง", exact: true })
              .click();
          }
          assert.ok(
            await page.evaluate(() => !!window.__spoken),
            `audio ${a.id}: ${await page.locator(".guided-card").innerText()}`,
          );
        }
        await page
          .locator(".guided-choices")
          .getByRole("button", {
            name: value(a.options.find((o) => o.id === a.correctOptionId)),
            exact: true,
          })
          .click();
      }
      await page.waitForFunction(
        () => !document.querySelector(".guided-navigation .primary")?.disabled,
      );
      if (
        a.id === "L02-phone-digits" || a.type === "number_matching" ||
        a.type === "image_matching" ||
        a.verbId === "L02-verb-arbeiten"
      ) {
        await page.setViewportSize({ width: 390, height: 844 });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth + 1,
          ),
          "mobile overflow",
        );
        await mkdir("test-results", { recursive: true });
        await page.screenshot({
          path: `test-results/l02-${a.id}-mobile.png`,
          fullPage: true,
        });
        await page.setViewportSize({ width: 1440, height: 1000 });
      }
      const next = page.getByRole("button", { name: a.type === "profession_matching" || skill === "grammar" ? "หน้าถัดไป" : "ไปต่อ", exact: true });
      if (await next.count()) await next.click();
      else await page.locator(".guided-navigation a.primary").waitFor();
      if (index % 20 === 0)
        console.log(`L02 ${skill} ${index + 1}/${flow.activities.length}`);
    }
    assert.equal(await page.getByText("เรียนครบแล้ว", {exact:true}).count(), 0);
    assert.equal(await page.getByText("ย้อนกลับไปดูสิ่งที่เรียนได้ โดยสถานะการเรียนยังคงอยู่", {exact:true}).count(), 0);
    if (skill === "grammar") {
      await page.goto(base + "/learn/L02/grammar/verbs");
      await page.locator(".verb-summary table").waitFor();
      assert.deepEqual(await page.locator(".verb-summary thead th").allTextContents(), ["ประธาน", "arbeiten", "machen"]);
      assert.equal(await page.locator(".verb-summary tbody tr").count(), 6);
      assert.deepEqual(await page.locator(".verb-summary .ending-result").allTextContents(), ["e", "e", "est", "st", "et", "t", "en", "en", "et", "t", "en", "en"]);
      await page.screenshot({path:"test-results/l02-verb-summary.png", fullPage:true});
    }
    const complete = await saved(skill);
    assert.ok(flow.activities.every(a => complete.learnedActivityIds.includes(a.id)));
    await page.reload();
    await page.locator(".guided-card").waitFor();
    assert.equal(await page.getByText("เรียนครบแล้ว", {exact:true}).count(), 0);
    assert.equal(await page.getByText("ย้อนกลับไปดูสิ่งที่เรียนได้ โดยสถานะการเรียนยังคงอยู่", {exact:true}).count(), 0);
    await page.getByRole("button", { name: "ย้อนกลับ", exact: true }).click();
    const restored = await saved(skill);
    assert.deepEqual(restored.learnedActivityIds, complete.learnedActivityIds);
  }
  assert.equal(
    (await db.query("select * from learning_attempts")).rows.length,
    0,
  );
  assert.ok((await db.query("select * from item_exposures")).rows.length > 0);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: L02 number boards and all remaining activities, wrong/correct/retry, audio selection, matching, drag/tap conjugation, partial reload, Back, resume, completion and mobile layout. Synthesized voice is mocked; no production learner writes.",
  );
} finally {
  await browser.close();
  await db.close();
}
