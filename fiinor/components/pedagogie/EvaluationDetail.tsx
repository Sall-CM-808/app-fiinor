"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar, BookOpen, Users, Hash, Award, ClipboardCheck,
  Clock, PlayCircle, CheckCircle2, Lock, Edit2,
  FileText, Zap, ChevronRight, AlertTriangle, Info,
  CalendarDays, GraduationCap, Layers, Settings,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import type { Evaluation, EvalStatus } from "./EvaluationsList"

/* ─── Types ─── */
const STATUS_CONFIG: Record<EvalStatus, { color: string; icon: React.ElementType; label: string; desc: string }> = {
  "planifié":  { color: "#3B82F6", icon: Clock,        label: "Planifié",  desc: "L'évaluation n'a pas encore eu lieu" },
  "en cours":  { color: "#F59E0B", icon: PlayCircle,   label: "En cours",  desc: "Saisie des notes en cours" },
  "corrigé":   { color: "#10B981", icon: CheckCircle2, label: "Corrigé",   desc: "Toutes les notes ont été saisies" },
  "clôturé":   { color: "#6B7280", icon: Lock,         label: "Clôturé",   desc: "Évaluation archivée et immuable" },
}

const TYPE_COLORS: Record<string, string> = {
  DS: "#3B82F6", Examen: "#C9A84C", TP: "#10B981",
  Oral: "#A78BFA", Devoir: "#F97316", Rattrapage: "#EF4444",
}

/* ─── Timeline step ─── */
interface TimelineStep {
  label: string
  date?: string
  done: boolean
  active: boolean
  icon: React.ElementType
  color: string
}

function Timeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="relative flex flex-col gap-0">
      {steps.map((s, i) => {
        const Icon = s.icon
        return (
          <motion.div key={s.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, type: "spring" as const, stiffness: 320, damping: 28 }}
            className="flex gap-3 relative">
            {/* Connector line */}
            {i < steps.length - 1 && (
              <div className="absolute left-[15px] top-7 w-px h-full"
                style={{ background: s.done ? `${s.color}30` : "rgba(255,255,255,0.06)" }} />
            )}
            {/* Icon */}
            <div className="flex-shrink-0 size-8 rounded-full flex items-center justify-center z-10"
              style={{
                background: s.active ? `${s.color}20` : s.done ? `${s.color}10` : "rgba(255,255,255,0.04)",
                border: `1px solid ${s.active ? `${s.color}50` : s.done ? `${s.color}25` : "rgba(255,255,255,0.08)"}`,
                boxShadow: s.active ? `0 0 12px ${s.color}30` : "none",
              }}>
              <Icon className="size-3.5" style={{ color: s.active ? s.color : s.done ? s.color : "rgba(255,255,255,0.2)" }} />
            </div>
            {/* Content */}
            <div className="pb-6 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold" style={{ color: s.active ? "white" : s.done ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.3)" }}>
                  {s.label}
                </span>
                {s.active && (
                  <span className="rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider"
                    style={{ background: `${s.color}15`, color: s.color, border: `1px solid ${s.color}30` }}>
                    Actuel
                  </span>
                )}
              </div>
              {s.date && (
                <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.date}</div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ─── Info row ─── */
function InfoRow({ icon: Icon, label, value, color = "rgba(255,255,255,0.8)" }: {
  icon: React.ElementType; label: string; value: React.ReactNode; color?: string
}) {
  return (
    <div className="flex items-center justify-between py-2.5"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="flex items-center gap-2">
        <Icon className="size-3.5 flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }} />
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</span>
      </div>
      <span className="text-[11px] font-semibold text-right" style={{ color }}>{value}</span>
    </div>
  )
}

/* ─── Main ─── */
export function EvaluationDetail({
  evaluation,
  onGoSaisie,
  onGoStats,
}: {
  evaluation: Evaluation
  onGoSaisie?: () => void
  onGoStats?: () => void
}) {
  const cfg = STATUS_CONFIG[evaluation.status]
  const StatusIcon = cfg.icon
  const typeColor = TYPE_COLORS[evaluation.type] ?? "#C9A84C"
  const pctSaisie = evaluation.nbEleves === 0 ? 0 : Math.round((evaluation.nbNotesSaisies / evaluation.nbEleves) * 100)

  /* Timeline based on status */
  const STEPS: TimelineStep[] = [
    {
      label: "Création",
      date: "Créé le 28 avr. 2026",
      done: true,
      active: false,
      icon: FileText,
      color: "#3B82F6",
    },
    {
      label: "Planification",
      date: `Prévu le ${new Date(evaluation.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}`,
      done: ["en cours", "corrigé", "clôturé"].includes(evaluation.status),
      active: evaluation.status === "planifié",
      icon: CalendarDays,
      color: "#C9A84C",
    },
    {
      label: "Saisie des notes",
      date: pctSaisie > 0 ? `${pctSaisie}% complété` : undefined,
      done: ["corrigé", "clôturé"].includes(evaluation.status),
      active: evaluation.status === "en cours",
      icon: Edit2,
      color: "#F59E0B",
    },
    {
      label: "Correction & Validation",
      date: evaluation.status === "corrigé" ? `${evaluation.nbNotesSaisies}/${evaluation.nbEleves} notes saisies` : undefined,
      done: ["clôturé"].includes(evaluation.status),
      active: evaluation.status === "corrigé",
      icon: CheckCircle2,
      color: "#10B981",
    },
    {
      label: "Clôture",
      date: evaluation.status === "clôturé" ? "Archivé et immuable" : "En attente",
      done: evaluation.status === "clôturé",
      active: evaluation.status === "clôturé",
      icon: Lock,
      color: "#6B7280",
    },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

      {/* ── LEFT: main info ── */}
      <div className="flex flex-col gap-4">

        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
          {/* Glow accent */}
          <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full blur-3xl opacity-20"
            style={{ background: typeColor }} />

          <div className="flex items-start gap-4">
            <div className="size-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${typeColor}15`, border: `1px solid ${typeColor}30` }}>
              <ClipboardCheck className="size-5" style={{ color: typeColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="text-[16px] font-bold text-white leading-tight">{evaluation.titre}</h2>
                <span className="rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: `${typeColor}18`, color: typeColor, border: `1px solid ${typeColor}30` }}>
                  {evaluation.type}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: BookOpen, val: evaluation.matiere },
                  { icon: Users, val: evaluation.classe },
                  { icon: Calendar, val: new Date(evaluation.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) },
                ].map(({ icon: Icon, val }) => (
                  <span key={val} className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <Icon className="size-3" />{val}
                  </span>
                ))}
              </div>
            </div>
            {/* Status badge large */}
            <div className="flex-shrink-0 flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{ background: `${cfg.color}12`, border: `1px solid ${cfg.color}28` }}>
                <StatusIcon className="size-3" style={{ color: cfg.color }} />
                <span className="text-[10px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
              </div>
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>{cfg.desc}</span>
            </div>
          </div>
        </motion.div>

        {/* Info grid */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
          className="rounded-2xl px-5 py-1"
          style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
          <InfoRow icon={Hash}          label="Coefficient"       value={<span style={{ color: "#C9A84C" }}>×{evaluation.coefficient}</span>} />
          <InfoRow icon={Award}         label="Barème"            value={`/ ${evaluation.noteMax} points`} />
          <InfoRow icon={GraduationCap} label="Effectif"          value={`${evaluation.nbEleves} élèves`} />
          <InfoRow icon={Edit2}         label="Notes saisies"     value={`${evaluation.nbNotesSaisies} / ${evaluation.nbEleves}`}
            color={pctSaisie === 100 ? "#10B981" : pctSaisie > 0 ? "#F59E0B" : "rgba(255,255,255,0.5)"} />
          <InfoRow icon={CalendarDays}  label="Date prévue"
            value={new Date(evaluation.date).toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })} />
          <InfoRow icon={Layers}        label="Matière"           value={evaluation.matiere} />
          <InfoRow icon={Users}         label="Classe"            value={evaluation.classe} />
        </motion.div>

        {/* Progress section */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl p-5"
          style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
            Progression de la saisie
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {evaluation.nbNotesSaisies} notes sur {evaluation.nbEleves}
            </span>
            <span className="text-[13px] font-bold tabular-nums" style={{ color: pctSaisie === 100 ? "#10B981" : "#C9A84C" }}>
              {pctSaisie}%
            </span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height: 6, background: "rgba(255,255,255,0.06)" }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pctSaisie}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              style={{
                height: "100%",
                background: pctSaisie === 100 ? "#10B981" : "linear-gradient(90deg,#C9A84C,#E8C97A)",
                borderRadius: 9999,
              }} />
          </div>

          {/* Warnings */}
          <AnimatePresence>
            {evaluation.status === "planifié" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-start gap-2 rounded-xl p-3"
                style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)" }}>
                <Info className="size-3.5 flex-shrink-0 mt-0.5" style={{ color: "#3B82F6" }} />
                <p className="text-[9px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  La saisie des notes sera disponible à partir de la date prévue. Vous pouvez la démarrer manuellement dès maintenant.
                </p>
              </motion.div>
            )}
            {evaluation.status === "en cours" && pctSaisie < 100 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-start gap-2 rounded-xl p-3"
                style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.18)" }}>
                <AlertTriangle className="size-3.5 flex-shrink-0 mt-0.5" style={{ color: "#F59E0B" }} />
                <p className="text-[9px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {evaluation.nbEleves - evaluation.nbNotesSaisies} note(s) restante(s) à saisir avant de pouvoir clôturer.
                </p>
              </motion.div>
            )}
            {pctSaisie === 100 && evaluation.status !== "clôturé" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex items-start gap-2 rounded-xl p-3"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)" }}>
                <CheckCircle2 className="size-3.5 flex-shrink-0 mt-0.5" style={{ color: "#10B981" }} />
                <p className="text-[9px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Saisie complète. Vous pouvez consulter les statistiques ou clôturer l'évaluation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {evaluation.status !== "clôturé" && (
            <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={onGoSaisie}
              className="w-full flex items-center justify-between rounded-xl px-4 py-3"
              style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="flex items-center gap-2">
                <Edit2 className="size-4" style={{ color: "#C9A84C" }} />
                <div className="text-left">
                  <div className="text-[11px] font-bold" style={{ color: "#C9A84C" }}>Saisir les notes</div>
                  <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {evaluation.nbEleves - evaluation.nbNotesSaisies} restantes
                  </div>
                </div>
              </div>
              <ChevronRight className="size-4" style={{ color: "rgba(201,168,76,0.5)" }} />
            </motion.button>
          )}

          <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.02 }} onClick={onGoStats}
            className="w-full flex items-center justify-between rounded-xl px-4 py-3"
            style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.18)" }}>
            <div className="flex items-center gap-2">
              <Zap className="size-4" style={{ color: "#3B82F6" }} />
              <div className="text-left">
                <div className="text-[11px] font-bold" style={{ color: "#3B82F6" }}>Voir les stats</div>
                <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Distribution & progression</div>
              </div>
            </div>
            <ChevronRight className="size-4" style={{ color: "rgba(59,130,246,0.5)" }} />
          </motion.button>
        </motion.div>
      </div>

      {/* ── RIGHT: Timeline ── */}
      <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 h-fit"
        style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="text-[9px] font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
          Cycle de vie
        </div>
        <Timeline steps={STEPS} />

        <Separator className="my-4 opacity-10" />

        {/* Meta */}
        <div className="flex flex-col gap-2">
          <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>
            Métadonnées
          </div>
          {[
            { label: "ID évaluation", value: evaluation.id },
            { label: "Créé par",      value: "Admin Système" },
            { label: "Dernière modif", value: "Aujourd'hui 09:42" },
          ].map(m => (
            <div key={m.label} className="flex items-center justify-between">
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{m.label}</span>
              <span className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.45)" }}>{m.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
