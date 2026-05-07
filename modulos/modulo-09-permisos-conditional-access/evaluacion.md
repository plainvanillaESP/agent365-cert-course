---
modulo: 9
tipo: evaluacion
titulo: "Evaluación del Módulo 09"
duracion_min: 22
area_examen: 2
estado: producido
fase_produccion: 4
ultima_actualizacion: 2026-05-07
preguntas_oficiales: 7
caso_estudio: true
---

# Módulo 09 — Evaluación

> 7 preguntas oficiales del banco que el M09 aporta al examen final, más un caso de estudio extenso de Plain Coffee SL.

## Preguntas oficiales del banco

### EX-09-001 · Multiple choice · Media

**OA mapeado:** OA-09.1 · **Área:** 2 · **Bloom:** Analizar

**Enunciado:**

Un developer ha registrado un agente que monitoriza un buzón compartido (`pedidos@plaincoffee.es`) las 24 horas para abrir tickets en cuanto entra un email. El agente no responde a invocaciones de usuarios humanos: se ejecuta solo. ¿Qué tipo de permiso OAuth es el correcto para que acceda a ese buzón?

A) Delegated `Mail.Read`, asignando como usuario delegado a la cuenta `pedidos@plaincoffee.es`.
B) Application `Mail.Read`, con admin consent otorgado por un Cloud Application Administrator.
C) Delegated `Mail.ReadBasic.All`, suficiente porque el buzón es compartido.
D) Application `Mail.ReadWrite`, porque solo Application permite acceso continuado y `Read` por sí solo no incluye lectura completa.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** el agente opera sin usuario invocador (flujo `client_credentials`, own identity). Application Permission es el tipo correcto. La A es errónea: Delegated requiere un token de usuario activo en cada llamada y los buzones compartidos no son cuentas que se autentican por sí solas. La C confunde scope y tipo: `ReadBasic.All` se aplica a perfiles de usuario, no a contenido de buzones. La D inventa una limitación: `Mail.Read` Application sí cubre lectura completa de cualquier buzón del tenant. Ver § 9.1.

</details>

---

### EX-09-002 · Multiple choice · Media

**OA mapeado:** OA-09.1 · **Área:** 2 · **Bloom:** Analizar

**Enunciado:**

Un agente conversacional `Asistente-RRHH` se invoca desde Microsoft 365 Copilot por cualquier empleado. Está configurado con permiso **Delegated `Files.Read.All`**. La empleada Marta intenta pedirle un resumen del fichero `salarios-2026.xlsx`, al que ella no tiene acceso. ¿Qué responde el agente?

A) Devuelve el resumen: las Application Permissions del agente le permiten leer cualquier fichero del tenant.
B) Devuelve el resumen: `Files.Read.All` Delegated otorga acceso global mientras esté concedido el admin consent.
C) Devuelve un error de acceso o un mensaje de no encontrado: en flujo OBO el permiso efectivo es la intersección de los permisos de Marta y los del agente, y Marta no tiene acceso.
D) Devuelve el resumen pero registra el acceso como del agente, no de Marta.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** C

**Justificación:** el escenario describe un flujo Delegated (OBO): el agente actúa en nombre de Marta. El permiso efectivo en OBO es la **intersección** de lo que el agente puede hacer y de lo que Marta puede hacer. Como Marta no tiene acceso al fichero, el agente tampoco. La A confunde Application con Delegated: los permisos del enunciado son Delegated. La B es el error conceptual más común: Delegated `.All` indica el ámbito potencial del scope, no que sobrepase los permisos del usuario invocador. La D es falsa: el audit log atribuye correctamente el acceso al usuario humano en flujos OBO, no al agente. Ver § 9.1.

</details>

---

### EX-09-003 · Scenario · Difícil

**OA mapeado:** OA-09.3 · **Área:** 2 · **Bloom:** Crear

**Enunciado:**

Eres Conditional Access Administrator en Plain Coffee SL. Han desplegado seis agentes de finanzas etiquetados con el custom security attribute `Department: Finance` (M06 § 6.6). El CISO pide una política que aplique **solo a esos agentes** y que les **bloquee el acceso** cuando Identity Protection los marque como `High` agent risk. La política debe arrancar sin impactar producción y permitir 14 días de monitorización antes de enforcement. Indica la combinación de configuración correcta.

