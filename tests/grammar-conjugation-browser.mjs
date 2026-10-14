import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { grammarDiscoveryLessons } from "../src/lib/grammar-discovery.ts";
import { conjugationSubjects, grammarConjugationTopic } from "../src/lib/grammar-conjugation.ts";

const base = process.env.TEST_BASE_URL ?? "http://localhost:3033";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.setDefaultTimeout(45_000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
try {
  await page.goto(`${base}/learn/L03/grammar/sprechen`);
  await page.getByLabel("อีเมล", { exact: true }).waitFor();
  await page.getByLabel("อีเมล", { exact: true }).fill("tester2@deutsch.test");
  await page.getByLabel("รหัสผ่าน", { exact: true }).fill("TestOnly123!");
  await page.getByRole("button", { name: "เข้าสู่ระบบ", exact: true }).click();

  for (const lesson of grammarDiscoveryLessons) {
    if (process.env.ONLY_LESSON && lesson.id !== process.env.ONLY_LESSON) continue;
    let count = 0;
    for (const topic of lesson.topics) {
      const conjugation = grammarConjugationTopic(lesson.id, topic.slug);
      if (!conjugation) continue;
      const topicRoute = `/learn/${lesson.id}/grammar/${topic.slug}`;
      await page.goto(base + topicRoute);
      await page.getByRole("heading", { name: topic.title, exact: true }).waitFor();
      const start = page.getByRole("link", { name: "ฝึกผันกริยา" });
      if (!(await start.count())) {
        await page.locator(".grammar-discovery .guided-choices").first()
          .getByRole("button", { name: topic.observe.answer, exact: true }).click();
        await page.locator(".grammar-discovery-apply")
          .getByRole("button", { name: topic.apply.answer, exact: true }).click();
      }
      await start.click();
      for (const verb of conjugation.verbs) {
        await page.getByRole("heading", { name: verb.infinitive, exact: true }).waitFor();
        for (const [index, subject] of conjugationSubjects.entries()) {
          const row = page.locator(`.sentence-conjugation-board [data-pair-id="${subject.id}"]`);
          if (await row.locator(".matching-drop.filled").count()) continue;
          const form = verb.forms[index];
          const token = page.locator(".sentence-conjugation-board").getByRole("button", { name: form, exact: true }).first();
          await token.click();
          await row.click();
          await row.locator(".matching-drop.filled").waitFor();
        }
        await page.getByText(`จับคู่แล้ว ${conjugationSubjects.length} / ${conjugationSubjects.length} ประโยค`).waitFor();
        await page.getByRole("link", { name: verb === conjugation.verbs.at(-1) ? "ดูตารางสรุป" : "กริยาถัดไป" }).click();
      }
      await page.locator(".verb-summary table").waitFor();
      assert.equal(await page.locator(".verb-summary tbody tr").count(), 6);
      for (const [verbIndex, verb] of conjugation.verbs.entries()) {
        for (const [rowIndex, form] of verb.forms.entries()) {
          assert.equal(await page.locator(".verb-summary tbody tr").nth(rowIndex).locator("td").nth(verbIndex).innerText(), form);
        }
      }
      await page.reload();
      await page.locator(".verb-summary table").waitFor();
      count++;
    }
    if (count) console.log(`${lesson.id}: ${count} conjugation topic${count === 1 ? "" : "s"} passed`);
  }
  for (const id of ["L01", "L02"]) {
    await page.goto(`${base}/learn/${id}/grammar`);
    await page.locator(`a[href="/learn/${id}/grammar/verbs"]`).waitFor();
    assert.equal(await page.locator(".grammar-conjugation-learning").count(), 0);
  }
  assert.deepEqual(errors, []);
  console.log("Protected L01–L02 grammar routes passed");
} finally {
  await browser.close();
}
process.exit(0);
