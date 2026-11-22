import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright-core';
import { startTestApi } from '../scripts/test-workspace-api.mjs';
import { a13ReleaseCourses } from '../src/data/a13-release.ts';
import { releaseVocabularyItems } from '../src/lib/release-vocabulary-learning.ts';
import { lessonVocabularyImageGroups, vocabularyImagePages } from '../src/lib/vocabulary-image-content.ts';

const restore = process.env.VOCABULARY_VERIFY_RESUME ? JSON.parse(await readFile(process.env.VOCABULARY_VERIFY_RESUME, 'utf8')).snapshot : undefined;
const api = await startTestApi({ port: 0, restore });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const failures = [];
let activePage;
let closing = false;
const root = 'http://localhost:3002';
await mkdir('artifacts/vocabulary-l15-l18', { recursive: true });
async function account(email) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await context.route('**/__test-db/**', async route => {
    try {
    const response = await route.fetch({ url: route.request().url().replace(`${root}/__test-db`, api.url), maxRetries: 3 });
    if (route.request().url().includes('/auth/v1/') && response.headers()['content-type']?.includes('json')) {
      const json = await response.json();
      if (json.user) json.user.email = 'ordinary-learner@deutsch.test';
      if (json.email) json.email = 'ordinary-learner@deutsch.test';
      return route.fulfill({ response, json });
    }
    if (response.status() >= 400) failures.push(`${route.request().url()}: ${await response.text()}`);
    return route.fulfill({ response });
    } catch (error) {
      if (!closing && !String(error).includes('Target page, context or browser has been closed')) failures.push(`Test adapter request failed: ${route.request().method()} ${new URL(route.request().url()).pathname}: ${error.message.split('\n')[0]}`);
      await route.abort().catch(() => {});
    }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);
  page.on('pageerror', error => failures.push(error.message));
  await page.goto(`${root}/learn/L15/vocabulary`);
  await page.getByLabel('อีเมล', { exact: true }).fill(email);
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.vocabulary-learning').waitFor();
  return { context, page };
}
async function persisted(predicate) {
  for (let count = 0; count < 100; count++) {
    const snapshot = await api.snapshot();
    if (predicate(snapshot)) return snapshot;
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw Error('Account state did not persist');
}
try {
  const { page } = await account('tester2@deutsch.test');
  activePage = page;
  const userId = api.accounts.find(account => account.email === 'tester2@deutsch.test').id;
  for (const course of a13ReleaseCourses.filter(course => course.skill === 'vocabulary')) {
    const items = releaseVocabularyItems(course);
    const groups = lessonVocabularyImageGroups(items, course.lessonId);
    const key = `deutsch-trainer-release-course-v1-${course.lessonId}-vocabulary`;
    await page.goto(`${root}/learn/${course.lessonId}/vocabulary`);
    await page.locator('.vocabulary-image-entry-card').first().waitFor();
    assert.equal(await page.locator('.vocabulary-image-entry-card').count(), groups.length);
    assert.equal(await page.getByRole('button', { name: 'ลองใช้สิ่งที่เพิ่งเรียน', exact: true }).count(), 0);
    for (const [groupIndex, group] of groups.entries()) {
      for (const [pageIndex, ids] of vocabularyImagePages(group.wordOrder).entries()) {
        await page.goto(`${root}${group.route}?page=${pageIndex + 1}`);
        await page.locator('.vocabulary-image-matching[aria-busy]').waitFor({ state: 'detached' });
        await page.locator('.l13-city-card').first().waitFor();
        assert.equal(await page.locator('.vocabulary-image-locked').count(), 0);
        await page.waitForFunction(() => [...document.querySelectorAll('.l13-city-image img')].every(image => image.complete && image.naturalWidth > 0));
        if (groupIndex === 0 && pageIndex === 0) {
          for (const width of [390,1280]) {
            await page.setViewportSize({ width, height: 844 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
            await page.screenshot({ path: `artifacts/vocabulary-l15-l18/${course.lessonId}-${width}.png`, fullPage: true });
          }
          await page.setViewportSize({ width: 390, height: 844 });
        }
        for (const id of ids) {
          if (await page.locator(`[data-vocabulary-id="${id}"]`).getAttribute('data-matched') === 'true') continue;
          const item = items.find(item => item.id === id);
          await page.locator('.profession-options').getByRole('button', { name: item.answer, exact: true }).click();
          await page.locator(`[data-vocabulary-id="${id}"] .l13-city-image`).click();
          await page.locator(`[data-vocabulary-id="${id}"][data-matched="true"]`).waitFor();
        }
        await persisted(snapshot => snapshot.rows.learner_lesson_states.some(row => row.user_id === userId && row.lesson_key === key && ids.every(id => row.state.learned.includes(id))));
        await page.reload();
        await page.locator(`[data-vocabulary-id="${ids[0]}"][data-matched="true"]`).waitFor();
        console.log(`${course.lessonId} ${group.id} page ${pageIndex + 1} saved and restored`);
      }
    }
    await page.goto(`${root}/practice/${course.lessonId}/vocabulary/basic`);
    const existingRound = (await api.snapshot()).rows.learner_practice_sessions.some(row => row.user_id === userId && row.bank_key === `a13-release-${course.lessonId.toLowerCase()}-vocabulary` && !row.state.completed);
    if (!existingRound) await page.getByRole('button', { name: 'เริ่มรอบแนะนำ', exact: true }).click();
    await page.getByRole('button', { name: 'ตรวจคำตอบ', exact: true }).waitFor();
    await persisted(snapshot => snapshot.rows.learner_practice_sessions.some(row => row.user_id === userId && row.bank_key === `a13-release-${course.lessonId.toLowerCase()}-vocabulary`));
    console.log(`${course.lessonId}: ${items.length} matches, persisted reload and canonical Practice eligibility passed`);
  }
  const second = await account('tester@deutsch.test');
  await second.page.goto(`${root}/learn/L15/vocabulary/images/wohnen-und-zimmer`);
  await second.page.locator('[data-vocabulary-id="L15-V001"][data-matched="false"]').waitFor();
  await second.page.goto(`${root}/practice/L15/vocabulary/basic`);
  await second.page.getByRole('link', { name: 'เริ่มเรียนก่อนฝึก', exact: true }).waitFor();
  const snapshot = await api.snapshot();
  for (const row of snapshot.rows.learner_lesson_states.filter(row => row.user_id === userId && row.lesson_key.endsWith('-vocabulary'))) {
    assert.deepEqual(row.state.attempts, [], 'Learn matching does not invent scored Practice answers');
  }
  assert.deepEqual(failures, []);
  console.log('97 targets, ordinary-account UI, SQL validators, reload, eligible Practice and separate account passed');
} catch (error) {
  if (activePage) {
    await activePage.screenshot({ path: 'artifacts/vocabulary-l15-l18/failure.png', fullPage: true });
    await writeFile('artifacts/vocabulary-l15-l18/failure.txt', await activePage.locator('body').innerText());
  }
  await writeFile('artifacts/vocabulary-l15-l18/failure-state.json', JSON.stringify({ failures, snapshot: await api.snapshot() }, null, 2));
  throw error;
} finally {
  closing = true;
  await browser.close();
  await api.close();
}
