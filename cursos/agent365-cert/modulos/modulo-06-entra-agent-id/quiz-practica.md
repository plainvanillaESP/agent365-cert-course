---
modulo: 6
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 06"
duracion_min: 22
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-06-1
  - Q-06-2
  - Q-06-3
  - Q-06-4
  - Q-06-5
  - Q-06-6
  - Q-06-7
  - Q-06-8
  - Q-06-9
  - Q-06-10
  - Q-06-11
caso_estudio: "Banco Cervantes"
---

# Módulo 06 — Quiz de práctica

> Once preguntas para validar tu comprensión de Microsoft Entra Agent ID. Es el módulo más extenso del Área 2 y cubre los cuatro tipos de objetos, blueprints, sponsorship, lifecycle workflows, OBO vs own identity, custom security attributes y operaciones bulk. Intentos ilimitados, aprobado a partir del 70 % (8 de 11 correctas).
>
> Estas preguntas son distintas a las del examen final del curso. Cubren los mismos 7 OAs con escenarios y datos diferentes.

---

::: pregunta
id: Q-06-1
oa: OA-06.1
tipo: multiple-choice
dificultad: facil
bloom: Recordar
enunciado: |
  ¿Cuál de los siguientes objetos de Microsoft Entra Agent ID es la **instancia que autentica** contra Microsoft Graph y hereda permisos del blueprint?
opciones:
  - id: a
    texto: "Agent identity blueprint"
  - id: b
    texto: "Agent identity"
    correcta: true
  - id: c
    texto: "Agent identity blueprint principal"
  - id: d
    texto: "Agent user"
justificacion: |
  La **agent identity** es la instancia concreta. Tiene un `appId`, hereda los permisos del blueprint del que se aprovisionó, recibe tokens y autentica contra Microsoft Graph. El blueprint solo define la plantilla. El blueprint principal es el SP del blueprint para admin consents (no autentica al agente). El agent user es una propiedad opcional para presencia humana-like en Teams. Ver § 6.1.
:::

::: pregunta
id: Q-06-2
oa: OA-06.1
tipo: scenario
dificultad: media
bloom: Analizar
enunciado: |
  El equipo de Operaciones publica el siguiente diagrama: «Blueprint *bp-rrhh-faq* → Identity *id-rrhh-faq-prod* → User *Agent-RRHH-FAQ* en Teams». ¿Qué tipo de objeto Entra es **Agent-RRHH-FAQ** en este contexto?
opciones:
  - id: a
    texto: "Es la agent identity, porque es la que vemos en Teams."
  - id: b
    texto: "Es el agent user: una propiedad opcional aplicada sobre la agent identity *id-rrhh-faq-prod* que la convierte en visible (foto, presence, mailbox) como si fuera un colaborador más."
    correcta: true
  - id: c
    texto: "Es un service principal estándar."
  - id: d
    texto: "Es el blueprint, porque define cómo se ve el agente en Teams."
justificacion: |
  Lo que vemos en Teams es el **agent user** (propiedad opcional `userType: AgentUser` aplicada a la agent identity). Sin la propiedad, la identity sigue funcionando igual pero no aparece en Teams como una persona. Esta separación entre *identidad técnica* (autentica) y *presentación humana* (agent user) es lo que permite, por ejemplo, que el mismo agente exista pero sin presencia visible mientras se valida internamente.
:::

::: pregunta
id: Q-06-3
oa: OA-06.1
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada **acción operativa** con el objeto Entra Agent ID donde se ejecuta principalmente.
items:
  - id: a1
    texto: "Modificar la lista de inheritable permissions de un grupo de agentes."
  - id: a2
    texto: "Asignar un Department = «Finanzas» a un agente concreto."
  - id: a3
    texto: "Aceptar admin consent para los scopes Graph que el grupo va a heredar."
  - id: a4
    texto: "Activar la propiedad userType: AgentUser para que el agente aparezca en Teams."
  - id: a5
    texto: "Cambiar el accountEnabled = false para deshabilitar una instancia individual."
