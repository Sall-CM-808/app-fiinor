"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, Plus, ChevronDown, ChevronUp,
  CheckCircle2, Clock, XCircle, AlertTriangle, RefreshCw,
  FileText, Phone, User, Download,
} from "lucide-react"
import {
  CANDIDATS, STATS_INSCRIPTIONS,
  type Candidat, type StatutInscription, type TypeInscription,
  formatGNF,
} from "./services-mock-data"
import { DrawerNouvelleInscription } from "./DrawerNouvelleInscription"
import { SelectCustom } from "./SelectCustom"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const OR = "#F97316"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const STATUT_CFG: Record<StatutInscription, { lbl: string; color: string; icon: React.ElementType }> = {
  validé:      { lbl: "Validé",      color: EM, icon: CheckCircle2 },
  en_attente:  { lbl: "En attente",  color: AM, icon: Clock },
  refusé:      { lbl: "Refusé",      color: RD, icon: XCircle },
  en_révision: { lbl: "En révision", color: BL, icon: RefreshCw },
  incomplet:   { lbl: "Incomplet",   color: OR, icon: AlertTriangle },
}

const TYPE_CFG: Record<TypeInscription, { lbl: string; color: string }> = {
  nouvelle:      { lbl: "Nouvelle",      color: EM },
  réinscription: { lbl: "Réinscription", color: BL },
  transfert:     { lbl: "Transfert",     color: OR },
}

