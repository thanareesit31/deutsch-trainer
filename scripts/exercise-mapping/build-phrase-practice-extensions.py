#!/usr/bin/env python3
"""Author constrained contextual phrase practice without changing published tasks."""
import argparse
import hashlib
import json
import random
from pathlib import Path
from collections import Counter

ROLES = {
 's': ('subject', 'ประธาน'), 'v': ('verb', 'กริยาที่ผันแล้ว'),
 'a': ('auxiliary', 'กริยาช่วยที่ผันแล้ว'), 'i': ('verb', 'Infinitiv'),
 'p': ('participle', 'Partizip II'), 'x': ('verb', 'ส่วนแยกกริยา'),
 'q': ('question', 'คำถาม'), 'o': ('other', 'ส่วนเติมเต็ม'),
 'l': ('other', 'สถานที่'), 't': ('time', 'เวลา'),
 'f': ('other', 'ตอบรับหรือปฏิเสธ'), 'n': ('other', 'คำปฏิเสธ'),
 'r': ('other', 'คำสะท้อนกลับ'), 'b': ('other', 'คำสุภาพ'),
 'd': ('other', 'ส่วนบอกลักษณะ'), 'm': ('other', 'คำขยาย'),
}
SPECS = []

def add(id, a, b, am, bm, keys, rows, lemmas, limited=False):
    assert len(rows) == (1 if limited else 4)
    SPECS.append(dict(id=id, a=a, b=b, am=am, bm=bm,
                      rows=[dict(zip(keys, row)) for row in rows], lemmas=lemmas, limited=limited))

# Each row describes actual new facts. Inflected noun groups are supplied assistance.
add('L15-D01', 'q1~Was|v2~ist|s~das|l~hier?',
    's1~Das|v2~ist|o~{room}.', 'ตรงนี้คืออะไร', 'นี่คือ{thai}',
    ['room','thai','scene'], [
    ('das Wohnzimmer','ห้องนั่งเล่น','เจ้าของบ้านพาแขกดูห้องที่มีโซฟาสำหรับนั่งพัก'),
    ('das Schlafzimmer','ห้องนอน','เพื่อนพาดูห้องที่จัดเตียงสำหรับนอน'),
    ('die Küche','ห้องครัว','ผู้เช่าถามถึงห้องที่ใช้เตรียมอาหาร'),
    ('das Kinderzimmer','ห้องเด็ก','ครอบครัวกำลังเลือกห้องให้ลูกใช้')], 'sein; {room}')
add('L15-D02', 'v1~Hat|s~die Wohnung|o~{object}?',
    'f~Ja,|s1~die Wohnung|v2~hat|o~{object}.', 'ห้องชุดมี{thai}ไหม', 'ใช่ ห้องชุดมี{thai}',
    ['object','thai','scene'], [
    ('einen Garten','สวน','ประกาศห้องชุดระบุว่าผู้เช่าใช้สวนส่วนตัวได้'),
    ('eine Küche','ห้องครัว','ข้อมูลห้องชุดใหม่ระบุว่ามีห้องครัวแยก'),
    ('ein Arbeitszimmer','ห้องทำงาน','ผู้เช่าต้องการทำงานที่บ้านและข้อมูลระบุว่ามีห้องทำงาน'),
    ('ein Kinderzimmer','ห้องเด็ก','ครอบครัวถามหาที่พักที่มีห้องแยกให้เด็กและที่นี่มี')], 'haben; die Wohnung; {object}')
add('L15-D03', 'q1~Wie|v2~findest|s~du|o~{object}?',
    's1~Ich|v2~finde|o~{object}|d~{adjective}.', 'เธอคิดว่า{thai}นี้เป็นอย่างไร', 'ฉันคิดว่า{thai}นี้{quality}',
    ['object','thai','adjective','quality','scene'], [
    ('das Sofa','โซฟา','schön','สวย','เพื่อนขอความเห็นเรื่องโซฟาที่กำลังเลือกซื้อ'),
    ('die Küche','ห้องครัว','praktisch','ใช้งานสะดวก','ผู้เช่าลองดูห้องครัวและพอใจกับการใช้งาน'),
    ('den Schrank','ตู้','zu groß','ใหญ่เกินไป','กำลังเลือกตู้ให้ห้องเล็กและตู้นี้กินพื้นที่มากเกินไป'),
    ('das Bett','เตียง','zu klein','เล็กเกินไป','ผู้ใช้ลองดูขนาดเตียงและเห็นว่าพื้นที่นอนไม่พอ')], 'finden; {object}; {adjective} = {quality}')
add('L15-D04', 'v1~Magst|s~du|o~{object}?',
    'f~Ja,|o1~{object_cap}|v2~mag|s~ich|m~besonders.', 'เธอชอบ{thai}นี้ไหม', 'ใช่ ฉันชอบ{thai}นี้เป็นพิเศษ',
    ['object','object_cap','thai','scene'], [
    ('den Balkon','den Balkon','ระเบียง','เพื่อนเห็นวิวจากระเบียงแล้วชอบระเบียงเป็นพิเศษ'),
    ('die Küche','die Küche','ห้องครัว','คนชอบทำอาหารบอกว่าส่วนที่ชอบที่สุดคือห้องครัว'),
    ('das Wohnzimmer','das Wohnzimmer','ห้องนั่งเล่น','ผู้ชมบ้านชอบพื้นที่นั่งพักมากกว่าส่วนอื่น'),
    ('das Bad','das Bad','ห้องน้ำ','ผู้ชมบ้านชอบห้องน้ำที่จัดพื้นที่ใช้งานได้สะดวกเป็นพิเศษ')], 'mögen; {object}; besonders = เป็นพิเศษ')
add('L15-D05', 'v1~Ist|s~das|o~{owner}s {bare}?',
    'f~Ja,|s1~das|v2~ist|o~{possessive} {bare}.', 'นี่คือ{thai}ของ {owner} ใช่ไหม', 'ใช่ นี่คือ{thai}ของ{person}',
    ['owner','bare','possessive','thai','person','scene'], [
    ('Klara','Tisch','ihr','โต๊ะ','เธอ','โต๊ะที่มีป้ายชื่อ Klara วางอยู่ในห้องใหม่'),
    ('Tom','Lampe','seine','โคมไฟ','เขา','Tom ยืนยันว่าเป็นคนซื้อโคมไฟดวงนี้'),
    ('Klara','Bett','ihr','เตียง','เธอ','รายการของย้ายบ้านระบุว่าเตียงนี้เป็นของ Klara'),
    ('Tom','Sofa','sein','โซฟา','เขา','Tom ติดป้ายชื่อไว้บนโซฟาที่นำมาจากบ้านเดิม')], 'sein; {possessive} {bare} = {thai}ของ{person}')
