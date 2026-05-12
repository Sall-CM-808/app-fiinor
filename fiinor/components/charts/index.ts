import dynamic from "next/dynamic"

export const EnrollmentChart = dynamic(
  () => import("./EnrollmentChart").then((m) => m.EnrollmentChart),
  { ssr: false }
)

export const BudgetChart = dynamic(
  () => import("./BudgetChart").then((m) => m.BudgetChart),
  { ssr: false }
)

export const EducationModelChart = dynamic(
  () => import("./EducationModelChart").then((m) => m.EducationModelChart),
  { ssr: false }
)
