---
modulo: 15
tipo: laboratorios
titulo: "Laboratorios del Módulo 15"
duracion_total_min: 60
ultima_actualizacion: 2026-05-11
laboratorios:
  - id: LAB-15-1
    titulo: "Resolver un caso simulado de usuario que no puede invocar agente aplicando OBDED"
    duracion_min: 30
  - id: LAB-15-2
    titulo: "Detectar y remediar un audit log gap con reconciliación cruzada"
    duracion_min: 30
---

# Módulo 15 — Laboratorios

> Dos laboratorios prácticos centrados en resolución de problemas reales con el protocolo OBDED. Cada lab cubre uno de los dos escenarios más frecuentes en la operación cotidiana de Agent 365: problema de acceso a agente (LAB-15-1) y gap de audit log (LAB-15-2). Tiempo total: 60 minutos.
>
> **Prerrequisitos comunes:**
>
> - Tenant Microsoft 365 con Agent 365 activado.
> - Roles: `Security Reader` para Defender XDR, `Compliance Reader` para Purview, `Copilot Administrator` para CCS.
> - Al menos un agente activo y varios usuarios con licencia para simular incidencias.

---

## LAB-15-1 — Resolver un caso simulado de usuario que no puede invocar agente aplicando OBDED

**Duración:** 30 min · **Producto:** todos los portales (CCS, Defender XDR, Entra) · **OA:** OA-15.1, OA-15.5.

### Objetivo

Resolver un caso real reproducido con la disciplina del protocolo OBDED. El entregable es el ticket completo de soporte con las 5 fases documentadas: observación inicial, diagnóstico estructurado, ejecución de la resolución, validación de que el problema ya no se reproduce, documentación con causa raíz + lecciones aprendidas.

### Escenario simulado

Lunes 10:23 UTC. El usuario `maria.lopez@empresa.com` abre un ticket en ServiceNow:

> «Hola, este fin de semana podía usar el agente `Comercial-PriceBot` sin problemas pero esta mañana cuando intento invocarlo desde Outlook me sale el error "Agent unavailable". He intentado cerrar y abrir Outlook, cerrar sesión y reiniciar el equipo. Sigue igual. Tengo una llamada con un cliente a las 11:00 y necesito ese agente para preparar el material. Por favor, urgente».

Eres tier 1 del SOC y este ticket te ha sido asignado.

### Pasos

**Fase 1 — Observe (5 min)**

1. Lee el ticket completo. ¿Qué información tienes? ¿Qué falta?
2. Datos disponibles:
   - Usuario: `maria.lopez@empresa.com`.
   - Agente: `Comercial-PriceBot`.
   - Fecha del último uso exitoso: este fin de semana (probablemente sábado o domingo).
   - Cliente: Outlook.
   - Error: «Agent unavailable».
3. Datos a recopilar:
   - Departamento de María (para validar catalog policy).
   - Hora exacta de los intentos fallidos (para precisar la query KQL).
   - ¿Es la única persona afectada o hay más?
4. Anota los datos en el ticket. El simple acto de listar lo que sabes y lo que no sabes ya estructura el diagnóstico.

**Fase 2 — Diagnose (10-15 min)**

5. Aplica el árbol de decisión del módulo:

   **Paso 1 — Licencia Copilot**: CCS → License management → busca `maria.lopez@empresa.com`. ¿Tiene licencia activa? *(asume que sí, ese check fue OK)*
   
   **Paso 2 — Catalog policy**: CCS → Agent governance → policy aplicada a Marketing (María es de Marketing). ¿Está `Comercial-PriceBot` en allowlist? *(asume que sí, ese check fue OK)*
   
   **Paso 3 — Agente activo**: CCS → Agent governance → busca `Comercial-PriceBot` → status. *(asume que está `Disabled`)*
   
   ✓ El árbol se detiene en el paso 3: el agente está deshabilitado. Confirmado el síntoma, pero todavía falta la causa raíz.

