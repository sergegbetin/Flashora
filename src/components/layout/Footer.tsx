import { Link } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { Logo } from '../ui/Logo'
import { categories } from '../../data/categories'
import { ArrowRight, BoltIcon, MailIcon } from '../ui/Icons'
import { newsletter } from '../../data/content'
import { useState } from 'react'

const columns = [
  {
    title: 'Boutique',
    links: [
      { label: 'Tous les produits', to: '/shop' },
      { label: 'Soldes', to: '/shop?sort=discount' },
      { label: 'Tendances', to: '/shop?sort=popular' },
      { label: 'Nouveautés', to: '/shop?sort=newest' },
    ],
  },
  {
    title: 'Service client',
    links: [
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
      { label: 'Livraison', to: '/shipping' },
      { label: 'Retours', to: '/returns' },
    ],
  },
  {
    title: 'Mentions légales',
    links: [
      { label: 'Confidentialité', to: '/privacy' },
      { label: 'Conditions', to: '/terms' },
      { label: 'Cookies', to: '/privacy#cookies' },
    ],
  },
]

const social = ['Instagram', 'TikTok', 'YouTube', 'Pinterest']

export function Newsletter() {
  const { notify } = useStore()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  return (
    <section className="page section" aria-labelledby="newsletter-title">
      <div className="card overflow-hidden p-8 sm:p-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">Newsletter</p>
            <h2 id="newsletter-title" className="section-title">
              {newsletter.title}
            </h2>
            <p className="lede mt-3 text-ink-mute">{newsletter.text}</p>
          </div>

          <form
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
              if (!valid) {
                notify({ title: 'Vérifiez cette adresse e-mail', tone: 'error' })
                return
              }
              setDone(true)
              notify({ title: 'Vous êtes sur la liste ✓', message: email, tone: 'success' })
              setEmail('')
            }}
            className="w-full"
          >
            {done ? (
              <p className="rounded-2xl border border-signal/30 bg-signal/5 p-4 text-sm font-semibold text-signal">
                Merci — les informations d’accès anticipé arriveront dans votre boîte mail.
              </p>
            ) : (
              <>
                <label className="label" htmlFor="newsletter-email">
                  Adresse e-mail
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder={newsletter.placeholder}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="input flex-1"
                    aria-describedby="newsletter-help"
                  />
                  <button type="submit" className="btn btn-ink shrink-0">
                    {newsletter.cta} <ArrowRight size={16} />
                  </button>
                </div>
                <p id="newsletter-help" className="mt-2 text-xs text-ink-mute">
                  Formulaire de démonstration — rien n’est envoyé ni conservé au-delà de ce
                  prototype.
                </p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { notify } = useStore()

  return (
    <footer className="mt-6 border-t border-line bg-shell">
      <div className="page grid gap-10 py-14 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Logo size="md" />
          <p className="mt-3 font-display text-lg font-semibold">De grosses affaires. Des choix malins.</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-mute">
            FLASHORA est un prototype de boutique Cyber Monday : un parcours d’achat complet, prêt à
            être relié aux stocks, aux prix et aux paiements réels.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {social.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() =>
                  notify({
                    title: `Canal ${name}`,
                    message: 'Les liens sociaux s’ouvriront lorsque le compte de la marque sera en ligne.',
                    tone: 'info',
                  })
                }
                className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink-soft transition hover:border-ink hover:text-ink"
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <nav aria-label="Boutique">
          <p className="label">Boutique</p>
          <ul className="space-y-2 text-sm">
            {columns[0].links.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className="text-ink-soft transition hover:text-flash">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="label mt-6">Catégories</p>
          <ul className="space-y-2 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/category/${category.id}`}
                  className="text-ink-soft transition hover:text-flash"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {columns.slice(1).map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <p className="label">{column.title}</p>
            <ul className="space-y-2 text-sm">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-ink-soft transition hover:text-flash">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line/70">
        <div className="page flex flex-col gap-4 py-6 text-xs text-ink-mute md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <BoltIcon size={14} className="text-flash" /> © {new Date().getFullYear()} FLASHORA —
            boutique prototype. Tous les produits, prix, stocks et avis affichés sont des données de
            démonstration.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {['Visa', 'Mastercard', 'PayPal', 'Apple Pay', 'Google Pay'].map((method) => (
              <span
                key={method}
                className="rounded-md border border-line bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-ink-soft"
              >
                {method}
              </span>
            ))}
          </div>

          <a
            href="mailto:hello@flashora.example"
            className="inline-flex items-center gap-1.5 transition hover:text-ink"
          >
            <MailIcon size={14} /> hello@flashora.example
          </a>
        </div>
      </div>
    </footer>
  )
}
