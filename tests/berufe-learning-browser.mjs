import { vocabularyImageEntries, vocabularyImageGroups } from "../src/lib/vocabulary-image-content.ts";
import { chromium } from "playwright-core";
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
lesson.learningFlows.vocabulary = prepareL02VocabularyFlow(
  lesson.learningFlows.vocabulary,
  catalog,
);
const pages = vocabularyTrackActivities(
  lesson.learningFlows.vocabulary,
  catalog,
  "core",
).filter((a) => a.type === "profession_matching");
const waitSave = async () => {
  await page.waitForFunction(
    (userId) =>
      !localStorage.getItem(`deutsch-trainer-pending-lessons:${userId}`),
    userId,
  );
  return (
    await db.query(
      "select state from learner_lesson_states where lesson_key='deutsch-trainer-guided-learning-L02-vocabulary'",
    )
  ).rows[0]?.state;
};
const personLabel = (item, form) =>
  (item.professionContent.conceptKey === "modell"
    ? "das"
    : form === "masculine"
      ? "der"
      : "die") +
  " " +
  item.professionContent[form];
const getAnswer = async (row) => {
  const slot = row.locator(".profession-slot");
  const form = await slot.locator("..").getAttribute("data-form");
  const id = await row.getAttribute("data-profession-id");
  const item = catalog.find((i) => i.id === id);
  const article =
    item.professionContent.conceptKey === "modell"
      ? "das"
      : form === "masculine"
        ? "der"
        : "die";
  return { slot, id, text: `${article} ${item.professionContent[form]}` };
};
try {
  // The hierarchy works on a direct URL, and tabs retain the existing unlock order.
  await page.goto(base + "/learn/L01/vocabulary/core-images");
  const breadcrumbs = page.getByRole("navigation", { name: "เส้นทางบทเรียน" });
  const categories = page.getByRole("navigation", { name: "หมวดคำศัพท์" });
  await categories.waitFor();
  assert.deepEqual(await breadcrumbs.locator("li").allTextContents(), ["Lektion 01", "/Wortschatz", "/Bilder Wortschatz"]);
  assert.equal(await categories.locator('[aria-disabled="true"]').count(), 4);
  assert.equal(await page.locator('.category-arrow').count(),0);
  assert.equal(await categories.locator('[aria-current="page"] [lang="de"]').innerText(),"Begrüßung");
  assert.equal(await categories.locator('[aria-current="page"] [lang="th"]').innerText(),"คำทักทาย");
  await categories.locator('[aria-current="page"]').focus();
  await page.keyboard.press("ArrowRight");
  assert.equal(new URL(page.url()).pathname,"/learn/L01/vocabulary/core-images");
  assert.equal(await page.locator(".vocabulary-image-heading").count(), 0);
  assert.equal(await page.locator(".vocabulary-image-progress").innerText(), "เรียนแล้ว 0 / 30 คำ");
  for (const group of vocabularyImageGroups.slice(0, 3)) {
    if (group.id !== "greeting") await page.getByRole("link", {name:"หน้าถัดไป",exact:true}).click();
    await categories.locator('[aria-current="page"]').filter({hasText:group.title}).waitFor();
    if (group.id === "names") {
      // A wrong word/image selection must mark just the two cards actually clicked,
      // in either order, rather than revealing their unseen counterpart cards.
      const progressBefore = await page.locator('.vocabulary-image-progress').innerText();
      for (const imageFirst of [false,true]) {
        await page.reload();
        await categories.locator('[aria-current="page"]').filter({hasText:group.title}).waitFor();
        const word = page.getByRole('button',{name:'der Vorname',exact:true});
        const image = page.locator('.vocabulary-image-picture').first(); // Familienname
        if (imageFirst) { await image.click(); await word.click(); }
        else { await word.click(); await image.click(); }
        assert.equal(await page.locator('.vocabulary-image-word.incorrect').count(),1);
        assert.equal(await page.locator('.vocabulary-image-picture.incorrect').count(),1);
        assert.ok(await word.evaluate(el=>el.classList.contains('incorrect')));
        assert.ok(await image.evaluate(el=>el.classList.contains('incorrect')));
        assert.equal(await page.locator('.vocabulary-image-paired-card').count(),0);
        assert.equal(await page.locator('.vocabulary-image-progress').innerText(),progressBefore);
        assert.equal(await page.getByRole('link',{name:'หน้าถัดไป',exact:true}).count(),0);
        await page.getByRole('button',{name:'der Name',exact:true}).click();
        assert.equal(await page.locator('.vocabulary-image-word.incorrect,.vocabulary-image-picture.incorrect').count(),0);
      }
    }
    const remaining = [...group.pictureOrder];
    for (const id of group.wordOrder) {
      const entry = vocabularyImageEntries.find((entry) => entry.id === id);
      await page.getByRole("button", {name:entry.german,exact:true}).click();
      await page.locator(".vocabulary-image-picture").nth(remaining.indexOf(id)).click();
      assert.equal(await page.evaluate(()=>window.__spoken),entry.german, 'L01 correct matches automatically read the German word');
      remaining.splice(remaining.indexOf(id),1);
    }
  }
  await categories.getByRole("link", {name:"คำทักทาย"}).click();
  await categories.locator('[aria-current="page"]').filter({hasText:"คำทักทาย"}).waitFor();
  await page.locator(".vocabulary-image-paired-card").first().waitFor();
  assert.equal(await page.locator(".vocabulary-image-paired-card").count(),4);
  await page.getByRole('button',{name:'ฟัง Hallo',exact:true}).click();
  assert.equal(await page.evaluate(()=>window.__spoken),'Hallo');
  assert.equal(await page.getByRole('button',{name:'ฟัง Hallo',exact:true}).locator('svg').count(),1);
  assert.equal(await page.locator(".vocabulary-image-progress").innerText(),"เรียนแล้ว 10 / 30 คำ");
  await page.reload();
  await categories.locator('[aria-current="page"]').waitFor();
  assert.equal(await page.locator(".vocabulary-image-paired-card").count(),4);
  await categories.getByRole("link",{name:"ชื่อ-สกุล"}).click();
  await categories.locator('[aria-current="page"]').filter({hasText:"ชื่อ-สกุล"}).waitFor();
  assert.equal(await page.getByRole("button",{name:"เรียนซ้ำ",exact:true}).count(),0);
  assert.equal(await page.locator('.vocabulary-image-paired-word > span').count(),0);
  assert.ok(!(await categories.innerText()).includes("✓"));
  assert.equal(await categories.locator('[aria-current="page"]').evaluate(el=>getComputedStyle(el).borderBottomWidth),"3px");
  await categories.locator('[aria-current="page"]').focus();
  await page.keyboard.press("ArrowLeft");
  await categories.locator('[aria-current="page"]').filter({hasText:"คำบอกลา"}).waitFor();
  await page.keyboard.press("ArrowRight");
  await categories.locator('[aria-current="page"]').filter({hasText:"ชื่อ-สกุล"}).waitFor();
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth <= window.innerWidth + 1));
  await mkdir("test-results",{recursive:true});
  await page.screenshot({path:"test-results/learning-category-tabs-mobile.png",fullPage:true});
  await breadcrumbs.getByRole("link",{name:"Lektion 01",exact:true}).click();
  await page.locator(".lesson-heading").waitFor();
  assert.equal(new URL(page.url()).pathname,"/lesson/L01");
  await page.setViewportSize({width:1440,height:900});
  await page.locator('.sidebar nav').getByRole("link",{name:"บทเรียน",exact:true}).click();
  await page.getByRole("heading",{name:"บทเรียนของคุณ",exact:true}).waitFor();
  await page.goto(base + "/learn/L01/vocabulary/alphabet");
  await page.locator(".alphabet-set-progress-count").waitFor();
  assert.equal(await page.locator(".alphabet-set-progress-count").innerText(),"เรียนแล้ว 0 / 30 คำ");
  await page.getByRole("button",{name:"ฟังเสียงตัวอักษร",exact:true}).click();
  await page.getByRole("button",{name:"A",exact:true}).click();
  assert.equal(await page.locator(".alphabet-set-progress-count").innerText(),"เรียนแล้ว 1 / 30 คำ");
  await page.getByRole("button",{name:"ไปต่อ",exact:true}).click();
  assert.equal(await page.locator(".alphabet-set-progress-count").innerText(),"เรียนแล้ว 1 / 30 คำ");
  await page.reload();
  await page.locator(".alphabet-set-progress-count").waitFor();
  assert.equal(await page.locator(".alphabet-set-progress-count").innerText(),"เรียนแล้ว 1 / 30 คำ");
  const alphabet = JSON.parse(await readFile(new URL('../src/data/alphabet.json',import.meta.url),'utf8'));
  await db.query("update learner_lesson_states set state=$1::jsonb where lesson_key='deutsch-trainer-alphabet-learning-v1-L01'",[JSON.stringify({version:1,learnedItemIds:alphabet.items.map(item=>item.id),resumeIndex:30,revisitIndex:0})]);
  await page.goto(base + '/learn/L01/vocabulary');
  await page.reload();
  await page.locator('a[href="/learn/L01/vocabulary/alphabet"] .alphabet-entry-status').waitFor();
  assert.equal(await page.locator('a[href="/learn/L01/vocabulary/alphabet"] .alphabet-entry-status').innerText(),'เรียนแล้ว');
  assert.equal((await db.query("select state from learner_lesson_states where lesson_key='deutsch-trainer-alphabet-learning-v1-L01'")).rows[0].state.revisitIndex,0);
  await page.setViewportSize({width:1440,height:900});
  // Seed unrelated learning evidence to verify every save preserves it.
  const sentinel = {
    learnedActivityIds: ["L02-number-28-pattern"],
    learnedContentIds: ["L02-number-28"],
    matches: {},
    resumeIndex: 0,
    numberEndPage: "board",
  };
  await db.query(
    "insert into learner_lesson_states(user_id,lesson_key,state) values ($1,$2,$3)",
    [
      userId,
      lesson.learningFlows.vocabulary.stateKey,
      JSON.stringify(sentinel),
    ],
  );
  await page.goto(base + "/learn/L02/vocabulary/core");
  await page.locator(".profession-pair").first().waitFor();
  assert.equal(
    await page.locator(".profession-option .article-dot").count(),
    0,
  );
  assert.equal(await page.locator(".article-legend .article-dot").count(), 4);
  assert.ok(!(await page.locator(".article-legend").innerText()).includes("คำศัพท์อาชีพ"));
  const coreIds = new Set(vocabularyTrackActivities(lesson.learningFlows.vocabulary,catalog,"core").flatMap((entry)=>entry.type === "profession_matching" ? entry.pairs.map((pair)=>pair.id) : entry.contentIds));
  assert.equal(await page.locator(".vocabulary-image-progress").innerText(),`เรียนแล้ว 0 / ${coreIds.size} คำ`);
  assert.equal(await page.locator('.profession-meaning').count(),0);
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.waitForFunction(() => {
      const legend = document.querySelector('.article-legend');
      const container = document.querySelector('.profession-learning');
      return Math.abs(parseFloat(container.style.getPropertyValue('--article-legend-height')) - legend.getBoundingClientRect().height) < 1;
    });
    const bank = page.locator('.profession-options');
    const bankY = await bank.evaluate((element) => element.getBoundingClientRect().top + scrollY);
    for (const distance of [250, 500]) {
      await page.evaluate((y) => window.scrollTo(0, y), bankY + distance);
      await page.waitForFunction(() => {
        const bank = document.querySelector('.profession-options').getBoundingClientRect();
        const legend = document.querySelector('.article-legend').getBoundingClientRect();
        const progress = document.querySelector('.vocabulary-image-progress').getBoundingClientRect();
        return Math.abs(progress.top - legend.bottom) < 1 && Math.abs(bank.top - progress.bottom) < 1;
      });
      assert.ok(await bank.evaluate((element) => element.getBoundingClientRect().bottom < innerHeight / 2), 'sticky choices leave space to see the cards');
      await page.locator('.profession-option').first().click();
      assert.ok(await page.locator('.profession-option').first().evaluate((element) => element.classList.contains('selected')), 'sticky choices remain selectable');
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'sticky choices fit mobile and desktop');
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  const first = await getAnswer(page.locator(".profession-pair").first());
  const wrong = page
    .locator(".profession-option")
    .filter({ hasNotText: first.text })
    .first();
  const soundsBeforeWrong = await page.evaluate(()=>(window.__utterances ?? []).length);
  for (let i = 0; i < 2; i++) {
    await wrong.click();
    await first.slot.click();
  }
  assert.equal(
    await page
      .locator(".profession-pair")
      .first()
      .locator(".profession-hint")
      .count(),
    1,
  );
  assert.equal(
    await page
      .locator(".profession-pair")
      .first()
      .locator(".profession-slot")
      .count(),
    1,
  );
  assert.equal(await page.evaluate(()=>(window.__utterances ?? []).length),soundsBeforeWrong, 'wrong profession matches do not read the answer');
  assert.equal(await page.locator('.profession-meaning').count(),0, 'wrong answers do not reveal Thai meanings');
  assert.equal((await db.query("select * from item_exposures")).rows.length, 0);
  await page.getByRole("button", { name: first.text, exact: true }).click();
  await first.slot.click();
  assert.equal(await page.evaluate(()=>window.__spoken),first.text, "correct profession reads the matched form with Artikel");
  await page
    .locator(".profession-pair")
    .first()
    .locator(".profession-label")
    .nth(1)
    .waitFor();
  assert.equal(
    await page
      .locator(".profession-pair")
      .first()
      .locator(".article-dot")
      .count(),
    2,
  );
  assert.equal(
    await page
      .locator(".profession-pair")
      .first()
      .locator(".profession-slot")
      .count(),
    0,
  );
  assert.ok(
    await page
      .getByRole("button", { name: "หน้าถัดไป", exact: true })
      .isDisabled(),
  );
  assert.equal(await page.locator(".vocabulary-image-progress").innerText(),`เรียนแล้ว 1 / ${coreIds.size} คำ`);
  assert.equal(await page.locator('.profession-meaning').count(),1, 'only the correctly matched profession reveals its meaning');
  assert.equal(await page.locator('.profession-meaning').innerText(),catalog.find(item=>item.id === first.id).meaning);
  let state = await waitSave();
  for (const person of await page
    .locator(".profession-pair")
    .first()
    .locator(".profession-people > div")
    .all()) {
    const form = await person.getAttribute("data-form");
    await person
      .getByRole("button", {
        name: `ฟัง ${personLabel(
          catalog.find((i) => i.id === first.id),
          form,
        )}`,
        exact: true,
      })
      .click();
    assert.equal(await person.locator(".vocabulary-audio-icon").count(),1);
    const expected = catalog.find((i) => i.id === first.id).professionContent[
      form
    ];
    assert.ok(
      (await page.evaluate(() => window.__spoken)).includes(expected),
      "audio follows the displayed person",
    );
  }
  assert.deepEqual(state.professionAnswers[first.id], {
    correct: 1,
    wrong: 2,
    hints: 1,
  });
  assert.ok(state.learnedActivityIds.includes("L02-number-28-pattern"));
  assert.equal(state.numberEndPage, "board");
  await page.reload();
  await page
    .locator(".profession-pair")
    .first()
    .locator(".profession-label")
    .nth(1)
    .waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "เริ่มกิจกรรม", exact: true })
      .count(),
    0,
  );
  assert.equal(await page.evaluate(()=>(window.__utterances ?? []).length),0,'reload does not autoplay previously learned words');
  for (const [index, activity] of pages.entries()) {
    await page
      .locator(`[data-profession-id="${activity.pairs[0].id}"]`)
      .waitFor();
    await page.waitForFunction(() =>
      [...document.querySelectorAll(".profession-pair-image")].every(
        (img) => img.complete && img.naturalWidth > 0,
      ),
    );
    assert.equal(
      await page
        .locator(
          ".profession-page-count, .profession-intro, .guided-instruction, .profession-form-scope, .profession-explanation",
        )
        .count(),
      0,
    );
    assert.equal(
      await page.locator(".profession-first-note").count(),
      index === 0 ? 1 : 0,
    );
    // Check every rendered person's metadata and text on every page.
    for (const row of await page.locator(".profession-pair").all()) {
      const id = await row.getAttribute("data-profession-id");
      const entry = catalog.find((i) => i.id === id);
      assert.equal(
        await row.locator("img").count(),
        1,
        "one paired image per profession",
      );
      for (const person of await row
        .locator(".profession-people > div")
        .all()) {
        const form = await person.getAttribute("data-form");
        const personIndex = await person.evaluate((el) =>
          [...el.parentElement.children].indexOf(el),
        );
        const leftForm = await row
          .locator(".profession-pair-image")
          .getAttribute("data-left-form");
        assert.equal(
          form,
          personIndex === 0
            ? leftForm
            : leftForm === "masculine"
              ? "feminine"
              : "masculine",
        );
        assert.equal(
          await row
            .locator(".profession-pair-image")
            .evaluate((el) => el.classList.contains("mirrored")),
          leftForm === "feminine",
        );
        if (await person.locator(".profession-label").count())
          assert.ok(
            (await person.locator(".profession-label").textContent()).includes(
              entry.professionContent[form],
            ),
          );
      }
      if (await row.locator(".profession-slot").count()) {
        const answer = await getAnswer(row);
        await page
          .getByRole("button", { name: answer.text, exact: true })
          .click();
        await answer.slot.click();
        await row.locator(".profession-slot").waitFor({ state: "detached" });
      }
    }
    assert.equal(await page.locator(".profession-slot").count(), 0);
    assert.equal(
      await page.locator(".profession-label .article-dot").count(),
      activity.pairs.length * 2,
    );
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        "no horizontal overflow",
      );
    }
    await mkdir("test-results", { recursive: true });
    if (index === 0) {
      await page.screenshot({
        path: "test-results/berufe-desktop.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({
        path: "test-results/berufe-mobile.png",
        fullPage: true,
      });
      await page.setViewportSize({ width: 1440, height: 900 });
    }
    await waitSave();
    if (index < pages.length - 1) {
      await page.getByRole("button", { name: "หน้าถัดไป", exact: true }).click();
      await page.waitForFunction(() => window.scrollY === 0);
    } else {
      assert.equal(await page.getByText("เรียนครบแล้ว", {exact:true}).count(), 0);
      await page.getByRole("link", {name:"เรียนประโยคและสำนวนต่อ", exact:true}).waitFor();
    }
  }
  state = await waitSave();
  assert.ok(!(await page.locator('.learning-category-tabs').innerText()).includes('Traumberuf'), 'removed meaning page leaves no empty category');
  assert.ok(!(await page.locator('.guided-card').innerText()).includes('Traumberuf หมายถึงอะไร?'));
  assert.ok(pages.every((a) => state.learnedActivityIds.includes(a.id)));
  assert.ok(state.learnedActivityIds.includes("L02-number-28-pattern"));
  const vocabularyBeforePhrases = structuredClone(state);
  await page.getByRole('link', { name: 'เรียนประโยคและสำนวนต่อ', exact: true }).click();
  await page.locator('.phrase-vocabulary-table').waitFor();
  assert.equal(await page.locator('.phrase-vocabulary-table tbody tr').count(), 5);
  assert.equal(await page.locator('.phrase-example-list > div').count(), 6);
  assert.ok((await page.locator('.phrase-vocabulary-table').innerText()).includes('das Praktikum'));
  await page.getByRole('button', { name: 'ฟัง Ich arbeite nicht.', exact: true }).scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.vocabulary-image-progress').textContent.includes('6 / 9'));
  await page.getByRole('button', { name: 'ฟัง Ich bin freiberuflich.', exact: true }).click();
  assert.equal(await page.evaluate(() => window.__spoken), 'Ich bin freiberuflich.');
  await page.reload();
  await page.locator('.phrase-vocabulary-table').waitFor();
  await page.waitForFunction(() => document.querySelector('.vocabulary-image-progress').textContent.includes('6 / 9'));
  await page.locator('.learning-category-tabs').getByRole('button', { name: /Traumberuf/ }).click();
  await page.waitForFunction(() => window.scrollY === 0 && document.querySelector('.vocabulary-image-progress').textContent.includes('7 / 9'));
  assert.ok((await page.locator('.guided-card').innerText()).includes('อาชีพในฝัน'));
  await page.locator('.learning-category-tabs').getByRole('button', { name: /Weitere Redemittel/ }).click();
  await page.waitForFunction(() => document.querySelector('.vocabulary-image-progress').textContent.includes('9 / 9'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.learning-category-tabs').getByRole('button', { name: /Beruflicher Status/ }).click();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'phrase tables fit mobile');
  await page.screenshot({ path: 'test-results/l02-phrases-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: 'test-results/l02-phrases-desktop.png', fullPage: true });
  const vocabularyAfterPhrases = (await db.query("select state from learner_lesson_states where lesson_key='deutsch-trainer-guided-learning-L02-vocabulary'")).rows[0].state;
  assert.deepEqual(vocabularyAfterPhrases, vocabularyBeforePhrases, 'reading relocated phrases does not overwrite vocabulary history');
  assert.equal(
    (await db.query("select * from learning_attempts")).rows.length,
    0,
  );
  assert.ok((await db.query("select * from item_exposures")).rows.length >= 40);
  assert.deepEqual(errors, []);
  console.log(
    "PASS: all 40 pairs, correct/wrong/hints, locks, partial reload, compact layout, word audio, paired images, manual pages, article dots, desktop/mobile, exposure without mastery, unrelated history preserved. Local database; no production writes.",
  );
} finally {
  await browser.close();
  await db.close();
}
