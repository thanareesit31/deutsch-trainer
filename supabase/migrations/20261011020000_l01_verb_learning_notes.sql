-- Add per-verb observation cues without changing lesson items or learner evidence.
begin;

update public.content_lessons
set data = jsonb_set(
  data,
  '{verbIntroductions}',
  (
    select jsonb_agg(
      case introduction ->> 'infinitive'
        when 'kommen' then jsonb_set(introduction, '{learningNote}', '"ส่วนหลัก komm คงเดิม · ลองสังเกต Endung ที่เปลี่ยนตามประธาน"'::jsonb, true)
        when 'lernen' then jsonb_set(introduction, '{learningNote}', '"กริยาปกติ · ส่วนหลัก lern คงเดิม แล้วเติม Endung ตามประธาน"'::jsonb, true)
        when 'heißen' then jsonb_set(introduction, '{learningNote}', '"สังเกตตัว ß ในส่วนหลัก และดูว่า Endung เปลี่ยนตามประธานอย่างไร"'::jsonb, true)
        when 'sein' then jsonb_set(introduction, '{learningNote}', '"กริยาไม่ปกติ · สังเกตรูปของแต่ละประธานแทนการใช้ Endung แบบกริยาปกติ"'::jsonb, true)
        else introduction
      end
      order by ordinal
    )
    from jsonb_array_elements(data -> 'verbIntroductions') with ordinality as entry(introduction, ordinal)
  ),
  true
)
where id = 'L01' and jsonb_typeof(data -> 'verbIntroductions') = 'array';

commit;
