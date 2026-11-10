#!/usr/bin/env python3
"""Authored L02 Learn scenarios, mapped to the reviewed source mechanics; not publisher keys."""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[2]
img=lambda name,alt,caption:dict(kind='image',src='/images/'+name,alt=alt,caption=caption)
facts=lambda *rows:dict(kind='facts',rows=rows)
reading=lambda text:dict(kind='reading',text=text)
workpic=img('lektion-2-profession-pairs/hairdresser.webp','ช่างทำผมสองคนถืออุปกรณ์ทำผม','ทั้งคู่ทำงานที่ร้าน Haarfit')
couplepic=img('lektion-2-vocabulary/zusammenleben-v2.webp','คนสองคนใช้ชีวิตร่วมกัน','Nora และ Tim อยู่ด้วยกัน')
sub={ 'choice':'phrase_dialogue_response','order':'phrase_word_order','digits':'age_listening' }
meta=[]
def task(id,kind,prompt,pm,answer,meaning,why,visual,extra,objective,source,skill=None):
 unit=dict(id=id+'-response',targetId=id+'-target',subskill=skill or sub.get(kind,'person_detail_reading'),difficulty=3 if kind=='digits' else 2,rationale='ฟังข้อมูลที่ไม่มีคำตอบเขียนให้ แล้วใส่ตัวเลข; มีเสียงซ้ำและตัวอย่างก่อนหน้า' if kind=='digits' else 'ใช้ข้อมูลสถานการณ์และบทบาทที่กำหนด; มีตัวเลือกหรือคำให้ ไม่ใช่ผลิตภาษาอิสระ',answer=answer,meaning=meaning)
 t=dict(id=id,kind=kind,prompt=prompt,promptMeaning=pm,visual=visual,audio=None,explanation=why,assistance=['prior-model','provided-context', 'supplied-words' if kind=='order' else 'reply-options' if kind=='choice' else 'replayable-two-speaker-audio'],unit=unit,**extra)
 if kind=='digits':t['audio']=f'/audio/l02/{id.lower()}.m4a';t['assistance']=['prior-model','replayable-two-speaker-audio']
 meta.append(dict(taskId=id,objectiveId=objective,sourceFindingIds=source,authoring='product-authored scenario and feedback; source supports communicative function/mechanic',target=unit))
 return t
C=lambda id,p,pm,a,th,why,v,opts,obj,src,skill=None:task(id,'choice',p,pm,a,th,why,v,dict(options=opts),obj,src,skill)
O=lambda id,p,pm,a,th,why,v,tokens,obj,src:task(id,'order',p,pm,a,th,why,v,dict(tokens=tokens),obj,src)
def topic(id,title,objective,note,models,tasks,legacy=[]):return dict(id=id,title=title,objective=objective,note=note,models=[dict(question=q,reply=a,questionMeaning=qm,replyMeaning=am) for q,a,qm,am in models],audio=f'/audio/l02/model-{id}.m4a',legacyIds=legacy,tasks=tasks)
T=[]
T.append(topic('work','อาชีพและที่ทำงาน','L02-COMM-01',['als ตามด้วยอาชีพ ส่วน bei ตามด้วยชื่อที่ทำงาน','ใช้ du กับคนที่คุยกันเอง และ Sie เมื่อพูดสุภาพ'],[
 ('Was machst du beruflich?','Ich arbeite als Friseurin. Ich arbeite bei Haarfit.','เธอทำงานอะไร','ฉันทำงานเป็นช่างทำผม ฉันทำงานที่ร้านฮาร์ฟิต'),
 ('Was machen Sie beruflich?','Ich bin Lehrerin.','คุณทำงานอะไร','ฉันเป็นครู')],[
 C('L02-UX-PROF-01','Was macht ihr beruflich?','พวกเธอทำงานอะไร','Wir arbeiten als Friseure.','พวกเราทำงานเป็นช่างทำผม','ถามอาชีพของคนสองคน จึงตอบด้วย Wir arbeiten als …',workpic,['Wir wohnen in Berlin.','Wir arbeiten als Friseure.','Wir kommen aus Thailand.'],'L02-COMM-01',['L02-F04']),
 O('L02-UX-WORK-01','Wo arbeitest du?','เธอทำงานที่ไหน','Ich arbeite bei Haarfit.','ฉันทำงานที่ร้านฮาร์ฟิต','ใช้ bei ตามด้วยชื่อสถานที่ทำงาน ส่วน als ใช้บอกอาชีพ',facts(('ผู้ตอบ B','Nora'),('สถานที่ทำงาน','Haarfit')),['bei','Haarfit.','Ich','arbeite'],'L02-COMM-01',['L02-F05']),
 C('L02-UX-PROF-02','Was machen Sie beruflich?','คุณทำงานอะไร','Ich bin Lehrerin.','ฉันเป็นครู','คำถามแบบสุภาพถามอาชีพของคุณ ตอบด้วย Ich bin … ได้',facts(('ผู้ตอบ B','Mali'),('อาชีพ','ครูผู้หญิง')),['Ich heiße Nora.','Ich wohne in Berlin.','Ich bin Lehrerin.'],'L02-COMM-01',['L02-F05'])],['L02-pattern-profession']))
