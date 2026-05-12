/* ─────────────────────────────────────────────────────
   parametres-mock-data.ts — Module Paramètres
─────────────────────────────────────────────────────── */

/* ── Types ── */
export type Role = "super_admin" | "admin" | "directeur" | "enseignant" | "comptable" | "rh" | "lecture"
export type StatutCompte = "actif" | "inactif" | "suspendu"
export type TypeFormule = "moyenne" | "admission" | "gpa" | "competences"
export type TypeBulletin = "classique" | "gpa" | "competences" | "ects"
export type StatutPayout = "en_attente" | "approuvé" | "payé" | "refusé"

/* ── Config établissement ── */
export const ETABLISSEMENT = {
  nom:         "Université de Conakry",
  sigle:       "UNIV-CKY",
  type:        "Université",
  pays:        "Guinée",
  ville:       "Conakry",
  adresse:     "Route du Niger, Landréah, Conakry",
  telephone:   "+224 625 00 00 00",
  email:       "direction@univ-conakry.gn",
  siteWeb:     "https://univ-conakry.gn",
  devise:      "GNF",
  langue:      "fr",
  anneeActive: "2024-2025",
  couleurPrimaire: "#C9A84C",
  couleurSecondaire: "#0D1F35",
  logoUrl:     null as string | null,
  fuseau:      "Africa/Conakry",
  devises:     ["GNF", "XOF", "EUR", "USD"],
}

/* ── Utilisateurs ── */
export interface Utilisateur {
  id: string
  prenom: string
  nom: string
  email: string
  role: Role
  statut: StatutCompte
  derniereConnexion: string
  creeLe: string
  unite?: string
}

export const ROLES_CFG: Record<Role, { lbl: string; color: string; perms: string[] }> = {
  super_admin: { lbl: "Super Admin",  color: "#EF4444", perms: ["Accès total","Gestion tenants","Config système"] },
  admin:       { lbl: "Admin",        color: "#F97316", perms: ["Gestion établissement","Utilisateurs","Rapports"] },
  directeur:   { lbl: "Directeur",    color: "#C9A84C", perms: ["Pédagogie","Bulletins","Délibérations"] },
  enseignant:  { lbl: "Enseignant",   color: "#3B82F6", perms: ["Notes","Présences","Emploi du temps"] },
  comptable:   { lbl: "Comptable",    color: "#10B981", perms: ["Finance","Transactions","Rapports fin."] },
  rh:          { lbl: "RH Manager",   color: "#8B5CF6", perms: ["Personnel","Contrats","Congés","Recrutement"] },
  lecture:     { lbl: "Lecture seule",color: "#6B7280", perms: ["Consultation","Export lecture"] },
}

const seed = (n: number) => ((n * 1103515245 + 12345) & 0x7fffffff) % 100
const NOMS    = ["Diallo","Barry","Camara","Touré","Sylla","Konaté","Bah","Keita"]
const PRENOMS = ["Mamadou","Fatoumata","Ibrahima","Mariama","Oumar","Aminata","Alpha","Kadiatou"]
const ROLES_LIST: Role[] = ["admin","directeur","enseignant","comptable","rh","lecture","enseignant","directeur"]

export const UTILISATEURS: Utilisateur[] = Array.from({ length: 12 }, (_, i) => ({
  id: `u-${i + 1}`,
  prenom: PRENOMS[i % PRENOMS.length],
  nom:    NOMS[i % NOMS.length],
  email:  `${PRENOMS[i % PRENOMS.length].toLowerCase()}.${NOMS[i % NOMS.length].toLowerCase()}@univ-conakry.gn`,
  role:   i === 0 ? "super_admin" : ROLES_LIST[i % ROLES_LIST.length],
  statut: seed(i * 7) > 15 ? "actif" : seed(i * 11) > 50 ? "inactif" : "suspendu",
  derniereConnexion: `2025-05-${String(12 - (i % 10)).padStart(2,"0")} ${String(8 + (i % 12)).padStart(2,"0")}:${String((i * 7) % 60).padStart(2,"0")}`,
  creeLe: `2024-${String(1 + (i % 12)).padStart(2,"0")}-${String(1 + (i % 28)).padStart(2,"0")}`,
  unite: ["Administration","Informatique","Droit","Médecine","Sciences Éco"][i % 5],
}))

/* ── Formules de notation ── */
export interface Formule {
  id: string
  nom: string
  type: TypeFormule
  expression: string
  description: string
  scope: string
  active: boolean
  propagate: boolean
  testResultat?: string
}

