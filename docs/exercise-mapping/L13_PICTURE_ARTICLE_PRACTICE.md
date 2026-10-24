# ดูภาพแล้วเลือก Artikel บท 13

เพิ่ม 24 ตุลาคม 2026 ตาม `TARGET_AND_SUBSKILL_ADAPTIVE_LEARNING`.

## เป้าหมายและขอบเขต

ใช้คำนามเอกพจน์ 25 คำที่มีภาพใน `l13VocabularyImageEntries` ซึ่งใช้เรียนในบท 13 อยู่แล้ว. ชื่อคำนามที่ไม่มี Artikel แสดงคู่กับภาพ เพื่อระบุเป้าหมายให้แน่นอน โดยเฉพาะ Geschäft/Laden ที่ความหมายภาพทับซ้อนกันแต่ Artikel ต่างกัน. ไม่แสดงจุดสีของคำเป้าหมายก่อนตรวจ. ตัวเลือก der/die/das ทุกตัวมีสีตามมาตรฐานเดียวกัน และ legend ค้างด้านบน.

โจทย์ใหม่เป็นงานออกแบบของโปรเจกต์จากคำขอผู้ใช้และภาพอ้างอิงรูปแบบ ไม่คัดภาพหน้าจอมาเป็น asset และไม่อ้างว่าเป็นข้อจากหนังสือ. ใช้ไฟล์ภาพบท 13 ที่มีอยู่แล้วและคำพร้อม Artikel จากรายการเรียน. Metadata รายข้ออยู่ใน `l13-vocabulary-challenge-sources.json`.

## แผนการวัด

| ข้อมูล | การใช้จริง |
| --- | --- |
| Target IDs | Item IDs ของคำนามภาพ 25 คำจากบทเรียน |
| Task/response IDs | `picture-article-` ตามด้วย item ID; รุ่น 1 |
| Subskill | `vocabulary_article` เท่านั้น ไม่เพิ่มผลการจำความหมาย |
| Required learning | คำที่เรียนแล้วของบัญชีแต่ละคำ; ไม่มีการปลดล็อกเพราะเป็น tester |
| Difficulty | ระดับ 2 ของคลังนี้ เป็นการเลือก Artikel ของคำที่ระบุพร้อมภาพ; ไม่เทียบกับคะแนนความสามารถผู้เรียนโดยอัตโนมัติ |
| Assistance | `image-and-noun-no-article`: ให้ภาพและรูปคำ แต่ไม่ให้ Artikel หรือสีของคำเป้าหมาย |
| Scoring | เลือก der/die/das ตรงกับคำที่ระบุ ตรวจครั้งแรกเป็นหลัก |
| Feedback | คำเยอรมันเต็มพร้อม Artikel/จุดสี ความหมายไทยและเพศของคำนาม หลังตรวจ |

คำตอบแต่ละรายการบันทึก assessment ประกอบด้วย targetId, subskill, taskVersion, difficulty และ assistance ลงใน state ของบัญชี. การอ่านกลับตรวจ binding เทียบกับนิยามโจทย์ ไม่แปลงผลเก่าหรือผลรูปแบบดูภาพเลือกชื่อให้กลายเป็นหลักฐาน Artikel.

## ทางเข้าและประวัติ

มีทางเข้าเฉพาะ `/practice/L13/vocabulary/picture-article` จากหน้าหมวดคำศัพท์. รอบเฉพาะเก็บเป็น `articleRound` ใน lesson-state key เดิม `deutsch-trainer-vocabulary-challenge-v1-L13`; รักษารอบคละและร่างเดิมใน `round`. คำตอบและประวัติแยกตามบัญชีและใช้ระบบสำรอง/ส่งซ้ำเดิม. แต่ละรอบไม่เกิน 15 กิจกรรม “ฝึกเพิ่ม” เลือกจากคำที่เรียนแล้วและประวัติรอบก่อน. รูปแบบใหม่เข้ารอบคละได้ด้วย. คลังรวม 88 กิจกรรม 109 จุดคำตอบ 8 รูปแบบ.

## สถานะการเชื่อมระบบ

| เส้นทาง | สถานะ |
| --- | --- |
| คำที่สอน → eligibility | ใช้ image learning / exposure เดิม |
| ผลเลือก Article → target/subskill | implemented ใน bank และ assessment ของคำตอบ |
| คำตอบครั้งแรก/ตัวช่วย → บัญชี | implemented ผ่าน lesson state เดิม พร้อม draft และรอบเฉพาะ |
| ประวัติ → คิวรูปแบบนี้ | ใช้คิวระดับกิจกรรมที่มีอยู่ |
| รวมหลักฐานรายคำ/ทักษะ → เลื่อนระดับเฉพาะบุคคล | ยังต้องพัฒนา ไม่อ้างว่า feature นี้เปิด adaptive progression ส่วนกลางแล้ว |
| คำแนะนำหน้าแรก | ยังไม่แนะนำรอบเฉพาะนี้; มีทางเข้าจากหน้าหมวดคำศัพท์ |

ขั้นถัดไปของทักษะ Artikel อาจเป็นการตอบโดยลดตัวเลือกหรือใช้คำในบริบท แต่ต้องมีนโยบายหลักฐานและตัวเลือกโจทย์รองรับก่อนเปิดเลื่อนระดับจริง. งานนี้ไม่เปลี่ยนผลเก่าหรือ main Progress.

ผลตรวจ: typecheck ผ่าน; audit ตรวจ Artikel และภาพครบ 25 คำเทียบกับ catalog; unit checks ตรวจการเก็บรอบเฉพาะพร้อมรักษารอบคละและการอ่าน assessment กลับ. ตรวจบนเว็บครบ 25 เป้าหมายผ่านสองรอบ รวมการตอบผิดครั้งแรก การกลับมาจากร่างตัวเลือก การเก็บ binding เฉพาะ Artikel และการแสดงผลมือถือ โดยไม่พบข้อผิดพลาดหน้าเว็บหรือบันทึก. คืนสถานะบัญชีทดสอบเดิมหลังตรวจ.

## No confidence controls, 2026-10-25

Practice does not ask for confidence or show easy/thought/guess or not-sure buttons. Checked answers complete immediately: answer, read feedback, continue. New confidence remains unknown, never easy or mastery. Preserve historical ratings and first answers for compatibility. Resume old pending answers at feedback without answering again. Use first-answer correctness, assistance and independent evidence across formats/days to choose practice.
