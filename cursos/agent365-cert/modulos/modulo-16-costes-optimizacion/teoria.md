---
modulo: 16
tipo: teoria
titulo: "Costes, optimización y mejores prácticas"
duracion_lectura_min: 45
ultima_actualizacion: 2026-05-11
objetivos_aprendizaje:
  - id: OA-16.1
    texto: "Construir el modelo de coste total de propiedad (TCO) de un programa Agent 365 separando las cuatro líneas canónicas: licencias, ingestión de telemetría, almacenamiento de audit y operación interna."
    bloom: Aplicar
  - id: OA-16.2
    texto: "Optimizar la asignación de licencias Copilot 365 reasignando inactivos detectados en CCS Usage analytics con la regla de cuarentena 30/30 antes de retirar la licencia."
    bloom: Aplicar
  - id: OA-16.3
    texto: "Optimizar el catálogo de agentes aplicando el criterio de retirada por uso (agentes con menos de 5 invocaciones mensuales en dos trimestres consecutivos)."
    bloom: Aplicar
  - id: OA-16.4
    texto: "Optimizar el coste de ingestión y retención de audit aplicando tiering CloudAppEvents en Defender XDR (30 días caliente) y archive a Sentinel LTR (hasta 12 años) sin sacrificar la trazabilidad regulatoria."
    bloom: Analizar
  - id: OA-16.5
    texto: "Operar el ciclo de mejora continua trimestral del programa Agent 365 con cuatro inputs canónicos: KPIs financieros, lecciones aprendidas de incidents, evolución del catálogo y feedback de adopción."
    bloom: Aplicar
---

# Módulo 16. Costes, optimización y mejores prácticas

> **Duración estimada de lectura:** 45 minutos.
>
> **Prerrequisitos:** M03, M10, M11, M12, M13, M14.
>
> Los módulos previos cubren el diseño, despliegue, gobernanza, monitorización y troubleshooting de Agent 365. M16 cierra el temario con lo que diferencia a un programa que sobrevive un año del que sobrevive cinco: la disciplina de medir su coste, optimizarlo trimestre a trimestre y aprender de cada incidente. Las organizaciones que tratan Agent 365 como una iniciativa de proyecto fijo terminan con licencias infrautilizadas, agentes zombi en el catálogo y un audit log que cuesta más de lo que aporta. Las que lo tratan como una capacidad operativa con su propio ciclo financiero capturan el valor de la inversión.

---

## 16.1 Modelo de coste total: las cuatro líneas canónicas

Antes de optimizar nada hay que medir el coste real. El error más común es reportar al CFO solo el coste de licencias Copilot 365 e ignorar el resto. Eso subestima el TCO típicamente entre un 25 y un 40 por ciento y produce decisiones financieras erróneas.

### 16.1.1 Las cuatro líneas

El TCO de un programa Agent 365 tiene cuatro líneas canónicas que se reportan siempre por separado:

| Línea | Qué incluye | Naturaleza |
|---|---|---|
| **L1. Licencias** | Copilot 365 por usuario, M365 E5 si aplica, add-ons Purview y Defender específicos | Recurrente mensual, por usuario |
| **L2. Ingestión de telemetría** | CloudAppEvents en Sentinel, custom tables de Agent 365, logs de Logic Apps de playbooks | Variable, por GB ingerido |
| **L3. Almacenamiento de audit** | Tier interactivo Sentinel, archive de Sentinel LTR, blob storage opcional | Recurrente mensual, por GB retenido |
| **L4. Operación interna** | FTE del SOC dedicados a Agent 365, FTE de gobernanza de IA, formación recurrente, consultoría externa puntual | Recurrente mensual o trimestral |

Las cuatro se reportan al CFO. Un reporte que omite L4 (la más difícil de calcular) infla la rentabilidad aparente del programa.

### 16.1.2 Proporción típica

Según los benchmarks internos de programas Agent 365 en empresas de 2.000 a 10.000 empleados:

- L1 Licencias: 55 a 65 por ciento del TCO.
- L2 Ingestión: 10 a 15 por ciento.
- L3 Almacenamiento: 5 a 10 por ciento.
- L4 Operación interna: 15 a 25 por ciento.

Cuando una organización ve L2 + L3 superando el 30 por ciento del TCO, el síntoma es casi siempre el mismo: ingestión sin filtro o retención uniforme sin tiering. Sección 16.4 cubre la corrección.

