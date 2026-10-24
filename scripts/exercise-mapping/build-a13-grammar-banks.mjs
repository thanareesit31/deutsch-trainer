import ts from 'typescript';
import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../../', import.meta.url);
const thaiSupport = JSON.parse(await readFile(new URL('docs/exercise-mapping/practice-thai-support.json', root), 'utf8'));
const feedback = JSON.parse(await readFile(new URL('docs/exercise-mapping/practice-feedback.json', root), 'utf8'));
const planner = ts.transpileModule(await readFile(new URL('src/lib/practice-planner.ts', root), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ES2020 } }).outputText.replace(/^export /gm, '');
const template = await readFile(new URL('scripts/exercise-mapping/preview-template.html', root), 'utf8');
const audit = JSON.parse(await readFile(new URL('docs/exercise-mapping/a13-coursebook-activity-audit.json', root), 'utf8'));
const sourceIds = new Set(audit.activities.map(activity => activity.id));

async function writePreview(lesson, slug, bank) {
  const html = template
    .replace('__PLANNER__', () => planner)
    .replace('Dativ · แบบฝึกต้นแบบ', `${bank.title} · แบบฝึกต้นแบบ`)
    .replace('Deutsch Trainer · A1.3 · Lektion 13', `Deutsch Trainer · A1.3 · Lektion ${lesson.slice(1)}`)
    .replace('__BANK__', () => JSON.stringify({ ...bank, thaiSupport }).replaceAll('<', '\\u003c'));
  await writeFile(new URL(`docs/exercise-mapping/${lesson.toLowerCase()}-${slug}-preview.html`, root), html);
  await writeFile(new URL(`src/data/${lesson.toLowerCase()}-${slug}-preview.json`, root), JSON.stringify({ html }) + '\n');
}

function question(lesson, topic, number, kind, sentence, answer, detail, basis, options) {
  if (!sourceIds.has(basis)) throw new Error(`Unknown source activity: ${basis}`);
  const tokens = kind === 'order' ? sentence.replace(/[.!?]$/u, '').split(' ') : undefined;
  const id = `A13-${lesson}-${topic.toUpperCase()}-${String(number).padStart(3, '0')}`;
  if (!feedback.explanations[id]) throw new Error(`Missing learner feedback: ${id}`);
  return {
    id, version: 2, topicId: `${lesson}-${topic}`, variantGroup: id.toLowerCase(),
    kind, prompt: kind === 'order' ? 'แตะคำเพื่อเรียงประโยคให้ถูกต้อง' : kind === 'choice' ? 'เลือกคำให้ประโยคสมบูรณ์' : 'พิมพ์คำที่ถูกต้องลงในช่องว่าง',
    sentence, ...(options ? { options } : {}), ...(tokens ? { tokens } : {}),
    acceptedAnswers: [answer], subskill: `${topic}-${kind}`,
    difficulty: kind === 'choice' ? 1 : kind === 'cloze' ? 2 : 3,
    hint: detail.hint, explanation: feedback.explanations[id],
    knownErrors: Object.fromEntries((options ?? []).filter(option => option !== answer).map(option => [option, detail.error])),
    _sourceActivityId: basis,
  };
}

