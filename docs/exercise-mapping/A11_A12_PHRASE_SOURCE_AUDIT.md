# ตรวจคลังประโยค L01–L12 เทียบแหล่งเรียน

วันที่ตรวจ: 2026-11-04. สร้างรายงานจาก metadata ที่ตรวจด้วยตาใน `a11-phrase-source-review.json` และคลังจริงด้วย `python3 scripts/exercise-mapping/audit-a11-phrases.py`. ตรวจความตรงกันด้วย `--check`.

## ขอบเขตและความหมายของผล

ตรวจครบ 12 บทในระดับหน้าที่สื่อสาร และผูกประโยคเดิมทุกรายการกับหน้าที่หรือบริบทประกอบ. นี่เป็นการตรวจช่องว่างของคลังที่ใช้สร้างโจทย์ ไม่ใช่การรวบรวมสำนวนทุกบรรทัดในหนังสือ ไม่ใช่การรับรองคำแปล/ตัวลวงทุกข้อ และยังไม่ใช่กิจกรรม Learn ที่ออกแบบใหม่.

คำว่า “ไม่มี” หมายถึงไม่มี target ใน phrase bank นี้เท่านั้น. เนื้อหาอาจปรากฏใน Wortschatz/Grammatik หรือหน้าเรียนเดิมอื่น เช่น สถานภาพครอบครัว L02. ก่อนเพิ่ม target ต้องเชื่อม ID และหลักฐานที่มีอยู่ เพื่อลดข้อมูลซ้ำ.

แหล่งหลัก: `หนังสือเรียน Moment A1 Lektion 1-12.pdf` (107 หน้า PDF). SHA-256 `e7be5c58f91192c48e45f650a22f933fbad65b851d949c39e35d356ea869b576`. เลขหน้า PDF เป็นหนึ่งฐานและแยกจากเลขพิมพ์. อ่านต้นฉบับในเครื่อง; ภาพตรวจอยู่ใน ignored `.tools` และไม่ใช่สื่อสำหรับผู้เรียน.

ข้อจำกัดแหล่งที่ตรวจ:

- PDF order differs from printed pagination: PDF 52–57 contains printed 39–44 after printed 53–56 at PDF 48–51.
- Printed 57–62 are not present in that expected module sequence; this audit uses L07–L09 main activities and TOC, not an unseen summary.
- No listening audio, videos, complete partner-page inventory, workbook, worksheet or teacher-slide review in this pass.
- Mapping below means communicative-function alignment, not exact publisher wording or certification of Thai translations/distractors.

## จำนวนจริงและช่องว่างรายบท

| บท | ประโยคเดิม | นิยามคำตอบ | หน้าที่หลักที่มีบางส่วน | หน้าที่หลักที่ยังไม่มี |
| --- | ---: | ---: | ---: | ---: |
| L01 | 9 | 24 | 4 | 1 |
| L02 | 8 | 24 | 1 | 3 |
| L03 | 10 | 30 | 2 | 1 |
| L04 | 10 | 30 | 2 | 1 |
| L05 | 10 | 30 | 1 | 3 |
| L06 | 10 | 30 | 0 | 2 |
| L07 | 10 | 30 | 3 | 1 |
| L08 | 10 | 28 | 2 | 1 |
| L09 | 10 | 30 | 1 | 2 |
| L10 | 10 | 30 | 1 | 3 |
| L11 | 10 | 30 | 1 | 2 |
| L12 | 10 | 30 | 1 | 2 |
| รวม | 117 | 346 | 19 | 22 |

จำนวนหน้าที่เป็นหน่วยวิเคราะห์ที่เลือกในรอบนี้ ไม่ใช่คะแนนความครอบคลุมหรือเปอร์เซ็นต์ความชำนาญ. หน้าที่กว้างและแคบมีขนาดไม่เท่ากัน. ประโยคเดิมแต่ละรายการผูกหน้าที่หลักหนึ่งแห่งเพื่อให้นับซ้ำไม่ได้; บางประโยคใช้ประกอบหลายหน้าที่ได้ภายหลัง.

L01 ดึง 9 รายการจาก seed catalog; L02 ดึงคำถาม 2 รายการและสถานะงาน 6 ตัวอย่าง; L03–L12 ใช้ตัวอย่างที่แต่งบทละ 10 รายการ. จำนวนไม่ได้คำนวณจากความครอบคลุมหน้าที่สื่อสารในหนังสือ. ตัวสร้างขยายหนึ่งประโยคเป็นเลือกความหมาย เลือกประโยคจากคำแปลไทย และเรียงคำเมื่อมีอย่างน้อยสามคำ. 346 นิยามจึงไม่เท่ากับ 346 สำนวนหรือสถานการณ์ใหม่.

## ผลตรวจรายบทและ mapping ประโยคเดิม

### L01

9 ประโยคครอบคลุมแกนบางส่วน แต่ยังไม่ครบหน้าที่สื่อสารของ L01; การมี Alphabet ในหมวดอื่นไม่แทนบทสนทนาขอสะกดชื่อ

