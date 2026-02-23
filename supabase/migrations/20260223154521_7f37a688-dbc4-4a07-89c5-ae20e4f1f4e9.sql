
-- Create a public storage bucket for module images
INSERT INTO storage.buckets (id, name, public)
VALUES ('module-images', 'module-images', true);

-- Allow authenticated managers to upload files
CREATE POLICY "Managers can upload module images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'module-images'
  AND public.has_role(auth.uid(), 'manager')
);

-- Allow anyone authenticated to view module images
CREATE POLICY "Authenticated users can view module images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'module-images');

-- Allow managers to delete their uploaded images
CREATE POLICY "Managers can delete module images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'module-images'
  AND public.has_role(auth.uid(), 'manager')
);
