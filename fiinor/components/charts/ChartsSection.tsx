"use client"

import dynamic from "next/dynamic"

const EnrollmentChart = dynamic(
  () => import("./EnrollmentChart").then((m) => m.EnrollmentChart),
  { ssr: false }
)

const BudgetChart = dynamic(
  () => import("./BudgetChart").then((m) => m.BudgetChart),
  { ssr: false }
)

const EducationModelChart = dynamic(
  () => import("./EducationModelChart").then((m) => m.EducationModelChart),
  { ssr: false }
)

const ActivityChart = dynamic(
  () => import("./ActivityChart").then((m) => m.ActivityChart),
  { ssr: false }
)

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      <EnrollmentChart />
      <BudgetChart />
      <EducationModelChart />
      <ActivityChart />
    </div>
  )
}
