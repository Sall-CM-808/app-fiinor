"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, ChevronDown, ChevronUp, CheckCircle2,
  AlertTriangle, XCircle, Clock, Smartphone,
  Banknote, CreditCard, FileText, Check,
  Wallet, Eye, CreditCard as PayIcon, Download,
} from "lucide-react"
import {
  ELEVES_ECHEANCIER, formatGNF,
  type EleveEcheancier, type StatutPaiement, type MoyenPaiement, type Echeance,
} from "./finance-mock-data"
import { DrawerPaiement } from "./DrawerPaiement"
import { FicheEtudiantModal } from "./FicheEtudiantModal"
import { DrawerExportRapports } from "./DrawerExportRapports"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const SB = "#07111d"
const MU = "rgba(255,255,255,0.08)"

/* ─── Statut config ─── */
const STATUT_CFG: Record<StatutPaiement, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  payé:      { label: "Payé",      color: EM, bg: `${EM}12`, icon: CheckCircle2 },
  partiel:   { label: "Partiel",   color: AM, bg: `${AM}12`, icon: Clock },
  en_retard: { label: "En retard", color: RD, bg: `${RD}12`, icon: AlertTriangle },
  non_payé:  { label: "Non payé",  color: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.05)", icon: XCircle },
}

/* ─── Moyen config ─── */
const MOYEN_CFG: Record<MoyenPaiement, { label: string; color: string; icon: React.ElementType }> = {
  espèces:      { label: "Espèces",      color: G,        icon: Banknote },
  virement:     { label: "Virement",     color: "#6366f1", icon: CreditCard },
  orange_money: { label: "Orange Money", color: "#f97316", icon: Smartphone },
  wave:         { label: "Wave",         color: "#06b6d4", icon: Wallet },
  chèque:       { label: "Chèque",       color: "rgba(255,255,255,0.4)", icon: FileText },
}

/* ─── StatutBadge ─── */
function StatutBadge({ statut, small = false }: { statut: StatutPaiement; small?: boolean }) {
  const cfg = STATUT_CFG[statut]
  const Icon = cfg.icon
  return (
    <div className={`flex items-center gap-1 rounded-lg ${small ? "px-1.5 py-0.5" : "px-2 py-1"} flex-shrink-0`}
      style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
      <Icon size={small ? 9 : 11} style={{ color: cfg.color }} />
      <span className={`font-bold ${small ? "text-[7.5px]" : "text-[9px]"}`}
        style={{ color: cfg.color }}>{cfg.label}</span>
    </div>
  )
}

/* ─── Barre progression ─── */
function ProgressBar({ paye, total }: { paye: number; total: number }) {
  const pct = Math.min(100, Math.round((paye / total) * 100))
  const color = pct >= 100 ? EM : pct >= 50 ? AM : RD
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }} />
      </div>
      <span className="text-[8px] font-bold tabular-nums w-7 text-right flex-shrink-0"
        style={{ color }}>{pct}%</span>
    </div>
  )
}

