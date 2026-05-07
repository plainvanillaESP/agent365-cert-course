# Módulo 09 — Permisos, accesos y Conditional Access

**Duración total:** 75 min · **Fase de producción:** 4 · **Estado:** producido

## Resumen

Cierra la Fase 4 (administración de identidades de agentes) con la capa de control de acceso. Tres bloques: **Application vs Delegated Permissions** con admin consent y common permissions más usados; **Conditional Access para agentes** [GA] con sus cuatro componentes (scope `All agent identities`, target `All resources`, conditions `Agent risk`, grants `Block` o `Require compliant device`) y la diferencia de enforcement entre OBO y own identity; e **Identity Protection para agentes** [Frontier preview, P2] con las 6 detecciones offline, el Risky Agents report (90 días) y las 4 acciones del admin (`Confirm compromise`, `Confirm safe`, `Dismiss`, `Disable`) con sus efectos cascada sobre Conditional Access. Report-only mode como gate de seguridad obligatorio antes de enforcement.

## Estructura

- `teoria.md` — 7 secciones (9.1 a 9.7) cubriendo Application vs Delegated con tabla de common permissions y antipatrón de Application amplias, admin consent (cuándo se requiere, los tres caminos para otorgarlo, casos de pending), Conditional Access con anatomía de policy, tres casos típicos en YAML y la distinción de enforcement OBO vs own identity, Report-only mode con patrón de promoción 0→7→14 días, Identity Protection con las 6 detecciones offline detalladas, las 4 acciones sobre Risky Agents con tabla de decisión, resumen con tres ideas-faro y cross-references.
- `laboratorios.md` — 2 labs:
  - **Lab 09.1** «Crear CA policy de bloqueo por high agent risk en Report-only» (30 min, avanzado): verificar prerrequisitos P2, crear la policy con los cuatro componentes, generar tráfico y validar que la policy se evalúa sin enforcement en `Workload identity sign-ins`.
  - **Lab 09.2** «Confirm compromise sobre un agente y observar enforcement» (20 min, avanzado): pasar la policy del 09.1 a `On`, ejecutar `Confirm compromise` sobre la identidad del Lab 06.2, observar el bloqueo del siguiente sign-in y revertir con `Confirm safe`.
- `evaluacion.md` — 7 preguntas oficiales (EX-09-001 a EX-09-007): mc Application en agente sin invocador, mc intersección de permisos en OBO, scenario diseño de CA policy combinando filtro CSA y Report-only, mc enforcement OBO vs own identity, mc Confirm compromise como reacción a incidente, drag-and-drop secuencia de despliegue de policy, mc Identity Protection (preview, P2, offline, 90 días). + Caso de estudio extenso de Plain Coffee SL con dos policies para los agentes financieros, plan de cutover sin romper cierre mensual y reacción al compromiso de `BotPedidos-Externos`.
- `recursos.md` — 6 categorías de docs Microsoft Learn (permisos y admin consent, Conditional Access para agentes, Report-only, Identity Protection, PowerShell y automatización) y cross-references a M10, M12 y M14.
- `assets/` — 4 SVGs nativos:
  - `01-app-vs-delegated.svg` — comparación de los dos tipos de permiso con flujos de token y cálculo del permiso efectivo en OBO como intersección.
  - `02-anatomia-ca-policy.svg` — los 4 componentes (scope, target, conditions, grants) con valores específicos de agente en cada uno.
  - `03-report-only-mode.svg` — diagrama de la evaluación sin enforcement con resultados típicos en Sign-in logs.
  - `04-acciones-risky-agents.svg` — las 4 acciones con su efecto cascada sobre Conditional Access.

## Reparto a la evaluación final

7 preguntas del Área 2 (Identidades de agentes — 30 % del examen):

- **EX-09-001** mc media — Application Permission para agente sin invocador (buzón compartido). Bloom: Analizar.
- **EX-09-002** mc media — Intersección de permisos en flujo OBO (Delegated). Bloom: Analizar.
- **EX-09-003** scenario difícil — Diseño de CA policy con filtro por custom security attribute en Report-only. Bloom: Crear.
- **EX-09-004** mc difícil — Enforcement de CA en OBO vs own identity. Bloom: Analizar.
- **EX-09-005** mc media — Confirm compromise como reacción a credenciales filtradas. Bloom: Evaluar.
- **EX-09-006** drag-and-drop media — Secuencia de despliegue de CA policy con Report-only y cascade. Bloom: Aplicar.
- **EX-09-007** mc difícil — Identity Protection para agentes (Frontier preview, P2, offline, 90 días). Bloom: Recordar.

## Decisiones de diseño

- **Multiple-response convertido a mc compuesto.** El plan original incluía una multiple-response sobre capacidades de Identity Protection. Como el shell no soporta multiple-response (decisión heredada de M08), se reformuló como mc con afirmación compuesta de cuatro propiedades del producto (EX-09-007). Mantiene el área cubierta y la dificultad del item.
- **Continuidad narrativa con M08.** Plain Coffee SL retoma la historia: el M08 dejó la organización con su Registry operativo y el M09 introduce los cuatro agentes financieros etiquetados con `Department: Finance` (M06 § 6.6), un compromiso real (`BotPedidos-Externos`) y un cierre mensual crítico que condiciona el calendario de cutover. Refuerza que cada módulo no es aislado.
- **Labs secuenciales y reversibles.** Lab 09.2 depende del 09.1 y exige una limpieza explícita en la Parte D para no dejar la policy en `On` ni el agente en `High`. Documentado en errores frecuentes y en la sección de limpieza con cmdlets PowerShell.
- **Report-only como gate obligatorio en el examen.** El blueprint pedía dedicar un OA específico (OA-09.4) a Report-only. La preguntas EX-09-003 y EX-09-006 fuerzan al alumno a aplicarlo, no solo a recordarlo. Es la diferencia entre admin con criterio y admin que rompe producción.
- **Capturas pendientes documentadas.** El módulo es muy operativo (Conditional Access, Risky Agents, Sign-in logs). Capturas pendientes a registrar en `docs/capturas-pendientes.md` para iteración 2.

## Anti-IA

Sin frases marketing-IA. Sin OAs/Bloom en el cuerpo (solo en frontmatter). Sin ASCII art. Tablas con efectos y casos explicados. Comandos PowerShell verificables. Tres ideas-faro al final que el alumno debe poder repetir sin notas.

## Capturas pendientes

Ver `docs/capturas-pendientes.md` sección «Módulo 09» para la lista detallada de capturas necesarias para la iteración 2.
