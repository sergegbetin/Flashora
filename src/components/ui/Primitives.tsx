import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { StarIcon } from './Icons'
import { formatPrice, savings } from '../../utils/format'

/* -------------------------------------------------------------- rating --- */
export function Rating({
  value,
  count,
  size = 14,
  className = '',
}: {
  value: number
  count?: number
  size?: number
  className?: string
}) {
  const rounded = Math.round(value)
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 ${className}`}>
      <span className="flex items-center gap-0.5 text-amber" aria-hidden>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            size={size}
            className={star <= rounded ? 'opacity-100' : 'opacity-25'}
          />
        ))}
      </span>
      <span className="sr-only">
        Note de {value.toFixed(1).replace('.', ',')} sur 5{count !== undefined ? `, basée sur ${count} avis` : ''}
      </span>
      <span className="text-xs font-semibold text-current">
        {value.toFixed(1).replace('.', ',')}
        {count !== undefined && <span className="font-normal opacity-70"> ({count})</span>}
      </span>
    </span>
  )
}

/* ---------------------------------------------------------------- price --- */
export function Price({
  price,
  oldPrice,
  size = 'md',
  showSaving = false,
}: {
  price: number
  oldPrice: number
  size?: 'sm' | 'md' | 'lg'
  showSaving?: boolean
}) {
  const cls = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size]
  const pct = oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0
  return (
    <span className="flex flex-wrap items-baseline gap-2">
      <span className={`font-display font-bold tracking-tight text-ink ${cls}`}>
        {formatPrice(price)}
      </span>
      {oldPrice > price && (
        <>
          <s className="text-sm text-ink-mute">{formatPrice(oldPrice)}</s>
          <span className="badge badge-flash">-{pct} %</span>
        </>
      )}
      {showSaving && oldPrice > price && (
        <span className="text-xs font-medium text-signal">
          Économisez {formatPrice(savings(price, oldPrice))}
        </span>
      )}
    </span>
  )
}

/* -------------------------------------------------------- section title --- */
export function SectionHeading({
  eyebrow,
  title,
  text,
  action,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  text?: string
  action?: { label: string; to: string }
  align?: 'left' | 'center'
}) {
  return (
    <div
      className={`mb-8 flex flex-wrap items-end justify-between gap-6 ${
        align === 'center' ? 'text-center' : ''
      }`}
    >
      <div className={align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="section-title text-balance">{title}</h2>
        {text && <p className="lede mt-3 text-ink-mute">{text}</p>}
      </div>
      {action && (
        <Link to={action.to} className="btn btn-light shrink-0">
          {action.label}
        </Link>
      )}
    </div>
  )
}

/* ------------------------------------------------------------ quantity --- */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 20,
  compact = false,
  label = 'Quantité',
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  compact?: boolean
  label?: string
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border border-line bg-white ${
        compact ? 'h-9' : 'h-12'
      }`}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
        className="grid h-full w-9 place-items-center rounded-l-full text-ink transition hover:bg-shell disabled:opacity-35"
      >
        −
      </button>
      <span
        className={`min-w-8 text-center font-semibold tabular-nums ${compact ? 'text-sm' : ''}`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
        className="grid h-full w-9 place-items-center rounded-r-full text-ink transition hover:bg-shell disabled:opacity-35"
      >
        +
      </button>
    </div>
  )
}

/* ------------------------------------------------------------- wrappers --- */
export function Card({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}) {
  return <Tag className={`card ${className}`}>{children}</Tag>
}

export function InfoTile({
  icon,
  title,
  text,
}: {
  icon: ReactNode
  title: string
  text: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-shell text-ink">
        {icon}
      </span>
      <span>
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-sm text-ink-mute">{text}</span>
      </span>
    </div>
  )
}
