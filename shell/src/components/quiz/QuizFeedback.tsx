import { Award, Trophy, AlertCircle, Sparkles } from 'lucide-react'

interface QuizHeaderProps {
  totalQuestions: number
  answeredCount: number
}

export function QuizHeader({ totalQuestions, answeredCount }: QuizHeaderProps) {
  const pct = Math.round((answeredCount / totalQuestions) * 100)
  return (
    <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-5">
      <div className="flex items-start gap-3">
        <Sparkles className="size-[18px] text-[var(--color-pv-purple-500)] stroke-[1.75] shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1">
          <h3 className="font-display text-[15px] font-semibold text-[var(--text-primary)] mb-1">
            Evaluación interactiva
          </h3>
          <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed">
            {totalQuestions === 1
              ? <>La pregunta oficial del banco que este módulo aporta al examen final.</>
              : <>Las {totalQuestions} preguntas oficiales del banco que este módulo aporta al examen final.</>}{' '}
            Responde y pulsa <span className="font-medium text-[var(--text-primary)]">Validar respuestas</span> para
            ver el resultado y la justificación de cada una.
          </p>
        </div>
      </div>

      {/* Progreso */}
      <div className="mt-4 flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-[var(--bg-surface-2)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-pv-purple-500)] transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="font-mono text-[12px] tabular-nums text-[var(--text-muted)] shrink-0">
          {answeredCount}/{totalQuestions} respondidas
        </span>
      </div>
    </div>
  )
}

interface QuizResultProps {
  score: number
  total: number
}

export function QuizResult({ score, total }: QuizResultProps) {
  const isPerfect = score === total
  const passed = score >= Math.ceil(total * 0.7)

  if (isPerfect) {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/[0.06] p-5">
        <div className="flex items-start gap-3">
          <Trophy className="size-[20px] text-emerald-600 dark:text-emerald-400 stroke-[1.75] shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1">
            <h3 className="font-display text-[16px] font-semibold text-emerald-800 dark:text-emerald-200">
              Pleno: {score}/{total}
            </h3>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
              Has acertado todas las preguntas oficiales del módulo. Estás listo para el siguiente.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (passed) {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/[0.06] p-5">
        <div className="flex items-start gap-3">
          <Award className="size-[20px] text-emerald-600 dark:text-emerald-400 stroke-[1.75] shrink-0 mt-0.5" aria-hidden />
          <div className="flex-1">
            <h3 className="font-display text-[16px] font-semibold text-emerald-800 dark:text-emerald-200">
              Aprobado: {score}/{total}
            </h3>
            <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
              Has superado el umbral del 70 %. Revisa la justificación de la pregunta que has fallado antes de pasar al siguiente módulo.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/[0.06] p-5">
      <div className="flex items-start gap-3">
        <AlertCircle className="size-[20px] text-amber-600 dark:text-amber-400 stroke-[1.75] shrink-0 mt-0.5" aria-hidden />
        <div className="flex-1">
          <h3 className="font-display text-[16px] font-semibold text-amber-800 dark:text-amber-200">
            Resultado: {score}/{total}
          </h3>
          <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed mt-1">
            Te recomendamos revisar la teoría del módulo y las justificaciones de las preguntas falladas antes de reintentar.
          </p>
        </div>
      </div>
    </div>
  )
}
