# Current System Snapshot

วันที่อัปเดต: 2 ตุลาคม 2026  
ขอบเขต: snapshot จาก working tree หลังเปลี่ยน Pending Attempt และตัด Response Time จาก MVP; ทดสอบ local/browser และ PGlite แล้ว แต่ไม่ได้ตรวจ Supabase production  
Baseline ที่ใช้เทียบ: [Product Baseline](./PRODUCT_BASELINE.md); Vertical Slice 01 เป็น implementation scope เดิม

> สถานะ Supabase ที่ deploy จริงตรวจจาก repository ไม่ได้ ผู้ใช้เคยรายงานว่า migration ล้มด้วย `relation "item_exposures" already exists`; migration ใน repository ปัจจุบันใช้ `IF NOT EXISTS` สำหรับตารางใหม่แล้ว แต่ไม่มีหลักฐานยืนยันว่าฐานข้อมูลจริงมี schema/function/view ครบหรือ migration รอบแก้ไขผ่านแล้ว

## ภาพรวม

เพิ่มพื้นที่ทดสอบบนเครื่องด้วย `npm run dev:test` ที่พอร์ต 3002 ใช้บัญชีทดสอบและฐานข้อมูล PGlite แยก; ประวัติเริ่มว่างทุกรอบโดยไม่เพิ่มปุ่มรีเซตในแอป ดู [คู่มือพื้นที่ทดสอบ](./test-workspace.md) Auth/REST เป็น adapter จำลอง ไม่ใช่ hosted Supabase

เว็บปัจจุบันมีสองระบบข้อมูลอยู่ร่วมกัน:

1. **ระบบใหม่ Learning History** ใช้ `item_exposures`, `practice_sessions`, `session_items`, `learning_attempts`, `attempt_evidence` และ view `knowledge_state` ใน Supabase สำหรับ Learn/Practice/Review/Progress รุ่นปัจจุบัน
2. **ระบบเดิม Legacy Progress** ใช้ `learner_progress`, `learner_settings`, `learner_days` และ engine ใน `src/lib/engine.ts` สำหรับค่าคะแนนเดิม การตั้งค่า Export/Import และข้อมูลที่ย้ายจากเว็บเก่า

หน้าเว็บหลักใช้ระบบใหม่เป็นหลักสำหรับการเรียนรู้และแสดงความก้าวหน้า ส่วนหน้าตั้งค่า/สำรองข้อมูลยังทำงานกับระบบเดิมเท่านั้น การเข้าสู่ระบบ Supabase เป็นข้อบังคับก่อนใช้แอป

## โครงสร้างหน้าและ Navigation ปัจจุบัน

| เส้นทาง | หน้า/ความรับผิดชอบ |
|---|---|
| `/` | หน้าแรก สรุปจำนวนเคยเรียน/ส่งคำตอบ/ตอบถูก/รายการที่ฝึก และแสดงรอบที่ยังไม่จบ |
| `/learn` | เลือกระดับ A1.1/A1.2 และบทเรียน L01–L12 |
| `/lesson/:lessonId` | ภาพรวมบทและทักษะ พร้อมทางเข้า Learn และแบบฝึก |
| `/learn/L01/vocabulary` | ทางเข้า Das Alphabet และ WORTSCHATZ; สถานะบทเรียนใน Supabase แยกตามบัญชี |
| `/learn/L01/vocabulary/alphabet` | Das Alphabet: 30 ตัวใน 6 content-configured groups, learned/resume state แยกกัน; หลังครบเปิด Alphabet Board |
| `/learn/:lessonId/:skill` อื่น ๆ | Learn activity เดิมตามทักษะและบันทึก exposure |
| `/practice` | จุดเริ่มต้น Practice อิสระจาก Learn เลือกบทและทักษะ |
| `/practice/:lessonId/:skill` | ตั้งค่าชุดเนื้อหา/หัวข้อ/รูปแบบ/จำนวนข้อ โดยจำกัดเฉพาะรายการที่เคยเรียน |
| `/review` | คิว Review แยกจาก Practice ตามคำขอล่าสุด |
| `/session?id=:uuid` | ทำต่อหรือ resume Practice Session ที่เก็บในฐานข้อมูล |
| `/progress` | Dashboard/คลังประวัติพร้อมสรุปทักษะ, search, filters, ตารางและรายละเอียดรายการ |
| `/settings` | ตั้งค่ารอบและทิศทาง Legacy, Export/Import/Reset เฉพาะข้อมูลเดิม |
| `/api/health` | Endpoint ตรวจสถานะและจำนวนคำศัพท์ |

