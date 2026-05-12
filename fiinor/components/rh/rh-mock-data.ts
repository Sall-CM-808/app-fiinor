/* ─────────────────────────────────────────
   rh-mock-data.ts  — Ressources Humaines
   Données seeded déterministes
───────────────────────────────────────── */

/* ── Utilitaires ── */
export function formatGNF(n: number) {
  return new Intl.NumberFormat("fr-GN", { style: "currency", currency: "GNF", maximumFractionDigits: 0 }).format(n)
}

/* ── Enums / types ── */
export type StatutEmploye   = "actif" | "suspendu" | "parti"
export type TypeContrat     = "CDI" | "CDD" | "vacataire" | "stage"
export type StatutContrat   = "actif" | "expiré" | "résilié"
export type StatutPaie      = "brouillon" | "validé" | "payé"
export type TypeConge       = "annuel" | "maladie" | "maternité" | "paternité" | "sans_solde"
export type StatutConge     = "en_attente" | "approuvé" | "refusé"
export type EtapeRecrutement = "candidature" | "présélection" | "entretien" | "offre" | "embauché" | "refusé"
export type StatutEval      = "brouillon" | "finalisé"
export type Departement     = "Informatique" | "Droit" | "Médecine" | "Sciences Éco" | "Administration" | "Génie Civil" | "Pharmacie"

/* ── Interfaces ── */
export interface Employe {
  id: string
  matricule: string
  nom: string
  prenom: string
  genre: "M" | "F"
  email: string
  telephone: string
  departement: Departement
  poste: string
  roles: string[]
  dateEmbauche: string
  statut: StatutEmploye
  salaireBrut: number
  avatar?: string
}

export interface Contrat {
  id: string
  employeId: string
  employeNom: string
  type: TypeContrat
  dateDebut: string
  dateFin: string | null
  salaireBrut: number
  salaireNet: number
  statut: StatutContrat
  departement: Departement
}

export interface FichePaie {
  id: string
  employeId: string
  employeNom: string
  departement: Departement
  mois: number
  annee: number
  salaireBase: number
  primes: number
  deductions: number
  net: number
  statut: StatutPaie
}

export interface Conge {
  id: string
  employeId: string
  employeNom: string
  employePoste: string
  departement: Departement
  type: TypeConge
  dateDebut: string
  dateFin: string
  jours: number
  statut: StatutConge
  motif: string
  dateDepot: string
}

export interface PosteOuvert {
  id: string
  titre: string
  departement: Departement
  niveau: string
  typeContrat: TypeContrat
  dateOuverture: string
  nbCandidats: number
  urgent: boolean
  description: string
}

export interface Candidature {
  id: string
  posteId: string
  posteTitre: string
  nom: string
  prenom: string
  email: string
  telephone: string
  etape: EtapeRecrutement
  dateDepot: string
  noteEntretien?: number
  commentaire?: string
}

export interface EvaluationRH {
  id: string
  employeId: string
  employeNom: string
  departement: Departement
  annee: number
  notePerformance: number
  noteCompetences: number
  notePonctualite: number
  objectifsAtteints: number
  objectifsTotal: number
  commentaire: string
  statut: StatutEval
  evaluateur: string
}

/* ── Seed ── */
const seed = (n: number) => ((n * 1103515245 + 12345) & 0x7fffffff) % 100

const NOMS   = ["Diallo","Barry","Camara","Bah","Sylla","Kouyaté","Touré","Condé","Soumah","Baldé","Cissé","Keita","Traoré","Sow","Ly"]
const PRENOM_M = ["Mamadou","Alpha","Ibrahima","Oumar","Sékou","Mohamed","Abdoulaye","Thierno","Lansana","Elhadj"]
const PRENOM_F = ["Fatoumata","Mariama","Aminata","Aissatou","Kadiatou","Hawa","Nènè","Ramata","Djenab","Marème"]
const POSTES: Record<Departement, string[]> = {
  "Informatique":  ["Professeur Informatique","Chargé de TP","Responsable Labo","Enseignant vacataire"],
  "Droit":         ["Professeur de Droit","Maître de Conférences","Chargé de Cours","Doyen Adjoint"],
  "Médecine":      ["Professeur de Médecine","Chef de Département","Interne","Enseignant-Chercheur"],
  "Sciences Éco":  ["Professeur Économie","Maître-Assistant","Chargé de TD","Responsable Pédagogique"],
  "Administration":["Secrétaire Général","Comptable","RH Manager","Agent Administratif","Directeur Admin"],
  "Génie Civil":   ["Ingénieur-Enseignant","Professeur de Génie","Responsable Travaux Pratiques"],
  "Pharmacie":     ["Pharmacien-Enseignant","Maître de Conférences","Chargé de Cours"],
}
const DEPARTEMENTS: Departement[] = ["Informatique","Droit","Médecine","Sciences Éco","Administration","Génie Civil","Pharmacie"]

