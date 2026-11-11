# -*- coding: utf-8 -*-
"""Authored contextual phrase practice; run with --source-root for original target inventory."""
import argparse,json,re
from pathlib import Path
parser=argparse.ArgumentParser();parser.add_argument('--source-root',type=Path,required=True);args=parser.parse_args()
root=Path(__file__).resolve().parents[2];source=args.source_root
base=json.loads((source/'docs/exercise-mapping/a11-phrase-bank.json').read_text())
targets={t['id']:t for l in base['lessons'] for t in l['targets']}
# Each objective has five distinct situations, in teaching order: transfer, transfer,
# scaffolded response, scaffolded response, and response from supplied lemmas/data.
# The setting is authored content, not a quotation from the source material.
OBJECTIVES=[]
def objective(lesson,target,title,rows,parts,lemma,reason,topic=None,prior='phrase_comprehension'):
 OBJECTIVES.append(dict(lesson=lesson,target=target,title=title,rows=rows,parts=parts,lemma=lemma,reason=reason,topic=topic or lesson+'-phrases-core',prior=prior))
def row(context,question,answer,meaning,wrong,why):
 return dict(context=context,question=question,answer=answer,meaning=meaning,wrong=wrong,why=why)
# L11 first: auxiliary + Partizip II, with answers constrained to the stated facts.
objective('L11','L11-P002','เล่าว่าทำงานแล้ว',[
 row('A คือเพื่อนร่วมชั้น B คือคุณ เมื่อวานคุณทำงาน ไม่ได้ทำอาหาร','Was hast du gestern gemacht?','Ich habe gearbeitet.','ฉันทำงานแล้ว','Ich habe gekocht.','gekocht คือทำอาหาร แต่ข้อมูลระบุว่าทำงาน'),
 row('A คือเพื่อน B คือคุณ วันนี้ตอนเช้าคุณทำงาน ไม่ได้อ่านหนังสือ','Was hast du heute Morgen gemacht?','Heute Morgen habe ich gearbeitet.','วันนี้ตอนเช้าฉันทำงานแล้ว','Heute Morgen habe ich gelesen.','gelesen คืออ่าน แต่กิจกรรมในข้อมูลคือทำงาน'),
 row('A คือเพื่อนร่วมงาน B คือคุณ คุณทำงานเมื่อวันจันทร์ ให้ขึ้นต้นด้วย Ich','Was hast du am Montag gemacht?','Ich habe am Montag gearbeitet.','ฉันทำงานเมื่อวันจันทร์แล้ว',None,None),
 row('A คือเพื่อน B คือคุณ คุณทำงานเมื่อวาน ให้ขึ้นต้นด้วย Gestern','Was hast du gestern gemacht?','Gestern habe ich gearbeitet.','เมื่อวานฉันทำงานแล้ว',None,None),
 row('A คือเพื่อน B คือคุณ คุณทำงานตอนเย็น ให้ขึ้นต้นด้วย Am Abend','Was hast du am Abend gemacht?','Am Abend habe ich gearbeitet.','ตอนเย็นฉันทำงานแล้ว',None,None)],
 'perfekt','ich / haben / arbeiten; heute Morgen = วันนี้ตอนเช้า; am Montag = เมื่อวันจันทร์; gestern = เมื่อวาน; am Abend = ตอนเย็น','ใช้ habe เป็นกริยาที่ผันตาม ich และ gearbeitet อยู่ท้ายประโยค เมื่อเริ่มด้วยเวลา habe ยังอยู่ตำแหน่งที่ 2')
objective('L11','L11-P003','เล่าการฟังเพลง',[
 row('A คือเพื่อน B คือคุณ เมื่อคืนคุณฟังเพลง ไม่ได้ดูโทรทัศน์','Was hast du gestern Abend gemacht?','Ich habe Musik gehört.','ฉันฟังเพลงแล้ว','Ich habe ferngesehen.','ferngesehen คือดูโทรทัศน์ ไม่ตรงกับกิจกรรมฟังเพลง'),
 row('A คือเพื่อนร่วมชั้น B คือคุณ วันอาทิตย์คุณฟังเพลง ไม่ได้ทำงาน','Was hast du am Sonntag gemacht?','Am Sonntag habe ich Musik gehört.','วันอาทิตย์ฉันฟังเพลงแล้ว','Am Sonntag habe ich gearbeitet.','gearbeitet คือทำงาน แต่ข้อมูลระบุว่าฟังเพลง'),
 row('A คือเพื่อน B คือคุณ เมื่อวานคุณฟังเพลง ให้ขึ้นต้นด้วย Ich','Was hast du gestern gemacht?','Ich habe gestern Musik gehört.','เมื่อวานฉันฟังเพลงแล้ว',None,None),
 row('A คือเพื่อนร่วมบ้าน B คือคุณ ตอนเย็นคุณฟังเพลง ให้ขึ้นต้นด้วย Am Abend','Was hast du am Abend gemacht?','Am Abend habe ich Musik gehört.','ตอนเย็นฉันฟังเพลงแล้ว',None,None),
 row('A คือเพื่อน B คือคุณ วันนี้คุณฟังเพลงแล้ว ให้ขึ้นต้นด้วย Heute','Was hast du heute gemacht?','Heute habe ich Musik gehört.','วันนี้ฉันฟังเพลงแล้ว',None,None)],
 'perfekt','ich / haben / Musik hören; am Sonntag = วันอาทิตย์; gestern = เมื่อวาน; am Abend = ตอนเย็น; heute = วันนี้','habe ผันตาม ich ส่วน gehört เป็น Partizip II ท้ายประโยค และ Musik อยู่กับกิจกรรม hören')
objective('L12','L12-P003','เล่าการเดินทางด้วย sein',[
 row('A คือเพื่อน B คือคุณกับครอบครัว คุณเดินทางด้วยรถไฟ ไม่ใช่รถบัส','Wie seid ihr gefahren?','Wir sind mit dem Zug gefahren.','พวกเราเดินทางด้วยรถไฟแล้ว','Wir sind mit dem Bus gefahren.','Bus คือรถบัส แต่ข้อมูลระบุว่าเดินทางด้วยรถไฟ'),
 row('A คือเพื่อน B คือคุณคนเดียว คุณเดินทางด้วยรถไฟ ไม่ใช่เครื่องบิน','Wie bist du gefahren?','Ich bin mit dem Zug gefahren.','ฉันเดินทางด้วยรถไฟแล้ว','Ich bin mit dem Flugzeug gefahren.','Flugzeug คือเครื่องบิน ไม่ตรงกับรถไฟในข้อมูล'),
 row('A คือเพื่อน B คือคุณคนเดียว เมื่อวานคุณเดินทางด้วยรถไฟ ให้ขึ้นต้น Ich','Wie bist du gestern gefahren?','Ich bin gestern mit dem Zug gefahren.','เมื่อวานฉันเดินทางด้วยรถไฟแล้ว',None,None),
 row('A คือเพื่อน B คือคุณกับเพื่อน วันจันทร์พวกคุณเดินทางด้วยรถไฟ ให้ขึ้นต้น Wir','Wie seid ihr am Montag gefahren?','Wir sind am Montag mit dem Zug gefahren.','พวกเราเดินทางด้วยรถไฟเมื่อวันจันทร์แล้ว',None,None),
 row('A คือเพื่อน B คือคุณคนเดียว วันนี้คุณเดินทางด้วยรถไฟแล้ว ให้ขึ้นต้น Heute','Wie bist du heute gefahren?','Heute bin ich mit dem Zug gefahren.','วันนี้ฉันเดินทางด้วยรถไฟแล้ว',None,None)],
 'sein-perfekt','ich / wir / sein / fahren / mit dem Zug; gestern = เมื่อวาน; am Montag = วันจันทร์; heute = วันนี้','การเดินทางนี้ใช้ sein: ich bin หรือ wir sind และ gefahren เป็น Partizip II ท้ายประโยค')
