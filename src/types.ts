export type CategoryId = 'tech' | 'gaming' | 'audio' | 'home' | 'lifestyle'

export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  category: CategoryId
  /** short merchandising tag shown on cards (e.g. "Wireless ANC") */
  tagline: string
  price: number
  oldPrice: number
  rating: number
  reviews: number
  images: string[]
  imageAlts: string[]
  badge: string | null
  inStock: boolean
  isNew: boolean
  /** drives the "Biggest discount" sort */
  discount: number
  /** ISO date, drives the "Newest" sort */
  addedAt: string
  /** 0-100, drives the "Popular" sort */
  popularity: number
  description: string
  features: string[]
  specs: ProductSpec[]
}

export interface Category {
  id: CategoryId
  name: string
  tagline: string
  description: string
  image: string
  imageAlt: string
}

export interface CartLine {
  productId: string
  qty: number
}

export interface Toast {
  id: string
  title: string
  message?: string
  tone: 'success' | 'info' | 'error'
}

export interface ReviewItem {
  id: string
  name: string
  initials: string
  rating: number
  product: string
  text: string
}
