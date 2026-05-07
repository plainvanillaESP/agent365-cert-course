# Módulo 06 — Microsoft Entra Agent ID e identidades de agentes

**Duración total:** 105 min · **Fase de producción:** 4 · **Estado:** producido

## Resumen

El módulo más denso del curso. Aporta **11 preguntas** al examen final (Área 2 = 30 % del peso). Introduce los **cuatro tipos de objetos** nuevos de Microsoft Entra Agent ID (agent identity blueprint, blueprint principal, agent identity, agent user), los **dos flujos de autenticación** (OBO delegado y own identity autonomous), las capacidades de gobernanza (sponsorship con transferencia automática al manager, lifecycle workflows con triggers `onLeaver`/`onMover`/`onSponsorJoiner`/`onAgentInactivity`, access packages, inheritable permissions con límite 10×40, custom security attributes, multi-select disable). **Convergencia M365 admin center ↔ Entra admin center** del 1 de mayo de 2026, retiro de páginas legacy, ventana de retrocompatibilidad de 90 días para APIs `/beta/agentRegistry/*` migradas a `/beta/copilot/admin/*`. APIs Graph clave (`riskyAgents`, `agentRiskDetections`, `signInEventTypes`).

## Estructura

- `teoria.md` — 9 secciones (6.1 a 6.9) cubriendo los cuatro tipos de objetos con analogía OOP, flujos OBO vs own identity con tablas comparativas y ejemplos de tokens, anatomía completa del blueprint con 5 secciones (metadata, inheritable permissions con límite duro 10×40, restricciones, sponsorship por defecto, audit), sponsorship y lifecycle workflows con triggers, access packages por tres vías (security groups / OAuth API permissions / Entra roles), custom security attributes para segmentación, convergencia mayo 2026 con migración de APIs y sunset noviembre 2026, APIs Graph para identidades, resumen con cross-references a M07/M08/M09/M12.
- `laboratorios.md` — 3 labs secuenciales con CLI `@microsoft/agent365-cli`:
  - **Lab 06.1** «Crear un blueprint con `a365 setup`» (30 min, intermedio): instalación CLI, autenticación, wizard de blueprint, edición de JSON con permisos heredables (User.Read.All, Group.Read.All, TeamsActivity.Send), creación y verificación.
  - **Lab 06.2** «Crear y disponer una agent identity desde el blueprint» (30 min, intermedio): instanciación de identity, verificación, filtros con Microsoft Graph (`?$filter=agentBlueprintId eq '...'`), disable/re-enable.
  - **Lab 06.3** «Configurar sponsorship con transferencia automática al manager» (30 min, avanzado): asignar sponsor, configurar lifecycle workflow `onLeaver` con tasks `notifyManager,transferAgentSponsorship,markRequireReview`, simular leaver, verificar transferencia automática y `requireReview = true`.
- `evaluacion.md` — 11 preguntas oficiales (EX-06-001 a EX-06-011) cubriendo la totalidad de los OAs: tipo de objeto, OBO/autonomous, blueprint scopes, sponsor leaver, Graph riskyAgents, restricciones blueprint, capacidades incluidas, convergencia APIs, custom security attributes, blueprint design para escenario complejo, lifecycle trigger.
- `recursos.md` — 7 categorías de docs Microsoft Learn (Entra Agent ID, flujos auth, sponsorship+lifecycle, permisos+attributes, Graph APIs, convergencia mayo 2026, CLI a365) y cross-references a M07, M08, M09, M12.
- `assets/` — 5 SVGs nativos:
  - `01-cuatro-tipos-objetos.svg` — los 4 tipos de objetos en diagrama relacional con OOP analogy footer (blueprint=clase, principal=singleton, identity=instancia, user=propiedad opcional).
  - `02-flujos-autenticacion.svg` — split OBO vs own identity con 4 pasos numerados cada uno e implicaciones.
  - `03-anatomia-blueprint.svg` — un blueprint completo con sus 5 secciones y JSON real.
  - `04-sponsorship-lifecycle.svg` — los 3 estados (sponsor activo / leaver event / transferido) con flecha de automatización.
  - `05-convergencia-mayo-2026.svg` — timeline antes/durante/después de la convergencia con APIs migradas.

## Reparto a la evaluación final

11 preguntas del Área 2 (Identidades de agentes con Entra Agent ID — 30 % del examen):

- **EX-06-001** mc media — el tipo objeto plantilla es blueprint (Bloom: Recordar).
- **EX-06-002** mc media — relación blueprint principal y agent user (Bloom: Analizar).
- **EX-06-003** dnd media — emparejar capacidad ↔ tipo de objeto (Bloom: Analizar).
- **EX-06-004** scenario media — monitor 24/7 buzón compartido = own identity Frontier preview (Bloom: Aplicar).
- **EX-06-005** mc difícil — Graph call `/beta/identityProtection/riskyAgents` (Bloom: Analizar).
- **EX-06-006** mc difícil — troubleshooting blueprint con 47 scopes supera el límite 40 (Bloom: Aplicar).
- **EX-06-007** scenario difícil — diseño blueprint para 12 agentes retail OBO (Bloom: Crear).
- **EX-06-008** mc media — capacidades correctas del blueprint (Bloom: Recordar).
- **EX-06-009** mc media — comportamiento sponsorship con `transferOnLeaver: true` (Bloom: Aplicar).
- **EX-06-010** mc media — trigger `onLeaver` se dispara con `accountEnabled = false` (Bloom: Recordar).
- **EX-06-011** mc difícil — APIs `/beta/agentRegistry/*` migrar antes del 1 agosto a `/beta/copilot/admin/*` (Bloom: Recordar).

## Decisiones de diseño

- **Lab CLI con `a365`.** El módulo es muy operativo. La CLI oficial Microsoft Agent 365 da una superficie de comandos limpia para los labs. Si la organización del alumno prefiere PowerShell o Graph SDK, los pasos son trasladables.
- **Capturas reales pospuestas.** El módulo cubre Entra admin center extensivamente; las capturas se documentan en `docs/capturas-pendientes.md` para sustituir SVGs en iteración 2.
- **Caso reutilizado de Plain Coffee SL.** El blueprint `RRHH agents — read employee data`, la agent identity `Agent-RRHH-FAQ` y el sponsor Luis Ortega son consistentes con los módulos M04 y M05. El alumno puede seguir mentalmente el caso a lo largo de los 3 módulos.

## Anti-IA

Sin frases marketing-IA. Sin OAs/Bloom en el cuerpo (solo en frontmatter). Sin ASCII art. Tablas con datos comparativos (OBO vs autonomous, capacidades por tipo de objeto, APIs antiguas vs nuevas). Tres ideas-faro al final que el alumno debe poder repetir sin notas. Comandos CLI verificables, no inventados.

## Capturas pendientes

Ver `docs/capturas-pendientes.md` sección «Módulo 06» para la lista detallada de capturas necesarias para la iteración 2.
