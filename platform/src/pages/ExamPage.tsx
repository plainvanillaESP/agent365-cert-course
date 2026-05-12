import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useExamState } from '@/hooks/useExamState'
import { ExamPreStart } from '@/components/exam/ExamPreStart'
import { ExamInProgress } from '@/components/exam/ExamInProgress'
import { ExamResult } from '@/components/exam/ExamResult'

/**
 * Página del examen final. Renderiza una de tres vistas según la fase
 * del intento (`pre-start`, `in-progress`, `result`). Toda la lógica
 * vive en `useExamState`; aquí solo enchufamos sus salidas a las
 * vistas correspondientes.
 *
 * Avisa al usuario antes de cerrar la ventana si hay un intento en
 * curso, para evitar perder tiempo por cierre accidental. La persistencia
 * en localStorage cubre el caso de refresh, pero el cierre total del
 * navegador deja el reloj corriendo igual (el cronómetro se basa en
 * deadline absoluto), así que el aviso es preventivo, no obligatorio.
 */
export function ExamPage() {
  const navigate = useNavigate()
  const {
    phase,
    questions,
    answers,
    lastResult,
    history,
    remainingSec,
    attemptsRemaining,
    cooldownUntil,
    start,
    setAnswer,
    submit,
    reset,
    clearHistory,
  } = useExamState()

  // Aviso de cierre de ventana cuando hay intento en curso.
  useEffect(() => {
    if (phase !== 'in-progress') return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      // El mensaje exacto lo ignoran los navegadores modernos pero
      // sigue siendo obligatorio para activar el diálogo.
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [phase])

  // Si el usuario llega a /examen tras aprobar y quiere ver su certificado,
  // damos un atajo: el último intento aprobado puede abrirse desde el
  // historial. No autoredirigimos para no robar control.
  void navigate

  if (phase === 'pre-start') {
    return (
      <ExamPreStart
        attemptsRemaining={attemptsRemaining}
        cooldownUntil={cooldownUntil}
        history={history}
        onStart={start}
        onClearHistory={clearHistory}
      />
    )
  }

  if (phase === 'in-progress') {
    return (
      <ExamInProgress
        questions={questions}
        answers={answers}
        remainingSec={remainingSec}
        onAnswerChange={setAnswer}
        onSubmit={submit}
      />
    )
  }

  // phase === 'result'
  if (!lastResult) {
    // Caso raro pero defensivo.
    return null
  }
  return (
    <ExamResult
      attempt={lastResult}
      attemptsRemaining={attemptsRemaining}
      cooldownUntil={cooldownUntil}
      onRetry={() => {
        reset()
        start()
      }}
      onBackToPreStart={reset}
    />
  )
}
