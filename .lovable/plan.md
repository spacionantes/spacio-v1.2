

## Mise a jour de l'adresse d'expedition email

### Contexte

Les emails echouent avec une erreur 403 car l'adresse `onboarding@resend.dev` n'est utilisable qu'en mode test. Le domaine `spacionantes.fr` est maintenant verifie sur Resend.

### Modification

Un seul fichier a modifier : `supabase/functions/send-email/index.ts`

Remplacer la ligne :

```text
from: "Spacio <onboarding@resend.dev>",
```

par :

```text
from: "Spacio <contact@spacionantes.fr>",
```

### Verification

- La cle API Resend est deja configuree dans les secrets Supabase (`RESEND_API_KEY`) et correctement utilisee par la fonction
- Aucun changement cote front-end n'est necessaire (les appels `supabase.functions.invoke("send-email", ...)` restent identiques)
- La fonction sera redeployee automatiquement apres la modification

### Impact

Les deux types d'emails (confirmation d'espace et resultats Intensi'Score) utiliseront la nouvelle adresse `contact@spacionantes.fr`, ce qui resoudra l'erreur 403 de Resend.

