
-- Table leads pour capturer les soumissions de formulaire
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_type TEXT NOT NULL,
  organization_name TEXT NOT NULL,
  activity_type TEXT,
  space_type TEXT,
  city TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  space_id TEXT,
  space_title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table listings pour gérer les espaces
CREATE TABLE public.listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  price_per_hour NUMERIC NOT NULL,
  surface_m2 INTEGER NOT NULL,
  capacity INTEGER NOT NULL,
  image_url TEXT,
  type TEXT NOT NULL,
  amenities TEXT[] DEFAULT '{}',
  rating NUMERIC DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS leads : insertion publique, lecture admin uniquement
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only service role can read leads"
  ON public.leads FOR SELECT
  USING (false);

-- RLS listings : lecture publique, écriture admin via service role
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Listings are publicly readable"
  ON public.listings FOR SELECT
  USING (true);

CREATE POLICY "Only service role can insert listings"
  ON public.listings FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only service role can update listings"
  ON public.listings FOR UPDATE
  USING (false);

CREATE POLICY "Only service role can delete listings"
  ON public.listings FOR DELETE
  USING (false);

-- Trigger updated_at pour listings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
