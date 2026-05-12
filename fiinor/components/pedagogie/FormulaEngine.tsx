"use client"

import { useState, useCallback, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Cpu, Play, CheckCircle2, XCircle, AlertTriangle, Copy,
  Plus, Trash2, ChevronRight, ChevronDown, Save, RotateCcw,
  Database, Link2, Wrench, Hash, Type, Calendar, ToggleLeft,
  ArrowRight, Zap, TrendingUp, GitBranch, History, BookOpen,
  AreaChart as AreaChartIcon, Calculator,
} from "lucide-react"
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartTooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts"

/* ═══════════════════════════════════════════
   DJANGO MODEL SCHEMA
═══════════════════════════════════════════ */

type FieldType = "NUMBER" | "STRING" | "DATE" | "BOOLEAN" | "RELATION"

interface ModelField {
  name: string
  type: FieldType
  label: string
  description?: string
  isCf?: boolean
}

interface ModelRelation {
  name: string
  target: string
  label: string
}

interface DjangoModel {
  id: string
  name: string
  appLabel: string
  label: string
  icon: string
  color: string
  description: string
  fields: ModelField[]
  cfFields: ModelField[]
  relations: ModelRelation[]
}

const MODELS: DjangoModel[] = [
  {
    id: "note", name: "Note", appLabel: "pedagogie.note", label: "Note",
    icon: "📝", color: "#3B82F6", description: "Résultat chiffré d'un étudiant à une évaluation",
    fields: [
      { name: "valeur",       type: "NUMBER",  label: "Valeur",       description: "Note sur 20 ou selon l'échelle" },
      { name: "date_saisie",  type: "DATE",    label: "Date saisie",  description: "Date d'enregistrement de la note" },
      { name: "commentaire",  type: "STRING",  label: "Commentaire",  description: "Commentaire de l'enseignant" },
      { name: "actif",        type: "BOOLEAN", label: "Actif",        description: "Note prise en compte dans le calcul" },
    ],
    cfFields: [
      { name: "bonus",       type: "NUMBER", label: "Bonus",       isCf: true },
      { name: "malus",       type: "NUMBER", label: "Malus",       isCf: true },
      { name: "appreciation",type: "STRING", label: "Appréciation",isCf: true },
    ],
    relations: [
      { name: "evaluation", target: "evaluation", label: "Évaluation associée" },
      { name: "etudiant",   target: "etudiant",   label: "Étudiant concerné" },
      { name: "inscription",target: "inscription",label: "Inscription active" },
    ],
  },
  {
    id: "evaluation", name: "Evaluation", appLabel: "pedagogie.evaluation", label: "Évaluation",
    icon: "📋", color: "#8B5CF6", description: "DS, examen, TP, oral — évaluation d'une matière",
    fields: [
      { name: "coefficient",  type: "NUMBER",  label: "Coefficient",   description: "Poids dans la moyenne finale" },
      { name: "note_max",     type: "NUMBER",  label: "Note maximale", description: "Barème (défaut : 20)" },
      { name: "date",         type: "DATE",    label: "Date",          description: "Date de l'évaluation" },
      { name: "type_eval",    type: "STRING",  label: "Type",          description: "DS / Examen / TP / Oral" },
      { name: "obligatoire",  type: "BOOLEAN", label: "Obligatoire",   description: "Doit être passée pour valider" },
    ],
    cfFields: [
      { name: "duree_heures",  type: "NUMBER", label: "Durée (h)",    isCf: true },
      { name: "seuil_passage", type: "NUMBER", label: "Seuil passage", isCf: true },
    ],
    relations: [
      { name: "matiere",  target: "matiere",  label: "Matière évaluée" },
      { name: "periode",  target: "periode",  label: "Période académique" },
      { name: "unite",    target: "unite",    label: "Unité structurelle" },
    ],
  },
  {
    id: "matiere", name: "Matiere", appLabel: "pedagogie.matiere", label: "Matière",
    icon: "📚", color: "#10B981", description: "Discipline ou cours inscrit dans un programme",
    fields: [
      { name: "libelle",      type: "STRING",  label: "Libellé",      description: "Nom complet de la matière" },
      { name: "code",         type: "STRING",  label: "Code",         description: "Code court (ex : MAT101)" },
      { name: "coefficient",  type: "NUMBER",  label: "Coefficient",  description: "Poids dans le programme" },
      { name: "volume_horaire",type: "NUMBER", label: "Volume horaire",description: "Heures totales du cours" },
      { name: "actif",        type: "BOOLEAN", label: "Actif",        description: "Matière en cours de dispense" },
    ],
    cfFields: [
      { name: "credits_ects", type: "NUMBER", label: "Crédits ECTS", isCf: true },
      { name: "note_plancher",type: "NUMBER", label: "Note plancher", isCf: true },
    ],
    relations: [
      { name: "unite",       target: "unite",       label: "Unité structurelle" },
      { name: "enseignant",  target: "etudiant",    label: "Enseignant responsable" },
    ],
  },
  {
    id: "etudiant", name: "Etudiant", appLabel: "elements.element", label: "Étudiant",
    icon: "👤", color: "#F59E0B", description: "Element avec rôle étudiant dans le système",
    fields: [
      { name: "nom",          type: "STRING",  label: "Nom",           description: "Nom de famille" },
      { name: "prenom",       type: "STRING",  label: "Prénom",        description: "Prénom(s)" },
      { name: "matricule",    type: "STRING",  label: "Matricule",     description: "Identifiant unique" },
      { name: "date_naissance",type:"DATE",    label: "Date naissance",description: "Pour les calculs d'âge" },
      { name: "actif",        type: "BOOLEAN", label: "Actif",         description: "Inscription en cours" },
    ],
    cfFields: [
      { name: "bonus",       type: "NUMBER", label: "Bonus global",  isCf: true },
      { name: "malus",       type: "NUMBER", label: "Malus global",  isCf: true },
      { name: "bourse",      type: "BOOLEAN",label: "Boursier",      isCf: true },
      { name: "regime",      type: "STRING", label: "Régime (FT/FP)",isCf: true },
    ],
    relations: [
      { name: "unite",        target: "unite",   label: "Classe / Unité" },
      { name: "type_element", target: "unite",   label: "Type d'élément" },
    ],
  },
  {
    id: "unite", name: "UniteStructurelle", appLabel: "structure.unite", label: "Unité structurelle",
    icon: "🏫", color: "#EF4444", description: "Classe, département, faculté, réseau…",
    fields: [
      { name: "nom",    type: "STRING", label: "Nom",   description: "Nom de l'unité" },
      { name: "code",   type: "STRING", label: "Code",  description: "Code court" },
      { name: "niveau", type: "NUMBER", label: "Niveau",description: "Profondeur dans la hiérarchie" },
      { name: "actif",  type: "BOOLEAN",label: "Actif", description: "Unité active" },
    ],
    cfFields: [
      { name: "seuil_admission", type: "NUMBER", label: "Seuil admission", isCf: true },
      { name: "systeme_notation",type: "STRING", label: "Système notation", isCf: true },
    ],
    relations: [
      { name: "organisation", target: "unite", label: "Organisation parente" },
      { name: "parent",       target: "unite", label: "Unité parente" },
    ],
  },
  {
    id: "periode", name: "Periode", appLabel: "pedagogie.periode", label: "Période académique",
    icon: "📅", color: "#06B6D4", description: "Semestre, trimestre ou année académique",
    fields: [
      { name: "libelle",      type: "STRING", label: "Libellé",       description: "Ex : Semestre 1 2025-2026" },
      { name: "date_debut",   type: "DATE",   label: "Date début",    description: "" },
      { name: "date_fin",     type: "DATE",   label: "Date fin",      description: "" },
      { name: "annee",        type: "NUMBER", label: "Année",         description: "Année académique" },
      { name: "cloture",      type: "BOOLEAN",label: "Clôturé",       description: "Période fermée aux modifications" },
    ],
    cfFields: [],
    relations: [
      { name: "annee_academique", target: "unite", label: "Année académique" },
    ],
  },
]