export const EMPLOYES: Employe[] = Array.from({ length: 28 }, (_, i) => {
  const s      = i + 1
  const genre  = seed(s * 7) < 40 ? "F" : "M"
  const dept   = DEPARTEMENTS[s % DEPARTEMENTS.length]
  const postes = POSTES[dept]
  return {
    id:          `emp-${s}`,
    matricule:   `RH-${2021 + (s % 4)}-${String(100 + s).padStart(4, "0")}`,
    nom:         NOMS[s % NOMS.length],
    prenom:      genre === "M" ? PRENOM_M[s % PRENOM_M.length] : PRENOM_F[s % PRENOM_F.length],
    genre,
    email:       `${PRENOM_M[s % PRENOM_M.length].toLowerCase()}.${NOMS[s % NOMS.length].toLowerCase()}@univ-conakry.gn`,
    telephone:   `+224 6${seed(s * 3) % 2 === 0 ? "2" : "4"}${seed(s * 5)} ${seed(s * 11)} ${String(seed(s * 13)).padStart(2,"0")} ${String(seed(s * 17)).padStart(2,"0")}`,
    departement: dept,
    poste:       postes[s % postes.length],
    roles:       s % 5 === 0 ? ["Enseignant","Tuteur"] : s % 7 === 0 ? ["Enseignant","Responsable"] : ["Enseignant"],
    dateEmbauche:`20${18 + (s % 7)}-${String(1 + (s % 12)).padStart(2,"0")}-${String(1 + (s % 28)).padStart(2,"0")}`,
    statut:      s % 11 === 0 ? "suspendu" : s % 17 === 0 ? "parti" : "actif",
    salaireBrut: 2_500_000 + (seed(s * 19) * 50_000),
  }
})

/* ── Contrats (28) ── */
export const CONTRATS: Contrat[] = EMPLOYES.map((e, i) => {
  const type: TypeContrat = i % 7 === 0 ? "vacataire" : i % 5 === 0 ? "CDD" : "CDI"
  const net = Math.round(e.salaireBrut * 0.82)
  return {
    id:          `cnt-${i + 1}`,
    employeId:   e.id,
    employeNom:  `${e.prenom} ${e.nom}`,
    type,
    dateDebut:   e.dateEmbauche,
    dateFin:     type === "CDI" ? null : `20${26 + (i % 3)}-${String(1 + (i % 12)).padStart(2,"0")}-28`,
    salaireBrut: e.salaireBrut,
    salaireNet:  net,
    statut:      e.statut === "parti" ? "résilié" : type === "CDD" && i % 9 === 0 ? "expiré" : "actif",
    departement: e.departement,
  }
})

/* ── Fiches de paie (Mai 2025 — 28) ── */
export const FICHES_PAIE: FichePaie[] = EMPLOYES.map((e, i) => {
  const prime = seed(i * 23) * 10_000
  const ded   = Math.round(e.salaireBrut * 0.08)
  return {
    id:          `paie-${i + 1}`,
    employeId:   e.id,
    employeNom:  `${e.prenom} ${e.nom}`,
    departement: e.departement,
    mois:        5,
    annee:       2025,
    salaireBase: e.salaireBrut,
    primes:      prime,
    deductions:  ded,
    net:         e.salaireBrut + prime - ded,
    statut:      i % 6 === 0 ? "brouillon" : i % 3 === 0 ? "validé" : "payé",
  }
})

