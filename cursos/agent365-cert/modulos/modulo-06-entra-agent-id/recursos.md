---
modulo: 6
tipo: recursos
titulo: "Recursos del Módulo 06"
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-06
---

# Módulo 06 — Recursos

> Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.

---

## Documentación oficial — Microsoft Entra Agent ID

- [Microsoft Entra Agent ID overview](https://learn.microsoft.com/entra/agent-id/overview) — visión consolidada del producto: tipos de objetos, flujos de autenticación, gobernanza.
- [Agent identity blueprints](https://learn.microsoft.com/entra/agent-id/blueprints) — anatomía completa del blueprint y restricciones.
- [Agent identity blueprint principal](https://learn.microsoft.com/entra/agent-id/blueprint-principals) — qué es el principal y cómo se relaciona con admin consents.
- [Agent identities](https://learn.microsoft.com/entra/agent-id/agent-identities) — la instancia concreta y su ciclo de vida.
- [Agent users](https://learn.microsoft.com/entra/agent-id/agent-users) — la propiedad opcional `userType: AgentUser` para agentes humano-like.

## Documentación oficial — Flujos de autenticación

- [On-Behalf-Of (OBO) flow for agents](https://learn.microsoft.com/entra/agent-id/obo-flow) — flujo delegado, intercambio de tokens, audit log.
- [Own identity flow (autonomous agents)](https://learn.microsoft.com/entra/agent-id/own-identity-flow) — flujo `client_credentials`, atribución al agente.
- [Choosing OBO vs own identity](https://learn.microsoft.com/entra/agent-id/choosing-flow) — guía de decisión por tipo de caso de uso.

## Documentación oficial — Sponsorship y lifecycle

- [Agent sponsorship overview](https://learn.microsoft.com/entra/agent-id/sponsorship) — qué es el sponsor, cómo se asigna, comportamiento ante leaver.
- [Lifecycle workflows for agent identities](https://learn.microsoft.com/entra/id-governance/lifecycle-workflow-templates) — triggers `onLeaver`, `onMover`, `onJoiner` y tareas disponibles.
- [Transfer sponsorship to manager — how it works](https://learn.microsoft.com/entra/agent-id/transfer-sponsorship) — flujo automático de transferencia y `requireReview`.

## Documentación oficial — Permisos y atributos

- [Inheritable permissions in agent identity blueprints](https://learn.microsoft.com/entra/agent-id/inheritable-permissions) — el límite duro de 10 resource apps × 40 scopes y por qué.
- [Custom security attributes](https://learn.microsoft.com/entra/fundamentals/custom-security-attributes-overview) — definición a nivel directorio y aplicación a agent identities.
- [Access packages for agent identities](https://learn.microsoft.com/entra/id-governance/entitlement-management-access-package-create) — asignar permisos vía access packages.
- [Multi-select disable for agent identities](https://learn.microsoft.com/entra/agent-id/bulk-disable) — operación masiva y diagnóstico de impacto.

## Documentación oficial — APIs Microsoft Graph

- [Microsoft Graph beta — agent identities](https://learn.microsoft.com/graph/api/resources/agentidentity) — esquema completo del objeto y operaciones.
- [Risky agents API](https://learn.microsoft.com/graph/api/resources/riskyagent) — `/beta/identityProtection/riskyAgents` para listar agentes con riesgo.
- [Agent risk detections API](https://learn.microsoft.com/graph/api/resources/agentriskdetection) — detecciones específicas de Identity Protection para agentes.
- [signInEventTypes for agent sign-ins](https://learn.microsoft.com/graph/api/resources/signin#signineventtypes) — filtro para identificar sign-ins de agent identities en audit logs.

## Documentación oficial — Convergencia mayo 2026

- [Microsoft 365 admin center is now the home for Agent 365 management](https://techcommunity.microsoft.com/blog/microsoft-365-admin-agent-365) — anuncio oficial de la convergencia.
- [Migrating from `/beta/agentRegistry/*` to `/beta/copilot/admin/*`](https://learn.microsoft.com/microsoft-agent-365/api-migration-may-2026) — guía de migración con tabla de endpoints antiguos y nuevos.
- [Agent registry in Entra admin center — deprecation notice](https://learn.microsoft.com/entra/agent-id/registry-deprecation) — fechas exactas, ventana de retrocompatibilidad de 90 días.

## CLI Microsoft Agent 365

- [Microsoft Agent 365 CLI on npm](https://www.npmjs.com/package/@microsoft/agent365-cli) — paquete oficial publicado por Microsoft.
- [a365 CLI reference](https://learn.microsoft.com/microsoft-agent-365/cli/reference) — referencia completa de comandos: `setup`, `create`, `update`, `list`, `lifecycle-workflow`.
- [a365 CLI tutorial — first blueprint](https://learn.microsoft.com/microsoft-agent-365/cli/first-blueprint) — tutorial guiado oficial.

## Para los siguientes módulos

- **M07 — Agent Registry y Agent Map:** operación diaria del Registry tras el modelo de identidades.
- **M08 — Despliegue, distribución y ciclo de vida:** uso de access packages para distribución corporativa.
- **M09 — Permisos, accesos y Conditional Access:** Conditional Access aplicado a agent identities.
- **M12 — Monitorización, auditoría y reporting:** explotación de los APIs Graph (`riskyAgents`, `agentRiskDetections`) en consultas KQL.