หลักฐานที่ตรวจด้วยตา: PDF 8 / พิมพ์ 6 (Inhalt: L01); PDF 11 / พิมพ์ 9 (1a–c; Lernziele); PDF 12 / พิมพ์ 10 (2a–c, 3a–b); PDF 13 / พิมพ์ 12 (8a–c; Schnelltest Kommunikation); PDF 27 / พิมพ์ 26 (Kommunikation L01).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L01-COMM-01 | ทักทายและลา | มีบางส่วน | มีเฉพาะการลาอย่างสุภาพ; ขาดคำทักทายตามช่วงวันและการลาแบบกันเอง |
| L01-COMM-02 | ถามชื่อ แนะนำตนเองและผู้อื่น | มีบางส่วน | มีถามชื่อ du/Sie และตอบด้วย ich heiße; ขาด wer bist/sind, mein Name ist และ das ist … |
| L01-COMM-03 | ถามทุกข์สุขและถามกลับ | มีบางส่วน | ขาดรูปสุภาพ ช่วงคำตอบดีมาก/ไม่ค่อยดี และ Und dir/Ihnen? |
| L01-COMM-04 | ถามและบอกที่มา | มีบางส่วน | มีคู่กันเอง; ขาดคำถามสุภาพและการบอกที่มาของผู้อื่น |
| L01-COMM-05 | ขอให้พูดซ้ำ สะกดชื่อ และขอบคุณ | ไม่มีในคลังนี้ | ขาด Entschuldigung/Wie bitte? และการโต้ตอบเมื่อฟังชื่อไม่ทัน |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| phrases-L01-6 | Auf Wiedersehen! | L01-COMM-01 | existing-published-catalog |
| phrases-L01-0 | Wie heißt du? | L01-COMM-02 | existing-published-catalog |
| phrases-L01-1 | Wie heißen Sie? | L01-COMM-02 | existing-published-catalog |
| phrases-L01-7 | Ich heiße Sun. | L01-COMM-02 | existing-published-catalog |
| phrases-L01-3 | Wie geht es dir? | L01-COMM-03 | existing-published-catalog |
| phrases-L01-4 | Gut, danke. | L01-COMM-03 | existing-published-catalog |
| phrases-L01-5 | Es geht. | L01-COMM-03 | existing-published-catalog |
| phrases-L01-2 | Woher kommst du? | L01-COMM-04 | existing-published-catalog |
| phrases-L01-8 | Ich komme aus Thailand. | L01-COMM-04 | existing-published-catalog |

### L02

มีเนื้อหาสถานภาพ/อายุอยู่ในหมวดอื่นของระบบ แต่ยังไม่ใช่เป้าหมาย phrase bank นี้; สถานะ published เดิมไม่ยืนยันว่าเป็นข้อความตรงจากหนังสือ

หลักฐานที่ตรวจด้วยตา: PDF 8 / พิมพ์ 6 (Inhalt: L02); PDF 14 / พิมพ์ 13 (1a–b; Lernziele); PDF 15 / พิมพ์ 14 (2a–c, 3); PDF 16 / พิมพ์ 15 (4, 5a–c); PDF 17 / พิมพ์ 16 (6–8; Schnelltest Kommunikation); PDF 27 / พิมพ์ 26 (Kommunikation L02).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L02-COMM-01 | ถามและตอบเรื่องอาชีพ/งาน | มีบางส่วน | มีคำถามและสถานะงาน แต่ขาดคำตอบอาชีพจริง เช่น Ich bin … von Beruf, Ich arbeite als … / bei … และรูปสุภาพ |
| L02-COMM-02 | บอกที่อยู่อาศัย | ไม่มีในคลังนี้ | ขาด Wo wohnst/lebst du? และ Ich wohne/lebe in … |
| L02-COMM-03 | ถามอายุและบอกอายุ | ไม่มีในคลังนี้ | ขาด Wie alt bist du? และ Ich bin … Jahre alt |
| L02-COMM-04 | บอกสถานภาพ ครอบครัว และการอยู่ร่วมกัน | ไม่มีในคลังนี้ | ขาด verheiratet/geschieden/Single, zusammenleben และมี/ไม่มีลูกในคลังประโยคนี้ |
| L02-COMM-05 | ข้อมูลติดต่อเสริม | เสริม/ทบทวนขอบเขต | เก็บประวัติเดิมไว้; ไม่พบ Handynummer เป็นเป้าหมายหลักในหน้าบทและสรุปที่ตรวจ |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L02-pattern-profession | Was bist du von Beruf? | L02-COMM-01 | existing-published-l02-migration |
| L02-status-praktikum | Ich mache ein Praktikum. | L02-COMM-01 | existing-published-l02-migration |
| L02-status-arbeitslos | Ich bin arbeitslos. | L02-COMM-01 | existing-published-l02-migration |
| L02-status-nicht-arbeiten | Ich arbeite nicht. | L02-COMM-01 | existing-published-l02-migration |
| L02-status-freiberuflich | Ich bin freiberuflich. | L02-COMM-01 | existing-published-l02-migration; ไม่พบรูปนี้ในหน้าหนังสือที่ตรวจ; ทบทวนแหล่งเสริม |
| L02-status-selbststaendig | Ich bin selbstständig. | L02-COMM-01 | existing-published-l02-migration; ไม่พบรูปนี้ในหน้าหนังสือที่ตรวจ; ทบทวนแหล่งเสริม |
| L02-status-angestellt | Ich bin angestellt. | L02-COMM-01 | existing-published-l02-migration; ไม่พบรูปนี้ในหน้าหนังสือที่ตรวจ; ทบทวนแหล่งเสริม |
| L02-pattern-phone | Wie ist deine Handynummer? | L02-COMM-05 | existing-published-l02-migration; ต้องตรวจต้นทางชีท/สไลด์ก่อนเรียกว่าเนื้อหาหลักของหนังสือ |

### L03

ประโยคตัวอย่างที่แต่งสอดคล้องบางหน้าที่ แต่ไม่ควรแทนความหลากหลายของการตอบในบท

