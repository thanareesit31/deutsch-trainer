# แผนการสอนและหลักฐานรายทักษะ บท 15–18

วันที่ 9 พฤศจิกายน 2026 · สถานะออกแบบและเตรียมข้อมูล ยังไม่เชื่อมบัญชีหรือ selector

## ขอบเขตและข้อมูลเดิม

เตรียมเฉพาะคำศัพท์ ไวยากรณ์ และประโยคของ L15–L18 ตามมาตรฐานผลิตภัณฑ์ การฝึก และคำอธิบายใต้คำ ร่างที่ตรวจได้อยู่ใน `l15-content.json` ถึง `l18-content.json`; ทุกหน่วยคำตอบมี mapping ใน `l15-l18-assessment-bindings.json` แหล่งและหน้าหนังสืออยู่ใน `l15-l18-source-review.json` แยกจากข้อความผู้เรียน

- L15 ใช้รหัสคำศัพท์ `L15-V001`–`L15-V024` เดิม รักษาคำตอบเยอรมันและกลุ่มเดิม คำแปล Bad ขยายให้แยกห้องอาบน้ำออกจาก Toilette ได้ชัดเจน
- รายการ `L15-G001`–`L15-G010` ใน catalog เดิมยังอยู่ ไม่มีการย้ายผลไปเป็นความสามารถของ concept ใหม่ ต้องกำหนด mapping จากสิ่งที่ผู้เรียนได้เรียนจริงเมื่อเชื่อมระบบ
- L16–L18 ยังไม่มีคำศัพท์ใน seed catalog; `L16-V001`–`V024`, `L17-V001`–`V022`, `L18-V001`–`V027` จองไว้เฉพาะชุดเตรียม
- ประโยคแต่ละบทจอง `Lxx-R001`–`R016` แยก 16 บทพูด A/B ใน 8 บริบท ไม่มีรายการใดถูกเพิ่มเป็น published content
- ไวยากรณ์เดิม 35 ข้อเป็น prototype ไม่ใช่หลักฐานผู้เรียนจริง ร่างใหม่ใช้ `<old-id>-PREP3` และเก็บ accepted answers เดิม มีโจทย์วินิจฉัยเพิ่ม 4 ข้อซึ่งมีรหัสของตนเอง
- ไม่ใช้คะแนนของ preview หรือการดูตัวอย่างมาเติมประวัติจริง ไม่สร้าง item exposure ปลอมเพื่อให้ผ่าน eligibility

## เป้าหมายและหน่วยคำตอบ

