const topicEs = 'L13-es-gibt-akkusativ';
const topicDative = 'L13-dativ-pronomen';
const topicVerbs = 'L13-verben-mit-dativ';

function row(id, targetId, topicId, subskill, kind, sentence, answer, options, explanation, difficulty, assistance, sourceActivityId) {
  return {
    id, version: 1, targetId, topicId, requiredLearnedTopics: [topicId], variantGroup: `${targetId.toLowerCase()}-${subskill}`,
    kind, prompt: kind === 'choice' ? 'เลือกคำที่ทำให้ประโยคถูกต้อง' : kind === 'cloze' ? 'พิมพ์รูปคำที่ถูกต้อง' : 'แตะคำเพื่อเรียงประโยคให้ถูกต้อง',
    sentence, ...(options ? { options } : {}), ...(kind === 'order' ? { tokens: sentence.replace(/[.!?]$/u, '').split(' ') } : {}),
    acceptedAnswers: [answer], subskill, difficulty, assistance, difficultyRationale: difficulty === 1 ? 'มีตัวเลือกและระบุคำนาม/บริบทให้' : difficulty === 2 ? 'ต้องดึงรูปคำจากบริบทโดยไม่มีตัวเลือก' : 'ต้องจัดคำที่ให้เป็นประโยคและจัดลำดับโครงสร้างเอง',
    hint: explanation, explanation, knownErrors: Object.fromEntries((options ?? []).filter(option => option !== answer).map(option => [option, 'form_or_case'])),
    _sourceActivityId: sourceActivityId, authorship: 'newly_authored',
  };
}

const esGibt = [
  ['L13-G001','einen Park','einen','der Park เป็นเพศชาย; หลัง es gibt ใช้ Akkusativ จึงเป็น einen Park.'],
  ['L13-G002','eine Post','eine','die Post เป็นเพศหญิง; รูป Akkusativ ยังคงเป็น eine Post.'],
  ['L13-G003','ein Kino','ein','das Kino เป็นเพศกลาง; รูป Akkusativ ยังคงเป็น ein Kino.'],
  ['L13-G004','viele Kirchen','viele','Kirchen เป็นพหูพจน์ จึงใช้ viele.'],
  ['L13-G005','keinen Bahnhof','keinen','der Bahnhof เป็นเพศชาย; kein เปลี่ยนเป็น keinen ใน Akkusativ.'],
  ['L13-G006','keine Apotheke','keine','die Apotheke เป็นเพศหญิง; keine ใช้ได้ทั้ง Nominativ และ Akkusativ ในรูปนี้.'],
  ['L13-G007','kein Rathaus','kein','das Rathaus เป็นเพศกลาง; kein คงรูปเดิมใน Akkusativ.'],
  ['L13-G008','keine Spielplätze','keine','Spielplätze เป็นพหูพจน์; รูปปฏิเสธคือ keine Spielplätze.'],
];
const esQuestions = esGibt.flatMap(([targetId, phrase, answer, explanation], index) => {
  const noun = phrase.split(' ').at(-1);
  const sentence = `In der Stadt gibt es ___ ${noun}.`;
  const article = phrase.slice(0, phrase.length - noun.length).trim();
  const options = targetId === 'L13-G001' ? ['einen','ein','eine'] : targetId === 'L13-G005' ? ['keinen','kein','keine']
    : targetId === 'L13-G002' ? ['eine','einen','ein'] : targetId === 'L13-G006' ? ['keine','kein','keinen']
      : targetId === 'L13-G003' ? ['ein','einen','eine'] : targetId === 'L13-G007' ? ['kein','keinen','keine']
        : targetId === 'L13-G004' ? ['viele','einen','ein'] : ['keine','keinen','kein'];
  return [
    row(`A13-L13-ESX-${String(index * 2 + 1).padStart(3,'0')}`, targetId, topicEs, targetId === 'L13-G004' || targetId === 'L13-G008' ? 'es_gibt_plural' : targetId === 'L13-G005' || targetId === 'L13-G006' || targetId === 'L13-G007' || targetId === 'L13-G008' ? 'es_gibt_negation' : 'es_gibt_article', 'choice', sentence, article, options, explanation, 1, 'three-answer-options-and-noun-context', 'A13-KB-L13-4'),
    row(`A13-L13-ESX-${String(index * 2 + 2).padStart(3,'0')}`, targetId, topicEs, targetId === 'L13-G004' || targetId === 'L13-G008' ? 'es_gibt_plural' : targetId === 'L13-G005' || targetId === 'L13-G006' || targetId === 'L13-G007' || targetId === 'L13-G008' ? 'es_gibt_negation' : 'es_gibt_article', 'cloze', sentence, article, null, explanation, 2, 'noun-supplied-no-answer-options', 'A13-KB-L13-4'),
  ];
}).flat();

