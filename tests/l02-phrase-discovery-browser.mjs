import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const base='http://localhost:3002',key='deutsch-trainer-phrase-discovery-v1-L02';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const errors=[],hosted=[];
async function login(email,normal=false){
 const context=await browser.newContext({viewport:{width:1360,height:1000}});
 await context.route('https://*.supabase.co/**',route=>{hosted.push(route.request().url());return route.abort();});
 if(normal)await context.route('**/__test-db/auth/v1/**',async route=>{const r=await route.fetch();if(!r.headers()['content-type']?.includes('json'))return route.fulfill({response:r});const d=await r.json();if(d.user)d.user.email='normal@deutsch.test';if(d.email)d.email='normal@deutsch.test';return route.fulfill({response:r,json:d});});
 const page=await context.newPage();page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/learn/L02/phrases');await page.getByLabel('อีเมล',{exact:true}).fill(email);await page.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await page.locator('.profile').waitFor();return {page,context};
}
async function rows(page){return page.evaluate(async()=>{const name=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(name));const r=await fetch('/__test-db/rest/v1/learner_lesson_states?select=lesson_key,state',{headers:{Authorization:'Bearer '+auth.access_token}});if(!r.ok)throw Error('History read failed');return r.json();});}
async function saved(page,predicate){for(let i=0;i<100;i++){const r=(await rows(page)).find(r=>r.lesson_key===key)?.state?.runs.at(-1);if(r&&predicate(r))return r;await new Promise(r=>setTimeout(r,150));}throw Error('Save not observed');}
const titles=['อาชีพและที่ทำงาน','สถานะการทำงาน','ถามและบอกอายุ','อาศัยอยู่ที่ไหน','ชีวิตคู่และลูก','อาชีพในฝัน','ติดต่อและแนะนำตัว'];
const answers=[['Wir arbeiten als Friseure.',['Ich','arbeite','bei','Haarfit.'],'Ich bin Lehrerin.'],['Ich mache ein Praktikum.','Ich bin angestellt.',['Ich','arbeite','im','Moment','nicht.']],['31',['Ich','bin','28','Jahre','alt.']],[['Ich','wohne','in','Bangkok.'],'Wir wohnen in Berlin.'],['Ja, wir leben zusammen.','Nein, wir sind nicht verheiratet.',['Wir','haben','keine','Kinder.']],['Mein Traumberuf ist Arzt.','Ich arbeite als Verkäufer.'],['Wie ist deine Handynummer?','0301234567',{age:'28',home:'Berlin',work:'Haarfit'}]];
try{
 const {page,context}=await login('tester2@deutsch.test');await page.locator('.l02-phrase-discovery').waitFor();
 const before=(await rows(page)).filter(r=>r.lesson_key!==key);
 // Append a run without deleting earlier test history.
 await saved(page,()=>true);
 await page.evaluate(async key=>{const name=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(name));const headers={Authorization:'Bearer '+auth.access_token,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'};const url='/__test-db/rest/v1/learner_lesson_states';const rows=await(await fetch(url+'?select=state&lesson_key=eq.'+key,{headers})).json();const state=rows[0].state;const initial=state.runs[0];state.runs.push({id:'l02-browser-'+crypto.randomUUID(),queue:initial.queue,step:0,models:[],responses:{}});const r=await fetch(url+'?on_conflict=user_id,lesson_key',{method:'POST',headers,body:JSON.stringify({user_id:auth.user.id,lesson_key:key,state})});if(!r.ok)throw Error('Cannot append run');},key);
 await page.reload();
 for(let topic=0;topic<titles.length;topic++){
  await page.getByRole('heading',{name:titles[topic],exact:true}).waitFor();
  assert(await page.locator('.phrase-discovery-turn > span').filter({hasText:/^A$/}).count()>0);
  await page.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())));
  assert(!/PDF|L02-F0|teacher-slides/.test(await page.locator('.l02-phrase-discovery').innerText()));
  // Decode actual authored model recordings without changing listening evidence.
  const models=['work','status','age','home','couple','dream','contact'];
  const duration=await page.evaluate(src=>new Promise((resolve,reject)=>{const a=new Audio(src);a.onloadedmetadata=()=>resolve(a.duration);a.onerror=reject;a.load();}),'/audio/l02/model-'+models[topic]+'.m4a');assert(duration>2);
  if(topic===0)await page.screenshot({path:'.tools/l02-discovery-desktop.png',fullPage:true,animations:'disabled'});
  await page.getByRole('button',{name:'ลองตอบ',exact:true}).click();
  for(let item=0;item<answers[topic].length;item++){
   const answer=answers[topic][item];
   if(topic===0&&item===0){
    await page.getByRole('button',{name:'Wir wohnen in Berlin.',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await page.getByText('ลองดูคำตอบนี้',{exact:true}).waitFor();const r=await saved(page,r=>r.responses['L02-UX-PROF-01']?.first);const first=r.responses['L02-UX-PROF-01'].first;
    await page.reload();await page.getByText('ลองดูคำตอบนี้',{exact:true}).waitFor();assert.deepEqual((await saved(page,()=>true)).responses['L02-UX-PROF-01'].first,first);
   }else{
    if(Array.isArray(answer)){
     for(const word of answer){await page.getByRole('button',{name:word,exact:true}).click();if(topic===0&&item===1&&word==='Ich'){await saved(page,r=>r.responses['L02-UX-WORK-01']?.selection.length===1);await page.reload();await page.getByRole('button',{name:'นำ Ich กลับ',exact:true}).waitFor();await page.getByRole('button',{name:'นำ Ich กลับ',exact:true}).click();await page.getByRole('button',{name:'Ich',exact:true}).click();}}
    }else if(typeof answer==='object'){
     await page.getByLabel('อายุ',{exact:true}).fill(answer.age);await page.getByLabel('เมืองที่อาศัยอยู่',{exact:true}).fill(answer.home);await page.getByLabel('สถานที่ทำงาน',{exact:true}).fill('Wrong');
    }else if(/^\d+$/.test(answer)){
     const label=topic===2?'อายุ':'เบอร์มือถือ';await page.getByLabel(label,{exact:true}).fill(answer);assert(await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).isDisabled());
     assert(!/31|0301234567/.test(await page.locator('.l02-task-context').innerText()));
     if(topic===2){await page.route('**/audio/l02/l02-ux-age-audio-01.m4a',route=>route.abort());await page.getByRole('button',{name:'ฟังบทสนทนา',exact:true}).click();await page.getByRole('alert').filter({hasText:'เล่นเสียงไม่สำเร็จ'}).waitFor();assert(await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).isDisabled());await page.unroute('**/audio/l02/l02-ux-age-audio-01.m4a');}
     await page.getByRole('button',{name:'ฟังบทสนทนา',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).waitFor({state:'visible'});await page.waitForFunction(()=>!Array.from(document.querySelectorAll('button')).find(b=>b.textContent==='ตรวจคำตอบ')?.disabled);
    }else await page.getByRole('button',{name:answer,exact:true}).click();
    await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await page.getByRole('status').filter({has:page.locator('strong')}).waitFor();
    if(typeof answer==='object'&&!Array.isArray(answer)){assert.equal(await page.getByText('อายุ: ถูกต้อง',{exact:true}).count(),1);assert.equal(await page.getByText('เมืองที่อาศัยอยู่: ถูกต้อง',{exact:true}).count(),1);assert.equal(await page.getByText('สถานที่ทำงาน: ลองดูคำตอบนี้',{exact:true}).count(),1);}
    else assert.equal(await page.getByText('ถูกต้อง',{exact:true}).count(),1);
   }
   await page.setViewportSize({width:390,height:844});
   try{await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth,null,{timeout:5000});}catch(e){await page.screenshot({path:'.tools/l02-overflow.png',fullPage:true});console.log('OVERFLOW',topic,item,await page.evaluate(()=>[...document.querySelectorAll('.l02-phrase-discovery *')].filter(el=>el.getBoundingClientRect().right>innerWidth).map(el=>[el.tagName,el.className,el.getBoundingClientRect().width]).slice(0,12)));throw e;}
   if(topic===6&&item===2)await page.screenshot({path:'.tools/l02-discovery-mobile.png',fullPage:true,animations:'disabled'});
   await page.getByRole('button',{name:topic===6&&item===2?'จบการเรียน':'ต่อไป',exact:true}).click();
  }
 }
 await page.getByRole('heading',{name:'เรียนประโยคบท 2 ครบแล้ว',exact:true}).waitFor();const done=await saved(page,r=>r.step===25);assert.equal(Object.keys(done.responses).length,18);const evidence=Object.values(done.responses).flatMap(r=>Object.values(r.first));assert.equal(evidence.length,20);assert.equal(evidence.filter(e=>e.correct).length,18);assert.equal(evidence.find(e=>e.subskill==='phone_digit_listening').response,'0301234567');assert(evidence.filter(e=>e.subskill==='age_listening'||e.subskill==='phone_digit_listening').every(e=>e.completedPlays===1));
 await page.reload();await page.getByRole('heading',{name:'เรียนประโยคบท 2 ครบแล้ว',exact:true}).waitFor();assert.deepEqual((await rows(page)).filter(r=>r.lesson_key!==key),before);
 const normal=await login('tester@deutsch.test',true);await normal.page.locator('.l02-phrase-learning').waitFor();assert.equal(await normal.page.locator('.l02-phrase-discovery').count(),0);await normal.context.close();
 const other=await login('tester@deutsch.test');await other.page.locator('.l02-phrase-discovery').waitFor();assert.equal(await other.page.getByRole('heading',{name:'เรียนประโยคบท 2 ครบแล้ว',exact:true}).count(),0);await other.context.close();
 assert.deepEqual(errors,[]);assert.deepEqual(hosted,[]);await context.close();console.log('PASS L02 replacement: 7 models,18 tasks/20 evidence units, actual audio, failure/retry, wrong-first, draft reload/removal, profile grading, account isolation, normal gate and old history');
}finally{await browser.close();}