objective('L12','L12-P005','เล่าว่ากลับมาเมื่อไร',[
 row('A คือเพื่อน B คือคุณ คุณกลับมาวันจันทร์ ไม่ใช่วันอังคาร','Wann bist du zurückgekommen?','Ich bin am Montag zurückgekommen.','ฉันกลับมาเมื่อวันจันทร์แล้ว','Ich bin am Dienstag zurückgekommen.','Dienstag คือวันอังคาร แต่ข้อมูลระบุวันจันทร์'),
 row('A คือเพื่อนร่วมงาน B คือคุณ คุณกลับมาวันศุกร์ ไม่ใช่วันอาทิตย์','Wann bist du zurückgekommen?','Ich bin am Freitag zurückgekommen.','ฉันกลับมาเมื่อวันศุกร์แล้ว','Ich bin am Sonntag zurückgekommen.','Sonntag คือวันอาทิตย์ ไม่ตรงกับวันศุกร์ในข้อมูล'),
 row('A คือเพื่อน B คือคุณ คุณกลับมาเมื่อวาน ให้ขึ้นต้น Ich','Wann bist du zurückgekommen?','Ich bin gestern zurückgekommen.','ฉันกลับมาเมื่อวานแล้ว',None,None),
 row('A คือเพื่อนบ้าน B คือคุณ คุณกลับมาวันเสาร์ ให้ขึ้นต้น Am Samstag','Wann bist du zurückgekommen?','Am Samstag bin ich zurückgekommen.','วันเสาร์ฉันกลับมาแล้ว',None,None),
 row('A คือเพื่อน B คือคุณ คุณกลับมาเมื่อวันอาทิตย์ ให้ขึ้นต้น Am Sonntag','Wann bist du zurückgekommen?','Am Sonntag bin ich zurückgekommen.','วันอาทิตย์ฉันกลับมาแล้ว',None,None)],
 'sein-perfekt','ich / sein / zurückkommen; am Montag = วันจันทร์; am Freitag = วันศุกร์; gestern = เมื่อวาน; am Samstag = วันเสาร์; am Sonntag = วันอาทิตย์','zurückkommen ใช้ bin กับ ich ใน Perfekt และรวมเป็น zurückgekommen ที่ท้ายประโยค')
# L13: select genuinely taught phrase targets, using their existing context subskill.
objective('L13','L13-R001','บอกว่าชอบเมือง',[
 row('A เป็นเจ้าบ้าน B คือคุณ ผู้มาเยือน คุณชอบเบอร์ลิน','Gefällt Ihnen Berlin?','Berlin gefällt mir.','ฉันชอบเบอร์ลิน','Berlin gefällt mir nicht.','nicht ปฏิเสธความชอบ แต่ข้อมูลระบุว่าคุณชอบเมืองนี้'),
 row('A คือเพื่อน B คือคุณ คุณชอบฮัมบวร์ก','Gefällt dir Hamburg?','Hamburg gefällt mir.','ฉันชอบฮัมบวร์ก','Hamburg gefällt mir nicht.','ข้อมูลระบุความชอบ ไม่ใช่การปฏิเสธด้วย nicht'),
 row('A คือเพื่อน B คือคุณ คุณชอบเมืองบอนน์ ให้ขึ้นต้น Bonn','Gefällt dir Bonn?','Bonn gefällt mir.','ฉันชอบบอนน์',None,None),
 row('A คือเพื่อนร่วมชั้น B คือคุณ คุณชอบเมืองเคิล์น ให้ขึ้นต้น Köln','Gefällt dir Köln?','Köln gefällt mir.','ฉันชอบเคิล์น',None,None),
 row('A คือเพื่อน B คือคุณ คุณชอบเมืองไลพ์ซิก ให้ขึ้นต้น Leipzig','Gefällt dir Leipzig?','Leipzig gefällt mir.','ฉันชอบไลพ์ซิก',None,None)],
 'gefallen','เมือง + gefallen + mir; Bonn/Köln/Leipzig เป็นชื่อเมือง','ชื่อเมืองเป็นประธานจึงใช้ gefällt ส่วน mir บอกผู้ที่ชอบเมืองนั้น',topic='L13-phrases-rating',prior='phrase_context')
objective('L13','L13-R011','บอกว่ามีสถานที่อะไร',[
 row('A เป็นผู้มาเยือน B คือคุณ เจ้าถิ่น ข้อมูลเมืองระบุว่าที่นี่มีสวนสาธารณะ ไม่มีท่าเรือ','Was gibt es hier?','Hier gibt es einen Park.','ที่นี่มีสวนสาธารณะหนึ่งแห่ง','Hier gibt es einen Hafen.','Hafen คือท่าเรือ ซึ่งข้อมูลระบุว่าไม่มี'),
 row('A เป็นนักท่องเที่ยว B คือคุณ ข้อมูลย่านระบุว่าที่นี่มีสวนสาธารณะ ไม่มีทะเลสาบ','Was gibt es hier?','Hier gibt es einen Park.','ที่นี่มีสวนสาธารณะหนึ่งแห่ง','Hier gibt es einen See.','See คือทะเลสาบ ไม่ตรงกับข้อมูลสวนสาธารณะ'),
 row('A คือเพื่อน B คือคุณ ข้อมูลที่พักระบุว่าที่นี่มีสวนสาธารณะ ให้ขึ้นต้น Hier','Was gibt es hier?','Hier gibt es einen Park.','ที่นี่มีสวนสาธารณะหนึ่งแห่ง',None,None),
 row('A เป็นผู้มาเยือน B คือคุณ ข้อมูลอีกย่านระบุว่าที่นี่มีคาเฟ่ ให้ขึ้นต้น Hier','Was gibt es hier?','Hier gibt es ein Café.','ที่นี่มีคาเฟ่หนึ่งแห่ง',None,None),
 row('A คือเพื่อน B คือคุณ ข้อมูลที่พักใหม่ระบุว่าที่นี่มีทะเลสาบ ให้ขึ้นต้น Hier','Was gibt es hier?','Hier gibt es einen See.','ที่นี่มีทะเลสาบหนึ่งแห่ง',None,None)],
 'es-gibt','Hier / geben / es; der Park = สวนสาธารณะ; das Café = คาเฟ่; der See = ทะเลสาบ','gibt อยู่ตำแหน่งที่ 2 ส่วนสิ่งที่มีตาม es gibt ใช้ Akkusativ: einen Park/einen See หรือ ein Café',topic='L13-phrases-city',prior='phrase_context')
