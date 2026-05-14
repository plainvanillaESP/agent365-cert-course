import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom'
import { Header } from '@/components/Header'
import { NavSidebar } from '@/components/NavSidebar'
import { Skeleton, SkeletonParagraph } from '@/components/Skeleton'
import { ShortcutsModal } from '@/components/ShortcutsModal'
import { FocusTimer } from '@/components/FocusTimer'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { useKeyboardShortcuts, type Shortcut } from '@/hooks/useKeyboardShortcuts'
import { CONTENT_MODULES } from '@/lib/course'
import { defaultCourseSlug } from '@/lib/coursesRegistry'
import { CourseProvider } from '@/contexts/CourseContext'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { getFocusSnapshot, startWork, pause, resume } from '@/lib/focusStore'

// SearchPalette arrastra todo el contenido del curso (índice). Lazy-load
// para que no entre en el bundle inicial; el chunk se descarga la primera
// vez que el alumno abre la búsqueda con Cmd+K, / o el botón del header.
const SearchPalette = lazy(() =>
  import('@/components/SearchPalette').then(m => ({ default: m.SearchPalette })),
)

// Las páginas se cargan bajo demanda con React.lazy. Esto baja el
// bundle inicial; Vite genera un chunk por página.
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const ModulePage = lazy(() => import('@/pages/ModulePage').then(m => ({ default: m.ModulePage })))
const ProgressPage = lazy(() => import('@/pages/ProgressPage').then(m => ({ default: m.ProgressPage })))
const ExamPage = lazy(() => import('@/pages/ExamPage').then(m => ({ default: m.ExamPage })))
const CertificatePage = lazy(() => import('@/pages/CertificatePage').then(m => ({ default: m.CertificatePage })))
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(m => ({ default: m.SettingsPage })))
const RepasoPage = lazy(() => import('@/pages/RepasoPage').then(m => ({ default: m.RepasoPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const CatalogPage = lazy(() => import('@/pages/CatalogPage').then(m => ({ default: m.CatalogPage })))
const VerifyPage = lazy(() => import('@/pages/VerifyPage').then(m => ({ default: m.VerifyPage })))

// Panel admin Plain Vanilla (Fase R.2). Lazy-load: no entra al bundle del
// alumno normal.
const AdminLayout = lazy(() =>
  import('@/components/AdminLayout').then(m => ({ default: m.AdminLayout })),
)
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })),
)
const AdminOrganizationsListPage = lazy(() =>
  import('@/pages/admin/AdminOrganizationsListPage').then(m => ({
    default: m.AdminOrganizationsListPage,
  })),
)
const AdminOrganizationNewPage = lazy(() =>
  import('@/pages/admin/AdminOrganizationNewPage').then(m => ({
    default: m.AdminOrganizationNewPage,
  })),
)
const AdminOrganizationDetailPage = lazy(() =>
  import('@/pages/admin/AdminOrganizationDetailPage').then(m => ({
    default: m.AdminOrganizationDetailPage,
  })),
)
const AdminSubscriptionNewPage = lazy(() =>
  import('@/pages/admin/AdminSubscriptionNewPage').then(m => ({
    default: m.AdminSubscriptionNewPage,
  })),
)
const AdminUsersListPage = lazy(() =>
  import('@/pages/admin/AdminUsersListPage').then(m => ({
    default: m.AdminUsersListPage,
  })),
)
const AdminCertificatesListPage = lazy(() =>
  import('@/pages/admin/AdminCertificatesListPage').then(m => ({
    default: m.AdminCertificatesListPage,
  })),
)
const AdminCoursesListPage = lazy(() =>
  import('@/pages/admin/AdminCoursesListPage').then(m => ({
    default: m.AdminCoursesListPage,
  })),
)