/* ── Congés (20) ── */
const TYPES_CONGE: TypeConge[] = ["annuel","maladie","maternité","paternité","sans_solde"]
const MOTIFS_CONGE = [
  "Repos annuel prévu","Maladie — certificat joint","Congé maternité légal",
  "Congé paternité naissance","Raison personnelle","Voyage familial",
  "Formation externe","Convalescence post-opératoire",
]
export const CONGES: Conge[] = Array.from({ length: 20 }, (_, i) => {
  const emp   = EMPLOYES[i % EMPLOYES.length]
  const jours = 3 + (seed(i * 7) % 25)
  const statut: StatutConge = i % 4 === 0 ? "en_attente" : i % 7 === 0 ? "refusé" : "approuvé"
  return {
    id:           `cng-${i + 1}`,
    employeId:    emp.id,
    employeNom:   `${emp.prenom} ${emp.nom}`,
    employePoste: emp.poste,
    departement:  emp.departement,
    type:         TYPES_CONGE[i % TYPES_CONGE.length],
    dateDebut:    `2025-${String(1 + (i % 11)).padStart(2,"0")}-${String(3 + (i % 25)).padStart(2,"0")}`,
    dateFin:      `2025-${String(1 + (i % 11)).padStart(2,"0")}-${String(3 + (i % 25) + jours).padStart(2,"0")}`,
    jours,
    statut,
    motif:        MOTIFS_CONGE[i % MOTIFS_CONGE.length],
    dateDepot:    `2025-${String(1 + (i % 10)).padStart(2,"0")}-01`,
  }
})

/* ── Postes ouverts (6) ── */
export const POSTES_OUVERTS: PosteOuvert[] = [
  { id:"po-1", titre:"Professeur Informatique", departement:"Informatique", niveau:"Doctorat requis", typeContrat:"CDI", dateOuverture:"2025-03-10", nbCandidats:14, urgent:true,  description:"Cours algorithmique et IA pour L3/M1" },
  { id:"po-2", titre:"Comptable Senior",        departement:"Administration",niveau:"Bac+4 min",      typeContrat:"CDI", dateOuverture:"2025-04-01", nbCandidats:9,  urgent:false, description:"Gestion comptabilité générale et analytique" },
  { id:"po-3", titre:"Chargé de Cours Droit",   departement:"Droit",       niveau:"Master Droit",    typeContrat:"CDD", dateOuverture:"2025-04-15", nbCandidats:7,  urgent:false, description:"Droit des affaires et droit civil OHADA" },
  { id:"po-4", titre:"Ingénieur-Enseignant",    departement:"Génie Civil",  niveau:"Ingénieur diplômé",typeContrat:"CDI",dateOuverture:"2025-02-20", nbCandidats:5,  urgent:true,  description:"Résistance des matériaux & béton armé" },
  { id:"po-5", titre:"Pharmacien-Enseignant",   departement:"Pharmacie",    niveau:"Doctorat Pharma", typeContrat:"CDI",dateOuverture:"2025-05-01", nbCandidats:3,  urgent:false, description:"Pharmacologie et chimie thérapeutique" },
  { id:"po-6", titre:"Vacataire Économie",      departement:"Sciences Éco", niveau:"Master Éco",      typeContrat:"vacataire",dateOuverture:"2025-05-05",nbCandidats:11,urgent:false,description:"Macroéconomie et politique monétaire" },
]

/* ── Candidatures (24) ── */
const ETAPES: EtapeRecrutement[] = ["candidature","présélection","entretien","offre","embauché","refusé"]
export const CANDIDATURES: Candidature[] = Array.from({ length: 24 }, (_, i) => {
  const poste = POSTES_OUVERTS[i % POSTES_OUVERTS.length]
  const etape = ETAPES[seed(i * 13) % ETAPES.length]
  return {
    id:          `cand-${i + 1}`,
    posteId:     poste.id,
    posteTitre:  poste.titre,
    nom:         NOMS[(i + 3) % NOMS.length],
    prenom:      i % 3 === 0 ? PRENOM_F[i % PRENOM_F.length] : PRENOM_M[i % PRENOM_M.length],
    email:       `candidat${i + 1}@mail.gn`,
    telephone:   `+224 6${seed(i * 3) % 2 === 0 ? "2" : "4"}${seed(i * 7)} ${seed(i * 11)} ${String(seed(i * 13)).padStart(2,"0")} ${String(seed(i * 17)).padStart(2,"0")}`,
    etape,
    dateDepot:   `2025-${String(3 + (i % 3)).padStart(2,"0")}-${String(1 + (i % 28)).padStart(2,"0")}`,
    noteEntretien: etape === "entretien" || etape === "offre" || etape === "embauché" ? 10 + (seed(i * 7) % 10) : undefined,
    commentaire:  etape === "refusé" ? "Profil ne correspond pas aux critères requis" : undefined,
  }
})

