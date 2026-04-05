

## Diagnostic

Le problème vient du fait que le `DialogContent` dans `SpaceDetailDialog` a `overflow-hidden` dans ses classes. Sur des écrans plus petits (téléphones, petits laptops), le contenu du dialog (image 16/9 + infos + bouton) dépasse la hauteur du viewport. Comme le scroll est bloqué par `overflow-hidden`, les boutons en bas (dont "Réserver cet espace") sont inaccessibles et même la croix de fermeture peut être masquée ou non cliquable.

## Plan

**Fichier modifié : `src/components/SpaceDetailDialog.tsx`**

1. Remplacer `overflow-hidden` par `overflow-y-auto` sur le `DialogContent` et ajouter une hauteur maximale (`max-h-[90vh]`) pour que le dialog soit scrollable sur petits écrans.
2. Garder `overflow-hidden` uniquement sur le conteneur de l'image (déjà le cas via le `div` parent de l'image).
3. S'assurer que le bouton de fermeture (croix) reste toujours visible avec un `z-index` suffisant et un positionnement `sticky` ou fixe.

Changement concret :
- `DialogContent` : remplacer `overflow-hidden` par `overflow-y-auto max-h-[90vh]`
- Cela permettra le scroll sur les petits écrans tout en gardant le même rendu sur desktop.