Navigation หลักมี 5 เมนู: หน้าแรก, บทเรียน, แบบฝึกหัด, ทบทวน, ความก้าวหน้า; “ตั้งค่าและข้อมูล” อยู่ส่วนล่างของ sidebar แยกจากเมนูหลัก การเพิ่ม “ทบทวน” เป็นเมนูบนสุดเป็นการเปลี่ยนตามคำสั่งภายหลัง baseline ที่ระบุ core navigation ไว้ 4 รายการ

ทุกหน้าครอบด้วย layout เดียว มี sidebar responsive, topbar, footer, auth gate และ route dispatch แบบ client-side ใน catch-all page `src/app/[[...path]]/page.tsx` ไม่ได้แยกไฟล์ Next route ต่อหน้า

## User flow หลัก

### 1. สมัคร/เข้าสู่ระบบ

- ถ้าไม่มี Supabase config แสดงข้อความ configuration error และปิดปุ่ม auth
- ถ้ามี config โหลด Supabase session และยืนยัน user; ยังไม่ login จะแสดงหน้าสมัคร/เข้าสู่ระบบ
- Login ด้วย email/password, สมัคร, แจ้งยืนยัน email และส่ง confirmation link ซ้ำได้
- เมื่อ login โหลด Legacy store และ Learning History แยกกัน
- Legacy localStorage (`deutsch-mit-sun-v5` หรือ `deutschProgress`) ถ้ามี จะถูกรวมเข้า Legacy database แล้วลบ local key; ไม่มีการแปลงให้กลายเป็น Learned หรือ Learning Attempt ใหม่

### 2. Learn

- หน้า `/learn` เลือกระดับและบท; หน้า `/lesson/:id` เลือกทักษะ
- Learn activity แสดงรายการในบท/ทักษะตามลำดับจาก content catalog
- ทักษะทั่วไป: เมื่อการ์ดปัจจุบัน mount และเอกสาร visible ระบบเรียก `learning_action('expose')`; กลับมาหน้าเดิม/รายการเดิมไม่สร้าง exposure ซ้ำเพราะ unique key ต่อ user/item
- `/learn/L01/vocabulary` แสดงทางเข้า Das Alphabet และ WORTSCHATZ สำหรับจับคู่คำกับภาพ; ชุดกิจกรรม INTRODUCE/recall เดิมถูกถอดออกจาก Learn
- สถานะ WORTSCHATZ โหลดจาก `learner_lesson_states` ผ่าน `LessonStateProvider` และตรวจรูปแบบด้วย `src/lib/vocabulary-image-learning-storage.ts`; ระบบไม่อ่านหรือเขียน localStorage ของ vocabulary-learning prototype ที่ถอดออกแล้ว; key เก่าถ้ายังมีอยู่จะไม่ถูกใช้งาน และไม่กระทบสถานะจับคู่ภาพหรือ Alphabet
- Practice และหน้าทักษะอื่นยังใช้ flow/eligibility เดิม
- ปุ่ม “รายการถัดไป” ปลดล็อกหลังบันทึก exposure สำเร็จ; ผู้ใช้ย้อนดูรายการก่อนหน้าได้
- Vocabulary Learn แบบเดิมสำหรับ Lektion/route อื่นยังใช้การ์ดจาก catalog; Vocabulary prototype ของ L01 เลือกการแสดง Artikel, Plural, example, chunk ตาม metadata ของคำ
- L01 Wortschatz มี entry tile “Das Alphabet” ซึ่งเปิด route `/learn/L01/vocabulary/alphabet`; ใช้ภาพตัวอย่าง ABCD และวาง badge หลังชื่อบท: “เรียนแล้ว” เมื่อครบ 30 ตัว, “เรียนซ้ำ” ระหว่าง replay; configuration ใน `src/data/alphabet.json` เก็บ stable IDs, symbol, order, pronunciation text/audio reference, item IDs ต่อกลุ่ม และ activity type
- Activity components ใน `src/components/alphabet-activities.tsx` รับ items ผ่าน props; ใช้ Listen and Choose / Find Sound สลับกัน ไม่มีหน้าจบกลุ่ม และไม่เฉลยเมื่อเลือกผิด
- Alphabet learned IDs, resume index และตำแหน่ง replay เก็บแยกกันใน Supabase ผ่าน `LessonStateProvider` โดย `src/lib/alphabet-learning-storage.ts` ตรวจรูปแบบ state; ย้อนกลับไป replay ไม่ลด resume index และ state นี้ไม่ใช่ mastery หรือ Progress score
- หลัง learned ครบ 30 ตัว route เปิด Alphabet Board ให้กดเล่นเสียงแต่ละตัวได้และกด “เรียนซ้ำ” ที่อยู่แถวเดียวกับ “กลับ Wortschatz” เพื่อ replay ตั้งแต่ A โดยไม่ลบ learned/resume state; ปุ่มย้อนกลับเปิดกิจกรรมตัวที่เพิ่งเรียนเพื่อ replay โดยไม่ลด resume index; replay position คงอยู่หลังออกจากหน้าแล้วกลับมา; Board มีปุ่ม “เรียนคำศัพท์ต่อ” ไปหน้า Begrüßung และ “แบบฝึกหัด” ไป Practice Vocabulary
- ไม่พบ audio assets สำหรับ A–Z, Ä, Ö, Ü, ß ใน repository; `audio` เป็น `null`, ระบบใช้ shared browser German voice synthesis จาก `src/components/german-audio.ts` และแสดงข้อความแจ้งแหล่งเสียง

