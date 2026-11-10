#!/usr/bin/env python3
"""Build source-reviewed L03–L12 Learn; authored scenarios, never publisher answer keys."""
import json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parents[2]
draft=json.loads((R/'docs/exercise-mapping/a11-phrase-expansion-draft.json').read_text())
audit=json.loads((R/'docs/exercise-mapping/a11-phrase-source-review.json').read_text())
def B(theme,title,*rows):return dict(kind='board',theme=theme,title=title,rows=rows)
def image(src,alt,caption=''):return dict(kind='image',src=src,alt=alt,caption=caption)
def clock(h,m):return dict(kind='clock',hour=h,minute=m)
# Explicit facts, not descriptions of an invisible card. No German answer sentence in a task's visual.
V={
'L03':[
 B('family','ครอบครัวของ Anna',('Lena','น้องสาวของ Anna')),
 B('family','ครอบครัวของผู้ตอบ B',('บุคคลที่กำลังพูดถึง','พ่อและแม่ของ B')),
 B('family','บุคคลที่กำลังพูดถึง',('ผู้ตอบคิดว่า','เป็นแม่ของ Jan'),('ความมั่นใจ','ยังไม่แน่ใจ')),
 B('family','บุคคลที่กำลังพูดถึง',('ความสัมพันธ์กับ B','แม่')),
 B('family','บุคคลที่กำลังพูดถึง',('ความสัมพันธ์กับ B','ลุง ไม่ใช่พ่อ')),
 B('ability','ภาษาของ B',('ไทย','ดีมาก'),('เยอรมัน','เล็กน้อย')),
 B('ability','ภาษาของ B',('ฝรั่งเศส','พูดไม่ได้เลย')),
 B('ability','ภาษาของ B',('อังกฤษ','พูดได้เล็กน้อย'))],
'L04':[
 image('/images/lektion-04-vocabulary/V044-isolated-v2.jpg','เก้าอี้','19,99 € · ราคาพิเศษ'),
 image('/images/lektion-04-vocabulary/V046.jpg','โคมไฟ','35,00 €'),
 B('object','ขนาดตู้และห้อง',('ความกว้างของตู้','140 cm'),('พื้นที่ว่างในห้อง','90 cm')),
 B('object','ความเห็นของ B',('เตียงนี้','ชอบมาก'),('รูปแบบ','ทันสมัย')),
 B('object','ความเห็นของ B',('โซฟานี้','สวย'),('ต้องการตอบ','เห็นด้วยกับ A')),
 B('object','ความเห็นของ B',('ตู้','เล็กเกินไปสำหรับใช้งาน'),('ต้องการตอบ','ไม่เห็นด้วยกับ A')),
 B('object','เพื่อนชมภาพ',('ต้องการตอบ','ถามกลับด้วยความสนใจ'))],
'L05':[
 image('/images/phrase-contexts/umbrella.svg','ร่มกางอยู่',''),
 B('object','ฝึกสะกดคำ',('คำที่ถาม','der Schirm')),
 B('object','สิ่งของที่ไม่คุ้นเคย',('ผู้ตอบ B','ไม่รู้คำเรียกภาษาเยอรมัน')),
 B('object','คุณสมบัติสิ่งของ',('วัสดุ','แก้ว'),('สี','เขียว')),
 B('object','คุณสมบัติสิ่งของ',('สี','เขียว'),('วัสดุ','แก้ว')),
 B('phone','ฟังคำศัพท์ไม่ชัด',('ต้องการ','ขอให้พูดอีกครั้ง')),
 B('phone','อีกคนช่วยสะกดให้แล้ว',('ต้องการ','ขอบคุณ')),
 B('phone','ได้รับคำขอบคุณ',('ต้องการ','ตอบรับอย่างเป็นกันเอง')),
 B('phone','ข้อมูลติดต่อสมมติ',('อีเมล','mali_87@example.com'))],
'L06':[
 B('phone','สายเข้า',('บริษัท','Nord'),('ผู้รับสาย B','Anna Weber')),
 B('phone','โทรออก',('ผู้โทร B','Paul Klein'),('ต้องการคุยกับ','Frau Meier')),
 B('phone','รับสายลูกค้า',('ผู้โทร A','Paul Klein'),('ขั้นต่อไปของ B','ถามว่าต้องการให้ช่วยอะไร')),
 B('phone','กำลังต่อสาย',('ผู้โทรขอสาย','Frau Meier'),('การดำเนินการ','ขอให้รอระหว่างตรวจสอบ')),
 B('phone','ผลการตรวจสอบ',('Frau Meier','ไม่อยู่')),
 B('phone','ขอสายแล้วแต่ไม่อยู่',('B ต้องการ','ขอบคุณและจบสาย')),
 B('phone','ก่อนวางสาย',('ผู้โทร A','Paul Klein'),('ผู้รับสาย B','ตอบรับคำขอบคุณและบอกลา'))],
'L07':[
 B('ability','ความสามารถของ B',('ว่ายน้ำ','ทำได้เล็กน้อย')),
 B('ability','ความสามารถของ B',('ทำอาหาร','ทำได้แต่ยังไม่เก่ง')),
 B('ability','ความสามารถของผู้ตอบ',('ผู้ตอบ B','สองคน'),('เทนนิส','เล่นได้ทั้งคู่')),
 B('ability','ความสามารถของ B',('ขี่ม้า','ทำได้'),('ผู้ถาม','ใช้ภาษาสุภาพ')),
 B('ability','หลังแสดงการเต้น',('A','ชม B'),('B ต้องการ','ขอบคุณ')),
 B('ability','หลังวาดภาพ',('A','ชม B อย่างสุภาพ'),('B ต้องการ','ขอบคุณ')),
 B('ability','งานอดิเรกของ B',('อย่างที่ 1','ว่ายน้ำ'),('อย่างที่ 2','ปั่นจักรยาน')),
 B('ability','เวลาว่างของ B',('กิจกรรมที่ชอบ','เล่นฟุตบอล'),('ความรู้สึก','สนุก')),
 B('calendar','นิสัยของ B',('อ่านหนังสือ','บ่อย')),
 B('calendar','นิสัยของ B',('เล่นสกี','ไม่เคย')),
 B('calendar','นิสัยของ B',('เล่นเทนนิส','บางครั้ง')),
 B('calendar','นิสัยของ B',('ฟังเพลงในเวลาว่าง','เสมอ'))],
'L08':[
 B('calendar','แผนเย็นนี้',('กิจกรรมที่ B อยากเสนอ','ไปโรงหนัง')),
 B('calendar','นัดไปโรงหนัง',('เวลาเจอกัน','16:00')),
 B('calendar','ตารางของ B',('เย็นนี้','ว่าง'),('โรงหนัง','อยากไป')),
 B('calendar','ตารางของ B',('เย็นนี้','ไม่ว่าง'),('พรุ่งนี้','ว่าง')),
 B('calendar','ตารางของ B',('วันเสาร์','ยังไม่ทราบว่าจะว่างไหม')),
 B('calendar','ตารางของ B',('19:00','ต้องทำงาน')),
 clock(15,30),clock(15,15),clock(15,45),clock(15,35),clock(15,25)],
'L09':[
 B('menu','อาหารเช้าที่ B ชอบ',('อาหาร','ขนมปังกับแยม')),
 B('menu','ความชอบของ B',('ชอบเป็นพิเศษ','ช็อกโกแลต')),
 B('menu','รายการที่ลูกค้า B ต้องการ',('เครื่องดื่ม','กาแฟ 1 ถ้วย'),('ขนม','เค้ก 1 ชิ้น')),
 B('menu','ความต้องการของ B',('เค้ก','ไม่ต้องการ'),('การตอบ','ปฏิเสธอย่างสุภาพ')),
 B('menu','รายการที่ลูกค้า B ต้องการ',('อาหาร','สลัด')),
 B('menu','หน้าร้านวันนี้',('เค้กช็อกโกแลต','หมด'),('เค้กแอปเปิล','ยังมี'),('ลูกค้า B','ยอมเลือกเค้กแอปเปิลแทน')),
 B('menu','หน้าร้านวันนี้',('ไอศกรีม','หมด'),('ผู้ตอบ B','พนักงาน'))],
'L10':[
 B('transport','ขบวนไป Stuttgart',('ชานชาลา','4')),
 B('transport','จุดเปลี่ยนรถ',('สถานี','Hamburg Hauptbahnhof')),
 B('transport','นัดรับที่สนามบิน',('ผู้ตอบ B','ไปรับได้และตกลง')),
 B('transport','เที่ยวบินของ A',('เวลาออก','05:00'),('B ต้องการ','ถามยืนยันเพราะเช้ามาก')),
 B('phone','ข้อความจาก A',('แบตมือถือ','หมด'),('B ต้องการ','บอกว่าเข้าใจแล้ว')),
 B('transport','กำหนดถึงของ B',('เวลา','09:00'),('ความหวัง','ไม่ล่าช้า')),
 B('transport','กำลังจะได้พบกัน',('A และ B','ต่างดีใจที่จะได้เจอกัน')),
 B('transport','Intercity 642 → Salzburg',('ชานชาลา','5')),
 B('transport','Flug → Zürich',('ทางออก','B48'))],
'L11':[
 B('timeline','เมื่อวานของ B',('กิจกรรม','อ่านหนังสือพิมพ์'),('ทำอาหาร','ไม่ได้ทำ')),
 B('timeline','เสาร์ที่แล้วของ B',('กิจกรรม','พบเพื่อน')),
 B('timeline','เมื่อวานของ B',('09:00–17:00','ทำงาน'),('หลังจากนั้น','ทำอาหาร')),
 B('timeline','เมื่อวานของ B',('17:30 เป็นต้นไป','อ่านหนังสือ')),
 B('timeline','วันอาทิตย์ของ B',('1 ตอนเช้า','กินอาหารเช้า'),('2 หลังจากนั้น','พบเพื่อน')),
 B('calendar','เวลาเปิดคลินิก',('วัน','จันทร์–ศุกร์'),('เวลา','09:00–17:00')),
 B('calendar','เริ่มชั้นเรียน',('วัน','พุธ'),('เวลา','08:00')),
 B('calendar','วันปิดคลินิก',('เสาร์','ปิด'),('อาทิตย์','ปิด'))],
'L12':[
 B('transport','ทริปของ B',('เดินทางกับ','ครอบครัว'),('ความรู้สึก','ดีมาก')),
 B('transport','ทริปของ B',('อากาศ','ดี'),('ความรู้สึก','สนุก')),
 B('transport','ทริปของ B',('อากาศจริง','ไม่ค่อยดี'),('A คิดว่า','อากาศดี')),
 B('celebration','วันเกิดของ B',('เดือน','มกราคม'),('อ้างอิงฤดูกาล','เยอรมนี')),
 B('celebration','วันเกิดของ B',('เดือน','พฤษภาคม')),
 B('celebration','das Stadtfest',('เดือน','พฤษภาคม'),('ระยะเวลา','3 วัน')),
 B('celebration','das Stadtfest',('เริ่มจัดครั้งแรก','2000')),
 B('celebration','das Stadtfest',('ผู้มาเยือน','ประมาณ 1,000 คน')),
 B('celebration','คริสต์มาสปีที่แล้วของ B',('เมืองที่ฉลอง','Düsseldorf'))]
}
# Incorrect replies are explicitly ruled out by the supplied facts/function; not interchangeable synonyms.
D={
'L03':[['Ja, das ist meine Mutter.','Das ist mein Vater.'],None,None,['Nein, das ist meine Mutter.','Ja, das ist mein Vater.'],['Doch, das ist mein Vater.','Ja, das ist mein Vater.'],None,['Ja, sehr gut.','Ja, ein bisschen.'],['Nein, gar nicht.','Ja, sehr gut.']],
'L04':[['Er kostet 99 Euro.','Er kostet 35 Euro.'],None,['Nein, er ist zu klein.','Ja, er ist genau richtig.'],None,['Das finde ich nicht.','Nein, er ist zu klein.'],['Das finde ich auch.','Er ist sehr groß.'],['Das finde ich auch.','Das finde ich nicht.']],
'L05':[['Das ist eine Tasche.','Das ist eine Flasche.'],['S-H-I-R-M.','S-C-H-R-I-M.'],['Das ist ein Schirm.','Danke schön.'],['Ja, es ist aus Plastik.','Nein, es ist aus Holz.'],['Ja, es ist blau.','Nein, es ist rot.'],['Bitte, sehr gern.','Danke schön.'],['Noch einmal, bitte.','Ich weiß nicht.'],['Noch einmal, bitte.','Ich weiß nicht.'],None],
'L06':[['Auf Wiederhören.','Einen Moment bitte.'],None,['Auf Wiederhören.','Vielen Dank.'],['Frau Meier ist leider nicht da.','Vielen Dank. Auf Wiederhören.'],['Ja, Frau Meier ist da.','Guten Morgen, Frau Meier.'],None,['Ist Frau Meier da?','Was kann ich für Sie tun?']],
'L07':[['Ja, sehr gut.','Nein, gar nicht.'],None,None,['Nein, ich kann nicht reiten.','Ja, wir können Tennis spielen.'],['Nein, gar nicht.','Ich spiele manchmal Tennis.'],['Nein, gar nicht.','Ich fahre nie Ski.'],None,None,['Ich lese nie.','Ich lese selten.'],['Ich fahre oft Ski.','Ich fahre immer Ski.'],['Ich spiele nie Tennis.','Ich spiele immer Tennis.'],['Ich höre nie Musik.','Ich höre selten Musik.']],
'L08':[['Gehen wir ins Restaurant?','Spielen wir Tennis?'],None,['Tut mir leid, ich kann nicht.','Das weiß ich noch nicht.'],None,['Ja, gern.','Tut mir leid, ich kann nicht.'],['Ja, ich habe Zeit.','Gute Idee!'],['Es ist halb drei.','Es ist halb fünf.'],['Es ist Viertel vor drei.','Es ist Viertel nach vier.'],['Es ist Viertel nach vier.','Es ist Viertel vor drei.'],None,None],
'L09':[None,['Ich mag Schokolade nicht.','Ich mag besonders gern Käse.'],None,['Ja, gern.','Einen Kuchen, bitte.'],None,['Dann nehme ich einen Schokoladenkuchen.','Dann nehme ich ein Eis.'],['Ja, wir haben Eis.','Eine Tasse Kaffee, bitte.']],
'L10':[['Von Gleis zwei.','Von Gleis fünf.'],None,['Tut mir leid, ich kann dich nicht abholen.','Ich steige um.'],['Gute Nacht!','Vielen Dank für das Interview.'],['So früh? Bist du sicher?','Gute Nacht!'],None,['Tut mir leid, ich habe keine Zeit.','Einen Moment bitte.'],['Von Bahnsteig vier.','Von Bahnsteig sechs.'],['Am Ausgang B84.','Am Ausgang A48.']],
'L11':[['Ja, ich habe gekocht.','Nein, ich habe gearbeitet.'],None,None,['Ab halb fünf habe ich gelesen.','Bis halb sechs habe ich gelesen.'],None,['Am Samstag und am Sonntag.','Von Montag bis Freitag, von acht bis siebzehn Uhr.'],['Am Montag um acht Uhr.','Am Mittwoch um neun Uhr.'],['Am Montag und am Dienstag.','Von Montag bis Freitag.']],
'L12':[None,['Ich hatte Pech mit dem Wetter.','Ich hatte keinen Spaß.'],['Ja, das Wetter war sehr schön.','Ich hatte Glück mit dem Wetter.'],['Ich habe im Mai Geburtstag, im Frühling.','Ich habe im Juli Geburtstag, im Sommer.'],None,['Es ist im März und dauert drei Tage.','Es ist im Mai und dauert zwei Tage.'],['Das Stadtfest gibt es seit 2020.','Das Stadtfest gibt es seit 2010.'],['Es hat ungefähr hundert Besucher.','Es hat ungefähr zehntausend Besucher.'],None]
}
# A short reason tied to the particular choice/order task, not a reprint of the prompt.
NOTES={
'L03-COMM-01':['แยกคนเดียวด้วย das ist กับหลายคนด้วย das sind','ระบุความสัมพันธ์จากข้อมูลครอบครัว ไม่เดาจากอายุหรือหน้าตา'],
'L03-COMM-02':['Doch ใช้ยืนยันสิ่งที่คำถามปฏิเสธไว้','Ich glaube … บอกว่ายังเป็นการคาดเดา'],
'L03-COMM-03':['บอกระดับได้ด้วย sehr gut / ein bisschen / gar nicht','คำถาม Sie ใช้กับคู่สนทนาอย่างสุภาพ'],
'L04-COMM-01':['บอกราคาตามป้ายและแยก Euro กับ Cent','ใช้ er / sie / es ตามคำนามที่กำลังพูดถึง'],
'L04-COMM-02':['zu groß / zu klein บอกว่าใหญ่หรือเล็กเกินไป','sehr / wirklich เพิ่มระดับความเห็น'],
'L04-COMM-03':['Das finde ich auch. ใช้เห็นด้วย','Das finde ich nicht. ใช้ไม่เห็นด้วย ส่วน Findest du? ใช้ถามความเห็นกลับ'],
'L05-COMM-01':['ถามคำเรียกด้วย Wie heißt das auf Deutsch?','ขอให้สะกดด้วย Wie schreibt man …?'],
'L05-COMM-02':['ใช้ aus บอกวัสดุ','ใช้ ist ตามด้วยคำบอกสี เมื่อทายคุณสมบัติของสิ่งของ'],
'L05-COMM-03':['Noch einmal, bitte. ใช้ขอให้พูดอีกครั้ง','Danke schön. ใช้ขอบคุณ และ Bitte, sehr gern. ใช้ตอบรับ'],
'L05-COMM-04':['แยกเครื่องหมาย @ จุด และขีดล่างเมื่อบอกอีเมล','ข้อมูลในกิจกรรมเป็นข้อมูลสมมติ'],
'L06-COMM-01':['รับสายด้วยชื่อบริษัทและชื่อผู้รับสาย','ผู้โทรแนะนำตัวก่อนขอสายคนที่ต้องการ'],
'L06-COMM-02':['Einen Moment bitte. ขอให้รอสักครู่','ใช้ Auf Wiederhören. ลาทางโทรศัพท์'],
'L07-COMM-01':['บอกระดับความสามารถ ไม่ใช่แค่ทำได้หรือไม่ได้','ich kann … แต่ wir können …'],
'L07-COMM-02':['คำชมเรื่องความสามารถตอบรับด้วยการขอบคุณได้','ไม่ต้องปฏิเสธคำชมถ้าโจทย์ไม่ได้ให้ทำเช่นนั้น'],
'L07-COMM-03':['บอกงานอดิเรกหรือกิจกรรมที่ชอบในเวลาว่าง','gern ใช้บอกว่าชอบทำสิ่งนั้น'],
'L07-COMM-04':['immer = เสมอ · oft = บ่อย · manchmal = บางครั้ง · nie = ไม่เคย','เลือกตามความถี่ที่กำหนด ไม่เดาจากภาพกิจกรรม'],
'L08-COMM-01':['ใช้คำถามเพื่อชวนทำกิจกรรมหรือนัดเวลา','um ตามด้วยเวลาเมื่อนัดหมาย'],
'L08-COMM-02':['ตอบรับ ปฏิเสธ หรือยังไม่แน่ใจ ให้ตรงตารางของผู้ตอบ','เมื่อไม่ว่าง สามารถเสนอวันใหม่ได้'],
'L08-COMM-03':['halb vier คืออีกครึ่งชั่วโมงจะถึงสี่โมง','nach = หลังเวลา · vor = ก่อนเวลา'],
'L09-COMM-01':['gern / besonders gern ใช้บอกความชอบ','ข้อมูลความชอบเป็นของผู้ตอบ ไม่ใช่รายการที่ร้านมี'],
'L09-COMM-03':['บอกสิ่งที่ต้องการแล้วเติม bitte เพื่อความสุภาพ','ปฏิเสธข้อเสนอได้ด้วย Nein, danke.'],
'L09-COMM-04':['kein … mehr บอกว่าของนั้นหมดแล้ว','เมื่อของหมด ให้เลือกสิ่งอื่นที่ร้านยังมี'],
'L10-COMM-01':['แยกจุดออกเดินทาง จุดเปลี่ยนรถ และการไปรับ','ตอบจากข้อมูลการเดินทางที่กำหนด'],
'L10-COMM-02':['Bist du sicher? ใช้ถามยืนยัน','Verstehe. / Alles klar. ใช้บอกว่าเข้าใจ'],
'L10-COMM-03':['Hoffentlich … ใช้บอกความหวัง','Ich freue mich auf … ใช้บอกว่าดีใจที่จะได้พบ'],
'L10-COMM-04':['อ่านชื่อขบวนหรือปลายทางก่อนหาชานชาลาหรือทางออก','การอ่านประกาศกับการฟังประกาศเก็บผลคนละทักษะ'],
'L11-COMM-01':['Perfekt ใช้เล่าเหตุการณ์ที่เกิดขึ้นแล้ว (อดีต)','โครงสร้างบอกเล่า: ประธาน + กริยาช่วย (ผันตามประธาน) + Partizip II','วาง Partizip II ไว้ท้ายประโยค'],
'L11-COMM-02':['เริ่มจาก Ich habe gearbeitet. = ฉันทำงานแล้ว','ถ้าต้องการบอกว่าเมื่อไร ให้วางวลีเวลาไว้ต้นประโยคแทน ich: วลีเวลา + habe + ich + Partizip II','วลีเวลาทั้งกลุ่มนับเป็นตำแหน่งที่ 1 ไม่ได้นับทีละคำ; habe จึงยังอยู่ตำแหน่งที่ 2 และ ich ตามหลัง','Danach / Dann ใช้ขึ้นต้นประโยคถัดไป เพื่อเล่าว่าทำอะไรต่อ'],
'L11-COMM-03':['แยกข้อมูลวัน เวลาเปิด ปิด และเวลาเริ่มกิจกรรม','am + วัน: am Mittwoch = วันพุธ','um + เวลา: um acht Uhr = เวลา 8 โมง'],
'L12-COMM-01':['เล่าทริปทั้งคนที่ไปด้วย อากาศ และความรู้สึก','ใช้ war / hatte เมื่อเล่าสภาพหรือประสบการณ์ในอดีต'],
'L12-COMM-02':['im ตามด้วยเดือนหรือฤดูกาล','ข้อมูลฤดูกาลในตัวอย่างอ้างอิงเยอรมนี'],
'L12-COMM-03':['แยกเดือน ระยะเวลา ปีเริ่มจัด และจำนวนผู้ร่วมงาน','seit ตามด้วยปีที่เริ่มมีงานนั้น']
}
L11_MODEL_TEACHING={
 'L11-COMM-01':[
  dict(questionTeaching=dict(focus=['hast','gemacht'],structure=['คำถาม: Was + hast + du + Partizip II']),replyTeaching=dict(focus=['habe','gekocht'],structure=['Ich = ประธาน · habe = กริยาช่วยรูปที่ผันตาม ich','gekocht = Partizip II ของ kochen อยู่ท้ายประโยค'])),
  dict(questionTeaching=dict(focus=['hast','gemacht'],structure=['คำถาม: Was + hast + du + Partizip II']),replyTeaching=dict(focus=['habe','gelesen'],structure=['Ich = ประธาน · habe = กริยาช่วยรูปที่ผันตาม ich','gelesen = Partizip II ของ lesen อยู่ท้ายประโยค']))],
 'L11-COMM-02':[
  dict(teachingIntro=['von … bis … = ตั้งแต่ … ถึง … ใช้บอกช่วงเวลา'],replyTeaching=dict(focus=['Von neun bis siebzehn Uhr','habe','gearbeitet','Danach','gekocht'],structure=['Von neun bis siebzehn Uhr = ตั้งแต่ 9 ถึง 17 นาฬิกา','ขึ้นต้นด้วยช่วงเวลา → habe อยู่ตำแหน่งที่ 2','Danach = หลังจากนั้น → habe อยู่ตำแหน่งที่ 2 เช่นกัน','gearbeitet / gekocht (Partizip II) อยู่ท้ายแต่ละประโยค'])) ,
  dict(teachingIntro=['ab + เวลา = ตั้งแต่เวลานั้น ใช้บอกจุดเริ่มต้น'],replyTeaching=dict(focus=['Ab halb sechs','habe','gelesen'],structure=['Ab halb sechs = ตั้งแต่ 17:30','วลีเวลาอยู่ต้นประโยค → habe อยู่ตำแหน่งที่ 2','gelesen (Partizip II) อยู่ท้ายประโยค'])) ,
  dict(teachingIntro=['Am Morgen = ตอนเช้า · Dann = หลังจากนั้น'],replyTeaching=dict(focus=['Am Morgen','habe','gefrühstückt','Dann','getroffen'],structure=['Am Morgen / Dann อยู่ต้นประโยค → habe อยู่ตำแหน่งที่ 2','gefrühstückt / getroffen (Partizip II) อยู่ท้ายแต่ละประโยค']))],
 'L11-COMM-03':[
  dict(questionTeaching=dict(focus=['Wann'],structure=['Wann ถามเวลา; ใช้คำตอบบอกวันและช่วงเวลา']),replyTeaching=dict(focus=['Von Montag bis Freitag','von neun bis siebzehn Uhr'],structure=['von … bis … ใช้บอกช่วงเวลา: ตั้งแต่ … ถึง …'])) ,
  dict(questionTeaching=dict(focus=['Wann'],structure=['Wann ถามเวลาที่เริ่ม']),replyTeaching=dict(focus=['Am Mittwoch','um acht Uhr'],structure=['am + วัน: am Mittwoch = วันพุธ','um + เวลา: um acht Uhr = เวลา 8 โมง'])) ,
  dict(questionTeaching=dict(focus=['Wann'],structure=['Wann ถามวันที่ปิด']),replyTeaching=dict(focus=['Am Samstag','am Sonntag'],structure=['am + วัน: am Samstag / am Sonntag = วันเสาร์ / วันอาทิตย์']))]
}
def time_sentence(time,participle,other=None,sequence=False,label='คำบอกเวลา'):
 parts=[dict(text=time,role='sequence' if sequence else 'time',label='คำบอกลำดับ' if sequence else label,position='ตำแหน่ง 1'),dict(text='habe',role='auxiliary',label='กริยาช่วย (ผันแล้ว)',position='ตำแหน่ง 2 เสมอ'),dict(text='ich',role='subject',label='ประธาน')]
 if other:parts.append(dict(text=other,role='other',label='ส่วนขยาย'))
 parts.append(dict(text=participle,role='participle',label='กริยาหลัก · Partizip II',position='ท้ายประโยคเสมอ'))
 return parts
