# Banco de preguntas modelo

> Este documento contiene **12 preguntas reales** que establecen el estándar de calidad para las 60 preguntas de la evaluación final. Cubren diferentes módulos, tipos de pregunta, niveles de dificultad y niveles de Bloom. Las 60 preguntas finales (producidas en Fases 2-7) seguirán este patrón.

**Objetivo de este documento:** demostrar concretamente que las preguntas no son placeholders genéricos, que requieren comprensión profunda del temario y que admiten variantes para evitar repetición entre cohortes.

---

## Convenciones

- **ID:** `EX-MM-NNN` donde MM es el módulo de origen y NNN un correlativo.
- **Dificultad:** Fácil (recordar/comprender) / Media (aplicar/analizar) / Difícil (evaluar/crear).
- **OA mapeado:** identificador del objetivo de aprendizaje al que responde.
- **Variantes:** sugerencias de cómo reformular la pregunta cambiando escenario, datos o ángulo, manteniendo el mismo OA.

---

## EX-01-001 · Multiple choice · Fácil

**Módulo:** M01 · **OA:** OA-01.1 · **Tipo:** Multiple choice · **Área:** 1

**Enunciado:**
Una compañía está evaluando Microsoft Agent 365 y Microsoft Copilot Studio para su estrategia de IA. ¿Cuál es la diferencia fundamental entre ambos productos?

**Opciones:**

- A. Copilot Studio crea agentes y Agent 365 los gobierna; son productos complementarios, no alternativos.
- B. Agent 365 reemplaza a Copilot Studio porque integra creación y gobernanza en una sola plataforma.
- C. Copilot Studio se usa para agentes basados en Foundry; Agent 365 se usa para agentes basados en SharePoint.
- D. Agent 365 es la versión empresarial de Copilot Studio con licencia E5.

**Respuesta correcta:** A

**Justificación:** Microsoft Agent 365 es un *control plane* de gobernanza, observabilidad y seguridad. No crea agentes; gobierna los que ya existen, sin importar la plataforma de origen (Copilot Studio, Foundry, M365 Agents SDK, SharePoint, etc.). Es complementario, no competidor.

**Variantes para evitar repetición:**
- Cambiar Copilot Studio por Microsoft Foundry (misma respuesta).
- Reformular como "¿Cuándo elegir uno u otro?" exigiendo identificar casos de uso (Aplicar en lugar de Comprender).
- Incluir el M365 Agents SDK o el Agent 365 SDK como tercer eje y construir un drag-and-drop.

---

## EX-01-002 · Escenario · Media

**Módulo:** M01 · **OA:** OA-01.3 · **Tipo:** Escenario · **Área:** 1

**Enunciado:**
La directora de IT de Plain Coffee SL pregunta: "Tenemos 800 empleados con licencia M365 Copilot. Algunos usuarios crean agentes con Agent Builder y los compañeros se quejan de que no saben qué pueden hacer ni si están aprobados por IT. Además, queremos limitar el tiempo que los empleados pasan usando Copilot Chat porque vemos un descenso en la productividad colaborativa."

¿Qué solución corresponde a cada problema?

**Opciones:**

- A. Ambos problemas se resuelven con Microsoft Agent 365.
- B. Ambos problemas se resuelven con Copilot Control System (CCS).
- C. El primer problema se resuelve con Agent 365; el segundo con CCS.
- D. El primer problema se resuelve con CCS; el segundo con Agent 365.

**Respuesta correcta:** C

**Justificación:** Agent 365 gobierna a los **agentes**: el primer problema (inventariar agentes creados por usuarios, aprobarlos, hacerlos visibles) es exactamente su alcance. CCS gobierna a las **personas usando IA**: el segundo problema (uso de Copilot Chat por humanos, productividad colaborativa) corresponde a Copilot Analytics + Viva Insights, que viven en CCS. La respuesta D invierte el principio.

**Variantes:**
- Cambiar "Plain Coffee SL" por otra empresa ficticia con datos distintos (1.000 / 5.000 / 200 empleados).
- Cambiar el segundo problema por "queremos saber qué departamentos generan más mensajes con Copilot" (sigue siendo CCS).
- Cambiar el primer problema por "necesitamos auditar qué documentos están usando los agentes" (Agent 365, pero ahora vía Purview integrado).

---

## EX-02-001 · Drag-and-drop · Fácil

**Módulo:** M02 · **OA:** OA-02.1 · **Tipo:** Drag-and-drop · **Área:** 1

