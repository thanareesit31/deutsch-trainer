-- Additive migration: legacy progress is preserved.
create table if not exists public.item_exposures (
 user_id uuid not null references auth.users on delete cascade,
 item_id text not null, seen_at timestamptz not null default now(),
 primary key(user_id,item_id)
);
create table if not exists public.practice_sessions (
 user_id uuid not null references auth.users on delete cascade,
 id uuid not null, title text not null, origin text not null,
 position integer not null default 0 check(position>=0),
 completed boolean not null default false, created_at timestamptz not null default now(),
 primary key(user_id,id)
);
create table if not exists public.session_items (
 user_id uuid not null, session_id uuid not null, ordinal integer not null check(ordinal>=0),
 item_id text not null, question jsonb not null, started_at timestamptz not null default now(),
 primary key(user_id,session_id,ordinal),
 foreign key(user_id,session_id) references public.practice_sessions(user_id,id) on delete cascade,
 foreign key(user_id,item_id) references public.item_exposures(user_id,item_id)
);
create table if not exists public.learning_attempts (
 user_id uuid not null, session_id uuid not null, ordinal integer not null,
 input text not null, correct boolean not null, response_ms bigint not null check(response_ms>=0),
 confidence text check(confidence in ('easy','thought','guess')),
 submitted_at timestamptz not null default now(),
 primary key(user_id,session_id,ordinal),
 foreign key(user_id,session_id,ordinal) references public.session_items(user_id,session_id,ordinal),
 check(correct or confidence is null)
);
create table if not exists public.attempt_evidence (
 user_id uuid not null, session_id uuid not null, ordinal integer not null,
 dimension text not null check(dimension in ('wordRecall','article','spelling','verbForm','grammar','sentenceStructure','application')),
 correct boolean not null,
 primary key(user_id,session_id,ordinal,dimension),
 foreign key(user_id,session_id,ordinal) references public.learning_attempts(user_id,session_id,ordinal)
);
-- Read-only clients; all writes go through an authenticated transaction below.
do $$ declare t text; begin
 foreach t in array array['item_exposures','practice_sessions','session_items','learning_attempts','attempt_evidence'] loop
 execute format('alter table public.%I enable row level security',t);
 execute format('revoke all on public.%I from anon, authenticated',t);
 execute format('drop policy if exists own_read on public.%I',t);
 execute format('create policy own_read on public.%I for select to authenticated using (user_id = (select auth.uid()))',t);
 execute format('grant select on public.%I to authenticated',t);
 end loop;
end $$;
create or replace view public.knowledge_state with (security_invoker=true) as
select e.user_id,e.item_id,e.seen_at,
 (select count(*) from public.session_items s join public.learning_attempts a using(user_id,session_id,ordinal) where s.user_id=e.user_id and s.item_id=e.item_id) as attempts,
 (select count(*) from public.session_items s join public.learning_attempts a using(user_id,session_id,ordinal) where s.user_id=e.user_id and s.item_id=e.item_id and a.correct) as correct,
 (select count(*) from public.session_items s join public.attempt_evidence a using(user_id,session_id,ordinal) where s.user_id=e.user_id and s.item_id=e.item_id and not a.correct) as errors
from public.item_exposures e;
grant select on public.knowledge_state to authenticated;

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
   insert into public.learning_attempts(user_id,session_id,ordinal,input,correct,response_ms)
   values(u,sid,pos,payload->>'input',(payload->>'correct')::boolean,(payload->>'responseMs')::bigint);
   for d in select value from jsonb_array_elements(payload->'evidence') loop
     insert into public.attempt_evidence values(u,sid,pos,d->>'dimension',(d->>'correct')::boolean);
   end loop;
 elsif action='confidence' then
   update public.learning_attempts set confidence=payload->>'confidence' where user_id=u and session_id=sid and ordinal=pos and correct and confidence is null;
 elsif action='advance' then
   if s.position>pos then return; end if;
   if s.position<>pos or not exists(select 1 from public.learning_attempts where user_id=u and session_id=sid and ordinal=pos and (not correct or confidence is not null)) then raise exception 'Answer and confidence required'; end if;
   update public.practice_sessions set position=pos+1, completed=(pos+1 >= (select count(*) from public.session_items where user_id=u and session_id=sid)) where user_id=u and id=sid;
   update public.session_items set started_at=now() where user_id=u and session_id=sid and ordinal=pos+1;
 else raise exception 'Unknown action';
 end if;
end $$;
revoke all on function public.learning_action(text,jsonb) from public;
grant execute on function public.learning_action(text,jsonb) to authenticated;
