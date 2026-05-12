"use client"

import { motion } from "framer-motion"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts"
import {
  SERIE_CONSOLIDEE, SERIE_MASSE_SALARIALE, DIST_NOTES_EVAL, formatGNF,
} from "./rapports-mock-data"
import { EMPLOYES, CONTRATS, STATS_DEPT } from "../rh/rh-mock-data"
import { Users, FileText, Star, TrendingUp } from "lucide-react"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const OR = "#F97316"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const DEPT_COLORS = [BL, G, EM, AM, PR, OR, RD]

const CONTRATS_TYPE = [
  { name: "CDI",       value: CONTRATS.filter(c => c.type === "CDI").length,       color: BL },
  { name: "CDD",       value: CONTRATS.filter(c => c.type === "CDD").length,       color: AM },
  { name: "Vacataire", value: CONTRATS.filter(c => c.type === "vacataire").length, color: PR },
  { name: "Stage",     value: CONTRATS.filter(c => c.type === "stage").length,     color: G  },
]

const masseTotal = SERIE_MASSE_SALARIALE[SERIE_MASSE_SALARIALE.length - 1].masse
const actifs     = EMPLOYES.filter(e => e.statut === "actif").length
const turnover   = EMPLOYES.filter(e => e.statut === "parti").length

export function RapportRHPage() {
  return (
    <div className="flex flex-col gap-5">

      {/* KPIs RH */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Effectif actif",   val: String(actifs),          color: BL, icon: Users     },
          { lbl: "CDI",              val: String(CONTRATS.filter(c=>c.type==="CDI").length), color: EM, icon: FileText },
          { lbl: "Masse salariale",  val: formatGNF(masseTotal),   color: G,  icon: TrendingUp },
          { lbl: "Évaluations avg",  val: "14.2/20",               color: PR, icon: Star      },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <motion.div key={k.lbl} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="rounded-xl p-2 w-fit" style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
                <Icon size={13} style={{ color: k.color }} />
              </div>
              <div>
                <div className="text-[18px] font-black" style={{ color: k.color }}>{k.val}</div>
                <div className="text-[8.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{k.lbl}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Effectifs + Masse salariale */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Évolution effectifs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Évolution effectifs — 12 mois</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Personnes actives</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={SERIE_CONSOLIDEE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="grEff" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={BL} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={BL} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} domain={[18, 32]} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }} itemStyle={{ color: "white" }} />
              <Area type="monotone" dataKey="effectifs" stroke={BL} fill="url(#grEff)" strokeWidth={2} dot={false} name="Effectifs" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Masse salariale 12 mois */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Masse salariale — 12 mois</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Base + Primes (GNF)</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={SERIE_MASSE_SALARIALE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="mois" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
                formatter={(val: unknown) => formatGNF(Number(val))} />
              <Bar dataKey="masse"  fill={`${G}40`}  radius={[3,3,0,0]} name="Base"   stackId="a" />
              <Bar dataKey="primes" fill={G}          radius={[3,3,0,0]} name="Primes" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 text-[7.5px]">
            {[{c:`${G}40`,l:"Base"},{c:G,l:"Primes"}].map(x => (
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: x.c }} />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{x.l}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Types contrats + Effectifs par département */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Donut types contrats */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Types de contrats</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Répartition du personnel</div>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={CONTRATS_TYPE} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={52} paddingAngle={3}>
                  {CONTRATS_TYPE.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {CONTRATS_TYPE.map(c => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                  <div className="flex-1 text-[8.5px] font-bold text-white">{c.name}</div>
                  <div className="text-[9px] font-black" style={{ color: c.color }}>{c.value}</div>
                  <div className="w-14 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(c.value / CONTRATS.length) * 100}%`, background: c.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Effectifs par département */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Effectifs par département</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Personnel actif + masse salariale</div>
          </div>
          <div className="flex flex-col gap-2.5">
            {STATS_DEPT.map((d, i) => (
              <div key={d.dept} className="flex items-center gap-3">
                <div className="size-2 rounded-full flex-shrink-0" style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                <div className="text-[8.5px] flex-1 truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{d.dept}</div>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.effectif / 6) * 100}%`, background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                </div>
                <div className="text-[8.5px] font-bold w-4 text-right text-white">{d.effectif}</div>
                <div className="text-[7.5px] w-20 text-right" style={{ color: G }}>{formatGNF(d.masse)}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Distribution notes évaluations */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-white">Distribution des notes — Évaluations annuelles</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Note de performance /20 — exercice 2025</div>
          </div>
          <div className="text-right">
            <div className="text-[14px] font-black" style={{ color: G }}>14.2</div>
            <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Moyenne /20</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={DIST_NOTES_EVAL} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="tranche" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
              labelStyle={{ color: "rgba(255,255,255,0.5)" }} />
            <Bar dataKey="nb" name="Employés" radius={[4,4,0,0]}>
              {DIST_NOTES_EVAL.map((_, i) => {
                const colors = [RD, AM, AM, G, EM, EM]
                return <Cell key={i} fill={colors[i] ?? G} />
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
