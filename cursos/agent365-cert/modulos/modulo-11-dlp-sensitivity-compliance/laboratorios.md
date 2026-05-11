---
modulo: 11
tipo: laboratorios
titulo: "Laboratorios del Módulo 11"
duracion_total_min: 100
ultima_actualizacion: 2026-05-11
laboratorios:
  - id: LAB-11-1
    titulo: "Configurar DLP policy con location 'Microsoft Agent 365 outputs'"
    duracion_min: 25
  - id: LAB-11-2
    titulo: "Entrenar custom trainable classifier y validar precision/recall"
    duracion_min: 30
  - id: LAB-11-3
    titulo: "Conectar Microsoft Defender for Cloud Apps a Salesforce y aplicar DLP cross-SaaS"
    duracion_min: 25
  - id: LAB-11-4
    titulo: "Configurar Communication Compliance para detectar lenguaje regulado en outputs"
    duracion_min: 20
---

# Módulo 11 — Laboratorios

> Cuatro laboratorios prácticos para consolidar la teoría sobre DLP runtime, trainable classifiers, integración MDA y Communication Compliance en el contexto de Agent 365. Cada lab entrega un artefacto concreto (una DLP policy operativa, un classifier custom calibrado, un conector MDA funcional, una policy CC con reviewers asignados). Tiempo total aproximado: 100 minutos.
>
> **Prerrequisitos comunes:**
>
> - Tenant Microsoft 365 con Agent 365 activado.
> - Licencias en el tenant: Microsoft 365 E5 Compliance (incluye DLP avanzado, trainable classifiers, Communication Compliance) y Microsoft Defender for Cloud Apps.
> - Roles asignados a tu usuario (vía PIM): `Compliance Administrator`, `Information Protection Administrator`, `Communication Compliance Admin`, `Cloud App Security Administrator`.
> - Al menos un agente OBO de prueba con varias invocaciones recientes y un agente de Foundry conectado a un SaaS de terceros (Salesforce sandbox o ServiceNow Personal Developer Instance funcionan bien para los labs).

---

## LAB-11-1 — Configurar DLP policy con location «Microsoft Agent 365 outputs»

**Duración:** 25 min · **Producto:** Microsoft Purview DLP + Agent 365 · **OA:** OA-11.4.

### Objetivo

Crear una DLP policy que aplique específicamente a outputs de agentes Agent 365, bloquee con opción de override cuando un output contenga datos financieros sensibles, registre cada evento en audit log y valide empíricamente el flujo runtime end-to-end.

### Pasos

1. **Abre Microsoft Purview** (compliance.microsoft.com) → Data Loss Prevention → Policies → Create policy.

2. **Plantilla**: selecciona «Custom» (las plantillas built-in cubren casos genéricos, queremos control fino sobre el Agent 365).

3. **Locations**: deja **únicamente** activado `Microsoft Agent 365 outputs`. Desactiva las demás para aislar la prueba. En producción real se combinarían varias.

4. **Conditions**:
   - Add condition → Content contains → Sensitive info types.
   - Selecciona: `Credit Card Number`, `EU Debit Card Number`, `Spain National Identity Number`, `International Banking Account Number (IBAN)`.
   - Instance count: 1 or more (un solo match dispara la policy).
   - Confidence level: High (reducir falsos positivos en la primera prueba).

5. **Actions**:
   - Action: **Block with override**.
   - Allow user to override: Yes.
   - Require justification: Yes (mínimo 20 caracteres).
   - Predefined business justifications:
     - «Comunicación con asesor financiero externo autorizado».
     - «Cliente con NDA firmado».
     - «Emergencia operativa».
     - «Otro (especificar en texto libre)».
   - Notify admins on override: Yes → grupo `dlp-admins@empresa.com`.

6. **User notification**:
   - Policy tip: «Este output contiene datos financieros sensibles. Revisa antes de compartir».
   - Block message: «Este output ha sido bloqueado por la política de protección de datos financieros del tenant. Usa "Solicitar excepción" si tu caso lo justifica».

7. **Mode**: empieza en **Test it out, with notifications turned on** (modo simulación con avisos). Asi validas precisión antes de activar block real.

8. **Save and activate**. Espera 30-60 min a la propagación.

9. **Validación empírica**:
   - Invoca tu agente OBO con un prompt que pida procesar un archivo de prueba con un IBAN ficticio + un número de tarjeta sintético.
   - El output debe entregar con un **policy tip** (modo Test): no bloquea, pero registra.
   - Revisa audit log en Purview → Audit → Search → Activity = `DlpRuleMatch` filtrado por `location = Agent365Outputs`.
   - Confirma que el evento contiene `agentId`, `userPrincipalName`, `matchedSits`, `policyName`, `actionTaken = Audit`.

