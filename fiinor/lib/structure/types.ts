export interface UnitType {
  id: string
  nom: string
  icone: string          // emoji
  couleur: string        // hex
  niveau: number         // 0 = racine, 1, 2, 3...
  enfants_autorises: string[]  // ids de UnitType autorisés en dessous
}

export interface UniteStructurelle {
  id: string
  nom: string
  typeId: string         // référence à UnitType.id
  ville?: string
  pays?: string
  flag?: string
  effectif: number
  score: number
  trend: string
  children: UniteStructurelle[]
}

export interface StructureStore {
  unitTypes: UnitType[]
  racines: UniteStructurelle[]
}
