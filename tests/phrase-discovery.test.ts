import assert from 'node:assert/strict';
import test from 'node:test';
import { l01PhraseDiscovery } from '../src/data/l01-phrase-discovery';
import { discoveryAnswer, discoverySteps, newDiscoveryRun, parseDiscoveryHistory, taughtDiscoveryItemIds, type DiscoveryTask } from '../src/lib/phrase-discovery';

test('only canonical phrases actually visible in the current model become eligible', () => {
  const items = [
    { id: 'farewell', lessonId: 'L01', skill: 'phrases', answer: 'Auf Wiedersehen!' },
    { id: 'unseen', lessonId: 'L01', skill: 'phrases', answer: 'Ich heiße Sun.' },
    { id: 'wrong-lesson', lessonId: 'L02', skill: 'phrases', answer: 'Auf Wiedersehen!' },
    { id: 'wrong-skill', lessonId: 'L01', skill: 'vocabulary', answer: 'Auf Wiedersehen!' },
  ];
  assert.deepEqual(taughtDiscoveryItemIds(l01PhraseDiscovery[0], items), ['farewell']);
  assert.deepEqual(taughtDiscoveryItemIds(l01PhraseDiscovery[1], items), []);
  const wellbeing = l01PhraseDiscovery.find(topic => topic.id === 'L01-COMM-03');
  assert.ok(wellbeing);
  assert.deepEqual(taughtDiscoveryItemIds(wellbeing, [{ id: 'wellbeing', lessonId: 'L01', skill: 'phrases', answer: 'Gut, danke.' }]), ['wellbeing']);
});

const originalAnswers: [string, number[], string][] = [
  ['L01-COMM-01-D01-learn-v1', [1], 'Guten Morgen!'],
  ['L01-COMM-01-D04-learn-v1', [2], 'Tschüs!'],
  ['L01-COMM-02-D01-learn-v1', [2, 1, 0], 'Ich bin Mali.'],
  ['L01-COMM-02-D03-learn-v1', [1], 'Das ist Mali.'],
  ['L01-COMM-03-D02-learn-v1', [2], 'Gut, danke. Und Ihnen?'],
  ['L01-COMM-03-D03-learn-v1', [1], 'Nicht so gut.'],
  ['L01-COMM-04-D01-learn-v1', [3, 2, 1, 0], 'Ich komme aus Thailand.'],
  ['L01-COMM-04-D02-learn-v1', [1], 'Sie kommt aus Deutschland.'],
  ['L01-COMM-05-D01-learn-v1', [1], 'Entschuldigung. Wie bitte?'],
  ['L01-COMM-05-D03-learn-v1', [0], 'Danke.'],
];
const legacyModels = ['L01-COMM-01', 'L01-COMM-02', 'L01-COMM-03', 'L01-COMM-04', 'L01-COMM-05'];
const submittedAt = '2026-11-04T10:00:00.000Z';

test('completed legacy run remains complete at 15 screens with historical assistance unknown', () => {
  const responses = Object.fromEntries(originalAnswers.map(([id, selection, response]) => [id, {
    selection, helpWords: [], first: { response, correct: true, submittedAt, helpWords: [], modelSeen: true },
  }]));
  const parsed = parseDiscoveryHistory(JSON.stringify({ version: 1, runs: [{ id: 'old-complete', step: 15, modelIds: legacyModels, responses, completed: true }] }), l01PhraseDiscovery);
  const run = parsed.runs[0];
  assert.equal(run.bankVersion, 1);
  assert.equal(run.scope, 'all');
  assert.equal(run.completed, true);
  assert.equal(discoverySteps(l01PhraseDiscovery, run).length, 15);
  assert.deepEqual(run.responses['L01-COMM-04-D01-learn-v1'].first, {
    response: 'Ich komme aus Thailand.', correct: true, submittedAt, helpWords: [], modelSeen: true, assistance: null, visualContext: null, listening: null,
  });
});

