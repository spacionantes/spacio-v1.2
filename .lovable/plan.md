

## Gérer les marqueurs superposés sur la carte

### Problème
Quand plusieurs listings partagent les mêmes coordonnées, leurs marqueurs se chevauchent et seul le dernier est visible/cliquable.

### Solution — Leaflet.markercluster

Utiliser le plugin `leaflet.markercluster` qui regroupe automatiquement les marqueurs proches en clusters cliquables. Au clic sur un cluster, la carte zoome pour révéler les marqueurs individuels. Si les coordonnées sont strictement identiques, le plugin affiche un "spiderfy" (les marqueurs s'écartent en éventail).

### Étapes

1. **Installer le package** : `leaflet.markercluster` + ses types `@types/leaflet.markercluster`

2. **Modifier `SpaceMap.tsx`** :
   - Importer `leaflet.markercluster` et son CSS
   - Créer un `L.markerClusterGroup` avec des options de style personnalisées (couleurs cohérentes avec le design)
   - Ajouter tous les marqueurs au cluster group au lieu de les ajouter directement à la carte
   - Nettoyer le cluster group lors du re-rendu

3. **Style des clusters** : Les cercles de cluster afficheront le nombre de listings regroupés, avec un style arrondi blanc/bleu cohérent avec les prix-pills existants.

### Détails techniques

```text
Avant :  marker.addTo(map)
Après :  clusterGroup.addLayer(marker)  →  map.addLayer(clusterGroup)
```

Le spiderfy intégré gère nativement le cas des coordonnées strictement identiques — les marqueurs s'ouvrent en éventail au clic.

