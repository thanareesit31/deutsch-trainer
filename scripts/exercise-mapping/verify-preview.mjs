import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright-core';
const root = new URL('../../', import.meta.url);
const bank = JSON.parse(await readFile(new URL('docs/exercise-mapping/l13-dative-bank.json', root), 'utf8'));
const url = new URL('docs/exercise-mapping/l13-dative-preview.html', root).href;
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const errors = [];
try {
 const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
 const page = await context.newPage();
 page.on('pageerror', e => errors.push(e.message));
 await page.goto(url);
 await page.evaluate(() => localStorage.clear());
 await page.reload();
 assert.equal(await page.locator('#start').innerText(), 'เริ่มฝึก 5 ข้อ');
 assert.equal(await page.locator('.setup-options').getAttribute('open'), null);
 await page.locator('.setup-options summary').click();
 await page.selectOption('#count', 'all');
 await page.click('#start');
 let savedPendingChecked = false;
 for (let i = 0; i < 15; i++) {
  const id = await page.locator('[data-question-id]').getAttribute('data-question-id');
  const q = bank.questions.find(x => x.id === id);
  assert(q);
  if (i === 0) await page.click('#hint');
  const answer = q.id.endsWith('013') ? 'ihnen' : q.acceptedAnswers[0];
  if (q.kind === 'choice') await page.getByRole('button', { name: answer, exact: true }).click();
  else if (q.kind === 'cloze') await page.fill('#response', answer);
  else {
   await page.getByRole('button', { name: `เพิ่มคำ ${q.tokens[0]}`, exact: true }).click();
   await page.getByRole('button', { name: `นำคำ ${q.tokens[0]} กลับ`, exact: true }).click();
   for (const word of q.tokens) await page.getByRole('button', { name: `เพิ่มคำ ${word}`, exact: true }).click();
  }
  await page.click('#check');
  assert.equal(await page.locator('#feedback').count(), 1);
  if (i === 0) assert(!/ผลจะไม่รวมกับการทำได้เอง/.test(await page.locator('#feedback').innerText()));
  if (q.id.endsWith('013')) {
   assert.match(await page.locator('#feedback').innerText(), /ยังไม่ถูก/);
   assert.equal(await page.locator('[data-confidence]').count(), 0);
  } else {
   assert.match(await page.locator('#feedback').innerText(), /ถูกต้อง/);
   if (!savedPendingChecked) {
    const before = await page.evaluate(() => JSON.stringify(current()));
    await page.reload();
    assert.equal(await page.evaluate(() => JSON.stringify(current())), before);
    assert.equal(await page.locator('[data-confidence]').count(), 0);
    await page.evaluate(() => submit());
    assert.equal(await page.evaluate(() => JSON.stringify(current())), before, 'Duplicate submit changed attempt');
    savedPendingChecked = true;
   }
   assert(await page.locator('#next').isEnabled());
  }
  await page.click('#next');
 }
 assert.match(await page.locator('main').innerText(), /14\/15/);
 assert.equal(await page.locator('#review').count(), 1);
 await page.click('#review');
 assert.equal(await page.evaluate(() => current().items.length), 2, 'Wrong/guess review set');
 const checks = await page.evaluate(() => {
  const formal = BANK.questions.find(q => q.id.endsWith('013'));
  const other = BANK.questions.find(q => q.id.endsWith('012'));
  const item = (question, response) => ({ question, response, selected: [] });
  return [grade(item(formal,'Ihnen')).correct,grade(item(formal,'ihnen')).correct,grade(item(other,'Ihnen')).correct,grade(item(other,'  ihnen.  ')).correct,grade(item(formal,'xyz')).errorTag];
 });
 assert.deepEqual(checks, [true, false, false, true, 'unclassified']);
 // Three new rounds exhaust the bank without repeating an ID.
 await page.evaluate(() => { localStorage.clear(); location.reload(); });
 await page.waitForSelector('#start');
 const selected = [];
 for (let round = 0; round < 3; round++) {
  await page.click('#start');
  const ids = await page.evaluate(() => current().items.map(i => i.question.id));
  assert.equal(ids.length, 5);
  selected.push(...ids);
  await page.getByRole('button', { name: 'กลับไปเลือกชุด', exact: true }).click();
 }
 assert.equal(new Set(selected).size, 15);
 // Sparse pool gives actual count, never duplicated questions.
 await page.locator('.setup-options summary').click();
 await page.selectOption('#format', 'order');
 await page.selectOption('#count', '10');
 assert.match(await page.locator('#pool-info').innerText(), /รอบนี้ 2 ข้อ/);
 assert.equal(await page.locator('#start').innerText(), 'เริ่มฝึก 2 ข้อ');
 await page.click('#start');
 assert.equal(await page.evaluate(() => current().items.length), 2);
 // Failed persistence must not display feedback or commit an attempt.
 for (const word of await page.evaluate(() => activeItem().question.tokens)) await page.getByRole('button', { name: `เพิ่มคำ ${word}`, exact: true }).click();
 await page.evaluate(() => { window.originalSetItem = Storage.prototype.setItem; Storage.prototype.setItem = () => { throw new Error('quota'); }; });
 await page.click('#check');
 assert.equal(await page.locator('#feedback').count(), 0);
 assert.equal(await page.evaluate(() => activeItem().attempt), null);
 assert.equal(await page.locator('#storage-error').isVisible(), true);
 await page.evaluate(() => { Storage.prototype.setItem = window.originalSetItem; });
 await page.click('#check');
 assert.equal(await page.locator('#feedback').count(), 1);
 // A mobile view can complete choices, typing and word ordering without horizontal scroll.
 await page.setViewportSize({ width: 320, height: 740 });
 assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
 await mkdir(new URL('.tools/a13-item-audit/screenshots/', root), { recursive: true });
 await page.screenshot({ path: new URL('.tools/a13-item-audit/screenshots/order-mobile.png', root).pathname, fullPage: true });
 await page.getByRole('button', { name: 'กลับไปเลือกชุด', exact: true }).click();
 await page.locator('.setup-options summary').click();
 await page.selectOption('#format', 'cloze');
 await page.selectOption('#count', '5');
 await page.click('#start');
 await page.fill('#response', await page.evaluate(() => activeItem().question.acceptedAnswers[0]));
 await page.click('#check');
 assert(await page.locator('#next').isEnabled());
 await page.click('#next');
 assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
 await page.screenshot({ path: new URL('.tools/a13-item-audit/screenshots/cloze-mobile.png', root).pathname, fullPage: true });
 await page.setViewportSize({ width: 1280, height: 900 });
 await page.screenshot({ path: new URL('.tools/a13-item-audit/screenshots/cloze-desktop.png', root).pathname, fullPage: true });
 // A saved version-1 round keeps its answer snapshot while showing the revised wording.
 await page.evaluate(() => {
  const old = { ...BANK.questions[0], version: 1, prompt: 'เลือกสรรพนามให้ตรงกับบุคคลในวงเล็บ', sentence: 'Der Markt gefällt ___. (ich)', context: undefined };
  const session = { id: crypto.randomUUID(), position: 0, completed: false, items: [{ question: old, response: '', selected: [], tokenOrder: [], hintUsed: false, attempt: null }] };
  const next = { version: 1, sessions: [session], activeId: session.id };
  localStorage.setItem(KEY, JSON.stringify(next));
 });
 await page.reload();
 assert.equal(await page.locator('.context').count(), 0);
 assert.match(await page.locator('.sentence').innerText(), /Ich finde den Markt schön/);
 assert(!/วงเล็บ|\(ich\)/.test(await page.locator('[data-question-id]').innerText()));
 assert.match(await page.evaluate(() => activeItem().question.sentence), /\(ich\)/);
 assert(!/Grammatik aktiv|Das Training|pdfPage|sourceId/.test(await page.locator('body').innerText()));
 assert.deepEqual(errors, []);
 console.log('PASS: all 15 prompts, grading, pending resume, no-repeat draws, storage failure, mobile layout, old-round wording, no source attribution.');
} finally { await browser.close(); }