add('L15-D06', 'q1~Wie|v2~findest|s~du|o~{owner}s {bare}?',
    's1~Ich|v2~finde|o~{possessive_acc} {bare}|d~{adjective}.', 'เธอคิดว่า{thai}ของ {owner} เป็นอย่างไร', 'ฉันคิดว่า{thai}ของ{person}{quality}',
    ['owner','bare','possessive_acc','thai','person','adjective','quality','scene'], [
    ('Tom','Sessel','seinen','เก้าอี้นวม','เขา','schön','สวย','A เป็นเพื่อนของ Tom และถาม B ซึ่งเป็นเพื่อนอีกคนเกี่ยวกับเก้าอี้นวมของ Tom; Tom ไม่ได้ร่วมบทสนทนา'),
    ('Klara','Schrank','ihren','ตู้','เธอ','praktisch','ใช้งานสะดวก','A และ B เป็นเพื่อนของ Klara กำลังคุยถึงตู้ของ Klara ซึ่งจัดของได้สะดวก; Klara ไม่ได้ร่วมบทสนทนา'),
    ('Tom','Lampe','seine','โคมไฟ','เขา','schön','สวย','A ถาม B เรื่องโคมไฟดวงใหม่ของ Tom; ทั้งสองเป็นเพื่อนของ Tom และ Tom ไม่ได้ร่วมบทสนทนา'),
    ('Klara','Tisch','ihren','โต๊ะ','เธอ','zu groß','ใหญ่เกินไป','A ถาม B เรื่องโต๊ะของ Klara ซึ่งกินพื้นที่จนเดินไม่สะดวก; ทั้งสองไม่ใช่ Klara และ Klara ไม่ได้ร่วมบทสนทนา')], 'finden; {possessive_acc} {bare}; {adjective} = {quality}')
add('L15-D07', 'v1~Ist|s~{room}|m~noch|d~frei?',
    'f~Ja,|s1~{room}|v2~ist|m~noch|d~frei.', '{thai}ยังว่างอยู่ไหม', 'ใช่ {thai}ยังว่างอยู่',
    ['room','thai','scene'], [
    ('das Arbeitszimmer','ห้องทำงาน','ในสำนักงานร่วม ห้องทำงานยังไม่มีผู้จอง'),
    ('das Kinderzimmer','ห้องเด็ก','ครอบครัวกำลังจัดห้องและห้องเด็กยังว่างอยู่'),
    ('das Schlafzimmer','ห้องนอน','ที่พักแจ้งว่าห้องนอนนี้ยังไม่มีผู้เช่า'),
    ('die Wohnung','ห้องชุด','ประกาศห้องชุดที่ระบุยังเปิดรับผู้เช่าและไม่มีผู้จอง')], 'sein; {room}; noch frei = ยังว่าง')
add('L15-D08', 'q1~Was|v2~kostet|s~{room}|t~im Monat?',
    's1~{pronoun}|v2~kostet|o~{price} Euro|t~im Monat.', '{thai}ค่าเช่าเดือนละเท่าไร', 'ค่าเช่า{thai}เดือนละ {price} ยูโร',
    ['room','thai','pronoun','price','scene'], [
    ('die Wohnung','ห้องชุด','Sie','850','ประกาศห้องชุดรวมค่าใช้จ่ายไว้เดือนละ 850 ยูโร'),
    ('das Zimmer','ห้องนี้','Es','410','ห้องในบ้านพักนักเรียนประกาศค่าเช่ารวม 410 ยูโรต่อเดือน'),
    ('das Haus','บ้าน','Es','1200','เจ้าของบ้านเสนอค่าเช่ารวมเดือนละ 1200 ยูโร'),
    ('die Wohnung','ห้องชุด','Sie','730','ห้องชุดอีกแห่งแจ้งราคารวมเดือนละ 730 ยูโร')], 'kosten; {pronoun}; {price} Euro; im Monat = ต่อเดือน')

add('L16-D01', 'q1~Was|v2~ist|s~das Problem?',
    's1~{device_cap}|v2~funktioniert|n~nicht.', 'มีปัญหาอะไร', '{thai}ใช้งานไม่ได้',
    ['device_cap','thai','scene'], [
    ('Der Kühlschrank','ตู้เย็น','อาหารในตู้เย็นไม่เย็นและตรวจพบว่าเครื่องไม่ทำงาน'),
    ('Das Telefon','โทรศัพท์','พนักงานทดสอบโทรศัพท์แล้วโทรออกไม่ได้เพราะเครื่องไม่ทำงาน'),
    ('Die Heizung','เครื่องทำความร้อน','ห้องยังเย็นและช่างยืนยันว่าเครื่องทำความร้อนไม่ทำงาน'),
    ('Die Waschmaschine','เครื่องซักผ้า','กดเริ่มซักแล้วเครื่องไม่ทำงาน')], 'funktionieren; {device_cap}; nicht = ไม่')
# A fixed consent formula can transfer to a new situation, but this authoring does not
# claim three additional productive contexts from repeating the same fixed response.
add('L16-D02', 'v1~Brauchen|s~Sie|o~Hilfe?',
    'f~Ja,|s1~ich|v2~brauche|o~Ihre Hilfe.', 'คุณต้องการความช่วยเหลือไหม', 'ใช่ ฉันต้องการความช่วยเหลือจากคุณ',
    ['scene'], [('เจ้าของที่พักเสนอความช่วยเหลือหลังผู้เช่าแจ้งว่าไฟไม่ทำงาน และผู้เช่าต้องการให้ช่วยจริง',)], 'brauchen; Ihre Hilfe', limited=True)
add('L16-D03', 'q1~Was|a2~kann|s~ich|o~für Sie|iE~tun?',
    'a1~Können|s~Sie|o~{object}|iE~reparieren?', 'ฉันช่วยอะไรคุณได้บ้าง', 'คุณช่วยซ่อม{thai}ได้ไหม',
    ['object','thai','scene'], [
    ('den Fernseher','โทรทัศน์','ผู้เช่าต้องการให้ช่างซ่อมโทรทัศน์ที่เปิดไม่ติด'),
    ('die Dusche','ฝักบัว','ผู้เช่าต้องการให้ช่างซ่อมฝักบัวที่ใช้ไม่ได้'),
    ('die Klingel','กริ่ง','กริ่งหน้าห้องเสีย ผู้พักต้องการให้ซ่อมกริ่ง'),
    ('die Steckdose','เต้ารับไฟฟ้า','เต้ารับที่ระบุเสียและผู้พักขอให้ช่างซ่อม')], 'können; reparieren; {object}; Sie')
