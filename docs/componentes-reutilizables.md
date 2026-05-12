# Componentes UI reutilizables (design system)

Catálogo de los componentes y patrones visuales de la plataforma. Cualquier curso nuevo arrancado con la guía de `reusar-plataforma.md` debe usar exclusivamente estos componentes para mantener coherencia visual.

---

## Render de contenido markdown

### `MarkdownRenderer`

Único componente que convierte `.md` del paquete del curso a UI. Procesa frontmatter aparte, resuelve rutas relativas de imágenes, y delega cada elemento a su sub-componente.

```tsx
import { MarkdownRenderer } from '@/components/MarkdownRenderer'

<MarkdownRenderer
  body={content.body}
  moduleSlug={module.slug}
  variant="default" // o "lab"
/>
```

**Variantes**
- `default` — Teoría, recursos, descripciones largas.
- `lab` — Activa pasos numerados grandes con bullets en gradient brand y headers de sección con borde lateral. El resto sigue idéntico.

**Sub-componentes aplicados automáticamente**

| Elemento markdown | Render | Comportamiento |
|---|---|---|
| `![alt](url)` | `<ZoomableImage>` | Click amplía a lightbox |
| `**texto**`, `*texto*`, `` `texto` ``, `[link](url)` en línea | nativo + `transformBadges` | Negrita, cursiva, code, enlace; `[GA]`, `[Preview]`, `[Frontier]`, `[Deprecated]` se convierten en badges |
| `> texto` (blockquote) | callout clasificado | Ver tabla de callouts más abajo |
| Enlaces externos | `<a target="_blank">` con icono | Atributo `rel="noopener noreferrer"` |

### Callouts (blockquotes clasificados)

Los blockquotes del markdown se clasifican automáticamente por su primera línea y reciben un estilo visual semántico. **Funciona en cualquier sección (teoría, lab, recursos)**, no hay que activar nada.

| Si la primera línea empieza con… | Tipo | Color | Uso típico |
|---|---|---|---|
| `Nota:`, `Prerrequisitos`, `Requisitos previos`, `Recordatorio`, `Info` | `info` | Azul | Información de contexto, prerequisitos |
| `⚠`, `Importante:`, `Atención:`, `Aviso:`, `Cuidado`, `Warning` | `warning` | Ámbar | Advertencias, gotchas |
| `Validación:`, `Resultado esperado:`, `OK:` | `success` | Verde | Confirmación tras un paso |
| `Tip:`, `Consejo:`, `Pro tip` | `tip` | Púrpura | Trucos y mejoras opcionales |
| `[CAPTURA PENDIENTE …]` | `capture` | Borde discontinuo gris | Placeholder de captura que se añadirá luego |

Para forzar un tipo concreto, basta empezar la primera línea con la palabra clave correspondiente. Por defecto, cualquier blockquote sin palabra clave detectada se renderiza como `info`.

### `InlineMarkdown`

Para texto con markdown inline (negrita, cursiva, code, enlaces) que **no debe envolverse en `<p>`**. Pensado para enunciados de preguntas, opciones de quiz, items drag-and-drop, ordering, justificaciones de feedback.

```tsx
import { InlineMarkdown } from '@/components/InlineMarkdown'

<span>
  <InlineMarkdown text={option.text} />
</span>
```

Soporta: `**bold**`, `*italic*` o `_italic_`, `` `code` ``, `[link](url)`. No soporta encabezados ni bloques (no aplica inline).

### `ZoomableImage`

Imagen con click-to-zoom integrado. Está conectado a `MarkdownRenderer` (cualquier `![alt](url)` lo usa automáticamente), pero también se puede invocar directo:

```tsx
import { ZoomableImage } from '@/components/ZoomableImage'

<ZoomableImage src={url} alt="Descripción" />
```

**Comportamiento**
- Click sobre la imagen → overlay full-screen con backdrop oscuro.
- Controles: zoom in/out (50%–400%), reset, cerrar.
- Pan con drag cuando hay zoom (`scale > 1`).
- Atajos: `Esc` cierra, `+`/`-` zoom, `0` reset.
- Etiqueta inferior con el `alt` para contexto.
- Bloqueo de scroll del body mientras está abierto.
- `print:hidden` para no aparecer al imprimir certificados.
- Renderizado via `createPortal(modal, document.body)` para evitar conflictos con `<p>` parent.

