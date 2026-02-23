
INSERT INTO storage.buckets (id, name, public)
VALUES ('module-videos', 'module-videos', true);

CREATE POLICY "Managers can upload module videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'module-videos'
  AND public.has_role(auth.uid(), 'manager')
);

CREATE POLICY "Authenticated users can view module videos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'module-videos');

CREATE POLICY "Managers can delete module videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'module-videos'
  AND public.has_role(auth.uid(), 'manager')
);
