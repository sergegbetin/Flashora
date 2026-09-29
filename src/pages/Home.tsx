import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import { dealOfTheHour, flashDeals, newArrivals, trending } from '../data/products'
import { giftCollections, testimonials, trustItems } from '../data/content'
import { useDocumentTitle } from '../hooks'
import { formatPrice } from '../utils/format'
import { ProductGrid } from '../components/ui/ProductCard'
import { Countdown } from '../components/ui/Countdown'
import { ImageFrame } from '../components/ui/ImageFrame'
import { Price, Rating, SectionHeading } from '../components/ui/Primitives'
import { Newsletter } from '../components/layout/Footer'
import {
  ArrowRight,
  BoltIcon,
  ChatIcon,
  ClockIcon,
  HeartIcon,
  PackageIcon,
  ReturnIcon,
  ShieldIcon,
  StarIcon,
  TruckIcon,
} from '../components/ui/Icons'

const trustIcons = {
  shield: ShieldIcon,
  truck: TruckIcon,
  return: ReturnIcon,
  chat: ChatIcon,
}

/* =========================================================== HERO ======= */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-white via-cream to-shell">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-flash/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-40 h-[360px] w-[360px] rounded-full bg-amber/25 blur-3xl"
        aria-hidden
      />
      <div className="grain pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="page grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
        <div className="fade-up">
          <p className="eyebrow">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-flash" />
            FLASHORA Cyber Monday
          </p>

          <h1 className="mt-5 font-display text-[clamp(2.5rem,7vw,5.25rem)] font-bold uppercase leading-[0.92] tracking-[-0.04em]">
            Le Cyber Monday <br />
            n’a jamais été <span className="text-flash">aussi gros.</span>
          </h1>

          <p className="lede mt-5 max-w-lg text-ink-soft">
            Des offres à durée limitée sur la tech, le lifestyle et les essentiels du quotidien.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 font-display text-lg font-bold uppercase tracking-tight text-white sm:text-xl">
              <BoltIcon size={18} className="text-amber" />
              Jusqu’à -70 %
            </span>
            <span className="text-sm text-ink-mute">
              Tarifs à durée limitée
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop?sort=discount" className="btn btn-ink btn-lg">
              Voir les soldes cyber <ArrowRight size={18} />
            </Link>
            <Link to="/shop" className="btn btn-light btn-lg">
              Découvrir les collections
            </Link>
          </div>

          <div className="mt-10">
            <p className="label">Fin de la campagne dans</p>
            <Countdown seconds={102132} variant="hero" />
            <p className="mt-3 text-xs text-ink-mute">
              Minuteur illustratif pour ce prototype — les dates réelles de fin de campagne seraient
              publiées ici et sur chaque page de bon plan.
            </p>
          </div>
        </div>

        {/* editorial product composition --------------------------------- */}
        <div className="relative mx-auto w-full max-w-xl fade-up" style={{ animationDelay: '120ms' }}>
          <div className="relative aspect-[4/5] sm:aspect-[5/5]">
            <div
              className="absolute right-[6%] top-[4%] h-24 w-24 rounded-full border-2 border-ink/15 sm:h-32 sm:w-32"
              aria-hidden
            />
            <div
              className="absolute left-0 top-[10%] h-16 w-16 rotate-12 rounded-2xl bg-gradient-to-br from-flash to-amber shadow-flash sm:h-20 sm:w-20"
              aria-hidden
            />
            <div
              className="absolute bottom-[18%] left-[2%] h-14 w-14 rounded-full bg-ink/90"
              aria-hidden
            />

            <div className="absolute left-0 top-[6%] w-[58%] overflow-hidden rounded-[28px] border border-white/70 shadow-pop">
              <ImageFrame
                src="images/product-headphones-sonic.jpg"
                alt="Casque à coussinets Sonic Pro sur un fond de studio blanc"
                aspect="aspect-[3/4]"
                eager
              />
            </div>

            <div className="absolute right-0 top-0 w-[38%] overflow-hidden rounded-[22px] border border-white/70 shadow-card">
              <ImageFrame
                src="images/product-earbuds-airtune.jpg"
                alt="Écouteurs sans fil AirTune Pro sur un fond jaune"
                aspect="aspect-square"
                eager
              />
            </div>

            <div className="absolute bottom-[8%] right-[2%] w-[52%] overflow-hidden rounded-[24px] border border-white/70 shadow-card">
              <ImageFrame
                src="images/product-keyboard-velocity.jpg"
                alt="Clavier mécanique Velocity aux switchs apparents"
                aspect="aspect-[4/3]"
              />
            </div>

            <div className="absolute bottom-[6%] left-[6%] w-[40%] overflow-hidden rounded-[20px] border border-white/70 shadow-card">
              <ImageFrame
                src="images/product-watch-pulse.jpg"
                alt="Montre connectée Pulse Fit portée au poignet"
                aspect="aspect-square"
              />
            </div>

            <div className="absolute left-[46%] top-[46%] flex -translate-x-1/2 flex-col items-center rounded-2xl border border-line bg-white/95 px-4 py-3 shadow-pop backdrop-blur">
              <span className="font-display text-xl font-bold leading-none text-flash">-70 %</span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                Bon plan à la une
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-mute">
            <span className="chip">Téléphones</span>
            <span className="chip">Audio</span>
            <span className="chip">Objets connectés</span>
            <span className="chip">Gaming</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ====================================================== TRUST BAR ======= */
