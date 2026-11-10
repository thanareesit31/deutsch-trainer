#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Preserve the 29 published L13 phrases; add supported one-target Learn models."""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[2]
seed=json.loads((R/'supabase/seed/catalog.json').read_text())
items=[x for x in seed['items'] if x.get('lessonId')=='L13' and x.get('skill')=='phrases']
catalog=json.loads((R/'src/data/l13-phrases-catalog.json').read_text())
def p(text,role,label,position=None):
 value=dict(text=text,role=role,label=label)
 if position:value['position']=position
 return value
def declaration(subject,verb,*rest):return [p(subject,'subject','ประธาน','ตำแหน่ง 1'),p(verb,'verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),*rest]
def existence(lead,tail):return [p(lead,'other','ส่วนขึ้นต้น','ตำแหน่ง 1'),p('gibt','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('es','subject','ประธาน'),p(tail,'other','สิ่งที่มีหรือไม่มี (Akkusativ)')]
annotations={}
def add(text,parts):annotations[text]=[parts]
for item in items:
 text=item['answer'];n=int(item['id'][-3:])
 if n in [1,2]:add(text,declaration('Berlin','gefällt',p('mir','other','ผู้ที่ชอบ (Dativ)'),*([p('sehr.','other','ระดับความชอบ')] if n==2 else []))) if n==2 else add(text,declaration('Berlin','gefällt',p('mir.','other','ผู้ที่ชอบ (Dativ)')))
 elif n==3:add(text,declaration('Das','gefällt',p('mir','other','ผู้ที่ชอบ (Dativ)'),p('besonders gut.','other','ระดับความชอบ')))
 elif n in [4,5,27]:
  obj='Berlin' if n==5 else 'die Stadt';ending={4:'toll.',5:'interessant.',27:'zu groß.'}[n]
  add(text,declaration('Ich','finde',p(obj,'other','สิ่งที่แสดงความเห็น (กรรม)'),p(ending,'other','ความเห็น')))
 elif n in [6,7]:add(text,declaration('Die Stadt','ist',p('einfach anders.' if n==6 else 'zu groß.','other','ลักษณะของเมือง')))
 elif n in [8,9]:add(text,declaration('Das','ist',p('super!' if n==8 else 'cool!','other','ความเห็น')))
 elif n==10:add(text,[p('Was','question','ถามสิ่งที่มี','ตำแหน่ง 1'),p('gibt','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('es','subject','ประธาน'),p('hier?','other','สถานที่')])
 elif n==11:add(text,existence('Hier','einen Park.'))
 elif n in [12,13,16]:add(text,declaration('Es','gibt',p({12:'viele Kirchen.',13:'auch ein Café.',16:'keine Altstadt.'}[n],'other','สิ่งที่มีหรือไม่มี (Akkusativ)')))
 elif n in [14,15,23]:add(text,existence('In der Nähe' if n==14 else 'Leider',{14:'auch einen See.',15:'keinen Hafen.',23:'keinen Fußballplatz.'}[n]))
 elif n==17:add(text,[p('Was','question','ถามสถานที่โปรด','ตำแหน่ง 1'),p('ist','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('Ihr Lieblingsort?','subject','ประธาน')])
 elif n==18:add(text,declaration('Mein Lieblingsort','ist',p('der Park.','other','สถานที่โปรด (Nominativ)')))
 elif n==19:add(text,declaration('Ich','liebe',p('die Natur.','other','สิ่งที่ชอบ (กรรม)')))
 elif n in [20,21]:add(text,[p('Dort','other','สถานที่','ตำแหน่ง 1'),p('kann','auxiliary','Modalverb (ผันแล้ว)','ตำแหน่ง 2'),p('man','subject','ประธาน'),*([p('auch','other','ข้อมูลเพิ่มเติม')] if n==21 else []),p('spazieren gehen.' if n==20 else 'angeln.','verb','กริยาหลัก · Infinitiv','ท้ายประโยค')])
 elif n==22:add(text,[p('Dort','other','สถานที่','ตำแหน่ง 1'),p('treffen','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('wir','subject','ประธาน'),p('Freunde.','other','บุคคลที่พบ (กรรม)')])
 elif n==24:add(text,[p('Wie','question','ถามความเห็น','ตำแหน่ง 1'),p('finden','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('Sie','subject','ประธาน'),p('Berlin?','other','สิ่งที่ถามความเห็น (กรรม)')])
 elif n==25:add(text,[p('Möchten','auxiliary','Modalverb (ผันแล้ว)','ตำแหน่ง 1'),p('Sie','subject','ประธาน'),p('Berlin','other','สถานที่ที่จะไป (กรรม)'),p('besuchen?','verb','กริยาหลัก · Infinitiv','ท้ายประโยค')])
 elif n==26:add(text,[p('Ich','subject','ประธานของประโยคนำ','ตำแหน่ง 1'),p('glaube,','verb','กริยาแสดงความคิด','ตำแหน่ง 2'),p('Berlin','subject','ประธานของข้อความที่คาดเดา','ตำแหน่ง 1 ในข้อความถัดมา'),p('ist','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2 ในข้อความถัดมา'),p('sehr interessant.','other','ความเห็นที่คาดเดา')])
 elif n in [28,29]:add(text,[p('Was','subject','สิ่งที่ถามถึง (ประธาน)','ตำแหน่ง 1'),p('gefällt' if n==28 else 'fehlt','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('Ihnen' if n==28 else 'Ihnen?','other','ผู้ที่ชอบ' if n==28 else 'ผู้ที่ขาดสิ่งนั้น'),*([p('besonders?','other','เน้นสิ่งที่ชอบเป็นพิเศษ')] if n==28 else [])])
 else:raise AssertionError(text)
extra={
 'Wie finden Sie die Stadt?':[p('Wie','question','ถามความเห็น','ตำแหน่ง 1'),p('finden','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('Sie','subject','ประธาน'),p('die Stadt?','other','สิ่งที่ถามความเห็น (กรรม)')],
 'Wie findest du das?':[p('Wie','question','ถามความเห็น','ตำแหน่ง 1'),p('findest','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('du','subject','ประธาน'),p('das?','other','สิ่งที่ถามความเห็น (กรรม)')],
 'Was mögen Sie?':[p('Was','question','ถามสิ่งที่ชอบ','ตำแหน่ง 1'),p('mögen','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('Sie?','subject','ประธาน')],
 'Was kann man dort machen?':[p('Was','question','ถามกิจกรรม','ตำแหน่ง 1'),p('kann','auxiliary','Modalverb (ผันแล้ว)','ตำแหน่ง 2'),p('man','subject','ประธาน'),p('dort','other','สถานที่'),p('machen?','verb','กริยาหลัก · Infinitiv','ท้ายประโยค')],
 'Was macht ihr dort?':[p('Was','question','ถามกิจกรรม','ตำแหน่ง 1'),p('macht','verb','กริยาหลัก (ผันแล้ว)','ตำแหน่ง 2'),p('ihr','subject','ประธาน'),p('dort?','other','สถานที่')],
 'Ja, gern.':[p('Ja, gern.','other','ตอบรับคำชวน')],
}
for text,parts in extra.items():add(text,parts)
contexts=[('ความรู้สึกต่อ Berlin','ชอบ'),('ความรู้สึกต่อ Berlin','ชอบมาก'),('B ชี้ไปที่สวน','ชอบสิ่งนี้เป็นพิเศษ'),('ความคิดเห็นต่อเมือง','เยี่ยมมาก'),('ความคิดเห็นต่อ Berlin','น่าสนใจ'),('เมื่อเทียบกับเมืองอื่น','แตกต่าง'),('ขนาดเมือง','ใหญ่เกินไป'),('ปฏิกิริยาของ B','เห็นด้วยอย่างชื่นชม'),('ปฏิกิริยาของ B','ชื่นชมแบบเป็นกันเอง'),('A ต้องการทราบ','สถานที่ที่มีอยู่แถวนี้'),('สถานที่มีอยู่','สวนสาธารณะ 1 แห่ง'),('สถานที่มีอยู่','โบสถ์หลายแห่ง'),('ข้อมูลเพิ่มเติม','มีคาเฟ่ด้วย'),('ใกล้จุดที่ยืน','มีทะเลสาบ'),('สถานที่ที่ขาดไป','ท่าเรือ'),('สถานที่ที่ขาดไป','ย่านเมืองเก่า'),('A ต้องการทราบ','สถานที่โปรดของ B'),('สถานที่โปรดของ B','สวนสาธารณะ'),('สิ่งที่ B ชอบ','ธรรมชาติ'),('กิจกรรมที่ทำได้','เดินเล่น'),('กิจกรรมเพิ่มเติม','ตกปลา'),('B กับเพื่อน','นัดพบกันที่นั่น'),('สถานที่ที่อยากมี','สนามฟุตบอล แต่ที่นี่ไม่มี'),('A ต้องการทราบ','ความคิดเห็นของ B ต่อ Berlin'),('A ต้องการ','ชวน B ไปเยือน Berlin'),('B ยังไม่เคยไป','คิดว่า Berlin น่าสนใจมาก'),('ความคิดเห็นของ B','เมืองใหญ่เกินไป'),('A ต้องการทราบ','สิ่งที่ B ชอบเป็นพิเศษ'),('A ต้องการทราบ','สิ่งที่ B รู้สึกว่ายังขาดไป')]
models=[]
for i,item in enumerate(items):
 n=i+1;answer=item['answer'];group=next(g for g in catalog['groups'] if item['id'] in g['ids'])
 response='A' if n in [10,17,24,25,28,29] else 'B'
 if response=='A':question=answer;reply={10:items[10]['answer'],17:items[17]['answer'],24:items[4]['answer'],25:'Ja, gern.',28:items[2]['answer'],29:items[22]['answer']}[n]
 else:
  question=items[23]['answer'] if n<=7 or n in [26,27] else 'Wie findest du das?' if n in [8,9] else items[9]['answer'] if n<=16 else items[16]['answer'] if n==18 else 'Was mögen Sie?' if n==19 else 'Was kann man dort machen?' if n in [20,21] else 'Was macht ihr dort?' if n==22 else items[28]['answer']
  reply=answer
 qmeaning=next((x['meaning'] for x in items if x['answer']==question),{'Wie findest du das?':'เธอคิดว่าเป็นอย่างไร','Was mögen Sie?':'คุณชอบอะไร','Was kann man dort machen?':'ที่นั่นทำอะไรได้บ้าง','Was macht ihr dort?':'พวกเธอทำอะไรที่นั่น','Wie finden Sie die Stadt?':'คุณคิดว่าเมืองเป็นอย่างไร'}.get(question,''))
 rmeaning=next((x['meaning'] for x in items if x['answer']==reply),'ได้เลย ยินดี')
 alternatives=([items[9]['answer'],items[16]['answer'],items[23]['answer'],items[28]['answer']] if response=='A' else [items[18]['answer'],items[11]['answer']] if group['slug']=='rating' else [items[17]['answer'],items[4]['answer']] if group['slug']=='city' else [items[15]['answer'],items[6]['answer']])
 wrong=[x for x in alternatives if x!=answer][:2]
 kind='order' if n in [5,11,18,22,26,27] else 'choice'
 note={'rating':['ใช้ gefallen บอกว่าสิ่งหนึ่งถูกใจใคร: สิ่งนั้นเป็นประธาน ส่วน mir เป็นผู้รู้สึก (Dativ)','ใช้ Ich finde … ตามด้วยสิ่งที่พูดถึงและความคิดเห็น'], 'city':['ใช้ es gibt บอกว่ามีสิ่งใดอยู่ โดยสิ่งที่มีเป็นกรรม Akkusativ','เมื่อ Hier หรือ In der Nähe อยู่ตำแหน่ง 1 กริยา gibt อยู่ตำแหน่ง 2'], 'favorite':['เริ่มจากบอกสถานที่โปรด แล้วเพิ่มสิ่งที่ชอบหรือกิจกรรมที่ทำได้ที่นั่น','kann อยู่ตำแหน่ง 2 ส่วนกริยา Infinitiv อยู่ท้ายประโยค'], 'opinions':['ถามความเห็นด้วย Wie finden Sie …? แล้วตอบให้ตรงกับสิ่งที่ถูกถาม','Ich glaube และ Ich finde ใช้เกริ่นความคิดเห็น; แต่ละประโยคย่อยมีประธานและกริยาของตนเอง']}[group['slug']]
 model=dict(id=item['id'],groupSlug=group['slug'],title=group['title'],question=question,reply=reply,questionMeaning=qmeaning,replyMeaning=rmeaning,responseSpeaker=response,targetAnswer=answer,context=[contexts[i]],note=note,kind=kind,options=[wrong[0],answer,wrong[1]])
 if kind=='order':model['tokens']=answer.split()[::-1]
 models.append(model)
 assert qmeaning and rmeaning and len(set(model['options']))==3
for text,sentences in annotations.items():assert ' '.join(' '.join(p['text']for p in s)for s in sentences)==text,text
for model in models:assert model['question']in annotations and model['reply']in annotations
out=dict(version=1,origin='Existing published L13 targets with product-authored supported contexts; not copied publisher exercises',models=models)
(R/'docs/exercise-mapping/l13-phrase-teaching-models.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
source=R/'docs/exercise-mapping/phrase-presentation-annotations.json';bank=json.loads(source.read_text());bank['lessons']['L13']=annotations;source.write_text(json.dumps(bank,ensure_ascii=False,indent=2)+'\n')
topics=[]
for m in models:
 tid=m['id']+'-learn-dialogue-v1';is_a=m['responseSpeaker']=='A';unit=dict(id=tid+'-response',targetId=m['id'],subskill='phrase_word_order' if m['kind']=='order' else 'phrase_dialogue_response',difficulty=2 if m['kind']=='order' else 1,rationale='ใช้บทตัวอย่างและข้อมูลสถานการณ์ที่ให้; วัดการเลือกหน้าที่หรือลำดับคำแบบมีตัวช่วย ไม่ใช่การผลิตภาษาอิสระ',answer=m['targetAnswer'],meaning=next(x['meaning']for x in items if x['id']==m['id']))
 visual=dict(kind='facts',rows=m['context']);task=dict(id=tid,kind=m['kind'],prompt=m['reply'] if is_a else m['question'],promptMeaning=m['replyMeaning'] if is_a else m['questionMeaning'],responseSpeaker=m['responseSpeaker'],visual=visual,audio=None,explanation='ข้อมูลที่ให้ระบุว่า '+m['context'][0][0]+' คือ '+m['context'][0][1]+' จึงเลือกสำนวนให้ตรงกับเจตนานี้',assistance=['prior-model','provided-context','supplied-words'if m['kind']=='order'else'reply-options'],unit=unit)
 task.update(tokens=m['tokens'])if m['kind']=='order'else task.update(options=m['options'])
 topics.append(dict(id=m['id'],objective=m['id'],title=m['title'],modelVisual=visual,note=m['note'],audio='',models=[dict(question=m['question'],reply=m['reply'],questionMeaning=m['questionMeaning'],replyMeaning=m['replyMeaning'],visual=visual)],legacyIds=[m['id']],tasks=[task]))
(R/'src/data/l13-phrase-learning.ts').write_text('import type { DialogueTopic } from "@/lib/phrase-dialogue-learning";\nexport const l13PhraseLearning: readonly DialogueTopic[] = '+json.dumps(topics,ensure_ascii=False,indent=2)+';\n')
print('L13:',len(models),'preserved target models/checks;',len(annotations),'exact annotations')