L11_TIME_SENTENCES=[
 [time_sentence('Von neun bis siebzehn Uhr','gearbeitet.',label='ช่วงเวลา'),time_sentence('Danach','gekocht.',sequence=True)],
 [time_sentence('Ab halb sechs','gelesen.',label='จุดเริ่มต้นของเวลา')],
 [time_sentence('Am Morgen','gefrühstückt.'),time_sentence('Dann','getroffen.',other='Freunde',sequence=True)]
]
L11_GRAMMAR_PATTERNS=[
 dict(id='statement',title='ประโยคบอกเล่า',present='Ich arbeite.',past='Ich habe gearbeitet.',presentMeaning='ฉันทำงาน',pastMeaning='ฉันทำงานแล้ว',parts=[dict(text='Ich',role='subject',position='ประธาน · ตำแหน่ง 1'),dict(text='habe',role='auxiliary',position='กริยาช่วย (ผันแล้ว) · ตำแหน่ง 2'),dict(text='gearbeitet.',role='participle',position='Partizip II · ท้ายประโยค')],structure=['ประธาน + กริยาช่วย (ผันตามประธาน) + Partizip II']),
 dict(id='w-question',title='W-Frage',present='Wo lernst du Deutsch?',past='Wo hast du Deutsch gelernt?',presentMeaning='เธอเรียนภาษาเยอรมันที่ไหน',pastMeaning='เธอเรียนภาษาเยอรมันที่ไหนมา',parts=[dict(text='Wo',role='question',position='คำถาม · ตำแหน่ง 1'),dict(text='hast',role='auxiliary',position='กริยาช่วย (ผันแล้ว) · ตำแหน่ง 2'),dict(text='du',role='subject',position='ประธาน'),dict(text='Deutsch',role='other'),dict(text='gelernt?',role='participle',position='Partizip II · ท้ายประโยค')],structure=['คำถาม + กริยาช่วย (ผันแล้ว) + ประธาน + ส่วนอื่น + Partizip II']),
 dict(id='yes-no-question',title='Ja-/Nein-Frage',present='Macht ihr die Hausaufgaben?',past='Habt ihr die Hausaufgaben gemacht?',presentMeaning='พวกเธอทำการบ้านไหม',pastMeaning='พวกเธอทำการบ้านแล้วหรือยัง',parts=[dict(text='Habt',role='auxiliary',position='กริยาช่วย (ผันแล้ว) · ตำแหน่ง 1'),dict(text='ihr',role='subject',position='ประธาน'),dict(text='die Hausaufgaben',role='other'),dict(text='gemacht?',role='participle',position='Partizip II · ท้ายประโยค')],structure=['กริยาช่วย (ผันแล้ว) + ประธาน + ส่วนอื่น + Partizip II'])]
