# FLASHORA — Cyber Monday store

**Big deals. Smart choices.**

FLASHORA is a complete, responsive, interactive e-commerce prototype for a Cyber Monday
campaign: 20 demo products across 5 categories, a working cart, wishlist, search, filters,
quick view, a 3-step checkout and an order confirmation flow. It is built to be connected to a
real backend later (products, prices, stock and payments are all isolated from the UI).

> The storefront is a **prototype**: products, prices, discounts, stock states, ratings and
> reviews are demonstration data, and no payment is ever processed.

---

## Langue et sécurité

- **Le site est entièrement en français** (`lang="fr"` : textes, titres, métadonnées, messages,
  états, aria-labels, dates `fr-FR`). Les noms de produits et anglicismes métier courants
  (Gaming, Tech, Audio, Lifestyle, Cyber Monday) sont conservés volontairement.
- **Rapport de sécurité** : voir [SECURITE.md](./SECURITE.md) — audit des dépendances
  (`npm audit` : 0 vulnérabilité), contrôles XSS / réseau / paiement, en-têtes ajoutés sur le
  serveur local (CSP, `nosniff`, `X-Frame-Options`…), durcissement du serveur statique et
  recommandations pour une mise en production.

---

## Run it

```powershell
npm install        # once
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ (vite preview, http://localhost:4173)
npm run typecheck  # tsc --noEmit
```

> Windows note : if PowerShell blocks `npm.ps1` (execution policy), use `npm.cmd` instead.

A zero-dependency static server is also included:

```powershell
node scripts\serve.mjs .        8080   # source tree   → http://localhost:8080
node scripts\serve.mjs .\dist   8081   # production    → http://localhost:8081
```

Both ports serve security headers (CSP, `nosniff`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`, COOP) and block path traversal — see [SECURITE.md](./SECURITE.md).

The build produces a **single-file `dist/index.html`** (with `images/` and `fonts/` next to it),
so the shop can also be opened directly from disk — routing uses `HashRouter`, so every deep
link keeps working without a server.

### Demo data

- Promo codes (client-side demo): **`FLASH10`** (−10 %) and **`CYBER15`** (−15 %).
- Free standard shipping from **79 €**, otherwise **4,95 €**.
- State persists in `localStorage` (`flashora.cart`, `flashora.wishlist`, `flashora.promo`,
  `flashora.lastOrder`). Clear site data to reset the demo.
- No test runner is configured yet: `npm run build` (`tsc --noEmit` + Vite) is the pre-commit gate.

### Responsive QA harness

`public/qa-frame.html` renders the app inside a scaled iframe to review any viewport:

```
http://localhost:8080/qa-frame.html?w=1440&h=900&scale=1&route=%23%2F
http://localhost:8080/qa-frame.html?w=390&h=800&route=%23%2F
```

### Git workflow

- `main` is protected by convention: every change lands through `feature/<name>`,
  `fix/<name>` or `chore/<name>`, merged with `git merge --no-ff`.
- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`), build before
  each commit, no secrets ever staged.
- Semver releases: `package.json` bump → [CHANGELOG.md](./CHANGELOG.md) →
  `chore(release): vX.Y.Z` → annotated tag → `git push origin main --tags`.
  Current version: **v0.1.0**.

---

## Structure

```
public/
  images/          55 product & campaign photos (Pexels license)
  fonts/           self-hosted Inter + Space Grotesk (OFL) + fonts.css
  favicon.svg
scripts/
  fetch-images.ps1 re-download the photography
  fetch-fonts.ps1  re-generate the @font-face bundle
  serve.mjs        static file server
  contact-sheet.html  visual index of every asset
src/
  components/
    layout/        Header (announcement bar, nav, desktop/mobile menu, cart badge),
                   Footer (+ Newsletter), CartDrawer, SearchOverlay, QuickViewModal,
                   Toasts, RootLayout, ScrollToTop
    ui/            Logo, ProductCard + ProductGrid, ImageFrame (with fallback),
                   Countdown, Primitives (Rating, Price, SectionHeading,
                   QuantityStepper, InfoTile), Icons
  data/            products (20), categories (5), content (FAQ/testimonials/…), navigation
  hooks/           useCountdown, useLocalStorage, useDocumentTitle, useScrollLock, useEscape
  store/           StoreContext — cart, wishlist, promo, toasts, quick view, order
  pages/           Home, Shop, Product, BrowsePages (Category/Search/Wishlist),
                   CommercePages (Cart/Checkout/Confirmation), InfoPages (About/FAQ/
                   Contact/Shipping/Returns/Privacy/Terms), NotFound
  styles/index.css design tokens + component layer (Tailwind v4 @theme)
  utils/format.ts  price (fr-FR), dates (fr-FR), discount helpers
  types.ts
```

### Routes

| Route | Page |
| --- | --- |
| `/` | Homepage (hero, trust bar, trending, deal of the hour, categories, flash deals, gift guide, banner, social proof, new arrivals, mobile, newsletter) |
| `/shop` | Catalogue with search, filters, sorting |
| `/category/:id` | Dynamic category page |
| `/product/:slug` | Product page (gallery, zoom, variants, specs, reviews, FAQ, related, sticky mobile CTA) |
| `/search` | Search experience with suggestions and empty state |
| `/wishlist` | Saved products |
| `/cart` | Full cart page + cart drawer |
| `/checkout` | Coordonnées → Livraison → Paiement (no card fields in this prototype) |
| `/order-confirmation` | Order summary |
| `/about` `/faq` `/contact` `/shipping` `/returns` `/privacy` `/terms` | Content pages |

---

## Design system

- **Canvas**: cream `#fcfaf6` / shell `#f5f2ec` / cloud `#eeeae2`, white cards, hairline `#e5e0d6`
- **Ink**: `#0b0b0c`, soft `#3f3f46`, mute `#6b6b74`
- **Flash**: `#cd3609` (primary accent, AA-tuned: white on flash = 5.1:1, flash on cream = 4.6:1)
  with `#a82b06` for pressed states and amber `#ffb020` for gradients
- **Signals**: `#34d399` (live/in-stock), `#5b3df5` (secondary), `#c0271d` (danger)
- **Type**: Space Grotesk (display, uppercase, tight tracking) + Inter (UI/body)
- **Components**: `.btn .btn-ink .btn-flash .btn-light .btn-ghost .btn-sm .btn-lg`,
  `.input .label`, `.chip .chip-active`, `.badge*`, `.card`, `.page`, `.section`,
  `.section-title`, `.eyebrow`, `.lede`, `.panel`, `.divider`
- Motion is fast (150–500 ms), honours `prefers-reduced-motion`, and never blocks content.

## Images

All photography is downloaded from [Pexels](https://www.pexels.com) (Pexels License: free for
commercial use, no attribution required) by `scripts/fetch-images.ps1`. Every `<img>` goes
through `ImageFrame`, which renders a branded fallback if a file is missing.

## Accessibility & SEO

Semantic headings, landmarks, skip link, visible focus rings, `aria-label`/`aria-pressed` on
icon buttons, `aria-expanded` accordions, alt text on every image, WCAG-conscious contrast, and
per-route `document.title`. The homepage ships with the required title, description, Open Graph
and Twitter tags.

## Honest-urgency policy

Countdowns only illustrate a limited-time campaign format. The prototype never invents stock
levels ("Only 2 left"), certifications, sales figures or partner logos, and all reviews are
labelled as demonstration data.
