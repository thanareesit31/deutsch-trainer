import { readFile, writeFile } from 'node:fs/promises';

const root = new URL('../../docs/exercise-mapping/', import.meta.url);
const feedback = JSON.parse(await readFile(new URL('practice-feedback.json', root), 'utf8'));
const formFeedback = JSON.parse(await readFile(new URL('l13-grammar-form-feedback.json', root), 'utf8'));
const reviewedAt = '2026-10-20';

function choice(id, sentence, options, answer, subskill, explanation, evidence) {
  return { id, version: 2, kind: 'choice', prompt: 'เลือกคำที่ทำให้ประโยคถูกต้อง', sentence,
    options, acceptedAnswers: [answer], subskill, difficulty: 1, builtInSupport: 'answer_options',
    hint: subskill.startsWith('es_gibt') ? 'ดูจำนวนและเพศของคำนาม แล้วเลือกรูปคำหลัง es gibt' : 'ดูประธานของกริยาและความหมายของประโยค',
    explanation, knownErrors: Object.fromEntries(options.filter((option) => option !== answer).map((option) => [option, subskill.startsWith('es_gibt') ? 'article_or_number_form' : 'verb_form'])), evidence };
}
function cloze(id, prompt, sentence, answer, subskill, explanation, evidence) {
  return { id, version: 2, kind: 'cloze', prompt, sentence, acceptedAnswers: [answer],
    subskill, difficulty: 2, builtInSupport: 'grammar_prompt',
    hint: subskill.startsWith('es_gibt') ? 'หลัง es gibt ใช้ Akkusativ; เพศชายเอกพจน์เปลี่ยนเป็น -en' : 'ผันกริยาตามประธานที่เห็นในประโยค',
    explanation, knownErrors: {}, evidence };
}
function order(id, prompt, tokens, answer, subskill, explanation, evidence) {
  return { id, version: 2, kind: 'order', prompt, tokens, acceptedAnswers: [answer],
    subskill, difficulty: 2, builtInSupport: 'supplied_tokens',
    hint: 'เริ่มจากคำต้นประโยค แล้ววางกริยาที่ผันในตำแหน่งที่สอง; คำถามแบบใช่/ไม่ใช่เริ่มด้วยกริยา',
    explanation, knownErrors: {}, evidence };
}

