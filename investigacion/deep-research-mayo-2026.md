# Investigación base — Microsoft Agent 365 (mayo 2026)

> Investigación deep-research realizada en mayo de 2026 que constituye la base fáctica del curso. Toda la información referenciada en los módulos debe poder rastrearse a este documento o a fuentes oficiales adicionales.

**Fecha:** mayo de 2026
**Audiencia interna:** equipo de producción del curso
**Producto base:** Microsoft Agent 365 (GA desde el 1 de mayo de 2026)

---

## TL;DR

Microsoft Agent 365 es el "control plane" oficial de Microsoft para observar, gobernar y asegurar agentes de IA en organizaciones, generalmente disponible desde el 1 de mayo de 2026 a 15 USD por usuario/mes (standalone) o incluido en el nuevo SKU Microsoft 365 E7 ("The Frontier Suite") a 99 USD por usuario/mes. Funciona como una capa de gobernanza unificada que integra Microsoft 365 admin center (registry), Microsoft Entra Agent ID (identidad), Microsoft Purview (DLP/cumplimiento) y Microsoft Defender (protección frente a amenazas) sobre cualquier agente — Microsoft, partners o construidos en plataformas como AWS Bedrock y Google Gemini Enterprise.

---

## Hallazgos clave

### 1. Naturaleza y posicionamiento del producto

**Microsoft Agent 365 es un control plane, NO un agent builder.** No reemplaza a Copilot Studio, Microsoft Foundry ni al Microsoft 365 Agents SDK; es la capa de gobernanza, observabilidad y seguridad que se aplica encima. Las cuatro responsabilidades core que alinea son:

1. **Microsoft 365 admins** → vista comprensiva de todos los agentes, onboarding con flujos controlados por IT, plantillas de políticas de seguridad, analítica de agentes
2. **Microsoft Entra admins** → identidades de agente, accesos a apps/recursos/internet/otros agentes
3. **Microsoft Purview admins** → gestión, protección y gobernanza de los datos que los agentes usan/crean
4. **Microsoft Defender admins** → posture management y protección avanzada frente a amenazas

### 2. Hitos cronológicos y estado de disponibilidad

| Fecha | Hito |
|---|---|
| Noviembre 2025 (Ignite) | Anuncio de Microsoft Agent 365, inicialmente accesible solo vía el Frontier preview program |
| 9 marzo 2026 | Anuncio formal de Microsoft 365 E7 (Frontier Suite) y confirmación de precio Agent 365 a 15 USD/usuario/mes |
| 1 mayo 2026 | GA Agent 365 (segmento comercial, per usuario), GA M365 E7, retiro de Agent registry/Agent collections en Microsoft Entra admin center, integración consolidada en Microsoft 365 admin center |
| Mayo 2026 (preview pública) | Registry sync con AWS Bedrock y Google Gemini Enterprise; Shadow AI page (OpenClaw); Windows 365 for Agents (solo EE. UU. inicialmente); agentic users / AI teammates |
| Junio 2026 (anunciado) | Bloqueo en runtime de coding agents y context mapping vía Defender + Intune |

### 3. Componentes arquitectónicos esenciales

**Agent Registry** (sistema de registro central): inventario de cada agente con metadata enriquecido — nombre, descripción, publisher, plataforma, propiedad, estado de disponibilidad y despliegue, permisos de Microsoft Graph, fuentes de datos y herramientas, detalles de seguridad y compliance, certificaciones y actividad.

**Agent Map** (visualización): mapa interactivo agrupado por plataforma; permite filtrado por publisher, métricas (agentes bloqueados), zoom, fit-to-view, full screen y configuración del máximo de agentes por plataforma. Disponible para administradores con E7 (Agent 365) y rol Global Administrator o AI Administrator.

**Agent Overview / Hero metrics**: Agent registry total, Active users (últimos 30 días), Agent run-time (horas), Registry sync (plataformas externas escaneadas).

