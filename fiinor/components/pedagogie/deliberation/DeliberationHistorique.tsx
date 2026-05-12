"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Archive, Eye, Download, Calendar, Users,
  CheckCircle2, Lock, BarChart3, ChevronDown, ChevronRight,
  Shield, TrendingUp,
} from "lucide-react"
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, RadarChart, PolarGrid,
  PolarAngleAxis, Radar, Legend,
} from "recharts"
import type { Verdict } from "./DeliberationJury"

/* ─── Types ─── */
interface HistoriqueEntry {
  id: string
  classe: string
  periode: string
  datePublication: string
  auteur: string
  nbEtudiants: number
  repartition: Record<Verdict, number>
  snapshot: boolean
  matiereStats: { nom: string; moyenne: number; tauxReussite: number }[]
}

/* ─── Mock data ─── */
const MOCK_HISTORIQUE: HistoriqueEntry[] = [
  {
    id: "h1", classe: "Terminale A", periode: "2025–2026 S1",
    datePublication: "2026-02-15", auteur: "Dr. Kaba Modibo", nbEtudiants: 32, snapshot: true,
    repartition: { admis: 22, rattrapage: 7, ajourné: 3, exclu: 0, en_attente: 0 },
    matiereStats: [
      { nom: "Maths",     moyenne: 11.4, tauxReussite: 72 },
      { nom: "Physique",  moyenne: 10.8, tauxReussite: 65 },
      { nom: "Anglais",   moyenne: 12.1, tauxReussite: 84 },
      { nom: "Info",      moyenne: 13.2, tauxReussite: 88 },
      { nom: "Français",  moyenne: 9.8,  tauxReussite: 59 },
    ],
  },
  {
    id: "h2", classe: "1ère C", periode: "2025–2026 S1",
    datePublication: "2026-02-16", auteur: "Prof. Diallo Aminata", nbEtudiants: 28, snapshot: true,
    repartition: { admis: 18, rattrapage: 6, ajourné: 4, exclu: 0, en_attente: 0 },
    matiereStats: [
      { nom: "Maths",     moyenne: 10.2, tauxReussite: 64 },
      { nom: "Physique",  moyenne: 9.5,  tauxReussite: 57 },
      { nom: "Anglais",   moyenne: 11.8, tauxReussite: 79 },
      { nom: "Info",      moyenne: 12.5, tauxReussite: 82 },
      { nom: "Français",  moyenne: 10.9, tauxReussite: 68 },
    ],
  },
  {
    id: "h3", classe: "BTS Info 2", periode: "2024–2025 S2",
    datePublication: "2025-07-10", auteur: "Dr. Camara Ibrahima", nbEtudiants: 22, snapshot: true,
    repartition: { admis: 17, rattrapage: 4, ajourné: 1, exclu: 0, en_attente: 0 },
    matiereStats: [
      { nom: "Algo",      moyenne: 12.8, tauxReussite: 86 },
      { nom: "Réseau",    moyenne: 11.5, tauxReussite: 77 },
      { nom: "BDD",       moyenne: 13.1, tauxReussite: 90 },
      { nom: "Anglais",   moyenne: 10.4, tauxReussite: 63 },
      { nom: "Gestion",   moyenne: 11.9, tauxReussite: 72 },
    ],
  },
  {
    id: "h4", classe: "Terminale A", periode: "2024–2025 S2",
    datePublication: "2025-07-08", auteur: "Dr. Kaba Modibo", nbEtudiants: 30, snapshot: true,
    repartition: { admis: 20, rattrapage: 8, ajourné: 2, exclu: 0, en_attente: 0 },
    matiereStats: [
      { nom: "Maths",     moyenne: 10.9, tauxReussite: 69 },
      { nom: "Physique",  moyenne: 10.2, tauxReussite: 61 },
      { nom: "Anglais",   moyenne: 11.7, tauxReussite: 80 },
      { nom: "Info",      moyenne: 12.8, tauxReussite: 85 },
      { nom: "Français",  moyenne: 9.4,  tauxReussite: 55 },
    ],
  },
]

const VERDICT_CONFIG: Record<Verdict, { color: string; label: string }> = {
  admis:      { color: "#10B981", label: "Admis"      },
  rattrapage: { color: "#F59E0B", label: "Rattrapage" },
  ajourné:    { color: "#EF4444", label: "Ajourné"    },
  exclu:      { color: "#7C3AED", label: "Exclu"      },
  en_attente: { color: "rgba(255,255,255,0.3)", label: "En attente" },
}

