# ออกแบบหมวดประโยคบท 2 ใหม่

วันที่ 6 พฤศจิกายน 2026 · สถานะ: ตรวจแหล่งเรียนและออกแบบ พร้อมต้นแบบหน้าจอแยกสำหรับตรวจ UX เท่านั้น ยังไม่ได้เปลี่ยนหน้าเรียนจริงหรือเปิด adaptive selection

## สิ่งที่จะเปลี่ยน

รูปแบบนี้ต้อง **แทนหมวดประโยคเดิม** ที่ `/learn/L02/phrases` เมื่อพัฒนาเสร็จ โดยเริ่มในบัญชีเทสก่อน ไม่เพิ่มหมวดหรือปุ่ม “บทเรียนใหม่” ขนานกับของเดิม ใช้หน้าการ์ด ภาพด้านซ้าย บทสนทนา A/B ด้านขวา ตัวเลือกแนวตั้ง ความคืบหน้า ปุ่มย้อนกลับ/ตรวจ/ต่อไป และเฉลยสั้นแบบบท 1 บนมือถือภาพอยู่เหนือโจทย์

ปัจจุบัน `src/components/l02-phrase-learning.tsx` แสดงตารางสถานะงาน รายการประโยค และคำสั่งเรื่องอาชีพในฝัน มีลิงก์ไปหน้าคำถาม/โครงสร้างประโยค และบันทึก ItemExposure เมื่อเห็นเนื้อหา นี่คือจุดที่ต้องแทน ไม่ใช่สร้างหน้าที่สามเพิ่ม

## ตรวจพบรูปแบบใดจากต้นฉบับ

หมายเลขต่อไปนี้เป็นหน้า PDF หนึ่งฐาน แยกจากเลขพิมพ์ รายละเอียดไฟล์และ fingerprint อยู่ใน `l02-phrase-redesign-sources.json` ข้อมูลอ้างอิงนี้อยู่เฉพาะเอกสารโครงการ ไม่แสดงในกิจกรรมของผู้เรียน

| รูปแบบในแหล่งเรียน | หลักฐานที่ตรวจ | นำมาเป็นสื่ออย่างไร |
| --- | --- | --- |
| ฟัง/อ่านบทสัมภาษณ์คนสองคน | หนังสือ PDF 15 ข้อ 2a–c; ชีท PDF 16; สไลด์ PDF 48–49 | ตัวอย่าง A/B สั้น ๆ แล้วให้ตอบตามข้อมูลคนหรือคู่ที่กำหนด เปลี่ยนผู้พูดให้เห็น ich/wir และ du/ihr อย่างมีบริบท |
| ตัวเลขและสัมภาษณ์อายุ/เบอร์โทร | หนังสือ PDF 15 ข้อ 3; ชีท PDF 12–14; สไลด์ PDF 35, 39 | ฟังบทสนทนาสองเสียงแล้วเลือกอายุ หรือเติมตัวเลขในช่องเบอร์ ซ่อนค่าที่เป็นคำตอบก่อนฟัง |
| จับคู่ภาพกับประโยคสถานภาพ | หนังสือ PDF 16 ข้อ 4 | ภาพเป็นฉากประกอบ แต่ให้ข้อมูลที่จำเป็นชัดเจน แยกอยู่ด้วยกัน แต่งงาน และมีลูก ไม่เดาจากแหวน หน้าตา หรือจำนวนคนในภาพ |
| ฟังสัมภาษณ์อาชีพแล้วเชื่อมข้อมูล | หนังสือ PDF 16 ข้อ 5a | ฟังใครทำงานอะไร/ที่ไหนแล้วจับคู่ แยกผลแต่ละคู่ ไม่แสดงบทพูดที่เฉลยก่อนฟัง |
| เกมใบ้/ทายอาชีพ | หนังสือ PDF 16 ข้อ 5c | ใช้ภาพการทำงานหรืออุปกรณ์ที่ชัด แล้วตอบประโยคอาชีพ อนาคตทำเกมบทบาทได้ ไม่เปลี่ยนเป็นข้อสอบสะกดชื่ออาชีพทุกข้อ |
| คลังวลีหลายทางเลือกในการตอบเรื่องงาน | หนังสือ PDF 17 ข้อ 6a–b และ PDF 27; สไลด์ PDF 65, 70 | สอนเป็นกลุ่มความหมาย แล้วเลือกคำตอบ/เรียงประโยคจากข้อมูลจริง ใช้ als สำหรับอาชีพและ bei สำหรับที่ทำงานอย่างแยกเป้าหมาย |
| อ่านข้อความแล้วกรอกโปรไฟล์/แนะนำคน | หนังสือ PDF 17 ข้อ 7–8; แบบฝึกหัด PDF 12 ช่วงท้าย | อ่านหรือฟังก่อนแล้วเติมข้อมูลที่ยังว่าง แต่ละช่องมี target ของตัวเอง ต่อด้วยเล่าเกี่ยวกับบุคคลจากข้อมูล ไม่เปิดคำตอบไว้บนโปรไฟล์พร้อมกัน |
| เลือกคำตอบ/ประกอบคำถามและประโยค | แบบฝึกหัด PDF 9–12; ชีท PDF 15, 20–21 | เลือกคำถามให้ตรงข้อมูลที่ต้องการ หรือเรียงคำตอบในสถานการณ์ คงตารางผันกริยาเป็นสื่ออ้างอิงในหมวดไวยากรณ์ |
| สัมภาษณ์เป็นวง/บทบาทสมมติในงานพบปะ | ชีท PDF 16; สไลด์ PDF 49 | แต่ละข้อเป็นบทพูดของ A แล้ว B ตอบ ใช้การ์ดข้อมูลที่มองเห็นจริง ห้ามเขียนว่า “บัตร” ทั้งที่ไม่มีวัตถุบนหน้าจอ |
| อาชีพปัจจุบันเทียบอาชีพในฝัน | ชีท PDF 27; สไลด์ PDF 72, 74 | ข้อมูลฝั่งงานปัจจุบันกับภาพความฝันแยกกัน ให้เลือกตอบแต่ละคำถาม ก่อนสร้างคำตอบของตัวเองโดยสมัครใจ |