| Target | สิ่งที่สอน | Subskill / response ID | สิ่งที่ต้องเรียนหรือให้เป็นบริบท | ความยากและตัวช่วย | สิ่งที่คะแนนบอกได้ |
| --- | --- | --- | --- | --- | --- |
| คำศัพท์ `Lxx-Vnnn` | ความหมายคำเดี่ยว | `word_meaning`; `-meaning-v1` | target เดียวกัน; แสดงคำเยอรมันและตัวเลือกไทย | 1: จำแนกจากตัวเลือกที่แยกความหมายได้ | จำแนกความหมายแบบเห็นรูปคำ ไม่ใช่นึกคำเอง |
| วลีศัพท์ L17 | ความหมายของกิจกรรมทั้งวลี | `lexical_chunk_meaning`; `-meaning-v1` | วลีทั้งกลุ่ม ไม่แยกคะแนนทุกคำภายในวลี | 1: รูปภาษาและตัวเลือกให้มา | เข้าใจวลี ไม่อนุมาน Artikel หรือสะกดแต่ละคำ |
| คำนามเอกพจน์ | Artikel ของคำนามในรูปพจนานุกรม | `noun_article`; `-article-v1` | ให้รูปคำและจำนวน; ไม่ให้ Artikel หรือสีของคำนั้น | 1: ตัวเลือก der/die/das; สีเป้าหมายเป็นกลาง | จำ Artikel ในรูปที่ถาม ไม่อนุมานการผัน Case |
| คำนามพหูพจน์ เช่น Kopfschmerzen | Artikel ของรูปพหูพจน์ | `plural_article`; `-article-v1` | ให้ข้อมูลว่าเป็นพหูพจน์ | 1: ตัวเลือกและจำนวนให้มา | กฎ Artikel พหูพจน์ ไม่เป็นหลักฐานเพศเอกพจน์ |
| คำเดี่ยว | สะกดคำจากความหมาย | `word_spelling`; `-spelling-v1` | แสดง Artikel เป็นตัวช่วยถ้าเป็นคำนาม | 2: เรียกคืนรูปคำ; อาจเปิดตัวแรกหรือแป้น ä/ö/ü/ß | สะกดและชนิดข้อผิด เช่น Umlaut/ตัวพิมพ์ใหญ่; ไม่ได้วัด Artikel |
| วลีหลายคำ | ประกอบวลีที่เรียน | `lexical_chunk_form`; `-form-v1` | ให้คำครบ แต่ไม่วางไว้เป็นคำตอบ | 1 สำหรับสองคำ; 2 สำหรับหลายคำที่มี Artikel/บุพบท | ประกอบวลีแบบมีคำให้ ไม่ใช่สะกดเองหรือผลิตประโยคอิสระ |
| `L15-possessivartikel` | เลือกเจ้าของและรูปท้ายในบริบท | `possessive_reference_and_inflection`; PREP3 001–004 | ให้เจ้าของและคำนามในประโยค | ตัวเลือกหรือพิมพ์รูปเอง; รักษาความต่างของการช่วย | เป็นคะแนนรวมของสองมิติ ห้ามอนุมานว่าส่วนใดผิดจากคะแนนรวมอย่างเดียว |
| `L15-possessivartikel-owner` | เลือกราก sein/ihr | `possessor_reference`; `A13-L15-OWNER-PREP-001` | คำนามกลางไม่มีการเปลี่ยนท้ายให้สับสน | 1: มีตัวเลือกและเจ้าของชัดเจน | การอ้างถึงเจ้าของ |
| `L15-possessivartikel-ending` | ผันท้ายตาม Case/เพศคำนาม | `possessive_case_ending`; `A13-L15-ENDING-PREP-001` | ให้ราก sein และ der Sessel | 1: วัดการเลือกท้ายโดยไม่วัดการเลือกราก | การใช้ Akkusativ ชายในบริบทนี้ |
| `L16-temporale-praepositionen` | เลือก in/vor/nach ตามจุดอ้างอิง | `temporal_relation`; PREP3 001–004 | ให้เวลาตอนนี้และเวลาเหตุการณ์ หรือเหตุการณ์ก่อน/หลังครบ | ตัวเลือก/พิมพ์คำ; Artikel ท้ายบุพบทให้มา | ความสัมพันธ์เวลา ไม่อนุมานว่าผัน Dativ ได้ |
| `L16-temporale-dative-form` | ผัน Artikel หลังบุพบทเวลา | `temporal_dative_inflection`; `A13-L16-DATIV-PREP-001` | ให้ nach และ die Arbeit | 1: เลือก der จากรูปต้นทาง | Dativ หญิง ไม่อนุมานว่าเลือก nach เองได้ |
| `L17-werden` | ผัน werden ที่หมายถึงเปลี่ยนสถานะ | `werden_conjugation`; PREP3 001–004 | ให้ประธาน; cloze ให้ lemma | จำแนกหรือเรียกคืนรูปที่มีการเปลี่ยน stem | การผัน werden; ไม่ใช่ Futur I |
| `L17-wollen` | ผัน wollen | `wollen_conjugation`; PREP3 001–004 | ให้ประธาน/lemma/Infinitiv ท้าย | ข้อมูลเพียงพอให้ผัน ไม่ให้เดาคำกริยาที่ต้องการ | รูปผัน ไม่ใช่การเลือกเจตนาหรือความสุภาพเอง |
| `L17-mit-ohne` | ผัน Artikel หลัง mit/ohne | `preposition_case_inflection`; PREP3 001–004 | ให้ mit/ohne และรูป Nominativ ที่ต้องแปลง | ตัวเลือกหรือพิมพ์เอง | การผัน Case ไม่ใช่การเลือกความหมาย mit/ohne |
| `L17-mit-ohne-meaning` | เลือกว่ามี/ไม่มีสิ่งประกอบ | `accompaniment_presence_meaning`; `A13-L17-MIT-OHNE-MEANING-PREP-001` | ใช้ Geld แบบไม่มี Artikel และให้ข้อมูลว่าพกเงิน | 1: ไม่มีการลงท้าย Artikel มาเป็นเบาะแส | ความหมายของ mit/ohne ไม่อนุมาน Case |
| `L18-imperativ-sie` | ทำรูปคำขอสุภาพ | `formal_imperative_form`; PREP3 001–004 | ระบุกริยาหรือเจตนา | มี lemma และ Sie; cloze ที่ให้ Infinitiv และรูปตรงกันเป็นระดับ 1 | รูปคำขอสุภาพ ไม่ใช่นึกคำศัพท์หรือเลือกคำแนะนำทางสุขภาพ |
| `L18-sollen` | ผัน sollen ตามผู้พูด | `sollen_conjugation`; PREP3 001–004 | ระบุ sollen และประธาน | จำแนกหรือพิมพ์รูปที่ต้องใช้ | รูปผัน; ความเข้าใจที่มาคำแนะนำดูจากบทสนทนาแยก |
| ข้อ order ของไวยากรณ์ | ประกอบโครงสร้างที่สอน | `declarative_word_order`, `modal_sentence_word_order`, `formal_imperative_word_order` | คำครบและระบุคำเริ่มต้น | ประโยคสามคำระดับ 1; ประโยคยาวขึ้นระดับ 2 | จัดลำดับตามแบบที่มีตัวช่วย ไม่ใช่ผลิตภาษาอิสระ |
| `Lxx-Rnnn` | สื่อหน้าที่ให้ตรงบริบท A/B | `phrase_dialogue_response` หรือ `phrase_word_order`; `Lxx-Dnn-A/B-try-v1` | ทั้ง questionTargetId และ replyTargetId; รู้ว่าใครพูดและเจตนาอะไร | เลือกบทตอบ หรือเรียงคำตามต้นประโยคที่ให้ | แยกคะแนนคำถาม A กับบทตอบ B; ไม่รวมเป็นคะแนนเดียวทั้งบทสนทนา |

