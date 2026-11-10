#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build reviewable content packets only; never mutate runtime banks or learner data."""
import json,hashlib,re
from pathlib import Path
R=Path(__file__).resolve().parents[2]
OUT=R/'docs/lesson-preparation'
CAT=json.loads((R/'supabase/seed/catalog.json').read_text())
DATE='2026-11-09'

def noun(head,plural,thai,group,page,example,existing=None,number='singular'):
 article,word=head.split(' ',1)
 return dict(kind='noun',headword=head,word=word,article=article,plural=plural,number=number,meaning=thai,group=group,example=example,sourcePage=page,existingId=existing,morphologyStatus='author_reviewed_not_independently_dictionary_verified')
def term(text,thai,group,page,example,kind='verb',variants=None,nouns=None):
 return dict(kind=kind,headword=text,word=text,meaning=thai,group=group,example=example,sourcePage=page,variants=variants or [],nouns=nouns or [])

def parts(spec):
 result=[]
 for raw in spec.split('|'):
  tag,text=raw.split(':',1);position=None
  if tag.endswith(('1','2')):position='ตำแหน่ง '+tag[-1];tag=tag[:-1]
  if tag=='inf':role='verb';label='กริยาหลัก · Infinitiv';position='ท้ายประโยค'
  elif tag=='prefix':role='verb';label='ส่วนแยกของกริยา';position='ท้ายประโยค'
  elif tag=='participle':role=tag;label='กริยาหลัก · Partizip II';position='ท้ายประโยค'
  else:role=tag;label={'subject':'ประธาน','verb':'กริยาหลัก (ผันแล้ว)','auxiliary':'กริยาช่วย (ผันแล้ว)','time':'เวลา / ลำดับ','sequence':'ลำดับเหตุการณ์','question':'คำถาม','other':'ส่วนขยาย / ข้อมูล'}[role]
  result.append(dict(text=text,role=role,label=label,**({'position':position}if position else{})))
 return result

def model(group,purpose,context,q,qth,a,ath,qs,ans,page,wrong):
 return dict(group=group,purpose=purpose,context=context,question=q,questionMeaning=qth,reply=a,replyMeaning=ath,questionSentences=[parts(qs)],replySentences=[parts(ans)],sourcePage=page,distractors=wrong)

v15=[]
pl15=['die Häuser','die Wohnungen','die Zimmer','die Arbeitszimmer','die Wohnzimmer','die Schlafzimmer','die Kinderzimmer','die Bäder','die Küchen','die Toiletten','die Flure','die Balkone','die Gärten','die Treppen','die Fenster','die Türen','die Betten','die Lampen','die Sessel','die Sofas','die Tische','die Schränke','die Teppiche','die Stühle']
for i,item in enumerate(x for x in CAT['items']if x.get('lessonId')=='L15' and x.get('skill')=='vocabulary'):
 page=18 if i<8 or i==19 else 19 if i<16 or i in [17,18,22] else None
 meaning='ห้องน้ำสำหรับล้างตัวหรืออาบน้ำ'if item['word']=='Bad'else item['meaning']
 v15.append(noun(item['answer'],pl15[i],meaning,item['group'],page,'Das ist '+({'der':'ein','die':'eine','das':'ein'}[item['article']])+' '+item['word']+'.',existing=item['id']))

v16=[noun(*row)for row in [
('der Aufzug','die Aufzüge','ลิฟต์','อุปกรณ์',28,'Der Aufzug funktioniert nicht.'),
('der Kühlschrank','die Kühlschränke','ตู้เย็น','อุปกรณ์',28,'Der Kühlschrank ist kaputt.'),
('der Fernseher','die Fernseher','โทรทัศน์','อุปกรณ์',28,'Der Fernseher funktioniert nicht.'),
('die Heizung','die Heizungen','เครื่องหรือระบบทำความร้อน','อุปกรณ์',28,'Die Heizung ist kaputt.'),
('das Licht','die Lichter','ไฟหรือแสงสว่าง','อุปกรณ์',28,'Das Licht funktioniert nicht.'),
('das Telefon','die Telefone','โทรศัพท์','อุปกรณ์',28,'Das Telefon funktioniert nicht.'),
('die Dusche','die Duschen','ฝักบัวหรือที่อาบน้ำฝักบัว','อุปกรณ์',29,'Die Dusche ist kaputt.'),
('das Netz','die Netze','เครือข่ายหรือสัญญาณโทรศัพท์','อุปกรณ์',29,'Ich habe hier kein Netz.'),
('der Herd','die Herde','เตาปรุงอาหาร','อุปกรณ์',29,'Der Herd funktioniert nicht.'),
('die Klingel','die Klingeln','กริ่ง','อุปกรณ์',29,'Die Klingel funktioniert nicht.'),
('die Steckdose','die Steckdosen','เต้ารับไฟฟ้า','อุปกรณ์',29,'Hier ist eine Steckdose.'),
('die Waschmaschine','die Waschmaschinen','เครื่องซักผ้า','อุปกรณ์',29,'Die Waschmaschine ist kaputt.'),
('das Problem','die Probleme','ปัญหา','การขอความช่วยเหลือ',28,'Wir haben ein Problem.'),
('die Hilfe','die Hilfen','ความช่วยเหลือ','การขอความช่วยเหลือ',28,'Ich brauche Ihre Hilfe.'),
('der Termin','die Termine','นัดหมาย','การนัดหมาย',29,'Ich habe am Montag einen Termin.'),
('die Stunde','die Stunden','ชั่วโมง','การนัดหมาย',29,'Ich komme in einer Stunde.'),
('der Monat','die Monate','เดือน','การนัดหมาย',29,'Der Kurs beginnt in einem Monat.'),
('das Jahr','die Jahre','ปี','การนัดหมาย',29,'Der Kurs beginnt in einem Jahr.'),
]]+[term(*row)for row in [
('funktionieren','ทำงานได้หรือใช้งานได้','การขอความช่วยเหลือ',28,'Das Telefon funktioniert nicht.'),
('reparieren','ซ่อม','การขอความช่วยเหลือ',28,'Ich kann das reparieren.'),
('verschieben','เลื่อนนัดหรือเปลี่ยนเวลา','การนัดหมาย',30,'Können wir den Termin verschieben?'),
('absagen','ยกเลิกนัด','การนัดหมาย',30,'Ich sage den Termin ab.'),
('vorschlagen','เสนอ','การนัดหมาย',30,'Ich möchte einen Termin vorschlagen.'),
('kaputt','เสียหรือชำรุด','การขอความช่วยเหลือ',28,'Der Herd ist kaputt.','adjective'),
]]

chunk17=[
('einen Blog schreiben','เขียนบล็อก',32,'Ich will einen Blog schreiben.',[],['der Blog']),
('Chef werden','เป็นหัวหน้าหรือผู้บริหาร',32,'Ich will Chef werden.',['Chefin werden'],['der Chef','die Chefin']),
('Schauspieler werden','เป็นนักแสดง',32,'Ich will Schauspieler werden.',['Schauspielerin werden'],['der Schauspieler','die Schauspielerin']),
('Politiker werden','เป็นนักการเมือง',32,'Ich will Politiker werden.',['Politikerin werden'],['der Politiker','die Politikerin']),
('Geld verdienen','หาเงินหรือมีรายได้',32,'Ich will Geld verdienen.',[],['das Geld']),
('heiraten','แต่งงาน',32,'Wir wollen heiraten.',[],[]),
('eine Familie haben','มีครอบครัว',32,'Ich will eine Familie haben.',[],['die Familie']),
('auf einen Berg steigen','ขึ้นภูเขา',32,'Ich will auf einen Berg steigen.',[],['der Berg']),
('durch Europa reisen','เดินทางท่องเที่ยวไปตามประเทศในยุโรป',33,'Ich will durch Europa reisen.',[],[]),
('um die Welt segeln','แล่นเรือรอบโลก',33,'Ich will um die Welt segeln.',[],['die Welt']),
('im Ausland leben','อาศัยอยู่ต่างประเทศ',33,'Ich will im Ausland leben.',[],['das Ausland']),
('Motorrad fahren','ขี่รถจักรยานยนต์',33,'Ich will Motorrad fahren.',[],['das Motorrad']),
('den Führerschein machen','เรียนและสอบเพื่อให้ได้ใบขับขี่',33,'Ich will den Führerschein machen.',[],['der Führerschein']),
('ein Instrument lernen','เรียนเล่นเครื่องดนตรี',33,'Ich will ein Instrument lernen.',[],['das Instrument']),
('viele Fremdsprachen lernen','เรียนภาษาต่างประเทศหลายภาษา',33,'Ich will viele Fremdsprachen lernen.',[],['die Fremdsprache']),
('drei Monate freihaben','หยุดหรือมีเวลาว่างสามเดือน',33,'Ich will drei Monate freihaben.',[],['der Monat']),
]
v17=[term(text,th,'แผนงานและความฝัน',page,ex,'verb'if text=='heiraten'else'chunk',variants,nouns)for text,th,page,ex,variants,nouns in chunk17]+[noun(*row)for row in [
('der Wunsch','die Wünsche','ความปรารถนาหรือสิ่งที่อยากทำ','คำประกอบแผน',34,'Ich habe einen Wunsch.'),
('der Plan','die Pläne','แผน','คำประกอบแผน',32,'Wir haben einen Plan.'),
('der Beruf','die Berufe','อาชีพ','คำประกอบแผน',32,'Der Beruf ist interessant.'),
('die Ausbildung','die Ausbildungen','การฝึกหรือเรียนวิชาชีพ','คำประกอบแผน',34,'Ich will eine Ausbildung machen.'),
('die Firma','die Firmen','บริษัท','คำประกอบแผน',32,'Wir wollen eine Firma gründen.'),
('das Geld',None,'เงิน','คำประกอบแผน',32,'Wir brauchen Geld.'),
]]
body=[('die Brust','die Brüste','หน้าอก'),('der Rücken','die Rücken','หลัง'),('der Bauch','die Bäuche','ท้อง'),('der Arm','die Arme','แขน'),('die Hand','die Hände','มือ'),('der Finger','die Finger','นิ้วมือ'),('das Bein','die Beine','ขา'),('das Knie','die Knie','เข่า'),('der Fuß','die Füße','เท้า'),('das Auge','die Augen','ตา'),('der Hals','die Hälse','คอ'),('der Mund','die Münder','ปาก'),('der Kopf','die Köpfe','ศีรษะ'),('die Nase','die Nasen','จมูก'),('das Ohr','die Ohren','หู')]
v18=[noun(h,p,t,'ร่างกาย',36 if i<7 else 37,'Das ist '+{'der':'ein','die':'eine','das':'ein'}[h.split()[0]]+' '+h.split(' ',1)[1]+'.')for i,(h,p,t)in enumerate(body)]
for word,th in [('Kopfschmerzen','อาการปวดศีรษะ'),('Rückenschmerzen','อาการปวดหลัง'),('Halsschmerzen','อาการเจ็บคอ'),('Ohrenschmerzen','อาการปวดหู'),('Bauchschmerzen','อาการปวดท้อง')]:v18.append(noun('die '+word,'die '+word,th,'อาการ',37 if word!='Bauchschmerzen'else 38,'Ich habe '+word+'.',number='plural'))
v18 += [noun(*row)for row in [
('der Schnupfen',None,'อาการน้ำมูกไหลหรือคัดจมูก','อาการ',37,'Ich habe Schnupfen.'),
('der Husten',None,'อาการไอ','อาการ',37,'Ich habe Husten.'),
('das Fieber',None,'ไข้','อาการ',37,'Ich habe Fieber.'),
('die Tablette','die Tabletten','ยาเม็ด','สิ่งของในสถานการณ์',38,'Hier ist eine Tablette.'),
('das Medikament','die Medikamente','ยา','สิ่งของในสถานการณ์',38,'Hier ist ein Medikament.'),
('die Salbe','die Salben','ยาทาหรือขี้ผึ้ง','สิ่งของในสถานการณ์',38,'Hier ist eine Salbe.'),
('der Hustensaft','die Hustensäfte','ยาแก้ไอชนิดน้ำ','สิ่งของในสถานการณ์',38,'Das ist Hustensaft.'),
]]