const pronouns = [
  ['L13-G009','mir','Der Park gefällt ___. (ich)','mir','mich','ich'],
  ['L13-G010','dir','Das Kino gefällt ___. (du)','dir','dich','du'],
  ['L13-G011','ihm','Der Markt gehört ___. (er)','ihm','ihn','er'],
  ['L13-G012','ihm','Das Fahrrad gehört ___. (es / das Kind)','ihm','ihn','es'],
  ['L13-G013','ihr','Die Post gefällt ___. (sie)','ihr','sie','ihr'],
  ['L13-G014','uns','Die Museen gefallen ___. (wir)','uns','wir','unser'],
  ['L13-G015','euch','Der Park gefällt ___. (ihr)','euch','ihr','euer'],
  ['L13-G016','ihnen','Die Stadt gehört ___. (sie, Pl.)','ihnen','sie','ihrer'],
  ['L13-G017','Ihnen','Die Bank gehört ___. (Sie)','Ihnen','Sie','Ihr'],
];
const pronounQuestions = pronouns.flatMap(([targetId, answer, sentence, , wrong1, wrong2], index) => {
  const options = [answer, wrong1, wrong2];
  return [
    row(`A13-L13-DATX-${String(index * 2 + 1).padStart(3,'0')}`, targetId, topicDative, 'recognize_dative_pronoun', 'choice', sentence, answer, options, `${sentence.match(/\((.+)\)/u)?.[1] ?? 'บุคคลในวงเล็บ'} เปลี่ยนเป็นรูป Dativ ${answer} ในประโยคนี้.`, 1, 'pronoun-cue-and-three-options', 'A13-KB-L13-5a'),
    row(`A13-L13-DATX-${String(index * 2 + 2).padStart(3,'0')}`, targetId, topicDative, 'produce_dative_form', 'cloze', sentence, answer, null, `รูป Dativ ของประธาน/บุคคลที่ระบุคือ ${answer}.`, 2, 'person-cue-no-answer-options', 'A13-KB-L13-5a'),
  ];
}).flat();

const verbRows = [
  ['L13-G018','Der Park gefällt ___. (ich)','mir',['mir','mich','ich'],'gefallen ใช้ Dativ กับผู้ที่รู้สึกชอบ.'],
  ['L13-G019','Die Karte gehört ___. (du)','dir',['dir','dich','du'],'gehören ใช้ Dativ กับเจ้าของ.'],
  ['L13-G020','Wir helfen ___. (ihr)','euch',['euch','ihr','euer'],'helfen ใช้ Dativ กับผู้ได้รับความช่วยเหลือ.'],
  ['L13-G021','Ich danke ___. (Sie)','Ihnen',['Ihnen','Sie','Ihr'],'danken ใช้ Dativ กับผู้ที่ได้รับคำขอบคุณ.'],
];
const verbQuestions = verbRows.flatMap(([targetId, sentence, answer, options, explanation], index) => [
  row(`A13-L13-VRBX-${String(index * 3 + 1).padStart(3,'0')}`, targetId, topicVerbs, targetId === 'L13-G022' ? 'verb_conjugation' : 'verb_with_dative', 'choice', sentence, answer, options, explanation, 1, 'three-answer-options-and-subject-cue', 'A13-KB-L13-5a'),
  row(`A13-L13-VRBX-${String(index * 3 + 2).padStart(3,'0')}`, targetId, topicVerbs, targetId === 'L13-G022' ? 'verb_conjugation' : 'verb_with_dative', 'cloze', sentence, answer, null, explanation, 2, 'context-cue-no-answer-options', 'A13-KB-L13-5a'),
  row(`A13-L13-VRBX-${String(index * 3 + 3).padStart(3,'0')}`, targetId, topicVerbs, 'verb_sentence_order', 'order', sentence.replace('___', answer), sentence.replace('___', answer), null, explanation, 3, 'supplied-word-tiles', 'A13-KB-L13-5a'),
]);

