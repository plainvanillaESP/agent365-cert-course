---
modulo: 11
tipo: teoria
titulo: "DLP, sensitivity labels avanzadas y Communication Compliance"
duracion_lectura_min: 90
ultima_actualizacion: 2026-05-11
objetivos_aprendizaje:
  - id: OA-11.1
    texto: "Diferenciar Data Loss Prevention (DLP) de Information Protection (M10): qué cubre cada uno, dónde se solapan, dónde son complementarios para outputs de agentes."
    bloom: Comprender
  - id: OA-11.2
    texto: "Diseñar la anatomía completa de una DLP policy aplicada a outputs de agentes: locations, conditions (SITs + trainable classifiers), actions (block, audit, justify, override)."
    bloom: Aplicar
  - id: OA-11.3
    texto: "Configurar trainable classifiers para detectar patrones específicos del negocio (contratos, conversaciones reguladas, lenguaje propietario) que las SITs estáticas no capturan."
    bloom: Aplicar
  - id: OA-11.4
    texto: "Configurar DLP runtime policies que bloqueen o auditen outputs de agente según contenido detectado, con flujo de justificación al usuario invocador y registro forense."
    bloom: Crear
  - id: OA-11.5
    texto: "Integrar DLP con Microsoft Defender for Cloud Apps (MDA) para cubrir aplicaciones SaaS de terceros conectadas al agente vía conectores."
    bloom: Aplicar
  - id: OA-11.6
    texto: "Aplicar Communication Compliance a conversaciones con participación de agentes para detectar acoso, divulgación regulada y lenguaje sensible."
    bloom: Aplicar
  - id: OA-11.7
    texto: "Operacionalizar el conjunto DLP + Communication Compliance + Insider Risk: triaje semanal, exclusiones temporales con justificación, reporting al CISO."
    bloom: Analizar
---

# Módulo 11 — DLP, sensitivity labels avanzadas y Communication Compliance

> **Duración estimada de lectura:** 90 minutos.
>
> **Prerrequisitos:** M01 (fundamentos), M09 (Conditional Access), M10 (Purview e Information Protection).
>
> M10 cubrió **información**: clasificar el dato, etiquetarlo, heredar etiquetas a outputs, cifrar, dejar evidencia forense. M11 cubre **prevención activa**: aplicar policies en runtime que bloqueen o auditen acciones específicas sobre ese dato cuando el agente, o el usuario invocador, intentan algo problemático. Si M10 es la radiografía del dato, M11 es el filtro que decide qué se hace con esa radiografía.

---

## 11.1 DLP vs Information Protection: dónde está la frontera

La confusión más frecuente al diseñar políticas Purview para agentes es mezclar Information Protection (IP) con Data Loss Prevention (DLP). Son disciplinas hermanas que comparten datos (los mismos SITs, las mismas labels) pero responden a preguntas diferentes.

### 11.1.1 Las dos preguntas que se reparten

| Disciplina | Pregunta que responde | Cuándo actúa |
|---|---|---|
| **Information Protection (M10)** | ¿Cómo se etiqueta este dato y qué protección viaja con él? | En el momento de la creación o ingestión del dato; el resultado es persistente (cifrado, watermark, audit) |
| **Data Loss Prevention (M11)** | ¿Esta acción concreta sobre este dato debe permitirse, registrarse o bloquearse? | En el momento de la acción (compartir, enviar, copiar, generar un output); el resultado es decisional (allow / audit / block / justify-and-allow) |

Un archivo `Confidential` lleva su label IP siempre. Una invocación de agente que intenta enviar ese archivo a un destinatario externo dispara la decisión DLP en ese instante concreto.

### 11.1.2 Cómo se complementan en una invocación

Imaginemos un agente OBO de Comercial que genera un resumen ejecutivo combinando datos de tres archivos `Confidential`. La secuencia es:

1. **IP (M10) en input**: cada uno de los tres archivos lleva su label `Confidential`. El agente los lee con permisos heredados del usuario.
2. **IP (M10) en output**: el output hereda automáticamente la label más restrictiva (`Confidential`). Se cifra con AES-256, se aplica watermark.
3. **DLP (M11) en runtime**: cuando el usuario pide al agente que envíe el resumen por email a un cliente externo, la DLP policy evalúa la acción: el output es `Confidential` + el destinatario está fuera del tenant → bloqueo con mensaje al usuario, opción de justificar override si la policy lo permite.
4. **Audit (compartido)**: tanto la acción IP como la decisión DLP quedan registradas en el audit log para auditoría posterior.

Sin IP, DLP no sabe sobre qué decidir. Sin DLP, IP protege el dato pero no impide la acción problemática. **Ambas son necesarias**.

### 11.1.3 Capacidades exclusivas de DLP

DLP aporta tres capacidades que IP no cubre por sí sola:

- **Decisión en runtime**: bloquear o permitir una acción concreta en el momento (vs IP que se aplica al dato y luego solo se «defiende»).
- **Flujo de justificación**: el usuario puede pedir override con motivo escrito, que queda auditado y notificado al equipo de seguridad.
- **Cobertura multicanal**: una sola DLP policy puede aplicar simultáneamente a Outlook, Teams, SharePoint, OneDrive, endpoint y agentes de Agent 365. IP es por servicio.

---

## 11.2 Anatomía de una DLP policy para agentes

Toda DLP policy de Purview se construye con cuatro componentes que conviene entender en orden: dónde se aplica (location), cuándo se dispara (conditions), qué hace (actions), cómo se comunica al usuario (user experience).

### 11.2.1 Locations: dónde se aplica la policy

Las locations soportadas relevantes para agentes son:

| Location | Cobertura |
|---|---|
| **Exchange Online** | Emails enviados (incluyendo emails generados o redactados por agentes vía Copilot) |
| **SharePoint sites** | Archivos en sites; aplica cuando el agente intenta crear o modificar |
| **OneDrive accounts** | Archivos en OneDrive personal del usuario invocador |
| **Teams chats and channels** | Mensajes en Teams (incluyendo respuestas de agentes en chat) |
| **Devices (Endpoint DLP)** | Acciones en dispositivo: copiar al portapapeles, imprimir, USB |
| **On-premises repositories** | Archivos en servidores file share corporativos (vía MIP Scanner) |
| **Microsoft Defender for Cloud Apps** | SaaS de terceros conectadas vía MDA conectores |
| **Microsoft Agent 365 outputs** ⭐ | **Específico: outputs generados por agentes M365** |

La última location, **Microsoft Agent 365 outputs**, es nueva con Agent 365 y crítica: aplica DLP directamente al output del agente antes de que se entregue al usuario invocador.

### 11.2.2 Conditions: cuándo se dispara

Las conditions son la lógica de detección. Para agentes son típicas:

- **Sensitive Information Types (SITs)**: patrones estáticos (tarjetas, DNI, IBAN, SSN).
- **Sensitivity labels**: la label heredada por el output (`Confidential`, `Highly Confidential`).
- **Trainable classifiers**: modelos ML entrenados para detectar tipos de contenido específicos (contratos, ofertas, comunicaciones reguladas). Ver § 11.3.
- **Keywords + dictionaries**: listas de términos del negocio (códigos de proyecto, nombres de clientes M&A).
- **Document fingerprinting**: matching exacto contra plantillas conocidas (NDAs, contratos).
- **Context conditions**: scope efectivo del agente, blueprint, owner, destinatario, dispositivo, ubicación.

### 11.2.3 Actions: qué hace la policy cuando se dispara

| Action | Comportamiento | Cuándo usar |
|---|---|---|
| **Audit only** | Registra el evento, no interfiere con la acción | Primera fase de despliegue, validar precisión antes de bloquear |
| **Block with override** | Bloquea por defecto, el usuario puede justificar y continuar (queda auditado) | Caso típico operativo: protege con flexibilidad para excepciones legítimas |
| **Block** | Bloquea sin posibilidad de override | Solo para casos donde la regulación no admite excepción (PCI-DSS, datos sanitarios sensibles) |
| **Notify only** | El usuario recibe un aviso pero la acción procede | Educativo: «este envío contiene PII, revisa antes de enviar» |
| **Restrict access to encrypted content** | Aplica protección IP retroactiva al contenido | Cuando se detecta que un archivo debería tener label superior |

