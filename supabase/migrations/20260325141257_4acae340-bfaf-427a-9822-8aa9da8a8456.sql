CREATE TABLE public.listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listing images are publicly readable"
  ON public.listing_images FOR SELECT TO public USING (true);

CREATE POLICY "Only service role can insert listing images"
  ON public.listing_images FOR INSERT TO public WITH CHECK (false);

CREATE POLICY "Only service role can update listing images"
  ON public.listing_images FOR UPDATE TO public USING (false);

CREATE POLICY "Only service role can delete listing images"
  ON public.listing_images FOR DELETE TO public USING (false);