// Panel admin de organización (Fase R.3).
const OrgAdminLayout = lazy(() =>
  import('@/components/OrgAdminLayout').then(m => ({ default: m.OrgAdminLayout })),
)
const OrgDashboardPage = lazy(() =>
  import('@/pages/org-admin/OrgDashboardPage').then(m => ({ default: m.OrgDashboardPage })),
)
const OrgSeatsListPage = lazy(() =>
  import('@/pages/org-admin/OrgSeatsListPage').then(m => ({ default: m.OrgSeatsListPage })),
)
const OrgSeatsInvitePage = lazy(() =>
  import('@/pages/org-admin/OrgSeatsInvitePage').then(m => ({ default: m.OrgSeatsInvitePage })),
)
const OrgTeamProgressPage = lazy(() =>
  import('@/pages/org-admin/OrgTeamProgressPage').then(m => ({ default: m.OrgTeamProgressPage })),
)

// Basename del router:
//   - Modo offline (`VITE_OFFLINE=1` durante build): vacío para que las
//     rutas SPA funcionen al servir desde cualquier carpeta.
//   - Producción (Vercel sirviendo learn.plainvanilla.ai en raíz): vacío.
//   - Dev local: vacío.
//
// El antiguo deploy a GitHub Pages requería `/agent365-cert-course` como
// basename porque vivía en `plainvanillaesp.github.io/agent365-cert-course/`.
// Tras la migración a Vercel + dominio propio (fase Q), el sitio vive en
// raíz, así que cualquier basename hace que el router no encuentre la URL
// actual y se quede en pantalla blanca.
const basename = ''

/**
 * Fallback de Suspense mientras carga una página. Mantiene el shell
 * (header + sidebar) ya pintado por App; aquí solo el contenido
 * central enseña skeleton.
 */
function PageFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando página"
      className="space-y-6 max-w-[var(--layout-content-max)]"
    >
      <Skeleton width="60%" height="36px" shape="rect" />
      <SkeletonParagraph lines={4} />
      <Skeleton width="100%" height="200px" shape="rect" />
      <SkeletonParagraph lines={3} />
    </div>
  )
}

/**
 * Componente interno que sí está dentro del Router para poder usar
 * los hooks de react-router. Recibe el toggle del sidebar y el setter
 * del modal de atajos.
 */
