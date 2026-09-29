import { useState } from 'react'
import { BoltIcon } from './Icons'

interface ImageFrameProps {
  src: string
  alt: string
  /** CSS aspect ratio class, e.g. "aspect-[4/5]" */
  aspect?: string
  className?: string
  imgClassName?: string
  eager?: boolean
  sizes?: string
}

/**
 * Image with a deliberate fallback: if a file is missing or fails to load the
 * frame degrades to a branded gradient panel instead of a broken rectangle.
 */
export function ImageFrame({
  src,
  alt,
  aspect = 'aspect-square',
  className = '',
  imgClassName = '',
  eager = false,
  sizes,
}: ImageFrameProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative overflow-hidden bg-shell ${aspect} ${className}`}>
      {failed ? (
        <div
          className="absolute inset-0 grid place-items-center bg-gradient-to-br from-cloud via-shell to-white"
          role="img"
          aria-label={alt}
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-flash shadow-card">
            <BoltIcon size={24} />
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  )
}
