# E2E tests para PV-Learn

Cómo ejecutar:

```bash
# Una vez: descargar el browser
npm run test:e2e:install

# Cada vez:
npm run test:e2e
```

Si el server ya está corriendo en :5173, Playwright lo reutiliza. Si no,
arranca `npm run dev` automáticamente.

Tests en `critical-flow.spec.ts` cubren: login, navegación a teoría,
cambio entre tabs, atajos de teclado (`?`, `i`), logout desde ajustes.
