/* ─────────────────────────────────────────────────────
   rapports-mock-data.ts  —  Rapports & Analyses
   Données croisées déterministes (Finance + RH + Services)
───────────────────────────────────────────────────────── */

export function formatGNF(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Md GNF`
  if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(1)} M GNF`
  if (n >= 1_000)         return `${(n / 1_000).toFixed(0)} K GNF`
  return `${n} GNF`
}

const seed = (n: number) => ((n * 1103515245 + 12345) & 0x7fffffff) % 100

/* ── Série consolidée 12 mois ── */
export const SERIE_CONSOLIDEE = [
  { mois: "Jun",  recettes: 28_500_000, depenses: 18_200_000, effectifs: 22, inscriptions: 12, emprunts: 28 },
  { mois: "Jul",  recettes: 31_200_000, depenses: 19_800_000, effectifs: 23, inscriptions: 8,  emprunts: 21 },
  { mois: "Aoû",  recettes: 22_400_000, depenses: 16_500_000, effectifs: 23, inscriptions: 5,  emprunts: 14 },
  { mois: "Sep",  recettes: 42_100_000, depenses: 24_300_000, effectifs: 24, inscriptions: 45, emprunts: 38 },
  { mois: "Oct",  recettes: 38_700_000, depenses: 22_100_000, effectifs: 25, inscriptions: 31, emprunts: 42 },
  { mois: "Nov",  recettes: 35_900_000, depenses: 21_400_000, effectifs: 25, inscriptions: 18, emprunts: 35 },
  { mois: "Déc",  recettes: 29_600_000, depenses: 20_800_000, effectifs: 26, inscriptions: 7,  emprunts: 22 },
  { mois: "Jan",  recettes: 44_200_000, depenses: 26_100_000, effectifs: 26, inscriptions: 52, emprunts: 45 },
  { mois: "Fév",  recettes: 39_800_000, depenses: 23_700_000, effectifs: 27, inscriptions: 28, emprunts: 41 },
  { mois: "Mar",  recettes: 36_500_000, depenses: 22_200_000, effectifs: 27, inscriptions: 19, emprunts: 37 },
  { mois: "Avr",  recettes: 33_100_000, depenses: 20_900_000, effectifs: 27, inscriptions: 14, emprunts: 29 },
  { mois: "Mai",  recettes: 38_450_000, depenses: 21_600_000, effectifs: 28, inscriptions: 22, emprunts: 33 },
]

/* ── Scores modules (Radar) — note /100 ── */
export const SCORE_MODULES = [
  { module: "Finance",       score: 74, objectif: 85 },
  { module: "RH",            score: 82, objectif: 90 },
  { module: "Pédagogie",     score: 68, objectif: 80 },
  { module: "Services",      score: 79, objectif: 85 },
  { module: "Infrastructure",score: 91, objectif: 95 },
  { module: "Conformité",    score: 65, objectif: 80 },
]

/* ── KPIs consolidés ── */
export const KPIS_GLOBAUX = [
  { label: "Recette Mai 2025",     value: "38,4 M GNF",  delta: "+9.9%",    positif: true,  color: "#10B981", icon: "Wallet"       },
  { label: "Effectif actif",       value: "28",          delta: "+3 ce trim", positif: true, color: "#3B82F6", icon: "Users"        },
  { label: "Taux recouvrement",    value: "74%",         delta: "+2 pts",   positif: true,  color: "#C9A84C", icon: "TrendingUp"   },
  { label: "Inscriptions actives", value: "1 847",       delta: "+12.4%",   positif: true,  color: "#8B5CF6", icon: "UserCheck"    },
  { label: "Masse salariale",      value: "71,4 M GNF",  delta: "Mai 2025", positif: null,  color: "#F97316", icon: "Landmark"     },
  { label: "Postes urgents",       value: "2",           delta: "à pourvoir",positif: false, color: "#EF4444", icon: "Briefcase"   },
]

/* ── Health score global ── */
export const HEALTH_SCORE = {
  global: 76,
  finance:  74,
  rh:       82,
  services: 79,
  infra:    91,
}