const extraVerbs = [
  row('A13-L13-VRBX-016','L13-G018',topicVerbs,'verb_with_dative','choice','Die Fotos gefallen ___. (wir)','uns',['uns','wir','unser'],'gefallen nutzt Dativ; die Dativform von wir ist uns.',1,'three-answer-options-and-person-cue','A13-KB-L13-5a'),
  row('A13-L13-VRBX-017','L13-G019',topicVerbs,'verb_with_dative','cloze','Das Rathaus gehört ___. (die Stadt)','ihr',null,'Die Stadt wird durch das Dativpronomen ihr vertreten.',2,'owner-cue-no-answer-options','A13-KB-L13-5a'),
  row('A13-L13-VRBX-018','L13-G020',topicVerbs,'verb_with_dative','choice','Die Nachbarn helfen ___. (wir)','uns',['uns','wir','unser'],'helfen ใช้ Dativ; รูปของ wir คือ uns.',1,'three-answer-options-and-person-cue','A13-KB-L13-5a'),
  row('A13-L13-VRBX-019','L13-G021',topicVerbs,'verb_with_dative','cloze','Die Touristen danken ___. (Sie)','Ihnen',null,'danken ใช้ Dativ; Sie รูปสุภาพเปลี่ยนเป็น Ihnen.',2,'formal-person-cue-no-answer-options','A13-KB-L13-5a'),
  row('A13-L13-VRBX-020','L13-G018',topicVerbs,'verb_conjugation','choice','Der Park und die Museen ___ den Touristen.','gefallen',['gefallen','gefällt','gefallt'],'ประธานรวม Der Park und die Museen เป็นพหูพจน์ จึงใช้ gefallen; ผู้ที่รู้สึกชอบอยู่ใน Dativ.',1,'three-verb-options-and-subject-cue','A13-KB-L13-5a'),
  row('A13-L13-VRBX-021','L13-G018',topicVerbs,'verb_with_dative','cloze','Die Stadt gefällt ___. (ihr)','euch',null,'ผู้ที่รู้สึกชอบเป็น Dativ; รูปของ ihr คือ euch.',2,'person-cue-no-answer-options','A13-KB-L13-5a'),
  row('A13-L13-VRBX-022','L13-G022',topicVerbs,'identify_subject','choice','In „Die Museen gefallen uns.“: Wer gefällt uns?','Die Museen',['Die Museen','uns','gefallen'],'Die Museen เป็นประธานพหูพจน์; uns เป็นผู้ที่รู้สึกชอบในรูป Dativ.',1,'complete-sentence-and-three-options','A13-KB-L13-5a'),
  row('A13-L13-VRBX-023','L13-G022',topicVerbs,'identify_subject','choice','In „Der Brunnen gefällt uns.“: Was gefällt uns?','Der Brunnen',['Der Brunnen','uns','gefällt'],'Der Brunnen เป็นประธานที่ทำให้กริยา gefällt ผันเอกพจน์; uns เป็น Dativ.',2,'complete-sentence-no-highlight','A13-KB-L13-5a'),
  row('A13-L13-VRBX-024','L13-G022',topicVerbs,'identify_subject','cloze','In „Die Parks gefallen den Touristen.“: Subjekt = ___','Die Parks',null,'Die Parks คือประธานพหูพจน์; den Touristen เป็น Dativ.',3,'sentence-context-no-answer-options','A13-KB-L13-5a'),
  row('A13-L13-VRBX-028','L13-G019',topicVerbs,'verb_with_dative','choice','Die Post gehört ___. (die Frau)','ihr',['ihr','sie','ihre'],'gehören เชื่อมเจ้าของในรูป Dativ; die Frau แทนด้วย ihr.',1,'owner-cue-and-three-options','A13-KB-L13-5a'),
  row('A13-L13-VRBX-029','L13-G020',topicVerbs,'verb_with_dative','cloze','Der Tourist braucht Hilfe. Wir helfen ___. (er)','ihm',null,'ผู้ได้รับความช่วยเหลือเป็น Dativ; er เปลี่ยนเป็น ihm.',2,'person-cue-no-answer-options','A13-KB-L13-5a'),
  row('A13-L13-VRBX-030','L13-G021',topicVerbs,'verb_with_dative','choice','Die Nachbarin hat geholfen. Ich danke ___. (sie)','ihr',['ihr','sie','ihre'],'danken ใช้ Dativ; sie เอกพจน์เปลี่ยนเป็น ihr.',1,'person-cue-and-three-options','A13-KB-L13-5a'),
];

const questions = [...esQuestions, ...pronounQuestions, ...verbQuestions.flat(), ...extraVerbs];
if (questions.length !== 58 || new Set(questions.map(q => q.id)).size !== 58) throw new Error(`Expected 58 unique L13 grammar variants, got ${questions.length}`);
export { questions as l13GrammarVariants };