---

## Layout y avisos

### `PageHeader`

Cabecera estándar de página. Reemplaza los headers ad-hoc que cada página inventaba con tamaños y tracking ligeramente distintos. Dos modos:

```tsx
import { PageHeader } from '@/components/PageHeader'

// Hero (con logo grande a la izquierda): para la home y landings
<PageHeader
  eyebrow="Plain Vanilla Solutions · Curso"
  title={COURSE_TITLE}
  description={COURSE_DESCRIPTION}
  logo={<img src="..." className="size-[96px] rounded-[18px]" />}
  actions={<ButtonLink to="/modulo/1/teoria">Empezar</ButtonLink>}
/>

// Simple (sin logo): para páginas internas
<PageHeader
  eyebrow="Tu progreso"
  title="Microsoft Agent 365 IT Admin"
  description="Tu avance por los módulos producidos del curso..."
/>
```

| Modo | Cuándo usar | Tipografía |
|---|---|---|
| `logo` | Home, landings | h1 34-40 px display bold |
| sin `logo` | Settings, examen, progreso, módulos | h1 28-32 px display semibold |

### `Section` (de `@/components/Layout`)

Bloque estándar para agrupar contenido en una página. Eyebrow uppercase opcional + título grande + descripción + contenido. Se usa en home, settings, examen, progreso. Cualquier página nueva debe usarlo en lugar de inventar otra forma de presentar secciones.

```tsx
import { Section } from '@/components/Layout'

<Section
  eyebrow="Examen"
  title="Áreas de competencia"
  description="Pesos canónicos de cada área."
  action={<Button>Ver detalles</Button>} // opcional
>
  <ContenidoDeLaSeccion />
</Section>
```

### `Card` (de `@/components/Layout`)

Contenedor con borde y fondo. Padding por defecto, o `flush` cuando el contenido es una lista que ya gestiona su propio padding interno (típicamente `<ul>` con `divide-y`).

```tsx
import { Card } from '@/components/Layout'

<Card>Contenido con padding</Card>

<Card flush>
  <ul className="divide-y divide-[var(--border-subtle)]">
    {items.map(i => <Row key={i.id} item={i} />)}
  </ul>
</Card>
```

### `EmptyState` (de `@/components/Layout`)

Estado vacío estándar para listas sin datos (sin intentos del examen, sin historial, búsqueda sin resultados). Icono opcional + título + descripción + CTA. Coherencia visual entre "no hay datos" en todas las páginas.

```tsx
import { EmptyState } from '@/components/Layout'
import { History } from 'lucide-react'

<EmptyState
  icon={<History className="size-10 stroke-[1.5]" />}
  title="Aún no has hecho ningún intento"
  description="Cuando termines el examen verás aquí los resultados."
  action={<Button>Empezar examen</Button>}
/>
```

### `Stat`, `StatsGrid` (de `@/components/Layout`)

Métrica destacada: label uppercase pequeña + valor grande tabular-nums. Composer dentro de `StatsGrid` y los bordes finos del grid se gestionan automáticamente.

```tsx
import { Stat, StatsGrid } from '@/components/Layout'
import { BookOpen, Clock } from 'lucide-react'

<StatsGrid cols={4}>
  <Stat icon={<BookOpen className="size-[14px]" />} label="Módulos" value="16" />
  <Stat icon={<Clock className="size-[14px]" />} label="Duración" value="18h" />
  <Stat label="Examen" value="90 min" hint="60 preguntas" />
  <Stat label="Preguntas" value="60" />
</StatsGrid>
```

### `Modal`

Modal genérico con createPortal, backdrop oscuro, bloqueo de scroll del body, focus inicial y Escape para cerrar. **Cualquier modal nuevo debe pasar por aquí**: `ConfirmDialog`, `ZoomableImage` y futuros diálogos lo consumen.

