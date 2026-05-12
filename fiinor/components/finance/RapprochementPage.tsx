"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, Clock, AlertTriangle, Link2, Search } from "lucide-react"
import { LIGNES_RAPPROCHEMENT, formatGNF, type LigneRapprochement, type StatutRapprochement } from "./finance-mock-data"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const SB = "#07111d"
const MU = "rgba(255,255,255,0.08)"

const STATUT_CFG: Record<StatutRapprochement, { label: string; color: string; icon: React.ElementType }> = {
  rapproché:   { label: "Rapproché",   color: EM, icon: CheckCircle2 },
  en_attente:  { label: "En attente",  color: AM, icon: Clock },
  écart:       { label: "Écart",       color: RD, icon: AlertTriangle },
}

/* ─── Row ─── */
function RapRow({ ligne, index }: { ligne: LigneRapprochement; index: number }) {
  const cfg = STATUT_CFG[ligne.statut]
  const SIcon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, type: "spring", stiffness: 400, damping: 30 }}
      className="grid items-center px-4 py-3"
      style={{
        gridTemplateColumns: "80px 1fr 100px 110px 90px 90px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.018)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

      {/* Date */}
      <span className="text-[8.5px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
        {new Date(ligne.date).toLocaleDateString("fr-FR")}
      </span>

      {/* Libellé */}
      <div className="truncate">
        <div className="text-[9.5px] font-medium text-white truncate">{ligne.libelle}</div>
        {ligne.transactionId && (
          <div className="flex items-center gap-1 mt-0.5">
            <Link2 size={8} style={{ color: "rgba(255,255,255,0.2)" }} />
            <span className="text-[7px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
              {ligne.transactionId}
            </span>
          </div>
        )}
      </div>

      {/* Montant relevé */}
      <div className="text-right">
        <div className="text-[9px] tabular-nums font-bold" style={{ color: "rgba(255,255,255,0.65)" }}>
          {formatGNF(ligne.montantReleve)}
        </div>
        <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>relevé</div>
      </div>

      {/* Montant Fiinor */}
      <div className="text-right">
        {ligne.montantFiinor !== null ? (
          <>
            <div className="text-[9px] tabular-nums font-bold" style={{ color: G }}>
              {formatGNF(ligne.montantFiinor)}
            </div>
            <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>Fiinor</div>
          </>
        ) : (
          <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
        )}
      </div>

      {/* Écart */}
      <div className="text-right">
        {ligne.ecart !== 0 ? (
          <span className="text-[9px] font-bold tabular-nums" style={{ color: ligne.ecart > 0 ? EM : RD }}>
            {ligne.ecart > 0 ? "+" : ""}{formatGNF(ligne.ecart)}
          </span>
        ) : (
          <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
        )}
      </div>

      {/* Statut */}
      <div className="flex justify-end">
        <div className="flex items-center gap-1 rounded-lg px-2 py-1"
          style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}25` }}>
          <SIcon size={9} style={{ color: cfg.color }} />
          <span className="text-[7.5px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main ─── */
export function RapprochementPage() {
  const [search, setSearch] = useState("")
  const [filterStatut, setFilterStatut] = useState<StatutRapprochement | "">("")

  const filtered = useMemo(() =>
    LIGNES_RAPPROCHEMENT.filter(l => {
      const q = search.toLowerCase()
      const matchQ = !q || l.libelle.toLowerCase().includes(q)
      const matchS = !filterStatut || l.statut === filterStatut
      return matchQ && matchS
    }), [search, filterStatut])

  const stats = useMemo(() => ({
    rapproches:  LIGNES_RAPPROCHEMENT.filter(l => l.statut === "rapproché").length,
    enAttente:   LIGNES_RAPPROCHEMENT.filter(l => l.statut === "en_attente").length,
    ecarts:      LIGNES_RAPPROCHEMENT.filter(l => l.statut === "écart").length,
    montantEcart: LIGNES_RAPPROCHEMENT
      .filter(l => l.statut === "écart")
      .reduce((s, l) => s + Math.abs(l.ecart), 0),
  }), [])

  const FILTRES: { key: StatutRapprochement | ""; label: string; count: number; color: string }[] = [
    { key: "",           label: "Toutes",      count: LIGNES_RAPPROCHEMENT.length, color: "rgba(255,255,255,0.5)" },
    { key: "rapproché",  label: "Rapprochées", count: stats.rapproches,            color: EM },
    { key: "en_attente", label: "En attente",  count: stats.enAttente,             color: AM },
    { key: "écart",      label: "Écarts",      count: stats.ecarts,                color: RD },
  ]

  const tauxRapprochement = Math.round((stats.rapproches / LIGNES_RAPPROCHEMENT.length) * 100)

  return (
    <div className="flex flex-col gap-4">

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Taux rapprochement", value: `${tauxRapprochement}%`,        color: tauxRapprochement >= 80 ? EM : AM },
          { label: "Lignes rapprochées", value: String(stats.rapproches),       color: EM },
          { label: "En attente",          value: String(stats.enAttente),        color: AM },
          { label: "Montant écarts",      value: formatGNF(stats.montantEcart), color: RD },
        ].map((k, i) => (
          <motion.div key={k.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 30 }}
            className="rounded-2xl px-4 py-3"
            style={{ background: SB, border: `1px solid ${MU}` }}>
            <div className="text-[18px] font-black tabular-nums" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[8px] mt-0.5 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>{k.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Barre de progression rapprochement */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl px-5 py-4"
        style={{ background: SB, border: `1px solid ${MU}` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-white">Avancement du rapprochement</span>
          <span className="text-[10px] font-black" style={{ color: EM }}>{tauxRapprochement}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${tauxRapprochement}%` }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${EM}, ${G})` }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {stats.rapproches} lignes rapprochées
          </span>
          <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {LIGNES_RAPPROCHEMENT.length} total
          </span>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3" style={{ color: "rgba(255,255,255,0.25)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une opération…"
            className="w-full rounded-xl pl-8 pr-3 py-2 text-[10px] outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }} />
        </div>
        <div className="flex gap-1.5" style={{ scrollbarWidth: "none" }}>
          {FILTRES.map(f => (
            <button key={String(f.key)} onClick={() => setFilterStatut(f.key)}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all"
              style={filterStatut === f.key
                ? { background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }
                : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {f.label}
              <span className="rounded px-1 text-[7px]"
                style={{ background: "rgba(255,255,255,0.06)" }}>{f.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${MU}` }}>
        <div className="grid px-4 py-2.5"
          style={{
            gridTemplateColumns: "80px 1fr 100px 110px 90px 90px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
          {["Date","Opération","Montant relevé","Montant Fiinor","Écart","Statut"].map(h => (
            <span key={h} className="text-[7.5px] font-black uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.2)" }}>{h}</span>
          ))}
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "55vh" }}>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              Aucune opération trouvée
            </div>
          ) : filtered.map((l, i) => (
            <RapRow key={l.id} ligne={l} index={i} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
