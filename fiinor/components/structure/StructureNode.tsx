"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, Plus, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { UniteStructurelle, UnitType } from "@/lib/structure/types"

interface StructureNodeProps {
  unit: UniteStructurelle
  unitTypes: UnitType[]
  depth?: number
  onSelect: (unit: UniteStructurelle) => void
  onAddChild: (parent: UniteStructurelle) => void
  onConfigure: (unit: UniteStructurelle) => void
  selectedId?: string
}

export function StructureNode({
  unit,
  unitTypes,
  depth = 0,
  onSelect,
  onAddChild,
  onConfigure,
  selectedId,
}: StructureNodeProps) {
  const [expanded, setExpanded] = useState(depth < 2)
  const hasChildren = unit.children.length > 0
  const unitType = unitTypes.find((t) => t.id === unit.typeId)
  const isSelected = selectedId === unit.id

  return (
    <div className="select-none">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25, delay: depth * 0.04 }}
        className={cn(
          "group relative flex items-center gap-2 rounded-lg px-2 py-1.5 cursor-pointer transition-all",
          isSelected
            ? "bg-white/10 ring-1 ring-white/20"
            : "hover:bg-white/5"
        )}
        style={{ paddingLeft: `${depth * 20 + 8}px` }}
        onClick={() => onSelect(unit)}
      >
        {/* Indent lines */}
        {depth > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-px bg-white/10"
            style={{ left: `${depth * 20 - 4}px` }}
          />
        )}

        {/* Expand toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) setExpanded((v) => !v)
          }}
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded transition-transform",
            hasChildren ? "text-white/40 hover:text-white/80" : "text-transparent"
          )}
        >
          <ChevronRight
            className={cn("size-3 transition-transform duration-200", expanded && "rotate-90")}
          />
        </button>

        {/* Type icon */}
        <span className="shrink-0 text-sm leading-none">{unitType?.icone ?? "📁"}</span>

        {/* Name */}
        <span className="flex-1 truncate text-[12px] font-medium text-foreground">
          {unit.nom}
        </span>

        {/* Location */}
        {unit.flag && (
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {unit.flag} {unit.ville}
          </span>
        )}

        {/* Effectif */}
        <div className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          <Users className="size-3" />
          {unit.effectif.toLocaleString()}
        </div>

        {/* Score badge */}
        <Badge
          className="shrink-0 border-0 px-1.5 py-0.5 text-[10px] font-bold"
          style={{
            backgroundColor: `${unitType?.couleur ?? "#888"}20`,
            color: unitType?.couleur ?? "#888",
          }}
        >
          {unit.score}
        </Badge>

        {/* Trend */}
        <span className="shrink-0 text-[9px] font-semibold text-[#10B981]">{unit.trend}</span>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger
              className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={(e) => { e.stopPropagation(); onAddChild(unit) }}
            >
              <Plus className="size-2.5" />
            </TooltipTrigger>
            <TooltipContent>Ajouter une sous-unité</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              className="flex size-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              onClick={(e) => { e.stopPropagation(); onConfigure(unit) }}
            >
              <Settings className="size-2.5" />
            </TooltipTrigger>
            <TooltipContent>Configurer</TooltipContent>
          </Tooltip>
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence initial={false}>
        {expanded && hasChildren && (
          <motion.div
            key="children"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: "hidden" }}
          >
            {unit.children.map((child) => (
              <StructureNode
                key={child.id}
                unit={child}
                unitTypes={unitTypes}
                depth={depth + 1}
                onSelect={onSelect}
                onAddChild={onAddChild}
                onConfigure={onConfigure}
                selectedId={selectedId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
