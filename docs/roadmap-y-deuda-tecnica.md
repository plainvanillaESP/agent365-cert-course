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
| ~~**Atajos de teclado** globales (`j`/`k` siguiente/anterior módulo, `t`/`q`/`l`/`r` cambio de sección, `?` para help, `/` para search)~~ ✅ H.2 + H.3 | Medio | 3–4 h | `hooks/useKeyboardShortcuts.tsx`, `components/ShortcutsModal.tsx` |
| ~~**Indicador de progreso permanente** en el header (no solo en `/progreso`): pildora con `% completado`~~ ✅ H.2 | Medio | 1–2 h | `components/Header.tsx` + `useCourseProgress` |
| ~~**Breadcrumbs estructurados** con esquema accesible (aria-current, schema.org BreadcrumbList)~~ ✅ H.2 | Bajo | 2 h | `components/Breadcrumbs.tsx` |

### 2.2 Aprendizaje activo

| Mejora | Impacto | Esfuerzo | Componentes |
|---|---|---|---|
| ~~**Notas del alumno por módulo**: bloc lateral colapsable donde el alumno escribe sus notas en markdown, persistencia en localStorage, exportable a `.md`~~ ✅ I.1 | Alto | 6–8 h | `components/NotesPanel.tsx`, `hooks/useNotes.ts` |
| ~~**Highlighter sobre la teoría**: seleccionar texto → guardar como destacado, vista de "tus destacados" por módulo~~ ✅ L.1 (vista pendiente) | Alto | 10–14 h | `lib/highlights.ts`, `hooks/useHighlights.ts`, `components/Highlighter.tsx` |
| ~~**Modo focus / Pomodoro**: temporizador 25/5 que oculta sidebar y notificaciones, contador acumulado de tiempo de estudio~~ ✅ K.1 | Medio | 4–6 h | `lib/focusStore.ts`, `components/FocusTimer.tsx`, `hooks/useFocusMode.ts` |
| ~~**Práctica adaptativa**: en quizzes, las preguntas falladas se reinyectan automáticamente al final con cooldown~~ ✅ I.2 | Alto | 4–6 h | `hooks/useQuizState.ts`, `components/quiz/Quiz.tsx` |
| ~~**Flashcards generadas desde el banco**: vista alternativa donde cada pregunta se ve como tarjeta de repaso espaciado (Anki-like, SM-2)~~ ✅ L.7 | Alto | 12–16 h | `lib/srs.ts`, `hooks/useFlashcards.ts`, `pages/RepasoPage.tsx`, `components/flashcards/` |

### 2.3 Visual y micro-interacciones

| Mejora | Impacto | Esfuerzo | Componentes |
|---|---|---|---|
| ~~**Skeleton states** para cargas (ahora no hay nada visible)~~ ✅ H.2 | Medio | 2–3 h | `components/Skeleton.tsx` |
| ~~**Animaciones de transición** entre secciones del módulo (Teoría → Quiz → Labs) con framer-motion~~ ✅ L.2 (CSS, sin lib) | Medio | 4–6 h | `components/Transitions.tsx` + keyframes en `index.css` |
| ~~**Confetti / celebración** al completar un módulo o aprobar el examen (sutil, no infantil)~~ ✅ K.2 | Bajo | 1 h | `lib/confetti.ts` con lazy-load + respeto prefers-reduced-motion |
| ~~**Modo lectura inmersivo** para teoría: full-width sin sidebar, fuente serif opcional, tracking y line-height ampliados~~ ✅ J.1 | Medio | 2–3 h | `hooks/useReadingMode.ts` + CSS `data-reading-mode="on"` |
| ~~**Vista de tabla de contenidos sticky** en el módulo (mini-mapa de los H2/H3 del markdown)~~ ✅ J.1 | Alto | 3–4 h | `components/TableOfContents.tsx` reescrito |

### 2.4 Multimedia y contenido rico

| Mejora | Impacto | Esfuerzo | Componentes |
|---|---|---|---|
| **Video embed con marcadores**: si el curso incluye videos (YouTube/Vimeo/MP4), poder marcar timestamps y volver a ellos | Alto | 8–12 h | Nuevo `VideoPlayer` con scrubber, marcadores |
| ~~**Diagramas Mermaid interactivos** en teoría (flowcharts, sequence diagrams, mindmaps)~~ ✅ K.2 | Medio | 2–3 h | `components/MermaidBlock.tsx` + override de `<pre>` en `MarkdownRenderer` |
| **Code playgrounds**: bloques de código ejecutables (Sandpack para JS/TS, equivalente para PowerShell) | Alto | 6–10 h | Componente que detecta `lang="powershell run"` etc. |
| ~~**Imágenes responsive con srcset** (hoy se sirve siempre la versión completa)~~ ✅ L.5 (lazy + decoding async; srcset pendiente hasta que haya PNGs grandes) | Medio | 2–3 h | `loading="lazy"` y `decoding="async"` añadidos a `ZoomableImage` y `Certificate` |

