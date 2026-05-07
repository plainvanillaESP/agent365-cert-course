---
modulo: 1
tipo: laboratorios
titulo: "Laboratorios del Módulo 01"
duracion_min: 15
area_examen: 1
estado: producido
fase_produccion: 2
ultima_actualizacion: 2026-05-06
laboratorios:
  - id: "01.1"
    titulo: "Mapeo de escenarios al producto correcto"
    duracion_min: 15
    dificultad: basico
    requiere_tenant: false
    licencias_requeridas: []
    roles_requeridos: []
---

# Módulo 01 — Laboratorios

> Este módulo no incluye laboratorios prácticos en tenant. Es un módulo conceptual de apertura del curso. En su lugar se propone un **ejercicio de mapeo** que refuerza la distinción entre los productos del ecosistema Microsoft AI/agentes.

---

## Prerrequisitos

- **Tenant:** no requerido
- **Licencias:** no requeridas
- **Roles:** no requeridos
- **Tiempo total estimado:** 15 minutos

---

## Ejercicio 01.1 — Mapeo de escenarios al producto correcto

**Objetivo:** consolidar la distinción entre los seis productos del ecosistema (Microsoft Agent 365, Copilot Control System, Copilot Studio, Foundry, M365 Agents SDK, Agent 365 SDK).

**Duración:** 15 min
**Dificultad:** Básico
**Modalidad:** individual o en pequeños grupos

### Instrucciones

Lee cada uno de los 10 escenarios siguientes y decide **qué producto** es la respuesta correcta. Algunos escenarios pueden tener más de un producto válido — en ese caso, indica el principal y por qué.

Los productos son:

| Sigla | Producto |
|---|---|
| **A365** | Microsoft Agent 365 |
| **CCS** | Copilot Control System |
| **CS** | Microsoft Copilot Studio |
| **FOU** | Microsoft Foundry |
| **M365-SDK** | Microsoft 365 Agents SDK |
| **A365-SDK** | Microsoft Agent 365 SDK |

### Escenarios

1. *El equipo de RR.HH. quiere construir un agente que conteste preguntas sobre la política de vacaciones a partir de un PDF.*

2. *El CIO pregunta cuántos agentes hay activos en el tenant y de qué plataforma proceden.*

3. *Un empleado se va de la empresa y quiere asegurarse de que sus 4 agentes Copilot Studio pasan automáticamente a su manager.*

4. *El director de RR.HH. quiere medir si Microsoft 365 Copilot ha mejorado la productividad del equipo en los últimos 3 meses.*

5. *Un desarrollador quiere extender un agente que ya tiene funcionando en LangGraph para que tenga una identidad de directorio y telemetría OpenTelemetry.*

6. *Un equipo de finanzas quiere construir un agente con flujo conversacional complejo que mande mensajes en Teams y pueda escalar a un humano si el caso es complicado.*

7. *El equipo de seguridad quiere bloquear en runtime cualquier intento de un agente de invocar una tool específica si detecta patrones de prompt injection.*

8. *El equipo de IT quiere que ciertos documentos de SharePoint con sensitivity label «Confidential» no sean accesibles ni siquiera por humanos vía Microsoft 365 Copilot.*

9. *Un partner externo quiere construir un agente especializado en análisis de contratos con LLMs custom y arquitectura propia, integrable después con el resto del ecosistema Microsoft.*

10. *El CISO quiere recibir alertas cuando un agente sea identificado como high risk por Identity Protection y bloquear automáticamente sus tokens.*

### Plantilla de respuesta

| # | Producto principal | Justificación (1-2 líneas) |
|---|---|---|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |
| 6 | | |
| 7 | | |
| 8 | | |
| 9 | | |
| 10 | | |

---

## Solución comentada

<details>
<summary>Ver solución</summary>

| # | Producto | Justificación |
|---|---|---|
| 1 | **CS** | Construcción de un agente declarativo con base de conocimiento documental. Caso típico de Copilot Studio (canvas + connectors). No es A365 porque A365 no construye, gobierna. |
| 2 | **A365** | Inventario de agentes en el tenant — exactamente el propósito del Agent Registry. |
| 3 | **A365** | Lifecycle workflows + sponsorship transfer son capacidades de Microsoft Entra Agent ID, parte del control plane Agent 365. |
| 4 | **CCS** | Métricas de adopción y productividad de **humanos** usando Copilot. Capacidad de Copilot Analytics + Copilot Dashboard, dentro del pilar Measurement & Reporting de CCS. |
| 5 | **A365-SDK** | Extender un agente existente con identidad Entra-backed y observabilidad OpenTelemetry es exactamente lo que el Microsoft Agent 365 SDK ofrece. **No es** el M365 Agents SDK (que cubriría el transporte conversacional, no la gobernanza). |
| 6 | **CS** o **M365-SDK** | Si se prioriza low-code / canvas visual y conexión a sistemas internos: Copilot Studio. Si se prioriza control completo del flujo de transporte y multicanal (Teams + Slack): M365 Agents SDK. Los dos son válidos; la decisión es de arquitectura, no de producto único. |
| 7 | **A365** | Real-time protection durante runtime es una capacidad de Microsoft Defender, integrada en el control plane Agent 365. |
| 8 | **CCS** | Foundational tier de CCS con sensitivity labels + DSPM for AI cubre que humanos vía Copilot no descubran documentos confidenciales por oversharing. **No es A365** porque la pregunta es sobre acceso humano, no de agentes. |
| 9 | **FOU** | Construcción de un agente pro-code con LLMs custom y arquitectura propia. Microsoft Foundry es el entorno apropiado. Una vez construido, A365 puede gobernarlo si se registra. |
| 10 | **A365** | Identity Protection para agentes + Conditional Access con grant Block es la combinación de capacidades dentro de Microsoft Entra Agent ID, parte de Agent 365. |

### Patrones de error frecuentes

- Confundir CCS con A365 en escenarios donde el sujeto es **humano** (4, 8) versus **agente** (2, 3, 7, 10). La regla mnemotécnica funciona: si la frase es sobre **personas usando IA**, es CCS; si es sobre **lo que hace el agente**, es A365.
- Confundir los **dos SDKs**: ambos llevan *«Agents»* en el nombre pero el M365 Agents SDK es transporte y el Agent 365 SDK es gobernanza.
- Pensar que A365 «sustituye» a CS o FOU. No los sustituye; los gobierna.
</details>

---

## Validación

Tras completar el ejercicio:

- [ ] Cada uno de los 10 escenarios tiene una asignación de producto.
- [ ] La justificación está expresada en términos de qué hace cada producto, no en términos de marca.
- [ ] Si hay duda en algún escenario, se ha consultado la solución y se ha entendido la lógica detrás de la asignación.
- [ ] El alumno puede explicar la diferencia entre CCS y Agent 365 sin titubear.
- [ ] El alumno puede explicar la diferencia entre M365 Agents SDK y Agent 365 SDK sin titubear.

Si las cinco condiciones se cumplen, el alumno está listo para el Módulo 02.
