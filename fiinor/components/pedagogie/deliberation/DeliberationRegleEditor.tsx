"use client"

import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence, Reorder } from "framer-motion"
import {
  Plus, Trash2, GripVertical, Play, CheckCircle2,
  XCircle, AlertTriangle, Zap, Save, Copy,
  ChevronRight, RefreshCw, Layers,
} from "lucide-react"
import type { Verdict } from "./DeliberationJury"

/* ─── Types ─── */
type ConditionOp = ">=" | "<=" | ">" | "<" | "==" | "!="
type LogicOp = "ET" | "OU"

interface Condition {
  id: string
  variable: string
  op: ConditionOp
  value: string
}

interface RuleBlock {
  id: string
  label: string
  conditions: Condition[]
  logic: LogicOp
  verdict: Verdict
  color: string
  enabled: boolean
}

/* ─── Mock test student ─── */
const TEST_STUDENT = {
  moy_generale: 9.2,
  nb_matieres_sous_5: 1,
  nb_matieres_sous_8: 2,
  nb_absences_injustifiees: 12,
  nb_absences_total: 18,
  coeff_max_echoue: 3,
}

/* ─── Variables disponibles ─── */
const VARIABLES = [
  { key: "moy_generale",              label: "Moyenne générale",        unit: "/20",   color: "#C9A84C" },
  { key: "nb_matieres_sous_5",        label: "Matières < 5",            unit: "mat.",  color: "#EF4444" },
  { key: "nb_matieres_sous_8",        label: "Matières < 8",            unit: "mat.",  color: "#F59E0B" },
  { key: "nb_absences_injustifiees",  label: "Absences injustifiées",   unit: "j",     color: "#7C3AED" },
  { key: "nb_absences_total",         label: "Absences total",          unit: "j",     color: "#6B7280" },
  { key: "coeff_max_echoue",          label: "Coeff max échoué",        unit: "coeff", color: "#EF4444" },
]

const VERDICT_COLORS: Record<Verdict, { color: string; bg: string; border: string }> = {
  admis:      { color: "#10B981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.25)"  },
  rattrapage: { color: "#F59E0B", bg: "rgba(245,158,11,0.08)",  border: "rgba(245,158,11,0.25)"  },
  ajourné:    { color: "#EF4444", bg: "rgba(239,68,68,0.08)",   border: "rgba(239,68,68,0.25)"   },
  exclu:      { color: "#7C3AED", bg: "rgba(124,58,237,0.08)",  border: "rgba(124,58,237,0.25)"  },
  en_attente: { color: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)" },
}

/* ─── Default rules ─── */
const DEFAULT_RULES: RuleBlock[] = [
  {
    id: "r1", label: "Admission directe", verdict: "admis",
    color: "#10B981", enabled: true, logic: "OU",
    conditions: [
      { id: "c1", variable: "moy_generale", op: ">=", value: "10" },
    ],
  },
  {
    id: "r2", label: "Rattrapage", verdict: "rattrapage",
    color: "#F59E0B", enabled: true, logic: "ET",
    conditions: [
      { id: "c3", variable: "moy_generale", op: ">=", value: "8" },
      { id: "c4", variable: "moy_generale", op: "<",  value: "10" },
      { id: "c5", variable: "nb_matieres_sous_5", op: "==", value: "0" },
    ],
  },
  {
    id: "r3", label: "Ajourné", verdict: "ajourné",
    color: "#EF4444", enabled: true, logic: "OU",
    conditions: [
      { id: "c7", variable: "moy_generale", op: "<", value: "8" },
    ],
  },
  {
    id: "r4", label: "Exclusion", verdict: "exclu",
    color: "#7C3AED", enabled: true, logic: "OU",
    conditions: [
      { id: "c9", variable: "nb_absences_injustifiees", op: ">", value: "30" },
    ],
  },
]

