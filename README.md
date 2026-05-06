# Microsoft Agent 365 — Certificación para Administradores IT

> Curso de certificación para administradores IT en gobernanza y administración de agentes de IA en Microsoft 365, con foco en **Microsoft Agent 365** como plano de control unificado.

**Producido por** [Plain Vanilla Solutions SL](https://plainvanilla.es)
**Duración estimada** 22-25 horas · **Nivel** Intermedio-Avanzado · **Idioma** Español
**Última actualización** mayo 2026

---

## Qué cubre este curso

Al completarlo, el alumno es capaz de **administrar y gobernar a la perfección todos los agentes de IA que operan en su tenant de Microsoft 365**, incluyendo agentes Microsoft, agentes de partners, agentes construidos en Copilot Studio/Foundry y agentes de plataformas externas (AWS Bedrock, Google Gemini Enterprise) registrados vía sync.

El curso se construye alrededor de Microsoft Agent 365 (GA desde el 1 de mayo de 2026) e integra todo el ecosistema de governance:

- **Microsoft 365 admin center** — Agent Registry, Agent Map, ciclo de vida
- **Microsoft Entra Agent ID** — identidades, blueprints, agent users, sponsorship
- **Microsoft Purview** — DSPM for AI, sensitivity labels, DLP, IRM, eDiscovery, Compliance Manager
- **Microsoft Defender** — advanced hunting, real-time protection, posture management
- **Copilot Control System** — gobernanza para Copilot y agentes
- **Plataformas de creación** — Copilot Studio, Foundry, SharePoint Agents, Microsoft 365 Agents SDK

---

## Para quién

- Administradores de Microsoft 365 / Entra / Purview / Defender
- Arquitectos de seguridad enterprise
- Responsables de gobernanza de IA en empresas
- Consultores de adopción de Copilot que necesitan dominar la capa de gobernanza

**Prerrequisitos:** experiencia previa administrando un tenant de Microsoft 365 (E3 o E5), familiaridad con Microsoft Entra ID y conceptos básicos de Conditional Access.

---

## Estructura

| # | Módulo | Duración |
|---|---|---|
| 01 | Fundamentos: ¿Qué es Microsoft Agent 365? | 1.5h |
| 02 | Arquitectura y componentes | 1.5h |
| 03 | Licenciamiento, prerrequisitos y planificación | 1.5h |
| 04 | Roles administrativos y delegación | 1h |
| 05 | Configuración inicial del tenant | 1.5h |
| 06 | Microsoft Entra Agent ID e identidades de agentes | 2h |
| 07 | Agent Registry y Agent Map | 1.5h |
| 08 | Despliegue, distribución y ciclo de vida | 2h |
| 09 | Permisos, accesos y Conditional Access | 1.5h |
| 10 | Microsoft Purview y protección de datos | 1.5h |
| 11 | DLP, sensitivity labels y compliance | 1.5h |
| 12 | Monitorización, auditoría y reporting con Defender | 1.5h |
| 13 | Copilot Control System integrado con Agent 365 | 1h |
| 14 | Gobernanza avanzada y políticas | 1.5h |
| 15 | Troubleshooting y casos prácticos | 1h |
| 16 | Costes y optimización | 1h |
| 17 | Examen final de certificación | 1.5h |

Cada módulo incluye:
- **Teoría** con diagramas, capturas y referencias oficiales
- **Laboratorio práctico** paso a paso (admin centers, PowerShell, CLI, KQL)
- **Evaluación** con preguntas de comprobación + caso de estudio
- **Recursos** con enlaces a documentación oficial Microsoft Learn

---

## Cómo se entrega

Este repositorio produce **dos formatos del mismo contenido**:

1. **E-learning web interactivo** (carpeta `web/`) — sitio HTML estático con navegación entre módulos, quizzes interactivos y examen final con scoring. Servible en GitHub Pages, intranet o cualquier servidor web.
2. **PDFs descargables por módulo** (carpeta `pdfs/`) — un PDF por módulo + manual completo del curso, generados desde el markdown fuente.

El contenido fuente está en markdown bajo `modulos/` y es la fuente única de verdad. Los HTMLs y PDFs se generan con los scripts de `scripts/`.

---

## Estado del proyecto

Ver [`PLAN.md`](./PLAN.md) para el roadmap detallado y el estado actual de cada fase.

| Fase | Estado |
|---|---|
| Fase 0: Investigación deep-research | ✅ Completada |
| Fase 1: Diseño maestro y blueprint | 🟡 En curso |
| Fase 2: Producción Módulo 1 (prototipo) | ⏳ Pendiente |
| Fase 3-6: Producción módulos 2-17 | ⏳ Pendiente |
| Fase 7: Examen final + revisión integral | ⏳ Pendiente |
| Fase 8: Build de e-learning web + PDFs | ⏳ Pendiente |

---

## Estructura del repositorio

```
agent365-cert-course/
├── README.md                  # Este archivo
├── PLAN.md                    # Roadmap de producción
├── CLAUDE.md                  # Contexto para Claude Code en sesiones futuras
├── docs/                      # Diseño maestro del curso
│   ├── arquitectura-curso.md
│   ├── matriz-competencias.md
│   ├── guia-instructor.md
│   ├── convenciones-redaccion.md
│   └── changelog.md
├── modulos/                   # Contenido fuente (markdown)
│   ├── modulo-01-fundamentos/
│   │   ├── teoria.md
│   │   ├── laboratorios.md
│   │   ├── evaluacion.md
│   │   ├── recursos.md
│   │   └── assets/
│   └── ... (17 módulos)
├── web/                       # E-learning HTML interactivo
├── pdfs/                      # PDFs generados (output)
├── scripts/                   # Build automation
└── investigacion/             # Investigación base versionada
    └── deep-research-mayo-2026.md
```

---

## Licencia

© 2026 Plain Vanilla Solutions SL. Todos los derechos reservados.

Este curso es propiedad intelectual de Plain Vanilla Solutions SL. Se autoriza su uso interno para programas formativos delivered por Plain Vanilla Solutions y partners autorizados.

Las marcas Microsoft, Microsoft 365, Microsoft Agent 365, Copilot, Entra, Purview y Defender son propiedad de Microsoft Corporation. Las capturas de pantalla y referencias documentales se utilizan bajo el principio de uso educativo y se citan a la fuente original (`learn.microsoft.com`) en cada módulo.