### 3. Practice

- เข้าได้จากเมนู Practice โดยตรง ไม่ต้องเปิด Learn ก่อน
- เลือกบท → ทักษะ → collection ศัพท์หลัก/ศัพท์เสริม/ทั้งหมด หรือ grammar group → รูปแบบ → จำนวนข้อ
- หน้า setup กรอง pool ด้วย `item_exposures`; Article mode กรองต่อให้เหลือ item ที่มี article
- หากชุดที่เลือกไม่มี Learned item แสดง empty state พร้อมทางกลับไปเรียน/เลือกชุดอื่น
- เมื่อเริ่ม รอบคำถามที่เลือกและตัวเลือกถูกสร้างและ persist เป็น snapshot ใน session; หน้า `/session` ใช้ข้อมูลที่บันทึกไว้ ไม่สุ่มใหม่เมื่อ resume
- มี Flashcard แบบให้ผู้เรียนกด “จำได้/ยังไม่จำ”, choice, article, typing, order, dialogue, writing, reading และ listening ตามชนิดเนื้อหา
- Listening ใช้ Web Speech Synthesis ภาษาเยอรมันจากอุปกรณ์ ไม่ใช่ไฟล์เสียง; ถ้าไม่มี voice จะกันไม่ให้เริ่ม

### 4. ตอบคำถามและบันทึก Attempt

- เมื่อ submit ระบบคำนวณ correctness ด้วย `isCorrect` (NFC, trim, ยุบช่องว่าง, ตัดเครื่องหมายท้ายประโยค; ไม่ normalize ตัวพิมพ์เล็ก/ใหญ่) และ accepted answers
- สร้าง dimension evidence ผ่าน `diagnose`; ส่ง attempt/evidence ไป RPC ก่อนแสดง feedback
- ตอบผิด: แสดงคำตอบที่ถูก, feedback ทันที และทุก dimension ที่ผิดจาก evidence; confidence ไม่ถาม
- ตอบถูก: ต้องเลือก “ง่าย/ต้องคิด/เดา” ก่อนเดินหน้าต่อ
- Response Time ไม่ได้คำนวณหรือใช้ใน MVP; `response_ms` column คงไว้เพื่อ compatibility เท่านั้น
- หนึ่ง SessionItem มี attempt ได้หนึ่งรายการ (primary key); submit ซ้ำเป็น idempotent no-op; ไม่มีการลองตอบใหม่ในตำแหน่งเดิมใน session เดียวกัน
- เมื่อเดินหน้าบันทึก position ของ session; ไม่มี timer สำหรับวัดเวลาตอบ; เมื่อครบ mark completed
- Summary คำนวณจาก attempts ใน session (first/only attempt ต่อข้อ) ไม่ใช้คำตอบแก้ตัวซ้ำ
- จาก summary เริ่มรอบใหม่เฉพาะข้อผิดหรือเริ่มฝึก pool เดิมอีกครั้งได้

### 5. Resume

- session ที่ `completed=false` ยังเปิดต่อได้ที่ `/session?id=...`; ไม่แสดง Resume banner บนหน้าแรก, Practice, Review และ Progress
- เลือก session จาก URL id; ถ้าไม่มี id จะเลือก incomplete session ล่าสุด
- คำถาม, ตัวเลือก, ลำดับ, position และ attempt ถูกดึงจาก Supabase เพื่อทำต่อ; correct Pending attempt กลับมาที่ขั้น confidence เดิม
- ข้อที่ตอบถูกแต่ยังไม่เลือกระดับความมั่นใจค้างอยู่และให้เลือกระดับต่อได้
- การออกจาก session ผ่านลิงก์ต้นทางไม่ mark session complete จึงกลับมาทำต่อได้

### 6. Review