p15=[
model('แนะนำห้อง','บอกว่าห้องใดคือห้องอะไร',[['ภาพห้อง','ห้องทำงาน']], 'Was ist das?','นี่คืออะไร','Das ist das Arbeitszimmer.','นี่คือห้องทำงาน','question1:Was|verb2:ist|subject:das?','subject1:Das|verb2:ist|other:das Arbeitszimmer.',18,['Das ist das Bad.','Das ist das Schlafzimmer.']),
model('แนะนำห้อง','บอกว่ามีห้องชนิดใด',[['ข้อมูลที่พัก','มีระเบียง']], 'Hat die Wohnung einen Balkon?','ห้องชุดมีระเบียงไหม','Ja, die Wohnung hat einen Balkon.','มี ห้องชุดมีระเบียง','verb1:Hat|subject:die Wohnung|other:einen Balkon?','other:Ja,|subject1:die Wohnung|verb2:hat|other:einen Balkon.',20,['Nein, die Wohnung hat keinen Balkon.','Die Wohnung hat keinen Garten.']),
model('แสดงความคิดเห็น','บอกความเห็นต่อห้อง',[['ความรู้สึกต่อห้อง','สวย']], 'Wie findest du das Zimmer?','เธอคิดว่าห้องนี้เป็นอย่างไร','Ich finde das Zimmer schön.','ฉันคิดว่าห้องนี้สวย','question1:Wie|verb2:findest|subject:du|other:das Zimmer?','subject1:Ich|verb2:finde|other:das Zimmer|other:schön.',19,['Ich finde das Zimmer zu klein.','Ich finde das Zimmer zu teuer.']),
model('แสดงความคิดเห็น','ถามและตอบความรู้สึกต่อสวน',[['ความรู้สึกต่อสวน','ชอบเป็นพิเศษ']], 'Magst du den Garten?','เธอชอบสวนไหม','Ja, den Garten mag ich besonders.','ชอบ ฉันชอบสวนเป็นพิเศษ','verb1:Magst|subject:du|other:den Garten?','other:Ja,|other1:den Garten|verb2:mag|subject:ich|other:besonders.',20,['Nein, ich mag den Garten nicht.','Ich mag nur den Balkon.']),
model('บอกเจ้าของ','ระบุของของบุคคลที่กล่าวถึง',[['เจ้าของ','Tom'],['สิ่งของ','เก้าอี้นวม']], 'Ist das Toms Sessel?','นี่คือเก้าอี้นวมของ Tom ใช่ไหม','Ja, das ist sein Sessel.','ใช่ นี่คือเก้าอี้นวมของเขา','verb1:Ist|subject:das|other:Toms Sessel?','other:Ja,|subject1:das|verb2:ist|other:sein Sessel.',19,['Nein, das ist Klaras Sessel.','Nein, das ist Pauls Sessel.']),
model('บอกเจ้าของ','แสดงความเห็นโดยระบุเจ้าของ',[['เจ้าของ','Klara'],['ความรู้สึกต่อโคมไฟ','สวย']], 'Wie findest du Klaras Lampe?','เธอคิดว่าโคมไฟของ Klara เป็นอย่างไร','Ich finde ihre Lampe schön.','ฉันคิดว่าโคมไฟของเธอสวย','question1:Wie|verb2:findest|subject:du|other:Klaras Lampe?','subject1:Ich|verb2:finde|other:ihre Lampe|other:schön.',19,['Ich finde ihre Lampe zu klein.','Ich finde ihre Lampe zu teuer.']),
model('หาห้องพัก','ถามว่าห้องว่างหรือไม่',[['สถานะห้อง','ว่าง']], 'Ist das Zimmer noch frei?','ห้องนี้ยังว่างอยู่ไหม','Ja, das Zimmer ist noch frei.','ใช่ ห้องนี้ยังว่างอยู่','verb1:Ist|subject:das Zimmer|other:noch frei?','other:Ja,|subject1:das Zimmer|verb2:ist|other:noch frei.',18,['Nein, das Zimmer ist schon weg.','Das Zimmer ist nicht frei.']),
model('หาห้องพัก','ถามและบอกค่าเช่า',[['ค่าเช่ารวมต่อเดือน','620 Euro']], 'Was kostet das Zimmer im Monat?','ห้องนี้ค่าเช่าเดือนละเท่าไร','Es kostet 620 Euro im Monat.','ค่าเช่าเดือนละ 620 ยูโร','question1:Was|verb2:kostet|subject:das Zimmer|time:im Monat?','subject1:Es|verb2:kostet|other:620 Euro|time:im Monat.',19,['Es kostet 450 Euro im Monat.','Es kostet 690 Euro im Monat.']),
]
p16=[
model('แจ้งปัญหา','บอกว่าอุปกรณ์ใดใช้งานไม่ได้',[['อุปกรณ์ที่เสีย','ลิฟต์']], 'Was ist das Problem?','มีปัญหาอะไร','Der Aufzug funktioniert nicht.','ลิฟต์ใช้งานไม่ได้','question1:Was|verb2:ist|subject:das Problem?','subject1:Der Aufzug|verb2:funktioniert|other:nicht.',28,['Der Fernseher funktioniert nicht.','Die Waschmaschine ist kaputt.']),
model('แจ้งปัญหา','ขอความช่วยเหลือเรื่องการซ่อม',[['ความต้องการ','ขอความช่วยเหลือ']], 'Brauchen Sie Hilfe?','คุณต้องการความช่วยเหลือไหม','Ja, ich brauche Ihre Hilfe.','ต้องการ ฉันต้องการความช่วยเหลือจากคุณ','verb1:Brauchen|subject:Sie|other:Hilfe?','other:Ja,|subject1:ich|verb2:brauche|other:Ihre Hilfe.',28,['Nein, ich brauche keine Hilfe.','Nein, das kann ich selbst machen.']),
model('เสนอความช่วยเหลือ','บอกสิ่งที่ต้องการให้ช่วย',[['สิ่งที่ขอให้ซ่อม','เตาปรุงอาหาร']], 'Was kann ich für Sie tun?','ฉันช่วยอะไรคุณได้บ้าง','Können Sie den Herd reparieren?','คุณช่วยซ่อมเตาปรุงอาหารได้ไหม','question1:Was|auxiliary2:kann|subject:ich|other:für Sie|inf:tun?','auxiliary1:Können|subject:Sie|other:den Herd|inf:reparieren?',28,['Können Sie die Dusche reparieren?','Können Sie das Telefon reparieren?']),
model('เสนอความช่วยเหลือ','ตอบรับคำขออย่างตรงประเด็น',[['ความสามารถของช่าง','ซ่อมได้']], 'Können Sie das reparieren?','คุณซ่อมสิ่งนี้ได้ไหม','Ja, das kann ich reparieren.','ได้ ฉันซ่อมสิ่งนี้ได้','auxiliary1:Können|subject:Sie|other:das|inf:reparieren?','other:Ja,|other1:das|auxiliary2:kann|subject:ich|inf:reparieren.',28,['Nein, das kann ich nicht reparieren.','Das funktioniert leider nicht.']),
model('นัดหมาย','บอกวันและเวลาที่ว่าง',[['เวลาที่ B ว่าง','วันอังคาร 16:00']], 'Wann haben Sie Zeit?','คุณว่างเมื่อไร','Am Dienstag um 16 Uhr habe ich Zeit.','ฉันว่างวันอังคารเวลา 16 นาฬิกา','question1:Wann|verb2:haben|subject:Sie|other:Zeit?','time1:Am Dienstag um 16 Uhr|verb2:habe|subject:ich|other:Zeit.',30,['Am Montag um 16 Uhr habe ich Zeit.','Am Dienstag um 15 Uhr habe ich Zeit.']),
model('นัดหมาย','บอกว่าจะมาอีกนานเท่าไร',[['ตอนนี้','09:00'],['เวลาที่ B จะมา','10:00']], 'Wann kommen Sie?','คุณจะมาเมื่อไร','Ich komme in einer Stunde.','ฉันจะมาในอีกหนึ่งชั่วโมง','question1:Wann|verb2:kommen|subject:Sie?','subject1:Ich|verb2:komme|time:in einer Stunde.',29,['Ich komme in zwei Stunden.','Ich komme erst morgen.']),
model('เปลี่ยนนัด','ปฏิเสธเวลานัดเดิม',[['เวลาที่ B ไม่ว่าง','วันศุกร์']], 'Haben Sie am Freitag Zeit?','วันศุกร์คุณว่างไหม','Am Freitag kann ich leider nicht.','วันศุกร์ฉันไม่สะดวก','verb1:Haben|subject:Sie|time:am Freitag|other:Zeit?','time1:Am Freitag|auxiliary2:kann|subject:ich|other:leider nicht.',30,['Am Freitag habe ich Zeit.','Ja, ich kann am Freitag kommen.']),
model('เปลี่ยนนัด','ตกลงเวลาใหม่',[['เวลาใหม่ที่ตกลง','วันจันทร์หลังเลิกงาน']], 'Können wir den Termin verschieben?','เราเลื่อนนัดได้ไหม','Ja, nach der Arbeit am Montag habe ich Zeit.','ได้ ฉันว่างหลังเลิกงานวันจันทร์','auxiliary1:Können|subject:wir|other:den Termin|inf:verschieben?','other:Ja,|time1:nach der Arbeit am Montag|verb2:habe|subject:ich|other:Zeit.',30,['Am Montag habe ich leider keine Zeit.','Am Dienstag nach der Arbeit habe ich Zeit.']),
]
p17=[
model('แผนอาชีพ','ถามและตอบว่าอยากเป็นอะไร',[['อาชีพที่ B ต้องการ','ครูชาย']], 'Was willst du werden?','เธออยากเป็นอะไร','Ich will Lehrer werden.','ฉันอยากเป็นครู','question1:Was|auxiliary2:willst|subject:du|inf:werden?','subject1:Ich|auxiliary2:will|other:Lehrer|inf:werden.',33,['Ich will Arzt werden.','Ich will Schauspieler werden.']),
model('แผนอาชีพ','ถามแผนการฝึกวิชาชีพ',[['แผนของ B','เริ่มการฝึกวิชาชีพปีหน้า']], 'Wann willst du die Ausbildung machen?','เธออยากเริ่มการฝึกวิชาชีพเมื่อไร','Ich will nächstes Jahr eine Ausbildung machen.','ฉันอยากเริ่มการฝึกวิชาชีพปีหน้า','question1:Wann|auxiliary2:willst|subject:du|other:die Ausbildung|inf:machen?','subject1:Ich|auxiliary2:will|time:nächstes Jahr|other:eine Ausbildung|inf:machen.',34,['Ich will dieses Jahr eine Ausbildung machen.','Ich will keine Ausbildung machen.']),
model('แผนส่วนตัว','บอกสิ่งที่อยากทำในอนาคต',[['แผนของ B','อาศัยอยู่ต่างประเทศ']], 'Was willst du später machen?','ต่อไปเธออยากทำอะไร','Ich will im Ausland leben.','ฉันอยากอาศัยอยู่ต่างประเทศ','question1:Was|auxiliary2:willst|subject:du|time:später|inf:machen?','subject1:Ich|auxiliary2:will|other:im Ausland|inf:leben.',34,['Ich will in meiner Stadt bleiben.','Ich will um die Welt segeln.']),
model('แผนส่วนตัว','เล่าความฝันด้านการเดินทาง',[['ความฝันของ B','ขี่รถจักรยานยนต์']], 'Was möchtest du noch machen?','เธอยังอยากทำอะไรอีก','Ich will Motorrad fahren.','ฉันอยากขี่รถจักรยานยนต์','question1:Was|auxiliary2:möchtest|subject:du|other:noch|inf:machen?','subject1:Ich|auxiliary2:will|other:Motorrad|inf:fahren.',33,['Ich will ein Instrument lernen.','Ich will einen Blog schreiben.']),
model('ระดับความต้องการ','บอกสิ่งที่ตั้งใจอยากทำมาก',[['ความตั้งใจของ B','อยากเป็นแพทย์ชายอย่างแน่วแน่']], 'Was willst du unbedingt machen?','เธออยากทำอะไรมากเป็นพิเศษ','Ich will unbedingt Arzt werden.','ฉันตั้งใจอยากเป็นแพทย์มาก','question1:Was|auxiliary2:willst|subject:du|other:unbedingt|inf:machen?','subject1:Ich|auxiliary2:will|other:unbedingt|other:Arzt|inf:werden.',33,['Ich will auf keinen Fall Arzt werden.','Ich will vielleicht Politiker werden.']),
model('ระดับความต้องการ','บอกสิ่งที่ไม่อยากทำแน่นอน',[['สิ่งที่ B ไม่ต้องการ','เป็นนักการเมือง']], 'Was willst du auf keinen Fall machen?','เธอไม่อยากทำอะไรแน่นอน','Ich will auf keinen Fall Politiker werden.','ฉันไม่อยากเป็นนักการเมืองแน่นอน','question1:Was|auxiliary2:willst|subject:du|other:auf keinen Fall|inf:machen?','subject1:Ich|auxiliary2:will|other:auf keinen Fall|other:Politiker|inf:werden.',33,['Ich will unbedingt Politiker werden.','Ich will vielleicht Schauspieler werden.']),
model('เงื่อนไขของแผน','บอกว่ามากับใคร',[['ผู้ที่ B มาด้วย','เพื่อนผู้ชายหนึ่งคน']], 'Mit wem kommst du?','เธอมากับใคร','Ich komme mit einem Freund.','ฉันมากับเพื่อนผู้ชายคนหนึ่ง','question1:Mit wem|verb2:kommst|subject:du?','subject1:Ich|verb2:komme|other:mit einem Freund.',33,['Ich komme allein.','Ich komme mit meiner Familie.']),
model('เงื่อนไขของแผน','บอกสิ่งที่ขาดไม่ได้',[['เงื่อนไข','ต้องมีเงินจึงเริ่มได้']], 'Könnt ihr ohne Geld anfangen?','พวกเธอเริ่มโดยไม่มีเงินได้ไหม','Nein, ohne Geld können wir nicht anfangen.','ไม่ได้ เราเริ่มโดยไม่มีเงินไม่ได้','auxiliary1:Könnt|subject:ihr|other:ohne Geld|inf:anfangen?','other:Nein,|other1:ohne Geld|auxiliary2:können|subject:wir|other:nicht|inf:anfangen.',32,['Ja, wir können ohne Geld anfangen.','Wir brauchen kein Geld.']),
]
p18=[
model('บอกอาการ','บอกอาการปวดส่วนใด',[['อาการของ B','ปวดหลัง']], 'Was tut Ihnen weh?','คุณเจ็บตรงไหน','Mein Rücken tut weh.','ฉันปวดหลัง','subject1:Was|verb2:tut|other:Ihnen|prefix:weh?','subject1:Mein Rücken|verb2:tut|prefix:weh.',37,['Mein Bauch tut weh.','Mein Kopf tut weh.']),
model('บอกอาการ','แยกอาการที่มีและไม่มี',[['อาการของ B','ไอ แต่ไม่มีไข้']], 'Haben Sie Fieber?','คุณมีไข้ไหม','Nein, ich habe Husten.','ไม่มี ฉันมีอาการไอ','verb1:Haben|subject:Sie|other:Fieber?','other:Nein,|subject1:ich|verb2:habe|other:Husten.',37,['Ja, ich habe Fieber.','Ich habe Ohrenschmerzen.']),
model('ขอให้ช่วยอธิบาย','ถามว่าต้องทำอะไรตามข้อความ',[['ข้อความของผู้ให้คำแนะนำ','บอกให้พักสักครู่']], 'Was soll ich machen?','ฉันควรทำอะไรตามที่บอก','Machen Sie bitte eine Pause.','กรุณาพักสักครู่','question1:Was|auxiliary2:soll|subject:ich|inf:machen?','verb1:Machen|subject:Sie|other:bitte|other:eine Pause.',38,['Kommen Sie bitte morgen.','Sprechen Sie bitte langsam.']),
model('ขอให้ช่วยอธิบาย','ขอให้คู่สนทนาพูดซ้ำ',[['เหตุการณ์','B ยินดีพูดซ้ำ']], 'Können Sie das bitte wiederholen?','กรุณาพูดซ้ำได้ไหม','Ja, natürlich.','ได้ แน่นอน','auxiliary1:Können|subject:Sie|other:das|other:bitte|inf:wiederholen?','other:Ja, natürlich.',37,['Tut mir leid, das geht nicht.','Nein, leider nicht.']),
model('เข้าใจคำขอสุภาพ','ขอให้พูดช้าลง',[['สิ่งที่ B ขอ','ให้ A พูดช้าลง']], 'Spreche ich zu schnell?','ฉันพูดเร็วเกินไปไหม','Sprechen Sie bitte langsam.','กรุณาพูดช้า ๆ','verb1:Spreche|subject:ich|other:zu schnell?','verb1:Sprechen|subject:Sie|other:bitte|other:langsam.',36,['Sprechen Sie bitte lauter.','Sprechen Sie bitte schneller.']),
model('เข้าใจคำขอสุภาพ','ยืนยันเวลาที่ให้มาตามบทสนทนา',[['ข้อความนัดหมาย','ให้มาพรุ่งนี้ 10:00']], 'Soll ich morgen kommen?','ฉันต้องมาพรุ่งนี้ตามที่บอกใช่ไหม','Ja, kommen Sie morgen um zehn Uhr.','ใช่ กรุณามาพรุ่งนี้สิบโมง','auxiliary1:Soll|subject:ich|time:morgen|inf:kommen?','other:Ja,|verb1:kommen|subject:Sie|time:morgen um zehn Uhr.',38,['Kommen Sie bitte heute um zehn Uhr.','Kommen Sie morgen um neun Uhr.']),
model('บอกต่อคำแนะนำ','รายงานสิ่งที่แพทย์ในเรื่องบอก',[['คำบอกของแพทย์ในบทสนทนา','ให้ทำแบบฝึกนี้']], 'Was hat die Ärztin gesagt?','แพทย์หญิงบอกว่าอย่างไร','Ich soll diese Übung machen.','เธอบอกให้ฉันทำแบบฝึกนี้','question1:Was|auxiliary2:hat|subject:die Ärztin|participle:gesagt?','subject1:Ich|auxiliary2:soll|other:diese Übung|inf:machen.',37,['Ich soll morgen kommen.','Ich soll eine Pause machen.']),
model('บอกต่อคำแนะนำ','บอกว่าคำแนะนำมาจากใคร',[['ผู้บอกให้ทำ','แพทย์ชายของ B']], 'Wer sagt das?','ใครเป็นคนบอกอย่างนั้น','Mein Arzt sagt das.','แพทย์ของฉันเป็นคนบอก','subject1:Wer|verb2:sagt|other:das?','subject1:Mein Arzt|verb2:sagt|other:das.',37,['Meine Kollegin sagt das.','Mein Freund sagt das.']),
]

