---
modulo: 16
tipo: laboratorios
titulo: "Laboratorios del Módulo 16"
duracion_total_min: 60
ultima_actualizacion: 2026-05-11
laboratorios:
  - id: LAB-16-1
    titulo: "Construir el modelo TCO de un programa Agent 365 a 12 meses con cuatro líneas canónicas"
    duracion_min: 30
  - id: LAB-16-2
    titulo: "Detectar licencias infrautilizadas y agentes zombi con la regla 30/30 y el criterio de uso trimestral"
    duracion_min: 30
---

# Módulo 16. Laboratorios

> Dos laboratorios prácticos centrados en la economía operativa de un programa Agent 365. LAB-16-1 construye el modelo TCO completo a 12 meses con las cuatro líneas canónicas. LAB-16-2 aplica las dos optimizaciones más frecuentes: detección de licencias infrautilizadas con regla 30/30 y detección de agentes zombi con criterio trimestral. Tiempo total: 60 minutos.
>
> **Prerrequisitos comunes:**
>
> - Tenant Microsoft 365 con Agent 365 activado y al menos 3 meses de uso real para poder construir histórico.
> - Roles: `Reports Reader` o `Copilot Administrator` para CCS Usage analytics; `Security Reader` para Defender XDR Advanced Hunting.
> - Hoja de cálculo (Excel o Google Sheets) para construir el modelo financiero.
> - Acceso a Microsoft Cost Management para consultar el consumo de Sentinel.

---

## LAB-16-1. Construir el modelo TCO de un programa Agent 365 a 12 meses con cuatro líneas canónicas

**Duración:** 30 min. **Producto:** CCS + Microsoft Cost Management + hoja de cálculo. **OA:** OA-16.1.

### Objetivo

Producir el modelo TCO completo del programa para los últimos 12 meses, separado en las cuatro líneas canónicas, con KPIs financieros derivados y tendencia trimestral. El entregable es una hoja de cálculo con cuatro hojas (una por línea) más una hoja resumen con los tres KPIs canónicos.

### Escenario simulado

El CFO ha solicitado al responsable de gobernanza de IA un informe TCO antes del comité de dirección de la próxima semana. Hasta ahora se reportaba solo el coste de licencias Copilot. El responsable necesita producir el modelo completo en menos de una jornada de trabajo.

### Pasos

**Paso 1. Recopilar coste de licencias (L1) — 5 min.**

1. Desde CCS o el portal de M365 admin center, exportar el listado mensual de licencias asignadas durante los últimos 12 meses. Incluye Copilot 365, M365 E5, add-ons de Purview o Defender específicos del programa.
2. En la hoja `L1_Licencias`, construir una tabla mensual con: SKU, número de licencias activas el último día del mes, precio unitario, coste mensual.
3. Calcular el subtotal mensual y anual de L1. Para el escenario simulado, asume un programa de 2.500 usuarios Copilot 365 a 28 EUR/mes, con coste mensual estable cercano a 70.000 EUR.

**Paso 2. Recopilar coste de ingestión (L2) — 7 min.**

4. Abrir Microsoft Cost Management. Filtrar por servicio: Microsoft Sentinel y Log Analytics Workspace asociado.
5. Exportar la factura mensual de los últimos 12 meses, descomponiendo: coste de ingestión por GB, coste de Logic Apps de playbooks, coste de Sentinel premium si aplica.
6. En la hoja `L2_Ingestion`, construir una tabla mensual con: GB ingeridos, coste de ingestión, coste de Logic Apps, total mensual.
7. Calcular el subtotal mensual y anual de L2.

**Paso 3. Recopilar coste de almacenamiento (L3) — 5 min.**

8. Desde el mismo informe de Cost Management, extraer el coste mensual de Log Analytics retention tier (interactivo), Sentinel archive (LTR si está habilitado), y blob storage si hay archivo externo.
9. En la hoja `L3_Storage`, construir tabla mensual con: GB en tier interactivo, GB en archive, GB en blob (si aplica), coste de cada uno, total mensual.
10. Si no hay tiering implementado (todo en tier interactivo), anotarlo explícitamente. Es el principal candidato de optimización para el siguiente trimestre.

**Paso 4. Estimar coste de operación interna (L4) — 8 min.**

L4 es la línea más difícil porque no aparece en una factura. Hay que estimarla con criterio.

11. En la hoja `L4_Operacion`, listar los FTE dedicados parcial o totalmente al programa:
    - SOC tier 2 dedicado a Agent 365.
    - Responsable de gobernanza de IA.
    - Owner del catálogo (si es FTE separado).
    - Tiempo del equipo de adopción específicamente sobre Agent 365.
12. Para cada FTE, estimar el porcentaje de dedicación al programa y multiplicar por el coste fully-loaded mensual (salario, beneficios, overheads, típicamente 1,4x salario bruto).
13. Añadir contratos externos: MSP, consultoría puntual, formación recurrente.
14. Calcular subtotal mensual y anual de L4.

Si las estimaciones de dedicación son aproximadas, documentarlo explícitamente. Es preferible una estimación documentada que omitir la línea.

