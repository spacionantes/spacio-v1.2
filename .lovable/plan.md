

## Intégration Spline 3D dans le Hero

### Changements

1. **Installer `@splinetool/react-spline`** (nouvelle dépendance)

2. **`src/pages/Index.tsx`** — Remplacer le `BackgroundGradientAnimation` par le composant Spline :
   - Wrapper Spline dans une `div` avec `absolute inset-0 z-0 pointer-events-none`
   - Ajouter un overlay sombre semi-transparent (`absolute inset-0 bg-black/50`) pour la lisibilité du texte
   - Passer le contenu textuel en `relative z-10`
   - Utiliser `React.lazy` + `Suspense` pour le chargement paresseux du composant Spline
   - Conserver le fond sombre statique (`bg-[rgb(10,10,40)]`) comme fallback pendant le chargement
   - Scène : `https://prod.spline.design/P521XWBOsGLegwiX/scene.splinecode`

3. **Supprimer l'import de `BackgroundGradientAnimation`** (plus utilisé dans le Hero)

### Structure résultante

```text
<section class="relative z-10 bg-[rgb(10,10,40)] min-h-[auto] py-20 lg:py-32">
  ├── <div class="absolute inset-0 z-0 pointer-events-none">  ← Spline (lazy)
  ├── <div class="absolute inset-0 z-[1] bg-black/40">        ← Overlay lisibilité
  └── <div class="container relative z-10">                    ← Contenu texte + dropdown
</section>
```

