import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright-core';

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
let checked = 0;
try {
  for (const slug of [...Array.from({ length: 12 }, (_, i) => `a11-vocab-l${String(i + 1).padStart(2, '0')}-basic`), 'l13-vocab-basic']) {
    const { html } = JSON.parse(readFileSync(`src/data/${slug}-preview.json`, 'utf8'));
    const page = await browser.newPage({ viewport: { width: slug==='a11-vocab-l02-basic'?1280:390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('https://meaning.test/**', route => {
      const path = new URL(route.request().url()).pathname;
      return route.fulfill(path.startsWith('/images/') ? { body: readFileSync(`public${path}`), contentType: path.endsWith('.svg') ? 'image/svg+xml' : 'image/webp' } : { body: html, contentType: 'text/html' });
    });
    await page.goto('https://meaning.test/practice');
    const questions = await page.evaluate(() => BANK.questions.filter(q => q.interaction === 'picture-choice'));
    for (const q of questions) {
      await page.evaluate(id => start(BANK.questions.filter(q => q.id === id), 1), q.id);
      await page.waitForFunction(() => { const img = document.querySelector('.picture-choice-layout img'); return img?.complete && img.naturalWidth > 0; });
      assert.equal(await page.locator('.choices button').count(), 4);
      if(q.imageCue.portrait){const portrait=await page.locator('.profession-single-portrait').boundingBox();assert(portrait.height<=291,'portrait stays compact');}
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, q.id);
      await page.locator('.choices button').filter({ hasText: q.acceptedAnswers[0] }).filter({ hasText: new RegExp(`^${q.acceptedAnswers[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) }).click();
      await page.locator('#check').click();
      const attempt = await page.evaluate(() => activeItem().attempt);
      assert.equal(attempt.correct, true, q.id);
      assert.equal(attempt.recognitionMode, 'image-to-german');
      assert.equal(attempt.confidence, null);
      const answer=await page.locator('.feedback p').first().innerText();
      assert(answer.includes(q.acceptedAnswers[0]),q.id);
      assert(answer.includes(q.translation),q.id);
      assert.equal(await page.locator('.feedback .thai-translation').count(),0);
      assert.equal(await page.getByText(/^รูปคำที่เรียนคือ/).count(),0);
      const visual=await page.locator('.picture-choice-layout img').boundingBox();
      if(!q.imageCue.portrait)assert(visual.width<=200&&visual.height<=291,q.id);
      checked++;
    }
    if (questions.length) {
      await page.reload();
      assert.equal(await page.evaluate(() => activeItem().attempt.correct), true);
    }
    assert.deepEqual(errors, []);
    await page.close();
  }
  console.log(`PASS ${checked} picture questions: images, four choices, mobile layout, grading, distinct evidence and resume`);
} finally { await browser.close(); }