10. **Promoción a producción**: tras 1-2 semanas en Test con tasa de falsos positivos < 5 %, vuelve a la policy y cambia el mode a **Turn it on right away**. Ahora la action `block with override` queda activa.

### Validación

- La policy existe en Purview y está activa.
- El audit log registra eventos `DlpRuleMatch` cuando se invoca el agente con datos sensibles.
- El test del policy tip funciona en modo Test antes del cambio a producción.
- Tras activar producción, un intento con datos sensibles activa el block screen + flujo de justificación.

### Variantes y extensiones

- Añadir una segunda action: `Restrict access to encrypted content` para forzar la aplicación retroactiva de label `Confidential` al archivo origen si la DLP detecta SITs en él.
- Crear una variante para el agente autonomous de Tesorería del LAB-10-4: la policy debe ser más estricta (block sin override) por la naturaleza del agente.

---

## LAB-11-2 — Entrenar custom trainable classifier y validar precision/recall

**Duración:** 30 min (sin contar el procesamiento de entrenamiento de 8-24h) · **Producto:** Microsoft Purview trainable classifiers · **OA:** OA-11.3.

### Objetivo

Entrenar un classifier custom que detecte «conversaciones de M&A» (lenguaje de fusiones y adquisiciones) en outputs de agentes, calibrar el threshold de confianza con muestras de prueba etiquetadas, alcanzar precision ≥ 80 % y recall ≥ 70 %, y promoverlo a uso en una DLP policy.

### Pasos

1. **Recopila el dataset de entrenamiento**:
   - 150-200 documentos de muestra con conversaciones, memos y outputs de agentes que **sí** son de M&A (target positive class). Si no tienes ejemplos reales en el tenant, puedes generar sintéticos con un agente de prueba pidiéndole borradores de comunicaciones M&A o usar el corpus interno de Legal/Strategy.
   - 150-200 documentos de muestra que **NO** son de M&A pero pueden parecerse (target negative class): contratos comerciales estándar, informes financieros sin M&A, comunicaciones legales rutinarias. La diversidad de la negative class es crítica.

2. **Carga al training set**:
   - Purview → Data classification → Trainable classifiers → New trainable classifier.
   - Name: `Custom-MA-Conversations`.
   - Description: «Conversaciones de fusiones y adquisiciones».
   - Upload positive samples → carpeta SharePoint con los 150-200 documentos M&A.
   - Upload negative samples → carpeta SharePoint con los 150-200 documentos no-M&A.

3. **Lanza el entrenamiento**. Purview procesa entre 8-24 horas. Durante este tiempo, el modelo aprende los patrones lingüísticos y contextuales que diferencian M&A de no-M&A.

4. **Recibe el modelo entrenado** (Purview envía email al admin cuando termina). Las métricas iniciales aparecen en la página del classifier: precision, recall, accuracy.

5. **Evaluación con muestras de prueba** (no usadas en entrenamiento):
   - Prepara 50-100 documentos nuevos manualmente etiquetados como M&A o no-M&A.
   - Sube al classifier vía Test the classifier.
   - Purview ejecuta predicción y compara con tu labeling.
   - Resultado: matriz de confusión (true positives, false positives, true negatives, false negatives).

6. **Calibración del threshold**:
   - Threshold por defecto = 0.7 (confianza > 70 % se considera match).
   - Si precision baja (muchos FP): sube threshold a 0.8 o 0.85.
   - Si recall bajo (muchos FN): baja threshold a 0.6, o reentrenar con más muestras positivas diversas.
   - Target: precision ≥ 80 % AND recall ≥ 70 %.

7. **Re-entrenar si necesario**:
   - Si las métricas no llegan al target, vuelve al paso 1 y añade 50-100 muestras adicionales a la clase que necesita mejorar.
   - Re-train con el dataset ampliado.

8. **Promoción a producción**:
   - Una vez calibrado, el classifier está disponible para usar en DLP policies y en auto-labeling policies.
   - Crea una DLP policy de prueba que use `Custom-MA-Conversations` como condition con location `Agent 365 outputs` y action `audit only` para validar comportamiento real durante 1 semana antes de cambiar a `block with override`.

9. **Documentación del modelo**:
   - Anota en un repositorio interno: nombre, fecha de entrenamiento, tamaño del dataset, métricas finales, threshold final, fecha prevista de re-evaluación (trimestral).

### Validación

- El classifier `Custom-MA-Conversations` está creado y entrenado.
- Las métricas en muestras de prueba cumplen target: precision ≥ 80 % AND recall ≥ 70 %.
- Una DLP policy en `audit only` está activa usando el classifier y registra matches.
- La documentación del modelo está archivada para auditoría y re-evaluación trimestral.

### Variantes y extensiones

