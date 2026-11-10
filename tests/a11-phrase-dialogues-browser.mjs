import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import {a11PhraseDialogues} from '../src/data/a11-phrase-dialogues.ts';
const base='http://localhost:3002',prefix='deutsch-trainer-phrase-discovery-v1-';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const errors=[],hosted=[];
async function login(email,normal=false){const context=await browser.newContext({viewport:{width:1360,height:1000}});await context.route('https://*.supabase.co/**',route=>{hosted.push(route.request().url());return route.abort();});if(normal)await context.route('**/__test-db/auth/v1/**',async route=>{const r=await route.fetch();if(!r.headers()['content-type']?.includes('json'))return route.fulfill({response:r});const d=await r.json();if(d.user)d.user.email='normal@deutsch.test';if(d.email)d.email='normal@deutsch.test';return route.fulfill({response:r,json:d});});const page=await context.newPage();page.setDefaultTimeout(60000);await page.addInitScript(()=>{window.__completedAudio=[];const play=HTMLMediaElement.prototype.play;HTMLMediaElement.prototype.play=function(){this.addEventListener('ended',()=>window.__completedAudio.push(this.currentSrc||this.src),{once:true});return play.call(this);};});page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'/learn/L03/phrases');await page.getByLabel('อีเมล',{exact:true}).fill(email);await page.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await page.locator('.profile').waitFor();return{page,context};}
async function rows(page){return page.evaluate(async()=>{const name=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(name));const r=await fetch('/__test-db/rest/v1/learner_lesson_states?select=lesson_key,state',{headers:{Authorization:'Bearer '+auth.access_token}});if(!r.ok)throw Error('Read failed');return r.json();});}
async function saved(page,key,predicate){for(let i=0;i<120;i++){const r=(await rows(page)).find(r=>r.lesson_key===key)?.state?.runs.at(-1);if(r&&predicate(r))return r;await new Promise(r=>setTimeout(r,120));}throw Error('Save not observed '+key);}
async function appendRun(page,key){await saved(page,key,()=>true);await page.evaluate(async key=>{const name=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const a=JSON.parse(localStorage.getItem(name)),headers={Authorization:'Bearer '+a.access_token,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},url='/__test-db/rest/v1/learner_lesson_states';const rows=await(await fetch(url+'?select=state&lesson_key=eq.'+key,{headers})).json(),state=rows[0].state;state.runs.push({id:'full-browser-'+crypto.randomUUID(),queue:state.runs[0].queue,step:0,models:[],responses:{}});const r=await fetch(url+'?on_conflict=user_id,lesson_key',{method:'POST',headers,body:JSON.stringify({user_id:a.user.id,lesson_key:key,state})});if(!r.ok)throw Error('Append failed');},key);await page.reload();}
try{
 const {page,context}=await login('tester2@deutsch.test');await page.locator('.phrase-dialogue-learning').waitFor();const keys=Object.keys(a11PhraseDialogues).map(id=>prefix+id),before=(await rows(page)).filter(row=>!keys.includes(row.lesson_key));let taskCount=0,unitCount=0,audioCount=0;
 const selected=Object.entries(a11PhraseDialogues).filter(([id])=>!process.env.LESSONS||process.env.LESSONS.split(',').includes(id));
 for(const [lesson,topics] of selected){
  const key=prefix+lesson;await page.goto(base+'/learn/'+lesson+'/phrases');await page.locator('.phrase-dialogue-learning').waitFor();await appendRun(page,key);let lessonTasks=0,lessonUnits=0;const firstTask=topics.flatMap(t=>t.tasks).find(t=>t.kind==='choice').id;
  console.log('BEGIN',lesson);
  for(const topic of topics){
   await page.getByRole('heading',{name:topic.title,exact:true}).waitFor();
   if(topic.grammarPatterns){
    assert.equal(await page.locator('.phrase-perfekt-pattern').count(),topic.grammarPatterns.length);
    for(const pattern of topic.grammarPatterns){
     const card=page.locator('.phrase-perfekt-pattern').filter({has:page.getByRole('heading',{name:pattern.title,exact:true})});
     assert.equal((await card.locator('.phrase-perfekt-form').nth(0).locator('.phrase-annotated-part dt').allTextContents()).join(' '),pattern.present);
     assert.equal((await card.locator('.phrase-perfekt-form').nth(1).locator('.phrase-annotated-part dt').allTextContents()).join(' '),pattern.past);
     await card.getByRole('button',{name:'ฟังตัวอย่าง',exact:true}).click();
     await card.getByRole('button',{name:'ฟังตัวอย่าง',exact:true}).waitFor();
     assert.equal(await card.getByRole('alert').count(),0);
    }
   }else{
    assert.equal(await page.locator('.phrase-discovery-turn > span').filter({hasText:/^A$/}).count(),topic.models.length);
    assert.equal(await page.locator('.phrase-discovery-turn > span').filter({hasText:/^B$/}).count(),topic.models.length);
    if(lesson==='L11')for(const card of await page.locator('.phrase-discovery-model').all()){
     await card.getByRole('button',{name:'ฟังตัวอย่างนี้',exact:true}).click();
     await card.getByRole('button',{name:'ฟังตัวอย่างนี้',exact:true}).waitFor();
     assert.equal(await card.getByRole('alert').count(),0);
    }
   }
   if(lesson==='L11'){
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>window.scrollTo(0,0));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    await page.waitForFunction(()=>[...document.querySelectorAll('.phrase-annotated-sentence')].every(row=>row.scrollWidth<=row.clientWidth+1));
    assert.equal(await page.locator('.phrase-mobile-legend,.phrase-annotation-number,.phrase-legend-number').count(),0);
    assert.equal(await page.locator('.phrase-annotated-part').evaluateAll(parts=>parts.every(part=>{const word=part.querySelector('dt').getBoundingClientRect(),label=part.querySelector('.phrase-mobile-role-label').getBoundingClientRect();return label.width>0&&label.top>=word.bottom&&Math.abs(label.left+label.width/2-word.left-word.width/2)<2;})),true);
    assert.equal(await page.locator('.phrase-annotated-sentence').evaluateAll(rows=>rows.every(row=>{const boxes=[...row.querySelectorAll('dt')].map(word=>word.getBoundingClientRect());return boxes.every(box=>Math.abs(box.top-boxes[0].top)<1);})),true);
    await page.screenshot({path:`.tools/${topic.id}-teaching-mobile.png`,fullPage:true,animations:'disabled'});
    await page.setViewportSize({width:1360,height:1000});
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.screenshot({path:`.tools/${topic.id}-teaching-desktop.png`,fullPage:true,animations:'disabled'});
   }
   await page.locator('.phrase-dialogue-learning img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())));
   const duration=await page.evaluate(src=>new Promise((resolve,reject)=>{const a=new Audio(src);a.onloadedmetadata=()=>resolve(a.duration);a.onerror=reject;a.load();}),topic.audio);assert(duration>1);
   if(topic===topics[0]){await page.setViewportSize({width:1360,height:1000});await page.screenshot({path:`.tools/${lesson}-phrases-desktop.png`,fullPage:true,animations:'disabled'});}
   assert(!/PDF|sourceId|Kommunikation ·/.test(await page.locator('.phrase-dialogue-learning').innerText()));await page.getByRole('button',{name:'ลองตอบ',exact:true}).click();
   for(const task of topic.tasks){
    lessonTasks++;taskCount++;const units=task.kind==='profile'?task.fields.map(f=>f.unit):[task.unit];lessonUnits+=units.length;unitCount+=units.length;
    if(lesson==='L11'){
     await page.locator('.phrase-discovery-task-copy h1').waitFor();
     assert.equal(await page.locator('.phrase-annotated-part').count(),0);
     await page.setViewportSize({width:1360,height:1000});
     await page.evaluate(()=>window.scrollTo(0,0));
     await page.screenshot({path:`.tools/${task.id}-before-desktop.png`,fullPage:true,animations:'disabled'});
     await page.setViewportSize({width:390,height:844});
     await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);
     await page.screenshot({path:`.tools/${task.id}-before-mobile.png`,fullPage:true,animations:'disabled'});
    }
    if(task.kind==='choice'){
     const answer=task.id===firstTask?task.options.find(o=>o!==task.unit.answer):task.unit.answer;await page.getByRole('button',{name:answer,exact:true}).click();
    }else if(task.kind==='order'){
     const used=new Set();for(const word of task.unit.answer.split(' ')){const i=task.tokens.findIndex((t,i)=>t===word&&!used.has(i));used.add(i);await page.getByLabel('คำที่ให้',{exact:true}).getByRole('button').nth(i).click();}
    }else if(task.kind==='profile')for(const f of task.fields)await page.getByLabel(f.label,{exact:true}).fill(f.unit.answer);
    else await page.getByLabel(task.label,{exact:true}).fill(task.unit.answer);
    if(task.audio){audioCount++;assert.equal(await page.locator('.l02-task-context .dialogue-board,.l02-task-context img,.l02-task-context .l02-person-reading').count(),0);assert(await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).isDisabled());await page.getByRole('button',{name:'ฟังบทสนทนา',exact:true}).click();await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='ตรวจคำตอบ')?.disabled);}
    await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await page.locator('.phrase-discovery-feedback').waitFor();
    assert.equal(await page.locator('.phrase-discovery-feedback > strong').innerText(),task.id===firstTask?'ยังไม่ถูก':'ถูกต้อง');
    assert.equal(await page.locator('.l02-unit-feedback').count(),units.length);
    if(lesson==='L11'&&task.feedbackAudio){
     assert.equal((await page.locator('.l02-unit-feedback .phrase-annotated-part dt').allTextContents()).join(' '),task.unit.answer);
     assert.equal((await page.locator('.phrase-discovery-feedback > .phrase-discovery-turn .phrase-annotated-part dt').allTextContents()).join(' '),task.prompt);
     const audioButton=page.getByRole('button',{name:'ฟังบทสนทนา A และ B',exact:true});
     assert.equal(await audioButton.innerText(),'');
     await audioButton.click();
     await page.waitForFunction(source=>window.__completedAudio.some(url=>url.endsWith(source)),task.feedbackAudio);
    }
    if(task.id===firstTask){const state=await saved(page,key,r=>r.responses[task.id]?.first);const first=state.responses[task.id].first;await page.reload();await page.locator('.phrase-discovery-feedback').waitFor();assert.deepEqual((await saved(page,key,()=>true)).responses[task.id].first,first);}
    await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth,null,{timeout:8000});
    if(lesson==='L11'){
     await page.evaluate(()=>window.scrollTo(0,0));
     await page.screenshot({path:`.tools/${task.id}-feedback-mobile.png`,fullPage:true,animations:'disabled'});
     await page.setViewportSize({width:1360,height:1000});
     await page.evaluate(()=>window.scrollTo(0,0));
     await page.screenshot({path:`.tools/${task.id}-feedback-desktop.png`,fullPage:true,animations:'disabled'});
    }
    if(task===topic.tasks[0]&&topic===topics[0])await page.screenshot({path:`.tools/${lesson}-phrases-mobile.png`,fullPage:true,animations:'disabled'});
    const last=topic===topics.at(-1)&&task===topic.tasks.at(-1);await page.getByRole('button',{name:last?'จบการเรียน':'ต่อไป',exact:true}).click();
   }
  }
  await page.getByRole('heading',{name:`เรียนประโยคบท ${Number(lesson.slice(1))} ครบแล้ว`,exact:true}).waitFor();const done=await saved(page,key,r=>r.step===r.queue.length);assert.equal(Object.keys(done.responses).length,lessonTasks);const evidence=Object.values(done.responses).flatMap(r=>Object.values(r.first));assert.equal(evidence.length,lessonUnits);assert.equal(evidence.filter(e=>!e.correct).length,1);assert(evidence.every(e=>e.presentation===lesson+'-dialogue-v1'));
  await page.reload();await page.getByRole('heading',{name:`เรียนประโยคบท ${Number(lesson.slice(1))} ครบแล้ว`,exact:true}).waitFor();console.log('PASS',lesson,lessonTasks,'tasks',lessonUnits,'stored units');
 }
 assert.equal(taskCount,selected.flatMap(([,topics])=>topics.flatMap(t=>t.tasks)).length);assert.equal(unitCount,selected.flatMap(([,topics])=>topics.flatMap(t=>t.tasks.flatMap(q=>q.kind==='profile'?q.fields:[q]))).length);assert.equal(audioCount,selected.flatMap(([,topics])=>topics.flatMap(t=>t.tasks.filter(q=>q.audio))).length);assert.deepEqual((await rows(page)).filter(row=>!keys.includes(row.lesson_key)),before);
 const normal=await login('tester@deutsch.test',true);for(const lesson of Object.keys(a11PhraseDialogues)){await normal.page.goto(base+'/learn/'+lesson+'/phrases');await normal.page.locator('.a11-phrase-learning,.lesson-heading').first().waitFor();assert.equal(await normal.page.locator('.phrase-dialogue-learning').count(),0);}await normal.context.close();
 const other=await login('tester@deutsch.test');await other.page.locator('.phrase-dialogue-learning').waitFor();assert.equal(await other.page.getByRole('heading',{name:'เรียนประโยคบท 3 ครบแล้ว',exact:true}).count(),0);await other.context.close();
 assert.deepEqual(errors,[]);assert.deepEqual(hosted,[]);await context.close();console.log('PASS',selected.length,'selected lesson replacements, actual audio, per-lesson persistence/resume, mobile, account isolation, all normal gates, and L01/L02 history preservation');
}finally{await browser.close();}