**Enunciado:**
Empareja cada componente arquitectónico de Microsoft Agent 365 con el admin center donde se gestiona principalmente.

**Componentes a emparejar:**
1. Agent Registry (inventario de agentes con metadata)
2. Agent identity blueprint
3. AI observability page (uso de agentes y riesgos IRM)
4. CloudAppEvents (logs de actividad de agentes)
5. Conditional Access para agentes
6. Risky Agents report

**Admin centers (destinos):**
- Microsoft 365 admin center
- Microsoft Entra admin center
- Microsoft Purview portal
- Microsoft Defender portal

**Respuesta correcta:**
- Microsoft 365 admin center → Agent Registry
- Microsoft Entra admin center → Agent identity blueprint, Conditional Access para agentes, Risky Agents report
- Microsoft Purview portal → AI observability page
- Microsoft Defender portal → CloudAppEvents

**Justificación:** Esta pregunta verifica el modelo mental de los cuatro stakeholders core. Risky Agents report es de Identity Protection, que vive en Entra. AI observability es la página agregada de Purview para DSPM for AI. CloudAppEvents es la tabla KQL de Defender XDR.

**Variantes:**
- Añadir un quinto destino "Power Platform admin center" con elementos de Copilot Studio governance.
- Convertir en multiple-response: "¿Cuáles de estos componentes se gestionan en Microsoft Entra?"

---

## EX-03-001 · Escenario con cálculo · Difícil

**Módulo:** M03 · **OA:** OA-03.1, OA-03.4 · **Tipo:** Escenario · **Área:** 1

**Enunciado:**
Una organización tiene 1.200 empleados con licencia E5 + Microsoft 365 Copilot. La dirección quiere desplegar Agent 365 para gobernar 40 agentes Copilot Studio existentes. No prevén agentes autónomos. Necesitan: Risks column en el Registry, Conditional Access para agentes y Identity Protection para agentes.

¿Qué combinación de licencias cumple el requisito al menor coste mensual?

**Opciones:**

- A. 1.200 × Agent 365 standalone ($15) = $18.000/mes. Las 1.200 licencias E5 ya cubren el resto.
- B. 1.200 × M365 E7 ($99) = $118.800/mes.
- C. 1.200 × Agent 365 standalone ($15) + 1.200 × Entra Suite ($12) = $32.400/mes, pero la Risks column NO se obtiene.
- D. Migrar a M365 E7 los 1.200 usuarios para obtener todo en una sola SKU ($118.800/mes), justificado porque la Risks column requiere E7.

**Respuesta correcta:** D

**Justificación:** La **Risks column** del Agent Registry **solo aparece con M365 E7** (Frontier Suite). No se puede obtener añadiendo Agent 365 standalone a E5. La opción A no incluye Risks column. La opción C tampoco — la Entra Suite añade ID Protection P2 e Internet Access pero no la Risks column. La opción D es la única que cumple los tres requisitos (Risks column, CA, ID Protection P2). El sobrecoste de E7 vs E5+Copilot+Agent 365 standalone se justifica únicamente si se necesita la Risks column.

**Variantes:**
- Cambiar el requisito "necesitan Risks column" por "necesitan CA y ID Protection pero NO Risks column" (la respuesta cambia a A + Entra Suite).
- Cambiar a 200 usuarios y comparar break-even.
- Añadir la dimensión de consumo (40 agentes × 200k mensajes/mes en Copilot Credits → calcular Pre-Purchase Plan P3).

---

## EX-06-001 · Multiple choice · Media

**Módulo:** M06 · **OA:** OA-06.1 · **Tipo:** Multiple choice · **Área:** 2

**Enunciado:**
Microsoft Entra Agent ID introduce cuatro tipos de objetos nuevos. ¿Cuál de las siguientes afirmaciones describe correctamente la relación entre **agent identity** y **agent user**?

**Opciones:**

- A. Una agent identity puede tener varias agent users asociadas para escenarios multi-tenant.
- B. Existe relación 1:1 entre agent identity y agent user; el agent user es la cuenta Entra emparejada que da al agente presencia (mailbox, Teams, organización chart).
- C. La agent user es el creador humano del agente; la agent identity es el service principal.
- D. Son sinónimos: ambos términos se refieren al mismo objeto en el directorio.

**Respuesta correcta:** B