add('L16-D04', 'a1~Können|s~Sie|o~{object}|iE~reparieren?',
    'f~Ja,|o1~{object}|a2~kann|s~ich|iE~reparieren.', 'คุณซ่อม{thai}ได้ไหม', 'ได้ ฉันซ่อม{thai}ได้',
    ['object','thai','scene'], [
    ('den Kühlschrank','ตู้เย็น','ช่างตรวจตู้เย็นแล้วบอกว่ามีอะไหล่และซ่อมได้'),
    ('die Heizung','เครื่องทำความร้อน','ช่างตรวจอาการของเครื่องทำความร้อนแล้วรับว่าซ่อมได้'),
    ('das Telefon','โทรศัพท์','ช่างยืนยันว่าซ่อมโทรศัพท์เครื่องที่ส่งมาได้'),
    ('die Waschmaschine','เครื่องซักผ้า','ช่างพบสาเหตุของปัญหาเครื่องซักผ้าและรับซ่อมได้')], 'können; reparieren; {object}; ich')
add('L16-D05', 'q1~Wann|v2~haben|s~Sie|o~Zeit?',
    't1~Am {day} um {hour} Uhr|v2~habe|s~ich|o~Zeit.', 'คุณว่างเมื่อไร', 'ฉันว่าง{day_th} {hour} นาฬิกา',
    ['day','day_th','hour','scene'], [
    ('Mittwoch','วันพุธ','14','ช่างเปิดตารางนัดใหม่ พบว่าว่างวันพุธ 14:00'),
    ('Donnerstag','วันพฤหัสบดี','10','ผู้พักตรวจตารางเรียนแล้วว่างวันพฤหัสบดี 10:00'),
    ('Montag','วันจันทร์','9','เจ้าของบ้านมีช่วงว่างสำหรับนัดวันจันทร์ 09:00'),
    ('Samstag','วันเสาร์','11','ช่างที่รับงานวันหยุดมีเวลาว่างวันเสาร์ 11:00')], 'Zeit haben; am {day}; um {hour} Uhr')
add('L16-D06', 'q1~Wann|v2~kommen|s~Sie?',
    's1~Ich|v2~komme|t~in {duration}.', 'คุณจะมาเมื่อไร', 'ฉันจะมาอีก{duration_th}',
    ['duration','duration_th','scene'], [
    ('zwei Stunden','สองชั่วโมง','ตอนนี้ 08:00 ผู้ที่จะมาระบุเวลาเดินทางถึง 10:00'),
    ('drei Stunden','สามชั่วโมง','ตอนนี้ 09:00 และตกลงว่าจะมาถึง 12:00'),
    ('einer halben Stunde','ครึ่งชั่วโมง','ตอนนี้ 14:00 และข้อความยืนยันว่าจะมาถึง 14:30'),
    ('vier Stunden','สี่ชั่วโมง','ตอนนี้ 10:00 และเวลาที่ผู้มาตกลงไว้คือ 14:00')], 'kommen; in {duration} = อีก{duration_th}')
add('L16-D07', 'v1~Haben|s~Sie|t~am {day}|o~Zeit?',
    't1~Am {day}|a2~kann|s~ich|m~leider|n~nicht.', 'คุณว่าง{day_th}ไหม', '{day_th}ฉันไม่สะดวกจริง ๆ',
    ['day','day_th','scene'], [
    ('Dienstag','วันอังคาร','มีเรียนเต็มวันอังคาร จึงรับนัดวันนั้นไม่ได้'),
    ('Donnerstag','วันพฤหัสบดี','มีนัดงานตลอดวันพฤหัสบดี จึงไม่ว่างวันนั้น'),
    ('Montag','วันจันทร์','ต้องเดินทางวันจันทร์ จึงไปตามนัดไม่ได้'),
    ('Samstag','วันเสาร์','ทำงานทั้งวันเสาร์และรับนัดเพิ่มไม่ได้')], 'können; am {day}; leider nicht = ไม่สะดวกจริง ๆ')
add('L16-D08', 'a1~Können|s~wir|o~den Termin|iE~verschieben?',
    'f~Ja,|t1~nach {event} am {day}|v2~habe|s~ich|o~Zeit.', 'เราเลื่อนนัดได้ไหม', 'ได้ ฉันว่าง{day_th}หลัง{event_th}',
    ['event','event_th','day','day_th','scene'], [
    ('dem Unterricht','เรียน','Dienstag','วันอังคาร','ผู้ตอบตกลงเลื่อนนัด และตารางระบุช่วงว่างหลังเรียนวันอังคาร'),
    ('der Arbeit','เลิกงาน','Mittwoch','วันพุธ','คู่สนทนาเลือกนัดใหม่หลังเลิกงานวันพุธ'),
    ('dem Kurs','จบคอร์สเรียน','Freitag','วันศุกร์','ผู้ตอบมีเวลาหลังคอร์สวันศุกร์และตกลงใช้ช่วงนั้น'),
    ('der Arbeit','เลิกงาน','Donnerstag','วันพฤหัสบดี','นัดเดิมยกเลิกและผู้ตอบเสนอช่วงหลังเลิกงานวันพฤหัสบดี')], 'Zeit haben; nach {event}; am {day}')

add('L17-D01', 'q1~Was|a2~willst|s~du|iE~werden?',
    's1~Ich|a2~will|o~{profession}|iE~werden.', 'เธออยากเป็นอะไร', 'ฉันอยากเป็น{thai}',
    ['profession','thai','scene'], [
    ('Schauspielerin','นักแสดงหญิง','ผู้ตอบเลือกงานแสดงเป็นอาชีพที่อยากทำ ไม่ได้เลือกงานการเมือง'),
    ('Chef','หัวหน้าหรือผู้บริหารชาย','ผู้ตอบต้องการทำงานเป็นหัวหน้าหรือผู้บริหารชาย'),
    ('Politikerin','นักการเมืองหญิง','ผู้ตอบเลือกอาชีพนักการเมืองหญิงเป็นแผนของตัวเอง'),
    ('Lehrerin','ครูผู้หญิง','ผู้ตอบอยากสอนหนังสือและตั้งใจเป็นครูผู้หญิง')], 'wollen; {profession} werden = เป็น{thai}')
