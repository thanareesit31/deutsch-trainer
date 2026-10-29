"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import phraseVariants from "@/data/l14-phrase-variants.json";
import { lessonStateKeys, useLessonState } from "./lesson-state-provider";
import { isL14PhrasePracticeAvailable, isTestWorkspaceUser, useStore } from "./store";
import { phraseQuestionWordMeanings, phraseVisualPrompts, type PhraseVisualPrompt } from "@/lib/l14-phrase-visual-prompts";
import { l14PhrasePracticeTopics, practiceStorageKey } from "@/lib/practice-planner";
import { PhrasePracticeInsights, ResumePracticeDialog } from "./phrase-practice-ui";

function GermanVisualQuestion({ visual }: { visual: PhraseVisualPrompt }) {
  const [active, setActive] = useState<{ index: number; word: string } | null>(null);
  const parts = visual.question.match(/\p{L}+|\s+|[^\p{L}\s]+/gu) ?? [];
  return <>
    <h1 className="l14-visual-question" lang="de">{parts.map((part, index) => /^\p{L}+$/u.test(part)
      ? <button key={index} type="button" className="l14-question-word" aria-pressed={active?.index === index} onClick={() => setActive(active?.index === index ? null : { index, word: part })}>{part}</button>
      : <span key={index}>{part}</span>)}</h1>
    <p className="l14-question-word-help" role="status">{active ? <><strong lang="de">{active.word}</strong> <span>{visual.wordMeanings?.[active.word.toLocaleLowerCase("de-DE")] ?? phraseQuestionWordMeanings[active.word.toLocaleLowerCase("de-DE")]}</span></> : "คลิกคำในโจทย์เพื่อดูคำแปล"}</p>
  </>;
}