# Early lessons: small, constrained changes within structures already taught.
def varied(lesson,target,title,question,answers,meanings,settings,wrong,why,parts,lemma,reason):
 rows=[row('A '+setting+' B คือคุณ '+data,question,a,m,wrong[i] if i<2 else None,why if i<2 else None) for i,(a,m,(setting,data)) in enumerate(zip(answers,meanings,settings))]
 objective(lesson,target,title,rows,parts,lemma,reason)
varied('L01','phrases-L01-7','แนะนำชื่อตนเอง','Wie heißt du?',
 ['Ich heiße Mia.','Ich heiße Tom.','Ich heiße Lea.','Ich heiße Ben.','Ich heiße Eva.'],
 ['ฉันชื่อมีอา','ฉันชื่อทอม','ฉันชื่อเลอา','ฉันชื่อเบน','ฉันชื่อเอวา'],
 [('คือเพื่อนใหม่ในห้องเรียน','ใช้ชื่อสมมติ Mia'),('คือเพื่อนในงานเลี้ยง','ใช้ชื่อสมมติ Tom'),('คือเพื่อนในชมรม','ใช้ชื่อสมมติ Lea ให้ขึ้นต้น Ich'),('คือเพื่อนร่วมกลุ่ม','ใช้ชื่อสมมติ Ben ให้ขึ้นต้น Ich'),('คือเพื่อนในชั้นใหม่','ใช้ชื่อสมมติ Eva ให้ขึ้นต้น Ich')],
 ['Ich heiße Tom.','Ich heiße Mia.'],'ชื่อในคำตอบไม่ตรงกับชื่อสมมติที่ข้อมูลกำหนด','present','ich / heißen; Mia, Tom, Lea, Ben, Eva คือชื่อคน','Ich เป็นประธาน ใช้ heißen รูป heiße และตามด้วยชื่อของผู้พูด')
varied('L01','phrases-L01-8','บอกประเทศที่มา','Woher kommst du?',
 ['Ich komme aus Thailand.','Ich komme aus Deutschland.','Ich komme aus Japan.','Ich komme aus China.','Ich komme aus Österreich.'],
 ['ฉันมาจากประเทศไทย','ฉันมาจากประเทศเยอรมนี','ฉันมาจากประเทศญี่ปุ่น','ฉันมาจากประเทศจีน','ฉันมาจากประเทศออสเตรีย'],
 [('คือเพื่อนในชั้นภาษา','คุณมาจากประเทศไทย'),('คือเพื่อนใหม่ในชมรม','คุณมาจากเยอรมนี'),('คือเพื่อนที่หอพัก','คุณมาจากญี่ปุ่น ให้ขึ้นต้น Ich'),('คือเพื่อนร่วมกลุ่ม','คุณมาจากจีน ให้ขึ้นต้น Ich'),('คือเพื่อนในชั้นใหม่','คุณมาจากออสเตรีย ให้ขึ้นต้น Ich')],
 ['Ich komme aus Deutschland.','Ich komme aus Thailand.'],'ประเทศในคำตอบไม่ตรงกับข้อมูลของผู้พูด','present','ich / kommen / aus; Thailand = ไทย; Deutschland = เยอรมนี; Japan = ญี่ปุ่น; China = จีน; Österreich = ออสเตรีย','komme ผันตาม ich ส่วน aus ใช้บอกประเทศที่มาในตัวอย่างนี้')
varied('L02','L02-pattern-phone','ถามหมายเลขโทรศัพท์','B: ___',
 ['Wie ist deine Handynummer?','Wie ist deine Handynummer?','Wie ist deine Handynummer?','Wie ist deine Handynummer?','Wie ist deine Handynummer?'],
 ['เบอร์มือถือของเธอคืออะไร']*5,
 [('คือเพื่อนชื่อ Mia','คุณต้องการถามเบอร์มือถือของ Mia โดยใช้ du'),('คือเพื่อนชื่อ Ben','คุณต้องการถามเบอร์มือถือของ Ben โดยใช้ du'),('คือเพื่อนในกลุ่มงาน','คุณต้องการขอเบอร์มือถือของเพื่อนโดยใช้ du ให้ขึ้นต้น Wie'),('คือเพื่อนในชมรมกีฬา','คุณต้องการขอเบอร์มือถือของเพื่อนโดยใช้ du ให้ขึ้นต้น Wie'),('คือเพื่อนร่วมชั้นคนใหม่','คุณต้องการขอเบอร์มือถือของเพื่อนโดยใช้ du ให้ขึ้นต้น Wie')],
 ['Was bist du von Beruf?','Wie heißt du?'],'ประโยคนี้ถามอาชีพหรือชื่อ ไม่ได้ขอหมายเลขมือถือ','question','wie / sein / deine Handynummer; die Handynummer = หมายเลขมือถือ','Wie ถามข้อมูล และ ist อยู่ตำแหน่งที่ 2 ส่วน deine Handynummer ระบุข้อมูลที่ต้องการ')
varied('L02','L02-pattern-profession','ถามอาชีพ','B: ___',
 ['Was bist du von Beruf?']*5,['เธอประกอบอาชีพอะไร']*5,
 [('คือเพื่อนใหม่ในชั้น','คุณต้องการถามอาชีพของเขาโดยใช้ du'),('คือเพื่อนในงานเลี้ยง','คุณต้องการรู้ว่าเขาทำอาชีพอะไร โดยใช้ du'),('คือเพื่อนในชมรม','คุณต้องการถามอาชีพโดยใช้ du ให้ขึ้นต้น Was'),('คือเพื่อนร่วมกลุ่มภาษา','คุณต้องการถามอาชีพโดยใช้ du ให้ขึ้นต้น Was'),('คือเพื่อนบ้านวัยเดียวกัน','คุณต้องการถามอาชีพโดยใช้ du ให้ขึ้นต้น Was')],
 ['Wie ist deine Handynummer?','Woher kommst du?'],'ประโยคนี้ถามเบอร์มือถือหรือประเทศที่มา ไม่ใช่อาชีพ','question','was / sein / du / von Beruf; der Beruf = อาชีพ','Was ถามอาชีพ ใช้ bist ผันตาม du และคงกลุ่มคำ von Beruf')
varied('L03','L03-P004','บอกชื่อพี่หรือน้องสาว','Wie heißt deine Schwester?',
 ['Meine Schwester heißt Mia.','Meine Schwester heißt Lea.','Meine Schwester heißt Eva.','Meine Schwester heißt Anna.','Meine Schwester heißt Nina.'],
 ['พี่หรือน้องสาวของฉันชื่อมีอา','พี่หรือน้องสาวของฉันชื่อเลอา','พี่หรือน้องสาวของฉันชื่อเอวา','พี่หรือน้องสาวของฉันชื่ออันนา','พี่หรือน้องสาวของฉันชื่อนีนา'],
 [('คือเพื่อนที่ดูรูปครอบครัว','พี่หรือน้องสาวของคุณชื่อ Mia'),('คือเพื่อนร่วมชั้น','พี่หรือน้องสาวของคุณชื่อ Lea'),('คือเพื่อนบ้าน','พี่หรือน้องสาวของคุณชื่อ Eva ให้ขึ้นต้น Meine'),('คือเพื่อนในงานเลี้ยง','พี่หรือน้องสาวของคุณชื่อ Anna ให้ขึ้นต้น Meine'),('คือเพื่อนร่วมกลุ่ม','พี่หรือน้องสาวของคุณชื่อ Nina ให้ขึ้นต้น Meine')],
 ['Meine Schwester heißt Lea.','Meine Schwester heißt Mia.'],'ชื่อของพี่หรือน้องสาวไม่ตรงกับข้อมูล','present','meine Schwester / heißen; die Schwester = พี่หรือน้องสาว; Mia, Lea, Eva, Anna, Nina คือชื่อคน','Meine Schwester เป็นประธานเอกพจน์ ใช้ heißt แล้วตามด้วยชื่อ')