/* ─── Dark tooltip ─── */
function DarkTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl px-3 py-2.5 text-[10px]" style={{ background: "#0c1a28", border: "1px solid rgba(255,255,255,0.1)" }}>
      <div className="font-bold text-white mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="size-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "rgba(255,255,255,0.5)" }}>{p.name}:</span>
          <span className="font-bold" style={{ color: p.color }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ─── Snapshot detail ─── */
function SnapshotDetail({ entry }: { entry: HistoriqueEntry }) {
  const total = entry.nbEtudiants
  const admisRate = Math.round((entry.repartition.admis / total) * 100)

  const radarData = entry.matiereStats.map(m => ({
    matiere: m.nom, moyenne: m.moyenne, reussite: m.tauxReussite / 5,
  }))

  const barData = [
    { name: "Admis",      val: entry.repartition.admis,      fill: "#10B981" },
    { name: "Rattrapage", val: entry.repartition.rattrapage,  fill: "#F59E0B" },
    { name: "Ajourné",    val: entry.repartition.ajourné,     fill: "#EF4444" },
  ]

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden">
      <div className="px-5 pb-5 pt-2 flex flex-col gap-4">

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Taux de réussite", val: `${admisRate}%`, color: "#10B981" },
            { label: "Admis", val: entry.repartition.admis, color: "#10B981" },
            { label: "Rattrapage", val: entry.repartition.rattrapage, color: "#F59E0B" },
            { label: "Ajourné", val: entry.repartition.ajourné, color: "#EF4444" },
          ].map(k => (
            <div key={k.label} className="rounded-xl px-3 py-2.5 text-center"
              style={{ background: `${k.color}08`, border: `1px solid ${k.color}20` }}>
              <div className="text-[20px] font-black tabular-nums leading-none" style={{ color: k.color }}>{k.val}</div>
              <div className="text-[8px] uppercase tracking-widest mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>{k.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bar chart */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <BarChart3 className="size-3.5" style={{ color: "#C9A84C" }} />
              <span className="text-[10px] font-bold text-white">Répartition des verdicts</span>
            </div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                  <Bar dataKey="val" name="Étudiants" radius={[4, 4, 0, 0]}>
                    {barData.map((d, i) => (
                      <rect key={i} fill={d.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar chart */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <TrendingUp className="size-3.5" style={{ color: "#3B82F6" }} />
              <span className="text-[10px] font-bold text-white">Profil par matière</span>
            </div>
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height={160}>
                <RadarChart data={radarData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="matiere" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 8 }} />
                  <Radar name="Moyenne" dataKey="moyenne" stroke="#C9A84C" fill="#C9A84C" fillOpacity={0.15} strokeWidth={2} />
                  <Radar name="Réussite" dataKey="reussite" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={1.5} />
                  <Legend wrapperStyle={{ fontSize: 8, color: "rgba(255,255,255,0.4)" }} />
                  <Tooltip content={<DarkTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Immutability notice */}
        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
          <Shield className="size-3.5 flex-shrink-0" style={{ color: "#10B981" }} />
          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Snapshot immuable · Publié le {new Date(entry.datePublication).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} par {entry.auteur}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Main ─── */
export function DeliberationHistorique() {
  const [expanded, setExpanded] = useState<string | null>(null)

  /* Comparative bar data */
  const comparatifData = MOCK_HISTORIQUE.slice(0, 4).map(e => ({
    name: `${e.classe.split(" ")[1] ?? e.classe} ${e.periode.split(" ")[0]}`,
    Admis: e.repartition.admis,
    Rattrapage: e.repartition.rattrapage,
    Ajourné: e.repartition.ajourné,
  }))

  return (
    <div className="flex flex-col gap-4">

      {/* Comparatif inter-sessions */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="px-5 py-3.5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <TrendingUp className="size-3.5" style={{ color: "#C9A84C" }} />
          <span className="text-[11px] font-bold text-white">Comparatif inter-sessions</span>
        </div>
        <div style={{ height: 200, minHeight: 200 }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={comparatifData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 8 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Legend wrapperStyle={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }} />
              <Bar dataKey="Admis"      fill="#10B981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Rattrapage" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Ajourné"    fill="#EF4444" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
            {MOCK_HISTORIQUE.length} délibérations archivées
          </span>
        </div>

        <AnimatePresence initial={false}>
          {MOCK_HISTORIQUE.map((entry, i) => {
            const total = entry.nbEtudiants
            const admisRate = Math.round((entry.repartition.admis / total) * 100)
            const isOpen = expanded === entry.id

            return (
              <motion.div key={entry.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, type: "spring" as const, stiffness: 350, damping: 28 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: "#07111d", border: "1px solid rgba(255,255,255,0.08)" }}>

                {/* Header row */}
                <div role="button" tabIndex={0}
                  onClick={() => setExpanded(isOpen ? null : entry.id)}
                  onKeyDown={e => (e.key === "Enter" || e.key === " ") && setExpanded(isOpen ? null : entry.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left flex-wrap gap-y-2 cursor-pointer">
                  {/* Lock icon */}
                  <div className="size-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}>
                    <Lock className="size-3.5" style={{ color: "#10B981" }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[12px] font-bold text-white">{entry.classe}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.45)" }}>
                        {entry.periode}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <span className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        <Calendar className="size-3" />
                        {new Date(entry.datePublication).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1 text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        <Users className="size-3" />{entry.nbEtudiants} étudiants
                      </span>
                      <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                        {entry.auteur}
                      </span>
                    </div>
                  </div>

                  {/* Verdict mini-bar */}
                  <div className="hidden sm:flex flex-col gap-1 w-28 flex-shrink-0">
                    <div className="flex rounded-full overflow-hidden" style={{ height: 4, background: "rgba(255,255,255,0.04)" }}>
                      {(["admis", "rattrapage", "ajourné"] as Verdict[]).map(v => (
                        <motion.div key={v}
                          animate={{ width: `${(entry.repartition[v] / total) * 100}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          style={{ background: VERDICT_CONFIG[v].color, height: "100%" }} />
                      ))}
                    </div>
                    <div className="text-[8px] text-right" style={{ color: "#10B981" }}>
                      {admisRate}% admis
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={e => e.stopPropagation()}
                      className="rounded-lg p-1.5 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}
                      title="Exporter PDF">
                      <Download className="size-3.5" />
                    </button>
                    <ChevronDown className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      style={{ color: "rgba(255,255,255,0.3)" }} />
                  </div>
                </div>

                {/* Snapshot detail */}
                <AnimatePresence>
                  {isOpen && <SnapshotDetail entry={entry} />}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
