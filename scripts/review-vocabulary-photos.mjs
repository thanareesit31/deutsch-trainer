import { chromium } from 'playwright-core';
import { readFile, access, mkdir } from 'node:fs/promises';

const prefix = process.argv[2] ?? '';
const jobs = JSON.parse(await readFile('artifacts/vocabulary-image-correction/jobs.json', 'utf8'));
const available = [];
for (const job of jobs.filter(job => job.id.startsWith(prefix))) {
  try { await access(job.destination); available.push(job); } catch { /* Generation can still be running. */ }
}
await mkdir('artifacts/vocabulary-image-correction/contact-sheets', { recursive: true });
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1500, height: 1200 } });
  for (let index = 0; index < available.length; index += 9) {
    const batch = available.slice(index, index + 9);
    await page.setContent(`<html><head><style>body{font:18px sans-serif;background:white;padding:10px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}article{border:1px solid #ccc;padding:6px}img{width:100%;aspect-ratio:3/2;object-fit:contain}p{margin:3px}</style></head><body><div class="grid">${batch.map(job => `<article><p>${job.id} · ${job.target}</p><p>${job.meaning}</p><img src="http://localhost:3002/${job.destination.replace(/^public\//, '')}"></article>`).join('')}</div></body></html>`);
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    const path = `artifacts/vocabulary-image-correction/contact-sheets/${prefix || 'all'}-${Math.floor(index / 9) + 1}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(path);
  }
} finally { await browser.close(); }
