/* ─────────────────────────────────────────────────────────
   Services aux Élèves — Mock Data (seeded / déterministe)
───────────────────────────────────────────────────────── */

/* ═══ TYPES ═══ */

export type StatutInscription = "en_attente" | "validé" | "refusé" | "en_révision" | "incomplet"
export type TypeInscription   = "nouvelle" | "réinscription" | "transfert"
export type NiveauEtude       = "L1" | "L2" | "L3" | "M1" | "M2" | "DUT1" | "DUT2" | "BTS1" | "BTS2"
export type StatutEmprunt     = "en_cours" | "retourné" | "en_retard" | "perdu"
export type CategorieGenre    = "Roman" | "Science" | "Histoire" | "Droit" | "Économie" | "Informatique" | "Médecine" | "Philosophie"
export type StatutTransport   = "actif" | "suspendu" | "expiré"
export type ZoneTransport     = "Nord" | "Sud" | "Est" | "Ouest" | "Centre"
export type StatutSante       = "traité" | "en_suivi" | "hospitalisé" | "référé"
export type TypeVisite        = "consultation" | "urgence" | "certificat" | "vaccination"

/* ── Inscription ── */
export interface Candidat {
  id: string
  matricule: string
  nom: string
  prenom: string
  dateNaissance: string
  lieuNaissance: string
  classe: string
  niveau: NiveauEtude
  statut: StatutInscription
  type: TypeInscription
  dateDepot: string
  dateTraitement: string | null
  filiere: string
  moyenne: number | null
  piecesFournies: string[]
  pieceManquante: string | null
  fraisInscription: number
  fraisPayés: boolean
  responsable: string
  contact: string
  commentaire: string | null
}

/* ── Bibliothèque ── */
export interface Livre {
  id: string
  isbn: string
  titre: string
  auteur: string
  editeur: string
  annee: number
  categorie: CategorieGenre
  exemplaires: number
  disponibles: number
  empruntsTotal: number
  cote: string
  image?: string
}

export interface Emprunt {
  id: string
  livreId: string
  livreTitre: string
  livreAuteur: string
  eleveNom: string
  eleveMatricule: string
  dateEmprunt: string
  dateRetourPrevue: string
  dateRetourReelle: string | null
  statut: StatutEmprunt
  retardJours: number
  amende: number
}

/* ── Transport ── */
export interface LigneTransport {
  id: string
  numero: string
  nom: string
  zone: ZoneTransport
  arrets: string[]
  heureDepart: string
  heureArrivee: string
  capacite: number
  inscrits: number
  tarif: number
  actif: boolean
}

export interface AbonnementTransport {
  id: string
  eleveNom: string
  eleveMatricule: string
  ligneId: string
  ligneNom: string
  zone: ZoneTransport
  dateDebut: string
  dateFin: string
  statut: StatutTransport
  tarif: number
  paye: boolean
}

/* ── Cafétéria ── */
export interface MenuJour {
  id: string
  jour: string
  date: string
  entree: string
  plat: string
  dessert: string
  boisson: string
  prix: number
  vegOption: boolean
  reservations: number
}

export interface AbonnementRepas {
  id: string
  eleveNom: string
  eleveMatricule: string
  formule: "mensuel" | "hebdo" | "journalier"
  repasInclus: ("petit_dej" | "dejeuner" | "diner")[]
  dateDebut: string
  dateFin: string
  montant: number
  paye: boolean
  repasPris: number
  repasTotal: number
}

/* ── Santé ── */
export interface VisiteMedicale {
  id: string
  eleveNom: string
  eleveMatricule: string
  eleveClasse: string
  date: string
  heure: string
  type: TypeVisite
  motif: string
  diagnostic: string
  traitement: string
  statut: StatutSante
  infirmier: string
  suiviRequis: boolean
  alerteParents: boolean
}

/* ── KPIs ── */
export interface KpiService {
  label: string
  value: string
  delta: string
  positif: boolean
  icon: string
  color: string
}

/* ═══ HELPERS ═══ */
export function formatGNF(n: number): string {
  return `${n.toLocaleString("fr-FR")} GNF`
}

