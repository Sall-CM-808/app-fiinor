"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, User, Phone, BookOpen, FileText,
  Loader2, Check, AlertTriangle, Upload,
} from "lucide-react"
import { SelectCustom } from "./SelectCustom"
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BORDER = "rgba(255,255,255,0.07)"

const FILIERES = ["Droit Privé","Informatique","Médecine Générale","Sciences Éco","Génie Civil","Pharmacie","Lettres Modernes","Mathématiques"]
const NIVEAUX  = ["L1","L2","L3","M1","M2","DUT1","DUT2","BTS1","BTS2"]
const TYPES    = [
  { key: "nouvelle",      lbl: "Nouvelle inscription" },
  { key: "réinscription", lbl: "Réinscription" },
  { key: "transfert",     lbl: "Transfert" },
]
const PIECES = ["CNI / Passeport","Diplôme du Baccalauréat","Photo d'identité (x4)","Fiche de renseignements","Extrait de naissance","Certificat médical","Relevé de notes"]

interface DrawerNouvelleInscriptionProps {
  open: boolean
  onClose: () => void
}

export function DrawerNouvelleInscription({ open, onClose }: DrawerNouvelleInscriptionProps) {
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  /* Champs */
  const [nom, setNom]               = useState("")
  const [prenom, setPrenom]         = useState("")
  const [dateNais, setDateNais]     = useState("")
  const [lieu, setLieu]             = useState("")
  const [contact, setContact]       = useState("")
  const [type, setType]             = useState("nouvelle")
  const [filiere, setFiliere]       = useState("")
  const [niveau, setNiveau]         = useState("")
  const [pieces, setPieces]         = useState<string[]>([])

  useEffect(() => {
    if (open) { setStep(1); setLoading(false); setSuccess(false); setNom(""); setPrenom(""); setDateNais(""); setLieu(""); setContact(""); setType("nouvelle"); setFiliere(""); setNiveau(""); setPieces([]) }
  }, [open])

  const canNext1 = nom && prenom && dateNais && contact
  const canNext2 = filiere && niveau && type
  const canSubmit = canNext1 && canNext2 && pieces.length >= 2 && !loading

  function togglePiece(p: string) {
    setPieces(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(onClose, 1600) }, 2000)
  }

  const input = "w-full rounded-xl px-3 py-2.5 text-[10px] text-white bg-transparent outline-none transition-all"
  const inputStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }

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
            style={{ width: 440, background: "#07111d", borderLeft: `1px solid ${BORDER}` }}>

            {/* Gold accent */}
            <div className="h-0.5 flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${G}, ${EM} 60%, transparent)` }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${G}15`, border: `1px solid ${G}25` }}>
                  <FileText size={14} style={{ color: G }} />
                </div>
                <div>
                  <div className="text-[12px] font-black text-white">Nouvelle inscription</div>
                  <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Étape {step}/3 — {step === 1 ? "Identité" : step === 2 ? "Filière" : "Pièces"}
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="rounded-xl p-2"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <X size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 px-5 py-3 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}>
              {[1,2,3].map(s => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className="size-5 rounded-full flex items-center justify-center text-[8px] font-black flex-shrink-0"
                    style={{
                      background: step > s ? EM : step === s ? G : "rgba(255,255,255,0.08)",
                      color: step >= s ? "#000" : "rgba(255,255,255,0.3)",
                    }}>
                    {step > s ? <Check size={9} /> : s}
                  </div>
                  <span className="text-[8px] font-bold truncate"
                    style={{ color: step === s ? G : "rgba(255,255,255,0.25)" }}>
                    {s === 1 ? "Identité" : s === 2 ? "Filière" : "Pièces"}
                  </span>
                  {s < 3 && <div className="flex-1 h-px" style={{ background: step > s ? `${EM}40` : BORDER }} />}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: "thin" }}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Nom *</label>
                        <input value={nom} onChange={e => setNom(e.target.value)} placeholder="DIALLO"
                          className={input} style={inputStyle} />
                      </div>
                      <div>
                        <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Prénom *</label>
                        <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Mamadou"
                          className={input} style={inputStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Date de naissance *</label>
                      <input type="date" value={dateNais} onChange={e => setDateNais(e.target.value)}
                        className={input} style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Lieu de naissance</label>
                      <input value={lieu} onChange={e => setLieu(e.target.value)} placeholder="Conakry"
                        className={input} style={inputStyle} />
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Contact tuteur *</label>
                      <input value={contact} onChange={e => setContact(e.target.value)} placeholder="+224 6XX XX XX XX"
                        className={input} style={inputStyle} />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4">
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Type d'inscription *</label>
                      <div className="flex flex-col gap-2">
                        {TYPES.map(t => (
                          <button key={t.key} onClick={() => setType(t.key)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
                            style={{
                              background: type === t.key ? `${G}12` : "rgba(255,255,255,0.03)",
                              border: `1px solid ${type === t.key ? G + "30" : BORDER}`,
                            }}>
                            <div className="size-3 rounded-full border-2 flex-shrink-0"
                              style={{ borderColor: type === t.key ? G : "rgba(255,255,255,0.2)", background: type === t.key ? G : "transparent" }} />
                            <span className="text-[10px] font-bold" style={{ color: type === t.key ? G : "rgba(255,255,255,0.5)" }}>
                              {t.lbl}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Filière *</label>
                      <SelectCustom
                        value={filiere}
                        onChange={setFiliere}
                        placeholder="Sélectionner une filière"
                        options={FILIERES.map(f => ({ value: f, label: f }))}
                        accentColor={G}
                      />
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Niveau *</label>
                      <SelectCustom
                        value={niveau}
                        onChange={setNiveau}
                        placeholder="Sélectionner un niveau"
                        options={NIVEAUX.map(n => ({ value: n, label: n }))}
                        accentColor={G}
                      />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-3">
                    <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Cochez les pièces fournies (min. 2 requises)
                    </div>
                    {PIECES.map(p => (
                      <button key={p} onClick={() => togglePiece(p)}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
                        style={{
                          background: pieces.includes(p) ? `${EM}08` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${pieces.includes(p) ? EM + "30" : BORDER}`,
                        }}>
                        <div className="size-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{ background: pieces.includes(p) ? EM : "rgba(255,255,255,0.06)", border: `1px solid ${pieces.includes(p) ? EM : BORDER}` }}>
                          {pieces.includes(p) && <Check size={9} style={{ color: "#000" }} />}
                        </div>
                        <span className="text-[9.5px]" style={{ color: pieces.includes(p) ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)" }}>
                          {p}
                        </span>
                      </button>
                    ))}
                    {pieces.length < 2 && (
                      <div className="flex items-center gap-1.5 text-[8.5px] px-3 py-2 rounded-lg"
                        style={{ background: `${AM}10`, color: AM, border: `1px solid ${AM}20` }}>
                        <AlertTriangle size={10} /> Minimum 2 pièces requises
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 flex gap-3 flex-shrink-0"
              style={{ borderTop: `1px solid ${BORDER}`, background: "rgba(0,0,0,0.2)" }}>
              {step > 1 ? (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex-1 rounded-xl py-2.5 text-[10px] font-bold transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                  Précédent
                </button>
              ) : (
                <button onClick={onClose}
                  className="flex-1 rounded-xl py-2.5 text-[10px] font-bold"
                  style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                  Annuler
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={step === 1 ? !canNext1 : !canNext2}
                  className="flex-[2] rounded-xl py-2.5 text-[11px] font-black transition-all"
                  style={{
                    background: (step === 1 ? canNext1 : canNext2) ? G : "rgba(255,255,255,0.05)",
                    color: (step === 1 ? canNext1 : canNext2) ? "#000" : "rgba(255,255,255,0.2)",
                    cursor: (step === 1 ? canNext1 : canNext2) ? "pointer" : "not-allowed",
                  }}>
                  Suivant →
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={!canSubmit}
                  className="flex-[2] rounded-xl py-2.5 text-[11px] font-black flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: success ? EM : canSubmit ? G : "rgba(255,255,255,0.05)",
                    color: success ? "white" : canSubmit ? "#000" : "rgba(255,255,255,0.2)",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                  }}>
                  {loading ? <Loader2 size={14} className="animate-spin" />
                    : success ? <><Check size={14} /> Dossier enregistré</>
                    : "Soumettre le dossier"}
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
