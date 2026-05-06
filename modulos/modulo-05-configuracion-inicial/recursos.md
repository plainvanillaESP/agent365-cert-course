---
modulo: 5
tipo: recursos
titulo: "Recursos del Módulo 05"
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
---

# Módulo 05 — Recursos

> Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.

---

## Documentación oficial — Activación de Agent 365

- [Get started with Microsoft Agent 365](https://learn.microsoft.com/microsoft-agent-365/get-started) — guía oficial del primer ciclo de activación.
- [Prerequisites for Microsoft Agent 365](https://learn.microsoft.com/microsoft-agent-365/admin/prerequisites) — checklist de prerrequisitos consolidada por Microsoft.
- [Activate Copilot Frontier](https://learn.microsoft.com/microsoft-365-copilot/copilot-frontier-toggle) — cómo activar el toggle Frontier y qué capacidades desbloquea.
- [Accept Terms of Service for Agent 365](https://learn.microsoft.com/microsoft-agent-365/admin/terms-of-service) — proceso de aceptación y auditoría.
- [Configure the Agent workload settings](https://learn.microsoft.com/microsoft-agent-365/admin/configure-settings) — configuraciones avanzadas tras la activación inicial.

## Documentación oficial — Audit logs

- [Microsoft Purview Audit (Standard) overview](https://learn.microsoft.com/purview/audit-log-search) — habilitación, búsqueda y exportación.
- [Search the audit log for events related to Agent 365](https://learn.microsoft.com/purview/audit-search-agent-365) — operaciones específicas de agentes en el audit log.
- [Audit log latency](https://learn.microsoft.com/purview/audit-log-detailed-properties#audit-log-latency) — tiempos esperados de aparición de eventos.

## Documentación oficial — Configuración de Defender XDR

- [Connect Microsoft 365 to Defender for Cloud Apps](https://learn.microsoft.com/defender-cloud-apps/connect-office-365) — conector M365, OAuth y áreas conectables.
- [CloudAppEvents table reference](https://learn.microsoft.com/defender-xdr/advanced-hunting-cloudappevents-table) — esquema completo de la tabla y ActionTypes específicos de agentes.
- [AI Agent Inventory in Microsoft Defender](https://learn.microsoft.com/defender-xdr/ai-agent-inventory) — inventario de agentes detectados.
- [5 new ActionTypes for Agent 365](https://techcommunity.microsoft.com/blog/agent-365-actiontypes) — anuncio de los nuevos ActionTypes con ejemplos KQL.

## Documentación oficial — Configuración de Purview

- [Data Security Posture Management for AI](https://learn.microsoft.com/purview/dspm-for-ai-overview) — qué cubre DSPM for AI y cómo activarlo.
- [AI observability in Microsoft Purview](https://learn.microsoft.com/purview/ai-observability) — métricas y eventos específicos de uso de IA.
- [Configure sensitivity labels for SharePoint and OneDrive](https://learn.microsoft.com/purview/sensitivity-labels-sharepoint-onedrive) — publicación de labels para que los agentes las hereden.

## Documentación oficial — Power Platform

- [Connect Power Platform to Microsoft 365 Agent Registry](https://learn.microsoft.com/power-platform/admin/agent-365-integration) — sincronización del inventario Copilot Studio.

## Troubleshooting

- [Microsoft Agent 365 troubleshooting guide](https://learn.microsoft.com/microsoft-agent-365/troubleshooting) — síntomas, diagnósticos y soluciones para los errores más comunes de activación.
- [Microsoft 365 admin center service health](https://admin.microsoft.com/AdminPortal/Home#/servicehealth) — estado de servicios de Microsoft 365, incluyendo el Agent workload, en tiempo real.

## Para los siguientes módulos

- **M06 — Microsoft Entra Agent ID:** profundización en identidades de agentes que ya empezarás a ver en el Registry tras la activación.
- **M07 — Agent Registry y Agent Map:** operación diaria del Registry tras el setup inicial.
- **M12 — Monitorización, auditoría y reporting:** explotación avanzada de los eventos de Defender y Purview que ya están fluyendo.
