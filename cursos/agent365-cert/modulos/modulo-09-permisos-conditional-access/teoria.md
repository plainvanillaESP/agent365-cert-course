---
modulo: 9
tipo: teoria
titulo: "Permisos, accesos y Conditional Access para agentes"
duracion_lectura_min: 75
ultima_actualizacion: 2026-05-07
objetivos_aprendizaje:
  - id: OA-09.1
    texto: "Distinguir los cuatro tipos de permisos que un agente puede tener: heredados del blueprint, delegated (OBO), application (own identity) y custom security attributes para gobernanza."
    bloom: Comprender
  - id: OA-09.2
    texto: "Configurar Conditional Access policies sobre workload identities de agentes, incluyendo grants Block, MFA y dispositivo compliant, distinguiendo lo que aplica a usuarios humanos de lo que aplica a agentes."
    bloom: Aplicar
  - id: OA-09.3
    texto: "Aplicar políticas de bloqueo basadas en risk score (Risky Sign-Ins for Agents, Risky Agents) usando Microsoft Entra Identity Protection."
    bloom: Aplicar
  - id: OA-09.4
    texto: "Reconocer las seis detecciones específicas de Identity Protection que aplican a agentes y explicar qué señal detecta cada una."
    bloom: Comprender
  - id: OA-09.5
    texto: "Diferenciar la trazabilidad de permisos en OBO vs own identity: qué scopes se aplican en cada interacción, dónde se ven las trazas en los sign-in logs."
    bloom: Analizar
  - id: OA-09.6
    texto: "Diseñar una política de acceso end-to-end que combine permisos del blueprint, Conditional Access y reglas de Identity Protection para un caso de uso concreto."
    bloom: Crear
---

# Módulo 09 — Permisos, accesos y Conditional Access para agentes

> **Duración estimada de lectura:** 75 minutos.
>
> **Prerrequisitos:** M01 (fundamentos), M04 (roles administrativos), M06 (Entra Agent ID).
>
> Este módulo cierra el Área 2 del curso. Hasta aquí los módulos 06-08 cubrieron qué es una identidad de agente, cómo aparece en el Registry y cómo viaja por su ciclo de vida. M09 cubre la dimensión que faltaba: **a qué tiene acceso, bajo qué condiciones, y cómo bloqueamos cuando algo huele mal**.

---

## 9.1 Los cuatro tipos de permisos de un agente

Un agente «tiene permisos» en cuatro capas distintas. Un IT admin necesita saber qué hace cada capa para diagnosticar problemas y diseñar políticas.

### 9.1.1 Permisos heredados del blueprint

El blueprint (M06) declara una lista de **inheritable permissions**: scopes de Microsoft Graph y de resource apps custom que cualquier agente aprovisionado a partir del blueprint hereda automáticamente.

```json
{
  "id": "bp-comercial",
  "displayName": "Comercial - OBO agents",
  "inheritablePermissions": {
    "Microsoft Graph": [
      "User.Read",
      "Mail.Read",
      "Calendars.Read",
      "Files.Read.All"
    ],
    "Comercial CRM API (custom)": [
      "Crm.Account.Read",
      "Crm.Opportunity.Read"
    ]
  }
}
```

Una agent identity derivada de `bp-comercial` arranca con esos seis scopes preautorizados. El admin no tiene que hacer nada por agente. Si más adelante el blueprint cambia (se añade `Mail.Send`, por ejemplo), todas las identities derivadas heredan el cambio sin re-aprovisionar.

**Límites duros del blueprint** (introducidos en M06): 10 resource apps × 40 scopes por blueprint. Pasar por encima requiere partir el blueprint en dos.

### 9.1.2 Delegated permissions (modo OBO)

Cuando un usuario invoca a un agente y el agente actúa **on behalf of** ese usuario (modo OBO), los permisos efectivos en cada interacción son la **intersección** entre tres listas:

1. Lo que el blueprint hereda al agente.
2. Lo que el usuario tiene en su licencia y rol.
3. Lo que el usuario ha consentido al agente la primera vez que lo invocó.

