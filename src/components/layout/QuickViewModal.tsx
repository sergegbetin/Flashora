import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { productById } from '../../data/products'
import { ImageFrame } from '../ui/ImageFrame'
import { Price, QuantityStepper, Rating } from '../ui/Primitives'
import { CloseIcon } from '../ui/Icons'

/** Quick view modal: key product facts without leaving the current page. */
export function QuickViewModal() {
  const { quickViewId, closeQuickView, addToCart } = useStore()
  const [qty, setQty] = useState(1)
  const product = quickViewId ? productById(quickViewId) : undefined

  useEffect(() => {
    setQty(1)
  }, [quickViewId])

  useEffect(() => {
    if (!product) return undefined
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeQuickView()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [product, closeQuickView])

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-ink/55 backdrop-blur-[3px] fade-in"
        onClick={closeQuickView}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Aperçu rapide : ${product.name}`}
        className="relative z-10 grid w-full max-w-3xl overflow-hidden rounded-t-3xl bg-cream shadow-pop scale-in sm:rounded-3xl md:grid-cols-2"
      >
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="Fermer l’aperçu rapide"
          className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-line bg-white/90 backdrop-blur transition hover:border-ink"
        >
          <CloseIcon size={18} />
        </button>

        <ImageFrame
          src={product.images[0]}
          alt={product.imageAlts[0]}
          aspect="aspect-[4/3] md:aspect-auto md:h-full"
          imgClassName="transition-transform duration-500 hover:scale-105"
        />

        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <div className="flex items-center gap-2">
            {product.badge && <span className="badge badge-flash">{product.badge}</span>}
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-mute">
              {product.category}
            </span>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold leading-tight">{product.name}</h2>
            <p className="mt-1 text-sm text-ink-mute">{product.tagline}</p>
          </div>

          <Rating value={product.rating} count={product.reviews} />
          <Price price={product.price} oldPrice={product.oldPrice} size="lg" showSaving />

          <p className="text-sm leading-relaxed text-ink-soft line-clamp-3">
            {product.description}
          </p>

          <p className={`text-xs font-semibold ${product.inStock ? 'text-signal' : 'text-danger'}`}>
            {product.inStock ? 'En stock · expédié sous 24 h' : 'Rupture de stock pour le moment'}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
            <QuantityStepper value={qty} onChange={setQty} max={20} />
            <button
              type="button"
              onClick={() => addToCart(product, qty)}
              disabled={!product.inStock}
              className="btn btn-ink flex-1"
            >
              Ajouter au panier
            </button>
          </div>

          <Link
            to={`/product/${product.slug}`}
            onClick={closeQuickView}
            className="btn btn-light w-full"
          >
            Voir le produit
          </Link>
        </div>
      </div>
    </div>
  )
}
