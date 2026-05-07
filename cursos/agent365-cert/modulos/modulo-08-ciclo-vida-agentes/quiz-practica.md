---
modulo: 8
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 08"
duracion_min: 14
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-07
preguntas:
  - Q-08-1
  - Q-08-2
  - Q-08-3
  - Q-08-4
  - Q-08-5
  - Q-08-6
caso_estudio: "Plain Coffee SL"
---

# Módulo 08 — Quiz de práctica

> Seis preguntas para validar tu comprensión del ciclo de vida de los agentes y de las 11 acciones de gobernanza. Intentos ilimitados, aprobado a partir del 70 %.
>
> Estas preguntas son distintas a las del examen final del curso. Cubren los 6 OAs con escenarios y datos diferentes.

---

::: pregunta
id: Q-08-1
oa: OA-08.1
tipo: multiple-response
dificultad: media
bloom: Recordar
enunciado: |
  De las 11 acciones de gobernanza disponibles sobre un agente desde el M365 admin center, ¿cuáles son **irreversibles** o tienen ventana de retroceso muy limitada (<24 h)? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "Pin"
  - id: b
    texto: "Block (bloqueo definitivo del agente)"
    correcta: true
  - id: c
    texto: "Delete (eliminación del directorio)"
    correcta: true
  - id: d
    texto: "Approve update"
  - id: e
    texto: "Activate"
  - id: f
    texto: "Reassign Ownership"
justificacion: |
  Las acciones irreversibles o con ventana de retroceso muy limitada son **Delete** (24 h de ventana via `Restore-Agent365Agent`, después borrado físico del SharePoint Embedded container) y **Block** (bloqueo del agente con bandera permanente; el desbloqueo requiere intervención manual con justificación auditable). Las otras son reversibles sin ventana: Pin se quita con Unpin, Approve update se puede revertir con un nuevo update, Activate se puede pasar a Removed y luego Active de nuevo, Reassign Ownership es una operación de cambio de campo (revertible repitiéndola).
:::

::: pregunta
id: Q-08-2
oa: OA-08.4
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  El compañero Pedro eliminó por error el agente «Comercial-Forecast» **hace 26 horas**. El agente era usado por 80 personas del equipo Comercial y los flujos de Forecast están parados. Pedro pregunta cómo recuperarlo. ¿Qué le respondes?
opciones:
  - id: a
    texto: "Ejecutar Restore-Agent365Agent -Id <agent-id> con rol Global Administrator. Tarda menos de 5 minutos en restaurar."
  - id: b
    texto: "El agente ya no se puede recuperar: la ventana de 24 h ha expirado y el SharePoint Embedded container ya está marcado para borrado físico. Hay que recrear el agente desde cero (o desde un backup del .agent file si existe) y volver a publicarlo. Mientras, comunicar al equipo Comercial el plazo estimado."
    correcta: true
  - id: c
    texto: "Pedir al equipo de Defender XDR que restaure el agente desde el AI Agent Inventory."
  - id: d
    texto: "Restaurar el agent identity en Microsoft Entra; con eso el agente vuelve a aparecer en el Registry."
justificacion: |
  La ventana de retroceso de Delete es **24 h**. A las 26 h, `Restore-Agent365Agent` devuelve `404 Not Found` y el contenedor SharePoint Embedded está marcado para borrado físico. La opción A es falsa por la ventana expirada. La C inventa una capacidad de Defender (no restaura agentes). La D confunde agent identity (Entra) con el agente del Registry: restaurar la identity no recompone el `.agent` ni el contenido SharePoint asociado. La respuesta operativa es la B: recrear desde cero o desde un export del `.agent` file si existía, y comunicar el incidente. La lección aprendida: la diferencia entre `Remove` (reversible) y `Delete` (24 h) es crítica. **Siempre Remove primero, esperar y solo entonces Delete.**
:::

::: pregunta
id: Q-08-3
oa: OA-08.3
tipo: multiple-choice
dificultad: media
bloom: Aplicar
enunciado: |
  Has pineado el agente «Servicio-IT-FAQ» al slot **Administrator** para todo el grupo «Empleados nuevos». 30 minutos después, los empleados nuevos se quejan de que no ven el agente en su panel. ¿Cuál es la causa más probable?