def sentence_part(text,role,label,position=None):
 p=dict(text=text,role=role,label=label)
 if position:p['position']=position
 return p
def perfekt_question(time=None):
 parts=[sentence_part('Was','question','คำถาม','ตำแหน่ง 1'),sentence_part('hast','auxiliary','กริยาช่วย (ผันแล้ว)','ตำแหน่ง 2'),sentence_part('du','subject','ประธาน')]
 if time:parts.append(sentence_part(time,'time','คำบอกเวลา'))
 return parts+[sentence_part('gemacht?','participle','กริยาหลัก · Partizip II','ท้ายประโยค')]
def ich_perfekt(participle,other=None,negative=False):
 parts=([sentence_part('Nein,','other','ตอบปฏิเสธ')] if negative else [])+[sentence_part('ich' if negative else 'Ich','subject','ประธาน','ตำแหน่ง 1'),sentence_part('habe','auxiliary','กริยาช่วย (ผันแล้ว)','ตำแหน่ง 2')]
 if other:parts.append(sentence_part(other,'other','กรรม'))
 return parts+[sentence_part(participle,'participle','กริยาหลัก · Partizip II','ท้ายประโยค')]
L11_SENTENCES={
 'Was hast du gemacht?':[perfekt_question()],
 'Was hast du gestern gemacht?':[perfekt_question('gestern')],
 'Was hast du gestern Abend gemacht?':[perfekt_question('gestern Abend')],
 'Was hast du am Sonntag gemacht?':[perfekt_question('am Sonntag')],
 'Was hast du letzten Samstag gemacht?':[perfekt_question('letzten Samstag')],
 'Hast du gestern gekocht?':[[sentence_part('Hast','auxiliary','กริยาช่วย (ผันแล้ว)','ตำแหน่ง 1'),sentence_part('du','subject','ประธาน'),sentence_part('gestern','time','คำบอกเวลา'),sentence_part('gekocht?','participle','กริยาหลัก · Partizip II','ท้ายประโยค')]],
 'Ich habe gekocht.':[ich_perfekt('gekocht.')],
 'Ich habe gelesen.':[ich_perfekt('gelesen.')],
 'Ich habe Freunde getroffen.':[ich_perfekt('getroffen.','Freunde')],
 'Nein, ich habe Zeitung gelesen.':[ich_perfekt('gelesen.','Zeitung',negative=True)],
 'Von neun bis siebzehn Uhr habe ich gearbeitet. Danach habe ich gekocht.':L11_TIME_SENTENCES[0],
 'Ab halb sechs habe ich gelesen.':L11_TIME_SENTENCES[1],
 'Am Morgen habe ich gefrühstückt. Dann habe ich Freunde getroffen.':L11_TIME_SENTENCES[2],
 'Wann ist die Praxis geöffnet?':[[sentence_part('Wann','question','ถามเวลา','ตำแหน่ง 1'),sentence_part('ist','verb','กริยา sein (ผันแล้ว)','ตำแหน่ง 2'),sentence_part('die Praxis','subject','ประธาน'),sentence_part('geöffnet?','other','สภาพ: เปิด')]],
 'Wann beginnt der Unterricht?':[[sentence_part('Wann','question','ถามเวลา','ตำแหน่ง 1'),sentence_part('beginnt','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),sentence_part('der Unterricht?','subject','ประธาน')]],
 'Wann ist die Praxis geschlossen?':[[sentence_part('Wann','question','ถามเวลา','ตำแหน่ง 1'),sentence_part('ist','verb','กริยา sein (ผันแล้ว)','ตำแหน่ง 2'),sentence_part('die Praxis','subject','ประธาน'),sentence_part('geschlossen?','other','สภาพ: ปิด')]],
 'Von Montag bis Freitag, von neun bis siebzehn Uhr.':[[sentence_part('Von Montag bis Freitag,','time','ช่วงวัน'),sentence_part('von neun bis siebzehn Uhr.','time','ช่วงเวลา')]],
 'Am Mittwoch um acht Uhr.':[[sentence_part('Am Mittwoch','time','วัน'),sentence_part('um acht Uhr.','time','เวลา')]],
 'Am Samstag und am Sonntag.':[[sentence_part('Am Samstag','time','วันเสาร์'),sentence_part('und','other','เชื่อมข้อมูล'),sentence_part('am Sonntag.','time','วันอาทิตย์')]]
}
L11_PRESENT_PARTS={
 'statement':[sentence_part('Ich','subject','ประธาน','ตำแหน่ง 1'),sentence_part('arbeite.','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2')],
 'w-question':[sentence_part('Wo','question','คำถาม','ตำแหน่ง 1'),sentence_part('lernst','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),sentence_part('du','subject','ประธาน'),sentence_part('Deutsch?','other','สิ่งที่เรียน')],
 'yes-no-question':[sentence_part('Macht','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 1'),sentence_part('ihr','subject','ประธาน'),sentence_part('die Hausaufgaben?','other','กรรม')]
}
REASONS={
'L03':['ข้อมูลกำหนดว่า Lena เป็นน้องสาว จึงแก้ความเข้าใจด้วย Nein แล้วบอกความสัมพันธ์ที่ถูก','เมื่อพูดถึงพ่อกับแม่สองคน ใช้ das sind','เติม Ich glaube เพื่อแสดงว่ายังไม่มั่นใจ','คำถามปฏิเสธว่าไม่ใช่แม่ แต่จริง ๆ เป็นแม่ จึงยืนยันด้วย Doch','จริง ๆ เป็นลุง จึงปฏิเสธว่าไม่ใช่พ่อแล้วบอกความสัมพันธ์ที่ถูก','ใช้ sehr gut กับภาษาไทย และ ein bisschen กับภาษาเยอรมันตามข้อมูล','gar nicht บอกว่าพูดภาษาที่ถามไม่ได้เลย','ein bisschen บอกว่าพูดได้เล็กน้อย'],
'L04':['ราคา 19,99 € อ่านว่า 19 Euro 99 และป้ายระบุว่าเป็นราคาพิเศษ','die Lampe ใช้ sie และตามด้วยราคา 35 Euro','ตู้กว้างกว่าพื้นที่ว่าง จึงใหญ่เกินไปสำหรับห้องนี้','ใช้ wirklich schön และ sehr modern ให้ตรงความเห็นที่กำหนด','ต้องการเห็นด้วยจึงใช้ Das finde ich auch.','ต้องการไม่เห็นด้วยและบอกเหตุผลว่าตู้เล็กเกินไป','โจทย์ให้ถามความเห็นกลับ จึงใช้ Findest du?'],
'L05':['สิ่งที่กางกันฝนคือร่ม ใช้ ein Schirm ในประโยคนี้','สะกดตัวอักษรตามคำที่ผู้ถามระบุ','ผู้ตอบไม่รู้คำศัพท์จึงตอบ Ich weiß nicht.','วัสดุเป็นแก้ว จึงใช้ aus Glas แทน Plastik','สีที่ให้คือเขียว จึงแก้จาก blau เป็น grün','ฟังไม่ชัดจึงขอให้พูดซ้ำด้วย Noch einmal, bitte.','อีกคนช่วยแล้วจึงขอบคุณด้วย Danke schön.','ผู้ถามขอบคุณ ผู้ตอบจึงรับด้วย Bitte, sehr gern.','อ่านชื่ออีเมลตามลำดับและแยกขีดล่าง @ และจุด'],
'L06':['กำลังรับสายบริษัท จึงบอกชื่อบริษัทและผู้รับสาย','ผู้โทรแนะนำตัวแล้วถามว่าคนที่ต้องการคุยอยู่ไหม','ฟังชื่อผู้โทรแล้วจึงถามว่ามีอะไรให้ช่วย','ยังต้องตรวจสอบก่อน จึงขอให้รอสักครู่ ไม่แจ้งว่าไม่อยู่ทันที','ตรวจแล้วว่าไม่อยู่ จึงแจ้ง leider nicht da','ทราบแล้วว่าไม่อยู่ จึงขอบคุณและลาทางโทรศัพท์','ก่อนจบสายตอบรับคำขอบคุณ แล้วใช้ Auf Wiederhören'],
'L07':['ว่ายน้ำได้เล็กน้อยจึงตอบ ein bisschen ไม่ใช่ sehr gut','ทำอาหารได้แต่ยังไม่เก่ง จึงใช้ nicht so gut','ผู้ตอบเป็นสองคนจึงใช้ wir können','คำถามสุภาพถามคนเดียว ตอบด้วย ich kann','ได้รับคำชมและต้องการขอบคุณจึงตอบ Oh, danke!','ได้รับคำชมอย่างสุภาพจึงขอบคุณด้วย Herzlichen Dank!','งานอดิเรกสองอย่างเชื่อมด้วย und','ใช้ gern บอกว่าชอบเล่น และ Das macht Spaß บอกว่าสนุก','ข้อมูลระบุว่าบ่อย จึงใช้ oft','ข้อมูลระบุว่าไม่เคย จึงใช้ nie','ข้อมูลระบุว่าบางครั้ง จึงใช้ manchmal','ข้อมูลระบุว่าเสมอ จึงใช้ immer'],
'L08':['ผู้ตอบต้องการชวนไปโรงหนัง จึงใช้ Gehen wir ins Kino?','ใช้ um vier Uhr สำหรับเวลานัด 16:00','ผู้ตอบว่างและเห็นด้วย จึงตอบรับอย่างชัดเจน','วันนี้ไม่ว่างแต่พรุ่งนี้ว่าง จึงปฏิเสธวันนี้และเสนอพรุ่งนี้','ยังไม่ทราบตาราง จึงไม่ตอบรับหรือปฏิเสธแน่นอน','เวลาเสนอทับกับงาน ผู้ตอบจึงปฏิเสธพร้อมเหตุผล','halb vier คืออีกครึ่งชั่วโมงถึงสี่โมง หรือ 15:30 ในบริบทนี้','Viertel nach drei คือผ่านสามโมงมา 15 นาที','Viertel vor vier คืออีก 15 นาทีถึงสี่โมง','fünf nach halb vier คือเลย 15:30 มา 5 นาที','fünf vor halb vier คือก่อน 15:30 อยู่ 5 นาที'],
'L09':['บอกอาหารที่ชอบตอนเช้าด้วย Zum Frühstück esse ich gern …','ข้อมูลระบุว่าชอบช็อกโกแลตเป็นพิเศษ จึงใช้ besonders gern','ใช้ eine Tasse กับ Kaffee และ einen กับ Kuchen ในคำสั่งนี้','ลูกค้าไม่ต้องการเค้ก จึงปฏิเสธด้วย Nein, danke.','ใช้ Ich möchte … bitte สั่งสลัดอย่างสุภาพ','เค้กช็อกโกแลตหมดและลูกค้ายอมเปลี่ยน จึงเลือกเค้กแอปเปิล','พนักงานแจ้งว่าไอศกรีมหมด ใช้ kein Eis mehr'],
'L10':['ดูชานชาลาของขบวนไป Stuttgart คือ 4','ตอบสถานีที่เปลี่ยนรถด้วย am ตามด้วยชื่อสถานี','ผู้ตอบตกลงไปรับ จึงใช้ Ich hole dich ab','เที่ยวบินเช้ามากและต้องการยืนยัน จึงถาม Bist du sicher?','ต้องการบอกว่าเข้าใจ จึงใช้ Verstehe. Alles klar.','บอกเวลาถึงก่อน แล้วใช้ Hoffentlich แสดงความหวังว่าจะไม่ช้า','อีกคนดีใจที่จะได้พบ ผู้ตอบก็ดีใจเช่นกันจึงใช้ auch','ประกาศขบวน Intercity 642 ระบุ Bahnsteig 5','ต้องคงทั้งตัวอักษรและลำดับตัวเลข B48 ไม่สลับเป็น B84'],
'L11':['ข้อมูลบอกว่าไม่ได้ทำอาหาร จึงตอบ Nein; จากนั้นใช้ Perfekt เล่าสิ่งที่ทำแทน','โครงสร้าง: ประธาน + กริยาช่วย (ผันตามประธาน) + ... + Partizip II\nตัวอย่าง: Ich habe Freunde getroffen.\nคำกริยาหลักรูป Partizip II อยู่ท้ายประโยค','เรียงเวลา: von neun bis siebzehn Uhr = ตั้งแต่ 9 ถึง 17 นาฬิกา\nเมื่อวลีเวลาขึ้นต้น กริยาช่วยที่ผันแล้วอยู่ตำแหน่งที่ 2: habe ich gearbeitet\nDanach = หลังจากนั้น; กริยาช่วยที่ผันแล้วอยู่ตำแหน่งที่ 2','ab = ตั้งแต่เวลานั้น ใช้บอกจุดเริ่ม\nhalb sechs ในบริบทนี้คือ 17:30','Am Morgen = ตอนเช้า; danach/dann ใช้เล่าเหตุการณ์ต่อกัน\nเมื่อขึ้นต้นด้วยเวลา/คำบอกลำดับ กริยาช่วยที่ผันแล้วอยู่ตำแหน่งที่ 2','ป้ายระบุวันเปิดและช่วงเวลาแยกกัน\nVon Montag bis Freitag = ตั้งแต่วันจันทร์ถึงวันศุกร์\nvon neun bis siebzehn Uhr = ตั้งแต่ 9 ถึง 17 นาฬิกา','am + วัน: am Mittwoch = วันพุธ\num + เวลา: um acht Uhr = เวลา 8 โมง','โจทย์ถามวันปิด จึงเลือกวันเสาร์และวันอาทิตย์'],
'L12':['ตอบทั้งเดินทางกับใครและความรู้สึกต่อทริปตามข้อมูล','ใช้ hatte Glück กับเรื่องอากาศ และ hatte viel Spaß กับความสนุก','ความจริงอากาศไม่ดี จึงปฏิเสธการคาดเดาของ A','มกราคมเป็นฤดูหนาวในเยอรมนี ใช้ im กับเดือนและฤดู','ตอบเดือนพฤษภาคมด้วย im Mai','ข้อมูลกำหนดเดือนพฤษภาคมและระยะเวลาสามวัน ต้องตอบทั้งสองอย่าง','seit 2000 บอกว่ามีงานนี้มาตั้งแต่ปี 2000','ungefähr บอกจำนวนโดยประมาณ ข้อมูลคือหนึ่งพันคน','ใช้ habe … gefeiert เล่าเหตุการณ์ที่ผ่านมา และ in Düsseldorf บอกเมือง']
}
# Additional teaching content supported by the worksheet/book, outside the older draft's narrow scope.
EXTRAS={
'L06':[dict(id='L06-COMM-03',name='ขอและบอกความต้องการของใช้ในสำนักงาน',sources=[dict(sourceId='worksheet-l01-l12',pdfPage=63,label='habe / sehe / suche / brauche'),dict(sourceId='worksheet-l01-l12',pdfPage=64,label='office dialogue'),dict(sourceId='book',pdfPage=38,label='6–8')],note=['Was brauchst du? ถามว่าต้องการอะไร','บอกว่าไม่มีด้วย keinen กับ Stift ในประโยคนี้'],examples=[('E01','Was brauchst du?','Ich brauche einen Stift.','เธอต้องการอะไร','ฉันต้องการปากกา',B('object','ของที่ B ต้องการ',('ของใช้','ปากกา')),['Ich brauche einen Computer.','Ich brauche eine Tasche.'],'บอกสิ่งที่ต้องการด้วย Ich brauche …'),('E02','Hast du einen Stift?','Nein, ich habe keinen Stift.','เธอมีปากกาไหม','ไม่ ฉันไม่มีปากกา',B('object','ของใช้ของ B',('ปากกา','ไม่มี')),None,'ใช้ keinen ปฏิเสธคำนาม Stift ในประโยคนี้')])],
'L09':[dict(id='L09-COMM-02',name='อวยพรก่อนกินอาหาร',sources=[dict(sourceId='book',pdfPage=50,label='Im Café'),dict(sourceId='worksheet-l01-l12',pdfPage=127,label='meal dialogues')],note=['Guten Appetit! ใช้ก่อนเริ่มกินอาหาร','เมื่ออีกคนกำลังจะกินด้วย ตอบ Danke, gleichfalls! เพื่ออวยพรกลับได้'],examples=[('E01','Guten Appetit!','Danke, gleichfalls!','ขอให้อร่อยนะ','ขอบคุณ เช่นกันนะ',B('menu','ก่อนเริ่มมื้ออาหาร',('A และ B','กำลังจะกินอาหารทั้งคู่'),('B ต้องการ','ขอบคุณและอวยพรกลับ')),['Tut mir leid, wir haben kein Eis mehr.','Auf Wiederhören.'],'ทั้งคู่กำลังจะกิน จึงขอบคุณและอวยพรกลับด้วย gleichfalls')])]
}
# Per-lesson source mechanics were visually re-reviewed from the worksheet, which has non-sequential lesson sections.
WS={'L03':[31,32,35,36,37,39,40,41,42],'L04':[44,46,47,48,49,50,51],'L05':[53,54,55,56,57,58],'L06':[60,61,62,63,64,65,66],'L07':[68,69,70,71,72,73,74,76,77,78,79,80,83,85,88,89],'L08':list(range(91,104)),'L09':list(range(121,136)),'L10':list(range(105,120)),'L11':list(range(137,150)),'L12':list(range(151,161))}
TITLES={
'L03-COMM-01':'คนในครอบครัว','L03-COMM-02':'ใช่หรือไม่ใช่','L03-COMM-03':'พูดภาษาอะไรได้บ้าง',
'L04-COMM-01':'ถามราคา','L04-COMM-02':'ชอบแบบไหน','L04-COMM-03':'เห็นด้วยไหม',
'L05-COMM-01':'เรียกเป็นภาษาเยอรมันว่าอะไร','L05-COMM-02':'สีและวัสดุ','L05-COMM-03':'ฟังไม่ชัดและขอบคุณ','L05-COMM-04':'บอกอีเมล',
'L06-COMM-01':'รับสายและขอสาย','L06-COMM-02':'ให้รอและจบสาย','L06-COMM-03':'ขอของใช้ในสำนักงาน',
'L07-COMM-01':'ทำอะไรได้บ้าง','L07-COMM-02':'ชมและขอบคุณ','L07-COMM-03':'งานอดิเรก','L07-COMM-04':'ทำบ่อยแค่ไหน',
'L08-COMM-01':'ชวนและนัดหมาย','L08-COMM-02':'ว่างไหม ไปได้ไหม','L08-COMM-03':'ตอนนี้กี่โมง',
'L09-COMM-01':'ชอบกินอะไร','L09-COMM-02':'ขอให้อร่อย','L09-COMM-03':'สั่งอาหาร','L09-COMM-04':'เมื่อของหมด',
'L10-COMM-01':'ขึ้นรถ เปลี่ยนรถ และนัดรับ','L10-COMM-02':'เข้าใจแล้ว แน่ใจไหม','L10-COMM-03':'หวังว่าจะได้เจอกัน','L10-COMM-04':'อ่านและฟังประกาศ',
'L11-COMM-01':'เล่าอดีตด้วย Perfekt','L11-COMM-02':'บอกช่วงเวลาและลำดับในอดีต','L11-COMM-03':'เปิดปิดและเริ่มเมื่อไร',
'L12-COMM-01':'ทริปที่ผ่านมา','L12-COMM-02':'วันเกิดของคุณ','L12-COMM-03':'คุยเรื่องเทศกาล'}
all_banks={};inventory=[];clips=[];model_assets=[]
for lesson in draft['lessons'][2:]:
 lid=lesson['lessonId'];topics=[];entries=[];flat=[e for o in lesson['objectives'] for e in o['examples']]
 assert len(flat)==len(V[lid])==len(D[lid])==len(REASONS[lid]),lid
 visuals={e['id']:v for e,v in zip(flat,V[lid])};distractors={e['id']:v for e,v in zip(flat,D[lid])};reasons={e['id']:v for e,v in zip(flat,REASONS[lid])}
 def unit(tid,answer,meaning,kind='choice',skill=None):
  return dict(id=tid+'-response',targetId=tid+'-target',subskill=skill or ('phrase_word_order' if kind=='order' else 'phrase_dialogue_response'),difficulty=3 if skill and 'listening' in skill else 2,rationale='ฟังข้อมูลจากเสียงที่ไม่แสดงคำตอบให้; มีตัวอย่างการสอนและฟังซ้ำได้' if skill and 'listening' in skill else 'ต้องเชื่อมบทพูดกับข้อมูลและบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ จึงยังไม่ใช่ผลิตภาษาอิสระ',answer=answer,meaning=meaning)
 def make_task(e,v,wrong,why,obj,sources):
  tid=e['id']+'-learn-v1';answer=e['reply']['de'];kind='choice' if wrong else 'order'
  q=dict(id=tid,kind=kind,prompt=e['precedingTurn']['de'],promptMeaning=e['precedingTurn']['th'],visual=v,audio=None,explanation=why,assistance=['prior-model','provided-context','reply-options' if wrong else 'supplied-words'],unit=unit(tid,answer,e['reply']['th'],kind))
  if wrong:
   assert len(set(wrong+[answer]))==3,(tid,wrong,answer)
   idx=sum(map(ord,tid))%3;q['options']=wrong[:];q['options'].insert(idx,answer)
  else:
   tokens=answer.split();assert len(tokens)>=2,(tid,answer);q['tokens']=tokens[1::2]+tokens[::2]
  entry=dict(taskId=tid,sourceExampleId=e['id'],objectiveId=obj,sources=sources,authoring='product-authored reviewed scenario and distractors, not publisher answer key',visualFacts=v,targets=[q['unit']])
  entries.append(entry);return q
 def add_clip(path,turns):clips.append(dict(path=path,turns=[dict(voice='de-DE-KatjaNeural' if i%2==0 else 'de-DE-ConradNeural',text=text) for i,text in enumerate(turns)]))
 for o in lesson['objectives']:
  oid=o['objectiveId'];examples=o['examples'];qs=[];models=[]
  for e in examples:
   q=make_task(e,visuals[e['id']],distractors[e['id']],reasons[e['id']],oid,o['sources']);qs.append(q)
   models.append(dict(question=e['precedingTurn']['de'],reply=e['reply']['de'],questionMeaning=e['precedingTurn']['th'],replyMeaning=e['reply']['th'],visual=visuals[e['id']]))
  if lid=='L11' and oid=='L11-COMM-01':
   simple_examples=[('Ich habe gekocht.','ฉันทำอาหารแล้ว','ทำอาหาร'),('Ich habe gelesen.','ฉันอ่านแล้ว','อ่านหนังสือ')]
   for model,(reply,meaning,activity) in zip(models,simple_examples):
    model.update(question='Was hast du gemacht?',questionMeaning='เธอทำอะไรมา?',reply=reply,replyMeaning=meaning,visual=B('timeline','กิจกรรมของ B',('กิจกรรม',activity)))
  audio=f'/audio/{lid.lower()}/model-{oid.lower()}.m4a';add_clip(audio,[text for m in models for text in (m['question'],m['reply'])])
  if lid=='L11':
   for index,model in enumerate(models):
    if oid!='L11-COMM-01':
     model.update(L11_MODEL_TEACHING[oid][index])
     if oid=='L11-COMM-02':model['replySentences']=L11_TIME_SENTENCES[index]
     model['audio']=f'/audio/l11/model-{oid.lower()}-card-{index+1:02}.m4a'
     add_clip(model['audio'],[model['question'],model['reply']])
  grammar_patterns=None
  if lid=='L11' and oid=='L11-COMM-01':
   grammar_patterns=[]
   for pattern in L11_GRAMMAR_PATTERNS:
    pattern=dict(pattern)
    pattern['presentParts']=L11_PRESENT_PARTS[pattern['id']]
    labels=dict(question='คำถาม',subject='ประธาน',auxiliary='กริยาช่วย (ผันแล้ว)',other='ส่วนอื่น',participle='กริยาหลัก · Partizip II')
    pattern['pastParts']=[sentence_part(p['text'],p['role'],labels[p['role']],'ตำแหน่ง 1' if 'ตำแหน่ง 1' in p.get('position','') else 'ตำแหน่ง 2' if 'ตำแหน่ง 2' in p.get('position','') else 'ท้ายประโยค' if p['role']=='participle' else None) for p in pattern['parts']]
    pattern['audio']=f"/audio/l11/perfekt-{pattern['id']}.m4a"
    grammar_patterns.append(pattern)
    clips.append(dict(path=pattern['audio'],turns=[dict(voice='de-DE-KatjaNeural',text=pattern['present']),dict(voice='de-DE-KatjaNeural',text=pattern['past'])]))
  topic=dict(id=oid,objective=oid,title=TITLES[oid],modelVisual=models[0]['visual'],note=NOTES[oid],audio=audio,models=models,legacyIds=sorted({match for e in examples for match in e.get('legacyExactReplyMatches',[]) if isinstance(match,str)}),tasks=qs)
  if grammar_patterns:topic['grammarPatterns']=grammar_patterns
  topics.append(topic)
 for extra in EXTRAS.get(lid,[]):
  qs=[];models=[]
  for suffix,p,a,pm,am,v,wrong,why in extra['examples']:
   e=dict(id=extra['id']+'-'+suffix,precedingTurn=dict(de=p,th=pm),reply=dict(de=a,th=am))
   qs.append(make_task(e,v,wrong,why,extra['id'],extra['sources']));models.append(dict(question=p,reply=a,questionMeaning=pm,replyMeaning=am,visual=v))
  path=f'/audio/{lid.lower()}/model-{extra["id"].lower()}.m4a';add_clip(path,[text for m in models for text in (m['question'],m['reply'])]);topics.append(dict(id=extra['id'],objective=extra['id'],title=TITLES[extra['id']],modelVisual=models[0]['visual'],note=extra['note'],audio=path,models=models,legacyIds=[],tasks=qs))
 def listening(oid,suffix,prompt,answer,meaning,spoken,kind='choice',options=None,label=None,skill='detail_listening',question=None,maxLength=20,source=None):
  topic=next(t for t in topics if t['id']==oid);tid=f'{oid}-{suffix}-learn-v1';u=unit(tid,answer,meaning,kind,skill)
  path=f'/audio/{lid.lower()}/{tid.lower()}.m4a';q=dict(id=tid,kind=kind,prompt=prompt,promptMeaning='',visual=None,audio=path,explanation='ตอบจากข้อมูลในเสียงที่ได้ฟัง โดยไม่ดูข้อความเฉลยก่อนตอบ',assistance=['prior-model','replayable-german-audio']+(['reply-options'] if kind=='choice' else []),unit=u)
  if kind=='choice':q['options']=options;assert options.count(answer)==1
  else:q.update(label=label,maxLength=maxLength)
  add_clip(path,[question or topic['models'][0]['question'],spoken]);topic['tasks'].append(q);entries.append(dict(taskId=tid,objectiveId=oid,sources=source or next((e['sources'] for e in entries if e['objectiveId']==oid),next((o['sources'] for o in lesson['objectives'] if o['objectiveId']==oid),[])),authoring='product-authored listening transfer; synthetic voices, no publisher recording',visualFacts=None,targets=[u]))
  return q
 if lid=='L03':
  listening('L03-COMM-03','AUDIO','ฟังแล้วเลือกภาษาที่พูดได้เล็กน้อย','Englisch.','พูดอังกฤษได้เล็กน้อย','Ich spreche sehr gut Thai und ein bisschen Englisch.',options=['Deutsch.','Englisch.','Französisch.'],question='Welche Sprachen sprichst du?')
 if lid=='L04':
  listening('L04-COMM-01','AUDIO','ฟังแล้วใส่ราคาเป็นยูโร','42','ราคา 42 ยูโร','Sie kostet zweiundvierzig Euro.',kind='digits',label='ราคา (ยูโร)',skill='price_listening',question='Was kostet die Lampe?',maxLength=4)
 if lid=='L05':
  # Do not assess copying a visible spelling or address. Keep the old draft provenance; these IDs have never been live before this implementation.
  t=next(t for t in topics if t['id']=='L05-COMM-01');old=next(q for q in t['tasks'] if q['id']=='L05-COMM-01-D02-learn-v1');t['tasks'].remove(old);entries[:]=[e for e in entries if e['taskId']!=old['id']]
  q=listening('L05-COMM-01','SPELLING','ฟังแล้วพิมพ์คำที่สะกด','Schirm','ร่ม','Es. Tse. Ha. I. Er. Em.',kind='text',label='คำที่สะกด',skill='word_spelling_listening',question='Wie schreibt man das?',maxLength=30)
  q['unit']['nounLabel']='der Schirm';q['assistance'].append('supplied-noun-article')
  t=next(t for t in topics if t['id']=='L05-COMM-04');old=t['tasks'].pop();entries[:]=[e for e in entries if e['taskId']!=old['id']]
  listening('L05-COMM-04','AUDIO','ฟังแล้วใส่อีเมล','nora_42@example.com','อีเมล nora_42@example.com','En. O. Er. A. Unterstrich. Vier. Zwei. At. example. Punkt. com.',kind='text',label='อีเมล',skill='email_listening',question='Wie ist deine E-Mail-Adresse?',maxLength=80)
 if lid=='L06':
  listening('L06-COMM-02','AUDIO','ฟังแล้วเลือกสถานะคนที่ขอสาย','Frau Meier ist nicht da.','คุณไมเออร์ไม่อยู่','Frau Meier ist leider nicht da.',options=['Frau Meier ist da.','Frau Meier ist nicht da.','Frau Meier spricht gerade.'],question='Ist Frau Meier da?')
 if lid=='L07':
  listening('L07-COMM-01','AUDIO','ฟังแล้วเลือกระดับความสามารถ','Sehr gut.','ว่ายน้ำได้ดีมาก','Ja, ich kann sehr gut schwimmen.',options=['Gar nicht.','Ein bisschen.','Sehr gut.'],question='Kannst du schwimmen?')
 if lid=='L08':
  listening('L08-COMM-01','AUDIO','ฟังแล้วเลือกเวลานัด','17:30','เวลานัด 17:30','Um halb sechs am Nachmittag.',options=['16:30','17:30','18:30'],question='Wann treffen wir uns?')
 if lid=='L09':
  listening('L09-COMM-03','AUDIO','ฟังแล้วเลือกรายการที่ลูกค้าสั่ง','Eine Tasse Kaffee und einen Kuchen.','กาแฟกับเค้ก','Eine Tasse Kaffee und einen Kuchen, bitte.',options=['Eine Tasse Tee und einen Kuchen.','Eine Tasse Kaffee und einen Kuchen.','Eine Tasse Kaffee und einen Salat.'],question='Was möchten Sie?')
 if lid=='L10':
  q=listening('L10-COMM-04','AUDIO','ฟังประกาศแล้วใส่ชานชาลา','6','ชานชาลา 6','Der Zug nach Berlin fährt von Gleis sechs ab.',kind='digits',label='ชานชาลา',question='Wo fährt der Zug nach Berlin ab?',maxLength=2)
  q['explanation']='ประกาศระบุ Gleis sechs จึงใส่ 6; ผลข้อนี้เป็นการฟัง แยกจากการอ่านกระดาน'
  clip=next(c for c in clips if c['path']==q['audio']);clip['turns']=[dict(voice='de-DE-ConradNeural',text='Achtung, eine Durchsage. Der Zug nach Berlin fährt von Gleis sechs ab.')]
 if lid=='L11':
  listening('L11-COMM-03','AUDIO','ฟังแล้วเลือกเวลาเริ่มเรียน','07:00','เริ่มเรียนเวลา 07:00','Am Mittwoch um sieben Uhr.',options=['07:00','08:00','09:00'],question='Wann beginnt der Unterricht?')
 if lid=='L12':
  listening('L12-COMM-02','AUDIO','ฟังแล้วเลือกเดือนเกิด','Im Juni.','เกิดเดือนมิถุนายน','Ich habe im Juni Geburtstag.',options=['Im Januar.','Im Juni.','Im Juli.'],question='Wann hast du Geburtstag?')
 if lid=='L11':
  for topic in topics:
   for task in topic['tasks']:
    if task['promptMeaning']:
     task['feedbackAudio']=f"/audio/l11/feedback-{task['id'].replace('-learn-v1','').lower()}.m4a"
     add_clip(task['feedbackAudio'],[task['prompt'],task['unit']['answer']])
 # Short profiles measure reading separately and score each field, never one overall competency.
 if lid in ['L03','L09','L11','L12']:
  profiles={
   'L03':('L03-COMM-01','Lena ist Annas Schwester. Lena spricht Thai und Deutsch.', [('name','ชื่อน้องสาวของ Anna','Lena','น้องสาวชื่อเลนา'),('language','ภาษาอื่นนอกจากไทย','Deutsch','พูดภาษาเยอรมัน')]),
   'L09':('L09-COMM-03','Nora möchte einen Salat. Tim möchte einen Kuchen. Beide möchten Kaffee.', [('nora','Nora ต้องการอาหารอะไร','Salat','นอร่าต้องการสลัด'),('tim','Tim ต้องการอาหารอะไร','Kuchen','ทิมต้องการเค้ก')]),
   'L11':('L11-COMM-03','Die Praxis ist von Montag bis Freitag von 9 bis 17 Uhr geöffnet. Am Samstag und am Sonntag ist sie geschlossen.', [('open','เวลาเปิด (ชั่วโมง)','9','เปิดเวลา 9 นาฬิกา'),('close','เวลาปิด (ชั่วโมง)','17','ปิดเวลา 17 นาฬิกา')]),
   'L12':('L12-COMM-03','Das Stadtfest ist im Mai. Es dauert drei Tage. Das Fest gibt es seit 2000.', [('month','เดือนที่จัดงาน','Mai','จัดเดือนพฤษภาคม'),('year','ปีที่เริ่มจัดงาน','2000','เริ่มจัดตั้งแต่ปี 2000')])}
  oid,text,fields=profiles[lid];tid=f'{oid}-PROFILE-learn-v1';units=[]
  for name,label,answer,meaning in fields:
   u=unit(tid+'-'+name,answer,meaning,skill='information_reading');u['difficulty']=2;
   if lid=='L09':u['nounLabel']='der '+answer
   u['rationale']='อ่านหาข้อมูลเฉพาะจากข้อความ; ตรวจแต่ละช่องแยกกัน ไม่ใช่การฟังหรือผลิตภาษาอิสระ';units.append(dict(label=label,unit=u))
  q=dict(id=tid,kind='profile',prompt='อ่านแล้วเติมข้อมูล',promptMeaning='',visual=dict(kind='reading',text=text),audio=None,explanation='หาข้อมูลเฉพาะของแต่ละช่องจากข้อความ โดยเก็บผลแยกกัน',assistance=['prior-model','visible-reading']+(['supplied-noun-articles'] if lid=='L09' else []),fields=units)
  next(t for t in topics if t['id']==oid)['tasks'].append(q);entries.append(dict(taskId=tid,objectiveId=oid,sources=next(e['sources'] for e in entries if e['objectiveId']==oid),authoring='product-authored reading profile with independent field evidence',visualFacts=q['visual'],targets=[f['unit'] for f in units]))
 all_banks[lid]=topics;inventory.append(dict(lessonId=lid,version=1,worksheetPdfPages=WS[lid],sources=next(a['sources'] for a in audit['lessons'] if a['lessonId']==lid),topics=[dict(id=t['id'],title=t['title'],objective=t['objective'],legacyIds=t['legacyIds']) for t in topics],tasks=entries))
# Annotations are presentation metadata. Never change canonical answers or scoring.
L11_FEEDBACK_REASONS={
 'L11-COMM-01-D02-learn-v1':'ข้อมูลระบุว่าวันเสาร์ที่แล้วพบเพื่อน จึงใช้ Freunde getroffen เล่าเหตุการณ์นั้น',
 'L11-COMM-02-D01-learn-v1':'ทำงานตั้งแต่ 09:00 ถึง 17:00 แล้วจึงทำอาหาร จึงใช้ Danach เชื่อมเหตุการณ์ที่เกิดขึ้นถัดไป',
 'L11-COMM-02-D03-learn-v1':'ข้อมูลเรียงจากกินอาหารเช้าไปสู่การพบเพื่อน จึงเล่าด้วย Am Morgen แล้วตามด้วย Dann',
 'L11-COMM-03-AUDIO-learn-v1':'ในเสียงบอกว่า Am Mittwoch um sieben Uhr. คำว่า um sieben Uhr หมายถึงเวลา 07:00',
 'L11-COMM-03-PROFILE-learn-v1':'von 9 bis 17 Uhr บอกช่วงเวลาเปิด: เปิดเวลา 9 นาฬิกา และปิดเวลา 17 นาฬิกา'
}
for topic in all_banks['L11']:
 for model in topic['models']:
  model['questionSentences']=L11_SENTENCES[model['question']]
  model['replySentences']=L11_SENTENCES[model['reply']]
 for task in topic['tasks']:
  if task['promptMeaning']:
   task['feedbackDialogue']=dict(question=L11_SENTENCES[task['prompt']],reply=L11_SENTENCES[task['unit']['answer']])
  if task['id'] in L11_FEEDBACK_REASONS:task['explanation']=L11_FEEDBACK_REASONS[task['id']]
 for pattern in topic.get('grammarPatterns',[]):
  for text,parts in [(pattern['present'],pattern['presentParts']),(pattern['past'],pattern['pastParts'])]:assert ' '.join(p['text'] for p in parts)==text
def annotated_text(sentences):return ' '.join(' '.join(p['text'] for p in sentence) for sentence in sentences)
# Validate generated activity bindings, source facts, response uniqueness and bundled resource declarations.
seen=set()
for lid,topics in all_banks.items():
 for t in topics:
  assert t['models'] and t['tasks'] and t['note'],t['id']
  for model in t['models']:
   if 'replySentences' in model:assert ' '.join(' '.join(part['text'] for part in sentence) for sentence in model['replySentences'])==model['reply'],t['id']
   if 'questionSentences' in model:assert annotated_text(model['questionSentences'])==model['question'],t['id']
  for q in t['tasks']:
   if 'feedbackDialogue' in q:
    assert annotated_text(q['feedbackDialogue']['question'])==q['prompt'],q['id']
    assert annotated_text(q['feedbackDialogue']['reply'])==q['unit']['answer'],q['id']
   assert q['id'] not in seen;seen.add(q['id'])
   if q['kind']=='order':assert sorted(q['tokens'])==sorted(q['unit']['answer'].split())
   if q['kind']=='choice':assert len(set(q['options']))==len(q['options']) and q['options'].count(q['unit']['answer'])==1
   if q['audio']:assert q['visual'] is None # no written answer in listening context
   for u in [f['unit'] for f in q['fields']] if q['kind']=='profile' else [q['unit']]:assert u['rationale'] and u['targetId']
(R/'src/data/a11-phrase-dialogues.ts').write_text('import type { DialogueTopic } from "@/lib/phrase-dialogue-learning";\nexport const a11PhraseDialogues: Readonly<Record<string, readonly DialogueTopic[]>> = '+json.dumps(all_banks,ensure_ascii=False,indent=2)+';\n')
(R/'docs/exercise-mapping/l03-l12-phrase-dialogue-inventory.json').write_text(json.dumps(dict(version=1,reviewedAt='2026-11-06',sourceCatalog='l03-l12-phrase-source-review.json',primarySourceId='book',scope='local-tester-Learn-replacement',authoring='authored examples/distractors/recordings; source functions and worksheet mechanics reviewed; no publisher answer keys or copied recordings',lessons=inventory),ensure_ascii=False,indent=2)+'\n')
(R/'docs/exercise-mapping/l03-l12-phrase-audio.json').write_text(json.dumps(dict(version=1,origin='synthetic fictional German dialogues and sentence comparisons; no personal voice cloning',clips=clips),ensure_ascii=False,indent=2)+'\n')
for lid,topics in all_banks.items():
 tasks=[q for t in topics for q in t['tasks']];units=[u for q in tasks for u in ([f['unit'] for f in q['fields']] if q['kind']=='profile' else [q['unit']])];print(lid,len(topics),'topics',len(tasks),'activities',len(units),'response units')
print(len(clips),'audio clips')
