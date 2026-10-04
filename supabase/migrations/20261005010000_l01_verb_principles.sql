begin;
update public.content_lessons
set data = jsonb_set(data, '{verbPrinciples}', $content${
  "title": "กริยาผันตามประธาน",
  "infinitive": "lernen",
  "stem": "lern",
  "infinitiveEnding": "en",
  "explanation": "lern- คือส่วนหลัก และ -en คือส่วนท้าย (Endung)",
  "note": "นี่คือรูปแบบทั่วไปของกริยาปกติ บางคำมีรูปต่างออกไป",
  "rows": [
    {"subject":"ich","ending":"e"},
    {"subject":"du","ending":"st"},
    {"subject":"er / sie / es","ending":"t"},
    {"subject":"wir","ending":"en"},
    {"subject":"ihr","ending":"t"},
    {"subject":"sie / Sie","ending":"en"}
  ]
}$content$::jsonb)
where id = 'L01' and not (data ? 'verbPrinciples');
commit;
