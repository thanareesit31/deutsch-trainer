import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base = process.env.TEST_BASE_URL || 'http://localhost:3002';
const key = 'deutsch-trainer-phrase-discovery-v1-L01';
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const errors = [];
const productionRequests = [];
async function account(email, learner = false) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 960 } });
  await context.route('https://*.supabase.co/**', route => { productionRequests.push(route.request().url()); return route.abort(); });
  if (learner) await context.route('**/__test-db/auth/v1/**', async route => {
    const response = await route.fetch();
    if (!response.headers()['content-type']?.includes('json')) return route.fulfill({ response });
    const data = await response.json();
    if (data.user) data.user.email = 'learner-preview@deutsch.test';
    if (data.email) data.email = 'learner-preview@deutsch.test';
    await route.fulfill({ response, json: data });
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base + '/learn/L01/phrases/discovery');
  await page.getByLabel('อีเมล', { exact: true }).fill(email);
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.profile').waitFor();
  return { context, page };
}
async function state(page, userId) {
  return page.evaluate(async ({ key, userId }) => {
    const authKey = Object.keys(localStorage).find(name => name.startsWith('deutsch-trainer-test-') && !name.endsWith('-user'));
    const auth = JSON.parse(localStorage.getItem(authKey));
    const response = await fetch('/__test-db/rest/v1/learner_lesson_states?select=state&lesson_key=eq.' + key + (userId ? '&user_id=eq.' + userId : ''), { headers: { Authorization: 'Bearer ' + auth.access_token } });
    if (!response.ok) throw new Error('State request failed: ' + response.status);
    return { userId: auth.user.id, rows: await response.json() };
  }, { key, userId });
}
async function saved(page, predicate) {
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    const data = await state(page);
    const run = data.rows[0]?.state.runs.at(-1);
    if (run && predicate(run)) return run;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  throw new Error('Expected account state was not saved');
}
try {
  const { page, context } = await account('tester@deutsch.test');
  await page.getByRole('link', { name: 'ลองเรียนประโยคบท 1', exact: true }).waitFor();
  // Append a fresh local fixture run while retaining all previous tester history.
  await page.evaluate(async key => {
    const authKey = Object.keys(localStorage).find(name => name.startsWith('deutsch-trainer-test-') && !name.endsWith('-user'));
    const auth = JSON.parse(localStorage.getItem(authKey));
    const headers = { Authorization: 'Bearer ' + auth.access_token, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates' };
    const url = '/__test-db/rest/v1/learner_lesson_states';
    const rows = await (await fetch(url + '?select=state&lesson_key=eq.' + key, { headers })).json();
    const state = rows[0]?.state ?? { version: 1, runs: [] };
    state.runs.push({ id: 'browser-' + crypto.randomUUID(), step: 0, modelIds: [], responses: {}, completed: false });
    const result = await fetch(url + '?on_conflict=user_id,lesson_key', { method: 'POST', headers, body: JSON.stringify({ user_id: auth.user.id, lesson_key: key, state }) });
    if (!result.ok) throw new Error('Cannot create local fixture run: ' + result.status);
  }, key);
  await page.reload();
  if (await page.getByRole('button', { name: 'ลองอีกรอบ', exact: true }).count()) await page.getByRole('button', { name: 'ลองอีกรอบ', exact: true }).click();
  await page.getByRole('button', { name: 'ลองตอบ', exact: true }).waitFor();
  await page.screenshot({ path: '.tools/phrase-discovery-model-desktop.png', fullPage: true, animations: 'disabled' });
  assert(!/PDF|COMM-0|product-authored/.test(await page.locator('#main').innerText()));
  await page.getByRole('button', { name: 'ลองตอบ', exact: true }).click();
  const check = () => page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true });
  assert(await check().isDisabled());
  await page.getByRole('button', { name: 'Guten Abend!', exact: true }).click();
  await check().click();
  await page.getByText('ลองดูคำตอบนี้', { exact: true }).waitFor();
  assert.equal(await page.locator('.phrase-discovery-feedback .phrase-discovery-prompt-meaning').count(), 0);
  const first = await saved(page, run => run.responses['L01-COMM-01-D01-learn-v1']?.first?.correct === false);
  const original = first.responses['L01-COMM-01-D01-learn-v1'].first;
  assert.equal(original.response, 'Guten Abend!');
  assert.equal(original.modelSeen, true);
  await page.reload();
  await page.getByText('ลองดูคำตอบนี้', { exact: true }).waitFor();
  assert(await page.getByRole('button', { name: 'Guten Morgen!', exact: true }).isDisabled());
  assert.deepEqual((await saved(page, run => !!run.responses['L01-COMM-01-D01-learn-v1']?.first)).responses['L01-COMM-01-D01-learn-v1'].first, original);
  async function next() { await page.getByRole('button', { name: 'ต่อไป', exact: true }).click(); }
  async function choose(text) {
    await page.getByRole('button', { name: text, exact: true }).click();
    await check().click();
    await page.getByText('ถูกต้อง', { exact: true }).waitFor();
  }
  async function model() { await page.getByRole('button', { name: 'ลองตอบ', exact: true }).click(); }
  await next(); await choose('Tschüs!'); await next(); await model();
  const help = page.locator('.phrase-discovery h1 .practice-word-meaning').first();
  await help.focus();
  await page.getByRole('button', { name: 'bin', exact: true }).click();
  await saved(page, run => run.responses['L01-COMM-02-D01-learn-v1']?.selection.length === 1);
  await page.reload();
  await page.getByRole('button', { name: 'นำ bin กลับ', exact: true }).waitFor();
  await page.getByRole('button', { name: 'นำ bin กลับ', exact: true }).click();
  assert(await check().isDisabled());
  for (const word of ['Ich', 'bin', 'Mali.']) await page.getByRole('button', { name: word, exact: true }).click();
  await check().click(); await page.getByText('ถูกต้อง', { exact: true }).waitFor();
  assert.equal(await page.locator('.phrase-discovery-prompt-meaning').innerText(), 'อีกฝ่ายพูดว่า: ฉันชื่ออันนา แล้วเธอคือใคร');
  const nameRun = await saved(page, run => run.responses['L01-COMM-02-D01-learn-v1']?.first?.correct);
  assert(nameRun.responses['L01-COMM-02-D01-learn-v1'].first.helpWords.length > 0);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: '.tools/phrase-discovery-order-mobile.png', fullPage: true, animations: 'disabled' });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await next(); await choose('Das ist Mali.'); await next(); await model();
  await choose('Gut, danke. Und Ihnen?'); await next(); await choose('Nicht so gut.'); await next(); await model();
  for (const word of ['Ich', 'komme', 'aus', 'Thailand.']) await page.getByRole('button', { name: word, exact: true }).click();
  await check().click(); await page.getByText('ถูกต้อง', { exact: true }).waitFor();
  await next(); await choose('Sie kommt aus Deutschland.'); await next(); await model();
  await choose('Entschuldigung. Wie bitte?'); await next(); await choose('Danke.');
  await page.getByRole('button', { name: 'จบการเรียน', exact: true }).click();
  await page.getByRole('heading', { name: 'เรียนบทสนทนาครบแล้ว' }).waitFor();
  const finished = await saved(page, run => run.completed);
  assert.equal(Object.keys(finished.responses).length, 10);
  assert.equal(finished.modelIds.length, 5);
  assert.equal(finished.responses['L01-COMM-01-D01-learn-v1'].first.correct, false);
  const firstAccount = await state(page);
  await page.reload(); await page.getByRole('heading', { name: 'เรียนบทสนทนาครบแล้ว' }).waitFor();
  await page.getByRole('button', { name: 'ลองอีกรอบ', exact: true }).click();
  await page.getByRole('button', { name: 'ลองตอบ', exact: true }).waitFor();
  await saved(page, run => run.id !== finished.id && run.step === 0);
  const replay = await state(page);
  assert(replay.rows[0].state.runs.some(run => run.id === finished.id && run.completed));
  const second = await account('tester2@deutsch.test');
  await second.page.getByRole('button', { name: 'ลองตอบ', exact: true }).waitFor();
  assert.deepEqual((await state(second.page, firstAccount.userId)).rows, []);
  await second.context.close();
  const learner = await account('tester2@deutsch.test', true);
  await learner.page.locator('.lesson-heading').waitFor();
  assert.equal(await learner.page.locator('.phrase-discovery').count(), 0);
  assert.equal(await learner.page.getByRole('link', { name: 'ลองเรียนประโยคบท 1', exact: true }).count(), 0);
  await learner.context.close();
  assert.deepEqual(errors, []);
  assert.deepEqual(productionRequests, []);
  await context.close();
  console.log('PASS: 5 Learn topics, 10 checks, wrong-first-answer preservation, draft reload/removal, word-help evidence, completion/replay, mobile, RLS isolation and non-tester gate.');
} finally { await browser.close(); }
