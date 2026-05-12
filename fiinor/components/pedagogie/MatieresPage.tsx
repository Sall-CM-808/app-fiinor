"use client"

import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {
  BookOpen, CalendarDays, Search, Filter, Users, Clock,
  Plus, MoreHorizontal, CheckCircle2, Circle,
  GraduationCap, UserCheck, Hash, ChevronUp, ChevronDown,
  X, Download, Edit2, Trash2, Copy, Eye, ChevronLeft, ChevronRight,
  BarChart2, List, UserCircle, AlertCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddMatiereModal } from "@/components/pedagogie/AddMatiereModal"
import dynamic from "next/dynamic"

const PDFExportButton = dynamic(
  () => import("@/components/pedagogie/MatieresPDF").then(m => m.PDFExportButton),
  { ssr: false, loading: () => (
    <span className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}>
      PDF…
    </span>
  )},
)

/* ─── Mock data ─── */
const UNITES = ["Toutes", "Terminale A", "Terminale C", "1ère C", "BTS Info 2", "BTS Compta", "Licence 1 Droit"]

const MATIERES_INITIAL = [
  { id: 1, nom: "Mathématiques",       code: "MATH-T",  enseignant: "Prof. Diallo",    classe: "Terminale A", coeff: 5, heures: 120, hEffectues: 82, inscrits: 34, statut: "actif" },
  { id: 2, nom: "Physique-Chimie",     code: "PHY-C",   enseignant: "Prof. Camara",   classe: "Terminale C", coeff: 4, heures: 96,  hEffectues: 61, inscrits: 28, statut: "actif" },
  { id: 3, nom: "Philosophie",         code: "PHILO",   enseignant: "Prof. Bah",      classe: "Terminale A", coeff: 3, heures: 72,  hEffectues: 72, inscrits: 34, statut: "terminé" },
  { id: 4, nom: "Informatique",        code: "INFO-2",  enseignant: "Prof. Soumah",   classe: "BTS Info 2",  coeff: 6, heures: 144, hEffectues: 98, inscrits: 22, statut: "actif" },
  { id: 5, nom: "Comptabilité Générale",code:"COMPTA",  enseignant: "Prof. Kouyaté",  classe: "BTS Compta",  coeff: 5, heures: 120, hEffectues: 55, inscrits: 19, statut: "actif" },
  { id: 6, nom: "Anglais",             code: "ANG",     enseignant: "Prof. Touré",    classe: "1ère C",      coeff: 3, heures: 60,  hEffectues: 44, inscrits: 31, statut: "actif" },
  { id: 7, nom: "SVT",                 code: "SVT-T",   enseignant: "Prof. Sylla",    classe: "Terminale C", coeff: 4, heures: 96,  hEffectues: 60, inscrits: 28, statut: "actif" },
  { id: 8, nom: "Histoire-Géo",        code: "HG-T",    enseignant: "Prof. Diané",    classe: "Terminale A", coeff: 3, heures: 72,  hEffectues: 72, inscrits: 34, statut: "terminé" },
  { id: 9, nom: "Droit Civil",         code: "DROIT1",  enseignant: "Prof. Barry",    classe: "Licence 1 Droit", coeff: 4, heures: 80, hEffectues: 30, inscrits: 45, statut: "actif" },
]

/* ─── EDT mock ─── */
const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"]
const HEURES = ["07:30", "08:30", "09:30", "10:30", "11:30", "13:00", "14:00", "15:00", "16:00", "17:00"]

