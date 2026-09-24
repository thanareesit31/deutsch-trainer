import { chromium } from 'playwright-core';
import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-first-run', '--no-default-browser-check'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const core = JSON.parse(await readFile(new URL('../src/data/vocabulary.json', import.meta.url)));
await mkdir('test-results', { recursive: true });
const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('deutsch-mit-sun-v5') || '{}'));
async function visit(path, title) { await page.goto(base + path); if (title) await page.getByRole('heading', { name: title, exact: true }).waitFor(); }
async function clickExact(name) { await page.getByRole('button', { name, exact: true }).click(); }
try {
  await visit('/', 'Hallo, Sun ☀');
  await page.screenshot({ path: 'test-results/dashboard-desktop.png', fullPage: true });
  assert.equal(await page.locator('.stat-card').count(), 4);
  const health = await (await context.request.get(base + '/api/health')).json();
  assert.equal(health.status, 'ok'); assert.equal(health.vocabulary, 181);
  console.log('PASS: dashboard, core count, health route', health.runtime);

  await page.locator('.stat-card').first().click();
  await page.getByRole('heading', { name: 'คลังการเรียนรู้ของคุณ' }).waitFor();
  assert.match(await page.locator('.progress-panel .quiet-pill').innerText(), /181/);
  await page.getByRole('button', { name: 'Hallo สวัสดี (เป็นกันเอง)' }).click();
  await page.getByRole('dialog').waitFor();
  await page.getByRole('button', { name: 'ปิดรายละเอียด' }).click();
  console.log('PASS: clickable dashboard stats and item details');

  await visit('/practice/L01/vocabulary', 'ฝึกคำศัพท์');
  await clickExact('Artikel');
  await page.getByRole('button', { name: 'เริ่มฝึก 0 ข้อ' }).click();
  await page.getByRole('alert').filter({ hasText: 'ชุดนี้ไม่มีคำนามที่มี Artikel' }).waitFor();
  await clickExact('Flashcards');
  await page.locator('.count-options button').filter({hasText:'5'}).click();
  await page.getByRole('button', { name: 'เริ่มฝึก 5 ข้อ' }).click();
  await page.getByRole('button', { name: 'พลิกการ์ดดูคำตอบ' }).waitFor();
  assert.equal(await page.getByRole('button', { name: 'จำได้', exact: true }).count(), 0);
  await clickExact('พลิกการ์ดดูคำตอบ'); await clickExact('จำได้');
  let state = await saved();
  assert.equal(Object.values(state.progress).reduce((n,p) => n+p.right+p.wrong,0),1);
  await page.reload();
  await page.getByRole('heading', { name: 'คำตอบที่ฝึกไว้ถูกบันทึกแล้ว' }).waitFor();
  assert.equal(Object.values((await saved()).progress).reduce((n,p) => n+p.right+p.wrong,0),1);
  console.log('PASS: article empty state, reveal before self-rating, immediate save survives reload');

  await visit('/practice/L01/vocabulary', 'ฝึกคำศัพท์');
  await clickExact('เยอรมัน → ไทย'); await page.locator('.count-options button').filter({hasText:'5'}).click();
  await page.getByRole('button', { name: 'เริ่มฝึก 5 ข้อ' }).click();
  for(let index=0;index<5;index++) {
    await page.locator('.question-card h2').waitFor();
    const german = await page.locator('.question-card h2').innerText();
    const expected = core.find(w=>w.Word_German===german)?.Word_Thai;
    assert(expected);
    const buttons = page.locator('.answer-options > button');
    let selected = -1;
    for(let i=0;i<await buttons.count();i++) {
      const text = await buttons.nth(i).locator('span').nth(1).innerText();
      if(index===0 ? text!==expected : text===expected) { selected=i; break; }
    }
    await buttons.nth(selected).click();
    await page.locator('.answer-feedback').waitFor();
    await clickExact(index===4 ? 'ดูผลการฝึก':'ข้อต่อไป');
  }
  await page.getByRole('heading',{name:'อีกก้าวเล็ก ๆ สำเร็จแล้ว'}).waitFor();
  assert.match(await page.locator('.result-score').innerText(),/80%/);
  await page.screenshot({path:'test-results/session-result.png',fullPage:true});
  await page.getByRole('button',{name:'ฝึกเฉพาะ 1 ข้อที่ผิด'}).click();
  assert.match(await page.locator('.session-heading').innerText(),/ข้อ 1 \/ 1/);
  console.log('PASS: five-question session, scoring, wrong-only retry');

  await visit('/practice/L01/grammar','ฝึกไวยากรณ์');
  await page.getByRole('button',{name:'Satzbau 6 ข้อ'}).click();
  await page.getByRole('button',{name:'เริ่มฝึก 6 ข้อ'}).click();
  const bank = page.locator('.word-bank > button');
  await bank.first().waitFor();
  const total = await bank.count();
  assert(total>2);
  for(let i=0;i<total;i++) await bank.nth(i).click();
  await clickExact('ตรวจคำตอบ'); await page.locator('.answer-feedback').waitFor();
  console.log('PASS: grammar topics and sentence ordering');

  await visit('/progress','เห็นทุกก้าวที่คุณเติบโต');
  await page.screenshot({path:'test-results/progress-desktop.png',fullPage:true});
  await page.getByRole('textbox',{name:'ค้นหาคำศัพท์หรือหัวข้อ'}).fill('Eltern');
  await page.getByRole('button',{name:'ดูรายละเอียด die Eltern'}).click();
  assert.match(await page.getByRole('dialog').innerText(),/Plural/);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(),0);
  console.log('PASS: progress search, plural labeling, keyboard dismissal');

  await visit('/settings','ตั้งค่าและข้อมูลของฉัน');
  const before = Object.keys((await saved()).progress).length;
  await page.getByLabel('เลือกไฟล์ Progress').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,progress:{V181:{right:9,wrong:2,lastSeen:Date.now(),lastResult:'right',streak:4}}}))});
  await clickExact('ยืนยันรวมประวัติ');
  state=await saved(); assert.equal(state.progress.V181.right,9); assert(Object.keys(state.progress).length>before);
  await page.getByLabel('เลือกไฟล์ Progress').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('{"progress":{"V001":{"right":-1}}}')});
  await page.getByRole('alert').filter({hasText:'นำเข้าไม่สำเร็จ'}).waitFor();
  assert.deepEqual(await saved(),state);
  const downloadPromise=page.waitForEvent('download'); await clickExact('ส่งออก Progress');
  const download=await downloadPromise; const exportPath=await download.path();
  const exported=JSON.parse(await readFile(exportPath,'utf8')); assert.equal(exported.progress.V181.right,9);
  await clickExact('รีเซ็ต Progress'); await clickExact('เข้าใจแล้ว ไปขั้นยืนยันสุดท้าย');
  assert(await page.getByRole('button',{name:'ล้างประวัติทั้งหมด'}).isDisabled());
  await clickExact('ยกเลิก'); assert.deepEqual(await saved(),state);
  console.log('PASS: legacy import merge, invalid import rejection, export, reset safeguards');

  await page.setViewportSize({width:390,height:844});
  await visit('/','Hallo, Sun ☀');
  await page.screenshot({path:'test-results/dashboard-mobile.png',fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'mobile layout overflows');
  await page.getByRole('button',{name:'เปิดเมนู',exact:true}).click();
  await page.getByRole('navigation',{name:'เมนูหลัก'}).getByRole('link',{name:'บทเรียน',exact:true}).click();
  await page.getByRole('heading',{name:'บทเรียนของคุณ'}).waitFor();
  assert.equal(await page.locator('.sidebar.open').count(),0);
  await page.screenshot({path:'test-results/lessons-mobile.png',fullPage:true});
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  console.log('PASS: mobile layout and navigation');
  assert.deepEqual(errors,[]);
  console.log('ALL BROWSER CHECKS PASSED');
} catch(error) {
  await page.screenshot({path:'test-results/failure.png',fullPage:true});
  console.log('PAGE AT FAILURE',await page.locator('main').innerText());
  throw error;
} finally { await browser.close(); }
