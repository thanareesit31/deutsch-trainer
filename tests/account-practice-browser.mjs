import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const contexts=[];const errors=[];const base='http://localhost:3002';
async function device(email){const c=await browser.newContext();contexts.push(c);const p=await c.newPage();p.setDefaultTimeout(45000);p.on('pageerror',e=>errors.push(e.message));await p.goto(base+'/practice');await p.getByLabel('อีเมล',{exact:true}).fill(email);await p.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');await p.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await p.locator('.practice-recommendation').waitFor();return p;}
async function frame(p){await p.locator('iframe').waitFor();const f=p.frames().find(f=>f.name().startsWith('grammar-basic-account-'));await f.locator('[data-question-id],#continue-topic').first().waitFor();return f;}
async function rows(p){return p.evaluate(async()=>{const key=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(key));const r=await fetch('/__test-db/rest/v1/learner_practice_sessions?select=bank_key,state',{headers:{Authorization:'Bearer '+auth.access_token}});if(!r.ok)throw new Error('Read failed '+r.status);return r.json();});}
async function until(fn,message){for(let i=0;i<100;i++){if(await fn())return;await new Promise(r=>setTimeout(r,100));}throw new Error(message);}
async function correct(f){const q=await f.evaluate(()=>activeItem().question);if(q.kind==='choice')await f.getByRole('button',{name:q.acceptedAnswers[0],exact:true}).click();else if(q.kind==='cloze')await f.locator('#response').fill(q.acceptedAnswers[0]);else for(const t of q.tokens)await f.getByRole('button',{name:'เพิ่มคำ '+t,exact:true}).click();await f.locator('#check').click();}
try{
 const a=await device('tester@deutsch.test');await a.goto(base+'/practice/L13/grammar/basic');let fa=await frame(a);await fa.evaluate(()=>start(BANK.questions,15));const initial=await fa.evaluate(()=>structuredClone(current()));const id=initial.id;
 await correct(fa);await until(async()=>{const r=(await rows(a)).find(r=>r.state.id===id);return r?.state.items[0].attempt?.status==='pending';},'Pending answer not saved');
 await until(async()=>{const r=(await rows(a)).find(r=>r.state.id===id);return r?.state.items[0].attempt?.confidence===null;},'Confidence not saved');
 const b=await device('tester@deutsch.test');await b.locator('.practice-recommendation a').click();let fb=await frame(b);assert.equal(await fb.evaluate(()=>current().id),id);assert.equal(await fb.evaluate(()=>activeItem().attempt.confidence),null);
 await fb.locator('#next').click();await correct(fb);await fb.locator('#next').click();await until(async()=>{const r=(await rows(b)).find(r=>r.state.id===id);return r?.state.position===2&&r.state.items[1].attempt?.confidence===null;},'Device B answers not saved');
 // Send an older device snapshot after B advanced, preserving first answers.
 const stale=await a.evaluate(async state=>{state.updatedAt=new Date().toISOString();const key=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(key));const r=await fetch('/__test-db/rest/v1/rpc/sync_practice_session',{method:'POST',headers:{Authorization:'Bearer '+auth.access_token,'Content-Type':'application/json'},body:JSON.stringify({p_bank_key:'grammar-basic',p_state:state})});return r.status;},initial);assert.equal(stale,200);
 const retained=(await rows(a)).find(r=>r.state.id===id).state;assert.equal(retained.position,2);assert.equal(retained.items[0].attempt.confidence,'easy');assert.equal(retained.items[1].attempt.confidence,'thought');
 await b.route('**/rpc/sync_practice_session',r=>r.abort());await correct(fb);await b.getByText('เก็บคำตอบในเครื่องแล้ว แต่ยังบันทึกเข้าบัญชีไม่ได้',{exact:false}).waitFor();assert.equal((await rows(a)).find(r=>r.state.id===id).state.items[2].attempt,null);
 await b.unroute('**/rpc/sync_practice_session');await b.evaluate(()=>window.dispatchEvent(new Event('online')));await until(async()=>!!(await rows(a)).find(r=>r.state.id===id).state.items[2].attempt,'Offline retry failed');
 const other=await device('tester2@deutsch.test');assert(!(await rows(other)).some(r=>r.state.id===id));
 await a.goto(base+'/practice');await a.locator('.practice-recommendation a').click();fa=await frame(a);assert.equal(await fa.evaluate(()=>current().id),id);assert.equal(await fa.evaluate(()=>current().position),2);assert.equal(await fa.evaluate(()=>activeItem().attempt.confidence),null);
 await fa.locator('#next').click();
 for(let i=3;i<5;i++){await correct(fa);await fa.locator('#next').click();}
 await fa.locator('#continue-topic').waitFor();await until(async()=> (await rows(a)).find(r=>r.state.id===id).state.breakAt===5,'Checkpoint not saved');
 await b.goto(base+'/practice');await b.locator('.practice-recommendation a').click();fb=await frame(b);await fb.locator('#continue-topic').waitFor();await fb.locator('#continue-topic').click();
 for(let i=5;i<15;i++){await correct(fb);await fb.locator('#next').click();if(i===9)await fb.locator('#continue-topic').click();}
 await fb.getByRole('heading',{name:'ฝึกหลังเรียนครบแล้ว'}).waitFor();await until(async()=> (await rows(b)).find(r=>r.state.id===id).state.completed===true,'Completion not saved');
 await a.goto(base+'/practice');await a.locator('.practice-recommendation a').waitFor();assert(!(await a.locator('.practice-recommendation a').getAttribute('href')).includes(id));
 assert.deepEqual(errors,[]);console.log(JSON.stringify({crossDeviceResume:true,unknownConfidencePreserved:true,staleUploadPreservedAnswers:true,offlineRetry:true,accountsIsolated:true,checkpointResume:true,completedFifteenSaved:true,pageErrors:errors}));
}catch(e){for(const c of contexts){const p=c.pages()[0];console.log('PAGE',p?.url(),(await p?.locator('body').innerText())?.slice(-1500));}throw e;}finally{await browser.close();}
