"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  CheckCircle2, AlertTriangle, XCircle, Save, Download,
  Search, ArrowUpDown, ChevronUp, ChevronDown, RotateCcw,
  Users, Pencil, Lock, Unlock, ClipboardCheck, Filter,
  Keyboard, SkipForward,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Evaluation } from "./EvaluationsList"

/* ─── Types ─── */
interface Eleve {
  id: string
  nom: string
  prenom: string
  matricule: string
  note: string       // "" = non saisi
  absent: boolean
  commentaire: string
}

type SortKey = "nom" | "note" | "matricule"
type SortDir = "asc" | "desc"
type FilterMode = "tous" | "saisi" | "non_saisi" | "absent"

/* ─── Mock students generator ─── */
const PRENOMS = ["Alpha","Mariama","Ibrahima","Fatoumata","Mamadou","Aissatou","Ousmane","Kadiatou","Seydou","Aminata","Thierno","Bintou","Boubacar","Mariam","Lansana","Hawa","Aboubacar","Safiatou","Moussa","Ramata","Cheick","Rokhaya","Fodé","Nènè","Souleymane","Coumba","Elhadj","Penda","Mouctar","Djénébou"]
const NOMS    = ["Diallo","Barry","Bah","Camara","Kouyaté","Sylla","Traoré","Conté","Souaré","Baldé","Sow","Keïta","Konaté","Touré","Sidibé","Cissé","Magassouba","Guilavogui","Millimono","Loua"]

function generateEleves(n: number): Eleve[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `el${i + 1}`,
    nom: NOMS[i % NOMS.length],
    prenom: PRENOMS[i % PRENOMS.length],
    matricule: `FIN-${String(2024000 + i + 1)}`,
    note: "",
    absent: false,
    commentaire: "",
  }))
}

/* ─── Constants ─── */
const MOCK_ELEVES_BY_CLASS: Record<string, Eleve[]> = {
  "Terminale A":  generateEleves(34),
  "Terminale B":  generateEleves(31),
  "Terminale C":  generateEleves(27),
  "Terminale D":  generateEleves(31),
  "1ère A":       generateEleves(33),
  "1ère C":       generateEleves(29),
  "2nde B":       generateEleves(38),
  "BTS Info 1":   generateEleves(25),
  "BTS Info 2":   generateEleves(22),
  "BTS Compta":   generateEleves(18),
}

/* ─── Row animation ─── */
const rowV = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.018, type: "spring" as const, stiffness: 380, damping: 30 },
  }),
}

