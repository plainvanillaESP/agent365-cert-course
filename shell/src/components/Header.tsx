import { Link } from 'react-router-dom'
import { Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { Logotipo } from '@/components/Logo'
import { IconButton } from '@/components/Button'

interface HeaderProps {
  onMenuToggle?: () => void
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.05c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.05.78 2.12v3.14c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  )
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { theme, toggle } = useTheme()

  return (
    <header
      className="sticky top-0 z-30 h-[var(--layout-header-h)] backdrop-blur-md border-b border-[var(--border-default)] bg-[var(--bg-overlay)]"
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Marca + título del curso */}
        <div className="flex items-center gap-2 min-w-0">
          {onMenuToggle && (
            <IconButton
              onClick={onMenuToggle}
              label="Abrir navegación"
              size="md"
              className="lg:hidden -ml-1.5"
            >
              <Menu className="size-5" />
            </IconButton>
          )}

          <Link
            to="/"
            className="flex items-center gap-3 min-w-0 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] rounded-md px-1 py-1 -mx-1"
          >
            <Logotipo className="h-7 w-auto shrink-0" />
            <div className="hidden md:flex items-center gap-2.5 min-w-0 pl-3 ml-1 border-l border-[var(--border-default)]">
              <img
                src={`${import.meta.env.BASE_URL}agent365-logo-64.png`}
                alt=""
                className="size-7 rounded-md shrink-0"
                aria-hidden
              />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold leading-tight text-[var(--text-primary)] truncate">
                  Microsoft Agent 365 IT Admin
                </div>
                <div className="text-[11px] leading-tight text-[var(--text-muted)] mt-px">
                  Curso de certificación
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          <a
            href="https://github.com/plainvanillaESP/agent365-cert-course"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Repositorio en GitHub"
            className="size-9 inline-flex items-center justify-center rounded-md text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]"
          >
            <GithubIcon className="size-[17px]" />
          </a>
          <IconButton
            onClick={toggle}
            label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            size="md"
          >
            {theme === 'dark' ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
          </IconButton>
        </div>
      </div>
    </header>
  )
}
