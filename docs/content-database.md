# คลังเนื้อหา Supabase

เว็บอ่านเนื้อหาจากฐานข้อมูลผ่าน `ContentProvider` ก่อนโหลดประวัติผู้เรียน หลังติดตั้งตารางแล้วจะไม่ใช้ JSON เป็นแหล่งข้อมูลขณะใช้งาน การโหลด catalog ไม่สร้าง ItemExposure หรือ LearningAttempt

ช่วงเปลี่ยนผ่าน หาก API แจ้งเฉพาะว่าตารางยังไม่มี (`PGRST205`) เว็บใช้สำเนาเนื้อหาเดิมชั่วคราว เพื่อให้เรียนต่อได้ เมื่อรัน migration แล้วโหลดหน้าใหม่จะใช้ฐานข้อมูลอัตโนมัติ ข้อผิดพลาดเครือข่าย/สิทธิ์และคลังว่างไม่ใช้ fallback; `/api/health` จะยังเป็น 503 จนอ่านฐานข้อมูลได้

## ติดตั้ง

ใช้ Supabase โปรเจกต์เดียวกับ NEXT_PUBLIC_SUPABASE_URL และรัน migration เดิมตามลำดับก่อน migration เนื้อหา

1. เพิ่ม `DATABASE_URL` จาก Supabase Connect ใน `.env.local` (ไม่ใช้คำนำหน้า NEXT_PUBLIC และไม่ commit)
2. ติดตั้ง dependencies ด้วย `npm install`
3. ใช้ Node 20.9 ขึ้นไป รัน `node --env-file=.env.local scripts/migrate-content.mjs`

หรือรันไฟล์ `supabase/migrations/20261003010000_content_catalog.sql` ทั้งไฟล์ใน SQL Editor ตารางและ seed อยู่ใน transaction เดียวกัน สั่งซ้ำได้และไม่เขียนทับเนื้อหาที่แอดมินแก้ภายหลัง ไม่มีการลบหรือแก้ตารางประวัติผู้เรียน

## โครงสร้าง

| ตาราง | ข้อมูล |
| --- | --- |
| content_lessons | id บทเรียน, position ลำดับ, status, data JSONB (id/number/level/title/thai/topics), updated_at |
| content_items | id เนื้อหา, lesson_id, skill, position, status, data JSONB ของ Item เดิม, updated_at |

`data` ของ Item มี id, lessonId, skill, group, title, meaning, answer และฟิลด์เฉพาะทักษะ เช่น article/plural, options, accepted, passage, audio โดยชนิดข้อมูลอ้างอิง `src/lib/content.ts` ตัวอย่างครบทุกแบบอยู่ใน `supabase/seed/catalog.json` ปัจจุบันมีบท 1–18; Lektion 13 เพิ่ม 120 รายการ ได้แก่ Wortschatz หลัก 43, เสริม 26, Grammatik 22 และ Redemittel 29

RLS อนุญาต anon/authenticated อ่านเฉพาะ published และ item ต้องอยู่ในบทที่ published ผู้เรียนเพิ่ม/แก้/ลบเนื้อหาไม่ได้ ระบบแอดมินในอนาคตต้องตรวจสิทธิ์ที่ server ก่อนเขียนด้วย credentials ฝั่ง server; ยังไม่ได้สร้างหน้าแอดมินในงานนี้

## การนำเข้าในอนาคต

- ใช้ ID เดิมสำหรับการแก้รายการเดิม และ ID ใหม่สำหรับเนื้อหาใหม่ ห้ามนำ ID เก่ากลับไปใช้กับเรื่องอื่น เพราะประวัติอ้างอิง ID
- ให้ `data.id`, `data.lessonId`, `data.skill` ตรงกับคอลัมน์ภายนอก ฐานข้อมูลบังคับความสอดคล้องนี้
- ตรวจชนิดข้อมูล/ฟิลด์จำเป็นตาม Item และ Lesson ก่อนนำเข้า เก็บ draft ก่อนเผยแพร่ และกำหนด position ให้แน่นอน
- เก็บประวัติผู้เรียนและ session snapshot แยกจาก catalog ไม่เขียน snapshot ทับเมื่อแก้เนื้อหา
- archive แทนการลบเนื้อหาที่มีประวัติ คำถามใน session เดิมยังใช้ snapshot เดิม
- เมื่อเผยแพร่เนื้อหาแล้ว ผู้เรียนโหลดหน้าใหม่เพื่อรับ catalog ล่าสุด
- `src/data/*.json` เป็นไฟล์ต้นฉบับเก่าสำหรับอ้างอิงเท่านั้น การแก้ไฟล์เหล่านี้ไม่มีผลกับเว็บแล้ว

