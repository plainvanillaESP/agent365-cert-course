import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from '@/components/Header'
import { HomePage } from '@/pages/HomePage'
import { ModulePage } from '@/pages/ModulePage'

// El basename se ajusta automáticamente en producción para GitHub Pages
const basename = import.meta.env.PROD ? '/agent365-cert-course' : ''

export function App() {
  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-dvh flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/modulo/:id" element={<ModulePage />} />
            <Route path="/modulo/:id/:section" element={<ModulePage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
