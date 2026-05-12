/* ─── Finance Mock Data — Seeded PRNG, déterministe server/client ─── */

function seededRng(seed: number) {
  let s = seed
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = seededRng(314)
const r = () => rng()
const ri = (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min
const rpick = <T,>(arr: T[]) => arr[ri(0, arr.length - 1)]

/* ─── Types ─── */
export type MoyenPaiement = "espèces" | "virement" | "orange_money" | "wave" | "chèque"
export type StatutPaiement = "payé" | "partiel" | "en_retard" | "non_payé"
export type TypeTransaction = "recette" | "dépense" | "virement_interne"
export type StatutRapprochement = "rapproché" | "en_attente" | "écart"
export type Devise = "GNF" | "XOF" | "EUR" | "USD"

export interface Echeance {
  id: string
  libelle: string
  montant: number
  dateEcheance: string
  datePaiement: string | null
  statut: StatutPaiement
  moyen: MoyenPaiement | null
  reference: string | null
}

export interface EleveEcheancier {
  id: string
  nom: string
  prenom: string
  matricule: string
  classe: string
  totalDu: number
  totalPaye: number
  statut: StatutPaiement
  echeances: Echeance[]
}

export interface Transaction {
  id: string
  date: string
  libelle: string
  type: TypeTransaction
  montant: number
  debit: number
  credit: number
  solde: number
  moyen: MoyenPaiement
  unite: string
  reference: string
  description: string
}

export interface LigneBudget {
  id: string
  unite: string
  type: "recette" | "dépense"
  libelle: string
  previsionnel: number
  realise: number
  ecart: number
  pourcentage: number
}

export interface LigneRapprochement {
  id: string
  date: string
  libelle: string
  montantReleve: number
  montantFiinor: number | null
  statut: StatutRapprochement
  ecart: number
  transactionId: string | null
}

/* ─── Constants ─── */
const PRENOMS = ["Amara","Fatoumata","Ibrahim","Mariama","Seydou","Kadiatou","Oumar","Aissatou","Mamadou","Hawa","Amadou","Mariam","Alpha","Oumou","Boubacar"]
const NOMS = ["Diallo","Bah","Camara","Kouyaté","Touré","Baldé","Barry","Sylla","Keita","Sow","Condé","Konaté","Traoré","Cissé","Doumbouya"]
const CLASSES = ["L1-Info","L1-Éco","L2-Info","L2-Droit","L3-Info","M1-Finance","L3-Gestion"]
const MOYENS: MoyenPaiement[] = ["espèces","virement","orange_money","wave","chèque"]
const UNITES = ["Faculté des Sciences","Dept. Informatique","Dept. Économie","Dept. Droit","Administration","Bibliothèque","Services Généraux"]

const MOIS = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"]

/* ─── KPI mensuel (graphique) ─── */
export const RECETTES_MENSUELLES = MOIS.map((mois, i) => ({
  mois,
  recettes: ri(18_000_000, 45_000_000),
  previsions: 35_000_000,
  depenses: ri(8_000_000, 22_000_000),
}))

/* ─── Répartition moyens de paiement ─── */
export const REPARTITION_MOYENS = [
  { name: "Orange Money", value: 38, color: "#f97316" },
  { name: "Espèces",      value: 27, color: "#C9A84C" },
  { name: "Wave",         value: 18, color: "#06b6d4" },
  { name: "Virement",     value: 12, color: "#6366f1" },
  { name: "Chèque",       value: 5,  color: "#94a3b8" },
]

/* ─── Taux par classe ─── */
export const TAUX_CLASSE = CLASSES.map(classe => ({
  classe,
  taux: ri(55, 98),
  effectif: ri(25, 60),
})).sort((a, b) => b.taux - a.taux)

/* ─── KPI globaux ─── */
export const KPI_FINANCE = {
  recetteMois: 38_450_000,
  recetteMoisPrev: 35_000_000,
  tauxRecouvrement: 74,
  tauxRecouvrementPrev: 80,
  impayes: 12_650_000,
  impayesPrev: 9_800_000,
  balance: 15_800_000,
  balancePrev: 12_000_000,
  alertesRetard: 23,
}

/* ─── Échéanciers étudiants ─── */
function makeEcheances(total: number): Echeance[] {
  const tranches = [
    { libelle: "1ère tranche — Inscription", pct: 0.40, date: "2024-10-01" },
    { libelle: "2ème tranche — Jan",         pct: 0.35, date: "2025-01-15" },
    { libelle: "3ème tranche — Avr",         pct: 0.25, date: "2025-04-01" },
  ]
  return tranches.map((t, i) => {
    const montant = Math.round(total * t.pct / 1000) * 1000
    const statuts: StatutPaiement[] = ["payé","payé","partiel","en_retard","non_payé"]
    const statut = rpick(statuts)
    const moyen = statut !== "non_payé" ? rpick(MOYENS) : null
    return {
      id: `ech-${i}`,
      libelle: t.libelle,
      montant,
      dateEcheance: t.date,
      datePaiement: statut === "payé" ? t.date : statut === "partiel" ? t.date : null,
      statut,
      moyen,
      reference: statut !== "non_payé" ? `REF-${ri(10000,99999)}` : null,
    }
  })
}

export const ELEVES_ECHEANCIER: EleveEcheancier[] = Array.from({ length: 30 }, (_, i) => {
  const totalDu = rpick([2_500_000, 3_000_000, 3_500_000, 4_000_000, 5_000_000])
  const echeances = makeEcheances(totalDu)
  const totalPaye = echeances.reduce((s, e) =>
    s + (e.statut === "payé" ? e.montant : e.statut === "partiel" ? Math.round(e.montant * 0.5) : 0), 0)
  const statut: StatutPaiement =
    totalPaye >= totalDu ? "payé" :
    totalPaye > 0 ? "partiel" :
    r() > 0.5 ? "en_retard" : "non_payé"
  return {
    id: `etud-${i}`,
    nom: NOMS[i % NOMS.length],
    prenom: PRENOMS[i % PRENOMS.length],
    matricule: `M${String(20240100 + i).padStart(8, "0")}`,
    classe: CLASSES[i % CLASSES.length],
    totalDu,
    totalPaye,
    statut,
    echeances,
  }
})

/* ─── Transactions ─── */
const TX_LIBELLES_RECETTES = [
  "Frais de scolarité — L1 Info","Frais d'inscription","Droits d'examen","Frais de bibliothèque",
  "Frais de stage","Certificats et attestations","Droits de concours","Frais de réévaluation",
]
const TX_LIBELLES_DEPENSES = [
  "Salaires enseignants","Salaires administration","Fournitures bureau","Maintenance équipements",
  "Électricité et eau","Internet et télécom","Transport institutionnel","Achat mobilier",
  "Frais bancaires","Entretien bâtiments",
]

let solde = 8_000_000
export const TRANSACTIONS: Transaction[] = Array.from({ length: 45 }, (_, i) => {
  const type: TypeTransaction = r() > 0.35 ? "recette" : "dépense"
  const montant = type === "recette" ? ri(500_000, 8_000_000) : ri(200_000, 4_000_000)
  const debit  = type === "dépense" ? montant : 0
  const credit = type === "recette" ? montant : 0
  solde += credit - debit
  const jour = ri(1, 28)
  const mois = ri(1, 12)
  return {
    id: `tx-${i}`,
    date: `2024-${String(mois).padStart(2,"0")}-${String(jour).padStart(2,"0")}`,
    libelle: type === "recette" ? rpick(TX_LIBELLES_RECETTES) : rpick(TX_LIBELLES_DEPENSES),
    type,
    montant,
    debit,
    credit,
    solde,
    moyen: rpick(MOYENS),
    unite: rpick(UNITES),
    reference: `TX-2024-${String(i + 1001).padStart(5, "0")}`,
    description: `Opération enregistrée le ${jour}/${mois}/2024`,
  }
}).sort((a, b) => b.date.localeCompare(a.date))

/* ─── Budget ─── */
export const LIGNES_BUDGET: LigneBudget[] = [
  ...UNITES.map((unite, i) => {
    const prev = ri(5_000_000, 25_000_000)
    const reel = ri(Math.round(prev * 0.5), Math.round(prev * 1.1))
    return {
      id: `bgt-${i}`,
      unite,
      type: "dépense" as const,
      libelle: "Budget de fonctionnement",
      previsionnel: prev,
      realise: reel,
      ecart: reel - prev,
      pourcentage: Math.round((reel / prev) * 100),
    }
  }),
  { id: "bgt-rec-1", unite: "Global",           type: "recette", libelle: "Frais de scolarité",   previsionnel: 180_000_000, realise: 134_000_000, ecart: -46_000_000, pourcentage: 74 },
  { id: "bgt-rec-2", unite: "Administration",   type: "recette", libelle: "Droits d'inscription", previsionnel: 25_000_000,  realise: 22_500_000,  ecart: -2_500_000,  pourcentage: 90 },
  { id: "bgt-rec-3", unite: "Services Généraux",type: "recette", libelle: "Autres recettes",       previsionnel: 8_000_000,   realise: 9_200_000,   ecart: 1_200_000,   pourcentage: 115 },
]

/* ─── Rapprochement bancaire ─── */
export const LIGNES_RAPPROCHEMENT: LigneRapprochement[] = Array.from({ length: 20 }, (_, i) => {
  const statut: StatutRapprochement = rpick(["rapproché","rapproché","en_attente","écart"])
  const montantReleve = ri(500_000, 10_000_000)
  const montantFiinor = statut === "rapproché" ? montantReleve
    : statut === "écart" ? montantReleve + ri(-500_000, 500_000)
    : null
  const ecart = montantFiinor !== null ? montantFiinor - montantReleve : 0
  const jour = ri(1, 28)
  return {
    id: `rap-${i}`,
    date: `2024-12-${String(jour).padStart(2,"0")}`,
    libelle: rpick([...TX_LIBELLES_RECETTES, ...TX_LIBELLES_DEPENSES]),
    montantReleve,
    montantFiinor,
    statut,
    ecart,
    transactionId: statut !== "en_attente" ? `tx-${ri(0, 44)}` : null,
  }
}).sort((a, b) => b.date.localeCompare(a.date))

/* ─── Formatage GNF ─── */
export function formatGNF(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Md GNF`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)} M GNF`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)} K GNF`
  return `${n.toLocaleString("fr-FR")} GNF`
}
