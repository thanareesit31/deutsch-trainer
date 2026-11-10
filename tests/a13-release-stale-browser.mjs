import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { a13ReleaseCourses } from '../src/data/a13-release.ts';
const course = a13ReleaseCourses.find(c => c.lessonId === 'L15' && c.skill === 'vocabulary');
assert.ok(course);
const bank = 'a13-release-l15-vocabulary';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const context = await browser.newContext();
const secondContext = await browser.newContext();
const a = await context.newPage(), b = await secondContext.newPage();
const failures = [], bSubmitted = [], errors = [];
for (const page of [a, b]) {
  page.setDefaultTimeout(60000);
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', async response => {
    const request = response.request();
    if (!request.url().includes('/rpc/sync_practice_session') || request.method() !== 'POST') return;
    const body = request.postDataJSON();
    if (body.p_bank_key !== bank) return;
    if (!response.ok()) failures.push(await response.text());
    if (page === b && body.p_state.items.some(i => i.attempt)) bSubmitted.push(body.p_state);
  });
}
async function local(page) {
  return page.evaluate(bank => {
    const key = Object.keys(localStorage).find(k => k.includes(`:${bank}:v1:`));
    const snapshot = key ? JSON.parse(localStorage.getItem(key)) : null;
    return snapshot?.sessions.find(s => s.id === snapshot.activeId);
  }, bank);
}
async function remote(page, id) {
  return page.evaluate(async ({ bank, id }) => {
    const key = Object.keys(localStorage).find(k => k.startsWith('deutsch-trainer-test-') && !k.endsWith('-user'));
    const auth = JSON.parse(localStorage.getItem(key));
    const response = await fetch(`/__test-db/rest/v1/learner_practice_sessions?select=state&bank_key=eq.${bank}&session_id=eq.${id}`, { headers: { Authorization: `Bearer ${auth.access_token}` } });
    if (!response.ok) throw Error(`Read failed ${response.status}`);
    return (await response.json())[0]?.state ?? null;
  }, { bank, id });
}
async function waitRemote(page, id, predicate) {
  for (let n = 0; n < 160; n++) {
    if (failures.length) throw Error(JSON.stringify(failures));
    const state = await remote(page, id);
    if (state && predicate(state)) return state;
    await page.waitForTimeout(150);
  }
  throw Error('Expected persisted state was not observed');
}
async function answer(page, task) {
  if (task.kind === 'choice') await page.getByRole('button', { name: task.acceptedAnswers[0], exact: true }).click();
  else if (task.kind === 'write') await page.getByRole('textbox', { name: 'คำตอบภาษาเยอรมัน' }).fill(task.acceptedAnswers[0]);
  else {
    const remaining = task.tokens.map((token, index) => ({ token, index }));
    let rest = task.acceptedAnswers[0];
    while (remaining.length) {
      const at = remaining.findIndex(({ token }) => rest === token || rest.startsWith(`${token} `));
      assert.notEqual(at, -1);
      const [{ token, index }] = remaining.splice(at, 1);
      await page.locator('.release-options button').nth(index).click();
      rest = rest.slice(token.length).trimStart();
    }
  }
}
try {
  for (const isolated of [context, secondContext]) await isolated.route('**/__test-db/auth/v1/**', async route => {
    const response = await route.fetch();
    if (!response.headers()['content-type']?.includes('json')) return route.fulfill({ response });
    const data = await response.json();
    if (data.user) data.user.email = 'ordinary-learner@deutsch.test';
    if (data.email) data.email = 'ordinary-learner@deutsch.test';
    return route.fulfill({ response, json: data });
  });
  await a.goto('http://localhost:3002/practice/L15/vocabulary');
  await a.getByLabel('อีเมล', { exact: true }).fill('tester2@deutsch.test');
  await a.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await a.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await a.locator('.release-course').waitFor();
  // Finish a real unfinished setup round from a prior interrupted run, without replacing any first answer.
  for (let n = 0; n < 10; n++) {
    const pending = await local(a);
    if (!pending || pending.completed) break;
    const entry = pending.items[pending.position];
    const task = course.tasks.find(t => t.id === entry.question.id);
    assert.ok(task);
    if (!entry.attempt) {
      await answer(a, task);
      await a.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).click();
      await waitRemote(a, pending.id, state => !!state.items[pending.position].attempt);
    }
    await a.getByRole('button', { name: pending.position === pending.items.length - 1 ? 'จบรอบฝึก' : 'ต่อไป', exact: true }).click();
    await waitRemote(a, pending.id, state => state.completed || state.position > pending.position);
  }
  await a.goto(`http://localhost:3002/practice/L15/vocabulary?guided=${course.cards[0].id}`);
  await a.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).waitFor();
  const initial = await local(a), id = initial.id;
  assert.equal(initial.items.length, 1);
  await waitRemote(a, id, state => state.items[0].hintUsed === false);
  await b.goto(`http://localhost:3002/practice/L15/vocabulary?resume=${id}`);
  await b.getByLabel('อีเมล', { exact: true }).fill('tester2@deutsch.test');
  await b.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await b.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await b.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).waitFor();
  assert.equal((await local(b)).id, id);
  await a.getByRole('button', { name: 'ดูตัวอย่างช่วย', exact: true }).click();
  await waitRemote(a, id, state => state.items[0].hintUsed === true);
  assert.equal(await b.getByRole('button', { name: 'ดูตัวอย่างช่วย', exact: true }).isEnabled(), true, 'B component retains the pre-help state');
  assert.equal(await b.locator('.release-help').count(), 0);
  const task = course.tasks.find(t => t.id === initial.items[0].question.id);
  assert.ok(task);
  await answer(b, task);
  await b.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).click();
  const merged = await waitRemote(b, id, state => state.items[0].attempt?.correct === true && state.items[0].hintUsed === true && state.items[0].attempt?.assisted === true);
  const first = merged.items[0].attempt;
  assert.equal(first.response, task.acceptedAnswers[0]);
  assert.ok(bSubmitted.some(s => s.id === id && s.items[0].attempt && s.items[0].hintUsed === false && s.items[0].attempt.assisted === false), 'B actually submits its stale unassisted copy');
  await b.waitForFunction(({ bank, id }) => {
    const key = Object.keys(localStorage).find(k => k.includes(`:${bank}:v1:`));
    const state = JSON.parse(localStorage.getItem(key));
    const item = state.sessions.find(s => s.id === id)?.items[0];
    return item?.hintUsed === true && item.attempt?.assisted === true;
  }, { bank, id });
  await b.locator('.release-feedback').waitFor();
  await b.getByRole('button', { name: 'จบรอบฝึก', exact: true }).click();
  const completed = await waitRemote(b, id, state => state.completed === true);
  assert.equal(completed.items[0].hintUsed, true, 'B UI state refreshed before final save');
  assert.ok(bSubmitted.some(s => s.id === id && s.completed && s.items[0].hintUsed && s.items[0].attempt.assisted), 'B completion payload uses the refreshed canonical component state');
  assert.deepEqual(completed.items[0].attempt, first, 'first response unchanged on next/complete');
  await b.reload();
  await b.getByRole('heading', { name: 'จบรอบฝึกแล้ว', exact: true }).waitFor();
  assert.deepEqual((await local(b)).items[0].attempt, first);
  assert.equal(await b.getByText(/บันทึกผลฝึกไม่สำเร็จ/).count(), 0);
  assert.deepEqual(failures, []);
  assert.deepEqual(errors, []);
  console.log('Real isolated two-device help merge passed: stale unassisted submit becomes assisted, canonical readback refreshes B, first response preserved through completion/reload.');
} finally { await browser.close(); }