Cuando L4 supera el 30 por ciento, el síntoma habitual es subcontratación excesiva de operación: la organización contrató al MSP para todo y no construyó capacidad interna. Es viable a corto plazo, costoso a medio plazo.

### 16.1.3 Coste marginal de invocación

El coste marginal de una invocación adicional de agente es relevante para decidir si vale la pena automatizar un proceso nuevo. La fórmula simplificada:

```
coste_marginal_invocacion ≈
    (precio_licencia_copilot / invocaciones_mes_usuario)
  + (tamaño_evento_GB × precio_ingestion_GB)
  + (tamaño_evento_GB × precio_storage_GB_mes × meses_retencion)
```

Con valores típicos de mercado en 2026 (precio Copilot 30 USD por usuario y mes; precio Sentinel pay-as-you-go aproximadamente 4 USD por GB ingerido; tamaño medio de evento AgentInvoke aproximadamente 2 KB):

- Si un usuario invoca 100 veces al mes: coste marginal aproximadamente 0,30 USD por invocación, dominado por la licencia.
- Si un usuario invoca 1.000 veces al mes: coste marginal aproximadamente 0,03 USD por invocación, dominado por ingestión.

Esta diferencia entre usuarios de bajo y alto uso es la base económica de las dos optimizaciones de la sección 16.2 (reasignar licencias de bajo uso) y 16.4 (tiering de telemetría para alto volumen).

### 16.1.4 KPIs financieros canónicos

Los tres KPIs que se reportan al comité ejecutivo:

| KPI | Fórmula | Objetivo típico |
|---|---|---|
| **TCO por usuario activo** | TCO mensual / usuarios con invocaciones > 5/mes | Tendencia decreciente trimestral |
| **Ratio de productividad por licencia** | Horas estimadas ahorradas mes / coste licencia mes | > 8 (umbral de break-even típico) |
| **Coste por agente productivo** | TCO mensual de operación + storage del agente / invocaciones útiles | Variable por agente, comparar trimestres |

Estos tres KPIs juntos cuentan la historia económica completa. El TCO por usuario activo mide eficiencia de asignación. El ratio de productividad mide retorno. El coste por agente productivo mide eficiencia del catálogo.

---

## 16.2 Optimización de licencias Copilot 365

L1 es típicamente el 55 a 65 por ciento del TCO, por lo que pequeñas optimizaciones tienen impacto desproporcionado. La regla operativa: un porcentaje significativo de licencias Copilot asignadas tras la primera ola de despliegue resulta infrautilizado al cabo de 90 días. Reasignarlas a usuarios con mayor potencial libera valor sin comprar más licencias.

### 16.2.1 Detección de licencias infrautilizadas

Una licencia se considera infrautilizada cuando el usuario asignado tiene menos de 5 invocaciones de agente en los últimos 30 días, medido en CCS Usage analytics. El umbral de 5 es operativo, no teórico: por debajo, la curva de productividad estimada cae por debajo del coste mensual de la licencia en el modelo simplificado.

Query canónica en CCS:

```kql
let cutoff = ago(30d);
let umbral_uso = 5;
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where ActionType == "AgentInvoke"
| where Timestamp >= cutoff
| summarize Invocaciones = count() by AccountUpn
| join kind=rightouter (
    AssignedLicenses
    | where SkuPartNumber == "Microsoft_Copilot"
    | project AccountUpn = UserPrincipalName, FechaAsignacion
  ) on AccountUpn
| extend Invocaciones = coalesce(Invocaciones, 0)
| where Invocaciones < umbral_uso
| where datetime_diff('day', now(), FechaAsignacion) >= 60
| project AccountUpn, Invocaciones, FechaAsignacion
| order by Invocaciones asc
```

Devuelve la lista de usuarios candidatos a reasignación: tienen la licencia hace al menos 60 días (descartamos usuarios que la acaban de recibir y aún están en onboarding) y han invocado menos de 5 veces en el último mes.

### 16.2.2 La regla de cuarentena 30/30

Retirar una licencia sin aviso es operacionalmente perjudicial: genera fricción con el usuario, con su manager y con el equipo de adopción. La regla canónica es 30/30:

