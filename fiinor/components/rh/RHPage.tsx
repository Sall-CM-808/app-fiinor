"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Users, FileText,
  CalendarDays, UserPlus, Star, UserCog,
} from "lucide-react"
import { RHDashboard }       from "./RHDashboard"
import { PersonnelPage }     from "./PersonnelPage"
import { ContratsPage }      from "./ContratsPage"
import { CongesPage }        from "./CongesPage"
import { RecrutementPage }   from "./RecrutementPage"
import { EvaluationsPage }   from "./EvaluationsPage"
import { CONGES, POSTES_OUVERTS, CANDIDATURES } from "./rh-mock-data"

/* ─── Tokens ─── */
const G = "#C9A84C"

/* ─── Tabs ─── */
type TabId = "dashboard" | "personnel" | "contrats" | "conges" | "recrutement" | "evaluations"

const TABS: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: "dashboard",    label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "personnel",    label: "Personnel",       icon: Users },
  { id: "contrats",     label: "Contrats & Paie", icon: FileText },
  {
    id: "conges",       label: "Congés",          icon: CalendarDays,
    badge: CONGES.filter(c => c.statut === "en_attente").length,
  },
  {
    id: "recrutement",  label: "Recrutement",     icon: UserPlus,
    badge: POSTES_OUVERTS.filter(p => p.urgent).length,
  },
  { id: "evaluations",  label: "Évaluations",     icon: Star },
]

export function RHPage() {
  const [tab, setTab] = useState<TabId>("dashboard")

  const content: Record<TabId, React.ReactNode> = {
    dashboard:   <RHDashboard onNavigate={setTab} />,
    personnel:   <PersonnelPage />,
    contrats:    <ContratsPage />,
    conges:      <CongesPage />,
    recrutement: <RecrutementPage />,
    evaluations: <EvaluationsPage />,
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        className="flex items-center gap-3">
        <div className="rounded-xl p-2 flex-shrink-0"
          style={{ background: `${G}12`, border: `1px solid ${G}25` }}>
          <UserCog size={16} style={{ color: G }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black text-white tracking-tight leading-none">
            Ressources Humaines
          </h1>
          <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Université de Conakry · Gestion du personnel 2025–2026
          </p>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.06, type: "spring", stiffness: 360, damping: 32 }}
        className="flex items-center gap-1 overflow-x-auto pb-0.5"
        style={{ scrollbarWidth: "none" }}>
        {TABS.map(t => {
          const Icon   = t.icon
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
                  layoutId="rh-tab-indicator"
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
