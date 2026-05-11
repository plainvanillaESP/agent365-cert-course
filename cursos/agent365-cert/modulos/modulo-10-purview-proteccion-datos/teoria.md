---
modulo: 10
tipo: teoria
titulo: "Microsoft Purview y protección de datos en Agent 365"
duracion_lectura_min: 75
ultima_actualizacion: 2026-05-11
objetivos_aprendizaje:
  - id: OA-10.1
    texto: "Explicar qué problemas de gobernanza de datos resuelve Microsoft Purview en el contexto de Agent 365 y por qué es complementario al gating de Conditional Access del M09."
    bloom: Comprender
  - id: OA-10.2
    texto: "Navegar el dashboard de DSPM for AI e interpretar sus métricas principales (top sensitive interactions, risky users, top apps) para detectar patrones de uso problemáticos."
    bloom: Aplicar
  - id: OA-10.3
    texto: "Aplicar sensitivity labels (Public, Internal, Confidential, Highly Confidential) a archivos `.agent` y entender la herencia de etiquetas hacia los outputs."
    bloom: Aplicar
  - id: OA-10.4
    texto: "Configurar la trazabilidad de qué datos accede cada agente: audit logs filtrables por agentId, búsquedas en eDiscovery, retención de evidencias."
    bloom: Aplicar
  - id: OA-10.5
    texto: "Diseñar Information Protection policies que apliquen a outputs generados por agentes (watermarking, encryption, bloqueo en exfiltración)."
    bloom: Crear
  - id: OA-10.6
    texto: "Combinar las capas Purview (M10) y Conditional Access (M09) en una estrategia coherente de protección end-to-end del dato accedido por agentes."
    bloom: Analizar
---

# Módulo 10 — Microsoft Purview y protección de datos en Agent 365

> **Duración estimada de lectura:** 75 minutos.
>
> **Prerrequisitos:** M01 (fundamentos), M06 (Entra Agent ID), M09 (Conditional Access).
>
> Este módulo abre el Área 4 del curso. Hasta aquí el control sobre el agente ha sido el **acceso**: quién puede invocarlo, en qué condiciones, con qué permisos. Pero **una vez el agente accede al dato, ¿qué hace con él?**. Esa es la pregunta que cubre M10. Microsoft Purview es el suite de gobernanza, riesgo y cumplimiento que extiende Agent 365 con capacidades de etiquetado, trazabilidad y protección de información.

---

## 10.1 Por qué Purview en el contexto de Agent 365

Conditional Access (M09) decide **si** un agente puede invocar una operación. Purview decide **qué pasa con el dato** una vez la operación se ejecuta. Son disciplinas complementarias, no alternativas.

### 10.1.1 El gap que Purview cubre

Imaginemos un agente OBO de Comercial con scope `Files.Read.All` sobre el SharePoint corporativo. El blueprint es correcto, la CA está bien configurada, Identity Protection no marca riesgo. Y aun así, el agente puede:

- Leer archivos clasificados como `HighlyConfidential` y resumirlos al usuario.
- Generar outputs que combinan datos de varias fuentes sin propagar el nivel de confidencialidad más alto.
- Compartir información sensible en chats sin marcado visible.
- Dejar trazas insuficientes para responder a una auditoría regulatoria.

CA y blueprint **no resuelven** ninguno de estos problemas: el acceso es legítimo. La pregunta no es «¿puede el agente leer?» sino «¿el dato leído merece protección adicional y cómo dejamos rastro?». Esa es la función de Purview.

### 10.1.2 Las tres preguntas que Purview responde

Purview responde tres preguntas operativas sobre cualquier interacción de agente con dato corporativo:

1. **¿Qué nivel de confidencialidad tiene el dato accedido?** Lo determina la sensitivity label. Si el dato accedido es `Confidential` o superior, la operación queda registrada con esa marca.
2. **¿Qué hizo el agente con el dato?** Lo determina el audit log enriquecido. CloudAppEvents para Agent 365 registra `InputDataSensitivity` y `OutputDataSensitivity` por invocación.
3. **¿Qué protección se aplicó al output?** Lo determinan las Information Protection policies. Un output que combina datos `HighlyConfidential` hereda esa label automáticamente, lo que activa cifrado, watermark y restricciones de compartición.

