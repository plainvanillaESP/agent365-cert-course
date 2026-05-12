import { useState, useEffect, useRef } from 'react'
import { Globe, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LANGUAGE_LABELS, SUPPORTED_LANGUAGES, type SupportedLanguage } from '@/i18n'
import { IconButton } from '@/components/Button'

/**
 * Selector de idioma para el header. Dropdown minimal con la lista de
 * idiomas soportados; persistencia delegada a `i18next-browser-languagedetector`
 * (clave `pv-learn-language` en localStorage).
 *
 * Reutilizable: el componente no asume `compact` ni dimensiones del header,
 * pasa `className` para encajarlo donde el shell consumidor quiera.
 */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar al hacer click fuera.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const current = (i18n.resolvedLanguage ?? 'es') as SupportedLanguage

  const change = (lang: SupportedLanguage) => {
    void i18n.changeLanguage(lang)
    setOpen(false)
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <IconButton
        onClick={() => setOpen(o => !o)}
        label={t('header.language')}
        size="md"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="size-[17px]" />
      </IconButton>
      {open && (
        <ul
          role="listbox"
          aria-label={t('header.language')}
          className="absolute right-0 top-full mt-1.5 z-50 min-w-[160px] rounded-lg bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-lg py-1"
        >
          {SUPPORTED_LANGUAGES.map(lang => {
            const isCurrent = lang === current
            return (
              <li key={lang}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isCurrent}
                  onClick={() => change(lang)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-left hover:bg-[var(--bg-surface-hover)] focus:bg-[var(--bg-surface-hover)] focus:outline-none transition-colors"
                >
                  <span className="flex-1">{LANGUAGE_LABELS[lang]}</span>
                  {isCurrent && (
                    <Check
                      className="size-[14px] text-[var(--color-pv-purple-600)] dark:text-[var(--color-pv-purple-300)]"
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
