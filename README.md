# PV-Learn — Plataforma de cursos de certificación profesional

> Plataforma de e-learning de Plain Vanilla Solutions SL para producir y servir cursos de certificación profesional. El motor es genérico: cada curso es un paquete autocontenido que la plataforma carga y ejecuta sin tocar código.

**Editora** Plain Vanilla Solutions SL · **Estado** En producción del primer curso · **Última actualización** mayo 2026

---

## Qué es

PV-Learn es una plataforma de e-learning con dos componentes:

- **`platform/`** — Motor genérico (Vite + React + TypeScript + Tailwind) que renderiza cualquier paquete de curso conforme a la spec.
- **`cursos/{slug}/`** — Paquetes de curso. Cada paquete es una carpeta autocontenida con `course.yaml`, módulos en markdown, assets y banco de examen.

El motor no sabe nada de ningún curso concreto: lee el manifest del paquete y renderiza. Cualquier curso que cumpla la [spec del paquete](./docs/course-package-spec.md) es ejecutable sin tocar código del motor.

---

## Cursos disponibles

| Slug | Nombre | Idioma | Duración | Estado |
|---|---|---|---|---|
| `agent365-cert` | [Microsoft Agent 365 — Certificación para administradores IT](./cursos/agent365-cert/README.md) | es-ES | 18 h + examen | En producción |

---

## Arquitectura

```
pv-learn/
├── platform/                    Motor genérico (Vite + React + TS)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── ...
│   └── package.json
├── cursos/                      Paquetes de curso
│   └── agent365-cert/
│       ├── course.yaml          Manifest del curso
│       ├── README.md
│       ├── banco-examen.md      Examen final del curso
│       ├── assets/
│       └── modulos/
│           ├── modulo-01-fundamentos/
│           │   ├── module.yaml
│           │   ├── teoria.md
│           │   ├── quiz-practica.md
│           │   ├── laboratorios.md
│           │   ├── recursos.md
│           │   └── assets/
│           └── ...
├── docs/                        Documentación del repo
│   ├── course-package-spec.md   Especificación formal del paquete
│   ├── arquitectura-curso.md    Blueprint del curso Agent 365
│   ├── convenciones-redaccion.md
│   └── ...
└── scripts/
    └── validate-course.py       Validador de paquetes
```

---

## Comandos

### Plataforma

```bash
cd platform/
npm install
npm run dev              # http://localhost:5173 — desarrollo con hot reload
npm run build            # producción → platform/dist/
npm run lint
```

### Validar un paquete de curso

```bash
python3 scripts/validate-course.py agent365-cert
```

Comprueba que el paquete cumple la spec: `course.yaml` y `module.yaml` válidos, archivos referenciados existen, áreas suman 100, OAs únicos, distribución de preguntas cuadra, mínimo de preguntas por quiz, etc.

---

## Producir un curso nuevo

1. Crear `cursos/{slug-curso}/` con el `course.yaml` mínimo (ver [spec](./docs/course-package-spec.md)).
2. Crear `cursos/{slug-curso}/modulos/{slug-modulo}/` por cada módulo con su `module.yaml` y los `.md` de cada sección.
3. Producir el contenido en markdown usando los bloques inline (`::: video`, `::: download`, `::: callout`, etc.) según necesite.
4. Validar con `python3 scripts/validate-course.py {slug-curso}`.
5. La plataforma carga el curso desde la URL `/curso/{slug-curso}/...` (cuando se habilite la ruta multi-curso en el motor).

---

## Roadmap

| Fase | Objetivo | Estado |
|---|---|---|
| F0 | Investigación deep-research del primer curso | Completada |
| F1 | Blueprint del primer curso | Completada |
| F2 | Módulo 01 prototipo de contenido | Completada |
| F2A | Prototipo del shell con M01 | Completada |
| F3 | Producción M02-M05 | Completada |
| F4 | Producción M06-M09 | En curso (M09 pendiente) |
| **FA** | **Reestructuración a plataforma multi-curso + spec del paquete** | **En curso** |
| F5 | Producción M10-M13 | Pendiente |
| F6 | Producción M14-M16 | Pendiente |
| F7 | Producción M17 (examen final) + revisión integral | Pendiente |
| F8 | Backend Supabase + auth + persistencia multi-dispositivo | Pendiente |
| F9 | Panel admin + certificación en PDF + PDFs descargables | Pendiente |

Detalle completo en [`PLAN.md`](./PLAN.md).

---

## Licencia y propiedad

© 2026 Plain Vanilla Solutions SL. Todos los derechos reservados.

El motor de la plataforma es propiedad intelectual de Plain Vanilla Solutions SL. El contenido de cada curso es propiedad intelectual del editor declarado en el `course.yaml` correspondiente.

---

## Contribuir

Convenciones de redacción y reglas anti-IA en [`docs/convenciones-redaccion.md`](./docs/convenciones-redaccion.md). Spec del paquete de curso en [`docs/course-package-spec.md`](./docs/course-package-spec.md). Roadmap detallado en [`PLAN.md`](./PLAN.md). Contexto para sesiones de Claude (Code u otras interfaces) en [`CLAUDE.md`](./CLAUDE.md).