add('L17-D02', 'q1~Wann|a2~willst|s~du|o~die Ausbildung|iE~machen?',
    's1~Ich|a2~will|t~{time}|o~eine Ausbildung|iE~machen.', 'เธออยากเริ่มการฝึกวิชาชีพเมื่อไร', 'ฉันอยากเริ่มการฝึกวิชาชีพ{time_th}',
    ['time','time_th','scene'], [
    ('im September','เดือนกันยายน','ผู้ตอบเลือกเดือนกันยายนในปฏิทินสำหรับเริ่มฝึกวิชาชีพ'),
    ('in zwei Monaten','อีกสองเดือน','ผู้ตอบมีแผนเริ่มฝึกวิชาชีพหลังจากนี้สองเดือน'),
    ('nächsten Monat','เดือนหน้า','ผู้ตอบยืนยันว่าจะเริ่มฝึกวิชาชีพในเดือนหน้า'),
    ('im Januar','เดือนมกราคม','แผนใหม่ของผู้ตอบระบุเดือนมกราคมเป็นเดือนเริ่มฝึกวิชาชีพ')], 'wollen; eine Ausbildung machen; {time} = {time_th}')
add('L17-D03', 'q1~Was|a2~willst|s~du|t~später|iE~machen?',
    's1~Ich|a2~will|{activity}.', 'ต่อไปเธออยากทำอะไร', 'ฉันอยาก{thai}',
    ['activity','thai','lex','scene'], [
    ('o~einen Blog|iE~schreiben','เขียนบล็อก','einen Blog schreiben','ผู้ตอบเลือกการเขียนบล็อกเป็นแผนในอนาคต'),
    ('o~eine Familie|iE~haben','มีครอบครัว','eine Familie haben','ผู้ตอบระบุว่าความตั้งใจในอนาคตคือมีครอบครัว'),
    ('o~viele Fremdsprachen|iE~lernen','เรียนภาษาต่างประเทศหลายภาษา','viele Fremdsprachen lernen','ผู้ตอบต้องการใช้อนาคตเพื่อเรียนรู้หลายภาษา'),
    ('l~durch Europa|iE~reisen','ท่องเที่ยวทั่วยุโรป','durch Europa reisen','ผู้ตอบวางแผนเดินทางทั่วยุโรปแทนการอยู่บ้าน')], 'wollen; {lex} = {thai}')
add('L17-D04', 'q1~Was|a2~möchtest|s~du|m~noch|iE~machen?',
    's1~Ich|a2~will|{activity}.', 'เธอยังอยากทำอะไรอีก', 'ฉันอยาก{thai}',
    ['activity','thai','lex','scene'], [
    ('o~ein Instrument|iE~lernen','เรียนเครื่องดนตรีสักชนิด','ein Instrument lernen','หลังเล่าความฝันหนึ่งอย่าง ผู้ตอบเพิ่มความฝันเรื่องการเรียนดนตรี'),
    ('l~auf einen Berg|iE~steigen','ขึ้นภูเขา','auf einen Berg steigen','ผู้ตอบเพิ่มความฝันที่จะเดินขึ้นภูเขาสักครั้ง'),
    ('o~den Führerschein|iE~machen','ทำใบขับขี่','den Führerschein machen','ผู้ตอบเพิ่มแผนทำใบขับขี่จากแผนที่เล่าไปแล้ว'),
    ('l~um die Welt|iE~segeln','แล่นเรือใบรอบโลก','um die Welt segeln','ผู้ตอบเพิ่มความฝันเรื่องการเดินทางรอบโลกด้วยเรือใบ')], 'wollen; {lex} = {thai}')
add('L17-D05', 'q1~Was|a2~willst|s~du|m~unbedingt|iE~machen?',
    's1~Ich|a2~will|m~unbedingt|{activity}.', 'เธออยากทำอะไรมากเป็นพิเศษ', 'ฉันตั้งใจอยาก{thai}มากเป็นพิเศษ',
    ['activity','thai','lex','scene'], [
    ('o~eine Familie|iE~haben','มีครอบครัว','eine Familie haben','ผู้ตอบย้ำว่าการมีครอบครัวเป็นสิ่งที่ตั้งใจอยากทำมากที่สุด'),
    ('o~den Führerschein|iE~machen','ทำใบขับขี่','den Führerschein machen','ผู้ตอบยืนยันอย่างหนักแน่นว่าอยากทำใบขับขี่'),
    ('o~Schauspieler|iE~werden','เป็นนักแสดงชาย','Schauspieler werden','เป้าหมายสำคัญมากของผู้ตอบคือการเป็นนักแสดงชาย'),
    ('l~im Ausland|iE~leben','อาศัยอยู่ต่างประเทศ','im Ausland leben','ผู้ตอบย้ำว่าการอยู่ต่างประเทศคือสิ่งที่อยากทำมากเป็นพิเศษ')], 'wollen; unbedingt = อย่างแน่วแน่; {lex} = {thai}')
add('L17-D06', 'q1~Was|a2~willst|s~du|m~auf keinen Fall|iE~machen?',
    's1~Ich|a2~will|m~auf keinen Fall|{activity}.', 'เธอไม่อยากทำอะไรแน่นอน', 'ฉันไม่อยาก{thai}อย่างแน่นอน',
    ['activity','thai','lex','scene'], [
    ('o~Chef|iE~werden','เป็นหัวหน้าหรือผู้บริหารชาย','Chef werden','ผู้ตอบยืนยันว่าไม่ต้องการรับบทบาทผู้บริหารชายอย่างแน่นอน'),
    ('o~Motorrad|iE~fahren','ขี่รถจักรยานยนต์','Motorrad fahren','ผู้ตอบตัดการขี่รถจักรยานยนต์ออกจากแผนโดยเด็ดขาด'),
    ('l~um die Welt|iE~segeln','แล่นเรือใบรอบโลก','um die Welt segeln','ผู้ตอบยืนยันว่าไม่อยากเดินทางรอบโลกด้วยเรือใบ'),
    ('l~im Ausland|iE~leben','อาศัยอยู่ต่างประเทศ','im Ausland leben','ผู้ตอบอยากอยู่ในประเทศและยืนยันว่าไม่อยากไปอยู่ต่างประเทศ')], 'wollen; auf keinen Fall = ไม่อย่างแน่นอน; {lex} = {thai}')
