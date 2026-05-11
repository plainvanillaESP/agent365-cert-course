---
modulo: 15
tipo: teoria
titulo: "Troubleshooting y operación cotidiana"
duracion_lectura_min: 45
ultima_actualizacion: 2026-05-11
objetivos_aprendizaje:
  - id: OA-15.1
    texto: "Diagnosticar problemas de acceso a agentes (usuario que no puede invocar, agente que falla en ejecución) siguiendo un árbol de decisión estructurado de 4 niveles."
    bloom: Aplicar
  - id: OA-15.2
    texto: "Resolver casos de agentes deshabilitados inesperadamente identificando las cuatro causas más comunes (CA policy nueva, secret expirado, blueprint deprecated, security automation)."
    bloom: Aplicar
  - id: OA-15.3
    texto: "Operar el flujo de cierre de incidents en Defender XDR cuando hay obstáculos (entities unresolved, evidence missing, automation failures)."
    bloom: Aplicar
  - id: OA-15.4
    texto: "Detectar y remediar gaps en audit logs con técnicas de reconciliación cruzada CloudAppEvents + Purview audit + CCS telemetry."
    bloom: Analizar
  - id: OA-15.5
    texto: "Aplicar el protocolo canónico OBDED de troubleshooting: observar → diagnosticar → ejecutar → validar → documentar, asegurando trazabilidad y aprendizaje organizativo."
    bloom: Aplicar
---

# Módulo 15 — Troubleshooting y operación cotidiana

> **Duración estimada de lectura:** 45 minutos.
>
> **Prerrequisitos:** M01, M06, M09, M10, M11, M12, M13.
>
> Los módulos previos cubren el diseño, despliegue, gobernanza y monitorización de Agent 365. M15 cubre **lo que sucede cuando algo va mal**: las situaciones cotidianas con las que el equipo operativo se encuentra y los protocolos canónicos para resolverlas. La diferencia entre un equipo operativo maduro y uno improvisado no es tener menos problemas (los tienen los dos) sino resolverlos con eficacia, dejar trazabilidad y aprender para evitar reincidencias.

---

## 15.1 El protocolo canónico OBDED

Antes de entrar en casos específicos, el protocolo general que aplica a cualquier troubleshooting de Agent 365: **OBDED** (Observe → Diagnose → Execute → Document).

### 15.1.1 Las cinco fases

| Fase | Pregunta que responde | Tiempo objetivo |
|---|---|---|
| **Observe** | ¿Qué se está reportando exactamente? ¿Es un síntoma o el problema? | 5-10 min |
| **Diagnose** | ¿Cuál es la causa raíz? ¿Qué hipótesis explica todos los síntomas? | 10-30 min |
| **Execute** | ¿Qué acción soluciona la causa raíz sin introducir nuevos problemas? | 5-30 min |
| **Validate** | ¿La acción funcionó? ¿El síntoma original ya no se reproduce? | 5-15 min |
| **Document** | ¿Qué aprendimos? ¿Cómo evitamos esto en el futuro? | 10-15 min |

Saltarse fases es el error más común. Los dos saltos más caros: ir directamente a Execute sin Diagnose (genera más problemas que resuelve), y cerrar el ticket sin Document (la organización no aprende y el caso se repite).

### 15.1.2 La regla del 80/20 del troubleshooting

El 80 % del tiempo total se invierte típicamente en Observe + Diagnose. Solo el 20 % en Execute. Los equipos junior invierten lo contrario y producen rework constante. La inversión correcta de tiempo en diagnóstico previene el rework.

### 15.1.3 Cuándo escalar

Reglas de escalado al tier 2 / tier 3:

- **Tier 1 → Tier 2**: el diagnóstico inicial no converge en 30 minutos, o el caso afecta a > 10 usuarios simultáneamente.
- **Tier 2 → Tier 3**: el caso involucra arquitectura cross-tenant, regulación o requiere modificar políticas globales.
- **Tier 3 → Microsoft Support**: el caso parece bug del producto, no error operativo de la organización.