const MODEL_MAP = Object.fromEntries(MODELS.map(m => [m.id, m]))

/* ═══════════════════════════════════════════
   TYPES
═══════════════════════════════════════════ */

type FormulaScope = "evaluation" | "matiere" | "unite" | "periode"
type FormulaStatus = "valid" | "invalid" | "warning" | "idle"

interface ParsedVar { path: string; modelId: string; fieldName: string; isCf: boolean; type: FieldType | null }
interface ValidationResult { status: FormulaStatus; message: string; vars: ParsedVar[] }

const SCOPE_LABELS: Record<FormulaScope, string> = {
  evaluation: "Évaluation", matiere: "Matière", unite: "Unité", periode: "Période",
}
const SCOPE_COLORS: Record<FormulaScope, string> = {
  evaluation: "#3B82F6", matiere: "#C9A84C", unite: "#8B5CF6", periode: "#10B981",
}

/* ═══════════════════════════════════════════
   AST PARSER (dot-path aware)
═══════════════════════════════════════════ */

type Token = { type: "num" | "path" | "op" | "lparen" | "rparen" | "comma" | "eof"; val: string }

function tokenize(expr: string): Token[] {
  const tokens: Token[] = []; let i = 0
  while (i < expr.length) {
    if (/\s/.test(expr[i])) { i++; continue }
    if (/\d/.test(expr[i])) {
      let n = ""
      while (i < expr.length && /[\d.]/.test(expr[i])) n += expr[i++]
      tokens.push({ type: "num", val: n })
    } else if (/[a-zA-Z_]/.test(expr[i])) {
      let id = ""
      while (i < expr.length && /[\w.]/.test(expr[i])) id += expr[i++]
      tokens.push({ type: "path", val: id })
    } else if (expr[i] === "(") { tokens.push({ type: "lparen", val: "(" }); i++ }
    else if (expr[i] === ")") { tokens.push({ type: "rparen", val: ")" }); i++ }
    else if (expr[i] === ",") { tokens.push({ type: "comma", val: "," }); i++ }
    else {
      let op = expr[i++]
      if (i < expr.length && /[=><]/.test(expr[i])) op += expr[i++]
      tokens.push({ type: "op", val: op })
    }
  }
  tokens.push({ type: "eof", val: "" })
  return tokens
}

function extractPaths(expr: string): string[] {
  const tokens = tokenize(expr)
  const all = tokens.filter(t => t.type === "path" && t.val.includes(".")).map(t => t.val)
  return Array.from(new Set(all))
}

function resolvePathType(path: string): FieldType | null {
  const parts = path.split(".")
  if (parts.length < 2) return null
  const model = MODEL_MAP[parts[0]]
  if (!model) return null
  // dot-notation: model.cf.field  or  model.field  or  model.relation.field
  if (parts[1] === "cf") {
    const cfField = model.cfFields.find(f => f.name === parts[2])
    return cfField?.type ?? null
  }
  const direct = model.fields.find(f => f.name === parts[1])
  if (direct) return direct.type
  // navigate relation
  const rel = model.relations.find(r => r.name === parts[1])
  if (rel && parts.length >= 3) {
    const targetModel = MODEL_MAP[rel.target]
    if (!targetModel) return null
    const relField = targetModel.fields.find(f => f.name === parts[2])
    return relField?.type ?? null
  }
  return null
}

