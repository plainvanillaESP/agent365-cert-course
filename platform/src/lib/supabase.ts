/**
 * Cliente Supabase env-gated.
 *
 * Si `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` están definidos en
 * el entorno (típicamente `.env.local` o las env vars del deployment),
 * `getSupabase()` devuelve un cliente inicializado. Si no, devuelve
 * `null` y la plataforma cae al backend local (localStorage).
 *
 * Esto permite:
 *
 *   - **Desarrollo local sin credenciales**: el shell funciona con
 *     sign-in falso y storage en navegador. Útil para iterar UI sin
 *     depender de Supabase.
 *   - **Deployment de producción**: bastan las env vars en el provider
 *     (Vercel / Netlify / GitHub Pages via Actions Secrets) para que
 *     el mismo bundle pase a usar Supabase.
 *
 * Cuando se enchufe Supabase de verdad:
 *
 *   1. Crea proyecto en supabase.com (free tier).
 *   2. Aplica `supabase/schema.sql` desde Supabase Studio.
 *   3. Anota `Settings → API → URL` y `Settings → API → anon public key`.
 *   4. Crea `platform/.env.local` con:
 *
 *      ```
 *      VITE_SUPABASE_URL=https://xxx.supabase.co
 *      VITE_SUPABASE_ANON_KEY=eyJxxx...
 *      ```
 *
 *   5. Reinicia el dev server. `isSupabaseEnabled()` ahora devuelve
 *      `true` y el backend pasa a ser Supabase.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null | undefined

function readEnv(): { url: string | undefined; anonKey: string | undefined } {
  // `import.meta.env` está disponible en runtime Vite; fuera (tests con
  // Node puro) puede no tener la forma esperada. Falla seguro al `undefined`.
  const env = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env
  return {
    url: env?.VITE_SUPABASE_URL,
    anonKey: env?.VITE_SUPABASE_ANON_KEY,
  }
}

/** Devuelve el cliente Supabase si está configurado, o null. */
export function getSupabase(): SupabaseClient | null {
  if (_client !== undefined) return _client
  const { url, anonKey } = readEnv()
  if (!url || !anonKey) {
    _client = null
    return null
  }
  try {
    _client = createClient(url, anonKey, {
      auth: {
        // Detecta el `?code=…` del callback de magic-link automáticamente
        // y crea sesión.
        detectSessionInUrl: true,
        // Persistencia en localStorage para sobrevivir reloads.
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  } catch (err) {
    console.error('[supabase] No se pudo inicializar el cliente', err)
    _client = null
  }
  return _client
}

/** True si la plataforma está configurada para usar Supabase. */
export function isSupabaseEnabled(): boolean {
  return getSupabase() !== null
}

/** Reseteo para tests: vuelve a leer env vars en la próxima llamada. */
export function _resetSupabaseClientForTests(): void {
  _client = undefined
}