- Repetir el flujo para otro classifier custom relevante a tu organización: «Comunicaciones con prensa», «Negociaciones con sindicatos», «Conversaciones con auditores externos».
- Crear una policy DLP combinada que use el classifier + SITs financieras + sensitivity label `Highly Confidential` en AND para detectar el caso «M&A confidencial con números».

---

## LAB-11-3 — Conectar Microsoft Defender for Cloud Apps a Salesforce y aplicar DLP cross-SaaS

**Duración:** 25 min · **Producto:** Microsoft Defender for Cloud Apps + Purview DLP · **OA:** OA-11.5.

### Objetivo

Conectar una instancia sandbox de Salesforce a Microsoft Defender for Cloud Apps, configurar el conector con permisos de lectura, y aplicar una DLP policy que cubra Salesforce además de M365 para que un agente que acceda a registros sensibles en Salesforce active la misma protección que en SharePoint.

### Pasos

1. **Provisión sandbox Salesforce**: si no tienes uno, registra una Developer Edition gratuita en developer.salesforce.com.

2. **Conecta Salesforce a MDA**:
   - Abre Microsoft Defender XDR (security.microsoft.com) → Cloud apps → Connected apps → App connectors.
   - Selecciona `Salesforce` → Connect Salesforce.
   - Provee credenciales de admin de Salesforce y consiente los permisos solicitados (lectura de activity logs, user accounts, files).
   - MDA inicia el descubrimiento. Espera 1-2 horas a que aparezcan los primeros datos.

3. **Verifica la conexión**:
   - MDA → Cloud apps → Activity log.
   - Filtra por App = Salesforce. Debes ver eventos de los últimos minutos.
   - MDA → Cloud apps → Files → filtra por Salesforce. Debes ver los archivos accesibles.

4. **Diseña la DLP cross-SaaS**:
   - Purview → DLP → Create policy → Custom.
   - Locations:
     - `SharePoint sites` ✓
     - `OneDrive accounts` ✓
     - `Microsoft Agent 365 outputs` ✓
     - `Microsoft Defender for Cloud Apps` ✓
       - In scope apps: Salesforce.
   - Conditions: Sensitive info type = `Credit Card Number` (instance count ≥ 1, confidence High).
   - Actions: `Block with override` + justify + notify admins.
   - User notification: policy tip + block message + justification reasons.
   - Mode: Test mode 1 semana, luego producción.

5. **Validación empírica cross-SaaS**:
   - Crea en Salesforce sandbox un registro con un número de tarjeta de prueba en el campo `Description`.
   - Invoca al agente OBO con un prompt que pida resumir registros recientes de Salesforce.
   - El output debe activar el policy tip (modo Test) o el block screen (modo producción).
   - Audit log: `DlpRuleMatch` con `location = MicrosoftDefenderForCloudApps` y `app = Salesforce`.

6. **Cloud Discovery**:
   - Bonus rápido: MDA → Cloud apps → Cloud Discovery → Discovered apps.
   - Identifica las top 10 apps de IA generativa detectadas en la red corporativa (Cloud Discovery escanea los logs de proxy y firewall).
   - Si aparece alguna app no oficialmente aprovisionada, abre ticket para evaluar gobernanza.

7. **Session policy opcional** (avanzado):
   - Si quieres control en tiempo real sobre Salesforce: MDA → Cloud apps → Policies → Session policy → New.
   - Activity: Download file.
   - Filter: `Classification label = Confidential`.
   - Action: Block.
   - Esto requiere configurar Conditional Access App Control para enrutar el tráfico Salesforce vía MDA reverse proxy. Es complejidad operativa significativa, solo justificable para apps críticas.

### Validación

- Salesforce está conectado a MDA y muestra actividad reciente.
- La DLP policy cross-SaaS cubre M365 + Agent 365 + Salesforce en una única definición.
- Un evento simulado en Salesforce dispara la misma DLP que dispararía en SharePoint.
- Cloud Discovery muestra el catálogo de SaaS detectados.

### Variantes y extensiones

- Conectar ServiceNow además de Salesforce y aplicar la DLP a ambos.
- Configurar session policy para Salesforce con bloqueo de download por classification label.
- Configurar alerta en MDA: «Top user downloading sensitive files this month» con notificación al equipo SOC.

---

## LAB-11-4 — Configurar Communication Compliance para detectar lenguaje regulado en outputs

**Duración:** 20 min · **Producto:** Microsoft Purview Communication Compliance · **OA:** OA-11.6.

### Objetivo

Configurar una policy de Communication Compliance que monitorice los outputs de un agente de research financiero buscando lenguaje de «recomendación de inversión» (regulado en banca de inversión), defina un grupo de reviewers, y trabaje el flujo end-to-end de revisión humana cuando aparece un match.

