---
modulo: 5
tipo: evaluacion
titulo: "Evaluación del Módulo 05"
duracion_min: 15
area_examen: 1
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
preguntas_oficiales: 1
caso_estudio: true
---

# Módulo 05 — Evaluación

> Una pregunta oficial del banco que el M05 aporta al examen final, más un caso de estudio extenso de refuerzo.

## Preguntas oficiales del banco

### EX-05-001 · Drag-and-drop · Media

**OA mapeado:** OA-05.2 · **Área:** 1 · **Bloom:** Aplicar

**Enunciado:**

Ordena los siguientes pasos en la **secuencia correcta** para activar Microsoft Agent 365 desde cero en un tenant productivo. El primer paso es el que se hace antes de tocar ningún admin center; el último es el que confirma que todo está operativo.

**Pasos a ordenar:**

1. Configurar el conector Microsoft 365 en Defender for Cloud Apps.
2. Verificar prerrequisitos: licencias asignadas, audit logs habilitados, rol Global Administrator o AI Administrator.
3. Activar Data Security Posture Management (DSPM) for AI en Microsoft Purview.
4. Aceptar Terms of Service la primera vez que se navega a `M365 admin → Agents`.
5. Lanzar un agente de prueba y verificar que aparece en los tres admin centers.
6. Activar el toggle Copilot Frontier en `M365 admin → Copilot → Settings → User access` (si aplica al caso).

<details>
<summary>Ver respuesta</summary>

**Secuencia correcta:**

| Posición | Paso |
|---|---|
| 1 | Verificar prerrequisitos |
| 2 | Activar el toggle Copilot Frontier (si aplica) |
| 3 | Aceptar Terms of Service en `M365 admin → Agents` |
| 4 | Configurar el conector Microsoft 365 en Defender |
| 5 | Activar DSPM for AI en Microsoft Purview |
| 6 | Lanzar un agente de prueba y verificar end-to-end |

**Justificación:** la activación tiene un orden estricto basado en dependencias. Sin verificar prerrequisitos, los siguientes pasos pueden fallar silenciosamente. Frontier toggle activa el modo preview (si la organización lo va a usar) y debe ser anterior a Terms of Service. Los Terms of Service son la puerta de entrada al workload: sin aceptarlos no se puede entrar al Overview ni configurar nada. Los conectores de Defender y Purview son dos pasos independientes entre sí, pero ambos requieren que el workload esté activo, por lo que van después de Terms of Service. La validación end-to-end es siempre el último paso: confirma que todo lo anterior funciona en cadena. Saltar el orden no rompe el sistema de inmediato pero deja huecos que aparecen como errores días después. Ver § 5.2.

</details>

---

## Caso de estudio (refuerzo)

> El caso de estudio no se evalúa pero refuerza la comprensión integral del módulo. Recomendado tras leer la teoría y antes de pasar al Módulo 06.

### Contexto

**Plain Coffee SL** termina la fase de planificación (módulos M03-M04 cubrieron decisión de licenciamiento y matriz de roles). Ahora Luis Ortega (Admin M365 lead, con AI Administrator + Agent ID Administrator + Billing Administrator) tiene que activar Agent 365 en el tenant productivo el lunes a las 9:00. La organización ha decidido:

- M365 E7 corporativo (todos los empleados).
- Frontier preview activado para 8 agentes autonomous de monitorización en cumplimiento normativo.
- Tres admin centers a configurar: M365, Defender XDR, Purview.
- Power Platform admin center también, para sincronizar Copilot Studio.

### Cronología del lunes

Luis sigue la teoría del módulo. Esto es lo que va ocurriendo:

- **09:00 — 09:10.** Verifica prerrequisitos: licencias E7 al 100 %, audit logs habilitados ya hace meses, su cuenta es AI Administrator, región Madrid (UE soportada). Todo OK.
- **09:10 — 09:25.** Activa Frontier toggle. Aparece advertencia de capacidades preview, acepta. Espera 5 minutos.
- **09:25 — 09:35.** Navega a `M365 admin → Agents`. Aparece el modal de Terms of Service. Acepta y entra al Overview. Las 4 hero metrics están a `0`. Todo correcto.
- **09:35 — 09:50.** Va a Defender XDR → Settings → Cloud Apps → App connectors. Añade Microsoft 365 connector con OAuth. El conector queda en estado «Connecting» durante 8 minutos y luego pasa a «Connected». Lanza una consulta KQL: la tabla `CloudAppEvents` está vacía. Asume que aún no hay actividad y sigue.
- **09:50 — 10:05.** Va a Purview → Solutions → DSPM for AI. Activa DSPM. Aparece mensaje de «First scan in progress, results in 15-30 minutes».
- **10:05 — 10:20.** Pausa para café.
- **10:20 — 10:30.** Vuelve y crea un agente de prueba `Test Agent 365 Setup` desde Microsoft 365 Copilot → Create agent. Lo publica al tenant.
- **10:30 — 10:35.** Le hace una pregunta de prueba al agente. El agente responde correctamente.
- **10:35 — 11:30.** Espera **una hora completa** y verifica:
  - **M365 admin center → Agents → Registry:** el agente aparece como Active con su nombre y owner. ✅
  - **Defender XDR → Hunting:** la consulta KQL `CloudAppEvents | where ActionType startswith "Agent"` devuelve **0 filas**.
  - **Purview → Activity explorer:** filtrando por «AI prompt», **0 filas**.

### Preguntas guiadas

1. **Diagnóstico.** Si el agente aparece en M365 admin center pero no en Defender ni en Purview, ¿qué falló y dónde lo verificas?

