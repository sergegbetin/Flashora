import { Link } from 'react-router-dom'
import { BoltIcon } from './Icons'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-[clamp(2.5rem,7vw,4.5rem)]',
}

/** FLASHORA wordmark: works on light and dark backgrounds (currentColor). */
export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="Accueil FLASHORA"
      className={`group inline-flex items-center gap-2 font-display font-bold tracking-[-0.045em] ${sizes[size]} ${className}`}
    >
      <span className="grid place-items-center rounded-md bg-flash text-white shadow-flash transition-transform duration-300 group-hover:-rotate-6">
        <BoltIcon size={size === 'lg' ? 22 : size === 'md' ? 15 : 12} />
      </span>
      <span className="uppercase">
        Flash<span className="text-flash">ora</span>
      </span>
    </Link>
  )
}

/** Compact monogram used in tight headers and footers. */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-flash to-amber text-white shadow-flash ${className}`}
      aria-hidden
    >
      <BoltIcon size={18} />
    </span>
  )
}