export const FORMULES: Formule[] = [
  {
    id: "f1",
    nom: "Moyenne générale classique",
    type: "moyenne",
    expression: "(DS * 0.3 + examen * 0.7) / 20",
    description: "Pondération 30% DS / 70% examen final, résultat sur 20",
    scope: "Tous départements",
    active: true,
    propagate: true,
    testResultat: "14.2 / 20",
  },
  {
    id: "f2",
    nom: "GPA 4.0 — Ingénieurs",
    type: "gpa",
    expression: "somme(note * credits) / somme(credits)",
    description: "Calcul GPA pondéré par les crédits ECTS de chaque UE",
    scope: "Génie Civil",
    active: true,
    propagate: false,
    testResultat: "3.2 / 4.0",
  },
  {
    id: "f3",
    nom: "Admission avec compensation",
    type: "admission",
    expression: "(moy_semestre >= 10) OR (moy_annee >= 12 AND matieres_sous_10 <= 2)",
    description: "Admission directe OU rattrapage avec compensation annuelle",
    scope: "Tous départements",
    active: true,
    propagate: true,
    testResultat: "true (admis)",
  },
  {
    id: "f4",
    nom: "Bonus assiduité",
    type: "moyenne",
    expression: "(note_brute * coeff) + (presence_pct > 0.9 ? 1.5 : 0)",
    description: "Bonus de 1.5 points pour présence > 90%",
    scope: "Informatique",
    active: false,
    propagate: false,
    testResultat: "15.5 / 20",
  },
  {
    id: "f5",
    nom: "Compétences professionnelles",
    type: "competences",
    expression: "validées / total_competences >= 0.75",
    description: "Seuil de validation : 75% des compétences acquises",
    scope: "Formation pro",
    active: true,
    propagate: false,
    testResultat: "validé (80%)",
  },
]

/* ── Paramétrage bulletins ── */
export interface ParametrageBulletin {
  id: string
  nom: string
  type: TypeBulletin
  metriques: string[]
  langues: string[]
  afficherRang: boolean
  afficherMention: boolean
  arrondissement: number
  actif: boolean
}

export const PARAMETRAGES_BULLETINS: ParametrageBulletin[] = [
  {
    id: "pb1",
    nom: "Bulletin Classique /20",
    type: "classique",
    metriques: ["moyenne", "rang", "mention", "absences"],
    langues: ["fr"],
    afficherRang: true,
    afficherMention: true,
    arrondissement: 2,
    actif: true,
  },
  {
    id: "pb2",
    nom: "Transcript GPA 4.0",
    type: "gpa",
    metriques: ["gpa", "credits_ects", "rang"],
    langues: ["fr", "en"],
    afficherRang: true,
    afficherMention: false,
    arrondissement: 2,
    actif: true,
  },
  {
    id: "pb3",
    nom: "Livret Compétences",
    type: "competences",
    metriques: ["competences_validées", "competences_encours", "taux_validation"],
    langues: ["fr"],
    afficherRang: false,
    afficherMention: false,
    arrondissement: 0,
    actif: false,
  },
]

/* ── Audit log ── */
export interface AuditEntry {
  id: string
  utilisateur: string
  action: string
  module: string
  details: string
  ip: string
  date: string
  niveau: "info" | "warning" | "critical"
}

