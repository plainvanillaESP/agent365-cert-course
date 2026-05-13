import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'

// Constantes del curso para inyectar en el manifest. Si en el futuro
// PV-Learn sirve varios cursos desde el mismo dominio (fase 8 multi-curso),
// el manifest se generará dinámicamente; por ahora se centraliza aquí.
const COURSE_NAME = 'Microsoft Agent 365 IT Admin'
const COURSE_SHORT = 'PV-Learn Agent 365'
const COURSE_DESCRIPTION =
  'Curso de certificación profesional sobre Microsoft Agent 365 para administradores IT.'

// https://vite.dev/config/
export default defineConfig({
  // Base path:
  //   - Modo offline (`VITE_OFFLINE=1`): rutas relativas para que el bundle
  //     pueda servirse desde cualquier carpeta o file://
  //   - Producción (Vercel sirviendo learn.plainvanilla.ai): raíz `/`.
  //   - Desarrollo local: `/`.
  base: process.env.VITE_OFFLINE === '1' ? './' : '/',

  plugins: [
    react(),
    tailwindcss(),
    // PWA — service worker + manifest. Solo se activa en build (no en dev),
    // y nunca en el bundle offline (donde no tiene sentido un SW al
    // servirse desde file:// o desde un USB).
    process.env.VITE_OFFLINE === '1'
      ? null
      : VitePWA({
          registerType: 'autoUpdate',
          // En dev preferimos no registrar el SW para no cachear cambios.
          devOptions: { enabled: false },
          includeAssets: [
            'favicon.ico',
            'agent365-logo-256.png',
            'plain-vanilla-imagotipo.png',
          ],
          manifest: {
            name: COURSE_NAME,
            short_name: COURSE_SHORT,
            description: COURSE_DESCRIPTION,
            theme_color: '#9A44E5',
            background_color: '#FAFAF9',
            display: 'standalone',
            lang: 'es-ES',
            scope: '/',
            start_url: '/',
            icons: [
              {
                src: 'agent365-logo-256.png',
                sizes: '256x256',
                type: 'image/png',
                purpose: 'any',
              },
              {
                src: 'agent365-logo-256.png',
                sizes: '256x256',
                type: 'image/png',
                purpose: 'maskable',
              },
            ],
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,svg,png,jpg,ico,webmanifest,woff,woff2}'],
            maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
            // Rutas SPA: cualquier path desconocido se sirve con el
            // index.html cacheado para que el router del cliente lo
            // resuelva. La denylist excluye assets y el SW.
            navigateFallback: '/index.html',
            navigateFallbackDenylist: [/^\/api\//, /\/sw\.js$/, /\/assets\//],
            cleanupOutdatedCaches: true,
          },
        }),
  ].filter(Boolean),

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
