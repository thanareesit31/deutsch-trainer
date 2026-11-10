import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const key='deutsch-trainer-phrase-discovery-v1-L01';
let original;
let capturedState;
try {
 const page=await browser.newPage({viewport:{width:1280,height:960}});page.setDefaultTimeout(45000);
 await page.addInitScript(() => {
   window.__letterAudio=[];window.__failLetterAudio=false;
   const NativeAudio=window.Audio;
   window.Audio=class extends NativeAudio {
    constructor(source){super(source);this.addEventListener('ended',()=>window.__letterAudio.push({source,duration:this.duration}));}
   };
 });
 await page.route('**/audio/l01/spelling-dialogue-v1.m4a',async route=>{
  if(await page.evaluate(()=>window.__failLetterAudio))return route.abort();
  return route.continue();
 });
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Isolated visual fixture: never upload this review run to either tester's saved history.
 await page.route('**/__test-db/rest/v1/learner_lesson_states*',async route=>{
  const request=route.request();
  if(request.method()==='GET') {
   const response=await route.fetch();const rows=await response.json();
   if(!response.ok()||!Array.isArray(rows))return route.fulfill({response});
   original=rows.find(r=>r.lesson_key===key)?.state??null;
   const state={version:1,runs:[{id:'isolated-visual-review',bankVersion:2,scope:'all',step:0,modelIds:[],responses:{},completed:false}]};
   await route.fulfill({response,json:[...rows.filter(r=>r.lesson_key!==key),{lesson_key:key,state}]});
  } else {
   const data=request.postDataJSON();
   if(data?.lesson_key===key){capturedState=data.state;return route.fulfill({status:201,body:'',headers:{'content-type':'application/json'}});}
   await route.continue();
  }
 });
 await page.goto('http://localhost:3002/learn/L01/phrases');
 await page.getByLabel('อีเมล',{exact:true}).fill('tester2@deutsch.test');
 await page.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');
 await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();
 await page.locator('.phrase-discovery').waitFor();
 assert.equal(await page.getByRole('link',{name:'เรียนประโยคบท 1',exact:true}).getAttribute('href'),'/learn/L01/phrases');
 assert.equal(await page.getByRole('link',{name:'ลองกิจกรรมที่เพิ่ม',exact:true}).count(),0);
 const titles=['ทักทายและลา','บอกชื่อและแนะนำคนอื่น','ถามว่าเป็นอย่างไรบ้าง','ถามว่ามาจากไหน','ขอให้พูดซ้ำและขอบคุณ','ถามชื่อและนามสกุล','ขอให้สะกดชื่อ','ตอบว่ายินดีที่ได้รู้จัก','ลาก่อนเข้านอน'];
 const answers=[['Guten Morgen!','Tschüs!'],[['Ich','bin','Mali.'],'Das ist Mali.'],['Gut, danke. Und Ihnen?','Nicht so gut.'],[['Ich','komme','aus','Thailand.'],'Sie kommt aus Deutschland.'],['Entschuldigung. Wie bitte?','Danke.'],['Mein Vorname ist Mali.','Mein Familienname ist Sommer.'],['Wie bitte? Wie schreibt man das?',['M','A','L','I']],['Freut mich!','Freut mich auch!'],['Gute Nacht!']];
 for(let topic=0;topic<titles.length;topic++) {
  await page.getByRole('heading',{name:titles[topic],exact:true}).waitFor();
  const note=page.locator('.phrase-discovery-note');assert(await note.locator('li').count()>=1);
  assert.equal(await page.locator('.phrase-discovery-turn > span').filter({hasText:/^A$/}).count(),answers[topic].length);
  assert.equal(await page.locator('.phrase-discovery-turn > span').filter({hasText:/^B$/}).count(),answers[topic].length);
  assert(!/เป็นประธาน|อ้างถึง|ตอบแทนข้อมูล/.test(await page.locator('.phrase-discovery').innerText()));
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:`.tools/phrase-visual-topic-${topic+1}-mobile.png`,fullPage:true,animations:'disabled'});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('.phrase-visual img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode()));if(imgs.some(i=>i.naturalWidth===0))throw Error('Image failed');});
  await page.getByRole('button',{name:'ลองตอบ',exact:true}).click();
  for(let item=0;item<answers[topic].length;item++) {
   const answer=answers[topic][item];
   if(topic===6&&item===1){
    assert(!/Mali|มะลิ/.test(await page.locator('.phrase-discovery').innerText()));
    assert.equal(await page.locator('.phrase-person-card').count(),0);
    await page.getByRole('button',{name:'M',exact:true}).click();
    await page.getByRole('button',{name:'นำ M กลับ',exact:true}).click();
    await page.evaluate(()=>window.__failLetterAudio=true);
    await page.getByRole('button',{name:'ฟังการสะกดชื่อ',exact:true}).click();
    await page.getByRole('alert').filter({hasText:'เล่นเสียงไม่สำเร็จ'}).waitFor();
    assert(await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).isDisabled());
    await page.evaluate(()=>window.__failLetterAudio=false);
    for(let replay=0;replay<2;replay++){
     await page.getByRole('button',{name:'ฟังการสะกดชื่อ',exact:true}).click();
     await page.getByRole('button',{name:'ฟังการสะกดชื่อ',exact:true}).waitFor();
    }
    const audio=await page.evaluate(()=>window.__letterAudio);
    assert.equal(audio.length,2);assert(audio.every(a=>a.source==='/audio/l01/spelling-dialogue-v1.m4a'&&a.duration>3));
   }

   if(Array.isArray(answer)) {
    assert(await page.locator('.phrase-visual').count()===1);
    for(const word of answer)await page.getByRole('button',{name:word,exact:true}).click();
   } else {
    assert.equal(await page.locator('.guided-instruction').innerText(),'ถ้าเป็นคุณ จะตอบว่าอย่างไร');
    await page.getByRole('button',{name:answer,exact:true}).click();
   }
   await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();
   await page.getByText('ถูกต้อง',{exact:true}).waitFor();
   const feedback=page.locator('.phrase-discovery-feedback');
   assert.equal(await page.locator('.phrase-visual').count(),1);
   await page.locator('.phrase-visual img').evaluateAll(async imgs=>{await Promise.all(imgs.map(i=>i.decode()));if(imgs.some(i=>i.naturalWidth===0))throw Error('Image failed');});
   assert(await feedback.locator('.phrase-discovery-reason p').count()>=1);
   assert(!/เป็นประธาน|อ้างถึง|ตอบแทนข้อมูล/.test(await feedback.innerText()));
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.screenshot({path:`.tools/phrase-visual-${topic+1}-${item+1}-feedback.png`,fullPage:true,animations:'disabled'});
   await page.getByRole('button',{name:topic===8&&item===0?'จบการเรียน':'ต่อไป',exact:true}).click();
  }
 }
 await page.getByRole('heading',{name:'เรียนบทสนทนาครบแล้ว',exact:true}).waitFor();
 const token=await page.evaluate(()=>JSON.parse(localStorage.getItem(Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user')))).access_token);
 const actual=await(await page.request.get('http://localhost:3002/__test-db/rest/v1/learner_lesson_states?select=state&lesson_key=eq.'+key,{headers:{Authorization:'Bearer '+token}})).json();
 assert.deepEqual(actual[0]?.state??null,original);
 const firsts=Object.values(capturedState.runs[0].responses).map(r=>r.first);
 assert.equal(firsts.length,17);assert(firsts.every(f=>f.visualContext==='l01-context-visuals-v1'||f.visualContext==='name-listening-v1'));
 const listening=capturedState.runs[0].responses['L01-SUP-S02-learn-v1'].first;
 assert.deepEqual(listening.listening,{version:'name-listening-v1',targetId:'L01-SUP-S02-listening-target',subskill:'name_letter_listening',completedPlays:2});
 assert.deepEqual(listening.assistance,['prior-model','replayable-german-letter-audio','supplied-letters']);
 assert.deepEqual(errors,[]);
 console.log('PASS visual review: 9 models, 17 checks, images decoded, name cards/country/time rendered, mobile layout, saved tester history unchanged.');
} finally {await browser.close();}
