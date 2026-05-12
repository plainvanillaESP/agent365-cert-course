import { Modal } from '@/components/Modal'
import { KeyCombo, shortcutKeys, type Shortcut } from '@/hooks/useKeyboardShortcuts'

interface ShortcutsModalProps {
  open: boolean
  onClose: () => void
  shortcuts: Shortcut[]
}

/**
 * Modal de ayuda con todos los atajos de teclado disponibles.
 * Se abre con `?` (sin Shift, como en GitHub/GMail).
 * Agrupa los atajos por su campo `group` para legibilidad.
 */
export function ShortcutsModal({ open, onClose, shortcuts }: ShortcutsModalProps) {
  // Agrupar por `group` preservando orden de aparición.
  const groups = new Map<string, Shortcut[]>()
  for (const s of shortcuts) {
    if (!groups.has(s.group)) groups.set(s.group, [])
    groups.get(s.group)!.push(s)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      ariaLabel="Atajos de teclado"
      header={
        <div>
          <h2 className="text-[18px] font-semibold text-[var(--text-primary)] leading-tight">
            Atajos de teclado
          </h2>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Pulsa <KeyCombo keys={['?']} /> en cualquier momento para abrir esta ayuda.
          </p>
        </div>
      }
    >
      <div className="space-y-5">
        {[...groups.entries()].map(([groupName, items]) => (
          <section key={groupName}>
            <h3 className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-muted)] font-semibold mb-2">
              {groupName}
            </h3>
            <ul className="divide-y divide-[var(--border-subtle)]">
              {items.map((s, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0"
                >
                  <span className="text-[13.5px] text-[var(--text-primary)]">
                    {s.description}
                  </span>
                  <KeyCombo keys={shortcutKeys(s)} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  )
}