targets:
  - id: blueprint
    label: "Blueprint"
  - id: principal
    label: "Blueprint principal"
  - id: identity
    label: "Identity"
  - id: user
    label: "Agent user"
correct_map:
  a1: blueprint
  a2: identity
  a3: principal
  a4: user
  a5: identity
justificacion: |
  - **Inheritable permissions** se editan en el blueprint y se propagan a las identities derivadas.
  - **Custom security attributes** (Department, etc.) se asignan a cada identity individual.
  - **Admin consent** se acepta sobre el blueprint principal (es el SP que recibe el consent).
  - **userType: AgentUser** es la propiedad que crea el agent user.
  - **accountEnabled = false** se aplica sobre la identity concreta.

  La regla mnemotécnica: lo que afecta a **muchos** vive en el blueprint; lo que afecta a **uno** vive en la identity; el **consent** vive en el blueprint principal; la **presencia** vive en el agent user.
:::

::: pregunta
id: Q-06-4
oa: OA-06.4
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Un agente Foundry interno responde a preguntas de empleados sobre políticas de viaje. Cada empleado lo invoca desde Teams, el agente consulta el calendario del empleado y los gastos pendientes del propio empleado para personalizar la respuesta. ¿Qué flujo de autenticación corresponde y qué requisito de licenciamiento implica?
opciones:
  - id: a
    texto: "OBO. El agente actúa con el contexto del empleado invocador. Cada empleado invocador necesita licencia Agent 365."
    correcta: true
  - id: b
    texto: "Own identity, porque el agente accede a varios datos de varios empleados a lo largo del día."
  - id: c
    texto: "Own identity, porque el agente vive en Foundry y los agentes Foundry son siempre autonomous."
  - id: d
    texto: "OBO con licencia E7 obligatoria por tratarse de Foundry."
justificacion: |
  El caso describe un agente **invocado por un usuario** que accede a **datos del propio usuario** invocador. Es el patrón clásico de **OBO** (on-behalf-of): el agente recibe el contexto del usuario y opera con sus permisos. Cada usuario invocador debe tener licencia Agent 365. La opción B confunde «accede a datos de varios usuarios» con autonomous: en OBO el agente accede a datos del invocador en cada interacción, no a datos de terceros. La C inventa una regla sobre Foundry. La D inventa el requisito E7.
:::

::: pregunta
id: Q-06-5
oa: OA-06.5
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  Necesitas listar todas las agent identities del tenant filtrando solo las que están **deshabilitadas** (`accountEnabled = false`). ¿Qué llamada Graph es correcta?
opciones:
  - id: a
    texto: "GET /v1.0/users?$filter=userType eq 'AgentUser' and accountEnabled eq false"
  - id: b
    texto: "GET /beta/agentRegistry/agents?$filter=disabled eq true"
  - id: c
    texto: "GET /beta/identities/agentIdentities?$filter=accountEnabled eq false"
    correcta: true
  - id: d
    texto: "GET /v1.0/servicePrincipals?$filter=tags/any(t:t eq 'AgentIdentity') and accountEnabled eq false"
justificacion: |
  La ruta correcta es `/beta/identities/agentIdentities` con el filter sobre `accountEnabled`. La opción A usa la query sobre `users`, que no es donde viven las agent identities. La B usa la ruta legacy `/beta/agentRegistry/agents`, que está deprecated tras la convergencia del 1 de mayo de 2026 y devuelve 301 a la nueva ruta. La D inventa una representación como service principal estándar con tags.
:::

::: pregunta
id: Q-06-6
oa: OA-06.2
tipo: scenario
dificultad: dificil
bloom: Crear
enunciado: |
  Tu organización tiene **tres unidades operativas** (Comercial, Operaciones, Soporte) que necesitan agentes con scopes Graph diferentes. Comercial necesita acceso a Outlook + Calendar + Teams. Operaciones necesita acceso a SharePoint + Planner + Teams. Soporte necesita acceso a Outlook + Teams + ServiceNow (vía custom resource). ¿Cuál es el diseño de blueprints más apropiado?
