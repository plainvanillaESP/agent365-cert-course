import { Link, Navigate } from 'react-router-dom'
import { ArrowRight, Clock, BookOpen, GraduationCap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { coursesAssignedTo } from '@/lib/auth'
import { contentModules, formatDuration, type CourseData } from '@/lib/coursesRegistry'
import { PageHeader } from '@/components/PageHeader'
import { Section } from '@/components/Layout'

/**
 * Catálogo de cursos asignados al alumno actual.
 *
 *   - Si no hay sesión, redirige a `/login`.
 *   - Si solo hay un curso asignado, redirige directamente a su home —
 *     el alumno no necesita ver una página con una sola tarjeta.
 *   - Si hay varios, los lista como cards con metadatos (módulos, duración).
 *
 * Cuando llegue el backend (Fase 9), `coursesAssignedTo(user)` pasará a
 * leer del API; el resto del componente se mantiene.
 */
export function CatalogPage() {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" state={{ from: '/' }} replace />

  const courses = coursesAssignedTo(user)

  // Atajo de UX: con un solo curso asignado, el catálogo no aporta.
  if (courses.length === 1) {
    return <Navigate to={`/cursos/${courses[0].slug}`} replace />
  }

  if (courses.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <GraduationCap className="size-10 mx-auto mb-4 text-[var(--text-muted)] stroke-[1.5]" aria-hidden />
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)] mb-2">
          Sin cursos asignados todavía
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Tu cuenta no tiene cursos disponibles. Contacta con tu administrador
          o el equipo de Plain Vanilla para asignación.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        eyebrow={`Hola, ${user.name}`}
        title="Tus cursos"
        description="Selecciona el curso al que quieres acceder. Tu progreso se guarda por separado en cada uno."
      />

      <Section title="Disponibles" eyebrow={`${courses.length} cursos`} className="mt-8">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courses.map(course => (
            <li key={course.slug}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}

function CourseCard({ course }: { course: CourseData }) {
  const numContent = contentModules(course).length
  return (
    <Link
      to={`/cursos/${course.slug}`}
      className="group block h-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface-hover)] transition-colors p-5 no-underline"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="size-10 rounded-md shrink-0 flex items-center justify-center"
          style={{ backgroundColor: course.branding.colorPrimario + '22' }}
          aria-hidden
        >
          <BookOpen
            className="size-[18px] stroke-[1.75]"
            style={{ color: course.branding.colorPrimario }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10.5px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold">
            {course.editor}
          </div>
          <h3 className="text-[15.5px] font-semibold text-[var(--text-primary)] leading-snug mt-1">
            {course.shortTitle}
          </h3>
        </div>
      </div>

      <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
        {course.description}
      </p>

      <div className="flex items-center justify-between text-[12px] text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-[12px]" aria-hidden />
            {numContent} módulos
          </span>
          <span aria-hidden className="text-[var(--text-faint)]">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-[12px]" aria-hidden />
            {formatDuration(course.totalMinutes)}
          </span>
        </div>
        <ArrowRight
          className="size-[14px] stroke-[2] text-[var(--text-muted)] group-hover:text-[var(--color-pv-purple-600)] dark:group-hover:text-[var(--color-pv-purple-300)] group-hover:translate-x-0.5 transition-all"
          aria-hidden
        />
      </div>
    </Link>
  )
}
