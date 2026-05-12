"use client"

import { useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { name: "Public", value: 52, color: "#C9A84C" },
  { name: "Privé", value: 31, color: "#10B981" },
  { name: "Communautaire", value: 17, color: "#3B82F6" },
]

interface TooltipPayloadItem {
  name: string
  value: number
  payload: { color: string }
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
}) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-border/60 bg-[#1A2332]/95 px-3 py-2.5 shadow-xl backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span
          className="inline-block size-2.5 rounded-full"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="text-[12px] font-semibold text-foreground">{item.name}</span>
        <span
          className="ml-3 text-[13px] font-bold tabular-nums"
          style={{ color: item.payload.color }}
        >
          {item.value}%
        </span>
      </div>
    </div>
  )
}

export function EducationModelChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <Card ref={ref} className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Répartition Modèle Éducatif
          </CardTitle>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Supérieur · Secondaire · Communautaire
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-3">
        <div className="flex items-center gap-4">
          {/* Donut */}
          <div
            className="h-[180px] w-[180px] shrink-0 overflow-hidden"
            aria-label="Graphique répartition modèle éducatif"
          >
            <ResponsiveContainer width={180} height={180}>
              <PieChart accessibilityLayer>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                  isAnimationActive={!reduced && inView}
                  animationBegin={reduced ? 0 : 200}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={
                        hoveredIndex === null || hoveredIndex === index ? 0.9 : 0.3
                      }
                      stroke="transparent"
                      style={{ outline: "none", transition: "opacity 0.2s" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Right: legend + mini-bars */}
          <div className="flex flex-1 flex-col justify-center gap-3">
            {data.map((item, i) => (
              <div
                key={item.name}
                className="cursor-default"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="flex items-center gap-2 text-[11px] font-medium transition-colors"
                    style={{
                      color:
                        hoveredIndex === null || hoveredIndex === i
                          ? "rgba(255,255,255,0.9)"
                          : "rgba(255,255,255,0.35)",
                    }}
                  >
                    <span
                      className="inline-block size-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    {item.name}
                  </span>
                  <span
                    className="text-[13px] font-bold tabular-nums"
                    style={{ color: item.color }}
                  >
                    {item.value}%
                  </span>
                </div>
                <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: inView ? `${item.value}%` : "0%",
                      backgroundColor: item.color,
                      opacity: hoveredIndex === null || hoveredIndex === i ? 0.9 : 0.3,
                      transitionDelay: `${0.3 + i * 0.12}s`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
