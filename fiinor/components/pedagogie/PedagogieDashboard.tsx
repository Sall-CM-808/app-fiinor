"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import {
  BookOpen,
  ClipboardList,
  CalendarDays,
  FlaskConical,
  ScrollText,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/* ─── Mock data ─── */
const KPI_DATA = [
  {
    label: "Matières actives",
    value: 148,
    unit: "",
    delta: "+12 ce semestre",
    deltaUp: true,
    icon: BookOpen,
    color: "#C9A84C",
    sub: "Réparties sur 34 classes",
  },
  {
    label: "Évaluations planifiées",
    value: 63,
    unit: "",
    delta: "18 dans les 7 jours",
    deltaUp: true,
    icon: ClipboardList,
    color: "#3B82F6",
    sub: "DS, Examens, TP, Oraux",
  },
  {
    label: "Taux de présence",
    value: 87,
    unit: "%",
    delta: "+2.3% vs semaine préc.",
    deltaUp: true,
    icon: Users,
    color: "#10B981",
    sub: "Moyenne réseau · ce mois",
  },
  {
    label: "Délibérations en attente",
    value: 4,
    unit: "",
    delta: "Échéance : 15 mai",
    deltaUp: false,
    icon: ScrollText,
    color: "#F59E0B",
    sub: "Workflow à valider",
  },
]

const SUB_NAV = [
  { label: "Matières & EDT",    href: "/dashboard/pedagogie/matieres",     icon: CalendarDays,   desc: "Emploi du temps, créneaux, volumes horaires" },
  { label: "Évaluations",       href: "/dashboard/pedagogie/evaluations",   icon: ClipboardList,  desc: "DS, examens, TP — saisie des notes" },
  { label: "Moteur de formules",href: "/dashboard/pedagogie/formules",      icon: FlaskConical,   desc: "Règles de calcul configurables par établissement" },
  { label: "Délibération",      href: "/dashboard/pedagogie/deliberation",  icon: ScrollText,     desc: "Décisions, admission, génération bulletins" },
]

const UPCOMING = [
  { label: "Examen Mathématiques S2", classe: "Terminale A", date: "3 mai", type: "Examen",  status: "planifié",  color: "#3B82F6" },
  { label: "DS Physique-Chimie",      classe: "1ère C",      date: "5 mai", type: "DS",      status: "planifié",  color: "#C9A84C" },
  { label: "TP Informatique",         classe: "BTS Info 2",  date: "6 mai", type: "TP",      status: "en cours",  color: "#10B981" },
  { label: "Oral Anglais",            classe: "Terminale D", date: "8 mai", type: "Oral",    status: "planifié",  color: "#A78BFA" },
  { label: "Examen Comptabilité",     classe: "BTS Compta",  date: "10 mai",type: "Examen",  status: "corrigé",   color: "#10B981" },
]

const ALERTS = [
  { icon: AlertTriangle, color: "#F59E0B", msg: "4 délibérations en attente de validation directeur" },
  { icon: Clock,         color: "#3B82F6", msg: "18 évaluations planifiées dans les 7 prochains jours" },
  { icon: CheckCircle2,  color: "#10B981", msg: "Bulletins S1 générés et publiés pour 3 établissements" },
]

/* ─── Variants ─── */
const containerV = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const itemV = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
}

/* ─── KPI card ─── */
function KpiCard({ kpi, inView }: { kpi: typeof KPI_DATA[number]; inView: boolean }) {
  const Icon = kpi.icon
  return (
    <motion.div variants={itemV}>
      <Card className="relative overflow-hidden border-border/50 bg-card transition-shadow hover:shadow-md hover:shadow-black/30" style={{ height: 100 }}>
        <div className="pointer-events-none absolute -right-4 -top-4 size-20 rounded-full blur-2xl"
          style={{ backgroundColor: `${kpi.color}12` }} />
        <div className="flex h-full flex-col justify-between px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground">{kpi.label}</span>
            <Icon className="size-3.5" style={{ color: kpi.color }} />
          </div>
          <div className="flex items-end gap-2">
            <span className="font-heading text-[1.5rem] font-bold leading-none text-foreground">
              {kpi.value}{kpi.unit}
            </span>
            <Badge className={`mb-0.5 gap-0.5 border-0 px-1.5 py-0 text-[8px] font-semibold ${kpi.deltaUp ? "bg-[#10B981]/15 text-[#10B981]" : "bg-[#F59E0B]/15 text-[#F59E0B]"}`}>
              {kpi.deltaUp && <ArrowUpRight className="size-2" />}
              {kpi.delta}
            </Badge>
          </div>
          <span className="text-[9px] text-muted-foreground">{kpi.sub}</span>
        </div>
      </Card>
    </motion.div>
  )
}

