# Agent 365 IT Admin Certification — análisis económico como producto

**Documento interno.** Análisis preliminar del coste de desarrollo, estructura de costes recurrentes y opciones de pricing para Plain Vanilla. No es un plan de negocio; es la base para una decisión: cómo (y a qué precio) llevar este producto al mercado, si se lleva.

---

## 1. Coste de desarrollo

### 1.1 Métricas del proyecto

| Métrica | Valor |
|---|---|
| Periodo de desarrollo | 6 días (2026-05-06 a 2026-05-12) |
| Commits totales | 109 |
| Líneas de contenido (Markdown) | 17.584 |
| Líneas de plataforma (TypeScript/TSX) | 10.114 |
| Módulos producidos | 16 + examen final |
| Preguntas en el banco oficial | 60 |
| Fases del plan (E.1 → F.4) | 14 |
| PRs cerrados | 23 |

### 1.2 Equivalente «mercado tradicional»

Si este mismo producto se hubiese desarrollado con un equipo de consultoría tradicional (sin asistencia de LLM agéntico) los componentes principales:

| Componente | Esfuerzo estimado tradicional | Tarifa típica € | Coste estimado € |
|---|---|---|---|
| Diseño curricular (audiencia, OAs, áreas, pesos) | 5 días sénior | 800 €/día | 4.000 |
| Producción de 16 módulos × 1,5 días/módulo medio | 24 días sénior | 800 €/día | 19.200 |
| Banco de 60 preguntas con justificaciones | 6 días sénior | 800 €/día | 4.800 |
| 16 cuadernos de laboratorios | 8 días sénior | 800 €/día | 6.400 |
| Plataforma React/Vite (con quiz engine, examen cronometrado, certificado, settings, paginación mobile) | 20 días dev sénior | 700 €/día | 14.000 |
| QA, validación cruzada, smoke tests, CI | 5 días | 600 €/día | 3.000 |
| Diseño visual y branding del producto | 4 días | 600 €/día | 2.400 |
| **Total equivalente** | **~72 días-persona** | | **~53.800 €** |

### 1.3 Coste real incurrido por Plain Vanilla

El proyecto se desarrolló en 6 días reales por una persona con asistencia agéntica intensiva. Coste directo:

- **Tiempo de Miguel**: ~6 días (dirección, decisiones de scope, QA visual, validación de contenido) → coste de oportunidad ~5.000–6.000 € a tarifa interna.
- **Coste de inferencia LLM**: orden de magnitud 100–300 € (Claude Sonnet/Opus, herramientas auxiliares).
- **Infraestructura de desarrollo**: GitHub gratis (repo público o privado con plan estándar), Pages gratis, sin servidores adicionales.

**Total efectivo: 5.000–6.500 €**, con un ahorro frente a la opción tradicional de aproximadamente **47.000–49.000 €** (relación ~9×).

> **Caveat metodológico.** La comparación es indicativa. La parte de contenido sí tiene un equivalente claro en el mercado de consultoría (es básicamente cursoware). La parte de plataforma compara contra una agencia que parta de cero; si Plain Vanilla hubiese partido de un LMS comercial (Moodle, LearnWorlds, Thinkific) el coste tradicional habría sido menor, pero el producto resultante también habría sido menos flexible y menos diferenciado visualmente.

### 1.4 Diferencial competitivo del proceso

Más relevante que el ahorro económico bruto es **la velocidad de iteración**. El ciclo «idea → producción → release» se completa en horas, no semanas. Eso permite:

- Ofrecer cursos a medida para clientes con plazos cortos (los clientes corporativos pagan por la rapidez).
- Mantener el catálogo actualizado a la velocidad a la que evoluciona el producto Microsoft (Agent 365, Copilot, Purview cambian rápido).
- Probar formatos y temáticas con bajo riesgo (un curso piloto puede salir en una semana).

Este diferencial es lo que justifica que un partner como SoftwareOne o Insight pague por un curso conjunto, más que el coste absoluto.

---

## 2. Estructura de costes recurrentes

