"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, ArrowUpRight, ArrowDownRight,
  Smartphone, Banknote, CreditCard, Wallet, FileText,
  ChevronDown, ChevronUp, Circle, Plus, Download,
} from "lucide-react"
import { TRANSACTIONS, formatGNF, type Transaction, type TypeTransaction, type MoyenPaiement } from "./finance-mock-data"
import { DrawerNouvelleTransaction } from "./DrawerNouvelleTransaction"
import { DrawerExportRapports } from "./DrawerExportRapports"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const SB = "#07111d"
const MU = "rgba(255,255,255,0.08)"

const TYPE_CFG: Record<TypeTransaction, { label: string; color: string; icon: React.ElementType }> = {
  recette:           { label: "Recette",          color: EM,    icon: ArrowUpRight },
  dépense:           { label: "Dépense",          color: RD,    icon: ArrowDownRight },
  virement_interne:  { label: "Virement interne", color: G,     icon: Circle },
}

const MOYEN_CFG: Record<MoyenPaiement, { label: string; color: string; icon: React.ElementType }> = {
  espèces:      { label: "Espèces",      color: G,        icon: Banknote },
  virement:     { label: "Virement",     color: "#6366f1", icon: CreditCard },
  orange_money: { label: "Orange Money", color: "#f97316", icon: Smartphone },
  wave:         { label: "Wave",         color: "#06b6d4", icon: Wallet },
  chèque:       { label: "Chèque",       color: "rgba(255,255,255,0.4)", icon: FileText },
}

/* ─── Detail drawer ─── */
function TxDetail({ tx }: { tx: Transaction }) {
  const cfg = TYPE_CFG[tx.type]
  const mCfg = MOYEN_CFG[tx.moyen]
  const MIcon = mCfg.icon
  return (
    <div className="px-12 pb-4 pt-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[
        { label: "Référence",   value: tx.reference, mono: true },
        { label: "Unité",       value: tx.unite,     mono: false },
        { label: "Moyen",       value: mCfg.label,   mono: false, icon: <MIcon size={10} style={{ color: mCfg.color }} /> },
        { label: "Description", value: tx.description, mono: false },
      ].map(d => (
        <div key={d.label} className="rounded-xl px-3 py-2.5"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-[7.5px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>
            {d.label}
          </div>
          <div className={`text-[9.5px] font-${d.mono ? "mono" : "medium"} flex items-center gap-1.5`}
            style={{ color: "rgba(255,255,255,0.7)" }}>
            {d.icon}{d.value}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Transaction row ─── */
function TxRow({ tx, index, soldeRunning }: { tx: Transaction; index: number; soldeRunning: number }) {
  const [open, setOpen] = useState(false)
  const cfg = TYPE_CFG[tx.type]
  const TIcon = cfg.icon
  const isRecette = tx.type === "recette"

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, type: "spring", stiffness: 400, damping: 30 }}>

      <div
        role="button" tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && setOpen(o => !o)}
        className="grid items-center px-4 py-3 cursor-pointer transition-colors"
        style={{
          gridTemplateColumns: "90px 28px 1fr 100px 100px 110px 80px 18px",
          borderBottom: open ? "none" : "1px solid rgba(255,255,255,0.04)",
          background: open ? "rgba(255,255,255,0.02)" : "transparent",
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "rgba(255,255,255,0.015)" }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "transparent" }}>

        {/* Date */}
        <span className="text-[8.5px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>
          {new Date(tx.date).toLocaleDateString("fr-FR")}
        </span>

        {/* Type icon */}
        <div className="flex items-center justify-center">
          <div className="rounded-lg p-1" style={{ background: `${cfg.color}15` }}>
            <TIcon size={10} style={{ color: cfg.color }} />
          </div>
        </div>

        {/* Libellé */}
        <div>
          <div className="text-[10px] font-semibold text-white truncate">{tx.libelle}</div>
          <div className="text-[7.5px] font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
            {tx.reference}
          </div>
        </div>

        {/* Débit */}
        <div className="text-right">
          {tx.debit > 0 ? (
            <span className="text-[9.5px] font-bold tabular-nums" style={{ color: RD }}>
              − {formatGNF(tx.debit)}
            </span>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.1)" }}>—</span>
          )}
        </div>

        {/* Crédit */}
        <div className="text-right">
          {tx.credit > 0 ? (
            <span className="text-[9.5px] font-bold tabular-nums" style={{ color: EM }}>
              + {formatGNF(tx.credit)}
            </span>
          ) : (
            <span style={{ color: "rgba(255,255,255,0.1)" }}>—</span>
          )}
        </div>

        {/* Solde */}
        <div className="text-right">
          <span className="text-[9px] tabular-nums font-bold"
            style={{ color: tx.solde >= 0 ? "rgba(255,255,255,0.6)" : RD }}>
            {formatGNF(tx.solde)}
          </span>
        </div>

        {/* Unité */}
        <div className="truncate text-[7.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          {tx.unite.split(" ").slice(-1)[0]}
        </div>

        {/* Toggle */}
        {open
          ? <ChevronUp size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
          : <ChevronDown size={10} style={{ color: "rgba(255,255,255,0.15)" }} />}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <TxDetail tx={tx} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── Main ─── */
