-- ═════════════════════════════════════════════════════════════════════════
-- HRP — Supabase Storage bucket setup for product images
-- Run this in Supabase Dashboard → SQL Editor if image uploads in the
-- admin product page are failing.
-- ═════════════════════════════════════════════════════════════════════════

-- 1) Create the bucket (idempotent — won't error if it already exists).
--    `public = true` makes the files readable via the public CDN URL,
--    which is what getPublicUrl() in the app expects.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,  -- 5 MB
  array['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- 2) Drop any old policies on this bucket (clean slate)
drop policy if exists "product-images public read"  on storage.objects;
drop policy if exists "product-images authed insert" on storage.objects;
drop policy if exists "product-images authed update" on storage.objects;
drop policy if exists "product-images authed delete" on storage.objects;

-- 3) Public read — anyone can view product images on the site
create policy "product-images public read"
on storage.objects for select
to public
using (bucket_id = 'product-images');

-- 4) Authenticated insert — only signed-in admins can upload
create policy "product-images authed insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'product-images');

-- 5) Authenticated update — admins can replace/modify images
create policy "product-images authed update"
on storage.objects for update
to authenticated
using (bucket_id = 'product-images')
with check (bucket_id = 'product-images');

-- 6) Authenticated delete — admins can remove old images
create policy "product-images authed delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'product-images');

-- ═════════════════════════════════════════════════════════════════════════
-- After running this, image upload in /admin/dashboard/product should work.
-- If it still fails, open the browser console and check the error message
-- printed by [uploadImg]. The most common remaining causes are:
--   - You are signed out of the admin (auth.uid() is null)
--   - The file exceeds 5 MB
--   - Network / CORS on a self-hosted Supabase install
-- ═════════════════════════════════════════════════════════════════════════
