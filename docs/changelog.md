# Changelog

Registro de cambios significativos en la producción del curso.

Formato: `YYYY-MM-DD — [Tipo] Descripción`

Tipos: `[Setup]` `[Investigación]` `[Diseño]` `[Contenido]` `[Build]` `[Fix]` `[Docs]`

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
  - 3 caveats técnicos identificados como ⚠️ (sensitivity labels en `.agent` files, ready-made SharePoint agents no editables, análiticas Foundry V2). Aplicados en este mismo commit.
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
