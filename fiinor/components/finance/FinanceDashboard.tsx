"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp, TrendingDown, AlertTriangle,
  Banknote, Percent, ArrowUpRight, ArrowDownRight,
  Clock, Wallet,
} from "lucide-react"
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Sector,
} from "recharts"
import type { PieLabelRenderProps, PieSectorShapeProps } from "recharts"
import {
  KPI_FINANCE, RECETTES_MENSUELLES, REPARTITION_MOYENS,
  TAUX_CLASSE, formatGNF,
} from "./finance-mock-data"

/* ─── Tokens ─── */
const G = "#C9A84C"   // gold
const EM = "#10B981"  // emerald
const RD = "#EF4444"  // red
const BL = "#3B82F6"  // blue
const MU = "rgba(255,255,255,0.08)"
const SB = "#07111d"  // surface bg

/* ─── Animation variants ─── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { delay, type: "spring" as const, stiffness: 360, damping: 32 } },
})

/* ─── KPI Card ─── */
function KpiCard({
  label, value, sub, trend, trendUp, icon: Icon, accent, delay = 0,
}: {
  label: string; value: string; sub: string
  trend: string; trendUp: boolean
  icon: React.ElementType; accent: string; delay?: number
}) {
  const TrendIcon = trendUp ? TrendingUp : TrendingDown
  return (
    <motion.div {...fadeUp(delay)}
      className="relative overflow-hidden rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: SB, border: `1px solid ${MU}` }}>
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 size-24 rounded-full blur-2xl"
        style={{ background: `${accent}18` }} />
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="rounded-xl p-2 flex-shrink-0"
          style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
          <Icon size={15} style={{ color: accent }} />
        </div>
        <div className={`flex items-center gap-1 rounded-lg px-2 py-0.5 text-[9px] font-bold`}
          style={{
            background: trendUp ? `${EM}15` : `${RD}15`,
            color: trendUp ? EM : RD,
          }}>
          <TrendIcon size={9} />
          {trend}
        </div>
      </div>
      {/* Value */}
      <div>
        <div className="text-[22px] font-black tracking-tight text-white leading-none tabular-nums">
          {value}
        </div>
        <div className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</div>
      </div>
      {/* Sub */}
      <div className="text-[8.5px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{sub}</div>
    </motion.div>
  )
}

/* ─── Custom Tooltip ─── */
function ChartTooltip({ active, payload, label }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2.5 text-[10px]"
      style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>
      <div className="font-bold text-white mb-1.5">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "rgba(255,255,255,0.55)" }}>{p.name}</span>
          <span className="font-bold text-white ml-auto pl-4">{formatGNF(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Donut label center ─── */
function DonutLabel(props: PieLabelRenderProps) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  if (!cx || !cy || !midAngle || !innerRadius || !outerRadius || !percent) return null
  const RADIAN = Math.PI / 180
  const ir = Number(innerRadius), or = Number(outerRadius)
  const radius = ir + (or - ir) * 0.5
  const x = Number(cx) + radius * Math.cos(-Number(midAngle) * RADIAN)
  const y = Number(cy) + radius * Math.sin(-Number(midAngle) * RADIAN)
  if (Number(percent) < 0.08) return null
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 9, fontWeight: 700 }}>
      {`${(Number(percent) * 100).toFixed(0)}%`}
    </text>
  )
}

/* ─── Alerte badge ─── */
function AlertBadge({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-3 py-2"
      style={{ background: `${RD}10`, border: `1px solid ${RD}25` }}>
      <AlertTriangle size={12} style={{ color: RD }} />
      <span className="text-[10px] font-bold" style={{ color: RD }}>
        {count} échéances en retard
      </span>
    </div>
  )
}

