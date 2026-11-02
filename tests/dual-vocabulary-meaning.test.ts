import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { l14VocabularyQuestionBank, selectL14VocabularyQuestions } from '../src/components/l14-vocabulary-practice';
import type { Item } from '../src/lib/content';

const catalog: { items: Item[] } = JSON.parse(readFileSync('supabase/seed/catalog.json', 'utf8'));
const questions = l14VocabularyQuestionBank(catalog.items);

test('L14 measures word meaning separately and selects the failed meaning subskill', () => {
  const word = questions.find(q => q.kind === 'wordMeaning');
  assert.ok(word);
  const image = questions.find(q => q.itemId === word.itemId && q.kind === 'meaning');
  assert.ok(image);
  assert.equal(word.answer, word.meaning);
  assert.equal(image.answer, image.german);
  assert.notEqual(word.subskill, image.subskill);
  for (const q of questions.filter(q => q.kind === 'wordMeaning')) {
    assert.equal(q.options.length, 3);
    assert.equal(new Set(q.options).size, 3);
    assert.ok(q.options.includes(q.meaning));
    assert.deepEqual(q.requiredItemIds, [q.itemId]);
  }
  const run = { id: 'failed-word-meaning', bank: 'daily', questionIds: [word.id], position: 1, attempts: [{ questionId: word.id, answer: 'wrong', correct: false, submittedAt: new Date().toISOString() }], drafts: {}, completed: true, updatedAt: new Date().toISOString() };
  const sessions = { version: 1, banks: {}, history: [run] } satisfies Parameters<typeof selectL14VocabularyQuestions>[1];
  assert.deepEqual(selectL14VocabularyQuestions('daily', sessions, new Set([word.itemId]), questions), [word.id]);
  assert.deepEqual(selectL14VocabularyQuestions('daily', sessions, new Set(), questions), []);
});

test('L14 context word help returns to supported practice instead of counting as independent success', () => {
  const q=questions.find(q=>q.kind==='context'&&q.difficulty===3);
  assert.ok(q);
  const sessions={version:1,banks:{},history:[{id:'word-help',bank:'daily',questionIds:[q.id],position:1,completed:true,drafts:{},updatedAt:'2026-11-02T00:00:00.000Z',attempts:[{questionId:q.id,answer:q.answer,correct:true,submittedAt:'2026-11-02T00:00:00.000Z',evidence:{taskVersion:1,targetId:q.itemId,subskill:q.subskill,difficulty:q.difficulty,assistanceAvailable:q.assistance,assistanceUsed:['word-meanings'],selectionReason:'review',policyVersion:'l14-vocab-3'}}]}]} satisfies Parameters<typeof selectL14VocabularyQuestions>[1];
  const next=selectL14VocabularyQuestions('challenge',sessions,new Set(questions.map(q=>q.itemId)),questions);
  assert(next.includes(`${q.itemId}-context-supported`));
  assert(!next.includes(q.id));
});
