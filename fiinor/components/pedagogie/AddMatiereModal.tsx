"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, BookOpen, User, Users, Hash, Clock, GraduationCap,
  ChevronDown, CheckCircle2, AlertCircle,
} from "lucide-react"

const CLASSES = ["Terminale A", "Terminale C", "1ère C", "BTS Info 2", "BTS Compta", "Licence 1 Droit"]
const ENSEIGNANTS = [
  "Prof. Diallo", "Prof. Camara", "Prof. Bah", "Prof. Soumah", "Prof. Kouyaté",
  "Prof. Touré", "Prof. Sylla", "Prof. Diané", "Prof. Barry",
]

type FormData = {
  nom: string
  code: string
  enseignant: string
  classe: string
  coeff: string
  heures: string
  description: string
  statut: "actif" | "inactif"
}

type FieldError = Partial<Record<keyof FormData, string>>

function validateForm(data: FormData): FieldError {
  const errors: FieldError = {}
  if (!data.nom.trim()) errors.nom = "Le nom est obligatoire"
  if (!data.code.trim()) errors.code = "Le code est obligatoire"
  else if (!/^[A-Z0-9\-]{2,10}$/.test(data.code)) errors.code = "Format: lettres majuscules et chiffres (ex: MATH-T)"
  if (!data.enseignant) errors.enseignant = "Sélectionner un enseignant"
  if (!data.classe) errors.classe = "Sélectionner une classe"
  if (!data.coeff || isNaN(Number(data.coeff)) || Number(data.coeff) < 1 || Number(data.coeff) > 10)
    errors.coeff = "Coefficient entre 1 et 10"
  if (!data.heures || isNaN(Number(data.heures)) || Number(data.heures) < 10 || Number(data.heures) > 300)
    errors.heures = "Entre 10 et 300 heures"
  return errors
}