def gm(text,spec,meaning):return dict(text=text,sentences=[parts(spec)],meaning=meaning)
G={
'L15-possessivartikel':dict(title='บอกว่าเป็นของใครด้วย sein / ihr',purpose='ระบุเจ้าของก่อน แล้วเลือกรูปตามคำนามและหน้าที่ในประโยค',notes=['Tom → sein; Klara → ihr: เลือกรากตามเจ้าของ ไม่ใช่เพศของสิ่งของ','Nominativ ชาย/กลางใช้ sein หรือ ihr; หญิง/พหูพจน์ใช้ seine หรือ ihre','Akkusativ เพศชายเปลี่ยนเป็น seinen / ihren; กลาง หญิง และพหูพจน์คงรูปแบบเดียวกับ Nominativ','เมื่อกล่าวถึง Klara เป็นเจ้าของ ใช้ ihr ที่หมายถึงของเธอ; ดูข้อมูลเจ้าของในแต่ละตัวอย่าง'],table=[['เจ้าของ','ชาย Nom.','ชาย Akk.','กลาง','หญิง / พหูพจน์'],['Tom','sein','seinen','sein','seine'],['Klara','ihr','ihren','ihr','ihre']],models=[gm('Das ist sein Balkon.','subject1:Das|verb2:ist|other:sein Balkon.','นี่คือระเบียงของเขา'),gm('Ich finde seinen Balkon schön.','subject1:Ich|verb2:finde|other:seinen Balkon|other:schön.','ฉันคิดว่าระเบียงของเขาสวย'),gm('Ihre Lampe ist neu.','subject1:Ihre Lampe|verb2:ist|other:neu.','โคมไฟของเธอใหม่')]),
'L16-temporale-praepositionen':dict(title='นับเวลาและอ้างอิงเหตุการณ์ด้วย in / vor / nach',purpose='บอกอีกนานเท่าไร ผ่านมาแล้วเท่าไร หรือก่อน/หลังเหตุการณ์',notes=['in + ระยะเวลา: นับจากตอนนี้ไปอนาคต เช่น in einer Stunde','vor + ระยะเวลา: ย้อนจากตอนนี้ เช่น vor einem Tag','vor + เหตุการณ์: ก่อนเหตุการณ์นั้น ไม่ได้แปลว่าอดีตเสมอ เช่น vor dem Termin','nach + เหตุการณ์: หลังเหตุการณ์นั้น เช่น nach der Arbeit','ทั้งสามคำใช้ Dativ ในความหมายเวลาเหล่านี้; เริ่มจากเลือกจุดอ้างอิงเวลา แล้วดูรูปคำนามในกลุ่มคำ'],table=[['จุดอ้างอิง','ข้อมูล','รูปภาษา'],['ตอนนี้ 09:00','มาถึง 10:00','in einer Stunde'],['ตอนนี้วันอังคาร','เกิดเมื่อวันจันทร์','vor einem Tag'],['นัด 10:00','โทร 09:30','vor dem Termin'],['เรียนจบ 12:00','กินข้าว 12:30','nach dem Unterricht']],models=[gm('In einer Stunde komme ich.','time1:In einer Stunde|verb2:komme|subject:ich.','ฉันจะมาในอีกหนึ่งชั่วโมง'),gm('Wir essen nach dem Unterricht.','subject1:Wir|verb2:essen|time:nach dem Unterricht.','พวกเรากินอาหารหลังเลิกเรียน'),gm('Ich komme vor dem Termin.','subject1:Ich|verb2:komme|time:vor dem Termin.','ฉันจะมาก่อนเวลานัด')]),
'L17-werden':dict(title='บอกว่าจะเป็นอะไรด้วย werden',purpose='ใช้ werden เป็นกริยาหลักเพื่อบอกการเปลี่ยนสถานะหรืออาชีพ',notes=['ผัน werden ตามประธาน เช่น ich werde และ sie wird','บอกอาชีพหลัง werden โดยทั่วไปไม่เติม ein/eine เช่น Sie wird Lehrerin','แยกรูปที่ผันแล้ว wird ออกจาก Infinitiv werden ที่ใช้หลัง will'],table=[['ประธาน','รูปกริยา'],['ich','werde'],['du','wirst'],['er / sie / es','wird'],['wir','werden'],['ihr','werdet'],['sie / Sie','werden']],models=[gm('Nina wird Lehrerin.','subject1:Nina|verb2:wird|other:Lehrerin.','Nina จะเป็นครู'),gm('Ich werde Koch.','subject1:Ich|verb2:werde|other:Koch.','ฉันจะเป็นพ่อครัว')]),
'L17-mit-ohne':dict(title='บอกว่ามีหรือไม่มีสิ่งประกอบด้วย mit / ohne',purpose='บอกว่าทำร่วมกับใคร ใช้อะไร หรือขาดสิ่งใด',notes=['mit ใช้ Dativ; ohne ใช้ Akkusativ','ให้ทราบรูป Nominativ ของคำนามก่อนฝึกเปลี่ยน Case เช่น ein Freund → mit einem Freund','อย่าเติม Artikel ลงในวลีที่ใช้แบบไม่มี Artikel เช่น ohne Geld','ใช้ mit เมื่อต้องการบอกว่ามีหรือไปด้วยกับสิ่งนั้น และ ohne เมื่อไม่มีหรือไม่ใช้สิ่งนั้น'],table=[['ชนิดคำนาม','mit + Dativ','ohne + Akkusativ'],['der Freund','dem / einem Freund','den / einen Freund'],['das Geld','dem Geld','das Geld'],['die Freundin','der / einer Freundin','die / eine Freundin'],['die Freunde','den Freunden','die Freunde']],models=[gm('Ich komme mit einem Freund.','subject1:Ich|verb2:komme|other:mit einem Freund.','ฉันมากับเพื่อนผู้ชายคนหนึ่ง'),gm('Ohne Geld können wir nicht anfangen.','other1:Ohne Geld|auxiliary2:können|subject:wir|other:nicht|inf:anfangen.','เราเริ่มโดยไม่มีเงินไม่ได้')]),
'L17-wollen':dict(title='เล่าแผนและความต้องการด้วย wollen',purpose='บอกสิ่งที่ตนอยากทำ โดยแยกระดับความตั้งใจ',notes=['ประโยคบอกเล่า: กริยาช่วยที่ผันแล้วอยู่ตำแหน่ง 2; Infinitiv อยู่ท้ายประโยค','คำถามใช่/ไม่ใช่เริ่มด้วยกริยาช่วย; คำถาม Was / Wann วางกริยาช่วยตามหลังคำถาม','unbedingt / vielleicht / auf keinen Fall สื่อระดับความตั้งใจต่างกัน ต้องมีข้อมูลเจตนาก่อนตรวจ','ใช้ wollen เมื่อเล่าแผนหรือความตั้งใจของตัวเอง'],table=[['ประธาน','รูป wollen'],['ich','will'],['du','willst'],['er / sie / es','will'],['wir','wollen'],['ihr','wollt'],['sie / Sie','wollen']],models=[gm('Ich will Lehrerin werden.','subject1:Ich|auxiliary2:will|other:Lehrerin|inf:werden.','ฉันอยากเป็นครู'),gm('Später will ich im Ausland leben.','time1:Später|auxiliary2:will|subject:ich|other:im Ausland|inf:leben.','ต่อไปฉันอยากอาศัยอยู่ต่างประเทศ')]),
'L18-imperativ-sie':dict(title='เข้าใจและใช้คำขอสุภาพแบบ Sie',purpose='บอกหรือขอให้คู่สนทนาทำบางอย่างอย่างสุภาพ',notes=['วางกริยาขึ้นต้น แล้วตามด้วย Sie; bitte ช่วยให้เป็นคำขอสุภาพ','กริยาแยกส่วน เช่น aufstehen: Stehen Sie bitte auf. ส่วน auf อยู่ท้าย','Sie ในคำขอนี้เป็นรูปสุภาพและเขียนตัว S ใหญ่','อ่านว่าคู่สนทนาต้องการให้ทำอะไร แล้วใช้รูปกริยาสำหรับ Sie'],table=[['Infinitiv','คำขอสุภาพ'],['sprechen','Sprechen Sie bitte langsam.'],['warten','Warten Sie bitte kurz.'],['aufstehen','Stehen Sie bitte auf.']],models=[gm('Sprechen Sie bitte langsam.','verb1:Sprechen|subject:Sie|other:bitte|other:langsam.','กรุณาพูดช้า ๆ'),gm('Stehen Sie bitte auf.','verb1:Stehen|subject:Sie|other:bitte|prefix:auf.','กรุณาลุกขึ้น')]),
'L18-sollen':dict(title='บอกต่อสิ่งที่ผู้อื่นบอกให้ทำด้วย sollen',purpose='รายงานคำบอกหรือคำแนะนำจากผู้พูดในสถานการณ์',notes=['ให้รู้ว่าใครเป็นผู้บอกและบอกอะไร ก่อนให้ตอบว่า ich soll …','ประโยคบอกเล่า: soll / sollen อยู่ตำแหน่ง 2; Infinitiv อยู่ท้าย','เปรียบเทียบ Sie machen … กับ Machen Sie … และ Ich soll … โดยไม่รวมเป็นกฎตำแหน่งเดียว','ตอบตามคำบอกของผู้พูดในสถานการณ์ที่ให้'],table=[['ประธาน','รูป sollen'],['ich','soll'],['du','sollst'],['er / sie / es','soll'],['wir','sollen'],['ihr','sollt'],['sie / Sie','sollen']],models=[gm('Ich soll diese Übung machen.','subject1:Ich|auxiliary2:soll|other:diese Übung|inf:machen.','ฉันได้รับคำบอกให้ทำแบบฝึกนี้'),gm('Soll ich morgen kommen?','auxiliary1:Soll|subject:ich|time:morgen|inf:kommen?','ฉันต้องมาพรุ่งนี้ตามที่บอกใช่ไหม')]),
}

