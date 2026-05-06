# Convenciones de redacción

> Reglas de tono, estilo y formato para todo el contenido del curso. Diseñadas para que cualquier persona (o IA) que produzca contenido obtenga un resultado consistente con el resto del curso.

---

## Tono

- **Profesional pero directo.** El alumno es un administrador IT con experiencia. No condescender.
- **Sin paja introductoria.** Ir al concepto.
- **Segunda persona impersonal** ("se configura", "se aplica") en explicaciones; **segunda persona directa** ("abre el admin center") en laboratorios.
- **Honestidad técnica.** Si algo es complicado, decirlo. Si una documentación oficial es ambigua, indicarlo.

### Ejemplos

Mal:
> En este módulo aprenderemos juntos sobre el fascinante mundo de los agentes de IA en Microsoft 365, una tecnología revolucionaria que está cambiando la forma en que las empresas trabajan...

Bien:
> Microsoft Agent 365 es el plano de control con el que un administrador inventa, gobierna y asegura todos los agentes de IA que operan en su tenant. No es una herramienta para *construir* agentes (eso sigue siendo Copilot Studio o Foundry); es la capa que se coloca encima de cualquier agente para hacerlo administrable.

---

## Estructura de cada documento

### `teoria.md`

```markdown
# Módulo XX: [Título]

## Objetivos de aprendizaje

Al finalizar este módulo, el alumno será capaz de:

- [Verbo Bloom + concepto]
- [Verbo Bloom + concepto]
- ...

**Duración estimada:** XX minutos
**Prerrequisitos:** [si aplica]

---

## Conceptos clave

[Glosario corto de 5-10 términos que el alumno encontrará en el módulo]

---

## [Secciones de desarrollo]

[Contenido]

---

## Resumen

[5-10 bullets clave que el alumno debe recordar]

---

## Próximo módulo

[Frase de transición al siguiente módulo]
```

### `laboratorios.md`

```markdown
# Módulo XX — Laboratorios

## Prerrequisitos

- **Tenant:** [tipo de tenant requerido]
- **Licencias:** [licencias requeridas]
- **Roles:** [roles administrativos necesarios]
- **Tiempo total estimado:** XX minutos

---

## Lab XX.1 — [Nombre del laboratorio]

**Objetivo:** [Una frase]
**Duración:** XX min
**Dificultad:** Básico / Intermedio / Avanzado

### Pasos

1. [Paso con instrucciones precisas]
2. ...

### Validación

[Cómo el alumno verifica que el laboratorio se completó correctamente]

### Troubleshooting

| Síntoma | Causa probable | Solución |
|---|---|---|
| ... | ... | ... |
```

### `evaluacion.md`

```markdown
# Módulo XX — Evaluación

## Preguntas de comprobación

### Pregunta 1
[Enunciado]

A) Opción
B) Opción
C) Opción
D) Opción

<details>
<summary>Ver respuesta</summary>

**Respuesta correcta:** X

**Justificación:** [Explicación con referencia a la sección de teoría]

</details>

---

## Caso de estudio

[Escenario realista de 1-2 párrafos]

**Tareas:**
1. ...
2. ...

<details>
<summary>Ver solución sugerida</summary>

[Solución paso a paso]

</details>
```

### `recursos.md`

```markdown
# Módulo XX — Recursos

## Documentación oficial Microsoft Learn

- [Título del artículo](https://learn.microsoft.com/...) — descripción breve

## Blogs oficiales

- [Título](URL) — fecha, descripción

## Lecturas adicionales

- ...
```

---

## Badges de estado

Se usan en cualquier referencia a una capacidad concreta del producto:

| Badge | Significado |
|---|---|
| [GA] | General availability — disponible para producción |
| [Preview] | Preview pública — disponible para todos los tenants pero con caveats |
| [Frontier] | Frontier preview — solo para tenants en el programa preview |
| [Deprecated] | Capacidad retirada o en proceso de retirada |

Ejemplo de uso:
```markdown
La página **Agent Map** [GA] permite visualizar todos los agentes registrados en el tenant, incluidos los que provienen de plataformas externas vía registry sync [Preview].
```

