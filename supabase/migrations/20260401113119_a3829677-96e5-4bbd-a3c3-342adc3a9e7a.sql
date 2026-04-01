ALTER TABLE public.leads
  ADD COLUMN desired_date DATE DEFAULT NULL,
  ADD COLUMN desired_start_time TIME DEFAULT NULL,
  ADD COLUMN desired_end_time TIME DEFAULT NULL;