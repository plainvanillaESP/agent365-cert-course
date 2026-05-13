import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

/**
 * Configuración de Vitest, separada de `vite.config.ts` para no arrastrar
 * los plugins de runtime (PWA, Tailwind, React) al runner de tests.
 *
 * Convenciones:
 *
 *   - Tests unitarios bajo `src/**\/__tests__/*.test.ts` o
 *     `*.test.ts` colocados junto al módulo bajo test.
 *   - Entorno `happy-dom` por defecto: más rápido que jsdom y suficiente
 *     para `lib/highlights` (TreeWalker, Range, DOM mutation). Los
 *     tests puros (srs, search helpers) no se ven afectados.
 *   - Globals activos: `describe`, `it`, `expect` sin import.
 *   - `import.meta.glob` no está disponible en este entorno; los módulos
 *     que dependen de él (coursesRegistry) llevan guardas y devuelven
 *     valores neutros, así que se pueden importar sin reventar.
 */

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      reporter: ['text', 'json-summary'],
      exclude: [
        'src/**/*.test.ts',
        'src/**/*.test.tsx',
        'src/main.tsx',
        'src/i18n/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@content': resolve(__dirname, '..'),
    },
  },
  server: {
    fs: {
      // Permitir importar yaml/md de `cursos/` (que vive fuera de platform/)
      // durante los tests, igual que en dev.
      allow: [resolve(__dirname, '..')],
    },
  },
})
