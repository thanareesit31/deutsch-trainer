import assert from "node:assert/strict";
import { chromium } from "playwright-core";

const base = process.env.TEST_BASE_URL || "http://localhost:3002";
assert(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(30000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

try {
  await page.goto(`${base}/lesson/L13`);
  await page.getByLabel("อีเมล", { exact: true }).fill(process.env.TEST_USER_EMAIL || "tester2@deutsch.test");
  await page.getByLabel("รหัสผ่าน", { exact: true }).fill("TestOnly123!");
  await page.getByRole("button", { name: "เข้าสู่ระบบ", exact: true }).click();

  const categories = ["vocabulary", "grammar", "phrases", "writing", "listening", "reading"];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lesson of ["L13", "L14"]) {
      console.log(`Checking ${lesson} at ${width}px`);
      await page.goto(`${base}/lesson/${lesson}`);
      await page.locator(".skills-grid .skill-card").first().waitFor();
      assert.equal(await page.locator(".skills-grid .skill-card").count(), 6);
      assert.equal(await page.getByText("เปิดบทเรียนและแบบฝึกครบ 7 หมวด").count(), 0);
      for (const [index, category] of categories.entries()) {
        const card = page.locator(".skills-grid .skill-card").nth(index);
        const href = await card.getAttribute("href");
        if (href) {
          assert.equal(href, `/learn/${lesson}/${category}`);
          await card.click();
          await page.waitForURL(`${base}/learn/${lesson}/${category}`);
          if (category === "vocabulary") await page.locator(".vocabulary-learning .alphabet-entry-card").first().waitFor();
        } else {
          assert.match(await card.getAttribute("class"), /unavailable/);
          await card.getByText("กำลังเตรียมเนื้อหา").waitFor();
        }
        await page.goto(`${base}/lesson/${lesson}`);
      }
      await page.goto(`${base}/practice`);
      await page.locator("select").selectOption(lesson);
      assert.equal(await page.locator(".skills-grid .skill-card").count(), 6);
      for (const category of categories) {
        await page.locator(`.skills-grid a[href="/practice/${lesson}/${category}"]`).click();
        await page.waitForURL(`${base}/practice/${lesson}/${category}`);
        await page.goto(`${base}/practice`);
        await page.locator("select").selectOption(lesson);
      }
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    }
  }

  await page.goto(`${base}/lesson/L02`);
  await page.locator(".skills-grid .skill-card").first().waitFor();
  assert.equal(await page.locator(".skills-grid .skill-card").count(), 6);
  await page.goto(`${base}/practice`);
  await page.locator("select").selectOption("L02");
  assert.equal(await page.locator(".skills-grid .skill-card").count(), 6);
  assert.deepEqual(errors, []);
  console.log("PASS: all six original Learn and Practice categories work for L13/L14 on desktop/mobile; L02 remains unchanged");
} finally {
  await browser.close();
}
