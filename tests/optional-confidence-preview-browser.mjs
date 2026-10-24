import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const errors=[];
try {
 for(const slug of ['l13-vocab-urban','l13-es-gibt','l14-grammar','l13-phrases-rating']) {
  const context=await browser.newContext();const page=await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  const {html}=JSON.parse(readFileSync(`src/data/${slug}-preview.json`,'utf8'));
  await page.route('https://practice.test/**',route=>route.fulfill({contentType:'text/html',body:html}));
  await page.goto('https://practice.test/'+slug);
  await page.evaluate(()=>{const ids=[...new Set(BANK.questions.flatMap(q=>q.requiredItemIds||[q.itemId]))];window.postMessage({type:'grammar-preview-direct-start',learnedItemIds:ids},'*');});
  try {await page.locator('[data-question-id]').first().waitFor({timeout:5000});} catch(error){console.log(slug,await page.locator('body').innerText(),errors);throw error;}
  await page.evaluate(()=>start(BANK.questions.filter(q=>q.kind==='choice'&&q.interaction!=='match'),1));
  const answer=await page.evaluate(()=>activeItem().question.acceptedAnswers[0]);
  await page.locator('.choices').getByRole('button',{name:answer,exact:true}).click();await page.locator('#check').click();
  assert(await page.locator('#next').isEnabled());assert.equal(await page.locator('[data-confidence]').count(),0);
  assert.equal(await page.getByRole('button',{name:'ง่าย',exact:true}).count(),0);
  assert.deepEqual(await page.evaluate(()=>({status:activeItem().attempt.status,confidence:activeItem().attempt.confidence})),{status:'completed',confidence:null});
  await page.reload();await page.evaluate(()=>window.postMessage({type:'grammar-preview-direct-start',learnedItemIds:[...new Set(BANK.questions.flatMap(q=>q.requiredItemIds||[q.itemId]))]},'*'));await page.locator('#next').waitFor();assert(await page.locator('#next').isEnabled());
  if(slug==='l13-es-gibt') {await page.evaluate(()=>commit(n=>{activeItem(n).attempt.status='pending';}));await page.reload();await page.evaluate(()=>window.postMessage({type:'grammar-preview-direct-start',learnedItemIds:[...new Set(BANK.questions.flatMap(q=>q.requiredItemIds||[q.itemId]))]},'*'));await page.locator('#next').waitFor();assert(await page.locator('#next').isEnabled());}
  await page.locator('#next').click();assert(await page.evaluate(()=>current().completed));
  if(slug==='l13-phrases-rating') {
   await page.evaluate(()=>{const match=BANK.questions.filter(q=>q.interaction==='match');start(match,2);});
   const rows=await page.evaluate(()=>current().items);
   for(const row of rows){await page.locator(`[data-match-prompt="${row.question.id}"]`).click();await page.locator('[data-match-answer]').filter({hasText:row.question.acceptedAnswers[0]}).click();}
   await page.locator('#check').click();assert(await page.locator('#next').isEnabled());assert.equal(await page.locator('[data-confidence]').count(),0);
   assert(await page.evaluate(()=>current().items.every(i=>i.attempt.confidence===null)));
   await page.locator('#next').click();assert(await page.evaluate(()=>current().completed));
  }
  await context.close();
 }
 assert.deepEqual(errors,[]);console.log(JSON.stringify({sharedBanks:4,noConfidenceControls:true,unknownPreserved:true,legacyPendingCanAdvance:true,matchingWithoutRating:true,pageErrors:errors}));
}finally{await browser.close();}
