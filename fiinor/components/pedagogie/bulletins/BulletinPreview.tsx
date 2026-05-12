"use client"

import { motion } from "framer-motion"
import {
  CheckCircle2, AlertTriangle, XCircle, Shield,
} from "lucide-react"

/* ─── Types ─── */
export interface BulletinMatiere {
  nom: string
  noteObtenue: number
  noteMax: number
  coefficient: number
  appreciation: string
  enseignant: string
  rang?: number
  moyenneClasse?: number
}

export type BulletinVerdict = "admis" | "rattrapage" | "ajourné" | "exclu"

export interface BulletinData {
  /* Étudiant */
  etudiantNom: string
  etudiantPrenom: string
  matricule: string
  dateNaissance: string
  lieuNaissance?: string

  /* Contexte */
  classe: string
  anneeAcademique: string
  semestre: string
  periode: string

  /* Établissement */
  etablissementNom: string
  etablissementVille?: string
  etablissementLogo?: string

  /* Résultats */
  matieres: BulletinMatiere[]
  moyenneGenerale: number
  moyenneGeneraleMax: number
  rang: number
  effectif: number
  nbAbsences: number
  nbRetards: number

  /* Verdict */
  verdict: BulletinVerdict
  mention?: string
  commentaireJury?: string

  /* Méta */
  datePublication: string
  directeur?: string
  cachet?: boolean
}

/* ─── Config verdict ─── */
const VERDICT_CFG: Record<BulletinVerdict, {
  label: string; color: string; bg: string; border: string; icon: React.ElementType
}> = {
  admis:      { label: "ADMIS",      color: "#10B981", bg: "#f0fdf4", border: "#10B981", icon: CheckCircle2  },
  rattrapage: { label: "RATTRAPAGE", color: "#D97706", bg: "#fffbeb", border: "#D97706", icon: AlertTriangle },
  ajourné:    { label: "AJOURNÉ",    color: "#DC2626", bg: "#fef2f2", border: "#DC2626", icon: XCircle       },
  exclu:      { label: "EXCLU",      color: "#7C3AED", bg: "#f5f3ff", border: "#7C3AED", icon: Shield        },
}

const MENTION_CFG: Record<string, { color: string }> = {
  "Passable":     { color: "#6B7280" },
  "Assez bien":   { color: "#3B82F6" },
  "Bien":         { color: "#10B981" },
  "Très bien":    { color: "#F59E0B" },
  "Excellent":    { color: "#7C3AED" },
}

function getMention(moy: number): string {
  if (moy >= 16) return "Excellent"
  if (moy >= 14) return "Très bien"
  if (moy >= 12) return "Bien"
  if (moy >= 10) return "Assez bien"
  return "Passable"
}

/* ─── Note color (for print-friendly: dark text on white background) ─── */
function noteColor(note: number, max: number): string {
  const ratio = note / max
  if (ratio >= 0.7) return "#059669"
  if (ratio >= 0.5) return "#D97706"
  return "#DC2626"
}

/* ─── Appreciation helper ─── */
function appreciationColor(appr: string): string {
  const low = appr.toLowerCase()
  if (low.includes("excel") || low.includes("très bien") || low.includes("remarq")) return "#059669"
  if (low.includes("bien") || low.includes("satisf")) return "#2563EB"
  if (low.includes("pass") || low.includes("moyen") || low.includes("peut mieux")) return "#D97706"
  return "#6B7280"
}