- `/review` หา latest Completed attempt ต่อ item จากประวัติ โดยเชื่อม session item กับ attempt
- เฉพาะ Completed attempt ใช้หา latest attempt; Pending correct attempt ไม่เข้า Review
- item เข้า queue ถ้า latest Completed attempt ผิด หรือ confidence เป็น `thought`/`guess`; `easy` ออกจาก queue
- ปุ่มเริ่ม Review ส่ง candidate ทั้งหมดเข้า session ใหม่; mode ถูกเลือกตามชนิด item (reading/listening choice, Satzbau order, อื่น ๆ typing)
- ไม่มี due date, spacing, snooze, mastery algorithm หรือปรับคิวจากจำนวนครั้งในระบบ Review ใหม่นี้

### 7. Progress

- หน้าใหม่คง layout คลังและตัวกรองที่ผู้ใช้ขอจากหน้าเดิม แต่ข้อมูลหลักอ่านจาก Learning History/KnowledgeState
- การ์ดทักษะแสดงเปอร์เซ็นต์จำนวน item ที่ Seen ต่อจำนวน item ในทักษะ ไม่ใช่ mastery score
- ตารางมี search, ระดับ, บท, ทักษะ, สถานะ, ชุดเนื้อหา, pagination 30 รายการ; สถานะคือ ยังไม่เรียน/เคยเรียน/มีข้อผิดพลาด/เคยฝึกแล้ว
- ตัวเลขถูก/ผิดและมิติข้อผิดพลาดสร้างจาก Attempt + AttemptEvidence ที่ join กับ SessionItem
- รายละเอียด item แสดงวัน/หลักฐาน exposure, attempts/confidence/evidence และทางไป Learn หรือ Practice ตาม state
- ปุ่ม “สำรองข้อมูล” ไป `/settings`; สำรอง/นำเข้าเป็น Legacy progress เท่านั้น ไม่รวม Learning History

## ฟังก์ชันที่มีอยู่จริง

- Auth Supabase email/password, signup, confirmation resend, signout
- บทเรียน 12 บท, ศัพท์หลัก 181 รายการ, ศัพท์เสริม 16 รายการ และเนื้อหา L01 เพิ่มเติม
- Learn exposure ต่อรายการและการกั้น practice ตาม exposure
- Practice setup ตามบท/ทักษะ/collection/group/mode/count
- Snapshot session, submit, immediate feedback, confidence, dimension evidence และ resume; Response Time ถูกตัดจาก logic MVP
- Review queue ตาม Completed attempt ล่าสุดและ confidence; Pending correct ไม่เข้า queue
- Progress dashboard/search/filter/detail โดยอิงข้อมูล history
- Legacy settings, Legacy import/export JSON, migration of old local storage, reset เฉพาะ Legacy store
- เสียงภาษาเยอรมันแบบสังเคราะห์ใน listening practice
- `/api/health`

## Data model และ persistence

| Entity | ที่เก็บ/บทบาท |
|---|---|
| `ItemExposure` | `item_exposures`, key `(user_id,item_id)`, `seen_at`; เป็น source ของ Seen/Learned boundary |
| `PracticeSession` | `practice_sessions`; UUID, title, origin, position, completed, created_at |
| `SessionItem` | `session_items`; ordinal, item_id, serialized `question`; schema column `started_at` คงไว้แต่ไม่อัปเดต/ใช้จับเวลาใน flow ใหม่; FK บังคับว่ามี exposure ก่อนเพิ่มเข้า session |
| `LearningAttempt` | `learning_attempts`; input, correctness, confidence, submitted_at; correct attempt Pending จนเลือก confidence; `response_ms` คงไว้เพื่อ compatibility แต่ไม่ใช้ใน logic; unique ต่อ session/ordinal |
| `AttemptEvidence` | `attempt_evidence`; dimension + correct ต่อ attempt; unique ต่อ dimension ใน attempt |
| `KnowledgeState` | SQL view `knowledge_state`; derive seen_at, attempts, correct, errors จาก exposure/session/attempt/evidence ไม่ใช่ source write |

`LearningProvider` โหลดทั้งหกชุดจาก Supabase เป็นหน้า ๆ ละ 500 แถว เพื่อหลบ row limit; writes ทั้งหมดผ่าน RPC `learning_action` ที่เป็น security definer และใช้ `auth.uid()`; client select ถูกจำกัดด้วย RLS ต่อ user ส่วนตารางใหม่ revoke direct write จาก authenticated/anon

Legacy data ยังอยู่ในตาราง `learner_progress` (JSON progress ต่อ item), `learner_settings` และ `learner_days`; `StoreProvider` โหลด/เขียนชุดนี้แยกต่างหาก Migration แรกสร้าง save RPC และ RLS; migration ใหม่เป็น additive โดยไม่แปลง legacy aggregate ให้เป็น history ใหม่

