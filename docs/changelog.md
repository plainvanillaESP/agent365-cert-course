# Changelog

Registro de cambios significativos en la producción del curso.

Formato: `YYYY-MM-DD — [Tipo] Descripción`

Tipos: `[Setup]` `[Investigación]` `[Diseño]` `[Contenido]` `[Build]` `[Fix]` `[Docs]`

---

## 2026-05-12

- `[UX]` Fase L.6 — Compartir certificado en LinkedIn, X, Web Share API y copia al portapapeles.
  - **`components/ShareButtons.tsx` (nuevo)** — Botonera reutilizable con cuatro acciones: LinkedIn (sharer `feed/?shareActive=true&text=...`), X/Twitter (`twitter.com/intent/tweet`), Web Share API (solo aparece si `navigator.share` existe; útil en mobile y navegadores modernos), copia al portapapeles con `navigator.clipboard.writeText` + fallback a `window.prompt` si está bloqueado. Recibe `url`, `text`, `title` y dos variantes (`full` con icono + label, `compact` solo icono). Cualquier shell PV-Learn la puede consumir en futuros badges, recursos compartibles, etc.
  - **Iconos sociales SVG inline** — La versión instalada de `lucide-react` (1.14) no expone `Linkedin` ni `Twitter`. En lugar de añadir `react-icons` por algo tan puntual, escribí los paths oficiales simplificados como componentes funcionales (`LinkedinIcon`, `XIcon`) dentro del propio `ShareButtons`. Cero peso adicional.
  - **Integración en `Certificate`** — Sección "Compartir" debajo del botón de imprimir. Cuando el alumno ha introducido su nombre, el `text` sugerido es "He aprobado el examen de certificación {COURSE_CERT_TITLE}."; si no, queda genérico. El `url` por defecto es `window.location.href`, lo que apunta al certificado en este navegador; cuando llegue verificación pública (Fase 9 con backend), el `shareUrl` podrá apuntar a la URL verificable persistente sin tocar el componente.
- `[Build]` Validador 277 OK. tsc clean. Build OK. test:exam 34/34 OK.


- `[Perf]` Fase L.5 — Performance de imágenes: `loading="lazy"` + `decoding="async"`.
  - **`ZoomableImage`** ya tenía `loading="lazy"` en la thumbnail. Añadido `decoding="async"` en thumbnail y modal para que la decodificación no bloquee el hilo principal.
  - **`Certificate`** — logo Plain Vanilla con `decoding="async"`. Sin lazy aquí porque el certificado es la única view donde aparece y queremos que esté listo al renderizar.
  - **SVG inline** (la mayoría del contenido del curso) ya no se beneficia de lazy/decoding (es texto inline), así que no se tocan. Los SVG procesados por Vite vienen como `<img src="data:..." />` o como URL hasheada y aplican igual.
  - **srcset / variantes responsive**: no implementado en este fase. Hoy todas las imágenes del curso son SVG vectoriales que escalan sin pérdida; el coste de bytes no justifica todavía un pipeline de generación de variantes. Cuando lleguen PNG/JPG de capturas a >1600 px se podrá añadir `vite-imagetools` o un script offline; el componente `ZoomableImage` está listo para recibir `srcset`/`sizes` desde el atributo del markdown (los pasaría a través). Anotado en el roadmap.
- `[Build]` Validador 277 OK. tsc clean. Build OK. test:exam 34/34 OK.


- `[Build]` Fase L.4 — PWA con service worker (`vite-plugin-pwa`) — la plataforma es instalable y funciona offline tras la primera visita.
  - **`vite-plugin-pwa` configurado en `vite.config.ts`** — `registerType: 'autoUpdate'` (el SW se actualiza solo sin pedir permiso al alumno), `injectRegister` por defecto registra el SW automáticamente al cargar (no hace falta tocar `main.tsx`). El plugin se omite cuando `VITE_OFFLINE=1` porque ahí el bundle se sirve desde `file://` o un USB y un SW no aporta nada.
  - **Manifest** — nombre completo del curso, short_name "PV-Learn Agent 365", color brand `#9A44E5`, fondo claro `#FAFAF9`, idioma `es-ES`, scope y start_url alineados con el `base` de Vite (`/agent365-cert-course/` en producción), icono `agent365-logo-256.png` (con purpose `any` + `maskable`). Cuando lleguemos a multi-curso (fase 8) el manifest se generará por curso.
  - **Workbox / cache** — `globPatterns` cachea JS/CSS/HTML/imágenes/iconos/manifest/fuentes. `maximumFileSizeToCacheInBytes: 4 MB` para permitir chunks lazy grandes como mermaid sin saltar warnings. `navigateFallback` apunta a `index.html` para que cualquier ruta SPA funcione offline tras la primera visita. `cleanupOutdatedCaches` purga versiones viejas tras la actualización.
  - **Convivencia con el bundle offline** — `VITE_OFFLINE=1` sigue produciendo el bundle estático sin SW (mismo flujo que F.3 / pack-offline). Para el deploy normal a GitHub Pages, el SW se incluye automáticamente.
- `[Build]` Validador 277 OK. tsc clean. Build OK (159 precache entries, ~5.5 MB). test:exam 34/34 OK.


- `[a11y]` Fase L.3 — Alto contraste automático + revisión de soporte de teclado.
  - **`@media (prefers-contrast: more)`** en `index.css` — Cuando el SO/navegador lo solicita, sube los `--border-*` un escalón en la escala stone (subtle → 300, default → 400, strong → 600 en light; espejado en dark), acerca `--text-muted` a `text-secondary` para subir el contraste de texto fino, engorda el `outline` del `:focus-visible` a 3 px con offset 3 px, subraya todos los `a` dentro de `.markdown-body` (no solo on hover) y añade un outline a los `<mark>` del highlighter para que se distingan del fondo aunque el color sea sutil. Todo via CSS, sin código JS, sin intervención del alumno.
  - **DnD** (`QuestionDragAndDrop.tsx`) — Ya tenía `KeyboardSensor` configurado en `useSensors` (verificación post-revisión). Tab para entrar al ítem, Space para tomarlo, flechas para mover, Enter para soltar. La accesibilidad existía pero no estaba auditada formalmente; ahora queda documentada.
  - **Ordering** (`QuestionOrdering.tsx`) — Implementado con botones `ArrowUp`/`ArrowDown` por ítem (no drag), accesible por teclado por construcción.
  - **Focus visible global** — Ya existía en `:focus-visible { outline: 2px solid var(--color-pv-purple-500); outline-offset: 2px; }`. Bajo `prefers-contrast: more` pasa a 3/3.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK. test:exam 34/34 OK.


- `[UX]` Fase L.2 — Transiciones de página/sección con CSS, sin framer-motion.
  - **`components/Transitions.tsx` (nuevo)** — Helper `<Fade fadeKey="..." variant="fade|slide-right">` que envuelve el contenido y usa `key` para remontar al cambiar `fadeKey`, lo que dispara la animación CSS de entrada. Implementación deliberadamente ligera (sin librería) para no añadir ~30 kB de `framer-motion` por algo que se resuelve con `@keyframes`.
  - **CSS** (en `index.css`) — Dos keyframes: `pv-fade-in` (opacidad + 4 px de slide vertical, 220 ms `cubic-bezier(.22,.61,.36,1)`) y `pv-slide-in-right` (opacidad + 12 px horizontal, 260 ms). Bajo `@media (prefers-reduced-motion: reduce)` ambas se anulan, así que en accesibilidad estricta no hay movimiento.
  - **Integración en `ModulePage`** — El contenido principal de cada sección (teoría, quiz, labs, recursos) se envuelve en `<Fade fadeKey={`${moduleId}-${section}`}>`. Cambiar de pestaña dispara una animación de entrada suave; navegar entre módulos también porque `fadeKey` incluye el moduleId. El resto del shell (header, sidebar, navegación de módulos siguiente/anterior, TOC) permanece estático, solo el área central reanima.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK. test:exam 34/34 OK.


- `[UX]` Fase L.1 — Highlighter del alumno: resaltar texto sobre la teoría y los labs con cuatro colores.
  - **`lib/highlights.ts` (nuevo, ~310 líneas)** — Motor sin dependencia de React, reutilizable desde cualquier shell. Tipos `Highlight`, `HighlightColor`, `PlainTextMap`. Funciones puras:
    - `buildPlainTextMap(container)` — Walker de `TreeWalker` que construye el texto plano del contenedor + un mapeo `Text → { start, end }` para reanchorrar offsets DOM ↔ texto.
    - `locatePayload(plain, prefix, payload, suffix)` — Busca `prefix + payload + suffix` en el texto plano. Si el match con contexto es único, devuelve el rango; si no, fallback a buscar el payload solo (acepta solo si es única ocurrencia). Devuelve `null` ante ambigüedad.
    - `rangeFromPlainIndices(map, start, end)` — Convierte un par de offsets en el texto plano en un `Range` DOM que abarca esos chars (potencialmente cruzando text nodes).
    - `wrapRangeWithHighlight(range, id, color)` — Aplica `<mark>` a los text nodes intersectados por el rango, splitando inicios/finales según haga falta. Maneja rangos multi-nodo.
    - `highlightFromSelection(container, selection, color)` — Construye el objeto `Highlight` a partir de la selección actual del navegador, con `prefix`/`suffix` de hasta 16 chars para reanchorrar tras recargas.
    - `paintHighlight(container, h)` / `unpaintHighlight(container, id)` — Aplican y eliminan marks; el unpaint llama a `parent.normalize()` para mergear text nodes adyacentes y no fragmentar el DOM (lo que rompería búsquedas posteriores).
  - **`hooks/useHighlights(moduleId, section)` (nuevo)** — Carga, añade, borra y limpia con persistencia en `agent365-highlights-m{N}-{section}`. Emite `CustomEvent('pv-learn:highlights-changed')` para que componentes ajenos que muestren contadores se sincronicen sin acoplarse al hook.
  - **`components/Highlighter.tsx` (nuevo)** — Orquestador. Recibe `getContainer: () => HTMLElement | null` en lugar de un ref directo, lo que desacopla el highlighter del componente que renderiza el markdown — útil para que cualquier shell future-proof pueda montarlo sin tener que forward-refear el `<article>`. Capacidades:
    - Escucha `mouseup`/`touchend` globales, filtra selecciones que no caigan dentro del contenedor objetivo, descarta selecciones < 3 caracteres (`MIN_HIGHLIGHT_LEN`).
    - Renderiza una `HighlighterBar` flotante con paleta de 4 colores (`yellow`, `green`, `pink`, `purple`) absoluta al documento (no fixed, así sigue la selección al scrollear).
    - Click sobre un `<mark>` ya pintado muestra la barra con `Trash2` para quitar.
    - `useLayoutEffect` re-aplica al DOM la lista persistida tras cambio de `contentKey` (la composición `${moduleId}-${section}`). Antes del paint hace una limpieza preventiva con `parent.normalize()` para fusionar text nodes residuales y mantener los offsets reanchorrables.
    - `onMouseDown` en la barra hace `preventDefault` para no robar el rango antes de que el handler de color dispare en mouseup.
  - **Robustez frente a cambios de contenido** — `prefix` + `suffix` permiten que, si el editor cambia ligeramente la teoría, los highlights existentes sigan reanchorrándose mientras el fragmento exacto siga en el texto. Si no encuentra match único, el highlight queda "huérfano": persiste en localStorage pero no se pinta. No se borra automáticamente.
  - **CSS** (en `index.css`) — Cuatro variantes de color con tonos claros para el modo light (`#fff59d`, `#c8e6c9`, `#f8bbd0`, `#d1b3ff`) y versiones translúcidas para el modo dark con `rgba(...)` para que el texto siga legible. `transition: background-color 0.12s ease-out` para feedback al hover.
  - **Integración en `ModulePage`** — Solo se monta cuando `section === 'teoria' || section === 'laboratorios'`. El `getContainer` busca el `article.markdown-body` que `MarkdownRenderer` siempre monta. En quiz/recursos no se activa.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK. test:exam 34/34 OK.


- `[UX]` Fase K.2 — Confetti al aprobar + soporte Mermaid en teoría.
  - **`lib/confetti.ts` (nuevo)** — Wrapper sobre `canvas-confetti` con tres añadidos: (1) lazy-load de la librería (no entra en el bundle inicial), (2) respeto a `prefers-reduced-motion` (no-op silencioso si el SO lo pide), (3) paleta Plain Vanilla por defecto (`#9A44E5 → #F68DAC` con tonos intermedios y blanco). Exporta `celebrate()` (ráfaga corta de dos lados, ~700 ms) para hitos pequeños y `celebrateBig()` (1.5 s de ráfagas escalonadas) para el examen final.
  - **Quiz** — Al validar con `score === total && total > 0`, lanza `celebrate()`. El feedback de "100 %" sigue existiendo en el `QuizResult` independientemente, así que sin animación el alumno también recibe el feedback. La política es la del quiz oficial (modo `full`); en modo `adaptive` no se lanza confetti, porque no es un intento oficial.
  - **ExamResult** — `useEffect` lanza `celebrateBig()` al primer render con `passed === true`. La dependencia `[passed, attempt.id]` evita repetir la celebración si el alumno navega atrás al mismo intento.
  - **`components/MermaidBlock.tsx` (nuevo)** — Componente que renderiza bloques `mermaid` del markdown del curso a SVG inline. Detalles:
    - **Lazy-load** de la librería Mermaid (~500 kB) via `import('mermaid')` cacheado en un singleton de módulo. Hoy ningún módulo usa Mermaid, pero queda listo para módulos futuros que necesiten diagramas (flowcharts, sequence diagrams, architecture) sin tocar la plataforma.
    - **Inicialización** con `securityLevel: 'strict'` (sanitiza texto), tema `dark`/`neutral` según `documentElement.classList.contains('dark')` en el primer render, y la familia tipográfica del producto (`Instrument Sans, …`).
    - **Resiliencia**: si Mermaid no consigue parsear, se renderiza un callout amber con el código fuente y el mensaje de error, sin romper el render del módulo entero.
    - **a11y**: estado `Cargando diagrama…` con `role="status"` mientras el chunk se descarga; el SVG generado se inyecta como `dangerouslySetInnerHTML` (input controlado por el contenido del paquete del curso, no input del alumno).
  - **`MarkdownRenderer`** — El callback `pre` ahora detecta `<code class="language-mermaid">` y, en ese caso, renderiza `<MermaidBlock>` envuelto en `<Suspense>` (el componente se carga via `React.lazy`). El resto de lenguajes pasa por `rehype-highlight` como antes. Helper `extractMermaidSource()` aplana `children` (que viene tokenizado a veces) en string plano.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK. test:exam 34/34 OK. Bundle inicial 284 KB (gzip 89 KB; +20 KB gzip por el reparto de chunks que Rolldown hace al añadir el grafo de mermaid). Los chunks pesados de Mermaid (cytoscape 434 KB, katex 257 KB, varios diagrams 60–98 KB) son **lazy** y solo se descargan en módulos que efectivamente rendericen un diagrama.


