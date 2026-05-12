import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { getCourse, defaultCourseSlug, type CourseData } from '@/lib/coursesRegistry'
import { setActiveCourseSlug } from '@/lib/storage'

/**
 * Provee el curso activo basándose en el `:slug` de la URL.
 *
 *   - `<CourseProvider>` lee `useParams().slug`, busca el curso en el
 *     registry y lo expone via context.
 *   - Si el slug no existe, redirige a `/` (a catalog o al curso por
 *     defecto, según la lógica en `App.tsx`).
 *   - Componentes consumen el curso con `useCourse()`.
 *
 * Filosofía:
 *
 *   - El provider NO maneja routing global. Solo hace de pasarela
 *     `slug → CourseData` para los componentes que viven bajo
 *     `/cursos/:slug/*`.
 *   - El curso por defecto sigue siendo accesible via
 *     `lib/course.ts` para componentes que aún no usan el hook
 *     (retrocompatibilidad).
 *   - Cuando llegue auth (Fase 9), el provider podrá leer del backend
 *     la lista de cursos asignados al alumno y filtrar el catálogo
 *     antes de construir la lista. Hoy todos los cursos son públicos
 *     en el registry.
 */

interface CourseContextValue {
  course: CourseData
  /** Construye una ruta absoluta dentro del curso activo. */
  href: (path?: string) => string
}

const CourseContext = createContext<CourseContextValue | null>(null)

export function CourseProvider({
  slug,
  children,
}: {
  /**
   * Slug del curso activo. Se pasa explícitamente para que el provider
   * pueda mantenerse alto en el árbol (envolviendo header + sidebar) y
   * cambiar de curso cuando la URL cambie de `:slug` sin perder estado
   * que viva fuera. El `App` lo deriva de `location.pathname`.
   */
  slug: string
  children: ReactNode
}) {
  const course = getCourse(slug) ?? getCourse(defaultCourseSlug())

  const value = useMemo<CourseContextValue | null>(() => {
    if (!course) return null
    return {
      course,
      href: (path = '') => {
        const clean = path.startsWith('/') ? path.slice(1) : path
        return `/cursos/${course.slug}${clean ? '/' + clean : ''}`
      },
    }
  }, [course])

  // Sincroniza el slug activo con el módulo `lib/storage.ts` para que
  // código fuera de React (lib/progress, callbacks de eventos) pueda
  // construir las storage keys correctas sin propagar el slug.
  useEffect(() => {
    if (course) setActiveCourseSlug(course.slug)
  }, [course])

  if (!course || !value) {
    // No hay ningún curso disponible. Render mínimo para evitar pantalla
    // en blanco; en la práctica solo ocurre durante el primer arranque
    // si el repo no tiene cursos.
    return <>{children}</>
  }

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>
}

/**
 * Hook para acceder al curso activo. Lanza si se usa fuera de un
 * `<CourseProvider>` — eso es siempre un bug y conviene saberlo cuanto
 * antes en desarrollo.
 */
export function useCourse(): CourseContextValue {
  const ctx = useContext(CourseContext)
  if (!ctx) {
    throw new Error('useCourse() debe llamarse dentro de un <CourseProvider>')
  }
  return ctx
}

/**
 * Variante "opcional": devuelve `null` si no hay provider, en lugar de
 * lanzar. Útil para componentes globales (header, footer) que pueden
 * vivir tanto dentro como fuera de un contexto de curso.
 */
export function useCourseOptional(): CourseContextValue | null {
  return useContext(CourseContext)
}
