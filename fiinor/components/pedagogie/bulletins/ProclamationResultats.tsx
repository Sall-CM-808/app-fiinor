"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trophy, Medal, CheckCircle2, AlertTriangle,
  XCircle, Shield, ChevronDown, ChevronUp,
  Users, TrendingUp, Award,
} from "lucide-react"
import { BulletinDownloadButton } from "./BulletinDownloadButtonDynamic"
import { MOCK_LIST } from "./bulletin-mock-data"
import type { BulletinData } from "./BulletinPreview"

/* ─── Types ─── */
type Verdict = "admis" | "rattrapage" | "ajourné" | "exclu"

interface EleveResultat {
  rang: number
  nom: string
  prenom: string
  matricule: string
  moyenne: number
  mention: string
  verdict: Verdict
  bulletinData: BulletinData
}

/* ─── Config ─── */
const VERDICT_CFG: Record<Verdict, {
  label: string; color: string; bg: string; border: string
  icon: React.ElementType; rowBg: string
}> = {
  admis:      { label: "Admis",      color: "#059669", bg: "#f0fdf4", border: "#6ee7b7", icon: CheckCircle2,  rowBg: "#f0fdf4" },
  rattrapage: { label: "Rattrapage", color: "#d97706", bg: "#fffbeb", border: "#fcd34d", icon: AlertTriangle, rowBg: "#fffbeb" },
  ajourné:    { label: "Ajourné",    color: "#dc2626", bg: "#fef2f2", border: "#fca5a5", icon: XCircle,       rowBg: "#fef2f2" },
  exclu:      { label: "Exclu",      color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd", icon: Shield,        rowBg: "#f5f3ff" },
}

const MENTION_COLOR: Record<string, string> = {
  "Passable":   "#6b7280",
  "Assez bien": "#2563eb",
  "Bien":       "#059669",
  "Très bien":  "#d97706",
  "Excellent":  "#7c3aed",
}

const MEDAL_CFG = [
  { color: "#C9A020", icon: Trophy,  label: "1er"  },
  { color: "#94a3b8", icon: Medal,   label: "2ème" },
  { color: "#b45309", icon: Medal,   label: "3ème" },
]

function getMention(moy: number) {
  if (moy >= 16) return "Excellent"
  if (moy >= 14) return "Très bien"
  if (moy >= 12) return "Bien"
  if (moy >= 10) return "Assez bien"
  return "Passable"
}

/* ─── Build resultat list from MOCK_LIST ─── */
const RESULTATS: EleveResultat[] = MOCK_LIST
  .map((b: BulletinData, i: number): EleveResultat => ({
    rang: i + 1,
    nom: b.etudiantNom,
    prenom: b.etudiantPrenom,
    matricule: b.matricule,
    moyenne: b.moyenneGenerale,
    mention: b.mention ?? getMention(b.moyenneGenerale),
    verdict: b.verdict as Verdict,
    bulletinData: b,
  }))
  .sort((a: EleveResultat, b: EleveResultat) => b.moyenne - a.moyenne)
  .map((e: EleveResultat, i: number): EleveResultat => ({ ...e, rang: i + 1 }))

/* ─── Section component (Admis / Rattrapage / Ajourné) ─── */
function ResultSection({
  verdict, eleves, defaultOpen = false,
}: {
  verdict: Verdict
  eleves: EleveResultat[]
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const cfg = VERDICT_CFG[verdict]
  const Icon = cfg.icon

  if (eleves.length === 0) return null

  return (
    <div style={{ border: `1px solid ${cfg.border}`, borderRadius: 8, overflow: "hidden", marginBottom: 0 }}>
      {/* Section header */}
      <div
        role="button" tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px", cursor: "pointer",
          background: cfg.bg, borderBottom: open ? `1px solid ${cfg.border}` : "none",
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon size={16} style={{ color: cfg.color }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color, textTransform: "uppercase", letterSpacing: 1 }}>
            {cfg.label}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, color: cfg.color,
            background: `${cfg.color}15`, padding: "1px 8px", borderRadius: 20,
            border: `1px solid ${cfg.color}30`,
          }}>
            {eleves.length} élève{eleves.length > 1 ? "s" : ""}
          </span>
        </div>
        {open ? <ChevronUp size={14} style={{ color: cfg.color }} /> : <ChevronDown size={14} style={{ color: cfg.color }} />}
      </div>

      {/* Rows */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}>

            {/* Table head */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "40px 32px 1fr 70px 90px 80px 60px",
              padding: "6px 16px",
              background: "#f9fafb",
              borderBottom: "1px solid #e5e7eb",
            }}>
              {["Rang", "", "Nom & Prénom", "Matricule", "Moyenne", "Mention", "PDF"].map(h => (
                <span key={h} style={{
                  fontSize: 7.5, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: 1.5, color: "#9ca3af",
                  textAlign: h === "Rang" || h === "Moyenne" || h === "PDF" ? "center" : "left",
                }}>{h}</span>
              ))}
            </div>

            {eleves.map((eleve, i) => {
              const medalCfg = eleve.rang <= 3 ? MEDAL_CFG[eleve.rang - 1] : null
              const MedalIcon = medalCfg?.icon
              const mentionColor = MENTION_COLOR[eleve.mention] ?? "#6b7280"

              return (
                <motion.div
                  key={eleve.matricule}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.025, type: "spring", stiffness: 500, damping: 35 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 32px 1fr 70px 90px 80px 60px",
                    padding: "9px 16px",
                    alignItems: "center",
                    borderBottom: i < eleves.length - 1 ? "1px solid #f3f4f6" : "none",
                    background: i % 2 === 0 ? "white" : "#fafafa",
                  }}>

                  {/* Rang */}
                  <span style={{
                    textAlign: "center", fontSize: 11, fontWeight: 700,
                    color: eleve.rang <= 3 ? medalCfg!.color : "#9ca3af",
                  }}>
                    {eleve.rang}
                  </span>

                  {/* Medal */}
                  <span style={{ textAlign: "center" }}>
                    {MedalIcon && eleve.verdict === "admis" && (
                      <MedalIcon size={14} style={{ color: medalCfg!.color }} />
                    )}
                  </span>

                  {/* Nom */}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>
                      {eleve.nom} <span style={{ fontWeight: 400, color: "#6b7280" }}>{eleve.prenom}</span>
                    </div>
                  </div>

                  {/* Matricule */}
                  <span style={{ fontSize: 8.5, fontFamily: "monospace", color: "#9ca3af" }}>
                    {eleve.matricule}
                  </span>

                  {/* Moyenne */}
                  <span style={{
                    textAlign: "center", fontSize: 14, fontWeight: 800,
                    color: eleve.moyenne >= 10 ? "#059669" : eleve.moyenne >= 8 ? "#d97706" : "#dc2626",
                  }}>
                    {eleve.moyenne.toFixed(2)}
                    <span style={{ fontSize: 8, fontWeight: 400, color: "#9ca3af" }}>/20</span>
                  </span>

                  {/* Mention */}
                  <span style={{ fontSize: 9, fontWeight: 600, color: mentionColor }}>
                    {eleve.mention}
                  </span>

                  {/* PDF download */}
                  <div style={{ textAlign: "center" }}>
                    <BulletinDownloadButton
                      data={eleve.bulletinData}
                      iconOnly
                      iconSize={13}
                      style={{ color: "#6b7280", padding: "4px", borderRadius: 6, background: "#f3f4f6", border: "1px solid #e5e7eb" }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Main ─── */
export function ProclamationResultats() {
  const classe   = RESULTATS[0]?.bulletinData.classe        ?? "—"
  const semestre = RESULTATS[0]?.bulletinData.semestre      ?? "—"
  const annee    = RESULTATS[0]?.bulletinData.anneeAcademique ?? "—"
  const etab     = RESULTATS[0]?.bulletinData.etablissementNom ?? "—"

  const grouped = useMemo(() => ({
    admis:      RESULTATS.filter(e => e.verdict === "admis"),
    rattrapage: RESULTATS.filter(e => e.verdict === "rattrapage"),
    ajourné:    RESULTATS.filter(e => e.verdict === "ajourné"),
    exclu:      RESULTATS.filter(e => e.verdict === "exclu"),
  }), [])

  const tauxReussite = Math.round(grouped.admis.length / RESULTATS.length * 100)
  const moyGenerale  = (RESULTATS.reduce((s, e) => s + e.moyenne, 0) / RESULTATS.length).toFixed(2)

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header proclamation ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e5e7eb" }}>

        {/* Barre tricolore */}
        <div style={{ display: "flex", height: 4 }}>
          <div style={{ flex: 1, background: "#CE1126" }} />
          <div style={{ flex: 1, background: "#C9A020" }} />
          <div style={{ flex: 1, background: "#007A3D" }} />
        </div>

        {/* Header content */}
        <div style={{ background: "#1e3a5f", padding: "16px 28px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              République de Guinée — {etab}
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "white", letterSpacing: 1, textTransform: "uppercase" }}>
              Proclamation des Résultats
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
              {classe} · {semestre} · {annee}
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", background: "white" }}>
          {[
            { label: "Effectif total",  val: RESULTATS.length, color: "#1e3a5f",  unit: "élèves",  icon: Users },
            { label: "Admis",           val: grouped.admis.length, color: "#059669", unit: "élèves", icon: CheckCircle2 },
            { label: "Taux de réussite",val: tauxReussite,      color: "#d97706",  unit: "%",       icon: TrendingUp },
            { label: "Moyenne classe",  val: moyGenerale,       color: "#7c3aed",  unit: "/20",     icon: Award },
          ].map((k, i) => {
            const KIcon = k.icon
            return (
              <div key={k.label} style={{
                padding: "14px 18px", textAlign: "center",
                borderRight: i < 3 ? "1px solid #f3f4f6" : "none",
                borderTop: "1px solid #f3f4f6",
              }}>
                <KIcon size={14} style={{ color: k.color, margin: "0 auto 4px" }} />
                <div style={{ fontSize: 20, fontWeight: 800, color: k.color, lineHeight: 1 }}>
                  {k.val}<span style={{ fontSize: 9, fontWeight: 400, color: "#9ca3af", marginLeft: 2 }}>{k.unit}</span>
                </div>
                <div style={{ fontSize: 7.5, textTransform: "uppercase", letterSpacing: 1.5, color: "#9ca3af", marginTop: 3 }}>
                  {k.label}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ── Podium top 3 ── */}
      {grouped.admis.length >= 3 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{ border: "1px solid #e5e7eb", background: "white", padding: "16px 20px" }}>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#9ca3af", marginBottom: 12 }}>
            🏆 Tableau d'honneur
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {grouped.admis.slice(0, 3).map((e, i) => {
              const mc = MEDAL_CFG[i]
              const MIcon = mc.icon
              return (
                <motion.div key={e.matricule}
                  whileHover={{ y: -2 }}
                  style={{
                    flex: 1, minWidth: 120, padding: "12px 14px",
                    border: `1.5px solid ${mc.color}40`,
                    borderTop: `3px solid ${mc.color}`,
                    borderRadius: 8, textAlign: "center",
                    background: `${mc.color}06`,
                  }}>
                  <MIcon size={18} style={{ color: mc.color, margin: "0 auto 6px" }} />
                  <div style={{ fontSize: 7, color: mc.color, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>
                    {mc.label}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#111827" }}>{e.nom}</div>
                  <div style={{ fontSize: 10, color: "#6b7280" }}>{e.prenom}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#059669", marginTop: 5 }}>
                    {e.moyenne.toFixed(2)}<span style={{ fontSize: 8, color: "#9ca3af" }}>/20</span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* ── Sections par verdict ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="flex flex-col gap-3">
        <ResultSection verdict="admis"      eleves={grouped.admis}      defaultOpen={true} />
        <ResultSection verdict="rattrapage" eleves={grouped.rattrapage} defaultOpen={false} />
        <ResultSection verdict="ajourné"    eleves={grouped.ajourné}    defaultOpen={false} />
        <ResultSection verdict="exclu"      eleves={grouped.exclu}      defaultOpen={false} />
      </motion.div>

      {/* ── Signature ── */}
      <div style={{
        display: "flex", justifyContent: "flex-end", paddingTop: 8,
        borderTop: "1px solid #f3f4f6", gap: 40, flexWrap: "wrap",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 7.5, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 20 }}>
            Le Directeur des Études
          </div>
          <div style={{ borderTop: "1px solid #d1d5db", paddingTop: 4, fontSize: 9, color: "#374151", minWidth: 120 }}>
            Signature & Cachet
          </div>
        </div>
      </div>
    </div>
  )
}
