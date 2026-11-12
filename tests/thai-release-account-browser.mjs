import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

process.loadEnvFile('.env.local');
const origin = process.env.THAI_AUDIT_ORIGIN || 'https://deutsch-trainer-gamma.vercel.app';
const accounts = JSON.parse(readFileSync(process.env.THAI_AUDIT_ACCOUNTS_FILE || '.tools/thai-release-accounts.json', 'utf8'));
assert.equal(accounts.length, 2, 'Use two fresh disposable learner accounts');
assert(accounts.every(account => /^thai-release-[0-9]+-[01]@deutsch\.test$/.test(account.email)), 'Never run against an existing learner account');
const catalog = JSON.parse(readFileSync('supabase/seed/catalog.json', 'utf8')).items;
const words = catalog.filter(item => item.lessonId === 'L05' && item.skill === 'vocabulary' && item.collection === 'core');
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const contexts = [];
const errors = [];
const report = { origin, checks: {}, scope: 'Dedicated ordinary authenticated accounts on hosted Supabase; no learner history modified' };
let activePage;
async function device(index, path) {
  const context = await browser.newContext({ viewport: { width: 375, height: 900 } });
  contexts.push(context);
  const page = await context.newPage(); activePage = page;
  page.setDefaultTimeout(45000);
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + path);
  await page.getByLabel('อีเมล', { exact: true }).fill(accounts[index].email);
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill(accounts[index].password);
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.profile').waitFor({ state: 'attached' });
  return page;
}
async function rows(page, table, query = '') {
  return page.evaluate(async ({ table, query, url, key }) => {
    const auth = JSON.parse(localStorage.getItem('sb-wmfdleejmtdcyqoonnqg-auth-token'));
    const response = await fetch(url + '/rest/v1/' + table + '?' + query, { headers: { apikey: key, Authorization: 'Bearer ' + auth.access_token } });
    if (!response.ok) throw Error(table + ' HTTP ' + response.status);
    return response.json();
  }, { table, query, url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY });
}
async function until(fn, label) {
  for (let i = 0; i < 100; i++) { const value = await fn(); if (value) return value; await new Promise(resolve => setTimeout(resolve, 250)); }
  throw Error(label);
}
async function frame(page, answered = false) {
  await page.locator('iframe').waitFor();
  const target = page.frames().find(frame => frame.name().includes('a11-vocab-l05-basic'));
  assert(target, 'L05 ordinary-account iframe');
  await target.locator(answered ? '#feedback' : '[data-question-id]').waitFor();
  return target;
}
async function answer(target, submit = true) {
  const q = await target.evaluate(() => activeItem().question);
  if (q.kind === 'choice') await target.locator('.choices').getByRole('button', { name: q.acceptedAnswers[0], exact: true }).click();
  else if (q.kind === 'cloze') await target.locator('#response').fill(q.acceptedAnswers[0]);
  else for (const token of q.tokens) await target.getByRole('button', { name: 'เพิ่มคำ ' + token, exact: true }).first().click();
  if (submit) await target.locator('#check').click();
  return q;
}
let safariId;
async function safari(command, body = {}, method = 'POST') {
  const response = await fetch('http://localhost:4444/session/' + safariId + '/' + command, { method, ...(method === 'POST' ? { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {}) });
  const data = await response.json();
  if (data.value?.error) throw Error('Safari ' + data.value.error + ': ' + data.value.message);
  return data.value;
}
const safariJS = (script, args = []) => safari('execute/sync', { script, args });
try {
  const a = await device(0, '/practice/L05/vocabulary/basic');
  await a.locator('iframe').waitFor();
  const empty = a.frames().find(frame => frame.name().includes('a11-vocab-l05-basic'));
  await empty.getByText('ยังไม่มีคำที่เรียนแล้วในหัวข้อนี้', { exact: true }).waitFor();
  assert.equal(await empty.locator('[data-question-id]').count(), 0);
  assert.equal((await rows(a, 'learner_practice_sessions')).length, 0);
  report.checks.unlearnedTargetsBlocked = true;
  console.log('PASS ordinary account cannot practice unseen targets');

  for (const group of [...new Set(words.map(word => word.group))]) {
    const slug = group.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    await a.goto(origin + '/learn/L05/vocabulary/images/' + slug);
    const groupWords = words.filter(word => word.group === group);
    let matched = 0;
    while (matched < groupWords.length) {
      await a.locator('[data-vocabulary-id]').first().waitFor();
      const ids = await a.locator('[data-vocabulary-id]').evaluateAll(cards => cards.map(card => card.dataset.vocabularyId));
      for (const id of ids) {
        const word = groupWords.find(word => word.id === id);
        assert(word, 'Known taught word ' + id);
        const card = a.locator(`[data-vocabulary-id="${id}"]`);
        if (await card.getAttribute('data-matched') !== 'true') {
          await a.locator('.profession-options').getByRole('button', { name: word.answer, exact: true }).click();
          await card.locator('.l13-city-image').click();
          await until(async () => await card.getAttribute('data-matched') === 'true', 'Learn match not completed: ' + id);
        }
        matched++;
      }
      console.log('Learn ' + group + ': ' + matched + '/' + groupWords.length);
      if (matched < groupWords.length) {
        await a.getByRole('link', { name: 'หน้าถัดไป', exact: true }).click();
        await a.locator(`[data-vocabulary-id="${ids[0]}"]`).waitFor({ state: 'detached' });
      }
    }
  }
  const savedLearn = await until(async () => (await rows(a, 'learner_lesson_states')).find(row => JSON.stringify(row.state).includes(words.at(-1).id)), 'Learn state not saved');
  for (const word of words) assert.ok(JSON.stringify(savedLearn.state).includes(word.id), word.id);
  report.checks.learnThroughUIAndServerPersistence = { words: words.length };
  console.log('PASS matched and saved ' + words.length + ' taught words through learner UI');

  await a.goto(origin + '/practice/L05/vocabulary/basic');
  let f = await frame(a);
  assert.ok(await f.evaluate(() => appendGerman.toString().includes('\\p{M}')), 'Corrected tokenizer is deployed');
  report.checks.deployedThaiTokenizer = true;
  const initial = await f.evaluate(() => structuredClone(current()));
  const allowed = new Set(words.map(word => word.id));
  assert(initial.items.every(item => (item.question.requiredItemIds || [item.question.itemId]).every(id => allowed.has(id))));
  const first = await answer(f);
  const saved = await until(async () => (await rows(a, 'learner_practice_sessions')).find(row => row.state.id === initial.id && row.state.items[0].attempt), 'Answer not saved to account');
  assert.equal(saved.state.items[0].attempt.correct, true);
  assert.equal(saved.state.items[0].attempt.response, first.acceptedAnswers[0]);
  report.checks.eligibleRegisteredQuestionsSaved = { items: initial.items.length, firstAnswer: true };
  console.log('PASS eligible queue and first answer persisted by hosted RPC');

  await a.getByRole('button', { name: 'ออกจากระบบ', exact: true }).first().click();
  await a.getByLabel('อีเมล', { exact: true }).waitFor();
  report.checks.signOut = true;
  const b = await device(0, '/practice/L05/vocabulary');
  const resume = b.getByRole('dialog').getByRole('link', { name: 'ทำต่อ', exact: true });
  await resume.waitFor();
  assert.ok((await resume.getAttribute('href')).includes(initial.id));
  await resume.click();
  f = await frame(b, true);
  assert.equal(await f.evaluate(() => current().id), initial.id);
  assert.deepEqual(await f.evaluate(() => current().items.map(item => item.question.id)), initial.items.map(item => item.question.id));
  assert.deepEqual(await f.evaluate(() => activeItem().attempt), saved.state.items[0].attempt);
  await f.locator('#next').click();
  await answer(f, false);
  const draft = await f.evaluate(() => ({ id: current().id, position: current().position, questionId: activeItem().question.id, response: activeItem().response, selected: activeItem().selected, options: activeItem().question.options }));
  await until(async () => { const s = (await rows(b, 'learner_practice_sessions')).find(row => row.state.id === initial.id)?.state; return s?.position === draft.position && s.items[s.position].response === draft.response; }, 'Draft not saved');
  report.checks.cleanDeviceResumeAndDraft = true;
  console.log('PASS sign-out, sign-in, resume dialog and second-device draft persistence');

  if (process.env.THAI_AUDIT_SKIP_SAFARI !== '1') {
  safariId = JSON.parse(readFileSync('.tools/thai-safari-session.json', 'utf8')).value.sessionId;
  await safari('url', { url: origin + '/practice/L05/vocabulary/basic?resume=' + initial.id });
  await until(() => safariJS('return !!document.querySelector("#auth-email")'), 'Safari login missing');
  await safariJS(`const [email,password]=arguments;for(const [selector,value] of [['#auth-email',email],['#auth-password',password]]){const el=document.querySelector(selector);Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('form button[type="submit"]').click();return true;`, [accounts[0].email, accounts[0].password]);
  await until(() => safariJS('return !!document.querySelector(".profile")'), 'Safari sign in failed');
  await until(() => safariJS('const w=document.querySelector("iframe")?.contentWindow;return !!w?.document.querySelector("[data-question-id]")'), 'Safari practice missing');
  const safariDraft = await safariJS('const w=document.querySelector("iframe").contentWindow;const s=w.current(),i=w.activeItem();return {id:s.id,position:s.position,questionId:i.question.id,response:i.response,selected:i.selected,options:i.question.options};');
  assert.deepEqual(safariDraft, draft);
  const thai = await safariJS(`const doc=document.querySelector('iframe').contentDocument;const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);let n;const issues=[];while(n=walker.nextNode()){if(/^[\\u0e31\\u0e34-\\u0e3a\\u0e47-\\u0e4e]/u.test(n.textContent))issues.push(n.textContent);}return issues;`);
  assert.deepEqual(thai, []);
  await safariJS('document.querySelector("iframe").contentDocument.querySelector("#check").click();return true;');
  await until(() => safariJS('return !!document.querySelector("iframe").contentDocument.querySelector("#feedback")'), 'Safari feedback missing');
  await until(async () => (await rows(b, 'learner_practice_sessions')).find(row => row.state.id === initial.id)?.state.items[draft.position].attempt, 'Safari answer not saved');
  const screenshot = await safari('screenshot', {}, 'GET');
  mkdirSync('artifacts/thai-word-help', { recursive: true });
  writeFileSync('artifacts/thai-word-help/production-safari-feedback.png', Buffer.from(screenshot, 'base64'));
  const viewport = await safariJS('return {width:innerWidth,height:innerHeight}');
  report.checks.safari = { viewport, browserVersion: '15.6.1', restoredExactQueueAndDraft: true, answeredAndSaved: true, detachedThaiMarks: 0, device: 'macOS Safari, not a physical iPhone' };
  console.log('PASS Safari actual browser resumed draft, rendered Thai, submitted and saved answer');

  } else {
    await f.locator('#check').click();
    await until(async () => (await rows(b, 'learner_practice_sessions')).find(row => row.state.id === initial.id)?.state.items[draft.position].attempt, 'Second answer not saved');
    report.checks.safari = { status: 'blocked', browserVersion: '15.6.1', reason: 'This machine has Safari below the Next.js minimum 16.4; standalone Thai rendering separately passed 104 banks' };
  }

  const other = await device(1, '/practice/L05/vocabulary/basic');
  assert.deepEqual(await rows(other, 'learner_practice_sessions'), []);
  assert.deepEqual(await rows(other, 'learner_lesson_states'), []);
  await other.locator('iframe').waitFor();
  const otherFrame = other.frames().find(frame => frame.name().includes('a11-vocab-l05-basic'));
  await otherFrame.getByText('ยังไม่มีคำที่เรียนแล้วในหัวข้อนี้', { exact: true }).waitFor();
  assert.equal((await rows(other, 'learner_practice_sessions', 'session_id=eq.' + initial.id)).length, 0);
  const denied = await other.evaluate(async ({ url, key, bank, state }) => {
    const auth = JSON.parse(localStorage.getItem('sb-wmfdleejmtdcyqoonnqg-auth-token'));
    const response = await fetch(url + '/rest/v1/rpc/sync_practice_session', { method: 'POST', headers: { apikey: key, Authorization: 'Bearer ' + auth.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_bank_key: bank, p_state: state }) });
    return { status: response.status, message: (await response.json()).message };
  }, { url: process.env.NEXT_PUBLIC_SUPABASE_URL, key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, bank: saved.bank_key, state: saved.state });
  assert(denied.status >= 400 && denied.status < 500, 'Server rejects unlearned copied queue');
  assert.match(denied.message, /has not been learned/);
  assert.deepEqual(await rows(other, 'learner_practice_sessions'), []);
  report.checks.serverRejectsUnlearnedQueue = true;
  const after = (await rows(b, 'learner_practice_sessions')).find(row => row.state.id === initial.id);
  assert.deepEqual(after.state.items[0].attempt, saved.state.items[0].attempt);
  report.checks.accountIsolationAndFirstAnswerPreserved = true;
  assert.deepEqual(errors, []);
  report.pageErrors = errors;
  report.status = report.checks.safari?.status === 'blocked' ? 'account-passed-safari-blocked' : 'passed';
  writeFileSync('artifacts/thai-word-help/production-account-report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} catch (error) {
  report.status = 'failed'; report.error = error.message; report.pageErrors = errors;
  mkdirSync('artifacts/thai-word-help', { recursive: true });
  writeFileSync('artifacts/thai-word-help/production-account-report.json', JSON.stringify(report, null, 2) + '\n');
  if (activePage) console.log((await activePage.locator('body').innerText()).slice(-2200));
  throw error;
} finally { await browser.close(); }
