---
modulo: 3
tipo: laboratorios
titulo: "Laboratorios del Módulo 03"
duracion_min: 25
area_examen: 1
estado: producido
fase_produccion: 3
ultima_actualizacion: 2026-05-06
laboratorios:
  - id: "03.1"
    titulo: "Calculadora de licenciamiento"
    duracion_min: 25
    dificultad: basico
    requiere_tenant: false
    licencias_requeridas: []
    roles_requeridos: []
---

# Módulo 03 — Laboratorios

## Prerrequisitos

- Lectura completa de la teoría del Módulo 03.
- Calculadora o hoja de cálculo (Excel, Google Sheets, Numbers).
- No se requiere tenant ni licencias para este lab. Es un ejercicio numérico y de criterio.

---

## Lab 03.1 — Calculadora de licenciamiento

**Duración:** 25 min · **Dificultad:** Básica

### Objetivo

Aplicar las reglas del módulo a cuatro escenarios reales: dimensionar la licencia adecuada, calcular el coste mensual de las tres líneas de billing y justificar por escrito la recomendación. El IT admin que termina este lab puede defender su recomendación ante un CFO sin titubear.

### Escenarios

#### Escenario A — Pyme exploradora

- **Empresa:** consultora boutique, 50 empleados.
- **Estado actual:** Microsoft 365 Business Premium (no E5). Sin Copilot.
- **Caso de uso:** un agente declarativo de Copilot Studio para responder dudas internas de RRHH (~200 mensajes/mes).
- **Compliance:** ninguno especial.
- **Pregunta:** ¿qué licenciamiento recomiendas?

#### Escenario B — Mediana empresa con Copilot piloto

- **Empresa:** ingeniería, 1.000 empleados.
- **Estado actual:** M365 E5 al 100 %. Copilot al 25 % (250 licencias) en piloto.
- **Caso de uso:** 5 agentes Copilot Studio para áreas de soporte (uno por área), 1.500 mensajes/mes en total. Ningún agente autonomous.
- **Compliance:** ISO 27001, sin requisitos regulatorios estrictos.
- **Pregunta:** ¿qué licenciamiento recomiendas y cuándo deberías reconsiderar la decisión?

#### Escenario C — Gran empresa con Copilot consolidado

- **Empresa:** retail, 6.000 empleados.
- **Estado actual:** M365 E5 al 100 %. Copilot al 75 % (4.500 licencias) y creciendo al 3 % mensual.
- **Caso de uso:** 50 agentes (30 Copilot Studio DA + 15 Foundry hosted + 5 SharePoint agents). Volumen alto: 25.000 mensajes/mes y ~120M tokens Foundry/mes.
- **Compliance:** estándar retail (PCI-DSS por pagos).
- **Pregunta:** ¿qué licenciamiento recomiendas? Calcula las tres líneas de billing.

#### Escenario D — Sector regulado con autonomous obligatorio

- **Empresa:** banca privada, 200 empleados senior.
- **Estado actual:** M365 E5 al 100 %. Copilot al 100 % (todos los empleados).
- **Caso de uso:** 8 agentes autonomous para monitorización de buzones compartidos de cumplimiento normativo (24/7), más 12 agentes Copilot Studio departamentales.
- **Compliance:** estricto (MIFID II, FATCA, GDPR), auditoría externa exige Risks column en Registry.
- **Pregunta:** ¿qué licenciamiento recomiendas? ¿Cómo cubres los agentes autonomous?

### Plantilla de cálculo

Para cada escenario, completa:

| Campo | Cómo se calcula |
|---|---|
| Recomendación SKU | Standalone, E7 o mixto |
| Línea 1 — Agent 365 (mensual) | Para standalone: $15 × usuarios. Para E7: ya incluido en el bundle E7. |
| Línea 2 — Copilot Credits (mensual) | Mensajes × créditos por mensaje (1-5) ÷ 25.000 créditos por pack × $200 |
| Línea 3 — Foundry per-token (mensual) | M tokens × precio modelo (GPT-4o ≈ $5-15/M según input/output) |
| Coste base de plataforma (E5/E7/Copilot) | Las licencias base ya pagadas |
| **Total nuevo coste mensual añadido** | Suma de las nuevas líneas (no incluyas lo ya pagado) |
| Justificación (3-4 líneas) | Por qué esta opción y no otra. Cita el módulo. |

### Output esperado

Para cada escenario:

- **Una línea con la recomendación.** «E5 + Agent 365 standalone + Copilot al 25 %» o similar.
- **Tabla con las tres líneas** y total mensual.
- **Justificación de 3-4 líneas** que cite explícitamente las reglas del módulo (break-even, cobertura OBO/autonomous, compliance, etc.).

---

## Solución comentada

> Lee solo después de haber resuelto los cuatro escenarios.

<details>
<summary>Solución completa</summary>

### Escenario A — Pyme exploradora

