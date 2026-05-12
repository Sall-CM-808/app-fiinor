"use client"

import { motion } from "framer-motion"
import {
  Wallet, Users, TrendingUp, UserCheck,
  Landmark, Briefcase, Activity, CheckCircle2, AlertTriangle,
} from "lucide-react"
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis,
} from "recharts"
import {
  KPIS_GLOBAUX, SCORE_MODULES, SERIE_CONSOLIDEE,
  HEATMAP_ACTIVITE, HEALTH_SCORE,
} from "./rapports-mock-data"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const ICON_MAP: Record<string, React.ElementType> = {
  Wallet, Users, TrendingUp, UserCheck, Landmark, Briefcase,
}

const HEATMAP_COLORS = [
  "rgba(255,255,255,0.04)",
  `${G}18`, `${G}30`, `${G}50`, `${G}70`, `${G}90`, G,
]

function heatColor(val: number) {
  if (val <= 5)  return HEATMAP_COLORS[0]
  if (val <= 20) return HEATMAP_COLORS[1]
  if (val <= 40) return HEATMAP_COLORS[2]
  if (val <= 60) return HEATMAP_COLORS[3]
  if (val <= 80) return HEATMAP_COLORS[4]
  if (val <= 100)return HEATMAP_COLORS[5]
  return HEATMAP_COLORS[6]
}

const JOURS_LABELS = ["L","M","M","J","V","S","D"]

export function VueGlobalePage() {
  const score = HEALTH_SCORE.global

  return (
    <div className="flex flex-col gap-5">

      {/* ── Health Score + KPIs ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Health Score */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="rounded-2xl p-5 flex flex-col items-center justify-center gap-3 md:col-span-1"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="relative size-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="none" stroke={G} strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 40 * score / 100} ${2 * Math.PI * 40}`}
                strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-black text-white">{score}</span>
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>/100</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-[10px] font-black text-white">Health Score</div>
            <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Score global plateforme</div>
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            {[
              { lbl: "Finance",   val: HEALTH_SCORE.finance,  color: EM },
              { lbl: "RH",        val: HEALTH_SCORE.rh,       color: BL },
              { lbl: "Services",  val: HEALTH_SCORE.services, color: PR },
              { lbl: "Infra",     val: HEALTH_SCORE.infra,    color: AM },
            ].map(m => (
              <div key={m.lbl} className="flex items-center gap-2">
                <div className="text-[7.5px] w-12 flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>{m.lbl}</div>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${m.val}%`, background: m.color }} />
                </div>
                <div className="text-[7.5px] font-bold w-6 text-right" style={{ color: m.color }}>{m.val}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* KPIs Grid */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3">
          {KPIS_GLOBAUX.map((kpi, i) => {
            const Icon = ICON_MAP[kpi.icon] ?? Activity
            return (
              <motion.div key={kpi.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 1) * 0.05 }}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between">
                  <div className="rounded-xl p-2" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}25` }}>
                    <Icon size={13} style={{ color: kpi.color }} />
                  </div>
                  {kpi.positif !== null && (
                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: kpi.positif ? `${EM}12` : `${RD}12`, color: kpi.positif ? EM : RD }}>
                      {kpi.delta}
                    </span>
                  )}
                </div>
                <div>
                  <div className="text-[18px] font-black text-white leading-none truncate">{kpi.value}</div>
                  <div className="text-[8.5px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{kpi.label}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Radar scores modules */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Scores par module</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Performance vs objectif — exercice 2025</div>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={SCORE_MODULES} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="module" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 9 }} />
                <Radar name="Score" dataKey="score" stroke={G} fill={G} fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Objectif" dataKey="objectif" stroke={BL} fill={BL} fillOpacity={0.05} strokeWidth={1.5} strokeDasharray="4 2" />
                <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
                  labelStyle={{ color: "rgba(255,255,255,0.6)" }} itemStyle={{ color: "white" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 text-[8px]">
            {[{c:G,l:"Score actuel"},{c:BL,l:"Objectif"}].map(x => (
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: x.c }} />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{x.l}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tendance consolidée */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Activité consolidée 12 mois</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Recettes (GNF) · Effectifs · Inscriptions</div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={SERIE_CONSOLIDEE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="grRec" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={G}  stopOpacity={0.25} />
                  <stop offset="95%" stopColor={G}  stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="grInsc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={PR} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={PR} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="mois" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }} itemStyle={{ color: "white" }} />
              <Area type="monotone" dataKey="recettes"    stroke={G}  fill="url(#grRec)"  strokeWidth={2} dot={false} name="Recettes" />
              <Area type="monotone" dataKey="inscriptions" stroke={PR} fill="url(#grInsc)" strokeWidth={1.5} dot={false} name="Inscriptions" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 text-[8px]">
            {[{c:G,l:"Recettes"},{c:PR,l:"Inscriptions"}].map(x => (
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: x.c }} />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{x.l}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Heatmap activité ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-black text-white">Activité plateforme — 12 semaines</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Connexions & actions par jour</div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Moins</span>
            {HEATMAP_COLORS.map((c, i) => (
              <div key={i} className="size-2.5 rounded-sm" style={{ background: c }} />
            ))}
            <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Plus</span>
          </div>
        </div>
        <div className="flex gap-1">
          {/* Jours labels */}
          <div className="flex flex-col gap-1 mr-1">
            {JOURS_LABELS.map((j, i) => (
              <div key={i} className="size-4 flex items-center justify-center text-[7px]"
                style={{ color: "rgba(255,255,255,0.25)" }}>{j}</div>
            ))}
          </div>
          {/* Grid */}
          <div className="flex gap-1 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
            {Array.from({ length: 12 }, (_, semaine) => (
              <div key={semaine} className="flex flex-col gap-1">
                {Array.from({ length: 7 }, (_, jour) => {
                  const cell = HEATMAP_ACTIVITE.find(c => c.semaine === semaine && c.jour === jour)
                  return (
                    <div key={jour} className="size-4 rounded-sm"
                      style={{ background: heatColor(cell?.valeur ?? 0) }}
                      title={`S${semaine + 1} ${JOURS_LABELS[jour]}: ${cell?.valeur ?? 0}`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Alertes globales ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-4 py-3" style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Points d'attention</div>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {[
            { icon: AlertTriangle, color: AM, msg: "2 contrats RH expirent avant septembre 2025" },
            { icon: AlertTriangle, color: RD, msg: "2 postes urgents ouverts — aucune offre finalisée" },
            { icon: AlertTriangle, color: AM, msg: "Taux recouvrement Sciences Éco : 63% — sous l'objectif 70%" },
            { icon: CheckCircle2,  color: EM, msg: "Santé : tous les certificats en attente ont été traités" },
            { icon: CheckCircle2,  color: EM, msg: "Infrastructure : score 91/100 — aucun incident ce mois" },
          ].map((a, i) => {
            const Icon = a.icon
            return (
              <div key={i} className="flex items-center gap-3 px-4 py-3"
                style={{ background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                <Icon size={11} style={{ color: a.color, flexShrink: 0 }} />
                <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.55)" }}>{a.msg}</span>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
