import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";
import discovery from "../src/lib/grammar-discovery.ts";
const { grammarDiscoveryLessons } = discovery;

const webPort = 3037;
const apiPort = 54347;
const base = `http://localhost:${webPort}`;
const server = spawn(process.execPath, ["scripts/test-workspace.mjs"], {
  env: { ...process.env, TEST_WORKSPACE_PORT: String(webPort), TEST_WORKSPACE_API_PORT: String(apiPort), TEST_WORKSPACE_WEBPACK: "1" },
  stdio: ["ignore", "pipe", "pipe"],
});
let log = "";
server.stdout.on("data", (chunk) => { log += chunk; });
server.stderr.on("data", (chunk) => { log += chunk; });
let browser;
try {
  const deadline = Date.now() + 120_000;
  while (!log.includes("✓ Ready") && Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(log);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!log.includes("✓ Ready")) throw new Error(`Test workspace did not start: ${log}`);
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.setDefaultTimeout(30_000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${base}/learn/L03/grammar`);
  await page.getByLabel("พื้นที่ทดสอบ", { exact: true }).waitFor();
  await page.getByLabel("อีเมล", { exact: true }).fill("tester@deutsch.test");
  await page.getByLabel("รหัสผ่าน", { exact: true }).fill("TestOnly123!");
  await page.getByRole("button", { name: "เข้าสู่ระบบ", exact: true }).click();

  for (const lesson of grammarDiscoveryLessons.filter((entry) => !process.env.ONLY_LESSON || entry.id === process.env.ONLY_LESSON)) {
    await page.goto(`${base}/lesson/${lesson.id}`);
    const grammarCard = page.locator(`a.skill-card[href="/learn/${lesson.id}/grammar"]`);
    await grammarCard.waitFor();
    await grammarCard.click();
    for (const topic of lesson.topics) {
      const route = `/learn/${lesson.id}/grammar/${topic.slug}`;
      await page.goto(base + route);
      await page.getByRole("heading", { name: topic.title, exact: true }).waitFor().catch(async (error) => {
        throw new Error(`${route}: ${error.message}\n${(await page.locator("body").innerText()).slice(0, 1400)}\n${log.slice(-1000)}`);
      });
      if (lesson.id === "L03" && topic === lesson.topics[0])
        await page.screenshot({ path: ".tools/grammar-discovery-L03.png", fullPage: true });
      assert.equal(await page.getByRole("link", { name: topic.title, exact: true }).count(), 0);
      const choices = page.locator(".grammar-discovery .guided-choices").first();
      await choices
        .getByRole("button", { name: topic.observe.choices.find((choice) => choice !== topic.observe.answer), exact: true }).click();
      await page.getByText(topic.observe.hint, { exact: true }).waitFor();
      await choices.getByRole("button", { name: topic.observe.answer, exact: true }).click();
      await page.getByText(topic.rule, { exact: true }).waitFor();
      await page.locator(".grammar-discovery-apply").getByRole("button", { name: topic.apply.answer, exact: true }).click();
      await page.getByRole("link", { name: /หัวข้อถัดไป|กลับหัวข้อไวยากรณ์/ }).last().waitFor();
    }
    console.log(`${lesson.id}: ${lesson.topics.length} interactive topics passed`);
  }

  for (const [id, route] of [["L13", "es-gibt"], ["L14", "lokale-praepositionen"]]) {
    await page.goto(`${base}/learn/${id}/grammar`);
    await page.locator(`a[href="/learn/${id}/grammar/${route}"]`).waitFor();
    await page.goto(`${base}/learn/${id}/grammar/${route}`);
    await page.locator(".guided-learning").waitFor();
    console.log(`${id}: existing grammar activity passed`);
  }
  for (const id of ["L01", "L02"]) {
    await page.goto(`${base}/learn/${id}/grammar`);
    await page.locator(`a[href="/learn/${id}/grammar/verbs"]`).waitFor();
    assert.equal(await page.locator(".grammar-discovery").count(), 0);
  }
  await page.goto(`${base}/learn/L01/grammar/verbs`);
  await page.locator(".verb-principles").waitFor();
  for (const route of ["pronouns", "verbs"]) {
    await page.goto(`${base}/learn/L02/grammar/${route}`);
    await page.locator(".guided-learning").waitFor();
  }
  assert.deepEqual(errors, []);
  console.log("Protected L01–L02 grammar routes passed");
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    const ended = new Promise((resolve) => server.once("exit", resolve));
    server.kill("SIGTERM");
    await ended;
  }
}
