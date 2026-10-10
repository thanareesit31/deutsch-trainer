-- Add the supplied lesson titles and topic outlines to the existing A1.3 entries.
update public.content_lessons as lesson
set data = lesson.data || jsonb_build_object(
  'title', outline.title,
  'thai', outline.thai,
  'topics', outline.topics
)
from (values
  ('L13', 'Berlin gefällt mir.', 'สถานที่ในเมือง', 'In der Stadt — สถานที่ในเมือง, es gibt + Akkusativ, กริยาที่ใช้ Dativ/Personalpronomen im Dativ, Das gefällt mir, การประเมินและพูดเกี่ยวกับสถานที่'),
  ('L14', 'Vor dem Kaufhaus nach rechts.', 'การบอกทาง', 'Wege beschreiben — การบอกทาง, Institutionen und Plätze in der Stadt, lokale Präpositionen: vor, neben, an ..., ถามทาง/อธิบายทาง'),
  ('L15', 'Ich finde Ihr Zimmer schön.', 'บ้าน ห้องพัก และเฟอร์นิเจอร์', 'Wohnen — บ้าน/ห้องพัก/เฟอร์นิเจอร์, Possessivartikel im Nominativ und Akkusativ: ihr, sein, บรรยายที่อยู่อาศัย'),
  ('L16', 'Wir haben hier ein Problem.', 'อุปกรณ์และการนัดหมาย', 'Termine — อุปกรณ์/เครื่องใช้, temporale Präpositionen: in, vor, nach, เสนอความช่วยเหลือ, นัด/เลื่อน/ยกเลิกนัด, ตอบสนองต่อคำขอ'),
  ('L17', 'Ich will … werden.', 'แผนและความต้องการ', 'Pläne und Wünsche — แผนและความต้องการ, modale Präpositionen: mit, ohne, Konjunktion: werden, Modalverb: wollen, พูดความปรารถนาและแผน'),
  ('L18', 'Ich soll diese Übung machen.', 'สุขภาพและความเจ็บป่วย', 'Gesundheit und Krankheit — ส่วนต่าง ๆ ของร่างกาย, Imperativ Sie, Modalverb: sollen, อธิบายอาการ, ขอคำแนะนำ/ให้คำแนะนำ และความแตกต่างทางวัฒนธรรม')
) as outline(id, title, thai, topics)
where lesson.id = outline.id;
