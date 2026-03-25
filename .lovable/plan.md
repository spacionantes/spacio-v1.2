

## Support multiple photos per listing

Currently each listing has a single `image_url` (text column). To support multiple photos, we need a new `listing_images` table and a carousel in the UI.

### Changes

**1. New `listing_images` table (migration)**

```sql
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
```

**2. Update `Space` type and `useListings` hook**

- Add optional `images: string[]` field to the `Space` interface in `mockData.ts`
- In `useListings.ts`, after fetching listings, fetch all images from `listing_images` grouped by `listing_id`, merge them into each space object
- Fall back to `[image_url]` if no images exist in the new table

**3. Image carousel in `SpaceDetailDialog`**

- Replace the single `<img>` with an Embla carousel (using the existing `Carousel` components) showing all photos
- Add dot indicators and prev/next arrows

**4. SpaceCard thumbnail**

- Keep showing the first image only (no change needed, uses `image_url` or `images[0]`)

### Data entry

Photos are managed via the Supabase dashboard or SQL inserts into `listing_images`. The existing `image_url` column on `listings` continues to serve as the primary/fallback image.