ค่าทั้ง DATABASE_URL และรหัสผ่านอยู่เฉพาะเครื่องที่รัน migration ไม่ส่งเข้า browser

## Introduction ของ Verben Lektion 1

รัน `20261005000000_l01_verb_introductions.sql` หลัง migration catalog (คำสั่ง `db:migrate-content` รันทั้งสองไฟล์ตามลำดับ) เพิ่ม `verbIntroductions` ใน `content_lessons.data` เฉพาะ L01: infinitive, thaiMeaning, meaningNote (optional), examples [{de, th}]. ไม่เพิ่ม content_items หรือเปลี่ยนประวัติผู้เรียน และรันซ้ำไม่เขียนทับ metadata ที่มีแล้ว

Supabase เป็นแหล่งเนื้อหา Introduction เพียงแห่งเดียว ไม่มีสำเนาเพิ่มใน seed JSON; deployment ที่ยังไม่ได้ติดตั้ง migration หรือใช้ fallback ตารางที่ยังไม่มีจะใช้กิจกรรมเดิมจนติดตั้ง migration และโหลดใหม่

`20261005010000_l01_verb_principles.sql` เพิ่ม `content_lessons.data.verbPrinciples` ของ L01 (หัวข้อ, ส่วนหลัก/ส่วนท้าย, ตาราง Endung และหมายเหตุ) โดย runner รันต่อจาก Introduction; ไม่เพิ่ม practice items หรือสำเนา JSON

`20261005020000_l01_verb_pronoun_translations.sql` เติม `thaiSubject` ให้แต่ละแถวใน `verbPrinciples.rows` ของ L01; ตารางใช้คอลัมน์นี้ถัดจากประธาน

## Lektion 2 guided flow

`20261007010000_l02_learning_content.sql` เพิ่ม/เติม metadata ของ L02 ใน catalog เดิม (109 records: 92 ใหม่, 17 IDs เดิม) และ `content_lessons.data.learningFlows`. Activity config แยกจาก content และอ้างอิง `content_items.id`; จำนวน 113 vocabulary / 22 grammar activities ไม่ใช่จำนวนคำศัพท์หรือ mastery. Numbers ใช้ 29 base/tens กับ 12 compound examples ไม่ใช่ 101 cards. Profession concepts มี forms ที่ยืนยันจริง, source ของแต่ละรูป, optional image/audio refs และคำอ่านไทย; teacher forms ไม่ถูกอ้างว่าพิมพ์อยู่ในหนังสือ ทุก record มี `sourceScope`/`sources`. คำอ่านไทยเป็นคำช่วยเรียนที่เรียบเรียง ส่วนเสียงสังเคราะห์ใช้ helper เดิมเมื่อไม่มี static asset.

`sein` อ้างอิง `grammar-L01-sein-0` ถึง `-5`; ไม่เพิ่ม L02 sein content. เก็บ IDs เดิมของรูปหญิงไว้เพื่อรักษาประวัติ และการจับคู่รูปหญิง expose IDs เดิมด้วยโดยไม่สร้าง Practice attempts. Seed ใช้ version guards: รันซ้ำไม่เขียนทับ metadata ที่แก้ภายหลัง. ดู inventory/source ambiguities ใน `lektion-2-content-inventory.md`.

ใช้ `npm run db:migrate-content` และ `npm run db:migrate-lessons` (Node 20.9+) เพื่อติดตั้งทั้ง content และ state. `20261007020000_l02_lesson_states.sql` ขยาย check constraint ในตารางเดิมและคง RLS; provider whitelist รองรับสอง L02 keys แต่ legacy import ยังคงเฉพาะ L01. ไม่มีตาราง progress ใหม่หรือ local JSON content. localStorage ใช้เฉพาะ pending writes เดิม.

Validation: `npm run test:l02` ตรวจ catalog references, dependencies, source tags, assets, replay-safe resume และ migration/RLS. `npm run test:l02-browser` ใช้ server ที่ `TEST_BASE_URL` (default localhost:3000), intercept Supabase ไปยัง PGlite ไม่เขียน learner data จริง; ตรวจทุก activity และใช้ mock German voice สำหรับความถูกต้องของ playback/choice flow ไม่ใช่ทดสอบคุณภาพเสียงพูด.
