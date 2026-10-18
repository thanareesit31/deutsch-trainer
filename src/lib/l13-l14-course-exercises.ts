import { arbeitsbuchPracticeSets } from "./l13-l14-arbeitsbuch-exercises";
import { supplementalPracticeSets } from "./l13-l14-supplemental-exercises";
import { allCourseExercisePatterns, type CourseCategory, type CourseLessonId, type CourseQuestion, type CoursePatternId, type SourceRef } from "./l13-l14-course";

export type PracticeSet = {
  id: string;
  lessonId: CourseLessonId;
  category: CourseCategory;
  patternId: CoursePatternId;
  title: string;
  difficulty: 1 | 2 | 3 | 4;
  primaryCompetency: string;
  secondaryCompetencies?: readonly string[];
  builtInSupport?: boolean;
  learningStage?: "recognition" | "guided_recall" | "controlled_production" | "independent_recall" | "contextual_application";
  topicIds: readonly string[];
  questions: readonly CourseQuestion[];
  sourceRefs: readonly SourceRef[];
  isOriginalPractice: true;
};
type PracticeSetDraft = Omit<PracticeSet, "sourceRefs" | "isOriginalPractice">;

const mc = (id: string, prompt: string, choices: readonly [string, string, string], answer: number, hint: string, explanation: string): CourseQuestion => ({
  id, kind: "multiple_choice", prompt,
  options: choices.map((text, i) => ({ id: `${id}-${i}`, text })),
  answerId: `${id}-${answer}`, hint, explanation,
});
const cloze = (id: string, prompt: string, sentence: string, answer: string, hint: string, explanation: string): CourseQuestion => ({
  id, kind: "cloze", prompt, sentence, acceptedAnswers: [answer], hint, explanation,
});

