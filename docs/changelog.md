# Changelog

Registro de cambios significativos en la producción del curso.

Formato: `YYYY-MM-DD — [Tipo] Descripción`

Tipos: `[Setup]` `[Investigación]` `[Diseño]` `[Contenido]` `[Build]` `[Fix]` `[Docs]`

---

## 2026-05-07

- `[Contenido]` Fase B.2 — M09 cerrado: laboratorios + quiz + 7 preguntas al banco + sync lib/quiz.ts (PR #?). Cierra la **Fase 4** del curso (M01-M09 todos producidos).
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
