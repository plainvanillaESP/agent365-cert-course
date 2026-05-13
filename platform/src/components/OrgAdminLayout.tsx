import { useEffect, useState } from 'react'
import { NavLink, Outlet, Link, useParams, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Armchair,
  Users,
  ChevronLeft,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/hooks/useTheme'
import { useOrgRole } from '@/hooks/useOrgRole'
import { Logotipo } from '@/components/Logo'
import { IconButton } from '@/components/Button'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { Callout } from '@/components/Callout'

/**
 * Contexto que las páginas hijas pueden consumir para conocer la
 * organización activa sin volver a llamar `useOrgRole`.
 *
 * Lo simple es prop-drillearlo via Outlet context.
 */
export interface OrgContextValue {
  organizationId: string
  organizationName: string
  organizationSlug: string
}

export function OrgAdminLayout() {
  const { slug } = useParams<{ slug: string }>()
  const { user, signOut } = useAuth()
  const { theme, toggle } = useTheme()
  const { organization, role, error } = useOrgRole(slug)

  // Aria announce para cambios de página dentro del admin
  const [announce, setAnnounce] = useState('')
  useEffect(() => {
    if (organization) {
      setAnnounce(`Panel admin de ${organization.name} cargado`)
    }
  }, [organization])

  // Estados de error / no autorizado / no encontrado
  if (organization === undefined) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-[var(--text-muted)] text-sm">Cargando organización…</p>
      </div>
    )
  }

  if (organization === null) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center px-6 text-center max-w-md mx-auto">
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] mb-2">
          Organización no encontrada
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mb-6">
          {error ?? `No existe ninguna organización con el slug "${slug}".`}
        </p>
        <Link
          to="/"
          className="text-[13px] font-medium text-[var(--color-pv-purple-600)] dark:text-[var(--color-pv-purple-300)] hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (role !== 'admin') {
    // Sesión válida pero no admin de ESTA org → no autorizado.
    return <Navigate to="/" replace />
  }

  const ctx: OrgContextValue = {
    organizationId: organization.id,
    organizationName: organization.name,
    organizationSlug: organization.slug,
  }

  return (
    <div className="min-h-dvh bg-[var(--bg-page)]">
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </span>

      {/* Header admin org */}
      <header className="sticky top-0 z-30 h-[var(--layout-header-h)] backdrop-blur-md border-b border-[var(--border-default)] bg-[var(--bg-overlay)]">
        <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={`/org/${organization.slug}/admin`}
              className="flex items-center gap-3 min-w-0 no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-pv-purple-500)] rounded-md px-1 py-1 -mx-1"
            >
              <Logotipo className="h-7 w-auto shrink-0" />
              <div className="hidden md:flex items-center gap-2.5 min-w-0 pl-3 ml-1 border-l border-[var(--border-default)]">
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold leading-tight text-[var(--text-primary)] truncate">
                    {organization.name}
                  </div>
                  <div className="text-[11px] leading-tight text-[var(--text-muted)] mt-px">
                    Panel de organización
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
              Volver al curso
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

      {/* Body */}
      <div className="flex">
        <aside
          className="hidden lg:block w-60 shrink-0 border-r border-[var(--border-default)] sticky top-[var(--layout-header-h)] h-[calc(100dvh-var(--layout-header-h))] overflow-y-auto py-4 px-3"
          aria-label="Navegación del panel de organización"
        >
          <nav className="space-y-0.5">
            <OrgNavItem
              to={`/org/${organization.slug}/admin`}
              end
              icon={<LayoutDashboard className="size-[15px] stroke-[1.75]" aria-hidden />}
            >
              Dashboard
            </OrgNavItem>
            <OrgNavItem
              to={`/org/${organization.slug}/admin/seats`}
              icon={<Armchair className="size-[15px] stroke-[1.75]" aria-hidden />}
            >
              Seats
            </OrgNavItem>
            <OrgNavItem
              to={`/org/${organization.slug}/admin/progreso`}
              icon={<Users className="size-[15px] stroke-[1.75]" aria-hidden />}
            >
              Progreso del equipo
            </OrgNavItem>
          </nav>

          <div className="mt-8 pt-4 border-t border-[var(--border-subtle)]">
            <p className="text-[10.5px] uppercase tracking-[0.08em] font-semibold text-[var(--text-muted)] mb-2 px-2">
              Próximamente
            </p>
            <div className="space-y-0.5 opacity-50 pointer-events-none">
              <OrgNavItem to="#" icon={null}>
                Certificados
              </OrgNavItem>
              <OrgNavItem to="#" icon={null}>
                Perfil de la organización
              </OrgNavItem>
            </div>
          </div>
        </aside>

        <main
          id="main-content"
          className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8"
        >
          {error && (
            <Callout kind="warning" className="mb-4">
              <p className="text-[13px] m-0">{error}</p>
            </Callout>
          )}
          <Outlet context={ctx} />
        </main>
      </div>
    </div>
  )
}

function OrgNavItem({
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