**Justificación:** La relación **agent identity ↔ agent user es 1:1 (parent-child)**. El agent user es una cuenta de usuario Entra emparejada con la identidad para que el agente, cuando opera con own identity (autónomo), pueda tener mailbox, presencia en Teams, aparecer en el organigrama y un nombre principal único `agent@yourtenant.onmicrosoft.com`. La opción C confunde con el sponsor humano. La D es un error conceptual común.

**Variantes:**
- Reformular sobre la relación blueprint ↔ blueprint principal.
- Reformular sobre blueprint ↔ agent identity (relación 1:N: un blueprint genera múltiples identidades).
- Convertir en drag-and-drop emparejando los 4 tipos con sus descripciones.

---

## EX-06-002 · Código (Microsoft Graph) · Difícil

**Módulo:** M06 · **OA:** OA-06.5 · **Tipo:** Multiple choice (con código) · **Área:** 2

**Enunciado:**
Tras la convergencia de mayo 2026, los administradores listan las identidades de agentes mediante Microsoft Graph. Examina la siguiente petición y selecciona la afirmación correcta:

```
GET https://graph.microsoft.com/beta/auditLogs/signIns
?$filter=signInEventTypes/any(t: t eq 'servicePrincipal') 
  and agent/agentType eq 'AgentIdentity'
```

**Opciones:**

- A. La query es válida y devuelve sign-ins de identidades de agente; la propiedad `agentType` con valor `AgentIdentity` filtra agent identities (excluyendo blueprint principals).
- B. La query no es válida porque `signInEventTypes` no admite el filtro `any` desde la migración de mayo 2026.
- C. La query es válida pero devuelve sign-ins de **todos** los service principals (humanos delegados incluidos), porque el filtro `agentType` se ignora silenciosamente.
- D. La query debe usar el endpoint legacy `/beta/agentRegistry/agentInstances` que sigue siendo válido para sign-in logs.

**Respuesta correcta:** A

**Justificación:** Es la query correcta para listar sign-ins de agent identities desde mayo 2026. `signInEventTypes/any(t: t eq 'servicePrincipal')` filtra eventos de service principals; `agent/agentType eq 'AgentIdentity'` filtra los que son agent identities (no blueprint principals). La opción D es un distractor crítico: el endpoint `/beta/agentRegistry/...` se **retiró** el 1 de mayo de 2026 y se sustituyó por `/beta/copilot/admin/...`.

**Variantes:**
- Pedir completar el filtro: dado el endpoint, qué falta para excluir los blueprint principals.
- Reformular como troubleshooting: "esta query devuelve 0 resultados, ¿qué falta?".
- Cambiar `AgentIdentity` por `AgentUser` (respuesta cambia: filtra los agent users emparejados).

---

## EX-06-003 · Escenario complejo · Difícil

**Módulo:** M06 · **OA:** OA-06.2, OA-06.4 · **Tipo:** Multiple response · **Área:** 2

**Enunciado:**
Una empresa va a desplegar un agente autónomo (own identity) que cada mañana resume las menciones a la marca en redes sociales y publica el resumen en un canal de Teams. El agente debe poder leer un servicio externo (no Microsoft) y escribir en Teams. La empresa quiere que: (i) el agente tenga sponsor; (ii) si el sponsor cambia de rol, la sponsorship se transfiera automáticamente al manager; (iii) los permisos a Teams sean heredables del blueprint, no asignados manualmente a cada identidad.

**¿Qué tres elementos deben configurarse?** (Selecciona los tres correctos)

**Opciones:**

- A. Agent identity blueprint con `inheritable permissions` configuradas con scope `TeamsActivity.Send` (enumerated).
- B. Agent sponsorship asignada al usuario que actuará como sponsor.
- C. Lifecycle workflow con tarea "Reassign sponsorship to manager on leaver event".
- D. Conditional Access policy con scope `All agent users` y grant `Block` por agent risk.
- E. Custom security attribute `BusinessOwner = MarketingDept` aplicado a la agent identity.
- F. Admin consent en el blueprint principal para permisos de aplicación.

**Respuesta correcta:** A, B, C

**Justificación:**
- **A** cubre el requisito (iii): inheritable permissions a nivel blueprint en patrón enumerated (max 10 resource apps × 40 scopes).
- **B** cubre el requisito (i): asignar sponsor.
- **C** cubre el requisito (ii): el lifecycle workflow es el mecanismo que reasigna automáticamente al manager cuando el sponsor sufre un evento de leaver.
- D es un distractor plausible (CA es importante) pero no responde a ninguno de los tres requisitos.
- E es opcional para segmentación, no obligatorio.
- F es necesario operativamente pero no es uno de los tres requisitos planteados.

