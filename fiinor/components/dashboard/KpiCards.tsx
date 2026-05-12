"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView, useMotionValue, animate, useReducedMotion } from "framer-motion"
import {
  Building2,
  Users,
  TrendingUp,
  Banknote,
  ArrowUpRight,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useT } from "@/lib/useThemeTokens"

/* ─── Animated counter hook ─── */
function useCountUp(target: number, duration = 1.6, inView = false, reduced = false) {
  const motionVal = useMotionValue(0)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduced) { setDisplay(target); return }
    const controls = animate(motionVal, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [inView, target, duration, motionVal, reduced])

  return display
}

/* ─── Motion variants ─── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 28 } },
}

/* shared card shell — fixed 96px height, horizontal layout */
function KpiShell({ color, children }: { color: string; children: React.ReactNode }) {
  const t = useT()
  return (
    <motion.div variants={cardVariants}>
      <Card
        className="relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
        style={{
          height: 96,
          background: t.surface1,
          borderTop: `1px solid ${t.border}`,
          borderRight: `1px solid ${t.border}`,
          borderBottom: `1px solid ${t.border}`,
          borderLeft: `3px solid ${color}`,
          boxShadow: `0 2px 12px ${t.borderFaint}, 0 1px 3px ${t.border}`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full blur-2xl"
          style={{ backgroundColor: `${color}18` }}
        />
        {children}
      </Card>
    </motion.div>
  )
}

/* ─── Card 1 : Total Établissements ─── */
function EstablissementsCard({ inView, reduced }: { inView: boolean; reduced: boolean }) {
  const count = useCountUp(120, 1.4, inView, reduced)
  const bars = [35, 48, 40, 60, 55, 70, 65, 80, 75, 88, 85, 100]
  return (
    <KpiShell color="#C9A84C">
      <div className="flex h-full items-stretch gap-0 px-3 py-2.5">
        {/* Left */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">
              Total Établissements
            </span>
            <Building2 className="size-3 text-[#C9A84C]" />
          </div>
          <div className="flex items-end gap-1.5">
            <span className="font-heading text-[1.4rem] font-bold leading-none text-foreground">{count}</span>
            <Badge className="mb-0.5 gap-0.5 border-0 bg-[#10B981]/15 px-1 py-0 text-[8px] font-semibold text-[#10B981]">
              <ArrowUpRight className="size-1.5" />+3.2%
            </Badge>
          </div>
          <span className="text-[9px] text-muted-foreground">Status trend · 12 mois</span>
        </div>
        {/* Right: sparkline */}
        <div className="ml-3 flex shrink-0 items-end gap-[2px]" style={{ height: 44, alignSelf: "flex-end", paddingBottom: 2 }}>
          {bars.map((h, i) => (
            <motion.div key={i}
              initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ delay: 0.3 + i * 0.025, duration: 0.2, ease: "easeOut" }}
              style={{
                height: `${h}%`, originY: 1, width: 4, borderRadius: 2, flexShrink: 0,
                background: i >= 9 ? "#C9A84C" : `rgba(201,168,76,${0.08 + (h / 100) * 0.3})`,
              }}
            />
          ))}
        </div>
      </div>
    </KpiShell>
  )
}

/* ─── Card 2 : Effectif Total ─── */
function EffectifCard({ inView, reduced }: { inView: boolean; reduced: boolean }) {
  const t     = useT()
  const count = useCountUp(850000, 1.8, inView, reduced)
  return (
    <KpiShell color="#3B82F6">
      <div className="flex h-full flex-col justify-between px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">Effectif Total</span>
          <Users className="size-3 text-[#3B82F6]" />
        </div>
        <div className="flex items-end gap-1.5">
          <span className="font-heading text-[1.4rem] font-bold leading-none text-foreground">{count.toLocaleString("fr-FR")}</span>
        </div>
        {/* Gender bars compact */}
        <div className="space-y-1">
          {[
            { label: "Garçons", pct: 57, color: "#C9A84C", delay: 0.4 },
            { label: "Filles",  pct: 43, color: "#3B82F6", delay: 0.52 },
          ].map((g) => (
            <div key={g.label} className="flex items-center gap-1.5">
              <span className="w-10 shrink-0 text-[8px] text-muted-foreground">{g.label}</span>
              <div className="relative h-[3px] flex-1 overflow-hidden rounded-full" style={{ background: t.borderFaint }}>
                <motion.div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: g.color }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${g.pct}%` } : { width: 0 }}
                  transition={{ delay: g.delay, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span className="w-5 shrink-0 text-right text-[8px] font-semibold text-foreground">{g.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </KpiShell>
  )
}

/* ─── Card 3 : Taux de Réussite ─── */
function TauxReussiteCard({ inView }: { inView: boolean }) {
  const t = useT()
  const [go, setGo] = useState(false)
  useEffect(() => { if (inView) setTimeout(() => setGo(true), 280) }, [inView])
  const R = 22, svgW = 62, svgH = 34, cx = svgW / 2, cy = svgH - 2
  const arc = Math.PI * R
  const filled = (78.5 / 100) * arc
  return (
    <KpiShell color="#10B981">
      <div className="flex h-full items-center gap-3 px-3 py-2.5">
        {/* Gauge SVG */}
        <div className="relative shrink-0">
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
            <path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
              fill="none" stroke={t.border} strokeWidth="5" strokeLinecap="round" />
            <motion.path d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
              fill="none" stroke="#10B981" strokeWidth="5" strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${arc}` }}
              animate={{ strokeDasharray: `${go ? filled : 0} ${arc}` }}
              transition={{ delay: 0.35, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center leading-none">
            <div className="text-[11px] font-bold text-[#10B981]">78.5%</div>
          </div>
        </div>
        {/* Text */}
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">Taux de Réussite Global</span>
          <TrendingUp className="size-3 text-[#10B981]" />
          <Badge className="mt-0.5 gap-0.5 border-0 bg-[#10B981]/15 px-1 py-0 text-[8px] font-semibold text-[#10B981]">
            <ArrowUpRight className="size-1.5" />+2.1% vs l&apos;an passé
          </Badge>
        </div>
      </div>
    </KpiShell>
  )
}

/* ─── Card 4 : Budget Exécuté ─── */
function BudgetCard({ inView }: { inView: boolean }) {
  const t   = useT()
  const pct = 12
  return (
    <KpiShell color="#F59E0B">
      <div className="flex h-full flex-col justify-between px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">Budget Exécuté</span>
          <Banknote className="size-3 text-[#F59E0B]" />
        </div>
        <div className="flex items-end gap-1.5">
          <span className="font-heading text-[1.4rem] font-bold leading-none text-foreground">{pct}%</span>
          <span className="mb-0.5 text-[9px] text-muted-foreground">de 1.2 Mds GNF</span>
        </div>
        {/* Progress */}
        <div>
          <div className="relative h-[3px] w-full overflow-hidden rounded-full" style={{ background: t.borderFaint }}>
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#F59E0B]"
              initial={{ width: 0 }}
              animate={inView ? { width: `${pct}%` } : { width: 0 }}
              transition={{ delay: 0.4, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="mt-1 grid grid-cols-3 gap-1">
            {[
              { label: "Salaires", val: "62%", color: "#C9A84C" },
              { label: "Infra",    val: "24%", color: "#3B82F6" },
              { label: "Matériel", val: "14%", color: "#10B981" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-0.5">
                <span className="text-[8px] text-muted-foreground">{item.label}</span>
                <span className="text-[8px] font-semibold" style={{ color: item.color }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </KpiShell>
  )
}

/* ─── Main export ─── */
export function KpiCards() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  const reduced = useReducedMotion() ?? false

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="grid grid-cols-2 gap-3 xl:grid-cols-4"
    >
      <EstablissementsCard inView={inView} reduced={reduced} />
      <EffectifCard inView={inView} reduced={reduced} />
      <TauxReussiteCard inView={inView} />
      <BudgetCard inView={inView} />
    </motion.div>
  )
}