varied('L03','L03-P008','บอกภาษาที่พูดได้','Welche Sprachen sprichst du?',
 ['Ich spreche Thai und Deutsch.','Ich spreche Englisch und Deutsch.','Ich spreche Thai und Englisch.','Ich spreche Deutsch und Thai.','Ich spreche Englisch und Thai.'],
 ['ฉันพูดภาษาไทยและเยอรมัน','ฉันพูดภาษาอังกฤษและเยอรมัน','ฉันพูดภาษาไทยและอังกฤษ','ฉันพูดภาษาเยอรมันและไทย','ฉันพูดภาษาอังกฤษและไทย'],
 [('คือเพื่อนร่วมชั้น','คุณพูดไทยและเยอรมัน ให้เรียงตามลำดับนี้'),('คือเพื่อนในชมรม','คุณพูดอังกฤษและเยอรมัน ให้เรียงตามลำดับนี้'),('คือเพื่อนที่หอพัก','คุณพูดไทยและอังกฤษ ให้เรียงตามลำดับนี้และขึ้นต้น Ich'),('คือเพื่อนใหม่','คุณพูดเยอรมันและไทย ให้เรียงตามลำดับนี้และขึ้นต้น Ich'),('คือเพื่อนในกลุ่มงาน','คุณพูดอังกฤษและไทย ให้เรียงตามลำดับนี้และขึ้นต้น Ich')],
 ['Ich spreche Englisch und Deutsch.','Ich spreche Thai und Deutsch.'],'ภาษาที่ระบุไม่ตรงกับคู่ภาษาในข้อมูล','present','ich / sprechen / und; Thai = ภาษาไทย; Deutsch = ภาษาเยอรมัน; Englisch = ภาษาอังกฤษ','spreche ผันตาม ich และ und เชื่อมภาษาสองภาษา งานนี้กำหนดลำดับชื่อภาษาไว้เพื่อฝึกตามข้อมูล')
varied('L04','L04-P002','แสดงความคิดเห็นต่อโซฟา','Wie findest du das Sofa?',
 ['Ich finde das Sofa schön.','Ich finde das Sofa praktisch.','Ich finde das Sofa schön.','Ich finde das Sofa alt.','Ich finde das Sofa praktisch.'],
 ['ฉันคิดว่าโซฟาสวย','ฉันคิดว่าโซฟาใช้ประโยชน์ได้ดี','ฉันคิดว่าโซฟาสวย','ฉันคิดว่าโซฟาเก่า','ฉันคิดว่าโซฟาใช้ประโยชน์ได้ดี'],
 [('คือเพื่อนในร้านเฟอร์นิเจอร์','คุณคิดว่าโซฟาสวย'),('คือเพื่อนที่กำลังจัดบ้าน','คุณคิดว่าโซฟาใช้งานได้ดี'),('คือเพื่อนที่ดูรูปห้อง','คุณคิดว่าโซฟาสวย ให้ขึ้นต้น Ich'),('คือเพื่อนที่บ้านของคุณ','คุณคิดว่าโซฟาเก่า ให้ขึ้นต้น Ich'),('คือเพื่อนที่กำลังเลือกโซฟา','คุณคิดว่าโซฟาใช้งานได้ดี ให้ขึ้นต้น Ich')],
 ['Ich finde das Sofa alt.','Ich finde das Sofa schön.'],'คำคุณศัพท์แสดงความเห็นต่างจากข้อมูลที่กำหนด','present','ich / finden / das Sofa; schön = สวย; praktisch = ใช้งานได้ดี; alt = เก่า','finde ผันตาม ich ตามด้วยสิ่งที่ประเมิน das Sofa และคำคุณศัพท์ที่บอกความเห็น')
varied('L04','L04-P004','บอกราคาสินค้า','Wie viel kostet der Tisch?',
 ['Der Tisch kostet achtzig Euro.','Der Tisch kostet neunzig Euro.','Der Tisch kostet fünfzig Euro.','Der Tisch kostet sechzig Euro.','Der Tisch kostet siebzig Euro.'],
 ['โต๊ะราคาแปดสิบยูโร','โต๊ะราคาเก้าสิบยูโร','โต๊ะราคาห้าสิบยูโร','โต๊ะราคาหกสิบยูโร','โต๊ะราคาเจ็ดสิบยูโร'],
 [('คือเพื่อนในร้าน','ป้ายราคาโต๊ะระบุ80ยูโร ให้เขียนจำนวนเป็นคำ'),('คือลูกค้า','ป้ายราคาโต๊ะระบุ90ยูโร ให้เขียนจำนวนเป็นคำ'),('คือเพื่อนที่ดูประกาศ','โต๊ะราคา50ยูโร ให้เขียนจำนวนเป็นคำและขึ้นต้น Der'),('คือเพื่อนที่เลือกเฟอร์นิเจอร์','โต๊ะราคา60ยูโร ให้เขียนจำนวนเป็นคำและขึ้นต้น Der'),('คือลูกค้าในร้าน','โต๊ะราคา70ยูโร ให้เขียนจำนวนเป็นคำและขึ้นต้น Der')],
 ['Der Tisch kostet neunzig Euro.','Der Tisch kostet achtzig Euro.'],'จำนวนเงินไม่ตรงกับป้ายราคาที่ให้','present','der Tisch / kosten / Euro; fünfzig =50; sechzig =60; siebzig =70; achtzig =80; neunzig =90','Der Tisch เป็นประธานเอกพจน์ ใช้ kostet แล้วตามด้วยราคาและ Euro')
varied('L05','L05-P008','บอกสิ่งที่ต้องการ','Was brauchst du?',
 ['Ich brauche einen Stift.','Ich brauche eine Tasche.','Ich brauche ein Glas.','Ich brauche einen Stift.','Ich brauche eine Tasche.'],
 ['ฉันต้องการปากกา','ฉันต้องการกระเป๋า','ฉันต้องการแก้ว','ฉันต้องการปากกา','ฉันต้องการกระเป๋า'],
 [('คือเพื่อนร่วมชั้น','คุณต้องการปากกาเพื่อเขียน'),('คือเพื่อนที่ช่วยเก็บของ','คุณต้องการกระเป๋า'),('คือเพื่อนที่โต๊ะอาหาร','คุณต้องการแก้ว ให้ขึ้นต้น Ich'),('คือเพื่อนที่โต๊ะทำงาน','คุณต้องการปากกา ให้ขึ้นต้น Ich'),('คือเพื่อนที่ช่วยถือของ','คุณต้องการกระเป๋า ให้ขึ้นต้น Ich')],
 ['Ich brauche eine Tasche.','Ich brauche einen Stift.'],'สิ่งของในคำตอบไม่ตรงกับสิ่งที่ต้องการในข้อมูล','present','ich / brauchen; der Stift = ปากกา; die Tasche = กระเป๋า; das Glas = แก้ว','brauche ผันตาม ich สิ่งที่ต้องการเป็น Akkusativ: einen Stift, eine Tasche หรือ ein Glas')