หลักฐานที่ตรวจด้วยตา: PDF 8 / พิมพ์ 6 (Inhalt: L03); PDF 18 / พิมพ์ 17 (1a–b); PDF 19 / พิมพ์ 18 (2–4); PDF 20 / พิมพ์ 19 (5–8); PDF 21 / พิมพ์ 20 (9; Schnelltest Kommunikation); PDF 27 / พิมพ์ 26 (Kommunikation L03).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L03-COMM-01 | ระบุและถามความสัมพันธ์ในครอบครัว | มีบางส่วน | มีการแนะนำและถามชื่อญาติ; ขาดถามยืนยัน/ปฏิเสธและแก้ความสัมพันธ์ให้ถูก |
| L03-COMM-02 | คาดเดาและตอบยืนยัน/แก้ความเข้าใจ | ไม่มีในคลังนี้ | ขาด Ich glaube … และคำตอบ ja/nein/doch ที่อ้างภาพหรือข้อมูลจริง |
| L03-COMM-03 | ถามและบอกภาษาและระดับความสามารถ | มีบางส่วน | มีรายชื่อภาษาและตอบรับ; ขาด sehr gut/gut/ein bisschen/gar nicht และคำตอบปฏิเสธ |
| L03-COMM-04 | ข้อมูลบุคคลประกอบ | เสริม/ทบทวนขอบเขต | ประโยคพ่อแม่อยู่เมืองใดเป็นการใช้ความรู้เดิม ไม่เติมช่องว่างเรื่องระดับภาษาหรือการแก้ความสัมพันธ์ |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L03-P001 | Das ist meine Mutter. | L03-COMM-01 | product-authored-curriculum-aligned |
| L03-P002 | Das ist mein Bruder. | L03-COMM-01 | product-authored-curriculum-aligned |
| L03-P003 | Wie heißt deine Schwester? | L03-COMM-01 | product-authored-curriculum-aligned |
| L03-P004 | Meine Schwester heißt Lena. | L03-COMM-01 | product-authored-curriculum-aligned |
| L03-P009 | Das ist Marias Vater. | L03-COMM-01 | product-authored-curriculum-aligned |
| L03-P005 | Sprichst du Deutsch? | L03-COMM-03 | product-authored-curriculum-aligned |
| L03-P006 | Ja, ich spreche Deutsch. | L03-COMM-03 | product-authored-curriculum-aligned |
| L03-P007 | Welche Sprachen sprichst du? | L03-COMM-03 | product-authored-curriculum-aligned |
| L03-P008 | Ich spreche Thai und Deutsch. | L03-COMM-03 | product-authored-curriculum-aligned |
| L03-P010 | Meine Eltern wohnen in Berlin. | L03-COMM-04 | product-authored-curriculum-aligned |

### L04

ต้องออกแบบการโต้ตอบสองฝ่าย ไม่เพิ่มเพียงชื่อเฟอร์นิเจอร์ในประโยคแม่แบบ

หลักฐานที่ตรวจด้วยตา: PDF 8 / พิมพ์ 6 (Inhalt: L04); PDF 31 / พิมพ์ 30 (8a–b; Schnelltest Kommunikation); PDF 57 / พิมพ์ 44 (Kommunikation L04).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L04-COMM-01 | ถามราคาและบอกราคา | มีบางส่วน | ขาด Was kostet …? ราคา Euro/Cent และการตอบด้วย er/sie/es ในบริบทร้านค้า |
| L04-COMM-02 | ให้ความเห็นและประเมินสิ่งของ | มีบางส่วน | มีคำบรรยาย/ความเห็นเดี่ยว; ขาดความเข้ม sehr/wirklich และข้อจำกัด zu groß/klein |
| L04-COMM-03 | เห็นด้วย ไม่เห็นด้วย และถามความเห็นกลับ | ไม่มีในคลังนี้ | ขาด Das finde ich auch/nicht และ Finden Sie?/Findest du? |
| L04-COMM-04 | ระบุสิ่งของประกอบ | เสริม/ทบทวนขอบเขต | คู่ถามยืนยันเก้าอี้เป็นบริบทประกอบ ไม่แทนการแลกเปลี่ยนความเห็น |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L04-P003 | Wie viel kostet der Tisch? | L04-COMM-01 | product-authored-curriculum-aligned |
| L04-P004 | Der Tisch kostet achtzig Euro. | L04-COMM-01 | product-authored-curriculum-aligned |
| L04-P001 | Wie findest du das Sofa? | L04-COMM-02 | product-authored-curriculum-aligned |
| L04-P002 | Ich finde das Sofa schön. | L04-COMM-02 | product-authored-curriculum-aligned |
| L04-P005 | Ist die Lampe neu? | L04-COMM-02 | product-authored-curriculum-aligned |
| L04-P006 | Nein, sie ist alt. | L04-COMM-02 | product-authored-curriculum-aligned |
| L04-P007 | Das Bild ist sehr schön. | L04-COMM-02 | product-authored-curriculum-aligned |
| L04-P010 | Die Möbel sind praktisch. | L04-COMM-02 | product-authored-curriculum-aligned |
| L04-P008 | Ist das der Stuhl? | L04-COMM-04 | product-authored-curriculum-aligned |
| L04-P009 | Ja, das ist er. | L04-COMM-04 | product-authored-curriculum-aligned |

### L05

7 จาก 10 รายการกระจุกที่การระบุสิ่งของ ขณะที่หลายหน้าที่หลักยังไม่มี