ชีท PDF 28–29 เป็นคำศัพท์เครือญาติ แม้อยู่ก่อนหน้าคั่นบท 3 จึงไม่ยกทั้งหมดเข้าหมวดประโยคบท 2 ใช้หนังสือกำหนดขอบเขตหลัก รายการศัพท์อาชีพและตารางกริยาก็ไม่ใช่กิจกรรมประโยคโดยตัวมันเอง

## ลำดับการเรียนที่เสนอ

แต่ละช่วงมีตัวอย่างสั้นก่อนลงมือทำ จำนวนข้อสุดท้ายต้องมาจาก target ที่ตรวจจริง ไม่กำหนดตายตัวว่าทุกหัวข้อต้องมีห้าข้อ

| ช่วง | สิ่งที่เรียน | สื่อและการตอบที่เหมาะ | ตัวอย่างที่แต่งเพื่อออกแบบ |
| --- | --- | --- | --- |
| 1 อาชีพและที่ทำงาน | ถามอาชีพแบบ du/Sie และบอกงาน/ที่ทำงาน | ภาพการทำงาน → ตัวอย่าง A/B → เลือกคำตอบ → เรียงคำ โดย als/bei เป็นคนละ response target | A: Was machst du beruflich? B: Ich arbeite als Friseurin. / Ich arbeite bei Haarfit. |
| 2 สถานะการทำงาน | ฝึกงาน เป็นลูกจ้าง ทำงานอิสระ ไม่ได้ทำงานขณะนี้ | ฉากพร้อมข้อมูลสถานะที่กำหนด → เลือกประโยค ไม่ตัดสินว่างงานจากภาพคนอยู่บ้าน | Ich mache ein Praktikum. / Ich bin angestellt. / Ich arbeite im Moment nicht. |
| 3 อายุ | ขอและบอกอายุ | ตัวอย่างพูด → เสียงถาม/ตอบ → เลือกหรือเติมเลขที่ยังไม่ปรากฏ ก่อนผสมเป็นประโยค | A: Wie alt bist du? B: Ich bin 28 Jahre alt. |
| 4 อาศัยอยู่ที่ไหน | ถามตอบที่อยู่ของคนเดียวและคู่ | หมุดเมือง/ข้อมูลที่อยู่ → ถามตอบ จาก Ich wohne in … ไป Wir wohnen in … ตามบทบาท | A: Wo wohnt ihr? B: Wir wohnen in Berlin. |
| 5 ชีวิตคู่และลูก | อยู่ด้วยกัน แต่งงาน มี/ไม่มีลูก เป็นข้อมูลแยกกัน | สัมภาษณ์คู่ พร้อมข้อเท็จจริงที่เพียงพอ → เลือกคำตอบ Ja/Nein; รูปเป็นเพียงฉาก | A: Seid ihr verheiratet? B: Nein, wir sind nicht verheiratet. |
| 6 อาชีพในฝัน | แยกปัจจุบันกับความต้องการ | แผงงานปัจจุบันและความฝัน → ฟัง/เลือก → เติมกรอบประโยคอย่างมีตัวช่วย | A: Und was ist dein Traumberuf? B: Mein Traumberuf ist Arzt. |
| 7 ติดต่อและแนะนำตัวรวม | ขอเบอร์และนำข้อมูลส่วนตัวมาประกอบ | เสียงเบอร์สมมติ → เติมตัวเลข → อ่าน/ฟังโปรไฟล์แล้วเติมช่องข้อมูล → สร้างข้อความสั้น | A: Wie ist deine Handynummer? B: Meine Handynummer ist … |

