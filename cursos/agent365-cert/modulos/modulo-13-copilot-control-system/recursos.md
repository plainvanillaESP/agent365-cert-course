# Módulo 13 — Recursos

> Referencias externas para profundizar en Microsoft Copilot Control System integrado con Agent 365.

---

## Documentación oficial Microsoft Learn

- [Microsoft Copilot Control System overview](https://learn.microsoft.com/en-us/copilot/control-system/overview) — concepto, posicionamiento, audiencia objetivo.
- [License management in Copilot Control System](https://learn.microsoft.com/en-us/copilot/control-system/license-management) — asignación masiva, reasignación, proyección de coste.
- [Agent governance and catalog policies](https://learn.microsoft.com/en-us/copilot/control-system/agent-governance) — los tres modelos canónicos (Open / Curated / Approval-based), configuración paso a paso.
- [Data governance integration](https://learn.microsoft.com/en-us/copilot/control-system/data-governance) — interconexión con Purview Information Protection y DLP.
- [Telemetry and reporting](https://learn.microsoft.com/en-us/copilot/control-system/telemetry) — KPIs disponibles, drill-down, exportación.
- [Monthly governance report generation](https://learn.microsoft.com/en-us/copilot/control-system/reporting) — flujo de generación automática del reporte mensual.

---

## Diferenciación con otros productos

- [CCS vs Microsoft Defender XDR — operational responsibilities](https://learn.microsoft.com/en-us/copilot/control-system/comparison-defender) — tabla de decisión rápida oficial.
- [CCS vs Microsoft Purview — when to use what](https://learn.microsoft.com/en-us/copilot/control-system/comparison-purview) — clarificación de roles.
- [CCS + Microsoft 365 admin center — coexistence guide](https://learn.microsoft.com/en-us/copilot/control-system/admin-center-coexistence) — qué hace cada uno, dónde se solapan.

---

## Blogs oficiales

- [Microsoft Copilot Tech Community](https://techcommunity.microsoft.com/category/microsoftcopilot) — anuncios y deep-dives mensuales.
- [Microsoft Agent 365 — Copilot Control System integration announcement](https://techcommunity.microsoft.com/blog/agent-365-ccs-integration) — anuncio oficial de la integración con Agent 365.

---

## Lecturas adicionales

- **Gartner Magic Quadrant for AI Governance Platforms** (anual): referencia del sector para evaluar herramientas de gobernanza de IA.
- **The MIT Sloan Management Review — AI Governance Reports**: artículos prácticos sobre gobernanza de IA en empresas.

---

## Herramientas y CLIs útiles

- **Microsoft Graph PowerShell — Copilot module**: cmdlets `Get-CopilotLicense`, `Set-CopilotPolicy`, `Get-CopilotTelemetry` para automatización.
- **Microsoft 365 admin center**: portal complementario para gestión de licencias agregada.
- **Power BI Copilot Reports template**: plantillas oficiales para dashboards ejecutivos personalizados.

---

## Para la certificación

- **Diferenciar CCS, Defender XDR y Purview** es la pregunta más probable. Memorizar la tabla de decisión rápida del módulo: CCS controla, Defender XDR detecta, Purview protege el dato.
- **Los tres modelos de política** (Open / Curated / Approval-based) y los criterios de evolución son contenido recurrente del examen.
- **Las cuatro superficies** de CCS (License management / Agent governance / Data governance integration / Telemetry) deben sabes nombrar y su función principal.
- Practicar **LAB-13-1** (configurar política Curated y validar compliance rate) hasta reproducirlo sin guion.
