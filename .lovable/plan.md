
# Remplacement de "Proposer un espace" par un questionnaire lead adaptatif

## Changements prevus

### 1. Suppression de la page et route "Proposer un espace"
- Supprimer la route `/proposer` de `App.tsx`
- Supprimer le fichier `src/pages/ProposeSpace.tsx`
- Retirer le lien "Proposer un espace" du menu de navigation dans `Header.tsx`
- Mettre a jour les liens dans `Footer.tsx` (remplacer "Proposer un espace" par "Commencer" vers `/commencer`)

### 2. Creation de la page `/commencer` - Questionnaire lead
Nouvelle page `src/pages/GetStarted.tsx` avec un formulaire court et synthetique :

**Etape 1 - Profil (question pivot)**
- "Vous etes..." avec deux cartes visuelles cliquables :
  - "Je cherche un espace" (icone Search) - pour les associations/demandeurs
  - "Je propose un espace" (icone Building2) - pour les proprietaires

**Etape 2 - Questions adaptees selon le profil**

*Si demandeur d'espace :*
- Nom de l'association
- Type d'activite (select : reunion, atelier, evenement, sport, autre)
- Ville recherchee
- Email de contact
- Telephone (optionnel)

*Si proprietaire d'espace :*
- Nom / Societe
- Type d'espace (select : salle de reunion, atelier, salle evenementielle, coworking, studio, autre)
- Ville
- Email de contact
- Telephone (optionnel)

**Etape 3 - Confirmation**
- Message de remerciement avec animation
- "Nous vous recontacterons sous 24h"

Le formulaire sera compact (une seule card centree, max-w-lg), avec un stepper visuel simple (3 points).

### 3. Mise a jour du Header
- Retirer "Proposer un espace" des `navItems`
- Le bouton "Commencer" pointe vers `/commencer`

### 4. Mise a jour de la Landing Page (`Index.tsx`)
- La section "Une solution pour tous" : les boutons des deux cartes (Proprietaires et Associations) pointent vers `/commencer`
- Le bouton "Rechercher" du hero reste vers `/explorer`

### 5. Mise a jour du Footer
- Remplacer "Proposer un espace" par "Commencer" pointant vers `/commencer`

---

## Details techniques

**Fichiers modifies :**
- `src/App.tsx` - remplacer route `/proposer` par `/commencer`
- `src/components/Header.tsx` - retirer nav item, garder bouton CTA vers `/commencer`
- `src/components/Footer.tsx` - mettre a jour le lien
- `src/pages/Index.tsx` - mettre a jour les liens des cartes "Solution pour tous"

**Fichiers crees :**
- `src/pages/GetStarted.tsx` - questionnaire adaptatif avec state local (useState pour l'etape, le profil choisi, et les champs du formulaire)

**Fichier supprime :**
- `src/pages/ProposeSpace.tsx`

**Donnees du formulaire** : stockees dans un objet avec des noms de champs logiques (`user_type`, `organization_name`, `activity_type`, `space_type`, `city`, `email`, `phone`) prets pour insertion Supabase future via une table `leads`.
