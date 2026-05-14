/**
 * API del panel admin de Plain Vanilla (Fase R.2).
 *
 * Despacha entre backend local (datos en localStorage para que Miguel
 * pueda probar sin Supabase configurado) y backend Supabase (queries
 * reales contra las tablas autorizadas por RLS policies de
 * `platform_admin`).
 *
 * El frontend siempre llama a estas funciones; no toca Supabase
 * directamente desde las pantallas admin.
 */

import { getSupabase, isSupabaseEnabled } from './supabase'
import type {
  Organization,
  OrganizationSubscription,
  OrganizationSeat,
} from './billing'

// ════════════════════════════════════════════════════════════════════
//  Tipos del dashboard
// ════════════════════════════════════════════════════════════════════

export interface DashboardKPIs {
  totalUsers: number
  totalOrganizations: number
  totalSeatsInUse: number
  assignedSeats: number
  purchasesThisMonth: number
  certificatesIssued: number
}

// ════════════════════════════════════════════════════════════════════
//  Mock local store
// ════════════════════════════════════════════════════════════════════
//
//  El backend local guarda en localStorage para que el panel sea
//  funcional sin Supabase. Las orgs y subscriptions creadas
//  persisten entre recargas en el mismo navegador.
// ════════════════════════════════════════════════════════════════════

const LOCAL_ORGS_KEY = 'pv-learn-admin-organizations'
const LOCAL_SUBS_KEY = 'pv-learn-admin-subscriptions'
const LOCAL_SEATS_KEY = 'pv-learn-admin-seats'

function localRead<T>(key: string): T[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function localWrite<T>(key: string, items: T[]): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    /* quota / serialization issue */
  }
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Traduce errores de Supabase/Postgres a mensajes humanos en español.
 * Los códigos vienen de https://www.postgresql.org/docs/current/errcodes-appendix.html
 * y el formato de mensaje que devuelve PostgREST.
 *
 * Si no reconocemos el error, devolvemos su `message` directamente como
 * último recurso.
 */
export function humanizeSupabaseError(
  err: { code?: string; message?: string; details?: string } | null | undefined,
): string {
  if (!err) return 'Error desconocido'
  const msg = err.message ?? ''
  const code = err.code

  // Códigos Postgres estándar
  if (code === '23505') {
    // unique_violation. El mensaje suele incluir el nombre del constraint.
    if (msg.includes('slug')) return 'Ya existe una organización con ese slug. Elige otro.'
    if (msg.includes('email')) return 'Este email ya está registrado.'
    if (msg.includes('assigned_email')) return 'Este email ya tiene un seat asignado en esta organización.'
    return 'Este registro ya existe.'
  }
  if (code === '23503') {
    // foreign_key_violation
    return 'No se puede completar la acción porque depende de un registro que no existe.'
  }
  if (code === '23502') {
    // not_null_violation
    return 'Falta rellenar un campo obligatorio.'
  }
  if (code === '23514') {
    // check_violation
    if (msg.includes('role')) return 'El rol indicado no es válido.'
    return 'El valor introducido no cumple las reglas de validación.'
  }
  if (code === '42501') {
    // insufficient_privilege (RLS bloqueó la operación)
    return 'No tienes permisos para realizar esta acción.'
  }
  if (code === 'PGRST116') {
    // PostgREST: no rows returned cuando .single() esperaba 1
    return 'El elemento solicitado no existe.'
  }
  if (code === 'PGRST204') {
    return 'No se ha podido encontrar el recurso.'
  }

  // Errores comunes de magic link / auth
  if (msg.toLowerCase().includes('rate limit')) {
    return 'Demasiados intentos. Espera unos minutos antes de volver a probar.'
  }
  if (msg.toLowerCase().includes('invalid email')) {
    return 'El email no es válido.'
  }
  if (msg.toLowerCase().includes('network')) {
    return 'Error de conexión. Comprueba tu red.'
  }

  // Caída a mensaje original como último recurso
  return msg || 'Error desconocido'
}

// ════════════════════════════════════════════════════════════════════
//  Mapeo snake_case ↔ camelCase entre Postgres y el frontend
// ════════════════════════════════════════════════════════════════════

