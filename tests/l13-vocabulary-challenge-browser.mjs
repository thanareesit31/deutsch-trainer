import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chromium } from "playwright-core";
import { l13VocabularyChallengeActivities as bank } from "../src/lib/l13-vocabulary-challenge-bank.ts";
import { readChallengeState } from "../src/lib/l13-vocabulary-challenge-state.ts";
import { readLearnedImageVocabularyIds } from "../src/lib/vocabulary-image-learning-storage.ts";

const catalog = JSON.parse(readFileSync("supabase/seed/catalog.json", "utf8"));

const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(20000);
const errors = [];
page.on("pageerror", error => errors.push(error.message));
const key = "deutsch-trainer-vocabulary-challenge-v1-L13";
let original;
let userId;
async function api(path, method = "GET", body) {
  return page.evaluate(async ({ path, method, body }) => {
    const key = Object.keys(localStorage).find(key => key.startsWith("deutsch-trainer-test-") && !key.endsWith("-user"));
    const auth = JSON.parse(localStorage.getItem(key));
    const response = await fetch("/__test-db/rest/v1/" + path, { method, headers: { Authorization: "Bearer " + auth.access_token, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates" }, ...(body ? { body: JSON.stringify(body) } : {}) });
    if (!response.ok) throw Error(`Test API ${response.status}`);
    return response.status === 204 ? null : response.json();
  }, { path, method, body });
}
async function store(state) { await api("learner_lesson_states?on_conflict=user_id,lesson_key", "POST", { user_id: userId, lesson_key: key, state }); }
function partOrder(parts, answer, selected = []) {
  if (selected.length === parts.length) return selected.map(index => parts[index]).join("") === answer ? selected : null;
  for (let index = 0; index < parts.length; index++) {
    if (selected.includes(index)) continue;
    const result = partOrder(parts, answer, [...selected, index]);
    if (result) return result;
  }
  return null;
}
try {
  await page.goto("http://localhost:3002/practice");
  await page.getByLabel("อีเมล", { exact: true }).fill("tester2@deutsch.test");
  await page.getByLabel("รหัสผ่าน", { exact: true }).fill("TestOnly123!");
  await page.getByRole("button", { name: "เข้าสู่ระบบ", exact: true }).click();
  await page.getByRole("heading", { name: "แบบฝึกหัดของคุณ" }).waitFor();
  const rows = await api("learner_lesson_states");
  original = rows.find(row => row.lesson_key === key)?.state;
  userId = rows[0]?.user_id;
  assert(userId);
  const exposures = await api("item_exposures");
  const imageState = rows.find(row => row.lesson_key === "deutsch-trainer-vocabulary-image-learning-v1-L13")?.state;
  const learned = new Set([...readLearnedImageVocabularyIds(imageState ? JSON.stringify(imageState) : null), ...exposures.map(row => row.item_id)]);
  const eligible = bank.filter(activity => activity.added && activity.requiredItemIds.every(id => learned.has(id)));
  assert(eligible.length >= 40, "Use an existing test learner with completed L13 image vocabulary");
  const visited = new Set();
  let draftChecked = false;
  for (let start = 0; start < eligible.length; start += 15) {
    const state = readChallengeState(null, eligible.slice(start, start + 15));
    assert(state);
    await store(state);
    await page.goto("http://localhost:3002/practice/L13/vocabulary/challenge");
    for (const id of state.round.activityIds) {
      const activity = bank.find(activity => activity.id === id);
      const card = page.locator(`[data-activity-id="${id}"]`);
      await card.waitFor();
      assert.doesNotMatch(await card.innerText(), /MOMENTE|Schnelltest|PDF|B7\/3|L13\/3/);
      if (activity.kind === "story") {
        for (let index = 0; index < activity.gaps.length; index++) {
          const gap = activity.gaps[index];
          const answer = activity.wordBank.find(option => option.id === gap.answer).label;
          if (index === 0) {
            const other = activity.wordBank.find(option => option.id !== gap.answer).label;
            await card.locator(".l13-vocab-story-wordbank").getByRole("button", { name: catalog.items.find(item=>item.id===activity.wordBank.find(option=>option.label===other).id)?.answer??other, exact: true }).click();
            await card.getByRole("button", { name: `ช่อง 1 ${other}`, exact: true }).click();
          }
          const saved = !draftChecked ? page.waitForResponse(response => response.url().includes("learner_lesson_states") && response.request().method() === "POST" && response.ok()) : null;
          await card.locator(".l13-vocab-story-wordbank").getByRole("button", { name: catalog.items.find(item=>item.id===gap.answer)?.answer??answer, exact: true }).click();
          if (!draftChecked) {
            await saved;
            await page.reload();
            await card.getByRole("button", { name: `ช่อง 1 ${answer}`, exact: true }).waitFor();
            draftChecked = true;
          }
        }
        await card.getByRole("button", { name: "ตรวจคำตอบทั้งเรื่อง", exact: true }).click();
        await card.getByRole("status").filter({ hasText: "ถูกต้องทุกช่อง" }).waitFor();
      } else if (activity.kind === "crossword") {
        for (const [rowIndex, row] of activity.rows.entries()) {
          for (const [index, letter] of [...row.answer].entries()) await card.getByRole("textbox", { name: `คำที่ ${rowIndex + 1} ตัวอักษรที่ ${index + 1}`, exact: true }).fill(letter);
        }
        await card.getByRole("button", { name: "ตรวจคำตอบทั้งตาราง", exact: true }).click();
        await card.getByRole("status").filter({ hasText: "ถูกต้องทุกคำ" }).waitFor();
      } else if (activity.kind === "build") {
        const parts = card.locator('[aria-label="ส่วนคำศัพท์"]');
        await parts.getByRole("button").first().click();
        await card.locator('[aria-label="คำศัพท์ที่ประกอบ"]').getByRole("button").first().click();
        for (const index of partOrder(activity.parts, activity.answer)) await parts.getByRole("button", { name: activity.parts[index], exact: true }).click();
        await card.getByRole("button", { name: "ตรวจคำตอบ", exact: true }).click();
        await card.getByRole("status").filter({ hasText: "ถูกต้อง" }).waitFor();
      } else {
        if (activity.kind === "picture") await page.waitForFunction(() => { const image = document.querySelector(".l13-vocab-challenge-image"); return image?.complete && image.naturalWidth > 0; });
        const canonical = catalog.items.find(item => item.id === activity.answer)?.answer;
        const label = canonical && /^(der|die|das)\s/u.test(canonical) ? canonical : activity.options.find(option => option.id === activity.answer).label;
        await card.getByRole("button", { name: label, exact: true }).click();
        await card.getByRole("button", { name: "ตรวจคำตอบ", exact: true }).click();
        await card.getByRole("status").filter({ hasText: "ถูกต้อง" }).waitFor();
      }
      visited.add(id);
      assert(await card.getByRole("button", { name: id === state.round.activityIds.at(-1) ? "จบรอบ" : "กิจกรรมถัดไป", exact: true }).isEnabled());
      await card.getByRole("button", { name: id === state.round.activityIds.at(-1) ? "จบรอบ" : "กิจกรรมถัดไป", exact: true }).click();
    }
    await page.getByRole("heading", { name: "จบรอบฝึกขั้นสูงแล้ว" }).waitFor();
    assert.equal(await page.locator(".lesson-save-error").count(), 0);
  }
  assert.equal(visited.size, eligible.length);
  await page.getByRole("button", { name: "ฝึกเพิ่ม", exact: true }).click();
  await page.locator("[data-activity-id]").waitFor();
  assert.match(await page.locator(".l14-vocab-progress").innerText(), /15 กิจกรรม/);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ newActivitiesPlayed: visited.size, skippedUnlearned: bank.filter(activity => activity.added).length - eligible.length, formats: [...new Set(eligible.map(activity => activity.kind))], draftResume: draftChecked, noSourceLeak: true, noSaveErrors: true, mobile: true, pageErrors: errors }));
} finally {
  if (original && userId) await store(original);
  await browser.close();
}
