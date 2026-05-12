"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { UniteStructurelle, UnitType } from "@/lib/structure/types"

interface TreemapViewProps {
  units: UniteStructurelle[]
  unitTypes: UnitType[]
  onSelect: (unit: UniteStructurelle) => void
  selectedId?: string
}

interface Rect { x: number; y: number; w: number; h: number }

interface TileNode {
  unit: UniteStructurelle
  rect: Rect
  color: string
  icone: string
  depth: number
}

function squarify(
  units: UniteStructurelle[],
  rect: Rect,
  unitTypes: UnitType[],
  depth: number,
  maxDepth: number,
  nodes: TileNode[]
) {
  if (!units.length || depth > maxDepth) return

  const total = units.reduce((s, u) => s + Math.max(u.effectif, 1), 0)
  let { x, y, w, h } = rect
  const isHoriz = w >= h

  units.forEach((unit) => {
    const ut = unitTypes.find((t) => t.id === unit.typeId)
    const ratio = Math.max(unit.effectif, 1) / total
    const tw = isHoriz ? w * ratio : w
    const th = isHoriz ? h : h * ratio

    nodes.push({ unit, rect: { x, y, w: tw, h: th }, color: ut?.couleur ?? "#888", icone: ut?.icone ?? "📁", depth })

    if (unit.children.length > 0 && depth < maxDepth) {
      const pad = 4
      squarify(
        unit.children,
        { x: x + pad, y: y + pad + 22, w: tw - pad * 2, h: th - pad * 2 - 22 },
        unitTypes,
        depth + 1,
        maxDepth,
        nodes
      )
    }

    if (isHoriz) x += tw
    else y += th
  })
}

export function TreemapView({ units, unitTypes, onSelect, selectedId }: TreemapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ w: 800, h: 500 })
  const [zoomStack, setZoomStack] = useState<UniteStructurelle[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      setSize({ w: width, h: height })
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const currentUnits = zoomStack.length > 0
    ? zoomStack[zoomStack.length - 1].children
    : units

  const currentRoot = zoomStack.length > 0 ? zoomStack[zoomStack.length - 1] : null

  const nodes: TileNode[] = []
  squarify(currentUnits, { x: 0, y: 0, w: size.w, h: size.h }, unitTypes, 0, 1, nodes)

  const handleClick = (node: TileNode) => {
    onSelect(node.unit)
    if (node.unit.children.length > 0) {
      setZoomStack((s) => [...s, node.unit])
    }
  }

  const breadcrumb = [{ nom: "Racine", id: "root" }, ...zoomStack]

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden rounded-xl bg-[#0d0d0d] font-mono">

      {/* Breadcrumb */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-1 px-3 py-1.5 bg-black/40 backdrop-blur-sm border-b border-white/5">
        {breadcrumb.map((crumb, i) => (
          <span key={crumb.id} className="flex items-center gap-1">
            {i > 0 && <span className="text-white/20 text-[10px]">/</span>}
            <button
              onClick={() => setZoomStack(zoomStack.slice(0, i))}
              className={`text-[10px] transition-colors ${
                i === breadcrumb.length - 1
                  ? "text-white/80 font-semibold"
                  : "text-white/30 hover:text-white/60"
              }`}
            >
              {crumb.nom}
            </button>
          </span>
        ))}
        {currentRoot && (
          <span className="ml-auto text-[9px] text-white/20">
            {currentRoot.children.length} sous-unités · double-clic pour zoomer
          </span>
        )}
      </div>

      {/* Tiles */}
      <AnimatePresence mode="wait">
        <motion.div
          key={zoomStack.length}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 pt-7"
        >
          {nodes.map((node) => {
            const isSelected = node.unit.id === selectedId
            const isHov = node.unit.id === hoveredId
            const col = node.color
            const MIN_SHOW_TEXT = 60

            return (
              <motion.div
                key={node.unit.id + "-" + node.depth}
                className="absolute overflow-hidden cursor-pointer transition-all"
                style={{
                  left: node.rect.x,
                  top: node.rect.y + 28,
                  width: node.rect.w - 2,
                  height: node.rect.h - 2,
                  backgroundColor: `${col}${node.depth === 0 ? "18" : "10"}`,
                  border: `1px solid ${col}${isSelected ? "80" : isHov ? "50" : "20"}`,
                  borderRadius: 6,
                  boxShadow: isSelected ? `inset 0 0 0 1px ${col}60, 0 0 20px ${col}30` : "none",
                  zIndex: isHov ? 10 : node.depth,
                }}
                onHoverStart={() => setHoveredId(node.unit.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => handleClick(node)}
                whileHover={{ scale: 1.005 }}
              >
                {/* Header bar */}
                <div
                  className="flex items-center gap-1.5 px-2 py-1"
                  style={{ backgroundColor: `${col}18`, borderBottom: `1px solid ${col}20` }}
                >
                  <span className="text-[11px] leading-none">{node.icone}</span>
                  {node.rect.w > MIN_SHOW_TEXT && (
                    <span
                      className="truncate text-[10px] font-semibold"
                      style={{ color: col }}
                    >
                      {node.unit.nom}
                    </span>
                  )}
                  {node.rect.w > 120 && (
                    <span
                      className="ml-auto shrink-0 rounded px-1 text-[8px] font-bold"
                      style={{ backgroundColor: `${col}25`, color: col }}
                    >
                      {node.unit.score}
                    </span>
                  )}
                </div>

                {/* Stats */}
                {node.rect.h > 60 && node.rect.w > MIN_SHOW_TEXT && (
                  <div className="px-2 py-1.5">
                    <div className="text-[9px] text-white/30 leading-relaxed">
                      {node.unit.effectif.toLocaleString()} étudiants
                    </div>
                    {node.unit.children.length > 0 && (
                      <div className="text-[8px] text-white/20 mt-0.5">
                        {node.unit.children.length} sous-unités →
                      </div>
                    )}
                    {/* Mini score bar */}
                    {node.rect.h > 80 && (
                      <div className="mt-2 h-0.5 w-full rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${node.unit.score}%`, backgroundColor: col, opacity: 0.6 }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Grid pattern overlay for depth */}
                {node.depth === 0 && (
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, ${col} 0px, transparent 1px, transparent 20px),
                        repeating-linear-gradient(90deg, ${col} 0px, transparent 1px, transparent 20px)`,
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Back hint */}
      {zoomStack.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setZoomStack((s) => s.slice(0, -1))}
          className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] text-white/40 hover:text-white/70 backdrop-blur-sm transition-colors"
        >
          ← Retour
        </motion.button>
      )}
    </div>
  )
}