/* ─── Mock bulletin ─── */
export const MOCK_BULLETIN: BulletinData = {
  etudiantNom: "DIALLO",
  etudiantPrenom: "Amara Ibrahima",
  matricule: "M20240007",
  dateNaissance: "2005-03-14",
  lieuNaissance: "Conakry",
  classe: "Terminale A",
  anneeAcademique: "2025–2026",
  semestre: "Semestre 2",
  periode: "Février – Juin 2026",
  etablissementNom: "Fiinor Academy",
  etablissementVille: "Conakry",
  matieres: [
    { nom: "Mathématiques",     noteObtenue: 14.5, noteMax: 20, coefficient: 4, appreciation: "Très bien. Bonne maîtrise des concepts fondamentaux.",  enseignant: "M. Kouyaté",   rang: 3,  moyenneClasse: 11.2 },
    { nom: "Physique-Chimie",   noteObtenue: 12.0, noteMax: 20, coefficient: 3, appreciation: "Bien. Des efforts constants à poursuivre.",              enseignant: "Mme Camara",   rang: 7,  moyenneClasse: 10.8 },
    { nom: "Informatique",      noteObtenue: 17.5, noteMax: 20, coefficient: 3, appreciation: "Excellent. Travail remarquable, keep it up!",            enseignant: "M. Bah",       rang: 1,  moyenneClasse: 12.4 },
    { nom: "Anglais",           noteObtenue: 11.5, noteMax: 20, coefficient: 2, appreciation: "Passable. Doit améliorer l'expression écrite.",          enseignant: "Mme Traoré",   rang: 12, moyenneClasse: 10.5 },
    { nom: "Français",          noteObtenue: 9.5,  noteMax: 20, coefficient: 2, appreciation: "Peut mieux faire. Revoir l'orthographe.",                enseignant: "M. Soumah",    rang: 18, moyenneClasse: 9.8  },
    { nom: "Histoire-Géo",      noteObtenue: 13.0, noteMax: 20, coefficient: 2, appreciation: "Satisfaisant. Bonne culture générale.",                 enseignant: "Mme Diakité",  rang: 6,  moyenneClasse: 10.1 },
  ],
  moyenneGenerale: 13.25,
  moyenneGeneraleMax: 20,
  rang: 4,
  effectif: 32,
  nbAbsences: 3,
  nbRetards: 1,
  verdict: "admis",
  mention: "Bien",
  commentaireJury: "Élève sérieux et appliqué. Peut viser Très bien au prochain semestre.",
  datePublication: "2026-06-30",
  directeur: "Prof. Mamadou Diallo",
  cachet: true,
}

/* ─── Guinean Flag SVG (inline, no external dep) ─── */
function GuineaFlag({ width = 54, height = 36 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 54 36" xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block", boxShadow: "0 1px 4px rgba(0,0,0,0.18)", border: "0.5px solid #e5e7eb" }}>
      <rect x="0"  width="18" height="36" fill="#CE1126" />
      <rect x="18" width="18" height="36" fill="#FCD116" />
      <rect x="36" width="18" height="36" fill="#009460" />
    </svg>
  )
}

/* ─── Coat of arms placeholder (dove + shield SVG) ─── */
function CoatOfArms({ size = 52 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
      {/* Shield shape */}
      <path d="M8 6 h36 v22 Q44 44 26 50 Q8 44 8 28 Z" fill="none" stroke="#1a3a2a" strokeWidth="1.5" />
      {/* Horizontal bar */}
      <line x1="8" y1="22" x2="44" y2="22" stroke="#1a3a2a" strokeWidth="1" />
      {/* Left : red */}
      <path d="M8 6 h18 v16 H8 Z" fill="#CE1126" opacity="0.85" />
      {/* Right : green */}
      <path d="M26 6 h18 v16 H26 Z" fill="#009460" opacity="0.85" />
      {/* Bottom : gold */}
      <path d="M8 22 h36 v6 Q44 44 26 50 Q8 44 8 28 Z" fill="#FCD116" opacity="0.75" />
      {/* Dove silhouette (simple) */}
      <ellipse cx="26" cy="16" rx="4" ry="2.5" fill="white" opacity="0.9" />
      <path d="M22 15 Q18 11 16 14 Q20 15 22 17Z" fill="white" opacity="0.9" />
      <path d="M30 15 Q34 11 36 14 Q32 15 30 17Z" fill="white" opacity="0.9" />
      {/* Head */}
      <circle cx="26" cy="13" r="2" fill="white" opacity="0.9" />
      {/* Stars top */}
      {[16, 26, 36].map((x, i) => (
        <text key={i} x={x} y="5" textAnchor="middle" fontSize="5" fill="#FCD116">★</text>
      ))}
    </svg>
  )
}

