# Backend integration — Fase 9

Hasta la Fase N.2 toda la plataforma vive en el cliente: `localStorage` para
progreso, sign-in local sin validar credenciales, certificados emitidos
desde el navegador.

Esta guía es la pista que sigue cualquiera (Plain Vanilla o un partner)
que quiera **enchufar un backend real** para conseguir:

- Sincronizar progreso entre dispositivos del mismo alumno.
- Validar identidad con email + magic link (o OAuth).
- Asignar cursos a alumnos (catálogo filtrado).
- Verificar certificados públicamente con URL canónica.
- Dashboard del admin (Fase 10).

Está pensada para dos backends candidatos: **Supabase** (recomendado para
prototipos rápidos) y **Cloudflare Workers + D1** (más control y mejor
coste a escala). El contrato del cliente es el mismo en ambos casos: solo
cambia la implementación de `platform/src/lib/auth.ts` y un nuevo
`lib/api.ts` con los endpoints.

---

## Contrato actual del cliente

Punto único de extensión: `platform/src/lib/auth.ts` exporta cuatro
funciones puras:

```ts
interface User {
  id: string
  email: string
  name: string
  createdAt: number
  assignedCourses: string[]   // slugs de cursos que puede ver
}

loadCurrentUser(): User | null                // devuelve la sesión actual
signIn(email: string, name: string): User     // arranca una sesión
signOut(): void                                // borra la sesión
coursesAssignedTo(user: User): CourseData[]   // filtra el registry
```

Cuando enchufes un backend, **solo tocas estas cuatro funciones**. El
resto del shell (CatalogPage, LoginPage, RequireAuth, todos los hooks
de progreso que se prefijan por slug) sigue funcionando sin tocar nada.

### Storage keys

Las claves del cliente siguen `pv-learn-{slug}-{detail}` (por curso) y
`pv-learn-{detail}` (globales). Cuando llegue el backend, la convención
del API debe replicar esa estructura para que la migración sea limpia:

| Cliente (localStorage) | Backend (API) |
|---|---|
| `pv-learn-{slug}-notes-m{N}` | `GET /courses/{slug}/modules/{N}/notes` |
| `pv-learn-{slug}-quiz-m{N}-history` | `GET /courses/{slug}/modules/{N}/quiz-attempts` |
| `pv-learn-{slug}-exam-history` | `GET /courses/{slug}/exam-attempts` |
| `pv-learn-{slug}-srs-cards` | `GET /courses/{slug}/srs-cards` |
| `pv-learn-{slug}-highlights-m{N}-{section}` | `GET /courses/{slug}/modules/{N}/highlights?section=…` |
| `pv-learn-current-user` | `GET /me` |

El cliente puede operar en modo **offline-first**: escribe siempre en
`localStorage` y un worker sincroniza al backend en background.

---

## Opción A — Supabase

**Ventaja**: arranca en minutos. Auth, Postgres, RLS, storage y Edge
Functions integrados.
**Coste**: tier gratis suficiente para arranque; €25/mes Pro.
**Curva**: baja. SQL + RLS suficiente para Fase 9 entera.

### Setup

