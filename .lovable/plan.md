

## Layout côte à côte : Texte à gauche, Spline 3D à droite

### Changements (`src/pages/Index.tsx`)

Transformer le hero d'un layout superposé (Spline en arrière-plan + overlay) en un layout **deux colonnes** :

1. **Supprimer** le Spline en `absolute inset-0` et l'overlay sombre `bg-black/40`
2. **Remplacer** par un grid `lg:grid-cols-2` dans le container :
   - **Colonne gauche** : texte (titre, description, dropdown) aligné à gauche avec `text-left`
   - **Colonne droite** : composant Spline dans un conteneur de hauteur fixe (~500px), toujours avec `pointer-events-none`
3. **Mobile** : les deux colonnes s'empilent verticalement (texte en haut, Spline en dessous, hauteur réduite ~300px)
4. Conserver le fond sombre `bg-[rgb(10,10,40)]` sur la section, sans overlay nécessaire puisque le texte et le 3D ne se chevauchent plus

```text
<section bg-[rgb(10,10,40)]>
  <div container>
    <div grid lg:grid-cols-2 items-center gap-12>
      ├── <div>           ← Texte + dropdown (aligné gauche)
      └── <div h-[500px]> ← Spline 3D (pointer-events-none)
    </div>
  </div>
</section>
```

Un seul fichier modifié, aucune nouvelle dépendance.