### 10.1.3 Componentes de Purview que aplican a Agent 365

| Componente | Aplica a agentes |
|---|---|
| **Information Protection (sensitivity labels)** | sí, sobre archivos `.agent`, blueprints y outputs |
| **Data Loss Prevention (DLP)** | sí, sobre outputs de agentes (M11) |
| **DSPM for AI** | sí, dashboard específico para IA y agentes |
| **Communication Compliance** | sí, sobre conversaciones donde participan agentes |
| **eDiscovery (Premium)** | sí, búsquedas filtrables por `agentId` |
| **Audit (Premium)** | sí, retención extendida de eventos de agente |
| **Insider Risk Management** | sí, agentes en bucle del análisis de comportamiento del usuario |

M10 cubre Information Protection, DSPM for AI, eDiscovery y Audit en el contexto de agentes. M11 cubre DLP y M12 la monitorización con Defender XDR.

---

## 10.2 DSPM for AI: el dashboard de gobernanza

Data Security Posture Management for AI (DSPM for AI) es el dashboard de Purview dedicado a la postura de seguridad del dato en interacciones de IA: Copilot, Microsoft 365 Copilot, agentes de Foundry y agentes de Copilot Studio. Es la primera parada del oficial de cumplimiento al revisar la operación diaria de agentes.

### 10.2.1 Vista general

El dashboard organiza la información en cuatro paneles:

- **Top sensitive interactions**: número de invocaciones que tocaron datos `Confidential` o superior, agrupadas por agente y por usuario invocador.
- **Top apps**: cuáles agentes (y aplicaciones de IA generativa) consumen más datos sensibles.
- **Risky users**: usuarios cuyo patrón de uso de agentes activa alertas de Insider Risk (volumen anómalo, scopes sensibles fuera de horario).
- **Data oversharing**: archivos que han sido compartidos o accedidos por agentes en un contexto que el oficial considera arriesgado (por ejemplo, un archivo `Confidential` accedido por un agente sin restricciones de scope).

### 10.2.2 Comportamiento típico tras GA

En las primeras semanas tras la GA de Agent 365, DSPM for AI muestra picos en «Top sensitive interactions» porque los agentes recién aprovisionados están exploran sus permisos efectivos. La interpretación correcta es:

- Pico semana 1-2: comportamiento esperado, agentes están en aprendizaje.
- Pico sostenido semana 4+: bandera amarilla, revisar si el blueprint está bien dimensionado.
- Pico que crece con menos usuarios: bandera roja, posible uso anómalo concentrado en pocos usuarios.

### 10.2.3 Datos sensibles detectados automáticamente

DSPM for AI identifica datos sensibles vía dos mecanismos:

1. **Sensitivity labels existentes**: si el archivo accedido ya tiene una sensitivity label aplicada, DSPM la usa directamente.
2. **Sensitive Information Types (SITs)**: detecta automáticamente patrones como números de tarjeta de crédito, DNI, SSN, IBAN, etc. Esto cubre archivos sin etiquetar.

La combinación de ambos significa que el dashboard funciona razonablemente desde el día 0, sin que la organización tenga que haber etiquetado manualmente cada archivo.

### 10.2.4 Acciones desde el dashboard

DSPM for AI no es solo informativo: cada métrica enlaza con acciones operativas:

- Click en un usuario «risky» → abre Insider Risk Management con su caso prearmado.
- Click en un agente «top sensitive» → muestra detalle de invocaciones, opciones para ajustar blueprint o aplicar CA específica.
- Click en un archivo «oversharing» → abre Information Protection con la opción de aplicar label retroactivamente.

---

## 10.3 Sensitivity labels y archivos .agent

Las sensitivity labels son la pieza central de Information Protection: una etiqueta que se aplica a un archivo o a un mensaje y que activa políticas (cifrado, watermark, restricciones de compartición). En Agent 365 las labels aplican en tres puntos:

### 10.3.1 Labels sobre archivos `.agent`

Los archivos `.agent` (definidos en M01) contienen la configuración declarativa del agente: prompts, ejemplos, conexiones, scopes solicitados. Si ese archivo contiene información estratégica o sensible (un prompt con datos corporativos, una key API), debe llevar sensitivity label.

