# Módulo 01 — Fundamentos: ¿Qué es Microsoft Agent 365?

**Duración:** 60 minutos
**Estado:** ✅ Producido (Fase 2 — prototipo de calidad)
**Fase del curso:** F2
**Área del examen:** 1 — *Plan and configure Microsoft Agent 365*
**Preguntas en evaluación final:** 3 (EX-01-001, EX-01-002, EX-01-003)

---

## Resumen

Módulo de apertura del curso. Establece el marco conceptual sobre el que se construyen los 16 módulos restantes. Cubre qué es Microsoft Agent 365 (un control plane de gobernanza, no un agent builder), por qué existe (problema del *agent sprawl* y del *shadow AI*), cómo se diferencia de Copilot Studio, Foundry, M365 Agents SDK, Agent 365 SDK y Copilot Control System, y cuál es el papel de los cuatro stakeholders core (M365 admin, Entra admin, Purview admin, Defender admin). Termina con la cronología del producto desde Ignite 2025 hasta GA en mayo de 2026.

## Archivos

- [`teoria.md`](./teoria.md) — Contenido teórico con seis sub-secciones temporizadas (60 min).
- [`laboratorios.md`](./laboratorios.md) — Ejercicio de mapeo de 10 escenarios al producto correcto (15 min).
- [`evaluacion.md`](./evaluacion.md) — 3 preguntas oficiales del banco con justificación + variantes, más caso de estudio integrado.
- [`recursos.md`](./recursos.md) — Enlaces a documentación oficial Microsoft Learn, blogs y whitepapers.
- `assets/` — Diagramas SVG y, en futuras revisiones, capturas de pantalla.

## Objetivos de aprendizaje

| ID | Objetivo | Bloom |
|---|---|---|
| OA-01.1 | Explicar el propósito de Microsoft Agent 365 y por qué se diferencia de un agent builder | Comprender |
| OA-01.2 | Identificar los cuatro stakeholders core y la responsabilidad de cada uno | Recordar |
| OA-01.3 | Distinguir Agent 365 de CCS, M365 Agents SDK, Agent 365 SDK y Copilot Studio | Analizar |
| OA-01.4 | Reconocer los hitos cronológicos del producto (Ignite 2025, GA mayo 2026, capacidades preview) | Recordar |
| OA-01.5 | Argumentar la necesidad de gobernar agentes citando casos de agent sprawl, shadow AI y agentes locales | Evaluar |

## Estructura de la teoría

| Sección | Duración | Contenido |
|---|---|---|
| 1.1 El problema que resuelve Agent 365 | 10 min | Agent sprawl, shadow AI, riesgos de gobernanza |
| 1.2 Posicionamiento: control plane, no builder | 15 min | Agent 365 vs los 6 productos cercanos; mapa de capas |
| 1.3 Los cuatro stakeholders core | 10 min | M365 / Entra / Purview / Defender admin con herramientas |
| 1.4 Agent 365 vs Copilot Control System (CCS) | 10 min | "CCS gobierna personas; A365 gobierna agentes" |
| 1.5 Cronología del producto | 5 min | Ignite 2025 → 9 marzo 2026 → GA 1 mayo 2026 |
| 1.6 Resumen y próximos pasos | 10 min | Mapa mental del curso |

## Validación de finalización

El alumno completa correctamente el módulo cuando:

- [ ] Lee la teoría completa.
- [ ] Resuelve el ejercicio de mapeo (10 escenarios) con justificación correcta para al menos 8 de los 10.
- [ ] Responde correctamente las 3 preguntas de la evaluación.
- [ ] Resuelve el caso de estudio Plain Coffee SL del archivo de evaluación.
- [ ] Puede explicar en treinta segundos qué es Agent 365 sin caer en confusión con CCS o Copilot Studio.

## Próximo módulo

[Módulo 02 — Arquitectura y componentes](../modulo-02-arquitectura/)