test('legacy pending answer keeps its position, wrong first response and prior help', () => {
  const parsed = parseDiscoveryHistory(JSON.stringify({ version: 1, runs: [{ id: 'old-pending', step: 1, modelIds: ['L01-COMM-01'], completed: false,
    responses: { 'L01-COMM-01-D01-learn-v1': { selection: [0], helpWords: ['Guten'], first: { response: 'Guten Abend!', correct: false, submittedAt, helpWords: ['Guten'], modelSeen: true } } },
  }] }), l01PhraseDiscovery);
  assert.equal(parsed.runs[0].step, 1);
  assert.deepEqual(parsed.runs[0].responses['L01-COMM-01-D01-learn-v1'].first, {
    response: 'Guten Abend!', correct: false, submittedAt, helpWords: ['Guten'], modelSeen: true, assistance: null, visualContext: null, listening: null,
  });
});

test('new runs can cover the full lesson or only the seven added learning checks', () => {
  const full = discoverySteps(l01PhraseDiscovery, newDiscoveryRun());
  const added = discoverySteps(l01PhraseDiscovery, newDiscoveryRun({ scope: 'supplement' }));
  assert.equal(full.length, 26);
  assert.equal(added.length, 11);
  assert.deepEqual(added.filter(step => step.kind === 'task').map(step => step.task.id), [
    'L01-SUP-N01-learn-v1', 'L01-SUP-N02-learn-v1', 'L01-SUP-S01-learn-v1', 'L01-SUP-S02-learn-v1',
    'L01-SUP-P01-learn-v1', 'L01-SUP-P02-learn-v1', 'L01-SUP-G01-learn-v1',
  ]);
});

test('letter order is graded separately from sentence order and remains explicitly assisted', () => {
  const task = l01PhraseDiscovery.flatMap<DiscoveryTask>(topic => topic.tasks).find(task => task.id === 'L01-SUP-S02-learn-v1');
  assert(task);
  assert.equal(task.subskill, 'name_letter_order');
  assert.equal(discoveryAnswer(task, [2, 3, 0, 1]), 'M-A-L-I.');
  assert.equal(discoveryAnswer(task, [0, 3, 2, 1]), 'L-A-M-I.');
  assert.deepEqual(task.assistance, ['model-dialogue', 'visible-name', 'supplied-letters']);
});

test('an unsupported bank version fails without silently discarding history', () => {
  for (const bankVersion of [99, null]) {
    assert.throws(() => parseDiscoveryHistory(JSON.stringify({ version: 1, runs: [{ ...newDiscoveryRun(), bankVersion }] }), l01PhraseDiscovery), /Invalid discovery bank/);
  }
  assert.throws(() => parseDiscoveryHistory(JSON.stringify({ version: 1, runs: [{ ...newDiscoveryRun(), scope: null }] }), l01PhraseDiscovery), /Invalid discovery bank/);
});

test('listening evidence stays separate from historical visible-name ordering', () => {
  const id = 'L01-SUP-S02-learn-v1';
  const oldFirst = { response: 'M-A-L-I.', correct: true, submittedAt, helpWords: [], modelSeen: true, assistance: ['model-dialogue', 'visible-name', 'supplied-letters'], visualContext: 'l01-context-visuals-v1' };
  const run = { ...newDiscoveryRun({ scope: 'supplement' }), responses: { [id]: { selection: [2, 3, 0, 1], helpWords: [], first: oldFirst } } };
  const read = (candidate: unknown) => parseDiscoveryHistory(JSON.stringify({ version: 1, runs: [candidate] }), l01PhraseDiscovery).runs[0].responses[id];
  assert.equal(read(run).first?.listening, null);
  assert.deepEqual(read(run).first?.assistance, ['model-dialogue', 'visible-name', 'supplied-letters']);
  const listening = { version: 'name-listening-v1', targetId: 'L01-SUP-S02-listening-target', subskill: 'name_letter_listening', completedPlays: 2 };
  const heard = { ...run, responses: { [id]: { ...run.responses[id], audioPlays: 2, first: { ...oldFirst, assistance: ['prior-model', 'replayable-german-letter-audio', 'supplied-letters'], visualContext: 'name-listening-v1', listening } } } };
  assert.deepEqual(read(heard).first?.listening, listening);
  assert.throws(() => read({ ...heard, responses: { [id]: { ...heard.responses[id], audioPlays: 0 } } }), /Invalid listening evidence/);
});
