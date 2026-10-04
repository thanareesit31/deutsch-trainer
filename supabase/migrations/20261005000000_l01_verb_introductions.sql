-- Lesson metadata, not practice items: no changes to learner evidence or item IDs.
begin;
update public.content_lessons
set data = jsonb_set(data, '{verbIntroductions}', $content$[
  {"infinitive":"kommen","thaiMeaning":"มา","examples":[
    {"de":"Ich komme aus Thailand.","th":"ฉันมาจากประเทศไทย"}
  ]},
  {"infinitive":"heißen","thaiMeaning":"ชื่อ / มีชื่อว่า","examples":[
    {"de":"Ich heiße Anna.","th":"ฉันชื่อ Anna"}
  ]},
  {"infinitive":"lernen","thaiMeaning":"เรียน / เรียนรู้","examples":[
    {"de":"Ich lerne Deutsch.","th":"ฉันเรียนภาษาเยอรมัน"}
  ]},
  {"infinitive":"sein","thaiMeaning":"เป็น / คือ / อยู่","meaningNote":"คำแปลขึ้นอยู่กับบริบท","examples":[
    {"de":"Ich bin Sun.","th":"ฉันคือ Sun"},
    {"de":"Ich bin Student.","th":"ฉันเป็นนักเรียน/นักศึกษา"},
    {"de":"Ich bin in Berlin.","th":"ฉันอยู่ที่เบอร์ลิน"}
  ]}
]$content$::jsonb)
where id = 'L01' and not (data ? 'verbIntroductions');
commit;