varied('L05','L05-P010','บอกว่าไม่มีสิ่งของ','Hast du einen Schlüssel?',
 ['Ich habe keinen Schlüssel.','Ich habe keinen Schlüssel.','Ich habe keinen Schlüssel.','Ich habe keinen Schlüssel.','Ich habe keinen Schlüssel.'],
 ['ฉันไม่มีกุญแจ']*5,
 [('คือเพื่อนหน้าประตูห้อง','คุณไม่มีกุญแจ'),('คือเพื่อนที่กำลังหากุญแจรถ','คุณไม่มีกุญแจ'),('คือเพื่อนที่ตู้เก็บของ','คุณไม่มีกุญแจ ให้ขึ้นต้น Ich'),('คือเพื่อนบ้านที่ประตูบ้าน','คุณไม่มีกุญแจ ให้ขึ้นต้น Ich'),('คือเพื่อนที่ห้องชมรม','คุณไม่มีกุญแจ ให้ขึ้นต้น Ich')],
 ['Ich habe einen Schlüssel.','Ja, ich habe einen Schlüssel.'],'einen/Ja ยืนยันว่ามี แต่ข้อมูลระบุว่าไม่มีกุญแจ','present','ich / haben / kein; der Schlüssel = กุญแจ','habe ผันตาม ich ปฏิเสธคำนาม der Schlüssel ใน Akkusativ ด้วย keinen Schlüssel')
varied('L06','L06-P004','บอกว่าไม่มีเครื่องพิมพ์','Hast du einen Drucker?',
 ['Ich habe keinen Drucker.']*5,['ฉันไม่มีเครื่องพิมพ์']*5,
 [('คือเพื่อนที่ต้องการพิมพ์เอกสาร','คุณไม่มีเครื่องพิมพ์'),('คือเพื่อนร่วมกลุ่มที่ทำรายงาน','คุณไม่มีเครื่องพิมพ์'),('คือเพื่อนที่ย้ายบ้าน','คุณไม่มีเครื่องพิมพ์ ให้ขึ้นต้น Ich'),('คือเพื่อนร่วมงานที่สอบถามอุปกรณ์','คุณไม่มีเครื่องพิมพ์ ให้ขึ้นต้น Ich'),('คือเพื่อนบ้านที่ขอพิมพ์บัตร','คุณไม่มีเครื่องพิมพ์ ให้ขึ้นต้น Ich')],
 ['Ich habe einen Drucker.','Ja, ich habe einen Drucker.'],'คำตอบนี้ยืนยันว่ามีเครื่องพิมพ์ แต่ข้อมูลระบุว่าไม่มี','present','ich / haben / kein; der Drucker = เครื่องพิมพ์','habe ผันตาม ich และปฏิเสธกรรม Akkusativ ด้วย keinen Drucker')
varied('L06','L06-P009','บอกกิจกรรมที่กำลังทำ','Was machst du?',
 ['Ich schreibe eine E-Mail.']*5,['ฉันกำลังเขียนอีเมล']*5,
 [('คือเพื่อนร่วมงาน','คุณกำลังเขียนอีเมลถึงลูกค้า'),('คือเพื่อนร่วมชั้น','คุณกำลังเขียนอีเมลถึงครู'),('คือเพื่อนร่วมห้อง','คุณกำลังเขียนอีเมลถึงที่ทำงาน ให้ตอบเฉพาะกิจกรรมและขึ้นต้น Ich'),('คือเพื่อนที่ห้องสมุด','คุณกำลังเขียนอีเมลถึงเพื่อนร่วมกลุ่ม ให้ตอบเฉพาะกิจกรรมและขึ้นต้น Ich'),('คือเพื่อนที่โต๊ะทำงาน','คุณกำลังเขียนอีเมลถึงโรงเรียน ให้ตอบเฉพาะกิจกรรมและขึ้นต้น Ich')],
 ['Ich suche meine Maus.','Ich brauche Papier.'],'คำตอบพูดถึงการหาเมาส์หรือต้องการกระดาษ ไม่ใช่การเขียนอีเมล','present','ich / schreiben / eine E-Mail; die E-Mail = อีเมล','schreibe ผันตาม ich ตามด้วยกรรม eine E-Mail งานนี้ตอบเฉพาะกิจกรรม ไม่ต้องเพิ่มผู้รับ')
varied('L07','L07-P002','บอกความสามารถ','Was kannst du?',
 ['Ich kann tanzen.','Ich kann schwimmen.','Ich kann kochen.','Ich kann singen.','Ich kann tanzen.'],
 ['ฉันเต้นได้','ฉันว่ายน้ำได้','ฉันทำอาหารได้','ฉันร้องเพลงได้','ฉันเต้นได้'],
 [('คือเพื่อนในชมรม','คุณเต้นได้'),('คือเพื่อนที่สระว่ายน้ำ','คุณว่ายน้ำได้'),('คือเพื่อนที่ครัว','คุณทำอาหารได้ ให้ขึ้นต้น Ich'),('คือเพื่อนในชมรมดนตรี','คุณร้องเพลงได้ ให้ขึ้นต้น Ich'),('คือเพื่อนที่งานเลี้ยง','คุณเต้นได้ ให้ขึ้นต้น Ich')],
 ['Ich kann nicht tanzen.','Ich kann nicht schwimmen.'],'nicht ทำให้เป็นการบอกว่าทำไม่ได้ แต่ข้อมูลระบุว่าทำได้','modal','ich / können; tanzen = เต้น; schwimmen = ว่ายน้ำ; kochen = ทำอาหาร; singen = ร้องเพลง','kann ผันตาม ich อยู่ตำแหน่งที่ 2 และกริยากิจกรรมรูป Infinitiv อยู่ท้ายประโยค')
varied('L07','L07-P010','บอกกิจกรรมที่ชอบ','Was machst du gern?',
 ['Ich spiele gern Fußball.','Ich spiele gern Tennis.','Ich spiele gern Fußball.','Ich spiele gern Tennis.','Ich spiele gern Fußball.'],
 ['ฉันชอบเล่นฟุตบอล','ฉันชอบเล่นเทนนิส','ฉันชอบเล่นฟุตบอล','ฉันชอบเล่นเทนนิส','ฉันชอบเล่นฟุตบอล'],
 [('คือเพื่อนใหม่ในชมรมกีฬา','คุณชอบเล่นฟุตบอล'),('คือเพื่อนในสวน','คุณชอบเล่นเทนนิส'),('คือเพื่อนในชั้นภาษา','คุณชอบเล่นฟุตบอล ให้ขึ้นต้น Ich'),('คือเพื่อนในงานเลี้ยง','คุณชอบเล่นเทนนิส ให้ขึ้นต้น Ich'),('คือเพื่อนร่วมกลุ่ม','คุณชอบเล่นฟุตบอล ให้ขึ้นต้น Ich')],
 ['Ich spiele nicht gern Fußball.','Ich spiele nicht gern Tennis.'],'nicht gern หมายถึงไม่ชอบ แต่ข้อมูลระบุว่าชอบ','present','ich / spielen / gern; der Fußball = ฟุตบอล; das Tennis = เทนนิส','spiele ผันตาม ich และ gern บอกว่าชอบทำกิจกรรมนั้น งานนี้ให้วาง gern หน้าชื่อกีฬา')
