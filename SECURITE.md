# FLASHORA — Rapport de sécurité

**Périmètre :** toute la plateforme (code source `src/`, build de production `dist/`, serveur de prévisualisation `scripts/serve.mjs`, outillage `public/qa-frame.html`, dépendances `package.json`).
**Nature de l'application :** prototype e-commerce **100 % client** (aucun backend, aucune base de données, aucun appel réseau sortant). C'est le fait dominant de l'analyse : il n'existe ni serveur à compromettre, ni paiement à intercepter, ni compte utilisateur à voler.

---

## 1. Synthèse

| Domaine | Verdict |
|---|---|
| Dépendances (`npm audit`) | ✅ 0 vulnérabilité (0 critical / high / moderate / low) — 164 paquets |
| XSS (injection de code) | ✅ Aucun puits d'injection (`innerHTML`, `dangerouslySetInnerHTML`, `eval`, `new Function`, `document.write` : 0 occurrence) |
| Réseau / données sortantes | ✅ Aucun `fetch`, aucune URL `http(s)` dans `src/` — zéro analytics, zéro CDN, zéro tracker |
| Paiement / données bancaires | ✅ Aucun champ de carte, aucune carte stockée/transmise ; copy explicite « aucun numéro de carte n'est saisi sur ce site » |
| Redirections / injection d'URL | ✅ Navigation uniquement vers des routes internes construites à partir de données statiques ; requêtes de recherche encodées (`encodeURIComponent`) |
| Stockage local | ✅ `localStorage` limité à `flashora.cart/.wishlist/.promo/.lastOrder` ; `JSON.parse` protégé par `try/catch` |
| Secrets | ✅ Aucun `.env`, clé, certificat ou identifiant dans le projet ni dans `dist/` |
| Accessibilité/robustesse | ✅ Lighthouse best-practices 100 (audit de production) |
| En-têtes HTTP | ✅ Ajoutés sur le serveur de prévisualisation (voir §3) |
| Contenu honnête | ✅ Mentions « démonstration » présentes ; aucune fausse garantie/certification/chiffre inventé |

---

## 2. Contrôles détaillés

### 2.1 Dépendances
- `npm audit --json` → `vulnerabilities: { total: 0 }` (production : 8 paquets ; dev : 157).
- Runtime réduit au strict minimum : `react`, `react-dom`, `react-router-dom`. Tailwind/Vite/TypeScript en dev.
- `allowScripts` limité à `esbuild` (pas d'arbitrage de scripts post-install large).

### 2.2 Injection (XSS)
- Aucune interpolation de contenu utilisateur en HTML brut dans tout `src/` (recherche `dangerouslySetInnerHTML|innerHTML|eval(|new Function|document.write` : 0 hit).
- Tout le rendu passe par React (échappement automatique). Le terme de recherche est passé par `encodeURIComponent` puis rendu comme texte.
- Aucun `javascript:` ni URL externe dans les `href`/`to`.

### 2.3 Paiement et données personnelles
- L'étape « Paiement » du checkout **ne contient aucun champ de carte** et affiche une note indiquant que, en production, la saisie est hébergée par le prestataire de paiement (iframe sécurisée du prestataire) — les données de carte ne transitent jamais par ce frontend.
- Aucun nom de champ `card*`, `cvv`, `iban` n'existe dans le code.
- Le checkout valide côté client uniquement le format (courriel, adresse…) ; aucune donnée n'est envoyée nulle part.

### 2.4 Stockage local (à connair)
Clés utilisées : `flashora.cart`, `flashora.wishlist`, `flashora.promo`, `flashora.lastOrder`.
- `flashora.lastOrder` contient les coordonnées de la démonstration (nom, e-mail, adresse) saisies lors du test de commande.
  **Recommandation production :** ne jamais persister ces données côté navigateur ; les transmettre à un backend HTTPS puis effacer le stockage local.
- Toute lecture est protégée par `try/catch` → un `localStorage` corrompu ne casse pas l'application.

### 2.5 Codes promotionnels
`FLASH10` / `CYBER15` sont vérifiés **côté client uniquement** — acceptable pour un prototype, mais toute réelle promotion doit être validée **côté serveur** (sinon contournement trivial via la console).

---

## 3. Durcissements appliqués dans cette passe

1. **`scripts/serve.mjs`** (serveur de prévisualisation local) :
   - `Content-Security-Policy` : `default-src 'self'` + `script-src/style-src/img-src/font-src` restreints, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`, `frame-src 'self'` ;
   - `X-Content-Type-Options: nosniff` ;
   - `X-Frame-Options: SAMEORIGIN` (anti-clickjacking tout en gardant le cadre de QA local) ;
   - `Referrer-Policy: strict-origin-when-cross-origin` ;
   - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` ;
   - `Cross-Origin-Opener-Policy: same-origin` ;
   - parcours de fichiers **renforcé** : comparaison avec séparateur (`root + sep`) → test `..%2f..%2fpackage.json` renvoie désormais **403**.
2. **`public/qa-frame.html`** : le paramètre `route` est assaini (forçage same-origin, blocage des URL `//host`) → impossible de faire charger un site externe dans le cadre.
3. Vérifié après coup : application, images et polices fonctionnent sous la CSP (0 erreur console), y compris le cadre de QA.

---

## 4. Recommandations pour une mise en production (hors périmètre du prototype)

1. **Servir en HTTPS** avec HSTS et les en-têtes du §3 appliqués au niveau du vrai serveur/CDN (une CSP ne peut pas protéger un fichier ouvert en `file://`).
2. **Paiement** : prestataire type Stripe/PayPal en *hosted fields/Checkout* (PCI-DSS délégué), jamais de champ carte dans ce frontend, validation serveur de chaque transaction.
3. **Codes promo, stock, prix, frais de livraison** : tout recalculer côté serveur (actuellement le client fait foi, ce qui est normal pour une démo).
4. **Persistance des coordonnées** : backend + purge du `localStorage`, durée de conservation déclarée dans la politique de confidentialité.
5. **Formulaires (contact/newsletter)** : protéger côté serveur contre les robots (honeypot, limitation de débit, CSRF token) — inapplicable ici puisqu'aucun envoi n'existe.
6. **Entêtes** : ajouter `strict-transport-security`, et envisager `frame-src 'none'` en production (le cadre de QA n'est alors plus nécessaire dans `dist/`).
7. **Placer derrière un WAF/CDN** et journaliser les erreurs 4xx/5xx.
8. Remplacer les URL canoniques/OG de démonstration (`https://flashora.example/`) par le domaine réel.

---

## 5. Limites de cet audit

- Analyse statique + revue manuelle du code et des en-têtes ; pas de test de pénétration complet ni de scan DAST (pas de backend à tester).
- Les fichiers de build (`dist/`) ont été contrôlés : seuls `index.html`, `robots.txt`, `qa-frame.html`, `images/`, `fonts/`, `favicon.svg` — aucun sourcemap, aucun fichier sensible.
- Le serveur de prévisualisation est un outil **local** (écoute `localhost`) : il ne doit pas être utilisé comme serveur de production.
