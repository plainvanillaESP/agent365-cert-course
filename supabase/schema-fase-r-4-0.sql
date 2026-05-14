-- ============================================================================
--  PV-Learn — Schema delta Fase R.4.0 (configuración B2C por curso)
-- ============================================================================
--
--  Tabla de configuración comercial B2C. Una fila por curso del registry.
--  El admin Plain Vanilla la edita desde /admin/cursos.
--
--    - b2c_enabled: si false, el curso NO se vende vía Stripe ni aparece
--      en la landing pública. Solo se distribuye vía B2B (seats).
--
--    - b2c_price_cents: precio en céntimos (199 € = 19900). Usamos
--      enteros para evitar redondeos de float.
--
--    - access_model:
--        'perpetual' → el comprador tiene acceso permanente
--        'duration'  → acceso temporal; access_duration_months indica
--                       cuántos meses dura desde la compra
--
--    - stripe_price_id: el price_id que se crea en Stripe Dashboard
--      cuando se monte R.4.2. Si está vacío, el botón "Comprar" no se
--      activa aunque b2c_enabled=true.
--
--  Aplicar DESPUÉS de los schema previos. Idempotente.
-- ============================================================================

create table if not exists public.course_pricing (
  course_slug             text primary key,
  b2c_enabled             boolean not null default false,
  b2c_price_cents         integer check (b2c_price_cents is null or b2c_price_cents >= 0),
  currency                text not null default 'EUR' check (length(currency) = 3),
  access_model            text not null default 'perpetual'
                                check (access_model in ('perpetual', 'duration')),
  access_duration_months  integer check (access_duration_months is null or access_duration_months > 0),
  stripe_price_id         text,
  notes                   text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  -- Si access_model='duration', access_duration_months es obligatorio.
  -- Si access_model='perpetual', access_duration_months debe ser NULL.
  constraint pricing_duration_consistent check (
    (access_model = 'perpetual' and access_duration_months is null) or
    (access_model = 'duration'  and access_duration_months is not null)
  ),
  -- Si b2c_enabled=true, debe haber precio.
  constraint pricing_b2c_requires_price check (
    not b2c_enabled or (b2c_price_cents is not null and b2c_price_cents > 0)
  )
);

alter table public.course_pricing enable row level security;

-- Platform admin gestiona todas las filas.
drop policy if exists "platform admin manage course pricing" on public.course_pricing;
create policy "platform admin manage course pricing"
  on public.course_pricing
  for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- Lectura pública: cualquiera puede leer el pricing. Es información
-- comercial pública (precio del curso, modelo de acceso). La landing
-- pública la usa sin requerir sesión.
drop policy if exists "anyone reads course pricing" on public.course_pricing;
create policy "anyone reads course pricing"
  on public.course_pricing
  for select
  using (true);


-- Trigger para mantener updated_at al día.
create or replace function public.touch_course_pricing()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_course_pricing_on_update on public.course_pricing;
create trigger touch_course_pricing_on_update
  before update on public.course_pricing
  for each row execute procedure public.touch_course_pricing();