interface OrganizationRow {
  id: string
  slug: string
  name: string
  legal_name: string | null
  tax_id: string | null
  billing_email: string | null
  contact_email: string
  country: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

function fromOrgRow(r: OrganizationRow): Organization {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    legalName: r.legal_name,
    taxId: r.tax_id,
    billingEmail: r.billing_email,
    contactEmail: r.contact_email,
    country: r.country,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

interface SubscriptionRow {
  id: string
  organization_id: string
  course_slug: string
  seats_total: number
  started_at: string
  expires_at: string | null
  stripe_subscription_id: string | null
  created_by: string | null
  notes: string | null
  created_at: string
}

function fromSubRow(r: SubscriptionRow): OrganizationSubscription {
  return {
    id: r.id,
    organizationId: r.organization_id,
    courseSlug: r.course_slug,
    seatsTotal: r.seats_total,
    startedAt: r.started_at,
    expiresAt: r.expires_at,
    stripeSubscriptionId: r.stripe_subscription_id,
    createdBy: r.created_by,
    notes: r.notes,
    createdAt: r.created_at,
  }
}

interface SeatRow {
  id: string
  subscription_id: string
  assigned_email: string | null
  user_id: string | null
  assigned_at: string | null
  revoked_at: string | null
  revoked_reason: string | null
  created_at: string
}

function fromSeatRow(r: SeatRow): OrganizationSeat {
  return {
    id: r.id,
    subscriptionId: r.subscription_id,
    assignedEmail: r.assigned_email,
    userId: r.user_id,
    assignedAt: r.assigned_at,
    revokedAt: r.revoked_at,
    revokedReason: r.revoked_reason,
    createdAt: r.created_at,
  }
}

// ════════════════════════════════════════════════════════════════════
//  Dashboard KPIs
// ════════════════════════════════════════════════════════════════════

export async function getDashboardKPIs(): Promise<DashboardKPIs> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('admin_dashboard_kpis')
      .select('*')
      .single()
    if (error || !data) {
      // En el primer despliegue, antes de aplicar el schema admin la
      // vista no existe; devolvemos zeros en vez de fallar.
      return {
        totalUsers: 0,
        totalOrganizations: 0,
        totalSeatsInUse: 0,
        assignedSeats: 0,
        purchasesThisMonth: 0,
        certificatesIssued: 0,
      }
    }
    const row = data as {
      total_users: number
      total_organizations: number
      total_seats_in_use: number
      assigned_seats: number
      purchases_this_month: number
      certificates_issued: number
    }
    return {
      totalUsers: row.total_users,
      totalOrganizations: row.total_organizations,
      totalSeatsInUse: row.total_seats_in_use,
      assignedSeats: row.assigned_seats,
      purchasesThisMonth: row.purchases_this_month,
      certificatesIssued: row.certificates_issued,
    }
  }
  // Local: calculamos sobre lo que haya en localStorage.
  const orgs = localRead<Organization>(LOCAL_ORGS_KEY)
  const seats = localRead<OrganizationSeat>(LOCAL_SEATS_KEY)
  const active = seats.filter(s => s.revokedAt == null)
  return {
    totalUsers: 1, // El propio Miguel
    totalOrganizations: orgs.length,
    totalSeatsInUse: active.length,
    assignedSeats: active.filter(s => s.userId != null).length,
    purchasesThisMonth: 0,
    certificatesIssued: 0,
  }
}

// ════════════════════════════════════════════════════════════════════
//  Organizations
// ════════════════════════════════════════════════════════════════════

export interface OrganizationInput {
  slug: string
  name: string
  legalName?: string | null
  taxId?: string | null
  billingEmail?: string | null
  contactEmail: string
  country?: string | null
  notes?: string | null
}

export async function listOrganizations(): Promise<Organization[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(humanizeSupabaseError(error))
    return (data ?? []).map(r => fromOrgRow(r as OrganizationRow))
  }
  return localRead<Organization>(LOCAL_ORGS_KEY)
}

export async function getOrganization(slug: string): Promise<Organization | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization')
      .select('*')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw new Error(humanizeSupabaseError(error))
    return data ? fromOrgRow(data as OrganizationRow) : null
  }
  const orgs = localRead<Organization>(LOCAL_ORGS_KEY)
  return orgs.find(o => o.slug === slug) ?? null
}

export async function createOrganization(input: OrganizationInput): Promise<Organization> {
  // Validación común
  const slug = input.slug.trim().toLowerCase()
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error('El slug solo puede contener letras minúsculas, números y guiones')
  }
  if (!input.name.trim()) throw new Error('El nombre es obligatorio')
  if (!input.contactEmail.trim()) throw new Error('El email de contacto es obligatorio')

  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization')
      .insert({
        slug,
        name: input.name.trim(),
        legal_name: input.legalName ?? null,
        tax_id: input.taxId ?? null,
        billing_email: input.billingEmail ?? null,
        contact_email: input.contactEmail.trim(),
        country: input.country ?? null,
        notes: input.notes ?? null,
      })
      .select()
      .single()
    if (error) throw new Error(humanizeSupabaseError(error))
    const created = fromOrgRow(data as OrganizationRow)
    // Auto-añadir al caller (platform_admin) como admin de la org
    // recién creada. Esto evita el "no puedo entrar al panel de la
    // org que acabo de crear" — el admin Plain Vanilla puede usar
    // /org/:slug/admin sin ser miembro explícito.
    try {
      const { data: sess } = await supabase.auth.getSession()
      const callerId = sess.session?.user?.id
      if (callerId) {
        await supabase.from('organization_member').insert({
          organization_id: created.id,
          user_id: callerId,
          role: 'admin',
        })
      }
    } catch {
      /* no bloquear la creación de la org si esto falla */
    }
    return created
  }
  // Local: chequeo de unicidad de slug y persistencia en localStorage
  const orgs = localRead<Organization>(LOCAL_ORGS_KEY)
  if (orgs.some(o => o.slug === slug)) {
    throw new Error(`Ya existe una organización con el slug "${slug}"`)
  }
  const now = new Date().toISOString()
  const created: Organization = {
    id: uid(),
    slug,
    name: input.name.trim(),
    legalName: input.legalName ?? null,
    taxId: input.taxId ?? null,
    billingEmail: input.billingEmail ?? null,
    contactEmail: input.contactEmail.trim(),
    country: input.country ?? null,
    notes: input.notes ?? null,
    createdAt: now,
    updatedAt: now,
  }
  localWrite(LOCAL_ORGS_KEY, [created, ...orgs])
  return created
}

/**
 * Actualiza datos de una organización. El slug es inmutable (rompería
 * URLs y bookmarks); todo lo demás es editable.
 */
export interface OrganizationUpdate {
  name?: string
  legalName?: string | null
  taxId?: string | null
  billingEmail?: string | null
  contactEmail?: string
  country?: string | null
  notes?: string | null
}