| Label | Aplicación típica en archivos `.agent` |
|---|---|
| **Public** | Agentes de plantilla, ejemplos públicos, demos |
| **Internal** | Agentes operativos estándar, sin información confidencial en el prompt |
| **Confidential** | Agentes que tocan datos sensibles en su contexto (resúmenes financieros, RRHH) |
| **Highly Confidential** | Agentes con conexiones a APIs propietarias, prompts con know-how exclusivo |

La label se aplica desde Microsoft 365 admin center, Foundry, o programáticamente vía Microsoft Information Protection SDK.

### 10.3.2 Herencia de labels en outputs

Cuando un agente lee un archivo etiquetado y genera un output, **el output hereda automáticamente la label más restrictiva** de las fuentes consultadas. Es una de las protecciones más potentes de Purview integrado con Agent 365.

Ejemplo:

- El agente lee tres archivos: A (`Internal`), B (`Confidential`), C (`Public`).
- El output generado por el agente lleva label `Confidential` (la más restrictiva).
- El usuario que recibe el output ve la marca visual y no puede compartir el output con personas sin permisos sobre `Confidential`.

Esta herencia funciona automáticamente para outputs renderizados en aplicaciones M365 nativas (Outlook, Teams, Word). Para outputs en aplicaciones de terceros vía Agent 365 SDK, la herencia debe ser implementada por el desarrollador siguiendo la guía de MIP SDK.

### 10.3.3 Labels sobre blueprints

Microsoft Entra Agent ID también soporta sensitivity labels en blueprints. Es metadato adicional sobre el blueprint, no protege el blueprint en sí, pero las CA policies de M09 pueden filtrar por `blueprint.sensitivityLabel = HighlyConfidential` igual que filtran por `customSecurityAttributes`.

### 10.3.4 Auto-labeling para outputs no etiquetados

Si el agente accede a un archivo sin label pero el contenido contiene SITs (tarjetas, DNIs, etc.), Purview aplica **auto-labeling** al output: detecta los SITs en el output generado y aplica la label correspondiente según la policy de auto-labeling configurada. Esto cubre el caso del archivo legacy no etiquetado.

---

## 10.4 Trazabilidad: qué datos toca cada agente

La auditoría regulatoria pregunta «¿qué archivos sensibles accedió este agente el último trimestre?». Sin trazabilidad estructurada, esa pregunta es imposible de responder. Purview integrado con Agent 365 produce las trazas necesarias.

### 10.4.1 Eventos de agente en Audit log

Microsoft 365 Audit (Premium) registra los eventos de Agent 365 con esquema enriquecido. Los eventos relevantes son:

| Evento | Qué registra |
|---|---|
| `AgentInvoke` | Invocación OBO de un agente. Campos: `userPrincipalName`, `agentId`, `blueprintId`, `correlationId`, `scopes`, `timestamp` |
| `AgentAutonomousInvoke` | Invocación own identity. Mismos campos sin UPN |
| `AgentDataAccess` | Acceso a un recurso concreto. Campos: `agentId`, `resourceUri`, `sensitivityLabel`, `inputDataSensitivity` |
| `AgentOutputGenerated` | Output producido. Campos: `agentId`, `outputSensitivityLabel`, `outputTokenCount`, `correlationId` |
| `AgentSensitivityLabelInherited` | Herencia automática de label. Campos: `inputs`, `output`, `mostRestrictiveLabel` |

### 10.4.2 Retención del log

Por defecto, Microsoft Audit retiene eventos 90 días. Con licencia E5 Compliance, la retención sube a 365 días. Para reguladores que piden 7 años (financiero, sanidad), se contrata Audit Premium con retention add-on hasta 10 años.

Para agentes que operan en sectores regulados, la práctica recomendada es **retención mínima de 7 años** desde el GA de Agent 365.

### 10.4.3 Búsquedas en eDiscovery Premium

eDiscovery Premium soporta filtros por `agentId`, `userPrincipalName` y `sensitivityLabel`. Una búsqueda típica para auditoría:

```kusto
// Pseudo-KQL para eDiscovery Premium
AgentInvoke
| where TimeGenerated between (start..end)
| where AgentId == "agent-xyz"
| where SensitivityLabel in ("Confidential", "HighlyConfidential")
| project TimeGenerated, UserPrincipalName, ResourceUri, SensitivityLabel
| order by TimeGenerated desc
```