หลักฐานที่ตรวจด้วยตา: PDF 8 / พิมพ์ 6 (Inhalt: L05); PDF 34 / พิมพ์ 33 (4b–c, 5a–c); PDF 35 / พิมพ์ 34 (6a–b; Schnelltest Kommunikation); PDF 57 / พิมพ์ 44 (Kommunikation L05 และขอบเขตขอบคุณ L06).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L05-COMM-01 | ถามและบอกว่าสิ่งของคืออะไร | มีบางส่วน | มีหลายประโยคที่แทนคำนามในโครงสร้างเดิม; ขาดถามคำศัพท์ภาษาเยอรมันและถามวิธีสะกด |
| L05-COMM-02 | บรรยายสีและวัสดุ | ไม่มีในคลังนี้ | ขาด Es ist aus … / Es ist … ในเกมทายสิ่งของ |
| L05-COMM-03 | ขอให้พูดซ้ำและขอบคุณตอบรับ | ไม่มีในคลังนี้ | ขาด Wie bitte?/Noch einmal, bitte และการตอบรับขอบคุณ; หน้า 33 ฝึกแล้วแม้สรุปติดป้าย L06 |
| L05-COMM-04 | ถามและบอกอีเมล | ไม่มีในคลังนี้ | ขาดการอ่านจุด @ และขีดล่างจากข้อมูลติดต่อ |
| L05-COMM-05 | การมี/ต้องการสิ่งของใน Akkusativ | เสริม/ทบทวนขอบเขต | เป็นตัวอย่างเหมาะกับ L06 มากกว่าเป้าหมายหลัก L05; รักษา IDs เดิมและทบทวน prerequisite ก่อนใช้ |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L05-P001 | Was ist das? | L05-COMM-01 | product-authored-curriculum-aligned |
| L05-P002 | Das ist ein Glas. | L05-COMM-01 | product-authored-curriculum-aligned |
| L05-P003 | Ist das ein Tisch? | L05-COMM-01 | product-authored-curriculum-aligned |
| L05-P004 | Nein, das ist kein Tisch. | L05-COMM-01 | product-authored-curriculum-aligned |
| L05-P005 | Ist das eine Tasche? | L05-COMM-01 | product-authored-curriculum-aligned |
| L05-P006 | Ja, das ist eine Tasche. | L05-COMM-01 | product-authored-curriculum-aligned |
| L05-P007 | Nein, das ist keine Tasche. | L05-COMM-01 | product-authored-curriculum-aligned |
| L05-P008 | Ich brauche einen Stift. | L05-COMM-05 | product-authored-curriculum-aligned; ใช้ einen/keinen ในบทก่อน Akkusativ ของ L06; ต้องทบทวนตำแหน่งและ prerequisite |
| L05-P009 | Hast du einen Schlüssel? | L05-COMM-05 | product-authored-curriculum-aligned; ใช้ einen/keinen ในบทก่อน Akkusativ ของ L06; ต้องทบทวนตำแหน่งและ prerequisite |
| L05-P010 | Ich habe keinen Schlüssel. | L05-COMM-05 | product-authored-curriculum-aligned; ใช้ einen/keinen ในบทก่อน Akkusativ ของ L06; ต้องทบทวนตำแหน่งและ prerequisite |

### L06

เป็นช่องว่างเร่งด่วน: หัวข้อคำศัพท์สำนักงานถูกใช้แทนหน้าที่สื่อสารทางโทรศัพท์

หลักฐานที่ตรวจด้วยตา: PDF 8 / พิมพ์ 6 (Inhalt: L06); PDF 39 / พิมพ์ 38 (9a–b; Schnelltest Kommunikation); PDF 57 / พิมพ์ 44 (Kommunikation L06).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L06-COMM-01 | รับสาย แนะนำตัว และขอสาย | ไม่มีในคลังนี้ | ขาด Firma … guten Tag / … hier / Ist Herr/Frau … da? |
| L06-COMM-02 | ให้รอ แจ้งว่าไม่อยู่ ขอบคุณ และจบสาย | ไม่มีในคลังนี้ | ขาด Einen Moment bitte / leider nicht da / การตอบรับและอำลา |
| L06-COMM-03 | สื่อสารเรื่องของใช้และงานในสำนักงาน | บริบทประกอบ | มีประโยคสำนักงาน 10 รายการ แต่ไม่มีโครงสนทนาทางโทรศัพท์ที่เป็นเป้าหมาย Kommunikation |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L06-P001 | Wir haben einen Termin. | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P002 | Ich brauche einen Computer. | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P003 | Hast du einen Drucker? | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P004 | Nein, ich habe keinen Drucker. | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P005 | Wo ist mein Handy? | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P006 | Ich habe zwei Bücher. | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P007 | Der Drucker ist kaputt. | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P008 | Brauchst du Papier? | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P009 | Ich schreibe eine E-Mail. | L06-COMM-03 | product-authored-curriculum-aligned |
| L06-P010 | Ich suche meine Maus. | L06-COMM-03 | product-authored-curriculum-aligned |

### L07

ตรวจจากกิจกรรม 46–48 โดยตรง; สรุป Kommunikation หน้าพิมพ์ 62 ไม่อยู่ในช่วงสแกนที่ควรมี

