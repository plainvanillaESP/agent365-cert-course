# Módulo 09 — Recursos

> Referencias externas que complementan el módulo. Microsoft Learn es la fuente autoritativa; los blogs y documentación de partners aportan contexto de adopción real.

---

## Documentación oficial Microsoft Learn

### Permisos de agentes

- [Permissions and consent in Microsoft Entra Agent ID](https://learn.microsoft.com/en-us/entra/identity-platform/permissions-and-consent-overview) — modelo general de permissions y consent en la plataforma de identidad.
- [Inheritable permissions in agent blueprints](https://learn.microsoft.com/en-us/entra/agent-id/blueprint-inheritable-permissions) — referencia técnica del campo `inheritablePermissions` y sus límites.
- [Delegated vs application permissions](https://learn.microsoft.com/en-us/graph/auth/auth-concepts#permissions) — distinción canónica para Microsoft Graph que aplica también a agentes.

### Conditional Access para workload identities

- [Conditional Access for workload identities](https://learn.microsoft.com/en-us/entra/identity/conditional-access/workload-identity) — guía oficial de CA aplicado a service principals y agent identities.
- [Microsoft Entra Workload Identities Premium licensing](https://learn.microsoft.com/en-us/entra/identity/conditional-access/workload-identity-licensing) — qué licencia se necesita y qué cubre.
- [CA grant types reference](https://learn.microsoft.com/en-us/entra/identity/conditional-access/concept-conditional-access-grant) — tabla de grants disponibles y a qué tipos de identity aplican.

### Identity Protection para agentes

- [Microsoft Entra Identity Protection overview](https://learn.microsoft.com/en-us/entra/id-protection/overview-identity-protection) — el motor de detección general (aplicado a usuarios y a agentes).
- [Risk detections for agents](https://learn.microsoft.com/en-us/entra/id-protection/concept-identity-protection-risks-for-agents) — referencia oficial de las seis detecciones específicas para agentes.
- [Risky Agents report](https://learn.microsoft.com/en-us/entra/id-protection/howto-identity-protection-risky-agents) — cómo navegar el dashboard de Risky Agents.
- [Microsoft Graph riskyAgents endpoint](https://learn.microsoft.com/en-us/graph/api/resources/riskyagent) — referencia API.

### Sign-in logs y auditoría

- [Microsoft Entra sign-in logs schema](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins) — esquema general de los logs.
- [Workload identity sign-in events](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/howto-analyze-sign-ins-workload-identities) — interpretación de sign-in events de agentes y service principals.
- [CloudAppEvents table reference](https://learn.microsoft.com/en-us/microsoft-365/security/defender/advanced-hunting-cloudappevents-table) — schema de la tabla en Defender XDR donde aparecen los AgentInvoke y AgentAutonomousInvoke.

---

## Blogs oficiales

- [Microsoft Tech Community - Microsoft Entra blog](https://techcommunity.microsoft.com/category/microsoft-entra/blog/microsoft-entrablog) — anuncios y deep-dives de Identity y CA.
- [Microsoft Security Community blog](https://techcommunity.microsoft.com/category/microsoftsecurityandcompliance/blog/microsoftsecurityandcomplianceblog) — perspectiva de seguridad sobre detecciones y respuesta a incidentes.
- [Microsoft Agent 365 launch announcement (1 de mayo de 2026)](https://techcommunity.microsoft.com/blog/microsoft-agent-365-ga) — anuncio de GA con detalle de las seis detecciones específicas.

---

## Lecturas adicionales

- **Zero Trust principles applied to agents** — el modelo de Zero Trust de Microsoft aplicado a agentes: «verify explicitly, use least privilege access, assume breach» trasladado al control plane de Agent 365. [Microsoft Zero Trust documentation](https://learn.microsoft.com/en-us/security/zero-trust/zero-trust-overview).
- **OAuth 2.0 on-behalf-of flow specification** — el flow OAuth 2.0 OBO que es la base técnica de las delegated permissions en agentes. [RFC 8693 - OAuth 2.0 Token Exchange](https://datatracker.ietf.org/doc/html/rfc8693).
- **NIST SP 800-207 - Zero Trust Architecture** — la referencia teórica del modelo Zero Trust y cómo se aplica a sujetos non-human. [NIST publication](https://csrc.nist.gov/publications/detail/sp/800-207/final).

---

## Herramientas y CLIs útiles

- **Microsoft Graph PowerShell SDK** — para automatizar revisiones de Risky Agents y dismissals. Cmdlets relevantes: `Get-MgRiskyAgent`, `Invoke-MgConfirmRiskyAgentCompromised`, `Invoke-MgDismissRiskyAgent`.
- **az ad sp** (Azure CLI) — gestión de service principals incluyendo agent identities cuando se opera desde línea de comandos.
- **Microsoft Graph Explorer** — para probar los endpoints `/beta/identityProtection/riskyAgents` y `/beta/conditionalAccess/policies` de forma interactiva.

---

## Para la certificación

- **Repaso del módulo M06** sobre cómo se construye la identidad del agente. Sin entender M06, los conceptos de M09 quedan flotando.
- **Repaso del módulo M04** sobre los roles `AI Administrator`, `Agent ID Administrator` y `Security Operator`: en M09 se asume que el alumno sabe quién opera Identity Protection vs CA.
- Practicar con el laboratorio 9.1 (CA Block para agentes High) y el 9.4 (diseño end-to-end) hasta poder reproducirlos sin guion. Son los más representativos del tipo de pregunta que aparece en el examen.
