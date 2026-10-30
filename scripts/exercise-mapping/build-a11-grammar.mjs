import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import ts from 'typescript';

const root = new URL('../../', import.meta.url);
const read = path => readFile(new URL(path, root), 'utf8');
const source = ts.transpileModule(await read('src/lib/grammar-discovery.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText;
const { grammarDiscoveryLessons } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const catalog = JSON.parse(await read('supabase/seed/catalog.json'));
const l02Source = await read('supabase/migrations/20261007010000_l02_learning_content.sql');
const l02Items = [...l02Source.matchAll(/values \('([^']+)','L02','[^']+',\d+,'published','([^']+)'::jsonb\)/g)].map(match => JSON.parse(match[2]));
const template = await read('scripts/exercise-mapping/preview-template.html');
const planner = ts.transpileModule(await read('src/lib/practice-planner.ts'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText.replace(/^export /gm, '');
const inventory = [];
const definitions = [];
const imports = [];

for (const lessonId of ['L01', 'L02', ...grammarDiscoveryLessons.map(lesson => lesson.id)]) {
  const number = Number(lessonId.slice(1));
  const discovery = grammarDiscoveryLessons.find(lesson => lesson.id === lessonId);
  const catalogGrammar = lessonId === 'L02' ? l02Items.filter(item => item.skill === 'grammar') : catalog.items.filter(item => item.lessonId === lessonId && item.skill === 'grammar');
  const topics = discovery ? discovery.topics.map(topic => ({ slug: topic.slug, title: topic.title, targetId: `${lessonId}-GD-${topic.slug}` })) : [...new Set(catalogGrammar.map(item => item.group))].map((title, index) => ({ slug: `catalog-${index + 1}`, title, targetId: null }));
  const questions = [];
  if (discovery) for (const topic of discovery.topics) {
    const targetId = `${lessonId}-GD-${topic.slug}`;
    for (const [kind, task] of [['observe', topic.observe], ['apply', topic.apply]]) {
      assert(task.choices.includes(task.answer), `${lessonId}/${topic.slug}: answer absent from options`);
      questions.push({ id: `${lessonId}-GD-${topic.slug}-${kind}`, version: 1, itemId: targetId, targetId, requiredTopicSlug: topic.slug, topicId: `${lessonId}-grammar-${topic.slug}`, topicName: topic.title, kind: 'choice', subskill: kind === 'observe' ? 'grammar_form_recognition' : 'grammar_context_choice', difficulty: kind === 'observe' ? 1 : 2, difficultyRationale: kind === 'observe' ? 'สังเกตรูปจากตัวอย่างที่สอน' : 'เลือกรูปให้เข้ากับบริบทใหม่', assistance: 'answer-options-and-rule-hint', prompt: task.prompt, sentence: task.prompt, options: [...task.choices], acceptedAnswers: [task.answer], explanation: topic.rule, hint: task.hint, translation: topic.thai });
    }
  }
  else if (lessonId === 'L02') {
    const pronouns = catalogGrammar.filter(item => item.pronounContent);
    for (const item of pronouns) questions.push({ id: `${item.id}-a11-choice`, version: 1, itemId: item.id, targetId: item.id, topicId: `${lessonId}-grammar-catalog-1`, topicName: 'Personalpronomen', kind: 'choice', subskill: 'grammar_pronoun_context', difficulty: 1, difficultyRationale: 'เลือกสรรพนามตามบุคคลและความสุภาพที่สอน', assistance: 'pronoun-options', prompt: `เลือกสรรพนามสำหรับ “${item.meaning}”`, sentence: `___ — ${item.meaning}`, options: [...new Set(pronouns.map(other => other.answer))], acceptedAnswers: [item.answer], explanation: `${item.answer} ใช้หมายถึง ${item.meaning}`, translation: item.meaning });
    for (const item of catalogGrammar.filter(entry => entry.verbContent)) for (const [index, form] of item.verbContent.conjugations.entries()) for (const kind of ['choice', 'cloze']) {
      questions.push({ id: `${item.id}-a11-${index}-${kind}`, version: 1, itemId: item.id, targetId: item.id, topicId: `${lessonId}-grammar-catalog-2`, topicName: 'Verben', kind, subskill: kind === 'choice' ? 'grammar_conjugation_recognition' : 'grammar_conjugation_production', difficulty: kind === 'choice' ? 1 : 2, difficultyRationale: kind === 'choice' ? 'เลือกกริยาที่ผันตามประธาน' : 'พิมพ์รูปผันด้วยตนเอง', assistance: kind === 'choice' ? 'verb-options' : 'subject-and-infinitive', prompt: `${form.subject} + ${item.word}`, sentence: `${form.subject} + ${item.word} → ___`, ...(kind === 'choice' ? { options: [...new Set(item.verbContent.conjugations.map(row => row.form))] } : {}), acceptedAnswers: [form.form], explanation: `${form.subject} ใช้รูป ${form.form}`, translation: item.meaning });
    }
    for (const item of catalogGrammar.filter(entry => entry.group === 'W-Frage')) {
      questions.push({ id: `${item.id}-a11-meaning`, version: 1, itemId: item.id, targetId: item.id, topicId: `${lessonId}-grammar-catalog-3`, topicName: 'W-Frage', kind: 'choice', subskill: 'grammar_question_meaning', difficulty: 1, difficultyRationale: 'จำความหมายของคำถามที่เรียน', assistance: 'thai-options', prompt: 'Was หมายถึงอะไร', sentence: 'Was?', options: ['อะไร', 'ที่ไหน', 'อย่างไร'], acceptedAnswers: ['อะไร'], explanation: 'Was ใช้ถามว่าอะไร', translation: 'อะไร' });
      questions.push({ id: `${item.id}-a11-context`, version: 1, itemId: item.id, targetId: item.id, topicId: `${lessonId}-grammar-catalog-3`, topicName: 'W-Frage', kind: 'choice', subskill: 'grammar_question_context', difficulty: 2, difficultyRationale: 'เลือกคำถามให้ตรงกับความหมายในประโยค', assistance: 'german-question-options', prompt: 'เติมคำถาม: เธอทำอะไร', sentence: '___ machst du?', options: ['Was', 'Wo', 'Wie'], acceptedAnswers: ['Was'], explanation: 'Was machst du? ถามว่าเธอทำอะไร', translation: 'เธอทำอะไร' });
    }
  }
  else for (const item of catalogGrammar) {
    const topic = topics.find(entry => entry.title === item.group);
    if (item.group === 'Satzbau' && item.answer) {
      const tokens = item.answer.split(/\s+/);
      questions.push({ id: `${item.id}-a11-order`, version: 1, itemId: item.id, targetId: item.id, topicId: `${lessonId}-grammar-${topic.slug}`, topicName: topic.title, kind: 'order', subskill: 'grammar_sentence_order', difficulty: 2, difficultyRationale: 'เรียงประโยคจากคำที่ให้โดยใช้ลำดับคำที่เรียน', assistance: 'supplied-words-and-thai-context', prompt: 'เรียงคำเป็นประโยคภาษาเยอรมัน', sentence: item.prompt, tokens, acceptedAnswers: [item.answer], explanation: item.answer, translation: item.meaning || '' });
      continue;
    }
    if (!item.answer || !item.options?.includes(item.answer)) continue;
    for (const kind of ['choice', 'cloze']) questions.push({ id: `${item.id}-a11-${kind}`, version: 1, itemId: item.id, targetId: item.id, topicId: `${lessonId}-grammar-${topic.slug}`, topicName: topic.title, kind, subskill: kind === 'choice' ? 'grammar_form_recognition' : 'grammar_form_production', difficulty: kind === 'choice' ? 1 : 2, difficultyRationale: kind === 'choice' ? 'เลือกรูปผันจากตัวเลือกที่สอน' : 'พิมพ์รูปผันโดยไม่มีตัวเลือก', assistance: kind === 'choice' ? 'answer-options' : 'subject-and-infinitive', prompt: kind === 'choice' ? 'เลือกรูปคำให้ตรงกับประธาน' : 'พิมพ์รูปคำให้ตรงกับประธาน', sentence: `${item.prompt} → ___`, ...(kind === 'choice' ? { options: item.options } : {}), acceptedAnswers: [item.answer], explanation: item.meaning || `${item.prompt} → ${item.answer}`, translation: item.meaning || '' });
  }
  for (const question of questions) definitions.push({ id: question.id, version: 1, lessonId, targetId: question.targetId, requiredTopicSlug: question.requiredTopicSlug, topicId: question.topicId, kind: question.kind, subskill: question.subskill, acceptedAnswers: question.acceptedAnswers, ...(question.options ? { options: question.options } : {}), ...(question.tokens ? { tokens: question.tokens } : {}) });
  const base = { title: `ไวยากรณ์บท ${number}`, description: 'ฝึกกฎและรูปคำจากสิ่งที่เรียนแล้ว', summaryNote: 'ผลจำรูปและใช้รูปในบริบทเก็บแยกกัน ยังไม่รวมคะแนนความก้าวหน้าหลัก', historySkill: 'grammar', requireLearned: true, manualHref: `/practice/${lessonId}/grammar`, learnHref: `/learn/${lessonId}/grammar`, learnLabel: 'ไปเรียนไวยากรณ์', emptyMessage: 'ยังไม่มีหัวข้อไวยากรณ์ที่เรียนแล้ว', dailyHref: `/practice/${lessonId}/grammar/daily`, skillLabels: { grammar_form_recognition: 'จำรูปไวยากรณ์', grammar_context_choice: 'เลือกรูปในบริบท', grammar_form_production: 'พิมพ์รูปคำ' }, thaiSupport: { translations: Object.fromEntries(questions.map(question => [question.id, question.translation])), glossary: {}, phrases: [] }, unclassifiedMessage: 'ดูรูปคำและกฎที่เกี่ยวข้องก่อนทำข้อต่อไป' };
  for (const bank of [
    { slug: 'basic', workflow: 'guided', defaultCount: Math.min(topics.length * 2, questions.length), sections: topics.map(topic => ({ topicId: `${lessonId}-grammar-${topic.slug}`, title: topic.title, count: 2 })), questions },
    { slug: 'daily', workflow: 'daily', defaultCount: 10, questions },
  ]) {
    const storage = `a11-grammar-${lessonId.toLowerCase()}-${bank.slug}`;
    const html = template.replace('__PLANNER__', () => planner).replace('__BANK__', () => JSON.stringify({ ...base, ...bank, id: `${storage}-v1`, storageKey: `deutsch-trainer:review-prototype:${storage}:v1` }).replaceAll('<', '\\u003c'));
    await writeFile(new URL(`src/data/${storage}-preview.json`, root), JSON.stringify({ html }) + '\n');
    const key = `${lessonId.toLowerCase()}${bank.slug[0].toUpperCase()}${bank.slug.slice(1)}`;
    imports.push({ key, path: `${storage}-preview.json`, lessonId, slug: bank.slug });
  }
  inventory.push({ lessonId, topicCount: topics.length, questionDefinitions: questions.length, topics, sourceStatus: discovery ? 'existing-grammar-discovery-content' : lessonId === 'L02' ? 'existing-published-l02-migration' : 'existing-published-catalog', learnedEvidence: discovery ? 'completedTopics in lesson state' : 'item_exposures' });
}
await writeFile(new URL('docs/exercise-mapping/a11-grammar-bank.json', root), JSON.stringify({ generatedAt: '2026-10-30', status: 'generated-needs-review-before-rollout', lessons: inventory, definitions }, null, 2) + '\n');
await writeFile(new URL('src/data/a11-grammar-previews.ts', root), 'export const a11GrammarPreviews = {\n' + imports.map(({ path, lessonId, slug }) => `  '${lessonId}-${slug}': () => import('./${path}'),`).join('\n') + '\n} as const;\n');
console.log(`Built ${inventory.length} grammar lesson banks with ${definitions.length} answer definitions.`);
