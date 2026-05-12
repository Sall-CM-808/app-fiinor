"use client"

import { useState, useEffect } from "react"
import { motion, useDragControls, useMotionValue } from "framer-motion"
import { Minus, X, GripHorizontal, Maximize2 } from "lucide-react"
import { useT } from "@/lib/useThemeTokens"

interface DraggableOverlayProps {
  panelId: string
  title: string
  defaultPosition: { x: number; y: number }
  children: React.ReactNode
  onClose: () => void
  width?: number
  containerWidth?: number
  containerHeight?: number
}

const LAYOUT_VERSION = "v4"

function savePos(panelId: string, pos: { x: number; y: number }) {
  try { localStorage.setItem(`overlay-pos-${panelId}`, JSON.stringify({ ...pos, _v: LAYOUT_VERSION })) } catch {}
}

function loadPos(panelId: string): { x: number; y: number } | null {
  try {
    const raw = localStorage.getItem(`overlay-pos-${panelId}`)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { x: number; y: number; _v?: string }
    if (parsed._v !== LAYOUT_VERSION) {
      localStorage.removeItem(`overlay-pos-${panelId}`)
      return null
    }
    return { x: parsed.x, y: parsed.y }
  } catch { return null }
}

export function DraggableOverlay({
  panelId,
  title,
  defaultPosition,
  children,
  onClose,
  width = 260,
  containerWidth,
  containerHeight,
}: DraggableOverlayProps) {
  const t = useT()
  const [minimized, setMinimized] = useState(false)
  const dragControls = useDragControls()

  /* Always start at defaultPosition (same on SSR + client first render) */
  const x = useMotionValue(defaultPosition.x)
  const y = useMotionValue(defaultPosition.y)

  /* After mount: load saved pos (version-checked), clamp to container bounds */
  useEffect(() => {
    const saved = loadPos(panelId)
    let px = saved ? saved.x : defaultPosition.x
    let py = saved ? saved.y : defaultPosition.y
    if (containerWidth) px = Math.min(Math.max(0, px), containerWidth - width - 4)
    if (containerHeight) py = Math.min(Math.max(0, py), containerHeight - 40)
    x.set(px)
    y.set(py)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panelId])

  /* On resize: clamp current position or snap back to defaultPosition if out of bounds */
  useEffect(() => {
    if (!containerWidth) return
    const maxX = containerWidth - width - 4
    const maxY = containerHeight ? containerHeight - 40 : 9999
    const curX = x.get()
    const curY = y.get()
    const nx = curX > maxX ? Math.min(defaultPosition.x, maxX) : Math.max(0, Math.min(curX, maxX))
    const ny = Math.max(0, Math.min(curY, maxY))
    x.set(nx)
    y.set(ny)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultPosition.x, defaultPosition.y, containerWidth, containerHeight])

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      style={{ x, y, position: "absolute", top: 0, left: 0, width, zIndex: 20, background: t.surfaceGlass, borderColor: t.borderStrong }}
      onDragEnd={() => savePos(panelId, { x: x.get(), y: y.get() })}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border shadow-2xl backdrop-blur-md"
    >
      {/* Handle bar */}
      <div
        onPointerDown={(e) => dragControls.start(e)}
        className="flex cursor-grab items-center justify-between rounded-t-xl px-2.5 py-1.5 active:cursor-grabbing"
        style={{ borderBottom: minimized ? "none" : `1px solid ${t.border}` }}
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal className="size-3" style={{ color: t.textFaint }} />
          <span className="text-[9px] font-semibold uppercase tracking-widest" style={{ color: t.textMuted }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized((v) => !v)}
            className="flex size-4 items-center justify-center rounded transition-colors hover:bg-white/10"
            style={{ color: t.textMuted }}
          >
            {minimized ? <Maximize2 className="size-2.5" /> : <Minus className="size-2.5" />}
          </button>
          <button
            onClick={onClose}
            className="flex size-4 items-center justify-center rounded text-white/30 transition-colors hover:bg-red-500/20 hover:text-red-400"
          >
            <X className="size-2.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <motion.div
        animate={{ height: minimized ? 0 : "auto", opacity: minimized ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        style={{ overflow: "hidden" }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
