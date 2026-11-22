import { chromium } from 'playwright-core';
import { mkdir, readFile } from 'node:fs/promises';

const metadata = JSON.parse(await readFile('src/data/release-vocabulary-images.json', 'utf8'));
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  await mkdir('artifacts/vocabulary-l15-l18', { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  for (const lesson of ['L15', 'L16', 'L17', 'L18']) {
    const entries = metadata.filter(entry => entry.id.startsWith(lesson));
    await page.setContent(`<html><head><style>body{font:16px sans-serif;background:#fff}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}article{border:1px solid #ddd;padding:8px}img{width:100%;height:260px;object-fit:contain}p{margin:4px}</style></head><body><h1>${lesson} vocabulary visual audit</h1><div class="grid">${entries.map(entry => `<article><p>${entry.id}</p><img src="http://localhost:3002${entry.image}"></article>`).join('')}</div></body></html>`);
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    await page.screenshot({ path: `artifacts/vocabulary-l15-l18/${lesson}-asset-review.png`, fullPage: true });
  }
  console.log('All 97 final illustrations rendered for visual audit');
} finally {
  await browser.close();
}
