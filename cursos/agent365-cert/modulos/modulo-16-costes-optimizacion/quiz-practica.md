---
modulo: 16
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 16"
duracion_min: 12
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-11
preguntas:
  - Q-16-1
  - Q-16-2
  - Q-16-3
  - Q-16-4
  - Q-16-5
caso_estudio: "Mapfre"
---

# Módulo 16. Quiz de práctica

> Cinco preguntas para validar tu comprensión del modelo TCO de Agent 365, la optimización de licencias y catálogo, el tiering de retención y el ciclo de mejora continua. Intentos ilimitados, aprobado a partir del 70 por ciento (4 de 5 correctas).

---

::: pregunta
id: Q-16-1
oa: OA-16.1
tipo: multiple-response
dificultad: facil
bloom: Recordar
enunciado: |
  ¿Cuáles de las siguientes son las **cuatro líneas canónicas** del TCO de un programa Agent 365 según el módulo? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "**Licencias** (Copilot 365 por usuario, M365 E5 si aplica, add-ons Purview y Defender específicos)."
    correcta: true
  - id: b
    texto: "**Ingestión de telemetría** (CloudAppEvents en Sentinel, custom tables de Agent 365, logs de Logic Apps de playbooks)."
    correcta: true
  - id: c
    texto: "**Almacenamiento de audit** (tier interactivo Sentinel, archive Sentinel LTR, blob storage opcional)."
    correcta: true
  - id: d
    texto: "**Operación interna** (FTE del SOC dedicados a Agent 365, FTE de gobernanza de IA, formación recurrente, consultoría externa puntual)."
    correcta: true
  - id: e
    texto: "Coste de los dispositivos de los usuarios finales (portátiles, móviles, periféricos)."
  - id: f
    texto: "Coste de marketing interno del programa."
justificacion: |
  Las cuatro líneas canónicas son L1 licencias, L2 ingestión, L3 almacenamiento y L4 operación interna. Las opciones E y F no son líneas canónicas del TCO de Agent 365: los dispositivos pertenecen al coste IT general, y el marketing interno se contabiliza dentro de adopción organizativa pero no se reporta como línea separada del programa. El error más común es omitir L4 (la más difícil de calcular) y reportar al CFO solo las tres primeras, lo que infla aparentemente la rentabilidad entre un 25 y un 40 por ciento.
:::

::: pregunta
id: Q-16-2
oa: OA-16.2
tipo: ordering
dificultad: media
bloom: Aplicar
enunciado: |
  Ordena los pasos correctos de la **regla de cuarentena 30/30** para retirar una licencia Copilot 365 infrautilizada, desde el primer paso hasta el último.
items:
  - id: p1
    texto: "**Detectar candidatos.** Query a CCS Usage analytics: licencias asignadas hace al menos 60 días con menos de 5 invocaciones en los últimos 30 días."
  - id: p2
    texto: "**Día 1-30: aviso y coaching.** Email al usuario con copia al manager. Ofrecer sesión de coaching de 30 minutos con el equipo de adopción. Hipótesis por defecto: el usuario no sabe cómo aprovechar Copilot."
  - id: p3
    texto: "**Día 31-60: monitorización.** Si el usuario incrementa el uso por encima del umbral, cerrar como recuperación exitosa. Si sigue por debajo, notificar retirada al cierre del periodo."
  - id: p4
    texto: "**Día 61: retirada y reasignación.** La licencia se retira y entra en el pool de reasignación, ofrecida a la siguiente persona de la waitlist según el criterio de priorización del comité de adopción."
  - id: p5
    texto: "**Documentación en CCS.** Reasignación documentada con motivo, usuario origen, usuario destino y fecha, para trazabilidad cuando finanzas pida histórico."
correct_order:
  - p1
  - p2
  - p3
  - p4
  - p5
justificacion: |
  La regla 30/30 distribuye el ciclo en dos ventanas de 30 días para dar al usuario oportunidad real de recuperación con soporte antes de retirar la licencia. La hipótesis por defecto de los primeros 30 días (falta de formación, no falta de interés) recupera típicamente el 30 a 40 por ciento de los candidatos. Saltarse cualquier paso es antipatrón: la retirada masiva tras auditoría puntual (saltar pasos 2 y 3) genera resentimiento y daña la marca interna del programa. La documentación final (paso 5) es lo que permite reconstruir trazabilidad ante auditorías futuras y conversaciones con finanzas. La conversación con el manager es esencial en el paso 2: nunca se retira una licencia sin que el manager esté informado.
:::

