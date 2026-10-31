import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright-core';
const {html}=JSON.parse(readFileSync('src/data/a11-vocab-l02-basic-preview.json','utf8'));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://inline.test/**',route=>{const path=new URL(route.request().url()).pathname;return path.startsWith('/images/')?route.fulfill({body:readFileSync('public'+path),contentType:'image/webp'}):route.fulfill({body:html,contentType:'text/html'});});
 await page.goto('https://inline.test/practice');
 const questions=await page.evaluate(()=>BANK.questions.filter(q=>q.subskill==='vocabulary_spelling'));
 assert.equal(questions.length,17);
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:844});
  for(const q of questions){
   await page.evaluate(id=>start(BANK.questions.filter(q=>q.id===id),1),q.id);
   assert.equal(await page.locator('input').count(),1);
   assert.equal(await page.locator('.sentence input#response').count(),1);
   assert.equal(await page.locator('label[for="response"],.spelling-meaning,.spelling-thai-help').count(),0);
   const article=await page.locator('.noun-prefix').innerText();
   assert(['der','die','das'].includes(article.trim()));
   assert.equal(await page.locator('.profession-single-portrait').getAttribute('data-person'),article.trim()==='die'?'feminine':'masculine');
   assert.equal(await page.locator('.noun-prefix .article-dot').count(),1);
   const image=await page.locator('.profession-single-portrait').boundingBox(),input=await page.locator('#response').boundingBox();
   assert(image.x+image.width<input.x);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   if(q.itemId==='V011'){
    await page.locator('.spelling-cue-image').evaluate(image=>image.complete?true:new Promise(resolve=>image.onload=resolve));
    await page.screenshot({path:`.tools/l02-inline-female-${width}.png`,fullPage:true});
   }
   await page.locator('#response').fill(q.acceptedAnswers[0]);
   await page.locator('#response').press('Enter');
   const attempt=await page.evaluate(()=>activeItem().attempt);
   assert.equal(attempt.correct,true);
   assert.equal(attempt.response,q.acceptedAnswers[0]);
   assert.equal(attempt.translationUsed,false);
   assert.equal(attempt.spellingCuePresentation,'single-person-inline');
   assert.equal(await page.locator('#response').isDisabled(),true);
  }
 }
 await page.evaluate(()=>{start(BANK.questions.filter(q=>q.id==='V008-a11-spelling'),1);commit(n=>{activeItem(n).translationUsed=true;});});
 assert.equal(await page.locator('.spelling-meaning,.spelling-thai-help').count(),0);
 await page.locator('#response').fill('Ingenieur');await page.locator('#check').click();
 assert.equal(await page.evaluate(()=>activeItem().attempt.translationUsed),true,'historical help is preserved');
 assert.deepEqual(errors,[]);
 console.log('PASS L02: 17 targets at desktop/mobile, matching portrait gender, one inline input, no hints, Enter grading, no overflow, historical assistance preserved');
}finally{await browser.close();}
