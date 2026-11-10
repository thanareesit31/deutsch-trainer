# ปรับแบบฝึกบท 15–18 ตามผลประเมิน

วันที่ 10 พฤศจิกายน 2026. ใช้ design-adaptive-learning, build-phrase-practice และ figure-it-out สำหรับงานหลายส่วน โดยรักษาเส้นทาง/คำตอบ/คิวที่เผยแพร่แล้วทั้งหมด

## ขอบเขตและเกณฑ์เสร็จ

- คลังเดิม372ข้อ/12หมวดคง ID, version, acceptedAnswers, requiredCardIds และ canonical question definitions เดิม byte-for-byte ในข้อมูล JSON ที่ตรวจเทียบได้
- เพิ่มบริบทและขั้นฝึกแบบมีคำให้ → เติมส่วนที่กำหนด → เขียนประโยคตามข้อมูล เฉพาะงานที่ตรวจคำตอบแบบจำกัดขอบเขตได้ ไม่เรียกว่าวัดการผลิตภาษาอิสระ
- ครอบคลุมบทสนทนา32ชุดและไวยากรณ์7หัวข้อ ด้วยสถานการณ์ที่ประพันธ์เพิ่ม มีคำแปล/ข้อมูลพอตอบ/เฉลยและเสียงจริง ระบุ provenance เป็น product-authored ใน metadata เท่านั้น
- แยกหลักฐาน word meaning, Artikel, spelling, supplied-word order, dialogue response และ bounded production. งานใหม่ไม่เปลี่ยนความหมายหลักฐานเก่า
- รอบแนะนำผสมข้อใหม่ จุดอ่อน และข้อถึงทบทวน สูงสุด10เป้าหมายไม่ซ้ำ ใช้แผนเดียวในหน้าแรก/ทางฝึก รักษารอบที่เริ่มแล้ว
- ตัวช่วยและคำตอบแรกคงอยู่ข้ามอุปกรณ์ เฉลยชี้ข้อผิดของคำตอบนั้น ไม่แสดงโครงสร้างก่อนตรวจหรือเปิดตัวช่วย
- ตรวจฐานข้อมูลจริงจำลอง/RLS, คิวเก่า, eligibility/ระดับ/ตัวช่วย, หน้าจริง375/390/1360, production build และ rollout สำหรับบัญชีทั่วไป

## แผนการวัดผลและนโยบาย

Task.practice = {familyId, contextId, stage:0|1|2|3, unlock:null|{subskill,minCorrectContexts,minPracticeSessions,requiresAttempt}}. stage0เดิม, stage1บริบทใหม่ในทักษะเดิม, stage2bounded productionพร้อมโครง, stage3bounded productionไม่มีคลังคำ. แต่ละข้อมี difficultyRationale/assistanceตามงานจริง

- บริบทใหม่เปิดหลังเคยลองเป้าหมาย/ทักษะพื้นฐานนั้น ไม่ใช้การเห็นตัวอย่างแทนการตอบ
- ขั้นผลิตแบบมีโครงเปิดจากคำตอบแรกที่ถูกโดยไม่เปิดตัวช่วยใน2บริบทและ2รอบ Practice ของทักษะพื้นฐาน ระดับเรียกคืนเปิดหลังหลักฐานเช่นเดียวกันใน bounded production
- เป็นนโยบายผลิตภัณฑ์เบื้องต้น ไม่ใช่ผลวิจัยหรือการรับรองความชำนาญ ความสำเร็จในรอบเดียวไม่พอเลื่อนระดับ
- ใช้ first response ต่อ task/session และล่าสุดต่อ context เพื่อให้ผู้ที่เคยผิดยังพัฒนาได้ ข้อเดิมซ้ำไม่เพิ่มจำนวนบริบท เก็บ first-ever history เดิมไว้
- งานที่มีตัวช่วย/ไม่ทราบตัวช่วยไม่นับเป็น independent evidence. ข้อที่ผิดล่าสุดเลือกการฝึกที่มีการช่วยมากขึ้นได้ แม้เคยปลดระดับสูงแล้ว; คิวเก่าไม่ถูกล็อกย้อนหลัง
- ความต้องการใช้สี/ลูกศรและประโยคแถวเดียวบนมือถือคงเดิม เก็บผลการอ่านได้เป็นข้อสังเกต ไม่อ้างว่าทดลองกับผู้เรียนแล้ว

## ลำดับงานและการตรวจ

1. [x] อ่านมาตรฐาน/Principles และเก็บ baseline ก่อนแก้
2. [x] ประพันธ์บริบท/คำตอบ/ตัวลวง/ข้อผิด/สื่อ แยกไฟล์และ worktree ตามหมวด
3. [x] เพิ่ม metadata/gates และตัวเลือก round ที่ผสมสัดส่วน ตรวจด้วย synthetic histories ที่มีความหมาย
4. [x] เชื่อม feedback และการพิมพ์แบบจำกัดขอบเขตกับ shared account sessions; เพิ่ม server validation ของ unlock
5. [x] ตรวจ compatibility และทดลองหน้าจริง/มือถือ/เสียง พร้อม reviewer แยกจากผู้ทำ
6. [ ] Apply migration ใหม่ก่อน frontend, deploy และตรวจ normal-account hosted routes

Learn→card exposure/trial→immutable response+help→shared Practice firsts grouped target/subskill/context/session→stage eligibility+balanced round→saved selection reason. Missing evidence remains unknown. Existing schemas/IDs are not silently replaced.

Decision trail: .audit/practice-improvement.tsv

## หลักฐานการตรวจที่ทำซ้ำได้

- `tests/a13-practice-improvement.test.ts` เทียบ SHA256 เนื้อหาทั้งข้อเดิม372ข้อกับ `.audit/practice-published-baseline.tsv` และตรวจรอบผสม การปลดขั้น การกลับมาฝึกหลังผิด และขอบเขตช่องเขียน
- `tests/release-practice-progression-database.mjs` ตรวจฐานข้อมูลจริงจำลอง การดู/ลองตอบ บริบท/รอบอิสระ ตัวช่วย คิวเดิม การปลอมคำตอบ และการแยกบัญชี
- `tests/practice-improvement-browser.mjs` ขับหน้าจริงผ่าน shared RPC ของบัญชีทดสอบเฉพาะเครื่อง ตรวจขั้นเขียน2/3ของหมวดประโยค/ไวยากรณ์ ร่างข้ามโหลดหน้า เฉลยหลังตอบ และ viewport375
- `tests/practice-improvement-layout-browser.mjs` ตรวจ475ตัวอย่างที่ไม่ซ้ำจากหน้าสอนและเฉลย375/390/1360 ทุกประโยคครบแถว ไม่มีคำล้นกรอบ. ประโยคยาวที่สุดยังต้องย่อตัวอักษรถึง9.8pxที่375 จึงไม่อ้างว่าการอ่านได้ผ่านการทดสอบผู้เรียนแล้ว
- Audio builder ตรวจ224asset references มี185ไฟล์ใหม่และ39ไฟล์เดิมที่ใช้ซ้ำ โดยไม่เขียนทับ canonical registry/เสียงเดิม

แผนนี้ไม่รวมการทดลองผลการเรียนกับผู้ใช้จริง. การทบทวน24ชั่วโมงและเกณฑ์2บริบท/2รอบเป็นนโยบายเริ่มต้นที่ปรับได้จากหลักฐานภายหลัง.
