import assert from "node:assert/strict";
import { chromium } from "playwright-core";
const base=process.env.TEST_BASE_URL||"http://localhost:3002";
assert(["localhost","127.0.0.1"].includes(new URL(base).hostname));
const browser=await chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"});
const page=await browser.newPage();
const errors=[];
page.on("pageerror",error=>errors.push(error.message));
try {
  await page.goto(base);
  await page.getByLabel("อีเมล",{exact:true}).fill(process.env.TEST_USER_EMAIL||"tester@deutsch.test");
  await page.getByLabel("รหัสผ่าน",{exact:true}).fill("TestOnly123!");
  await page.getByRole("button",{name:"เข้าสู่ระบบ",exact:true}).click();
  await page.getByRole("button",{name:/ออกจากระบบ/}).waitFor();
  for(const route of ["/lesson/L01","/lesson/L02","/learn/L02/grammar/pronouns","/learn/L02/grammar/verbs"]) {
    await page.goto(`${base}${route}`);
    if(route.startsWith("/lesson/")) await page.getByRole("heading",{level:1}).waitFor({timeout:20000});
    else await page.locator(".vocabulary-image-progress").waitFor({timeout:20000});
    assert(!(await page.locator("body").innerText()).includes("Application error"));
    console.log("PASS protected route",route);
  }
  assert.deepEqual(errors,[]);
} finally {await browser.close();}