/* ─── Note cell ─── */
function NoteInput({
  eleve, noteMax, onChange, onKeyDown, inputRef,
}: {
  eleve: Eleve
  noteMax: number
  onChange: (val: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  inputRef: (el: HTMLInputElement | null) => void
}) {
  const num = parseFloat(eleve.note)
  const invalid = eleve.note !== "" && (isNaN(num) || num < 0 || num > noteMax)
  const color = eleve.absent
    ? "rgba(255,255,255,0.2)"
    : eleve.note === ""
    ? "rgba(255,255,255,0.45)"
    : invalid
    ? "#EF4444"
    : num >= noteMax * 0.5
    ? "#10B981"
    : "#F59E0B"

  return (
    <div className="relative flex items-center gap-1">
      <input
        ref={inputRef}
        type="number"
        min={0}
        max={noteMax}
        step={0.25}
        value={eleve.note}
        disabled={eleve.absent}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="—"
        className="w-16 rounded-lg px-2 py-1 text-center text-[12px] font-bold font-mono outline-none transition-all"
        style={{
          background: eleve.absent ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${invalid ? "rgba(239,68,68,0.4)" : eleve.note !== "" ? `${color}35` : "rgba(255,255,255,0.1)"}`,
          color,
          caretColor: "#C9A84C",
        }}
      />
      <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>/{noteMax}</span>
      {invalid && (
        <div className="absolute -top-5 left-0 rounded px-1.5 py-0.5 text-[8px] font-bold z-10 whitespace-nowrap"
          style={{ background: "rgba(239,68,68,0.9)", color: "white" }}>
          0 – {noteMax}
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ─── */
export function NoteSaisieGrid({ evaluation }: { evaluation: Evaluation }) {
  const initial = useMemo(() => MOCK_ELEVES_BY_CLASS[evaluation.classe] ?? generateEleves(20), [evaluation.classe])
  const [eleves, setEleves] = useState<Eleve[]>(() => initial.map(e => ({ ...e })))
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("nom")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [filterMode, setFilterMode] = useState<FilterMode>("tous")
  const [saved, setSaved] = useState(false)
  const [locked, setLocked] = useState(false)
  const [bulkNote, setBulkNote] = useState("")

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  /* stats */
  const nbSaisis = eleves.filter(e => !e.absent && e.note !== "").length
  const nbAbsents = eleves.filter(e => e.absent).length
  const eligible = eleves.filter(e => !e.absent).length
  const pct = eligible === 0 ? 0 : Math.round((nbSaisis / eligible) * 100)
  const notes = eleves.filter(e => !e.absent && e.note !== "").map(e => parseFloat(e.note)).filter(n => !isNaN(n))
  const moyenne = notes.length ? (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(2) : "—"
  const noteMin = notes.length ? Math.min(...notes).toFixed(2) : "—"
  const noteMax2 = notes.length ? Math.max(...notes).toFixed(2) : "—"
  const tauxReussite = notes.length
    ? Math.round((notes.filter(n => n >= evaluation.noteMax * 0.5).length / notes.length) * 100)
    : 0

  /* update helpers */
  const updateEleve = useCallback((id: string, patch: Partial<Eleve>) => {
    setEleves(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e))
    setSaved(false)
  }, [])

  /* keyboard navigation: Enter / Tab → next row */
  const sortedFiltered = useMemo(() => {
    let list = [...eleves]
    if (search) list = list.filter(e =>
      `${e.nom} ${e.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
      e.matricule.toLowerCase().includes(search.toLowerCase()))
    if (filterMode === "saisi") list = list.filter(e => !e.absent && e.note !== "")
    if (filterMode === "non_saisi") list = list.filter(e => !e.absent && e.note === "")
    if (filterMode === "absent") list = list.filter(e => e.absent)
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === "nom") cmp = `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`)
      else if (sortKey === "matricule") cmp = a.matricule.localeCompare(b.matricule)
      else if (sortKey === "note") {
        const an = parseFloat(a.note) || -1
        const bn = parseFloat(b.note) || -1
        cmp = an - bn
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return list
  }, [eleves, search, filterMode, sortKey, sortDir])

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>, id: string) {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault()
      const idx = sortedFiltered.findIndex(el => el.id === id)
      const next = sortedFiltered.slice(idx + 1).find(el => !el.absent)
      if (next) inputRefs.current[next.id]?.focus()
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      const idx = sortedFiltered.findIndex(el => el.id === id)
      const next = sortedFiltered[idx + 1]
      if (next) inputRefs.current[next.id]?.focus()
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      const idx = sortedFiltered.findIndex(el => el.id === id)
      const prev = sortedFiltered[idx - 1]
      if (prev) inputRefs.current[prev.id]?.focus()
    }
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  function handleBulkFill() {
    const n = parseFloat(bulkNote)
    if (isNaN(n) || n < 0 || n > evaluation.noteMax) return
    setEleves(prev => prev.map(e => e.absent ? e : { ...e, note: bulkNote }))
    setBulkNote("")
    setSaved(false)
  }

  function handleReset() {
    setEleves(prev => prev.map(e => ({ ...e, note: "", absent: false, commentaire: "" })))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ArrowUpDown className="size-3 opacity-30" />
    return sortDir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />
  }

  const FILTERS: { key: FilterMode; label: string; count: number }[] = [
    { key: "tous",      label: "Tous",       count: eleves.length },
    { key: "non_saisi", label: "À saisir",   count: eleves.filter(e => !e.absent && e.note === "").length },
    { key: "saisi",     label: "Saisis",     count: nbSaisis },
    { key: "absent",    label: "Absents",    count: nbAbsents },
  ]

  return (
    <div className="flex flex-col gap-4">

      {/* ── Eval info banner ── */}
      <div className="rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4"
        style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-white truncate">{evaluation.titre}</div>
          <div className="flex flex-wrap gap-3 mt-1">
            {[
              { icon: Users,    val: evaluation.classe },
              { icon: Pencil,   val: evaluation.matiere },
              { icon: ClipboardCheck, val: `Coeff ×${evaluation.coefficient}` },
              { icon: ClipboardCheck, val: `/${evaluation.noteMax}` },
            ].map(({ icon: Icon, val }) => (
              <span key={val} className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                <Icon className="size-3" />{val}
              </span>
            ))}
          </div>
        </div>

        {/* Live KPIs */}
        <div className="flex gap-4 flex-wrap">
          {[
            { label: "Moyenne",  val: moyenne,          color: "#C9A84C" },
            { label: "Min",      val: noteMin,          color: "#F59E0B" },
            { label: "Max",      val: noteMax2,         color: "#10B981" },
            { label: "Réussite", val: `${tauxReussite}%`, color: tauxReussite >= 50 ? "#10B981" : "#EF4444" },
          ].map(k => (
            <div key={k.label} className="text-center">
              <div className="text-[18px] font-bold tabular-nums leading-none" style={{ color: k.color }}>{k.val}</div>
              <div className="text-[8px] uppercase tracking-widest mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
            Progression de la saisie
          </span>
          <span className="text-[10px] font-bold tabular-nums" style={{ color: pct === 100 ? "#10B981" : "#C9A84C" }}>
            {nbSaisis} / {eligible} élèves · {pct}%
          </span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 5, background: "rgba(255,255,255,0.06)" }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ height: "100%", background: pct === 100 ? "#10B981" : "linear-gradient(90deg,#C9A84C,#E8C97A)", borderRadius: 9999 }} />
        </div>
        <div className="flex gap-3">
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {nbAbsents} absent{nbAbsents > 1 ? "s" : ""}
          </span>
          {pct === 100 && (
            <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-[9px] font-bold" style={{ color: "#10B981" }}>
              <CheckCircle2 className="size-3" />Saisie complète
            </motion.span>
          )}
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col gap-2">
        {/* Row 1: search + filter chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[130px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3" style={{ color: "rgba(255,255,255,0.25)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nom, prénom, matricule…"
              className="w-full rounded-xl pl-8 pr-3 py-1.5 text-[10px] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.8)" }} />
          </div>
          {/* Filter chips — scrollable on mobile */}
          <div className="flex gap-1 overflow-x-auto flex-shrink-0" style={{ scrollbarWidth: "none" }}>
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilterMode(f.key)}
                className="flex-shrink-0 rounded-lg px-2.5 py-1 text-[9px] font-bold flex items-center gap-1 transition-all"
                style={filterMode === f.key
                  ? { background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)" }
                  : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {f.label}
                <span className="rounded px-1 text-[8px]"
                  style={{ background: filterMode === f.key ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.06)" }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: bulk fill + actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Bulk fill */}
          <div className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 flex-1 min-w-[180px]"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-[9px] whitespace-nowrap" style={{ color: "rgba(255,255,255,0.3)" }}>Tout à</span>
            <input type="number" value={bulkNote} onChange={e => setBulkNote(e.target.value)}
              placeholder="note"
              className="flex-1 min-w-0 w-12 rounded-lg px-2 py-0.5 text-center text-[10px] font-mono outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }} />
            <motion.button whileTap={{ scale: 0.92 }} onClick={handleBulkFill}
              className="rounded-lg px-2 py-0.5 text-[9px] font-bold whitespace-nowrap"
              style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}>
              Appliquer
            </motion.button>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Reset */}
            <motion.button whileTap={{ scale: 0.92 }} onClick={handleReset}
              className="rounded-xl p-2 transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
              <RotateCcw className="size-3.5" />
            </motion.button>

            {/* Lock */}
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => setLocked(l => !l)}
              className="rounded-xl p-2 transition-all"
              style={{
                background: locked ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.04)",
                border: locked ? "1px solid rgba(239,68,68,0.2)" : "1px solid rgba(255,255,255,0.08)",
                color: locked ? "#EF4444" : "rgba(255,255,255,0.4)",
              }}>
              {locked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
            </motion.button>

            {/* Save */}
            <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-[10px] font-bold transition-all"
              style={saved
                ? { background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.3)" }
                : { background: "linear-gradient(135deg,#C9A84C,#E8C97A)", color: "#050d18" }}>
              {saved ? <CheckCircle2 className="size-3.5" /> : <Save className="size-3.5" />}
              <span className="hidden sm:inline">{saved ? "Sauvegardé" : "Sauvegarder"}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Keyboard hint ── */}
      <div className="flex items-center gap-2 px-1">
        <Keyboard className="size-3" style={{ color: "rgba(255,255,255,0.2)" }} />
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          Entrée / Tab → élève suivant · ↑↓ → naviguer · Espace → marquer absent
        </span>
      </div>

      {/* ── Grid ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

        {/* Sticky header — desktop only */}
        <div className="hidden sm:grid text-[9px] font-bold uppercase tracking-widest px-4 py-2.5 sticky top-0 z-10"
          style={{
            gridTemplateColumns: "2rem 1fr auto 8rem 8rem 1fr 2rem",
            background: "#07111d",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.3)",
          }}>
          <span>#</span>
          <button className="flex items-center gap-1 text-left hover:text-white/60 transition-colors" onClick={() => toggleSort("nom")}>
            Nom <SortIcon k="nom" />
          </button>
          <button className="flex items-center gap-1 text-left hover:text-white/60 transition-colors" onClick={() => toggleSort("matricule")}>
            Matricule <SortIcon k="matricule" />
          </button>
          <span>Note</span>
          <span>Absent</span>
          <span>Commentaire</span>
          <button className="flex items-center gap-1 hover:text-white/60 transition-colors" onClick={() => toggleSort("note")}>
            <SortIcon k="note" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
          {sortedFiltered.length === 0 ? (
            <div className="py-16 text-center text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              Aucun élève trouvé
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {sortedFiltered.map((el, i) => {
                const num = parseFloat(el.note)
                const invalid = el.note !== "" && (isNaN(num) || num < 0 || num > evaluation.noteMax)
                const noteColor = el.absent
                  ? "rgba(255,255,255,0.15)"
                  : el.note === ""
                  ? "rgba(255,255,255,0.4)"
                  : invalid
                  ? "#EF4444"
                  : num >= evaluation.noteMax * 0.5
                  ? "#10B981"
                  : "#F59E0B"
                const dotColor = el.absent ? "#EF4444" : el.note !== "" && !invalid ? "#10B981" : el.note !== "" && invalid ? "#F59E0B" : "rgba(255,255,255,0.1)"

                return (
                  <motion.div key={el.id} custom={i} variants={rowV} initial="hidden" animate="visible"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: el.absent ? "rgba(239,68,68,0.03)" : "transparent",
                    }}
                    onMouseEnter={e => { if (!el.absent) e.currentTarget.style.background = "rgba(255,255,255,0.02)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = el.absent ? "rgba(239,68,68,0.03)" : "transparent" }}>

                    {/* ── Desktop row (sm+) ── */}
                    <div className="hidden sm:grid items-center px-4 py-2"
                      style={{ gridTemplateColumns: "2rem 1fr auto 8rem 8rem 1fr 2rem" }}>

                      <span className="text-[9px] tabular-nums font-mono" style={{ color: "rgba(255,255,255,0.2)" }}>{i + 1}</span>

                      <div className="flex items-center gap-2 min-w-0">
                        <div className="size-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                          style={{ background: el.absent ? "rgba(239,68,68,0.12)" : "rgba(201,168,76,0.1)", color: el.absent ? "#EF4444" : "#C9A84C" }}>
                          {el.prenom[0]}{el.nom[0]}
                        </div>
                        <span className="text-[11px] font-semibold truncate" style={{ color: el.absent ? "rgba(255,255,255,0.3)" : "white" }}>
                          {el.prenom} {el.nom}
                        </span>
                      </div>

                      <span className="text-[9px] font-mono px-2" style={{ color: "rgba(255,255,255,0.3)" }}>{el.matricule}</span>

                      <div>
                        {locked ? (
                          <span className="text-[12px] font-bold font-mono" style={{ color: noteColor }}>
                            {el.absent ? "ABS" : el.note || "—"}
                          </span>
                        ) : (
                          <NoteInput eleve={el} noteMax={evaluation.noteMax}
                            onChange={val => updateEleve(el.id, { note: val })}
                            onKeyDown={e => handleKeyDown(e, el.id)}
                            inputRef={ref => { inputRefs.current[el.id] = ref }} />
                        )}
                      </div>

                      <div>
                        <button
                          onClick={() => updateEleve(el.id, { absent: !el.absent, note: !el.absent ? "" : el.note })}
                          disabled={locked}
                          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[9px] font-bold transition-all"
                          style={el.absent
                            ? { background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }
                            : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.07)" }}>
                          {el.absent ? <XCircle className="size-3" /> : <CheckCircle2 className="size-3" />}
                          {el.absent ? "Absent" : "Présent"}
                        </button>
                      </div>

                      <input value={el.commentaire} disabled={locked}
                        onChange={e => updateEleve(el.id, { commentaire: e.target.value })}
                        placeholder="Remarque…"
                        className="w-full rounded-lg px-2 py-1 text-[9px] outline-none transition-all"
                        style={{ background: "transparent", border: "1px solid transparent", color: "rgba(255,255,255,0.4)" }}
                        onFocus={e => e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)"}
                        onBlur={e => e.currentTarget.style.border = "1px solid transparent"} />

                      <div className="flex justify-center">
                        <div className="size-1.5 rounded-full" style={{ background: dotColor }} />
                      </div>
                    </div>

                    {/* ── Mobile card row ── */}
                    <div className="flex sm:hidden items-center gap-3 px-3 py-2.5">
                      {/* Avatar + status dot */}
                      <div className="relative flex-shrink-0">
                        <div className="size-8 rounded-full flex items-center justify-center text-[9px] font-bold"
                          style={{ background: el.absent ? "rgba(239,68,68,0.12)" : "rgba(201,168,76,0.1)", color: el.absent ? "#EF4444" : "#C9A84C" }}>
                          {el.prenom[0]}{el.nom[0]}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2"
                          style={{ background: dotColor, borderColor: "#07111d" }} />
                      </div>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-semibold truncate" style={{ color: el.absent ? "rgba(255,255,255,0.3)" : "white" }}>
                          {el.prenom} {el.nom}
                        </div>
                        <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{el.matricule}</div>
                      </div>

                      {/* Absent toggle — compact */}
                      <button
                        onClick={() => updateEleve(el.id, { absent: !el.absent, note: !el.absent ? "" : el.note })}
                        disabled={locked}
                        className="rounded-lg p-1.5 flex-shrink-0"
                        style={el.absent
                          ? { background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.25)" }
                          : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        {el.absent ? <XCircle className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                      </button>

                      {/* Note input */}
                      <div className="flex-shrink-0">
                        {locked ? (
                          <span className="text-[13px] font-bold font-mono w-14 text-center block" style={{ color: noteColor }}>
                            {el.absent ? "ABS" : el.note || "—"}
                          </span>
                        ) : (
                          <NoteInput eleve={el} noteMax={evaluation.noteMax}
                            onChange={val => updateEleve(el.id, { note: val })}
                            onKeyDown={e => handleKeyDown(e, el.id)}
                            inputRef={ref => { inputRefs.current[el.id] = ref }} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ── Footer summary ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex gap-4 text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          <span><span className="font-bold text-white">{eleves.length}</span> élèves total</span>
          <span><span className="font-bold" style={{ color: "#10B981" }}>{nbSaisis}</span> notes saisies</span>
          <span><span className="font-bold" style={{ color: "#EF4444" }}>{nbAbsents}</span> absents</span>
          <span><span className="font-bold" style={{ color: "#F59E0B" }}>{eligible - nbSaisis}</span> en attente</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          <Keyboard className="size-3" />
          Saisie rapide disponible
        </div>
      </div>
    </div>
  )
}
