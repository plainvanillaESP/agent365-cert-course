# E-learning web

Esta carpeta contendrá el e-learning HTML interactivo generado a partir del contenido fuente en markdown.

**Estado:** ⏳ Pendiente — se construye en la Fase 8 del plan, una vez todos los módulos estén producidos.

## Estructura prevista

```
web/
├── index.html              # Landing del curso
├── css/
│   ├── theme.css           # Tema Plain Vanilla
│   └── code.css            # Highlighting de código
├── js/
│   ├── nav.js              # Navegación entre módulos
│   ├── quiz.js             # Quizzes interactivos
│   └── exam.js             # Examen final con scoring
├── assets/
│   └── (logo, iconos, etc.)
└── modulos/
    ├── modulo-01.html      # Generado desde modulos/modulo-01-fundamentos/
    └── ...
```

## Generación

```bash
python scripts/build-web.py
```

(El script se desarrollará en la Fase 8.)
