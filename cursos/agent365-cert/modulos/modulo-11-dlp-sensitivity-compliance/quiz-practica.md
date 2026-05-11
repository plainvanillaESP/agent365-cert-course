---
modulo: 11
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 11"
duracion_min: 20
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-11
preguntas:
  - Q-11-1
  - Q-11-2
  - Q-11-3
  - Q-11-4
  - Q-11-5
  - Q-11-6
  - Q-11-7
caso_estudio: "Banco Santander"
---

# Módulo 11 — Quiz de práctica

> Siete preguntas para validar tu comprensión de DLP runtime, trainable classifiers, integración con MDA y Communication Compliance en el contexto de Agent 365. Intentos ilimitados, aprobado a partir del 70 % (5 de 7 correctas).
>
> Las siete preguntas usan los cinco tipos canónicos del paquete (multiple-choice, multiple-response, scenario, drag-and-drop, ordering) para cubrir los siete OAs del módulo.

---

::: pregunta
id: Q-11-1
oa: OA-11.1
tipo: multiple-choice
dificultad: media
bloom: Comprender
enunciado: |
  Tu organización ya tiene Information Protection desplegada con sensitivity labels en archivos y herencia activa en outputs de agentes. El responsable de Seguridad pregunta «¿qué nos aporta DLP además de IP, o es redundante?». ¿Cuál es la respuesta más precisa?
opciones:
  - id: a
    texto: "DLP es redundante: IP ya cifra y protege el dato. Añadir DLP solo aumenta complejidad operativa."
  - id: b
    texto: "DLP decide **en runtime** qué hacer con acciones concretas sobre el dato (allow, audit, block, justify-and-allow), incluyendo flujo de justificación documentado y cobertura multicanal en una sola policy. IP etiqueta y protege el dato persistentemente pero no impide acciones específicas."
    correcta: true
  - id: c
    texto: "DLP sustituye a IP en organizaciones maduras: una vez tienes DLP, las sensitivity labels son innecesarias."
  - id: d
    texto: "DLP solo aplica a archivos legacy sin label, IP cubre todo lo etiquetado."
justificacion: |
  IP y DLP son complementarias. IP responde «¿cómo se etiqueta este dato y qué protección viaja con él?» (decisión persistente sobre el dato). DLP responde «¿esta acción concreta sobre este dato debe permitirse, registrarse o bloquearse?» (decisión runtime sobre la acción). Sin IP, DLP no sabe sobre qué decidir. Sin DLP, IP protege el dato pero no impide la acción problemática. La opción B captura exactamente esta complementariedad. A, C y D son malentendidos comunes que llevan a brechas operativas.
:::

::: pregunta
id: Q-11-2
oa: OA-11.2
tipo: scenario
dificultad: dificil
bloom: Aplicar
enunciado: |
  Lees el siguiente borrador de DLP policy escrito por un compañero junior:

  ```yaml
  policy:
    name: "Protect-Financial-Outputs"
    locations:
      - Exchange Online
    conditions:
      content_contains:
        SITs: [CreditCardNumber, IBAN]
    actions:
      - block  # sin override
    mode: enforce  # directo a producción
  ```

  ¿Cuáles son los **dos problemas operativos críticos** que debes señalar antes de firmar el despliegue?
opciones:
  - id: a
    texto: "(1) Falta la location `Microsoft Agent 365 outputs` — los outputs del agente quedarían fuera del alcance. (2) `mode: enforce` sin pasar por `audit only` durante 2-4 semanas garantiza falsos positivos masivos y presión política para revertir la policy entera."
    correcta: true
  - id: b
    texto: "(1) Las SITs `CreditCardNumber` e `IBAN` no son válidas para este caso. (2) Faltan keywords adicionales en la condition."
  - id: c
    texto: "(1) `block` sin override es la única action válida para producción. (2) `mode: enforce` directo es la mejor práctica operativa."
  - id: d
    texto: "(1) Faltan trainable classifiers. (2) La policy debería cubrir 20+ locations para ser efectiva."
justificacion: |
  Los dos problemas críticos son los identificados en A. El primero es la **falta de la location `Agent 365 outputs`**: si la intención es proteger los outputs del agente, esa location es obligatoria; con solo Exchange Online cubres emails pero no los outputs en sí. El segundo es el **despliegue directo a `enforce`**: la práctica operativa recomendada es 2-4 semanas en `audit only` para validar precision con datos reales antes de bloquear. Adicionalmente, `block` sin override (vs `block with override`) solo es defensible cuando la regulación no admite excepción (PCI-DSS, sanitario crítico); para casos genéricos, `block with override` permite excepciones legítimas auditadas.
