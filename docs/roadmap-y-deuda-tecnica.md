# Roadmap y deuda técnica de la plataforma PV-Learn

Documento vivo que recoge:

1. **Audit técnico**: qué queda hardcoded del curso Agent 365 en la plataforma y por qué la convierte en NO-plug-and-play real.
2. **Propuesta UX/UI**: mejoras concretas para llegar a "top class" como plataforma de e-learning.
3. **Plan de producción restante**: lo que queda por construir según el roadmap inicial (Fases 8–9 que eliminamos de la home en G.2 pero siguen pendientes).

---

## 1. Audit técnico — Plug-and-play real

La meta declarada es que la plataforma React pueda servir **cualquier curso PV-Learn** sin tocar código de componentes. Hoy no se cumple del todo. Lo que queda:

### 1.1 Contenido del curso hardcoded en la plataforma ✅ RESUELTO (H.1)

| Archivo | Antes | Ahora | Migración |
|---|---|---|---|
| `platform/src/lib/labs.ts` | 173 líneas con datos del M01 inline | 130 líneas: solo tipos, parser y API | Datos en `cursos/agent365-cert/modulos/<modulo>/lab.yaml` |
| `platform/src/lib/resources.ts` | 1.711 líneas con 8 módulos hardcoded | 105 líneas: solo tipos, parser y API | Datos en `cursos/agent365-cert/modulos/<modulo>/recursos.yaml` (M01–M08) |

Ambos archivos cargan los datos vía `import.meta.glob` (eager) desde `course-paths.ts`. Si un módulo no tiene `lab.yaml` o `recursos.yaml`, la sección cae al fallback markdown sin error.

**Resultado**: la plataforma React ya no contiene contenido editorial del curso. Para arrancar otro curso PV-Learn basta con poner los `lab.yaml` y `recursos.yaml` correspondientes en `cursos/<nuevo-slug>/modulos/`.

### 1.2 Paths a `cursos/agent365-cert/` hardcoded 🟡 Medio

| Archivo | Línea | Qué tiene |
|---|---|---|
| `platform/src/lib/exam.ts` | 55 | `import.meta.glob('../../../cursos/agent365-cert/banco-examen.md', …)` |
| `platform/src/lib/quiz.ts` | 92 | `import.meta.glob('../../../cursos/agent365-cert/modulos/**/quiz-practica.md', …)` |

**Limitación de Vite**: `import.meta.glob` exige strings literales en build time, no se puede parametrizar con variables. Para soportar otro curso, hay que editar estos dos paths.

**Mitigación recomendada**: extraer ambos `glob()` a un único módulo `platform/src/lib/course-paths.ts` y documentar que es **el único archivo a tocar** (junto con `lib/course.ts`) para cambiar de curso. Trabajo: ~30 min.

### 1.3 Storage keys con prefijo `agent365-` 🟢 Bajo

| Key | Dónde se define |
|---|---|
| `agent365-exam-current` | `hooks/useExamState.ts` |
| `agent365-exam-history` | `hooks/useExamState.ts` |
| `agent365-quiz-m{N}-history` | `hooks/useQuizState.ts` |
| `agent365-lab-m{N}` | `hooks/useLabState.ts` |
| `agent365-reading-m{N}-teoria` | `lib/progress.ts` |
| `agent365-section-visits` | `lib/progress.ts` |
| `agent365-access-mode` | `lib/progress.ts` |
| `agent365-learner-name` | `components/exam/Certificate.tsx` |
| `agent365-progress-changed` | Custom event (cross-tab) |

**Impacto**: si se sirviera otro curso desde el mismo dominio, las keys colisionarían (un alumno con progreso en Agent 365 sobrescribiría progreso en el otro curso). En el modelo actual de un curso por deployment no hay problema.

**Mitigación recomendada**: extraer `STORAGE_PREFIX = 'pv-learn-{COURSE_SLUG}-…'` y derivar todas las keys de ahí. Trabajo: ~1 h. Conviene hacerlo antes del primer deployment con multi-curso (Fase 8 del plan).

