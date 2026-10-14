import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { chromium } from "playwright-core";
import { grammarDiscoveryLessons } from "../src/lib/grammar-discovery.ts";

const webPort = 3033;
const apiPort = 54340;
const base = `http://localhost:${webPort}`;
let server;
let browser;
let log = "";
try {
  server = spawn(process.execPath, ["scripts/test-workspace.mjs"], {
    env: { ...process.env, TEST_WORKSPACE_PORT: String(webPort), TEST_WORKSPACE_API_PORT: String(apiPort), TEST_WORKSPACE_WEBPACK: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => { log += chunk; });
  server.stderr.on("data", (chunk) => { log += chunk; });
  const deadline = Date.now() + 120_000;
  while (!log.includes("✓ Ready")) {
    if (server.exitCode !== null || Date.now() > deadline) throw new Error(`Test workspace did not start: ${log}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" });
  const page = await browser.newPage();
  page.setDefaultTimeout(45_000);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(`${base}/learn/L03/grammar`);
  await page.getByLabel("อีเมล", { exact: true }).fill("tester@deutsch.test");
  await page.getByLabel("รหัสผ่าน", { exact: true }).fill("TestOnly123!");
  await page.getByRole("button", { name: "เข้าสู่ระบบ", exact: true }).click();
  for (const lesson of grammarDiscoveryLessons) {
    const topic = lesson.topics[0];
    const url = `${base}/learn/${lesson.id}/grammar/${topic.slug}`;
    await page.goto(url);
    await page.locator(".grammar-discovery .guided-choices").first().getByRole("button", { name: topic.observe.answer, exact: true }).click();
    await page.locator(".grammar-discovery .guided-choices").last().getByRole("button", { name: topic.apply.answer, exact: true }).click();
    await page.getByText("เรียนหัวข้อนี้แล้ว").waitFor();
    await page.waitForFunction(() => !Object.keys(localStorage).some((key) => key.startsWith("deutsch-trainer-pending-lessons:")));
    await page.reload();
    await page.getByText("เรียนหัวข้อนี้แล้ว").waitFor();
    await page.goto(`${base}/learn/${lesson.id}/grammar`);
    await page.getByText(`เรียนแล้ว 1 / ${lesson.topics.length} หัวข้อ`).waitFor();
    assert.equal(await page.locator(".grammar-learning-entry .alphabet-entry-card .eyebrow").first().innerText(), "เรียนแล้ว");
    console.log(`PASS: ${lesson.id} persists Grammar Discovery completion`);
  }
  for (const lessonId of ["L01", "L02"]) {
    await page.goto(`${base}/learn/${lessonId}/grammar`);
    assert.equal(await page.locator(".grammar-discovery").count(), 0);
  }
  assert.deepEqual(pageErrors, []);
  console.log("PASS: L01–L02 grammar routes unchanged; no browser errors");
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    const ended = new Promise((resolve) => server.once("exit", resolve));
    server.kill("SIGTERM");
    await ended;
  }
}