add('L17-D07', 'q1~Mit wem|v2~kommst|s~du?',
    's1~Ich|v2~komme|o~mit {companion}.', 'เธอมากับใคร', 'ฉันมากับ{thai}',
    ['companion','thai','scene'], [
    ('meiner Schwester','พี่สาวหรือน้องสาวของฉัน','ผู้ตอบจะมางานพร้อมพี่สาวหรือน้องสาวของตัวเอง'),
    ('meinem Bruder','พี่ชายหรือน้องชายของฉัน','ผู้ตอบนัดพี่ชายหรือน้องชายให้มาด้วยกัน'),
    ('einer Freundin','เพื่อนผู้หญิงหนึ่งคน','ผู้ตอบมีเพื่อนผู้หญิงหนึ่งคนเดินทางมาด้วย'),
    ('meiner Familie','ครอบครัวของฉัน','ผู้ตอบจะเดินทางมางานพร้อมครอบครัว')], 'kommen; mit {companion} = กับ{thai}')
add('L17-D08', 'a1~Könnt|s~ihr|o~ohne {resource}|iE~anfangen?',
    'f~Nein,|o1~ohne {resource}|a2~können|s~wir|n~nicht|iE~anfangen.', 'พวกเธอเริ่มโดยไม่มี{thai}ได้ไหม', 'ไม่ได้ พวกเราเริ่มโดยไม่มี{thai}ไม่ได้',
    ['resource','thai','scene'], [
    ('ein Instrument','เครื่องดนตรี','กลุ่มดนตรีต้องใช้เครื่องดนตรีจึงเริ่มกิจกรรมได้ แต่ตอนนี้ยังไม่มี'),
    ('den Führerschein','ใบขับขี่','งานนี้กำหนดว่าต้องมีใบขับขี่จึงเริ่มได้ และกลุ่มยังไม่มี'),
    ('eine Ausbildung','การฝึกวิชาชีพ','งานเฉพาะทางนี้รับผู้ผ่านการฝึกวิชาชีพเท่านั้น จึงเริ่มโดยไม่มีไม่ได้'),
    ('einen Plan','แผน','กลุ่มตกลงว่าต้องมีแผนก่อนเริ่มงาน แต่ตอนนี้ยังไม่มีแผนจึงเริ่มไม่ได้')], 'können; anfangen; ohne {resource}; nicht = ไม่')

add('L18-D01', 'q1~Was|v2~tut|o~Ihnen|xE~weh?',
    's1~Mein {body}|v2~tut|xE~weh.', 'คุณเจ็บตรงไหน', 'ฉันปวด{thai}',
    ['body','thai','scene'], [
    ('Arm','แขน','ผู้ตอบชี้ที่แขนและระบุว่าปวดที่แขนเพียงตำแหน่งเดียว'),
    ('Fuß','เท้า','ผู้ตอบบอกว่าเจ็บที่เท้า ไม่ใช่หลังหรือแขน'),
    ('Bauch','ท้อง','ผู้ตอบระบุว่าปวดบริเวณท้อง'),
    ('Kopf','ศีรษะ','ผู้ตอบบอกอาการปวดที่ศีรษะ')], 'wehtun; mein {body} = {thai}ของฉัน')
add('L18-D02', 'v1~Haben|s~Sie|o~Fieber?',
    'f~Nein,|s1~ich|v2~habe|o~{symptom}.', 'คุณมีไข้ไหม', 'ไม่มีไข้ ฉันมี{thai}',
    ['symptom','thai','scene'], [
    ('Schnupfen','น้ำมูก','อุณหภูมิร่างกายปกติ ผู้ตอบมีน้ำมูกแต่ไม่มีไข้'),
    ('Kopfschmerzen','อาการปวดศีรษะ','ไม่มีไข้ แต่อาการที่ผู้ตอบรายงานคือปวดศีรษะ'),
    ('Halsschmerzen','อาการเจ็บคอ','ผู้ตอบยืนยันว่าไม่มีไข้ มีเพียงอาการเจ็บคอ'),
    ('Ohrenschmerzen','อาการปวดหู','ผู้ตอบตรวจแล้วไม่มีไข้ แต่อาการที่ต้องรายงานคือปวดหู')], '{symptom} haben = มี{thai}; Nein = ไม่')
add('L18-D03', 'q1~Was|a2~soll|s~ich|iE~machen?',
    '{imperative}|s~Sie|b~bitte|{content}.', 'ฉันควรทำอะไรตามที่บอก', 'กรุณา{thai}',
    ['imperative','content','thai','lex','scene'], [
    ('v1~Trinken','o~viel Wasser','ดื่มน้ำมาก ๆ','trinken; viel Wasser','ข้อความของผู้ให้คำแนะนำในเรื่องนี้ระบุให้ดื่มน้ำมาก ๆ'),
    ('v1~Gehen','l~nach Hause','กลับบ้าน','gehen; nach Hause','ข้อความคำแนะนำในบทสนทนาระบุให้กลับบ้าน'),
    ('v1~Nehmen','o~die Tablette','รับประทานยาเม็ดที่ระบุ','nehmen; die Tablette','ในสถานการณ์สมมติ ผู้ให้คำแนะนำระบุให้รับประทานยาเม็ดที่ระบุ'),
    ('v1~Machen','o~diese Übung','ทำแบบฝึกนี้','machen; diese Übung','ข้อความสมมติของผู้สอนระบุให้ทำแบบฝึกที่ชี้ไว้')], '{lex}; Sie; bitte')
add('L18-D04', 'a1~Können|s~Sie|o~das|b~bitte|iE~wiederholen?',
    'f~Ja, natürlich.', 'กรุณาพูดซ้ำได้ไหม', 'ได้ แน่นอน',
    ['scene'], [('ผู้ฟังฟังเวลานัดไม่ทันจึงขอให้พูดซ้ำ ผู้พูดยินดีพูดซ้ำและไม่ได้ปฏิเสธคำขอ',)], 'ja; natürlich', limited=True)
