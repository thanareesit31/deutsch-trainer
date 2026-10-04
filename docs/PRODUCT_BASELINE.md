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
- หน้า Learn → Wortschatz ของ Lektion 1 มีทางเข้า Das Alphabet และ WORTSCHATZ (จับคู่คำกับภาพ); ไม่แสดงชุดกิจกรรมที่ให้ผู้เรียนนึกหรือพิมพ์คำจากความหมาย
- กิจกรรมนึกคำจากคำใบ้/ความหมายและเติมคำตามบริบทอยู่ใน Practice; สถานะของการ์ด WORTSCHATZ มาจากข้อมูลการจับคู่ภาพเท่านั้น
- Vocabulary nouns เรียนรูป Artikel + Nomen พร้อม plural เมื่อมีข้อมูล; ประเภทคำอื่นแสดง metadata ตามความเหมาะสม
- Lektion 1 → Wortschatz → Das Alphabet สอน 30 ตัวอักษรใน 6 กลุ่มจาก content configuration โดยสลับ Listen and Choose กับ Find Sound; กลุ่มเป็น implementation detail ไม่มีหน้าจบคั่น และไม่มีคะแนนหรือ mastery data
- Alphabet item จะเป็น Learned หลังผู้เรียนเลือกคำตอบถูก; learned IDs แยกจาก resume position ซึ่งระบุตัวถัดไปที่ควรเรียน และการ revisit ไม่ลด resume position
- เสียงสังเคราะห์ตัว C ใช้คำอ่าน “Ceh” เพื่อให้ผู้เรียนทดลองฟังเทียบเสียง
- เสียงสังเคราะห์ตัว E ใช้คำอ่าน “Eh” ซึ่งใกล้เคียงเสียงที่ผู้ใช้ต้องการที่สุดจากตัวเลือกที่ลอง
- เสียงสังเคราะห์ตัว Ö ใช้ข้อความ “öh” ตัวพิมพ์เล็ก เพื่อให้ browser voice ออกเสียงสระโดยตรง
- เสียงสังเคราะห์ตัว F ใช้รูปสะกดช่วยออกเสียง “Äff” เพื่อให้เป็นเสียงพยางค์เดียว ไม่อ่านชื่อ E และ F แยกกัน
- แจ้งผู้เรียนว่าเสียงสังเคราะห์ Alphabet อาจแตกต่างกันตามเครื่องและเบราว์เซอร์; ข้อความนี้เป็นข้อมูลประกอบ ไม่ใช่ error และใช้สีข้อความกลาง
- Alphabet learning state prototype อยู่ใน localStorage แยกจาก Progress mastery; หลังครบ 30 ตัวให้เปิด Alphabet Board ที่กดเล่นเสียงแต่ละตัวได้
- Alphabet Board มีทางย้อนกลับไปตัวอักษรที่เพิ่งเรียนจบเพื่อดู/ฟังซ้ำ โดยไม่แก้ learned state หรือ resume position และมีปุ่ม “เรียนคำศัพท์ต่อ” ไปหน้า Begrüßung ซึ่งเป็นหน้าแรกของการจับคู่ภาพ และ “แบบฝึกหัด” ไปหน้า Practice คำศัพท์ของบทเดียวกัน
- Alphabet Board ให้เริ่มเรียนซ้ำตั้งแต่ A ได้โดยสมัครใจผ่านปุ่ม “เรียนซ้ำ”; การเรียนซ้ำเป็นรอบเพิ่มและต้องคง learned IDs กับ resume position เดิมไว้
- การ์ด Das Alphabet แสดงป้าย “เรียนแล้ว” เมื่อครบทุกตัว และเปลี่ยนเป็น “เรียนซ้ำ” ระหว่าง replay โดยไม่เปลี่ยน learned state
- ตำแหน่งตัวอักษรระหว่าง replay ที่เริ่มจาก Board คงอยู่เมื่อออกจากหน้าแล้วกลับมา โดยแยกจาก resume position สำหรับเนื้อหาที่ยังไม่เคยเรียน
- Lektion 1 → Wortschatz มีหัวข้อย่อย “คำศัพท์หลัก” เป็นบทจับคู่คำกับภาพ 5 หมวด รวม 30 รายการ เรียงหน้าตามนี้: “คำทักทาย” 4 คำ (ขึ้นต้น Hallo แล้วตามด้วย Guten Morgen, Guten Tag, Guten Abend), “คำบอกลา” 3 คำ, “ชื่อ-สกุล” 3 คำ (der Name, der Vorname, der Familienname), “ประเทศ” 15 คำ (Frankreich, Australien, Thailand, Japan, China, Österreich, die Türkei, Spanien, die USA, Deutschland, Italien, die Schweiz, Laos, Eritrea, Argentinien) และ “ความรู้สึก” 5 คำ (gut, sehr gut, super, es geht, nicht so gut); แต่ละหมวดอยู่คนละหน้าและปลดล็อกหน้าถัดไปหลังจับคู่หมวดปัจจุบันครบ; หมวดประเทศใช้ธงเป็นภาพจับคู่ ส่วนหมวดอื่นใช้ภาพประกอบ; เมื่อจับคู่หมวดครบแสดงปุ่ม “เรียนซ้ำ” เพื่อเริ่มจับคู่หมวดนั้นอีกครั้ง โดยไม่เปลี่ยนสถานะที่เรียนแล้ว; ในหน้าคำทักทาย Guten Morgen แสดงอาทิตย์ขึ้น, Guten Tag มีอาทิตย์สูงกลางฟ้า, Guten Abend มีอาทิตย์ใกล้ตก และภาพสลับตำแหน่ง; ไม่แสดงข้อความแจ้งว่าจับคู่ครบ; มีปุ่ม “ย้อนกลับ” และปุ่ม “ไปต่อ” ที่ไม่ระบุชื่อหมวดถัดไป; แสดงชื่อหมวดภาษาเยอรมันเหนือชื่อไทย; ผู้เรียนเลือกคำหรือภาพก่อนก็ได้โดยไม่มีข้อความแนะนำ; ตอบผิดแสดง “ลองใหม่” โดยไม่ให้คะแนน; ตอบถูกย้ายภาพและคำไปการ์ดคู่แนวตั้ง และแสดงคำแปลไทยกับคำอ่านในวงเล็บ โดยไม่ติดป้าย “เรียนแล้ว” บนภาพหรือคำ ไม่มีปุ่มเสียง
- การ์ดทางเข้ากิจกรรมจับคู่ภาพแสดง eyebrow “BILDER”, ชื่อ “WORTSCHATZ” และคำอธิบาย “เรียนรู้คำศัพท์ประจำบท”
- สถานะของกิจกรรมจับคู่ภาพเก็บใน localStorage แยกจากสถานะ Alphabet; การถอดชุดกิจกรรมนึกคำออกจากหน้า Learn ต้องไม่ลบหรือเปลี่ยนสถานะจับคู่ภาพ
- ปุ่มย้อนกลับและไปต่อในกิจกรรม Alphabet อยู่ใต้เนื้อหากิจกรรมในตำแหน่งเดียวกัน
- Alphabet symbols, canonical order, pronunciation reference และ set membership อยู่ใน content layer แยกจาก vocabulary items ที่นับใน Practice/Progress
- กิจกรรม Find Sound ของ Ü แสดงคำแนะนำว่าให้ออกเสียงคล้าย “อือ” โดยห่อริมฝีปากเป็นรูป “อู”
- กิจกรรม Find Sound ของ Ö แสดงคำแนะนำว่าให้ออกเสียงคล้าย “เออ” โดยห่อริมฝีปากเป็นรูป “โอ”
- กิจกรรม Find Sound ของ Ä แสดงคำแนะนำว่าให้ออกเสียงคล้ายสระ “แอ”
- กิจกรรม Find Sound ของ ß แสดงคำแนะนำว่าให้ออกเสียงเป็น “ส” ไม่ก้อง เหมือน ss (scharfes S)
- หน้ากิจกรรม Vocabulary Learning ไม่แสดง Developer Debug panel หรือปุ่ม reset ข้อมูลแก่ผู้เรียน
- การดู catalog, เข้า Practice, นำเข้าข้อมูลเก่า หรือมี content ในระบบ ไม่สร้าง Learned state
- Vocabulary noun เรียนเป็น **Artikel + Nomen**

