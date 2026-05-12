"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check } from "lucide-react"

const G  = "#C9A84C"
const BORDER = "rgba(255,255,255,0.07)"

export interface SelectOption {
  value: string
  label: string
}

interface SelectCustomProps {
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  placeholder?: string
  accentColor?: string
}

export function SelectCustom({
  value,
  onChange,
  options,
  placeholder = "Sélectionner…",
  accentColor = G,
}: SelectCustomProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  /* fermer si clic outside */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selected = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-[10px] font-bold transition-all text-left"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${open ? accentColor + "40" : BORDER}`,
          color: selected ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
        }}>
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronDown size={12} style={{ color: open ? accentColor : "rgba(255,255,255,0.3)", flexShrink: 0 }} />
        </motion.div>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              zIndex: 9999,
              background: "#0d1f35",
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              transformOrigin: "top",
            }}>
            <div style={{ maxHeight: 220, overflowY: "auto", scrollbarWidth: "thin" }}>
              {options.map(opt => {
                const isSelected = opt.value === value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { onChange(opt.value); setOpen(false) }}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-[10px] transition-colors"
                    style={{
                      background: isSelected ? `${accentColor}12` : "transparent",
                      color: isSelected ? accentColor : "rgba(255,255,255,0.65)",
                      fontWeight: isSelected ? 700 : 500,
                    }}
                    onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)" }}
                    onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = "transparent" }}>
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check size={10} style={{ color: accentColor, flexShrink: 0 }} />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