/* ─── Field wrapper ─── */
function Field({ label, icon: Icon, error, children }: {
  label: string; icon: React.ElementType; error?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider"
        style={{ color: "rgba(255,255,255,0.4)" }}>
        <Icon className="size-3" />{label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1 text-[9px]" style={{ color: "#F87171" }}>
            <AlertCircle className="size-2.5" />{error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls = "w-full rounded-lg px-3 py-2 text-[12px] text-white outline-none transition-all"
const inputStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
}
const inputFocusStyle = {
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(201,168,76,0.4)",
  boxShadow: "0 0 0 3px rgba(201,168,76,0.06)",
}

function StyledInput({ value, onChange, placeholder, error, onFocus, onBlur, focused }: {
  value: string; onChange: (v: string) => void; placeholder?: string
  error?: string; onFocus?: () => void; onBlur?: () => void; focused?: boolean
}) {
  return (
    <input
      value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      onFocus={onFocus} onBlur={onBlur}
      className={inputCls}
      style={focused
        ? { ...inputFocusStyle, border: error ? "1px solid rgba(248,113,113,0.5)" : inputFocusStyle.border }
        : { ...inputStyle, border: error ? "1px solid rgba(248,113,113,0.4)" : inputStyle.border }}
    />
  )
}

function StyledSelect({ value, onChange, options, placeholder, error }: {
  value: string; onChange: (v: string) => void; options: string[]
  placeholder: string; error?: string
}) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={inputCls + " appearance-none pr-8 cursor-pointer"}
        style={{ ...inputStyle, border: error ? "1px solid rgba(248,113,113,0.4)" : inputStyle.border,
          color: value ? "white" : "rgba(255,255,255,0.25)" }}>
        <option value="" style={{ background: "#0b1420" }}>{placeholder}</option>
        {options.map(o => <option key={o} value={o} style={{ background: "#0b1420" }}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 pointer-events-none"
        style={{ color: "rgba(255,255,255,0.3)" }} />
    </div>
  )
}

/* ─── Main modal ─── */
export function AddMatiereModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (data: FormData & { id: number; hEffectues: number; inscrits: number }) => void
}) {
  const [form, setForm] = useState<FormData>({
    nom: "", code: "", enseignant: "", classe: "",
    coeff: "", heures: "", description: "", statut: "actif",
  })
  const [errors, setErrors] = useState<FieldError>({})
  const [focused, setFocused] = useState<keyof FormData | null>(null)
  const [step, setStep] = useState<1 | 2>(1)
  const [submitted, setSubmitted] = useState(false)

  const set = (key: keyof FormData) => (val: string) => {
    setForm(f => ({ ...f, [key]: val }))
    if (errors[key]) setErrors(e => ({ ...e, [key]: undefined }))
  }

  const handleNext = () => {
    const step1Keys: (keyof FormData)[] = ["nom", "code", "enseignant", "classe"]
    const errs = validateForm(form)
    const step1Errors = Object.fromEntries(
      Object.entries(errs).filter(([k]) => step1Keys.includes(k as keyof FormData))
    ) as FieldError
    if (Object.keys(step1Errors).length > 0) { setErrors(step1Errors); return }
    setStep(2)
  }

  const handleSubmit = () => {
    const errs = validateForm(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSubmitted(true)
    setTimeout(() => {
      onAdd({
        ...form,
        id: Date.now(),
        hEffectues: 0,
        inscrits: 0,
      })
      onClose()
    }, 900)
  }

  const progress = step === 1 ? 50 : 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(0,0,0,0.7)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[520px] rounded-2xl overflow-hidden"
        style={{ background: "#080f1c", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 32px 80px rgba(0,0,0,0.7)" }}
      >
        {/* Gradient accent top */}
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #C9A84C60, transparent)" }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl"
              style={{ background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <BookOpen className="size-4" style={{ color: "#C9A84C" }} />
            </div>
            <div>
              <div className="text-[14px] font-bold text-white">Nouvelle matière</div>
              <div className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                Étape {step} sur 2 — {step === 1 ? "Informations générales" : "Configuration pédagogique"}
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="flex size-7 items-center justify-center rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.04)" }}
            onMouseEnter={e => { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.08)" }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)" }}>
            <X className="size-3.5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 w-full" style={{ background: "rgba(255,255,255,0.05)" }}>
          <motion.div className="h-full" style={{ background: "linear-gradient(90deg, #C9A84C, #E8C97A)" }}
            animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div key="success"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 gap-3">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="flex size-14 items-center justify-center rounded-full"
                  style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                  <CheckCircle2 className="size-7" style={{ color: "#10B981" }} />
                </motion.div>
                <div className="text-[14px] font-bold text-white">Matière créée avec succès</div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>{form.nom} a été ajoutée au programme</div>
              </motion.div>
            ) : step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
                className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nom de la matière" icon={BookOpen} error={errors.nom}>
                    <StyledInput value={form.nom} onChange={set("nom")} placeholder="ex: Mathématiques"
                      error={errors.nom}
                      focused={focused === "nom"}
                      onFocus={() => setFocused("nom")} onBlur={() => setFocused(null)} />
                  </Field>
                  <Field label="Code matière" icon={Hash} error={errors.code}>
                    <StyledInput value={form.code} onChange={v => set("code")(v.toUpperCase())}
                      placeholder="ex: MATH-T" error={errors.code}
                      focused={focused === "code"}
                      onFocus={() => setFocused("code")} onBlur={() => setFocused(null)} />
                  </Field>
                </div>
                <Field label="Enseignant responsable" icon={User} error={errors.enseignant}>
                  <StyledSelect value={form.enseignant} onChange={set("enseignant")}
                    options={ENSEIGNANTS} placeholder="Sélectionner un enseignant" error={errors.enseignant} />
                </Field>
                <Field label="Classe assignée" icon={GraduationCap} error={errors.classe}>
                  <StyledSelect value={form.classe} onChange={set("classe")}
                    options={CLASSES} placeholder="Sélectionner une classe" error={errors.classe} />
                </Field>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}
                className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Coefficient" icon={Hash} error={errors.coeff}>
                    <StyledInput value={form.coeff} onChange={set("coeff")} placeholder="ex: 4"
                      error={errors.coeff} focused={focused === "coeff"}
                      onFocus={() => setFocused("coeff")} onBlur={() => setFocused(null)} />
                  </Field>
                  <Field label="Volume horaire (h)" icon={Clock} error={errors.heures}>
                    <StyledInput value={form.heures} onChange={set("heures")} placeholder="ex: 120"
                      error={errors.heures} focused={focused === "heures"}
                      onFocus={() => setFocused("heures")} onBlur={() => setFocused(null)} />
                  </Field>
                </div>
                <Field label="Statut initial" icon={CheckCircle2}>
                  <div className="flex gap-2">
                    {(["actif", "inactif"] as const).map(s => (
                      <button key={s} onClick={() => set("statut")(s)}
                        className="flex-1 rounded-lg py-2 text-[11px] font-semibold transition-all capitalize"
                        style={form.statut === s
                          ? s === "actif"
                            ? { background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.35)", color: "#60A5FA" }
                            : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }
                          : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.3)" }
                        }>{s}</button>
                    ))}
                  </div>
                </Field>
                <Field label="Description (optionnel)" icon={BookOpen}>
                  <textarea value={form.description} onChange={e => set("description")(e.target.value)}
                    placeholder="Objectifs pédagogiques, prérequis…" rows={3}
                    className="w-full rounded-lg px-3 py-2 text-[12px] text-white resize-none outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={e => { e.target.style.border = "1px solid rgba(201,168,76,0.4)"; e.target.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.06)" }}
                    onBlur={e => { e.target.style.border = "1px solid rgba(255,255,255,0.1)"; e.target.style.boxShadow = "none" }}
                  />
                </Field>

                {/* Récap visuel */}
                <div className="rounded-xl p-3 flex items-center gap-3"
                  style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.12)" }}>
                  <div className="flex size-8 items-center justify-center rounded-lg text-[9px] font-bold"
                    style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}>
                    {form.code.slice(0, 3) || "—"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-white truncate">{form.nom || "Nom non défini"}</div>
                    <div className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {form.enseignant || "—"} · {form.classe || "—"}
                      {form.coeff && form.heures && ` · Coeff. ${form.coeff} · ${form.heures}h`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold"
                    style={{ background: "rgba(59,130,246,0.12)", color: "#60A5FA", border: "1px solid rgba(59,130,246,0.2)" }}>
                    <Users className="size-2.5" />Actif
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="flex items-center justify-between px-6 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button onClick={step === 1 ? onClose : () => setStep(1)}
              className="rounded-lg px-4 py-2 text-[11px] font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={e => { e.currentTarget.style.color = "white" }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}>
              {step === 1 ? "Annuler" : "← Retour"}
            </button>
            <button onClick={step === 1 ? handleNext : handleSubmit}
              className="rounded-lg px-5 py-2 text-[11px] font-bold transition-all"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#0a0f1a" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}>
              {step === 1 ? "Continuer →" : "Créer la matière"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
