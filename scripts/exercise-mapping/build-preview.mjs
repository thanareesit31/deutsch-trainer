import ts from 'typescript';
import { readFile, writeFile } from 'node:fs/promises';
import { l13GrammarVariants } from './l13-grammar-variants.mjs';
const root = new URL('../../', import.meta.url);
const planner = ts.transpileModule(await readFile(new URL('src/lib/practice-planner.ts', root), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText.replace(/^export /gm, '');
const template = await readFile(new URL('scripts/exercise-mapping/preview-template.html', root), 'utf8');
if (template.split('__BANK__').length !== 2) throw new Error('Expected one bank placeholder');

const thaiSupport = JSON.parse(await readFile(new URL('docs/exercise-mapping/practice-thai-support.json', root), 'utf8'));
const dative = JSON.parse(await readFile(new URL('docs/exercise-mapping/l13-dative-bank.json', root), 'utf8'));
const esGibt = JSON.parse(await readFile(new URL('docs/exercise-mapping/l13-es-gibt-bank.json', root), 'utf8'));
const verbs = JSON.parse(await readFile(new URL('docs/exercise-mapping/l13-verbs-bank.json', root), 'utf8'));
const feedback = JSON.parse(await readFile(new URL('docs/exercise-mapping/practice-feedback.json', root), 'utf8'));
for (const bank of [dative, esGibt, verbs]) {
  for (const question of bank.questions) {
    if (question.explanation !== feedback.explanations[question.id]) throw new Error(`Stale learner feedback: ${question.id}`);
  }
}
const dativeDefaults = {
  description: 'ฝึกรูป mir, dir, ihm, ihr, uns, euch, ihnen และ Ihnen จากสิ่งที่เรียนในบทนี้',
  summaryNote: 'ข้อเรียงคำมีสรรพนามให้แล้ว จึงไม่ยืนยันว่าพิมพ์สรรพนามเองได้',
  unclassifiedMessage: 'คำตอบนี้ยังไม่ตรงกับรูปที่ต้องใช้ ดูรูปคำและบุคคลในคำอธิบาย',
  skillLabels: { recognize_dative_pronoun: 'เลือกสรรพนาม', produce_dative_form: 'พิมพ์รูปคำตามบุคคลที่กำหนด', produce_dative_from_context: 'พิมพ์สรรพนามจากบริบท', order_supplied_dative_sentence: 'เรียงคำที่ให้มา' },
  storageKey: 'deutsch-trainer:review-prototype:l13-dativ:v1',
};
const basic = {
  id: 'l13-grammar-basic-v1', title: 'ไวยากรณ์ Lektion 13', defaultCount: 15, workflow: 'guided',
  description: 'ฝึก 3 หัวข้อเรียงตามบทเรียน หัวข้อละ 5 ข้อ',
  summaryNote: 'ผลเลือกคำ เติมคำ และเรียงคำแสดงแยกกัน; รอบนี้ยังไม่รวมในความก้าวหน้าหลัก',
  unclassifiedMessage: 'คำตอบนี้ยังไม่ตรงกับรูปที่ต้องใช้ ดูคำอธิบายแล้วลองฝึกอีกข้อ',
  storageKey: 'deutsch-trainer:review-prototype:l13-grammar-basic:v1',
  skillLabels: { ...esGibt.skillLabels, ...dativeDefaults.skillLabels, ...verbs.skillLabels },
  sections: [
    { topicId: esGibt.topicId, title: esGibt.title, count: 5 },
    { topicId: 'L13-dativ-pronomen', title: dative.title, count: 5 },
    { topicId: verbs.topicId, title: verbs.title, count: 5 },
  ],
  questions: [
    ...esGibt.questions.map((question) => ({ ...question, topicName: esGibt.title })),
    ...dative.questions.map((question) => ({ ...question, topicName: dative.title })),
    ...verbs.questions.filter(question => !['A13-L13-VRB-005','A13-L13-VRB-009','A13-L13-VRB-012'].includes(question.id)).map((question) => ({ ...question, topicName: verbs.title })),
    ...l13GrammarVariants.filter(question => ['A13-L13-VRBX-022','A13-L13-VRBX-023','A13-L13-VRBX-024'].includes(question.id)).map(question => ({ ...question, topicName: verbs.title })),
  ],
};

function l13GrammarTarget(question) {
  if (question.topicId === 'L13-es-gibt-akkusativ') {
    const gender = question.feedbackComparison?.forms?.[0]?.gender;
    const offset = question.subskill === 'es_gibt_negation' ? 4 : 0;
    const number = gender === 'plural' || question.subskill === 'es_gibt_plural' ? 4 : gender === 'masculine' ? 1 : gender === 'feminine' ? 2 : gender === 'neuter' || gender === 'neutral' ? 3 : 1;
    return `L13-G${String(offset + number).padStart(3,'0')}`;
  }
  if (question.topicId === 'L13-dativ-pronomen') {
    if (question.id === 'A13-L13-DAT-014') return 'L13-G014';
    if (question.id === 'A13-L13-DAT-015') return 'L13-G015';
    const form = question.acceptedAnswers?.[0];
    return ({ mir:'L13-G009',dir:'L13-G010',ihm:question.person === 'es'?'L13-G012':'L13-G011',ihr:'L13-G013',uns:'L13-G014',euch:'L13-G015',ihnen:'L13-G016',Ihnen:'L13-G017' })[form] ?? 'L13-G009';
  }
  if (question.topicId === 'L13-verben-mit-dativ') {
    if (question.id === 'A13-L13-VRB-014') return 'L13-G018';
    if (question.id === 'A13-L13-VRB-015') return 'L13-G021';
    const text = `${question.sentence ?? ''} ${question.verb ?? ''}`;
    const answer = question.acceptedAnswers?.[0] ?? '';
    return /gehören|gehört|gehort/u.test(`${text} ${answer}`) ? 'L13-G019' : /helfen|hilf(?:t|st)|helft/u.test(`${text} ${answer}`) ? 'L13-G020' : /danken|danke/u.test(`${text} ${answer}`) ? 'L13-G021' : /gefallen|gefällt/u.test(`${text} ${answer}`) ? 'L13-G018' : undefined;
  }
  return undefined;
}
const basicQuestionIds = new Set(basic.questions.map(question => question.id));
const grammarQuestions = [...basic.questions, ...l13GrammarVariants.filter(question => !basicQuestionIds.has(question.id))].map(question => ({
  ...question,
  targetId: question.targetId ?? l13GrammarTarget(question),
  difficultyRationale: question.difficultyRationale ?? (question.difficulty === 1 ? 'มีตัวเลือกและบริบทช่วยชี้รูปคำ' : question.difficulty === 2 ? 'ดึงรูปคำจากบริบทโดยไม่มีตัวเลือก' : 'จัดคำที่ให้เป็นประโยคสมบูรณ์'),
  assistance: question.assistance ?? (question.kind === 'choice' ? 'answer-options-and-context' : question.kind === 'cloze' ? 'context-clue' : 'supplied-words'),
}));
if (grammarQuestions.length !== 100 || grammarQuestions.some(question => !question.targetId || !question.subskill)) throw new Error(`L13 grammar must have 100 questions with target and subskill bindings; got ${grammarQuestions.length}, invalid ${JSON.stringify(grammarQuestions.filter(question => !question.targetId || !question.subskill).map(question => ({ id:question.id,targetId:question.targetId,subskill:question.subskill })))}`);

const daily = { ...basic, id: 'l13-daily-v1', title: 'ฝึกต่อวันนี้', defaultCount: 10, workflow: 'daily', sections: undefined, questions: grammarQuestions, storageKey: 'deutsch-trainer:review-prototype:l13-daily:v1' };
await writeFile(new URL('src/data/l13-practice-catalog.json', root), JSON.stringify({ questions: grammarQuestions.map(({ id, targetId, topicId, kind, subskill }) => ({ id, targetId, topicId, kind, subskill })) }) + '\n');
for (const [slug, bank] of [['dative', { ...dative, ...dativeDefaults }], ['es-gibt', esGibt], ['verbs', verbs], ['grammar-basic', basic], ['daily', daily]]) {
  const sourceQuestions = slug === 'verbs'
    ? [...verbs.questions.filter(question => !['A13-L13-VRB-005','A13-L13-VRB-009','A13-L13-VRB-012'].includes(question.id)), ...l13GrammarVariants.filter(question => ['A13-L13-VRBX-022','A13-L13-VRBX-023','A13-L13-VRBX-024'].includes(question.id))]
    : bank.questions;
  const publicBank = {
    id: bank.id, title: bank.title, description: bank.description, summaryNote: bank.summaryNote, thaiSupport,
    storageKey: bank.storageKey, skillLabels: bank.skillLabels, defaultCount: bank.defaultCount,
    requireLearned: true, learnHref: '/learn/L13/grammar', learnLabel: 'ไปเรียนไวยากรณ์',
    unclassifiedMessage: bank.unclassifiedMessage ?? 'คำตอบนี้ยังไม่ตรงกับรูปที่ต้องใช้ ดูคำอธิบายแล้วลองฝึกอีกข้อ',
    sections: bank.sections, workflow: bank.workflow,
    nextTopic: slug === 'es-gibt' ? { title: dative.title, href: '/practice/L13/grammar/dativ-pilot' } : slug === 'dative' ? { title: verbs.title, href: '/practice/L13/grammar/verbs' } : undefined,
    questions: sourceQuestions.map(({ id, version, targetId, topicId, topicName, kind, prompt, sentence, options, tokens, acceptedAnswers, subskill, difficulty, difficultyRationale, assistance, hint, explanation, feedbackComparison, knownErrors, person }) => ({ id, version, targetId: targetId ?? l13GrammarTarget({ id, topicId, subskill, sentence, acceptedAnswers, feedbackComparison, person }), topicId, topicName, kind, prompt, sentence, options, tokens, acceptedAnswers, subskill, difficulty, difficultyRationale, assistance, hint, explanation, ...(feedbackComparison ? { feedbackComparison } : {}), knownErrors })),
  };
  const html = template.replace('__PLANNER__', () => planner).replace('__BANK__', () => JSON.stringify(publicBank).replaceAll('<', '\\u003c'));
  await writeFile(new URL(`docs/exercise-mapping/l13-${slug}-preview.html`, root), html);
  await writeFile(new URL(`src/data/l13-${slug}-preview.json`, root), JSON.stringify({ html }) + '\n');
  console.log(`Built ${slug} preview with ${publicBank.questions.length} questions; source audit/provenance excluded.`);
}
