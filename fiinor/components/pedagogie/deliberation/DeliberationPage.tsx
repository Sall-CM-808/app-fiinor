"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gavel, Layers, Archive, FileText } from "lucide-react"
import { DeliberationJury } from "./DeliberationJury"
import { DeliberationRegleEditor } from "./DeliberationRegleEditor"
import { DeliberationHistorique } from "./DeliberationHistorique"
import { BulletinsPage } from "../bulletins/BulletinsPage"

type Tab = "jury" | "regles" | "historique" | "bulletins"

const TABS: { key: Tab; label: string; icon: React.ElementType; desc: string }[] = [
  { key: "jury",       label: "Table du Jury",     icon: Gavel,    desc: "Verdicts individuels & délibération" },
  { key: "regles",     label: "Règles",             icon: Layers,   desc: "Conditions d'admission & rattrapages" },
  { key: "historique", label: "Historique",         icon: Archive,  desc: "Registre immuable des délibérations" },
  { key: "bulletins",  label: "Bulletins PDF",      icon: FileText, desc: "Génération et aperçu des bulletins" },
]

export function DeliberationPage() {
  const [tab, setTab] = useState<Tab>("jury")

  return (
    <div className="flex flex-col gap-5">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="size-7 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}>
              <Gavel className="size-3.5" style={{ color: "#C9A84C" }} />
            </div>
            <h1 className="text-[20px] font-black text-white tracking-tight">Délibération</h1>
          </div>
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            Verdicts · Règles d'admission · Registre immuable
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" } as React.CSSProperties}>
        <div className="flex items-center gap-1 p-1 rounded-2xl w-max"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {TABS.map(t => {
            const Icon = t.icon
            const active = tab === t.key
            return (
              <motion.button key={t.key} onClick={() => setTab(t.key)} whileTap={{ scale: 0.96 }}
                className="relative flex flex-shrink-0 items-center gap-1.5 rounded-xl px-3 sm:px-4 py-2 text-[11px] font-semibold transition-colors"
                style={{ color: active ? "white" : "rgba(255,255,255,0.4)", zIndex: 1 }}>
                {active && (
                  <motion.div layoutId="delib-tab-pill" className="absolute inset-0 rounded-xl"
                    style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
                    transition={{ type: "spring" as const, stiffness: 500, damping: 35 }} />
                )}
                <Icon className="size-3.5 relative z-10" style={{ color: active ? "#C9A84C" : undefined }} />
                <span className="relative z-10 whitespace-nowrap">{t.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Tab subtitle */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}>
          {tab === "jury"       && <DeliberationJury />}
          {tab === "regles"     && <DeliberationRegleEditor />}
          {tab === "historique" && <DeliberationHistorique />}
          {tab === "bulletins"  && <BulletinsPage />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
