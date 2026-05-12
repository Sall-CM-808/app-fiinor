"use client"

/**
 * Client-only module — all @react-pdf/renderer imports MUST live here
 * so they share the same module instance. Never import PDFViewer or
 * PDFDownloadLink separately via dynamic(); always use this file.
 */

import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer"
import { RecuPaiementPDF } from "./RecuPaiementPDF"
import { Download, Loader2 } from "lucide-react"
import type { RecuPaiementData } from "./RecuPaiementPDF"

const G = "#C9A84C"

/* ─── Inline PDF Viewer ─── */
export function RecuViewer({ data }: { data: RecuPaiementData }) {
  return (
    <PDFViewer width="100%" height="100%" showToolbar={false} style={{ border: "none" }}>
      <RecuPaiementPDF data={data} />
    </PDFViewer>
  )
}

/* ─── Download button ─── */
export function RecuDownloadButton({ data, fileName }: { data: RecuPaiementData; fileName: string }) {
  return (
    <PDFDownloadLink document={<RecuPaiementPDF data={data} />} fileName={fileName}>
      {({ loading }) => (
        <button
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[9.5px] font-bold transition-all"
          style={{ background: `${G}15`, border: `1px solid ${G}30`, color: G }}>
          {loading
            ? <Loader2 size={11} className="animate-spin" />
            : <Download size={11} />}
          Télécharger PDF
        </button>
      )}
    </PDFDownloadLink>
  )
}
