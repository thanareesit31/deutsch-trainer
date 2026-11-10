import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
page.setDefaultTimeout(45000);
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  // Authenticate the first local tester; display an ordinary email to exercise release gates.
  await page.route('**/__test-db/auth/v1/**', async route => {
    const response = await route.fetch();
    if (!response.headers()['content-type']?.includes('json')) return route.fulfill({ response });
    const data = await response.json();
    if (data.user) data.user.email = 'learner-preview@deutsch.test';
    if (data.email) data.email = 'learner-preview@deutsch.test';
    return route.fulfill({ response, json: data });
  });
  await page.goto('http://localhost:3002/learn/L01/phrases');
  await page.getByLabel('อีเมล', { exact: true }).fill('tester@deutsch.test');
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.profile').filter({ hasText: 'learner-preview@deutsch.test' }).waitFor({ state: 'attached' });
  for (const [route, selector] of [
    ['L01/phrases', '.phrase-discovery'],
    ['L02/phrases', '.phrase-dialogue-learning.l02-phrase-discovery'],
    ['L03/phrases', '.phrase-dialogue-learning'],
    ['L11/phrases', '.phrase-dialogue-learning'],
    ['L13/phrases/rating', '.phrase-dialogue-learning'],
    ['L14/phrases', '.l14-phrase-learning--annotated,.phrase-model-card'],
  ]) {
    await page.goto(`http://localhost:3002/learn/${route}`);
    await page.locator(selector).first().waitFor();
    if (route.startsWith('L14') && !await page.locator('.phrase-model-card').count()) {
      await page.getByRole('button', { name: 'หลักการและตัวอย่าง', exact: true }).click();
      await page.locator('.phrase-model-card').first().waitFor();
    }
    const rows = await page.locator('.phrase-annotated-sentence').count();
    if (rows) {
      await page.waitForFunction(() => [...document.querySelectorAll('.phrase-annotated-sentence')].every(row => row.scrollWidth <= row.clientWidth + 1));
    }
    assert.equal(await page.getByText('กำลังเตรียมแบบฝึกหัด', { exact: true }).count(), 0, route);
    console.log(JSON.stringify({ route, ordinaryPresentation: true, annotationRows: rows }));
  }
  assert.deepEqual(errors, []);
  console.log('Ordinary-account corrected L01/L02/L03/L11/L13/L14 Learn smoke passed');
} finally { await browser.close(); }
