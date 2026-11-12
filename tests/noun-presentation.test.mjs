import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { findNoun } from '../src/lib/noun-presentation.ts';
const { items } = JSON.parse(readFileSync('supabase/seed/catalog.json', 'utf8'));

test('the color orange keeps its meaning instead of becoming the fruit Orange', () => {
  assert.equal(findNoun('orange', items), null);
  assert.deepEqual(findNoun('Orange', items), { article: 'die', color: 'die', label: 'die Orange' });
  assert.deepEqual(findNoun('die Orange', items), { article: 'die', color: 'die', label: 'die Orange' });
});

test('noun Artikel and plural presentation stay intact', () => {
  assert.deepEqual(findNoun('der Kuli', items), { article: 'der', color: 'der', label: 'der Kuli' });
  assert.deepEqual(findNoun('Kuli', items), { article: 'der', color: 'der', label: 'der Kuli' });
  assert.deepEqual(findNoun('die Kinder', items), { article: 'die', color: 'plural', label: 'die Kinder' });
  assert.equal(findNoun('weiß', items), null);
});
