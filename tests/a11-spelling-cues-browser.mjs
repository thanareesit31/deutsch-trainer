import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { chromium } from 'playwright-core';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const errors=[];
let audited=0, interacted=0;
try {
 const page=await browser.newPage({viewport:{width:390,height:844}});
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://cue.test/images/**',route=>{
  const path='public'+new URL(route.request().url()).pathname;
  return route.fulfill({body:readFileSync(path),contentType:path.endsWith('.svg')?'image/svg+xml':path.endsWith('.webp')?'image/webp':path.endsWith('.png')?'image/png':'image/jpeg'});
 });
 for(let lesson=1;lesson<=12;lesson++)for(const slug of ['basic','daily']){
  const {html}=JSON.parse(readFileSync(`src/data/a11-vocab-l${String(lesson).padStart(2,'0')}-${slug}-preview.json`,'utf8'));
  await page.route('https://cue.test/practice',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.goto('https://cue.test/practice');
  const questions=await page.evaluate(()=>BANK.questions.filter(q=>q.subskill==='vocabulary_spelling'));
  for(const question of questions){
   const result=await page.evaluate(id=>{
    const q=BANK.questions.find(q=>q.id===id);start([q],1);
    const cue=BANK.spellingCues[q.itemId];
    return {cue,hiddenThai:document.querySelector('.spelling-meaning')===null,help:document.querySelector('.spelling-thai-help')?.textContent,image:document.querySelector('.spelling-cue-image')?.getAttribute('src'),context:document.querySelector('.spelling-cue')?.textContent};
   },question.id);
   assert.equal(result.hiddenThai,true,question.id);
   assert.equal(result.help,lesson===2?undefined:'ดูความหมายภาษาไทย');
   if(result.cue.kind==='image'){
    assert.equal(result.image,result.cue.src);
    assert(existsSync('public'+result.image),question.id);
   }else assert(result.context.includes(result.cue.context),question.id);
   audited++;
  }
  const sample=questions.find(q=>q.itemId in {V008:1,V170:1})??questions[0];
  await page.evaluate(id=>start(BANK.questions.filter(q=>q.id===id),1),sample.id);
  if(await page.locator('.spelling-cue-image').count())assert(await page.locator('.spelling-cue-image').evaluate(image=>image.complete&&image.naturalWidth>0||new Promise(resolve=>{image.onload=()=>resolve(true);image.onerror=()=>resolve(false);}))); 
  assert.equal(await page.locator('.spelling-meaning').count(),0);
  await page.locator('#response').fill(sample.acceptedAnswers[0]);
  await page.locator('#check').click();
  assert.equal(await page.evaluate(()=>activeItem().attempt.translationUsed),false);
  assert.equal(await page.evaluate(()=>parsePracticeHistory(JSON.stringify({version:1,sessions:[current()]}),'/practice/L01/vocabulary/basic')[0].items[0].result.assisted),false);
  assert.equal(await page.evaluate(()=>{const legacy=structuredClone(current());delete legacy.items[0].attempt.spellingCueMode;return parsePracticeHistory(JSON.stringify({version:1,sessions:[legacy]}),'/practice/L01/vocabulary/basic')[0].items[0].result.assisted;}),null);
  await page.evaluate(id=>start(BANK.questions.filter(q=>q.id===id),1),sample.id);
  const saved=await page.evaluate(()=>current().id);
  if(lesson===2){
   assert.equal(await page.locator('label[for="response"]').count(),0);
   assert.equal(await page.locator('.spelling-thai-help').count(),0);
   const visual=await page.locator('.profession-single-portrait').boundingBox();
   const answer=await page.locator('#response').boundingBox();
   assert(visual.x+visual.width<answer.x,'image left, editable blank right');
   assert.equal(await page.locator('.sentence .noun-prefix .article-dot').count(),1);
   await page.locator('#response').fill(sample.acceptedAnswers[0].slice(0,3));
   await page.reload();
   await page.evaluate(id=>window.postMessage({type:'grammar-preview-direct-start',learnedItemIds:BANK.questions.map(q=>q.itemId),resumeId:id},'*'),saved);
   await page.locator('#response').waitFor();
   assert.equal(await page.locator('#response').inputValue(),sample.acceptedAnswers[0].slice(0,3));
   assert.equal(await page.locator('.spelling-meaning').count(),0);
   if(slug==='basic')await page.screenshot({path:'.tools/l02-single-person-mobile.png',fullPage:true});
   await page.locator('#response').fill(sample.acceptedAnswers[0]);
   await page.locator('#response').press('Enter');
   assert.equal(await page.evaluate(()=>activeItem().attempt.correct),true);
   assert.equal(await page.evaluate(()=>activeItem().attempt.translationUsed),false);
   interacted++;
   await page.unroute('https://cue.test/practice');
   continue;
  }

  await page.getByRole('button',{name:'ดูความหมายภาษาไทย',exact:true}).click();
  assert.equal(await page.locator('.spelling-meaning').innerText(),'ความหมาย: '+sample.translation);
  await page.reload();
  await page.evaluate(id=>window.postMessage({type:'grammar-preview-direct-start',learnedItemIds:BANK.questions.map(q=>q.itemId),resumeId:id},'*'),saved);
  await page.locator('#response').waitFor();
  assert.equal(await page.evaluate(()=>current().id),saved);
  assert.equal(await page.evaluate(()=>activeItem().translationUsed),true);
  await page.locator('#response').fill(sample.acceptedAnswers[0]);
  await page.locator('#check').click();
  const attempt=await page.evaluate(()=>activeItem().attempt);
  assert.equal(attempt.translationUsed,true);
  assert.equal(attempt.correct,true);
  assert(['image','context'].includes(attempt.spellingCueMode));
  assert.equal(await page.locator('.spelling-thai-help').count(),0);
  if(lesson===2&&slug==='basic')await page.screenshot({path:'.tools/a11-image-spelling-mobile.png',fullPage:true});
  interacted++;
  await page.unroute('https://cue.test/practice');
 }
 assert.deepEqual(errors,[]);
 console.log(`PASS ${audited} spelling cues in 24 banks; ${interacted} mobile help/resume/first-answer flows; assets exist; no script errors`);
}finally{await browser.close();}
