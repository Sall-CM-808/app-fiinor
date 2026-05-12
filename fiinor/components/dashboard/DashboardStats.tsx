"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Wallet, Users, GraduationCap, BookOpen,
  Bus, Heart, TrendingUp, TrendingDown,
} from "lucide-react"
import { useT } from "@/lib/useThemeTokens"

const STATS = [
  { module: "Finance",     icon: Wallet,        color: "#C9A84C", label: "Recettes mois",   value: "142.5M", unit: "GNF",     delta: "+8.3%", up: true  },
  { module: "RH",          icon: Users,         color: "#3B82F6", label: "Effectif actif",  value: "2 847",  unit: "agents",  delta: "+12",   up: true  },
  { module: "Pédagogie",   icon: GraduationCap, color: "#8B5CF6", label: "Taux admission",  value: "78.5",   unit: "%",       delta: "+2.1%", up: true  },
  { module: "Bibliothèque", icon: BookOpen,      color: "#F59E0B", label: "Emprunts actifs", value: "1 204",  unit: "livres",  delta: "-3.2%", up: false },
  { module: "Transport",   icon: Bus,           color: "#10B981", label: "Abonnés actifs",  value: "4 518",  unit: "élèves",  delta: "+5.7%", up: true  },
  { module: "Santé",       icon: Heart,         color: "#EF4444", label: "Visites ce mois", value: "312",    unit: "visites", delta: "+18",   up: false },
  { module: "Inscriptions",icon: TrendingUp,    color: "#F97316", label: "Inscriptions",    value: "6 890",  unit: "actives", delta: "+4.4%", up: true  },
  { module: "Cafétéria",   icon: TrendingDown,  color: "#06B6D4", label: "Repas servis",    value: "8 450",  unit: "/ sem.",  delta: "+1.2%", up: true  },
]

export function DashboardStats() {
  const t = useT()
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8"
    >
      {STATS.map((s, i) => {
        const Icon      = s.icon
        const DeltaIcon = s.up ? TrendingUp : TrendingDown
        return (
          <motion.div
            key={s.module}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 28 }}
            className="flex flex-col gap-2 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: t.surface1,
              borderTop: `2px solid ${s.color}`,
              borderRight: `1px solid ${t.border}`,
              borderBottom: `1px solid ${t.border}`,
              borderLeft: `1px solid ${t.border}`,
              boxShadow: `0 2px 10px ${t.borderFaint}`,
              padding: "10px 12px 10px",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="size-6 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}20` }}>
                <Icon size={12} style={{ color: s.color }} />
              </div>
              <div className="flex items-center gap-0.5" style={{ color: s.up ? t.emerald : t.red }}>
                <DeltaIcon size={8} />
                <span className="text-[8px] font-bold tabular-nums">{s.delta}</span>
              </div>
            </div>
            <div>
              <div className="text-[15px] font-black leading-none tabular-nums" style={{ color: t.textPrimary }}>{s.value}</div>
              <div className="text-[7.5px] mt-0.5" style={{ color: t.textFaint }}>{s.unit}</div>
            </div>
            <div className="text-[8px] font-medium" style={{ color: t.textMuted }}>{s.label}</div>
          </motion.div>
        )
      })}
    </motion.div>
  )
}
