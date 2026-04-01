ALTER TABLE public.listings
  ADD COLUMN available_from TIME DEFAULT NULL,
  ADD COLUMN available_to TIME DEFAULT NULL,
  ADD COLUMN available_days TEXT[] DEFAULT '{}'::text[],
  ADD COLUMN available_start_date DATE DEFAULT NULL,
  ADD COLUMN available_end_date DATE DEFAULT NULL;