import { Link, NavLink } from 'react-router-dom'
import { Sun, Moon, Menu, Activity, Search, Glasses, Timer } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { useCourseProgress } from '@/hooks/useModuleProgress'
import { useReadingMode } from '@/hooks/useReadingMode'
import { useFocusMode } from '@/hooks/useFocusMode'
import { useCourseOptional } from '@/contexts/CourseContext'
import { Logotipo } from '@/components/Logo'
import { IconButton } from '@/components/Button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { COURSE_TITLE, COURSE_LOGO } from '@/lib/course'

interface HeaderProps {
  onMenuToggle?: () => void
  onSearchClick?: () => void
}

const IS_MAC =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.05c-3.2.7-3.87-1.37-3.87-1.37-.52-1.34-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.74.4-1.26.73-1.55-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.48 3.14-1.17 3.14-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.05.78 2.12v3.14c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
    </svg>
  )
}

export function Header({ onMenuToggle, onSearchClick }: HeaderProps) {
  const { theme, toggle } = useTheme()
  const snapshots = useCourseProgress()
  const { enabled: readingMode, toggle: toggleReading } = useReadingMode()
  const focus = useFocusMode()
  const courseCtx = useCourseOptional()
  // En las páginas que viven dentro de un curso, los links del header
  // resuelven a `/cursos/<slug>/…`. Fuera (ajustes globales, futuro
  // login), apunta al curso por defecto.
  const home = courseCtx ? courseCtx.href() : '/'
  const progresoHref = courseCtx ? courseCtx.href('progreso') : '/progreso'

  // Progreso global del curso: media del % completado por módulo.
  // Para que la cifra crezca de forma estable usamos sections completas
  // sobre el total de secciones rastreables del curso, no la media de
  // booleanos por módulo. Eso da una progresión más lineal.
  const totalSections = snapshots.reduce((acc, s) => acc + s.totalSections, 0)
  const completedSections = snapshots.reduce((acc, s) => acc + s.completedCount, 0)
  const progressPct = totalSections > 0
    ? Math.round((completedSections / totalSections) * 100)
    : 0

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
            to={home}
            className="flex items-center gap-3 min-w-0 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] rounded-md px-1 py-1 -mx-1"
          >
            <Logotipo className="h-7 w-auto shrink-0" />
            <div className="hidden md:flex items-center gap-2.5 min-w-0 pl-3 ml-1 border-l border-[var(--border-default)]">
              <img
                src={`${import.meta.env.BASE_URL}${COURSE_LOGO}`}
                alt=""
                className="size-7 rounded-md shrink-0"
                aria-hidden
              />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold leading-tight text-[var(--text-primary)] truncate">
                  {COURSE_TITLE}
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
          {onSearchClick && (
            <>
              {/* Botón compacto en mobile */}
              <IconButton
                onClick={onSearchClick}
                label="Buscar en el curso"
                size="md"
                className="md:hidden"
              >
                <Search className="size-[17px]" />
              </IconButton>
              {/* Botón con atajo visible en desktop */}
              <button
                type="button"
                onClick={onSearchClick}
                aria-label="Buscar en el curso"
                className="hidden md:inline-flex items-center gap-2 h-9 pl-2.5 pr-2 mr-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-[13px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]"
              >
                <Search className="size-[14.5px] shrink-0" aria-hidden />
                <span className="hidden lg:inline">Buscar</span>
                <kbd
                  className="inline-flex items-center justify-center h-5 min-w-[1.6rem] px-1 rounded border border-[var(--border-strong)] bg-[var(--bg-surface-2)] font-mono text-[10.5px] font-semibold text-[var(--text-muted)] tabular-nums"
                  aria-hidden
                >
                  {IS_MAC ? '⌘K' : 'Ctrl+K'}
                </kbd>
              </button>
            </>
          )}
          <NavLink
            to={progresoHref}
            className={({ isActive }) =>
              [
                'inline-flex items-center gap-1.5 px-2.5 h-9 rounded-md text-[13px] font-medium transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]',
                isActive
                  ? 'text-[var(--text-active)] bg-[var(--bg-active)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]',
              ].join(' ')
            }
            aria-label={`Progreso del curso, ${progressPct}% completado`}
          >
            <Activity className="size-[15px] stroke-[1.75]" aria-hidden />
            <span className="hidden sm:inline">Progreso</span>
            {progressPct > 0 && (
              <span
                className="ml-0.5 inline-flex items-center justify-center min-w-[2rem] h-5 px-1.5 rounded-full bg-[var(--color-pv-purple-500)]/15 text-[11px] font-semibold text-[var(--color-pv-purple-600)] dark:text-[var(--color-pv-purple-300)] tabular-nums"
                aria-hidden
              >
                {progressPct}%
              </span>
            )}
          </NavLink>
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
            onClick={() => (focus.phase === 'idle' ? focus.startWork() : focus.stop())}
            label={
              focus.phase === 'idle'
                ? 'Iniciar modo focus (Pomodoro 25/5)'
                : 'Detener el temporizador'
            }
            size="md"
            aria-pressed={focus.phase !== 'idle'}
            className={
              focus.phase !== 'idle'
                ? 'bg-[var(--color-pv-purple-500)]/15 text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)]'
                : undefined
            }
          >
            <Timer className="size-[17px]" />
          </IconButton>
          <IconButton
            onClick={toggleReading}
            label={readingMode ? 'Salir del modo lectura' : 'Activar modo lectura'}
            size="md"
            aria-pressed={readingMode}
            className={
              readingMode
                ? 'bg-[var(--color-pv-purple-500)]/15 text-[var(--color-pv-purple-700)] dark:text-[var(--color-pv-purple-300)]'
                : undefined
            }
          >
            <Glasses className="size-[17px]" />
          </IconButton>
          <IconButton
            onClick={toggle}
            label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            size="md"
          >
            {theme === 'dark' ? <Sun className="size-[17px]" /> : <Moon className="size-[17px]" />}
          </IconButton>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}
