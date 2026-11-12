import assert from 'node:assert/strict';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const files = readdirSync('src/data').filter(file => file.endsWith('-preview.json')).sort();
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const results = [];
const failures = [];
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  let html = '';
  let currentFile = '';
  page.on('pageerror', error => failures.push({ file: currentFile, error: error.message }));
  await page.route('https://thai-audit.test/**', route => route.fulfill({ contentType: 'text/html', body: html }));
  for (const file of files) {
    currentFile = file;
    html = JSON.parse(readFileSync('src/data/' + file, 'utf8')).html;
    await page.goto('https://thai-audit.test/' + file);
    let result;
    for (const width of [375, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    result = await page.evaluate(() => {
      const issues = [];
      const kinds = new Set();
      const check = (root, id, phase) => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        let text;
        while ((text = walker.nextNode())) {
          if (/^[\u0e31\u0e34-\u0e3a\u0e47-\u0e4e]/u.test(text.textContent)) issues.push({ id, phase, text: text.textContent, error: 'Detached Thai mark' });
        }
        for (const help of root.querySelectorAll('.word-meaning')) {
          if (/[\u0e00-\u0e7f]/u.test(help.textContent)) issues.push({ id, phase, text: help.textContent, error: 'Thai text received German help' });
        }
      };
      for (const q of BANK.questions) {
        kinds.add(q.kind + (q.interaction ? '/' + q.interaction : ''));
        try {
          const group = q.interaction === 'match' ? BANK.questions.filter(other => other.matchGroupId === q.matchGroupId) : [q];
          const session = { id: 'thai-audit', origin: 'practice', workflow: 'topic', createdAt: new Date().toISOString(), position: group.findIndex(other => other.id === q.id), completed: false,
            items: group.map(question => ({ question: structuredClone(question), response: '', selected: [], rubricChecks: [], tokenOrder: question.tokens?.map((_, index) => index) || [], hintUsed: false, translationUsed: false, wordHelpTokens: [], attempt: null })) };
          state = { ...state, sessions: [session], activeId: session.id };
          screen = 'session';
          render();
          check(app, q.id, 'unanswered');
          for (const item of session.items) {
            item.response = item.question.acceptedAnswers?.[0] || 'ตัวอย่างคำตอบ';
            item.selected = item.question.tokens?.map((_, index) => index) || [];
            item.rubricChecks = item.question.rubric?.map((_, index) => index) || [];
            item.attempt = { ...grade(item), response: answerText(item), confidence: null, status: 'completed', submittedAt: new Date().toISOString() };
          }
          render();
          check(app, q.id, 'feedback');
          const probe = document.createElement('p');
          appendGerman(probe, 'der Kuli — ปากกาลูกลื่น น้ำ เก้าอี้ ผู้หญิง');
          check(probe, q.id, 'mixed-language');
          if (probe.textContent !== 'der Kuli — ปากกาลูกลื่น น้ำ เก้าอี้ ผู้หญิง') issues.push({ id: q.id, error: 'Changed text' });
        } catch (error) { issues.push({ id: q.id, error: error.message }); }
      }
      return { questions: BANK.questions.length, kinds: [...kinds], issues };
    });
    failures.push(...result.issues.map(issue => ({ file, width, ...issue })));
    }
    if (file === 'a11-vocab-l05-basic-preview.json') {
      await page.setViewportSize({ width: 375, height: 900 });
      await page.evaluate(() => {
        const q = BANK.questions.find(q => q.subskill === 'vocabulary_meaning' && q.sentence.includes('Kuli'));
        if (!q) throw new Error('Missing original Kuli question');
        start([q], 1);
        activeItem().response = q.acceptedAnswers[0];
        submit();
      });
      mkdirSync('artifacts/thai-word-help', { recursive: true });
      await page.screenshot({ path: 'artifacts/thai-word-help/l05-feedback-mobile.png', fullPage: true });
    }
    for (const width of [375, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const check = await page.evaluate(() => {
        const probe = document.createElement('p');
        probe.style.cssText = 'font:24px/1.7 system-ui,sans-serif';
        appendGerman(probe, 'der Kuli — ปากกาลูกลื่น น้ำ เก้าอี้');
        app.replaceChildren(probe);
        return { text: probe.textContent, thaiHelp: [...probe.querySelectorAll('.word-meaning')].filter(span => /[\u0e00-\u0e7f]/u.test(span.textContent)).length };
      });
      assert.equal(check.text, 'der Kuli — ปากกาลูกลื่น น้ำ เก้าอี้', file);
      assert.equal(check.thaiHelp, 0, file);
    }
    results.push({ file, ...result });

    if (results.length % 20 === 0) console.log('Checked ' + results.length + '/' + files.length + ' banks');
  }
  mkdirSync('artifacts/thai-word-help', { recursive: true });
  await page.setViewportSize({ width: 375, height: 700 });
  await page.screenshot({ path: 'artifacts/thai-word-help/mobile.png' });
  const report = { banks: results.length, questions: results.reduce((sum, result) => sum + result.questions, 0), viewports: [375, 1280], failures, results };
  writeFileSync('artifacts/thai-word-help/report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ banks: report.banks, questions: report.questions, failures: failures.length }));
  assert.deepEqual(failures, []);
} finally { await browser.close(); }
