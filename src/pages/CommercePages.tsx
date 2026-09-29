import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '../hooks'
import {
  FREE_SHIPPING_FROM,
  SHIPPING_FLAT,
  useStore,
  type OrderSummary,
} from '../store/StoreContext'
import { products } from '../data/products'
import { formatDate, formatPrice } from '../utils/format'
import { Newsletter } from '../components/layout/Footer'
import { ImageFrame } from '../components/ui/ImageFrame'
import { ProductGrid } from '../components/ui/ProductCard'
import { InfoTile, QuantityStepper, SectionHeading } from '../components/ui/Primitives'
import {
  ArrowRight,
  BagIcon,
  BoltIcon,
  CardIcon,
  CheckIcon,
  ChatIcon,
  ClockIcon,
  MailIcon,
  ReturnIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from '../components/ui/Icons'

/* ====================================================== shared bits ====== */

function PageHeader({ crumb, title, lede }: { crumb: string; title: string; lede: string }) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-white to-cream">
      <div className="page py-8 sm:py-12">
        <nav aria-label="Fil d’Ariane" className="eyebrow mb-5 flex flex-wrap gap-2">
          <Link to="/" className="transition hover:text-ink">
            Accueil
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ink">{crumb}</span>
        </nav>
        <h1 className="section-title text-balance">{title}</h1>
        <p className="lede mt-3 max-w-2xl text-ink-mute">{lede}</p>
      </div>
    </section>
  )
}

function EmptyState({
  title,
  text,
  cta,
  to,
}: {
  title: string
  text: string
  cta: string
  to: string
}) {
  return (
    <div className="mx-auto max-w-md rounded-card border border-line bg-white p-8 text-center shadow-card sm:p-10">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-shell text-ink-mute">
        <BagIcon size={26} />
      </span>
      <p className="eyebrow mt-5 justify-center">Rien ici pour le moment</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-mute">{text}</p>
      <Link to={to} className="btn btn-ink mt-6">
        {cta} <ArrowRight size={16} />
      </Link>
    </div>
  )
}

/** Promo code card shared by the cart page and the checkout summary. */
function PromoForm() {
  const { promo, applyPromo, removePromo } = useStore()
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  return (
    <div className="card p-5">
      <p className="label">Code promo</p>

      {promo ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="badge badge-amber">
            {promo.code} — {promo.label}
          </span>
          <button
            type="button"
            onClick={() => {
              removePromo()
              setMessage(null)
            }}
            className="text-xs font-semibold text-ink-mute underline transition hover:text-ink"
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

      <p
        role="status"
        aria-live="polite"
        className={`text-xs font-medium ${message ? 'mt-2 ' : ''}${
          message ? (message.ok ? 'text-signal' : 'text-danger') : ''
        }`}
      >
        {message ? message.text : ''}
      </p>
    </div>
  )
}

function FieldMessage({ id, error }: { id: string; error?: string }) {
  if (!error) return null
  return (
    <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-danger">
      {error}
    </p>
  )
}

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  autoComplete,
  placeholder,
  inputMode,
  optional = false,
  className = '',
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
  type?: string
  autoComplete?: string
  placeholder?: string
  inputMode?: 'text' | 'email' | 'tel' | 'numeric'
  optional?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>
        {label}
        {optional && <span className="ml-1 font-normal normal-case tracking-normal">facultatif</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="input"
      />
      <FieldMessage id={id} error={error} />
    </div>
  )
}

/* ========================================================== CART ========= */