- `[UX]` Fase K.1 — Modo focus (Pomodoro 25/5) con timer flotante y contadores persistentes.
  - **`lib/focusStore.ts` (nuevo)** — Store singleton a nivel de módulo con suscriptores. Tres fases: `idle`, `work` (25 min), `shortBreak` (5 min). Tick por `setInterval(1s)` que decrementa `secondsRemaining` y, en fase `work`, incrementa `totalSeconds` acumulado (persistido cada 30 s para no machacar `localStorage`). Al cerrar un bloque de trabajo, transición automática a `shortBreak`. Al cerrar un descanso vuelve a `idle` y para el tick — más respetuoso que arrancar otro work sin consentimiento. `skipPhase()` cierra la fase actual (un work saltado contabiliza como pomodoro, decisión del alumno).
  - **Persistencia ligera** — `agent365-focus-pomodoros-total`, `agent365-focus-total-seconds` (vida del navegador), `agent365-focus-pomodoros-today` con `agent365-focus-pomodoros-today-date` (reset al cambiar de día ISO). El temporizador en sí NO persiste: si el alumno recarga, el timer descarta. Pomodoros completados sí. Evita la complejidad de calcular `startedAt + duracion - now` con pausas, system clock drift, etc.
  - **`hooks/useFocusMode.ts` (nuevo)** — Hook fino sobre el store via `useSyncExternalStore(subscribe, getSnapshot, getSnapshot)`. Devuelve el estado + las acciones (`startWork`, `pause`, `resume`, `stop`, `skipPhase`).
  - **`components/FocusTimer.tsx` (nuevo)** — Tarjeta flotante bottom-right del viewport, oculta cuando `phase === 'idle'`. Diseño:
    - Barra de progreso superior con `transition-[width] 1s linear`, respeta `prefers-reduced-motion`.
    - Icono y color contextual: `Timer` en púrpura para work, `Coffee` en verde para shortBreak.
    - mm:ss grande en font-mono tabular-nums.
    - Acciones: Pausar/Reanudar, Saltar (con tooltip que explica que un work saltado cuenta el pomodoro).
    - Contador del día solo aparece tras el primer pomodoro completado, con el tiempo total acumulado en formato legible (min / h).
    - `pb-[env(safe-area-inset-bottom)]` para iOS notch.
  - **Atajo global `f`** (grupo "Vista") — Si la fase es `idle`, arranca un bloque de trabajo. Si está corriendo, pausa; si está pausado, reanuda. La lógica vive en `App.tsx` y consume el store directamente (sin hook) porque solo necesita el snapshot puntual en el handler del atajo.
  - **Botón Timer en el Header** — Junto al toggle de modo lectura. Con `aria-pressed` que refleja si el timer está activo y fondo púrpura tenue en ese caso. Click cuando idle → arranca work; click cuando activo → para todo (stop) para resetear sin tener que tocar el panel flotante.
  - **Integración con modo lectura** — Son ortogonales: el alumno puede combinarlos manualmente (`i` + `f`). No fuerzo el reading mode al arrancar focus para no presumir que es lo que el alumno quiere.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK. test:exam 34/34 OK. Bundle inicial 226 KB (+7 KB sobre J.1 por el store + el componente que están en el bundle inicial al ser globales).


- `[UX]` Fase J.1 — TOC mejorado + Modo lectura inmersivo.
  - **`TableOfContents` reescrito** — La versión anterior se quedaba con el primer heading que intersectaba el viewport (con `break` al primer match en `entries`), lo que producía parpadeos al scrollear rápido. Nueva implementación:
    - Mantiene un `Set` en `useRef` con los IDs visibles en cada momento; al recibir entries del `IntersectionObserver` actualiza el set y elige el primero en **orden de documento**. Si entre dos headings no hay ninguno visible, conserva el último activo (no se pierde el highlight al pasar por el "hueco").
    - Marca como **leídos** los headings por los que ya ha pasado el activo, con un dot púrpura tenue a la izquierda. El alumno ve dónde ha avanzado aunque vuelva atrás.
    - `MutationObserver` sobre `.markdown-body` para reconstruir la lista si el contenido cambia (carga diferida de imágenes que reordena IDs, navegación SPA sin desmontar el componente).
    - Conserva `scroll-margin-top` ya existente en CSS para que el scroll de anclaje respete la altura del header sticky.
  - **`useReadingMode` (nuevo)** — Toggle persistente en `localStorage` bajo `agent365-reading-mode`. Aplica `data-reading-mode="on"` al `<html>` (no a `body`) para que las reglas CSS sean estables incluso en chunks lazy. Sincroniza entre pestañas via `storage` event y entre componentes via custom event `pv-learn:toggle-reading-mode`. No persiste por módulo: es preferencia del alumno.
  - **CSS del modo lectura** — Cuando `html[data-reading-mode='on']`:
    - Ocultar la `nav[aria-label='Navegación del curso']` (sidebar de módulos) y la TOC lateral.
    - Cambiar el grid de dos columnas del `ModulePage` a un `display: block` con `max-width: 780px` centrado. Esto ensancha el texto solo cuando el alumno lo quiere.
    - `.markdown-body` sube a `font-size: 16px`, `line-height: 1.72` y `letter-spacing: 0.005em` para favorecer la lectura larga.
  - **Toggle visible** — Icono `Glasses` (Lucide) en el header junto al toggle de tema, con `aria-pressed` que refleja el estado y fondo púrpura tenue cuando está activo. Atajo global `i` (de "inmersivo") en grupo "Vista" del modal de ayuda.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 0.55s. test:exam 34/34 OK. Bundle inicial 219 KB (gzip 68 KB); CSS 84 KB (+1 KB por las reglas del modo lectura).


- `[UX]` Fase I.2 — Práctica adaptativa: reinyectar las preguntas falladas con cooldown.
  - **`hooks/useQuizState.ts` ampliado** — Nuevo modo de práctica `PracticeMode = 'full' | 'adaptive'`. El modo `full` es el quiz oficial de toda la vida: persiste en `history` y notifica al motor de progreso (`agent365-progress-changed`). El modo `adaptive` es una ronda de repaso con solo las preguntas falladas en la última submisión; **NO persiste en `history`** ni cuenta para el progreso, así no se contamina el modelo de "primera vez aprobado".
  - **Cooldown** — Tras acertar una pregunta en modo adaptativo, ésta entra en cooldown de **30 minutos** (`ADAPTIVE_COOLDOWN_MS`). Las preguntas con cooldown activo NO se incluyen en futuras rondas adaptativas, así el alumno no machaca la misma cuando ya la dominó. La persistencia vive en `agent365-quiz-m{N}-cooldowns` (`{ questionId: untilTimestamp }`); al cargar se descartan automáticamente los cooldowns ya expirados. `clearHistory()` también borra las cooldowns.
  - **Nuevos exports del hook**: `mode`, `startAdaptiveRound()`, `lastFailedCount`, `adaptivePendingCount`. La derivación de "preguntas falladas en la última submisión" usa `submission.answers` y los predicados de `isAnswerCorrect` ya existentes, así que es estable contra cualquier shape de pregunta (`mc`, `mr`, `dnd`, `order`).
  - **`Quiz.tsx`** — Muestra dos botones tras validar en modo full: `Repasar las N que fallaste` (lanza ronda adaptativa) y `Reiniciar práctica`. Si todas las falladas están en cooldown, se muestra una nota en su lugar para que el alumno sepa por qué no puede repasarlas ahora. En modo adaptativo, los botones cambian a `Otra ronda · N pendientes` (si quedan falladas) y `Volver al quiz completo`. Por encima de todo el quiz, un `AdaptiveBanner` purple-tinted explica que está en modo repaso y aclara que no cuenta para el progreso.
  - **Diseño defensivo**: el `setMode/reset` resetea `currentAnswers` al subset de preguntas correspondientes para que no queden respuestas huérfanas. `validate()` actualiza cooldowns únicamente en modo `adaptive`, así una ronda full sin fallos no produce cooldowns. La ordenación de preguntas en la ronda adaptativa respeta el orden original del banco (no aleatoriza); si en el futuro se quiere shuffle, se hace en una capa nueva.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 0.58s. test:exam 34/34 OK.


- `[UX]` Fase I.1 — Notas del alumno por módulo: bloc lateral con persistencia y export a `.md`.
  - **`platform/src/hooks/useNotes.ts`** (nuevo) — Hook que carga, edita, guarda y exporta las notas del alumno para un módulo. Persistencia en `localStorage` bajo la clave `agent365-notes-m{N}` (prefijo legacy por compatibilidad; cuando llegue la fase 8 multi-curso se migrará a `pv-learn-{slug}-notes-m{N}`). Escritura **debounced 300 ms** tras la última pulsación para no machacar `localStorage` en cada tecla. Si `localStorage` no está disponible (modo privado / quota llena), degrada en silencio y deja el texto solo en memoria. Expone `notes`, `setNotes`, `savedAt`, `status` (`idle`/`pending`/`saved`), `clear()`, `exportToMd(moduleTitle)`, `characterCount`, `wordCount`.
  - **`platform/src/components/NotesPanel.tsx`** (nuevo) — Drawer lateral derecho con cabecera, textarea de markdown que ocupa todo el alto, footer con métricas + estado de guardado + acciones (exportar / borrar con confirm inline) y un disclaimer con la nota legal de que las notas viven en este navegador. Animación con `transition-transform` (respeta `prefers-reduced-motion`). En pantallas `< lg` aparece un backdrop con click-to-close; en desktop el panel convive con la lectura sin oscurecer el resto para que el alumno pueda escribir mientras lee. Foco automático en el textarea al abrir, con un retraso de 220 ms para que la transición no robe el caret.
  - **Export a `.md`** — `exportToMd()` construye un markdown con frontmatter (`modulo`, `titulo`, `fecha_exportacion`) y descarga via `Blob` + `<a download>`. El nombre del fichero sigue el patrón `notas-modulo-NN.md`. El `URL.revokeObjectURL` se difiere 100 ms para no abortar la descarga en Safari.
  - **Atajo `n`** — Vive en `App.tsx` (global, aparece en el modal de ayuda) pero solo dispara cuando `currentModuleId !== null`. Comunica con `ModulePage` vía `CustomEvent('pv-learn:toggle-notes')` que el panel escucha en su `useEffect`. Evita acoplamientos directos y mantiene el atajo en el sitio donde se inventarian el resto.
  - **Botón visible en la cabecera del módulo** — Pildora `Notas` con icono `NotebookPen` y la tecla `N` como `<kbd>` (solo en `md+`). Cuando el panel está abierto, el botón cambia a fondo púrpura tenue (`bg-pv-purple-500/15`) y `aria-expanded="true"`. Sustituye el flex anterior de tabs por un `flex justify-between` para alinear las tabs a la izquierda y el botón a la derecha.
  - **Cierre automático al cambiar de módulo** — `useEffect([moduleId])` resetea `notesOpen` a `false` para que el alumno no piense que las notas del módulo anterior siguen abiertas al saltar con `j`/`k`.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 0.6s. test:exam 34/34 OK. Bundle inicial 217 KB (sin cambios); `ModulePage` 401 KB (+8 KB por el NotesPanel y el hook).


- `[UX]` Fase H.3 — Búsqueda global con `Cmd+K`: paleta de comandos sobre todo el contenido del curso.
  - **`platform/src/lib/search.ts`** (nuevo, ~310 líneas) — Construye un índice en memoria sobre cinco fuentes editoriales del paquete del curso: títulos de módulo + área, secciones de teoría troceadas por headings H2/H3, enunciados de las preguntas del quiz, escenarios de los laboratorios y enlaces de recursos. El índice es **lazy** (se calcula la primera vez que se invoca `searchCourse`) y vive en memoria mientras dura la sesión. Como todo el contenido viene de `import.meta.glob` eager ya cargado en el bundle, no hay I/O.
  - **Matching pragmático sin librería externa**: tokeniza la query, normaliza tildes con `String.normalize('NFD')` + strip de combining marks, exige AND de todos los tokens (resultado solo se muestra si todos los tokens aparecen, en título o body). Scoring por capas: peso base por tipo (módulos > teoría > quiz > labs > recursos) + boost si el match cae en el título (doble si está al inicio) + bonus si los tokens aparecen como frase contigua. Tope de 20 resultados.
  - **`highlight(text, query)`** — Devuelve segmentos `{ text, match }` para renderizar con `<mark>` sin reemplazos peligrosos en HTML. Mergea rangos solapados para que tokens contiguos no produzcan etiquetas anidadas.
  - **`platform/src/components/SearchPalette.tsx`** (nuevo) — Modal con input de búsqueda, lista de resultados agrupada por tipo (Módulos / Teoría / Quiz / Laboratorios / Recursos), iconos Lucide por categoría (`Hash`, `BookOpen`, `ListChecks`, `FlaskConical`, `Link`), snippets con `<mark>` resaltando los tokens encontrados, tag visible del tipo a la derecha. Navegación completa con teclado: `↑`/`↓` mueve, `Enter` abre, `Home`/`End` saltan, `Esc` cierra. El `data-search-idx` permite que `scrollIntoView({ block: 'nearest' })` mantenga el item activo visible.
  - **Atajos globales nuevos** en `App.tsx`: `Cmd+K` (Mac) / `Ctrl+K` (Win/Linux) abre la paleta — funciona incluso dentro de inputs (`enableInInputs: true`). `/` abre la paleta cuando el foco no está en un input (estilo GitHub/GMail). El handler de `Escape` cierra primero la paleta, luego el modal de atajos, luego el sidebar móvil, en ese orden.
  - **Botón visible en `Header`** — En desktop: pildora con icono lupa + texto "Buscar" + `<kbd>⌘K</kbd>` (`Ctrl+K` fuera de Mac). En mobile: `IconButton` compacto con solo el icono. Detección de Mac via `navigator.userAgent` en `IS_MAC`.
  - **Code-splitting**: `SearchPalette` se carga vía `React.lazy()` y solo cuando `searchOpen` es `true` (gated por `&&` antes del `<Suspense>`, evita prefetch innecesario al cargar `App`). El componente arrastra el índice completo (~12 KB gzip propio + chunks compartidos `quiz` 128 KB gzip y `resources` 215 KB gzip que ya se cargan al entrar en un módulo). El bundle inicial se mantiene en **217 KB** (gzip 67.75 KB), prácticamente sin regresión vs H.2.
  - **`Modal.contentClassName="!max-w-2xl"`** se usa con `!` para forzar el max-width sobre el de `size="lg"` y dar al palette algo más de aire horizontal sin que se sienta enorme en pantallas grandes.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 0.55s. test:exam 34/34 OK.


- `[UX]` Fase H.2 — Quick wins UX: breadcrumbs, atajos de teclado, indicador de progreso, skeletons, code-splitting y skip link.
  - **`Breadcrumbs`** (`components/Breadcrumbs.tsx`) — Componente reutilizable con marcado semántico (`aria-label="Breadcrumb"`, `aria-current="page"` en el último item) y datos estructurados schema.org `BreadcrumbList` incrustados como JSON-LD para SEO. Reemplaza el breadcrumb inline que `ModulePage` tenía.
  - **`useKeyboardShortcuts` + `ShortcutsModal`** — Hook centralizado de atajos globales que escucha en `document`, normaliza combinaciones (`meta`/`shift`), auto-skip dentro de inputs (con `enableInInputs` para opt-in) y modal de ayuda que agrupa los atajos por categoría.
    - Atajos definidos en `App.tsx`: `?` (ayuda), `g`/`p`/`e`/`s` (navegación a inicio/progreso/examen/ajustes), `j`/`k` (módulo siguiente/anterior preservando la sección), `t`/`q`/`l`/`r` (cambiar de sección dentro de un módulo: Teoría/Quiz/Labs/Recursos), `Escape` (cerrar diálogos).
    - Helpers `KeyChip`, `KeyCombo`, `shortcutKeys()` para renderizar combinaciones con tipografía `<kbd>` mono, respetando platform (`⌘` en Mac, `Ctrl` en Windows/Linux).
  - **Indicador de progreso en header** — `Header.tsx` consume `useCourseProgress()` y muestra una pildora con el % completado del curso (secciones completadas / totales). El cálculo es lineal y estable, no media de booleanos por módulo. Solo aparece cuando hay progreso > 0%. `aria-label` descriptivo para lectores de pantalla.
  - **`Skeleton` + `SkeletonParagraph` + `WhenReady`** (`components/Skeleton.tsx`) — Placeholders de carga con shimmer suave (animación CSS `pv-skeleton-shimmer`, respeta `prefers-reduced-motion`). Tres formas: `line` (default), `circle`, `rect`. `SkeletonParagraph` para previsualizar varios renglones con anchos variables. `WhenReady` para envolver condicionalmente. Sustituye los "Cargando…" inertes que había aquí y allá.
  - **Code-splitting por ruta** — `App.tsx` refactorizado para usar `React.lazy()` + `Suspense` por página. El bundle inicial baja de ~600 KB a **215 KB** (gzip 67 KB). El resto se descarga bajo demanda: `HomePage` (3.5 KB), `SettingsPage` (8 KB), `ProgressPage` (13 KB), `CertificatePage` (11 KB), `ExamPage` (33 KB). `ModulePage` sigue grande (1 MB) porque empaqueta todo el contenido markdown del curso, pero solo se descarga al entrar en un módulo.
  - **Skip link** al inicio del shell — `<a href="#main-content">Saltar al contenido</a>` oculto con `sr-only` que aparece visible al recibir foco con Tab. Apunta al `<main>` con `id="main-content"` y `tabIndex={-1}` para que el foco se mueva correctamente.
  - **`docs/componentes-reutilizables.md`** ampliado con secciones de `Breadcrumbs`, `Skeleton` (familia) y atajos de teclado (`useKeyboardShortcuts`, `ShortcutsModal`, `KeyChip`, `KeyCombo`) documentados con ejemplos y tablas de props.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 1.31s. test:exam 34/34 OK.


  - **Migración masiva de `lib/labs.ts` y `lib/resources.ts` a archivos YAML** dentro de cada módulo del curso. La plataforma React ya no contiene ningún dato editorial del curso; solo tipos, parsers y funciones puras.
    - `platform/src/lib/labs.ts`: de **173 líneas** (datos M01 inline) a **137** (solo tipos y API). Los datos pasan a `cursos/agent365-cert/modulos/modulo-01-fundamentos/lab.yaml`.
    - `platform/src/lib/resources.ts`: de **1.711 líneas** (datos de M01–M08 inline) a **118** (solo tipos, API y `hostnameOf`). Los datos pasan a `cursos/agent365-cert/modulos/<modulo>/recursos.yaml` (8 archivos generados).
    - Reducción total: **1.884 líneas → 255 líneas** (-87%).
  - **9 archivos YAML nuevos en el paquete del curso**: `modulo-01-.../lab.yaml` (10 escenarios, 6 productos, 3 errorPatterns) y `modulo-{01..08}-.../recursos.yaml` (9+7+6+5+6+7+6+6 categorías, ~168 recursos en total, 29 cross-references). Cada archivo lleva su cabecera con el formato documentado.
  - **`platform/src/lib/course-paths.ts` ampliado** con `loadLabsGlob()` y `loadResourcesGlob()`. Los nuevos globs siguen el patrón establecido en G.6: solo este archivo tiene literales `cursos/agent365-cert/…` por necesidad técnica de Vite (que exige strings literales en `import.meta.glob`).
  - **Mecánica de carga**: ambos módulos hacen lookup via `Map<moduleId, datos>` calculado una vez al cargar el bundle. Si un módulo no tiene `lab.yaml` o `recursos.yaml`, los getters devuelven `null` y el componente cae al fallback markdown sin error. Esto permite producir módulos sin lab interactivo o sin recursos estructurados sin esfuerzo extra.
  - **Tipo `ProductId`** pasa de unión literal `'A365' | 'CCS' | ...` a `string`. Pierde autocompletado en el componente Lab pero el coste es mínimo (el componente nunca enumera productos a mano, los itera). A cambio, añadir un producto nuevo en otro curso solo requiere editar el YAML.
  - **`docs/reusar-plataforma.md`** actualizado: la lista de archivos por módulo ahora incluye `lab.yaml` y `recursos.yaml` como puntos de extensión opcionales del contenido editorial.
  - **`docs/roadmap-y-deuda-tecnica.md`** actualizado: la sección 1.1 (contenido hardcoded) pasa de 🔴 Crítico a ✅ Resuelto. Esto cierra la deuda técnica más grande de cara a la fase 8 (multi-curso).