function validateFormula(expr: string): ValidationResult {
  if (!expr.trim()) return { status: "idle", message: "Saisissez une formule", vars: [] }
  const paths = extractPaths(expr)
  const parsedVars: ParsedVar[] = paths.map(p => {
    const parts = p.split(".")
    const modelId = parts[0]
    const isCf = parts[1] === "cf"
    const fieldName = isCf ? parts[2] : parts[1]
    return { path: p, modelId, fieldName, isCf, type: resolvePathType(p) }
  })
  const unknown = parsedVars.filter(v => !MODEL_MAP[v.modelId])
  if (unknown.length) return { status: "invalid", message: `Modèle inconnu : ${unknown.map(u => u.modelId).join(", ")}`, vars: parsedVars }
  const badField = parsedVars.filter(v => MODEL_MAP[v.modelId] && v.type === null)
  if (badField.length) return { status: "warning", message: `Champ non résolu : ${badField.map(u => u.path).join(", ")}`, vars: parsedVars }
  // basic syntax check: balanced parens
  let depth = 0
  for (const ch of expr) { if (ch === "(") depth++; if (ch === ")") depth-- }
  if (depth !== 0) return { status: "invalid", message: "Parenthèses non équilibrées", vars: parsedVars }
  return { status: "valid", message: `Formule valide — ${parsedVars.length} variable(s) résolue(s)`, vars: parsedVars }
}

