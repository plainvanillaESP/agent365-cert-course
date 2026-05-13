import { ArrowRight, Clock, BookOpen, GraduationCap, FileText } from 'lucide-react'
import { ButtonLink } from '@/components/Button'
import { Section, Card, Stat, StatsGrid } from '@/components/Layout'
import { PageHeader } from '@/components/PageHeader'
import { ModuleRow } from '@/components/ModuleRow'
import {
  AREAS,
  MODULES,
  CONTENT_MODULES,
  EXAM_MODULE,
  COURSE_TOTAL_MIN,
  COURSE_EXAM_MIN,
  COURSE_TOTAL_QUESTIONS,
  COURSE_TITLE,
  COURSE_EYEBROW,
  COURSE_DESCRIPTION,
  COURSE_LOGO,
  formatDuration,
} from '@/lib/course'
import { useUnlockState } from '@/hooks/useModuleProgress'
import { useCourse } from '@/contexts/CourseContext'

export function HomePage() {
  const { isUnlocked } = useUnlockState()
  const { href } = useCourse()
  const numTotalModules = MODULES.length
  const numContentModules = CONTENT_MODULES.length
  const courseStartPath = href(`modulo/${CONTENT_MODULES[0]?.id ?? 1}/teoria`)

  return (
    <div className="max-w-[var(--layout-content-max)] mx-auto">
      <PageHeader
        eyebrow={COURSE_EYEBROW}
        title={COURSE_TITLE}
        description={COURSE_DESCRIPTION}
        logo={
          <img
            src={`${import.meta.env.BASE_URL}${COURSE_LOGO}`}
            alt=""
            className="size-[72px] sm:size-[96px] rounded-[18px]"
            aria-hidden
          />
        }
        actions={
          <ButtonLink
            to={courseStartPath}
            variant="primary"
            size="lg"
            iconRight={<ArrowRight className="size-4 stroke-[2.25]" aria-hidden />}
          >
            Empezar por el primer módulo
          </ButtonLink>
        }
      />

      <StatsGrid>
        <Stat icon={<BookOpen className="size-[14px] stroke-[1.75]" />} label="Módulos" value={String(numContentModules)} />
        <Stat icon={<Clock className="size-[14px] stroke-[1.75]" />} label="Duración" value={formatDuration(COURSE_TOTAL_MIN)} />
        <Stat icon={<GraduationCap className="size-[14px] stroke-[1.75]" />} label="Examen" value={`${COURSE_EXAM_MIN} min`} />
        <Stat icon={<FileText className="size-[14px] stroke-[1.75]" />} label="Preguntas" value={String(COURSE_TOTAL_QUESTIONS)} />
      </StatsGrid>

      <Section
        eyebrow="Examen"
        title="Áreas de competencia"
        description="El examen final pondera las cinco áreas según el peso oficial. Los módulos cubren cada área en bloques temáticos."
      >
        <div className="space-y-3">
          {AREAS.map(area => (
            <AreaCard key={area.id} area={area} />
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Temario"
        title={`Los ${numTotalModules} módulos del curso`}
      >
        <Card flush>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {CONTENT_MODULES.map(m => (
              <ModuleRow key={m.id} module={m} unlocked={isUnlocked(m.id)} />
            ))}
          </ul>
        </Card>
        <div className="mt-3">
          <Card flush>
            <ModuleRow module={EXAM_MODULE} isExam unlocked={isUnlocked(EXAM_MODULE.id)} />
          </Card>
        </div>
      </Section>
    </div>
  )
}

/* ------------------------- Componentes de la home ------------------------- */

/* --------------------------- Áreas (AreaCard) --------------------------- */

function AreaCard({ area }: { area: typeof AREAS[number] }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)]">
      <div className="size-9 rounded-md bg-[var(--bg-surface-2)] flex items-center justify-center font-mono text-[14px] font-semibold text-[var(--text-primary)] shrink-0">
        {area.id}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-[15px] font-semibold text-[var(--text-primary)] leading-tight">
            {area.nombreEs}
          </h3>
          <span className="text-[12px] text-[var(--text-muted)] font-mono">
            {area.modulos.map(m => `M${String(m).padStart(2, '0')}`).join(' · ')}
          </span>
        </div>
        <div className="text-[13px] text-[var(--text-muted)] mt-1 italic">{area.nombre}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-[18px] font-semibold tabular-nums text-[var(--text-primary)] leading-none whitespace-nowrap">
          {area.pesoExamen}%
        </div>
        <div className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mt-1">
          Peso
        </div>
      </div>
    </div>
  )
}

/* --------------------------- Temario (ModuleRow) --------------------------- */

// El componente ModuleRow vive en `@/components/ModuleRow` y se importa
// arriba. Anteriormente este archivo definía una copia local; ahora
// todo el lenguaje visual de la fila de módulo está en un único sitio.