varied('L08','L08-P006','บอกเวลานัด','Wann treffen wir uns?',
 ['Wir treffen uns um acht Uhr.','Wir treffen uns um neun Uhr.','Wir treffen uns um zehn Uhr.','Wir treffen uns um sieben Uhr.','Wir treffen uns um elf Uhr.'],
 ['พวกเรานัดพบกันแปดโมง','พวกเรานัดพบกันเก้าโมง','พวกเรานัดพบกันสิบโมง','พวกเรานัดพบกันเจ็ดโมง','พวกเรานัดพบกันสิบเอ็ดโมง'],
 [('คือเพื่อนที่นัดไปคาเฟ่','คุณกับเพื่อนนัดพบ08:00 ให้เขียนจำนวนเป็นคำ'),('คือเพื่อนที่นัดไปห้องสมุด','คุณกับเพื่อนนัดพบ09:00 ให้เขียนจำนวนเป็นคำ'),('คือเพื่อนที่นัดไปสวน','คุณกับเพื่อนนัดพบ10:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Wir'),('คือเพื่อนที่นัดไปดูหนัง','คุณกับเพื่อนนัดพบ07:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Wir'),('คือเพื่อนที่นัดไปกินข้าว','คุณกับเพื่อนนัดพบ11:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Wir')],
 ['Wir treffen uns um neun Uhr.','Wir treffen uns um acht Uhr.'],'เวลานัดในคำตอบไม่ตรงกับข้อมูล','present','wir / sich treffen / um / Uhr; sieben =7; acht =8; neun =9; zehn =10; elf =11','Wir ใช้ treffen ตามด้วย uns และบอกเวลาเฉพาะด้วย um … Uhr')
varied('L08','L08-P007','บอกวันที่จะมา','Wann kommst du?',
 ['Ich komme am Samstag.','Ich komme am Sonntag.','Ich komme am Montag.','Ich komme am Freitag.','Ich komme am Dienstag.'],
 ['ฉันจะมาวันเสาร์','ฉันจะมาวันอาทิตย์','ฉันจะมาวันจันทร์','ฉันจะมาวันศุกร์','ฉันจะมาวันอังคาร'],
 [('คือเพื่อนที่จัดงาน','คุณจะมาวันเสาร์'),('คือเพื่อนที่ชวนมาบ้าน','คุณจะมาวันอาทิตย์'),('คือเพื่อนร่วมกลุ่ม','คุณจะมาวันจันทร์ ให้ขึ้นต้น Ich'),('คือเพื่อนที่นัดทำอาหาร','คุณจะมาวันศุกร์ ให้ขึ้นต้น Ich'),('คือเพื่อนที่รอคุณ','คุณจะมาวันอังคาร ให้ขึ้นต้น Ich')],
 ['Ich komme am Sonntag.','Ich komme am Samstag.'],'วันในคำตอบไม่ตรงกับวันที่จะมา','present','ich / kommen / am; Samstag = เสาร์; Sonntag = อาทิตย์; Montag = จันทร์; Freitag = ศุกร์; Dienstag = อังคาร','komme ผันตาม ich และใช้ am กับชื่อวันเพื่อบอกวันที่จะมา')
varied('L09','L09-P002','บอกอาหารที่ชอบกิน','Was isst du gern?',
 ['Ich esse gern Pizza.','Ich esse gern Brot.','Ich esse gern Gemüse.','Ich esse gern Pizza.','Ich esse gern Brot.'],
 ['ฉันชอบกินพิซซ่า','ฉันชอบกินขนมปัง','ฉันชอบกินผัก','ฉันชอบกินพิซซ่า','ฉันชอบกินขนมปัง'],
 [('คือเพื่อนที่ร้านอาหาร','คุณชอบกินพิซซ่า'),('คือเพื่อนที่โต๊ะอาหารเช้า','คุณชอบกินขนมปัง'),('คือเพื่อนที่ซื้อของ','คุณชอบกินผัก ให้ขึ้นต้น Ich'),('คือเพื่อนที่วางแผนมื้อเย็น','คุณชอบกินพิซซ่า ให้ขึ้นต้น Ich'),('คือเพื่อนที่เตรียมอาหารเช้า','คุณชอบกินขนมปัง ให้ขึ้นต้น Ich')],
 ['Ich esse nicht gern Pizza.','Ich esse nicht gern Brot.'],'nicht gern ปฏิเสธความชอบ แต่ข้อมูลระบุว่าชอบกิน','present','ich / essen / gern; die Pizza = พิซซ่า; das Brot = ขนมปัง; das Gemüse = ผัก','esse ผันตาม ich และ gern ใช้บอกความชอบกิน ไม่ต้องใส่ Artikel เมื่อพูดถึงอาหารโดยทั่วไปแบบนี้')
varied('L09','L09-P004','บอกว่าไม่ชอบกาแฟ','Magst du Kaffee?',
 ['Ich mag keinen Kaffee.']*5,['ฉันไม่ชอบกาแฟ']*5,
 [('คือเพื่อนที่คาเฟ่','คุณไม่ชอบกาแฟ'),('คือเพื่อนที่จัดอาหารเช้า','คุณไม่ชอบกาแฟ'),('คือเพื่อนร่วมงานที่เตรียมเครื่องดื่ม','คุณไม่ชอบกาแฟ ให้ขึ้นต้น Ich'),('คือเพื่อนบ้านที่เชิญดื่มกาแฟ','คุณไม่ชอบกาแฟ ให้ขึ้นต้น Ich'),('คือเพื่อนที่ซื้อเครื่องดื่มให้กลุ่ม','คุณไม่ชอบกาแฟ ให้ขึ้นต้น Ich')],
 ['Ich mag Kaffee.','Ja, ich mag Kaffee.'],'คำตอบยืนยันว่าชอบกาแฟ แต่ข้อมูลระบุว่าไม่ชอบ','present','ich / mögen / kein; der Kaffee = กาแฟ','mögen ผันกับ ich เป็น mag และปฏิเสธ Kaffee ซึ่งเป็น Akkusativ ด้วย keinen')
varied('L10','L10-P002','บอกเวลามาถึง','Wann kommst du an?',
 ['Ich komme um neun Uhr an.','Ich komme um zehn Uhr an.','Ich komme um acht Uhr an.','Ich komme um elf Uhr an.','Ich komme um sieben Uhr an.'],
 ['ฉันมาถึงเก้าโมง','ฉันมาถึงสิบโมง','ฉันมาถึงแปดโมง','ฉันมาถึงสิบเอ็ดโมง','ฉันมาถึงเจ็ดโมง'],
 [('คือเพื่อนที่รอที่สถานี','คุณมาถึง09:00 ให้เขียนจำนวนเป็นคำ'),('คือเพื่อนที่มารับที่ป้ายรถ','คุณมาถึง10:00 ให้เขียนจำนวนเป็นคำ'),('คือเพื่อนที่รอหน้าบ้าน','คุณมาถึง08:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Ich'),('คือเพื่อนที่มารับที่สถานี','คุณมาถึง11:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Ich'),('คือเพื่อนที่รอไปทำกิจกรรม','คุณมาถึง07:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Ich')],
 ['Ich komme um zehn Uhr an.','Ich komme um neun Uhr an.'],'เวลาที่มาถึงไม่ตรงกับข้อมูล','separable','ich / ankommen / um / Uhr; sieben =7; acht =8; neun =9; zehn =10; elf =11','ankommen เป็นกริยาแยกส่วน komme อยู่ตำแหน่งที่ 2 ส่วน an อยู่ท้ายประโยค')
