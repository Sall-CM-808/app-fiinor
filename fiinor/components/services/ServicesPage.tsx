"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, ClipboardList, BookOpen,
  Bus, UtensilsCrossed, HeartPulse, Users2,
} from "lucide-react"
import { ServicesDashboard } from "./ServicesDashboard"
import { InscriptionsPage } from "./InscriptionsPage"
import { BibliothequePage } from "./BibliothequePage"
import { TransportPage } from "./TransportPage"
import { CafeteriaPage } from "./CafeteriaPage"
import { SantePage } from "./SantePage"
import { STATS_INSCRIPTIONS, EMPRUNTS, VISITES } from "./services-mock-data"

/* ─── Tokens ─── */
const G = "#C9A84C"

/* ─── Tabs ─── */
type TabId = "dashboard" | "inscriptions" | "bibliotheque" | "transport" | "cafeteria" | "sante"

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "dashboard",    label: "Vue d'ensemble",  icon: LayoutDashboard },
  {
    id: "inscriptions", label: "Inscriptions",    icon: ClipboardList,
    badge: STATS_INSCRIPTIONS.enAttente,
  },
  {
    id: "bibliotheque", label: "Bibliothèque",    icon: BookOpen,
    badge: EMPRUNTS.filter(e => e.statut === "en_retard").length,
  },
  { id: "transport",    label: "Transport",       icon: Bus },
  { id: "cafeteria",    label: "Restauration",    icon: UtensilsCrossed },
  {
    id: "sante",        label: "Santé",           icon: HeartPulse,
    badge: VISITES.filter(v => v.suiviRequis).length,
  },
]

export function ServicesPage() {
  const [tab, setTab] = useState<TabId>("dashboard")

  const content: Record<TabId, React.ReactNode> = {
    dashboard:    <ServicesDashboard onNavigate={setTab} />,
    inscriptions: <InscriptionsPage />,
    bibliotheque: <BibliothequePage />,
    transport:    <TransportPage />,
    cafeteria:    <CafeteriaPage />,
    sante:        <SantePage />,
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        className="flex items-center gap-3">
        <div className="rounded-xl p-2 flex-shrink-0"
          style={{ background: `${G}12`, border: `1px solid ${G}25` }}>
          <Users2 size={16} style={{ color: G }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black text-white tracking-tight leading-none">
            Services aux Élèves
          </h1>
          <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Université de Conakry · Année académique 2025–2026
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
              {t.badge != null && t.badge > 0 && !active && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full text-[7px] font-black flex items-center justify-center"
                  style={{ background: "#EF4444", color: "white" }}>
                  {t.badge > 9 ? "9+" : t.badge}
                </span>
              )}
              {active && (
                <motion.div
                  layoutId="srv-tab-indicator"
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
          {content[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