`heiraten` เป็นคำกริยาเดี่ยว จึงใช้การสะกด ไม่ทำกิจกรรมเรียงคำเพียงคำเดียว คำตอบสั้นที่เป็นสูตรตอบรับ เช่น Ja, natürlich ใช้การเลือกตามบริบท แทนการให้เรียงคำที่แทบไม่มีการตัดสินใจ

## ความก้าวหน้าและการเลือกกิจกรรม

| หลักฐานที่มี | กิจกรรม/ตัวช่วยที่เตรียมไว้ | งานต่อไปใน subskill เดิม | สถานะ |
| --- | --- | --- | --- |
| ความหมายยังไม่ทราบ | คำพร้อม Artikel/ความหมาย/ตัวอย่าง แล้วจำแนกตัวเลือก | ภาพหรือบริบทอิสระอีกแบบ | แบบพื้นฐานมีแล้ว; บริบทอิสระเพิ่มเติมยังต้องเขียน/ตรวจ |
| เข้าใจความหมายแต่สะกดผิด | สะกดโดยให้ Artikel; เปิดตัวแรกได้โดยบันทึกการใช้ | ลดตัวอักษรช่วยในรอบที่เว้นเวลา; คงคำที่รู้ความหมายไว้ | ตัวโจทย์มี metadata; helper UI/หลักฐานการใช้ยังไม่เชื่อม |
| Artikel ยังไม่แน่ แต่สะกดได้ | ถาม Artikel แบบสีเป็นกลาง; feedback แสดงคำนามเต็มและจุดสี | เปลี่ยนบริบท/เว้นเวลาใน Artikel; ไม่บังคับกลับไปฝึกสะกดง่ายทั้งหมด | ออกแบบไว้; ไม่ถือว่าพหูพจน์ถูกเท่ากับรู้เพศเอกพจน์ |
| Possessivartikel คะแนนรวมผิด | ใช้ probe เจ้าของและ probe ท้ายคำแยก | เลือกฝึกเฉพาะมิติที่มีหลักฐานว่ายังติด | มีโจทย์แยกสองข้อแล้ว |
| เข้าใจเวลาแต่ Dativ ผิด | ใช้ probe รูป Dativ ที่ให้บุพบทมาแล้ว | ช่วยด้วยตารางรูปต้นทาง แล้วลดตาราง | มี probe แล้ว; ต้องมีหลายบริบทก่อนลดตัวช่วย |
| เลือก mit/ohne ถูกแต่ Artikel ผิด | คงความสำเร็จด้านความหมาย; ให้รูปต้นทางแล้วฝึก Case | เพิ่มคำนามต่างเพศภายใน Case เดิม | ข้อความหมายกับข้อ Case แยกแล้ว |
| เลือกบทตอบได้ แต่เรียงคำยังผิด | ให้คำและต้นประโยคในเป้าหมายเดียวกัน | ลดต้นประโยคในบริบทใหม่ เมื่อมีหลักฐานพอ | แบบมีคำเริ่มต้นมีแล้ว; แบบลดตัวช่วยยังต้องเพิ่ม |
| กดฟังตัวอย่างหรือดูเฉลย | เก็บเป็น exposure/การใช้ตัวช่วย | ไม่ยกระดับความสามารถด้านการฟัง | ไม่มีโจทย์วัด listening อิสระในชุดนี้ |

