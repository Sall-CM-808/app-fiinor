"use client"

import { motion } from "framer-motion"
import {
  ComposedChart, Bar, Area, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, BarChart, PieChart, Pie, Cell,
  CartesianGrid, ReferenceLine,
} from "recharts"
import {
  SERIE_CONSOLIDEE, BUDGET_VS_REEL, REPARTITION_PAIEMENTS,
  RECOUVREMENT_FILIERE, formatGNF,
} from "./rapports-mock-data"
import { TrendingUp, TrendingDown, Wallet, AlertTriangle } from "lucide-react"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const totalRecettes = SERIE_CONSOLIDEE.reduce((s, m) => s + m.recettes, 0)
const totalDepenses = SERIE_CONSOLIDEE.reduce((s, m) => s + m.depenses, 0)
const excedent      = totalRecettes - totalDepenses

export function RapportFinancierPage() {
  return (
    <div className="flex flex-col gap-5">

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { lbl: "Recettes totales", val: formatGNF(totalRecettes), color: EM, icon: TrendingUp  },
          { lbl: "Dépenses totales", val: formatGNF(totalDepenses), color: RD, icon: TrendingDown },
          { lbl: "Excédent net",     val: formatGNF(excedent),      color: G,  icon: Wallet       },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <motion.div key={k.lbl} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-2">
                <div className="rounded-xl p-2" style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
                  <Icon size={13} style={{ color: k.color }} />
                </div>
                <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>{k.lbl}</div>
              </div>
              <div className="text-[16px] font-black" style={{ color: k.color }}>{k.val}</div>
              <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>Cumul Jun 2024 – Mai 2025</div>
            </motion.div>
          )
        })}
      </div>

      {/* ComposedChart Recettes + Dépenses + Excédent */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-[11px] font-black text-white">Recettes vs Dépenses — 12 mois</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Jun 2024 – Mai 2025</div>
          </div>
          <div className="flex gap-4 text-[7.5px]">
            {[{c:EM,l:"Recettes"},{c:RD,l:"Dépenses"},{c:G,l:"Prévision 35M"}].map(x => (
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: x.c }} />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={SERIE_CONSOLIDEE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="grRec2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={EM} stopOpacity={0.2} />
                <stop offset="95%" stopColor={EM} stopOpacity={0}   />
              </linearGradient>
              <linearGradient id="grDep" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={RD} stopOpacity={0.15} />
                <stop offset="95%" stopColor={RD} stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="mois" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false}
              tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
              labelStyle={{ color: "rgba(255,255,255,0.6)" }} itemStyle={{ color: "white" }}
              formatter={(val: unknown) => formatGNF(Number(val))} />
            <ReferenceLine y={35_000_000} stroke={G} strokeDasharray="4 3" strokeOpacity={0.5}
              label={{ value: "Prévision", fill: G, fontSize: 8, position: "right" }} />
            <Area type="monotone" dataKey="recettes" stroke={EM} fill="url(#grRec2)" strokeWidth={2} dot={false} name="Recettes" />
            <Area type="monotone" dataKey="depenses" stroke={RD} fill="url(#grDep)"  strokeWidth={2} dot={false} name="Dépenses" />
          </ComposedChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Budget vs Réel + Moyens paiement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Budget vs Réel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Budget vs Réel par département</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>GNF — exercice 2025</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BUDGET_VS_REEL} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 60 }}>
              <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 8 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
              <YAxis type="category" dataKey="unite" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 8 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
                formatter={(val: unknown) => formatGNF(Number(val))} />
              <Bar dataKey="previsionnel" fill={`${BL}50`} radius={[0, 4, 4, 0]} name="Prévisionnel" barSize={8} />
              <Bar dataKey="reel" fill={G} radius={[0, 4, 4, 0]} name="Réel" barSize={8} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 text-[7.5px]">
            {[{c:`${BL}50`,l:"Prévisionnel"},{c:G,l:"Réel"}].map(x => (
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: x.c }} />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{x.l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Moyens de paiement */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Répartition moyens de paiement</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>% du total des transactions</div>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie data={REPARTITION_PAIEMENTS} dataKey="value" cx="50%" cy="50%" innerRadius={32} outerRadius={55} paddingAngle={3}>
                  {REPARTITION_PAIEMENTS.map((p, i) => <Cell key={i} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
                  formatter={(val: unknown) => [`${val}%`, ""]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {REPARTITION_PAIEMENTS.map(p => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full flex-shrink-0" style={{ background: p.color }} />
                  <div className="flex-1 text-[8.5px] font-bold text-white">{p.name}</div>
                  <div className="text-[9px] font-black" style={{ color: p.color }}>{p.value}%</div>
                  <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${p.value}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Taux recouvrement par filière */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Taux de recouvrement par filière</div>
          <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Objectif : 70%</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {RECOUVREMENT_FILIERE.map((f, i) => {
            const color = f.taux >= 80 ? EM : f.taux >= 70 ? G : f.taux >= 60 ? AM : RD
            const underObj = f.taux < 70
            return (
              <div key={f.filiere} className="px-4 py-3 flex items-center gap-4"
                style={{ borderBottom: i < RECOUVREMENT_FILIERE.length - 2 ? `1px solid ${BORDER}` : "none", background: underObj ? `${RD}03` : "transparent" }}>
                <div className="w-28 flex-shrink-0">
                  <div className="text-[9px] font-bold text-white">{f.filiere}</div>
                  <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{f.effectif} étudiants</div>
                </div>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${f.taux}%`, background: color }} />
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {underObj && <AlertTriangle size={9} style={{ color: RD }} />}
                  <span className="text-[9px] font-black w-8 text-right" style={{ color }}>{f.taux}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
