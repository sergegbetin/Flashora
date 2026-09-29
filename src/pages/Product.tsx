import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { productBySlug, relatedTo } from '../data/products'
import { productFaqs } from '../data/content'
import { useDocumentTitle } from '../hooks'
import { useStore } from '../store/StoreContext'
import { formatPrice, savings } from '../utils/format'
import { ImageFrame } from '../components/ui/ImageFrame'
import { Countdown } from '../components/ui/Countdown'
import { ProductGrid } from '../components/ui/ProductCard'
import { QuantityStepper, Rating } from '../components/ui/Primitives'
import { Newsletter } from '../components/layout/Footer'
import {
  ArrowRight,
  BagIcon,
  BoltIcon,
  CheckIcon,
  ChevronDown,
  ClockIcon,
  HeartIcon,
  ReturnIcon,
  ShieldIcon,
  TruckIcon,
} from '../components/ui/Icons'

const finishes = [
  { id: 'black', label: 'Noir', dot: '#111114' },
  { id: 'sand', label: 'Sable', dot: '#e5d9c5' },
  { id: 'flash', label: 'Flash', dot: '#ff4a17' },
]

export function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = productBySlug(slug)
  const { addToCart, toggleWishlist, inWishlist } = useStore()

  const [activeImage, setActiveImage] = useState(0)
  const [qty, setQty] = useState(1)
  const [finish, setFinish] = useState('black')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 })

  useDocumentTitle(product ? `${product.name} | FLASHORA Cyber Monday` : 'Produit introuvable | FLASHORA')

  useEffect(() => {
    setActiveImage(0)
    setQty(1)
    window.scrollTo({ top: 0 })
  }, [slug])

  const related = useMemo(() => (product ? relatedTo(product, 4) : []), [product])

  if (!product) {
    return (
      <section className="page section text-center">
        <h1 className="section-title">Produit introuvable</h1>
        <p className="lede mt-3 text-ink-mute">
          Ce produit a peut-être quitté la campagne. Découvrez le reste des offres.
        </p>
        <Link to="/shop" className="btn btn-ink mt-6">
          Retour à la boutique
        </Link>
      </section>
    )
  }

  const wished = inWishlist(product.id)
  const save = savings(product.price, product.oldPrice)

  return (
    <>
      <div className="border-b border-line bg-gradient-to-b from-white to-cream">
        <div className="page py-8 sm:py-10">
          <nav aria-label="Fil d’Ariane" className="eyebrow mb-6 flex flex-wrap gap-2">
            <Link to="/" className="hover:text-ink">
              Accueil
            </Link>
            <span aria-hidden>/</span>
            <Link to="/shop" className="hover:text-ink">
              Boutique
            </Link>
            <span aria-hidden>/</span>
            <Link to={`/category/${product.category}`} className="capitalize hover:text-ink">
              {product.category}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-ink">{product.name}</span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* gallery ---------------------------------------------------- */}
            <div className="flex flex-col gap-4">
              <div
                className="relative overflow-hidden rounded-[28px] border border-line bg-white shadow-card"
                onMouseMove={(event) => {
                  const rect = event.currentTarget.getBoundingClientRect()
                  setZoom({
                    active: true,
                    x: ((event.clientX - rect.left) / rect.width) * 100,
                    y: ((event.clientY - rect.top) / rect.height) * 100,
                  })
                }}
                onMouseLeave={() => setZoom((state) => ({ ...state, active: false }))}
              >
                <ImageFrame
                  src={product.images[activeImage]}
                  alt={product.imageAlts[activeImage]}
                  aspect="aspect-square"
                  eager
                  imgClassName={
                    zoom.active
                      ? 'transition-transform duration-200'
                      : 'transition-transform duration-500'
                  }
                />
                {zoom.active && (
                  <span
                    className="pointer-events-none absolute inset-0 hidden lg:block"
                    style={{
                      backgroundImage: `url(${product.images[activeImage]})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '250%',
                      backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                    }}
                    aria-hidden
                  />
                )}
                {product.badge && (
                  <span className="badge badge-flash absolute left-4 top-4">{product.badge}</span>
                )}
                <span className="absolute bottom-4 right-4 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft shadow-card lg:inline-flex">
                  Survolez pour agrandir
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((image, index) => (
                  <button
                    key={image + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`Afficher l’image ${index + 1} sur ${product.images.length}`}
                    aria-current={activeImage === index}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                      activeImage === index ? 'border-ink' : 'border-transparent hover:border-line'
                    }`}
                  >
                    <ImageFrame
                      src={image}
                      alt={product.imageAlts[index]}
                      aspect="aspect-square"
                      className="h-20 w-20"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* buy panel -------------------------------------------------- */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-2">
                {product.badge && <span className="badge badge-flash">{product.badge}</span>}
                {product.isNew && <span className="badge badge-ink">Nouveauté</span>}
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                  {product.brand} · {product.category}
                </span>
              </div>

              <div>
                <h1 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-[1] tracking-[-0.03em]">
                  {product.name}
                </h1>
                <p className="mt-2 text-ink-mute">{product.tagline}</p>
              </div>

              <Rating value={product.rating} count={product.reviews} size={16} />

              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-4xl font-bold">{formatPrice(product.price)}</span>
                <s className="text-lg text-ink-mute">{formatPrice(product.oldPrice)}</s>
                <span className="badge badge-flash">-{product.discount} %</span>
                <span className="text-sm font-semibold text-signal">
                  Économisez {formatPrice(save)}
                </span>
              </div>

              <p className="text-sm leading-relaxed text-ink-soft">{product.description}</p>

              {/* finishes -------------------------------------------------- */}
              <div>
                <p className="label">Finition</p>
                <div className="flex flex-wrap gap-2">
                  {finishes.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFinish(option.id)}
                      aria-pressed={finish === option.id}
                      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                        finish === option.id
                          ? 'border-ink bg-ink text-white'
                          : 'border-line bg-white text-ink-soft hover:border-ink'
                      }`}
                    >
                      <span
                        className="h-3 w-3 rounded-full ring-1 ring-black/10"
                        style={{ background: option.dot }}
                      />
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-ink-mute">
                  Variantes de démonstration — le stock réel est géré variante par variante.
                </p>
              </div>

              {/* actions --------------------------------------------------- */}
              <div className="flex flex-wrap items-center gap-3">
                <QuantityStepper value={qty} onChange={setQty} max={20} />
                <button
                  type="button"
                  onClick={() => addToCart(product, qty)}
                  disabled={!product.inStock}
                  className="btn btn-ink h-12 flex-1 min-w-[180px]"
                >
                  <BagIcon size={17} /> {product.inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-pressed={wished}
                  aria-label="Ajouter aux favoris"
                  className={`grid h-12 w-12 place-items-center rounded-full border transition ${
                    wished
                      ? 'border-flash bg-flash text-white'
                      : 'border-line bg-white hover:border-ink'
                  }`}
                >
                  <HeartIcon size={19} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart(product, qty)
                  navigate('/checkout')
                }}
                disabled={!product.inStock}
                className="btn btn-flash w-full"
              >
                Acheter maintenant · {formatPrice(product.price * qty)}
              </button>

              <p
                className={`text-xs font-semibold ${
                  product.inStock ? 'text-signal' : 'text-danger'
                }`}
              >
                {product.inStock
                  ? 'En stock · expédié sous 24 heures'
                  : 'Rupture de stock · vous pouvez toutefois l’ajouter à vos favoris'}
              </p>

              {/* assurances ----------------------------------------------- */}
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: <TruckIcon size={18} />,
                    title: 'Livraison',
                    text: 'Livraison estimée : 2 à 5 jours ouvrés',
                  },
                  {
                    icon: <ReturnIcon size={18} />,
                    title: 'Retours',
                    text: 'Retours faciles selon notre politique de retour',
                  },
                  {
                    icon: <ShieldIcon size={18} />,
                    title: 'Paiement',
                    text: 'Paiement sécurisé assuré par un prestataire',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-line bg-white p-4 text-sm"
                  >
                    <span className="mb-2 grid h-9 w-9 place-items-center rounded-xl bg-shell text-ink">
                      {item.icon}
                    </span>
                    <span className="block font-semibold">{item.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-ink-mute">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              {product.discount >= 30 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <ClockIcon size={16} className="text-flash" /> Le prix campagne prend fin dans
                  </span>
                  <Countdown seconds={102132} variant="inline" className="text-lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* details ---------------------------------------------------------- */}
      <section className="page grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <article>
            <h2 className="font-display text-2xl font-bold">Description</h2>
            <p className="lede mt-3 text-ink-soft">{product.description}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2.5 rounded-2xl border border-line bg-white p-4 text-sm"
                >
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-signal" />
                  {feature}
                </li>
              ))}
            </ul>
          </article>

          <article>
            <h2 className="font-display text-2xl font-bold">Caractéristiques techniques</h2>
            <dl className="mt-4 overflow-hidden rounded-2xl border border-line bg-white">
              {product.specs.map((spec, index) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between gap-4 px-5 py-3.5 text-sm ${
                    index > 0 ? 'border-t border-line' : ''
                  }`}
                >
                  <dt className="text-ink-mute">{spec.label}</dt>
                  <dd className="text-right font-semibold">{spec.value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t border-line px-5 py-3.5 text-sm">
                <dt className="text-ink-mute">Ajouté à la campagne</dt>
                <dd className="font-semibold">
                  {new Date(product.addedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </dd>
              </div>
            </dl>
          </article>

          <article>
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-bold">Avis</h2>
              <Rating value={product.rating} count={product.reviews} />
            </div>
            <div className="mt-4 rounded-2xl border border-line bg-white p-5 text-sm text-ink-soft">
              <p className="flex flex-wrap items-center gap-2">
                <span className="badge badge-light">Données de démonstration</span>
                Le contenu des avis est fourni avec le catalogue du prototype — les vrais avis
                arriveront avec le serveur de production.
              </p>
              <div className="mt-4 space-y-3 border-t border-line pt-4">
                <p className="text-sm leading-relaxed">
                  « L’installation a pris quelques minutes et la finition a l’air bien plus chère
                  que le prix. Il est dans mon sac au quotidien depuis. »
                </p>
                <p className="flex items-center gap-2 text-xs text-ink-mute">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-shell text-[10px] font-bold">
                    AK
                  </span>
                  Alex K. · <span className="text-amber">★★★★★</span> · Achat vérifié
                </p>
              </div>
            </div>
          </article>

          <article>
            <h2 className="font-display text-2xl font-bold">FAQ</h2>
            <div className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
              {productFaqs.map((faq, index) => (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold"
                  >
                    {faq.q}
                    <ChevronDown
                      size={17}
                      className={`shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <p className="px-5 pb-4 text-sm leading-relaxed text-ink-mute fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-5">
          <div className="rounded-card border border-line bg-white p-6">
            <p className="label">Pourquoi acheter ici</p>
            <ul className="mt-3 space-y-3 text-sm text-ink-soft">
              <li className="flex items-start gap-2.5">
                <ShieldIcon size={17} className="mt-0.5 shrink-0 text-flash" /> Paiement sécurisé
                via un prestataire — aucune donnée bancaire n’est stockée ici
              </li>
              <li className="flex items-start gap-2.5">
                <TruckIcon size={17} className="mt-0.5 shrink-0 text-flash" /> Livraison standard
                offerte dès 79 €
              </li>
              <li className="flex items-start gap-2.5">
                <ReturnIcon size={17} className="mt-0.5 shrink-0 text-flash" /> Retours sous
                30 jours avec étiquette prépayée
              </li>
              <li className="flex items-start gap-2.5">
                <BoltIcon size={17} className="mt-0.5 shrink-0 text-flash" /> Prix Cyber Monday
                garanti tant que le compte à rebours tourne
              </li>
            </ul>
          </div>

          <div className="rounded-card border border-line bg-gradient-to-br from-ink to-[#1c1c20] p-6 text-white">
            <p className="eyebrow text-white/50">Besoin d’aide ?</p>
            <p className="mt-2 font-display text-xl font-bold">Parlez à notre équipe</p>
            <p className="mt-1 text-sm text-white/70">
              Questions sur le produit, tailles ou délais de livraison — nous répondons sous un
              jour.
            </p>
            <Link to="/contact" className="btn btn-flash mt-4 w-full">
              Nous contacter <ArrowRight size={16} />
            </Link>
          </div>
        </aside>
      </section>

      {/* related ---------------------------------------------------------- */}
      <section className="border-t border-line bg-shell">
        <div className="page section">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-3">Continuez à explorer</p>
              <h2 className="section-title">Vous aimerez aussi</h2>
            </div>
            <Link to="/shop" className="btn btn-light">
              Tous les produits <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid items={related} />
        </div>
      </section>

      {/* sticky mobile CTA ------------------------------------------------ */}
      <div className="sticky bottom-0 z-30 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{product.name}</p>
            <p className="font-display text-lg font-bold leading-none">{formatPrice(product.price)}</p>
          </div>
          <button
            type="button"
            onClick={() => addToCart(product, qty)}
            disabled={!product.inStock}
            className="btn btn-ink shrink-0 px-6"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      <Newsletter />
    </>
  )
}
