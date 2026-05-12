"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, ChevronDown, ChevronUp,
  Mail, Phone, CalendarDays, User, Briefcase, Tag,
} from "lucide-react"
import { EMPLOYES, type StatutEmploye, type Departement, formatGNF } from "./rh-mock-data"
import { SelectCustom } from "../services/SelectCustom"
import { DrawerNouvelEmploye } from "./DrawerNouvelEmploye"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const STATUT_CFG: Record<StatutEmploye, { lbl: string; color: string }> = {
  actif:     { lbl: "Actif",     color: EM },
  suspendu:  { lbl: "Suspendu",  color: AM },
  parti:     { lbl: "Parti",     color: RD },
}

const DEPT_COLORS: Record<Departement, string> = {
  "Informatique":  BL,
  "Droit":         G,
  "Médecine":      EM,
  "Sciences Éco":  AM,
  "Administration":PR,
  "Génie Civil":   "#F97316",
  "Pharmacie":     RD,
}

const DEPARTEMENTS: Departement[] = ["Informatique","Droit","Médecine","Sciences Éco","Administration","Génie Civil","Pharmacie"]

export function PersonnelPage() {
  const [search, setSearch]           = useState("")
  const [filterDept, setFilterDept]   = useState<Departement | "all">("all")
  const [filterStatut, setFilterStatut] = useState<StatutEmploye | "all">("all")
  const [expanded, setExpanded]       = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen]   = useState(false)

  const filtered = EMPLOYES.filter(e => {
    const match = `${e.prenom} ${e.nom} ${e.matricule} ${e.poste}`.toLowerCase().includes(search.toLowerCase())
    const matchDept   = filterDept   === "all" || e.departement === filterDept
    const matchStatut = filterStatut === "all" || e.statut      === filterStatut
    return match && matchDept && matchStatut
  })

  const actifs = EMPLOYES.filter(e => e.statut === "actif").length

  return (
    <div className="flex flex-col gap-4">

      {/* Stats rapides */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Actifs",    val: EMPLOYES.filter(e => e.statut === "actif").length,    color: EM },
          { lbl: "Suspendus", val: EMPLOYES.filter(e => e.statut === "suspendu").length, color: AM },
          { lbl: "Partis",    val: EMPLOYES.filter(e => e.statut === "parti").length,    color: RD },
          { lbl: "Rôles multiples", val: EMPLOYES.filter(e => e.roles.length > 1).length, color: PR },
        ].map((s, i) => (
          <motion.div key={s.lbl}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-3 text-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[18px] font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[180px] flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Nom, matricule, poste…"
            className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
        </div>
        <div style={{ minWidth: 160 }}>
          <SelectCustom value={filterDept} onChange={v => setFilterDept(v as Departement | "all")}
            options={[{ value: "all", label: "Tous départements" }, ...DEPARTEMENTS.map(d => ({ value: d, label: d }))]} />
        </div>
        <div style={{ minWidth: 140 }}>
          <SelectCustom value={filterStatut} onChange={v => setFilterStatut(v as StatutEmploye | "all")}
            options={[{ value: "all", label: "Tous statuts" }, ...Object.entries(STATUT_CFG).map(([k, v]) => ({ value: k, label: v.lbl }))]} />
        </div>
        <button onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
          style={{ background: G, color: "#000" }}>
          <Plus size={11} /> Nouvel employé
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="grid px-4 py-2.5"
          style={{
            gridTemplateColumns: "2.2fr 1.4fr 1.6fr 1.2fr 1fr 0.9fr",
            background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${BORDER}`,
          }}>
          {["Employé","Matricule","Poste","Département","Rôles","Statut"].map(h => (
            <div key={h} className="text-[8px] font-bold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Aucun employé ne correspond aux filtres
          </div>
        )}

        {filtered.map((e, i) => {
          const sc    = STATUT_CFG[e.statut]
          const dc    = DEPT_COLORS[e.departement]
          const isOpen = expanded === e.id
          return (
            <div key={e.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : e.id)}
                className="w-full grid px-4 py-3 items-center text-left transition-colors"
                style={{
                  gridTemplateColumns: "2.2fr 1.4fr 1.6fr 1.2fr 1fr 0.9fr",
                  borderBottom: `1px solid ${BORDER}`,
                  background: isOpen ? "rgba(201,168,76,0.03)" : i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                {/* Employé */}
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl flex items-center justify-center font-black text-[10px] flex-shrink-0"
                    style={{ background: `${dc}15`, color: dc }}>
                    {e.prenom[0]}{e.nom[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white truncate">{e.prenom} {e.nom}</div>
                    <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{e.genre === "M" ? "M." : "Mme"}</div>
                  </div>
                </div>
                {/* Matricule */}
                <div className="text-[8.5px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{e.matricule}</div>
                {/* Poste */}
                <div className="text-[8.5px] text-white truncate pr-2">{e.poste}</div>
                {/* Département */}
                <div>
                  <span className="text-[7.5px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${dc}12`, color: dc, border: `1px solid ${dc}20` }}>
                    {e.departement}
                  </span>
                </div>
                {/* Rôles */}
                <div className="flex gap-1 flex-wrap">
                  {e.roles.map(r => (
                    <span key={r} className="text-[7px] px-1.5 py-0.5 rounded-full"
                      style={{ background: `${G}10`, color: G, border: `1px solid ${G}20` }}>{r}</span>
                  ))}
                </div>
                {/* Statut + chevron */}
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}20` }}>
                    {sc.lbl}
                  </span>
                  {isOpen
                    ? <ChevronUp size={11} style={{ color: G }} />
                    : <ChevronDown size={11} style={{ color: "rgba(255,255,255,0.2)" }} />}
                </div>
              </button>

              {/* Fiche expandable */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                    style={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(201,168,76,0.015)" }}>
                    <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-5">

                      {/* Identité */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.25)" }}>
                          <User size={8} /> Identité
                        </div>
                        <div className="text-[10px] font-black text-white">{e.prenom} {e.nom}</div>
                        <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>{e.matricule}</div>
                        <div className="flex items-center gap-1.5">
                          <Mail size={9} style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="text-[8px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{e.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={9} style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{e.telephone}</span>
                        </div>
                      </div>

                      {/* Poste */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.25)" }}>
                          <Briefcase size={8} /> Poste
                        </div>
                        <div className="text-[9px] font-bold text-white">{e.poste}</div>
                        <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{e.departement}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <CalendarDays size={9} style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                            Embauché le {e.dateEmbauche}
                          </span>
                        </div>
                      </div>

                      {/* Rôles */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.25)" }}>
                          <Tag size={8} /> Rôles & Fonctions
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {e.roles.map(r => (
                            <span key={r} className="text-[8px] px-2 py-1 rounded-lg font-bold"
                              style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>{r}</span>
                          ))}
                        </div>
                        <div className="text-[7.5px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                          Concept Element + ElementRole — 1 fiche, {e.roles.length} rôle{e.roles.length > 1 ? "s" : ""}
                        </div>
                      </div>

                      {/* Finance */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider"
                          style={{ color: "rgba(255,255,255,0.25)" }}>Rémunération</div>
                        <div className="text-[13px] font-black" style={{ color: G }}>{formatGNF(e.salaireBrut)}</div>
                        <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>Salaire brut mensuel</div>
                        <div className="text-[9px] font-bold mt-1" style={{ color: EM }}>{formatGNF(Math.round(e.salaireBrut * 0.82))}</div>
                        <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Net estimé (−18%)</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <DrawerNouvelEmploye open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
