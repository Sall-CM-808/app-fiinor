"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Download, FileText, Wallet, Users, UserCheck, BookOpen,
  HeartPulse, BarChart2, Briefcase, Globe, Loader2, CheckCircle2,
  CalendarDays, FileSpreadsheet,
} from "lucide-react"
import { RAPPORTS_DISPONIBLES, PERIODES } from "./rapports-mock-data"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const OR = "#F97316"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const ICON_MAP: Record<string, React.ElementType> = {
  Wallet, Users, FileText, UserCheck, BookOpen, HeartPulse,
  BarChart2, Briefcase, Globe,
}

const MODULE_COLORS: Record<string, string> = {
  finance:  EM,
  rh:       BL,
  services: PR,
  global:   G,
}

const FORMATS = [
  { value: "pdf",   label: "PDF",   icon: FileText },
  { value: "excel", label: "Excel", icon: FileSpreadsheet },
]

export function RapportExportsPage() {
  const [periode, setPeriode]     = useState(PERIODES[0].value)
  const [format, setFormat]       = useState<"pdf"|"excel">("pdf")
  const [generating, setGenerating] = useState<string | null>(null)
  const [done, setDone]           = useState<string[]>([])

  function generate(rapportId: string) {
    if (generating || done.includes(rapportId)) return
    setGenerating(rapportId)
    setTimeout(() => {
      setGenerating(null)
      setDone(prev => [...prev, rapportId])
    }, 2200)
  }

  function generateAll() {
    RAPPORTS_DISPONIBLES.forEach((r, i) => {
      setTimeout(() => {
        setGenerating(r.id)
        setTimeout(() => {
          setGenerating(null)
          setDone(prev => [...prev, r.id])
        }, 1800)
      }, i * 400)
    })
  }

  const periodeLabel = PERIODES.find(p => p.value === periode)?.label ?? ""

  return (
    <div className="flex flex-col gap-5">

      {/* Config barre */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 flex-wrap p-4 rounded-2xl"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2">
          <CalendarDays size={12} style={{ color: G }} />
          <span className="text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>Période :</span>
        </div>
        <div style={{ minWidth: 170 }}>
          <SelectCustom value={periode} onChange={setPeriode} accentColor={G}
            options={PERIODES} />
        </div>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-[9px] font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>Format :</span>
          <div className="flex gap-1 rounded-xl p-1" style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }}>
            {FORMATS.map(f => {
              const Icon = f.icon
              return (
                <button key={f.value} onClick={() => setFormat(f.value as "pdf"|"excel")}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-bold transition-all"
                  style={format === f.value
                    ? { background: G, color: "#000" }
                    : { background: "transparent", color: "rgba(255,255,255,0.35)" }}>
                  <Icon size={10} /> {f.label}
                </button>
              )
            })}
          </div>
        </div>

        <button onClick={generateAll}
          className="ml-auto flex items-center gap-2 rounded-xl px-4 py-2 text-[10px] font-black"
          style={{ background: `${G}15`, border: `1px solid ${G}30`, color: G }}>
          <Download size={12} /> Tout générer
        </button>
      </motion.div>

      {/* Résumé */}
      <div className="flex items-center gap-2">
        <div className="text-[10px] font-bold text-white">{RAPPORTS_DISPONIBLES.length} rapports disponibles</div>
        <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>pour la période</div>
        <div className="text-[9px] font-bold" style={{ color: G }}>{periodeLabel}</div>
        {done.length > 0 && (
          <div className="ml-auto text-[8.5px] font-bold flex items-center gap-1" style={{ color: EM }}>
            <CheckCircle2 size={10} /> {done.length} généré{done.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Grille rapports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {RAPPORTS_DISPONIBLES.map((r, i) => {
          const Icon    = ICON_MAP[r.icone] ?? FileText
          const color   = MODULE_COLORS[r.module] ?? G
          const isGen   = generating === r.id
          const isDone  = done.includes(r.id)

          return (
            <motion.div key={r.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl p-4 flex items-start gap-4"
              style={{ background: isDone ? `${EM}05` : CARD, border: `1px solid ${isDone ? EM + "20" : BORDER}` }}>

              {/* Icone */}
              <div className="rounded-xl p-2.5 flex-shrink-0"
                style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                <Icon size={14} style={{ color }} />
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-[10px] font-black text-white">{r.titre}</div>
                  <span className="text-[7px] px-1.5 py-0.5 rounded-full capitalize font-bold"
                    style={{ background: `${color}12`, color, border: `1px solid ${color}20` }}>
                    {r.module}
                  </span>
                </div>
                <div className="text-[8.5px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{r.description}</div>
                <div className="text-[8px] mt-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Période : {periodeLabel} · {format.toUpperCase()}
                </div>
              </div>

              {/* Bouton */}
              <button onClick={() => generate(r.id)}
                disabled={isGen}
                className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-[9px] font-bold transition-all"
                style={isDone
                  ? { background: `${EM}12`, color: EM, border: `1px solid ${EM}25` }
                  : isGen
                  ? { background: `${G}08`, color: G, border: `1px solid ${G}15`, opacity: 0.7 }
                  : { background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
                <AnimatePresence mode="wait">
                  {isGen ? (
                    <motion.span key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-1">
                      <Loader2 size={10} className="animate-spin" /> Génération…
                    </motion.span>
                  ) : isDone ? (
                    <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-1">
                      <CheckCircle2 size={10} /> Télécharger
                    </motion.span>
                  ) : (
                    <motion.span key="dl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-1">
                      <Download size={10} /> Générer
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          )
        })}
      </div>

      {/* Note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="flex items-start gap-2 px-4 py-3 rounded-xl"
        style={{ background: `${G}06`, border: `1px solid ${G}15` }}>
        <FileText size={10} style={{ color: G, marginTop: 1, flexShrink: 0 }} />
        <p className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Les rapports sont générés à partir des données en temps réel de la plateforme Fiinor.
          Les fichiers PDF et Excel sont produits côté serveur et signés numériquement.
          Durée de conservation : 7 ans conformément aux obligations comptables guinéennes.
        </p>
      </motion.div>
    </div>
  )
}
