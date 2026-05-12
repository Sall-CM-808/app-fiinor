"use client"

import { motion } from "framer-motion"
import {
  Building2, Users, GraduationCap, Wallet,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  CheckCircle2, ChevronRight, Settings, BarChart3,
} from "lucide-react"
import Link from "next/link"
import { useT } from "@/lib/useThemeTokens"
import { useTheme } from "@/providers/ThemeProvider"

/* ── Métriques ──────────────────────────────────────────────── */
const METRICS = [
  { label: "Établissements",   value: "120",      sub: "actifs",     delta: "+3.2%", up: true,  icon: Building2,     span: 1 },
  { label: "Apprenants",       value: "850 000",  sub: "inscrits",   delta: "+1.4%", up: true,  icon: Users,         span: 2 },
  { label: "Taux de réussite", value: "78.5 %",   sub: "global",     delta: "+2.1%", up: true,  icon: GraduationCap, span: 1 },
  { label: "Budget exécuté",   value: "12 %",     sub: "de 1.2 Mds", delta: "-0.8%", up: false, icon: Wallet,        span: 1 },
  { label: "Agents RH",        value: "2 847",    sub: "en activité",delta: "+12",   up: true,  icon: TrendingUp,    span: 1 },
]

const BARS = [
  { label: "Finance",   pct: 74, colorDark: "#1d8b93", colorLight: "#1d8b93" },
  { label: "RH",        pct: 88, colorDark: "#b8d070", colorLight: "#8ab445" },
  { label: "Pédagogie", pct: 79, colorDark: "#1d8b93", colorLight: "#1d8b93" },
  { label: "Services",  pct: 91, colorDark: "#b8d070", colorLight: "#8ab445" },
  { label: "Transport", pct: 62, colorDark: "#94a3b8", colorLight: "#94a3b8" },
]