const CRENEAUX = [
  { jour: 0, heure: 0, matiere: "Mathématiques",   classe: "Terminale A", salle: "B-12", enseignant: "Prof. Diallo",  duree: 2, color: "#C9A84C",  presence: 92 },
  { jour: 0, heure: 3, matiere: "Informatique",    classe: "BTS Info 2",  salle: "Labo 1", enseignant: "Prof. Soumah", duree: 2, color: "#3B82F6",  presence: 88 },
  { jour: 0, heure: 5, matiere: "Comptabilité",    classe: "BTS Compta",  salle: "C-05", enseignant: "Prof. Kouyaté", duree: 2, color: "#10B981",  presence: 95 },
  { jour: 1, heure: 1, matiere: "Physique-Chimie", classe: "Terminale C", salle: "Labo 2", enseignant: "Prof. Camara",  duree: 2, color: "#F59E0B",  presence: 79 },
  { jour: 1, heure: 4, matiere: "Anglais",         classe: "1ère C",      salle: "A-03", enseignant: "Prof. Touré",   duree: 1, color: "#A78BFA",  presence: 85 },
  { jour: 1, heure: 6, matiere: "Droit Civil",     classe: "Licence 1",   salle: "D-01", enseignant: "Prof. Barry",   duree: 2, color: "#EC4899",  presence: 91 },
  { jour: 2, heure: 0, matiere: "SVT",             classe: "Terminale C", salle: "Labo 3", enseignant: "Prof. Sylla",   duree: 2, color: "#14B8A6",  presence: 83 },
  { jour: 2, heure: 3, matiere: "Mathématiques",   classe: "Terminale A", salle: "B-12", enseignant: "Prof. Diallo",  duree: 2, color: "#C9A84C",  presence: 90 },
  { jour: 3, heure: 1, matiere: "Informatique",    classe: "BTS Info 2",  salle: "Labo 1", enseignant: "Prof. Soumah", duree: 3, color: "#3B82F6",  presence: 87 },
  { jour: 3, heure: 5, matiere: "Philosophie",     classe: "Terminale A", salle: "A-08", enseignant: "Prof. Bah",     duree: 2, color: "#8B5CF6",  presence: 77 },
  { jour: 4, heure: 0, matiere: "Histoire-Géo",    classe: "Terminale A", salle: "A-07", enseignant: "Prof. Diané",   duree: 2, color: "#F97316",  presence: 88 },
  { jour: 4, heure: 3, matiere: "Comptabilité",    classe: "BTS Compta",  salle: "C-05", enseignant: "Prof. Kouyaté", duree: 2, color: "#10B981",  presence: 94 },
  { jour: 5, heure: 1, matiere: "Anglais",         classe: "1ère C",      salle: "A-03", enseignant: "Prof. Touré",   duree: 2, color: "#A78BFA",  presence: 80 },
]

/* ─── extra mock per-matière ─── */
const PRESENCE_MAP: Record<number, number> = { 1:91, 2:78, 3:100, 4:88, 5:95, 6:84, 7:82, 8:100, 9:73 }
const ETUDIANTS_SAMPLE = [
  "Mamadou Bah","Fatoumata Diallo","Alpha Soumah","Mariama Camara","Ibrahima Barry",
  "Aissatou Sylla","Oumar Kouyaté","Kadiatou Touré","Seydou Diané","Hawa Baldé",
]

type MatiereDef = typeof MATIERES_INITIAL[number]
type SortKey = "nom" | "enseignant" | "coeff" | "heures" | "inscrits" | "presence"
type SortDir = "asc" | "desc"

