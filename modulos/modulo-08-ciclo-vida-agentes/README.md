# Módulo 08 — Despliegue, distribución y ciclo de vida

**Duración total:** 90 min · **Fase de producción:** 4 · **Estado:** producido

## Resumen

Las 11 acciones de gobernanza disponibles desde Microsoft 365 admin center y cómo combinarlas en un ciclo de vida real: Publish → Activate → Deploy → Pin → Block/Unblock → Remove → Delete (irreversible tras 24 h). Approve Updates. Manage Ownerless. Reassign Ownership (con la limitación a Agent Builder). Wizard de publishing de 7 pasos con plantillas Default y Custom. Casos típicos: agente que se publica con permisos restringidos, agente que se pinea a un grupo específico, agente que se elimina con propagación de 24 h y borrado del SharePoint Embedded container.

## Estructura

- `teoria.md` — 8 secciones (8.1 a 8.8) cubriendo las 11 acciones agrupadas en 4 bloques (Aprobación, Distribución, Retirada, Governance avanzado), wizard de publishing detallado paso a paso, plantillas Default vs Custom con ejemplos YAML, pinning con sus 3 slots y la propagación de 6 h, Remove vs Delete con timeline de 24 h, Manage Ownerless y Reassign Ownership con la limitación a Agent Builder, diseño del ciclo de vida 90 días para una organización, resumen con cross-references.
- `laboratorios.md` — 3 labs:
  - **Lab 08.1** «Publish + Deploy con plantilla Custom» (30 min, intermedio): crear Custom Template, recorrer wizard de 7 pasos, deployar a grupo piloto y validar pre-instalación.
  - **Lab 08.2** «Pin, Block, Unblock secuencial» (20 min, básico): ejercitar las 3 acciones con verificación cliente y cronometraje de propagación.
  - **Lab 08.3** «Reassign ownership tras hard delete del owner» (25 min, avanzado): simular el caso real de un empleado que sale, verificar Reassign en Agent Builder y la limitación con Copilot Studio.
- `evaluacion.md` — 5 preguntas oficiales (EX-08-001 a EX-08-005): drag-and-drop con secuencia del ciclo de vida, mc Remove vs Delete, mc limitación de Reassign a Agent Builder, scenario diseño de Custom Template para Compliance, mc comportamiento de Pin. + Caso de estudio extenso de Plain Coffee SL con rollout, retirement, crisis del owner que se va y diseño de plantillas tenant.
- `recursos.md` — 6 categorías de docs Microsoft Learn (acciones, plantillas, wizard, ownerless+Reassign, ciclo de vida + SharePoint Embedded, PowerShell + automatización) y cross-references a M09, M10, M11, M12.
- `assets/` — 3 SVGs nativos:
  - `01-acciones-gobernanza.svg` — las 11 acciones en una matriz de 4 bloques con tags de reversibilidad y la advertencia de Delete.
  - `02-publishing-wizard.svg` — los 7 pasos secuenciales con marcadores de obligatorio/opcional y panel inferior de errores frecuentes.
  - `03-remove-vs-delete.svg` — comparación side-by-side con timeline horizontal de la propagación de 24 h en el lado Delete.

## Reparto a la evaluación final

5 preguntas del Área 3 (Registry y ciclo de vida — 15 % del examen):

- **EX-08-001** drag-and-drop media — secuenciar acciones del ciclo de vida (Publish → Activate → Deploy → Pin → Remove → Delete). Bloom: Aplicar.
- **EX-08-002** mc media — Remove vs Delete con ventana de 24 h. Bloom: Recordar.
- **EX-08-003** mc media — Reassign Ownership solo para Agent Builder. Bloom: Recordar.
- **EX-08-004** scenario difícil — aplicar Custom Template para restricciones de Compliance. Bloom: Aplicar.
- **EX-08-005** mc media — comportamiento de Pin (3 slots, 6 h propagación, deployed required). Bloom: Recordar.

## Decisiones de diseño

- **Reassign sin disponer de un tipo `multiple-response`.** El plan original del M08 incluía una pregunta multiple-response sobre efectos de Pin. Como el shell no soporta ese tipo de pregunta, se reformuló como mc con afirmación compuesta (EX-08-005). Documentado en commit message como decisión de scope.
- **Caso de estudio coherente con M07.** Plain Coffee SL retoma `Tienda-Ops-Iberia` del lab piloto y le hace rollout. Plasma cómo el M07 (operación) se conecta con M08 (acción) en una historia continua.
- **Capturas pendientes documentadas.** El módulo es muy operativo (acciones reales en la UI). 7 capturas pendientes en `docs/capturas-pendientes.md` para iteración 2.
- **Lab 08.3 con cuenta de prueba destructiva.** Se documenta explícitamente el carácter destructivo del lab (crear y borrar usuario) para evitar usar cuentas reales por error.

## Anti-IA

Sin frases marketing-IA. Sin OAs/Bloom en el cuerpo (solo en frontmatter). Sin ASCII art. Tablas con efectos y reversibilidad explicados. Comandos PowerShell verificables. Tres ideas-faro al final que el alumno debe poder repetir sin notas.

## Capturas pendientes

Ver `docs/capturas-pendientes.md` sección «Módulo 08» para la lista detallada de capturas necesarias para la iteración 2.
