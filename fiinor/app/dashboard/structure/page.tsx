"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Network, Users, Building2, TrendingUp, Search, Settings2, Plus, List, Globe, Terminal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { StructureNode } from "@/components/structure/StructureNode"
import { UnitDetailPanel } from "@/components/structure/UnitDetailPanel"
import { UnitTypeManager } from "@/components/structure/UnitTypeManager"
import { AddUnitModal } from "@/components/structure/AddUnitModal"
import { ConfigureUnitModal } from "@/components/structure/ConfigureUnitModal"
import { OrbitalView } from "@/components/structure/views/OrbitalView"
import { TerminalView } from "@/components/structure/views/TerminalView"
import { useStructureStore } from "@/lib/structure/useStructureStore"
import type { UniteStructurelle } from "@/lib/structure/types"

function countAll(units: UniteStructurelle[]): { total: number; effectif: number } {
  return units.reduce(
    (acc, u) => {
      const sub = countAll(u.children)
      return { total: acc.total + 1 + sub.total, effectif: acc.effectif + u.effectif }
    },
    { total: 0, effectif: 0 }
  )
}

function filterTree(units: UniteStructurelle[], query: string): UniteStructurelle[] {
  if (!query) return units
  return units.reduce<UniteStructurelle[]>((acc, u) => {
    const filteredChildren = filterTree(u.children, query)
    if (u.nom.toLowerCase().includes(query.toLowerCase()) || filteredChildren.length > 0) {
      acc.push({ ...u, children: filteredChildren })
    }
    return acc
  }, [])
}

export default function StructurePage() {
  const { racines, unitTypes } = useStructureStore()
  const [selected, setSelected] = useState<UniteStructurelle | null>(null)
  const [search, setSearch] = useState("")
  const [typeManagerOpen, setTypeManagerOpen] = useState(false)
  const [addUnitOpen, setAddUnitOpen] = useState(false)
  const [addUnitParent, setAddUnitParent] = useState<UniteStructurelle | null>(null)
  const [configureUnit, setConfigureUnit] = useState<UniteStructurelle | null>(null)
  const [configureOpen, setConfigureOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "orbital" | "terminal">("list")

  const stats = useMemo(() => countAll(racines), [racines])
  const filtered = useMemo(() => filterTree(racines, search), [racines, search])

  const topScore = useMemo(() => {
    const all: UniteStructurelle[] = []
    const flatten = (units: UniteStructurelle[]) => {
      units.forEach((u) => { all.push(u); flatten(u.children) })
    }
    flatten(racines)
    return all.filter((u) => u.typeId === "etablissement").sort((a, b) => b.score - a.score)[0]
  }, [racines])

  return (
    <div className="flex flex-1 flex-col gap-4 min-h-0">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#C9A84C]/15">
            <Network className="size-4 text-[#C9A84C]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Structure du Groupe</h1>
        </div>
        <p className="text-[12px] text-muted-foreground">
          Hiérarchie éducative — Réseau · Établissements · Facultés · Départements · Classes
        </p>
      </motion.div>

      {/* ── KPI Cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {[
          {
            label: "Unités totales",
            value: stats.total,
            icon: Building2,
            color: "#C9A84C",
          },
          {
            label: "Effectif total",
            value: stats.effectif.toLocaleString(),
            icon: Users,
            color: "#3B82F6",
          },
          {
            label: "Établissements",
            value: racines[0]?.children.length ?? 0,
            icon: Network,
            color: "#8B5CF6",
          },
          {
            label: "Meilleur score",
            value: topScore?.score ?? "—",
            icon: TrendingUp,
            color: "#10B981",
            sub: topScore?.nom,
          },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
            className="rounded-xl border border-white/10 bg-card/60 p-3 backdrop-blur-sm"
          >
            <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              <kpi.icon className="size-3" style={{ color: kpi.color }} />
              {kpi.label}
            </div>
            <div className="mt-1.5 text-[22px] font-bold leading-none" style={{ color: kpi.color }}>
              {kpi.value}
            </div>
            {kpi.sub && (
              <p className="mt-0.5 truncate text-[9px] text-muted-foreground">{kpi.sub}</p>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.18 }}
        className="flex flex-1 gap-4 min-h-0"
      >
        {/* Tree panel */}
        <div className="flex flex-1 flex-col rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden min-h-0">

          {/* Toolbar */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2 shrink-0">
            {/* View mode toggle */}
            <div className="flex items-center gap-0.5 rounded-md border border-border bg-muted/30 p-0.5">
              {([
                { id: "list", icon: List, label: "Liste" },
                { id: "orbital", icon: Globe, label: "Orbital" },
                { id: "terminal", icon: Terminal, label: "Terminal" },
              ] as const).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  title={label}
                  className={`flex size-6 items-center justify-center rounded transition-all ${
                    viewMode === id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3" />
                </button>
              ))}
            </div>

            <Separator orientation="vertical" className="h-5" />

            {viewMode === "list" && (
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une unité..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-7 pl-7 text-[11px]"
                />
              </div>
            )}

            <div className="ml-auto flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-[11px]"
                onClick={() => { setAddUnitParent(null); setAddUnitOpen(true) }}
              >
                <Plus className="size-3" />
                Ajouter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 px-2 text-[11px]"
                onClick={() => setTypeManagerOpen(true)}
              >
                <Settings2 className="size-3" />
                Types
              </Button>
            </div>
          </div>

          {/* View content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {viewMode === "list" && (
              <ScrollArea className="h-full p-2">
                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                    <Network className="size-8 opacity-20" />
                    <p className="text-[12px]">Aucune unité trouvée</p>
                  </div>
                ) : (
                  filtered.map((unit) => (
                    <StructureNode
                      key={unit.id}
                      unit={unit}
                      unitTypes={unitTypes}
                      depth={0}
                      onSelect={setSelected}
                      onAddChild={(parent) => { setAddUnitParent(parent); setAddUnitOpen(true) }}
                      onConfigure={(u) => { setConfigureUnit(u); setConfigureOpen(true) }}
                      selectedId={selected?.id}
                    />
                  ))
                )}
              </ScrollArea>
            )}

            {viewMode === "orbital" && (
              <OrbitalView
                units={racines}
                unitTypes={unitTypes}
                onSelect={setSelected}
                selectedId={selected?.id}
              />
            )}

            {viewMode === "terminal" && (
              <TerminalView
                units={racines}
                unitTypes={unitTypes}
                onSelect={setSelected}
                selectedId={selected?.id}
                onAddChild={(parent) => { setAddUnitParent(parent); setAddUnitOpen(true) }}
              />
            )}
          </div>
        </div>

        {/* Detail panel */}
        <UnitDetailPanel
          unit={selected}
          unitTypes={unitTypes}
          onClose={() => setSelected(null)}
          onSelectChild={setSelected}
        />
      </motion.div>

      {/* Modals */}
      <UnitTypeManager open={typeManagerOpen} onOpenChange={setTypeManagerOpen} />
      <AddUnitModal
        open={addUnitOpen}
        onOpenChange={setAddUnitOpen}
        parentUnit={addUnitParent}
      />
      <ConfigureUnitModal
        open={configureOpen}
        onOpenChange={setConfigureOpen}
        unit={configureUnit}
        onDeleted={() => setSelected(null)}
      />
    </div>
  )
}
