"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus, Search, Filter, ChevronDown, X,
  ClipboardList, Calendar, BookOpen, Users, Hash,
  MoreHorizontal, Pencil, Trash2, PlayCircle, CheckCircle2,
  Clock, AlertCircle, Eye,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

/* ─── Types ─── */
export type EvalType = "DS" | "Examen" | "TP" | "Oral" | "Devoir" | "Rattrapage"
export type EvalStatus = "planifié" | "en cours" | "corrigé" | "clôturé"

export interface Evaluation {
  id: string
  titre: string
  type: EvalType
  matiere: string
  classe: string
  date: string
  coefficient: number
  noteMax: number
  status: EvalStatus
  nbEleves: number
  nbNotesSaisies: number
}

/* ─── Mock data ─── */
const TYPES: EvalType[] = ["DS", "Examen", "TP", "Oral", "Devoir", "Rattrapage"]
const TYPE_COLORS: Record<EvalType, string> = {
  DS: "#3B82F6",
  Examen: "#C9A84C",
  TP: "#10B981",
  Oral: "#A78BFA",
  Devoir: "#F97316",
  Rattrapage: "#EF4444",
}
const STATUS_CONFIG: Record<EvalStatus, { color: string; icon: React.ElementType; label: string }> = {
  "planifié":  { color: "#3B82F6", icon: Clock,         label: "Planifié" },
  "en cours":  { color: "#F59E0B", icon: PlayCircle,    label: "En cours" },
  "corrigé":   { color: "#10B981", icon: CheckCircle2,  label: "Corrigé" },
  "clôturé":   { color: "rgba(255,255,255,0.3)", icon: CheckCircle2, label: "Clôturé" },
}

export const MOCK_EVALS: Evaluation[] = [
  { id: "e1",  titre: "DS Mathématiques S2",       type: "DS",       matiere: "Mathématiques",        classe: "Terminale A",  date: "2026-05-03", coefficient: 2, noteMax: 20, status: "planifié",  nbEleves: 34, nbNotesSaisies: 0  },
  { id: "e2",  titre: "DS Physique-Chimie",         type: "DS",       matiere: "Physique-Chimie",      classe: "1ère C",       date: "2026-05-05", coefficient: 2, noteMax: 20, status: "planifié",  nbEleves: 29, nbNotesSaisies: 0  },
  { id: "e3",  titre: "TP Informatique - Réseau",   type: "TP",       matiere: "Informatique",         classe: "BTS Info 2",   date: "2026-05-06", coefficient: 1, noteMax: 20, status: "en cours",  nbEleves: 22, nbNotesSaisies: 14 },
  { id: "e4",  titre: "Oral Anglais",               type: "Oral",     matiere: "Anglais",              classe: "Terminale D",  date: "2026-05-08", coefficient: 1, noteMax: 20, status: "planifié",  nbEleves: 31, nbNotesSaisies: 0  },
  { id: "e5",  titre: "Examen Comptabilité S2",     type: "Examen",   matiere: "Comptabilité",         classe: "BTS Compta",   date: "2026-05-10", coefficient: 3, noteMax: 20, status: "corrigé",   nbEleves: 18, nbNotesSaisies: 18 },
  { id: "e6",  titre: "Devoir SVT Ch.4",            type: "Devoir",   matiere: "SVT",                  classe: "2nde B",       date: "2026-05-12", coefficient: 1, noteMax: 10, status: "planifié",  nbEleves: 38, nbNotesSaisies: 0  },
  { id: "e7",  titre: "Rattrapage Maths",           type: "Rattrapage","matiere": "Mathématiques",     classe: "Terminale B",  date: "2026-05-15", coefficient: 2, noteMax: 20, status: "planifié",  nbEleves: 8,  nbNotesSaisies: 0  },
  { id: "e8",  titre: "TP Chimie — Titrage",        type: "TP",       matiere: "Physique-Chimie",      classe: "Terminale C",  date: "2026-04-28", coefficient: 1, noteMax: 20, status: "clôturé",   nbEleves: 27, nbNotesSaisies: 27 },
  { id: "e9",  titre: "DS Histoire-Géographie",     type: "DS",       matiere: "Histoire-Géographie",  classe: "1ère A",       date: "2026-04-25", coefficient: 1, noteMax: 20, status: "corrigé",   nbEleves: 33, nbNotesSaisies: 33 },
  { id: "e10", titre: "Examen Algorithmique",       type: "Examen",   matiere: "Informatique",         classe: "BTS Info 1",   date: "2026-05-20", coefficient: 3, noteMax: 20, status: "planifié",  nbEleves: 25, nbNotesSaisies: 0  },
]

