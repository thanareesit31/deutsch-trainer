import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const inventory = JSON.parse(readFileSync('docs/exercise-mapping/l13-phrases-bank.json', 'utf8'));
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const contexts = [], errors = [];
async function device(email) {
  const context = await browser.newContext(); contexts.push(context);
  const page = await context.newPage(); page.setDefaultTimeout(45000);
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:3002/practice');
  await page.getByLabel('อีเมล', { exact: true }).fill(email);
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.getByRole('heading', { name: 'แบบฝึกหัดของคุณ' }).waitFor(); return page;
}
async function frame(page, prefix = 'phrases-basic') {
  await page.locator('iframe').waitFor();
  const iframe = page.frames().find(f => f.name().startsWith(prefix + '-account-'));
  await iframe.locator('[data-question-id],#continue-topic').first().waitFor(); return iframe;
}
async function history(page) {
  return page.evaluate(async () => {
    const key = Object.keys(localStorage).find(key => key.startsWith('deutsch-trainer-test-') && !key.endsWith('-user'));
    const auth = JSON.parse(localStorage.getItem(key));
    const response = await fetch('/__test-db/rest/v1/learner_practice_sessions?bank_key=eq.phrases-basic', { headers: { Authorization: 'Bearer ' + auth.access_token } });
    if (!response.ok) throw new Error('History HTTP ' + response.status);
    return response.json();
  });
}
async function until(check, label) {
  for (let i = 0; i < 150; i++) { if (await check()) return; await new Promise(resolve => setTimeout(resolve, 100)); }
  throw new Error(label);
}
async function choosePair(iframe, row, answer) {
  await iframe.locator('[data-match-prompt="' + row.question.id + '"]').click();
  await iframe.locator('[data-match-answer]').filter({ hasText: answer }).click();
}
async function answer(iframe, wrongMatch = false) {
  const item = await iframe.evaluate(() => activeItem());
  if (item.question.interaction === 'match') {
    const block = await iframe.evaluate(() => current().items.slice(current().position, current().position + 2));
    for (let i = 0; i < block.length; i++) await choosePair(iframe, block[i], block[wrongMatch ? 1 - i : i].question.acceptedAnswers[0]);
  } else if (item.question.kind === 'choice') {
    await iframe.getByRole('button', { name: item.question.acceptedAnswers[0], exact: true }).click();
  } else {
    assert.equal(item.question.kind, 'order');
    for (const token of item.question.tokens) await iframe.getByRole('button', { name: 'เพิ่มคำ ' + token, exact: true }).click();
  }
  await iframe.locator('#check').click(); await iframe.locator('#feedback').waitFor();
  assert.match(await iframe.locator('.thai-translation').first().innerText(), /\S/);

}
try {
  const page = await device('tester2@deutsch.test');
  await Promise.all([page.waitForNavigation({waitUntil:'load'}),page.getByRole('button', { name: 'เรียนแล้วทั้งหมด', exact: true }).click()]);
  await page.waitForURL('**/practice'); await page.getByRole('heading', { name: 'แบบฝึกหัดของคุณ' }).waitFor();
  await page.goto('http://localhost:3002/practice/L13/phrases/basic'); let iframe = await frame(page);
  const legacy = {...inventory.legacyQuestions.find(q => q.id === 'L13-R001-context'),stageId:'stage-2'};
  await iframe.evaluate(q => start([q], 1), legacy);
  const legacyId = await iframe.evaluate(() => current().id);
  await iframe.getByText('ขั้น 1 จาก 1 · เลือกสำนวนให้ตรงสถานการณ์',{exact:true}).waitFor();
  await iframe.getByRole('button', { name: legacy.acceptedAnswers[0], exact: true }).click();
  await iframe.locator('#check').click();
  await until(async () => (await history(page)).find(row => row.session_id === legacyId)?.state.items[0].attempt?.correct === true, 'Legacy answer not saved');
  await iframe.getByRole('button', { name: 'เริ่มรอบรูปแบบใหม่', exact: true }).click();
  const session = await iframe.evaluate(() => structuredClone(current())); assert.equal(session.items.length, 20);
  assert.equal(new Set(session.items.map(item => item.question.itemId)).size, 20);
  for (let i = 0; i < 20; i += 5) {
    assert.deepEqual(session.items.slice(i, i + 5).map(item => item.question.subskill), ['phrase_context', 'phrase_context', 'phrase_match', 'phrase_match', 'phrase_order']);
    assert.deepEqual(session.items.slice(i, i + 5).map(item => item.question.difficulty), [1, 1, 2, 2, 3]);
  }
  const id = session.id;
  await answer(iframe);
  assert.equal(await iframe.getByText('คำแปลคำถาม: คุณชอบเบอร์ลินไหม', { exact: true }).count(), 1);
  await iframe.locator('#next').click();
  await answer(iframe); await iframe.locator('#next').click();
  let pair = await iframe.evaluate(() => current().items.slice(2, 4));
  await choosePair(iframe, pair[0], pair[0].question.acceptedAnswers[0]);
  assert.equal(await iframe.locator('[data-match-answer="' + pair[0].question.acceptedAnswers[0] + '"]').getAttribute('data-matched'), 'true');
  assert.equal(await iframe.locator('[data-match-prompt="' + pair[0].question.id + '"]').getAttribute('data-matched'), 'true');
  assert.equal(await iframe.locator('[data-match-prompt="' + pair[1].question.id + '"]').getAttribute('aria-pressed'), 'false');
  assert.equal(await iframe.locator('[data-match-prompt="' + pair[1].question.id + '"]').getAttribute('data-matched'), 'false');
  await iframe.locator('[data-match-answer="' + pair[1].question.acceptedAnswers[0] + '"]').click();
  assert.equal(await iframe.locator('[data-match-answer="' + pair[1].question.acceptedAnswers[0] + '"]').getAttribute('aria-pressed'), 'true');
  await iframe.locator('[data-match-prompt="' + pair[1].question.id + '"]').click();
  assert.equal(await iframe.locator('[data-match-prompt="' + pair[1].question.id + '"]').getAttribute('data-matched'), 'true');
  assert.equal(await iframe.locator('[data-match-answer="' + pair[1].question.acceptedAnswers[0] + '"]').getAttribute('aria-pressed'), 'false');
  assert.equal(await iframe.locator('.phrase-match-column [data-match-prompt]').count(), 2);
  assert(await iframe.locator('#check').isEnabled());
  await until(async () => (await history(page)).find(row => row.session_id === id)?.state.items[2].response === pair[0].question.acceptedAnswers[0], 'Matching draft not saved');
  const second = await device('tester2@deutsch.test');
  await second.goto('http://localhost:3002/practice/L13/phrases/basic?resume=' + id); iframe = await frame(second);
  assert.equal(await iframe.evaluate(() => current().position), 2);
  assert.equal(await iframe.evaluate(() => activeItem().response), pair[0].question.acceptedAnswers[0]);
  await second.screenshot({ path: '.tools/l13-phrases-matching-desktop.png', fullPage: true });
  await second.setViewportSize({ width: 390, height: 844 });
  assert(await second.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert(await iframe.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await second.screenshot({ path: '.tools/l13-phrases-matching-mobile.png', fullPage: true, animations:'disabled' });
  await answer(iframe, true);
  assert.equal(await iframe.getByText('คำแปลคำถาม: คุณคิดว่าเมืองนี้ยอดเยี่ยมไหม', { exact: true }).count(), 1);
  for (const item of await iframe.evaluate(() => current().items.slice(2, 4))) {
    assert.equal(await iframe.locator('.phrase-match-checked-row').filter({ hasText: item.question.sentence }).innerText().then(text => text.includes(item.response)), true);
  }
  assert.deepEqual(await iframe.evaluate(() => current().items.slice(2, 4).map(item => item.attempt.correct)), [false, false]);
  assert.match(await iframe.locator('.practice-progress').innerText(), /4 \/ 20/);
  await iframe.locator('#next').click();
  await second.setViewportSize({ width: 1280, height: 900 });
  let topicTransitions = 0, previousTopic = '';
  while (!(await iframe.getByRole('heading', { name: 'ผลลัพธ์ของวันนี้', exact: true }).count())) {
    assert.equal(await iframe.locator('#continue-topic').count(), 0);
    const topic = await iframe.evaluate(() => activeItem().question.topicId);
    if (previousTopic && topic !== previousTopic) topicTransitions++;
    previousTopic = topic;
    await answer(iframe); await iframe.locator('#next').click();
  }
  assert.equal(topicTransitions, 3);
  assert.deepEqual(await iframe.locator('#app .phrase-summary .row button').allTextContents(), ['ฝึกเพิ่ม', 'จบ']);
  assert.equal(await iframe.locator('#app table, #app details, #app #feedback').count(), 0);
  await until(async () => (await history(second)).find(row => row.session_id === id)?.state.completed, 'Round completion not saved');
  const saved = (await history(second)).find(row => row.session_id === id).state;
  assert.equal(saved.items.length, 20); assert.equal(saved.items.filter(item => item.attempt.correct).length, 18);
  const retained = (await history(second)).find(row => row.session_id === legacyId).state;
  assert.equal(retained.archived, true); assert.equal(retained.items[0].attempt.correct, true);
  await iframe.getByRole('button', { name: 'ฝึกเพิ่ม', exact: true }).click(); iframe = await frame(second, 'phrases-daily');
  if(await iframe.getByRole('button',{name:'เริ่มรอบรูปแบบใหม่',exact:true}).count())await iframe.getByRole('button',{name:'เริ่มรอบรูปแบบใหม่',exact:true}).click();
  const daily = await iframe.evaluate(() => current().items);
  assert.equal(daily.length, 10); assert.equal(new Set(daily.map(item => item.question.itemId)).size, 10);
  for (const item of daily.filter(item => item.question.interaction === 'match')) assert.equal(daily.filter(other => other.question.matchGroupId === item.question.matchGroupId).length, 2);
  await second.goto('http://localhost:3002/practice/L13/phrases/city'); iframe = await frame(second, 'phrases-city');
  await iframe.evaluate(() => start(BANK.questions, BANK.defaultCount));
  assert.equal(await iframe.locator('.card[data-question-id] > span.tag').count(), 0);
  assert.deepEqual(await iframe.evaluate(() => current().items.map(item => item.question.sequence)), [1, 2, 3, 4, 5]);
  const other = await device('tester@deutsch.test'); assert(!(await history(other)).some(row => row.session_id === id));
  const isolated=await browser.newContext();contexts.push(isolated);const partial=await isolated.newPage();partial.on('pageerror',error=>errors.push(error.message));
  await partial.route('http://localhost:3002/__phrase-selection-fixture',route=>route.fulfill({contentType:'text/html',body:JSON.parse(readFileSync('src/data/l13-phrases-city-preview.json','utf8')).html}));
  await partial.goto('http://localhost:3002/__phrase-selection-fixture');
  await partial.evaluate(()=>window.postMessage({type:'grammar-preview-direct-start',learnedItemIds:['L13-R011','L13-R012','L13-R013','L13-R016']},location.origin));
  await partial.locator('[data-question-id]').waitFor();assert.equal(await partial.evaluate(()=>current().items.length),3);assert.equal(await partial.evaluate(()=>current().items.some(item=>item.question.interaction==='match')),false);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ guided20: true, uniqueTargets20: true, orderedDifficulty: true, continuousAcrossFourTopics: true, compactCompletionActions: true, hiddenLearnerResults: true, matchingDraftResume: true, pairResultsSeparate: true, savedLegacyAnswer: true, dailyPairsComplete: true, manual5: true, topicTagRemoved: true, incompletePairExcluded: true, mobile: true, accountIsolation: true, pageErrors: errors }));
} finally { await browser.close(); }