/* ─── Main ─── */
export function FinanceDashboard() {
  const chartData = useMemo(() =>
    RECETTES_MENSUELLES.map(d => ({
      ...d,
      recettes: d.recettes,
      depenses: d.depenses,
      previsions: d.previsions,
    })), [])

  return (
    <div className="flex flex-col gap-5">

      {/* Alert bar */}
      <motion.div {...fadeUp(0)} className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-[11px] font-black text-white tracking-tight">Tableau de bord financier</div>
          <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Année académique 2024–2025 · Université de Conakry · GNF
          </div>
        </div>
        <AlertBadge count={KPI_FINANCE.alertesRetard} />
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Recettes du mois"
          value={formatGNF(KPI_FINANCE.recetteMois)}
          sub={`Objectif : ${formatGNF(KPI_FINANCE.recetteMoisPrev)}`}
          trend="+9.9%"
          trendUp={true}
          icon={Banknote}
          accent={G}
          delay={0.04}
        />
        <KpiCard
          label="Taux de recouvrement"
          value={`${KPI_FINANCE.tauxRecouvrement}%`}
          sub={`Cible : ${KPI_FINANCE.tauxRecouvrementPrev}%`}
          trend="-6 pts"
          trendUp={false}
          icon={Percent}
          accent={BL}
          delay={0.08}
        />
        <KpiCard
          label="Impayés totaux"
          value={formatGNF(KPI_FINANCE.impayes)}
          sub={`Mois préc. : ${formatGNF(KPI_FINANCE.impayesPrev)}`}
          trend="+29%"
          trendUp={false}
          icon={AlertTriangle}
          accent={RD}
          delay={0.12}
        />
        <KpiCard
          label="Balance analytique"
          value={formatGNF(KPI_FINANCE.balance)}
          sub={`Mois préc. : ${formatGNF(KPI_FINANCE.balancePrev)}`}
          trend="+31%"
          trendUp={true}
          icon={Wallet}
          accent={EM}
          delay={0.16}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recettes vs Dépenses vs Prévisions */}
        <motion.div {...fadeUp(0.2)}
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: SB, border: `1px solid ${MU}` }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-black text-white">Recettes & Dépenses</div>
              <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Mensuel · 2024</div>
            </div>
            <div className="flex items-center gap-3 text-[8px]">
              {[
                { label: "Recettes", color: G },
                { label: "Dépenses", color: RD },
                { label: "Prévisions", color: BL },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="size-2 rounded-full" style={{ background: l.color }} />
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRecettes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={G} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={G} stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="gradDepenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={RD} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={RD} stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="mois" tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }}
                axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`}
                tick={{ fontSize: 8, fill: "rgba(255,255,255,0.3)" }}
                axisLine={false} tickLine={false} width={36} />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="recettes" name="Recettes" fill="url(#gradRecettes)" radius={[3, 3, 0, 0]} barSize={14} />
              <Bar dataKey="depenses" name="Dépenses" fill="url(#gradDepenses)" radius={[3, 3, 0, 0]} barSize={14} />
              <Line dataKey="previsions" name="Prévisions" stroke={BL} strokeWidth={1.5}
                strokeDasharray="4 3" dot={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Donut moyens de paiement */}
        <motion.div {...fadeUp(0.24)}
          className="rounded-2xl p-5 flex flex-col"
          style={{ background: SB, border: `1px solid ${MU}` }}>
          <div className="mb-3">
            <div className="text-[11px] font-black text-white">Moyens de paiement</div>
            <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Répartition des encaissements</div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <PieChart width={160} height={160}>
              <Pie
                data={REPARTITION_MOYENS}
                cx="50%" cy="50%"
                innerRadius={44} outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={DonutLabel}
                shape={(props: PieSectorShapeProps, idx: number) => {
                  const { cx = 0, cy = 0, innerRadius = 0, outerRadius = 0, startAngle = 0, endAngle = 0, fill = "#fff" } = props
                  return <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius}
                    startAngle={startAngle} endAngle={endAngle} fill={REPARTITION_MOYENS[idx]?.color ?? fill} />
                }}
              />
            </PieChart>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-1.5 mt-2">
            {REPARTITION_MOYENS.map(m => (
              <div key={m.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>{m.name}</span>
                </div>
                <span className="text-[9px] font-bold tabular-nums" style={{ color: m.color }}>{m.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Taux par classe */}
      <motion.div {...fadeUp(0.28)}
        className="rounded-2xl p-5"
        style={{ background: SB, border: `1px solid ${MU}` }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] font-black text-white">Taux de recouvrement par classe</div>
            <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>% des frais perçus · effectif entre parenthèses</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {TAUX_CLASSE.map((c, i) => {
            const color = c.taux >= 85 ? EM : c.taux >= 65 ? G : RD
            return (
              <motion.div key={c.classe}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.04, type: "spring", stiffness: 400, damping: 30 }}
                className="flex items-center gap-3">
                <div className="text-[9px] font-mono w-20 flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.4)" }}>{c.classe}</div>
                <div className="flex-1 h-2 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.taux}%` }}
                    transition={{ delay: 0.35 + i * 0.04, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: color }} />
                </div>
                <div className="text-[10px] font-black tabular-nums w-10 text-right"
                  style={{ color }}>
                  {c.taux}%
                </div>
                <div className="text-[8px] w-14 text-right flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.25)" }}>
                  {c.effectif} élèves
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
