# QA — Flux emails d'authentification

Objectif : valider qu'un clic sur un lien d'email (confirmation d'inscription
ou réinitialisation de mot de passe) **n'affiche jamais de 404** et atterrit
bien sur la bonne page.

Les règles de redirection sont par ailleurs couvertes par les tests unitaires
`src/lib/auth-redirect.test.ts` (12 cas) — lancer `bun run test` avant de
publier.

---

## Pré-requis

- Être déconnecté du compte Spacio dans le navigateur de test (mode incognito
  recommandé pour éviter une session résiduelle).
- Avoir accès à la boîte mail utilisée.
- Connaître l'URL active : `https://www.spacionantes.fr` en prod, ou l'URL de
  preview Lovable.

> ⚠️ Les **Redirect URLs** Supabase doivent inclure le domaine testé :
> - `https://www.spacionantes.fr/**`
> - L'URL de preview Lovable si le test se fait en preview
>   (`https://id-preview--<id>.lovable.app/**`)
>
> Sans ça, Supabase remplace `redirectTo` par le Site URL nu et le `next` est
> perdu — c'est la cause #1 des 404 et des "lien invalide".

---

## Test 1 — Confirmation de création de compte

1. Aller sur `/auth`, onglet **Créer un compte**.
2. S'inscrire avec une adresse mail jamais utilisée.
3. Vérifier l'écran : « Vérifiez votre boîte mail ».
4. Ouvrir l'email reçu de `contact@spacionantes.fr` — sujet *« Confirmez
   votre inscription sur Spacio »*.
5. **Inspecter le lien du bouton** (clic droit → copier l'adresse). Il doit
   ressembler à :
   ```
   https://www.spacionantes.fr/?auth_action=confirm&token_hash=...&type=signup&next=...
   ```
   ✅ Pointe sur la **racine `/`** (pas `/auth/confirm` directement) — c'est
   ce qui évite le 404 serveur.
6. Cliquer sur le bouton dans l'email.
7. Attendu :
   - Pas de 404.
   - Redirection automatique vers `/auth/confirm` (spinner « Confirmation
     en cours »).
   - Puis toast vert « Email confirmé avec succès ! » et arrivée sur
     `/dashboard`.

### Cas d'erreur à vérifier
- Recliquer sur le **même lien** une 2ᵉ fois → toast « Le lien est invalide
  ou a expiré » + redirection sur `/auth` (pas de 404).

---

## Test 2 — Mot de passe oublié

1. Aller sur `/auth`, cliquer **Mot de passe oublié ?**.
2. Saisir l'email d'un compte existant, soumettre.
3. Ouvrir l'email *« Réinitialisation de votre mot de passe Spacio »*.
4. **Inspecter le lien** → doit pointer sur `/?auth_action=confirm&type=recovery&...`.
5. Cliquer sur le bouton.
6. Attendu :
   - Pas de 404.
   - Passage furtif par `/auth/confirm`.
   - Arrivée sur `/reset-password` avec le formulaire **Nouveau mot de
     passe** affiché (pas le message « Lien invalide »).
7. Saisir un nouveau mot de passe (≥ 8 caractères, identique dans les 2
   champs), valider.
8. Attendu :
   - Toast « Mot de passe mis à jour ».
   - Déconnexion automatique + redirection vers `/auth`.
   - Se reconnecter avec le nouveau mot de passe → OK.

### Cas d'erreur à vérifier
- Demander un lien, attendre > 1 h, cliquer → message « Lien invalide ou
  expiré. Demandez un nouvel email… » sur `/reset-password` (pas de 404,
  pas d'arrivée silencieuse sur `/`).

---

## Test 3 — Renvoi d'email

1. Depuis l'écran post-inscription, cliquer **Renvoyer l'email**.
2. Vérifier qu'un nouveau mail arrive et que son lien fonctionne comme au
   Test 1.

---

## Test 4 — Lien manipulé (sécurité)

Coller manuellement dans la barre d'URL :
```
/?auth_action=confirm&token_hash=t&type=signup&next=https://evil.com
```
Attendu : la redirection se fait vers `/auth/confirm?token_hash=t&type=signup`
**sans** le `next` malveillant (ouvert-redirect bloqué — cf. test unitaire
*« drops an absolute / open-redirect `next` value »*).

---

## En cas d'échec

| Symptôme | Piste |
|---|---|
| 404 immédiat sur le clic | Le lien ne pointe pas sur `/` → vérifier `supabase/functions/auth-email-hook/index.ts` (construction de `confirmationUrl`) et les **Redirect URLs** Supabase. |
| Atterrissage sur `/` connecté sans voir `/reset-password` | L'event `PASSWORD_RECOVERY` n'a pas été émis → vérifier que le `type=recovery` est bien transmis dans l'URL, et regarder les logs Supabase Auth. |
| « Lien invalide » immédiat | Token déjà consommé (double-clic, prefetch antivirus) — demander un nouveau lien. |
| Email non reçu | Vérifier les logs Resend + spams. Logs : `supabase functions logs auth-email-hook`. |
