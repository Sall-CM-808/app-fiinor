import { MOCK_BULLETIN, type BulletinData, type BulletinVerdict } from "./BulletinPreview"

const PRENOMS = ["Amara","Sofia","Yusuf","Clémentine","Ibrahima","Léa","Mohamed","Jade","Kwame","Inès","Seydou","Emma","Oumar","Chloé","Fatou"]
const NOMS    = ["Diallo","Müller","Traoré","Leblanc","Koné","Rousseau","Ba","Dupont","Toure","Bernard","Camara","Petit","Bah","Moreau","Sow"]
const VERDICTS: BulletinVerdict[] = ["admis","admis","admis","admis","admis","admis","rattrapage","rattrapage","rattrapage","ajourné","admis","admis","admis","rattrapage","admis"]

function seededRng(seed: number) {
  let s = seed
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = seededRng(99)
function makeMoy(): number { return Math.round((rng() * 12 + 8) * 100) / 100 }

export const MOCK_LIST: BulletinData[] = Array.from({ length: 15 }, (_, i) => {
  const moy = makeMoy()
  return {
    ...MOCK_BULLETIN,
    etudiantNom: NOMS[i % NOMS.length],
    etudiantPrenom: PRENOMS[i % PRENOMS.length],
    matricule: `M${String(20240000 + i).padStart(8, "0")}`,
    moyenneGenerale: moy,
    rang: i + 1,
    verdict: VERDICTS[i % VERDICTS.length],
    mention: moy >= 16 ? "Excellent" : moy >= 14 ? "Très bien" : moy >= 12 ? "Bien" : moy >= 10 ? "Assez bien" : "Passable",
  }
})
