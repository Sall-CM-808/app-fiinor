"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  X, Users, TrendingUp, Building2, MapPin, ChevronRight,
  GraduationCap, Wallet, BookOpen, ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import type { UniteStructurelle, UnitType } from "@/lib/structure/types"

interface UnitDetailPanelProps {
  unit: UniteStructurelle | null
  unitTypes: UnitType[]
  onClose: () => void
  onSelectChild?: (unit: UniteStructurelle) => void
}

export function UnitDetailPanel({ unit, unitTypes, onClose, onSelectChild }: UnitDetailPanelProps) {
  const unitType = unit ? unitTypes.find((t) => t.id === unit.typeId) : null
  const color = unitType?.couleur ?? "#888"

  if (!unit) return <div className="flex w-[320px] shrink-0 flex-col" />

  return (
    <div className="flex w-[320px] shrink-0 flex-col">
    <AnimatePresence>
      {unit && (
        <motion.div
          key={unit.id}
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-[320px] shrink-0 flex-col rounded-xl border border-border bg-card overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 p-4 pb-3">
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg text-xl"
                style={{ backgroundColor: `${color}18` }}
              >
                {unitType?.icone ?? "📁"}
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-foreground leading-tight">{unit.nom}</h3>
                <Badge
                  variant="secondary"
                  className="mt-1 px-1.5 py-0 text-[9px] font-semibold border-0"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {unitType?.nom ?? unit.typeId}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6 shrink-0 text-muted-foreground"
              onClick={onClose}
            >
              <X className="size-3.5" />
            </Button>
          </div>

          {/* Localisation */}
          {(unit.ville || unit.pays) && (
            <div className="flex items-center gap-1.5 px-4 pb-3 text-[11px] text-muted-foreground">
              <MapPin className="size-3 shrink-0" />
              <span>{unit.flag} {[unit.ville, unit.pays].filter(Boolean).join(", ")}</span>
            </div>
          )}

          {/* KPI strip */}
          <div className="grid grid-cols-2 gap-2 px-4 pb-3">
            <div className="rounded-lg border border-border bg-muted/40 p-2.5">
              <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Users className="size-3" /> Effectif
              </div>
              <div className="mt-1 text-[20px] font-bold text-foreground leading-none">
                {(unit.effectif ?? 0).toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 p-2.5">
              <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                <TrendingUp className="size-3" /> Score
              </div>
              <div className="mt-1 flex items-baseline gap-1 leading-none">
                <span className="text-[20px] font-bold" style={{ color }}>{unit.score}</span>
                <span className="text-[10px] font-semibold text-emerald-500">{unit.trend}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Tabs */}
          <Tabs defaultValue="general" className="flex flex-1 flex-col overflow-hidden">
            <TabsList className="mx-4 mt-3 mb-1 grid w-auto grid-cols-4 h-8">
              <TabsTrigger value="general" className="text-[10px] px-1">
                <Building2 className="size-3" />
              </TabsTrigger>
              <TabsTrigger value="pedagogie" className="text-[10px] px-1">
                <BookOpen className="size-3" />
              </TabsTrigger>
              <TabsTrigger value="finances" className="text-[10px] px-1">
                <Wallet className="size-3" />
              </TabsTrigger>
              <TabsTrigger value="permissions" className="text-[10px] px-1">
                <ShieldCheck className="size-3" />
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="flex-1">

              {/* ── Général ── */}
              <TabsContent value="general" className="mt-0 flex flex-col gap-3 p-4 pt-2">
                {unit.children.length > 0 ? (
                  <div>
                    <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                      Sous-unités ({unit.children.length})
                    </p>
                    <div className="flex flex-col gap-1">
                      {unit.children.map((child) => {
                        const childType = unitTypes.find((t) => t.id === child.typeId)
                        const cc = childType?.couleur ?? "#888"
                        return (
                          <button
                            key={child.id}
                            onClick={() => onSelectChild?.(child)}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted/60 w-full"
                          >
                            <span className="text-base">{childType?.icone ?? "📁"}</span>
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-[11px] font-medium text-foreground">{child.nom}</div>
                              <div className="relative mt-0.5 h-[2px] w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className="absolute inset-y-0 left-0 rounded-full transition-all"
                                  style={{ width: `${child.score}%`, backgroundColor: cc }}
                                />
                              </div>
                            </div>
                            <span className="shrink-0 text-[11px] font-bold" style={{ color: cc }}>
                              {child.score}
                            </span>
                            <ChevronRight className="size-3 shrink-0 text-muted-foreground" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6 text-muted-foreground">
                    <GraduationCap className="size-8 opacity-20" />
                    <p className="text-[11px]">Unité terminale — aucune sous-unité</p>
                  </div>
                )}

                <Separator />

                <div className="flex flex-col gap-1.5">
                  <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Informations
                  </p>
                  {[
                    { label: "Type", value: unitType?.nom ?? unit.typeId },
                    { label: "Identifiant", value: unit.id },
                    { label: "Niveau hiérarchique", value: unitType ? `Niveau ${unitType.niveau}` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-medium text-foreground truncate max-w-[160px] text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ── Pédagogie ── */}
              <TabsContent value="pedagogie" className="mt-0 flex flex-col gap-3 p-4 pt-2">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">Performance pédagogique</p>
                {[
                  { label: "Taux de réussite", value: unit.score, color },
                  { label: "Assiduité moyenne", value: 87, color: "#3B82F6" },
                  { label: "Taux d'évaluation", value: 92, color: "#8B5CF6" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">{stat.label}</span>
                      <span className="font-bold" style={{ color: stat.color }}>{stat.value}%</span>
                    </div>
                    <Progress value={stat.value} className="h-1.5" />
                  </div>
                ))}
                <Separator />
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Matières", value: "12" },
                    { label: "Enseignants", value: "8" },
                    { label: "Cours / sem.", value: "24" },
                    { label: "Heures / an", value: "840" },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-md border border-border bg-muted/40 p-2">
                      <div className="text-[9px] text-muted-foreground">{label}</div>
                      <div className="text-[16px] font-bold text-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* ── Finances ── */}
              <TabsContent value="finances" className="mt-0 flex flex-col gap-3 p-4 pt-2">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">Budget & Finances</p>
                {[
                  { label: "Budget alloué", value: "450 000 GNF", positive: true },
                  { label: "Dépenses à date", value: "312 000 GNF", positive: true },
                  { label: "Frais collectés", value: "398 000 GNF", positive: true },
                  { label: "Impayés", value: "52 000 GNF", positive: false },
                ].map(({ label, value, positive }) => (
                  <div key={label} className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={positive ? "font-semibold text-foreground" : "font-semibold text-destructive"}>
                      {value}
                    </span>
                  </div>
                ))}
                <Separator />
                <div>
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-muted-foreground">Taux d'exécution budgétaire</span>
                    <span className="font-bold text-emerald-500">69%</span>
                  </div>
                  <Progress value={69} className="h-1.5" />
                </div>
              </TabsContent>

              {/* ── Permissions ── */}
              <TabsContent value="permissions" className="mt-0 flex flex-col gap-3 p-4 pt-2">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">Contrôle d'accès</p>
                {[
                  { role: "Directeur", email: "dir@fiinor.com", access: "Complet" },
                  { role: "Admin pédago", email: "ped@fiinor.com", access: "Lecture / Écriture" },
                  { role: "Comptable", email: "fin@fiinor.com", access: "Finances uniquement" },
                ].map(({ role, email, access }) => (
                  <div key={role} className="flex items-start justify-between gap-2 rounded-md border border-border p-2">
                    <div>
                      <div className="text-[11px] font-semibold text-foreground">{role}</div>
                      <div className="text-[9px] text-muted-foreground">{email}</div>
                    </div>
                    <Badge variant="secondary" className="text-[9px] shrink-0">{access}</Badge>
                  </div>
                ))}
              </TabsContent>

            </ScrollArea>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}
