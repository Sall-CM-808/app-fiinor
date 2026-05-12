"use client"

import { useRef } from "react"
import { useInView, useReducedMotion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

const data = [
  { an: "Année 1", inscriptions: 320000, cible: 300000 },
  { an: "Année 2", inscriptions: 450000, cible: 400000 },
  { an: "Année 3", inscriptions: 580000, cible: 520000 },
  { an: "Année 4", inscriptions: 720000, cible: 650000 },
  { an: "Année 5", inscriptions: 850000, cible: 780000 },
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
  return (
    <div className="rounded-xl border border-border/60 bg-[#1A2332]/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2">
          <span className="inline-block size-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-[11px] text-muted-foreground capitalize">
            {entry.dataKey === "inscriptions" ? "Effectif réel" : "Cible"}
          </span>
          <span className="ml-auto pl-4 text-[12px] font-bold tabular-nums text-foreground">
            {entry.value.toLocaleString("fr-FR")}
          </span>
        </div>
      ))}
    </div>
  )
}

export function EnrollmentChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()

  return (
    <Card ref={ref} className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Croissance des Inscriptions
            </CardTitle>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Évolution sur 5 ans — Réseau Fiinor
            </p>
          </div>
          <Badge className="shrink-0 gap-1 border-0 bg-[#10B981]/12 text-[11px] text-[#10B981]">
            <TrendingUp className="size-3" />
            +165%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-3">
        <div className="h-[180px] w-full overflow-hidden" aria-label="Graphique croissance des inscriptions sur 5 ans">
          <ResponsiveContainer width="99%" height={180}>
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }} accessibilityLayer>
              <defs>
                <linearGradient id="gradEmerald" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />

              <XAxis
                dataKey="an"
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
                width={38}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }}
              />

              {/* Cible (dashed, gold) */}
              <Area
                type="monotone"
                dataKey="cible"
                stroke="#C9A84C"
                strokeWidth={1.5}
                strokeDasharray="5 3"
                fill="url(#gradGold)"
                dot={false}
                isAnimationActive={!reduced && inView}
                animationDuration={1200}
                animationEasing="ease-out"
              />

              {/* Réel (solid, emerald) */}
              <Area
                type="monotone"
                dataKey="inscriptions"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#gradEmerald)"
                dot={{ r: 4, fill: "#10B981", stroke: "#0D1117", strokeWidth: 2 }}
                activeDot={{ r: 5, fill: "#10B981", stroke: "#fff", strokeWidth: 1.5 }}
                isAnimationActive={!reduced && inView}
                animationDuration={1400}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center gap-4 px-2">
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="inline-block h-[2px] w-5 rounded-full bg-[#10B981]" />
            Effectif réel
          </span>
          <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="inline-block h-[2px] w-5 rounded-full border-t border-dashed border-[#C9A84C]" />
            Objectif cible
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
