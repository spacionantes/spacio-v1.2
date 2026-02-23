
## Integrer le composant BackgroundGradientAnimation dans le hero de la page d'accueil

### Objectif
Remplacer les blobs statiques du fond du hero (les 3 divs avec radial-gradient + blur) par le composant animé `BackgroundGradientAnimation`, qui ajoute un effet interactif au curseur de la souris.

### Etapes techniques

**1. Creer le composant**
- Ajouter `src/components/ui/background-gradient-animation.tsx` avec le code fourni (adapte pour un projet non-Next.js : retirer `"use client"`)

**2. Etendre tailwind.config.ts**
- Ajouter les keyframes `moveHorizontal`, `moveInCircle`, `moveVertical`
- Ajouter les animations correspondantes (`first`, `second`, `third`, `fourth`, `fifth`)

**3. Ajouter les styles CSS necessaires**
- Ajouter dans `src/index.css` les styles pour les gradients SVG et les blobs (variables CSS, classes pour les elements internes du composant)

**4. Modifier `src/pages/Index.tsx`**
- Remplacer le bloc de fond actuel (les 3 divs radial-gradient aux lignes 35-39) par le composant `BackgroundGradientAnimation`
- Adapter les couleurs du gradient aux teintes du hero actuel (bleu/indigo/violet fonce) pour rester coherent avec la charte Spacio :
  - `gradientBackgroundStart`: `"rgb(10, 10, 40)"` (navy fonce)
  - `gradientBackgroundEnd`: `"rgb(20, 20, 80)"` (indigo fonce)
  - Couleurs des blobs adaptees aux teintes orange/bleu/violet actuelles
- Le contenu du hero (titre, barre de recherche, stats) sera passe en `children` du composant

### Resultat attendu
Le hero de la page d'accueil aura un fond anime avec des blobs de couleur qui bougent de maniere fluide, et un blob supplementaire qui suit le curseur de la souris pour un effet interactif.
