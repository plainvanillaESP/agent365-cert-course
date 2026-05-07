# Módulo 04 — Roles administrativos y delegación

**Duración total:** 45 min · **Fase de producción:** 3 · **Estado:** producido

## Resumen

Catálogo completo de roles administrativos del ecosistema Microsoft Agent 365 (AI Administrator, AI Reader, Agent ID Administrator, Agent ID Developer, Global Administrator, Global Reader, Cloud Application Administrator, Conditional Access Administrator, Security Administrator/Operator/Reader, Lifecycle Workflows Administrator, Billing Administrator, Compliance Administrator, IRM roles). Principio de least-privilege aplicado al ecosistema. Diseño de delegación entre los cuatro admin centers. Caso práctico Plain Coffee SL con matriz de roles ↔ persona.

## Estructura

- `teoria.md` — 5 secciones: catálogo de roles agrupados por área funcional, principio de least-privilege con tabla de aplicación, delegación entre admin centers (M365 vs Entra vs Defender vs Purview), diseño de delegación con caso Plain Coffee SL, resumen.
- `laboratorios.md` — Lab 04.1 «Asignar roles least-privilege a un equipo de seguridad»: tres variaciones del caso Plain Coffee (Marta de baja, adquisición regulada, mini-escenarios de least-privilege). Requiere tenant con Entra ID P1 para PIM, o ejecutable en papel.
- `evaluacion.md` — 1 pregunta oficial EX-04-001 (multiple-choice sobre least-privilege para analista de seguridad) + caso de estudio extenso de Plain Coffee con 5 preguntas guiadas (incorporación de Pablo García, Carmen Sanz, PIM, auditor externo, antipatrones).
- `recursos.md` — documentación oficial Microsoft Learn de roles, PIM, Access Reviews, y guías de buenas prácticas (Zero Trust, CIS, NIST).
- `assets/` — 3 SVGs nativos:
  - `01-catalogo-roles.svg` — los roles agrupados en 5 categorías (gobernanza, identidad, seguridad, datos/compliance, operaciones, globales).
  - `02-delegacion-admin-centers.svg` — qué admin center asigna qué tipo de rol con recomendación operativa.
  - `03-matriz-plain-coffee.svg` — matriz Persona ↔ Roles del caso Plain Coffee SL.

## Reparto a la evaluación final

1 pregunta del Área 1 (Plan and configure Microsoft Agent 365):

- **EX-04-001** — escenario sobre rol mínimo para analista de seguridad. Bloom: Aplicar.

## Decisiones de diseño

- **Capturas reales pospuestas a iteración 2.** El módulo se publica con SVGs conceptuales que cubren los puntos clave. Las capturas anotadas del Microsoft Entra admin center se documentan en `docs/capturas-pendientes.md` para sustituir los SVGs cuando estén disponibles desde un tenant productivo de Plain Vanilla.
- **Lab 04.1 ejecutable sin tenant.** Aunque idealmente se ejecuta con un tenant Entra ID P1 + Agent 365, el lab funciona como ejercicio de papel: la lógica de las decisiones es la misma. Esto evita que el lab sea inaccesible para alumnos que no tengan tenant.
- **Caso Plain Coffee reutilizado.** Mismo caso ficticio que aparece en la teoría para que el alumno trabaje variaciones (no copia de la matriz). Separa el aprendizaje conceptual (teoría) de la aplicación (lab).

## Anti-IA

Sin frases marketing-IA. Sin OAs/Bloom en el cuerpo (solo en frontmatter). Sin ASCII art. Tablas con catálogos extensos en lugar de bullets cuando hay datos comparativos. Tres ideas-faro al final que el alumno debe poder repetir sin notas.

## Capturas pendientes

Ver `docs/capturas-pendientes.md` sección «Módulo 04» para la lista detallada de capturas necesarias para la iteración 2.
