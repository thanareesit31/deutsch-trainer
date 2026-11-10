import assert from 'node:assert/strict';
import test from 'node:test';
import { gradeReleaseTask, emptyReleaseState, type ReleaseCourse, type ReleaseTask, type ReleaseAttempt } from '../src/lib/a13-release';
import { isReleaseTaskUnlocked, selectReleaseRound } from '../src/lib/a13-practice-selection';
import { releaseResponseFeedback } from '../src/lib/a13-response-feedback';
import { a13ReleaseCourses } from '../src/data/a13-release';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, child]) => [key, stable(child)]));
  return value;
}

test('all 372 published tasks keep their full content, answers and bindings', () => {
  const rows = readFileSync(new URL('../.audit/practice-published-baseline.tsv', import.meta.url), 'utf8').trim().split('\n').filter(line => !line.startsWith('#'));
  assert.equal(rows.length, 372);
  const tasks = new Map(a13ReleaseCourses.flatMap(c => c.tasks).map(task => [task.id, task]));
  for (const row of rows) {
    const [id, expected] = row.split('\t');
    const task = tasks.get(id);
    assert.ok(task, id);
    const { practice, ...published } = task;
    assert.equal(practice?.stage, 0);
    const actual = createHash('sha256').update(JSON.stringify(stable(published))).digest('hex');
    assert.equal(actual, expected, id);
  }
});

function question(id: string, targetId = id): ReleaseTask {
  return { id, version: 1, targetId, subskill: 'meaning', difficulty: 1, difficultyRationale: 'Choose a supplied meaning', requiredCardIds: ['learned'], kind: 'choice', prompt: 'Choose', cue: '', context: [], options: ['ja', 'nein'], tokens: [], startWith: '', acceptedAnswers: ['ja'], assistance: ['options'], feedback: { reason: 'The supplied fact is affirmative.', models: [] }, noun: null, articleTarget: false, spelling: false, practice: { familyId: targetId, contextId: id, stage: 0, unlock: null } };
}
function course(tasks: ReleaseTask[]): ReleaseCourse {
  return { lessonId: 'L15', skill: 'phrases', title: 'Practice', purpose: 'Practice', cards: [{ id: 'learned', title: 'Learned', purpose: '', notes: [], context: [], models: [], targetIds: tasks.map(t => t.targetId), noun: null, wordAudio: null }], tasks, glossary: [] };
}
function response(taskId: string, sessionId: string, correct = true, helpUsed = false, time = '2026-11-10T10:00:00Z'): ReleaseAttempt {
  return { id: `${sessionId}:${taskId}`, taskId, sessionId, response: correct ? 'ja' : 'nein', correct, helpUsed, submittedAt: time, selectionReason: 'test history' };
}

test('a ten-target round includes weak, unseen and spaced review without duplicate targets', () => {
  const weak = [1, 2, 3].map(i => question(`weak${i}`));
  const fresh = [1, 2, 3, 4].map(i => question(`new${i}`));
  const due = [1, 2, 3].map(i => question(`due${i}`));
  const c = course([...weak, ...fresh, ...due]);
  const state = { ...emptyReleaseState(), learned: ['learned'], attempts: [...weak.map(q => response(q.id, 'recent', false)), ...due.map(q => response(q.id, 'old', true, false, '2026-11-01T10:00:00Z'))] };
  const round = selectReleaseRound(c, state, Date.parse('2026-11-10T11:00:00Z'));
  assert.deepEqual(round.map(item => item.lane), ['weak', 'new', 'due', 'new', 'weak', 'due', 'new', 'weak', 'due', 'new']);
  assert.equal(new Set(round.map(item => item.task.targetId)).size, 10);
  assert.equal(selectReleaseRound(c, { ...state, learned: [] }).length, 0);
});

test('production unlock needs distinct independent contexts and real Practice sessions', () => {
  const a = question('context-a', 'alpha'), b = question('context-b', 'alpha');
  const harder: ReleaseTask = { ...question('production', 'alpha'), kind: 'write', options: [], subskill: 'bounded_production', practice: { familyId: 'alpha', contextId: 'production-context', stage: 2, unlock: { subskill: 'meaning', minCorrectContexts: 2, minPracticeSessions: 2, requiresAttempt: true } } };
  const c = course([a, b, harder]);
  const state = { ...emptyReleaseState(), learned: ['learned'], attempts: [response(a.id, 's1'), response(b.id, 's1')] };
  assert.equal(isReleaseTaskUnlocked(c, state, harder), false);
  assert.equal(isReleaseTaskUnlocked(c, { ...state, attempts: [response(a.id, 's1'), response(b.id, 's2')] }, harder), true);
  assert.equal(isReleaseTaskUnlocked(c, { ...state, attempts: [response(a.id, 's1'), response(a.id, 's2')] }, harder), false);
  assert.equal(isReleaseTaskUnlocked(c, { ...state, attempts: [response(a.id, 's1'), response(b.id, 's2', true, true)] }, harder), false);
  const learnOnly = state.attempts.map(({ sessionId, ...attempt }) => attempt);
  assert.equal(isReleaseTaskUnlocked(c, { ...state, attempts: learnOnly }, harder), false);
});

