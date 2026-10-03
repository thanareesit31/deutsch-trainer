# Requirement & Experience Changelog

บันทึกการเปลี่ยน requirement หรือ user-facing behavior ที่ตกลงแล้ว ใช้วันที่ตัดสินใจ/รวบรวมตามข้อมูลใน project; รายการใหม่ควรระบุวันที่ What changed, Why และ Impact โดยไม่แก้ประวัติเดิมให้กลายเป็น requirement ปัจจุบัน

## 2026-10-03 — คืนหน้าตาหน้าแรกเดิม

- **What changed:** คืนกล่องต้อนรับพร้อมภาพ Hallo!, การ์ดสถิติพร้อมไอคอน, การ์ดระดับ A1.1/A1.2, กิจกรรมรายสัปดาห์ และแถบทบทวนจากหน้าแรกเดิม พร้อมคืนหน้ารอโหลดแบบเดิม
- **Why:** ผู้ใช้ต้องการหน้าตาก่อนถูกแทนด้วยหน้าแรกแบบย่อ
- **Impact:** คง Supabase catalog, ปุ่มเข้า Practice โดยตรง และการทำ session ต่อ ตัวเลขอ้างอิง exposure/Completed attempts; ความคืบหน้าระดับแสดงเนื้อหาที่เคยเรียน ไม่อนุมานว่าจำได้จากการเปิดเรียน

## 2026-10-03 — ย้ายคลังเนื้อหาไป Supabase

- **What changed:** เพิ่มตาราง `content_lessons` และ `content_items` พร้อมเนื้อหาเดิม 12 บท / 260 รายการ และเปลี่ยนหน้าเรียน/ฝึก/ทบทวน/ความก้าวหน้าให้อ่านคลังเนื้อหาจาก Supabase มีลำดับและสถานะ draft/published/archived สำหรับการจัดการเนื้อหาในอนาคต
- **Why:** ให้เพิ่มหรือแก้เนื้อหาจากระบบแอดมินในอนาคตได้โดยไม่แก้โค้ดเว็บ
- **Impact:** คงรหัส ลำดับ รูปผัน ตัวเลือก และคำตอบเดิม ไม่แก้ตารางประวัติ ไม่สร้าง exposure จากการโหลด catalog และไม่เปลี่ยน session snapshot; โหลดเนื้อหาก่อน import ข้อมูลเก่า ป้องกัน import ขณะ catalog ว่าง หากโหลดไม่ได้แสดงปุ่มลองใหม่ ผู้เรียนอ่านได้เฉพาะเนื้อหาเผยแพร่และแก้ไขคลังไม่ได้ ระหว่างที่ยังไม่มีตาราง (`PGRST205`) ใช้สำเนาเดิมชั่วคราวเพื่อไม่ขัดจังหวะการเรียน หลังรัน migration และโหลดใหม่จะใช้ฐานข้อมูล รายละเอียดใน `docs/content-database.md`

## 2026-10-03 — เรียนการผันกริยาทีละคำ

- **What changed:** หน้าเรียนผันกริยาแสดงรายการเรียงซ้ายไปขวา บังคับเริ่มคำแรกและให้ย้อนดูคำที่เรียนแล้วได้ จับคู่ด้วยการแตะรูปกริยาก่อนแล้วแตะช่องคำตอบข้างประธาน เก็บตำแหน่ง/ผลเพื่อกลับมาเรียนต่อ และเพิ่มแท็บ “สรุป” ต่อจาก `sein` เพื่อเปิดตารางรวมประธานกับกริยารูปเดิมหลังเรียนครบ พร้อมทางไปบทเรียนหรือแบบฝึก ผลหลังตรวจเน้นส่วนลงท้าย; `heißt` เน้น `ßt`, `bin/bist/ist` เน้นทั้งคำ, `sind` เน้น `in`, และ `seid` คงสีเดิม เอาคำอธิบายเสริมและป้าย “ดูแล้ว” ออกจากหน้าฝึก
- **Why:** ทำให้การเรียนเป็นการดึงคำตอบจากความจำโดยตรง และแยกการเรียนรู้จากการวัดผลความมั่นใจของ Practice
- **Impact:** หน้า Learn เก็บ exposure, ความคืบหน้า และสถานะลำดับที่ต้องปลดล็อกไว้โดยไม่แสดงป้าย “ดูแล้ว”; ไม่สร้าง LearningAttempt หรือถาม confidence. รูป `sein` ใช้ `sind` กับ wir/sie และ `seid` กับ ihr โดยแสดงรูปที่ไม่มี ending ชัดเจนเป็นสีเดิม

## 2026-10-03 — บันทึกคู่ผันตามลำดับ Session

- **What changed:** จับคู่และบันทึกคำตอบทีละช่องก่อนเลื่อนไปช่องถัดไป
- **Why:** Session กำหนดให้ส่งคำตอบตามตำแหน่งปัจจุบัน เพื่อคงลำดับการฝึกและรองรับการทำต่อ
- **Impact:** ป้องกันข้อผิดพลาด `Session position changed`; คำตอบผิดจบทันที ส่วนคำตอบถูกเลือก confidence ก่อนดำเนินต่อ

## 2026-10-02 — Learning History เป็นหลักฐานความก้าวหน้า

