begin;
create table if not exists public.exercise_report_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 created_at timestamptz not null default now()
);
alter table public.exercise_report_admins enable row level security;
revoke all on public.exercise_report_admins from anon,authenticated;
grant select on public.exercise_report_admins to authenticated;
drop policy if exists "Read own report administrator membership" on public.exercise_report_admins;
create policy "Read own report administrator membership" on public.exercise_report_admins for select to authenticated using(user_id=auth.uid());
create or replace function public.is_exercise_report_admin() returns boolean
language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.exercise_report_admins where user_id=auth.uid());
$$;
revoke all on function public.is_exercise_report_admin() from public;
grant execute on function public.is_exercise_report_admin() to authenticated;
create table if not exists public.exercise_reports (
 id uuid primary key, reporter_id uuid not null references auth.users(id) on delete cascade,
 category text not null check(category in ('answer_key','alternative_answer','unclear','media','suggestion')),
 description text not null check(length(description) between 1 and 4000),
 suggested_answer text not null default '' check(length(suggested_answer)<=1000),
 context jsonb not null check(jsonb_typeof(context)='object' and octet_length(context::text)<=24000),
 status text not null default 'received' check(status in ('received','reviewing','resolved','unchanged')),
 review_note text not null default '' check(length(review_note)<=4000),
 reviewed_by uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists exercise_reports_status_date on public.exercise_reports(status,created_at desc);
alter table public.exercise_reports enable row level security;
revoke all on public.exercise_reports from anon,authenticated;
grant select on public.exercise_reports to authenticated;
drop policy if exists "Read own reports or administrator inbox" on public.exercise_reports;
create policy "Read own reports or administrator inbox" on public.exercise_reports for select to authenticated using(reporter_id=auth.uid() or public.is_exercise_report_admin());
create or replace function public.submit_exercise_report(p_id uuid,p_category text,p_description text,p_suggested_answer text,p_context jsonb) returns uuid
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid(); snapshot jsonb:=p_context;
begin
 if uid is null then raise exception 'Sign in to report a question'; end if;
 if p_id is null or p_category is null or p_category not in ('answer_key','alternative_answer','unclear','media','suggestion')
 or length(btrim(coalesce(p_description,''))) not between 1 and 4000
 or length(coalesce(p_suggested_answer,''))>1000
 or jsonb_typeof(snapshot) is distinct from 'object'
 or octet_length(snapshot::text)>24000
 or jsonb_typeof(snapshot->'lessonId') is distinct from 'string' or snapshot->>'lessonId' !~ '^L(0[1-9]|1[0-8])$'
 or snapshot->>'skill' not in ('vocabulary','grammar','phrases','writing','reading','listening') or snapshot->>'skill' is null
 or jsonb_typeof(snapshot->'questionId') is distinct from 'string' or length(snapshot->>'questionId') not between 1 and 200
 or (snapshot->'questionVersion' is distinct from 'null'::jsonb and (jsonb_typeof(snapshot->'questionVersion') is distinct from 'number' or (snapshot->>'questionVersion')::integer<1))
 or jsonb_typeof(snapshot->'checked') is distinct from 'boolean'
 or jsonb_typeof(snapshot->'prompt') is distinct from 'string' or length(snapshot->>'prompt')>4000
 or jsonb_typeof(snapshot->'route') is distinct from 'string' or length(snapshot->>'route')>500
 or (snapshot - array['lessonId','skill','questionId','questionVersion','bankKey','sessionId','prompt','learnerAnswer','checked','correct','expectedAnswers','feedback','route'])<>'{}'::jsonb
 then raise exception 'Invalid exercise report'; end if;
 if exists(select 1 from jsonb_each(snapshot) e where e.key in ('bankKey','sessionId','learnerAnswer','feedback') and jsonb_typeof(e.value)<>'string')
 or (snapshot ? 'correct' and jsonb_typeof(snapshot->'correct') not in ('boolean','null'))
 or (snapshot ? 'expectedAnswers' and (jsonb_typeof(snapshot->'expectedAnswers')<>'array' or jsonb_array_length(snapshot->'expectedAnswers')>10)) then raise exception 'Invalid report snapshot'; end if;
 if snapshot ? 'expectedAnswers' and exists(select 1 from jsonb_array_elements(snapshot->'expectedAnswers') v where jsonb_typeof(v)<>'string') then raise exception 'Invalid report answers'; end if;
 if snapshot->'checked'='false'::jsonb then snapshot:=snapshot-array['expectedAnswers','feedback','correct']; end if;
 insert into public.exercise_reports(id,reporter_id,category,description,suggested_answer,context)
 values(p_id,uid,p_category,btrim(p_description),coalesce(p_suggested_answer,''),snapshot) on conflict(id) do nothing;
 if not exists(select 1 from public.exercise_reports where id=p_id and reporter_id=uid) then raise exception 'Report could not be saved'; end if;
 return p_id;
end $$;
revoke all on function public.submit_exercise_report(uuid,text,text,text,jsonb) from public;
grant execute on function public.submit_exercise_report(uuid,text,text,text,jsonb) to authenticated;
create or replace function public.review_exercise_report(p_id uuid,p_status text,p_note text) returns void
language plpgsql security definer set search_path='' as $$
begin
 if not public.is_exercise_report_admin() then raise exception 'Report administrator access required'; end if;
 if p_status is null or p_status not in ('received','reviewing','resolved','unchanged') or length(coalesce(p_note,''))>4000
 or (p_status in ('resolved','unchanged') and length(btrim(coalesce(p_note,'')))=0) then raise exception 'Choose a status and explain the decision'; end if;
 update public.exercise_reports set status=p_status,review_note=btrim(coalesce(p_note,'')),reviewed_by=auth.uid(),updated_at=now() where id=p_id;
 if not found then raise exception 'Report not found'; end if;
end $$;
revoke all on function public.review_exercise_report(uuid,text,text) from public;
grant execute on function public.review_exercise_report(uuid,text,text) to authenticated;
create or replace function public.exercise_reporting_readiness() returns jsonb
language sql stable security definer set search_path='' as $$
 select jsonb_build_object('schemaVersion',1,'ready',to_regclass('public.exercise_reports') is not null and to_regprocedure('public.submit_exercise_report(uuid,text,text,text,jsonb)') is not null);
$$;
revoke all on function public.exercise_reporting_readiness() from public;
grant execute on function public.exercise_reporting_readiness() to anon,authenticated;
notify pgrst,'reload schema';
commit;
