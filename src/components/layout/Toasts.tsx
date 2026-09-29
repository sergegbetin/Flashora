import { useStore } from '../../store/StoreContext'
import { CheckIcon, CloseIcon } from '../ui/Icons'

/** Bottom-right toast stack: success / info / error feedback. */
export function Toasts() {
  const { toasts, dismissToast } = useStore()

  if (toasts.length === 0) return null

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(92vw,22rem)] flex-col gap-2"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-pop fade-up"
          style={{ animationDuration: '0.28s' }}
        >
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white ${
              toast.tone === 'success'
                ? 'bg-signal'
                : toast.tone === 'error'
                  ? 'bg-danger'
                  : 'bg-ink'
            }`}
          >
            {toast.tone === 'success' ? <CheckIcon size={16} /> : <span className="text-xs font-bold">i</span>}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.message && <p className="truncate text-xs text-ink-mute">{toast.message}</p>}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Masquer la notification"
            className="text-ink-mute transition hover:text-ink"
          >
            <CloseIcon size={15} />
          </button>
        </div>
      ))}
    </div>
  )
}