::: pregunta
id: Q-16-3
oa: OA-16.3
tipo: scenario
dificultad: media
bloom: Aplicar
enunciado: |
  El owner de un agente de compliance fiscal te objeta una propuesta de retirada: el agente tiene solo 3 invocaciones mensuales de media en los dos últimos trimestres, pero argumenta que «es esencial para auditoría regulatoria, aunque se use poco». ¿Cuál es la respuesta operativamente correcta?
opciones:
  - id: a
    texto: "Mantener la propuesta de retirada: el umbral de 5 invocaciones mensuales en dos trimestres consecutivos es objetivo y no admite excepciones."
  - id: b
    texto: "Evaluar la objeción como **caso a caso del comité de mejora continua**. El criterio cuantitativo (menos de 5 invocaciones mensuales en dos trimestres) detecta candidatos a retirada, pero la decisión final pondera valor cualitativo no medible en invocaciones. Un agente de compliance que se invoca poco pero es necesario para auditoría puede mantenerse con justificación documentada, revisable trimestre a trimestre. La regla del módulo es explícita: el comité decide caso a caso."
    correcta: true
  - id: c
    texto: "Retirar el agente inmediatamente: si el owner quiere mantenerlo debe haberlo defendido antes del periodo de 30 días de aviso."
  - id: d
    texto: "Pasar la decisión al CISO para que arbitre."
justificacion: |
  La opción B refleja la disciplina del módulo 16.3.2: «aplicar break-even sin matices es peligroso; un agente puede tener valor cualitativo no medible en invocaciones; el comité decide caso a caso». La A interpreta el umbral como regla rígida, lo que produce retiradas de agentes valiosos en términos cualitativos. La C confunde el plazo de notificación con el plazo de objeción: el owner está usando precisamente la ventana del procedimiento para presentar su caso. La D abdica la responsabilidad operativa del responsable de gobernanza: el comité de mejora continua tiene autoridad para decidir excepciones argumentadas; escalar al CISO retrasa la respuesta y satura la atención ejecutiva. La decisión correcta es someter la objeción al comité con métricas adicionales: ¿cuántos casos de auditoría se han resuelto gracias al agente este año? ¿hay alternativa más barata? El comité decide con esos datos.
:::

::: pregunta
id: Q-16-4
oa: OA-16.4
tipo: scenario
dificultad: dificil
bloom: Analizar
enunciado: |
  La factura mensual de Sentinel sube un 80 por ciento en tres meses sin que el volumen de invocaciones haya cambiado significativamente. El SRE propone aplicar un filtro de ingestión al data connector de Defender XDR para descartar el 30 por ciento de eventos `AgentInvoke` con menor riqueza de metadata, argumentando que «son eventos rutinarios que no aportan valor». ¿Cuál es la respuesta operativamente correcta?
opciones:
  - id: a
    texto: "Aprobar el filtro: si el SRE es responsable de coste, su análisis técnico debe prevalecer; un 30 por ciento es ahorro relevante."
  - id: b
    texto: "**Rechazar el filtro y diagnosticar la causa raíz del incremento de coste**. Los eventos `AgentInvoke` son material de audit y trazabilidad regulatoria; filtrarlos es prohibido por la regla operativa de filtros seguros. La causa raíz probable está en otra dimensión: falta de tiering (todo en caliente), custom tables sobredimensionadas, ausencia de capacidad reservada, o subida real de invocaciones que el dashboard no captura todavía. Aplicar tiering (30 días caliente, resto en frío) reduce L3 entre 5 y 20 veces sin sacrificar trazabilidad. Cualquier filtro de ingestión requiere aprobación del comité central con documentación."
    correcta: true
  - id: c
    texto: "Aprobar el filtro condicionado a una revisión en 3 meses: si no hay incidentes, el filtro se mantiene definitivamente."
  - id: d
    texto: "Pasar el filtro al CISO para que decida y delegar la responsabilidad."
justificacion: |
  La opción B aplica la disciplina del módulo 16.4.2: los filtros que eliminan eventos de invocación, eventos de cambio de configuración o eventos de seguridad son prohibidos porque comprometen la trazabilidad regulatoria. La A confunde autoridad técnica con criterio de gobernanza: el SRE puede tener razón en el ahorro de coste pero el riesgo regulatorio supera el ahorro. La C es la trampa del filtro permanente: «si no hay incidentes» es muy difícil de comprobar en ausencia de los datos filtrados (la incidencia podría detectarse meses después en auditoría externa, no en monitorización rutinaria). La D abdica la responsabilidad y no aporta diagnóstico. El procedimiento correcto es investigar la causa raíz real (típicamente: falta de tiering o de capacidad reservada), aplicar tiering canónico que reduce L3 sin perder datos, y reservar capacidad si el volumen está estabilizado. Este escenario es el equivalente al LAB-15-2: el filtro de ingestión es exactamente el antipatrón que generó el audit log gap descrito en M15.
