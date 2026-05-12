"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FlaskConical, Plus, Play, Check, X, ChevronDown, ChevronUp,
  Zap, Info, ToggleLeft, ToggleRight, GitBranch,
} from "lucide-react"
import { FORMULES, type Formule, type TypeFormule } from "./parametres-mock-data"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const TYPE_CFG: Record<TypeFormule, { lbl: string; color: string }> = {
  moyenne:    { lbl: "Moyenne",    color: G  },
  admission:  { lbl: "Admission",  color: EM },
  gpa:        { lbl: "GPA",        color: BL },
  competences:{ lbl: "Compétences",color: PR },
}

const EXEMPLES: { titre: string; expr: string; desc: string }[] = [
  { titre: "Lycée classique",       expr: "(DS * 0.3 + examen * 0.7) / 20",                                    desc: "30% DS / 70% examen final" },
  { titre: "GPA 4.0",               expr: "somme(note * credits) / somme(credits)",                            desc: "Pondéré par crédits ECTS" },
  { titre: "Admission compensée",   expr: "(moy_semestre >= 10) OR (moy_annee >= 12 AND matieres_sous_10 <= 2)", desc: "Compensation annuelle" },
  { titre: "Bonus assiduité",       expr: "(note_brute * coeff) + (presence_pct > 0.9 ? 1.5 : 0)",            desc: "+1.5 si présence > 90%" },
]

export function FormulesPage() {
  const [formules, setFormules]   = useState<Formule[]>(FORMULES)
  const [expanded, setExpanded]   = useState<string | null>(null)
  const [editExpr, setEditExpr]   = useState<Record<string, string>>({})
  const [testing, setTesting]     = useState<string | null>(null)

  function toggleActive(id: string) {
    setFormules(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f))
  }

  function togglePropagate(id: string) {
    setFormules(prev => prev.map(f => f.id === id ? { ...f, propagate: !f.propagate } : f))
  }

  function runTest(id: string) {
    setTesting(id)
    setTimeout(() => setTesting(null), 1400)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Intro */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 px-4 py-3 rounded-2xl"
        style={{ background: `${G}08`, border: `1px solid ${G}18` }}>
        <Zap size={14} style={{ color: G, marginTop: 1, flexShrink: 0 }} />
        <div>
          <div className="text-[10px] font-black text-white">Moteur de formules AST — Différenciateur #1 de Fiinor</div>
          <div className="text-[8.5px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
            Les règles de calcul ne sont plus codées en dur. Le directeur pédagogique définit ses propres formules
            via cette interface — sans ligne de code. Chaque formule est validée syntaxiquement avant sauvegarde
            (AST Validator) et exécutée dans un environnement sandboxé.
          </div>
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="text-[10px] font-bold text-white">{formules.filter(f => f.active).length} formule{formules.filter(f=>f.active).length>1?"s":""} active{formules.filter(f=>f.active).length>1?"s":""}</div>
        <div className="flex-1" />
        <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
          style={{ background: G, color: "#000" }}>
          <Plus size={11} /> Nouvelle formule
        </button>
      </div>

      {/* Liste formules */}
      <div className="flex flex-col gap-3">
        {formules.map((f, i) => {
          const tc     = TYPE_CFG[f.type]
          const isOpen = expanded === f.id
          const expr   = editExpr[f.id] ?? f.expression
          return (
            <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${f.active ? BORDER : "rgba(255,255,255,0.04)"}`, opacity: f.active ? 1 : 0.55 }}>

              {/* Header */}
              <div role="button" tabIndex={0} onClick={() => setExpanded(isOpen ? null : f.id)}
                onKeyDown={e => e.key === "Enter" && setExpanded(isOpen ? null : f.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer"
                style={{ background: isOpen ? `${G}04` : CARD, borderBottom: isOpen ? `1px solid ${BORDER}` : "none" }}>
                <div className="rounded-xl p-2 flex-shrink-0"
                  style={{ background: `${tc.color}15`, border: `1px solid ${tc.color}20` }}>
                  <FlaskConical size={12} style={{ color: tc.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="text-[10px] font-black text-white">{f.nom}</div>
                    <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: `${tc.color}12`, color: tc.color }}>{tc.lbl}</span>
                    {f.propagate && (
                      <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"
                        style={{ background: `${BL}10`, color: BL }}>
                        <GitBranch size={7} /> propagée
                      </span>
                    )}
                  </div>
                  <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{f.scope} · {f.description}</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); toggleActive(f.id) }}
                    className="transition-opacity">
                    {f.active
                      ? <ToggleRight size={20} style={{ color: EM }} />
                      : <ToggleLeft  size={20} style={{ color: "rgba(255,255,255,0.2)" }} />}
                  </button>
                  {isOpen ? <ChevronUp size={12} style={{ color: G }} /> : <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.2)" }} />}
                </div>
              </div>

              {/* Éditeur */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden px-4 py-4 flex flex-col gap-4"
                    style={{ background: "rgba(0,0,0,0.15)" }}>

                    {/* Expression */}
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Expression</label>
                      <div className="relative">
                        <textarea value={expr}
                          onChange={e => setEditExpr(prev => ({ ...prev, [f.id]: e.target.value }))}
                          rows={2}
                          className="w-full rounded-xl px-3 py-2.5 text-[10px] font-mono text-white bg-transparent outline-none resize-none"
                          style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${G}25`, color: G }} />
                      </div>
                    </div>

                    {/* Propagation + test */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <button onClick={() => togglePropagate(f.id)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold transition-all"
                        style={{ background: f.propagate ? `${BL}12` : "rgba(255,255,255,0.04)", color: f.propagate ? BL : "rgba(255,255,255,0.35)", border: `1px solid ${f.propagate ? BL + "25" : BORDER}` }}>
                        <GitBranch size={10} />
                        {f.propagate ? "Propagation activée" : "Activer la propagation"}
                      </button>
                      <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {f.propagate ? "Appliquée à tous les sous-départements" : "Appliquée à ce scope uniquement"}
                      </div>
                    </div>

                    {/* Test + résultat */}
                    <div className="flex items-center gap-3">
                      <button onClick={() => runTest(f.id)}
                        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[9px] font-bold transition-all"
                        style={{ background: `${EM}12`, color: EM, border: `1px solid ${EM}25` }}>
                        <Play size={10} /> {testing === f.id ? "Exécution…" : "Tester avec données exemples"}
                      </button>
                      {f.testResultat && (
                        <div className="flex items-center gap-1.5 rounded-xl px-3 py-2"
                          style={{ background: `${G}10`, border: `1px solid ${G}20` }}>
                          <Check size={9} style={{ color: G }} />
                          <span className="text-[9px] font-bold font-mono" style={{ color: G }}>
                            {testing === f.id ? "..." : f.testResultat}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Exemples */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <Info size={11} style={{ color: G }} />
          <span className="text-[10px] font-black text-white">Exemples de formules</span>
          <span className="text-[8px] ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>— cliquez pour insérer</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {EXEMPLES.map((ex, i) => (
            <div key={ex.titre} className="px-4 py-3 flex flex-col gap-1"
              style={{ borderBottom: i < 2 ? `1px solid ${BORDER}` : "none", borderRight: i % 2 === 0 ? `1px solid ${BORDER}` : "none" }}>
              <div className="text-[9px] font-bold text-white">{ex.titre}</div>
              <code className="text-[8.5px] font-mono px-2 py-1 rounded-lg" style={{ background: "rgba(0,0,0,0.3)", color: G }}>
                {ex.expr}
              </code>
              <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{ex.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
