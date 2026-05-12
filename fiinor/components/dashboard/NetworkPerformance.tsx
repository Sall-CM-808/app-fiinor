"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const networks = [
  {
    name: "Groupe Conakry",
    region: "Guinée",
    rendement: 98.5,
    satisfaction: 98,
    delta: 29,
    deltaSign: "up" as const,
    color: "#C9A84C",
    flag: "🇬🇳",
  },
  {
    name: "Groupe Abidjan",
    region: "Côte d'Ivoire",
    rendement: 95.9,
    satisfaction: 95,
    delta: 5,
    deltaSign: "up" as const,
    color: "#3B82F6",
    flag: "🇨🇮",
  },
  {
    name: "Réseau Dakar",
    region: "Sénégal",
    rendement: 88.5,
    satisfaction: 92,
    delta: 3,
    deltaSign: "up" as const,
    color: "#10B981",
    flag: "🇸🇳",
  },
  {
    name: "Collèges Amériques",
    region: "USA / Canada",
    rendement: 83.9,
    satisfaction: 90,
    delta: 4,
    deltaSign: "up" as const,
    color: "#EF4444",
    flag: "🇺🇸",
  },
]

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      type: "spring" as const,
      stiffness: 300,
      damping: 28,
    },
  }),
}

function DeltaBadge({ delta, sign }: { delta: number; sign: "up" | "down" | "flat" }) {
  if (sign === "up")
    return (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#10B981]">
        <TrendingUp className="size-3" />+{delta}
      </span>
    )
  if (sign === "down")
    return (
      <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#EF4444]">
        <TrendingDown className="size-3" />-{delta}
      </span>
    )
  return (
    <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
      <Minus className="size-3" />
      {delta}
    </span>
  )
}

export function NetworkPerformance() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <Card ref={ref} className="border-border/50 bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Performance par Réseau
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-1.5 px-4 pb-4">
        {networks.map((net, i) => (
          <motion.div
            key={net.name}
            custom={i}
            variants={rowVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border border-border/30 bg-muted/10 px-3 py-2.5 transition-colors hover:bg-muted/30"
          >
            {/* Left: color accent + name */}
            <div className="flex items-center gap-2.5">
              <div
                className="h-8 w-[3px] shrink-0 rounded-full"
                style={{ backgroundColor: net.color }}
              />
              <div className="w-36 shrink-0">
                <div className="text-[12px] font-semibold leading-tight text-foreground">
                  {net.name}
                </div>
                <div className="text-[10px] text-muted-foreground">{net.region}</div>
              </div>
            </div>

            {/* Center: progress bars */}
            <div className="space-y-1.5">
              {/* Rendement */}
              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-[10px] text-muted-foreground">Rendement</span>
                <div className="relative h-[5px] flex-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{ backgroundColor: net.color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${net.rendement}%` } : { width: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[11px] font-semibold tabular-nums text-foreground">
                  {net.rendement}
                </span>
              </div>
              {/* Satisfaction */}
              <div className="flex items-center gap-2">
                <span className="w-16 shrink-0 text-[10px] text-muted-foreground">Satisfaction</span>
                <div className="relative h-[5px] flex-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full bg-[#10B981]"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${net.satisfaction}%` } : { width: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-[11px] font-semibold tabular-nums text-[#10B981]">
                  {net.satisfaction}%
                </span>
              </div>
            </div>

            {/* Right: delta */}
            <DeltaBadge delta={net.delta} sign={net.deltaSign} />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
