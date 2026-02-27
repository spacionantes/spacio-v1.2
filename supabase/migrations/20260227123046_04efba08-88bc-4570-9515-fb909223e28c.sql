-- Remove email column from diagnostic_results to eliminate duplicate PII storage
ALTER TABLE public.diagnostic_results DROP COLUMN email;