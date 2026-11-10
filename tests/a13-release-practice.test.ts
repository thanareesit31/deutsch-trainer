import assert from 'node:assert/strict';
import test from 'node:test';
import { a13ReleaseCourses } from '../src/data/a13-release';
import { releasePracticeQuestion } from '../src/lib/a13-release-question';
import { parsePracticeHistory, l13PracticeStores, practiceStorageKey } from '../src/lib/practice-planner';
import { gradeReleaseTask } from '../src/lib/a13-release';
import { parseReleasePracticeSnapshot, resumeReleasePracticeSnapshot } from '../src/components/a13-release-practice';

const submittedAt = '2026-11-09T05:00:00.000Z';
test('all twelve release banks use canonical questions accepted by shared history', () => {
  const banks = l13PracticeStores.filter(s => s.storage.startsWith('a13-release-'));
  assert.equal(banks.length, 12);
  for (const course of a13ReleaseCourses) {
    const bank = banks.find(b => b.storage === `a13-release-${course.lessonId.toLowerCase()}-${course.skill}`);
    assert.ok(bank);
    assert.ok(!practiceStorageKey(bank.storage, bank.frame, 'account-a').includes('l13-a13'));
    assert.notEqual(practiceStorageKey(bank.storage, bank.frame, 'account-a'), practiceStorageKey(bank.storage, bank.frame, 'account-b'));
    const task = course.tasks[0];
    const response = task.acceptedAnswers[0];
    const snapshot = { version: 1, activeId: 'session-a', sessions: [{ id: 'session-a', createdAt: submittedAt, updatedAt: submittedAt, completed: false, position: 0, items: [{ question: releasePracticeQuestion(course, task), selectionReason: 'ยังไม่มีหลักฐานของโจทย์นี้', response, selected: [], tokenOrder: [], hintUsed: true, translationUsed: false, attempt: { response, correct: gradeReleaseTask(task, response), status: 'completed', submittedAt, assisted: true, confidence: null } }] }] };
    const raw = JSON.stringify(snapshot);
    assert.deepEqual(parseReleasePracticeSnapshot(raw, course), snapshot);
    const history = parsePracticeHistory(raw, bank.href);
    assert.equal(history[0].items[0].result?.assisted, true);
    assert.equal(history[0].items[0].question.targetIds[0], task.targetId);
    assert.equal(history[0].items[0].result?.confidence, null);
  }
});

test('wrong first answers, assistance and partial order drafts survive restore', () => {
  const course = a13ReleaseCourses.find(c => c.lessonId === 'L15' && c.skill === 'phrases');
  assert.ok(course);
  const task = course.tasks.find(t => t.kind === 'order');
  assert.ok(task);
  const original = { version: 1, activeId: 'wrong-first', sessions: [{ id: 'wrong-first', createdAt: submittedAt, updatedAt: submittedAt, completed: false, position: 0, items: [{ question: releasePracticeQuestion(course, task), selectionReason: 'ยังไม่มีหลักฐานของโจทย์นี้', response: 'Das ist falsch.', selected: [], tokenOrder: [0], hintUsed: true, translationUsed: false, attempt: { response: 'Das ist falsch.', correct: false, status: 'completed', submittedAt, assisted: true, confidence: null } }] }] };
  assert.deepEqual(parseReleasePracticeSnapshot(JSON.stringify(original), course), original);
  const draft = structuredClone(original);
  const item = draft.sessions[0].items[0];
  const rawDraft = { ...draft, sessions: [{ ...draft.sessions[0], items: [{ ...item, response: task.tokens[0], attempt: null }] }] };
  const raw = JSON.stringify(rawDraft);
  assert.deepEqual(parseReleasePracticeSnapshot(raw, course), rawDraft);
  assert.equal(parsePracticeHistory(raw, '/practice/L15/phrases/basic')[0].hasDraft, true);
});

test('JSON object order from database does not alter canonical question identity', () => {
  const course = a13ReleaseCourses[0];
  const task = course.tasks[0];
  const q = releasePracticeQuestion(course, task);
  const question = Object.fromEntries(Object.entries(q).reverse());
  const raw = JSON.stringify({ version: 1, activeId: 's', sessions: [{ id: 's', createdAt: submittedAt, updatedAt: submittedAt, completed: false, position: 0, items: [{ question, selectionReason: 'ยังไม่มีหลักฐานของโจทย์นี้', response: '', selected: [], tokenOrder: [], hintUsed: false, translationUsed: false, attempt: null }] }] });
  assert.deepEqual(parseReleasePracticeSnapshot(raw, course).sessions[0].items[0].question, q);
});


test('an explicit older pending round wins over a newer completed active round without changing drafts', () => {
  const course = a13ReleaseCourses[0];
  const task = course.tasks[0];
  const item = { question: releasePracticeQuestion(course, task), selectionReason: 'ยังไม่มีหลักฐานของโจทย์นี้', response: 'saved draft', selected: [], tokenOrder: [], hintUsed: true, translationUsed: false, attempt: null };
  const original = parseReleasePracticeSnapshot(JSON.stringify({ version: 1, activeId: 'new-completed', sessions: [
    { id: 'old-pending', createdAt: submittedAt, updatedAt: submittedAt, completed: false, position: 0, items: [item] },
    { id: 'new-completed', createdAt: '2026-11-10T05:00:00.000Z', updatedAt: submittedAt, completed: true, position: 0, items: [{ ...item, response: task.acceptedAnswers[0], attempt: { response: task.acceptedAnswers[0], correct: true, status: 'completed', submittedAt, assisted: true, confidence: null } }] },
  ] }), course);
  const before = JSON.stringify(original);
  const resumed = resumeReleasePracticeSnapshot(original, course, [course.cards[0].id], 'old-pending');
  assert.equal(resumed.activeId, 'old-pending');
  assert.deepEqual(resumed.sessions, original.sessions);
  assert.equal(resumed.sessions[0].items[0].response, 'saved draft');
  assert.equal(resumed.sessions[0].items[0].hintUsed, true);
  assert.equal(JSON.stringify(original), before);
  assert.equal(resumeReleasePracticeSnapshot(original, course, [course.cards[0].id]).activeId, 'old-pending');
  assert.equal(resumeReleasePracticeSnapshot({ ...original, activeId: null }, course, [course.cards[0].id]).activeId, 'old-pending');
  assert.equal(resumeReleasePracticeSnapshot(original, course, [], 'old-pending').activeId, null);
});

test('explicit resume chooses the requested eligible pending round rather than another active pending round', () => {
  const course = a13ReleaseCourses[0], task = course.tasks[0];
  const item = { question: releasePracticeQuestion(course, task), response: '', selected: [], tokenOrder: [], hintUsed: false, translationUsed: false, attempt: null };
  const original = parseReleasePracticeSnapshot(JSON.stringify({ version: 1, activeId: 'other', sessions: ['requested', 'other'].map(id => ({ id, createdAt: submittedAt, updatedAt: submittedAt, completed: false, position: 0, items: [item] })) }), course);
  assert.equal(resumeReleasePracticeSnapshot(original, course, [course.cards[0].id], 'requested').activeId, 'requested');
  assert.equal(resumeReleasePracticeSnapshot(original, course, [course.cards[0].id], 'unknown').activeId, 'other');
});
