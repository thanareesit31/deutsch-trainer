import type { PracticeSet } from "./l13-l14-course-exercises";
import type { CodewordQuestion, TextMarkingQuestion, CourseQuestion, SourceRef } from "./l13-l14-course";

const content = (page:number):SourceRef => ({sourceId:"momente-kursbuch-a12",printedPage:page,pdfPage:page,relation:"source_topic"});
const template = (page:number,pdfPage:number,activity:string):SourceRef => ({sourceId:"momente-arbeitsbuch-a12",printedPage:page,pdfPage,activity,relation:"exercise_mechanic"});
const authored:SourceRef = {sourceId:"original",relation:"original_practice"};
function marking(id:string,text:string,answerRoles:TextMarkingQuestion["answerRoles"],explanation:string):TextMarkingQuestion {
  return {id,kind:"text_marking",prompt:"อ่านข้อความ เลือกปากกา ‘กริยา’ หรือ ‘Dativ’ แล้วทำเครื่องหมายคำที่เกี่ยวข้องให้ครบ",tokens:text.split(" "),answerRoles,hint:"มองหากริยา gefallen, helfen, danken, gehören และสรรพนามที่รับ Dativ อย่าทำเครื่องหมายประธาน",explanation};
}
function cloze(id:string,prompt:string,sentence:string,answer:string,hint:string,explanation:string,assetId?:string):CourseQuestion {
  return {id,kind:"cloze",wrongExplanation:id.includes("ort")?"คำถาม Wo? ต้องใช้คำบุพบทบอกตำแหน่งและ Artikel รูป Dativ ตามคำนามที่ตามมา ลองตรวจให้ครบทั้งวลี":"ตรวจว่าประธานเป็นเอกพจน์หรือพหูพจน์ แล้วผันกริยาตามประธาน สรรพนาม Dativ เป็นผู้รับและไม่ได้กำหนดรูปกริยา",prompt,sentence,acceptedAnswers:[answer],hint,explanation,...(assetId?{assetId}:{})};
}
function riddle(id:string,solution:string,clues:CodewordQuestion["clues"]):CodewordQuestion {
  return {id,kind:"codeword_riddle",prompt:"แก้คำใบ้ภาษาไทย พิมพ์คำเยอรมัน แล้วนำอักษรในช่องที่ระบุมาประกอบเป็นคำรหัสสุดท้าย",clues,solution,hint:"เริ่มจากคำสถานที่ที่นึกออกก่อน อักษรที่เลือกจากแต่ละคำจะช่วยหาคำรหัส",explanation:`คำรหัสคือ ${solution} — อักษรแต่ละตัวต้องมาจากคำที่สะกดถูกในช่องที่กำหนด ไม่ใช่เดาคำรหัสเพียงอย่างเดียว`};
}
export const arbeitsbuchPracticeSets:readonly PracticeSet[] = [
  {
    id:"L13-AB-MARK",lessonId:"L13",category:"grammar",patternId:"AB-GR-MARK",title:"สังเกตกริยาและ Dativ ในข้อความ",difficulty:1,learningStage:"recognition",primaryCompetency:"grammar.dative",secondaryCompetencies:["reading.noticing"],topicIds:["L13-verben-mit-dativ","L13-dativ-pronomen"],isOriginalPractice:true,sourceRefs:[content(11),template(8,7,"L13/7a"),authored],
    questions:[
      marking("l13-ab-mark-1","Der Park gefällt mir . Ich danke dir .",{"2":"verb","3":"dative","6":"verb","7":"dative"},"gefällt รับ mir; danke รับ dir ส่วน Der Park และ Ich เป็นประธาน จึงไม่ทำเครื่องหมายเป็น Dativ"),
      marking("l13-ab-mark-2","Das Buch gehört uns . Maria hilft ihm .",{"2":"verb","3":"dative","6":"verb","7":"dative"},"gehört uns = เป็นของพวกเรา; hilft ihm = ช่วยเขา กริยาทั้งสองใช้ Dativ"),
      marking("l13-ab-mark-3","Ich helfe Ihnen . Der See gefällt ihr .",{"1":"verb","2":"dative","6":"verb","7":"dative"},"helfe ใช้กับ Ihnen แบบสุภาพ; gefällt ใช้กับ ihr เมื่อกล่าวถึงผู้หญิงหนึ่งคน"),
    ],
  },
  {
    id:"L13-AB-DATIV-BANK",builtInSupport:true,lessonId:"L13",category:"grammar",patternId:"AB-GR-BANK",title:"เติม Dativ จากผู้พูดและผู้รับ",difficulty:2,learningStage:"guided_recall",primaryCompetency:"grammar.dative",secondaryCompetencies:["reading.context"],topicIds:["L13-dativ-pronomen","L13-verben-mit-dativ"],isOriginalPractice:true,sourceRefs:[content(11),template(8,7,"L13/8a"),template(86,85,"Noch mehr! L13/6 ★"),authored],
    questions:[
      {id:"l13-ab-bank-1",kind:"context_bank",wrongExplanation:"กริยาเหล่านี้รับ Dativ แยกผู้รับที่เป็นฉันกับเธอ และอย่าใช้รูปประธาน ich/du",prompt:"อ่านประธานในวงเล็บ แล้วใช้แต่ละคำจากคลังหนึ่งครั้ง",segments:["Der Park gefällt ",". (ich) Ich helfe ",". (du)"],bank:["dir","mir"],answers:["mir","dir"],hint:"ich → mir; du → dir เมื่อเป็นผู้รับ Dativ",explanation:"ผู้ที่ชอบสวนคือ ich จึงใช้ mir; ผู้ที่ฉันช่วยคือ du จึงใช้ dir"},
      {id:"l13-ab-bank-2",kind:"context_bank",wrongExplanation:"ผู้รับสองช่องเป็นคนละบุรุษ: พวกเรากับเขาหนึ่งคน ไม่เลือกสรรพนามตามเพศของ Buch หรือ See",prompt:"เติมรูป Dativ ตามคนที่กล่าวถึง",segments:["Das Buch gehört ",". (wir) Der See gefällt ",". (er)"],bank:["ihm","uns"],answers:["uns","ihm"],hint:"wir → uns และ er → ihm",explanation:"gehört uns หมายถึงเป็นของพวกเรา; gefällt ihm หมายถึงเขาชอบ"},
      {id:"l13-ab-bank-3",kind:"context_bank",wrongExplanation:"ช่องแรกพูดสุภาพกับผู้ฟัง จึงต้องขึ้นต้นตัวใหญ่ อีกช่องกล่าวถึง Maria ซึ่งเป็นผู้หญิงหนึ่งคน",caseSensitive:true,prompt:"แยกคำสุภาพออกจากการกล่าวถึงผู้หญิงหนึ่งคน โดยเขียน Ihnen ด้วยตัวพิมพ์ใหญ่",segments:["Frau Weber, ich danke ","! (Sie) Der Park gefällt ",". (sie: Maria)"],bank:["ihr","Ihnen"],answers:["Ihnen","ihr"],hint:"สุภาพ Sie ใช้ Ihnen; Maria เป็น sie เอกพจน์ ใช้ ihr",explanation:"Ihnen คือ Dativ แบบสุภาพ ส่วน ihr ใช้แทนผู้หญิงหนึ่งคน ไม่ใช่ชื่อเพศของสถานที่"},
      {id:"l13-ab-bank-4",kind:"context_bank",wrongExplanation:"แยกกลุ่มผู้ฟัง (ihr) จากกลุ่มคนที่กล่าวถึง (sie) ทั้งสองช่องต้องเป็นรูป Dativ",prompt:"เติม Dativ ของกลุ่มผู้ฟังและกลุ่มบุคคลที่กล่าวถึง",segments:["Das Café gefällt ",". (ihr) Wir danken ",". (sie: Anna und Tom)"],bank:["ihnen","euch"],answers:["euch","ihnen"],hint:"กลุ่มผู้ฟัง ihr ใช้ euch; sie พหูพจน์ใช้ ihnen",explanation:"euch ใช้กับพวกเธอ; ihnen ใช้กับพวกเขา ทั้งสองเป็น Dativ ไม่ใช่รูปประธาน"},
    ],
  },
  {
    id:"L13-AB-VERBS",lessonId:"L13",category:"grammar",patternId:"GR-05",title:"ผันกริยา Dativ ในบทสนทนา",difficulty:3,learningStage:"controlled_production",primaryCompetency:"grammar.dative-verbs",secondaryCompetencies:["reading.context"],topicIds:["L13-verben-mit-dativ"],isOriginalPractice:true,sourceRefs:[content(11),template(8,7,"L13/6"),authored],
    questions:[
      cloze("l13-ab-verb-1","เติมรูปของ helfen ให้สัมพันธ์กับ Ich","Ich ___ dir gern.","helfe","Ich ใช้รูปที่ลงท้าย -e","Ich helfe dir gern. — ฉันยินดีช่วยเธอ; ich ใช้ helfe"),
      cloze("l13-ab-verb-2","เติมรูปของ gefallen ให้สัมพันธ์กับ Der Park","Der Park ___ uns.","gefällt","ประธานคือ Der Park หนึ่งแห่ง ไม่ใช่ uns","Der Park เป็นประธานเอกพจน์ จึงใช้ gefällt แม้ผู้ที่ชอบจะเป็นพวกเรา (uns)"),
      cloze("l13-ab-verb-3","เติมรูปของ gehören ให้สัมพันธ์กับ Die Bücher","Die Bücher ___ mir.","gehören","Bücher เป็นพหูพจน์; mir เป็นผู้ครอบครอง","Die Bücher gehören mir. ใช้ gehören ตามประธานพหูพจน์ ไม่ผันตาม mir"),
    ],
  },
  {
    id:"L14-AB-CODEWORD",lessonId:"L14",category:"vocabulary",patternId:"AB-VOC-CODE",title:"แก้คำใบ้แล้วถอดคำรหัส",difficulty:4,learningStage:"independent_recall",primaryCompetency:"vocabulary.retrieval",secondaryCompetencies:["vocabulary.spelling"],topicIds:["L14-orte-in-der-stadt","L13-ort-in-der-stadt"],isOriginalPractice:true,sourceRefs:[content(10),content(11),content(14),template(12,11,"L14/8"),authored],
    questions:[
      riddle("l14-ab-code-1","PARK",[{id:"post",clueTh:"สถานที่ส่งจดหมาย (die)",answer:"POST",extractIndex:0},{id:"park",clueTh:"พื้นที่สีเขียวสำหรับเดินพักผ่อน (der)",answer:"PARK",extractIndex:1},{id:"rathaus",clueTh:"ศาลาว่าการเมือง (das)",answer:"RATHAUS",extractIndex:0},{id:"kirche",clueTh:"โบสถ์ (die)",answer:"KIRCHE",extractIndex:0}]),
      riddle("l14-ab-code-2","BANK",[{id:"bank",clueTh:"สถานที่ทำธุรกรรมเงิน (die)",answer:"BANK",extractIndex:0},{id:"rathaus",clueTh:"อาคารบริหารงานเมือง (das)",answer:"RATHAUS",extractIndex:1},{id:"brunnen",clueTh:"น้ำพุในเมือง (der)",answer:"BRUNNEN",extractIndex:3},{id:"kirche",clueTh:"สถานที่ประกอบพิธีทางศาสนาคริสต์ (die)",answer:"KIRCHE",extractIndex:0}]),
      riddle("l14-ab-code-3","POST",[{id:"park",clueTh:"สวนสาธารณะ (der)",answer:"PARK",extractIndex:0},{id:"post",clueTh:"ไปรษณีย์ (die)",answer:"POST",extractIndex:1},{id:"see",clueTh:"ทะเลสาบ (der)",answer:"SEE",extractIndex:0},{id:"rathaus",clueTh:"ศาลาว่าการ (das)",answer:"RATHAUS",extractIndex:2}]),
    ],
  },
  {
    id:"L14-AB-ORT",lessonId:"L14",category:"grammar",patternId:"GR-05",title:"บอกตำแหน่งจากผังด้วย Dativ",difficulty:3,learningStage:"contextual_application",primaryCompetency:"grammar.local-prepositions",secondaryCompetencies:["reading.visual"],topicIds:["L14-wo-dativ-lokale-praepositionen"],isOriginalPractice:true,sourceRefs:[content(14),content(15),template(11,10,"L14/6"),template(87,86,"Noch mehr! L14/9 ★"),authored],
    questions:[
      cloze("l14-ab-ort-1","ดูผัง: เติมวลี ‘ข้างร้านกาแฟ’ ให้ครบ","Die Bank ist ___.","neben dem Café","Café เป็น das; คำถาม Wo? ใช้ Dativ จึงเป็น dem Café","neben dem Café บอกตำแหน่งข้างร้านกาแฟ; das Café เปลี่ยนเป็น dem Café", "l14-local-position"),
      cloze("l14-ab-ort-2","ดูผัง: ธนาคารอยู่ข้างร้านกาแฟ กลับมุมมองให้บอกว่า ‘ข้างธนาคาร’","Das Café ist ___.","neben der Bank","Bank เป็น die; Dativ ใช้ der Bank","เมื่อ Café อยู่ข้าง Bank ใช้ neben der Bank ไม่ใช่ neben die Bank", "l14-local-position"),
      cloze("l14-ab-ort-3","เพื่อนถาม Wo bist du? คุณอยู่ข้างไปรษณีย์ เติมวลีให้ครบ","Ich bin ___.","neben der Post","Post เป็น die และตำแหน่งใช้ Dativ","Ich bin neben der Post. = ฉันอยู่ข้างไปรษณีย์; die Post → der Post ใน Dativ"),
    ],
  },
  {
    id:"L14-AB-DIALOG",builtInSupport:true,lessonId:"L14",category:"phrases",patternId:"AB-RED-BANK",title:"เลือกสำนวนให้บทสนทนาถามทางต่อเนื่อง",difficulty:4,learningStage:"contextual_application",primaryCompetency:"phrases.directions",secondaryCompetencies:["reading.context"],topicIds:["L14-nach-dem-weg-fragen"],isOriginalPractice:true,sourceRefs:[content(16),template(13,12,"L14/13"),authored],
    questions:[
      {id:"l14-ab-dialog-1",kind:"context_bank",wrongExplanation:"วลีแรกใช้ขอความช่วยเหลือ วลีท้ายใช้ขอบคุณหลังได้รับคำบอกทาง",prompt:"เติมบทสนทนาสุภาพโดยใช้แต่ละวลีหนึ่งครั้ง",segments:["Entschuldigung, ","? — Ja, gern. — Ich suche die Post. — Gehen Sie geradeaus. — ","!"],bank:["Vielen Dank","können Sie mir helfen"],answers:["können Sie mir helfen","Vielen Dank"],hint:"เริ่มขอความช่วยเหลือและจบด้วยการขอบคุณ",explanation:"können Sie mir helfen? ใช้ขอความช่วยเหลือ; Vielen Dank! ใช้ขอบคุณหลังได้รับคำบอกทาง"},
      {id:"l14-ab-dialog-2",kind:"context_bank",wrongExplanation:"คำถามแรกถามตำแหน่งธนาคาร คำตอบสุดท้ายต้องตอบเรื่องระยะทาง",prompt:"เลือกวลีตามเจตนาของผู้พูด",segments:["Entschuldigung, ","? — Die Bank ist neben dem Café. — Ist das weit? — Nein, ","."],bank:["das ist gar nicht weit","wo ist die Bank"],answers:["wo ist die Bank","das ist gar nicht weit"],hint:"คำถามแรกถามหาธนาคาร; คำตอบสุดท้ายบอกว่าใกล้",explanation:"wo ist die Bank? ถามตำแหน่ง; das ist gar nicht weit บอกว่าอยู่ใกล้ ไม่ใช่คำสั่งให้เดิน"},
      {id:"l14-ab-dialog-3",kind:"context_bank",wrongExplanation:"ผู้ถูกถามต้องอธิบายว่าไม่รู้ทาง แล้วผู้ถามตอบรับอย่างสุภาพ",prompt:"เติมคำตอบเมื่อผู้ถูกถามไม่รู้เส้นทาง",segments:["Wo ist die Apotheke? — Tut mir leid. ",". — Oh, ",". Danke schön!"],bank:["kein Problem","Ich bin nicht von hier"],answers:["Ich bin nicht von hier","kein Problem"],hint:"คนตอบบอกว่าไม่ใช่คนแถวนี้; คนถามตอบรับอย่างสุภาพ",explanation:"Ich bin nicht von hier บอกเหตุผลที่ไม่รู้ทาง; kein Problem ตอบรับโดยไม่ตำหนิผู้ถูกถาม"},
    ],
  },
];
