"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Briefcase, User, Phone, Mail, Star, ChevronRight, AlertTriangle } from "lucide-react"
import { CANDIDATURES, POSTES_OUVERTS, type EtapeRecrutement } from "./rh-mock-data"
import { DrawerNouvelleOffre } from "./DrawerNouvelleOffre"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const OR = "#F97316"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const ETAPES: { id: EtapeRecrutement; lbl: string; color: string }[] = [
  { id: "candidature",  lbl: "Candidatures",  color: BL  },
  { id: "présélection", lbl: "Présélection",   color: AM  },
  { id: "entretien",    lbl: "Entretien",      color: OR  },
  { id: "offre",        lbl: "Offre",          color: PR  },
  { id: "embauché",     lbl: "Embauché",       color: EM  },
  { id: "refusé",       lbl: "Refusé",         color: RD  },
]

export function RecrutementPage() {
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [selected, setSelected]       = useState<string | null>(null)
  const [moved, setMoved]             = useState<Record<string, EtapeRecrutement>>({})

  function getEtape(id: string, base: EtapeRecrutement): EtapeRecrutement {
    return moved[id] ?? base
  }

  function moveNext(candId: string, currentEtape: EtapeRecrutement) {
    const idx  = ETAPES.findIndex(e => e.id === currentEtape)
    const next = ETAPES[Math.min(idx + 1, ETAPES.length - 1)]
    if (next && next.id !== "refusé") setMoved(prev => ({ ...prev, [candId]: next.id }))
  }

  function reject(candId: string) {
    setMoved(prev => ({ ...prev, [candId]: "refusé" }))
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Stats + header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="grid grid-cols-3 gap-3 flex-1">
          {[
            { lbl: "Postes ouverts",    val: POSTES_OUVERTS.length,                                                   color: BL },
            { lbl: "Postes urgents",    val: POSTES_OUVERTS.filter(p => p.urgent).length,                             color: RD },
            { lbl: "Candidats actifs",  val: CANDIDATURES.filter(c => !["embauché","refusé"].includes(getEtape(c.id, c.etape))).length, color: AM },
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
        <button onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold flex-shrink-0"
          style={{ background: G, color: "#000" }}>
          <Plus size={11} /> Nouveau poste
        </button>
      </div>

      {/* Postes ouverts */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Postes ouverts</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {POSTES_OUVERTS.map((p, i) => (
            <div key={p.id} className="px-4 py-3 flex items-start gap-3"
              style={{ borderBottom: i < POSTES_OUVERTS.length - 1 ? `1px solid ${BORDER}` : "none", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <div className="rounded-xl p-2 flex-shrink-0"
                style={{ background: `${p.urgent ? RD : BL}12`, border: `1px solid ${p.urgent ? RD : BL}20` }}>
                <Briefcase size={12} style={{ color: p.urgent ? RD : BL }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="text-[10px] font-bold text-white truncate">{p.titre}</div>
                  {p.urgent && (
                    <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0"
                      style={{ background: `${RD}15`, color: RD }}>Urgent</span>
                  )}
                </div>
                <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {p.departement} · {p.typeContrat} · {p.niveau}
                </div>
                <div className="text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {p.nbCandidats} candidat{p.nbCandidats > 1 ? "s" : ""} · Ouvert le {p.dateOuverture}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban pipeline */}
      <div>
        <div className="text-[11px] font-black text-white mb-3">Pipeline des candidatures</div>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(6, minmax(160px, 1fr))", overflowX: "auto" }}>
          {ETAPES.map(etape => {
            const cands = CANDIDATURES.filter(c => getEtape(c.id, c.etape) === etape.id)
            return (
              <div key={etape.id} className="flex flex-col gap-2 min-w-[160px]">
                {/* Header colonne */}
                <div className="flex items-center justify-between px-2 py-1.5 rounded-xl"
                  style={{ background: `${etape.color}10`, border: `1px solid ${etape.color}20` }}>
                  <span className="text-[9px] font-bold" style={{ color: etape.color }}>{etape.lbl}</span>
                  <span className="text-[8px] font-black" style={{ color: etape.color }}>{cands.length}</span>
                </div>
                {/* Cards */}
                <div className="flex flex-col gap-2">
                  {cands.slice(0, 4).map(c => (
                    <motion.div key={c.id} layout
                      className="rounded-xl p-3 flex flex-col gap-2 cursor-pointer transition-all"
                      style={{ background: CARD, border: `1px solid ${selected === c.id ? etape.color + "40" : BORDER}` }}
                      onClick={() => setSelected(selected === c.id ? null : c.id)}>
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-lg flex items-center justify-center text-[8px] font-black flex-shrink-0"
                          style={{ background: `${etape.color}15`, color: etape.color }}>
                          {c.prenom[0]}{c.nom[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[9px] font-bold text-white truncate">{c.prenom} {c.nom}</div>
                          <div className="text-[7px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{c.posteTitre}</div>
                        </div>
                      </div>
                      <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{c.dateDepot}</div>
                      {c.noteEntretien && (
                        <div className="flex items-center gap-1">
                          <Star size={8} style={{ color: G }} />
                          <span className="text-[8px] font-bold" style={{ color: G }}>{c.noteEntretien}/20</span>
                        </div>
                      )}
                      {/* Actions inline */}
                      <AnimatePresence>
                        {selected === c.id && etape.id !== "embauché" && etape.id !== "refusé" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            className="flex gap-1.5 pt-1 overflow-hidden" style={{ borderTop: `1px solid ${BORDER}` }}>
                            <button onClick={e => { e.stopPropagation(); moveNext(c.id, getEtape(c.id, c.etape)) }}
                              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[7.5px] font-bold"
                              style={{ background: `${EM}12`, color: EM, border: `1px solid ${EM}20` }}>
                              <ChevronRight size={8} /> Avancer
                            </button>
                            <button onClick={e => { e.stopPropagation(); reject(c.id) }}
                              className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg text-[7.5px] font-bold"
                              style={{ background: `${RD}12`, color: RD, border: `1px solid ${RD}20` }}>
                              Refuser
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                  {cands.length > 4 && (
                    <div className="text-center text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      +{cands.length - 4} autres
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <DrawerNouvelleOffre open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
