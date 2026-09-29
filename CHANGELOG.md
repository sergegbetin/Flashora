# Changelog

Tous les changements notables de FLASHORA sont documentés dans ce fichier.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) · Versionnage : [Sémantique](https://semver.org/lang/fr/).

## [0.1.0] - 2026-09-29

### Added
- Boutique complète **en français** : accueil, catalogue, catégories, fiche produit, recherche,
  favoris, panier, checkout en 3 étapes, confirmation de commande, pages institutionnelles
  (À propos, FAQ, Contact, Livraison, Retours, Confidentialité, Conditions) et 404.
- 20 produits de démonstration : galerie, caractéristiques, spécifications, avis étiquetés
  « données de démonstration », badges et stocks fictifs assumés.
- Fonctionnalités e-commerce : panier, favoris, recherche avec suggestions, filtres et tris,
  aperçu rapide, codes promo (`FLASH10`, `CYBER15`), compte à rebours, toasts, menu mobile,
  tiroir de filtres, barre d'achat collante en mobile.
- Design system (base crème/encre, accent orange contraste AA), typographies auto-hébergées,
  compositions éditoriales asymétriques, responsive 375 → 1440 px, support
  `prefers-reduced-motion`.
- Qualité : `tsc --noEmit` strict, Lighthouse **100 accessibilité / 100 bonnes pratiques / 100 SEO**
  sur l'ensemble des routes, alt d'images et aria-labels en français.
- Sécurité : rapport `SECURITE.md`, serveur statique local durci (CSP, `nosniff`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, protection traversal de fichiers),
  assainissement du paramètre `route` du cadre QA.
- Outils : `scripts/serve.mjs` (serveur zéro-dépendance), `public/qa-frame.html`
  (simulateur de viewport), planches de contrôle des assets.

### Changed
- Titres, descriptions et métadonnées SEO passés en français (`lang="fr"`, `og:locale=fr_FR`,
  dates `fr-FR`, notes et prix à la française).
- Barre de confiance reformulée avec des détails distincts et vérifiables
  (paiement chez le prestataire, livraison offerte dès 79 €, retours 30 jours, contact 7 j/7).

[0.1.0]: https://github.com/sergegbetin/Flashora/releases/tag/v0.1.0
