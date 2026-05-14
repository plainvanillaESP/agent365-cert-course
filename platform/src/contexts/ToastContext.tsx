import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export type ToastKind = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  kind: ToastKind
  message: string
  /** ms hasta auto-dismiss. 0 = no auto-dismiss. Por defecto 4000. */
  duration?: number
}

interface ToastContextValue {
  toasts: Toast[]
  show: (toast: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

/**
 * Provider del sistema de toasts. Móntalo una vez cerca de la raíz
 * de la app. Las páginas consumen `useToast()` para disparar
 * notificaciones efímeras.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((toast: Omit<Toast, 'id'>) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    // En tests o renderizado fuera del provider, fallback no-op.
    return {
      toasts: [],
      show: () => undefined,
      dismiss: () => undefined,
    }
  }
  return ctx
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: string) => void
}) {
  if (toasts.length === 0) return null
  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-[calc(100vw-2rem)] sm:max-w-sm"
      role="region"
      aria-label="Notificaciones"
      aria-live="polite"
    >
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const duration = toast.duration ?? 4000
  useEffect(() => {
    if (duration <= 0) return
    const id = setTimeout(() => onDismiss(toast.id), duration)
    return () => clearTimeout(id)
  }, [toast.id, duration, onDismiss])

  const palette =
    toast.kind === 'success'
      ? {
          border: 'border-emerald-500/30',
          bg: 'bg-emerald-500/5',
          icon: 'text-emerald-700 dark:text-emerald-300',
          Icon: CheckCircle2,
        }
      : toast.kind === 'error'
        ? {
            border: 'border-red-500/30',
            bg: 'bg-red-500/5',
            icon: 'text-red-700 dark:text-red-300',
            Icon: AlertCircle,
          }
        : {
            border: 'border-[var(--border-default)]',
            bg: 'bg-[var(--bg-surface)]',
            icon: 'text-[var(--text-muted)]',
            Icon: Info,
          }

  const { Icon } = palette

  return (
    <div
      className={`rounded-lg border ${palette.border} ${palette.bg} backdrop-blur-sm shadow-sm px-3 py-2.5 flex items-start gap-2.5 animate-[toast-in_0.2s_ease-out]`}
      role={toast.kind === 'error' ? 'alert' : 'status'}
    >
      <Icon className={`size-[16px] shrink-0 mt-0.5 ${palette.icon}`} aria-hidden />
      <p className="flex-1 text-[13px] text-[var(--text-primary)] leading-relaxed">
        {toast.message}
      </p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Cerrar notificación"
        className="size-5 inline-flex items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors shrink-0"
      >
        <X className="size-[12px]" aria-hidden />
      </button>
    </div>
  )
}
