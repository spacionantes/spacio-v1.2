

## Menu déroulant "Propriétaire d'espace" dans le Header

### Changement

Regrouper les liens **Diagnostic** et **Devenir hôte** sous un nouveau dropdown "Propriétaire d'espace", exactement comme le dropdown "À propos" existant (Missions, L'équipe).

### Navigation résultante

```text
À propos ▾  |  Trouver un espace  |  Propriétaire d'espace ▾  |  Blog
                                      ├─ Diagnostic
                                      └─ Devenir hôte
```

### Fichier modifié

**`src/components/Header.tsx`**

- Desktop : remplacer les deux `<Link>` individuels (Diagnostic, Devenir hôte) par un `<DropdownMenu>` avec trigger "Propriétaire d'espace" + chevron, contenant deux `<DropdownMenuItem>` pointant vers `/diagnostic` et `/devenir-hote`. Le trigger est actif si le pathname correspond à l'un des deux.

- Mobile : regrouper les deux liens sous un label "Propriétaire d'espace" (même pattern que le groupe "À propos" existant), avec un séparateur avant et après.