function TrustBar() {
  return (
    <section className="border-b border-line bg-white" aria-label="Pourquoi acheter chez FLASHORA">
      <div className="page grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = trustIcons[item.icon as keyof typeof trustIcons]
          return (
            <div key={item.title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-shell text-ink">
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-semibold leading-tight">{item.title}</span>
                <span className="block text-xs text-ink-mute">{item.detail}</span>
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ==================================================== TRENDING ========== */
function TrendingSection() {
  return (
    <section className="page section" aria-labelledby="trending-title">
      <div id="trending-title">
        <SectionHeading
          eyebrow="Tendances du moment"
          title="Ce que tout le monde achète"
          text="Les produits qui suscitent le plus d’intérêt en ce moment."
          action={{ label: 'Voir tous les produits', to: '/shop' }}
        />
      </div>
      <ProductGrid items={trending} />
    </section>
  )
}

/* ============================================== DEAL OF THE HOUR ======== */
function DealOfTheHour() {
  const product = dealOfTheHour

  return (
    <section className="relative overflow-hidden bg-ink text-white" aria-labelledby="deal-title">
      <div
        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-flash/30 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-amber/25 blur-3xl"
        aria-hidden
      />

      <div className="page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1 fade-up">
          <div className="overflow-hidden rounded-[32px] border border-white/10 shadow-pop">
            <ImageFrame
              src={product.images[0]}
              alt={product.imageAlts[0]}
              aspect="aspect-[4/3]"
              className="bg-white"
              imgClassName="transition-transform duration-700 hover:scale-105"
            />
          </div>
          <span className="absolute -bottom-4 left-6 rounded-2xl bg-flash px-4 py-2 font-display text-sm font-bold uppercase tracking-wide shadow-flash">
            Le bon plan de l’heure
          </span>
        </div>

        <div className="order-1 lg:order-2 fade-up" style={{ animationDelay: '80ms' }}>
          <p className="eyebrow text-white/60">Prix de campagne à durée limitée</p>
          <h2 id="deal-title" className="mt-4 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-[0.95]">
            Sonic Pro <br />
            Headphones
          </h2>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <span className="font-display text-5xl font-bold text-amber">-45 %</span>
            <span className="text-2xl text-white/40 line-through">{formatPrice(product.oldPrice)}</span>
            <span className="font-display text-4xl font-bold">{formatPrice(product.price)}</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
            <Rating value={product.rating} count={product.reviews} className="text-white" />
            <span className="inline-flex items-center gap-1.5 text-signal-bright">
              <span className="h-2 w-2 rounded-full bg-signal-bright" /> En stock
            </span>
          </div>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Réduction de bruit adaptative, haut-parleurs de 40 mm et 45 heures d’autonomie —
            l’offre phare de la campagne FLASHORA Cyber Monday.
          </p>

          <div className="mt-7">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
              L’offre se termine dans
            </p>
            <Countdown seconds={3540} variant="hero" />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={`/product/${product.slug}`} className="btn btn-flash btn-lg">
              Profiter de l’offre <ArrowRight size={18} />
            </Link>
            <Link
              to="/shop?sort=discount"
              className="btn btn-lg border border-white/25 bg-transparent text-white hover:bg-white hover:text-ink"
            >
              Tous les soldes cyber
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================ SHOP BY CATEGORY ====== */
function CategorySection() {
  return (
    <section className="page section" aria-labelledby="categories-title">
      <div id="categories-title">
        <SectionHeading
          eyebrow="Parcourir"
          title="Faites vos affaires à votre façon"
          text="Cinq collections, une campagne — allez directement à ce que vous cherchez."
        />
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-6">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className={`group relative overflow-hidden rounded-card border border-line shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop ${
              index < 2 ? 'lg:col-span-3' : 'lg:col-span-2'
            }`}
          >
            <ImageFrame
              src={category.image}
              alt={category.imageAlt}
              aspect={index < 2 ? 'aspect-[16/10]' : 'aspect-[16/11]'}
              imgClassName="transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 text-white">
              <div>
                <h3 className="font-display text-2xl font-bold uppercase leading-none">
                  {category.name}
                </h3>
                <p className="mt-1.5 text-xs text-white/75">{category.tagline}</p>
              </div>
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={18} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ================================================== FLASH DEALS ========= */
function FlashDeals() {
  return (
    <section className="border-y border-line bg-shell" aria-labelledby="flash-title">
      <div className="page section">
        <div id="flash-title">
          <SectionHeading
            eyebrow="Ça part vite"
            title="Bons plans flash"
            text="Une sélection renouvelée des meilleurs prix de la campagne."
            action={{ label: 'Voir tous les bons plans', to: '/shop?sort=discount' }}
          />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
          <ClockIcon size={16} className="text-flash" />
          <span className="text-sm font-semibold">Minuteur de la campagne</span>
          <Countdown seconds={102132} variant="inline" className="text-lg" />
          <span className="text-xs text-ink-mute">
            Les prix affichés sont ceux de la campagne de démonstration — aucune annonce de stock
            liée au compte à rebours.
          </span>
        </div>

        <div className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0">
          {flashDeals.map((product, index) => (
            <article
              key={product.id}
              className="group w-[260px] shrink-0 snap-start overflow-hidden rounded-card border border-line bg-white shadow-card transition hover:-translate-y-1 hover:shadow-pop sm:w-[300px]"
            >
              <Link to={`/product/${product.slug}`} className="block">
                <ImageFrame
                  src={product.images[0]}
                  alt={product.imageAlts[0]}
                  aspect="aspect-[4/3]"
                  imgClassName="transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="flex flex-col gap-2 p-4">
                <div className="flex items-center justify-between">
                  <span className="badge badge-flash">{product.badge}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-mute">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold leading-snug">
                  <Link to={`/product/${product.slug}`} className="hover:text-flash">
                    {product.name}
                  </Link>
                </h3>
                <Price price={product.price} oldPrice={product.oldPrice} />
                <Link
                  to={`/product/${product.slug}`}
                  className="btn btn-ink mt-1 h-10 px-4 text-xs"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  Profiter de ce bon plan
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================== GIFT GUIDE ========== */
function GiftGuide() {
  return (
    <section id="gift-guide" className="page section" aria-labelledby="gift-title">
      <div id="gift-title">
        <SectionHeading
          eyebrow="Édito"
          title="Des cadeaux qui feront vraiment plaisir"
          text="Quatre collections sélectionnées, choisies comme un ami les choisirait."
          action={{ label: 'Ouvrir la boutique cadeaux', to: '/shop?category=lifestyle' }}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {giftCollections.map((collection, index) => (
          <Link
            key={collection.id}
            to={collection.to}
            className="group relative overflow-hidden rounded-[28px] border border-line shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-pop"
          >
            <ImageFrame
              src={collection.image}
              alt={collection.alt}
              aspect={index % 2 === 0 ? 'aspect-[16/10]' : 'aspect-[16/10]'}
              imgClassName="transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/85 via-ink/35 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-white">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur">
                Collection {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold uppercase leading-none">
                  {collection.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-white/80">{collection.subtitle}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-amber">
                  Découvrir <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ==================================================== BANNER =========== */
function CampaignBanner() {
  return (
    <section className="page pb-6" aria-labelledby="banner-title">
      <div className="relative overflow-hidden rounded-[32px] border border-line bg-ink text-white">
        <ImageFrame
          src="images/editorial-shopping.jpg"
          alt="Sacs de shopping rouges avec une affiche « soldes »"
          aspect="aspect-[16/9] sm:aspect-[21/9]"
          className="absolute inset-0 h-full w-full opacity-45"
          imgClassName="object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />

        <div className="relative flex min-h-[320px] flex-col justify-center gap-6 p-8 sm:p-14 lg:max-w-2xl">
          <p className="eyebrow text-white/60">FLASHORA Cyber Monday</p>
          <h2
            id="banner-title"
            className="font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold uppercase leading-[0.95]"
          >
            Votre prochaine coup de cœur vous attend.
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/75 sm:text-base">
            Découvrez des produits que vous aurez envie d’ajouter à votre panier.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-flash btn-lg">
              Découvrir FLASHORA <ArrowRight size={18} />
            </Link>
            <Link
              to="/wishlist"
              className="btn btn-lg border border-white/30 bg-transparent text-white hover:bg-white hover:text-ink"
            >
              Voir mes favoris
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ================================================= SOCIAL PROOF ======== */
function SocialProof() {
  return (
    <section className="page section" aria-labelledby="proof-title">
      <div id="proof-title">
        <SectionHeading
          eyebrow="Avis clients"
          title="Adopté par nos clients"
          text="Avis d’exemple inclus avec le prototype — clairement signalés comme données de démonstration."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_2fr]">
        <div className="card flex flex-col items-start justify-center gap-3 p-7">
          <div className="flex items-end gap-3">
            <span className="font-display text-6xl font-bold leading-none">4.7</span>
            <span className="pb-2 text-sm text-ink-mute">/ 5 de moyenne</span>
          </div>
          <span className="flex gap-1 text-amber">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon key={star} size={22} />
            ))}
          </span>
          <p className="text-sm text-ink-mute">
            D’après le jeu d’avis d’exemple inclus dans ce catalogue de démonstration.
          </p>
          <span className="badge badge-light">Données de démonstration</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((review) => (
            <figure key={review.id} className="card flex h-full flex-col gap-3 p-6">
              <Rating value={review.rating} size={14} />
              <blockquote className="text-sm leading-relaxed text-ink-soft">
                “{review.text}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-flash to-amber text-xs font-bold text-white">
                  {review.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold">{review.name}</span>
                  <span className="block text-xs text-ink-mute">{review.product}</span>
                </span>
                <span className="badge badge-light ml-auto">Avis de démonstration</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ============================================ MOBILE SHOPPING ========== */
function MobileSection() {
  return (
    <section className="border-y border-line bg-shell" aria-labelledby="mobile-title">
      <div className="page grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-2">
        <div className="fade-up">
          <p className="eyebrow">En mobilité</p>
          <h2 id="mobile-title" className="section-title mt-4">
            Achetez où que vous soyez.
          </h2>
          <p className="lede mt-4 max-w-md text-ink-mute">
            Vos bons plans préférés, toujours à portée de main.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-soft">
            <li className="flex items-center gap-3">
              <PackageIcon size={17} className="text-flash" /> Panier et favoris synchronisés sur cet appareil
            </li>
            <li className="flex items-center gap-3">
              <HeartIcon size={17} className="text-flash" /> Commande en une seule main
            </li>
            <li className="flex items-center gap-3">
              <BoltIcon size={17} className="text-flash" /> Filtres dans un panneau coulissant
            </li>
          </ul>
          <Link to="/shop" className="btn btn-ink btn-lg mt-8">
            Commencer mes achats <ArrowRight size={18} />
          </Link>
        </div>

        <div className="relative mx-auto w-full max-w-md fade-up" style={{ animationDelay: '100ms' }}>
          <div
            className="absolute -right-6 -top-6 h-40 w-40 rounded-full bg-flash/20 blur-2xl"
            aria-hidden
          />
          <div className="overflow-hidden rounded-[36px] border border-line shadow-pop">
            <ImageFrame
              src="images/mobile-mockup.jpg"
              alt="Smartphone affichant la boutique mobile FLASHORA"
              aspect="aspect-[4/3]"
            />
          </div>
          <div className="absolute -bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-card">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-white">
              <BoltIcon size={16} />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-[0.14em]">Mobile d’abord</span>
              <span className="block text-xs text-ink-mute">Dès 390 px, testé</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ==================================================== NEW ARRIVALS ===== */
function NewArrivals() {
  return (
    <section className="page section pt-14 sm:pt-16" aria-labelledby="new-title">
      <div id="new-title">
        <SectionHeading
          eyebrow="Fraîchement arrivés"
          title="Nouveautés"
          text="De nouveaux produits ajoutés à la campagne cette semaine."
          action={{ label: 'Voir les nouveautés', to: '/shop?sort=newest' }}
        />
      </div>
      <ProductGrid items={newArrivals} />
    </section>
  )
}

/* ====================================================== PAGE =========== */
export function HomePage() {
  useDocumentTitle('FLASHORA — Soldes du Cyber Monday | Tech, Lifestyle et plus encore')

  return (
    <>
      <Hero />
      <TrustBar />
      <TrendingSection />
      <DealOfTheHour />
      <CategorySection />
      <FlashDeals />
      <GiftGuide />
      <CampaignBanner />
      <SocialProof />
      <NewArrivals />
      <MobileSection />
      <Newsletter />
    </>
  )
}