หลักฐานที่ตรวจด้วยตา: PDF 9 / พิมพ์ 7 (Inhalt: L07); PDF 41 / พิมพ์ 46 (4, 6, 7); PDF 42 / พิมพ์ 47 (8, 9; Wie oft?); PDF 43 / พิมพ์ 48 (10–11; Schnelltest Kommunikation).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L07-COMM-01 | ถามและบอกความสามารถ/ระดับความสามารถ | มีบางส่วน | มีได้/ไม่ได้/เก่ง; ขาด ein bisschen/nicht so gut และคำถาม ihr/Sie |
| L07-COMM-02 | ชมและตอบรับคำชม | มีบางส่วน | มีคำชม แต่ขาด Vielen Dank/Oh danke/Herzlichen Dank เป็นคำตอบในคู่สนทนา |
| L07-COMM-03 | ถามและบอกงานอดิเรก | มีบางส่วน | ขาด Was sind deine Hobbys?/Was machst du in deiner Freizeit? และ Das macht Spaß |
| L07-COMM-04 | ถามและบอกความถี่ | ไม่มีในคลังนี้ | ขาด Wie oft? และ immer/oft/manchmal/nie |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L07-P001 | Kannst du tanzen? | L07-COMM-01 | product-authored-curriculum-aligned |
| L07-P002 | Ja, ich kann tanzen. | L07-COMM-01 | product-authored-curriculum-aligned |
| L07-P003 | Ich kann nicht singen. | L07-COMM-01 | product-authored-curriculum-aligned |
| L07-P004 | Sie kann gut kochen. | L07-COMM-01 | product-authored-curriculum-aligned |
| L07-P005 | Kannst du schwimmen? | L07-COMM-01 | product-authored-curriculum-aligned |
| L07-P006 | Wir können zusammen spielen. | L07-COMM-01 | product-authored-curriculum-aligned |
| L07-P007 | Das kannst du super! | L07-COMM-02 | product-authored-curriculum-aligned |
| L07-P008 | Du tanzt sehr gut. | L07-COMM-02 | product-authored-curriculum-aligned |
| L07-P009 | Was machst du gern? | L07-COMM-03 | product-authored-curriculum-aligned |
| L07-P010 | Ich spiele gern Fußball. | L07-COMM-03 | product-authored-curriculum-aligned |

### L08

ต้องมีสถานการณ์ตารางนัดเพื่อให้เลือกคำตอบเดียวได้; ไม่อนุมานความสามารถบอกเวลาจาก um acht Uhr

หลักฐานที่ตรวจด้วยตา: PDF 9 / พิมพ์ 7 (Inhalt: L08); PDF 45 / พิมพ์ 50 (2, 4: Chat); PDF 46 / พิมพ์ 51 (5, 6a–c); PDF 47 / พิมพ์ 52 (7a–b; Schnelltest Kommunikation).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L08-COMM-01 | เสนอและนัดทำกิจกรรม | มีบางส่วน | มีเสนอ/ถามเวลาเจอ แต่ขาดตัวเลือกเวลาและการเจรจาจากตารางว่าง |
| L08-COMM-02 | ตอบรับ ปฏิเสธ และเสนอเวลาใหม่ | มีบางส่วน | ขาดขอโทษ เหตุผล ไม่แน่ใจ และการเสนอวัน/เวลาอื่น |
| L08-COMM-03 | ถามและบอกเวลาปัจจุบัน | ไม่มีในคลังนี้ | ขาด Wie spät ist es?/Wie viel Uhr ist es? และรูป halb/Viertel/vor/nach |
| L08-COMM-04 | ข้อมูลวันเวลาและการลา | บริบทประกอบ | มีประโยควันเวลา แต่บอกเวลาเริ่มหนังไม่เท่ากับตอบคำถามเวลาปัจจุบัน |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L08-P001 | Hast du am Montag Zeit? | L08-COMM-01 | product-authored-curriculum-aligned |
| L08-P003 | Gehen wir am Freitag ins Kino? | L08-COMM-01 | product-authored-curriculum-aligned |
| L08-P005 | Wann treffen wir uns? | L08-COMM-01 | product-authored-curriculum-aligned |
| L08-P006 | Wir treffen uns um acht Uhr. | L08-COMM-01 | product-authored-curriculum-aligned |
| L08-P002 | Ich habe leider keine Zeit. | L08-COMM-02 | product-authored-curriculum-aligned |
| L08-P004 | Ja, gern. | L08-COMM-02 | product-authored-curriculum-aligned |
| L08-P007 | Ich komme am Samstag. | L08-COMM-04 | product-authored-curriculum-aligned |
| L08-P008 | Am Sonntag habe ich frei. | L08-COMM-04 | product-authored-curriculum-aligned |
| L08-P009 | Bis morgen! | L08-COMM-04 | product-authored-curriculum-aligned |
| L08-P010 | Der Film beginnt um sieben Uhr. | L08-COMM-04 | product-authored-curriculum-aligned |

### L09

เป็นช่องว่างเร่งด่วน: ไม่มีธุรกรรมร้านอาหารทั้งที่เป็นเป้าหมายหลักของบท

