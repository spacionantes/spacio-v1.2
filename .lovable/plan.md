
## Corriger les emails Resend + le bug d'animation du hero

### Probleme 1 : Cle API Resend invalide

Les logs montrent clairement l'erreur : `API key is invalid` (401). La cle stockee dans les secrets Supabase n'est pas valide.

**Action requise de ta part :**
1. Va sur [resend.com/api-keys](https://resend.com/api-keys)
2. Copie ta cle API (elle commence par `re_`)
3. Je te demanderai de la mettre a jour via l'outil de secrets Lovable

### Probleme 2 : Boucle infinie dans BackgroundGradientAnimation

Le `useEffect` aux lignes 55-63 cree une boucle infinie : il depend de `curX` et `curY`, et a l'interieur il appelle `setCurX` / `setCurY`, ce qui re-declenche le `useEffect` indefiniment.

**Correction :** Remplacer cette logique par un `requestAnimationFrame` qui interpole la position du curseur de maniere fluide sans provoquer de re-renders en boucle. Les positions seront stockees dans des `useRef` au lieu de `useState` pour eviter les re-renders.

### Etapes techniques

1. **Mettre a jour le secret `RESEND_API_KEY`** avec une cle valide
2. **Refactorer le composant `background-gradient-animation.tsx`** :
   - Remplacer les `useState` pour `curX`/`curY` par des `useRef`
   - Remplacer le `useEffect` de mouvement par une boucle `requestAnimationFrame`
   - Stocker `tgX`/`tgY` dans des `useRef` egalement
   - Nettoyer le `requestAnimationFrame` au demontage du composant
3. **Redeployer la edge function** pour s'assurer qu'elle utilise la nouvelle cle