1. **Primeros 30 días: aviso y soporte.** Email al usuario con copia a su manager explicando el bajo uso detectado y ofreciendo una sesión de coaching de 30 minutos con el equipo de adopción. La hipótesis por defecto es que el usuario no sabe cómo aprovechar Copilot, no que no lo necesita.
2. **Siguientes 30 días: monitorización.** Si tras la sesión el usuario incrementa el uso por encima del umbral, se mantiene la licencia y se cierra el caso como recuperación exitosa. Si el uso sigue por debajo, se notifica que la licencia se retira al cierre del periodo.
3. **Día 61: retirada y reasignación.** La licencia se retira y entra en el pool de reasignación. Se ofrece a la siguiente persona de la waitlist de adopción.

Este procedimiento típicamente recupera el 30 a 40 por ciento de los usuarios en cuarentena (suben el uso tras coaching) y libera el resto. La conversación con el manager es esencial: nunca se retira una licencia sin que el manager esté informado y haya tenido oportunidad de objetar.

### 16.2.3 Quién decide la reasignación

La cola de reasignación se gestiona desde el comité de adopción, no desde IT. El criterio de priorización canónico:

| Prioridad | Perfil | Justificación |
|---|---|---|
| 1 | Usuarios que pidieron licencia y están en waitlist | Demanda explícita, alta probabilidad de uso |
| 2 | Managers de áreas con productividad demostrada | Efecto multiplicador en el equipo |
| 3 | Champions que pidan ampliar el programa | Capacidad de capacitar a otros |
| 4 | Pilotos de nuevos casos de uso | Inversión exploratoria con retorno potencial |

Las reasignaciones se documentan en CCS con motivo: «reasignación tras cuarentena 30/30, usuario origen X, usuario destino Y, fecha Z». Esto permite reconstruir el histórico cuando finanzas pide trazabilidad.

### 16.2.4 Anti-patrones a evitar

Tres antipatrones recurrentes:

- **Retirada masiva tras una auditoría puntual.** Genera resentimiento, casi siempre captura algún falso positivo (usuario en baja, en proyecto especial, etc.) y daña la marca interna del programa.
- **Conservar licencias «por si acaso».** El argumento «mejor tenerlas asignadas por si las pide alguien» convierte el programa en un coste hundido sin retorno medible.
- **Reasignación sin coaching previo.** Saltarse los primeros 30 días de la regla 30/30 pierde la oportunidad de recuperar usuarios con bajo uso por falta de formación, no por falta de interés.

---

## 16.3 Optimización del catálogo de agentes

L1 cubre licencias de usuario. El catálogo tiene su propia economía: cada agente productivo en CCS Agent governance consume coste de mantenimiento, validación periódica, monitorización y eventual retirada. Un catálogo saturado de agentes poco usados infla el TCO sin aportar valor.

### 16.3.1 Detección de agentes zombi

Un agente se considera zombi cuando tiene menos de 5 invocaciones mensuales durante dos trimestres consecutivos. El umbral de dos trimestres es importante: descarta picos estacionales (un agente fiscal con uso intenso en marzo y junio pero bajo en otros meses no es zombi).

Query canónica:

```kql
let lookback = ago(180d);
CloudAppEvents
| where Application == "Microsoft Agent 365"
| where ActionType == "AgentInvoke"
| where Timestamp >= lookback
| summarize InvMes = count() by AgentId, mes = startofmonth(Timestamp)
| summarize MesesActivos = countif(InvMes >= 5), MesesTotales = count() by AgentId
| where MesesTotales >= 6
| where MesesActivos <= 1
| project AgentId, MesesActivos, MesesTotales
| order by MesesActivos asc
```

Devuelve agentes presentes durante al menos 6 meses con como máximo 1 mes por encima del umbral. Estos son los candidatos firmes a retirada.

### 16.3.2 Punto de break-even del agente

Antes de decidir retirar o no, se calcula el punto de break-even: ¿cuántas invocaciones mensuales necesita el agente para justificar su coste de mantenimiento?

Para un agente custom (desarrollado en Copilot Studio o M365 Agents SDK con esfuerzo dedicado):

```
break_even_mensual ≈ (coste_dev_total / vida_util_meses + coste_mantenimiento_mensual) / valor_por_invocacion
```

Con valores típicos (desarrollo 15.000 EUR amortizado a 24 meses, mantenimiento 200 EUR/mes, valor estimado por invocación 0,50 EUR): break-even aproximadamente 1.650 invocaciones mensuales. Por debajo, el agente pierde dinero.