หลักฐานที่ตรวจด้วยตา: PDF 9 / พิมพ์ 7 (Inhalt: L09); PDF 49 / พิมพ์ 54 (3–7); PDF 50 / พิมพ์ 55 (8, 9a–b: Im Café); PDF 51 / พิมพ์ 56 (10; Schnelltest Kommunikation).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L09-COMM-01 | ถามและบอกความชอบอาหาร | มีบางส่วน | มีความชอบ/ไม่กิน แต่ขาดการถามตอบตามมื้ออาหารและ besonders gern |
| L09-COMM-02 | บอกพฤติกรรมการกินดื่มและความรู้สึก | บริบทประกอบ | คำบอกเล่าเดี่ยวไม่แทนบทสนทนาสั่งอาหาร |
| L09-COMM-03 | สั่งอาหาร รับคำสั่ง และตอบข้อเสนอ | ไม่มีในคลังนี้ | ขาด Sie wünschen?/Ich möchte …/… bitte/Möchten Sie …?/Nein danke |
| L09-COMM-04 | แจ้งว่าของหมดและเลือกอย่างอื่น | ไม่มีในคลังนี้ | ขาด wir haben kein … mehr / dann nehme ich … และบริบทเมนูคงเหลือ |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L09-P001 | Was isst du gern? | L09-COMM-01 | product-authored-curriculum-aligned |
| L09-P002 | Ich esse gern Pizza. | L09-COMM-01 | product-authored-curriculum-aligned |
| L09-P003 | Magst du Kaffee? | L09-COMM-01 | product-authored-curriculum-aligned |
| L09-P004 | Nein, ich mag keinen Kaffee. | L09-COMM-01 | product-authored-curriculum-aligned |
| L09-P006 | Ich mag Gemüse. | L09-COMM-01 | product-authored-curriculum-aligned |
| L09-P010 | Ich esse kein Fleisch. | L09-COMM-01 | product-authored-curriculum-aligned |
| L09-P005 | Ich trinke Wasser. | L09-COMM-02 | product-authored-curriculum-aligned |
| L09-P007 | Das Essen schmeckt gut. | L09-COMM-02 | product-authored-curriculum-aligned |
| L09-P008 | Wir essen heute Brot. | L09-COMM-02 | product-authored-curriculum-aligned |
| L09-P009 | Hast du Hunger? | L09-COMM-02 | product-authored-curriculum-aligned |

### L10

ประโยคพาหนะ 10 รายการยังไม่แทนการโต้ตอบและรับข้อมูลประกาศตามเป้าหมายบท

หลักฐานที่ตรวจด้วยตา: PDF 9 / พิมพ์ 7 (Inhalt: L10); PDF 59 / พิมพ์ 64 (4–5); PDF 61 / พิมพ์ 66 (10; Schnelltest Kommunikation); PDF 75 / พิมพ์ 80 (Kommunikation L10).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L10-COMM-01 | ถามและให้ข้อมูลออกเดินทาง/มาถึง/เปลี่ยนรถ | มีบางส่วน | มีเวลาและพาหนะ แต่ขาดถามชานชาลา/จุดเปลี่ยนและการขอให้มารับ |
| L10-COMM-02 | แสดงว่าเข้าใจและถามยืนยัน | ไม่มีในคลังนี้ | ขาด Verstehe/Alles klar/Bist du sicher? และการตอบรับคำขอ |
| L10-COMM-03 | แสดงความหวังและความดีใจ | ไม่มีในคลังนี้ | ขาด Hoffentlich … / Ich freue mich … ในบริบทเดินทาง |
| L10-COMM-04 | เข้าใจประกาศและคำเตือน | ไม่มีในคลังนี้ | ขาดการจับข้อมูล Bahnsteig/Gleis/Ausgang และคำเตือน; การอ่านไม่ยืนยันการฟัง |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L10-P001 | Wann kommst du an? | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P002 | Ich komme um neun Uhr an. | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P003 | Ich fahre mit dem Zug. | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P004 | Wo ist der Bahnhof? | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P005 | Der Zug fährt um zehn Uhr ab. | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P006 | Ich habe ein Ticket. | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P007 | Ist der Zug pünktlich? | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P008 | Der Bus kommt später. | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P009 | Ich nehme den Zug. | L10-COMM-01 | product-authored-curriculum-aligned |
| L10-P010 | Wir steigen hier um. | L10-COMM-01 | product-authored-curriculum-aligned |

### L11

มีการผันและตัวอย่างกิจกรรม แต่การเล่าเรื่องกับการถามเวลาเปิดยังไม่ครอบคลุม

หลักฐานที่ตรวจด้วยตา: PDF 9 / พิมพ์ 7 (Inhalt: L11); PDF 64 / พิมพ์ 69 (5–7); PDF 65 / พิมพ์ 70 (8a–c; Schnelltest Kommunikation); PDF 75 / พิมพ์ 80 (Kommunikation L11).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L11-COMM-01 | ถามและเล่ากิจกรรมที่ผ่านมา | มีบางส่วน | มีคำถาม/คำตอบ Perfekt เดี่ยว; ขาดการปฏิเสธ คำถามติดตาม และอ้างข้อมูลจากปฏิทิน |
| L11-COMM-02 | เล่าเหตุการณ์ต่อเนื่องและช่วงเวลา | ไม่มีในคลังนี้ | ขาด zuerst/dann/danach กับ von … bis/ab และ letzte Woche ในเรื่องที่มีข้อมูลให้ |
| L11-COMM-03 | ถามและตอบเวลาเปิดปิดหรือเริ่มกิจกรรม | ไม่มีในคลังนี้ | ขาด Wann ist … geöffnet/geschlossen? และ Wann beginnt …? |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L11-P001 | Was hast du gestern gemacht? | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P002 | Ich habe gearbeitet. | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P003 | Ich habe Musik gehört. | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P004 | Hast du gestern gekocht? | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P005 | Ja, ich habe gekocht. | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P006 | Ich habe eine E-Mail geschrieben. | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P007 | Was hast du am Abend gemacht? | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P008 | Ich habe ferngesehen. | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P009 | Wir haben Fußball gespielt. | L11-COMM-01 | product-authored-curriculum-aligned |
| L11-P010 | Ich habe viel gelernt. | L11-COMM-01 | product-authored-curriculum-aligned |