นโยบายร่าง `l15-l18-prep-policy-v1` เสนอให้พิจารณาลดตัวช่วยหลังมีคำตอบแรกที่ถูกแบบอิสระ 3 ครั้ง ในอย่างน้อย 2 บริบทและ 2 รอบ โดยมีการเว้น 24 ชั่วโมง ค่าเหล่านี้เป็นค่าทดลองที่ยังไม่รันหรือปรับเทียบ ใช้พิจารณาความพร้อมลองงานที่ช่วยน้อยลง ไม่ใช่การรับรองความชำนาญ ตัวช่วย/การกลับไปดู model ต้องทำให้หลักฐานนั้นไม่ถูกนับเป็น unassisted โดยอัตโนมัติ

หลายคำมีบริบทกิจกรรมพื้นฐานเพียงหนึ่งแบบต่อ subskill จึงยังไม่ครบเงื่อนไขสองบริบทของนโยบาย การสลับตัวเลือกหรือทำคำเดิมซ้ำไม่ถือเป็นบริบทใหม่ ต้องเพิ่มบริบทอิสระก่อนเปิดนโยบายเลื่อนระดับนั้น หากไม่มี variant ที่เหมาะสม ให้คงสถานะหลักฐานไม่พอแทนการสร้างคะแนนขึ้นมา

## เส้นทางข้อมูลและสถานะการเชื่อมระบบ

| Link | สิ่งที่ต้องเชื่อมจริง | สถานะ |
| --- | --- | --- |
| Learn target → exposure | Register target แล้วบันทึกผ่านระบบ Learn เดิม; ประโยคเรียนทั้ง A/B ก่อนใช้คู่ในการฝึก | ออกแบบ; ยังไม่ register หรือบันทึก exposure |
| Response → target/subskill | 372 หน่วยใน assessment bindings; ชุดคำถาม/บทตอบ/Artikel/สะกดแยก | เตรียมข้อมูลและตรวจโครงสร้างแล้ว; ยังไม่มี grader ที่เปิดใช้จากชุดนี้ |
| First answer + help + draft → account | รักษาคิว ตัวเลือก/คำที่เรียง ร่างข้อความ คำตอบแรก ตัวช่วยและรุ่นเนื้อหา | ออกแบบ; ยังไม่เขียนบัญชีจาก packet |
| Practice evidence → account | ใช้ shared practice sessions และ server validator; ประโยคใช้ `learner_practice_sessions` และ `PracticeAccountSync` | ยังไม่สร้าง bank/question migration; ไม่ใช้ lesson state เป็น Practice store ใหม่ |
| Account history → learner state | Aggregation ต่อ target/subskill, unknown ถ้าไม่เคยวัด และเก็บตัวช่วยแยก | ยังไม่เชื่อม; ไม่คัดลอกคะแนน prototype มาเป็นความสามารถ |
| Learner state → next task | Resume ก่อน, eligibility จากสิ่งที่เรียนจริง, เลือกความยาก/ตัวช่วยใน subskill ที่ต้องฝึกพร้อมเหตุผล | นโยบายเสนอเท่านั้น; ยังไม่ทำงาน |
| Recommendation → Home/Practice | Learn handoff และทางเข้าฝึกเองใช้กติกาและ registry ร่วม | ยังไม่เชื่อม |
| Deployment | Feature flag, normal-account path, eligibility, source/morphology/media/มือถือและการคืนประวัติ | ยังไม่เผยแพร่ |

