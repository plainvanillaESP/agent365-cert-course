# Módulo 10 — Recursos

> Referencias externas para profundizar en Microsoft Purview integrado con Agent 365. La fuente autoritativa es Microsoft Learn; los blogs y guías de partners aportan contexto operativo.

---

## Documentación oficial Microsoft Learn

### Purview e Information Protection

- [Microsoft Purview overview](https://learn.microsoft.com/en-us/purview/purview) — punto de entrada al suite completo.
- [Sensitivity labels overview](https://learn.microsoft.com/en-us/purview/sensitivity-labels) — concepto, mecánica y aplicación a archivos M365.
- [Apply sensitivity labels to files automatically](https://learn.microsoft.com/en-us/purview/apply-sensitivity-label-automatically) — auto-labeling con SITs y diccionarios.
- [Microsoft Information Protection SDK](https://learn.microsoft.com/en-us/information-protection/develop/overview) — para outputs en aplicaciones de terceros que requieren preservar la label.

### DSPM for AI

- [Data Security Posture Management for AI overview](https://learn.microsoft.com/en-us/purview/dspm-for-ai) — guía oficial del dashboard.
- [Configure DSPM for AI](https://learn.microsoft.com/en-us/purview/dspm-for-ai-configure) — pasos iniciales de configuración por tenant.
- [DSPM for AI in Microsoft Agent 365](https://learn.microsoft.com/en-us/agent-365/dspm-integration) — extensiones específicas para agentes.

### Audit y eDiscovery Premium

- [Microsoft Purview Audit (Premium)](https://learn.microsoft.com/en-us/purview/audit-premium) — retención extendida y campos enriquecidos.
- [Audit log activities for Agent 365](https://learn.microsoft.com/en-us/agent-365/audit-events) — referencia completa de eventos (`AgentInvoke`, `AgentAutonomousInvoke`, `AgentDataAccess`, `AgentOutputGenerated`, `AgentSensitivityLabelInherited`).
- [eDiscovery (Premium) overview](https://learn.microsoft.com/en-us/purview/ediscovery-premium-overview) — búsquedas y holds.
- [Custodian holds in eDiscovery Premium](https://learn.microsoft.com/en-us/purview/ediscovery-premium-custodian-holds) — preservación de evidencia.

### Información sensible y SITs

- [Sensitive Information Types reference](https://learn.microsoft.com/en-us/purview/sensitive-information-type-entity-definitions) — catálogo completo de SITs por país y regulación.
- [Create a custom Sensitive Information Type](https://learn.microsoft.com/en-us/purview/create-a-custom-sensitive-information-type) — para patrones específicos de la organización.

### Endpoint DLP

- [Endpoint DLP overview](https://learn.microsoft.com/en-us/purview/endpoint-dlp-learn-about) — última milla de la protección.
- [Endpoint DLP supported applications](https://learn.microsoft.com/en-us/purview/dlp-policy-reference#endpoint-dlp-restricted-apps-and-app-groups) — apps cubiertas, exclusiones.

---

## Blogs oficiales

- [Microsoft Purview Tech Community](https://techcommunity.microsoft.com/category/microsoftsecurityandcompliance/blog/microsoftpurview) — anuncios y deep-dives mensuales.
- [Microsoft Security Community blog](https://techcommunity.microsoft.com/category/microsoftsecurityandcompliance/blog/microsoftsecurityandcomplianceblog) — perspectiva de seguridad amplia.
- [Microsoft Agent 365 launch — Purview integration](https://techcommunity.microsoft.com/blog/microsoft-agent-365-purview-integration) — anuncio de la integración nativa entre Agent 365 y Purview.

---

## Lecturas adicionales

- **NIST AI Risk Management Framework (AI RMF 1.0)** — marco de riesgos aplicable a IA generativa que respalda la lógica de gobernanza de Purview. [NIST publication](https://www.nist.gov/itl/ai-risk-management-framework).
- **ISO/IEC 42001:2023 — AI management systems** — estándar internacional para sistemas de gestión de IA. [ISO standard](https://www.iso.org/standard/81230.html).
- **GDPR Article 22 — Automated individual decision-making** — base regulatoria europea para decisiones automatizadas; aplicable a outputs de agentes que afectan a personas. [EUR-Lex](https://eur-lex.europa.eu/eli/reg/2016/679/oj).

---

## Herramientas y CLIs útiles

- **Microsoft Graph PowerShell SDK**: cmdlets `Get-Label`, `Set-Label`, `Get-AutoSensitivityLabelPolicy` para gestión programática.
- **Microsoft Purview Compliance PowerShell**: `Connect-IPPSSession` para conectarse al endpoint de cumplimiento; comandos para gestionar policies, ediscovery cases, audit search.
- **PowerShell module Microsoft.Online.SharePoint.PowerShell**: aplicar labels en masa a librerías de SharePoint.
- **Microsoft 365 admin center → Compliance**: portal web equivalente para operaciones puntuales.

---

## Para la certificación

- **Repaso del módulo M09** sobre Conditional Access: M10 asume que el alumno entiende la dimensión de acceso para poder situar la dimensión de protección de dato como capa complementaria.
- **Familiarización con sensitivity labels en M365 sin agentes**: si nunca has aplicado una label a un Word, el concepto base falta. La documentación oficial de Microsoft Learn tiene un walkthrough corto.
- Practicar el laboratorio 10.1 (aplicar label a un blueprint y verificar herencia en un output) hasta poder reproducirlo sin guion. Es el tipo de ejercicio práctico que aparece en el examen.