/* ── Composant ──────────────────────────────────────────────── */
export default function DashboardV2() {
  const t           = useT()
  const { theme }   = useTheme()
  const isLight     = theme === "light"

  /* Valeurs adaptées par mode */
  const pageBg      = isLight ? "#f0f4f5"   : t.surface0
  const cardBg      = isLight ? "#ffffff"   : t.surface1
  const cardBorder  = isLight ? "rgba(23,69,72,0.12)" : t.border
  const cardShadow  = isLight ? "0 1px 6px rgba(23,69,72,0.07), 0 0 0 1px rgba(23,69,72,0.06)" : "none"
  const trackBg     = isLight ? "#e2e8ea"   : "rgba(255,255,255,0.10)"
  const actionBg    = isLight ? "#f7fafa"   : t.surface2
  const actionBorder= isLight ? "rgba(23,69,72,0.10)" : t.border
  const primary     = t.textPrimary
  const muted       = t.textMuted
  const faint       = t.textFaint

  /* Lime en mode clair : version plus foncée pour texte lisible */
  const limeText    = isLight ? "#6a8c2a" : t.lime
  const emeraldText = isLight ? "#1e8a5e" : t.emerald
  const redText     = isLight ? "#b83030" : t.red

  return (
    <div
      className="min-h-screen p-6 md:p-8 flex flex-col gap-6"
      style={{ background: pageBg, color: primary }}
    >
      {/* ── Header ── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between gap-4 flex-wrap"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1"
            style={{ color: t.teal }}>
            FiiNOR · Conseil d'Administration
          </p>
          <h1 className="font-heading text-3xl font-black leading-none"
            style={{ color: primary }}>
            Vue Générale
          </h1>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-semibold"
            style={{
              background: isLight ? "#e8f8f0" : `${t.emerald}12`,
              border: `1px solid ${isLight ? "#a8dfc2" : t.emerald + "30"}`,
              color: emeraldText,
            }}
          >
            <CheckCircle2 size={10} />
            Tous modules opérationnels
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-[10px] font-semibold px-3 py-1.5 rounded-full transition-opacity hover:opacity-75"
            style={{
              background: isLight ? "#e2f2f3" : t.tealMuted,
              color: t.teal,
              border: `1px solid ${isLight ? "#b0d8dc" : "transparent"}`,
            }}
          >
            ← Version actuelle
          </Link>
        </div>
      </motion.header>

      {/* ── Grille métriques ── */}
      <div className="grid grid-cols-6 gap-3">
        {METRICS.map((m, i) => {
          const Icon    = m.icon
          const colSpan = m.span === 2 ? "col-span-2" : "col-span-1"
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, type: "spring", stiffness: 260, damping: 24 }}
              className={`${colSpan} rounded-2xl p-5 flex flex-col justify-between`}
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: cardShadow,
                minHeight: 120,
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex size-7 items-center justify-center rounded-lg"
                  style={{
                    background: isLight ? "rgba(29,139,147,0.08)" : "rgba(255,255,255,0.06)",
                  }}
                >
                  <Icon size={13} style={{ color: t.teal }} strokeWidth={1.5} />
                </div>
                <span
                  className="text-[9px] font-bold tabular-nums px-1.5 py-0.5 rounded-md"
                  style={{
                    color:      m.up ? emeraldText : redText,
                    background: m.up
                      ? isLight ? "#eaf7ef" : `${t.emerald}10`
                      : isLight ? "#faeaea" : `${t.red}10`,
                  }}
                >
                  {m.up ? "▲" : "▼"} {m.delta}
                </span>
              </div>
              <div>
                <div
                  className="font-heading text-[1.65rem] font-black leading-none tabular-nums"
                  style={{ color: primary }}
                >
                  {m.value}
                </div>
                <div className="text-[10px] mt-1 font-medium" style={{ color: muted }}>
                  {m.label}
                  <span className="ml-1" style={{ color: faint }}>— {m.sub}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Ligne basse ── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">

        {/* Taux d'exécution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="lg:col-span-3 rounded-2xl p-5"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-heading text-sm font-bold" style={{ color: primary }}>
                Taux d'exécution par module
              </h2>
              <p className="text-[9px] mt-0.5" style={{ color: faint }}>Données temps réel</p>
            </div>
            <BarChart3 size={14} style={{ color: muted }} />
          </div>

          <div className="flex flex-col gap-4">
            {BARS.map((b, i) => {
              const barColor = isLight ? b.colorLight : b.colorDark
              return (
                <div key={b.label} className="flex items-center gap-3">
                  <span className="w-20 text-[10px] font-semibold shrink-0" style={{ color: muted }}>
                    {b.label}
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: trackBg }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${b.pct}%` }}
                      transition={{ delay: 0.5 + i * 0.07, duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: barColor }}
                    />
                  </div>
                  <span
                    className="w-9 text-right text-[10px] font-bold tabular-nums shrink-0"
                    style={{ color: primary }}
                  >
                    {b.pct}%
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="lg:col-span-2 rounded-2xl p-5 flex flex-col gap-3"
          style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
        >
          <h2 className="font-heading text-sm font-bold mb-1" style={{ color: primary }}>
            Actions rapides
          </h2>

          {[
            { label: "Nouveau rapport", href: "/dashboard/rapports",  icon: ArrowUpRight, accent: t.teal },
            { label: "Ressources RH",   href: "/dashboard/rh",         icon: Users,        accent: t.teal },
            { label: "Finances",        href: "/dashboard/finances",  icon: Wallet,       accent: isLight ? "#6a8c2a" : t.lime },
            { label: "Paramètres",      href: "/dashboard/parametres",icon: Settings,     accent: muted },
          ].map((a, i) => {
            const Icon = a.icon
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.06 }}
              >
                <Link
                  href={a.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 group transition-all duration-150"
                  style={{
                    background: actionBg,
                    border: `1px solid ${actionBorder}`,
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = isLight
                      ? "rgba(29,139,147,0.30)"
                      : "rgba(29,139,147,0.25)"
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = actionBorder
                  }}
                >
                  <div
                    className="flex size-6 items-center justify-center rounded-md shrink-0"
                    style={{ background: isLight ? `${a.accent}12` : `${a.accent}15` }}
                  >
                    <Icon size={12} style={{ color: a.accent }} />
                  </div>
                  <span className="flex-1 text-[11px] font-medium" style={{ color: t.textSecondary }}>
                    {a.label}
                  </span>
                  <ChevronRight
                    size={11}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: muted }}
                  />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Label version */}
      <div className="flex items-center justify-center mt-1">
        <span
          className="text-[9px] font-semibold px-3 py-1 rounded-full"
          style={{
            background: isLight ? "#e2f2f3" : t.tealFaint,
            color: t.teal,
            border: `1px solid ${isLight ? "#b0d8dc" : "transparent"}`,
          }}
        >
          Prototype V2 — Design minimaliste
        </span>
      </div>
    </div>
  )
}