Resultado: lista de todos los accesos del agente a recursos `Confidential+` en el periodo.

### 10.4.4 Custodian holds

Si el agente está sujeto a litigation hold (por ejemplo, investigación regulatoria), eDiscovery Premium permite poner el agente y sus dependencias (blueprint, owners, sponsors) en custodian hold: todo el contenido relacionado queda protegido contra borrado durante la investigación.

---

## 10.5 Information protection en outputs de agentes

Los outputs de agentes son una superficie de exfiltración nueva. Un usuario que invoca un agente puede recibir un resumen con datos `Confidential` y compartirlo en un chat externo, en un email, en una nota. Information Protection aplica al output las mismas defensas que ya aplica a archivos estáticos.

### 10.5.1 Encryption automático

Cuando el output hereda label `Confidential` o `Highly Confidential`, se aplica cifrado AES-256 automáticamente. El cifrado viaja con el output:

- Si se pega en un email Outlook → el email queda cifrado.
- Si se copia a un documento Word → el documento adquiere la label y queda cifrado.
- Si se intenta compartir con un externo sin permisos → bloqueado.

### 10.5.2 Watermarking visible

Los outputs `Confidential+` llevan watermark visible con el nombre del usuario invocador y la fecha. Si el usuario hace captura de pantalla y la envía a un externo, el watermark identifica al responsable de la filtración (deterrent + investigación forense).

### 10.5.3 Restricciones de compartición

Las labels pueden definir reglas duras: «Highly Confidential no puede salir del tenant», «Confidential no puede compartirse con dominios no aprobados». Estas reglas aplican a los outputs generados por agentes igual que aplicarían al archivo original.

### 10.5.4 Endpoint DLP

Microsoft Purview Endpoint DLP cubre la última milla: si el usuario copia un output `Highly Confidential` y lo intenta pegar en un navegador externo, una app de mensajería personal, o una unidad USB, el endpoint bloquea la acción y registra el evento. Es la defensa contra exfiltración intencionada o accidental por parte del usuario invocador, no contra el agente en sí.

---

## 10.6 Operaciones del día a día con Purview + Agent 365

### 10.6.1 Triaje semanal en DSPM for AI

Una vez por semana el oficial de cumplimiento abre DSPM for AI y revisa los cuatro paneles:

1. **Top sensitive interactions**: ¿hay un agente que dispara picos? Investigar si su blueprint está sobredimensionado.
2. **Top apps**: ¿aparece algún agente nuevo en la lista? Validar que tiene sensitivity label en el blueprint.
3. **Risky users**: ¿hay usuarios con alertas de Insider Risk? Coordinar con HR si procede.
4. **Data oversharing**: ¿hay archivos con label menor a la sensibilidad real del contenido? Aplicar label retroactiva con Information Protection.

### 10.6.2 Auditoría mensual de outputs

El equipo de compliance hace una muestra mensual de outputs `Highly Confidential` generados por agentes. Para cada output revisado:

- ¿La label heredada es correcta?
- ¿La protección aplicada (cifrado, watermark) es la esperada?
- ¿Hay evidencia de exfiltración (eventos de Endpoint DLP bloqueando)?
- ¿El usuario invocador tiene derecho a esa información?

Los hallazgos alimentan ajustes de policy y entrenamiento.

### 10.6.3 Respuesta a solicitud regulatoria

Cuando llega una solicitud regulatoria («qué accesos hubo a estos datos durante este trimestre»), el flujo es:

1. Identificar los recursos en cuestión (URIs, archivos).
2. Buscar en eDiscovery Premium por `AgentDataAccess` filtrado por `resourceUri`.
3. Extraer la lista de invocaciones con UPN y correlationId.
4. Para cada invocación, traer también el evento `AgentOutputGenerated` correlacionado: «¿qué se hizo con esos datos?».
5. Producir el informe formal con las trazas.

La completitud del informe depende de que el audit log esté operativo y con retención adecuada antes de que pase el incidente, no después.

### 10.6.4 Revisión trimestral de policies de Information Protection

Cada trimestre el equipo revisa las policies de auto-labeling y herencia:

- ¿Las SITs detectadas siguen siendo las correctas para el negocio?
- ¿Hay tipos de información nuevos (cumpliendo nueva normativa) que no están cubiertos?
- ¿Las acciones (encrypt, watermark, block) son proporcionadas?

