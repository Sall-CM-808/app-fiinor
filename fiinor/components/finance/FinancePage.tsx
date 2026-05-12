"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, CalendarClock, ArrowLeftRight,
  PieChart, GitMerge, Banknote,
} from "lucide-react"
import { FinanceDashboard } from "./FinanceDashboard"
import { EcheancierPage } from "./EcheancierPage"
import { TransactionsPage } from "./TransactionsPage"
import { BudgetPage } from "./BudgetPage"
import { RapprochementPage } from "./RapprochementPage"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const SB = "#07111d"
const MU = "rgba(255,255,255,0.08)"

/* ─── Nav items ─── */
type TabId = "dashboard" | "echeancier" | "transactions" | "budget" | "rapprochement"
const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "dashboard",       label: "Vue d'ensemble",   icon: LayoutDashboard },
  { id: "echeancier",      label: "Échéancier",        icon: CalendarClock,   badge: 23 },
  { id: "transactions",    label: "Transactions",      icon: ArrowLeftRight },
  { id: "budget",          label: "Budget & Analytique", icon: PieChart },
  { id: "rapprochement",   label: "Rapprochement",    icon: GitMerge },
]

const CONTENT: Record<TabId, React.ReactNode> = {
  dashboard:     <FinanceDashboard />,
  echeancier:    <EcheancierPage />,
  transactions:  <TransactionsPage />,
  budget:        <BudgetPage />,
  rapprochement: <RapprochementPage />,
}

/* ─── Main ─── */
export function FinancePage() {
  const [tab, setTab] = useState<TabId>("dashboard")

  return (
    <div className="flex flex-col gap-4">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        className="flex items-center gap-3">
        <div className="rounded-xl p-2 flex-shrink-0"
          style={{ background: `${G}12`, border: `1px solid ${G}25` }}>
          <Banknote size={16} style={{ color: G }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black text-white tracking-tight leading-none">
            Finance Académique
          </h1>
          <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Université de Conakry · GNF · Année 2024–2025
          </p>
        </div>
      </motion.div>

      {/* ── Tab nav ── */}
      <motion.div
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, type: "spring", stiffness: 360, damping: 32 }}
        className="flex items-center gap-1 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none" }}>
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold transition-all relative"
              style={active
                ? { background: `${G}15`, color: G, border: `1px solid ${G}30` }
                : { background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Icon size={12} />
              {t.label}
              {t.badge && !active && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full text-[7px] font-black flex items-center justify-center"
                  style={{ background: "#EF4444", color: "white" }}>
                  {t.badge > 9 ? "9+" : t.badge}
                </span>
              )}
              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="fin-tab-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: G }}
                />
              )}
            </button>
          )
        })}
      </motion.div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}>
          {CONTENT[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