type Topic = "ask" | "describe" | "unknown" | "thanks";
type ChoiceTask = { id: string; targetId?: string; topic: Topic; kind: "context" | "dialogue"; prompt: string; options: string[]; answer: string; translation: string; explanation: string; difficulty?: number; difficultyRationale?: string; assistance?: string; subskill?: string };
type OrderTask = { id: string; topic: Topic; kind: "order"; tokens: string[]; answer: string; translation: string; ruleTitle: string; rules: string[]; noteTitle: string; exampleNote: string };
type MatchPair = { id: string; targetId: string; question: string; questionThai: string; answer: string; translation: string };
type MatchTask = { id: string; topic: Topic; kind: "match"; pairs: [MatchPair, MatchPair] };
type Task = ChoiceTask | OrderTask | MatchTask;
const topicInfo: Record<Topic, { title: string; count: number }> = {
  ask: { title: "ถามทาง", count: 5 }, describe: { title: "บอกทาง", count: 6 }, unknown: { title: "บอกว่าไม่รู้ทาง", count: 3 }, thanks: { title: "ขอบคุณ", count: 3 },
};
const topicOrder: Topic[] = ["ask", "describe", "unknown", "thanks"];
const authoredTasks: Task[] = [
  { id:"ask-help",topic:"ask",kind:"dialogue",prompt:"คุณต้องการขอให้คนแถวนั้นช่วยบอกทาง ควรเริ่มพูดว่าอย่างไร",options:["Entschuldigung. Können Sie mir helfen?","Tut mir leid. Ich bin nicht von hier.","Herzlichen Dank."],answer:"Entschuldigung. Können Sie mir helfen?",translation:"ขอโทษครับ/ค่ะ คุณช่วยฉันหน่อยได้ไหม",explanation:"Entschuldigung ใช้เริ่มถามอย่างสุภาพ ส่วน Können Sie mir helfen? ใช้ขอให้อีกฝ่ายช่วย" },
  { id:"ask-place",topic:"ask",kind:"context",prompt:"คุณกำลังหาธนาคารและต้องการถามว่ามีธนาคารอยู่ที่ไหน",options:["Wo ist denn hier eine Bank?","Da sehen Sie eine Bank.","Das ist gar nicht weit."],answer:"Wo ist denn hier eine Bank?",translation:"แถวนี้มีธนาคารอยู่ที่ไหน",explanation:"Wo ist …? ใช้ถามตำแหน่ง ส่วน eine Bank ระบุสถานที่ที่กำลังหา" },
  { id:"ask-far",topic:"ask",kind:"dialogue",prompt:"อีกฝ่ายเพิ่งบอกทางไปสถานีรถไฟ คุณอยากถามต่อว่าไกลมากไหม",options:["Ist das sehr weit?","Wie komme ich hierher?","Das weiß ich leider nicht."],answer:"Ist das sehr weit?",translation:"ที่นั่นไกลมากไหม",explanation:"ใช้ Ist das sehr weit? ถามระยะทางของสถานที่ที่พูดถึงอยู่" },
  { id:"ask-search",topic:"ask",kind:"context",prompt:"คุณอยากบอกคนแถวนั้นว่ากำลังหาที่ทำการไปรษณีย์",options:["Eine Frage bitte: Ich suche die Post.","Da sehen Sie die Post.","Ich bin fremd hier."],answer:"Eine Frage bitte: Ich suche die Post.",translation:"ขอถามหน่อยครับ/ค่ะ ฉันกำลังหาที่ทำการไปรษณีย์",explanation:"Ich suche … ใช้บอกว่ากำลังตามหาสถานที่นั้น" },
  { id:"ask-walk",topic:"ask",kind:"order",tokens:["Kann","ich","zu","Fuß","zum","Café","gehen?"],answer:"Kann ich zu Fuß zum Café gehen?",translation:"ฉันเดินไปคาเฟ่ได้ไหม",ruleTitle:"ประโยคคำถามแบบตอบใช่หรือไม่ใช่ (Ja/Nein-Frage) ที่มี Modalverb",rules:["กริยาช่วยรูปที่ผันแล้ว Kann ขึ้นต้นประโยค ตามด้วยประธาน ich", "เมื่อใช้ Modalverb (können) กริยาหลัก gehen อยู่ในรูปไม่ผัน (Infinitiv) ที่ท้ายประโยค"],noteTitle:"ลำดับในประโยคนี้",exampleNote:"โดยปกติบอกวิธีเดินทาง zu Fuß (เดินเท้า) ก่อน แล้วตามด้วยจุดหมาย zum Café (ไปคาเฟ่)" },
  { id:"describe-straight",topic:"describe",kind:"context",prompt:"คุณกำลังบอกเส้นทางให้เดินตรงไปจากตรงนี้",options:["Sie gehen hier geradeaus.","Ist das sehr weit?","Ich bin fremd hier."],answer:"Sie gehen hier geradeaus.",translation:"เดินตรงไปจากตรงนี้",explanation:"geradeaus หมายถึงตรงไป ใช้บอกทิศทางการเดิน" },
  { id:"describe-see",topic:"describe",kind:"context",prompt:"คุณชี้ไปข้างหน้าเพื่อบอกว่าอีกฝ่ายจะเห็นร้านขายยา",options:["Da sehen Sie eine Apotheke.","Wo ist denn hier eine Apotheke?","Das weiß ich leider nicht."],answer:"Da sehen Sie eine Apotheke.",translation:"ตรงนั้นคุณจะเห็นร้านขายยา",explanation:"Da sehen Sie … ใช้ชี้ตำแหน่งสิ่งที่อีกฝ่ายจะมองเห็น" },
  { id:"describe-turn",topic:"describe",kind:"order",tokens:["Vor","der","Bank","biegen","Sie","nach","rechts","ab."],answer:"Vor der Bank biegen Sie nach rechts ab.",translation:"ก่อนถึงธนาคาร ให้เลี้ยวขวา",ruleTitle:"กฎที่ใช้ในข้อนี้",rules:["เมื่อเริ่มประโยคด้วยจุดสังเกต Vor der Bank กริยาที่ผัน biegen จะอยู่ตำแหน่งที่สอง", "ประธาน Sie จึงตามหลังกริยา", "abbiegen เป็นกริยาแยก: biegen อยู่ด้านหน้า ส่วน ab ไปท้ายประโยค"],noteTitle:"ข้อมูลในประโยคนี้",exampleNote:"nach rechts บอกทิศทางที่ให้เลี้ยว ส่วน Vor der Bank เป็นจุดสังเกตของคำบอกทางข้อนี้" },
  { id:"describe-distance",topic:"describe",kind:"context",prompt:"เส้นทางอยู่ใกล้มาก คุณอยากบอกว่าไม่ไกลเลย",options:["Das ist gar nicht weit.","Das ist sehr weit.","Ich suche den Bahnhof."],answer:"Das ist gar nicht weit.",translation:"ที่นั่นไม่ไกลเลย",explanation:"gar nicht ใช้เน้นปฏิเสธว่าไม่ไกลเลย" },
  { id:"describe-street",topic:"describe",kind:"order",tokens:["Sie","gehen","die","zweite","Straße","nach","links."],answer:"Sie gehen die zweite Straße nach links.",translation:"เดินเข้าถนนสายที่สองทางซ้าย",ruleTitle:"กฎที่ใช้ในข้อนี้",rules:["ประโยคบอกเล่าที่ขึ้นต้นด้วยประธาน Sie ใช้กริยาที่ผัน gehen ในตำแหน่งที่สอง"],noteTitle:"ข้อมูลในประโยคนี้",exampleNote:"die zweite Straße = ถนนสายที่สอง · nach links = ไปทางซ้าย" },
  { id:"describe-direction",topic:"describe",kind:"context",prompt:"ต้องการบอกสั้น ๆ ว่าให้ไปทางขวา",options:["… nach rechts.","… nach links.","… geradeaus."],answer:"… nach rechts.",translation:"… ไปทางขวา",explanation:"nach rechts หมายถึงไปทางขวา ใช้ต่อท้ายประโยคบอกทางได้" },
  { id:"unknown-local",topic:"unknown",kind:"dialogue",prompt:"คนแปลกหน้าขอให้คุณบอกทาง แต่คุณไม่ใช่คนในพื้นที่",options:["Tut mir leid. Ich bin nicht von hier.","Da sehen Sie den Bahnhof.","Herzlichen Dank."],answer:"Tut mir leid. Ich bin nicht von hier.",translation:"ขอโทษ ฉันไม่ใช่คนแถวนี้",explanation:"ใช้บอกอย่างสุภาพว่าคุณไม่คุ้นกับพื้นที่นี้" },
  { id:"unknown-answer",topic:"unknown",kind:"dialogue",prompt:"มีคนถามทางที่คุณไม่ทราบคำตอบ คุณอยากบอกว่าไม่รู้",options:["Das weiß ich leider nicht.","Das ist gar nicht weit.","Kann ich zu Fuß gehen?"],answer:"Das weiß ich leider nicht.",translation:"ขอโทษ ฉันไม่ทราบเรื่องนั้น",explanation:"Das weiß ich leider nicht ใช้บอกว่าไม่ทราบข้อมูลนั้นอย่างสุภาพ" },
  { id:"unknown-new",topic:"unknown",kind:"dialogue",prompt:"คุณอยากบอกว่าตัวเองเพิ่งมาและไม่คุ้นกับแถวนี้",options:["Ich bin fremd hier.","Ich suche die Post.","Sie gehen hier geradeaus."],answer:"Ich bin fremd hier.",translation:"ฉันไม่คุ้นกับแถวนี้",explanation:"fremd hier สื่อว่าไม่คุ้นเคยกับสถานที่นี้" },
  { id:"thanks-heart",topic:"thanks",kind:"dialogue",prompt:"มีคนช่วยคุณอย่างมาก คุณต้องการกล่าวขอบคุณอย่างจริงใจ",options:["Herzlichen Dank.","Ist das sehr weit?","Ich bin nicht von hier."],answer:"Herzlichen Dank.",translation:"ขอบคุณมากจากใจ",explanation:"Herzlichen Dank เป็นคำขอบคุณที่เน้นความซาบซึ้ง" },
  { id:"thanks-kind",topic:"thanks",kind:"dialogue",prompt:"อีกฝ่ายช่วยบอกทางให้ คุณอยากชมว่าใจดีและขอบคุณ",options:["Sehr nett. Vielen Dank.","Das weiß ich leider nicht.","Wo ist denn hier ein Café?"],answer:"Sehr nett. Vielen Dank.",translation:"ใจดีมาก ขอบคุณมาก",explanation:"ใช้ชมความมีน้ำใจของอีกฝ่ายพร้อมกล่าวขอบคุณ" },
  { id:"thanks-oh",topic:"thanks",kind:"dialogue",prompt:"เพิ่งได้รับคำบอกทางที่ช่วยได้พอดี คุณตอบรับพร้อมขอบคุณ",options:["Oh, danke schön.","Vor der Bank biegen Sie ab.","Kann ich zu Fuß gehen?"],answer:"Oh, danke schön.",translation:"อ๋อ ขอบคุณมาก",explanation:"ใช้ตอบรับสิ่งที่อีกฝ่ายเพิ่งช่วยหรือบอกให้ พร้อมกล่าวขอบคุณ" },
];
const describeMatch: MatchTask = {
  id:"describe-place-distance-match",topic:"describe",kind:"match",pairs:[
    { id:"match-describe-see",targetId:"describe-see",question:"Wo ist die Apotheke?",questionThai:"ร้านขายยาอยู่ที่ไหน",answer:"Da sehen Sie eine Apotheke.",translation:"ตรงนั้นคุณจะเห็นร้านขายยา" },
    { id:"match-describe-distance",targetId:"describe-distance",question:"Ist es weit bis zur Apotheke?",questionThai:"ไปร้านขายยาไกลไหม",answer:"Das ist gar nicht weit.",translation:"ไม่ไกลเลย" },
  ],
};
const guidedTasks: Task[] = [
  ...authoredTasks.filter(task=>task.kind!=="order"&&task.id!=="describe-see"&&task.id!=="describe-distance")
    .flatMap(task=>task.id==="describe-straight"?[task,describeMatch]:[task]),
  ...authoredTasks.filter(task=>task.kind==="order"),
];
const reviewTasks: ChoiceTask[] = [
  { id:"ask-walk-reply",targetId:"ask-walk",topic:"ask",kind:"dialogue",prompt:"คนถามว่าเดินไปคาเฟ่ได้ไหม และคุณรู้ว่าคาเฟ่อยู่ใกล้ จะตอบอย่างไร",options:["Ja, das ist gar nicht weit.","Das weiß ich leider nicht.","Herzlichen Dank."],answer:"Ja, das ist gar nicht weit.",translation:"ได้ คาเฟ่อยู่ไม่ไกลเลย",explanation:"คำถามถามว่าเดินไปคาเฟ่ได้ไหม เมื่อรู้ว่าคาเฟ่อยู่ใกล้ จึงตอบยืนยันว่าไม่ไกล" },
];
const variantTasks: ChoiceTask[] = phraseVariants.variants.map(variant => ({
  id: variant.id, targetId: variant.targetId, topic: variant.topic as Topic,
  kind: variant.kind as "context" | "dialogue", prompt: variant.prompt,
  options: variant.options, answer: variant.answer, translation: variant.translation,
  explanation: variant.explanation, difficulty: variant.difficulty,
  difficultyRationale: variant.difficultyRationale, assistance: variant.assistance,
  subskill: variant.subskill,
}));
const tasks: Task[] = [...authoredTasks,describeMatch,...reviewTasks,...variantTasks];
if (variantTasks.length + authoredTasks.length + describeMatch.pairs.length + reviewTasks.length < 100) throw new Error("L14 phrase bank must contain at least 100 independently scored responses");
const mixedCounts: Record<Topic, number> = { ask: 4, describe: 5, unknown: 3, thanks: 3 };
type Attempt = { questionId: string; topic: Topic; kind: Task["kind"]; correct: boolean; answer: string; submittedAt: string };
type Progress = { version: 1; runId: string; createdAt: string; taskIds: string[]; position: number; attempts: Attempt[]; draft: { questionId: string; selected: string } | null; completed: boolean; updatedAt: string };
type ArchivedRun = { runId: string; bank: string; attempts: Attempt[]; completedAt: string };
type PracticeSessions = { version: 1; banks: Record<string, Progress>; runs: ArchivedRun[] };
const key = lessonStateKeys.l14PhrasePractice;
const taskCount = (task: Task) => task.kind==="match"?task.pairs.length:1;
const targetIds = (task: Task) => task.kind==="match"?task.pairs.map(pair=>pair.targetId):[task.kind==="order"?task.id:task.targetId??task.id];
function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index=result.length-1; index>0; index--) {
    const other=Math.floor(Math.random()*(index+1));
    [result[index],result[other]]=[result[other],result[index]];
  }
  return result;
}
function mixedTaskIds(runs: ArchivedRun[]): string[] {
  const latest = new Map<string, Attempt>();
  for (const run of runs) for (const attempt of run.attempts) {
    const attemptedTask=tasks.find(task=>task.id===attempt.questionId);
    latest.set(attempt.questionId,attempt);
    if (attemptedTask) for (const target of targetIds(attemptedTask)) latest.set(target,attempt);
    const matchedTarget=describeMatch.pairs.find(pair=>pair.id===attempt.questionId)?.targetId;
    if (matchedTarget) latest.set(matchedTarget,attempt);
  }
  const priority = (task: Task) => { const attempt=latest.get(task.id); return !attempt?2:attempt.correct?0:1; };
  const selected = topicOrder.flatMap(topic=>{
    const sourceTasks=authoredTasks.filter(task=>task.topic===topic&&(topic!=="describe"||task.id!=="describe-see"&&task.id!=="describe-distance"));
    const picked=shuffle(sourceTasks.map(source=>{
    const candidates: Task[] = latest.has(source.id)
      ? [source,...reviewTasks.filter(task=>task.targetId===source.id),...variantTasks.filter(task=>task.targetId===source.id)]
      : [source];
    return shuffle(candidates).sort((left,right)=>priority(right)-priority(left))[0];
    })).sort((left,right)=>priority(right)-priority(left)).slice(0,mixedCounts[topic]-(topic==="describe"?2:0));
    return topic==="describe"?[describeMatch,...picked]:picked;
  });
  return [...shuffle(selected.filter(task=>task.kind!=="order")),...shuffle(selected.filter(task=>task.kind==="order"))].map(task=>task.id);
}
function learnedTargets(raw: string | null, tester: boolean): Set<string> {
  if (tester) return new Set(authoredTasks.map(task=>task.id));
  try {
    const value: unknown=JSON.parse(raw??"null");
    if (!isRecord(value)||!isRecord(value.results)) return new Set();
    const results=value.results;
    return new Set(authoredTasks.filter(task=>results[task.id]==="correct").map(task=>task.id));
  } catch { return new Set(); }
}
function taskEligible(task: Task, learned: Set<string>) { return targetIds(task).every(id=>learned.has(id)); }
function attemptHistory(sessions: PracticeSessions): Attempt[] {
  return [...sessions.runs.flatMap(run=>run.attempts),...Object.values(sessions.banks).filter(bank=>!bank.completed).flatMap(bank=>bank.attempts)].sort((a,b)=>a.submittedAt.localeCompare(b.submittedAt));
}
function dailyTaskIds(sessions: PracticeSessions, learned: Set<string>, now=Date.now()): string[] {
  const latest=new Map<string,Attempt>();
  for (const attempt of attemptHistory(sessions)) {
    const task=tasks.find(entry=>entry.kind==="match"?entry.pairs.some(pair=>pair.id===attempt.questionId):entry.id===attempt.questionId);
    const target=describeMatch.pairs.find(pair=>pair.id===attempt.questionId)?.targetId??(task?targetIds(task)[0]:attempt.questionId);
    latest.set(target,attempt);
  }
  const candidates: Task[]=guidedTasks.filter(task=>taskEligible(task,learned)).map(task=>task.id==="ask-walk"&&latest.has("ask-walk")?reviewTasks[0]:task);
  for (const target of latest.keys()) {
    const variants=variantTasks.filter(task=>task.targetId===target&&taskEligible(task,learned));
    if (variants.length) candidates.push(variants[Math.floor(Math.random()*variants.length)]);
  }
  const score=(task: Task)=>Math.max(...targetIds(task).map(id=>{
    const attempt=latest.get(id);
    if (!attempt) return 35;
    const elapsed=now-Date.parse(attempt.submittedAt);
    return (attempt.correct?0:55)+(elapsed>=3*86400000?30:0)+(attempt.correct&&elapsed<86400000?-20:0);
  }));
  const selected: Task[]=[];
  const remaining=[...candidates];
  const selectedTargets=new Set<string>();
  const topicUses=new Map<Topic,number>();
  const kindUses=new Map<Task["kind"],number>();
  let count=0;
  while (remaining.length && count<10) {
    remaining.sort((a,b)=>(score(b)-(topicUses.get(b.topic)??0)*9-(kindUses.get(b.kind)??0)*5)-(score(a)-(topicUses.get(a.topic)??0)*9-(kindUses.get(a.kind)??0)*5));
    const next=remaining.find(task=>count+taskCount(task)<=10&&targetIds(task).every(target=>!selectedTargets.has(target)));
    if (!next) break;
    remaining.splice(remaining.indexOf(next),1);
    selected.push(next);
    for (const target of targetIds(next)) selectedTargets.add(target);
    count+=taskCount(next);
    topicUses.set(next.topic,(topicUses.get(next.topic)??0)+taskCount(next));
    kindUses.set(next.kind,(kindUses.get(next.kind)??0)+taskCount(next));
  }
  return [...selected.filter(task=>task.kind!=="order"),...selected.filter(task=>task.kind==="order")].map(task=>task.id);
}
const empty = (bank: string, sessions: PracticeSessions, learned: Set<string>): Progress => { const now=new Date().toISOString();return { version:1,runId:crypto.randomUUID(),createdAt:now,taskIds:bank==="mixed"?mixedTaskIds(sessions.runs).filter(id=>{const task=tasks.find(item=>item.id===id);return task&&taskEligible(task,learned);}):bank==="daily"?dailyTaskIds(sessions,learned):guidedTasks.filter(task=>(!isTopic(bank)||task.topic===bank)&&taskEligible(task,learned)).map(task=>task.id),position:0,attempts:[],draft:null,completed:false,updatedAt:now }; };
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }
function isTopic(value: unknown): value is Topic { return typeof value === "string" && Object.hasOwn(topicInfo,value); }
function parseMatchSelection(task: MatchTask, selected: string): Record<string,string> | null {
  if (!selected) return {};
  try {
    const value: unknown=JSON.parse(selected);
    if (!isRecord(value)) return null;
    const answers=task.pairs.map(pair=>pair.answer);
    if (Object.keys(value).some(id=>!task.pairs.some(pair=>pair.id===id)) || Object.values(value).some(answer=>typeof answer!=="string"||!answers.includes(answer)) || new Set(Object.values(value)).size!==Object.values(value).length) return null;
    return Object.fromEntries(Object.entries(value).map(([id,answer])=>[id,String(answer)]));
  } catch { return null; }
}
function parseAttempt(value: unknown): Attempt | null {
  if (!isRecord(value) || typeof value.questionId !== "string" || typeof value.correct!=="boolean" || typeof value.answer!=="string" || typeof value.submittedAt!=="string" || !Number.isFinite(Date.parse(value.submittedAt))) return null;
  const matchPair=describeMatch.pairs.find(pair=>pair.id===value.questionId);
  if (matchPair) {
    if (value.topic!==describeMatch.topic || value.kind!=="match" || !describeMatch.pairs.some(pair=>pair.answer===value.answer) || value.correct!==(value.answer===matchPair.answer)) return null;
    return {questionId:matchPair.id,topic:describeMatch.topic,kind:"match",correct:value.correct,answer:value.answer,submittedAt:value.submittedAt};
  }
  const task=tasks.find(entry=>entry.id===value.questionId);
  if (!task || task.kind==="match" || value.topic!==task.topic || value.kind!==task.kind || (task.kind==="order"?task.answer!==value.answer:!task.options.includes(value.answer)) || value.correct!==(value.answer===task.answer)) return null;
  return {questionId:task.id,topic:task.topic,kind:task.kind,correct:value.correct,answer:value.answer,submittedAt:value.submittedAt};
}
function isValidOrderDraft(tokens: string[], selected: string): boolean {
  if (!selected) return false;
  const remaining=[...tokens];
  return selected.split(" ").every(token=>{
    const index=remaining.indexOf(token);
    if (index<0) return false;
    remaining.splice(index,1);
    return true;
  });
}
function parseProgress(value: unknown): Progress | null {
  if (!isRecord(value) || !Array.isArray(value.taskIds) || !value.taskIds.every(id=>typeof id==="string"&&tasks.some(task=>task.id===id)) || new Set(value.taskIds).size!==value.taskIds.length || !Array.isArray(value.attempts)) return null;
  const taskIds = value.taskIds.filter((id): id is string => typeof id === "string");
  const attempts = value.attempts.map(parseAttempt);
  if (attempts.some(attempt=>attempt===null)) return null;
  const rawDraft = isRecord(value.draft) ? value.draft : null;
  const draftTask = rawDraft && typeof rawDraft.questionId === "string" ? tasks.find(task=>task.id===rawDraft.questionId) : undefined;
  const draftSelected = rawDraft && typeof rawDraft.selected === "string" ? rawDraft.selected : "";
  const draftIsValid = draftTask?.kind === "order" ? isValidOrderDraft(draftTask.tokens,draftSelected) : draftTask?.kind === "match" ? parseMatchSelection(draftTask,draftSelected)!==null : draftTask?.kind === "context" || draftTask?.kind === "dialogue" ? draftTask.options.includes(draftSelected) : false;
  const draft = draftTask && draftIsValid ? {questionId:draftTask.id,selected:draftSelected} : null;
  const runId = typeof value.runId === "string" ? value.runId : crypto.randomUUID();
  const position = typeof value.position === "number" && Number.isInteger(value.position) ? Math.max(0,Math.min(value.position,taskIds.length)) : 0;
  const validAttempts=attempts.filter((attempt):attempt is Attempt=>attempt!==null);
  const updatedAt=typeof value.updatedAt==="string"&&Number.isFinite(Date.parse(value.updatedAt))?value.updatedAt:validAttempts.at(-1)?.submittedAt??new Date(0).toISOString();
  const createdAt=typeof value.createdAt==="string"&&Number.isFinite(Date.parse(value.createdAt))?value.createdAt:updatedAt;
  return {version:1,runId,createdAt,taskIds,position,attempts:validAttempts,draft,completed:value.completed===true,updatedAt};
}
function parseArchivedRun(value: unknown): ArchivedRun | null {
  if (!isRecord(value) || typeof value.runId!=="string" || typeof value.bank!=="string" || typeof value.completedAt!=="string" || !Number.isFinite(Date.parse(value.completedAt)) || !Array.isArray(value.attempts)) return null;
  const attempts=value.attempts.map(parseAttempt);
  if (attempts.some(attempt=>attempt===null)) return null;
  return {runId:value.runId,bank:value.bank,attempts:attempts.filter((attempt):attempt is Attempt=>attempt!==null),completedAt:value.completedAt};
}
function readSessions(raw: string | null): PracticeSessions {
  if (!raw) return {version:1,banks:{},runs:[]};
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || !isRecord(value.banks)) return {version:1,banks:{},runs:[]};
    const banks: Record<string,Progress> = {};
    for (const [name,entry] of Object.entries(value.banks)) {
      const progress = parseProgress(entry);
      if (progress) banks[name]=progress;
    }
    const runs=Array.isArray(value.runs)?value.runs.map(parseArchivedRun).filter((run):run is ArchivedRun=>run!==null):[];
    return {version:1,banks,runs};
  } catch { return {version:1,banks:{},runs:[]}; }
}
function l14TaskQuestion(task: Task, pair?: MatchPair) {
  const itemId=pair?.targetId??(task.kind==="order"?task.id:task.kind==="match"?task.pairs[0].targetId:task.targetId??task.id);
  const topicId=`L14-phrases-${task.topic}`;
  if (pair&&task.kind==="match") return {id:pair.id,version:1,itemId,requiredItemIds:[itemId],topicId,subskill:"phrase_match",kind:"choice",acceptedAnswers:[pair.answer],options:task.pairs.map(entry=>entry.answer),interaction:"match",matchGroupId:task.id,difficulty:1,assistance:"paired-question-options"};
  if (task.kind==="order") return {id:task.id,version:1,itemId,requiredItemIds:[itemId],topicId,subskill:"phrase_order",kind:"order",acceptedAnswers:[task.answer],tokens:task.tokens,difficulty:2,assistance:"supplied-word-tiles"};
  if (task.kind==="context"||task.kind==="dialogue") return {id:task.id,version:1,itemId,requiredItemIds:[itemId],topicId,subskill:"subskill" in task&&task.subskill?task.subskill:task.kind==="context"?"phrase_context":"phrase_dialogue",kind:"choice",acceptedAnswers:[task.answer],options:task.options,...("difficulty" in task?{difficulty:task.difficulty,difficultyRationale:task.difficultyRationale,assistance:task.assistance}: {})};
  throw new Error("Expected an individual L14 practice question");
}
type SharedTaskItem = { task: Task; pair?: MatchPair; question: ReturnType<typeof l14TaskQuestion> };
function sharedItems(task: Task): SharedTaskItem[] {
  if (task.kind === "match") return task.pairs.map(pair => ({ task, pair, question: l14TaskQuestion(task, pair) }));
  return [{ task, question: l14TaskQuestion(task) }];
}
function sharedSession(bank: string, progress: Progress) {
  const queue=progress.taskIds.map(id=>tasks.find(task=>task.id===id)).filter((task):task is Task=>Boolean(task));
  const flattened=queue.flatMap(task=>sharedItems(task));
  const attemptsById=new Map(progress.attempts.map(attempt=>[attempt.questionId,attempt]));
  const draft=progress.draft;
  let draftMatch: Record<string,string>={};
  if (draft&&tasks.find(task=>task.id===draft.questionId)?.kind==="match") draftMatch=parseMatchSelection(describeMatch,draft.selected)??{};
  const items=flattened.map(({task,pair,question})=>{
    const questionId=pair?.id??task.id;
    const attempt=attemptsById.get(questionId);
    let response=attempt?.answer??"";
    if (!attempt&&draft) {
      if (task.kind==="match"&&draft.questionId===task.id) response=draftMatch[questionId]??"";
      else if (draft.questionId===task.id) response=draft.selected;
    }
    const tokenOrder=task.kind==="order"&&response?response.split(" "):[];
    return {question,response,selected:[],tokenOrder,hintUsed:false,translationUsed:false,attempt:attempt?{response:attempt.answer,correct:attempt.correct,status:"completed",submittedAt:attempt.submittedAt,confidence:null}:null};
  });
  const position=queue.slice(0,progress.position).reduce((count,task)=>count+taskCount(task),0);
  const itemPosition=Math.min(position,Math.max(0,items.length-1));
  const href=l14PhrasePracticeTopics.find(entry=>entry.storage===`phrase-l14-${bank}`)?.href??`/practice/L14/phrases/${bank}`;
  return {id:progress.runId,href,createdAt:progress.createdAt,updatedAt:progress.updatedAt,completed:progress.completed,archived:false,position:itemPosition,items};
}
function progressFromRun(run: ArchivedRun): Progress {
  const taskIds:string[]=[];
  for (const attempt of run.attempts) {
    const pairTask=tasks.find(task=>task.kind==="match"&&task.pairs.some(pair=>pair.id===attempt.questionId));
    const taskId=pairTask?.id??attempt.questionId;
    if (!taskIds.includes(taskId)) taskIds.push(taskId);
  }
  const lastTask=tasks.find(task=>task.id===taskIds.at(-1));
  const position=taskIds.slice(0,-1).reduce((count,id)=>{const task=tasks.find(entry=>entry.id===id);return count+(task?taskCount(task):1);},0);
  return {version:1,runId:run.runId,createdAt:run.completedAt,taskIds,position:lastTask?position:0,attempts:run.attempts,draft:null,completed:true,updatedAt:run.completedAt};
}
function taskIdsFromShared(items: unknown[]) {
  const ids:string[]=[];
  for (let index=0;index<items.length;index++) {
    const item=items[index];
    if (!isRecord(item)||!isRecord(item.question)||typeof item.question.id!=="string") return null;
    const questionId=item.question.id;
    const matchTask=tasks.find(task=>task.kind==="match"&&task.pairs.some(pair=>pair.id===questionId));
    if (matchTask?.kind === "match") {
      if (ids.at(-1)!==matchTask.id) ids.push(matchTask.id);
      const nextItem=items[index+1];
      const nextQuestion=isRecord(nextItem)&&isRecord(nextItem.question)?nextItem.question:null;
      if (nextQuestion&&typeof nextQuestion.id==="string"&&matchTask.pairs.some(pair=>pair.id===nextQuestion.id)) index++;
      continue;
    }
    if (!tasks.some(task=>task.id===questionId&&task.kind!=="match")) return null;
    ids.push(questionId);
  }
  return ids;
}
function progressFromShared(value: unknown): Progress | null {
  if (!isRecord(value)||typeof value.id!=="string"||typeof value.createdAt!=="string"||!Array.isArray(value.items)||value.items.length===0) return null;
  const sharedItemsArray: unknown[] = value.items;
  const taskIds=taskIdsFromShared(sharedItemsArray);
  if (!taskIds?.length) return null;
  const attempts:Attempt[]=[];
  const sourceTasks: { task: Task; pair?: MatchPair }[] = tasks.flatMap((task): { task: Task; pair?: MatchPair }[] =>
    task.kind === "match" ? task.pairs.map(pair => ({ task, pair })) : [{ task }]);
  for (const item of sharedItemsArray) {
    if (!isRecord(item)||!isRecord(item.question)||typeof item.question.id!=="string"||!isRecord(item.attempt)) continue;
    const questionId=item.question.id;
    const source=sourceTasks.find(entry=>entry.pair?.id===questionId||entry.task.id===questionId);
    if (!source||typeof item.attempt.correct!=="boolean"||typeof item.attempt.response!=="string"||typeof item.attempt.submittedAt!=="string") return null;
    attempts.push({questionId,topic:source.task.topic,kind:source.pair?"match":source.task.kind,correct:item.attempt.correct,answer:item.attempt.response,submittedAt:item.attempt.submittedAt});
  }
  const rawPosition=typeof value.position==="number"&&Number.isInteger(value.position)?Math.max(0,value.position):0;
  let position=0,flatPosition=0;
  while (position<taskIds.length-1&&flatPosition<rawPosition) { const task=tasks.find(entry=>entry.id===taskIds[position]);flatPosition+=task?taskCount(task):1;position++; }
  const active=tasks.find(task=>task.id===taskIds[position]);
  let draft:{questionId:string;selected:string}|null=null;
  if (active) {
    const activeQuestions=sharedItems(active);
    const matchingDrafts=activeQuestions.flatMap(({pair,task},offset)=>{
      const sharedItem=sharedItemsArray[flatPosition+offset];
      const id=pair?.id??task.id;
      return isRecord(sharedItem)&&typeof sharedItem.response==="string"&&sharedItem.response ? [{id,response:sharedItem.response}] : [];
    });
    if (active.kind==="match"&&matchingDrafts.length) draft={questionId:active.id,selected:JSON.stringify(Object.fromEntries(matchingDrafts.map(entry=>[entry.id,entry.response])))};
    else if (matchingDrafts[0]) draft={questionId:active.id,selected:matchingDrafts[0].response};
  }
  const updatedAt=typeof value.updatedAt==="string"?value.updatedAt:value.createdAt;
  return {version:1,runId:value.id,createdAt:value.createdAt,taskIds,position,attempts,draft,completed:value.completed===true,updatedAt};
}
function mergeSharedSessions(initial: PracticeSessions, userId: string): PracticeSessions {
  if (typeof window==="undefined") return initial;
  const banks={...initial.banks};
  const runs=[...initial.runs];
  for (const entry of l14PhrasePracticeTopics) {
    const bank=entry.storage.replace("phrase-l14-","");
    try {
      const raw=window.localStorage.getItem(practiceStorageKey(entry.storage,entry.frame,userId));
      if (!raw) continue;
      const value:unknown=JSON.parse(raw);
      if (!isRecord(value)||!Array.isArray(value.sessions)) continue;
      for (const session of value.sessions) {
        const progress=progressFromShared(session);
        if (!progress) continue;
        const existing=banks[bank];
        if (!existing||existing.runId!==progress.runId||existing.updatedAt<progress.updatedAt) banks[bank]=progress;
        if (progress.completed&&!runs.some(run=>run.runId===progress.runId)) runs.push({runId:progress.runId,bank,attempts:progress.attempts,completedAt:progress.updatedAt});
      }
    } catch { /* Keep legacy local history when a shared snapshot is unreadable. */ }
  }
  return {...initial,banks,runs};
}
function writeSharedSessions(sessions: PracticeSessions, userId: string) {
  if(typeof window==="undefined")return;
  for(const entry of l14PhrasePracticeTopics){
    const bank=entry.storage.replace("phrase-l14-","");
    const sessionsForBank=[...sessions.runs.filter(run=>run.bank===bank).map(run=>progressFromRun(run)),...(sessions.banks[bank]?[sessions.banks[bank]]:[])].filter(progress=>progress.taskIds.length>0);
    const unique=new Map(sessionsForBank.map(progress=>[progress.runId,progress]));
    const value={version:1,sessions:[...unique.values()].map(progress=>sharedSession(bank,progress)),activeId:sessions.banks[bank]?.runId??null};
    window.localStorage.setItem(practiceStorageKey(entry.storage,entry.frame,userId),JSON.stringify(value));
  }
  window.dispatchEvent(new Event("practice-progress-updated"));
}
export function recommendL14PhrasePractice(practiceRaw: string | null, learningRaw: string | null, tester: boolean) {
  const sessions=readSessions(practiceRaw);
  const learned=learnedTargets(learningRaw,tester);
  const activityAt=Math.max(0,...attemptHistory(sessions).map(attempt=>Date.parse(attempt.submittedAt)));
  const pending=["basic","daily","mixed",...topicOrder].map(bank=>({bank,state:sessions.banks[bank]})).filter(entry=>entry.state&&!entry.state.completed&&(entry.state.position>0||entry.state.attempts.length>0||entry.state.draft)&&entry.state.taskIds.every(id=>{const task=tasks.find(item=>item.id===id);return task&&taskEligible(task,learned);})).sort((a,b)=>(b.state?.updatedAt??"").localeCompare(a.state?.updatedAt??""))[0];
  if (pending?.state) {
    const pendingActivityAt=Date.parse(pending.state.updatedAt);
    const recommendationActivityAt=Number.isFinite(pendingActivityAt)?Math.max(activityAt,pendingActivityAt):activityAt;
    const queue=pending.state.taskIds.map(id=>tasks.find(task=>task.id===id)).filter((task):task is Task=>Boolean(task)&&(!isTopic(pending.bank)||task?.topic===pending.bank));
    const total=queue.reduce((sum,task)=>sum+taskCount(task),0);
    const position=queue.slice(0,pending.state.position).reduce((sum,task)=>sum+taskCount(task),0)+1;
    return {kind:"resume",title:"ทำต่อจากครั้งก่อน",description:`ประโยคและสำนวนบท 14 · ข้อ ${position} จาก ${total}`,href:`/practice/L14/phrases/${pending.bank}`,action:"ฝึกต่อ",activityAt:recommendationActivityAt};
  }
  if (!learned.size) return {kind:"learn",title:"เริ่มเรียนประโยคและสำนวนบท 14",description:"เรียนสำนวนก่อน แล้วกลับมาฝึกจากสิ่งที่เรียนแล้ว",href:"/learn/L14/phrases",action:"ไปเรียน",activityAt};
  const attempted=attemptHistory(sessions).length>0;
  if (!attempted && learned.size===authoredTasks.length) return {kind:"start",title:"เริ่มฝึกประโยคและสำนวนบท 14",description:"ฝึกสำนวนที่เรียนแล้วต่อเนื่องทั้ง 4 หัวข้อ",href:"/practice/L14/phrases/basic",action:"เริ่มฝึก 17 ข้อ",activityAt};
  const count=dailyTaskIds(sessions,learned).map(id=>tasks.find(task=>task.id===id)).filter((task):task is Task=>Boolean(task)).reduce((sum,task)=>sum+taskCount(task),0);
  const latestWrong=attemptHistory(sessions).filter(attempt=>!attempt.correct).at(-1);
  const reason=latestWrong?`ทบทวน${topicInfo[latestWrong.topic].title}ที่เคยตอบผิด พร้อมคละสำนวนที่เรียนแล้ว`:"คละสำนวนที่เรียนแล้ว โดยเริ่มจากข้อที่ยังไม่เคยฝึก";
  return {kind:"daily",title:"ฝึกประโยคและสำนวนต่อวันนี้",description:reason,href:"/practice/L14/phrases/daily",action:`เริ่มฝึก ${count} ข้อ`,activityAt};
}
export function L14PhrasePractice({ slug }: { slug?: string }) {
  const { user } = useStore();
  const storage = useLessonState();
  const learned=learnedTargets(storage.read(lessonStateKeys.l14Phrases),isTestWorkspaceUser(user));
  const bankKey = slug ?? "overview";
  const [sessions,setSessions] = useState<PracticeSessions>(()=>{
    return readSessions(storage.read(key));
  });
  const [sharedReady,setSharedReady]=useState(false);
  const progress = sessions.banks[bankKey] ?? empty(bankKey,sessions,learned);
  const setProgress = (update: (current: Progress) => Progress) => setSessions(previous=>{
    const current=previous.banks[bankKey]??empty(bankKey,previous,learned);
    const next={...update(current),updatedAt:new Date().toISOString()};
    const runs=next.completed&&!current.completed?[...previous.runs,{runId:next.runId,bank:bankKey,attempts:next.attempts,completedAt:new Date().toISOString()}]:previous.runs;
    return {...previous,banks:{...previous.banks,[bankKey]:next},runs};
  });
  const [selected,setSelected] = useState("");
  const [matchFocus,setMatchFocus] = useState<{ side: "question" | "answer"; value: string } | null>(null);
  const [finished,setFinished] = useState(false);
  const [showResume,setShowResume] = useState(true);
  useEffect(()=>{if(!user)return;setSessions(previous=>mergeSharedSessions(previous,user.id));setSharedReady(true);},[user?.id]);
  useEffect(()=>{if(sharedReady&&user)writeSharedSessions(sessions,user.id);},[sessions,sharedReady,user?.id]);
  const topic = slug && slug in topicInfo ? slug as Topic : undefined;
  const guided = slug === "basic";
  const mixed = slug === "mixed";
  const daily = slug === "daily";
  const nextTopic = topic ? topicOrder.slice(topicOrder.indexOf(topic)+1).find(id=>guidedTasks.some(task=>task.topic===id&&taskEligible(task,learned))) : undefined;
  const queue = useMemo(()=> progress.taskIds.map(id=>tasks.find(task=>task.id===id)).filter((task):task is Task=>Boolean(task)&&(!topic||task?.topic===topic)),[progress.taskIds,topic]);
  const eligibleQueue=isTestWorkspaceUser(user)||queue.every(task=>taskEligible(task,learned));
  const current = queue[progress.position];
  const completedCount = queue.slice(0,progress.position).reduce((count,task)=>count+taskCount(task),0);
  const totalCount = queue.reduce((count,task)=>count+taskCount(task),0);
  const topicPosition = current ? queue.slice(0,progress.position).filter(task=>task.topic===current.topic).reduce((count,task)=>count+taskCount(task),0)+1 : 0;
  const topicTotal = current ? queue.filter(task=>task.topic===current.topic).reduce((count,task)=>count+taskCount(task),0) : 0;
  const matchAttempts = current?.kind==="match" ? current.pairs.map(pair=>progress.attempts.findLast(attempt=>attempt.questionId===pair.id)) : [];
  const currentAttempt = current && current.kind!=="match" ? progress.attempts.findLast(attempt=>attempt.questionId===current.id) : undefined;
  const checked = current?.kind==="match" ? matchAttempts.every(Boolean) : Boolean(currentAttempt);
  useEffect(()=>{
    if (!current) { setSelected(""); return; }
    if (current.kind==="match") {
      const answers=current.pairs.map(pair=>progress.attempts.findLast(attempt=>attempt.questionId===pair.id));
      setSelected(answers.every(Boolean)?JSON.stringify(Object.fromEntries(current.pairs.map((pair,index)=>[pair.id,answers[index]?.answer]))):progress.draft?.questionId===current.id?progress.draft.selected:"");
      return;
    }
    setSelected(currentAttempt?.questionId===current.id?currentAttempt.answer:progress.draft?.questionId===current.id?progress.draft.selected:"");
  },[current,currentAttempt,progress.attempts,progress.draft]);
  useEffect(()=>{setMatchFocus(null);},[current?.id]);
  const selectedTokens=current?.kind==="order"&&selected?selected.split(" "):[];
  const matchSelection=current?.kind==="match"?parseMatchSelection(current,selected)??{}:{};
  const canSubmit = current?.kind==="match" ? current.pairs.every(pair=>Boolean(matchSelection[pair.id])) : Boolean(selected);
  function submit() {
    if (!current || !canSubmit || checked) return;
    if (current.kind==="match") {
      const submittedAt=new Date().toISOString();
      const attempts=current.pairs.map(pair=>({questionId:pair.id,topic:current.topic,kind:"match" as const,correct:matchSelection[pair.id]===pair.answer,answer:matchSelection[pair.id],submittedAt}));
      setProgress(p=>({...p,draft:null,attempts:[...p.attempts,...attempts]}));
      return;
    }
    const correct = selected === current.answer;
    setProgress(p=>({...p,draft:null,attempts:[...p.attempts,{questionId:current.id,topic:current.topic,kind:current.kind,correct,answer:selected,submittedAt:new Date().toISOString()}]}));
  }
  function next() {
    if (!current) return;
    const last = (progress?.position??0) >= queue.length-1;
    setSelected("");
    if (last) { setProgress(p=>({...p,draft:null,completed:true}));setFinished(true);return; }
    setProgress(p=>({...p,draft:p.draft?.questionId===current.id?null:p.draft,position:p.position+1}));
  }
  function previous() {
    if (!progress || progress.position===0) return;
    setProgress(p=>({...p,position:p.position-1}));
  }
  function reset() { setSessions(previous=>({...previous,banks:{...previous.banks,[bankKey]:empty(bankKey,previous,learned)}}));setSelected("");setFinished(false); }
  function beginBank(bank: Topic | "basic" | "mixed" | "daily") {
    const current=sessions.banks[bank];
    if (current && !current.completed) return;
    const next={...sessions,banks:{...sessions.banks,[bank]:empty(bank,sessions,learned)}};
    if(user)writeSharedSessions(next,user.id);
    setSessions(next);
  }
  if (!isL14PhrasePracticeAvailable(user)) return <main className="page-heading"><h1>กำลังเตรียมแบบฝึกหัดประโยคและสำนวนบท 14</h1><Link href="/learn/L14/phrases">กลับไปบทเรียน</Link></main>;
  if (!sharedReady) return <main className="page-heading" aria-busy="true"><p>กำลังโหลดประวัติแบบฝึกหัด…</p></main>;
  if (slug&&!eligibleQueue) return <main className="l14-practice-page"><p>เรียนประโยคในชุดนี้ก่อนเริ่มฝึก</p><Link href="/learn/L14/phrases">ไปเรียนประโยคและสำนวน</Link></main>;
  if (!slug) {
    const recommendation=recommendL14PhrasePractice(JSON.stringify(sessions),storage.read(lessonStateKeys.l14Phrases),isTestWorkspaceUser(user));
    const primaryBank=recommendation.href.split("/").at(-1);
    const evidence=attemptHistory(sessions).slice(-20).reverse().map(attempt=>({correct:attempt.correct,topic:topicInfo[attempt.topic].title}));
    const pending=recommendation.kind==="resume"?sessions.banks[primaryBank??""]:undefined;
    const pendingQueue=pending?.taskIds.map(id=>tasks.find(task=>task.id===id)).filter((task):task is Task=>Boolean(task))??[];
    const pendingTotal=pendingQueue.reduce((sum,task)=>sum+taskCount(task),0);
    const pendingDone=pending?.attempts.length??0;
    return <main className="l14-practice-entry">
      <section className="l14-practice-entry-main"><PhrasePracticeInsights evidence={evidence} recommendation={recommendation.description}/><Link className="button primary" href={recommendation.href} onClick={recommendation.kind==="resume"&&pendingDone>0?event=>{event.preventDefault();setShowResume(true);}:recommendation.kind==="learn"||!primaryBank||recommendation.kind==="resume"?undefined:()=>beginBank(primaryBank==="basic"?"basic":"daily")}>{recommendation.kind==="resume"&&pendingDone===0?"เริ่มฝึก":recommendation.action} <ArrowRight size={18}/></Link></section>
      <details className="l14-practice-entry-topics"><summary>ฝึกเฉพาะหัวข้อ</summary><div className="practice-grammar-topic-list">{topicOrder.map(id=>{
        const count=guidedTasks.filter(task=>task.topic===id&&taskEligible(task,learned)).reduce((sum,task)=>sum+taskCount(task),0);
        return count?<Link className="practice-grammar-topic" href={`/practice/L14/phrases/${id}`} onClick={()=>beginBank(id)} key={id}><div><h2>{topicInfo[id].title}</h2><p>{count} ประโยคที่เรียนแล้ว · {count} ข้อ</p></div><span>ทำแบบฝึกหัด <ArrowRight size={18}/></span></Link>:<div className="practice-grammar-topic unavailable" key={id}><div><h2>{topicInfo[id].title}</h2><p>เรียนประโยคในหัวข้อนี้ก่อนเริ่มฝึก</p></div><Link href="/learn/L14/phrases">ไปเรียน</Link></div>;
      })}</div></details>
      {recommendation.kind==="resume"&&pending&&pendingDone>0&&showResume&&<ResumePracticeDialog href={recommendation.href} done={pendingDone} total={pendingTotal} onClose={()=>setShowResume(false)}/>}
    </main>;
  }
  if (finished || progress.completed) return <main className="l14-practice-page"><div className="guided-card phrase-practice-completion"><PhrasePracticeInsights completed evidence={progress.attempts.map(attempt=>({correct:attempt.correct,topic:topicInfo[attempt.topic].title}))} recommendation="ฝึกเพิ่มด้วยโจทย์จากประโยคที่เรียนแล้ว"/><div className="guided-navigation">{nextTopic&&<Link className="button primary" href={`/practice/L14/phrases/${nextTopic}`} onClick={()=>beginBank(nextTopic)}>ฝึกหัวข้อถัดไป</Link>}{guided||mixed?<Link className="button secondary" href="/practice/L14/phrases/daily" onClick={()=>beginBank("daily")}>ฝึกเพิ่ม</Link>:<button className="button secondary" type="button" onClick={reset}>ฝึกเพิ่ม</button>}<Link className="button secondary" href="/practice/L14/phrases">จบ</Link></div></div></main>;
  if (!current) return <main className="l14-practice-page"><p>ยังไม่มีข้อฝึกจากสำนวนที่เรียนแล้วในหัวข้อนี้</p><Link href="/learn/L14/phrases">ไปเรียนประโยคและสำนวน</Link></main>;
  const answerCorrect = current.kind==="match"?matchAttempts.every(attempt=>attempt?.correct===true):currentAttempt?.correct === true;
  const progressLabel = `${completedCount+1}${current.kind==="match"?`–${completedCount+taskCount(current)}`:""} / ${totalCount} ข้อ`;
  const visual = current.kind === "context" || current.kind === "dialogue" ? phraseVisualPrompts[current.id] : null;
  function connectMatch(questionId: string, answer: string) {
    if (current?.kind!=="match" || checked) return;
    const next={...matchSelection};
    for (const pair of current.pairs) if (next[pair.id]===answer) delete next[pair.id];
    next[questionId]=answer;
    const encoded=JSON.stringify(next);
    setSelected(encoded);
    setProgress(p=>({...p,draft:{questionId:current.id,selected:encoded}}));
    setMatchFocus(null);
  }
  function removeMatch(pairId: string) {
    if (current?.kind!=="match" || checked) return;
    const next={...matchSelection};
    delete next[pairId];
    const encoded=JSON.stringify(next);
    setSelected(encoded);
    setProgress(p=>({...p,draft:{questionId:current.id,selected:encoded}}));
    setMatchFocus(null);
  }
  function selectMatchQuestion(questionId: string) {
    if (matchFocus?.side==="answer") { connectMatch(questionId,matchFocus.value); return; }
    if (matchFocus?.value===questionId) { if (matchSelection[questionId]) removeMatch(questionId); else setMatchFocus(null); return; }
    setMatchFocus({side:"question",value:questionId});
  }
  function selectMatchAnswer(answer: string) {
    if (matchFocus?.side==="question") { connectMatch(matchFocus.value,answer); return; }
    if (matchFocus?.value===answer) {
      const assigned=current?.kind==="match"?current.pairs.find(pair=>matchSelection[pair.id]===answer):undefined;
      if (assigned) removeMatch(assigned.id); else setMatchFocus(null);
      return;
    }
    setMatchFocus({side:"answer",value:answer});
  }
  return <main className="l14-practice-page">
    <div className="vocabulary-image-progress"><span>{progressLabel}</span><div className="vocabulary-image-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={totalCount} aria-valuenow={completedCount+taskCount(current)}><span style={{width:`${(completedCount+taskCount(current))/totalCount*100}%`}}/></div></div>
    <section className="guided-card">
      {current.kind === "order" ? <p className="l14-order-instruction">เรียงประโยคให้ถูกต้อง</p> : <p className="eyebrow">{topicInfo[current.topic].title} · ข้อ {topicPosition}{current.kind==="match"?`–${topicPosition+1}`:""}/{topicTotal}</p>}
      {current.kind === "order" ? <>
        <h1 className="l14-order-title">{current.translation}</h1>
        <div className="l14-practice-built-sentence" aria-label="ประโยคที่เรียง" aria-live="polite">{selectedTokens.map((token,index)=><button className="l14-placed-token" key={`${token}-${index}`} type="button" aria-label={`นำ ${token} กลับไปตัวเลือก`} disabled={checked} onClick={()=>{const next=selectedTokens.filter((_,wordIndex)=>wordIndex!==index).join(" ");setSelected(next);setProgress(p=>({...p,draft:next?{questionId:current.id,selected:next}:null}));}}>{token}</button>)}</div>
        <div className="l14-phrase-choices">{current.tokens.filter((token,index)=>current.tokens.slice(0,index+1).filter(word=>word===token).length>selectedTokens.filter(word=>word===token).length).map((token,index)=><button className="button secondary" key={`${token}-${index}`} type="button" disabled={checked} onClick={()=>{const next=[...selectedTokens,token].join(" ");setSelected(next);setProgress(p=>({...p,draft:{questionId:current.id,selected:next}}));}}>{token}</button>)}</div>
        {selectedTokens.length>0&&!checked&&<button className="button secondary" type="button" onClick={()=>{setSelected("");setProgress(p=>({...p,draft:null}));}}>ล้างคำที่เรียง</button>}
      </> : current.kind==="match" ? <div className="l14-match">
        <h1>จับคู่คำถามกับคำตอบ</h1>
        {checked?<div className="l14-match-checked">{current.pairs.map((pair,index)=><div className={`l14-match-checked-row ${matchAttempts[index]?.correct?"correct":"incorrect"}`} key={pair.id}><span lang="de">{pair.question}</span><span aria-hidden="true">→</span><span lang="de">{matchSelection[pair.id]}</span></div>)}</div>:<>
          <p className="l14-match-help">เลือกกล่องจากฝั่งใดก่อนก็ได้ แล้วเลือกกล่องอีกฝั่งเพื่อจับคู่</p>
          <div className="l14-match-columns">
            <div className="l14-match-column" aria-label="คำถาม">{current.pairs.map(pair=><button className="l14-match-question" type="button" key={pair.id} aria-pressed={matchFocus?.side==="question"&&matchFocus.value===pair.id} data-matched={Boolean(matchSelection[pair.id])} onClick={()=>selectMatchQuestion(pair.id)} lang="de">{pair.question}</button>)}</div>
            <svg className="l14-match-lines" viewBox={`0 0 100 ${current.pairs.length*72-14}`} preserveAspectRatio="none" aria-hidden="true">{current.pairs.map((pair,index)=>{const answerIndex=[...current.pairs].reverse().findIndex(option=>option.answer===matchSelection[pair.id]);return answerIndex<0?null:<line key={pair.id} x1="0" y1={index*72+29} x2="100" y2={answerIndex*72+29}/>;})}</svg>
            <div className="l14-match-column" aria-label="คำตอบ">{[...current.pairs].reverse().map(pair=>{const assigned=current.pairs.find(question=>matchSelection[question.id]===pair.answer);return <button className="l14-match-answer" type="button" key={pair.id} aria-pressed={matchFocus?.side==="answer"&&matchFocus.value===pair.answer} data-matched={Boolean(assigned)} onClick={()=>selectMatchAnswer(pair.answer)} lang="de">{pair.answer}</button>;})}</div>
          </div>
        </>}
      </div> : visual ? <div className="l14-practice-scene">
        <figure className="l14-practice-scene-image"><Image src={visual.image} width={640} height={480} sizes="(max-width: 700px) 100vw, 300px" alt={visual.imageAlt} /></figure>
        <div className="l14-practice-scene-choices">
          <GermanVisualQuestion key={current.id} visual={visual} />
          <div className="l14-phrase-choices">{current.options.map(option=><button className="button secondary" key={option} type="button" aria-pressed={selected===option} disabled={checked} onClick={()=>{setSelected(option);setProgress(p=>({...p,draft:{questionId:current.id,selected:option}}));}}>{option}</button>)}</div>
        </div>
      </div> : (current.kind==="context"||current.kind==="dialogue") && <div className="l14-phrase-variant">
        <h1>{current.prompt}</h1>
        <div className="l14-phrase-choices">{current.options.map(option=><button className="button secondary" key={option} type="button" aria-pressed={selected===option} disabled={checked} onClick={()=>{setSelected(option);setProgress(p=>({...p,draft:{questionId:current.id,selected:option}}));}}>{option}</button>)}</div>
      </div>}
      {checked && current.kind==="match" ? <aside className={`practice-feedback ${answerCorrect?"correct":"incorrect"}`}>
        <h2>{answerCorrect?"ถูกต้องทั้งสองคู่":"ดูคำตอบแต่ละคู่"}</h2>
        {current.pairs.map((pair,index)=><div className="l14-match-feedback-pair" key={pair.id}><h3>คู่ {index+1} · {matchAttempts[index]?.correct?"ถูกต้อง":"ยังไม่ถูก"}</h3><p lang="de">{pair.question} → {pair.answer}</p><p>คำถาม: {pair.questionThai} · คำตอบ: {pair.translation}</p></div>)}
      </aside> : checked && current.kind!=="match" && <aside className={`practice-feedback ${answerCorrect?"correct":"incorrect"}`}>
        <h2>{answerCorrect?"ถูกต้อง":"ลองดูคำตอบ"}</h2>
        {visual && <p>คำแปลโจทย์: {visual.questionThai}</p>}
        <p lang="de">{current.answer}</p><p>{current.translation}</p>
        {current.kind === "order" ? <div className="l14-order-explanation"><h3>{current.ruleTitle}</h3><ul>{current.rules.map(rule=><li key={rule}>{rule}</li>)}</ul><p><strong>{current.noteTitle}:</strong> {current.exampleNote}</p></div> : <p>{current.explanation}</p>}
      </aside>}
      <div className="guided-navigation l14-question-navigation">{progress.position>0&&<button className="button secondary" type="button" onClick={previous}><ArrowLeft size={17}/> ย้อนกลับ</button>}{!checked?<button className="button primary" type="button" disabled={!canSubmit} onClick={submit}>ตรวจคำตอบ</button>:<button className="button primary" type="button" onClick={next}>{progress.position===queue.length-1?"จบรอบ":"ข้อต่อไป"} <ArrowRight size={17}/></button>}</div>
    </section>
  </main>;
}