- `[Build]` Validador: 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 1.85s. test:exam 34/34 OK.


  - **Nuevo `docs/roadmap-y-deuda-tecnica.md`** — Documento vivo con tres bloques:
    1. **Audit técnico** del estado actual de plug-and-play: identifica `lib/labs.ts` (173 líneas) y `lib/resources.ts` (1.711 líneas) como contenido del curso hardcoded en la plataforma (deuda técnica 🔴), los dos `import.meta.glob` con paths a `cursos/agent365-cert/` (🟡), las storage keys con prefijo `agent365-` (🟢), comentarios JSDoc obsoletos y `index.html` con meta tags del curso.
    2. **Propuesta UX/UI top-class**: 30+ mejoras agrupadas en navegación (búsqueda global, atajos de teclado, breadcrumbs), aprendizaje activo (notas, highlighter, modo focus, práctica adaptativa, flashcards SM-2), visual (skeletons, transiciones, confetti, modo lectura), multimedia (vídeo con marcadores, Mermaid, code playgrounds), accesibilidad (audit AAA, skip links, code-splitting, PWA), social (compartir certificado, verificación pública, Open Badges) e i18n.
    3. **Plan de producción restante**: Fase 8 (plataforma multi-curso, 23–35 h), Fase 9 (backend + auth, 40–54 h), Fase 10 (panel admin, 32–47 h) y bloque de comercialización (decisión de Miguel pendiente).
  - **Dos fixes baratos del audit aplicados**:
    - **`COURSE_SLUG` y `STORAGE_PREFIX` en `lib/course.ts`** — Constantes derivadas pensadas para servir varios cursos desde el mismo dominio sin colisión de localStorage. Hoy los hooks siguen usando el prefijo legacy `agent365-…` por compatibilidad con alumnos con progreso ya guardado; cuando llegue la fase multi-curso se migra con un step de un-shot que renombra keys.
    - **`lib/course-paths.ts`** (nuevo) — Centraliza los dos `import.meta.glob` con literales `cursos/agent365-cert/…` que existían dispersos en `lib/exam.ts` y `lib/quiz.ts`. Es el **único archivo de la plataforma** donde aparece el slug por necesidad técnica de Vite. `reusar-plataforma.md` actualizado para reflejarlo.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 3.04s. test:exam 34/34 OK.


  - **Cinco componentes nuevos**, todos pensados como bloques reutilizables que cualquier curso PV-Learn futuro puede usar sin modificar:
    - **`Badge`** (`components/Badge.tsx`) — Pildora de texto con siete variantes semánticas (`neutral`, `success`, `warning`, `danger`, `info`, `brand`, `frontier`), tres tamaños (`xs`, `sm`, `md`), soporte de `dot` y `icon`, y modo interactivo (`onClick`). Reemplaza los pills inline duplicados en `HomePage`, `ProgressPage`, `NavSidebar` y otros.
    - **`ModuleRow`** (`components/ModuleRow.tsx`) — Representación única de un módulo en cualquier listado. Dos variantes: `list` (home, futuros catálogos) con icono de estado, número, título, duración, badge y flecha; `sidebar` (navegación lateral) compacta con número + título y soporte para sub-secciones como `children`. Elimina la triplicación previa entre HomePage, NavSidebar y ProgressPage.
    - **`Stat`** y **`StatsGrid`** en `components/Layout.tsx` — Métrica destacada con label uppercase pequeño + valor grande tabular-nums + hint opcional. La rejilla compone los bordes finos del grid automáticamente. Reemplaza la función `Stat` interna que HomePage tenía duplicada.
    - **`PageHeader`** (`components/PageHeader.tsx`) — Cabecera estándar con dos modos: **hero** con logo grande a la izquierda (para landings tipo home) y **simple** sin logo (para páginas internas). Eyebrow + título + descripción + acciones. Elimina los headers ad-hoc que cada página inventaba con tamaños y tracking distintos.
    - **`Modal`** (`components/Modal.tsx`) — Modal base con createPortal a `document.body`, bloqueo de scroll, focus inicial, Escape para cerrar, click en backdrop (configurable), tamaños `sm/md/lg/auto` y modo `bare` (sin chrome, para contenidos con su propio diseño como el lightbox). Cualquier modal nuevo de la plataforma debe consumirlo.
  - **Seis refactors** aplicando los nuevos componentes:
    - `HomePage` — Hero local sustituido por `PageHeader` con logo; StatsGrid local sustituido por `StatsGrid` + `Stat` de Layout; `ModuleRow` propio eliminado (usa el compartido).
    - `NavSidebar` — `ModuleItem` propio eliminado. Las sub-secciones del módulo activo pasan ahora como `children` de `ModuleRow`.
    - `ProgressPage` — `SectionHeader` propio eliminado; usa `Section` compartido. `LockedBanner` (div estilizado a mano con borde amber y texto) sustituido por `<Callout kind="warning">`. Tres pills inline (Pendiente / Bloqueado / Completado) en su `ModuleRow` propio migrados a `<Badge>`. Cabecera principal usa `PageHeader` con `COURSE_TITLE` (antes literal `"Microsoft Agent 365 IT Admin"`).
    - `SettingsPage` — Cabecera propia sustituida por `PageHeader`. El confirm del importador de progreso usa `COURSE_TITLE` (antes literal `"Agent 365"`).
    - `ExamPreStart` — Cabecera propia sustituida por `PageHeader`.
    - `ModulePage` — h1 propio sustituido por `PageHeader`. Las tabs de sección (Teoría/Quiz/Labs/Recursos) quedan inline porque son específicas de esta página.
    - `ZoomableImage` — Refactor para usar `Modal` con `bare={true}`. Mecánica de portal/Escape/scroll-lock viene de `Modal`. El zoom, drag, wheel y atajos siguen aquí.
    - `ConfirmDialog` en `ExamInProgress` — Refactor para usar `Modal` con `header` y `footer`. Mecánica común consolidada.
  - **`docs/componentes-reutilizables.md`** ampliado con secciones de `PageHeader`, `Stat`/`StatsGrid` y `Modal` documentadas con ejemplos de uso y tabla de props clave.
- `[Build]` Validador: 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 1.74s. test:exam 34/34 OK.


  - **Fix: lightbox vacío al ampliar imagen.** El `<div>` lienzo del modal anterior tenía `transform: scale(1)` + `max-width: 95vw` + `max-height: 95vh` sin width/height explícitos. Mientras la imagen del modal cargaba (o si su `src` cambiaba), el div padre colapsaba a 0x0 y nunca volvía a expandirse correctamente en algunos navegadores. **Refactor**: la imagen va directamente al flex container del modal, el `transform` se aplica a la imagen, y `e.stopPropagation()` en su `onClick` evita que el click sobre la imagen cierre el modal.
  - **Mejoras UX del lightbox**:
    - **Loading state**: spinner (`Loader2`) mientras la imagen del modal carga. Suele venir del cache (carga instantánea), pero cubre el caso edge.
    - **Wheel zoom**: rueda del ratón sobre el modal hace zoom continuo (paso 0.25, rango 0.5–4×).
    - **Double click**: resetea zoom y offset a 100 % y centrado.
    - **Pointer capture**: drag con `setPointerCapture` para que el pan funcione bien cuando el cursor sale temporalmente de la imagen.
    - **Constantes extraídas**: `MIN_SCALE`, `MAX_SCALE`, `SCALE_STEP` al inicio del archivo.
    - **`touch-action: none`**: para móvil, evita que el navegador intente gestos por defecto sobre la imagen del modal.
  - **Sistema de componentes consolidado** (todo reutilizable):
    - **`platform/src/components/Layout.tsx`** (nuevo) — Exporta `Section`, `Card`, `EmptyState`. Son los patrones de layout que la home, settings y otras páginas estaban duplicando. Ahora un único punto de verdad para presentaciones de sección, contenedores con borde y estados vacíos.
    - **`platform/src/components/Callout.tsx`** (nuevo) — Bloque de aviso con icono y color semántico. Mismas cinco variantes que los blockquotes de markdown (`info`, `warning`, `success`, `tip`, `capture`), pero invocable desde JSX en cualquier sitio. El lenguaje visual es idéntico al de los callouts del contenido del curso, así que la experiencia se mantiene coherente entre módulos y páginas de UI.
    - **`platform/src/pages/HomePage.tsx`** — Eliminadas las funciones locales `Section` y `Card`, ahora importadas de `Layout`. Los `<Card>` que envuelven listas con `divide-y` usan `flush` para no añadir padding extra.
    - **`platform/src/pages/SettingsPage.tsx`** — Eliminada la función local `Section` (era una variante más simple, sin eyebrow). El sistema de avisos contextuales (notice) ya no usa un div estilizado a mano, sino `<Callout kind="success" />` / `<Callout kind="warning" />`. Coherencia visual con los callouts del contenido.
  - **`docs/componentes-reutilizables.md`** — Nueva sección "Layout y avisos" documentando `Section`, `Card`, `EmptyState` y `Callout` con ejemplos de uso. Catálogo completo del design system disponible.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 1.92s. test:exam 34/34 OK.

- `[UX]` Fase G.3 — Fix imágenes invisibles + coherencia visual + catálogo de componentes.
  - **Fix: imágenes invisibles en teoría y labs.** El `<button>` con `inline-block` que envolvía cada imagen en `ZoomableImage` colapsaba el ancho del `<img>` cuando react-markdown renderiza la imagen dentro de un `<p>`. Cambiado a `<span role="button" tabIndex={0}>` con `display: block` y handler `onKeyDown` para Enter/Space (accesibilidad de teclado preservada). Las imágenes vuelven a verse con el tamaño que markdown les daba antes de F.2.
  - **Coherencia visual: callouts aplican en toda la plataforma.** Los callouts (info / warning / success / tip / capture) ahora se renderizan en teoría, labs y recursos. Antes solo aplicaban en `variant="lab"`, lo que rompía la coherencia visual entre secciones. Cambios:
    - `MarkdownRenderer.tsx`: el componente `blockquote` clasifica siempre via `classifyCallout()`, no solo en variant lab.
    - `index.css`: los selectores `.markdown-lab blockquote.callout-*` movidos a `.markdown-body blockquote.callout-*`. Añadido `background-image: none` para anular el linear-gradient del blockquote por defecto y evitar conflicto de cascada.
    - Pasos numerados visuales con bullets en gradient brand siguen solo en `markdown-lab` (es lo específico de ejercicios prácticos; en teoría las listas ordenadas no son "pasos").
  - **Nuevo `docs/componentes-reutilizables.md`** — Catálogo del design system: render de markdown (`MarkdownRenderer` con su variante `lab`, `InlineMarkdown`, `ZoomableImage`), botones (`Button`, `ButtonLink`, `ButtonAnchor`, `IconButton`), patrones (cards, sections, badges), tokens visuales (colores, tipografía, espaciado) e iconografía. Define la regla "tres usos justifican un componente" para mantener el set acotado. Enlazado desde `reusar-plataforma.md`.
- `[Build]` Validador 277 OK / 0 warnings / 0 errors. tsc clean. Build OK 1.44s. test:exam 34/34 OK.

- `[UX]` Fase G.2 — Portada genérica: eliminado el roadmap de producción de la home y parametrizados los textos hardcoded de Agent 365.
  - **`platform/src/pages/HomePage.tsx`** — Eliminada la sección "Estado de producción" (roadmap de fases 0-9 del desarrollo interno del curso). Esta información no aporta al alumno y es específica de Agent 365. Eliminados también los componentes `PhaseRow`, `PhaseIcon`, `PhaseBadge`, las interfaces `Phase` y `PhaseStatus`, y el array `PHASES`. La home queda con Hero → StatsGrid → Áreas de competencia → Temario.
  - **Plataforma plug-and-play.** Sustituidos los literales hardcoded por constantes leídas de `lib/course.ts`. Cambiar de curso ahora se reduce a editar metadatos en un solo archivo:
    - `COURSE_TITLE`, `COURSE_EYEBROW`, `COURSE_DESCRIPTION`, `COURSE_LOGO` → usados en `HomePage` (Hero) y `Header`.
    - `COURSE_CERT_TITLE`, `COURSE_CERT_LEGAL_NAME` → usados en `Certificate`.
    - `COURSE_EXAM_TITLE`, `COURSE_EXAM_INTRO` → usados en `ExamPreStart`.
    - `CONTENT_MODULES`, `EXAM_MODULE`, `COURSE_TOTAL_QUESTIONS`, `COURSE_START_PATH` → derivadas del catálogo `MODULES`, usadas en `HomePage` y `ExamPreStart` para dejar de hardcodear "17 módulos", "16 módulos", "60 preguntas" o `/modulo/1/teoria`.
  - **`docs/reusar-plataforma.md`** — Paso 6 actualizado con la lista completa de constantes que hay que tocar al adaptar la plataforma a otro curso PV-Learn. Además se documenta la convención `areaExamen: 0` para identificar el módulo del examen final.
- `[Build]` Validador: 277 OK / 0 warnings / 0 errors. `npx tsc --noEmit` clean. Build OK 1.50s. `npm run test:exam` 34/34 OK.

