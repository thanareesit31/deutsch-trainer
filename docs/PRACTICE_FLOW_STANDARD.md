# ระบบฝึกต่อเนื่องและแนะนำการฝึกเฉพาะบุคคล

รหัสมาตรฐาน: `GUIDED_AND_PERSONALIZED_PRACTICE`
ปรับปรุง: 27 ตุลาคม 2026

ข้อกำหนดกลางเพิ่มเติม 24 ตุลาคม 2026: ใช้ `docs/ADAPTIVE_LEARNING_STANDARD.md` และสกิล `.agents/skills/design-adaptive-learning/SKILL.md` ร่วมกันทุกครั้งที่สร้างหรือแก้บทเรียนและแบบฝึกหัด. ทางเข้าหลังเรียนและการจัดรอบในเอกสารนี้ต้องผูกกับเป้าหมาย ทักษะย่อย และหลักฐานของผู้เรียน. การคละรูปแบบหรือเรียงง่ายไปยากอย่างเดียวไม่ใช่ adaptive progression. กฎเดิมที่ใช้ผลล่าสุดต่อ question ID เป็นแนวทางของต้นแบบ; ระบบวิเคราะห์ที่ขยายต่อไปต้องรวมหลักฐานผ่าน target/subskill โดยรักษารุ่นและคำตอบเดิม ไม่สรุปความสามารถทั้งเป้าหมายจาก question ID เดียว.

แนวทางร่วมสำหรับทุกบทและทุกทักษะของโปรเจกต์. การเปิดใช้งานต้องมีคลังโจทย์ที่เหมาะกับบทและข้อมูลการฝึกที่ตรวจได้. ไวยากรณ์บท 13 เปิดให้บัญชีผู้เรียนทั่วไป; ตั้ง `NEXT_PUBLIC_L13_GRAMMAR_PRACTICE=false` เพื่อปิด. คำศัพท์และประโยคสำนวนบท 13–14 เปิดให้บัญชีผู้เรียนใน production โดยค่าเริ่มต้น; ตั้ง flag ของคลังเป็น `false` เพื่อปิด หรือใช้ `true` ใน development. ผลฝึกบันทึกเข้าบัญชีและมีสำรองในเบราว์เซอร์; ยังไม่ได้เปิดระบบแนะนำทุกหมวดหรือเชื่อม Progress หลัก.

As of 29 October 2026, L14 grammar also uses this flow for signed-in learners. Its guided round has two topics with five responses each. A returning learner resumes an unfinished round or receives up to 10 history-selected responses from the 100-response L14 grammar bank. The server validates grammar question definitions and learned-target eligibility for L13 and L14. Results remain separate from main Progress; this does not extend grammar practice to L15–L18.

## ทางเข้าหลังเรียน

แบบฝึกคำศัพท์บท 13–14 แสดงปุ่มฟังเสียงเฉพาะในเฉลยหลังตรวจคำตอบ ทั้งตอบถูกและตอบผิด. อ่านคำนามพร้อม Artikel โดยใช้ระบบเสียงเยอรมันเดิม; คำที่ไม่ใช่คำนามอ่านตามคำเฉลย. เรื่องสั้นและปริศนาให้ฟังแต่ละคำที่เฉลยได้. ในแบบฝึกที่แสดงผ่าน iframe ให้เริ่มเล่นเสียงโดยตรงจากการแตะภายใน iframe เพื่อให้เบราว์เซอร์มือถือรับรู้ user activation. ไม่เล่นอัตโนมัติ และการฟังหลังตรวจไม่เปลี่ยนคำตอบแรกหรือถูกนับเป็นความช่วยเหลือก่อนตอบ.

เมื่อเรียนจบหมวด ปุ่ม “ทำแบบฝึกหัด” เปิดข้อแรกของหัวข้อแรกทันที. ค่าเริ่มต้นสำหรับโจทย์สั้นคือหัวข้อละ 5 ข้อ เรียงตามหัวข้อที่เรียน. ในบท 13 มี Es gibt, Dativ และ Verben รวม 15 ข้อ. ในแต่ละหัวข้อมีทั้งเลือกคำ พิมพ์ และเรียงคำตามคลังที่รองรับ.

เมื่อเริ่มจากหน้าบทเรียน ให้ทำต่อเนื่องผ่านทุกหัวข้อในรอบเดียวโดยไม่หยุดที่หน้าคั่นหรือหน้าผลระหว่างหัวข้อ. แถบความคืบหน้าแสดงจำนวนข้อรวม และหัวข้อปัจจุบันอยู่ด้านบน. ไม่บังคับตอบถูกทั้งหมดเพื่อไปต่อ. หยุดกลางทางและกลับมาทำต่อได้โดยคงโจทย์ ตัวเลือก ร่างคำตอบ และผลเดิม.

