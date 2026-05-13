#!/usr/bin/env node
/**
 * Bundle-size budget de PV-Learn.
 *
 * Comprueba que el bundle inicial (el `index-*.js` que el navegador
 * descarga al cargar `/`) y el CSS de entrada quedan por debajo de
 * límites razonables. Si alguno excede, el script falla con código 1
 * y CI bloquea el merge.
 *
 * Los chunks "lazy" (ModulePage, ExamPage, mermaid, katex, etc.) NO se
 * cuentan: el alumno solo los descarga cuando entra en la ruta o la
 * sección correspondiente, así que su tamaño es coste deferred y no
 * afecta al time-to-interactive del primer paint.
 *
 * Si genuinamente necesitas subir el techo (por ejemplo, añadir una
 * librería core nueva), edita `BUDGETS` y justifícalo en el commit.
 */

import { readdirSync, statSync, readFileSync } from 'node:fs'
import { gzipSync } from 'node:zlib'
import { join } from 'node:path'

const DIST_ASSETS = join(process.cwd(), 'dist', 'assets')

const BUDGETS = {
  // El index-*.js es el bundle inicial: arranca la SPA + carga el resto
  // bajo demanda. Hoy contiene React + react-router + i18next + lucide
  // tree-shaken + AuthProvider + CourseProvider + Header + NavSidebar +
  // FocusTimer + utilidades de estado. Reservamos margen de 30 kB
  // sobre la línea base actual (≈ 255 kB) antes de fallar.
  //
  // Si genuinamente necesitas más espacio (por ejemplo, añades una
  // librería core nueva), justifica el cambio en el commit. Si está
  // creciendo sin motivo, es señal de que algo dejó de ser lazy.
  initialJsGzip: 290 * 1024,
  // CSS de entrada: Tailwind + tokens + reglas del shell. 30 kB gzip
  // sobrado para lo que tenemos.
  initialCssGzip: 30 * 1024,
}

/** Devuelve [filename, sizeBytes, gzipBytes] de los assets que matchean prefix. */
function findAssetsByPrefix(prefix, ext) {
  const out = []
  for (const f of readdirSync(DIST_ASSETS)) {
    if (!f.startsWith(prefix) || !f.endsWith(ext)) continue
    const full = join(DIST_ASSETS, f)
    const size = statSync(full).size
    const gz = gzipSync(readFileSync(full)).length
    out.push({ file: f, size, gz })
  }
  return out
}

function fmt(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`
}

function check(label, actual, budget) {
  const ok = actual <= budget
  const icon = ok ? '✓' : '✗'
  console.log(`  ${icon} ${label}: ${fmt(actual)} (budget ${fmt(budget)})`)
  return ok
}

console.log()
console.log('  PV-Learn — bundle-size budget')
console.log()

const indexJs = findAssetsByPrefix('index-', '.js')
const indexCss = findAssetsByPrefix('index-', '.css')

if (indexJs.length === 0) {
  console.error('  ERROR: no se encontró index-*.js en dist/assets/. ¿Hiciste npm run build?')
  process.exit(1)
}

const totalInitialJs = indexJs.reduce((s, a) => s + a.gz, 0)
const totalInitialCss = indexCss.reduce((s, a) => s + a.gz, 0)

const okJs = check('Initial JS (gzip)', totalInitialJs, BUDGETS.initialJsGzip)
const okCss = check('Initial CSS (gzip)', totalInitialCss, BUDGETS.initialCssGzip)

console.log()
console.log(`  Detalle:`)
for (const a of [...indexJs, ...indexCss]) {
  console.log(`    ${a.file}: raw ${fmt(a.size)} · gzip ${fmt(a.gz)}`)
}
console.log()

if (!okJs || !okCss) {
  console.error('  FAILED — algún recurso excede el budget.')
  console.error('  Si está justificado, ajusta BUDGETS en scripts/check-bundle-budget.mjs')
  console.error('  con un mensaje claro en el commit.')
  process.exit(1)
}

console.log('  Resultado: OK')
console.log()
