-- ============================================================================
--  PV-Learn — Schema extensión Fase R (monetización B2C + B2B + admin)
-- ============================================================================
--
--  Este archivo extiende el `schema.sql` base (Fase P) con las entidades
--  necesarias para vender el curso por dos canales en paralelo:
--
--    organization               Empresa cliente (B2B)
--    organization_member        Vínculo usuario ↔ org con rol admin/member
--    organization_subscription  Contrato N seats curso X por org
--    organization_seat          Seat individual asignable a un email
--    course_purchase            Compra B2C individual
--
--  Más una función helper `user_has_access_to_course(user_id, course_slug)`
--  que centraliza el control de acceso a partir de tres fuentes:
--  enrollment directo, compra B2C activa y seat B2B activo.
--
--  Aplicar DESPUÉS del schema base. Idempotente con IF NOT EXISTS.
--
--  Documentación completa: docs/fase-r-monetizacion.md
-- ============================================================================


-- ─────────────────────────── organization ────────────────────────────────

create table if not exists public.organization (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,
  legal_name      text,
  tax_id          text,
  billing_email   text,
  contact_email   text not null,
  country         text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists organization_slug_idx on public.organization(slug);

alter table public.organization enable row level security;

-- Las organizaciones solo las gestionan platform_admins (via service_role)
-- y los admins de la propia org las pueden leer. Member normal puede leer
-- el nombre de su org para mostrarlo en la UI.
-- Nota: las policies que dependen de organization_member se definen más
-- abajo, tras crear esa tabla. Postgres valida las referencias de CREATE
-- POLICY inmediatamente, no al final de la transacción.


-- ────────────────────── organization_member ───────────────────────────────

create table if not exists public.organization_member (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organization(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  role             text not null check (role in ('admin', 'member')),
  joined_at        timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_member_user_idx on public.organization_member(user_id);
create index if not exists organization_member_org_idx on public.organization_member(organization_id);

alter table public.organization_member enable row level security;

-- Cualquier member lee las membresías de su org (para que el dashboard
-- del admin org pueda listar al equipo).
drop policy if exists "members read own org members" on public.organization_member;
create policy "members read own org members" on public.organization_member
  for select using (
    exists (
      select 1 from public.organization_member m
      where m.organization_id = organization_member.organization_id
        and m.user_id = auth.uid()
    )
  );


-- Policies sobre organization que dependían de organization_member:
drop policy if exists "members can read own org" on public.organization;
create policy "members can read own org" on public.organization
  for select using (
    exists (
      select 1 from public.organization_member m
      where m.organization_id = organization.id
        and m.user_id = auth.uid()
    )
  );

-- Update solo admins de la org.
drop policy if exists "org admins can update own org" on public.organization;
create policy "org admins can update own org" on public.organization
  for update using (
    exists (
      select 1 from public.organization_member m
      where m.organization_id = organization.id
        and m.user_id = auth.uid()
        and m.role = 'admin'
    )
  );


-- ───────────────────── organization_subscription ──────────────────────────

create table if not exists public.organization_subscription (
  id                       uuid primary key default gen_random_uuid(),
  organization_id          uuid not null references public.organization(id) on delete cascade,
  course_slug              text not null,
  seats_total              int not null check (seats_total > 0),
  started_at               timestamptz not null default now(),
  expires_at               timestamptz,
  stripe_subscription_id   text unique,
  created_by               uuid references auth.users(id),
  notes                    text,
  created_at               timestamptz not null default now()
);

create index if not exists subscription_org_idx on public.organization_subscription(organization_id);
create index if not exists subscription_course_idx on public.organization_subscription(course_slug);

alter table public.organization_subscription enable row level security;

-- Members lectores: admins de la org ven sus subscriptions.
drop policy if exists "org admins read subscriptions" on public.organization_subscription;
create policy "org admins read subscriptions" on public.organization_subscription
  for select using (
    exists (
      select 1 from public.organization_member m
      where m.organization_id = organization_subscription.organization_id
        and m.user_id = auth.uid()
        and m.role = 'admin'
    )
  );


-- ─────────────────────── organization_seat ────────────────────────────────

create table if not exists public.organization_seat (
  id              uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.organization_subscription(id) on delete cascade,
  assigned_email  text,                                  -- NULL = seat vacante
  user_id         uuid references auth.users(id) on delete set null,
  assigned_at     timestamptz,                           -- Cuando se asignó el email
  revoked_at      timestamptz,                           -- NULL = seat activo
  revoked_reason  text,
  created_at      timestamptz not null default now()
);

create index if not exists seat_subscription_idx on public.organization_seat(subscription_id);
create index if not exists seat_user_idx on public.organization_seat(user_id) where user_id is not null;
create index if not exists seat_email_idx on public.organization_seat(assigned_email) where assigned_email is not null;

-- Un mismo email no puede tener dos seats activos en la misma subscription.
-- Lo enforced con unique parcial.
create unique index if not exists seat_unique_email_per_sub
  on public.organization_seat(subscription_id, assigned_email)
  where revoked_at is null and assigned_email is not null;

alter table public.organization_seat enable row level security;

-- El admin de la org ve todos los seats de sus subscriptions.
drop policy if exists "org admins read seats" on public.organization_seat;
create policy "org admins read seats" on public.organization_seat
  for select using (
    exists (
      select 1 from public.organization_subscription sub
      join public.organization_member m on m.organization_id = sub.organization_id
      where sub.id = organization_seat.subscription_id
        and m.user_id = auth.uid()
        and m.role = 'admin'
    )
  );

-- El usuario propietario de un seat lo puede ver (para que la UI le diga
-- "tu acceso viene de la org X").
drop policy if exists "seat owner read" on public.organization_seat;
create policy "seat owner read" on public.organization_seat
  for select using (user_id = auth.uid());


-- ───────────────────────── course_purchase ────────────────────────────────

create table if not exists public.course_purchase (
  id                         uuid primary key default gen_random_uuid(),
  user_id                    uuid not null references auth.users(id) on delete cascade,
  course_slug                text not null,
  stripe_payment_intent_id   text unique not null,
  amount_cents               int not null,
  currency                   text not null,
  purchased_at               timestamptz not null default now(),
  expires_at                 timestamptz,
  invoice_url                text
);

create index if not exists purchase_user_idx on public.course_purchase(user_id);
create index if not exists purchase_course_idx on public.course_purchase(course_slug);

alter table public.course_purchase enable row level security;

-- El alumno solo lee sus propias compras.
drop policy if exists "own purchases read" on public.course_purchase;
create policy "own purchases read" on public.course_purchase
  for select using (user_id = auth.uid());


-- ════════════════════════════════════════════════════════════════════════
--  Función central de control de acceso
-- ════════════════════════════════════════════════════════════════════════
--
--  Devuelve true si el usuario tiene acceso al curso por al menos una de
--  estas tres vías:
--
--    1. course_enrollment directo (cortesía, demo, admin manual)
--    2. course_purchase B2C activa
--    3. organization_seat B2B activo (con subscription activa)
--
--  Marcada SECURITY DEFINER porque consulta tablas con RLS y necesitamos
--  que la respuesta sea consistente independientemente del rol del caller.
--  STABLE porque no escribe.
-- ════════════════════════════════════════════════════════════════════════

create or replace function public.user_has_access_to_course(
  p_user uuid,
  p_course text
) returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  -- 1. Enrollment directo (cortesía / demo / asignación manual del admin)
  if exists (
    select 1 from public.course_enrollment
    where user_id = p_user and course_slug = p_course
      and (expires_at is null or expires_at > now())
  ) then return true; end if;

  -- 2. Compra B2C activa
  if exists (
    select 1 from public.course_purchase
    where user_id = p_user and course_slug = p_course
      and (expires_at is null or expires_at > now())
  ) then return true; end if;

  -- 3. Seat B2B activo dentro de subscription activa
  if exists (
    select 1
    from public.organization_seat seat
    join public.organization_subscription sub on sub.id = seat.subscription_id
    where seat.user_id = p_user
      and seat.revoked_at is null
      and sub.course_slug = p_course
      and (sub.expires_at is null or sub.expires_at > now())
  ) then return true; end if;

  return false;
end;
$$;

-- Concedemos EXECUTE al rol authenticated (cualquier usuario logueado
-- puede consultarla sobre sí mismo a través del frontend).
grant execute on function public.user_has_access_to_course(uuid, text) to authenticated;


-- ════════════════════════════════════════════════════════════════════════
--  Trigger: cuando un seat se asigna a un email que aún no existe en
--  auth.users, esperamos a que el usuario se registre con magic link
--  para vincular automáticamente seat.user_id = auth.users.id.
--  Esto se hace en el trigger on_auth_user_created del schema base
--  (handle_new_user), que ahora amplía su lógica para mirar también
--  organization_seat.
-- ════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 1. Crear o actualizar user_profile (comportamiento original).
  insert into public.user_profile (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  -- 2. NUEVO en Fase R: si hay seats con este email y user_id IS NULL,
  --    vincularlos al user_id recién creado. Esto es lo que materializa
  --    el "seat asignado pre-registro": el admin de la org invita
  --    alumno@empresa.com → seat con assigned_email = 'alumno@empresa.com'
  --    user_id = NULL. Cuando alumno@empresa.com hace login con magic
  --    link, este trigger le vincula el seat automáticamente.
  update public.organization_seat
  set user_id = new.id
  where assigned_email = new.email
    and user_id is null
    and revoked_at is null;

  return new;
end;
$$;

-- Re-crear el trigger por si la función cambió.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ════════════════════════════════════════════════════════════════════════
--  Notas operativas
-- ════════════════════════════════════════════════════════════════════════
--
--  - Para marcar a un usuario como platform_admin (admin de Plain
--    Vanilla con acceso a /admin/*), añadir el role en JWT custom claims:
--
--      update auth.users
--      set raw_app_meta_data = raw_app_meta_data || '{"role": "platform_admin"}'::jsonb
--      where email = 'mdf@plainvanilla.ai';
--
--    Esto se lee en el frontend desde supabase.auth.getSession() y se
--    refuerza server-side en cada endpoint /admin/* via RLS o middleware.
--
--  - Para dar de alta una organización + admin inicial desde SQL (el
--    flujo de "Plain Vanilla provisiona el contrato"):
--
--      insert into organization (slug, name, contact_email)
--        values ('acs', 'ACS Actividades de Construcción', 'admin-it@acs.es')
--        returning id;  -- supongamos org_id
--
--      insert into organization_subscription
--        (organization_id, course_slug, seats_total, expires_at)
--        values (org_id, 'agent365-cert', 50, '2027-01-01');
--
--      -- Crear los 50 seats vacantes:
--      insert into organization_seat (subscription_id)
--      select subscription_id, generate_series(1, 50);
--
--      -- Asignar el primer admin: mandar magic link a admin-it@acs.es
--      -- (vía Supabase Auth) y, cuando se registre, añadirlo a
--      -- organization_member con role='admin'.
-- ════════════════════════════════════════════════════════════════════════
