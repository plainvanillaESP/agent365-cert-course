/**
 * Wrapper sobre `canvas-confetti` con tres añadidos:
 *
 *   1. **Lazy-load**: la librería se importa dinámicamente la primera
 *      vez que se invoca; no entra en el bundle inicial.
 *   2. **Respeto a `prefers-reduced-motion`**: si el alumno ha
 *      desactivado animaciones a nivel de SO, la función se convierte
 *      en no-op silencioso. No oculta el resto del feedback (chips,
 *      mensajes), solo evita el confetti.
 *   3. **Theming Plain Vanilla**: usa el gradiente del producto
 *      (`#9A44E5` → `#F68DAC`) como paleta por defecto en lugar de los
 *      tonos primarios chillones de la librería.
 */

const PV_COLORS = ['#9A44E5', '#B05CE0', '#D374C7', '#F68DAC', '#FDC1D1', '#FFFFFF']

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Lanza una celebración corta (perfil "success", la usamos al aprobar
 * un quiz al 100 % o el examen). ~700 ms de duración total.
 */
export async function celebrate(): Promise<void> {
  if (prefersReducedMotion()) return
  try {
    const mod = await import('canvas-confetti')
    const fn = mod.default
    // Ráfaga lateral izquierda + lateral derecha para envolver al alumno.
    const common = {
      particleCount: 60,
      startVelocity: 45,
      spread: 60,
      ticks: 200,
      gravity: 1.1,
      colors: PV_COLORS,
      scalar: 0.9,
      // z-index muy alto: por encima de modales, drawers y timer flotante.
      zIndex: 9999,
    } as const
    fn({ ...common, origin: { x: 0.15, y: 0.6 }, angle: 60 })
    fn({ ...common, origin: { x: 0.85, y: 0.6 }, angle: 120 })
  } catch {
    /* canvas-confetti es opcional: si falla por cualquier motivo,
       lo tratamos como un no-op silencioso. */
  }
}

/**
 * Variante más amplia (1.5 s, dos ráfagas escalonadas). Se reserva
 * para hitos mayores (aprobar el examen final de certificación).
 */
export async function celebrateBig(): Promise<void> {
  if (prefersReducedMotion()) return
  try {
    const mod = await import('canvas-confetti')
    const fn = mod.default

    const duration = 1500
    const animationEnd = Date.now() + duration

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()
      if (timeLeft <= 0) {
        clearInterval(interval)
        return
      }
      const particleCount = 40 * (timeLeft / duration)
      fn({
        particleCount: Math.max(8, Math.floor(particleCount)),
        startVelocity: 35,
        spread: 80,
        origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.3 + 0.5 },
        colors: PV_COLORS,
        ticks: 250,
        gravity: 1,
        zIndex: 9999,
      })
    }, 220)
  } catch {
    /* no-op silencioso */
  }
}
