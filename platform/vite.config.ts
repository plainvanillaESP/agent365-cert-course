import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'node:path'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { load as parseYaml } from 'js-yaml'

/**
 * Resuelve los metadatos del curso por defecto leyéndolos del `course.yaml`.
 *
 * El "curso por defecto" es el primero por orden alfabético de slug que no
 * sea `demo-*`. Esa misma lógica vive en `lib/coursesRegistry.ts` (a nivel
 * de runtime). Aquí la repetimos a nivel de build porque el plugin PWA
 * necesita el manifest serializado en el bundle.
 *
 * Si en el futuro PV-Learn sirve varios cursos desde el mismo dominio y
 * cada uno necesita su propio manifest, habrá que generar manifests por
 * curso (uno cada `/cursos/<slug>/manifest.webmanifest`); pero para el
 * arranque comercial con un único producto principal, el manifest del
 * curso default es suficiente.
 */
function loadDefaultCourseMetadata(): {
  name: string
  shortName: string
  description: string
  lang: string
} {
  const cursosDir = resolve(__dirname, '..', 'cursos')

  // Primer curso (excluyendo demos) por orden alfabético.
  const slugs = readdirSync(cursosDir)
    .filter(s => !s.startsWith('.') && !s.startsWith('demo-'))
    .filter(s => statSync(resolve(cursosDir, s)).isDirectory())
    .sort()

  if (slugs.length === 0) {
    throw new Error('No course found in cursos/ (excluding demos)')
  }

  const yamlPath = resolve(cursosDir, slugs[0], 'course.yaml')
  const data = parseYaml(readFileSync(yamlPath, 'utf-8')) as Record<string, unknown>

  const name = String(data.nombre ?? 'PV-Learn')
  const shortName = String(data.nombre_corto ?? name)
  const description = String(data.descripcion_corta ?? '')
  const lang = String(data.idioma ?? 'es-ES')

  return { name, shortName, description, lang }
}

const courseMeta = loadDefaultCourseMetadata()

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
            name: courseMeta.name,
            short_name: courseMeta.shortName,
            description: courseMeta.description,
            theme_color: '#9A44E5',
            background_color: '#FAFAF9',
            display: 'standalone',
            lang: courseMeta.lang,
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
            // skipWaiting + clientsClaim: cuando hay una nueva versión
            // del SW, toma el control inmediatamente sin esperar al
            // siguiente reload. Es lo que evita que un usuario se quede
            // bloqueado en un bundle obsoleto tras un deploy con bugfix
            // crítico (caso de los race conditions en RequireAuth post
            // PR #81). Trade-off: cualquier estado en memoria de la
            // versión vieja se descarta. Aceptable porque la app es
            // mayormente stateless del lado SW.
            skipWaiting: true,
            clientsClaim: true,
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
    // Sourcemaps en producción: permiten ver el archivo/línea real cuando
    // un usuario reporta un error desde el ErrorBoundary. El bundle gana
    // ~10-15% en tamaño de assets servidos, pero el JS minificado en sí
    // no cambia; solo se publican los archivos .map adicionales que el
    // navegador descarga solo cuando hay DevTools abierto o cuando un
    // error tiene una stack que apunta a un sourcemap conocido. En
    // producción real para muchos clientes podríamos cambiar a
    // 'hidden' (los .map se generan pero el navegador no los descarga),
    // pero para depurar issues ahora preferimos visibles.
    sourcemap: true,
  },
})