Las decisiones más operativas combinan **audit only durante 2-4 semanas** (modo simulación) para validar la precisión de la detección, y luego **block with override** para producción real. Pasar directamente a `block` sin simulación es la fuente principal de incidentes operativos: bloqueos legítimos masivos, ticket queue saturada, presión política para revertir la policy entera.

### 11.2.4 User experience: el mensaje al usuario

La policy debe definir tres mensajes:

- **Policy tip**: texto que aparece antes de la acción cuando el contenido se detecta. Ejemplo: «Este email parece contener datos `Confidential`. Asegúrate de que el destinatario tiene permiso».
- **Block message**: texto cuando la policy bloquea. Ejemplo: «Esta acción está bloqueada por la política de protección de datos financieros. Si necesitas excepción, usa Justify».
- **Justification reason**: opciones predefinidas para el override + campo de texto libre. Las opciones cubren los casos legítimos esperables («Comunicación con asesor legal externo autorizado», «Cliente con NDA firmado», «Emergencia operativa», «Otro»).

Cada justificación queda registrada con UPN, timestamp, motivo seleccionado, texto libre, y la acción permitida. Es evidencia forense si más tarde se sospecha exfiltración intencionada.

---

## 11.3 Trainable classifiers: detección más allá de SITs

Las SITs estáticas (tarjetas, DNI) son potentes pero limitadas: no detectan «una conversación de ventas confidencial» o «el lenguaje típico de un contrato M&A». Para eso existen los trainable classifiers, modelos de machine learning que se entrenan con ejemplos representativos del tipo de contenido a detectar.

### 11.3.1 Classifiers built-in disponibles

Microsoft Purview viene con classifiers preentrenados listos para usar:

- `OffensiveLanguage`: lenguaje ofensivo, acoso, discriminación.
- `Harassment`: patrones de hostigamiento.
- `Threats`: amenazas explícitas o veladas.
- `ProfanityProfile`: profanidad genérica.
- `Resumes`: currículos y datos de candidatos.
- `SourceCode`: código fuente en lenguajes comunes.
- `ContractDocuments`: lenguaje contractual genérico.
- `FinancialReports`: informes financieros con estructura típica.
- `LegalAffairs`: documentación legal corporativa.

Cuando un output de agente activa uno de estos classifiers, la DLP policy puede actuar (audit, block) aunque el contenido no contenga ninguna SIT canónica.

### 11.3.2 Custom trainable classifiers

Para detectar contenido específico de la organización (códigos internos, jerga propia, tipos de documento únicos), se entrenan classifiers custom. El flujo es:

1. **Recopilar muestras**: 50-500 documentos representativos del tipo de contenido a detectar. Diversidad importa más que volumen.
2. **Cargar al training set**: Purview admin center → Data classification → Trainable classifiers → New.
3. **Entrenar el modelo**: Purview lo procesa entre 8-24h. El resultado es un modelo con precision/recall metrics.
4. **Evaluar con muestras de prueba**: enviar 50-100 documentos nuevos (no usados en training) etiquetados manualmente. Comparar predicción del classifier vs etiqueta humana.
5. **Calibrar threshold**: si precision es baja (muchos falsos positivos), subir el threshold de confianza. Si recall es bajo (se le escapan casos), bajar threshold o reentrenar con más muestras.
6. **Promover a producción**: una vez precision ≥ 80 % y recall ≥ 70 %, usarlo en DLP policies y auto-labeling.

### 11.3.3 Combinación de classifiers en una policy

Una DLP policy potente combina varios classifiers en condiciones AND/OR. Ejemplo:

```yaml
# Pseudocódigo de condition compuesta
condition:
  - if: outputContains(SIT.CreditCardNumber)
      OR (trainable_classifier.ContractDocuments AND keyword.exists(['M&A', 'merger', 'acquisition']))
      OR sensitivity_label IN [Confidential, HighlyConfidential]
    action: block_with_override
```

Esto detecta el caso «el agente generó un output que combina información financiera con lenguaje contractual M&A», que ninguna SIT individual cubriría pero es exactamente lo que el equipo de M&A necesita proteger.

### 11.3.4 Limitaciones a recordar