/* ═══ DATA ═══ */

/* ── Candidats (30) ── */
const FILIERES = ["Droit Privé", "Informatique", "Médecine Générale", "Sciences Éco", "Génie Civil", "Pharmacie", "Lettres Modernes", "Mathématiques"]
const CLASSES_LIST: NiveauEtude[] = ["L1","L2","L3","M1","M2","DUT1","DUT2","BTS1","BTS2"]
const STATUTS: StatutInscription[] = ["en_attente","validé","refusé","en_révision","incomplet"]
const TYPES: TypeInscription[] = ["nouvelle","réinscription","transfert"]
const NOMS = ["Diallo","Barry","Camara","Touré","Sylla","Konaté","Bah","Keita","Traoré","Soumah","Kourouma","Cissé","Doumbouya","Condé","Guilavogui"]
const PRENOMS = ["Mamadou","Fatoumata","Ibrahima","Mariama","Oumar","Aminata","Alpha","Kadiatou","Seydou","Hawa","Aboubacar","Nene","Fodé","Saran","Thierno"]

export const CANDIDATS: Candidat[] = Array.from({ length: 30 }, (_, i) => {
  const seed = i + 1
  const statut = STATUTS[seed % STATUTS.length]
  const type   = TYPES[seed % TYPES.length]
  const niveau = CLASSES_LIST[seed % CLASSES_LIST.length]
  const nom    = NOMS[seed % NOMS.length]
  const prenom = PRENOMS[(seed * 3) % PRENOMS.length]
  const filiere = FILIERES[seed % FILIERES.length]
  const jj = String(1 + (seed % 28)).padStart(2, "0")
  const mm = String(1 + (seed % 12)).padStart(2, "0")
  return {
    id: `cand-${seed}`,
    matricule: `UC-2025-${String(seed).padStart(4, "0")}`,
    nom, prenom,
    dateNaissance: `200${seed % 6}-${mm}-${jj}`,
    lieuNaissance: ["Conakry","Labé","Kindia","Kankan","Faranah"][seed % 5],
    classe: `${niveau} — ${filiere}`,
    niveau, filiere,
    statut, type,
    dateDepot: `2025-09-${String(1 + (seed % 25)).padStart(2, "0")}`,
    dateTraitement: statut !== "en_attente" ? `2025-09-${String(10 + (seed % 18)).padStart(2, "0")}` : null,
    moyenne: statut === "validé" ? 11 + (seed % 9) : statut === "refusé" ? 5 + (seed % 5) : null,
    piecesFournies: ["CNI","Bac","Photo","Fiche"].slice(0, 2 + (seed % 3)),
    pieceManquante: statut === "incomplet" ? ["Certificat médical","Relevé de notes","Attestation"][seed % 3] : null,
    fraisInscription: [150_000, 200_000, 250_000, 300_000][seed % 4],
    fraisPayés: seed % 3 !== 0,
    responsable: PRENOMS[(seed * 2) % PRENOMS.length] + " " + NOMS[(seed + 5) % NOMS.length],
    contact: `+224 6${String(20 + seed % 80).padStart(2,"0")} ${String(10 + seed % 90).padStart(2,"0")} ${String(10 + (seed * 7) % 90).padStart(2,"0")}`,
    commentaire: seed % 4 === 0 ? "Dossier à vérifier avant validation" : null,
  }
})

/* ── Livres (20) ── */
const TITRES = [
  "Introduction au Droit Civil","Algorithmes et Structures de Données","Atlas d'Anatomie Humaine",
  "Macroéconomie Avancée","Résistance des Matériaux","Pharmacologie Clinique",
  "Littérature Africaine Contemporaine","Analyse Mathématique T.1","Droit des Contrats",
  "Intelligence Artificielle — Fondements","Histoire de l'Afrique Occidentale",
  "Statistiques pour l'Ingénieur","Biochimie Médicale","Économie du Développement",
  "Géotechnique & Fondations","Bases de Données Relationnelles","Droit International Public",
  "Chimie Organique","Marketing Stratégique","Physique Quantique"
]
const AUTEURS = [
  "A. Kourouma","B. Diallo","C. Martin","D. Touré","E. Sylla",
  "F. Barry","G. Keita","H. Camara","I. Bah","J. Traoré"
]
const CATEGORIES: CategorieGenre[] = ["Droit","Informatique","Médecine","Économie","Science","Histoire","Philosophie","Informatique","Droit","Économie","Histoire","Science","Médecine","Économie","Science","Informatique","Droit","Science","Économie","Science"]

