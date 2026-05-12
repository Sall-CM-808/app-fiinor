import { ChartsSection } from "@/components/charts/ChartsSection"
import { KpiCards } from "@/components/dashboard/KpiCards"
import { DashboardCenter } from "@/components/dashboard/DashboardCenter"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardStats } from "@/components/dashboard/DashboardStats"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">

      {/* ROW 0 — Header avec date, statut système, quick actions */}
      <DashboardHeader />

      {/* ROW 1 — KPI Cards pleine largeur */}
      <KpiCards />

      {/* ROW 1.5 — Stats cross-module (Finance, RH, Services, Pédagogie) */}
      <DashboardStats />

      {/* ROW 2 — Carte pleine largeur avec overlays gauche+droite intégrés */}
      <DashboardCenter />

      {/* ROW 3 — Charts bas de page pleine largeur */}
      <ChartsSection />

    </div>
  )
}
