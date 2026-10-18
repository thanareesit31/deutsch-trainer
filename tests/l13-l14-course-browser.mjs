import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { l13L14PracticeSets } from "../src/lib/l13-l14-course-exercises.ts";

const base = process.env.TEST_BASE_URL || "http://localhost:3002";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(25000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`${base}/learn/L13/course`);
  await page.getByLabel("อีเมล", { exact: true }).waitFor({ timeout: 8000 }).catch(() => {});
  if (await page.getByLabel("อีเมล", { exact: true }).count()) {
    await page.getByLabel("อีเมล", { exact: true }).fill(process.env.TEST_USER_EMAIL || "tester2@deutsch.test");
    await page.getByLabel("รหัสผ่าน", { exact: true }).fill("TestOnly123!");
    await page.getByRole("button", { name: "เข้าสู่ระบบ", exact: true }).click();
  }
  await page.getByRole("heading", { name: "Berlin gefällt mir." }).waitFor();
  await page.waitForURL(`${base}/lesson/L13`);

  await page.goto(`${base}/learn/L13/course/lernen/vocabulary/L13-ort-in-der-stadt`);
  await page.waitForURL(`${base}/learn/L13/vocabulary`);
  await page.locator(".vocabulary-learning .alphabet-entry-card").first().waitFor();

  await page.goto(`${base}/learn/L14/course/ueben/vocabulary/L14-VOC-CROSSWORD`);
  await page.getByRole("heading", { level: 1, name: "ภาพกับอักษรไขว้" }).waitFor();
  const entries = [
    { answer: "POLIZEI", direction: "down", row: 1, col: 8 },
    { answer: "POST", direction: "across", row: 1, col: 8 },
    { answer: "AMPEL", direction: "across", row: 3, col: 4 },
    { answer: "ZENTRUM", direction: "across", row: 5, col: 8 },
    { answer: "BANK", direction: "down", row: 3, col: 10 },
  ];
  for (const entry of entries) {
    for (const [index, character] of [...entry.answer].entries()) {
      const row = entry.row + (entry.direction === "down" ? index : 0);
      const col = entry.col + (entry.direction === "across" ? index : 0);
      await page.locator(`#crossword-${row}-${col}`).fill(character);
    }
  }
  await page.getByRole("button", { name: "ตรวจคำไขว้" }).click();
  await page.getByRole("status").getByText("ถูกต้อง ครบทุกคำแล้ว").waitFor();
  await page.waitForTimeout(1500);
  await page.reload();
  await page.getByRole("heading", { level: 1, name: "ภาพกับอักษรไขว้" }).waitFor();
  await page.goto(`${base}/learn/L13/course/progress`);
  await page.getByRole("heading", { name: "ความก้าวหน้าการเรียนและการฝึก" }).waitFor();
  await page.locator(".a13-course-progress-card")
    .filter({ hasText: "L14 · Wortschatz" })
    .getByText(/ฝึกแล้ว \d+ ครั้ง/)
    .waitFor();
  if (process.env.SMOKE_ALL_PATTERNS !== "0") {
    for (const set of l13L14PracticeSets) {
      await page.goto(`${base}/learn/${set.lessonId}/course/ueben/${set.category}/${set.id}`);
      await page.locator(".a13-course-runner-heading h2").getByText(set.title, { exact: true }).waitFor();
      await page.locator(".a13-course-exercise-question h3").waitFor();
    }
  }
  await page.goto(`${base}/learn/L14/course/ueben/reading/L14-LES-01`);
  await page.getByRole("button", { name: /Bahnhof/ }).waitFor();
  assert.equal(await page.getByRole("button", { name: /Bahnhof/ }).getAttribute("aria-pressed"), "true");
  await page.getByRole("button", { name: "Ampel", exact: true }).click();
  await page.getByRole("button", { name: "Post", exact: true }).click();
  await page.getByRole("button", { name: "ตรวจคำตอบ", exact: true }).click();
  await page.getByRole("status").getByText("ปลายทางตามคำแนะนำคือ Post").waitFor();
  for (const lesson of ["L01", "L02", "L13", "L14"]) {
    await page.goto(`${base}/lesson/${lesson}`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await page.getByRole("link", { name: /Wortschatz|คำศัพท์/ }).first().waitFor();
  }
  await page.goto(`${base}/learn/L13/grammar/verben`);
  await page.getByRole("heading", { name: /Verben|กริยา/ }).first().waitFor();
  await page.goto(`${base}/learn/L14/vocabulary/images/institutionen`);
  await page.getByRole("heading").first().waitFor();
  await page.setViewportSize({ width: 320, height: 780 });
  await page.goto(`${base}/learn/L14/course/ueben/vocabulary/L14-VOC-CROSSWORD`);
  const firstCell = page.locator("#crossword-1-8");
  await firstCell.focus();
  await page.keyboard.type("P");
  assert.equal(await firstCell.inputValue(), "P");
  await page.keyboard.press("Backspace");
  assert.equal(await firstCell.inputValue(), "");
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "course page should not overflow at 320px");
  assert.equal(errors.length, 0, errors.join("; "));
  console.log("L13 original vocabulary route, L14 letter-cell crossword, persistence and progress page passed.");
} finally {
  await browser.close();
}
