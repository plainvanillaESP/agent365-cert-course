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
    if (error) throw new Error(error.message)
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
    if (error) throw new Error(error.message)
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
    if (error) throw new Error(error.message)
    return fromOrgRow(data as OrganizationRow)
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
    if (error) throw new Error(error.message)
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
    if (error) throw new Error(error.message)
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
    if (error) throw new Error(error.message)
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