:::

::: pregunta
id: Q-16-5
oa: OA-16.5
tipo: multiple-response
dificultad: media
bloom: Aplicar
enunciado: |
  Sobre el **ciclo trimestral de mejora continua** del programa Agent 365, ¿cuáles de las siguientes afirmaciones son correctas? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "El comité revisa **cuatro inputs canónicos** cada trimestre: KPIs financieros, lecciones aprendidas de incidents, evolución del catálogo y feedback de adopción."
    correcta: true
  - id: b
    texto: "Los **outputs** del comité son tres: decisiones del trimestre con owner y fecha, reporte ejecutivo de una página al comité de dirección, y comunicación al equipo extendido."
    correcta: true
  - id: c
    texto: "El **finance partner** es asistente obligatorio: sin contraste con la realidad presupuestaria, el TCO reportado es un cálculo desconectado de la organización."
    correcta: true
  - id: d
    texto: "El comité debe ser **informativo, no decisorio**: las decisiones se toman después por el CIO en privado con los datos del comité."
  - id: e
    texto: "**Revisar el estado de las decisiones del trimestre anterior** es parte esencial: sin esa revisión, el comité es un loop sin progreso."
    correcta: true
  - id: f
    texto: "Un comité que **nunca retira agentes** acumula deuda en el catálogo trimestre a trimestre. Retirar al menos uno por trimestre es indicador de salud del proceso."
    correcta: true
justificacion: |
  Las opciones A, B, C, E y F describen las propiedades canónicas del comité documentadas en la sección 16.5. La opción D es el antipatrón principal: si el comité es informativo y no decisorio, no hay incentivo para presentar análisis robustos y las decisiones efectivas se toman fuera del foro con visibilidad reducida. La autoridad de decisión en el comité es lo que justifica el esfuerzo de los participantes. La F captura un patrón sutil pero importante: un catálogo que solo crece y nunca decrece acumula coste sin retorno; la retirada activa es señal de salud, no de fallo. La C subraya la diferencia entre TCO calculado por gobernanza (puede ser correcto técnicamente) y TCO contrastado con finance (se confronta con la realidad presupuestaria, las imputaciones contables y el ciclo financiero de la organización).
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar al examen final.

**Escenario.** **Mapfre** (15.000 empleados a nivel global, sector seguros regulado por DGSFP en España, M365 E5 + Agent 365 desplegado a 4.500 usuarios distribuidos entre España y Latinoamérica). Han completado 12 meses de programa y el CFO ha pedido al responsable de gobernanza de IA un plan trimestral de optimización para el año fiscal siguiente. La situación de partida:

- **TCO mensual actual.** 158.000 EUR. Distribución: L1 licencias 102.000 (65 por ciento), L2 ingestión 31.000 (19 por ciento), L3 almacenamiento 9.000 (6 por ciento), L4 operación 16.000 (10 por ciento).
- **Licencias.** 4.500 Copilot 365 asignadas. Un análisis preliminar identifica 540 (12 por ciento) con menos de 5 invocaciones en los últimos 30 días.
- **Catálogo.** 87 agentes activos. 11 con menos de 5 invocaciones mensuales en los últimos dos trimestres.
- **Ingestión.** Pay-as-you-go en Sentinel; retención uniforme a 90 días en tier caliente; sin tiering implementado.
- **Operación.** SOC tier 2 dedicado al programa con 2 FTE, equipo de gobernanza con 1 FTE, contrato MSP externo de 8.000 EUR/mes.

**Tareas.**

1. Diagnostica las **3 oportunidades de optimización principales** ordenadas por impacto económico estimado.
2. Diseña el **plan a 4 trimestres** con acciones concretas, owner y ahorro estimado por trimestre.
3. Define los **KPIs** que se reportarán al comité de dirección cada trimestre.
4. Identifica **2 a 3 riesgos** del plan y cómo mitigarlos.

<details>
<summary>Ver solución sugerida</summary>

**1. Tres oportunidades de optimización principales.**

