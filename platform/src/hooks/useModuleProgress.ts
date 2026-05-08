import { useEffect, useState } from 'react'
import { MODULES } from '@/lib/course'
import {
  readModuleProgress,
  subscribeProgressChanges,
  type ModuleProgressSnapshot,
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