export const LIVRES: Livre[] = TITRES.map((titre, i) => ({
  id: `livre-${i + 1}`,
  isbn: `978-2-${String(700 + i).padStart(3,"0")}-${String(1000 + i * 37)}-${i % 9}`,
  titre,
  auteur: AUTEURS[i % AUTEURS.length],
  editeur: ["Présence Africaine","L'Harmattan","Dunod","PUF","Masson"][i % 5],
  annee: 2015 + (i % 9),
  categorie: CATEGORIES[i],
  exemplaires: 3 + (i % 5),
  disponibles: Math.max(0, 2 + (i % 4) - (i % 2)),
  empruntsTotal: 10 + i * 3,
  cote: `${CATEGORIES[i].slice(0,3).toUpperCase()}-${String(100 + i).padStart(3,"0")}`,
}))

/* ── Emprunts (25) ── */
export const EMPRUNTS: Emprunt[] = Array.from({ length: 25 }, (_, i) => {
  const seed = i + 1
  const livre = LIVRES[seed % LIVRES.length]
  const retard = seed % 5 === 0
  const rendu  = seed % 3 === 0
  const perdu  = seed % 11 === 0
  const statut: StatutEmprunt = perdu ? "perdu" : retard ? "en_retard" : rendu ? "retourné" : "en_cours"
  const retardJ = retard ? 3 + (seed % 12) : 0
  return {
    id: `emp-${seed}`,
    livreId: livre.id,
    livreTitre: livre.titre,
    livreAuteur: livre.auteur,
    eleveNom: `${PRENOMS[seed % PRENOMS.length]} ${NOMS[(seed * 2) % NOMS.length]}`,
    eleveMatricule: `UC-2024-${String(seed * 7).padStart(4,"0")}`,
    dateEmprunt: `2025-0${1 + (seed % 9)}-${String(1 + (seed % 25)).padStart(2,"0")}`,
    dateRetourPrevue: `2025-0${2 + (seed % 8)}-${String(10 + (seed % 18)).padStart(2,"0")}`,
    dateRetourReelle: rendu ? `2025-0${2 + (seed % 8)}-${String(8 + (seed % 15)).padStart(2,"0")}` : null,
    statut,
    retardJours: retardJ,
    amende: retardJ * 1_000,
  }
})

/* ── Lignes de Transport (6) ── */
const LIGNES_DATA = [
  { numero:"L1", nom:"Ligne Nord — Ratoma",   zone:"Nord" as ZoneTransport, arrets:["Terminus Ratoma","Bambeto","Dar-es-Salam","Hamdallaye","Université"], heureDepart:"06:30", heureArrivee:"07:45", capacite:45, inscrits:38, tarif:50_000 },
  { numero:"L2", nom:"Ligne Sud — Matoto",    zone:"Sud"  as ZoneTransport, arrets:["Matoto Centre","Kobaya","Cosa","Sonfonia","Université"],               heureDepart:"06:15", heureArrivee:"07:30", capacite:45, inscrits:42, tarif:55_000 },
  { numero:"L3", nom:"Ligne Est — Kaloum",    zone:"Est"  as ZoneTransport, arrets:["Kaloum","Boulbinet","Coronthie","Port","Université"],                   heureDepart:"06:45", heureArrivee:"07:40", capacite:30, inscrits:28, tarif:45_000 },
  { numero:"L4", nom:"Ligne Ouest — Coyah",   zone:"Ouest"as ZoneTransport, arrets:["Coyah Ville","Carrefour","Kagbelen","Pont","Université"],               heureDepart:"05:45", heureArrivee:"07:20", capacite:60, inscrits:55, tarif:80_000 },
  { numero:"L5", nom:"Ligne Centre — Dixinn", zone:"Centre"as ZoneTransport,arrets:["Dixinn Centre","INRAP","Minière","Donka","Université"],                 heureDepart:"06:50", heureArrivee:"07:30", capacite:35, inscrits:31, tarif:40_000 },
  { numero:"L6", nom:"Ligne VIP Express",     zone:"Centre"as ZoneTransport,arrets:["Nongo","Kipé","Sonfonia","Université"],                                 heureDepart:"07:00", heureArrivee:"07:25", capacite:20, inscrits:18, tarif:120_000 },
]