### 2.5 Accesibilidad y rendimiento

| Mejora | Impacto | Esfuerzo |
|---|---|---|
| ~~**Skip links** al inicio de cada página (saltar a contenido principal)~~ ✅ H.2 | Bajo | 30 min |
| ~~**Audit AAA**: pasar axe-core sobre todas las páginas, corregir los warnings~~ ✅ M.2 (axe en dev runtime) | Medio | 4–6 h | `@axe-core/react` cargado bajo `import.meta.env.DEV` en `main.tsx` |
| ~~**Code-splitting por ruta**: hoy todo el JS va en un solo bundle (~500 KB warning de Vite)~~ ✅ H.2 + H.3 | Medio | 2–3 h |
| ~~**PWA con service worker**: la plataforma es instalable, funciona offline tras la primera visita~~ ✅ L.4 | Alto | 6–10 h | `vite-plugin-pwa` + manifest en `vite.config.ts` |
| ~~**Modo alto contraste** detectado automáticamente (`prefers-contrast: more`)~~ ✅ L.3 | Bajo | 2 h | CSS bajo `@media (prefers-contrast: more)` |
| ~~**Soporte completo de teclado** en lightbox (ya está bien), drag-drop de quiz (revisar) y resto de interactivos~~ ✅ L.3 (auditado) | Medio | 3–4 h | KeyboardSensor de dnd-kit + Ordering con botones |

### 2.6 Social y prueba social

| Mejora | Impacto | Esfuerzo |
|---|---|---|
| ~~**Compartir certificado**: botones de compartir en LinkedIn, Twitter/X con OG image dinámico generado~~ ✅ L.6 (OG dinámico pendiente, requiere backend) | Alto | 4–6 h | `components/ShareButtons.tsx` |
| **Verificación pública del certificado**: URL `/cert/{verificationId}` que muestra el certificado a cualquier visitante (sin necesidad de hacer el curso) | Alto | 6–8 h, requiere backend mínimo |
| **Insignias Open Badges** estándar al completar el curso (Mozilla Open Badges v2) | Medio | 4–6 h, requiere emisor de badges |

### 2.7 i18n y accesibilidad de idiomas

| Mejora | Impacto | Esfuerzo |
|---|---|---|
| ~~**i18n completo** con react-i18next: UI traducible (botones, labels, mensajes), curso en español de origen pero plataforma EN-ES-FR~~ ✅ M.1 (infra; migración de strings ongoing) | Alto | 8–12 h base + traducción ongoing | `i18n/`, `locales/{es,en}/common.json` |
| ~~**Toggle de idioma** en el header con detección de `navigator.language`~~ ✅ M.1 | Bajo | 2 h | `components/LanguageSwitcher.tsx` |

---

## 3. Plan de producción restante

Del roadmap original (la home tenía las Fases 0–9 hasta G.2 que las quitamos). Las fases 0–7 están **completas** (curso terminado, plataforma desplegada, examen funcional). Lo que queda:

### 3.1 Fase 8 — Plataforma multi-curso ✅ Resuelto (N.1)

Refactor completado en N.1. La arquitectura ya es multi-curso, aunque solo hay un curso poblado:

| Componente | Esfuerzo |
|---|---|
| Refactor de `lib/course.ts` para soportar registro de cursos (no una lista única) | 6–10 h |
| Refactor de paths glob para indexar todos los cursos disponibles | 4–6 h |
| Catálogo `/cursos` (landing con todos los cursos disponibles) | 4–6 h |
| Selector de curso en header (cuando el alumno está dentro de un curso) | 3–4 h |
| Storage keys con prefijo por curso (cf. 1.3) | 2–3 h |
| Resolución de rutas: `/cursos/<slug>/modulo/N/teoria` en lugar de `/modulo/N/teoria` | 4–6 h |
| **Total estimado** | **23–35 h** (3–5 días de trabajo) |

### 3.2 Fase 9 — Backend mínimo + autenticación ✅ Resuelto (Fase P)

Implementado en Fase P con Supabase env-gated. El mismo bundle funciona en local (sin env vars) y en producción (con env vars del provider). Schema canónico aplicado, RLS activa, magic link operativo, `/cert/:verificationId` pública.