- `[Contenido]` Fase G.1 — Fixes UX post-launch: markdown inline en preguntas, lightbox para imágenes, labs visualmente reforzados.
  - **Bug `**bold**` literal en preguntas — resuelto.** Nuevo componente `platform/src/components/InlineMarkdown.tsx` que renderiza markdown inline (negrita, cursiva, `code`, enlaces) sin envolver en `<p>`, basado en `react-markdown` con `remark-gfm`. Aplicado en `QuestionMultipleChoice`, `QuestionMultipleResponse`, `QuestionDragAndDrop`, `QuestionOrdering` (en prompts, opciones, items y feedback "debería ir aquí") y en `QuestionFeedback` (justificaciones y respuestas correctas). Ahora `**PALABRA**` se renderiza correctamente como **PALABRA** en lugar de mostrar los asteriscos literales.
  - **Lightbox para imágenes y SVGs.** Nuevo componente `platform/src/components/ZoomableImage.tsx`: click sobre cualquier imagen del curso abre overlay full-screen con backdrop oscuro. Controles de zoom (in / out / reset, 50 % – 400 %), pan con drag cuando hay zoom, contador de % visible, etiqueta inferior con el alt para contexto, atajos de teclado (Esc, +, −, 0), backdrop click cierra. Usa `createPortal` para renderizarse en `document.body` y evitar conflictos con el contenedor padre. Bloqueo de scroll del body mientras está abierto. Soporta `prefers-reduced-motion` y `print:hidden` para no aparecer al imprimir. Conectado al `MarkdownRenderer` sustituyendo el `<img>` por defecto.
  - **Labs visualmente reforzados.** `MarkdownRenderer` acepta nueva prop `variant?: 'default' | 'lab'`. La variante `lab` aplica clase `markdown-lab` y clasifica blockquotes automáticamente por su contenido en cinco tipos:
    - **capture** — `[CAPTURA PENDIENTE ...]`, "captura...", "screenshot..." → caja con borde discontinuo gris para los placeholders de capturas que aún no se han producido.
    - **warning** — `⚠`, "importante:", "atención:", "aviso:", "cuidado" → callout ámbar.
    - **success** — "validación:", "resultado esperado:", "ok:" → callout verde.
    - **tip** — "tip:", "consejo:", "pro tip" → callout púrpura.
    - **info** — "nota:", "prerrequisitos", "requisitos previos", "recordatorio" → callout azul (fallback por defecto).
  - **Pasos numerados visuales.** Las listas ordenadas dentro de `.markdown-lab` se renderizan con bullets circulares en gradient pink → purple Plain Vanilla, sustituyendo el `1.` `2.` `3.` plano de markdown. Sub-listas (anidadas) vuelven a estilo discreto para no romper la jerarquía visual. Separación reforzada entre pasos consecutivos para legibilidad.
  - **Headers de sección en labs** con borde lateral (h2: borde gordo púrpura; h3: borde fino gris; h4: pill sobre fondo `bg-surface-2`).
  - `ModulePage` pasa `variant="lab"` al `MarkdownRenderer` cuando `section === 'laboratorios'`.
  - `platform/src/index.css` con ~140 líneas nuevas de CSS para `.markdown-lab` y las cinco variantes de callout (con dark mode overrides).
- `[Build]` Validador `scripts/validate-course.py` reporta 277 OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.94s. `npm run test:exam` OK 34/34 checks.

 paginación mobile del examen, accesibilidad WCAG, documento de reuso de la plataforma y análisis económico del curso como producto.
  - **`platform/src/hooks/useMediaQuery.ts`** — Hook genérico que devuelve `true/false` para un media query y reacciona a cambios de viewport en vivo. Compatible con SSR (devuelve `false` en server).
  - **`platform/src/components/exam/ExamInProgress.tsx`** — Paginación del examen en mobile (< 768 px) en chunks de 10 preguntas. En desktop sigue siendo scroll continuo con sidebar. Mini-índice de páginas arriba con tres estados visuales por página (vacía / parcial / completa) y contador `answered/total` por chunk. Nav prev/next abajo; en la última página el botón «Siguiente» se sustituye por «Finalizar». `safePage` clampado al cambio de viewport para evitar índices fuera de rango. Sin cambios en el estado del intento.
  - **`platform/src/components/exam/ExamTimer.tsx`** — Accesibilidad mejorada: `role="timer"` (semánticamente correcto) en lugar de `role="status"`. `aria-live` desactivado en la pastilla visible para no saturar al lector cada segundo. Canal separado con `aria-live="polite"` que anuncia solo cruces de umbral (10 min, 5 min, 2 min, 1 min, expirado), evitando ráfagas mediante `lastAnnouncedRef`.
  - **`platform/src/components/exam/ExamInProgress.tsx`** (ConfirmDialog) — `aria-labelledby` apuntando al `h2`, focus inicial en el botón primario (`confirmBtnRef.current?.focus()`), `Escape` cierra el dialog. Click fuera no cierra (decisión explícita: forzar elección de un botón). H1 `sr-only` añadido a `ExamInProgress` para marcar la jerarquía cuando el alumno está en el examen.
  - **`platform/src/index.css`** — `prefers-reduced-motion: reduce` desactiva la animación `exam-jump-pulse` y la sustituye por un `outline` estático, manteniendo el feedback visual sin movimiento.
- `[Docs]` `docs/reusar-plataforma.md` — Guía técnica para arrancar otro curso PV-Learn reutilizando la plataforma. Mapea qué se reusa íntegramente (componentes, parser, motor del examen, scripts), qué se adapta (`course.yaml`, `lib/course.ts`, `lib/exam.ts`) y qué se crea desde cero (paquete del curso). Incluye paso a paso, comandos clave y estimación de esfuerzo (~6-8 semanas FTE para un curso completo, vs ~6 días incurridos en Agent 365 con asistencia agéntica).
- `[Docs]` `docs/curso-como-producto.md` — Análisis económico del curso como producto vendible. Métricas reales del repo (109 commits, 17.584 líneas de contenido, 10.114 de plataforma, 6 días de desarrollo); equivalente «mercado tradicional» ~53.800 € vs coste real ~5.000-6.500 €; tres escenarios de pricing (B2B corporate 70-240 €/alumno, B2C individual 149-199 €, partner reseller con SWO setup fee 8-12 k€ + revenue share); comparables (Microsoft Learn, MOC, Udemy Business, Coursera, Pluralsight); recomendación priorizada (1º partner reseller, 2º B2B directo a clientes Plain Vanilla, 3º B2C); decisiones pendientes que requieren input de Miguel (canal, marca, idiomas, mantenimiento, modelo de venta).
- `[Build]` Validador `scripts/validate-course.py` reporta 277 OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.87s. `npm run test:exam` OK 34/34 checks. `npm run pack:offline` OK 1,6 MB / 43 archivos.

 página de ajustes, índice lateral del examen, certificado con sello y firma, empaquetado offline y test E2E.
  - **`platform/src/pages/SettingsPage.tsx`** — Nueva página `/ajustes`. Cuatro bloques: (1) modo de acceso secuencial vs libre con dos cards mutuamente excluyentes; (2) borrado granular en tres rows (progreso de módulos, historial del examen, nombre del certificado), cada uno con confirmación; (3) exportar progreso a JSON descargable; (4) importar progreso desde JSON (solo claves `agent365-*`, con confirmación). Avisos contextuales con auto-clear a 4 s.
  - **`platform/src/App.tsx`** + **`platform/src/components/NavSidebar.tsx`** — Ruta `/ajustes` y enlace en la sidebar bajo la sección de evaluación final.
  - **`platform/src/components/exam/ExamSidebarIndex.tsx`** — Índice lateral del examen en curso, visible en viewports `xl`. Grilla 5x12 con 60 botones, uno por pregunta. Estado visual: relleno verde para respondidas, borde gris para pendientes. Click hace `scrollIntoView` a la tarjeta correspondiente con highlight visual (animación `exam-jump-pulse` definida en `index.css`). Contador `respondidas/total` en la cabecera del índice. Colapsable.
  - **`platform/src/components/exam/ExamInProgress.tsx`** — Layout reorganizado a 2 columnas (preguntas + índice). Cada tarjeta de pregunta ahora tiene `id="exam-q-N"` y `scroll-mt-[calc(var(--layout-header-h)+5rem)]` para que el salto deje la pregunta visible bajo el header sticky.
  - **`platform/src/components/exam/CertificateSeal.tsx`** — Sello circular del certificado, SVG inline con gradient pink→purple Plain Vanilla, dos arcos de texto curvado (PLAIN VANILLA · CERTIFIED arriba, AGENT 365 · IT ADMIN abajo) y núcleo central «AG 365 / CERTIFIED». Sin dependencias externas.
  - **`platform/src/components/exam/CertificateBadge.tsx`** — Insignia visual tipo-QR de 11x11 derivada determinísticamente del `verificationId` (LCG sobre hash FNV-1a). Tres marcadores en esquinas para mantener la estética y cuerpo aleatorio derivado. **No es escaneable**: es un identificador visual único por intento. Sustituible por un QR real si en el futuro se incorpora una librería de QR.
  - **`platform/src/components/exam/Certificate.tsx`** — Pie del certificado reorganizado a tres columnas: firma con línea sobre la que firmar manualmente (etiqueta «Director Gerente · Plain Vanilla Solutions SL»), sello centrado y insignia + datos del emisor a la derecha. La nota legal queda como bloque inferior con borde sutil.
- `[Build]` Empaquetado offline standalone:
  - **`platform/scripts/pack-offline.sh`** — Script bash que: (1) hace build con `VITE_OFFLINE=1` para base path relativo (`./`) y basename de router vacío; (2) copia `dist/` a temp; (3) añade un `README-OFFLINE.txt` con 3 formas de servir el contenido (servidor local con Python/Node, doble click sobre `index.html`, hosting estático); (4) empaqueta todo en `platform/dist-offline/agent365-cert-course-offline-YYYY-MM-DD.zip`. Tamaño actual del zip: ~952 KB / 41 archivos.
  - **`platform/vite.config.ts`** — `base` ahora soporta `VITE_OFFLINE=1` con valor `./` adicional a los modos producción y desarrollo.
  - **`platform/src/App.tsx`** — `basename` del router vacío cuando `import.meta.env.VITE_OFFLINE === '1'`.
  - **`platform/package.json`** — Nuevo script `pack:offline`.
  - **`platform/.gitignore`** — Añadido `dist-offline`.
- `[Build]` Test E2E ampliado en `platform/scripts/test-exam-runtime.mts`: 12 checks adicionales que simulan un intento completo con aciertos heterogéneos por área (8/9 + 16/18 + 5/9 + 7/12 + 8/12 = 44/60 = 73 % passed), verifican breakdown por área, detección de áreas débiles (< 70 %) y casos borde (0/60 failed, 60/60 passed). Total: **34 OK / 0 FAIL** (vs 22 antes).
- `[Build]` Validador `scripts/validate-course.py` reporta 277 OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.76s. `npm run pack:offline` OK 952 KB.

- `[Contenido]` Fase F.2 — Refinamientos post-M17: revisión de respuestas en el examen, consentimiento explícito para guardar nombre del alumno, test runtime del flujo y test:exam integrado en el workflow de despliegue.
  - **`platform/src/components/exam/ExamReview.tsx`** — Sección expandible en `ExamResult` que muestra las 60 preguntas con la respuesta del alumno, las correctas y la justificación. Filtros por estado (Falladas / Correctas / Todas) con default en «Falladas» para acelerar repaso. Reutiliza `QuestionMultipleChoice`/`QuestionMultipleResponse`/`QuestionDragAndDrop`/`QuestionOrdering` del Bloque D pasándoles la respuesta del alumno como `answer` y `submission` para que se repinte con el estilo de validación correcto.
  - **`platform/src/hooks/useExamState.ts`** — `ExamAttempt` ampliado con `answers: Record<string, Answer>` y `perQuestionCorrect: Record<string, boolean>` para soportar la revisión sin recomputar contra el banco. El historial localStorage gana ~5-10 KB por intento (60 respuestas), muy por debajo del límite de 5 MB. Eliminados los placeholders `questionsFromAttempt` y `attemptAnswers` que ya no hacen falta.
  - **`platform/src/lib/exam.ts`** — Nueva función `getQuestionsByIds(ids)` que devuelve preguntas del banco por id, preservando el orden. `selectExamQuestions` refactorizada como wrapper de `selectFromBank(bank, count, seed)`, una versión PURA que acepta el banco como argumento y es testeable desde Node.
  - **`platform/src/components/exam/Certificate.tsx`** — Consentimiento explícito para guardar el nombre del alumno: checkbox en línea con el formulario («Recordar mi nombre en este navegador»). Sin marca explícita, el nombre solo vive en memoria durante la visita. Con marca, se persiste en `agent365-learner-name` y se autocompleta en visitas siguientes. Botón visible «Borrar nombre guardado» para revocar cuando hay algo en localStorage.
- `[Build]` `platform/scripts/test-exam-runtime.mts` — Smoke test runtime del flujo del examen ejecutable con `npm run test:exam`. Verifica: (1) banco a 60 preguntas; (2) distribución por área canónica 9/18/9/12/12; (3) los 5 tipos del parser representados; (4) `selectFromBank` reproducible con seed; (5) seeds distintas → orden distinto; (6) `scoreExam` todo correcto = 100 % passed; (7) `scoreExam` nada correcto = 0 % failed; (8) `scoreExam` 42/60 justo en umbral = passed; (9) `scoreExam` 41/60 por debajo = failed; (10) constantes `EXAM_NUM_QUESTIONS` y `EXAM_PASS_PCT` coinciden con `course.yaml > examen_final`. Total: **22 checks OK / 0 FAIL**.
  - `platform/src/lib/exam.ts`: `import.meta.glob` envuelto con detección de runtime (cae a `{}` cuando se ejecuta fuera del bundle Vite, p. ej. en tsx/Node). Las funciones puras `selectFromBank` y `scoreExam` no dependen del glob y se pueden testear desde Node.
  - `platform/package.json`: nuevo script `test:exam`, `tsx` añadido como devDependency.
  - `.github/workflows/deploy-platform.yml`: step «Smoke test runtime del examen» entre install y build, así que cualquier regresión en el banco o las funciones puras del examen bloquea el despliegue antes de generar el artifact.
- `[Build]` Validador `scripts/validate-course.py` reporta 277 OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.94s. `npm run test:exam` OK 22/22 checks.


  - **`platform/src/lib/exam.ts`** — Loader del banco oficial (60 preguntas EX-NN-NNN parseadas desde `cursos/agent365-cert/banco-examen.md` vía `import.meta.glob`), selección aleatoria con PRNG seedable (xmur3 + sfc32, suficiente para barajar), `scoreExam` con breakdown por área de competencia, constantes canónicas (60 preguntas, 90 min, 70 % umbral, 3 intentos máximos, 7 días cooldown).
  - **`platform/src/hooks/useExamState.ts`** — Máquina de estados `pre-start` / `in-progress` / `result`. Timer sobre deadline absoluto (resiste a navegación fuera de pestaña sin drift). Persistencia en localStorage: `agent365-exam-current` (snapshot del intento en curso, sobrevive a refresh) y `agent365-exam-history` (array de `ExamAttempt` con score, pass/fail y razón manual/timeout). Auto-submit cuando el reloj llega a 00:00. Lógica de cooldown si se agotan 3 intentos sin aprobar. Si el último intento aprobó, no se ofrecen más intentos.
  - **`platform/src/components/exam/ExamTimer.tsx`** — Pastilla de countdown con formato `MM:SS` o `H:MM:SS`. Cambio de color a ámbar bajo 10 min y rojo bajo 2 min, con parpadeo discreto en los últimos 2 min. Barra de progreso visual del tiempo consumido.
  - **`platform/src/components/exam/ExamPreStart.tsx`** — Pantalla previa con reglas (4 cards: 60 preguntas / 90 min / 70 % / 3 intentos), aviso de banco incompleto si aplica, estado del alumno (intentos restantes, cooldown activo, último aprobado), CTA de inicio y historial de intentos previos.
  - **`platform/src/components/exam/ExamInProgress.tsx`** — Vista del examen activo con header sticky bajo el shell (timer + barra de respondidas + botón Finalizar). Las 60 preguntas listadas reutilizando `QuestionMultipleChoice`/`QuestionMultipleResponse`/`QuestionDragAndDrop`/`QuestionOrdering` del Bloque D. Modal de confirmación si quedan preguntas sin responder al pulsar Finalizar.
  - **`platform/src/components/exam/ExamResult.tsx`** — Post-submit: hero con score grande (aciertos, porcentaje, umbral), CTAs (ver certificado si aprobado, reintentar si quedan intentos, volver a pre-start), breakdown por área con barra de aciertos por área y nota sobre repaso.
  - **`platform/src/components/exam/Certificate.tsx`** — Vista del certificado A4 horizontal en HTML. Cero dependencias de PDF: el usuario imprime con `window.print()` y el browser ofrece «Guardar como PDF». Cabecera con logo Plain Vanilla + ID de verificación (FNV-1a hash del attempt id), cuerpo con nombre del alumno (input no persistido por privacidad), puntuación, fecha, pie con datos fiscales.
  - **`platform/src/pages/ExamPage.tsx`** — Orquesta las 3 fases del hook. Activa `beforeunload` warning cuando hay intento en curso.
  - **`platform/src/pages/CertificatePage.tsx`** — Lee el `attemptId` de la URL, busca en historial de localStorage, renderiza certificado si aprobado o muestra mensaje claro si no.
  - **`platform/src/App.tsx`** — Rutas `/examen` y `/certificado/:attemptId` añadidas.
  - **`platform/src/components/NavSidebar.tsx`** — Link de M17 en la sección «Evaluación final» apunta a `/examen` en lugar de `/modulo/17/teoria`.
  - **`platform/src/lib/course.ts`** — M17 cambia a `estado: 'producido'`.
  - **`platform/src/index.css`** — Bloque `@media print` para impresión limpia del certificado: oculta header/nav/controles, fondo blanco forzado, `@page A4 landscape` con márgenes razonables, lienzo `.cert-page` sin border/shadow al imprimir.
