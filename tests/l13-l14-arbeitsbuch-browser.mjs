import assert from "node:assert/strict";
import {chromium} from "playwright-core";
import {arbeitsbuchPracticeSets} from "../src/lib/l13-l14-arbeitsbuch-exercises.ts";
const base=process.env.TEST_BASE_URL||"http://localhost:3002";
assert(["localhost","127.0.0.1"].includes(new URL(base).hostname),"Only local test workspace is permitted");
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();page.setDefaultTimeout(45000);
const errors=[],writeErrors=[];
let stateRequest;
page.on("pageerror",error=>errors.push(error.message));
page.on("request",request=>{if(request.url().includes("/rest/v1/learner_lesson_states")&&request.method()==="GET")stateRequest={url:request.url(),headers:request.headers()};});
page.on("response",response=>{if(response.url().includes("/rest/v1/learner_lesson_states")&&response.request().method()==="POST"&&!response.ok())writeErrors.push(response.status());});
async function rows(){assert(stateRequest);const response=await context.request.get(stateRequest.url,{headers:stateRequest.headers});assert(response.ok());return response.json();}
async function open(set){
 if(process.env.AB_SCOPE_SMOKE==="1") {
  await page.goto(`${base}/learn/${set.lessonId}/course/ueben/${set.category}`);
  await page.getByRole("heading",{name:"แบบฝึกเพิ่มเติมจาก MOMENTE Arbeitsbuch · เรียงง่ายไปยาก",exact:true}).waitFor();
  await page.locator(".a13-course-topic-card").filter({hasText:set.title}).getByRole("link",{name:/^(เริ่มฝึก|ฝึกต่อ)$/}).click();
 } else await page.goto(`${base}/learn/${set.lessonId}/course/ueben/${set.category}/${set.id}`);
 await page.locator(".a13-course-runner-heading h2").getByText(set.title,{exact:true}).waitFor();}
