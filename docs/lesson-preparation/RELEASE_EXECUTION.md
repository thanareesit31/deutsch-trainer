# เปิดบทเรียนที่แก้และบท 15–18 ให้บัญชีทั่วไปก่อน deploy

ข้อกำหนดล่าสุด 9 พฤศจิกายน 2026: เปิดทุกส่วนที่แก้และสร้าง รวม L15–L18 คำศัพท์ ไวยากรณ์ ประโยค ให้ใช้ได้จริงในบัญชีทั่วไปก่อน deploy ร่าง 15–18 ไม่ถูกยกเว้นแล้ว

## ลำดับและเกณฑ์เสร็จ

- [x] อ่าน Principles ของ poteto-mode และมาตรฐานบทเรียน/การวัดผล/Practice/คำอธิบายใต้คำ
- [x] เก็บ inventory และชุดข้อมูล: 97 lexical targets, 7 grammar topics, 32 dialogues, 372 candidate units; รักษารหัสเดิม
- [x] เชื่อม model และกิจกรรมจริงทั้ง 12 หมวดของ L15–L18 พร้อมสื่อที่แสดง/เล่นได้จริง
- [x] Register catalog, server question definitions และ lesson-state keys; รักษา RLS และคิว/คำตอบเดิม
- [x] เชื่อม Learn → first answers/help/drafts → account → subskill state → eligible next task โดยแยก evidence ของ format ต่างกัน
- [x] เปิดงาน Learn ประโยค L01–L14 ที่แก้แล้วสำหรับบัญชีทั่วไป และตรวจ handoff/exposure ของแต่ละ renderer
- [x] ทดสอบเส้นทางบัญชีทั่วไป การบันทึก/กลับมาทำต่อ/สลับบัญชี และคำตอบที่ยังไม่เคยเรียน; ตรวจ 375/390/1360px
- [x] ตรวจ release bundle ไม่มี test-workspace configuration หรือ draft-only routes ที่บังหน้าใช้งานจริง
- [ ] Production build และ deployment จริง; apply schema ก่อนเปิด client ที่ใช้ schema นั้น; ตรวจ URL และ health หลังปล่อย

ใช้ registry/session infrastructure ที่มีอยู่เพื่อไม่สร้าง Practice store รายบทอีกชุด แยกงานสื่อออกจาก source/UI เมื่อทำขนาน คำถามที่กำกวมหรือยังไม่มีสื่อไม่เปิดให้ผู้เรียน

## ความพร้อม deployment ที่ตรวจพบตอนเริ่ม

Repository: `thanareesit31/deutsch-trainer`, branch `master`, backend Supabase, hosting ที่บันทึกใน README คือ Vercel บัญชี GitHub connector มีสิทธิ์ admin/push ไม่มี Vercel CLI หรือ token และไม่มี DATABASE_URL/service-role/access token ใน runtime หรือ .env.local ที่ตรวจ ไม่มีการ deploy หรือใช้สิทธิ์ schema ด้วย publishable key จะตรวจเส้นทาง deployment/credentials ที่มีอยู่ต่อโดยไม่เปิดเผย secret

Decision trail: `.audit/general-learner-release.tsv`. สถานะเหล่านี้เป็นหลักฐานเริ่มต้น ไม่ใช่ข้ออ้างว่าขั้น deployment สำเร็จแล้ว

## ผลการเชื่อมระบบที่ทำแล้ว

- Runtime 12 courses, 136 teaching units (97 vocabulary cards, 7 grammar topics with 16 models, 32 A/B dialogues), 372 task definitions, 399 audio asset IDs across 380 decoded files. คำเสริม 51 รายการเป็น glossary ไม่คิดคะแนน
- Learn ใช้ LessonStateProvider/checkpoints บัญชีเดิม เฉพาะการพบเนื้อหาและกิจกรรมลองทำหลังตัวอย่าง Practice ใช้ learner_practice_sessions + PracticeAccountSync ผ่าน 12 banks `a13-release-l15-vocabulary` ถึง `a13-release-l18-phrases`; ไม่เขียนรอบ Practice กลับไปเป็น lesson-state อีกชุด
- shared canonical projection เดียวกันสำหรับ client/SQL ทั้ง 372 ข้อ หมวดประโยค 64 ข้อลง phrase_practice_questions และตรวจเทียบทั้งสอง registry ก่อนรับรอบฝึก
- เลือก eligible tasks จาก card ที่เรียนจริง รักษา queue ของรอบ <=10 targets ไม่ซ้ำ เลือกโดยผล target/subskill, unknown evidence, optional help และระยะทบทวน ใช้ selector เดียวในทางแนะนำและทางเลือกหัวข้อ บันทึกเหตุผลเลือก
- คำแนะนำหน้าแรก/ภาพรวมฝึกให้รอบที่ค้างก่อน และใช้หลักฐานเดียวกัน ส่วนผลบท 15–18 ใน Progress แยกคำตอบแรก/ตัวช่วยตาม subskill ไม่ย้ายคะแนนเก่าหรือประเมินความชำนาญจากการดู model
- เกณฑ์ 3 independent first tasks/2 days เป็นนโยบายอนุรักษนิยม ชุดที่มีเพียงหนึ่ง variant ต่อ target/subskill ยังไม่เข้าเกณฑ์เลื่อนเป็นชำนาญ ไม่ใช้การตอบข้อเดิมซ้ำเพื่อสร้างหลักฐานหลายบริบท การปรับเลือกโจทย์ทำงานแล้ว แต่ไม่ได้อ้างว่ามี advanced variants ทุกเป้าหมาย
- Spelling ตรวจ NFC/trim และตัวพิมพ์ใหญ่ตรงคำตอบ รวม Artikel ที่ให้ไว้เป็นตัวช่วยโดยไม่คิดเป็นคะแนน Artikel; หมวดอื่นเทียบตัวพิมพ์แบบไม่แยกใหญ่เล็ก
- migrations 00000/01000/02000/03000 ลงวันที่ 20261109 เพิ่ม allowlists/catalogs/validators/health โดยรักษา RLS และข้อมูลเดิม Catalog เดิมไม่ถูกแก้ grading; การเปลี่ยน grading/prerequisites ต้องใช้ task ID ใหม่

