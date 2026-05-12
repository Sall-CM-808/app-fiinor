import type { UnitType } from "./types"

export const DEFAULT_UNIT_TYPES: UnitType[] = [
  {
    id: "reseau",
    nom: "Réseau",
    icone: "🌐",
    couleur: "#C9A84C",
    niveau: 0,
    enfants_autorises: ["etablissement"],
  },
  {
    id: "etablissement",
    nom: "Établissement",
    icone: "🏫",
    couleur: "#3B82F6",
    niveau: 1,
    enfants_autorises: ["faculte", "departement"],
  },
  {
    id: "faculte",
    nom: "Faculté",
    icone: "🏛️",
    couleur: "#8B5CF6",
    niveau: 2,
    enfants_autorises: ["departement"],
  },
  {
    id: "departement",
    nom: "Département",
    icone: "📚",
    couleur: "#10B981",
    niveau: 3,
    enfants_autorises: ["classe"],
  },
  {
    id: "classe",
    nom: "Classe",
    icone: "🎓",
    couleur: "#F59E0B",
    niveau: 4,
    enfants_autorises: [],
  },
]
