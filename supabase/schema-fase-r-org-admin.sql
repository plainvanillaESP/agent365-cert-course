-- ============================================================================
--  PV-Learn — Schema delta Fase R.3 (admin de organización)
-- ============================================================================
--
--  El admin de una organización (organization_member.role = 'admin') puede:
--
--    - Leer su propia organización (ya cubierto en R.1)
--    - Actualizar datos de su organización (ya cubierto en R.1)
--    - Leer y actualizar los seats de sus subscriptions
--    - Leer los user_profile de los alumnos que ocupan sus seats
--    - Leer los user_progress de esos alumnos (dashboard de progreso)
--    - Leer los exam_attempt de esos alumnos (certificados emitidos)
--
--  No puede crear más subscriptions (eso lo hace Plain Vanilla en R.2) ni
--  añadir/quitar admins (R.3.5 o R.4 según prioridad).
--
--  Aplicar DESPUÉS de schema.sql, schema-fase-r.sql y schema-fase-r-admin.sql.
--  Idempotente.
-- ============================================================================


-- Helper: ¿el caller es admin de la organización indicada?
create or replace function public.is_org_admin(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.organization_member
    where organization_id = p_organization_id
      and user_id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_org_admin(uuid) to authenticated;


-- ════════════════════════════════════════════════════════════════════════
--  organization_seat: el admin de la org gestiona los seats de sus
--  subscriptions (asignar email, revocar, reasignar).
-- ════════════════════════════════════════════════════════════════════════

drop policy if exists "org admins manage seats" on public.organization_seat;
create policy "org admins manage seats" on public.organization_seat
  for all
  using (
    exists (
      select 1 from public.organization_subscription sub
      where sub.id = organization_seat.subscription_id
        and public.is_org_admin(sub.organization_id)
    )
  )
  with check (
    exists (
      select 1 from public.organization_subscription sub
      where sub.id = organization_seat.subscription_id
        and public.is_org_admin(sub.organization_id)
    )
  );


-- ════════════════════════════════════════════════════════════════════════
--  user_profile: el admin de la org puede leer el perfil de los alumnos
--  que ocupan seats de sus subscriptions. Esto permite mostrar email y
--  nombre en el dashboard de seats sin pasar por funciones SQL.
-- ════════════════════════════════════════════════════════════════════════

drop policy if exists "org admins read team profiles" on public.user_profile;
create policy "org admins read team profiles" on public.user_profile
  for select
  using (
    exists (
      select 1
      from public.organization_seat seat
      join public.organization_subscription sub on sub.id = seat.subscription_id
      where seat.user_id = user_profile.id
        and seat.revoked_at is null
        and public.is_org_admin(sub.organization_id)
    )
  );


-- ════════════════════════════════════════════════════════════════════════
--  user_progress: el admin de la org puede leer el progreso de los
--  alumnos que ocupan seats. Indispensable para el dashboard del equipo.
-- ════════════════════════════════════════════════════════════════════════

drop policy if exists "org admins read team progress" on public.user_progress;
create policy "org admins read team progress" on public.user_progress
  for select
  using (
    exists (
      select 1
      from public.organization_seat seat
      join public.organization_subscription sub on sub.id = seat.subscription_id
      where seat.user_id = user_progress.user_id
        and seat.revoked_at is null
        and public.is_org_admin(sub.organization_id)
        and sub.course_slug = user_progress.course_slug
    )
  );


-- ════════════════════════════════════════════════════════════════════════
--  exam_attempt: el admin de la org puede leer intentos del examen de
--  los alumnos de sus subscriptions. Necesario para listar certificados.
-- ════════════════════════════════════════════════════════════════════════

drop policy if exists "org admins read team attempts" on public.exam_attempt;
create policy "org admins read team attempts" on public.exam_attempt
  for select
  using (
    exists (
      select 1
      from public.organization_seat seat
      join public.organization_subscription sub on sub.id = seat.subscription_id
      where seat.user_id = exam_attempt.user_id
        and seat.revoked_at is null
        and public.is_org_admin(sub.organization_id)
        and sub.course_slug = exam_attempt.course_slug
    )
  );
