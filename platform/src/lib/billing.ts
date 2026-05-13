/**
 * Tipos y API stub para la capa comercial (Fase R).
 *
 * Refleja el modelo de datos de `supabase/schema-fase-r.sql`. En R.1
 * solo tipos: la implementación real (queries a Supabase, llamadas a
 * Stripe) llega en R.2 (admin Plain Vanilla), R.3 (admin org) y R.4
 * (Stripe Checkout B2C).
 *
 * Documentación completa: `docs/fase-r-monetizacion.md`.
 */

// ════════════════════════════════════════════════════════════════════
//  Entidades
// ════════════════════════════════════════════════════════════════════

export interface Organization {
  id: string
  slug: string
  name: string
  legalName: string | null
  taxId: string | null
  billingEmail: string | null
  contactEmail: string
  country: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export type OrganizationRole = 'admin' | 'member'

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  role: OrganizationRole
  joinedAt: string
}

export interface OrganizationSubscription {
  id: string
  organizationId: string
  courseSlug: string
  seatsTotal: number
  startedAt: string
  /** `null` = sin caducidad. */
  expiresAt: string | null
  /** `null` cuando la facturación es manual (no Stripe). */
  stripeSubscriptionId: string | null
  createdBy: string | null
  notes: string | null
  createdAt: string
}

export interface OrganizationSeat {
  id: string
  subscriptionId: string
  /**
   * Email al que se invita. `null` = seat vacante (no asignado todavía).
   */
  assignedEmail: string | null
  /**
   * Se rellena automáticamente cuando el email se registra por magic
   * link (handle_new_user trigger).
   */
  userId: string | null
  assignedAt: string | null
  /** `null` = seat activo. */
  revokedAt: string | null
  revokedReason: string | null
  createdAt: string
}

export interface CoursePurchase {
  id: string
  userId: string
  courseSlug: string
  stripePaymentIntentId: string
  amountCents: number
  currency: string
  purchasedAt: string
  /** `null` = acceso perpetuo. */
  expiresAt: string | null
  invoiceUrl: string | null
}

// ════════════════════════════════════════════════════════════════════
//  Acceso a curso: tres fuentes posibles
// ════════════════════════════════════════════════════════════════════

/**
 * De dónde viene el acceso de un usuario a un curso. Usado por el
 * frontend para mostrar al alumno por qué tiene acceso ("Tu acceso
 * viene de ACS" vs "Compraste este curso el 12/05/2026").
 */
export type AccessSource =
  | { kind: 'enrollment'; enrollmentId: string }
  | { kind: 'purchase'; purchase: CoursePurchase }
  | { kind: 'seat'; seat: OrganizationSeat; organizationName: string }

/**
 * Resultado de evaluar `user_has_access_to_course` desde el cliente.
 * Si `hasAccess === false`, `source` es `null`.
 */
export interface CourseAccessInfo {
  hasAccess: boolean
  source: AccessSource | null
}

// ════════════════════════════════════════════════════════════════════
//  Pricing (lo lee la futura landing /comprar de R.4)
// ════════════════════════════════════════════════════════════════════

export type PricingType = 'b2c' | 'b2b'

export interface PricingTier {
  id: string
  courseSlug: string
  type: PricingType
  /** Stripe price ID (`price_xxx`). */
  stripePriceId: string
  amountCents: number
  currency: string
  /** Mínimo de seats para que este tier aplique (B2B). 1 para B2C. */
  seatsMin: number
  /** `null` = sin tope. */
  seatsMax: number | null
}

// ════════════════════════════════════════════════════════════════════
//  API stub
// ════════════════════════════════════════════════════════════════════
//
//  Las funciones reales se implementan en R.2 / R.3 / R.4. Aquí
//  quedan las firmas para que el resto del frontend pueda compilarse
//  contra ellas mientras desarrollamos.
// ════════════════════════════════════════════════════════════════════

/**
 * Lista las organizaciones de las que el usuario es admin o member.
 * Usado por el switcher de organización en la UI cuando un usuario
 * pertenece a más de una empresa (poco común pero soportado).
 */
export async function getOrganizationsForUser(
  _userId: string,
): Promise<Array<Organization & { role: OrganizationRole }>> {
  // TODO R.2: query a organization_member + join a organization
  return []
}

/**
 * Lista los seats de una organización, opcionalmente filtrando por
 * curso. Usado por el panel admin de la org en `/org/:slug/admin/seats`.
 */
export async function getSeatsForOrganization(
  _organizationId: string,
  _options?: { courseSlug?: string; includeRevoked?: boolean },
): Promise<OrganizationSeat[]> {
  // TODO R.3: query a organization_seat join organization_subscription
  return []
}

/**
 * Invita una lista de emails a la organización asignándoles seats
 * vacantes de la subscription indicada. Si no hay suficientes seats
 * vacantes, lanza un error con cuántos hay disponibles.
 *
 * Idempotente por email: si un email ya tiene seat activo en la misma
 * subscription, lo deja como está.
 */
export async function inviteEmailsToSubscription(
  _subscriptionId: string,
  _emails: string[],
): Promise<{ invited: string[]; alreadyAssigned: string[]; remaining: number }> {
  // TODO R.3: validar capacity, asignar seats, disparar magic link via
  // supabase.auth.signInWithOtp para cada email nuevo.
  return { invited: [], alreadyAssigned: [], remaining: 0 }
}

/**
 * Revoca un seat: el alumno deja de tener acceso pero conserva su
 * progreso (los `user_progress` no se borran). El seat queda libre
 * para reasignar a otro email.
 */
export async function revokeSeat(
  _seatId: string,
  _reason?: string,
): Promise<OrganizationSeat> {
  // TODO R.3: update organization_seat set revoked_at = now()
  throw new Error('Not implemented yet (R.3)')
}

/**
 * Lista las compras B2C del usuario. Usado por la futura pantalla
 * "Mis cursos" del alumno en `/perfil`.
 */
export async function getPurchasesForUser(_userId: string): Promise<CoursePurchase[]> {
  // TODO R.4: query a course_purchase
  return []
}

/**
 * Crea un Stripe Checkout session para comprar un curso B2C.
 * Devuelve la URL a la que redirigir al alumno.
 */
export async function startCheckout(_courseSlug: string): Promise<{ checkoutUrl: string }> {
  // TODO R.4: POST a /api/stripe/create-checkout-session
  throw new Error('Not implemented yet (R.4)')
}
