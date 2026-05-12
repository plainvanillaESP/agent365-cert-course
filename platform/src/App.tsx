import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { NavSidebar } from '@/components/NavSidebar'
import { HomePage } from '@/pages/HomePage'
import { ModulePage } from '@/pages/ModulePage'
import { ProgressPage } from '@/pages/ProgressPage'
import { ExamPage } from '@/pages/ExamPage'
import { CertificatePage } from '@/pages/CertificatePage'
import { SettingsPage } from '@/pages/SettingsPage'

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

export function App() {
  const [navOpen, setNavOpen] = useState(false)

  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-dvh flex flex-col">
        <Header onMenuToggle={() => setNavOpen(o => !o)} />
        <div className="flex flex-1 min-h-0">
          <NavSidebar open={navOpen} onClose={() => setNavOpen(false)} />
          <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 py-8 lg:py-10">
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
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