**Tipos de agentes gestionables en M365 admin center**:
- MCS DA (Copilot Studio Declarative Agent)
- MCS CEA (Copilot Studio Custom Engine Agent)
- MCS BP (Business Process)
- Foundry LOB / non-LOB / hosted
- Agent Builder (declarative en Copilot)
- SharePoint agents (declarative basados en .agent files)
- Agent Toolkit (Microsoft 365 Agents Toolkit)
- Agent instance (extendido con Agent 365 SDK; tiene Entra Agent ID, notificaciones, observabilidad ampliada, MCP tooling cubierto, IT-approved blueprint system)

**Categorías por publisher**: Your organization (incluye "your users"), Third Party, Microsoft.

### 4. Microsoft Entra Agent ID (identidad)

Microsoft Entra Agent ID introduce **cuatro tipos de objetos nuevos** en la directorio:

1. **Agent identity blueprint** — definición padre/template (capacidades, permisos requeridos de Work IQ tools, restricciones de seguridad y compliance, audit, lifecycle metadata, plantillas de políticas vinculadas como DLP, restricciones externas, logging)
2. **Agent identity blueprint principal** — service principal del blueprint
3. **Agent identity** — identidad individual hija creada del blueprint
4. **Agent user** — cuenta de usuario Entra emparejada 1:1 con la agent identity (relación parent-child)

**Dos flujos de autenticación**:
- **On-Behalf-Of (OBO)**: agente actúa con permisos delegados del usuario (cubierto por la licencia Agent 365 GA del usuario)
- **Acting with own identity**: agentes autónomos con propio mailbox, OneDrive, presencia en Teams, organización chart y nombre principal único `agent@yourtenant.onmicrosoft.com` — siguen en Frontier preview en mayo 2026

**Capacidades de governance de Agent ID**:
- Agent sponsorship (transferencia automática al manager si el sponsor se va)
- Lifecycle workflows (mover/leaver tasks: emails al manager, a cosponsors)
- Access packages para asignar permisos (Security Group memberships, OAuth API permissions, Microsoft Entra roles)
- Inheritable permissions a nivel blueprint (máximo 10 resource apps, 40 scopes por app en patrón "enumerated"; o "all allowed scopes")
- Custom security attributes para segmentación
- Multi-select disable; APIs Graph (`riskyAgents`, `agentRiskDetections`)

**Conditional Access para agentes**:
- Scope: All agent identities / All agent users
- Target: All resources
- Condiciones: Agent risk (high/medium/low)
- Grant: Block
- Soporta Report-only mode
- Crítico: la enforcement aplica cuando el agente solicita un token, NO cuando el blueprint adquiere token para crear agent identities

**Identity Protection para agentes (P2)**:
- 6 tipos de detecciones offline (acceso a recursos no familiares, sign-in spikes, intentos fallidos)
- Risky Agents report (90 días)
- Acciones: Confirm compromise (eleva a High → dispara CA policy de bloqueo), Confirm safe, Dismiss risk, Disable

### 5. Roles administrativos clave (modelo least-privilege)

| Rol | Para qué sirve |
|---|---|
| AI Administrator | Aprobar requests de agentes, asignar ownership, gestionar agentes en M365 admin center |
| AI Reader (GA mayo 2026) | Acceso solo lectura a uso, salud y configuración de Agent 365 (recomendado como least-privilege para visibility) |
| Global Administrator | Acciones críticas de gobernanza; consents OAuth2 grants; emergencias |
| Global Reader | View-only, no edit |
| Agent ID Administrator | Ver/gestionar agentes con Microsoft Entra Agent ID en Entra admin center |
| Cloud Application Administrator | Gestionar agent identities (alternativa) |
| Agent ID Developer | Crear agent blueprints (se añade como owner del blueprint y su SP) |
| Conditional Access Administrator | Configurar políticas CA para agentes (P1) |
| Security Administrator/Operator/Reader | Ver risk reports en ID Protection (P2) |
| Lifecycle Workflows Administrator | Configurar workflows |
| Billing Administrator | Verificar licenciamiento Frontier |
| Insider Risk Management role (Purview) | Ver IRM alerts desde Review link |

### 6. Microsoft Purview para Agent 365

