---
modulo: 9
tipo: recursos
titulo: "Recursos del Módulo 09"
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-07
---

# Módulo 09 — Recursos

> Documentación oficial y referencias usadas para producir este módulo. Cada enlace está vivo y verificado a la fecha de última actualización.

---

## Documentación oficial — Permisos y admin consent

- [Application vs Delegated permissions](https://learn.microsoft.com/entra/identity-platform/permissions-consent-overview) — distinción canónica del modelo OAuth aplicado a Microsoft Identity.
- [Microsoft Graph permissions reference](https://learn.microsoft.com/graph/permissions-reference) — catálogo completo de scopes con su tipo y requisito de admin consent.
- [Admin consent for applications and agents](https://learn.microsoft.com/entra/identity/enterprise-apps/grant-admin-consent) — cómo otorgarlo desde Entra y vía URL de admin consent.
- [Workload identity permissions for Agent 365](https://learn.microsoft.com/microsoft-agent-365/admin/workload-identity-permissions) — particularidades del consent para agent identities.
- [Common Microsoft Graph scopes for agents](https://learn.microsoft.com/microsoft-agent-365/admin/common-graph-scopes) — `User.Read`, `User.ReadBasic.All`, `TeamsActivity.Send`, `Sites.Selected` y patrones de uso.

## Documentación oficial — Conditional Access para agentes

- [Conditional Access for workload identities](https://learn.microsoft.com/entra/identity/conditional-access/workload-identity) — base genérica, aplicable a agentes.
- [Conditional Access for agent identities](https://learn.microsoft.com/microsoft-agent-365/admin/conditional-access-agents) — los componentes específicos de agente: `All agent identities`, `Agent risk`.
- [Filter agent identities by custom security attribute](https://learn.microsoft.com/microsoft-agent-365/admin/ca-filter-csa) — combinar CA con custom security attributes (M06 § 6.6).
- [Agent risk in Conditional Access conditions](https://learn.microsoft.com/microsoft-agent-365/admin/agent-risk-condition) — niveles `Low / Medium / High` y heurísticas que los disparan.
- [Building Conditional Access policies: best practices](https://learn.microsoft.com/entra/identity/conditional-access/best-practices) — guía general de diseño.

## Documentación oficial — Report-only mode

- [Report-only mode for Conditional Access](https://learn.microsoft.com/entra/identity/conditional-access/howto-conditional-access-insights-reporting) — cómo crear una policy en Report-only y leer los logs.
- [Sign-in logs: Conditional Access tab](https://learn.microsoft.com/entra/identity/monitoring-health/concept-sign-ins) — interpretación de `Not applied`, `Reported: would have been blocked`, `Failure`.
- [Workload identity sign-in logs](https://learn.microsoft.com/microsoft-agent-365/admin/workload-identity-sign-in-logs) — la pestaña separada para agentes.

## Documentación oficial — Identity Protection para agentes

- [Identity Protection for agent identities](https://learn.microsoft.com/microsoft-agent-365/admin/identity-protection-agents) — las 6 detecciones específicas, requisitos de licencia (P2) y estado del producto (Frontier preview).
- [Risky agents report](https://learn.microsoft.com/microsoft-agent-365/admin/risky-agents-report) — vista, filtros, conservación de 90 días.
- [Confirm compromise, Confirm safe, Dismiss, Disable](https://learn.microsoft.com/microsoft-agent-365/admin/risky-agents-actions) — las 4 acciones y sus efectos cascada en Conditional Access.
- [Identity Protection detection types](https://learn.microsoft.com/entra/id-protection/concept-identity-protection-risks) — base genérica de detecciones, con sección específica para workload identities.

## PowerShell y automatización

- [Microsoft Graph PowerShell — Conditional Access](https://learn.microsoft.com/powershell/microsoftgraph/tutorial-cond-access-policies) — creación y modificación de policies via cmdlets.
- [Get-MgRiskyServicePrincipal](https://learn.microsoft.com/powershell/module/microsoft.graph.identity.signins/get-mgriskyserviceprincipal) — consulta del estado de risk de agent identities.
- [Confirm-MgRiskyServicePrincipalCompromised](https://learn.microsoft.com/powershell/module/microsoft.graph.identity.signins/confirm-mgriskyserviceprincipalcompromised) — Confirm compromise programático para automatizar respuesta a incidente.
- [Microsoft Agent 365 PowerShell module](https://learn.microsoft.com/powershell/module/microsoft.agent365) — cmdlets generales del producto.

## Para los siguientes módulos

- **M10 — Microsoft Purview y protección de datos:** sensitivity labels que cruzan con la detección `Anomalous data access` de Identity Protection (§ 9.5).
- **M12 — Monitorización, auditoría y reporting:** audit log unificado donde se trazan los eventos de las 4 acciones del Risky Agents report (§ 9.6) y los sign-ins evaluados por CA.
- **M14 — Gobernanza avanzada y políticas:** integración del modelo CA + Identity Protection en el blueprint de gobierno corporativo y revisiones trimestrales del catálogo de policies.