/* ─── Main component ─── */
export function PedagogieDashboard() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })

  return (
    <div ref={ref} className="flex flex-1 flex-col gap-5">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#C9A84C]/12 border border-[#C9A84C]/20">
              <BookOpen className="size-4 text-[#C9A84C]" />
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground tracking-tight">Pédagogie & Examens</h1>
          </div>
          <p className="text-[11px] text-muted-foreground ml-10">
            Gestion des matières, évaluations, formules de notation et délibérations · réseau complet
          </p>
        </div>
        <Badge className="gap-1.5 border border-[#C9A84C]/20 bg-[#C9A84C]/08 text-[10px] text-[#C9A84C] px-2.5 py-1">
          <span className="size-1.5 rounded-full bg-[#C9A84C] inline-block animate-pulse" />
          Semestre 2 · 2025–2026
        </Badge>
      </motion.div>

      {/* ── Alerts banner ── */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex gap-2 flex-wrap"
      >
        {ALERTS.map((a, i) => {
          const Icon = a.icon
          return (
            <div key={i} className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[10px]"
              style={{ borderColor: `${a.color}25`, backgroundColor: `${a.color}08`, color: a.color }}>
              <Icon className="size-3 shrink-0" />
              <span className="text-white/70">{a.msg}</span>
            </div>
          )
        })}
      </motion.div>

      {/* ── KPI row ── */}
      <motion.div
        variants={containerV}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        {KPI_DATA.map(kpi => (
          <KpiCard key={kpi.label} kpi={kpi} inView={inView} />
        ))}
      </motion.div>

      {/* ── Main content: sub-nav cards + upcoming ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Sub-nav module cards */}
        <motion.div
          variants={containerV}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="lg:col-span-2 grid grid-cols-2 gap-3"
        >
          {SUB_NAV.map((item) => {
            const Icon = item.icon
            return (
              <motion.div key={item.href} variants={itemV}>
                <Link href={item.href} className="group block">
                  <Card className="relative h-full overflow-hidden border-border/40 bg-card transition-all duration-200 hover:border-[#C9A84C]/30 hover:shadow-lg hover:shadow-black/30 hover:-translate-y-0.5">
                    <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%)" }} />
                    <div className="flex flex-col gap-3 p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/15 group-hover:bg-[#C9A84C]/18 transition-colors">
                          <Icon className="size-4 text-[#C9A84C]" />
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-[#C9A84C] group-hover:translate-x-0.5 transition-all" />
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-foreground group-hover:text-[#C9A84C] transition-colors mb-0.5">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Upcoming evaluations */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
        >
          <Card className="h-full border-border/50 bg-card">
            <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-3.5 text-[#C9A84C]" />
                <span className="text-[11px] font-semibold text-foreground">Prochaines évaluations</span>
              </div>
              <Link href="/dashboard/pedagogie/evaluations"
                className="text-[9px] text-muted-foreground hover:text-[#C9A84C] transition-colors">
                Voir tout →
              </Link>
            </div>
            <div className="divide-y divide-border/30">
              {UPCOMING.map((ev, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/2 transition-colors"
                >
                  <div className="flex size-6 shrink-0 items-center justify-center rounded text-[8px] font-bold"
                    style={{ backgroundColor: `${ev.color}15`, color: ev.color }}>
                    {ev.type.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate text-[10px] font-medium text-foreground">{ev.label}</div>
                    <div className="text-[8px] text-muted-foreground">{ev.classe}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[9px] text-muted-foreground">{ev.date}</div>
                    <div className={`text-[8px] font-semibold mt-0.5 ${
                      ev.status === "en cours" ? "text-[#10B981]" :
                      ev.status === "corrigé"  ? "text-[#3B82F6]" : "text-[#C9A84C]"
                    }`}>
                      {ev.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* ── Stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.45, duration: 0.35 }}
      >
        <Card className="border-border/50 bg-card px-5 py-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Progression du semestre
            </span>
            <TrendingUp className="size-3.5 text-[#10B981]" />
          </div>
          <div className="grid grid-cols-4 gap-6">
            {[
              { label: "Évaluations terminées",  pct: 68, color: "#10B981" },
              { label: "Volume horaire effectué", pct: 54, color: "#3B82F6" },
              { label: "Bulletins générés",        pct: 32, color: "#C9A84C" },
              { label: "Délibérations validées",   pct: 25, color: "#A78BFA" },
            ].map((s, i) => (
              <div key={s.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-[9px] text-muted-foreground">{s.label}</span>
                  <span className="text-[9px] font-bold tabular-nums" style={{ color: s.color }}>{s.pct}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.color }}
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${s.pct}%` } : { width: 0 }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

    </div>
  )
}
