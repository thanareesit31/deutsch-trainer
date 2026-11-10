import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const context = await browser.newContext();
const page = await context.newPage();
page.setDefaultTimeout(45000);
try {
  // Keep local test authentication while exercising the ordinary-account UI.
  await page.route('**/__test-db/auth/v1/**', async route => {
    const response = await route.fetch();
    if (!response.headers()['content-type']?.includes('json')) return route.fulfill({ response });
    const data = await response.json();
    if (data.user) data.user.email = 'learner-preview@deutsch.test';
    if (data.email) data.email = 'learner-preview@deutsch.test';
    return route.fulfill({ response, json: data });
  });
  await page.goto('http://localhost:3002/practice');
  await page.getByLabel('อีเมล', { exact: true }).fill('tester2@deutsch.test');
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.profile').filter({ hasText: 'learner-preview@deutsch.test' }).waitFor();
  for (const id of ['L15', 'L16', 'L17', 'L18']) {
    const catalog = page.locator(`a.lesson-card[href="/practice/${id}"]`);
    await catalog.waitFor();
    assert.match(await catalog.innerText(), /3 หัวข้อพร้อมฝึก/);
  }
  for (const id of ['L15', 'L16', 'L17', 'L18']) {
    await page.goto(`http://localhost:3002/practice/${id}`);
    for (const skill of ['vocabulary', 'grammar', 'phrases']) {
      const link = page.locator(`a.skill-card[href="/practice/${id}/${skill}"]`);
      await link.waitFor();
      assert.match(await link.innerText(), /[1-9]\d* รายการพร้อมฝึก/);
    }
    assert.equal(await page.locator('.practice-catalog-note').count(), 0);
  }
  await page.goto('http://localhost:3002/learn?level=A1.3');
  await page.getByRole('button', { name: /A1.3/ }).first().click();
  for (const id of ['L15', 'L16', 'L17', 'L18']) {
    const lesson = page.locator(`a.lesson-card[href="/lesson/${id}"]`);
    await lesson.waitFor();
    assert.match(await lesson.innerText(), /[1-9]\d* คำหลัก/);
  }
  console.log('Ordinary-account L15–18 Practice navigation and vocabulary lesson counts passed');
} finally { await browser.close(); }