opciones:
  - id: a
    texto: "Pin no se aplicó: hay que volver a ejecutar la acción."
  - id: b
    texto: "El slot Administrator solo es visible para usuarios con rol IT Administrator; los empleados normales no ven los agentes pineados ahí."
  - id: c
    texto: "La propagación de Pin a la UI cliente puede tardar hasta 6 horas por caching. Es comportamiento esperado."
    correcta: true
  - id: d
    texto: "El agente debe estar también pineado al slot User para que los usuarios lo vean."
justificacion: |
  La propagación de Pin a la UI cliente tiene una latencia de **hasta 6 horas** por caching en los clientes Office (Word, Outlook, Teams). 30 minutos es muy poco para diagnosticar un fallo: el comportamiento esperado es esperar a que se propague. La opción A es prematura. La B es falsa: el slot Administrator es la sección «Recommended by IT» visible para todos los usuarios del scope, NO un slot exclusivo para admins. La D inventa un requisito (los slots son alternativos, no acumulables: pinear al slot Administrator basta para que los usuarios del scope vean el agente).
:::

::: pregunta
id: Q-08-4
oa: OA-08.5
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  Maria, owner de un agente Foundry «Análisis-Riesgo» en el departamento Riesgos, deja la organización. El equipo te pide reasignar la propiedad técnica del agente a su sucesor. ¿Desde dónde lo gestionas?
opciones:
  - id: a
    texto: "Microsoft 365 admin center → Agents → Registry → seleccionar agente → Reassign Ownership."
  - id: b
    texto: "Microsoft 365 admin center → Agents → Settings → Ownership reassignment policy."
  - id: c
    texto: "Azure portal → AI Foundry resource → Access control (IAM) → asignar el rol owner equivalente al sucesor de Maria."
    correcta: true
  - id: d
    texto: "Power Platform admin center → Environments → Apps → Reassign Ownership."
justificacion: |
  La acción Reassign Ownership desde el M365 admin center **solo está disponible para agentes Agent Builder**. Para agentes Foundry, la propiedad técnica se gestiona desde **Azure portal** → recurso AI Foundry → Access control (IAM) asignando los roles correspondientes al sucesor de Maria. La opción A es la trampa más frecuente del módulo (es donde la mayoría intuye ir, pero solo aplica a Agent Builder). La B inventa una pantalla. La D aplicaría si fuera un agente **Copilot Studio**, no Foundry. Saber la plataforma de origen del agente es prerequisito para saber dónde reasignar ownership.
:::

::: pregunta
id: Q-08-5
oa: OA-08.6
tipo: drag-and-drop
dificultad: media
bloom: Aplicar
enunciado: |
  Empareja cada **acción de gobernanza** con la **categoría** del ciclo de vida a la que pertenece principalmente.
items:
  - id: g1
    texto: "Approve update (revisar y aprobar la nueva versión publicada)."
  - id: g2
    texto: "Pin (fijar al slot Administrator del catálogo)."
  - id: g3
    texto: "Block (bloquear definitivamente el agente)."
  - id: g4
    texto: "Reassign Ownership (cambiar el owner técnico)."
  - id: g5
    texto: "Remove (retirar del despliegue, reversible)."
  - id: g6
    texto: "Activate (aprobar y dejar activo en el catálogo)."
targets:
  - id: deploy
    label: "Activación / Despliegue"
  - id: visibility
    label: "Visibilidad y promoción"
  - id: maintenance
    label: "Mantenimiento (cambios y updates)"
  - id: retirement
    label: "Retirada / Bloqueo"
correct_map:
  g1: maintenance
  g2: visibility
  g3: retirement
  g4: maintenance
  g5: retirement
  g6: deploy
justificacion: |
  Las 11 acciones de gobernanza se agrupan funcionalmente en cuatro categorías:

  - **Activación / Despliegue:** Activate, Deploy.
  - **Visibilidad y promoción:** Pin, Unpin.
  - **Mantenimiento:** Approve update, Reassign Ownership, Edit metadata.
  - **Retirada / Bloqueo:** Remove, Block, Delete, Restore.

  Conocer la categoría te permite anticipar el impacto de la acción y el procedimiento aplicable (notificación a usuarios, ventana de retroceso, audit log esperado).
