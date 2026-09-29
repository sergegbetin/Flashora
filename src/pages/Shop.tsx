import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import { categories } from '../data/categories'
import { filterRanges } from '../data/navigation'
import { useDocumentTitle } from '../hooks'
import { ProductGrid } from '../components/ui/ProductCard'
import { Newsletter } from '../components/layout/Footer'
import { ArrowRight, CloseIcon, FilterIcon, SearchIcon } from '../components/ui/Icons'

type SortId = 'featured' | 'popular' | 'newest' | 'price-asc' | 'price-desc' | 'discount'

const sortOptions: { id: SortId; label: string }[] = [
  { id: 'featured', label: 'Sélection' },
  { id: 'popular', label: 'Les plus populaires' },
  { id: 'newest', label: 'Nouveautés' },
  { id: 'price-asc', label: 'Prix : croissant' },
  { id: 'price-desc', label: 'Prix : décroissant' },
  { id: 'discount', label: 'Meilleure remise' },
]

interface Filters {
  category: string
  range: string
  minRating: number
  dealsOnly: boolean
  inStockOnly: boolean
}

const defaultFilters: Filters = {
  category: 'all',
  range: 'all',
  minRating: 0,
  dealsOnly: false,
  inStockOnly: false,
}

export function ShopPage() {
  useDocumentTitle('Soldes Cyber Monday | FLASHORA')
  const [params, setParams] = useSearchParams()
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [query, setQuery] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sort = (params.get('sort') as SortId) || 'featured'

  /* sync filters coming from the URL (category chips, header links) */
  useEffect(() => {
    setFilters((current) => ({
      ...current,
      category: params.get('category') || 'all',
    }))
    const q = params.get('q')
    if (q) setQuery(q)
  }, [params])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const visible = useMemo(() => {
    const range = filterRanges.find((item) => item.id === filters.range) || filterRanges[0]
    const term = query.trim().toLowerCase()

    const result = products.filter((product) => {
      if (filters.category !== 'all' && product.category !== filters.category) return false
      if (product.price < range.min || product.price > range.max) return false
      if (filters.minRating && product.rating < filters.minRating) return false
      if (filters.dealsOnly && product.discount < 20) return false
      if (filters.inStockOnly && !product.inStock) return false
      if (term) {
        const haystack =
          `${product.name} ${product.category} ${product.tagline} ${product.brand}`.toLowerCase()
        if (!term.split(/\s+/).every((word) => haystack.includes(word))) return false
      }
      return true
    })

    switch (sort) {
      case 'popular':
        return result.sort((a, b) => b.popularity - a.popularity)
      case 'newest':
        return result.sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt))
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price)
      case 'discount':
        return result.sort((a, b) => b.discount - a.discount)
      default:
        return result.sort((a, b) => b.popularity - a.popularity)
    }
  }, [products, filters, sort, query])

  const activeCount =
    (filters.category !== 'all' ? 1 : 0) +
    (filters.range !== 'all' ? 1 : 0) +
    (filters.minRating ? 1 : 0) +
    (filters.dealsOnly ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0)

  const update = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }))

  const reset = () => {
    setFilters(defaultFilters)
    setQuery('')
    setParams((current) => {
      const next = new URLSearchParams(current)
      next.delete('category')
      next.delete('q')
      return next
    })
  }

  const filterPanel = (
    <div className="space-y-7">
      <div>
        <p className="label">Rechercher</p>
        <div className="relative">
          <SearchIcon
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher des produits"
            aria-label="Rechercher des produits"
            className="input pl-10"
          />
        </div>
      </div>

      <fieldset>
        <legend className="label">Catégorie</legend>
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', name: 'Toutes' }, ...categories].map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => update({ category: category.id })}
              className={`chip ${filters.category === category.id ? 'chip-active' : ''}`}
              aria-pressed={filters.category === category.id}
            >
              {category.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Prix</legend>
        <div className="flex flex-wrap gap-2">
          {filterRanges.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => update({ range: range.id })}
              className={`chip ${filters.range === range.id ? 'chip-active' : ''}`}
              aria-pressed={filters.range === range.id}
            >
              {range.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Note</legend>
        <div className="flex flex-wrap gap-2">
          {[0, 4, 4.5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => update({ minRating: rating })}
              className={`chip ${filters.minRating === rating ? 'chip-active' : ''}`}
              aria-pressed={filters.minRating === rating}
            >
              {rating === 0 ? 'Toutes les notes' : `${rating}★ et plus`}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label">Disponibilité</legend>
        <div className="space-y-2 text-sm">
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={filters.dealsOnly}
              onChange={(event) => update({ dealsOnly: event.target.checked })}
              className="h-4 w-4 accent-[#ff4a17]"
            />
            Soldes Cyber Monday uniquement
          </label>
          <label className="flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(event) => update({ inStockOnly: event.target.checked })}
              className="h-4 w-4 accent-[#ff4a17]"
            />
            En stock uniquement
          </label>
        </div>
      </fieldset>

      <button type="button" onClick={reset} className="btn btn-light w-full">
        Effacer tous les filtres
      </button>
    </div>
  )

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-white to-cream">
        <div className="page py-10 sm:py-14">
          <nav aria-label="Fil d’Ariane" className="eyebrow mb-4">
            <Link to="/" className="hover:text-ink">
              Accueil
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink">Boutique</span>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="section-title">Boutique Cyber Monday</h1>
              <p className="lede mt-3 max-w-xl text-ink-mute">
                Tous les produits de la campagne — filtrez par catégorie, prix, note et
                disponibilité.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="sort-select">
                Trier les produits
              </label>
              <select
                id="sort-select"
                value={sort}
                onChange={(event) => {
                  const next = new URLSearchParams(params)
                  next.set('sort', event.target.value)
                  setParams(next)
                }}
                className="input cursor-pointer py-2.5 pr-8 font-semibold"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="btn btn-light py-2.5 lg:hidden"
              >
                <FilterIcon size={16} /> Filtres
                {activeCount > 0 && <span className="badge badge-flash">{activeCount}</span>}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-ink-mute">
            <span className="font-semibold text-ink">{visible.length}</span>{' '}
            {visible.length === 1 ? 'produit' : 'produits'}
            {filters.category !== 'all' && (
              <button
                type="button"
                className="chip chip-active"
                onClick={() => update({ category: 'all' })}
              >
                {categories.find((c) => c.id === filters.category)?.name} ×
              </button>
            )}
            {filters.dealsOnly && (
              <button
                type="button"
                className="chip chip-active"
                onClick={() => update({ dealsOnly: false })}
              >
                Soldes uniquement ×
              </button>
            )}
            {filters.inStockOnly && (
              <button
                type="button"
                className="chip chip-active"
                onClick={() => update({ inStockOnly: false })}
              >
                En stock ×
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="page grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:py-14">
        <aside className="hidden lg:block">
          <div className="sticky top-32 rounded-card border border-line bg-white p-6">
            {filterPanel}
          </div>
        </aside>

        <div>
          <h2 className="sr-only">Tous les produits Cyber Monday</h2>
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
                  Élargissez la fourchette de prix ou effacez la recherche.
                </p>
              </div>
              <button type="button" onClick={reset} className="btn btn-ink">
                Réinitialiser les filtres <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* mobile filter drawer ------------------------------------------- */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] fade-in"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filtres"
            className="panel absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col slide-right"
          >
            <div className="flex h-20 items-center justify-between border-b border-line px-5">
              <p className="font-display text-lg font-bold">Filtres</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Fermer les filtres"
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filterPanel}</div>
            <div className="border-t border-line p-5">
              <button type="button" onClick={() => setDrawerOpen(false)} className="btn btn-ink w-full">
                Afficher {visible.length} {visible.length === 1 ? 'produit' : 'produits'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Newsletter />
    </>
  )
}
