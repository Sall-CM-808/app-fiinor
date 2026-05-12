"use client"

import { useRef } from "react"
import { useInView, useReducedMotion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { mois: "Jan", salaires: 18200, infra: 7100, materiel: 4200 },
  { mois: "Fév", salaires: 19500, infra: 8300, materiel: 3800 },
  { mois: "Mar", salaires: 17800, infra: 6500, materiel: 5100 },
  { mois: "Avr", salaires: 20100, infra: 9200, materiel: 4600 },
  { mois: "Mai", salaires: 21000, infra: 10400, materiel: 5900 },
]

const BARS = [
  { key: "salaires", label: "Salaires", color: "#C9A84C" },
  { key: "infra", label: "Infrastructures", color: "#10B981" },
  { key: "materiel", label: "Matériel", color: "#3B82F6" },
]

interface TooltipEntry {
  dataKey: string
  value: number
  color: string
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  const total = payload.reduce((sum, e) => sum + (e.value ?? 0), 0)
  return (
    <div className="min-w-[160px] rounded-xl border border-border/60 bg-[#1A2332]/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[11px] text-muted-foreground">
            {BARS.find((b) => b.key === entry.dataKey)?.label}
          </span>
          <span className="ml-auto pl-3 text-[11px] font-bold tabular-nums text-foreground">
            {entry.value.toLocaleString("fr-FR")}
          </span>
        </div>
      ))}
      <div className="mt-1.5 flex justify-between border-t border-border/40 pt-1.5">
        <span className="text-[10px] text-muted-foreground">Total</span>
        <span className="text-[11px] font-bold text-gold">{total.toLocaleString("fr-FR")}</span>
      </div>
    </div>
  )
}

export function BudgetChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()

  return (
    <Card ref={ref} className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Allocation Budgétaire par Secteur
          </CardTitle>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Salaires · Infrastructures · Matériel — en milliers GNF
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-3">
        <div className="h-[180px] w-full overflow-hidden" aria-label="Graphique allocation budgétaire par secteur">
          <ResponsiveContainer width="99%" height={180}>
            <BarChart data={data} barCategoryGap="28%" barGap={3} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="mois"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                width={34}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />

              {BARS.map((b, idx) => (
                <Bar
                  key={b.key}
                  dataKey={b.key}
                  fill={b.color}
                  radius={idx === BARS.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                  isAnimationActive={!reduced && inView}
                  animationDuration={1000 + idx * 150}
                  animationEasing="ease-out"
                  stackId="a"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-2">
          {BARS.map((b) => (
            <span key={b.key} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="inline-block size-2 rounded-sm" style={{ backgroundColor: b.color }} />
              {b.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