varied('L10','L10-P005','บอกเวลารถไฟออก','Wann fährt der Zug ab?',
 ['Der Zug fährt um zehn Uhr ab.','Der Zug fährt um elf Uhr ab.','Der Zug fährt um neun Uhr ab.','Der Zug fährt um acht Uhr ab.','Der Zug fährt um sieben Uhr ab.'],
 ['รถไฟออกสิบโมง','รถไฟออกสิบเอ็ดโมง','รถไฟออกเก้าโมง','รถไฟออกแปดโมง','รถไฟออกเจ็ดโมง'],
 [('คือผู้โดยสารที่สถานี','ตารางรถไฟระบุออก10:00 ให้เขียนจำนวนเป็นคำ'),('คือเพื่อนที่ดูตารางเดินรถ','รถไฟออก11:00 ให้เขียนจำนวนเป็นคำ'),('คือเพื่อนที่กำลังเดินทาง','รถไฟออก09:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Der'),('คือผู้โดยสารอีกคน','รถไฟออก08:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Der'),('คือเพื่อนที่วางแผนไปสถานี','รถไฟออก07:00 ให้เขียนจำนวนเป็นคำและขึ้นต้น Der')],
 ['Der Zug fährt um elf Uhr ab.','Der Zug fährt um zehn Uhr ab.'],'เวลาออกของรถไฟไม่ตรงกับตาราง','separable','der Zug / abfahren / um / Uhr; sieben =7; acht =8; neun =9; zehn =10; elf =11','Der Zug เป็นประธานเอกพจน์ ใช้ fährt ส่วน ab แยกไปอยู่ท้ายประโยค')

def annotations(text,shape):
 # Explicit phrase grouping for only the authored structures in this bank.
 segments=[];remaining=text
 def take(prefix,role,label,position):
  nonlocal remaining
  assert remaining.startswith(prefix),(text,prefix,remaining)
  segments.append(dict(text=prefix,role=role,label=label,position=position));remaining=remaining[len(prefix):].lstrip()
 first_time=next((p for p in ['Heute Morgen','Am Sonntag','Am Samstag','Am Abend','Gestern','Heute'] if remaining.startswith(p+' ')),None)
 if first_time: take(first_time,'time','เวลา','ตำแหน่ง 1')
 if remaining.startswith('Hier '):take('Hier','other','สถานที่','ตำแหน่ง 1')
 if remaining.startswith('Wie '):take('Wie','other','คำถามข้อมูล','ตำแหน่ง 1')
 elif remaining.startswith('Was '):take('Was','other','คำถาม','ตำแหน่ง 1')
 subjects=['Meine Schwester','Der Tisch','Der Zug','Ich','Wir','Berlin','Hamburg','Bonn','Köln','Leipzig']
 subj=next((s for s in subjects if remaining.startswith(s+' ')),None)
 if subj:take(subj,'subject','ประธาน','ตำแหน่ง 1' if not segments else 'หลังคำบอกเวลา')
 finite=remaining.split(' ')[0];is_aux=shape in ['perfekt','sein-perfekt','modal']
 take(finite,'auxiliary' if is_aux else 'verb','กริยาช่วย (ผันแล้ว)' if is_aux else 'กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2')
 for s in ['ich','wir','du','es']:
  if remaining.startswith(s+' '):take(s,'subject','ประธาน','หลังกริยาที่ผันแล้ว');break
 if shape=='question' and remaining.startswith('deine Handynummer'):
  take(remaining,'subject','ประธาน','หลังกริยาที่ผันแล้ว')
 if remaining:
  end=remaining.split()[-1]
  if shape in ['perfekt','sein-perfekt','modal','separable']:
   middle=remaining[:-len(end)].strip()
   if middle:
    time_prefix=next((t for t in ['heute Morgen','am Montag','am Sonntag','am Samstag','am Freitag','am Abend','gestern'] if middle==t or middle.startswith(t+' ')),None)
    if time_prefix:
     take(time_prefix,'time','เวลา','ส่วนขยายเวลา')
     middle=middle[len(time_prefix):].strip()
    if middle:
     time_at=middle.find(' um ')
     if middle.startswith('um '):take(middle,'time','เวลา','ส่วนขยายเวลา')
     elif time_at>=0:
      take(middle[:time_at],'other','ข้อมูลเพิ่มเติม','ส่วนกลางประโยค')
      take(middle[time_at+1:],'time','เวลา','ส่วนขยายเวลา')
     else:take(middle,'other','ข้อมูลเพิ่มเติม','ส่วนกลางประโยค')
   role='participle' if shape in ['perfekt','sein-perfekt'] else 'verb'
   label='กริยาหลัก · Partizip II' if role=='participle' else 'กริยาหลัก · Infinitiv' if shape=='modal' else 'ส่วนแยกของกริยา'
   take(end,role,label,'ท้ายประโยค')
  else:
   if ' um ' in remaining:
    at=remaining.index(' um ');take(remaining[:at],'other','ข้อมูลเพิ่มเติม','หลังกริยาหรือประธาน');take(remaining,'time','เวลา','ส่วนขยายเวลา')
   elif remaining.startswith(('um ','am ')):take(remaining,'time','เวลา','ส่วนขยายเวลา')
   else:take(remaining,'other','ข้อมูลเพิ่มเติม','หลังกริยาหรือประธาน')
 assert ' '.join(p['text'] for p in segments)==text,text
 return segments