Para un agente built-in del catálogo de Microsoft sin coste de desarrollo, el break-even es mucho más bajo (cubre solo el coste de validación y revisiones de seguridad), típicamente unas 50 invocaciones mensuales.

Aplicar break-even sin matices es peligroso: un agente puede tener valor cualitativo no medible en invocaciones (por ejemplo un agente de compliance que se invoca poco pero es necesario para auditoría). El comité decide caso a caso.

### 16.3.3 Procedimiento de retirada

Retirar un agente del catálogo requiere disciplina equivalente a la retirada de licencias:

1. **Notificación al owner.** El owner del agente recibe email con métricas de uso, propuesta de retirada y opción de defender continuidad con caso de negocio.
2. **30 días de aviso.** Si el owner no responde o no defiende, se notifica a los usuarios actuales del agente del periodo de transición y se ofrecen alternativas (otro agente similar, proceso manual, automatización fuera de Agent 365).
3. **Retirada lógica.** El agente pasa a estado `Disabled` en CCS Agent governance durante 30 días adicionales. Aún recuperable en caso de objeción razonable.
4. **Retirada definitiva.** Tras 60 días sin objeción, el agente se elimina del catálogo. La configuración se archiva por trazabilidad. Los datos de uso históricos se conservan según política de retención.

### 16.3.4 Consolidación de agentes

Antes de retirar, evaluar si se puede consolidar. Dos agentes que cubren funciones similares con audiencias parcialmente solapadas pueden fusionarse en uno único:

- Reduce coste de mantenimiento.
- Simplifica la elección para el usuario.
- Mejora la calidad por consolidación de prompts y conocimiento.

La consolidación requiere alineación de owners y validación con los usuarios de ambos agentes. No es decisión unilateral del comité, sino propuesta argumentada con datos.

---

## 16.4 Optimización de ingestión y retención de audit

L2 + L3 son típicamente el 15 a 25 por ciento del TCO. Cuando suben por encima del 30 por ciento, la causa raíz casi siempre es retención uniforme: todos los eventos se guardan en el tier más caro durante todo el periodo legal aplicable.

### 16.4.1 Tiering canónico de retención

La estrategia recomendada es tiering por capas:

| Tier | Producto | Retención | Coste relativo | Acceso |
|---|---|---|---|---|
| Caliente | Defender XDR / Sentinel interactivo | 30 días | Alto (referencia 1x) | Sub-segundo, KQL libre |
| Frío | Sentinel archive (LTR) | Hasta 7 años | Bajo (aproximadamente 0,1x) | Minutos, requiere search job |
| Glacial (opcional) | Azure Blob storage cool/archive | Hasta 12 años o más | Muy bajo (aproximadamente 0,02x) | Horas, requiere rehidratación |

La regla operativa: los últimos 30 días en caliente, los siguientes 11 meses en frío, el resto en glacial si aplica regulación de retención larga.

Esta estructura preserva la trazabilidad regulatoria completa (los datos siguen ahí) pero divide el coste de almacenamiento entre 5 y 20 según el periodo.

### 16.4.2 Filtros de ingestión y su riesgo

Reducir el coste de ingestión filtrando eventos antes de absorberlos en Sentinel es tentador pero peligroso. Cualquier filtro aplicado al data connector reduce la fidelidad del audit log y puede generar gaps detectables solo en auditoría (sección 15.5 del módulo anterior).

Reglas para filtros de ingestión seguros:

- **Permitidos.** Filtros que eliminan eventos puramente técnicos sin valor de auditoría (por ejemplo health-check pings internos del propio servicio).
- **Permitidos con documentación.** Filtros que reducen verbosidad de un campo concreto manteniendo el evento (truncar payloads de prompts largos sin perder metadata).
- **Prohibidos.** Filtros que eliminan eventos de invocación, eventos de cambio de configuración, eventos de seguridad o cualquier evento relevante para reconstruir actividad del usuario o del agente.

Cualquier filtro aplicado requiere aprobación del comité central y queda documentado con justificación. El antipatrón de «filtro de coste aplicado por admin individual sin documentación» es exactamente el caso del LAB-15-2 del módulo anterior.

### 16.4.3 Capacidad reservada vs pay-as-you-go

