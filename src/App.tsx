import { HashRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './store/StoreContext'
import { RootLayout } from './components/layout/RootLayout'
import { HomePage } from './pages/Home'
import { ShopPage } from './pages/Shop'
import { ProductPage } from './pages/Product'
import { CategoryPage, SearchPage, WishlistPage } from './pages/BrowsePages'
import { CartPage, CheckoutPage, OrderConfirmationPage } from './pages/CommercePages'
import {
  AboutPage,
  ContactPage,
  FaqPage,
  PrivacyPage,
  ReturnsPage,
  ShippingPage,
  TermsPage,
} from './pages/InfoPages'
import { NotFoundPage } from './pages/NotFound'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
