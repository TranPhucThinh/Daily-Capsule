alter table public.capsules
  add column if not exists is_keepsake boolean not null default false;