const esGibtQuestions = [
  choice('A13-L13-ESG-001','In meiner Straße gibt es ___ Park.',['einen','ein','eine'],'einen','es_gibt_article','Park เป็นเพศชายเอกพจน์ หลัง es gibt จึงใช้ Akkusativ einen',['KB13-4','AB13-4A-3','GT28-CASE']),
  choice('A13-L13-ESG-002','In unserem Viertel gibt es ___ Apotheke.',['eine','einen','ein'],'eine','es_gibt_article','Apotheke เป็นเพศหญิง รูป Akkusativ ของ ein คือ eine',['KB13-4','AB13-4C-2']),
  choice('A13-L13-ESG-003','In diesem Ort gibt es ___ Rathaus.',['ein','eine','einen'],'ein','es_gibt_article','Rathaus เป็นเพศกลาง รูป Akkusativ ยังคงเป็น ein',['KB13-4','AB13-4A-2']),
  choice('A13-L13-ESG-004','Auf dem Platz gibt es ___ Cafés.',['viele','viel','einen'],'viele','es_gibt_plural','Cafés เป็นพหูพจน์ จึงใช้ viele',['KB13-4','AB13-4C-1']),
  choice('A13-L13-ESG-005','Hier gibt es ___ Hafen. Wir fahren deshalb zum Hafen im Nachbarort.',['keinen','kein','keine'],'keinen','es_gibt_negation','Hafen เป็นเพศชายเอกพจน์ ในประโยคปฏิเสธหลัง es gibt ใช้ keinen',['KB13-4','AB13-4A-3']),
  cloze('A13-L13-ESG-006','เติมรูปของ ein','In unserer Stadt gibt es ___ Zoo.','einen','es_gibt_article','Zoo เป็นเพศชายเอกพจน์ หลัง es gibt ต้องใช้ einen',['KB13-4','AB13-4C-3']),
  cloze('A13-L13-ESG-007','เติมรูปของ ein','Neben dem Bahnhof gibt es ___ Kino.','ein','es_gibt_article','Kino เป็นเพศกลาง รูป Akkusativ คือ ein',['KB13-4','GT28-CASE']),
  cloze('A13-L13-ESG-008','เติมรูปของ ein','Am Marktplatz gibt es ___ Kirche.','eine','es_gibt_article','Kirche เป็นเพศหญิง รูป Akkusativ คือ eine',['KB13-4','AB13-4A-4']),
  cloze('A13-L13-ESG-009','เติมรูปของ kein','In diesem Dorf gibt es ___ Museum. Das nächste Museum ist in der Stadt.','kein','es_gibt_negation','Museum เป็นเพศกลาง จึงใช้ kein หลัง es gibt',['KB13-4','AB13-4C-6']),
  cloze('A13-L13-ESG-010','เติมรูปของ kein','Hier gibt es ___ See. Zum Schwimmen fahren wir in den Nachbarort.','keinen','es_gibt_negation','See เป็นเพศชายเอกพจน์ จึงใช้ keinen หลัง es gibt',['KB13-4','AB13-4C-9']),
  cloze('A13-L13-ESG-011','เติมรูปของ kein','In unserem Ort gibt es ___ Spielplätze. Die Kinder fahren in den Nachbarort.','keine','es_gibt_negation','Spielplätze เป็นพหูพจน์ จึงใช้ keine',['KB13-4','AB13-4C-7']),
  cloze('A13-L13-ESG-012','เติมรูปของ viel','In der Innenstadt gibt es ___ Geschäfte.','viele','es_gibt_plural','Geschäfte เป็นพหูพจน์ จึงใช้ viele',['KB13-4','AB13-4C-1']),
  cloze('A13-L13-ESG-013','เติมรูปของ ein','Gibt es hier ___ Bushaltestelle?','eine','es_gibt_question','Bushaltestelle เป็นเพศหญิง ในคำถาม es gibt ก็ใช้ Akkusativ: eine',['KB13-6A','AB13-4C-2']),
  order('A13-L13-ESG-014','เรียงประโยค โดยเริ่มด้วย In der Altstadt',['In der Altstadt','gibt','es','ein Museum'],'In der Altstadt gibt es ein Museum','es_gibt_word_order','เมื่อขึ้นต้นด้วยสถานที่ กริยา gibt อยู่ตำแหน่งที่สอง ตามด้วย es',['KB13-4','KB13-6B']),
  order('A13-L13-ESG-015','เรียงคำให้เป็นคำถาม',['Gibt','es','hier','einen Park'],'Gibt es hier einen Park','es_gibt_question','คำถามแบบใช่/ไม่ใช่เริ่มด้วย Gibt ตามด้วย es; Park เป็นเพศชายจึงใช้ einen',['KB13-6C','KB13-4']),
];

