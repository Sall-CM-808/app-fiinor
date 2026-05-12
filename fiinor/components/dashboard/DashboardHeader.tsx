"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Activity, CheckCircle2, AlertTriangle, ChevronRight,
  FileBarChart2, Users, Wallet, CalendarDays,
} from "lucide-react"
import Link from "next/link"
import { useT } from "@/lib/useThemeTokens"

const MODULES_STATUS = [
  { nom: "Finance",    href: "/dashboard/finances",  ok: true  },
  { nom: "RH",         href: "/dashboard/rh",         ok: true  },
  { nom: "Services",   href: "/dashboard/services",   ok: true  },
  { nom: "Pédagogie",  href: "/dashboard/pedagogie",  ok: true  },
  { nom: "Rapports",   href: "/dashboard/rapports",   ok: true  },
  { nom: "Paramètres", href: "/dashboard/parametres", ok: true  },
]

const QUICK_ACTIONS = [
  { label: "Nouveau rapport",  href: "/dashboard/rapports",   icon: FileBarChart2, color: "#1d8b93" },
  { label: "Ajouter employé",  href: "/dashboard/rh",          icon: Users,         color: "#8B5CF6" },
  { label: "Transaction",      href: "/dashboard/finances",   icon: Wallet,        color: "#C9A84C" },
  { label: "Inscription",      href: "/dashboard/services",   icon: CalendarDays,  color: "#b8d070" },
]

function useClock() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export function DashboardHeader() {
  const t    = useT()
  const now  = useClock()
  const day  = now ? now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : ""
  const time = now ? now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "--:--:--"

  const allOk   = MODULES_STATUS.every(m => m.ok)
  const alerts  = MODULES_STATUS.filter(m => !m.ok).length

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="flex flex-col gap-3"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">

        {/* Left — titre + date */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full animate-pulse" style={{ background: t.emerald }} />
            <span className="font-heading text-[9px] font-bold uppercase tracking-widest" style={{ color: t.textFaint }}>
              Tableau de bord — Live
            </span>
          </div>
          <h1 className="font-heading text-[22px] font-black tracking-tight leading-none" style={{ color: t.textPrimary }}>
            Vue Générale
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[9px] capitalize" style={{ color: t.textMuted }}>{day}</span>
            <span className="text-[9px] font-mono tabular-nums" style={{ color: t.teal }}>{time}</span>
          </div>
        </div>

        {/* Right — statut système */}
        <div className="flex items-center gap-3">

          {/* Statut modules */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: allOk ? `${t.emerald}08` : `${t.red}08`, border: `1px solid ${allOk ? t.emerald + "20" : t.red + "20"}` }}>
            {allOk
              ? <CheckCircle2 size={11} style={{ color: t.emerald }} />
              : <AlertTriangle size={11} style={{ color: t.red }} />}
            <span className="text-[9px] font-bold" style={{ color: allOk ? t.emerald : t.red }}>
              {allOk ? "Tous les modules opérationnels" : `${alerts} module(s) en alerte`}
            </span>
          </div>

          {/* Pulse activité */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: t.tealFaint, border: `1px solid ${t.border}` }}>
            <Activity size={10} style={{ color: t.teal }} />
            <span className="text-[9px] font-bold" style={{ color: t.textSecondary }}>Activité normale</span>
          </div>
        </div>
      </div>

      {/* Modules pills + quick actions */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Modules */}
        <div className="flex items-center gap-1 flex-wrap">
          {MODULES_STATUS.map((m, i) => (
            <motion.div key={m.nom}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}>
              <Link href={m.href}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8.5px] font-bold transition-all hover:brightness-125"
                style={{
                  background: m.ok ? `${t.emerald}10` : `${t.red}10`,
                  color: m.ok ? t.emerald : t.red,
                  border: `1px solid ${m.ok ? t.emerald + "20" : t.red + "20"}`,
                }}>
                <span className="size-1.5 rounded-full" style={{ background: m.ok ? t.emerald : t.red }} />
                {m.nom}
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="h-4 w-px mx-1" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Quick actions */}
        {QUICK_ACTIONS.map((a, i) => {
          const Icon = a.icon
          return (
            <motion.div key={a.label}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + i * 0.04 }}>
              <Link href={a.href}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8.5px] font-bold transition-all hover:brightness-125"
                style={{ background: `${a.color}12`, color: a.color, border: `1px solid ${a.color}25` }}>
                <Icon size={9} />
                {a.label}
                <ChevronRight size={8} style={{ opacity: 0.5 }} />
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
