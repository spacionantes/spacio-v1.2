
## Formulaire de reservation pre-rempli par espace

### Objectif
Quand l'utilisateur clique sur "Reserver cet espace" dans le popup d'un listing, il arrive directement sur un formulaire simplifie ou les infos de l'espace sont deja remplies. Il n'a plus qu'a saisir ses coordonnees personnelles (nom, email, telephone).

### Changements prevus

**1. SpaceDetailDialog.tsx** - Passer les donnees de l'espace dans l'URL
- Le bouton "Reserver cet espace" naviguera vers `/commencer?space=ID_ESPACE` au lieu de simplement `/commencer`
- L'ID de l'espace sera passe en query parameter

**2. GetStarted.tsx** - Refonte du formulaire quand un espace est pre-selectionne
- Lire le query parameter `space` depuis l'URL via `useSearchParams`
- Si un `space` est present :
  - Sauter les etapes 1 (profil) et 2 (details association) car on sait deja que c'est un demandeur d'espace
  - Afficher un recap de l'espace selectionne en haut du formulaire (nom, ville, photo, prix) en lecture seule
  - Aller directement a un formulaire simplifie demandant uniquement : Nom de l'association, Email, Telephone (optionnel)
  - Pre-remplir automatiquement `user_type: "seeker"` et `city` depuis les donnees de l'espace
- Si pas de `space` en URL : garder le flow actuel (etapes 1-2-3-4) inchange

**3. Donnees du lead**
- Ajouter un champ `space_id` et `space_title` au type `LeadData` pour tracer quel espace a ete demande
- Ces champs seront remplis automatiquement depuis les donnees mock

### Resultat pour l'utilisateur
1. Clic sur "Reserver cet espace" sur le listing "Salle Lumiere"
2. Arrive sur `/commencer?space=1`
3. Voit un recap de "Salle Lumiere" avec photo, adresse, prix
4. Remplit uniquement : Nom de l'association, Email, Telephone
5. Clique "Envoyer" et voit la confirmation

### Details techniques
- Import de `useSearchParams` depuis `react-router-dom` dans GetStarted
- Import de `mockSpaces` depuis `mockData.ts` pour retrouver l'espace par ID
- Le formulaire simplifie sera une Card avec le recap espace + champs contact dans un seul ecran (pas de stepper)
- Le flow classique sans query param reste intact
