import { lazy, Suspense, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom'
import { Header } from '@/components/Header'
import { NavSidebar } from '@/components/NavSidebar'
import { Skeleton, SkeletonParagraph } from '@/components/Skeleton'
import { ShortcutsModal } from '@/components/ShortcutsModal'
import { useKeyboardShortcuts, type Shortcut } from '@/hooks/useKeyboardShortcuts'
import { CONTENT_MODULES } from '@/lib/course'

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

// Basename del router:
//   - Modo offline (`VITE_OFFLINE` activo durante build): vacío para que las
//     rutas SPA funcionen al servir desde cualquier carpeta.
//   - Producción GitHub Pages: /agent365-cert-course
//   - Dev: vacío.
const basename =
  import.meta.env.VITE_OFFLINE === '1'
    ? ''
    : import.meta.env.PROD
      ? '/agent365-cert-course'
      : ''

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

  // Helpers para navegar al módulo siguiente/anterior cuando estamos
  // dentro de uno. Si no estamos en /modulo, los atajos no hacen nada.
  const currentModuleId = (() => {
    const m = location.pathname.match(/^\/modulo\/(\d+)/)
    return m ? parseInt(m[1], 10) : null
  })()

  const goToModuleDelta = (delta: number) => {
    if (currentModuleId === null) return
    const ids = CONTENT_MODULES.filter(m => m.estado === 'producido').map(m => m.id)
    const idx = ids.indexOf(currentModuleId)
    if (idx < 0) return
    const next = ids[idx + delta]
    if (next === undefined) return
    const section = params.section ?? 'teoria'
    navigate(`/modulo/${next}/${section}`)
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
      handler: () => navigate('/'),
    },
    {
      key: 'p',
      description: 'Ir al progreso',
      group: 'Navegación',
      handler: () => navigate('/progreso'),
    },
    {
      key: 'e',
      description: 'Ir al examen',
      group: 'Navegación',
      handler: () => navigate('/examen'),
    },
    {
      key: 's',
      description: 'Ir a ajustes',
      group: 'Navegación',
      handler: () => navigate('/ajustes'),
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
      handler: () => currentModuleId !== null && navigate(`/modulo/${currentModuleId}/teoria`),
    },
    {
      key: 'q',
      description: 'Cambiar a Quiz',
      group: 'En un módulo',
      handler: () => currentModuleId !== null && navigate(`/modulo/${currentModuleId}/quiz-practica`),
    },
    {
      key: 'l',
      description: 'Cambiar a Laboratorios',
      group: 'En un módulo',
      handler: () => currentModuleId !== null && navigate(`/modulo/${currentModuleId}/laboratorios`),
    },
    {
      key: 'r',
      description: 'Cambiar a Recursos',
      group: 'En un módulo',
      handler: () => currentModuleId !== null && navigate(`/modulo/${currentModuleId}/recursos`),
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

  return (
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

      <Header onMenuToggle={() => setNavOpen(!navOpen)} onSearchClick={() => setSearchOpen(true)} />
      <div className="flex flex-1 min-h-0">
        <NavSidebar open={navOpen} onClose={() => setNavOpen(false)} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-8 lg:py-10 focus:outline-none"
        >
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/progreso" element={<ProgressPage />} />
              <Route path="/modulo/:id" element={<ModulePage />} />
              <Route path="/modulo/:id/:section" element={<ModulePage />} />
              <Route path="/examen" element={<ExamPage />} />
              <Route path="/certificado/:attemptId" element={<CertificatePage />} />
              <Route path="/ajustes" element={<SettingsPage />} />
              <Route path="*" element={<HomePage />} />
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
    </div>
  )
}

export function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <BrowserRouter basename={basename}>
      <AppShell
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        shortcutsOpen={shortcutsOpen}
        setShortcutsOpen={setShortcutsOpen}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />
    </BrowserRouter>
  )
}
