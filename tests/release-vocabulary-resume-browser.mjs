import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { chromium } from 'playwright-core';
import { startTestApi } from '../scripts/test-workspace-api.mjs';
import { a13ReleaseCourses } from '../src/data/a13-release.ts';
import { emptyReleaseState } from '../src/lib/a13-release.ts';

const course = a13ReleaseCourses.find(course => course.lessonId === 'L15' && course.skill === 'vocabulary');
const task = course.tasks.find(task => task.spelling);
const user = { id: randomUUID(), email: 'tester2@deutsch.test', aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: {}, created_at: new Date().toISOString(), email_confirmed_at: new Date().toISOString() };
const key = 'deutsch-trainer-release-course-v1-L15-vocabulary';
const state = { ...emptyReleaseState(), learned: course.cards.map(card => card.id), active: { taskId: task.id, draft: 'Ha', helpUsed: true, startedAt: '2026-11-23T00:00:00Z', selectionReason: 'เรียนต่อจากรอบเดิม', origin: 'learn', learningCardId: task.requiredCardIds[0] } };
const rows = a13ReleaseCourses.filter(course => course.skill === 'vocabulary').map(current => ({ user_id: user.id, lesson_key: `deutsch-trainer-release-course-v1-${current.lessonId}-vocabulary`, state: current.lessonId === 'L15' ? state : { ...emptyReleaseState(), learned: current.cards.map(card => card.id) } }));
const api = await startTestApi({ port: 0, restore: { accounts: [user], rows: { learner_lesson_states: rows } } });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
let closing = false;
try {
  const context = await browser.newContext();
  await context.route('**/__test-db/**', async route => {
    try {
      const response = await route.fetch({ url: route.request().url().replace('http://localhost:3002/__test-db', api.url), maxRetries: 3 });
      if (route.request().url().includes('/auth/v1/')) {
        const json = await response.json();
        if (json.user) json.user.email = 'ordinary-learner@deutsch.test';
        if (json.email) json.email = 'ordinary-learner@deutsch.test';
        return route.fulfill({ response, json });
      }
      assert.ok(response.ok(), await response.text());
      return route.fulfill({ response });
    } catch (error) {
      if (!closing) console.error(error.message.split('\n')[0]);
      await route.abort().catch(() => {});
    }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  await page.goto('http://localhost:3002/learn/L15/vocabulary');
  await page.getByLabel('อีเมล', { exact: true }).fill(user.email);
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.vocabulary-learning, .release-course').first().waitFor();
  assert.equal(await page.locator('.vocabulary-image-entry-card').count(), 3, 'A pending old trial must not replace the vocabulary category entry');
  assert.deepEqual((await api.snapshot()).rows.learner_lesson_states.find(row => row.lesson_key === key).state.active, state.active);
  await page.locator('.vocabulary-image-entry-card').first().click();
  await page.locator('.vocabulary-image-matching').waitFor();
  assert.equal(await page.locator('.release-course').count(), 0, 'Picture learning stays available while an old trial is pending');
  await page.goto('http://localhost:3002/learn/L15/vocabulary');
  await page.getByRole('link', { name: 'ทำโจทย์ที่ค้างไว้ต่อ', exact: true }).click();
  const input = page.getByRole('textbox', { name: 'คำตอบภาษาเยอรมัน' });
  await input.waitFor();
  assert.equal(await input.inputValue(), 'Ha');
  await page.reload();
  await input.waitFor();
  assert.equal(await input.inputValue(), 'Ha');
  await input.fill(task.acceptedAnswers[0]);
  await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).click();
  await page.locator('.release-feedback').waitFor();
  await page.getByRole('button', { name: 'เรียนประเด็นต่อไป', exact: true }).click();
  await page.locator('.vocabulary-image-entry-card').first().waitFor();
  assert.equal(await page.getByRole('button', { name: 'ลองใช้สิ่งที่เพิ่งเรียน', exact: true }).count(), 0);
  let saved;
  for (let count = 0; count < 100; count++) {
    saved = (await api.snapshot()).rows.learner_lesson_states.find(row => row.lesson_key === key)?.state;
    if (saved?.active === null && saved.attempts.length === 1) break;
    await page.waitForTimeout(100);
  }
  assert.equal(saved.active, null);
  assert.equal(saved.attempts.length, 1);
  assert.equal(saved.attempts[0].response, task.acceptedAnswers[0]);
  assert.equal(saved.attempts[0].helpUsed, true);
  assert.equal(saved.attempts[0].correct, true);
  await page.reload();
  await page.locator('.vocabulary-image-entry-card').first().waitFor();
  for (const lesson of ['L15', 'L16', 'L17', 'L18']) {
    await page.goto(`http://localhost:3002/learn/${lesson}/vocabulary`);
    await page.locator('.vocabulary-image-entry-card').first().waitFor();
    assert.equal(await page.getByRole('link', { name: 'ฝึกคำที่เรียนแล้ว', exact: true }).count(), 0);
    await page.locator('.vocabulary-image-entry-card').first().click();
    await page.getByRole('link', { name: 'ฝึกคำที่เรียนแล้ว', exact: true }).click();
    await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'เริ่มรอบแนะนำ', exact: true }).count(), 0);
  }
  console.log('All four Learn → Practice buttons open an eligible first task directly');
  console.log('Historical vocabulary trial resumes its draft/help, saves its first response and returns to grouped Learn');
} finally {
  closing = true;
  await browser.close();
  await api.close();
}