/* ─── Animation variants ─── */
const rowV = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, type: "spring" as const, stiffness: 300, damping: 28 } }),
}

/* ─── Sub-components ─── */
function TypeBadge({ type }: { type: EvalType }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
      style={{ background: `${TYPE_COLORS[type]}18`, color: TYPE_COLORS[type], border: `1px solid ${TYPE_COLORS[type]}30` }}>
      {type}
    </span>
  )
}

function StatusBadge({ status }: { status: EvalStatus }) {
  const cfg = STATUS_CONFIG[status]
  const Icon = cfg.icon
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold"
      style={{ background: `${cfg.color}12`, color: cfg.color, border: `1px solid ${cfg.color}28` }}>
      <Icon className="size-2.5" />{cfg.label}
    </span>
  )
}

function ProgressBar({ val, max }: { val: number; max: number }) {
  const pct = max === 0 ? 0 : Math.round((val / max) * 100)
  const color = pct === 100 ? "#10B981" : pct > 0 ? "#C9A84C" : "rgba(255,255,255,0.1)"
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.06)" }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ height: "100%", background: color, borderRadius: 9999 }} />
      </div>
      <span className="text-[9px] tabular-nums font-mono w-10 text-right" style={{ color: "rgba(255,255,255,0.35)" }}>
        {val}/{max}
      </span>
    </div>
  )
}

/* ─── Create / Edit Sheet ─── */
interface EvalFormData {
  titre: string; type: EvalType; matiere: string; classe: string;
  date: string; coefficient: string; noteMax: string;
}
const EMPTY_FORM: EvalFormData = { titre: "", type: "DS", matiere: "", classe: "", date: "", coefficient: "2", noteMax: "20" }
const MATIERES = ["Mathématiques","Physique-Chimie","Informatique","Anglais","Comptabilité","SVT","Histoire-Géographie","Algorithmique","Français"]
const CLASSES   = ["Terminale A","Terminale B","Terminale C","Terminale D","1ère A","1ère C","2nde B","BTS Info 1","BTS Info 2","BTS Compta"]

