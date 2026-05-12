"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText, Plus, Eye, ChevronDown, ChevronUp,
  Check, Layers, ToggleLeft, ToggleRight, Globe,
} from "lucide-react"
import { PARAMETRAGES_BULLETINS, type ParametrageBulletin, type TypeBulletin } from "./parametres-mock-data"

const G  = "#C9A84C"
const EM = "#10B981"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const AM = "#F59E0B"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const TYPE_CFG: Record<TypeBulletin, { lbl: string; color: string; icon: string }> = {
  classique:   { lbl: "Classique /20", color: G,  icon: "📄" },
  gpa:         { lbl: "GPA 4.0",       color: BL, icon: "🎓" },
  competences: { lbl: "Compétences",   color: PR, icon: "✅" },
  ects:        { lbl: "ECTS",          color: AM, icon: "📊" },
}

const METRIQUES_DISPONIBLES = [
  "moyenne","rang","mention","absences","gpa","credits_ects",
  "competences_validées","competences_encours","taux_validation","note_brute","coeff",
]

const GABARITS = [
  { id: "g1", nom: "Gabarit Standard Univ. Conakry", version: "v2.1", actif: true,  portee: "Global" },
  { id: "g2", nom: "Gabarit Ingénieurs GPA",          version: "v1.0", actif: false, portee: "Génie Civil" },
]

function Couche({ num, titre, desc, color }: { num: string; titre: string; desc: string; color: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: `${color}06`, border: `1px solid ${color}15` }}>
      <div className="size-6 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0"
        style={{ background: `${color}20`, color }}>
        {num}
      </div>
      <div>
        <div className="text-[9.5px] font-black text-white">{titre}</div>
        <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{desc}</div>
      </div>
    </div>
  )
}

