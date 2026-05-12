import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DEFAULT_UNIT_TYPES } from "./defaultTypes"
import { STRUCTURE_DATA } from "./data"
import type { UnitType, UniteStructurelle } from "./types"

interface StructureState {
  unitTypes: UnitType[]
  racines: UniteStructurelle[]

  /* Type actions */
  addUnitType: (type: UnitType) => void
  updateUnitType: (id: string, patch: Partial<UnitType>) => void
  deleteUnitType: (id: string) => void

  /* Unit actions */
  addUnit: (parentId: string | null, unit: UniteStructurelle) => void
  deleteUnit: (id: string) => void
}

function insertUnit(
  nodes: UniteStructurelle[],
  parentId: string,
  newUnit: UniteStructurelle
): UniteStructurelle[] {
  return nodes.map((n) => {
    if (n.id === parentId) return { ...n, children: [...n.children, newUnit] }
    return { ...n, children: insertUnit(n.children, parentId, newUnit) }
  })
}

function deleteUnit(
  nodes: UniteStructurelle[],
  id: string
): UniteStructurelle[] {
  return nodes
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: deleteUnit(n.children, id) }))
}

export const useStructureStore = create<StructureState>()(
  persist(
    (set) => ({
      unitTypes: DEFAULT_UNIT_TYPES,
      racines: STRUCTURE_DATA,

      addUnitType: (type) =>
        set((s) => ({ unitTypes: [...s.unitTypes, type] })),

      updateUnitType: (id, patch) =>
        set((s) => ({
          unitTypes: s.unitTypes.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      deleteUnitType: (id) =>
        set((s) => ({ unitTypes: s.unitTypes.filter((t) => t.id !== id) })),

      addUnit: (parentId, unit) =>
        set((s) => ({
          racines: parentId
            ? insertUnit(s.racines, parentId, unit)
            : [...s.racines, unit],
        })),

      deleteUnit: (id) =>
        set((s) => ({ racines: deleteUnit(s.racines, id) })),
    }),
    { name: "fiinor-structure" }
  )
)