export function TransactionsPage() {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<TypeTransaction | "">("")
  const [newTxOpen, setNewTxOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

  const filtered = useMemo(() =>
    TRANSACTIONS.filter(tx => {
      const q = search.toLowerCase()
      const matchQ = !q || tx.libelle.toLowerCase().includes(q) || tx.reference.toLowerCase().includes(q) || tx.unite.toLowerCase().includes(q)
      const matchT = !filterType || tx.type === filterType
      return matchQ && matchT
    }), [search, filterType])

  const totaux = useMemo(() => ({
    credits: TRANSACTIONS.filter(t => t.type === "recette").reduce((s, t) => s + t.credit, 0),
    debits:  TRANSACTIONS.filter(t => t.type === "dépense").reduce((s, t) => s + t.debit, 0),
    solde:   TRANSACTIONS.at(-1)?.solde ?? 0,
  }), [])

  const FILTRES: { key: TypeTransaction | ""; label: string; color: string }[] = [
    { key: "",                 label: "Toutes",           color: "rgba(255,255,255,0.5)" },
    { key: "recette",          label: "Recettes",         color: EM },
    { key: "dépense",          label: "Dépenses",         color: RD },
    { key: "virement_interne", label: "Virements intern.", color: G },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* Drawers */}
      <DrawerNouvelleTransaction open={newTxOpen} onClose={() => setNewTxOpen(false)} />
      <DrawerExportRapports open={exportOpen} onClose={() => setExportOpen(false)} />

      {/* Solde summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total crédits",  value: formatGNF(totaux.credits), color: EM },
          { label: "Total débits",   value: formatGNF(totaux.debits),  color: RD },
          { label: "Solde courant",  value: formatGNF(totaux.solde),   color: G  },
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

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Libellé, référence, unité…"
              className="w-full rounded-xl pl-8 pr-3 py-2 text-[10px] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }} />
          </div>
          <button onClick={() => setNewTxOpen(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[9px] font-bold flex-shrink-0 transition-all"
            style={{ background: `rgba(16,185,129,0.1)`, border: `1px solid rgba(16,185,129,0.25)`, color: EM }}
            onMouseEnter={e => e.currentTarget.style.background = `rgba(16,185,129,0.18)`}
            onMouseLeave={e => e.currentTarget.style.background = `rgba(16,185,129,0.1)`}>
            <Plus size={11} /> Nouvelle
          </button>
          <button onClick={() => setExportOpen(true)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[9px] font-bold flex-shrink-0 transition-all"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={e => { e.currentTarget.style.background = `rgba(201,168,76,0.1)`; e.currentTarget.style.color = G }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}>
            <Download size={11} /> Export
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
          {FILTRES.map(f => (
            <button key={String(f.key)} onClick={() => setFilterType(f.key)}
              className="flex-shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all"
              style={filterType === f.key
                ? { background: `${f.color}15`, color: f.color, border: `1px solid ${f.color}30` }
                : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Journal table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${MU}` }}>

        {/* Head */}
        <div className="grid px-4 py-2.5"
          style={{
            gridTemplateColumns: "90px 28px 1fr 100px 100px 110px 80px 18px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
          {["Date","","Libellé","Débit","Crédit","Solde","Unité",""].map((h, i) => (
            <span key={i} className="text-[7.5px] font-black uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.2)", textAlign: i >= 3 && i <= 5 ? "right" : "left" }}>{h}</span>
          ))}
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "62vh" }}>
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              Aucune transaction trouvée
            </div>
          ) : filtered.map((tx, i) => (
            <TxRow key={tx.id} tx={tx} index={i} soldeRunning={tx.solde} />
          ))}
        </div>
      </motion.div>
    </div>
  )
}