**Variantes:**
- Convertir en escenario de diseño abierto donde el alumno propone los pasos.
- Cambiar a OBO en lugar de own identity (la respuesta cambia: ya no aplica el agent user).
- Añadir requisito (iv) "el agente debe tener acceso solo durante horario de oficina" → respuesta extra con CA scope All agent identities + condition Sign-in frequency.

---

## EX-08-001 · Ordenamiento · Media

**Módulo:** M08 · **OA:** OA-08.6 · **Tipo:** Ordenamiento · **Área:** 3

**Enunciado:**
Ordena las siguientes acciones para desplegar correctamente un agente Copilot Studio nuevo a un grupo piloto de 10 usuarios, aplicando una Custom Template con políticas de DLP, partiendo del momento en que el creador termina la build del agente.

**Pasos a ordenar:**
1. Aplicar Custom Template seleccionando políticas extra de Purview (DLP) y Entra (Access Package).
2. Conceder admin consent para los OAuth grants pendientes del agente.
3. El admin de Agent 365 abre el wizard de publishing desde Microsoft 365 admin center → Agents.
4. Activate del agente (los usuarios pueden crear instancias).
5. Deploy del agente al grupo piloto (instalación automática para los 10 usuarios).
6. El creador completa la submission del agente desde su entorno Copilot Studio.

**Respuesta correcta:** 6 → 3 → 1 → 2 → 4 → 5

**Justificación:** La submission del creador es el primer paso (6). El admin abre el wizard para revisar (3). Aplica la Custom Template antes de continuar (1). Concede admin consent a los permisos solicitados por el agente (2). Hace Activate para permitir que los usuarios creen instancias (4). Hace Deploy al grupo piloto para instalación automática (5). Sin Activate antes de Deploy, los usuarios pueden recibir el agente pero no instanciarlo correctamente.

**Variantes:**
- Cambiar Custom Template por Default Template (se elimina el paso 1 explícito).
- Cambiar el grupo piloto a "todos los usuarios" → cambia a Pin después de Deploy.
- Añadir un paso de Block tras Deploy (escenario de retirada controlada).

---

## EX-09-001 · Escenario diseño · Difícil

**Módulo:** M09 · **OA:** OA-09.3, OA-09.4 · **Tipo:** Multiple choice · **Área:** 2

**Enunciado:**
El equipo de seguridad quiere aplicar Conditional Access a las identidades de agentes pero no quiere romper agentes legítimos en producción durante el rollout. Diseña la política con el enfoque más prudente:

**Opciones:**

- A. Crear una política CA con scope **All agent users**, target **All resources**, condición **Agent risk: High**, grant **Block**, modo **enforced** desde el inicio. Es la única forma de garantizar protección inmediata.
- B. Crear una política CA con scope **All agent identities**, target **All resources**, condición **Agent risk: High**, grant **Block**, modo **Report-only** durante 2 semanas; revisar Sign-in logs > Agent sign-ins, validar que solo se loguean agentes auténticamente arriesgados, después pasar a **enforced**.
- C. Crear una política CA con scope **All users**, condición **MFA required**, modo **enforced**. Las agent identities heredarán la política y se bloquearán por no poder hacer MFA.
- D. No crear ninguna política CA; basta con activar Identity Protection P2 y dejar que las detecciones offline manejen el riesgo.

**Respuesta correcta:** B

**Justificación:** El enfoque correcto es **All agent identities** (no All agent users, que cubre las cuentas humanas emparejadas) + **Report-only durante un periodo de validación** + revisar Sign-in logs antes de pasar a enforced. La opción A es funcionalmente correcta en scope pero imprudente operativamente (rompe agentes legítimos sin validación previa). La C aplica MFA a todos los usuarios humanos (impacto masivo no relacionado). La D ignora que Identity Protection es complementaria a CA, no sustitutiva: las detecciones elevan el agent risk pero no bloquean por sí solas — necesitan una CA policy con grant Block.

**Variantes:**
- Pedir crear la política para **agent users** (cubrir el caso de agentes autónomos accediendo a recursos como humanos).
- Añadir condición Agent risk: Medium (con justificación de por qué Medium en algunos sectores).
- Reformular como troubleshooting: "la política no bloquea, ¿por qué?" (respuesta: enforcement aplica en token request del agente, no cuando el blueprint adquiere token).