Si el blueprint hereda `Mail.Read` pero el usuario invocador no tiene licencia que cubra Exchange, la operación falla con `403 Forbidden`. Si el usuario sí tiene la licencia pero no consintió `Mail.Read` cuando arrancó por primera vez, también falla.

Esta intersección triple es la fuente más frecuente de tickets de soporte en producción: «el agente funciona para Marta pero no para Pedro». La causa habitual es licencia o consent, no el agente.

### 9.1.3 Application permissions (modo own identity)

Cuando un agente opera en modo **own identity** (autonomous, batch nocturno sin usuario), no hay un usuario invocador del que heredar. Los permisos efectivos son **solo** los del blueprint (concedidos como application permissions, no delegated).

Las application permissions son potencialmente más amplias que las delegated: un `Files.Read.All` application puede leer archivos de toda la organización; el mismo scope delegated solo puede leer los archivos del usuario invocador. Por eso requieren **admin consent** explícito sobre el blueprint principal y figuran como auditables en sign-in logs como invocaciones de la propia agent identity (no del usuario).

En mayo de 2026 el modo own identity sigue en Frontier preview. La práctica recomendada es restringirlo a procesos batch de áreas concretas con sponsors definidos y nunca extenderlo a interacciones de usuario.

### 9.1.4 Custom security attributes

Los custom security attributes no son permisos en sentido estricto — no autorizan operaciones — pero son la pieza que permite **filtrar** agentes en políticas de Conditional Access, DLP y reportes. Son metadatos de gobernanza:

- `Department` — Comercial, Operaciones, Finanzas, RRHH, Legal.
- `ConfidentialityLevel` — Public, Internal, Confidential, HighlyConfidential.
- `BusinessOwner` — el responsable de negocio del agente.
- `AgentPurpose` — descripción funcional breve.

Su utilidad operativa aparece en CA: una policy puede aplicar solo a agentes con `Department = Finanzas` o `ConfidentialityLevel = HighlyConfidential` sin tener que mantener una lista nominal de agentes. Cuando llega un agente nuevo con esos atributos, la policy se aplica automáticamente.

---

## 9.2 Conditional Access para agentes (workload identities)

Microsoft Entra Conditional Access (CA) es el mecanismo histórico para condicionar el acceso de **usuarios** a recursos. Desde la GA de Microsoft Agent 365 en mayo de 2026, las CA policies se extienden formalmente a **workload identities**, que es la categoría que engloba aplicaciones (service principals) y agentes (agent identities).

### 9.2.1 Qué cambia respecto a CA para usuarios

Las CA para workload identities tienen **menos signals** disponibles que las de usuarios (los agentes no tienen ubicación física, ni dispositivo, ni autenticador biométrico). Las que sí están disponibles:

- **Risk score** (Low, Medium, High) calculado por Identity Protection sobre la agent identity.
- **Workload identity location** (sí: el agente puede invocar desde una IP determinada, aunque las invocaciones autonomous suelen venir de IPs de Azure regionales).
- **Application** (qué resource app está intentando acceder).
- **Custom security attributes** del agente invocador.

Lo que **no aplica** a workload identities: device compliance (no hay dispositivo), MFA (no es operable sin humano que la complete), session controls (no aplican porque no hay sesión interactiva).

### 9.2.2 Grants disponibles para agentes

| Grant | Aplica a workload identities | Comentario |
|---|---|---|
| Block | sí | El más usado. Bloquea la invocación. |
| Require MFA | no | No tiene sentido sin humano. |
| Require compliant device | no | No hay dispositivo. |
| Require approved client app | limitado | Solo aplica a algunos flows. |
| Use Continuous Access Evaluation | sí | Permite re-evaluar el token en runtime. |

En la práctica el 95 % de las CA para agentes son **Block** condicionadas a uno o más signals (risk High, app crítica, atributo Confidencialidad alto sin estar en un grupo de excepciones).

