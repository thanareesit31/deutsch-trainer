-- Practice snapshots stay separate from mastery and learning evidence.
begin;
create table if not exists public.learner_practice_sessions (
 user_id uuid not null references auth.users(id) on delete cascade,
 bank_key text not null check (bank_key in ('es-gibt','dativ','verbs','grammar-basic','daily')),
 session_id text not null,
 state jsonb not null check (jsonb_typeof(state)='object'),
 updated_at timestamptz not null default now(),
 primary key(user_id,bank_key,session_id)
);
alter table public.learner_practice_sessions enable row level security;
drop policy if exists "Read own practice sessions" on public.learner_practice_sessions;
create policy "Read own practice sessions" on public.learner_practice_sessions for select to authenticated using ((select auth.uid())=user_id);
grant select on public.learner_practice_sessions to authenticated;
create or replace function public.sync_practice_session(p_bank_key text,p_state jsonb) returns void
language plpgsql security definer set search_path=public as $$
declare uid uuid:=auth.uid(); previous jsonb; merged jsonb; incoming jsonb; stored jsonb; items jsonb:='[]'::jsonb; i integer;
begin
 if uid is null then raise exception 'Login required'; end if;
 if jsonb_typeof(p_state)<>'object' or coalesce(p_state->>'id','')='' or jsonb_typeof(p_state->'items')<>'array' or jsonb_array_length(p_state->'items') not between 1 and 100 or octet_length(p_state::text)>500000 then raise exception 'Invalid practice session'; end if;
 -- Serialize a session across devices, including concurrent first inserts.
 perform pg_advisory_xact_lock(hashtextextended(uid::text||p_bank_key||(p_state->>'id'),0));
 select state into previous from learner_practice_sessions where user_id=uid and bank_key=p_bank_key and session_id=p_state->>'id';
 if previous is null then merged:=p_state;
 else
  if previous->'items'->0->'question'->>'id' is distinct from p_state->'items'->0->'question'->>'id' or jsonb_array_length(previous->'items')<>jsonb_array_length(p_state->'items') then raise exception 'Session questions changed'; end if;
  merged:=case when coalesce(p_state->>'updatedAt',p_state->>'createdAt','')>=coalesce(previous->>'updatedAt',previous->>'createdAt','') then p_state else previous end;
  for i in 0..jsonb_array_length(previous->'items')-1 loop
   stored:=previous->'items'->i; incoming:=p_state->'items'->i;
   if stored->'question'->>'id' is distinct from incoming->'question'->>'id' then raise exception 'Session questions changed'; end if;
   -- First submitted answers cannot be erased by a stale device.
   items:=items||jsonb_build_array(case when stored->'attempt' is not null and stored->'attempt'<>'null'::jsonb then case when stored->'attempt'->>'status'='pending' and incoming->'attempt'->>'status'='completed' and stored->'attempt'->>'submittedAt'=incoming->'attempt'->>'submittedAt' and stored->'attempt'->>'response'=incoming->'attempt'->>'response' then incoming else stored end when incoming->'attempt' is not null and incoming->'attempt'<>'null'::jsonb then incoming else merged->'items'->i end);
  end loop;
  merged:=merged||jsonb_build_object('items',items,'completed',coalesce((previous->>'completed')::boolean,false) or coalesce((p_state->>'completed')::boolean,false),'position',greatest((previous->>'position')::integer,(p_state->>'position')::integer));
 end if;
 insert into learner_practice_sessions(user_id,bank_key,session_id,state) values(uid,p_bank_key,p_state->>'id',merged)
 on conflict(user_id,bank_key,session_id) do update set state=excluded.state,updated_at=now();
end $$;
revoke all on function public.sync_practice_session(text,jsonb) from public;
grant execute on function public.sync_practice_session(text,jsonb) to authenticated;
commit;