### L12

คลังเน้นประโยคเดินทางและฤดู แต่ไม่มีเป้าหมายงานเทศกาลและวันเกิด

หลักฐานที่ตรวจด้วยตา: PDF 9 / พิมพ์ 7 (Inhalt: L12); PDF 67 / พิมพ์ 72 (3–4); PDF 68 / พิมพ์ 73 (5–6); PDF 69 / พิมพ์ 74 (7a–c; Schnelltest Kommunikation); PDF 75 / พิมพ์ 80 (Kommunikation L12).

| Objective ID | หน้าที่สื่อสาร | สถานะในคลัง | ช่องว่าง/งานต่อ |
| --- | --- | --- | --- |
| L12-COMM-01 | เล่าและถามเรื่องการเดินทางที่ผ่านมา | มีบางส่วน | มีสถานที่ การเดินทาง และประเมินสั้น; ขาดคู่ถามตอบเรื่องเดินทางกับใคร อากาศ และประสบการณ์ |
| L12-COMM-02 | ถามและบอกวันเกิด | ไม่มีในคลังนี้ | ขาด Wann hast du/haben Sie Geburtstag? และการตอบเดือน/ฤดู |
| L12-COMM-03 | เล่าและถามเรื่องเทศกาล | ไม่มีในคลังนี้ | ขาดชื่อเทศกาล จัดเมื่อไร มีมาตั้งแต่เมื่อไร นานเท่าไร และข้อมูลผู้ร่วมงาน |

| Target ID เดิม | ประโยคที่ระบบใช้ | หน้าที่หลัก | สถานะแหล่งเดิม / ข้อสังเกต |
| --- | --- | --- | --- |
| L12-P001 | Im Frühling bin ich nach Hamburg gefahren. | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P002 | Im Sommer war ich in Berlin. | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P003 | Wir sind mit dem Zug gefahren. | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P004 | Wann bist du angekommen? | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P005 | Ich bin am Montag zurückgekommen. | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P006 | Es war sehr schön. | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P007 | Wir hatten viel Zeit. | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P008 | Im Winter bin ich zu Hause geblieben. | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P009 | Was hast du im Herbst gemacht? | L12-COMM-01 | product-authored-curriculum-aligned |
| L12-P010 | Ich habe meine Familie besucht. | L12-COMM-01 | product-authored-curriculum-aligned |

## ข้อค้นพบด้านรูปแบบและความถูกต้องของการประเมิน

- `*-a11-situation` ในตัวสร้างใช้คำแปลไทยของประโยคเป็น prompt และให้เลือกประโยคเยอรมัน. จึงเป็นหลักฐานจับคู่ความหมายแบบมีตัวเลือก ยังไม่ใช่การเลือกตอบในสถานการณ์สนทนาจริง แม้ชื่อ subskill จะเป็น `phrase_situation_choice`.
- ตัวลวงเลือกจากประโยคอื่นในบทตามลำดับ ไม่ได้ทบทวนความเป็นไปได้ของการตอบในบริบท. เมื่อสร้างสถานการณ์ใหม่ต้องกำหนดข้อมูลที่ทำให้คำตอบเดียวเหมาะสม และตรวจความกำกวมรายข้อ.
- Basic ใช้โจทย์เลือกความหมายเท่านั้น; Daily ใช้ชุดตัวเลือกและเรียงคำจากประโยคเดิม. คลังนี้ยังไม่มีคู่บทสนทนา เงื่อนไขเมนู/นัดหมาย หรือ rubric คำตอบอิสระสำหรับเป้าหมายที่ขาด.
- L05 มีตัวอย่าง Akkusativ สามรายการในคลังประโยคก่อนหัวข้อนี้เป็นแกน L06. เป็นข้อเสนอให้ทบทวน prerequisite/ตำแหน่ง ไม่ใช่เหตุให้ลบประวัติหรือย้าย ID ทันที.
- สถานะ `existing-published-*` ระบุที่มาของข้อมูลในระบบ ไม่ยืนยันว่าพิมพ์อยู่ในหนังสือ. การตรวจรอบนี้ยืนยันหน้าที่สื่อสารที่ระบุ พร้อมคงสถานะ product-authored ของตัวอย่างเดิม. ยังไม่ยกระดับทั้งคลังเป็น publisher-verified.

## ลำดับงานออกแบบต่อ

1. ปิดช่องว่างที่แทนเป้าหมายหลักผิดกลุ่มก่อน: L02 ข้อมูลบุคคล/อาชีพจริง, L05 ขอคำศัพท์/บรรยาย/อีเมล, L06 โทรศัพท์, L09 ร้านอาหาร. ทุกบทต้องมีรายการเป้าหมายหลักครบตามแหล่งที่ตรวจ โดยไม่มีโควตา 10 ประโยคหรือ 100 โจทย์.
2. ตรวจแหล่งเสริมและ partner pages ที่จำเป็นต่อเป้าหมายใหม่ โดยเฉพาะต้นทาง Handynummer/สถานะงาน L02. บันทึก source metadata แยกจากข้อความที่ผู้เรียนเห็น.
3. ออกแบบต้นแบบ L01 ตามหน้าที่ห้ากลุ่มที่พบ แล้วทดสอบก่อนขยายรูปแบบ. คัดตัวอย่าง/ตัวแปรและคู่ถามตอบจากเป้าหมายที่ตรวจแล้ว ไม่เพิ่มคำแทนในแม่แบบเพื่อให้ครบจำนวน.
4. ก่อนเพิ่มกิจกรรมให้ทำแผนตอบรับ/บริบท/คำตอบที่ยอมรับและหลักฐานตามส่วนถัดไป. ระบุ ID ใหม่เมื่อเพิ่มเป้าหมายใหม่ และคง ID/คำตอบ/รอบฝึกของเดิม.

