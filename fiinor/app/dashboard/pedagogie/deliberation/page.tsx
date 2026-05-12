"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { DeliberationPage as DeliberationPageContent } from "@/components/pedagogie/deliberation/DeliberationPage"

export default function DeliberationPage() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Link
        href="/dashboard/pedagogie"
        className="flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors"
        style={{ color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
        <ChevronLeft className="size-3.5" />
        Retour · Pédagogie &amp; Examens
      </Link>
      <DeliberationPageContent />
    </div>
  )
}
