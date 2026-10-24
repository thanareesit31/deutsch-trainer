import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright-core';
const {items}=JSON.parse(readFileSync('supabase/seed/catalog.json','utf8'));
const {html}=JSON.parse(readFileSync('src/data/l13-vocab-daily-preview.json','utf8'));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.route('https://noun.test/**',r=>r.fulfill({contentType:'text/html',body:html}));await page.goto('https://noun.test/practice');
 await page.evaluate(()=>window.postMessage({type:'grammar-preview-direct-start',learnedItemIds:BANK.questions.map(q=>q.itemId)},'*'));
 await page.locator('[data-question-id]').waitFor();
 const questions=await page.evaluate(()=>BANK.questions);
 let spelling=0,meaning=0,article=0;
 for(const question of questions){
  const item=items.find(i=>i.id===question.itemId);if(!item.article&&!item.pluralOnly)continue;
  const gender=item.pluralOnly?'die':item.article;
  await page.evaluate(id=>start(BANK.questions.filter(q=>q.id===id),1),question.id);
  const card=page.locator('[data-question-id]');
  if(question.subskill==='vocabulary_spelling'){
   const prefix=card.locator('.noun-spelling-answer .noun-prefix');assert.equal((await prefix.innerText()).trim(),gender);assert.equal(await prefix.locator('.article-dot').count(),1);
   assert(!((await prefix.innerText()).includes(item.word)));await page.locator('#response').fill(question.acceptedAnswers[0]);spelling++;
  }else{
   if(question.subskill==='vocabulary_meaning'){assert.match(await card.locator('.sentence').innerText(),new RegExp('^'+gender+' '));assert.equal(await card.locator('.sentence .article-dot').count(),1);meaning++;}
   else {assert.equal(await card.locator('.sentence .article-dot').count(),0);assert.equal(await card.locator('.choices .article-dot').count(),3);article++;}
   await card.locator('.choices').getByRole('button',{name:question.acceptedAnswers[0],exact:true}).click();
  }
  await page.locator('#check').click();const feedback=page.locator('#feedback');assert.equal(await feedback.locator('.article-dot').count(),1);assert.match(await feedback.locator('p[lang="de"]').innerText(),new RegExp(gender+' '));
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({spelling,meaning,article,noArticleLeak:true,feedback:true,errors}));
}finally{await browser.close();}