export function InscriptionsPage() {
  const [search, setSearch]     = useState("")
  const [filterStatut, setFilterStatut] = useState<StatutInscription | "all">("all")
  const [filterType, setFilterType]     = useState<TypeInscription | "all">("all")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = CANDIDATS.filter(c => {
    const matchSearch = `${c.nom} ${c.prenom} ${c.matricule} ${c.filiere}`.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === "all" || c.statut === filterStatut
    const matchType   = filterType   === "all" || c.type   === filterType
    return matchSearch && matchStatut && matchType
  })

  return (
    <div className="flex flex-col gap-4">

      {/* ── Stats bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-5 gap-2">
        {[
          { lbl: "Total",      val: STATS_INSCRIPTIONS.total,      color: "rgba(255,255,255,0.6)" },
          { lbl: "Validés",    val: STATS_INSCRIPTIONS.validés,    color: EM },
          { lbl: "En attente", val: STATS_INSCRIPTIONS.enAttente,  color: AM },
          { lbl: "En révision",val: STATS_INSCRIPTIONS.enRévision, color: BL },
          { lbl: "Refusés",    val: STATS_INSCRIPTIONS.refusés,    color: RD },
        ].map(s => (
          <div key={s.lbl} className="rounded-xl p-3 text-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[18px] font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.lbl}</div>
          </div>
        ))}
      </motion.div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[180px] flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher nom, matricule, filière…"
            className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
        </div>

        <div style={{ minWidth: 148 }}>
          <SelectCustom
            value={filterStatut}
            onChange={v => setFilterStatut(v as StatutInscription | "all")}
            options={[{ value: "all", label: "Tous statuts" }, ...(Object.keys(STATUT_CFG) as StatutInscription[]).map(s => ({ value: s, label: STATUT_CFG[s].lbl }))]}
          />
        </div>
        <div style={{ minWidth: 148 }}>
          <SelectCustom
            value={filterType}
            onChange={v => setFilterType(v as TypeInscription | "all")}
            options={[{ value: "all", label: "Tous types" }, ...(Object.keys(TYPE_CFG) as TypeInscription[]).map(t => ({ value: t, label: TYPE_CFG[t].lbl }))]}
          />
        </div>

        <button onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold transition-all"
          style={{ background: G, color: "#000" }}>
          <Plus size={11} /> Nouvelle inscription
        </button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        {/* Head */}
        <div className="grid px-4 py-2.5"
          style={{
            gridTemplateColumns: "2fr 1.2fr 1.5fr 1fr 0.9fr 0.9fr 0.8fr",
            background: "rgba(0,0,0,0.25)",
            borderBottom: `1px solid ${BORDER}`,
          }}>
          {["Candidat","Matricule","Filière / Niveau","Type","Frais","Date dépôt","Statut"].map(h => (
            <div key={h} className="text-[8px] font-bold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="px-4 py-10 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Aucun dossier ne correspond à la recherche
          </div>
        )}

        {filtered.map((c, i) => {
          const sc  = STATUT_CFG[c.statut]
          const tc  = TYPE_CFG[c.type]
          const SIcon = sc.icon
          const isOpen = expanded === c.id

          return (
            <div key={c.id}>
              <button
                onClick={() => setExpanded(isOpen ? null : c.id)}
                className="w-full grid px-4 py-3 transition-colors text-left"
                style={{
                  gridTemplateColumns: "2fr 1.2fr 1.5fr 1fr 0.9fr 0.9fr 0.8fr",
                  borderBottom: `1px solid ${BORDER}`,
                  background: isOpen ? "rgba(201,168,76,0.04)" : i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                {/* Candidat */}
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg flex items-center justify-center font-black text-[9px] flex-shrink-0"
                    style={{ background: `${G}15`, color: G }}>
                    {c.prenom[0]}{c.nom[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white truncate">{c.prenom} {c.nom}</div>
                    <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{c.lieuNaissance}</div>
                  </div>
                </div>
                {/* Matricule */}
                <div className="flex items-center">
                  <span className="text-[8.5px] font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>{c.matricule}</span>
                </div>
                {/* Filière */}
                <div className="flex items-center">
                  <div className="min-w-0">
                    <div className="text-[9px] font-bold text-white truncate">{c.filiere}</div>
                    <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{c.niveau}</div>
                  </div>
                </div>
                {/* Type */}
                <div className="flex items-center">
                  <span className="px-1.5 py-0.5 rounded-full text-[7px] font-bold"
                    style={{ background: `${tc.color}12`, color: tc.color, border: `1px solid ${tc.color}20` }}>
                    {tc.lbl}
                  </span>
                </div>
                {/* Frais */}
                <div className="flex items-center">
                  <span className={`text-[8.5px] font-bold ${c.fraisPayés ? "" : "opacity-60"}`}
                    style={{ color: c.fraisPayés ? EM : RD }}>
                    {c.fraisPayés ? "Payés" : "Non payés"}
                  </span>
                </div>
                {/* Date */}
                <div className="flex items-center">
                  <span className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>{c.dateDepot}</span>
                </div>
                {/* Statut */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: `${sc.color}12`, border: `1px solid ${sc.color}20` }}>
                    <SIcon size={8} style={{ color: sc.color }} />
                    <span className="text-[7px] font-bold" style={{ color: sc.color }}>{sc.lbl}</span>
                  </div>
                  {isOpen ? <ChevronUp size={11} style={{ color: G }} /> : <ChevronDown size={11} style={{ color: "rgba(255,255,255,0.2)" }} />}
                </div>
              </button>

              {/* ── Expanded detail ── */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                    style={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(201,168,76,0.02)" }}>
                    <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">

                      {/* Infos personnelles */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Informations</div>
                        <div className="flex items-center gap-1.5">
                          <User size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="text-[9px] text-white">{c.responsable}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>{c.contact}</span>
                        </div>
                        {c.moyenne !== null && (
                          <div className="text-[9px]" style={{ color: EM }}>
                            Moyenne : <strong>{c.moyenne}/20</strong>
                          </div>
                        )}
                      </div>

                      {/* Pièces */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Pièces fournies</div>
                        {c.piecesFournies.map(p => (
                          <div key={p} className="flex items-center gap-1.5">
                            <CheckCircle2 size={9} style={{ color: EM }} />
                            <span className="text-[8.5px] text-white">{p}</span>
                          </div>
                        ))}
                        {c.pieceManquante && (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle size={9} style={{ color: OR }} />
                            <span className="text-[8.5px]" style={{ color: OR }}>{c.pieceManquante}</span>
                          </div>
                        )}
                      </div>

                      {/* Frais */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Frais d'inscription</div>
                        <div className="text-[14px] font-black" style={{ color: c.fraisPayés ? EM : RD }}>
                          {formatGNF(c.fraisInscription)}
                        </div>
                        <div className="text-[8px]" style={{ color: c.fraisPayés ? EM : RD }}>
                          {c.fraisPayés ? "Paiement reçu" : "En attente de paiement"}
                        </div>
                        {c.dateTraitement && (
                          <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                            Traité le : {c.dateTraitement}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Actions</div>
                        {c.commentaire && (
                          <div className="text-[8px] p-2 rounded-lg" style={{ background: `${AM}10`, color: AM, border: `1px solid ${AM}20` }}>
                            {c.commentaire}
                          </div>
                        )}
                        <div className="flex gap-1.5 flex-wrap">
                          {c.statut === "en_attente" && (
                            <>
                              <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[8px] font-bold transition-all"
                                style={{ background: `${EM}12`, color: EM, border: `1px solid ${EM}20` }}>
                                <CheckCircle2 size={9} /> Valider
                              </button>
                              <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[8px] font-bold transition-all"
                                style={{ background: `${RD}10`, color: RD, border: `1px solid ${RD}20` }}>
                                <XCircle size={9} /> Refuser
                              </button>
                            </>
                          )}
                          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[8px] font-bold transition-all"
                            style={{ background: `${G}10`, color: G, border: `1px solid ${G}20` }}>
                            <FileText size={9} /> Dossier
                          </button>
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

      <DrawerNouvelleInscription open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
