"use client"

import { motion, AnimatePresence } from "framer-motion"
import { AlertTriangle, Loader2, Check } from "lucide-react"
import { useState } from "react"

/* ─── Tokens ─── */
const RD = "#EF4444"
const AM = "#F59E0B"
const G  = "#C9A84C"
const EM = "#10B981"

type Severity = "danger" | "warning" | "info"

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  severity?: Severity
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

export function ConfirmDialog({
  open, title, description,
  confirmLabel = "Confirmer",
  severity = "danger",
  onConfirm, onCancel,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const accent = severity === "danger" ? RD : severity === "warning" ? AM : G

  async function handle() {
    setLoading(true)
    await Promise.resolve(onConfirm())
    setLoading(false); setDone(true)
    setTimeout(() => { setDone(false); onCancel() }, 900)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 36 }}
            className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none">

            <div className="pointer-events-auto rounded-2xl overflow-hidden flex flex-col"
              style={{
                width: "min(420px, 100vw)",
                background: "#0a1628",
                border: `1px solid ${accent}30`,
                boxShadow: `0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px ${accent}15`,
              }}>

              {/* Top accent */}
              <div className="h-0.5" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />

              {/* Content */}
              <div className="px-6 pt-6 pb-4 flex flex-col items-center text-center gap-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.05, type: "spring", stiffness: 500, damping: 30 }}
                  className="size-14 rounded-2xl flex items-center justify-center"
                  style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                  {done
                    ? <Check size={22} style={{ color: EM }} />
                    : <AlertTriangle size={22} style={{ color: accent }} />}
                </motion.div>

                <div>
                  <h3 className="text-[15px] font-black text-white">{title}</h3>
                  <p className="text-[10px] mt-1.5 leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.45)" }}>{description}</p>
                </div>
              </div>

              {/* Buttons */}
              <div className="px-6 pb-5 flex gap-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.25rem" }}>
                <button onClick={onCancel} disabled={loading}
                  className="flex-1 rounded-xl py-2.5 text-[10px] font-bold transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.45)",
                    opacity: loading ? 0.5 : 1,
                  }}>
                  Annuler
                </button>
                <button onClick={handle} disabled={loading || done}
                  className="flex-[1.5] rounded-xl py-2.5 text-[11px] font-black flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: done ? EM : accent,
                    color: "white",
                    cursor: loading || done ? "not-allowed" : "pointer",
                  }}>
                  {loading
                    ? <Loader2 size={13} className="animate-spin" />
                    : done
                    ? <><Check size={13} /> Effectué</>
                    : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