try {
 await page.goto(`${base}/learn/L13/course`);
 await page.getByLabel("อีเมล",{exact:true}).fill(process.env.TEST_USER_EMAIL||"tester2@deutsch.test");
 await page.getByLabel("รหัสผ่าน",{exact:true}).fill("TestOnly123!");
 await page.getByRole("button",{name:"เข้าสู่ระบบ",exact:true}).click();
 await page.getByRole("heading",{name:"Berlin gefällt mir."}).waitFor();
 const before=await rows(),startedAt=new Date().toISOString();
 for(const width of (process.env.AB_SCOPE_SMOKE==="1"?[390]:[1440,320])) {
  await page.setViewportSize({width,height:900});
  for(const set of arbeitsbuchPracticeSets) {
   console.log("Playing",width,set.id);
   await open(set);
   for(const [index,question] of (process.env.AB_SCOPE_SMOKE==="1"?set.questions.slice(0,1):set.questions).entries()) {
    if(index)await page.getByRole("button",{name:"คำถามถัดไป",exact:true}).click();
    if(question.kind==="text_marking") {
     const first=page.locator(".a13-ab-text button").first();
     await first.click();await page.getByRole("button",{name:"ตรวจคำตอบ",exact:true}).click();
     await page.getByRole("status").filter({hasText:"ยังไม่ตรง"}).waitFor();await first.click();
     for(const [token,role] of Object.entries(question.answerRoles)) {
      await page.getByRole("button",{name:role==="verb"?"กริยา":"Dativ",exact:true}).click();
      const word=page.getByRole("button",{name:new RegExp(`^คำที่ ${Number(token)+1}: `)});
      if(width===1440){await word.focus();await page.keyboard.press("Enter");}else await word.click();
     }
    } else if(question.kind==="codeword_riddle") {
     assert.equal(await page.getByText(question.solution,{exact:true}).count(),0,"Codeword solution leaked before answer");
     await page.getByLabel("คำใบ้ 1",{exact:true}).fill("X");
     await page.getByLabel("คำรหัสสุดท้าย",{exact:true}).fill(question.solution);
     await page.getByRole("button",{name:"ตรวจคำตอบ",exact:true}).click();
     await page.getByRole("status").filter({hasText:"ลองตรวจคำใบ้ข้อ"}).waitFor();
     for(const [clueIndex,clue] of question.clues.entries())await page.getByLabel(`คำใบ้ ${clueIndex+1}`,{exact:true}).fill(clue.answer);
    } else if(question.kind==="context_bank") {
     for(const [slot] of question.answers.entries())await page.getByLabel(`ช่อง ${slot+1}`,{exact:true}).fill("wrong");
     if(question.caseSensitive){await page.getByLabel("ช่อง 1",{exact:true}).fill("ihnen");await page.getByLabel("ช่อง 2",{exact:true}).fill("ihr");}
     await page.getByRole("button",{name:"ตรวจคำตอบ",exact:true}).click();
     await page.getByRole("status").filter({hasText:"ยังไม่ครบ"}).waitFor();
     if(question.wrongExplanation)await page.getByRole("status").filter({hasText:question.wrongExplanation}).waitFor();
     for(const [slot,answer] of question.answers.entries())await page.getByLabel(`ช่อง ${slot+1}`,{exact:true}).fill(answer);
    } else if(question.kind==="cloze") {
     await page.getByRole("textbox",{name:"คำตอบ",exact:true}).fill("wrong");
     await page.getByRole("button",{name:"ตรวจคำตอบ",exact:true}).click();
     await page.getByRole("status").filter({hasText:"ยังไม่ตรง"}).waitFor();
     if(question.wrongExplanation)await page.getByRole("status").filter({hasText:question.wrongExplanation}).waitFor();
     await page.getByRole("textbox",{name:"คำตอบ",exact:true}).fill(question.acceptedAnswers[0]);
     if(question.assetId)await page.locator(".a13-course-question-image").waitFor();
    } else throw new Error(`Unexpected AB mechanic ${question.kind}`);
    if(index===0)await page.getByRole("button",{name:"ขอคำใบ้",exact:true}).click();
    await page.getByRole("button",{name:"ตรวจคำตอบ",exact:true}).click();
    await page.getByRole("status").filter({hasText:question.explanation}).waitFor();
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${set.id}/${question.id} overflows at ${width}`);
   }
   await page.screenshot({path:`.tools/arbeitsbuch/${width}-${set.id}.png`,fullPage:true});
  }
 }
 // Re-read persisted state after navigation/reload: an in-memory callback is not sufficient.
 for(const lesson of ["L13","L14"]) {
  await page.goto(`${base}/learn/${lesson}/course/progress`);await page.getByRole("heading",{name:"ความก้าวหน้าการเรียนและการฝึก"}).waitFor();await page.reload();
  await page.getByRole("heading",{name:"ความก้าวหน้าการเรียนและการฝึก"}).waitFor();
  const saved=(await rows()).find(row=>row.lesson_key===`deutsch-trainer-course-learning-v1-${lesson}`);assert(saved,"No actual persisted state row");
  const previous=before.find(row=>row.lesson_key===saved.lesson_key);
  for(const old of previous?.state?.attempts??[])assert.deepEqual(saved.state.attempts.find(attempt=>attempt.attemptId===old.attemptId),old);
  assert.deepEqual(saved.state.drafts,previous?.state?.drafts??{});
  for(const set of arbeitsbuchPracticeSets.filter(set=>set.lessonId===lesson))for(const question of (process.env.AB_SCOPE_SMOKE==="1"?set.questions.slice(0,1):set.questions)){
   const attempts=saved.state.attempts.filter(attempt=>attempt.questionId===question.id&&attempt.submittedAt>=startedAt);
   assert(attempts.some(attempt=>attempt.correctness===0),`No wrong-answer attempt ${question.id}`);
   assert(attempts.filter(attempt=>attempt.correctness===1).length>=(process.env.AB_SCOPE_SMOKE==="1"?1:2),`Desktop/mobile results missing ${question.id}`);
   if(set.builtInSupport)assert(attempts.every(attempt=>attempt.hintsUsed>=1),"Word-bank assistance was counted as independent recall");
   assert(attempts.every(attempt=>attempt.topicIds.every(topic=>/^L(13|14)-/.test(topic))&&attempt.primaryCompetency===set.primaryCompetency&&attempt.patternId===set.patternId));
  }
 }
 await page.setViewportSize({width:820,height:1000});
 for(const id of ["L13-AB-MARK","L14-AB-CODEWORD","L14-AB-ORT"]){await open(arbeitsbuchPracticeSets.find(set=>set.id===id));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);}
 assert.deepEqual(writeErrors,[]);assert.deepEqual(errors,[]);
 console.log(process.env.AB_SCOPE_SMOKE==="1"?"PASS scope smoke: first prompt of all 6 sets at390px; canonical topic IDs, primary skill, pattern, assistance and actual persisted history verified.":"PASS: 19 AB prompts at desktop1440/mobile320, tablet820, wrong answers, hints, formal capitalization, keyboard, real DB persistence after reload, old history and drafts retained.");
} finally {await browser.close();}
