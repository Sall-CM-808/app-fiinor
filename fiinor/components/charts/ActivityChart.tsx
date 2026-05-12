"use client"

import { useRef, useState } from "react"
import { useInView, useReducedMotion } from "framer-motion"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

const G  = "#C9A84C"
const EM = "#10B981"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const AM = "#F59E0B"

const DATA = [
  { h: "00h", finance: 12, rh: 4,  services: 8,  pedagogie: 2  },
  { h: "02h", finance: 5,  rh: 2,  services: 3,  pedagogie: 1  },
  { h: "04h", finance: 3,  rh: 1,  services: 2,  pedagogie: 0  },
  { h: "06h", finance: 8,  rh: 5,  services: 14, pedagogie: 3  },
  { h: "08h", finance: 45, rh: 28, services: 62, pedagogie: 19 },
  { h: "09h", finance: 78, rh: 54, services: 95, pedagogie: 38 },
  { h: "10h", finance: 92, rh: 67, services: 110,pedagogie: 52 },
  { h: "11h", finance: 85, rh: 73, services: 98, pedagogie: 61 },
  { h: "12h", finance: 68, rh: 45, services: 72, pedagogie: 44 },
  { h: "13h", finance: 55, rh: 38, services: 65, pedagogie: 35 },
  { h: "14h", finance: 88, rh: 62, services: 105,pedagogie: 58 },
  { h: "15h", finance: 95, rh: 70, services: 118,pedagogie: 67 },
  { h: "16h", finance: 72, rh: 58, services: 88, pedagogie: 49 },
  { h: "17h", finance: 48, rh: 32, services: 55, pedagogie: 28 },
  { h: "18h", finance: 22, rh: 15, services: 28, pedagogie: 12 },
  { h: "20h", finance: 15, rh: 8,  services: 18, pedagogie: 6  },
  { h: "22h", finance: 18, rh: 6,  services: 12, pedagogie: 4  },
]

const SERIES = [
  { key: "finance",   label: "Finance",   color: G  },
  { key: "rh",        label: "RH",        color: BL },
  { key: "services",  label: "Services",  color: EM },
  { key: "pedagogie", label: "Pédagogie", color: PR },
]

interface TooltipEntry {
  dataKey: string
  value: number
  color: string
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean; payload?: TooltipEntry[]; label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-[#0D1117]/95 px-3 py-2.5 shadow-2xl backdrop-blur-sm min-w-[160px]">
      <p className="text-[9px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
      {payload.map(e => {
        const s = SERIES.find(s => s.key === e.dataKey)
        return (
          <div key={e.dataKey} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full" style={{ background: e.color }} />
              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{s?.label}</span>
            </div>
            <span className="text-[11px] font-bold tabular-nums text-white">{e.value}</span>
          </div>
        )
      })}
    </div>
  )
}

export function ActivityChart() {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const [hidden, setHidden] = useState<string[]>([])

  function toggleSerie(key: string) {
    setHidden(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  return (
    <Card ref={ref} className="border-border/50 bg-card md:col-span-2 xl:col-span-1">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="size-3" style={{ color: G }} />
              <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Activité temps réel — Aujourd&apos;hui
              </CardTitle>
            </div>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Actions par module · Mise à jour toutes les 5 min
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div className="size-1.5 rounded-full animate-pulse" style={{ background: EM }} />
            <span className="text-[8.5px] font-bold" style={{ color: EM }}>Live</span>
          </div>
        </div>

        {/* Légende interactive */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SERIES.map(s => {
            const isHidden = hidden.includes(s.key)
            return (
              <button key={s.key} onClick={() => toggleSerie(s.key)}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[8.5px] font-bold transition-all"
                style={{
                  background: isHidden ? "rgba(255,255,255,0.04)" : `${s.color}12`,
                  color: isHidden ? "rgba(255,255,255,0.2)" : s.color,
                  border: `1px solid ${isHidden ? "rgba(255,255,255,0.06)" : s.color + "25"}`,
                }}>
                <span className="size-1.5 rounded-full" style={{ background: isHidden ? "rgba(255,255,255,0.15)" : s.color }} />
                {s.label}
              </button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 pb-3">
        <div className="h-[180px] w-full" aria-label="Graphique activité temps réel">
          <ResponsiveContainer width="99%" height={180}>
            <LineChart data={DATA} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="h" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} dy={4} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
              {SERIES.map(s => (
                <Line key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={hidden.includes(s.key) ? 0 : 2}
                  dot={false}
                  activeDot={{ r: 4, fill: s.color, stroke: "#0D1117", strokeWidth: 2 }}
                  isAnimationActive={!reduced && inView}
                  animationDuration={1200}
                  hide={hidden.includes(s.key)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
