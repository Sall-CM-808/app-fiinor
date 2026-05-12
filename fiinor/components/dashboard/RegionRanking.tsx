"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const regions = [
  {
    name: "Conakry",
    avgScore: 96.5,
    enrollment: "95.5%",
    teacherRatio: "2.00",
    deltaScore: "+35",
    deltaEnroll: "92%",
    rank: 1,
  },
  {
    name: "Labé",
    avgScore: 83.9,
    enrollment: "78.5%",
    teacherRatio: "2.00",
    deltaScore: "+35",
    deltaEnroll: "92%",
    rank: 2,
  },
  {
    name: "Kindia",
    avgScore: 86.5,
    enrollment: "95.5%",
    teacherRatio: "3.00",
    deltaScore: "+35",
    deltaEnroll: "92%",
    rank: 3,
  },
  {
    name: "Mamou",
    avgScore: 79.5,
    enrollment: "96.3%",
    teacherRatio: "3.00",
    deltaScore: "+35",
    deltaEnroll: "92%",
    rank: 4,
  },
  {
    name: "Faranah",
    avgScore: 63.5,
    enrollment: "86.5%",
    teacherRatio: "1.70",
    deltaScore: "+35",
    deltaEnroll: "92%",
    rank: 5,
  },
  {
    name: "Kankan",
    avgScore: 64.5,
    enrollment: "88.2%",
    teacherRatio: "1.70",
    deltaScore: "+35",
    deltaEnroll: "92%",
    rank: 6,
  },
  {
    name: "Nzérékoré",
    avgScore: 53.0,
    enrollment: "88.5%",
    teacherRatio: "2.00",
    deltaScore: "+35",
    deltaEnroll: "92%",
    rank: 7,
  },
]

function scoreColor(score: number) {
  if (score >= 90) return "#10B981"
  if (score >= 75) return "#C9A84C"
  if (score >= 60) return "#F59E0B"
  return "#EF4444"
}

function rankBadgeClass(rank: number) {
  if (rank === 1) return "bg-[#C9A84C]/20 text-gold border-0"
  if (rank === 2) return "bg-[#94A3B8]/20 text-[#94A3B8] border-0"
  if (rank === 3) return "bg-[#CD7F32]/20 text-[#CD7F32] border-0"
  return "bg-muted text-muted-foreground border-0"
}

const rowVariants = {
  hidden: { opacity: 0, x: 16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.07,
      type: "spring" as const,
      stiffness: 300,
      damping: 28,
    },
  }),
}

export function RegionRanking() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <Card ref={ref} className="border-border/50 bg-card">
      <CardHeader className="pb-1 pt-3">
        <CardTitle className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
          Classement par Région
        </CardTitle>
      </CardHeader>

      <CardContent className="px-3 pb-3">
        {/* Header row */}
        <div className="mb-1 grid grid-cols-[1.2rem_1fr_3rem_3rem_2.4rem] gap-1 px-1 text-[8px] uppercase tracking-wider text-muted-foreground/50">
          <span>#</span>
          <span>Région</span>
          <span className="text-right">Score</span>
          <span className="text-right">Enroll</span>
          <span className="text-right">T/S</span>
        </div>

        <div className="space-y-0.5">
          {regions.map((region, i) => (
            <motion.div
              key={region.name}
              custom={i}
              variants={rowVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="group grid grid-cols-[1.2rem_1fr_3rem_3rem_2.4rem] items-center gap-1 rounded-md px-1 py-1 transition-colors hover:bg-muted/40"
            >
              {/* Rank */}
              <Badge className={`h-4 w-4 items-center justify-center p-0 text-[8px] ${rankBadgeClass(region.rank)}`}>
                {region.rank}
              </Badge>

              {/* Name + score bar */}
              <div className="min-w-0">
                <div className="truncate text-[10px] font-medium text-foreground">
                  {region.name}
                </div>
                <div className="mt-0.5 h-[3px] w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: scoreColor(region.avgScore) }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${region.avgScore}%` } : { width: 0 }}
                    transition={{ delay: 0.4 + i * 0.06, duration: 0.7, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Score */}
              <span
                className="text-right text-[11px] font-bold tabular-nums"
                style={{ color: scoreColor(region.avgScore) }}
              >
                {region.avgScore}
              </span>

              {/* Enrollment */}
              <span className="text-right text-[10px] text-muted-foreground tabular-nums">
                {region.enrollment}
              </span>

              {/* Teacher/Student */}
              <span className="text-right text-[10px] text-muted-foreground tabular-nums">
                {region.teacherRatio}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between border-t border-border/30 pt-1.5 text-[8px] text-muted-foreground">
          <span>7 régions — Guinée</span>
          <span className="text-gold">Voir tout →</span>
        </div>
      </CardContent>
    </Card>
  )
}
