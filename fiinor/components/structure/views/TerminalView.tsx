"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import type { UniteStructurelle, UnitType } from "@/lib/structure/types"

interface TerminalViewProps {
  units: UniteStructurelle[]
  unitTypes: UnitType[]
  onSelect: (unit: UniteStructurelle) => void
  selectedId?: string
  onAddChild?: (unit: UniteStructurelle) => void
}

interface FlatRow {
  unit: UniteStructurelle
  depth: number
  isLast: boolean
  color: string
  icone: string
  typeName: string
  expanded: boolean
  hasChildren: boolean
  index: number
}

function flattenTree(
  units: UniteStructurelle[],
  unitTypes: UnitType[],
  expandedIds: Set<string>,
  depth = 0,
  rows: FlatRow[] = [],
  parentExpanded = true
): FlatRow[] {
  units.forEach((unit, i) => {
    const ut = unitTypes.find((t) => t.id === unit.typeId)
    const expanded = expandedIds.has(unit.id)
    const isLast = i === units.length - 1
    rows.push({
      unit,
      depth,
      isLast,
      color: ut?.couleur ?? "#888",
      icone: ut?.icone ?? "📁",
      typeName: ut?.nom ?? unit.typeId,
      expanded,
      hasChildren: unit.children.length > 0,
      index: rows.length,
    })
    if (expanded && unit.children.length > 0) {
      flattenTree(unit.children, unitTypes, expandedIds, depth + 1, rows, true)
    }
  })
  return rows
}

const SCAN_DELAY = 12 // ms between rows appearing

