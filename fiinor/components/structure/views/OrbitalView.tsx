"use client"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { UnitDetailPanel } from "@/components/structure/UnitDetailPanel"
import type { UniteStructurelle, UnitType } from "@/lib/structure/types"

interface OrbitalViewProps {
  units: UniteStructurelle[]
  unitTypes: UnitType[]
  onSelect: (unit: UniteStructurelle) => void
  selectedId?: string
}

const COLORS = ["#C9A84C","#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444","#EC4899","#06B6D4"]

interface OrbitalNode {
  unit: UniteStructurelle
  x: number; y: number; r: number; depth: number; color: string; icone: string
}

// ── Shared canvas renderer (used in both normal + fullscreen) ───────────────
interface OrbitalCanvasProps {
  units: UniteStructurelle[]
  unitTypes: UnitType[]
  selectedId?: string
  fullscreen?: boolean
  onExitFullscreen?: () => void
  onSelectUnit: (unit: UniteStructurelle) => void
}

function OrbitalCanvas({ units, unitTypes, selectedId, fullscreen, onExitFullscreen, onSelectUnit }: OrbitalCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [size, setSize] = useState({ w: 800, h: 600 })
  const timeRef = useRef(0)
  const rafRef = useRef<number>(0)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [popup, setPopup] = useState<UniteStructurelle | null>(null)

  // Drag positions stored entirely in a ref — never causes re-render conflicts
  const dragPosRef = useRef<Record<string, { x: number; y: number }>>({})
  const [, forceRender] = useState(0)
  const rerender = useCallback(() => forceRender(n => n + 1), [])

  // Pan + zoom viewport (fullscreen only)
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 })
  const panRef = useRef<{ startX: number; startY: number; vpX: number; vpY: number } | null>(null)

  useEffect(() => {
    const ro = new ResizeObserver((e) => {
      const { width, height } = e[0].contentRect
      setSize({ w: width, h: height })
    })
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Wheel zoom (fullscreen only)
  useEffect(() => {
    if (!fullscreen) return
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      setViewport(v => ({
        ...v,
        scale: Math.min(Math.max(v.scale * delta, 0.3), 4),
      }))
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [fullscreen])

  useEffect(() => {
    const tick = () => { timeRef.current += 0.004; rafRef.current = requestAnimationFrame(tick) }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const LEVEL_H = fullscreen ? 140 : 90   // vertical gap between levels
  const MIN_SEP = fullscreen ? 90 : 56    // min horizontal gap between siblings

  // Tree layout — Reingold-Tilford style
  // Pass 1: compute subtree leaf-count width for each node
  function leafCount(unit: UniteStructurelle): number {
    if (unit.children.length === 0) return 1
    return unit.children.reduce((s, c) => s + leafCount(c), 0)
  }

  // Pass 2: assign x,y positions recursively
  const treeNodes = useMemo(() => {
    const result: OrbitalNode[] = []

    function place(unit: UniteStructurelle, depth: number, left: number, right: number) {
      const x = (left + right) / 2
      const y = 60 + depth * LEVEL_H
      const ut = unitTypes.find(t => t.id === unit.typeId)
      const color = ut?.couleur ?? COLORS[depth % COLORS.length]
      const r = Math.max(fullscreen ? 32 - depth * 5 : 20 - depth * 3, fullscreen ? 14 : 9)
      result.push({ unit, x, y, r, depth, color, icone: ut?.icone ?? "📁" })

      if (unit.children.length === 0) return
      const totalLeaves = unit.children.reduce((s, c) => s + leafCount(c), 0)
      const span = Math.max(right - left, unit.children.length * MIN_SEP)
      let cursor = x - span / 2
      for (const child of unit.children) {
        const childLeaves = leafCount(child)
        const childSpan = (childLeaves / totalLeaves) * span
        place(child, depth + 1, cursor, cursor + childSpan)
        cursor += childSpan
      }
    }

    // If multiple roots, spread them horizontally
    if (units.length === 1) {
      place(units[0], 0, 0, Math.max(size.w, 800))
    } else {
      const totalLeaves = units.reduce((s, u) => s + leafCount(u), 0)
      const totalWidth = Math.max(size.w, units.length * MIN_SEP * 3)
      let cursor = 0
      for (const unit of units) {
        const span = (leafCount(unit) / totalLeaves) * totalWidth
        place(unit, 0, cursor, cursor + span)
        cursor += span
      }
    }
    return result
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [units, unitTypes, size.w, LEVEL_H, MIN_SEP, fullscreen])

  // Apply drag overrides on top of tree positions
  const animNodes: OrbitalNode[] = treeNodes.map(n => {
    const drag = dragPosRef.current[n.unit.id]
    return drag ? { ...n, ...drag } : n
  })

  function getParent(n: OrbitalNode) {
    return animNodes.find(p => p.unit.children.some(c => c.id === n.unit.id)) ?? null
  }

  // Native drag handlers (no Framer drag — zero conflict)
  const dragging = useRef<{ id: string; ox: number; oy: number; startX: number; startY: number } | null>(null)

  function onPointerDown(e: React.PointerEvent, n: OrbitalNode) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    // Adjust for viewport transform in fullscreen
    const ox = fullscreen ? (e.clientX - viewport.x) / viewport.scale - n.x : e.clientX - n.x
    const oy = fullscreen ? (e.clientY - viewport.y) / viewport.scale - n.y : e.clientY - n.y
    dragging.current = { id: n.unit.id, ox, oy, startX: e.clientX, startY: e.clientY }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return
    if (fullscreen) {
      dragPosRef.current[dragging.current.id] = {
        x: (e.clientX - viewport.x) / viewport.scale - dragging.current.ox,
        y: (e.clientY - viewport.y) / viewport.scale - dragging.current.oy,
      }
    } else {
      dragPosRef.current[dragging.current.id] = {
        x: e.clientX - dragging.current.ox,
        y: e.clientY - dragging.current.oy,
      }
    }
    rerender()
  }
  function onPointerUp(e: React.PointerEvent, n: OrbitalNode) {
    if (!dragging.current) return
    const dx = e.clientX - dragging.current.startX
    const dy = e.clientY - dragging.current.startY
    const moved = Math.abs(dx) + Math.abs(dy) > 6
    dragging.current = null
    if (!moved) {
      onSelectUnit(n.unit)
      if (fullscreen) setPopup(n.unit)
    }
  }

  // Background pan handlers
  function onBgPointerDown(e: React.PointerEvent) {
    if (!fullscreen) return
    e.currentTarget.setPointerCapture(e.pointerId)
    panRef.current = { startX: e.clientX, startY: e.clientY, vpX: viewport.x, vpY: viewport.y }
  }
  function onBgPointerMove(e: React.PointerEvent) {
    if (!panRef.current) return
    setViewport(v => ({
      ...v,
      x: panRef.current!.vpX + e.clientX - panRef.current!.startX,
      y: panRef.current!.vpY + e.clientY - panRef.current!.startY,
    }))
  }
  function onBgPointerUp() { panRef.current = null }

  const hov = animNodes.find(n => n.unit.id === hoveredId)

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#050810]"
      style={{ borderRadius: fullscreen ? 0 : "0.75rem", overflow: fullscreen ? "hidden" : "hidden" }}
    >
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 100 }, (_, i) => (
          <div key={i} className="absolute rounded-full bg-white" style={{
            width: i % 7 === 0 ? 2 : 1, height: i % 7 === 0 ? 2 : 1,
            left: `${(i * 13.7) % 100}%`, top: `${(i * 17.3) % 100}%`,
            opacity: 0.06 + (i % 5) * 0.06,
            animation: `orb-pulse ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${(i * 0.3) % 3}s`,
          }} />
        ))}
      </div>

      {/* Pan background (fullscreen only) */}
      {fullscreen && (
        <div className="absolute inset-0 z-0 cursor-move"
          onPointerDown={onBgPointerDown}
          onPointerMove={onBgPointerMove}
          onPointerUp={onBgPointerUp}
        />
      )}

      {/* Scene — transformed for pan/zoom in fullscreen */}
      <div style={fullscreen ? {
        position: "absolute", left: 0, top: 0,
        width: "4000px", height: "4000px",
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
        transformOrigin: "0 0",
        willChange: "transform",
      } : { position: "absolute", inset: 0 }}>

        {/* SVG links */}
        <svg ref={svgRef} className="absolute pointer-events-none"
          style={fullscreen
            ? { left: 0, top: 0, width: "4000px", height: "4000px", overflow: "visible" }
            : { inset: 0, width: "100%", height: "100%", position: "absolute", overflow: "visible" }
          }>
          <defs>
            <radialGradient id="orb-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
            </radialGradient>
            {animNodes.filter(n => n.depth > 0).map(n => {
              const p = getParent(n)
              if (!p) return null
              return (
                <linearGradient key={`lg-${n.unit.id}`} id={`lg-${n.unit.id}`}
                  x1={p.x} y1={p.y} x2={n.x} y2={n.y} gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor={p.color} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={n.color} stopOpacity="0.3" />
                </linearGradient>
              )
            })}
          </defs>
          {animNodes.filter(n => n.depth > 0).map(n => {
            const p = getParent(n)
            if (!p) return null
            const active = hoveredId === n.unit.id || hoveredId === p.unit.id || n.unit.id === selectedId
            const dx = n.x - p.x, dy = n.y - p.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const t = (timeRef.current * 0.4) % 1
            return (
              <g key={n.unit.id + "-l"}>
                <line x1={p.x} y1={p.y} x2={n.x} y2={n.y}
                  stroke={`url(#lg-${n.unit.id})`}
                  strokeWidth={fullscreen
                    ? (active ? 6 : n.depth === 1 ? 4 : 2.5)
                    : (active ? 1.5 : n.depth === 1 ? 1 : 0.7)}
                  strokeOpacity={active ? 1 : fullscreen ? 0.75 : 0.55} />
                {len > 20 && <circle cx={p.x + dx * t} cy={p.y + dy * t}
                  r={fullscreen ? (active ? 7 : 5) : (active ? 2 : 1.2)} fill={n.color} opacity={active ? 1 : fullscreen ? 0.7 : 0.5} />}
              </g>
            )
          })}
        </svg>

        {/* Nodes */}
        {animNodes.map(n => {
          const isSel = n.unit.id === selectedId
          const isHov = n.unit.id === hoveredId
          return (
            <div
              key={n.unit.id}
              className="absolute flex flex-col items-center select-none"
              style={{
                left: n.x, top: n.y,
                transform: "translate(-50%,-50%)",
                cursor: "grab",
                zIndex: isSel ? 20 : 10,
                touchAction: "none",
              }}
              onPointerDown={e => onPointerDown(e, n)}
              onPointerMove={onPointerMove}
              onPointerUp={e => onPointerUp(e, n)}
              onMouseEnter={() => setHoveredId(n.unit.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="absolute rounded-full pointer-events-none" style={{
                width: n.r * 2 + (isSel || isHov ? 22 : 0),
                height: n.r * 2 + (isSel || isHov ? 22 : 0),
                left: "50%", top: "50%", transform: "translate(-50%,-50%)",
                backgroundColor: n.color,
                opacity: isSel ? 0.28 : isHov ? 0.15 : 0.08,
                filter: "blur(9px)",
                transition: "all 0.2s",
              }} />
              <div className="relative flex items-center justify-center rounded-full border"
                style={{
                  width: n.r * 2, height: n.r * 2,
                  backgroundColor: `${n.color}1a`,
                  borderColor: isSel ? n.color : `${n.color}55`,
                  borderWidth: isSel ? 2 : 1,
                  boxShadow: isSel ? `0 0 18px ${n.color}70` : "none",
                  fontSize: n.r * 0.9,
                  transition: "all 0.2s",
                }}>
                {n.icone}
              </div>
              {(isHov || isSel || n.depth === 0) && (
                <div className="absolute whitespace-nowrap rounded px-1.5 py-0.5 pointer-events-none"
                  style={{
                    top: n.r + (fullscreen ? 10 : 7),
                    fontSize: fullscreen ? 12 : 9,
                    fontFamily: "monospace",
                    color: n.color, background: "#050810ee",
                    border: `1px solid ${n.color}44`,
                    padding: fullscreen ? "3px 7px" : undefined,
                  }}>
                  {n.unit.nom}{(n.depth === 0 || isSel) && <span className="ml-1 opacity-50">{n.unit.score}</span>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Fullscreen controls */}
      {fullscreen && (
        <>
          <button onClick={onExitFullscreen}
            className="absolute top-4 right-4 z-50 flex items-center gap-1.5 rounded-md border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-mono text-white/50 hover:text-white/90 backdrop-blur-sm transition-colors">
            <X className="size-3" /> Fermer
          </button>

          {/* Zoom controls */}
          <div className="absolute top-4 left-4 z-50 flex flex-col gap-1">
            <button onClick={() => setViewport(v => ({ ...v, scale: Math.min(v.scale * 1.2, 4) }))}
              className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-black/60 text-white/50 hover:text-white/90 backdrop-blur-sm transition-colors text-lg font-light">+</button>
            <button onClick={() => setViewport(v => ({ ...v, scale: Math.max(v.scale * 0.8, 0.3) }))}
              className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-black/60 text-white/50 hover:text-white/90 backdrop-blur-sm transition-colors text-lg font-light">−</button>
            <button onClick={() => setViewport({ x: 0, y: 0, scale: 1 })}
              className="flex size-8 items-center justify-center rounded-md border border-white/10 bg-black/60 text-white/30 hover:text-white/70 backdrop-blur-sm transition-colors text-[10px] font-mono">↺</button>
          </div>

          <div className="absolute bottom-4 left-4 z-50 text-[10px] font-mono text-white/20">
            Glisser fond = pan · Molette = zoom · Clic nœud = détails
          </div>
          {Object.keys(dragPosRef.current).length > 0 && (
            <button onClick={() => { dragPosRef.current = {}; rerender() }}
              className="absolute bottom-4 right-4 z-50 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-mono text-white/35 hover:text-white/70 backdrop-blur-sm transition-colors">
              ↺ Reset nœuds
            </button>
          )}
        </>
      )}

      {/* Fullscreen node tooltip (hover, not click) */}
      {!fullscreen && hov && (
        <div className="pointer-events-none absolute z-30 rounded-lg border border-white/10 bg-[#0a0f1e]/90 px-3 py-2 backdrop-blur-sm"
          style={{ left: Math.min(hov.x + hov.r + 12, size.w - 175), top: Math.max(hov.y - 30, 4), minWidth: 155 }}>
          <div className="flex items-center gap-1.5">
            <span style={{ color: hov.color }}>{hov.icone}</span>
            <span className="text-[11px] font-semibold text-white">{hov.unit.nom}</span>
          </div>
          <div className="mt-1 flex gap-2 font-mono text-[9px] text-white/50">
            <span>Score: <span style={{ color: hov.color }}>{hov.unit.score}</span></span>
            <span>·</span>
            <span>{hov.unit.effectif.toLocaleString()} ét.</span>
          </div>
          {hov.unit.children.length > 0 && (
            <div className="mt-0.5 text-[9px] text-white/25">{hov.unit.children.length} sous-unités</div>
          )}
        </div>
      )}

      {/* Fullscreen detail panel — UnitDetailPanel flottant */}
      {fullscreen && popup && (
        <div className="absolute top-4 right-16 z-50 w-[320px] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <UnitDetailPanel
            unit={popup}
            unitTypes={unitTypes}
            onClose={() => setPopup(null)}
            onSelectChild={(child) => setPopup(child)}
          />
        </div>
      )}

      <style>{`@keyframes orb-pulse { 0%,100%{opacity:.06} 50%{opacity:.35} }`}</style>
    </div>
  )
}

// ── Public OrbitalView (normal mode + fullscreen button) ───────────────────
export function OrbitalView({ units, unitTypes, onSelect, selectedId }: OrbitalViewProps) {
  const [fullscreen, setFullscreen] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      {/* Normal mode */}
      <div className="relative w-full h-full">
        <OrbitalCanvas
          units={units} unitTypes={unitTypes} selectedId={selectedId}
          onSelectUnit={onSelect}
        />
        <button
          onClick={() => setFullscreen(true)}
          className="absolute top-3 right-3 z-20 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-2 py-1 text-[10px] font-mono text-white/40 hover:text-white/80 backdrop-blur-sm transition-colors"
        >
          ⤢ Plein écran
        </button>
      </div>

      {/* Fullscreen portal */}
      {mounted && fullscreen && createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999]"
        >
          <OrbitalCanvas
            units={units} unitTypes={unitTypes} selectedId={selectedId}
            fullscreen onExitFullscreen={() => setFullscreen(false)}
            onSelectUnit={onSelect}
          />
        </motion.div>,
        document.body
      )}
    </>
  )
}
