---
modulo: 7
tipo: recursos
titulo: "Recursos del Módulo 07"
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
---

# Módulo 07 — Recursos

> Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.

---

## Documentación oficial — Agent Registry y Agent Map

- [Microsoft Agent 365 admin center overview](https://learn.microsoft.com/microsoft-agent-365/admin/admin-center-overview) — la página Overview con hero metrics y Top actions.
- [Agent Registry — manage your agent inventory](https://learn.microsoft.com/microsoft-agent-365/admin/registry) — anatomía completa del Registry.
- [Agent Map — visualize agent relationships](https://learn.microsoft.com/microsoft-agent-365/admin/map) — Map view con clusters y conexiones agent-to-agent.
- [Customize Registry columns and filters](https://learn.microsoft.com/microsoft-agent-365/admin/registry-customization) — personalización de la tabla.

## Documentación oficial — Métricas y analytics

- [Agent analytics in Microsoft 365 admin center](https://learn.microsoft.com/microsoft-agent-365/admin/analytics) — analíticas agregadas por categoría y plataforma.
- [Hero metrics and Top actions for you](https://learn.microsoft.com/microsoft-agent-365/admin/overview-page) — interpretación de los KPIs y categorías de acciones.
- [Agent V2 vs V1 in Foundry](https://learn.microsoft.com/azure/ai-foundry/agent-v1-v2-comparison) — diferencias y limitaciones de analytics para V1 históricos.

## Documentación oficial — Risks column

- [Risks column in Agent Registry](https://learn.microsoft.com/microsoft-agent-365/admin/risks-column) — qué muestra y cómo se calcula.
- [Risk score calculation methodology](https://learn.microsoft.com/microsoft-agent-365/admin/risk-score-method) — señales contribuyentes y pesos.
- [Required licenses for Risks column](https://learn.microsoft.com/microsoft-agent-365/admin/license-requirements#risks-column) — E7 y conectores Defender + Purview.

## Documentación oficial — Registry sync multicloud

- [Connect AWS Bedrock to Agent Registry (Preview)](https://learn.microsoft.com/microsoft-agent-365/admin/registry-sync-aws-bedrock) — sincronización con AWS Bedrock.
- [Connect Google Gemini Enterprise to Agent Registry (Preview)](https://learn.microsoft.com/microsoft-agent-365/admin/registry-sync-gemini) — sincronización con Gemini Enterprise.
- [Registry sync limitations and roadmap](https://learn.microsoft.com/microsoft-agent-365/admin/registry-sync-limitations) — limitaciones actuales y plataformas en roadmap.

## Documentación oficial — Exportación e integración

- [Export agent inventory to Excel/CSV](https://learn.microsoft.com/microsoft-agent-365/admin/export-inventory) — formatos y limitaciones.
- [Agent inventory via Microsoft Graph](https://learn.microsoft.com/graph/api/copilot-admin-list-agents) — consulta del inventario por API para automatización.
- [Power Automate — automate agent inventory exports](https://learn.microsoft.com/power-automate/agent-365-integration#export-inventory) — flow para exportación automática trimestral.

## Buenas prácticas

- [Daily admin routine for Agent 365](https://techcommunity.microsoft.com/blog/agent-365-daily-routine) — rutina recomendada por el equipo de Microsoft.
- [Identifying ownerless agents and remediation](https://techcommunity.microsoft.com/blog/agent-ownerless-cleanup) — patrón de limpieza de agentes huérfanos.
- [Quarterly Agent 365 governance review template](https://techcommunity.microsoft.com/blog/agent-365-governance-review-template) — plantilla para reportes trimestrales.

## Para los siguientes módulos

- **M08 — Despliegue, distribución y ciclo de vida:** acciones sobre el inventario (publish, deprecate, transfer ownership).
- **M09 — Permisos, accesos y Conditional Access:** las exceptions vistas en Top actions for you se gestionan aquí.
- **M12 — Monitorización, auditoría y reporting:** explotación avanzada de la Risks column y eventos de Identity Protection.
