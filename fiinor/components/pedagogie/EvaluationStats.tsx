"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp, TrendingDown, Users, Target,
  Award, BarChart2, LineChart as LineChartIcon, ChevronUp, ChevronDown,
} from "lucide-react"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from "recharts"
import type { Evaluation } from "./EvaluationsList"

/* ─── Mock progression data (past 6 evals same matière) ─── */
function mockProgression(matiere: string) {
  return [
    { eval: "DS1",    moy: 11.2, min: 4,  max: 18.5 },
    { eval: "DS2",    moy: 12.8, min: 6,  max: 19   },
    { eval: "TP1",    moy: 14.1, min: 9,  max: 20   },
    { eval: "DS3",    moy: 10.5, min: 3,  max: 17   },
    { eval: "Examen", moy: 13.4, min: 7,  max: 19.5 },
    { eval: "Actuel", moy: 12.6, min: 5,  max: 18   },
  ]
}

/* ─── Generate mock note distribution from evaluation ─── */
function mockNotes(ev: Evaluation): number[] {
  const seed = ev.id.charCodeAt(ev.id.length - 1)
  const arr: number[] = []
  for (let i = 0; i < ev.nbEleves - Math.floor(ev.nbEleves * 0.1); i++) {
    const base = ((seed * (i + 7) * 13) % 1000) / 1000
    const note = parseFloat((base * ev.noteMax * 1.05).toFixed(2))
    arr.push(Math.min(note, ev.noteMax))
  }
  return arr
}

function buildDistribution(notes: number[], noteMax: number) {
  const step = noteMax / 5
  const bins = Array.from({ length: 5 }, (_, i) => ({
    range: `${(i * step).toFixed(0)}–${((i + 1) * step).toFixed(0)}`,
    count: 0,
    pct: 0,
  }))
  notes.forEach(n => {
    const idx = Math.min(Math.floor(n / step), 4)
    bins[idx].count++
  })
  bins.forEach(b => { b.pct = notes.length ? Math.round((b.count / notes.length) * 100) : 0 })
  return bins
}

/* ─── KPI card ─── */
const cardV = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, type: "spring" as const, stiffness: 300, damping: 26 } }),
}

function KpiCard({ label, value, sub, color, icon: Icon, trend }: {
  label: string; value: string; sub: string; color: string; icon: React.ElementType; trend?: "up" | "down" | null
}) {
  return (
    <motion.div variants={cardV} className="rounded-2xl px-5 py-4 flex items-center gap-4 relative overflow-hidden"
      style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="pointer-events-none absolute -right-3 -top-3 size-16 rounded-full blur-2xl opacity-30"
        style={{ background: color }} />
      <div className="size-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
        <Icon className="size-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[8px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[22px] font-bold leading-none tabular-nums" style={{ color }}>{value}</span>
          {trend && (
            trend === "up"
              ? <ChevronUp className="size-3.5" style={{ color: "#10B981" }} />
              : <ChevronDown className="size-3.5" style={{ color: "#EF4444" }} />
          )}
        </div>
        <div className="text-[9px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{sub}</div>
      </div>
    </motion.div>
  )
}

