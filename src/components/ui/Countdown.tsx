import { useCountdown } from '../../hooks'

interface CountdownProps {
  /** seconds until the offer ends (anchored on mount) */
  seconds: number
  variant?: 'hero' | 'panel' | 'inline'
  className?: string
}

const pad = (value: number) => String(value).padStart(2, '0')

/**
 * Campaign countdown. In this prototype it illustrates a limited-time offer
 * format only — no fake "remaining stock" message is attached to it.
 */
export function Countdown({ seconds, variant = 'hero', className = '' }: CountdownProps) {
  const { days, hours, minutes, seconds: secs, done } = useCountdown(seconds)

  const blocks =
    days > 0
      ? [
          { value: pad(days), label: 'Jours' },
          { value: pad(hours), label: 'Heures' },
          { value: pad(minutes), label: 'Minutes' },
          { value: pad(secs), label: 'Secondes' },
        ]
      : [
          { value: pad(hours), label: 'Heures' },
          { value: pad(minutes), label: 'Minutes' },
          { value: pad(secs), label: 'Secondes' },
        ]

  if (done) {
    return (
      <p className={`text-sm font-semibold text-ink-mute ${className}`}>
        Le délai de cette offre est écoulé.
      </p>
    )
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 font-display font-bold tabular-nums ${className}`}>
        {blocks.map((block, index) => (
          <span key={block.label} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-ink-mute/60">:</span>}
            {block.value}
          </span>
        ))}
      </span>
    )
  }

  const isHero = variant === 'hero'

  return (
    <div
      className={`flex gap-2 sm:gap-3 ${className}`}
      role="timer"
      aria-label="Temps restant pour cette offre"
    >
      {blocks.map((block) => (
        <div
          key={block.label}
          className={`flex flex-col items-center rounded-2xl ${
            isHero
              ? 'min-w-[68px] bg-ink px-3 py-2.5 text-white sm:min-w-[84px] sm:px-4 sm:py-3'
              : 'min-w-[62px] border border-line bg-white px-3 py-2'
          }`}
        >
          <span
            className={`font-display font-bold tabular-nums leading-none ${
              isHero ? 'text-2xl sm:text-3xl' : 'text-xl'
            }`}
          >
            {block.value}
          </span>
          <span
            className={`mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] ${
              isHero ? 'text-white/55' : 'text-ink-mute'
            }`}
          >
            {block.label}
          </span>
        </div>
      ))}
    </div>
  )
}