### 1.4 Comentarios JSDoc con referencias al curso 🟢 Cosmético

Múltiples archivos (`useExamState.ts`, `progress.ts`, etc.) tienen JSDoc que mencionan "Agent 365" en sus descripciones. No afecta runtime, solo lecturabilidad del código. Cleanup gradual.

### 1.5 `index.html` con meta tags del curso 🟢 Bajo

`platform/index.html` tiene `<title>`, `og:title`, `og:description` y `description` con texto específico de Agent 365. Es archivo estático servido por Vite. Para cambiar de curso hay que editarlo.

**Mitigación recomendada**: usar `vite-plugin-html` o el plugin de `transformIndexHtml` para inyectar variables desde `lib/course.ts` en build time. Trabajo: ~1 h.

---

## 2. Propuesta UX/UI — Top class e-learning

Lo que la plataforma tiene hoy es sólido pero estándar. Para diferenciarse y entrar en la categoría "top class" (Coursera, Udemy, Frontend Masters, Maven), conviene incorporar:

### 2.1 Navegación y descubrimiento

| Mejora | Impacto | Esfuerzo | Componentes |
|---|---|---|---|
| ~~**Búsqueda global** sobre todo el contenido del curso (teoría, quiz, labs, recursos) con `cmd+k`. Resultados con snippet + módulo y sección de origen~~ ✅ H.3 | Alto | 8–12 h | `components/SearchPalette.tsx`, `lib/search.ts` |
| **Atajos de teclado** globales (`j`/`k` siguiente/anterior módulo, `t`/`q`/`l`/`r` cambio de sección, `?` para help, `/` para search) | Medio | 3–4 h | Nuevo `useKeyboardShortcuts`, `ShortcutsHelp` modal |
| **Indicador de progreso permanente** en el header (no solo en `/progreso`): pildora con `% completado` | Medio | 1–2 h | Aprovecha Badge + Stat |
| **Breadcrumbs estructurados** con esquema accesible (aria-current, schema.org BreadcrumbList) | Bajo | 2 h | Nuevo `Breadcrumbs` |

### 2.2 Aprendizaje activo

| Mejora | Impacto | Esfuerzo | Componentes |
|---|---|---|---|
| **Notas del alumno por módulo**: bloc lateral colapsable donde el alumno escribe sus notas en markdown, persistencia en localStorage, exportable a `.md` | Alto | 6–8 h | Nuevo `NotesPanel`, `useNotes` hook |
| **Highlighter sobre la teoría**: seleccionar texto → guardar como destacado, vista de "tus destacados" por módulo | Alto | 10–14 h | Compleja: requiere rangos persistentes, posicionamiento |
| **Modo focus / Pomodoro**: temporizador 25/5 que oculta sidebar y notificaciones, contador acumulado de tiempo de estudio | Medio | 4–6 h | Nuevo `FocusMode`, usa Modal |
| **Práctica adaptativa**: en quizzes, las preguntas falladas se reinyectan automáticamente al final con cooldown | Alto | 4–6 h | Modificación de `useQuizState` |
| **Flashcards generadas desde el banco**: vista alternativa donde cada pregunta se ve como tarjeta de repaso espaciado (Anki-like, SM-2) | Alto | 12–16 h | Nuevo módulo entero `Flashcards`, `useSpacedRepetition` |

### 2.3 Visual y micro-interacciones

| Mejora | Impacto | Esfuerzo | Componentes |
|---|---|---|---|
| **Skeleton states** para cargas (ahora no hay nada visible) | Medio | 2–3 h | Nuevo `Skeleton`, sustituir spinners |
| **Animaciones de transición** entre secciones del módulo (Teoría → Quiz → Labs) con framer-motion | Medio | 4–6 h | Wrapper de página, prefers-reduced-motion respetado |
| **Confetti / celebración** al completar un módulo o aprobar el examen (sutil, no infantil) | Bajo | 1 h | Lib `canvas-confetti`, dispara desde Certificate y ProgressPage |
| **Modo lectura inmersivo** para teoría: full-width sin sidebar, fuente serif opcional, tracking y line-height ampliados | Medio | 2–3 h | Toggle en header, clase CSS `.reading-mode` |
| **Vista de tabla de contenidos sticky** en el módulo (mini-mapa de los H2/H3 del markdown) | Alto | 3–4 h | Ya existe `TableOfContents`, mejorar sticky + active highlight |