## Logic สำคัญ

### Seen/Learned และ eligibility

- Exposure เกิดจากการอยู่บน Learn activity และ document visible เท่านั้น; catalog, lesson overview, Practice และการ import Legacy ไม่สร้าง exposure
- Unique `(user_id,item_id)` ทำให้ Seen คงอยู่และการเรียนซ้ำไม่เพิ่ม record
- PracticeSetup กรอง pool จาก exposure ก่อนเปิดเริ่ม; `start()` กรองซ้ำอีกครั้ง; foreign key ของ `session_items` ป้องกัน session item ที่ไม่มี exposure ในฐานข้อมูล
- `/practice` แสดงจำนวน Learned ต่อทักษะ แต่ card ยังเปิดเข้า setup ได้แม้ count เป็นศูนย์ เพื่อให้แสดง empty state

### Diagnosis dimensions

มิติทั้งหมดที่รองรับ: `wordRecall`, `article`, `spelling`, `verbForm`, `grammar`, `sentenceStructure`, `application` (UI แสดงชื่ออังกฤษตาม spec)

- mode `article` → Artikel
- Vocabulary typing → Artikel เมื่อ item มี article; Spelling; เพิ่ม Word Recall เป็น error เพิ่มเติมเมื่อ spelling ผิด
- Vocabulary mode อื่น → Word Recall
- Grammar group Satzbau → Sentence Structure; Personalpronomen → Grammar; grammar group อื่น → Verb Form
- mode order ของ non-grammar → Sentence Structure; item อื่น → Application

Diagnosis ผูกกับกลุ่ม content/mode แบบ hard-coded และไม่ได้วัด sub-dimension อย่างอิสระทุกข้อ ตัวอย่าง typing vocabulary ที่ตอบคำศัพท์ถูกแต่ Artikel ผิดจะมี `article:false` และ `spelling:true`; ความถูกทั้งข้ออิงคำตอบรวมทั้งหมด

### Review และ KnowledgeState

- `KnowledgeState` เป็น aggregate counts (`attempts`, `correct`, `errors`) ต่อ item จากฐานข้อมูล; ไม่นับ Pending correct attempt และไม่เก็บเป็น state ที่ client แก้เอง
- Review queue เป็น derived logic ฝั่ง client แยกจาก `knowledge_state`; เลือกจาก latest Completed attempt/confidence เท่านั้น
- Attempt ถูกเก็บเพียงครั้งเดียวต่อ session item; “ฝึกข้อผิด” สร้าง session ใหม่ จึงเพิ่มหลักฐานใหม่ในประวัติได้
- Correct answer จะ persist เป็น Pending ทันที; เมื่อ resume จะกลับมาที่ confidence prompt เดิมโดยไม่ถามคำถามซ้ำ. Confidence `easy`/`thought`/`guess` ทำให้ Completed; incorrect attempt Completed ทันที
- Response Time ไม่ถูกใช้ใน Review, Progress, KnowledgeState หรือ learning evidence; ไม่มี timer/pause-resume logic ใน MVP

## ส่วนที่ Reuse / Refactor / Replace / New

| หมวด | ส่วนปัจจุบัน |
|---|---|
| **Reuse** | shell/สี/typography/responsive CSS, UI primitives ใน `ui.tsx`, content IDs V001–V181, lessons/vocabulary JSON, Supabase Auth/client, legacy data migration/import |
| **Refactor** | navigation และ route dispatch; Learn/Practice entry points; setup กรอง Learned items; Session UI บันทึกผ่าน Learning History; Progress ใช้ history และคงรูปแบบคลังเดิม |
| **Replace ใน user-facing flow** | legacy score/mastery/review scheduling ไม่ใช่แหล่ง Progress หลักอีกต่อไป; session state ใน React memory ถูกแทนด้วย persisted session snapshot |
| **New** | Learn activity/exposure boundary, Learning History tables/RPC, dimension diagnosis/evidence, confidence prompt, resume banner, Review route แยก, history-backed Progress |

## Component / file map