const verbsQuestions = [
  choice('A13-L13-VRB-001','Die Musik ___ mir.',['gefällt','gefallen','gefällst'],'gefällt','verb_conjugation','Die Musik เป็นเอกพจน์ จึงใช้ gefällt',['KB13-5A','AB13-6-B']),
  choice('A13-L13-VRB-002','Die Museen ___ uns.',['gefallen','gefällt','gefallt'],'gefallen','verb_conjugation','Die Museen เป็นพหูพจน์ จึงใช้ gefallen',['KB13-5A','AB13-6-B']),
  choice('A13-L13-VRB-003','Das Fahrrad ___ meinem Bruder.',['gehört','gehören','gehörst'],'gehört','verb_conjugation','Das Fahrrad เป็นเอกพจน์ จึงใช้ gehört',['KB13-5A','AB13-6-A']),
  choice('A13-L13-VRB-004','Ich ___ dir für deine Hilfe.',['danke','dankst','dankt'],'danke','verb_conjugation','ประธาน ich ใช้รูป danke',['KB13-5A','AB13-6-C']),
  choice('A13-L13-VRB-005','Er ___ das Museum interessant.',['findet','finden','findest'],'findet','verb_conjugation','ประธาน er ใช้รูป findet; finden ใช้กรรม Akkusativ',['KB13-3C','GT28-CASE']),
  cloze('A13-L13-VRB-006','เติมรูปของ helfen','Wir ___ den Kindern.','helfen','verb_conjugation','ประธาน wir ใช้ helfen; den Kindern เป็นผู้รับความช่วยเหลือ',['KB13-5A','AB13-6-D']),
  cloze('A13-L13-VRB-007','เติมรูปของ helfen','Du ___ deiner Schwester.','hilfst','verb_conjugation','helfen เปลี่ยนสระ e เป็น i ในรูป du: hilfst',['KB13-5A','AB13-6-D']),
  cloze('A13-L13-VRB-008','เติมรูปของ helfen','Ihr ___ den Gästen.','helft','verb_conjugation','ประธาน ihr ใช้ helft',['KB13-5A','AB13-6-D']),
  cloze('A13-L13-VRB-009','เติมรูปของ besuchen','Frau Meier ___ die Stadt.','besucht','verb_conjugation','Frau Meier เป็นเอกพจน์บุรุษที่สาม ใช้ besucht',['KB13-3C','GT28-CASE']),
  cloze('A13-L13-VRB-010','เติมรูปของ gehören','Die Jacke ___ meiner Freundin.','gehört','verb_conjugation','Die Jacke เป็นเอกพจน์ จึงใช้ gehört; ผู้เป็นเจ้าของอยู่ในรูป Dativ',['KB13-5A','AB13-6-A']),
  cloze('A13-L13-VRB-011','เติมรูปของ gefallen','Die Parks ___ den Touristen.','gefallen','verb_conjugation','Die Parks เป็นพหูพจน์ จึงใช้ gefallen',['KB13-5A','AB13-6-B']),
  cloze('A13-L13-VRB-012','เติมรูปของ finden','Du ___ den Zoo schön.','findest','verb_conjugation','ประธาน du ใช้ findest',['KB13-3C','GT28-CASE']),
  cloze('A13-L13-VRB-013','เติมรูปของ danken','Wir ___ dir.','danken','verb_conjugation','ประธาน wir ใช้ danken; ผู้รับคำขอบคุณอยู่ในรูป Dativ',['KB13-5A','AB13-6-C']),
  order('A13-L13-VRB-014','Wir finden den Brunnen schön. เรียงประโยคใหม่โดยใช้ gefallen',['Der Brunnen','gefällt','uns'],'Der Brunnen gefällt uns','verb_sentence_transform','Der Brunnen เป็นประธานเอกพจน์ จึงใช้ gefällt และผู้ที่ชอบคือ wir → uns',['KB13-12-GA','AB13-8B']),
  order('A13-L13-VRB-015','เรียงคำเป็นประโยคขอบคุณ',['Ich','danke','dir'],'Ich danke dir','verb_word_order','ประธาน Ich อยู่ต้นประโยค ตามด้วย danke แล้วจึงเป็น dir',['KB13-5A','AB13-6-C']),
];

const specs = [
  { slug: 'es-gibt', id: 'l13-es-gibt-pilot-v1', title: 'Es gibt + Akkusativ', topicId: 'L13-es-gibt-akkusativ',
    description: 'ฝึก ein, kein และ viele หลัง es gibt ในประโยคบอกเล่า ปฏิเสธ และคำถาม',
    summaryNote: 'ข้อเลือกคำและเรียงคำมีตัวช่วย จึงแยกผลจากข้อที่ต้องพิมพ์รูปคำเอง',
    skillLabels: { es_gibt_article: 'คำนำหน้านามหลัง es gibt', es_gibt_plural: 'รูปพหูพจน์', es_gibt_negation: 'การปฏิเสธ', es_gibt_question: 'คำถาม', es_gibt_word_order: 'ลำดับคำ' },
    questions: esGibtQuestions },
  { slug: 'verbs', id: 'l13-verbs-pilot-v1', title: 'Verben', topicId: 'L13-verben-mit-dativ',
    description: 'ฝึกผันกริยาที่ใช้ในบทนี้ และวางกริยาในประโยคสั้น',
    summaryNote: 'ข้อเรียงคำมีคำให้แล้ว จึงไม่เท่ากับการเขียนประโยคเอง',
    skillLabels: { verb_conjugation: 'ผันกริยาตามประธาน', verb_sentence_transform: 'เปลี่ยนรูปประโยค', verb_word_order: 'ลำดับคำ' },
    questions: verbsQuestions },
];