const specs = [
  {
    lesson: 'L14', title: 'ไวยากรณ์ Lektion 14',
    topics: [
      { id: 'lokale-praepositionen', title: 'Lokale Präpositionen', rows: [
        ['choice', 'Das Café steht direkt rechts vom Kino. Es ist ___ dem Kino.', 'neben', ['neben','unter','hinter'], 'A13-KB-L14-4a'],
        ['choice', 'Der Hund ist nicht vor dem Haus. Er ist auf der Rückseite, also ___ dem Haus.', 'hinter', ['hinter','vor','zwischen'], 'A13-KB-L14-4a'],
        ['cloze', 'Die Brücke ist über dem Fluss. Der Fluss ist ___ der Brücke.', 'unter', null, 'A13-KB-L14-4a'],
        ['cloze', 'Die Post steht in der Mitte: links die Bank, rechts die Schule. Die Post ist ___ der Bank und der Schule.', 'zwischen', null, 'A13-KB-L14-4a'],
        ['order', 'Die Bank ist neben dem Bahnhof.', 'Die Bank ist neben dem Bahnhof.', null, 'A13-KB-L14-4a'],
      ], detail: { hint: 'อ่านตำแหน่งที่บอกไว้ในประโยคก่อนเลือกคำ', explanation: 'คำบุพบทบอกตำแหน่งสัมพันธ์กัน เช่น neben = ข้าง ๆ, hinter = ข้างหลัง, unter = ข้างใต้, zwischen = ระหว่าง', error: 'position_word' } },
      { id: 'wo-dativ', title: 'Wo? + Dativ', rows: [
        ['choice', 'Die Bank ist neben ___ Kino.', 'dem', ['dem','das','den'], 'A13-KB-L14-4b'],
        ['choice', 'Der Bus hält vor ___ Schule.', 'der', ['der','die','den'], 'A13-KB-L14-4b'],
        ['cloze', 'Das Café ist zwischen ___ Park und der Post.', 'dem', null, 'A13-KB-L14-4b'],
        ['cloze', 'Die Frau wartet an ___ Ampel.', 'der', null, 'A13-KB-L14-4b'],
        ['order', 'Das Auto steht vor dem Kaufhaus.', 'Das Auto steht vor dem Kaufhaus.', null, 'A13-KB-L14-4b'],
      ], detail: { hint: 'คำถาม Wo? บอกตำแหน่งคงที่ จึงใช้ Dativ หลังคำบุพบทกลุ่มนี้', explanation: 'ตำแหน่งคงที่ใช้ Dativ: das → dem, die → der, der → dem', error: 'case' } },
    ],
  },
  {
    lesson: 'L15', title: 'ไวยากรณ์ Lektion 15',
    topics: [
      { id: 'possessivartikel', title: 'Possessivartikel ihr/sein', rows: [
        ['choice', 'Tom hat einen Balkon. Ich finde ___ Balkon schön.', 'seinen', ['seinen','sein','seine'], 'A13-KB-L15-quicktest'],
        ['choice', 'Klara hat ein Zimmer. ___ Zimmer ist groß.', 'Ihr', ['Ihr','Ihre','Ihren'], 'A13-KB-L15-quicktest'],
        ['cloze', 'Tom hat eine Küche. Ich finde ___ Küche schön.', 'seine', null, 'A13-KB-L15-quicktest'],
        ['cloze', 'Klara hat eine Lampe. ___ Lampe ist neu.', 'Ihre', null, 'A13-KB-L15-quicktest'],
        ['order', 'Ich finde seinen Balkon schön.', 'Ich finde seinen Balkon schön.', null, 'A13-KB-L15-quicktest'],
      ], detail: { hint: 'หาเจ้าของก่อน แล้วดูเพศและ Case ของคำนามที่ตามมา', explanation: 'sein ใช้กับเจ้าของเพศชาย; ihr ใช้กับเจ้าของเพศหญิง รูปท้ายเปลี่ยนตามคำนามและ Case เช่น seinen Balkon ใน Akkusativ', error: 'possessive_form' } },
    ],
  },
  {
    lesson: 'L16', title: 'ไวยากรณ์ Lektion 16',
    topics: [
      { id: 'temporale-praepositionen', title: 'in / vor / nach', rows: [
        ['choice', 'Es ist jetzt neun Uhr. Ich komme ___ einer Stunde, also um zehn.', 'in', ['in','vor','nach'], 'A13-KB-L16-7'],
        ['choice', 'Heute ist Dienstag. Der Termin war gestern, also ___ einem Tag.', 'vor', ['vor','in','nach'], 'A13-KB-L16-7'],
        ['cloze', 'Der Unterricht endet um zwölf Uhr. Wir essen ___ dem Unterricht.', 'nach', null, 'A13-KB-L16-7'],
        ['cloze', 'Es ist jetzt Montag. Der Termin ist am Mittwoch, also ___ zwei Tagen.', 'in', null, 'A13-KB-L16-7'],
        ['order', 'Wir treffen uns nach dem Kurs.', 'Wir treffen uns nach dem Kurs.', null, 'A13-KB-L16-7'],
      ], detail: { hint: 'in นับจากตอนนี้ไปอนาคต; vor ย้อนอดีต; nach คือหลังเหตุการณ์', explanation: 'in, vor และ nach บอกความสัมพันธ์ของเวลา และคำนามหลังคำบุพบทเหล่านี้ใช้ Dativ ในบริบทนี้', error: 'time_relation' } },
    ],
  },
  {
    lesson: 'L17', title: 'ไวยากรณ์ Lektion 17',
    topics: [
      { id: 'werden', title: 'werden', rows: [
        ['choice', 'Nina ___ Lehrerin.', 'wird', ['wird','werde','wirst'], 'A13-KB-L17-1'],
        ['choice', 'Wir ___ bald Eltern.', 'werden', ['werden','wird','werdet'], 'A13-KB-L17-1'],
        ['cloze', 'Ich ___ Koch.', 'werde', null, 'A13-KB-L17-1'],
        ['cloze', 'Du ___ Ingenieurin.', 'wirst', null, 'A13-KB-L17-1'],
        ['order', 'Er wird Arzt.', 'Er wird Arzt.', null, 'A13-KB-L17-1'],
      ], detail: { hint: 'ดูประธานแล้วเลือกรูป Präsens ของ werden', explanation: 'werden ใช้พูดถึงการเปลี่ยนไปเป็นอาชีพหรือสถานะ: ich werde, du wirst, er/sie/es wird, wir werden', error: 'verb_form' } },
      { id: 'wollen', title: 'wollen + Infinitiv', rows: [
        ['choice', 'Ihr ___ heute Deutsch lernen.', 'wollt', ['wollt','wollen','will'], 'A13-KB-L17-6a'],
        ['choice', 'Frau Koch ___ morgen reisen.', 'will', ['will','wollen','wollt'], 'A13-KB-L17-6a'],
        ['cloze', 'Ich ___ Musiker werden.', 'will', null, 'A13-KB-L17-6a'],
        ['cloze', 'Wir ___ eine Firma gründen.', 'wollen', null, 'A13-KB-L17-6a'],
        ['order', 'Sie will in Berlin studieren.', 'Sie will in Berlin studieren.', null, 'A13-KB-L17-6a'],
      ], detail: { hint: 'ผัน wollen ตามประธานและวางกริยาหลักรูป Infinitiv ท้ายประโยค', explanation: 'wollen เป็นกริยาผันในตำแหน่งที่สอง; กริยาหลักอยู่ท้ายประโยค เช่น will ... studieren', error: 'verb_form' } },
      { id: 'mit-ohne', title: 'mit / ohne', rows: [
        ['choice', 'Sie fährt mit ___ Bus.', 'dem', ['dem','den','der'], 'A13-KB-L17-5a'],
        ['choice', 'Er geht ohne ___ Schirm.', 'einen', ['einen','einem','ein'], 'A13-KB-L17-5a'],
        ['cloze', 'Ich komme mit ___ Freundin.', 'einer', null, 'A13-KB-L17-5a'],
        ['cloze', 'Sie geht ohne ___ Hund.', 'den', null, 'A13-KB-L17-5a'],
        ['order', 'Ich fahre mit dem Zug.', 'Ich fahre mit dem Zug.', null, 'A13-KB-L17-5a'],
      ], detail: { hint: 'mit ใช้ Dativ ส่วน ohne ใช้ Akkusativ', explanation: 'mit ตามด้วย Dativ; ohne ตามด้วย Akkusativ รูป Artikel ต้องตรงกับเพศของคำนาม', error: 'case' } },
    ],
  },
  {
    lesson: 'L18', title: 'ไวยากรณ์ Lektion 18',
    topics: [
      { id: 'imperativ-sie', title: 'Imperativ Sie', rows: [
        ['choice', '___ Sie bitte langsam.', 'Sprechen', ['Sprechen','Sprich','Sprecht'], 'A13-KB-L18-3c'],
        ['choice', '___ Sie hier kurz.', 'Warten', ['Warten','Wartet','Warte'], 'A13-KB-L18-3c'],
        ['cloze', '___ Sie viel Wasser.', 'Trinken', null, 'A13-KB-L18-3c'],
        ['cloze', '___ Sie eine Pause.', 'Machen', null, 'A13-KB-L18-3c'],
        ['order', 'Gehen Sie bitte nach Hause.', 'Gehen Sie bitte nach Hause.', null, 'A13-KB-L18-3c'],
      ], detail: { hint: 'คำสั่งแบบสุภาพขึ้นต้นด้วยกริยา แล้วตามด้วย Sie', explanation: 'Imperativ Sie ใช้กริยารูป Infinitiv นำหน้า Sie เช่น Trinken Sie ...', error: 'imperative_form' } },
      { id: 'sollen', title: 'sollen + Infinitiv', rows: [
        ['choice', 'Du ___ heute zu Hause bleiben.', 'sollst', ['sollst','soll','sollen'], 'A13-KB-L18-7'],
        ['choice', 'Wir ___ mehr schlafen.', 'sollen', ['sollen','soll','sollt'], 'A13-KB-L18-7'],
        ['cloze', 'Ich ___ diese Übung machen.', 'soll', null, 'A13-KB-L18-7'],
        ['cloze', 'Frau Weber ___ mehr trinken.', 'soll', null, 'A13-KB-L18-7'],
        ['order', 'Sie sollen heute mehr Wasser trinken.', 'Sie sollen heute mehr Wasser trinken.', null, 'A13-KB-L18-7'],
      ], detail: { hint: 'ผัน sollen ตามประธาน แล้ววางกริยาหลักรูป Infinitiv ท้ายประโยค', explanation: 'sollen ใช้บอกคำแนะนำหรือสิ่งที่ควรทำ โดยกริยาหลักอยู่ท้ายประโยค', error: 'verb_form' } },
    ],
  },
];

