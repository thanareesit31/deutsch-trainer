begin;
update public.content_lessons
set data = jsonb_set(
  data,
  '{verbPrinciples,rows}',
  $content$[
    {"subject":"ich","thaiSubject":"ฉัน","ending":"e"},
    {"subject":"du","thaiSubject":"เธอ","ending":"st"},
    {"subject":"er / sie / es","thaiSubject":"เขา / เธอ / มัน","ending":"t"},
    {"subject":"wir","thaiSubject":"พวกเรา","ending":"en"},
    {"subject":"ihr","thaiSubject":"พวกเธอ","ending":"t"},
    {"subject":"sie / Sie","thaiSubject":"พวกเขา / คุณ (สุภาพ)","ending":"en"}
  ]$content$::jsonb,
  true
)
where id = 'L01' and data ? 'verbPrinciples';
commit;
