
-- Create blog table
CREATE TABLE public.blog (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  image_url text,
  author text NOT NULL,
  read_time_min integer NOT NULL DEFAULT 5,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS policies
ALTER TABLE public.blog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog articles are publicly readable"
ON public.blog FOR SELECT USING (true);

CREATE POLICY "Only service role can insert blog"
ON public.blog FOR INSERT WITH CHECK (false);

CREATE POLICY "Only service role can update blog"
ON public.blog FOR UPDATE USING (false);

CREATE POLICY "Only service role can delete blog"
ON public.blog FOR DELETE USING (false);

-- Trigger updated_at
CREATE TRIGGER update_blog_updated_at
BEFORE UPDATE ON public.blog
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