:::

::: pregunta
id: Q-11-3
oa: OA-11.3
tipo: multiple-response
dificultad: media
bloom: Aplicar
enunciado: |
  Sobre los **trainable classifiers custom** de Microsoft Purview, ¿cuáles de las siguientes afirmaciones son correctas? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "Para entrenar un classifier custom se necesitan típicamente 150-500 muestras representativas, con diversidad importando más que volumen."
    correcta: true
  - id: b
    texto: "El entrenamiento es síncrono y termina en minutos."
  - id: c
    texto: "Las muestras negativas (documentos parecidos que NO son del tipo target) son críticas para evitar falsos positivos."
    correcta: true
  - id: d
    texto: "Una vez entrenado, el classifier nunca necesita re-entrenamiento porque el modelo aprende permanentemente."
  - id: e
    texto: "Las métricas precision (% detecciones correctas) y recall (% casos reales detectados) se evalúan con muestras no usadas en entrenamiento."
    correcta: true
  - id: f
    texto: "El threshold de confianza es calibrable: subir threshold mejora precision a costa de recall; bajarlo hace lo contrario."
    correcta: true
justificacion: |
  Las opciones A, C, E y F son correctas y reflejan las prácticas estándar de ML aplicadas a classifiers de Purview: tamaño adecuado del training set con diversidad (A), muestras negativas para discriminación robusta (C), evaluación con muestras de test independientes (E), threshold como palanca de calibración precision/recall (F). La B es falsa: el entrenamiento toma 8-24 horas en Purview. La D es falsa y peligrosa operativamente: el lenguaje del negocio evoluciona y los classifiers se degradan; el re-entrenamiento trimestral es práctica recomendada.
:::

::: pregunta
id: Q-11-4
oa: OA-11.4
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada **action DLP** con el caso de uso donde es la decisión correcta.
items:
  - id: a1
    texto: "Audit only"
  - id: a2
    texto: "Block with override"
  - id: a3
    texto: "Block (sin override)"
  - id: a4
    texto: "Notify only"
targets:
  - id: t1
    label: "Primeras 2-4 semanas tras desplegar una policy nueva: validar precision antes de bloquear"
  - id: t2
    label: "Caso operativo común: proteger con flexibilidad para excepciones legítimas justificadas"
  - id: t3
    label: "Regulación que no admite excepción (PCI-DSS, datos sanitarios sensibles)"
  - id: t4
    label: "Modo educativo: avisar al usuario sin interferir, formando hábito de revisión"
correct_map:
  a1: t1
  a2: t2
  a3: t3
  a4: t4
justificacion: |
  Las cuatro actions DLP tienen casos de uso distintos. `Audit only` es el modo de simulación al inicio (T1), permite analizar falsos positivos sin bloquear operación legítima. `Block with override` (T2) es el caso operativo más común: protege por defecto pero deja escape hatch auditable. `Block` sin override (T3) solo se justifica en regulaciones que prohíben excepciones (PCI-DSS, regulación sanitaria estricta). `Notify only` (T4) es educativo: el usuario recibe aviso pero la acción procede, útil para crear hábito de revisión sin frenar productividad.
:::

::: pregunta
id: Q-11-5
oa: OA-11.5
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Tu organización tiene un agente Foundry que consulta registros de clientes en Salesforce (sandbox conectado vía MDA) y genera resúmenes ejecutivos. Compliance quiere que la misma DLP que protege los outputs en SharePoint también cubra esta integración con Salesforce. ¿Cuál es el diseño correcto?
opciones:
  - id: a
    texto: "Crear una DLP policy separada para Salesforce con condiciones distintas a la de SharePoint. La consistencia se mantiene revisando ambas manualmente cada trimestre."
  - id: b
    texto: "Una única DLP policy en Purview con locations: `SharePoint sites`, `OneDrive accounts`, `Microsoft Agent 365 outputs`, y `Microsoft Defender for Cloud Apps` (con scope a Salesforce). Las conditions y actions se definen una sola vez y aplican consistentemente cross-SaaS."
    correcta: true
  - id: c
    texto: "Configurar las protecciones directamente en Salesforce con sus reglas nativas, ignorando Purview para esta integración."
  - id: d
    texto: "Bloquear el acceso del agente a Salesforce vía Conditional Access — DLP no es necesaria si el acceso está restringido."
