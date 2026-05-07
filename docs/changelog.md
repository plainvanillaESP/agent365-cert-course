# Changelog

Registro de cambios significativos en la producción del curso.

Formato: `YYYY-MM-DD — [Tipo] Descripción`

Tipos: `[Setup]` `[Investigación]` `[Diseño]` `[Contenido]` `[Build]` `[Fix]` `[Docs]`

---

## 2026-05-07

- `[Build]` Fase C.1 — Refactor M02-M05 (Área 1 completa) al formato del paquete (PR #?). Mismo patrón que A.2: `evaluacion.md` legacy de cada módulo se separa en `quiz-practica.md` con 5-6 preguntas `Q-NN-N` nuevas distintas a las del banco, y las preguntas oficiales `EX-NN-NNN` se acumulan en `cursos/agent365-cert/banco-examen.md`. El banco pasa de 3 a **9 preguntas** (M01 + M02-M05). El alumno que abre `/modulo/X/quiz-practica` para X∈[2,5] ahora ve preguntas distintas a las que verá en el examen final. Se borran los 4 `evaluacion.md` legacy. Total de preguntas de práctica nuevas producidas: 22 (M02:6, M03:6, M04:5, M05:5).
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