| File | หน้าที่ |
|---|---|
| `src/app/[[...path]]/page.tsx` | catch-all route render `Trainer` |
| `src/app/layout.tsx` | metadata และ `StoreProvider` + `LearningProvider` |
| `src/components/trainer.tsx` | auth gate, nav/sidebar, route dispatch, lesson list/detail, สร้าง session |
| `src/components/learning-pages.tsx` | Home, PracticeEntry, ReviewPage, LearnActivity, HistoryProgress, progress detail |
| `src/components/vocabulary-learning.tsx` | L01 Wortschatz entry points for Alphabet and image matching |
| `src/components/alphabet-learning.tsx` | Das Alphabet configuration-to-activity routing, item navigation, resume, completion board |
| `src/components/alphabet-activities.tsx` | Reusable ListenAndChoose, FindSound activities |
| `src/components/alphabet-audio.ts` | Alphabet audio-file playback and German speech fallback |
| `src/components/german-audio.ts` | Shared German voice selection and speech synthesis helper for Learn/Practice |
| `src/components/practice.tsx` | PracticeSetup, session screen, input widgets, feedback, confidence, listening, summary |
| `src/components/learning-store.tsx` | load history, context, `learning_action` RPC, reload/error/busy |
| `src/lib/learning.ts` | types, dimension diagnosis, confidence types, review candidate logic |
| `src/lib/alphabet-learning.ts` | Alphabet content/set types, resolver, shuffle and config validation |
| `src/lib/alphabet-learning-storage.ts` | ตรวจและ normalize Alphabet state จาก Supabase |
| `src/components/lesson-state-provider.tsx` | โหลด/บันทึกสถานะ Alphabet, image matching และ Verben แยกตามบัญชี; ย้าย legacy เฉพาะเจ้าของและสำรองรายการรอส่ง |
| `src/components/store.tsx` | Supabase Auth และ legacy store hydration/persistence/import/reset |
| `src/components/progress.tsx` | Settings และ Legacy export/import/reset |
| `src/components/session-store.tsx` | in-memory SessionProvider เก่า; ไม่ถูกใช้จาก root layout/route ปัจจุบัน |
| `src/lib/engine.ts` | legacy score/mastery/interval scheduling, question generation, shuffle, backup validation/merge |
| `src/lib/content.ts` | types, lessons, catalog, hard-coded supplemental content, modes |
| `src/data/lessons.json`, `src/data/vocabulary.json` | เนื้อหาบท/ศัพท์หลักเดิม |
| `supabase/migrations/20261001000000_learner_data.sql` | Legacy tables, RLS, `save_learner_progress` |
| `supabase/migrations/20261002000000_learning_history.sql` | History schema, view, RLS, `learning_action` transaction |
| `src/app/globals.css`, `src/components/ui.tsx` | visual system, responsive layout และ reusable UI |

## ของเดิม, ของใหม่ และจุดซ้ำ/ขัดกัน

- **มาจากเว็บเดิม:** content vocabulary/lesson IDs, visual shell/style, auth/Supabase, legacy learner tables, preferences, JSON backup/import, old scoring/mastery/interval engine, browser speech synthesis
- **เพิ่ม/เปลี่ยนใหม่:** Learn exposure, history entities, session persistence/resume, attempt diagnosis, confidence, Review queue ใหม่, หน้า Progress history-backed และ route `/review`
- `src/lib/engine.ts` ยังคำนวณ score/streak/mastery/nextReview/priority แบบเก่า; ส่วน `src/lib/learning.ts` และ SQL view ใช้ attempt/evidence ใหม่ ไม่มีการ synchronize ระหว่างสองความหมายนี้
- Settings ยังให้เลือกขนาด session และทิศ Quiz; ขนาดและทิศ Quiz ถูกใช้ใน setup บางส่วน ส่วน `prioritize` ที่ผู้ใช้ตั้งค่า/นำเข้าไม่ถูกนำไปใช้ (`PracticeSetup` ตั้ง `prioritize=false`; start ใช้ `{}` และ false)
- `src/components/session-store.tsx` เป็น in-memory session store ที่ยังอยู่แต่ไม่ได้ mount/use ใน flow ปัจจุบัน
- `src/components/progress.tsx` ชื่อไฟล์ชวนเข้าใจว่าเป็น Progress แต่ตอนนี้ export `SettingsPage`; หน้า progress จริงอยู่ใน `learning-pages.tsx`
- Learn exposure และ KnowledgeState overlap ในข้อมูล Seen: exposure เป็น source, `knowledge_state.seen_at` เป็น derived projection; สอดคล้องกันแต่ชื่อ Seen/Learned ปรากฏได้จากทั้งสองทาง
- `/review` queue logic ซ้ำการหา latest attempt ใน `ReviewPage` เองและ `reviewCandidates()` ใน `learning.ts`; ปัจจุบันเงื่อนไขเหมือนกันแต่การคำนวณซ้ำเสี่ยง divergence
- Progress card เปอร์เซ็นต์แสดงสัดส่วน Learned; ตารางแสดง correctness/errors; ไม่มี mastery % ใหม่ ขณะที่ legacy engine ยังมี mastery % ซึ่งอาจทำให้ผู้ดูแลสับสนหากนำ logic เก่ากลับมาใช้
- README ยังอธิบาย legacy review interval/mastery, “บันทึกผลทุกคำตอบ” และ Export/Import ประวัติรายข้อแบบเดิมเป็นฟังก์ชันปัจจุบัน โดยไม่แยกชัดจาก History flow ใหม่ จึงล้าสมัยบางส่วน

