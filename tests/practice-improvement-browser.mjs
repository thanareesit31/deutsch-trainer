import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { a13ReleaseCourses } from '../src/data/a13-release.ts';
import { releasePracticeQuestion } from '../src/lib/a13-release-question.ts';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const report=[];
try {
 const page=await browser.newPage({viewport:{width:375,height:812}});page.setDefaultTimeout(60000);
 await page.goto('http://localhost:3002/practice/L15/phrases');
 await page.getByLabel('อีเมล',{exact:true}).fill('tester2@deutsch.test');await page.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await page.locator('.release-course').waitFor();
 for(const skill of ['phrases','grammar']) {
  const course=a13ReleaseCourses.find(c=>c.lessonId==='L15'&&c.skill===skill);
  const highest=course.tasks.find(t=>t.practice?.stage===3);
  const chain=course.tasks.filter(t=>t.targetId===highest.targetId);
  const rounds=[];
  for(const stage of [0,1,2]) for(const task of chain.filter(t=>t.practice.stage===stage)) rounds.push({task,question:releasePracticeQuestion(course,task)});
  const checks=[chain.find(t=>t.practice.stage===2),highest];
  const ids=await page.evaluate(async({course,rounds,checks})=>{
   const authKey=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(authKey));
   const headers={'Authorization':`Bearer ${auth.access_token}`,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'};
   async function api(path,method='GET',body){const r=await fetch(`/__test-db/rest/v1/${path}`,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});if(!r.ok)throw Error(await r.text());const text=await r.text();return text?JSON.parse(text):null;}
   const key=`deutsch-trainer-release-course-v1-L15-${course.skill}`;const prior=await api(`learner_lesson_states?select=state&lesson_key=eq.${key}`);const state=prior[0]?.state??{version:1,learned:[],cursor:0,active:null,attempts:[]};state.learned=[...new Set([...state.learned,...course.cards.map(c=>c.id)])];
   await api('learner_lesson_states?on_conflict=user_id,lesson_key','POST',{user_id:auth.user.id,lesson_key:key,state});
   const bank=`a13-release-l15-${course.skill}`;
   async function save(task,question,complete){const now=new Date().toISOString(),id=crypto.randomUUID();const entry={question,response:complete?task.acceptedAnswers[0]:'',selected:[],tokenOrder:[],hintUsed:false,translationUsed:false,attempt:complete?{response:task.acceptedAnswers[0],correct:true,status:'completed',submittedAt:now,assisted:false,confidence:null}:null};await api('rpc/sync_practice_session','POST',{p_bank_key:bank,p_state:{id,createdAt:now,updatedAt:now,completed:complete,position:0,items:[entry]}});return id;}
   for(const row of rounds)await save(row.task,row.question,true);
   const ids=[];for(const row of checks)ids.push(await save(row.task,row.question,false));return ids;
  },{course,rounds,checks:checks.map(task=>({task,question:releasePracticeQuestion(course,task)}))});
  for(let index=0;index<checks.length;index++) {
   const task=checks[index];await page.goto(`http://localhost:3002/practice/L15/${skill}?resume=${ids[index]}`);await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).waitFor();
   assert.equal(await page.locator('.phrase-annotated-sentence').count(),0,'no answers before checking');
   const input=page.getByRole('textbox',{name:'คำตอบภาษาเยอรมัน'});assert.equal(await input.evaluate(e=>e.tagName),task.answerScope==='sentence'?'TEXTAREA':'INPUT');
   await input.fill('ผิดเพื่อทดสอบ');await page.waitForTimeout(800);await page.reload();await input.waitFor();assert.equal(await input.inputValue(),'ผิดเพื่อทดสอบ','draft survives reload');
   await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await page.locator('[data-feedback-category]').waitFor();assert.ok(await page.locator('.phrase-annotated-sentence').count());
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no viewport overflow');
   report.push({skill,stage:task.practice.stage,scope:task.answerScope,draftRestored:true,feedback:true});
  }
 }
 writeFileSync('.audit/practice-improvement-browser.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report));
} finally {await browser.close();}
