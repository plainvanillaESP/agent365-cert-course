# Fase R — Monetización

Documento de arquitectura para la capa comercial de PV-Learn. Cubre **B2C individual**, **B2B empresas con licencias asignables** y los **dos paneles admin** (Plain Vanilla y organización cliente).

Esta fase asume que Fase Q (Vercel + dominio `learn.plainvanilla.ai`) y Fase P (Supabase con schema base) están operativas.

---

## 1. Visión

PV-Learn se vende por dos canales en paralelo:

| Canal | Quién paga | Quién hace el curso | Cómo se cobra |
|---|---|---|---|
| **B2C** | El alumno | El alumno | Stripe Checkout one-time |
| **B2B** | La empresa | Empleados de la empresa | Stripe Subscription con N seats, o factura manual |

Cada canal tiene reglas distintas de control de acceso y un panel admin propio. Ambos comparten el mismo curso, los mismos certificados y el mismo backend.

### Decisiones de diseño centrales

1. **Una sola entidad alumno (`user_profile`)** para los dos canales. Si el mismo email entra primero como B2C y luego una empresa le asigna un seat, son el mismo usuario y conserva su progreso.

2. **El control de acceso a un curso se centraliza** en una función SQL `user_has_access_to_course(user_id, course_slug)` que evalúa cuatro fuentes en orden:
   1. Asignación directa por admin Plain Vanilla (cortesía, demo, beta tester) → `course_enrollment` existente
   2. Compra B2C activa (`course_purchase` con `expires_at IS NULL OR expires_at > now()`)
   3. Seat B2B activo (`organization_seat` con `revoked_at IS NULL` perteneciente a una `organization_subscription` activa)
   4. Sin coincidencias → no acceso

3. **B2B con seats nominales pre-registro**. Cuando una empresa contrata 50 seats, el admin de esa empresa los asigna a 50 emails concretos antes de que esos emails se hayan registrado. El email queda guardado en el seat con `user_id NULL`. Cuando el alumno entra por primera vez con magic link a ese email, se vincula automáticamente el seat con su `user_id`. Esto evita que un seat compartido se reparta entre personas (regla que pediste: "que no todos puedan hacer el mismo").

4. **Sin auto-checkout B2B en el primer release**. La empresa contrata por email/llamada con Plain Vanilla, factura manual o transferencia. Plain Vanilla provisiona la suscripción desde su panel admin. Stripe Subscriptions para B2B se añade en una sub-fase posterior (R.5) cuando el flujo manual demuestre el modelo.

5. **Roles dentro de la organización**: dos roles solamente — `admin` (gestiona seats, ve progreso de su equipo, recibe la factura) y `member` (alumno con acceso al curso). Una org puede tener múltiples admins.

---

## 2. Modelo de datos

Cinco entidades nuevas sobre el schema base de Fase P.

### 2.1 `organization`

Empresa cliente del modelo B2B.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `slug` | text UNIQUE | URL-safe, usado en `/org/<slug>/admin`. Ej `acs`, `urbaser` |
| `name` | text | Nombre comercial visible. Ej "ACS Actividades de Construcción" |
| `legal_name` | text NULL | Razón social completa para factura |
| `tax_id` | text NULL | CIF/NIF/VAT para factura |
| `billing_email` | text NULL | Email donde llegan facturas |
| `contact_email` | text | Punto de contacto operativo (el admin principal) |
| `country` | text NULL | ISO 3166-1 alpha-2 |
| `created_at` | timestamptz | |
| `notes` | text NULL | Campo libre para Plain Vanilla |

### 2.2 `organization_member`

Vínculo usuario ↔ organización con rol.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `organization_id` | uuid FK organization | |
| `user_id` | uuid FK auth.users | |
| `role` | text | `admin` o `member` |
| `joined_at` | timestamptz | |
| UNIQUE | (organization_id, user_id) | Un usuario no puede estar dos veces en la misma org con roles distintos |

### 2.3 `organization_subscription`

