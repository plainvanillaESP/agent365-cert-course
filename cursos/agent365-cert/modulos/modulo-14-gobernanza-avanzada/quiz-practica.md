---
modulo: 14
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 14"
duracion_min: 12
umbral_aprobado_pct: 70
intentos_max: null
ultima_actualizacion: 2026-05-11
preguntas:
  - Q-14-1
  - Q-14-2
  - Q-14-3
  - Q-14-4
  - Q-14-5
caso_estudio: "Iberdrola-Avangrid"
---

# Módulo 14 — Quiz de práctica

> Cinco preguntas para validar tu comprensión de gobernanza avanzada y multi-tenant aplicada a Agent 365: topologías, delegated administration cross-tenant, políticas distribuidas, federation models, operación del ciclo de gobernanza. Intentos ilimitados, aprobado a partir del 70 % (4 de 5 correctas).

---

::: pregunta
id: Q-14-1
oa: OA-14.1
tipo: drag-and-drop
dificultad: facil
bloom: Recordar
enunciado: |
  Empareja cada **topología multi-tenant** con su caso típico canónico.
items:
  - id: t1
    texto: "Parent / subsidiary"
  - id: t2
    texto: "M&A en curso"
  - id: t3
    texto: "MSP / MSSP"
  - id: t4
    texto: "Joint venture"
targets:
  - id: c1
    label: "Grupo bancario multi-país europeo con filiales en España + Portugal + Reino Unido + Suiza"
  - id: c2
    label: "Adquisición en cerrar 12-18 meses; cada tenant mantiene operación pre-integración"
  - id: c3
    label: "Consultora con 50 clientes en su cartera; SOC externo gestiona 30 organizaciones"
  - id: c4
    label: "Empresa conjunta de dos grandes corporaciones; empleados con cuentas en su matriz y en el JV"
correct_map:
  t1: c1
  t2: c2
  t3: c3
  t4: c4
justificacion: |
  Las cuatro topologías cubren los escenarios canónicos de multi-tenant en Agent 365. Parent/subsidiary es el caso de grupos corporativos estables multi-país; M&A captura las transiciones temporales 12-18 meses; MSP/MSSP es el patrón de gestión externa con N clientes; Joint venture introduce la complejidad de empleados con doble pertenencia. Cada topología tiene patrones de gobernanza distintos y tratar el multi-tenant como «un tenant grande» es el error operacional recurrente que el módulo previene.
:::

::: pregunta
id: Q-14-2
oa: OA-14.2
tipo: multiple-response
dificultad: media
bloom: Aplicar
enunciado: |
  Sobre delegated administration cross-tenant para Agent 365, ¿cuáles de las siguientes afirmaciones son correctas? Selecciona todas las que apliquen.
opciones:
  - id: a
    texto: "**GDAP** (Granular Delegated Admin Privileges) sustituye al anterior modelo DAP. Aporta scope limitado por rol, duración limitada típicamente 180-365 días, audit completo en el tenant del cliente y customer consent explícito."
    correcta: true
  - id: b
    texto: "**Microsoft Entra B2B** permite invitar usuarios externos a un tenant con permisos como si fueran empleados sin necesidad de crearles cuenta local."
    correcta: true
  - id: c
    texto: "**Customer Lockbox** activado en el tenant del cliente requiere aprobación explícita por cada acceso de MSP o de Microsoft a contenido empresarial (no solo a configuración)."
    correcta: true
  - id: d
    texto: "El patrón recomendado para gobernanza cross-tenant en grupos corporativos es dar **Global Administrator** del tenant matriz a usuarios de subsidiarias para máxima flexibilidad."
  - id: e
    texto: "El **patrón de doble pertenencia controlada** combina cuenta primaria local + invitación B2B a matriz con roles específicos + GDAP si la matriz funciona como MSP interno + Customer Lockbox + audit log unificado vía Microsoft Graph Security API."
    correcta: true
  - id: f
    texto: "El audit log de las acciones del MSP queda registrado en el tenant del MSP, no del cliente, para mayor privacidad del MSP."
