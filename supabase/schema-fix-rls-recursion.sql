-- ============================================================================
--  Fix RLS recursión en organization_member
-- ============================================================================
--
--  La policy "members read own org members" hacía una subquery sobre la
--  propia organization_member, lo que disparaba la propia policy en
--  bucle ("infinite recursion detected in policy for relation
--  organization_member"). Esto rompe getSession() en el cliente al
--  cargar el JWT y bloquea el login.
--
--  Reemplazamos por dos policies sin recursión:
--
--    1. "members read own membership" — cada user lee sus propias filas
--       (user_id = auth.uid()). Suficiente para que el cliente sepa de
--       qué orgs es miembro y muestre "Organizaciones que gestionas".
--
--    2. "org admins read members of own org" — usa is_org_admin() que
--       es SECURITY DEFINER y por tanto bypassea RLS, evitando la
--       recursión. Permite que un admin de una org vea los demás
--       miembros de su org.
--
--  Aplicar DESPUÉS de los schema previos.
-- ============================================================================

-- Quitar la policy recursiva
drop policy if exists "members read own org members" on public.organization_member;

-- 1. Cada user lee sus propias filas
drop policy if exists "members read own membership" on public.organization_member;
create policy "members read own membership"
  on public.organization_member
  for select
  using (user_id = auth.uid());

-- 2. Admin de una org puede leer todos los miembros de SU org
--    (is_org_admin es SECURITY DEFINER, bypassea RLS)
drop policy if exists "org admins read members of own org" on public.organization_member;
create policy "org admins read members of own org"
  on public.organization_member
  for select
  using (public.is_org_admin(organization_id));
