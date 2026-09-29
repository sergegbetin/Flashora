import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks'
import { FREE_SHIPPING_FROM, useStore } from '../store/StoreContext'
import { returnFacts, shippingFacts, storeFaqs } from '../data/content'
import { categories } from '../data/categories'
import { ImageFrame } from '../components/ui/ImageFrame'
import { InfoTile, SectionHeading } from '../components/ui/Primitives'
import {
  ArrowRight,
  BoltIcon,
  CardIcon,
  ChatIcon,
  CheckIcon,
  ChevronDown,
  ClockIcon,
  MailIcon,
  PackageIcon,
  ReturnIcon,
  SearchIcon,
  TruckIcon,
} from '../components/ui/Icons'

/* ==========================================================================
   Shared page furniture
   ========================================================================== */

function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Fil d’Ariane">
      <ol className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-mute">
        <li>
          <Link to="/" className="transition hover:text-flash">
            Accueil
          </Link>
        </li>
        <li aria-hidden="true" className="text-ink-mute/50">
          /
        </li>
        <li aria-current="page" className="text-ink">
          {current}
        </li>
      </ol>
    </nav>
  )
}

/** Breadcrumb + h1 + intro band every information page opens with. */
function PageHeader({
  page,
  eyebrow,
  title,
  intro,
  aside,
}: {
  page: string
  eyebrow: string
  title: ReactNode
  intro: string
  aside?: ReactNode
}) {
  return (
    <section className="border-b border-line bg-shell">
      <div className="page section pb-10 sm:pb-12">
        <Breadcrumb current={page} />
        <p className="eyebrow mt-7">{eyebrow}</p>
        <h1 className="section-title mt-3 max-w-3xl text-balance">{title}</h1>
        <p className="lede mt-4 max-w-2xl text-ink-soft">{intro}</p>
        {aside && <div className="mt-6 flex flex-wrap items-center gap-2">{aside}</div>}
      </div>
    </section>
  )
}