Sentinel y los servicios Azure relacionados se pueden contratar en dos modalidades:

| Modalidad | Cuándo elegirla | Descuento |
|---|---|---|
| Pay-as-you-go | Volumen variable, fase exploratoria, pilotos | Sin descuento, máxima flexibilidad |
| Capacidad reservada anual | Volumen estable en producción | 15 a 30 por ciento |
| Capacidad reservada trianual | Volumen creciente con plan a 3 años | 35 a 65 por ciento |

La decisión depende de la estabilidad del volumen. Una recomendación operativa: arrancar el primer año en pay-as-you-go, medir el volumen real durante 12 meses, después decidir capacidad reservada basada en datos. Reservar capacidad sin datos genera o bien sobrecoste por reserva excesiva, o bien factura inesperada por overage.

### 16.4.4 KPI específico de L2 + L3

El KPI a monitorizar trimestralmente:

```
ratio_ingestion = coste_mensual_L2_L3 / total_invocaciones_mensuales
```

Tendencia plana o decreciente indica eficiencia. Tendencia creciente con volumen estable indica configuración subóptima (falta tiering, falta capacidad reservada, custom tables sobredimensionadas).

---

## 16.5 Ciclo de mejora continua trimestral

Las optimizaciones puntuales mueven la aguja una vez. El programa sostenible requiere un ciclo que detecte oportunidades cada trimestre y las ejecute. Sin ese ciclo el TCO se erosiona y los hallazgos de incidents no se traducen en mejoras estructurales.

### 16.5.1 El comité trimestral

Reunión trimestral de 2 horas con los siguientes asistentes:

| Rol | Aporta |
|---|---|
| Responsable de gobernanza de IA | Modera. Sintetiza inputs y decide. |
| Finance partner | Reporta TCO actual y forecast. Aporta visión de capacidad reservada. |
| SOC tier 2 lead | Reporta lecciones aprendidas de incidents. Propone ajustes a custom detection rules. |
| Owner de catálogo de agentes | Reporta evolución del catálogo. Propone retiradas y consolidaciones. |
| Responsable de adopción | Reporta feedback de usuarios y waitlist. Propone reasignaciones. |

Es importante que sean 5 personas con autoridad de decisión, no un foro extendido sin capacidad ejecutiva.

### 16.5.2 Los cuatro inputs canónicos

Cada trimestre el comité revisa cuatro inputs en este orden:

**Input 1. KPIs financieros.** TCO total, descomposición por las cuatro líneas, evolución vs trimestre anterior, los tres KPIs canónicos (TCO por usuario activo, ratio de productividad, coste por agente productivo). Forecast del trimestre siguiente.

**Input 2. Lecciones aprendidas de incidents.** Top 5 incidents del trimestre con causa raíz y acciones preventivas pendientes. Estado de implementación de las acciones preventivas del trimestre anterior. Patrones recurrentes que sugieren cambios estructurales (más formación, ajuste de policies, retirada de agentes problemáticos).

**Input 3. Evolución del catálogo.** Nuevos agentes desplegados, agentes retirados, agentes zombi detectados, propuestas de consolidación. Cobertura del catálogo respecto a casos de uso priorizados por el negocio.

**Input 4. Feedback de adopción.** NPS de usuarios actuales, waitlist actual, casos de éxito documentados, fricciones reportadas. Recomendaciones del equipo de adopción para reasignaciones y nuevas formaciones.

### 16.5.3 Outputs del comité

Cada comité produce tres outputs:

- **Decisiones del trimestre.** Lista corta de decisiones con owner y fecha objetivo. Tres a cinco decisiones máximo por trimestre; más es ruido.
- **Reporte ejecutivo al comité de dirección.** Una página con TCO, KPIs canónicos, decisiones tomadas y recomendaciones que requieren visibilidad ejecutiva.
- **Comunicación al equipo extendido.** Email o post en Teams con resumen de cambios que afectan a usuarios u operación.

### 16.5.4 Anti-patrones del comité

- **Comité informativo en lugar de decisorio.** Si nadie tiene autoridad de decisión, el comité se convierte en reporting glorificado y las optimizaciones no se ejecutan.
- **Sin trazabilidad de decisiones previas.** No revisar el estado de las decisiones del trimestre anterior convierte el comité en un loop sin progreso.
- **Sin participación de finanzas.** El TCO sin finance partner no se contrasta con la realidad presupuestaria de la organización.
- **Sin retirada de agentes.** Un comité que nunca retira nada acumula deuda en el catálogo trimestre a trimestre.