packets={};provenance=[]
for obj in OBJECTIVES:
 lesson=obj['lesson'];target=obj['target'];assert lesson=='L13' or target in targets,target
 questions=packets.setdefault(lesson,[])
 for index,r in enumerate(obj['rows'],1):
  stage=1 if index<=2 else 2 if index<=4 else 3
  answer=r['answer'];assert len(answer)<=54,(target,answer,len(answer))
  stem=answer.split()[0];text=r['context']
  if stage>=2 and 'ขึ้นต้น' not in text:text+=' ให้ขึ้นต้นด้วย '+stem
  if stage>=2:text+=' เขียนคำตอบทั้งประโยคตามข้อมูล ไม่เพิ่มรายละเอียดอื่น'
  if target in ['L07-P010','L09-P002']:text+=' ให้วาง gern หน้าชื่อกีฬาหรืออาหาร'
  if stage>=2 and target=='L05-P008':text+=' ใช้ Artikel แบบไม่ชี้เฉพาะ ein โดยผันให้ตรงกับคำนามและ Akkusativ'
  if stage>=2 and target in ['L09-P004','L05-P010']:text+=' ใช้ kein โดยผันให้ตรงกับคำนามและ Akkusativ'
  if stage>=2 and target=='L13-R011':text+=' ใช้ ein แบบไม่ชี้เฉพาะ โดยผันให้ตรงกับคำนามหลัง es gibt'
  scaffold=''
  if stage==2:
   words=answer.split();words[1]='___';words[-1]='___'+('?' if answer.endswith('?') else '.')
   scaffold=' ใช้ลำดับตามโครงที่ให้ โครงช่วย: '+' '.join(words)
  gloss=' คำช่วย: '+obj['lemma']
  prompt=text+scaffold+gloss
  a_text=r['question'] if r['question']!='B: ___' else 'Hallo!'
  question_meanings={
   'Wie heißt du?':'เธอชื่ออะไร','Woher kommst du?':'เธอมาจากไหน','Wie heißt deine Schwester?':'พี่หรือน้องสาวของเธอชื่ออะไร','Welche Sprachen sprichst du?':'เธอพูดภาษาอะไรบ้าง','Wie findest du das Sofa?':'เธอคิดว่าโซฟาเป็นอย่างไร','Wie viel kostet der Tisch?':'โต๊ะราคาเท่าไร','Was brauchst du?':'เธอต้องการอะไร','Hast du einen Schlüssel?':'เธอมีกุญแจไหม','Hast du einen Drucker?':'เธอมีเครื่องพิมพ์ไหม','Was machst du?':'เธอกำลังทำอะไร','Was kannst du?':'เธอทำอะไรได้บ้าง','Was machst du gern?':'เธอชอบทำอะไร','Wann treffen wir uns?':'พวกเรานัดพบกันเมื่อไร','Wann kommst du?':'เธอจะมาเมื่อไร','Was isst du gern?':'เธอชอบกินอะไร','Magst du Kaffee?':'เธอชอบกาแฟไหม','Wann kommst du an?':'เธอมาถึงเมื่อไร','Wann fährt der Zug ab?':'รถไฟออกเมื่อไร','Was hast du gestern gemacht?':'เมื่อวานเธอทำอะไร','Was hast du heute Morgen gemacht?':'วันนี้ตอนเช้าเธอทำอะไร','Was hast du am Montag gemacht?':'เมื่อวันจันทร์เธอทำอะไร','Was hast du am Abend gemacht?':'ตอนเย็นเธอทำอะไร','Was hast du gestern Abend gemacht?':'เมื่อวานตอนเย็นเธอทำอะไร','Was hast du am Sonntag gemacht?':'เมื่อวันอาทิตย์เธอทำอะไร','Was hast du heute gemacht?':'วันนี้เธอทำอะไร','Wie seid ihr gefahren?':'พวกเธอเดินทางอย่างไร','Wie bist du gefahren?':'เธอเดินทางอย่างไร','Wie bist du gestern gefahren?':'เมื่อวานเธอเดินทางอย่างไร','Wie seid ihr am Montag gefahren?':'เมื่อวันจันทร์พวกเธอเดินทางอย่างไร','Wie bist du heute gefahren?':'วันนี้เธอเดินทางอย่างไร','Wann bist du zurückgekommen?':'เธอกลับมาเมื่อไร','Gefällt Ihnen Berlin?':'คุณชอบเบอร์ลินไหม','Gefällt dir Hamburg?':'เธอชอบฮัมบวร์กไหม','Gefällt dir Bonn?':'เธอชอบบอนน์ไหม','Gefällt dir Köln?':'เธอชอบเคิล์นไหม','Gefällt dir Leipzig?':'เธอชอบไลพ์ซิกไหม','Was gibt es hier?':'ที่นี่มีอะไรบ้าง','Hallo!':'สวัสดี'}
  assert a_text in question_meanings,a_text
  qid=f'{target}-practice-v2-s{stage}-c{index}'
  subskill='phrase_dialogue_response' if stage==1 else 'phrase_bounded_production'
  prereq=obj['prior'] if stage==1 else 'phrase_dialogue_response' if stage==2 else 'phrase_bounded_production'
  error=[]
  options=[]
  if stage==1:
   options=[answer,r['wrong'],'Auf Wiedersehen!']
   assert len(set(options))==3
   error=[dict(response=r['wrong'],message=r['why']),dict(response='Auf Wiedersehen!',message='ประโยคนี้ใช้กล่าวลา แต่สถานการณ์กำลังขอข้อมูลหรือคำตอบตามที่ระบุ')]
  q=dict(id=qid,version=1,itemId=target,targetId=target,targetIds=[target],requiredItemIds=[target],topicId=obj['topic'],topicName=obj['title'],kind='choice' if stage==1 else 'cloze',subskill=subskill,prompt=prompt,sentence='A: '+r['question']+'\nB: ___' if r['question']!='B: ___' else 'B: ___',sentenceLang='de',translation=r['meaning'],acceptedAnswers=[answer,answer.rstrip('.?!')],feedbackAnswer=answer,explanation=obj['reason'],difficulty=2 if stage<3 else 3,difficultyRationale='เลือกคำตอบให้ตรงข้อมูลในบริบทใหม่ มีตัวเลือกเยอรมันให้' if stage==1 else 'สร้างคำตอบทั้งประโยคจากโครงที่ให้และข้อมูลเจาะจง' if stage==2 else 'สร้างคำตอบตามข้อมูลด้วยคำรูปพื้นฐานและคำขึ้นต้น ไม่มีคลังคำที่ผันแล้ว',assistance='german-response-options-and-supplied-context' if stage==1 else 'sentence-scaffold-and-glosses' if stage==2 else 'lemmas-start-constraint-and-glosses',knownErrors={},errorLabels={},hint=obj['reason'],practice=dict(familyId=target+':'+subskill,contextId=f'{target}-context-v2-{index}',stage=stage,unlock=dict(subskill=prereq,minCorrectContexts=0 if stage==1 else 2,minPracticeSessions=0 if stage==1 else 2,requiresAttempt=True)),feedbackErrors=error,answerParts=annotations(answer,obj['parts']))
  q['dialoguePrompt']=dict(text=a_text,meaning=question_meanings[a_text])
  q['sentence']='A: '+a_text+'\nB: ___'
  if stage==1:q['options']=options
  else:q['answerScope']='sentence'
  questions.append(q)
  provenance.append(dict(lessonId=lesson,taskId=qid,targetId=target,sourceStatus='product-authored-context-and-distractors',taughtTargetSource='docs/exercise-mapping/a11-phrase-bank.json' if lesson!='L13' else 'docs/exercise-mapping/l13-phrases-bank.json',contextId=q['practice']['contextId'],subskill=subskill,stage=stage,assistance=q['assistance'],difficulty=q['difficulty'],difficultyRationale=q['difficultyRationale'],assessmentScope='Constrained response with supplied facts. Formulaic early responses may repeat the same phrase in distinct real situations; not evidence of lexical generalization or free production.'))
packets=[dict(lessonId=lesson,questions=packets[lesson]) for lesson in sorted(packets)]
(root/'docs/exercise-mapping/l01-l13-practice-extensions.json').write_text(json.dumps(packets,ensure_ascii=False,indent=2)+'\n')
(root/'docs/exercise-mapping/l01-l13-practice-extension-provenance.json').write_text(json.dumps(dict(schemaVersion=1,authoredAt='2026-11-10',scope='Two suitable taught communicative objectives in each lesson L01-L13; five context tasks each; no claim of full curriculum migration',responseUnits=provenance),ensure_ascii=False,indent=2)+'\n')
print([(p['lessonId'],len(p['questions'])) for p in packets]);print('Total',sum(len(p['questions']) for p in packets))
