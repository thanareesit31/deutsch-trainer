-- Lesson activity drafts are separate from practice evidence and mastery.
begin;
create table if not exists public.learner_lesson_states (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_key text not null check (lesson_key in (
    'deutsch-trainer-alphabet-learning-v1-L01',
    'deutsch-trainer-vocabulary-image-learning-v1-L01',
    'deutsch-trainer-verb-learning-L01'
  )),
  state jsonb not null check (jsonb_typeof(state) in ('object', 'array')),
  primary key (user_id, lesson_key)
);
alter table public.learner_lesson_states enable row level security;
drop policy if exists "Read own lesson states" on public.learner_lesson_states;
create policy "Read own lesson states" on public.learner_lesson_states for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "Insert own lesson states" on public.learner_lesson_states;
create policy "Insert own lesson states" on public.learner_lesson_states for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "Update own lesson states" on public.learner_lesson_states;
create policy "Update own lesson states" on public.learner_lesson_states for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
grant select, insert, update on public.learner_lesson_states to authenticated;
commit;