## รายการตรวจก่อนสร้าง/ก่อนเปิด

1. ตรวจ morphology กับพจนานุกรมและคำเฟอร์นิเจอร์เดิมที่ยังขาดหลักฐานหน้า ตรวจคำตอบอื่นที่อาจถูกโดยเฉพาะ order ไม่ลงโทษรูปที่ถูกเพียงเพราะต่างลำดับธรรมชาติ ถ้าจำกัดให้สร้างตามแบบ ต้องระบุข้อจำกัดและตัวช่วยชัดเจน
2. สร้างเสียงจาก script รายคำ/ประโยคตัวอย่าง/บัตรไวยากรณ์/เฉลยและ A/B ที่ตรงข้อความ ตรวจฟังจริง ไม่แสดงปุ่มเล่นไฟล์ที่ยังไม่มี
3. ใช้ NounText/NounPrefix และ ArticleDot/ArticleLegend; จำนวนพหูพจน์เป็น metadata ของคำ คง Case/การละ Artikel ในประโยคตามจริง
4. หน้าลองทำไม่แสดง model ตารางคำตอบ ลูกศรหรือสีโครงสร้าง; ถ้าเปิดช่วย ให้เก็บว่าใช้จริง คำแปลเต็มอยู่หลังตรวจ
5. เฉลยแสดงสถานะ → German/Thai/โครงสร้างที่เกี่ยวข้อง → เหตุผลเฉพาะข้อมูลที่โจทย์วัด ไม่พิมพ์คำแปลซ้ำอีกครั้งในกล่องเหตุผล
6. ตรวจ actual renderer ที่ 375/390/1360px ให้ประโยคครบแถวเดียวและ label ใต้คำ; metadata ผ่านไม่ได้เท่ากับ UI ผ่าน
7. ทดสอบสองบัญชีแยกกัน, learner flag, ไม่มี target ที่ไม่เคยเรียนใน Practice, กลับหน้าเดิมได้, retry ไม่แทน first, offline/error ไม่สร้างหลักฐานเท็จ
8. เปิดใช้นโยบายลดตัวช่วยเฉพาะเมื่อมี variants/บริบทและตัวเก็บหลักฐานครบ ระบุ actual deployment แยกจากผลตรวจในพื้นที่ทดสอบ

## Runtime binding update, 9 November 2026

The prepared candidate bank is compiled into typed ReleaseCourse tasks and canonical server definitions. Learn trial responses remain account checkpoints; scored Practice uses the shared account session store and phrase registry validation. New Practice does not create a lesson-state practice bucket. Existing published lesson IDs/history remain unchanged. See RELEASE_EXECUTION.md for actual evidence and deployment status.

Learn card → learned card IDs → eligible canonical task → immutable account response and assistance → target/subskill observations → selectReleaseTask → stable shared round. Home and overview reuse the same recommendation helper, including pending shared rounds. Learn and Practice evidence stay attributable to their origin. Spelling now preserves German capitalization; optional-first-letter from preparation is mapped to the actual optional model assistance in runtime. Distinct subskills are not combined into global mastery. One-variant targets remain provisional under the stated evidence policy.