A) Scope `All users + All agent users` · Target `Office 365` · Conditions `User risk: High` · Grant `Block` · State `On`.
B) Scope `All agent identities` filtrado por `customSecurityAttributes.Department eq 'Finance'` · Target `All resources` · Conditions `Agent risk: High` · Grant `Block access` · State `Report-only`.
C) Scope `All agent identities` · Target `Microsoft Graph` · Conditions `Sign-in risk: High` · Grant `Require MFA` · State `On`.
D) Scope `All agent identities` filtrado por `Department: Finance` · Target `All resources` · Conditions `Agent risk: High, Medium, Low` · Grant `Block access` · State `Report-only`.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** la política debe (1) aplicar solo a los seis agentes, no a todos: filtro `customSecurityAttributes.Department eq 'Finance'` sobre `All agent identities`. (2) Proteger todos los recursos para que un compromiso no se escape por una app no contemplada: `All resources`. (3) Disparar solo en `High`, según pide el CISO. (4) Bloquear el acceso. (5) Empezar sin impacto: `Report-only`. La A es falsa: scope a usuarios y target Office 365 no protege a los agentes; condition `User risk` no detecta el riesgo del propio agente. La C requiere MFA, que no aplica a agentes que operan en own identity (no hay humano para hacer MFA). La D incluye Low y Medium, lo que dispararía falsos positivos masivos en el período Report-only y desconfiguraría el modelo. Ver § 9.3 y § 9.4.

</details>

---

### EX-09-004 · Multiple choice · Difícil

**OA mapeado:** OA-09.6 · **Área:** 2 · **Bloom:** Analizar

**Enunciado:**

Tienes una CA policy con scope `All agent identities`, conditions `Agent risk: High`, grant `Block`, estado `On`. Un usuario invoca un agente conversacional `Soporte-IT` que está marcado como `High risk`. El sign-in del usuario completa correctamente; el agente le responde con normalidad y no aparece como bloqueado en logs. ¿Cuál es la explicación más probable?

A) La policy ignora High risk si el invocador es un usuario humano.
B) El agente opera en flujo OBO; la CA policy de agent identities no aplica al sign-in OBO directamente. Aplicaría si el agente luego solicita su propio token (own identity).
C) Las CA policies para agentes solo aplican a agentes Foundry; los Copilot Studio están exentos por convergencia mayo 2026.
D) La policy está en Report-only sin que el admin lo recuerde.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** distinción crítica del módulo. El enforcement de CA aplica donde se solicita el token. En flujo OBO, el token que se intercambia es el del usuario humano: las policies de agente NO se evalúan sobre ese token. Si el agente, dentro de la operación, solicita un token propio (own identity vía `client_credentials`), entonces sí se evaluaría la policy de agent identities. La A es falsa: las CA policies no discriminan por tipo de invocador, sino por dónde se solicita el token. La C inventa una exención inexistente: la convergencia de mayo 2026 unificó precisamente todas las plataformas bajo Conditional Access. La D es plausible solo si no se ha verificado el estado, pero el enunciado dice claramente `On`. Ver § 9.3 (subsección *Diferencia importante de enforcement*).

</details>

---

### EX-09-005 · Multiple choice · Media

**OA mapeado:** OA-09.5 · **Área:** 2 · **Bloom:** Evaluar

**Enunciado:**

Tras investigar una alerta del Risky Agents report, tienes evidencia de que la agent identity `BotPedidos-Externos` ha sido comprometida (credenciales filtradas confirmadas en feed externo). Tu prioridad es bloquear su acceso ya. Tienes una CA policy `Block agents at high risk` activa con scope `All agent identities`, condition `Agent risk: High` y grant `Block`. ¿Qué acción ejecutas?

A) `Confirm compromise` desde el Risky Agents report. El risk del agente sube a `High` inmediatamente y la CA policy bloquea el siguiente sign-in.
B) `Disable` desde la página de la agent identity. Solo Disable corta el acceso al instante.
C) `Dismiss` para archivar la alerta y dejar tiempo a investigar la causa raíz antes de actuar.
D) Editar la CA policy y añadir el `appId` del agente a `Exclude`.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** A

**Justificación:** la pregunta describe el patrón canónico de respuesta a incidente. Confirm compromise eleva el risk a `High` sin esperar al recálculo horario del modelo, lo que dispara automáticamente la CA policy del enunciado en el siguiente sign-in. La B es válida en emergencias absolutas (cuando no hay CA policy lista o cuando se necesita parar al agente sin propagación de 5-15 min de Conditional Access), pero no es la opción correcta cuando la policy ya existe: Disable también deja al agente fuera del modelo de risk, perdiendo trazabilidad. La C es lo opuesto a actuar con evidencia confirmada; Dismiss se reserva para alertas dudosas. La D es un antipatrón grave: excluir al agente comprometido de la policy le da vía libre. Ver § 9.6 (tabla de decisión).

</details>

---

### EX-09-006 · Drag-and-drop · Media

**OA mapeado:** OA-09.3 · OA-09.4 · OA-09.5 · **Área:** 2 · **Bloom:** Aplicar

**Enunciado:**

Estás desplegando una CA policy nueva para bloquear agent identities en `High` risk y quieres validar el cascade completo. Ordena las siguientes acciones desde la primera (creación de la policy) hasta la última (verificación del bloqueo efectivo).