เมื่อจบรอบให้แสดงหน้าจอสั้น ๆ พร้อม “ฝึกหัวข้อถัดไป”, “ฝึกเพิ่ม” และ “จบ”. ไม่แสดงคะแนน ตารางผล หรือรายการคำตอบบนหน้าจอนี้; บันทึกคำตอบและผลรายข้อไว้ในประวัติเพื่อใช้วิเคราะห์และแนะนำการฝึกภายหลัง. ทำครบหมายถึงจบรอบ ไม่ใช่ผ่านการรับรองความชำนาญ.

## ออกแบบโจทย์ประโยคและสำนวน

ใช้หัวข้อและประโยคที่ผู้เรียนพบในบทเป็นเป้าหมายของโจทย์. หนึ่งข้อควรวัดการใช้ประโยคหรือสำนวนในบริบทที่มีความหมาย ไม่ใช่นำประโยคเดิมมาเปลี่ยนรูปแบบคำถามหลายครั้งเพื่อเพิ่มจำนวน. กระจายเป้าหมายไปยังประโยคและสถานการณ์ที่แตกต่างกันเท่าที่เนื้อหาที่เรียนรองรับ. อย่าฝืนให้ครบจำนวนด้วยประโยคซ้ำหรือตัวลวงที่ข้อมูลไม่พอ.

เรียงกิจกรรมจากจำแนกและเข้าใจ ไปสู่การเลือกคำตอบที่เข้ากับบทสนทนา แล้วจึงสร้างประโยคด้วยคำที่ให้หรือเรียงคำ. ใช้เฉพาะรูปแบบที่เหมาะกับเนื้อหาของหัวข้อนั้น. การเรียงบทสนทนาหลายช่วงและการแต่งคำถามตอบกลับเป็นกิจกรรมขั้นสูง แยกจากรอบพื้นฐาน; ต้องมีข้อมูลบทสนทนาที่ต่อเนื่องหรือข้อกำหนดการสื่อสารเพียงพอ.

โจทย์ถามและตอบต้องแสดงบริบทที่จำเป็นเพื่อให้คำตอบมีเหตุผลชัดเจน. ถ้าโจทย์ขึ้นกับข้อเท็จจริง ให้ระบุข้อเท็จจริงนั้นในสถานการณ์. ห้ามคาดหวังให้ผู้เรียนเดาข้อมูลที่ไม่ได้ให้. ในโจทย์จับคู่ แสดงความสัมพันธ์ของคู่ให้เห็นชัดหลังเลือก และตรวจ/บันทึกผลแยกเป็นรายคู่; ถ้ากิจกรรมต้องใช้คู่ครบ ให้คงคู่ไว้ด้วยกันเมื่อเลือกชุดทบทวน.

แสดงคำแปลไทยของคำถามและคำตอบหลังตรวจ. เพิ่มคำอธิบายภาษาไทยเฉพาะเมื่อให้เหตุผลหรือกฎที่คำแปลยังไม่บอก; ไม่ต้องมีบรรทัดอธิบายที่เพียงถอดความคำถามและคำตอบซ้ำ. เมื่อรูปประโยคมีโครงสร้างที่ผู้เรียนอาจสับสน ให้ชี้ส่วนสำคัญอย่างสั้น ๆ. คำแปลรายคำให้เปิดจากคำที่ผู้เรียนชี้หรือโฟกัส แยกจากคำแปลทั้งประโยค.

คำสั่งของกิจกรรมให้แสดงครั้งเดียว. ถ้าป้ายหรือหัวข้อบอกแล้วว่าต้องทำอะไร เนื้อหาโจทย์ให้เริ่มจากบทสนทนา/ประโยค/ข้อมูล ไม่ต้องทวนคำสั่งเดิม.

รายละเอียดเฉพาะบท เช่น จำนวนข้อ, รายการประโยคที่ครอบคลุม, สัดส่วนรูปแบบกิจกรรม และเงื่อนไข exposure ต้องบันทึกในเอกสารการฝึกของบทนั้น. หลักการส่วนนี้ใช้เป็นเกณฑ์ออกแบบและทบทวน ไม่ได้หมายความว่าทุกบทต้องมีโจทย์ชุดเดียวกัน.

## กลับมาฝึกด้วยตนเอง

หน้าแรกแสดงคำแนะนำจากประวัติของบัญชีนั้น; หน้ารวมแบบฝึกหัดแสดงการเลือกระดับและบทโดยตรง ไม่แสดงการ์ดคำแนะนำซ้ำ:

1. ถ้ามีรอบค้าง ให้ “ทำต่อจากครั้งก่อน” เป็นทางหลัก พร้อมกลับถึงหัวข้อและจุดพักเดิม.
2. หากยังไม่มีผลฝึก ให้เสนอเริ่มรอบหลังเรียน โดยไม่อ้างว่ารู้จุดอ่อนของผู้เรียน.
3. หากมีผลแล้ว ให้เสนอ “ฝึกต่อวันนี้” ค่าเริ่มต้น 10 ข้อ พร้อมเหตุผลสั้นที่อิงผลจริง.

หน้ารวมแบบฝึกหัดเริ่มที่ตัวเลือกระดับและบททันที. โครงเลือกระดับ → บท → ทักษะ → หัวข้อคงอยู่. หน้าเลือกหัวข้อไม่ต้องมีกล่องรอบพื้นฐานอีก. การฝึกหัวข้อที่เลือกเองแสดง “ฝึกหัวข้อถัดไป”, “ฝึกเพิ่ม” และ “จบ” เมื่อทำครบ โดยซ่อนตารางผลและเก็บผลรายข้อไว้ในประวัติ. ไม่บังคับให้เรียนใหม่ก่อนกลับมาฝึก.

## หลักฐานและการแนะนำ

Practice does not ask for confidence or show easy/thought/guess or not-sure buttons. Checked answers complete immediately: answer, read feedback, continue. New confidence remains unknown, never easy or mastery. Preserve historical ratings and first answers for compatibility. Resume old pending answers at feedback without answering again. Use first-answer correctness, assistance and independent evidence across formats/days to choose practice.

บันทึก question ID/เวอร์ชัน, หัวข้อ, ทักษะย่อย, รูปแบบคำตอบ, ผลครั้งแรก, เวลา, การดูคำแปล/ตัวช่วย และคำตอบที่เคยเจอ. แยกการเลือกคำออกจากการพิมพ์และการเรียงคำ. การพิมพ์ผิดใน Dativ จึงนำไปแนะนำพิมพ์ Dativ เพิ่ม ไม่สรุปว่าอ่อนทั้งบท. ข้อมูลเก่าที่ไม่เคยบันทึกการใช้คำแปลมีสถานะไม่ทราบ แทนการอ้างว่าทำได้โดยไม่ใช้ตัวช่วย.

ใช้ผลล่าสุดต่อ question ID เป็นหลัก ไม่เพิ่มน้ำหนักด้วยการส่งคำตอบเดิมซ้ำ. ให้ความสำคัญกับทักษะที่ยังผิดหรือใช้ตัวช่วย, ข้อใหม่ที่วัดทักษะเดียวกัน และเรื่องที่เว้นฝึกมาระยะหนึ่ง. ผสมเรื่องที่ทำได้เพื่อคงความหลากหลาย ไม่ให้มีข้อซ้ำในรอบเดียว. แนะนำเฉพาะหัวข้อที่มีหลักฐานว่าเคยฝึกในต้นแบบ; หากไม่มีผลเลย ให้เริ่มรอบพื้นฐาน.

ต้นแบบบท 13 ใช้กฎที่อ่านตรวจสอบได้ใน `src/lib/practice-planner.ts`. ค่าตั้งต้นคือเพิ่มลำดับทบทวนเมื่อเว้น 3 วัน และลดข้อที่เพิ่งตอบถูกในวันเดียวกัน. ตัวเลขเหล่านี้เป็นค่าผลิตภัณฑ์สำหรับทดลอง ไม่ใช่เกณฑ์วิจัยหรือการรับรองความชำนาญ. ไม่แสดงป้าย “อ่อน” หรือคะแนนความชำนาญจากรอบ 5 ข้อ.

## ขยายทุกทักษะ

ใช้ทางเข้าและหลักการคำแนะนำร่วมกัน แต่จำนวนและหน่วยฝึกปรับตามงาน. อ่านและฟังต้องคงบทความหรือเสียงที่ให้บริบทไว้กับคำถาม; งานเขียนอาจใช้จำนวนน้อยกว่า 5 งานและต้องมีเกณฑ์ตรวจที่เหมาะสม. ห้ามสร้างโจทย์หรือหลักฐานประเมินที่ไม่มีอยู่เพื่อให้ครบจำนวนเริ่มต้น.

