# Supabase — backend de PV-Learn

Esta carpeta contiene el schema canónico (`schema.sql`) y notas operativas
para conectar la plataforma a un proyecto Supabase real. Hasta que las env
vars estén configuradas, el cliente cae al backend local (sin auth real,
storage solo en navegador) — ver `platform/src/lib/supabase.ts`.

## Setup

1. **Crea un proyecto** en [supabase.com](https://supabase.com). Tier gratis
   suficiente para empezar.

2. **Aplica el schema**:
   - Supabase Studio → **SQL Editor** → pega `schema.sql` → Run.
   - O con CLI: `supabase db push schema.sql` desde un repo conectado al proyecto.

3. **Configura el provider de auth**:
   - Studio → **Authentication** → **Providers** → activa **Email**.
   - En **Email templates** → **Magic Link**, personaliza el remitente y
     el texto si quieres.
   - En **URL configuration**, añade tu dominio de producción y
     `http://localhost:5173` como redirect URLs.

4. **Toma las credenciales** del proyecto:
   - Studio → **Settings** → **API** → copia `URL` y `anon public key`.

5. **Configura el cliente**:

   ```bash
   # platform/.env.local
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   ```

6. **Reinicia el dev server**. El shell ahora usa Supabase: `LoginPage`
   pasa a magic link, el usuario se persiste en la sesión de Supabase y
   `coursesAssignedTo` lee de `course_enrollment`.

7. **Asigna cursos a tu usuario**. Tras hacer login una vez para que tu
   fila se cree en `user_profile`, ejecuta en SQL Editor:

   ```sql
   insert into public.course_enrollment (user_id, course_slug)
   select id, 'agent365-cert' from auth.users where email = 'tu@email.com';
   ```

## Estructura del schema

| Tabla | Qué guarda | Quién accede |
|---|---|---|
| `user_profile` | Email + nombre visible del alumno | Solo el propio user (RLS) |
| `course_enrollment` | Asignación user ↔ curso, con `expires_at` opcional | Solo el propio user (READ); admin (WRITE via service_role) |
| `user_progress` | Espejo del localStorage (`{user_id, course_slug, storage_key, value JSONB}`) | Solo el propio user |
| `exam_attempt` | Intentos del examen con `verification_id` único | Propio user + visitantes anónimos por `verification_id` |

## Convención de storage_key en `user_progress`

El cliente ya prefija las keys de localStorage como `pv-learn-{slug}-{detail}`
para per-curso y `pv-learn-{detail}` para globales. La columna
`storage_key` guarda **solo el `{detail}`**, porque `course_slug` ya
está en su propia columna. Ejemplos:

| localStorage del cliente | Fila en `user_progress` |
|---|---|
| `pv-learn-agent365-cert-notes-m9` | `course_slug='agent365-cert', storage_key='notes-m9'` |
| `pv-learn-agent365-cert-quiz-m5-history` | `... storage_key='quiz-m5-history'` |
| `pv-learn-agent365-cert-srs-cards` | `... storage_key='srs-cards'` |
| `pv-learn-current-user` (global) | NO se persiste aquí (es sesión, vive en Supabase Auth) |
| `pv-learn-reading-mode` (global) | NO se persiste aquí (preferencia local del navegador) |

## Endpoint público de verificación

Cuando un alumno aprueba el examen final, el cliente actualiza la fila
del `exam_attempt` correspondiente con un `verification_id` (uuid o
slug corto). Ese id se incluye en el certificado físico.

Cualquier visitante puede acceder a `/cert/{verification_id}` (la
plataforma serve esa ruta como pública) y ver el certificado renderizado.
La policy `public verify by id` de la tabla `exam_attempt` permite la
lectura anónima sólo de filas con `verification_id is not null`.

## Migración del localStorage existente

Cuando un alumno con progreso en `localStorage` se loga por primera vez
con Supabase:

1. `SettingsPage` ya tiene un exportador (`Exportar progreso → JSON`).
   El alumno descarga el dump.
2. Tras login en Supabase, el alumno usa **`Importar progreso → JSON`**
   en la misma página. El cliente recorre el dump y hace UPSERT a
   `user_progress` para todas las keys.
3. La próxima vez que cargue la app desde otro dispositivo, el progreso
   está ahí.

Este flujo está documentado en `docs/backend-integration.md` § "Roadmap
de migración".

## Modelo de costes

Tier gratis de Supabase cubre:

- 50.000 monthly active users
- 500 MB de Postgres
- 50.000 magic-link emails / mes

Para una cohorte de 200 alumnos generando ~20 intentos de examen + 5.000
filas de progreso cada uno, el uso queda muy por debajo del free tier.
Pro tier (€25/mes) sube los límites 100x y añade backups diarios.