opciones:
  - id: a
    texto: "Un único blueprint global con todos los scopes, asignando custom security attributes para distinguir BU."
  - id: b
    texto: "Tres blueprints separados (bp-comercial, bp-operaciones, bp-soporte), cada uno con los scopes específicos de su área. Permite separation of duties, auditoría más sencilla y reduce blast radius si se compromete uno de ellos."
    correcta: true
  - id: c
    texto: "Un blueprint por agente individual."
  - id: d
    texto: "No usar blueprints, gestionar permisos directamente en cada agent identity."
justificacion: |
  Tres blueprints separados aplican **least-privilege por área de negocio**, simplifican auditoría (filtrar por blueprint en Defender = ver toda una BU), reducen el blast radius (si se compromete un blueprint, las otras dos BUs no se ven afectadas) y respetan el límite duro de 10 resource apps × 40 scopes (un blueprint global con todo se acercaría peligrosamente al límite). La opción A acumula riesgo. La C es ingobernable a escala. La D pierde el modelo Entra Agent ID por completo.
:::

::: pregunta
id: Q-06-7
oa: OA-06.3
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Carlos, sponsor de la agent identity *id-comercial-pricing*, **cambia de departamento** dentro de la organización (de Comercial a Marketing). El blueprint de la identity tiene `transferOnMover = false` y existe un lifecycle workflow para `onSponsorMover` con la task `markRequireReview` configurada. ¿Cuál es el comportamiento esperado?
opciones:
  - id: a
    texto: "El sponsorship se transfiere automáticamente al manager nuevo de Carlos."
  - id: b
    texto: "La agent identity se deshabilita inmediatamente."
  - id: c
    texto: "El sponsorship se mantiene con Carlos. El workflow ejecuta markRequireReview y la identity queda con requireReview = true para que el equipo decida si Carlos sigue siendo el sponsor apropiado para esa identity dado su nuevo departamento."
    correcta: true
  - id: d
    texto: "La agent identity se elimina del directorio."
justificacion: |
  Con `transferOnMover = false`, el sponsorship NO se transfiere automáticamente: Carlos sigue siendo sponsor pero el workflow `onSponsorMover` ejecuta sus tasks (en este caso `markRequireReview`) que marcan la identity para revisión humana. Esta es la pauta operativa habitual: cuando un sponsor cambia de departamento, no es obvio si el sponsorship sigue teniendo sentido (¿el agente de pricing es de Comercial? ¿Marketing?). Marcar requireReview obliga a una decisión consciente. Las opciones A, B y D inventan comportamientos que no se aplican con esta config.
:::

::: pregunta
id: Q-06-8
oa: OA-06.6
tipo: multiple-response
dificultad: media
bloom: Aplicar
enunciado: |
  De los siguientes **custom security attributes**, ¿cuáles tendrían sentido aplicar a una agent identity para mejorar la auditoría externa? Selecciona todos los que apliquen.
opciones:
  - id: a
    texto: "Department (p. ej. Finanzas, RRHH, Operaciones)."
    correcta: true
  - id: b
    texto: "ConfidentialityLevel (p. ej. Public, Internal, Confidential, HighlyConfidential)."
    correcta: true
  - id: c
    texto: "BusinessOwner (cuenta del responsable de negocio del agente)."
    correcta: true
  - id: d
    texto: "AccountPasswordHash (hash de la contraseña del agente)."
  - id: e
    texto: "AgentPurpose (descripción breve del propósito del agente)."
    correcta: true
  - id: f
    texto: "TenantSecretKey (clave secreta del tenant)."
justificacion: |
  Los custom security attributes deben ser **metadatos de gobernanza** útiles para filtrar, auditar o bloquear: Department, ConfidentialityLevel, BusinessOwner y AgentPurpose son ejemplos canónicos. NUNCA deben contener secretos: las opciones D y F (password hash, secret key) son antipatrones graves. Los secretos viven en Azure Key Vault y se entregan al agente vía credential references, no como atributos del directorio (donde son legibles por cualquiera con permisos sobre el SP).
:::

