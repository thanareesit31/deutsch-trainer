begin;
create or replace function public.release_course_readiness() returns jsonb
language sql stable security definer set search_path='' as $$
  select jsonb_build_object(
    'courses', (select count(distinct (lesson_id,skill)) from public.release_course_cards),
    'cards', (select count(*) from public.release_course_cards),
    'tasks', (select count(*) from public.release_course_tasks where definition is not null),
    'phraseTasks', (select count(*) from public.phrase_practice_questions where id ~ '^L1[5-8]-D[0-9]{2}-[AB]-try-v1$'),
    'practiceSyncReady', position('a13-release' in pg_get_functiondef('public.sync_practice_session(text,jsonb)'::regprocedure)) > 0
  );
$$;
revoke all on function public.release_course_readiness() from public;
grant execute on function public.release_course_readiness() to anon,authenticated;
notify pgrst, 'reload schema';
commit;
