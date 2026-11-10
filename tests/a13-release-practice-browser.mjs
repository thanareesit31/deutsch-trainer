import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { a13ReleaseCourses } from '../src/data/a13-release.ts';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
page.setDefaultTimeout(60000);
const saved = new Map(), failures = [], pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('response', async response => {
  const request = response.request();
  if (!request.url().includes('/rpc/sync_practice_session') || request.method() !== 'POST') return;
  const body = request.postDataJSON();
  if (!body.p_bank_key?.startsWith('a13-release-')) return;
  if (response.ok()) saved.set(`${body.p_bank_key}:${body.p_state.id}`, body.p_state);
  else failures.push({ bank: body.p_bank_key, error: await response.text() });
});
async function flush(bank, id, predicate) {
  for (let n = 0; n < 240; n++) {
    if (failures.length) throw Error(JSON.stringify(failures));
    const state = saved.get(`${bank}:${id}`);
    if (state && predicate(state)) return state;
    await page.waitForTimeout(150);
  }
  throw Error(`No successful shared RPC save: ${bank}:${id}`);
}
async function snapshot(bank) {
  return page.evaluate(bank => {
    const key = Object.keys(localStorage).find(key => key.includes(`:${bank}:v1:`));
    if (!key) return null;
    const state = JSON.parse(localStorage.getItem(key));
    return state.sessions.find(s => s.id === state.activeId);
  }, bank);
}
async function answer(task) {
  if (task.kind === 'choice') await page.locator('.release-options button').filter({ hasText: new RegExp(`^${task.acceptedAnswers[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).click();
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
async function backendSession(bank, id) {
  return page.evaluate(async ({ bank, id }) => {
    const authKey = Object.keys(localStorage).find(key => key.startsWith('deutsch-trainer-test-') && !key.endsWith('-user'));
    const auth = JSON.parse(localStorage.getItem(authKey));
    const response = await fetch(`/__test-db/rest/v1/learner_practice_sessions?select=bank_key,state&bank_key=eq.${encodeURIComponent(bank)}&session_id=eq.${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${auth.access_token}` } });
    if (!response.ok) throw Error(`Shared persisted read failed: ${response.status}`);
    return response.json();
  }, { bank, id });
}
try {
  await page.route('**/__test-db/auth/v1/**', async route => {
    const response = await route.fetch();
    if (!response.headers()['content-type']?.includes('json')) return route.fulfill({ response });
    const data = await response.json();
    if (data.user) data.user.email = 'ordinary-learner@deutsch.test';
    if (data.email) data.email = 'ordinary-learner@deutsch.test';
    return route.fulfill({ response, json: data });
  });
  await page.goto('http://localhost:3002/practice/L15/vocabulary');
  await page.getByLabel('อีเมล', { exact: true }).fill('tester2@deutsch.test');
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.release-course').waitFor();
  for (const course of a13ReleaseCourses) {
    const bank = `a13-release-${course.lessonId.toLowerCase()}-${course.skill}`;
    await page.goto(`http://localhost:3002/practice/${course.lessonId}/${course.skill}?guided=${encodeURIComponent(course.cards[0].id)}`);
    await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).waitFor();
    let session = await snapshot(bank);
    assert.ok(session, bank);
    assert.ok(session.items.length <= 10);
    assert.equal(new Set(session.items.map(i => i.question.targetId)).size, session.items.length);
    const ids = session.items.map(i => i.question.id);
    assert.equal(await page.locator('.phrase-annotated-sentence').count(), 0, `${bank} pre-answer annotations`);
    let firstAttempt;
    for (let step = session.position; step < session.items.length; step++) {
      session = await snapshot(bank);
      const task = course.tasks.find(q => q.id === session.items[session.position].question.id);
      assert.ok(task);
      if (!session.items[session.position].attempt) {
        await answer(task);
        await flush(bank, session.id, state => !!state.items[step].response);
        if (step === 0) {
          await page.reload();
          await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).waitFor();
          assert.deepEqual((await snapshot(bank)).items.map(i => i.question.id), ids, `${bank} stable queue after reload`);
          assert.equal(await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).isEnabled(), true, `${bank} draft restored`);
        }
        await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).click();
      }
      const checked = await flush(bank, session.id, state => !!state.items[step].attempt);
      assert.equal(checked.items[step].attempt.correct, true, task.id);
      assert.equal(checked.items[step].attempt.confidence, null);
      assert.equal(checked.items[step].attempt.assisted, false);
      await page.locator('.release-feedback').waitFor();
      if (step === 0) firstAttempt = checked.items[0].attempt;
      if (step === 1) {
        await page.getByRole('button', { name: 'ย้อนดูข้อก่อน', exact: true }).click();
        await page.locator('.release-feedback').waitFor();
        assert.equal(await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).count(), 0);
        assert.deepEqual((await snapshot(bank)).items[0].attempt, firstAttempt);
        await page.getByRole('button', { name: 'ต่อไป', exact: true }).click();
      }
      await page.getByRole('button', { name: step === session.items.length - 1 ? 'จบรอบฝึก' : 'ต่อไป', exact: true }).click();
    }
    const completed = await flush(bank, session.id, state => state.completed === true);
    const backend = await backendSession(bank, session.id);
    assert.equal(backend.length, 1, `${bank} account persisted row`);
    assert.equal(backend[0].state.completed, true);
    assert.deepEqual(backend[0].state.items.map(i => i.question.id), ids);
    assert.deepEqual(completed.items.map(i => i.attempt.correct), completed.items.map(() => true));
    console.log(`${bank}: ${completed.items.length} tasks, real shared RPC + backend read, draft reload, stable queue, immutable feedback${completed.items.length > 1 ? ', back review' : ''}`);
  }
  assert.deepEqual(failures, []);
  assert.deepEqual(pageErrors, []);
  console.log('All twelve shared Practice banks passed ordinary UI and real account persistence; only auth display email was adjusted.');
} finally { await browser.close(); }