:::

::: pregunta
id: Q-08-6
oa: OA-08.2
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  En el wizard de publishing de Microsoft Agent 365 hay 6 pasos. ¿En cuál se aplica la **Custom Template** que tu organización ha definido para imponer políticas comunes a una categoría de agentes?
opciones:
  - id: a
    texto: "Paso 1 — Choose source platform"
  - id: b
    texto: "Paso 3 — Define metadata"
  - id: c
    texto: "Paso 5 — Apply Template"
    correcta: true
  - id: d
    texto: "Paso 6 — Permissions review"
justificacion: |
  El **paso 5 — Apply Template** es donde el admin selecciona qué Default Template o Custom Template se aplica al agente que se está publicando. Las políticas configuradas en la template se aplican automáticamente al agente sin tener que seleccionarlas una por una. El paso 6 (Permissions review) es la revisión final de permisos efectivos antes de Activate. Las opciones A y B son pasos previos del flujo (selección de plataforma origen y metadatos descriptivos). Saber el orden del wizard ayuda a documentar SOPs internas y a entrenar a los aprobadores.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M09.

**Escenario.** **Plain Coffee SL** ha recibido 12 propuestas de nuevos agentes en una semana: 4 de Comercial, 3 de Operaciones, 2 de RRHH, 2 de Finanzas y 1 de Legal. El equipo IT debe procesar las solicitudes ordenadamente respetando los SLA acordados (aprobación o rechazo en 5 días laborables) y manteniendo trazabilidad para auditoría.

**Tareas.**

1. Diseña la rutina diaria del IT admin sobre la página Overview que asegura que ningún Pending request queda sin tocar más de 24 h.
2. Define qué Custom Templates tendría sentido tener pre-creadas para acelerar el wizard de publishing en cada departamento.
3. Establece el protocolo de comunicación con el solicitante cuando se aprueba (Activate + Deploy) y cuando se rechaza (no se Activa y se notifica al solicitante con el motivo).

<details>
<summary>Ver solución sugerida</summary>

**1. Rutina diaria del IT admin.**

- 09:00 — Abrir Overview, mirar «Pending requests» y «With exceptions» (10-15 min).
- Si hay > 3 pending → contactar al solicitante para aclaraciones por Teams si la propuesta tiene huecos.
- Si hay incidentes en «Agents at risk» → triagear con Defender admin antes de procesar nuevos.
- 16:00 — Cierre del día: actualizar el ticket interno de cada Pending procesado.
- KPI semanal: % de pending resueltos en < 5 días laborables (objetivo > 95 %).

**2. Custom Templates pre-creadas por departamento.**

| Template | Departamentos destino | Políticas clave |
|---|---|---|
| ComercialTemplate | Comercial | DLP no Confidential, SharePoint cross-site bloqueado, sensitivity Internal |
| FinanzasTemplate | Finanzas | DLP block on Confidential, MFA + dispositivo compliant, logging verbose |
| RRHHTemplate | RRHH | DLP block on HighlyConfidential, sharing externo bloqueado, sensitivity Confidential mínimo |
| OperacionesTemplate | Operaciones | DLP standard, integraciones aprobadas con sistemas internos |
| LegalTemplate | Legal | Máximo restrictivo: HighlyConfidential, MFA + dispositivo compliant + on-trusted-network |

**3. Protocolo de comunicación.**

- **Aprobación (Activate + Deploy):** email del IT admin al solicitante con el `agent-id`, la URL del agente en Teams y el guidance de uso responsable. Cc'd al sponsor del departamento.
- **Rechazo:** reunión de 30 min con el solicitante explicando los motivos (técnicos, de riesgo, de duplicidad con otro agente existente) y proponiendo alternativas. Documentar la decisión en el audit log con justificación.

Mantener una **lista de razones de rechazo recurrentes** para detectar gaps en la formación de creadores y mejorar el flujo aguas arriba.

</details>
