---
modulo: 3
tipo: evaluacion
titulo: "Evaluación del Módulo 03"
duracion_min: 15
area_examen: 1
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
preguntas_oficiales: 1
caso_estudio: true
---

# Módulo 03 — Evaluación

> Una pregunta oficial del banco que el M03 aporta al examen final, más un caso de estudio extenso de refuerzo.

## Preguntas oficiales del banco

### EX-03-001 · Multiple choice · Media

**OA mapeado:** OA-03.1 · **Área:** 1 · **Bloom:** Evaluar

**Enunciado:**

Una empresa de 4.000 empleados con Microsoft 365 E5 corporativo tiene actualmente Copilot desplegado en el 35 % de su plantilla (1.400 licencias) y planea desplegar Microsoft Agent 365 a esos mismos 1.400 usuarios. La adopción de Copilot lleva 6 meses creciendo al 5 % mensual y la dirección no quiere cambiar la dinámica. ¿Cuál es la recomendación de licenciamiento más adecuada?

A) Migrar toda la plantilla a Microsoft 365 E7 ($99 × 4.000 = $396.000/mes) para tener gobernanza completa con Risks column desde el inicio.
B) Mantener E5 como base, comprar 1.400 licencias Agent 365 standalone ($15) y mantener Copilot solo en los usuarios que ya lo tienen, revisando la decisión cuando la adopción Copilot supere el 60 %.
C) Comprar Agent 365 E7 únicamente para los 1.400 usuarios con Copilot y dejar al resto sin Agent 365.
D) Contratar Frontier preview con 25 licencias gratuitas y desplegar Agent 365 solo a esos 25 usuarios mientras se evalúa la decisión.

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** B

**Justificación:** la decisión standalone vs E7 depende del peso de Copilot, no de Agent 365. Con un 35 % de adopción Copilot creciendo al 5 % mensual, la organización está aún por debajo del break-even típico (60-70 %). E5 + Agent 365 standalone para los 1.400 usuarios que invocan agentes ($57 + $15 = $72 × 1.400 + Copilot ya pagado) es significativamente más barato que migrar los 4.000 a E7. La opción A sobrepaga ~$120 000/mes en E5 base que ya tienen y E7 a usuarios que no usan Copilot. La C mezcla SKUs sin justificación operativa (Agent 365 E7 no es un SKU; E7 es bundle completo). La D malentiende Frontier preview: es para validar capacidades nuevas, no para producción a 1.400 usuarios. Ver § 3.6.

</details>

---

## Caso de estudio (refuerzo)

> El caso de estudio no se evalúa pero refuerza la comprensión integral del módulo. Recomendado tras leer la teoría y antes de pasar al Módulo 04.

### Contexto

**ContosoFinance**, una entidad financiera con 8.500 empleados:

- Microsoft 365 E5 corporativo desplegado al 100 %.
- Microsoft 365 Copilot desplegado al 70 % (5.950 licencias).
- Pendiente de decisión de licenciamiento Agent 365.
- Casos de uso identificados:
  - 30 agentes declarativos de Copilot Studio (uno por departamento, RRHH, Finanzas, Legal, etc.) con consumo medio de 800 mensajes/mes cada uno.
  - 4 agentes de Foundry hosted con modelo GPT-4o para análisis financiero. Consumo: ~250 millones de tokens/mes.
  - Plan de añadir 10 agentes autonomous para monitorización de buzones compartidos (área cumplimiento normativo, 24/7).
- Compliance: regulación financiera estricta (PCI-DSS, MIFID II). Auditoría externa exige Risks column en Registry y trazabilidad completa en Defender.

### Preguntas guiadas

1. **Decisión SKU principal.** ¿Standalone $15 + add-ons o migrar a E7 corporativo? Justifica con el cálculo del break-even y los requisitos de compliance.

2. **Cobertura de los agentes autonomous.** ¿Pueden los 10 agentes autonomous operar bajo licenciamiento GA? ¿Qué alternativa hay y qué implicaciones tiene para la planificación?

3. **Modelos de consumo paralelos.** Estima el consumo mensual de las tres líneas de billing para ContosoFinance. Calcula el coste mensual aproximado de cada una.

4. **Plan de despliegue.** Diseña un plan de despliegue en cuatro fases para ContosoFinance, indicando qué subset de licencias se activa en cada fase y qué métricas se trackean.

### Pista

Para la pregunta 3, asume:
- Copilot Studio: 1 mensaje ≈ 3 créditos de media en agentes departamentales.
- 30 agentes × 800 mensajes/mes × 3 créditos = 72.000 créditos/mes ≈ 3 packs de $200.
- Foundry GPT-4o: $5/millón de tokens input + $15/millón output (precios típicos mayo 2026, asume ratio 3:1).
- 250M tokens × precio medio = factura mensual de los 4 Foundry agents.