**Acciones a ordenar:**

1. **Cambiar la policy a `On`** una vez verificada en Report-only.
2. **Marcar `Confirm compromise`** sobre un agente desde Risky Agents report.
3. **Crear la policy** con scope `All agent identities`, condition `Agent risk: High`, grant `Block`, estado `Report-only`.
4. **Verificar el sign-in bloqueado** en `Workload identity sign-ins`.
5. **Monitorizar en `Sign-in logs > Conditional Access`** durante 7-14 días con `Reported: would have been blocked` esperados.

<details>
<summary>Ver respuesta</summary>

**Secuencia correcta:**

| Posición | Acción |
|---|---|
| 1 | Crear la policy con scope, condition, grant y estado Report-only |
| 2 | Monitorizar en Sign-in logs durante 7-14 días |
| 3 | Cambiar la policy a `On` |
| 4 | Marcar Confirm compromise sobre un agente |
| 5 | Verificar el sign-in bloqueado |

**Justificación:** la secuencia refleja el patrón completo de despliegue seguro. Primero se crea en Report-only (paso 1) y se monitoriza el comportamiento esperado durante el período de validación (paso 2); solo cuando hay confianza se pasa a `On` (paso 3). Una vez la policy está en enforcement, se valida el cascade real con `Confirm compromise` (paso 4) y se observa el efecto en logs (paso 5). Saltarse Report-only es el antipatrón que más rompe entornos en producción. Ver § 9.4.

</details>

---

### EX-09-007 · Multiple choice · Difícil

**OA mapeado:** OA-09.5 · **Área:** 2 · **Bloom:** Recordar

**Enunciado:**

¿Cuál de las siguientes afirmaciones describe correctamente Microsoft Entra Identity Protection para agent identities a fecha de mayo 2026?

A) Está disponible en GA, requiere Microsoft Entra ID P1, evalúa los sign-ins en tiempo real y conserva el Risky Agents report durante 30 días.
B) Está en Frontier preview, requiere Microsoft Entra ID P2, ejecuta sus 6 detecciones de forma offline (recálculo horario) y conserva el Risky Agents report 90 días desde la última detección.
C) Está en GA, requiere licencia Microsoft Agent 365 standalone, evalúa los sign-ins en tiempo real y conserva el Risky Agents report 7 días.
D) Está en Frontier preview, requiere Microsoft Entra ID P2, evalúa en tiempo real y conserva el Risky Agents report indefinidamente como audit log.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** describe correctamente las cuatro propiedades del producto a mayo 2026: (1) Frontier preview, no GA; (2) requiere P2 (incluida en E5/E7); (3) detecciones offline con recálculo horario, no tiempo real, lo que implica que un sign-in sospechoso puede tardar 60 min en levantar el risk score; (4) conservación 90 días desde la última detección. La A confunde GA y P1 (P1 no incluye Identity Protection), tiempo real (offline), y 30 días (los 30 días son de Entra deleted users, no de Risky Agents). La C inventa requisito de licencia standalone y reduce el período. La D acierta en preview y P2 pero falla en tiempo real (offline) y en conservación indefinida (los detalles individuales pueden conservarse en audit log, pero el report tiene su propia ventana). Ver § 9.5.

</details>

---

## Caso de estudio · Plain Coffee SL — Despliegue de control de acceso para agentes financieros

> Este caso integra los conceptos del módulo en una situación real. No puntúa para el examen; sirve para que el alumno verifique que aplicaría correctamente las acciones aprendidas.

### Contexto

Plain Coffee SL es una cadena de cafeterías con 1.200 empleados de oficina y 8.500 en tienda. Tras los M06–M08, su Registry tiene 14 agentes activos. Cuatro pertenecen al área de **Finanzas** y operan sobre datos sensibles: previsiones, conciliaciones bancarias, generación de informes ejecutivos. Todos llevan el custom security attribute `customSecurityAttributes.Department eq 'Finance'`.

El CISO pide tres cosas:

1. Que **ningún agente** de la organización pueda autenticarse cuando Identity Protection lo marque como `High` risk.
2. Que los **agentes de Finanzas**, además, exijan que el dispositivo del usuario invocador sea compliant cuando hay `Sign-in risk: Medium o High` (los agentes de Finanzas operan principalmente en flujo OBO desde Copilot).
3. Que el despliegue **no rompa producción**: la operación de Finanzas es crítica los días 1-5 y 25-31 de cada mes.

El equipo de seguridad ha detectado, además, que la agent identity `BotPedidos-Externos` (un agente que sincroniza pedidos entrantes con un proveedor externo) presenta el patrón típico de credenciales filtradas: el feed de threat intel de la organización recogió ayer su `client_secret`. Hay que reaccionar.

### Preguntas guía

