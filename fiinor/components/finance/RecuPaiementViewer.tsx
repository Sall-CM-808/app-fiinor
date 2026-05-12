"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, FileText } from "lucide-react"
import type { RecuPaiementData } from "./RecuPaiementPDF"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"

/*
 * Single dynamic import — ALL @react-pdf/renderer components must come from
 * the SAME module instance or the renderer context breaks ("su is not a function").
 * RecuPdfClient imports PDFViewer, PDFDownloadLink and RecuPaiementPDF together.
 */
const RecuViewer = dynamic(
  () => import("./RecuPdfClient").then(m => m.RecuViewer),
  { ssr: false, loading: () => <PdfLoading /> }
)

const RecuDownloadButton = dynamic(
  () => import("./RecuPdfClient").then(m => m.RecuDownloadButton),
  { ssr: false }
)

/* ─── Loading state ─── */
function PdfLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3"
      style={{ background: "#f8fafc" }}>
      <Loader2 size={24} className="animate-spin" style={{ color: G }} />
      <span className="text-[10px] font-bold" style={{ color: "rgba(0,0,0,0.3)" }}>
        Génération du PDF…
      </span>
    </div>
  )
}

/* ─── Props ─── */
interface RecuPaiementViewerProps {
  data: RecuPaiementData | null
  open: boolean
  onClose: () => void
}

/* ─── Main ─── */
export function RecuPaiementViewer({ data, open, onClose }: RecuPaiementViewerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) setTimeout(() => setMounted(true), 80)
    else setMounted(false)
  }, [open])

  if (!data) return null

  const fileName = `recu-${data.eleve.matricule}-${data.numeroRecu ?? "recu"}.pdf`

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70]"
            style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed inset-0 z-[71] flex items-center justify-center p-4 md:p-8 pointer-events-none">

            <div className="pointer-events-auto flex flex-col rounded-2xl overflow-hidden"
              style={{
                width: "min(820px, 100vw)",
                height: "min(90vh, 860px)",
                background: "#0a1628",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 40px 100px rgba(0,0,0,0.8)",
              }}>

              {/* Gold top accent */}
              <div className="h-0.5 flex-shrink-0"
                style={{ background: `linear-gradient(90deg, ${G}, ${EM} 60%, transparent)` }} />

              {/* Toolbar */}
              <div className="flex items-center justify-between px-5 py-3 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl flex items-center justify-center"
                    style={{ background: `${G}15`, border: `1px solid ${G}30` }}>
                    <FileText size={14} style={{ color: G }} />
                  </div>
                  <div>
                    <div className="text-[12px] font-black text-white">
                      Reçu de paiement
                    </div>
                    <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {data.eleve.prenom} {data.eleve.nom} · {data.eleve.matricule}
                      {data.numeroRecu && <span className="ml-2 font-mono" style={{ color: G }}>{data.numeroRecu}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Download button — uses RecuPdfClient for shared renderer context */}
                  {mounted && (
                    <RecuDownloadButton data={data} fileName={fileName} />
                  )}

                  {/* Close */}
                  <button onClick={onClose}
                    className="rounded-xl p-2 transition-colors"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                    <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
                  </button>
                </div>
              </div>

              {/* PDF Viewer — uses RecuPdfClient for shared renderer context */}
              <div className="flex-1 overflow-hidden">
                {mounted
                  ? <RecuViewer data={data} />
                  : <PdfLoading />}
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