for (const spec of specs) {
  const bank = {
    schemaVersion: 1, id: spec.id, status: 'review_prototype_not_published', title: spec.title,
    lessonId: 'L13', topicId: spec.topicId, authorship: 'newly_authored', reviewedAt,
    reviewScope: 'Author grammar and answer review; no independent educator review or publisher answer-key check.',
    defaultCount: 5, countOptions: [5, 10, 'all'], description: spec.description,
    summaryNote: spec.summaryNote, skillLabels: spec.skillLabels,
    storageKey: `deutsch-trainer:review-prototype:l13-${spec.slug}:v1`,
    questions: spec.questions.map(({ evidence, ...question }) => ({ ...question, explanation: feedback.explanations[question.id], ...formFeedback[question.id], topicId: spec.topicId, requiredLearnedTopics: [spec.topicId], variantGroup: question.id.toLowerCase() })),
  };
  const provenance = { schemaVersion: 1, reviewedAt, bindings: spec.questions.map((question) => ({
    questionId: question.id, contentBasis: question.evidence.filter((id) => id.startsWith('KB13-')),
    exerciseBasis: question.evidence.filter((id) => !id.startsWith('KB13-')),
    relationship: 'newly_authored_from_topic_and_mechanic', authorship: 'newly_authored',
    note: 'German prompt and Thai feedback are newly authored; source entries support topic or exercise mechanic only.',
  })) };
  await writeFile(new URL(`l13-${spec.slug}-bank.json`, root), JSON.stringify(bank, null, 2) + '\n');
  await writeFile(new URL(`l13-${spec.slug}-provenance.json`, root), JSON.stringify(provenance, null, 2) + '\n');
}

