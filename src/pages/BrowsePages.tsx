import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useDocumentTitle } from '../hooks'
import { useStore } from '../store/StoreContext'
import { categories, categoryById } from '../data/categories'
import { productById, products } from '../data/products'
import { filterRanges, trendingSearches } from '../data/navigation'
import type { Product } from '../types'
import { ProductGrid } from '../components/ui/ProductCard'
import { ImageFrame } from '../components/ui/ImageFrame'
import { SectionHeading } from '../components/ui/Primitives'
import { Newsletter } from '../components/layout/Footer'
import { ArrowRight, BagIcon, HeartIcon, SearchIcon } from '../components/ui/Icons'

/* ===================================================== shared helpers === */

type SortId = 'featured' | 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'discount'

const sortOptions: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Sélection' },
  { id: 'popular', label: 'Les plus populaires' },
  { id: 'newest', label: 'Nouveautés' },
  { id: 'price-asc', label: 'Prix : croissant' },
  { id: 'price-desc', label: 'Prix : décroissant' },
  { id: 'discount', label: 'Meilleure remise' },
]

const sortProducts = (list: Product[], sort: SortId): Product[] => {
  const next = [...list]
  switch (sort) {
    case 'popular':
      return next.sort((a, b) => b.popularity - a.popularity)
    case 'newest':
      return next.sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt))
    case 'price-asc':
      return next.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return next.sort((a, b) => b.price - a.price)
    case 'discount':
      return next.sort((a, b) => b.discount - a.discount)
    default:
      return next.sort((a, b) => b.popularity - a.popularity)
  }
}

const toWords = (value: string): string[] =>
  value.trim().toLowerCase().split(/\s+/).filter(Boolean)

const matchesWords = (product: Product, words: string[]): boolean => {
  const haystack =
    `${product.name} ${product.category} ${product.tagline} ${product.brand} ${product.description}`.toLowerCase()
  return words.every((word) => haystack.includes(word))
}

/** Short labels for the shared price ranges (chips read better than "All prices"). */
const priceChipLabel: Record<string, string> = {
  all: 'Tous les prix',
  u50: 'Moins de 50 €',
  '50-150': '50–150 €',
  '150-500': '150–500 €',
  o500: 'Plus de 500 €',
}