/* ── Évaluations annuelles (20) ── */
export const EVALUATIONS_RH: EvaluationRH[] = Array.from({ length: 20 }, (_, i) => {
  const emp = EMPLOYES[i % EMPLOYES.length]
  const perf = 8 + (seed(i * 11) % 12)
  const comp = 7 + (seed(i * 13) % 13)
  const ponc = 8 + (seed(i * 7) % 12)
  const obj  = 3 + (seed(i * 5) % 5)
  return {
    id:                `eval-${i + 1}`,
    employeId:         emp.id,
    employeNom:        `${emp.prenom} ${emp.nom}`,
    departement:       emp.departement,
    annee:             2024,
    notePerformance:   perf,
    noteCompetences:   comp,
    notePonctualite:   ponc,
    objectifsAtteints: obj,
    objectifsTotal:    5,
    commentaire:       i % 3 === 0 ? "Excellente implication dans les activités pédagogiques" : i % 5 === 0 ? "Des progrès notables mais des points d'amélioration restent" : "Évaluation satisfaisante — continue dans cette dynamique",
    statut:            i % 4 === 0 ? "brouillon" : "finalisé",
    evaluateur:        "Dr. Alpha Diallo — DRH",
  }
})

/* ── KPIs ── */
export const KPI_RH = [
  { label: "Effectif total",       value: String(EMPLOYES.filter(e => e.statut === "actif").length),  delta: "+3 ce trimestre",  positif: true,  color: "#3B82F6", icon: "Users" },
  { label: "Contrats actifs",      value: String(CONTRATS.filter(c => c.statut === "actif").length),  delta: "+1 ce mois",       positif: true,  color: "#C9A84C", icon: "FileText" },
  { label: "Congés en attente",    value: String(CONGES.filter(c => c.statut === "en_attente").length), delta: "à traiter",      positif: false, color: "#F59E0B", icon: "Calendar" },
  { label: "Postes ouverts",       value: String(POSTES_OUVERTS.length),                              delta: "2 urgents",        positif: false, color: "#EF4444", icon: "Briefcase" },
  { label: "Fiches de paie/mois",  value: formatGNF(FICHES_PAIE.filter(f => f.statut === "payé").reduce((s,f) => s + f.net, 0)), delta: "Mai 2025", positif: true, color: "#10B981", icon: "Wallet" },
  { label: "Candidatures actives", value: String(CANDIDATURES.filter(c => !["embauché","refusé"].includes(c.etape)).length), delta: `${POSTES_OUVERTS.length} postes`, positif: true, color: "#8B5CF6", icon: "UserPlus" },
]

/* ── Stats par département ── */
export const STATS_DEPT = DEPARTEMENTS.map(d => ({
  dept:     d,
  effectif: EMPLOYES.filter(e => e.departement === d && e.statut === "actif").length,
  masse:    EMPLOYES.filter(e => e.departement === d && e.statut === "actif").reduce((s, e) => s + e.salaireBrut, 0),
}))

/* ── Tendance effectifs (12 mois) ── */
export const TENDANCE_EFFECTIFS = [
  { mois:"Jun",  actifs:22, partis:0, embauches:1 },
  { mois:"Jul",  actifs:23, partis:0, embauches:1 },
  { mois:"Aoû",  actifs:23, partis:1, embauches:0 },
  { mois:"Sep",  actifs:24, partis:0, embauches:2 },
  { mois:"Oct",  actifs:25, partis:1, embauches:1 },
  { mois:"Nov",  actifs:25, partis:0, embauches:0 },
  { mois:"Déc",  actifs:26, partis:0, embauches:1 },
  { mois:"Jan",  actifs:26, partis:1, embauches:2 },
  { mois:"Fév",  actifs:27, partis:0, embauches:1 },
  { mois:"Mar",  actifs:27, partis:1, embauches:0 },
  { mois:"Avr",  actifs:27, partis:0, embauches:1 },
  { mois:"Mai",  actifs:EMPLOYES.filter(e => e.statut === "actif").length, partis:1, embauches:2 },
]