| # | Oportunidad | Línea TCO | Ahorro estimado mensual |
|---|---|---|---|
| 1 | **Aplicar tiering de retención de audit** (30 días caliente, resto en archive LTR) en lugar de retención uniforme a 90 días en tier caliente | L3 (y parcialmente L2) | 4.000 a 6.000 EUR |
| 2 | **Aplicar regla 30/30 a las 540 licencias infrautilizadas** y reasignar a waitlist; estimar recuperación del 30 a 40 por ciento, retirar el resto y no comprar 200 a 300 licencias adicionales | L1 | 8.000 a 11.000 EUR |
| 3 | **Capacidad reservada anual** de Sentinel tras 12 meses de pay-as-you-go con volumen estable | L2 | 4.500 a 6.500 EUR (15 a 20 por ciento de L2) |

Ahorro mensual total estimado: 16.500 a 23.500 EUR. Anualizado: 198.000 a 282.000 EUR.

Adicionalmente, sin impacto en el ahorro directo pero relevante para salud del programa:

- Retirar los 11 agentes zombi tras procedimiento de aviso al owner y transición de usuarios.
- Revisar contrato MSP: ¿qué actividades hace el MSP que ya podrían internalizarse al tener SOC propio? La transición progresiva podría liberar 3.000 a 5.000 EUR/mes adicionales al cabo de 6 meses.

**2. Plan a 4 trimestres.**

| Trimestre | Acciones | Owner | Ahorro mensual al final del trimestre |
|---|---|---|---|
| Q1 | Aplicar tiering de retención (configurar archive de Sentinel LTR, mover datos > 30 días). Lanzar regla 30/30 sobre las 540 licencias (mes 1: aviso; mes 2: monitorización; mes 3: retiradas iniciales) | Responsable gobernanza IA + SRE | 5.000 EUR |
| Q2 | Completar reasignación de licencias retiradas (estimado: 300 a 350 retiradas, 200 a 250 reasignadas a waitlist). Retirar agentes zombi tras procedimiento de aviso | Responsable gobernanza IA + Comité adopción | 12.000 EUR acumulado |
| Q3 | Capacidad reservada anual de Sentinel con dato real de volumen de los 12 meses anteriores. Evaluar reducción de scope del contrato MSP | Responsable gobernanza IA + Finance partner | 18.000 EUR acumulado |
| Q4 | Estabilizar la nueva línea base. Auditar el ciclo del año: ¿el comité ha tomado decisiones? ¿el catálogo ha retirado tanto como ha incorporado? Preparar plan del año siguiente | Comité completo | 22.000 EUR acumulado (estimado) |

Ahorro anualizado estimado al final del año: 264.000 EUR sobre el TCO de partida de 1.896.000 EUR anuales (14 por ciento de reducción).

**3. KPIs trimestrales al comité de dirección.**

| KPI | Valor de partida | Objetivo año 1 |
|---|---|---|
| TCO mensual total | 158.000 EUR | 136.000 EUR (-14 por ciento) |
| TCO por usuario activo | 35,11 EUR | 30,22 EUR |
| Ratio de productividad por licencia | A medir | > 8 |
| Licencias infrautilizadas | 540 (12 por ciento) | < 100 (< 3 por ciento) |
| Agentes zombi en catálogo | 11 | 0 |
| Proporción L2 + L3 sobre TCO | 25 por ciento | < 18 por ciento |
| Número de decisiones ejecutadas del comité previo | (primer ciclo) | > 80 por ciento ejecutadas |

**4. Riesgos del plan y mitigación.**

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| Resistencia organizativa a retiradas de licencia (managers protestan en nombre de sus equipos) | Alta | Comunicación previa al comité ejecutivo con datos del análisis y narrativa de reasignación, no de recorte. Casos de éxito visibles tras el primer trimestre |
| Capacidad reservada calculada con volumen no estabilizado | Media | Esperar al menos 9 meses de pay-as-you-go con tendencia plana antes de reservar; arrancar con reserva del 80 por ciento del volumen para dejar margen pay-as-you-go |
| Pérdida de trazabilidad regulatoria por error en el tiering | Baja pero alto impacto | Validar antes de mover datos: ejecutar reconciliación cruzada (CCS, Purview, Defender) durante 2 semanas para confirmar coincidencia ±0,1 por ciento. Solo después aplicar tiering. Documentar el procedimiento |
| Retirada de agente zombi cuya importancia cualitativa no se había documentado | Media | Cada retirada pasa por aviso al owner de 30 días y notificación a usuarios actuales con alternativas; sin objeción argumentada en ese periodo, retirar |

El plan está alineado con el ciclo trimestral del módulo y produce ahorro material, pero el resultado real depende de la disciplina del comité para ejecutar las decisiones tomadas. Un comité informativo en lugar de decisorio no produciría estos resultados.

</details>