Escalar tarde es el segundo error más común tras saltarse Diagnose. Mejor escalar a tiempo con datos parciales que escalar tarde con todo el ticket completo.

---

## 15.2 Problemas de acceso a agentes

### 15.2.1 Síntomas y árbol de decisión

El síntoma más reportado en Agent 365: «no puedo invocar el agente X». Detrás hay típicamente una de cuatro causas concretas. El árbol de decisión:

```
[Usuario reporta: "no puedo invocar el agente X"]
                    │
                    ▼
1. ¿Tiene el usuario licencia Copilot 365 activa?
   ├── No → asignar licencia desde CCS → resuelto
   └── Sí ↓
                    │
                    ▼
2. ¿Está el usuario en el scope de la catalog policy para ese agente?
   ├── No → revisar política Curated o Approval-based → ajustar policy o crear ticket
   └── Sí ↓
                    │
                    ▼
3. ¿Está el agente activo (no deshabilitado)?
   ├── No → (sección 15.3 — agente deshabilitado)
   └── Sí ↓
                    │
                    ▼
4. ¿Hay Conditional Access bloqueando la sesión?
   ├── Sí → revisar CA policy aplicada (sign-in log de Entra ID)
   └── No → escalar a tier 2 con todos los datos recopilados
```

Recorrer este árbol completo lleva 5-10 minutos en la mayoría de casos. Saltar directamente al paso 4 sin verificar los anteriores es el patrón típico de troubleshooting improvisado.

### 15.2.2 Diagnóstico con KQL

Una query KQL única que devuelve todo el contexto para el diagnóstico:

```kql
let userUpn = "user@empresa.com";
let agentId = "agent-comercial-pricebot";
let lookback = ago(1h);
union
  (SigninLogs
   | where UserPrincipalName == userUpn
   | where TimeGenerated >= lookback
   | project Source = "SigninLogs", TimeGenerated, ResultType, ConditionalAccessStatus, AppDisplayName),
  (CloudAppEvents
   | where Application == "Microsoft Agent 365"
   | where AccountUpn == userUpn
   | where AgentId == agentId
   | where Timestamp >= lookback
   | project Source = "CloudAppEvents", TimeGenerated = Timestamp, ResultType = ActionType, ConditionalAccessStatus = "", AppDisplayName = "Agent 365")
| order by TimeGenerated desc
```

Devuelve todos los intentos de sign-in del usuario y todos los eventos de Agent 365 en la última hora. Si no aparecen eventos de Agent 365, el problema es upstream (licencia, CA o catalog policy). Si aparecen eventos con `ActionType` de fallo, el detalle está en el `ResultType`.

### 15.2.3 Casos específicos frecuentes

| Causa raíz | Síntoma adicional | Resolución |
|---|---|---|
| Licencia no asignada | Error en cliente: «You don't have a Copilot license» | CCS → License management → asignar licencia. Toma efecto en 5-15 min |
| Catalog policy denegada | Error: «This agent is not available for your group» | Revisar policy en CCS Agent governance; ajustar allowlist o crear ticket Approval-based |
| Agente deshabilitado | Error: «Agent unavailable» | Sección 15.3 |
| CA bloqueando | Sign-in log con `ResultType = 53003` (blocked by CA) | Revisar CA policies aplicadas; típicamente requiere device compliance o location matching |
| Token expirado | Error: «Authentication required» o silenciosamente fail | Forzar nuevo sign-in al usuario; revisar token lifetime policy |
| Throttling temporal | Error: «Service temporarily unavailable, retry in N seconds» | Esperar y retry; si persiste > 30 min, escalar a Microsoft Support |

---

## 15.3 Agentes deshabilitados inesperadamente

### 15.3.1 Las cuatro causas más comunes

Cuando un agente que estaba funcionando deja de hacerlo súbitamente, la causa raíz es casi siempre una de cuatro:

| # | Causa | Síntoma característico | Cómo confirmarla |
|---|---|---|---|
| 1 | **Conditional Access policy nueva** | Solo afecta a usuarios bajo ciertas condiciones (ubicación, dispositivo) | Sign-in log de Entra ID con `ResultType = 53003` |
| 2 | **Client secret o certificado expirado** | Afecta a todos los usuarios simultáneamente; el agente devuelve 401 | Entra admin center → App registrations → Certificates & secrets |
| 3 | **Blueprint deprecated** | El agente está marcado como `deprecated` en el catálogo de Agent 365 | CCS Agent governance → status del agente |
| 4 | **Security automation activó disable** | Custom detection rule de Defender XDR ejecutó `Disable agent` automáticamente | Defender XDR incident con acción `Agent disabled by automation` |

### 15.3.2 Diagnóstico paso a paso

```kql
let agentId = "agent-comercial-pricebot";
let lookback = ago(24h);
// Caso 4: deshabilitación por security automation
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where AgentId == agentId
| where Timestamp >= lookback
| where ActionType in ("AgentDisabled", "AgentSecretRotated", "AgentBlueprintDeprecated")
| project Timestamp, ActionType, AccountUpn,
          DisableReason = tostring(parse_json(RawEventData).reason),
          DisableAutomation = tostring(parse_json(RawEventData).automationName)
| order by Timestamp desc
```

Si la query devuelve eventos de tipo `AgentDisabled`, se puede leer la razón directamente del campo `reason` y, si aplica, el nombre de la automation que lo deshabilitó.

### 15.3.3 Resolución por caso

| Causa | Resolución inmediata | Resolución preventiva |
|---|---|---|
| 1. CA policy nueva | Revisar CA policy con responsable de seguridad; añadir excepción si aplica o ajustar condiciones | Notificación obligatoria al equipo de adopción ante cambios de CA que afecten a agentes |
| 2. Secret expirado | Generar nuevo secret en Entra; actualizar en blueprint config | Calendar reminder 30 días antes de cada vencimiento de secret; rotación trimestral programada |
| 3. Blueprint deprecated | Migrar a la versión nueva del blueprint o seleccionar alternativo | Suscripción al feed de deprecation announcements de Microsoft; review trimestral |
| 4. Security automation | Si es falso positivo: re-enable manual + ajustar threshold de la rule; si es real: investigar incident con SOC | Calibración de custom detection rules antes de habilitar disable automático (2-3 meses con FP < 1 %) |

### 15.3.4 Cuándo NO re-habilitar inmediatamente

La tentación operativa es re-habilitar el agente lo antes posible para minimizar impacto al usuario. Eso es correcto en casos 1 y 3 (CA policy y blueprint deprecated). En casos 2 y 4 requiere disciplina adicional:

- **Caso 2 (secret expirado)**: rotar y re-habilitar inmediatamente está bien, pero documentar la causa de la expiración (¿se olvidó la rotación? ¿procedimiento no funcionaba?) para no repetir.
- **Caso 4 (security automation)**: NUNCA re-habilitar inmediatamente sin investigar. La automation se disparó por algo. Confirmar con el SOC que el evento es FP antes de re-habilitar. Re-habilitar agentes deshabilitados por automation sin investigar es el patrón más peligroso del módulo.

---

## 15.4 Incidents de Defender XDR que no se cierran

### 15.4.1 Obstáculos comunes

Tres situaciones impiden cerrar un incident correctamente:

- **Entities unresolved**: el incident referencia un AgentId, AccountUpn o IP que no se ha podido resolver completamente.
- **Evidence missing**: el SOC tier 2 no encuentra los logs necesarios para confirmar o descartar la hipótesis.
- **Automation failures**: el playbook que debía ejecutar la contención falló parcialmente y dejó el incident en estado inconsistente.

### 15.4.2 Entities unresolved

Si una entity (especialmente AgentId) aparece como «Unresolved», el incident no se puede cerrar limpiamente. Causas frecuentes:

| Causa | Resolución |
|---|---|
| Agent fue eliminado del tenant durante la investigación | Documentar en post-mortem como «agent removed during investigation»; mantener evidencia archivada |
| AccountUpn fue eliminado (usuario salió de la organización) | Reconstruir contexto desde logs históricos; documentar en post-mortem |
| IP no resoluble por DNS reverso | Aceptable; la IP en bruto es suficiente para el post-mortem |
| Mismatch entre AgentId reportado por Defender y AgentId en CCS | Bug de sincronización; abrir caso con Microsoft Support |

### 15.4.3 Evidence missing

Cuando los logs necesarios para confirmar una hipótesis no aparecen:

1. **Verifica retención**: ¿el periodo del evento está dentro de los 30 días de retención de Defender XDR?
2. **Verifica Sentinel LTR**: si el evento es de hace > 30 días, ¿el LTR de Sentinel lo retuvo?
3. **Verifica Purview audit log**: el audit log de Purview es independiente y puede tener el dato cuando CloudAppEvents no.
4. **Verifica logs en cliente**: para invocaciones desde aplicaciones cliente (Word, Excel), los logs del cliente pueden complementar.

Si tras los 4 pasos el dato sigue ausente, el incident se cierra con anotación: «evidence partial; closed based on available data» con justificación documentada. Es preferible a un cierre forzado sin trazabilidad.

### 15.4.4 Automation failures

Cuando un playbook falla parcialmente:

- **Síntoma**: el incident tiene comentarios del tipo «Step 3 failed: timeout calling Graph API».
- **Diagnóstico**: revisar el Logic App execution history; identificar el step exacto que falló y por qué.
- **Resolución manual**: ejecutar los steps fallidos manualmente desde el portal correspondiente (Graph Explorer, CCS, Defender XDR).
- **Resolución preventiva**: añadir retry policies a los Logic Apps; añadir alerting cuando un playbook falla > 2 veces consecutivas; testear playbooks trimestralmente con eventos sintéticos.

---

## 15.5 Audit log gaps

### 15.5.1 Síntomas

Un audit log gap se sospecha cuando:

- El total de invocaciones reportado en CCS Telemetry no coincide con el conteo de `AgentInvoke` en `CloudAppEvents`.
- Un usuario reporta haber usado un agente «esta mañana» y no aparece nada en el audit log para ese usuario en esa franja.
- Una auditoría externa pide evidencia de un evento concreto y no se encuentra.

### 15.5.2 Reconciliación cruzada

El método canónico para detectar y remediar gaps es la reconciliación cruzada entre tres fuentes que deben coincidir:

```kql
// Fuente 1: CCS Telemetry (agregada)
let ccs_count = toscalar(
    CloudAppEvents
    | where Application == "Microsoft Agent 365"
    | where ActionType == "AgentInvoke"
    | where Timestamp between (startofday(ago(1d)) .. endofday(ago(1d)))
    | count
);
// Fuente 2: Purview audit log (independiente)
let purview_count = toscalar(
    AuditLogs
    | where Service == "AgentService"
    | where Operation == "AgentInvoke"
    | where TimeGenerated between (startofday(ago(1d)) .. endofday(ago(1d)))
    | count
);
// Fuente 3: Defender XDR aggregated counter (UI)
// Se introduce manualmente como variable
let xdr_count = 4523;  // valor leído de la UI de Defender
print
    CCS = ccs_count,
    Purview = purview_count,
    DefenderXDR = xdr_count,
    Discrepancia = max_of(ccs_count, purview_count, xdr_count) - min_of(ccs_count, purview_count, xdr_count)
```

Los tres números deben coincidir en ±0.1 % (margen para timing de ingestión). Una discrepancia > 1 % es un gap real.

### 15.5.3 Causas frecuentes de gaps

