"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  GraduationCap,
  Users,
  TrendingUp,
  MapPin,
  Building2,
  Star,
  ExternalLink,
} from "lucide-react"

const establishments = [
  {
    id: "conakry",
    name: "Lycée Moderne Conakry",
    short: "LMC",
    city: "Conakry",
    country: "Guinée",
    flag: "🇬🇳",
    type: "Lycée",
    students: 12400,
    teachers: 248,
    score: 96.5,
    trend: "+2.3%",
    trendUp: true,
    color: "#C9A84C",
    bgGlow: "from-[#C9A84C]/20",
    founded: 1962,
    programs: ["Sciences", "Lettres", "Technique"],
    accreditation: "MESRS",
  },
  {
    id: "aether",
    name: "Aether Int. School",
    short: "AIS",
    city: "Dubaï",
    country: "Émirats Arabes",
    flag: "🇦🇪",
    type: "International",
    students: 3200,
    teachers: 87,
    score: 93.1,
    trend: "+1.2%",
    trendUp: true,
    color: "#8B5CF6",
    bgGlow: "from-[#8B5CF6]/20",
    founded: 2008,
    programs: ["IB", "Cambridge", "STEM"],
    accreditation: "IBO",
  },
  {
    id: "gam",
    name: "Université Gam Al Abdel Nasser",
    short: "UGAN",
    city: "Conakry",
    country: "Guinée",
    flag: "🇬🇳",
    type: "Université",
    students: 28000,
    teachers: 620,
    score: 88.5,
    trend: "+0.8%",
    trendUp: true,
    color: "#10B981",
    bgGlow: "from-[#10B981]/20",
    founded: 1962,
    programs: ["Médecine", "Droit", "Ingénierie", "Sciences"],
    accreditation: "ANAQ-Sup",
  },
  {
    id: "dakar",
    name: "Institut Supérieur Dakar",
    short: "ISD",
    city: "Dakar",
    country: "Sénégal",
    flag: "🇸🇳",
    type: "Institut",
    students: 8600,
    teachers: 195,
    score: 91.2,
    trend: "+1.8%",
    trendUp: true,
    color: "#3B82F6",
    bgGlow: "from-[#3B82F6]/20",
    founded: 1995,
    programs: ["Commerce", "IT", "Finance"],
    accreditation: "CAMES",
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  return (
    <svg width="56" height="56" className="shrink-0 -rotate-90">
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        opacity={0.85}
      />
    </svg>
  )
}

export function KeyEstablishments({ variant = "grid" }: { variant?: "grid" | "sidebar" }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  const gridClass = variant === "sidebar"
    ? "flex flex-col gap-2"
    : "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"

  const list = (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={gridClass}
    >
      {establishments.map((est) => (
        <motion.div key={est.id} variants={cardVariants} className="group/card relative">
          {variant === "sidebar" ? (
                /* ── Compact sidebar row ── */
                <div className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border/30 bg-card px-3 py-2.5 transition-all hover:border-border/60 hover:bg-muted/20">
                  {/* Color accent */}
                  <div className="h-9 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: est.color }} />
                  {/* Initials */}
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
                    style={{ backgroundColor: `${est.color}18`, color: est.color }}
                  >
                    {est.short.slice(0, 2)}
                  </div>
                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-foreground">{est.name}</div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <span>{est.flag}</span>
                      <MapPin className="size-2.5" />
                      {est.city}
                    </div>
                  </div>
                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <div className="text-[13px] font-bold" style={{ color: est.color }}>{est.score}</div>
                    <div className="text-[9px] text-muted-foreground">score</div>
                  </div>
                </div>
          ) : (
            /* ── Full grid card ── */
            <Card
                  className="group relative cursor-pointer overflow-hidden border-border/40 bg-card transition-all duration-300 hover:-translate-y-0.5 hover:border-border/70 hover:shadow-xl hover:shadow-black/30"
                >
                  {/* Gradient glow top */}
                  <div
                    className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${est.bgGlow} to-transparent opacity-60`}
                  />

                  <CardContent className="relative p-4">
                    {/* Top row: initials badge + score ring */}
                    <div className="flex items-start justify-between">
                      <div
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl text-[13px] font-bold tracking-tight"
                        style={{ backgroundColor: `${est.color}20`, color: est.color }}
                      >
                        {est.short.slice(0, 2)}
                      </div>
                      <div className="relative">
                        <ScoreRing score={est.score} color={est.color} />
                        <span
                          className="absolute inset-0 flex items-center justify-center rotate-90 text-[10px] font-bold"
                          style={{ color: est.color }}
                        >
                          {est.score}
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="mt-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{est.flag}</span>
                        <Badge
                          className="h-4 border-0 px-1.5 text-[9px] font-medium"
                          style={{ backgroundColor: `${est.color}18`, color: est.color }}
                        >
                          {est.type}
                        </Badge>
                      </div>
                      <h3 className="mt-1 text-[13px] font-semibold leading-tight text-foreground">
                        {est.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                        <MapPin className="size-2.5" />
                        {est.city}
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-lg bg-muted/30 px-2 py-1.5">
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                          <Users className="size-2.5" /> Étudiants
                        </div>
                        <div className="mt-0.5 text-[12px] font-bold text-foreground">
                          {est.students.toLocaleString("fr-FR")}
                        </div>
                      </div>
                      <div className="rounded-lg bg-muted/30 px-2 py-1.5">
                        <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                          <TrendingUp className="size-2.5" /> Tendance
                        </div>
                        <div
                          className="mt-0.5 text-[12px] font-bold"
                          style={{ color: est.trendUp ? "#10B981" : "#EF4444" }}
                        >
                          {est.trend}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
          )}

          {/* CSS-only tooltip — no portal, no SSR mismatch */}
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 scale-95 rounded-xl border border-border/60 bg-[#1A2332]/98 p-3.5 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 group-hover/card:pointer-events-auto group-hover/card:scale-100 group-hover/card:opacity-100">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Building2 className="size-2.5" />{est.accreditation} · {est.founded}
                </div>
                <h4 className="mt-0.5 text-[12px] font-semibold text-foreground">{est.name}</h4>
              </div>
              <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-[9px] text-muted-foreground">
                <span>Score</span>
                <span style={{ color: est.color }}>{est.score}/100</span>
              </div>
              <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full" style={{ width: `${est.score}%`, backgroundColor: est.color }} />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1.5">
              {[
                { icon: Users, label: "Étudiants", val: est.students.toLocaleString("fr-FR") },
                { icon: GraduationCap, label: "Profs", val: est.teachers.toString() },
                { icon: Star, label: "Tendance", val: est.trend },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-white/5 p-1.5 text-center">
                  <s.icon className="mx-auto mb-0.5 size-2.5 text-muted-foreground" />
                  <div className="text-[10px] font-bold text-foreground">{s.val}</div>
                  <div className="text-[8px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {est.programs.map((p) => (
                <span key={p} className="rounded px-1.5 py-0.5 text-[9px]" style={{ backgroundColor: `${est.color}18`, color: est.color }}>{p}</span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )

  if (variant === "sidebar") {
    return (
      <Card ref={ref} className="border-border/50 bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Établissements Clés
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3">{list}</CardContent>
      </Card>
    )
  }

  return <div ref={ref}>{list}</div>
}