CONFIG={
15:dict(title='บ้าน ห้องพัก และเฟอร์นิเจอร์',purpose='แนะนำที่พัก บอกเจ้าของ แสดงความเห็น และถามข้อมูลห้องพัก',pages=[18,19,20],vocabulary=v15,phrases=p15,grammar=['L15-possessivartikel'],prerequisites=['L02: sein/อาชีพ/ตัวเลข','L05: Möbel/Artikel','L06: Akkusativ','L13: Ich finde/es gibt'],sequence=['รู้จักห้องและส่วนของบ้าน','ทบทวนเฟอร์นิเจอร์และคำบรรยาย','แสดงความเห็นด้วย Ich finde','เลือกเจ้าของ sein/ihr แล้วแยก Nominativ/Akkusativ','อ่านข้อมูลห้องพักและสนทนาตามความต้องการ']),
16:dict(title='อุปกรณ์ ปัญหา และการนัดหมาย',purpose='แจ้งปัญหา ขอหรือเสนอความช่วยเหลือ และจัดการเวลานัด',pages=[28,29,30],vocabulary=v16,phrases=p16,grammar=['L16-temporale-praepositionen'],prerequisites=['L08: วันและเวลา','L11: ลำดับเวลา/อดีต','L14: ขอความช่วยเหลือ/Modalverb/Dativ หลังคำบุพบทสถานที่'],sequence=['รู้จักอุปกรณ์ที่พบในอาคาร','แจ้งว่าเสียหรือใช้งานไม่ได้','ขอและตอบรับความช่วยเหลือ','อ่านเส้นเวลา in/vor/nach ตามจุดอ้างอิง','เสนอ ปฏิเสธ เลื่อน และยืนยันเวลานัดใหม่']),
17:dict(title='แผน ความต้องการ และความฝัน',purpose='บอกว่าอยากเป็นอะไร อยากทำอะไร และมีเงื่อนไขอะไร',pages=[32,33,34],vocabulary=v17,phrases=p17,grammar=['L17-werden','L17-wollen','L17-mit-ohne'],prerequisites=['L02: อาชีพ','L07: กริยากับ Infinitiv','L13–L14: Dativ/คำบุพบทพื้นฐาน','L16: เวลาในอนาคต'],sequence=['รู้จักวลีแผนอาชีพและแผนส่วนตัว','werden เป็นกริยาหลักและรูปผัน','wollen + Infinitiv เพื่อบอกแผน','แยก unbedingt/vielleicht/auf keinen Fall','เพิ่มเงื่อนไข mit + Dativ / ohne + Akkusativ']),
18:dict(title='ร่างกาย อาการ และการเข้าใจคำแนะนำ',purpose='บอกอาการ ขอให้ช่วยอธิบาย และบอกต่อคำแนะนำที่ได้รับ',pages=[36,37,38],vocabulary=v18,phrases=p18,grammar=['L18-imperativ-sie','L18-sollen'],prerequisites=['L01–L02: ich/Sie','L13: mir/Ihnen ใน Dativ','L11: Perfekt ในคำถามกล่าวอ้าง','L17: Modalverb + Infinitiv'],sequence=['รู้จักส่วนต่าง ๆ ของร่างกาย','บอกอาการด้วย tut/tun weh และ Ich habe','ขอให้คู่สนทนาพูดช้าหรือพูดซ้ำ','เข้าใจ Imperativ Sie และกริยาแยกส่วน','บอกต่อข้อความด้วย sollen โดยให้ผู้บอกและเนื้อหาชัดเจน']),
}

# These revisions exist only in the preparation packet; version-2 banks stay unchanged.
FIXES={
'A13-L16-TEMPORALE-PRAEPOSITIONEN-003':dict(context='ตารางระบุ: เรียนจบ 12:00 และเริ่มกินอาหาร 12:30',reason='ข้อความเดิมไม่บอกว่ากินก่อนหรือหลัง จึงใช้ vor หรือ nach ได้ตามสถานการณ์'),
'A13-L17-MIT-OHNE-001':dict(cue='คำนามต้นทาง der Bus; เปลี่ยนรูปเมื่อใช้ mit',reason='ให้เพศและรูปต้นทางไว้ เพื่อแยกการผัน Case ออกจากการจำ Artikel ของคำนาม'),
'A13-L17-MIT-OHNE-002':dict(cue='คำนามต้นทาง ein Schirm; เปลี่ยนรูปเมื่อใช้ ohne',reason='ระบุรูปต้นทางที่ให้ เพื่อวัดการเปลี่ยน ein เป็น einen ใน Akkusativ'),
'A13-L17-MIT-OHNE-003':dict(cue='เปลี่ยนจาก eine Freundin โดยใช้ mit',reason='ต้องระบุคำนำหน้านามต้นทาง เพื่อไม่ปฏิเสธ der/meiner ทั้งที่อาจถูกตามบริบท'),
'A13-L17-MIT-OHNE-004':dict(cue='เปลี่ยนจาก der Hund โดยใช้ ohne',reason='ต้องระบุว่ากำลังฝึกคำนำหน้านามชี้เฉพาะ ไม่ให้เดา den/einen/meinen'),
'A13-L18-IMPERATIV-SIE-003':dict(cue='ใช้กริยา trinken ทำเป็นคำขอสุภาพแบบ Sie',reason='ประโยคเดิมไม่ได้ให้กริยาหรือเจตนา จึงยังมีคำตอบอื่นได้'),
'A13-L18-IMPERATIV-SIE-004':dict(cue='ใช้กริยา machen ทำเป็นคำขอสุภาพแบบ Sie',reason='ระบุคำกริยาที่ต้องผันแทนการเดาคำศัพท์'),
}
SUBSKILLS={'L15-possessivartikel':'possessive_reference_and_inflection','L16-temporale-praepositionen':'temporal_relation','L17-werden':'werden_conjugation','L17-wollen':'wollen_conjugation','L17-mit-ohne':'preposition_case_inflection','L18-imperativ-sie':'formal_imperative_form','L18-sollen':'sollen_conjugation'}
LEMMA={'L17-werden':'werden','L17-wollen':'wollen','L18-sollen':'sollen'}
REVIEWS=[];SOURCES=[];ASSETS=[];BINDINGS=[]
EXISTING={x['id']:x for x in CAT['items']}

def emit(path,data):
 path=OUT/path;tmp=path.with_suffix(path.suffix+'.pending');tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n');tmp.replace(path)
def source_ref(n,page,relationship='topic_basis'):
 if page is None:return None
 return dict(sourceId='MOMENTE_A1_2_KB',pdfPage=page,printedPage=page,evidenceId=f'PREP-KB-{page}',relationship=relationship)
def task_blueprints(item):
 tid=item['id'];noun_item=item['kind']=='noun'
 tasks=[dict(id=tid+'-meaning-v1',targetId=tid,subskill='lexical_chunk_meaning'if item['kind']=='chunk'else'word_meaning',kind='meaning_choice',difficulty=1,difficultyRationale='เลือกระหว่างความหมายที่ต่างกัน โดยเห็นรูปคำเต็ม; ยังไม่ใช่การนึกคำเอง',assistanceAvailable=['supplied-german-form','meaning-options']+(['supplied-artikel']if noun_item else[]),requiredLearnedIds=[tid],public=dict(prompt='เลือกความหมายที่ตรงกับคำหรือวลี',german=item['headword']),grading=dict(answer=item['meaning']),contextId=tid+'-definition')]
 if noun_item:
  tasks.append(dict(id=tid+'-article-v1',targetId=tid,subskill='plural_article'if item['number']=='plural'else'noun_article',kind='article_choice',difficulty=1,difficultyRationale='จำแนกคำนำหน้านามจากรูปคำ; พหูพจน์วัดคำนำหน้าพหูพจน์ ไม่อนุมานเพศเอกพจน์',assistanceAvailable=['article-options','supplied-number']+(['supplied-plural-number']if item['number']=='plural'else[]),requiredLearnedIds=[tid],public=dict(prompt='เลือกคำนำหน้านาม',word=item['word'],number=item['number'],targetColor='neutral',options=['der','die','das']),grading=dict(answer=item['article']),contextId=tid+'-lemma'))
 if item['kind']=='chunk':
  tasks.append(dict(id=tid+'-form-v1',targetId=tid,subskill='lexical_chunk_form',kind='chunk_reconstruction',difficulty=1 if len(item['word'].split())<=2 else 2,difficultyRationale='วลีสองคำมีภาระการจัดลำดับน้อยกว่าวลีหลายคำที่มี Artikel/คำบุพบท; ทั้งสองแบบให้คำไว้ จึงไม่เป็นหลักฐานสะกดเองหรือสร้างประโยคอิสระ',assistanceAvailable=['supplied-words'],requiredLearnedIds=[tid],public=dict(prompt='เรียงวลีตามความหมายที่ให้',meaning=item['meaning'],tokens=list(reversed(item['word'].split()))),grading=dict(answer=item['word'],acceptedVariants=item.get('variants',[])),contextId=tid+'-chunk'))
 else:
  tasks.append(dict(id=tid+'-spelling-v1',targetId=tid,subskill='word_spelling',kind='spelling',difficulty=2,difficultyRationale='นึกรูปคำจากความหมายโดยไม่เห็นคำเยอรมันเต็ม; Artikel ที่ให้ไม่เป็นหลักฐานการจำ Artikel',assistanceAvailable=['german-character-keyboard','optional-first-letter']+(['supplied-artikel']if noun_item else[]),requiredLearnedIds=[tid],public=dict(prompt='พิมพ์คำภาษาเยอรมัน',meaning=item['meaning'],**({'articlePrefix':item['article']}if noun_item else{})),grading=dict(answer=item['word'],normalization='Unicode NFC + trim; retain umlaut/ß; report noun capitalization separately'),contextId=tid+'-recall'))
 for task in tasks:BINDINGS.append({k:task[k]for k in ['id','targetId','subskill','kind','difficulty','difficultyRationale','assistanceAvailable','requiredLearnedIds','contextId']})
 return tasks

