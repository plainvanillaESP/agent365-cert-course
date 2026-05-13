/**
 * Compatibilidad y atajos al curso "por defecto" de PV-Learn.
 *
 * Hasta la fase de multi-curso (Fase 8), este archivo definía
 * estáticamente todos los metadatos del curso Agent 365. Ahora delega
 * en `lib/coursesRegistry.ts`, que carga dinámicamente los cursos
 * disponibles en `cursos/<slug>/course.yaml` y los módulos en
 * `cursos/<slug>/modulos/<m>/module.yaml`.
 *
 * Convenciones:
 *
 *   - **`useCourse()`** (hook) es la API recomendada para componentes
 *     que necesitan los datos del curso activo en tiempo de
 *     renderizado, basado en el `:slug` de la URL.
 *
 *   - Las exportaciones de esta archivo (`COURSE_TITLE`, `MODULES`,
 *     `AREAS`, `findModule`, etc.) son una **vista del curso por
 *     defecto**, conservadas para no romper componentes que aún no
 *     usan el hook. Cuando el usuario navegue a `/cursos/<slug>/...`,
 *     el provider sobreescribe estos valores en context y los
 *     componentes que sí usan el hook reciben el curso correcto.
 *
 *   - El `defaultCourseSlug()` se calcula del registry. Para fijar uno
 *     concreto en un deployment, cambiar `cursos/<slug>/course.yaml`
 *     (o configurar un orden en el registry si llega un futuro
 *     deployment multi-curso real).
 */

import {
  defaultCourseSlug,
  getCourse,
  contentModules as registryContentModules,
  examModule as registryExamModule,
  findModule as registryFindModule,
  getAreaForModule as registryGetAreaForModule,
  formatDuration as registryFormatDuration,
  type CourseData,
} from './coursesRegistry'

export type { ModuleStatus, CourseArea, CourseModule } from './coursesRegistry'
export { formatDuration } from './coursesRegistry'

/* ---------------------- Curso por defecto ----------------------- */

const _defaultSlug = defaultCourseSlug()
const _defaultCourse: CourseData | undefined = getCourse(_defaultSlug)

if (!_defaultCourse) {
  // Esto solo ocurriría si no hay ningún curso en `cursos/`. En ese
  // caso, los exports caen a placeholders neutros para no romper el
  // bundle, pero la app no será funcional hasta que haya al menos un
  // course.yaml válido.
  console.error('[course] No se encontró ningún curso en el registry.')
}

/* ----------------------- Metadatos del curso por defecto ----------------------- */

export const COURSE_SLUG = _defaultCourse?.slug ?? _defaultSlug
export const STORAGE_PREFIX = `pv-learn-${COURSE_SLUG}`

export const COURSE_TITLE = _defaultCourse?.shortTitle ?? 'PV-Learn'
export const COURSE_EYEBROW = `${_defaultCourse?.editor ?? 'Plain Vanilla Solutions'} · Curso de certificación`
export const COURSE_DESCRIPTION = _defaultCourse?.description ?? ''
export const COURSE_LOGO = 'agent365-logo-256.png' // sigue siendo asset estático del shell

export const COURSE_CERT_TITLE = _defaultCourse?.certificateTitle ?? COURSE_TITLE
export const COURSE_CERT_LEGAL_NAME = _defaultCourse?.certificateLegalName ?? COURSE_TITLE

export const COURSE_EXAM_TITLE = 'Examen de certificación'
export const COURSE_EXAM_INTRO =
  'Pon a prueba lo aprendido en los módulos del curso. El examen está cronometrado y simula las condiciones de una certificación profesional.'

/* ----------------------- Listas derivadas del curso por defecto ----------------------- */

import type { CourseArea, CourseModule } from './coursesRegistry'

// Fallback estático para entornos sin Vite (ej. `npm run test:exam` con
// Node puro, donde `import.meta.glob` no existe y el registry no puede
// descubrir los YAML del curso). Estos valores son idénticos a los del
// course.yaml de agent365-cert; cuando ese yaml cambie, hay que
// actualizar aquí también. Si en el browser el registry encuentra el
// curso, los exports usan ese y este fallback queda sin uso.
const FALLBACK_AREAS: CourseArea[] = [
  { id: 1, nombre: 'Plan and configure Microsoft Agent 365', nombreEs: 'Planificación y configuración', pesoExamen: 15, modulos: [1, 2, 3, 4, 5] },
  { id: 2, nombre: 'Manage agent identities with Microsoft Entra Agent ID', nombreEs: 'Identidades de agentes con Entra Agent ID', pesoExamen: 30, modulos: [6, 9] },
  { id: 3, nombre: 'Manage the agent registry and lifecycle', nombreEs: 'Registry y ciclo de vida', pesoExamen: 15, modulos: [7, 8] },
  { id: 4, nombre: 'Implement data protection with Microsoft Purview', nombreEs: 'Protección de datos con Purview', pesoExamen: 20, modulos: [10, 11] },
  { id: 5, nombre: 'Monitor, investigate and govern', nombreEs: 'Monitorización, investigación y gobernanza', pesoExamen: 20, modulos: [12, 13, 14, 15, 16] },
]

export const AREAS: CourseArea[] = _defaultCourse?.areas.length ? _defaultCourse.areas : FALLBACK_AREAS
export const MODULES: CourseModule[] = _defaultCourse?.modules ?? []

export const COURSE_TOTAL_MIN = _defaultCourse
  ? registryContentModules(_defaultCourse).reduce((sum, m) => sum + m.duracionMin, 0)
  : 0
export const COURSE_EXAM_MIN = _defaultCourse?.examMinutes ?? 90

export const CONTENT_MODULES: CourseModule[] = _defaultCourse
  ? registryContentModules(_defaultCourse)
  : []

// Fallback: si el curso no declara módulo de examen, devuelve el
// último módulo de la lista para mantener la firma no-nullable (los
// consumers actuales asumen que siempre hay examen).
export const EXAM_MODULE: CourseModule = _defaultCourse
  ? (registryExamModule(_defaultCourse) ?? _defaultCourse.modules[_defaultCourse.modules.length - 1])
  : ({
      id: 0,
      slug: 'noop',
      titulo: 'Sin examen',
      duracionMin: 0,
      areaExamen: 0,
      estado: 'pendiente' as const,
      faseProduccion: 0,
      preguntas: 0,
    })

export const COURSE_TOTAL_QUESTIONS = CONTENT_MODULES.reduce((sum, m) => sum + m.preguntas, 0)

export const COURSE_START_PATH = `/modulo/${CONTENT_MODULES[0]?.id ?? 1}/teoria`

/* ----------------------- Helpers retrocompatibles ----------------------- */

export function findModule(id: number | string): CourseModule | undefined {
  if (!_defaultCourse) return undefined
  return registryFindModule(_defaultCourse, id)
}

export function getAreaForModule(moduleId: number): CourseArea | undefined {
  if (!_defaultCourse) return undefined
  return registryGetAreaForModule(_defaultCourse, moduleId)
}

// Re-export para evitar warnings de unused-import si alguna versión
// previa importaba registryFormatDuration directamente.
void registryFormatDuration
