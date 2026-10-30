import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

const root = new URL('../../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const catalog = JSON.parse(await read('supabase/seed/catalog.json'));
const template = await read('scripts/exercise-mapping/preview-template.html');
const planner = ts.transpileModule(await read('src/lib/practice-planner.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText.replace(/^export /gm, '');
const paletteSource = ts.transpileModule(await read('src/lib/profession-learning.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
const { articleColors } = await import('data:text/javascript;base64,' + Buffer.from(paletteSource).toString('base64'));
const allWords = catalog.items.filter(item => /^L(?:0[1-9]|1[0-2])$/.test(item.lessonId) && item.skill === 'vocabulary');
const definitions = [];
const inventory = [];

for (let number = 1; number <= 12; number++) {
  const lessonId = `L${String(number).padStart(2, '0')}`;
  const words = allWords.filter(item => item.lessonId === lessonId);
  const groups = [...new Set(words.map(item => item.group))].map((title, index) => ({ title, topicId: `${lessonId}-vocab-${index + 1}`, ids: words.filter(item => item.group === title).map(item => item.id) }));
  const nounPresentation = Object.fromEntries(words.filter(item => item.article || item.pluralOnly).map(item => [item.id, { label: `${item.article || 'die'} ${item.word}`, color: item.pluralOnly ? 'plural' : item.article }]));
  const questions = [];
  for (const [index, word] of words.entries()) {
    assert(word.word && word.meaning, `${lessonId}: incomplete vocabulary ${word.id}`);
    const group = groups.find(entry => entry.ids.includes(word.id));
    const noun = nounPresentation[word.id];
    const title = noun?.label ?? word.word;
    const base = { itemId: word.id, topicId: group.topicId, topicName: group.title, version: 1, knownErrors: {}, translation: word.meaning };
    const alternatives = [...new Set(allWords.filter(item => item.id !== word.id && item.meaning !== word.meaning && item.lessonId === lessonId).map(item => item.meaning))];
    if (alternatives.length >= 3) {
      const offset = index % alternatives.length;
      questions.push({ ...base, id: `${word.id}-a11-meaning`, kind: 'choice', subskill: 'vocabulary_meaning', difficulty: 1, difficultyRationale: 'เลือกความหมายจากคำที่เรียนในบทเดียวกัน', assistance: 'four-thai-options', optionsLang: 'th', prompt: 'เลือกความหมายของคำนี้', sentence: `${title} — ___`, options: [word.meaning, ...[0, 1, 2].map(i => alternatives[(offset + i) % alternatives.length])], acceptedAnswers: [word.meaning], feedbackAnswer: title, explanation: `คำนี้หมายถึง ${word.meaning}` });
    }
    if (['der', 'die', 'das'].includes(word.article) && !word.pluralOnly) {
      questions.push({ ...base, id: `${word.id}-a11-article`, kind: 'choice', subskill: 'vocabulary_article', difficulty: 2, difficultyRationale: 'ต้องเรียกคืน Artikel โดยไม่มีสีเฉลยล่วงหน้า', assistance: 'article-options', prompt: 'เลือก Artikel ของคำนาม', sentence: `___ ${word.word}`, options: ['der', 'die', 'das'], acceptedAnswers: [word.article], feedbackAnswer: title, explanation: `${title} ใช้ Artikel ${word.article}` });
    }
    const forms = word.word.split(' / ').map(value => value.trim()).filter(Boolean);
    questions.push({ ...base, id: `${word.id}-a11-spelling`, kind: 'cloze', subskill: 'vocabulary_spelling', difficulty: 2, difficultyRationale: 'พิมพ์รูปคำเองโดยมีความหมายและ Artikel ถ้าเป็นคำนาม', assistance: noun ? 'thai-meaning-and-supplied-article' : 'thai-meaning', prompt: 'พิมพ์คำภาษาเยอรมัน', sentence: noun ? `${word.article || 'die'} ___` : '___', acceptedAnswers: forms, feedbackAnswer: title, explanation: `รูปคำที่เรียนคือ ${title}` });
  }
  for (const question of questions) {
    assert(question.acceptedAnswers.length && question.itemId && question.subskill);
    if (question.options) assert.equal(new Set(question.options).size, question.options.length, `Duplicate choices: ${question.id}`);
    definitions.push({ id: question.id, version: question.version, lessonId, itemId: question.itemId, topicId: question.topicId, kind: question.kind, subskill: question.subskill, acceptedAnswers: question.acceptedAnswers, ...(question.options ? { options: question.options } : {}) });
  }
  const base = { title: `คำศัพท์บท ${number}`, description: 'ฝึกความหมาย Artikel และการสะกดจากคำที่เรียนแล้ว', summaryNote: 'ผลแต่ละทักษะเก็บแยกกัน และยังไม่รวมคะแนนความก้าวหน้าหลัก', historySkill: 'vocabulary', requireLearned: true, nounPresentation, articleColors, manualHref: `/practice/${lessonId}/vocabulary`, learnHref: `/learn/${lessonId}/vocabulary`, dailyHref: `/practice/${lessonId}/vocabulary/daily`, skillLabels: { vocabulary_meaning: 'จำความหมาย', vocabulary_article: 'เลือก Artikel', vocabulary_spelling: 'สะกดคำ' }, thaiSupport: { translations: Object.fromEntries(questions.map(question => [question.id, question.translation])), glossary: {}, phrases: [] }, unclassifiedMessage: 'ดูคำตอบและคำอธิบายก่อนทำข้อต่อไป' };
  const banks = [
    { slug: 'basic', workflow: 'guided', defaultCount: Math.min(words.length, 20), sections: groups.map(group => ({ topicId: group.topicId, title: group.title, count: Math.min(5, group.ids.length) })), questions },
    { slug: 'daily', workflow: 'daily', defaultCount: 10, questions },
  ];
  for (const bank of banks) {
    const storage = `a11-vocab-${lessonId.toLowerCase()}-${bank.slug}`;
    const publicBank = { ...base, ...bank, id: `${storage}-v1`, storageKey: `deutsch-trainer:review-prototype:${storage}:v1` };
    const html = template.replace('__PLANNER__', () => planner).replace('__BANK__', () => JSON.stringify(publicBank).replaceAll('<', '\\u003c'));
    await writeFile(new URL(`src/data/${storage}-preview.json`, root), JSON.stringify({ html }) + '\n');
  }
  inventory.push({ lessonId, taughtVocabulary: words.length, questionDefinitions: questions.length, groups: groups.map(group => ({ title: group.title, topicId: group.topicId, itemIds: group.ids })), sourceStatus: 'existing-published-catalog', selection: 'guided first exposure, then target/subskill history', evidence: 'item_exposures or lesson image state → scored account session' });
}
await writeFile(new URL('docs/exercise-mapping/a11-vocabulary-bank.json', root), JSON.stringify({ generatedAt: '2026-10-30', status: 'generated-needs-review-before-rollout', lessons: inventory, definitions }, null, 2) + '\n');
const previewImports = inventory.flatMap(({ lessonId }) => ['basic', 'daily'].map(slug => {
  const key = `${lessonId.toLowerCase()}${slug[0].toUpperCase()}${slug.slice(1)}`;
  return { key, path: `a11-vocab-${lessonId.toLowerCase()}-${slug}-preview.json`, lessonId, slug };
}));
await writeFile(new URL('src/data/a11-vocab-previews.ts', root),
  'export const a11VocabularyPreviews = {\n' +
  previewImports.map(({ lessonId, slug, path }) => `  '${lessonId}-${slug}': () => import('./${path}'),`).join('\n') +
  '\n} as const;\n');
console.log(`Built ${inventory.length} lesson vocabulary banks with ${definitions.length} answer definitions.`);