```tsx
import { Modal } from '@/components/Modal'

// Modo normal (cabecera + body + footer)
<Modal
  open={confirmOpen}
  onClose={() => setConfirmOpen(false)}
  size="sm"
  header={<h2 className="text-[16px] font-semibold">¿Confirmar acción?</h2>}
  footer={
    <>
      <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
      <Button variant="primary" onClick={onConfirm}>Continuar</Button>
    </>
  }
>
  <p>Texto explicativo de la acción.</p>
</Modal>

// Modo bare (sin chrome, contenido directo al backdrop)
<Modal open={lightboxOpen} onClose={...} bare className="bg-black/85">
  <img src={...} />
</Modal>
```

| Prop | Uso |
|---|---|
| `size="sm" / "md" / "lg" / "auto"` | Max-width del card |
| `bare` | Sin chrome; el children va directo al backdrop |
| `closeOnBackdrop={false}` | Solo cierre explícito (Escape o X) |
| `header`, `footer` | Slots opcionales |

---

## Estados y filas

### `Callout`

Bloque de aviso con icono y color semántico. Mismo lenguaje visual que los blockquotes del markdown (mismo set de colores y comportamiento), pero invocable desde cualquier componente JSX. Cinco variantes:

| `kind` | Color | Uso |
|---|---|---|
| `info` (default) | Azul | Contexto, prerrequisitos, notas |
| `warning` | Ámbar | Advertencias, atención |
| `success` | Verde | Confirmaciones, validación |
| `tip` | Púrpura | Consejos, mejoras opcionales |
| `capture` | Gris discontinuo | Placeholder, pendiente |

```tsx
import { Callout } from '@/components/Callout'

<Callout kind="warning" title="Antes de empezar">
  Verifica que tienes acceso de administrador al tenant antes de seguir.
</Callout>

<Callout kind="success">Intento guardado correctamente.</Callout>
```

Para callouts dentro de markdown (en módulos del curso), no se usa `<Callout>` directamente: el `MarkdownRenderer` clasifica blockquotes `>` por su primera línea y aplica el estilo visual equivalente. El componente `Callout` es para JSX en páginas React.

---

### `Breadcrumbs`

Migas de pan con marcado semántico (`aria-label="Breadcrumb"`, `aria-current="page"` en el último item) y datos estructurados schema.org BreadcrumbList incrustados como JSON-LD para que motores de búsqueda enriquezcan los SERPs.

```tsx
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Home } from 'lucide-react'

<Breadcrumbs items={[
  { label: 'Inicio', to: '/', icon: <Home className="size-3" /> },
  { label: 'Módulo 04', to: '/modulo/4/teoria' },
  { label: 'Teoría' },                            // último → texto plano + aria-current
]} />
```

| Prop | Tipo | Uso |
|---|---|---|
| `items` | `BreadcrumbItem[]` | Lista ordenada; el último item siempre es texto plano |
| `className` | `string` | Clases extra opcionales |

Cada `BreadcrumbItem` tiene `label`, opcional `to` (Link de React Router) e opcional `icon` (ReactNode pequeño).

---

### `Skeleton`, `SkeletonParagraph`, `WhenReady`

Placeholders de carga con shimmer suave (animación CSS, respeta `prefers-reduced-motion`). Reemplazan spinners y "Cargando…" inertes con un placeholder que ocupa el sitio del contenido futuro y reduce CLS.

```tsx
import { Skeleton, SkeletonParagraph, WhenReady } from '@/components/Skeleton'

// Bloques sueltos
<Skeleton width="40%" height="1.5em" />
<Skeleton shape="circle" width="32px" height="32px" />
<Skeleton shape="rect" width="100%" height="200px" />

// Párrafo de varias líneas (3 por defecto)
<SkeletonParagraph lines={4} />

// Envolvedor declarativo
<WhenReady ready={!loading} fallback={<SkeletonParagraph lines={5} />}>
  <article>{content}</article>
</WhenReady>
```

| Prop de `Skeleton` | Tipo | Default |
|---|---|---|
| `width` | string CSS | `100%` |
| `height` | string CSS | `1em` |
| `shape` | `'line' | 'circle' | 'rect'` | `'line'` |
| `ariaLabel` | string | (oculto a a11y por defecto; pásalo solo en el contenedor padre) |

