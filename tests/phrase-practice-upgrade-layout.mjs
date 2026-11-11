import {chromium} from 'playwright-core';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const packets=JSON.parse(readFileSync('docs/exercise-mapping/l01-l13-practice-extensions.json'));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const reports=[],errors=[];
try{
 const page=await browser.newPage();page.on('pageerror',error=>errors.push(error.message));
 let html='';await page.route('http://practice-upgrade.test/**',route=>route.fulfill({contentType:'text/html',body:html}));
 await page.addInitScript(()=>{const test=JSON.parse(sessionStorage.getItem('testCase')||'null');if(test){localStorage.clear();localStorage.setItem(test.key,JSON.stringify(test.snapshot));}});
 await page.goto('http://practice-upgrade.test/');
 for(const width of [375,390,1360]){
  await page.setViewportSize({width,height:900});let minimumFont=100,checked=0,worst='';
  for(const packet of packets){
   const file=packet.lessonId==='L13'?'l13-phrases-daily-preview.json':`a11-phrases-${packet.lessonId.toLowerCase()}-daily-preview.json`;
   html=JSON.parse(readFileSync('src/data/'+file)).html;
   const bank=JSON.parse(html.match(/<script id="bank" type="application\/json">([\s\S]*?)<\/script>/)[1]);
   for(const authored of packet.questions){
    const q=bank.questions.find(q=>q.id===authored.id);assert.ok(q?.answerAudio&&q?.questionAudio);
    const now='2026-11-11T00:00:00Z',snapshot={version:1,activeId:'layout',sessions:[{id:'layout',createdAt:now,updatedAt:now,position:0,completed:false,items:[{question:q,response:'',selected:[],rubricChecks:[],tokenOrder:[],hintUsed:false,translationUsed:false,wordHelpTokens:[],attempt:null}]}]};
    await page.evaluate(test=>sessionStorage.setItem('testCase',JSON.stringify(test)),{key:bank.storageKey,snapshot});
    await page.goto('http://practice-upgrade.test/');await page.evaluate(ids=>window.postMessage({type:'grammar-preview-direct-start',learnedItemIds:ids},'*'),q.requiredItemIds);
    await page.locator('[data-question-id]').waitFor();assert.equal(await page.locator('.practice-answer-parts').count(),0);
    if(q.kind==='cloze'){assert.equal(await page.locator('#response').evaluate(e=>e.tagName),'TEXTAREA');await page.locator('#response').fill(q.acceptedAnswers[0]);}
    else await page.getByRole('button',{name:q.acceptedAnswers[0],exact:true}).click();
    await page.locator('#check').click();await page.locator('.practice-answer-parts').waitFor();await page.waitForTimeout(25);
    const geometry=await page.locator('.practice-answer-parts').evaluate(row=>{const words=[...row.querySelectorAll('dt')].map(w=>w.getBoundingClientRect());return{font:parseFloat(getComputedStyle(row).fontSize),lineSpread:Math.max(...words.map(w=>w.top))-Math.min(...words.map(w=>w.top)),out:words.some(w=>w.left<0||w.right>innerWidth+1),documentOverflow:document.documentElement.scrollWidth>innerWidth+1};});
    assert.ok(geometry.lineSpread<=1&&!geometry.out&&!geometry.documentOverflow,`${q.id} ${width} ${JSON.stringify(geometry)}`);if(geometry.font<minimumFont){minimumFont=geometry.font;worst=q.id+': '+q.acceptedAnswers[0];}checked++;
   }
  }
  reports.push({width,questions:checked,minimumFont,worst});
 }
 assert.deepEqual(errors,[]);writeFileSync('.audit/phrase-practice-upgrade-layout.json',JSON.stringify(reports,null,2)+'\n');console.log(JSON.stringify(reports));
}finally{await browser.close();}