export async function updateOrganization(
  organizationId: string,
  patch: OrganizationUpdate,
): Promise<Organization> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const dbPatch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (patch.name !== undefined) dbPatch.name = patch.name.trim()
    if (patch.legalName !== undefined) dbPatch.legal_name = patch.legalName
    if (patch.taxId !== undefined) dbPatch.tax_id = patch.taxId
    if (patch.billingEmail !== undefined) dbPatch.billing_email = patch.billingEmail
    if (patch.contactEmail !== undefined) dbPatch.contact_email = patch.contactEmail.trim()
    if (patch.country !== undefined) dbPatch.country = patch.country
    if (patch.notes !== undefined) dbPatch.notes = patch.notes
    const { data, error } = await supabase
      .from('organization')
      .update(dbPatch)
      .eq('id', organizationId)
      .select()
      .single()
    if (error) throw new Error(humanizeSupabaseError(error))
    return fromOrgRow(data as OrganizationRow)
  }
  const orgs = localRead<Organization>(LOCAL_ORGS_KEY)
  const idx = orgs.findIndex(o => o.id === organizationId)
  if (idx < 0) throw new Error('Organización no encontrada')
  const now = new Date().toISOString()
  const updated: Organization = {
    ...orgs[idx],
    ...(patch.name !== undefined ? { name: patch.name.trim() } : {}),
    ...(patch.legalName !== undefined ? { legalName: patch.legalName } : {}),
    ...(patch.taxId !== undefined ? { taxId: patch.taxId } : {}),
    ...(patch.billingEmail !== undefined ? { billingEmail: patch.billingEmail } : {}),
    ...(patch.contactEmail !== undefined ? { contactEmail: patch.contactEmail.trim() } : {}),
    ...(patch.country !== undefined ? { country: patch.country } : {}),
    ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    updatedAt: now,
  }
  orgs[idx] = updated
  localWrite(LOCAL_ORGS_KEY, orgs)
  return updated
}

/**
 * Elimina una organización en cascada. Postgres CASCADE se encarga de
 * los registros dependientes (subscriptions → seats, members,
 * pending_invitations). El user_profile de los miembros se conserva,
 * solo se rompe el vínculo con la org.
 *
 * Acción destructiva; la UI debe confirmar.
 */
export async function deleteOrganization(organizationId: string): Promise<void> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { error } = await supabase
      .from('organization')
      .delete()
      .eq('id', organizationId)
    if (error) throw new Error(humanizeSupabaseError(error))
    return
  }
  // Local: borrar en cascada manualmente.
  const orgs = localRead<Organization>(LOCAL_ORGS_KEY)
  localWrite(LOCAL_ORGS_KEY, orgs.filter(o => o.id !== organizationId))
  const subs = localRead<OrganizationSubscription>(LOCAL_SUBS_KEY)
  const ownedSubIds = new Set(
    subs.filter(s => s.organizationId === organizationId).map(s => s.id),
  )
  localWrite(LOCAL_SUBS_KEY, subs.filter(s => s.organizationId !== organizationId))
  const seats = localRead<OrganizationSeat>(LOCAL_SEATS_KEY)
  localWrite(
    LOCAL_SEATS_KEY,
    seats.filter(s => !ownedSubIds.has(s.subscriptionId)),
  )
  const members = localRead<OrgMemberRow>(LOCAL_MEMBERS_KEY)
  localWrite(
    LOCAL_MEMBERS_KEY,
    members.filter(m => m.organizationId !== organizationId),
  )
  const pending = localRead<PendingInvitation>(LOCAL_PENDING_INVITATIONS_KEY)
  localWrite(
    LOCAL_PENDING_INVITATIONS_KEY,
    pending.filter(p => p.organizationId !== organizationId),
  )
}

// ════════════════════════════════════════════════════════════════════
//  Subscriptions
// ════════════════════════════════════════════════════════════════════

export interface SubscriptionInput {
  organizationId: string
  courseSlug: string
  seatsTotal: number
  expiresAt?: string | null
  notes?: string | null
}

export async function listSubscriptionsForOrganization(
  organizationId: string,
): Promise<OrganizationSubscription[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization_subscription')
      .select('*')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(humanizeSupabaseError(error))
    return (data ?? []).map(r => fromSubRow(r as SubscriptionRow))
  }
  return localRead<OrganizationSubscription>(LOCAL_SUBS_KEY).filter(
    s => s.organizationId === organizationId,
  )
}

export async function createSubscription(
  input: SubscriptionInput,
): Promise<OrganizationSubscription> {
  if (input.seatsTotal <= 0) throw new Error('seats_total debe ser mayor que 0')
  if (!input.courseSlug.trim()) throw new Error('El curso es obligatorio')

  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization_subscription')
      .insert({
        organization_id: input.organizationId,
        course_slug: input.courseSlug.trim(),
        seats_total: input.seatsTotal,
        expires_at: input.expiresAt ?? null,
        notes: input.notes ?? null,
      })
      .select()
      .single()
    if (error) throw new Error(humanizeSupabaseError(error))
    const sub = fromSubRow(data as SubscriptionRow)
    // Crear los seats vacantes a la vez (mismo número que seats_total)
    const seatRows = Array.from({ length: input.seatsTotal }, () => ({
      subscription_id: sub.id,
    }))
    const seatRes = await supabase.from('organization_seat').insert(seatRows)
    if (seatRes.error) throw new Error(seatRes.error.message)
    return sub
  }
  // Local
  const now = new Date().toISOString()
  const sub: OrganizationSubscription = {
    id: uid(),
    organizationId: input.organizationId,
    courseSlug: input.courseSlug.trim(),
    seatsTotal: input.seatsTotal,
    startedAt: now,
    expiresAt: input.expiresAt ?? null,
    stripeSubscriptionId: null,
    createdBy: null,
    notes: input.notes ?? null,
    createdAt: now,
  }
  const subs = localRead<OrganizationSubscription>(LOCAL_SUBS_KEY)
  localWrite(LOCAL_SUBS_KEY, [sub, ...subs])
  // Crear seats vacantes
  const seats = localRead<OrganizationSeat>(LOCAL_SEATS_KEY)
  const newSeats: OrganizationSeat[] = Array.from({ length: input.seatsTotal }, () => ({
    id: uid(),
    subscriptionId: sub.id,
    assignedEmail: null,
    userId: null,
    assignedAt: null,
    revokedAt: null,
    revokedReason: null,
    createdAt: now,
  }))
  localWrite(LOCAL_SEATS_KEY, [...newSeats, ...seats])
  return sub
}