function Breadcrumbs({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Fil d’Ariane" className="eyebrow mb-5 flex flex-wrap items-center gap-2">
      <Link to="/" className="transition hover:text-ink">
        Accueil
      </Link>
      {trail.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-2">
          <span aria-hidden>/</span>
          {item.to ? (
            <Link to={item.to} className="transition hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

function SortSelect({
  id,
  value,
  onChange,
}: {
  id: string
  value: SortId
  onChange: (next: SortId) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <label
        htmlFor={id}
        className="shrink-0 text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute"
      >
        Trier par
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as SortId)}
        className="input w-auto cursor-pointer py-2.5 pr-8 font-semibold"
      >
        {sortOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Horizontally scrollable chip row — keeps the toolbar calm on small screens. */
function ChipRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
    >
      {children}
    </div>
  )
}

/* ======================================================= CATEGORY PAGE === */

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = categoryId ? categoryById(categoryId) : undefined

  useDocumentTitle(category ? `${category.name} | FLASHORA` : 'Catégorie introuvable | FLASHORA')

  const [sort, setSort] = useState<SortId>('featured')
  const [rangeId, setRangeId] = useState('all')
  const [dealsOnly, setDealsOnly] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)

  const categoryProducts = useMemo(
    () => (category ? products.filter((product) => product.category === category.id) : []),
    [category],
  )

  const visible = useMemo(() => {
    const range = filterRanges.find((item) => item.id === rangeId) || filterRanges[0]
    const list = categoryProducts.filter(
      (product) =>
        product.price >= range.min &&
        product.price <= range.max &&
        (!dealsOnly || product.discount >= 20) &&
        (!inStockOnly || product.inStock),
    )
    return sortProducts(list, sort)
  }, [categoryProducts, rangeId, dealsOnly, inStockOnly, sort])

  /* ------------------------------------------------------- not found --- */
  if (!category) {
    return (
      <>
        <section className="page section">
          <Breadcrumbs trail={[{ label: 'Catégories' }]} />
          <p className="eyebrow text-flash">404</p>
          <h1 className="section-title mt-3">Catégorie introuvable</h1>
          <p className="lede mt-4 max-w-xl text-ink-mute">
            Cette collection ne fait pas partie de la campagne Cyber Monday — mais toutes les
            autres, oui. Explorez une catégorie ci-dessous ou parcourez tout le catalogue.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-ink">
              Parcourir tous les soldes <ArrowRight size={16} />
            </Link>
          </div>

          <p className="label mt-10">Ou choisissez une catégorie</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <Link key={item.id} to={`/category/${item.id}`} className="chip">
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        <Newsletter />
      </>
    )
  }

  /* ----------------------------------------------------------- known --- */
  const others = categories.filter((item) => item.id !== category.id)
  const dealCount = categoryProducts.filter((product) => product.discount >= 20).length
  const hasFilters = rangeId !== 'all' || dealsOnly || inStockOnly
  const clearFilters = () => {
    setRangeId('all')
    setDealsOnly(false)
    setInStockOnly(false)
  }

  return (
    <>
      {/* hero ----------------------------------------------------------- */}
      <section className="page pt-8 sm:pt-12">
        <Breadcrumbs trail={[{ label: 'Boutique', to: '/shop' }, { label: category.name }]} />

        <div className="relative overflow-hidden rounded-card border border-line shadow-pop">
          <ImageFrame
            src={category.image}
            alt={category.imageAlt}
            aspect="aspect-[16/7]"
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-700"
            eager
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/20"
            aria-hidden
          />
          <div className="relative flex min-h-[300px] flex-col justify-end gap-3 p-6 text-white sm:min-h-[360px] sm:p-10">
            <p className="eyebrow text-white/60">Catégorie Cyber Monday</p>
            <h1 className="font-display text-[clamp(2.25rem,6vw,4.25rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em]">
              {category.name}
            </h1>
            <p className="lede max-w-2xl text-white/85">{category.tagline}</p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="badge badge-flash">
                {categoryProducts.length} {categoryProducts.length === 1 ? 'produit' : 'produits'}
              </span>
              <span className="badge badge-light">
                {dealCount} {dealCount === 1 ? 'solde' : 'soldes'}
              </span>
              <Link to="/shop" className="btn btn-light h-10 px-5 text-xs">
                Retour à toutes les catégories
              </Link>
            </div>
          </div>
        </div>

        <p className="lede mt-6 max-w-3xl text-ink-soft">{category.description}</p>
      </section>

      {/* filter / sort bar ---------------------------------------------- */}
      <section className="page mt-7" aria-label="Filtrer et trier les produits">
        <div className="flex flex-col gap-4 rounded-card border border-line bg-white p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
          <ChipRow label="Filtres rapides">
            {filterRanges.map((range) => (
              <button
                key={range.id}
                type="button"
                onClick={() => setRangeId(range.id)}
                aria-pressed={rangeId === range.id}
                className={`chip whitespace-nowrap ${rangeId === range.id ? 'chip-active' : ''}`}
              >
                {priceChipLabel[range.id] ?? range.label}
              </button>
            ))}

            <span className="mx-1 h-6 w-px shrink-0 self-center bg-line" aria-hidden />

            <button
              type="button"
              onClick={() => setDealsOnly((current) => !current)}
              aria-pressed={dealsOnly}
              className={`chip whitespace-nowrap ${dealsOnly ? 'chip-active' : ''}`}
            >
              Soldes uniquement
            </button>
            <button
              type="button"
              onClick={() => setInStockOnly((current) => !current)}
              aria-pressed={inStockOnly}
              className={`chip whitespace-nowrap ${inStockOnly ? 'chip-active' : ''}`}
            >
              En stock uniquement
            </button>
          </ChipRow>

          <div className="flex flex-wrap items-center justify-between gap-3 lg:justify-end">
            <p className="text-xs font-semibold text-ink-mute" aria-live="polite">
              <span className="font-display text-sm font-bold text-ink">{visible.length}</span>{' '}
              sur {categoryProducts.length}{' '}
              {categoryProducts.length === 1 ? 'produit' : 'produits'}
            </p>
            <SortSelect id="category-sort" value={sort} onChange={setSort} />
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="chip">
                Effacer les filtres ×
              </button>
            )}
          </div>
        </div>
      </section>

      {/* product grid ---------------------------------------------------- */}
      <section className="page pb-4 pt-8" aria-labelledby="category-products-title">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{category.tagline}</p>
            <h2
              id="category-products-title"
              className="mt-2 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl"
            >
              Soldes {category.name}
            </h2>
          </div>
          <Link to="/shop" className="btn btn-light h-10 px-5 text-xs">
            Voir toute la boutique <ArrowRight size={16} />
          </Link>
        </div>

        {visible.length > 0 ? (
          <ProductGrid items={visible} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 rounded-card border border-dashed border-line bg-white px-6 py-20 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-shell text-ink-mute">
              <SearchIcon size={22} />
            </span>
            <div>
              <p className="font-display text-xl font-bold">
                Aucun produit ne correspond à ces filtres
              </p>
              <p className="mt-1 text-sm text-ink-mute">
                Essayez une autre fourchette de prix, ou effacez les filtres pour voir tous les
                produits de {category.name}.
              </p>
            </div>
            <button type="button" onClick={clearFilters} className="btn btn-ink">
              Effacer les filtres
            </button>
          </div>
        )}
      </section>

      {/* other categories ------------------------------------------------ */}
      <section className="page section pt-4" aria-labelledby="other-categories-title">
        <div id="other-categories-title">
          <SectionHeading
            eyebrow="Poursuivez la découverte"
            title="Parcourir les autres catégories"
            text="Cinq collections, une campagne — découvrez le reste de l’offre."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {others.map((item) => (
            <Link
              key={item.id}
              to={`/category/${item.id}`}
              className="group flex items-center gap-4 rounded-card border border-line bg-white p-3 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-pop"
            >
              <ImageFrame
                src={item.image}
                alt={item.imageAlt}
                aspect="aspect-[4/3]"
                className="w-28 shrink-0 rounded-2xl sm:w-36"
                imgClassName="transition-transform duration-500 group-hover:scale-105"
              />
              <span className="min-w-0 flex-1 pr-2">
                <span className="block font-display text-lg font-bold uppercase leading-none tracking-tight">
                  {item.name}
                </span>
                <span className="mt-2 block truncate text-sm text-ink-mute">{item.tagline}</span>
              </span>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-shell text-ink transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  )
}

/* ========================================================= SEARCH PAGE === */

export function SearchPage() {
  useDocumentTitle('Recherche | FLASHORA')

  const [params, setParams] = useSearchParams()
  const query = (params.get('q') ?? '').trim()

  const [term, setTerm] = useState(query)
  const [sort, setSort] = useState<SortId>('featured')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTerm(query)
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const words = useMemo(() => toWords(query), [query])

  const results = useMemo(
    () =>
      query ? sortProducts(products.filter((product) => matchesWords(product, words)), sort) : [],
    [query, words, sort],
  )

  const popular = useMemo(() => sortProducts(products, 'popular').slice(0, 8), [])

  const submitSearch = (value: string) => {
    const next = new URLSearchParams(params)
    const clean = value.trim()
    if (clean) next.set('q', clean)
    else next.delete('q')
    setParams(next)
  }

  const quickSearch = (value: string) => {
    setTerm(value)
    submitSearch(value)
  }

  const trendingChips = trendingSearches.map((term2) => (
    <button
      key={term2}
      type="button"
      onClick={() => quickSearch(term2)}
      className={`chip whitespace-nowrap ${query.toLowerCase() === term2 ? 'chip-active' : ''}`}
    >
      {term2}
    </button>
  ))

  return (
    <>
      {/* search field ---------------------------------------------------- */}
      <section className="page pt-8 sm:pt-12">
        <Breadcrumbs trail={[{ label: 'Recherche' }]} />
        <h1 className="section-title">Recherche FLASHORA</h1>
        <p className="lede mt-3 max-w-xl text-ink-mute">
          Parcourez tout le catalogue Cyber Monday — par nom, catégorie, marque ou simplement
          selon ce dont vous avez besoin.
        </p>

        <form
          className="mt-6 flex flex-col gap-3 sm:flex-row"
          role="search"
          onSubmit={(event) => {
            event.preventDefault()
            submitSearch(term)
          }}
        >
          <div className="relative flex-1">
            <SearchIcon
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-mute"
            />
            <label className="sr-only" htmlFor="search-input">
              Rechercher des produits
            </label>
            <input
              id="search-input"
              ref={inputRef}
              type="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Essayez « casque », « ordinateur portable » ou « idées cadeaux »"
              autoComplete="off"
              className="input h-12 pl-11 pr-4 text-base"
            />
          </div>
          <button type="submit" className="btn btn-ink h-12 shrink-0 px-7">
            Rechercher <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-5">
          <p className="label">Recherches populaires</p>
          <ChipRow label="Recherches populaires">{trendingChips}</ChipRow>
        </div>
      </section>

      {/* results --------------------------------------------------------- */}
      <section className="page pb-4 pt-6" aria-labelledby="search-results-title">
        {query ? (
          results.length > 0 ? (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="eyebrow">Résultats de recherche</p>
                  <h2
                    id="search-results-title"
                    className="mt-2 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl"
                  >
                    {results.length}{' '}
                    {results.length === 1 ? 'résultat' : 'résultats'} pour « {query} »
                  </h2>
                </div>
                <SortSelect id="search-sort" value={sort} onChange={setSort} />
              </div>
              <ProductGrid items={results} />
            </>
          ) : (
            <div
              id="search-results-title"
              className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-card border border-dashed border-line bg-white px-6 py-16 text-center"
            >
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-shell text-flash">
                <SearchIcon size={22} />
              </span>
              <div>
                <p className="font-display text-2xl font-bold">Aucun résultat trouvé</p>
                <p className="mt-2 text-sm text-ink-mute">
                  Aucun résultat pour « {query} ». Vérifiez l’orthographe ou essayez plutôt l’une
                  de ces suggestions :
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-2">{trendingChips}</div>

              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((item) => (
                  <Link key={item.id} to={`/category/${item.id}`} className="chip">
                    {item.name}
                  </Link>
                ))}
              </div>

              <Link to="/shop" className="btn btn-ink mt-1">
                Parcourir tous les produits <ArrowRight size={16} />
              </Link>
            </div>
          )
        ) : (
          <div id="search-results-title">
            <SectionHeading
              eyebrow="Produits populaires"
              title="Produits populaires"
              text="Les huit produits qui suscitent le plus d’attention en ce moment."
              action={{ label: 'Voir tous les produits', to: '/shop' }}
            />
            <ProductGrid items={popular} />
          </div>
        )}
      </section>

      <Newsletter />
    </>
  )
}

/* ======================================================= WISHLIST PAGE === */

export function WishlistPage() {
  useDocumentTitle('Vos favoris | FLASHORA')

  const { wishlist, toggleWishlist, addToCart, inWishlist } = useStore()

  const saved = useMemo(
    () =>
      wishlist
        .map((id) => productById(id))
        .filter((product): product is Product => Boolean(product)),
    [wishlist],
  )

  const inStockSaved = saved.filter((product) => product.inStock)

  const suggestions = useMemo(
    () => sortProducts(products.filter((product) => !inWishlist(product.id)), 'popular').slice(0, 4),
    [inWishlist],
  )

  const moveAllToCart = () => {
    inStockSaved.forEach((product) => addToCart(product))
  }

  /* ------------------------------------------------------- empty state -- */
  if (saved.length === 0) {
    return (
      <>
        <section className="page section flex flex-col items-center justify-center py-20 text-center">
          <Breadcrumbs trail={[{ label: 'Favoris' }]} />
          <span className="grid h-16 w-16 place-items-center rounded-full bg-flash/10 text-flash">
            <HeartIcon size={28} />
          </span>
          <p className="eyebrow mt-6">Enregistrés pour plus tard</p>
          <h1 className="section-title mt-3">Vos favoris</h1>
          <p className="lede mt-4 max-w-md text-ink-mute">
            Rien ici pour le moment. Touchez le cœur d’un produit pour le garder à portée pendant
            que vous réfléchissez — vos favoris sont conservés même après le rafraîchissement de la
            page.
          </p>
          <Link to="/shop" className="btn btn-ink mt-8">
            Découvrir les soldes <ArrowRight size={16} />
          </Link>
        </section>

        <Newsletter />
      </>
    )
  }

  /* ----------------------------------------------------- has products -- */
  return (
    <>
      <section className="page pt-8 sm:pt-12">
        <Breadcrumbs trail={[{ label: 'Favoris' }]} />

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">
              <HeartIcon size={14} className="text-flash" /> Enregistrés pour plus tard
            </p>
            <h1 className="section-title mt-3">Vos favoris</h1>
            <p className="lede mt-3 max-w-xl text-ink-mute">
              {saved.length} {saved.length === 1 ? 'article enregistré' : 'articles enregistrés'}{' '}
              — gardez-les ici jusqu’à ce que le prix soit bon.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={moveAllToCart}
              disabled={inStockSaved.length === 0}
              className="btn btn-ink"
            >
              <BagIcon size={16} /> Tout ajouter au panier
            </button>
            <Link to="/shop" className="btn btn-light">
              Découvrir les soldes
            </Link>
          </div>
        </div>

        {inStockSaved.length === 0 && (
          <p className="mt-4 text-sm text-ink-mute">
            Tous les articles enregistrés sont actuellement en rupture de stock — parcourez les
            soldes en attendant.
          </p>
        )}
      </section>

      <section className="page pb-4 pt-8" aria-label="Produits enregistrés">
        <h2 className="sr-only">Produits enregistrés</h2>
        <ProductGrid items={saved} />
      </section>

      {suggestions.length > 0 && (
        <section className="page section pt-4" aria-labelledby="wishlist-suggestions-title">
          <div id="wishlist-suggestions-title">
            <SectionHeading
              eyebrow="Vus récemment"
              title="Vous aimerez peut-être aussi"
              text="Des sélections populaires qui ne sont pas encore dans vos favoris."
              action={{ label: 'Parcourir tous les produits', to: '/shop' }}
            />
          </div>
          <ProductGrid items={suggestions} />
        </section>
      )}

      <Newsletter />
    </>
  )
}