export const LIGNES_TRANSPORT: LigneTransport[] = LIGNES_DATA.map((l, i) => ({
  id: `ligne-${i + 1}`, ...l, actif: i !== 3,
}))

/* ── Abonnements Transport (20) ── */
export const ABONNEMENTS_TRANSPORT: AbonnementTransport[] = Array.from({ length: 20 }, (_, i) => {
  const seed = i + 1
  const ligne = LIGNES_TRANSPORT[seed % LIGNES_TRANSPORT.length]
  const statuts: StatutTransport[] = ["actif","actif","actif","suspendu","expiré"]
  return {
    id: `abt-${seed}`,
    eleveNom: `${PRENOMS[seed % PRENOMS.length]} ${NOMS[(seed * 3) % NOMS.length]}`,
    eleveMatricule: `UC-2024-${String(seed * 11).padStart(4,"0")}`,
    ligneId: ligne.id,
    ligneNom: ligne.nom,
    zone: ligne.zone,
    dateDebut: "2025-09-01",
    dateFin: "2026-06-30",
    statut: statuts[seed % statuts.length],
    tarif: ligne.tarif,
    paye: seed % 4 !== 0,
  }
})

/* ── Menus Semaine ── */
const JOURS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi"]
const PLATS = ["Riz sauce arachide","Thiéboudiène","Foutou & sauce graine","Ragout de viande & attiéké","Soupe kandia & riz"]
const ENTREES = ["Salade de tomates","Soupe légumes","Crudités","Salade de concombre","Potage"]
const DESSERTS = ["Mangue fraîche","Yaourt","Banane","Pastèque","Jus de bissap"]

export const MENUS_SEMAINE: MenuJour[] = JOURS.map((jour, i) => ({
  id: `menu-${i + 1}`,
  jour,
  date: `2025-10-${String(6 + i).padStart(2,"0")}`,
  entree: ENTREES[i],
  plat: PLATS[i],
  dessert: DESSERTS[i],
  boisson: "Eau minérale",
  prix: 15_000,
  vegOption: i % 2 === 0,
  reservations: 80 + i * 12,
}))

/* ── Abonnements Repas (15) ── */
export const ABONNEMENTS_REPAS: AbonnementRepas[] = Array.from({ length: 15 }, (_, i) => {
  const seed = i + 1
  const formules = ["mensuel","mensuel","hebdo","journalier"] as const
  const formule = formules[seed % formules.length]
  const montants = { mensuel: 180_000, hebdo: 50_000, journalier: 15_000 }
  const repasTotal = formule === "mensuel" ? 20 : formule === "hebdo" ? 5 : 1
  return {
    id: `repas-${seed}`,
    eleveNom: `${PRENOMS[(seed * 5) % PRENOMS.length]} ${NOMS[(seed * 4) % NOMS.length]}`,
    eleveMatricule: `UC-2024-${String(seed * 13).padStart(4,"0")}`,
    formule,
    repasInclus: formule === "mensuel" ? ["petit_dej","dejeuner"] : ["dejeuner"],
    dateDebut: "2025-10-01",
    dateFin: formule === "mensuel" ? "2025-10-31" : formule === "hebdo" ? "2025-10-07" : "2025-10-06",
    montant: montants[formule],
    paye: seed % 3 !== 0,
    repasPris: Math.floor(repasTotal * 0.6),
    repasTotal,
  }
})

