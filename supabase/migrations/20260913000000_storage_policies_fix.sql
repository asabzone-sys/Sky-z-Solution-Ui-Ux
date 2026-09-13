-- ============================================================================
-- FIX: Storage uploads fail with "new row violates row-level security policy"
-- even for signed-in admins.
--
-- Root cause: Supabase Storage's security hardening (storage schema now runs
-- with security invoker semantics) evaluates storage.objects policies for the
-- calling session AND the table owner. Policies without an explicit role
-- target (TO authenticated / TO anon) are created against the table owner and
-- break that evaluation, so uploads 403 even when the INSERT policy exists
-- and the JWT is valid. (Supabase docs: Troubleshooting → Storage error 403
-- "new row violates row-level security policy" on upload.)
--
-- Remediation: recreate every `media` bucket policy with explicit role
-- targets, mirroring the official docs pattern. Idempotent — safe to re-run.
-- Run in: Supabase Dashboard → SQL Editor → paste → Run
-- ============================================================================

-- Drop the four media policies (IF EXISTS keeps this re-runnable).
drop policy if exists "public read media"   on storage.objects;
drop policy if exists "staff upload media"  on storage.objects;
drop policy if exists "staff replace media" on storage.objects;
drop policy if exists "admin delete media"  on storage.objects;

-- Legacy misspellings from earlier attempts (harmless if absent).
drop policy if exists "public read media (fixed)" on storage.objects;
drop policy if exists "staff upload media (fixed)" on storage.objects;
drop policy if exists "staff replace media (fixed)" on storage.objects;
drop policy if exists "admin delete media (fixed)" on storage.objects;

-- ------------------------------------------------------------------- read --
-- Public buckets are served anonymously without this policy, but SELECT is
-- still required for the INSERT ... RETURNING * round-trip on upload and for
-- list operations used by dashboards.
create policy "public read media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'media');

-- ----------------------------------------------------------------- insert --
-- Explicit `to authenticated` is the critical fix: the policy must evaluate
-- against the signed-in admin/editor JWT, not the table owner.
create policy "staff upload media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'media'
  and public.my_role() in ('admin', 'editor')
);

-- ----------------------------------------------------------------- update --
-- Needed for overwrite-style uploads (upsert: true) and metadata updates.
create policy "staff replace media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'media'
  and public.my_role() in ('admin', 'editor')
)
with check (
  bucket_id = 'media'
  and public.my_role() in ('admin', 'editor')
);

-- ----------------------------------------------------------------- delete --
create policy "admin delete media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'media'
  and public.my_role() = 'admin'
);

-- ----------------------------------------------------------------------------
-- Verification (run separately, expect 't' on every row):
--   select schemaname, tablename, policyname, roles, cmd
--   from pg_policies
--   where schemaname = 'storage' and tablename = 'objects'
--     and policyname like '%media%';
-- Every row must list roles = {anon,authenticated} or {authenticated}
-- — a row with roles = {postgres} means the fix has not been applied.
-- ----------------------------------------------------------------------------
