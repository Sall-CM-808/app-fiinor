"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, Briefcase, Tag, Loader2, Check, UserCog } from "lucide-react"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const BORDER = "rgba(255,255,255,0.07)"

const DEPARTEMENTS = ["Informatique","Droit","Médecine","Sciences Éco","Administration","Génie Civil","Pharmacie"]
const POSTES_PAR_DEPT: Record<string, string[]> = {
  "Informatique":   ["Professeur Informatique","Chargé de TP","Responsable Labo","Enseignant vacataire"],
  "Droit":          ["Professeur de Droit","Maître de Conférences","Chargé de Cours","Doyen Adjoint"],
  "Médecine":       ["Professeur de Médecine","Chef de Département","Interne","Enseignant-Chercheur"],
  "Sciences Éco":   ["Professeur Économie","Maître-Assistant","Chargé de TD","Responsable Pédagogique"],
  "Administration": ["Secrétaire Général","Comptable","RH Manager","Agent Administratif"],
  "Génie Civil":    ["Ingénieur-Enseignant","Professeur de Génie","Responsable TP"],
  "Pharmacie":      ["Pharmacien-Enseignant","Maître de Conférences","Chargé de Cours"],
}
const TYPES_CONTRAT = ["CDI","CDD","vacataire","stage"]
const ROLES_DISPONIBLES = ["Enseignant","Tuteur","Responsable","Directeur","Administrateur","Chercheur"]

const STEPS = [
  { num: 1, lbl: "Identité",       icon: User },
  { num: 2, lbl: "Poste & Contrat",icon: Briefcase },
  { num: 3, lbl: "Rôles",          icon: Tag },
]

interface Props { open: boolean; onClose: () => void }