const practiceSetDrafts: readonly PracticeSetDraft[] = [
  {id:"L13-VOC-MATCH",lessonId:"L13",category:"vocabulary",patternId:"VOC-02",title:"จับคู่คำกับความหมาย",difficulty:1,primaryCompetency:"vocabulary.meaning",topicIds:["l13-city-places"],questions:[
    {id:"l13-voc-match-1",kind:"matching",prompt:"จับคู่คำศัพท์กับความหมาย",left:[{id:"park",text:"der Park"},{id:"kirche",text:"die Kirche"},{id:"rathaus",text:"das Rathaus"}],right:[{id:"green",text:"สวนสาธารณะ"},{id:"church",text:"โบสถ์"},{id:"cityhall",text:"ศาลาว่าการเมือง"}],answerPairs:{park:"green",kirche:"church",rathaus:"cityhall"},hint:"จับคู่ตามตัวอย่างที่เรียน",explanation:"der Park = สวนสาธารณะ, die Kirche = โบสถ์, das Rathaus = ศาลาว่าการเมือง"},
    {id:"l13-voc-match-2",kind:"matching",prompt:"จับคู่สถานที่และความหมาย",left:[{id:"hafen",text:"der Hafen"},{id:"see",text:"der See"}],right:[{id:"port",text:"ท่าเรือ"},{id:"lake",text:"ทะเลสาบ"}],answerPairs:{hafen:"port",see:"lake"},hint:"ดูคำไทยที่รู้จัก",explanation:"der Hafen คือท่าเรือ ส่วน der See ในรายการนี้หมายถึงทะเลสาบ"}
  ]},
  {id:"L13-VOC-FLASH",lessonId:"L13",category:"vocabulary",patternId:"VOC-04",title:"Flashcard ดึงคำจากความจำ",difficulty:1,primaryCompetency:"vocabulary.retrieval",topicIds:["l13-city-places"],questions:[
    {id:"l13-voc-flash-1",kind:"flashcard_recall",prompt:"สวนสาธารณะ",answer:"der Park",meaning:"สวนสาธารณะ",hint:"นึกถึง Artikel ด้วย",explanation:"ทบทวนคำศัพท์พร้อม der/die/das"},
    {id:"l13-voc-flash-2",kind:"flashcard_recall",prompt:"ศาลาว่าการเมือง",answer:"das Rathaus",meaning:"ศาลาว่าการเมือง",hint:"คำนามประสม Rathaus",explanation:"นับเป็นการดึงคำและประเมินตนเอง ไม่ใช่คะแนน mastery"}
  ]},
  {id:"L13-VOC-SELECT",lessonId:"L13",category:"vocabulary",patternId:"VOC-09",title:"เลือกสถานที่ในเมืองจากหมวด",difficulty:1,primaryCompetency:"vocabulary.classification",topicIds:["l13-city-places"],questions:[
    {id:"l13-voc-select-1",kind:"multi_select",prompt:"เลือกสถานที่สีเขียวหรือธรรมชาติ",options:[{id:"park",text:"der Park"},{id:"see",text:"der See"},{id:"rathaus",text:"das Rathaus"},{id:"hafen",text:"der Hafen"}],answerIds:["park","see"],hint:"นึกถึงพื้นที่ที่มีต้นไม้หรือน้ำ",explanation:"Park และ See เป็นสถานที่ธรรมชาติ/พักผ่อน"},
    {id:"l13-voc-select-2",kind:"multi_select",prompt:"เลือกสถานที่ที่เป็นอาคารสาธารณะ",options:[{id:"kirche",text:"die Kirche"},{id:"rathaus",text:"das Rathaus"},{id:"brunnen",text:"der Brunnen"}],answerIds:["kirche","rathaus"],hint:"เลือกอาคารที่คนเข้าไปใช้งานได้",explanation:"Kirche และ Rathaus เป็นอาคารสาธารณะ"}
  ]},
  { id:"L13-VOC-01", lessonId:"L13", category:"vocabulary", patternId:"VOC-01", title:"เห็นภาพแล้วเลือกคำ", difficulty:1, primaryCompetency:"vocabulary.meaning", topicIds:["l13-city-places"], questions:[
    { id:"l13-voc-picture-1",kind:"multiple_choice",prompt:"คำศัพท์ใดตรงกับภาพ?",assetId:"l13-park",options:[{id:"park",text:"der Park"},{id:"tierpark",text:"der Tierpark"},{id:"markt",text:"der Markt"}],answerId:"park",hint:"เป็นพื้นที่สีเขียวสำหรับพักผ่อน",explanation:"der Park คือสวนสาธารณะ" },
    {id:"l13-voc-picture-2",kind:"multiple_choice",prompt:"ดูภาพและเลือกคำศัพท์",assetId:"l13-tierpark",options:[{id:"tierpark",text:"der Tierpark"},{id:"zoo",text:"der Zoo"},{id:"park",text:"der Park"}],answerId:"tierpark",hint:"เป็นพื้นที่สำหรับดูแลสัตว์",explanation:"der Tierpark คือสวนสัตว์"}
  ]},
  { id:"L13-VOC-02", lessonId:"L13", category:"vocabulary", patternId:"VOC-05", title:"เติมตัวอักษรคำศัพท์", difficulty:2, primaryCompetency:"vocabulary.spelling", topicIds:["l13-city-places"], questions:[
    {id:"l13-voc-spell-1",kind:"letter_slots",prompt:"เติมคำว่า Apotheke",answer:"APOTHEKE",hint:"ขึ้นต้นด้วย A",explanation:"die Apotheke คือร้านขายยา"},
    {id:"l13-voc-spell-2",kind:"letter_slots",prompt:"เติมคำว่า Lieblingsort",answer:"LIEBLINGSORT",hint:"คำประสม aus Lieblings + Ort",explanation:"der Lieblingsort คือสถานที่โปรด"}
  ]},
  { id:"L13-GR-01", lessonId:"L13", category:"grammar", patternId:"GR-02", title:"เลือกรูปประโยคที่ถูกต้อง", difficulty:1, primaryCompetency:"grammar.dative", topicIds:["l13-es-gibt-akk","l13-dative-pronouns"], questions:[
    mc("l13-gr-1","Es gibt ... Park in der Stadt.",["einen","ein","einem"],0,"หลัง es gibt ใช้ Akkusativ; der Park เป็นเพศชาย","เพศชายใน Akkusativ ใช้ einen"),
    mc("l13-gr-2","Der Ort gefällt ... . (ich)",["mir","mich","ich"],0,"กริยา gefallen รับ Dativ","ich เปลี่ยนเป็น mir ใน Dativ")
  ]},
  { id:"L13-GR-02", lessonId:"L13", category:"grammar", patternId:"GR-05", title:"เติมคำในประโยค", difficulty:2, primaryCompetency:"grammar.dative", topicIds:["l13-dative-pronouns","l13-dative-verbs"], questions:[
    cloze("l13-gr-cloze-1","เติมรูป Dativ ของ du","Ich helfe ___.","dir","helfen ใช้ Dativ","du เปลี่ยนเป็น dir ใน Dativ"),
    cloze("l13-gr-cloze-2","เติม Artikel หลัง es gibt","Es gibt ___ Bahnhof.","einen","Bahnhof เป็น der และ es gibt ใช้ Akkusativ","der Bahnhof เปลี่ยนเป็น einen Bahnhof")
  ]},
  {id:"L13-GR-CATEGORIZE",lessonId:"L13",category:"grammar",patternId:"GR-09",title:"จัดกลุ่ม Nominativ และ Dativ",difficulty:1,primaryCompetency:"grammar.case",topicIds:["l13-dative-pronouns"],questions:[
    {id:"l13-gr-sort-1",kind:"categorization",prompt:"เลือกว่ารูปสรรพนามอยู่ใน Nominativ หรือ Dativ",buckets:[{id:"nom",text:"Nominativ"},{id:"dat",text:"Dativ"}],items:[{id:"ich",text:"ich"},{id:"mir",text:"mir"},{id:"du",text:"du"},{id:"dir",text:"dir"}],answerBuckets:{ich:"nom",mir:"dat",du:"nom",dir:"dat"},hint:"Dativ ใช้หลัง gefallen, gehören, helfen, danken",explanation:"ich/du เป็น Nominativ; mir/dir เป็น Dativ"},
    {id:"l13-gr-sort-2",kind:"categorization",prompt:"จัดกลุ่มคำตามรูปประโยค",buckets:[{id:"akk",text:"Akkusativ หลัง es gibt"},{id:"dat",text:"Dativ หลัง gefallen"}],items:[{id:"einen",text:"einen Hafen"},{id:"mir",text:"mir"}],answerBuckets:{einen:"akk",mir:"dat"},hint:"ดูคำกริยาที่นำหน้ารูปคำนั้น",explanation:"es gibt einen Hafen ใช้ Akkusativ; Der Ort gefällt mir ใช้ Dativ"}
  ]},
  { id:"L13-RED-01", lessonId:"L13", category:"phrases", patternId:"RED-01", title:"เลือกสำนวนตามสถานการณ์", difficulty:1, primaryCompetency:"phrases.city-opinion", topicIds:["l13-favorite-place"], questions:[
    mc("l13-red-1","อยากบอกว่า ‘ฉันชอบสวนสาธารณะ’ เลือกประโยคใด?",["Der Park gefällt mir.","Ich gehe Park.","Es gibt Park mir."],0,"ใช้ gefallen กับผู้ที่รู้สึกชอบในรูป Dativ","Der Park gefällt mir. = ฉันชอบสวนสาธารณะ"),
    mc("l13-red-2","ถามเพื่อนว่า ‘สถานที่โปรดของคุณคือที่ไหน’",["Was ist dein Lieblingsort?","Wo ist deine Bahnhof?","Wie heißt du Ort?"],0,"เริ่มด้วย Was ist ...?","Was ist dein Lieblingsort? ถามสถานที่โปรด")
  ]},
  { id:"L13-RED-02", lessonId:"L13", category:"phrases", patternId:"RED-04", title:"เรียงบทสนทนา", difficulty:2, primaryCompetency:"phrases.dialogue", topicIds:["l13-favorite-place"], questions:[
    {id:"l13-dialogue-1",kind:"dialogue_builder",prompt:"เรียงบทสนทนาให้เป็นธรรมชาติ",turns:[{id:"a",text:"Mein Lieblingsort ist der Park."},{id:"b",text:"Was ist dein Lieblingsort?"},{id:"c",text:"Warum?"},{id:"d",text:"Dort treffe ich Freunde."}],acceptedOrders:[["b","a","c","d"]],hint:"เริ่มจากคำถาม",explanation:"ถามสถานที่โปรด → ตอบ → ถามเหตุผล → ขยายความ"},
    {id:"l13-dialogue-2",kind:"dialogue_builder",prompt:"เรียงประโยคจากการถามไปสู่การตอบ",turns:[{id:"a",text:"Der Park gefällt mir."},{id:"b",text:"Welcher Ort gefällt dir?"}],acceptedOrders:[["b","a"]],hint:"คำถามมาก่อนคำตอบ",explanation:"คำถาม Welcher Ort ...? ตามด้วยคำตอบ Der Park gefällt mir."}
  ]},
  { id:"L13-HOE-01", lessonId:"L13", category:"listening", patternId:"HOE-02", title:"ฟังแล้วเลือกข้อมูล", difficulty:1, primaryCompetency:"listening.detail", topicIds:["l13-favorite-place"], questions:[
    {id:"l13-audio-1",kind:"audio_mcq",prompt:"ฟังแล้วเลือกสถานที่ที่พูดถึง",audioText:"Mein Lieblingsort ist der Park. Dort treffe ich meine Freunde.",options:[{id:"park",text:"der Park"},{id:"bank",text:"die Bank"},{id:"markt",text:"der Markt"}],answerId:"park",hint:"ฟังชื่อสถานที่",explanation:"ผู้พูดบอกว่า Lieblingsort คือ der Park"},
    {id:"l13-audio-2",kind:"audio_mcq",prompt:"ฟังแล้วบอกว่าใครชอบร้านกาแฟ",audioText:"Marias Lieblingsort ist das Café. Sie trinkt dort Kaffee.",options:[{id:"maria",text:"Maria"},{id:"jan",text:"Jan"},{id:"line",text:"Line"}],answerId:"maria",hint:"จับชื่อคนต้นประโยค",explanation:"Marias Lieblingsort คือ das Café"}
  ]},
  { id:"L13-HOE-02", lessonId:"L13", category:"listening", patternId:"HOE-03", title:"ฟังแล้วเติมคำ", difficulty:2, primaryCompetency:"listening.detail", topicIds:["l13-favorite-place"], questions:[
    {id:"l13-audio-cloze-1",kind:"cloze",prompt:"ฟังเสียงแล้วเติมสถานที่",sentence:"Mein Lieblingsort ist der ___.",audioText:"Mein Lieblingsort ist der Park.",acceptedAnswers:["Park","park"],hint:"ฟังเสียงภาษาเยอรมันได้อีกครั้ง",explanation:"ประโยคเสียงพูดว่า der Park"},
    {id:"l13-audio-cloze-2",kind:"cloze",prompt:"ฟังแล้วเติมคำที่ได้ยิน",sentence:"Dort treffe ich meine ___.",audioText:"Dort treffe ich meine Freunde.",acceptedAnswers:["Freunde","freunde"],hint:"เสียงลงท้ายด้วย -e",explanation:"ผู้พูดพบเพื่อนที่นั่น"}
  ]},
  { id:"L13-LES-01", lessonId:"L13", category:"reading", patternId:"LES-02", title:"อ่านแล้วหาหลักฐาน", difficulty:2, primaryCompetency:"reading.comprehension", topicIds:["l13-city-blog"], questions:[
    {id:"l13-read-1",kind:"true_false_evidence",passage:"Marias Lieblingsort ist der Markt. Am Samstag kauft sie dort Obst. Danach trifft sie ihre Freundin im Café.",statement:"Maria kauft am Samstag Obst auf dem Markt.",answer:true,evidence:"Am Samstag kauft sie dort Obst.",hint:"หา Saturday และ Obst ในข้อความ",explanation:"ข้อความระบุชัดว่า Maria ซื้อผลไม้ที่ตลาดวันเสาร์"},
    {id:"l13-read-2",kind:"true_false_evidence",passage:"Jan geht gern in den Park. Dort spielt er Fußball mit seinen Freunden.",statement:"Jan geht gern in die Bank.",answer:false,evidence:"Jan geht gern in den Park.",hint:"เทียบสถานที่ในข้อความกับข้อความที่กำหนด",explanation:"หลักฐานระบุว่าเขาไปสวนสาธารณะ ไม่ใช่ธนาคาร"}
  ]},
  { id:"L13-LES-02", lessonId:"L13", category:"reading", patternId:"LES-04", title:"อ่านข้อความแล้วตอบ", difficulty:2, primaryCompetency:"reading.comprehension", topicIds:["l13-city-blog"], questions:[
    cloze("l13-read-cloze-1","อ่านข้อความแล้วเติมว่า Maria ซื้ออะไร","Maria kauft am Samstag ___.","Obst","มองหาคำหลัง kauft","Maria ซื้อ Obst (ผลไม้)"),
    cloze("l13-read-cloze-2","เติมสถานที่ที่ Jan ไป","Jan spielt Fußball im ___.","Park","ดูคำที่ตาม im","im Park คือในสวนสาธารณะ")
  ]},
  { id:"L13-SCH-01", lessonId:"L13", category:"writing", patternId:"SCH-03", title:"เขียนเกี่ยวกับสถานที่โปรด", difficulty:3, primaryCompetency:"writing.production", topicIds:["l13-favorite-place"], questions:[
    {id:"l13-write-1",kind:"text_response",prompt:"เขียน 2–3 ประโยคเกี่ยวกับสถานที่โปรด โดยใช้ ‘Mein Lieblingsort ist …’ และ ‘Dort …’",minimumWords:8,targetPhrases:["Mein Lieblingsort ist","Dort"],rubric:["ระบุสถานที่","ใช้วลี Mein Lieblingsort ist","เพิ่มข้อมูลด้วย Dort"],hint:"เริ่มด้วย Mein Lieblingsort ist der/die/das ...",explanation:"เป็นงานเขียนปลายเปิด ระบบบันทึกร่างและใช้ checklist ประเมินตนเอง ไม่ให้คะแนนอัตโนมัติ"},
    {id:"l13-write-2",kind:"text_response",prompt:"เขียนข้อความสั้นชวนเพื่อนไปสถานที่หนึ่ง พร้อมบอกเหตุผล",minimumWords:8,targetPhrases:["Möchtest du","gefällt mir"],rubric:["บอกสถานที่","ชวนเพื่อน","ให้เหตุผลหรือความเห็น"],hint:"ลองใช้ Möchtest du ...? และ Der Ort gefällt mir.",explanation:"ตรวจด้วย checklist; ผู้เรียนสามารถกลับมาแก้ฉบับร่างได้"}
  ]},
  { id:"L13-SCH-02", lessonId:"L13", category:"writing", patternId:"SCH-02", title:"สร้างประโยคจากคำ", difficulty:2, primaryCompetency:"writing.sentence-construction", topicIds:["l13-es-gibt-akk","l13-favorite-place"], questions:[
    {id:"l13-write-order-1",kind:"word_order",prompt:"เรียงเป็น ‘ในเมืองมีสวนสาธารณะ’",tokens:["Es","gibt","einen","Park","in der Stadt."],acceptedOrders:[["Es","gibt","einen","Park","in der Stadt."]],hint:"เริ่มประโยคด้วย Es gibt",explanation:"Es gibt einen Park in der Stadt."},
    {id:"l13-write-order-2",kind:"word_order",prompt:"เรียงเป็น ‘สถานที่โปรดของฉันคือสวนสาธารณะ’",tokens:["Mein","Lieblingsort","ist","der","Park."],acceptedOrders:[["Mein","Lieblingsort","ist","der","Park."]],hint:"ประธาน Mein Lieblingsort ตามด้วย ist",explanation:"Mein Lieblingsort ist der Park."}
  ]},
  { id:"L13-SPR-01", lessonId:"L13", category:"speaking", patternId:"SPR-02", title:"ตอบคำถามสั้นด้วยเสียง", difficulty:2, primaryCompetency:"speaking.production", topicIds:["l13-favorite-place"], questions:[
    {id:"l13-speak-1",kind:"recorded_speech",prompt:"ตอบด้วยเสียง: Was ist dein Lieblingsort?",example:"Mein Lieblingsort ist der Park.",checklist:["ตอบเป็นภาษาเยอรมัน","บอกสถานที่","ใช้ Mein Lieblingsort ist ..."],hint:"จะพูดตามตัวอย่างหรือพูดคำตอบของตัวเองก็ได้",explanation:"บันทึกเสียงในเครื่องเท่านั้น; ถ้าไม่เปิดไมโครโฟน ใช้ checklist ประเมินตนเอง"},
    {id:"l13-speak-2",kind:"recorded_speech",prompt:"พูด 1–2 ประโยคว่าทำไมคุณชอบสถานที่นั้น",example:"Der Park gefällt mir. Dort treffe ich Freunde.",checklist:["บอกความเห็น","ใช้ Dativ กับ gefällt mir ได้ถูกต้อง"],hint:"Der/Die/Das ... gefällt mir.",explanation:"ใช้ checklist ประเมินด้วยตนเอง ไม่มีการอัปโหลดไฟล์เสียง"}
  ]},
  { id:"L13-SPR-02", lessonId:"L13", category:"speaking", patternId:"SPR-01", title:"อ่านตามและฝึกออกเสียง", difficulty:1, primaryCompetency:"speaking.pronunciation", topicIds:["l13-favorite-place"], questions:[
    {id:"l13-speak-shadow-1",kind:"recorded_speech",prompt:"อ่านประโยคตามตัวอย่าง แล้วฟังเสียงที่บันทึกไว้",example:"Der Park gefällt mir.",checklist:["อ่านครบทั้งประโยค","ออกเสียง Park ชัดเจน","ใช้ mir ตามกริยา gefallen"],hint:"อ่านช้า ๆ แล้วเน้นคำว่า gefällt",explanation:"ตรวจการอ่านด้วย checklist; เสียงบันทึกอยู่ในอุปกรณ์นี้เท่านั้น"},
    {id:"l13-speak-shadow-2",kind:"recorded_speech",prompt:"อ่านประโยคที่สองแล้วประเมินตัวเอง",example:"Mein Lieblingsort ist der Markt.",checklist:["พูด Mein Lieblingsort ชัดเจน","ใช้ Artikel der กับ Markt"],hint:"แบ่งเป็น Mein Lieblingsort / ist der Markt",explanation:"กิจกรรมนี้ฝึกการออกเสียงเบื้องต้น ไม่ใช้วัดไวยากรณ์ทั้งหมด"}
  ]},

  { id:"L14-VOC-01", lessonId:"L14", category:"vocabulary", patternId:"VOC-01", title:"เห็นภาพแล้วเลือกคำ", difficulty:1, primaryCompetency:"vocabulary.meaning", topicIds:["l14-city-places"], questions:[
    {id:"l14-voc-image-1",kind:"multiple_choice",prompt:"เลือกชื่อสถานที่จากภาพ",assetId:"l14-post",options:[{id:"post",text:"die Post"},{id:"bank",text:"die Bank"},{id:"polizei",text:"die Polizei"}],answerId:"post",hint:"เป็นสถานที่ส่งจดหมาย",explanation:"die Post คือที่ทำการไปรษณีย์"},
    {id:"l14-voc-image-2",kind:"multiple_choice",prompt:"เลือกชื่อที่ตรงกับภาพ",assetId:"l14-ampel",options:[{id:"ampel",text:"die Ampel"},{id:"polizei",text:"die Polizei"},{id:"zentrum",text:"das Zentrum"}],answerId:"ampel",hint:"มีไฟสีแดง เหลือง เขียว",explanation:"die Ampel คือไฟจราจร"}
  ]},
  { id:"L14-VOC-02", lessonId:"L14", category:"vocabulary", patternId:"VOC-05", title:"สะกดชื่อสถานที่", difficulty:2, primaryCompetency:"vocabulary.spelling", topicIds:["l14-city-places"], questions:[
    {id:"l14-voc-spell-1",kind:"letter_slots",prompt:"เติมคำว่า Polizei",answer:"POLIZEI",assetId:"l14-polizei",hint:"มี 7 ตัวอักษร เริ่มด้วย P",explanation:"die Polizei คือสถานีตำรวจ/ตำรวจ"},
    {id:"l14-voc-spell-2",kind:"letter_slots",prompt:"เติมคำว่า Zentrum",answer:"ZENTRUM",assetId:"l14-zentrum",hint:"เริ่มด้วย Z",explanation:"das Zentrum คือใจกลางเมือง"}
  ]},
  {id:"L14-VOC-MATCH",lessonId:"L14",category:"vocabulary",patternId:"VOC-02",title:"จับคู่สถานที่กับความหมาย",difficulty:1,primaryCompetency:"vocabulary.meaning",topicIds:["l14-city-places"],questions:[
    {id:"l14-voc-match-1",kind:"matching",prompt:"จับคู่คำศัพท์กับความหมาย",left:[{id:"post",text:"die Post"},{id:"bank",text:"die Bank"},{id:"ampel",text:"die Ampel"}],right:[{id:"mail",text:"ที่ทำการไปรษณีย์"},{id:"bank-th",text:"ธนาคาร"},{id:"traffic",text:"ไฟจราจร"}],answerPairs:{post:"mail",bank:"bank-th",ampel:"traffic"},hint:"นึกถึงภาพในเมือง",explanation:"จับคู่คำศัพท์สถานที่และสิ่งของในเมือง"},
    {id:"l14-voc-match-2",kind:"matching",prompt:"จับคู่คำศัพท์กับความหมาย",left:[{id:"polizei",text:"die Polizei"},{id:"zentrum",text:"das Zentrum"}],right:[{id:"police",text:"สถานีตำรวจ/ตำรวจ"},{id:"center",text:"ใจกลางเมือง"}],answerPairs:{polizei:"police",zentrum:"center"},hint:"ดูคำไทยที่รู้จัก",explanation:"die Polizei = ตำรวจ/สถานีตำรวจ; das Zentrum = ใจกลางเมือง"}
  ]},
  {id:"L14-VOC-FLASH",lessonId:"L14",category:"vocabulary",patternId:"VOC-04",title:"Flashcard ดึงคำจากความจำ",difficulty:1,primaryCompetency:"vocabulary.retrieval",topicIds:["l14-city-places"],questions:[
    {id:"l14-voc-flash-1",kind:"flashcard_recall",prompt:"ธนาคาร",answer:"die Bank",meaning:"ธนาคาร",hint:"จำ Artikel die",explanation:"ทบทวนคำพร้อม Artikel"},
    {id:"l14-voc-flash-2",kind:"flashcard_recall",prompt:"ใจกลางเมือง",answer:"das Zentrum",meaning:"ใจกลางเมือง",hint:"ขึ้นต้นด้วย Z",explanation:"ประเมินการดึงคำจากความจำด้วยตนเอง"}
  ]},
  {id:"L14-VOC-SELECT",lessonId:"L14",category:"vocabulary",patternId:"VOC-09",title:"เลือกสถานที่ให้ตรงกับหน้าที่",difficulty:1,primaryCompetency:"vocabulary.classification",topicIds:["l14-city-places"],questions:[
    {id:"l14-voc-select-1",kind:"multi_select",prompt:"เลือกสถานที่ที่เกี่ยวกับบริการสาธารณะ",options:[{id:"post",text:"die Post"},{id:"polizei",text:"die Polizei"},{id:"ampel",text:"die Ampel"},{id:"zentrum",text:"das Zentrum"}],answerIds:["post","polizei"],hint:"เลือกสถานที่ที่มีเจ้าหน้าที่ให้บริการ",explanation:"Post และ Polizei เป็นบริการสาธารณะ"},
    {id:"l14-voc-select-2",kind:"multi_select",prompt:"เลือกคำที่เป็นชื่อสถานที่",options:[{id:"bank",text:"die Bank"},{id:"ampel",text:"die Ampel"},{id:"geradeaus",text:"geradeaus"}],answerIds:["bank"],hint:"geradeaus เป็นคำบอกทิศทาง",explanation:"die Bank เป็นสถานที่; Ampel เป็นสิ่งของริมถนน"}
  ]},
  { id:"L14-VOC-CROSSWORD", lessonId:"L14", category:"vocabulary", patternId:"VOC-06", title:"ภาพกับอักษรไขว้", difficulty:3, primaryCompetency:"vocabulary.spelling", topicIds:["l14-city-places"], questions:[
    {id:"l14-crossword-q1",kind:"crossword",prompt:"มองภาพแล้วพิมพ์ตัวอักษรทีละช่องเพื่อเติมคำไขว้",presetId:"l14-city-pictures-crossword-01",hint:"ขอคำใบ้ตัวแรกหรือเปิดความหมายได้",explanation:"คำไขว้นับการดึงศัพท์และการสะกดเป็นทักษะคำศัพท์เท่านั้น"}
  ]},
  { id:"L14-GR-01", lessonId:"L14", category:"grammar", patternId:"GR-02", title:"เลือกบุพบทจากตำแหน่ง", difficulty:1, primaryCompetency:"grammar.local-prepositions", topicIds:["l14-local-prepositions"], questions:[
    mc("l14-gr-1","Das Café ist ___ der Bank. (อยู่ติดกับ)",["neben","in","durch"],0,"ถาม Wo? เพื่อบอกตำแหน่ง","neben + Dativ ใช้บอกว่าอยู่ข้าง ๆ"),
    mc("l14-gr-2","Wir sind ___ Bahnhof. (ที่สถานีรถไฟ)",["am","ins","durch den"],0,"an dem ย่อเป็น am","Wo? + Dativ: am Bahnhof")
  ]},
  { id:"L14-GR-02", lessonId:"L14", category:"grammar", patternId:"GR-05", title:"เติมคำบุพบทและ Artikel", difficulty:2, primaryCompetency:"grammar.local-prepositions", topicIds:["l14-local-prepositions"], questions:[
    cloze("l14-gr-cloze-1","เติมวลี ‘ในที่ทำการไปรษณีย์’","Ich bin ___ Post.","in der","Post เป็นเพศหญิง: in + der","Wo? ใช้ Dativ: in der Post"),
    cloze("l14-gr-cloze-2","เติมรูปย่อ ‘ที่สถานีรถไฟ’","Wir treffen uns ___ Bahnhof.","am","an dem ย่อเป็น am","am Bahnhof = an dem Bahnhof")
  ]},
  {id:"L14-GR-CATEGORIZE",lessonId:"L14",category:"grammar",patternId:"GR-09",title:"แยกคำถาม Wo? และ Wohin?",difficulty:1,primaryCompetency:"grammar.local-prepositions",topicIds:["l14-local-prepositions"],questions:[
    {id:"l14-gr-sort-1",kind:"categorization",prompt:"จัดประโยคตามคำถามที่ตอบ",buckets:[{id:"wo",text:"Wo? ตำแหน่ง"},{id:"wohin",text:"Wohin? ทิศทาง"}],items:[{id:"im",text:"Ich bin im Park."},{id:"in-den",text:"Ich gehe in den Park."}],answerBuckets:{im:"wo", "in-den":"wohin"},hint:"bin บอกตำแหน่ง; gehe บอกการเคลื่อนที่",explanation:"Wo? ใช้ Dativ; Wohin? ในตัวอย่างใช้ Akkusativ"},
    {id:"l14-gr-sort-2",kind:"categorization",prompt:"จัดกลุ่มรูปย่อ",buckets:[{id:"am",text:"am = an dem"},{id:"im",text:"im = in dem"}],items:[{id:"bahnhof",text:"am Bahnhof"},{id:"park",text:"im Park"}],answerBuckets:{bahnhof:"am",park:"im"},hint:"แยกคำบุพบทตั้งต้น an/in",explanation:"am ใช้กับ an dem; im ใช้กับ in dem"}
  ]},
  {id:"L14-GR-IMAGE",lessonId:"L14",category:"grammar",patternId:"GR-03",title:"ดูผังแล้วเลือก Präposition",difficulty:1,primaryCompetency:"grammar.local-prepositions",topicIds:["l14-local-prepositions"],questions:[
    {id:"l14-gr-image-1",kind:"image_hotspot",prompt:"Wo ist die Bank? ดูตำแหน่งในภาพ",assetId:"l14-local-position",options:[{id:"neben",text:"neben dem Café"},{id:"gegenueber",text:"gegenüber dem Café"},{id:"im",text:"im Café"}],answerId:"neben",hint:"Bank และ Café อยู่ติดกันในแถวเดียว",explanation:"Die Bank ist neben dem Café. คำถาม Wo? ใช้ neben + Dativ"},
    {id:"l14-gr-image-2",kind:"image_hotspot",prompt:"Wo ist die Post? ดูตำแหน่งในภาพ",assetId:"l14-local-position",options:[{id:"gegenueber",text:"gegenüber dem Café"},{id:"neben",text:"neben dem Café"},{id:"im",text:"im Café"}],answerId:"gegenueber",hint:"Post อยู่คนละฝั่งของถนนกับ Café",explanation:"Die Post ist gegenüber dem Café. gegenüber ใช้ Dativ"}
  ]},
  { id:"L14-RED-01", lessonId:"L14", category:"phrases", patternId:"RED-01", title:"เลือกประโยคบอกทาง", difficulty:1, primaryCompetency:"phrases.directions", topicIds:["l14-directions"], questions:[
    mc("l14-red-1","ขอให้คนหนึ่งเดินตรงไป พูดว่าอย่างไร?",["Gehen Sie geradeaus.","Wo ist die Post?","Ich bin am Bahnhof."],0,"สุภาพใช้ Sie","Gehen Sie geradeaus. = เดินตรงไป"),
    mc("l14-red-2","ถามว่า ‘ที่ทำการไปรษณีย์อยู่ที่ไหน’",["Wo ist die Post?","Wie gefällt die Post?","Was gibt die Post?"],0,"เริ่มคำถามตำแหน่งด้วย Wo ist ...?","Wo ist die Post? ถามหาเส้นทางไปไปรษณีย์")
  ]},
  { id:"L14-RED-02", lessonId:"L14", category:"phrases", patternId:"RED-04", title:"เรียงบทสนทนาถามทาง", difficulty:2, primaryCompetency:"phrases.dialogue", topicIds:["l14-directions"], questions:[
    {id:"l14-dialogue-1",kind:"dialogue_builder",prompt:"เรียงบทสนทนาถามทาง",turns:[{id:"a",text:"Vielen Dank!"},{id:"b",text:"Entschuldigung, wo ist die Post?"},{id:"c",text:"Gehen Sie geradeaus und dann links."}],acceptedOrders:[["b","c","a"]],hint:"เริ่มด้วยคำถาม ตามด้วยคำแนะนำ แล้วขอบคุณ",explanation:"ลำดับคำถามทาง → บอกทาง → ขอบคุณ"},
    {id:"l14-dialogue-2",kind:"dialogue_builder",prompt:"เรียงบทสนทนาสุภาพ",turns:[{id:"a",text:"Bitte. Die Bank ist neben dem Café."},{id:"b",text:"Entschuldigung, wo ist die Bank?"},{id:"c",text:"Danke schön."}],acceptedOrders:[["b","a","c"]],hint:"หาคำถามตำแหน่งก่อน",explanation:"ถามหาธนาคาร → บอกตำแหน่ง → ขอบคุณ"}
  ]},
  { id:"L14-HOE-01", lessonId:"L14", category:"listening", patternId:"HOE-02", title:"ฟังแล้วเลือกสถานที่", difficulty:1, primaryCompetency:"listening.detail", topicIds:["l14-directions"], questions:[
    {id:"l14-audio-1",kind:"audio_mcq",prompt:"ฟังแล้วเลือกจุดหมาย",audioText:"Gehen Sie geradeaus. Die Post ist neben der Bank.",options:[{id:"post",text:"die Post"},{id:"polizei",text:"die Polizei"},{id:"zentrum",text:"das Zentrum"}],answerId:"post",hint:"ฟังชื่อสถานที่หลัง ist",explanation:"จุดหมายคือ die Post"},
    {id:"l14-audio-2",kind:"audio_mcq",prompt:"ฟังแล้วเลือกทิศทาง",audioText:"Gehen Sie an der Ampel nach rechts.",options:[{id:"right",text:"เลี้ยวขวา"},{id:"left",text:"เลี้ยวซ้าย"},{id:"straight",text:"เดินตรง"}],answerId:"right",hint:"ฟังคำ nach ...",explanation:"nach rechts หมายถึงไปทางขวา"}
  ]},
  { id:"L14-HOE-02", lessonId:"L14", category:"listening", patternId:"HOE-04", title:"ฟังแล้วเรียงเส้นทาง", difficulty:2, primaryCompetency:"listening.route", topicIds:["l14-directions"], questions:[
    {id:"l14-route-audio-1",kind:"audio_route",prompt:"ฟังและเรียงจุดที่ผ่านตามลำดับ",audioText:"Gehen Sie vom Bahnhof geradeaus. Gehen Sie an der Ampel nach links. Die Post ist neben der Bank.",mapId:"l14-city-grid",acceptedRoutes:[["bahnhof","ampel","post"]],hint:"เริ่มจาก Bahnhof แล้วไป Ampel",explanation:"เส้นทาง: Bahnhof → Ampel → Post"},
    {id:"l14-route-audio-2",kind:"audio_route",prompt:"ฟังแล้วเลือกเส้นทางตามคำบอก",audioText:"Gehen Sie vom Bahnhof geradeaus bis zum Zentrum. Dann gehen Sie nach rechts. Die Polizei ist dort.",mapId:"l14-city-grid",acceptedRoutes:[["bahnhof","zentrum","polizei"]],hint:"จับคำ vom Bahnhof, bis zum และ danach",explanation:"เส้นทาง Bahnhof → Zentrum → Polizei"}
  ]},
  { id:"L14-LES-01", lessonId:"L14", category:"reading", patternId:"LES-03", title:"อ่านคำบอกทางบนแผนที่", difficulty:2, primaryCompetency:"reading.route", topicIds:["l14-map-directions"], questions:[
    {id:"l14-map-1",kind:"map_route",prompt:"อ่านคำบอกทางแล้วเลือกปลายทาง",mapId:"l14-city-grid",startNode:"bahnhof",acceptedRoutes:[["bahnhof","ampel","post"]],hint:"ไปตรงถึง Ampel แล้วเลี้ยวซ้าย",explanation:"ปลายทางตามคำแนะนำคือ Post"},
    {id:"l14-map-2",kind:"map_route",prompt:"อ่านคำแนะนำแล้วหาเป้าหมาย",mapId:"l14-city-grid",startNode:"zentrum",acceptedRoutes:[["zentrum","bank"]],hint:"เป้าหมายอยู่ข้าง Café",explanation:"เดินจาก Zentrum ไป Bank ตามแผนที่"}
  ]},
  { id:"L14-LES-02", lessonId:"L14", category:"reading", patternId:"LES-02", title:"อ่านข้อความและชี้หลักฐาน", difficulty:2, primaryCompetency:"reading.comprehension", topicIds:["l14-map-directions"], questions:[
    {id:"l14-read-1",kind:"true_false_evidence",passage:"Die Post ist neben der Bank. Vom Bahnhof gehen Sie geradeaus bis zur Ampel. Dann links.",statement:"Die Post ist neben der Bank.",answer:true,evidence:"Die Post ist neben der Bank.",hint:"หาประโยคที่พูดถึง Post",explanation:"ข้อความตรงกับข้อความที่ให้ตรวจ"},
    {id:"l14-read-2",kind:"true_false_evidence",passage:"Gehen Sie an der Ampel nach rechts. Das Kaufhaus ist gegenüber der Post.",statement:"Das Kaufhaus ist gegenüber der Post.",answer:true,evidence:"Das Kaufhaus ist gegenüber der Post.",hint:"มองหาคำ gegenüber",explanation:"ข้อความระบุว่าห้างอยู่ตรงข้ามไปรษณีย์"}
  ]},
  { id:"L14-SCH-01", lessonId:"L14", category:"writing", patternId:"SCH-05", title:"เขียนคำบอกทาง", difficulty:3, primaryCompetency:"writing.production", topicIds:["l14-directions"], questions:[
    {id:"l14-write-1",kind:"text_response",prompt:"เขียนคำบอกทาง 3 ขั้นจาก Bahnhof ไป Post โดยใช้ geradeaus, an der Ampel, links",minimumWords:8,targetPhrases:["Gehen Sie","geradeaus","links"],rubric:["ระบุจุดเริ่ม","มีอย่างน้อยสองขั้น","บอกจุดหมาย"],hint:"เริ่มด้วย Gehen Sie ...",explanation:"ประเมินตนเองด้วย checklist; ไม่มีการให้คะแนนไวยากรณ์อัตโนมัติ"},
    {id:"l14-write-2",kind:"text_response",prompt:"เขียนข้อความสั้นอธิบายว่าธนาคารอยู่ตรงไหน โดยใช้ neben หรือ gegenüber",minimumWords:6,targetPhrases:["Die Bank ist","neben"],rubric:["ระบุธนาคาร","ใช้บุพบทตำแหน่ง","ตั้งชื่อจุดอ้างอิง"],hint:"Die Bank ist neben dem ...",explanation:"เก็บเป็นฉบับร่างเพื่อกลับมาแก้ไขได้"}
  ]},
  { id:"L14-SCH-02", lessonId:"L14", category:"writing", patternId:"SCH-02", title:"เรียงคำเป็นประโยคบอกทาง", difficulty:2, primaryCompetency:"writing.sentence-construction", topicIds:["l14-directions","l14-local-prepositions"], questions:[
    {id:"l14-write-order-1",kind:"word_order",prompt:"เรียงเป็น ‘เดินตรงไป’",tokens:["Gehen","Sie","geradeaus."],acceptedOrders:[["Gehen","Sie","geradeaus."]],hint:"กริยาคำสั่งมาก่อน Sie",explanation:"Gehen Sie geradeaus."},
    {id:"l14-write-order-2",kind:"word_order",prompt:"เรียงเป็น ‘ธนาคารอยู่ข้างคาเฟ่’",tokens:["Die","Bank","ist","neben","dem","Café."],acceptedOrders:[["Die","Bank","ist","neben","dem","Café."]],hint:"หลัง ist ใช้คำบอกตำแหน่ง",explanation:"Die Bank ist neben dem Café."}
  ]},
  { id:"L14-SPR-01", lessonId:"L14", category:"speaking", patternId:"SPR-03", title:"ฝึกบทบาทถามทาง", difficulty:3, primaryCompetency:"speaking.production", topicIds:["l14-directions"], questions:[
    {id:"l14-speak-1",kind:"recorded_speech",prompt:"สมมติว่าคุณเป็นผู้ถามทาง: ถามหา die Post อย่างสุภาพ",example:"Entschuldigung, wo ist die Post?",checklist:["ใช้ Entschuldigung","ถาม Wo ist ...?","ออกเสียงชื่อสถานที่"],hint:"เริ่มว่า Entschuldigung, ...",explanation:"ตรวจด้วย checklist หรือบันทึกเสียงชั่วคราวในเครื่อง"},
    {id:"l14-speak-2",kind:"recorded_speech",prompt:"บอกทางจาก Bahnhof ไป Post 2 ขั้น",example:"Gehen Sie geradeaus. Dann gehen Sie an der Ampel nach links.",checklist:["ใช้รูปสุภาพ Sie","บอกลำดับอย่างน้อยสองขั้น","ระบุจุดหมาย"],hint:"ใช้ geradeaus แล้วตามด้วย links/rechts",explanation:"การพูดเป็นการประเมินตนเอง; ไม่ส่งเสียงออกจากอุปกรณ์"}
  ]},
  { id:"L14-SPR-02", lessonId:"L14", category:"speaking", patternId:"SPR-04", title:"อธิบายเส้นทางจากแผนที่", difficulty:3, primaryCompetency:"speaking.production", topicIds:["l14-directions"], questions:[
    {id:"l14-speak-map-1",kind:"recorded_speech",prompt:"อธิบายเส้นทางจาก Bahnhof ไป Post 3 ขั้น",example:"Vom Bahnhof gehen Sie geradeaus. An der Ampel gehen Sie nach links. Die Post ist neben der Bank.",checklist:["บอกจุดเริ่ม","ใช้ลำดับอย่างน้อยสองขั้น","บอกจุดหมาย"],hint:"ใช้ geradeaus, dann และ links/rechts",explanation:"บันทึกเสียงในเครื่องชั่วคราวและประเมินตาม checklist"},
    {id:"l14-speak-map-2",kind:"recorded_speech",prompt:"อธิบายตำแหน่งของธนาคารเทียบกับสถานที่ใกล้เคียง",example:"Die Bank ist neben dem Café.",checklist:["ใช้ Die Bank ist ...","เลือกบุพบทตำแหน่ง","ใช้ Artikel Dativ หลัง neben"],hint:"Wo? ใช้ neben + Dativ",explanation:"งานพูดแบบปลายเปิดไม่มีคำตอบเดียว ระบบไม่ให้คะแนนอัตโนมัติ"}
  ]},
  {id:"L13-VOC-ART",lessonId:"L13",category:"vocabulary",patternId:"VOC-03",title:"เลือก Artikel der/die/das",difficulty:1,primaryCompetency:"vocabulary.noun-gender",topicIds:["l13-city-places"],questions:[
    mc("l13-article-1","___ Kirche",["der","die","das"],1,"Kirche เป็นคำนามเพศหญิง","die Kirche"),
    mc("l13-article-2","___ Rathaus",["der","die","das"],2,"Rathaus เป็นคำนามเพศกลาง","das Rathaus")
  ]},
  {id:"L13-VOC-ANAGRAM",lessonId:"L13",category:"vocabulary",patternId:"VOC-07",title:"เรียงตัวอักษรเป็นคำ",difficulty:2,primaryCompetency:"vocabulary.spelling",topicIds:["l13-city-places"],questions:[
    {id:"l13-anagram-1",kind:"word_order",prompt:"เรียงตัวอักษรเป็นคำว่า Park",tokens:["r","P","k","a"],acceptedOrders:[["P","a","r","k"]],hint:"ขึ้นต้นด้วยอักษรใหญ่ P",explanation:"สะกดว่า Park"},
    {id:"l13-anagram-2",kind:"word_order",prompt:"เรียงตัวอักษรเป็นคำว่า See",tokens:["e","S","e"],acceptedOrders:[["S","e","e"]],hint:"คำนามขึ้นต้นด้วย S ตัวใหญ่",explanation:"สะกดว่า See"}
  ]},
  {id:"L13-VOC-BAUSTEINE",lessonId:"L13",category:"vocabulary",patternId:"VOC-08",title:"ประกอบคำจากส่วนคำ",difficulty:2,primaryCompetency:"vocabulary.word-formation",topicIds:["l13-city-places"],questions:[
    {id:"l13-parts-1",kind:"matching",prompt:"จับคู่ส่วนคำให้ได้คำประสม",left:[{id:"rat",text:"Rat"},{id:"spiel",text:"Spiel"}],right:[{id:"haus",text:"Haus → Rathaus"},{id:"platz",text:"Platz → Spielplatz"}],answerPairs:{rat:"haus",spiel:"platz"},hint:"ลองอ่านคำประสมที่ได้",explanation:"Rathaus และ Spielplatz เป็นคำประสมที่พบในเมือง"},
    {id:"l13-parts-2",kind:"matching",prompt:"จับคู่คำต้นกับส่วนท้าย",left:[{id:"tier",text:"Tier"},{id:"alt",text:"Alt"}],right:[{id:"park",text:"Park → Tierpark"},{id:"stadt",text:"Stadt → Altstadt"}],answerPairs:{tier:"park",alt:"stadt"},hint:"จับคู่ให้เกิดชื่อสถานที่",explanation:"Tierpark คือสวนสัตว์; Altstadt คือย่านเมืองเก่า"}
  ]},
  {id:"L14-VOC-AUDIO",lessonId:"L14",category:"vocabulary",patternId:"VOC-10",title:"ฟังแล้วเลือกคำศัพท์",difficulty:1,primaryCompetency:"vocabulary.audio-recognition",topicIds:["l14-city-places"],questions:[
    {id:"l14-audio-vocab-1",kind:"audio_mcq",prompt:"ฟังคำศัพท์แล้วเลือกความหมาย",audioText:"die Polizei",options:[{id:"polizei",text:"สถานีตำรวจ/ตำรวจ"},{id:"post",text:"ที่ทำการไปรษณีย์"},{id:"bank",text:"ธนาคาร"}],answerId:"polizei",hint:"ฟังพยางค์ Poli-",explanation:"เสียงสังเคราะห์พูดว่า die Polizei"},
    {id:"l14-audio-vocab-2",kind:"audio_mcq",prompt:"ฟังคำศัพท์แล้วเลือกคำตอบ",audioText:"das Zentrum",options:[{id:"zentrum",text:"ใจกลางเมือง"},{id:"ampel",text:"ไฟจราจร"},{id:"post",text:"ไปรษณีย์"}],answerId:"zentrum",hint:"ฟังเสียง Z ต้นคำ",explanation:"เสียงสังเคราะห์พูดว่า das Zentrum"}
  ]},
  {id:"L14-GR-NOTICE",lessonId:"L14",category:"grammar",patternId:"GR-01",title:"สังเกตรูปคำในตาราง",difficulty:1,primaryCompetency:"grammar.pattern-noticing",topicIds:["l14-local-prepositions"],questions:[
    {id:"l14-notice-1",kind:"matching",prompt:"จับคู่คำนำหน้ากับรูปย่อ",left:[{id:"in",text:"in + dem"},{id:"an",text:"an + dem"}],right:[{id:"im",text:"im"},{id:"am",text:"am"}],answerPairs:{in:"im",an:"am"},hint:"ตัด e และรวมคำ",explanation:"in dem → im; an dem → am"},
    {id:"l14-notice-2",kind:"matching",prompt:"จับคู่คำถามกับกรณีที่ใช้",left:[{id:"wo",text:"Wo? ตำแหน่ง"},{id:"wohin",text:"Wohin? ทิศทาง"}],right:[{id:"dat",text:"Dativ"},{id:"akk",text:"Akkusativ ในตัวอย่าง in + สถานที่"}],answerPairs:{wo:"dat",wohin:"akk"},hint:"เทียบ Ich bin ... กับ Ich gehe ...",explanation:"Wo? ใช้ Dativ; Wohin? ในตัวอย่างนี้ใช้ Akkusativ"}
  ]},
  {id:"L13-GR-DAT-MATCH",lessonId:"L13",category:"grammar",patternId:"GR-04",title:"จับคู่ Nominativ กับ Dativ",difficulty:1,primaryCompetency:"grammar.dative-pronoun-form",topicIds:["l13-dative-pronouns"],questions:[
    {id:"l13-dat-match-1",kind:"matching",prompt:"จับคู่สรรพนามกับรูป Dativ",left:[{id:"ich",text:"ich"},{id:"du",text:"du"},{id:"er",text:"er"}],right:[{id:"mir",text:"mir"},{id:"dir",text:"dir"},{id:"ihm",text:"ihm"}],answerPairs:{ich:"mir",du:"dir",er:"ihm"},hint:"รูป Dativ ของ ich คือ mir",explanation:"ich→mir, du→dir, er→ihm"},
    {id:"l13-dat-match-2",kind:"matching",prompt:"จับคู่สรรพนามกับรูป Dativ",left:[{id:"sie",text:"sie"},{id:"wir",text:"wir"},{id:"ihr",text:"ihr"}],right:[{id:"euch",text:"euch"},{id:"uns",text:"uns"},{id:"ihnen",text:"ihnen"}],answerPairs:{sie:"ihnen",wir:"uns",ihr:"euch"},hint:"ระวัง ihr เปลี่ยนเป็น euch",explanation:"sie/Sie→ihnen; wir→uns; ihr→euch"}
  ]},
  {id:"L13-GR-TRANSFORM",lessonId:"L13",category:"grammar",patternId:"GR-06",title:"แปลงประโยคด้วย gefallen",difficulty:3,primaryCompetency:"grammar.dative-transformation",topicIds:["l13-dativ-verben"],questions:[
    cloze("l13-transform-1","แทน Ich finde den Park gut. ด้วยโครงสร้าง gefallen","___","Der Park gefällt mir.","สิ่งที่ชอบเป็นประธาน; ich เปลี่ยนเป็น mir","Der Park gefällt mir."),
    cloze("l13-transform-2","แทน Ich finde die Stadt gut. ด้วยโครงสร้าง gefallen","___","Die Stadt gefällt mir.","เพศหญิงใช้ gefällt; ผู้พูดเป็น mir","Die Stadt gefällt mir.")
  ]},
  {id:"L13-GR-ROLES",lessonId:"L13",category:"grammar",patternId:"GR-07",title:"แยกผู้กระทำกับผู้รับ",difficulty:2,primaryCompetency:"grammar.semantic-roles",topicIds:["l13-dative-verben"],questions:[
    mc("l13-roles-1","ใน ‘Ich helfe dir.’ ใครได้รับความช่วยเหลือ?",["ich","dir","helfe"],1,"คำถาม Wem? ใช้ถามผู้รับ","dir เป็นผู้ได้รับความช่วยเหลือและอยู่ใน Dativ"),
    mc("l13-roles-2","ใน ‘Der Park gefällt mir.’ ใครรู้สึกชอบ?",["der Park","mir","gefällt"],1,"ผู้รู้สึกชอบอยู่ใน Dativ","mir คือผู้รู้สึกชอบ")
  ]},
  {id:"L13-GR-ERROR",lessonId:"L13",category:"grammar",patternId:"GR-08",title:"หาและแก้จุดผิด",difficulty:3,primaryCompetency:"grammar.error-correction",topicIds:["l13-es-gibt-akk","l13-dative-pronouns"],questions:[
    {id:"l13-error-1",kind:"true_false_evidence",passage:"Es gibt einen Hafen.",statement:"ประโยคนี้ใช้รูป Akkusativ ของ der Hafen ถูกต้อง",answer:true,evidence:"einen Hafen",hint:"หลัง es gibt ใช้ Akkusativ",explanation:"ประโยคถูกต้อง; der Hafen เปลี่ยนเป็น einen Hafen"},
    {id:"l13-error-2",kind:"true_false_evidence",passage:"Der Park gefällt ich.",statement:"ประโยคนี้ถูกต้องตามหลัก Dativ",answer:false,evidence:"รูปที่ควรใช้คือ ‘Der Park gefällt mir.’",hint:"gefallen ต้องการ Dativ",explanation:"แก้เป็น Der Park gefällt mir. เพราะ ich เปลี่ยนเป็น mir ใน Dativ"}
  ]},
  {id:"L13-RED-MATCH",lessonId:"L13",category:"phrases",patternId:"RED-02",title:"จับคู่คำถามกับคำตอบ",difficulty:1,primaryCompetency:"phrases.conversation-function",topicIds:["l13-favorite-place"],questions:[
    {id:"l13-red-match-1",kind:"matching",prompt:"จับคู่คำถามและคำตอบเกี่ยวกับสถานที่",left:[{id:"q1",text:"Was ist dein Lieblingsort?"},{id:"q2",text:"Warum gefällt dir der Park?"}],right:[{id:"a1",text:"Mein Lieblingsort ist der Park."},{id:"a2",text:"Dort treffe ich Freunde."}],answerPairs:{q1:"a1",q2:"a2"},hint:"คำถามแรกถามชื่อสถานที่; คำถามที่สองถามเหตุผล",explanation:"เลือกคำตอบให้ตรงหน้าที่ของคำถาม"},
    {id:"l13-red-match-2",kind:"matching",prompt:"จับคู่คำถามกับคำตอบ",left:[{id:"q3",text:"Gibt es einen See?"},{id:"q4",text:"Gefällt dir die Altstadt?"}],right:[{id:"a3",text:"Ja, es gibt einen See."},{id:"a4",text:"Ja, sie gefällt mir."}],answerPairs:{q3:"a3",q4:"a4"},hint:"ดูคำกริยาในคำถาม",explanation:"คำตอบอ้างรูปประโยคของคำถามเดิม"}
  ]},
  {id:"L13-RED-CATEGORIZE",lessonId:"L13",category:"phrases",patternId:"RED-03",title:"จัดกลุ่มตามเจตนาการพูด",difficulty:1,primaryCompetency:"phrases.intent",topicIds:["l13-favorite-place"],questions:[
    {id:"l13-red-sort-1",kind:"categorization",prompt:"แยกคำถามกับการแสดงความคิดเห็น",buckets:[{id:"ask",text:"ถาม"},{id:"opinion",text:"แสดงความคิดเห็น"}],items:[{id:"what",text:"Was ist dein Lieblingsort?"},{id:"like",text:"Der Park gefällt mir."}],answerBuckets:{what:"ask",like:"opinion"},hint:"เครื่องหมาย ? ช่วยบอกคำถาม",explanation:"Was ist...? เป็นคำถาม; gefällt mir แสดงความเห็น"},
    {id:"l13-red-sort-2",kind:"categorization",prompt:"จัดกลุ่มประโยคตามหน้าที่",buckets:[{id:"ask",text:"ถามหาข้อมูล"},{id:"answer",text:"ให้ข้อมูล"}],items:[{id:"wo",text:"Wo ist der Markt?"},{id:"there",text:"Es gibt einen Markt."}],answerBuckets:{wo:"ask",there:"answer"},hint:"แยกประโยคคำถามและบอกเล่า",explanation:"Wo ist...? ถามตำแหน่ง; Es gibt... ให้ข้อมูลว่ามีสถานที่"}
  ]},
  {id:"L14-RED-CLOZE",lessonId:"L14",category:"phrases",patternId:"RED-05",title:"เติมบทสนทนาถามทาง",difficulty:2,primaryCompetency:"phrases.context",topicIds:["l14-directions"],questions:[
    cloze("l14-red-cloze-1","เติมคำสุภาพเพื่อเริ่มถามทาง","___, wo ist die Post?","Entschuldigung","ใช้คำขึ้นต้นเมื่อขอความช่วยเหลือ","Entschuldigung, wo ist die Post?"),
    cloze("l14-red-cloze-2","เติมคำขอบคุณ","Vielen ___.","Dank","Vielen Dank เป็นสำนวนขอบคุณ","Vielen Dank! = ขอบคุณมาก")
  ]},
  {id:"L14-HOE-EASY",lessonId:"L14",category:"listening",patternId:"HOE-01",title:"ฟังคำแล้วเลือกภาพ",difficulty:1,primaryCompetency:"listening.phonological-recognition",topicIds:["l14-city-places"],questions:[
    {id:"l14-hear-picture-1",kind:"audio_mcq",prompt:"ฟังคำแล้วเลือกภาพที่ตรงกัน",audioText:"die Ampel",options:[{id:"ampel",text:"ไฟจราจร"},{id:"post",text:"ไปรษณีย์"},{id:"bank",text:"ธนาคาร"}],answerId:"ampel",hint:"ฟังคำขึ้นต้นด้วย Am-",explanation:"เสียงสังเคราะห์พูดว่า die Ampel"},
    {id:"l14-hear-picture-2",kind:"audio_mcq",prompt:"ฟังคำแล้วเลือกสถานที่",audioText:"die Post",options:[{id:"post",text:"ที่ทำการไปรษณีย์"},{id:"zentrum",text:"ใจกลางเมือง"},{id:"polizei",text:"ตำรวจ"}],answerId:"post",hint:"ฟังเสียงสั้น ๆ ว่า Post",explanation:"เสียงสังเคราะห์พูดว่า die Post"}
  ]},
  {id:"L14-HOE-SEQUENCE",lessonId:"L14",category:"listening",patternId:"HOE-05",title:"ฟังแล้วเรียงบทสนทนา",difficulty:2,primaryCompetency:"listening.sequencing",topicIds:["l14-directions"],questions:[
    {id:"l14-hear-seq-1",kind:"dialogue_builder",prompt:"ฟังแล้วเรียงบทสนทนาตามลำดับ",audioText:"Entschuldigung, wo ist die Bank? Die Bank ist neben dem Café. Vielen Dank!",turns:[{id:"ask",text:"Entschuldigung, wo ist die Bank?"},{id:"answer",text:"Die Bank ist neben dem Café."},{id:"thanks",text:"Vielen Dank!"}],acceptedOrders:[["ask","answer","thanks"]],hint:"ฟังคำถามก่อน แล้วตามด้วยคำตอบ",explanation:"ลำดับ: ถามทาง → บอกตำแหน่ง → ขอบคุณ"},
    {id:"l14-hear-seq-2",kind:"dialogue_builder",prompt:"ฟังแล้วเรียงขั้นตอนเส้นทาง",audioText:"Gehen Sie geradeaus. Dann gehen Sie an der Ampel nach links. Die Post ist dort.",turns:[{id:"straight",text:"Gehen Sie geradeaus."},{id:"left",text:"An der Ampel nach links."},{id:"post",text:"Die Post ist dort."}],acceptedOrders:[["straight","left","post"]],hint:"ฟัง Dann เพื่อหาขั้นที่สอง",explanation:"เรียงตามสัญญาณคำสั่งในเสียง"}
  ]},
  {id:"L13-LES-HEADINGS",lessonId:"L13",category:"reading",patternId:"LES-01",title:"จับคู่หัวข้อกับข้อความ",difficulty:1,primaryCompetency:"reading.gist",topicIds:["l13-city-blog"],questions:[
    {id:"l13-headings-1",kind:"matching",prompt:"จับคู่ใจความกับหัวข้อ",left:[{id:"maria",text:"Maria besucht den Markt und kauft Obst."},{id:"jan",text:"Jan spielt mit Freunden im Park."}],right:[{id:"shopping",text:"Ein Besuch auf dem Markt"},{id:"friends",text:"Im Park mit Freunden"}],answerPairs:{maria:"shopping",jan:"friends"},hint:"หาคำที่ซ้ำกันหรือความหมายใกล้เคียง",explanation:"ตลาดและผลไม้ตรงกับการซื้อของ; เล่นกับเพื่อนตรงกับสวนสาธารณะ"},
    {id:"l13-headings-2",kind:"matching",prompt:"จับคู่ย่อหน้ากับหัวข้อ",left:[{id:"lake",text:"Wir fahren am Wochenende zum See."},{id:"oldtown",text:"Die Altstadt ist sehr schön."}],right:[{id:"trip",text:"Ein Ausflug am Wochenende"},{id:"town",text:"Ein Spaziergang durch die Altstadt"}],answerPairs:{lake:"trip",oldtown:"town"},hint:"เลือกหัวข้อที่ครอบคลุมใจความทั้งประโยค",explanation:"See เป็นจุดหมายของทริป; Altstadt เป็นสถานที่เดินชม"}
  ]},
  {id:"L13-SCH-PLAN",lessonId:"L13",category:"writing",patternId:"SCH-01",title:"วางแผนด้วยคำสำคัญก่อนเขียน",difficulty:1,primaryCompetency:"writing.planning",topicIds:["l13-favorite-place"],questions:[
    {id:"l13-plan-1",kind:"text_response",prompt:"จดคำสำคัญ 3 ช่องก่อนเขียน: สถานที่ / เหตุผล / ทำอะไรที่นั่น",minimumWords:3,targetPhrases:["Mein Lieblingsort ist"],rubric:["มีชื่อสถานที่","บอกเหตุผล","บอกกิจกรรม"],hint:"เขียนเป็นคำสั้น ๆ ก่อน ยังไม่ต้องเป็นประโยคเต็ม",explanation:"นี่เป็นขั้นวางแผน ไม่ใช่งานเขียนปลายทาง"},
    {id:"l13-plan-2",kind:"text_response",prompt:"เติมแผนสั้น ๆ: เมือง / สถานที่ที่มี / สถานที่ที่อยากไป",minimumWords:3,targetPhrases:["Es gibt"],rubric:["ระบุเมือง","มีสถานที่อย่างน้อยหนึ่งแห่ง","เลือกสถานที่ที่อยากไป"],hint:"ใช้คำศัพท์ Orte in der Stadt",explanation:"ใช้รายการนี้ต่อยอดเป็นย่อหน้าในงานเขียน"}
  ]},
  {id:"L14-SCH-EMAIL",lessonId:"L14",category:"writing",patternId:"SCH-04",title:"เขียนข้อความอธิบายเมือง",difficulty:3,primaryCompetency:"writing.functional-text",topicIds:["l14-directions"],questions:[
    {id:"l14-email-1",kind:"text_response",prompt:"เขียนข้อความสั้นถึงเพื่อน บอกว่าคุณอยู่ที่ไหนและจะพบกันอย่างไร",minimumWords:8,targetPhrases:["Ich bin","Wir treffen uns"],rubric:["ระบุจุดนัดพบ","ใช้วลี Ich bin ...","บอกว่าจะพบกันตรงไหน"],hint:"ใช้ im/am บอกตำแหน่ง",explanation:"เขียนร่างและตรวจด้วย checklist; ไม่ตัดสินคำตอบปลายเปิดอัตโนมัติ"},
    {id:"l14-email-2",kind:"text_response",prompt:"เขียนข้อความตอบเพื่อนที่ถามทางไป Post โดยบอกเส้นทางสั้น ๆ",minimumWords:8,targetPhrases:["Gehen Sie","Die Post"],rubric:["บอกทิศทาง","มีจุดสังเกต","ระบุ Post เป็นจุดหมาย"],hint:"เริ่มด้วย Gehen Sie geradeaus ...",explanation:"ตรวจความครบถ้วนด้วยรายการตรวจด้านล่าง"}
  ]},
];

export const l13L14PracticeSets: readonly PracticeSet[] = [...practiceSetDrafts.map((set) => {
  const pattern = allCourseExercisePatterns.find((entry) => entry.id === set.patternId);
  if (!pattern) throw new Error(`Unknown exercise pattern ${set.patternId}`);
  return { ...set, sourceRefs: pattern.sourceRefs, isOriginalPractice: true as const };
}), ...supplementalPracticeSets, ...arbeitsbuchPracticeSets];

export function practiceSetsFor(lessonId: CourseLessonId, category: CourseCategory) {
  return l13L14PracticeSets.filter((set) => set.lessonId === lessonId && set.category === category);
}
