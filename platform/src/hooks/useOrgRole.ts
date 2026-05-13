import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getOrganization, getUserRoleInOrganization } from '@/lib/admin'
import type { Organization, OrganizationRole } from '@/lib/billing'

interface OrgRoleState {
  /** undefined = cargando todavía */
  organization: Organization | null | undefined
  /** null = no es member. undefined = cargando. */
  role: OrganizationRole | null | undefined
  error: string | null
}

/**
 * Resuelve la organización por slug y el rol del usuario actual en ella.
 *
 *   - `organization === undefined` → cargando
 *   - `organization === null` → no existe ese slug
 *   - `organization === Organization` → encontrado; mirar `role` para
 *      saber qué puede hacer
 */
export function useOrgRole(slug: string | undefined): OrgRoleState {
  const { user } = useAuth()
  const [state, setState] = useState<OrgRoleState>({
    organization: undefined,
    role: undefined,
    error: null,
  })

  useEffect(() => {
    if (!slug || !user) {
      setState({ organization: undefined, role: undefined, error: null })
      return
    }
    let canceled = false
    setState({ organization: undefined, role: undefined, error: null })
    getOrganization(slug)
      .then(async org => {
        if (canceled) return
        if (!org) {
          setState({ organization: null, role: null, error: null })
          return
        }
        const role = await getUserRoleInOrganization(user.id, org.id)
        if (canceled) return
        setState({ organization: org, role, error: null })
      })
      .catch(e => {
        if (canceled) return
        setState({
          organization: null,
          role: null,
          error: e instanceof Error ? e.message : String(e),
        })
      })
    return () => {
      canceled = true
    }
  }, [slug, user])

  return state
}
