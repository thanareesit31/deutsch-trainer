import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright-core';
import {startTestApi} from '../scripts/test-workspace-api.mjs';
import {a13ReleaseCourses} from '../src/data/a13-release.ts';
import {l15GrammarLearningCards} from '../src/data/l15-grammar-learning.ts';
const origin=process.env.L15_ORIGIN??'http://localhost:3002';
const key='deutsch-trainer-release-course-v1-L15-grammar';
const course=a13ReleaseCourses.find(c=>c.lessonId==='L15'&&c.skill==='grammar');
const accounts=[0,1].map(index=>({id:randomUUID(),email:`ordinary-l15-${index}@deutsch.test`,aud:'authenticated',role:'authenticated',app_metadata:{provider:'email',providers:['email']},user_metadata:{},created_at:new Date().toISOString(),email_confirmed_at:new Date().toISOString()}));
const api=await startTestApi({port:0,webPort:3002,restore:{accounts,rows:{}}});
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
await mkdir('artifacts/l15-grammar-accounts',{recursive:true});
let page;
const errors=[];
try {
 const context=await browser.newContext({viewport:{width:1280,height:900}});
 await context.route('**/__test-db/**',async route=>{const url=new URL(route.request().url());const response=await route.fetch({url:api.url+url.pathname.replace(/^\/__test-db/,'')+url.search});await route.fulfill({response});});
 page=await context.newPage();page.setDefaultTimeout(45000);
 page.on('pageerror',error=>errors.push(error.message));
 async function login(index){await page.goto(origin+'/lesson/L15');await page.getByLabel('อีเมล',{exact:true}).fill(accounts[index].email);await page.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await page.locator('a[href="/learn/L15/grammar"]').first().waitFor();}
 async function openGrammar(){await page.locator('a[href="/learn/L15/grammar"]').first().click();await page.locator('a[href="/learn/L15/grammar/possessivartikel"]').click();await page.waitForURL('**/learn/L15/grammar/possessivartikel');await page.locator('.ownership-preview:visible').waitFor();}
 const saved=()=>api.snapshot().then(s=>s.rows.learner_lesson_states.find(row=>row.user_id===accounts[0].id&&row.lesson_key===key)?.state);
 async function persisted(predicate){for(let tries=0;tries<100;tries++){const state=await saved();if(state&&predicate(state))return state;await page.waitForTimeout(100);}throw Error('Account checkpoint did not persist');}
 await login(0);
 const legacy=course.tasks.find(task=>!task.id.startsWith('A13-L15-GUIDED-'));
 const historical={version:1,learned:['L15-possessivartikel'],cursor:0,active:{taskId:legacy.id,draft:'ร่างเก่าต้องอยู่',helpUsed:true,startedAt:'2026-11-20T00:00:00Z',selectionReason:'legacy',origin:'learn',learningCardId:'L15-possessivartikel'},attempts:[{id:'historical-first',taskId:legacy.id,response:legacy.acceptedAnswers[0],correct:true,helpUsed:true,submittedAt:'2026-11-19T00:00:00Z',selectionReason:'legacy'}],round:null};
 await page.evaluate(async({key,state})=>{const storage=Object.keys(localStorage).find(key=>key.startsWith('deutsch-trainer-test-')&&!key.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(storage));const r=await fetch('/__test-db/rest/v1/learner_lesson_states?on_conflict=user_id,lesson_key',{method:'POST',headers:{Authorization:'Bearer '+auth.access_token,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},body:JSON.stringify({user_id:auth.user.id,lesson_key:key,state})});if(!r.ok)throw Error('Fixture save '+r.status);},{key,state:historical});
 await page.reload();await openGrammar();
 let root=page.locator('.ownership-preview:visible');
 assert.equal(await root.locator('.ownership-phrase p').textContent(),'sein Zimmer','The real topic route opens the new teacher, not the old pending question');
 assert.equal(await root.getByRole('button',{name:'ทดสอบ',exact:true}).isDisabled(),true,'Fresh card cannot skip required teaching');
 for(let i=0;i<3;i++)await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();
 await root.getByRole('button',{name:'sein',exact:true}).click();
 await persisted(s=>s.guidedL15?.owner.view.kind==='try'&&s.guidedL15.owner.view.answer==='sein');
 await page.reload();root=page.locator('.ownership-preview:visible');
 assert.equal(await root.getByRole('button',{name:'sein',exact:true}).getAttribute('aria-pressed'),'true','Owner draft resumes');
 await root.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();
 await root.getByRole('heading',{name:'ลองเทียบกับเจ้าของห้อง',exact:true}).waitFor();
 await persisted(s=>s.attempts.length===2);
 await page.reload();root=page.locator('.ownership-preview:visible');
 await root.getByRole('heading',{name:'ลองเทียบกับเจ้าของห้อง',exact:true}).waitFor();
 assert.equal(await root.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).count(),0,'Checked first answer resumes as feedback');
 await page.getByRole('button',{name:'ออกจากระบบ',exact:true}).click();
 await login(1);await openGrammar();root=page.locator('.ownership-preview:visible');
 assert.equal(await root.locator('.ownership-phrase p').textContent(),'sein Zimmer');
 assert.equal(await root.locator('.ownership-feedback').count(),0,'Second ordinary account has no first-account feedback');
 await page.getByRole('button',{name:'ออกจากระบบ',exact:true}).click();
 await login(0);await openGrammar();root=page.locator('.ownership-preview:visible');
 await root.getByRole('heading',{name:'ลองเทียบกับเจ้าของห้อง',exact:true}).waitFor();
 await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();
 await root.getByRole('button',{name:'sein',exact:true}).click();await root.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();
 for(const [index,card]of l15GrammarLearningCards.entries()){
  root=page.locator('.ownership-preview:visible');assert.equal(await root.getAttribute('data-card'),card.id);
  for(let at=0;at<card.pages.length+1;at++){
   for(const viewport of [{width:1280,height:900},{width:820,height:1180},{width:390,height:664}]){
    await page.setViewportSize(viewport);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(120);
    const box=await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).boundingBox();assert.ok(box&&box.y+box.height<=viewport.height,`${card.id} page ${at+1} fits ${viewport.width}`);
    if(at<card.pages.length){assert.equal(await root.locator('.phrase-sentence-role.subject').first().evaluate(el=>getComputedStyle(el).color),'rgb(121, 80, 170)');assert.equal(await root.locator('.phrase-sentence-role.verb').first().evaluate(el=>getComputedStyle(el).color),'rgb(180, 54, 50)');}
   }
   await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();
  }
  for(const task of card.tasks){
   assert.equal(await root.locator('.phrase-annotated-reply').count(),0,'Unanswered tasks show no annotation hints');
   if(task.kind==='choice')await root.getByRole('button',{name:task.answer,exact:true}).click();
   else if(task.kind==='write'){
    await root.getByRole('textbox',{name:'คำตอบ',exact:true}).fill('ih');
    await persisted(s=>s.guidedL15.cards[card.id].responses[task.id]?.text==='ih');
    await page.reload();root=page.locator('.ownership-preview:visible');assert.equal(await root.getByRole('textbox',{name:'คำตอบ',exact:true}).inputValue(),'ih');
    await root.getByRole('button',{name:'หลักการ',exact:true}).click();await root.getByRole('button',{name:'ทดสอบ',exact:true}).click();assert.equal(await root.getByRole('textbox',{name:'คำตอบ',exact:true}).inputValue(),'ih');
    await root.getByRole('textbox',{name:'คำตอบ',exact:true}).fill('IHRE');
   }else{
    await root.locator('.l15-order-tokens').getByRole('button',{name:'Ihren Sessel',exact:true}).click();
    await persisted(s=>s.guidedL15.cards[card.id].responses[task.id]?.selection.length===1);
    await page.reload();root=page.locator('.ownership-preview:visible');assert.equal(await root.locator('.l15-order-answer button').textContent(),'Ihren Sessel');
    for(const token of ['finde','ich','schön.'])await root.locator('.l15-order-tokens').getByRole('button',{name:token,exact:true}).click();
   }
   await root.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await root.getByRole('heading',{name:'ถูกต้อง',exact:true}).waitFor();await persisted(s=>s.attempts.some(a=>a.taskId===task.id));
   await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();
  }
 }
 await page.getByRole('heading',{name:'เรียนครบเรื่อง sein / ihr แล้ว',exact:true}).waitFor();
 const state=await persisted(s=>s.guidedL15.complete);
 assert.equal(state.attempts.length,11);assert.deepEqual(state.attempts[0],historical.attempts[0]);assert.equal(state.active.draft,'ร่างเก่าต้องอยู่');
 assert.equal(state.attempts.find(a=>a.taskId==='A13-L15-GUIDED-USE-01').helpUsed,true);
 await page.reload();await page.getByRole('heading',{name:'เรียนครบเรื่อง sein / ihr แล้ว',exact:true}).waitFor();
 await page.getByRole('link',{name:'ฝึกสิ่งที่เรียนแล้ว',exact:true}).click();await page.waitForURL('**/practice/L15/grammar');
 await page.locator('.release-course').waitFor();
 await page.getByRole('button',{name:'เริ่มรอบแนะนำ',exact:true}).click();
 let practice;
 for(let tries=0;tries<100;tries++){practice=(await api.snapshot()).rows.learner_practice_sessions.find(row=>row.user_id===accounts[0].id&&row.bank_key==='a13-release-l15-grammar');if(practice)break;await page.waitForTimeout(100);}
 assert.ok(practice?.state.items.length>0,'The shared Practice round passes server registration and learned eligibility');
 assert.equal(await page.locator('.lesson-save-error').count(),0);
 const snapshot=await api.snapshot();assert.equal(snapshot.rows.learner_lesson_states.filter(r=>r.user_id===accounts[1].id&&r.lesson_key===key).length,0);
 await page.screenshot({path:'artifacts/l15-grammar-accounts/practice-after-learn.png',fullPage:true});
 await writeFile('artifacts/l15-grammar-accounts/verification.json',JSON.stringify({normalRoute:true,ordinaryAccounts:2,legacyPreserved:true,attempts:state.attempts.length,newAttempts:10,reloadAndSignInResume:true,accountIsolation:true,practiceEntry:true,pageErrors:errors},null,2)+'\n');
 assert.deepEqual(errors,[]);
 console.log('Normal L15 route, two ordinary accounts, all cards, account persistence/resume, immutable firsts, historical pending state, role colors and Practice entry passed.');
}catch(error){if(page)await page.screenshot({path:'artifacts/l15-grammar-accounts/failure.png',fullPage:true});throw error;}
finally{await browser.close();await api.close();}
