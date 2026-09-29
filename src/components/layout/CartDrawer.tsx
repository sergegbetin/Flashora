import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { FREE_SHIPPING_FROM } from '../../store/StoreContext'
import { formatPrice } from '../../utils/format'
import { ImageFrame } from '../ui/ImageFrame'
import { QuantityStepper } from '../ui/Primitives'
import { ArrowRight, CloseIcon, ShieldIcon, TrashIcon } from '../ui/Icons'

export function CartDrawer() {
  const {
    cartOpen,
    setCartOpen,
    cartItems,
    cartCount,
    setQty,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    total,
    promo,
    applyPromo,
    removePromo,
  } = useStore()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!cartOpen) return undefined
    document.body.style.overflow = 'hidden'
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCartOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [cartOpen, setCartOpen])

  if (!cartOpen) return null

  const remaining = Math.max(0, FREE_SHIPPING_FROM - (subtotal - discount))

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] fade-in"
        onClick={() => setCartOpen(false)}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        className="panel absolute right-0 top-0 flex h-full w-full max-w-md flex-col slide-left"
      >
        <header className="flex h-20 items-center justify-between border-b border-line px-5">
          <div>
            <p className="eyebrow">Votre panier</p>
            <p className="font-display text-lg font-bold">{cartCount} article{cartCount === 1 ? '' : 's'}</p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Fermer le panier"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white transition hover:border-ink"
          >
            <CloseIcon size={18} />
          </button>
        </header>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-shell text-ink-mute">
              <ShieldIcon size={26} />
            </span>
            <div>
              <p className="font-display text-xl font-bold">Votre panier est vide</p>
              <p className="mt-1 text-sm text-ink-mute">
                Les soldes Cyber Monday vous attendent dans la boutique.
              </p>
            </div>
            <Link to="/shop" onClick={() => setCartOpen(false)} className="btn btn-ink">
              Parcourir les soldes <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5">
              {remaining > 0 && (
                <p className="rounded-2xl border border-line bg-white p-3 text-xs text-ink-soft">
                  Encore {formatPrice(remaining)} pour la livraison standard offerte.
                </p>
              )}

              {cartItems.map(({ product, qty }) => (
                <article
                  key={product.id}
                  className="flex gap-3 rounded-2xl border border-line bg-white p-3"
                >
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={() => setCartOpen(false)}
                    className="shrink-0"
                  >
                    <ImageFrame
                      src={product.images[0]}
                      alt={product.imageAlts[0]}
                      aspect="aspect-square"
                      className="h-20 w-20 rounded-xl"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="text-sm font-semibold leading-snug hover:text-flash"
                      >
                        {product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        aria-label={`Supprimer ${product.name} du panier`}
                        className="text-ink-mute transition hover:text-danger"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>

                    <p className="mt-0.5 text-xs capitalize text-ink-mute">{product.category}</p>

                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <QuantityStepper
                        compact
                        value={qty}
                        onChange={(next) => setQty(product.id, next)}
                        max={20}
                        label={`Quantité pour ${product.name}`}
                      />
                      <span className="text-sm font-bold">
                        {formatPrice(product.price * qty)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}

              <div className="rounded-2xl border border-line bg-white p-4">
                <p className="label">Code promo</p>
                {promo ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="badge badge-amber">
                      {promo.code} — {promo.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        removePromo()
                        setMessage(null)
                      }}
                      className="text-xs font-semibold text-ink-mute underline hover:text-ink"
                    >
                      Supprimer
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault()
                      const result = applyPromo(code)
                      setMessage({ ok: result.ok, text: result.message })
                      if (result.ok) setCode('')
                    }}
                    className="flex gap-2"
                  >
                    <input
                      className="input py-2.5"
                      placeholder="FLASH10"
                      aria-label="Code promo"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                    />
                    <button type="submit" className="btn btn-light shrink-0 px-4 py-2.5">
                      Appliquer
                    </button>
                  </form>
                )}
                {message && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      message.ok ? 'text-signal' : 'text-danger'
                    }`}
                    role="status"
                  >
                    {message.text}
                  </p>
                )}
              </div>
            </div>

            <footer className="border-t border-line bg-white px-5 py-5">
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-mute">Sous-total</dt>
                  <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-signal">
                    <dt>Remise promo</dt>
                    <dd>−{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-ink-mute">Livraison</dt>
                  <dd className="font-semibold">
                    {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-line pt-2 text-base">
                  <dt className="font-display font-bold">Total</dt>
                  <dd className="font-display font-bold">{formatPrice(total)}</dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={() => {
                  setCartOpen(false)
                  navigate('/checkout')
                }}
                className="btn btn-flash mt-4 w-full"
              >
                Commander <ArrowRight size={16} />
              </button>

              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-ink-mute">
                <ShieldIcon size={14} /> Commande sécurisée · paiement chiffré
              </div>

              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="mt-2 w-full text-center text-xs font-semibold text-ink-mute underline hover:text-ink"
              >
                Continuer mes achats
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
