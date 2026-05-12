"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, CheckCircle2, XCircle, Clock,
  CalendarDays, User,
} from "lucide-react"
import { CONGES, type TypeConge, type StatutConge, type Departement } from "./rh-mock-data"
import { SelectCustom } from "../services/SelectCustom"
import { DrawerDemandeConge } from "./DrawerDemandeConge"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const STATUT_CFG: Record<StatutConge, { lbl: string; color: string; icon: React.ElementType }> = {
  approuvé:    { lbl: "Approuvé",    color: EM, icon: CheckCircle2 },
  en_attente:  { lbl: "En attente",  color: AM, icon: Clock },
  refusé:      { lbl: "Refusé",      color: RD, icon: XCircle },
}
const TYPE_CFG: Record<TypeConge, { lbl: string; color: string }> = {
  annuel:      { lbl: "Annuel",      color: BL },
  maladie:     { lbl: "Maladie",     color: RD },
  maternité:   { lbl: "Maternité",   color: PR },
  paternité:   { lbl: "Paternité",   color: G  },
  sans_solde:  { lbl: "Sans solde",  color: AM },
}

export function CongesPage() {
  const [search, setSearch]         = useState("")
  const [filterType, setFilterType] = useState<TypeConge | "all">("all")
  const [filterStatut, setFilterStatut] = useState<StatutConge | "all">("all")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [decisions, setDecisions]   = useState<Record<string, StatutConge>>({})

  const filtered = CONGES.filter(c => {
    const match = `${c.employeNom} ${c.employePoste} ${c.departement}`.toLowerCase().includes(search.toLowerCase())
    return match
      && (filterType   === "all" || c.type   === filterType)
      && (filterStatut === "all" || (decisions[c.id] ?? c.statut) === filterStatut)
  })

  function decide(id: string, decision: "approuvé" | "refusé") {
    setDecisions(prev => ({ ...prev, [id]: decision }))
  }

  const enAttente = CONGES.filter(c => (decisions[c.id] ?? c.statut) === "en_attente").length

  return (
    <div className="flex flex-col gap-4">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "En attente",  val: enAttente,                                                                        color: AM },
          { lbl: "Approuvés",   val: CONGES.filter(c => (decisions[c.id] ?? c.statut) === "approuvé").length,          color: EM },
          { lbl: "Refusés",     val: CONGES.filter(c => (decisions[c.id] ?? c.statut) === "refusé").length,             color: RD },
          { lbl: "Jours pris",  val: CONGES.filter(c => (decisions[c.id] ?? c.statut) === "approuvé").reduce((s,c) => s + c.jours, 0), color: BL },
        ].map((s, i) => (
          <motion.div key={s.lbl}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl p-3 text-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[18px] font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* Alertes en attente */}
      <AnimatePresence>
        {enAttente > 0 && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ background: `${AM}08`, border: `1px solid ${AM}20` }}>
            <Clock size={12} style={{ color: AM }} />
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.6)" }}>
              <strong style={{ color: AM }}>{enAttente} demande{enAttente > 1 ? "s" : ""}</strong> de congé en attente d'approbation
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[160px] flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Employé, poste, département…"
            className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
        </div>
        <div style={{ minWidth: 140 }}>
          <SelectCustom value={filterType} onChange={v => setFilterType(v as TypeConge | "all")}
            options={[{ value: "all", label: "Tous types" }, ...Object.entries(TYPE_CFG).map(([k, v]) => ({ value: k, label: v.lbl }))]} />
        </div>
        <div style={{ minWidth: 140 }}>
          <SelectCustom value={filterStatut} onChange={v => setFilterStatut(v as StatutConge | "all")}
            options={[{ value: "all", label: "Tous statuts" }, ...Object.entries(STATUT_CFG).map(([k, v]) => ({ value: k, label: v.lbl }))]} />
        </div>
        <button onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
          style={{ background: G, color: "#000" }}>
          <Plus size={11} /> Demande congé
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="grid px-4 py-2.5"
          style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 1fr 1.2fr", background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${BORDER}` }}>
          {["Employé","Type","Début","Fin","Jours","Statut","Actions"].map(h => (
            <div key={h} className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Aucune demande ne correspond aux filtres
          </div>
        )}

        {filtered.map((c, i) => {
          const statut  = decisions[c.id] ?? c.statut
          const sc      = STATUT_CFG[statut]
          const tc      = TYPE_CFG[c.type]
          const SIcon   = sc.icon
          return (
            <div key={c.id} className="grid px-4 py-3 items-center"
              style={{
                gridTemplateColumns: "2fr 1fr 1fr 1fr 0.8fr 1fr 1.2fr",
                borderBottom: i < filtered.length - 1 ? `1px solid ${BORDER}` : "none",
                background: statut === "en_attente" ? `${AM}05` : i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
              }}>
              {/* Employé */}
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0"
                  style={{ background: `${tc.color}15`, color: tc.color }}>
                  {c.employeNom.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-[9.5px] font-bold text-white truncate">{c.employeNom}</div>
                  <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{c.departement}</div>
                </div>
              </div>
              {/* Type */}
              <span className="text-[7.5px] px-1.5 py-0.5 rounded-full w-fit"
                style={{ background: `${tc.color}12`, color: tc.color, border: `1px solid ${tc.color}20` }}>
                {tc.lbl}
              </span>
              {/* Dates */}
              <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.45)" }}>{c.dateDebut}</div>
              <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.45)" }}>{c.dateFin}</div>
              {/* Jours */}
              <div className="text-[9px] font-bold" style={{ color: BL }}>{c.jours}j</div>
              {/* Statut */}
              <div className="flex items-center gap-1">
                <SIcon size={9} style={{ color: sc.color }} />
                <span className="text-[7.5px] font-bold" style={{ color: sc.color }}>{sc.lbl}</span>
              </div>
              {/* Actions */}
              <div className="flex gap-1.5">
                {statut === "en_attente" ? (
                  <>
                    <button onClick={() => decide(c.id, "approuvé")}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-bold transition-all"
                      style={{ background: `${EM}12`, color: EM, border: `1px solid ${EM}25` }}>
                      <CheckCircle2 size={9} /> Approuver
                    </button>
                    <button onClick={() => decide(c.id, "refusé")}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-bold transition-all"
                      style={{ background: `${RD}12`, color: RD, border: `1px solid ${RD}25` }}>
                      <XCircle size={9} /> Refuser
                    </button>
                  </>
                ) : (
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    Traité le {c.dateDepot}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <DrawerDemandeConge open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
