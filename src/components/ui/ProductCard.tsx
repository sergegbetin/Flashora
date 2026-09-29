import { Link } from 'react-router-dom'
import type { Product } from '../../types'
import { useStore } from '../../store/StoreContext'
import { ImageFrame } from './ImageFrame'
import { Price, Rating } from './Primitives'
import { EyeIcon, HeartIcon } from './Icons'

interface ProductCardProps {
  product: Product
  /** index used to stagger the entrance animation */
  index?: number
  compact?: boolean
}

/**
 * Core merchandising card: image, category, name, price, old price, discount,
 * rating, review count, wishlist toggle, quick view and add to cart.
 */
export function ProductCard({ product, index = 0, compact = false }: ProductCardProps) {
  const { addToCart, toggleWishlist, inWishlist, openQuickView } = useStore()
  const wished = inWishlist(product.id)

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-ink/25 hover:shadow-pop fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
    >
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.slug}`} tabIndex={-1} aria-hidden className="block">
          <ImageFrame
            src={product.images[0]}
            alt={product.imageAlts[0]}
            aspect={compact ? 'aspect-[4/3]' : 'aspect-[4/5]'}
            imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && <span className="badge badge-flash">{product.badge}</span>}
          {product.isNew && !product.badge && <span className="badge badge-ink">Nouveau</span>}
          {!product.inStock && <span className="badge badge-light">Rupture de stock</span>}
        </div>

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => toggleWishlist(product.id)}
            aria-pressed={wished}
            aria-label={wished ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
            className={`grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition ${
              wished
                ? 'border-flash bg-flash text-white'
                : 'border-white/70 bg-white/85 text-ink hover:border-ink'
            }`}
          >
            <HeartIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => openQuickView(product.id)}
            aria-label={`Aperçu rapide de ${product.name}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/70 bg-white/85 text-ink opacity-0 backdrop-blur transition duration-200 hover:border-ink focus-visible:opacity-100 group-hover:opacity-100"
          >
            <EyeIcon size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="absolute inset-x-3 bottom-3 hidden h-11 translate-y-3 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white opacity-0 transition-all duration-300 hover:bg-flash disabled:cursor-not-allowed disabled:opacity-50 md:inline-flex focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-mute">
            {product.category}
          </span>
          <Rating value={product.rating} count={product.reviews} size={12} />
        </div>

        <h3 className="font-display text-base font-semibold leading-snug tracking-tight">
          <Link to={`/product/${product.slug}`} className="transition hover:text-flash">
            {product.name}
          </Link>
        </h3>

        <p className="text-sm text-ink-mute">{product.tagline}</p>

        <div className="mt-auto pt-2">
          <Price price={product.price} oldPrice={product.oldPrice} size="md" />
        </div>

        <button
          type="button"
          onClick={() => addToCart(product)}
          disabled={!product.inStock}
          className="btn btn-ink mt-1 h-10 w-full px-4 text-xs md:hidden"
        >
          {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
        </button>
      </div>
    </article>
  )
}

export function ProductGrid({
  items,
  compact = false,
  className = '',
}: {
  items: Product[]
  compact?: boolean
  className?: string
}) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {items.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} compact={compact} />
      ))}
    </div>
  )
}