- Los trainable classifiers tienen latencia: ingestión del output → clasificación → decisión DLP toma 100-500 ms. Para outputs de agente eso es aceptable.
- La precision nunca es 100 %. Operacionalmente, todo modelo tiene falsos positivos. Por eso `block with override` es preferible a `block`.
- El re-entrenamiento es necesario: con el tiempo, el lenguaje del negocio evoluciona. Auditar mensualmente la precisión del classifier y reentrenar trimestralmente con casos nuevos.

---

## 11.4 DLP en runtime para outputs de agentes

La capacidad estrella de DLP integrado con Agent 365 es la **evaluación en runtime de outputs**: cuando un agente genera un output, antes de entregarlo al usuario, Purview lo evalúa contra las DLP policies activas y aplica la action correspondiente.

### 11.4.1 Flujo técnico

```
[Usuario invoca agente]
         ↓
[Agente accede a datos, genera output]
         ↓
[Purview DLP runtime engine evalúa el output]
         ↓
    ┌────┴────┐
    │         │
[allow]   [block / justify]
    │         │
    ↓         ↓
[output    [user UX:
 entregado] policy tip /
            block screen /
            justify dialog]
                  ↓
            [si justify aceptada → allow]
            [si justify denegada → block sustained]
```

La latencia total añadida es típicamente 200-800 ms para outputs medianos (1-3K tokens). Para outputs largos puede llegar a 2-3 segundos. Es aceptable y muy preferible a entregar contenido problemático sin filtro.

### 11.4.2 Override con justificación: el flujo del usuario

Cuando la policy es `block with override` y se dispara, el usuario ve:

1. **Block screen** con explicación: «Este resumen contiene contenido `Confidential` que no puede compartirse con destinatarios externos por defecto».
2. **Opción "Solicitar excepción"** que abre el diálogo de justificación.
3. **Diálogo de justificación**: dropdown con razones predefinidas + campo libre obligatorio (mínimo 20 caracteres).
4. **Submit**: el sistema permite la acción y registra el evento con `policyOverrideEvent`. Notifica al equipo de seguridad si la policy tiene `notifyOnOverride: true`.

Operacionalmente, las organizaciones que diseñan bien la lista de razones predefinidas tienen tasas de override genuinas (excepciones legítimas) del 1-3 % de las invocaciones afectadas. Tasas mucho mayores indican que la policy es demasiado restrictiva o que las razones predefinidas no cubren casos legítimos comunes.

### 11.4.3 Cobertura sobre el flow completo del agente

DLP runtime para Agent 365 puede aplicarse en tres puntos del flow:

| Punto | Qué evalúa | Cuándo usar |
|---|---|---|
| **Input-side** | El prompt del usuario antes de enviárselo al agente | Para impedir que el usuario pida algo regulado al agente |
| **Mid-flight** | Los datos accedidos durante la ejecución, antes de incluirlos en el output | Para impedir que el agente combine datos que no deberían cohabitar |
| **Output-side** | El output final antes de entregarlo al usuario | El caso más común y operativamente útil |

La práctica recomendada empieza por **output-side** (la mayor reducción de riesgo con menor complejidad) y, según madurez, añade input-side y mid-flight para casos específicos.

---

## 11.5 Integración con Microsoft Defender for Cloud Apps

Los agentes modernos conectan con SaaS externos (Salesforce, ServiceNow, Workday, GitHub, Jira). El dato accedido por el agente puede no estar en M365 sino en una de estas apps. **Microsoft Defender for Cloud Apps (MDA)** es el broker que extiende DLP y Communication Compliance a esos SaaS.

### 11.5.1 Conectores MDA relevantes

MDA tiene conectores out-of-the-box para:

- Salesforce, Microsoft Dynamics 365 (CRM)
- Workday, SAP SuccessFactors (HCM)
- ServiceNow (ITSM)
- GitHub, GitLab, Bitbucket (Dev)
- Google Workspace, Box, Dropbox (file sharing)
- Slack, Webex (communications)
- 30+ apps adicionales en el catálogo

Cuando un agente accede a un archivo en Salesforce, MDA registra el acceso con el `agentId` y aplica las policies DLP que estén configuradas para Salesforce.

