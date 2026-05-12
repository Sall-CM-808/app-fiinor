"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, ChevronDown, ChevronUp, CheckCircle2, Clock, Target } from "lucide-react"
import { EVALUATIONS_RH, type StatutEval, type Departement } from "./rh-mock-data"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const DEPARTEMENTS: Departement[] = ["Informatique","Droit","Médecine","Sciences Éco","Administration","Génie Civil","Pharmacie"]

function ScoreBar({ val, max = 20, color }: { val: number; max?: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${(val / max) * 100}%`, background: color }} />
      </div>
      <span className="text-[8px] font-bold w-6 text-right" style={{ color }}>{val}</span>
    </div>
  )
}

export function EvaluationsPage() {
  const [search, setSearch]             = useState("")
  const [filterDept, setFilterDept]     = useState<Departement | "all">("all")
  const [filterStatut, setFilterStatut] = useState<StatutEval | "all">("all")
  const [expanded, setExpanded]         = useState<string | null>(null)

  const filtered = EVALUATIONS_RH.filter(e => {
    const match = e.employeNom.toLowerCase().includes(search.toLowerCase())
    return match
      && (filterDept   === "all" || e.departement === filterDept)
      && (filterStatut === "all" || e.statut      === filterStatut)
  })

  const moyPerf = filtered.length
    ? Math.round(filtered.reduce((s, e) => s + e.notePerformance, 0) / filtered.length * 10) / 10
    : 0
  const moyComp = filtered.length
    ? Math.round(filtered.reduce((s, e) => s + e.noteCompetences, 0) / filtered.length * 10) / 10
    : 0

  return (
    <div className="flex flex-col gap-4">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Évaluations totales",  val: EVALUATIONS_RH.length,                                     color: BL },
          { lbl: "Finalisées",           val: EVALUATIONS_RH.filter(e => e.statut === "finalisé").length, color: EM },
          { lbl: "Moy. performance",     val: `${moyPerf}/20`,                                            color: G  },
          { lbl: "Moy. compétences",     val: `${moyComp}/20`,                                            color: PR },
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

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[160px] flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Nom de l'employé…"
            className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
        </div>
        <div style={{ minWidth: 160 }}>
          <SelectCustom value={filterDept} onChange={v => setFilterDept(v as Departement | "all")}
            options={[{ value: "all", label: "Tous départements" }, ...DEPARTEMENTS.map(d => ({ value: d, label: d }))]} />
        </div>
        <div style={{ minWidth: 140 }}>
          <SelectCustom value={filterStatut} onChange={v => setFilterStatut(v as StatutEval | "all")}
            options={[
              { value: "all",       label: "Tous statuts"  },
              { value: "finalisé",  label: "Finalisé"      },
              { value: "brouillon", label: "Brouillon"     },
            ]} />
        </div>
      </div>

      {/* Table avec expandable */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="grid px-4 py-2.5"
          style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 0.9fr", background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${BORDER}` }}>
          {["Employé","Département","Performance","Compétences","Objectifs","Statut"].map(h => (
            <div key={h} className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Aucune évaluation ne correspond
          </div>
        )}

        {filtered.map((ev, i) => {
          const isOpen    = expanded === ev.id
          const objPct    = Math.round((ev.objectifsAtteints / ev.objectifsTotal) * 100)
          const noteGlobal = Math.round((ev.notePerformance + ev.noteCompetences + ev.notePonctualite) / 3 * 10) / 10
          return (
            <div key={ev.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : ev.id)}
                className="w-full grid px-4 py-3 items-center text-left transition-colors"
                style={{
                  gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1fr 0.9fr",
                  borderBottom: `1px solid ${BORDER}`,
                  background: isOpen ? "rgba(201,168,76,0.03)" : i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                {/* Employé */}
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg flex items-center justify-center font-black text-[9px] flex-shrink-0"
                    style={{ background: `${G}15`, color: G }}>
                    {ev.employeNom.split(" ").map(n => n[0]).slice(0,2).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-bold text-white truncate">{ev.employeNom}</div>
                    <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Année {ev.annee}</div>
                  </div>
                </div>
                {/* Département */}
                <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{ev.departement}</div>
                {/* Performance */}
                <div className="flex items-center gap-1">
                  <Star size={9} style={{ color: G }} />
                  <span className="text-[9px] font-bold" style={{ color: G }}>{ev.notePerformance}/20</span>
                </div>
                {/* Compétences */}
                <div className="text-[9px] font-bold" style={{ color: BL }}>{ev.noteCompetences}/20</div>
                {/* Objectifs */}
                <div className="flex items-center gap-1">
                  <Target size={9} style={{ color: objPct >= 80 ? EM : AM }} />
                  <span className="text-[9px] font-bold" style={{ color: objPct >= 80 ? EM : AM }}>
                    {ev.objectifsAtteints}/{ev.objectifsTotal}
                  </span>
                </div>
                {/* Statut + chevron */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {ev.statut === "finalisé"
                      ? <CheckCircle2 size={9} style={{ color: EM }} />
                      : <Clock size={9} style={{ color: AM }} />}
                    <span className="text-[7.5px] font-bold capitalize"
                      style={{ color: ev.statut === "finalisé" ? EM : AM }}>
                      {ev.statut}
                    </span>
                  </div>
                  {isOpen
                    ? <ChevronUp size={11} style={{ color: G }} />
                    : <ChevronDown size={11} style={{ color: "rgba(255,255,255,0.2)" }} />}
                </div>
              </button>

              {/* Détail expandable */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                    style={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(201,168,76,0.015)" }}>
                    <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-3 gap-5">

                      {/* Scores détaillés */}
                      <div className="flex flex-col gap-3">
                        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                          Scores détaillés
                        </div>
                        <div className="flex flex-col gap-2">
                          <div>
                            <div className="text-[8px] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Performance</div>
                            <ScoreBar val={ev.notePerformance} color={G} />
                          </div>
                          <div>
                            <div className="text-[8px] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Compétences</div>
                            <ScoreBar val={ev.noteCompetences} color={BL} />
                          </div>
                          <div>
                            <div className="text-[8px] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>Ponctualité</div>
                            <ScoreBar val={ev.notePonctualite} color={PR} />
                          </div>
                          <div className="pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Note globale</div>
                            <div className="text-[14px] font-black" style={{ color: G }}>{noteGlobal}/20</div>
                          </div>
                        </div>
                      </div>

                      {/* Objectifs */}
                      <div className="flex flex-col gap-3">
                        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                          Objectifs {ev.annee}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <div className="text-[22px] font-black" style={{ color: objPct >= 80 ? EM : AM }}>
                              {objPct}%
                            </div>
                            <div>
                              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>taux d'atteinte</div>
                              <div className="text-[8px] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                                {ev.objectifsAtteints}/{ev.objectifsTotal} objectifs
                              </div>
                            </div>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                            <div className="h-full rounded-full" style={{ width: `${objPct}%`, background: objPct >= 80 ? EM : AM }} />
                          </div>
                        </div>
                      </div>

                      {/* Commentaire + évaluateur */}
                      <div className="flex flex-col gap-3">
                        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                          Commentaire
                        </div>
                        <div className="text-[9px] text-white leading-relaxed">{ev.commentaire}</div>
                        <div className="text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                          — {ev.evaluateur}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