**Paso 5. Hoja resumen y KPIs — 5 min.**

15. En la hoja `Resumen`, construir tabla mensual con: L1, L2, L3, L4, TCO total. Añadir columna de porcentaje sobre TCO para cada línea (sanity check de proporciones típicas: L1 55 a 65 por ciento, L2 10 a 15 por ciento, L3 5 a 10 por ciento, L4 15 a 25 por ciento).
16. Calcular los tres KPIs canónicos:
    - **TCO por usuario activo.** Numerador: TCO mensual. Denominador: usuarios con más de 5 invocaciones en el mes (de CCS Usage analytics).
    - **Ratio de productividad por licencia.** Numerador: horas estimadas ahorradas (asume un valor conservador de 2 horas/mes por usuario activo basado en estudios de adopción Copilot). Denominador: coste mensual por licencia. Si el ratio es mayor que 8, el programa es rentable.
    - **Coste por agente productivo.** Numerador: TCO mensual proporcional al uso del agente. Denominador: invocaciones útiles del agente.

### Validación

- La hoja `Resumen` tiene tabla mensual completa de 12 meses con las cuatro líneas separadas.
- Los porcentajes de cada línea sobre el TCO están dentro de los rangos típicos. Si no, hay anomalía a investigar (causa típica: L4 subestimada o L2+L3 con tiering no implementado).
- Los tres KPIs canónicos están calculados con fórmulas trazables.
- Hay nota explícita sobre las estimaciones de L4 cuando hayan sido aproximadas.

### Variantes y extensiones

- Construir el forecast a 12 meses con tres escenarios (conservador, base, optimista) que asume crecimiento de usuarios.
- Añadir la dimensión geográfica si el programa cubre múltiples países con costes laborales distintos.
- Construir el dashboard ejecutivo con las cuatro líneas en formato visual (waterfall chart por trimestre).

---

## LAB-16-2. Detectar licencias infrautilizadas y agentes zombi con la regla 30/30 y el criterio de uso trimestral

**Duración:** 30 min. **Producto:** CCS + Defender XDR Advanced Hunting. **OA:** OA-16.2, OA-16.3.

### Objetivo

Aplicar los dos procedimientos de optimización más frecuentes del programa: detectar licencias Copilot infrautilizadas con la regla 30/30, y detectar agentes zombi con el criterio de dos trimestres consecutivos. El entregable es la lista de candidatos a reasignación (licencias) y candidatos a retirada (agentes), con el plan de comunicación.

### Escenario simulado

El comité de mejora continua trimestral se reúne el lunes próximo. El responsable de gobernanza de IA necesita llevar dos listas: licencias candidatas a entrar en cuarentena 30/30 y agentes candidatos a retirada. La organización es ficticia pero los números son representativos: 2.500 usuarios Copilot, 45 agentes en catálogo, 9 meses de programa.

### Pasos

**Parte A. Licencias infrautilizadas — 15 min.**

1. **Lanzar la query canónica.** En Defender XDR Advanced Hunting o en el equivalente de CCS:

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

2. **Asume el resultado.** La query devuelve 320 usuarios. Distribución: 145 con 0 invocaciones, 98 con 1 a 2 invocaciones, 77 con 3 a 4 invocaciones.

3. **Cruzar con datos de RRHH y manager.** Antes de proceder, eliminar de la lista:
   - Usuarios en baja médica o permiso largo (cruzar con datos de RRHH).
   - Usuarios en proyecto especial que justifique uso bajo temporalmente (cruzar con managers).
   - Usuarios con menos de 60 días desde la asignación (la query ya filtra, pero verificar borderline).

   Asume que tras este cruce quedan 280 candidatos firmes.

4. **Segmentar los candidatos en tres grupos para escalado del coaching:**
   - Grupo A: 145 usuarios con 0 invocaciones. Probable abandono total. Coaching grupal en sesiones de 8 a 10 personas (riesgo: bajo retorno esperado).
   - Grupo B: 98 usuarios con 1 a 2 invocaciones. Probable falta de hábito. Coaching grupal con énfasis en casos de uso específicos del área del usuario.
   - Grupo C: 77 usuarios con 3 a 4 invocaciones. Próximos al umbral. Coaching individual breve enfocado en los obstáculos específicos (alto retorno esperado).

5. **Preparar la comunicación inicial (día 1 de la cuarentena).** Borrador del email con:
   - Asunto: «Tu licencia Copilot 365: oportunidad de coaching gratuito».
   - Cuerpo: detección del bajo uso, hipótesis por defecto (no es problema del usuario, es falta de capacitación), oferta de coaching, sin amenaza de retirada en el primer email.
   - Copia al manager: contexto y posibilidad de objetar si el usuario tiene razón válida para uso bajo.

6. **Documentar el plan en CCS.** Crear ticket por cada candidato con tipo `License-Quarantine-Day-1`, owner `equipo-adopcion`, fecha de cierre 60 días desde hoy.

**Parte B. Agentes zombi — 15 min.**

7. **Lanzar la query canónica.** En Defender XDR Advanced Hunting:

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

