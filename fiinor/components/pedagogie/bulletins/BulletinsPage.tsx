"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Download, Eye, Search, CheckCircle2,
  AlertTriangle, XCircle, Shield, ZoomIn,
  ZoomOut, X, ChevronLeft, ChevronRight, Megaphone, List,
} from "lucide-react"
import { BulletinPreview, MOCK_BULLETIN, type BulletinData, type BulletinVerdict } from "./BulletinPreview"
import { BulletinDownloadButton } from "./BulletinDownloadButtonDynamic"
import { ProclamationResultats } from "./ProclamationResultats"
import { MOCK_LIST } from "./bulletin-mock-data"

/* ─── Config ─── */
const VERDICT_CFG: Record<BulletinVerdict, { label: string; color: string; bg: string; border: string; icon: React.ElementType }> = {
  admis:      { label: "Admis",      color: "#10B981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)",  icon: CheckCircle2  },
  rattrapage: { label: "Rattrapage", color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)",  icon: AlertTriangle },
  ajourné:    { label: "Ajourné",    color: "#EF4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)",   icon: XCircle       },
  exclu:      { label: "Exclu",      color: "#7C3AED", bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.25)",  icon: Shield        },
}


/* ─── Full-screen preview modal ─── */
function PreviewModal({ data, onClose, onPrev, onNext, hasPrev, hasNext }: {
  data: BulletinData
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const [zoom, setZoom] = useState(0.65)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
      style={{ background: "rgba(2,8,15,0.96)" }}>

      {/* Modal toolbar */}
      <div className="flex items-center justify-between gap-3 px-5 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "#07111d" }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}>
            <FileText className="size-4" style={{ color: "#C9A84C" }} />
          </div>
          <div className="min-w-0">
            <div className="text-[12px] font-bold text-white truncate">
              {data.etudiantNom} {data.etudiantPrenom}
            </div>
            <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              {data.classe} · {data.semestre} · {data.anneeAcademique}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom */}
          <div className="flex items-center gap-1 rounded-xl px-2 py-1.5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <button onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
              className="rounded p-0.5 transition-colors"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              <ZoomOut className="size-3.5" />
            </button>
            <span className="text-[9px] font-mono w-8 text-center" style={{ color: "rgba(255,255,255,0.6)" }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom(z => Math.min(1.2, z + 0.1))}
              className="rounded p-0.5 transition-colors"
              style={{ color: "rgba(255,255,255,0.5)" }}>
              <ZoomIn className="size-3.5" />
            </button>
          </div>

          {/* Download — vrai PDF */}
          <BulletinDownloadButton
            data={data}
            label="Télécharger PDF"
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
            style={{ background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#050d18", textDecoration: "none" }} />

          {/* Close */}
          <button onClick={onClose}
            className="rounded-xl p-2 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto flex items-start justify-center py-8 px-4"
        style={{ background: "#0a1520" }}>
        <div style={{ position: "relative" }}>
          <BulletinPreview data={data} scale={zoom} />
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="flex items-center justify-center gap-3 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#07111d" }}>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onPrev} disabled={!hasPrev}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition-all"
          style={hasPrev
            ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }
            : { background: "transparent", color: "rgba(255,255,255,0.15)", cursor: "not-allowed" }}>
          <ChevronLeft className="size-3.5" />Précédent
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onNext} disabled={!hasNext}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-semibold transition-all"
          style={hasNext
            ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }
            : { background: "transparent", color: "rgba(255,255,255,0.15)", cursor: "not-allowed" }}>
          Suivant<ChevronRight className="size-3.5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ─── Student row in list ─── */