function EvalSheet({ open, onClose, initial }: {
  open: boolean; onClose: (saved?: Evaluation) => void; initial?: Evaluation | null
}) {
  const [form, setForm] = useState<EvalFormData>(initial ? {
    titre: initial.titre, type: initial.type, matiere: initial.matiere,
    classe: initial.classe, date: initial.date,
    coefficient: String(initial.coefficient), noteMax: String(initial.noteMax),
  } : EMPTY_FORM)

  const set = (k: keyof EvalFormData) => (v: string) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.titre.trim() && form.matiere && form.classe && form.date

  function handleSave() {
    if (!valid) return
    const saved: Evaluation = {
      id: initial?.id ?? `e${Date.now()}`,
      titre: form.titre.trim(),
      type: form.type,
      matiere: form.matiere,
      classe: form.classe,
      date: form.date,
      coefficient: Number(form.coefficient) || 1,
      noteMax: Number(form.noteMax) || 20,
      status: initial?.status ?? "planifié",
      nbEleves: initial?.nbEleves ?? 0,
      nbNotesSaisies: initial?.nbNotesSaisies ?? 0,
    }
    onClose(saved)
  }

  return (
    <Sheet open={open} onOpenChange={o => { if (!o) onClose() }}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0"
        style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.1)" }}>
        <SheetHeader className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <SheetTitle className="text-white text-base font-bold">
            {initial ? "Modifier l'évaluation" : "Nouvelle évaluation"}
          </SheetTitle>
          <SheetDescription style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
            Remplissez les informations de l'évaluation
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Titre */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
              Titre *
            </Label>
            <Input value={form.titre} onChange={e => set("titre")(e.target.value)}
              placeholder="Ex: DS Mathématiques S2"
              className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/25 focus:border-[#C9A84C]/50 focus:ring-0"
              style={{ fontSize: 13 }} />
          </div>

          {/* Type */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>
              Type *
            </Label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map(t => (
                <button key={t} onClick={() => set("type")(t)}
                  className="rounded-lg px-3 py-1.5 text-[10px] font-bold transition-all"
                  style={form.type === t
                    ? { background: `${TYPE_COLORS[t]}18`, color: TYPE_COLORS[t], border: `1px solid ${TYPE_COLORS[t]}40` }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Matière + Classe */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Matière *</Label>
              <Select value={form.matiere} onValueChange={v => v && set("matiere")(v)}>
                <SelectTrigger className="rounded-xl border-white/10 bg-white/5 text-white/80 text-[12px]">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent style={{ background: "#08111f", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {MATIERES.map(m => <SelectItem key={m} value={m} className="text-white/80 text-[12px]">{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Classe *</Label>
              <Select value={form.classe} onValueChange={v => v && set("classe")(v)}>
                <SelectTrigger className="rounded-xl border-white/10 bg-white/5 text-white/80 text-[12px]">
                  <SelectValue placeholder="Choisir…" />
                </SelectTrigger>
                <SelectContent style={{ background: "#08111f", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {CLASSES.map(c => <SelectItem key={c} value={c} className="text-white/80 text-[12px]">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date + Coeff + NoteMax */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5 col-span-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Date *</Label>
              <Input type="date" value={form.date} onChange={e => set("date")(e.target.value)}
                className="rounded-xl border-white/10 bg-white/5 text-white/80 text-[12px]" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Coeff</Label>
              <Input type="number" min="1" max="9" value={form.coefficient} onChange={e => set("coefficient")(e.target.value)}
                className="rounded-xl border-white/10 bg-white/5 text-white/80 text-[12px]" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.4)" }}>Note maximale</Label>
            <div className="flex gap-2">
              {[10, 20, 100].map(n => (
                <button key={n} onClick={() => set("noteMax")(String(n))}
                  className="flex-1 rounded-lg py-2 text-[11px] font-bold transition-all"
                  style={form.noteMax === String(n)
                    ? { background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.35)" }
                    : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  /{n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex gap-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <Button variant="outline" onClick={() => onClose()}
            className="flex-1 rounded-xl border-white/10 bg-transparent text-white/50 hover:bg-white/5">
            Annuler
          </Button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave} disabled={!valid}
            className="flex-1 rounded-xl py-2 text-[12px] font-bold transition-all"
            style={valid
              ? { background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#050d18" }
              : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed" }}>
            {initial ? "Enregistrer" : "Créer l'évaluation"}
          </motion.button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/* ─── Mobile card for one evaluation ─── */
function EvalCard({ ev, i, onSaisir, onDetail, onDelete }: {
  ev: Evaluation; i: number
  onSaisir?: (ev: Evaluation) => void
  onDetail?: (ev: Evaluation) => void
  onDelete: (id: string) => void
}) {
  const typeColor = TYPE_COLORS[ev.type]
  const cfg = STATUS_CONFIG[ev.status]
  const StatusIcon = cfg.icon
  const pct = ev.nbEleves === 0 ? 0 : Math.round((ev.nbNotesSaisies / ev.nbEleves) * 100)

  return (
    <motion.div custom={i} variants={rowV} initial="hidden" animate="visible" exit={{ opacity: 0, y: -6 }}
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.07)" }}>

      {/* Top row */}
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${typeColor}12`, border: `1px solid ${typeColor}25` }}>
          <ClipboardList className="size-4" style={{ color: typeColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-white leading-tight truncate">{ev.titre}</div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{ev.matiere}</span>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{ev.classe}</span>
          </div>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
          <TypeBadge type={ev.type} />
          <span className="flex items-center gap-1 text-[9px] font-semibold"
            style={{ color: cfg.color }}>
            <StatusIcon className="size-2.5" />{cfg.label}
          </span>
        </div>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <Calendar className="size-3" />
          {new Date(ev.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
        </span>
        <span className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <Hash className="size-3" />
          Coeff <span className="font-bold" style={{ color: "#C9A84C" }}>×{ev.coefficient}</span>
        </span>
        <span className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          <Users className="size-3" />{ev.nbEleves} élèves
        </span>
      </div>

      {/* Progress */}
      <ProgressBar val={ev.nbNotesSaisies} max={ev.nbEleves} />

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {ev.status !== "clôturé" && (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => onSaisir?.(ev)}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] font-bold"
            style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}>
            <Pencil className="size-3" />Saisir
          </motion.button>
        )}
        <motion.button whileTap={{ scale: 0.95 }}
          onClick={() => onDetail ? onDetail(ev) : undefined}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] font-bold"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Eye className="size-3" />Détails
        </motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => onDelete(ev.id)}
          className="rounded-xl p-2"
          style={{ background: "rgba(239,68,68,0.06)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.15)" }}>
          <Trash2 className="size-3.5" />
        </motion.button>
      </div>
    </motion.div>
  )
}

/* ─── Main Component ─── */
export function EvaluationsList({ onSaisir, onDetail }: { onSaisir?: (ev: Evaluation) => void; onDetail?: (ev: Evaluation) => void }) {
  const [evals, setEvals] = useState<Evaluation[]>(MOCK_EVALS)
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<EvalType | "">("")
  const [filterStatus, setFilterStatus] = useState<EvalStatus | "">("")
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editing, setEditing] = useState<Evaluation | null>(null)

  const filtered = evals.filter(ev => {
    const matchSearch = ev.titre.toLowerCase().includes(search.toLowerCase()) ||
      ev.matiere.toLowerCase().includes(search.toLowerCase()) ||
      ev.classe.toLowerCase().includes(search.toLowerCase())
    const matchType = !filterType || ev.type === filterType
    const matchStatus = !filterStatus || ev.status === filterStatus
    return matchSearch && matchType && matchStatus
  })

  function handleSheetClose(saved?: Evaluation) {
    if (saved) {
      setEvals(prev => prev.find(e => e.id === saved.id)
        ? prev.map(e => e.id === saved.id ? saved : e)
        : [saved, ...prev])
    }
    setSheetOpen(false)
    setEditing(null)
  }

  function handleDelete(id: string) {
    setEvals(prev => prev.filter(e => e.id !== id))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-[15px] font-bold text-white">{evals.length} évaluations</h2>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            {evals.filter(e => e.status === "planifié").length} planifiées ·{" "}
            {evals.filter(e => e.status === "en cours").length} en cours ·{" "}
            {evals.filter(e => e.status === "corrigé").length} corrigées
          </p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
          onClick={() => { setEditing(null); setSheetOpen(true) }}
          className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[11px] font-bold whitespace-nowrap"
          style={{ background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#050d18" }}>
          <Plus className="size-3.5" />Nouvelle évaluation
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        {/* Search + status row */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[140px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher…"
              className="w-full rounded-xl pl-9 pr-8 py-2 text-[11px] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }} />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="size-3" style={{ color: "rgba(255,255,255,0.3)" }} />
              </button>
            )}
          </div>
          <div className="relative flex-shrink-0">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as EvalStatus | "")}
              className="appearance-none rounded-xl pl-3 pr-7 py-2 text-[10px] outline-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
              <option value="">Tous statuts</option>
              {(Object.keys(STATUS_CONFIG) as EvalStatus[]).map(s => (
                <option key={s} value={s} style={{ background: "#08111f" }}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-3 pointer-events-none" style={{ color: "rgba(255,255,255,0.3)" }} />
          </div>
        </div>

        {/* Type filter chips — horizontally scrollable on mobile */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: "none" }}>
          <button onClick={() => setFilterType("")}
            className="flex-shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all"
            style={!filterType
              ? { background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }
              : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
            Tous
          </button>
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilterType(filterType === t ? "" : t)}
              className="flex-shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all"
              style={filterType === t
                ? { background: `${TYPE_COLORS[t]}18`, color: TYPE_COLORS[t], border: `1px solid ${TYPE_COLORS[t]}40` }
                : { background: "transparent", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop table — hidden on mobile */}
      <div className="hidden md:block rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
              {["Évaluation", "Type", "Matière", "Classe", "Date", "Coeff", "Saisie", "Statut", ""].map(h => (
                <TableHead key={h} className="text-[9px] font-bold uppercase tracking-widest py-3"
                  style={{ color: "rgba(255,255,255,0.3)" }}>{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-12 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Aucune évaluation trouvée
                  </TableCell>
                </TableRow>
              ) : filtered.map((ev, i) => (
                <motion.tr key={ev.id} custom={i} variants={rowV} initial="hidden" animate="visible" exit={{ opacity: 0, y: -6 }}
                  className="group"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="size-7 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${TYPE_COLORS[ev.type]}12`, border: `1px solid ${TYPE_COLORS[ev.type]}25` }}>
                        <ClipboardList className="size-3.5" style={{ color: TYPE_COLORS[ev.type] }} />
                      </div>
                      <span className="text-[11px] font-semibold text-white truncate max-w-[180px]">{ev.titre}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3"><TypeBadge type={ev.type} /></TableCell>
                  <TableCell className="py-3">
                    <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.55)" }}>{ev.matiere}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{ev.classe}</span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-[10px] font-mono tabular-nums" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {new Date(ev.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span className="text-[11px] font-bold" style={{ color: "#C9A84C" }}>×{ev.coefficient}</span>
                  </TableCell>
                  <TableCell className="py-3 min-w-[110px]">
                    <ProgressBar val={ev.nbNotesSaisies} max={ev.nbEleves} />
                  </TableCell>
                  <TableCell className="py-3"><StatusBadge status={ev.status} /></TableCell>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {ev.status !== "clôturé" && (
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => onSaisir?.(ev)}
                          className="rounded-lg p-1.5 transition-all"
                          style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C" }}
                          title="Saisir les notes">
                          <Pencil className="size-3.5" />
                        </motion.button>
                      )}
                      <motion.button whileTap={{ scale: 0.9 }}
                        onClick={() => onDetail ? onDetail(ev) : (setEditing(ev), setSheetOpen(true))}
                        className="rounded-lg p-1.5 transition-all"
                        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
                        title="Voir les détails">
                        <Eye className="size-3.5" />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(ev.id)}
                        className="rounded-lg p-1.5 transition-all"
                        style={{ background: "rgba(239,68,68,0.06)", color: "#EF4444" }}>
                        <Trash2 className="size-3.5" />
                      </motion.button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards — hidden on md+ */}
      <div className="flex flex-col gap-3 md:hidden">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[11px] rounded-2xl"
              style={{ color: "rgba(255,255,255,0.25)", border: "1px dashed rgba(255,255,255,0.08)" }}>
              Aucune évaluation trouvée
            </div>
          ) : filtered.map((ev, i) => (
            <EvalCard key={ev.id} ev={ev} i={i}
              onSaisir={onSaisir} onDetail={onDetail} onDelete={handleDelete} />
          ))}
        </AnimatePresence>
      </div>

      <EvalSheet open={sheetOpen} onClose={handleSheetClose} initial={editing} />
    </div>
  )
}