// ════════════════════════════════════════════════════════════════════
//  Seats (lectura desde el panel admin)
// ════════════════════════════════════════════════════════════════════

export async function listSeatsForOrganization(
  organizationId: string,
): Promise<OrganizationSeat[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    // Join a subscriptions para filtrar por org
    const { data, error } = await supabase
      .from('organization_seat')
      .select('*, organization_subscription!inner(organization_id)')
      .eq('organization_subscription.organization_id', organizationId)
      .order('created_at', { ascending: false })
    if (error) throw new Error(humanizeSupabaseError(error))
    return (data ?? []).map(r => fromSeatRow(r as SeatRow))
  }
  // Local: necesitamos cruzar seats con subs
  const subs = localRead<OrganizationSubscription>(LOCAL_SUBS_KEY).filter(
    s => s.organizationId === organizationId,
  )
  const subIds = new Set(subs.map(s => s.id))
  return localRead<OrganizationSeat>(LOCAL_SEATS_KEY).filter(s =>
    subIds.has(s.subscriptionId),
  )
}


// ════════════════════════════════════════════════════════════════════
//  Admin de organización (Fase R.3)
// ════════════════════════════════════════════════════════════════════
//
//  Funciones que consume el panel /org/:slug/admin. A diferencia de las
//  anteriores (admin Plain Vanilla, que ven todo), estas operan sobre
//  UNA organización concreta y RLS garantiza que solo el admin de esa
//  org pueda leerlas/escribirlas.
// ════════════════════════════════════════════════════════════════════

import type { OrganizationRole } from './billing'

/**
 * Membresías del usuario actual donde es admin. Para mostrar el switcher
 * en el header del alumno cuando es admin de al menos una org.
 */
export async function getOrganizationsWhereUserIsAdmin(
  userId: string,
): Promise<Organization[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization_member')
      .select('role, organization!inner(*)')
      .eq('user_id', userId)
      .eq('role', 'admin')
    if (error) throw new Error(humanizeSupabaseError(error))
    const out: Organization[] = []
    for (const r of data ?? []) {
      const orgRaw = (r as { organization: OrganizationRow | OrganizationRow[] | null })
        .organization
      const org = Array.isArray(orgRaw) ? orgRaw[0] : orgRaw
      if (org) out.push(fromOrgRow(org))
    }
    return out
  }
  // En backend local, el user es admin de todas las orgs creadas en
  // esta sesión (modo dev simplificado para probar el flujo).
  return localRead<Organization>(LOCAL_ORGS_KEY)
}

/**
 * KPIs específicos de una organización. Estructura paralela a
 * DashboardKPIs pero con conteos scoped por org.
 */
export interface OrgKPIs {
  seatsTotal: number
  seatsAssigned: number
  seatsActive: number
  seatsVacant: number
  certificatesIssued: number
}

export async function getOrganizationKPIs(organizationId: string): Promise<OrgKPIs> {
  // Cargamos seats y subs de la org y derivamos. Es suficiente para
  // el MVP; si fuera lento se factoriza en una vista SQL como hicimos
  // con admin_dashboard_kpis.
  const seats = await listSeatsForOrganization(organizationId)
  const active = seats.filter(s => s.revokedAt == null)
  const assigned = active.filter(s => s.assignedEmail != null)
  const subs = await listAllSubscriptionsForOrganization(organizationId)
  const seatsTotal = subs.reduce((acc, s) => acc + s.seatsTotal, 0)
  // Certificados emitidos: lo dejamos en 0 hasta cargar exam_attempt
  // del equipo en R.3.5. Para MVP es suficiente con los KPIs de seats.
  let certificatesIssued = 0
  if (isSupabaseEnabled()) {
    try {
      const userIds = active.map(s => s.userId).filter((id): id is string => id != null)
      if (userIds.length > 0) {
        const supabase = getSupabase()!
        const { data } = await supabase
          .from('exam_attempt')
          .select('id')
          .in('user_id', userIds)
          .eq('passed', true)
        certificatesIssued = data?.length ?? 0
      }
    } catch {
      /* swallow: no bloquear el dashboard si exam_attempt falla */
    }
  }
  return {
    seatsTotal,
    seatsAssigned: assigned.length,
    seatsActive: active.length,
    seatsVacant: active.length - assigned.length,
    certificatesIssued,
  }
}

/** Helper interno: todas las subs de una org sin filtrar por admin. */
async function listAllSubscriptionsForOrganization(
  organizationId: string,
): Promise<OrganizationSubscription[]> {
  return listSubscriptionsForOrganization(organizationId)
}

/**
 * Asigna emails a seats vacantes de la organización. La lógica es:
 *
 *   1. Carga seats vacantes (assigned_email IS NULL y revoked_at IS NULL)
 *      agrupados por subscription.
 *   2. Para cada email: comprueba si ya tiene seat activo en alguna
 *      subscription de la org → si sí, lo marca como "alreadyAssigned"
 *      y no crea nada.
 *   3. Para los nuevos: ocupa el primer seat vacante disponible.
 *      Si no hay suficientes seats vacantes → error con cuántos faltan.
 *   4. Si el backend es Supabase, dispara magic link a cada email
 *      mediante supabase.auth.signInWithOtp para que el alumno entre.
 *
 * Idempotente por email.
 */
export interface AssignEmailsInput {
  organizationId: string
  /** Curso al que invitar (debe coincidir con una subscription existente) */
  courseSlug: string
  emails: string[]
}