export function TerminalView({ units, unitTypes, onSelect, selectedId, onAddChild }: TerminalViewProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const s = new Set<string>()
    units.forEach((u) => s.add(u.id))
    return s
  })
  const [cursorIdx, setCursorIdx] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)
  const [typed, setTyped] = useState("")
  const [showHelp, setShowHelp] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const rows = flattenTree(units, unitTypes, expandedIds)

  // Scan-in animation on mount
  useEffect(() => {
    setVisibleCount(0)
    const interval = setInterval(() => {
      setVisibleCount((v) => {
        if (v >= rows.length) { clearInterval(interval); return v }
        return v + 1
      })
    }, SCAN_DELAY)
    return () => clearInterval(interval)
  }, [units.length])

  // Keyboard navigation
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (document.activeElement !== containerRef.current) return

    switch (e.key) {
      case "j": case "ArrowDown":
        e.preventDefault()
        setCursorIdx((i) => Math.min(i + 1, rows.length - 1))
        break
      case "k": case "ArrowUp":
        e.preventDefault()
        setCursorIdx((i) => Math.max(i - 1, 0))
        break
      case "Enter": {
        const row = rows[cursorIdx]
        if (row) onSelect(row.unit)
        break
      }
      case " ": {
        e.preventDefault()
        const row = rows[cursorIdx]
        if (row?.hasChildren) {
          setExpandedIds((s) => {
            const ns = new Set(s)
            if (ns.has(row.unit.id)) ns.delete(row.unit.id)
            else ns.add(row.unit.id)
            return ns
          })
        }
        break
      }
      case "a": {
        const row = rows[cursorIdx]
        if (row && onAddChild) onAddChild(row.unit)
        break
      }
      case "/":
        e.preventDefault()
        setTyped("")
        break
      case "?":
        setShowHelp((v) => !v)
        break
      case "Escape":
        setTyped("")
        setShowHelp(false)
        break
    }
  }, [rows, cursorIdx, onSelect, onAddChild])

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  // Ensure selected cursor is visible
  useEffect(() => {
    if (!selectedId) return
    const idx = rows.findIndex((r) => r.unit.id === selectedId)
    if (idx >= 0) setCursorIdx(idx)
  }, [selectedId])

  const filteredRows = typed
    ? rows.filter((r) => r.unit.nom.toLowerCase().includes(typed.toLowerCase()))
    : rows

  const scoreColor = (s: number) => s >= 90 ? "#10B981" : s >= 75 ? "#C9A84C" : "#EF4444"
  const trendColor = (t: string) => t.startsWith("+") ? "#10B981" : "#EF4444"

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className="relative flex h-full flex-col rounded-xl bg-[#0a0b0e] outline-none overflow-hidden"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-white/5 bg-[#111215] px-4 py-2">
        <div className="flex gap-1.5">
          <div className="size-2.5 rounded-full bg-[#FF5F57]" />
          <div className="size-2.5 rounded-full bg-[#FFBD2E]" />
          <div className="size-2.5 rounded-full bg-[#28C840]" />
        </div>
        <span className="flex-1 text-center text-[10px] text-white/30">
          fiinor — structure/{typed ? `search: ${typed}` : "ls -la"}
        </span>
        <button
          onClick={() => setShowHelp((v) => !v)}
          className="rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[9px] text-white/50 hover:bg-white/10 hover:text-white/80 transition-colors"
        >
          ? Aide
        </button>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-0 border-b border-white/5 bg-[#0d0e11] px-4 py-1">
        <span className="w-6 shrink-0" />
        <span className="flex-1 text-[9px] text-white/20 uppercase tracking-widest">Nom</span>
        <span className="w-24 shrink-0 text-right text-[9px] text-white/20 uppercase tracking-widest">Type</span>
        <span className="w-16 shrink-0 text-right text-[9px] text-white/20 uppercase tracking-widest">Effectif</span>
        <span className="w-12 shrink-0 text-right text-[9px] text-white/20 uppercase tracking-widest">Score</span>
        <span className="w-10 shrink-0 text-right text-[9px] text-white/20 uppercase tracking-widest">Trend</span>
        <span className="w-8 shrink-0 text-right text-[9px] text-white/20 uppercase tracking-widest">Sub</span>
      </div>

      {/* Shortcut hint strip */}
      <div className="border-b border-white/5 bg-[#0d0e11]/80 px-4 py-2">
        <p className="mb-1.5 text-[9px] text-white/35 font-medium">Vue hiérarchique interactive — cliquez sur une ligne pour voir ses détails</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {[
            { key: "Clic", desc: "Voir détails" },
            { key: "▶ Chevron", desc: "Ouvrir/fermer" },
            { key: "j / k", desc: "Navigation clavier" },
            { key: "Espace", desc: "Expand/réduire" },
            { key: "/ + texte", desc: "Rechercher" },
          ].map(({ key, desc }) => (
            <span key={key} className="flex items-center gap-1.5 text-[9px] text-white/50">
              <kbd className="rounded border border-white/20 bg-white/8 px-1.5 py-0.5 font-mono text-[9px] text-white/70">{key}</kbd>
              <span className="text-white/35">{desc}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-hide">
        {filteredRows.map((row, visIdx) => {
          const isCursor = cursorIdx === rows.indexOf(row)
          const isSelected = row.unit.id === selectedId

          return (
            <motion.div
              key={row.unit.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{
                opacity: visIdx < visibleCount ? 1 : 0,
                x: visIdx < visibleCount ? 0 : -4,
              }}
              transition={{ duration: 0.08 }}
              className="group flex cursor-pointer items-center gap-0 rounded px-2 py-[3px] transition-colors"
              style={{
                backgroundColor: isCursor
                  ? `${row.color}12`
                  : isSelected
                  ? `${row.color}08`
                  : "transparent",
                borderLeft: isCursor ? `2px solid ${row.color}` : "2px solid transparent",
              }}
              onClick={() => {
                setCursorIdx(rows.indexOf(row))
                onSelect(row.unit)
              }}
              onDoubleClick={() => {
                if (row.hasChildren) {
                  setExpandedIds((s) => {
                    const ns = new Set(s)
                    if (ns.has(row.unit.id)) ns.delete(row.unit.id)
                    else ns.add(row.unit.id)
                    return ns
                  })
                }
              }}
              title={row.hasChildren ? (row.expanded ? "Double-clic ou Espace pour réduire" : "Double-clic ou Espace pour ouvrir") : "Cliquez pour voir les détails"}
            >
              {/* Tree indent + connector */}
              <div className="flex shrink-0 items-center" style={{ paddingLeft: row.depth * 14 }}>
                <span className="text-[10px] text-white/10 select-none mr-0.5">
                  {row.depth > 0 ? (row.isLast ? "└" : "├") : ""}
                </span>
                {row.hasChildren ? (
                  <span
                    title={row.expanded ? "Réduire" : "Ouvrir"}
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedIds((s) => {
                        const ns = new Set(s)
                        if (ns.has(row.unit.id)) ns.delete(row.unit.id)
                        else ns.add(row.unit.id)
                        return ns
                      })
                    }}
                  >
                    <ChevronRight
                      className="size-2.5 transition-transform hover:opacity-100"
                      style={{
                        color: row.color,
                        opacity: 0.7,
                        transform: row.expanded ? "rotate(90deg)" : "rotate(0deg)",
                      }}
                    />
                  </span>
                ) : (
                  <span className="w-2.5" />
                )}
              </div>

              {/* Icon + Name */}
              <div className="flex flex-1 items-center gap-1.5 min-w-0 ml-1">
                <span className="text-[11px] leading-none shrink-0">{row.icone}</span>
                <span
                  className="truncate text-[11px] font-medium"
                  style={{ color: isSelected || isCursor ? row.color : "rgba(255,255,255,0.7)" }}
                >
                  {row.unit.nom}
                </span>
                {row.unit.ville && (
                  <span className="shrink-0 text-[9px] text-white/20">
                    {row.unit.flag} {row.unit.ville}
                  </span>
                )}
              </div>

              {/* Type */}
              <div className="w-24 shrink-0 text-right">
                <span
                  className="rounded px-1 py-0.5 text-[8px]"
                  style={{ backgroundColor: `${row.color}15`, color: row.color }}
                >
                  {row.typeName}
                </span>
              </div>

              {/* Effectif */}
              <div className="w-16 shrink-0 text-right text-[10px] text-white/30">
                {row.unit.effectif.toLocaleString()}
              </div>

              {/* Score */}
              <div
                className="w-12 shrink-0 text-right text-[10px] font-bold tabular-nums"
                style={{ color: scoreColor(row.unit.score) }}
              >
                {row.unit.score}
              </div>

              {/* Trend */}
              <div
                className="w-10 shrink-0 text-right text-[9px] font-semibold"
                style={{ color: trendColor(row.unit.trend) }}
              >
                {row.unit.trend}
              </div>

              {/* Sub count */}
              <div className="w-8 shrink-0 text-right text-[9px] text-white/20">
                {row.unit.children.length > 0 ? `${row.unit.children.length}↓` : "—"}
              </div>
            </motion.div>
          )
        })}

        {/* Scan cursor line */}
        {visibleCount < rows.length && (
          <div className="flex items-center gap-2 px-2 py-[3px]">
            <span className="text-[10px] text-white/30">▋</span>
            <div className="h-px flex-1 animate-pulse bg-white/10" />
          </div>
        )}
      </div>

      {/* Search bar */}
      {typed !== "" && (
        <div className="border-t border-white/5 bg-[#111215] px-4 py-1.5 flex items-center gap-2">
          <span className="text-[10px] text-white/30">/</span>
          <input
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Escape") setTyped("") }}
            className="flex-1 bg-transparent text-[11px] text-white/70 outline-none placeholder:text-white/20"
            placeholder="Recherche…"
          />
          <span className="text-[9px] text-white/20">{filteredRows.length} résultats</span>
        </div>
      )}

      {/* Status bar */}
      <div className="flex items-center gap-3 border-t border-white/5 bg-[#111215] px-4 py-1">
        <span className="text-[9px] text-white/40">
          {rows.length} unités affichées · ligne {cursorIdx + 1}/{rows.length}
        </span>
        <span className="ml-auto text-[9px] text-white/25">
          Tapez <kbd className="rounded border border-white/15 bg-white/5 px-1 text-white/50">/</kbd> pour rechercher
        </span>
      </div>

      {/* Help overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="rounded-xl border border-white/10 bg-[#111215] p-6 min-w-72"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-white/40">Raccourcis clavier</p>
              {[
                ["j / ↓", "Descendre"],
                ["k / ↑", "Monter"],
                ["Space", "Ouvrir/fermer"],
                ["Enter", "Sélectionner"],
                ["a", "Ajouter une sous-unité"],
                ["/", "Rechercher"],
                ["Esc", "Fermer la recherche"],
                ["?", "Aide"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-4 py-1">
                  <kbd className="min-w-16 rounded border border-white/10 bg-white/5 px-2 py-0.5 text-center text-[10px] text-white/60">{key}</kbd>
                  <span className="text-[11px] text-white/40">{desc}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
