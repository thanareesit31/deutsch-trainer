import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { a13ReleaseCourses } from '../src/data/a13-release.ts';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
page.setDefaultTimeout(60000);
const saved = new Map(), failures = [];
page.on('response', async response => {
  const request = response.request();
  if (!request.url().includes('/learner_lesson_states') || request.method() !== 'POST') return;
  const body = request.postDataJSON();
  if (!body.lesson_key?.includes('release-course-v1')) return;
  if (response.ok()) saved.set(body.lesson_key, body.state);
  else failures.push({ key: body.lesson_key, error: await response.text() });
});
async function flush(key, predicate) {
  for (let count = 0; count < 180; count++) {
    if (failures.length) throw Error(JSON.stringify(failures));
    const state = saved.get(key);
    if (state && predicate(state)) return state;
    await page.waitForTimeout(150);
  }
  throw Error(`No persisted state: ${key}`);
}
async function answer(task) {
  if (task.kind === 'choice') await page.locator('.release-options button').filter({ hasText: new RegExp(`^${task.acceptedAnswers[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).click();
  else if (task.kind === 'write') await page.getByRole('textbox', { name: 'คำตอบภาษาเยอรมัน' }).fill(task.acceptedAnswers[0]);
  else {
    const remaining = task.tokens.map((token, index) => ({ token, index }));
    let rest = task.acceptedAnswers[0];
    while (remaining.length) {
      const at = remaining.findIndex(({ token }) => rest === token || rest.startsWith(`${token} `));
      assert.notEqual(at, -1, `word bank cannot form ${rest}`);
      const [{ token, index }] = remaining.splice(at, 1);
      await page.locator('.release-options button').nth(index).click();
      rest = rest.slice(token.length).trimStart();
    }
  }
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
  await page.goto('http://localhost:3002/learn/L15/vocabulary');
  await page.getByLabel('อีเมล', { exact: true }).fill('tester2@deutsch.test');
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.release-course').waitFor();
  for (const course of a13ReleaseCourses) {
    const key = `deutsch-trainer-release-course-v1-${course.lessonId}-${course.skill}`;
    await page.goto(`http://localhost:3002/learn/${course.lessonId}/${course.skill}`);
    await page.getByRole('button', { name: 'ลองใช้สิ่งที่เพิ่งเรียน', exact: true }).waitFor();
    assert.equal(await page.locator('.release-course').evaluate(el => el.scrollWidth > el.clientWidth + 1), false, `${key} model overflows mobile`);
    await page.getByRole('button', { name: 'ลองใช้สิ่งที่เพิ่งเรียน', exact: true }).click();
    const active = await flush(key, state => !!state.active && state.active.origin === 'learn');
    const task = course.tasks.find(q => q.id === active.active.taskId);
    assert.ok(task);
    assert.equal(await page.locator('.phrase-annotated-sentence').count(), 0, 'No pre-answer structure hints');
    await answer(task);
    await flush(key, state => !!state.active?.draft);
    await page.reload();
    await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).isEnabled(), true, `${key} draft restored`);
    await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).click();
    const checked = await flush(key, state => state.attempts.some(a => a.taskId === task.id));
    assert.equal(checked.attempts.at(-1).correct, true);
    assert.equal(checked.attempts.at(-1).helpUsed, false);
    await page.locator('.release-feedback').waitFor();
    await page.waitForTimeout(150);
    const overflow = await page.locator('.phrase-annotated-sentence').evaluateAll(rows => rows.flatMap(row => {
      const bounds = row.getBoundingClientRect();
      return [...row.querySelectorAll('dt')].filter(word => { const b = word.getBoundingClientRect(); return b.left < bounds.left - 1 || b.right > bounds.right + 1; }).map(word => word.textContent);
    }));
    assert.deepEqual(overflow, [], `${key} one-line feedback`);
    await page.getByRole('button', { name: 'เรียนประเด็นต่อไป', exact: true }).click();
    await flush(key, state => state.active === null && state.cursor === checked.cursor + 1);
    console.log(`${course.lessonId} ${course.skill}: real account save, draft reload, check, next`);
  }
  assert.deepEqual(failures, []);
  console.log('All 12 released courses passed through ordinary UI against real local RLS/validators; auth display email adjusted, writes not mocked.');
} finally { await browser.close(); }