/* ─── Evaluate a rule against test student ─── */
function evalRule(rule: RuleBlock, student: typeof TEST_STUDENT): boolean {
  if (!rule.enabled) return false
  const results = rule.conditions.map(c => {
    const val = student[c.variable as keyof typeof student] ?? 0
    const ref = parseFloat(c.value)
    if (isNaN(ref)) return false
    switch (c.op) {
      case ">=": return val >= ref
      case "<=": return val <= ref
      case ">":  return val > ref
      case "<":  return val < ref
      case "==": return val === ref
      case "!=": return val !== ref
    }
  })
  return rule.logic === "ET" ? results.every(Boolean) : results.some(Boolean)
}

/* ─── Condition Row ─── */
function ConditionRow({ cond, onChange, onDelete, isFirst, logic, onLogicToggle }: {
  cond: Condition
  onChange: (c: Condition) => void
  onDelete: () => void
  isFirst: boolean
  logic: LogicOp
  onLogicToggle: () => void
}) {
  const varCfg = VARIABLES.find(v => v.key === cond.variable) ?? VARIABLES[0]
  const OPS: ConditionOp[] = [">=", "<=", ">", "<", "==", "!="]

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Logic connector */}
      {!isFirst && (
        <button onClick={onLogicToggle}
          className="w-10 text-center rounded-lg px-1.5 py-1 text-[9px] font-black uppercase tracking-wider flex-shrink-0 transition-all"
          style={{
            background: logic === "ET" ? "rgba(59,130,246,0.12)" : "rgba(201,168,76,0.12)",
            color: logic === "ET" ? "#3B82F6" : "#C9A84C",
            border: `1px solid ${logic === "ET" ? "rgba(59,130,246,0.25)" : "rgba(201,168,76,0.25)"}`,
          }}>
          {logic}
        </button>
      )}

      {/* Variable */}
      <select value={cond.variable} onChange={e => onChange({ ...cond, variable: e.target.value })}
        className="appearance-none rounded-xl px-2 py-1.5 text-[9px] font-bold outline-none flex-1 min-w-[130px]"
        style={{ background: `${varCfg.color}0d`, border: `1px solid ${varCfg.color}25`, color: varCfg.color }}>
        {VARIABLES.map(v => (
          <option key={v.key} value={v.key} style={{ background: "#08111f", color: "rgba(255,255,255,0.7)" }}>
            {v.label}
          </option>
        ))}
      </select>

      {/* Operator */}
      <select value={cond.op} onChange={e => onChange({ ...cond, op: e.target.value as ConditionOp })}
        className="appearance-none rounded-xl px-2 py-1.5 text-[10px] font-black font-mono outline-none w-14 text-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
        {OPS.map(op => <option key={op} value={op} style={{ background: "#08111f" }}>{op}</option>)}
      </select>

      {/* Value */}
      <input type="number" value={cond.value} onChange={e => onChange({ ...cond, value: e.target.value })}
        className="rounded-xl px-2 py-1.5 text-[10px] font-mono font-bold outline-none w-16 text-center flex-shrink-0"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />

      {/* Unit hint */}
      <span className="text-[8px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>{varCfg.unit}</span>

      {/* Delete */}
      <button onClick={onDelete}
        className="rounded-lg p-1.5 flex-shrink-0 transition-all"
        style={{ background: "rgba(239,68,68,0.06)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.1)" }}>
        <Trash2 className="size-3" />
      </button>
    </div>
  )
}

