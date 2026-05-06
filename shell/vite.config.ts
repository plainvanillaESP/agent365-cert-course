import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // Base path: /agent365-cert-course/ en producción (GitHub Pages),
  // / en desarrollo local
  base: process.env.NODE_ENV === 'production' ? '/agent365-cert-course/' : '/',

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      // Alias para acceder al contenido markdown del repo
      '@content': resolve(__dirname, '..'),
    },
  },

  server: {
    fs: {
      // Permitir leer archivos fuera de shell/ (modulos/, docs/, etc.)
      allow: [resolve(__dirname, '..')],
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
