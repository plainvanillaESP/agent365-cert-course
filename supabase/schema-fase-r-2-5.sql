-- ============================================================================
--  PV-Learn — Schema delta Fase R.2.5 (completar admin Plain Vanilla)
-- ============================================================================
--
--  Permite que Plain Vanilla añada admins a una organización desde la UI
--  sin SQL manual. Soporta dos casos:
--
--    A) El email YA existe en auth.users (alguien ya registrado en la
--       plataforma, normalmente como alumno por otro canal): el admin
--       Plain Vanilla puede insertar directamente en organization_member.
--
--    B) El email NO existe todavía: se inserta una fila en
--       organization_pending_invitation, se dispara magic link via
--       supabase.auth.signInWithOtp y, cuando el alumno entra por
--       primera vez, el trigger handle_new_user (ampliado en R.1) ahora
--       también procesa las invitations pendientes y crea
--       organization_member automáticamente.
--
--  Aplicar DESPUÉS de los schema previos. Idempotente.
-- ============================================================================


-- ──────────────── organization_pending_invitation ────────────────────────

create table if not exists public.organization_pending_invitation (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organization(id) on delete cascade,
  email            text not null,
  role             text not null check (role in ('admin', 'member')),
  invited_by       uuid references auth.users(id),
  created_at       timestamptz not null default now(),
  expires_at       timestamptz,
  accepted_at      timestamptz
);

create index if not exists pending_invitation_email_idx
  on public.organization_pending_invitation(email)
  where accepted_at is null;

create index if not exists pending_invitation_org_idx
  on public.organization_pending_invitation(organization_id);

-- Un email no puede tener dos invitations pendientes para la misma org.
create unique index if not exists pending_invitation_unique_active
  on public.organization_pending_invitation(organization_id, email)
  where accepted_at is null;

alter table public.organization_pending_invitation enable row level security;

-- Platform admins las gestionan (ya tienen policy global de R.2 vía
-- is_platform_admin(); aquí solo añadimos la específica para esta tabla
-- por simetría con las otras).
drop policy if exists "platform admin manage pending invitations"
  on public.organization_pending_invitation;
create policy "platform admin manage pending invitations"
  on public.organization_pending_invitation
  for all
  using (public.is_platform_admin())
  with check (public.is_platform_admin());

-- Admins de la org pueden ver las invitations pendientes de su org.
drop policy if exists "org admins read pending invitations"
  on public.organization_pending_invitation;
create policy "org admins read pending invitations"
  on public.organization_pending_invitation
  for select
  using (public.is_org_admin(organization_id));


-- ════════════════════════════════════════════════════════════════════════
--  Trigger handle_new_user ampliado
--
--  Se mantienen los dos pasos anteriores (crear user_profile + vincular
--  seats por matching de assigned_email) y se añade un tercero: si hay
--  pending invitations para este email todavía no aceptadas y no
--  caducadas, materializarlas como organization_member real.
-- ════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- 1. Crear o actualizar user_profile
  insert into public.user_profile (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do update set
    email = excluded.email,
    updated_at = now();

  -- 2. Vincular seats pre-asignados (de R.1)
  update public.organization_seat
  set user_id = new.id
  where assigned_email = new.email
    and user_id is null
    and revoked_at is null;

  -- 3. NUEVO en R.2.5: aceptar invitations pendientes a organizaciones.
  --    Insertar organization_member para cada invitation pendiente y
  --    válida, y marcar la invitation como aceptada.
  insert into public.organization_member (organization_id, user_id, role)
  select inv.organization_id, new.id, inv.role
  from public.organization_pending_invitation inv
  where inv.email = new.email
    and inv.accepted_at is null
    and (inv.expires_at is null or inv.expires_at > now())
  on conflict (organization_id, user_id) do nothing;

  update public.organization_pending_invitation
  set accepted_at = now()
  where email = new.email
    and accepted_at is null
    and (expires_at is null or expires_at > now());

  return new;
end;
$$;

-- Re-crear el trigger por si la función cambió.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