## TODO / placeholder / mock / hard-coded behavior

- ไม่พบ TODO/FIXME ใน source ที่ค้น; มี placeholder เนื้อหาและข้อความกำลังเตรียมทักษะ
- README ระบุ L02–L12 มีศัพท์หลักครบ แต่ทักษะที่ไม่ใช่ Vocabulary ในบทเหล่านั้นไม่มี item; Practice setup แสดง “กำลังเตรียมเนื้อหา”
- Grammar, phrases, writing, reading, listening และศัพท์เสริมส่วนใหญ่ประกาศ hard-coded ใน `src/lib/content.ts`; reading passage และตัวเลือกเป็นข้อมูลตัวอย่างที่แต่งขึ้น ไม่ได้โหลดจาก CMS/API
- Listening สังเคราะห์เสียงด้วย browser/device Web Speech API; ต้องมีเสียงเยอรมันในเครื่องและไม่ใช่ audio asset
- Learning home ใช้คำทัก “Hallo, Sun” และระดับ A1 คงที่; topbar แสดง A1.1—A1.2 คงที่
- บทเรียนแสดงข้อความ “12 บทเรียน · 181 คำหลัก”; จำนวนไม่ได้คำนวณจาก data ในจุดนั้น
- Practice รูปแบบ Flashcards ไม่แสดงเป็น mode ใน setup (`filter(m !== "flash")`) แต่ session summary/เริ่มซ้ำใช้ flash/review mode logic ได้; Review auto-selects mode แทนให้ผู้ใช้เลือก
- Review queue ไม่มีคิวกำหนดวัน; Pending correct ไม่เข้าคิว; ไม่มี final mastery/scheduling ซึ่งตรงกับ exclusion ของ baseline
- Legacy export/import/reset ไม่ครอบคลุม exposure/attempt/session; Reset UI ระบุชัดว่าล้างเฉพาะ Legacy
- `tests/` มี test scripts และ fixture/data tests แต่เอกสารนี้ไม่ได้รัน tests เพราะเป็นรอบ audit เท่านั้น
- database migration เป็น code artifact; สถานะ apply บน Supabase จริงและค่า env ของ deployment ไม่ทราบจาก repository

## เทียบกับ Pre-Coding Baseline ล่าสุด

ระดับหมายถึง: **Aligned** ทำตาม baseline; **Partially aligned** มีส่วนหลักแต่ขอบเขต/รายละเอียดต่าง; **Not aligned** ขัดกับ baseline; **Not implemented** baseline กำหนดไว้แต่ยังไม่พบ implementation