justificacion: |
  Las opciones A, B, C y E son correctas y describen el patrón canónico recomendado para gobernanza cross-tenant. La D es operacionalmente peligrosa: dar Global Administrator del tenant matriz a usuarios externos viola el principio de least privilege, expone la matriz a riesgo cross-tenant innecesario y dificulta el cumplimiento regulatorio. La F invierte la realidad: el audit log de acciones GDAP queda registrado en el tenant del cliente precisamente para que el cliente pueda auditar al MSP — es una protección al cliente, no al MSP.
:::

::: pregunta
id: Q-14-3
oa: OA-14.3
tipo: scenario
dificultad: dificil
bloom: Crear
enunciado: |
  Una organización con tenants en Alemania, Estados Unidos y Brasil debe definir su policy framework distribuido. El comité corporativo discute si aplicar la política más estricta (GDPR alemán) a los tres tenants para máxima consistencia. ¿Cuál es la respuesta técnicamente correcta?
opciones:
  - id: a
    texto: "Sí, aplicar GDPR a los tres tenants es la mejor opción: máxima consistencia + supera todos los mínimos regulatorios."
  - id: b
    texto: "No. Aplicar uniformemente la regulación más estricta a veces **obliga a operaciones que serían ilegales en jurisdicciones menos restrictivas**: por ejemplo, recolección masiva de datos para auditoría que GDPR permite pero LGPD prohibirá en ciertos contextos. El patrón canónico es **policy framework distribuido** con comité central definiendo principios mínimos no negociables + comités locales adaptando con particularidades regulatorias y culturales de cada jurisdicción."
    correcta: true
  - id: c
    texto: "No, cada tenant debería actuar independientemente sin coordinación corporativa para evitar conflictos."
  - id: d
    texto: "Sí, pero solo en sectores regulados; en sectores no regulados cada tenant decide."
justificacion: |
  La opción B captura la respuesta técnicamente correcta y operacionalmente madura. El antipatrón «uniformidad rígida» tiene dos problemas: (1) puede crear conflictos con regulación local que es distinta (no necesariamente menos estricta — distinta), (2) ignora la realidad cultural y operativa de cada jurisdicción. El antipatrón «fragmentación total» (opción C) pierde coherencia corporativa y dificulta el reporting agregado. La D es operacionalmente errónea: la coordinación corporativa también es relevante en sectores no regulados (reputación, eficiencia, KPIs comparables). El framework distribuido alinea en tres ejes (ético, operacional, tecnológico) con principios centrales + adaptación local.
:::

::: pregunta
id: Q-14-4
oa: OA-14.4
tipo: multiple-choice
dificultad: media
bloom: Analizar
enunciado: |
  Un grupo industrial europeo con presencia en 4 países decide su federation model para Agent 365. La matriz quiere coherencia operativa y KPIs agregables. Las subsidiarias defienden su autonomía para responder a particularidades locales. ¿Cuál es el federation model más adecuado y por qué?
opciones:
  - id: a
    texto: "**Centralizado**: la matriz toma todas las decisiones operativas, las subsidiarias aplican casi al pie de la letra. Es la única forma de garantizar coherencia."
  - id: b
    texto: "**Federado**: cada subsidiaria mantiene autonomía completa, la matriz solo vela por consistencia mínima. Es la única forma de respetar particularidades locales."
  - id: c
    texto: "**Hub-and-spoke**: la matriz (hub) define principios mínimos + infraestructura central; las subsidiarias (spokes) operan con autonomía pero dentro del framework heredado. Equilibra coherencia y adaptación local; es el modelo más común en organizaciones modernas y converge naturalmente tras 1-2 ciclos de revisión."
    correcta: true
  - id: d
    texto: "Mixto sin estructura formal: cada tema se decide caso a caso."
justificacion: |
  La opción C es la respuesta canónica documentada en el módulo. Centralizado (A) sacrifica la adaptación local y genera fricción con compliance regional; Federado (B) sacrifica coherencia y KPIs comparables; el modelo «sin estructura formal» (D) introduce costes de coordinación impredecibles y se convierte en una versión disfuncional de los anteriores. Hub-and-spoke es el modelo que la mayoría de organizaciones modernas convergen tras 1-2 ciclos de revisión: la matriz provee el framework y la infraestructura central (Defender XDR, CCS, Purview templates), las subsidiarias adaptan dentro de ese framework. Coherencia + adaptación + KPIs agregables.
:::