/* ─── Custom Tooltip ─── */
function DarkTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2 text-[10px]"
      style={{ background: "#050d18", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
      <div className="font-bold mb-1.5 text-white">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-1.5 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{p.name}</span>
          <span className="font-bold tabular-nums ml-2" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Podium table ─── */
function PodiumRow({ rank, name, note, noteMax, isTop }: {
  rank: number; name: string; note: number; noteMax: number; isTop: boolean
}) {
  const pct = (note / noteMax) * 100
  const color = isTop ? "#10B981" : "#EF4444"
  return (
    <motion.div initial={{ opacity: 0, x: isTop ? -8 : 8 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.06 }}
      className="flex items-center gap-3 rounded-xl px-3 py-2"
      style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
      <span className="text-[10px] font-bold w-4 text-center tabular-nums" style={{ color: "rgba(255,255,255,0.3)" }}>
        {rank}
      </span>
      <div className="size-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
        style={{ background: `${color}15`, color }}>
        {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
      </div>
      <span className="flex-1 text-[10px] font-semibold text-white truncate">{name}</span>
      <div className="flex items-center gap-2">
        <div className="w-20 rounded-full overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 9999 }} />
        </div>
        <span className="text-[11px] font-bold tabular-nums w-10 text-right" style={{ color }}>{note.toFixed(1)}</span>
      </div>
    </motion.div>
  )
}

/* ─── Main ─── */
export function EvaluationStats({ evaluation }: { evaluation: Evaluation }) {
  const notes = useMemo(() => mockNotes(evaluation), [evaluation])
  const distribution = useMemo(() => buildDistribution(notes, evaluation.noteMax), [notes, evaluation.noteMax])
  const progression = useMemo(() => mockProgression(evaluation.matiere), [evaluation.matiere])

  const moyenne = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length) : 0
  const noteMin = notes.length ? Math.min(...notes) : 0
  const noteMax = notes.length ? Math.max(...notes) : 0
  const taux = notes.length ? Math.round(notes.filter(n => n >= evaluation.noteMax / 2).length / notes.length * 100) : 0
  const nbAbsents = evaluation.nbEleves - notes.length

  const DIST_COLORS = ["#EF4444", "#F59E0B", "#C9A84C", "#3B82F6", "#10B981"]

  /* Top 5 & Bottom 5 */
  const sorted = [...notes].sort((a, b) => b - a)
  const MOCK_NAMES = ["Alpha Diallo","Mariama Barry","Ibrahima Bah","Fatoumata Camara","Ousmane Kouyaté",
    "Kadiatou Sylla","Seydou Traoré","Aminata Conté","Lansana Souaré","Cheick Baldé"]
  const top5 = sorted.slice(0, 5).map((n, i) => ({ name: MOCK_NAMES[i] ?? `Élève ${i + 1}`, note: n }))
  const bottom5 = sorted.slice(-5).reverse().map((n, i) => ({ name: MOCK_NAMES[i + 5] ?? `Élève ${i + 6}`, note: n }))

  return (
    <div className="flex flex-col gap-5">

      {/* ── KPI row ── */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="visible">
        <KpiCard label="Moyenne classe" value={moyenne.toFixed(2)} sub={`sur ${evaluation.noteMax} pts`} color="#C9A84C" icon={BarChart2} trend="up" />
        <KpiCard label="Taux de réussite" value={`${taux}%`} sub={`≥ ${evaluation.noteMax / 2} pts`} color={taux >= 50 ? "#10B981" : "#EF4444"} icon={Target} trend={taux >= 50 ? "up" : "down"} />
        <KpiCard label="Note max" value={noteMax.toFixed(1)} sub={`Min: ${noteMin.toFixed(1)}`} color="#10B981" icon={TrendingUp} />
        <KpiCard label="Absents" value={String(nbAbsents)} sub={`${notes.length} présents`} color="#F59E0B" icon={Users} />
      </motion.div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Distribution */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <BarChart2 className="size-3.5" style={{ color: "#C9A84C" }} />
              <span className="text-[11px] font-bold text-white">Distribution des notes</span>
            </div>
            <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Répartition par tranche · {notes.length} élèves
            </p>
          </div>
          <div className="p-4" style={{ height: 220, minHeight: 220 }}>
            <ResponsiveContainer width="100%" height={188}>
              <BarChart data={distribution} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="range" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                <Bar dataKey="count" name="Élèves" radius={[4, 4, 0, 0]}>
                  {distribution.map((_, i) => (
                    <Cell key={i} fill={DIST_COLORS[i]} fillOpacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Mini legend */}
          <div className="px-4 pb-4 flex gap-2 flex-wrap">
            {distribution.map((b, i) => (
              <div key={b.range} className="flex items-center gap-1">
                <div className="size-2 rounded-sm" style={{ background: DIST_COLORS[i] }} />
                <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {b.range}: <strong style={{ color: DIST_COLORS[i] }}>{b.pct}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progression */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <LineChartIcon className="size-3.5" style={{ color: "#3B82F6" }} />
              <span className="text-[11px] font-bold text-white">Progression — {evaluation.matiere}</span>
            </div>
            <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Évolution des moyennes sur les 6 dernières évaluations
            </p>
          </div>
          <div className="p-4" style={{ height: 220, minHeight: 220 }}>
            <ResponsiveContainer width="100%" height={188}>
              <LineChart data={progression}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="eval" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, evaluation.noteMax]} tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <ReferenceLine y={evaluation.noteMax / 2} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" label={{ value: "Seuil", fill: "rgba(239,68,68,0.5)", fontSize: 8 }} />
                <Line type="monotone" dataKey="moy" name="Moyenne" stroke="#C9A84C" strokeWidth={2}
                  dot={{ fill: "#C9A84C", r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: "#E8C97A" }} />
                <Line type="monotone" dataKey="max" name="Max" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 2"
                  dot={false} />
                <Line type="monotone" dataKey="min" name="Min" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 2"
                  dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="px-4 pb-4 flex gap-4">
            {[{ color: "#C9A84C", label: "Moyenne" }, { color: "#10B981", label: "Max" }, { color: "#EF4444", label: "Min" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 rounded" style={{ background: l.color }} />
                <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Podium ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <Award className="size-3.5" style={{ color: "#10B981" }} />
              <span className="text-[11px] font-bold text-white">Top 5</span>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {top5.map((s, i) => (
              <PodiumRow key={i} rank={i + 1} name={s.name} note={s.note} noteMax={evaluation.noteMax} isTop={true} />
            ))}
          </div>
        </div>

        {/* Bottom 5 */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <TrendingDown className="size-3.5" style={{ color: "#EF4444" }} />
              <span className="text-[11px] font-bold text-white">À accompagner</span>
            </div>
          </div>
          <div className="p-3 flex flex-col gap-2">
            {bottom5.map((s, i) => (
              <PodiumRow key={i} rank={i + 1} name={s.name} note={s.note} noteMax={evaluation.noteMax} isTop={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