/* ─── Détail échéances (row expanded) ─── */
function EcheanceDetail({ echeances }: { echeances: Echeance[] }) {
  return (
    <div className="px-4 pb-3 pt-1">
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Header */}
        <div className="grid px-3 py-2"
          style={{
            gridTemplateColumns: "1fr 90px 90px 80px 100px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
          {["Tranche","Montant","Échéance","Statut","Moyen"].map(h => (
            <span key={h} className="text-[7.5px] font-black uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.2)" }}>{h}</span>
          ))}
        </div>
        {echeances.map((e, i) => {
          const sCfg = STATUT_CFG[e.statut]
          const SIcon = sCfg.icon
          const mCfg = e.moyen ? MOYEN_CFG[e.moyen] : null
          const MIcon = mCfg?.icon
          return (
            <div key={e.id}
              className="grid px-3 py-2.5 items-center"
              style={{
                gridTemplateColumns: "1fr 90px 90px 80px 100px",
                borderBottom: i < echeances.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
              }}>
              <span className="text-[9.5px] font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
                {e.libelle}
              </span>
              <span className="text-[9.5px] font-bold tabular-nums" style={{ color: sCfg.color }}>
                {formatGNF(e.montant)}
              </span>
              <span className="text-[8.5px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
                {new Date(e.dateEcheance).toLocaleDateString("fr-FR")}
              </span>
              <div className="flex items-center gap-1">
                <SIcon size={10} style={{ color: sCfg.color }} />
                <span className="text-[8px] font-bold" style={{ color: sCfg.color }}>{sCfg.label}</span>
              </div>
              <div>
                {mCfg && MIcon ? (
                  <div className="flex items-center gap-1">
                    <MIcon size={9} style={{ color: mCfg.color }} />
                    <span className="text-[8px]" style={{ color: mCfg.color }}>{mCfg.label}</span>
                  </div>
                ) : (
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>—</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {/* Ref */}
      {echeances.find(e => e.reference) && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {echeances.filter(e => e.reference).map(e => (
            <span key={e.id} className="rounded px-2 py-0.5 text-[7.5px] font-mono"
              style={{ background: `${G}10`, color: G, border: `1px solid ${G}20` }}>
              {e.reference}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Eleve Row ─── */
function EleveRow({ eleve, index, onFiche, onPayer }: {
  eleve: EleveEcheancier; index: number
  onFiche: (e: EleveEcheancier) => void
  onPayer: (e: EleveEcheancier) => void
}) {
  const [open, setOpen] = useState(false)
  const sCfg = STATUT_CFG[eleve.statut]

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025, type: "spring", stiffness: 400, damping: 30 }}>
      {/* Row header */}
      <div
        className="grid items-center px-4 py-3 transition-colors group"
        style={{
          gridTemplateColumns: "32px 1fr 80px 100px 110px 80px 72px",
          borderBottom: open ? "none" : "1px solid rgba(255,255,255,0.04)",
          background: open ? "rgba(255,255,255,0.025)" : "transparent",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.018)" }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = open ? "rgba(255,255,255,0.025)" : "transparent" }}>

        {/* Index */}
        <span className="text-[8.5px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>
          {index + 1}
        </span>

        {/* Nom — clic ouvre fiche */}
        <div role="button" tabIndex={0} onClick={() => onFiche(eleve)}
          onKeyDown={e => (e.key === "Enter") && onFiche(eleve)}
          className="cursor-pointer">
          <div className="text-[10.5px] font-bold text-white truncate hover:underline underline-offset-2">
            {eleve.nom} <span className="font-normal" style={{ color: "rgba(255,255,255,0.55)" }}>{eleve.prenom}</span>
          </div>
          <div className="text-[7.5px] font-mono mt-0.5 flex items-center gap-2">
            <span style={{ color: "rgba(255,255,255,0.25)" }}>{eleve.matricule}</span>
            <span className="rounded px-1.5 py-0 text-[6.5px] font-bold"
              style={{ background: `${G}15`, color: G }}>{eleve.classe}</span>
          </div>
        </div>

        {/* Total dû */}
        <div className="text-right">
          <div className="text-[9.5px] font-bold tabular-nums" style={{ color: "rgba(255,255,255,0.7)" }}>
            {formatGNF(eleve.totalDu)}
          </div>
          <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.25)" }}>dû</div>
        </div>

        {/* Payé */}
        <div className="text-right">
          <div className="text-[9.5px] font-bold tabular-nums" style={{ color: EM }}>
            {formatGNF(eleve.totalPaye)}
          </div>
          <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.25)" }}>perçu</div>
        </div>

        {/* Progress */}
        <div className="px-1">
          <ProgressBar paye={eleve.totalPaye} total={eleve.totalDu} />
        </div>

        {/* Statut */}
        <StatutBadge statut={eleve.statut} small />

        {/* Actions */}
        <div className="flex items-center justify-end gap-1.5">
          <button onClick={() => onFiche(eleve)} title="Fiche étudiant"
            className="rounded-lg p-1.5 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
            <Eye size={10} style={{ color: "rgba(255,255,255,0.45)" }} />
          </button>
          {eleve.statut !== "payé" && (
            <button onClick={() => onPayer(eleve)} title="Payer"
              className="rounded-lg p-1.5 transition-all"
              style={{ background: `${G}12`, border: `1px solid ${G}30` }}
              onMouseEnter={e => e.currentTarget.style.background = `${G}22`}
              onMouseLeave={e => e.currentTarget.style.background = `${G}12`}>
              <PayIcon size={10} style={{ color: G }} />
            </button>
          )}
          <button onClick={() => setOpen(o => !o)} title="Détail tranches"
            className="rounded-lg p-1.5 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}>
            {open
              ? <ChevronUp size={10} style={{ color: "rgba(255,255,255,0.4)" }} />
              : <ChevronDown size={10} style={{ color: "rgba(255,255,255,0.3)" }} />}
          </button>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <EcheanceDetail echeances={eleve.echeances} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main ─── */
export function EcheancierPage() {
  const [search, setSearch] = useState("")
  const [filterStatut, setFilterStatut] = useState<StatutPaiement | "">("")
  const [ficheEleve, setFicheEleve] = useState<EleveEcheancier | null>(null)
  const [payerEleve, setPayerEleve] = useState<EleveEcheancier | null>(null)
  const [exportOpen, setExportOpen] = useState(false)

  const filtered = useMemo(() => ELEVES_ECHEANCIER.filter(e => {
    const q = search.toLowerCase()
    const matchSearch = !q || `${e.nom} ${e.prenom} ${e.matricule} ${e.classe}`.toLowerCase().includes(q)
    const matchStatut = !filterStatut || e.statut === filterStatut
    return matchSearch && matchStatut
  }), [search, filterStatut])

  const stats = useMemo(() => {
    const total = ELEVES_ECHEANCIER.reduce((s, e) => s + e.totalDu, 0)
    const percu = ELEVES_ECHEANCIER.reduce((s, e) => s + e.totalPaye, 0)
    return { total, percu, solde: total - percu }
  }, [])

  const FILTRES: { key: StatutPaiement | ""; label: string; count: number; color: string }[] = [
    { key: "",          label: "Tous",      count: ELEVES_ECHEANCIER.length,                                   color: "rgba(255,255,255,0.5)" },
    { key: "payé",      label: "Payés",     count: ELEVES_ECHEANCIER.filter(e => e.statut === "payé").length,      color: EM },
    { key: "partiel",   label: "Partiels",  count: ELEVES_ECHEANCIER.filter(e => e.statut === "partiel").length,   color: AM },
    { key: "en_retard", label: "En retard", count: ELEVES_ECHEANCIER.filter(e => e.statut === "en_retard").length, color: RD },
    { key: "non_payé",  label: "Non payés", count: ELEVES_ECHEANCIER.filter(e => e.statut === "non_payé").length,  color: "rgba(255,255,255,0.35)" },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* Mini KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total des frais",  value: formatGNF(stats.total),  color: "rgba(255,255,255,0.7)" },
          { label: "Montant perçu",    value: formatGNF(stats.percu),  color: EM },
          { label: "Solde impayé",     value: formatGNF(stats.solde),  color: RD },
        ].map((k, i) => (
          <motion.div key={k.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, type: "spring", stiffness: 400, damping: 30 }}
            className="rounded-2xl px-4 py-3"
            style={{ background: SB, border: `1px solid ${MU}` }}>
            <div className="text-[16px] font-black tabular-nums" style={{ color: k.color }}>{k.value}</div>
            <div className="text-[8px] mt-0.5 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)" }}>{k.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Drawers & Modals */}
      <DrawerPaiement eleve={payerEleve} open={!!payerEleve}
        onClose={() => setPayerEleve(null)} />
      <FicheEtudiantModal eleve={ficheEleve} open={!!ficheEleve}
        onClose={() => setFicheEleve(null)}
        onPayer={() => { if (ficheEleve) { setPayerEleve(ficheEleve); setFicheEleve(null) } }} />
      <DrawerExportRapports open={exportOpen} onClose={() => setExportOpen(false)} />

      {/* Filters + Search */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3"
              style={{ color: "rgba(255,255,255,0.25)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un étudiant…"
              className="w-full rounded-xl pl-8 pr-3 py-2 text-[10px] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }} />
          </div>
          <button onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[9px] font-bold flex-shrink-0 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={e => { e.currentTarget.style.background = `rgba(201,168,76,0.1)`; e.currentTarget.style.color = G }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)" }}>
            <Download size={11} /> Export
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {FILTRES.map(f => (
            <button key={String(f.key)} onClick={() => setFilterStatut(f.key)}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all"
              style={filterStatut === f.key
                ? { background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }
                : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {f.label}
              <span className="rounded px-1 text-[7px]"
                style={{ background: filterStatut === f.key ? `${f.color}20` : "rgba(255,255,255,0.06)" }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${MU}` }}>

        {/* Table head */}
        <div className="grid px-4 py-2.5"
          style={{
            gridTemplateColumns: "32px 1fr 80px 100px 110px 80px 72px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
          {["#","Étudiant","Total dû","Perçu","Progression","Statut","Actions"].map(h => (
            <span key={h} className="text-[7.5px] font-black uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.2)" }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              Aucun résultat
            </div>
          ) : filtered.map((e, i) => (
            <EleveRow key={e.id} eleve={e} index={i}
              onFiche={setFicheEleve}
              onPayer={setPayerEleve} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
