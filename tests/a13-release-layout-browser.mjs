import { build } from 'esbuild';
import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const entry = `import React from 'react'; import {createRoot} from 'react-dom/client'; import {AnnotatedReply} from './src/components/phrase-sentence'; import {a13ReleaseCourses} from './src/data/a13-release';
const rows=[...new Map(a13ReleaseCourses.flatMap(c=>[...c.cards.flatMap(card=>card.models),...c.tasks.flatMap(q=>q.feedback.models)]).map(m=>[m.text,m])).values()]; const root=createRoot(document.getElementById('root')); window.rowCount=rows.length;
window.showRows=(from,to)=>root.render(<main className="main-content"><section className="release-course phrase-teaching-models"><article className="release-card">{rows.slice(from,to).map((m,i)=><div className="release-model" data-index={from+i} key={from+i}><span className="release-speaker">B</span><div><AnnotatedReply sentences={m.sentences}/><p>{m.meaning}</p></div></div>)}</article></section></main>);`;
const bundle = await build({ stdin: { contents: entry, resolveDir: process.cwd(), loader: 'tsx' }, bundle: true, write: false, platform: 'browser', format: 'iife', define: { 'process.env.NODE_ENV': '"production"' }, jsx: 'automatic', logLevel: 'silent' });
const css = readFileSync('.tools/test-workspace-next/dev/static/css/app/layout.css', 'utf8');
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const report = [];
try {
  const page = await browser.newPage();
  await page.setContent('<div id="root"></div>');
  await page.addStyleTag({ content: css });
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  const count = await page.evaluate(() => window.rowCount);
  for (const width of [375, 390, 1360]) {
    await page.setViewportSize({ width, height: 900 });
    let checked = 0, minimumFont = 100;
    for (let from = 0; from < count; from += 30) {
      await page.evaluate(([a, b]) => window.showRows(a, b), [from, from + 30]);
      await page.locator(`[data-index="${from}"]`).waitFor();
      await page.waitForTimeout(120);
      const result = await page.locator('.phrase-annotated-sentence').evaluateAll(rows => rows.map(row => {
        const bounds = row.getBoundingClientRect(), words = [...row.querySelectorAll('dt')].map(word => ({ text: word.textContent, bounds: word.getBoundingClientRect().toJSON() }));
        return { text: words.map(w => w.text).join(' '), font: parseFloat(getComputedStyle(row).fontSize), out: words.filter(w => w.bounds.left < bounds.left - 1 || w.bounds.right > bounds.right + 1).map(w => w.text), lines: Math.max(...words.map(w => w.bounds.top)) - Math.min(...words.map(w => w.bounds.top)) };
      }));
      for (const row of result) { assert.deepEqual(row.out, [], `${width}: ${row.text}`); assert.ok(row.lines <= 1, `${width}: wrapped ${row.text}`); minimumFont = Math.min(minimumFont, row.font); checked++; }
    }
    report.push({ width, models: count, sentenceRows: checked, minimumFont });
  }
  writeFileSync('.audit/a13-release-layout.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