Los cambios se prueban en modo simulación (no aplican policy, solo registran qué habría pasado) durante 2 semanas antes de pasar a `enforce`.

---

## Glosario de términos clave del módulo

| Término | Definición breve |
|---|---|
| **Microsoft Purview** | Suite de gobernanza, riesgo y cumplimiento de Microsoft que cubre Information Protection, DLP, eDiscovery, Audit, Communication Compliance, Insider Risk y DSPM for AI. |
| **Information Protection** | Capacidad de Purview que aplica sensitivity labels a archivos y mensajes con acciones asociadas (cifrado, watermark, bloqueos). |
| **Sensitivity label** | Etiqueta clasificatoria (Public, Internal, Confidential, Highly Confidential) que dispara protecciones. Aplicable a archivos `.agent`, blueprints y outputs. |
| **DSPM for AI** | Data Security Posture Management for AI: dashboard de Purview específico para interacciones con IA generativa y agentes. |
| **Sensitive Information Types (SITs)** | Patrones reconocibles automáticamente (tarjetas, DNI, IBAN, etc.) que Purview usa para detectar datos sensibles sin necesidad de label manual. |
| **Auto-labeling** | Policy de Purview que aplica una sensitivity label a un archivo o output basándose en SITs detectados, sin intervención humana. |
| **Herencia de label** | Mecanismo por el que un output generado por un agente recibe la label más restrictiva de las fuentes consultadas. |
| **Audit (Premium)** | Tier de auditoría de Microsoft 365 con retención extendida y campos enriquecidos para Agent 365. Requiere E5 Compliance. |
| **eDiscovery (Premium)** | Capacidad de búsqueda y holds sobre el audit log y el contenido del tenant. Soporta filtros por `agentId`. |
| **Communication Compliance** | Capacidad de Purview que monitoriza conversaciones (incluyendo aquellas con participación de agentes) buscando riesgos como acoso, divulgación de información confidencial, comportamiento regulado. |
| **Endpoint DLP** | DLP aplicada en el dispositivo del usuario: bloquea o registra cuando el usuario intenta exfiltrar dato sensible (output de agente incluido) a aplicaciones no aprobadas o medios físicos. |
| **Insider Risk Management** | Capacidad de Purview que correlaciona patrones de comportamiento del usuario (incluyendo uso de agentes) para detectar riesgo de exfiltración. |
| **CloudAppEvents** | Tabla de Defender XDR que registra invocaciones de agentes con campos enriquecidos (`InputDataSensitivity`, `OutputDataSensitivity`). Será el foco de M12. |
| **Custodian hold** | Mecanismo de eDiscovery para preservar contenido relacionado con un agente o usuario bajo investigación, bloqueando borrado durante el periodo del hold. |

---

## Resumen del módulo

- Conditional Access (M09) decide si un agente puede acceder; Purview (M10) decide qué pasa con el dato una vez accedido. Son disciplinas complementarias.
- DSPM for AI es el dashboard de gobernanza diaria: top sensitive interactions, top apps, risky users, data oversharing.
- Las sensitivity labels aplican a archivos `.agent`, a blueprints y a outputs. Los outputs heredan automáticamente la label más restrictiva de las fuentes consultadas.
- Auto-labeling cubre archivos legacy sin etiquetar mediante detección de SITs (tarjetas, DNI, IBAN, etc.).
- La trazabilidad regulatoria depende del Audit Premium (retención hasta 10 años) y de búsquedas en eDiscovery Premium filtrables por `agentId`.
- La protección de outputs incluye cifrado AES-256 automático, watermark con UPN del usuario y restricciones de compartición. Endpoint DLP cubre la última milla en el dispositivo del usuario.
- La operación diaria de Purview con agentes son rituales: triaje semanal de DSPM, auditoría mensual de outputs, respuesta a solicitudes regulatorias, revisión trimestral de policies.

## Hacia el módulo siguiente

M11 profundiza en una de las capas más operativas de Purview que aquí solo hemos pincelado: **Data Loss Prevention (DLP) aplicado a agentes**. M11 cubre las policies DLP específicas para outputs de agentes, la integración con Microsoft Defender for Cloud Apps, y la mecánica de cómo se entrelazan auto-labeling, DLP y endpoint protection.
