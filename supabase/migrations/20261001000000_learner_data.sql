create table if not exists public.learner_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_id text not null,
  progress jsonb not null,
  primary key (user_id, item_id)
);

create table if not exists public.learner_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  settings jsonb not null
);

create table if not exists public.learner_days (
  user_id uuid not null references auth.users(id) on delete cascade,
  day_key text not null check (day_key ~ '^\d{4}-\d{2}-\d{2}$'),
  count integer not null check (count >= 0),
  primary key (user_id, day_key)
);

alter table public.learner_progress enable row level security;
alter table public.learner_settings enable row level security;
alter table public.learner_days enable row level security;

create policy "Learners can read their own progress" on public.learner_progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners can add their own progress" on public.learner_progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners can update their own progress" on public.learner_progress for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners can delete their own progress" on public.learner_progress for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Learners can read their own settings" on public.learner_settings for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners can add their own settings" on public.learner_settings for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners can update their own settings" on public.learner_settings for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners can delete their own settings" on public.learner_settings for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Learners can read their own daily stats" on public.learner_days for select to authenticated using ((select auth.uid()) = user_id);
create policy "Learners can add their own daily stats" on public.learner_days for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Learners can update their own daily stats" on public.learner_days for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Learners can delete their own daily stats" on public.learner_days for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.learner_progress to authenticated;
grant select, insert, update, delete on public.learner_settings to authenticated;
grant select, insert, update, delete on public.learner_days to authenticated;

create or replace function public.save_learner_progress(p_item_id text, p_progress jsonb)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required';
  end if;

  insert into public.learner_progress as current_progress (user_id, item_id, progress)
  values ((select auth.uid()), p_item_id, p_progress)
  on conflict (user_id, item_id) do update
    set progress = excluded.progress
    where
      coalesce((excluded.progress ->> 'lastPracticed')::bigint, 0) > coalesce((current_progress.progress ->> 'lastPracticed')::bigint, 0)
      or (
        coalesce((excluded.progress ->> 'lastPracticed')::bigint, 0) = coalesce((current_progress.progress ->> 'lastPracticed')::bigint, 0)
        and coalesce((excluded.progress ->> 'right')::bigint, 0) + coalesce((excluded.progress ->> 'wrong')::bigint, 0)
          > coalesce((current_progress.progress ->> 'right')::bigint, 0) + coalesce((current_progress.progress ->> 'wrong')::bigint, 0)
      );
end;
$$;

revoke all on function public.save_learner_progress(text, jsonb) from public;
grant execute on function public.save_learner_progress(text, jsonb) to authenticated;