/* ── Visites Médicales (20) ── */
const MOTIFS = ["Fièvre et maux de tête","Douleurs abdominales","Blessure sportive","Contrôle de santé","Certificat médical","Vaccination anti-paludéenne","Malaise en cours","Allergie cutanée","Demande de dispense EPS","Suivi traitement chronique"]
const DIAGNOSTICS = ["Paludisme léger","Gastrite","Entorse légère","Bonne santé générale","Apte","Vacciné","Hypoglycémie","Dermatite","Dispensé 30 jours","Sous traitement"]
const TRAITEMENTS = ["Coartem 3j","Oméprazole + repos","Bandage + anti-douleur","Aucun","Certificat délivré","Vaccin administré","Sucre + repos 1h","Crème corticoïde","Certificat dispensé","Suivi médecin externe"]
const TYPES_VISITE: TypeVisite[] = ["consultation","urgence","certificat","vaccination","consultation","consultation","urgence","consultation","certificat","consultation"]

export const VISITES: VisiteMedicale[] = Array.from({ length: 20 }, (_, i) => {
  const seed = i + 1
  const statuts: StatutSante[] = ["traité","traité","traité","en_suivi","référé","traité"]
  return {
    id: `visite-${seed}`,
    eleveNom: `${PRENOMS[(seed * 7) % PRENOMS.length]} ${NOMS[(seed * 6) % NOMS.length]}`,
    eleveMatricule: `UC-2024-${String(seed * 17).padStart(4,"0")}`,
    eleveClasse: ["L1 Droit","L2 Info","M1 Médecine","L3 Éco"][seed % 4],
    date: `2025-10-${String(1 + (seed % 25)).padStart(2,"0")}`,
    heure: `${String(7 + (seed % 10)).padStart(2,"0")}:${seed % 2 === 0 ? "00" : "30"}`,
    type: TYPES_VISITE[seed % TYPES_VISITE.length],
    motif: MOTIFS[seed % MOTIFS.length],
    diagnostic: DIAGNOSTICS[seed % DIAGNOSTICS.length],
    traitement: TRAITEMENTS[seed % TRAITEMENTS.length],
    statut: statuts[seed % statuts.length],
    infirmier: ["Mme Diallo","M. Barry","Mme Camara"][seed % 3],
    suiviRequis: seed % 4 === 0,
    alerteParents: seed % 5 === 0,
  }
})

/* ── KPIs Services ── */
export const KPI_SERVICES: KpiService[] = [
  { label: "Inscriptions actives",   value: "1 847",    delta: "+12.4%",  positif: true,  icon: "UserCheck",  color: "#10B981" },
  { label: "Dossiers en attente",    value: "43",       delta: "-8 ce sem",positif: true,  icon: "ClipboardList",color: "#C9A84C" },
  { label: "Livres empruntés",       value: "312",      delta: "+24",     positif: true,  icon: "BookOpen",   color: "#3B82F6" },
  { label: "Abonnés transport",      value: "212",      delta: "88%",     positif: true,  icon: "Bus",        color: "#8B5CF6" },
  { label: "Repas servis / sem.",    value: "2 340",    delta: "+7.2%",   positif: true,  icon: "UtensilsCrossed", color: "#F97316" },
  { label: "Consultations / mois",   value: "87",       delta: "+3",      positif: false, icon: "HeartPulse", color: "#EF4444" },
]

/* ── Statistiques inscriptions ── */
export const STATS_INSCRIPTIONS = {
  total: 30,
  validés: CANDIDATS.filter(c => c.statut === "validé").length,
  enAttente: CANDIDATS.filter(c => c.statut === "en_attente").length,
  refusés: CANDIDATS.filter(c => c.statut === "refusé").length,
  incomplets: CANDIDATS.filter(c => c.statut === "incomplet").length,
  enRévision: CANDIDATS.filter(c => c.statut === "en_révision").length,
  parType: {
    nouvelle:      CANDIDATS.filter(c => c.type === "nouvelle").length,
    réinscription: CANDIDATS.filter(c => c.type === "réinscription").length,
    transfert:     CANDIDATS.filter(c => c.type === "transfert").length,
  },
}