const kb = (id, page, activity, mechanic, decision, note) => ({ id, sourceId: 'MOMENTE_A1_2_KB', printedPage: page, pdfPage: page, originalActivityId: activity, mechanic, decision, note });
const ab = (id, printedPage, pdfPage, activity, mechanic, decision, note) => ({ id, sourceId: 'MOMENTE_A1_2_AB', printedPage, pdfPage, originalActivityId: activity, mechanic, decision, note });
const gt = (id, page, activity, mechanic, decision, note) => ({ id, sourceId: 'GRAMMATIK_A1_DAS_TRAINING', printedPage: page, pdfPage: page, originalActivityId: activity, mechanic, decision, note });
const sourceItems = [
  kb('KB13-3C',11,'3c','spoken_opinion','adjacent_skill','finden with Akkusativ is review, not the new Dativ verb pattern.'),
  kb('KB13-4',11,'4','spoken_place_description','in_scope','Rule box explicitly gives es gibt + Akkusativ across masculine, neuter, feminine and plural.'),
  kb('KB13-5A',11,'5a','referent_arrows_and_pronoun_table','in_scope','gefallen, danken, helfen and gehören appear with Dativ pronouns; conjugation itself is not tested in 5a.'),
  kb('KB13-6A',11,'6a/3','guided_notes','partial','The prompt asks what exists at a favorite place; open response is not machine gradable without a rubric.'),
  kb('KB13-6B',12,'6b','guided_writing','mechanic_only','Model uses es gibt and evaluation expressions; newly authored web sentences are shorter and constrained.'),
  kb('KB13-6C',12,'6c','peer_question','mechanic_only','Question with Gibt es appears as a model; open partner exchange is beyond the pilot.'),
  kb('KB13-12-GA',12,'Schnelltest G/a','sentence_transformation','in_scope','Transforms finden opinion into gefallen sentence; web tokens are new.'),
  kb('KB13-12-GB',12,'Schnelltest G/b','sentence_transformation','in_scope','Transforms ownership statement into gehören sentence; web prompts are new.'),
  kb('KB13-12-GC',12,'Schnelltest G/c','sentence_transformation','in_scope','Transforms a thanks expression into danken sentence; web prompts are new.'),
  ab('AB13-1',6,5,'1','text_category_cloze','partial','es gibt occurs repeatedly, but exercise tests city vocabulary rather than article case.'),
  ab('AB13-4A-1',7,6,'4a/1','map_multiple_choice','mechanic_only','Selects negative plural with Bars; pilot has new context without book map.'),
  ab('AB13-4A-2',7,6,'4a/2','map_multiple_choice','mechanic_only','Selects ein/kein with Rathaus; pilot has new context.'),
  ab('AB13-4A-3',7,6,'4a/3','map_multiple_choice','mechanic_only','Selects einen/keinen with Park; pilot has new context.'),
  ab('AB13-4A-4',7,6,'4a/4','map_multiple_choice','mechanic_only','Selects eine/keine with Kirche; pilot has new context.'),
  ab('AB13-4B',7,6,'4b','article_pattern_table','in_scope','Sorts forms by gender, number and positive/negative count.'),
  ab('AB13-4C-1',7,6,'4c/example','text_cloze','worked_example','viele with plural Cafés is prefilled and not scored as a source question.'),
  ...[
    ['2','Kirche'],['3','Markt'],['4','Brunnen'],['5','Rathaus'],['6','Schloss'],
    ['7','Spielplätze'],['8','Tierpark'],['9','See'],['10','Schwimmbad'],
  ].map(([slot,noun]) => ab(`AB13-4C-${slot}`,7,6,`4c/${slot}`,'text_cloze','in_scope',`Single article or quantity blank before ${noun}; web sentence and answer are newly authored.`)),
  ...[['A','gehören'],['B','gefallen'],['C','danken'],['D','helfen']].map(([slot,verb]) =>
    ab(`AB13-6-${slot}`,8,7,`6/${slot}`,'picture_verb_cloze','in_scope',`Picture prompt asks for the correct form of ${verb}; pilot uses a new sentence without reproducing the picture.`)),
  ab('AB13-7A',8,7,'7a','verb_and_pronoun_marking','review_only','Recognition of Dativ verbs in a blog, not conjugation production.'),
  ab('AB13-8B',9,8,'8b','sentence_transformation','in_scope','Partner writes a response by changing finden to gefallen; web uses a new city object.'),
  gt('GT28-CASE',51,'28/rule table','case_reference','prerequisite_only','Masculine singular Akkusativ -en is a prerequisite, not an es gibt exercise.'),
  gt('GT28-2',51,'28/2','accusative_matching','mechanic_only','Matching verb complements does not directly practice es gibt.'),
  gt('GT32-RULE',57,'32/rule table','case_reference','prerequisite_only','Lists Dativ verbs and pronouns; does not test verb conjugation in this table.'),
];
await writeFile(new URL('l13-other-topics-source-items.json', root), JSON.stringify({
  schemaVersion: 1, scope: 'L13 Es gibt + Akkusativ and Verben pilot; inspected source activities and individual blanks',
  inspectedAt: reviewedAt, answerBasis: 'Visible book pages and grammar analysis; publisher answer keys not inspected.',
  sourceAvailability: 'Momente Kursbuch, Momente Arbeitsbuch and Grammatik A1 – das Training inspected. Grammatik aktiv PDF was not available in this workspace for this pass.',
  entries: sourceItems.map((item) => ({ ...item, inspectedAt: reviewedAt, method: 'visual_pdf', lesson: 'L13',
    prerequisites: item.id.startsWith('AB13-4') || item.id === 'AB13-1' || item.id === 'KB13-3C' || item.id === 'KB13-4' || item.id.startsWith('KB13-6') || item.id.startsWith('GT28')
      ? ['noun gender and plural', 'Akkusativ article forms']
      : ['Präsens conjugation', 'Dativ verb meaning'],
    webUse: 'newly_authored' })),
}, null, 2) + '\n');