export interface AssignEmailsResult {
  invited: string[]
  alreadyAssigned: string[]
  remaining: number
}

export async function assignEmailsToOrganization(
  input: AssignEmailsInput,
): Promise<AssignEmailsResult> {
  // Normalizar y deduplicar
  const clean = Array.from(
    new Set(
      input.emails
        .map(e => e.trim().toLowerCase())
        .filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
    ),
  )
  if (clean.length === 0) {
    return { invited: [], alreadyAssigned: [], remaining: 0 }
  }

  // Cargar subscriptions de esa org filtradas por courseSlug
  const allSubs = await listSubscriptionsForOrganization(input.organizationId)
  const subs = allSubs.filter(s => s.courseSlug === input.courseSlug)
  if (subs.length === 0) {
    throw new Error(
      `La organización no tiene ninguna subscription activa del curso "${input.courseSlug}"`,
    )
  }
  const subIds = new Set(subs.map(s => s.id))

  // Seats actuales de esas subs
  const allSeats = await listSeatsForOrganization(input.organizationId)
  const relevantSeats = allSeats.filter(s => subIds.has(s.subscriptionId))
  const activeSeats = relevantSeats.filter(s => s.revokedAt == null)
  const alreadyByEmail = new Set(
    activeSeats
      .map(s => s.assignedEmail?.toLowerCase())
      .filter((e): e is string => Boolean(e)),
  )

  const vacant = activeSeats.filter(
    s => s.assignedEmail == null && s.userId == null,
  )

  const alreadyAssigned: string[] = []
  const toInvite: string[] = []
  for (const email of clean) {
    if (alreadyByEmail.has(email)) {
      alreadyAssigned.push(email)
    } else {
      toInvite.push(email)
    }
  }

  if (toInvite.length > vacant.length) {
    throw new Error(
      `Solo hay ${vacant.length} seat${vacant.length === 1 ? '' : 's'} vacante${vacant.length === 1 ? '' : 's'} y has pedido invitar ${toInvite.length} email${toInvite.length === 1 ? '' : 's'} nuevos. Contrata más seats o invita menos.`,
    )
  }

  const now = new Date().toISOString()

  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    // Ocupar seats en cascada
    for (let i = 0; i < toInvite.length; i++) {
      const seat = vacant[i]
      const email = toInvite[i]
      const { error } = await supabase
        .from('organization_seat')
        .update({ assigned_email: email, assigned_at: now })
        .eq('id', seat.id)
      if (error) throw new Error(humanizeSupabaseError(error))
      // Dispara magic link al email para que entre. Si el usuario ya
      // existe en auth.users, recibirá un email de "log in". Si no
      // existe, recibirá un email de signup; al pulsarlo el trigger
      // handle_new_user lo creará y vinculará automáticamente al seat
      // por matching de assigned_email.
      try {
        await supabase.auth.signInWithOtp({ email })
      } catch {
        /* swallow: si rate-limit o similar, el admin puede reinvitar */
      }
    }
  } else {
    // Local: actualizar seats en localStorage
    const allLocalSeats = localRead<OrganizationSeat>(LOCAL_SEATS_KEY)
    const vacantIds = new Set(vacant.slice(0, toInvite.length).map(s => s.id))
    const updated = allLocalSeats.map(s => {
      if (!vacantIds.has(s.id)) return s
      const email = toInvite.shift()!
      return { ...s, assignedEmail: email, assignedAt: now }
    })
    localWrite(LOCAL_SEATS_KEY, updated)
  }

  return {
    invited: clean.filter(e => !alreadyAssigned.includes(e)),
    alreadyAssigned,
    remaining: vacant.length - (clean.length - alreadyAssigned.length),
  }
}

/**
 * Revoca un seat. El alumno deja de tener acceso a partir de ahora
 * pero conserva su progreso (user_progress se mantiene). El seat queda
 * libre para reasignar a otro email.
 */
export async function revokeSeatById(
  seatId: string,
  reason?: string,
): Promise<OrganizationSeat> {
  const now = new Date().toISOString()
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization_seat')
      .update({ revoked_at: now, revoked_reason: reason ?? null })
      .eq('id', seatId)
      .select()
      .single()
    if (error) throw new Error(humanizeSupabaseError(error))
    return fromSeatRow(data as SeatRow)
  }
  const seats = localRead<OrganizationSeat>(LOCAL_SEATS_KEY)
  let target: OrganizationSeat | null = null
  const updated = seats.map(s => {
    if (s.id !== seatId) return s
    const next = { ...s, revokedAt: now, revokedReason: reason ?? null }
    target = next
    return next
  })
  localWrite(LOCAL_SEATS_KEY, updated)
  if (!target) throw new Error('Seat no encontrado')
  return target
}

/**
 * Membresía del usuario en una organización. `null` = no es member.
 */
export async function getUserRoleInOrganization(
  userId: string,
  organizationId: string,
): Promise<OrganizationRole | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization_member')
      .select('role')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .maybeSingle()
    if (error) throw new Error(humanizeSupabaseError(error))
    return data ? ((data as { role: OrganizationRole }).role) : null
  }
  // Local: si el user creó la org, lo asumimos admin (modo dev)
  const orgs = localRead<Organization>(LOCAL_ORGS_KEY)
  return orgs.some(o => o.id === organizationId) ? 'admin' : null
}

/**
 * Datos del equipo de una org: por cada seat con user_id, el progreso
 * agregado en sus cursos. Para el dashboard "Progreso del equipo".
 */
export interface TeamMemberProgress {
  seatId: string
  email: string | null
  userId: string | null
  /** % completado del curso (0-100). 0 si no hay user_id todavía. */
  progressPct: number
  /** Última actividad. ISO string o null. */
  lastActivity: string | null
  /** Aprobó el examen final */
  passedExam: boolean
}