---

## Citas a fuentes

### Inline (preferido para afirmaciones específicas)

```markdown
La activación inicial requiere navegar a Microsoft 365 admin center → **Copilot** → **Settings** y seleccionar **Copilot Frontier** ([Microsoft Learn](https://learn.microsoft.com/...)).
```

### Al final de sección (para fuentes generales)

```markdown
> **Fuentes oficiales utilizadas en esta sección:**
> - [Agent overview in Microsoft 365 admin center](https://learn.microsoft.com/...)
> - [Microsoft Entra Agent ID overview](https://learn.microsoft.com/...)
```

---

## Comandos y bloques de código

### PowerShell

````markdown
```powershell
Get-SPOTenant | Select-Object IsCopilotEnabled, IsAgentsFeatureEnabled
```
````

### Agent 365 CLI

````markdown
```bash
a365 setup all --subscription-id <id>
```
````

### KQL (advanced hunting)

````markdown
```kql
CloudAppEvents
| where ActionType in ("InvokeAgent", "InferenceCall", "ExecuteToolBySDK")
| summarize count() by ActionType, AccountObjectId
```
````

### Microsoft Graph

````markdown
```http
GET https://graph.microsoft.com/beta/copilot/admin/agentInstances
Authorization: Bearer <token>
```
````

---

## Capturas de pantalla y diagramas

