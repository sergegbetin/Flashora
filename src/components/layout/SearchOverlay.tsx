import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { products } from '../../data/products'
import { categories } from '../../data/categories'
import { ImageFrame } from '../ui/ImageFrame'
import { Price } from '../ui/Primitives'
import { ArrowRight, CloseIcon, SearchIcon } from '../ui/Icons'
import { trendingSearches } from '../../data/navigation'

/**
 * Full-screen search experience: suggestions before a query, matching
 * products after one, and an explicit empty state.
 */
export function SearchOverlay() {
  const { searchOpen, setSearchOpen, addToCart } = useStore()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!searchOpen) return undefined
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => inputRef.current?.focus(), 60)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(timer)
    }
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, setSearchOpen])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.tagline} ${product.description} ${product.brand}`.toLowerCase()
      return term.split(/\s+/).every((word) => haystack.includes(word))
    })
  }, [query])

  const popular = useMemo(
    () => [...products].sort((a, b) => b.popularity - a.popularity).slice(0, 4),
    [],
  )

  if (!searchOpen) return null

  const submit = (value: string) => {
    setSearchOpen(false)
    setQuery('')
    navigate(`/search?q=${encodeURIComponent(value)}`)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-[3px] fade-in"
        onClick={() => setSearchOpen(false)}
        aria-hidden
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-label="Rechercher sur FLASHORA"
        className="relative mx-auto mt-0 w-full max-w-4xl bg-cream shadow-pop slide-right sm:mt-6 sm:rounded-b-3xl"
      >
        <div className="flex items-center gap-3 border-b border-line px-5 py-5 sm:px-8">
          <SearchIcon size={22} className="shrink-0 text-ink-mute" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && query.trim()) submit(query.trim())
            }}
            placeholder="Rechercher sur FLASHORA"
            aria-label="Rechercher des produits"
            className="h-10 w-full bg-transparent font-display text-xl font-semibold outline-none placeholder:text-ink-mute sm:text-2xl"
          />
          <button
            type="button"
            onClick={() => setSearchOpen(false)}
            aria-label="Fermer la recherche"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white transition hover:border-ink"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          {!query.trim() && (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="eyebrow mb-3">Recherches tendance</p>
                <ul className="flex flex-wrap gap-2">
                  {trendingSearches.map((term) => (
                    <li key={term}>
                      <button type="button" className="chip" onClick={() => setQuery(term)}>
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>

                <p className="eyebrow mt-7 mb-3">Catégories</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="chip"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="eyebrow mb-3">Produits populaires</p>
                <ul className="space-y-2">
                  {popular.map((product) => (
                    <li key={product.id}>
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-2xl border border-transparent bg-white p-2 transition hover:border-ink/20"
                      >
                        <ImageFrame
                          src={product.images[0]}
                          alt={product.imageAlts[0]}
                          aspect="aspect-square"
                          className="h-14 w-14 shrink-0 rounded-xl"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold">
                            {product.name}
                          </span>
                          <span className="block text-xs capitalize text-ink-mute">
                            {product.category}
                          </span>
                        </span>
                        <Price price={product.price} oldPrice={product.oldPrice} size="sm" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {query.trim() && results.length > 0 && (
            <div>
              <p className="eyebrow mb-4">
                {results.length} résultat{results.length > 1 ? 's' : ''} pour « {query.trim()} »
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {results.slice(0, 6).map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5"
                  >
                    <Link
                      to={`/product/${product.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex min-w-0 flex-1 items-center gap-3"
                    >
                      <ImageFrame
                        src={product.images[0]}
                        alt={product.imageAlts[0]}
                        aspect="aspect-square"
                        className="h-16 w-16 shrink-0 rounded-xl"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{product.name}</span>
                        <span className="block text-xs capitalize text-ink-mute">
                          {product.category}
                        </span>
                        <span className="mt-1 block text-sm font-bold">
                          <Price price={product.price} oldPrice={product.oldPrice} size="sm" />
                        </span>
                      </span>
                    </Link>
                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="btn btn-ink btn-sm px-3"
                        aria-label={`Ajouter ${product.name} au panier`}
                      >
                        Ajouter
                      </button>
                      <button
                        type="button"
                        onClick={() => submit(product.name)}
                        className="btn btn-light btn-sm px-3"
                        aria-label={`Voir ${product.name}`}
                      >
                        Voir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => submit(query.trim())}
                className="btn btn-ghost mt-5 w-full"
              >
                Voir tous les résultats <ArrowRight size={16} />
              </button>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div className="py-6 text-center">
              <p className="font-display text-2xl font-bold">Aucun résultat pour « {query.trim()} »</p>
              <p className="lede mx-auto mt-2 max-w-md text-ink-mute">
                Essayez une catégorie ou l’une de ces recherches populaires.
              </p>
              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {trendingSearches.map((term) => (
                  <li key={term}>
                    <button type="button" className="chip" onClick={() => setQuery(term)}>
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="btn btn-ink mt-6"
              >
                Parcourir tous les produits
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