---

## EX-11-001 · Multiple choice · Media

**Módulo:** M11 · **OA:** OA-11.6 · **Tipo:** Multiple choice · **Área:** 4

**Enunciado:**
Una entidad financiera regulada en la UE quiere documentar el cumplimiento de su despliegue de Agent 365 frente a marcos regulatorios aplicables. ¿Qué combinación de templates de Compliance Manager debería iniciar como assessments?

**Opciones:**

- A. EU AI Act + DORA + ISO 42001.
- B. NIST AI RMF + ISO 23894 + EU AI Act.
- C. EU AI Act + DORA + NIST AI RMF.
- D. ISO 42001 + ISO 23894 + DORA.

**Respuesta correcta:** A

**Justificación:** Para una entidad financiera regulada en la UE:
- **EU AI Act** es obligatorio (regulación europea horizontal sobre IA).
- **DORA** (Digital Operational Resilience Act) es obligatorio para entidades financieras europeas.
- **ISO 42001** (sistema de gestión de IA) es el estándar de referencia y proporciona controles operativos auditables.

Las opciones B y C incluyen NIST AI RMF, que es un framework voluntario estadounidense — útil pero no aplicable como cumplimiento normativo en la UE. La opción D omite EU AI Act, que es no negociable en la UE.

**Variantes:**
- Cambiar la jurisdicción (entidad sanitaria en EE. UU. → NIST AI RMF + HIPAA + ISO 23894).
- Reformular como multiple-response: "¿cuáles 3 templates son obligatorios?" vs "cuáles son recomendables".
- Cambiar el sector (telecomunicaciones, retail, sector público).

---

## EX-12-001 · KQL completion · Difícil

**Módulo:** M12 · **OA:** OA-12.1, OA-12.6 · **Tipo:** KQL completion · **Área:** 5

**Enunciado:**
Un analista del SOC quiere identificar los 5 usuarios que han desencadenado más invocaciones de tools (cualquier ExecuteTool*) en agentes durante las últimas 24 horas. Completa la query KQL con las dos partes faltantes:

```kql
CloudAppEvents
| where Timestamp > ago(24h)
| where ActionType in ("________________________________________________")  // ← parte 1
| summarize InvocationCount = count() by AccountObjectId
| top 5 by InvocationCount desc
| project AccountObjectId, InvocationCount
| ________________________________________________  // ← parte 2 (enriquecer con nombre del usuario)
```

**Opciones para la parte 1:**

- A. `"InvokeAgent", "InferenceCall"`
- B. `"ExecuteToolBySDK", "ExecuteToolByGateway", "ExecuteToolByMCPServer"`
- C. `"ExecuteToolBySDK", "ExecuteToolByGateway"`
- D. `"AgentToolCall", "ExecuteAgentAction"`

**Opciones para la parte 2:**

- A. `join (IdentityInfo) on AccountObjectId | project AccountUserPrincipalName, InvocationCount`
- B. `extend UserName = AccountObjectId`
- C. `where AccountObjectId != "Anonymous"`
- D. `summarize by AccountUserPrincipalName`

**Respuesta correcta:** Parte 1: B · Parte 2: A

**Justificación:**
- **Parte 1 (B):** las tres ActionTypes que representan ejecución de tools son `ExecuteToolBySDK`, `ExecuteToolByGateway` y `ExecuteToolByMCPServer`. La opción A son acciones de invocación de agente y de inferencia, no de tools. La D incluye nombres inventados.
- **Parte 2 (A):** para enriquecer con el UserPrincipalName desde el ObjectId hay que hacer `join` con la tabla `IdentityInfo` por `AccountObjectId`. La B simplemente renombra el campo. La C filtra anónimos pero no enriquece. La D es sintaxis errónea para esa intención.

**Variantes:**
- Cambiar el agregado a "top 5 agentes" en lugar de top 5 usuarios (cambia el `by`).
- Añadir filtro por agente específico (`where DeviceName == "agent-blueprint-id"`).
- Pedir completar 3 partes en lugar de 2 (añadir filtro temporal `bin(Timestamp, 1h)`).

---

## EX-15-001 · Troubleshooting tree · Difícil

**Módulo:** M15 · **OA:** OA-15.1, OA-15.2 · **Tipo:** Troubleshooting · **Área:** 5