### 9.2.3 Patrones canónicos de CA para agentes

**Patrón 1 — Bloquear agentes con risk High en apps críticas.**

```
IF agent.riskScore == High AND app IN [Microsoft Graph, Custom CRM API]
THEN block
```

Es la primera CA que cualquier organización despliega. Bloquea la invocación cuando Identity Protection ha decidido que el agente tiene comportamiento anómalo. Los agentes salen del estado High cuando Identity Protection los reevalúa positivamente o cuando el admin hace un risk dismissal manual.

**Patrón 2 — Bloquear agentes con `ConfidentialityLevel = HighlyConfidential` fuera de horario laboral.**

```
IF agent.customAttributes.ConfidentialityLevel == HighlyConfidential
   AND time NOT IN business_hours
THEN block
```

Aplica a agentes que tratan datos sensibles. El argumento operativo es que no debería haber invocaciones a esos agentes a las 03:00 (si las hay, es señal de credenciales comprometidas o de una expansión de uso no autorizada).

**Patrón 3 — Bloquear agentes que consumen scopes que el blueprint no debería permitir.**

```
IF agent.delegatedPermissions INCLUDES "Mail.Send"
   AND agent.blueprint NOT IN allowlist_can_send_mail
THEN block
```

Es una CA de defensa en profundidad. Aunque el blueprint no debería heredar `Mail.Send`, si por alguna razón un agente acaba con ese scope (admin error, bug del aprovisionamiento), la CA bloquea antes de que el daño llegue al usuario.

### 9.2.4 Workload identity license requirement

Crear CA policies que apliquen a workload identities requiere **Microsoft Entra Workload Identities Premium** (licencia separada de Entra ID P1 / P2). Está incluida en M365 E7 y se vende standalone. Sin esa licencia, las CA solo aplican a usuarios humanos y los agentes quedan sin condicionamiento.

Es uno de los descubrimientos típicos de los primeros días con Agent 365: el admin diseña la primera CA para agentes, la aplica, y se da cuenta de que no está bloqueando nada porque la licencia faltaba.

---

## 9.3 Identity Protection y las seis detecciones para agentes

Microsoft Entra Identity Protection es el motor que detecta comportamiento anómalo y asigna risk scores. Para usuarios humanos lleva años en producción con docenas de detecciones. Para agentes existen **seis detecciones específicas** introducidas en GA de Agent 365 el 1 de mayo de 2026.

### 9.3.1 Las seis detecciones

| Numero | Nombre | Qué detecta |
|---|---|---|
| 1 | **Anomalous token use** | El token de la agent identity se usa en patrones que no encajan con la actividad histórica del agente (frecuencia, geografía de IPs, scopes invocados). |
| 2 | **Atypical agent travel** | El token aparece en dos regiones geográficas en una ventana imposible de cubrir físicamente (similar al «atypical travel» de usuarios humanos pero adaptado a tokens emitidos a workload identities). |
| 3 | **Token issuer anomaly** | El token presentado afirma haber sido emitido por un issuer que no es el tenant del agente o que tiene firma inválida. Suele indicar token forgery. |
| 4 | **Suspicious agent application activity** | La agent identity intenta operaciones que su blueprint no debería heredar (escalada de privilegios). |
| 5 | **Verified threat actor signals** | La agent identity está accediendo desde IPs o ASN que Microsoft Threat Intelligence ha marcado como threat actor verificado. |
| 6 | **Adversary-in-the-middle (AiTM)** | Patrones consistentes con un proxy malicioso que intercepta los tokens del agente. Es la detección más reciente, introducida específicamente para el modo OBO donde el agente puede ser interpuesto. |

Cada detección produce señales que Identity Protection consume para calcular un **risk score** del agente: Low, Medium, High. El score es lo que las CA policies leen.

### 9.3.2 Risky Sign-Ins for Agents vs Risky Agents

Identity Protection expone dos vistas distintas:

- **Risky Sign-Ins for Agents**: eventos individuales (cada invocación arriesgada). Útil para hunting puntual y forenses.
- **Risky Agents**: agregación a nivel de agent identity (qué agentes están en High histórico). Es la lista que un admin revisa diariamente.

La regla operativa: para triagear el día a día, mirar Risky Agents. Para investigar un incidente concreto, ir a Risky Sign-Ins for Agents y filtrar por `agentId`.

### 9.3.3 Microsoft Graph endpoints

Para automatizar revisiones programáticas:

- `GET /beta/identityProtection/riskyAgents`: lista de agentes con riesgo histórico.
- `GET /beta/identityProtection/riskDetections`: eventos de detección filtrables por `riskEventType` y `objectType: agent`.
- `POST /beta/identityProtection/riskyAgents/{id}/dismiss`: dismissal manual de riesgo (requiere justificación auditable).

### 9.3.4 Identity Protection P2 license requirement

Las seis detecciones requieren **Microsoft Entra ID P2** aplicada a la workload identity, no solo al tenant. Es una licencia distinta a la P1 y a la Workload Identities Premium. Confundir las tres es habitual: P1 cubre CA básica para usuarios, Workload Identities Premium habilita CA para agentes, y P2 habilita las detecciones de Identity Protection.

E7 incluye las tres. Si la organización está en standalone, hay que comprarlas por separado.

---

## 9.4 Trazabilidad: OBO vs own identity en sign-in logs

Saber dónde y cómo se ven los logs de cada modo es indispensable para diagnosticar incidentes y para auditorías regulatorias.

### 9.4.1 OBO en sign-in logs

Cuando un usuario invoca a un agente OBO, en los **Microsoft Entra sign-in logs** aparecen dos entradas relacionadas:

1. **Sign-in del usuario** (entrada principal): `userPrincipalName` del usuario, app-id de la aplicación cliente (Teams, Outlook, etc.), evento de adquisición de token con scopes.
2. **Sign-in del agente como recurso**: el agente aparece en `resourceId` con su `appId`. Es lo que indica que el token se ha usado para invocar al agente.

En **CloudAppEvents** (Defender XDR) la invocación queda como un evento `AgentInvoke` correlacionable por `userId` + `agentId`. Para auditoría, el `correlationId` une todas las trazas del flow.

### 9.4.2 Own identity en sign-in logs

Cuando un agente actúa en own identity, no hay usuario humano. La entrada en sign-in logs es:

1. **Sign-in de la agent identity** (entrada autónoma): `userPrincipalName` vacío, `appId` del agente, autenticación vía `client_credentials`, scopes application permissions.

En CloudAppEvents queda como `AgentAutonomousInvoke` con `userId` vacío y `agentId` poblado.

### 9.4.3 Implicación para auditoría

La diferencia entre OBO y own identity en logs es **quién es el sujeto** del registro:

| Modo | Subject | UPN | Scopes en token |
|---|---|---|---|
| OBO | Usuario humano + agente como recurso | UPN del usuario | Delegated (intersección) |
| Own identity | Agente | Vacío / agente | Application (blueprint completo) |

Para una auditoría regulatoria que pide «qué usuarios accedieron a este dato», el modo OBO permite responder con UPN. El modo own identity requiere correlar el `agentId` con el `BusinessOwner` del agente vía custom security attributes — es trazabilidad indirecta, no directa al usuario.

Esta diferencia de trazabilidad es uno de los argumentos para reservar own identity a procesos batch sin contexto de usuario y mantener OBO para todo lo invocado por humanos.

---

## 9.5 Composición de defensas: blueprint + CA + ID Protection

El control de acceso a agentes se construye apilando tres capas. Cada una tiene un propósito y un costo operativo distinto.

### 9.5.1 Capa 1: Blueprint (preventiva, estática)

**Qué evita:** que el agente tenga scopes que no debería tener. Evita la mayoría de problemas en el origen.

**Cómo se opera:** revisión de blueprints en cada cambio. Aprobación humana del admin consent al cambiar la lista de inheritable permissions.

