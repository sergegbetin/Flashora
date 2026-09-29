import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { productById } from '../data/products'
import { useLocalStorage } from '../hooks'
import { uid } from '../utils/format'
import type { CartLine, Product, Toast } from '../types'

export interface PromoState {
  code: string
  label: string
  percent: number
}

const PROMOS: PromoState[] = [
  { code: 'FLASH10', label: '10 % de réduction', percent: 10 },
  { code: 'CYBER15', label: '15 % de réduction', percent: 15 },
]

export const FREE_SHIPPING_FROM = 79
export const SHIPPING_FLAT = 4.95

export interface OrderSummary {
  id: string
  placedAt: string
  lines: { productId: string; name: string; qty: number; price: number; image: string }[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  promo: string | null
  email: string
  delivery: string
}

interface StoreValue {
  cart: CartLine[]
  wishlist: string[]
  toasts: Toast[]
  promo: PromoState | null
  lastOrder: OrderSummary | null
  quickViewId: string | null
  searchOpen: boolean
  cartOpen: boolean
  menuOpen: boolean
  addToCart: (product: Product, qty?: number) => void
  removeFromCart: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clearCart: () => void
  toggleWishlist: (productId: string) => void
  inWishlist: (productId: string) => boolean
  cartCount: number
  cartItems: { product: Product; qty: number }[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  applyPromo: (code: string) => { ok: boolean; message: string }
  removePromo: () => void
  setLastOrder: (order: OrderSummary) => void
  openQuickView: (productId: string) => void
  closeQuickView: () => void
  setSearchOpen: (open: boolean) => void
  setCartOpen: (open: boolean) => void
  setMenuOpen: (open: boolean) => void
  notify: (toast: Omit<Toast, 'id'>) => void
  dismissToast: (id: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useLocalStorage<CartLine[]>('flashora.cart', [])
  const [wishlist, setWishlist] = useLocalStorage<string[]>('flashora.wishlist', [])
  const [promo, setPromo] = useLocalStorage<PromoState | null>('flashora.promo', null)
  const [lastOrder, setLastOrderState] = useLocalStorage<OrderSummary | null>(
    'flashora.lastOrder',
    null,
  )
  const [toasts, setToasts] = useState<Toast[]>([])

  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const notify = useCallback((toast: Omit<Toast, 'id'>) => {
    const next: Toast = { ...toast, id: uid() }
    setToasts((current) => [...current.slice(-2), next])
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== next.id))
    }, 3600)
  }, [])

  const dismissToast = useCallback(
    (id: string) => setToasts((current) => current.filter((t) => t.id !== id)),
    [],
  )

  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      setCart((current) => {
        const existing = current.find((line) => line.productId === product.id)
        if (existing) {
          return current.map((line) =>
            line.productId === product.id ? { ...line, qty: Math.min(line.qty + qty, 20) } : line,
          )
        }
        return [...current, { productId: product.id, qty }]
      })
      notify({ title: 'Ajouté au panier ✓', message: product.name, tone: 'success' })
      setCartOpen(true)
    },
    [notify, setCart],
  )

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((current) => current.filter((line) => line.productId !== productId))
      notify({ title: 'Retiré du panier', tone: 'info' })
    },
    [notify, setCart],
  )

  const setQty = useCallback(
    (productId: string, qty: number) => {
      setCart((current) =>
        qty <= 0
          ? current.filter((line) => line.productId !== productId)
          : current.map((line) => (line.productId === productId ? { ...line, qty } : line)),
      )
    },
    [setCart],
  )

  const clearCart = useCallback(() => setCart([]), [setCart])

  const toggleWishlist = useCallback(
    (productId: string) => {
      const exists = wishlist.includes(productId)
      setWishlist((current) =>
        exists ? current.filter((id) => id !== productId) : [...current, productId],
      )
      notify({
        title: exists ? 'Retiré des favoris' : 'Ajouté aux favoris ♥',
        tone: exists ? 'info' : 'success',
      })
    },
    [notify, setWishlist, wishlist],
  )

  const inWishlist = useCallback((productId: string) => wishlist.includes(productId), [wishlist])

  const cartItems = useMemo(
    () =>
      cart
        .map((line) => {
          const product = productById(line.productId)
          return product ? { product, qty: line.qty } : null
        })
        .filter((item): item is { product: Product; qty: number } => item !== null),
    [cart],
  )

  const cartCount = useMemo(() => cart.reduce((sum, line) => sum + line.qty, 0), [cart])

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [cartItems],
  )

  const discount = useMemo(
    () => (promo ? Math.round(subtotal * promo.percent) / 100 : 0),
    [promo, subtotal],
  )

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0
    return subtotal - discount >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FLAT
  }, [subtotal, discount])

  const total = useMemo(
    () => Math.max(0, subtotal - discount + shipping),
    [subtotal, discount, shipping],
  )

  const applyPromo = useCallback(
    (code: string) => {
      const found = PROMOS.find((p) => p.code === code.trim().toUpperCase())
      if (!found) return { ok: false, message: `Le code « ${code} » n’est pas valide.` }
      setPromo(found)
      notify({ title: `Code promo appliqué : ${found.code}`, message: found.label, tone: 'success' })
      return { ok: true, message: `${found.code} appliqué — ${found.label}.` }
    },
    [notify, setPromo],
  )

  const removePromo = useCallback(() => setPromo(null), [setPromo])
  const setLastOrder = useCallback(
    (order: OrderSummary) => setLastOrderState(order),
    [setLastOrderState],
  )

  const value: StoreValue = {
    cart,
    wishlist,
    toasts,
    promo,
    lastOrder,
    quickViewId,
    searchOpen,
    cartOpen,
    menuOpen,
    addToCart,
    removeFromCart,
    setQty,
    clearCart,
    toggleWishlist,
    inWishlist,
    cartCount,
    cartItems,
    subtotal,
    discount,
    shipping,
    total,
    applyPromo,
    removePromo,
    setLastOrder,
    openQuickView: setQuickViewId,
    closeQuickView: () => setQuickViewId(null),
    setSearchOpen,
    setCartOpen,
    setMenuOpen,
    notify,
    dismissToast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used inside <StoreProvider>')
  return context
}