export function BulletinsPage() {
  const [parametrages, setParametrages] = useState<ParametrageBulletin[]>(PARAMETRAGES_BULLETINS)
  const [expanded, setExpanded]         = useState<string | null>("pb1")
  const [preview, setPreview]           = useState(false)

  function toggleActif(id: string) {
    setParametrages(prev => prev.map(p => p.id === id ? { ...p, actif: !p.actif } : p))
  }

  function toggleMetrique(id: string, m: string) {
    setParametrages(prev => prev.map(p => {
      if (p.id !== id) return p
      const has = p.metriques.includes(m)
      return { ...p, metriques: has ? p.metriques.filter(x => x !== m) : [...p.metriques, m] }
    }))
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Architecture 3 couches */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2">
          <Layers size={12} style={{ color: G }} />
          <div className="text-[10px] font-black text-white">Architecture 3 couches</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Couche num="1" titre="Paramétrage" color={G}  desc="Métriques, langues, options d'affichage" />
          <Couche num="2" titre="Gabarit Jinja2" color={BL} desc="Template HTML/CSS versionné par établissement" />
          <Couche num="3" titre="Bulletin Versionné" color={EM} desc="Snapshot immuable · draft → published → archived" />
        </div>
      </motion.div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-[10px] font-bold text-white">
          {parametrages.filter(p => p.actif).length} paramétrage{parametrages.filter(p=>p.actif).length>1?"s":""} actif{parametrages.filter(p=>p.actif).length>1?"s":""}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPreview(!preview)}
            className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[9.5px] font-bold"
            style={{ background: preview ? `${BL}15` : CARD, color: preview ? BL : "rgba(255,255,255,0.35)", border: `1px solid ${preview ? BL+"30" : BORDER}` }}>
            <Eye size={10} /> Aperçu bulletin
          </button>
          <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
            style={{ background: G, color: "#000" }}>
            <Plus size={11} /> Nouveau paramétrage
          </button>
        </div>
      </div>

      {/* Aperçu bulletin */}
      <AnimatePresence>
        {preview && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="rounded-2xl p-5" style={{ background: "white", border: `2px solid ${G}30` }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-black text-gray-800 text-lg">Université de Conakry</div>
                  <div className="text-gray-500 text-xs mt-0.5">Bulletin Scolaire · Année 2024-2025</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Étudiant</div>
                  <div className="font-bold text-gray-800 text-sm">Mamadou Diallo</div>
                  <div className="text-xs text-gray-400">MAT-2025-001 · L3 Informatique</div>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden border border-gray-100">
                <div className="grid text-xs font-bold text-gray-500 bg-gray-50 px-3 py-2"
                  style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1.2fr" }}>
                  {["Matière","Coeff","Note /20","Rang","Mention"].map(h=><div key={h}>{h}</div>)}
                </div>
                {[
                  ["Algorithmique","3","16.5","2/45","Bien"],
                  ["Bases de données","3","14.0","8/45","Assez bien"],
                  ["Systèmes d'exploitation","2","12.5","15/45","Passable"],
                  ["Mathématiques","2","15.0","5/45","Bien"],
                ].map((row, i) => (
                  <div key={i} className="grid px-3 py-2 text-xs text-gray-700"
                    style={{ gridTemplateColumns:"2fr 1fr 1fr 1fr 1.2fr", background: i%2?"#fafafa":"white" }}>
                    {row.map((cell, j) => <div key={j} style={{ fontWeight: j===2?"bold":"normal" }}>{cell}</div>)}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                {[["Moyenne générale","14.75 / 20"],["Rang","4 / 45"],["Mention","Bien"],["Absences","3h"]].map(([k,v])=>(
                  <div key={k}>
                    <div className="text-gray-400">{k}</div>
                    <div className="font-black text-gray-800">{v}</div>
                  </div>
                ))}
              </div>
              <div className="text-[8px] text-gray-400 mt-3 pt-2 border-t border-gray-100 flex justify-between">
                <span>Document généré le 12/05/2025 — Fiinor Platform v1.0</span>
                <span style={{ color: G }}>ADMIS</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Paramétrages */}
      {parametrages.map((p, i) => {
        const tc     = TYPE_CFG[p.type]
        const isOpen = expanded === p.id
        return (
          <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${p.actif ? BORDER : "rgba(255,255,255,0.04)"}`, opacity: p.actif ? 1 : 0.55 }}>

            <div role="button" tabIndex={0} onClick={() => setExpanded(isOpen ? null : p.id)}
              onKeyDown={e => e.key === "Enter" && setExpanded(isOpen ? null : p.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
              style={{ background: isOpen ? `${G}04` : CARD, borderBottom: isOpen ? `1px solid ${BORDER}` : "none" }}>
              <div className="text-[18px]">{tc.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-[10px] font-black text-white">{p.nom}</div>
                  <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${tc.color}12`, color: tc.color }}>{tc.lbl}</span>
                  {p.langues.length > 1 && (
                    <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5"
                      style={{ background: `${BL}10`, color: BL }}>
                      <Globe size={7} /> {p.langues.join(", ")}
                    </span>
                  )}
                </div>
                <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {p.metriques.length} métriques · Arrondi {p.arrondissement} décimales
                </div>
              </div>
              <div role="button" tabIndex={0} onClick={e => { e.stopPropagation(); toggleActif(p.id) }}
                onKeyDown={e => e.key === "Enter" && (e.stopPropagation(), toggleActif(p.id))}>
                {p.actif
                  ? <ToggleRight size={20} style={{ color: EM }} />
                  : <ToggleLeft  size={20} style={{ color: "rgba(255,255,255,0.2)" }} />}
              </div>
              {isOpen ? <ChevronUp size={12} style={{ color: G }} /> : <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.2)" }} />}
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="overflow-hidden px-4 py-4 flex flex-col gap-4"
                  style={{ background: "rgba(0,0,0,0.12)" }}>
                  <div>
                    <div className="text-[8.5px] font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Métriques incluses</div>
                    <div className="flex flex-wrap gap-1.5">
                      {METRIQUES_DISPONIBLES.map(m => {
                        const active = p.metriques.includes(m)
                        return (
                          <button key={m} onClick={() => toggleMetrique(p.id, m)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] font-bold transition-all"
                            style={active
                              ? { background: `${G}15`, color: G, border: `1px solid ${G}25` }
                              : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)", border: `1px solid ${BORDER}` }}>
                            {active && <Check size={8} />}{m}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 flex-wrap text-[8.5px]">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={p.afficherRang}
                        className="accent-yellow-400" />
                      <span style={{ color: "rgba(255,255,255,0.45)" }}>Afficher le rang</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked={p.afficherMention}
                        className="accent-yellow-400" />
                      <span style={{ color: "rgba(255,255,255,0.45)" }}>Afficher la mention</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>Arrondi :</span>
                      <select defaultValue={p.arrondissement}
                        className="bg-transparent text-white text-[9px] outline-none rounded-lg px-2 py-1"
                        style={{ border: `1px solid ${BORDER}` }}>
                        <option value={0}>0 décimale</option>
                        <option value={1}>1 décimale</option>
                        <option value={2}>2 décimales</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )
      })}

      {/* Gabarits */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <FileText size={11} style={{ color: G }} />
          <span className="text-[10px] font-black text-white">Gabarits Jinja2</span>
          <span className="text-[8px] ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>— Couche 2</span>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {GABARITS.map((g, i) => (
            <div key={g.id} className="flex items-center gap-4 px-4 py-3"
              style={{ background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <div className="flex-1">
                <div className="text-[9.5px] font-bold text-white">{g.nom}</div>
                <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{g.version} · Portée : {g.portee}</div>
              </div>
              {g.actif && (
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full font-bold"
                  style={{ background: `${EM}12`, color: EM }}>actif</span>
              )}
              <button className="text-[8.5px] px-2.5 py-1.5 rounded-xl font-bold"
                style={{ background: `${G}10`, color: G, border: `1px solid ${G}20` }}>
                Éditer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