for (const spec of specs) {
  const orderedTopics = spec.lesson === 'L17' ? [spec.topics[0], spec.topics[2], spec.topics[1]] : spec.topics;
  const questions = orderedTopics.flatMap(topic => topic.rows.map(([kind, sentence, answer, options, basis], index) =>
    question(spec.lesson, topic.id, index + 1, kind, sentence, answer, topic.detail, basis, options)));
  const bindings = questions.map(({ id, _sourceActivityId }) => ({
    questionId: id, authorship: 'newly_authored', contentBasis: [_sourceActivityId], exerciseBasis: [_sourceActivityId],
  }));
  const publicQuestions = questions.map(({ _sourceActivityId, ...entry }) => entry);
  const bank = {
    id: `${spec.lesson.toLowerCase()}-grammar-review-v1`, lessonId: spec.lesson,
    title: spec.title, description: 'ฝึกไวยากรณ์ตามหัวข้อของบท',
    summaryNote: 'ผลรอบนี้เป็นชุดทดลอง และยังไม่รวมในความก้าวหน้าหลัก',
    storageKey: `deutsch-trainer:review-prototype:${spec.lesson.toLowerCase()}-grammar:v1`,
    defaultCount: spec.topics.length * 3,
    skillLabels: Object.fromEntries(orderedTopics.flatMap(topic => ['choice','cloze','order'].map(kind => [`${topic.id}-${kind}`, `${topic.title} · ${kind === 'choice' ? 'เลือกคำ' : kind === 'cloze' ? 'พิมพ์คำ' : 'เรียงคำ'}`]))),
    sections: orderedTopics.map(topic => ({ topicId: `${spec.lesson}-${topic.id}`, title: topic.title, count: 3 })),
    questions: publicQuestions,
  };
  await writePreview(spec.lesson, 'grammar', bank);
  for (const topic of orderedTopics) {
    const topicBank = {
      ...bank,
      id: `${spec.lesson.toLowerCase()}-${topic.id}-review-v1`,
      title: topic.title,
      description: 'ฝึกเฉพาะหัวข้อนี้ 5 ข้อต่อรอบ',
      defaultCount: 5,
      storageKey: `deutsch-trainer:review-prototype:${spec.lesson.toLowerCase()}-${topic.id}:v1`,
      sections: undefined,
      questions: publicQuestions.filter(entry => entry.topicId === `${spec.lesson}-${topic.id}`),
    };
    await writePreview(spec.lesson, topic.id, topicBank);
  }
  await writeFile(new URL(`docs/exercise-mapping/${spec.lesson.toLowerCase()}-grammar-bank.json`, root), JSON.stringify({
    schemaVersion: 1, status: 'review_prototype_not_published', reviewScope: 'Author review; independent educator review pending', ...bank,
  }, null, 2) + '\n');
  await writeFile(new URL(`docs/exercise-mapping/${spec.lesson.toLowerCase()}-grammar-provenance.json`, root), JSON.stringify({
    schemaVersion: 1, status: 'source_layout_review_pending_where_ocr_preliminary', bindings,
  }, null, 2) + '\n');
}