/** Closing "talk to us" panel reused by the help-centre pages. */
function HelpCta({
  eyebrow,
  title,
  text,
  primary,
  notes,
}: {
  eyebrow: string
  title: string
  text: string
  primary: { label: string; to: string }
  notes: { icon: ReactNode; label: string }[]
}) {
  return (
    <div className="card overflow-hidden">
      <div className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[1.5fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase leading-tight">{title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">{text}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={primary.to} className="btn btn-ink">
              {primary.label} <ArrowRight size={16} />
            </Link>
            <Link to="/faq" className="btn btn-light">
              Consulter la FAQ
            </Link>
          </div>
        </div>
        <ul className="space-y-3 rounded-2xl border border-line bg-shell p-5 text-sm text-ink-soft">
          {notes.map((note) => (
            <li key={note.label} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-ink">
                {note.icon}
              </span>
              {note.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ==========================================================================
   About
   ========================================================================== */

const aboutValues = [
  {
    icon: <CardIcon size={18} />,
    title: 'Tarifs transparents',
    text: 'Chaque prix s’affiche à côté de son prix précédent et de la remise réelle. Pas de prix « avant » gonflés, ni de frais qui n’apparaissent qu’à l’écran final.',
  },
  {
    icon: <SearchIcon size={18} />,
    title: 'Une information claire',
    text: 'Les états de stock, les délais de livraison et les règles de retour sont écrits en langage clair, et placés sur la page où la décision se prend vraiment.',
  },
  {
    icon: <BoltIcon size={18} className="text-flash" />,
    title: 'L’honnêteté d’abord',
    text: 'Cette version est un prototype : les données de démonstration sont signalées comme telles, au lieu d’être déguisées en commerce en direct.',
  },
]

export function AboutPage() {
  useDocumentTitle('À propos | FLASHORA')

  return (
    <>
      <PageHeader
        page="À propos"
        eyebrow="À propos de FLASHORA"
        title={
          <>
            Bonnes affaires. <span className="text-flash">Choix malins.</span>
          </>
        }
        intro="FLASHORA est une boutique Cyber Monday construite sur une idée simple : les offres à durée limitée doivent être plus faciles à comprendre, non plus difficiles à croire."
        aside={
          <>
            <span className="badge badge-ink">FLASHORA CYBER MONDAY</span>
            <span className="badge badge-light">Boutique prototype</span>
            <span className="badge badge-amber">Données de démonstration</span>
          </>
        }
      />

      {/* ------------------------------------------------------- story --- */}
      <section className="page section" aria-labelledby="about-story">
        <div id="about-story">
          <SectionHeading
            eyebrow="Notre histoire"
            title="La saison des soldes, sans le bruit"
            text="Pourquoi FLASHORA existe, et ce que la campagne Cyber Monday cherche à démontrer."
          />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              La saison des soldes a tendance à crier : des comptes à rebours sur chaque vignette,
              des compteurs de stock qui ne bougent jamais, et un prix barré qui n’a jamais été le
              vrai prix. FLASHORA est né parce que comparer quoi que ce soit dans cet environnement
              épuise — et parce que l’offre la plus bruyante est rarement le meilleur choix.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              La réponse que nous avons conçue est simple. La campagne{' '}
              <strong className="font-semibold text-ink">FLASHORA CYBER MONDAY</strong> rassemble
              en un seul endroit les offres à durée limitée de tech, gaming, audio, maison,
              lifestyle et idées cadeaux, avec les faits attachés : le prix, le prix avant, la
              disponibilité réelle et la durée de l’offre. Vous profitez de l’énergie d’une campagne
              sans les artifices qui l’accompagnent d’ordinaire.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              Notre signature —{' '}
              <em className="font-semibold not-italic text-ink">Bonnes affaires. Choix malins.</em>{' '}
              — est la règle que nous appliquons à chaque écran. Une offre ne mérite d’être
              annoncée que si le choix sur lequel elle repose est judicieux, et une information doit
              résister au second regard.
            </p>

            <p className="label mt-7">Explorez les collections</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link key={category.id} to={`/category/${category.id}`} className="chip">
                  {category.name}
                </Link>
              ))}
              <Link to="/shop?category=lifestyle" className="chip">
                Idées cadeaux
              </Link>
            </div>
          </div>

          {/* editorial image block */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="overflow-hidden rounded-[28px] border border-line shadow-card">
              <ImageFrame
                src="images/editorial-flatlay.jpg"
                alt="Vue à plat d’un casque, d’un clavier et de petits accessoires tech disposés sur une surface claire"
                aspect="aspect-[4/3]"
              />
            </div>
            <div className="ml-auto mt-4 w-[78%] overflow-hidden rounded-[24px] border border-line shadow-card">
              <ImageFrame
                src="images/category-lifestyle.jpg"
                alt="Bracelets à perles empilés portés au poignet, issus de la collection lifestyle"
                aspect="aspect-[4/3]"
              />
            </div>
            <span className="absolute -left-2 top-[42%] rotate-[-4deg] rounded-2xl border border-line bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] shadow-card">
              Bonnes affaires. Choix malins.
            </span>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------- values --- */}
      <section className="border-y border-line bg-shell" aria-labelledby="about-values">
        <div className="page section">
          <div id="about-values">
            <SectionHeading
              eyebrow="Nos engagements"
              title="Trois promesses qui guident notre design"
              text="Si un écran enfreint l’une d’elles, il n’est pas livré."
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {aboutValues.map((value, index) => (
              <article key={value.title} className="card p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-shell text-ink">
                    {value.icon}
                  </span>
                  <span className="font-display text-3xl font-bold leading-none text-ink/45">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold uppercase leading-none">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{value.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- prototype --- */}
      <section className="page section" aria-labelledby="about-prototype">
        <div className="card overflow-hidden">
          <div className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <span className="badge badge-amber">Avis prototype</span>
              <h2
                id="about-prototype"
                className="mt-4 font-display text-2xl font-bold uppercase leading-tight"
              >
                Cette boutique est un prototype front-end
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                FLASHORA démontre un parcours d’achat complet : navigation, filtres, fiches
                produit, panier, paiement et écrans post-achat. Le catalogue, les prix, les remises,
                les états de stock, les avis et les compteurs à rebours sont des données de
                démonstration, les formulaires de contact et de newsletter n’envoient aucun e-mail,
                et le paiement ne débite rien et ne passe aucune commande réelle. Rien de ce que
                vous faites ici n’est envoyé sur un serveur — tout reste dans votre navigateur.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink-mute">
                Vous voulez le détail ? La politique de confidentialité liste chaque clé de
                stockage local utilisée par ce prototype.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/faq" className="btn btn-ink w-full">
                Lire la FAQ <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn btn-light w-full">
                Contacter l’équipe
              </Link>
              <Link
                to="/privacy"
                className="text-center text-xs font-semibold text-ink-mute underline underline-offset-4 transition hover:text-flash"
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   FAQ
   ========================================================================== */

const deliveryFaqs = [
  {
    q: 'Comment suivre ma commande ?',
    a: 'Chaque envoi suivi reçoit un lien par e-mail dès que le colis quitte l’entrepôt, et le transporteur affiche chaque étape au fil du parcours. Dans ce prototype, aucun e-mail n’est réellement envoyé — la page Livraison décrit le parcours qu’une boutique en production suivrait.',
  },
  {
    q: 'Puis-je modifier mon adresse de livraison après la commande ?',
    a: 'Dans une boutique en production, l’adresse reste modifiable jusqu’à l’expédition ; ensuite, le transporteur gère la redirection moyennant des frais. Ici, les informations de paiement ne sont conservées que dans ce navigateur : modifiez-les simplement et repassez commande.',
  },
  {
    q: 'Livrez-vous à l’international ?',
    a: 'Cette démonstration présente un seul marché de livraison avec deux services : standard (3 à 5 jours ouvrés) et express (1 à 2 jours ouvrés). Un tunnel de commande en production listerait les destinations disponibles, les délais estimés et les éventuels droits de douane avant votre règlement.',
  },
  {
    q: 'Que se passe-t-il si je ne suis pas là à la livraison ?',
    a: 'Les livraisons suivies exigent une signature ou un retrait en point relais. Le transporteur laisse un avis avec la prochaine tentative ou le lieu de retrait, et la page de suivi affiche toujours l’état actuel du colis.',
  },
  {
    q: 'Vais-je recevoir une confirmation de commande ?',
    a: 'Une commande en production est confirmée par e-mail avec les articles, le mode de livraison et le total. Le tunnel de commande de démonstration enregistre un résumé local sur votre appareil (flashora.lastOrder) et l’affiche sur l’écran de confirmation — aucun e-mail ne quitte ce prototype.',
  },
]

export function FaqPage() {
  useDocumentTitle('FAQ | FLASHORA')
  const [openFaq, setOpenFaq] = useState<string | null>('store-0')

  const groups = [
    {
      id: 'store',
      title: 'Achats et paiements',
      note: 'Prix, stock, comptes et moyens de paiement.',
      items: storeFaqs,
    },
    {
      id: 'delivery',
      title: 'Commandes et livraison',
      note: 'Suivi, adresses, confirmations et tentatives de livraison.',
      items: deliveryFaqs,
    },
  ]

  return (
    <>
      <PageHeader
        page="FAQ"
        eyebrow="Centre d’aide"
        title="Des réponses, sans détour"
        intro="Les réponses courtes d’abord, le détail à un clic. Si quelque chose reste encore flou, l’équipe est à un message."
        aside={
          <>
            <Link to="/contact" className="chip">
              Nous contacter
            </Link>
            <Link to="/shipping" className="chip">
              Livraison
            </Link>
            <Link to="/returns" className="chip">
              Retours
            </Link>
            <Link to="/privacy" className="chip">
              Politique de confidentialité
            </Link>
          </>
        }
      />

      <section className="page section" aria-label="Questions fréquentes">
        <div className="grid gap-6 lg:grid-cols-2">
          {groups.map((group, groupIndex) => (
            <div key={group.id} className="card h-fit overflow-hidden">
              <div className="flex items-start justify-between gap-4 border-b border-line bg-shell px-5 py-4">
                <div>
                  <p className="eyebrow mb-1.5">Groupe 0{groupIndex + 1}</p>
                  <h2 className="font-display text-lg font-bold uppercase leading-none">
                    {group.title}
                  </h2>
                  <p className="mt-2 text-xs leading-relaxed text-ink-mute">{group.note}</p>
                </div>
                <span className="badge badge-light shrink-0">{group.items.length} questions</span>
              </div>

              <div className="px-5">
                {group.items.map((faq, index) => {
                  const key = `${group.id}-${index}`
                  const open = openFaq === key
                  return (
                    <div key={faq.q} className="border-b border-line last:border-b-0">
                      <h3>
                        <button
                          type="button"
                          id={`faq-${key}-button`}
                          aria-expanded={open}
                          aria-controls={`faq-${key}-panel`}
                          onClick={() => setOpenFaq(open ? null : key)}
                          className="flex w-full items-start justify-between gap-4 py-4 text-left"
                        >
                          <span className="text-sm font-semibold leading-snug sm:text-base">
                            {faq.q}
                          </span>
                          <ChevronDown
                            size={17}
                            className={`mt-0.5 shrink-0 transition-transform duration-300 ${
                              open ? 'rotate-180 text-flash' : 'text-ink-mute'
                            }`}
                          />
                        </button>
                      </h3>
                      <div
                        id={`faq-${key}-panel`}
                        role="region"
                        aria-labelledby={`faq-${key}-button`}
                        hidden={!open}
                        className="pb-4"
                      >
                        <p className="text-sm leading-relaxed text-ink-soft fade-in">{faq.a}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <HelpCta
            eyebrow="Toujours bloqué ?"
            title="Vous avez encore une question ?"
            text="Envoyez-la à l’équipe et obtenez une réponse directe — pas de script, pas de fausse file d’attente. Une FLASHORA en production répondrait sous un jour ouvré ; ce prototype garde la conversation dans votre navigateur."
            primary={{ label: 'Nous contacter', to: '/contact' }}
            notes={[
              { icon: <ChatIcon size={17} />, label: 'Des réponses en clair' },
              { icon: <MailIcon size={17} />, label: 'hello@flashora.example' },
              { icon: <ClockIcon size={17} />, label: 'Réponse sous 1 jour ouvré' },
            ]}
          />
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   Contact
   ========================================================================== */

type ContactForm = { name: string; email: string; topic: string; message: string }

const contactTopics = [
  'Question sur une commande',
  'Livraison et expédition',
  'Retours et remboursements',
  'Informations produit',
  'Question sur le paiement',
  'Autre chose',
]

const emptyForm: ContactForm = { name: '', email: '', topic: '', message: '' }

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function ContactPage() {
  useDocumentTitle('Contact | FLASHORA')
  const { notify } = useStore()
  const [form, setForm] = useState<ContactForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({})
  const [sent, setSent] = useState(false)

  const update = (key: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const next: Partial<Record<keyof ContactForm, string>> = {}
    if (form.name.trim().length < 2) next.name = 'Veuillez saisir votre nom.'
    if (!emailPattern.test(form.email.trim()))
      next.email = 'Saisissez une adresse e-mail valide, par exemple moi@exemple.com.'
    if (!form.topic) next.topic = 'Choisissez un sujet pour que le message puisse être orienté.'
    if (form.message.trim().length < 10)
      next.message = 'Ajoutez un peu plus de détail — au moins 10 caractères.'

    setErrors(next)

    if (Object.keys(next).length > 0) {
      notify({ title: 'Vérifiez les champs surlignés', tone: 'error' })
      return
    }

    setSent(true)
    notify({
      title: 'Message envoyé ✓',
      message: `Merci ${form.name.trim()} — nous répondrons à ${form.email.trim()}.`,
      tone: 'success',
    })
  }

  const fieldClass = (hasError?: string) => `input${hasError ? ' border-danger' : ''}`

  return (
    <>
      <PageHeader
        page="Contact"
        eyebrow="Service client"
        title="Échangez avec FLASHORA"
        intro="Une question sur une commande, une livraison ou un produit ? Envoyez les détails et obtenez une réponse humaine — ce formulaire de démonstration valide tout dans votre navigateur."
        aside={
          <Link to="/faq" className="chip">
            Consultez d’abord la FAQ
          </Link>
        }
      />

      <section className="page section" aria-label="Formulaire de contact et coordonnées">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          {/* ------------------------------------------------- form --- */}
          {sent ? (
            <div className="card border-signal/30 p-7 sm:p-9" role="status" aria-live="polite">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-signal text-white">
                <CheckIcon size={22} />
              </span>
              <h2 className="mt-5 font-display text-2xl font-bold uppercase leading-tight">
                Message envoyé ✓
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                Merci <span className="font-semibold text-ink">{form.name.trim()}</span> — votre
                message concernant{' '}
                <span className="font-semibold text-ink">« {form.topic} »</span> a passé la
                validation et est enregistré pour cette session de démonstration.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-ink-soft">
                <li className="flex gap-2.5">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-signal" />
                  Dans une boutique en production, il arriverait à hello@flashora.example et serait
                  traité sous un jour ouvré.
                </li>
                <li className="flex gap-2.5">
                  <CheckIcon size={16} className="mt-0.5 shrink-0 text-signal" />
                  Rien n’a été transmis : ce prototype valide et affiche le formulaire en local.
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-light mt-6"
                onClick={() => {
                  setForm(emptyForm)
                  setErrors({})
                  setSent(false)
                }}
              >
                Écrire un autre message
              </button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="card p-6 sm:p-8">
              <p className="label">Envoyer un message</p>
              <h2 className="font-display text-2xl font-bold uppercase leading-tight">
                Dites-nous ce dont vous avez besoin
              </h2>
              <p className="mt-2 text-sm text-ink-mute">
                Les quatre champs sont obligatoires. Plus les détails sont clairs, plus la réponse
                le sera.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="label" htmlFor="contact-name">
                    Votre nom
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Martin"
                    className={fieldClass(errors.name)}
                    value={form.name}
                    onChange={(event) => update('name', event.target.value)}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="mt-1.5 text-xs font-semibold text-danger">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label" htmlFor="contact-email">
                    Adresse e-mail
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    className={fieldClass(errors.email)}
                    value={form.email}
                    onChange={(event) => update('email', event.target.value)}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="mt-1.5 text-xs font-semibold text-danger">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="label" htmlFor="contact-topic">
                    Sujet
                  </label>
                  <select
                    id="contact-topic"
                    name="topic"
                    className={fieldClass(errors.topic)}
                    value={form.topic}
                    onChange={(event) => update('topic', event.target.value)}
                    aria-invalid={errors.topic ? true : undefined}
                    aria-describedby={errors.topic ? 'contact-topic-error' : undefined}
                  >
                    <option value="">Choisissez un sujet</option>
                    {contactTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                  {errors.topic && (
                    <p id="contact-topic-error" className="mt-1.5 text-xs font-semibold text-danger">
                      {errors.topic}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="label" htmlFor="contact-message">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    placeholder="Expliquez-nous ce qui s’est passé, ce que vous avez commandé ou ce que vous souhaitez savoir."
                    className={`${fieldClass(errors.message)} resize-y`}
                    value={form.message}
                    onChange={(event) => update('message', event.target.value)}
                    aria-invalid={errors.message ? true : undefined}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      className="mt-1.5 text-xs font-semibold text-danger"
                    >
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button type="submit" className="btn btn-ink">
                  Envoyer le message <ArrowRight size={16} />
                </button>
                <p className="text-xs leading-relaxed text-ink-mute">
                  Formulaire de démonstration — aucun e-mail n’est envoyé et rien ne quitte votre
                  navigateur.
                </p>
              </div>
            </form>
          )}

          {/* ------------------------------------------- contact info --- */}
          <aside className="space-y-4" aria-label="Autres moyens de nous joindre">
            <div className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-shell text-ink">
                <MailIcon size={18} />
              </span>
              <p className="label mt-4">E-mail</p>
              <a
                href="mailto:hello@flashora.example"
                className="font-display text-lg font-semibold transition hover:text-flash"
              >
                hello@flashora.example
              </a>
              <p className="mt-1 text-sm text-ink-mute">
                Commandes, partenariats, presse — une seule boîte pour tout.
              </p>
            </div>

            <div className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-shell text-ink">
                <ClockIcon size={18} />
              </span>
              <p className="label mt-4">Délai de réponse</p>
              <p className="font-display text-lg font-semibold">Sous 1 jour ouvré</p>
              <p className="mt-1 text-sm text-ink-mute">
                Du lundi au vendredi, 9 h – 18 h (CET). Le week-end est fait pour les soldes, pas
                pour la boîte de réception.
              </p>
            </div>

            <div className="card p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-shell text-ink">
                <ChatIcon size={18} />
              </span>
              <p className="label mt-4">À propos de ce formulaire de démo</p>
              <p className="font-display text-lg font-semibold">Aucun e-mail n’est envoyé</p>
              <p className="mt-1 text-sm text-ink-mute">
                Le formulaire vérifie votre saisie, affiche une confirmation et déclenche une
                notification — puis s’arrête là. Une version de production le transmettrait à
                l’adresse ci-dessus.
              </p>
            </div>

            <div className="card bg-shell p-5">
              <p className="label">En autonomie</p>
              <p className="text-sm leading-relaxed text-ink-soft">
                Les délais de livraison, les étapes de retour et les questions sur les données de
                démonstration sont déjà rédigés.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to="/shipping" className="chip">
                  Livraison
                </Link>
                <Link to="/returns" className="chip">
                  Retours
                </Link>
                <Link to="/faq" className="chip">
                  FAQ
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   Shipping
   ========================================================================== */

const shippingSteps = [
  {
    title: 'Vous choisissez au paiement',
    text: 'Optez pour le standard ou l’express et consultez les frais de livraison ainsi que les dates estimées dans le résumé de la commande — avant toute confirmation.',
  },
  {
    title: 'Nous préparons et expédions',
    text: 'Le colis quitte l’entrepôt avec un numéro de suivi. Comptez 3 à 5 jours ouvrés en standard ; pour l’express, la commande doit être passée avant 14 h, soit 1 à 2 jours.',
  },
  {
    title: 'Vous le suivez jusqu’à votre porte',
    text: 'Un lien de suivi est envoyé par e-mail à l’expédition du colis, et toute livraison suivie nécessite une signature ou un retrait en point relais.',
  },
]

export function ShippingPage() {
  useDocumentTitle('Livraison | FLASHORA')

  return (
    <>
      <PageHeader
        page="Livraison"
        eyebrow="Service client"
        title="Livraison et expédition"
        intro="Suivi sur toutes les commandes, deux vitesses au choix et livraison standard offerte dès 79 € — voici exactement comment cela fonctionne."
        aside={
          <>
            <span className="badge badge-ink">Standard 3–5 jours</span>
            <span className="badge badge-amber">Express 1–2 jours</span>
            <Link to="/returns" className="chip">
              Retours
            </Link>
          </>
        }
      />

      {/* ------------------------------------------------- facts table --- */}
      <section className="page section" aria-labelledby="shipping-facts">
        <div id="shipping-facts">
          <SectionHeading
            eyebrow="En bref"
            title="Options de livraison"
            text="Les délais sont comptés en jours ouvrés à partir de l’expédition. Le tableau ci-dessous présente la politique de démonstration avec laquelle ce prototype est livré."
          />
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left align-top text-sm">
              <caption className="sr-only">
                Options de livraison FLASHORA, délais et détails inclus
              </caption>
              <thead>
                <tr className="border-b border-line bg-shell">
                  <th
                    scope="col"
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
                  >
                    Option
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
                  >
                    Délai
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
                  >
                    Détails
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shippingFacts.map((fact) => (
                  <tr key={fact.label}>
                    <th
                      scope="row"
                      className="px-5 py-4 font-display text-base font-semibold text-ink"
                    >
                      {fact.label}
                    </th>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-ink">
                      {fact.value}
                    </td>
                    <td className="px-5 py-4 text-ink-mute">{fact.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ steps --- */}
      <section className="border-y border-line bg-shell" aria-labelledby="shipping-steps">
        <div className="page section">
          <div id="shipping-steps">
            <SectionHeading
              eyebrow="Étape par étape"
              title="Comment se déroule la livraison"
              text="Trois étapes, du paiement au pas de la porte — les mêmes qu’une commande FLASHORA en production."
            />
          </div>

          <ol className="grid gap-5 md:grid-cols-3">
            {shippingSteps.map((step, index) => (
              <li key={step.title} className="card p-6">
                <span className="font-display text-4xl font-bold leading-none text-flash">
                  0{index + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase leading-none">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------ notes --- */}
      <section className="page section" aria-labelledby="shipping-notes">
        <div id="shipping-notes">
          <SectionHeading
            eyebrow="Bon à savoir"
            title="Avant de commander"
            text="Trois choses à savoir avant même que le colis n’existe."
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <InfoTile
            icon={<TruckIcon size={18} />}
            title={`Livraison offerte dès ${FREE_SHIPPING_FROM} €`}
            text="La livraison standard passe automatiquement à 0 € dès que le sous-total de la commande atteint ce montant — aucun code à retenir."
          />
          <InfoTile
            icon={<ClockIcon size={18} />}
            title="Suivi inclus"
            text="Chaque colis suivi bénéficie d’un lien par e-mail dès son départ de l’entrepôt. Cette démonstration n’envoie aucun e-mail réel."
          />
          <InfoTile
            icon={<CardIcon size={18} />}
            title="Frais affichés à l’avance"
            text="Le coût de livraison apparaît dans le résumé de la commande avant votre confirmation — jamais en surprise sur l’écran final."
          />
        </div>

        <div className="card mt-6 p-6 sm:p-7">
          <p className="text-sm leading-relaxed text-ink-soft">
            <span className="font-semibold text-ink">Note d’honnêteté :</span> FLASHORA est un
            prototype : aucun colis n’est jamais expédié et les délais ci-dessus décrivent le
            service prévu, non une réservation réelle auprès d’un transporteur. Si une commande ne
            peut tenir son délai, une boutique en production doit le signaler tôt — pas après la
            date promise. Vous avez changé d’avis sur un article ? La politique de retours explique
            le délai de 30 jours, les règles d’état et les délais de remboursement.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/returns" className="btn btn-ghost">
              Lire la politique de retours <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-ink">
              Écrire à l’équipe
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   Returns
   ========================================================================== */

/** Icons matched to the fixed order of `returnFacts` in data/content.ts. */
const returnFactIcons = [ClockIcon, PackageIcon, CardIcon, ReturnIcon]

const returnSteps = [
  {
    title: 'Initier le retour',
    text: 'Ouvrez votre commande — ou contactez-nous avec le numéro de commande — et indiquez quel article revient et pourquoi.',
  },
  {
    title: 'Générer l’étiquette prépayée',
    text: 'Créez l’étiquette de retour depuis la page de commande, imprimez-la et collez-la à l’extérieur du colis.',
  },
  {
    title: 'Emballer l’ensemble',
    text: 'Joignez tous les accessoires, câbles, notices et l’emballage d’origine, et masquez l’ancienne étiquette d’expédition.',
  },
  {
    title: 'Déposer, puis être remboursé',
    text: 'Déposez le colis en point relais et conservez le reçu. Après contrôle, le remboursement intervient sous 5 à 10 jours ouvrés.',
  },
]

const returnNotes = [
  {
    title: '30 jours, comptés à partir de la livraison',
    text: 'Le délai démarre à la réception du colis, non à la date de commande. Prévenez-nous avant le 30ᵉ jour : quelques jours de transport supplémentaires sont acceptés.',
  },
  {
    title: 'L’état conditionne le résultat',
    text: 'Les articles doivent revenir en ensemble complet : emballage, câbles, notices, accessoires. Si un article est arrivé défectueux, dites-le — le processus change, vos options non.',
  },
  {
    title: 'Des délais de remboursement prévisibles',
    text: 'Une fois le retour contrôlé, le remboursement est émis sur le moyen de paiement d’origine sous 5 à 10 jours ouvrés. Votre banque peut ajouter quelques jours.',
  },
]

export function ReturnsPage() {
  useDocumentTitle('Retours | FLASHORA')

  return (
    <>
      <PageHeader
        page="Retours"
        eyebrow="Service client"
        title="Retours et remboursements"
        intro="Trente jours pour changer d’avis, une étiquette prépayée pour renvoyer l’article et un délai de remboursement sur lequel vous pouvez compter."
        aside={
          <>
            <span className="badge badge-ink">Délai de 30 jours</span>
            <span className="badge badge-amber">Étiquette prépayée</span>
            <Link to="/shipping" className="chip">
              Livraison
            </Link>
          </>
        }
      />

      {/* ------------------------------------------------------- facts --- */}
      <section className="page section" aria-labelledby="return-facts">
        <div id="return-facts">
          <SectionHeading
            eyebrow="En bref"
            title="La politique de retours"
            text="Quatre chiffres qui répondent à la plupart des questions de retour avant même que vous ne les posiez."
            action={{ label: 'Lire la FAQ', to: '/faq' }}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {returnFacts.map((fact, index) => {
            const Icon = returnFactIcons[index] ?? PackageIcon
            return (
              <div key={fact.label} className="card flex flex-col gap-4 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-shell text-ink">
                  <Icon size={18} />
                </span>
                <div>
                  <h3 className="label mb-1">{fact.label}</h3>
                  <p className="font-display text-2xl font-bold uppercase leading-none">
                    {fact.value}
                  </p>
                  <p className="mt-2 text-sm text-ink-mute">{fact.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ------------------------------------------------------- steps --- */}
      <section className="border-y border-line bg-shell" aria-labelledby="return-steps">
        <div className="page section">
          <div id="return-steps">
            <SectionHeading
              eyebrow="Étape par étape"
              title="Comment retourner un article"
              text="Quatre étapes, du début à la fin. Aucun appel téléphonique nécessaire."
            />
          </div>

          <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {returnSteps.map((step, index) => (
              <li key={step.title} className="card p-6">
                <span className="font-display text-4xl font-bold leading-none text-flash">
                  0{index + 1}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold uppercase leading-none">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------------------------------- notes --- */}
      <section className="page section" aria-labelledby="return-notes">
        <div id="return-notes">
          <SectionHeading
            eyebrow="Les conditions, en bref"
            title="Précisions sur la politique"
            text="Les trois règles qui déterminent si un retour est rapide ou long."
          />
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {returnNotes.map((note) => (
            <article key={note.title} className="card p-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-shell text-ink">
                <CheckIcon size={18} />
              </span>
              <h3 className="mt-4 font-display text-lg font-bold uppercase leading-none">
                {note.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{note.text}</p>
            </article>
          ))}
        </div>

        <div className="card mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
            Cette politique est rédigée pour le prototype : aucun article n’est expédié, donc aucun
            article ne peut être retourné. Elle illustre le service auquel une FLASHORA en
            production s’engagerait — y compris le cas où un article défectueux modifie le
            processus, pas vos options.
          </p>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to="/faq" className="btn btn-light">
              Lire la FAQ
            </Link>
            <Link to="/contact" className="btn btn-ink">
              Contacter l’équipe <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   Privacy
   ========================================================================== */

const storedKeys = [
  { key: 'flashora.cart', purpose: 'Les articles et quantités actuellement dans votre panier.' },
  { key: 'flashora.wishlist', purpose: 'Les produits enregistrés avec le bouton cœur.' },
  {
    key: 'flashora.promo',
    purpose: 'Le code promo appliqué au paiement, le cas échéant.',
  },
  {
    key: 'flashora.lastOrder',
    purpose:
      'Un résumé du dernier achat de démonstration : articles, totaux et coordonnées de livraison saisies.',
  },
]

const notCollected = [
  {
    title: 'Aucune donnée de paiement',
    text: 'le paiement ne demande jamais de numéro de carte dans cette version, et aucun paiement n’est traité ni stocké nulle part.',
  },
  {
    title: 'Ni analyse ni publicité',
    text: 'aucun script de suivi, gestionnaire de balises ou pixel publicitaire — rien ne compte vos visites ni ne vous suit sur d’autres sites.',
  },
  {
    title: 'Aucun compte',
    text: 'aucun mot de passe, profil ni fiche utilisateur n’existe ; vous pouvez naviguer et payer en tant qu’invité.',
  },
  {
    title: 'Aucune copie côté serveur',
    text: 'cette application n’a pas de serveur : votre panier, vos favoris et votre résumé de commande ne quittent jamais le navigateur.',
  },
]

const privacyChoices = [
  'Parcourez d’abord : aucune donnée n’est requise pour explorer le catalogue.',
  'Effacez : la fonction « effacer les données du site » de votre navigateur supprime toutes les clés flashora.* de cet appareil.',
  'Modifiez dans l’application : videz le panier, retirez des favoris ou supprimez le code promo — les valeurs enregistrées sont mises à jour immédiatement.',
  'Demandez : la page de contact vous dira exactement ce que contient telle ou telle clé.',
]

export function PrivacyPage() {
  useDocumentTitle('Politique de confidentialité | FLASHORA')

  return (
    <>
      <PageHeader
        page="Politique de confidentialité"
        eyebrow="Informations légales"
        title="Politique de confidentialité"
        intro="Rédigée pour ce prototype, sans prétendre être une politique d’entreprise : ce que la démonstration stocke, ce qu’elle ne collecte jamais, et ce qu’une boutique en production ajouterait."
        aside={
          <>
            <Link to="/privacy#cookies" className="chip">
              Aller aux cookies
            </Link>
            <span className="badge badge-light">Version prototype</span>
          </>
        }
      />

      <section className="page section" aria-label="Détails de la politique de confidentialité">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* ------------------------------------------------ stored --- */}
          <article className="card p-6 sm:p-8">
            <p className="eyebrow">Sur votre appareil</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Ce que ce prototype stocke
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              FLASHORA n’a pas de serveur. Tout ce que l’application mémorise vit dans le stockage
              local de votre navigateur, sur cet appareil, sous des clés qui commencent par{' '}
              <span className="font-mono text-xs font-semibold text-ink">flashora.</span> Cela
              sert à conserver votre panier et vos favoris entre deux actualisations — ces données
              ne sont jamais envoyées ailleurs.
            </p>

            <h3 className="mt-6 font-display text-base font-bold uppercase">
              Clés de stockage local
            </h3>
            <dl className="mt-3 overflow-hidden rounded-2xl border border-line bg-shell">
              {storedKeys.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col gap-1 border-b border-line px-4 py-3 last:border-b-0 sm:flex-row sm:items-baseline sm:gap-5"
                >
                  <dt className="shrink-0 font-mono text-xs font-semibold text-flash">
                    {item.key}
                  </dt>
                  <dd className="text-sm leading-relaxed text-ink-soft">{item.purpose}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-ink-mute">
              Les formulaires de contact et de newsletter sont validés dans le navigateur
              uniquement : ils affichent une confirmation et déclenchent une notification, puis
              s’arrêtent. Rien n’est transmis.
            </p>
          </article>

          {/* -------------------------------------------------- not --- */}
          <article className="card p-6 sm:p-8">
            <p className="eyebrow">Hors périmètre</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Ce qui n’est pas collecté
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Cette version a été volontairement gardée sobre en données. Ce qui suit est absent du
              code, pas simplement désactivé :
            </p>
            <ul className="mt-4 space-y-3">
              {notCollected.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal/10 text-signal">
                    <CheckIcon size={13} />
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">
                    <span className="font-semibold text-ink">{item.title}</span> — {item.text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-xl bg-shell px-4 py-3 text-xs leading-relaxed text-ink-mute">
              Remarque : l’hébergeur statique qui sert cette démonstration peut conserver des
              journaux techniques de requêtes standards. Cela se produit hors du code de cette
              application, à la discrétion de l’hébergeur.
            </p>
          </article>

          {/* ----------------------------------------------- cookies --- */}
          <article id="cookies" className="card scroll-mt-28 p-6 sm:p-8">
            <p className="eyebrow">Cookies</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Cookies
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Ce prototype ne définit aucun cookie qui lui soit propre. Ce qui ressemble à un site
              qui se souvient de vous est en réalité du stockage local, un mécanisme différent qui
              reste sur cet appareil.
            </p>
            <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-ink-soft">
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" aria-hidden />
                Aucun cookie de session — l’application n’a ni connexion ni session serveur.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" aria-hidden />
                Aucun cookie d’analyse ou de publicité — rien ne mesure ni ne profile vos usages.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" aria-hidden />
                Aucun suivi inter-sites — aucune ressource tierce n’est chargée par ces pages.
              </li>
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              La suppression des données du site pour cette page retire avec elles toutes les clés
              flashora.*. Si FLASHORA était déployé avec un prestataire de paiement, une solution
              d’analyse ou un outil de chat, les cookies nécessaires à ces services seraient listés
              dans cette section — et demandés — avant toute exécution.
            </p>
          </article>

          {/* -------------------------------------------- production --- */}
          <article className="card p-6 sm:p-8">
            <p className="eyebrow">En cas de mise en production</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Ce qu’une boutique en production ajouterait
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Un FLASHORA déployé s’appuierait sur quelques services externes, chacun ne recevant
              que ce que sa fonction exige :
            </p>

            <h3 className="mt-5 font-display text-base font-bold uppercase">
              Prestataire de paiement
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Les coordonnées bancaires seraient saisies sur l’interface du prestataire de
              paiement et traitées selon ses conditions. La boutique ne recevrait qu’un statut de
              paiement — jamais le numéro de carte lui-même.
            </p>

            <h3 className="mt-5 font-display text-base font-bold uppercase">
              Partenaires de livraison
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Le transporteur recevrait le nom, l’adresse et les coordonnées imprimés sur
              l’étiquette, uniquement pour livrer le colis et afficher les événements de suivi.
            </p>

            <h3 className="mt-5 font-display text-base font-bold uppercase">
              E-mails transactionnels
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Confirmations de commande, liens de suivi et — uniquement avec consentement — e-mails
              de campagne passeraient par un prestataire d’e-mail. Cette démonstration n’en envoie
              aucun, et aucun consentement n’est recueilli pour le marketing non plus.
            </p>
          </article>

          {/* ----------------------------------------------- choices --- */}
          <article className="card p-6 sm:p-8">
            <p className="eyebrow">Contrôle</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Vos choix
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Tout ce que ce prototype mémorise se trouve sur votre appareil : vous en maîtrisez
              donc l’usage par défaut.
            </p>
            <ul className="mt-4 space-y-3">
              {privacyChoices.map((choice) => (
                <li key={choice} className="flex gap-3">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-signal/10 text-signal">
                    <CheckIcon size={13} />
                  </span>
                  <span className="text-sm leading-relaxed text-ink-soft">{choice}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* ------------------------------------------------- ask --- */}
          <article className="card p-6 sm:p-8">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Demandez avant de vous y fier
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Cet avis décrit le code tel qu’il existe aujourd’hui et sera mis à jour si la version
              évolue. Dans cette démonstration, aucune copie distante de vos données à demander ni
              à supprimer — mais si un point reste obscur, une réponse claire est à un message,
              à{' '}
              <a
                href="mailto:hello@flashora.example"
                className="font-semibold text-ink underline underline-offset-4 transition hover:text-flash"
              >
                hello@flashora.example
              </a>
              .
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/contact" className="btn btn-ink">
                Contacter l’équipe <ArrowRight size={16} />
              </Link>
              <Link to="/terms" className="btn btn-light">
                Lire les conditions
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}

/* ==========================================================================
   Terms
   ========================================================================== */

const termsSections = [
  {
    num: '01',
    eyebrow: 'Section 01',
    title: 'Périmètre de la démonstration',
    body: 'FLASHORA est un prototype front-end pour une campagne Cyber Monday : une expérience d’achat entièrement conçue, sans société, ni stock, ni logistique derrière elle. L’utiliser revient à accepter ces conditions en tant que conditions de démonstration — elles décrivent le prototype qui vous est soumis, non une relation commerciale.',
    bullets: [
      'La boutique est fournie en l’état, à des fins d’évaluation et de présentation.',
      'Aucun compte n’est créé et aucun contrat de vente n’est conclu en naviguant ou en passant commande.',
      'Tout ce qui est étiqueté donnée de démonstration l’est réellement, où qu’il apparaisse.',
    ],
  },
  {
    num: '02',
    eyebrow: 'Section 02',
    title: 'Prix, stock et disponibilité',
    body: 'Les prix, les anciens prix, les pourcentages de remise, les états de stock, les notes d’avis et les compteurs à rebours de cette version sont des données de démonstration. Ils montrent comment une campagne en production serait présentée et ne constituent pas des offres de vente.',
    bullets: [
      'Un prix barré illustre l’affichage d’un prix précédent — il ne prouve pas un prix promotionnel antérieur.',
      'Les états « en stock » et « rupture de stock » sont des exemples, pas un inventaire réel.',
      'Les compteurs à rebours illustrent la mise en forme de l’urgence ; ils ne réservent ni stock ni prix.',
      'Rien sur ce site ne doit être considéré comme une garantie de prix.',
    ],
  },
  {
    num: '03',
    eyebrow: 'Section 03',
    title: 'Commandes et paiement',
    body: 'Dans une version de production, la commande serait confirmée par e-mail avec les articles, le mode de livraison et le total, et le paiement serait géré par un prestataire externe. Les coordonnées bancaires sont saisies sur l’interface de ce prestataire : la boutique ne les recevrait ni ne les stockerait.',
    bullets: [
      'Cette démonstration ne prend aucun paiement et ne passe aucune commande réelle.',
      'L’écran de confirmation affiche un résumé local stocké sur votre appareil (flashora.lastOrder).',
      'Le paiement invité est possible — aucun compte n’est requis pour terminer le parcours de démonstration.',
    ],
  },
]

export function TermsPage() {
  useDocumentTitle('Conditions générales | FLASHORA')

  return (
    <>
      <PageHeader
        page="Conditions générales"
        eyebrow="Informations légales"
        title="Conditions d’utilisation"
        intro="La version honnête : ceci est un prototype, les données sont des données de démonstration, et ces conditions le disent en clair."
        aside={
          <>
            <span className="badge badge-light">Conditions prototype</span>
            <Link to="/privacy" className="chip">
              Politique de confidentialité
            </Link>
          </>
        }
      />

      <section className="page section" aria-label="Sections des conditions d’utilisation">
        <div className="mx-auto max-w-3xl space-y-6">
          {termsSections.map((section) => (
            <article key={section.num} className="card p-6 sm:p-8">
              <p className="eyebrow">{section.eyebrow}</p>
              <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{section.body}</p>
              <ul className="mt-4 space-y-2.5">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" aria-hidden />
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {/* ------------------------------------------------ shipping --- */}
          <article className="card p-6 sm:p-8">
            <p className="eyebrow">Section 04</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Livraison et retours
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Les délais de livraison, le seuil de livraison offerte et la politique de retour à 30
              jours décrivent le service prévu pour cette campagne. Ils sont détaillés sur deux
              pages dédiées, dans le même langage clair que ci-contre — y compris ce qui se passe
              lorsqu’un article arrive défectueux.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/shipping" className="btn btn-light">
                Politique de livraison
              </Link>
              <Link to="/returns" className="btn btn-light">
                Politique de retours
              </Link>
              <Link to="/faq" className="btn btn-light">
                FAQ
              </Link>
            </div>
          </article>

          {/* ------------------------------------------------ liability --- */}
          <article className="card p-6 sm:p-8">
            <p className="eyebrow">Section 05</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Responsabilité
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              FLASHORA, en l’état, étant une démonstration sans transactions, ni stock, ni livraisons
              derrière elle, la responsabilité est limitée à ce qu’un prototype peut réellement
              assumer. La version est fournie en l’état et sans garantie de disponibilité, et
              aucune décision ne devrait reposer sur des prix ou un stock de démonstration.
            </p>
            <ul className="mt-4 space-y-2.5">
              <li className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" aria-hidden />
                Nous ne garantissons pas un accès ininterrompu — la démonstration peut être mise à
                jour, tomber en panne ou être retirée.
              </li>
              <li className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" aria-hidden />
                Les descriptions et les caractéristiques sont illustratives ; elles ne constituent
                pas un conseil professionnel.
              </li>
              <li className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flash" aria-hidden />
                Rien ici ne limite ce qui ne peut l’être selon le droit applicable ; au-delà, le
                prototype n’engage pas davantage de responsabilité.
              </li>
            </ul>
          </article>

          {/* -------------------------------------------------- close --- */}
          <article className="card p-6 sm:p-8">
            <p className="eyebrow">Section 06</p>
            <h2 className="mt-3 font-display text-xl font-bold uppercase leading-tight">
              Questions sur ces conditions
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Ces conditions ont été écrites pour une version de démonstration, volontairement. Si
              quelque chose vous paraît vague ou trop assuré, demandez avant de vous y fier : envoyez
              une courte question à{' '}
              <a
                href="mailto:hello@flashora.example"
                className="font-semibold text-ink underline underline-offset-4 transition hover:text-flash"
              >
                hello@flashora.example
              </a>{' '}
              et vous obtiendrez une réponse directe, tandis que la politique de confidentialité
              précise ce que la démonstration stocke pendant votre visite.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/contact" className="btn btn-ink">
                Contacter l’équipe <ArrowRight size={16} />
              </Link>
              <Link to="/about" className="btn btn-light">
                À propos de FLASHORA
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}