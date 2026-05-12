"use client"

import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2, AlertTriangle, XCircle, ChevronDown,
  Gavel, Zap, Users, Search, SlidersHorizontal,
  MessageSquare, Shield, FlameKindling, BarChart3,
  RefreshCw, Send, Eye, X, Check,
} from "lucide-react"

/* ─── Types ─── */
export type Verdict = "admis" | "rattrapage" | "ajourné" | "exclu" | "en_attente"

export interface Matiere {
  nom: string
  moyenne: number
  coefficient: number
}

export interface Etudiant {
  id: string
  nom: string
  prenom: string
  matricule: string
  matieres: Matiere[]
  moyenneGenerale: number
  nbAbsences: number
  verdictAuto: Verdict
  verdictFinal: Verdict
  override: boolean
  overrideComment: string
  overrideBy?: string
}

export type WorkflowStatus = "brouillon" | "soumis" | "approuvé" | "publié"

const VERDICT_CONFIG: Record<Verdict, {
  label: string; color: string; bg: string; border: string
  icon: React.ElementType; stampRot: number
}> = {
  admis:      { label: "ADMIS",      color: "#10B981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.35)",  icon: CheckCircle2,   stampRot: -2  },
  rattrapage: { label: "RATTRAPAGE", color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.35)",  icon: AlertTriangle,  stampRot: 1.5 },
  ajourné:    { label: "AJOURNÉ",    color: "#EF4444", bg: "rgba(239,68,68,0.1)",   border: "rgba(239,68,68,0.35)",   icon: XCircle,        stampRot: -1  },
  exclu:      { label: "EXCLU",      color: "#7C3AED", bg: "rgba(124,58,237,0.1)",  border: "rgba(124,58,237,0.35)",  icon: Shield,         stampRot: 2   },
  en_attente: { label: "EN ATTENTE", color: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", icon: Eye, stampRot: 0 },
}

const WORKFLOW: Record<WorkflowStatus, { label: string; color: string; next?: WorkflowStatus; action: string }> = {
  brouillon: { label: "Brouillon", color: "#6B7280", next: "soumis",   action: "Soumettre" },
  soumis:    { label: "Soumis",    color: "#3B82F6", next: "approuvé", action: "Approuver" },
  approuvé:  { label: "Approuvé",  color: "#F59E0B", next: "publié",   action: "Publier"   },
  publié:    { label: "Publié",    color: "#10B981", next: undefined,  action: "Archivé"   },
}

/* ─── Mock data ─── */
const MATIERES_POOL = [
  "Mathématiques", "Physique-Chimie", "Informatique", "Anglais",
  "Français", "Histoire-Géo", "SVT", "Philosophie",
]

/* Seeded PRNG (mulberry32) — deterministic on server & client */
function seededRng(seed: number) {
  let s = seed
  return () => {
    s |= 0; s = s + 0x6D2B79F5 | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rng = seededRng(42)
function makeMoy(): number { return Math.round((rng() * 18 + 2) * 10) / 10 }

function calcVerdictAuto(moy: number, absences: number): Verdict {
  if (absences > 30) return "exclu"
  if (moy >= 10) return "admis"
  if (moy >= 8) return "rattrapage"
  return "ajourné"
}

function isBorderline(moy: number): boolean { return moy >= 8.5 && moy < 10.5 }

const PRENOMS = ["Amara","Sofia","Yusuf","Clémentine","Ibrahima","Léa","Mohamed","Jade","Kwame","Inès","Seydou","Emma","Oumar","Chloé","Fatou"]
const NOMS    = ["Diallo","Müller","Traoré","Leblanc","Koné","Rousseau","Ba","Dupont","Toure","Bernard","Camara","Petit","Bah","Moreau","Sow"]

const MOCK_ETUDIANTS: Etudiant[] = Array.from({ length: 28 }, (_, i) => {
  const matieres: Matiere[] = MATIERES_POOL.slice(0, 5).map(nom => ({
    nom, moyenne: makeMoy(), coefficient: 2,
  }))
  const moyGeneral = Math.round(matieres.reduce((s, m) => s + m.moyenne * m.coefficient, 0) / matieres.reduce((s, m) => s + m.coefficient, 0) * 10) / 10
  const absences = Math.floor(rng() * 35)
  const vAuto = calcVerdictAuto(moyGeneral, absences)
  return {
    id: `etu_${i}`,
    nom: NOMS[i % NOMS.length],
    prenom: PRENOMS[i % PRENOMS.length],
    matricule: `M${String(20240000 + i).padStart(8, "0")}`,
    matieres,
    moyenneGenerale: moyGeneral,
    nbAbsences: absences,
    verdictAuto: vAuto,
    verdictFinal: vAuto,
    override: false,
    overrideComment: "",
  }
})

/* ─── Verdict Stamp ─── */
function VerdictStamp({ verdict, size = "sm" }: { verdict: Verdict; size?: "sm" | "md" | "lg" }) {
  const cfg = VERDICT_CONFIG[verdict]
  const Icon = cfg.icon
  const sizes = { sm: { px: "px-2 py-0.5", text: "text-[8px]", icon: "size-2.5" }, md: { px: "px-3 py-1", text: "text-[9px]", icon: "size-3" }, lg: { px: "px-4 py-1.5", text: "text-[11px]", icon: "size-3.5" } }
  const s = sizes[size]
  return (
    <motion.span
      initial={{ scale: 0, rotate: cfg.stampRot * 4, opacity: 0 }}
      animate={{ scale: 1, rotate: cfg.stampRot, opacity: 1 }}
      transition={{ type: "spring" as const, stiffness: 600, damping: 18, mass: 0.6 }}
      className={`inline-flex items-center gap-1 rounded font-black uppercase tracking-widest font-mono ${s.px} ${s.text}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1.5px solid ${cfg.border}`, letterSpacing: "0.12em" }}>
      <Icon className={s.icon} />
      {cfg.label}
    </motion.span>
  )
}

/* ─── Override Menu ─── */
function VerdictMenu({ current, onChange, onClose }: {
  current: Verdict; onChange: (v: Verdict) => void; onClose: () => void
}) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.92, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: -4 }}
      transition={{ type: "spring" as const, stiffness: 600, damping: 28 }}
      className="absolute top-full left-0 mt-1 z-50 rounded-xl overflow-hidden min-w-[160px]"
      style={{ background: "#08141f", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
      {(Object.keys(VERDICT_CONFIG) as Verdict[]).filter(v => v !== "en_attente").map(v => {
        const cfg = VERDICT_CONFIG[v]
        const Icon = cfg.icon
        return (
          <button key={v} onClick={() => { onChange(v); onClose() }}
            className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all"
            style={current === v
              ? { background: `${cfg.color}15`, color: cfg.color }
              : { color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={e => { if (current !== v) e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}
            onMouseLeave={e => { if (current !== v) e.currentTarget.style.background = "transparent" }}>
            <Icon className="size-3.5" style={{ color: cfg.color }} />
            {cfg.label}
            {current === v && <Check className="size-3 ml-auto" style={{ color: cfg.color }} />}
          </button>
        )
      })}
    </motion.div>
  )
}

/* ─── Student Row ─── */
function StudentRow({ et, selected, onSelect, onVerdictChange, isPublished, i }: {
  et: Etudiant; selected: boolean; onSelect: () => void
  onVerdictChange: (id: string, v: Verdict, comment: string) => void
  isPublished: boolean; i: number
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [commenting, setCommenting] = useState(false)
  const [comment, setComment] = useState(et.overrideComment)
  const [expanded, setExpanded] = useState(false)
  const borderline = isBorderline(et.moyenneGenerale)
  const cfg = VERDICT_CONFIG[et.verdictFinal]

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.025, type: "spring" as const, stiffness: 350, damping: 28 }}
      className="relative group"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: selected ? "rgba(201,168,76,0.04)" : borderline ? "rgba(245,158,11,0.025)" : "transparent",
      }}
      onMouseEnter={e => { if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.02)" }}
      onMouseLeave={e => { e.currentTarget.style.background = selected ? "rgba(201,168,76,0.04)" : borderline ? "rgba(245,158,11,0.025)" : "transparent" }}>

      {/* Borderline accent bar */}
      {borderline && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ background: "#F59E0B" }} />
      )}

      <div className="flex items-center gap-3 px-4 py-3">
        {/* Checkbox */}
        {!isPublished && (
          <button onClick={onSelect}
            className="size-4 rounded flex-shrink-0 flex items-center justify-center transition-all"
            style={selected
              ? { background: "#C9A84C", border: "1px solid #C9A84C" }
              : { background: "transparent", border: "1px solid rgba(255,255,255,0.15)" }}>
            {selected && <Check className="size-2.5 text-[#050d18]" />}
          </button>
        )}

        {/* Avatar */}
        <div className="size-8 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black"
          style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
          {et.prenom[0]}{et.nom[0]}
        </div>

        {/* Name + Matricule */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white truncate">{et.prenom} {et.nom}</span>
            {borderline && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[7px] font-black uppercase px-1.5 py-0.5 rounded"
                style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.25)" }}>
                <FlameKindling className="size-2" />BORDERLINE
              </span>
            )}
            {et.override && (
              <span className="hidden sm:inline text-[7px] font-bold uppercase px-1.5 py-0.5 rounded"
                style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}>
                Override
              </span>
            )}
          </div>
          <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.28)" }}>{et.matricule}</div>
        </div>

        {/* Moyenne */}
        <div className="text-center hidden sm:block flex-shrink-0 w-14">
          <div className="text-[16px] font-black tabular-nums leading-none"
            style={{ color: et.moyenneGenerale >= 10 ? "#10B981" : et.moyenneGenerale >= 8 ? "#F59E0B" : "#EF4444" }}>
            {et.moyenneGenerale.toFixed(2)}
          </div>
          <div className="text-[7px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>Moy.</div>
        </div>

        {/* Absences */}
        <div className="text-center hidden lg:block flex-shrink-0 w-10">
          <div className="text-[12px] font-bold tabular-nums" style={{ color: et.nbAbsences > 30 ? "#7C3AED" : et.nbAbsences > 15 ? "#EF4444" : "rgba(255,255,255,0.4)" }}>
            {et.nbAbsences}
          </div>
          <div className="text-[7px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Abs.</div>
        </div>

        {/* Verdict stamp + menu */}
        <div className="relative flex-shrink-0">
          <AnimatePresence mode="wait">
            <motion.div key={et.verdictFinal}>
              {isPublished ? (
                <VerdictStamp verdict={et.verdictFinal} size="sm" />
              ) : (
                <button onClick={() => setMenuOpen(o => !o)} className="group/stamp">
                  <VerdictStamp verdict={et.verdictFinal} size="sm" />
                </button>
              )}
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <VerdictMenu current={et.verdictFinal}
                  onChange={v => {
                    setMenuOpen(false)
                    if (v !== et.verdictAuto) setCommenting(true)
                    onVerdictChange(et.id, v, comment)
                  }}
                  onClose={() => setMenuOpen(false)} />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Expand matieres */}
        <button onClick={() => setExpanded(x => !x)}
          className="rounded-lg p-1.5 transition-all opacity-0 group-hover:opacity-100"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
          <ChevronDown className={`size-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Override comment */}
      <AnimatePresence>
        {(commenting || et.overrideComment) && !isPublished && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-4 pb-2">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2"
              style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)" }}>
              <MessageSquare className="size-3 flex-shrink-0" style={{ color: "#C9A84C" }} />
              <input value={comment} onChange={e => { setComment(e.target.value); onVerdictChange(et.id, et.verdictFinal, e.target.value) }}
                placeholder="Justification du jury…"
                className="flex-1 bg-transparent outline-none text-[9px]"
                style={{ color: "rgba(255,255,255,0.7)" }} />
              <button onClick={() => setCommenting(false)}><X className="size-3" style={{ color: "rgba(255,255,255,0.3)" }} /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Matieres expanded */}
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden px-4 pb-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
              {et.matieres.map(m => (
                <div key={m.nom} className="rounded-xl px-3 py-2"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="text-[9px] truncate mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>{m.nom}</div>
                  <div className="text-[14px] font-black tabular-nums"
                    style={{ color: m.moyenne >= 10 ? "#10B981" : m.moyenne >= 8 ? "#F59E0B" : "#EF4444" }}>
                    {m.moyenne.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Live Consensus Bar ─── */
function ConsensusBar({ etudiants }: { etudiants: Etudiant[] }) {
  const total = etudiants.length
  const counts = useMemo(() => {
    const c: Record<Verdict, number> = { admis: 0, rattrapage: 0, ajourné: 0, exclu: 0, en_attente: 0 }
    etudiants.forEach(e => c[e.verdictFinal]++)
    return c
  }, [etudiants])

  const bars: { key: Verdict; label: string; color: string }[] = [
    { key: "admis",      label: "Admis",      color: "#10B981" },
    { key: "rattrapage", label: "Rattrapage",  color: "#F59E0B" },
    { key: "ajourné",    label: "Ajourné",     color: "#EF4444" },
    { key: "exclu",      label: "Exclu",       color: "#7C3AED" },
  ]

  return (
    <div className="flex flex-col gap-2 rounded-2xl p-4"
      style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center gap-2 mb-1">
        <BarChart3 className="size-3.5" style={{ color: "#C9A84C" }} />
        <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
          Répartition live · {total} étudiants
        </span>
      </div>

      {/* Stacked bar */}
      <div className="flex rounded-full overflow-hidden" style={{ height: 8, background: "rgba(255,255,255,0.05)" }}>
        {bars.map(b => (
          <motion.div key={b.key}
            animate={{ width: `${total ? (counts[b.key] / total) * 100 : 0}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ background: b.color, height: "100%" }} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-1">
        {bars.map(b => (
          <div key={b.key} className="flex items-center gap-1.5">
            <div className="size-2 rounded-full" style={{ background: b.color }} />
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {b.label} <span className="font-bold" style={{ color: b.color }}>{counts[b.key]}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Workflow Badge ─── */
function WorkflowBadge({ status, onAdvance }: { status: WorkflowStatus; onAdvance: () => void }) {
  const cfg = WORKFLOW[status]
  const steps: WorkflowStatus[] = ["brouillon", "soumis", "approuvé", "publié"]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
      {/* Steps */}
      <div className="flex items-center gap-0">
        {steps.map((s, idx) => {
          const sCfg = WORKFLOW[s]
          const done = steps.indexOf(status) >= idx
          const active = s === status
          return (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{ background: active ? `${sCfg.color}18` : done ? `${sCfg.color}08` : "transparent" }}>
                <div className="size-1.5 rounded-full" style={{ background: done ? sCfg.color : "rgba(255,255,255,0.12)" }} />
                <span className="text-[8px] font-bold uppercase tracking-wider hidden sm:inline"
                  style={{ color: active ? sCfg.color : done ? `${sCfg.color}80` : "rgba(255,255,255,0.2)" }}>
                  {sCfg.label}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="w-4 h-px mx-0.5" style={{ background: done ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)" }} />
              )}
            </div>
          )
        })}
      </div>

      {/* Action button */}
      {cfg.next && (
        <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} onClick={onAdvance}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-bold whitespace-nowrap"
          style={{ background: `${cfg.color}18`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
          <Send className="size-3" />{cfg.action}
        </motion.button>
      )}
    </div>
  )
}

/* ─── Main ─── */
export function DeliberationJury({
  classe = "Terminale A",
  periode = "2025–2026 S2",
}: {
  classe?: string; periode?: string
}) {
  const [etudiants, setEtudiants] = useState<Etudiant[]>(MOCK_ETUDIANTS)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterVerdict, setFilterVerdict] = useState<Verdict | "borderline" | "">("")
  const [search, setSearch] = useState("")
  const [workflow, setWorkflow] = useState<WorkflowStatus>("brouillon")
  const [bulkVerdict, setBulkVerdict] = useState<Verdict | "">("")
  const isPublished = workflow === "publié"

  /* Auto-apply rules */
  const handleAutoApply = useCallback(() => {
    setEtudiants(prev => prev.map(e => ({
      ...e,
      verdictFinal: e.verdictAuto,
      override: false,
      overrideComment: "",
    })))
  }, [])

  /* Verdict change */
  const handleVerdictChange = useCallback((id: string, v: Verdict, comment: string) => {
    setEtudiants(prev => prev.map(e => e.id === id
      ? { ...e, verdictFinal: v, override: v !== e.verdictAuto, overrideComment: comment, overrideBy: "Jury" }
      : e))
  }, [])

  /* Bulk verdict */
  const handleBulkApply = useCallback(() => {
    if (!bulkVerdict || selected.size === 0) return
    setEtudiants(prev => prev.map(e => selected.has(e.id)
      ? { ...e, verdictFinal: bulkVerdict as Verdict, override: bulkVerdict !== e.verdictAuto, overrideBy: "Jury (Masse)" }
      : e))
    setSelected(new Set())
    setBulkVerdict("")
  }, [bulkVerdict, selected])

  /* Workflow advance */
  const handleAdvanceWorkflow = () => {
    const nxt = WORKFLOW[workflow].next
    if (nxt) setWorkflow(nxt)
  }

  /* Filter */
  const filtered = useMemo(() => {
    return etudiants.filter(e => {
      const matchSearch = !search || `${e.prenom} ${e.nom} ${e.matricule}`.toLowerCase().includes(search.toLowerCase())
      const matchFilter = !filterVerdict
        ? true
        : filterVerdict === "borderline"
        ? isBorderline(e.moyenneGenerale)
        : e.verdictFinal === filterVerdict
      return matchSearch && matchFilter
    })
  }, [etudiants, search, filterVerdict])

  /* Select all filtered */
  const allSelected = filtered.length > 0 && filtered.every(e => selected.has(e.id))
  function toggleSelectAll() {
    if (allSelected) { const s = new Set(selected); filtered.forEach(e => s.delete(e.id)); setSelected(s) }
    else { const s = new Set(selected); filtered.forEach(e => s.add(e.id)); setSelected(s) }
  }

  const borderlineCount = etudiants.filter(e => isBorderline(e.moyenneGenerale)).length

  const FILTER_TABS: { key: Verdict | "borderline" | ""; label: string; count: number; color: string }[] = [
    { key: "",           label: "Tous",       count: etudiants.length, color: "rgba(255,255,255,0.5)" },
    { key: "admis",      label: "Admis",      count: etudiants.filter(e => e.verdictFinal === "admis").length,      color: "#10B981" },
    { key: "rattrapage", label: "Rattrapage", count: etudiants.filter(e => e.verdictFinal === "rattrapage").length, color: "#F59E0B" },
    { key: "ajourné",    label: "Ajourné",    count: etudiants.filter(e => e.verdictFinal === "ajourné").length,    color: "#EF4444" },
    { key: "borderline", label: "Borderline", count: borderlineCount,                                              color: "#F59E0B" },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* ── Top: Classe info + Workflow ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap"
        style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="size-10 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <Gavel className="size-5" style={{ color: "#C9A84C" }} />
          </div>
          <div>
            <div className="text-[13px] font-bold text-white">{classe} · {periode}</div>
            <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {etudiants.length} étudiants · {borderlineCount} cas borderline
            </div>
          </div>
        </div>
        <WorkflowBadge status={workflow} onAdvance={handleAdvanceWorkflow} />
      </motion.div>

      {/* ── Consensus bar ── */}
      <ConsensusBar etudiants={etudiants} />

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un étudiant…"
              className="w-full rounded-xl pl-8 pr-3 py-2 text-[10px] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }} />
          </div>

          {/* Auto apply */}
          {!isPublished && (
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleAutoApply}
              className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold whitespace-nowrap"
              style={{ background: "rgba(59,130,246,0.08)", color: "#3B82F6", border: "1px solid rgba(59,130,246,0.2)" }}>
              <Zap className="size-3.5" />Appliquer règles auto
            </motion.button>
          )}

          {/* Bulk verdict */}
          {selected.size > 0 && !isPublished && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 rounded-xl px-3 py-1.5"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <span className="text-[9px] font-bold" style={{ color: "#C9A84C" }}>{selected.size} sélectionnés</span>
              <select value={bulkVerdict} onChange={e => setBulkVerdict(e.target.value as Verdict | "")}
                className="appearance-none rounded-lg px-2 py-0.5 text-[9px] outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                <option value="">Verdict…</option>
                {(["admis", "rattrapage", "ajourné", "exclu"] as Verdict[]).map(v => (
                  <option key={v} value={v} style={{ background: "#08111f" }}>{VERDICT_CONFIG[v].label}</option>
                ))}
              </select>
              <motion.button whileTap={{ scale: 0.92 }} onClick={handleBulkApply}
                className="rounded-lg px-2 py-0.5 text-[9px] font-bold"
                style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C" }}>
                Appliquer
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {FILTER_TABS.map(f => (
            <button key={f.key} onClick={() => setFilterVerdict(f.key)}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all"
              style={filterVerdict === f.key
                ? { background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }
                : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {f.key === "borderline" && <FlameKindling className="size-2.5" />}
              {f.label}
              <span className="rounded px-1 text-[7px]"
                style={{ background: filterVerdict === f.key ? `${f.color}20` : "rgba(255,255,255,0.06)" }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2.5"
          style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {!isPublished && (
            <button onClick={toggleSelectAll}
              className="size-4 rounded flex-shrink-0 flex items-center justify-center transition-all"
              style={allSelected
                ? { background: "#C9A84C", border: "1px solid #C9A84C" }
                : { background: "transparent", border: "1px solid rgba(255,255,255,0.15)" }}>
              {allSelected && <Check className="size-2.5 text-[#050d18]" />}
            </button>
          )}
          {[
            { label: "Étudiant", cls: "flex-1" },
            { label: "Moyenne", cls: "w-14 text-center hidden sm:block" },
            { label: "Absences", cls: "w-10 text-center hidden lg:block" },
            { label: "Verdict", cls: "flex-shrink-0" },
            { label: "", cls: "w-8" },
          ].map(h => (
            <div key={h.label} className={`text-[8px] font-black uppercase tracking-widest ${h.cls}`}
              style={{ color: "rgba(255,255,255,0.2)" }}>{h.label}</div>
          ))}
        </div>

        {/* Body */}
        <div className="overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Aucun étudiant trouvé
              </div>
            ) : filtered.map((et, i) => (
              <StudentRow key={et.id} et={et} i={i}
                selected={selected.has(et.id)}
                onSelect={() => {
                  const s = new Set(selected)
                  s.has(et.id) ? s.delete(et.id) : s.add(et.id)
                  setSelected(s)
                }}
                onVerdictChange={handleVerdictChange}
                isPublished={isPublished} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Published notice */}
      {isPublished && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-3 rounded-xl px-4 py-3"
          style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)" }}>
          <Shield className="size-4 flex-shrink-0" style={{ color: "#10B981" }} />
          <div>
            <div className="text-[11px] font-bold" style={{ color: "#10B981" }}>Délibération publiée — Registre immuable</div>
            <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Aucune modification n'est possible. Consultez l'historique pour les détails.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
