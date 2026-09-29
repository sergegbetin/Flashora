import { useEffect, useMemo, useRef, useState } from 'react'

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
  total: number
}

const split = (total: number): CountdownParts => {
  const safe = Math.max(0, total)
  return {
    days: Math.floor(safe / 86400000),
    hours: Math.floor((safe % 86400000) / 3600000),
    minutes: Math.floor((safe % 3600000) / 60000),
    seconds: Math.floor((safe % 60000) / 1000),
    done: safe <= 0,
    total: safe,
  }
}

/**
 * Countdown to a fixed distance from now (demo campaign timer).
 * `secondsFromNow` is re-anchored on mount so a refresh restarts the timer.
 */
export function useCountdown(secondsFromNow: number): CountdownParts {
  const deadline = useRef(Date.now() + secondsFromNow * 1000)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  return useMemo(() => split(deadline.current - now), [now])
}

/** Persisted state helper (cart, wishlist survive a refresh). */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable: state stays in memory */
    }
  }, [key, value])

  return [value, setValue] as const
}

/** Keeps document.title in sync for the current route (SPA SEO). */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      const previous = meta.getAttribute('content')
      return () => meta.setAttribute('content', previous || '')
    }
    return undefined
  }, [title])
}

/** Locks body scroll while a drawer, modal or menu is open. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [active])
}

/** Escape-to-close + focus trap helper for overlays. */
export function useEscape(active: boolean, onEscape: () => void) {
  const handler = useRef(onEscape)
  handler.current = onEscape
  useEffect(() => {
    if (!active) return undefined
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handler.current()
    }
    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [active])
}
