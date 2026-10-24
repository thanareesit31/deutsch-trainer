import assert from "node:assert/strict";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { l13ChallengeResponses, l13VocabularyChallengeActivities as activities } from "../../src/lib/l13-vocabulary-challenge-bank.ts";
import { sourceEvidence, sourceCatalog } from "../../src/lib/source-catalog.ts";

const items = new Map(JSON.parse(readFileSync("supabase/seed/catalog.json", "utf8")).items.map(item => [item.id, item]));
const sources = {
  story: ["AB12-13-1", "คลังคำเติมในบทอ่านต่อเนื่อง; แต่งเรื่องและคำตอบใหม่ทั้งหมด"],
  odd: ["AB12-13-2", "หาคำต่างกลุ่ม; ระบุเกณฑ์ความหมายให้มีคำตอบเดียว"],
  picture: ["AB12-13-3a", "จับคู่ภาพกับชื่อสถานที่; ใช้ภาพเดี่ยวของโปรเจกต์แทนแผนที่ในหนังสือ"],
  riddle: ["AB12-13-3b", "ใช้การอนุมานคำจากคำบรรยายของปริศนาคำไขว้ ปรับเป็นเลือกคำ; ไม่อ้างว่าเป็นกิจกรรมคำไขว้"],
  build: ["KB13-ST-W", "ประกอบส่วนคำเป็นชื่อสถานที่; ใช้ความหมายไทยช่วยระบุเป้าหมาย"],
  category: ["WS-SORT-36", "จัดคำในหมวดความหมาย; ปรับจากคำอาหารเป็นคำศัพท์เมืองที่เรียนแล้ว"],
  crossword: ["AB12-13-3b", "อ่านคำใบ้ เขียนตัวอักษรลงแถวที่เยื้องตำแหน่ง และอ่านคำเฉลยจากแนวตั้ง; คำใบ้และการเลือกคำแต่งใหม่"],
  pictureArticle: ["WEB-AUTHORED", "รูปแบบที่ผู้ใช้ขอเพิ่ม: ภาพและชื่อคำนามไม่ใส่ Artikel แล้วเลือก der/die/das; ใช้ข้อมูล Artikel และภาพที่เรียนอยู่ในโปรเจกต์"],
};
assert.equal(activities.filter(activity => activity.added).length, 76, "Keep prior additions and the 25 picture-Artikel tasks");
assert.equal(activities.length, 88);
assert.equal(new Set(activities.map(activity => activity.id)).size, activities.length);
assert.equal(new Set(l13ChallengeResponses.map(response => response.id)).size, l13ChallengeResponses.length);
const addedCounts = Object.fromEntries(Object.keys(sources).map(kind => [kind, activities.filter(activity => activity.added && activity.kind === kind).length]));
assert.deepEqual(addedCounts, { story: 5, odd: 10, picture: 10, riddle: 10, build: 10, category: 5, crossword: 1, pictureArticle: 25 });
const records = activities.map(activity => {
  for (const id of activity.requiredItemIds) {
    const item = items.get(id);
    assert(item?.lessonId === "L13" && item.skill === "vocabulary", `${activity.id}: unknown taught target ${id}`);
  }
  if (activity.kind === "story") {
    assert(activity.gaps.length >= 3);
    assert.equal(new Set(activity.wordBank.map(option => option.id)).size, activity.wordBank.length);
    for (const gap of activity.gaps) assert(activity.wordBank.some(option => option.id === gap.answer), `${gap.id}: answer absent from word bank`);
  } else if (activity.kind === "crossword") {
    assert.equal(activity.rows.map(row => row.answer[row.keyIndex]).join(""), activity.solution, "Vertical solution does not match the row letters");
    assert(activity.rows.every(row => /^[A-ZÄÖÜ]+$/u.test(row.answer) && row.keyIndex >= 0 && row.keyIndex < row.answer.length));
  } else if (activity.kind === "build") {
    assert.equal([...activity.parts.join("")].sort().join(""), [...activity.answer].sort().join(""), `${activity.id}: word parts do not spell the answer`);
  } else {
    assert(activity.options.some(option => option.id === activity.answer));
    assert.equal(new Set(activity.options.map(option => option.id)).size, activity.options.length);
    assert.equal(new Set(activity.options.map(option => option.label)).size, activity.options.length);
    if (activity.kind !== "category" && activity.kind !== "pictureArticle") for (const option of activity.options) assert(activity.requiredItemIds.includes(option.id));
    if (activity.kind === "pictureArticle") {
      assert.equal(activity.answer, items.get(activity.assessment.targetId)?.article);
      assert.equal(activity.assessment.subskill, "vocabulary_article");
      assert.equal(activity.assessment.assistance, "image-and-noun-no-article");
      assert.equal(activity.noun, items.get(activity.assessment.targetId)?.word);
    }
  }
  if (activity.kind === "story" || activity.kind === "picture" || activity.kind === "pictureArticle") assert(existsSync(`public${activity.image}`), `Missing image ${activity.image}`);
  const [evidenceId, adaptation] = sources[activity.kind];
  const evidence = sourceEvidence.find(entry => entry.id === evidenceId);
  assert(evidence && (evidence.method === "visual_pdf" || activity.kind === "pictureArticle" && evidence.method === "repository_inspection"), `${activity.id}: missing applicable source evidence`);
  return {
    activityId: activity.id, added: activity.added, format: activity.kind, difficulty: activity.difficulty,
    responseIds: activity.kind === "story" ? activity.gaps.map(gap => gap.id) : activity.kind === "crossword" ? activity.rows.map(row => row.id) : [activity.id],
    requiredItemIds: activity.requiredItemIds,
    contentSourceId: "DEUTSCH_TRAINER_ORIGINAL", publisherAnswersClaimed: false,
    ...(activity.kind === "pictureArticle" ? { assessment: activity.assessment } : {}),
    formatSource: { evidenceId, sourceId: evidence.sourceId, title: sourceCatalog[evidence.sourceId].title, printedPage: evidence.printedPage, pdfPage: evidence.pdfPage, activity: evidence.originalActivityId, adaptation },
  };
});
const manifest = { version: 2, reviewedAt: "2026-10-24", activities: activities.length, newActivities: activities.filter(activity => activity.added).length, responseSlots: l13ChallengeResponses.length, newByFormat: addedCounts, attributionVisibility: "project_metadata_only", records };
const path = "docs/exercise-mapping/l13-vocabulary-challenge-sources.json";
if (process.argv.includes("--write")) writeFileSync(path, JSON.stringify(manifest, null, 2) + "\n");
else assert.deepEqual(JSON.parse(readFileSync(path, "utf8")), manifest, "Source manifest is stale; run with --write after reviewing content");
console.log(JSON.stringify({ activities: manifest.activities, added: manifest.newActivities, responseSlots: manifest.responseSlots, formats: addedCounts, sourcesReviewed: true, imagesPresent: true }));
