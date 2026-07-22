-- Allow public read (so images load on the website)
CREATE POLICY "Public read notice-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'notice-images');

-- Allow anyone to upload (admin panel uses anon key)
CREATE POLICY "Allow upload notice-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'notice-images');

-- Allow anyone to update (overwrite/upsert)
CREATE POLICY "Allow update notice-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'notice-images');

-- Allow anyone to delete
CREATE POLICY "Allow delete notice-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'notice-images');
