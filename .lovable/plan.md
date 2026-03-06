

## Agrandir la colonne gauche du Hero

### Changement (`src/pages/Index.tsx`, ligne 87)

Remplacer le grid égal `lg:grid-cols-2` par un grid asymétrique `lg:grid-cols-[3fr_2fr]` et réduire le gap de `gap-12` à `gap-4` pour rapprocher le texte du Spline.

```
- <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
+ <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] items-center gap-4">
```

La colonne texte occupera 60% de la largeur au lieu de 50%, et l'espacement réduit rapprochera les deux éléments.