justificacion: |
  La opción B es la respuesta canónica para cross-SaaS DLP: una sola policy con múltiples locations, MDA como broker para SaaS de terceros (Salesforce, ServiceNow, GitHub, etc.). Las conditions y actions se definen una sola vez, lo que garantiza consistencia y reduce mantenimiento operativo. La A genera divergencia operativa y trabajo duplicado. La C deja huérfana la trazabilidad regulatoria en Purview y obliga a usar dos herramientas distintas. La D confunde acceso con protección de dato: CA gestiona el acceso (M09), DLP gestiona qué se hace con el dato (M11); ambas son necesarias en serie.
:::

::: pregunta
id: Q-11-6
oa: OA-11.7
tipo: ordering
dificultad: dificil
bloom: Analizar
enunciado: |
  Ordena las **fases recomendadas de despliegue** de una DLP policy nueva para outputs de agentes, desde la primera acción hasta la operación estabilizada.
items:
  - id: o1
    texto: "Desplegar la policy en modo `Audit only` durante 2-4 semanas"
  - id: o2
    texto: "Analizar el rate de falsos positivos en audit log; agrupar por causa raíz"
  - id: o3
    texto: "Calibrar el threshold y excepciones contextuales basándose en los FP"
  - id: o4
    texto: "Promover a `Block with override` con justification reasons predefinidas"
  - id: o5
    texto: "Reporte mensual al CISO con tasa de override, blocks evitados, agentes problemáticos"
correct_order:
  - o1
  - o2
  - o3
  - o4
  - o5
justificacion: |
  El orden refleja el ciclo operativo recomendado. Saltarse fases es la fuente principal de incidentes: lanzar directo a `Block with override` sin haber pasado por `Audit only` (saltarse O1) garantiza falsos positivos en producción + presión política. Sin O2 (análisis de FP) no se sabe qué calibrar. Sin O3 (calibración) la policy queda con tasa de FP elevada permanentemente. Sin O4 la policy nunca llega a ser preventiva. Sin O5 el equipo de seguridad no puede defender ante el negocio el valor de la inversión en DLP. El reporte mensual a CISO cierra el ciclo y alimenta decisiones de calibración futuras.
:::

::: pregunta
id: Q-11-7
oa: OA-11.6
tipo: scenario
dificultad: dificil
bloom: Aplicar
enunciado: |
  Un agente de research en una entidad de banca de inversión está generando outputs que ocasionalmente contienen lenguaje de «recomendación de inversión». En esta industria, los analistas humanos deben pasar por un proceso formal de aprobación antes de emitir recomendaciones; aplicar el mismo control a agentes es exigencia regulatoria. ¿Cuál es la configuración correcta de **Communication Compliance**?
opciones:
  - id: a
    texto: "Bloquear el agente con CA hasta que no pueda generar lenguaje de recomendación de ningún tipo. DLP es suficiente para casos regulados, CC es opcional."
  - id: b
    texto: "Configurar policy CC con scope que incluye el blueprint del agente research, classifier `FinancialReports` + keyword dictionary con términos de recomendación (target price, buy/sell rating, outperform, etc.), 10-15 % review percentage, grupo `compliance-reviewers-research` como reviewers, action notify + tag + correlacionar con Insider Risk Management. Workflow: reviewer humano evalúa cada match como `Resolve as compliant` o `Escalate`."
    correcta: true
  - id: c
    texto: "Comunicar a los usuarios del agente que deben revisar manualmente cada output antes de compartir; no se necesita herramienta adicional."
  - id: d
    texto: "Aplicar solo DLP con block sin override sobre los outputs. Si bloquea todos los lenguajes de recomendación se cumple la regulación."
justificacion: |
  La banca de inversión es uno de los sectores donde Communication Compliance se diseñó específicamente. La respuesta B describe la configuración canónica: classifier built-in + keyword dictionary específico + reviewers humanos + correlación con Insider Risk. CC es vigilancia (registra y revisa) no bloqueo: deja pasar el mensaje y lo somete a revisión humana posterior, que es lo que el regulador exige (un humano cualificado avala). La A confunde acceso (CA) con vigilancia conversacional (CC) — son disciplinas distintas. La C confía la responsabilidad regulatoria en el factor humano sin sistema, inviable a escala. La D bloquea con DLP cuando el regulador exige revisión humana, no prohibición técnica.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M12.

**Escenario.** **Banco Santander** (200.000+ empleados, M365 E5 Compliance al 60 %, Agent 365 en piloto con 1.500 usuarios) opera con agentes que generan informes ejecutivos diarios, resúmenes de mercados, análisis de clientes y borradores de comunicaciones reguladas. El regulador (CNMV en España, ESMA a nivel europeo) exige trazabilidad completa de cualquier output que contenga elementos de «recomendación de inversión» o «consejo financiero», incluyendo los generados por agentes. Te piden diseñar el programa DLP + CC operativo para los próximos 12 meses.

