/**
 * Configuración comercial B2C por curso. Editada por Plain Vanilla
 * desde /admin/cursos y leída por las landings públicas.
 *
 * Backend Supabase o local (localStorage). El cliente público lee con
 * la misma API; las funciones de escritura solo funcionan para
 * platform_admin (RLS).
 */
import { getSupabase, isSupabaseEnabled } from './supabase'
import { humanizeSupabaseError } from './admin'

export type AccessModel = 'perpetual' | 'duration'

export interface CoursePricing {
  /** Mismo slug que en el course registry */
  courseSlug: string
  /** Si false, el curso no se vende B2C aunque haya precio configurado */
  b2cEnabled: boolean
  /** Precio en céntimos. null si todavía no se ha configurado. */
  b2cPriceCents: number | null
  /** ISO 4217 (EUR, USD, ...). Por defecto EUR. */
  currency: string
  /** 'perpetual' o 'duration' */
  accessModel: AccessModel
  /** Meses de acceso si accessModel='duration'. null si 'perpetual'. */
  accessDurationMonths: number | null
  /** ID del price en Stripe Dashboard. null hasta configurar R.4.2 */
  stripePriceId: string | null
  /** Notas internas (no se muestran al público) */
  notes: string | null
  createdAt: string
  updatedAt: string
}

interface CoursePricingRow {
  course_slug: string
  b2c_enabled: boolean
  b2c_price_cents: number | null
  currency: string
  access_model: AccessModel
  access_duration_months: number | null
  stripe_price_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

function fromRow(r: CoursePricingRow): CoursePricing {
  return {
    courseSlug: r.course_slug,
    b2cEnabled: r.b2c_enabled,
    b2cPriceCents: r.b2c_price_cents,
    currency: r.currency,
    accessModel: r.access_model,
    accessDurationMonths: r.access_duration_months,
    stripePriceId: r.stripe_price_id,
    notes: r.notes,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

const LOCAL_KEY = 'pv-learn-course-pricing'

function localRead(): CoursePricing[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CoursePricing[]
  } catch {
    return []
  }
}

function localWrite(items: CoursePricing[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(items))
  } catch {
    /* ignore quota */
  }
}

/**
 * Lee la configuración de un curso. Si no existe fila todavía,
 * devuelve null (la UI mostrará "Aún no configurado").
 */
export async function getCoursePricing(
  courseSlug: string,
): Promise<CoursePricing | null> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('course_pricing')
      .select('*')
      .eq('course_slug', courseSlug)
      .maybeSingle()
    if (error) throw new Error(humanizeSupabaseError(error))
    return data ? fromRow(data as CoursePricingRow) : null
  }
  const all = localRead()
  return all.find(p => p.courseSlug === courseSlug) ?? null
}

/** Devuelve todas las filas de pricing. Para el panel admin. */
export async function listAllCoursePricing(): Promise<CoursePricing[]> {
  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('course_pricing')
      .select('*')
      .order('updated_at', { ascending: false })
    if (error) throw new Error(humanizeSupabaseError(error))
    return (data ?? []).map(r => fromRow(r as CoursePricingRow))
  }
  return localRead()
}

/**
 * Cursos con b2c_enabled=true Y precio configurado. Esto es lo que
 * mostrarán las landings públicas. Cuando se conecte Stripe, además
 * habrá que filtrar por stripe_price_id no nulo.
 */
export async function listPublishedCoursesForSale(): Promise<CoursePricing[]> {
  const all = await listAllCoursePricing()
  return all.filter(p => p.b2cEnabled && p.b2cPriceCents != null && p.b2cPriceCents > 0)
}

export interface UpsertCoursePricingInput {
  courseSlug: string
  b2cEnabled: boolean
  b2cPriceCents: number | null
  currency: string
  accessModel: AccessModel
  accessDurationMonths: number | null
  stripePriceId: string | null
  notes: string | null
}

/**
 * Crea o actualiza la configuración de un curso. UPSERT por
 * course_slug.
 */
export async function upsertCoursePricing(
  input: UpsertCoursePricingInput,
): Promise<CoursePricing> {
  // Validación cliente para fallar pronto y con mensaje claro
  if (input.b2cEnabled && (input.b2cPriceCents == null || input.b2cPriceCents <= 0)) {
    throw new Error('Para activar la venta B2C tienes que indicar un precio mayor que 0.')
  }
  if (input.accessModel === 'duration' && !input.accessDurationMonths) {
    throw new Error('Si el acceso es por duración, indica cuántos meses.')
  }
  if (input.accessModel === 'perpetual' && input.accessDurationMonths != null) {
    // Forzamos null para mantener el invariante del check constraint.
    input = { ...input, accessDurationMonths: null }
  }

  if (isSupabaseEnabled()) {
    const supabase = getSupabase()!
    const { data, error } = await supabase
      .from('course_pricing')
      .upsert(
        {
          course_slug: input.courseSlug,
          b2c_enabled: input.b2cEnabled,
          b2c_price_cents: input.b2cPriceCents,
          currency: input.currency,
          access_model: input.accessModel,
          access_duration_months: input.accessDurationMonths,
          stripe_price_id: input.stripePriceId,
          notes: input.notes,
        },
        { onConflict: 'course_slug' },
      )
      .select()
      .single()
    if (error) throw new Error(humanizeSupabaseError(error))
    return fromRow(data as CoursePricingRow)
  }

  // Backend local
  const all = localRead()
  const now = new Date().toISOString()
  const existing = all.find(p => p.courseSlug === input.courseSlug)
  const next: CoursePricing = {
    courseSlug: input.courseSlug,
    b2cEnabled: input.b2cEnabled,
    b2cPriceCents: input.b2cPriceCents,
    currency: input.currency,
    accessModel: input.accessModel,
    accessDurationMonths: input.accessDurationMonths,
    stripePriceId: input.stripePriceId,
    notes: input.notes,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  }
  const filtered = all.filter(p => p.courseSlug !== input.courseSlug)
  localWrite([next, ...filtered])
  return next
}

/**
 * Formatea precio en céntimos a string legible.
 *   formatPrice(19900, 'EUR') → '199,00 €'
 */
export function formatPrice(cents: number | null, currency: string = 'EUR'): string {
  if (cents == null) return '—'
  const value = cents / 100
  try {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${value.toFixed(2)} ${currency}`
  }
}

/** Descripción humana del modelo de acceso. */
export function describeAccessModel(pricing: {
  accessModel: AccessModel
  accessDurationMonths: number | null
}): string {
  if (pricing.accessModel === 'perpetual') return 'Acceso permanente'
  const m = pricing.accessDurationMonths ?? 0
  if (m === 1) return 'Acceso de 1 mes'
  if (m === 12) return 'Acceso de 12 meses (1 año)'
  if (m === 24) return 'Acceso de 24 meses (2 años)'
  return `Acceso de ${m} meses`
}
