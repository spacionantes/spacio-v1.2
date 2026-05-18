## Diagnostic PageSpeed actuel (spacionantes.fr)

| Métrique | Mobile | Desktop | Cible |
|---|---|---|---|
| Performance | 34 | 59 | 90+ |
| LCP | 5.8 s | 0.9 s | < 2.5 s |
| TBT | 23.6 s | 22.4 s | < 200 ms |
| Speed Index | 16 s | 9.9 s | < 3.4 s |
| Poids total | 3.2 MB | 3.2 MB | < 1.5 MB |

**Coupable principal** : la scène **Spline 3D** du Hero (gros bundle WebGL, exécution main-thread massive, 20 long tasks, 39 s de JS parsing). C'est ~70 % du problème à elle seule.

---

## Roadmap en 3 phases

### Phase 1 — Quick wins (impact énorme, ~2 h de dev)

1. **Différer le Hero Spline 3D**
   - Lazy-load via `IntersectionObserver` ou `requestIdleCallback` (le canvas ne se charge qu'après le LCP / interaction utilisateur).
   - Afficher un **poster image statique** (WebP optimisé) avant l'hydratation 3D → LCP immédiat.
   - Sur mobile, désactiver Spline et n'afficher que le poster (économie ~2 MB et 20 s de CPU).

2. **Optimiser les images** (économie estimée : 1.4 MB)
   - Convertir toutes les `.png` / `.jpg` du dossier `src/assets` et `public/` en **WebP** (script `sharp` one-shot).
   - Ajouter `width`/`height` explicites et `loading="lazy"` sauf sur l'image LCP.
   - Préciser `fetchpriority="high"` sur l'image Hero.

3. **Preload de l'image LCP + font-display**
   - `<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">` dans `index.html`.
   - Ajouter `&display=swap` sur l'import Google Fonts Inter (déjà fait : vérifier).

4. **Render blocking** (économie : 240–460 ms)
   - Charger l'import Google Fonts via `<link rel="preload">` + `media="print" onload`.
   - Vérifier qu'aucun script tiers n'est synchrone dans `<head>`.

### Phase 2 — Bundle JS (impact fort, ~3 h)

5. **Code-splitting des routes** (économie : 535 KiB de JS inutilisé)
   - Convertir toutes les pages de `src/App.tsx` en `React.lazy()` + `<Suspense>`.
   - Vérifier que Leaflet, markercluster et Spline ne sont importés que dans leurs pages respectives (Explorer, Index).

6. **Tree-shaking des libs lourdes**
   - Auditer `framer-motion`, `lucide-react`, `recharts`, `embla-carousel` → imports nommés uniquement.
   - Configurer `manualChunks` dans `vite.config.ts` pour isoler vendor/leaflet/spline/charts.

7. **Modern build (no legacy)**
   - Vérifier `build.target: 'es2020'` dans `vite.config.ts` pour éviter les polyfills inutiles.

### Phase 3 — Infra & cache (impact moyen, ~1 h)

8. **Cache lifetimes** (économie : 1.3 MB sur visites répétées)
   - Lovable sert déjà des assets hashés ; vérifier les headers `Cache-Control: public, max-age=31536000, immutable` sur `/assets/*`. Si le domaine custom passe par un proxy, configurer les headers.

9. **Préconnexions**
   - `<link rel="preconnect">` vers `fonts.gstatic.com`, `prod.spline.design`, Supabase (déjà fait).

10. **Compression**
    - Vérifier que Brotli/Gzip est actif sur le domaine custom `spacionantes.fr`.

---

## Détails techniques

**Fichiers principalement touchés :**
- `src/pages/Index.tsx` — lazy-load Spline + poster image LCP
- `src/App.tsx` — `React.lazy()` sur toutes les routes
- `vite.config.ts` — `build.target`, `manualChunks`, `vite-imagetools`
- `index.html` — preload LCP, preload font, preconnect
- `public/` + `src/assets/` — conversion WebP

**Gains attendus après phase 1+2 :**
- LCP mobile : 5.8 s → ~1.8 s
- TBT : 23.6 s → ~300 ms
- Score Performance : 34 → 85–95

---

## Question avant de démarrer

Veux-tu que j'attaque **toute la roadmap d'un coup**, ou seulement la **Phase 1 (Spline + images)** qui apportera 80 % du gain ? La phase 1 est non-destructrice et la plus rentable.
