"use client"

import { motion } from "framer-motion"
import {
  Building2, Users, GraduationCap, Wallet,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Activity, CheckCircle2, BarChart3, BookOpen,
  Bus, Heart, ChevronRight, Bell, Search,
} from "lucide-react"
import Link from "next/link"
import { useT } from "@/lib/useThemeTokens"

/* ── Données ──────────────────────────────────────────────── */
const KPIS = [
  {
    label: "Établissements",
    value: "120",
    delta: "+3.2%",
    up: true,
    icon: Building2,
    accent: "#1d8b93",
  },
  {
    label: "Effectif total",
    value: "850 000",
    delta: "+1.4%",
    up: true,
    icon: Users,
    accent: "#1d8b93",
  },
  {
    label: "Taux réussite",
    value: "78.5%",
    delta: "+2.1%",
    up: true,
    icon: GraduationCap,
    accent: "#b8d070",
  },
  {
    label: "Budget exécuté",
    value: "12%",
    delta: "-0.8%",
    up: false,
    icon: Wallet,
    accent: "#b8d070",
  },
]

const MODULES = [
  { label: "Finance",     value: "142.5M", unit: "GNF",     delta: "+8.3%", up: true,  color: "#1d8b93" },
  { label: "RH",          value: "2 847",  unit: "agents",  delta: "+12",   up: true,  color: "#1d8b93" },
  { label: "Pédagogie",   value: "78.5",   unit: "%",       delta: "+2.1%", up: true,  color: "#b8d070" },
  { label: "Services",    value: "4 518",  unit: "élèves",  delta: "+5.7%", up: true,  color: "#b8d070" },
  { label: "Bibliothèque",value: "1 204",  unit: "livres",  delta: "-3.2%", up: false, color: "#94a3b8" },
  { label: "Santé",       value: "312",    unit: "visites", delta: "+18",   up: true,  color: "#94a3b8" },
]

const ACTIVITIES = [
  { text: "Inscription validée — Lycée Excellence",  time: "il y a 2 min",  dot: "#b8d070" },
  { text: "Budget Q2 soumis — Direction Finances",   time: "il y a 8 min",  dot: "#1d8b93" },
  { text: "Nouveau rapport RH généré",               time: "il y a 15 min", dot: "#1d8b93" },
  { text: "Alerte transport — Route 7 retardée",     time: "il y a 22 min", dot: "#f0c245" },
  { text: "3 enseignants enregistrés aujourd'hui",   time: "il y a 35 min", dot: "#b8d070" },
]

