import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  // Base path:
  //   - Modo offline (`VITE_OFFLINE=1`): rutas relativas para que el bundle
  //     pueda servirse desde cualquier carpeta o file://
  //   - Producción GitHub Pages: /agent365-cert-course/
  //   - Desarrollo local: /
  base:
    process.env.VITE_OFFLINE === '1'
      ? './'
      : process.env.NODE_ENV === 'production'
        ? '/agent365-cert-course/'
        : '/',

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
      // Permitir leer archivos fuera de platform/ (cursos/, docs/, etc.)
      allow: [resolve(__dirname, '..')],
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
