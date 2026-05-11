# Módulo 16. Recursos

> Referencias externas para profundizar en gestión económica y mejora continua de programas Agent 365.

---

## Documentación oficial Microsoft Learn

### Licenciamiento y precio

- [Microsoft 365 Copilot licensing overview](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-licensing) — guía oficial de modalidades, prerrequisitos y precios.
- [Microsoft Agent 365 licensing requirements](https://learn.microsoft.com/en-us/agent-365/licensing) — requisitos por componente del producto.
- [Copilot Control System Usage analytics](https://learn.microsoft.com/en-us/copilot/microsoft-365/manage-copilot-usage-analytics) — métricas de uso por usuario para detección de licencias infrautilizadas.

### Costes de Sentinel y telemetría

- [Microsoft Sentinel pricing](https://azure.microsoft.com/en-us/pricing/details/microsoft-sentinel/) — precio oficial por GB de ingestión y retención.
- [Plan costs and understand Microsoft Sentinel pricing and billing](https://learn.microsoft.com/en-us/azure/sentinel/billing) — modelos de compra (pay-as-you-go, capacidad reservada).
- [Sentinel data tiering and archive](https://learn.microsoft.com/en-us/azure/sentinel/configure-data-retention-archive) — configuración del tiering interactivo, archive y restore.
- [Reduce ingestion costs in Microsoft Sentinel](https://learn.microsoft.com/en-us/azure/sentinel/billing-reduce-costs) — buenas prácticas y filtros seguros.

### Gobernanza y ciclo de mejora

- [Microsoft Cost Management overview](https://learn.microsoft.com/en-us/azure/cost-management-billing/cost-management-billing-overview) — herramienta canónica para reporting financiero de servicios Azure.
- [Adopt Microsoft Copilot: measure impact and ROI](https://learn.microsoft.com/en-us/copilot/microsoft-365/adoption-measure-impact) — marco de medición de retorno del programa Copilot.

---

## Frameworks y referencia metodológica

- **FinOps Foundation Framework** — Disciplina formal de gestión financiera de cloud aplicable a Sentinel y servicios Agent 365 relacionados.
- **TBM (Technology Business Management)** — Taxonomía estandarizada para reportar coste IT al negocio. Las cuatro líneas canónicas del módulo se mapean directamente a categorías TBM.
- **ITIL 4 Continual Improvement** — Práctica formal de mejora continua aplicable al comité trimestral del módulo.

---

## Lecturas adicionales

- **Cloud FinOps** (J.R. Storment y Mike Fuller) — libro de referencia de la disciplina FinOps. Capítulos 6 a 9 son directamente aplicables al programa Agent 365.
- **The Goal** (Eliyahu Goldratt) — clásico sobre identificación de cuellos de botella y mejora continua. La filosofía «el objetivo es ganar dinero» aplica al programa: cualquier optimización que no se traduce en TCO menor o productividad mayor es ruido.
- **Measure What Matters** (John Doerr) — sobre OKRs aplicados a iniciativas estratégicas. Útil para definir los objetivos trimestrales del comité.

---

## Para la certificación

- Las **cuatro líneas canónicas** del TCO (L1 licencias, L2 ingestión, L3 storage, L4 operación) son contenido recurrente. Memorizar también las proporciones típicas (55-65 / 10-15 / 5-10 / 15-25 por ciento).
- La **regla de cuarentena 30/30** se pregunta literalmente: 30 días de aviso y coaching, 30 días de monitorización, retirada al día 61.
- El **criterio de agente zombi** (< 5 invocaciones mensuales en dos trimestres consecutivos) y la disciplina del comité para decidir caso a caso con valor cualitativo es contenido específico.
- Los **filtros de ingestión prohibidos** (eventos de invocación, eventos de cambio de configuración, eventos de seguridad) y la diferencia con filtros seguros es contenido específico.
- El **tiering de retención canónico** (30 días caliente, hasta 7 años frío, opcional glacial) es contenido específico con descuentos típicos.
- Los **cuatro inputs canónicos del comité trimestral** (KPIs financieros, lecciones de incidents, evolución del catálogo, feedback de adopción) y los **tres outputs** (decisiones, reporte ejecutivo, comunicación) se preguntan habitualmente.
- Practicar **LAB-16-1** (modelo TCO completo) hasta poder construirlo en menos de 30 minutos. Es el ejercicio aplicado que mejor refleja la competencia esperada del rol.
