"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Briefcase, Loader2, Check, AlertTriangle } from "lucide-react"
import { type TypeContrat } from "./rh-mock-data"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const BORDER = "rgba(255,255,255,0.07)"

const DEPARTEMENTS = ["Informatique","Droit","Médecine","Sciences Éco","Administration","Génie Civil","Pharmacie"]
const TYPES_CONTRAT: { value: TypeContrat; label: string }[] = [
  { value: "CDI",       label: "CDI — Contrat indéterminé" },
  { value: "CDD",       label: "CDD — Contrat déterminé"  },
  { value: "vacataire", label: "Vacataire"                },
  { value: "stage",     label: "Stage"                   },
]
const NIVEAUX_REQUIS = ["Licence","Master","Doctorat requis","Ingénieur diplômé","Bac+2","Bac+4 min","Pharmacien diplômé"]

interface Props { open: boolean; onClose: () => void }

export function DrawerNouvelleOffre({ open, onClose }: Props) {
  const [titre, setTitre]           = useState("")
  const [dept, setDept]             = useState("")
  const [typeContrat, setTypeContrat] = useState<TypeContrat | "">("")
  const [niveau, setNiveau]         = useState("")
  const [description, setDescription] = useState("")
  const [urgent, setUrgent]         = useState(false)
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)

  useEffect(() => {
    if (open) {
      setTitre(""); setDept(""); setTypeContrat(""); setNiveau(""); setDescription(""); setUrgent(false); setLoading(false); setSuccess(false)
    }
  }, [open])

  const canSubmit = titre && dept && typeContrat && niveau && !loading

  function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(onClose, 1400) }, 1800)
  }

  const inp = "w-full rounded-xl px-3 py-2.5 text-[10px] text-white bg-transparent outline-none"
  const inpStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{ width: 420, background: "#07111d", borderLeft: `1px solid ${BORDER}` }}>

            <div className="h-0.5 flex-shrink-0"
              style={{ background: `linear-gradient(90deg, #3B82F6, ${G} 60%, transparent)` }} />

            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#3B82F615", border: "1px solid #3B82F625" }}>
                  <Briefcase size={14} style={{ color: "#3B82F6" }} />
                </div>
                <div>
                  <div className="text-[12px] font-black text-white">Nouvelle offre d'emploi</div>
                  <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Recrutement</div>
                </div>
              </div>
              <button onClick={onClose} className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <X size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5" style={{ scrollbarWidth: "thin" }}>

              <div>
                <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Intitulé du poste *</label>
                <input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex: Professeur Informatique" className={inp} style={inpStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Département *</label>
                  <SelectCustom value={dept} onChange={setDept} placeholder="Département" accentColor={G}
                    options={DEPARTEMENTS.map(d => ({ value: d, label: d }))} />
                </div>
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Type contrat *</label>
                  <SelectCustom value={typeContrat} onChange={v => setTypeContrat(v as TypeContrat)} placeholder="Type" accentColor={G}
                    options={TYPES_CONTRAT.map(t => ({ value: t.value, label: t.label }))} />
                </div>
              </div>

              <div>
                <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Niveau requis *</label>
                <SelectCustom value={niveau} onChange={setNiveau} placeholder="Niveau de qualification" accentColor={G}
                  options={NIVEAUX_REQUIS.map(n => ({ value: n, label: n }))} />
              </div>

              <div>
                <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Description du poste</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}
                  rows={4} placeholder="Missions, responsabilités, profil recherché…"
                  className={`${inp} resize-none`} style={inpStyle} />
              </div>

              {/* Urgence */}
              <button onClick={() => setUrgent(!urgent)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-all"
                style={{ background: urgent ? `${RD}08` : "rgba(255,255,255,0.03)", border: `1px solid ${urgent ? RD + "30" : BORDER}` }}>
                <div className="size-4 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: urgent ? RD : "rgba(255,255,255,0.06)", border: `1px solid ${urgent ? RD : BORDER}` }}>
                  {urgent && <Check size={9} style={{ color: "white" }} />}
                </div>
                <div>
                  <div className="text-[10px] font-bold" style={{ color: urgent ? RD : "rgba(255,255,255,0.5)" }}>
                    Poste urgent
                  </div>
                  <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Affiche un badge d'urgence dans le kanban
                  </div>
                </div>
                {urgent && <AlertTriangle size={12} style={{ color: RD, marginLeft: "auto" }} />}
              </button>
            </div>

            <div className="px-5 py-4 flex gap-3 flex-shrink-0"
              style={{ borderTop: `1px solid ${BORDER}`, background: "rgba(0,0,0,0.2)" }}>
              <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-[10px] font-bold"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                Annuler
              </button>
              <button onClick={handleSubmit} disabled={!canSubmit}
                className="flex-[2] rounded-xl py-2.5 text-[11px] font-black flex items-center justify-center gap-2 transition-all"
                style={{ background: success ? EM : canSubmit ? G : "rgba(255,255,255,0.05)", color: success ? "white" : canSubmit ? "#000" : "rgba(255,255,255,0.2)", border: "none" }}>
                {loading ? <Loader2 size={14} className="animate-spin" />
                  : success ? <><Check size={14} /> Offre publiée</>
                  : "Publier l'offre"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