| Capacidad | Soporte |
|---|---|
| DSPM y DSPM for AI (classic) | Sí — usa AI observability page para ver agent instances activos y riesgos |
| Auditing | Sí — agent-to-human, human-to-agent, agent-to-tools, agent-to-agent en unified audit log |
| Data classification | Sí — SITs y trainable classifiers detectan datos sensibles en prompts/responses |
| Sensitivity labels | Sí — agent instances necesitan VIEW + EXTRACT usage rights; contenido nuevo NO hereda labels |
| Encryption sin sensitivity labels | ✕ |
| DLP | Sí — bloquear/auditar agent-to-human, human-to-agent en Teams, OneDrive/SharePoint, emails (especificar agent instance como user) |
| Insider Risk Management | Sí — Risky AI usage policy template (prompt injection, protected materials) |
| Communication Compliance | Sí — Teams y emails |
| eDiscovery | Sí — `Type:Contains:Copilot activity` query |
| Data Lifecycle Management | Sí — retention policies para Teams, OneDrive/SharePoint, emails |
| Compliance Manager | Sí — templates regulatorios (EU AI Act, NIST AI RMF, ISO 42001, ISO 23894, DORA) |

### 7. Microsoft Defender para Agent 365

**Capacidades**:
- Centralized monitoring de actividad de agentes en Defender
- Out-of-the-box threat detections (alertas en risky agent activities)
- Proactive threat hunting con Advanced Hunting (KQL) en tabla CloudAppEvents
- Query de ejemplo:
```kql
CloudAppEvents
| where ActionType in ("InvokeAgent", "InferenceCall", "ExecuteToolBySDK", "ExecuteToolByGateway", "ExecuteToolByMCPServer")
```
- Real-time protection durante runtime (preview): inspecciona tool invocations antes de ejecutar; bloquea XPIA (Indirect Prompt Injection) y UPIA (Direct); fail-open si no responde en 1 segundo
- Integración con Defender for Cloud Apps: AI agent inventory (Copilot Studio), Microsoft 365 connector
- Agent security posture management; visualización de attack paths
- Detección de Shadow AI / agentes locales (OpenClaw, GitHub Copilot CLI, Claude Code) — vía Intune con políticas de bloqueo

### 8. Licenciamiento (estado mayo 2026)

| Producto | Precio (USD) | Notas |
|---|---|---|
| Microsoft Agent 365 standalone | $15/usuario/mes | GA 1 mayo 2026 |
| Microsoft 365 E7 (Frontier Suite) | $99/usuario/mes | E5 + Copilot + Entra Suite + Agent 365; GA 1 mayo 2026; con/sin Teams |
| Microsoft 365 E5 standalone | base | requiere para muchas capabilities avanzadas |
| Microsoft Entra ID P1 | base | requerido para Conditional Access para agentes |
| Microsoft Entra ID P2 | base | requerido para ID Protection para agentes y ID Governance |
| Microsoft Entra Suite | $12/usuario/mes | incluye P2 + Internet Access + Private Access + Verified ID Premium + ID Governance + ID Protection |

**Reglas clave de licenciamiento**:
- Agentes que actúan en On-Behalf-Of de un usuario licenciado están cubiertos por la licencia del usuario; no requieren su propia licencia
- Agentes autónomos con sus propias credenciales: en Frontier preview, asignados per-instance; modelo GA aún sin documentar al cierre de la investigación
- Para usar Work IQ MCP servers se requiere licencia Microsoft 365 Copilot
- Frontier preview: tenant recibe 25 licencias Microsoft Agent 365 Frontier automáticamente "for assignment to agent instances only"
- Risks column en All agents page solo aparece con licencia M365 E7

### 9. Acceso y configuración inicial

Activación Frontier (durante preview):
1. Microsoft 365 admin center → **Copilot** → **Settings**
2. Bajo **User access**, seleccionar **Copilot Frontier**
3. Elegir specific users / groups / all
4. Aceptar Terms of Service
5. Navegar a **Agents** → **Overview**

### 10. Acciones de gobernanza disponibles en M365 admin center

