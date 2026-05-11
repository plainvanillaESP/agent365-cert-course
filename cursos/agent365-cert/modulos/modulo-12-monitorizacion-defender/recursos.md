# Módulo 12 — Recursos

> Referencias externas para profundizar en Microsoft Defender XDR aplicado a Agent 365, KQL hunting, custom detection rules y la integración con Microsoft Sentinel.

---

## Documentación oficial Microsoft Learn

### Microsoft Defender XDR

- [Microsoft Defender XDR overview](https://learn.microsoft.com/en-us/defender-xdr/microsoft-365-defender) — concepto, componentes, capacidades.
- [Microsoft Defender XDR portal](https://learn.microsoft.com/en-us/defender-xdr/microsoft-365-defender-portal) — recorrido del portal y superficies operativas.
- [Microsoft Defender XDR for Agent 365](https://learn.microsoft.com/en-us/agent-365/defender-xdr-integration) — extensiones específicas para agentes, esquema enriquecido de eventos.

### CloudAppEvents y Advanced hunting

- [CloudAppEvents table reference](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-cloudappevents-table) — esquema completo y ejemplos.
- [Advanced hunting overview](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-overview) — concepto, capacidades, mejores prácticas.
- [Advanced hunting limits](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-limits) — cuotas de queries, timeouts, optimización.
- [Hunting queries for Agent 365](https://learn.microsoft.com/en-us/agent-365/hunting-queries) — biblioteca oficial de queries para casos comunes.

### KQL (Kusto Query Language)

- [KQL quick reference](https://learn.microsoft.com/en-us/kusto/query/kql-quick-reference) — referencia básica de operadores.
- [KQL tutorial for SOC analysts](https://learn.microsoft.com/en-us/kusto/query/tutorials/) — tutoriales paso a paso.
- [Best practices for KQL queries](https://learn.microsoft.com/en-us/kusto/query/best-practices) — performance, legibilidad, mantenimiento.

### Custom detection rules

- [Custom detection rules overview](https://learn.microsoft.com/en-us/defender-xdr/custom-detection-rules) — concepto, anatomía, gestión.
- [Create and manage custom detection rules](https://learn.microsoft.com/en-us/defender-xdr/custom-detections-overview) — flujo completo.
- [Schema reference for custom detections](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-schema-tables) — campos requeridos para entity extraction.

### Microsoft Sentinel

- [Microsoft Sentinel documentation](https://learn.microsoft.com/en-us/azure/sentinel/) — punto de entrada al producto.
- [Connect Microsoft Defender XDR to Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/connect-microsoft-365-defender) — conector nativo, configuración.
- [Sentinel playbooks overview](https://learn.microsoft.com/en-us/azure/sentinel/automate-responses-with-playbooks) — Logic Apps de respuesta automatizada.
- [Long-Term Retention in Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/log-retention-policy) — archivo a 12 años, queries diferidas.
- [Cross-tenant monitoring](https://learn.microsoft.com/en-us/azure/sentinel/multiple-tenants-service-providers) — workspace centralizado para MSP/MSSP.

### Defender for Identity (compromiso de agentes)

- [Microsoft Defender for Identity overview](https://learn.microsoft.com/en-us/defender-for-identity/what-is) — concepto y capacidades.
- [Defender for Identity alerts for Entra Agent ID](https://learn.microsoft.com/en-us/defender-for-identity/alerts/agent-id-alerts) — alertas específicas para identidades de agente.

---

## Blogs oficiales

- [Microsoft Security Community blog](https://techcommunity.microsoft.com/category/microsoftsecurityandcompliance/blog/microsoftsecurityandcomplianceblog) — anuncios y deep-dives mensuales.
- [Microsoft Defender XDR Tech Community](https://techcommunity.microsoft.com/category/microsoftsecurityandcompliance/blog/microsoftdefenderxdr) — blog específico del producto.
- [Microsoft Sentinel Tech Community](https://techcommunity.microsoft.com/category/microsoftsecurityandcompliance/blog/microsoftsentinelblog) — playbooks comunitarios y casos de uso.
- [Microsoft Agent 365 launch — XDR integration](https://techcommunity.microsoft.com/blog/microsoft-agent-365-defender-integration) — anuncio oficial de la integración nativa.

---

## Repositorios públicos de queries

- [Microsoft Defender XDR GitHub — Hunting queries](https://github.com/Azure/Azure-Sentinel/tree/master/Hunting%20Queries/MicrosoftDefenderXDR) — biblioteca abierta mantenida por Microsoft.
- [Microsoft Sentinel Content Hub](https://learn.microsoft.com/en-us/azure/sentinel/sentinel-solutions-catalog) — solutions empaquetadas con queries, playbooks, workbooks.
- [Microsoft Defender XDR Hunting Queries (community)](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries) — repositorio comunitario con queries por escenario.

---

## Lecturas adicionales

- **MITRE ATT&CK framework** — Standard de la industria para categorizar tácticas y técnicas adversarias. Las custom detection rules de Defender XDR mapean directamente contra este framework. [MITRE ATT&CK](https://attack.mitre.org/).
- **NIST SP 800-61 Rev. 2 — Computer Security Incident Handling Guide** — Guía formal de gestión de incidentes que respalda el workflow incidente → contención → erradicación → recuperación → lecciones aprendidas. [NIST publication](https://csrc.nist.gov/publications/detail/sp/800-61/rev-2/final).
- **The Threat Intelligence Lifecycle (CISA)** — Cómo el threat intelligence alimenta la detección y cómo los hallazgos del SOC alimentan threat intelligence. [CISA reference](https://www.cisa.gov/).

---

## Herramientas y CLIs útiles

- **Microsoft 365 Defender PowerShell**: `Get-MdeIncident`, `Get-MdeAlert` para automatización de operaciones.
- **Microsoft Graph PowerShell — Security**: cmdlets `Get-MgSecurityIncident`, `Get-MgSecurityAlert` para integración con automation.
- **Azure CLI Sentinel extension**: `az sentinel` para gestión programática de workspace, playbooks, analytics rules.
- **KQL Magic for Jupyter**: extensión para Jupyter Notebooks que permite ejecutar KQL contra Defender o Sentinel directamente desde notebooks. Útil para threat hunting iterativo.
- **VS Code Kusto extension**: extensión oficial con syntax highlighting, intellisense, ejecución directa contra workspace.

---

## Para la certificación

- **KQL es prerrequisito de facto** para este módulo. Si nunca has escrito una query, dedicar 2-3 horas al tutorial oficial es la mejor inversión antes de continuar.
- **CloudAppEvents** es la tabla más preguntada en exámenes. Memorizar los 5-7 campos más relevantes (`AgentId`, `AccountUpn`, `ActionType`, `ResourceUri`, `InputDataSensitivity`, `OutputDataSensitivity`, `CorrelationId`).
- **Diferenciar incident vs alert** — el examen explora esto. Una incident agrupa alertas; el SOC trabaja sobre incidents, no sobre alerts.
- **MITRE ATT&CK** — preguntas frecuentes sobre tactic codes (T1078 Valid Accounts, T1567 Exfiltration over Web Service, T1199 Trusted Relationship). Familiarízate con los 12 tactics y las 15-20 techniques más relevantes a IA/agentes.
- **Calibrar severidad** — el examen explora la decisión correcta de severity para custom rules. No todo es High.
- **Sentinel vs Defender XDR** — entender qué hace cada uno y cuándo se justifica el coste de Sentinel sobre Defender XDR standalone.
- Practicar **LAB-12-1** (escribir las 3 queries canónicas para los patrones problemáticos) hasta reproducirlas sin guion. Es ejercicio práctico clásico del examen.
