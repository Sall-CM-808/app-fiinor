"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CalendarDays, Loader2, Check, User } from "lucide-react"
import { type TypeConge } from "./rh-mock-data"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const AM = "#F59E0B"
const BORDER = "rgba(255,255,255,0.07)"

const TYPES: { value: TypeConge; label: string; color: string }[] = [
  { value: "annuel",     label: "Congé annuel",              color: "#3B82F6" },
  { value: "maladie",    label: "Congé maladie",             color: "#EF4444" },
  { value: "maternité",  label: "Congé maternité",           color: "#8B5CF6" },
  { value: "paternité",  label: "Congé paternité",           color: G },
  { value: "sans_solde", label: "Congé sans solde",          color: AM },
]
const EMPLOYES_LIST = [
  "Alpha Diallo","Mariama Barry","Ibrahima Camara","Fatoumata Bah",
  "Mamadou Sylla","Kadiatou Kouyaté","Oumar Touré","Aissatou Condé",
]

interface Props { open: boolean; onClose: () => void }

export function DrawerDemandeConge({ open, onClose }: Props) {
  const [employe, setEmploye]       = useState("")
  const [type, setType]             = useState<TypeConge>("annuel")
  const [dateDebut, setDateDebut]   = useState("")
  const [dateFin, setDateFin]       = useState("")
  const [motif, setMotif]           = useState("")
  const [loading, setLoading]       = useState(false)
  const [success, setSuccess]       = useState(false)

  useEffect(() => {
    if (open) {
      setEmploye(""); setType("annuel"); setDateDebut(""); setDateFin(""); setMotif(""); setLoading(false); setSuccess(false)
    }
  }, [open])

  const jours = dateDebut && dateFin
    ? Math.max(0, Math.round((new Date(dateFin).getTime() - new Date(dateDebut).getTime()) / 864e5) + 1)
    : 0

  const canSubmit = employe && dateDebut && dateFin && jours > 0 && !loading

  function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(onClose, 1400) }, 1800)
  }

  const inp = "w-full rounded-xl px-3 py-2.5 text-[10px] text-white bg-transparent outline-none"
  const inpStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }
  const tc = TYPES.find(t => t.value === type)!

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
              style={{ background: `linear-gradient(90deg, ${AM}, ${G} 60%, transparent)` }} />

            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${AM}15`, border: `1px solid ${AM}25` }}>
                  <CalendarDays size={14} style={{ color: AM }} />
                </div>
                <div>
                  <div className="text-[12px] font-black text-white">Demande de congé</div>
                  <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Ressources Humaines</div>
                </div>
              </div>
              <button onClick={onClose} className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <X size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5" style={{ scrollbarWidth: "thin" }}>

              {/* Employé */}
              <div>
                <label className="text-[8.5px] font-bold mb-1.5 block flex items-center gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <User size={9} /> Employé *
                </label>
                <SelectCustom value={employe} onChange={setEmploye} placeholder="Sélectionner un employé" accentColor={G}
                  options={EMPLOYES_LIST.map(e => ({ value: e, label: e }))} />
              </div>

              {/* Type */}
              <div className="flex flex-col gap-2">
                <div className="text-[8.5px] font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>Type de congé *</div>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES.map(t => (
                    <button key={t.value} onClick={() => setType(t.value)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all"
                      style={{ background: type === t.value ? `${t.color}12` : "rgba(255,255,255,0.03)", border: `1px solid ${type === t.value ? t.color + "30" : BORDER}` }}>
                      <div className="size-3 rounded-full border-2 flex-shrink-0"
                        style={{ borderColor: type === t.value ? t.color : "rgba(255,255,255,0.2)", background: type === t.value ? t.color : "transparent" }} />
                      <span className="text-[9px] font-bold" style={{ color: type === t.value ? t.color : "rgba(255,255,255,0.45)" }}>{t.label.replace("Congé ","")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Date début *</label>
                  <input value={dateDebut} onChange={e => setDateDebut(e.target.value)} type="date" className={inp} style={inpStyle} />
                </div>
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Date fin *</label>
                  <input value={dateFin} onChange={e => setDateFin(e.target.value)} type="date" min={dateDebut} className={inp} style={inpStyle} />
                </div>
              </div>

              {/* Récap jours */}
              {jours > 0 && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: `${tc.color}08`, border: `1px solid ${tc.color}20` }}>
                  <CalendarDays size={12} style={{ color: tc.color }} />
                  <div>
                    <div className="text-[11px] font-black" style={{ color: tc.color }}>{jours} jour{jours > 1 ? "s" : ""}</div>
                    <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>{tc.label}</div>
                  </div>
                </motion.div>
              )}

              {/* Motif */}
              <div>
                <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Motif / Justificatif</label>
                <textarea value={motif} onChange={e => setMotif(e.target.value)}
                  rows={3} placeholder="Précisez le motif de la demande…"
                  className={`${inp} resize-none`} style={inpStyle} />
              </div>
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
                  : success ? <><Check size={14} /> Demande soumise</>
                  : "Soumettre la demande"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