**Coste:** bajo cuando los blueprints están bien diseñados. Alto si hay 100 agentes con permisos individuales en lugar de blueprints.

### 9.5.2 Capa 2: Conditional Access (preventiva, dinámica)

**Qué evita:** que un agente con permisos correctos los ejecute en condiciones que no autorizamos (risk High, fuera de horario, atributo de Confidencialidad alto sin justificación).

**Cómo se opera:** definir policies por categorías (no por agente individual). Revisar trimestralmente que los signals usados (custom attributes, risk) siguen siendo correctos.

**Coste:** medio. Requiere licencia Workload Identities Premium. Diseñar policies bien tipadas requiere experiencia.

### 9.5.3 Capa 3: Identity Protection (detectiva, dinámica)

**Qué evita:** que un comportamiento anómalo no detectado por las dos capas anteriores pase sin alertar al equipo de seguridad.

**Cómo se opera:** revisar Risky Agents diariamente. Triagear detecciones. Hacer dismissal con justificación cuando son falsos positivos.

**Coste:** alto en operación diaria. Requiere licencia Entra ID P2 para workload identities y un equipo de seguridad capaz de operarla.

### 9.5.4 Patrón end-to-end de despliegue

Para un agente Foundry de Tesorería que opera autonomous con `ConfidentialityLevel = HighlyConfidential`:

1. **Blueprint** declara los scopes mínimos (Treasury.Read, Treasury.Reconcile, Files.Read.All sobre el site Tesorería). `requireSponsor = true`. `transferOnLeaver = true`.
2. **CA policy** aplicable a agentes con `ConfidentialityLevel = HighlyConfidential` bloquea invocaciones fuera de la ventana 22:00-06:00 (cuando se ejecuta el batch nocturno) y bloquea invocaciones desde IPs fuera de Azure West Europe.
3. **Identity Protection** monitoriza el agente. Si `riskScore` pasa a High, una segunda CA policy lo bloquea hasta dismissal humano. El equipo de seguridad triagea desde Risky Agents.

Las tres capas trabajan en serie. Si la capa 1 fallase (un blueprint mal configurado), la capa 2 limita el daño. Si la capa 2 también fallase (una CA mal escrita), la capa 3 al menos genera la alerta que permite descubrir el problema.

---

## 9.6 Operaciones del día a día

El IT admin que gobierna el control de acceso de agentes tiene un puñado de tareas recurrentes.

### 9.6.1 Triaje diario de Risky Agents

09:00, abrir Microsoft Entra → Identity Protection → Risky Agents. Filtrar por `riskState = atRisk`. Para cada agente:

1. Mirar el último Risky Sign-In: ¿qué detección lo elevó? ¿IP anómala? ¿token forgery? ¿escalada de scopes?
2. Mirar el `BusinessOwner` del agente (custom security attribute): ¿hay alguna razón legítima que justifique el comportamiento (deploy reciente, cambio de configuración, partner test)?
3. Si hay justificación: dismissal con el motivo escrito en el campo de justificación (queda en audit log).
4. Si no hay justificación: ticket al equipo de seguridad para investigación profunda.

Pasar de 10-20 agentes en High a menos de 5 al cierre del día es el KPI operativo típico.

### 9.6.2 Revisión semanal de CA policies

Una vez por semana, revisar las CA que aplican a workload identities:

- ¿Hay policies que no han disparado nada en 30 días? Candidatas a revisar (puede que el signal ya no sea relevante).
- ¿Hay agentes con `ConfidentialityLevel` mal configurado que están escapando de las policies que deberían aplicarles?
- ¿Hay nuevos blueprints sin policy asociada?

Documentar los hallazgos en un breve report semanal al CISO.

### 9.6.3 Revisión trimestral del blueprint

Cada trimestre, revisar los blueprints:

- ¿Algún blueprint se aproxima al límite de 10 resource apps × 40 scopes? Tiempo de partir.
- ¿Algún blueprint tiene scopes que ningún agente derivado usa realmente? Tiempo de podar.
- ¿Algún blueprint nuevo introducido en el trimestre carece de admin consent o de sponsor definido? Tiempo de cerrar.

