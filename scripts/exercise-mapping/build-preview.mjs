import ts from 'typescript';
import { readFile, writeFile } from 'node:fs/promises';
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
    ...verbs.questions.map((question) => ({ ...question, topicName: verbs.title })),
  ],
};

const daily = { ...basic, id: 'l13-daily-v1', title: 'ฝึกต่อวันนี้', defaultCount: 10, workflow: 'daily', sections: undefined, storageKey: 'deutsch-trainer:review-prototype:l13-daily:v1' };
await writeFile(new URL('src/data/l13-practice-catalog.json', root), JSON.stringify({ questions: basic.questions.map(({ id, topicId, kind, subskill }) => ({ id, topicId, kind, subskill })) }) + '\n');
for (const [slug, bank] of [['dative', { ...dative, ...dativeDefaults }], ['es-gibt', esGibt], ['verbs', verbs], ['grammar-basic', basic], ['daily', daily]]) {
  const publicBank = {
    id: bank.id, title: bank.title, description: bank.description, summaryNote: bank.summaryNote, thaiSupport,
    storageKey: bank.storageKey, skillLabels: bank.skillLabels, defaultCount: bank.defaultCount,
    unclassifiedMessage: bank.unclassifiedMessage ?? 'คำตอบนี้ยังไม่ตรงกับรูปที่ต้องใช้ ดูคำอธิบายแล้วลองฝึกอีกข้อ',
    sections: bank.sections, workflow: bank.workflow,
    nextTopic: slug === 'es-gibt' ? { title: dative.title, href: '/practice/L13/grammar/dativ-pilot' } : slug === 'dative' ? { title: verbs.title, href: '/practice/L13/grammar/verbs' } : undefined,
    questions: bank.questions.map(({ id, version, topicId, topicName, kind, prompt, sentence, options, tokens, acceptedAnswers, subskill, difficulty, hint, explanation, knownErrors }) => ({ id, version, topicId, topicName, kind, prompt, sentence, options, tokens, acceptedAnswers, subskill, difficulty, hint, explanation, knownErrors })),
  };
  const html = template.replace('__PLANNER__', () => planner).replace('__BANK__', () => JSON.stringify(publicBank).replaceAll('<', '\\u003c'));
  await writeFile(new URL(`docs/exercise-mapping/l13-${slug}-preview.html`, root), html);
  await writeFile(new URL(`src/data/l13-${slug}-preview.json`, root), JSON.stringify({ html }) + '\n');
  console.log(`Built ${slug} preview with ${publicBank.questions.length} questions; source audit/provenance excluded.`);
}
