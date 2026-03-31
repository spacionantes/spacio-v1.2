INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true);

CREATE POLICY "Public read access on listing-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-photos');