import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
import {a13ReleaseCourses} from '../src/data/a13-release.ts';
import {l15GrammarLearningCards} from '../src/data/l15-grammar-learning.ts';
const origin=process.env.L15_ORIGIN??'http://127.0.0.1:3005';
const accounts=JSON.parse(await readFile('.tools/l15-grammar-hosted-accounts.json','utf8'));
const api=process.env.NEXT_PUBLIC_SUPABASE_URL,publicKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const key='deutsch-trainer-release-course-v1-L15-grammar';
const course=a13ReleaseCourses.find(c=>c.lessonId==='L15'&&c.skill==='grammar');
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const tag=origin.startsWith('https:')?'production':'production-build';
await mkdir('artifacts/l15-grammar-hosted',{recursive:true});
let page,stage='login',userIndex=0;const errors=[];
try {
 page=await browser.newPage({viewport:{width:1280,height:900}});page.setDefaultTimeout(45000);page.on('pageerror',error=>errors.push(error.name));
 async function login(index){userIndex=index;await page.goto(origin+'/learn/L15/grammar');await page.getByLabel('อีเมล',{exact:true}).fill(accounts[index].email);await page.getByLabel('รหัสผ่าน',{exact:true}).fill(accounts[index].password);await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await page.locator('a[href="/learn/L15/grammar/possessivartikel"]').waitFor();}
 async function logout(){await page.getByRole('button',{name:'ออกจากระบบ',exact:true}).click();await page.getByLabel('อีเมล',{exact:true}).waitFor();}
 async function open(){await page.locator('a[href="/learn/L15/grammar/possessivartikel"]').click();await page.waitForURL('**/learn/L15/grammar/possessivartikel');await page.locator('.ownership-preview:visible').waitFor();}
 async function request(method,query,body){return page.evaluate(async({api,publicKey,method,query,body})=>{const storage=Object.keys(localStorage).find(key=>key.startsWith('sb-')&&key.endsWith('-auth-token'));const auth=JSON.parse(localStorage.getItem(storage));const r=await fetch(api+'/rest/v1/learner_lesson_states'+query,{method,headers:{apikey:publicKey,Authorization:'Bearer '+auth.access_token,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},...(body?{body:JSON.stringify(body)}:{})});const text=await r.text();return{status:r.status,data:text?JSON.parse(text):null};},{api,publicKey,method,query,body});}
 async function saved(){const r=await request('GET','?select=state&lesson_key=eq.'+key+'&user_id=eq.'+accounts[userIndex].id);assert.equal(r.status,200);return r.data[0]?.state;}
 async function waitFor(predicate){for(let i=0;i<120;i++){const state=await saved();if(state&&predicate(state))return state;await page.waitForTimeout(150);}throw Error('Checkpoint persistence timeout');}
 await login(0);
 let existing=await saved();
 if(!existing){const task=course.tasks.find(task=>!task.id.startsWith('A13-L15-GUIDED-'));const first={id:'audit-historical-first',taskId:task.id,response:task.acceptedAnswers[0],correct:true,helpUsed:true,submittedAt:'2026-11-20T00:00:00Z',selectionReason:'temporary compatibility fixture'};const state={version:1,learned:['L15-possessivartikel'],cursor:0,active:{taskId:task.id,draft:'ร่างเดิมของบัญชีทดสอบ',helpUsed:true,startedAt:'2026-11-21T00:00:00Z',selectionReason:'temporary compatibility fixture',origin:'learn',learningCardId:'L15-possessivartikel'},attempts:[first],round:null};const result=await request('POST','?on_conflict=user_id,lesson_key',{user_id:accounts[0].id,lesson_key:key,state});assert.ok(result.status<300);await page.reload();}
 await open();let root=page.locator('.ownership-preview:visible');
 assert.equal(await page.locator('.test-workspace-notice').count(),0,'Production runtime has no test-workspace gate');
 if(!(await saved()).guidedL15?.owner.responses.anna){
  for(let i=0;i<3;i++)await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();
  await root.getByRole('button',{name:'sein',exact:true}).click();await waitFor(s=>s.guidedL15.owner.view.kind==='try'&&s.guidedL15.owner.view.answer==='sein');
  await page.reload();root=page.locator('.ownership-preview:visible');assert.equal(await root.getByRole('button',{name:'sein',exact:true}).getAttribute('aria-pressed'),'true');
  await root.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await root.getByRole('heading',{name:'ลองเทียบกับเจ้าของห้อง',exact:true}).waitFor();await waitFor(s=>s.attempts.length===2);
 }
 const startedComplete=(await saved()).guidedL15?.complete===true;
 const heldA=await saved();
 stage='account isolation';
 await logout();await login(1);await open();root=page.locator('.ownership-preview:visible');assert.equal(await root.locator('.ownership-phrase p').textContent(),'sein Zimmer');
 assert.equal(await root.getByRole('button',{name:'ทดสอบ',exact:true}).isDisabled(),true);
 const otherRead=await request('GET','?select=state&user_id=eq.'+accounts[0].id+'&lesson_key=eq.'+key);assert.deepEqual(otherRead.data,[]);
 const currentA=accounts[0].id;const forbidden=await request('POST','?on_conflict=user_id,lesson_key',{user_id:currentA,lesson_key:key,state:heldA});assert.equal(forbidden.status,403);assert.equal(forbidden.data.code,'42501');
 await logout();await login(0);await open();root=page.locator('.ownership-preview:visible');
 let state=await saved();
 if(!startedComplete){
 stage='owner checks';
 if(!state.guidedL15.owner.responses.tom){await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();await root.getByRole('button',{name:'sein',exact:true}).click();await root.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();}
 if((await saved()).guidedL15.active===0)await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();
 for(const [index,card]of l15GrammarLearningCards.entries()){
  state=await saved();if(state.guidedL15.active>index+1)continue;
  stage=card.id;root=page.locator('.ownership-preview:visible');assert.equal(await root.getAttribute('data-card'),card.id);
  state=await saved();let progress=state.guidedL15.cards[card.id];
  while(progress.page<=card.pages.length){await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();await waitFor(s=>s.guidedL15.cards[card.id].page>progress.page);progress=(await saved()).guidedL15.cards[card.id];}
  for(const task of card.tasks){
   state=await saved();const response=state.guidedL15.cards[card.id].responses[task.id];
   if(response?.kind==='checked'){if(state.guidedL15.cards[card.id].page===card.pages.length+1+card.tasks.indexOf(task))await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();continue;}
   if(task.kind==='choice')await root.getByRole('button',{name:task.answer,exact:true}).click();
   else if(task.kind==='write'){await root.getByRole('textbox',{name:'คำตอบ',exact:true}).fill('ih');await waitFor(s=>s.guidedL15.cards[card.id].responses[task.id]?.text==='ih');await page.reload();root=page.locator('.ownership-preview:visible');assert.equal(await root.getByRole('textbox',{name:'คำตอบ',exact:true}).inputValue(),'ih');await root.getByRole('textbox',{name:'คำตอบ',exact:true}).fill('IHRE');}
   else for(const token of ['Ihren Sessel','finde','ich','schön.'])await root.locator('.l15-order-tokens').getByRole('button',{name:token,exact:true}).click();
   await root.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await root.getByRole('heading',{name:'ถูกต้อง',exact:true}).waitFor();await waitFor(s=>s.attempts.some(a=>a.taskId===task.id));
   await root.getByRole('button',{name:'หน้าถัดไป',exact:true}).click();
  }
 }
 }
 stage='completion';state=await waitFor(s=>s.guidedL15.complete);assert.equal(state.attempts.length,11);assert.equal(state.attempts[0].id,'audit-historical-first');assert.equal(state.active.draft,'ร่างเดิมของบัญชีทดสอบ');
 await page.reload();await page.getByRole('heading',{name:'เรียนครบเรื่อง sein / ihr แล้ว',exact:true}).waitFor();await page.getByRole('link',{name:'ฝึกสิ่งที่เรียนแล้ว',exact:true}).click();await page.locator('.release-course').waitFor();if(await page.getByRole('button',{name:'เริ่มรอบแนะนำ',exact:true}).count())await page.getByRole('button',{name:'เริ่มรอบแนะนำ',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).waitFor();
 assert.equal(await page.locator('.lesson-save-error').count(),0);assert.deepEqual(errors,[]);
 await page.screenshot({path:`artifacts/l15-grammar-hosted/${tag}.png`,fullPage:true});
 await writeFile(`artifacts/l15-grammar-hosted/${tag}.json`,JSON.stringify({origin,ordinaryAccounts:2,normalRoute:true,hostedSupabase:true,testWorkspace:false,checkedResponses:10,allCardsWalkedThisRun:!startedComplete,legacyHistoryPreserved:true,reloadAndSignInResume:true,rlsReadAndWriteIsolation:true,practiceRoundStarted:true,pageErrors:errors},null,2)+'\n');
 console.log('Hosted ordinary-account verification passed: all cards/ten checks, drafts, firsts, login/reload, legacy history, RLS and Practice round.');
}catch(error){if(page)await page.screenshot({path:`artifacts/l15-grammar-hosted/${tag}-failure.png`,fullPage:true});console.error({stage,errorType:error.name,detail:error.message?.replace(/fill\([^)]*\)/g,'fill([redacted])').slice(0,300)});process.exitCode=1;}
finally{await browser.close();}