### 11.5.2 DLP cross-SaaS

Una DLP policy de Purview puede definir conditions que apliquen igual a M365 y a SaaS externos:

```yaml
condition:
  if: sensitivity_label == "HighlyConfidential"
location:
  - Exchange Online
  - SharePoint
  - Agent 365 outputs
  - Microsoft Defender for Cloud Apps:
      apps: [Salesforce, ServiceNow]
action:
  block_with_override
```

Resultado: el mismo control se aplica si el agente intenta exfiltrar `HighlyConfidential` desde un archivo de SharePoint, desde un email, o desde un registro de Salesforce.

### 11.5.3 Shadow IT y agentes no aprovisionados

MDA tiene un módulo separado, **Cloud Discovery**, que detecta SaaS usados por la organización pero no oficialmente aprovisionados (shadow IT). Si aparece un nuevo agente o aplicación de IA generativa siendo usada en la red corporativa, MDA lo detecta y notifica. Esto cubre el caso de un equipo que despliega un agente fuera de la gobernanza central de Agent 365.

### 11.5.4 Session policies en tiempo real

Para apps especialmente sensibles, MDA puede operar en modo **reverse proxy** (session policy): cada interacción del agente con la app pasa por MDA en tiempo real. Esto permite:

- Bloquear descargas de archivos `Confidential+` desde Salesforce al agente.
- Forzar etiquetado retroactivo de un archivo accedido si MDA detecta SITs no etiquetadas.
- Restringir acciones específicas (impedir que el agente ejecute mass-export aunque su scope técnico lo permita).

La session policy es más invasiva (latencia, complejidad operativa) y solo se justifica en apps críticas. Típicamente se aplica a CRM y HCM, no a herramientas de productividad genéricas.

---

## 11.6 Communication Compliance: el agente como participante regulado

Communication Compliance (CC) es el componente de Purview que monitoriza conversaciones internas y externas en busca de patrones de riesgo: acoso, divulgación de información confidencial, lenguaje regulado en industrias supervisadas (banca, sanidad, defensa). Con Agent 365, **los agentes pasan a ser participantes del scope de Communication Compliance**.

### 11.6.1 Por qué los agentes están en scope

Un agente puede generar mensajes que llegan a humanos. Esos mensajes pueden contener:

- Lenguaje ofensivo o tendencioso (el modelo replica patrones del corpus de training si no se controla).
- Divulgación accidental de información confidencial a destinatarios no autorizados.
- Lenguaje regulado: declaraciones de inversión, consejo médico, recomendación legal.

Si los humanos en la organización están sujetos a Communication Compliance, dejar a los agentes fuera es una brecha regulatoria evidente.

### 11.6.2 Configurar policies de CC para agentes

Una policy típica de CC incluye:

- **Users in scope**: usuarios del tenant + agentes específicos (filtrable por blueprint, departamento, scope).
- **Direction**: inbound, outbound, internal.
- **Content classifiers**:
  - SITs (mismas que DLP).
  - Trainable classifiers (`OffensiveLanguage`, `Threats`, custom).
  - Sensitive labels.
  - Keyword dictionaries (productos sin lanzar, M&A en curso).
- **Review percentage**: % de conversaciones que se muestrean para revisión humana (típicamente 5-15 %).
- **Reviewers**: grupo o personas autorizadas a revisar matches.
- **Actions on detection**: notificar reviewer, registrar evento, escalar a HR / Legal / Compliance.

### 11.6.3 Workflow de revisión

Cuando un mensaje de un agente activa una policy, el flujo es:

1. El mensaje se entrega normalmente al destinatario (CC no bloquea por defecto; es vigilancia, no policía).
2. Aparece en la inbox de revisores con el extracto detectado resaltado.
3. El revisor evalúa: `Resolve as compliant` (falso positivo) o `Escalate` (verdadero positivo).
4. Si escala, se abre un caso en Insider Risk Management con el agente y el usuario invocador en bucle.
5. HR / Compliance toman acción según política interna (entrenamiento al usuario, ajuste de blueprint, revocación temporal).

### 11.6.4 Ejemplos de aplicación