T.append(topic('status','สถานะการทำงาน','L02-COMM-01',['Ich mache ein Praktikum. = ฉันกำลังฝึกงาน','Ich bin angestellt. = ฉันเป็นลูกจ้าง','Ich bin freiberuflich. / Ich bin selbstständig. = ฉันทำงานอิสระ','Ich bin arbeitslos. = ฉันว่างงาน ส่วน Ich arbeite nicht. = ฉันไม่ได้ทำงาน'],[
 ('Was machst du beruflich?','Ich mache ein Praktikum.','เธอทำงานอะไร','ฉันกำลังฝึกงาน'),
 ('Und du?','Ich bin angestellt.','แล้วเธอล่ะ','ฉันเป็นลูกจ้าง'),
 ('Arbeitest du?','Ich arbeite im Moment nicht.','เธอทำงานหรือเปล่า','ตอนนี้ฉันไม่ได้ทำงาน')],[
 C('L02-UX-STATUS-01','Was machst du im Moment?','ช่วงนี้เธอทำอะไร','Ich mache ein Praktikum.','ฉันกำลังฝึกงาน','สถานการณ์กำหนดว่ากำลังฝึกงาน จึงใช้ mache ein Praktikum',facts(('ผู้ตอบ B','Tim'),('ตอนนี้','กำลังฝึกงาน')),['Ich mache ein Praktikum.','Ich bin arbeitslos.','Ich bin verheiratet.'],'L02-COMM-01',['L02-F05']),
 C('L02-UX-STATUS-02','Wie arbeitest du?','เธอทำงานแบบไหน','Ich bin angestellt.','ฉันเป็นลูกจ้าง','ข้อมูลระบุว่าเป็นพนักงานของบริษัท จึงตอบ angestellt',facts(('ผู้ตอบ B','Nora'),('การทำงาน','เป็นลูกจ้างบริษัท')),['Ich bin Single.','Ich bin angestellt.','Ich mache ein Praktikum.'],'L02-COMM-01',['L02-F05']),
 O('L02-UX-STATUS-03','Arbeitest du im Moment?','ตอนนี้เธอทำงานไหม','Ich arbeite im Moment nicht.','ตอนนี้ฉันไม่ได้ทำงาน','วางกริยา arbeite หลัง Ich และใช้ nicht ปฏิเสธการทำงานในประโยคนี้',facts(('ผู้ตอบ B','Tim'),('ตอนนี้','ไม่ได้ทำงาน')),['nicht.','Moment','Ich','im','arbeite'],'L02-COMM-01',['L02-F05'])],['L02-status-praktikum','L02-status-arbeitslos','L02-status-nicht-arbeiten','L02-status-freiberuflich','L02-status-selbststaendig','L02-status-angestellt']))
T.append(topic('age','ถามและบอกอายุ','L02-COMM-03',['Wie alt bist du? ใช้ถามอายุ','บอกอายุด้วย Ich bin … Jahre alt.'],[('Wie alt bist du?','Ich bin vierundzwanzig Jahre alt.','เธออายุเท่าไร','ฉันอายุ 24 ปี')],[
 task('L02-UX-AGE-AUDIO-01','digits','ฟังแล้วใส่อายุ','', '31','อายุ 31 ปี','ในเสียงตอบ einunddreißig จึงใส่ 31',None,dict(maxLength=3,label='อายุ'),'L02-COMM-03',['L02-F02']),
 O('L02-UX-AGE-ORDER-01','Wie alt bist du?','เธออายุเท่าไร','Ich bin 28 Jahre alt.','ฉันอายุ 28 ปี','เริ่มด้วย Ich bin ตามด้วยอายุ แล้วจบด้วย Jahre alt',facts(('ผู้ตอบ B','Nora'),('อายุ','28')),['alt.','28','bin','Jahre','Ich'],'L02-COMM-03',['L02-F02'])]))