8. **Asume el resultado.** La query devuelve 8 agentes candidatos. Para cada uno hay que recopilar contexto adicional antes de proponer retirada:

   | AgentId | MesesActivos | Owner | ¿Caso de uso documentado? |
   |---|---|---|---|
   | comercial-followup-bot | 0 | comercial-iberia | Sí, pero owner abandonó hace 4 meses |
   | finance-monthly-close | 1 | finance-spain | Sí, pico en cierre de trimestre |
   | hr-onboarding-helper | 0 | hr-corporate | No |
   | legal-clause-extractor | 1 | legal | Sí, uso ocasional pero crítico cuando se invoca |
   | marketing-campaign-rev | 0 | marketing-emea | No, owner cambió rol |
   | logistics-route-opt | 0 | operations | Sí, pero proyecto se ha cancelado |
   | data-quality-checker | 1 | data-eng | Sí, valor cualitativo aunque uso bajo |
   | events-attendance | 0 | events | Sí, uso solo en epoca de eventos |

9. **Clasificar los 8 en cuatro categorías de decisión:**
   - **Retirada inmediata (3 candidatos):** `comercial-followup-bot` (owner abandonado, sin defensor), `marketing-campaign-rev` (owner cambió, sin defensor) y `logistics-route-opt` (proyecto cancelado, sin uso futuro previsto).
   - **Mantener con argumento estacional (3 candidatos):** `finance-monthly-close`, `data-quality-checker` y `events-attendance`. Tienen valor cualitativo o uso estacional documentado. Caso a caso del comité.
   - **Investigar antes de decidir (1 candidato):** `legal-clause-extractor`. Valor potencial alto en casos críticos, pero falta cuantificar.
   - **Buscar nuevo owner (1 candidato):** `hr-onboarding-helper`. Sin caso de uso documentado pero con potencial. Ofrecerlo al equipo de HR para refrescar.

10. **Preparar la propuesta al comité.** Resumen ejecutivo con:
    - Tres candidatos firmes a retirada con justificación.
    - Tres candidatos a mantener con argumento documentado y revisión en el siguiente trimestre.
    - Dos candidatos a investigar/refrescar con owner y fecha objetivo (2 semanas).

11. **Documentar el procedimiento de retirada para los 3 firmes:**
    - Día 1: notificación al área y a los usuarios actuales con alternativas y plazo de 30 días.
    - Día 31: agente pasa a estado `Disabled` en CCS Agent governance. Revisable durante 30 días adicionales.
    - Día 61: retirada definitiva del catálogo. Configuración archivada por trazabilidad.

### Validación

- La lista de licencias candidatas a cuarentena está segmentada en tres grupos con plan de coaching diferenciado.
- La comunicación inicial al usuario no contiene amenaza de retirada y tiene copia al manager.
- La lista de agentes candidatos a retirada está clasificada en cuatro categorías de decisión, no «retirar todo lo que cumple criterio».
- Los tres candidatos firmes a retirada tienen procedimiento documentado con plazos de 30+30 días.
- La propuesta al comité es ejecutable: no son recomendaciones genéricas, son decisiones con owner y fecha.

### Variantes y extensiones

- Modelar el ahorro estimado de las retiradas para incluir en el reporte ejecutivo al CFO.
- Diseñar el procedimiento de coaching de los Grupos A y B con curriculum específico (qué se enseña en la sesión, qué materiales se entregan, cómo se mide el éxito).
- Construir el dashboard de seguimiento de la cohorte de cuarentena: cuántos suben de uso por encima del umbral en mes 1, en mes 2, cuántos se retiran al día 61. Métricas para refinar el procedimiento en los siguientes trimestres.

---

## Cierre

Tras los dos labs has tocado las dos competencias económicas centrales del programa Agent 365: medir el TCO completo con cuatro líneas canónicas (LAB-16-1) y aplicar las optimizaciones más frecuentes con disciplina operativa (LAB-16-2). El modelo TCO es la base para cualquier conversación con finanzas. La regla 30/30 sobre licencias y el criterio trimestral sobre agentes son los procedimientos que mantienen el programa eficiente trimestre a trimestre.

Si quieres ir más allá:

- Construir el modelo de ROI del programa al cabo de 12 meses: cuánto se ha invertido (TCO total) versus cuánto se ha ahorrado en horas estimadas, errores evitados, decisiones más rápidas. El ROI suele ser el argumento que el CFO espera para renovar el presupuesto del año siguiente.
- Diseñar el plan de bonificación a champions del programa: champions del trimestre, recompensas tangibles, comunicación pública del reconocimiento. El coste es bajo y el efecto multiplicador en la adopción es alto.
- Implementar el reporte automatizado del comité con extracción de los KPIs del trimestre directamente desde CCS y Defender XDR. Reducir el tiempo de preparación del comité de 8 horas a 2.

Con este módulo cierras el contenido del curso. El siguiente paso es el **examen de certificación (M17)**: 60 preguntas en 90 minutos cubriendo las cinco áreas, con umbral de aprobado del 70 por ciento. Suerte.