/* ─── Rule Block ─── */
function RuleBlockCard({ rule, onChange, onDelete, testResult }: {
  rule: RuleBlock
  onChange: (r: RuleBlock) => void
  onDelete: () => void
  testResult: boolean
}) {
  const vCfg = VERDICT_COLORS[rule.verdict]
  const VERDICTS: Verdict[] = ["admis", "rattrapage", "ajourné", "exclu"]

  function addCondition() {
    const id = `c_${Date.now()}`
    onChange({ ...rule, conditions: [...rule.conditions, { id, variable: "moy_generale", op: ">=", value: "10" }] })
  }

  function updateCondition(id: string, c: Condition) {
    onChange({ ...rule, conditions: rule.conditions.map(x => x.id === id ? c : x) })
  }

  function deleteCondition(id: string) {
    onChange({ ...rule, conditions: rule.conditions.filter(x => x.id !== id) })
  }

  return (
    <motion.div layout
      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, height: 0 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 30 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${vCfg.border}`, background: vCfg.bg }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 flex-wrap gap-y-2"
        style={{ borderBottom: `1px solid ${vCfg.border}` }}>
        <GripVertical className="size-4 flex-shrink-0 cursor-grab active:cursor-grabbing" style={{ color: "rgba(255,255,255,0.2)" }} />

        <input value={rule.label} onChange={e => onChange({ ...rule, label: e.target.value })}
          className="flex-1 min-w-[100px] bg-transparent outline-none text-[12px] font-bold text-white placeholder:text-white/25"
          placeholder="Nom de la règle…" />

        {/* Verdict selector */}
        <select value={rule.verdict} onChange={e => onChange({ ...rule, verdict: e.target.value as Verdict })}
          className="appearance-none rounded-xl px-2 py-1 text-[9px] font-black uppercase tracking-wider outline-none flex-shrink-0"
          style={{ background: `${vCfg.color}15`, border: `1px solid ${vCfg.border}`, color: vCfg.color }}>
          {VERDICTS.map(v => (
            <option key={v} value={v} style={{ background: "#08111f" }}>→ {v.toUpperCase()}</option>
          ))}
        </select>

        {/* Test result indicator */}
        <motion.div
          animate={{ scale: testResult ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1 rounded-full px-2 py-1 flex-shrink-0"
          style={testResult
            ? { background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }
            : { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {testResult
            ? <CheckCircle2 className="size-3" style={{ color: "#10B981" }} />
            : <XCircle className="size-3" style={{ color: "rgba(255,255,255,0.2)" }} />}
          <span className="text-[8px] font-bold" style={{ color: testResult ? "#10B981" : "rgba(255,255,255,0.25)" }}>
            {testResult ? "Déclenchée" : "Inactive"}
          </span>
        </motion.div>

        {/* Enable toggle */}
        <button onClick={() => onChange({ ...rule, enabled: !rule.enabled })}
          className="rounded-full px-2.5 py-1 text-[8px] font-bold transition-all flex-shrink-0"
          style={rule.enabled
            ? { background: `${vCfg.color}15`, color: vCfg.color, border: `1px solid ${vCfg.border}` }
            : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {rule.enabled ? "Active" : "Désactivée"}
        </button>

        {/* Delete */}
        <button onClick={onDelete}
          className="rounded-lg p-1.5 flex-shrink-0 transition-all"
          style={{ background: "rgba(239,68,68,0.06)", color: "#EF4444" }}>
          <Trash2 className="size-3.5" />
        </button>
      </div>

      {/* Conditions */}
      <div className="flex flex-col gap-2 px-4 py-3">
        {rule.conditions.map((c, idx) => (
          <ConditionRow key={c.id} cond={c} isFirst={idx === 0}
            logic={rule.logic}
            onLogicToggle={() => onChange({ ...rule, logic: rule.logic === "ET" ? "OU" : "ET" })}
            onChange={nc => updateCondition(c.id, nc)}
            onDelete={() => deleteCondition(c.id)} />
        ))}

        <button onClick={addCondition}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[9px] font-bold w-fit mt-1 transition-all"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Plus className="size-3" />Ajouter une condition
        </button>
      </div>
    </motion.div>
  )
}

/* ─── Test Panel ─── */
function TestPanel({ rules }: { rules: RuleBlock[] }) {
  const [studentVals, setStudentVals] = useState({ ...TEST_STUDENT })

  const activeRule = useMemo(() => rules.find(r => evalRule(r, studentVals as typeof TEST_STUDENT)), [rules, studentVals])
  const vCfg = activeRule ? VERDICT_COLORS[activeRule.verdict] : null

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Play className="size-3.5" style={{ color: "#C9A84C" }} />
        <span className="text-[11px] font-bold text-white">Test en direct — Étudiant fictif</span>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VARIABLES.map(v => {
            const val = studentVals[v.key as keyof typeof studentVals]
            const max = v.key === "moy_generale" ? 20 : v.key.includes("absences") ? 50 : 10
            return (
              <div key={v.key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{v.label}</span>
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: v.color }}>{val} {v.unit}</span>
                </div>
                <input type="range" min="0" max={max} step={v.key === "moy_generale" ? 0.5 : 1}
                  value={val}
                  onChange={e => setStudentVals(prev => ({ ...prev, [v.key]: parseFloat(e.target.value) }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: v.color }} />
              </div>
            )
          })}
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          <motion.div key={activeRule?.id ?? "none"}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={vCfg
              ? { background: vCfg.bg, border: `1px solid ${vCfg.border}` }
              : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <ChevronRight className="size-4" style={{ color: vCfg?.color ?? "rgba(255,255,255,0.2)" }} />
            <div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>Verdict calculé</div>
              <div className="text-[14px] font-black uppercase tracking-widest"
                style={{ color: vCfg?.color ?? "rgba(255,255,255,0.3)" }}>
                {activeRule ? activeRule.verdict : "— Aucune règle déclenchée —"}
              </div>
              {activeRule && (
                <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Règle : « {activeRule.label} »
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── Main ─── */
export function DeliberationRegleEditor() {
  const [rules, setRules] = useState<RuleBlock[]>(DEFAULT_RULES)
  const [saved, setSaved] = useState(false)

  const testResults = useMemo(() => {
    const results: Record<string, boolean> = {}
    rules.forEach(r => { results[r.id] = evalRule(r, TEST_STUDENT) })
    return results
  }, [rules])

  function addRule() {
    const id = `r_${Date.now()}`
    setRules(prev => [...prev, {
      id, label: "Nouvelle règle", verdict: "en_attente" as Verdict,
      color: "#6B7280", enabled: true, logic: "ET",
      conditions: [{ id: `c_${Date.now()}`, variable: "moy_generale", op: ">=", value: "10" }],
    }])
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
            <Layers className="size-4" style={{ color: "#C9A84C" }} />
            Éditeur de règles de délibération
          </h3>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
            Les règles sont évaluées dans l'ordre — la première déclenchée l'emporte
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setRules(DEFAULT_RULES)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
            style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <RefreshCw className="size-3" />Réinitialiser
          </button>
          <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-bold"
            style={saved
              ? { background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }
              : { background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#050d18" }}>
            {saved ? <CheckCircle2 className="size-3.5" /> : <Save className="size-3.5" />}
            {saved ? "Enregistré" : "Enregistrer"}
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4">

        {/* Rules list */}
        <div className="flex flex-col gap-3">
          <Reorder.Group axis="y" values={rules} onReorder={setRules} className="flex flex-col gap-3">
            <AnimatePresence>
              {rules.map(rule => (
                <Reorder.Item key={rule.id} value={rule} className="list-none">
                  <RuleBlockCard
                    rule={rule}
                    testResult={testResults[rule.id] ?? false}
                    onChange={r => setRules(prev => prev.map(x => x.id === r.id ? r : x))}
                    onDelete={() => setRules(prev => prev.filter(x => x.id !== rule.id))} />
                </Reorder.Item>
              ))}
            </AnimatePresence>
          </Reorder.Group>

          <motion.button whileTap={{ scale: 0.97 }} onClick={addRule}
            className="flex items-center justify-center gap-2 rounded-2xl py-3 text-[10px] font-bold w-full transition-all"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
            <Plus className="size-4" />Ajouter une règle
          </motion.button>

          {/* Propagation */}
          <div className="rounded-2xl px-4 py-3 flex flex-wrap items-center gap-3"
            style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
            <Zap className="size-4 flex-shrink-0" style={{ color: "#3B82F6" }} />
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold" style={{ color: "#3B82F6" }}>Propagation faculté</div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Appliquer ces règles à toutes les classes de la faculté</div>
            </div>
            <motion.button whileTap={{ scale: 0.95 }}
              className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[9px] font-bold flex-shrink-0"
              style={{ background: "rgba(59,130,246,0.12)", color: "#3B82F6", border: "1px solid rgba(59,130,246,0.25)" }}>
              <Copy className="size-3" />Propager
            </motion.button>
          </div>
        </div>

        {/* Test panel */}
        <TestPanel rules={rules} />
      </div>
    </div>
  )
}