function BulletinRow({ bulletin, index, onPreview }: {
  bulletin: BulletinData
  index: number
  onPreview: () => void
}) {
  const vCfg = VERDICT_CFG[bulletin.verdict]
  const VerdictIcon = vCfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, type: "spring" as const, stiffness: 400, damping: 30 }}
      className="group flex items-center gap-3 px-4 py-3 flex-wrap"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.025)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

      {/* Index */}
      <span className="text-[9px] font-mono w-5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
        {index + 1}
      </span>

      {/* Avatar */}
      <div className="size-8 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-black"
        style={{ background: `${vCfg.color}12`, color: vCfg.color, border: `1px solid ${vCfg.color}25` }}>
        {bulletin.etudiantPrenom[0]}{bulletin.etudiantNom[0]}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-[120px]">
        <div className="text-[11px] font-bold text-white truncate">
          {bulletin.etudiantPrenom} {bulletin.etudiantNom}
        </div>
        <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.28)" }}>
          {bulletin.matricule}
        </div>
      </div>

      {/* Moyenne */}
      <div className="hidden sm:block text-center flex-shrink-0 w-16">
        <div className="text-[14px] font-black tabular-nums"
          style={{ color: bulletin.moyenneGenerale >= 10 ? "#10B981" : bulletin.moyenneGenerale >= 8 ? "#F59E0B" : "#EF4444" }}>
          {bulletin.moyenneGenerale.toFixed(2)}
        </div>
        <div className="text-[7px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>/20</div>
      </div>

      {/* Rang */}
      <div className="hidden md:block text-center flex-shrink-0 w-12">
        <div className="text-[11px] font-bold" style={{ color: bulletin.rang <= 3 ? "#F59E0B" : "rgba(255,255,255,0.4)" }}>
          {bulletin.rang}/{bulletin.effectif}
        </div>
        <div className="text-[7px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Rang</div>
      </div>

      {/* Verdict badge */}
      <div className="flex items-center gap-1 rounded-lg px-2 py-1 flex-shrink-0"
        style={{ background: vCfg.bg, border: `1px solid ${vCfg.border}` }}>
        <VerdictIcon className="size-3" style={{ color: vCfg.color }} />
        <span className="text-[8px] font-black uppercase tracking-wider hidden sm:inline" style={{ color: vCfg.color }}>
          {vCfg.label}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <motion.button whileTap={{ scale: 0.9 }} onClick={onPreview}
          className="rounded-lg p-1.5 transition-all"
          style={{ background: "rgba(59,130,246,0.08)", color: "#3B82F6", border: "1px solid rgba(59,130,246,0.2)" }}
          title="Aperçu">
          <Eye className="size-3.5" />
        </motion.button>
        <BulletinDownloadButton
          data={bulletin}
          iconOnly
          iconSize={14}
          className="rounded-lg p-1.5 transition-all flex items-center justify-center"
          style={{ background: "rgba(201,168,76,0.08)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }} />
      </div>
    </motion.div>
  )
}

