import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {chromium} from 'playwright-core';
const packets=JSON.parse(readFileSync('docs/exercise-mapping/l01-l13-practice-extensions.json')),a11=JSON.parse(readFileSync('docs/exercise-mapping/a11-phrase-bank.json')),l13=JSON.parse(readFileSync('docs/exercise-mapping/l13-phrases-bank.json')),l14=JSON.parse(readFileSync('src/data/l14-practice-extensions.json')),l14core=JSON.parse(readFileSync('.audit/l14-practice-published-baseline.json'));
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const reports=[],errors=[];let page;
try{
 page=await browser.newPage({viewport:{width:375,height:812}});page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/__test-db/auth/v1/**',async route=>{const r=await route.fetch();if(!r.headers()['content-type']?.includes('json'))return route.fulfill({response:r});const data=await r.json();if(data.user)data.user.email='ordinary-learner@deutsch.test';if(data.email)data.email='ordinary-learner@deutsch.test';return route.fulfill({response:r,json:data});});
 await page.goto('http://localhost:3002/practice/L11/phrases',{waitUntil:'networkidle'});await page.getByLabel('อีเมล',{exact:true}).fill('tester2@deutsch.test');await page.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await page.getByRole('heading',{name:/ฝึกประโยคบท/}).waitFor();
 const scenarios=[];
 for(const lesson of ['L02','L11','L13']){
  const packet=packets.find(p=>p.lessonId===lesson),questions=packet.questions.filter(q=>q.targetId===packet.questions[0].targetId),first=questions[0];
  const foundation=(lesson==='L13'?l13.questions:a11.definitions).find(q=>(q.targetId??q.itemId)===first.targetId&&q.subskill===first.practice.unlock.subskill);
  assert.ok(foundation,lesson);scenarios.push({lesson,bank:lesson==='L13'?'phrases-daily':`a11-phrases-${lesson.toLowerCase()}-daily`,target:first.targetId,foundation,questions});
 }
 const selected=l14.filter(q=>q.targetId==='ask-walk');scenarios.push({lesson:'L14',bank:'phrase-l14-daily',target:'ask-walk',foundation:l14core.find(q=>q.itemId==='ask-walk'&&q.subskill===selected[0].practice.unlock.subskill),questions:selected.map(q=>({...q,kind:q.kind==='write'?'cloze':'choice',itemId:q.targetId,version:1,requiredItemIds:[q.targetId],topicId:'L14-phrases-'+q.topic,acceptedAnswers:q.kind==='write'?q.acceptedAnswers:[q.answer]}))});
 const seeded=await page.evaluate(async({scenarios,targets})=>{
  const key=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user')),auth=JSON.parse(localStorage.getItem(key));
  const headers={Authorization:`Bearer ${auth.access_token}`,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'};
  async function api(path,method='GET',body){const r=await fetch('/__test-db/rest/v1/'+path,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});if(!r.ok)throw Error(path+' '+await r.text());const t=await r.text();return t?JSON.parse(t):null;}
  for(const target of targets)await api('rpc/learning_action','POST',{action:'expose',payload:{itemId:target}});
  const prior=await api('learner_lesson_states?select=state&lesson_key=eq.deutsch-trainer-phrase-learning-v1-L14'),state=prior[0]?.state??{results:{}};state.results={...state.results,'ask-walk':'correct','ask-place':'correct','describe-turn':'correct'};
  await api('learner_lesson_states?on_conflict=user_id,lesson_key','POST',{user_id:auth.user.id,lesson_key:'deutsch-trainer-phrase-learning-v1-L14',state});
  const output=[];
  for(const scenario of scenarios){
   async function save(question,completed){const time=new Date().toISOString(),id=crypto.randomUUID(),entry={question,response:completed?question.acceptedAnswers[0]:'',selected:[],tokenOrder:[],hintUsed:false,translationUsed:false,wordHelpTokens:[],attempt:completed?{response:question.acceptedAnswers[0],correct:true,status:'completed',submittedAt:time,confidence:null,wordHelpTokens:[],translationUsed:false}:null};const round={id,createdAt:time,updatedAt:time,completed,position:0,items:[entry]};await api('rpc/sync_practice_session','POST',{p_bank_key:scenario.bank,p_state:round});return id;}
   await save(scenario.foundation,true);for(const q of scenario.questions.filter(q=>q.practice.stage<3))await save(q,true);
   const task=scenario.questions.find(q=>q.practice.stage===3),id=await save(task,false);output.push({lesson:scenario.lesson,bank:scenario.bank,id,task});
  }
  return output;
 },{scenarios,targets:[...a11.lessons.flatMap(l=>l.targets.map(t=>t.id)),...l13.groups.flatMap(g=>g.ids)]});
 for(const row of seeded){
  await page.goto(`http://localhost:3002/practice/${row.lesson}/phrases/daily?resume=${row.id}`,{waitUntil:'networkidle'});
  const frame=row.lesson==='L14'?page:page.frameLocator('iframe');const field=frame.getByRole('textbox',{name:'คำตอบภาษาเยอรมัน'});await field.waitFor();assert.equal(await field.evaluate(e=>e.tagName),'TEXTAREA');
  await field.fill('ทดสอบร่าง');await page.waitForTimeout(1200);await page.reload();await field.waitFor();assert.equal(await field.inputValue(),'ทดสอบร่าง');
  await field.fill(row.task.acceptedAnswers[0]);
  if(row.lesson==='L11'){
   await page.evaluate(async({bank,id})=>{const key=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user')),auth=JSON.parse(localStorage.getItem(key));const headers={Authorization:`Bearer ${auth.access_token}`,'Content-Type':'application/json'};const r=await fetch(`/__test-db/rest/v1/learner_practice_sessions?select=state&bank_key=eq.${bank}&session_id=eq.${id}`,{headers});const saved=(await r.json())[0].state;saved.items[0].translationUsed=true;saved.items[0].wordHelpTokens=['habe'];saved.updatedAt=new Date().toISOString();const upload=await fetch('/__test-db/rest/v1/rpc/sync_practice_session',{method:'POST',headers,body:JSON.stringify({p_bank_key:bank,p_state:saved})});if(!upload.ok)throw Error(await upload.text());},{bank:row.bank,id:row.id});
  }
  await frame.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await frame.getByRole('heading',{name:'ถูกต้อง',exact:true}).waitFor();
  await page.waitForFunction(async({bank,id})=>{const key=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user')),auth=JSON.parse(localStorage.getItem(key));const r=await fetch(`/__test-db/rest/v1/learner_practice_sessions?select=state&bank_key=eq.${bank}&session_id=eq.${id}`,{headers:{Authorization:`Bearer ${auth.access_token}`}});return r.ok&&(await r.json())[0]?.state.items[0].attempt?.correct===true;},{bank:row.bank,id:row.id},{polling:500});
  if(row.lesson==='L11')await page.waitForFunction(()=>{const iframe=document.querySelector('iframe');return iframe?.contentWindow?.activeItem?.()?.attempt?.assisted===true;});
  const annotation=frame.locator(row.lesson==='L14'?'.phrase-annotated-sentence':'.practice-answer-parts');const geometry=await annotation.evaluate(el=>{const words=[...el.querySelectorAll('dt')].map(w=>w.getBoundingClientRect());return{font:parseFloat(getComputedStyle(el).fontSize),oneRow:Math.max(...words.map(w=>w.top))-Math.min(...words.map(w=>w.top))<=1,inside:words.every(w=>w.left>=0&&w.right<=innerWidth+1)};});assert.ok(geometry.oneRow&&geometry.inside);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));console.log('Passed writing',row.lesson,JSON.stringify(geometry));reports.push({lesson:row.lesson,stage:3,draftRestored:true,checked:true,normalizedHelp:row.lesson==='L11',geometry});
 }
 for(let number=1;number<=14;number++){const lesson=`L${String(number).padStart(2,'0')}`;await page.goto(`http://localhost:3002/practice/${lesson}/phrases`,{waitUntil:'networkidle'});await page.locator('.l14-practice-entry-main a.button.primary').waitFor();assert.equal(await page.locator('.lesson-save-error').count(),0);reports.push({lesson,ordinaryAccountEntry:true});}
 assert.deepEqual(errors,[]);writeFileSync('.audit/phrase-practice-upgrade-browser.json',JSON.stringify(reports,null,2)+'\n');console.log(JSON.stringify(reports));
}catch(error){if(page){await page.screenshot({path:'.tools/phrase-upgrade-browser-failure.png',fullPage:true});console.log((await page.locator('body').innerText()).slice(-2200));}throw error;}finally{await browser.close();}
