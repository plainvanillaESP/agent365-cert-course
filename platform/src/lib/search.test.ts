import { describe, it, expect } from 'vitest'
import { highlight } from './search'

describe('lib/search — helpers públicos', () => {
  describe('highlight()', () => {
    it('devuelve un solo segmento sin match cuando la query no coincide', () => {
      const segs = highlight('Microsoft Agent 365', 'azure')
      expect(segs).toEqual([{ text: 'Microsoft Agent 365', match: false }])
    })

    it('marca el match exacto preservando capitalización original', () => {
      const segs = highlight('Microsoft Agent 365', 'agent')
      expect(segs).toEqual([
        { text: 'Microsoft ', match: false },
        { text: 'Agent', match: true },
        { text: ' 365', match: false },
      ])
    })

    it('case-insensitive y normaliza tildes', () => {
      const segs = highlight('Configuración del tenant', 'configuracion')
      const matched = segs.find(s => s.match)?.text
      expect(matched).toBe('Configuración')
    })

    it('marca todas las ocurrencias del token', () => {
      const segs = highlight('agent agent agent', 'agent')
      expect(segs.filter(s => s.match)).toHaveLength(3)
    })

    it('mergea rangos solapados (tokens contiguos no anidan)', () => {
      // tokens "abc" y "bcd" se solapan en "bc"; el resultado debe ser
      // un único rango "abcd" sin partir.
      const segs = highlight('abcd', 'abc bcd')
      const matched = segs.filter(s => s.match)
      expect(matched).toHaveLength(1)
      expect(matched[0].text).toBe('abcd')
    })

    it('vacío en query devuelve el texto sin marcar', () => {
      const segs = highlight('hola', '')
      expect(segs).toEqual([{ text: 'hola', match: false }])
    })

    it('whitespace-only query devuelve el texto sin marcar', () => {
      const segs = highlight('hola', '   ')
      expect(segs).toEqual([{ text: 'hola', match: false }])
    })
  })
})