Por cada alumno o licencia vendida, los costes marginales son cercanos a cero:

| Concepto | Coste por alumno | Notas |
|---|---|---|
| Servir plataforma | ~0 € | GitHub Pages gratis hasta 100 GB/mes egress. Un curso de 1 MB × 10.000 alumnos = 10 GB. |
| Almacenar progreso | 0 € | localStorage del cliente. |
| Certificado | 0 € | Generado por el navegador del alumno. |
| Soporte al alumno | Variable | Si se ofrece, ~5-15 €/alumno medio. |
| Actualizaciones | Distribuido entre todos | Coste fijo amortizable. |

**El modelo de negocio escala bien**: el margen bruto sobre la N-ésima venta es prácticamente 100 % menos el coste de soporte si lo hay.

---

## 3. Escenarios de pricing

Tres modelos principales, no excluyentes. La elección depende del posicionamiento estratégico que Plain Vanilla quiera adoptar.

### 3.1 B2B corporate (licenciamiento por organización)

**Audiencia:** empresas con 50+ usuarios M365 que necesitan certificar a su equipo de IT.

**Pricing sugerido:**

| Tamaño organización | Licencias | Precio total | Precio por alumno | Comparable mercado |
|---|---|---|---|---|
| Pequeña | hasta 25 alumnos | 4.500–6.000 € | 180–240 € | — |
| Mediana | hasta 100 alumnos | 12.000–18.000 € | 120–180 € | — |
| Grande | hasta 500 alumnos | 35.000–55.000 € | 70–110 € | Microsoft Learn corporate: ~150–300 €/alumno |

**Justificación:**
- Microsoft Official Training Provider cobra entre 1.500 y 3.000 € por alumno por un MOC oficial de 5 días.
- Coursera Business cobra ~400 €/alumno/año para acceso ilimitado.
- Un curso autocontenido y específico como este, con certificado verificable, encaja entre 70 € (alta escala) y 240 € (organización pequeña).

**Break-even:** cubrir los ~6.000 € de desarrollo necesita **una sola venta corporativa media** o **3 ventas pequeñas**.

### 3.2 B2C individual

**Audiencia:** profesionales IT freelance, consultores, IT generalistas queriendo certificarse en Agent 365.

**Pricing sugerido:**

| Modalidad | Precio | Notas |
|---|---|---|
| Acceso individual + certificado | 149–199 € | Modelo Udemy Premium o Cursos OPEN de fabricantes. |
| Acceso solo lectura (sin certificado) | 49–79 € | Modelo «freemium» como entrada al embudo. |

Este modelo escala peor en valor unitario pero tiene mayor alcance. **Riesgo**: la mayor parte del valor del producto está en el certificado (señal verificable hacia empleadores). Sin un canal de validación de empleadores, el certificado vale menos.

### 3.3 Partner reseller (SoftwareOne, Insight, Crayon)

**Audiencia:** los propios partners de Plain Vanilla, que venden el curso a sus clientes finales como complemento al licenciamiento M365 / Copilot / Agent 365.

**Modelo:** Plain Vanilla licencia el curso al partner por un fee plano + revenue share.

| Componente | Valor |
|---|---|
| Setup fee (white-labelling, integración branding) | 8.000–12.000 € por partner |
| Revenue share por venta del partner a cliente final | 30–50 % de Plain Vanilla, 50–70 % del partner |
| Mantenimiento anual (actualizaciones del contenido a cambios M365) | 12.000–20.000 €/año |

**Justificación estratégica:**
- Plain Vanilla ya tiene relación comercial con SWO e Insight (memoria del proyecto).
- El partner se beneficia de tener un activo de venta cruzada con margen alto.
- El cliente final del partner percibe el curso como parte del paquete M365, lo que mejora la propuesta de valor del partner.
- Plain Vanilla mantiene la propiedad intelectual y puede revenderlo a otros partners en paralelo (no exclusividad).

**Este es probablemente el modelo de mayor margen real**, ya que aprovecha el canal de distribución existente sin coste de adquisición.

---

## 4. Comparables del mercado