export async function getTeamProgressForOrganization(
  organizationId: string,
  courseSlug: string,
): Promise<TeamMemberProgress[]> {
  const seats = await listSeatsForOrganization(organizationId)
  // Filtrar por curso de la subscription
  const subs = await listSubscriptionsForOrganization(organizationId)
  const subsOfCourse = new Set(
    subs.filter(s => s.courseSlug === courseSlug).map(s => s.id),
  )
  const relevant = seats.filter(
    s => subsOfCourse.has(s.subscriptionId) && s.revokedAt == null,
  )

  if (!isSupabaseEnabled()) {
    // Local: sin user_progress real, devolvemos 0 % para todos
    return relevant.map(s => ({
      seatId: s.id,
      email: s.assignedEmail,
      userId: s.userId,
      progressPct: 0,
      lastActivity: null,
      passedExam: false,
    }))
  }

  const userIds = relevant.map(s => s.userId).filter((id): id is string => id != null)
  if (userIds.length === 0) {
    return relevant.map(s => ({
      seatId: s.id,
      email: s.assignedEmail,
      userId: s.userId,
      progressPct: 0,
      lastActivity: null,
      passedExam: false,
    }))
  }

  const supabase = getSupabase()!
  // Cargamos user_progress y exam_attempt para los users del equipo
  const [progressRes, attemptRes] = await Promise.all([
    supabase
      .from('user_progress')
      .select('user_id, completed, updated_at')
      .in('user_id', userIds)
      .eq('course_slug', courseSlug),
    supabase
      .from('exam_attempt')
      .select('user_id, passed, submitted_at')
      .in('user_id', userIds)
      .eq('course_slug', courseSlug),
  ])

  // Calcular % por user
  // user_progress tiene una fila por (user, course, storage_key).
  // "completed" suele estar en una key específica; aquí simplificamos:
  // contamos cuántas keys hay con completed=true vs total de keys del user.
  const progressByUser = new Map<string, { completed: number; total: number; latest: string | null }>()
  for (const row of progressRes.data ?? []) {
    const r = row as { user_id: string; completed: boolean | null; updated_at: string }
    const cur = progressByUser.get(r.user_id) ?? { completed: 0, total: 0, latest: null }
    cur.total += 1
    if (r.completed) cur.completed += 1
    if (!cur.latest || r.updated_at > cur.latest) cur.latest = r.updated_at
    progressByUser.set(r.user_id, cur)
  }

  const passedByUser = new Set<string>()
  for (const row of attemptRes.data ?? []) {
    const r = row as { user_id: string; passed: boolean | null }
    if (r.passed) passedByUser.add(r.user_id)
  }

  return relevant.map(s => {
    const p = s.userId ? progressByUser.get(s.userId) : null
    return {
      seatId: s.id,
      email: s.assignedEmail,
      userId: s.userId,
      progressPct: p && p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0,
      lastActivity: p?.latest ?? null,
      passedExam: s.userId ? passedByUser.has(s.userId) : false,
    }
  })
}


// ════════════════════════════════════════════════════════════════════
//  R.2.5 — Gestión de miembros y listados globales
// ════════════════════════════════════════════════════════════════════

const LOCAL_MEMBERS_KEY = 'pv-learn-admin-org-members'
const LOCAL_PENDING_INVITATIONS_KEY = 'pv-learn-admin-pending-invitations'

interface MemberRow {
  id: string
  organization_id: string
  user_id: string
  role: string
  joined_at: string
}

interface PendingInvitationRow {
  id: string
  organization_id: string
  email: string
  role: string
  invited_by: string | null
  created_at: string
  expires_at: string | null
  accepted_at: string | null
}

/** Datos enriquecidos para el panel admin (member + email del user). */
export interface OrgMemberRow {
  id: string
  organizationId: string
  userId: string
  email: string | null
  displayName: string | null
  role: OrganizationRole
  joinedAt: string
}

export interface PendingInvitation {
  id: string
  organizationId: string
  email: string
  role: OrganizationRole
  createdAt: string
  expiresAt: string | null
}

/**
 * Lista members de una organización con email y display_name del user
 * cargados via join.
 */
export async function listMembersForOrganization(
  organizationId: string,
): Promise<OrgMemberRow[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization_member')
      .select('id, organization_id, user_id, role, joined_at, user_profile!inner(email, display_name)')
      .eq('organization_id', organizationId)
    if (error) throw new Error(humanizeSupabaseError(error))
    const out: OrgMemberRow[] = []
    for (const row of data ?? []) {
      const r = row as MemberRow & {
        user_profile:
          | { email: string | null; display_name: string | null }
          | Array<{ email: string | null; display_name: string | null }>
          | null
      }
      const profRaw = r.user_profile
      const prof = Array.isArray(profRaw) ? profRaw[0] ?? null : profRaw
      out.push({
        id: r.id,
        organizationId: r.organization_id,
        userId: r.user_id,
        email: prof?.email ?? null,
        displayName: prof?.display_name ?? null,
        role: r.role as OrganizationRole,
        joinedAt: r.joined_at,
      })
    }
    return out
  }
  // Local: cargar de localStorage. No tenemos user_profile real;
  // mostramos la información que tenemos.
  const members = localRead<OrgMemberRow>(LOCAL_MEMBERS_KEY).filter(
    m => m.organizationId === organizationId,
  )
  return members
}

/**
 * Lista invitations pendientes (no aceptadas, no caducadas) de una org.
 */
