import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';
const base=process.env.TEST_BASE_URL||'http://localhost:3002';
const key='deutsch-trainer-phrase-discovery-v1-L01';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const errors=[];
const production=[];
async function login(email,learner=false){
 const context=await browser.newContext({viewport:{width:1280,height:960}});
 await context.route('https://*.supabase.co/**',route=>{production.push(route.request().url());return route.abort();});
 if(learner)await context.route('**/__test-db/auth/v1/**',async route=>{
  const response=await route.fetch();if(!response.headers()['content-type']?.includes('json'))return route.fulfill({response});
  const data=await response.json();if(data.user)data.user.email='learner-preview@deutsch.test';if(data.email)data.email='learner-preview@deutsch.test';
  await route.fulfill({response,json:data});
 });
 const page=await context.newPage();page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/learn/L01/phrases/discovery?part=supplement');
 await page.getByLabel('อีเมล',{exact:true}).fill(email);await page.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');
 await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await page.locator('.profile').waitFor();
 return {page,context};
}
async function history(page){return page.evaluate(async key=>{
 const authKey=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(authKey));
 const r=await fetch('/__test-db/rest/v1/learner_lesson_states?select=state&lesson_key=eq.'+key,{headers:{Authorization:'Bearer '+auth.access_token}});
 if(!r.ok)throw Error('Cannot read account state');const rows=await r.json();return rows[0]?.state??{version:1,runs:[]};
},key);}
async function saved(page,condition){
 const until=Date.now()+20000;while(Date.now()<until){const state=await history(page);const run=state.runs.filter(r=>r.scope==='supplement').at(-1);if(run&&condition(run))return state;await new Promise(r=>setTimeout(r,100));}throw Error('Account save not observed');
}
function legacyProjection(state){return state.runs.filter(r=>(r.scope??'all')==='all').map(r=>({id:r.id,step:r.step,completed:r.completed,modelIds:r.modelIds,responses:Object.fromEntries(Object.entries(r.responses).map(([id,value])=>[id,{selection:value.selection,first:value.first?{response:value.first.response,correct:value.first.correct,submittedAt:value.first.submittedAt,helpWords:value.first.helpWords,modelSeen:value.first.modelSeen}:null}]))}));}
try{
 const {page,context}=await login('tester2@deutsch.test');await page.locator('.phrase-discovery').waitFor();
 const before=await history(page);const legacy=legacyProjection(before);
 // Start an isolated test run without removing any existing learning history.
 await page.evaluate(async key=>{
  const name=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(name));
  const headers={Authorization:'Bearer '+auth.access_token,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'};
  const url='/__test-db/rest/v1/learner_lesson_states';const rows=await(await fetch(url+'?select=state&lesson_key=eq.'+key,{headers})).json();
  const state=rows[0]?.state??{version:1,runs:[]};state.runs.push({id:'supplement-browser-'+crypto.randomUUID(),bankVersion:2,scope:'supplement',step:0,modelIds:[],responses:{},completed:false});
  const r=await fetch(url+'?on_conflict=user_id,lesson_key',{method:'POST',headers,body:JSON.stringify({user_id:auth.user.id,lesson_key:key,state})});if(!r.ok)throw Error('Cannot create local tester run');
 },key);
 await page.reload();await page.getByRole('heading',{name:'ถามชื่อและนามสกุล',exact:true}).waitFor();
 assert(!/PDF|L01-SUP|teacher-slides/.test(await page.locator('#main').innerText()));
 const model=()=>page.getByRole('button',{name:'ลองตอบ',exact:true}).click();
 const next=()=>page.getByRole('button',{name:'ต่อไป',exact:true}).click();
 async function choose(answer,correct=true){await page.getByRole('button',{name:answer,exact:true}).click();await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await page.getByText(correct?'ถูกต้อง':'ลองดูคำตอบนี้',{exact:true}).waitFor();}
 await model();await choose('Mein Vorname ist Mali.');await next();await choose('Mein Familienname ist Sommer.');await next();
 await page.getByRole('heading',{name:'ขอให้สะกดชื่อ',exact:true}).waitFor();
 assert.equal(await page.getByLabel('ฟังตัวอักษรทีละตัว',{exact:true}).getByRole('button').count(),4);
 await model();await choose('Wie geht es dir?',false);
 const requestState=await saved(page,r=>r.responses['L01-SUP-S01-learn-v1']?.first?.correct===false);
 const first=requestState.runs.filter(r=>r.scope==='supplement').at(-1).responses['L01-SUP-S01-learn-v1'].first;
 await page.reload();await page.getByText('ลองดูคำตอบนี้',{exact:true}).waitFor();assert(await page.getByRole('button',{name:'Wie bitte? Wie schreibt man das?',exact:true}).isDisabled());
 await next();await page.getByRole('button',{name:'L',exact:true}).click();
 await saved(page,r=>r.responses['L01-SUP-S02-learn-v1']?.selection.length===1);
 await page.reload();await page.getByRole('button',{name:'นำ L กลับ',exact:true}).waitFor();await page.getByRole('button',{name:'นำ L กลับ',exact:true}).click();
 assert(await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).isDisabled());
 assert(!/Mali|มะลิ/.test(await page.locator('.phrase-discovery').innerText()));
 await page.getByRole('button',{name:'ฟังการสะกดชื่อ',exact:true}).click();
 await page.getByRole('button',{name:'ฟังการสะกดชื่อ',exact:true}).waitFor();
 for(const letter of ['M','A','L','I'])await page.getByRole('button',{name:letter,exact:true}).click();
 await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await page.getByText('ถูกต้อง',{exact:true}).waitFor();
 const spelling=await saved(page,r=>r.responses['L01-SUP-S02-learn-v1']?.first?.correct);
 const active=spelling.runs.filter(r=>r.scope==='supplement').at(-1);
 assert.equal(active.responses['L01-SUP-S02-learn-v1'].first.response,'M-A-L-I.');
 assert.deepEqual(active.responses['L01-SUP-S02-learn-v1'].first.assistance,['prior-model','replayable-german-letter-audio','supplied-letters']);
 assert.equal(active.responses['L01-SUP-S02-learn-v1'].first.listening.subskill,'name_letter_listening');
 assert.deepEqual(active.responses['L01-SUP-S01-learn-v1'].first,first);
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:'.tools/l01-supplement-spelling-mobile.png',fullPage:true,animations:'disabled'});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await next();await model();await choose('Freut mich!');await next();await choose('Freut mich auch!');await next();await model();await choose('Gute Nacht!');
 await page.getByRole('button',{name:'จบการเรียน',exact:true}).click();await page.getByRole('heading',{name:'เรียนกิจกรรมเพิ่มเติมครบแล้ว',exact:true}).waitFor();
 const complete=await saved(page,r=>r.completed);
 const done=complete.runs.filter(r=>r.scope==='supplement').at(-1);assert.equal(done.step,11);assert.equal(Object.keys(done.responses).length,7);assert.equal(done.modelIds.length,4);
 assert.deepEqual(legacyProjection(complete),legacy);
 await page.reload();await page.getByRole('heading',{name:'เรียนกิจกรรมเพิ่มเติมครบแล้ว',exact:true}).waitFor();
 await page.getByRole('link',{name:'เรียนประโยคบท 1',exact:true}).click();await page.locator('.phrase-discovery').waitFor();
 const old=legacy.at(-1);if(old&&!old.completed)await page.getByLabel(`กิจกรรม ${old.step+1} จาก 15`,{exact:true}).waitFor();
 assert.deepEqual(legacyProjection(await history(page)),legacy);
 const learner=await login('tester@deutsch.test',true);await learner.page.locator('.lesson-heading').waitFor();
 assert.equal(await learner.page.locator('.phrase-discovery').count(),0);assert.equal(await learner.page.getByRole('link',{name:'ลองกิจกรรมที่เพิ่ม',exact:true}).count(),0);
 await learner.context.close();
 assert.deepEqual(errors,[]);assert.deepEqual(production,[]);
 await context.close();
 console.log('PASS: 7 new Learn checks, spelling request/letter order, wrong-first preservation, draft resume/removal, assistance, mobile, completion, old-run continuation and non-tester gate.');
}finally{await browser.close();}