- **Recomendación:** mantener Business Premium + comprar 5-10 licencias Agent 365 standalone (no toda la plantilla).
- **Línea 1:** $15 × 5 = $75/mes (solo los usuarios que invoquen el agente).
- **Línea 2:** 200 mensajes × 3 créditos / 25.000 = irrelevante (no llega a un pack de $200; primer pack cubre meses).
- **Línea 3:** $0 (sin Foundry).
- **Total nuevo coste mensual añadido:** ~$75-200/mes (con margen para el primer pack de Copilot Credits cuando se necesite).
- **Justificación:** una pyme con un agente y bajo uso no necesita E5 ni E7. La licencia Agent 365 standalone se aplica solo a los usuarios que invocan el agente, no a toda la plantilla. Reconsiderar si el uso crece o aparecen requisitos de compliance.

### Escenario B — Mediana empresa con Copilot piloto

- **Recomendación:** mantener E5 + comprar 250 licencias Agent 365 standalone (alineadas con los usuarios que tienen Copilot). Mantener add-ons Copilot ya pagados.
- **Línea 1:** $15 × 250 = $3.750/mes.
- **Línea 2:** 1.500 mensajes × 3 créditos / 25.000 ≈ irrelevante en el primer pack ($200).
- **Línea 3:** $0.
- **Total nuevo coste mensual añadido:** ~$3.950/mes.
- **Reconsiderar cuando:** Copilot supere el 60-70 % de adopción (≥ 600 licencias), entonces calcular el break-even con E7.
- **Justificación:** ir con E7 ($99 × 1.000 = $99.000/mes) cuando solo el 25 % usa Copilot es sobrepagar por capacidades no consumidas. Standalone $15 + Copilot solo en los 250 actuales es la opción rentable. El umbral para revisar es la adopción Copilot, no el número absoluto de agentes.

### Escenario C — Gran empresa con Copilot consolidado

- **Recomendación:** migrar a E7 corporativo.
- **Línea 1:** E7 incluye Agent 365. Coste: 6.000 × $99 = $594.000/mes (sustituye E5+Copilot+Agent 365 separados).
- **Línea 2:** 25.000 mensajes × 3 créditos / 25.000 = 3 packs × $200 = $600/mes.
- **Línea 3:** 120M tokens × precio mixto GPT-4o ($5 input + $15 output, ratio 3:1) ≈ $900/mes.
- **Total mensual del bundle E7 + consumo:** ~$595.500/mes.
- **Comparativa:** E5+Copilot+Agent 365 separados = 6.000 × ($57 + $30) + 4.500 × $15 = $522.000 + $67.500 = $589.500/mes. E7 está $6.000/mes por encima pero aporta Risks column, simplifica administración y absorbe el crecimiento Copilot esperado.
- **Justificación:** con Copilot al 75 % creciendo al 3 % mensual, en 6 meses se llega al 90+%. E7 es break-even ahora y será más barato en pocos meses. Adicionalmente, los 50 agentes con volumen significativo justifican Risks column.

### Escenario D — Sector regulado con autonomous obligatorio

- **Recomendación:** E7 corporativo (200 × $99 = $19.800/mes) + entrada en Frontier preview para los 8 agentes autonomous.
- **Línea 1:** E7 incluye Agent 365 para los 200 usuarios.
- **Línea 2:** 12 DA × volumen estimado, marginal (~$200-400/mes).
- **Línea 3:** $0 (no hay Foundry en este escenario).
- **Autonomous:** vía Frontier preview, gratuito hasta 25 instancias. Los 8 agentes autonomous caben dentro del cupo.
- **Justificación:** sector regulado con auditoría externa que exige Risks column hace E7 obligatorio independientemente del cálculo de break-even. Los autonomous no pueden cubrirse con licenciamiento GA: la única vía es Frontier preview, que el cliente debe solicitar formalmente. La aceptación no es automática y debe solicitarse al inicio del proyecto, no al final.

</details>

---

## Errores frecuentes

| Error | Por qué pasa | Cómo evitarlo |
|---|---|---|
| Sumar el coste de E5 a Agent 365 cuando ya está pagado | Confundir «coste total» con «coste nuevo añadido» | Calcular siempre el delta sobre la base actual del cliente. |
| Recomendar E7 a toda la plantilla por «simplicidad administrativa» | Ignorar que E7 incluye Copilot a $30/usuario | E7 solo gana cuando la adopción Copilot supera ~60-70 %. |
| Olvidar la línea de Foundry en agentes con LLM externo | Confundir Foundry con Copilot Studio | Foundry siempre es per-token, no usa créditos Copilot. |
| Asumir que autonomous está cubierto por la licencia GA | Marketing de Microsoft a veces enseña capacidades preview sin etiquetar | Frontier preview es la única vía hoy para autonomous a escala. |
| Calcular Copilot Credits sin saber el tipo de mensaje | Asumir 1 mensaje = 1 crédito | Mensajes con tools, MCP o context grandes consumen 3-5 créditos. |

---

## Validación

Si has resuelto los 4 escenarios y tu justificación cita explícitamente las reglas del módulo (break-even, cobertura, compliance, modelos de consumo), estás preparado para el M04. Si dudas, revisa § 3.4 (modelos de consumo) y § 3.6 (decisión standalone vs E7) antes de avanzar.
