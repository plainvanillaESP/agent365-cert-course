# Módulo 14 — Recursos

> Referencias externas para profundizar en gobernanza avanzada y multi-tenant aplicada a Agent 365.

---

## Documentación oficial Microsoft Learn

### Multi-tenant y federation

- [Microsoft 365 multi-tenant organizations overview](https://learn.microsoft.com/en-us/microsoft-365/enterprise/multi-tenant-overview) — modelos de organización multi-tenant soportados.
- [Microsoft Entra cross-tenant access settings](https://learn.microsoft.com/en-us/entra/external-id/cross-tenant-access-overview) — configuración de B2B colaboration entre tenants.
- [Microsoft Entra cross-tenant synchronization](https://learn.microsoft.com/en-us/entra/identity/multi-tenant-organizations/cross-tenant-synchronization-overview) — sincronización de usuarios entre tenants del mismo grupo.

### GDAP y delegated administration

- [Granular Delegated Admin Privileges (GDAP) overview](https://learn.microsoft.com/en-us/partner-center/gdap-introduction) — concepto, beneficios sobre DAP.
- [Configure GDAP relationships](https://learn.microsoft.com/en-us/partner-center/gdap-overview) — flujo completo paso a paso.
- [GDAP roles reference](https://learn.microsoft.com/en-us/partner-center/gdap-role-guidance) — qué roles solicitar para cada caso de uso.
- [Migrating from DAP to GDAP](https://learn.microsoft.com/en-us/partner-center/gdap-migrate-from-dap) — para MSPs que aún operan en modelo antiguo.

### Customer Lockbox

- [Customer Lockbox overview](https://learn.microsoft.com/en-us/microsoft-365/compliance/customer-lockbox-requests) — concepto, cuándo se dispara, flujo de aprobación.
- [Enable Customer Lockbox](https://learn.microsoft.com/en-us/microsoft-365/compliance/customer-lockbox-requests#turn-customer-lockbox-on-or-off) — configuración.

### Agent 365 multi-tenant

- [Agent 365 multi-tenant deployment guide](https://learn.microsoft.com/en-us/agent-365/multi-tenant-deployment) — patrones recomendados para grupos corporativos.
- [Cross-tenant governance for Agent 365](https://learn.microsoft.com/en-us/agent-365/cross-tenant-governance) — gobernanza distribuida.

---

## Regulación e industria

- **EU AI Act** ([EUR-Lex](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)) — Reglamento europeo de IA aplicable a sistemas IA en la UE.
- **GDPR** ([gdpr.eu](https://gdpr.eu/)) — Reglamento General de Protección de Datos UE.
- **LGPD** (Brasil) ([Lei Geral de Proteção de Dados](https://www.gov.br/anpd/pt-br)) — equivalente brasileño a GDPR.
- **CCPA / CPRA** (California) — ley de privacidad de California aplicable a operaciones en US.
- **NIST AI Risk Management Framework** ([NIST AI RMF 1.0](https://www.nist.gov/itl/ai-risk-management-framework)) — framework de gestión de riesgos de IA.

---

## Frameworks y referencia metodológica

- **COBIT 2019 — Governance and Management of Enterprise IT** (ISACA): framework formal para gobernanza de IT que aplica también a gobernanza de IA en grandes organizaciones.
- **ITIL 4** — framework de gestión de servicios IT con prácticas aplicables al SOC central multi-tenant.
- **ISO/IEC 42001:2023** — Standard internacional para sistemas de gestión de IA, publicado en diciembre 2023. Referencia obligada en certificaciones formales de programas IA.

---

## Lecturas adicionales

- **Microsoft Trust Center — Multi-tenant compliance** ([trust.microsoft.com](https://trust.microsoft.com/)) — documentación oficial de cumplimiento por jurisdicción.
- **Gartner — Magic Quadrant for AI Governance Platforms** (anual) — referencia del sector.
- **MIT Sloan Management Review — AI Governance Reports** — casos prácticos de gobernanza en empresas.

---

## Para la certificación

- **Diferenciar las 4 topologías** (parent/subsidiary, M&A, MSP/MSSP, joint venture) es contenido recurrente del examen. Memorizar los casos típicos y las implicaciones específicas para Agent 365.
- **GDAP vs DAP**: el examen explora la diferencia. GDAP aporta scope limitado + duración + audit + customer consent. DAP es el modelo legacy con Global Admin por defecto.
- **Customer Lockbox** se pregunta en escenarios sensibles: cuándo activarlo, qué acciones lo disparan, cómo se aprueba.
- **Los tres federation models** (centralizado, federado, hub-and-spoke) y los criterios de elección son contenido frecuente. El correcto suele ser hub-and-spoke para organizaciones modernas con diversidad de mercados.
- **Policy framework distribuido**: comité central + comités locales + 3 ejes de alineación. Concepto integrador.
- Practicar **LAB-14-1** (configurar GDAP + Customer Lockbox cross-tenant) hasta reproducirlo sin guion.