---

## Glosario de términos clave del módulo

| Término | Definición breve |
|---|---|
| **TCO (Total Cost of Ownership)** | Coste agregado del programa Agent 365 sumando las cuatro líneas canónicas: licencias, ingestión, storage y operación interna. |
| **Coste marginal de invocación** | Coste adicional por una invocación extra de agente. Suma licencia prorrateada, coste de ingestión del evento y coste de almacenamiento. |
| **Licencia infrautilizada** | Licencia Copilot 365 asignada a un usuario con menos de 5 invocaciones de agente en los últimos 30 días según CCS Usage analytics. |
| **Regla de cuarentena 30/30** | Procedimiento canónico de reasignación: 30 días de aviso al usuario y 30 días de monitorización antes de retirar la licencia definitivamente. |
| **Agente zombi** | Agente desplegado en el catálogo con menos de 5 invocaciones mensuales durante dos trimestres consecutivos. Candidato a retirada. |
| **Tiering de audit** | Estrategia de retención por capas: caliente en Defender XDR (30 días), frío en Sentinel LTR (hasta 12 años), opcional archivo externo blob. |
| **Coste de ingestión** | Coste de absorber telemetría en el SIEM. En Sentinel se factura por GB ingerido. Para Agent 365 incluye CloudAppEvents y custom logs. |
| **Coste de retención** | Coste mensual de mantener datos disponibles para consulta. En Sentinel cubre tier interactivo, archive y backup. |
| **Capacidad reservada vs pay-as-you-go** | Dos modelos de compra para Sentinel y servicios Azure relacionados. La capacidad reservada da descuento (15 a 65 por ciento) a cambio de compromiso anual o trianual. |
| **Comité de mejora continua** | Reunión trimestral del responsable de gobernanza de IA con finanzas, SOC y adopción para revisar TCO, retirar agentes zombi y planificar el siguiente trimestre. |
| **Ratio de productividad por licencia** | KPI financiero canónico: horas estimadas ahorradas al mes dividido por coste mensual de la licencia. Útil para reportar al CFO. |
| **Punto de break-even del agente** | Volumen mínimo de invocaciones mensuales que justifica el coste de desarrollo y mantenimiento del agente custom. |

---

## Resumen del módulo

- El TCO de Agent 365 tiene cuatro líneas canónicas que se reportan siempre por separado: licencias (55 a 65 por ciento), ingestión (10 a 15 por ciento), almacenamiento (5 a 10 por ciento) y operación interna (15 a 25 por ciento). Omitir L4 infla la rentabilidad aparente.
- Las licencias Copilot 365 se optimizan con la regla 30/30: 30 días de aviso y coaching, 30 días de monitorización, retirada al día 61. Recupera el 30 a 40 por ciento de usuarios en cuarentena.
- Un agente es zombi cuando tiene menos de 5 invocaciones mensuales en dos trimestres consecutivos. La retirada sigue procedimiento equivalente al de licencias (aviso al owner, transición de usuarios, retirada lógica, retirada definitiva).
- L2 + L3 se optimizan con tiering: caliente 30 días, frío hasta 7 años, glacial opcional para retención larga. Los filtros de ingestión son riesgosos y requieren aprobación documentada.
- Capacidad reservada da descuentos de 15 a 65 por ciento pero requiere volumen estable medido. Recomendación: 12 meses de pay-as-you-go antes de reservar.
- El ciclo de mejora continua trimestral toma cuatro inputs (KPIs financieros, lecciones de incidents, evolución del catálogo, feedback de adopción) y produce tres outputs (decisiones, reporte ejecutivo, comunicación). Sin este ciclo el programa se erosiona.

## Hacia el examen final

Has completado los 16 módulos de contenido del curso. El siguiente paso es **M17, el examen de certificación**: 60 preguntas cronometradas en 90 minutos cubriendo las cinco áreas de competencia, con umbral de aprobado del 70 por ciento. Aprovecha los días previos para repasar el glosario consolidado del curso, repetir los quizzes de práctica de los módulos donde más fallaste y revisar los caso de estudio de M01, M06, M09, M12 y M15, que son los módulos con mayor peso en el banco.