| Componente | Estado |
|---|---|
| Backend Supabase | ✅ |
| Autenticación email-only magic link | ✅ |
| Schema DB (user_profile, course_enrollment, user_progress, exam_attempt) | ✅ |
| Página `/cert/{verificationId}` pública | ✅ |
| Migración del cliente localStorage → API | Pendiente (R.2 / R.3 lo aprovecharán al construir admins) |

### 3.3 Fase R — Monetización (B2C + B2B + admins) 🟢 En curso

Sustituye a la antigua "Fase 10" del roadmap original. Cubre el modelo comercial completo: ventas individuales B2C con Stripe Checkout, contratos B2B con seats nominales asignables y los dos paneles admin (Plain Vanilla y organización cliente).

Documentación detallada: [`docs/fase-r-monetizacion.md`](./fase-r-monetizacion.md).

| Sub-fase | Alcance | Esfuerzo | Estado |
|---|---|---|---|
| **R.1 Foundation** | Doc de arquitectura, schema SQL ampliado (5 tablas + función `user_has_access_to_course` + trigger seat-binding), tipos TypeScript stub | 4–6 h | ✅ |
| **R.2 Admin Plain Vanilla MVP** | Panel `/admin` con dashboard + CRUD orgs + crear subscriptions con seats vacantes. **R.2.5**: añadir admin a org desde UI con invitations pendientes + `/admin/usuarios` + `/admin/certificados` | 12–16 h | ✅ |
| **R.3 Admin organización MVP** | Panel `/org/:slug/admin` con dashboard + seats con filtros + invitación masiva de emails con magic link + progreso del equipo. Pendiente para R.3.5: `/certificados`, `/perfil` | 10–14 h | ✅ (MVP) |
| **R.4 B2C Stripe Checkout** | Landing comercial `/comprar`, Stripe Checkout one-time, webhook, course_purchase | 8–12 h | 🟡 |
| **R.5 B2B Stripe Subscriptions** (opcional) | Self-service de subscriptions B2B. Si Plain Vanilla prefiere mantener facturación manual, se omite | 12–16 h | 🟡 |
| **R.6 Generador PDF certificado** | Reemplazar `window.print()` por React-PDF o Puppeteer en server | 6–8 h | 🟡 |
| **Total R completo** | | **52–72 h** | |

**Decisiones comerciales pendientes** (input de Miguel antes de R.4): precio B2C, precio B2B por seat, modelo perpetuo vs caducidad, descuentos por volumen, cuenta Stripe.

### 3.4 Comercialización 🟢 Decidido

Decisión confirmada de Miguel: **comercializar sí**. Modelo doble:
- **B2C individual**: alumno paga y compra el curso (Stripe Checkout)
- **B2B empresa**: contrato de N seats que el admin de la empresa asigna a emails concretos

Plataforma desplegada en `learn.plainvanilla.ai` (Vercel). Detalles en `docs/fase-r-monetizacion.md`.

El documento `docs/curso-como-producto.md` (creado en F.4) tiene el análisis económico detallado: coste real ~5.000–6.500 € vs equivalente mercado ~53.800 € (ratio 9×), con tres escenarios de pricing.

---

## 4. Priorización recomendada (mi opinión)

Si solo se va a invertir trabajo limitado, este es el orden con mejor relación impacto/esfuerzo:

1. **✅ Plug-and-play real** (resuelto en H.1): `labs.ts` y `resources.ts` migrados a YAML por módulo. `course-paths.ts` y `COURSE_SLUG` centralizan el resto de literales. La plataforma React ya no contiene contenido del curso.

2. **✅ Quick wins** (resuelto en H.2): Atajos teclado globales, Skeleton states, code-splitting, skip links, breadcrumbs estructurados, indicador de progreso en header. Bundle inicial de 600 KB a 215 KB.

3. **✅ Multi-curso + backend** (resuelto en Fases N + P): arquitectura `/cursos/<slug>/...`, registry, storage prefijado, magic link via Supabase, schema canónico aplicado.

4. **🟢 Monetización Fase R** (en curso): R.1 foundation cerrada. Quedan R.2 admin Plain Vanilla, R.3 admin org, R.4 B2C Stripe, R.5 B2B Stripe (opcional), R.6 PDF certificado.

---

*Última actualización: 2026-05-13 tras Fase R.2.5 (admin Plain Vanilla completo: añadir admin a org desde UI con invitations pendientes, lista usuarios, lista certificados).*
