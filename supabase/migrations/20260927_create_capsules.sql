create table if not exists public.capsules (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null,
  mood text not null check (mood in ('heavy', 'still', 'good', 'light', 'alive')),
  note text not null check (char_length(note) between 1 and 180),
  image_path text,
  image_alt text,
  sealed_at timestamptz not null,
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.capsules enable row level security;

create policy "Users manage their own capsules"
  on public.capsules
  for all
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public)
values ('capsule-images', 'capsule-images', false)
on conflict (id) do nothing;

create policy "Users manage their own capsule images"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'capsule-images' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'capsule-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
