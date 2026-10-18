"use client";
import { useState } from "react";
import type { ContextBankQuestion, WordSearchQuestion } from "../lib/l13-l14-course";
import { gradeContext, gradeSearch, searchMatch, searchPath } from "../lib/l13-l14-supplemental-grading";

type Props={question:WordSearchQuestion|ContextBankQuestion;onAnswer:(answer:string,correct:boolean,hints:number)=>void};
export function SupplementalActivity({question,onAnswer}:Props) {
  const [start,setStart]=useState<number|null>(null);
  const [paths,setPaths]=useState<[number,number][]>([]);
  const [answers,setAnswers]=useState<string[]>(question.kind==="context_bank"?question.answers.map(()=>""):[]);
  const [hints,setHints]=useState(0);
  const [feedback,setFeedback]=useState("");
  function check() {
    const correct=question.kind==="word_search"?gradeSearch(question,paths):gradeContext(question,answers);
    setFeedback(correct?question.explanation:question.kind==="context_bank"&&question.wrongExplanation?`ยังไม่ครบหรือยังมีคำที่ไม่ตรง: ${question.wrongExplanation}`:"ยังไม่ครบหรือยังมีคำที่ไม่ตรง ลองตรวจอีกครั้งได้ครับ");
    onAnswer(JSON.stringify(question.kind==="word_search"?paths:answers),correct,hints);
  }
  function select(index:number) {
    if(question.kind!=="word_search") return;
    if(start===null) {setStart(index);setFeedback("เลือกช่องสุดท้ายของคำในแนวนอนหรือแนวตั้ง");return;}
    const word=searchMatch(question,start,index);
    if(word) {
      if(!paths.some(([a,b])=>searchMatch(question,a,b)===word)) setPaths(old=>[...old,[start,index]]);
      setFeedback(`พบ ${word} — ${question.words.find(entry=>entry.word===word)?.meaning}`);
    } else setFeedback("ช่วงที่เลือกยังไม่ใช่คำเป้าหมาย เลือกจุดเริ่มและจุดจบใหม่ได้");
    setStart(null);
  }
  const found=question.kind==="word_search"?new Set(paths.map(([a,b])=>searchMatch(question,a,b))):new Set<string>();
  const highlighted=question.kind==="word_search"?new Set(paths.flatMap(([a,b])=>searchPath(question.grid,a,b))):new Set<number>();
  return <section className="a13-supplemental" aria-label={question.kind==="word_search"?"ตารางค้นคำ":"ข้อความเติมคำ"}>
    {question.kind==="word_search"?<>
      <ul>{question.words.map(entry=><li key={entry.word}>{found.has(entry.word)?"✓ ":""}{question.showWords?`${entry.word} · ${entry.meaning}`:entry.meaning}</li>)}</ul>
      <p>แตะจุดเริ่ม แล้วแตะจุดจบ · ใช้ Tab และ Enter บนแป้นพิมพ์ได้ · พบแล้ว {found.size}/{question.words.length}</p>
      <div className="a13-word-search" style={{gridTemplateColumns:`repeat(${question.grid[0].length}, minmax(0, 1fr))`}}>{question.grid.flatMap((row,r)=>[...row].map((letter,c)=>{const index=r*row.length+c;return <button key={index} type="button" aria-label={`แถว ${r+1} คอลัมน์ ${c+1} ${letter}`} aria-pressed={highlighted.has(index)||start===index} className={highlighted.has(index)?"found":start===index?"selected":""} onClick={()=>select(index)}>{letter}</button>;}))}</div>
      {start!==null&&<button type="button" onClick={()=>setStart(null)}>ยกเลิกจุดเริ่ม</button>}
    </>:<>
      <p>คลังคำ: <strong lang="de">{question.bank.join(" · ")}</strong></p>
      <div className="a13-context-bank" lang="de">{question.segments.map((segment,index)=><span key={index}>{segment}{index<question.answers.length&&<input autoComplete="off" spellCheck={false} aria-label={`ช่อง ${index+1}`} value={answers[index]} onChange={event=>setAnswers(old=>old.map((answer,i)=>i===index?event.target.value:answer))}/>}</span>)}</div>
    </>}
    <div className="a13-course-actions"><button type="button" className="button secondary" onClick={()=>{setHints(n=>n+1);if(question.kind==="word_search") {
        const next=question.words.find(word=>!found.has(word.word));
        const width=question.grid[0].length;
        setFeedback(next?`คำใบ้: ${next.meaning} เริ่มที่แถว ${Math.floor(next.start/width)+1} คอลัมน์ ${next.start%width+1}`:"พบครบแล้ว ลองกดตรวจคำตอบ");
      } else setFeedback(`คำใบ้: ${question.hint}`);}}>ขอคำใบ้</button><button type="button" className="button primary" onClick={check}>ตรวจคำตอบ</button></div>
    <p role="status">{feedback}</p>
  </section>;
}