/* ─── Inscription Modal ─── */
function InscriptionModal({ matiere, onClose }: { matiere: typeof MATIERES_INITIAL[number]; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const list = ETUDIANTS_SAMPLE.filter(e => e.toLowerCase().includes(search.toLowerCase()))
  const toggle = (name: string) => setSelected(s => s.includes(name) ? s.filter(x => x !== name) : [...s, name])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
        className="relative z-10 w-[420px] rounded-xl border border-white/10 bg-[#0D1B2A] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
          <div>
            <div className="text-[13px] font-semibold text-white">Inscrire des étudiants</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{matiere.nom} · {matiere.classe}</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-white transition-colors"><X className="size-4" /></button>
        </div>
        <div className="px-5 py-3">
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un étudiant…"
              className="w-full rounded-lg border border-white/10 bg-white/5 pl-7 pr-3 py-1.5 text-[11px] text-white placeholder:text-white/25 outline-none focus:border-[#C9A84C]/40" />
          </div>
          <div className="space-y-1 max-h-52 overflow-auto">
            {list.map(e => (
              <div key={e} onClick={() => toggle(e)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                  selected.includes(e) ? "bg-[#C9A84C]/10 border border-[#C9A84C]/20" : "hover:bg-white/4 border border-transparent"
                }`}>
                <div className={`flex size-4 shrink-0 items-center justify-center rounded border ${
                  selected.includes(e) ? "border-[#C9A84C] bg-[#C9A84C]" : "border-white/20"
                }`}>
                  {selected.includes(e) && <CheckCircle2 className="size-2.5 text-black" />}
                </div>
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-[8px] font-bold text-white/60">
                  {e.slice(0,1)}
                </div>
                <span className="text-[11px] text-white/80">{e}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/8 px-5 py-3">
          <span className="text-[10px] text-muted-foreground">{selected.length} sélectionné{selected.length > 1 ? "s" : ""}</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-lg border border-white/10 px-3 py-1.5 text-[11px] text-white/50 hover:text-white transition-colors">Annuler</button>
            <button onClick={onClose} className="rounded-lg bg-[#C9A84C] px-4 py-1.5 text-[11px] font-semibold text-black hover:bg-[#C9A84C]/80 transition-colors">
              Inscrire ({selected.length})
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Detail panel — floating overlay ─── */
function DetailPanel({ m, onClose }: { m: typeof MATIERES_INITIAL[number]; onClose: () => void }) {
  const pct = Math.round((m.hEffectues / m.heures) * 100)
  const presence = PRESENCE_MAP[m.id] ?? 80
  const isTermine = m.statut === "terminé"
  const sc = isTermine ? "#10B981" : "#C9A84C"
  const presColor = presence >= 85 ? "#10B981" : presence >= 70 ? "#F59E0B" : "#EF4444"
  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
      {/* panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.22, ease: [0.16,1,0.3,1] }}
        className="fixed right-6 top-20 z-50 w-[280px] flex flex-col rounded-xl overflow-hidden"
        style={{ background: "#0b1420", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 24px 64px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg text-[9px] font-bold"
              style={{ backgroundColor: `${sc}18`, color: sc, border: `1px solid ${sc}30` }}>
              {m.code.slice(0,3)}
            </div>
            <div>
              <div className="text-[12px] font-bold text-white leading-tight">{m.nom}</div>
              <div className="text-[9px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{m.code}</div>
            </div>
          </div>
          <button onClick={onClose}
            className="flex size-6 items-center justify-center rounded-md transition-colors"
            style={{ color: "rgba(255,255,255,0.3)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "white")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}>
            <X className="size-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-3.5 px-4 py-4 overflow-auto max-h-[calc(100vh-120px)]">
          {/* Badge statut */}
          <div>
            {isTermine
              ? <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold" style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}><CheckCircle2 className="size-2.5" />Terminé</span>
              : <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-semibold" style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}><Circle className="size-2.5" />Actif</span>
            }
          </div>

          {/* Info rows */}
          <div className="flex flex-col gap-2">
            {[
              { label: "Enseignant", val: m.enseignant, icon: UserCircle },
              { label: "Classe",     val: m.classe,     icon: GraduationCap },
              { label: "Coefficient",val: `Coeff. ${m.coeff}`, icon: BarChart2 },
              { label: "Étudiants",  val: `${m.inscrits} inscrits`, icon: Users },
            ].map(f => {
              const Icon = f.icon
              return (
                <div key={f.label} className="flex items-center gap-2.5 py-1.5 rounded-lg px-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <Icon className="size-3.5 shrink-0" style={{ color: "rgba(255,255,255,0.3)" }} />
                  <div>
                    <div className="text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>{f.label}</div>
                    <div className="text-[11px] font-medium text-white">{f.val}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Volume horaire */}
          <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Volume horaire</span>
              <span className="text-[11px] font-bold tabular-nums" style={{ color: sc }}>{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div className="h-full rounded-full" style={{ backgroundColor: sc }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{m.hEffectues}h effectuées</span>
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{m.heures}h total</span>
            </div>
          </div>

          {/* Présence */}
          <div className="rounded-lg p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[8px] uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>Taux de présence</span>
              <span className="text-[11px] font-bold tabular-nums" style={{ color: presColor }}>{presence}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div className="h-full rounded-full" style={{ backgroundColor: presColor }}
                initial={{ width: 0 }} animate={{ width: `${presence}%` }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.16,1,0.3,1] }} />
            </div>
            {presence < 75 && (
              <div className="flex items-center gap-1 mt-1.5 text-[8px]" style={{ color: "#F59E0B" }}>
                <AlertCircle className="size-2.5" />Taux sous le seuil recommandé
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
            {[
              { icon: Edit2,  label: "Modifier la matière",   danger: false },
              { icon: Copy,   label: "Dupliquer",              danger: false },
              { icon: Users,  label: "Gérer les inscriptions", danger: false },
              { icon: Trash2, label: "Supprimer",              danger: true  },
            ].map(a => {
              const Icon = a.icon
              return (
                <button key={a.label}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[11px] font-medium text-left transition-colors"
                  style={{ color: a.danger ? "#F87171" : "rgba(255,255,255,0.6)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = a.danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.05)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <Icon className="size-3.5 shrink-0" />{a.label}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </>
  )
}

/* ─── Variants ─── */
const rowV = { hidden: { opacity: 0, x: -10 }, visible: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04, type: "spring" as const, stiffness: 280, damping: 26 } }) }

/* ─── Matière row ─── */
function MatiereRow({ m, i, inView, selected, onSelect, onShowDetail }: {
  m: MatiereDef; i: number; inView: boolean
  selected: boolean; onSelect: () => void; onShowDetail: () => void
}) {
  const pct = Math.round((m.hEffectues / m.heures) * 100)
  const presence = PRESENCE_MAP[m.id] ?? 80
  const isTermine = m.statut === "terminé"
  const presColor = presence >= 85 ? "#10B981" : presence >= 70 ? "#F59E0B" : "#EF4444"

  return (
    <motion.tr
      custom={i}
      variants={rowV}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onClick={onShowDetail}
      className={`border-b border-border/30 cursor-pointer transition-colors ${
        selected ? "bg-[#C9A84C]/06 border-l-2 border-l-[#C9A84C]" : "hover:bg-white/2"
      }`}
    >
      <td className="py-2.5 pl-4 pr-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md text-[9px] font-bold"
            style={{ backgroundColor: isTermine ? "rgba(255,255,255,0.05)" : "#C9A84C15", color: isTermine ? "rgba(255,255,255,0.3)" : "#C9A84C" }}>
            {m.code.slice(0, 3)}
          </div>
          <div>
            <div className="text-[11px] font-semibold text-foreground">{m.nom}</div>
            <div className="text-[8px] text-muted-foreground font-mono">{m.code}</div>
          </div>
        </div>
      </td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-1.5">
          <UserCircle className="size-3 text-muted-foreground" />
          <div className="text-[10px] text-foreground/80">{m.enseignant}</div>
        </div>
      </td>
      <td className="py-2.5 px-2">
        <Badge className="border-0 bg-white/5 text-[8px] text-muted-foreground px-1.5">{m.classe}</Badge>
      </td>
      <td className="py-2.5 px-2 text-center">
        <span className="text-[11px] font-bold text-[#C9A84C]">{m.coeff}</span>
      </td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-2 min-w-[110px]">
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ backgroundColor: isTermine ? "#10B981" : "#3B82F6" }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${pct}%` } : { width: 0 }}
              transition={{ delay: 0.2 + i * 0.03, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="text-[8px] tabular-nums text-muted-foreground w-16 shrink-0">
            {m.hEffectues}h / {m.heures}h
          </span>
        </div>
      </td>
      <td className="py-2.5 px-2">
        <div className="flex items-center gap-2 min-w-[80px]">
          <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ backgroundColor: presColor }}
              initial={{ width: 0 }}
              animate={inView ? { width: `${presence}%` } : { width: 0 }}
              transition={{ delay: 0.25 + i * 0.03, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <span className="text-[8px] tabular-nums font-bold w-8 shrink-0" style={{ color: presColor }}>
            {presence}%
          </span>
        </div>
      </td>
      <td className="py-2.5 px-2 text-center">
        <div className="flex items-center justify-center gap-1">
          <Users className="size-2.5 text-muted-foreground" />
          <span className="text-[10px] text-foreground/70">{m.inscrits}</span>
        </div>
      </td>
      <td className="py-2.5 pl-2 pr-4">
        <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
          {isTermine
            ? <Badge className="border-0 bg-[#10B981]/12 text-[#10B981] text-[8px] gap-1 px-1.5"><CheckCircle2 className="size-2" />Terminé</Badge>
            : <Badge className="border-0 bg-[#3B82F6]/12 text-[#3B82F6] text-[8px] gap-1 px-1.5"><Circle className="size-2" />Actif</Badge>
          }
          <button onClick={onShowDetail} className="flex size-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-[#C9A84C] hover:bg-[#C9A84C]/10">
            <Eye className="size-3" />
          </button>
          <button className="flex size-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-white/8">
            <MoreHorizontal className="size-3" />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}

/* ─── EDT Tooltip ─── */
function CreneauTooltip({ c, onClose }: { c: typeof CRENEAUX[number]; onClose: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}
      className="absolute z-50 w-56 rounded-xl border shadow-2xl overflow-hidden pointer-events-none"
      style={{ backgroundColor: "#0D1B2A", borderColor: `${c.color}40`, left: "calc(100% + 6px)", top: 0 }}>
      <div className="px-3 py-2.5 border-b" style={{ borderColor: `${c.color}20`, backgroundColor: `${c.color}12` }}>
        <div className="text-[11px] font-bold" style={{ color: c.color }}>{c.matiere}</div>
        <div className="text-[9px] text-white/50 mt-0.5">{c.salle} · {c.enseignant}</div>
      </div>
      <div className="px-3 py-2.5 space-y-1.5">
        <div className="flex justify-between text-[9px]">
          <span className="text-white/40">Classe</span>
          <span className="font-medium text-white/80">{c.classe}</span>
        </div>
        <div className="flex justify-between text-[9px]">
          <span className="text-white/40">Durée</span>
          <span className="font-medium text-white/80">{c.duree}h</span>
        </div>
        <div className="flex justify-between text-[9px]">
          <span className="text-white/40">Horaire</span>
          <span className="font-medium text-white/80">{HEURES[c.heure]} → {HEURES[Math.min(c.heure + c.duree, HEURES.length - 1)]}</span>
        </div>
        <div className="pt-1.5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex justify-between mb-1">
            <span className="text-[8px] text-white/40">Présence</span>
            <span className="text-[8px] font-bold" style={{ color: c.presence >= 85 ? "#10B981" : c.presence >= 70 ? "#F59E0B" : "#EF4444" }}>{c.presence}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${c.presence}%`, backgroundColor: c.presence >= 85 ? "#10B981" : c.presence >= 70 ? "#F59E0B" : "#EF4444" }} />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ─── Emploi du temps grid ─── */
function EdtGrid({ filterClasse }: { filterClasse: string }) {
  const [clickedIdx, setClickedIdx] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"classe" | "enseignant">("classe")
  const todayIdx = 2

  const creneaux = filterClasse === "Toutes" ? CRENEAUX
    : CRENEAUX.filter(c => c.classe.includes(filterClasse.split(" ")[0]) || c.classe === filterClasse)

  const JOUR_LABELS = JOURS.map((j, i) => ({ j, isToday: i === todayIdx }))

  /* heatmap: nb créneaux par jour */
  const chargeParJour = JOURS.map((_, i) => creneaux.filter(c => c.jour === i).reduce((s, c) => s + c.duree, 0))
  const maxCharge = Math.max(...chargeParJour, 1)

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex rounded-lg border border-border/40 overflow-hidden">
          {(["classe", "enseignant"] as const).map(v => (
            <button key={v} onClick={() => setViewMode(v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium transition-colors ${
                viewMode === v ? "bg-[#C9A84C]/12 text-[#C9A84C]" : "text-muted-foreground hover:text-foreground"
              }`}>
              {v === "classe" ? <List className="size-3" /> : <UserCircle className="size-3" />}
              {v === "classe" ? "Par classe" : "Par enseignant"}
            </button>
          ))}
        </div>
        <span className="text-[9px] text-muted-foreground">{creneaux.length} créneaux affichés</span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          {/* Heatmap charge row */}
          <div className="grid gap-px mb-1" style={{ gridTemplateColumns: "56px repeat(6, 1fr)" }}>
            <div className="text-[7px] text-muted-foreground/40 flex items-end pb-1 pr-1 text-right">Charge</div>
            {JOUR_LABELS.map(({ j, isToday }, i) => (
              <div key={j} className="flex flex-col items-center gap-0.5 pb-1">
                <div className="w-full h-2 rounded-sm overflow-hidden bg-white/4">
                  <div className="h-full rounded-sm" style={{ width: `${(chargeParJour[i] / maxCharge) * 100}%`, backgroundColor: isToday ? "#C9A84C" : "rgba(255,255,255,0.15)" }} />
                </div>
                <div className={`text-[9px] font-semibold uppercase tracking-widest ${
                  isToday ? "text-[#C9A84C]" : "text-muted-foreground"
                }`}>{j}</div>
              </div>
            ))}
          </div>

          {/* Grille */}
          <div className="relative grid gap-px" style={{ gridTemplateColumns: "56px repeat(6, 1fr)" }}>
            {/* Colonne heures */}
            <div className="flex flex-col">
              {HEURES.map(h => (
                <div key={h} className="flex items-center justify-end pr-2 text-[8px] text-muted-foreground/50 font-mono"
                  style={{ height: 44 }}>
                  {h}
                </div>
              ))}
            </div>

            {/* Colonnes jours */}
            {JOUR_LABELS.map(({ isToday }, jourIdx) => (
              <div key={jourIdx} className={`relative flex flex-col gap-px rounded-sm ${
                isToday ? "ring-1 ring-inset ring-[#C9A84C]/20" : ""
              }`}>
                {/* Fond grille */}
                {HEURES.map((_, hi) => (
                  <div key={hi} className={`border-b hover:bg-white/1 transition-colors ${
                    isToday ? "border-[#C9A84C]/8" : "border-white/3"
                  }`}
                    style={{ height: 44 }} />
                ))}

                {/* Créneaux positionnés */}
                {creneaux.filter(c => c.jour === jourIdx).map((c, ci) => {
                  const globalIdx = CRENEAUX.findIndex(x => x === c)
                  const isClicked = clickedIdx === globalIdx
                  return (
                    <div key={ci} className="absolute left-0.5 right-0.5 z-10" style={{ top: c.heure * 45, height: c.duree * 45 - 3 }}>
                      <motion.div
                        initial={{ opacity: 0, scaleY: 0.85 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ delay: 0.05 + ci * 0.04, duration: 0.2 }}
                        onClick={() => setClickedIdx(isClicked ? null : globalIdx)}
                        className="relative h-full w-full rounded-md cursor-pointer overflow-visible"
                        style={{
                          backgroundColor: `${c.color}18`,
                          borderLeft: `2.5px solid ${c.color}`,
                          boxShadow: isClicked ? `0 0 0 1px ${c.color}50, 0 4px 16px ${c.color}25` : undefined,
                        }}
                      >
                        <div className="px-1.5 py-1 h-full">
                          <div className="text-[9px] font-semibold leading-tight truncate" style={{ color: c.color }}>
                            {viewMode === "enseignant" ? c.enseignant.replace("Prof. ", "") : c.matiere}
                          </div>
                          {c.duree >= 2 && (
                            <div className="text-[7px] text-muted-foreground truncate">
                              {viewMode === "enseignant" ? c.matiere : c.classe}
                            </div>
                          )}
                          {c.duree >= 2 && (
                            <div className="text-[7px] text-muted-foreground/50 truncate">{c.salle}</div>
                          )}
                        </div>
                        {/* Tooltip au clic */}
                        <AnimatePresence>
                          {isClicked && <CreneauTooltip c={c} onClose={() => setClickedIdx(null)} />}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main export ─── */
export function MatieresPage() {
  const [tab, setTab] = useState<"matieres" | "edt">("matieres")
  const [search, setSearch] = useState("")
  const [unite, setUnite] = useState("Toutes")
  const [sortKey, setSortKey] = useState<SortKey>("nom")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [matieres, setMatieres] = useState<MatiereDef[]>(MATIERES_INITIAL)
  const [showAddMatiere, setShowAddMatiere] = useState(false)
  const [showInscription, setShowInscription] = useState(false)
  const [page, setPage] = useState(0)
  const [edtClasse, setEdtClasse] = useState("Toutes")
  const [weekOffset, setWeekOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-20px" })
  const PAGE_SIZE = 6

  const WEEKS = ["Sem. du 21 avr.", "Sem. du 28 avr.", "Sem. du 5 mai", "Sem. du 12 mai"]
  const weekLabel = WEEKS[Math.min(Math.max(weekOffset, 0), WEEKS.length - 1)]

  const handleSort = useCallback((key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
    setPage(0)
  }, [sortKey])

  const filtered = matieres
    .filter(m =>
      (unite === "Toutes" || m.classe === unite) &&
      (m.nom.toLowerCase().includes(search.toLowerCase()) ||
       m.enseignant.toLowerCase().includes(search.toLowerCase()) ||
       m.code.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      let va: string | number, vb: string | number
      if (sortKey === "nom") { va = a.nom; vb = b.nom }
      else if (sortKey === "enseignant") { va = a.enseignant; vb = b.enseignant }
      else if (sortKey === "coeff") { va = a.coeff; vb = b.coeff }
      else if (sortKey === "heures") { va = a.hEffectues / a.heures; vb = b.hEffectues / b.heures }
      else if (sortKey === "inscrits") { va = a.inscrits; vb = b.inscrits }
      else { va = PRESENCE_MAP[a.id] ?? 0; vb = PRESENCE_MAP[b.id] ?? 0 }
      const cmp = va < vb ? -1 : va > vb ? 1 : 0
      return sortDir === "asc" ? cmp : -cmp
    })

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const selectedMatiere = selectedId ? matieres.find(m => m.id === selectedId) ?? null : null

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronUp className="size-2.5 opacity-20" />
    return sortDir === "asc" ? <ChevronUp className="size-2.5 text-[#C9A84C]" /> : <ChevronDown className="size-2.5 text-[#C9A84C]" />
  }

  function exportCSV() {
    const header = "Matière,Code,Enseignant,Classe,Coeff,Heures,H.Effectuées,Inscrits,Présence,Statut"
    const rows = matieres.map(m =>
      [m.nom, m.code, m.enseignant, m.classe, m.coeff, m.heures, m.hEffectues, m.inscrits, PRESENCE_MAP[m.id] ?? 80, m.statut].join(",")
    )
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = "matieres.csv"; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div ref={ref} className="flex flex-1 flex-col gap-5">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-[#C9A84C]/12 border border-[#C9A84C]/20">
              <BookOpen className="size-4 text-[#C9A84C]" />
            </div>
            <h1 className="font-heading text-xl font-bold text-foreground tracking-tight">Matières & Emploi du temps</h1>
          </div>
          <p className="text-[11px] text-muted-foreground ml-10">
            {filtered.length} matière{filtered.length > 1 ? "s" : ""} · inscriptions, coefficients, volumes horaires et présences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PDFExportButton matieres={matieres} presenceMap={PRESENCE_MAP} />
          <button onClick={() => setShowAddMatiere(true)}
            className="flex items-center gap-2 rounded-lg border border-[#C9A84C]/25 bg-[#C9A84C]/08 px-3 py-1.5 text-[11px] font-semibold text-[#C9A84C] hover:bg-[#C9A84C]/14 transition-colors">
            <Plus className="size-3.5" />Nouvelle matière
          </button>
        </div>
      </motion.div>

      {/* ── KPI mini-row ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}
        className="grid grid-cols-4 gap-3">
        {[
          { label: "Matières actives",     val: String(matieres.filter(m => m.statut === "actif").length),  icon: BookOpen,      color: "#C9A84C" },
          { label: "Enseignants assignés", val: String(new Set(matieres.map(m => m.enseignant)).size),      icon: GraduationCap, color: "#3B82F6" },
          { label: "Étudiants inscrits",   val: matieres.reduce((s, m) => s + m.inscrits, 0).toLocaleString("fr-FR"), icon: UserCheck, color: "#10B981" },
          { label: "Présence moy. réseau",  val: Math.round(Object.values(PRESENCE_MAP).reduce((a,b)=>a+b,0)/Object.keys(PRESENCE_MAP).length)+"%", icon: Clock, color: "#A78BFA" },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <motion.div key={k.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}>
              <Card className="flex items-center gap-3 border-border/40 bg-card px-3 py-2.5">
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md" style={{ backgroundColor: `${k.color}15` }}>
                  <Icon className="size-3.5" style={{ color: k.color }} />
                </div>
                <div>
                  <div className="text-[8px] text-muted-foreground uppercase tracking-wider">{k.label}</div>
                  <div className="text-[14px] font-bold text-foreground leading-tight">{k.val}</div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex gap-0 border-b border-border/40">
        {[
          { id: "matieres", label: "Liste des matières", icon: Hash },
          { id: "edt",      label: "Emploi du temps",    icon: CalendarDays },
        ].map(t => {
          const Icon = t.icon
          return (
            <button key={t.id} onClick={() => setTab(t.id as "matieres" | "edt")}
              className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold transition-all border-b-2 -mb-px ${
                tab === t.id ? "text-white border-[#C9A84C]" : "text-muted-foreground hover:text-foreground border-transparent"
              }`}
              style={{ background: tab === t.id ? "rgba(201,168,76,0.06)" : "transparent" }}>
              <Icon className="size-3.5" />{t.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {tab === "matieres" && (
          <motion.div key="matieres" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>

            {/* Filters */}
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }}
                  placeholder="Matière, enseignant, code…"
                  className="w-full rounded-lg border border-border/50 bg-card pl-7 pr-3 py-1.5 text-[11px] text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-[#C9A84C]/40 transition-colors" />
              </div>
              <div className="flex items-center gap-1">
                <Filter className="size-3 text-muted-foreground" />
                <div className="flex gap-1 flex-wrap">
                  {UNITES.map(u => (
                    <button key={u} onClick={() => { setUnite(u); setPage(0) }}
                      className={`rounded-full px-2.5 py-0.5 text-[9px] font-medium transition-all ${
                        unite === u ? "bg-[#C9A84C]/18 text-[#C9A84C] border border-[#C9A84C]/30" : "text-muted-foreground border border-border/30 hover:text-foreground"
                      }`}>
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Table */}
            <Card className="border-border/50 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                    {([
                      { label: "Matière",      key: "nom" as SortKey,        w: undefined },
                      { label: "Enseignant",   key: "enseignant" as SortKey, w: "140px" },
                      { label: "Classe",        key: null,                    w: "110px" },
                      { label: "Coeff",         key: "coeff" as SortKey,      w: "60px" },
                      { label: "Vol. horaire",  key: "heures" as SortKey,     w: "160px" },
                      { label: "Présence",       key: "presence" as SortKey,   w: "120px" },
                      { label: "Inscrits",       key: "inscrits" as SortKey,   w: "80px" },
                      { label: "Statut",         key: null,                    w: "90px" },
                    ]).map(h => (
                      <th key={h.label}
                        onClick={() => h.key && handleSort(h.key)}
                        style={{ width: h.w, color: "rgba(255,255,255,0.3)" }}
                        className={`py-2.5 px-3 text-left text-[8px] font-semibold uppercase tracking-widest first:pl-4 last:pr-4 select-none transition-colors ${
                          h.key ? "cursor-pointer hover:!text-white/70" : ""
                        }`}>
                        <div className="flex items-center gap-1">
                          {h.label}{h.key && <SortIcon k={h.key} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((m, i) => (
                    <MatiereRow key={m.id} m={m} i={i} inView={inView}
                      selected={selectedId === m.id}
                      onSelect={() => setSelectedId(m.id)}
                      onShowDetail={() => setSelectedId(selectedId === m.id ? null : m.id)}
                    />
                  ))}
                  {paginated.length === 0 && (
                    <tr><td colSpan={8} className="py-12 text-center text-[11px] text-muted-foreground">Aucune matière trouvée</td></tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {filtered.length === 0 ? "0" : `${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, filtered.length)}`} sur {filtered.length} matière{filtered.length > 1 ? "s" : ""}
                </span>
                {pageCount > 1 && (
                  <div className="flex gap-1">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                      className="flex size-6 items-center justify-center rounded transition-colors disabled:opacity-25"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                      <ChevronLeft className="size-3" />
                    </button>
                    {Array.from({ length: pageCount }, (_, i) => (
                      <button key={i} onClick={() => setPage(i)}
                        className="flex size-6 items-center justify-center rounded text-[9px] font-medium transition-colors"
                        style={page === i
                          ? { background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)", color: "#C9A84C" }
                          : { border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(pageCount - 1, p + 1))} disabled={page === pageCount - 1}
                      className="flex size-6 items-center justify-center rounded transition-colors disabled:opacity-25"
                      style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}>
                      <ChevronRight className="size-3" />
                    </button>
                  </div>
                )}
              </div>
            </Card>

            {/* Detail panel — floating overlay */}
            <AnimatePresence>
              {selectedMatiere && (
                <DetailPanel m={selectedMatiere} onClose={() => setSelectedId(null)} />
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {tab === "edt" && (
          <motion.div key="edt" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>

            {/* EDT controls */}
            <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                {/* Week navigator */}
                <div className="flex items-center gap-0 rounded-lg border border-border/40 overflow-hidden">
                  <button onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
                    className="flex items-center px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-white/4 transition-colors border-r border-border/40">
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span className="px-3 py-1.5 text-[11px] font-medium text-foreground min-w-[140px] text-center">{weekLabel}</span>
                  <button onClick={() => setWeekOffset(w => Math.min(WEEKS.length - 1, w + 1))}
                    className="flex items-center px-2 py-1.5 text-muted-foreground hover:text-foreground hover:bg-white/4 transition-colors border-l border-border/40">
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>
                {/* Classe filter */}
                <select value={edtClasse} onChange={e => setEdtClasse(e.target.value)}
                  className="rounded-lg border border-border/50 bg-card px-2.5 py-1.5 text-[11px] text-foreground outline-none focus:border-[#C9A84C]/40">
                  <option>Toutes</option>
                  {UNITES.slice(1).map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm inline-block bg-[#C9A84C]/50" />Cours</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm inline-block bg-[#3B82F6]/50" />Labo</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm inline-block bg-[#10B981]/50" />TP</span>
                <span className="flex items-center gap-1"><span className="size-2 rounded-sm inline-block bg-[#C9A84C]/90 ring-1 ring-[#C9A84C]" />Aujourd&apos;hui</span>
              </div>
            </div>

            <Card className="border-border/50 bg-card p-4">
              <EdtGrid filterClasse={edtClasse} />
            </Card>

            {/* Stats présence */}
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[
                { label: "Présence moy.",            val: `${Math.round(CRENEAUX.reduce((s,c)=>s+c.presence,0)/CRENEAUX.length)}%`,  color: "#10B981", sub: `${CRENEAUX.length} créneaux actifs` },
                { label: "Cours le plus chargé",     val: "BTS Info 2",  color: "#3B82F6",  sub: "34h / semaine · Labo 1" },
                { label: "Présence critique (< 80%)",val: `${CRENEAUX.filter(c => c.presence < 80).length}`,  color: "#F59E0B",  sub: "Créneaux sous le seuil" },
                { label: "Prochaine absence",        val: "Jeu 8 mai",   color: "#EF4444",  sub: "Prof. Bah — Philosophie" },
              ].map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}>
                  <Card className="border-border/40 bg-card px-3 py-2.5">
                    <div className="text-[8px] uppercase tracking-widest text-muted-foreground mb-1">{s.label}</div>
                    <div className="text-[13px] font-bold" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-[8px] text-muted-foreground mt-0.5">{s.sub}</div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inscription modal */}
      <AnimatePresence>
        {showInscription && selectedMatiere && (
          <InscriptionModal matiere={selectedMatiere} onClose={() => setShowInscription(false)} />
        )}
      </AnimatePresence>

      {/* Add matiere modal */}
      <AnimatePresence>
        {showAddMatiere && (
          <AddMatiereModal
            onClose={() => setShowAddMatiere(false)}
            onAdd={(data) => {
              setMatieres(prev => [...prev, {
                id: data.id,
                nom: data.nom,
                code: data.code,
                enseignant: data.enseignant,
                classe: data.classe,
                coeff: Number(data.coeff),
                heures: Number(data.heures),
                hEffectues: 0,
                inscrits: 0,
                statut: data.statut,
              }])
            }}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