Para regiones con varios skeletons usar `role="status"` y `aria-live="polite"` en el contenedor, no en cada Skeleton.

---

## Atajos de teclado

### `useKeyboardShortcuts`, `ShortcutsModal`, `KeyChip`, `KeyCombo`

Registro centralizado de atajos de teclado. El hook escucha en `document` con captura única y normaliza combinaciones; el modal de ayuda los lista agrupados.

```tsx
import { useKeyboardShortcuts, type Shortcut } from '@/hooks/useKeyboardShortcuts'
import { ShortcutsModal } from '@/components/ShortcutsModal'

const [helpOpen, setHelpOpen] = useState(false)
const shortcuts: Shortcut[] = [
  { key: '?', shift: true, description: 'Mostrar ayuda', group: 'Ayuda', handler: () => setHelpOpen(true) },
  { key: 'g', description: 'Ir al inicio', group: 'Navegación', handler: () => navigate('/') },
  { key: 'j', description: 'Siguiente módulo', group: 'En un módulo', handler: () => /* … */ },
]
useKeyboardShortcuts(shortcuts)

<ShortcutsModal open={helpOpen} onClose={() => setHelpOpen(false)} shortcuts={shortcuts} />
```

| Campo de `Shortcut` | Tipo | Uso |
|---|---|---|
| `key` | string | Tecla, lowercase para letras, `?`/`Escape`/etc. |
| `meta` | boolean | Requiere Cmd o Ctrl |
| `shift` | boolean | Requiere Shift |
| `description` | string | Texto mostrado en el modal de ayuda |
| `group` | string | Agrupador en el modal |
| `handler` | `() => void` | Callback |
| `enableInInputs` | boolean | Permite ejecutar dentro de inputs (default: false) |

Helpers `KeyChip` (tecla individual) y `KeyCombo` (varias teclas con `+`) renderizan teclas como `<kbd>` con tipografía mono. `shortcutKeys(s)` calcula el array a mostrar respetando platform (`⌘` en Mac, `Ctrl` en Windows/Linux).

---

## Búsqueda global

### `SearchPalette` + `lib/search.ts`

Paleta de búsqueda tipo `Cmd+K` sobre todo el contenido del curso. La UI vive en `components/SearchPalette.tsx` (modal con lista de resultados y navegación por teclado) y el motor de indexación/matching en `lib/search.ts`.

```tsx
import { lazy, Suspense, useState } from 'react'
const SearchPalette = lazy(() =>
  import('@/components/SearchPalette').then(m => ({ default: m.SearchPalette })),
)

const [open, setOpen] = useState(false)
{open && (
  <Suspense fallback={null}>
    <SearchPalette open={open} onClose={() => setOpen(false)} />
  </Suspense>
)}
```

Fuentes indexadas: módulos (título + área), secciones de teoría (troceadas por H2/H3), enunciados de quiz, escenarios de labs, recursos. El índice se construye una vez en memoria al primer uso.

```ts
import { searchCourse, highlight } from '@/lib/search'

const results = searchCourse('agent id', 20) // hasta 20 hits
// → [{ type, moduleId, title, snippet, to, tag, score }]

const segments = highlight('Microsoft Entra Agent ID', 'agent id')
// → [{ text, match }] para renderizar con <mark>
```

Matching: AND de todos los tokens, normaliza tildes/case, scoring con peso por tipo (módulos > teoría > quiz > labs > recursos) + boost si el match cae en el título + bonus por frase contigua.

**Code-splitting**: cargar `SearchPalette` con `React.lazy()` mantiene el bundle inicial pequeño; el chunk con el índice solo se descarga al abrir la paleta.

---

## Botones y acciones

### `Button`

Botón con cuatro variantes: `primary`, `secondary`, `ghost`, `danger`. Tres tamaños: `sm`, `md`, `lg`.

```tsx
import { Button } from '@/components/Button'

<Button
  variant="primary"
  size="md"
  onClick={handleAction}
  iconLeft={<Icon className="size-4" />}
>
  Acción
</Button>
```

### `ButtonLink`, `ButtonAnchor`

Variantes que renderizan `<Link>` (react-router) o `<a>` (anchor externo) con los mismos estilos.