#### 1. Diseño de las dos políticas CA

¿Cómo configurarías cada una de las dos políticas que pide el CISO? Indica para cada una: scope (con filtro si aplica), target, conditions, grants, estado inicial.

<details>
<summary>Ver propuesta</summary>

**Policy 1 — Block all agents at high risk**
- Scope: `All agent identities`. Sin filtro adicional (aplica a los 14 agentes).
- Target: `All resources`.
- Conditions: `Agent risk: High`.
- Grants: `Block access`.
- State inicial: `Report-only`. Promoción a `On` tras 14 días sin falsos positivos.

**Policy 2 — Require compliant device for Finance agents in OBO at risky sign-ins**
- Scope: `All agent identities` con filtro `customSecurityAttributes.Department eq 'Finance'`. Aplica solo a los 4 agentes financieros.
- Target: `All resources`.
- Conditions: `Sign-in risk: Medium, High`.
- Grants: `Require compliant device`.
- State inicial: `Report-only`. La excepción a tener en cuenta: este grant solo es relevante cuando hay flujo OBO (hay usuario humano detrás cuyo dispositivo se evalúa); para sign-ins en own identity la condición no resuelve la heurística de dispositivo.

Las dos policies pueden coexistir: en sign-in `High` agent risk, Policy 1 dispara Block antes de que Policy 2 evalúe el dispositivo.

</details>

#### 2. Plan de cutover sin romper producción

¿Cómo programarías el rollout para no impactar en los días críticos del cierre mensual?

<details>
<summary>Ver propuesta</summary>

- **Día 1**: crear las dos policies en `Report-only` después del cierre del mes (día 6 de un mes cualquiera). Anotar fecha de creación y review programada en un documento del equipo.
- **Días 1-7**: monitorización de los `Reported: would have been blocked` y `Reported: would require compliant device` en Sign-in logs. Triaje diario los primeros 3 días.
- **Día 8**: revisión con el equipo de Finanzas. Si hay `Reported: would require compliant device` recurrentes en sign-ins legítimos, identificar dispositivos no compliant y abrir tickets con los usuarios afectados.
- **Días 8-14**: segunda semana de monitorización; resolver los tickets de compliance abiertos.
- **Día 15**: si los reports son consistentes con lo esperado, pasar Policy 1 a `On`. Mantener Policy 2 una semana más en Report-only (afecta a usuarios humanos y conviene asegurarse).
- **Día 22**: pasar Policy 2 a `On`.
- **Día 25**: ya en operativa con cierre mensual, las policies llevan al menos 3 días en enforcement; si hay incidente, hay margen para ajustar antes del 1 del mes siguiente.

</details>

#### 3. Reacción al compromiso de BotPedidos-Externos

¿Qué acción ejecutas, en qué orden, y qué validación posterior haces?

<details>
<summary>Ver propuesta</summary>

1. **Confirm compromise** desde Risky Agents report. Justificación: `Credenciales filtradas confirmadas por feed threat intel del <fecha>`. El risk sube a `High`.
2. La Policy 1 (cuando esté en `On`; si todavía está en Report-only, ajustar manualmente al estado enforcement antes de seguir) bloquea el siguiente sign-in.
3. **Verificación** en `Workload identity sign-ins`: el siguiente intento debe aparecer con `Failure: blocked by Conditional Access policies` y la Policy 1 evaluada como `Failure: blocked by policy`.
4. **Comunicación**: notificar al sponsor del agente y al equipo de Aplicaciones (que opera la integración con el proveedor) que el agente está temporalmente fuera. Estimar tiempo de reposición.
5. **Remediación técnica**: rotar el `client_secret` del agente (o pasar a managed identity / federated credentials, M06 § 6.5). Una vez rotado y validado el nuevo secret en stage, ejecutar `Confirm safe` desde Risky Agents para devolver al agente a producción.
6. **Post-mortem**: incidente documentado, revisión del flujo de generación y custodia del secret comprometido (¿estaba en un repo? ¿en un pipeline de CI?), y aplicar lecciones al resto de agentes con `client_secret`.

Si la Policy 1 todavía estuviera en Report-only, la opción correcta es **Disable** la agent identity directamente desde la página del agente, sin esperar a que la policy entre en enforcement, y abrir el plan de remediación en paralelo.

</details>

### Lecciones del caso

- Las CA policies de agentes funcionan en cascada con Identity Protection: el `Confirm compromise` solo tiene efecto si hay una policy que filtre por `Agent risk: High`.
- Report-only es el seguro de vida del despliegue: protege a Finanzas en su semana crítica.
- `Confirm safe` después de la remediación técnica cierra el ciclo y deja el modelo de risk consistente.
- En emergencias sin policy lista, `Disable` es el corte limpio; `Confirm compromise` requiere policy preparada para ser efectivo.
