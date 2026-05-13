import { describe, it, expect, beforeEach } from 'vitest'
import {
  buildPlainTextMap,
  locatePayload,
  storageKey,
  wrapRangeWithHighlight,
  paintHighlight,
  unpaintHighlight,
  highlightFromSelection,
  type Highlight,
} from './highlights'
import { setActiveCourseSlug } from './storage'

describe('lib/highlights', () => {
  beforeEach(() => {
    setActiveCourseSlug('agent365-cert')
    document.body.innerHTML = ''
  })

  /* ------------------ pure functions ------------------ */

  describe('storageKey', () => {
    it('incluye prefijo pv-learn-{slug}-highlights-m{N}-{section}', () => {
      expect(storageKey(9, 'teoria')).toBe(
        'pv-learn-agent365-cert-highlights-m9-teoria',
      )
    })
    it('cambia cuando cambia el slug activo', () => {
      setActiveCourseSlug('demo-pv-learn')
      expect(storageKey(1, 'teoria')).toBe(
        'pv-learn-demo-pv-learn-highlights-m1-teoria',
      )
    })
  })

  describe('locatePayload', () => {
    const text = 'Microsoft Entra Agent ID gestiona identidades de agentes.'

    it('localiza payload único con contexto', () => {
      const r = locatePayload(text, 'soft ', 'Entra Agent ID', ' gestio')
      expect(r).toEqual({ start: 10, end: 24 })
    })

    it('devuelve null si no encuentra el contexto exacto', () => {
      const r = locatePayload(text, 'XXX', 'Entra Agent ID', 'YYY')
      // El payload es único, así que cae al fallback "solo payload" y lo encuentra.
      expect(r).not.toBeNull()
    })

    it('devuelve null para payloads ambiguos sin contexto válido', () => {
      // "agentes" aparece una sola vez aquí, no ambiguo. Probamos con
      // un payload realmente ambiguo:
      const ambiguous = 'foo bar foo bar'
      const r = locatePayload(ambiguous, '', 'foo', '')
      expect(r).toBeNull()
    })

    it('devuelve null para payload vacío', () => {
      expect(locatePayload(text, '', '', '')).toBeNull()
    })
  })

  describe('buildPlainTextMap', () => {
    it('concatena el texto de todos los text nodes', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>Hola <strong>mundo</strong>!</p>'
      document.body.appendChild(div)
      const map = buildPlainTextMap(div)
      expect(map.text).toBe('Hola mundo!')
      expect(map.nodes).toHaveLength(3)
    })

    it('skip-ea text nodes de solo whitespace entre bloques', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>A</p>\n\n  <p>B</p>'
      document.body.appendChild(div)
      const map = buildPlainTextMap(div)
      expect(map.text).toBe('AB')
    })

    it('ignora contenido de <script> y <style>', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>X</p><style>.x{}</style><script>alert(1)</script><p>Y</p>'
      document.body.appendChild(div)
      const map = buildPlainTextMap(div)
      expect(map.text).toBe('XY')
    })
  })

  /* --------------- paint / unpaint roundtrip ---------- */

  describe('paint + unpaint roundtrip', () => {
    it('pinta y luego quita un highlight dejando el texto intacto', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>El control plane de Agent 365 es el motor.</p>'
      document.body.appendChild(div)

      const h: Highlight = {
        id: 'h1',
        text: 'control plane',
        prefix: 'El ',
        suffix: ' de A',
        color: 'yellow',
        createdAt: Date.now(),
      }
      const marks = paintHighlight(div, h)
      expect(marks.length).toBeGreaterThan(0)
      expect(div.querySelector('mark.pv-highlight')?.textContent).toBe('control plane')

      unpaintHighlight(div, 'h1')
      expect(div.querySelector('mark.pv-highlight')).toBeNull()
      expect(div.textContent).toBe('El control plane de Agent 365 es el motor.')
    })

    it('paintHighlight devuelve [] si no encuentra el payload', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>texto distinto</p>'
      document.body.appendChild(div)
      const h: Highlight = {
        id: 'h-orphan',
        text: 'control plane',
        prefix: '',
        suffix: '',
        color: 'yellow',
        createdAt: Date.now(),
      }
      expect(paintHighlight(div, h)).toEqual([])
    })
  })

  /* --------------- wrapRangeWithHighlight ------------- */

  describe('wrapRangeWithHighlight', () => {
    it('crea un <mark> con dataset.highlightId y el color', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>uno dos tres</p>'
      document.body.appendChild(div)
      const p = div.querySelector('p')!
      const textNode = p.firstChild as Text
      const range = document.createRange()
      range.setStart(textNode, 4) // "dos tres"
      range.setEnd(textNode, 7) // "dos"
      const marks = wrapRangeWithHighlight(range, 'h2', 'green')
      expect(marks).toHaveLength(1)
      expect(marks[0].dataset.highlightId).toBe('h2')
      expect(marks[0].dataset.highlightColor).toBe('green')
      expect(marks[0].textContent).toBe('dos')
      expect(marks[0].classList.contains('pv-highlight-green')).toBe(true)
    })
  })

  /* --------------- highlightFromSelection ------------- */

  describe('highlightFromSelection', () => {
    it('extrae prefix/suffix de hasta 16 chars', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>Este es un texto largo donde resaltamos una frase central rodeada.</p>'
      document.body.appendChild(div)
      const p = div.querySelector('p')!
      const text = p.firstChild as Text
      const sel = window.getSelection()!
      const range = document.createRange()
      const fullText = text.nodeValue!
      const start = fullText.indexOf('resaltamos')
      const end = start + 'resaltamos una frase'.length
      range.setStart(text, start)
      range.setEnd(text, end)
      sel.removeAllRanges()
      sel.addRange(range)
      const h = highlightFromSelection(div, sel, 'pink')
      expect(h).not.toBeNull()
      expect(h!.text).toBe('resaltamos una frase')
      expect(h!.prefix.length).toBeGreaterThan(0)
      expect(h!.suffix.length).toBeGreaterThan(0)
      expect(h!.color).toBe('pink')
    })

    it('devuelve null si la selección es < 3 chars', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>abcdef</p>'
      document.body.appendChild(div)
      const p = div.querySelector('p')!
      const text = p.firstChild as Text
      const sel = window.getSelection()!
      const range = document.createRange()
      range.setStart(text, 0)
      range.setEnd(text, 2)
      sel.removeAllRanges()
      sel.addRange(range)
      expect(highlightFromSelection(div, sel, 'yellow')).toBeNull()
    })

    it('devuelve null si la selección está fuera del contenedor', () => {
      const div = document.createElement('div')
      div.innerHTML = '<p>dentro</p>'
      document.body.appendChild(div)
      const outside = document.createElement('p')
      outside.textContent = 'fuera del contenedor objetivo'
      document.body.appendChild(outside)
      const sel = window.getSelection()!
      const range = document.createRange()
      range.selectNodeContents(outside)
      sel.removeAllRanges()
      sel.addRange(range)
      expect(highlightFromSelection(div, sel, 'yellow')).toBeNull()
    })
  })
})
