import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';
import { a11AuthoredPhraseTargets } from './a11-phrase-targets.mjs';

const root = new URL('../../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const catalog = JSON.parse(await read('supabase/seed/catalog.json'));
const l02Source = await read('supabase/migrations/20261007010000_l02_learning_content.sql');
const l02Items = [...l02Source.matchAll(/values \('([^']+)','L02','[^']+',\d+,'published','([^']+)'::jsonb\)/g)].map(match => JSON.parse(match[2]));
const l02PreparedSource = ts.transpileModule(await read('src/lib/l02-phrase-content.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
const { l02StatusExamples } = await import('data:text/javascript;base64,' + Buffer.from(l02PreparedSource).toString('base64'));
const l01Targets = catalog.items.filter(item => item.lessonId === 'L01' && item.skill === 'phrases').map(item => ({ id: item.id, lessonId: 'L01', de: item.title, th: item.meaning, sourceStatus: 'existing-published-catalog' }));
const l02Targets = l02Items.filter(item => ['L02-pattern-phone', 'L02-pattern-profession'].includes(item.id)).map(item => ({ id: item.id, lessonId: 'L02', de: item.title, th: item.meaning, sourceStatus: 'existing-published-l02-migration' }));
for (const example of l02StatusExamples) l02Targets.push({ id: example.id, lessonId: 'L02', de: example.de, th: example.th, sourceStatus: 'existing-published-l02-migration' });
const targets = [...l01Targets, ...l02Targets, ...a11AuthoredPhraseTargets];
const template = await read('scripts/exercise-mapping/preview-template.html');
const planner = ts.transpileModule(await read('src/lib/practice-planner.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText.replace(/^export /gm, '');
const definitions = [];
const inventory = [];
const imports = [];

for (let number = 1; number <= 12; number++) {
  const lessonId = `L${String(number).padStart(2, '0')}`;
  const lessonTargets = targets.filter(target => target.lessonId === lessonId);
  assert(lessonTargets.length >= 8 && lessonTargets.every(target => target.de && target.th), `${lessonId}: incomplete phrase targets`);
  const topicId = `${lessonId}-phrases-core`;
  const questions = [];
  for (const [index, target] of lessonTargets.entries()) {
    const others = lessonTargets.filter(other => other.id !== target.id);
    const choices = [0, 1, 2].map(offset => others[(index + offset) % others.length]);
    const base = { version: 1, itemId: target.id, targetId: target.id, requiredItemIds: [target.id], coverageItemIds: [target.id], topicId, topicName: 'ประโยคที่ใช้ในบทนี้', stageId: topicId, sequence: index + 1, feedbackAnswer: target.de, translation: target.th, knownErrors: {} };
    questions.push({ ...base, id: `${target.id}-a11-meaning`, kind: 'choice', subskill: 'phrase_comprehension', difficulty: 1, difficultyRationale: 'เลือกความหมายของประโยคที่สอน', assistance: 'thai-options', prompt: 'ประโยคนี้หมายถึงอะไร', sentence: target.de, optionsLang: 'th', options: [target.th, ...choices.map(choice => choice.th)], acceptedAnswers: [target.th], explanation: `ประโยคนี้หมายถึง “${target.th}”` });
    questions.push({ ...base, id: `${target.id}-a11-situation`, kind: 'choice', subskill: 'phrase_situation_choice', difficulty: 2, difficultyRationale: 'เลือกประโยคภาษาเยอรมันให้ตรงกับสถานการณ์', assistance: 'german-phrase-options', prompt: 'Welche Aussage passt?', sentence: target.th, options: [target.de, ...choices.map(choice => choice.de)], acceptedAnswers: [target.de], explanation: `สถานการณ์นี้ใช้ “${target.de}”` });
    if (target.de.split(/\s+/).length >= 3) questions.push({ ...base, id: `${target.id}-a11-order`, kind: 'order', subskill: 'phrase_word_order', difficulty: 3, difficultyRationale: 'จัดคำที่ให้เป็นประโยคสมบูรณ์', assistance: 'supplied-words-and-thai-context', prompt: 'เรียงคำเป็นประโยคภาษาเยอรมัน', sentence: target.th, tokens: target.de.split(/\s+/), acceptedAnswers: [target.de], explanation: `เรียงคำให้ได้ “${target.de}”` });
  }
  for (const question of questions) {
    if (question.options) assert.equal(new Set(question.options).size, question.options.length, `Duplicate options: ${question.id}`);
    definitions.push({ id: question.id, version: 1, lessonId, targetId: question.targetId, topicId, kind: question.kind, subskill: question.subskill, acceptedAnswers: question.acceptedAnswers, ...(question.options ? { options: question.options } : {}), ...(question.tokens ? { tokens: question.tokens } : {}) });
  }
  const base = { title: `ประโยคและสำนวนบท ${number}`, description: 'ฝึกเข้าใจ เลือกใช้ และเรียงประโยคจากสิ่งที่เรียนแล้ว', summaryNote: 'ผลความเข้าใจ การเลือกใช้ และลำดับคำเก็บแยกกัน ยังไม่รวมคะแนนความก้าวหน้าหลัก', historySkill: 'phrases', requireLearned: true, manualHref: `/practice/${lessonId}/phrases`, learnHref: `/learn/${lessonId}/phrases`, learnLabel: 'ไปเรียนประโยค', dailyHref: `/practice/${lessonId}/phrases/daily`, skillLabels: { phrase_comprehension: 'เข้าใจประโยค', phrase_situation_choice: 'เลือกประโยคตามสถานการณ์', phrase_word_order: 'เรียงคำเป็นประโยค' }, thaiSupport: { translations: Object.fromEntries(questions.map(question => [question.id, question.translation])), glossary: {}, phrases: [] }, unclassifiedMessage: 'ดูความหมายและรูปประโยคก่อนทำข้อต่อไป', skillCycle: ['phrase_comprehension', 'phrase_situation_choice', 'phrase_word_order'] };
  for (const bank of [
    { slug: 'basic', workflow: 'guided', defaultCount: lessonTargets.length, sections: [{ topicId, title: 'ประโยคที่ใช้ในบทนี้', count: lessonTargets.length }], questions: questions.filter(question => question.subskill === 'phrase_comprehension') },
    { slug: 'daily', workflow: 'daily', defaultCount: 10, questions },
  ]) {
    const storage = `a11-phrases-${lessonId.toLowerCase()}-${bank.slug}`;
    const html = template.replace('/*__PHRASE_MATCHING__*/', () => 'function phraseQuestionTranslation(){return "";}').replace('__PLANNER__', () => planner).replace('__BANK__', () => JSON.stringify({ ...base, ...bank, id: `${storage}-v1`, storageKey: `deutsch-trainer:review-prototype:${storage}:v1` }).replaceAll('<', '\\u003c'));
    await writeFile(new URL(`src/data/${storage}-preview.json`, root), JSON.stringify({ html }) + '\n');
    const key = `${lessonId.toLowerCase()}${bank.slug[0].toUpperCase()}${bank.slug.slice(1)}`;
    imports.push({ key, path: `${storage}-preview.json`, lessonId, slug: bank.slug });
  }
  inventory.push({ lessonId, targetCount: lessonTargets.length, questionDefinitions: questions.length, targets: lessonTargets, topicId, learnedEvidence: 'item_exposures', sourceStatus: lessonId === 'L01' ? 'existing-catalog' : lessonId === 'L02' ? 'existing-l02-migration' : 'product-authored-curriculum-aligned' });
}
await writeFile(new URL('docs/exercise-mapping/a11-phrase-bank.json', root), JSON.stringify({ generatedAt: '2026-10-30', status: 'generated-needs-review-before-rollout', lessons: inventory, definitions }, null, 2) + '\n');
await writeFile(new URL('src/data/a11-phrase-previews.ts', root), 'export const a11PhrasePreviews = {\n' + imports.map(({ path, lessonId, slug }) => `  '${lessonId}-${slug}': () => import('./${path}'),`).join('\n') + '\n} as const;\n');
await writeFile(new URL('src/data/a11-phrase-targets.json', root), JSON.stringify(targets) + '\n');
console.log(`Built ${inventory.length} phrase lesson banks with ${targets.length} targets and ${definitions.length} answer definitions.`);
