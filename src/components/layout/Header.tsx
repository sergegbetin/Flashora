import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useStore } from '../../store/StoreContext'
import { useEscape } from '../../hooks'
import { navLinks, announcement } from '../../data/content'
import { Logo } from '../ui/Logo'
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon, UserIcon, ArrowRight } from '../ui/Icons'

export function AnnouncementBar() {
  const items = [announcement.text, announcement.text, announcement.text, announcement.text]

  return (
    <div className="relative z-40 overflow-hidden bg-ink text-white">
      <div className="flex h-10 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="relative flex-1 overflow-hidden">
          <span
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-ink to-transparent"
            aria-hidden
          />
          <span
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-ink to-transparent"
            aria-hidden
          />
          <div className="marquee-track gap-10 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.2em]">
            {[...items, ...items].map((text, index) => (
              <span key={index} className="inline-flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-flash" />
                {text}
              </span>
            ))}
          </div>
        </div>
        <Link
          to="/shop?sort=discount"
          className="group hidden shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber transition hover:text-white sm:inline-flex"
        >
          {announcement.cta}
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export function Header() {
  const { cartCount, wishlist, menuOpen, setSearchOpen, setMenuOpen, setCartOpen, notify } = useStore()
  const [compact, setCompact] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search, setMenuOpen])

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-cream/85 backdrop-blur-xl">
      <div
        className={`page flex items-center gap-4 transition-all duration-300 ${
          compact ? 'h-16' : 'h-20'
        }`}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink lg:hidden"
        >
          <MenuIcon size={18} />
        </button>

        <Logo size="md" className="shrink-0" />

        <nav aria-label="Navigation principale" className="hidden flex-1 items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive && !link.to.includes('?')
                    ? 'bg-ink text-white'
                    : 'text-ink-soft hover:bg-white hover:text-ink'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Rechercher sur FLASHORA"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink"
          >
            <SearchIcon size={18} />
          </button>

          <Link
            to="/wishlist"
            aria-label={`Favoris, ${wishlist.length} article${wishlist.length === 1 ? '' : 's'}`}
            className="relative hidden h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink sm:grid"
          >
            <HeartIcon size={18} />
            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-flash px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() =>
              notify({ title: 'Les comptes ouvriront au lancement', message: 'La commande en tant qu’invité est prête.', tone: 'info' })
            }
            aria-label="Compte"
            className="hidden h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink sm:grid"
          >
            <UserIcon size={18} />
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Panier, ${cartCount} article${cartCount === 1 ? '' : 's'}`}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-ink"
          >
            <BagIcon size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/shop?sort=discount" className="btn btn-flash btn-sm ml-1 hidden xl:inline-flex">
            VOIR LES SOLDES CYBER
          </Link>
        </div>
      </div>
    </header>
  )
}

export function MobileMenu() {
  const { menuOpen, setMenuOpen, wishlist, cartCount } = useStore()

  useEffect(() => {
    if (!menuOpen) return undefined
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEscape(menuOpen, () => setMenuOpen(false))

  if (!menuOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-[2px] fade-in"
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="panel slide-right absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col"
      >
        <div className="flex h-20 items-center justify-between border-b border-line px-5">
          <Logo size="sm" />
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Fermer le menu"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Navigation mobile">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-2xl px-4 py-3.5 font-display text-lg font-semibold transition hover:bg-white"
                >
                  {link.label}
                  <ArrowRight size={18} className="text-ink-mute" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              to="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="card flex items-center justify-between p-4 text-sm font-semibold"
            >
              Favoris
              <span className="badge badge-flash">{wishlist.length}</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="card flex items-center justify-between p-4 text-sm font-semibold"
            >
              Panier
              <span className="badge badge-ink">{cartCount}</span>
            </Link>
            <Link
              to="/search"
              onClick={() => setMenuOpen(false)}
              className="card flex items-center justify-between p-4 text-sm font-semibold"
            >
              Rechercher
              <SearchIcon size={16} />
            </Link>
            <Link
              to="/faq"
              onClick={() => setMenuOpen(false)}
              className="card flex items-center justify-between p-4 text-sm font-semibold"
            >
              FAQ
              <span className="text-ink-mute">?</span>
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-6 text-sm">
            <Link to="/about" onClick={() => setMenuOpen(false)} className="text-ink-soft">
              À propos
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-ink-soft">
              Contact
            </Link>
            <Link to="/shipping" onClick={() => setMenuOpen(false)} className="text-ink-soft">
              Livraison
            </Link>
            <Link to="/returns" onClick={() => setMenuOpen(false)} className="text-ink-soft">
              Retours
            </Link>
          </div>
        </nav>

        <div className="border-t border-line p-5">
          <Link
            to="/shop?sort=discount"
            onClick={() => setMenuOpen(false)}
            className="btn btn-flash w-full"
          >
            VOIR LES SOLDES CYBER
          </Link>
        </div>
      </div>
    </div>
  )
}