- **Capturas:** PNG, máximo 1600px ancho. Nombrarlas `assets/NN-descripcion-corta.png`. Anotaciones con flechas o cajas de color rojo (#D7263D, color brand Plain Vanilla).
- **Diagramas:** SVG cuando sea posible. Si se generan con herramientas externas, exportar también el fuente (drawio, mermaid, etc.).
- **Pie de imagen:** siempre describir la captura debajo en texto, para accesibilidad y para que el alumno entienda el contexto sin verla. El pie va **después** de la imagen, no antes.
- **Nada de ASCII art ni cajas dibujadas con `+`, `-`, `|` o caracteres Unicode de box-drawing.** Si hace falta un diagrama, va en SVG en `assets/`. ASCII art se ve aceptable en GitHub o en un terminal pero queda como "developer doc" en el shell del curso, donde el alumno espera diagramas vectoriales legibles. Aplica también a tablas dibujadas, árboles de directorios y diagramas de flujo: SVG siempre.
- **Capturas de admin centers (M02 en adelante):** cada paso operativo (clicar, configurar, validar) lleva su captura. La captura va **anotada**: rectángulo rojo alrededor del control concreto que el alumno tiene que pulsar, número en círculo si hay varios pasos en la misma pantalla. Sin anotaciones, una captura confunde más que ayuda.

### Cómo se producen las infografías

Las infografías y diagramas conceptuales del curso **no se generan con modelos de IA generativa de imagen** (Gemini Imagen, DALL-E, Midjourney, Stable Diffusion). Razones:

- Inconsistencia visual entre infografías: cada una parece de un sitio distinto y rompe la identidad del curso.
- No respetan paleta brand ni tipografía: salen colores y fuentes aleatorios.
- Renderizan mal el texto técnico (nombres de productos, comandos, KQL).
- Son PNG/JPG, no SVG: pixelan al zoom y no se pueden editar después.
- Cada iteración es un nuevo prompt con resultado distinto: imposible mantener.

**Producción real de cada tipo de visual:**

| Tipo | Herramienta | Dónde vive |
|---|---|---|
| Diagrama conceptual estático (cajas, relaciones, capas) | SVG nativo escrito a mano | `assets/NN-descripcion.svg` del módulo |
| Diagrama de flujo, secuencia, ER, gantt | Mermaid (se renderiza a SVG) | Inline en el `.md` con bloque `mermaid` |
| Visualización de datos no interactiva | SVG nativo o `recharts` exportado | `assets/` |
| Visualización de datos interactiva (filtros, tooltips) | Componente React con `recharts` | `shell/src/components/...` |
| Iconografía dentro de diagrama | `lucide-react` | Inline en el componente o como `<svg>` |
| Captura de UI real (admin center, portal) | PNG con anotaciones | `assets/` con rectángulo rojo y números en círculo |
| Infografía interactiva (mapping, drag-drop, drilldown) | Componente React | `shell/src/components/...`, no markdown |

**Paleta y tipografía obligatorias en SVG:**

- Colores brand: `#7B2FBE` (PV purple 600), `#9A44E5` (PV purple 500), `#F68DAC` (PV pink 400), grises stone (#1c1917 → #f5f5f4). Fondos de cajas: gris stone-50/stone-900 según light/dark si el SVG va con `<style>` para modo oscuro; si no, fondo neutro siempre.
- Para resaltar elementos críticos (el sujeto principal del diagrama): morado brand o borde morado.
- Tipografía: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` como font-family del SVG. **Nunca incrustar Inter ni Bricolage** en el SVG: las fonts no cargan en GitHub Pages al ser inline y todo cae al system font, mejor declararlo desde el principio.
- ViewBox razonable (900-1200 ancho para diagramas full-width, 600-800 para inline pequeños).

---

## Términos y traducciones

| Inglés (Microsoft) | Español del curso | Notas |
|---|---|---|
| Tenant | Tenant | No traducir |
| Agent | Agente | Traducir, salvo en nombres propios |
| Agent Registry | Agent Registry | No traducir, nombre propio |
| Agent Map | Agent Map | No traducir |
| Blueprint | Blueprint | No traducir |
| Conditional Access | Conditional Access | No traducir, nombre propio |
| Sensitivity label | Etiqueta de confidencialidad | Aceptado por Microsoft en es-es |
| DLP (Data Loss Prevention) | DLP / Prevención de pérdida de datos | Usar sigla en titulares; nombre completo en primera mención |
| Sponsor (de un agente) | Sponsor / patrocinador | Mantener "sponsor" cuando es término técnico |
| Workload identity | Identidad de carga de trabajo | |
| Compliance Manager | Compliance Manager | No traducir |
| Advanced hunting | Advanced hunting | No traducir |

---

## Emojis e iconos

**Regla absoluta: cero emojis en cualquier archivo del repositorio.** No se usan en módulos, en docs internas, en READMEs, en el plan, en commit messages ni en código. La regla aplica también a los emojis tipo "estado" (palomitas, ladrillos, relojes de arena) que parecen "neutros".

**Excepción única:** los badges de estado del producto, que se escriben en texto entre corchetes — `[GA]`, `[Preview]`, `[Frontier]`, `[Deprecated]`. No son emojis.

**Iconos:** solo en el shell React del curso (Fase 8.A en adelante). Las únicas dos librerías permitidas son **Lucide React** y **Material UI Icons**. Lucide es la opción por defecto por coherencia con el resto del stack de Plain Vanilla; Material UI se usa solo si Lucide no tiene el icono concreto. En markdown nunca hay iconos: siempre texto.

**Por qué la regla es absoluta:** el contenido se renderiza en múltiples superficies (markdown en GitHub, MkDocs, eventual shell React, PDFs descargables). Cada superficie renderiza emojis distinto y muchos los renderizan mal. Texto siempre se ve igual.

---

## Reglas anti-IA (lenguaje + UI)

> Estas reglas son **bloqueantes**. Cualquier contenido que las incumpla se devuelve para reescritura antes de mergear, da igual el módulo, el formato o quién lo haya producido.

### En el contenido de los módulos (.md)

**No usar estas frases ni sus variantes:**

| Frase prohibida | Por qué |
|---|---|
| "Es importante mencionar que…" / "Cabe destacar que…" | Filler IA. Si es importante, dilo directamente. |
| "En este sentido…" / "En este contexto…" | Conector vacío. |
| "Vale la pena…" / "Conviene tener en cuenta…" como apertura | Imperativo blando IA. Sustituir por un imperativo directo o suprimir. |
| "Como hemos visto…" / "Como se mencionó…" | El alumno puede saltar módulos. Usar referencia explícita: "(ver Módulo 03 § 3.2)". |
| "En resumen…" / "En conclusión…" | Si la sección termina, termina. |
| "Te ayudará a…" / "Te permitirá…" / "Podrás…" | Marketing-IA. Decir qué hace el producto, no qué siente el alumno. |
| "Una experiencia interactiva / navegable / inmersiva" | Marketing puro. |
| "Tu viaje de aprendizaje" / "Embárcate" / "Descubre" | Marketing puro. |
| "Transformar / potenciar / elevar / desbloquear / aprovecha al máximo" | Marketing puro. |
| "Ecosistema integrado" / "Solución end-to-end" | Marketing puro. |
| "Según los expertos" / "Típicamente" / "Muchas empresas" sin fuente | Generalización sin sustento. |
| "Fácilmente" / "De forma sencilla" / "En pocos minutos" | Falsa promesa. Si es fácil, se ve. |

**Em-dashes (—):** permitidos como separador título-subtítulo (`Módulo 01 — Fundamentos`), en captions de figura (`Fig. 1.1 — descripción`) y en listas término-definición (`Agent Registry — inventario centralizado`). **No abusar** del em-dash en mitad de frase como recurso retórico — es uno de los marcadores típicos de prosa IA. Si una frase tiene 2+ em-dashes en línea, reescribir.

**Conectores prohibidos:** "Por ende", "asimismo", "no obstante", "por consiguiente". Sustituir por conectores naturales: "y", "pero", "así", "entonces".

### En la UI del shell (componentes React + textos hardcoded)

**No mostrar nunca al alumno:**

- **IDs internos del banco de preguntas** (`EX-XX-XXX`). Son códigos del PMO, no etiquetas para el usuario.
- **Taxonomías pedagógicas** (Bloom: Aplicar / Comprender, OA-XX.N, ADKAR, etc.). Son metadata del diseño curricular.
- **Tipo de pregunta** ("Drag & drop", "Multiple choice", "Escenario") como etiqueta. El alumno lo identifica por el formato.
- **Dificultad** ("Fácil / Media / Difícil") como etiqueta. Si necesita aviso, redactarlo en lenguaje natural.
- **Fases internas del proyecto** ("Fase 2.A", "Hito B"). Son lenguaje del PMO.
- **Jerga DevOps** ("se actualiza al mergear a main", "deploy automático", "PR mergeado"). Irrelevante para el alumno.
- **Meta del proyecto** ("Este sitio es el prototipo de…", "Este shell es la Fase 2.A…"). El alumno usa el sitio, no asiste a la sprint review.

**Sí mostrar (información útil al alumno):**

- Duración estimada del módulo (planifica su tiempo).
- Número de preguntas que aporta el módulo al examen final (planifica el repaso).
- Estado del módulo (disponible / próximamente).
- Área del examen a la que pertenece y peso porcentual (qué priorizar).
- Tras validar un quiz: número de preguntas correctas y feedback por pregunta.

### Test rápido para detectar IA-leakage

Antes de mergear cualquier .md o cualquier componente con texto:

1. **Léelo en voz alta.** Si suena a folleto comercial, reescribir.
2. **Búscate las palabras de la tabla.** `grep -ni "vale la pena\|cabe destacar\|en este sentido\|tu viaje\|experiencia interactiva\|transforma\|potencia\|desbloquea\|aprovecha al máximo\|te permitirá\|fácilmente"` debería devolver cero resultados.
3. **Busca metadata de proyecto en UI.** `grep -rn "EX-\|OA-\|Bloom\|Fase \|Hito\|prototipo" shell/src/` solo debería devolver coincidencias en `lib/` o comentarios, nunca en strings que se rendericen.
4. **Cuenta los em-dashes por archivo.** Más de un em-dash cada ~80 líneas en un .md sugiere abuso retórico — revisar.

---

## Cosas que evitar

- Frases vacías como "es importante destacar que" o "cabe mencionar".
- Emojis. Sin excepciones (ver sección anterior).
- Traducir nombres propios de productos.
- Generalizaciones sin fuente: "según los expertos", "típicamente", "muchas empresas".
- Capturas pixeladas o de versiones antiguas del admin center.
