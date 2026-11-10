import assert from 'node:assert/strict';
import test from 'node:test';
import { a13ReleaseCourses } from '../src/data/a13-release';
import { emptyReleaseState, gradeReleaseTask, mergeReleaseStates, parseReleaseState, selectReleaseTask, type ReleaseAttempt, type ReleaseState, type ReleaseActive } from '../src/lib/a13-release';
import { mergeReleasePracticeAssistance } from '../src/lib/release-assistance-merge';

const course = a13ReleaseCourses.find(c => c.lessonId === 'L15' && c.skill === 'vocabulary');
if (!course) throw Error('Missing L15 vocabulary');
const task = course.tasks.find(q => q.spelling);
if (!task) throw Error('Missing spelling target');

test('12 complete courses preserve stable task IDs, media and taught prerequisites', () => {
  assert.equal(a13ReleaseCourses.length, 12);
  assert.equal(a13ReleaseCourses.reduce((sum, c) => sum + c.tasks.length, 0), 372);
  for (const c of a13ReleaseCourses) {
    assert.equal(new Set(c.tasks.map(q => q.id)).size, c.tasks.length);
    const cards = new Set(c.cards.map(card => card.id));
    for (const q of c.tasks) {
      assert.ok(q.requiredCardIds.length > 0 && q.requiredCardIds.every(id => cards.has(id)));
      assert.ok(q.acceptedAnswers.every(answer => gradeReleaseTask(q, answer)));
      if (q.kind === 'choice') assert.ok(q.acceptedAnswers.some(answer => q.options.includes(answer)));
    }
  }
});

test('unknown targets stay ineligible and independent subskills remain separate', () => {
  assert.equal(selectReleaseTask(course, emptyReleaseState()), null);
  const state = { ...emptyReleaseState(), learned: [course.cards[0].id] };
  const first = selectReleaseTask(course, state);
  assert.ok(first);
  assert.deepEqual(first.task.requiredCardIds, [course.cards[0].id]);
  const observation: ReleaseAttempt = { id: 'first', taskId: first.task.id, response: first.task.acceptedAnswers[0], correct: true, helpUsed: false, submittedAt: '2026-11-09T10:00:00Z', selectionReason: first.reason };
  const second = selectReleaseTask(course, { ...state, attempts: [observation] });
  assert.ok(second);
  assert.notEqual(second.task.subskill, first.task.subskill);
  assert.equal(second.reason, 'ยังไม่มีหลักฐานของโจทย์นี้');
});

test('noun spelling preserves capitalization and umlauts', () => {
  assert.equal(gradeReleaseTask(task, 'Haus'), true);
  assert.equal(gradeReleaseTask(task, 'haus'), false);
  const umlaut = a13ReleaseCourses.flatMap(c => c.tasks).find(q => q.spelling && /[äöü]/u.test(q.acceptedAnswers[0]));
  assert.ok(umlaut);
  assert.equal(gradeReleaseTask(umlaut, `\t${umlaut.acceptedAnswers[0].normalize('NFD')}\u00a0`), true);
  assert.equal(gradeReleaseTask(umlaut, umlaut.acceptedAnswers[0].replace(/[äöü]/gu, 'a')), false);
});

test('account round, answer draft and immutable first answer survive serialization and merge', () => {
  const first: ReleaseAttempt = { id: 'first', taskId: task.id, response: 'haus', correct: false, helpUsed: false, submittedAt: '2026-11-09T10:00:00Z', selectionReason: 'ยังไม่มีหลักฐาน' };
  const state: ReleaseState = { ...emptyReleaseState(), learned: [...task.requiredCardIds], active: { taskId: task.id, draft: 'Ha', helpUsed: false, startedAt: '2026-11-09T10:01:00Z', selectionReason: 'ฝึกสะกด', origin: 'practice', learningCardId: null }, attempts: [first], round: { id: 'round', startedAt: '2026-11-09T10:01:00Z', limit: 10 } };
  const resumed = parseReleaseState(JSON.stringify(state), course);
  assert.deepEqual(resumed, state);
  const retry = { ...first, id: 'retry', response: 'Haus', correct: true, submittedAt: '2026-11-09T10:02:00Z' };
  const merged = mergeReleaseStates(state, { ...state, attempts: [retry] });
  assert.deepEqual(merged.attempts, [first, retry]);
  assert.throws(() => mergeReleaseStates(state, { ...state, attempts: [{ ...first, correct: true }] }), /เปลี่ยนแปลงไม่ได้/);
});

test('another device opening help is retained through a stale Learn check and later save', () => {
  const active: ReleaseActive = { taskId: task.id, draft: '', helpUsed: true, startedAt: '2026-11-09T10:00:00Z', selectionReason: 'ฝึกต่อ', origin: 'learn', learningCardId: task.requiredCardIds[0] };
  const remote = { ...emptyReleaseState(), learned: task.requiredCardIds, active };
  const draft = mergeReleaseStates(remote, { ...remote, active: { ...active, helpUsed: false, draft: 'Haus' } });
  assert.equal(draft.active?.helpUsed, true);
  const answer: ReleaseAttempt = { id: 'stale', taskId: task.id, response: 'Haus', correct: true, helpUsed: false, submittedAt: '2026-11-09T10:01:00Z', selectionReason: 'ฝึกต่อ' };
  const merged = mergeReleaseStates(remote, { ...remote, active: null, attempts: [answer] });
  assert.equal(merged.attempts[0].helpUsed, true);
  assert.doesNotThrow(() => mergeReleaseStates(merged, { ...merged, attempts: [answer], cursor: 1 }));
});

test('Practice keeps the stale first response while merging known help and preserves an existing first', () => {
  const local = { hintUsed: false, response: 'Haus', attempt: { response: 'Haus', correct: true, assisted: false } };
  const remote = { hintUsed: true, response: '', attempt: null };
  const merged = mergeReleasePracticeAssistance(local, local, remote);
  assert.deepEqual(merged, { hintUsed: true, response: 'Haus', attempt: { response: 'Haus', correct: true, assisted: true } });
  const first = { hintUsed: true, response: 'haus', attempt: { response: 'haus', correct: false, assisted: true } };
  assert.equal(mergeReleasePracticeAssistance(local, local, first), first);
});
