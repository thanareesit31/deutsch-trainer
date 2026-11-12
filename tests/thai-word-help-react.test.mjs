import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import assert from 'node:assert/strict';
import test from 'node:test';

const code = readFileSync('src/components/practice-german-text.tsx', 'utf8').replace('import help from "@/data/practice-word-help.json";', 'const help = injectedHelp;');
const compiled = ts.transpileModule(code, { compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const context = { exports: {}, React, injectedHelp: JSON.parse(readFileSync('src/data/practice-word-help.json', 'utf8')) };
runInNewContext(compiled, context);
const Component = context.exports.PracticeGermanText;

test('actual React component preserves Thai text and German help', () => {
  const text = 'der Kuli — ปากกาลูกลื่น น้ำ เก้าอี้ ผู้หญิง';
  const markup = renderToStaticMarkup(React.createElement(Component, { text, meanings: { Kuli: 'ปากกาลูกลื่น', ล: 'must not split Thai words' } }));
  assert.ok(markup.includes('>Kuli</span>'));
  assert.ok(markup.includes('ปากกาลูกลื่น น้ำ เก้าอี้ ผู้หญิง'));
  assert.ok(!markup.includes('>ล</span>'));
  assert.equal(renderToStaticMarkup(React.createElement(Component, { text, enabled: false })), text);
});
