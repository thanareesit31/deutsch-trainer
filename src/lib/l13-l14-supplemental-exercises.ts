import type { PracticeSet } from "./l13-l14-course-exercises";
import { supplementalExercisePatterns, type WordSearchQuestion, type ContextBankQuestion, type CourseLessonId } from "./l13-l14-course";

function search(id:string, entries:readonly (readonly [string,string])[], showWords:boolean):WordSearchQuestion {
  const width=10;
  const cells=Array.from({length:width},(_,r)=>Array.from({length:width},(_,c)=>"XYZQFLMNUV"[(r*3+c*7)%10]));
  const words=entries.map(([word,meaning],index)=>{
    const vertical=index%2===1;
    const row=vertical?0:index+3;
    const col=vertical?8:0;
    [...word].forEach((letter,i)=>{cells[row+(vertical?i:0)][col+(vertical?0:i)]=letter;});
    return {word,meaning,start:row*width+col,end:(row+(vertical?word.length-1:0))*width+col+(vertical?0:word.length-1)};
  });
  // Placement pairs are deliberately separated; reject overwritten target words during development.
  const grid=cells.map(row=>row.join(""));
  for(const word of words) {
    const step=word.end-word.start===word.word.length-1?1:width;
    if([...word.word].some((letter,i)=>grid[Math.floor((word.start+i*step)/width)][(word.start+i*step)%width]!==letter)) throw new Error(`Overlapping search target ${id}/${word.word}`);
  }
  return {id,kind:"word_search",prompt:showWords?"ค้นคำตามรายการ: เลือกช่องเริ่ม แล้วเลือกช่องสุดท้ายของคำ":"อ่านความหมายไทย แล้วค้นคำเยอรมันในตาราง",grid,words,showWords,hint:`คำแรกเริ่มที่แถว ${Math.floor(words[0].start/width)+1} คอลัมน์ ${words[0].start%width+1}`,explanation:entries.map(([word,meaning])=>`${word} = ${meaning}`).join(" · ")};
}
function context(id:string,segments:readonly string[],answers:readonly string[],bank:readonly string[],hint:string,explanation:string):ContextBankQuestion {
  return {id,kind:"context_bank",prompt:"อ่านข้อความให้ครบ แล้วพิมพ์คำจากคลังลงในแต่ละช่อง ใช้แต่ละคำได้หนึ่งครั้ง",segments,answers,bank,hint,explanation};
}
function set(lessonId:CourseLessonId,kind:"SEARCH"|"CONTEXT",questions:PracticeSet["questions"]):PracticeSet {
  const pattern=supplementalExercisePatterns[kind==="SEARCH"?0:1];
  return {id:`${lessonId}-SUP-${kind}`,lessonId,category:"vocabulary",patternId:pattern.id,title:kind==="SEARCH"?"ค้นคำในตารางอักษร · กิจกรรมเสริม":"เติมข้อความจากคลังคำ · กิจกรรมเสริม",difficulty:kind==="SEARCH"?1:3,primaryCompetency:kind==="SEARCH"?"vocabulary.recognition":"vocabulary.context",secondaryCompetencies:kind==="SEARCH"?["vocabulary.spelling","visual.discrimination"]:["reading.context",lessonId==="L13"?"grammar.dative":"phrases.directions"],topicIds:[lessonId==="L13"?"l13-city-places":"l14-city-places", ...(kind==="CONTEXT" ? (lessonId==="L13" ? ["l13-es-gibt-akk","l13-dative-pronouns"] : ["l14-local-prepositions","l14-directions"]) : [])],questions,sourceRefs:pattern.sourceRefs,isOriginalPractice:true};
}
export const supplementalPracticeSets:readonly PracticeSet[]=[
  set("L13","SEARCH",[
    search("l13-sup-search-1",[["PARK","สวนสาธารณะ"],["SEE","ทะเลสาบ"]],true),
    search("l13-sup-search-2",[["HAFEN","ท่าเรือ"],["KIRCHE","โบสถ์"]],false),
  ]),
  set("L14","SEARCH",[
    search("l14-sup-search-1",[["BANK","ธนาคาร"],["POST","ไปรษณีย์"]],true),
    search("l14-sup-search-2",[["SCHULE","โรงเรียน"],["BAHNHOF","สถานีรถไฟ"]],false),
  ]),
  set("L13","CONTEXT",[
    context("l13-sup-context-1",["Mein Lieblingsort ist der ",". Dort treffe ich meine ",". Der Park gefällt ","."],["Park","Freunde","mir"],["mir","Park","Freunde"],"ช่องแรกเป็นสถานที่สีเขียว; ช่องสุดท้ายคือ Dativ ของ ich","der Park คือสวนสาธารณะ; Freunde คือเพื่อน; gefallen ใช้ mir เพื่อบอกว่าฉันชอบ"),
    context("l13-sup-context-2",["Das ist der ",". Hier gibt es einen ",". Der Markt gefällt ",". (du)"],["Hafen","Markt","dir"],["dir","Hafen","Markt"],"ช่องแรกคือท่าเรือ; du เปลี่ยนเป็น dir หลัง gefallen","der Hafen = ท่าเรือ; einen Markt ใช้ Akkusativ หลัง es gibt; dir คือ Dativ ของ du"),
  ]),
  set("L14","CONTEXT",[
    context("l14-sup-context-1",["Entschuldigung, wo ist die ","? — Gehen Sie "," und dann links. Die Post ist neben der ","."],["Post","geradeaus","Bank"],["Bank","Post","geradeaus"],"เริ่มถามหาไปรษณีย์; คำสั่งแรกให้เดินตรง","Post = ไปรษณีย์; geradeaus = ตรงไป; neben der Bank = ข้างธนาคาร"),
    context("l14-sup-context-2",["Wo ist die ","? — Die Schule ist neben dem ",". — Vielen ","!"],["Schule","Bahnhof","Dank"],["Dank","Bahnhof","Schule"],"Schule คือโรงเรียน; Bahnhof คือสถานีรถไฟ; ท้ายบทสนทนาเป็นคำขอบคุณ","die Schule = โรงเรียน; neben dem Bahnhof = ข้างสถานีรถไฟ; Vielen Dank! = ขอบคุณมาก"),
  ]),
];