export async function listPendingInvitations(
  organizationId: string,
): Promise<PendingInvitation[]> {
  const now = Date.now()
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('organization_pending_invitation')
      .select('*')
      .eq('organization_id', organizationId)
      .is('accepted_at', null)
      .order('created_at', { ascending: false })
    if (error) throw new Error(humanizeSupabaseError(error))
    return (data ?? [])
      .map(row => {
        const r = row as PendingInvitationRow
        return {
          id: r.id,
          organizationId: r.organization_id,
          email: r.email,
          role: r.role as OrganizationRole,
          createdAt: r.created_at,
          expiresAt: r.expires_at,
        }
      })
      .filter(p => p.expiresAt == null || new Date(p.expiresAt).getTime() > now)
  }
  const all = localRead<PendingInvitation>(LOCAL_PENDING_INVITATIONS_KEY)
  return all
    .filter(p => p.organizationId === organizationId)
    .filter(p => p.expiresAt == null || new Date(p.expiresAt).getTime() > now)
}

export interface AddOrgMemberInput {
  organizationId: string
  email: string
  role: OrganizationRole
}

export interface AddOrgMemberResult {
  kind: 'added' | 'invited'
  email: string
}

/**
 * Añade un member a una organización.
 *
 *   - Si el email ya existe en auth.users (user_profile): inserta
 *     organization_member directamente. Devuelve {kind:'added'}.
 *   - Si no existe: inserta organization_pending_invitation y dispara
 *     magic link. Cuando el alumno entre, el trigger handle_new_user
 *     materializará el organization_member. Devuelve {kind:'invited'}.
 */
export async function addOrganizationMember(
  input: AddOrgMemberInput,
): Promise<AddOrgMemberResult> {
  const email = input.email.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Email no válido')
  }

  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    // 1) ¿Existe ya el user?
    const { data: prof, error: profErr } = await supabase
      .from('user_profile')
      .select('id')
      .eq('email', email)
      .maybeSingle()
    if (profErr) throw new Error(humanizeSupabaseError(profErr))

    if (prof) {
      // Existe: insert organization_member directamente
      const userId = (prof as { id: string }).id
      const { error } = await supabase.from('organization_member').insert({
        organization_id: input.organizationId,
        user_id: userId,
        role: input.role,
      })
      if (error) {
        // Si ya era member, error de unique → tratamos como éxito silencioso
        if (error.code === '23505') {
          return { kind: 'added', email }
        }
        throw new Error(humanizeSupabaseError(error))
      }
      return { kind: 'added', email }
    }

    // No existe: pending invitation + magic link
    const { error } = await supabase
      .from('organization_pending_invitation')
      .insert({
        organization_id: input.organizationId,
        email,
        role: input.role,
      })
    if (error) {
      if (error.code === '23505') {
        // Ya había una invitation pendiente → re-disparamos el magic link
      } else {
        throw new Error(humanizeSupabaseError(error))
      }
    }
    try {
      await supabase.auth.signInWithOtp({ email })
    } catch {
      /* swallow: rate-limit u otro; el admin puede reinvitar */
    }
    return { kind: 'invited', email }
  }

  // Backend local: simplemente persistimos en localStorage. Como no
  // tenemos auth.users real, asumimos que es invitación pendiente y
  // ya está.
  const now = new Date().toISOString()
  const existing = localRead<PendingInvitation>(LOCAL_PENDING_INVITATIONS_KEY)
  if (
    existing.some(
      p =>
        p.organizationId === input.organizationId &&
        p.email.toLowerCase() === email,
    )
  ) {
    return { kind: 'invited', email }
  }
  const newInv: PendingInvitation = {
    id: uid(),
    organizationId: input.organizationId,
    email,
    role: input.role,
    createdAt: now,
    expiresAt: null,
  }
  localWrite(LOCAL_PENDING_INVITATIONS_KEY, [newInv, ...existing])

  // En local también guardamos un member ficticio para que la UI los
  // vea reflejados como ya añadidos (el flujo dev no tiene Auth real).
  const members = localRead<OrgMemberRow>(LOCAL_MEMBERS_KEY)
  const member: OrgMemberRow = {
    id: uid(),
    organizationId: input.organizationId,
    userId: uid(),
    email,
    displayName: email.split('@')[0],
    role: input.role,
    joinedAt: now,
  }
  localWrite(LOCAL_MEMBERS_KEY, [member, ...members])
  return { kind: 'invited', email }
}

/**
 * Elimina un member de una organización. Solo borra organization_member;
 * el user_profile y su progreso se conservan.
 */
export async function removeOrganizationMember(memberId: string): Promise<void> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { error } = await supabase
      .from('organization_member')
      .delete()
      .eq('id', memberId)
    if (error) throw new Error(humanizeSupabaseError(error))
    return
  }
  const members = localRead<OrgMemberRow>(LOCAL_MEMBERS_KEY)
  localWrite(
    LOCAL_MEMBERS_KEY,
    members.filter(m => m.id !== memberId),
  )
}

// ════════════════════════════════════════════════════════════════════
//  Lista global de usuarios (panel Plain Vanilla)
// ════════════════════════════════════════════════════════════════════

export interface UserListItem {
  id: string
  email: string
  displayName: string | null
  createdAt: string
  /** Cantidad de cursos a los que tiene acceso (cualquier vía) */
  accessibleCoursesCount: number
}

/**
 * Lista usuarios de la plataforma para el panel admin.
 *
 * MVP: devuelve user_profile + número de cursos accesibles calculado
 * por unión de course_enrollment + course_purchase activas +
 * organization_seat activos.
 */