| Industria | Policy de Communication Compliance típica |
|---|---|
| **Banca de inversión** | Detectar lenguaje de «recomendación de inversión» en outputs de agentes de research; impedir consejo informal a clientes |
| **Sanidad** | Detectar «consejo médico» en outputs de agentes de soporte; restringir a personal médico cualificado |
| **Defensa** | Detectar referencias a programas clasificados en outputs de agentes; aislar por compartimento |
| **General (HR)** | Detectar lenguaje discriminatorio o de acoso en mensajes redactados por agentes de comunicación interna |

---

## 11.7 Operación del día a día

### 11.7.1 Triaje semanal del equipo de DLP

Una vez por semana, el responsable de DLP / Compliance abre el dashboard y procesa:

1. **Alertas pendientes de la semana** (típicamente 20-200 dependiendo del tamaño): clasificar cada una como `Confirmed`, `False positive`, `Need investigation`.
2. **Falsos positivos**: agruparlos por causa raíz. Si una SIT específica genera el 60 % de los FP, ajustar el threshold de confianza o añadir excepciones contextuales.
3. **Confirmados**: revisar si los reviewers están actuando con SLA (< 48h). Escalar acumulados.
4. **Override events**: revisar justificaciones de la semana. Si el mismo usuario genera 5+ overrides con la misma justificación, abrir caso (¿uso anómalo? ¿policy mal diseñada?).
5. **Tendencias**: ¿se incrementa el volumen de detecciones? ¿hay un nuevo agente desplegado que mueve la aguja? Comparar con baseline.

### 11.7.2 Exclusiones temporales con justificación

A veces un caso de negocio legítimo requiere desactivar temporalmente una policy (por ejemplo, lanzamiento de producto donde se comparte info `Confidential` con partners autorizados durante 72 horas). El flujo:

1. Solicitud formal por escrito del business owner.
2. Justificación firmada con plazo (start/end datetime).
3. Aprobación dual: business owner + CISO.
4. Configuración en Purview: temporary exclusion con expiración automática en el endpoint datetime.
5. Auditoría post: revisar qué eventos pasaron durante la ventana y validar que fueron legítimos.

La expiración automática es crítica: sin ella, las excepciones temporales se eternizan y desnudan la postura DLP entera.

### 11.7.3 Reporting mensual al CISO

El reporte mensual al CISO debe responder cuatro preguntas en una hoja:

1. **¿Cuántas exfiltraciones potenciales se evitaron este mes?** Total de blocks ejecutados, agrupados por sensitivity label.
2. **¿Cuál fue la tasa de override?** % de blocks que se overrider con justificación, comparado con el target (< 5 %).
3. **¿Hay agentes problemáticos?** Top 3 agentes por detecciones DLP, con análisis de si la causa es contenido legítimo del negocio o uso anómalo.
4. **¿Cómo va la deuda de revisión?** Casos de Communication Compliance pendientes con > 7 días sin resolver.

Las cuatro preguntas son las que el CISO necesita responder al comité ejecutivo. Cualquier dato fuera de esas cuatro va al apéndice del informe.

### 11.7.4 Tres errores operacionales comunes

- **Despliegue directo a `block` sin simulación**: el primer mes hay un pico de bloqueos legítimos, presión política, y la policy se desactiva en lugar de afinarse. Siempre empezar con `audit only` 2-4 semanas.
- **Sin reentrenamiento de classifiers**: el lenguaje del negocio cambia. Un classifier que tenía 90 % de precision hace 6 meses puede haber caído a 60 % sin que nadie lo notase. Auditar mensualmente.
- **Justificaciones libres sin opciones predefinidas**: «otro» se vuelve la única razón usada, perdiendo capacidad analítica. Diseñar 4-6 razones predefinidas que cubran 80 % de los casos legítimos.

---

## Glosario de términos clave del módulo