การขยายระบบจริงต้องเชื่อมกับ exposure และข้อมูลเรียนจริง, ประวัติคำตอบที่มีเวอร์ชัน, การบันทึกบัญชีข้ามอุปกรณ์ และคิวทบทวนเดิม. ห้ามนำผลจากต้นแบบในเบราว์เซอร์ไปรวม Progress หลักโดยอัตโนมัติ. การอ้างอิงแหล่งข้อมูลยังเก็บใน metadata ภายในตาม AGENTS.md.

## UI แบบฝึกประโยคและสำนวน

L13 และ L14 ใช้โครงหน้าร่วมกัน แม้กิจกรรมและระบบบันทึกจะแยกกัน. หน้าเข้าแสดงชุดแนะนำหลักก่อน และเก็บการเลือกหัวข้อไว้ในส่วน “ฝึกเฉพาะหัวข้อ”. หน้าทำโจทย์ใช้ความกว้าง การ์ด แถบความคืบหน้า ขนาดตัวอักษร ปุ่ม และสถานะเฉลยชุดเดียวกัน. เมื่อมีภาพ ให้วางภาพข้างโจทย์และตัวเลือกบนจอกว้าง แล้วเรียงลงบนมือถือ. การจับคู่และเรียงคำคงรูปแบบเฉพาะที่ช่วยให้เห็นความสัมพันธ์หรือแก้ลำดับได้ชัด.

หน้าเข้าฝึกของ L13–L14 แสดงข้อเท็จจริงจากผลฝึกที่บันทึกไว้ เช่น จำนวนข้อที่ตรวจได้และหัวข้อที่เคยตอบผิด; หากยังไม่มีผล ให้บอกตรง ๆ ว่ายังวิเคราะห์ไม่ได้. ห้ามแสดงจุดแข็งหรือจุดอ่อนที่คาดเดาจากการเรียนแล้วหรือจากข้อมูลน้อย. รอบที่เพียงเปิดไว้แต่ยังไม่ตอบหรือแก้ร่างไม่ถือเป็น “แบบฝึกหัดค้าง” สำหรับคำแนะนำ; ถ้ามีหลายรอบ ให้แนะนำรอบที่มีการลงมือทำจริง. หน้าต่าง “ทำต่อ” แสดงจำนวนข้อที่ตรวจแล้วจริง และแสดงเมื่อมีอย่างน้อยหนึ่งข้อที่ตรวจแล้ว; ร่างคำตอบที่ยังไม่ตรวจยังทำต่อได้โดยเข้ารอบนั้นตรง ๆ. ปุ่มยกเลิกเพียงปิดหน้าต่างและไม่ลบรอบ. หน้าจับคู่ให้เลือกจากสองคอลัมน์ เห็นเส้นเชื่อมของคู่ที่เลือก แล้วจัดคำถามและคำตอบไว้แถวเดียวกันหลังตรวจ โดยแสดงผลถูกผิดแยกคู่. หน้าจบรอบแสดงคำแนะนำจากผลที่มีโดยไม่แสดงคะแนนหรือตารางผลตามข้อกำหนดด้านบน.

ก่อนกดตรวจคำตอบ ผู้เรียนเริ่มจับคู่จากกล่องคำถามหรือคำตอบก็ได้ แล้วกดกล่องฝั่งตรงข้ามเพื่อเชื่อมทันที. กล่องที่กำลังเลือกและทุกคู่ที่เชื่อมแล้ว รวมถึงเส้นเชื่อม ใช้เส้นขอบสีเทากลางบนพื้นขาว. กล่องที่ยังไม่จับคู่จะแสดงขอบเข้มเฉพาะเมื่อผู้เรียนกดเลือกเอง; อย่าเลือกกล่องถัดไปให้อัตโนมัติ. ผู้เรียนต้องเปลี่ยนหรือลบคู่ก่อนตรวจได้. ใช้สีถูก/ผิดหลังตรวจคำตอบแล้วเท่านั้น; ห้ามใช้สีเขียวกับคู่ที่ยังไม่ได้ตรวจ.

เฉลยต้องแสดงผลถูก/ผิด คำตอบภาษาเยอรมัน คำแปลไทย และคำอธิบายตามชนิดโจทย์ โดยไม่ซ้ำคำสั่ง. ปุ่มย้อนกลับอยู่ฝั่งซ้าย; ตรวจคำตอบ/ข้อถัดไปอยู่ฝั่งขวา. หน้าจบรอบใช้ปุ่ม “ฝึกหัวข้อถัดไป”, “ฝึกเพิ่ม”, “จบ”. การปรับหน้าตาไม่เปลี่ยน IDs, การให้คะแนน, ลำดับคิว, หรือหลักฐานที่บันทึก.

## การสั่งงานครั้งถัดไป

“ใช้มาตรฐาน GUIDED_AND_PERSONALIZED_PRACTICE กับบท … หมวด … โดยใช้คลังและหลักฐานการเรียนของบทนั้น”

