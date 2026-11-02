import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
let banks=0,clozes=0,helped=0;
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 let html='';await page.route('https://inline-all.test/**',route=>{const p=new URL(route.request().url()).pathname;return route.fulfill(p.startsWith('/images/')?{body:readFileSync('public'+p),contentType:p.endsWith('.svg')?'image/svg+xml':'image/webp'}:{body:html,contentType:'text/html'});});
 const files=(process.env.TEST_MATCH_ONLY?[]:readdirSync('src/data')).filter(f=>/^(a11-.*-basic|l13-(vocab|phrases|grammar)-basic|l1[4-8]-grammar)-preview.json$/.test(f));
 for(const file of files){
  html=JSON.parse(readFileSync('src/data/'+file,'utf8')).html;await page.goto('https://inline-all.test/'+file);banks++;
  const ids=await page.evaluate(()=>{const byKind=new Map();for(const q of BANK.questions)if(q.kind==='cloze')byKind.set(BANK.spellingCues?.[q.itemId]?.kind||'cloze',q.id);return [...byKind.values()];});
  for(const id of ids){
   const q=await page.evaluate(id=>{start(BANK.questions.filter(q=>q.id===id),1);return activeItem().question;},id);
   assert.equal(await page.locator('input#response').count(),1,file);
   if(await page.locator('.picture-spelling-layout').count()){
    for(const width of [390,1280]){
     await page.setViewportSize({width,height:800});
     const image=await page.locator('.spelling-cue').boundingBox(),answer=await page.locator('#response').boundingBox();
     assert(image.x+image.width<=answer.x,file);
     assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,file);
    }
   }
   assert.equal(await page.locator('.sentence input#response').count(),1,file);
   assert.equal(await page.locator('label[for="response"],.spelling-thai-help').count(),0,file);
   assert.equal(await page.getByText(/^(หัวข้อ|ขั้น) \d+ จาก/).count(),0,file);
   await page.locator('#response').fill(q.acceptedAnswers[0]);
   const resumeId=await page.evaluate(()=>current().id);
   await page.reload();
   await page.evaluate(resumeId=>window.postMessage({type:"grammar-preview-direct-start",learnedItemIds:BANK.questions.flatMap(q=>q.requiredItemIds||[q.itemId||q.targetId]),resumeId},"*"),resumeId);
   assert.equal(await page.locator('#response').inputValue(),q.acceptedAnswers[0]);
   await page.locator('#response').press('Enter');assert.equal(await page.evaluate(()=>activeItem().attempt.correct),true,file);
   assert.equal(await page.evaluate(()=>activeItem().attempt.responsePresentation),'inline-v1');clozes++;
  }
  if(file.includes('grammar')){
   const id=await page.evaluate(()=>BANK.questions.find(q=>q.sentence&&/[A-Za-zÄÖÜäöüß]/u.test(q.sentence))?.id);
   if(id){await page.evaluate(id=>start(BANK.questions.filter(q=>q.id===id),1),id);if(await page.locator('.sentence .word-meaning').count()){
    const word=page.locator('.sentence .word-meaning').first();await word.focus();assert(await word.getAttribute('data-th'));assert.equal(await page.evaluate(()=>activeItem().translationUsed),true);assert((await page.evaluate(()=>activeItem().wordHelpTokens)).length>0);helped++;
   }}
  }
 }
 html=JSON.parse(readFileSync('src/data/l13-phrases-basic-preview.json','utf8')).html;
 await page.goto('https://inline-all.test/matching');
 const pair=await page.evaluate(()=>{const first=BANK.questions.find(q=>q.interaction==='match');const group=BANK.questions.filter(q=>q.matchGroupId===first.matchGroupId);start(group,2);return group;});
 const firstWord=page.locator('[data-match-prompt] .word-meaning').first();
 await firstWord.focus();
 assert.equal(await page.evaluate(()=>current().items.filter(item=>item.translationUsed).length),1);
 for(const q of pair){await page.locator('[data-match-prompt]').filter({hasText:q.sentence}).click();await page.locator('[data-match-answer]').filter({hasText:q.acceptedAnswers[0]}).click();}
 await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();
 assert.equal(await page.evaluate(()=>current().items.filter(item=>item.attempt.correct).length),2);
 assert.equal(await page.evaluate(()=>current().items[0].attempt.wordHelpTokens.length>0),true);
 if(!process.env.TEST_MATCH_ONLY)assert(helped>=7);assert.deepEqual(errors,[]);console.log(process.env.TEST_MATCH_ONLY?"PASS phrase matching: response-specific word help, original pair selection and canonical grading":`PASS ${banks} banks across L01–L18: ${clozes} inline response examples, draft reload, Enter grading, no duplicate fields/headings/hint buttons; ${helped} grammar banks with recorded word help`);
}finally{await browser.close();}