# Role labels follow grammatical function, including interrogative subjects.
DETAILS={'sein Balkon.':'ส่วนเติมเต็ม (Nominativ)','sein Sessel.':'ส่วนเติมเต็ม (Nominativ)','seinen Balkon':'กรรม (Akkusativ)','den Garten':'กรรม (Akkusativ)','den Garten?':'กรรม (Akkusativ)','Klaras Lampe?':'กรรม (Akkusativ)','ihre Lampe':'กรรม (Akkusativ)','das Zimmer':'กรรม (Akkusativ)','das Zimmer?':'กรรม (Akkusativ)','einen Balkon.':'กรรม (Akkusativ)','einen Balkon?':'กรรม (Akkusativ)','den Herd':'กรรม (Akkusativ)','Ihre Hilfe.':'กรรม (Akkusativ)','ihr Zimmer.':'ส่วนเติมเต็ม (Nominativ)','seinen Sessel':'กรรม (Akkusativ)','seine Küche':'กรรม (Akkusativ)','Musiker':'อาชีพ (Nominativ)','Ingenieurin.':'อาชีพ (Nominativ)','Eltern.':'สถานะที่เปลี่ยนเป็น (Nominativ)','mit dem Bus.':'วิธีเดินทาง (mit + Dativ)','mit einer Freundin.':'ผู้ร่วมเดินทาง (mit + Dativ)','mit dem Zug.':'วิธีเดินทาง (mit + Dativ)','ohne einen Schirm.':'สิ่งที่ไม่มีไปด้วย (ohne + Akkusativ)','ohne den Hund.':'ผู้ที่ไม่ได้ไปด้วย (ohne + Akkusativ)','nach Hause.':'ทิศทาง','hier':'สถานที่','mehr':'ระดับหรือปริมาณที่เพิ่มขึ้น','mehr Wasser':'กรรม (Akkusativ)','viel Wasser.':'กรรม (Akkusativ)','eine Pause.':'กรรม (Akkusativ)','eine Firma':'กรรม (Akkusativ)','Deutsch':'ภาษาที่เรียน (กรรม)','langsam.':'ลักษณะการพูด','mit Geld.':'สิ่งที่มีไปด้วย (mit + Dativ)','Hilfe?':'กรรม (Akkusativ)','den Termin':'กรรม (Akkusativ)','mit einem Freund.':'ผู้ร่วมเดินทาง (Dativ)','ohne Geld':'เงื่อนไข (ohne + Akkusativ)','Ohne Geld':'เงื่อนไข (ohne + Akkusativ)','Lehrerin':'อาชีพ (Nominativ)','Lehrerin.':'อาชีพ (Nominativ)','Lehrer':'อาชีพ (Nominativ)','Arzt':'อาชีพ (Nominativ)','Koch.':'อาชีพ (Nominativ)','Politiker':'อาชีพ (Nominativ)','diese Übung':'กรรม (Akkusativ)','Ihnen':'ผู้ที่มีอาการ (Dativ)','schön.':'ความเห็น','bitte':'คำแสดงความสุภาพ','im Ausland':'สถานที่','Ja,':'ตอบรับ','Nein,':'ปฏิเสธ','Ja, natürlich.':'ตอบรับอย่างยินดี','auf keinen Fall':'ความไม่ต้องการอย่างแน่นอน','unbedingt':'ความตั้งใจอย่างแน่วแน่','Zeit.':'เวลาที่มี (กรรม)','Zeit?':'เวลาที่มี (กรรม)','Fieber?':'อาการที่ถาม (กรรม)','Husten.':'อาการที่มี (กรรม)'}
for c in CONFIG.values():
 for m in c['phrases']:
  for sentence in m['questionSentences']+m['replySentences']:
   for p in sentence:
    if p['role']=='other':p['label']={k.rstrip('.,?!'):v for k,v in DETAILS.items()}.get(p['text'].rstrip('.,?!'),p['label'])
    if p['role']=='question'and p['text']=='Wann':p.update(role='time',label='ถามเวลา')
for block in G.values():
 for m in block['models']:
  for sentence in m['sentences']:
   for p in sentence:
    if p['role']=='other':p['label']={k.rstrip('.,?!'):v for k,v in DETAILS.items()}.get(p['text'].rstrip('.,?!'),p['label'])
for i,m in enumerate(G['L15-possessivartikel']['models']):m['context']=[['เจ้าของ','Tom'if i<2 else'Klara']]
REASONS={
15:['Arbeitszimmer หมายถึงห้องทำงาน จึงตรงกับห้องที่ระบุในภาพข้อมูล','ข้อมูลบอกว่ามีระเบียง จึงตอบรับด้วย hat einen Balkon','ข้อมูลให้ความเห็นว่าสวย จึงใช้ finde ตามด้วย das Zimmer และ schön','den Garten คือสิ่งที่ชอบ เมื่อนำขึ้นต้น mag ยังอยู่ตำแหน่ง 2','เจ้าของคือ Tom จึงใช้ sein; sein Sessel เป็นส่วนเติมเต็มหลัง ist','เจ้าของคือ Klara จึงใช้ ihr และ Lampe เป็นเพศหญิงจึงใช้ ihre Lampe','frei บอกสถานะว่าง จึงตรงกับข้อมูลห้องที่ยังว่าง','kostet ใช้ถามและบอกราคา ส่วน im Monat ระบุว่าเป็นค่าเช่าต่อเดือน'],
16:['Aufzug คือลิฟต์ และ nicht ปฏิเสธการทำงาน จึงตรงกับอุปกรณ์ที่แจ้งเสีย','Ihre Hilfe ใช้ขอความช่วยเหลือจากคู่สนทนาแบบสุภาพ','ข้อมูลระบุเตาปรุงอาหาร จึงใช้ den Herd เป็นสิ่งที่ขอให้ซ่อม','kann บอกว่าซ่อมได้ และ reparieren อยู่ท้ายประโยคเป็น Infinitiv','กลุ่มวันและเวลาขึ้นต้นเป็นตำแหน่ง 1 ทั้งกลุ่ม จึงวาง habe ที่ตำแหน่ง 2 แล้วตามด้วย ich','จาก 09:00 ไป 10:00 เป็นอีกหนึ่งชั่วโมงในอนาคต จึงใช้ in einer Stunde','kann ich leider nicht ใช้ตอบว่าไม่สะดวกตามบริบทเวลานัด','คำตอบต้องเสนอวันจันทร์หลังเลิกงานให้ตรงข้อมูลเวลาใหม่ที่ให้'],
17:['will ใช้บอกสิ่งที่อยากเป็น และ werden อยู่ท้าย; เมื่อบอกอาชีพ Lehrer ในรูปนี้ไม่เติม ein','nächstes Jahr ระบุปีหน้า ส่วน machen เป็น Infinitiv อยู่ท้ายหลังกรอบ will','im Ausland ระบุสถานที่ที่อยากอยู่ ส่วน leben อยู่ท้ายหลัง will','Motorrad fahren เป็นวลีขี่รถจักรยานยนต์ ตรงกับความฝันในข้อมูล','unbedingt แสดงความตั้งใจอย่างแน่วแน่ จึงตรงกับระดับความต้องการที่ให้','auf keinen Fall สื่อว่าไม่ต้องการอย่างแน่นอน จึงตรงกับข้อมูลปฏิเสธอาชีพนี้','mit ใช้ Dativ และ ein Freund เปลี่ยนเป็น einem Freund','ohne Geld บอกเงื่อนไขไม่มีเงิน เมื่อนำขึ้นต้น können อยู่ตำแหน่ง 2 และ anfangen อยู่ท้าย'],
18:['Rücken เป็นเอกพจน์ จึงใช้ tut และ weh อยู่ท้ายเป็นส่วนของกริยา wehtun','ข้อมูลบอกว่าไม่มีไข้แต่ไอ จึงปฏิเสธ Fieber แล้วบอก Husten','คำบอกในเรื่องให้พัก จึงใช้ Machen Sie เป็นคำขอสุภาพและ eine Pause เป็นสิ่งที่ให้ทำ','wiederholen ใช้ขอให้พูดซ้ำ และ Ja, natürlich ตอบรับตามข้อมูลว่ายินดีทำให้','langsam ขอให้พูดช้าลง ต่างจาก lauter ที่ขอให้ดังขึ้น','เวลาในคำตอบต้องเป็นพรุ่งนี้ 10:00 ตามข้อมูลนัดหมายที่ให้','soll ใช้บอกต่อสิ่งที่แพทย์ในเรื่องบอกให้ทำ ส่วน machen อยู่ท้าย','Wer ถามว่าใครเป็นผู้บอก จึงตอบด้วย Mein Arzt ซึ่งตรงกับผู้บอกในข้อมูล'],
}
for n,c in CONFIG.items():
 for m,reason in zip(c['phrases'],REASONS[n]):m['feedbackReason']=reason
G['L16-temporale-praepositionen']['caseSupportTable']=[['รูปต้นทาง','Dativ ชี้เฉพาะ','Dativ ไม่ชี้เฉพาะ'],['der Termin','dem Termin','einem Termin'],['das Gespräch','dem Gespräch','einem Gespräch'],['die Stunde','der Stunde','einer Stunde'],['die Stunden','den Stunden','ไม่มีรูป ein พหูพจน์']]
for i,w in enumerate(v17):
 if i<5:w['group']='แผนอาชีพ'
 elif i<7:w['group']='ครอบครัว'
 elif i<13:w['group']='การเดินทางและประสบการณ์'
 elif i<16:w['group']='การเรียนรู้และเวลาว่าง'
for i,w in enumerate(v18):
 if i<3:w['group']='ลำตัว'
 elif i<6:w['group']='แขนและมือ'
 elif i in [6,7,8]:w['group']='ขาและเท้า'
 elif i<15:w['group']='ศีรษะและใบหน้า'
 elif i<20:w['group']='อาการปวด'
 elif i<23:w['group']='อาการอื่น'