**Tareas.**

1. Propón las 5-7 DLP policies prioritarias para el programa (cubriendo distintas locations, conditions, actions).
2. Define los 2-3 trainable classifiers custom que la organización debe entrenar (con descripción, datos esperados, target precision/recall).
3. Diseña las policies de Communication Compliance: scope, reviewers, classifiers usados, review percentage, escalado.
4. Define el reporting mensual al CISO con las 4 métricas clave + un quinto KPI específico de banca.

<details>
<summary>Ver solución sugerida</summary>

**1. DLP policies prioritarias (Top 5).**

| # | Policy | Locations | Conditions | Action |
|---|---|---|---|---|
| 1 | Protect-Recommendations-Outputs | Agent 365 outputs + Exchange + Teams | Trainable classifier `Custom-InvestmentRecommendation` + dictionary terms | Block with override |
| 2 | Protect-Client-PII | Agent 365 outputs + SharePoint + MDA(Salesforce) | SITs (DNI, IBAN, NIF, passport) + label `Confidential+` | Block with override |
| 3 | Protect-Market-Sensitive | Agent 365 outputs + Teams | Keyword dict «pre-public earnings» + label `HighlyConfidential` | Block sin override |
| 4 | Audit-Internal-MA | All | Classifier `Custom-MA-Conversations` (LAB-11-2) | Audit only + alert |
| 5 | Endpoint-Exfiltration | Devices (Endpoint DLP) | label `Confidential+` + destination not in trusted apps list | Block with override |

**2. Trainable classifiers custom a entrenar.**

| Classifier | Datos esperados | Target |
|---|---|---|
| `Custom-InvestmentRecommendation` | 300+ docs históricos de research department con recomendaciones; 300+ docs research sin recomendaciones | Precision ≥ 85 %, Recall ≥ 75 % |
| `Custom-RegulatoryDisclosure` | Comunicaciones formales al regulador histórico (CNMV/ESMA) | Precision ≥ 80 %, Recall ≥ 70 % |
| `Custom-ClientNDA-Content` | Documentos sujetos a NDAs específicos con clientes | Precision ≥ 90 %, Recall ≥ 70 % |

**3. Communication Compliance.**

| Policy | Scope | Classifiers | Review % | Reviewers | Acción |
|---|---|---|---|---|---|
| CC-Research-Recomendaciones | Agentes blueprint research | `FinancialReports` + `Custom-InvestmentRecommendation` + keyword dict | 15 % | Compliance Research (5 personas) | Notify + Tag + Correlate IRM |
| CC-Trading-LenguajeRegulado | Agentes blueprint trading | `Custom-RegulatoryDisclosure` + dictionary | 20 % | Compliance Trading (3 personas) | Notify + Escalate + Alert CISO |
| CC-Antiacoso-General | Todos los agentes | `OffensiveLanguage` + `Harassment` built-in | 5 % | HR + Legal (2 personas) | Notify + Tag |

**4. Reporting mensual CISO — 4 + 1 métricas.**

```
KPIs CISO — Programa DLP + CC — Banca Santander
─────────────────────────────────────────────────
Métricas estándar:

1. Blocks ejecutados este mes ──── 1,847 (▼12% vs mes anterior)
   ├── HighlyConfidential ─────── 423
   ├── Confidential ────────────── 1,201
   └── PII/SIT triggered ─────────── 223

2. Tasa de override ──────────── 3.2 % (target < 5 %) ✓
   ├── Justificación predefinida ─ 78 %
   └── "Otro" texto libre ──────── 22 %

3. Top 3 agentes por detecciones ────
   ├── research-equity-agent ─── 412
   ├── compliance-summary ──────── 387
   └── client-onboarding-bot ───── 287

4. Deuda CC (matches > 7 días) ── 14 casos (target < 20) ✓

─────────────────────────────────────────────────
KPI específico banca:

5. Casos escalados a CNMV/ESMA ─── 2 (ambos en plazo)
   └── Tiempo medio respuesta ──── 4.2 días (target < 7 días) ✓
─────────────────────────────────────────────────
```

El KPI específico (5) es el que el CISO necesita reportar al Comité de Auditoría del Consejo y al regulador. Por eso vive en el dashboard ejecutivo y no en el apéndice operativo.

</details>
