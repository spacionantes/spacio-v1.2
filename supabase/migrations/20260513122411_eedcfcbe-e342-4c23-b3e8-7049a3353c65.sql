-- 1. Add user_id to leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id uuid;
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);

-- Backfill existing leads from auth.users matching by email
UPDATE public.leads l
SET user_id = u.id
FROM auth.users u
WHERE l.user_id IS NULL AND lower(l.email) = lower(u.email);

-- Replace the unsafe email-based SELECT policy
DROP POLICY IF EXISTS "Users can read their own leads by email" ON public.leads;

CREATE POLICY "Users can read their own leads"
ON public.leads
FOR SELECT
TO authenticated
USING (user_id IS NOT NULL AND user_id = auth.uid());

-- Ensure inserts can only set user_id to themselves (or null for anonymous)
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
TO public
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 2. Lock down listing-photos write access (public read stays)
DROP POLICY IF EXISTS "Deny public writes to listing-photos" ON storage.objects;
DROP POLICY IF EXISTS "Deny public updates to listing-photos" ON storage.objects;
DROP POLICY IF EXISTS "Deny public deletes to listing-photos" ON storage.objects;

CREATE POLICY "Deny public writes to listing-photos"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id <> 'listing-photos');

CREATE POLICY "Deny public updates to listing-photos"
ON storage.objects FOR UPDATE TO public
USING (bucket_id <> 'listing-photos');

CREATE POLICY "Deny public deletes to listing-photos"
ON storage.objects FOR DELETE TO public
USING (bucket_id <> 'listing-photos');

-- 3. Realtime messages: drop overly permissive policies if any exist
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'realtime' AND tablename = 'messages'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON realtime.messages', pol.policyname);
  END LOOP;
END $$;