export function CartPage() {
  useDocumentTitle('Panier | FLASHORA')
  const { cartItems, cartCount, subtotal, discount, shipping, total, setQty, removeFromCart } =
    useStore()
  const navigate = useNavigate()

  const inCart = new Set(cartItems.map((item) => item.product.id))
  const recommended = [...products]
    .sort((a, b) => b.rating - a.rating)
    .filter((product) => !inCart.has(product.id))
    .slice(0, 4)
  const remaining = Math.max(0, FREE_SHIPPING_FROM - (subtotal - discount))
  const isEmpty = cartItems.length === 0

  return (
    <>
      <PageHeader
        crumb="Panier"
        title="Votre panier"
        lede="Vérifiez vos pépites Cyber Monday, ajustez les quantités et appliquez un code promo avant de commander."
      />

      <section className="page section">
        {isEmpty ? (
          <EmptyState
            title="Votre panier est vide"
            text="Votre panier est vide — les offres Cyber Monday vous attendent dans la boutique."
            cta="Voir les offres"
            to="/shop"
          />
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-10">
            {/* ---------------------------------------------- lines ---- */}
            <div className="space-y-6">
              <div className="card p-4 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3 pb-4">
                  <p className="label mb-0">
                    {cartCount} article{cartCount === 1 ? '' : 's'} dans votre panier
                  </p>
                  <span className="badge badge-flash">Tarifs Cyber Monday appliqués</span>
                </div>

                <div className="hidden items-center gap-6 border-b border-line pb-3 md:flex">
                  <span className="flex-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                    Produit
                  </span>
                  <span className="w-[106px] text-[11px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                    Quantité
                  </span>
                  <span className="w-24 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                    Total
                  </span>
                  <span className="w-10" aria-hidden />
                </div>

                <ul className="divide-y divide-line">
                  {cartItems.map(({ product, qty }) => (
                    <li
                      key={product.id}
                      className="grid gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6 sm:py-5"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <Link
                          to={`/product/${product.slug}`}
                          className="shrink-0"
                          aria-label={`Voir ${product.name}`}
                        >
                          <ImageFrame
                            src={product.images[0]}
                            alt={product.imageAlts[0]}
                            aspect="aspect-square"
                            className="h-20 w-20 rounded-xl sm:h-24 sm:w-24"
                          />
                        </Link>

                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                            {product.category}
                          </p>
                          <h3 className="mt-1 font-display text-base font-semibold leading-snug tracking-tight">
                            <Link
                              to={`/product/${product.slug}`}
                              className="transition hover:text-flash"
                            >
                              {product.name}
                            </Link>
                          </h3>
                          <p className="mt-1.5 flex flex-wrap items-baseline gap-2 text-sm">
                            <span className="font-bold">{formatPrice(product.price)}</span>
                            {product.oldPrice > product.price && (
                              <s className="text-xs text-ink-mute">
                                {formatPrice(product.oldPrice)}
                              </s>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <QuantityStepper
                          value={qty}
                          onChange={(next) => setQty(product.id, next)}
                          max={20}
                          label={`Quantité pour ${product.name}`}
                        />
                        <p className="w-24 text-right font-display text-base font-bold tabular-nums">
                          {formatPrice(product.price * qty)}
                        </p>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label={`Retirer ${product.name} du panier`}
                          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white text-ink-mute transition hover:border-danger hover:text-danger"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <InfoTile
                  icon={<TruckIcon size={18} />}
                  title="Livraison standard offerte"
                  text={`Dès ${formatPrice(FREE_SHIPPING_FROM)} d’achat · 3 à 5 jours ouvrés.`}
                />
                <InfoTile
                  icon={<ReturnIcon size={18} />}
                  title="Retours sous 30 jours"
                  text="Vous avez changé d’avis ? Renvoyez-le avec l’étiquette prépayée."
                />
                <InfoTile
                  icon={<ChatIcon size={18} />}
                  title="À votre écoute"
                  text="Une équipe réelle 7 jours sur 7 — FAQ ou contactez-nous."
                />
              </div>
            </div>

            {/* -------------------------------------------- summary ---- */}
            <aside className="space-y-4 lg:sticky lg:top-24">
              <PromoForm />

              <div className="card p-5">
                <p className="label">Résumé de la commande</p>

                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-ink-mute">Sous-total</dt>
                    <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-baseline justify-between gap-3 text-signal">
                      <dt>Réduction promo</dt>
                      <dd className="font-semibold tabular-nums">−{formatPrice(discount)}</dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-ink-mute">Livraison</dt>
                    <dd className="font-semibold">
                      {shipping === 0 ? 'Offerte' : formatPrice(shipping)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
                    <dt className="font-display text-base font-bold">Total</dt>
                    <dd className="font-display text-xl font-bold tabular-nums">
                      {formatPrice(total)}
                    </dd>
                  </div>
                </dl>

                <p
                  className={`mt-4 rounded-2xl border p-3 text-xs leading-relaxed ${
                    remaining > 0
                      ? 'border-line bg-shell text-ink-soft'
                      : 'border-signal/30 bg-signal/5 font-semibold text-signal'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {remaining > 0 ? (
                    <>
                      Ajoutez{' '}
                      <strong className="font-bold text-ink">{formatPrice(remaining)}</strong> de
                      plus pour profiter de la livraison standard offerte.
                    </>
                  ) : (
                    <>Livraison standard offerte débloquée ✓</>
                  )}
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="btn btn-flash mt-4 w-full"
                >
                  Commander <ArrowRight size={16} />
                </button>

                <Link
                  to="/shop"
                  className="mt-3 block text-center text-sm font-semibold text-ink-mute underline transition hover:text-ink"
                >
                  Continuer mes achats
                </Link>

                <div className="divider my-4" />

                <p className="flex items-center justify-center gap-2 text-xs text-ink-mute">
                  <ShieldIcon size={14} className="text-signal" /> Commande sécurisée · paiement
                  chiffré
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>

      {!isEmpty && (
        <section className="border-y border-line bg-shell">
          <div className="page section">
            <SectionHeading
              eyebrow="Vous aimerez aussi"
              title="Complétez votre installation"
              text="Les meilleures notes qui ne sont pas encore dans votre panier — toujours au prix Cyber Monday."
              action={{ label: 'Voir toutes les offres', to: '/shop' }}
            />
            <ProductGrid items={recommended} />
          </div>
        </section>
      )}

      <Newsletter />
    </>
  )
}

/* ======================================================= CHECKOUT ======== */

type DeliveryId = 'standard' | 'express'
type PaymentId = 'card' | 'paypal' | 'applepay'

const EXPRESS_FEE = 12

const COUNTRIES = [
  'Allemagne',
  'France',
  'Pays-Bas',
  'Belgique',
  'Luxembourg',
  'Suisse',
  'Autriche',
  'Espagne',
  'Italie',
  'Portugal',
  'Irlande',
  'Suède',
  'Danemark',
  'Finlande',
  'Pologne',
  'Tchéquie',
  'Royaume-Uni',
  'États-Unis',
  'Canada',
  'Japon',
  'Australie',
]

const PAYMENT_METHODS: { id: PaymentId; name: string; hint: string; logo: ReactNode }[] = [
  {
    id: 'card',
    name: 'Carte',
    hint: 'Visa, Mastercard, Amex — via un prestataire conforme PCI-DSS',
    logo: <CardIcon size={20} />,
  },
  {
    id: 'paypal',
    name: 'PayPal',
    hint: 'Payez avec votre solde PayPal ou votre compte bancaire associé',
    logo: <span className="font-display text-sm font-bold tracking-tight">PayPal</span>,
  },
  {
    id: 'applepay',
    name: 'Apple Pay',
    hint: 'Paiement en un geste avec Face ID ou Touch ID',
    logo: <span className="font-display text-sm font-bold tracking-tight">Apple&nbsp;Pay</span>,
  },
]

interface InfoForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postal: string
  country: string
  phone: string
}

type InfoKey = keyof InfoForm

const emptyForm: InfoForm = {
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  postal: '',
  country: '',
  phone: '',
}

const createOrderId = (): string => {
  const now = new Date()
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}`
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `FL-${stamp}-${suffix}`
}

export function CheckoutPage() {
  useDocumentTitle('Commande | FLASHORA')
  const {
    cartItems,
    cartCount,
    subtotal,
    discount,
    promo,
    setLastOrder,
    clearCart,
    notify,
  } = useStore()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<InfoForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<InfoKey, string>>>({})
  const [infoSummary, setInfoSummary] = useState('')
  const [delivery, setDelivery] = useState<DeliveryId>('standard')
  const [payment, setPayment] = useState<PaymentId>('card')
  const [processing, setProcessing] = useState(false)

  const timerRef = useRef<number | null>(null)
  const stepRef = useRef<HTMLDivElement | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    },
    [],
  )

  /* ------------------------------------------------- computed totals ---- */
  const standardCost = subtotal - discount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT
  const deliveryOptions = [
    { id: 'standard' as DeliveryId, name: 'Livraison standard', window: '3 à 5 jours ouvrés', cost: standardCost },
    {
      id: 'express' as DeliveryId,
      name: 'Livraison express',
      window: '1 à 2 jours ouvrés',
      cost: standardCost + EXPRESS_FEE,
    },
  ]
  const selectedDelivery =
    deliveryOptions.find((option) => option.id === delivery) ?? deliveryOptions[0]
  const selectedPayment = PAYMENT_METHODS.find((method) => method.id === payment) ?? PAYMENT_METHODS[0]
  const checkoutTotal = Math.max(0, subtotal - discount + selectedDelivery.cost)

  const arrivalWindow = useMemo(() => {
    const min = delivery === 'express' ? 1 : 3
    const max = delivery === 'express' ? 2 : 5
    const format = (date: Date) =>
      date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
    const from = new Date()
    from.setDate(from.getDate() + min)
    const to = new Date()
    to.setDate(to.getDate() + max)
    return `${format(from)} – ${format(to)}`
  }, [delivery])

  /* ------------------------------------------------------- behaviour ---- */
  const scrollToStep = () => {
    const element = stepRef.current
    if (!element) return
    const top = element.getBoundingClientRect().top + window.scrollY - 110
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const goTo = (next: number) => {
    setStep(next)
    window.requestAnimationFrame(scrollToStep)
  }

  const setField = (key: InfoKey) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    if (infoSummary) setInfoSummary('')
  }

  const validateInfo = (): Partial<Record<InfoKey, string>> => {
    const next: Partial<Record<InfoKey, string>> = {}
    const email = form.email.trim()
    if (!email) next.email = 'Saisissez votre adresse e-mail.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) next.email = 'Adresse e-mail invalide.'
    if (!form.firstName.trim()) next.firstName = 'Saisissez votre prénom.'
    if (!form.lastName.trim()) next.lastName = 'Saisissez votre nom.'
    if (!form.address.trim()) next.address = 'Saisissez votre adresse.'
    if (!form.city.trim()) next.city = 'Saisissez votre ville.'
    const postal = form.postal.trim()
    if (!postal) next.postal = 'Saisissez votre code postal.'
    else if (!/^[\dA-Za-z][\dA-Za-z -]{2,9}$/.test(postal)) next.postal = 'Code postal invalide.'
    if (!form.country) next.country = 'Sélectionnez un pays.'
    return next
  }

  const continueFromInfo = () => {
    const next = validateInfo()
    const count = Object.keys(next).length
    setErrors(next)
    if (count > 0) {
      setInfoSummary(
        `Veuillez corriger ${count} champ${count === 1 ? '' : 's'} avant de continuer.`,
      )
      return
    }
    setInfoSummary('')
    goTo(1)
  }

  const placeOrder = () => {
    if (processing) return
    setProcessing(true)
    timerRef.current = window.setTimeout(() => {
      const order: OrderSummary = {
        id: createOrderId(),
        placedAt: new Date().toISOString(),
        lines: cartItems.map(({ product, qty }) => ({
          productId: product.id,
          name: product.name,
          qty,
          price: product.price,
          image: product.images[0],
        })),
        subtotal,
        discount,
        shipping: selectedDelivery.cost,
        total: checkoutTotal,
        promo: promo?.code ?? null,
        email: form.email.trim(),
        delivery: `${selectedDelivery.name} · ${selectedDelivery.window}`,
      }
      setLastOrder(order)
      clearCart()
      notify({ title: 'Commande passée ✓', message: order.id, tone: 'success' })
      navigate('/order-confirmation')
    }, 600)
  }

  /* ----------------------------------------------------------- guard ---- */
  if (cartItems.length === 0 && !processing) {
    return (
      <>
        <PageHeader
          crumb="Commande"
          title="Commander"
          lede="Trois étapes courtes : vos coordonnées, la livraison et le paiement."
        />
        <section className="page section">
          <EmptyState
            title="Rien à commander pour l’instant"
            text="Votre panier est vide. Ajoutez une offre Cyber Monday et la commande sera prête."
            cta="Retour à la boutique"
            to="/shop"
          />
        </section>
      </>
    )
  }

  /* ------------------------------------------------------- step bodies -- */
  const steps = [
    { key: 'information', label: 'Coordonnées' },
    { key: 'delivery', label: 'Livraison' },
    { key: 'payment', label: 'Paiement' },
  ]

  const stepBody =
    step === 0 ? (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="co-email"
            label="Adresse e-mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="vous@exemple.fr"
            className="sm:col-span-2"
            value={form.email}
            onChange={setField('email')}
            error={errors.email}
          />
          <TextField
            id="co-first"
            label="Prénom"
            autoComplete="given-name"
            value={form.firstName}
            onChange={setField('firstName')}
            error={errors.firstName}
          />
          <TextField
            id="co-last"
            label="Nom"
            autoComplete="family-name"
            value={form.lastName}
            onChange={setField('lastName')}
            error={errors.lastName}
          />
          <TextField
            id="co-address"
            label="Adresse"
            autoComplete="street-address"
            placeholder="Rue et numéro"
            className="sm:col-span-2"
            value={form.address}
            onChange={setField('address')}
            error={errors.address}
          />
          <TextField
            id="co-city"
            label="Ville"
            autoComplete="address-level2"
            value={form.city}
            onChange={setField('city')}
            error={errors.city}
          />
          <TextField
            id="co-postal"
            label="Code postal"
            autoComplete="postal-code"
            inputMode="numeric"
            value={form.postal}
            onChange={setField('postal')}
            error={errors.postal}
          />
          <div className="sm:col-span-2">
            <label className="label" htmlFor="co-country">
              Pays
            </label>
            <select
              id="co-country"
              value={form.country}
              onChange={(event) => setField('country')(event.target.value)}
              aria-invalid={errors.country ? true : undefined}
              aria-describedby={errors.country ? 'co-country-error' : undefined}
              className="input cursor-pointer"
            >
              <option value="">Sélectionnez un pays</option>
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <FieldMessage id="co-country" error={errors.country} />
          </div>
          <TextField
            id="co-phone"
            label="Téléphone"
            optional
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+33 6 12 34 56 78"
            className="sm:col-span-2"
            value={form.phone}
            onChange={setField('phone')}
          />
        </div>

        <p className="text-xs leading-relaxed text-ink-mute">
          Commande de démonstration — ces informations restent dans votre navigateur et servent
          uniquement à afficher le résumé de votre commande.
        </p>
      </div>
    ) : step === 1 ? (
      <fieldset>
        <legend className="label">Mode de livraison</legend>
        <div className="space-y-3">
          {deliveryOptions.map((option) => {
            const active = delivery === option.id
            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                  active
                    ? 'border-ink bg-shell shadow-card'
                    : 'border-line bg-white hover:border-ink/40'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={active}
                  onChange={() => setDelivery(option.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#ff4a17]"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-display text-sm font-semibold">{option.name}</span>
                    <span className="text-sm font-bold tabular-nums">
                      {option.cost === 0 ? 'Offerte' : formatPrice(option.cost)}
                    </span>
                  </span>
                  <span className="mt-1 block text-xs text-ink-mute">
                    {option.window} ·{' '}
                    {option.id === 'standard'
                      ? `offerte dès ${formatPrice(FREE_SHIPPING_FROM)}`
                      : `+${formatPrice(EXPRESS_FEE)} par rapport à la livraison standard`}
                  </span>
                </span>
              </label>
            )
          })}
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-shell px-4 py-3 text-sm text-ink-soft">
          <TruckIcon size={16} className="shrink-0 text-flash" />
          Arrivée estimée :{' '}
          <strong className="font-semibold text-ink">{arrivalWindow}</strong>
        </p>
      </fieldset>
    ) : (
      <div className="space-y-5">
        <fieldset>
          <legend className="label">Moyen de paiement</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => {
              const active = payment === method.id
              return (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition sm:flex-col sm:gap-3 ${
                    active
                      ? 'border-ink bg-shell shadow-card'
                      : 'border-line bg-white hover:border-ink/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={active}
                    onChange={() => setPayment(method.id)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#ff4a17] sm:mt-0"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-sm font-semibold">{method.name}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-ink-mute">
                      {method.hint}
                    </span>
                  </span>
                  <span
                    className={`grid h-8 shrink-0 place-items-center rounded-lg border px-2 ${
                      active ? 'border-ink bg-white text-ink' : 'border-line bg-shell text-ink-soft'
                    }`}
                    aria-hidden
                  >
                    {method.logo}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        <div className="rounded-2xl border border-line bg-shell p-4">
          <p className="label mb-2">Paiement sécurisé</p>
          <p className="text-xs leading-relaxed text-ink-soft">
            <strong className="font-semibold text-ink">
              Aucun numéro de carte n’est saisi sur ce site.
            </strong>{' '}
            En production, cette étape affiche le formulaire du prestataire de paiement (Stripe
            Elements ou champs hébergés PayPal) dans son iframe sécurisé — les numéros de carte
            vont directement au prestataire et ne transitent jamais par ce site ni par nos
            serveurs.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-ink-mute">Montant à payer</span>
            <span className="font-display text-xl font-bold tabular-nums">
              {formatPrice(checkoutTotal)}
            </span>
          </div>
          <div className="mt-2 flex items-baseline justify-between gap-3 text-xs text-ink-mute">
            <span>{selectedDelivery.name}</span>
            <span className="tabular-nums">
              {selectedDelivery.cost === 0 ? 'Offerte' : formatPrice(selectedDelivery.cost)}
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-3 text-xs text-ink-mute">
            <span>Moyen de paiement</span>
            <span className="font-semibold text-ink">{selectedPayment.name}</span>
          </div>
        </div>
      </div>
    )

  /* ----------------------------------------------------------- render --- */
  return (
    <>
      <PageHeader
        crumb="Commande"
        title="Commander"
        lede="Trois étapes courtes : vos coordonnées, la livraison et le paiement. Rien n’est envoyé nulle part — ceci est un prototype."
      />

      <section className="page section">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-10">
          {/* ------------------------------------------------ steps ---- */}
          <div ref={stepRef}>
            <ol className="grid grid-cols-3 gap-2 sm:gap-3" aria-label="Progression de la commande">
              {steps.map((item, index) => {
                const done = index < step
                const active = index === step
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      disabled={index > step}
                      aria-current={active ? 'step' : undefined}
                      aria-label={`Étape ${index + 1} : ${item.label}${
                        active ? ' (étape actuelle)' : ''
                      }`}
                      onClick={() => goTo(index)}
                      className={`flex w-full items-center gap-2 rounded-full border px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-[0.14em] transition ${
                        active
                          ? 'border-ink bg-ink text-white'
                          : done
                            ? 'border-line bg-white text-ink hover:border-ink'
                            : 'border-line bg-white text-ink-mute disabled:cursor-not-allowed disabled:opacity-70'
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] ${
                          active ? 'bg-flash text-white' : 'bg-shell text-ink'
                        }`}
                      >
                        {done ? <CheckIcon size={12} /> : index + 1}
                      </span>
                      <span className="hidden min-w-0 truncate sm:inline">{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ol>

            <div className="card mt-6 p-5 sm:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-display text-lg font-bold tracking-tight">
                  {steps[step].label}
                </h2>
                <p className="text-xs text-ink-mute">Étape {step + 1} sur 3</p>
              </div>
              <div className="divider my-4" />

              {stepBody}

              {infoSummary && step === 0 && (
                <p role="alert" className="mt-4 text-sm font-semibold text-danger">
                  {infoSummary}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
                {step > 0 ? (
                  <button type="button" onClick={() => goTo(step - 1)} className="btn btn-light">
                    <ArrowRight size={16} className="rotate-180" /> Retour
                  </button>
                ) : (
                  <Link to="/cart" className="btn btn-light">
                    <ArrowRight size={16} className="rotate-180" /> Retour au panier
                  </Link>
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={step === 0 ? continueFromInfo : () => goTo(2)}
                    className="btn btn-ink"
                  >
                    Continuer <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={placeOrder}
                    disabled={processing}
                    className="btn btn-flash btn-lg"
                  >
                    {processing ? (
                      <>
                        <BoltIcon size={16} className="animate-pulse" /> Traitement en cours…
                      </>
                    ) : (
                      <>
                        Payer {formatPrice(checkoutTotal)} <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-ink-mute">
              Commande de prototype — aucune commande n’est transmise et aucun paiement n’est
              effectué.
            </p>
          </div>

          {/* ---------------------------------------------- summary ---- */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="card p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="label mb-0">Votre commande</p>
                <span className="badge badge-light">
                  {cartCount} article{cartCount === 1 ? '' : 's'}
                </span>
              </div>

              <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {cartItems.map(({ product, qty }) => (
                  <li key={product.id} className="flex items-center gap-3">
                    <span className="relative shrink-0">
                      <ImageFrame
                        src={product.images[0]}
                        alt={product.imageAlts[0]}
                        aspect="aspect-square"
                        className="h-12 w-12 rounded-lg"
                      />
                      <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                        {qty}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                      {product.name}
                    </span>
                    <span className="text-sm font-bold tabular-nums">
                      {formatPrice(product.price * qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="divider my-4" />

              <dl className="space-y-2 text-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-ink-mute">Sous-total</dt>
                  <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                {discount > 0 && (
                  <div className="flex items-baseline justify-between gap-3 text-signal">
                    <dt>Réduction promo</dt>
                    <dd className="font-semibold tabular-nums">−{formatPrice(discount)}</dd>
                  </div>
                )}
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-ink-mute">Livraison</dt>
                  <dd className="font-semibold">
                    {selectedDelivery.cost === 0 ? 'Offerte' : formatPrice(selectedDelivery.cost)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
                  <dt className="font-display text-base font-bold">Total</dt>
                  <dd className="font-display text-xl font-bold tabular-nums">
                    {formatPrice(checkoutTotal)}
                  </dd>
                </div>
              </dl>
            </div>

            <PromoForm />

            <p className="flex items-center justify-center gap-2 rounded-full border border-line bg-shell px-3 py-2.5 text-xs font-semibold text-ink-soft">
              <ShieldIcon size={14} className="text-signal" /> Paiement sécurisé · commande
              chiffrée
            </p>
          </aside>
        </div>
      </section>

      <Newsletter />
    </>
  )
}

/* ================================================ ORDER CONFIRMATION ==== */

export function OrderConfirmationPage() {
  useDocumentTitle('Commande confirmée | FLASHORA')
  const { lastOrder } = useStore()

  return (
    <>
      <PageHeader
        crumb="Confirmation de commande"
        title="Commande confirmée"
        lede="Merci d’avoir choisi FLASHORA — voici le résumé de votre commande Cyber Monday."
      />

      <section className="page section">
        {!lastOrder ? (
          <EmptyState
            title="Aucune commande récente"
            text="Nous n’avons trouvé aucune commande récente dans ce navigateur. Commencez vos achats pour en passer une."
            cta="Commencer mes achats"
            to="/shop"
          />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {/* ------------------------------------------ success ---- */}
            <div className="card overflow-hidden">
              <div className="border-b border-line bg-gradient-to-b from-signal/10 via-white to-white px-6 py-10 text-center sm:px-10">
                <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-signal/25 bg-signal/10 text-signal">
                  <CheckIcon size={38} />
                </span>
                <p className="eyebrow mt-6 justify-center">
                  <ClockIcon size={13} /> Commande {lastOrder.id}
                </p>
                <p className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Merci d’avoir choisi FLASHORA.
                </p>
                <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-mute">
                  Une confirmation serait envoyée à{' '}
                  <span className="font-semibold text-ink">{lastOrder.email}</span> sur une
                  boutique en production.
                </p>
              </div>

              <dl className="grid gap-5 border-b border-line px-6 py-6 sm:grid-cols-3 sm:px-8">
                <div>
                  <dt className="label">Numéro de commande</dt>
                  <dd className="font-display text-base font-bold tracking-tight">{lastOrder.id}</dd>
                </div>
                <div>
                  <dt className="label">Passée le</dt>
                  <dd className="font-display text-base font-bold tracking-tight">
                    {formatDate(lastOrder.placedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="label">Livraison</dt>
                  <dd className="text-sm font-semibold">{lastOrder.delivery}</dd>
                </div>
              </dl>

              {/* ---------------------------------------- summary ---- */}
              <div className="px-6 py-6 sm:px-8">
                <p className="label">Résumé de la commande</p>

                <ul className="mt-4 divide-y divide-line">
                  {lastOrder.lines.map((line) => (
                    <li key={line.productId} className="flex items-center gap-4 py-3">
                      <ImageFrame
                        src={line.image}
                        alt={line.name}
                        aspect="aspect-square"
                        className="h-14 w-14 shrink-0 rounded-xl"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">{line.name}</span>
                        <span className="block text-xs text-ink-mute">Qté {line.qty}</span>
                      </span>
                      <span className="text-sm font-bold tabular-nums">
                        {formatPrice(line.price * line.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="divider my-4" />

                <dl className="space-y-2 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-ink-mute">Sous-total</dt>
                    <dd className="font-semibold tabular-nums">{formatPrice(lastOrder.subtotal)}</dd>
                  </div>
                  {lastOrder.discount > 0 && (
                    <div className="flex items-baseline justify-between gap-3 text-signal">
                      <dt>Réduction promo{lastOrder.promo ? ` (${lastOrder.promo})` : ''}</dt>
                      <dd className="font-semibold tabular-nums">
                        −{formatPrice(lastOrder.discount)}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-ink-mute">Livraison</dt>
                    <dd className="font-semibold">
                      {lastOrder.shipping === 0 ? 'Offerte' : formatPrice(lastOrder.shipping)}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
                    <dt className="font-display text-base font-bold">Total payé</dt>
                    <dd className="font-display text-xl font-bold tabular-nums">
                      {formatPrice(lastOrder.total)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* ------------------------------------------ actions --- */}
              <div className="border-t border-line bg-shell px-6 py-7 text-center sm:px-8">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link to="/shop" className="btn btn-ink">
                    Continuer mes achats <ArrowRight size={16} />
                  </Link>
                  <Link to="/faq" className="btn btn-light">
                    Que se passe-t-il ensuite
                  </Link>
                  <Link to="/contact" className="btn btn-light">
                    Nous contacter
                  </Link>
                </div>

                <p className="mx-auto mt-5 max-w-xl text-xs leading-relaxed text-ink-mute">
                  Note d’honnêteté : il s’agit d’une commande de prototype. Aucun paiement n’a été
                  traité et aucune donnée n’a été envoyée à un serveur — la commande ci-dessus
                  n’existe que dans votre navigateur pour cette démonstration.
                </p>
              </div>
            </div>

            {/* -------------------------------------------- next up --- */}
            <div className="grid gap-4 sm:grid-cols-3">
              <InfoTile
                icon={<MailIcon size={18} />}
                title="E-mail de confirmation"
                text="Envoyé dès que le paiement est validé sur une boutique en production."
              />
              <InfoTile
                icon={<TruckIcon size={18} />}
                title="Lien de suivi"
                text="Envoyé par e-mail dès que le colis quitte l’entrepôt."
              />
              <InfoTile
                icon={<ReturnIcon size={18} />}
                title="Retours sous 30 jours"
                text="Ce n’est pas le bon article ? Renvoyez-le avec l’étiquette prépayée."
              />
            </div>
          </div>
        )}
      </section>

      <Newsletter />
    </>
  )
}
