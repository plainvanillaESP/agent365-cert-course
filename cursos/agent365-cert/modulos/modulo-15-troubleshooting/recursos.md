# Módulo 15 — Recursos

> Referencias externas para profundizar en troubleshooting y operación cotidiana de Agent 365.

---

## Documentación oficial Microsoft Learn

### Troubleshooting general

- [Microsoft Agent 365 troubleshooting guide](https://learn.microsoft.com/en-us/agent-365/troubleshoot) — guía oficial de troubleshooting con casos comunes.
- [Common Agent 365 error codes](https://learn.microsoft.com/en-us/agent-365/error-codes) — catálogo de códigos de error y resoluciones.

### Diagnóstico con KQL

- [CloudAppEvents schema and queries for diagnostics](https://learn.microsoft.com/en-us/defender-xdr/advanced-hunting-cloudappevents-table) — esquema completo.
- [Hunting queries for troubleshooting](https://github.com/microsoft/Microsoft-365-Defender-Hunting-Queries/tree/master/Troubleshooting) — repositorio comunitario de queries.

### Conditional Access debugging

- [Troubleshoot Conditional Access policies](https://learn.microsoft.com/en-us/entra/identity/conditional-access/troubleshoot-conditional-access) — diagnóstico de CA bloqueando sesiones.
- [Sign-in logs in Microsoft Entra](https://learn.microsoft.com/en-us/entra/identity/monitoring-health/concept-sign-ins) — interpretación de result types.

### Audit log y reconciliación

- [Microsoft Purview audit (Premium) overview](https://learn.microsoft.com/en-us/purview/audit-premium) — capacidades de audit log avanzado.
- [Reconciliation patterns between Defender XDR and Purview](https://learn.microsoft.com/en-us/defender-xdr/reconciliation-best-practices) — buenas prácticas.

### Sentinel playbook debugging

- [Troubleshoot Logic Apps execution](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-diagnosing-failures) — diagnóstico de playbook failures.
- [Retry policies for Logic Apps](https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-create-api-app) — configuración de resiliencia.

---

## Frameworks y referencia metodológica

- **ITIL 4 Service Operation** — Framework formal de operaciones IT con prácticas aplicables al SOC.
- **NIST SP 800-61 Rev. 2 — Computer Security Incident Handling Guide** — Guía de gestión de incidentes que respalda el cierre con evidencia parcial.
- **Sysadmin Day-to-Day playbooks (community)** — Repositorios de playbooks operativos para casos comunes.

---

## Lecturas adicionales

- **Google SRE Book** — Capítulos sobre postmortem culture y blameless retrospectives, aplicables a la fase Document de OBDED.
- **The Phoenix Project** (Gene Kim) — Fundamentos culturales de operaciones IT que aplican a Agent 365.

---

## Para la certificación

- **OBDED** es contenido recurrente: memorizar las 5 fases y la regla 80/20 (Observe + Diagnose = 80 % del tiempo).
- **Las 4 causas comunes** de agente deshabilitado (CA policy, secret expirado, blueprint deprecated, security automation) se preguntan habitualmente.
- **La disciplina de NO re-habilitar agentes deshabilitados por automation sin investigar** es un concepto clave del examen.
- **La reconciliación cruzada con 3 fuentes** (CCS, Purview, Defender XDR) y el umbral ±0.1 % es contenido específico.
- Practicar **LAB-15-1** (resolución OBDED de un caso simulado completo) hasta dominar el flujo.