### Practice gating

- สำหรับ flow ที่ใช้ ItemExposure, Learned item เข้า Practice หรือ Review ได้ทันที โดยไม่ต้องกลับไป Learn ซ้ำ
- Vocabulary eligibility มาจากการเรียนเนื้อหาใน Learn; สำหรับ WORTSCHATZ ของ Lektion 1 การจับคู่คำกับภาพสำเร็จคือหลักฐานว่าเรียนคำนั้นแล้ว และคำนั้นพร้อมเข้า Practice
- Not Seen item ห้ามถูกนำมาเป็นคำถามใน Practice หรือ Review; Practice ใน prototype รอบนี้ยังไม่เชื่อม vocabulary learning state ใหม่
- การเลือก scope ที่ไม่มี Learned item ต้องแสดง Empty State พร้อมทางไปเรียน

## รูปแบบการฝึก

### User-Directed Practice

ผู้เรียนเลือกสิ่งที่ต้องการฝึกจากเนื้อหาที่ Learned แล้วและเริ่ม Practice ได้โดยตรง ระบบต้องเคารพ scope ที่ผู้เรียนเลือกและไม่เพิ่ม Not Seen item เข้า session

### System-Directed Review

Review เป็นเส้นทางแยกจาก Practice และระบบใช้ Learning History/AttemptEvidence/KnowledgeState เป็นหลักฐานหาเนื้อหาที่ควรกลับไปฝึก กติกาคิวที่สรุปไว้คือ item ที่คำตอบล่าสุดผิด หรือคำตอบล่าสุดถูกแต่ confidence เป็น “ต้องคิด” หรือ “เดา” ควรอยู่ในคิว; คำตอบล่าสุดถูกและ confidence “ง่าย” ให้ออกจากคิว ขอบเขตนี้ไม่ได้กำหนด scheduled interval หรือ final mastery algorithm

## Learning data และ source of truth

- **ItemExposure** — legacy learning evidence ที่ระบบเดิมใช้ตัดสิน Seen/Learned; ไม่ใช่ source ของ `learningCompleted` ใน Vocabulary Learning prototype
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