| Término | Definición breve |
|---|---|
| **Data Loss Prevention (DLP)** | Disciplina y conjunto de policies de Purview que evalúa acciones sobre datos (compartir, enviar, copiar, generar outputs) y aplica decisiones runtime: allow, audit, block, justify-and-allow. |
| **Information Protection vs DLP** | IP etiqueta y protege el dato persistentemente; DLP decide qué hacer con acciones concretas sobre ese dato en runtime. Son complementarias. |
| **DLP policy** | Conjunto formado por locations, conditions, actions, user experience. Define dónde, cuándo y cómo se aplica la prevención. |
| **Block with override** | Action DLP que bloquea por defecto pero permite al usuario justificar y proceder. La justificación queda auditada. Es la action operativa más común. |
| **Audit only** | Action DLP que solo registra el evento sin interferir. Modo de simulación recomendado al inicio para validar precision. |
| **SIT (Sensitive Information Type)** | Patrón estático (tarjetas, DNI, IBAN) detectable por regex + diccionarios. Más de 200 SITs built-in en Purview. |
| **Trainable classifier** | Modelo ML entrenado para detectar tipos de contenido específicos (contratos, código, documentos financieros). Detecta lo que SITs estáticas no capturan. |
| **Custom trainable classifier** | Classifier entrenado con muestras propias de la organización para detectar contenido único (códigos internos, plantillas, jerga). |
| **Microsoft Agent 365 outputs (location)** | Location DLP específica que evalúa outputs generados por agentes Agent 365 en runtime antes de entregarlos al usuario. |
| **Microsoft Defender for Cloud Apps (MDA)** | Broker que extiende Purview a SaaS de terceros (Salesforce, ServiceNow, GitHub, etc.) vía conectores. Permite aplicar DLP cross-SaaS. |
| **Cloud Discovery** | Módulo de MDA que detecta SaaS y aplicaciones de IA usadas en la red corporativa pero no oficialmente aprovisionadas (shadow IT). |
| **Session policy (MDA)** | Modo reverse proxy de MDA: cada interacción del agente con una app pasa por MDA en tiempo real, permitiendo bloqueos contextuales. |
| **Communication Compliance (CC)** | Componente de Purview que monitoriza conversaciones (incluyendo aquellas con participación de agentes) buscando acoso, divulgación regulada, lenguaje sensible. |
| **Policy override event** | Evento de audit que registra cuando un usuario justifica y procede a pesar de un bloqueo DLP. Incluye UPN, razón, texto libre, action permitida. |
| **Precision / Recall** | Métricas de evaluación de un trainable classifier. Precision: % de detecciones que son correctas. Recall: % de casos reales que son detectados. |
| **Temporary exclusion** | Excepción documentada y aprobada con start/end datetime para desactivar una policy DLP en una ventana específica (lanzamientos, M&A activos). |

---

## Resumen del módulo

- Information Protection (M10) etiqueta y protege el dato; DLP (M11) decide en runtime qué hacer con acciones concretas sobre ese dato. Son complementarias.
- Una DLP policy se compone de locations, conditions (SITs + classifiers + labels + keywords), actions (audit / block / justify) y user experience (policy tip / block message / justification reasons).
- Los trainable classifiers extienden la detección más allá de SITs estáticas; los built-in cubren acoso, contratos, código, documentos financieros, y se pueden entrenar custom para contenido específico del negocio.
- DLP runtime para outputs de Agent 365 evalúa cada output antes de entregarlo. La latencia añadida es 200-800 ms para outputs típicos. El flujo de override con justificación es la pieza operativa central.
- Microsoft Defender for Cloud Apps extiende DLP a SaaS de terceros vía conectores. Las session policies en modo reverse proxy permiten control en tiempo real sobre apps especialmente sensibles.
- Communication Compliance incluye a los agentes como participantes en scope. Una policy típica monitoriza outputs por acoso, divulgación, lenguaje regulado, con revisión humana del 5-15 % de matches.
- La operación se articula en tres rituales: triaje semanal de alertas, gestión de exclusiones temporales con expiración automática, y reporte mensual al CISO con cuatro métricas clave.

## Hacia el módulo siguiente

M12 cubre **Microsoft Defender XDR aplicado a agentes**: el SIEM/XDR de Microsoft, la tabla `CloudAppEvents`, hunting con KQL para investigar incidentes con participación de agentes, y la integración con Sentinel para SOCs maduros. Es la pieza que cierra el ciclo: M09-M11 previenen y protegen; M12 detecta e investiga cuando algo se cuela.