**Enunciado:**
Un usuario reporta: "El agente que usaba ayer ya no aparece en mi lista. Mis compañeros del mismo departamento sí lo siguen viendo. No me sale ningún mensaje de error." Ordena los pasos del árbol de diagnóstico de mayor a menor probabilidad y capacidad de resolver el problema rápido:

**Pasos disponibles:**
1. Revisar M365 admin center → Agents → Registry → estado del agente: ¿sigue Activated/Deployed o ha sido Removed/Deleted?
2. Verificar en Entra admin center → Conditional Access → Sign-in logs > Agent sign-ins si hay bloqueos por la identidad del usuario.
3. Verificar en Defender → CloudAppEvents si hay alertas asociadas a la cuenta del usuario en las últimas 24 horas.
4. Revisar en M365 admin center → Agents → Registry → si el agente está Pinned y la propagación (hasta 6h) ha fallado para este usuario.
5. Verificar la licencia M365 Copilot del usuario en M365 admin center (asignación reciente, conflicto de SKU, etc.).
6. Revisar Power Platform admin center → DLP policies por si una política reciente excluye al usuario.

**Respuesta correcta (orden de probabilidad descendente):** 1 → 4 → 5 → 2 → 6 → 3

**Justificación:**
- **1 primero**: el síntoma "ya no aparece" sugiere un cambio de estado (Remove/Delete) — ocurrencia más frecuente y se verifica en 30 segundos.
- **4 segundo**: el agente puede haberse cambiado de Pin/Deploy y la propagación (hasta 6h) puede aún no haber llegado al usuario.
- **5 tercero**: pérdida de licencia M365 Copilot del usuario causa este síntoma exacto.
- **2 cuarto**: bloqueo por CA es posible pero menos común y requeriría que la política aplique a *agent users*, no al usuario humano. Que los compañeros lo vean apunta a problema individual no de política amplia.
- **6 quinto**: DLP de Power Platform puede excluir agentes pero raramente excluye solo a un usuario.
- **3 sexto**: alertas Defender son posibles pero serían visibles antes a través de otros canales (notificación al SOC).

**Variantes:**
- Cambiar el síntoma a "el agente da error 'You don't have access'" — el orden cambia (CA y DLP suben).
- Cambiar a "todo el departamento dejó de verlo" — orden cambia (1, 4, 6 suben; 5 baja).
- Convertir en decision tree visual (arrastrar nodos en jerarquía).

---

## Resumen del banco modelo

| ID | Módulo | Tipo | Dificultad | Bloom | Área |
|---|---|---|---|---|---|
| EX-01-001 | M01 | Multiple choice | Fácil | Comprender | 1 |
| EX-01-002 | M01 | Escenario | Media | Aplicar | 1 |
| EX-02-001 | M02 | Drag-and-drop | Fácil | Aplicar | 1 |
| EX-03-001 | M03 | Escenario+cálculo | Difícil | Evaluar | 1 |
| EX-06-001 | M06 | Multiple choice | Media | Analizar | 2 |
| EX-06-002 | M06 | Código (Graph) | Difícil | Analizar | 2 |
| EX-06-003 | M06 | Multiple response | Difícil | Crear | 2 |
| EX-08-001 | M08 | Ordenamiento | Media | Aplicar | 3 |
| EX-09-001 | M09 | Multiple choice | Difícil | Evaluar | 2 |
| EX-11-001 | M11 | Multiple choice | Media | Evaluar | 4 |
| EX-12-001 | M12 | KQL completion | Difícil | Aplicar | 5 |
| EX-15-001 | M15 | Troubleshooting tree | Difícil | Analizar | 5 |

**Distribución del banco modelo:**
- 7 tipos de pregunta diferentes representados (de los 7 totales del examen).
- 3 niveles de dificultad: 2 Fácil, 4 Media, 6 Difícil — ratio sesgado a Difícil para mostrar que las preguntas exigen comprensión profunda.
- 5 niveles de Bloom: Comprender, Aplicar, Analizar, Evaluar, Crear — todos representados.
- 5 áreas representadas (todas las del examen).
- 8 módulos cubiertos: M01, M02, M03, M06, M08, M09, M11, M12, M15.

**Cómo se construirán las 60 preguntas finales:** durante Fases 2-7, cada módulo aportará sus N preguntas siguiendo este patrón. El banco se almacena en `modulos/modulo-17-examen-certificacion/banco-preguntas.md` con cada pregunta completa (enunciado + opciones + respuesta + justificación + variantes + dificultad + OA).
