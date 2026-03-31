

## Créer le bucket de stockage pour les photos

### Résumé
Créer un bucket Supabase `listing-photos` pour que tu puisses uploader tes photos depuis le dashboard Supabase, puis utiliser leurs URLs dans les listings.

### Étape unique — Migration SQL

Créer le bucket public `listing-photos` avec une politique de lecture publique :

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-photos', 'listing-photos', true);

CREATE POLICY "Public read access on listing-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'listing-photos');
```

### Aucun changement de code
Le code existant utilise déjà des URLs pour `image_url` et `listing_images`. Il suffit de copier l'URL publique d'une photo uploadée et de la coller dans la table.

### Utilisation
1. Dashboard Supabase → **Storage** → bucket `listing-photos`
2. Upload tes photos
3. Copie l'URL publique
4. Colle-la dans `image_url` (table `listings`) ou dans `listing_images`

