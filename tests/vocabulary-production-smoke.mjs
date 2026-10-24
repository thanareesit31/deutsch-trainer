import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));for(const skill of ['vocabulary','phrases']){await p.goto('http://localhost:3000/practice/L13/'+skill);await p.getByLabel('อีเมล',{exact:true}).waitFor();}assert.equal(await p.getByText('พื้นที่ทดสอบบนเครื่อง — ข้อมูลแยกจากบัญชีจริง',{exact:true}).count(),0);assert.deepEqual(errors,[]);console.log('PASS production build smoke: real app route opens sign-in, no test banner, no page errors');}finally{await browser.close();}
