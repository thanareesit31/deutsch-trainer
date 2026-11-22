import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.setDefaultTimeout(60000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://localhost:3002/learn/L16/vocabulary');
  await page.getByLabel('อีเมล', { exact: true }).fill('tester@deutsch.test');
  await page.getByLabel('รหัสผ่าน', { exact: true }).fill('TestOnly123!');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.locator('.vocabulary-image-entry-card').first().waitFor();
  for (const [lesson, group] of [['L16', 'hilfe-und-reparatur'], ['L17', 'berufliche-plane'], ['L18', 'rumpf'], ['L18', 'schmerzen']]) {
    await page.goto(`http://localhost:3002/learn/${lesson}/vocabulary/images/${group}`);
    await page.locator('.l13-city-image img').first().waitFor();
    const sources = await page.locator('.l13-city-image img').evaluateAll(images => images.map(image => image.getAttribute('src')));
    assert.ok(sources.length > 0 && sources.every(source => source.includes('-photo-v') && !source.includes('.svg')));
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.evaluate(async () => {
        for (const image of document.querySelectorAll('.l13-city-image img')) {
          image.loading = 'eager';
          await image.decode();
        }
      });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false);
      assert.ok(await page.locator('.l13-city-image img').evaluateAll(images => images.every(image => getComputedStyle(image).objectFit === 'contain')));
      await page.screenshot({ path: `artifacts/vocabulary-image-correction/${lesson}-${group}-${width}.png`, fullPage: true });
    }
    console.log(`${lesson}/${group}: reviewed photographs render at 390 and 1440px without cropping or horizontal overflow`);
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); }