ช่วง 1–5 ยึดเป้าหมายหลักในหนังสือ ช่วง 6–7 มีชีทและสไลด์รองรับโดยตรง กิจกรรมรวมเชื่อมชื่อ/ประเทศที่เรียนบท 1 ไม่สรุปว่าเบอร์โทรเป็นเนื้อหาที่ไม่มีต้นทางอีกแล้ว ไม่คัดลอกเบอร์โทรหรือข้อมูลผู้เรียนที่เขียนอยู่ในชีทมาใช้ ใช้ข้อมูลสมมติเท่านั้น

freiberuflich กับ selbstständig อาจใช้ได้ทั้งคู่ในบางสถานการณ์ ห้ามใช้เป็นตัวลวงผิดของกันและกันโดยไม่มีความแตกต่างที่โจทย์สอนและระบุชัด ปฏิเสธการทำงานขณะนี้ก็ไม่ได้บอกเองว่าเป็นนักเรียน เกษียณ หรือว่างงาน ต้องมีข้อมูลรองรับ

คำถามที่มีคำตอบถูกได้หลายประโยค เช่น Ich bin Friseurin. และ Ich arbeite als Friseurin. ต้องรับหลายคำตอบเมื่อสร้างอิสระ หรือออกแบบตัวเลือกให้มีคำตอบที่ตรงบริบทเพียงข้อเดียว การเปลี่ยนเป็นพิมพ์ต้องรองรับตัวพิมพ์ใหญ่/เล็กและเครื่องหมายตามเกณฑ์ที่ตกลง ห้ามใช้ exact string เดียวมาตัดสินประโยคเทียบเท่าโดยไม่ทบทวน

## ตัวอย่างหน้าจอที่ลองกดได้

เปิด `/prototypes/l02-phrases-design.html` มีสี่สถานการณ์ ตัวเลือก/เรียงคำ/ตรวจ/ย้อนกลับทำงานในหน้านี้ และแสดงเฉลยสั้น ภาพช่างทำผมคู่ใช้ตอบรูปพหูพจน์ “Wir arbeiten als Friseure.” ไม่บังคับเดาว่าใครในภาพเป็นผู้ตอบคนเดียว ภาพนี้ใช้ของเดิมในโครงการ ส่วนข้อความ ตัวเลือก และข้อมูล Nora/Haarfit แต่งขึ้นเพื่อแสดงการออกแบบ ไม่ใช่คำตอบเฉลยของสำนักพิมพ์

หน้าจออ่านอายุแสดงข้อความต้นทางและถามอายุ จึงวัดการอ่าน ไม่ใช่การฟัง ไม่แสร้งใส่ปุ่มฟังที่ยังไม่มีเสียง ต้นแบบทั้งสี่ยังไม่มีเสียงบท 2 และไม่บันทึกบัญชี รีโหลดจะเริ่มใหม่ ไม่มีคะแนน Progress หรือ ItemExposure ใหม่ และยังไม่ใช่ตัวแทนทุกช่วงของหลักสูตรที่เสนอ

## เป้าหมายและหลักฐานที่จะเก็บ

รหัสต่อไปนี้เป็น candidate สำหรับออกแบบ ยังไม่ลงทะเบียนในเซิร์ฟเวอร์ ใช้ `L02-COMM-*` ที่มีอยู่เป็น objective และคง draft target เดิมถ้าความหมายตรงกัน ก่อน implement ต้อง reconcile กับ `a11-phrase-expansion-draft.json` ไม่สร้าง duplicate สำหรับประโยคเดียวกัน

