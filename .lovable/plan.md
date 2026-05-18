## Objectif

Remplacer la grille 2 colonnes de la section **"Une solution pour tous"** par un scroll parallax style sticky-image : l'utilisateur traverse d'abord le bloc **Associations** (amber), puis le bloc **Propriétaires** (indigo). Le contenu riche (badge, titre, description, liste à puces) reste lisible et conserve son identité couleur.

## Ce que je vais faire

### 1. Étendre `TextParallaxContent`
Ajouter un mode "content overlay" : au lieu d'afficher juste `subheading + heading` au centre de l'image fixe, on superpose une **carte de contenu détaillée** (badge, titre, paragraphe justifié, liste de bénéfices) ancrée à gauche ou à droite, avec un fade/parallax synchronisé au scroll. La carte garde le style verre dépoli (`backdrop-blur` + `bg-white/10` + bordure colorée) pour rester lisible sur l'image.

Props ajoutées :
- `accent: "indigo" | "amber"` — pilote bordures, badge, icône check
- `icon: LucideIcon` — Heart pour assos, Building2 pour propriétaires
- `bullets: string[]` — liste de bénéfices
- `align: "left" | "right"` — position de la carte sur l'image

### 2. Refondre la section dans `src/pages/Index.tsx`
- Conserver le titre "Une solution pour tous" + sous-titre en intro
- Remplacer la grille `lg:grid-cols-2` par deux `<TextParallaxContent>` empilés :
  1. **Associations** (amber, Heart, image chaleureuse de réunion associative)
  2. **Propriétaires** (indigo, Building2, image d'espace pro/bureau)
- Récupérer tout le contenu existant (titres, descriptions, listes de 4–5 puces) sans le perdre

### 3. Nettoyer le doublon
Supprimer les deux blocs `<TextParallaxContent>` génériques ajoutés précédemment entre `FeaturedSpaces` et "Comment ça marche" — ils faisaient déjà la même promesse de manière moins riche, donc deviendraient redondants.

### 4. Images
Utiliser deux URLs Unsplash adaptées (espace asso chaleureux + bureau lumineux), avec un overlay sombre pour assurer la lisibilité du contenu blanc par-dessus.

## Détails techniques

- Hauteur de chaque bloc : `150vh` (laisse le temps de lire pendant le sticky)
- Animation : `useScroll` + `useTransform` sur opacity + translateY de la carte de contenu (apparition au milieu, disparition à la sortie)
- Sur mobile (<1024px) : carte affichée en plein, image en fond, padding réduit pour éviter le débordement
- Couleurs : bordure `border-amber/40` ou `border-indigo/40`, badge identique à l'existant, puces ✓ amber-dark / indigo

## Hors scope

- Pas de changement sur les sections Hero, "Comment ça marche", Footer
- Pas de modification des textes existants (seulement déplacés)
- Pas de nouvelles dependencies (framer-motion déjà utilisé)
