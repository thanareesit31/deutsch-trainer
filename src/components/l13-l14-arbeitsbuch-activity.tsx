"use client";
import {useState} from "react";
import type {CodewordQuestion,TextMarkingQuestion,TextMarkingRole} from "../lib/l13-l14-course";
import {extractCodeword,gradeCodeword,gradeTextMarking} from "../lib/l13-l14-arbeitsbuch-grading";

type Props={question:CodewordQuestion|TextMarkingQuestion;onAnswer:(answer:string,correct:boolean,hints:number)=>void};
export function ArbeitsbuchActivity({question,onAnswer}:Props) {
  const [brush,setBrush]=useState<TextMarkingRole>("verb");
  const [roles,setRoles]=useState<Record<string,TextMarkingRole>>({});
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [solution,setSolution]=useState("");
  const [hints,setHints]=useState(0);
  const [feedback,setFeedback]=useState("");
  function mark(index:string) {
    setRoles(old=>{
      const next={...old};
      if(next[index]===brush) delete next[index]; else next[index]=brush;
      return next;
    });
  }
  function check() {
    const correct=question.kind==="text_marking"?gradeTextMarking(question,roles):gradeCodeword(question,answers,solution);
    let message=question.explanation;
    if(!correct) {
      if(question.kind==="text_marking") message="ยังไม่ตรง: ตรวจให้ครบทั้งกริยาและสรรพนาม Dativ อย่าทำเครื่องหมายประธาน ใช้ปากกาเดิมแตะคำซ้ำเพื่อลบได้";
      else {
        const wrong=question.clues.findIndex(clue=>(answers[clue.id]??"").trim().normalize("NFC").toLocaleUpperCase("de")!==clue.answer);
        message=wrong>=0?`ลองตรวจคำใบ้ข้อ ${wrong+1}: ${question.clues[wrong].clueTh} อีกครั้ง: คำที่พิมพ์ยังไม่ตรงความหมายหรือการสะกด อักษรที่ย้ายมาจะถูกเมื่อคำต้นทางถูก`:"คำศัพท์ครบแล้ว ลองตรวจคำรหัสกับอักษรที่ประกอบด้านล่าง";
      }
    }
    setFeedback(message);
    onAnswer(JSON.stringify(question.kind==="text_marking"?{roles}:{answers,solution}),correct,hints);
  }
  return <section className="a13-ab-activity" aria-label={question.kind==="text_marking"?"ทำเครื่องหมายข้อความ":"ปริศนาคำรหัส"}>
    {question.kind==="text_marking"?<>
      <div role="group" aria-label="เลือกปากกาทำเครื่องหมาย" className="a13-course-actions">
        <button type="button" aria-pressed={brush==="verb"} onClick={()=>setBrush("verb")}>กริยา</button>
        <button type="button" aria-pressed={brush==="dative"} onClick={()=>setBrush("dative")}>Dativ</button>
      </div>
      <p>กริยา = เส้นทึบ · Dativ = เส้นประ · เลือกปากกาเดิมแล้วแตะคำซ้ำเพื่อลบเครื่องหมาย</p>
      <div className="a13-ab-text" lang="de">{question.tokens.map((token,index)=>token==="."?<span key={index}>. </span>:<button key={index} type="button" data-role={roles[index]??"none"} aria-label={`คำที่ ${index+1}: ${token}${roles[index]?` (${roles[index]==="verb"?"กริยา":"Dativ"})`:""}`} aria-pressed={!!roles[index]} onClick={()=>mark(String(index))}>{token}</button>)}</div>
    </>:<>
      <p>พิมพ์เฉพาะคำศัพท์ ไม่ใส่ der/die/das · ช่องอักษรเริ่มนับที่ 1</p>
      <ol className="a13-ab-code-clues">{question.clues.map((clue,index)=><li key={clue.id}>
        <label><span>{clue.clueTh}</span><input aria-label={`คำใบ้ ${index+1}`} value={answers[clue.id]??""} autoComplete="off" spellCheck={false} onChange={event=>setAnswers(old=>({...old,[clue.id]:event.target.value}))}/></label>
        <small>นำอักษรช่องที่ {clue.extractIndex+1} ไปเป็นตัวที่ {index+1} ของคำรหัส</small>
        <div className="a13-ab-code-letters" aria-hidden="true">{[...clue.answer].map((_,letterIndex)=><span key={letterIndex} className={letterIndex===clue.extractIndex?"extracted":""}>{[...(answers[clue.id]??"").trim().toLocaleUpperCase("de")][letterIndex]??" "}</span>)}</div>
      </li>)}</ol>
      <p aria-live="polite">อักษรจากคำที่พิมพ์: <strong lang="de">{extractCodeword(question,answers)}</strong></p>
      <label>คำรหัสสุดท้าย<input aria-label="คำรหัสสุดท้าย" value={solution} autoComplete="off" spellCheck={false} onChange={event=>setSolution(event.target.value)}/></label>
    </>}
    <div className="a13-course-actions">
      <button type="button" className="button secondary" onClick={()=>{setHints(n=>n+1);setFeedback(`คำใบ้: ${question.hint}`);}}>ขอคำใบ้</button>
      <button type="button" className="button primary" onClick={check}>ตรวจคำตอบ</button>
    </div>
    <p role="status">{feedback}</p>
  </section>;
}
