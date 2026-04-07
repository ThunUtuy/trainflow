
ALTER TABLE public.establishments
  ADD COLUMN description text DEFAULT NULL,
  ADD COLUMN image_url text DEFAULT NULL;

INSERT INTO storage.buckets (id, name, public)
VALUES ('establishment-images', 'establishment-images', true);

CREATE POLICY "Anyone can read establishment images"
ON storage.objects FOR SELECT
USING (bucket_id = 'establishment-images');

CREATE POLICY "Managers can upload establishment images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'establishment-images'
  AND has_role(auth.uid(), 'manager'::app_role)
);

CREATE POLICY "Managers can update establishment images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'establishment-images'
  AND has_role(auth.uid(), 'manager'::app_role)
);

CREATE POLICY "Managers can delete establishment images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'establishment-images'
  AND has_role(auth.uid(), 'manager'::app_role)
);
