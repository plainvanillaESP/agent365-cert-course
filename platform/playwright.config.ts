import { defineConfig, devices } from '@playwright/test'

/**
 * Configuración Playwright para los tests E2E de PV-Learn.
 *
 *   - Por defecto, ejecuta solo en Chromium para que CI sea rápido.
 *     Webkit/Firefox se pueden añadir luego cuando haya budget de CI.
 *   - `webServer` arranca `npm run dev` antes de los tests y lo mata
 *     al terminar. `reuseExistingServer` permite ejecutar contra un
 *     dev server ya corriendo en local.
 *   - Tests bajo `e2e/`. No se mezclan con los tests unitarios de
 *     vitest (que viven en `src/**\/*.test.ts`).
 */

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
