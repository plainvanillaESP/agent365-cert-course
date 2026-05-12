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