T.append(topic('home','อาศัยอยู่ที่ไหน','L02-COMM-02',['Wo wohnst du? ถามคนเดียว ตอบ Ich wohne in …','Wo wohnt ihr? ถามหลายคน ตอบ Wir wohnen in …'],[('Wo wohnst du?','Ich wohne in München.','เธออาศัยอยู่ที่ไหน','ฉันอาศัยอยู่ที่มิวนิก'),('Wo wohnt ihr?','Wir wohnen in Berlin.','พวกเธออาศัยอยู่ที่ไหน','พวกเราอาศัยอยู่ที่เบอร์ลิน')],[
 O('L02-UX-HOME-01','Wo wohnst du?','เธออาศัยอยู่ที่ไหน','Ich wohne in Bangkok.','ฉันอาศัยอยู่ที่กรุงเทพฯ','ใช้ in ตามด้วยชื่อเมืองเพื่อบอกที่อยู่อาศัย',facts(('ผู้ตอบ B','Nora'),('เมืองที่อาศัยอยู่','Bangkok')),['Bangkok.','wohne','Ich','in'],'L02-COMM-02',['L02-F01']),
 C('L02-UX-HOME-02','Wo wohnt ihr?','พวกเธออาศัยอยู่ที่ไหน','Wir wohnen in Berlin.','พวกเราอาศัยอยู่ที่เบอร์ลิน','ผู้ถามใช้ ihr ถามคนสองคน ผู้ตอบจึงใช้ Wir',facts(('ผู้ตอบ B','Nora + Tim'),('เมืองที่อาศัยอยู่','Berlin')),['Ich heiße Tim.','Wir wohnen in Berlin.','Wir kommen aus Thailand.'],'L02-COMM-02',['L02-F01'])]))
T.append(topic('couple','ชีวิตคู่และลูก','L02-COMM-04',['อยู่ด้วยกัน แต่งงาน และมีลูก เป็นคนละข้อมูล','nicht ปฏิเสธ verheiratet; keine Kinder บอกว่าไม่มีลูก'],[('Lebt ihr zusammen?','Ja, wir leben zusammen.','พวกเธออยู่ด้วยกันไหม','ใช่ พวกเราอยู่ด้วยกัน'),('Seid ihr verheiratet?','Nein, wir sind nicht verheiratet.','พวกเธอแต่งงานกันแล้วไหม','ไม่ พวกเราไม่ได้แต่งงานกัน'),('Habt ihr Kinder?','Nein, wir haben keine Kinder.','พวกเธอมีลูกไหม','ไม่ พวกเราไม่มีลูก')],[
 C('L02-UX-TOGETHER-01','Lebt ihr zusammen?','พวกเธออยู่ด้วยกันไหม','Ja, wir leben zusammen.','ใช่ พวกเราอยู่ด้วยกัน','ข้อมูลระบุว่าอยู่ด้วยกัน จึงตอบ Ja, wir leben zusammen.',facts(('ผู้ตอบ B','Nora + Tim'),('อยู่ด้วยกัน','ใช่')),['Nein, wir leben nicht zusammen.','Ja, wir leben zusammen.','Wir sind verheiratet.'],'L02-COMM-04',['L02-F01']),
 C('L02-UX-COUPLE-01','Seid ihr verheiratet?','พวกเธอแต่งงานกันแล้วไหม','Nein, wir sind nicht verheiratet.','ไม่ พวกเราไม่ได้แต่งงานกัน','การอยู่ด้วยกันไม่ได้แปลว่าแต่งงาน ข้อมูลคู่นี้ระบุว่ายังไม่ได้แต่งงาน',facts(('ผู้ตอบ B','Nora + Tim'),('อยู่ด้วยกัน','ใช่'),('แต่งงานแล้ว','ไม่ใช่')),['Ja, wir sind verheiratet.','Nein, wir sind nicht verheiratet.','Wir wohnen in Berlin.'],'L02-COMM-04',['L02-F03']),
 O('L02-UX-CHILDREN-01','Habt ihr Kinder?','พวกเธอมีลูกไหม','Wir haben keine Kinder.','พวกเราไม่มีลูก','ใช้ keine กับ Kinder เพื่อบอกว่าไม่มีลูก',facts(('ผู้ตอบ B','Nora + Tim'),('มีลูก','ไม่มี')),['Kinder.','haben','Wir','keine'],'L02-COMM-04',['L02-F01'])]))