export const AUDIT_LOG: AuditEntry[] = [
  { id:"a1",  utilisateur:"Mamadou Diallo",   action:"Connexion",             module:"Auth",     details:"Connexion réussie depuis Chrome 124",     ip:"196.14.12.45",  date:"2025-05-12 08:14", niveau:"info"     },
  { id:"a2",  utilisateur:"Fatoumata Barry",  action:"Modification formule",  module:"Formules", details:"Formule 'Moyenne classique' mise à jour",  ip:"196.14.12.88",  date:"2025-05-12 08:32", niveau:"warning"  },
  { id:"a3",  utilisateur:"Ibrahima Camara",  action:"Export PDF",            module:"Rapports", details:"Rapport financier Mai 2025 exporté",       ip:"41.202.219.11", date:"2025-05-12 09:01", niveau:"info"     },
  { id:"a4",  utilisateur:"Système",          action:"Calcul moyennes",       module:"Pédagogie",details:"Calcul automatique — 1 847 étudiants",     ip:"localhost",     date:"2025-05-12 09:15", niveau:"info"     },
  { id:"a5",  utilisateur:"Mariama Touré",    action:"Ajout employé",         module:"RH",       details:"Nouvel employé: Oumar Konaté (CDI)",       ip:"196.14.12.22",  date:"2025-05-12 10:44", niveau:"info"     },
  { id:"a6",  utilisateur:"Mamadou Diallo",   action:"Tentative accès refusé",module:"Auth",     details:"Accès non autorisé — tenant externe",      ip:"41.202.200.5",  date:"2025-05-12 11:02", niveau:"critical" },
  { id:"a7",  utilisateur:"Admin Système",    action:"Backup BD",             module:"Infra",    details:"Sauvegarde complète — 2.4 GB — succès",   ip:"localhost",     date:"2025-05-11 23:00", niveau:"info"     },
  { id:"a8",  utilisateur:"Aminata Sylla",    action:"Approbation congé",     module:"RH",       details:"Congé annuel Alpha Bah — 10 jours approuvé",ip:"196.14.12.77", date:"2025-05-11 16:30", niveau:"info"    },
  { id:"a9",  utilisateur:"Système",          action:"Détection fraude",      module:"Affiliation",details:"Click suspect IP 176.12.x — bloqué",    ip:"176.12.44.33",  date:"2025-05-11 14:22", niveau:"critical" },
  { id:"a10", utilisateur:"Alpha Keita",      action:"Publication bulletin",  module:"Bulletins",details:"Bulletins S2 2025 publiés — 312 étudiants",ip:"196.14.12.55", date:"2025-05-10 17:05", niveau:"info"     },
]

/* ── Sessions actives ── */
export const SESSIONS_ACTIVES = [
  { id:"s1", utilisateur:"Mamadou Diallo",  role:"super_admin", device:"Chrome 124 — Windows 11", ip:"196.14.12.45", depuis:"2025-05-12 08:14", courante: true  },
  { id:"s2", utilisateur:"Fatoumata Barry", role:"directeur",   device:"Firefox 125 — macOS",     ip:"196.14.12.88", depuis:"2025-05-12 08:28", courante: false },
  { id:"s3", utilisateur:"Ibrahima Camara", role:"comptable",   device:"Safari — iPhone 15",      ip:"41.202.219.11",depuis:"2025-05-12 09:00", courante: false },
  { id:"s4", utilisateur:"Aminata Sylla",   role:"rh",          device:"Chrome 123 — Ubuntu",     ip:"196.14.12.77", depuis:"2025-05-11 16:28", courante: false },
]

/* ── Affiliation / Referral ── */
export interface AffiliateLink {
  id: string
  code: string
  url: string
  clics: number
  conversions: number
  commissionsGagnees: number
  actif: boolean
  creeLe: string
}

export interface CommissionEntry {
  id: string
  date: string
  description: string
  montant: number
  statut: StatutPayout
  type: "ponctuel" | "récurrent"
}

export const AFFILIATE_LINKS: AffiliateLink[] = [
  { id:"l1", code:"UNIV-CKY-2025",   url:"https://app.fiinor.com/ref/UNIV-CKY-2025",   clics:124, conversions:3, commissionsGagnees:1_500_000, actif:true,  creeLe:"2025-01-15" },
  { id:"l2", code:"ALPHA-DIALLO-EDU",url:"https://app.fiinor.com/ref/ALPHA-DIALLO-EDU", clics:47,  conversions:1, commissionsGagnees:500_000,   actif:true,  creeLe:"2025-03-02" },
]

export const COMMISSIONS: CommissionEntry[] = [
  { id:"c1", date:"2025-05-01", description:"Conversion Lycée Donka — abonnement annuel",      montant:1_500_000, statut:"payé",        type:"ponctuel"  },
  { id:"c2", date:"2025-04-01", description:"Récurrence Collège Matam — mois 4",               montant:250_000,   statut:"payé",        type:"récurrent" },
  { id:"c3", date:"2025-03-01", description:"Récurrence Collège Matam — mois 3",               montant:250_000,   statut:"payé",        type:"récurrent" },
  { id:"c4", date:"2025-05-10", description:"Conversion Institut Technique Conakry",           montant:500_000,   statut:"en_attente",  type:"ponctuel"  },
  { id:"c5", date:"2025-05-15", description:"Récurrence Lycée Donka — mois 5",                 montant:150_000,   statut:"en_attente",  type:"récurrent" },
]

export const WALLET_SOLDE = COMMISSIONS.filter(c => c.statut === "payé").reduce((s,c) => s + c.montant, 0)

/* ── Formatage GNF ── */
export function formatGNF(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M GNF`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K GNF`
  return `${n} GNF`
}
