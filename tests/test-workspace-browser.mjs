import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";
import rawVocabulary from "../src/data/vocabulary.json" with { type: "json" };

const webPort = 3032;
const apiPort = 54339;
const base = `http://localhost:${webPort}`;
let child;
let log = "";
async function start() {
  child = spawn(process.execPath, ["scripts/test-workspace.mjs"], {
    env: {
      ...process.env,
      TEST_WORKSPACE_PORT: String(webPort),
      TEST_WORKSPACE_API_PORT: String(apiPort),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout.on("data", (data) => {
    log += data;
  });
  child.stderr.on("data", (data) => {
    log += data;
  });
  const deadline = Date.now() + 90000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(log);
    if (log.includes("✓ Ready")) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("Test server did not start: " + log);
}
async function stop() {
  if (!child || child.exitCode !== null) return;
  const ended = new Promise((resolve) => child.once("exit", resolve));
  child.kill("SIGTERM");
  await ended;
}
let browser;
try {
  await start();
  browser = await chromium.launch({
    headless: true,
    executablePath:
      process.env.CHROME_PATH ||
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(45000);
  const errors = [];
  const productionRequests = [];
  const directApiRequests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).port === String(apiPort))
      directApiRequests.push(request.url());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("dialog", (dialog) => void dialog.accept());
  await context.route("https://*.supabase.co/**", async (route) => {
    productionRequests.push(route.request().url());
    await route.abort();
  });
  async function login(email = "tester@deutsch.test") {
    await page.getByLabel("อีเมล", { exact: true }).fill(email);
    await page.getByLabel("รหัสผ่าน", { exact: true }).fill("TestOnly123!");
    await page
      .getByRole("button", { name: "เข้าสู่ระบบ", exact: true })
      .click();
  }
  await page.goto(base + "/learn/L01/vocabulary/alphabet");
  await page.getByLabel("พื้นที่ทดสอบ", { exact: true }).waitFor();
  await login();
  await page.locator(".alphabet-set-progress-count").waitFor();
  assert.equal(
    await page.locator(".alphabet-set-progress-count").innerText(),
    "1 / 30",
  );
  await page
    .getByRole("button", { name: "ฟังเสียงตัวอักษร", exact: true })
    .click();
  await page.getByRole("button", { name: "A", exact: true }).click();
  await page.getByRole("button", { name: "ไปต่อ", exact: true }).click();
  await page.waitForFunction(
    () =>
      !Object.keys(localStorage).some((key) =>
        key.startsWith("deutsch-trainer-pending-lessons:"),
      ),
  );
  await page.reload();
  await page.locator(".alphabet-set-progress-count").waitFor();
  assert.equal(
    await page.locator(".alphabet-set-progress-count").innerText(),
    "2 / 30",
  );
  await page.goto(base + "/learn/L01/vocabulary/core-images");
  await page.locator(".vocabulary-image-matching").waitFor();
  await page.getByRole("button", { name: "Hallo", exact: true }).click();
  await page.locator(".vocabulary-image-picture").nth(2).click();
  await page.locator(".vocabulary-image-paired-card").waitFor();
  await page.waitForFunction(
    () =>
      !Object.keys(localStorage).some((key) =>
        key.startsWith("deutsch-trainer-pending-lessons:"),
      ),
  );
  await page.reload();
  await page.locator(".vocabulary-image-paired-card").waitFor();
  assert.equal(await page.locator(".vocabulary-image-paired-card").count(), 1);
  // Exercise actual app writes through the local REST adapter, including the learning RPC.
  await page.goto(base + "/learn/L02/vocabulary");
  await page.getByText("บันทึกว่าเคยเรียนแล้ว").waitFor();
  const token = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((key) =>
      key.startsWith("deutsch-trainer-test-"),
    );
    return JSON.parse(localStorage.getItem(key)).access_token;
  });
  const exposureResponse = await page.request.get(
    `http://127.0.0.1:${apiPort}/rest/v1/item_exposures?select=*`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const exposures = await exposureResponse.json();
  const vocabulary = rawVocabulary.find(
    (item) => item.Vocab_ID === exposures[0].item_id,
  );
  assert.ok(vocabulary);
  await page.goto(base + "/practice/L02/vocabulary");
  await page
    .getByRole("button", { name: "เริ่มฝึก 1 ข้อ", exact: true })
    .click();
  await page.locator(".session-heading").getByText("ข้อ 1 / 1").waitFor();
  await page.reload();
  await page.locator(".session-heading").getByText("ข้อ 1 / 1").waitFor();
  const choices = page.locator(".answer-options > button");
  let answered = false;
  for (let index = 0; index < (await choices.count()); index++) {
    if ((await choices.nth(index).innerText()).includes(vocabulary.Word_Thai)) {
      await choices.nth(index).click();
      answered = true;
      break;
    }
  }
  assert.equal(answered, true);
  await page
    .getByRole("heading", { name: "ตอบข้อนี้รู้สึกอย่างไร?" })
    .waitFor();
  await page.reload();
  await page
    .getByRole("heading", { name: "ตอบข้อนี้รู้สึกอย่างไร?" })
    .waitFor();
  await page.getByRole("button", { name: "ง่าย", exact: true }).click();
  await page.getByRole("button", { name: "ดูผลการฝึก", exact: true }).click();
  await page
    .getByRole("heading", { name: "อีกก้าวเล็ก ๆ สำเร็จแล้ว" })
    .waitFor();
  await page.goto(base + "/progress");
  await page
    .getByRole("heading", { name: "เห็นทุกก้าวที่คุณเติบโต" })
    .waitFor();
  await page.goto(base + "/learn/L01/vocabulary/core-images");
  await page.locator(".vocabulary-image-paired-card").waitFor();
  await page.getByRole("button", { name: "ออกจากระบบ", exact: true }).click();
  await login("tester2@deutsch.test");
  await page.locator(".vocabulary-image-matching").waitFor();
  assert.equal(await page.locator(".vocabulary-image-paired-card").count(), 0);
  await page.goto(base + "/practice/L02/vocabulary");
  await page
    .getByRole("heading", { name: "ยังไม่มีรายการที่เคยเรียนสำหรับแบบฝึกนี้" })
    .waitFor();
  await page.goto(base + "/learn/L01/vocabulary/alphabet");
  await page.locator(".alphabet-set-progress-count").waitFor();
  assert.equal(
    await page.locator(".alphabet-set-progress-count").innerText(),
    "1 / 30",
  );
  await page.getByRole("button", { name: "ออกจากระบบ", exact: true }).click();
  await login();
  await page.locator(".alphabet-set-progress-count").waitFor();
  assert.equal(
    await page.locator(".alphabet-set-progress-count").innerText(),
    "2 / 30",
  );
  // Deliberately leave a draft in the browser. Restart must still produce a fresh lesson.
  await page.evaluate(() => {
    const key = Object.keys(localStorage).find((key) =>
      key.startsWith("deutsch-trainer-test-"),
    );
    const user = JSON.parse(localStorage.getItem(key)).user;
    localStorage.setItem(
      `deutsch-trainer-pending-lessons:${user.id}`,
      JSON.stringify({
        "deutsch-trainer-alphabet-learning-v1-L01": JSON.stringify({
          version: 1,
          learnedItemIds: ["alphabet_a"],
          resumeIndex: 29,
          revisitIndex: null,
        }),
      }),
    );
  });
  await stop();
  log = "";
  await start();
  await page.reload();
  await login();
  await page.locator(".alphabet-set-progress-count").waitFor();
  assert.equal(
    await page.locator(".alphabet-set-progress-count").innerText(),
    "1 / 30",
  );
  await page.goto(base + "/learn/L01/vocabulary/core-images");
  await page.locator(".vocabulary-image-matching").waitFor();
  assert.equal(await page.locator(".vocabulary-image-paired-card").count(), 0);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(
    await page.getByLabel("พื้นที่ทดสอบ", { exact: true }).isVisible(),
    true,
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(
    directApiRequests,
    [],
    "browser API requests stay on the app origin",
  );
  assert.deepEqual(
    productionRequests,
    [],
    "workspace never contacts the hosted Supabase project",
  );
  await page.close({ runBeforeUnload: false });
  console.log(
    "PASS: test login, alphabet/image persistence, Learn to Practice and pending resume to Progress, account isolation, fresh restart ignores stale drafts, mobile notice, no hosted Supabase requests",
  );
} catch (error) {
  console.error(log);
  throw error;
} finally {
  if (browser) await browser.close();
  await stop();
}
