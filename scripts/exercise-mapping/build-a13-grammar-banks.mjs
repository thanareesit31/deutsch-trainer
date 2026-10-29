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
    .replace('Dativ · แบบฝึกต้นแบบ', `${bank.title} · ${lesson === 'L14' ? 'แบบฝึก' : 'แบบฝึกต้นแบบ'}`)
    .replace('Deutsch Trainer · A1.3 · Lektion 13', `Deutsch Trainer · A1.3 · Lektion ${lesson.slice(1)}`)
    .replace('__BANK__', () => JSON.stringify({ ...bank, thaiSupport }).replaceAll('<', '\\u003c'));
  await writeFile(new URL(`docs/exercise-mapping/${lesson.toLowerCase()}-${slug}-preview.html`, root), html);
  await writeFile(new URL(`src/data/${lesson.toLowerCase()}-${slug}-preview.json`, root), JSON.stringify({ html }) + '\n');
}

function question(lesson, topic, number, kind, sentence, answer, detail, basis, options) {
  if (!sourceIds.has(basis)) throw new Error(`Unknown source activity: ${basis}`);
  const tokens = kind === 'order' ? sentence.replace(/[.!?]$/u, '').split(' ') : undefined;
  const id = `A13-${lesson}-${topic.toUpperCase()}-${String(number).padStart(3, '0')}`;
  if (!feedback.explanations[id] && !detail.explanation) throw new Error(`Missing learner feedback: ${id}`);
  return {
    id, version: 2, topicId: `${lesson}-${topic}`, variantGroup: id.toLowerCase(),
    kind, prompt: kind === 'order' ? 'แตะคำเพื่อเรียงประโยคให้ถูกต้อง' : kind === 'choice' ? 'เลือกคำให้ประโยคสมบูรณ์' : 'พิมพ์คำที่ถูกต้องลงในช่องว่าง',
    sentence, ...(options ? { options } : {}), ...(tokens ? { tokens } : {}),
    acceptedAnswers: [answer], subskill: `${topic}-${kind}`,
    difficulty: kind === 'choice' ? 1 : kind === 'cloze' ? 2 : 3,
    hint: detail.hint, explanation: feedback.explanations[id] ?? detail.explanation,
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
  let historicalQuestions = [];
  if (spec.lesson === 'L14') {
    const positionTargets = [
      { id: 'L14-G001', word: 'in', cue: 'Der Ball ist innerhalb der Box.', relation: 'อยู่ด้านใน', noun: 'der Box', contexts: ['Der Ball liegt ___ der Box.', 'Die Kinder sind ___ dem Haus.', 'Die Karte steckt ___ der Tasche.', 'Der Mann wartet ___ dem Café.', 'Die Bücher stehen ___ dem Regal.'] },
      { id: 'L14-G002', word: 'auf', cue: 'Der Ball berührt die obere Fläche.', relation: 'อยู่บนพื้นผิวด้านบน', noun: 'dem Tisch', contexts: ['Der Ball liegt ___ dem Tisch.', 'Die Tasse steht ___ dem Regal.', 'Das Buch liegt ___ dem Stuhl.', 'Die Tasche liegt ___ dem Bett.', 'Die Zeitung liegt ___ dem Sofa.'] },
      { id: 'L14-G003', word: 'über', cue: 'Der Ball hängt höher und berührt den Gegenstand nicht.', relation: 'อยู่เหนือโดยไม่สัมผัส', noun: 'dem Tisch', contexts: ['Die Lampe hängt ___ dem Tisch.', 'Das Bild hängt ___ dem Sofa.', 'Die Wolke steht ___ dem Haus.', 'Der Vogel fliegt ___ dem Park.', 'Die Uhr hängt ___ der Tür.'] },
      { id: 'L14-G004', word: 'unter', cue: 'Der Ball ist tiefer als der Gegenstand.', relation: 'อยู่ใต้', noun: 'dem Tisch', contexts: ['Der Ball liegt ___ dem Tisch.', 'Die Schuhe stehen ___ dem Bett.', 'Die Katze sitzt ___ dem Stuhl.', 'Der Hund liegt ___ dem Baum.', 'Die Tasche ist ___ der Bank.'] },
      { id: 'L14-G005', word: 'an', cue: 'Der Ball berührt die Seitenfläche.', relation: 'อยู่ชิดด้านข้างหรือแนบกับ', noun: 'der Wand', contexts: ['Das Bild hängt ___ der Wand.', 'Der Mann steht ___ der Tür.', 'Das Fahrrad lehnt ___ dem Haus.', 'Die Lampe steht ___ dem Fenster.', 'Der Zettel hängt ___ der Pinnwand.'] },
      { id: 'L14-G006', word: 'vor', cue: 'Der Ball ist auf der Vorderseite des Gegenstands.', relation: 'อยู่ด้านหน้า', noun: 'dem Haus', contexts: ['Das Auto steht ___ dem Haus.', 'Die Frau wartet ___ der Schule.', 'Der Bus hält ___ dem Bahnhof.', 'Der Hund sitzt ___ der Tür.', 'Die Bank steht ___ dem Kino.'] },
      { id: 'L14-G007', word: 'hinter', cue: 'Der Ball ist auf der Rückseite des Gegenstands.', relation: 'อยู่ด้านหลัง', noun: 'dem Haus', contexts: ['Der Garten liegt ___ dem Haus.', 'Das Fahrrad steht ___ der Garage.', 'Der Spielplatz ist ___ der Schule.', 'Der Bus wartet ___ dem Bahnhof.', 'Die Katze versteckt sich ___ dem Sofa.'] },
      { id: 'L14-G008', word: 'neben', cue: 'Der Ball liegt seitlich und mit Abstand zum Gegenstand.', relation: 'อยู่ข้าง ๆ โดยมีระยะห่าง', noun: 'dem Tisch', contexts: ['Der Stuhl steht ___ dem Tisch.', 'Das Café ist ___ der Bank.', 'Das Fahrrad steht ___ dem Haus.', 'Die Apotheke liegt ___ dem Kino.', 'Der Baum wächst ___ dem Spielplatz.'] },
      { id: 'L14-G009', word: 'zwischen', cue: 'Der Ball liegt in der Mitte von zwei Gegenständen.', relation: 'อยู่ระหว่างสองสิ่ง', noun: 'dem Haus und dem Café', contexts: ['Der Park liegt ___ dem Haus und dem Café.', 'Die Bank steht ___ der Post und dem Kino.', 'Das Kind sitzt ___ den Eltern.', 'Die Schule liegt ___ dem Bahnhof und der Apotheke.', 'Der Brunnen steht ___ den Bäumen.'] },
    ];
    const positionExtras = positionTargets.flatMap((target, targetIndex) => target.contexts.map((sentence, index) => {
      const kind = ['choice', 'cloze', 'choice', 'cloze', 'order'][index];
      const id = `A13-L14-LOC-${String(targetIndex * 5 + index + 6).padStart(3, '0')}`;
      const source = 'A13-KB-L14-4a';
      const choices = positionTargets.filter(entry => entry.word !== target.word).map(entry => entry.word);
      const answer = target.word;
      const mixedOptions = [answer, ...choices.slice((targetIndex + index) % choices.length, (targetIndex + index) % choices.length + 2)];
      const options = mixedOptions.length === 3 ? mixedOptions : [answer, ...choices.filter(word => !mixedOptions.includes(word)).slice(0, 2)];
      const detail = {
        hint: target.cue,
        explanation: `${target.cue} ใช้ ${answer} เพื่อระบุตำแหน่งคงที่; คำนามหลังคำบุพบทกลุ่มนี้อยู่ใน Dativ.`,
        error: 'position_word',
      };
      const completeSentence = sentence.replace('___', answer);
      const entry = question('L14', 'lokale-praepositionen', targetIndex * 5 + index + 6, kind, kind === 'order' ? completeSentence : sentence, kind === 'order' ? completeSentence : answer, detail, source, kind === 'choice' ? options : null);
      if (kind !== 'order') entry.prompt += ` · ตำแหน่ง: ${target.relation}`;
      entry.targetId = target.id;
      entry.subskill = kind === 'order' ? 'local-preposition-sentence-order' : 'local-preposition-choice';
      entry.assistance = kind === 'choice' ? 'three-preposition-options-and-location-cue' : kind === 'cloze' ? 'location-cue' : 'location-cue-and-supplied-words';
      entry.difficultyRationale = kind === 'choice' ? 'เลือกจากสามคำโดยมีความสัมพันธ์เชิงตำแหน่งบอกไว้' : kind === 'cloze' ? 'ดึงคำบุพบทจากความหมายโดยไม่มีตัวเลือก' : 'จัดคำที่ให้เป็นประโยคเต็มและคงลำดับคำภาษาเยอรมัน';
      return entry;
    }));
    const dativeRows = [
      { targetId: 'L14-G010', form: 'dem', skill: 'wo-dativ-definite-masculine', source: 'A13-KB-L14-4b', nouns: ['Park', 'Bahnhof', 'Markt', 'Spielplatz', 'Fluss', 'Garten', 'Brunnen', 'Laden'] },
      { targetId: 'L14-G011', form: 'einem', skill: 'wo-dativ-indefinite-masculine', source: 'A13-KB-L14-4b', nouns: ['Fluss', 'Park', 'Laden', 'Garten', 'Bahnhof', 'Markt', 'Spielplatz', 'Brunnen'] },
      { targetId: 'L14-G012', form: 'der', skill: 'wo-dativ-feminine', source: 'A13-KB-L14-4b', nouns: ['Post', 'Bank', 'Schule', 'Kirche', 'Apotheke', 'Ampel', 'Brücke', 'Bibliothek'] },
      { targetId: 'L14-G013', form: 'den', skill: 'wo-dativ-plural-article', source: 'A13-KB-L14-4b', nouns: ['Häusern', 'Bäumen', 'Läden', 'Museen', 'Kirchen', 'Straßen', 'Städten', 'Brücken'] },
      { targetId: 'L14-G014', form: 'im', skill: 'wo-dativ-contraction-in-dem', source: 'A13-KB-L14-4b', nouns: ['Kino', 'Museum', 'Rathaus', 'Haus', 'Hotel', 'Café', 'Zentrum'] },
      { targetId: 'L14-G015', form: 'am', skill: 'wo-dativ-contraction-an-dem', source: 'A13-KB-L14-4b', nouns: ['Bahnhof', 'Markt', 'Park', 'Brunnen', 'Fluss', 'Platz'] },
    ];
    const dativeExtras = dativeRows.flatMap((target, targetIndex) => target.nouns.map((noun, index) => {
      const kind = ['choice', 'cloze', 'choice', 'cloze', 'order'][index % 5];
      const number = 51 + targetIndex * 8 + index;
      const id = `A13-L14-WOD-${String(number).padStart(3, '0')}`;
      const prepositions = ['vor', 'neben', 'hinter'];
      const preposition = prepositions[(targetIndex + index) % prepositions.length];
      const sentence = target.targetId === 'L14-G013'
        ? `Der Brunnen steht ${preposition} ___ ${noun}.`
        : target.targetId === 'L14-G014' ? `Wir warten drinnen ___ ${noun}.`
          : target.targetId === 'L14-G015' ? `Die Frau steht draußen direkt ___ ${noun}.`
            : `Das Café ist ${preposition} ___ ${noun}.`;
      const answer = target.targetId === 'L14-G013' ? 'den' : target.form;
      const options = target.targetId === 'L14-G013' ? ['den', 'dem', 'der']
        : target.targetId === 'L14-G012' ? ['der', 'dem', 'den']
          : target.targetId === 'L14-G011' ? ['einem', 'einen', 'einer']
            : target.targetId === 'L14-G014' ? ['im', 'am', 'in der']
              : target.targetId === 'L14-G015' ? ['am', 'im', 'an der'] : ['dem', 'den', 'der'];
      const detail = {
        hint: target.targetId === 'L14-G013' ? 'Wo? ถามตำแหน่งคงที่ ใช้ Dativ; ในพหูพจน์ใช้ den และคำนามหลายคำเติม -n' : target.targetId === 'L14-G014' ? 'in dem ย่อเป็น im เมื่อบอกตำแหน่งคงที่กับคำนามเพศชายหรือกลาง' : target.targetId === 'L14-G015' ? 'an dem ย่อเป็น am เมื่อบอกตำแหน่งคงที่กับคำนามเพศชาย' : `ดูเพศของ ${noun} แล้วใช้รูป Dativ หลังคำบุพบทบอกตำแหน่ง`,
        explanation: target.targetId === 'L14-G013' ? `Häusern เป็นพหูพจน์ใน Dativ: die Häuser เปลี่ยนเป็น den Häusern. คำนามหลายคำเติม -n ใน Dativ พหูพจน์ด้วย` : target.targetId === 'L14-G014' ? `คำนาม ${noun} เป็นเพศกลาง; in dem จึงย่อเป็น im: im ${noun}.` : target.targetId === 'L14-G015' ? `${noun} เป็นคำนามเพศชาย; an dem จึงย่อเป็น am: am ${noun}.` : `${noun} อยู่ใน Dativ หลังคำบอกตำแหน่ง; รูป Artikel ที่ตรงกับ target นี้คือ ${answer}.`,
        error: 'case',
      };
      const phraseAnswer = target.targetId === 'L14-G013' ? 'den' : answer;
      const completeSentence = sentence.replace('___', phraseAnswer);
      const entry = question('L14', 'wo-dativ', number, kind, kind === 'order' ? completeSentence : sentence, kind === 'order' ? completeSentence : phraseAnswer, detail, target.source, kind === 'choice' ? options : null);
      entry.id = id;
      entry.targetId = target.targetId;
      entry.subskill = kind === 'order' ? `${target.skill}-sentence-order` : target.skill;
      entry.assistance = kind === 'choice' ? 'three-article-options-and-noun' : kind === 'cloze' ? 'noun-and-location-preposition' : 'supplied-words-and-noun';
      entry.difficultyRationale = kind === 'choice' ? 'เลือกกรณีและรูป Artikel โดยมีตัวเลือก' : kind === 'cloze' ? 'ดึงรูป Artikel จากเพศ/จำนวนของคำนามและ Dativ' : 'สร้างประโยคตำแหน่งเต็มโดยรักษา Artikel Dativ';
      return entry;
    }));
    const replacementRows = [
      { number: 99, targetId: 'L14-G010', kind: 'choice', sentence: 'Der Bus hält vor ___ Bahnhof.', answer: 'dem', options: ['dem', 'den', 'der'], subskill: 'wo-dativ-definite-masculine' },
      { number: 100, targetId: 'L14-G010', kind: 'cloze', sentence: 'Die Kinder warten neben ___ Park.', answer: 'dem', options: null, subskill: 'wo-dativ-definite-masculine' },
    ];
    const replacements = replacementRows.map(({ number, targetId, kind, sentence, answer, options, subskill }) => {
      const entry = question('L14', 'wo-dativ', number, kind, sentence, answer, {
        hint: 'der Bahnhof และ der Park เป็นคำนามเพศชาย; หลังคำบุพบทบอกตำแหน่งใช้ Dativ',
        explanation: 'คำนามเพศชายหลังคำบุพบทบอกตำแหน่งใช้ Dativ: der เปลี่ยนเป็น dem.',
        error: 'case',
      }, 'A13-KB-L14-4b', options);
      entry.id = `A13-L14-WOD-${number}`;
      entry.targetId = targetId;
      entry.subskill = subskill;
      entry.assistance = kind === 'choice' ? 'three-article-options-and-noun' : 'noun-and-location-preposition';
      entry.difficultyRationale = kind === 'choice' ? 'เลือก Dativ Artikel ของคำนามเพศชายจากตัวเลือก' : 'ดึง Dativ Artikel ของคำนามเพศชายโดยไม่มีตัวเลือก';
      return entry;
    });
    questions.push(...positionExtras, ...dativeExtras, ...replacements);
    const outOfTargetLegacyIds = new Set(['A13-L14-WO-DATIV-001', 'A13-L14-WO-DATIV-005']);
    historicalQuestions = questions.filter(entry => outOfTargetLegacyIds.has(entry.id));
    for (let index = questions.length - 1; index >= 0; index--) {
      if (outOfTargetLegacyIds.has(questions[index].id)) questions.splice(index, 1);
    }
    const positionTargetByWord = Object.fromEntries(positionTargets.map(target => [target.word, target.id]));
    for (const entry of questions) {
      if (!entry.targetId && entry.topicId === 'L14-lokale-praepositionen') {
        const answerText = entry.acceptedAnswers[0];
        const match = positionTargets.find(target => new RegExp(`\\b${target.word}\\b`, 'u').test(answerText));
        entry.targetId = positionTargetByWord[answerText] ?? match?.id ?? 'L14-G001';
      } else if (!entry.targetId && entry.topicId === 'L14-wo-dativ') {
        const answerText = entry.acceptedAnswers[0];
        entry.targetId = answerText === 'einem' ? 'L14-G011' : answerText === 'der' ? 'L14-G012' : answerText === 'den' || /\bden Häusern\b/u.test(answerText) ? 'L14-G013' : answerText === 'im' || /\bim\b/u.test(answerText) ? 'L14-G014' : answerText === 'am' || /\bam\b/u.test(answerText) ? 'L14-G015' : 'L14-G010';
      }
      entry.assistance ??= entry.kind === 'choice' ? 'answer-options-and-context' : entry.kind === 'cloze' ? 'context-clue' : 'supplied-words';
      entry.difficultyRationale ??= entry.kind === 'choice' ? 'เลือกคำตอบจากตัวเลือกในบริบท' : entry.kind === 'cloze' ? 'ดึงรูปคำจากบริบทโดยไม่มีตัวเลือก' : 'เรียงคำที่ให้เป็นประโยคสมบูรณ์';
    }
    if (questions.length !== 100) throw new Error(`L14 grammar must have 100 scored definitions, got ${questions.length}`);
  }
  const bindings = questions.map(({ id, _sourceActivityId, targetId, subskill, difficulty, assistance, difficultyRationale }) => ({
    questionId: id, ...(targetId ? { targetId } : {}), subskill, difficulty, ...(assistance ? { assistance } : {}), ...(difficultyRationale ? { difficultyRationale } : {}), authorship: 'newly_authored', contentBasis: [_sourceActivityId], exerciseBasis: [_sourceActivityId],
  }));
  const publicQuestions = questions.map(({ _sourceActivityId, ...entry }) => entry);
  const bank = {
    id: `${spec.lesson.toLowerCase()}-grammar-review-v1`, lessonId: spec.lesson,
    title: spec.title, description: 'ฝึกไวยากรณ์ตามหัวข้อของบท',
    summaryNote: spec.lesson === 'L14' ? 'ผลรอบนี้บันทึกในบัญชี แต่ยังไม่รวมในความก้าวหน้าหลัก' : 'ผลรอบนี้เป็นชุดทดลอง และยังไม่รวมในความก้าวหน้าหลัก',
    storageKey: `deutsch-trainer:review-prototype:${spec.lesson.toLowerCase()}-grammar:v1`,
    defaultCount: spec.topics.length * (spec.lesson === 'L14' ? 5 : 3),
    ...(spec.lesson === 'L14' ? { requireLearned: true, learnHref: '/learn/L14/grammar', learnLabel: 'ไปเรียนไวยากรณ์' } : {}),
    skillLabels: Object.fromEntries(orderedTopics.flatMap(topic => ['choice','cloze','order'].map(kind => [`${topic.id}-${kind}`, `${topic.title} · ${kind === 'choice' ? 'เลือกคำ' : kind === 'cloze' ? 'พิมพ์คำ' : 'เรียงคำ'}`]))),
    sections: orderedTopics.map(topic => ({ topicId: `${spec.lesson}-${topic.id}`, title: topic.title, count: spec.lesson === 'L14' ? 5 : 3 })),
    questions: publicQuestions,
  };
  await writePreview(spec.lesson, 'grammar', bank);
  if (spec.lesson === 'L14') await writePreview(spec.lesson, 'grammar-daily', {
    ...bank, id: 'l14-grammar-daily-v1', title: 'ฝึกไวยากรณ์ต่อวันนี้', defaultCount: 10,
    storageKey: 'deutsch-trainer:review-prototype:l14-grammar-daily:v1',
    sections: undefined, workflow: 'daily',
  });
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
    schemaVersion: 1, status: spec.lesson === 'L14' ? 'learner_practice_active' : 'review_prototype_not_published', reviewScope: 'Author review; independent educator review pending', ...bank,
    ...(historicalQuestions.length ? { historicalQuestions: historicalQuestions.map(({ _sourceActivityId, ...entry }) => entry) } : {}),
  }, null, 2) + '\n');
  await writeFile(new URL(`docs/exercise-mapping/${spec.lesson.toLowerCase()}-grammar-provenance.json`, root), JSON.stringify({
    schemaVersion: 1, status: 'source_layout_review_pending_where_ocr_preliminary', bindings,
  }, null, 2) + '\n');
}
