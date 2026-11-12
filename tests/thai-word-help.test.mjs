import { readFileSync, readdirSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';

const template = readFileSync('scripts/exercise-mapping/preview-template.html', 'utf8');
const source = template.slice(template.indexOf('function appendGerman('), template.indexOf('function navigateTo('));

test('Thai vowels and tone marks remain attached when German word help is rendered', () => {
  const chunks = [];
  const context = {
    current: () => undefined,
    activeItem: () => undefined,
    BANK: { thaiSupport: { glossary: {} } },
    SHARED_WORD_HELP: { glossary: { Kuli: 'ปากกาลูกลื่น', ล: 'must not split Thai words' } },
    document: { createTextNode: text => ({ text }) },
    node: (_tag, text) => ({ text, help: true, addEventListener() {} }),
  };
  runInNewContext(source + ';this.render = appendGerman;', context);
  context.render({ append: chunk => chunks.push(chunk) }, 'der Kuli — ปากกาลูกลื่น น้ำ เก้าอี้');
  assert.deepEqual(chunks.filter(chunk => chunk.help).map(chunk => chunk.text), ['Kuli']);
  assert.ok(chunks.some(chunk => chunk.text === 'ปากกาลูกลื่น'));
  assert.ok(chunks.some(chunk => chunk.text === 'น้ำ'));
  assert.ok(chunks.some(chunk => chunk.text === 'เก้าอี้'));
  assert.equal(chunks.map(chunk => chunk.text).join(''), 'der Kuli — ปากกาลูกลื่น น้ำ เก้าอี้');
});

test('shipped preview tokenizers match the corrected template', () => {
  const tokenizer = template.match(/const tokens=text.match\((.+)\)\|\|\[\];/)[1];
  for (const file of readdirSync('src/data').filter(file => file.endsWith('-preview.json'))) {
    const { html } = JSON.parse(readFileSync('src/data/' + file, 'utf8'));
    assert.ok(html.includes('const tokens=text.match(' + tokenizer + ')||[];'), file);
  }
});