- **Publish** — disponible para instalación a usuarios/grupos (soportado en GCCH y GCCM)
- **Activate** — permite a usuarios crear instances
- **Deploy** — instala automáticamente para usuarios
- **Pin** (hasta 3 slots por usuario; Microsoft-pinned, Administrator-pinned, User-pinned)
- **Block / Unblock**
- **Remove** — quita del tenant inventory (re-añadible)
- **Delete** — irreversible; elimina agent + files + SharePoint Embedded container; propagación hasta 24h
- **Approve Updates**
- **Manage Ownerless Agents**
- **Reassign Ownership** (solo para agentes Agent Builder)
- **Export Inventory** a Excel
- **Assign Owner**

**Plantillas de políticas (Templates)**:
- **Default Template** (Microsoft out-of-the-box): incluye controles esenciales de Entra (Identity Protection, Network visibility, Lifecycle), SharePoint (Restrict external sharing, Access Control, Agent access insights, Content Permissions Insights) y Purview (Audit, Know Your Data Policy, AI compliance assessment). Asigna automáticamente la licencia Agent 365.
- **Custom Template**: añade políticas extra como Restrict External Content sharing, Entra Access Package

### 11. APIs y herramientas administrativas

**Microsoft Graph API endpoints (preview)**:
- `GET packages API` — listar agentes en tenant (`copilotpackages-list`)
- `GET package details API` — detalles ricos de un agente (`copilotpackagedetail-get`)
- `/beta/agentRegistry/agentInstances/{id}` (deprecated, retiro mayo 2026)
- Nuevo `/beta/copilot/admin/...` (Agent 365 API en early access; reemplaza al anterior)
- ID Protection: `riskyAgents`, `agentRiskDetections`
- Agent sign-in logs: `signInEventTypes/any(t: t eq 'servicePrincipal') and agent/agentType eq 'AgentIdentity'`

**Agent 365 CLI** (`a365`, requiere .NET 8.0+, paquete NuGet `Microsoft.Agents.A365.DevTools.Cli`):
- `a365 setup all` / `a365 setup admin` / `a365 setup blueprint` / `a365 setup permissions bot`
- `a365 publish` (genera manifest.zip; sube a M365 admin center → Agents → All agents → Upload custom agent)
- `a365 create-instance` (subcommands: `identity`, `licenses`)
- `a365 cleanup` (destructivo; elimina blueprints, identidades y recursos Azure)
- `a365 develop` / `a365 develop-mcp`
- `a365 config display -g`

**PowerShell**:
- `Get-SPOTenant | Select-Object IsCopilotEnabled, IsAgentsFeatureEnabled`
- `Get-AdaptiveScopeMembers` (para listas grandes de scopes)
- `az group delete` (limpieza Azure)
- `az webapp show` / `az webapp log tail` (troubleshooting)

### 12. Microsoft 365 Agents SDK vs Microsoft Agent 365 SDK (¡distintos!)

- **Microsoft 365 Agents SDK** — framework para desarrollo de agentes conversacionales (recibir/enviar mensajes en Teams, Copilot, Slack, Facebook Messenger). Es el "plumbing" del transporte; no decide qué dice el agente.
- **Microsoft Agent 365 SDK** — extiende agentes ya construidos (con cualquier framework) con Entra-backed Agent identity, Work IQ MCP tool access, OpenTelemetry observability, notifications vía Activity protocol, governance vía Agent ID. Complementa y NO reemplaza al M365 Agents SDK.

### 13. Copilot Control System (CCS)

Tres pilares en CCS:

1. **Security & Governance** (foundational A3/E3/G3 + optimized A5/E5/G5): SharePoint Advanced Management para identificar oversharing, Purview Information Protection con sensitivity labels, Endpoint DLP, DSPM for AI, audit con Microsoft Purview Audit, retention y eDiscovery, Adaptive Protection con IRM
2. **Management Controls**: licensing per-user y pay-as-you-go, message capacity en Power Platform admin center, ALM, deployment, configuration de Copilot via M365 admin center (Copilot Search, Copilot Settings)
3. **Measurement & Reporting**: Copilot Analytics, Copilot Dashboard con Microsoft Viva Insights

Diferencia clave: **CCS gobierna a las personas usando AI; Agent 365 gobierna a los agentes mismos**.