::: pregunta
id: Q-14-5
oa: OA-14.5
tipo: ordering
dificultad: media
bloom: Aplicar
enunciado: |
  Ordena los pasos correctos para **preparar una auditoría externa anual multi-tenant** desde el momento en que el auditor anuncia su llegada hasta el cierre del proceso.
items:
  - id: o1
    texto: "Recibir notificación oficial del auditor con fecha de inicio + tenants a auditar + scope esperado"
  - id: o2
    texto: "Configurar B2B con scope limitado para el auditor en cada tenant relevante con duración exacta del periodo de auditoría"
  - id: o3
    texto: "Activar Customer Lockbox aprobado preventivamente para los tipos de evidencia esperados (audit logs, blueprints, outputs)"
  - id: o4
    texto: "Recopilar evidencia agregada del comité central + evidencias específicas de comités locales según scope"
  - id: o5
    texto: "Reconciliar datos del comité central con datos en bruto de los tenants y resolver discrepancias antes de la entrega"
  - id: o6
    texto: "Entregar evidencia y atender preguntas del auditor con coordinación entre matriz y subsidiarias"
  - id: o7
    texto: "Cerrar acceso B2B del auditor, archivar evidencia entregada y producir lecciones aprendidas para el próximo ciclo"
correct_order:
  - o1
  - o2
  - o3
  - o4
  - o5
  - o6
  - o7
justificacion: |
  El orden refleja las dependencias operativas reales de una auditoría multi-tenant. Configurar B2B y Customer Lockbox antes (O2, O3) reduce fricción durante la auditoría. Recopilar y reconciliar la evidencia antes de la entrega (O4, O5) evita la situación más temida del auditor: encontrar discrepancias entre vista central y vista local en plena auditoría, que genera follow-ups, suspicacia y reporting negativo. Cerrar acceso del auditor al final (O7) es disciplina de seguridad básica. El ciclo completo típicamente requiere 4-6 semanas, lo que justifica tener el calendario de auditorías incorporado al ciclo de gobernanza desde el inicio del año.
:::

---

## Caso de estudio (refuerzo, no evaluable)

> Tras responder el quiz, intenta este ejercicio antes de pasar a M15.

**Escenario.** **Iberdrola-Avangrid** (grupo energético global con 40.000 empleados, operación en España + Reino Unido + Estados Unidos + Brasil + México). Topología: 4 tenants principales por país regulatoriamente independientes + 1 tenant corporativo en España. Acaba de desplegarse Agent 365 en los 5 tenants. El Director Global de IA te pide diseñar el **modelo operativo cross-tenant** para los próximos 12 meses.

**Tareas.**

1. Identifica la **topología canónica predominante** y justifica la elección.
2. Diseña el **federation model óptimo** y razona por qué.
3. Define los **3 elementos del framework global** (principios + KPIs + vocabulario) que aplicarán en los 5 tenants.
4. Define el **calendario de auditorías** para los 12 meses con responsables y plazos de preparación.
5. Diseña el **dashboard agregado** mensual que el comité central reporta al Consejo, con 3 vistas: por subsidiaria, por jurisdicción y corporativa agregada.

<details>
<summary>Ver solución sugerida</summary>

**1. Topología canónica predominante.** Parent/subsidiary clásico: el tenant corporativo en España es la matriz, los 4 tenants por país son subsidiarias. Cada uno mantiene operación independiente por motivos regulatorios (FERC en US, Ofgem en UK, CNMC en España, ANEEL en Brasil, CRE en México). La topología es estable, no en transición M&A, no MSP/MSSP, no JV.

**2. Federation model óptimo: hub-and-spoke.** Razones:

- 5 jurisdicciones regulatorias distintas → modelo centralizado inviable.
- Necesidad de KPIs agregables al Consejo de Administración corporativo → modelo federado puro insuficiente.
- Cultura corporativa con autonomía operacional pero coherencia estratégica → hub-and-spoke encaja.
- La matriz provee infraestructura central (CCS, Defender XDR, Purview templates, SOC centralizado con dotación complementaria local).
- Las subsidiarias operan con autonomía dentro del framework heredado y con adaptación a su regulación local.

**3. Tres elementos del framework global.**

**Principios mínimos no negociables (aplicables a los 5 tenants)**:

- P1: Toda invocación con datos de empleados o clientes requiere base legal documentada y auditable.
- P2: Outputs con datos personales reciben sensitivity label automática.
- P3: Customer Lockbox activado en los 5 tenants con aprobadores designados.
- P4: Custom detection rules de Defender XDR para los 3 patrones canónicos (volumen, exfiltración, compromiso identidad) operativas en los 5 tenants.
- P5: Telemetría agregada al comité central con anonimización irreversible por defecto.
- P6: Plan de retirada de agente operativo en cada tenant para situaciones de crisis (incident grave, requerimiento regulatorio, decisión estratégica).

**KPIs canónicos (idénticos en los 5 tenants)**:

| KPI | Target | Fuente |
|---|---|---|
| DAU/MAU por tenant | > 60 % en M12 | CCS Telemetry |
| Compliance rate por tenant | > 97 % | CCS Agent governance |
| Incidents Critical/High al mes | < 5 por 10K usuarios | Defender XDR |
| MTTD del SOC central | < 30 min | Sentinel workbook |
| MTTR del SOC central | < 4 h | Sentinel workbook |
| Audit log completitud por tenant | > 99.9 % | Reconciliación CCS vs CloudAppEvents |
| Tickets de aprobación atrasados > 72h | 0 | CCS Agent governance |

**Vocabulario común**: definiciones idénticas de incident, alert, invocation, sensitive output, custom rule, compliance rate. Glosario único distribuido a los 5 comités locales y obligatorio en toda comunicación corporativa.

**4. Calendario de auditorías (12 meses).**

| Mes | Auditoría | Tenants | Responsable preparación |
|---|---|---|---|
| Marzo | ISO 27001 corporativa | Los 5 | Compliance corporativo |
| Mayo | FERC US (sector energético) | US | Compliance US + soporte SOC central |
| Julio | ANEEL Brasil (eléctrica) | Brasil | Compliance Brasil + soporte SOC central |
| Septiembre | Ofgem UK (energía) | UK | Compliance UK + soporte SOC central |
| Octubre | CNMC España | España + corporativo | Compliance España |
| Noviembre | Auditoría externa anual independiente | Los 5 | Compliance corporativo |
| Diciembre | Cierre + lecciones aprendidas + plan año siguiente | N/A | Comité central |

Cada auditoría con 6 semanas de preparación, dado el volumen y la criticidad regulatoria del sector energético.

**5. Dashboard agregado mensual al Consejo.**

```
┌─────────────────────────────────────────────────────────────┐
│   Iberdrola-Avangrid — Agent 365 Mensual — <mes>           │
├─────────────────────────────────────────────────────────────┤
│ VISTA 1: POR SUBSIDIARIA                                    │
│   España        DAU 7.2K (▲)  Compl 98%  Inc 2 (todos cerr) │
│   UK            DAU 6.1K (▲)  Compl 97%  Inc 3 (todos cerr) │
│   US            DAU 11.3K (▲) Compl 99%  Inc 4 (3 cerr,1 act)│
│   Brasil        DAU 5.4K (━)  Compl 96%  Inc 1 (cerr)       │
│   México        DAU 3.8K (▼)  Compl 95%  Inc 2 (cerr)       │
├─────────────────────────────────────────────────────────────┤
│ VISTA 2: POR JURISDICCIÓN                                   │
│   UE (España + UK)             DAU 13.3K  Compl 97%        │
│   US (US)                       DAU 11.3K  Compl 99%        │
│   LATAM (Brasil + México)       DAU 9.2K   Compl 95.5%      │
├─────────────────────────────────────────────────────────────┤
│ VISTA 3: CORPORATIVA AGREGADA                               │
│   DAU total global              33.8K (▲6% vs mes anterior) │
│   Compliance global             97.4%                       │
│   Incidents Critical/High       12 (10 cerrados, 2 abiertos)│
│   MTTD SOC central              24 min                      │
│   MTTR SOC central              3.2 h                       │
│                                                              │
│   Top 3 incidents del mes con post-mortem firmado           │
│   Próximas auditorías: ANEEL Brasil (mes próximo)           │
│   Lecciones aprendidas y mejoras propuestas                 │
└─────────────────────────────────────────────────────────────┘
```

El dashboard se distribuye al Consejo 48h antes de la reunión mensual del comité central. Se valida con el SOC central (Defender XDR), el comité de Compliance corporativo (Purview), y los comités locales antes de la entrega.

</details>