T.append(topic('dream','อาชีพในฝัน','L02-COMM-01',['beruflich ถามงานปัจจุบัน ส่วนคำว่าอาชีพในฝันถามงานที่อยากทำ','อาชีพปัจจุบันกับอาชีพในฝันอาจเป็นคนละอาชีพ'],[('Was machst du beruflich?','Ich arbeite als Verkäufer.','เธอทำงานอะไร','ฉันทำงานเป็นพนักงานขาย'),('Und was ist dein Traumberuf?','Mein Traumberuf ist Arzt.','แล้วอาชีพในฝันของเธอคืออะไร','อาชีพในฝันของฉันคือหมอ')],[
 C('L02-UX-DREAM-01','Was ist dein Traumberuf?','อาชีพในฝันของเธอคืออะไร','Mein Traumberuf ist Arzt.','อาชีพในฝันของฉันคือหมอ','คำถามถามงานที่อยากทำ จึงตอบอาชีพในฝัน ไม่ใช่งานปัจจุบัน',facts(('ผู้ตอบ B','Tim'),('งานปัจจุบัน','พนักงานขาย'),('อาชีพในฝัน','หมอ')),['Ich arbeite als Verkäufer.','Mein Traumberuf ist Arzt.','Ich wohne in Berlin.'],'L02-COMM-01',['L02-F07'],'current_vs_dream_meaning'),
 C('L02-UX-DREAM-02','Was machst du beruflich?','เธอทำงานอะไร','Ich arbeite als Verkäufer.','ฉันทำงานเป็นพนักงานขาย','beruflich ถามงานปัจจุบัน ข้อมูลบอกว่า Tim เป็นพนักงานขาย',facts(('ผู้ตอบ B','Tim'),('งานปัจจุบัน','พนักงานขาย'),('อาชีพในฝัน','หมอ')),['Mein Traumberuf ist Arzt.','Ich arbeite als Verkäufer.','Ich bin 28 Jahre alt.'],'L02-COMM-01',['L02-F07'],'current_vs_dream_meaning')],['L02-traumberuf']))
profile=dict(id='L02-UX-PROFILE-01',kind='profile',prompt='เติมข้อมูลของ Nora',promptMeaning='',visual=reading('Ich heiße Nora. Ich bin 28 Jahre alt. Ich wohne in Berlin. Ich arbeite bei Haarfit.'),audio=None,explanation='Jahre alt บอกอายุ ส่วน wohne in บอกเมือง และ arbeite bei บอกที่ทำงาน',assistance=['prior-model','visible-reading'],fields=[dict(label=label,unit=dict(id='L02-UX-PROFILE-01-'+name,targetId='L02-UX-PROFILE-01-'+name+'-target',subskill='person_detail_reading',difficulty=2,rationale='อ่านหาข้อมูลแต่ละฟิลด์จากข้อความ; แยกหลักฐานรายช่อง ไม่ใช่การฟังหรือผลิตภาษา',answer=answer,meaning=meaning)) for name,label,answer,meaning in [('age','อายุ','28','อายุ 28 ปี'),('home','เมืองที่อาศัยอยู่','Berlin','อาศัยอยู่ที่เบอร์ลิน'),('work','สถานที่ทำงาน','Haarfit','ทำงานที่ร้านฮาร์ฟิต')]])
meta.append(dict(taskId=profile['id'],objectiveId='L02-COMM-01/02/03',sourceFindingIds=['L02-F06'],authoring='product-authored fictional profile',targets=[f['unit'] for f in profile['fields']]))
T.append(topic('contact','ติดต่อและแนะนำตัว','L02-COMM-05',['Wie ist deine Handynummer? ใช้ถามเบอร์โทรศัพท์มือถือ','ฟังตัวเลขทีละตัว อย่าสลับลำดับ','แนะนำตัวโดยเลือกข้อมูลชื่อ อายุ เมือง และงานที่ต้องการบอก'],[('Wie ist deine Handynummer?','Meine Handynummer ist null eins zwei drei vier fünf sechs.','เบอร์มือถือของเธอคืออะไร','เบอร์มือถือของฉันคือ 0123456')],[
 C('L02-UX-PHONE-QUESTION-01','เลือกคำถามเพื่อขอเบอร์มือถือ','', 'Wie ist deine Handynummer?','เบอร์มือถือของเธอคืออะไร','คำถามนี้ถามเบอร์โทรศัพท์มือถือ จึงใช้ขอข้อมูลติดต่อ',facts(('ต้องการทราบ','เบอร์โทรศัพท์มือถือ')),['Wie alt bist du?','Wo wohnst du?','Wie ist deine Handynummer?'],'L02-COMM-05',['L02-F02']),
 task('L02-UX-PHONE-01','digits','ฟังแล้วใส่เบอร์มือถือ','', '0301234567','เบอร์ที่ได้ยินคือ 0301234567','ฟังเลขทีละตัวและคงเลข 0 ตัวหน้าไว้',None,dict(maxLength=15,label='เบอร์มือถือ'),'L02-COMM-05',['L02-F02'],'phone_digit_listening'),profile],['L02-pattern-phone']))