### Solución comentada

<details>
<summary>Ver solución completa</summary>

**Pregunta 1 — Decisión SKU principal**

Aplicando el cálculo de break-even:

- E5 + Agent 365 + Copilot al 70 % = 8.500 × 57 + 5.950 × 15 + 5.950 × 30 = $484.500 + $89.250 + $178.500 = **$752.250/mes**
- E7 corporativo = 8.500 × 99 = **$841.500/mes**

A 70 % de Copilot, E5+Agent 365+Copilot todavía es ~$89.000/mes más barato que E7. **Pero** los requisitos de compliance (Risks column obligatoria por auditoría externa) inclinan la balanza hacia E7. Adicionalmente, E7 simplifica la administración (un único SKU, todas las capacidades incluidas) y elimina el riesgo de sub-licenciamiento al crecer Copilot.

**Recomendación: migrar a E7 corporativo.** Aunque hay un sobrecoste mensual de ~$89.000, está justificado por (a) cumplimiento regulatorio de Risks column, (b) cobertura plena de Internet Access para agentes que salgan a internet en investigaciones, (c) crecimiento esperado de Copilot al 100 % en 6-12 meses, momento en que E7 sí será más barato.

**Pregunta 2 — Cobertura de autonomous**

Los 10 agentes autonomous **NO pueden** operar bajo licenciamiento GA en mayo de 2026: el modelo per-instance autonomous sigue en Frontier preview. Alternativas:

- **Esperar a la GA del modelo per-instance.** Anunciado pero sin fecha. Riesgo: el roadmap del proyecto no avanza.
- **Solicitar entrada en Frontier preview.** Vía cuenta-manager de Microsoft. Cubre hasta 25 instancias gratuitas, suficiente para los 10 propuestos. Implicación: el cliente debe aceptar las condiciones del programa (feedback obligatorio, soporte best-effort, capacidades en preview).

Recomendación: solicitar Frontier preview en paralelo al despliegue corporativo de E7. Los agentes autonomous se despliegan en fase 2 una vez aceptado el programa.

**Pregunta 3 — Tres líneas de billing**

| Línea | Cálculo | Coste mensual |
|---|---|---|
| Agent 365 (incluido en E7) | 8.500 × 99 = $841.500 | $841.500 (es la línea E7 completa) |
| Copilot Studio Credits | 72.000 créditos / 25.000 por pack ≈ 3 packs × $200 | ~$600 |
| Foundry per-token GPT-4o | 250M tokens × ratio 3:1 input/output × ($5/M + $15/M / 4) ≈ $1.875 | ~$1.875 |
| **Total mensual** | | **≈ $844.000** |

Las dos líneas de consumo (Copilot Credits + Foundry) suman ~$2.475/mes, un 0,3 % del coste de licencias. Para una entidad de este perfil, el grueso del gasto está en el bundle E7. Si la organización añadiera 100 agentes Copilot Studio adicionales (en lugar de 30), la línea Copilot Credits subiría a ~$2.000/mes, todavía marginal frente a las licencias.

**Pregunta 4 — Plan de despliegue**

| Fase | Duración | Volumen | Activaciones | Métrica clave |
|---|---|---|---|---|
| **F1: Piloto Frontier** | 8 semanas | 25 licencias gratuitas + 1 área (Tesorería) | Registry inicial, sponsor por agente, baseline Defender | Feedback usuarios, baseline incidentes |
| **F2: Expansión** | 3 meses | Migración 100 % a E7 corporativo | DLP en Purview, CA agentes, integración Defender XDR completa | % agentes con sponsor (>95 %), 0 incidentes graves |
| **F3: GA por waves** | 6 meses | Despliegue áreas restantes, 30 DA + 4 Foundry + 10 autonomous (Frontier) | Monitorización proactiva, Risks column obligatoria, lifecycle workflows | NPS interno >7, incidentes mensuales bajando |
| **F4: Operación continua** | Permanente | Optimización trimestral | Revisión Copilot Credits, deprecación de agentes inactivos, política de modelos en Foundry | Coste/agente activo, 0 violaciones compliance |

</details>

---

## Validación de aprendizaje

Antes de pasar al M04, el alumno debe poder responder sin notas:

- **Standalone $15 vs E7 $99 — ¿de qué depende la decisión?** De la adopción de Copilot, no de Agent 365.
- **¿La licencia Agent 365 cubre agentes autonomous?** No: solo cubre OBO. Autonomous siguen per-instance en Frontier.
- **¿Cuántas líneas de billing aparecen para un agente DA que extiende un Foundry hosted con Work IQ?** Cuatro: Agent 365, Copilot Credits, Foundry per-token, M365 Copilot.
