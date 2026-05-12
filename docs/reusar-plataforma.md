# Reusar la plataforma PV-Learn para otro curso

Este documento describe cómo arrancar un nuevo curso del estilo PV-Learn reutilizando la plataforma que se construyó para Agent 365. El esfuerzo total de un curso nuevo se concentra en el **contenido** (módulos, banco de preguntas, laboratorios); la plataforma React/Vite se reutiliza prácticamente intacta.

---

## Qué se reutiliza vs. qué cambia

| Pieza | ¿Reusable? | Notas |
|---|---|---|
| `platform/` (SPA React + Vite + Tailwind) | Sí, íntegra | Solo cambian rutas y textos institucionales. |
| `platform/src/lib/quiz-parser.ts` | Sí | Parser genérico de quiz markdown. |
| `platform/src/lib/exam.ts` | Sí | Lógica de selección, scoring y constantes parametrizables. |
| `platform/src/components/quiz/*` | Sí | Componentes de pregunta independientes del curso. |
| `platform/src/components/exam/*` | Sí | Lo mismo para el examen. |
| `platform/src/lib/course.ts` | **Adaptar** | Define la lista de módulos del curso. |
| `cursos/<paquete>/` | **Crear de cero** | Contenido del nuevo curso. |
| Logos y colores de marca | Reusable | Plain Vanilla por defecto; sustituibles si distribuye un partner. |
| `scripts/validate-course.py` | Sí | Validador genérico del paquete. |

---

## Paso a paso

### 1. Decidir el nombre del paquete del curso

Por convención: `cursos/<código-corto>-cert/`. Ejemplos posibles:
- `cursos/m365-copilot-cert/`
- `cursos/purview-cert/`
- `cursos/agent-studio-cert/`

A lo largo del documento usamos `<nuevo-curso>` como marcador del nombre.

### 2. Copiar la estructura del paquete Agent 365

```bash
cp -r cursos/agent365-cert cursos/<nuevo-curso>
```

Esto copia todo: `course.yaml`, módulos, `banco-examen.md`, glossary, etc. Lo siguiente es vaciar y rellenar.

### 3. Actualizar `course.yaml`

Editar `cursos/<nuevo-curso>/course.yaml`:

```yaml
slug: <nuevo-curso>
title: Nombre completo del curso
short_title: Nombre corto
description: |
  Descripción del curso, audiencia, prerrequisitos.
audience: IT admins, etc.
duration_estimated_hours: NN
duration_estimated_minutes: NN  # opcional, calculado por validate
modules:
  - id: 1
    slug: introduccion
    title: Introducción a X
    estado: en_diseño   # estados: en_diseño | en_produccion | producido
  - id: 2
    ...
examen_final:
  numero_preguntas: 60
  duracion_minutos: 90
  puntaje_aprobado_pct: 70
  max_intentos: 3
  cooldown_dias: 7
  areas_competencia:
    - id: 1
      titulo: Área de competencia 1
      peso_pct: 15
      preguntas: 9
    ...
```

Los pesos y número de preguntas por área deben sumar 100 % y al `numero_preguntas` total.

### 4. Vaciar módulos y empezar a producir

Cada módulo vive en `cursos/<nuevo-curso>/modulos/modulo-NN-slug/` con cinco archivos:

```
modulo-NN-slug/
  module.yaml         # Metadatos: estado, duración, OAs, glosario
  teoria.md           # Contenido principal
  quiz-practica.md    # Preguntas de práctica (mismo formato que banco-examen.md)
  laboratorios.md     # Ejercicios prácticos
  recursos.md         # Lecturas, enlaces, vídeos
  README.md           # Resumen rápido para reviewers
```

El estado en `module.yaml` (`en_diseño` / `en_produccion` / `producido`) controla la visualización en la sidebar y en la home.

### 5. Vaciar el banco de examen

Editar `cursos/<nuevo-curso>/banco-examen.md`:

- Conservar el frontmatter YAML, ajustar `total_preguntas_objetivo`.
- Borrar las 60 preguntas EX-NN-NNN heredadas de Agent 365.
- Generar progresivamente las preguntas del nuevo curso a medida que se cierran los módulos.

Cada módulo aporta N preguntas al banco según los pesos del área a la que pertenece. La convención de IDs es `EX-MM-NNN` donde MM es el número del módulo del que procede la pregunta.

### 6. Actualizar `platform/src/lib/course.ts`

Este archivo es la lista declarativa de módulos que consume la plataforma. Cambiar:

```ts
export const COURSE_SLUG = '<nuevo-curso>'
export const COURSE_TITLE = 'Nombre completo del curso'
export const COURSE_SHORT = 'Curso X'

export const MODULES: ModuleEntry[] = [
  { id: 1, slug: 'introduccion', title: 'Introducción a X', minutos: 110, estado: 'en_diseño' },
  { id: 2, slug: 'fundamentos', title: 'Fundamentos de Y', minutos: 90, estado: 'en_diseño' },
  ...
  { id: 17, slug: 'examen-final', title: 'Examen de certificación', minutos: 90, estado: 'en_diseño' },
]
```

Las constantes están centralizadas aquí intencionalmente para que cambiar de curso no implique tocar componentes.

### 7. Actualizar `platform/src/lib/exam.ts`

Los textos del banco y las áreas se cargan dinámicamente del `course.yaml` y del `banco-examen.md` del paquete. Aun así, la ruta al banco está hardcodeada como `import.meta.glob` para que Vite la incluya en el bundle:

```ts
const bancoFiles = ... import.meta.glob('../../../cursos/agent365-cert/banco-examen.md', ...)
```

Sustituir la ruta por el nuevo paquete:

```ts
const bancoFiles = ... import.meta.glob('../../../cursos/<nuevo-curso>/banco-examen.md', ...)
```

### 8. Marca: logos y textos institucionales

Por defecto la plataforma carga logos de Plain Vanilla desde `platform/public/`. Si el curso se va a distribuir bajo otra marca (por ejemplo, un partner):

- Sustituir `logotipo-positivo.svg`, `logotipo-negativo.svg`, favicons.
- Buscar referencias a «Plain Vanilla» en `Certificate.tsx`, `CertificateSeal.tsx`, `Header.tsx`, `Footer.tsx` y sustituir.
- Actualizar `index.html` (`<title>` y meta tags).

Si el curso conserva la marca Plain Vanilla pero cambia el título del producto (caso esperado para PV-Learn), basta con cambiar los textos del curso, no los assets de marca.

### 9. Despliegue

El workflow `.github/workflows/deploy-platform.yml` despliega a GitHub Pages bajo `/{repo-name}/`. Si el nuevo curso va a otro repo:

- Cambiar el `basename` del router en `platform/src/App.tsx` (línea hardcoded `/agent365-cert-course`).
- Cambiar la `base` de `vite.config.ts` (igual).
- Ajustar la convención: hacer el slug del repo igual al slug del curso.

Para el modo offline standalone (zip distribuible), `npm run pack:offline` sigue funcionando sin cambios, ya que usa `VITE_OFFLINE=1` con `base = ./`.

---

## Comandos clave del nuevo paquete

Una vez creado el paquete y adaptado `course.yaml`:

```bash
# Validar la estructura
python3 scripts/validate-course.py <nuevo-curso>

# Servir la plataforma en desarrollo
cd platform && npm run dev

# Build de producción
cd platform && npm run build

# Test runtime del examen (requiere banco a tamaño nominal)
cd platform && npm run test:exam

# Empaquetado offline standalone
cd platform && npm run pack:offline
```

---

## Estimación de esfuerzo para un curso nuevo

Tomando como referencia el ciclo de Agent 365:

| Fase | Esfuerzo aproximado |
|---|---|
| Setup inicial (`course.yaml`, scaffold de módulos vacíos) | 1–2 días |
| Diseño curricular (audiencia, OAs, mapa de áreas y pesos) | 3–5 días |
| Producción de 1 módulo (teoría + quiz + lab + glosario) | 1–2 días por módulo |
| Banco de examen (60 preguntas con justificaciones) | 4–6 días |
| QA, validación cruzada, fixes finales | 3–5 días |
| **Total para un curso de 15-17 módulos** | **~6-8 semanas FTE** |

El factor multiplicador frente a producirlo «de cero» es **considerable**: la plataforma, los componentes de pregunta, el motor del examen, el certificado, los scripts de validación y CI están ya hechos. El esfuerzo se concentra al 90 % en contenido.

---

## Punto de partida sugerido

Si vas a arrancar un curso nuevo, abre una rama desde `main`, crea `cursos/<nuevo-curso>/` con el script `cp -r`, vacía contenidos, y haz commits incrementales por módulo (mismo patrón que se siguió con Agent 365: una fase E.X por módulo cerrado). El validador y el test runtime te avisarán en cada commit si la estructura se rompe.
