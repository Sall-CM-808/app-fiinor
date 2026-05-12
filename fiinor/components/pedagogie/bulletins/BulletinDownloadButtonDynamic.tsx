"use client"

import dynamic from "next/dynamic"
import { Download } from "lucide-react"

/* Load BulletinDownloadButton client-only — @react-pdf/renderer ne supporte pas le SSR */
export const BulletinDownloadButton = dynamic(
  () => import("./BulletinPDF").then(m => m.BulletinDownloadButton),
  {
    ssr: false,
    loading: ({ isLoading }) => isLoading ? (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, opacity: 0.4 }}>
        <Download size={14} />
      </span>
    ) : null,
  }
)
