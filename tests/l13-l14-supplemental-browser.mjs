import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { supplementalPracticeSets } from "../src/lib/l13-l14-supplemental-exercises.ts";
import { crosswordEntries } from "../src/lib/l13-l14-crossword.ts";
const base=process.env.TEST_BASE_URL||"http://localhost:3002";
assert(new URL(base).hostname==="localhost" || new URL(base).hostname==="127.0.0.1","Use local test workspace only");
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
const context=await browser.newContext({viewport:{width:320,height:780}});
const page=await context.newPage();
page.setDefaultTimeout(30000);
const uiOnly=process.env.PHASE2_UI_ONLY==="1";
const errors=[],saved=[],apiErrors=[];
let stateRequest;
page.on("request",request=>{if(request.url().includes("/rest/v1/learner_lesson_states") && request.method()==="GET") stateRequest={url:request.url(),headers:request.headers()};});
async function readRows() {
  assert(stateRequest,"No lesson-state request found");
  const response=await context.request.get(stateRequest.url,{headers:stateRequest.headers});
  assert(response.ok());return response.json();
}
page.on("pageerror",error=>errors.push(error.message));
page.on("response",async response=>{
  if(response.url().includes("/rest/v1/") && !response.ok()) apiErrors.push({status:response.status(),body:await response.text().catch(()=>"body unavailable")});
  if(response.url().includes("/rest/v1/learner_lesson_states") && response.request().method()==="POST" && response.ok()) {
    const body=response.request().postDataJSON();
    for(const row of Array.isArray(body)?body:[body]) saved.push(row);
  }
});
try {
  await page.goto(`${base}/learn/L13/course`);
  await page.getByLabel("อีเมล",{exact:true}).waitFor({timeout:8000}).catch(()=>{});
  if(await page.getByLabel("อีเมล",{exact:true}).count()) {
    await page.getByLabel("อีเมล",{exact:true}).fill(process.env.TEST_USER_EMAIL||"tester@deutsch.test");
    await page.getByLabel("รหัสผ่าน",{exact:true}).fill("TestOnly123!");
    await page.getByRole("button",{name:"เข้าสู่ระบบ",exact:true}).click();
  }
  await page.getByRole("heading",{name:"Berlin gefällt mir."}).waitFor();
  const initial=await readRows();
  for(const set of supplementalPracticeSets) {
    console.log("Playing",set.id);
    await page.goto(`${base}/learn/${set.lessonId}/course/ueben/vocabulary/${set.id}`);
    await page.locator(".a13-course-runner-heading h2").getByText(set.title,{exact:true}).waitFor();
    for(const [index,question] of set.questions.entries()) {
      if(index) await page.getByRole("button",{name:"คำถามถัดไป",exact:true}).click();
      if(question.kind==="word_search") {
        // Invalid path must neither complete nor crash; keyboard and touch-style clicks both work.
        await page.getByRole("button",{name:"ตรวจคำตอบ",exact:true}).click();
        await page.getByRole("status").filter({hasText:"ยังไม่ครบ"}).first().waitFor();
        if(!index) await page.getByRole("button",{name:"ขอคำใบ้",exact:true}).click();
        for(const word of question.words) for(const cell of [word.start,word.end]) {
          const width=question.grid[0].length,r=Math.floor(cell/width),c=cell%width;
          const button=page.getByRole("button",{name:`แถว ${r+1} คอลัมน์ ${c+1} ${question.grid[r][c]}`,exact:true});
          if(index===0) {await button.focus();await page.keyboard.press("Enter");} else await button.click();
        }
      } else {
        await page.getByLabel("ช่อง 1",{exact:true}).fill("wrong");
        await page.getByRole("button",{name:"ตรวจคำตอบ",exact:true}).click();
        await page.getByRole("status").filter({hasText:"ยังไม่ครบ"}).first().waitFor();
        for(const [slot,answer] of question.answers.entries()) await page.getByLabel(`ช่อง ${slot+1}`,{exact:true}).fill(answer);
      }
      await page.getByRole("button",{name:"ตรวจคำตอบ",exact:true}).click();
      await page.getByRole("status").filter({hasText:question.explanation}).first().waitFor();
      await page.waitForFunction(()=>document.documentElement.scrollWidth<=innerWidth);
    }
    await page.screenshot({path:`.tools/${set.id}-mobile.png`,fullPage:true});
  }
  await page.goto(`${base}/learn/L14/course/ueben/vocabulary/L14-VOC-CROSSWORD`);
  for(const entry of crosswordEntries) for(const [i,letter] of [...entry.answer].entries()) {
    await page.locator(`#crossword-${entry.row+(entry.direction==="down"?i:0)}-${entry.col+(entry.direction==="across"?i:0)}`).fill(letter);
  }
  await page.getByRole("button",{name:"ตรวจคำไขว้",exact:true}).click();
  await page.getByRole("status").filter({hasText:"ถูกต้อง ครบทุกคำแล้ว"}).first().waitFor();
  if(uiOnly) {
    assert.deepEqual(errors,[]);
    console.log("PASS UI ONLY: all 8 new prompts, wrong answers, hints, keyboard, 320px layouts and original picture crossword. Persistence is NOT verified in this mode.");
  } else {
    assert.equal(apiErrors.length,0,`Persistence API failed: ${JSON.stringify(apiErrors[0])}`);
  for(const lesson of ["L13","L14"]) {
    await page.goto(`${base}/learn/${lesson}/course/progress`);
    await page.getByRole("heading",{name:"ความก้าวหน้าการเรียนและการฝึก"}).waitFor();
    const rows=await readRows();
    const row=rows.find(row=>row.lesson_key===`deutsch-trainer-course-learning-v1-${lesson}`);
    assert(row,"Persisted course row missing");
    const previous=initial.find(item=>item.lesson_key===row.lesson_key);
    for(const attempt of previous?.state?.attempts??[]) assert.deepEqual(row.state.attempts.find(item=>item.attemptId===attempt.attemptId),attempt);
    for(const set of supplementalPracticeSets.filter(set=>set.lessonId===lesson)) for(const question of set.questions) {
      assert(row.state.attempts.some(attempt=>attempt.exerciseId===set.id && attempt.questionId===question.id && attempt.correctness===1));
    }
    assert(row.state.attempts.some(attempt=>attempt.patternId==="SUP-VOC-SEARCH" && attempt.hintsUsed===1 && attempt.correctness===1));
  }
  }
  assert(uiOnly || saved.length>0,"No successful persistence request observed");
  assert.deepEqual(errors,[]);
  if(!uiOnly) console.log("PASS: all 8 prompts, persistence, old attempt preservation, mobile and original picture crossword.");
} finally {await browser.close();}