export async function listAllUsers(options?: {
  search?: string
  limit?: number
}): Promise<UserListItem[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    let q = supabase
      .from('user_profile')
      .select('id, email, display_name, created_at')
      .order('created_at', { ascending: false })
      .limit(options?.limit ?? 100)
    if (options?.search?.trim()) {
      q = q.ilike('email', `%${options.search.trim()}%`)
    }
    const { data, error } = await q
    if (error) throw new Error(humanizeSupabaseError(error))
    const profiles = (data ?? []) as Array<{
      id: string
      email: string
      display_name: string | null
      created_at: string
    }>
    if (profiles.length === 0) return []

    // Cargar las 3 fuentes en paralelo para los users devueltos.
    const userIds = profiles.map(p => p.id)
    const [enrol, purch, seats] = await Promise.all([
      supabase
        .from('course_enrollment')
        .select('user_id, course_slug, expires_at')
        .in('user_id', userIds),
      supabase
        .from('course_purchase')
        .select('user_id, course_slug, expires_at')
        .in('user_id', userIds),
      supabase
        .from('organization_seat')
        .select('user_id, revoked_at, organization_subscription!inner(course_slug, expires_at)')
        .in('user_id', userIds)
        .is('revoked_at', null),
    ])
    const now = Date.now()
    const countByUser = new Map<string, Set<string>>()
    const add = (uid: string, slug: string) => {
      let set = countByUser.get(uid)
      if (!set) {
        set = new Set()
        countByUser.set(uid, set)
      }
      set.add(slug)
    }
    for (const r of (enrol.data ?? []) as Array<{
      user_id: string
      course_slug: string
      expires_at: string | null
    }>) {
      if (!r.expires_at || new Date(r.expires_at).getTime() > now) {
        add(r.user_id, r.course_slug)
      }
    }
    for (const r of (purch.data ?? []) as Array<{
      user_id: string
      course_slug: string
      expires_at: string | null
    }>) {
      if (!r.expires_at || new Date(r.expires_at).getTime() > now) {
        add(r.user_id, r.course_slug)
      }
    }
    for (const r of (seats.data ?? []) as Array<{
      user_id: string
      organization_subscription:
        | { course_slug: string; expires_at: string | null }
        | Array<{ course_slug: string; expires_at: string | null }>
        | null
    }>) {
      const subRaw = r.organization_subscription
      const sub = Array.isArray(subRaw) ? subRaw[0] : subRaw
      if (sub && (!sub.expires_at || new Date(sub.expires_at).getTime() > now)) {
        add(r.user_id, sub.course_slug)
      }
    }
    return profiles.map(p => ({
      id: p.id,
      email: p.email,
      displayName: p.display_name,
      createdAt: p.created_at,
      accessibleCoursesCount: countByUser.get(p.id)?.size ?? 0,
    }))
  }

  // Local: no hay user_profile real. Devolvemos el current user solamente
  // y, si hay invitations pendientes, también esos emails como
  // "usuarios" para que la UI no esté vacía mientras se prueba.
  const out: UserListItem[] = []
  // current user
  try {
    const raw = localStorage.getItem('pv-learn-current-user')
    if (raw) {
      const u = JSON.parse(raw) as {
        id: string
        email: string
        name: string
        createdAt: number
        assignedCourses: string[]
      }
      out.push({
        id: u.id,
        email: u.email,
        displayName: u.name,
        createdAt: new Date(u.createdAt).toISOString(),
        accessibleCoursesCount: u.assignedCourses?.length ?? 0,
      })
    }
  } catch {
    /* ignore */
  }
  // pending invitations
  const invs = localRead<PendingInvitation>(LOCAL_PENDING_INVITATIONS_KEY)
  for (const inv of invs) {
    if (!out.some(u => u.email === inv.email)) {
      out.push({
        id: inv.id,
        email: inv.email,
        displayName: null,
        createdAt: inv.createdAt,
        accessibleCoursesCount: 0,
      })
    }
  }
  if (options?.search?.trim()) {
    const s = options.search.trim().toLowerCase()
    return out.filter(u => u.email.toLowerCase().includes(s))
  }
  return out
}

// ════════════════════════════════════════════════════════════════════
//  Certificados emitidos (panel Plain Vanilla)
// ════════════════════════════════════════════════════════════════════

export interface IssuedCertificateRow {
  attemptId: string
  userId: string
  email: string | null
  displayName: string | null
  courseSlug: string
  scorePct: number
  submittedAt: string
  verificationId: string | null
}

export async function listIssuedCertificates(options?: {
  courseSlug?: string
  search?: string
  limit?: number
}): Promise<IssuedCertificateRow[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    let q = supabase
      .from('exam_attempt')
      .select(
        'id, user_id, course_slug, score_pct, submitted_at, verification_id, passed, user_profile!inner(email, display_name)',
      )
      .eq('passed', true)
      .order('submitted_at', { ascending: false })
      .limit(options?.limit ?? 100)
    if (options?.courseSlug?.trim()) {
      q = q.eq('course_slug', options.courseSlug.trim())
    }
    const { data, error } = await q
    if (error) throw new Error(humanizeSupabaseError(error))
    let rows = (data ?? []).map(row => {
      const r = row as {
        id: string
        user_id: string
        course_slug: string
        score_pct: number
        submitted_at: string
        verification_id: string | null
        user_profile:
          | { email: string | null; display_name: string | null }
          | Array<{ email: string | null; display_name: string | null }>
          | null
      }
      const profRaw = r.user_profile
      const prof = Array.isArray(profRaw) ? profRaw[0] ?? null : profRaw
      return {
        attemptId: r.id,
        userId: r.user_id,
        email: prof?.email ?? null,
        displayName: prof?.display_name ?? null,
        courseSlug: r.course_slug,
        scorePct: r.score_pct,
        submittedAt: r.submitted_at,
        verificationId: r.verification_id,
      }
    })
    if (options?.search?.trim()) {
      const s = options.search.trim().toLowerCase()
      rows = rows.filter(r => r.email?.toLowerCase().includes(s) ?? false)
    }
    return rows
  }
  // Local: no hay exam_attempt persistido en backend; devolver lista vacía.
  return []
}