model_visuals=[img('lektion-2-profession-pairs/hairdresser.webp','ช่างทำผมในร้าน','ตัวอย่างสถานที่ทำงาน: ร้านทำผม'),facts(('ตัวอย่างที่ 1','กำลังฝึกงาน'),('ตัวอย่างที่ 2','เป็นลูกจ้าง'),('ตัวอย่างที่ 3','ตอนนี้ไม่ได้ทำงาน')),facts(('อายุผู้ตอบ B','24')),facts(('ตัวอย่างคนเดียว','München'),('ตัวอย่างเป็นคู่','Berlin')),couplepic,facts(('งานปัจจุบัน','พนักงานขาย'),('อาชีพในฝัน','หมอ')),facts(('เบอร์ตัวอย่าง','0123456'))]
for topic,visual in zip(T,model_visuals):topic['modelVisual']=visual
assert len(T)==7 and sum(len(t['tasks']) for t in T)==18
review=json.loads((R/'docs/exercise-mapping/l02-phrase-redesign-sources.json').read_text());findings={f['id'] for f in review['findings']}
for entry in meta:assert set(entry['sourceFindingIds'])<=findings
for t in T:
 for q in t['tasks']:
  if q['kind']=='choice':assert q['options'].count(q['unit']['answer'])==1
  if q['kind']=='order':assert sorted(q['tokens'])==sorted(q['unit']['answer'].split())
  if q['visual'] and q['visual']['kind']=='image':assert (R/'public'/q['visual']['src'].lstrip('/')).exists()
(R/'src/data/l02-phrase-discovery.ts').write_text('import type { DialogueTopic } from "@/lib/phrase-dialogue-learning";\nexport const l02PhraseDiscovery = '+json.dumps(T,ensure_ascii=False,indent=2)+' satisfies readonly DialogueTopic[];\n')
(R/'docs/exercise-mapping/l02-phrase-discovery-inventory.json').write_text(json.dumps(dict(version=1,scope='local-tester-Learn-only',authoring='product-authored content mapped to source functions; not publisher answers',topics=[dict(id=t['id'],objective=t['objective'],legacyIds=t['legacyIds']) for t in T],tasks=meta),ensure_ascii=False,indent=2)+'\n')
clips=[]
for t in T:
 turns=[]
 for m in t['models']:turns.extend([dict(voice='de-DE-KatjaNeural',text=m['question']),dict(voice='de-DE-ConradNeural',text=m['reply'])])
 clips.append(dict(path=t['audio'],turns=turns))
clips.extend([dict(path='/audio/l02/l02-ux-age-audio-01.m4a',turns=[dict(voice='de-DE-KatjaNeural',text='Wie alt bist du?'),dict(voice='de-DE-ConradNeural',text='Ich bin einunddreißig Jahre alt.')]),dict(path='/audio/l02/l02-ux-phone-01.m4a',turns=[dict(voice='de-DE-KatjaNeural',text='Wie ist deine Handynummer?'),dict(voice='de-DE-ConradNeural',text='Meine Handynummer ist: null. drei. null. eins. zwei. drei. vier. fünf. sechs. sieben.')])])
(R/'docs/exercise-mapping/l02-phrase-audio.json').write_text(json.dumps(dict(version=1,origin='synthetic fictional German dialogues; no cloned personal voices or copied publisher recordings',clips=clips),ensure_ascii=False,indent=2)+'\n')
print('Built 7 topics, 18 tasks, 20 scored response units and 9 audio clip definitions')
