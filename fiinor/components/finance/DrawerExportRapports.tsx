"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, FileText, FileSpreadsheet, Download,
  Loader2, Check, BarChart3,
  Users, BookOpen, Receipt,
} from "lucide-react"

const ExportDownloadButton = dynamic(
  () => import("./ExportsPDF").then(m => m.ExportDownloadButton),
  { ssr: false }
)

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const BL = "#3B82F6"

type RapportType = "journal" | "balance" | "classe" | "recu"
type PdfExportKey = "journal" | "balance" | "classe" | "budget"

const RAPPORT_TO_PDF: Partial<Record<RapportType, PdfExportKey>> = {
  journal: "journal",
  balance: "balance",
  classe:  "classe",
}
type FormatType  = "pdf" | "excel"

const RAPPORT_OPTS: { key: RapportType; label: string; desc: string; icon: React.ElementType; color: string }[] = [
  { key: "journal",  label: "Journal comptable",        desc: "Toutes les transactions de la période", icon: BookOpen,        color: G },
  { key: "balance",  label: "Balance générale",         desc: "Débits, crédits, soldes par compte",   icon: BarChart3,       color: BL },
  { key: "classe",   label: "Récapitulatif par classe", desc: "Taux de recouvrement par promotion",   icon: Users,           color: EM },
  { key: "recu",     label: "Reçus étudiants",          desc: "Export PDF des reçus individuels",     icon: Receipt,         color: "#f97316" },
]

const FORMAT_OPTS: { key: FormatType; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { key: "pdf",   label: "PDF",   icon: FileText,        color: "#EF4444", desc: "Mise en page officielle, imprimable" },
  { key: "excel", label: "Excel", icon: FileSpreadsheet, color: EM,        desc: "Données brutes, filtrable" },
]

const PERIODES = [
  { key: "mois",    label: "Ce mois" },
  { key: "trim",    label: "Ce trimestre" },
  { key: "sem",     label: "Ce semestre" },
  { key: "annee",   label: "Cette année" },
  { key: "custom",  label: "Personnalisé" },
]

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[8.5px] font-black uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.3)" }}>{label}</label>
      {children}
    </div>
  )
}

function FInput({ value, onChange, type = "date" }: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl px-3 py-2.5 text-[11px] outline-none"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
      onFocus={e => e.currentTarget.style.border = `1px solid ${G}50`}
      onBlur={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"}
    />
  )
}

interface DrawerExportRapportsProps {
  open: boolean
  onClose: () => void
}