| หัวข้อ Baseline | สถานะ | หลักฐาน/หมายเหตุ |
|---|---|---|
| Reuse codebase เป็น reference; ห้าม rewrite ทั้งระบบ | Aligned | Shell, styles, content IDs, auth/Supabase และ Legacy store ถูกคงและต่อยอด |
| Core navigation: หน้าแรก, บทเรียน, แบบฝึกหัด, ความก้าวหน้า | Partially aligned | ทั้ง 4 มี; เพิ่ม Review เป็น top-level แยกตามคำสั่งล่าสุด |
| Learn และ Practice เป็น independent entry points | Aligned | `/learn` และ `/practice` เปิดตรงได้; Practice มี empty state/ไปเรียน |
| Content ไม่เท่ากับ Learned; exposure เกิดจาก Learn activity | Aligned | Exposure RPC มีเฉพาะ Learn activity |
| Learned item เข้า Practice/Review ได้; Not Seen ห้ามถูกถาม | Aligned | client filtering, start filtering และ DB FK บังคับ exposure |
| Practice ไม่บังคับ Learn ซ้ำ; empty state เมื่อ scope ไม่มี Learned | Aligned | setup อิง exposure และแสดง empty states |
| Learning data: ItemExposure, LearningAttempt, AttemptEvidence, KnowledgeState, PracticeSession, SessionItem | Aligned | schema ครบใน migration ใหม่ |
| History เป็น source evidence, KnowledgeState derived | Aligned | attempt/evidence/session rows เป็น source; SQL view aggregate |
| Noun เรียนเป็น Artikel + Nomen | Aligned | Learn card แสดง combined `title/answer`; practice มี article mode และ noun typing |
| Dimension diagnosis ตามชุดที่กำหนดและเก็บ error dimensions ทั้งหมด | Partially aligned | รองรับครบ 7 label แต่ mapping เป็น rule ต่อ mode/group และไม่แยกวิเคราะห์ทุก dimension ในทุกคำถาม |
| ผิดแล้ว immediate corrective feedback | Aligned | Feedback หลัง RPC บันทึกสำเร็จ พร้อมเฉลยและมิติผิด |
| correct attempt เป็น Pending จนเลือก confidence; pending ไม่เข้า Review/Progress/KnowledgeState | Aligned | migration ใหม่และ tests ยืนยัน filter; resume กลับมาขั้น confidence |
| Response Time ถูกตัดออกจาก MVP และไม่เป็น evidence | Aligned | client ไม่คำนวณ/ส่ง; DB column คงไว้เพื่อ compatibility |
| Session Summary first-attempt score | Aligned | หนึ่ง attempt ต่อ session item; summary จาก stored attempt |
| Progress จาก Learning History/KnowledgeState ไม่ใช่ completion % | Aligned | summary/table ใช้ exposure/attempt/evidence; skill card เป็น exposure coverage |
| Incomplete Practice Session resume | Aligned | session/question snapshot/position persist และเปิดต่อผ่าน `/session?id=...` ได้ |
| Progress layout ใกล้หน้าเดิมตาม screenshot ล่าสุด | Aligned | summary cards, searchable/filterable progress table และ item detail |
| Review เป็นหัวข้อแยกจากแบบฝึกหัด (คำขอล่าสุด) | Aligned | route และ nav แยก `/review` |
| Seen/Learned + สถานะผิด/ถูกหรือจำได้/ลืม | Partially aligned | มีสถานะ Seen, มีข้อผิดพลาด, เคยฝึกแล้ว และ Review reason; ไม่มี status “จำได้/ลืม” หรือ mastery แยกเป็น state และ `เคยฝึกแล้ว` ไม่ได้ยืนยัน mastery |
| Definition of Done: state คงเมื่อเปลี่ยนหน้า/เปิดใหม่ | Aligned ใน code; deploy ยังไม่ยืนยัน | Supabase persistence/reload มี; ต้องมี migration ใหม่ apply และ auth/config ทำงาน |
| DoD: Learned เข้า Practice โดยไม่ Learn ซ้ำ | Aligned ใน code | filter ตาม persisted exposure |
| DoD: Not Seen ไม่ถูกถาม | Aligned ใน code | filter สองชั้นและ FK |
| DoD: Attempt และ dimension evidence persist | Aligned ใน code | `learning_action` transaction; ต้อง schema deployed |
| DoD: Progress อิงข้อมูลเรียนจริง | Aligned | หน้าใหม่ aggregate history evidence |
| DoD: incomplete session resume | Aligned ใน code | state persist และ resume banner |
| Exclusion: AI PDF/Image extraction, pronunciation assessment, speech input, cloud sync เต็ม, shared content, admin, final mastery | Aligned | ไม่พบ implementation เหล่านี้; login/cloud database persistence ที่เลือกไว้ก่อนหน้าเป็นส่วนที่อนุญาต |

## ข้อจำกัดการตรวจ

Tests, browser flow, typecheck และ production build ตรวจบน local environment เท่านั้น ไม่ยืนยัน live Supabase schema, RLS behavior บน project จริง, Vercel environment หรือ migration history บนฐานข้อมูลที่ใช้งานจริง. ต้องตรวจ environment/deployment แยกต่างหาก

## อัปเดต 2026-10-03: คลังเนื้อหาในฐานข้อมูล

ข้อมูล catalog ที่เคยประกาศใน `src/lib/content.ts` ย้ายเป็น `content_lessons` และ `content_items` บน Supabase ตาม `docs/content-database.md` โค้ด production อ่านจาก `ContentProvider`; JSON เดิมและ `supabase/seed/catalog.json` เหลือไว้เป็นแหล่งอ้างอิง/seed คำอธิบายเรื่อง catalog hard-coded ข้างต้นเป็นสถานะก่อนการย้ายนี้ จำนวนบท/ศัพท์บนหน้าบทเรียนคำนวณจาก catalog ปัจจุบัน ต้องรัน migration ใหม่ก่อนใช้งาน ไม่มีการเปลี่ยน source of truth ของประวัติหรือการแยก Learn/Practice

สถานะบทเรียนอัปเดต 7 ตุลาคม 2026: `learner_lesson_states` เก็บ Alphabet, image matching และ Verben แยกตาม `user_id` พร้อม RLS; บทเรียนและรอบเรียนซ้ำยังใช้กติกาเดิม localStorage คงไว้เฉพาะ legacy ที่รอย้ายและรายการรอส่งแยกบัญชี ไม่ใช่ source หลักของบทเรียน
