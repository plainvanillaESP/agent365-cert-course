# Módulo 11 — Recursos

> Referencias externas para profundizar en Data Loss Prevention, trainable classifiers, Communication Compliance y la integración con Microsoft Defender for Cloud Apps en el contexto de Agent 365.

---

## Documentación oficial Microsoft Learn

### Data Loss Prevention (DLP)

- [Microsoft Purview Data Loss Prevention overview](https://learn.microsoft.com/en-us/purview/dlp-learn-about-dlp) — concepto, motivación, capacidades del producto.
- [Plan for data loss prevention](https://learn.microsoft.com/en-us/purview/dlp-overview-plan-for-dlp) — guía formal de planificación previa al despliegue.
- [Data Loss Prevention policy reference](https://learn.microsoft.com/en-us/purview/dlp-policy-reference) — referencia completa de locations, conditions y actions.
- [DLP for Microsoft Agent 365](https://learn.microsoft.com/en-us/agent-365/dlp-integration) — extensiones específicas: location `Agent 365 outputs`, evaluación runtime, integración con audit log.
- [Create, test, and tune a DLP policy](https://learn.microsoft.com/en-us/purview/dlp-create-test-tune-dlp-policy) — flujo recomendado de despliegue (simulation → audit → enforce).

### Trainable classifiers

- [Trainable classifiers overview](https://learn.microsoft.com/en-us/purview/trainable-classifiers-definitions) — concepto y catálogo de classifiers built-in.
- [Create a custom trainable classifier](https://learn.microsoft.com/en-us/purview/classifier-get-started-with) — guía paso a paso de entrenamiento.
- [Trainable classifiers reference](https://learn.microsoft.com/en-us/purview/classifier-tc-definitions) — referencia de cada classifier disponible (`OffensiveLanguage`, `Threats`, `ContractDocuments`, `FinancialReports`, etc.).
- [Best practices for trainable classifiers](https://learn.microsoft.com/en-us/purview/classifier-tc-best-practices) — calibración, evaluación y reentrenamiento.

### Communication Compliance

- [Microsoft Purview Communication Compliance overview](https://learn.microsoft.com/en-us/purview/communication-compliance) — concepto, capacidades, integración con Insider Risk.
- [Plan for Communication Compliance](https://learn.microsoft.com/en-us/purview/communication-compliance-plan) — diseño de policies, reviewers, escalado.
- [Communication Compliance for agents (Microsoft Agent 365)](https://learn.microsoft.com/en-us/agent-365/communication-compliance-integration) — agentes como participantes en scope.

### Microsoft Defender for Cloud Apps

- [Microsoft Defender for Cloud Apps overview](https://learn.microsoft.com/en-us/defender-cloud-apps/what-is-defender-for-cloud-apps) — concepto, posicionamiento como CASB.
- [Connect cloud apps to Defender for Cloud Apps](https://learn.microsoft.com/en-us/defender-cloud-apps/enable-instant-visibility-protection-and-governance-actions-for-your-apps) — catálogo de conectores y proceso de onboarding.
- [Session policies](https://learn.microsoft.com/en-us/defender-cloud-apps/session-policy-aad) — modo reverse proxy.
- [Cloud Discovery](https://learn.microsoft.com/en-us/defender-cloud-apps/set-up-cloud-discovery) — detección de shadow IT.
- [Integrate Microsoft Defender for Cloud Apps with Purview DLP](https://learn.microsoft.com/en-us/defender-cloud-apps/dlp-integration) — flujo cross-platform.

---

## Blogs oficiales

- [Microsoft Purview Tech Community](https://techcommunity.microsoft.com/category/microsoftsecurityandcompliance/blog/microsoftpurview) — anuncios mensuales del producto.
- [Microsoft Defender for Cloud Apps blog](https://techcommunity.microsoft.com/category/microsoftsecurityandcompliance/blog/microsoftdefenderforcloudapps) — novedades de MDA.
- [Microsoft Agent 365 launch — DLP integration](https://techcommunity.microsoft.com/blog/microsoft-agent-365-dlp-integration) — anuncio de la location `Agent 365 outputs` y casos de uso oficiales.

---

## Lecturas adicionales

- **CIS Controls v8 — Control 3 (Data Protection)**: la referencia operativa más usada del sector para definir un programa de protección de datos. Mapea bien con DLP + IP de Purview. [CIS reference](https://www.cisecurity.org/controls/data-protection).
- **NIST SP 800-53 Rev. 5 — Family AC (Access Control) y SC (System & Communications Protection)**: marco regulatorio federal estadounidense que respalda las decisiones de policy DLP. [NIST publication](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final).
- **MITRE ATT&CK — Exfiltration tactic (TA0010)**: clasificación oficial de las técnicas de exfiltración que un programa DLP intenta cubrir. Útil para mapear policies a amenazas conocidas. [MITRE reference](https://attack.mitre.org/tactics/TA0010/).

---

## Herramientas y CLIs útiles

- **Microsoft Purview Compliance PowerShell**: `Get-DlpCompliancePolicy`, `New-DlpComplianceRule`, `Get-ClassificationRuleCollection` para gestión programática.
- **Microsoft Graph PowerShell — Compliance**: cmdlets `Get-DlpPolicy`, `Get-DlpOverrideEvents` para auditoría programática.
- **MDA REST API**: endpoint `https://<tenant>.portal.cloudappsecurity.com/api/v1/` para automatizar consultas de policies y alertas.
- **Purview portal**: compliance.microsoft.com — punto único de entrada para todas las operaciones.

---

## Para la certificación

- Diferenciar claramente **IP (M10) vs DLP (M11)**. El examen prueba esta distinción con scenarios.
- **Saber leer una DLP policy en YAML/JSON** y entender qué hace cada componente (locations, conditions, actions).
- **Trainable classifiers**: saber el flujo completo (recopilar muestras → entrenar → evaluar → calibrar → promover) y las métricas precision/recall.
- **Override flow**: entender que `block with override` no es laxismo, es operación pragmática con audit completo.
- **Communication Compliance** aplicada a agentes es el área menos intuitiva: estudiar por qué los agentes están en scope y cuál es el workflow de revisión.
- Practicar **lab 11.2** (configurar trainable classifier custom y validar precision/recall) hasta reproducirlo. Es un ejercicio práctico clásico del examen.
