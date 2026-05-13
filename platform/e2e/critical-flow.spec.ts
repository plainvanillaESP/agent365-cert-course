import { test, expect } from '@playwright/test'

/**
 * Flujo crítico del alumno: login → entrar al curso → leer teoría →
 * abrir quiz → cerrar sesión.
 *
 * Cada `test()` empieza limpio (Playwright resetea el storage entre
 * tests por defecto), así que cada paso es independiente.
 */

test.describe('flujo crítico del alumno', () => {
  test('login local arranca sesión y redirige al catálogo', async ({ page }) => {
    await page.goto('/')
    // Sin sesión, RequireAuth redirige a /login
    await expect(page).toHaveURL(/\/login$/)

    await page.getByLabel('Email').fill('test@example.com')
    await page.getByLabel(/Nombre/).fill('Tester')
    await page.getByRole('button', { name: 'Entrar' }).click()

    // Con un solo curso asignado (Agent 365), CatalogPage redirige a su home.
    // Con dos cursos disponibles (también está demo-pv-learn), muestra
    // el catálogo. Aceptamos cualquiera de las dos URLs.
    await expect(page).toHaveURL(/^\/(?:cursos\/[^/]+|$)/)
  })

  test('header muestra el título del curso una vez dentro', async ({ page }) => {
    await page.goto('/cursos/agent365-cert/')
    // Sin sesión, redirige a /login. Hacemos sign-in primero.
    if (page.url().includes('/login')) {
      await page.getByLabel('Email').fill('a@b.com')
      await page.getByRole('button', { name: 'Entrar' }).click()
    }
    await page.waitForURL(/\/cursos\/agent365-cert/)
    await expect(page.getByText('Microsoft Agent 365 IT Admin')).toBeVisible()
  })

  test('navega a teoría del módulo 1 y ve el contenido', async ({ page }) => {
    // Sign-in primero.
    await page.goto('/login')
    await page.getByLabel('Email').fill('a@b.com')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await page.goto('/cursos/agent365-cert/modulo/1/teoria')
    await expect(page.locator('article.markdown-body')).toBeVisible()
    // El módulo 1 tiene un H1 con "Módulo 01" o el título.
    await expect(page.locator('article.markdown-body h1, h1')).toContainText(/Módulo|Microsoft/i)
  })

  test('cambia entre teoría y quiz manteniendo el módulo', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('a@b.com')
    await page.getByRole('button', { name: 'Entrar' }).click()

    await page.goto('/cursos/agent365-cert/modulo/1/teoria')
    await page.getByRole('link', { name: /Práctica|Quiz/ }).first().click()
    await expect(page).toHaveURL(/\/modulo\/1\/quiz-practica/)
  })

  test('atajo de teclado `?` abre el modal de ayuda', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('a@b.com')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForURL(/\/cursos\//)
    await page.keyboard.press('Shift+?')
    await expect(page.getByText('Atajos de teclado')).toBeVisible()
  })

  test('toggle modo lectura aplica data-reading-mode al <html>', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('a@b.com')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForURL(/\/cursos\//)

    await page.keyboard.press('i')
    await expect(page.locator('html')).toHaveAttribute('data-reading-mode', 'on')
    await page.keyboard.press('i')
    await expect(page.locator('html')).not.toHaveAttribute('data-reading-mode', 'on')
  })

  test('logout desde ajustes borra la sesión y redirige a /login', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('a@b.com')
    await page.getByRole('button', { name: 'Entrar' }).click()
    await page.waitForURL(/\/cursos\//)

    await page.goto('/ajustes')
    // Aceptar confirm() automáticamente.
    page.once('dialog', d => d.accept())
    await page.getByRole('button', { name: /Cerrar sesión/ }).click()
    await expect(page).toHaveURL(/\/login/)
  })
})
