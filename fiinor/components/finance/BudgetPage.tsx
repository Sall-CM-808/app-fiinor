"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
} from "recharts"
import { LIGNES_BUDGET, formatGNF, type LigneBudget } from "./finance-mock-data"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const BL = "#3B82F6"
const SB = "#07111d"
const MU = "rgba(255,255,255,0.08)"

/* ─── Custom tooltip ─── */
function ChartTooltip({ active, payload, label }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2.5 text-[10px]"
      style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.12)" }}>
      <div className="font-bold text-white mb-1.5 truncate max-w-[160px]">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{p.name}</span>
          <span className="font-bold text-white ml-auto pl-3">{formatGNF(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Ligne budget row ─── */
function BudgetRow({ ligne, index }: { ligne: LigneBudget; index: number }) {
  const over    = ligne.ecart > 0
  const ontrack = Math.abs(ligne.ecart) < ligne.previsionnel * 0.05
  const color   = ontrack ? EM : over ? RD : G
  const TIcon   = ontrack ? Minus : over ? TrendingUp : TrendingDown
  const pct     = ligne.pourcentage

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03, type: "spring", stiffness: 400, damping: 30 }}
      className="grid items-center px-4 py-3"
      style={{
        gridTemplateColumns: "1fr 90px 90px 90px 56px 90px",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.018)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

      {/* Libellé */}
      <div>
        <div className="text-[10px] font-semibold text-white truncate">{ligne.libelle}</div>
        <div className="text-[7.5px] mt-0.5 flex items-center gap-1.5">
          <span className="rounded px-1.5 py-0 text-[6.5px] font-bold"
            style={{ background: `${ligne.type === "recette" ? EM : RD}15`, color: ligne.type === "recette" ? EM : RD }}>
            {ligne.type === "recette" ? "Recette" : "Dépense"}
          </span>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>{ligne.unite}</span>
        </div>
      </div>

      {/* Prévisionnel */}
      <div className="text-right">
        <div className="text-[9px] tabular-nums" style={{ color: "rgba(255,255,255,0.5)" }}>
          {formatGNF(ligne.previsionnel)}
        </div>
        <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>prévu</div>
      </div>

      {/* Réalisé */}
      <div className="text-right">
        <div className="text-[9.5px] font-bold tabular-nums" style={{ color }}>
          {formatGNF(ligne.realise)}
        </div>
        <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>réalisé</div>
      </div>

      {/* Écart */}
      <div className="text-right">
        <div className="text-[9px] font-bold tabular-nums flex items-center justify-end gap-0.5"
          style={{ color }}>
          <TIcon size={9} />
          {formatGNF(Math.abs(ligne.ecart))}
        </div>
        <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>écart</div>
      </div>

      {/* % */}
      <div className="text-right">
        <div className="text-[11px] font-black tabular-nums" style={{ color }}>
          {pct}%
        </div>
      </div>

      {/* Bar */}
      <div className="pl-2">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(pct, 120)}%` }}
            transition={{ delay: 0.1 + index * 0.03, duration: 0.5, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ background: color, maxWidth: "100%" }} />
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main ─── */
export function BudgetPage() {
  const [filterType, setFilterType] = useState<"tous" | "recette" | "dépense">("tous")

  const filtered = useMemo(() =>
    LIGNES_BUDGET.filter(l => filterType === "tous" || l.type === filterType),
    [filterType])

  const chartData = useMemo(() =>
    filtered.slice(0, 8).map(l => ({
      name: l.unite.split(" ").slice(-1)[0].slice(0, 10),
      Prévu: l.previsionnel,
      Réalisé: l.realise,
    })), [filtered])

  const totaux = useMemo(() => ({
    previsionnel: filtered.reduce((s, l) => s + l.previsionnel, 0),
    realise:      filtered.reduce((s, l) => s + l.realise, 0),
  }), [filtered])

  return (
    <div className="flex flex-col gap-4">

      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Budget prévisionnel", value: formatGNF(totaux.previsionnel), color: "rgba(255,255,255,0.7)" },
          { label: "Budget réalisé",      value: formatGNF(totaux.realise),      color: totaux.realise <= totaux.previsionnel ? EM : RD },
          { label: "Écart global",        value: formatGNF(Math.abs(totaux.realise - totaux.previsionnel)),
            color: totaux.realise <= totaux.previsionnel ? G : RD },
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

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl p-5"
        style={{ background: SB, border: `1px solid ${MU}` }}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <div className="text-[11px] font-black text-white">Prévisionnel vs Réalisé</div>
            <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Par unité structurelle</div>
          </div>
          <div className="flex gap-1">
            {(["tous","recette","dépense"] as const).map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className="rounded-lg px-2.5 py-1 text-[9px] font-bold capitalize transition-all"
                style={filterType === t
                  ? { background: `${G}15`, color: G, border: `1px solid ${G}30` }
                  : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }}
              axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`}
              tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }}
              axisLine={false} tickLine={false} width={34} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="Prévu"   fill={`${BL}60`} radius={[3, 3, 0, 0]} barSize={12} />
            <Bar dataKey="Réalisé" fill={G}          radius={[3, 3, 0, 0]} barSize={12} />
          </BarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2">
          {[{ label: "Prévisionnel", color: BL }, { label: "Réalisé", color: G }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="size-2 rounded-full" style={{ background: l.color }} />
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Detail table */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${MU}` }}>
        <div className="grid px-4 py-2.5"
          style={{
            gridTemplateColumns: "1fr 90px 90px 90px 56px 90px",
            background: "rgba(255,255,255,0.02)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}>
          {["Poste budgétaire","Prévisionnel","Réalisé","Écart","%","Avancement"].map(h => (
            <span key={h} className="text-[7.5px] font-black uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.2)", textAlign: h === "Avancement" ? "right" : "left" }}>{h}</span>
          ))}
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "50vh" }}>
          {filtered.map((l, i) => <BudgetRow key={l.id} ligne={l} index={i} />)}
        </div>
      </motion.div>
    </div>
  )
}