เมื่อเพิ่ม Practice ในบทหรือทักษะใหม่ ให้ตรวจมาตรฐานนี้ร่วมกับ PRODUCT_BASELINE.md แม้ผู้ใช้ไม่ได้พิมพ์ชื่อมาตรฐานซ้ำ.


## Account persistence update, 22 October 2026

L13 tester practice now uses account storage with a local backup, superseding the browser-only description above. Migration: supabase/migrations/20261022000000_practice_account_sessions.sql. RLS restricts reads to auth.uid(); sync_practice_session writes only to the caller's account and locks individual sessions before merging. Old nine-question sessions remain intact. First submitted answers survive stale-device uploads; optional uncertainty may update the same original answer. Completion and forward position cannot regress. Upload changes after 400ms without edits and retry on online/focus. An unsuccessful upload is shown to the learner. Unsent data remains on that device until retry succeeds.

Devices must share a server and account. The local server still follows docs/test-workspace.md, including recovery on normal shutdown. The hosted Supabase database is unchanged. Account sessions remain separate from mastery and Learning History.


## L13 vocabulary implementation, 22 October 2026

Shared implementation now includes tester L13 vocabulary. See docs/exercise-mapping/L13_VOCABULARY_PRACTICE.md for scope, original task provenance and the design decision. Filter targets using actual image learned IDs and ItemExposure before starting a bank. Retain the learning topic groups, and separate meaning, Artikel and spelling evidence. Guided sets use up to five questions per eligible topic; vocabulary daily sets use up to ten. The additional vocabulary topic only joins when its words have been learned. Pending sessions across both skills retain priority, while new daily selection stays within one skill. Account state is shared by registry, with existing grammar keys and IDs preserved.

## L14 vocabulary implementation, 24 October 2026

L14 uses the same learner-facing sequence for its 25 taught words across two image groups and one direction group: after-learning practice starts directly, a returning learner resumes or receives a short daily set, and topic choice remains optional. See `docs/exercise-mapping/L14_VOCABULARY_PRACTICE.md`. The L14 state is account-backed through lesson state and a database allowlist migration; it is separate from L13's server-validated question-session store. The L14 feature flag is scoped to this bank. Do not infer availability for other lessons from this implementation.


## L13 phrases implementation, 22 October2026

See docs/exercise-mapping/L13_PHRASES_PRACTICE.md. Four actual learning groups,29 existing phrases and90 original web tasks. Guided rounds use up to5 questions per eligible group,20 after learning all groups. Use learned ItemExposure for every required phrase; dialogue tasks require both source items. New daily sets stay skill-scoped; resume incomplete sessions across enabled skills. Shared bank metadata controls skill cycle, language, learning/manual/daily links and dialogue units. Existing grammar/vocabulary keys and session IDs are retained.

## L14 phrases implementation, 26 October 2026

L14 uses the same account-backed `learner_practice_sessions` store, `PracticeAccountSync`, immutable first answers and server-validated phrase-question catalog as L13. Its learned-target eligibility source is the L14 phrase-learning result map rather than L13 `item_exposures`; the server checks the appropriate source for each lesson. Old L14 lesson-state sessions are imported into the shared session format on first practice use. Do not write new L14 phrase practice state to `learner_lesson_states`.


## Redemittel L13 topic sequence, 22 October 2026

This replaces the five-stage pilot for newly started L13 phrase rounds. Four learning topics each contain two dialogue choices, two question/answer matches and one contextual word-order task, for 20 independently recorded targets. Display both matches together on one screen and count each pair separately. Use different phrase targets within each round. Advanced card-based production is separate from this supported baseline.

Matching is an atomic selection unit: exclude an incomplete learned pair, keep both rows together in daily/review selection, and record each answer independently. Preserve old rounds; an explicit learner action may archive an old round before starting the new format. Archived rounds keep their answers but are not resume recommendations. See docs/exercise-mapping/L13_PHRASES_TOPIC_SEQUENCE.md for every active target and authored context.

## Nouns across practice formats

Teach and display German nouns together with their Artikel and the shared gender dot across all lessons and practice formats, including meaning and spelling. In spelling, show the supplied Artikel beside the answer area while assessing the noun spelling separately; do not reveal the noun itself. If Artikel is the unanswered target, hide its correct text and color until feedback, then show the complete noun with Artikel. Contextual sentences retain grammatically correct inflection and contractions; do not mechanically prepend a nominative Artikel inside a sentence. Supplied gender is assistance, not evidence of independent Artikel recall. Missing confidence never implies mastery.