```tsx
<ButtonLink to="/modulo/1/teoria" variant="primary" size="lg">
  Empezar
</ButtonLink>

<ButtonAnchor href="https://example.com" variant="secondary">
  Documentación oficial
</ButtonAnchor>
```

### `IconButton`

Botón cuadrado con solo icono. `label` es obligatorio para `aria-label`.

```tsx
<IconButton onClick={togglemenu} label="Abrir navegación" size="md">
  <Menu className="size-5" />
</IconButton>
```

---

## Patrones de contenido

### Cards con bordes

Para listas de elementos en home, progreso, etc.:

```tsx
<div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
  …
</div>
```

### Sections (Hero + StatsGrid + Section)

`HomePage` define un patrón reutilizable. `Section` toma `eyebrow` (uppercase pequeño), `title`, `description` y `children`. Si vas a crear nueva sección en home, copia su firma.

### Badges textuales

Los `[GA]`, `[Preview]`, `[Frontier]`, `[Deprecated]` en cualquier markdown se convierten automáticamente en badges coloreados sin tocar el contenido. Si necesitas un nuevo badge:

1. Añadir la palabra en la regex de `transformBadges` (en `MarkdownRenderer.tsx`).
2. Añadir la clase `.badge-status-<x>` en `index.css`.

---

## Tokens visuales

Todos los colores, espacios y tipografía vienen de variables CSS en `index.css`. **No usar valores literales** (`#9A44E5`, `16px`...) en componentes nuevos. Lista:

### Colores

| Variable | Uso |
|---|---|
| `--color-pv-purple-{100..900}` | Brand purple (gradient hero, sello, primary buttons) |
| `--color-pv-pink-{100..900}` | Brand pink (gradient hero, sello) |
| `--text-primary` | Texto principal |
| `--text-secondary` | Texto secundario |
| `--text-muted` | Texto de menor importancia, garantizado AA sobre canvas |
| `--text-faint` | Texto desactivado / placeholder |
| `--text-link` | Enlaces |
| `--bg-canvas` | Fondo de la página |
| `--bg-surface` | Fondo de cards |
| `--bg-surface-2` | Fondo de zonas elevadas (callouts, modales) |
| `--bg-surface-hover` | Hover sobre surface |
| `--bg-active` | Estado activo (nav, selección) |
| `--border-subtle`, `--border-default`, `--border-strong` | Bordes en orden creciente de visibilidad |

### Tipografía

| Variable | Familia | Uso |
|---|---|---|
| `--font-sans` | Inter | Texto general |
| `--font-display` | Bricolage Grotesque | Titulares, eyebrows, números destacados |
| `--font-mono` | JetBrains Mono | IDs, código, métricas tabulares |

### Espaciado

Usar las unidades Tailwind nativas (`px-4`, `gap-3`, etc.). Las clases arbitrarias (`text-[14.5px]`) están permitidas pero úsalas con moderación; el sistema base se basa en múltiplos de 4 px.

---

## Catálogo de iconos

Usar `lucide-react` exclusivamente. Tamaños habituales: `size-3.5`, `size-4`, `size-5`. Stroke por defecto `stroke-[1.75]` para iconos de UI; `stroke-[2]` para los grandes destacados.

```tsx
import { ArrowRight, CheckCircle2 } from 'lucide-react'

<CheckCircle2 className="size-4 stroke-[1.75]" aria-hidden />
```

**Regla:** `aria-hidden` cuando el icono es decorativo (texto adyacente lo explica). `aria-label` cuando el icono es la única información (icon button).

---

## Cuándo crear un componente nuevo

Si te encuentras escribiendo el mismo JSX más de dos veces en sitios distintos, conviértelo en componente y añádelo a este catálogo. Especialmente:

- Bloques visuales repetidos (cards, stats, headers de sección).
- Iconografía recurrente con texto.
- Patrones de formulario.

Si solo se usa una vez, mantenlo inline. La regla "tres usos justifican un componente" es válida aquí.

---

## Cuándo NO crear un componente

- Casos únicos de la home/landing del curso (Hero específico).
- Variaciones puntuales que requerirían demasiadas props.
- Textos largos (van en markdown del paquete del curso, no en componentes).