## แผนหลักฐานสำหรับการออกแบบรอบถัดไป

Objective IDs `Lxx-COMM-nn` ในรายงานเป็นรหัสงานออกแบบภายใน ไม่ใช่ target IDs ที่เปิดใช้งานหรือมีคะแนนแล้ว. รายการ missing ยังไม่มี task/response IDs, accepted answers หรือ eligibility ที่ทำงานจริง. ตารางนี้เป็นข้อกำหนดสำหรับรอบออกแบบ ไม่ใช่การเปิด adaptive policy ใหม่.

| หลักฐานย่อย | ความยากและความช่วยเหลือที่เสนอ | สิ่งที่ต้องแยกวัด/งานต่อ |
| --- | --- | --- |
| เข้าใจความหมาย | เลือกจากข้อความสั้น มีตัวเลือก; ไม่ใช้คำแปลเป็นสถานการณ์จำลอง | ผูก target เดิมกับ comprehension; ไม่สรุปว่าสนทนาได้ |
| ตอบบทสนทนา | ให้ผู้พูดก่อนหน้าและข้อมูลภาพ/บัตรบุคคล/เมนู/ตารางที่ตัดคำตอบกำกวม | เพิ่ม response ID และ `dialogue_response` ตาม schema ที่อนุมัติในรอบ implementation; รู้ความหมายไม่แทนการตอบได้ |
| เรียงคำ | ให้คำทั้งหมดและจุดเริ่มประโยคเมื่อมีคำตอบได้หลายลำดับ | ใช้ subskill word order; supplied words เป็น assistance |
| สร้างคำตอบ | ลดคำที่ให้จากเติมช่องเป็นพิมพ์เองเฉพาะเป้าหมายที่มี grader/accepted variants | ต้องออกแบบตัวตรวจและรูปแปรก่อนเปิดใช้; ชื่อ/อาชีพ/ความชอบอิสระไม่มีคำตอบเดียว |
| ฟัง/พูด | ต้องมีเสียง/งานพูดและเกณฑ์เฉพาะ | การอ่าน การกดฟัง หรือเรียงคำไม่สร้างหลักฐานฟัง/พูดอัตโนมัติ |

เริ่มสถานะ unknown ต่อ target/subskill. เก็บคำตอบแรก ความถูกต้อง เวอร์ชันและตัวช่วยก่อนตอบแยกกัน. หากผิดทักษะใดให้ฝึกทักษะนั้นด้วยบริบทชัดขึ้น; หากถูกแบบมีตัวช่วยยังไม่เลื่อนเป็น independent production. เกณฑ์จำนวนหลักฐานและช่วงทบทวนต้องกำหนดและตรวจเมื่อมี variants จริง ยังไม่กำหนดตัวเลข mastery จากรายงานนี้.

| เส้นทาง | สถานะที่ตรวจจาก repository / งานที่ขาด |
| --- | --- |
| Learn → exposure | L03–L12 `A11PhraseLearning` เรียก `history.act("expose", { itemId })`; L01 ใช้หน้า Learn เดิม, L02 ใช้เนื้อหาเฉพาะบท. รายงานตรวจ 117 รายการที่ตัวสร้างคลังใช้ ไม่ยืนยันว่ารวมข้อความทุกหน้า Learn ของ L02 |
| Response → target/subskill | ตัวสร้าง `build-a11-phrases.mjs` ผูก IDs เดิมใน 346 definitions; mapping ระหว่าง objective ในรายงานกับ targets ยังเป็น metadata ออกแบบ |
| Answer → account evidence | `PracticeAccountSync` และ `learner_practice_sessions`; validator A1.1 phrase ใน migration generator. รอบนี้ไม่รันหรือเปลี่ยนฐานข้อมูล |
| Evidence → next task | `planDailyPractice` เป็น history ranking เดิม; ยังขาด learner state ที่สอบเทียบและ durable decision reason ตาม assessment plan |
| Objective ใหม่ → eligibility/graded response/selector | ยังไม่ implement; ต้องเชื่อม Learn → response → บัญชี → target/subskill state → next task จริงก่อนอ้างว่าเปิดใช้ |
| การ deploy | งานนี้เป็น audit metadata/documentation เท่านั้น ไม่มีหน้าใหม่ ไม่มีการเปลี่ยนคะแนนหรือ deploy |

## การตรวจรายงาน

สคริปต์อ่านข้อมูลจริง ตรวจความตรงกันของ Learn catalog กับ inventory, จำนวนรายบท, IDs ไม่ซ้ำ, ทุก target ผูกหน้าที่หลักหนึ่งแห่ง และทุก response อ้าง target ที่มีจริง. Fingerprint ของข้อมูลที่ทบทวนทำให้การเปลี่ยนคลังต้องกลับมาตรวจแหล่งใหม่. `--check` ตรวจว่ารายงานที่เก็บไว้ตรงกับ metadata โดยไม่เขียนไฟล์. การผ่านสคริปต์ไม่ใช่หลักฐานความถูกต้องทางภาษา; หลักฐานเนื้อหาคือการอ่านหน้าที่ระบุด้วยตา.

แผนระบบเดิมและช่องว่างการเชื่อมบัญชี: [A11_A12_ASSESSMENT_PLAN.md](A11_A12_ASSESSMENT_PLAN.md).