---

## Fuentes principales

### Hubs oficiales en learn.microsoft.com

- `/microsoft-agent-365/overview` (es-es y en-us)
- `/microsoft-agent-365/admin/capabilities-entra` `/admin/data-security` `/admin/threat-protection` `/admin/monitor-agents` `/admin/agent-registry` `/admin/graph-api`
- `/microsoft-agent-365/developer/` (con sub-páginas: `get-started`, `agent-365-sdk`, `agent-365-cli`, `identity`, `registration`, `publish`, `create-instance`, `a365-dev-lifecycle`, `custom-client-app-registration`, `reference/cli/`, `reference/cli/create-instance`)
- `/microsoft-agent-365/tooling-servers-overview` (Work IQ MCP)
- `/microsoft-agent-365/connect-existing-agents`
- `/microsoft-agent-365/onboard` `/use`
- `/microsoft-365/admin/manage/agent-365-overview` `/manage/agent-registry` `/manage/agent-map` `/manage/manage-copilot-agents-integrated-apps` `/manage/agent-roles-perms` `/manage/agent-settings` `/manage/manage-agent-instances` `/manage/manage-tools-for-agent` `/manage/manage-connected-agents-for-researcher`
- `/entra/agent-id/` (sub-páginas: `identity-platform/what-is-agent-id`, `identity-platform/what-is-agent-registry`, `identity-platform/agent-registry-collections`, `identity-platform/publish-agents-to-registry`, `identity-platform/microsoft-entra-agent-identities-for-ai-agents`, `manage-agent-identities-admin`, `manage-agent-identities-end-user`, `manage-agent-blueprint`, `agent-lists`, `disable-agent-identities`, `agent-registry-convergence`, `best-practices-agent-id`, `sign-in-audit-logs-agents`, `configure-inheritable-permissions-blueprints`, `what-are-agent-identities`)
- `/entra/identity/conditional-access/agent-id`
- `/entra/id-protection/concept-risky-agents`
- `/entra/id-governance/agent-id-governance-overview` `/agent-sponsor-tasks`
- `/entra/global-secure-access/concept-secure-web-ai-gateway-agents`
- `/purview/ai-agent-365` `/ai-microsoft-purview` `/ai-agents` `/dspm-for-ai` `/data-security-posture-management-learn-about` `/audit-copilot` `/audit-log-activities` `/insider-risk-management-policy-templates` `/communication-compliance-copilot` `/edisc-search-copilot-data` `/retention-policies-copilot` `/compliance-manager-assessments` `/whats-new`
- `/security/security-for-ai/agent-365-security`
- `/defender-cloud-apps/ai-agent-inventory` `/ai-agent-protection` `/real-time-agent-protection-during-runtime` `/release-notes`
- `/defender-xdr/security-for-ai/ai-agent-detection-protection` `/advanced-hunting-overview` `/investigate-incidents`
- `/copilot/microsoft-365/copilot-control-system/overview` `/security-governance` `/management-controls` `/measurement-reporting`
- `/copilot/microsoft-365/agent-essentials/m365-agents-admin-guide` `/m365-agents-checklist` `/m365-agents-visual-map`
- `/microsoft-copilot-studio/security-and-governance`
- `/sharepoint/manage-access-agents-in-sharepoint`
- `/azure/cloud-adoption-framework/ai-agents/governance-security-across-organization`

### Páginas comerciales en microsoft.com

- microsoft.com/en-us/microsoft-agent-365 (página de producto, plans & pricing)
- microsoft.com/en-us/security/business/identity-access/microsoft-entra-agent-id

### Blogs oficiales clave

- Microsoft Security Blog 1 mayo 2026: "Microsoft Agent 365, now generally available, expands capabilities and integrations"
- Microsoft 365 Blog 18 noviembre 2025: "Microsoft Ignite 2025: Copilot and agents built to power the Frontier Firm"
- Official Microsoft Blog 9 marzo 2026: "Introducing the First Frontier Suite built on Intelligence + Trust"
- Tech Community: "What's New in Agent 365: May 2026"
- Tech Community: "Microsoft 365 E7 and Agent 365 are now generally available"
- Tech Community: "Microsoft Purview securing data and enabling apps and agents across your AI stack"
- Tech Community: "Microsoft Entra Agent ID explained"
- Microsoft Security Blog 23 enero 2026: "From runtime risk to real-time defense: Securing AI agents"
- Adoption hub: adoption.microsoft.com/copilot/control-system/ y /ai-agents/

