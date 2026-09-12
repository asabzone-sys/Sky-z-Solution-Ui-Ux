-- Backfill: create profile rows for any auth users missing one (first = admin)
insert into public.profiles (id, email, full_name, role)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', ''),
       case when not exists (select 1 from public.profiles) then 'admin' else 'editor' end
from auth.users u
on conflict (id) do nothing;

-- Harden the signup trigger: never block user creation on profile errors
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    case when not exists (select 1 from public.profiles) then 'admin' else 'editor' end
  )
  on conflict (id) do nothing;
  return new;
exception when others then
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
