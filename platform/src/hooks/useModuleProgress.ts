import { useEffect, useState } from 'react'
import { MODULES } from '@/lib/course'
import {
  readModuleProgress,
  subscribeProgressChanges,
  getAccessMode,
  setAccessMode as setAccessModeRaw,
  isModuleUnlocked,
  type ModuleProgressSnapshot,
  type AccessMode,
} from '@/lib/progress'

/**
 * Devuelve el snapshot de progreso del módulo indicado y se mantiene
 * sincronizado con cambios en localStorage (mismo tab vía `CustomEvent`
 * y otros tabs vía evento `storage` nativo).
 *
 * El snapshot se recalcula bajo demanda — es síncrono y barato (~4
 * lecturas de localStorage), así que no necesitamos memoización
 * agresiva ni cache.
 */
export function useModuleProgress(moduleId: number): ModuleProgressSnapshot {
  const [snapshot, setSnapshot] = useState<ModuleProgressSnapshot>(() =>
    readModuleProgress(moduleId),
  )

  useEffect(() => {
    setSnapshot(readModuleProgress(moduleId))
    const unsubscribe = subscribeProgressChanges(() => {
      setSnapshot(readModuleProgress(moduleId))
    })
    return unsubscribe
  }, [moduleId])

  return snapshot
}

/**
 * Devuelve el progreso de TODOS los módulos producidos del curso.
 * Pensado para la vista global `/progreso` (Bloque D.3) y para badges
 * en la home y en la barra lateral.
 */
export function useCourseProgress(): ModuleProgressSnapshot[] {
  const moduleIds = MODULES
    .filter(m => m.estado === 'producido')
    .map(m => m.id)

  const [snapshots, setSnapshots] = useState<ModuleProgressSnapshot[]>(() =>
    moduleIds.map(id => readModuleProgress(id)),
  )

  useEffect(() => {
    setSnapshots(moduleIds.map(id => readModuleProgress(id)))
    const unsubscribe = subscribeProgressChanges(() => {
      setSnapshots(moduleIds.map(id => readModuleProgress(id)))
    })
    return unsubscribe
    // moduleIds es estable en build (depende de course.yaml producido)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return snapshots
}

/**
 * Devuelve el modo de acceso actual y un setter que dispara el evento
 * de progress-changed para refrescar a otros consumidores.
 */
export function useAccessMode(): [AccessMode, (mode: AccessMode) => void] {
  const [mode, setMode] = useState<AccessMode>(() => getAccessMode())

  useEffect(() => {
    const unsubscribe = subscribeProgressChanges(() => {
      setMode(getAccessMode())
    })
    return unsubscribe
  }, [])

  const update = (next: AccessMode) => {
    setAccessModeRaw(next)
    // Optimismo: actualizar el estado local sin esperar al evento de retorno
    setMode(next)
  }

  return [mode, update]
}

/**
 * Devuelve, para todos los módulos producidos del curso, si están o no
 * desbloqueados según el modo de acceso actual y el progreso vigente.
 *
 * El componente que renderiza módulos (sidebar, home, etc.) puede
 * leer este mapa para mostrar el estado de candado de un solo vistazo.
 */
export function useUnlockState(): {
  mode: AccessMode
  isUnlocked: (moduleId: number) => boolean
} {
  const [mode] = useAccessMode()
  const snapshots = useCourseProgress()

  const producedModuleIds = MODULES
    .filter(m => m.estado === 'producido')
    .map(m => m.id)
  const completedIds = new Set(
    snapshots.filter(s => s.isModuleComplete).map(s => s.moduleId),
  )

  const isUnlocked = (moduleId: number) =>
    isModuleUnlocked(moduleId, mode, producedModuleIds, completedIds)

  return { mode, isUnlocked }
}
