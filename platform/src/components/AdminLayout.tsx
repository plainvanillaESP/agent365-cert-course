import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  Award,
  ChevronLeft,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/hooks/useTheme'
import { Logotipo } from '@/components/Logo'
import { IconButton } from '@/components/Button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

/**
 * Layout dedicado al panel admin de Plain Vanilla.
 *
 * Diferente del layout del alumno: header propio sin elementos de
 * curso, sidebar específica con las secciones del admin, y un link
 * para volver al lado alumno por si la persona logueada también
 * tiene cursos asignados.
 */
export function AdminLayout() {
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-dvh bg-[var(--bg-page)]">
      {/* Header admin */}
      <header className="sticky top-0 z-30 h-[var(--layout-header-h)] backdrop-blur-md border-b border-[var(--border-default)] bg-[var(--bg-overlay)]">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin"
              className="flex items-center gap-3 min-w-0 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] rounded-md px-1 py-1 -mx-1"
            >
              <Logotipo className="h-7 w-auto shrink-0" />
              <div className="hidden md:flex items-center gap-2.5 min-w-0 pl-3 ml-1 border-l border-[var(--border-default)]">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold leading-tight text-[var(--text-primary)] truncate">
                    Admin Plain Vanilla
                  </div>
                  <div className="text-[11px] leading-tight text-[var(--text-muted)] mt-px">
                    Gestión de la plataforma
                  </div>
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-md text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)] transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]"
            >
              <ChevronLeft className="size-[14px] stroke-[2]" aria-hidden />
              Volver al alumno
            </Link>
            {user && (
              <span className="hidden lg:inline text-[12px] text-[var(--text-muted)] mr-1">
                {user.email}
              </span>
            )}
            <IconButton
              onClick={toggle}
              label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              size="md"
            >
              {theme === 'dark' ? (
                <Sun className="size-[17px]" />
              ) : (
                <Moon className="size-[17px]" />
              )}
            </IconButton>
            <LanguageSwitcher />
            <IconButton onClick={signOut} label="Cerrar sesión" size="md">
              <LogOut className="size-[17px]" />
            </IconButton>
          </div>
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex">
        <aside
          className="hidden lg:block w-60 shrink-0 border-r border-[var(--border-default)] sticky top-[var(--layout-header-h)] h-[calc(100dvh-var(--layout-header-h))] overflow-y-auto py-4 px-3"
          aria-label="Navegación del panel admin"
        >
          <nav className="space-y-0.5">
            <AdminNavItem to="/admin" end icon={<LayoutDashboard className="size-[15px] stroke-[1.75]" aria-hidden />}>
              Dashboard
            </AdminNavItem>
            <AdminNavItem to="/admin/organizaciones" icon={<Building2 className="size-[15px] stroke-[1.75]" aria-hidden />}>
              Organizaciones
            </AdminNavItem>
            <AdminNavItem to="/admin/usuarios" icon={<Users className="size-[15px] stroke-[1.75]" aria-hidden />}>
              Usuarios
            </AdminNavItem>
            <AdminNavItem to="/admin/certificados" icon={<Award className="size-[15px] stroke-[1.75]" aria-hidden />}>
              Certificados
            </AdminNavItem>
          </nav>

          <div className="mt-8 pt-4 border-t border-[var(--border-subtle)]">
            <p className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[var(--text-muted)] mb-2 px-2">
              Próximamente
            </p>
            <div className="space-y-0.5 opacity-50 pointer-events-none">
              <AdminNavItem to="#" icon={null}>
                Ventas B2C
              </AdminNavItem>
            </div>
          </div>
        </aside>

        <main id="main-content" className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function AdminNavItem({
  to,
  end,
  icon,
  children,
}: {
  to: string
  end?: boolean
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'flex items-center gap-2 h-9 px-2.5 rounded-md text-[13px] font-medium transition-colors no-underline',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)]',
          isActive
            ? 'text-[var(--text-active)] bg-[var(--bg-active)]'
            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]',
        ].join(' ')
      }
    >
      {icon ?? <span className="size-[15px]" aria-hidden />}
      <span>{children}</span>
    </NavLink>
  )
}
