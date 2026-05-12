#!/usr/bin/env node
/**
 * Smoke test runtime del flujo del examen final.
 *
 * Verifica:
 *   1. El banco se parsea a 60 preguntas EX-NN-NNN bien formadas.
 *   2. La distribución por área cuadra con los pesos canónicos del curso.
 *   3. Todos los tipos de pregunta del parser están representados.
 *   4. `selectFromBank` con la misma seed produce el mismo orden.
 *   5. `selectFromBank` con seeds distintas produce orden distinto.
 *   6. `scoreExam` con todas correctas devuelve 100 % y passed=true.
 *   7. `scoreExam` con ninguna correcta devuelve 0 % y passed=false.
 *   8. `scoreExam` justo en el umbral (42/60) devuelve passed=true.
 *   9. `scoreExam` por debajo del umbral (41/60) devuelve passed=false.
 *  10. `EXAM_NUM_QUESTIONS` (60) cuadra con `examen_final.numero_preguntas`
 *      de `course.yaml`.
 *
 * Ejecutar con: npx tsx scripts/test-exam-runtime.mts
 * Falla con código 1 si algún check no pasa.
 */

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import yaml from 'js-yaml'
import { parseQuizMarkdown } from '../src/lib/quiz-parser.ts'
import { selectFromBank, scoreExam, EXAM_NUM_QUESTIONS, EXAM_PASS_PCT } from '../src/lib/exam.ts'

const ROOT = resolve(import.meta.dirname, '..', '..')
const BANCO = resolve(ROOT, 'cursos/agent365-cert/banco-examen.md')
const COURSE_YAML = resolve(ROOT, 'cursos/agent365-cert/course.yaml')

type Report = { ok: number; fail: number; failures: string[] }
const report: Report = { ok: 0, fail: 0, failures: [] }

function check(name: string, ok: boolean, detail = ''): void {
  if (ok) {
    report.ok++
    console.log(`  OK   ${name}${detail ? ' — ' + detail : ''}`)
  } else {
    report.fail++
    report.failures.push(name + (detail ? ' — ' + detail : ''))
    console.log(`  FAIL ${name}${detail ? ' — ' + detail : ''}`)
  }
}

console.log()
console.log('  Agent 365 — Smoke test runtime del examen final')
console.log()

// 1. Banco a 60 preguntas
const banco = parseQuizMarkdown(readFileSync(BANCO, 'utf-8'), 0)
check('banco tiene 60 preguntas', banco.length === 60, `actual=${banco.length}`)

// 2. Distribución por área canónica
const expectedDistribution: Record<number, number> = { 1: 9, 2: 18, 3: 9, 4: 12, 5: 12 }
const actualDistribution: Record<number, number> = {}
for (const q of banco) actualDistribution[q.area] = (actualDistribution[q.area] ?? 0) + 1
for (const [areaStr, expected] of Object.entries(expectedDistribution)) {
  const areaId = Number(areaStr)
  check(
    `area ${areaId} tiene ${expected} preguntas`,
    actualDistribution[areaId] === expected,
    `actual=${actualDistribution[areaId] ?? 0}`,
  )
}

// 3. Tipos representados
const expectedTypes = ['multiple-choice', 'multiple-response', 'scenario', 'drag-and-drop', 'ordering']
for (const t of expectedTypes) {
  const count = banco.filter(q => q.type === t).length
  check(`tipo ${t} representado`, count > 0, `count=${count}`)
}

// 4. selectFromBank reproducible con misma seed
const sel1 = selectFromBank(banco, EXAM_NUM_QUESTIONS, 42)
const sel2 = selectFromBank(banco, EXAM_NUM_QUESTIONS, 42)
check(
  'selectFromBank con misma seed produce el mismo orden',
  sel1.map(q => q.id).join(',') === sel2.map(q => q.id).join(','),
)

// 5. Seeds distintas producen orden distinto
const sel3 = selectFromBank(banco, EXAM_NUM_QUESTIONS, 999)
check(
  'selectFromBank con seeds distintas produce orden distinto',
  sel1.map(q => q.id).join(',') !== sel3.map(q => q.id).join(','),
)

// 5b. Tamaño correcto
check('selección tiene el tamaño pedido', sel1.length === EXAM_NUM_QUESTIONS, `actual=${sel1.length}`)

// 6. scoreExam todo correcto
const allCorrect: Record<string, boolean> = Object.fromEntries(sel1.map(q => [q.id, true]))
const r6 = scoreExam(sel1, allCorrect)
check('scoreExam todo correcto: 100% passed', r6.pct === 100 && r6.passed === true && r6.score === 60)

// 7. scoreExam nada correcto
const noneCorrect: Record<string, boolean> = Object.fromEntries(sel1.map(q => [q.id, false]))
const r7 = scoreExam(sel1, noneCorrect)
check('scoreExam ninguna correcta: 0% failed', r7.pct === 0 && r7.passed === false && r7.score === 0)

// 8. scoreExam justo en umbral 42/60 = 70%
const thresholdPass: Record<string, boolean> = {}
sel1.forEach((q, i) => {
  thresholdPass[q.id] = i < 42
})
const r8 = scoreExam(sel1, thresholdPass)
check(
  'scoreExam 42/60 justo en umbral: passed',
  r8.score === 42 && r8.pct === 70 && r8.passed === true,
  `score=${r8.score} pct=${r8.pct} passed=${r8.passed}`,
)

// 9. scoreExam por debajo del umbral 41/60
const belowThreshold: Record<string, boolean> = {}
sel1.forEach((q, i) => {
  belowThreshold[q.id] = i < 41
})
const r9 = scoreExam(sel1, belowThreshold)
check(
  'scoreExam 41/60 por debajo del umbral: failed',
  r9.score === 41 && r9.passed === false,
  `score=${r9.score} pct=${r9.pct} passed=${r9.passed}`,
)

// 10. EXAM_NUM_QUESTIONS coincide con course.yaml
const courseRaw = readFileSync(COURSE_YAML, 'utf-8')
const courseData = yaml.load(courseRaw) as { examen_final?: { numero_preguntas?: number; puntaje_aprobado_pct?: number } }
check(
  'EXAM_NUM_QUESTIONS coincide con course.yaml > examen_final.numero_preguntas',
  EXAM_NUM_QUESTIONS === courseData.examen_final?.numero_preguntas,
  `lib=${EXAM_NUM_QUESTIONS} course.yaml=${courseData.examen_final?.numero_preguntas}`,
)
check(
  'EXAM_PASS_PCT coincide con course.yaml > examen_final.puntaje_aprobado_pct',
  EXAM_PASS_PCT === courseData.examen_final?.puntaje_aprobado_pct,
  `lib=${EXAM_PASS_PCT} course.yaml=${courseData.examen_final?.puntaje_aprobado_pct}`,
)

// 11. Breakdown por área en scoreExam
check(
  'scoreExam reporta breakdown por área',
  Array.isArray(r6.byArea) && r6.byArea.length === 5,
  `areas=${r6.byArea.length}`,
)
// Sumar correctos del breakdown debe igual al score total
const sumByArea = r6.byArea.reduce((s, a) => s + a.correct, 0)
check(
  'suma de aciertos por área = score total',
  sumByArea === r6.score,
  `byArea=${sumByArea} score=${r6.score}`,
)

console.log()
console.log(`  Resultado: ${report.ok} OK · ${report.fail} FAIL`)
if (report.fail > 0) {
  console.log()
  console.log('  Fallos:')
  for (const f of report.failures) console.log('    -', f)
  process.exit(1)
}
console.log()
process.exit(0)