### Pasos

1. **Identifica el agente target**:
   - En el tenant, selecciona un agente OBO de prueba que represente un caso de research / analisis financiero.
   - Anota su `agentId` y los `userPrincipalName` de sus invocadores típicos.

2. **Crea grupo de reviewers**:
   - Microsoft Entra → Groups → New group.
   - Type: Security group.
   - Members: 2-3 personas del equipo de Compliance o Legal con autoridad para revisar contenido regulado.
   - Name: `compliance-reviewers-research`.

3. **Crea la policy en Purview**:
   - compliance.microsoft.com → Communication Compliance → Policies → Create policy.
   - Template: «Inappropriate language» como base (luego personalizamos).
   - Name: `Agent-Research-RecomendacionInversion`.

4. **Configura users in scope**:
   - In scope: filtro por blueprint = `<id del blueprint del agente research>`. Esto incluye el agente y, por extensión, sus outputs.
   - Direction: Outbound + Internal.

5. **Configura content classifiers**:
   - Add trainable classifier: `FinancialReports` (built-in) — captura lenguaje financiero genérico.
   - Add keyword dictionary: crea dictionary `InvestmentRecommendationKeywords` con términos:
     - «recomendación de compra», «sell rating», «buy rating», «strong buy», «target price», «price target», «outperform», «underperform».
   - Combine condition: classifier `FinancialReports` AND dictionary `InvestmentRecommendationKeywords`.

6. **Review percentage**: 10 % (revisar uno de cada diez matches; ajustable según volumen y madurez del equipo).

7. **Reviewers**: el grupo `compliance-reviewers-research` creado en paso 2.

8. **Actions on detection**:
   - Notify reviewer (email + tarea en compliance dashboard).
   - Tag event as `Regulated language`.
   - Add to Insider Risk Management correlation engine.

9. **Activate policy**. Modo: Active. Espera 1-2 horas a propagación.

10. **Simulación**:
    - Invoca el agente research con un prompt que provoque lenguaje de recomendación: «Resúmeme el potencial de inversión de la acción XYZ y dame una recomendación para mi cartera».
    - El output del agente (que probablemente incluya algo como «con un target price de…») debe activar el match.
    - El reviewer recibe la notificación en su inbox de Communication Compliance.

11. **Workflow del reviewer**:
    - Reviewer abre el match: ve el output completo del agente, los keywords detectados resaltados, el contexto.
    - Decide: `Resolve as compliant` (falso positivo, p. ej. cita literal de un report externo) o `Escalate` (verdadero positivo).
    - Si escala, se crea automáticamente caso en Insider Risk Management con el agente + usuario invocador en bucle.

12. **Reporte semanal**:
    - Compliance Officer revisa cada lunes: número total de matches semana anterior, % resolved compliant vs escalated, distribución por agente, tiempo medio de resolución.
    - Si un agente concreto genera > 50 matches/semana, considerar ajustar su blueprint o aplicar restricciones adicionales.

### Validación

- La policy `Agent-Research-RecomendacionInversion` está activa con scope, classifiers y reviewers configurados.
- Una invocación simulada dispara el match esperado.
- El reviewer recibe la notificación y puede ejecutar el workflow Resolve vs Escalate.
- El reporte semanal muestra datos coherentes.

### Variantes y extensiones

- Adaptar la policy a otra industria regulada: sanidad (lenguaje de «consejo médico»), defensa (referencias a programas clasificados), legal (consejo legal informal).
- Configurar policy compañera de **Insider Risk Management** que correlacione los matches de CC con otros patrones (volumen anormal, scopes sensibles fuera de horario) para detectar uso anómalo del agente.
- Conectar el output del CC con Sentinel: crear data connector para que los matches resueltos como `Escalated` aparezcan en el SIEM corporativo.

---

## Cierre

Tras los cuatro labs has tocado todas las palancas operativas del módulo: una DLP policy específica para outputs de Agent 365 con flujo de override (LAB-11-1), un trainable classifier custom calibrado y promovido (LAB-11-2), integración cross-SaaS con MDA conectado a Salesforce (LAB-11-3), y vigilancia conversacional con Communication Compliance sobre agentes regulados (LAB-11-4).

Si quieres ir más allá:

- Integrar el output de DLP con el SIEM corporativo (Sentinel, Splunk) para SOC tier 1.
- Construir un dashboard ejecutivo CISO con las 4 métricas clave del módulo: blocks evitados / tasa override / agentes problemáticos / deuda CC.
- Programar la auditoría trimestral de re-entrenamiento de classifiers custom.

El siguiente módulo (M12) cierra el área 4 con **Microsoft Defender XDR aplicado a agentes**: la pieza que detecta e investiga cuando algo se cuela a pesar de la prevención.