function evalWithMock(expr: string, data: Record<string, number>): number | null {
  try {
    let e = expr.replace(/\s*=\s*[^=]/g, m => m) // skip assignment
    // replace paths with values
    for (const [k, v] of Object.entries(data)) {
      e = e.replace(new RegExp(k.replace(/\./g, "\\."), "g"), String(v))
    }
    // replace functions
    e = e.replace(/moyenne\(([^)]+)\)/g, (_m, args) => {
      const nums = args.split(",").map(Number)
      return String(nums.reduce((a: number, b: number) => a + b, 0) / nums.length)
    }).replace(/somme\(([^)]+)\)/g, (_m, args) => {
      return String(args.split(",").map(Number).reduce((a: number, b: number) => a + b, 0))
    }).replace(/min\(([^)]+)\)/g, (_m, args) => String(Math.min(...args.split(",").map(Number))))
      .replace(/max\(([^)]+)\)/g, (_m, args) => String(Math.max(...args.split(",").map(Number))))
      .replace(/arrondi\(([^,]+),\s*(\d+)\)/g, (_m, v, d) => String(parseFloat(parseFloat(v).toFixed(parseInt(d)))))
      .replace(/abs\(([^)]+)\)/g, (_m, v) => String(Math.abs(parseFloat(v))))
    // ternary
    e = e.replace(/SI\s+(.+?)\s+ALORS\s+(.+?)\s+SINON\s+(.+)/g, "($1) ? ($2) : ($3)")
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${e})`)()
    return typeof result === "number" ? Math.round(result * 100) / 100 : null
  } catch { return null }
}

/* ═══════════════════════════════════════════
   MOCK TEST DATA
═══════════════════════════════════════════ */

const MOCK_STUDENTS = [
  { id: "s1", label: "Alpha Diallo",    data: { "note.valeur": 14.5, "note.actif": 1, "evaluation.coefficient": 2, "evaluation.note_max": 20, "matiere.coefficient": 3, "matiere.cf.credits_ects": 4, "etudiant.cf.bonus": 1.5, "etudiant.cf.malus": 0, "periode.annee": 2026 } },
  { id: "s2", label: "Fatoumata Bah",   data: { "note.valeur": 9.0,  "note.actif": 1, "evaluation.coefficient": 2, "evaluation.note_max": 20, "matiere.coefficient": 3, "matiere.cf.credits_ects": 4, "etudiant.cf.bonus": 0,   "etudiant.cf.malus": 0, "periode.annee": 2026 } },
  { id: "s3", label: "Ibrahima Camara", data: { "note.valeur": 17.0, "note.actif": 1, "evaluation.coefficient": 2, "evaluation.note_max": 20, "matiere.coefficient": 5, "matiere.cf.credits_ects": 6, "etudiant.cf.bonus": 0,   "etudiant.cf.malus": 0, "periode.annee": 2026 } },
  { id: "s4", label: "Mariama Keïta",   data: { "note.valeur": 6.5,  "note.actif": 1, "evaluation.coefficient": 1, "evaluation.note_max": 20, "matiere.coefficient": 2, "matiere.cf.credits_ects": 2, "etudiant.cf.bonus": 0,   "etudiant.cf.malus": 2, "periode.annee": 2026 } },
]

/* ═══════════════════════════════════════════
   FORMULA TEMPLATES
═══════════════════════════════════════════ */

const TEMPLATES = [
  { id: "t1", label: "Moyenne pondérée classique", formula: "(note.valeur * evaluation.coefficient) / evaluation.note_max", scope: "evaluation" as FormulaScope },
  { id: "t2", label: "Avec bonus assiduité", formula: "(note.valeur * evaluation.coefficient) / 20 + (etudiant.cf.bonus > 0 ? etudiant.cf.bonus : 0)", scope: "evaluation" as FormulaScope },
  { id: "t3", label: "GPA crédits ECTS", formula: "somme(note.valeur * matiere.cf.credits_ects) / somme(matiere.cf.credits_ects)", scope: "matiere" as FormulaScope },
  { id: "t4", label: "Note plancher + malus", formula: "max(note.valeur - etudiant.cf.malus, matiere.cf.note_plancher)", scope: "matiere" as FormulaScope },
  { id: "t5", label: "Mention automatique", formula: "note.valeur >= 16 ? 4 : note.valeur >= 14 ? 3 : note.valeur >= 12 ? 2 : note.valeur >= 10 ? 1 : 0", scope: "evaluation" as FormulaScope },
]

/* ═══════════════════════════════════════════
   FIELD TYPE ICON
═══════════════════════════════════════════ */

function FieldTypeIcon({ type }: { type: FieldType }) {
  if (type === "NUMBER")  return <Hash className="size-2.5" style={{ color: "#3B82F6" }} />
  if (type === "STRING")  return <Type className="size-2.5" style={{ color: "#10B981" }} />
  if (type === "DATE")    return <Calendar className="size-2.5" style={{ color: "#F59E0B" }} />
  if (type === "BOOLEAN") return <ToggleLeft className="size-2.5" style={{ color: "#8B5CF6" }} />
  return <Link2 className="size-2.5" style={{ color: "#EF4444" }} />
}

/* ═══════════════════════════════════════════
   AUDIT DATA (for history tab)
═══════════════════════════════════════════ */

const AUDIT_CHART = [
  { date: "25 avr", exec: 4, formules: 2 }, { date: "26 avr", exec: 7, formules: 3 },
  { date: "27 avr", exec: 12, formules: 5 }, { date: "28 avr", exec: 9, formules: 4 },
  { date: "29 avr", exec: 15, formules: 6 }, { date: "30 avr", exec: 21, formules: 8 },
]
const AUDIT_LOG = [
  { id: "a1", date: "30 avr.", formula: "(note.valeur * evaluation.coefficient) / 20", scope: "evaluation" as FormulaScope, author: "Prof. Diallo", action: "executed" as const, result: 1.45 },
  { id: "a2", date: "29 avr.", formula: "somme(note.valeur * matiere.cf.credits_ects) / somme(matiere.cf.credits_ects)", scope: "matiere" as FormulaScope, author: "Admin", action: "created" as const },
  { id: "a3", date: "28 avr.", formula: "note.valeur >= 10 ? 1 : 0", scope: "evaluation" as FormulaScope, author: "Dir. Pédago", action: "updated" as const },
  { id: "a4", date: "27 avr.", formula: "(note.valeur * evaluation.coefficient) + etudiant.cf.bonus", scope: "evaluation" as FormulaScope, author: "Prof. Camara", action: "executed" as const, result: 30.5 },
]
const ACTION_ST = { created: { bg: "rgba(59,130,246,0.12)", color: "#60A5FA", label: "Créé" }, updated: { bg: "rgba(245,158,11,0.12)", color: "#FCD34D", label: "Modifié" }, deleted: { bg: "rgba(239,68,68,0.12)", color: "#F87171", label: "Supprimé" }, executed: { bg: "rgba(16,185,129,0.12)", color: "#34D399", label: "Exécuté" } }

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */

type Tab = "builder" | "library" | "audit"

export function FormulaEngine() {
  const [tab, setTab] = useState<Tab>("builder")
  const [editorFormula, setEditorFormula] = useState("(note.valeur * evaluation.coefficient) / 20")

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "builder", label: "Constructeur", icon: Cpu },
    { id: "library", label: "Templates",    icon: BookOpen },
    { id: "audit",   label: "Historique",   icon: History },
  ]

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl"
            style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)" }}>
            <Cpu className="size-5" style={{ color: "#C9A84C" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Moteur de Formules</h1>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
              Syntaxe <code className="text-[#C9A84C] text-[10px]">modele.champ</code> · AST validé · Exécution sandboxée
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[{ v: "6 modèles", c: "#C9A84C" }, { v: "4 scopes", c: "#8B5CF6" }, { v: "21 exec/j", c: "#10B981" }].map(k => (
            <div key={k.v} className="rounded-xl px-3 py-1.5 text-[10px] font-bold"
              style={{ background: `${k.c}12`, color: k.c, border: `1px solid ${k.c}25` }}>{k.v}</div>
          ))}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl w-fit"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        {TABS.map(t => {
          const Icon = t.icon; const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="relative flex items-center gap-2 rounded-lg px-4 py-2 transition-all"
              style={{ color: active ? "white" : "rgba(255,255,255,0.35)" }}>
              {active && <motion.div layoutId="fe-tab" className="absolute inset-0 rounded-lg"
                style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }} />}
              <Icon className="relative size-3.5" style={{ color: active ? "#C9A84C" : undefined }} />
              <span className="relative text-[11px] font-semibold">{t.label}</span>
            </button>
          )
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>
          {tab === "builder" && <FormulaBuilder formula={editorFormula} onChange={setEditorFormula} />}
          {tab === "library" && <FormulaLibrary onUse={f => { setEditorFormula(f); setTab("builder") }} />}
          {tab === "audit"   && <AuditLog />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════
   FORMULA BUILDER
═══════════════════════════════════════════ */

const CALC_OPS = [
  { label: "+",  val: " + ",  color: "#C9A84C" },
  { label: "-",  val: " - ",  color: "#C9A84C" },
  { label: "×",  val: " * ",  color: "#C9A84C" },
  { label: "÷",  val: " / ",  color: "#C9A84C" },
  { label: "(",  val: "(",    color: "rgba(255,255,255,0.6)" },
  { label: ")",  val: ")",    color: "rgba(255,255,255,0.6)" },
  { label: "≥",  val: " >= ", color: "#60A5FA" },
  { label: "≤",  val: " <= ", color: "#60A5FA" },
  { label: ">",  val: " > ",  color: "#60A5FA" },
  { label: "<",  val: " < ",  color: "#60A5FA" },
  { label: "=",  val: " == ", color: "#60A5FA" },
  { label: "≠",  val: " != ", color: "#60A5FA" },
]

const CALC_FUNS = [
  { label: "moyenne(a, b)", val: "moyenne()", color: "#3B82F6" },
  { label: "somme(a, b)",   val: "somme()",   color: "#3B82F6" },
  { label: "min(a, b)",     val: "min()",     color: "#3B82F6" },
  { label: "max(a, b)",     val: "max()",     color: "#3B82F6" },
  { label: "arrondi(x, 2)", val: "arrondi(, 2)", color: "#3B82F6" },
  { label: "abs(x)",        val: "abs()",     color: "#3B82F6" },
]

const CALC_CONDS = [
  { label: "SI … ALORS … SINON", val: "SI  ALORS  SINON ", color: "#A78BFA" },
  { label: "? … : …",           val: " ? ",              color: "#A78BFA" },
  { label: "ET",                 val: " AND ",            color: "#A78BFA" },
  { label: "OU",                 val: " OR ",             color: "#A78BFA" },
]

function FormulaBuilder({ formula, onChange }: { formula: string; onChange: (f: string) => void }) {
  const [scope, setScope] = useState<FormulaScope>("evaluation")
  const [selectedModel, setSelectedModel] = useState<DjangoModel | null>(null)
  const [selectedStudent, setSelectedStudent] = useState(MOCK_STUDENTS[0])
  const [testResult, setTestResult] = useState<number | null>(null)
  const [ran, setRan] = useState(false)
  const [saved, setSaved] = useState(false)
  const [pickedField, setPickedField] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const validation = useMemo(() => validateFormula(formula), [formula])

  const insert = useCallback((text: string) => {
    const ta = textareaRef.current
    if (!ta) { onChange(formula + text); return }
    const start = ta.selectionStart ?? formula.length
    const end = ta.selectionEnd ?? formula.length
    const next = formula.slice(0, start) + text + formula.slice(end)
    onChange(next)
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start + text.length, start + text.length) }, 0)
  }, [formula, onChange])

  const runTest = useCallback(() => {
    const result = evalWithMock(formula, selectedStudent.data)
    setTestResult(result); setRan(true)
  }, [formula, selectedStudent])

  const fieldOptions = useMemo(() => {
    if (!selectedModel) return []
    const opts: { path: string; label: string; type: FieldType; group: string }[] = []
    selectedModel.fields.forEach(f => opts.push({ path: `${selectedModel.id}.${f.name}`, label: f.name, type: f.type, group: "Standards" }))
    selectedModel.cfFields.forEach(f => opts.push({ path: `${selectedModel.id}.cf.${f.name}`, label: `cf.${f.name}`, type: f.type, group: "Personnalisés (cf)" }))
    selectedModel.relations.forEach(rel => {
      const target = MODEL_MAP[rel.target]
      if (!target) return
      target.fields.slice(0, 5).forEach(f => opts.push({ path: `${selectedModel.id}.${rel.name}.${f.name}`, label: `${rel.name}.${f.name}`, type: f.type, group: `↗ ${rel.target}` }))
      target.cfFields.slice(0, 2).forEach(f => opts.push({ path: `${selectedModel.id}.${rel.name}.cf.${f.name}`, label: `${rel.name}.cf.${f.name}`, type: f.type, group: `↗ ${rel.target} cf` }))
    })
    return opts
  }, [selectedModel])

  const statusColor = validation.status === "valid" ? "#10B981" : validation.status === "invalid" ? "#EF4444" : validation.status === "warning" ? "#F59E0B" : "rgba(255,255,255,0.25)"

  // Calc key button
  function CalcKey({ label, val, color, wide = false }: { label: string; val: string; color: string; wide?: boolean }) {
    return (
      <motion.button
        whileTap={{ scale: 0.88, transition: { duration: 0.08 } }}
        whileHover={{ scale: 1.06, transition: { duration: 0.1 } }}
        onClick={() => insert(val)}
        className={`flex items-center justify-center rounded-xl font-bold font-mono select-none${wide ? " col-span-2" : ""}`}
        style={{
          height: 36,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          color,
          fontSize: 13,
          letterSpacing: "0.01em",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${color}15`; e.currentTarget.style.borderColor = `${color}35` }}
        onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)" }}>
        {label}
      </motion.button>
    )
  }

  // Function/condition pill button
  function PillKey({ label, val, color }: { label: string; val: string; color: string }) {
    return (
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => insert(val)}
        className="flex items-center justify-center rounded-lg px-2 font-mono text-[9px] font-bold w-full truncate"
        style={{
          height: 28,
          background: `${color}0d`,
          border: `1px solid ${color}25`,
          color,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}45` }}
        onMouseLeave={e => { e.currentTarget.style.background = `${color}0d`; e.currentTarget.style.borderColor = `${color}25` }}>
        {label}
      </motion.button>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4" style={{ alignItems: "flex-start" }}>

      {/* ═══ COL LEFT — selects + scope + vars + test ═══ */}
      <div className="flex flex-col gap-3 w-full lg:w-64 lg:flex-shrink-0">

        {/* SELECT — Model */}
        <div className="flex flex-col gap-1">
          <label className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>① Modèle</label>
          <div className="relative">
            <select
              value={selectedModel?.id ?? ""}
              onChange={e => { setSelectedModel(MODELS.find(x => x.id === e.target.value) ?? null); setPickedField("") }}
              className="w-full appearance-none rounded-xl px-3 py-3 pr-9 text-[12px] font-semibold outline-none cursor-pointer"
              style={{
                background: selectedModel ? `${selectedModel.color}12` : "rgba(255,255,255,0.04)",
                border: `1px solid ${selectedModel ? selectedModel.color + "35" : "rgba(255,255,255,0.1)"}`,
                color: selectedModel ? selectedModel.color : "rgba(255,255,255,0.4)",
              }}>
              <option value="" style={{ background: "#08111f" }}>— Modèle —</option>
              {MODELS.map(m => (
                <option key={m.id} value={m.id} style={{ background: "#08111f", color: "white" }}>
                  {m.icon}  {m.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
              style={{ color: selectedModel ? selectedModel.color : "rgba(255,255,255,0.25)" }} />
          </div>
          {selectedModel && (
            <div className="flex items-center gap-1.5 px-1">
              <span className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{selectedModel.appLabel}</span>
              <span className="text-[7px] rounded px-1.5 py-0.5 font-bold"
                style={{ background: `${selectedModel.color}18`, color: selectedModel.color }}>
                {selectedModel.fields.length + selectedModel.cfFields.length} champs
              </span>
            </div>
          )}
        </div>

        {/* SELECT — Field */}
        <AnimatePresence>
          {selectedModel && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-1">
              <label className="text-[8px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>② Champ</label>
              <div className="relative">
                <select
                  value={pickedField}
                  onChange={e => { if (e.target.value) { insert(e.target.value); setPickedField("") } }}
                  className="w-full appearance-none rounded-xl px-3 py-3 pr-9 text-[11px] font-mono outline-none cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)" }}>
                  <option value="" style={{ background: "#08111f" }}>— Champ —</option>
                  {Array.from(new Set(fieldOptions.map(o => o.group))).map(group => (
                    <optgroup key={group} label={group} style={{ background: "#08111f", color: "rgba(255,255,255,0.4)" }}>
                      {fieldOptions.filter(o => o.group === group).map(o => (
                        <option key={o.path} value={o.path} style={{ background: "#08111f", color: "white" }}>
                          {o.label}  [{o.type}]
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"
                  style={{ color: "rgba(255,255,255,0.25)" }} />
              </div>
              <div className="text-[8px] px-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                Sélectionner → insère dans la formule
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scope */}
        <div className="flex flex-col gap-1.5">
          <div className="text-[8px] uppercase tracking-widest font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>Scope</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5">
            {(Object.keys(SCOPE_LABELS) as FormulaScope[]).map(s => (
              <button key={s} onClick={() => setScope(s)}
                className="rounded-lg py-2 text-[9px] font-bold uppercase tracking-wide transition-all"
                style={scope === s
                  ? { background: `${SCOPE_COLORS[s]}15`, color: SCOPE_COLORS[s], border: `1px solid ${SCOPE_COLORS[s]}35` }
                  : { color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)", background: "transparent" }}>
                {SCOPE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Vars detected */}
        <AnimatePresence>
          {validation.vars.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-1">
              <div className="text-[8px] uppercase tracking-widest font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>
                Variables détectées
              </div>
              {validation.vars.map((v, i) => (
                <motion.button key={`${v.path}_${i}`} whileTap={{ scale: 0.97 }} onClick={() => insert(v.path)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 w-full text-left"
                  style={{ background: v.type ? "rgba(201,168,76,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${v.type ? "rgba(201,168,76,0.15)" : "rgba(239,68,68,0.2)"}` }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  {v.type && <FieldTypeIcon type={v.type} />}
                  <span className="text-[9px] font-mono flex-1 truncate" style={{ color: v.type ? "#C9A84C" : "#F87171" }}>{v.path}</span>
                  {v.type && <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>{v.type}</span>}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* divider */}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Test runner */}
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#07111d" }}>
          <div className="flex items-center justify-between px-3 py-2.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>
            <div className="flex items-center gap-1.5">
              <Play className="size-3" style={{ color: "#C9A84C" }} />
              <span className="text-[10px] font-bold text-white">Tester</span>
            </div>
            <div className="relative">
              <select
                value={selectedStudent.id}
                onChange={e => { setSelectedStudent(MOCK_STUDENTS.find(s => s.id === e.target.value)!); setRan(false) }}
                className="appearance-none rounded-lg pl-2 pr-6 py-1 text-[9px] font-medium outline-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.1)" }}>
                {MOCK_STUDENTS.map(s => <option key={s.id} value={s.id} style={{ background: "#08111f" }}>{s.label}</option>)}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 size-2.5 pointer-events-none"
                style={{ color: "rgba(255,255,255,0.3)" }} />
            </div>
          </div>

          <div className="p-3 flex flex-col gap-1">
            {Object.entries(selectedStudent.data).map(([k, v]) => {
              const used = validation.vars.some(va => va.path === k)
              return (
                <div key={k} className="flex items-center justify-between rounded-lg px-2 py-1"
                  style={{ background: used ? "rgba(201,168,76,0.07)" : "rgba(255,255,255,0.02)", border: `1px solid ${used ? "rgba(201,168,76,0.18)" : "rgba(255,255,255,0.04)"}` }}>
                  <span className="text-[8px] font-mono truncate max-w-[130px]" style={{ color: used ? "#C9A84C" : "rgba(255,255,255,0.3)" }}>{k}</span>
                  <span className="text-[9px] font-bold tabular-nums" style={{ color: used ? "white" : "rgba(255,255,255,0.3)" }}>{v}</span>
                </div>
              )
            })}
          </div>

          <div className="px-3 pb-3 flex gap-2">
            <motion.button whileTap={{ scale: 0.94 }} onClick={runTest}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-[10px] font-bold"
              style={{ background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#050d18" }}>
              <Play className="size-3" />Exécuter
            </motion.button>
            <AnimatePresence>
              {ran && testResult !== null && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="flex items-center gap-1.5 rounded-lg px-3"
                  style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)" }}>
                  <span className="text-[15px] font-bold tabular-nums"
                    style={{ color: "#C9A84C", textShadow: "0 0 20px rgba(201,168,76,0.5)" }}>
                    {testResult}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 px-3 pb-3">
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[9px] font-bold"
              style={saved
                ? { background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.25)" }
                : { color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {saved ? <CheckCircle2 className="size-3" /> : <Save className="size-3" />}
              {saved ? "Sauvegardé" : "Sauvegarder"}
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => navigator.clipboard.writeText(formula)}
              className="rounded-lg px-3 py-1.5 text-[9px] flex items-center gap-1"
              style={{ color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => e.currentTarget.style.color = "white"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.3)"}>
              <Copy className="size-3" />Copier
            </motion.button>
          </div>
        </div>
      </div>

      {/* ═══ COL RIGHT — Single calculator block: screen + keypad ═══ */}
      <div className="w-full lg:flex-1 rounded-2xl overflow-hidden"
        style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.1)" }}>

        {/* ── SCREEN (top of calculator) ── */}
        <div style={{ background: "#050d18", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Titlebar */}
          <div className="flex items-center justify-between px-4 py-2.5"
            style={{ background: "rgba(0,0,0,0.4)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {["#EF4444","#F59E0B","#10B981"].map(c => (
                  <div key={c} className="size-2.5 rounded-full" style={{ background: c + "70" }} />
                ))}
              </div>
              <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>formule.fiinor</span>
            </div>
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {validation.status !== "idle" && (
                  <motion.span initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="text-[8px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                    style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>
                    {validation.status === "valid" ? "✓ Valide" : validation.status === "invalid" ? "✗ Erreur" : "⚠ Avert."}
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => { onChange(""); setRan(false) }}
                className="rounded-lg p-1.5"
                style={{ color: "rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.04)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "#EF4444"; e.currentTarget.style.background = "rgba(239,68,68,0.1)" }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.2)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}>
                <RotateCcw className="size-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Formula textarea */}
          <textarea
            ref={textareaRef}
            value={formula}
            onChange={e => onChange(e.target.value)}
            rows={3}
            spellCheck={false}
            className="w-full resize-none outline-none font-mono leading-relaxed px-5 py-4"
            style={{ background: "transparent", color: "#E8C97A", caretColor: "#C9A84C", fontSize: 16 }}
            placeholder="(note.valeur * evaluation.coefficient) / 20" />

          {/* Status + vars */}
          <div className="px-5 pb-4">
            <div className="text-[10px] font-medium mb-2" style={{ color: statusColor }}>{validation.message}</div>
            {validation.vars.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {validation.vars.map((v, i) => (
                  <motion.span key={`${v.path}_${i}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    onClick={() => insert(v.path)}
                    className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-mono cursor-pointer"
                    style={{ background: v.type ? "rgba(201,168,76,0.1)" : "rgba(239,68,68,0.1)", color: v.type ? "#C9A84C" : "#F87171", border: `1px solid ${v.type ? "rgba(201,168,76,0.25)" : "rgba(239,68,68,0.25)"}` }}>
                    {v.type && <FieldTypeIcon type={v.type} />}{v.path}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── KEYPAD (directly below screen, same card) ── */}
        <div className="p-3 flex flex-col gap-3">

          {/* Digits — 4 cols like a real calculator: 7 8 9 ⌫ / 4 5 6 . / 1 2 3 ( / 0 00 ) = */}
          <div>
            <div className="text-[7px] uppercase tracking-widest font-bold mb-1.5 px-0.5"
              style={{ color: "rgba(255,255,255,0.25)" }}>Chiffres</div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "7", val: "7" }, { label: "8", val: "8" }, { label: "9", val: "9" },
                { label: "⌫", val: "__BACK__" },
                { label: "4", val: "4" }, { label: "5", val: "5" }, { label: "6", val: "6" },
                { label: ".", val: "." },
                { label: "1", val: "1" }, { label: "2", val: "2" }, { label: "3", val: "3" },
                { label: "(", val: "(" },
                { label: "0", val: "0" }, { label: "00", val: "00" }, { label: ")", val: ")" },
                { label: "C", val: "__CLEAR__" },
              ].map(k => {
                const isBack  = k.val === "__BACK__"
                const isClear = k.val === "__CLEAR__"
                const isDigit = /^\d+$/.test(k.val) || k.val === "."
                const color   = isClear ? "#EF4444" : isBack ? "#F59E0B" : isDigit ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.5)"
                return (
                  <motion.button key={k.label}
                    whileTap={{ scale: 0.85, transition: { duration: 0.07 } }}
                    whileHover={{ scale: 1.07, transition: { duration: 0.1 } }}
                    onClick={() => {
                      if (isClear) { onChange(""); setRan(false); return }
                      if (isBack) {
                        const ta = textareaRef.current
                        if (ta) {
                          const s = ta.selectionStart ?? formula.length
                          const e2 = ta.selectionEnd ?? formula.length
                          if (s !== e2) { onChange(formula.slice(0, s) + formula.slice(e2)) }
                          else if (s > 0) { onChange(formula.slice(0, s - 1) + formula.slice(s)); setTimeout(() => ta.setSelectionRange(s - 1, s - 1), 0) }
                        } else { onChange(formula.slice(0, -1)) }
                        return
                      }
                      insert(k.val)
                    }}
                    className="flex items-center justify-center rounded-xl font-bold font-mono select-none"
                    style={{ height: 36, background: isClear ? "rgba(239,68,68,0.08)" : isBack ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${isClear ? "rgba(239,68,68,0.18)" : isBack ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.08)"}`, color, fontSize: 13 }}
                    onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}40` }}
                    onMouseLeave={e => { e.currentTarget.style.background = isClear ? "rgba(239,68,68,0.08)" : isBack ? "rgba(245,158,11,0.08)" : "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = isClear ? "rgba(239,68,68,0.18)" : isBack ? "rgba(245,158,11,0.18)" : "rgba(255,255,255,0.08)" }}>
                    {k.label}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Operators — 4 cols grid, big square keys */}
          <div>
            <div className="text-[7px] uppercase tracking-widest font-bold mb-1.5 px-0.5"
              style={{ color: "rgba(255,255,255,0.25)" }}>Opérateurs</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-1.5">
              {CALC_OPS.map(op => <CalcKey key={op.label} {...op} />)}
            </div>
          </div>

          {/* Functions — 3 cols */}
          <div>
            <div className="text-[7px] uppercase tracking-widest font-bold mb-1.5 px-0.5"
              style={{ color: "rgba(255,255,255,0.25)" }}>Fonctions</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {CALC_FUNS.map(fn => <PillKey key={fn.val} {...fn} />)}
            </div>
          </div>

          {/* Conditions — 2 cols */}
          <div>
            <div className="text-[7px] uppercase tracking-widest font-bold mb-1.5 px-0.5"
              style={{ color: "rgba(255,255,255,0.25)" }}>Conditions</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5">
              {CALC_CONDS.map(c => <PillKey key={c.val} {...c} />)}
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

/* ═══════════════════════════════════════════
   FORMULA LIBRARY
═══════════════════════════════════════════ */

function FormulaLibrary({ onUse }: { onUse: (f: string) => void }) {
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null)

  return (
    <div className="grid grid-cols-[1fr_320px] gap-4">
      <div className="flex flex-col gap-2">
        <div className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          {TEMPLATES.length} formules de référence — cliquez pour voir les détails
        </div>
        {TEMPLATES.map((t, i) => {
          const active = selected?.id === t.id
          return (
            <motion.button key={t.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(active ? null : t)}
              className="flex items-start gap-4 rounded-xl p-4 text-left transition-all"
              style={{ background: active ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${active ? "rgba(201,168,76,0.25)" : "rgba(255,255,255,0.07)"}` }}>
              <div className="flex size-8 items-center justify-center rounded-lg flex-shrink-0"
                style={{ background: `${SCOPE_COLORS[t.scope]}12`, border: `1px solid ${SCOPE_COLORS[t.scope]}25` }}>
                <Calculator className="size-4" style={{ color: SCOPE_COLORS[t.scope] }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-bold text-white">{t.label}</span>
                  <span className="rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider"
                    style={{ background: `${SCOPE_COLORS[t.scope]}15`, color: SCOPE_COLORS[t.scope], border: `1px solid ${SCOPE_COLORS[t.scope]}25` }}>
                    {SCOPE_LABELS[t.scope]}
                  </span>
                </div>
                <code className="text-[10px] font-mono" style={{ color: "rgba(201,168,76,0.7)" }}>{t.formula}</code>
              </div>
              <ArrowRight className="size-4 flex-shrink-0 mt-1" style={{ color: active ? "#C9A84C" : "rgba(255,255,255,0.15)" }} />
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {selected ? (
          <motion.div key={selected.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl p-5 flex flex-col gap-4 h-fit sticky top-0"
            style={{ background: "#080f1c", border: "1px solid rgba(201,168,76,0.2)" }}>
            <div className="text-[11px] font-bold text-white">{selected.label}</div>
            <div className="rounded-lg p-3 font-mono text-[11px] leading-relaxed"
              style={{ background: "rgba(0,0,0,0.4)", color: "#E8C97A", border: "1px solid rgba(201,168,76,0.12)", wordBreak: "break-all" }}>
              {selected.formula}
            </div>
            {/* Variables used */}
            <div>
              <div className="text-[8px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Chemins de modèles</div>
              {extractPaths(selected.formula).map(p => (
                <div key={p} className="flex items-center gap-2 mb-1">
                  <div className="size-1.5 rounded-full flex-shrink-0" style={{ background: "#C9A84C" }} />
                  <code className="text-[9px] font-mono" style={{ color: "#C9A84C" }}>{p}</code>
                  {resolvePathType(p) && <span className="text-[7px] ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>{resolvePathType(p)}</span>}
                </div>
              ))}
            </div>
            <motion.button whileTap={{ scale: 0.97 }} onClick={() => onUse(selected.formula)}
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[11px] font-bold"
              style={{ background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#0a0f1a" }}>
              <Zap className="size-3.5" />Utiliser dans l'éditeur
            </motion.button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-xl flex flex-col items-center justify-center p-8 text-center"
            style={{ border: "1px dashed rgba(255,255,255,0.07)" }}>
            <BookOpen className="size-8 mb-3" style={{ color: "rgba(255,255,255,0.1)" }} />
            <div className="text-[11px] text-white/25">Sélectionnez un template</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════
   AUDIT LOG
═══════════════════════════════════════════ */

function AuditLog() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-[9px] uppercase tracking-wider mb-3 font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>Exécutions / 6 jours</div>
          <ResponsiveContainer width="100%" height={130}>
            <AreaChart data={AUDIT_CHART}>
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <RechartTooltip contentStyle={{ background: "#0b1420", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 10 }} />
              <Area type="monotone" dataKey="exec" stroke="#C9A84C" strokeWidth={2} fill="url(#ag)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-[9px] uppercase tracking-wider mb-3 font-bold" style={{ color: "rgba(255,255,255,0.3)" }}>Formules actives</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={AUDIT_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <RechartTooltip contentStyle={{ background: "#0b1420", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 10 }} />
              <Bar dataKey="formules" fill="#3B82F6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-4 py-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[11px] font-bold text-white">Journal des modifications</span>
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>Immuable · {AUDIT_LOG.length} entrées</span>
        </div>
        {AUDIT_LOG.map((e, i) => {
          const st = ACTION_ST[e.action]
          return (
            <motion.div key={e.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="size-1.5 rounded-full flex-shrink-0" style={{ background: st.color }} />
              <div className="flex-1 min-w-0">
                <code className="text-[10px] font-mono truncate block" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {e.formula.length > 55 ? e.formula.slice(0, 55) + "…" : e.formula}
                </code>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{e.author}</span>
                  <span className="rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase"
                    style={{ background: `${SCOPE_COLORS[e.scope]}12`, color: SCOPE_COLORS[e.scope] }}>{SCOPE_LABELS[e.scope]}</span>
                </div>
              </div>
              {e.result !== undefined && <span className="text-[11px] font-bold tabular-nums" style={{ color: "#C9A84C" }}>→ {e.result}</span>}
              <span className="rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider flex-shrink-0"
                style={{ background: st.bg, color: st.color }}>{st.label}</span>
              <span className="text-[8px] flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>{e.date}</span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