test('a previous wrong answer can improve in a later session; retries in the same session do not inflate evidence', () => {
  const a = question('a', 'alpha'), b = question('b', 'alpha');
  const harder: ReleaseTask = { ...question('hard', 'alpha'), kind: 'write', options: [], practice: { familyId: 'alpha', contextId: 'hard', stage: 2, unlock: { subskill: 'meaning', minCorrectContexts: 2, minPracticeSessions: 2, requiresAttempt: true } } };
  const c = course([a, b, harder]);
  const wrong = response(a.id, 's1', false, false, '2026-11-01T10:00:00Z');
  const later = response(a.id, 's2', true, false, '2026-11-02T10:00:00Z');
  const other = response(b.id, 's3', true, false, '2026-11-03T10:00:00Z');
  const state = { ...emptyReleaseState(), learned: ['learned'], attempts: [wrong, later, other] };
  assert.equal(isReleaseTaskUnlocked(c, state, harder), true);
  assert.equal(isReleaseTaskUnlocked(c, { ...state, attempts: [wrong, { ...later, sessionId: 's1' }, other] }, harder), false);
});

test('wrong-answer feedback distinguishes noun case, Umlaut and a supplied Artikel', () => {
  const c = a13ReleaseCourses.find(c => c.lessonId === 'L15' && c.skill === 'vocabulary');
  assert.ok(c);
  const noun = c.tasks.find(t => t.spelling && t.acceptedAnswers[0] === 'Haus');
  assert.ok(noun);
  assert.equal(releaseResponseFeedback(c, noun, 'haus').category, 'capitalization');
  assert.equal(releaseResponseFeedback(c, noun, 'das Haus').category, 'supplied_article');
  const umlaut = c.tasks.find(t => t.spelling && t.acceptedAnswers[0] === 'Küche');
  assert.ok(umlaut);
  assert.equal(releaseResponseFeedback(c, umlaut, 'Kuche').category, 'umlaut');
  const article = c.tasks.find(t => t.articleTarget && t.noun?.word === 'Haus');
  assert.ok(article);
  assert.match(releaseResponseFeedback(c, article, 'die').message, /die.*Haus.*das/u);
});

test('a failed full sentence returns to a scaffold, then permits retry after independent recovery', () => {
  const c = a13ReleaseCourses.find(c => c.lessonId === 'L15' && c.skill === 'grammar');
  assert.ok(c);
  const full = c.tasks.find(t => t.practice?.stage === 3);
  const supports = c.tasks.filter(t => t.practice?.stage === 2);
  assert.ok(full && supports.length === 2);
  const foundations = c.tasks.filter(t => t.targetId === full.targetId && t.subskill === supports[0].practice?.unlock?.subskill && t.practice?.stage === 0).slice(0, 2);
  assert.equal(foundations.length, 2);
  const make = (t: ReleaseTask, index: number, correct = true): ReleaseAttempt => ({ id: `recovery-${index}`, sessionId: `round-${index}`, taskId: t.id, response: correct ? t.acceptedAnswers[0] : 'Andere Antwort', correct, helpUsed: false, submittedAt: new Date(Date.UTC(2026, 10, 10, 10, index)).toISOString(), selectionReason: 'test' });
  const state = { ...emptyReleaseState(), learned: full.requiredCardIds, attempts: [...foundations.map((t, i) => make(t, i)), ...supports.map((t, i) => make(t, i + 2)), make(full, 4, false)] };
  const recovery = selectReleaseRound(c, state, Date.parse('2026-11-10T11:00:00Z')).find(p => p.task.targetId === full.targetId);
  assert.equal(recovery?.task.practice?.stage, 2);
  assert.ok(recovery);
  const retry = selectReleaseRound(c, { ...state, attempts: [...state.attempts, make(recovery.task, 5)] }, Date.parse('2026-11-10T11:00:00Z')).find(p => p.task.targetId === full.targetId);
  assert.equal(retry?.task.id, full.id);
  const helpedState = { ...state, attempts: state.attempts.map(a => a.taskId === full.id ? { ...a, helpUsed: true } : a) };
  const helpedRecovery = selectReleaseRound(c, helpedState, Date.parse('2026-11-10T11:00:00Z')).find(p => p.task.targetId === full.targetId);
  assert.equal(helpedRecovery?.task.practice?.stage, 2, 'assisted failure also prefers the lower scaffold');
});

test('writing scope distinguishes a missing fragment from a whole scaffolded reply', () => {
  const writing = a13ReleaseCourses.flatMap(c => c.tasks).filter(t => t.practice && t.practice.stage >= 2);
  assert.equal(writing.length, 111);
  for (const task of writing) {
    assert.equal(task.kind, 'write');
    assert.ok(task.answerScope === 'sentence' || task.answerScope === 'fragment');
    if (task.answerScope === 'sentence') assert.match(task.acceptedAnswers[0], /[.!?]$/u);
  }
  const reply = writing.find(t => t.id === 'L15-D01-context-supported-1-B-v1');
  assert.equal(reply?.answerScope, 'sentence');
  assert.ok(reply);
  assert.equal(gradeReleaseTask(reply, 'Das ist das Schlafzimmer.'), true);
  assert.equal(gradeReleaseTask(reply, 'ist das Schlafzimmer.'), false);
});
