import { StrictMode } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n' // Configura i18next antes de renderizar la app.
import { App } from './App'

// Auditoría a11y con `@axe-core/react` solo en desarrollo. Reporta a la
// consola las violaciones que detecta tras cada render. No entra en el
// bundle de producción (la guardia de `import.meta.env.DEV` queda dead
// code y Rollup la purga).
if (import.meta.env.DEV) {
  void import('@axe-core/react').then(({ default: axe }) => {
    // 1000 ms de debounce para no flooding la consola en cada render.
    void axe(React, ReactDOM, 1000)
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
