-- ============================================================================
--  PV-Learn — Schema canónico para Supabase / Postgres 15+
-- ============================================================================
--
--  Aplicar este archivo en Supabase Studio (SQL Editor) o vía
--  `supabase db push` (CLI). Idempotente: las cláusulas IF NOT EXISTS
--  permiten re-aplicarlo sin romper si las tablas ya existen.
--
--  Estructura general:
--
--    user_profile          Datos visibles del alumno (nombre, etc.).
--    course_enrollment     Asignación alumno ↔ curso. Filtra el catálogo.
--    user_progress         Espejo del localStorage actual. Una fila por
--                          (user, course, storage_key).
--    exam_attempt          Intentos del examen final. Se separa de
--                          user_progress para poder consultarlo desde el
--                          panel admin y desde el endpoint público de
--                          verificación del certificado.
--
--  Seguridad: RLS activado en las cuatro tablas. Las policies por defecto
--  restringen lectura/escritura al `auth.uid()` del propio alumno. El
--  endpoint público `/cert/:verification_id` se sirve via una policy
--  SELECT específica que solo expone filas con `verification_id IS NOT NULL`.
--
--  Admin: el panel admin se conecta con la `service_role_key` (saltea RLS)
--  o crea un rol Postgres con permisos elevados sobre estas tablas.
-- ============================================================================


-- ─────────────────────────── user_profile ────────────────────────────────

create table if not exists public.user_profile (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  display_name text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists user_profile_email_idx on public.user_profile(email);

alter table public.user_profile enable row level security;

drop policy if exists "own profile read"  on public.user_profile;
drop policy if exists "own profile write" on public.user_profile;
create policy "own profile read"  on public.user_profile for select using (auth.uid() = id);
create policy "own profile write" on public.user_profile for all    using (auth.uid() = id) with check (auth.uid() = id);

-- Trigger: cuando se crea un user en auth.users, propaga email a user_profile.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profile (id, email, display_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'display_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ─────────────────────────── course_enrollment ────────────────────────────

create table if not exists public.course_enrollment (
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  enrolled_at timestamptz not null default now(),
  expires_at  timestamptz,           -- null = perpetuo
  primary key (user_id, course_slug)
);

create index if not exists course_enrollment_course_idx on public.course_enrollment(course_slug);

alter table public.course_enrollment enable row level security;

drop policy if exists "read own enrollments" on public.course_enrollment;
create policy "read own enrollments"
  on public.course_enrollment
  for select
  using (auth.uid() = user_id);

-- Inserción / actualización solo por admin (service_role saltea RLS).
-- Si en el futuro queremos auto-inscripción a cursos públicos, añadir
-- una policy INSERT condicional aquí.


-- ─────────────────────────── user_progress ────────────────────────────────
--
--  Espejo del localStorage actual. Una fila por (user, course, key).
--  El cliente sigue escribiendo a localStorage como caché offline-first;
--  un sync worker hace UPSERT a esta tabla en background.
--
--  Las keys siguen la convención `{detail}` (sin prefijo `pv-learn-{slug}-`,
--  porque slug ya está en la columna). Ej: 'notes-m9', 'quiz-m5-history'.

create table if not exists public.user_progress (
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  storage_key text not null,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  primary key (user_id, course_slug, storage_key)
);

create index if not exists user_progress_user_course_idx on public.user_progress(user_id, course_slug);

alter table public.user_progress enable row level security;

drop policy if exists "own progress" on public.user_progress;
create policy "own progress"
  on public.user_progress
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ─────────────────────────── exam_attempt ────────────────────────────────

create table if not exists public.exam_attempt (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  course_slug     text not null,
  started_at      timestamptz not null,
  submitted_at    timestamptz not null,
  duration_sec    int not null,
  score           int not null,
  total           int not null,
  pct             int not null,
  passed          boolean not null,
  -- Si passed=true, se rellena al primer save para emisión del certificado.
  -- El alumno lo comparte como URL pública /cert/{verification_id}.
  verification_id text unique,
  -- Resumen del intento para reconstruir el certificado sin necesidad de
  -- guardar todas las respuestas (que pueden ser pesadas).
  metadata        jsonb,
  created_at      timestamptz not null default now()
);

create index if not exists exam_attempt_user_idx       on public.exam_attempt(user_id);
create index if not exists exam_attempt_verif_idx      on public.exam_attempt(verification_id);
create index if not exists exam_attempt_passed_idx     on public.exam_attempt(course_slug, passed) where passed;

alter table public.exam_attempt enable row level security;

drop policy if exists "own attempts read"    on public.exam_attempt;
drop policy if exists "own attempts insert"  on public.exam_attempt;
drop policy if exists "own attempts update"  on public.exam_attempt;
drop policy if exists "public verify by id"  on public.exam_attempt;

-- El alumno ve y escribe sus propios intentos.
create policy "own attempts read"
  on public.exam_attempt
  for select
  using (auth.uid() = user_id);

create policy "own attempts insert"
  on public.exam_attempt
  for insert
  with check (auth.uid() = user_id);

create policy "own attempts update"
  on public.exam_attempt
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Endpoint público de verificación: cualquier visitante (incluso sin
-- sesión) puede leer un intento por `verification_id`. La policy expone
-- todas las columnas; si en el futuro hay datos sensibles que NO deban
-- exponerse públicamente, crear una vista `exam_verification` con solo
-- las columnas necesarias y dar SELECT en esa vista.
create policy "public verify by id"
  on public.exam_attempt
  for select
  to anon, authenticated
  using (verification_id is not null);


-- ─────────────────────────── helper triggers ─────────────────────────────

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profile_touch on public.user_profile;
create trigger user_profile_touch
  before update on public.user_profile
  for each row execute function public.touch_updated_at();

drop trigger if exists user_progress_touch on public.user_progress;
create trigger user_progress_touch
  before update on public.user_progress
  for each row execute function public.touch_updated_at();