| Causa | Detección | Resolución |
|---|---|---|
| Latencia de ingestión | Los datos llegan completos al cabo de 30 min | Esperar y re-validar |
| Configuración Purview audit no completa | El audit log de Purview no captura todas las operaciones | Revisar Audit configuration en Purview; activar todas las operaciones de Agent 365 |
| Throttling de Microsoft Graph API | Eventos perdidos por rate limiting | Microsoft Support; revisar service health |
| Time zone confusion en la query | El gap es artificial por mala query | Verificar UTC vs local time en `between (...)` |
| Bug de plataforma | Confirmado por Microsoft tras investigación | Microsoft Support; workaround temporal con datos del cliente |

### 15.5.4 Reporting de gaps a comité

Los gaps de audit log > 0.1 % sostenido durante > 1 hora son material de reporting al comité central de gobernanza por su impacto en auditoría regulatoria. El responsable de gobernanza de IA documenta cada gap detectado con causa, duración, impacto, acciones tomadas.

---

## Glosario de términos clave del módulo

| Término | Definición breve |
|---|---|
| **OBDED** | Protocolo canónico de troubleshooting: Observe → Diagnose → Execute → Validate → Document. |
| **Causa raíz** | El origen real del problema, distinguible del síntoma reportado por el usuario. |
| **Síntoma** | Lo que el usuario reporta, típicamente la manifestación visible del problema. |
| **Tier 1 / Tier 2 / Tier 3** | Niveles de escalado del SOC. T1 = primer contacto y casos comunes; T2 = casos complejos; T3 = arquitectura y bugs de plataforma. |
| **Árbol de decisión** | Estructura de preguntas binarias o categóricas que diagnóstica la causa raíz paso a paso. |
| **CA bloqueando (Conditional Access)** | Una de las 4 causas comunes: una policy de CA impide la sesión del usuario. |
| **Secret expirado** | Una de las 4 causas comunes: el client secret de la app registration del agente caducó. |
| **Blueprint deprecated** | Una de las 4 causas comunes: Microsoft marca un blueprint como obsoleto y deja de funcionar. |
| **Security automation disable** | Una de las 4 causas comunes: una custom detection rule deshabilitó el agente automáticamente. |
| **Entity unresolved** | Estado de un incident de Defender XDR donde una entidad referenciada no se puede resolver (agente eliminado, usuario salido, etc.). |
| **Evidence missing** | Situación donde los logs necesarios para confirmar una hipótesis no aparecen pese a estar dentro de la retención esperada. |
| **Reconciliación cruzada** | Técnica de validar el audit log comparando 3 fuentes (CCS, Purview, Defender XDR) que deben coincidir en ±0.1 %. |
| **Audit log gap** | Discrepancia > 1 % entre las 3 fuentes de audit; material de reporting al comité central. |

---

## Resumen del módulo

- El protocolo canónico de troubleshooting es OBDED: Observe → Diagnose → Execute → Validate → Document. Saltarse Diagnose o Document son los errores más comunes y caros.
- 80 % del tiempo se invierte en Observe + Diagnose. Solo 20 % en Execute. Equipos junior invierten al revés.
- Problemas de acceso a agentes se resuelven con árbol de decisión de 4 niveles: licencia → catalog policy → agente activo → Conditional Access.
- Agentes deshabilitados inesperadamente tienen 4 causas comunes: CA policy nueva, secret expirado, blueprint deprecated, security automation. Las dos últimas requieren disciplina (NO re-habilitar automation disables sin investigar).
- Incidents que no se cierran tienen 3 obstáculos típicos: entities unresolved, evidence missing, automation failures. Cada uno con resolución específica.
- Audit log gaps se detectan con reconciliación cruzada CCS + Purview + Defender XDR (deben coincidir ±0.1 %). Gaps > 1 % sostenido > 1 h son material de reporting al comité central.

## Hacia el módulo siguiente

M16 cierra el temario con **costes, optimización y mejores prácticas**: cómo gestionar el coste total del programa Agent 365, optimizar el uso de licencias y agentes, e incorporar las lecciones aprendidas al ciclo de mejora continua.
