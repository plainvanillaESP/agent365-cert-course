import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Certificate } from '@/components/exam/Certificate'
import type { ExamAttempt } from '@/hooks/useExamState'

const HISTORY_KEY = 'agent365-exam-history'

/**
 * Carga el intento desde localStorage y renderiza el certificado si está
 * aprobado. Si el id no existe o el intento no pasó el umbral, muestra
 * un mensaje claro y un enlace de retorno al examen.
 *
 * El nombre del alumno NO se persiste: se introduce en cada visita a la
 * página del certificado. Es deliberado para no asumir consentimiento
 * de almacenar datos personales sin haberlo pedido explícitamente.
 */
export function CertificatePage() {
  const { attemptId } = useParams<{ attemptId: string }>()

  const attempt = useMemo<ExamAttempt | null>(() => {
    if (!attemptId) return null
    if (typeof localStorage === 'undefined') return null
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (!raw) return null
      const arr = JSON.parse(raw) as ExamAttempt[]
      if (!Array.isArray(arr)) return null
      return arr.find(a => a.id === attemptId) ?? null
    } catch {
      return null
    }
  }, [attemptId])

  if (!attempt) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)]">No se encuentra el intento</h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          El intento referenciado no existe en este navegador. Es posible que se haya borrado el historial o que estés en un dispositivo distinto.
        </p>
        <Link
          to="/examen"
          className="inline-block text-[13.5px] text-[var(--text-active)] hover:underline"
        >
          Volver al examen
        </Link>
      </div>
    )
  }

  if (!attempt.scoring.passed) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h1 className="text-[22px] font-semibold text-[var(--text-primary)]">Intento no aprobado</h1>
        <p className="text-[14px] text-[var(--text-secondary)]">
          Solo se emite certificado para intentos que superan el umbral del 70 %. Vuelve al examen para intentarlo de nuevo.
        </p>
        <Link
          to="/examen"
          className="inline-block text-[13.5px] text-[var(--text-active)] hover:underline"
        >
          Volver al examen
        </Link>
      </div>
    )
  }

  return <Certificate attempt={attempt} />
}