/* ── Heatmap activité 12 semaines × 7 jours ── */
export const HEATMAP_ACTIVITE: { semaine: number; jour: number; valeur: number }[] = Array.from(
  { length: 12 * 7 }, (_, i) => ({
    semaine: Math.floor(i / 7),
    jour:    i % 7,
    valeur:  i % 7 >= 5 ? seed(i * 3) % 8 : seed(i * 7) % 100 + seed(i * 11) % 30,
  })
)

/* ── Budget vs Réel par unité ── */
export const BUDGET_VS_REEL = [
  { unite: "Informatique",   previsionnel: 18_500_000, reel: 16_200_000 },
  { unite: "Droit",          previsionnel: 14_000_000, reel: 13_800_000 },
  { unite: "Médecine",       previsionnel: 22_000_000, reel: 24_100_000 },
  { unite: "Sciences Éco",   previsionnel: 12_500_000, reel: 11_400_000 },
  { unite: "Administration", previsionnel: 9_000_000,  reel: 8_700_000  },
  { unite: "Génie Civil",    previsionnel: 16_000_000, reel: 17_200_000 },
  { unite: "Pharmacie",      previsionnel: 13_500_000, reel: 12_900_000 },
]

/* ── Répartition moyens de paiement ── */
export const REPARTITION_PAIEMENTS = [
  { name: "Orange Money", value: 38, color: "#F97316" },
  { name: "Espèces",      value: 27, color: "#C9A84C" },
  { name: "Wave",         value: 18, color: "#06B6D4" },
  { name: "Virement",     value: 12, color: "#3B82F6" },
  { name: "Chèque",       value: 5,  color: "#8B5CF6" },
]

/* ── Taux recouvrement par filière ── */
export const RECOUVREMENT_FILIERE = [
  { filiere: "Informatique",  taux: 88, effectif: 312 },
  { filiere: "Droit",         taux: 71, effectif: 428 },
  { filiere: "Médecine",      taux: 92, effectif: 186 },
  { filiere: "Sciences Éco",  taux: 63, effectif: 371 },
  { filiere: "Génie Civil",   taux: 79, effectif: 204 },
  { filiere: "Pharmacie",     taux: 85, effectif: 156 },
]

/* ── Masse salariale 12 mois ── */
export const SERIE_MASSE_SALARIALE = [
  { mois: "Jun",  masse: 68_200_000, primes: 3_100_000 },
  { mois: "Jul",  masse: 68_200_000, primes: 2_800_000 },
  { mois: "Aoû",  masse: 68_200_000, primes: 1_900_000 },
  { mois: "Sep",  masse: 69_500_000, primes: 4_200_000 },
  { mois: "Oct",  masse: 69_500_000, primes: 3_800_000 },
  { mois: "Nov",  masse: 69_500_000, primes: 3_100_000 },
  { mois: "Déc",  masse: 71_200_000, primes: 8_500_000 },
  { mois: "Jan",  masse: 71_200_000, primes: 3_200_000 },
  { mois: "Fév",  masse: 71_200_000, primes: 2_900_000 },
  { mois: "Mar",  masse: 71_200_000, primes: 3_100_000 },
  { mois: "Avr",  masse: 71_400_000, primes: 3_400_000 },
  { mois: "Mai",  masse: 71_400_000, primes: 3_800_000 },
]

/* ── Distribution notes évaluations RH ── */
export const DIST_NOTES_EVAL = [
  { tranche: "0-9",   nb: 1 },
  { tranche: "10-11", nb: 3 },
  { tranche: "12-13", nb: 5 },
  { tranche: "14-15", nb: 6 },
  { tranche: "16-17", nb: 4 },
  { tranche: "18-20", nb: 1 },
]

/* ── Inscriptions par filière ── */
export const INSCRIPTIONS_FILIERE = [
  { filiere: "Informatique",  nouvelle: 45, reinscription: 267 },
  { filiere: "Droit",         nouvelle: 62, reinscription: 366 },
  { filiere: "Médecine",      nouvelle: 28, reinscription: 158 },
  { filiere: "Sciences Éco",  nouvelle: 53, reinscription: 318 },
  { filiere: "Génie Civil",   nouvelle: 31, reinscription: 173 },
  { filiere: "Pharmacie",     nouvelle: 22, reinscription: 134 },
]