## หลักฐานตรวจแล้ว

- Unit tests: target eligibility, distinct subskills, exact noun orthography/Unicode, first answer/draft/round serialization and merge; shared Practice parser/queue metadata all 12 banks
- Real PGlite/RLS: all 12 Learn states and all 12 Practice banks, real canonical grading, unknown targets/prerequisite denial, corrupted phrase registry denial, first-answer preservation, help monotonicity, drafts/resume and two-account isolation
- Browser Learn: ทั้ง 12 หมวดผ่าน model → real save → draft reload → check → next ด้วย auth ในเครื่องที่ใช้ UI เส้นทางบัญชีทั่วไป ไม่สกัดการเขียนข้อมูล ส่วน identity ยังคงเป็นบัญชี local test เพื่อไม่แก้บัญชีจริง
- Browser ordinary Learn เดิม: L01,L02,L03,L11,L13/rating,L14 ผ่าน renderer ที่ปลด gate; L01/L02 คืนหน้าค้างเดิม ไม่มีการสร้าง checkpoint จำลอง
- Layout: 297 distinct model/feedback strings ที่ 375/390/1360px รวม 891 sentence rows ไม่มีตัดคำ/เลื่อน/แตกแถว minimum font 10.6/11.8/15.9px
- Production build หลังเชื่อม shared Practice ผ่านพร้อม TypeScript. Shared Practice browser ครบ 12 banks/19 guided questions ผ่าน real sync RPC และอ่าน account rows จริงกลับมาตรวจ ตรวจ production deployment จริงก่อนปิดงาน

## ระบบจริงยังต้องตรวจ

ตรวจ remote Supabase REST ก่อนส่งมอบพบ `release_course_tasks` ยังไม่มี (404 PGRST205) จึงยังไม่เปิด frontend ที่พึ่ง schema ใหม่นี้บน production ไม่มี DATABASE_URL/service-role/access token หรือ GitHub Actions secret ที่ใช้ apply schema ได้ในเซสชันนี้ เตรียม `.tools/enable-lessons-15-18.sql` รวม 4 migrations ให้เจ้าของระบบ Run ใน SQL Editor แล้วตรวจ anonymous readiness RPC ก่อน deploy ผ่าน Vercel Git integration

Git push dry-run ผ่านและ GitHub Vercel status ของ HEAD เดิมสำเร็จ ไม่ใช่หลักฐานว่า commit ใหม่นี้ deploy แล้ว ต้องบันทึก commit, deployment URL, readiness/health และ ordinary-account smoke ของระบบจริงเมื่อทำได้

Readiness RPC executed as anon against real PGlite returned courses=12,cards=136,tasks=372,phraseTasks=64. GitHub deployment metadata identified the existing Vercel Production deployment for old HEAD a4a5afe. Chrome contains the authenticated project dashboard, but browser JavaScript automation is disabled. User requested help executing SQL; awaiting that explicit browser permission rather than asking for database credentials. No hosted SQL/deployment claim.

## Final review corrections

Cross-family review reproduced stale-device assistance loss and a pending-round deep-link defect. Fixed help merging for both delayed incoming help and already-saved remote help without changing accepted first answers. Shared upload reads the canonical saved row back and acknowledges only that server snapshot, preserving newer unsent drafts. The UI refreshes from the merged account cache. Explicit resume IDs select the eligible saved pending queue even when the active pointer names a newer completed round. Learn/checkpoint and shared Practice regression suites cover both help arrival orders. Browser stale-tab verification is scoped separately from the earlier 12-bank sweep.

## Hosted schema applied, 10 November 2026

Applied the reviewed four-migration bundle through the authenticated Supabase dashboard management API after the user enabled browser automation. No database password/token was exported. Independent publishable-key HTTP verification returned200 with courses12,cards136,tasks372,phraseTasks64,practiceSyncReady=true. This supersedes the missing-schema blocker recorded above. The production build includes the shared-RPC readiness guard and passes TypeScript. Frontend deployment verification remains required. Evidence: .audit/lesson-release.json.
