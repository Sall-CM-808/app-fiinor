"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, ArrowUpRight, ArrowDownRight, ArrowLeftRight,
  Banknote, Smartphone, CreditCard, Wallet, FileText,
  Upload, Loader2, Check, AlertCircle,
} from "lucide-react"
import { formatGNF, type TypeTransaction, type MoyenPaiement } from "./finance-mock-data"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const BL = "#3B82F6"

const UNITES = [
  "Faculté des Sciences","Dept. Informatique","Dept. Économie",
  "Dept. Droit","Administration","Bibliothèque","Services Généraux",
]

const TYPE_OPTS: { key: TypeTransaction; label: string; color: string; icon: React.ElementType; desc: string }[] = [
  { key: "recette",          label: "Recette",         color: EM, icon: ArrowUpRight,   desc: "Frais reçus, encaissements" },
  { key: "dépense",          label: "Dépense",         color: RD, icon: ArrowDownRight, desc: "Achats, salaires, charges" },
  { key: "virement_interne", label: "Virement intern.", color: G,  icon: ArrowLeftRight, desc: "Transfert entre comptes" },
]

const MOYENS: { key: MoyenPaiement; label: string; icon: React.ElementType; color: string }[] = [
  { key: "orange_money", label: "Orange Money", icon: Smartphone,  color: "#f97316" },
  { key: "wave",         label: "Wave",         icon: Wallet,      color: "#06b6d4" },
  { key: "espèces",      label: "Espèces",      icon: Banknote,    color: G },
  { key: "virement",     label: "Virement",     icon: CreditCard,  color: "#6366f1" },
  { key: "chèque",       label: "Chèque",       icon: FileText,    color: "rgba(255,255,255,0.5)" },
]

/* ─── Field ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[8.5px] font-black uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.3)" }}>{label}</label>
      {children}
    </div>
  )
}

function FInput({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl px-3 py-2.5 text-[11px] outline-none transition-all"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}
      onFocus={e => { e.currentTarget.style.border = `1px solid ${G}50`; e.currentTarget.style.background = "rgba(201,168,76,0.04)" }}
      onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
    />
  )
}

function FTextarea({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={2}
      className="w-full rounded-xl px-3 py-2.5 text-[11px] outline-none transition-all resize-none"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.85)" }}
      onFocus={e => { e.currentTarget.style.border = `1px solid ${G}50` }}
      onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)" }}
    />
  )
}

function FSelect({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full rounded-xl px-3 py-2.5 text-[11px] outline-none transition-all"
      style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)" }}>
      <option value="">Sélectionner…</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

/* ─── Props ─── */
interface DrawerNouvelleTransactionProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
}