### Recursos centrales de adopción

- Whitepaper "Administering and Governing Agents" (adoption.microsoft.com/files/copilot-studio/Agent-governance-whitepaper.pdf)
- Frontier getting started PDF (adoption.microsoft.com/files/copilot/Frontier_Getting-started-guide.pdf)

### GitHub

- microsoft/Agent365-devTools (fuente del CLI)
- MicrosoftDocs/microsoft-365-docs y MicrosoftDocs/entra-docs (raw markdown de la documentación)

---

## Caveats críticos

1. **Producto en evolución muy rápida**: Agent 365 alcanzó GA el 1 de mayo de 2026, pero múltiples capacidades clave permanecen en preview pública: agentic users autónomos, Windows 365 for Agents (solo EE. UU.), registry sync con AWS/Google, Shadow AI page con OpenClaw, real-time protection durante runtime, Defender AI agent inventory, ID Protection para agentes (P2 preview), agent identity blueprints (preview). El curso debe etiquetar explícitamente cada capacidad con su estado (GA / preview pública / Frontier preview).

2. **Frontier preview vs GA — modelos de licencia distintos**: en Frontier las licencias se asignan per-instance (25 incluidas); en GA se asigna per-user a los humanos que interactúan/sponsorean agentes, y los agentes OBO heredan automáticamente. Los autonomous agents (con propia identidad y mailbox) siguen en Frontier preview y su modelo de licencia GA aún sin documentar.

3. **Convergencia Entra ↔ M365 admin center**: el 1 de mayo de 2026 se retiraron los blades "Agent registry" y "Agent collections" en Microsoft Entra admin center; ahora todo el inventario está en M365 admin center bajo Agents. Las APIs `/beta/agentRegistry/...` se reemplazan por `/beta/copilot/admin/...`.

4. **Distinguir SDKs**: Microsoft 365 Agents SDK (transporte conversacional) ≠ Microsoft Agent 365 SDK (governance layer). Confusión común.

5. **Documentación en español aún limitada**: la mayoría del contenido oficial está originalmente en inglés. La página principal `/es-es/microsoft-agent-365/overview` existe pero la profundidad puede no igualar la versión en inglés.

6. **Capacidades específicas que requieren licencias adicionales**: 
   - Risks column → solo M365 E7
   - Conditional Access para agentes → Entra ID P1 o M365 E3
   - Identity Protection para agentes → Entra ID P2, M365 E5 o Entra Suite
   - ID Governance para agentes → Entra ID P2, M365 E5 o Entra Suite
   - Network controls para agentes → Entra Internet Access (incluido en Suite o licenciable separado)
   - Work IQ MCP → Microsoft 365 Copilot

7. **Limitaciones técnicas conocidas**:
   - Information Barriers NO soportadas en SharePoint embedded files
   - Sensitivity labels NO se aplican directamente sobre `.agent` files (solo vía extension)
   - Contenido creado por agentes NO hereda sensitivity labels de las fuentes
   - Real-time protection en Copilot Studio: fail-open si Defender no responde en 1 segundo
   - Risks column tiene delay de hasta 1 hora vs portales de seguridad
   - Default ready-made SharePoint agents no son editables
   - Solo agentes Agent Builder soportan reasignar ownership
   - Eliminación irreversible de agentes; propagación hasta 24 horas
   - Pinning hasta 6 horas para propagar a usuarios finales
   - Pinning solo agentes deployed (no blocked, no draft)
   - Análiticas Foundry solo soportan V2

8. **Costes ocultos y consumo**: Agent 365 cubre per-seat governance; Copilot Studio cobra Copilot Credits ($200/pack 25,000 credits/mes); Foundry cobra per-token. Tres líneas de billing distintas para el mismo agente.