6. Aplica el diagnóstico de la sección 15.3 — agente deshabilitado tiene 4 causas comunes. Ejecuta en Advanced Hunting:

   ```kql
   let agentId = "Comercial-PriceBot";
   CloudAppEvents
   | where Application == "Microsoft Agent 365"
   | where AgentId == agentId
   | where Timestamp >= ago(72h)
   | where ActionType in ("AgentDisabled", "AgentSecretRotated", "AgentBlueprintDeprecated")
   | project Timestamp, ActionType, AccountUpn,
             Reason = tostring(parse_json(RawEventData).reason),
             AutomationName = tostring(parse_json(RawEventData).automationName)
   | order by Timestamp desc
   ```

7. *(asume el resultado)*: aparece un evento del domingo a las 23:47:
   - `Timestamp`: 2026-05-10 23:47 UTC.
   - `ActionType`: `AgentDisabled`.
   - `Reason`: `Automation triggered: pattern AnomalousAgentInvocationVolume`.
   - `AutomationName`: `pb-Agent365-Compromise-Containment`.

   **Causa raíz identificada**: una custom detection rule de Defender XDR detectó volumen anómalo de invocaciones del agente el domingo por la noche y el playbook automatizado deshabilitó el agente.

8. **Pregunta clave antes de Execute**: ¿es un falso positivo o un evento real? El módulo M15 sección 15.3.4 alerta: «NUNCA re-habilitar inmediatamente sin investigar».
   
   Investigación adicional:
   - Defender XDR → Incidents → busca incident relacionado con `Comercial-PriceBot` del domingo.
   - Revisa el detalle: ¿qué patrón se detectó? ¿desde qué IPs? ¿quién invocó?
   - *(asume el resultado)*: el incident muestra que el sábado por la tarde y domingo, varios usuarios de Comercial-Iberia invocaron el agente con frecuencia alta (campaña de cierre de trimestre); el patrón era legítimo aunque atípico.

**Fase 3 — Execute (5 min)**

9. Coordina con el SOC tier 2 la confirmación de que el incident es FP.

10. Re-habilita el agente:
    - CCS → Agent governance → `Comercial-PriceBot` → Enable.
    - Notifica al owner del agente del re-enable con motivo.

11. Ajusta la custom detection rule para evitar reincidencia:
    - Defender XDR → Hunting → Custom detection rules → `AnomalousAgentInvocationVolume`.
    - Threshold actual: 5x baseline. Considera subirlo a 8x baseline o añadir excepción para ventana de cierre de trimestre.
    - Quita la acción automática `Disable agent` hasta validar más datos (las acciones disruptivas requieren 2-3 meses con FP < 1 %).

**Fase 4 — Validate (5 min)**

12. Pide a María que intente invocar el agente de nuevo (notifícale por email cuando esté listo).
13. Verifica en Advanced Hunting que aparezcan invocaciones exitosas de María a `Comercial-PriceBot` en los siguientes 10 minutos.
14. Cierra el ticket en ServiceNow con la confirmación.

**Fase 5 — Document (5 min)**

15. Escribe el post-mortem en el ticket con esta estructura:
    - **Resumen**: agente deshabilitado por automation FP el domingo 23:47; re-habilitado el lunes 10:48; 21 horas de impacto a usuarios.
    - **Causa raíz**: custom detection rule con threshold demasiado bajo + acción automática disruptiva habilitada antes de validación suficiente.
    - **Resolución**: re-enable manual + ajuste de threshold + retirada temporal de acción automática.
    - **Lecciones aprendidas**: (1) las acciones disruptivas no deben automatizarse antes de 2-3 meses de validación con FP < 1 %, (2) las ventanas estacionales (cierre de trimestre, Black Friday, etc.) deben preverse en los thresholds.
    - **Acciones preventivas**:
      - Owner: equipo SOC.
      - Acción: revisar todas las custom rules con `Disable agent` automatizado y validar madurez. Fecha: dentro de 1 semana.
      - Acción: documentar calendario de eventos estacionales del negocio en el playbook de calibración de rules. Fecha: dentro de 2 semanas.