export function DrawerExportRapports({ open, onClose }: DrawerExportRapportsProps) {
  const [rapport, setRapport] = useState<RapportType | null>(null)
  const [format, setFormat] = useState<FormatType>("pdf")
  const [periode, setPeriode] = useState("mois")
  const [dateDebut, setDateDebut] = useState("2024-01-01")
  const [dateFin, setDateFin] = useState("2024-12-31")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (open) {
      setRapport(null); setFormat("pdf"); setPeriode("mois")
      setLoading(false); setProgress(0); setDone(false)
    }
  }, [open])

  function handleGenerate() {
    if (!rapport || loading) return
    setLoading(true); setProgress(0)
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setLoading(false); setDone(true); return 100 }
        return p + Math.random() * 18
      })
    }, 150)
  }

  const canGenerate = !!rapport && !loading && !done

  const periodeLabel = periode === "custom"
    ? `${dateDebut} → ${dateFin}`
    : periode === "mois" ? "Ce mois (Mai 2025)"
    : periode === "trim" ? "T1 2025"
    : periode === "sem"  ? "Semestre 1 2024-2025"
    : "Année académique 2024-2025"

  const pdfKey = rapport ? RAPPORT_TO_PDF[rapport] : undefined
  const isPdfReady = !!rapport && format === "pdf" && !!pdfKey

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex flex-col overflow-hidden"
            style={{ width: "min(460px, 100vw)", background: "#0a1628", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>

            <div className="h-0.5 flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${BL}, ${G} 60%, transparent)` }} />

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <div className="text-[14px] font-black text-white">Export & Rapports</div>
                <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Générer un rapport PDF ou Excel
                </div>
              </div>
              <button onClick={onClose}
                className="rounded-xl p-2 flex-shrink-0 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

              {/* Type rapport */}
              <Field label="1 · Type de rapport">
                <div className="flex flex-col gap-2">
                  {RAPPORT_OPTS.map(r => {
                    const Icon = r.icon
                    const active = rapport === r.key
                    return (
                      <button key={r.key} onClick={() => setRapport(r.key)}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all"
                        style={{
                          background: active ? `${r.color}10` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? r.color + "40" : "rgba(255,255,255,0.07)"}`,
                        }}>
                        <div className="rounded-xl p-2.5 flex-shrink-0"
                          style={{ background: active ? `${r.color}18` : "rgba(255,255,255,0.05)" }}>
                          <Icon size={14} style={{ color: active ? r.color : "rgba(255,255,255,0.3)" }} />
                        </div>
                        <div className="flex-1">
                          <div className="text-[10.5px] font-bold"
                            style={{ color: active ? r.color : "rgba(255,255,255,0.7)" }}>{r.label}</div>
                          <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{r.desc}</div>
                        </div>
                        <div className="size-4 rounded-full flex-shrink-0 flex items-center justify-center"
                          style={{ border: `2px solid ${active ? r.color : "rgba(255,255,255,0.15)"}`, background: active ? r.color : "transparent" }}>
                          {active && <Check size={9} color="#000" strokeWidth={3} />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* Période */}
              <Field label="2 · Période">
                <div className="flex gap-1.5 flex-wrap">
                  {PERIODES.map(p => (
                    <button key={p.key} onClick={() => setPeriode(p.key)}
                      className="rounded-lg px-2.5 py-1.5 text-[9px] font-bold transition-all"
                      style={periode === p.key
                        ? { background: `${G}15`, color: G, border: `1px solid ${G}35` }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      {p.label}
                    </button>
                  ))}
                </div>
                {periode === "custom" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <div className="text-[7.5px] mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Du</div>
                      <FInput value={dateDebut} onChange={setDateDebut} />
                    </div>
                    <div>
                      <div className="text-[7.5px] mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>Au</div>
                      <FInput value={dateFin} onChange={setDateFin} />
                    </div>
                  </motion.div>
                )}
              </Field>

              {/* Format */}
              <Field label="3 · Format">
                <div className="grid grid-cols-2 gap-2">
                  {FORMAT_OPTS.map(f => {
                    const Icon = f.icon
                    const active = format === f.key
                    return (
                      <button key={f.key} onClick={() => setFormat(f.key)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 transition-all"
                        style={{
                          background: active ? `${f.color}10` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? f.color + "40" : "rgba(255,255,255,0.07)"}`,
                        }}>
                        <Icon size={16} style={{ color: active ? f.color : "rgba(255,255,255,0.3)" }} />
                        <div className="text-left">
                          <div className="text-[10px] font-black" style={{ color: active ? f.color : "rgba(255,255,255,0.6)" }}>
                            {f.label}
                          </div>
                          <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>{f.desc}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* Preview thumbnail */}
              {rapport && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="px-4 py-3 flex items-center justify-between"
                    style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[8.5px] font-black uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Aperçu
                    </span>
                    <span className="text-[8px] font-mono" style={{ color: G }}>
                      {format.toUpperCase()} · {PERIODES.find(p => p.key === periode)?.label}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col gap-2" style={{ background: "rgba(255,255,255,0.015)" }}>
                    {/* Fake document preview */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="size-6 rounded" style={{ background: `${G}20` }} />
                      <div className="flex flex-col gap-1">
                        <div className="h-1.5 rounded-full w-28" style={{ background: "rgba(255,255,255,0.1)" }} />
                        <div className="h-1 rounded-full w-20" style={{ background: "rgba(255,255,255,0.06)" }} />
                      </div>
                    </div>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="h-1.5 rounded-full flex-1" style={{ background: "rgba(255,255,255,0.06)", width: `${60 + i * 8}%` }} />
                        <div className="h-1.5 rounded-full w-10" style={{ background: "rgba(255,255,255,0.1)" }} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* PDF ready badge */}
              {isPdfReady && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5"
                  style={{ background: `rgba(16,185,129,0.08)`, border: `1px solid rgba(16,185,129,0.2)` }}>
                  <Check size={11} style={{ color: EM }} />
                  <span className="text-[8.5px] font-bold" style={{ color: EM }}>
                    PDF prêt — cliquez sur «\u00a0Télécharger\u00a0» pour lancer la génération
                  </span>
                </motion.div>
              )}

              {/* Progress bar (Excel simulation only) */}
              {(loading || done) && format === "excel" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8.5px] font-bold" style={{ color: done ? EM : "rgba(255,255,255,0.5)" }}>
                      {done ? "Fichier Excel prêt !" : "Génération en cours…"}
                    </span>
                    <span className="text-[8.5px] font-black tabular-nums" style={{ color: done ? EM : G }}>
                      {Math.round(Math.min(progress, 100))}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      className="h-full rounded-full"
                      style={{ background: done ? EM : G }} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex gap-3 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}>
              <button onClick={onClose}
                className="flex-1 rounded-xl py-2.5 text-[10px] font-bold"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                Fermer
              </button>
              {/* PDF format → real download via react-pdf */}
              {isPdfReady ? (
                <ExportDownloadButton
                  type={pdfKey!}
                  periode={periodeLabel}
                />
              ) : (
                <button
                  onClick={done ? onClose : handleGenerate}
                  disabled={!canGenerate}
                  className="flex-[2] rounded-xl py-2.5 text-[11px] font-black flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: done ? EM : canGenerate ? G : "rgba(255,255,255,0.05)",
                    color: done ? "white" : canGenerate ? "#000" : "rgba(255,255,255,0.2)",
                    cursor: canGenerate || done ? "pointer" : "not-allowed",
                  }}>
                  {loading ? <Loader2 size={13} className="animate-spin" />
                    : done ? <><Download size={13} /> Télécharger Excel</>
                    : <><BarChart3 size={13} /> Générer le rapport</>}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