/* ─── Main ─── */
export function BulletinsPage() {
  const [view, setView] = useState<"bulletins" | "proclamation">("bulletins")
  const [search, setSearch] = useState("")
  const [filterVerdict, setFilterVerdict] = useState<BulletinVerdict | "">("")
  const [previewIdx, setPreviewIdx] = useState<number | null>(null)

  const filtered = useMemo(() => MOCK_LIST.filter(b => {
    const matchSearch = !search || `${b.etudiantPrenom} ${b.etudiantNom} ${b.matricule}`.toLowerCase().includes(search.toLowerCase())
    const matchVerdict = !filterVerdict || b.verdict === filterVerdict
    return matchSearch && matchVerdict
  }), [search, filterVerdict])


  const counts = useMemo(() => {
    const c: Record<BulletinVerdict | "total", number> = { total: MOCK_LIST.length, admis: 0, rattrapage: 0, ajourné: 0, exclu: 0 }
    MOCK_LIST.forEach(b => c[b.verdict]++)
    return c
  }, [])

  const FILTER_TABS: { key: BulletinVerdict | ""; label: string; count: number; color: string }[] = [
    { key: "",           label: "Tous",       count: counts.total,      color: "rgba(255,255,255,0.5)" },
    { key: "admis",      label: "Admis",      count: counts.admis,      color: "#10B981" },
    { key: "rattrapage", label: "Rattrapage", count: counts.rattrapage, color: "#F59E0B" },
    { key: "ajourné",    label: "Ajourné",    count: counts.ajourné,    color: "#EF4444" },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-7 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <FileText className="size-3.5" style={{ color: "#C9A84C" }} />
            </div>
            <h1 className="text-[20px] font-black text-white tracking-tight">Bulletins de notes</h1>
          </div>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            {MOCK_BULLETIN.classe} · {MOCK_BULLETIN.semestre} · {MOCK_BULLETIN.anneeAcademique}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-xl p-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {(["bulletins", "proclamation"] as const).map(v => {
            const Icon = v === "bulletins" ? List : Megaphone
            const label = v === "bulletins" ? "Bulletins" : "Proclamation"
            return (
              <button key={v} onClick={() => setView(v)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all"
                style={view === v
                  ? { background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }
                  : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid transparent" }}>
                <Icon className="size-3" />{label}
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* Proclamation view */}
      <AnimatePresence mode="wait">
        {view === "proclamation" && (
          <motion.div key="proclamation"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}
            className="rounded-2xl overflow-hidden p-5"
            style={{ background: "white" }}>
            <ProclamationResultats />
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI cards + liste — masqués en mode proclamation */}
      {view === "bulletins" && <>
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FILTER_TABS.slice(1).map(f => (
          <motion.div key={f.key}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
            className="rounded-2xl px-4 py-3 text-center"
            style={{ background: "#07111d", border: `1px solid ${f.color}20` }}>
            <div className="text-[24px] font-black tabular-nums" style={{ color: f.color }}>{f.count}</div>
            <div className="text-[8px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{f.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un étudiant…"
              className="w-full rounded-xl pl-8 pr-3 py-2 text-[10px] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }} />
          </div>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {FILTER_TABS.map(f => (
            <button key={f.key} onClick={() => setFilterVerdict(f.key)}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all"
              style={filterVerdict === f.key
                ? { background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }
                : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {f.label}
              <span className="rounded px-1 text-[7px]"
                style={{ background: filterVerdict === f.key ? `${f.color}20` : "rgba(255,255,255,0.06)" }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Table header */}
        <div className="flex items-center gap-3 px-4 py-2.5"
          style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="w-5 flex-shrink-0" />
          <span className="w-8 flex-shrink-0" />
          <span className="flex-1 text-[8px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Étudiant</span>
          <span className="hidden sm:block w-16 text-center text-[8px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Moy.</span>
          <span className="hidden md:block w-12 text-center text-[8px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>Rang</span>
          <span className="text-[8px] font-black uppercase tracking-widest flex-shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>Verdict</span>
          <span className="w-16 flex-shrink-0" />
        </div>

        {/* Rows */}
        <div className="overflow-y-auto" style={{ maxHeight: "55vh" }}>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Aucun bulletin trouvé
              </div>
            ) : filtered.map((b, i) => (
              <BulletinRow key={b.matricule} bulletin={b} index={i}
                onPreview={() => setPreviewIdx(MOCK_LIST.findIndex(x => x.matricule === b.matricule))} />
            ))}
          </AnimatePresence>
        </div>
      </div>


      </> /* end view === bulletins */}

      {/* Full-screen preview modal */}
      <AnimatePresence>
        {previewIdx !== null && (
          <PreviewModal
            data={MOCK_LIST[previewIdx]}
            onClose={() => setPreviewIdx(null)}
            onPrev={() => setPreviewIdx(i => Math.max(0, (i ?? 0) - 1))}
            onNext={() => setPreviewIdx(i => Math.min(MOCK_LIST.length - 1, (i ?? 0) + 1))}
            hasPrev={(previewIdx ?? 0) > 0}
            hasNext={(previewIdx ?? 0) < MOCK_LIST.length - 1} />
        )}
      </AnimatePresence>
    </div>
  )
}