### Validación

- El ticket está cerrado con las 5 fases OBDED documentadas explícitamente.
- La causa raíz está identificada y diferenciada del síntoma reportado.
- El re-enable se hizo tras confirmar FP, no automáticamente.
- Hay acciones preventivas con owner y fecha objetivo.

### Variantes y extensiones

- Repetir el ejercicio con otro escenario: usuario no puede invocar agente por CA policy nueva (paso 4 del árbol).
- Repetir con escenario de blueprint deprecated (caso 3 de la sección 15.3).
- Construir el playbook de comunicación al usuario afectado durante el incident (qué decir, cuándo, qué información compartir).

---

## LAB-15-2 — Detectar y remediar un audit log gap con reconciliación cruzada

**Duración:** 30 min · **Producto:** CCS Telemetry + Purview audit log + Defender XDR · **OA:** OA-15.4.

### Objetivo

Aplicar la técnica de reconciliación cruzada para detectar un audit log gap simulado, identificar su causa raíz entre las 5 frecuentes documentadas, y remediarlo. El entregable es un reporte de reconciliación con la discrepancia detectada, la causa raíz identificada, las acciones tomadas y el plan preventivo.

### Escenario simulado

El responsable de gobernanza de IA, durante el ritual semanal del lunes, observa que el dashboard de CCS Telemetry reporta **38.420 invocaciones** del agente `comercial-pricebot` la semana pasada. El analista del SOC, comprobando independientemente en Defender XDR Advanced Hunting, encuentra **34.108 invocaciones** del mismo agente en el mismo periodo. La discrepancia (4.312 invocaciones, 11 %) es mayor que el umbral aceptable de ±0.1 %.

### Pasos

1. **Confirma la discrepancia inicial** (5 min):
   - Ejecuta en Advanced Hunting la query de la sección 15.5.2:
     ```kql
     let weekStart = startofweek(ago(7d));
     let weekEnd = startofweek(ago(0d));
     let agentId = "comercial-pricebot";
     let ccs_count = 38420; // dato del dashboard CCS
     let defender_count = toscalar(
         CloudAppEvents
         | where Application == "Microsoft Agent 365"
         | where AgentId == agentId
         | where ActionType == "AgentInvoke"
         | where Timestamp between (weekStart .. weekEnd)
         | count
     );
     print
         CCS = ccs_count,
         DefenderXDR = defender_count,
         Discrepancia = ccs_count - defender_count,
         DiscrepanciaPct = round((ccs_count - defender_count) * 100.0 / ccs_count, 2)
     ```
   - Documenta los 3 números: CCS = 38.420, Defender XDR = 34.108, Discrepancia = 4.312 (11.22 %).

2. **Añade la tercera fuente — Purview audit log** (5 min):
   - Defender XDR → Hunting → Advanced hunting → query la tabla `AuditLogs` de Purview:
     ```kql
     let weekStart = startofweek(ago(7d));
     let weekEnd = startofweek(ago(0d));
     AuditLogs
     | where Service == "AgentService"
     | where Operation == "AgentInvoke"
     | where TimeGenerated between (weekStart .. weekEnd)
     | where AdditionalProperties has "comercial-pricebot"
     | count
     ```
   - *(asume el resultado)*: Purview reporta 38.420 invocaciones, idéntico a CCS.

3. **Analiza la discrepancia** (5 min):
   - Dos fuentes (CCS, Purview) coinciden en 38.420.
   - Una fuente (Defender XDR CloudAppEvents) reporta 34.108.
   - La discrepancia está en CloudAppEvents, no en CCS ni Purview.
   - Hipótesis: ¿latencia de ingestión? ¿filtro mal aplicado? ¿problema de configuración del connector?