### 2.4 Multimedia y contenido rico

| Mejora | Impacto | Esfuerzo | Componentes |
|---|---|---|---|
| **Video embed con marcadores**: si el curso incluye videos (YouTube/Vimeo/MP4), poder marcar timestamps y volver a ellos | Alto | 8–12 h | Nuevo `VideoPlayer` con scrubber, marcadores |
| **Diagramas Mermaid interactivos** en teoría (flowcharts, sequence diagrams, mindmaps) | Medio | 2–3 h | Plugin de markdown para `mermaid` |
| **Code playgrounds**: bloques de código ejecutables (Sandpack para JS/TS, equivalente para PowerShell) | Alto | 6–10 h | Componente que detecta `lang="powershell run"` etc. |
| **Imágenes responsive con srcset** (hoy se sirve siempre la versión completa) | Medio | 2–3 h | Adaptación de `ZoomableImage` y pipeline de assets |

### 2.5 Accesibilidad y rendimiento

| Mejora | Impacto | Esfuerzo |
|---|---|---|
| **Skip links** al inicio de cada página (saltar a contenido principal) | Bajo | 30 min |
| **Audit AAA**: pasar axe-core sobre todas las páginas, corregir los warnings | Medio | 4–6 h |
| **Code-splitting por ruta**: hoy todo el JS va en un solo bundle (~500 KB warning de Vite) | Medio | 2–3 h |
| **PWA con service worker**: la plataforma es instalable, funciona offline tras la primera visita | Alto | 6–10 h |
| **Modo alto contraste** detectado automáticamente (`prefers-contrast: more`) | Bajo | 2 h |
| **Soporte completo de teclado** en lightbox (ya está bien), drag-drop de quiz (revisar) y resto de interactivos | Medio | 3–4 h |

### 2.6 Social y prueba social

| Mejora | Impacto | Esfuerzo |
|---|---|---|
| **Compartir certificado**: botones de compartir en LinkedIn, Twitter/X con OG image dinámico generado | Alto | 4–6 h |
| **Verificación pública del certificado**: URL `/cert/{verificationId}` que muestra el certificado a cualquier visitante (sin necesidad de hacer el curso) | Alto | 6–8 h, requiere backend mínimo |
| **Insignias Open Badges** estándar al completar el curso (Mozilla Open Badges v2) | Medio | 4–6 h, requiere emisor de badges |

### 2.7 i18n y accesibilidad de idiomas

| Mejora | Impacto | Esfuerzo |
|---|---|---|
| **i18n completo** con react-i18next: UI traducible (botones, labels, mensajes), curso en español de origen pero plataforma EN-ES-FR | Alto | 8–12 h base + traducción ongoing |
| **Toggle de idioma** en el header con detección de `navigator.language` | Bajo | 2 h |

---

## 3. Plan de producción restante

Del roadmap original (la home tenía las Fases 0–9 hasta G.2 que las quitamos). Las fases 0–7 están **completas** (curso terminado, plataforma desplegada, examen funcional). Lo que queda:

### 3.1 Fase 8 — Plataforma multi-curso 🔴 Mayor

Hoy un deployment = un curso. Para servir varios cursos PV-Learn desde el mismo dominio:

| Componente | Esfuerzo |
|---|---|
| Refactor de `lib/course.ts` para soportar registro de cursos (no una lista única) | 6–10 h |
| Refactor de paths glob para indexar todos los cursos disponibles | 4–6 h |
| Catálogo `/cursos` (landing con todos los cursos disponibles) | 4–6 h |
| Selector de curso en header (cuando el alumno está dentro de un curso) | 3–4 h |
| Storage keys con prefijo por curso (cf. 1.3) | 2–3 h |
| Resolución de rutas: `/cursos/<slug>/modulo/N/teoria` en lugar de `/modulo/N/teoria` | 4–6 h |
| **Total estimado** | **23–35 h** (3–5 días de trabajo) |

### 3.2 Fase 9 — Backend mínimo + autenticación 🔴 Mayor

Hoy todo es localStorage. Para que el alumno tenga progreso sincronizado entre dispositivos, certificados verificables y un panel admin:

| Componente | Esfuerzo |
|---|---|
| Backend (recomendado: Cloudflare Workers + D1, o Supabase) | – |
| Autenticación email-only (magic link) o OAuth (Google/Microsoft) | 8–12 h |
| Schema de DB: users, courses, attempts, progress, certificates | 4–6 h |
| API endpoints (CRUD progreso, intentos, certificados) | 12–16 h |
| Migración del cliente: localStorage → API + offline-first cache | 12–16 h |
| Página `/cert/{verificationId}` pública (cf. 2.6) | 4 h |
| **Total estimado** | **40–54 h** (1–1.5 semanas) |

### 3.3 Fase 10 — Panel admin de cursos y certificación 🟡 Medio

Una vez hay backend, el admin (Plain Vanilla) necesita una UI para:

| Componente | Esfuerzo |
|---|---|
| Login admin con role-based access | 2–3 h |
| Dashboard: alumnos activos, intentos del examen, tasa de aprobación por módulo | 6–8 h |
| Vista de alumno individual: progreso, intentos, certificado | 4–6 h |
| Generador de PDF del certificado (sustituir window.print) usando React-PDF o Puppeteer | 8–10 h |
| Editor de cursos (CRUD básico sobre cursos del catálogo) | 12–20 h (opcional) |
| **Total estimado** | **32–47 h** (1 semana sin editor de cursos, 1.5 con él) |

### 3.4 Comercialización 🟢 Decisión de Miguel

Pendiente de decidir antes de empezar Fases 8–10:

- ¿Sacar el curso al mercado o quedárselo como recurso interno?
- ¿Canal? (partner SWO/Insight, B2B directo a empresas, B2C a individuales)
- ¿Marca? (Plain Vanilla, white-label para partner, marca compartida)
- ¿Idiomas? (hoy solo ES; FAIN pidió FR; EN amplía mercado global)
- ¿Mantenimiento? (Microsoft Agent 365 evoluciona rápido, el curso requiere actualización trimestral mínimo)
- ¿Modelo? (licencia perpetua, suscripción anual, paquete con consultoría)

El documento `docs/curso-como-producto.md` (creado en F.4) tiene el análisis económico detallado: coste real ~5.000–6.500 € vs equivalente mercado ~53.800 € (ratio 9×), con tres escenarios de pricing.

---

## 4. Priorización recomendada (mi opinión)

Si solo se va a invertir trabajo limitado, este es el orden con mejor relación impacto/esfuerzo:

1. **✅ Plug-and-play real** (resuelto en H.1): `labs.ts` y `resources.ts` migrados a YAML por módulo. `course-paths.ts` y `COURSE_SLUG` centralizan el resto de literales. La plataforma React ya no contiene contenido del curso.

2. **🟢 Quick wins** (1–2 días): Atajos teclado globales, Skeleton states, code-splitting, skip links, breadcrumbs estructurados, indicador de progreso en header. Mucho impacto perceptual por poco trabajo.

3. **🔴 Multi-curso + backend** (3–4 semanas): Si Miguel decide comercializar, este es el bloque que habilita todo lo demás.

4. **🟢 Diferenciación premium** (variable): Notas del alumno, highlighter, flashcards, video embebido. Cada uno mejora el producto pero solo si se va a vender.

---

*Última actualización: 2026-05-12 tras Fase H.3.*
