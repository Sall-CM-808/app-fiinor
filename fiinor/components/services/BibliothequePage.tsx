"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, BookOpen, AlertTriangle, CheckCircle2,
  Clock, ChevronDown, ChevronUp, Plus, RefreshCw,
} from "lucide-react"
import {
  LIVRES, EMPRUNTS, type Livre, type Emprunt, type StatutEmprunt,
  formatGNF,
} from "./services-mock-data"
import { DrawerEmpruntLivre } from "./DrawerEmpruntLivre"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const OR = "#F97316"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const STATUT_CFG: Record<StatutEmprunt, { lbl: string; color: string; icon: React.ElementType }> = {
  en_cours:  { lbl: "En cours",  color: BL, icon: Clock },
  retourné:  { lbl: "Retourné",  color: EM, icon: CheckCircle2 },
  en_retard: { lbl: "En retard", color: RD, icon: AlertTriangle },
  perdu:     { lbl: "Perdu",     color: OR, icon: AlertTriangle },
}

type ViewMode = "catalogue" | "emprunts"

export function BibliothequePage() {
  const [view, setView]       = useState<ViewMode>("catalogue")
  const [search, setSearch]   = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filteredLivres  = LIVRES.filter(l =>
    `${l.titre} ${l.auteur} ${l.categorie}`.toLowerCase().includes(search.toLowerCase())
  )
  const filteredEmprunts = EMPRUNTS.filter(e =>
    `${e.eleveNom} ${e.eleveMatricule} ${e.livreTitre}`.toLowerCase().includes(search.toLowerCase())
  )

  const retards = EMPRUNTS.filter(e => e.statut === "en_retard").length
  const enCours = EMPRUNTS.filter(e => e.statut === "en_cours").length
  const totalDispo = LIVRES.reduce((s, l) => s + l.disponibles, 0)
  const totalAmendes = EMPRUNTS.reduce((s, e) => s + e.amende, 0)

  return (
    <div className="flex flex-col gap-4">

      {/* ── Stats ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Livres disponibles", val: String(totalDispo), color: EM },
          { lbl: "Emprunts en cours",  val: String(enCours),    color: BL },
          { lbl: "Retards",            val: String(retards),    color: RD },
          { lbl: "Amendes cumulées",   val: formatGNF(totalAmendes), color: OR },
        ].map((s, i) => (
          <motion.div key={s.lbl}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-3 text-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[16px] font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2">
        {/* View toggle */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          {(["catalogue","emprunts"] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-2 text-[9.5px] font-bold transition-all capitalize"
              style={{
                background: view === v ? `${G}15` : "transparent",
                color: view === v ? G : "rgba(255,255,255,0.35)",
                borderRight: v === "catalogue" ? `1px solid ${BORDER}` : "none",
              }}>
              {v === "catalogue" ? "Catalogue" : "Emprunts"}
            </button>
          ))}
        </div>

        <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={view === "catalogue" ? "Titre, auteur, catégorie…" : "Élève, matricule, titre…"}
            className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
        </div>

        <button onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
          style={{ background: G, color: "#000" }}>
          <Plus size={11} /> Nouvel emprunt
        </button>
      </div>

      {/* ── Catalogue ── */}
      {view === "catalogue" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredLivres.map((l, i) => (
            <motion.div key={l.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl p-4 flex gap-4"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              {/* Couverture simulée */}
              <div className="w-12 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-[9px] text-center leading-tight"
                style={{
                  background: `${[G, EM, BL, OR, RD][i % 5]}15`,
                  border: `1px solid ${[G, EM, BL, OR, RD][i % 5]}25`,
                  color: [G, EM, BL, OR, RD][i % 5],
                  minHeight: 64,
                }}>
                {l.cote}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black text-white truncate">{l.titre}</div>
                <div className="text-[8.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{l.auteur} · {l.editeur} · {l.annee}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[7.5px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${BL}12`, color: BL, border: `1px solid ${BL}20` }}>
                    {l.categorie}
                  </span>
                  <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {l.exemplaires} ex. · {l.empruntsTotal} emprunts
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${(l.disponibles / l.exemplaires) * 100}%`,
                      background: l.disponibles > 0 ? EM : RD,
                    }} />
                  </div>
                  <span className="text-[8px] font-bold" style={{ color: l.disponibles > 0 ? EM : RD }}>
                    {l.disponibles > 0 ? `${l.disponibles} dispo.` : "Indisponible"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Emprunts ── */}
      {view === "emprunts" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="grid px-4 py-2.5"
            style={{
              gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 0.8fr",
              background: "rgba(0,0,0,0.25)",
              borderBottom: `1px solid ${BORDER}`,
            }}>
            {["Livre","Élève","Dates","Retard","Amende","Statut"].map(h => (
              <div key={h} className="text-[8px] font-bold uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
            ))}
          </div>

          {filteredEmprunts.map((e, i) => {
            const sc = STATUT_CFG[e.statut]
            const SIcon = sc.icon
            return (
              <div key={e.id} className="grid px-4 py-3 items-center"
                style={{
                  gridTemplateColumns: "2fr 1.5fr 1.5fr 1fr 1fr 0.8fr",
                  borderBottom: i < filteredEmprunts.length - 1 ? `1px solid ${BORDER}` : "none",
                  background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                <div className="min-w-0">
                  <div className="text-[9.5px] font-bold text-white truncate">{e.livreTitre}</div>
                  <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{e.livreAuteur}</div>
                </div>
                <div>
                  <div className="text-[9px] text-white">{e.eleveNom}</div>
                  <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{e.eleveMatricule}</div>
                </div>
                <div>
                  <div className="text-[8.5px] text-white">Emprunté : {e.dateEmprunt}</div>
                  <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Prévu : {e.dateRetourPrevue}</div>
                </div>
                <div>
                  {e.retardJours > 0
                    ? <span className="text-[9px] font-bold" style={{ color: RD }}>+{e.retardJours}j</span>
                    : <span className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}
                </div>
                <div>
                  {e.amende > 0
                    ? <span className="text-[9px] font-bold" style={{ color: OR }}>{formatGNF(e.amende)}</span>
                    : <span className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>—</span>}
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                  style={{ background: `${sc.color}12`, border: `1px solid ${sc.color}20`, width: "fit-content" }}>
                  <SIcon size={8} style={{ color: sc.color }} />
                  <span className="text-[7px] font-bold" style={{ color: sc.color }}>{sc.lbl}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <DrawerEmpruntLivre open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