::: pregunta
id: Q-06-9
oa: OA-06.7
tipo: multiple-choice
dificultad: media
bloom: Analizar
enunciado: |
  Tu equipo deshabilita en bulk **120 agent identities** de un blueprint determinado tras detectar que el partner que las creaba ha sido bloqueado por motivos de seguridad. Tres días después, varios usuarios reportan que sus flujos de Teams «no responden». ¿Qué debes investigar primero para diagnosticar el impacto?
opciones:
  - id: a
    texto: "El AI Agent Inventory de Defender XDR para correlacionar las 120 identities deshabilitadas con los agentes que las consumían y los usuarios que invocaban esos agentes en los últimos 7 días."
    correcta: true
  - id: b
    texto: "El log de errores de Microsoft Teams del usuario afectado."
  - id: c
    texto: "El blueprint principal del partner bloqueado para volver a aceptar consents."
  - id: d
    texto: "El audit log del Conditional Access para ver si hay políticas que afectan al agente."
justificacion: |
  El primer paso de diagnóstico tras una operación bulk de deshabilitación es **correlacionar las identities deshabilitadas con los agentes y usuarios que las usaban**, y eso vive en el AI Agent Inventory de Defender XDR (que combina datos de M365, Entra y telemetría de invocaciones). Permite ver rápidamente si los flujos rotos coinciden con identities deshabilitadas (impacto colateral esperado) o si hay otra causa. La opción B mira el síntoma sin la causa. La C reabriría el agujero que provocó el bloqueo. La D investiga otra causa que no es la principal.
:::

::: pregunta
id: Q-06-10
oa: OA-06.4
tipo: multiple-response
dificultad: dificil
bloom: Comprender
enunciado: |
  ¿Cuáles de las siguientes características son propias de un **agente own identity** (autonomous) y NO de un agente OBO? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "Tiene un appId propio que aparece en sign-in logs como entidad autenticadora."
    correcta: true
  - id: b
    texto: "Hereda los permisos del usuario que lo invoca en cada interacción."
  - id: c
    texto: "Está en Frontier preview en mayo de 2026."
    correcta: true
  - id: d
    texto: "Requiere licencia Agent 365 para cada usuario invocador."
  - id: e
    texto: "Consume cuota de mensajes de la plataforma del agente (Foundry capacity, MCS messages, etc.) en lugar de licencias per-seat."
    correcta: true
  - id: f
    texto: "Aparece como agent user en Teams obligatoriamente."
justificacion: |
  El **own identity / autonomous**:

  - **(a)** Tiene su propio appId que aparece en sign-in logs (es lo que distingue las invocaciones autonomous en KQL).
  - **(c)** En mayo de 2026 sigue en Frontier preview, no GA.
  - **(e)** Consume capacity de su plataforma (no licencias per-seat).

  El **OBO**:

  - **(b)** Hereda permisos del usuario en cada invocación.
  - **(d)** Requiere licencia Agent 365 para cada usuario invocador.

  La **(f)** es falsa para ambos: la propiedad agent user es opcional independientemente del flow.
:::

::: pregunta
id: Q-06-11
oa: OA-06.3
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada **evento del ciclo de vida** del sponsor con el **trigger de lifecycle workflow** que se dispara.
items:
  - id: e1
    texto: "Un usuario es asignado por primera vez como sponsor de una identity."
  - id: e2
    texto: "Un sponsor cambia de manager o departamento sin dejar la organización."
  - id: e3
    texto: "Un sponsor es deshabilitado o eliminado del directorio."
  - id: e4
    texto: "Una agent identity no se ha invocado en 90 días."
targets:
  - id: joiner
    label: "onSponsorJoiner"
  - id: mover
    label: "onSponsorMover"
  - id: leaver
    label: "onSponsorLeaver"
  - id: inactivity
    label: "onAgentInactivity"
correct_map:
  e1: joiner
  e2: mover
  e3: leaver
  e4: inactivity
justificacion: |
  Los cuatro triggers cubren todo el ciclo de vida del sponsor más la inactividad del agente. Saber qué evento dispara qué trigger es la base para diseñar tasks correctas y para auditar por qué se ejecutó un workflow concreto. La nomenclatura sigue el patrón de los lifecycle workflows de usuarios estándar de Entra (joiner / mover / leaver), con el añadido específico de `onAgentInactivity` para identities sin invocaciones recientes.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta completar este ejercicio antes de pasar a M07.