for n,c in CONFIG.items():
 lid=f'L{n}';lesson=dict(id=lid,title=c['title'],purpose=c['purpose'],prerequisites=c['prerequisites'],sequence=c['sequence'],vocabulary=[],grammar=[],phrases=[],practiceCandidates=[])
 for i,word in enumerate(c['vocabulary'],1):
  tid=word['existingId']if word.get('existingId')else lid+f'-V{i:03}'
  if word.get('existingId'):assert EXISTING[tid]['answer']==word['headword']
  else:assert tid not in EXISTING,tid
  item={k:v for k,v in word.items()if k not in ['sourcePage','existingId','morphologyStatus']};item['id']=tid
  lesson['vocabulary'].append(item);lesson['practiceCandidates']+=task_blueprints(item)
  SOURCES.append(dict(entityId=tid,authorship='adapted',exampleAuthorship='newly_authored',legacyId=word.get('existingId'),legacySourceClaims=EXISTING.get(tid,{}).get('sources',[]),contentSource=source_ref(n,word['sourcePage'],'lexical_topic_basis'),lemmaReview='cached_render_inspected'if word['sourcePage']else'existing_catalog_requires_source_recheck',morphologyReview=word.get('morphologyStatus','not_applicable'),note='ตัวอย่างและคำแปลในชุดเตรียมเขียนใหม่; รูปพหูพจน์ไม่ได้อ้างว่ามีอยู่ใน Bildlexikon'))
  image=EXISTING.get(tid,{}).get('image');verified=bool(image and image.startswith('/') and (R/'public'/image.lstrip('/')).exists())
  ASSETS.append(dict(id=tid+'-visual',targetId=tid,kind='image_or_context_card',brief=f"สื่อความหมาย {item['meaning']} โดยไม่มีคำตอบพิมพ์อยู่ในภาพ",existingCandidate=image,existingFileVerified=verified,status='reuse_file_needs_meaning_review'if verified else'needs_asset_or_code_native_context'))
  ASSETS.append(dict(id=tid+'-audio',targetId=tid,kind='german_lemma_audio',text=item['headword'],status='not_generated'))
  ASSETS.append(dict(id=tid+'-example-audio',targetId=tid,kind='lexical_example_audio',text=item['example'],voice='de-DE-ConradNeural',status='not_generated'))
  for ai,variant in enumerate(item.get('variants',[]),1):ASSETS.append(dict(id=tid+'-variant-'+str(ai)+'-audio',targetId=tid,kind='lexical_variant_audio',text=variant,status='not_generated'))
 bank=json.loads((R/f'docs/exercise-mapping/l{n}-grammar-bank.json').read_text())
 for topic in c['grammar']:
  block=dict(id=topic,**G[topic]);block['questionIds']=[]
  for mi,m in enumerate(block['models'],1):ASSETS.append(dict(id=topic+'-model-'+str(mi)+'-audio',targetId=topic,kind='grammar_model_audio',text=m['text'],voice='de-DE-ConradNeural',status='not_generated'))
  for q in [x for x in bank['questions']if x['topicId']==topic]:
   candidate=json.loads(json.dumps(q));candidate['id']=q['id']+'-PREP3';candidate['version']=3;candidate['supersedes']={'id':q['id'],'version':q['version']}
   candidate['targetId']=topic;candidate['requiredConceptTargets']=[topic];candidate['subskill']='formal_imperative_word_order'if q['kind']=='order' and topic=='L18-imperativ-sie'else'modal_sentence_word_order'if q['kind']=='order' and topic in ['L17-wollen','L18-sollen']else'declarative_word_order'if q['kind']=='order'else SUBSKILLS[topic]
   candidate['assistanceAvailable']=['prior-model']
   if q['kind']=='choice':candidate['assistanceAvailable']+=['options'];candidate['difficultyRationale']='จำแนกรูปหรือความสัมพันธ์จากตัวเลือก โดยบริบทที่ให้จำกัดคำตอบ'
   elif q['kind']=='cloze':
    candidate['difficultyRationale']='เติมรูปที่ต้องใช้เอง โดยมีประธาน/เจ้าของ/รูปต้นทางที่จำเป็น; ไม่ประเมินสิ่งที่ให้เป็นตัวช่วย'
    if topic=='L18-imperativ-sie':candidate['difficulty']=1;candidate['difficultyRationale']='โจทย์ให้ Infinitiv มาแล้วและรูป Sie ใช้รูปเดียวกันที่ต้นประโยค จึงวัดรูปคำขอสุภาพแบบมีตัวช่วย ไม่ใช่การนึกคำศัพท์'
    if topic in LEMMA:candidate['cue']='ผันกริยา '+LEMMA[topic];candidate['assistanceAvailable']+=['supplied-lemma']
   else:
    source_tokens=list(q['tokens']);ending=q['acceptedAnswers'][0][-1];source_tokens[-1]+=ending if ending in '.?!' and not source_tokens[-1].endswith(ending) else '';candidate['tokens']=list(reversed(source_tokens));candidate['difficulty']=1 if len(q['tokens'])<=3 else 2
    candidate['startWith']=q['tokens'][0];candidate['prompt']='เรียงประโยคตามแบบที่เรียน โดยเริ่มด้วย '+q['tokens'][0]
    candidate['assistanceAvailable']+=['supplied-words','provided-start','reconstruct-taught-model']
    candidate['difficultyRationale']='จัดลำดับคำที่ให้ตามแบบที่เรียน; ประโยคสั้นสามคำใช้ระดับ 1 ส่วนโครงสร้างยาวขึ้นใช้ระดับ 2; ไม่เทียบกับการผลิตภาษาอิสระ'
    candidate['feedbackSentence']=candidate.pop('sentence')
   if q['id']in FIXES:
    fix=FIXES[q['id']];candidate.update({k:v for k,v in fix.items()if k!='reason'});candidate['assistanceAvailable']+=['provided-context'if 'context'in fix else'supplied-lemma-or-base-form']
    REVIEWS.append(dict(legacyQuestionId=q['id'],candidateId=candidate['id'],finding=fix['reason'],change={k:v for k,v in fix.items()if k!='reason'},legacyAcceptedAnswers=q['acceptedAnswers'],candidateAcceptedAnswers=candidate['acceptedAnswers']))
   if topic=='L16-temporale-praepositionen':candidate['hint']='in + ระยะเวลา: อีก...; vor + ระยะเวลา: ...ที่แล้ว; vor + เหตุการณ์: ก่อน...; nach + เหตุการณ์: หลัง...'
   block['questionIds'].append(candidate['id']);lesson['practiceCandidates'].append(candidate)
   BINDINGS.append(dict(id=candidate['id'],targetId=topic,subskill=candidate['subskill'],kind=q['kind'],difficulty=candidate['difficulty'],difficultyRationale=candidate['difficultyRationale'],assistanceAvailable=candidate['assistanceAvailable'],requiredConceptTargets=[topic],contextId=q['id']))
   SOURCES.append(dict(entityId=candidate['id'],origin='Existing grammar prototype with explicit preparation-only revision',existingBank=f'docs/exercise-mapping/l{n}-grammar-bank.json',legacyQuestionId=q['id'],legacyVersion=q['version'],provenanceFile=f'docs/exercise-mapping/l{n}-grammar-provenance.json',contentSource=source_ref(n,19 if n==15 else 29 if n==16 else 33 if n==17 else 36 if topic.endswith('imperativ-sie')else 37),note='ไม่แก้ไฟล์ต้นแบบ ไม่ย้ายคำตอบเก่ามาเป็นหลักฐานของฉบับใหม่'))
  lesson['grammar'].append(block)
 utterances={}
 for i,m in enumerate(c['phrases'],1):
  model_item={k:v for k,v in m.items()if k not in ['sourcePage','distractors','feedbackReason']};model_item['id']=lid+f'-D{i:02}';ids=[]
  for speaker,text in [('A',m['question']),('B',m['reply'])]:
   if text not in utterances:
    rid=lid+f'-R{len(utterances)+1:03}';assert rid not in EXISTING,rid;utterances[text]=rid
    SOURCES.append(dict(entityId=rid,contentSource=source_ref(n,m['sourcePage']),authorship='adapted',dialogueContextAuthorship='newly_authored',note='ใช้รูปภาษาตามหัวข้อกับบริบทและคู่สนทนาใหม่ ไม่อ้างว่าเป็นบทสนทนาต้นฉบับทั้งชุด'))
   ids.append(utterances[text])
   ASSETS.append(dict(id=model_item['id']+'-voice-'+speaker,targetId=utterances[text],kind='dialogue_turn',speaker=speaker,text=text,voice='de-DE-KatjaNeural'if speaker=='A'else'de-DE-ConradNeural',status='not_generated'))
  model_item['questionTargetId'],model_item['replyTargetId']=ids
  if n==16 and i==7:model_item['teachingNote']='คำตอบนี้เป็นคำตอบย่อที่เข้าใจได้จากคำถามเรื่องเวลานัด จึงไม่เติมกริยาท้ายที่ไม่ได้พูดในประโยค'
  model_item['requiredItemIds']=ids
  ASSETS.append(dict(id=model_item['id']+'-pair-audio',kind='dialogue_pair',turnIds=[model_item['id']+'-voice-A',model_item['id']+'-voice-B'],status='not_generated'))
  for speaker,target_id,answer,opposite in [('A',ids[0],m['question'],m['reply']),('B',ids[1],m['reply'],m['question'])]:
   choice=speaker=='B'and(i%2==1 or len(answer.split())<=3)
   task=dict(id=model_item['id']+'-'+speaker+'-try-v1',targetId=target_id,subskill='phrase_dialogue_response'if choice else'phrase_word_order',kind='choice'if choice else'order',difficulty=1 if choice or len(answer.split())<=3 else 2,difficultyRationale='เลือกบทตอบให้ตรงข้อมูลในสถานการณ์; ยังไม่ใช่การผลิตประโยคเอง'if choice else'ประกอบคำที่ให้ตามแบบที่เพิ่งเรียนและต้นประโยคที่ระบุ; ยังไม่ใช่การผลิตภาษาอิสระ',assistanceAvailable=['prior-model','provided-context']+(['reply-options']if choice else['supplied-words','provided-start']),requiredItemIds=ids,responseSpeaker=speaker,communicationGoal=m['purpose'],instruction=('เลือกบทตอบที่สื่อข้อมูลตามบัตรและเจตนาที่กำหนด'if choice else'เรียงประโยคตามแบบที่เรียนและคำเริ่มต้นที่ให้'),context=m['context'],prompt=opposite,feedback=dict(question=m['question'],reply=m['reply'],questionMeaning=m['questionMeaning'],replyMeaning=m['replyMeaning'],questionSentences=m['questionSentences'],replySentences=m['replySentences'],reason=m['feedbackReason']),grading=dict(answer=answer),contextId=model_item['id'])
   if choice:task['options']=[m['distractors'][0],answer,m['distractors'][1]]
   else:task['tokens']=list(reversed(answer.split()));task['startWith']=answer.split()[0]
   model_item.setdefault('trialIds',[]).append(task['id']);lesson['practiceCandidates'].append(task)
   BINDINGS.append({k:task[k]for k in ['id','targetId','subskill','kind','difficulty','difficultyRationale','assistanceAvailable','requiredItemIds','contextId']})
  lesson['phrases'].append(model_item)
 lesson['phraseTargets']=[dict(id=rid,text=text)for text,rid in utterances.items()]
 lesson['draftStatus']='prepared_not_wired_or_published'
 emit(f'l{n}-content.json',lesson)

# Add independent diagnostic probes where the old composite score cannot identify the difficulty.
EXTRA={
15:[dict(id='A13-L15-OWNER-PREP-001',targetId='L15-possessivartikel-owner',topicId='L15-possessivartikel',subskill='possessor_reference',context='Klara เป็นเจ้าของห้อง',cue='เลือกว่าของใคร โดยไม่เปลี่ยนรูปท้ายคำ',sentence='Das ist ___ Zimmer.',options=['sein','ihr','unser'],answer='ihr',reason='เจ้าของคือ Klara จึงเลือก ihr; ข้อนี้ไม่ได้วัดการผัน Akkusativ'),dict(id='A13-L15-ENDING-PREP-001',targetId='L15-possessivartikel-ending',topicId='L15-possessivartikel',subskill='possessive_case_ending',context='Tom เป็นเจ้าของเก้าอี้นวม',cue='ให้ราก sein มาแล้ว; คำนามต้นทางคือ der Sessel',sentence='Ich finde ___ Sessel schön.',options=['sein','seinen','seine'],answer='seinen',reason='Sessel เป็นกรรม Akkusativ เพศชาย จึงใช้ seinen; การเลือกรากเจ้าของเป็นตัวช่วยที่ให้มา')],
16:[dict(id='A13-L16-DATIV-PREP-001',targetId='L16-temporale-dative-form',topicId='L16-temporale-praepositionen',subskill='temporal_dative_inflection',context='ต้องการบอกว่ามีเวลาหลังเลิกงาน',cue='คำนามต้นทาง die Arbeit; ให้ nach มาแล้ว',sentence='Nach ___ Arbeit habe ich Zeit.',options=['der','die','das'],answer='der',reason='nach ใช้ Dativ; die Arbeit เปลี่ยนเป็น der Arbeit; ไม่ใช้ข้อนี้สรุปว่าเลือกความสัมพันธ์ของเวลาได้เอง')],
17:[dict(id='A13-L17-MIT-OHNE-MEANING-PREP-001',targetId='L17-mit-ohne-meaning',topicId='L17-mit-ohne',subskill='accompaniment_presence_meaning',context='สถานการณ์สมมติ: Nina นำเงินติดตัวไปเดินทาง',cue='เลือกให้ตรงข้อมูล โดย Geld ในวลีนี้ไม่มี Artikel ให้ใช้เป็นเบาะแส Case',sentence='Nina reist ___ Geld.',options=['mit','ohne'],answer='mit',reason='ข้อมูลบอกว่ามีเงินติดตัว จึงใช้ mit Geld; ไม่ใช้ข้อนี้วัดการผัน Artikel')],
18:[]}

def lexical_example(item):
 text=item['example']
 def result(spec):
  answer=[parts(spec)]
  assert ' '.join(p['text']for row in answer for p in row)==text,text
  for row in answer:
   for p in row:
    if p['role']=='other':p['label']={k.rstrip('.,?!'):v for k,v in DETAILS.items()}.get(p['text'].rstrip('.,?!'),p['label'])
  return answer
 if text.startswith('Das ist '):return result('subject1:Das|verb2:ist|other:'+text[len('Das ist '):])
 if text.startswith('Hier ist '):return result('other1:Hier|verb2:ist|subject:'+text[len('Hier ist '):])
 if text.endswith(' funktioniert nicht.'):
  subject=text[:-len(' funktioniert nicht.')];return result('subject1:'+subject+'|verb2:funktioniert|other:nicht.')
 if text.endswith(' ist kaputt.'):
  subject=text[:-len(' ist kaputt.')];return result('subject1:'+subject+'|verb2:ist|other:kaputt.')
 if text.startswith('Ich will ')or text.startswith('Wir wollen '):
  prefix='Ich will 'if text.startswith('Ich will ')else'Wir wollen '
  content=text[len(prefix):];words=content.split();action=words[-1];rest=' '.join(words[:-1]);role='time'if rest=='drei Monate'else'other'
  return result(('subject1:Ich|auxiliary2:will'if prefix.startswith('Ich')else'subject1:Wir|auxiliary2:wollen')+('|'+role+':'+rest if rest else'')+'|inf:'+action)
 if text.startswith('Ich habe '):
  rest=text[len('Ich habe '):]
  if rest=='hier kein Netz.':return result('subject1:Ich|verb2:habe|other:hier|other:kein Netz.')
  if rest.startswith('am Montag '):return result('subject1:Ich|verb2:habe|time:am Montag|other:'+rest[len('am Montag '):])
  return result('subject1:Ich|verb2:habe|other:'+rest)
 if text.startswith('Der Kurs beginnt '):return result('subject1:Der Kurs|verb2:beginnt|time:'+text[len('Der Kurs beginnt '):])
 explicit={
 'Ich brauche Ihre Hilfe.':'subject1:Ich|verb2:brauche|other:Ihre Hilfe.',
 'Wir haben ein Problem.':'subject1:Wir|verb2:haben|other:ein Problem.',
 'Ich komme in einer Stunde.':'subject1:Ich|verb2:komme|time:in einer Stunde.',
 'Ich kann das reparieren.':'subject1:Ich|auxiliary2:kann|other:das|inf:reparieren.',
 'Können wir den Termin verschieben?':'auxiliary1:Können|subject:wir|other:den Termin|inf:verschieben?',
 'Ich sage den Termin ab.':'subject1:Ich|verb2:sage|other:den Termin|prefix:ab.',
 'Ich möchte einen Termin vorschlagen.':'subject1:Ich|auxiliary2:möchte|other:einen Termin|inf:vorschlagen.',
 'Wir haben einen Plan.':'subject1:Wir|verb2:haben|other:einen Plan.',
 'Der Beruf ist interessant.':'subject1:Der Beruf|verb2:ist|other:interessant.',
 'Wir brauchen Geld.':'subject1:Wir|verb2:brauchen|other:Geld.',
 }
 assert text in explicit,text
 return result(explicit[text])