Contrato de N seats para un curso concreto. Una organización puede tener varias subscriptions (curso Agent 365 con 50 seats + curso Copilot con 30 seats).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `organization_id` | uuid FK organization | |
| `course_slug` | text | Ej `agent365-cert` |
| `seats_total` | int | Número de seats contratados |
| `started_at` | timestamptz | |
| `expires_at` | timestamptz NULL | NULL = sin caducidad |
| `stripe_subscription_id` | text NULL | Para R.5 cuando llegue Stripe B2B; NULL en facturación manual |
| `created_by` | uuid FK auth.users | Admin Plain Vanilla que provisionó |
| `notes` | text NULL | |

### 2.4 `organization_seat`

Cada seat individual perteneciente a una `organization_subscription`. El admin de la org asigna emails a estos seats.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `subscription_id` | uuid FK organization_subscription | |
| `assigned_email` | text NULL | Email al que se invita. NULL = seat vacante |
| `user_id` | uuid FK auth.users NULL | Se rellena cuando el email se registra y se vincula |
| `assigned_at` | timestamptz NULL | Cuando el admin asignó el email al seat |
| `revoked_at` | timestamptz NULL | Cuando el admin lo liberó. Si != NULL, este seat no da acceso |
| `revoked_reason` | text NULL | Campo libre del admin |

**Invariantes lógicos** (no enforced en SQL pero sí en API):
- Un mismo `assigned_email` no puede tener dos seats activos (con `revoked_at IS NULL`) en la misma subscription
- `seats_total` de la subscription debe ser ≥ número de seats con `revoked_at IS NULL`

### 2.5 `course_purchase`

Compra individual B2C.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid FK auth.users | |
| `course_slug` | text | |
| `stripe_payment_intent_id` | text UNIQUE | Idempotencia: una compra por payment intent |
| `amount_cents` | int | Importe pagado (en centavos para evitar floats) |
| `currency` | text | ISO 4217. Ej `EUR` |
| `purchased_at` | timestamptz | Cuando se procesó el pago |
| `expires_at` | timestamptz NULL | Default NULL = acceso perpetuo. Si la oferta es "1 año de acceso", se rellena |
| `invoice_url` | text NULL | Link a la factura generada por Stripe |

### 2.6 Función `user_has_access_to_course(user_id, course_slug)`

Helper central de control de acceso. Devuelve `boolean`. Evaluación en orden:

```sql
CREATE FUNCTION user_has_access_to_course(p_user uuid, p_course text)
RETURNS boolean AS $$
BEGIN
  -- 1. Enrollment directo (cortesía, demo, admin manual)
  IF EXISTS (
    SELECT 1 FROM course_enrollment
    WHERE user_id = p_user AND course_slug = p_course
      AND (expires_at IS NULL OR expires_at > now())
  ) THEN RETURN true; END IF;

  -- 2. Compra B2C activa
  IF EXISTS (
    SELECT 1 FROM course_purchase
    WHERE user_id = p_user AND course_slug = p_course
      AND (expires_at IS NULL OR expires_at > now())
  ) THEN RETURN true; END IF;

  -- 3. Seat B2B activo
  IF EXISTS (
    SELECT 1 FROM organization_seat seat
    JOIN organization_subscription sub ON sub.id = seat.subscription_id
    WHERE seat.user_id = p_user
      AND seat.revoked_at IS NULL
      AND sub.course_slug = p_course
      AND (sub.expires_at IS NULL OR sub.expires_at > now())
  ) THEN RETURN true; END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

Esta función se llama desde:
- El cliente (`lib/auth.ts::coursesAssignedTo()` la usa para listar los cursos accesibles)
- El backend al cargar un curso protegido (refuerzo server-side)

---

## 3. Flujos

### 3.1 Flujo B2C — compra individual

```
1. Visitante anónimo entra en learn.plainvanilla.ai
2. Aterriza en landing comercial (no en /login)
3. Pulsa "Comprar Agent 365 (199 €)"
4. Stripe Checkout — paga
5. Stripe webhook → POST /api/stripe/webhook
6. Backend crea course_purchase + dispara magic link al email del payer
7. Alumno recibe email → pulsa enlace → entra al curso
```

Detalles:

- Si el email del payer ya existe en `auth.users`, se vincula. Si no, Supabase Auth crea el usuario via magic link.
- El backend es **idempotente** por `stripe_payment_intent_id` UNIQUE — si Stripe reenvía el webhook (cosa que hace), no se duplica la compra.

### 3.2 Flujo B2B — contrato + asignación

**Setup inicial (Plain Vanilla):**

```
1. Cliente contacta a Plain Vanilla por email/llamada
2. Acuerdan precio (ej. 50 seats x curso Agent 365)
3. Plain Vanilla emite factura (fuera de la app, Holded u otro)
4. Cliente paga por transferencia
5. Plain Vanilla entra a su panel admin /admin
6. "Crear organización" → completa datos (name, tax_id, contact_email)
7. "Crear subscription" → curso + seats_total + expires_at opcional
8. Asigna al primer admin de la organización (manda magic link al contact_email)
```

**Operación (admin de la organización):**

```
1. Admin entra a learn.plainvanilla.ai con su magic link
2. Aterriza en /org/<slug>/admin
3. Ve: "Tienes 50 seats en Agent 365. 0 asignados, 50 vacantes"
4. Pulsa "Invitar emails"
5. Pega lista de 30 emails de su equipo (textarea con CSV o líneas separadas)
6. Backend crea 30 organization_seat con assigned_email
7. Magic link enviado automáticamente a cada email
8. Alumnos pulsan enlace, entran, Supabase Auth los crea, lib/auth.ts les vincula el seat
```

**Día a día:**

- Admin ve dashboard de su organización: cuántos alumnos activos, % progreso medio, certificados emitidos
- Admin puede revocar un seat (el alumno deja de tener acceso pero conserva su progreso) y reasignar a otro email
- Plain Vanilla ve el mismo dashboard agregado entre todas las organizaciones desde su admin

---

## 4. Paneles admin

### 4.1 Admin Plain Vanilla — rutas `/admin/*`

Solo accesible por usuarios con `app_metadata.role = 'platform_admin'` en Supabase. La gestión de quién es admin se hace por SQL directo (ALTER user) por seguridad.

| Ruta | Pantalla | Contenido |
|---|---|---|
| `/admin` | Dashboard | KPIs globales: usuarios activos, ventas del mes (B2C), seats asignados (B2B), certificados emitidos, intentos del examen |
| `/admin/organizaciones` | Lista de orgs | Tabla: name, contact, seats totales, seats asignados, % uso, próxima caducidad |
| `/admin/organizaciones/:slug` | Detalle org | Datos fiscales, subscriptions, seats, alumnos, progreso medio, log de actividad |
| `/admin/organizaciones/nueva` | Crear org | Form con name, slug, legal_name, tax_id, billing_email, contact_email, country |
| `/admin/organizaciones/:slug/subscriptions/nueva` | Crear subscription | Form con curso, seats_total, expires_at, notes |
| `/admin/usuarios` | Lista alumnos | Búsqueda + filtro por origen (B2C, B2B-X-org), progreso, último login |
| `/admin/usuarios/:id` | Detalle alumno | Cursos accesibles, progreso por módulo, intentos examen, certificados |
| `/admin/ventas` | Histórico B2C | Tabla de course_purchase con Stripe link, refund desde admin |
| `/admin/certificados` | Certificados emitidos | Tabla de exam_attempt aprobados con link a verificación pública |

### 4.2 Admin de organización — rutas `/org/:slug/admin/*`

Solo accesible por usuarios con `organization_member.role = 'admin'` en esa org concreta.

| Ruta | Pantalla | Contenido |
|---|---|---|
| `/org/:slug/admin` | Dashboard | Seats totales / asignados / vacantes, % progreso medio del equipo, próximos certificados |
| `/org/:slug/admin/seats` | Gestión de seats | Lista con email, estado (vacante/asignado/registrado), progreso, fecha asignación. Acciones: invitar, revocar, reasignar |
| `/org/:slug/admin/seats/invitar` | Invitar emails | Textarea con N emails por línea o CSV. Validación inline. Botón "Invitar a todos" |
| `/org/:slug/admin/progreso` | Progreso del equipo | Tabla agregada: cada alumno con su módulo actual, % completado, último login, certificado (si aprobó) |
| `/org/:slug/admin/certificados` | Certificados del equipo | Tabla de certificados emitidos en su org con link a verificación |
| `/org/:slug/admin/perfil` | Perfil de la organización | Datos fiscales, contact_email (editable). Datos de subscription read-only (los gestiona Plain Vanilla) |

---

## 5. Stripe integration

### 5.1 Productos en Stripe

Configuración manual en el dashboard de Stripe:

| Tipo | Stripe product | Stripe price | Uso |
|---|---|---|---|
| B2C Agent 365 | `Agent 365 IT Admin Certification` | `price_xxx_b2c` | One-time payment, EUR 199 |
| B2B Agent 365 starter | `Agent 365 B2B (10-50 seats)` | `price_xxx_b2b_s` | Subscription monthly, EUR 149/seat/mes |
| B2B Agent 365 enterprise | `Agent 365 B2B (50+ seats)` | `price_xxx_b2b_e` | Custom, contact sales |

Los `stripe_price_id` se guardan en `pricing_tier` para que el frontend los lea sin hardcodearlos.

### 5.2 Webhook

Endpoint en Vercel: `POST /api/stripe/webhook`. Verifica firma Stripe, procesa eventos:

| Evento | Acción |
|---|---|
| `checkout.session.completed` (B2C) | Crear `course_purchase`, enviar magic link |
| `payment_intent.payment_failed` | Notificar a Plain Vanilla por email |
| `customer.subscription.created` (B2B futuro R.5) | Crear `organization_subscription` |
| `customer.subscription.deleted` (B2B futuro R.5) | Marcar `organization_subscription.expires_at = now()` |
| `invoice.payment_failed` | Notificar admin de la org |

---

## 6. Roadmap de sub-fases

| Sub-fase | Alcance | Esfuerzo |
|---|---|---|
| **R.1 Foundation** | Schema SQL ampliado, función `user_has_access_to_course`, tipos TypeScript stub, este documento | 4–6 h |
| **R.2 Admin Plain Vanilla MVP** | Panel `/admin` con dashboard + lista de orgs + CRUD básico + lista de usuarios. Sin ventas todavía | 12–16 h |
| **R.3 Admin org MVP** | Panel `/org/:slug/admin` con seats + invitaciones + progreso del equipo | 10–14 h |
| **R.4 B2C Stripe Checkout** | Landing comercial `/comprar`, Stripe Checkout one-time, webhook, course_purchase | 8–12 h |
| **R.5 B2B Stripe Subscriptions** | Self-service de subscriptions B2B (lo opcional). Si Plain Vanilla prefiere mantener facturación manual, se omite | 12–16 h |
| **R.6 Generador PDF certificado** | Reemplazar `window.print()` por React-PDF o Puppeteer en server | 6–8 h |
| **Total R completo** | | **52–72 h** |

R.1 es lo que cierra este documento. R.2 a R.6 son trabajo posterior, una sub-fase por PR.

---

## 7. Decisiones pendientes (input de Miguel)

Cosas que necesito confirmar antes de R.4 (Stripe). Para R.1, R.2, R.3 no bloquean:

1. **Precio B2C de Agent 365**. ¿Cuánto cobramos? Mercado: cursos similares 99–299 €. Plain Vanilla podría rondar 199 €.
2. **Precio B2B por seat/mes (o anual)**. ¿Cuánto? Industria: 50–150 €/seat/mes para formación técnica enterprise.
3. **¿Modelo perpetuo o caducidad?**
   - B2C: ¿acceso de por vida o solo 1 año?
   - B2B: ¿suscripción mensual/anual o licencia perpetua por compra de seats?
4. **¿Hay descuentos por volumen B2B?** Ej. 10 % desde 25 seats, 20 % desde 50.
5. **Cuenta Stripe**: ¿Plain Vanilla ya tiene Stripe activo o hay que crearlo? Si es UE, ¿usa modo "Tax" para IVA automático?

Estas las dejamos para cuando arranquemos R.4.

---

*Última actualización: 2026-05-13 al cierre de Fase R.1.*