/* ── Emprunts bibliothèque par catégorie ── */
export const EMPRUNTS_CATEGORIE = [
  { cat: "Droit",          nb: 68,  color: "#C9A84C" },
  { cat: "Informatique",   nb: 54,  color: "#3B82F6" },
  { cat: "Économie",       nb: 49,  color: "#10B981" },
  { cat: "Médecine",       nb: 42,  color: "#EF4444" },
  { cat: "Science",        nb: 38,  color: "#8B5CF6" },
  { cat: "Histoire",       nb: 31,  color: "#F97316" },
  { cat: "Philosophie",    nb: 24,  color: "#06B6D4" },
  { cat: "Roman",          nb: 18,  color: "#F59E0B" },
]

/* ── Types visites médicales ── */
export const VISITES_TYPE = [
  { type: "Consultation", nb: 11, color: "#3B82F6" },
  { type: "Urgence",      nb: 4,  color: "#EF4444" },
  { type: "Certificat",   nb: 3,  color: "#10B981" },
  { type: "Vaccination",  nb: 2,  color: "#8B5CF6" },
]

/* ── Occupation transport ── */
export const OCCUPATION_TRANSPORT = [
  { ligne: "L1 Kaloum",      capacite: 45, inscrits: 41 },
  { ligne: "L2 Ratoma",      capacite: 40, inscrits: 38 },
  { ligne: "L3 Matoto",      capacite: 50, inscrits: 44 },
  { ligne: "L4 Coyah",       capacite: 35, inscrits: 12 },
  { ligne: "L5 Dubréka",     capacite: 30, inscrits: 27 },
  { ligne: "L6 VIP Express", capacite: 20, inscrits: 18 },
]

/* ── Liste rapports disponibles ── */
export const RAPPORTS_DISPONIBLES = [
  { id: "r1", titre: "Rapport Financier Mensuel",      module: "finance",    icone: "Wallet",     description: "Recettes, dépenses, taux recouvrement par filière" },
  { id: "r2", titre: "Bulletin de Paie Consolidé",     module: "rh",         icone: "FileText",   description: "Fiches de paie de tous les employés — période sélectionnée" },
  { id: "r3", titre: "Rapport d'Effectifs RH",         module: "rh",         icone: "Users",      description: "Effectifs par département, rôles, statuts contractuels" },
  { id: "r4", titre: "Rapport Inscriptions & Scolarité",module: "services",  icone: "UserCheck",  description: "Inscriptions par filière, niveau, type — taux de dossiers validés" },
  { id: "r5", titre: "Activité Bibliothèque",          module: "services",   icone: "BookOpen",   description: "Emprunts, retours, retards par catégorie et par étudiant" },
  { id: "r6", titre: "Rapport Santé & Infirmerie",     module: "services",   icone: "HeartPulse", description: "Visites médicales, alertes, suivi par type de consultation" },
  { id: "r7", titre: "Bilan Budget vs Réel",           module: "finance",    icone: "BarChart2",  description: "Comparatif prévisionnel / réalisé par unité structurelle" },
  { id: "r8", titre: "Rapport Recrutement",            module: "rh",         icone: "Briefcase",  description: "Pipeline candidatures, postes ouverts, taux de conversion" },
  { id: "r9", titre: "Rapport Consolidé Annuel",       module: "global",     icone: "Globe",      description: "Synthèse globale multi-modules — KPIs clés de l'exercice" },
]

/* ── Périodes disponibles ── */
export const PERIODES = [
  { value: "mai_2025",    label: "Mai 2025" },
  { value: "avr_2025",    label: "Avril 2025" },
  { value: "t1_2025",     label: "T1 2025 (Jan–Mar)" },
  { value: "t2_2025",     label: "T2 2025 (Avr–Jun)" },
  { value: "annee_2025",  label: "Année 2025" },
  { value: "annee_2024",  label: "Année 2024" },
]
