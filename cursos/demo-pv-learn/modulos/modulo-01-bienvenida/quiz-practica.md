---
modulo: 1
tipo: quiz-practica
titulo: "Quiz de práctica · Bienvenida a PV-Learn"
duracion_min: 5
area_examen: 1
estado: producido
fase_produccion: 1
ultima_actualizacion: 2026-05-12
---

# Quiz de práctica — Bienvenida a PV-Learn

Tres preguntas rápidas para comprobar que has captado los conceptos del módulo.

::: pregunta
id: Q-01-1
tipo: multiple-choice
modulo: 1
area: 1
dificultad: facil
bloom: Recordar
oa: OA-01.1
enunciado: |
  ¿Qué es PV-Learn?
opciones:
  - id: a
    texto: "Un curso concreto sobre Microsoft Agent 365."
  - id: b
    texto: "Una plataforma de e-learning para servir cualquier paquete de curso que cumpla la spec."
    correcta: true
  - id: c
    texto: "Un editor de markdown estándar."
  - id: d
    texto: "Un servicio de streaming de vídeo."
justificacion: |
  PV-Learn es la plataforma (en `platform/`). El motor no sabe nada de ningún curso concreto; los cursos viven en `cursos/<slug>/` como paquetes autocontenidos.
:::

::: pregunta
id: Q-01-2
tipo: multiple-choice
modulo: 1
area: 1
dificultad: facil
bloom: Recordar
oa: OA-01.2
enunciado: |
  ¿Qué archivo declara los metadatos de un paquete de curso (título, idioma, áreas, módulos)?
opciones:
  - id: a
    texto: "module.yaml"
  - id: b
    texto: "package.json"
  - id: c
    texto: "course.yaml"
    correcta: true
  - id: d
    texto: "manifest.json"
justificacion: |
  `course.yaml` vive en la raíz del paquete (`cursos/<slug>/course.yaml`) y declara todo lo que la plataforma necesita saber del curso. Cada módulo tiene su propio `module.yaml` con metadatos del módulo concreto.
:::

::: pregunta
id: Q-01-3
tipo: multiple-response
modulo: 1
area: 1
dificultad: media
bloom: Comprender
oa: OA-01.1
enunciado: |
  ¿Qué capacidades del alumno trae PV-Learn de serie? (selecciona todas las que apliquen)
opciones:
  - id: a
    texto: "Tracking de progreso por módulo en localStorage."
    correcta: true
  - id: b
    texto: "Repaso espaciado con SM-2 sobre el banco de preguntas."
    correcta: true
  - id: c
    texto: "Modo focus / Pomodoro 25/5."
    correcta: true
  - id: d
    texto: "Generación automática de contenido del curso con IA."
justificacion: |
  PV-Learn trae progreso, SM-2, Pomodoro, notas, highlights, búsqueda y PWA. NO genera contenido del curso: el contenido lo produce el editor en markdown.
:::