4. **Diagnóstico de causa raíz** (5 min):
   - Revisa la configuración del data connector Microsoft Defender XDR en el portal:
     - Sentinel → Data connectors → Microsoft Defender XDR → Configuration.
     - *(asume el resultado)*: el connector tiene una desactivación parcial de eventos `AgentInvoke` aplicada en el filtro de ingestión, con motivo «reducción de coste de ingestión» aplicado por un admin anterior hace 2 meses.
   - **Causa raíz identificada**: configuración de ingestión filtrada que excluye un porcentaje de eventos AgentInvoke para reducir coste. La consecuencia operativa es un audit log incompleto en Defender XDR / Sentinel que comprometía la trazabilidad para auditoría regulatoria.

5. **Resolución** (5 min):
   - Acción inmediata: eliminar el filtro de ingestión y permitir captura completa de todos los eventos AgentInvoke.
   - Acción de cumplimiento: documentar el período del gap (2 meses) y los eventos potencialmente perdidos.
   - Para los eventos del período afectado: usar `AuditLogs` de Purview como fuente de verdad (que tiene los datos completos).
   - Coordinar con CFO para justificar el incremento de coste de ingestión vs el riesgo regulatorio de auditoría con datos incompletos.

6. **Reporte al comité central** (5 min):
   - Audit log gap > 1 % sostenido durante > 1 hora → material de reporting al comité central de gobernanza.
   - Email al responsable de gobernanza de IA con:
     - Discrepancia detectada y duración (2 meses).
     - Causa raíz: filtro de ingestión configurado para reducir coste.
     - Impacto regulatorio: trazabilidad parcial en Defender XDR durante el periodo; reconciliable con Purview audit log.
     - Acciones tomadas: filtro retirado; data complete a partir de hoy.
     - Plan preventivo:
       - Revisión trimestral de configuración del data connector con validación de no-filtros aplicados.
       - Reconciliación cruzada automatizada semanal entre las 3 fuentes con alerta cuando discrepancia > 0.5 %.
       - Política corporativa: cualquier cambio de configuración de ingestión requiere aprobación del comité central.

### Validación

- La discrepancia inicial está confirmada con las 3 fuentes consultadas.
- La causa raíz está identificada (filtro de ingestión aplicado al data connector).
- La resolución está ejecutada (filtro retirado).
- El reporte al comité central está enviado con plan preventivo concreto.

### Variantes y extensiones

- Construir el script de reconciliación automatizada semanal en Sentinel con alerta vía Logic App.
- Diseñar el procedimiento de respuesta a auditoría externa cuando descubre un gap histórico (qué decir al auditor, qué evidencia presentar, cómo justificar).
- Repetir el ejercicio con otra causa raíz: throttling de Microsoft Graph API durante un periodo de pico (los datos sí están en Purview pero faltaron temporalmente en CCS).

---

## Cierre

Tras los dos labs has tocado las dos competencias operativas centrales del troubleshooting Agent 365: aplicar OBDED a problemas de acceso (LAB-15-1) y reconciliar audit logs detectando gaps (LAB-15-2). El protocolo OBDED es generalizable a cualquier troubleshooting de la plataforma; las técnicas de reconciliación cruzada son aplicables a cualquier reporte que combine telemetría de múltiples fuentes.

Si quieres ir más allá:

- Construir la base de conocimiento operativo: documentar los 20-30 casos más frecuentes con su árbol de decisión y resolución canónica.
- Diseñar el plan de formación recurrente del SOC tier 1 con simulaciones mensuales de los casos canónicos.
- Implementar el dashboard operativo del SOC con KPIs propios: tickets abiertos, tiempo medio de resolución, FP rate, recurrencia de causas raíz.

El siguiente módulo (M16) cierra el temario con **costes, optimización y mejores prácticas** del programa Agent 365.
