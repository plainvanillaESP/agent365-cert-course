-- ============================================================================
--  PV-Learn — Schema delta Fase R.2 (admin Plain Vanilla)
-- ============================================================================
--
--  Añade policies de lectura/escritura global para usuarios marcados como
--  `platform_admin` en `auth.users.raw_app_meta_data->>'role'`. Esto
--  permite que Plain Vanilla gestione todas las organizaciones, todos
--  los seats, todos los alumnos y todas las compras desde el panel
--  /admin/* SIN saltarse RLS via service_role (que requeriría un
--  backend server-side).
--
--  Aplicar DESPUÉS de schema.sql (Fase P) y schema-fase-r.sql (Fase R.1).
--  Idempotente.
--
--  Para promover a un usuario a platform_admin:
--
--    update auth.users
--    set raw_app_meta_data =
--      coalesce(raw_app_meta_data, '{}'::jsonb)
--      || '{"role": "platform_admin"}'::jsonb
--    where email = 'mdf@plainvanilla.ai';
--
--  El JWT del próximo refresh ya incluirá el claim. El cliente lo lee
--  como `session.user.app_metadata.role`.
-- ============================================================================


-- Helper inline: ¿el caller es platform_admin?
-- Se evalúa contra el JWT actual (auth.jwt() devuelve los claims).
create or replace function public.is_platform_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'platform_admin';
$$;

grant execute on function public.is_platform_admin() to authenticated, anon;


-- ─────────────────────────── user_profile ─────────────────────────────────

drop policy if exists "platform admin read all profiles" on public.user_profile;
create policy "platform admin read all profiles" on public.user_profile
  for select using (public.is_platform_admin());


-- ─────────────────────────── course_enrollment ────────────────────────────

drop policy if exists "platform admin manage enrollments" on public.course_enrollment;
create policy "platform admin manage enrollments" on public.course_enrollment
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());


-- ─────────────────────────── user_progress ────────────────────────────────

drop policy if exists "platform admin read all progress" on public.user_progress;
create policy "platform admin read all progress" on public.user_progress
  for select using (public.is_platform_admin());


-- ─────────────────────────── exam_attempt ────────────────────────────────

drop policy if exists "platform admin read all attempts" on public.exam_attempt;
create policy "platform admin read all attempts" on public.exam_attempt
  for select using (public.is_platform_admin());


-- ─────────────────────────── organization ─────────────────────────────────

drop policy if exists "platform admin manage organizations" on public.organization;
create policy "platform admin manage organizations" on public.organization
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());


-- ─────────────────────── organization_member ──────────────────────────────

drop policy if exists "platform admin manage members" on public.organization_member;
create policy "platform admin manage members" on public.organization_member
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());


-- ───────────────────── organization_subscription ──────────────────────────

drop policy if exists "platform admin manage subscriptions" on public.organization_subscription;
create policy "platform admin manage subscriptions" on public.organization_subscription
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());


-- ─────────────────────── organization_seat ────────────────────────────────

drop policy if exists "platform admin manage seats" on public.organization_seat;
create policy "platform admin manage seats" on public.organization_seat
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());


-- ───────────────────────── course_purchase ────────────────────────────────

drop policy if exists "platform admin manage purchases" on public.course_purchase;
create policy "platform admin manage purchases" on public.course_purchase
  for all using (public.is_platform_admin()) with check (public.is_platform_admin());


-- ════════════════════════════════════════════════════════════════════════
--  Vista para KPIs del dashboard
--
--  Una vista security-definer que evita N queries desde el cliente.
--  Solo platform_admins pueden leerla.
-- ════════════════════════════════════════════════════════════════════════

create or replace view public.admin_dashboard_kpis
with (security_invoker = true) as
  select
    (select count(*)::int from public.user_profile) as total_users,
    (select count(*)::int from public.course_purchase
      where purchased_at > date_trunc('month', now())) as purchases_this_month,
    (select count(*)::int from public.organization_seat
      where user_id is not null and revoked_at is null) as assigned_seats,
    (select count(*)::int from public.organization_seat
      where revoked_at is null) as total_seats_in_use,
    (select count(*)::int from public.exam_attempt
      where passed = true) as certificates_issued,
    (select count(*)::int from public.organization) as total_organizations;

grant select on public.admin_dashboard_kpis to authenticated;
