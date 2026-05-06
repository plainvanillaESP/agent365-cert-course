# Microsoft Agent 365 IT Admin

> Curso de certificación para administradores IT sobre Microsoft Agent 365 y la gobernanza de agentes de IA en Microsoft 365.

**Producido por:** Plain Vanilla Solutions SL
**Producto base:** Microsoft Agent 365 — GA desde el 1 de mayo de 2026
**Idioma:** Español de España

---

## Sobre este sitio

Este sitio es la **vista de revisión interna** del contenido del curso. Renderiza los módulos en formato navegable mientras se producen, pero no es el producto final que verá el alumno. La experiencia del alumno se construye en un shell React separado a partir de la **Fase 2.A** del plan.

---

## Estado de producción

| Fase | Descripción | Estado |
|---|---|---|
| Fase 0 | Investigación deep-research base | Completada |
| Fase 1 | Diseño maestro (blueprint, áreas, evaluación, banco modelo) | Completada |
| Fase 2 | Módulo 01 prototipo de contenido | Completada |
| **Fase 2.A** | **Prototipo del shell de e-learning con M01** | **En curso** |
| Fase 3 | Módulos 02-05 (Fundamentos & Setup) | Pendiente |
| Fase 4 | Módulos 06-09 (Identidad y ciclo de vida) | Pendiente |
| Fase 5 | Módulos 10-13 (Datos, monitorización, CCS) | Pendiente |
| Fase 6 | Módulos 14-16 (Avanzado) | Pendiente |
| Fase 7 | Módulo 17 — Examen final | Pendiente |
| Fase 8 | Shell completo + auth + certificación + PDFs | Pendiente |

El detalle de cada fase está en [Plan de producción](PLAN.md).

---

## Estructura del curso

El curso tiene **17 módulos** que suman **18 horas de teoría + laboratorios** más una **evaluación final de 90 minutos** con 60 preguntas. Los módulos cubren cinco áreas de competencia:

| Área | Peso del examen |
|---|---|
| Plan and configure Microsoft Agent 365 | 15% |
| Manage agent identities with Microsoft Entra Agent ID | 30% |
| Manage the agent registry and lifecycle | 15% |
| Implement data protection with Microsoft Purview | 20% |
| Monitor, investigate and govern | 20% |

El detalle completo está en [Arquitectura del curso](docs/arquitectura-curso.md).

---

## Navegación rápida

### Para revisar el diseño

- [Arquitectura del curso](docs/arquitectura-curso.md) — el blueprint maestro de los 17 módulos.
- [Auditoría de Fase 1](docs/auditoria-fase-1.md) — verificación sistemática de cobertura.
- [Banco de preguntas modelo](docs/banco-preguntas-modelo.md) — 12 preguntas reales que muestran el estándar de calidad de la evaluación.
- [Convenciones de redacción](docs/convenciones-redaccion.md) — tono, formato, regla de cero emojis.

### Para revisar el contenido producido

- [Módulo 01 — Fundamentos](modulos/modulo-01-fundamentos/README.md) — único módulo producido al 100% por ahora; sirve como prototipo de calidad.

### Para entender el contexto

- [Investigación deep-research mayo 2026](investigacion/deep-research-mayo-2026.md) — base fáctica del curso.
- [Plan de producción](PLAN.md) — roadmap detallado de las 9 fases.
- [Changelog](docs/changelog.md) — registro de decisiones y entregables.

---

## Cómo se actualiza este sitio

Cada vez que se mergea contenido a `main`, GitHub Actions ejecuta `scripts/build_site.py` y `mkdocs build`. El deploy es automático y tarda ~30 segundos.

Repositorio fuente: [github.com/plainvanillaESP/agent365-cert-course](https://github.com/plainvanillaESP/agent365-cert-course)