def example_meaning(item):
 text=item['example'];meaning=item['meaning']
 if text=='Ich habe hier kein Netz.':return 'ตรงนี้ฉันไม่มีสัญญาณโทรศัพท์'
 if text=='Ich habe am Montag einen Termin.':return 'ฉันมีนัดวันจันทร์'
 if text=='Ich habe einen Wunsch.':return 'ฉันมีความปรารถนาอย่างหนึ่ง'
 if text.startswith('Das ist ')or text.startswith('Hier ist '):return 'นี่คือ'+meaning
 if item['kind']=='chunk':return ('พวกเราอยาก'if text.startswith('Wir')else'ฉันอยาก')+meaning
 if text.startswith('Ich habe '):return 'ฉันมี'+meaning
 if item['kind']=='noun'and 'funktioniert nicht.'in text:return ('ไฟไม่ติด'if item['word']=='Licht'else meaning.split('หรือ')[0]+'ใช้งานไม่ได้')
 if item['kind']=='noun'and text.endswith('ist kaputt.'):return ('ระบบทำความร้อนเสีย'if item['word']=='Heizung'else meaning.split('หรือ')[0]+'เสีย')
 exact={
 'Ich habe hier kein Netz.':'ตรงนี้ฉันไม่มีสัญญาณโทรศัพท์','Ich brauche Ihre Hilfe.':'ฉันต้องการความช่วยเหลือจากคุณ','Wir haben ein Problem.':'พวกเรามีปัญหา',
 'Ich habe am Montag einen Termin.':'ฉันมีนัดวันจันทร์','Ich komme in einer Stunde.':'ฉันจะมาในอีกหนึ่งชั่วโมง','Der Kurs beginnt in einem Monat.':'หลักสูตรเริ่มในอีกหนึ่งเดือน','Der Kurs beginnt in einem Jahr.':'หลักสูตรเริ่มในอีกหนึ่งปี',
 'Das Telefon funktioniert nicht.':'โทรศัพท์ใช้งานไม่ได้','Ich kann das reparieren.':'ฉันซ่อมสิ่งนี้ได้','Können wir den Termin verschieben?':'เราเลื่อนนัดได้ไหม','Ich sage den Termin ab.':'ฉันยกเลิกนัด','Ich möchte einen Termin vorschlagen.':'ฉันอยากเสนอเวลานัด',
 'Der Herd ist kaputt.':'เตาปรุงอาหารเสีย','Wir haben einen Plan.':'พวกเรามีแผน','Der Beruf ist interessant.':'อาชีพนี้น่าสนใจ','Wir wollen heiraten.':'พวกเราอยากแต่งงาน','Ich will eine Ausbildung machen.':'ฉันอยากเรียนวิชาชีพ','Wir wollen eine Firma gründen.':'พวกเราอยากก่อตั้งบริษัท','Wir brauchen Geld.':'พวกเราต้องการเงิน','Das ist Hustensaft.':'นี่คือยาแก้ไอชนิดน้ำ',
 }
 assert text in exact,text
 return exact[text]

SUPPORT={
15:[('der Quadratmeter','ตารางเมตร'),('die Miete','ค่าเช่า'),('die Nebenkosten','ค่าใช้จ่ายประกอบค่าเช่า'),('die Möbel','เฟอร์นิเจอร์'),('frei','ว่าง'),('hell','สว่าง'),('dunkel','มืด'),('gemütlich','น่าอยู่หรือให้ความรู้สึกสบาย'),('teuer','แพง'),('billig','ราคาถูก'),('groß','ใหญ่'),('klein','เล็ก')],
16:[('die Zeit','เวลา'),('die Arbeit','งานหรือการทำงาน'),('der Unterricht','การเรียนหรือชั่วโมงเรียน'),('der Kurs','หลักสูตรหรือชั้นเรียน'),('die Woche','สัปดาห์'),('der Tag','วัน'),('die Minute','นาที'),('das Gespräch','การพูดคุย'),('heute','วันนี้'),('morgen','พรุ่งนี้')],
17:[('der Lehrer','ครูผู้ชาย'),('die Lehrerin','ครูผู้หญิง'),('der Arzt','แพทย์ผู้ชาย'),('die Ärztin','แพทย์ผู้หญิง'),('der Freund','เพื่อนผู้ชาย'),('die Freundin','เพื่อนผู้หญิง'),('der Bus','รถโดยสารประจำทาง'),('der Zug','รถไฟ'),('der Hund','สุนัข'),('der Schirm','ร่ม'),('die Eltern','พ่อแม่'),('der Koch','พ่อครัว'),('die Köchin','แม่ครัว'),('der Ingenieur','วิศวกรผู้ชาย'),('die Ingenieurin','วิศวกรผู้หญิง'),('später','ต่อไปหรือภายหลัง'),('unbedingt','อย่างแน่วแน่หรืออยากมาก'),('vielleicht','อาจจะ'),('auf keinen Fall','ไม่ต้องการอย่างแน่นอน')],
18:[('der Arzt','แพทย์ผู้ชาย'),('die Ärztin','แพทย์ผู้หญิง'),('die Übung','แบบฝึกหรือท่าฝึกตามข้อความ'),('die Pause','เวลาพัก'),('die Kollegin','เพื่อนร่วมงานผู้หญิง'),('langsam','ช้า'),('wiederholen','พูดหรือทำซ้ำ'),('wehtun','เจ็บหรือปวด'),('sagen','บอกหรือพูด'),('aufstehen','ลุกขึ้น')],
}
PACKS=[]
for n in CONFIG:
 lesson=json.loads((OUT/f'l{n}-content.json').read_text());vocab=lesson['vocabulary']
 lesson['supportLexicon']=[]
 for hi,(head,meaning)in enumerate(SUPPORT[n],1):
  h=dict(id=f'L{n}-HELP-{hi:02}',headword=head,meaning=meaning,assessmentTarget=False)
  if head.split()[0]in ['der','die','das']:
   article,word=head.split(' ',1);h.update(kind='noun',article=article,word=word,number='plural'if head in ['die Nebenkosten','die Möbel','die Eltern']else'singular')
  else:h.update(kind='support_word_or_phrase',word=head)
  lesson['supportLexicon'].append(h)
  ASSETS.append(dict(id=h['id']+'-audio',targetId=h['id'],kind='support_gloss_audio',text=head,status='not_generated'))
  SOURCES.append(dict(entityId=h['id'],authorship='newly_authored_prerequisite_gloss',note='คำช่วยทำความเข้าใจบริบท ไม่เป็นเป้าหมายที่คิดคะแนนเพิ่มในชุดนี้'))
 for vi,item in enumerate(vocab,1):item['scope']='core_bildlexikon'if (n==15 and vi<=16)or(n==16 and vi<=12)or(n==18 and vi<=15)else('core_bildlexikon_chunk'if item['kind']=='chunk'else'core_bildlexikon_verb')if n==17 and vi<=16 else'retained_catalog_furniture'if n==15 else'communication_or_lesson_support'

 for item in vocab:item['exampleMeaning']=example_meaning(item);item['exampleSentences']=lexical_example(item)
 for task in lesson['practiceCandidates']:
  task.pop('supersedes',None)
  if task.get('kind')=='meaning_choice':
   word=next(v for v in vocab if v['id']==task['targetId']);same=[v['meaning']for v in vocab if v['id']!=word['id']and v['group']==word['group']and v['meaning']!=word['meaning']]
   if word['group']=='สิ่งของในสถานการณ์':same=[]
   pool=list(dict.fromkeys(same+[v['meaning']for v in vocab if v['id']!=word['id']and v['meaning']!=word['meaning']]))
   assert len(pool)>=2;task['public']['options']=[pool[0],word['meaning'],pool[1]]
  if task.get('subskill')=='lexical_chunk_form':task['grading'].pop('acceptedVariants',None);task['grading']['variantPolicy']='ให้ชุดคำและตรวจแยกตามรูปคำที่เลือก; ไม่อนุมานรูปอื่นจากคะแนนรูปหลัก'
 for q in EXTRA[n]:
  task={k:v for k,v in q.items()if k not in ['answer','reason']};task.update(kind='choice',version=1,difficulty=1,difficultyRationale='แยกสาเหตุด้วยโจทย์จำแนกหนึ่งประเด็น โดยให้ข้อมูลส่วนอื่นที่ไม่ต้องการวัด',acceptedAnswers=[q['answer']],explanation=q['reason'],requiredConceptTargets=[q['topicId']],assistanceAvailable=['options','provided-base-or-context'],contextId=q['id'])
  lesson['practiceCandidates'].append(task);block=next(g for g in lesson['grammar']if g['id']==q['topicId']);block.setdefault('diagnosticTargets',[]).append(q['targetId']);block['questionIds'].append(q['id'])
  BINDINGS.append({k:task[k]for k in ['id','targetId','subskill','kind','difficulty','difficultyRationale','assistanceAvailable','requiredConceptTargets','contextId']})
  SOURCES.append(dict(entityId=q['id'],origin='newly_authored_independent_diagnostic_probe',contentSource=source_ref(n,19 if n==15 else 29 if n==16 else 33),note='เพิ่มเพื่อแยกหลักฐาน ไม่แทนผลเก่าของโจทย์รวมหลายมิติ'))
 emit(f'l{n}-content.json',lesson);PACKS.append(lesson)

FB=json.loads((OUT/'grammar-feedback-authoring.json').read_text())
EXTRA_FB={
'A13-L15-OWNER-PREP-001':('Das ist ihr Zimmer.','subject1:Das|verb2:ist|other:ihr Zimmer.','นี่คือห้องของเธอ'),
'A13-L15-ENDING-PREP-001':('Ich finde seinen Sessel schön.','subject1:Ich|verb2:finde|other:seinen Sessel|other:schön.','ฉันคิดว่าเก้าอี้นวมของเขาสวย'),
'A13-L16-DATIV-PREP-001':('Nach der Arbeit habe ich Zeit.','time1:Nach der Arbeit|verb2:habe|subject:ich|other:Zeit.','ฉันว่างหลังเลิกงาน'),
'A13-L17-MIT-OHNE-MEANING-PREP-001':('Nina reist mit Geld.','subject1:Nina|verb2:reist|other:mit Geld.','Nina เดินทางโดยมีเงินติดตัวไปด้วย'),
}
for lesson in PACKS:
 for task in lesson['practiceCandidates']:
  if task['id']in EXTRA_FB:
   text,spec,meaning=EXTRA_FB[task['id']];feedback=gm(text,spec,meaning);feedback['reason']=task['explanation']
  elif task['id'].endswith('-PREP3'):
   index=int(task['id'].split('-PREP3')[0][-3:])-1;text,spec,meaning,reason=FB[task['topicId']][index];feedback=gm(text,spec,meaning);feedback['reason']=reason
  else:continue
  for sentence in feedback['sentences']:
   for p in sentence:
    if p['role']=='other':p['label']={k.rstrip('.,?!'):v for k,v in DETAILS.items()}.get(p['text'].rstrip('.,?!'),p['label'])
  task['feedback']=feedback;task['explanation']=feedback['reason'];task.pop('feedbackSentence',None)
  ASSETS.append(dict(id=task['id']+'-feedback-audio',targetId=task['targetId'],taskId=task['id'],kind='grammar_feedback_audio',text=feedback['text'],voice='de-DE-ConradNeural',status='not_generated'))
 emit(lesson['id'].lower()+'-content.json',lesson)
for n,c in CONFIG.items():
 for page in c['pages']:
  path=R/f'.tools/a13-source-pages/หนังสือเรียน Moment A1 Lektion 13-24-{page}.png'
  assert path.exists(),str(path)
  SOURCES.append(dict(entityId=f'PREP-KB-{page}',sourceId='MOMENTE_A1_2_KB',pdfPage=page,printedPage=page,inspectionMethod='cached_render_visually_inspected',inspectionDate=DATE,cachedRender=str(path.relative_to(R)),renderSha256=hashlib.sha256(path.read_bytes()).hexdigest(),pdfFingerprintStatus='registered_in_source_catalog_not_rechecked_from_original_pdf_this_run'))

