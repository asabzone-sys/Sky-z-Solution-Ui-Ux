-- Cleanup: one account per email. Remove duplicate signups, keep the
-- confirmed user with a profile, and guarantee the admin role.
delete from auth.users
where email = 'skyz.solutions2000@gmail.com'
  and id not in (select id from public.profiles where email = 'skyz.solutions2000@gmail.com');

update public.profiles set role = 'admin'
where email = 'skyz.solutions2000@gmail.com' and role <> 'admin';