| Candidate task/target | เป้าหมาย / subskill | ต้องเรียนก่อนและตัวช่วย | ความยากที่เสนอ / วิธีตรวจ |
| --- | --- | --- | --- |
| L02-UX-PROF-01 | L02-COMM-01 / phrase_dialogue_response | รู้คำถามอาชีพและภาพงานช่างทำผม บทตัวอย่างและตัวเลือก | 1 ต้องเลือกคำตอบอาชีพพหูพจน์จากสถานการณ์; ไม่ใช่ผลิตประโยคเอง |
| L02-UX-WORK-01 | L02-COMM-01 / phrase_word_order | เรียน bei + ชื่อที่ทำงาน มีข้อมูลสถานที่และคำให้ทั้งหมด | 2 เรียง Ich arbeite bei Haarfit.; แยกข้อผิดลำดับจากไม่รู้ความหมาย |
| L02-UX-AGE-READ-01 | L02-COMM-03 / person_detail_reading | เข้าใจ bin … Jahre alt มีบทอ่านและตัวเลขตัวเลือก | 1 อ่านหาอายุ; ไม่ปนกับเสียงตัวเลข |
| L02-UX-AGE-AUDIO-01 | L02-COMM-03 / age_listening | ผ่านตัวอย่างคำถามอายุ มีเสียงสองคนและ replay ไม่มีอายุเขียนไว้ | 2 ฟังเลขแล้วเลือก; ผลแยกจากอ่านและพิมพ์ |
| L02-UX-HOME-01 | L02-COMM-02 / phrase_dialogue_response | เรียน Wo wohnt ihr? กับ Wir wohnen in … มีเมืองที่กำหนด | 2 ระบุผู้ตอบเป็นคู่ ไม่ใช้ Ich แทน Wir |
| L02-UX-COUPLE-01 | L02-COMM-04 / phrase_dialogue_response | เรียน Seid ihr verheiratet? มีข้อมูลอยู่ด้วยกัน/ไม่ได้แต่งงาน | 2 เลือก Nein, wir sind nicht verheiratet.; ไม่อนุมานจากรูป |
| L02-UX-CHILDREN-01 | L02-COMM-04 / phrase_dialogue_response | เรียน Habt ihr Kinder? และ haben keine Kinder; ระบุมี/ไม่มีลูก | 2 แยกผลจากสถานภาพแต่งงาน แม้ใช้ภาพเดียวกัน |
| L02-UX-DREAM-01 | L02-COMM-01 / current_vs_dream_meaning | เรียน Traumberuf และประโยคคำตอบ มีข้อมูลปัจจุบัน/ความฝันแยกกัน | 2 เลือกคำตอบตามชนิดข้อมูล ไม่ใช่รู้ชื่ออาชีพอย่างเดียว |
| L02-UX-PHONE-01 | L02-COMM-05 / phone_digit_listening | รู้ชื่อเลขและประโยคขอเบอร์ เสียงสมมติ replay ไม่มีเลขคำตอบเขียนไว้ | 3 พิมพ์ตัวเลข ตรวจเป็นลำดับเลขแยกจากสะกดคำเยอรมัน |
| L02-UX-PROFILE-01-{age,home,work} | แยก L02-COMM-03/02/01 / person_detail_reading | อ่านข้อมูลบุคคลแล้วเติมช่องว่าง; ช่องละ target | 2 ตรวจแยกแต่ละฟิลด์ ไม่ให้คะแนนรวมเดียวจนหาเหตุผิดไม่ได้ |

ทุก target มีสถานะเริ่มต้น unknown. รุ่นที่มีตัวเลือก/คำให้/บทตัวอย่างเป็น assisted evidence. การดูตัวอย่างหรือเห็นภาพไม่ทำให้ผ่าน mastery อัตโนมัติ ชื่ออาชีพที่แสดงเป็นป้ายคำนามเดี่ยวต้องใช้ Artikel และ NounText; ใน Ich bin Friseurin. / als Friseurin ไม่เติม Artikel นำหน้าโดยกลไก

## การเลือกสิ่งที่ฝึกต่อ

นโยบายนี้เป็นข้อเสนอ ยังไม่ถูกเปิดใช้: รอบเรียนครั้งแรกเดินตามสถานการณ์ที่เสนอ; Practice ครั้งต่อไปต้องใช้ผลแยกตาม subskill ไม่ใช่เล่นข้อผิดซ้ำทั้งหมด

