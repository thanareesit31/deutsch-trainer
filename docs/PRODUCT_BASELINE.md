# Product Baseline

เอกสารนี้กำหนด behavior ที่ผลิตภัณฑ์ควรมี ใช้เป็น source of truth สำหรับ Product Requirements / RE และ user-facing behavior การอธิบาย implementation ปัจจุบันให้ดู `current-system-snapshot.md`; หาก implementation หรือเอกสารเก่าขัดกัน ให้ใช้ baseline นี้

วันที่รวบรวม baseline: 2 ตุลาคม 2026

## Product goal

ช่วยให้ผู้เรียนภาษาเยอรมันเรียนเนื้อหาใหม่ ฝึกสิ่งที่เรียนแล้ว และเห็นความก้าวหน้าจากหลักฐานการเรียนจริง โดย Learn กับ Practice เป็นคนละทางเข้าและไม่บังคับให้เรียนเนื้อหาซ้ำก่อนฝึก

## Navigation และ entry points

เมนูหลักประกอบด้วย:

- หน้าแรก
- บทเรียน
- แบบฝึกหัด
- ความก้าวหน้า

**Learn และ Practice เป็น independent entry points** ผู้เรียนเลือกเข้าเรียนเนื้อหาใหม่จากบทเรียน หรือเข้าแบบฝึกหัดเพื่อฝึกสิ่งที่เคยเรียนแล้วได้โดยตรง ส่วน **ทบทวน** เป็นหัวข้อแยกจากแบบฝึกหัดตามข้อสรุปภายหลังของผู้ใช้

## Learn และ Learned Content Boundary

- การมี content อยู่ใน catalog ไม่ได้แปลว่าผู้เรียนเคยเรียนแล้ว
- Item เป็น Seen/Learned เมื่อผู้เรียนได้เห็น item ผ่าน Learn activity และระบบบันทึก `ItemExposure`
- การดู catalog, เข้า Practice, นำเข้าข้อมูลเก่า หรือมี content ในระบบ ไม่สร้าง Learned state
- Vocabulary noun เรียนเป็น **Artikel + Nomen**

### Practice gating

- Learned item เข้า Practice หรือ Review ได้ทันที โดยไม่ต้องกลับไป Learn ซ้ำ
- Not Seen item ห้ามถูกนำมาเป็นคำถามใน Practice หรือ Review
- การเลือก scope ที่ไม่มี Learned item ต้องแสดง Empty State พร้อมทางไปเรียน

## รูปแบบการฝึก

### User-Directed Practice

ผู้เรียนเลือกสิ่งที่ต้องการฝึกจากเนื้อหาที่ Learned แล้วและเริ่ม Practice ได้โดยตรง ระบบต้องเคารพ scope ที่ผู้เรียนเลือกและไม่เพิ่ม Not Seen item เข้า session

### System-Directed Review

Review เป็นเส้นทางแยกจาก Practice และระบบใช้ Learning History/AttemptEvidence/KnowledgeState เป็นหลักฐานหาเนื้อหาที่ควรกลับไปฝึก กติกาคิวที่สรุปไว้คือ item ที่คำตอบล่าสุดผิด หรือคำตอบล่าสุดถูกแต่ confidence เป็น “ต้องคิด” หรือ “เดา” ควรอยู่ในคิว; คำตอบล่าสุดถูกและ confidence “ง่าย” ให้ออกจากคิว ขอบเขตนี้ไม่ได้กำหนด scheduled interval หรือ final mastery algorithm

## Learning data และ source of truth

- **ItemExposure** — หลักฐานว่า item ถูกเห็นผ่าน Learn activity; ใช้ตัดสิน Seen/Learned
- **LearningAttempt** — หลักฐานคำตอบที่ส่งใน Practice รวม input, correctness, completion status, confidence และเวลา; คำตอบถูกเป็น Pending จนกว่าจะเลือก confidence ส่วนคำตอบผิด Completed ได้ทันที
- **AttemptEvidence** — ผลวิเคราะห์ของ Attempt แยกตาม dimension รวมทุกมิติที่พบว่าผิด
- **KnowledgeState** — สถานะสรุปที่ derive จาก Learning History ไม่ใช่ source evidence ที่แก้แยกจาก history
- **PracticeSession** — รอบฝึกและสถานะการทำต่อ/จบ
- **SessionItem** — item และ question snapshot ตามลำดับใน PracticeSession