- `[Build]` Validador `scripts/validate-course.py` reporta 277 OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.64s. Parser sobre el banco: 60 preguntas con distribución por área canónica (Á1=9, Á2=18, Á3=9, Á4=12, Á5=12, suma 60), todos los tipos del parser representados (multiple-choice 23, scenario 22, drag-and-drop 9, multiple-response 4, ordering 2), todos los IDs `EX-NN-NNN` bien formados, EX-16-001 presente.

**Hito alcanzado — curso completo end-to-end.** Con M17 producido, **los 17 módulos del curso están listos**. El alumno puede ahora: navegar los 16 módulos de contenido en cualquier orden o secuencial, hacer los quizzes de práctica de cada módulo, completar los laboratorios, lanzar el examen final cronometrado con 60 preguntas aleatorias del banco oficial, recibir resultado con breakdown por área y descargar (imprimir como PDF) un certificado firmado por Plain Vanilla con ID de verificación. La plataforma queda en estado funcional para liberación.

## 2026-05-11

- `[Contenido]` Fase E.10 — M16 cerrado en un único PR: teoría + labs + quiz + manifest + 1 pregunta al banco. M16 (Costes, optimización y mejores prácticas) queda **producido**. **Banco oficial alcanza el 100 %** (60/60 preguntas). Módulo ligero producido en un único PR (mismo patrón que E.7 con M13 y E.9 con M15). Con esto, **los 16 módulos de contenido están producidos** (94 %) y el banco oficial está completo. Solo queda M17 (examen final cronometrado) para cerrar el curso.
  - **`teoria.md`** (~360 líneas, 5 secciones, 45 min lectura):
    - 16.1 Modelo de coste total: las cuatro líneas canónicas (L1 licencias, L2 ingestión, L3 storage, L4 operación; proporciones típicas 55-65 / 10-15 / 5-10 / 15-25 por ciento; fórmula del coste marginal de invocación; 3 KPIs financieros canónicos: TCO por usuario activo, ratio de productividad por licencia, coste por agente productivo).
    - 16.2 Optimización de licencias Copilot 365 (detección con CCS Usage analytics + query KQL canónica; regla de cuarentena 30/30 con coaching previo a retirada; criterio de priorización de waitlist; 3 antipatrones: retirada masiva, conservar por si acaso, reasignación sin coaching).
    - 16.3 Optimización del catálogo de agentes (detección de agentes zombi con < 5 invocaciones mensuales en 2 trimestres consecutivos; punto de break-even del agente custom vs built-in; procedimiento de retirada con notificación al owner + 30 días aviso + retirada lógica + retirada definitiva; consolidación como alternativa a retirada).
    - 16.4 Optimización de ingestión y retención de audit (tiering canónico: 30 días caliente + hasta 7 años frío + glacial opcional; reglas de filtros seguros vs prohibidos; capacidad reservada vs pay-as-you-go con descuentos 15-65 por ciento; KPI ratio de ingestión).
    - 16.5 Ciclo de mejora continua trimestral (composición del comité de 5 personas con autoridad de decisión; 4 inputs canónicos: KPIs financieros, lecciones de incidents, evolución del catálogo, feedback de adopción; 3 outputs: decisiones, reporte ejecutivo, comunicación; 4 antipatrones del comité).
    - Glosario inline de 12 términos clave.
  - **`laboratorios.md`** completos (~230 líneas, 2 labs, 60 min total):
    - LAB-16-1 (30 min) — Construir el modelo TCO completo a 12 meses con las cuatro líneas canónicas: recopilación de L1 desde CCS, L2 y L3 desde Microsoft Cost Management, estimación documentada de L4, hoja resumen con porcentajes y los 3 KPIs canónicos.
    - LAB-16-2 (30 min) — Aplicar regla 30/30 sobre 280 licencias infrautilizadas (segmentación en 3 grupos para coaching escalado) y criterio trimestral sobre 8 agentes candidatos a zombi (clasificación en 4 categorías de decisión: retirada inmediata, mantener con argumento estacional, investigar, buscar nuevo owner).
  - **`quiz-practica.md`** con 5 preguntas Q-16-1..Q-16-5 cubriendo los 5 OAs en tipos del parser (multiple-response, ordering, scenario, scenario, multiple-response). Caso de estudio de refuerzo: **Mapfre** (15K empleados, sector seguros regulado por DGSFP, 4.500 usuarios Copilot, 9 meses de programa) — diagnóstico de 3 oportunidades principales de optimización con ahorro estimado, plan a 4 trimestres con owners y fechas, KPIs trimestrales al comité de dirección, 4 riesgos del plan con mitigación.
  - **`recursos.md`** con URLs de Microsoft Learn (licensing Copilot, licensing Agent 365, Sentinel pricing y billing, data tiering, reducción de costes de ingestión, Cost Management, medir impacto y ROI), frameworks (FinOps Foundation, TBM, ITIL 4 Continual Improvement), lecturas adicionales (Cloud FinOps, The Goal, Measure What Matters), bloque «Para la certificación» con los puntos memorizables.
  - **`module.yaml`** completo: `estado: producido`, `duracion_min: 117` (45 teoría + 12 quiz + 60 labs), 5 OAs cubriendo Bloom Aplicar y Analizar; 12 términos glosario; prerrequisitos M03 + M10 + M11 + M12 + M13 + M14; secciones completas; lista `laboratorios:` con los 2 IDs; `preguntas_aporta_examen_final: 1`.
  - **`banco-examen.md`**: añadida 1 pregunta EX-16-001 cubriendo OA-16.4 (rechazar filtro de ingestión sobre eventos `AgentInvoke` por motivos de trazabilidad regulatoria; aplicar tiering canónico como alternativa). Banco oficial pasa de **59 a 60** preguntas (**100 %** completo). Tabla de distribución actualiza M16 a `Completo`.
  - **`README.md`** del directorio creado con estado producido.
  - **`platform/src/lib/course.ts`**: M16 cambia a `estado: 'producido'` con `duracionMin: 117`.
  - **`lib/quiz.ts` no requiere cambios** — beneficio operativo continuado del Bloque D.1. Verificado con `parseQuizMarkdown` → 5 preguntas Q-16 en los tipos correctos.
  - **`evaluacion.md` heredado del placeholder eliminado** — alineación con el patrón consolidado M13/M15.
- `[Build]` Validador `scripts/validate-course.py` reporta checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK.

**Hito alcanzado — temario de contenido completo. Banco al 100 %.** Con M01-M16 producidos, **los 16 módulos del temario están listos (100 % del contenido)** y el banco oficial alcanza 60/60 preguntas. Próximo paso: **Fase F — M17 examen final cronometrado con UI específica** (cronómetro de 90 minutos, selección aleatoria del banco, scoring, certificate PDF).

## 2026-05-11

