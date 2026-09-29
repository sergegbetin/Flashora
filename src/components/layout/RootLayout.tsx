import { Outlet, useLocation } from 'react-router-dom'
import { AnnouncementBar, Header, MobileMenu } from './Header'
import { Footer, Newsletter } from './Footer'
import { SearchOverlay } from './SearchOverlay'
import { CartDrawer } from './CartDrawer'
import { Toasts } from './Toasts'
import { QuickViewModal } from './QuickViewModal'
import { ScrollToTop } from './ScrollToTop'

const PROSE_ROUTES = ['/about', '/faq', '/contact', '/shipping', '/returns', '/privacy', '/terms']

export function RootLayout() {
  const location = useLocation()
  const isProse = PROSE_ROUTES.some((route) => location.pathname.startsWith(route))

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Aller au contenu
      </a>

      <AnnouncementBar />
      <Header />

      <main id="main" className="flex-1">
        <Outlet />
        {isProse && <Newsletter />}
      </main>

      <Footer />

      <MobileMenu />
      <SearchOverlay />
      <CartDrawer />
      <QuickViewModal />
      <Toasts />
    </div>
  )
}
