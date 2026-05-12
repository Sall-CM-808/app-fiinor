"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ClipboardList, Pencil, BarChart2, ChevronLeft, Info } from "lucide-react"
import { EvaluationsList, MOCK_EVALS } from "./EvaluationsList"
import { NoteSaisieGrid } from "./NoteSaisieGrid"
import { EvaluationStats } from "./EvaluationStats"
import { EvaluationDetail } from "./EvaluationDetail"
import type { Evaluation } from "./EvaluationsList"

type Tab = "liste" | "detail" | "saisie" | "stats"

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "liste",  label: "Évaluations",  icon: ClipboardList },
  { key: "detail", label: "Détails",      icon: Info },
  { key: "saisie", label: "Saisie notes", icon: Pencil },
  { key: "stats",  label: "Statistiques", icon: BarChart2 },
]

export function EvaluationsPage() {
  const [tab, setTab] = useState<Tab>("liste")
  const [activeEval, setActiveEval] = useState<Evaluation>(MOCK_EVALS[0])

  function handleSaisir(ev: Evaluation) {
    setActiveEval(ev)
    setTab("saisie")
  }

  function handleDetail(ev: Evaluation) {
    setActiveEval(ev)
    setTab("detail")
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <h1 className="text-[18px] font-bold text-white">Évaluations</h1>
        <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          DS · Examens · TP · Oraux — Saisie des notes et analyse des résultats
        </p>
      </div>

      {/* Tab bar — scrollable on mobile */}
      <div className="overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        <div className="flex items-center gap-1 p-1 rounded-2xl w-max min-w-full sm:min-w-0 sm:w-auto"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.key
            return (
              <motion.button key={t.key} onClick={() => setTab(t.key)}
                whileTap={{ scale: 0.96 }}
                className="relative flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-[11px] font-semibold transition-colors"
                style={{ color: active ? "white" : "rgba(255,255,255,0.4)", zIndex: 1 }}>
                {active && (
                  <motion.div layoutId="tab-pill" className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }} />
                )}
                <Icon className="size-3.5 relative z-10" />
                <span className="relative z-10 whitespace-nowrap">{t.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Active eval banner (saisie + stats) */}
      <AnimatePresence>
        {(tab === "saisie" || tab === "stats" || tab === "detail") && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden">
            <div className="rounded-xl px-4 py-2.5 flex items-center gap-3"
              style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.18)" }}>
              <div className="size-1.5 rounded-full" style={{ background: "#C9A84C" }} />
              <span className="text-[10px] font-semibold" style={{ color: "#C9A84C" }}>
                Évaluation active :
              </span>
              <span className="text-[10px] text-white font-medium flex-1 truncate">{activeEval.titre}</span>
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {activeEval.classe} · {activeEval.matiere}
              </span>
              <button onClick={() => setTab("liste")}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-medium transition-all"
                style={{ color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={e => e.currentTarget.style.color = "white"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
                <ChevronLeft className="size-3" />Changer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}>
          {tab === "liste"  && <EvaluationsList onSaisir={handleSaisir} onDetail={handleDetail} />}
          {tab === "detail" && <EvaluationDetail evaluation={activeEval} onGoSaisie={() => setTab("saisie")} onGoStats={() => setTab("stats")} />}
          {tab === "saisie" && <NoteSaisieGrid  evaluation={activeEval} />}
          {tab === "stats"  && <EvaluationStats evaluation={activeEval} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