- `[Contenido]` Fase E.9 — M15 cerrado en un único PR: teoría + labs + quiz + manifest + 1 pregunta al banco (PR #?). M15 (Troubleshooting y operación cotidiana) queda **producido**. **Banco oficial alcanza el 98 %** (59/60 preguntas). Módulo ligero producido en un único PR (mismo patrón que E.7 con M13).
  - **`teoria.md`** (~340 líneas, 5 secciones, 45 min lectura):
    - 15.1 El protocolo canónico OBDED (las 5 fases Observe → Diagnose → Execute → Validate → Document, regla 80/20 del troubleshooting, escalado tier 1/2/3).
    - 15.2 Problemas de acceso a agentes (árbol de decisión de 4 niveles: licencia → catalog policy → agente activo → CA; diagnóstico con KQL unificado; casos específicos frecuentes con causa raíz + síntoma + resolución).
    - 15.3 Agentes deshabilitados inesperadamente (las 4 causas comunes: CA policy nueva, secret expirado, blueprint deprecated, security automation; diagnóstico paso a paso; resolución por caso; disciplina de NO re-habilitar agentes deshabilitados por automation sin investigar).
    - 15.4 Incidents de Defender XDR que no se cierran (3 obstáculos típicos: entities unresolved, evidence missing, automation failures; resolución específica para cada).
    - 15.5 Audit log gaps (síntomas, técnica de reconciliación cruzada con CCS + Purview + Defender XDR, causas frecuentes, reporting al comité central).
    - Glosario inline de 13 términos clave.
  - **`laboratorios.md`** completos (~320 líneas, 2 labs, 60 min total):
    - LAB-15-1 (30 min) — Resolver caso simulado de usuario que no puede invocar agente aplicando OBDED completo: ticket de María López, árbol de decisión hasta confirmar agente deshabilitado por automation, diagnóstico con KQL del evento `AgentDisabled`, validación de FP con SOC tier 2, re-enable + ajuste de threshold + retirada temporal de acción automática, post-mortem con causa raíz y acciones preventivas.
    - LAB-15-2 (30 min) — Detectar y remediar audit log gap con reconciliación cruzada: discrepancia 11 % entre CCS (38.420) y Defender XDR (34.108), tercera fuente Purview audit log confirma 38.420, causa raíz en filtro de ingestión del data connector aplicado hace 2 meses, resolución (filtro retirado) + reporting al comité central + plan preventivo con reconciliación automatizada semanal.
  - **`quiz-practica.md`** con 5 preguntas Q-15-1..Q-15-5 cubriendo los 5 OAs en los 5 tipos del parser (ordering, ordering, scenario, multiple-response, scenario). Caso de estudio de refuerzo: **Repsol** (24K empleados, sector energético regulado por CNMC) — diagnóstico de acumulación inusual de 47 tickets en 2 semanas con 3 hipótesis principales, queries KQL por hipótesis, plan de respuesta de 2 semanas con owners y fechas, dashboard SOC con alertas tempranas que habría detectado el patrón antes.
  - **`recursos.md`** con URLs de Microsoft Learn (troubleshooting Agent 365, error codes, CloudAppEvents diagnostics, Conditional Access debugging, Purview audit reconciliation, Sentinel playbook debugging), frameworks (ITIL 4 Service Operation, NIST SP 800-61 Rev. 2), lecturas adicionales (Google SRE Book sobre postmortem culture, The Phoenix Project).
  - **`module.yaml`** completo: `estado: producido`, `duracion_min: 117` (45 teoría + 12 quiz + 60 labs), 5 OAs cubriendo Bloom Aplicar y Analizar; 13 términos glosario; prerrequisitos M01 + M06 + M09 + M10 + M11 + M12 + M13 (toda la cadena previa); secciones completas; lista `laboratorios:` con los 2 IDs; `preguntas_aporta_examen_final: 1`.
  - **`banco-examen.md`**: añadida 1 pregunta EX-15-001 cubriendo OA-15.2 (disciplina de NO re-habilitar agentes deshabilitados por automation sin investigar). Banco oficial pasa de **58 a 59** preguntas (**98 %** completo). Tabla de distribución actualiza M15 a `Completo`.
  - **`README.md`** del directorio actualizado con estado producido.
  - **`platform/src/lib/course.ts`**: M15 cambia a `estado: 'producido'` con `duracionMin: 117`.
  - **`lib/quiz.ts` no requiere cambios** — beneficio operativo continuado del Bloque D.1. Verificado con `parseQuizMarkdown` → 5 preguntas Q-15 en los tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 276 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.93s.

**Hito alcanzado — M15 completo. Banco al 98 %.** Con M01-M15 producidos, **15 de 16 módulos del temario están listos (94 %)** y el banco oficial alcanza 59/60 preguntas. Solo falta **1 pregunta** para completar el banco oficial (M16 aporta 1). Próximo módulo: M16 (Costes, optimización y mejores prácticas) — el último de contenido, después solo M17 (examen final cronometrado).

 M14 (Gobernanza avanzada y multi-tenant) queda **producido**. **Banco oficial alcanza el 97 %** (58/60 preguntas). Módulo intermedio producido en un único PR (mismo patrón que E.7 con M13).
  - **`teoria.md`** (~440 líneas, 5 secciones, 60 min lectura):
    - 14.1 Topologías multi-tenant comunes (las 4 topologías canónicas: parent/subsidiary, M&A en curso, MSP/MSSP, joint venture; implicaciones específicas para Agent 365 en cada una).
    - 14.2 Delegated administration cross-tenant (Microsoft Entra B2B, GDAP con scope + duración + audit + customer consent, Customer Lockbox, patrón recomendado de doble pertenencia controlada).
    - 14.3 Políticas cross-tenant (el reto regulatorio multi-jurisdiccional, el modelo de policy framework distribuido, 3 ejes de alineación: ético/operacional/tecnológico).
    - 14.4 Federation models (centralizado, federado, hub-and-spoke con tabla de decisión completa; hub-and-spoke como modelo más común en organizaciones modernas).
    - 14.5 Operación del ciclo de gobernanza distribuida (comité central + comités locales, reporting agregado en 3 vistas, integración con auditoría externa anual con 4-6 semanas de preparación).
    - Glosario inline de 16 términos clave.
  - **`laboratorios.md`** completos (~420 líneas, 2 labs, 60 min total):
    - LAB-14-1 (30 min) — Configurar delegated administration cross-tenant con GDAP + Customer Lockbox: crear GDAP relationship entre HQ y Subsidiary-EU con roles `Security Reader` + `Compliance Administrator` + `Copilot Administrator` (NO Global Admin), 180 días, activar Customer Lockbox con aprobadores designados, test funcional completo del flow B2B + GDAP + Lockbox, validación del audit log con cadena completa de acciones cross-tenant.
    - LAB-14-2 (30 min) — Diseñar policy framework distribuido para 3 tenants regulatorios distintos (InternationalManufacturing-Corp en Alemania + US + Brasil): framework global con 5 principios mínimos + KPIs canónicos + vocabulario común, adaptaciones por tenant respetando GDPR/AI Act/BetrVG/CCPA/SOX/HIPAA/LGPD, ciclo de gobernanza con comités, plan de rollout 16 semanas, validación cruzada con regulación.
  - **`quiz-practica.md`** con 5 preguntas Q-14-1..Q-14-5 cubriendo los 5 OAs en los 5 tipos del parser (drag-and-drop, multiple-response, scenario, multiple-choice, ordering). Caso de estudio de refuerzo: **Iberdrola-Avangrid** (grupo energético global con 40K empleados, operación en 5 países con reguladores propios) — diseño del modelo operativo cross-tenant 12 meses con federation model hub-and-spoke, framework global con 6 principios + 7 KPIs canónicos, calendario de 7 auditorías a lo largo del año, dashboard mensual al Consejo con 3 vistas.
  - **`recursos.md`** con URLs de Microsoft Learn (multi-tenant overview, cross-tenant access, GDAP completo con roles y migración desde DAP, Customer Lockbox, Agent 365 multi-tenant), referencia regulatoria (EU AI Act, GDPR, LGPD, CCPA/CPRA, NIST AI RMF), frameworks (COBIT 2019, ITIL 4, ISO/IEC 42001:2023), lecturas adicionales (Microsoft Trust Center, Gartner Magic Quadrant, MIT Sloan).
  - **`module.yaml`** completo: `estado: producido`, `duracion_min: 132` (60 teoría + 12 quiz + 60 labs), 5 OAs cubriendo Comprender, Aplicar, Crear, Analizar; 16 términos glosario; prerrequisitos M01 + M06 + M09 + M12 + M13; secciones completas; lista `laboratorios:` con los 2 IDs; `preguntas_aporta_examen_final: 2`.
  - **`banco-examen.md`**: añadidas 2 preguntas EX-14-001..002 cubriendo OA-14.2 (configuración MSP correcta) y OA-14.4 (federation model para grupo bancario multi-país). Banco oficial pasa de **56 a 58** preguntas (**97 %** completo). Tabla de distribución actualiza M14 a `Completo`.
  - **`README.md`** del directorio actualizado con estado producido.
  - **`platform/src/lib/course.ts`**: M14 cambia a `estado: 'producido'` con `duracionMin: 132`.
  - **`lib/quiz.ts` no requiere cambios** — beneficio operativo continuado del Bloque D.1. Verificado con `parseQuizMarkdown` → 5 preguntas Q-14 en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 275 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.65s.

**Hito alcanzado — M14 completo. Banco al 97 %.** Con M01-M14 producidos, **14 de 16 módulos del temario están listos (87.5 %)** y el banco oficial alcanza 58/60 preguntas. Solo faltan **2 preguntas** para completar el banco (M15 aporta 1, M16 aporta 1). Próximo módulo: M15 (Troubleshooting y operación).

 M13 (Copilot Control System integrado con Agent 365) queda **producido**. **Banco oficial alcanza el 93 %** (56/60 preguntas). Módulo compacto producido en un solo PR (no necesita división E.7 + E.8 como módulos previos por su menor volumen: 1 sola pregunta al banco, 5 OAs, 2 labs).
  - **`teoria.md`** (~310 líneas, 5 secciones, 45 min lectura):
    - 13.1 ¿Qué es y dónde encaja CCS? (el problema que resuelve, posicionamiento con tres reglas mnemotécnicas «CCS controla / Defender XDR detecta / Purview protege el dato», por qué tiene su propio portal con público objetivo distinto).
    - 13.2 Las cuatro superficies operativas (License management, Agent governance, Data governance integration, Telemetry — cada una con la pregunta de negocio que responde y sus capacidades concretas).
    - 13.3 Configurar políticas centralizadas de adopción (los tres modelos canónicos Open / Curated / Approval-based, configuración paso a paso del Curated catalog, telemetría de políticas con compliance rate + friction + coverage).
    - 13.4 CCS, Defender XDR y Purview: diferenciación operativa (tabla de decisión rápida con 8 situaciones canónicas + tres anti-patrones a evitar).
    - 13.5 Operación del día a día (ritual semanal de 30-45 min los lunes con 5 actividades, reporte mensual al comité de gobernanza con 4 secciones, integración con el ciclo de gobernanza corporativa).
    - Glosario inline de 12 términos clave.
  - **`laboratorios.md`** completos (~250 líneas, 2 labs, 60 min total):
    - LAB-13-1 (30 min) — Configurar política Curated catalog y validar compliance rate: política `Marketing-Europe-Curated-2026Q2` con allowlist de 5 agentes, validación empírica de bloqueos, medición de compliance rate + friction + coverage después de 24-48h, ajustes iniciales según KPIs.
    - LAB-13-2 (30 min) — Generar el reporte mensual al comité de gobernanza desde CCS: flujo completo (definir periodo y audiencia → generar reporte automático → añadir narrativa ejecutiva a cada sección → validación cruzada con Defender XDR + Purview → exportar PDF + PPTX para distribución → documentar decisiones post-comité).
  - **`quiz-practica.md`** con 5 preguntas Q-13-1..Q-13-5 cubriendo los 5 OAs en los 5 tipos del parser (multiple-choice, drag-and-drop, scenario, multiple-response, ordering). Caso de estudio de refuerzo: **Telefónica** (97K empleados, 12 países) — calendario operativo anual de gobernanza de IA con rituales semanal/mensual/trimestral/anual, 3 KPIs ejecutivos al Consejo de Administración, plan de evolución del modelo de política Approval-based → Curated → Open con criterios objetivos para cada transición.
  - **`recursos.md`** con URLs de Microsoft Learn (CCS overview + License management + Agent governance + Data governance + Telemetry + Monthly governance report), documentación de diferenciación con Defender XDR y Purview, blogs oficiales, lecturas adicionales (Gartner Magic Quadrant AI Governance, MIT Sloan), herramientas (Graph PowerShell Copilot module, Power BI Copilot Reports template).
  - **`module.yaml`** completo: `estado: producido`, `duracion_min: 117` (45 teoría + 12 quiz + 60 labs), 5 OAs cubriendo Bloom Comprender, Aplicar, Analizar; 12 términos glosario; prerrequisitos M01 + M06 + M09 + M12; secciones completas; lista `laboratorios:` con los 2 IDs; `preguntas_aporta_examen_final: 1`.
  - **`banco-examen.md`**: añadida 1 pregunta EX-13-001 cubriendo OA-13.4 (diferenciación operativa CCS vs Defender XDR vs Purview en escenario compuesto con 3 situaciones simultáneas). Banco oficial pasa de **55 a 56** preguntas (**93 %** completo). Tabla de distribución actualiza M13 a `Completo`.
  - **`README.md`** del directorio actualizado con estado producido y enlace a archivos.
  - **`platform/src/lib/course.ts`**: M13 cambia a `estado: 'producido'` con `duracionMin: 117`.
  - **`lib/quiz.ts` no requiere cambios** — beneficio operativo continuado del Bloque D.1. Verificado con `parseQuizMarkdown` → 5 preguntas Q-13 en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 274 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.55s.

**Hito alcanzado — M13 completo. Banco al 93 %.** Con M01-M13 producidos, **13 de 16 módulos del temario están listos (81 %)** y el banco oficial alcanza 56/60 preguntas. Solo faltan **4 preguntas** para completar el banco (M14 aporta 2, M15 aporta 1, M16 aporta 1). Próximo módulo: M14 (Gobernanza avanzada y multi-tenant).

 M12 (Monitorización, auditoría y reporting con Microsoft Defender XDR) queda **producido**. El alumno puede recorrer el módulo completo (teoría 90 min + quiz 20 min + 4 labs 110 min). **Banco oficial alcanza el 92 %** (55/60 preguntas).
  - **`laboratorios.md`** completos (~485 líneas, 4 labs, 110 min total):
    - LAB-12-1 (30 min) — Escribir y validar las 3 queries KQL canónicas en Advanced Hunting (volumen anómalo 5x baseline, exfiltración > 30 docs + > 5 outputs, compromiso de identidad > 2 IPs nuevas + > 3 useragents). Documentar thresholds, FP rate, next-review date.
    - LAB-12-2 (25 min) — Promover query 2 a custom detection rule operativa con severidad calibrada (High), entity extraction (AgentId, AccountUpn), MITRE ATT&CK mapping (T1567, T1078.004), acciones automatizadas medidas (solo notify en día 1, disable agente tras 2-3 meses con FP < 1 %).
    - LAB-12-3 (25 min) — Conectar Defender XDR con Sentinel, configurar Long-Term Retention 7 años, crear playbook `pb-Agent365-Compromise-Containment` con 6 steps (parse, disable agent vía Graph API, revoke tokens, notify owner, ServiceNow P1, add comment) y automation rule que lo dispara.
    - LAB-12-4 (30 min) — Investigación end-to-end de incidente simulado: recopilación de evidencia inicial, construcción de timeline con KQL `CorrelationId`, correlación cross-product (Identity Protection, Endpoint, DLP, CC), formulación de 2-3 hipótesis con evidencia, validación con stakeholders, decisión de contención adicional, post-mortem formal con timeline + causa raíz + impacto + acciones + lecciones aprendidas + mejoras con owner y fecha.
  - **`quiz-practica.md`** con 7 preguntas Q-12-1..Q-12-7 cubriendo los 7 OAs en los 5 tipos del parser (multiple-choice, scenario, multiple-response, drag-and-drop, ordering). Caso de estudio de refuerzo: **BBVA** (115K empleados, regulación bancaria europea estricta) — diseño completo del dashboard CISO mensual al Consejo de Riesgos con 10 KPIs en 4 secciones, 3 playbooks adicionales y SLA del SOC para respuesta al regulador.
  - **`banco-examen.md`**: añadidas 7 preguntas EX-12-001..007 cubriendo los OAs 12.1, 12.2, 12.3, 12.4, 12.5, 12.6 y 12.7. Banco oficial pasa de **48 a 55** preguntas (**92 %** completo). **Nueva Área 5 «Monitor, troubleshoot and improve Microsoft Agent 365»** inaugurada en el banco. Tabla de distribución actualiza M12 a `Completo`.
  - **`module.yaml`** de M12 cerrado: `estado: producido`, `duracion_min: 220` (90 teoría + 20 quiz + 110 labs), secciones completas, lista `laboratorios:` poblada con los 4 IDs.
  - **`platform/src/lib/course.ts`**: M12 cambia a `estado: 'producido'` con `duracionMin: 220`.
  - **`lib/quiz.ts` no requiere cambios** — el parser markdown introducido en D.1 captura las 7 preguntas Q-12 automáticamente. Verificado con `parseQuizMarkdown` → 7 preguntas en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 273 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.03s.

**Hito alcanzado — M12 completo. Banco al 92 %.** Con M01-M12 producidos, **12 de 16 módulos del temario están listos (75 %)** y el banco oficial alcanza 55/60 preguntas. Solo faltan 5 preguntas para completar el banco (M13 aporta 1, M14 aporta 2, M15 aporta 1, M16 aporta 1). Próximo módulo en cola: M13 (Copilot Control System integrado con Agent 365).

 M12 (Monitorización, auditoría y reporting con Microsoft Defender XDR) **abre el Área 5 del examen** (Monitor, troubleshoot and improve, peso 25 %). Aporta 7 preguntas al banco oficial — el módulo de Área 5 con más peso. Mismo patrón B.1 / E.1 / E.3: contenido pedagógico voluminoso (teoría + recursos + manifest) en este PR; labs + quiz + 7 preguntas EX llegan en E.6.
  - **`teoria.md`** completa (~660 líneas, 7 secciones, 90 min lectura):
    - 12.1 Posicionamiento: Defender XDR como red de seguridad (las cinco capas en serie M09-M11-M12; por qué la prevención no basta; componentes de Defender XDR relevantes para Agent 365).
    - 12.2 El portal Defender XDR para agentes (Incidents como unidad de trabajo, Alerts comunes, Advanced hunting, Custom detection rules, Threat analytics).
    - 12.3 La tabla `CloudAppEvents` y campos enriquecidos (esquema completo, query base, latencia de ingestión 2-10 min, retención por defecto y con Sentinel LTR hasta 12 años).
    - 12.4 Hunting con KQL: 5 queries fundamentales (top N invocaciones, accesos por usuario y sensitivity, nuevas geografías, outputs con sensitivity alta, correlación por `correlationId`).
    - 12.5 Tres patrones problemáticos canónicos con queries KQL completas (volumen anómalo con threshold 5x baseline, exfiltración con > 30 archivos sensibles + > 5 outputs en 2h, compromiso de identidad con > 2 IPs nuevas + > 3 useragents distintos).
    - 12.6 Custom detection rules: anatomía completa, calibración de severidad (no todo es High), acciones automatizadas y umbrales operativos (2-3 meses con FP < 1 % antes de automatizar acciones disruptivas).
    - 12.7 Integración con Microsoft Sentinel (conector nativo, workspace operativo + LTR, tres playbooks canónicos `AgentCompromise-Containment` / `DLPMassOverride-Investigation` / `AgentMassDownload-Forensic`, correlación cross-tenant).
    - Glosario inline de 15 términos clave.
  - **`recursos.md`** con URLs de Microsoft Learn (Defender XDR overview + portal + integración con Agent 365; CloudAppEvents reference + Advanced hunting + límites + biblioteca de queries oficiales; KQL quick reference + tutorial + best practices; Custom detection rules + entity extraction; Sentinel completo con conector + playbooks + LTR + cross-tenant; Defender for Identity alerts para Agent ID), repositorios públicos (Azure-Sentinel GitHub, Sentinel Content Hub, comunitario M365 Defender Hunting Queries), blogs oficiales, lecturas adicionales (MITRE ATT&CK, NIST SP 800-61 Rev. 2, CISA Threat Intelligence Lifecycle) y herramientas (Defender PowerShell, Graph PowerShell Security, Azure CLI Sentinel extension, KQL Magic for Jupyter, VS Code Kusto extension).
  - **`module.yaml`** con los 7 OAs cubriendo Bloom Comprender, Aplicar, Crear, Analizar; 15 términos de glosario; prerrequisitos M01 + M06 + M09 + M10 + M11 (toda la cadena previa de Áreas 1, 2 y 4); `estado: produciendo`, `fase_produccion: 3`, `preguntas_aporta_examen_final: 7`.
  - **`README.md`** del directorio actualizado con nota sobre KQL como prerrequisito de facto.
  - Borrado: placeholders `evaluacion.md`, `laboratorios.md` originales.
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. Build Vite OK 2.47s.

 M11 (DLP, sensitivity labels avanzadas y Communication Compliance) queda **producido**. El alumno puede recorrer el módulo completo (teoría 90 min + quiz 20 min + 4 labs 100 min). **Banco oficial alcanza el 80 %** (48/60 preguntas).
  - **`laboratorios.md`** completos (~390 líneas, 4 labs, 100 min total):
    - LAB-11-1 (25 min) — Configurar DLP policy con location `Microsoft Agent 365 outputs` para bloquear con override outputs con SITs financieras, modo Test → producción, audit log validado.
    - LAB-11-2 (30 min) — Entrenar custom trainable classifier `Custom-MA-Conversations` con dataset balanceado, calibrar precision/recall ≥ 80/70 %, promover a producción en DLP policy en audit only.
    - LAB-11-3 (25 min) — Conectar Microsoft Defender for Cloud Apps a Salesforce sandbox, configurar DLP cross-SaaS con location MDA, validar con evento simulado, Cloud Discovery de shadow IT, session policy opcional.
    - LAB-11-4 (20 min) — Configurar Communication Compliance para detectar lenguaje regulado en outputs de agente de research, definir grupo reviewers, simular match, workflow Resolve/Escalate, reporte semanal.
  - **`quiz-practica.md`** con 7 preguntas Q-11-1..Q-11-7 cubriendo los 7 OAs en los 5 tipos del parser (multiple-choice, scenario, multiple-response, drag-and-drop, ordering). Caso de estudio de refuerzo: **Banco Santander** (200K+ empleados, regulación CNMV/ESMA) — diseño completo de programa DLP + CC con 5 policies prioritarias, 3 classifiers custom y reporting CISO con KPI específico de banca.
  - **`banco-examen.md`**: añadidas 7 preguntas EX-11-001..007 cubriendo los OAs 11.1, 11.2, 11.3, 11.4, 11.5, 11.6 y 11.7. Banco oficial pasa de **41 a 48** preguntas (**80 %** completo). Tabla de distribución actualiza M11 a `Completo`.
  - **`module.yaml`** de M11 cerrado: `estado: producido`, `duracion_min: 210` (90 teoría + 20 quiz + 100 labs), secciones completas, lista `laboratorios:` poblada con 4 IDs.
  - **`platform/src/lib/course.ts`**: M11 cambia a `estado: 'producido'` con `duracionMin: 210`.
  - **`lib/quiz.ts` no requiere cambios** — el parser markdown introducido en D.1 captura las 7 preguntas Q-11 automáticamente. Verificado con `parseQuizMarkdown` → 7 preguntas en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 272 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.35s.

**Hito alcanzado — M11 completo. Banco al 80 %.** Con M01-M11 producidos, **11 de 16 módulos del temario están listos (69 %)** y el banco oficial al 80 %. Faltan 12 preguntas para completar el banco (M12 aporta 7, M13-M16 aportan 5 más). Próximo módulo en cola: M12 (Microsoft Defender XDR aplicado a agentes — la pieza que cierra el Área 4 con detección e investigación cuando algo se cuela a pesar de la prevención).

 M11 (DLP, sensitivity labels avanzadas y Communication Compliance) es el módulo más voluminoso del Área 4 del examen (7 preguntas al banco oficial, frente a 5 de M10). Mismo patrón B.1 / E.1: contenido pedagógico voluminoso en este PR; labs + quiz + 7 preguntas EX llegan en E.4.
  - **`teoria.md`** completa (~600 líneas, 7 secciones, 90 min lectura):
    - 11.1 DLP vs Information Protection: dónde está la frontera (las dos preguntas que se reparten, complementariedad en una invocación, capacidades exclusivas de DLP).
    - 11.2 Anatomía de una DLP policy para agentes (locations soportadas incluyendo la nueva `Microsoft Agent 365 outputs`, conditions con SITs + classifiers + labels + keywords + fingerprinting + context, actions con tabla operativa audit/block/justify/override, user experience con policy tip + block message + justification reasons).
    - 11.3 Trainable classifiers: classifiers built-in (`OffensiveLanguage`, `Harassment`, `Threats`, `ContractDocuments`, `FinancialReports`, etc.), flujo de entrenamiento custom de 6 pasos con métricas precision/recall, combinaciones AND/OR en policies.
    - 11.4 DLP en runtime para outputs (diagrama de flujo técnico, latencia añadida 200-800 ms para outputs típicos, flujo de override con justificación documentado paso a paso, cobertura input-side / mid-flight / output-side).
    - 11.5 Integración con Microsoft Defender for Cloud Apps (catálogo de 30+ conectores, DLP cross-SaaS con ejemplo YAML, Cloud Discovery para shadow IT, session policies en modo reverse proxy).
    - 11.6 Communication Compliance: el agente como participante regulado (por qué los agentes están en scope, configuración de policy completa, workflow de revisión de 5 pasos, ejemplos por industria — banca, sanidad, defensa, HR).
    - 11.7 Operación del día a día (triaje semanal con 5 puntos, exclusiones temporales con expiración automática, reporte mensual al CISO con las 4 preguntas clave, 3 errores operacionales comunes a evitar).
    - Glosario inline de 16 términos clave.
  - **`recursos.md`** con URLs de Microsoft Learn (DLP overview, plan, policy reference, integración con Agent 365; trainable classifiers definitions + custom guide + best practices; CC overview + plan + integración con agentes; MDA overview + connectors + session policies + Cloud Discovery + integración con Purview DLP), blogs oficiales, lecturas adicionales (CIS Controls v8 Control 3, NIST SP 800-53 AC/SC, MITRE ATT&CK TA0010 Exfiltration) y herramientas (Purview Compliance PowerShell, Graph PowerShell Compliance, MDA REST API).
  - **`module.yaml`** con los 7 OAs cubriendo Bloom Comprender, Aplicar, Crear, Analizar; 16 términos de glosario; prerrequisitos M01 + M09 + M10 (cadena de M09 → M10 → M11); `estado: produciendo`, `fase_produccion: 3`, `preguntas_aporta_examen_final: 7`.
  - **`README.md`** del directorio actualizado.
  - Borrado: placeholders `evaluacion.md`, `laboratorios.md` originales.
- `[Build]` Validador `scripts/validate-course.py` reporta 269 checks OK · 0 warnings · 0 errors. Build Vite OK 1.85s.

 M10 (Microsoft Purview y protección de datos en Agent 365) queda **producido**. El alumno puede recorrer el módulo completo (teoría 75 min + quiz 15 min + 4 labs 90 min) y las 5 preguntas EX-10 quedan disponibles para el examen final.
  - **`laboratorios.md`** completos (~310 líneas, 4 labs, 90 min total):
    - LAB-10-1 (20 min) — Aplicar sensitivity label `Confidential` a un blueprint y verificar empíricamente la herencia automática en outputs (cifrado, watermark, audit event `AgentSensitivityLabelInherited`).
    - LAB-10-2 (25 min) — Activar DSPM for AI por primera vez en el tenant, configurar los cuatro paneles principales, definir una alerta operativa con destinatarios y documentar 3+3 hallazgos prioritarios.
    - LAB-10-3 (20 min) — Búsqueda forense en eDiscovery Premium filtrada por `agentId`: simular solicitud regulatoria, añadir custodian, búsqueda con filtros sensitivityLabel, custodian hold, export forense.
    - LAB-10-4 (25 min) — Diseño end-to-end coherente Purview + Conditional Access para agente de Tesorería autonomous: seis capas en serie (blueprint con label → CA → Identity Protection → Information Protection → DSPM → eDiscovery) con plan de validación.
  - **`quiz-practica.md`** con 6 preguntas Q-10-1..Q-10-6 cubriendo los 6 OAs del módulo en los 5 tipos canónicos del parser (multiple-choice, scenario, multiple-response, drag-and-drop, ordering). Caso de estudio de refuerzo: **Pernod Ricard** (Tasting-Notes-Assistant — diseño de dashboard CISO semanal con KPIs, endpoints de Graph, thresholds operativos y SLAs).
  - **`banco-examen.md`**: añadidas 5 preguntas EX-10-001..005 cubriendo los OAs 10.1, 10.2, 10.3, 10.4 y 10.5. Banco oficial pasa de **36 a 41** preguntas (68 % completo). Nueva **Área 4 «Implement data protection with Microsoft Purview»** inaugurada en el banco. Tabla de distribución actualiza M10 a `Completo`.
  - **`module.yaml`** de M10 cerrado: `estado: producido`, `duracion_min: 183` (75 teoría + 18 quiz + 90 labs), secciones completas (teoria + quiz-practica + laboratorios + recursos), lista `laboratorios:` poblada con los 4 IDs.
  - **`platform/src/lib/course.ts`**: M10 cambia a `estado: 'producido'` con `duracionMin: 183`.
  - **`lib/quiz.ts` no requiere cambios**: el parser markdown introducido en D.1 captura las 6 preguntas Q-10 automáticamente. Verificado con `parseQuizMarkdown` → 6 preguntas en los 5 tipos correctos.
- `[Build]` Validador `scripts/validate-course.py` reporta 271 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.64s.

**Hito alcanzado — M10 completo.** Área 4 del examen abierta (peso 20 %). Con M01-M09 + M10 producidos, **10 de 16 módulos del temario están listos** (62 %). El alumno puede recorrer la mayor parte del curso aplicando ya el motor de progreso (D.4 con desbloqueo secuencial). Próximo módulo en cola: M11 (DLP y compliance, 7 preguntas EX al banco — el más voluminoso del Área 4).

 Mismo patrón que B.1: contenido pedagógico voluminoso (teoría 75 min + glosario + recursos) en este PR; labs + quiz + 5 preguntas al banco llegan en E.2.
  - **`teoria.md`** completa (~530 líneas, 6 secciones, 75 min lectura):
    - 10.1 Por qué Purview con Agent 365 (gap que cubre respecto a CA, las tres preguntas que Purview responde, componentes que aplican a agentes).
    - 10.2 DSPM for AI (cuatro paneles del dashboard, comportamiento típico post-GA, detección automática vía SITs y labels existentes, acciones desde el dashboard).
    - 10.3 Sensitivity labels y archivos `.agent` (aplicación a archivos, herencia automática en outputs, labels sobre blueprints, auto-labeling).
    - 10.4 Trazabilidad por agente (eventos `AgentInvoke`, `AgentDataAccess`, `AgentOutputGenerated` con campos enriquecidos; retención hasta 10 años con Audit Premium; búsquedas en eDiscovery Premium con KQL filtrable por `agentId`).
    - 10.5 Information protection en outputs (cifrado AES-256 automático, watermark con UPN, restricciones de compartición, Endpoint DLP en la última milla).
    - 10.6 Operaciones del día a día (triaje semanal DSPM, auditoría mensual de outputs, respuesta a solicitud regulatoria, revisión trimestral de policies).
    - Glosario inline de 14 términos clave.
  - **`recursos.md`** con URLs de Microsoft Learn (Purview overview, DSPM for AI, Audit Premium, eDiscovery Premium, SITs reference, Endpoint DLP), blogs oficiales (Purview Tech Community, anuncio de integración con Agent 365), lecturas adicionales (NIST AI RMF, ISO/IEC 42001, GDPR Art. 22) y herramientas (Graph PowerShell, IPP module, Compliance portal).
  - **`module.yaml`** con los 6 OAs cubriendo Comprender, Aplicar, Analizar, Crear; 14 términos de glosario; prerrequisitos M01+M06+M09; `estado: produciendo`, `fase_produccion: 2`, `preguntas_aporta_examen_final: 5`.
  - **`README.md`** del directorio actualizado.
  - Borrado: placeholders `evaluacion.md`, `laboratorios.md` originales.
- `[Build]` Validador `scripts/validate-course.py` reporta 268 checks OK · 0 warnings · 0 errors. Build Vite OK 3.13s.

 **Cierra el Bloque D**. El alumno avanza por defecto módulo a módulo (M02 desbloqueado al completar M01, etc.) y puede activar un override «modo acceso libre» desde `/progreso` si prefiere saltarse el orden.
  - **`lib/progress.ts`** extendido:
    - Nuevo tipo `AccessMode = 'sequential' | 'free'` con default `'sequential'`.
    - Nuevas funciones `getAccessMode()` y `setAccessMode(mode)` que persisten en `agent365-access-mode` y disparan el evento de progreso.
    - Nueva función pura `isModuleUnlocked(moduleId, mode, producedIds, completedIds)`: M01 siempre desbloqueado; en modo `sequential`, un módulo se desbloquea cuando todos los módulos producidos con id menor están completos. En modo `free`, todos accesibles. Los módulos no producidos se ignoran en el cálculo.
    - `clearAllProgress` ahora limpia también el modo de acceso (vuelve a secuencial).
  - **`useModuleProgress.ts`** extendido con dos hooks:
    - `useAccessMode()`: tupla `[mode, setMode]` reactiva.
    - `useUnlockState()`: devuelve `{ mode, isUnlocked(moduleId) }` aplicando el cálculo a los snapshots actuales del curso. Una llamada por consumidor; el resultado es estable mientras no cambien progreso o modo.
  - **`ModulePage.tsx`**: gate de acceso. Si el módulo está bloqueado, redirige a `/progreso?locked={N}` para que la página pueda mostrar un mensaje explicativo, en lugar de un toast efímero. La URL queda guardable en bookmarks: al desbloquear, el mensaje desaparece naturalmente.
  - **`ProgressPage.tsx`** ampliada:
    - **Banner contextual** en la parte superior cuando llega vía `?locked={N}`, identifica el módulo y explica cómo desbloquearlo.
    - **Toggle «Modo de acceso»** al pie con switch accesible (`role="switch"`, `aria-checked`), copy diferenciado por modo, y badge con el modo activo.
    - `findNextStep` respeta el desbloqueo: solo sugiere módulos accesibles. Si todos los desbloqueados están completos, no muestra próximo paso.
    - Las filas de módulo distinguen tres estados: `pendiente` (no producido), `bloqueado` (producido pero locked en sequential), `disponible` (producido + unlocked). Cada estado tiene su badge.
  - **`NavSidebar.tsx`**: módulos producidos pero bloqueados se renderizan en gris con icono de candado y tooltip explicativo, sin enlace.
  - **`HomePage.tsx`**: misma diferenciación de estados en la tabla del temario: «Disponible» (verde), «Bloqueado» (ámbar), «Fase N» (gris).
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 1.28s.

**Hito alcanzado — Bloque D cerrado.** El motor de progreso del alumno es funcionalmente completo: tracking por sección, criterios de finalización, vista global de progreso, próximo paso recomendado y desbloqueo secuencial con override. Lo único pendiente para «modo curso real con persistencia cross-device» es Supabase + auth (Bloque F).

 Tercer de cuatro entregas del Bloque D. Aterriza el motor de progreso de D.2 en una página visible: el alumno ve su avance por módulo y por área, y un card destacado «Próximo paso» que apunta a la primera sección pendiente.
  - **Nueva `platform/src/pages/ProgressPage.tsx`** (~290 líneas):
    - Hero con barra de progreso global y conteo `X / N módulos completos · pct%`.
    - **Card «Tu próximo paso»**: identifica el primer módulo producido no completo y dentro de él la primera sección pendiente (orden `teoria → quiz-practica → laboratorios → recursos`). Se oculta cuando todo está completo.
    - **Progreso por área del examen**: agrupación de módulos por área con peso del examen (15/30/15/20/20 %), conteo de completados por área y porcentaje.
    - **Mini-badges por módulo**: fila de 4 iconos (uno por sección) con tres estados visuales (`completed` verde con check, `in-progress` ámbar con icono, `not-started` neutral con icono). Tooltip nativo con el estado en texto.
    - **Módulos pendientes de producción**: aparecen en gris con badge «Pendiente» y candado, sin enlace.
    - **Zona de reinicio**: botón discreto al pie con confirmación inline destructiva. Llama a `clearAllProgress` del motor.
  - **`App.tsx`**: ruta nueva `/progreso`.
  - **`Header.tsx`**: enlace «Progreso» en la barra superior con icono `Activity`, visible en todas las páginas. Label oculto en móvil para ahorrar espacio.
  - **Bonus**: corregido `course.ts` con `estado: 'producido'` para M09 (estaba como `pendiente` aunque B.2 lo cerró) y `duracionMin: 183` (era `75` antes de añadir labs+quiz).
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.20s.

 Empieza a tracker el avance del alumno por sección y módulo, sin desbloqueo (eso llega en D.4).
  - **Nuevo `platform/src/lib/progress.ts`** (~270 líneas): tipos `SectionStatus` (`not-started` / `in-progress` / `completed`), `SectionState`, `ModuleProgressSnapshot`. Funciones puras `readModuleProgress`, `markSectionVisited`, `clearAllProgress`, `subscribeProgressChanges`. Constantes públicas `THEORY_THRESHOLD_PCT = 80` y `QUIZ_PASS_RATIO = 0.7`.
  - **Criterios de finalización por sección**: teoría completa cuando el scroll máximo alcanza ≥80 % (lectura del `agent365-reading-m{N}-teoria` que ya escribe `ScrollProgress`); quiz completo cuando hay un intento con score ≥70 % (lectura del `agent365-quiz-m{N}-history` que ya escribe `useQuizState`); laboratorios y recursos completos al visitar la sección al menos una vez (nuevo store `agent365-section-visits`).
  - **Diseño sin duplicación**: el motor lee directamente de las claves que ya escriben otros componentes en lugar de mantener un mirror separado, evitando inconsistencias.
  - **Nuevo hook `useModuleProgress(moduleId)`**: snapshot reactivo que se recalcula al recibir eventos `agent365-progress-changed` (mismo tab, vía `CustomEvent`) o `storage` nativo (cross-tab).
  - **Nuevo hook `useCourseProgress()`**: snapshot agregado de todos los módulos producidos. Pensado para la vista global `/progreso` (D.3) y badges en la home.
  - **Integraciones**:
    - `ScrollProgress.tsx` ahora dispara el evento custom tras persistir `maxPct`.
    - `useQuizState.ts` dispara el evento custom tras persistir `history` y al `clearHistory`.
    - `ModulePage.tsx` llama a `markSectionVisited` al navegar a `laboratorios` o `recursos`, y muestra un check verde en la pestaña de cada sección completada.
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.45s.

 Cierra la deuda técnica de la sincronía manual TS↔markdown que arrastrábamos desde Hito B.
  - **Nuevo `platform/src/lib/quiz-parser.ts`** (~170 líneas): parsea bloques `::: pregunta ... :::` de los `quiz-practica.md` extrayendo el YAML interno con js-yaml (browser-safe) y construyendo objetos `Question` validados. Soporta los 5 tipos canónicos: multiple-choice, multiple-response, scenario, drag-and-drop, ordering.
  - **`platform/src/lib/quiz.ts` reescrito** (de 835 a ~245 líneas): elimina las 27 `Q_PRACT_NN_M` hardcoded. `getQuestionsForModule` ahora usa `import.meta.glob` eager sobre los `quiz-practica.md` del paquete y los pasa por `parseQuizMarkdown`. **Pasamos de 27 preguntas hardcoded a 60 preguntas leídas del paquete** (8 M01 + 6 M02 + 6 M03 + 5 M04 + 5 M05 + 11 M06 + 5 M07 + 6 M08 + 8 M09).
  - **Tipos extendidos**: añadidos `MultipleResponseQuestion` con `correctOptionIds: string[]` y `OrderingQuestion` con `correctOrder: string[]`. `Answer` union extendida con `MRAnswer` y `OrderingAnswer`. Helpers `isMultipleResponse`, `isOrdering`, y `emptyAnswerFor` / `isAnswerComplete` / `isAnswerCorrect` actualizados para los 4 tipos.
  - **Componentes nuevos**: `QuestionMultipleResponse.tsx` (checkboxes para varias correctas; feedback diferenciando «correcta marcada bien», «correcta no marcada», «incorrecta marcada»), `QuestionOrdering.tsx` (lista reordenable con botones up/down accesibles, indicador de posición, feedback con orden esperado por elemento mal colocado).
  - **`Quiz.tsx`** adaptado: 4 ramas de render (MC + MR + DnD + Ordering). `answeredCount` ahora usa `isAnswerComplete` para soportar todos los tipos.
  - **`QuestionFeedback.tsx`** ampliado con paneles para respuestas MR (lista de correctas marcadas) y Ordering (orden numerado correcto).
  - **Dependencias**: añadido `js-yaml` y `@types/js-yaml`.
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. `npx tsc --noEmit` sin errores. Build Vite OK 2.23s.

 Cierra la **Fase 4** del curso (M01-M09 todos producidos).
  - **`laboratorios.md`** con 4 labs prácticos (90 min total): LAB-09-1 (CA policy bloquea agentes High Risk con flujo Report-only → On), LAB-09-2 (configurar las 6 detecciones de Identity Protection y validar con tráfico de prueba), LAB-09-3 (auditar permisos efectivos de un agente OBO calculando intersección triple blueprint/licencia/consent), LAB-09-4 (diseño end-to-end blueprint + 2 CA policies + ID Protection alerts para agente Foundry de Tesorería autonomous).
  - **`quiz-practica.md`** con 8 preguntas Q-09-1..Q-09-8 cubriendo los 6 OAs en cuatro tipos (multiple-choice, multiple-response, scenario, drag-and-drop). Caso de estudio TextilNova (diseñar dashboard operativo diario del equipo de Seguridad de IA).
  - **7 preguntas EX-09-001..007** acumuladas en `cursos/agent365-cert/banco-examen.md`. Banco pasa de 29 a **36 preguntas oficiales**.
  - **`module.yaml`** actualizado: `estado: producido`, secciones completas (teoria + quiz-practica + laboratorios + recursos), `duracion_min: 183` (75 teoría + 18 quiz + 90 labs), 4 labs declarados.
  - **`platform/src/lib/quiz.ts`** sincronizado: 3 nuevas `Q_PRACT_09_*` (1 multiple-choice OA-09.1, 1 scenario OA-09.5, 1 drag-and-drop OA-09.6).
- `[Build]` Validador `scripts/validate-course.py` reporta 270 checks OK · 0 warnings · 0 errors. Build OK 2.24s.

 M09 estaba en placeholder absoluto desde el inicio del repo. Se produce de cero con el formato del paquete.
  - **`teoria.md`** completa (~530 líneas, 6 secciones, 75 min lectura): permisos en cuatro capas (blueprint heredado, delegated OBO, application own identity, custom security attributes), Conditional Access para workload identities con grants disponibles y patrones canónicos, Identity Protection con las seis detecciones específicas para agentes (anomalous token use, atypical agent travel, token issuer anomaly, suspicious agent application activity, verified threat actor signals, AiTM), trazabilidad OBO vs own identity en sign-in logs y CloudAppEvents, composición de defensas en tres capas, operaciones del día a día (triaje diario de Risky Agents, revisión semanal de CA, revisión trimestral de blueprints).
  - **`recursos.md`** con URLs canónicas de Microsoft Learn (CA workload identities, riskyAgents endpoint, sign-in logs schema), blogs oficiales (Entra blog, Security blog, anuncio GA Agent 365), lecturas adicionales (Zero Trust, RFC 8693 OAuth OBO, NIST SP 800-207) y herramientas (Graph PowerShell SDK, az ad sp, Graph Explorer).
  - **`module.yaml`** con los 6 OAs definidos (cubriendo Comprender, Aplicar, Analizar, Crear), 16 términos de glosario, prerrequisitos M01+M04+M06, secciones teoría + recursos (quiz-practica y laboratorios se añadirán en B.2), `estado: produciendo`, `fase_produccion: 2`, `preguntas_aporta_examen_final: 7`.
  - **`README.md`** del directorio actualizado al estado actual.
  - Borrado: placeholders `evaluacion.md`, `laboratorios.md` originales (laboratorios.md se recrea en B.2 con contenido real).
- `[Build]` Validador `scripts/validate-course.py` reporta 267 checks OK · 0 warnings · 0 errors. Build OK 2.21s.

 Cierra la separación quiz/banco para todos los módulos producidos del curso. M07 (Agent Registry y Map): 5 preguntas Q-07-1..Q-07-5 nuevas cubriendo los 5 OAs en cuatro tipos. M08 (Ciclo de vida): 6 preguntas Q-08-1..Q-08-6 cubriendo los 6 OAs incluyendo MR sobre acciones irreversibles, scenario de Delete fuera de ventana, scenario de Pin con propagación, scenario de reasignar ownership Foundry, DnD de categorías de acciones de gobernanza. Las 9 preguntas oficiales (4 de M07 + 5 de M08) se acumulan en `cursos/agent365-cert/banco-examen.md`. **El banco pasa de 20 a 29 preguntas**.
- `[Build]` `module.yaml` de M07-M08 actualizado: sección `evaluacion-legacy` sustituida por `quiz-practica`; `duracion_min` recalculado (M07 75→87, M08 90→104). Casos de estudio: Lumen Logística para M07 (informe trimestral + identificar agentes hub) y Plain Coffee SL para M08 (procesar 12 propuestas, custom templates por departamento).
- `[Build]` `platform/src/lib/quiz.ts` sincronizado: las 9 preguntas `Q_EX_07_001..004` y `Q_EX_08_001..005` se sustituyen por 6 `Q_PRACT_*` (3 por módulo). Tras este PR, **lib/quiz.ts ya no contiene NINGUNA pregunta del banco final EX-NN-NNN como pregunta de práctica**: cierra la deuda técnica original que motivó las fases A.2, C.1, C.2 y C.3.
- `[Build]` Validador `scripts/validate-course.py` ahora reporta 269 checks OK · 0 warnings · 0 errors.

 M06 (Microsoft Entra Agent ID) es el módulo más extenso del Área 2 con 11 preguntas oficiales, así que se aborda en su propio PR. `evaluacion.md` legacy se separa en `quiz-practica.md` con 11 preguntas Q-06-1..Q-06-11 nuevas cubriendo los 7 OAs del módulo (cuatro tipos de objetos, blueprints, sponsorship, lifecycle workflows, OBO vs own identity, custom security attributes y operaciones bulk) en seis tipos (multiple-choice, multiple-response, scenario, drag-and-drop). Las 11 preguntas oficiales `EX-06-001` a `EX-06-011` se acumulan en `cursos/agent365-cert/banco-examen.md`. El banco pasa de 9 a **20 preguntas oficiales**.
- `[Build]` `module.yaml` de M06 actualizado: sección `evaluacion-legacy` sustituida por `quiz-practica`; `duracion_min` recalculado de 105 a 127 (suma 22 min de quiz). Caso de estudio cambia a Banco Cervantes (entidad financiera con 4 áreas: Crédito, Fraude, Reporting Regulatorio, Tesorería).
- `[Build]` `platform/src/lib/quiz.ts` sincronizado: las 11 preguntas `Q_EX_06_001..011` se sustituyen por 3 `Q_PRACT_06_*` (multiple-choice OA-06.1, drag-and-drop OA-06.1, scenario OA-06.4). Las otras 8 viven solo en el markdown hasta el parser real.
- `[Build]` Validador `scripts/validate-course.py` ahora reporta 267 checks OK · 0 warnings · 0 errors.
- `[Build]` Fase C.1 — Refactor M02-M05 (Área 1 completa) al formato del paquete (PR #34). Mismo patrón que A.2: `evaluacion.md` legacy de cada módulo se separa en `quiz-practica.md` con 5-6 preguntas `Q-NN-N` nuevas distintas a las del banco, y las preguntas oficiales `EX-NN-NNN` se acumulan en `cursos/agent365-cert/banco-examen.md`. El banco pasa de 3 a **9 preguntas** (M01 + M02-M05). El alumno que abre `/modulo/X/quiz-practica` para X∈[2,5] ahora ve preguntas distintas a las que verá en el examen final. Se borran los 4 `evaluacion.md` legacy. Total de preguntas de práctica nuevas producidas: 22 (M02:6, M03:6, M04:5, M05:5).
- `[Build]` `module.yaml` de M02-M05 actualizado: sección `evaluacion-legacy` sustituida por `quiz-practica`; `duracion_min` recalculado sumando la duración del quiz (M02 75→90, M03 60→72, M04 45→55, M05 75→87).
- `[Build]` `platform/src/lib/quiz.ts` sincronizado: las 6 preguntas `Q_EX_02_001/002/003`, `Q_EX_03_001`, `Q_EX_04_001`, `Q_EX_05_001` se sustituyen por 12 `Q_PRACT_NN_M` (3 por módulo, mix de multiple-choice + scenario + drag-and-drop). Las otras 10 preguntas (multiple-response, ordering y MCs adicionales) viven solo en el markdown hasta que llegue el parser real en Bloque D.
- `[Build]` Validador `scripts/validate-course.py` ahora reporta 266 checks OK · 0 warnings · 0 errors.
- `[Build]` Fase A.2 — Refactor de M01 al formato del paquete (PR #33). Se separa `evaluacion.md` legacy en dos archivos canónicos: `cursos/agent365-cert/banco-examen.md` con las 3 preguntas oficiales del banco final (`EX-01-001/002/003`) y `cursos/agent365-cert/modulos/modulo-01-fundamentos/quiz-practica.md` con 8 preguntas nuevas (`Q-01-1` a `Q-01-8`) cubriendo los 5 OAs del módulo en cinco tipos distintos (multiple-choice, multiple-response, scenario, drag-and-drop, ordering). El `module.yaml` declara la sección `quiz-practica` en lugar de `evaluacion-legacy`. Se mantiene el caso de estudio de Plain Coffee SL como refuerzo no evaluable al final del quiz.
- `[Build]` `platform/src/lib/content.ts` añade `quiz-practica` al `ContentType` union; `ModulePage.tsx` actualiza el routing y la UI para usar `/modulo/X/quiz-practica` (con redirect legacy `/evaluacion` → `/quiz-practica`); `NavSidebar.tsx` actualiza el slug y label a "Práctica"; `lib/quiz.ts` sustituye las 3 preguntas hardcoded `Q_EX_01_*` por `Q_PRACT_01_1/3/5` (multiple-choice, scenario, drag-and-drop) sincronizadas con el markdown; `Quiz.tsx` actualiza el copy del botón a "Reiniciar práctica".
- `[Build]` Validador `scripts/validate-course.py` ahora reporta 262 checks OK · 0 warnings (antes 260 + 1 warning por banco-examen.md inexistente).

---

## 2026-05-06

- `[Setup]` Repositorio inicializado con estructura completa de 17 módulos
- `[Investigación]` Versionada la investigación deep-research base en `investigacion/deep-research-mayo-2026.md`
- `[Diseño]` Borrador inicial de `docs/arquitectura-curso.md` con esquema de 17 módulos y duraciones estimadas
- `[Diseño]` Convenciones de redacción definidas en `docs/convenciones-redaccion.md`
- `[Setup]` `CLAUDE.md` añadido para sesiones futuras de Claude Code
- `[Setup]` Plantillas de módulo (teoria.md, laboratorios.md, evaluacion.md, recursos.md) creadas en cada uno de los 17 módulos
- `[Diseño]` **Fase 1 completada.** Blueprint maestro completo en `docs/arquitectura-curso.md`:
  - 8 áreas de competencia con peso de examen
  - 17 módulos detallados con objetivos de aprendizaje (formato Bloom, IDs OA-XX.N), sub-secciones de teoría con duración exacta, conceptos clave, laboratorios con dificultad y prerrequisitos, reparto de preguntas al examen
  - Estructura del examen final: 60 preguntas, 90 min, 7 tipos, distribución por área
  - Matriz de competencias inicial con 87 objetivos cubiertos
  - Ruta de producción con dependencias entre módulos para Fases 2-7
- `[Diseño]` **Revisión 1.1 del blueprint** tras feedback:
  - Áreas reducidas de 8 a **5 estilo Microsoft Learn**. Identidad pasa a ser la más pesada.
  - Duración total recortada de 23h a **18h** (1080 min). Se aprietan minutajes de teoría manteniendo todos los laboratorios.
  - Concepto de "certificación con validez de 18 meses" sustituido por **"constancia de finalización del curso"** sin caducidad ni recertificación.
  - Tres caminos de aprendizaje eliminados: **itinerario único** de 16 módulos secuenciales.
- `[Diseño]` **Revisión 1.2 del blueprint:** pesos finales del examen.
  - Pesos cambiados de rangos (estilo Microsoft Learn) a **valores exactos** justificados técnicamente: 15% / 30% / 15% / 20% / 20%.
  - Identidad sube a 30% (era 25-30%) por densidad conceptual: 4 tipos de objetos nuevos en Entra, OBO/own identity, CA para agentes, ID Protection.
  - Reparto exacto: 9 / 18 / 9 / 12 / 12 = 60 preguntas.
  - Reparto a nivel de módulo reequilibrado coherentemente (M03→1, M06→11, M08→5, M10→5, M12→7, M14→2).
- `[Diseño]` **Auditoría de Fase 1** completada en `docs/auditoria-fase-1.md`:
  - Verificación sistemática de 96 temas del research contra los 17 módulos del blueprint.
  - Resultado: 86 temas cubiertos explícitamente, 7 indirectamente, 0 gaps.
  - 3 caveats técnicos identificados como (sensitivity labels en `.agent` files, ready-made SharePoint agents no editables, análiticas Foundry V2). Aplicados en este mismo commit.
- `[Diseño]` **Banco de preguntas modelo** creado en `docs/banco-preguntas-modelo.md`:
  - 12 preguntas reales completas (enunciado + opciones + respuesta + justificación + variantes).
  - Cubren los 7 tipos de pregunta del examen, 5 niveles de Bloom, 3 dificultades, 5 áreas y 8 módulos.
  - Establecen el estándar de calidad al que se ajustarán las 60 preguntas finales producidas en Fases 2-7.
- `[Fix]` 3 caveats añadidos al blueprint:
  - M14.2: sensitivity labels no se aplican directamente sobre `.agent` files; default ready-made SharePoint agents no son editables.
  - M07.4: análiticas Foundry solo V2.

---

## 2026-05-06 (continuación) — Fase 2

- `[Contenido]` **Módulo 01 producido al 100%** como prototipo de calidad. Establece el estándar para los 16 módulos restantes.
  - `teoria.md` (356 líneas, ~7.500 palabras): seis sub-secciones temporizadas, glosario inicial de 10 términos, mapa de capas en ASCII, tabla comparativa de los seis productos confundibles, distinción de los dos SDKs, los cuatro stakeholders core, distinción CCS/A365 con tabla de casos de uso, cronología completa, badges de estado por capacidad, fuentes oficiales.
  - `laboratorios.md` (115 líneas): ejercicio de mapeo de 10 escenarios al producto correcto con plantilla de respuesta y solución comentada.
  - `evaluacion.md` (174 líneas): 3 preguntas oficiales del banco (EX-01-001 multiple-choice, EX-01-002 escenario, EX-01-003 drag-and-drop) con justificación, variantes para evitar repetición y caso de estudio integrado de Plain Coffee SL.
  - `recursos.md` (91 líneas): enlaces a documentación oficial de Microsoft Learn, blogs, whitepapers, repos GitHub.
  - `README.md` del módulo con resumen, OAs y validación.
  - 2 diagramas SVG: `01-control-plane.svg` (Agent 365 sobre los builders) y `02-stakeholders.svg` (los cuatro perfiles administrativos).

---

## 2026-05-06 (continuación 2) — Camino B: prototipo del shell antes de Fase 3

- `[Decisión]` **Cambio en el orden del plan.** Originalmente la producción del shell de e-learning (Fase 8) iba al final, después de los 17 módulos. Decisión revisada: construir un **prototipo del shell con sólo M01 dentro** antes de seguir produciendo módulos. Si el diseño del shell falla, falla con 1 módulo de contenido y no con 17. Las fases 3-7 avanzan después sobre un shell ya validado.
- `[Plan]` PLAN.md reescrito introduciendo la **Fase 2.A — Prototipo del shell de e-learning con M01**. Stack confirmado: Vite + React 18 + TypeScript + Tailwind, tipografías Bricolage Grotesque + Instrument Sans, iconos Lucide React (Material UI Icons como fallback), routing React Router v6, markdown vía react-markdown, evaluación interactiva con @dnd-kit para drag-and-drop, hosting en Vercel.
- `[Convenciones]` Regla absoluta de **cero emojis** en cualquier archivo del repositorio explicitada en `docs/convenciones-redaccion.md`. Excepción única: badges de estado del producto en formato texto entre corchetes (`[GA]`, `[Preview]`, `[Frontier]`, `[Deprecated]`). Iconos sólo en el shell React vía Lucide o Material UI.
- `[Cleanup]` Pase global de cleanup: 93 archivos limpiados de emojis (`🟢 🟡 🔴 ✅ 🚧 ⏳ ⚠️ 📂 📄 🧪 📝 🔗 📋 ❌ ✓` y todas sus combinaciones). Reemplazos por equivalentes de texto donde aplica:
  - `🟢 GA` → `[GA]`, `🟡 Preview` → `[Preview]`, `🔴 Frontier` → `[Frontier]`, `⚠️ Deprecated` → `[Deprecated]`
  - Estados de fase y módulo: emoji eliminado, texto conservado (`✅ Producido` → `Producido`)
  - Iconos decorativos en bullets: eliminados
  - Tablas con `✅/❌`: convertidas a `Sí/No`
- `[Sitio]` `index.md` y `modulos/README.md` reescritos con el nuevo orden de fases y sin emojis. La Fase 2.A queda marcada explícitamente como activa.