add('L18-D05', 'v1~Spreche|s~ich|m~{manner}?',
    'v1~Sprechen|s~Sie|b~bitte|m~{request}.', 'ฉันพูด{manner_th}ไหม', 'กรุณาพูด{request_th}',
    ['manner','manner_th','request','request_th','scene'], [
    ('zu leise','เบาเกินไป','laut','ดัง ๆ','ผู้ฟังอยู่ไกลและได้ยินเสียงเบามาก ผู้พูดถามว่าเบาไปไหม'),
    ('zu schnell','เร็วเกินไป','langsam','ช้า ๆ','ผู้ฟังตามประกาศเวลาไม่ทันและต้องการให้พูดช้าลง'),
    ('zu laut','ดังเกินไป','leise','เบา ๆ','ผู้ฟังอยู่ในห้องสมุดและขอให้ผู้พูดลดเสียง'),
    ('undeutlich','ไม่ชัด','deutlich','ชัด ๆ','ระหว่างโทรศัพท์ ผู้ฟังแยกคำไม่ออกและต้องการให้ผู้พูดออกเสียงชัดขึ้น')], 'sprechen; Sie; bitte; {request} = {request_th}')
add('L18-D06', 'a1~Soll|s~ich|t~{day}|iE~kommen?',
    'f~Ja,|v1~kommen|s~Sie|t~{day} um {hour} Uhr.', 'ฉันต้องมา{day_th}ตามที่บอกใช่ไหม', 'ใช่ กรุณามา{day_th} {hour_th} นาฬิกา',
    ['day','day_th','hour','hour_th','scene'], [
    ('am Montag','วันจันทร์','neun','9','ข้อความยืนยันนัดในเรื่องระบุวันจันทร์ 09:00'),
    ('am Dienstag','วันอังคาร','elf','11','เจ้าหน้าที่ในบทสนทนายืนยันเวลานัดวันอังคาร 11:00'),
    ('morgen','พรุ่งนี้','acht','8','ใบนัดสมมติระบุให้มาพรุ่งนี้ 08:00'),
    ('am Freitag','วันศุกร์','zehn','10','ผู้ตอบต้องยืนยันข้อความนัดวันศุกร์ 10:00')], 'kommen; Sie; {day}; um {hour} Uhr')
add('L18-D07', 'q1~Was|a2~hat|s~die Ärztin|pE~gesagt?',
    's1~Ich|a2~soll|{content}.', 'แพทย์หญิงบอกว่าอย่างไร', 'ฉันต้อง{thai}ตามที่บอก',
    ['content','thai','lex','scene'], [
    ('o~viel Wasser|iE~trinken','ดื่มน้ำมาก ๆ','viel Wasser trinken','ในบทสนทนาสมมติ แพทย์หญิงพูดว่า Trinken Sie viel Wasser.'),
    ('o~die Tablette|iE~nehmen','รับประทานยาเม็ดที่ระบุ','die Tablette nehmen','ข้อความสมมติของแพทย์หญิงคือ Nehmen Sie die Tablette.'),
    ('o~eine Pause|iE~machen','พักสักครู่','eine Pause machen','ในเรื่องนี้แพทย์หญิงพูดว่า Machen Sie eine Pause.'),
    ('t~morgen|iE~kommen','มาพรุ่งนี้','morgen kommen','ข้อความนัดหมายจากแพทย์หญิงในเรื่องคือ Kommen Sie morgen.')], 'sollen; {lex} = {thai}')
add('L18-D08', 'q1~Wer|v2~sagt|o~das?',
    's1~{person}|v2~sagt|o~das.', 'ใครเป็นคนบอกอย่างนั้น', '{person_th}เป็นคนบอกอย่างนั้น',
    ['person','person_th','scene'], [
    ('Meine Ärztin','แพทย์หญิงของฉัน','ข้อความนัดในเรื่องมาจากแพทย์หญิงของผู้ตอบ'),
    ('Mein Lehrer','ครูผู้ชายของฉัน','ข้อความให้ทำแบบฝึกนี้มาจากครูผู้ชายของผู้ตอบ'),
    ('Meine Mutter','แม่ของฉัน','ข้อความให้กลับบ้านในบทสนทนามาจากแม่ของผู้ตอบ'),
    ('Mein Vater','พ่อของฉัน','ข้อความเวลานัดในครอบครัวมาจากพ่อของผู้ตอบ')], 'sagen; {person} = {person_th}; das = เรื่องนั้น')


def annotated(template, values):
    sentences = []
    for sentence in template.format(**values).split(' / '):
        parts = []
        for group in sentence.split('|'):
            code, text = group.split('~', 1)
            role, label = ROLES[code[0]]
            part = dict(text=text, role=role, label=label)
            if code[-1:] in ('1', '2'): part['position'] = 'ตำแหน่ง ' + code[-1]
            elif code.endswith('E'): part['position'] = 'ท้ายประโยค'
            parts.append(part)
        sentences.append(parts)
    text = ' '.join(' '.join(part['text'] for part in row) for row in sentences)
    return text, sentences


def punctuated(values):
    answers = []
    for value in values:
        for answer in (value, value.rstrip('.!?')):
            if answer not in answers: answers.append(answer)
    return answers


