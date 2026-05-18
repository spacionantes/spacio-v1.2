-- 1) Realtime: l'app n'utilise pas Realtime côté client. Bloquer toute souscription.
DROP POLICY IF EXISTS "Authenticated users can access realtime messages" ON realtime.messages;

-- 2) Storage: empêcher le listing du bucket public listing-photos.
-- Le bucket reste public donc les URLs directes (CDN public) continuent de fonctionner.
DROP POLICY IF EXISTS "Public read access on listing-photos" ON storage.objects;

-- 3) Révoquer EXECUTE sur toutes les fonctions SECURITY DEFINER du schéma public
-- aux rôles anon et authenticated (les triggers utilisent les droits du propriétaire).
DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.prosecdef = true
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %I.%I(%s) FROM anon, authenticated, public',
                   fn.nspname, fn.proname, fn.args);
  END LOOP;
END $$;