1. Crea un proyecto en [supabase.com](https://supabase.com). Anota
   `SUPABASE_URL` y `SUPABASE_ANON_KEY`.

2. Instala el cliente:

   ```bash
   cd platform
   npm install @supabase/supabase-js
   ```

3. Crea `platform/src/lib/supabase.ts`:

   ```ts
   import { createClient } from '@supabase/supabase-js'

   const url = import.meta.env.VITE_SUPABASE_URL
   const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
   if (!url || !anonKey) {
     throw new Error('Falta VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env')
   }
   export const supabase = createClient(url, anonKey)
   ```

4. Crea `platform/.env.local`:

   ```
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJxxx...
   ```

5. Aplica el schema SQL del bloque siguiente en Supabase Studio.

### Schema SQL recomendado

```sql
-- Usuarios. Supabase ya gestiona auth.users; este perfil añade nombre y
-- preferencias visibles del alumno.
create table public.user_profile (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz default now()
);

-- Cursos asignados (catálogo filtrado). Si todos los alumnos ven todos
-- los cursos, basta con NO usar esta tabla y devolver listCourses() en
-- el cliente.
create table public.course_enrollment (
  user_id uuid references auth.users(id) on delete cascade,
  course_slug text not null,
  enrolled_at timestamptz default now(),
  primary key (user_id, course_slug)
);

-- Estado de progreso del alumno. Una fila por (user, course, key).
-- Espejo del localStorage actual. Usamos jsonb para no tener que crear
-- una tabla por tipo de dato (notes, quiz-history, etc.).
create table public.user_progress (
  user_id uuid references auth.users(id) on delete cascade,
  course_slug text not null,
  storage_key text not null,            -- ej. 'notes-m9', 'quiz-m5-history'
  value jsonb not null,
  updated_at timestamptz default now(),
  primary key (user_id, course_slug, storage_key)
);

-- Intentos del examen final, separados del progreso genérico porque los
-- consulta el admin y el endpoint público de verificación.
create table public.exam_attempt (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  started_at timestamptz not null,
  submitted_at timestamptz not null,
  score int not null,
  total int not null,
  passed boolean not null,
  verification_id text unique  -- para URL pública /cert/<id>
);

-- RLS: cada alumno solo ve su propio progreso/intentos. El admin tiene
-- service role key para saltarlo.
alter table public.user_profile enable row level security;
alter table public.course_enrollment enable row level security;
alter table public.user_progress enable row level security;
alter table public.exam_attempt enable row level security;

create policy "own profile" on public.user_profile
  for all using (auth.uid() = id);

create policy "own enrollments" on public.course_enrollment
  for select using (auth.uid() = user_id);

create policy "own progress" on public.user_progress
  for all using (auth.uid() = user_id);

create policy "own attempts" on public.exam_attempt
  for select using (auth.uid() = user_id);

create policy "insert own attempts" on public.exam_attempt
  for insert with check (auth.uid() = user_id);

-- Endpoint público de verificación: cualquier visitante puede leer un
-- intento por verification_id, pero solo los campos no sensibles.
create policy "public verify by id" on public.exam_attempt
  for select using (verification_id is not null);
```

### Refactor de `lib/auth.ts` para Supabase

```ts
import { supabase } from './supabase'
import { listCourses, type CourseData } from './coursesRegistry'

export async function signIn(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  })
  if (error) throw error
}

export async function loadCurrentUser(): Promise<User | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return null
  const { data: enrollments } = await supabase
    .from('course_enrollment')
    .select('course_slug')
    .eq('user_id', session.user.id)
  return {
    id: session.user.id,
    email: session.user.email!,
    name: session.user.user_metadata?.display_name ?? session.user.email!.split('@')[0],
    createdAt: new Date(session.user.created_at).getTime(),
    assignedCourses: (enrollments ?? []).map(e => e.course_slug),
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}
```

Como las firmas cambian de síncronas a async, hay que adaptar
`AuthContext.tsx` para que `signIn` devuelva una `Promise` y
`loadCurrentUser` se llame dentro de un `useEffect` con suspense.

### Verificación pública del certificado

Endpoint público:

```ts
// platform/src/pages/VerifyPage.tsx (nuevo)
export function VerifyPage() {
  const { id } = useParams<{ id: string }>()
  const [attempt, setAttempt] = useState<...>()
  useEffect(() => {
    supabase
      .from('exam_attempt')
      .select('user_id,course_slug,submitted_at,score,total,passed')
      .eq('verification_id', id)
      .single()
      .then(({ data }) => setAttempt(data))
  }, [id])
  // renderiza un certificado de solo lectura
}
```

Ruta `/cert/:id` accesible sin sesión.

---

## Opción B — Cloudflare Workers + D1

**Ventaja**: latencia baja (edge), coste casi nulo a poca escala.
**Coste**: 100k requests/día gratis. ~5€/mes a 10M req.
**Curva**: media. Hay que escribir endpoints; D1 es SQLite con sintaxis
muy parecida a Postgres.

### Setup

1. Crea un Worker:

   ```bash
   npm create cloudflare@latest pv-learn-api
   cd pv-learn-api
   ```

2. Crea una D1 database:

   ```bash
   wrangler d1 create pv-learn
   # → te da el database_id; ponlo en wrangler.toml
   ```

3. Aplica el schema SQL (el bloque de Supabase casi vale; cambia
   `gen_random_uuid()` por SQLite's `lower(hex(randomblob(16)))` y
   `references auth.users` por una tabla `users` propia).

4. Auth: usa **Auth.js Workers Adapter** o
   [Lucia](https://lucia-auth.com/) para magic link. O delega en
   Cloudflare Access para auth corporativa.

5. Endpoints mínimos:

   | Método | Ruta | Descripción |
   |---|---|---|
   | POST | `/auth/magic-link` | Manda email con magic link |
   | GET | `/auth/callback` | Valida token, crea sesión (cookie) |
   | POST | `/auth/signout` | Limpia cookie |
   | GET | `/me` | Devuelve usuario + courses enrolled |
   | GET | `/courses/:slug/progress` | Snapshot completo |
   | PUT | `/courses/:slug/progress/:key` | Update single key |
   | POST | `/courses/:slug/exam-attempts` | Registra intento |
   | GET | `/verify/:id` | Endpoint público de verificación |

6. CORS: el Worker debe aceptar `Origin: https://learn.plainvanilla.ai`
   (o tu dominio).

7. Cliente: crea `platform/src/lib/api.ts` con un helper `fetch` que
   añade `credentials: 'include'` (para mandar la cookie de sesión).

### Migración del cliente

Idéntica a Supabase pero las llamadas son `fetch`s al Worker en vez de
SDK. La firma de `lib/auth.ts` cambia a async; el resto se mantiene.

---

## Roadmap de migración

1. **Backup local**: dump del `localStorage` de cada alumno antes de
   migrar. Helper `exportStorageDump()` ya existe en SettingsPage.
2. **Schema en producción**: aplicar SQL, verificar RLS.
3. **Refactor `lib/auth.ts`** + `AuthContext.tsx` para async.
4. **Refactor hooks `useNotes/useQuiz/useLab/useExam`** para que
   sincronicen con backend (write-through cache: escribe local primero,
   luego POST al API).
5. **Endpoint público `/cert/:id`** + página `VerifyPage`.
6. **Settings → Importar dump**: que el alumno suba el JSON exportado
   antes de migrar; el backend lo procesa y crea las filas en
   `user_progress`.
7. **Dashboard admin (Fase 10)**: panel separado en `/admin/*` con
   tablas paginadas, exportación a CSV, etc.

---

## Decisión recomendada

- **Si vais a comercializar pronto y queréis time-to-market**: Supabase.
  Ya tiene auth, RLS, storage, Edge Functions, dashboard SQL. €25/mes
  Pro cubre una cohorte mediana.

- **Si el volumen va a crecer mucho o queréis evitar vendor lock-in**:
  Cloudflare Workers + D1. Trabajo inicial de 2-3 semanas extra (auth +
  endpoints) pero el coste a escala es 10x menor.

- **Si la audiencia es interna y/o B2B con SSO corporativo**: añadir
  Microsoft Entra ID via OIDC encima del backend elegido. Soportado por
  ambos.

Cuando se tome la decisión, esta guía se convierte en runbook de la
migración.
