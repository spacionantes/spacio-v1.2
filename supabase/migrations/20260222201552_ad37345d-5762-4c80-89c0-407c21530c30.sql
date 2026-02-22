
CREATE TABLE public.diagnostic_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  score INTEGER NOT NULL,
  ratio NUMERIC NOT NULL,
  grid JSONB NOT NULL,
  advice_category TEXT NOT NULL
);

ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert diagnostic results"
ON public.diagnostic_results
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only service role can read diagnostic results"
ON public.diagnostic_results
FOR SELECT
USING (false);
