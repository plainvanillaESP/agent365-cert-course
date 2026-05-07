---
modulo: 8
tipo: recursos
titulo: "Recursos del Módulo 08"
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
---

# Módulo 08 — Recursos

> Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.

---

## Documentación oficial — Acciones de gobernanza

- [Agent lifecycle actions overview](https://learn.microsoft.com/microsoft-agent-365/admin/lifecycle-actions) — las 11 acciones del ciclo agrupadas con su efecto y reversibilidad.
- [Publish, Activate, Deploy: the publishing workflow](https://learn.microsoft.com/microsoft-agent-365/admin/publishing-workflow) — flujo de aprobación.
- [Pin, Block, Unblock: visibility and access controls](https://learn.microsoft.com/microsoft-agent-365/admin/visibility-controls) — controles de visibilidad.
- [Remove vs Delete agents](https://learn.microsoft.com/microsoft-agent-365/admin/remove-vs-delete) — la distinción crítica con timeline de propagación 24 h.
- [Approve agent updates](https://learn.microsoft.com/microsoft-agent-365/admin/approve-updates) — workflow de actualizaciones.

## Documentación oficial — Plantillas

- [Default Template for Agent 365](https://learn.microsoft.com/microsoft-agent-365/admin/default-template) — políticas estándar incluidas.
- [Create Custom Templates](https://learn.microsoft.com/microsoft-agent-365/admin/custom-templates) — guía de creación con políticas configurables.
- [Template policies reference](https://learn.microsoft.com/microsoft-agent-365/admin/template-policies) — catálogo completo de políticas configurables en una template.

## Documentación oficial — Wizard de publishing

- [Publishing wizard step-by-step](https://learn.microsoft.com/microsoft-agent-365/admin/publishing-wizard) — los 7 pasos.
- [Permissions review during publishing](https://learn.microsoft.com/microsoft-agent-365/admin/permissions-review) — paso 6 detallado.
- [Admin consent for agents](https://learn.microsoft.com/microsoft-agent-365/admin/admin-consent) — cuándo se requiere y cómo otorgarlo.

## Documentación oficial — Ownerless y Reassign

- [Manage ownerless agents](https://learn.microsoft.com/microsoft-agent-365/admin/ownerless-agents) — vista de gestión y patrones de remediación.
- [Reassign ownership for Agent Builder agents](https://learn.microsoft.com/microsoft-agent-365/admin/reassign-ownership) — la limitación a Agent Builder.
- [Reassign Copilot Studio agents in Power Platform admin center](https://learn.microsoft.com/power-platform/admin/copilot-studio-app-reassignment) — proceso paralelo para Copilot Studio.
- [Reassign Foundry agents in Azure portal](https://learn.microsoft.com/azure/ai-foundry/reassign-agent-ownership) — proceso para Foundry.

## Documentación oficial — Ciclo de vida y SharePoint Embedded

- [Agent retirement best practices](https://learn.microsoft.com/microsoft-agent-365/admin/retirement-best-practices) — ciclo recomendado de 4 semanas.
- [SharePoint Embedded containers for agents](https://learn.microsoft.com/sharepoint/dev/embedded/agent-containers) — implicaciones para Delete.
- [Restore-Agent365Agent PowerShell cmdlet](https://learn.microsoft.com/powershell/module/microsoft.agent365/restore-agent365agent) — cancelación de Delete dentro de la ventana de 24 h.

## PowerShell y automatización

- [Microsoft Agent 365 PowerShell module](https://learn.microsoft.com/powershell/module/microsoft.agent365) — cmdlets disponibles.
- [Bulk operations on agents](https://learn.microsoft.com/microsoft-agent-365/admin/bulk-operations) — block, deploy, remove en bulk.
- [Power Automate — Agent lifecycle automation](https://learn.microsoft.com/power-automate/agent-365-lifecycle-automation) — flows para el ciclo trimestral.

## Para los siguientes módulos

- **M09 — Permisos, accesos y Conditional Access:** las políticas CA aplicadas en Custom Templates se profundizan.
- **M10 y M11 — Microsoft Purview:** DLP y sensitivity labels en Custom Templates.
- **M12 — Monitorización, auditoría y reporting:** audit log de todas las acciones del ciclo de vida.