- อ่านอายุถูกแต่ฟังผิด: เลือกเสียงอายุใหม่ พร้อมตัวเลือกก่อนค่อยลดตัวช่วย ไม่ส่งกลับไปอ่านประโยคเดิม
- รู้ว่า bei บอกที่ทำงานแต่เรียงคำผิด: เลือกเรียงคำของสถานที่ทำงานใหม่ ไม่ให้ท่องความหมายอาชีพซ้ำ
- สับสนอยู่ด้วยกันกับแต่งงาน: เปลี่ยนคู่สมมติและให้ข้อมูลสองสถานะแยกกัน ไม่เดาจากภาพ
- ตอบถูกโดยมีตัวช่วย: เก็บผลตามจริง ก่อนเพิ่มงานพิมพ์ใน subskill เดียวกันต้องมีคำตอบแรกถูกในอย่างน้อยสองสถานการณ์อิสระต่างรอบ ไม่มีตัวช่วยเฉลยคำตอบ แล้วทดลองแบบลดตัวช่วย เกณฑ์นี้เป็นค่าผลิตภัณฑ์เสนอเพื่อทดสอบ ไม่ใช่เกณฑ์วิจัยหรือ mastery
- ปฏิเสธการเพิ่มความยากถ้าเสียงเล่นไม่สำเร็จหรือข้อมูลไม่พอ คงเป็น unknown/technical failure ไม่ตีความเป็นไม่รู้ภาษา

คิวที่เริ่มแล้วต้องคงเดิม บันทึกเหตุผลการเลือก ข้อที่ถูกเพราะเพิ่งจำตัวอย่างไม่ใช้แทนผลทวนต่างวัน และเลือกไม่เกินหนึ่ง variant ของ target เดียวกันต่อรอบ

## เส้นทางข้อมูลและการแทนหน้าเดิม

| การเชื่อม | ของเดิม / งานที่ต้องทำ | สถานะ |
| --- | --- | --- |
| เนื้อหา → Learn exposure | `L02PhraseLearning` ใช้ `useLearning().act('expose')`; ต้องผูกหน้าตัวอย่างใหม่กับ item ที่สอนจริง | มีของเดิม; การแทนยังออกแบบ |
| การตอบ → target/subskill | ตาราง candidate ด้านบน; renderer/grader/เสียงบท 2 ยังต้องทำ | ออกแบบ; ต้นแบบสี่หน้าตรวจในหน่วยความจำเท่านั้น |
| คำตอบแรก/ตัวช่วย → บัญชี | ต้องคง ItemExposure และรหัส L02-status-*, L02-traumberuf, L02-question-was, L02-pattern-* รวมถึงสถานะเดิม; เพิ่ม versioned Learn checkpoint โดยไม่ใช้ค่าเห็นแล้วแทนคำตอบ | ยังไม่เชื่อม |
| ประวัติ → learner state | แยกอ่าน/ฟัง/เรียงคำ/ผลิตภาษาและตัวช่วย ตามข้อเสนอข้างต้น | ออกแบบ ยังไม่ implement |
| state → next task | เลือก variant ที่วัด subskill เดิมและเก็บเหตุผล คงคิวที่ค้าง | ออกแบบ ยังไม่ implement |
| Practice → shared account session | ใช้ `learner_practice_sessions`, PracticeAccountSync และ server validator เมื่อทำ Practice จริง ห้ามใช้ Learn checkpoint เป็นคลังผล Practice ใหม่ | เป็นข้อกำหนดการเชื่อม ยังไม่ทำในงานออกแบบ |
| ทางเข้า | เมื่อตรวจและพัฒนาแล้วแทน `/learn/L02/phrases` ในบัญชีเทส ปรับหน้าคำถาม/ประโยคย่อยเป็นส่วนเดียวกัน พร้อมรักษาลิงก์เก่า | ยังไม่เปลี่ยน route |

ก่อนแทนจริงต้องตรวจบท 2 ของบัญชีเทส/บัญชีปกติ การทำต่อร่างเดิม คำตอบแรก การเปลี่ยนบัญชี ข้อมูลบทเดิมที่เรียนแล้ว มือถือ เสียงจริง และการออกหน้า/กลับเข้า ไม่เขียนทับค่าความก้าวหน้าเก่าด้วยจำนวนหน้าที่เปลี่ยนไป งานนี้ยังไม่ deploy และไม่อ้างว่าเนื้อหาทั้งบทถูกนำขึ้นระบบแล้ว

## การตรวจต้นแบบ

