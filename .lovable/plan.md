

## Plan : Refonte "Contactez-nous" et conservation de "Trouver un espace"

### Résumé

- **"Trouver un espace"** reste inchangé : lien direct vers `/explorer` (listings + carte)
- **"Contactez-nous"** devient un lien direct (plus de dropdown) vers une nouvelle page `/contact` avec un formulaire unique

### 1. Créer la page Contact (`src/pages/Contact.tsx`)

Page dédiée avec :
- **Formulaire** :
  - "Qui êtes-vous ?" : sélecteur radio/boutons entre "Demandeur d'espace" et "Propriétaire d'espace"
  - Nom / Organisation (texte)
  - Email (texte)
  - Téléphone (optionnel)
  - "Raison du contact" : champ textarea libre pour exprimer le besoin
- **Soumission** vers la table `leads` existante (les champs mappent bien : `user_type`, `organization_name`, `email`, `phone`, + on utilisera `activity_type` pour stocker la raison du contact)
- Écran de confirmation post-envoi

Design miroir de la page DevenirHote (deux colonnes : texte explicatif à gauche, formulaire à droite).

### 2. Mettre à jour le Header (`src/components/Header.tsx`)

- Supprimer le dropdown "Contactez-nous" et le remplacer par un lien simple vers `/contact`
- Supprimer la constante `contactReasons`
- Réordonner les liens : **À propos** → **Diagnostic** → **Trouver un espace** → **Devenir hôte** → **Blog** → **Contactez-nous**
- Même changement dans le menu mobile

### 3. Routing (`src/App.tsx`)

- Ajouter la route `/contact` → composant `Contact`

### 4. Footer

- Mettre à jour le lien "Contactez-nous" du footer pour pointer vers `/contact`

