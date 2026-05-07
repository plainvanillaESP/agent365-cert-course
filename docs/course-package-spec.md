# PV-Learn — Course Package Specification

> Versión 1.0 · Mayo 2026 · Plain Vanilla Solutions SL

Este documento es la **especificación formal del formato de paquete de curso** que la plataforma PV-Learn carga y ejecuta. Un paquete de curso es una carpeta autocontenida con un `course.yaml` raíz, los módulos en subcarpetas con su `module.yaml`, los archivos de contenido en markdown y los assets binarios. La plataforma no sabe nada de ningún curso concreto: lo que sabe es interpretar paquetes que cumplan esta spec.

Cualquier curso producido por Plain Vanilla o por terceros que cumpla esta spec es ejecutable en PV-Learn sin tocar código del motor.

---

## Índice

- [1. Glosario](#1-glosario)
- [2. Estructura de carpetas](#2-estructura-de-carpetas)
- [3. course.yaml](#3-courseyaml)
- [4. module.yaml](#4-moduleyaml)
- [5. Tipos de sección](#5-tipos-de-sección)
- [6. Contenido inline en markdown — directivas](#6-contenido-inline-en-markdown--directivas)
- [7. quiz-practica.md](#7-quiz-practicamd)
- [8. Banco de examen final](#8-banco-de-examen-final)
- [9. Modalidad video y leccion.yaml](#9-modalidad-video-y-leccionyaml)
- [10. Assets y descargables](#10-assets-y-descargables)
- [11. Criterios de finalización y desbloqueo](#11-criterios-de-finalización-y-desbloqueo)
- [12. Validador](#12-validador)
- [13. Versionado y compatibilidad](#13-versionado-y-compatibilidad)

---

## 1. Glosario

| Término | Definición |
|---|---|
| **Plataforma** | El motor PV-Learn que renderiza paquetes de curso. Vive en `platform/`. |
| **Paquete de curso** | Carpeta autocontenida en `cursos/{slug}/` con manifest, módulos y assets. |
| **Módulo** | Unidad de aprendizaje. Cada módulo tiene su `module.yaml` y al menos una sección de contenido. |
| **Sección** | Pieza de contenido dentro de un módulo. Tipos: `teoria`, `quiz-practica`, `laboratorios`, `recursos`, `video`, `audio`. |
| **Bloque inline** | Componente embebido en markdown vía sintaxis `:::tipo` (vídeo, descargable, link-card, callout, etc.). |
| **OA** | Objetivo de aprendizaje. Identificador `OA-NN.M` único en el curso. |
| **Banco de examen** | Conjunto de preguntas oficiales del examen final del curso. Vive en `banco-examen.md`. |
| **Quiz de práctica** | Conjunto de preguntas del módulo (mínimo 3), distintas a las del banco final. |
| **Manifest** | Archivo YAML que declara estructura y metadatos: `course.yaml` o `module.yaml`. |

---

## 2. Estructura de carpetas

```
cursos/{slug-curso}/
├── course.yaml                       # Manifest del curso (obligatorio)
├── README.md                         # Descripción humana (opcional pero recomendada)
├── banco-examen.md                   # Banco oficial del examen final
├── assets/                           # Logos del curso, plantilla del certificado
│   ├── logo-claro.svg
│   ├── logo-oscuro.svg
│   ├── favicon.svg
│   └── certificado-template.svg
├── modulos/
│   ├── {slug-modulo-01}/
│   │   ├── module.yaml               # Manifest del módulo (obligatorio)
│   │   ├── teoria.md                 # Sección de teoría
│   │   ├── quiz-practica.md          # Quiz del módulo (mínimo 3 preguntas)
│   │   ├── laboratorios.md           # Sección de laboratorios (opcional)
│   │   ├── recursos.md               # Sección de recursos (opcional)
│   │   └── assets/                   # Imágenes, vídeos, descargables del módulo
│   │       ├── 01-diagrama.svg
│   │       ├── capturas/             # PNGs anotados (sustituyen SVGs en iteración 2)
│   │       │   └── M01-CAP-01.png
│   │       ├── videos/
│   │       │   └── intro.mp4
│   │       ├── audios/
│   │       └── files/                # PDFs, Excel, ZIP descargables
│   │           └── cheatsheet.pdf
│   └── ...
└── certificado/                      # Plantilla y configuración del certificado (opcional)
    └── plantilla.svg
```

**Reglas de carpetas:**

- El slug del curso es kebab-case, sin caracteres especiales, único entre todos los cursos del repo.
- El slug del módulo sigue el patrón `modulo-NN-{descriptor-corto}` por convención. NN con dos dígitos.
- Los assets binarios viven dentro del módulo que los usa (`{modulo}/assets/`). Solo lo compartido por todo el curso vive en `cursos/{slug}/assets/`.
- Las rutas dentro de los manifests son siempre **relativas al directorio del manifest** (no al raíz del repo).

---

## 3. course.yaml

Manifest raíz del paquete. Vive en `cursos/{slug}/course.yaml`.

### Campos obligatorios

| Campo | Tipo | Descripción |
|---|---|---|
| `spec_version` | string | Versión de esta spec contra la que el paquete se valida. Hoy: `"1.0"`. |
| `id` | string | Identificador único global del curso. |
| `slug` | string | Slug usado en URL (`/curso/{slug}/...`). Suele coincidir con `id`. |
| `nombre` | string | Nombre completo del curso. |
| `descripcion_corta` | string | Una línea para tarjetas de catálogo. |
| `idioma` | string | Código BCP-47 (`es-ES`, `en-US`, `pt-BR`...). |
| `duracion_total_min` | int | Suma de duraciones de los módulos. |
| `editor` | string | Razón social del editor del curso. |
| `version_curso` | string | SemVer del curso (`1.0.0`, `1.1.0`...). Sube cuando el contenido cambia. |
| `modalidad_predominante` | enum | `markdown` \| `video` \| `mixto`. Decide el layout por defecto. |
| `branding` | object | Ver [§3.1](#31-branding). |
| `areas_examen` | array | Ver [§3.2](#32-areas-de-examen). |
| `criterios_finalizacion_modulo` | object | Ver [§11](#11-criterios-de-finalización-y-desbloqueo). |
| `modo_navegacion` | enum | `secuencial-con-override` \| `secuencial-estricto` \| `libre`. |
| `examen_final` | object | Ver [§3.3](#33-examen-final). |
| `modulos` | array of strings | Slugs de los módulos en orden. |

### Campos opcionales

| Campo | Tipo | Descripción |
|---|---|---|
| `nombre_corto` | string | Para headers, navegación, badges. |
| `audiencia` | string | Descripción del público objetivo. |
| `fecha_publicacion` | string | ISO 8601. |
| `prerrequisitos_formales` | array | Lista de prerrequisitos. |
| `certificado` | object | Ver [§3.4](#34-certificado). |

### 3.1 Branding

```yaml
branding:
  color_primario: "#9A44E5"          # CSS color, usado como --color-primary
  color_acento: "#F68DAC"            # CSS color, usado como --color-accent
  gradiente: ["#9A44E5", "#F68DAC"]  # Lista de colores para gradientes lineales
  logo_claro: "assets/logo-claro.svg"      # Para fondos claros
  logo_oscuro: "assets/logo-oscuro.svg"    # Para fondos oscuros
  favicon: "assets/favicon.svg"
  apple_touch_icon: "assets/apple-touch-icon.png"
  fuente_titulares: "Bricolage Grotesque"  # Font family disponible en plataforma
  fuente_cuerpo: "Instrument Sans"
```

La plataforma aplica estos valores como CSS custom properties cuando carga el curso. El curso sobreescribe los defaults de PV-Learn.

### 3.2 Áreas de examen

```yaml
areas_examen:
  - id: 1
    nombre_es: "Planificación y configuración"
    nombre_en: "Plan and configure Microsoft Agent 365"
    peso_pct: 15
    modulos: [1, 2, 3, 4, 5]
```

La suma de `peso_pct` de todas las áreas debe ser 100. Cada módulo aparece en exactamente un área.

### 3.3 Examen final

```yaml
examen_final:
  archivo: "banco-examen.md"
  duracion_min: 90
  numero_preguntas: 60
  puntaje_aprobado_pct: 70
  intentos_max: 3
  espera_tras_max_intentos_dias: 7
  desbloqueado_cuando: "todos-los-modulos-completados"
```

El archivo del banco vive en `cursos/{slug}/{archivo}` (relativo al manifest).

### 3.4 Certificado

```yaml
certificado:
  habilitado: true
  nombre_otorgado: "Microsoft Agent 365 IT Administrator — Plain Vanilla"
  plantilla: "assets/certificado-template.svg"
  campos_dinamicos: ["nombre_alumno", "fecha_emision", "id_verificacion"]
  url_verificacion: "/verify/{id}"
```

La plantilla SVG tiene placeholders `{{nombre_alumno}}`, `{{fecha_emision}}`, `{{id_verificacion}}` que la plataforma sustituye al generar el PDF. Si `habilitado: false`, no se genera certificado.

---

## 4. module.yaml

Manifest del módulo. Vive en `cursos/{slug-curso}/modulos/{slug-modulo}/module.yaml`.

### Campos obligatorios

| Campo | Tipo | Descripción |
|---|---|---|
| `spec_version` | string | `"1.0"`. |
| `id` | int | Numérico único en el curso. |
| `slug` | string | Coincide con el nombre de la carpeta del módulo. |
| `titulo` | string | Título completo. |
| `duracion_min` | int | Suma de duración de las secciones. |
| `area_examen` | int | Referencia a `course.yaml > areas_examen[].id`. |
| `secciones` | array | Ver [§5](#5-tipos-de-sección). |
| `objetivos_aprendizaje` | array | Cada uno con `id` (`OA-NN.M`), `texto`, `bloom`. |

### Campos opcionales

| Campo | Tipo | Descripción |
|---|---|---|
| `estado` | enum | `producido` \| `en_revision` \| `pendiente`. Interno. |
| `fase_produccion` | int | Trazabilidad interna de producción. |
| `ultima_actualizacion` | date | ISO. |
| `prerrequisitos` | array | IDs o slugs de módulos del propio curso requeridos antes de este. |
| `prerrequisitos_externos` | array | Texto libre (ej. "experiencia previa en Microsoft 365 admin"). |
| `glosario` | array | Términos clave del módulo. |
| `sub_secciones_teoria` | array | Subsecciones temporizadas dentro de `teoria.md`. |
| `laboratorios` | array | Metadatos de cada lab (id, dificultad, requiere_tenant, licencias, roles). |
| `preguntas_aporta_examen_final` | int | Cuántas preguntas del banco final salen de este módulo. |

---

## 5. Tipos de sección

Cada entrada de `secciones` declara una sección del módulo. La plataforma renderiza cada sección con el componente correspondiente al `tipo`.

### 5.1 Tipos v1.0

| Tipo | Renderizador | Archivos esperados | Uso |
|---|---|---|---|
| `teoria` | `<MarkdownTeoria>` | `teoria.md` | Markdown con bloques inline. Sección obligatoria en módulos markdown-first. |
| `quiz-practica` | `<Quiz>` | `quiz-practica.md` | Quiz del módulo. Mínimo 3 preguntas. |
| `laboratorios` | `<Lab>` | `laboratorios.md` | Ejercicios prácticos. |
| `recursos` | `<Resources>` | `recursos.md` | Listado tipado de enlaces y descargables. |
| `video` | `<VideoPlayer>` | `leccion.yaml` + assets | Vídeo protagonista. Ver [§9](#9-modalidad-video-y-leccionyaml). |
| `audio` | `<AudioPlayer>` | `audio.yaml` + assets | Audio protagonista (podcast-style). |

### 5.2 Atributos por tipo

```yaml
secciones:
  - tipo: teoria
    archivo: teoria.md

  - tipo: quiz-practica
    archivo: quiz-practica.md
    umbral_aprobado_pct: 70           # default 70 si no se declara
    intentos_max: null                # null = ilimitado

  - tipo: laboratorios
    archivo: laboratorios.md
    intentos_min_requeridos: 1

  - tipo: recursos
    archivo: recursos.md

  - tipo: video
    archivo: leccion.yaml
    transcripcion: transcripcion.md   # opcional pero recomendado para accesibilidad

  - tipo: audio
    archivo: episodio.yaml
    transcripcion: transcripcion.md
```

### 5.3 Extensibilidad

Tipos previstos para futuras versiones de la spec sin breaking changes:

- `embed` — iframe de Microsoft Learn module, YouTube, Loom.
- `slide-deck` — Reveal.js o equivalente.
- `interactive-lab` — Sandbox con tasks evaluables.
- `code-playground` — Editor de código con runner.
- `branching-scenario` — Escenario con caminos alternativos según decisiones.
- `flashcards` — Tarjetas para memorización activa.
- `timeline` — Línea de tiempo interactiva.

Cada tipo se introduce en una versión menor de la spec (1.1, 1.2, etc.) registrando un componente en el motor. Los paquetes que declaren tipos no soportados muestran un placeholder explícito.

---

## 6. Contenido inline en markdown — directivas

Dentro de un `teoria.md`, `laboratorios.md` o `recursos.md` se pueden insertar bloques con sintaxis `:::tipo` que la plataforma renderiza como componentes ricos. La sintaxis es **remark directives** (estándar `remark-directive`), no MDX.

### 6.1 Catálogo v1.0

| Directiva | Uso |
|---|---|
| `::: video` | Vídeo embebido. |
| `::: audio` | Audio embebido (podcast). |
| `::: image` | Figura con caption, lightbox. |
| `::: download` | PDF, Excel, Word, ZIP, etc. con icono según extensión. |
| `::: link-card` | Tarjeta rica para URL externa con favicon y descripción. |
| `::: embed` | iframe permitido (whitelist de dominios en plataforma). |
| `::: callout` | info \| warning \| tip \| pitfall \| nota. |
| `::: comparison` | Tabla comparativa side-by-side. |
| `::: quote` | Cita destacada. |
| `::: pregunta` | Pregunta inline opcional, no evaluable, refuerzo. |

### 6.2 Sintaxis

Cada directiva acepta un cuerpo en YAML (o markdown plano para algunas). La plataforma valida el cuerpo contra el esquema del bloque al cargar.

```markdown
::: video
src: assets/videos/intro.mp4
poster: assets/videos/intro-poster.jpg
captions:
  - idioma: es
    archivo: assets/videos/intro.es.vtt
    default: true
duracion: "3:24"
titulo: "El ecosistema en tres minutos"
:::

::: download
archivo: assets/files/cheatsheet.pdf
tipo: pdf
titulo: "Cheatsheet de stakeholders"
descripcion: "Tabla resumen para imprimir."
peso: "240 KB"
:::

::: link-card
url: https://learn.microsoft.com/microsoft-agent-365/
titulo: "Microsoft Agent 365 — Documentación oficial"
sitio: "Microsoft Learn"
favicon: auto
descripcion: "Hub de documentación oficial."
:::

::: callout
tipo: warning
titulo: "Cuidado con la confusión"
La confusión Agent 365 vs Copilot Studio es la más frecuente del primer mes.
:::
```

### 6.3 Esquema completo de cada bloque

Mantenido aparte en `docs/inline-blocks-schema.md` (a producir junto a la implementación del parser).

---

## 7. quiz-practica.md

Markdown con frontmatter de la sección y un bloque `::: pregunta` por cada pregunta. Mínimo 3 preguntas por módulo.

```markdown
---
modulo: 1
tipo: quiz-practica
titulo: "Quiz de práctica del Módulo 01"
umbral_aprobado_pct: 70
---

# Quiz de práctica — Módulo 01

> Tres preguntas para validar tu comprensión. Intentos ilimitados.
> Aprobado a partir del 70%.

---

::: pregunta
id: Q-01-1
oa: OA-01.1
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  ¿Cuál es la diferencia fundamental entre Microsoft Agent 365 y Copilot Studio?
opciones:
  - id: a
    texto: "Copilot Studio crea agentes y Agent 365 los gobierna; son productos complementarios."
    correcta: true
  - id: b
    texto: "Agent 365 reemplaza a Copilot Studio porque integra creación y gobernanza."
  - id: c
    texto: "Son alternativos: se elige uno u otro según el escenario."
justificacion: |
  Agent 365 es un control plane de gobernanza, no crea agentes. Es complementario.
:::

::: pregunta
id: Q-01-2
...
:::

::: pregunta
id: Q-01-3
...
:::
```

### 7.1 Tipos de pregunta v1.0

| `tipo` | Comportamiento |
|---|---|
| `multiple-choice` | Una sola respuesta correcta entre N opciones. |
| `multiple-response` | Varias respuestas correctas, todas deben marcarse. |
| `drag-and-drop` | Empareja items con categorías. |
| `ordering` | Ordena items en una secuencia. |
| `scenario` | Caso de estudio con pregunta. |
| `kql-completion` | Completa una query KQL parcial (específico cursos técnicos Microsoft). |

### 7.2 Identificadores

- Quiz de práctica: `Q-NN-M` (módulo NN, pregunta M).
- Banco de examen final: `EX-NN-MMM` (módulo NN del que sale, pregunta MMM correlativa).
- Las preguntas del quiz de práctica **nunca** son las mismas que las del banco final. Pueden cubrir los mismos OAs con enunciados, datos y formulaciones distintos.

---

## 8. Banco de examen final

Vive en `cursos/{slug}/banco-examen.md`. Mismo formato que `quiz-practica.md` pero con identificadores `EX-NN-MMM`. La suma de `preguntas_aporta_examen_final` de todos los módulos debe ser exactamente igual a `examen_final.numero_preguntas` en `course.yaml`.

```markdown
---
spec_version: "1.0"
tipo: banco-examen
total_preguntas: 60
---

# Banco oficial del examen final

> Estas preguntas se presentan al alumno solo durante el examen final.
> No deben aparecer en ningún quiz de práctica de módulo.

---

::: pregunta
id: EX-01-001
modulo: 1
oa: OA-01.1
area: 1
tipo: multiple-choice
dificultad: facil
bloom: Comprender
enunciado: |
  ...
opciones:
  - id: a
    texto: "..."
    correcta: true
  - id: b
    ...
justificacion: |
  ...
variantes:
  - "Cambiar Copilot Studio por Microsoft Foundry"
  - "..."
:::
```

---

## 9. Modalidad video y leccion.yaml

Cuando una sección es `tipo: video`, su `archivo` apunta a un `leccion.yaml` que declara la fuente del vídeo y sus metadatos.

```yaml
spec_version: "1.0"
src: "assets/videos/leccion-03.mp4"
poster: "assets/videos/leccion-03-poster.jpg"
duracion_seg: 1452

captions:
  - idioma: es
    archivo: "assets/videos/leccion-03.es.vtt"
    default: true
  - idioma: en
    archivo: "assets/videos/leccion-03.en.vtt"

capitulos:
  - tiempo: 0
    titulo: "Introducción"
  - tiempo: 92
    titulo: "Crear la tabla dinámica"
  - tiempo: 480
    titulo: "Filtros y segmentaciones"

descargable: false                # Si true, el alumno puede descargar el archivo
velocidad_min: 0.5
velocidad_max: 2.0
```

### 9.1 UX en modalidad video

- Player a 16:9 protagonista.
- Capítulos navegables a la derecha (desplegables en mobile).
- Controles: play/pause, velocidad, captions, picture-in-picture, fullscreen.
- Resume from last position automático.
- Transcripción sincronizada (si hay `transcripcion`): clic en frase salta al timestamp.
- Progreso = % máximo visto del vídeo (no tiempo lineal: si el alumno saltó al final no se cuenta).

---

## 10. Assets y descargables

### 10.1 Imágenes y diagramas

- SVG preferido cuando es posible (versionable, escalable).
- PNG para capturas reales de admin centers (anotaciones rojas `#D7263D`, números en círculo).
- WebP para fotografías cuando aplique.

### 10.2 Vídeo

- MP4 H.264 + AAC (compatibilidad universal).
- WebM VP9 opcional como alternativa.
- Captions en WebVTT.
- Resolución máxima recomendada: 1080p. Para vídeos largos (>10 min): 720p suficiente, ahorra ancho de banda.

### 10.3 Audio

- MP3 o AAC.
- Captions en WebVTT cuando sea contenido didáctico.

### 10.4 Descargables

- PDF para documentos.
- XLSX para hojas de cálculo.
- DOCX para plantillas Word.
- ZIP para bundles.
- Cada descargable se invoca desde el markdown vía `::: download` o desde `recursos.md`.

### 10.5 Pesos

La plataforma no impone límites duros. Recomendaciones:

- Imagen inline: < 500 KB cada una.
- Vídeo de módulo: < 200 MB.
- Descargables: < 50 MB cada uno.

Para activos pesados se recomienda CDN externa (Cloudflare R2, Azure Blob) y referenciar URL absoluta.

---

## 11. Criterios de finalización y desbloqueo

### 11.1 Cuándo un módulo está completado

```yaml
criterios_finalizacion_modulo:
  teoria_scroll_pct_min: 80
  quiz_practica_pct_min: 70
  labs_intentados_min: 1
  video_visto_pct_min: 80
  audio_escuchado_pct_min: 80
```

El motor calcula `module.completed = AND de todos los criterios aplicables`. Un criterio es aplicable si el módulo tiene una sección de ese tipo. Si un módulo no tiene `laboratorios`, el criterio `labs_intentados_min` se omite del cálculo.

### 11.2 Modos de navegación

| Modo | Comportamiento |
|---|---|
| `secuencial-estricto` | El módulo N+1 se desbloquea solo cuando N está completado. Sin override. |
| `secuencial-con-override` | Por defecto secuencial, pero el alumno puede activar "Modo exploración libre" en su perfil para saltar bloqueos. |
| `libre` | Todos los módulos accesibles desde el inicio. |

Recomendado para cursos de certificación: `secuencial-con-override`.

### 11.3 Examen final

Se desbloquea cuando todos los módulos del curso están en estado `completado`. La condición exacta se declara en `examen_final.desbloqueado_cuando`. Valores soportados:

- `todos-los-modulos-completados`
- `n-modulos-completados:{N}` (futuro)
- `area-completada:{ID}` (futuro)

---

## 12. Validador

Comando: `npm run validate -- {slug-curso}` (a producir como `scripts/validate-course.ts`).

### 12.1 Validaciones del nivel curso

- `course.yaml` válido contra esquema Zod.
- `spec_version` soportada por la plataforma actual.
- Suma de `peso_pct` de áreas = 100.
- Cada módulo de `course.yaml > modulos` existe como carpeta.
- `examen_final.archivo` existe.
- Suma de `preguntas_aporta_examen_final` de todos los módulos = `examen_final.numero_preguntas`.

### 12.2 Validaciones del nivel módulo

- `module.yaml` válido contra esquema Zod.
- Cada `secciones[].archivo` existe.
- Cada OA tiene formato `OA-NN.M`.
- Sin OAs duplicados entre módulos.
- `area_examen` referenciada existe en `course.yaml`.
- Si tiene `quiz-practica`, mínimo 3 preguntas con IDs `Q-NN-M` únicos.

### 12.3 Validaciones del banco de examen

- Cada pregunta del banco tiene ID único `EX-NN-MMM`.
- El `modulo` y `oa` de cada pregunta referencia entidades existentes.
- Ninguna pregunta del banco aparece literalmente en ningún `quiz-practica.md` del curso.

### 12.4 Validaciones de contenido

- Linter anti-IA aplicado a todos los `.md` (reglas de `convenciones-redaccion.md`).
- Bloques inline `:::` con esquema válido.
- Enlaces internos resuelven.
- Imágenes referenciadas existen.

El validador devuelve código de salida 0 si todo OK, 1 si hay errores. Salida humana legible con línea exacta del problema. Se conecta como CI check del repo.

---

## 13. Versionado y compatibilidad

### 13.1 Versionado de la spec

- `MAJOR.MINOR` (ej. `1.0`, `1.1`, `2.0`).
- **MINOR** se incrementa al añadir tipos de sección, directivas o campos opcionales. Compatible hacia atrás.
- **MAJOR** se incrementa con breaking changes. Los paquetes existentes no son compatibles automáticamente.

### 13.2 Versionado del curso

- `version_curso` en `course.yaml` sigue SemVer del **contenido**:
  - **PATCH** — fix de erratas, redacción.
  - **MINOR** — nuevas preguntas, nuevos labs, contenido adicional sin cambios estructurales.
  - **MAJOR** — reorganización de módulos, cambios de áreas, eliminación de módulos.

### 13.3 Compatibilidad

La plataforma soporta múltiples `spec_version` simultáneamente. Si la plataforma está en v1.5 y un curso declara `spec_version: 1.0`, el motor usa el cargador legacy.

---

## Anexos

- [`arquitectura-curso.md`](./arquitectura-curso.md) — Blueprint pedagógico específico del curso de Microsoft Agent 365.
- [`convenciones-redaccion.md`](./convenciones-redaccion.md) — Tono y reglas anti-IA.
- [`capturas-pendientes.md`](./capturas-pendientes.md) — Inventario de capturas para iteración 2.
- [`inline-blocks-schema.md`](./inline-blocks-schema.md) — Esquema YAML de cada directiva inline (a producir).

---

> **Editor:** Plain Vanilla Solutions SL · **Última actualización:** 2026-05-07
