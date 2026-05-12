/**
 * Convenciones de storage keys para PV-Learn.
 *
 * Hasta la Fase 8 los hooks usaban el prefijo legacy `agent365-…`,
 * que pegaba el shell al curso de Agent 365. Ahora hay dos prefijos:
 *
 *   - **`pv-learn-{slug}-…`**: datos asociados al curso (progreso,
 *     historial de quiz/lab, notas, highlights, flashcards, etc.).
 *     Permite servir varios cursos desde el mismo dominio sin colisión.
 *
 *   - **`pv-learn-{detail}`**: preferencias globales del alumno que
 *     no dependen del curso (modo lectura, contadores del Pomodoro,
 *     nombre guardado para certificados — sirve para todos los
 *     cursos del alumno).
 *
 * Los hooks consumen `useCourseStorageKey()` o `globalStorageKey()`
 * para construir las claves de manera consistente.
 *
 * Nota: la audiencia actual es interna, así que NO migramos las claves
 * legacy. Si alguna vez se hace pública la versión Agent 365, conviene
 * añadir un step one-shot que renombre `agent365-*` → `pv-learn-agent365-cert-*`.
 */

import { useCourse } from '@/contexts/CourseContext'
import { defaultCourseSlug } from '@/lib/coursesRegistry'

/**
 * Slug del curso activo a nivel de módulo. CourseProvider lo
 * actualiza al montarse para que código fuera de React (lib/progress,
 * eventos custom, callbacks) pueda construir storage keys correctas
 * sin propagar el slug manualmente. Antes de la primera asignación
 * cae al defaultCourseSlug del registry.
 */
let _activeSlug: string | null = null

export function setActiveCourseSlug(slug: string): void {
  _activeSlug = slug
}

export function activeCourseSlug(): string {
  return _activeSlug ?? defaultCourseSlug()
}

/**
 * Construye una storage key para el curso activo, p.ej.
 * `useCourseStorageKey('notes-m9')` → `'pv-learn-agent365-cert-notes-m9'`.
 *
 * Como es un hook, solo puede llamarse en componentes que viven bajo
 * `<CourseProvider>` (es decir, cualquier página dentro de
 * `/cursos/:slug/*`). Los hooks per-course (useNotes, useQuizState,
 * useHighlights, useFlashcards…) lo usan internamente.
 */
export function useCourseStorageKey(detail: string): string {
  const { course } = useCourse()
  return `pv-learn-${course.slug}-${detail}`
}

/**
 * Versión imperativa para tests / código sin React. Si el caller ya
 * conoce el slug del curso (porque lo lee de la URL o tiene un context
 * cerca), puede construir la key directamente.
 */
export function courseStorageKey(slug: string, detail: string): string {
  return `pv-learn-${slug}-${detail}`
}

/**
 * Preferencia o estado global del alumno, no asociado a un curso.
 */
export function globalStorageKey(detail: string): string {
  return `pv-learn-${detail}`
}
