/**
 * Paths del curso activo.
 *
 * Este módulo aísla los dos `import.meta.glob` del proyecto. Vite exige
 * que los patrones de glob sean strings literales en build time (no
 * acepta variables), así que es **el único archivo a editar** cuando se
 * adapta la plataforma a un curso distinto.
 *
 * El resto del código consume las funciones exportadas aquí en lugar de
 * llamar a `import.meta.glob` por su cuenta.
 *
 * Si se cambia el curso:
 *
 *   1. Sustituir `agent365-cert` por el nuevo slug en los dos `glob` de
 *      este archivo.
 *   2. Verificar que `COURSE_SLUG` en `lib/course.ts` coincide.
 *   3. Asegurarse de que la carpeta `cursos/<nuevo-slug>/` existe con
 *      la misma estructura (banco-examen.md + modulos/<m>/quiz-practica.md).
 */

/**
 * Devuelve el contenido del banco de preguntas del examen final.
 *
 * Retorna un mapa `{ ruta → contenido raw }` con una sola entrada
 * (modo `eager`). En entornos sin Vite (test:exam runtime), el caller
 * recibe un objeto vacío y debe pasar el contenido por argumento.
 */
export function loadExamBankGlob(): Record<string, string> {
  return typeof (import.meta as ImportMeta & { glob?: unknown }).glob === 'function'
    ? (import.meta.glob('../../../cursos/agent365-cert/banco-examen.md', {
        query: '?raw',
        import: 'default',
        eager: true,
      }) as Record<string, string>)
    : {}
}

/**
 * Devuelve todos los archivos de quiz por módulo del curso.
 *
 * Patrón: `cursos/<slug>/modulos/<modulo>/quiz-practica.md`.
 * Cada entrada del mapa tiene como key el path completo (que el caller
 * parsea para extraer el número de módulo).
 */
export function loadQuizModulesGlob(): Record<string, string> {
  return import.meta.glob<string>(
    '../../../cursos/agent365-cert/modulos/**/quiz-practica.md',
    { query: '?raw', import: 'default', eager: true },
  )
}