Learning History เป็น source evidence; KnowledgeState เป็น derived state จาก exposure, attempts และ evidence การ import Legacy Progress ห้ามสร้าง exposure หรือ Attempt ที่ไม่เคยเกิดขึ้น

## Diagnosis และ feedback

การวิเคราะห์ข้อผิดพลาดรองรับ dimensions ต่อไปนี้:

- Word Recall
- Artikel
- Spelling
- Verb Form
- Grammar
- Sentence Structure
- Application

เมื่อผู้เรียนตอบผิด ระบบให้ immediate corrective feedback พร้อมคำตอบ/เนื้อหาที่ถูกและเก็บ error dimensions ทั้งหมดที่เกี่ยวข้อง เมื่อผู้เรียนตอบถูก ระบบถาม confidence:

- ง่าย
- ต้องคิด
- เดา

Response Time ถูกตัดออกจาก MVP และไม่ใช่ learning evidence; ไม่มี time limit และระบบไม่จับเวลา/สร้าง pause-resume timer

## Error feedback และ relearning

ข้อผิดพลาดต้องบันทึกเป็น LearningAttempt และ AttemptEvidence ก่อนสรุปผล ผู้เรียนเห็น feedback ทันทีและสามารถกลับมาฝึกเนื้อหานั้นภายหลังผ่าน Practice หรือ Review ได้ Practice ไม่บังคับ Learn ซ้ำสำหรับ Learned item การลองฝึกใหม่เป็นหลักฐานใหม่ใน Learning History; ห้ามเขียนทับหรือนับ attempt เก่าเป็นผลใหม่

## Session persistence และ summary

- PracticeSession และ SessionItem ต้อง persist เพื่อให้เปลี่ยนหน้า/เปิดใหม่แล้วทำต่อได้
- Incomplete Practice Session ต้อง resume ได้ พร้อมตำแหน่งปัจจุบันและคำถามที่สร้างไว้
- Attempt ที่ส่งแล้วต้องคงอยู่; คำตอบถูกที่ยังไม่เลือก confidence เป็น Pending และต้อง resume กลับมาที่ขั้นเลือก confidence ของข้อเดิมโดยไม่ถามซ้ำ
- Pending correct attempt ไม่ถูกนำไปใช้ใน Review, Progress หรือ KnowledgeState; เมื่อเลือก `easy`, `thought` หรือ `guess` จึงเป็น Completed และใช้เป็น evidence ได้; incorrect attempt เป็น Completed ทันที
- Response time ไม่ถูกใช้ใน Review, Progress, KnowledgeState หรือเป็น learning evidence; field เก่าคงไว้ได้เพื่อ compatibility
- Session Summary ใช้ first-attempt score เท่านั้น; การลองใหม่เป็น attempt ใน session ใหม่ ไม่เปลี่ยนคะแนนครั้งแรก

## Progress

Progress ต้องมาจาก Learning History และ KnowledgeState จริง เช่น Seen/Exposure, attempts, correctness และ dimension evidence ไม่ใช้ completion percentage เป็นตัวแทนการเรียนรู้ และไม่อนุมานว่า content ที่มีอยู่ถูกเรียนแล้ว

## MVP scope

MVP ครอบคลุม Learn → persist Seen/Learned → Practice เฉพาะ Learned items → submit Attempt → save AttemptEvidence → update derived KnowledgeState → แสดง Progress จากหลักฐานจริง รวมถึงการคงและ resume incomplete session

บัญชีและ Supabase เดิมคงไว้ โดยเพิ่ม persistence ของ learning history/session ในฐานข้อมูลเดิม; การใช้งาน flow ใหม่ต้องมี migration ที่เกี่ยวข้องในฐานข้อมูล

## Later / Future — ยังไม่ทำใน MVP

- AI PDF/Image extraction
- Pronunciation assessment
- Speech input
- Full account/cloud sync beyond the selected existing Supabase persistence
- Multi-user/shared content
- Admin system
- Final review/mastery algorithm และ scheduled review intervals

รายการ Later/Future นี้เป็นขอบเขตที่เลื่อนไว้ ไม่ใช่ requirement ให้ implement ในงาน MVP ปัจจุบัน
