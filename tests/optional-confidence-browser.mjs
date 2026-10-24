import {readFileSync} from 'node:fs';
const {items}=JSON.parse(readFileSync('supabase/seed/catalog.json','utf8'));
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
import {l13VocabularyChallengeActivities as bank} from '../src/lib/l13-vocabulary-challenge-bank.ts';
import {readChallengeState} from '../src/lib/l13-vocabulary-challenge-state.ts';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});page.setDefaultTimeout(25000);
const key='deutsch-trainer-vocabulary-challenge-v1-L13';const errors=[];page.on('pageerror',error=>errors.push(error.message));let original,userId;
async function api(path,body){return page.evaluate(async({path,body})=>{const k=Object.keys(localStorage).find(k=>k.startsWith('deutsch-trainer-test-')&&!k.endsWith('-user'));const auth=JSON.parse(localStorage.getItem(k));const response=await fetch('/__test-db/rest/v1/'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+auth.access_token,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},...(body?{body:JSON.stringify(body)}:{})});if(!response.ok)throw Error('API '+response.status);return response.status===204?null:response.json();},{path,body});}
async function store(state){return api('learner_lesson_states?on_conflict=user_id,lesson_key',{user_id:userId,lesson_key:key,state});}
async function currentState(){return (await api('learner_lesson_states')).find(row=>row.lesson_key===key)?.state;}
try {
await page.goto('http://localhost:3002/practice');await page.getByLabel('อีเมล',{exact:true}).fill('tester2@deutsch.test');await page.getByLabel('รหัสผ่าน',{exact:true}).fill('TestOnly123!');await page.getByRole('button',{name:'เข้าสู่ระบบ',exact:true}).click();await page.locator('.practice-recommendation').first().waitFor();

const rows=await api('learner_lesson_states');userId=rows[0].user_id;original=rows.find(row=>row.lesson_key===key)?.state;
const activity=bank.find(a=>a.kind==='pictureArticle');const state=readChallengeState(null,[activity]);state.articleRound=state.round;await store(state);
await page.goto('http://localhost:3002/practice/L13/vocabulary/picture-article');
let card=page.locator('[data-activity-id]');await card.waitFor();
await card.getByRole('button',{name:activity.answer,exact:true}).click();
let saved=page.waitForResponse(r=>r.url().includes('learner_lesson_states')&&r.request().method()==='POST'&&r.ok());
await card.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();await saved;
assert(await card.getByRole('button',{name:'จบรอบ',exact:true}).isEnabled());
await page.reload();await card.getByRole('status').waitFor();assert.equal(await card.locator('[data-confidence-response]').count(),0);assert.equal(await card.getByRole('button',{name:'ยังไม่มั่นใจ',exact:true}).count(),0);
assert(await card.getByRole('button',{name:'จบรอบ',exact:true}).isEnabled());
let stored=await currentState();assert.equal(stored.articleRound.responses[activity.id].confidence,null);assert.equal(stored.articleRound.responses[activity.id].answer,activity.answer);
await card.getByRole('button',{name:'จบรอบ',exact:true}).click();await page.getByRole('heading',{name:'จบรอบฝึกแล้ว',exact:true}).waitFor();
for(let i=0;i<30;i++){stored=await currentState();if(stored.articleRound.completedAt)break;await page.waitForTimeout(100);}assert(stored.articleRound.completedAt);
const story=bank.find(a=>a.kind==='story');await store(readChallengeState(null,[story]));await page.goto('http://localhost:3002/practice/L13/vocabulary/challenge');await card.waitFor();
for(const gap of story.gaps){const option=story.wordBank.find(o=>o.id===gap.answer);await card.locator('.l13-vocab-story-wordbank').getByRole('button',{name:items.find(item=>item.id===option.id)?.answer??option.label,exact:true}).click();}
await card.getByRole('button',{name:'ตรวจคำตอบทั้งเรื่อง',exact:true}).click();
assert.equal(await card.locator('[data-confidence-response]').count(),0);
assert(await card.getByRole('button',{name:'จบรอบ',exact:true}).isEnabled());
assert.equal(await card.getByRole('button',{name:'ง่าย',exact:true}).count(),0);
assert(await card.getByRole('button',{name:'จบรอบ',exact:true}).isEnabled());
saved=page.waitForResponse(r=>r.url().includes('learner_lesson_states')&&r.request().method()==='POST'&&r.ok());await card.getByRole('button',{name:'จบรอบ',exact:true}).click();await saved;
for(let i=0;i<30;i++){stored=await currentState();if(stored.round.completedAt)break;await page.waitForTimeout(100);}assert(stored.round.completedAt);assert(Object.values(stored.round.responses).every(r=>r.confidence===null));
assert.deepEqual(errors,[]);console.log(JSON.stringify({unknownConfidenceCanAdvance:true,firstAnswerPreserved:true,unknownConfidencePreserved:true,multiResponseCanSkip:true,pageErrors:errors}));
} finally {if(original&&userId)await store(original);await browser.close();}
