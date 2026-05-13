---
modulo: 1
tipo: teoria
titulo: "Bienvenida a PV-Learn"
duracion_min: 30
area_examen: 1
estado: producido
fase_produccion: 1
ultima_actualizacion: 2026-05-12
---

# Bienvenida a PV-Learn

**Duración estimada:** 30 minutos
**Prerrequisitos:** ninguno

---

## Objetivos de aprendizaje

Al finalizar este módulo, el alumno será capaz de:

- **Explicar** en una frase qué es PV-Learn.
- **Identificar** la estructura de un paquete de curso PV-Learn.

---

## ¿Qué es PV-Learn?

PV-Learn es una **plataforma de e-learning** desarrollada por Plain Vanilla Solutions SL. Está pensada para distribuir cursos técnicos con teoría escrita, laboratorios prácticos, evaluación con preguntas tipo certificación y repaso espaciado.

El motor de la plataforma vive en `platform/` y no sabe nada de ningún curso concreto. Los cursos viven en `cursos/<slug>/` como paquetes autocontenidos: un `course.yaml` con los metadatos y los módulos en carpetas con markdown.

> Esta demo prueba precisamente eso: añadir un paquete nuevo bajo `cursos/` lo expone automáticamente en el catálogo, sin tocar código del shell.

---

## La estructura de un paquete de curso

Un paquete válido contiene, como mínimo:

```
cursos/<slug>/
├── course.yaml           Metadatos del curso (título, idioma, áreas…)
└── modulos/
    └── modulo-XX-<slug>/
        ├── module.yaml   Metadatos del módulo (id, duración, área…)
        └── teoria.md     Contenido en markdown
```

La especificación canónica está en [`docs/course-package-spec.md`](../../../../docs/course-package-spec.md). Cualquier paquete que la cumpla es ejecutable por la plataforma.

---

## ¿Y qué hace PV-Learn por mí?

- **Renderiza el markdown** con tipografía cuidada, modo oscuro, modo lectura inmersivo y soporte para diagramas Mermaid.
- **Trackea progreso** por módulo (lectura, quiz, labs, recursos) en `localStorage`.
- **Evalúa con preguntas tipo certificación** (multiple-choice, multiple-response, drag-and-drop, ordering).
- **Repaso espaciado** con SM-2 sobre el banco de preguntas.
- **Highlights y notas** del alumno por módulo.
- **Pomodoro 25/5** para sesiones de estudio.
- **Funciona offline** tras la primera visita (PWA).

---

## Resumen

Este es un curso minimal cuyo único propósito es **demostrar que la plataforma sirve cualquier paquete válido**. La home te enseñará este curso junto al de Agent 365, y al entrar verás el branding (verde + cian) distinto al de Agent 365 (púrpura + rosa).

Si estás evaluando PV-Learn como plataforma para distribuir tus propios cursos, este paquete es el punto de partida más sencillo: cópialo, renombra el slug, sustituye el contenido y ya tienes tu primer curso.
