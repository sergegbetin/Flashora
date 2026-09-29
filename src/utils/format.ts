const eur = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

/** 599 -> "599 €", 81.5 -> "81,50 €" */
export const formatPrice = (value: number): string => eur.format(value)

/** Absolute saving between two prices. */
export const savings = (price: number, oldPrice: number): number => Math.max(0, oldPrice - price)

/** Discount percentage rounded to a whole number. */
export const discountPercent = (price: number, oldPrice: number): number =>
  oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

export const uid = (): string => Math.random().toString(36).slice(2, 10)