def paraphrases(spec, row, text):
    alternatives = [text]
    # These are grammatical variants within the same constrained communicative act.
    if spec['id'] == 'L16-D03':
        alternatives += ['Können Sie bitte %s reparieren?' % row['object'],
                         'Können Sie %s bitte reparieren?' % row['object']]
    elif spec['id'] in ('L18-D03', 'L18-D05'):
        alternatives.append(text.replace(' bitte ', ' ').rstrip('.') + ', bitte.')
    elif spec['id'] == 'L18-D06':
        alternatives.append(text.replace('kommen Sie ', 'kommen Sie bitte '))
    elif spec['id'] == 'L15-D08':
        alternatives.append('%s kostet im Monat %s Euro.' % (row['pronoun'], row['price']))
    elif spec['id'] == 'L17-D02':
        alternatives.append('Ich will eine Ausbildung %s machen.' % row['time'])
    elif spec['id'] in ('L17-D05','L17-D06'):
        activity = [part.split('~',1)[1] for part in row['activity'].split('|')]
        modifier = 'unbedingt' if spec['id'] == 'L17-D05' else 'auf keinen Fall'
        alternatives.append('Ich will %s %s %s.' % (' '.join(activity[:-1]), modifier, activity[-1]))
    elif spec['id'] == 'L18-D01':
        alternatives.append(text.replace(' tut weh.', ' tut mir weh.'))
    return alternatives


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source-root', required=True, type=Path)
    parser.add_argument('--output-root', type=Path, default=Path(__file__).resolve().parents[2])
    args = parser.parse_args()
    source_root, output_root = args.source_root.resolve(), args.output_root.resolve()
    lessons = {}
    originals = {}
    for number in range(15, 19):
        lesson = json.loads((source_root / ('docs/lesson-preparation/l%d-content.json' % number)).read_text())
        lessons[lesson['id']] = lesson
        for dialogue in lesson['phrases']: originals[dialogue['id']] = dialogue
    assert set(originals) == {spec['id'] for spec in SPECS}
    original_ids = {task['id'] for lesson in lessons.values() for task in lesson['practiceCandidates']}
    manifests, payload, records, omissions = {}, [], [], []

    def audio(text, speaker):
        voice = 'de-DE-KatjaNeural' if speaker == 'A' else 'de-DE-ConradNeural'
        key = 'PPI-' + hashlib.sha256((voice + '\n' + text).encode()).hexdigest()[:24]
        manifests[key] = dict(id=key, kind='dialogue_turn_audio', text=text, voice=voice, status='not_generated')
        return key

    def models(spec, row):
        result = []
        for speaker, key, meaning_key in [('A','a','am'), ('B','b','bm')]:
            text, sentences = annotated(spec[key], row)
            result.append(dict(text=text, meaning=spec[meaning_key].format(**row), sentences=sentences,
                               speaker=speaker, audio=audio(text, speaker)))
        return result

    for lesson_id in lessons:
        tasks = []
        for spec in [s for s in SPECS if s['id'].startswith(lesson_id)]:
            dialogue = originals[spec['id']]
            original_tasks = [t for t in lessons[lesson_id]['practiceCandidates'] if t.get('contextId') == spec['id']]
            by_speaker = {t['responseSpeaker']: t for t in original_tasks}
            assert set(by_speaker) == {'A','B'}
            for index, row in enumerate(spec['rows']):
                examples = models(spec, row)
                question, reply = examples
                if index == 0: stages = [('transfer-A', 1, 'A'), ('transfer-B', 1, 'B')]
                elif index < 3: stages = [('supported-%d-B' % index, 2, 'B')]
                else: stages = [('sentence-B', 3, 'B')]
                context_id = spec['id'] + '-scenario-%02d' % (index + 1)
                for suffix, stage, speaker in stages:
                    original = by_speaker[speaker]
                    target = original['targetId']
                    subskill = original['subskill'] if stage == 1 else 'phrase_bounded_production'
                    kind = original['kind'] if stage == 1 else 'write'
                    selected = question if speaker == 'A' else reply
                    first = next(part['text'].rstrip('.!?') for part in selected['sentences'][0] if part.get('position') == 'ตำแหน่ง 1') if speaker == 'A' else selected['sentences'][0][0]['text'].rstrip('.!?')
                    if speaker == 'B' and selected['sentences'][0][0]['role'] == 'other' and selected['sentences'][0][0]['text'] in ('Ja,','Nein,'):
                        initial = next(part['text'].rstrip('.!?') for part in selected['sentences'][0] if part.get('position') == 'ตำแหน่ง 1')
                        first += ' ' + initial
                    cue = reply['text'] if speaker == 'A' else question['text']
                    notes = []
                    if stage >= 2:
                        cue = 'คำที่กำหนด: ' + spec['lemmas'].format(**row)
                        if stage == 2: cue = 'โครงเริ่มต้น: ' + first + ' ___; ' + cue
                        notes = ['supplied-lexical-groups', 'required-lemma', 'provided-start']
                        if stage == 2: notes.append('provided-sentence-start-frame')
                    context = [['สถานการณ์', row['scene']], ['ข้อมูลที่ต้องสื่อ', reply['meaning']]]
                    if stage == 1: context.append(['คำช่วย (ให้ไว้ ไม่ประเมินการจำคำ)', spec['lemmas'].format(**row)])
                    # The whole task is about the given story, not advice to a real patient.
                    if lesson_id == 'L18' and spec['id'] in ('L18-D03','L18-D06','L18-D07'):
                        context.append(['บทบาท', 'ถ่ายทอดข้อความที่กำหนดในบทสนทนานี้'])
                    options, errors = [], []
                    if kind == 'choice':
                        if spec['limited']:
                            wrong = [('Nein, ich brauche keine Hilfe.', 'ไม่ต้องการความช่วยเหลือ'), ('Nein, danke.', 'ปฏิเสธความช่วยเหลือ')] if spec['id'] == 'L16-D02' else [('Nein, leider nicht.', 'ปฏิเสธการพูดซ้ำ'), ('Tut mir leid, ich habe keine Zeit.', 'บอกว่าไม่มีเวลาพูดซ้ำ')]
                            for text, meaning in wrong:
                                errors.append(dict(response=text, category='communicative_intent', message='คำตอบนี้%s แต่ในเรื่องผู้ตอบ%s' % (meaning, 'ต้องการความช่วยเหลือ' if spec['id'] == 'L16-D02' else 'ยินดีพูดซ้ำ')))
                            wrong_texts = [entry[0] for entry in wrong]
                        else:
                            wrong_texts = []
                            for other in spec['rows'][1:]:
                                other_models = models(spec, other)
                                wrong_reply = other_models[1]
                                if wrong_reply['text'] != reply['text'] and wrong_reply['text'] not in wrong_texts:
                                    wrong_texts.append(wrong_reply['text'])
                                    errors.append(dict(response=wrong_reply['text'], category='context_fact', message='คำตอบนี้สื่อว่า “%s” แต่ข้อมูลของสถานการณ์นี้คือ “%s”' % (wrong_reply['meaning'], reply['meaning'])))
                                if len(wrong_texts) == 2: break
                            assert len(wrong_texts) == 2, spec['id']
                        options = [wrong_texts[0], reply['text'], wrong_texts[1]]
                    if stage >= 2:
                        for other in spec['rows']:
                            if other is row: continue
                            wrong_reply = models(spec, other)[1]
                            if wrong_reply['text'] == reply['text']: continue
                            for response in punctuated([wrong_reply['text']]):
                                errors.append(dict(response=response, category='context_fact', message='คำตอบนี้สื่อว่า “%s” แต่ข้อมูลที่ต้องสื่อในข้อนี้คือ “%s”' % (wrong_reply['meaning'], reply['meaning'])))
                            if len(errors) >= 4: break
                    answers = [selected['text']] if stage == 1 else punctuated(paraphrases(spec, row, selected['text']))
                    tokens = selected['text'].split() if kind == 'order' else []
                    random.Random(spec['id'] + suffix).shuffle(tokens)
                    if stage == 1:
                        assistance = ['provided-context', 'supplied-lexical-gloss', 'optional-prior-model'] + (['supplied-words', 'provided-start'] if kind == 'order' else ['reply-options'])
                        rationale = 'ใช้หน้าที่เดิมกับข้อมูลใหม่ที่ต้องอ่านให้ตรงสถานการณ์; %s จึงไม่เป็นหลักฐานการผลิตภาษาอิสระ' % ('ให้คำครบเพื่อจัดลำดับ' if kind == 'order' else 'มีตัวเลือกที่ต่างกันตามข้อเท็จจริงหรือเจตนา')
                        unlock = dict(subskill=original['subskill'], minCorrectContexts=0, minPracticeSessions=0, requiresAttempt=True)
                    else:
                        assistance = ['provided-context', 'optional-prior-model'] + notes
                        rationale = 'เขียนคำตอบทั้งประโยคจากข้อมูลใหม่ โดย%s; ตรวจเฉพาะการผลิตแบบจำกัดขอบเขต ไม่ใช่การเขียนอิสระ' % ('ให้โครงเริ่มต้นและกลุ่มคำที่จำเป็น' if stage == 2 else 'ไม่มีคลังคำเรียง แต่ระบุคำหลักและคำเริ่มต้นเพื่อจำกัดคำตอบที่ตรวจได้')
                        unlock = dict(subskill=by_speaker['B']['subskill'] if stage == 2 else 'phrase_bounded_production', minCorrectContexts=2, minPracticeSessions=2, requiresAttempt=False)
                    finite = next((p for p in selected['sentences'][0] if p['role'] in ('verb','auxiliary') and p.get('position') in ('ตำแหน่ง 1','ตำแหน่ง 2')), None)
                    if speaker == 'A':
                        reason = 'คำถามนี้ใช้ถามว่า “%s”' % question['meaning']
                    else: reason = 'ข้อมูลระบุว่า “%s” จึงใช้คำตอบนี้' % reply['meaning']
                    if finite: reason += '; %s อยู่%sในประโยคนี้' % (finite['text'], finite['position'])
                    end = [p['text'].rstrip('.!?') for p in selected['sentences'][0] if p.get('position') == 'ท้ายประโยค']
                    if end: reason += ' และ %s อยู่ท้ายประโยค' % ' '.join(end)
                    prompt = ('เรียงคำถาม A ให้ตรงกับสถานการณ์' if speaker == 'A' else 'เรียงคำตอบ B ให้ตรงกับข้อมูล') if kind == 'order' else 'เลือกคำตอบ B ที่ตรงกับข้อมูลและเจตนา' if kind == 'choice' else 'เขียนคำตอบ B ทั้งประโยคตามข้อมูล ใช้คำที่กำหนดและเริ่มด้วย %s; ไม่เพิ่มประโยคอื่น' % first
                    task_id = spec['id'] + '-context-' + suffix + '-v1'
                    task = dict(id=task_id, version=1, targetId=target, subskill=subskill,
                                difficulty=(original['difficulty'] if stage == 1 else stage), difficultyRationale=rationale,
                                requiredCardIds=[spec['id']], kind=kind, prompt=prompt, cue=cue, context=context,
                                options=options, tokens=tokens, startWith=first if kind in ('order','write') else '',
                                acceptedAnswers=answers, assistance=assistance,
                                feedback=dict(reason=reason, models=examples, errors=errors), noun=None,
                                articleTarget=False, spelling=False,
                                practice=dict(familyId=spec['id'] + '-' + target, contextId=context_id,
                                              stage=stage, unlock=unlock))
                    tasks.append(task)
                    records.append(dict(taskId=task_id, originalCardId=spec['id'], originalResponseTarget=target,
                                        contextId=context_id, stage=stage, provenance='product-authored',
                                        lexicalSupport='Provided German lemma/chunks are assistance and not independent lexical/Artikel evidence'))
            if spec['limited']:
                omissions.append(dict(dialogueId=spec['id'], omittedStages=[2,3], omittedTasks=3,
                    reason='The taught reply is a short fixed consent formula. Inventing three extra productive variants would either repeat the same linguistic evidence or assess added untaught sentence structure. Only a genuinely new contextual transfer is authored.'))
        payload.append(dict(lessonId=lesson_id, skill='phrases', tasks=tasks))
    all_tasks = [t for course in payload for t in course['tasks']]
    assert len(all_tasks) == 154
    assert len({t['id'] for t in all_tasks}) == len(all_tasks)
    assert not original_ids.intersection(t['id'] for t in all_tasks)
    assert Counter(t['practice']['stage'] for t in all_tasks) == {1:64, 2:60, 3:30}
    for task in all_tasks:
        assert task['practice']['unlock'] is not None
        assert all(answer.startswith(task['startWith']) for answer in task['acceptedAnswers']) if task['kind']=='write' else True
        if task['kind'] == 'choice':
            assert task['acceptedAnswers'][0] in task['options'] and len(set(task['options'])) == 3
            assert {e['response'] for e in task['feedback']['errors']} == set(task['options']) - set(task['acceptedAnswers'])
        if task['kind'] == 'order': assert Counter(task['tokens']) == Counter(task['acceptedAnswers'][0].split())
        for example in task['feedback']['models']:
            assert example['text'] == ' '.join(' '.join(part['text'] for part in row) for row in example['sentences'])
            assert manifests[example['audio']]['text'] == example['text']
    folder = output_root / 'docs/lesson-preparation'
    folder.mkdir(parents=True, exist_ok=True)
    for name, value in [('phrase-practice-extensions.json', payload), ('phrase-practice-extension-audio.json', dict(assets=sorted(manifests.values(), key=lambda x:x['id']))), ('phrase-practice-extension-provenance.json', dict(version=1, origin='product-authored', status='authored_not_integrated_or_deployed', originalTaskCount=372, extensionTaskCount=len(all_tasks), dialogues=32, preservedOriginalIdsAndAnswers=True, omissions=omissions, assessmentRecords=records))]:
        (folder / name).write_text(json.dumps(value, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps(dict(tasks=len(all_tasks), stageCounts=dict(Counter(t['practice']['stage'] for t in all_tasks)), audioAssets=len(manifests), omittedTasks=6, byLesson={c['lessonId']:len(c['tasks']) for c in payload})))

if __name__ == '__main__': main()