2. **Plan de acción.** Listar los pasos concretos que Luis debería ejecutar a partir de las 11:30 para resolver el problema, en orden.

3. **Prevención futura.** ¿Qué podía haber hecho Luis al activar para detectar el problema antes? ¿Qué señal temprana ignoró durante el flujo?

4. **Validación de cierre.** ¿Cuándo Luis puede dar el setup por completado y firmado? ¿Qué evidencias tiene que conservar para la auditoría interna?

### Solución comentada

<details>
<summary>Ver solución completa</summary>

**Pregunta 1 — Diagnóstico**

El agente aparece en el Registry de M365 (línea 1 funciona) pero no en Defender (línea 2 fallida) ni en Purview (línea 3 fallida). Hay dos problemas independientes:

- **Defender:** aunque el conector M365 muestra «Connected», la consulta KQL devuelve 0 filas tras una hora. El conector está conectado pero **el `audit log` aún no está propagando los eventos**. Luis pasó por alto la latencia inicial: en tenants nuevos o tras cambios mayores, los eventos pueden tardar **hasta 90 minutos** en aparecer la primera vez. Verificar en `Purview → Audit → Search` con `Operations: AgentInvocation` o similar.
- **Purview:** DSPM mostraba «First scan in progress, results in 15-30 minutes». **Han pasado ya 90 minutos** y debería tener resultados. Verificar en `Purview → DSPM for AI → Settings` el estado del primer scan; si sigue en progreso o falló, se reactiva manualmente.

**Pregunta 2 — Plan de acción a partir de las 11:30**

1. **Verificar el audit log** en `Purview → Audit → Search` con filtros: User = cuenta del agente (Service Principal), Operations = todas, fecha = hoy. Si aparecen eventos del agente aquí, el audit log funciona; el problema es solo de latencia hacia Defender.
2. **Esperar 30 minutos más** (total 90 minutos) y volver a lanzar la consulta KQL. Si sigue vacío, pasar al paso 3.
3. **Revisar el conector Microsoft 365 en Defender:** estado «Connected», último «scan» reciente, sin warnings. Si hay warnings, leer el detalle y resolver según indicaciones.
4. **Verificar permisos del conector OAuth.** A veces, la primera autenticación se completa pero faltan permisos de Reader sobre Exchange Online o SharePoint que se solicitaron pero no se concedieron.
5. **Reactivar DSPM for AI** desde `Purview → DSPM → Settings`. Si el primer scan falló silenciosamente, reactivar lo lanza de nuevo.
6. **Volver a interactuar con el agente** una segunda vez para generar más eventos y dar al sistema una segunda oportunidad de capturarlos.
7. **Si tras todo lo anterior nada llega a Defender ni Purview en 24h**, abrir ticket a Microsoft con tenant ID, hora del primer evento y hora de la consulta KQL.

**Pregunta 3 — Prevención**

Luis cometió un error y dejó pasar una señal temprana:

- **Error:** asumió que la consulta KQL vacía a las 09:50 era normal porque «aún no hay actividad». Pero ya había aceptado Terms of Service, que **es un evento auditable** y debería aparecer en `CloudAppEvents` con `ActionType` correspondiente al login de admin. Si esa primera consulta hubiera devuelto **0 filas para CUALQUIER actividad reciente del tenant** (no solo de agentes), Luis habría detectado que el conector estaba conectado pero los eventos no estaban llegando.
- **Señal ignorada:** la consulta inicial debería haber sido `CloudAppEvents | where TimeGenerated > ago(1h) | take 10`, sin filtrar por agentes. Si esa consulta devuelve filas, el conector funciona; si no, hay problema antes incluso de pensar en agentes.
- **Recomendación:** añadir un paso «Smoke test del audit log» entre el paso 4 y 5 del flujo de activación. Una sola consulta KQL genérica que confirma que los eventos están fluyendo, antes de seguir con DSPM y validación.

**Pregunta 4 — Validación de cierre**

Luis puede dar el setup por completado cuando:

- El agente de prueba aparece en los tres admin centers (M365 Registry, Defender CloudAppEvents, Purview Activity explorer).
- La consulta KQL `CloudAppEvents | where ActionType startswith "Agent"` devuelve resultados.
- DSPM dashboard muestra al menos un agente detectado.
- El audit log incluye tanto el `AgentTOSAccepted` como las invocaciones del agente de prueba.

**Evidencias para auditoría interna:**

- Captura de pantalla del Registry con el agente de prueba.
- Resultado de la consulta KQL (exportable como CSV desde Defender).
- Captura del DSPM dashboard.
- Export del audit log filtrado por `AgentTOSAccepted` y por las invocaciones del agente.
- Documento de timestamps: hora de cada paso del flujo de activación.

Estas evidencias se archivan en SharePoint con etiqueta de retención (Compliance Administrator) y se referencian en la próxima auditoría externa.

</details>

---

## Validación de aprendizaje

Antes de pasar al M06, el alumno debe poder responder sin notas:

- **¿Cuál es el orden correcto de activación?** Prerrequisitos → Frontier (si aplica) → Terms of Service → Overview → Defender connector → Purview DSPM → validación end-to-end.
- **¿Qué confirma que el setup está operativo?** Un agente trivial aparece en los tres admin centers en menos de 30 minutos (con margen hasta 90 minutos en tenants nuevos).
- **¿Qué hace si algo no aparece?** Ir al admin center concreto, revisar el conector específico, esperar la latencia inicial y, si persiste, abrir ticket con evidencias.
