import { Link } from 'react-router-dom'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Logo } from '@/components/Logo'

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.05c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.05.78 2.12v3.14c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  )
}

export function Header() {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[var(--bg-canvas)]/80 border-b border-[var(--border-default)]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <Logo className="size-9 shrink-0" />
          <div className="hidden sm:block">
            <div className="text-[15px] font-semibold leading-tight font-display text-[var(--text-primary)]">
              Microsoft Agent 365 IT Admin
            </div>
            <div className="text-[12px] text-[var(--text-muted)] leading-tight">
              Plain Vanilla Solutions
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com/plainvanillaESP/agent365-cert-course"
            target="_blank"
            rel="noopener noreferrer"
            className="size-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            aria-label="Repositorio en GitHub"
          >
            <GithubIcon className="size-[18px]" />
          </a>
          <button
            type="button"
            onClick={toggle}
            className="size-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </button>
        </div>
      </div>
    </header>
  )
}
