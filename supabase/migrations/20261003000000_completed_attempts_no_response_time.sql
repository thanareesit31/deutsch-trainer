-- Keep the historical column for compatibility, but stop requiring clients to
-- measure or submit response time. New rows receive a neutral default value.
alter table public.learning_attempts
  alter column response_ms set default 0;

-- A correct attempt is complete only after confidence is recorded. Incorrect
-- attempts are complete immediately. Pending correct attempts remain in the
-- history tables but are excluded from derived knowledge.
create or replace view public.knowledge_state with (security_invoker=true) as
select e.user_id,e.item_id,e.seen_at,
 (select count(*)
    from public.session_items s
    join public.learning_attempts a using(user_id,session_id,ordinal)
   where s.user_id=e.user_id and s.item_id=e.item_id
     and (not a.correct or a.confidence is not null)) as attempts,
 (select count(*)
    from public.session_items s
    join public.learning_attempts a using(user_id,session_id,ordinal)
   where s.user_id=e.user_id and s.item_id=e.item_id
     and a.correct and a.confidence is not null) as correct,
 (select count(*)
    from public.session_items s
    join public.learning_attempts a using(user_id,session_id,ordinal)
    join public.attempt_evidence d using(user_id,session_id,ordinal)
   where s.user_id=e.user_id and s.item_id=e.item_id
     and (not a.correct or a.confidence is not null)
     and not d.correct) as errors
from public.item_exposures e;
grant select on public.knowledge_state to authenticated;

-- The client still persists the answer and its diagnostic evidence immediately.
-- Confidence completes a correct attempt; incorrect attempts need no confidence.
-- response_ms is omitted and receives the compatibility default above.
create or replace function public.learning_action(action text, payload jsonb) returns void
language plpgsql security definer set search_path='' as $$
declare u uuid := auth.uid(); sid uuid; pos integer; s public.practice_sessions; q jsonb; d jsonb;
begin
 if u is null then raise exception 'Authentication required'; end if;
 if action='expose' then
   if coalesce(payload->>'itemId','')='' then raise exception 'Missing item'; end if;
   insert into public.item_exposures(user_id,item_id) values(u,payload->>'itemId') on conflict do nothing;
   return;
 end if;
 sid := (payload->>'sessionId')::uuid;
 if action='start' then
   if jsonb_array_length(payload->'questions') < 1 then raise exception 'Empty session'; end if;
   insert into public.practice_sessions(user_id,id,title,origin) values(u,sid,payload->>'title',payload->>'origin') on conflict do nothing;
   if exists(select 1 from public.session_items where user_id=u and session_id=sid) then return; end if;
   pos:=0;
   for q in select value from jsonb_array_elements(payload->'questions') loop
     insert into public.session_items values(u,sid,pos,q->'item'->>'id',q);
     pos:=pos+1;
   end loop;
   return;
 end if;
 select * into strict s from public.practice_sessions where user_id=u and id=sid for update;
 pos := (payload->>'position')::integer;
 if action='submit' then
   if exists(select 1 from public.learning_attempts where user_id=u and session_id=sid and ordinal=pos) then return; end if;
   if s.completed or s.position<>pos then raise exception 'Session position changed'; end if;
   if jsonb_typeof(payload->'evidence') <> 'array' or jsonb_array_length(payload->'evidence')=0 then raise exception 'Evidence required'; end if;
   insert into public.learning_attempts(user_id,session_id,ordinal,input,correct)
   values(u,sid,pos,payload->>'input',(payload->>'correct')::boolean);
   for d in select value from jsonb_array_elements(payload->'evidence') loop
     insert into public.attempt_evidence values(u,sid,pos,d->>'dimension',(d->>'correct')::boolean);
   end loop;
 elsif action='confidence' then
   update public.learning_attempts set confidence=payload->>'confidence' where user_id=u and session_id=sid and ordinal=pos and correct and confidence is null;
 elsif action='advance' then
   if s.position>pos then return; end if;
   if s.position<>pos or not exists(select 1 from public.learning_attempts where user_id=u and session_id=sid and ordinal=pos and (not correct or confidence is not null)) then raise exception 'Answer and confidence required'; end if;
   update public.practice_sessions set position=pos+1, completed=(pos+1 >= (select count(*) from public.session_items where user_id=u and session_id=sid)) where user_id=u and id=sid;
 else raise exception 'Unknown action';
 end if;
end $$;
revoke all on function public.learning_action(text,jsonb) from public;
grant execute on function public.learning_action(text,jsonb) to authenticated;