function AppShell({
  navOpen,
  setNavOpen,
  shortcutsOpen,
  setShortcutsOpen,
  searchOpen,
  setSearchOpen,
}: {
  navOpen: boolean
  setNavOpen: (v: boolean) => void
  shortcutsOpen: boolean
  setShortcutsOpen: (v: boolean) => void
  searchOpen: boolean
  setSearchOpen: (v: boolean) => void
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams<{ id?: string; section?: string }>()

  // Slug y módulo activos derivados de la URL. La ruta canónica es
  // `/cursos/<slug>/modulo/<id>/<section>`. Si la URL no encaja, los
  // atajos relacionados con módulos no hacen nada (los globales sí).
  const urlMatch = location.pathname.match(/^\/cursos\/([^/]+)(?:\/modulo\/(\d+))?/)
  const activeSlug = urlMatch?.[1] ?? defaultCourseSlug()
  const currentModuleId = urlMatch?.[2] ? parseInt(urlMatch[2], 10) : null
  void activeSlug // consumido por <CourseProvider> al rodear AppShell

  const coursePath = (path = '') => {
    const clean = path.replace(/^\/+/, '')
    return `/cursos/${activeSlug}${clean ? '/' + clean : ''}`
  }

  const goToModuleDelta = (delta: number) => {
    if (currentModuleId === null) return
    const ids = CONTENT_MODULES.filter(m => m.estado === 'producido').map(m => m.id)
    const idx = ids.indexOf(currentModuleId)
    if (idx < 0) return
    const next = ids[idx + delta]
    if (next === undefined) return
    const section = params.section ?? 'teoria'
    navigate(coursePath(`modulo/${next}/${section}`))
  }

  // Definición de atajos globales. Algunos solo tienen efecto en
  // determinadas rutas; en otras simplemente no hacen nada (no muestran
  // error). El modal de ayuda los lista todos.
  const shortcuts: Shortcut[] = [
    {
      key: '?',
      shift: true, // '?' requiere shift en el layout US
      description: 'Mostrar esta ayuda',
      group: 'Ayuda',
      handler: () => setShortcutsOpen(true),
    },
    {
      key: 'k',
      meta: true,
      description: 'Buscar en el curso',
      group: 'Ayuda',
      enableInInputs: true,
      handler: () => setSearchOpen(true),
    },
    {
      key: '/',
      description: 'Buscar en el curso',
      group: 'Ayuda',
      handler: () => setSearchOpen(true),
    },
    {
      key: 'g',
      description: 'Ir al inicio',
      group: 'Navegación',
      handler: () => navigate(coursePath()),
    },
    {
      key: 'p',
      description: 'Ir al progreso',
      group: 'Navegación',
      handler: () => navigate(coursePath('progreso')),
    },
    {
      key: 'e',
      description: 'Ir al examen',
      group: 'Navegación',
      handler: () => navigate(coursePath('examen')),
    },
    {
      key: 's',
      description: 'Ir a ajustes',
      group: 'Navegación',
      handler: () => navigate('/ajustes'),
    },
    {
      key: 'R',
      shift: true,
      description: 'Ir al repaso (flashcards)',
      group: 'Navegación',
      handler: () => navigate(coursePath('repaso')),
    },
    {
      key: 'j',
      description: 'Siguiente módulo',
      group: 'En un módulo',
      handler: () => goToModuleDelta(1),
    },
    {
      key: 'k',
      description: 'Módulo anterior',
      group: 'En un módulo',
      handler: () => goToModuleDelta(-1),
    },
    {
      key: 't',
      description: 'Cambiar a Teoría',
      group: 'En un módulo',
      handler: () =>
        currentModuleId !== null && navigate(coursePath(`modulo/${currentModuleId}/teoria`)),
    },
    {
      key: 'q',
      description: 'Cambiar a Quiz',
      group: 'En un módulo',
      handler: () =>
        currentModuleId !== null && navigate(coursePath(`modulo/${currentModuleId}/quiz-practica`)),
    },
    {
      key: 'l',
      description: 'Cambiar a Laboratorios',
      group: 'En un módulo',
      handler: () =>
        currentModuleId !== null && navigate(coursePath(`modulo/${currentModuleId}/laboratorios`)),
    },
    {
      key: 'r',
      description: 'Cambiar a Recursos',
      group: 'En un módulo',
      handler: () =>
        currentModuleId !== null && navigate(coursePath(`modulo/${currentModuleId}/recursos`)),
    },
    {
      key: 'n',
      description: 'Abrir/cerrar el panel de notas',
      group: 'En un módulo',
      handler: () => {
        if (currentModuleId === null) return
        window.dispatchEvent(new CustomEvent('pv-learn:toggle-notes'))
      },
    },
    {
      key: 'i',
      description: 'Modo lectura inmersivo',
      group: 'Vista',
      handler: () => {
        window.dispatchEvent(new CustomEvent('pv-learn:toggle-reading-mode'))
      },
    },
    {
      key: 'f',
      description: 'Modo focus (Pomodoro 25/5)',
      group: 'Vista',
      handler: () => {
        const snap = getFocusSnapshot()
        if (snap.phase === 'idle') startWork()
        else if (snap.running) pause()
        else resume()
      },
    },
    {
      key: 'Escape',
      description: 'Cerrar diálogo o panel lateral',
      group: 'General',
      enableInInputs: true,
      handler: () => {
        if (searchOpen) setSearchOpen(false)
        else if (shortcutsOpen) setShortcutsOpen(false)
        else if (navOpen) setNavOpen(false)
      },
    },
  ]

  useKeyboardShortcuts(shortcuts, [currentModuleId, params.section, navOpen, shortcutsOpen, searchOpen])

  // Shell minimal (sin sidebar y con header simplificado) en cuatro casos:
  //   - alumno sin sesión activa
  //   - estamos en /login
  //   - estamos en /cert/:id (verificación pública, accesible sin auth)
  const { user } = useAuth()
  const isPublicRoute =
    location.pathname === '/login' || location.pathname.startsWith('/cert/')
  const minimal = !user || isPublicRoute

  // Rutas /admin/* usan su propio shell (AdminLayout con header y
  // sidebar admin). No queremos arrastrar el shell del alumno aquí.
  const isAdminRoute = location.pathname.startsWith('/admin')
  if (isAdminRoute) {
    return (
      <RequirePlatformAdmin>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="organizaciones" element={<AdminOrganizationsListPage />} />
              <Route path="organizaciones/nueva" element={<AdminOrganizationNewPage />} />
              <Route path="organizaciones/:slug" element={<AdminOrganizationDetailPage />} />
              <Route
                path="organizaciones/:slug/subscriptions/nueva"
                element={<AdminSubscriptionNewPage />}
              />
              <Route path="usuarios" element={<AdminUsersListPage />} />
              <Route path="cursos" element={<AdminCoursesListPage />} />
              <Route path="certificados" element={<AdminCertificatesListPage />} />
              {/* Catch-all dentro del admin: vuelve al dashboard */}
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </RequirePlatformAdmin>
    )
  }

  // Rutas /org/:slug/admin/* — panel del admin de la organización (Fase R.3).
  // OrgAdminLayout internamente valida que el user sea admin de esa org;
  // si no lo es, redirige a "/" (no necesitamos un HOC RequireOrgAdmin
  // separado).
  const isOrgAdminRoute = /^\/org\/[^/]+\/admin/.test(location.pathname)
  if (isOrgAdminRoute) {
    if (!user) {
      return (
        <Navigate
          to="/login"
          state={{ from: location.pathname + location.search }}
          replace
        />
      )
    }
    return (
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/org/:slug/admin" element={<OrgAdminLayout />}>
            <Route index element={<OrgDashboardPage />} />
            <Route path="seats" element={<OrgSeatsListPage />} />
            <Route path="seats/invitar" element={<OrgSeatsInvitePage />} />
            <Route path="progreso" element={<OrgTeamProgressPage />} />
            <Route path="*" element={<Navigate to="." replace />} />
          </Route>
        </Routes>
      </Suspense>
    )
  }

  return (
    <CourseProvider slug={activeSlug}>
    <div className="min-h-dvh flex flex-col">
      {/*
        Skip link a11y. Solo visible cuando recibe foco con Tab. Permite a
        usuarios de teclado y lectores de pantalla saltarse el header y la
        sidebar para llegar al contenido principal.
      */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:px-3 focus:py-2 focus:rounded-md focus:bg-[var(--color-pv-purple-500)] focus:text-white focus:text-sm focus:font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-pv-purple-500)]"
      >
        Saltar al contenido
      </a>

      <Header
        onMenuToggle={minimal ? undefined : () => setNavOpen(!navOpen)}
        onSearchClick={minimal ? undefined : () => setSearchOpen(true)}
      />
      <div className="flex flex-1 min-h-0">
        {!minimal && <NavSidebar open={navOpen} onClose={() => setNavOpen(false)} />}
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-8 lg:py-10 focus:outline-none"
        >
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Rutas públicas (no requieren sesión) */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cert/:verificationId" element={<VerifyPage />} />

              {/* `/` es el catálogo de cursos asignados al alumno. Si solo
                  hay uno, CatalogPage redirige a su home. */}
              <Route path="/" element={<RequireAuth><CatalogPage /></RequireAuth>} />

              {/* Ajustes del alumno (global, no asociado a un curso) */}
              <Route
                path="/ajustes"
                element={<RequireAuth><SettingsPage /></RequireAuth>}
              />

              {/* Rutas del curso activo. */}
              <Route
                path="/cursos/:slug/*"
                element={
                  <RequireAuth>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="progreso" element={<ProgressPage />} />
                      <Route path="modulo/:id" element={<ModulePage />} />
                      <Route path="modulo/:id/:section" element={<ModulePage />} />
                      <Route path="examen" element={<ExamPage />} />
                      <Route path="certificado/:attemptId" element={<CertificatePage />} />
                      <Route path="repaso" element={<RepasoPage />} />
                      <Route path="*" element={<HomePage />} />
                    </Routes>
                  </RequireAuth>
                }
              />

              {/* Aliases legacy: bookmarks anteriores a Fase 8 siguen vivos. */}
              <Route path="/progreso" element={<DefaultCourseRedirect to="progreso" />} />
              <Route path="/modulo/:id" element={<LegacyModuleRedirect />} />
              <Route path="/modulo/:id/:section" element={<LegacyModuleRedirect />} />
              <Route path="/examen" element={<DefaultCourseRedirect to="examen" />} />
              <Route
                path="/certificado/:attemptId"
                element={<LegacyCertificateRedirect />}
              />
              <Route path="/repaso" element={<DefaultCourseRedirect to="repaso" />} />
              <Route path="*" element={<RequireAuth><CatalogPage /></RequireAuth>} />
            </Routes>
          </Suspense>
        </main>
      </div>

      <ShortcutsModal
        open={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
        shortcuts={shortcuts.filter(s => s.key !== 'Escape')}
      />

      {searchOpen && (
        <Suspense fallback={null}>
          <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}

      {/* Tarjeta flotante del Pomodoro. Se autoesconde si phase === 'idle'. */}
      <FocusTimer />
    </div>
    </CourseProvider>
  )
}

/* --------------------- Gate de autenticación --------------------- */

/**
 * Wrapper que exige sesión activa para renderizar `children`. Si no
 * hay usuario, redirige a `/login` y pasa la ruta original en
 * `state.from` para volver tras el sign-in.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    )
  }
  return <>{children}</>
}

/**
 * Wrapper para rutas /admin/*. Exige sesión + flag platform_admin.
 * Si hay sesión pero no es admin, redirige a la home (no a /login,
 * porque la sesión es válida, simplemente no tiene permisos).
 */
function RequirePlatformAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    )
  }
  if (!user.isPlatformAdmin) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