**Escenario.** **Banco Cervantes** (entidad financiera con 6.500 empleados) está desplegando agentes Agent 365 en cuatro áreas: Análisis de Crédito, Investigación de Fraude, Reporting Regulatorio y Tesorería. El compliance officer pide:

1. Cada área debe tener su blueprint propio con scopes mínimos.
2. Cada agente debe llevar Department, ConfidentialityLevel y BusinessOwner como custom security attributes.
3. Si un sponsor deja la organización, el sponsorship se transfiere al manager y la identity queda en review por 30 días sin interrumpir operaciones.
4. Agentes inactivos durante 60 días deben deshabilitarse automáticamente.
5. Los agentes Foundry deben usar own identity (autonomous) para procesos batch nocturnos; los agentes MCS CEA deben usar OBO para interacciones humanas.

**Tareas.**

1. Diseña el JSON canónico de un blueprint para Tesorería con `requireSponsor = true`, `transferOnLeaver = true` y los custom security attributes pre-poblados con valores por defecto.
2. Identifica los **lifecycle workflows** que necesitas configurar y sus tasks asociadas.
3. Define la regla de gobernanza para decidir cuándo un agente debe usar own identity vs OBO.

<details>
<summary>Ver solución sugerida</summary>

**1. Blueprint Tesorería (esquema JSON simplificado).**

```json
{
  "id": "bp-tesoreria",
  "displayName": "Tesoreria - autonomous batch agents",
  "inheritablePermissions": {
    "Microsoft Graph": [
      "Files.Read.All",
      "Sites.Read.All"
    ],
    "Treasury API (custom)": [
      "Treasury.Read.All",
      "Treasury.Reconcile"
    ]
  },
  "restrictions": {
    "requireSponsor": true,
    "transferOnLeaver": true,
    "transferOnMover": false,
    "allowedAuthenticationFlows": ["client_credentials"],
    "maxAgentIdentities": 50,
    "tenantOnly": true
  },
  "defaultCustomSecurityAttributes": {
    "Department": "Tesoreria",
    "ConfidentialityLevel": "HighlyConfidential",
    "BusinessOwner": "tesoreria-lead@bancocervantes.com",
    "AgentPurpose": "Reconciliacion automatica de operaciones de mercado"
  },
  "lifecycle": {
    "expirationPolicy": "P365D",
    "auditLevel": "high"
  }
}
```

**2. Lifecycle workflows necesarios.**

| Trigger | Task(s) | Justificación |
|---|---|---|
| onSponsorJoiner | notifyAgentOwner | Confirmar al BusinessOwner que tiene un sponsor activo |
| onSponsorMover | markRequireReview | Marcar para revisión humana sin interrumpir |
| onSponsorLeaver | notifyManager + transferAgentSponsorship + markRequireReview | Transfiere al manager con review en 30 días |
| onAgentInactivity (60d) | disableAgentIdentity + notifyBusinessOwner | Deshabilita y notifica |

**3. Regla de gobernanza own identity vs OBO.**

- **Own identity (autonomous)** cuando:
  - No hay usuario humano que invoque al agente (procesos batch, schedulers).
  - El agente debe seguir operando aunque el usuario que lo configuró no esté presente.
  - Los datos accedidos NO son propios de un usuario individual sino de una entidad de negocio.
- **OBO** cuando:
  - Un humano invoca al agente desde una experiencia interactiva (Teams, Copilot Chat).
  - Los datos accedidos pertenecen al usuario invocador (su calendario, sus archivos).
  - Se requiere que la auditoría refleje QUÉ usuario solicitó la operación.

En el caso de Banco Cervantes: agentes Foundry de Tesorería = **own identity** (batch nocturno reconciliando operaciones, sin humano invocando). Agentes MCS CEA de Análisis de Crédito = **OBO** (analista humano consulta sobre un cliente, contexto del analista es necesario).

</details>