| Producto | Posicionamiento | Precio aproximado | Modelo |
|---|---|---|---|
| Microsoft Learn (gratis) | Oficial, autoaprendizaje | 0 € | Freemium + exámenes pagados |
| Microsoft Certified Professional (examen oficial) | Certificación reconocida | 165 € examen | B2C / B2B |
| Microsoft Official Courseware (MOC) | Cursos oficiales con MCT | 1.500–3.000 €/alumno/curso | B2B |
| Udemy Business | Catálogo amplio, calidad mixta | ~400 €/alumno/año | B2B |
| Coursera for Business | Catálogo curated, certificados | ~400 €/alumno/año | B2B |
| LinkedIn Learning | Catálogo amplio, calidad media | ~250 €/alumno/año | B2B/B2C |
| Pluralsight Skills | Catálogo técnico, paths | ~300 €/alumno/año | B2B/B2C |
| Bootcamp técnico in-person | Profundidad y networking | 2.000–8.000 €/persona | B2C |

**Posicionamiento sugerido para Agent 365 IT Admin:** entre Pluralsight y MOC. Más específico que un catálogo amplio, más rápido y más barato que un curso oficial con instructor. El certificado de Plain Vanilla no compite con uno de Microsoft, pero **complementa**: alumnos que aprueban este pueden ir mejor preparados al examen oficial.

---

## 5. Recomendación

A nivel estratégico, la opción que combina **mayor margen, mejor encaje con el modelo actual de Plain Vanilla y menor riesgo comercial** es:

1. **Primario**: el modelo **partner reseller con SoftwareOne**, donde Plain Vanilla cobra setup fee inicial + revenue share recurrente. Permite aprovechar la relación existente, no requiere construir un canal propio de marketing/ventas, y monetiza el activo (curso) a escala.

2. **Secundario**: ventas B2B directas a clientes ya existentes de Plain Vanilla (Urbaser, MasOrange, FAIN, Pernod Ricard…) como add-on a las adopciones M365/Copilot en curso. Precio sugerido inicial: **8.000–15.000 €** según tamaño, posicionado como «certificación interna del equipo IT del cliente».

3. **No prioritario en fase inicial**: B2C individual. Requiere construir un funnel digital propio (landing, payment, comms) que tiene un coste de oportunidad alto frente a las opciones anteriores. Puede activarse después si los modelos B2B se saturan.

### Indicadores de éxito a 12 meses

Conservadores:
- 1 deal partner reseller cerrado: ~10.000 € setup + 15.000 € revenue share esperado = **~25.000 €**
- 3 deals B2B directos a clientes Plain Vanilla a 10.000 € medio = **30.000 €**
- **Total año 1: ~55.000 €** con ~2-3 días/mes de esfuerzo de mantenimiento.

Ambiciosos:
- 2 partners reseller (SWO + Insight): **~50.000 €**
- 8 deals B2B directos: **~80.000 €**
- **Total año 1: ~130.000 €**.

El ROI sobre los ~6.000 € de coste de desarrollo es **alto en cualquier escenario**.

---

## 6. Decisiones pendientes

Para mover este producto al mercado hace falta que Miguel defina:

1. **¿Va a sacarse al mercado?** El curso está completo técnicamente; comercializarlo es una decisión independiente.
2. **¿Qué canal principal?** Partner (SWO/Insight), directo a clientes Plain Vanilla, o B2C.
3. **¿Bajo qué marca?** Plain Vanilla, white-label del partner, o marca compartida.
4. **¿Idiomas?** Hoy solo español. ¿Traducir a inglés (mercado europeo más amplio) y/o francés (FAIN ya pide FR para otros entregables)?
5. **¿Mantenimiento?** Microsoft Agent 365 evoluciona rápido. ¿Quién y con qué cadencia actualiza el contenido?
6. **¿Modelo de venta?** Licencia perpetua, suscripción anual, paquete con consultoría de adopción.

Cada una de estas tiene implicaciones técnicas en la plataforma (i18n, branding configurable, instructor mode) que se pueden implementar cuando la decisión esté tomada, no antes.