/* ─── BulletinPreview ─── */
export function BulletinPreview({ data = MOCK_BULLETIN, scale = 1 }: {
  data?: BulletinData
  scale?: number
}) {
  const mention   = data.mention ?? getMention(data.moyenneGenerale)
  const mentionCfg = MENTION_CFG[mention] ?? { color: "#374151" }
  const vCfg      = VERDICT_CFG[data.verdict]
  const VerdictIcon = vCfg.icon

  /* ── Design tokens — pure white, institutional ── */
  const white  = "#ffffff"
  const gray50 = "#f9fafb"
  const gray100 = "#f3f4f6"
  const gray200 = "#e5e7eb"
  const gray400 = "#9ca3af"
  const gray600 = "#4b5563"
  const gray800 = "#1f2937"
  const gray900 = "#111827"
  const guineaRed   = "#CE1126"
  const guineaGold  = "#C9A020"
  const guineaGreen = "#007A3D"
  const accentBlue  = "#1e3a5f"
  const sans = "'DM Sans', 'Helvetica Neue', Arial, sans-serif"

  /* ── Divider ── */
  const Divider = ({ color = gray200, my = 0 }: { color?: string; my?: number }) => (
    <div style={{ height: 1, background: color, margin: `${my}px 0` }} />
  )

  return (
    <>
      {/* Load DM Sans from Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');`}</style>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: 794,
          minHeight: 1123,
          background: white,
          color: gray900,
          fontFamily: sans,
          fontSize: 11,
          transformOrigin: "top left",
          transform: `scale(${scale})`,
          boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)",
          position: "relative",
        }}>

        {/* ══════════════════════════════════════════
            HEADER — tricolore guinéen + en-tête officiel
        ══════════════════════════════════════════ */}

        {/* Barre tricolore top */}
        <div style={{ display: "flex", height: 5 }}>
          <div style={{ flex: 1, background: guineaRed }} />
          <div style={{ flex: 1, background: guineaGold }} />
          <div style={{ flex: 1, background: guineaGreen }} />
        </div>

        {/* En-tête institutionnel */}
        <div style={{
          display: "flex", alignItems: "center",
          padding: "18px 44px 14px",
          gap: 20,
          background: white,
          borderBottom: `1.5px solid ${gray200}`,
        }}>
          {/* Drapeau */}
          <GuineaFlag width={54} height={36} />

          {/* Textes officiels — centré */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 8, fontWeight: 600, letterSpacing: 2.5, textTransform: "uppercase", color: gray400, marginBottom: 3 }}>
              République de Guinée
            </div>
            <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: 1, color: gray400, marginBottom: 5 }}>
              Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
            </div>
            <div style={{ height: 1, background: gray200, margin: "6px auto", width: "60%" }} />
            <div style={{
              fontSize: 15, fontWeight: 700, letterSpacing: 0.5,
              color: accentBlue, textTransform: "uppercase",
            }}>
              {data.etablissementNom}
            </div>
            {data.etablissementVille && (
              <div style={{ fontSize: 8.5, color: gray400, marginTop: 2, letterSpacing: 0.5 }}>
                {data.etablissementVille}
              </div>
            )}
            <div style={{ fontSize: 7.5, fontStyle: "italic", color: guineaGreen, marginTop: 3, letterSpacing: 0.5 }}>
              Travail — Justice — Solidarité
            </div>
          </div>

          {/* Armoiries */}
          <CoatOfArms size={52} />
        </div>

        {/* ── Titre du document ── */}
        <div style={{
          textAlign: "center",
          padding: "12px 44px 10px",
          background: accentBlue,
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, letterSpacing: 3,
            textTransform: "uppercase", color: white,
          }}>
            Bulletin de Notes
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 5 }}>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: 1 }}>
              {data.semestre}
            </span>
            <div style={{ width: 3, height: 3, background: guineaGold, borderRadius: "50%" }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.65)", letterSpacing: 1 }}>
              Année académique {data.anneeAcademique}
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            IDENTITÉ ÉTUDIANT
        ══════════════════════════════════════════ */}
        <div style={{ padding: "14px 44px 12px", background: gray50, borderBottom: `1px solid ${gray200}` }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 28, flexWrap: "wrap" }}>
            {/* Name block */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: gray400, marginBottom: 5 }}>
                Étudiant(e)
              </div>
              <div style={{ fontSize: 19, fontWeight: 700, color: gray900, letterSpacing: 0.3, lineHeight: 1.1 }}>
                {data.etudiantNom}{" "}
                <span style={{ fontWeight: 400, color: gray600 }}>{data.etudiantPrenom}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 20px", marginTop: 5 }}>
                {[
                  ["Matricule", data.matricule],
                  data.dateNaissance ? ["Né(e) le", new Date(data.dateNaissance).toLocaleDateString("fr-FR")] : null,
                  data.lieuNaissance ? ["Lieu de naissance", data.lieuNaissance] : null,
                ].filter(Boolean).map(f => f && (
                  <span key={f[0]} style={{ fontSize: 9, color: gray600 }}>
                    <span style={{ color: gray400 }}>{f[0]} : </span>
                    <strong style={{ fontWeight: 600, color: gray800 }}>{f[1]}</strong>
                  </span>
                ))}
              </div>
            </div>

            {/* Meta boxes */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              {[
                { label: "Classe",  val: data.classe,  accent: accentBlue },
                { label: "Période", val: data.periode, accent: guineaGreen },
              ].map(f => (
                <div key={f.label} style={{
                  minWidth: 100, padding: "10px 14px", textAlign: "center",
                  background: white,
                  border: `1px solid ${gray200}`,
                  borderTop: `3px solid ${f.accent}`,
                }}>
                  <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: f.accent, marginBottom: 4 }}>
                    {f.label}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: gray800 }}>{f.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            TABLEAU DES NOTES
        ══════════════════════════════════════════ */}
        <div style={{ padding: "16px 44px 0" }}>
          <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: accentBlue, marginBottom: 10 }}>
            Résultats par Matière
          </div>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: accentBlue }}>
                {[
                  { h: "Matière",      w: "auto",  align: "left"   },
                  { h: "Coeff.",       w: "50px",  align: "center" },
                  { h: "Note /20",     w: "70px",  align: "center" },
                  { h: "Moy. Classe",  w: "80px",  align: "center" },
                  { h: "Rang",         w: "60px",  align: "center" },
                  { h: "Appréciation", w: "180px", align: "left"   },
                  { h: "Enseignant",   w: "90px",  align: "left"   },
                ].map((col, ci) => (
                  <th key={col.h} style={{
                    padding: "8px 10px",
                    textAlign: col.align as "left" | "center",
                    width: col.w,
                    fontSize: 7.5, fontWeight: 600,
                    letterSpacing: 1.5, textTransform: "uppercase",
                    color: "rgba(255,255,255,0.8)",
                    borderRight: ci < 6 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}>{col.h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.matieres.map((m, i) => {
                const nc = noteColor(m.noteObtenue, m.noteMax)
                return (
                  <tr key={m.nom} style={{
                    background: i % 2 === 0 ? white : gray50,
                    borderBottom: `1px solid ${gray100}`,
                  }}>
                    <td style={{ padding: "9px 10px", fontWeight: 600, color: gray900, fontSize: 10.5 }}>
                      {m.nom}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 10, color: "#6b7280", fontWeight: 500 }}>
                      {m.coefficient}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "center" }}>
                      <span style={{
                        display: "inline-block",
                        fontSize: 14, fontWeight: 700, color: nc,
                        lineHeight: 1,
                      }}>
                        {m.noteObtenue.toFixed(1)}
                      </span>
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "center", fontSize: 10, color: gray600 }}>
                      {m.moyenneClasse?.toFixed(1) ?? "—"}
                    </td>
                    <td style={{ padding: "9px 10px", textAlign: "center" }}>
                      <span style={{
                        fontSize: 9, fontWeight: m.rang && m.rang <= 3 ? 700 : 400,
                        color: m.rang && m.rang <= 3 ? guineaGold : gray400,
                      }}>
                        {m.rang ? `${m.rang}e` : "—"}
                      </span>
                    </td>
                    <td style={{ padding: "9px 10px", fontSize: 9, fontStyle: "italic", color: appreciationColor(m.appreciation), lineHeight: 1.4 }}>
                      {m.appreciation}
                    </td>
                    <td style={{ padding: "9px 10px", fontSize: 9, color: gray400 }}>{m.enseignant}</td>
                  </tr>
                )
              })}
              {/* Total separator row */}
              <tr style={{ background: gray100, borderTop: `2px solid ${accentBlue}` }}>
                <td colSpan={7} style={{ height: 2 }} />
              </tr>
            </tbody>
          </table>
        </div>

        {/* ══════════════════════════════════════════
            SYNTHÈSE — ligne de résultats
        ══════════════════════════════════════════ */}
        <div style={{ padding: "16px 44px" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "stretch", flexWrap: "wrap" }}>

            {/* Moyenne générale */}
            <div style={{
              flex: "0 0 auto", minWidth: 110, padding: "14px 18px", textAlign: "center",
              background: accentBlue,
              borderRadius: 2,
            }}>
              <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>
                Moy. Générale
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: noteColor(data.moyenneGenerale, data.moyenneGeneraleMax) }}>
                {data.moyenneGenerale.toFixed(2)}
              </div>
              <div style={{ fontSize: 8, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>/ 20</div>
            </div>

            {/* Rang */}
            <div style={{
              flex: "0 0 auto", minWidth: 85, padding: "14px 16px", textAlign: "center",
              border: `1px solid ${gray200}`,
              borderTop: `3px solid ${guineaGold}`,
              borderRadius: 2,
            }}>
              <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: gray400, marginBottom: 6 }}>Rang</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: guineaGold, lineHeight: 1 }}>
                {data.rang}<sup style={{ fontSize: 10, fontWeight: 400, color: gray400 }}>e</sup>
              </div>
              <div style={{ fontSize: 8, color: gray400, marginTop: 4 }}>sur {data.effectif}</div>
            </div>

            {/* Mention */}
            <div style={{
              flex: "0 0 auto", minWidth: 105, padding: "14px 16px", textAlign: "center",
              border: `1px solid ${gray200}`,
              borderTop: `3px solid ${mentionCfg.color}`,
              borderRadius: 2,
            }}>
              <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: gray400, marginBottom: 6 }}>Mention</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: mentionCfg.color, lineHeight: 1.2 }}>
                {mention}
              </div>
            </div>

            {/* Absences */}
            <div style={{
              flex: "0 0 auto", minWidth: 80, padding: "14px 16px", textAlign: "center",
              border: `1px solid ${gray200}`,
              borderTop: `3px solid ${data.nbAbsences > 5 ? "#DC2626" : gray200}`,
              borderRadius: 2,
            }}>
              <div style={{ fontSize: 7, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: gray400, marginBottom: 6 }}>Absences</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: data.nbAbsences > 5 ? "#DC2626" : gray800, lineHeight: 1 }}>
                {data.nbAbsences}
              </div>
              <div style={{ fontSize: 8, color: gray400, marginTop: 4 }}>jour(s)</div>
            </div>

            {/* Verdict */}
            <div style={{
              flex: 1, minWidth: 140, padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 14,
              background: `${vCfg.color}08`,
              border: `1.5px solid ${vCfg.color}40`,
              borderLeft: `4px solid ${vCfg.color}`,
              borderRadius: 2,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
                border: `2px solid ${vCfg.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <VerdictIcon style={{ width: 20, height: 20, color: vCfg.color }} />
              </div>
              <div>
                <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", color: `${vCfg.color}99`, marginBottom: 4 }}>
                  Décision du Jury
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: vCfg.color, letterSpacing: 2, textTransform: "uppercase" }}>
                  {vCfg.label}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Commentaire jury ── */}
        {data.commentaireJury && (
          <div style={{ padding: "0 44px 16px" }}>
            <div style={{
              padding: "12px 16px",
              background: gray50,
              border: `1px solid ${gray200}`,
              borderLeft: `3px solid ${accentBlue}`,
            }}>
              <div style={{ fontSize: 7.5, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: accentBlue, marginBottom: 6 }}>
                Appréciation du Conseil de Classe
              </div>
              <div style={{ fontSize: 10.5, fontStyle: "italic", color: gray600, lineHeight: 1.65 }}>
                « {data.commentaireJury} »
              </div>
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div style={{
          padding: "14px 44px 20px",
          borderTop: `1px solid ${gray200}`,
          display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20,
        }}>
          {/* Date */}
          <div>
            <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: gray400, marginBottom: 4 }}>
              Date de publication
            </div>
            <div style={{ fontSize: 10.5, color: gray800 }}>
              Conakry, le {new Date(data.datePublication).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          </div>

          {/* Directeur + cachet */}
          {data.directeur && (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 7.5, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: gray400, marginBottom: 4 }}>
                Le Directeur de l'Établissement
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 600, color: gray800 }}>{data.directeur}</div>
              {data.cachet && (
                <div style={{
                  width: 68, height: 68, borderRadius: "50%",
                  margin: "10px auto 0",
                  border: `1.5px solid ${accentBlue}`,
                  boxShadow: `0 0 0 3px ${white}, 0 0 0 4.5px ${accentBlue}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: `radial-gradient(circle, ${accentBlue}06, transparent)`,
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 14, marginBottom: 0, lineHeight: 1 }}>🎓</div>
                    <div style={{ fontSize: 5, fontWeight: 700, color: accentBlue, letterSpacing: 0.8, textTransform: "uppercase", lineHeight: 1.4 }}>
                      Cachet<br />Officiel
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Barre tricolore bottom */}
        <div style={{ display: "flex", height: 5 }}>
          <div style={{ flex: 1, background: guineaRed }} />
          <div style={{ flex: 1, background: guineaGold }} />
          <div style={{ flex: 1, background: guineaGreen }} />
        </div>
      </motion.div>
    </>
  )
}