- **What changed:** กำหนดให้ Learning History เป็น source evidence และ `KnowledgeState` เป็น derived state; Progress ต้องอ่านจากหลักฐานจริง ไม่ใช้ completion percentage แทน
- **Why:** ต้องสะท้อนว่าเห็นอะไร ตอบอะไร และผิดมิติใด โดยไม่สร้างสถานะ Learned จากการมี content ในระบบ
- **Impact:** เพิ่ม/ใช้ ItemExposure, LearningAttempt, AttemptEvidence, KnowledgeState, PracticeSession และ SessionItem; legacy aggregate ไม่ถูกแปลงเป็น Learning History ปลอม

## 2026-10-02 — Practice แยกจาก Learn

- **What changed:** Practice เป็น independent entry point และผู้เรียนไม่ต้องผ่าน Learn ซ้ำทุกครั้ง
- **Why:** ผู้เรียนควรกลับไปฝึกสิ่งที่เคยเรียนได้ทันที
- **Impact:** Learned item เข้า Practice ได้โดยตรง; Practice ต้องกรอง Not Seen items ออก และ scope ที่ไม่มี Learned item แสดง Empty State พร้อมทางไปเรียน

## 2026-10-02 — Learned boundary และการวัดผล

- **What changed:** Content ที่มีในระบบไม่นับว่า Learned; เฉพาะการเห็น item ผ่าน Learn activity ทำให้เป็น Seen/Learned และ eligible สำหรับ Practice/Review
- **Why:** ป้องกันการทดสอบเนื้อหาที่ยังไม่ได้เรียนและทำให้ความก้าวหน้ามีหลักฐาน
- **Impact:** Learn ต้อง persist exposure; Practice/Review ใช้ exposure เป็น eligibility boundary; noun เรียนเป็น Artikel + Nomen

## 2026-10-02 — Evidence, feedback และ confidence

- **What changed:** รองรับ diagnosis ตาม Word Recall, Artikel, Spelling, Verb Form, Grammar, Sentence Structure และ Application; คำตอบผิดให้ immediate corrective feedback และเก็บ error dimensions ทั้งหมด; คำตอบถูกถาม confidence “ง่าย/ต้องคิด/เดา”
- **Why:** แยกชนิดความรู้ที่ต้องฝึกและเก็บหลักฐานที่ Progress/Review นำไปใช้ได้
- **Impact:** Attempt เก็บ response time เป็น evidence โดยไม่มี time limit; ตอบช้าไม่ถือว่าผิด; Session Summary ยึด first attempt

## 2026-10-02 — Persist และ resume Practice Session

- **What changed:** Incomplete Practice Session ต้องอยู่ได้เมื่อเปลี่ยนหน้า/เปิดใหม่ และ resume ต่อได้
- **Why:** ผู้เรียนไม่ควรเสียตำแหน่งหรือคำตอบระหว่างรอบ
- **Impact:** PracticeSession/SessionItem และ Attempt/confidence ต้อง persist; Learning History คงเป็นหลักฐานถาวร

## 2026-10-02 — Review แยกจาก Practice

- **What changed:** เพิ่ม “ทบทวน” เป็นหัวข้อแยกจาก “แบบฝึกหัด”; Review เป็น system-directed ส่วน Practice เป็น user-directed
- **Why:** ผู้ใช้ต้องการแยกการเลือกฝึกเองออกจากคิวทบทวนที่ระบบแนะนำ
- **Impact:** Navigation มี Review แยก; คิวอาศัยผลล่าสุดและ confidence โดย error ที่ยังต้องคิด/เดาอยู่ในคิว ส่วนล่าสุดที่ถูกและง่ายออกจากคิว

## 2026-10-02 — Pending correct attempt และตัด Response Time ออกจาก MVP

- **What changed:** คำตอบถูก persist ทันทีเป็น Pending และจะ Completed หลังเลือก `easy`, `thought` หรือ `guess`; คำตอบผิด Completed ทันที. Pending ไม่ถูกใช้ใน Review, Progress หรือ KnowledgeState และ session resume กลับมาขั้น confidence ของข้อเดิม. ตัด Response Time ออกจาก learning logic; คง `response_ms` ใน schema ได้เพื่อ compatibility.
- **Why:** confidence เป็นส่วนหนึ่งของหลักฐานคำตอบที่ถูก และเวลาที่รวมช่วงพัก/ออกจากเว็บไม่ใช่หลักฐานที่จำเป็นสำหรับ MVP.
- **Impact:** Review/Progress/KnowledgeState ใช้เฉพาะ Completed attempt; ไม่บันทึก timer จาก client และ KnowledgeState SQL view กรอง Pending. เพิ่ม migration แบบ additive ตั้ง default ให้ column เดิม โดยไม่ลบข้อมูล/column. ไฟล์หลัก: `src/lib/learning.ts`, `src/components/practice.tsx`, `src/components/learning-pages.tsx`, `supabase/migrations/20261003000000_completed_attempts_no_response_time.sql`, `tests/learning.test.ts`, `tests/learning-database.mjs`, `tests/learning-browser.mjs`.

## การบันทึกรายการในอนาคต

เพิ่มรายการใหม่ด้วยรูปแบบนี้:

```md
## YYYY-MM-DD — ชื่อการเปลี่ยนแปลง

- **What changed:** ...
- **Why:** ...
- **Impact:** ...
```