---

## Glosario de términos clave del módulo

| Término | Definición breve |
|---|---|
| **Workload identity** | Categoría que engloba service principals (aplicaciones) y agent identities en Microsoft Entra. Sujeto al que se aplican las CA policies para agentes. |
| **Inheritable permissions** | Lista de scopes Graph que el blueprint declara y que las agent identities derivadas heredan automáticamente. |
| **Delegated permissions** | Permisos que actúan en modo OBO con el contexto del usuario invocador. Son la intersección entre blueprint, licencia del usuario y consent. |
| **Application permissions** | Permisos que actúan en modo own identity sin contexto de usuario. Son los del blueprint completos. Requieren admin consent. |
| **Conditional Access for workload identities** | Extensión del motor CA de Entra que permite condicionar el acceso de agentes (no solo de usuarios). Requiere licencia Workload Identities Premium. |
| **Risky Sign-Ins for Agents** | Vista de Identity Protection con eventos individuales arriesgados de agentes. Para hunting puntual. |
| **Risky Agents** | Vista agregada de Identity Protection a nivel de agent identity. Para triaje diario. |
| **Anomalous token use** | Detección de Identity Protection sobre patrones de uso del token de agent identity. |
| **Atypical agent travel** | Detección de tokens emitidos a workload identity que aparecen en regiones geográficas imposibles. |
| **Token issuer anomaly** | Detección de tokens cuyo issuer no es el tenant del agente o cuya firma es inválida. |
| **Suspicious agent application activity** | Detección de operaciones que el blueprint no debería heredar (escalada de privilegios). |
| **Verified threat actor signals** | Detección de IPs/ASN marcadas por Microsoft Threat Intelligence. |
| **Adversary-in-the-middle (AiTM)** | Detección de patrones consistentes con un proxy malicioso interceptando tokens del agente. |
| **Workload Identities Premium** | Licencia Entra que habilita CA policies sobre workload identities. Está incluida en E7 y se vende standalone. |
| **Risk dismissal** | Acción manual del admin que cierra un riesgo en Identity Protection con justificación auditable. |
| **Continuous Access Evaluation (CAE)** | Mecanismo que permite re-evaluar el token de un agente en runtime cuando cambian las condiciones (revocación, cambio de risk score). |

---

## Resumen del módulo

- Un agente «tiene permisos» en cuatro capas: heredados del blueprint, delegated en OBO, application en own identity, y custom security attributes para gobernanza.
- Conditional Access se extiende a workload identities con grants limitados (Block es el principal). Requiere licencia Workload Identities Premium.
- Identity Protection introduce seis detecciones específicas para agentes (anomalous token, atypical travel, issuer anomaly, suspicious activity, verified threat actor, AiTM) y produce risk scores que las CA leen.
- OBO y own identity dejan trazas distintas en sign-in logs: OBO con UPN del usuario; own identity con `appId` del agente y UPN vacío. La auditoría regulatoria depende de esa diferencia.
- El control de acceso se construye en tres capas (blueprint, CA, ID Protection) que trabajan en serie. Cada capa tiene coste operativo distinto.
- Las operaciones del día a día son triaje diario de Risky Agents, revisión semanal de CA policies y revisión trimestral de blueprints.

## Hacia el módulo siguiente

El Área 2 del curso queda cerrada con M09. El alumno conoce ya cómo se identifica un agente (M06), cómo aparece en el catálogo (M07), cómo viaja por su ciclo de vida (M08) y cómo se controla su acceso (M09).

El **Área 3** (M10-M12) cambia de foco: del «quién es el agente y qué puede hacer» al «qué datos toca, cómo los protegemos, cómo respondemos cuando algo sale mal». M10 abre con Microsoft Purview integrado en Agent 365: DSPM for AI, sensitivity labels sobre archivos `.agent`, y trazabilidad de datos accedidos por agente.
