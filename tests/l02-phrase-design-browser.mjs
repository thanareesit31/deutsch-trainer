import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try{
const page=await browser.newPage({viewport:{width:1360,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:3002/prototypes/l02-phrases-design.html');
await page.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())));
await page.screenshot({path:'.tools/l02-redesign/desktop.png',fullPage:true});
await page.getByRole('button',{name:'Wir arbeiten als Friseure.',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();assert((await page.getByRole('status').innerText()).startsWith('ถูกต้อง'));
await page.getByRole('button',{name:'ต่อไป',exact:true}).click();
for(const word of ['Ich','arbeite','bei','Haarfit.'])await page.locator('.tokens').getByRole('button',{name:word,exact:true}).click();
await page.locator('.answer').getByRole('button',{name:'Haarfit.',exact:true}).click();assert(await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).isDisabled());await page.locator('.tokens').getByRole('button',{name:'Haarfit.',exact:true}).click();
await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();assert((await page.getByRole('status').innerText()).startsWith('ถูกต้อง'));await page.getByRole('button',{name:'ต่อไป',exact:true}).click();
await page.getByRole('button',{name:'28 Jahre alt.',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();assert((await page.getByRole('status').innerText()).startsWith('ถูกต้อง'));await page.getByRole('button',{name:'ต่อไป',exact:true}).click();
await page.getByRole('button',{name:'Nein, wir sind nicht verheiratet.',exact:true}).click();await page.getByRole('button',{name:'ตรวจคำตอบ',exact:true}).click();assert((await page.getByRole('status').innerText()).startsWith('ถูกต้อง'));
await page.setViewportSize({width:390,height:844});
for(let i=0;i<4;i++){await page.locator('nav button').nth(i).click();assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:`.tools/l02-redesign/mobile-${i}.png`,fullPage:true});}
assert.deepEqual(errors,[]);console.log('PASS four L02 design examples: choice/order/correction, feedback, images, mobile widths and no browser errors');
}finally{await browser.close();}