/* ── Composant ──────────────────────────────────────────────── */
export default function DashboardV1() {
  const t = useT()

  return (
    <div
      className="min-h-screen flex flex-col gap-5 p-6"
      style={{ background: t.surface0, color: t.textPrimary }}
    >
      {/* ── Topbar ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            style={{ color: t.teal }}>
            Vue d'ensemble
          </p>
          <h1 className="font-heading text-2xl font-bold mt-0.5"
            style={{ color: t.textPrimary }}>
            Tableau de Bord
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: t.surface1, border: `1px solid ${t.border}` }}>
            <Search size={13} style={{ color: t.textMuted }} />
            <span className="text-[11px]" style={{ color: t.textMuted }}>Rechercher…</span>
          </div>
          {/* Bell */}
          <div className="relative flex size-8 items-center justify-center rounded-lg cursor-pointer"
            style={{ background: t.surface1, border: `1px solid ${t.border}` }}>
            <Bell size={14} style={{ color: t.textMuted }} />
            <span className="absolute top-1 right-1 size-1.5 rounded-full"
              style={{ background: "#b8d070" }} />
          </div>
          {/* User */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: t.surface1, border: `1px solid ${t.border}` }}>
            <div className="size-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: `linear-gradient(135deg, #1d8b93, #b8d070)` }}>DG</div>
            <span className="text-[11px] font-medium" style={{ color: t.textSecondary }}>
              Directeur Général
            </span>
          </div>
          {/* Lien retour */}
          <Link href="/dashboard"
            className="flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
            style={{ background: t.tealMuted, color: t.teal, border: `1px solid ${t.tealMuted}` }}>
            ← Version actuelle
          </Link>
        </div>
      </motion.div>

      {/* ── Statut système ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl w-fit"
        style={{ background: `${t.emerald}0A`, border: `1px solid ${t.emerald}20` }}
      >
        <CheckCircle2 size={12} style={{ color: t.emerald }} />
        <span className="text-[10px] font-semibold" style={{ color: t.emerald }}>
          6 modules opérationnels
        </span>
        <span className="mx-2 h-3 w-px" style={{ background: t.border }} />
        <Activity size={11} style={{ color: t.textMuted }} />
        <span className="text-[10px]" style={{ color: t.textMuted }}>Activité normale</span>
      </motion.div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPIS.map((k, i) => {
          const Icon = k.icon
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06, type: "spring", stiffness: 280, damping: 26 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{
                background: t.surface1,
                border: `1px solid ${t.border}`,
                boxShadow: `0 1px 8px ${t.borderFaint}`,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex size-8 items-center justify-center rounded-lg"
                  style={{ background: `${k.accent}12` }}>
                  <Icon size={15} style={{ color: k.accent }} />
                </div>
                <div className="flex items-center gap-0.5 text-[9px] font-semibold"
                  style={{ color: k.up ? t.emerald : t.red }}>
                  {k.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                  {k.delta}
                </div>
              </div>
              {/* Value */}
              <div>
                <div className="font-heading text-[1.6rem] font-bold leading-none tabular-nums"
                  style={{ color: t.textPrimary }}>
                  {k.value}
                </div>
                <div className="text-[10px] mt-1 font-medium" style={{ color: t.textMuted }}>
                  {k.label}
                </div>
              </div>
              {/* Bar */}
              <div className="h-0.5 rounded-full overflow-hidden" style={{ background: t.border }}>
                <div className="h-full rounded-full" style={{ width: "65%", background: k.accent }} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Main content: modules + activité ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Modules — 2/3 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: t.surface1, border: `1px solid ${t.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-heading text-sm font-bold" style={{ color: t.textPrimary }}>
                Modules — Indicateurs clés
              </h2>
              <p className="text-[10px] mt-0.5" style={{ color: t.textMuted }}>
                Performance ce mois
              </p>
            </div>
            <BarChart3 size={15} style={{ color: t.textMuted }} />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {MODULES.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 + i * 0.05 }}
                className="flex flex-col gap-1.5 rounded-xl p-3"
                style={{ background: t.surface2, border: `1px solid ${t.border}` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-semibold uppercase tracking-wider"
                    style={{ color: t.textMuted }}>
                    {m.label}
                  </span>
                  <span className="text-[8px] font-bold"
                    style={{ color: m.up ? t.emerald : t.red }}>
                    {m.up ? "↑" : "↓"} {m.delta}
                  </span>
                </div>
                <div className="font-heading text-lg font-bold leading-none tabular-nums"
                  style={{ color: t.textPrimary }}>
                  {m.value}
                </div>
                <div className="text-[8.5px]" style={{ color: t.textFaint }}>{m.unit}</div>
                <div className="mt-1 h-0.5 rounded-full overflow-hidden"
                  style={{ background: t.border }}>
                  <div className="h-full rounded-full"
                    style={{ width: m.up ? "70%" : "40%", background: m.color }} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Activité récente — 1/3 */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-5 flex flex-col"
          style={{ background: t.surface1, border: `1px solid ${t.border}` }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-sm font-bold" style={{ color: t.textPrimary }}>
              Activité récente
            </h2>
            <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: t.tealFaint, color: t.teal }}>
              Live
            </span>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {ACTIVITIES.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1 size-1.5 shrink-0 rounded-full" style={{ background: a.dot }} />
                <div className="flex flex-col gap-0.5 flex-1">
                  <p className="text-[10px] leading-snug" style={{ color: t.textSecondary }}>
                    {a.text}
                  </p>
                  <p className="text-[8.5px]" style={{ color: t.textFaint }}>{a.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-3" style={{ borderTop: `1px solid ${t.border}` }}>
            <button className="flex items-center gap-1 text-[10px] font-semibold transition-opacity hover:opacity-70"
              style={{ color: t.teal }}>
              Voir tout <ChevronRight size={11} />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