CHECKS=[]
for lesson in PACKS:
 targets={x['id']for x in lesson['vocabulary']}|{x['id']for x in lesson['phraseTargets']}|{x['id']for x in lesson['grammar']}|{x for b in lesson['grammar']for x in b.get('diagnosticTargets',[])}
 ids=[t['id']for t in lesson['practiceCandidates']];assert len(ids)==len(set(ids))
 for m in lesson['phrases']:
  assert ' '.join(p['text']for s in m['questionSentences']for p in s)==m['question'],m['id']
  assert ' '.join(p['text']for s in m['replySentences']for p in s)==m['reply'],m['id']
  assert all(x in targets for x in m['requiredItemIds'])
 for g in lesson['grammar']:
  for m in g['models']:assert ' '.join(p['text']for s in m['sentences']for p in s)==m['text']
 for t in lesson['practiceCandidates']:
  assert t['targetId']in targets,(t['id'],t['targetId'])
  assert t['subskill'] and t['difficultyRationale'] and t['assistanceAvailable']
  if 'tokens'in t:
   answer=t.get('grading',{}).get('answer')or t['acceptedAnswers'][0]
   assert sorted(t['tokens'])==sorted(answer.split()),(t['id'],t['tokens'],answer)
  if t['kind']=='choice'and'options'in t:
   answer=t.get('grading',{}).get('answer')or t['acceptedAnswers'][0]
   assert answer in t['options']and len(set(t['options']))==len(t['options']),t['id']
 CHECKS.append(dict(lessonId=lesson['id'],vocabulary=len(lesson['vocabulary']),grammarTopics=len(lesson['grammar']),grammarModels=sum(len(g['models'])for g in lesson['grammar']),dialogues=len(lesson['phrases']),phraseTargets=len(lesson['phraseTargets']),practiceCandidates=len(lesson['practiceCandidates']),sourcePages=CONFIG[int(lesson['id'][1:])]['pages']))

FORBIDDEN={'sources','sourceId','sourcePage','pdfPage','printedPage','provenance','sourceMetadata','legacySourceClaims','supersedes','reviewNote','origin'}
def no_source(data):
 if isinstance(data,dict):
  assert not FORBIDDEN.intersection(data),FORBIDDEN.intersection(data)
  for x in data.values():no_source(x)
 elif isinstance(data,list):
  for x in data:no_source(x)
for lesson in PACKS:no_source(lesson)

manifest=dict(schemaVersion=1,date=DATE,status='content_preparation_only_not_deployed',targetAudience='all_authenticated_learners_after_implementation_and_release_checks',releaseRequirement='Completed lessons must not remain tester-only; unfinished packets stay unpublished',lessons=CHECKS,sourceReview='l15-l18-source-review.json',assessmentBindings='l15-l18-assessment-bindings.json',assets='l15-l18-asset-manifest.json',readiness=dict(inventory='prepared',independentMorphologyReview='pending',audio='scripts_only',visuals='reuse_candidates_and_new_briefs',accountEvidence='designed_not_wired',adaptiveSelection='policy_proposed_not_executed',ui='not_implemented_or_verified_in_this_packet'),existingGrammarBankHashes={f'L{n}':hashlib.sha256((R/f'docs/exercise-mapping/l{n}-grammar-bank.json').read_bytes()).hexdigest()for n in CONFIG},totals={key:sum(x[key]for x in CHECKS)for key in ['vocabulary','grammarTopics','grammarModels','dialogues','phraseTargets','practiceCandidates']})
emit('manifest.json',manifest)
emit('l15-l18-source-review.json',dict(schemaVersion=1,date=DATE,scope='Cached renders, existing catalog and prototype questions; no fresh original PDF hash verification',records=SOURCES,legacyQuestionFindings=REVIEWS,additionalFindings=[dict(id='L17-werden-category',finding='Legacy lesson topics call werden a Konjunktion; this packet correctly treats werden as a verb for becoming',runtimeCatalogChanged=False),dict(id='L15-furniture-source',finding='Four retained furniture lemmas need page-level source recheck; original source claims preserved'),dict(id='morphology-review',finding='Plural forms authored as preparation data; independent dictionary verification is pending'),dict(id='order-answer-presentation',finding='Prepared order tasks keep complete sentences in feedback and scramble supplied tokens; original order banks are not changed')]))
emit('l15-l18-assessment-bindings.json',dict(schemaVersion=1,status='designed_not_connected_to_account_or_selector',responseUnits=BINDINGS,policy=dict(id='l15-l18-prep-policy-v1',status='proposed_not_executed_or_calibrated',resumeFirst=True,independentFirstCorrectBeforeLessSupport=3,minDistinctContexts=2,minDistinctSessions=2,minSpacingHours=24,interpretation='พิจารณาลดตัวช่วยภายใน subskill; ไม่ใช่เกณฑ์รับรองความชำนาญ',rationale='ใช้หลายคำตอบแรกและต่างบริบท/รอบ เพื่อลดการพึ่งการจำโจทย์เดิม; ระยะ 24 ชั่วโมงเป็นค่าเสนอสำหรับทดสอบการนึกคืน ไม่ใช่ผลวิจัยรับรองในระบบนี้',preserveSuccessfulSubskills=True,missingEvidence='unknown',selectionRationaleRequired=True)))
emit('l15-l18-asset-manifest.json',dict(schemaVersion=1,status='requirements_and_scripts_only',defaultLexicalVoice='de-DE-KatjaNeural',defaultExampleVoice='de-DE-ConradNeural',dialoguePauseMs=500,assets=ASSETS,visualBoards=[dict(lessonId='L15',type='original_code_native_floorplan_and_listing_cards',requirement='ทำผังและประกาศที่พักใหม่ ไม่ใช้ภาพหน้าหนังสือเป็นภาพผู้เรียน'),dict(lessonId='L16',type='original_clock_timeline_and_appointment_cards',requirement='แยกแกนตอนนี้กับแกนก่อน/หลังเหตุการณ์ ให้ข้อมูลพอตอบ'),dict(lessonId='L17',type='original_plan_cards',requirement='แยกอาชีพ/แผนส่วนตัวและระดับความตั้งใจ; ไม่ใช้ภาพเดียวแทนความหมายคนละแบบ'),dict(lessonId='L18',type='original_body_diagram_and_speaker_instruction_cards',requirement='ใช้ภาพระบุส่วนร่างกายได้ชัด และให้ข้อความของผู้พูดเป็นข้อมูลสำหรับตอบ')]))

md=['# ชุดเตรียมบทเรียน 15–18: คำศัพท์ ไวยากรณ์ และประโยค','',f'วันที่ {DATE} · สถานะ: เตรียมเนื้อหาและแบบร่าง ยังไม่เชื่อมหน้าเรียน บัญชี หรือระบบเลือกข้อฝึก','',
'ใช้ลำดับ จุดประสงค์ → ตัวอย่าง → คำอธิบายใต้คำ → ลองใช้ → เฉลย ตาม `docs/SENTENCE_ANNOTATION_STANDARD.md` และแยกหลักฐานตาม `docs/ADAPTIVE_LEARNING_STANDARD.md`','',
'| บท | คำ/วลีศัพท์ | หัวข้อไวยากรณ์ | บัตรไวยากรณ์ | บทสนทนา A/B | เป้าหมายบทพูด | หน่วยทดลอง/แบบฝึกร่าง |','| --- | ---: | ---: | ---: | ---: | ---: | ---: |']
for x in CHECKS:md.append('| '+ ' | '.join(str(x[k])for k in ['lessonId','vocabulary','grammarTopics','grammarModels','dialogues','phraseTargets','practiceCandidates'])+' |')
for lesson in PACKS:
 md += ['', '## '+lesson['id']+' · '+lesson['title'],'',lesson['purpose'],'','พื้นฐานที่ใช้: '+'; '.join(lesson['prerequisites']),'','### ลำดับการสอน','']
 md += [f'{i}. {step}'for i,step in enumerate(lesson['sequence'],1)]
 md += ['','### คำศัพท์','', 'คำศัพท์เดิมบท 15 ใช้รหัสเดิม; รายการบท 16–18 เป็นรหัสที่จองในชุดเตรียม ยังไม่ใช่เนื้อหาที่เผยแพร่ วลีใช้รูปตามบริบท และแยกคำนามพร้อม Artikel ไว้ในข้อมูล ไม่เติม Artikel แบบ Nominativ ลงในวลีโดยอัตโนมัติ','', '| ID | คำ/วลี | พหูพจน์/รูปอื่น | ความหมาย | ตัวอย่าง |','| --- | --- | --- | --- | --- |']
 for v in lesson['vocabulary']:md.append('| '+' | '.join([v['id'],v['headword'],v.get('plural')or', '.join(v.get('variants',[]))or'—',v['meaning'],v['example']])+' |')
 md += ['','คำช่วยอ่านบริบท (ไม่คิดคะแนนเป็นคำศัพท์ใหม่): '+ '; '.join(h['headword']+' = '+h['meaning']for h in lesson['supportLexicon']),'','### ไวยากรณ์','']
 for g in lesson['grammar']:
  md += ['#### '+g['title'],'',g['purpose'],'']+['- '+t for t in g['notes']]+['']
  for m in g['models']:md += ['- '+m['text']+' — '+m['meaning']]
 md += ['','### ประโยคและบริบท A/B','']
 for m in lesson['phrases']:
  md += ['#### '+m['id']+' · '+m['purpose'],'','ข้อมูลก่อนพูด: '+'; '.join(k+': '+v for k,v in m['context']),'', '**A:** '+m['question'],'',m['questionMeaning'],'','**B:** '+m['reply'],'',m['replyMeaning'],'', 'เป้าหมาย: '+m['questionTargetId']+' / '+m['replyTargetId']+' · มีข้อทดลองแยกคำถาม A และบทตอบ B; เลือกใช้ตาม subskill ไม่บังคับให้ทุกคนผ่านลำดับรูปแบบเดียวกัน','']
md += ['## ขอบเขตและสิ่งที่ต้องทำก่อนเปิดใช้','',
'- ไฟล์ `l15-content.json` ถึง `l18-content.json` มีคำแปล ตัวอย่าง โครงสร้างใต้คำ และหน่วยคำตอบ แต่ยังไม่มี renderer หรือกิจกรรมที่เปิดในเว็บจากไฟล์เหล่านี้',
'- ไวยากรณ์เดิม 35 ข้อเก็บรหัส/คำตอบเดิมในไฟล์ต้นแบบ ฉบับเตรียมมีรหัส PREP3 แยกและเพิ่มโจทย์วินิจฉัย 4 ข้อ ไม่ย้ายคะแนนเก่ามาเป็นหลักฐานใหม่',
'- ตรวจรูปพหูพจน์กับพจนานุกรมอีกครั้ง และตรวจต้นทางของคำเฟอร์นิเจอร์เดิม 4 คำก่อนเผยแพร่; ขอบเขตการตรวจแหล่งอยู่ใน `l15-l18-source-review.json`',
'- เสียงรายคำ รายบัตรไวยากรณ์ และ A/B ยังเป็นสคริปต์สำหรับสร้างไฟล์; ภาพใหม่และภาพสถานการณ์ยังต้องจัดทำ/ตรวจความหมายตาม asset manifest',
'- คำแปลเต็มและโครงสร้างเฉลยใช้หลังตรวจเท่านั้น; โจทย์ Artikel ซ่อนทั้ง Artikel และสี ส่วนสะกดให้ Artikel โดยไม่คิดเป็นคะแนนจำ Artikel',
'- งานที่สร้างเสร็จต้องเปิดได้กับบัญชีผู้ใช้ทั่วไปด้วย ไม่ถือว่าพร้อมใช้งานหากยังจำกัด tester; ต้องตรวจสิทธิ์และฐานข้อมูลจริงก่อนเปิด ไม่ใช้ bypass สิ่งที่ยังไม่ได้เรียน',
'- ต้องเชื่อม exposure, หน่วยคำตอบ, คำตอบแรก/ตัวช่วย/ร่าง/จุดค้าง, สถานะราย subskill, selector, recommendation และ server eligibility ตามแผนก่อนเปิดให้ผู้เรียน',
'- ต้องตรวจ layout ที่ 375/390/1360px และฟังเสียงจริงหลังมี renderer; การมี metadata อธิบายใต้คำยังไม่ใช่การยืนยันว่า UI ผ่าน',
'- อ้างอิงและหน้าหนังสือเก็บในไฟล์ตรวจแหล่งแยก ไม่ส่งไปแสดงในข้อความของผู้เรียน','']
(OUT/'L15_L18_CONTENT_PLAN.md').write_text('\n'.join(md))
print(json.dumps(manifest['totals'],ensure_ascii=False))