/* ─── Main ─── */
export function DrawerNouvelleTransaction({ open, onClose, onSuccess }: DrawerNouvelleTransactionProps) {
  const [type, setType] = useState<TypeTransaction | null>(null)
  const [libelle, setLibelle] = useState("")
  const [description, setDescription] = useState("")
  const [montant, setMontant] = useState("")
  const [devise, setDevise] = useState<"GNF" | "XOF" | "EUR" | "USD">("GNF")
  const [moyen, setMoyen] = useState<MoyenPaiement | null>(null)
  const [unite, setUnite] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [hasPJ, setHasPJ] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (open) {
      setType(null); setLibelle(""); setDescription(""); setMontant("")
      setDevise("GNF"); setMoyen(null); setUnite(""); setHasPJ(false)
      setLoading(false); setSuccess(false); setError("")
      setDate(new Date().toISOString().split("T")[0])
    }
  }, [open])

  const canSubmit = type && libelle && montant && moyen && unite && !loading && !success

  function handleSubmit() {
    if (!canSubmit) return
    if (isNaN(Number(montant)) || Number(montant) <= 0) { setError("Montant invalide"); return }
    setError(""); setLoading(true)
    setTimeout(() => {
      setLoading(false); setSuccess(true)
      onSuccess?.()
      setTimeout(() => onClose(), 1400)
    }, 1600)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex flex-col overflow-hidden"
            style={{ width: "min(520px, 100vw)", background: "#0a1628", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>

            <div className="h-0.5 w-full flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${EM}, ${G} 50%, transparent)` }} />

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <div className="text-[14px] font-black text-white">Nouvelle transaction</div>
                <div className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  Saisie manuelle dans le journal comptable
                </div>
              </div>
              <button onClick={onClose}
                className="rounded-xl p-2 flex-shrink-0 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

              {/* Type */}
              <Field label="1 · Type d'opération">
                <div className="grid grid-cols-3 gap-2">
                  {TYPE_OPTS.map(t => {
                    const Icon = t.icon
                    const active = type === t.key
                    return (
                      <button key={t.key} onClick={() => setType(t.key)}
                        className="flex flex-col items-start gap-2 rounded-xl p-3 text-left transition-all"
                        style={{
                          background: active ? `${t.color}10` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? t.color + "40" : "rgba(255,255,255,0.08)"}`,
                        }}>
                        <div className="rounded-lg p-1.5"
                          style={{ background: active ? `${t.color}20` : "rgba(255,255,255,0.05)" }}>
                          <Icon size={12} style={{ color: active ? t.color : "rgba(255,255,255,0.4)" }} />
                        </div>
                        <div>
                          <div className="text-[9px] font-black" style={{ color: active ? t.color : "rgba(255,255,255,0.6)" }}>
                            {t.label}
                          </div>
                          <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                            {t.desc}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* Libellé + description */}
              <Field label="2 · Libellé">
                <FInput value={libelle} onChange={setLibelle} placeholder="ex: Frais de scolarité L2 Info" />
              </Field>
              <Field label="Description (optionnel)">
                <FTextarea value={description} onChange={setDescription} placeholder="Détails supplémentaires…" />
              </Field>

              {/* Montant + devise */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <Field label="3 · Montant">
                    <FInput value={montant} onChange={setMontant} placeholder="0" type="number" />
                  </Field>
                </div>
                <Field label="Devise">
                  <select value={devise} onChange={e => setDevise(e.target.value as typeof devise)}
                    className="w-full rounded-xl px-3 py-2.5 text-[11px] outline-none"
                    style={{ background: "#0d1f35", border: "1px solid rgba(255,255,255,0.1)", color: G }}>
                    {["GNF","XOF","EUR","USD"].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
              </div>

              {/* Moyen */}
              <Field label="4 · Moyen de paiement">
                <div className="grid grid-cols-5 gap-1.5">
                  {MOYENS.map(m => {
                    const Icon = m.icon
                    const active = moyen === m.key
                    return (
                      <button key={m.key} onClick={() => setMoyen(m.key)}
                        className="flex flex-col items-center gap-1.5 rounded-xl py-2.5 transition-all"
                        style={{
                          background: active ? `${m.color}12` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? m.color + "40" : "rgba(255,255,255,0.07)"}`,
                        }}>
                        <Icon size={13} style={{ color: active ? m.color : "rgba(255,255,255,0.3)" }} />
                        <span className="text-[7px] font-bold text-center leading-tight"
                          style={{ color: active ? m.color : "rgba(255,255,255,0.3)" }}>
                          {m.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* Unité + Date */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="5 · Unité structurelle">
                  <FSelect value={unite} onChange={setUnite} options={UNITES} />
                </Field>
                <Field label="Date comptable">
                  <FInput value={date} onChange={setDate} type="date" />
                </Field>
              </div>

              {/* Pièce justificative */}
              <Field label="6 · Pièce justificative (optionnel)">
                <button
                  onClick={() => setHasPJ(p => !p)}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-all"
                  style={{
                    background: hasPJ ? `${G}08` : "rgba(255,255,255,0.03)",
                    border: `1px dashed ${hasPJ ? G + "50" : "rgba(255,255,255,0.1)"}`,
                  }}>
                  <Upload size={14} style={{ color: hasPJ ? G : "rgba(255,255,255,0.3)" }} />
                  <div className="text-left">
                    <div className="text-[9.5px] font-bold" style={{ color: hasPJ ? G : "rgba(255,255,255,0.4)" }}>
                      {hasPJ ? "document.pdf · 245 KB" : "Déposer un fichier"}
                    </div>
                    <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      PDF, JPG, PNG — max 5 MB
                    </div>
                  </div>
                  {hasPJ && (
                    <div className="ml-auto rounded-full p-1" style={{ background: `${EM}20` }}>
                      <Check size={10} style={{ color: EM }} />
                    </div>
                  )}
                </button>
              </Field>

              {/* Preview */}
              {canSubmit && (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4"
                  style={{ background: `${G}06`, border: `1px solid ${G}18` }}>
                  <div className="text-[8px] font-black uppercase tracking-widest mb-2.5" style={{ color: G }}>
                    Aperçu de l'écriture
                  </div>
                  <div className="space-y-1.5">
                    {[
                      ["Type",   TYPE_OPTS.find(t => t.key === type)?.label ?? ""],
                      ["Libellé", libelle],
                      ["Montant", `${Number(montant).toLocaleString("fr-FR")} ${devise}`],
                      ["Moyen",   MOYENS.find(m => m.key === moyen)?.label ?? ""],
                      ["Unité",   unite],
                      ["Date",    new Date(date).toLocaleDateString("fr-FR")],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[9px]">
                        <span style={{ color: "rgba(255,255,255,0.3)" }}>{k}</span>
                        <span className="font-bold" style={{ color: "rgba(255,255,255,0.75)" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {error && (
                <div className="text-[9px] flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: `${RD}10`, border: `1px solid ${RD}25`, color: RD }}>
                  <AlertCircle size={10} />{error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex gap-3 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}>
              <button onClick={onClose}
                className="flex-1 rounded-xl py-2.5 text-[10px] font-bold transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
                Annuler
              </button>
              <button onClick={handleSubmit} disabled={!canSubmit}
                className="flex-[2] rounded-xl py-2.5 text-[11px] font-black flex items-center justify-center gap-2 transition-all"
                style={{
                  background: success ? EM : canSubmit ? G : "rgba(255,255,255,0.05)",
                  color: success ? "white" : canSubmit ? "#000" : "rgba(255,255,255,0.2)",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}>
                {loading ? <Loader2 size={13} className="animate-spin" />
                  : success ? <><Check size={13} /> Transaction enregistrée</>
                  : "Enregistrer la transaction"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