/* --------------------- Aliases / redirects --------------------- */

/**
 * Redirige a `/cursos/<defaultSlug>/<tail>`. Útil para las rutas
 * legacy sin slug y para `/` mientras no haya catálogo/login.
 */
function DefaultCourseRedirect({ to }: { to: string }) {
  const slug = defaultCourseSlug()
  const clean = to.replace(/^\/+/, '')
  return <Navigate to={`/cursos/${slug}${clean ? '/' + clean : ''}`} replace />
}

function LegacyModuleRedirect() {
  const slug = defaultCourseSlug()
  const { id, section } = useParams<{ id: string; section?: string }>()
  const tail = section ? `${id}/${section}` : `${id}`
  return <Navigate to={`/cursos/${slug}/modulo/${tail}`} replace />
}

function LegacyCertificateRedirect() {
  const slug = defaultCourseSlug()
  const { attemptId } = useParams<{ attemptId: string }>()
  return <Navigate to={`/cursos/${slug}/certificado/${attemptId}`} replace />
}

export function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <ToastProvider>
            <AppShell
              navOpen={navOpen}
              setNavOpen={setNavOpen}
              shortcutsOpen={shortcutsOpen}
              setShortcutsOpen={setShortcutsOpen}
              searchOpen={searchOpen}
              setSearchOpen={setSearchOpen}
            />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
