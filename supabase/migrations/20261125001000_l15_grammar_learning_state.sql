begin;
create or replace function public.validate_l15_grammar_learning_state() returns trigger
language plpgsql security definer set search_path='' as $$
declare g jsonb; old_g jsonb; c public.l15_grammar_learning_cards%rowtype; p jsonb; old_p jsonb;
 seen jsonb; item jsonb; entry record; attempt jsonb; canonical public.release_course_tasks%rowtype;
 selection_item jsonb; rebuilt text; page_index integer; guided_task text; count_checked integer; total_checked integer:=0; response_text text; active_index integer;
begin
 if new.lesson_key<>'deutsch-trainer-release-course-v1-L15-grammar' then return new; end if;
 if tg_op='UPDATE' then old_g:=old.state->'guidedL15';
 else select state->'guidedL15' into old_g from public.learner_lesson_states where user_id=new.user_id and lesson_key=new.lesson_key; end if;
 if not(new.state ? 'guidedL15') then
  if old_g is not null then new.state:=jsonb_set(new.state,'{guidedL15}',old_g);
  else
   if exists(select 1 from public.l15_grammar_learning_cards registry where (new.state->'learned') @> jsonb_build_array(registry.card_id)) then raise exception 'L15 exposure requires guided teaching state'; end if;
   return new;
  end if;
 end if;
 g:=new.state->'guidedL15';
 if jsonb_typeof(g) is distinct from 'object' or g->>'version' is distinct from '1'
 or jsonb_typeof(g->'active') is distinct from 'number' or (g->>'active')!~'^[0-4]$'
 or jsonb_typeof(g->'complete') is distinct from 'boolean'
 or jsonb_typeof(g->'owner') is distinct from 'object' or jsonb_typeof(g->'cards') is distinct from 'object'
 or coalesce(g->>'updatedAt','')='' then raise exception 'Invalid L15 guided state'; end if;
 perform (g->>'updatedAt')::timestamptz;
 active_index:=(g->>'active')::integer;
 for c in select * from public.l15_grammar_learning_cards order by card_index loop
  p:=case when c.card_index=0 then g->'owner' else g->'cards'->c.card_key end;
  old_p:=case when c.card_index=0 then old_g->'owner' else old_g->'cards'->c.card_key end;
  if jsonb_typeof(p) is distinct from 'object' or jsonb_typeof(p->'responses') is distinct from 'object'
  or jsonb_typeof(p->'seen') is distinct from 'array' then raise exception 'Invalid L15 card state'; end if;
  seen:=p->'seen';
  for item in select value from jsonb_array_elements(seen) loop
   if jsonb_typeof(item) is distinct from 'number' or item::text!~'^[0-9]+$' or item::text::integer>=c.teaching_pages
   then raise exception 'Invalid L15 seen page'; end if;
  end loop;
  if (select count(distinct value) from jsonb_array_elements(seen))<>jsonb_array_length(seen)
  or (old_p is not null and not(seen @> (old_p->'seen'))) then raise exception 'L15 seen pages cannot be removed'; end if;
  if c.card_index=0 then
   if coalesce(p->>'testOwner','') not in ('anna','tom') or jsonb_typeof(p->'drafts') is distinct from 'object'
   or jsonb_typeof(p->'reviewed') is distinct from 'array' or jsonb_typeof(p->'view') is distinct from 'object' then raise exception 'Invalid L15 owner state'; end if;
   for entry in select key,value from jsonb_each(p->'drafts') loop
    if entry.key not in ('anna','tom') or coalesce(entry.value#>>'{}','') not in ('sein','ihr') then raise exception 'Invalid L15 owner draft'; end if;
   end loop;
   for item in select value from jsonb_array_elements(p->'reviewed') loop
    if coalesce(item#>>'{}','') not in ('anna','tom') then raise exception 'Invalid L15 owner assistance'; end if;
   end loop;
   if p->'view'->>'kind'='learn' and jsonb_typeof(p->'view'->'step')='number' and (p->'view'->>'step')~'^[0-2]$' then page_index:=(p->'view'->>'step')::integer;
   elsif p->'view'->>'kind' in ('try','feedback') and p->'view'->>'owner' in ('anna','tom') then
    page_index:=case when p->'view'->>'owner'='anna' then 3 else 4 end;
    if not(p->'view' ? 'answer') or (p->'view'->'answer' is distinct from 'null'::jsonb and coalesce(p->'view'->>'answer','') not in ('sein','ihr')) then raise exception 'Invalid L15 owner answer'; end if;
    if p->'view'->>'kind'='feedback' and p->'responses'->>(p->'view'->>'owner') is distinct from p->'view'->>'answer' then raise exception 'L15 owner feedback missing first answer'; end if;
   else raise exception 'Invalid L15 owner view'; end if;
  else
   if jsonb_typeof(p->'page') is distinct from 'number' or (p->>'page')!~'^[0-9]+$'
   or (p->>'page')::integer>=c.teaching_pages+2
   or jsonb_typeof(p->'testPage') is distinct from 'number' or (p->>'testPage')!~'^[0-9]+$'
   or (p->>'testPage')::integer<c.teaching_pages or (p->>'testPage')::integer>=c.teaching_pages+2 then raise exception 'Invalid L15 page'; end if;
   page_index:=(p->>'page')::integer;
  end if;
  if (new.state->'learned') @> jsonb_build_array(c.card_id) and jsonb_array_length(seen)<>c.teaching_pages then raise exception 'L15 exposure requires all teaching pages'; end if;
  if page_index>=c.teaching_pages and (jsonb_array_length(seen)<>c.teaching_pages or not((new.state->'learned') @> jsonb_build_array(c.card_id)))
  then raise exception 'L15 teaching pages must be learned before checks'; end if;
  count_checked:=0;
  for entry in select key,value from jsonb_each(p->'responses') loop
   if c.card_index=0 then
    if entry.key not in ('anna','tom') or jsonb_typeof(entry.value) is distinct from 'string' or coalesce(entry.value#>>'{}','') not in ('sein','ihr') then raise exception 'Invalid L15 owner first answer'; end if;
    guided_task:=case when entry.key='anna' then 'A13-L15-GUIDED-OWNER-01' else 'A13-L15-GUIDED-OWNER-02' end;
    response_text:=entry.value#>>'{}';
   else
    guided_task:=entry.key;
    if jsonb_typeof(entry.value) is distinct from 'object' or coalesce(entry.value->>'kind','') not in ('draft','checked')
    or jsonb_typeof(entry.value->'text') is distinct from 'string' or jsonb_typeof(entry.value->'selection') is distinct from 'array'
    or jsonb_typeof(entry.value->'reviewed') is distinct from 'boolean' then raise exception 'Invalid L15 response'; end if;
    response_text:=entry.value->>'text';
   end if;
   select * into canonical from public.release_course_tasks where lesson_id='L15' and skill='grammar' and release_course_tasks.task_id=guided_task and version=1;
   if canonical.task_id is null or not(canonical.required_card_ids @> jsonb_build_array(c.card_id)) then raise exception 'Unknown L15 guided question'; end if;
   if c.card_index<>0 then
    if canonical.guided_definition->>'kind'='order' then
     rebuilt:='';
     for selection_item in select value from jsonb_array_elements(entry.value->'selection') loop
      if jsonb_typeof(selection_item) is distinct from 'number' or selection_item::text!~'^[0-9]+$' or selection_item::text::integer>=jsonb_array_length(canonical.guided_definition->'tokens') then raise exception 'Invalid L15 token selection'; end if;
      rebuilt:=rebuilt||case when rebuilt='' then '' else ' ' end||(canonical.guided_definition->'tokens'->>(selection_item::text::integer));
     end loop;
     if (select count(distinct value) from jsonb_array_elements(entry.value->'selection'))<>jsonb_array_length(entry.value->'selection') or rebuilt is distinct from response_text then raise exception 'Invalid L15 order draft'; end if;
    elsif jsonb_array_length(entry.value->'selection')<>0 then raise exception 'Invalid L15 selection'; end if;
    if entry.value->>'kind'='draft' then continue; end if;
   end if;
   select value into attempt from jsonb_array_elements(new.state->'attempts') where value->>'id'='l15-guided-v1:'||guided_task;
   if attempt is null or attempt->>'taskId' is distinct from guided_task or attempt->>'response' is distinct from response_text then raise exception 'L15 feedback missing canonical first answer'; end if;
   if c.card_index<>0 and (entry.value->>'taskId' is distinct from guided_task or entry.value->>'version' is distinct from '1'
    or entry.value->>'targetId' is distinct from canonical.definition->>'targetId' or entry.value->>'subskill' is distinct from canonical.definition->>'subskill'
    or entry.value->'correct' is distinct from attempt->'correct'
    or (entry.value->'reviewed'='true'::jsonb and attempt->'helpUsed'<>'true'::jsonb)) then raise exception 'Invalid L15 checked attribution'; end if;
   count_checked:=count_checked+1;
  end loop;
  for entry in select key,value from jsonb_each(coalesce(old_p->'responses','{}'::jsonb)) loop
   if (c.card_index=0 or entry.value->>'kind'='checked') and p->'responses'->entry.key is distinct from entry.value then raise exception 'L15 first responses are immutable'; end if;
  end loop;
  if c.card_index<active_index and count_checked<>2 then raise exception 'L15 previous card checks incomplete'; end if;
  total_checked:=total_checked+count_checked;
 end loop;
 if g->'complete'='true'::jsonb and total_checked<>10 then raise exception 'L15 completion requires ten checked responses'; end if;
 return new;
end $$;
revoke all on function public.validate_l15_grammar_learning_state() from public;
drop trigger if exists validate_l15_grammar_learning_state on public.learner_lesson_states;
create trigger validate_l15_grammar_learning_state before insert or update on public.learner_lesson_states for each row execute function public.validate_l15_grammar_learning_state();
commit;