export function DrawerNouvelEmploye({ open, onClose }: Props) {
  const [step, setStep]               = useState(1)
  const [prenom, setPrenom]           = useState("")
  const [nom, setNom]                 = useState("")
  const [genre, setGenre]             = useState<"M"|"F">("M")
  const [email, setEmail]             = useState("")
  const [tel, setTel]                 = useState("")
  const [dept, setDept]               = useState("")
  const [poste, setPoste]             = useState("")
  const [typeContrat, setTypeContrat] = useState("")
  const [salaire, setSalaire]         = useState("")
  const [dateEmb, setDateEmb]         = useState("")
  const [roles, setRoles]             = useState<string[]>(["Enseignant"])
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)

  useEffect(() => {
    if (open) {
      setStep(1); setPrenom(""); setNom(""); setGenre("M"); setEmail(""); setTel("")
      setDept(""); setPoste(""); setTypeContrat(""); setSalaire(""); setDateEmb("")
      setRoles(["Enseignant"]); setLoading(false); setSuccess(false)
    }
  }, [open])

  useEffect(() => { setPoste("") }, [dept])

  const canStep1 = prenom && nom && email
  const canStep2 = dept && poste && typeContrat && salaire && dateEmb
  const canSubmit = canStep1 && canStep2 && roles.length > 0

  function toggleRole(r: string) {
    setRoles(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r])
  }

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
            style={{ width: 440, background: "#07111d", borderLeft: `1px solid ${BORDER}` }}>

            <div className="h-0.5 flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${G}, #A8893A 60%, transparent)` }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${G}15`, border: `1px solid ${G}25` }}>
                  <UserCog size={14} style={{ color: G }} />
                </div>
                <div>
                  <div className="text-[12px] font-black text-white">Nouvel employé</div>
                  <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Ressources Humaines</div>
                </div>
              </div>
              <button onClick={onClose} className="rounded-xl p-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <X size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center gap-2 px-5 py-3 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}>
              {STEPS.map((s, i) => {
                const Icon    = s.icon
                const done    = step > s.num
                const current = step === s.num
                return (
                  <div key={s.num} className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="size-6 rounded-full flex items-center justify-center text-[9px] font-black"
                        style={{
                          background: done ? G : current ? `${G}20` : "rgba(255,255,255,0.06)",
                          color: done ? "#000" : current ? G : "rgba(255,255,255,0.3)",
                          border: `1px solid ${done ? G : current ? G + "40" : BORDER}`,
                        }}>
                        {done ? <Check size={9} /> : s.num}
                      </div>
                      <span className="text-[8.5px] font-bold hidden sm:block"
                        style={{ color: current ? G : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)" }}>
                        {s.lbl}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-px" style={{ background: step > s.num ? G : BORDER }} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5" style={{ scrollbarWidth: "thin" }}>
              <AnimatePresence mode="wait">
                {/* ── Étape 1 : Identité ── */}
                {step === 1 && (
                  <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Prénom *</label>
                        <input value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Alpha" className={inp} style={inpStyle} />
                      </div>
                      <div>
                        <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Nom *</label>
                        <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Diallo" className={inp} style={inpStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Genre</label>
                      <div className="flex gap-2">
                        {[{v:"M",l:"Masculin"},{v:"F",l:"Féminin"}].map(g => (
                          <button key={g.v} onClick={() => setGenre(g.v as "M"|"F")}
                            className="flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all"
                            style={{ background: genre === g.v ? `${G}15` : "rgba(255,255,255,0.04)", border: `1px solid ${genre === g.v ? G + "30" : BORDER}`, color: genre === g.v ? G : "rgba(255,255,255,0.35)" }}>
                            {g.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Email *</label>
                      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="alpha.diallo@univ.gn" type="email" className={inp} style={inpStyle} />
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Téléphone</label>
                      <input value={tel} onChange={e => setTel(e.target.value)} placeholder="+224 6XX XX XX XX" className={inp} style={inpStyle} />
                    </div>
                  </motion.div>
                )}

                {/* ── Étape 2 : Poste & Contrat ── */}
                {step === 2 && (
                  <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4">
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Département *</label>
                      <SelectCustom value={dept} onChange={setDept} placeholder="Sélectionner" accentColor={G}
                        options={DEPARTEMENTS.map(d => ({ value: d, label: d }))} />
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Poste *</label>
                      <SelectCustom value={poste} onChange={setPoste} placeholder="Sélectionner un poste" accentColor={G}
                        options={(POSTES_PAR_DEPT[dept] ?? []).map(p => ({ value: p, label: p }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Type contrat *</label>
                        <SelectCustom value={typeContrat} onChange={setTypeContrat} placeholder="Type" accentColor={G}
                          options={TYPES_CONTRAT.map(t => ({ value: t, label: t.toUpperCase() }))} />
                      </div>
                      <div>
                        <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Date d'embauche *</label>
                        <input value={dateEmb} onChange={e => setDateEmb(e.target.value)} type="date" className={inp} style={inpStyle} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Salaire brut mensuel (GNF) *</label>
                      <input value={salaire} onChange={e => setSalaire(e.target.value)} placeholder="2 500 000" type="number" className={inp} style={inpStyle} />
                      {salaire && (
                        <div className="text-[8px] mt-1 px-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                          Net estimé : {new Intl.NumberFormat("fr-GN").format(Math.round(Number(salaire) * 0.82))} GNF
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── Étape 3 : Rôles ── */}
                {step === 3 && (
                  <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-4">
                    <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Attribuez un ou plusieurs rôles. Concept <strong style={{ color: G }}>Element + ElementRole</strong> — 1 fiche, N rôles.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {ROLES_DISPONIBLES.map(r => {
                        const active = roles.includes(r)
                        return (
                          <button key={r} onClick={() => toggleRole(r)}
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-left transition-all"
                            style={{ background: active ? `${G}12` : "rgba(255,255,255,0.03)", border: `1px solid ${active ? G + "30" : BORDER}` }}>
                            <div className="size-4 rounded flex items-center justify-center flex-shrink-0"
                              style={{ background: active ? G : "rgba(255,255,255,0.06)", border: `1px solid ${active ? G : BORDER}` }}>
                              {active && <Check size={9} style={{ color: "#000" }} />}
                            </div>
                            <span className="text-[10px] font-bold" style={{ color: active ? G : "rgba(255,255,255,0.45)" }}>{r}</span>
                          </button>
                        )
                      })}
                    </div>
                    {roles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {roles.map(r => (
                          <span key={r} className="text-[8px] px-2 py-1 rounded-lg"
                            style={{ background: `${G}15`, color: G, border: `1px solid ${G}25` }}>{r}</span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 flex gap-3 flex-shrink-0"
              style={{ borderTop: `1px solid ${BORDER}`, background: "rgba(0,0,0,0.2)" }}>
              {step > 1
                ? <button onClick={() => setStep(step - 1)} className="flex-1 rounded-xl py-2.5 text-[10px] font-bold"
                    style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                    Retour
                  </button>
                : <button onClick={onClose} className="flex-1 rounded-xl py-2.5 text-[10px] font-bold"
                    style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                    Annuler
                  </button>
              }
              {step < 3
                ? <button onClick={() => setStep(step + 1)}
                    disabled={step === 1 ? !canStep1 : !canStep2}
                    className="flex-[2] rounded-xl py-2.5 text-[11px] font-black transition-all"
                    style={{ background: (step === 1 ? canStep1 : canStep2) ? G : "rgba(255,255,255,0.05)", color: (step === 1 ? canStep1 : canStep2) ? "#000" : "rgba(255,255,255,0.2)", border: "none" }}>
                    Continuer
                  </button>
                : <button onClick={handleSubmit} disabled={!canSubmit}
                    className="flex-[2] rounded-xl py-2.5 text-[11px] font-black flex items-center justify-center gap-2 transition-all"
                    style={{ background: success ? EM : canSubmit ? G : "rgba(255,255,255,0.05)", color: success ? "white" : canSubmit ? "#000" : "rgba(255,255,255,0.2)", border: "none" }}>
                    {loading ? <Loader2 size={14} className="animate-spin" />
                      : success ? <><Check size={14} /> Employé ajouté</>
                      : "Enregistrer"}
                  </button>
              }
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
