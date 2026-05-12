"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, FileText, ChevronDown, ChevronUp,
  CalendarDays, AlertTriangle, CheckCircle2, XCircle,
} from "lucide-react"
import {
  CONTRATS, FICHES_PAIE, type TypeContrat, type StatutContrat, type StatutPaie, formatGNF,
} from "./rh-mock-data"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const STATUT_CNT_CFG: Record<StatutContrat, { lbl: string; color: string }> = {
  actif:    { lbl: "Actif",    color: EM },
  expiré:   { lbl: "Expiré",   color: RD },
  résilié:  { lbl: "Résilié",  color: AM },
}
const TYPE_CNT_CFG: Record<TypeContrat, { lbl: string; color: string }> = {
  CDI:       { lbl: "CDI",       color: BL },
  CDD:       { lbl: "CDD",       color: AM },
  vacataire: { lbl: "Vacataire", color: PR },
  stage:     { lbl: "Stage",     color: G  },
}
const STATUT_PAIE_CFG: Record<StatutPaie, { lbl: string; color: string }> = {
  brouillon: { lbl: "Brouillon", color: AM },
  validé:    { lbl: "Validé",    color: BL },
  payé:      { lbl: "Payé",      color: EM },
}

type View = "contrats" | "paie"

export function ContratsPage() {
  const [view, setView]             = useState<View>("contrats")
  const [search, setSearch]         = useState("")
  const [filterType, setFilterType] = useState<TypeContrat | "all">("all")
  const [filterStatut, setFilterStatut] = useState<StatutContrat | "all">("all")
  const [filterStatutPaie, setFilterStatutPaie] = useState<StatutPaie | "all">("all")
  const [expanded, setExpanded]     = useState<string | null>(null)

  const filteredContrats = CONTRATS.filter(c => {
    const match = c.employeNom.toLowerCase().includes(search.toLowerCase())
    return match
      && (filterType   === "all" || c.type   === filterType)
      && (filterStatut === "all" || c.statut === filterStatut)
  })

  const filteredPaie = FICHES_PAIE.filter(f => {
    const match = f.employeNom.toLowerCase().includes(search.toLowerCase())
    return match && (filterStatutPaie === "all" || f.statut === filterStatutPaie)
  })

  const masseTotale = FICHES_PAIE.filter(f => f.statut === "payé").reduce((s, f) => s + f.net, 0)

  return (
    <div className="flex flex-col gap-4">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Contrats actifs",  val: CONTRATS.filter(c => c.statut === "actif").length,    color: EM },
          { lbl: "CDI",              val: CONTRATS.filter(c => c.type === "CDI").length,         color: BL },
          { lbl: "CDD / Vacataires", val: CONTRATS.filter(c => c.type !== "CDI").length,         color: AM },
          { lbl: "Masse salariale",  val: formatGNF(masseTotale),                               color: G  },
        ].map((s, i) => (
          <motion.div key={s.lbl}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl p-3 text-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[16px] font-black truncate px-1" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-1 self-start rounded-xl p-1"
        style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}>
        {(["contrats","paie"] as View[]).map(v => (
          <button key={v} onClick={() => { setView(v); setExpanded(null) }}
            className="rounded-lg px-4 py-1.5 text-[10px] font-bold capitalize transition-all"
            style={view === v
              ? { background: G, color: "#000" }
              : { background: "transparent", color: "rgba(255,255,255,0.35)" }}>
            {v === "contrats" ? "Contrats" : "Fiches de paie"}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[160px] flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un employé…"
            className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
        </div>
        {view === "contrats" && (
          <>
            <div style={{ minWidth: 130 }}>
              <SelectCustom value={filterType} onChange={v => setFilterType(v as TypeContrat | "all")}
                options={[{ value: "all", label: "Tous types" }, ...Object.entries(TYPE_CNT_CFG).map(([k, v]) => ({ value: k, label: v.lbl }))]} />
            </div>
            <div style={{ minWidth: 130 }}>
              <SelectCustom value={filterStatut} onChange={v => setFilterStatut(v as StatutContrat | "all")}
                options={[{ value: "all", label: "Tous statuts" }, ...Object.entries(STATUT_CNT_CFG).map(([k, v]) => ({ value: k, label: v.lbl }))]} />
            </div>
          </>
        )}
        {view === "paie" && (
          <div style={{ minWidth: 140 }}>
            <SelectCustom value={filterStatutPaie} onChange={v => setFilterStatutPaie(v as StatutPaie | "all")}
              options={[{ value: "all", label: "Tous statuts" }, ...Object.entries(STATUT_PAIE_CFG).map(([k, v]) => ({ value: k, label: v.lbl }))]} />
          </div>
        )}
      </div>

      {/* ── Contrats ── */}
      {view === "contrats" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="grid px-4 py-2.5"
            style={{ gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 1.1fr 0.9fr", background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${BORDER}` }}>
            {["Employé","Type","Début","Fin / Durée","Salaire net","Statut"].map(h => (
              <div key={h} className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
            ))}
          </div>
          {filteredContrats.map((c, i) => {
            const sc = STATUT_CNT_CFG[c.statut]
            const tc = TYPE_CNT_CFG[c.type]
            const isExpiring = c.dateFin && c.dateFin < "2025-09-01" && c.statut === "actif"
            return (
              <div key={c.id} className="grid px-4 py-3 items-center"
                style={{
                  gridTemplateColumns: "2fr 1fr 1.2fr 1.2fr 1.1fr 0.9fr",
                  borderBottom: i < filteredContrats.length - 1 ? `1px solid ${BORDER}` : "none",
                  background: isExpiring ? "rgba(249,115,22,0.02)" : i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                <div>
                  <div className="text-[9.5px] font-bold text-white">{c.employeNom}</div>
                  <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{c.departement}</div>
                </div>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full w-fit"
                  style={{ background: `${tc.color}12`, color: tc.color, border: `1px solid ${tc.color}20` }}>{tc.lbl}</span>
                <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.45)" }}>{c.dateDebut}</div>
                <div className="flex items-center gap-1">
                  {isExpiring && <AlertTriangle size={10} style={{ color: AM }} />}
                  <span className="text-[8.5px]" style={{ color: isExpiring ? AM : "rgba(255,255,255,0.45)" }}>
                    {c.dateFin ?? "Indéterminé"}
                  </span>
                </div>
                <div className="text-[9px] font-bold" style={{ color: EM }}>{formatGNF(c.salaireNet)}</div>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full w-fit"
                  style={{ background: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}20` }}>{sc.lbl}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Fiches de paie ── */}
      {view === "paie" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="grid px-4 py-2.5"
            style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 1.1fr 0.9fr", background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${BORDER}` }}>
            {["Employé","Département","Base","Primes","Déductions","Net","Statut"].map(h => (
              <div key={h} className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
            ))}
          </div>
          {filteredPaie.map((f, i) => {
            const sp = STATUT_PAIE_CFG[f.statut]
            return (
              <div key={f.id} className="grid px-4 py-3 items-center"
                style={{
                  gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 1.1fr 0.9fr",
                  borderBottom: i < filteredPaie.length - 1 ? `1px solid ${BORDER}` : "none",
                  background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                <div>
                  <div className="text-[9.5px] font-bold text-white">{f.employeNom}</div>
                  <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Mai {f.annee}</div>
                </div>
                <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{f.departement}</div>
                <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>{formatGNF(f.salaireBase)}</div>
                <div className="text-[8.5px]" style={{ color: EM }}>+{formatGNF(f.primes)}</div>
                <div className="text-[8.5px]" style={{ color: RD }}>−{formatGNF(f.deductions)}</div>
                <div className="text-[9px] font-bold" style={{ color: G }}>{formatGNF(f.net)}</div>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full w-fit"
                  style={{ background: `${sp.color}12`, color: sp.color, border: `1px solid ${sp.color}20` }}>{sp.lbl}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