`tests/l02-phrase-design-browser.mjs` ผ่านครบสี่หน้าจอ: เลือกคำตอบ เรียงคำ นำคำกลับก่อนตรวจ เฉลย และความกว้างมือถือ 390px ภาพโหลดได้และไม่มี browser error ตรวจภาพหน้าจอเดสก์ท็อป/มือถือแล้ว การตรวจนี้ไม่ใช่การทดสอบเสียงหรือระบบบัญชีของบท 2 เพราะยังไม่ได้ implement ในต้นแบบ

## Implementation follow-up, 6 November 2026

The local tester route `/learn/L02/phrases` now replaces the previous table/list lesson with seven model screens and 18 learning activities, totaling 25 screens and 20 scored response units. The three profile fields have distinct first-response evidence. `/learn/L02/phrases/sentences` also opens this same lesson for testers; the normal-account routes retain their original behavior. This is a replacement, with no new separate lesson menu.

The reviewed authored scenarios live in `scripts/exercise-mapping/build-l02-phrase-discovery.py`; it generates `src/data/l02-phrase-discovery.ts`, the source/assessment mapping in `l02-phrase-discovery-inventory.json` and the nine-clip voice manifest `l02-phrase-audio.json`. The bundled clips use Katja for A and Conrad for B, with a short turn gap, rather than relying on a device having two German voices. The audio-building script is `scripts/exercise-mapping/build-l02-phrase-audio.py`. Scenarios, recordings and feedback are product-authored, not copied publisher audio or answer keys. No handwritten personal phone numbers are reused.

Implementation paths are `src/components/l02-phrase-discovery.tsx` and `src/lib/phrase-dialogue-learning.ts`. New drafts, model visits, replay completions, word help, first answers, per-unit target/subskill, difficulty, assistance and presentation version are stored in the existing account Learn checkpoint service under `deutsch-trainer-phrase-discovery-v1-L02`. The local database allowlist is extended by `scripts/test-workspace-phrase-discovery.sql`; RLS remains unchanged. This is not a new Practice result store or a hosted migration.

Historical item IDs, exposures and other lesson-state rows are preserved. When a model is explicitly continued, only available legacy IDs actually represented on that model are exposed through the existing `useLearning().act('expose')` service. New authored targets use the new versioned Learn evidence; they do not turn old exposure into demonstrated ability. The old tab position/grammar drafts are retained rather than coerced into a new numeric step. Neither those existing records nor this Learn checkpoint creates a calibrated mastery score for the new material.

The prototype implements choice, supplied-word ordering, audio-to-digit entry and a three-field reading profile. It does not implement every source mechanic: open-ended personal writing, live mime, multi-person interviews, grouped matching and the proposed adaptive selector remain outside this version. Recognition, reading, listening, word order and current/dream interpretation remain distinct in first-response evidence. The guided first-learning order is fixed; learner-state aggregation, history-based next-task selection, general Practice eligibility and Progress scoring for new targets remain unimplemented. Do not describe this as a completed adaptive rollout.

The proposed task names in the original design remain candidate examples. Actual task IDs and unit bindings are authoritative in the generated inventory. Same-function variations such as HOME-02 use separate task/target IDs because they change speaker plurality; legacy phrase targets and prior expansion draft IDs remain intact. Before promoting this bank to ordinary Practice, reconcile its variants with the shared phrase registry, add the server validator/migration and verify learned-target eligibility through the shared account practice service.

### Implementation verification

Four unit tests in `tests/l02-phrase-discovery.test.ts` pass for queue/target counts, replay requirements, leading-zero preservation, independent profile grading, pending drafts, incorrect first answers and rejection of malformed/skipped history. TypeScript passes. `tests/l02-phrase-discovery-browser.mjs` completes seven teaching screens and all 18 activities using actual audio, tests failure/retry and reload/removal of a partial ordering, preserves an incorrect first response, verifies twenty stored evidence units, checks 390px layout, account isolation, the normal-account gate and unchanged other lesson-state rows. Desktop/mobile screenshots were inspected. Model recordings are decoded; the age and phone clips play through to actual completion. This verifies supported Learn and account checkpoints, not pronunciation certification, new Progress scoring or active adaptive selection.

Shared-renderer follow-up, 6 November 2026: `L02PhraseDiscovery` now wraps `PhraseDialogueLearning` for reuse by L03–L12. The L02 storage key, queue IDs, canonical answers and `l02-dialogue-v1` presentation stay unchanged. Additional lesson branches do not reinterpret or reset L02 first responses.
