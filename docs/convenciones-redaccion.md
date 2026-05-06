# Convenciones de redacción

> Reglas de tono, estilo y formato para todo el contenido del curso. Diseñadas para que cualquier persona (o IA) que produzca contenido obtenga un resultado consistente con el resto del curso.

---

## Tono

- **Profesional pero directo.** El alumno es un administrador IT con experiencia. No condescender.
- **Sin paja introductoria.** Ir al concepto.
- **Segunda persona impersonal** ("se configura", "se aplica") en explicaciones; **segunda persona directa** ("abre el admin center") en laboratorios.
- **Honestidad técnica.** Si algo es complicado, decirlo. Si una documentación oficial es ambigua, indicarlo.

### Ejemplos

❌ Mal:
> En este módulo aprenderemos juntos sobre el fascinante mundo de los agentes de IA en Microsoft 365, una tecnología revolucionaria que está cambiando la forma en que las empresas trabajan...

✅ Bien:
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
| 🟢 GA | General availability — disponible para producción |
| 🟡 Preview | Preview pública — disponible para todos los tenants pero con caveats |
| 🔴 Frontier | Frontier preview — solo para tenants en el programa preview |
| ⚠️ Deprecated | Capacidad retirada o en proceso de retirada |

Ejemplo de uso:
```markdown
La página **Agent Map** 🟢 GA permite visualizar todos los agentes registrados en el tenant, incluidos los que provienen de plataformas externas vía registry sync 🟡 Preview.
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
- **Pie de imagen:** siempre describir la captura debajo en texto, para accesibilidad y para que el alumno entienda el contexto sin verla.

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

## Cosas que evitar

- ❌ "Como vimos antes..." — el alumno puede saltar módulos. Usar referencias explícitas: "(ver Módulo 03 § Licenciamiento)".
- ❌ Frases vacías como "es importante destacar que" o "cabe mencionar".
- ❌ Emojis decorativos. Solo los badges de estado y los iconos en tablas funcionales (✅/❌).
- ❌ Traducir nombres propios de productos.
- ❌ Generalizaciones sin fuente: "según los expertos", "típicamente", "muchas empresas".
- ❌ Capturas pixeladas o de versiones antiguas del admin center.
