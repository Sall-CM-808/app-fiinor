"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, CheckCircle2, Banknote, Smartphone, CreditCard,
  Wallet, FileText, Loader2, Check, AlertCircle,
} from "lucide-react"
import { formatGNF, type EleveEcheancier, type MoyenPaiement, type Echeance } from "./finance-mock-data"
import { RecuPaiementViewer } from "./RecuPaiementViewer"
import type { RecuPaiementData } from "./RecuPaiementPDF"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"

/* ─── Moyen cards ─── */
const MOYENS: { key: MoyenPaiement; label: string; icon: React.ElementType; color: string }[] = [
  { key: "orange_money", label: "Orange Money", icon: Smartphone,  color: "#f97316" },
  { key: "wave",         label: "Wave",         icon: Wallet,      color: "#06b6d4" },
  { key: "espèces",      label: "Espèces",      icon: Banknote,    color: G },
  { key: "virement",     label: "Virement",     icon: CreditCard,  color: "#6366f1" },
  { key: "chèque",       label: "Chèque",       icon: FileText,    color: "rgba(255,255,255,0.5)" },
]

/* ─── Field wrapper ─── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[8.5px] font-black uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.3)" }}>{label}</label>
      {children}
    </div>
  )
}

/* ─── Input ─── */
function FInput({ value, onChange, placeholder, type = "text", prefix }: {
  value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; prefix?: string
}) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-[9px] font-bold pointer-events-none"
          style={{ color: "rgba(255,255,255,0.3)" }}>{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl py-2.5 text-[11px] outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.85)",
          paddingLeft: prefix ? "2.5rem" : "0.75rem",
          paddingRight: "0.75rem",
        }}
        onFocus={e => { e.currentTarget.style.border = `1px solid ${G}50`; e.currentTarget.style.background = "rgba(201,168,76,0.04)" }}
        onBlur={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)" }}
      />
    </div>
  )
}

/* ─── Props ─── */
interface DrawerPaiementProps {
  eleve: EleveEcheancier | null
  open: boolean
  onClose: () => void
  onSuccess?: (eleveId: string, echeanceId: string, montant: number, moyen: MoyenPaiement) => void
}

/* ─── Main ─── */
export function DrawerPaiement({ eleve, open, onClose, onSuccess }: DrawerPaiementProps) {
  const [selectedEcheance, setSelectedEcheance] = useState<string | null>(null)
  const [montant, setMontant] = useState("")
  const [moyen, setMoyen] = useState<MoyenPaiement | null>(null)
  const [reference, setReference] = useState("")
  const [datePaiement, setDatePaiement] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [recuData, setRecuData] = useState<RecuPaiementData | null>(null)
  const [recuOpen, setRecuOpen] = useState(false)

  /* Reset on open */
  useEffect(() => {
    if (open) {
      setSelectedEcheance(null)
      setMontant("")
      setMoyen(null)
      setReference("")
      setDatePaiement(new Date().toISOString().split("T")[0])
      setLoading(false)
      setSuccess(false)
      setError("")
    }
  }, [open, eleve?.id])

  /* Pre-fill montant when echeance selected */
  useEffect(() => {
    if (!selectedEcheance || !eleve) return
    const ech = eleve.echeances.find(e => e.id === selectedEcheance)
    if (ech) setMontant(String(ech.montant))
  }, [selectedEcheance, eleve])

  const unpaidEcheances = eleve?.echeances.filter(e => e.statut !== "payé") ?? []

  const canSubmit = selectedEcheance && montant && moyen && !loading && !success

  function handleSubmit() {
    if (!canSubmit || !eleve) return
    if (isNaN(Number(montant)) || Number(montant) <= 0) {
      setError("Montant invalide")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      onSuccess?.(eleve.id, selectedEcheance!, Number(montant), moyen!)
      const recuNum = `REC-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`
      setRecuData({
        eleve,
        echeancePaidId: selectedEcheance!,
        montantVerse: Number(montant),
        moyenPaiement: moyen!,
        reference: reference || undefined,
        datePaiement,
        numeroRecu: recuNum,
      })
    }, 1800)
  }

  const selectedEch = eleve?.echeances.find(e => e.id === selectedEcheance)

  return (
    <>
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed inset-y-0 right-0 z-50 flex flex-col overflow-hidden"
            style={{
              width: "min(480px, 100vw)",
              background: "#0a1628",
              borderLeft: "1px solid rgba(255,255,255,0.08)",
            }}>

            {/* Accent top line */}
            <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${G}, transparent)` }} />

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <div className="text-[14px] font-black text-white tracking-tight">
                  Enregistrer un paiement
                </div>
                {eleve && (
                  <div className="mt-1 text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span className="font-bold" style={{ color: G }}>{eleve.nom} {eleve.prenom}</span>
                    {" · "}{eleve.matricule}{" · "}{eleve.classe}
                  </div>
                )}
              </div>
              <button onClick={onClose}
                className="rounded-xl p-2 transition-colors mt-0.5 flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.05)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
              </button>
            </div>

            {/* Solde rapide */}
            {eleve && (
              <div className="px-6 py-3 flex items-center gap-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
                {[
                  { label: "Total dû",  val: eleve.totalDu,   color: "rgba(255,255,255,0.6)" },
                  { label: "Perçu",     val: eleve.totalPaye, color: EM },
                  { label: "Restant",   val: eleve.totalDu - eleve.totalPaye, color: RD },
                ].map(s => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-[14px] font-black tabular-nums" style={{ color: s.color }}>
                      {formatGNF(s.val)}
                    </span>
                    <span className="text-[7.5px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Form body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

              {/* Step 1 — Sélection tranche */}
              <Field label="1 · Sélectionner la tranche">
                <div className="flex flex-col gap-2">
                  {unpaidEcheances.length === 0 ? (
                    <div className="rounded-xl px-4 py-3 text-[10px] text-center"
                      style={{ background: `${EM}10`, border: `1px solid ${EM}25`, color: EM }}>
                      <CheckCircle2 className="inline mr-2" size={12} />
                      Toutes les tranches sont payées
                    </div>
                  ) : unpaidEcheances.map(e => {
                    const active = selectedEcheance === e.id
                    const isLate = e.statut === "en_retard"
                    return (
                      <button key={e.id} onClick={() => setSelectedEcheance(e.id)}
                        className="flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all"
                        style={{
                          background: active ? `${G}10` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? G + "40" : "rgba(255,255,255,0.08)"}`,
                        }}>
                        <div>
                          <div className="text-[10.5px] font-bold" style={{ color: active ? G : "rgba(255,255,255,0.75)" }}>
                            {e.libelle}
                          </div>
                          <div className="text-[8.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                            Échéance : {new Date(e.dateEcheance).toLocaleDateString("fr-FR")}
                            {isLate && <span className="ml-2 font-bold" style={{ color: RD }}>EN RETARD</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-black tabular-nums"
                            style={{ color: active ? G : "rgba(255,255,255,0.6)" }}>
                            {formatGNF(e.montant)}
                          </span>
                          <div className="size-4 rounded-full flex items-center justify-center flex-shrink-0"
                            style={{
                              border: `2px solid ${active ? G : "rgba(255,255,255,0.2)"}`,
                              background: active ? G : "transparent",
                            }}>
                            {active && <Check size={9} color="#000" strokeWidth={3} />}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* Step 2 — Montant */}
              <Field label="2 · Montant (GNF)">
                <FInput value={montant} onChange={setMontant} placeholder="ex: 1 500 000" type="number" />
                {selectedEch && Number(montant) < selectedEch.montant && Number(montant) > 0 && (
                  <div className="text-[8.5px] flex items-center gap-1" style={{ color: AM }}>
                    <AlertCircle size={10} />
                    Paiement partiel — reste {formatGNF(selectedEch.montant - Number(montant))}
                  </div>
                )}
              </Field>

              {/* Step 3 — Moyen */}
              <Field label="3 · Moyen de paiement">
                <div className="grid grid-cols-3 gap-2">
                  {MOYENS.map(m => {
                    const Icon = m.icon
                    const active = moyen === m.key
                    return (
                      <button key={m.key} onClick={() => setMoyen(m.key)}
                        className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 transition-all"
                        style={{
                          background: active ? `${m.color}12` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${active ? m.color + "50" : "rgba(255,255,255,0.08)"}`,
                        }}>
                        <div className="rounded-lg p-2"
                          style={{ background: active ? `${m.color}20` : "rgba(255,255,255,0.05)" }}>
                          <Icon size={14} style={{ color: active ? m.color : "rgba(255,255,255,0.4)" }} />
                        </div>
                        <span className="text-[8px] font-bold text-center"
                          style={{ color: active ? m.color : "rgba(255,255,255,0.4)" }}>
                          {m.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Field>

              {/* Step 4 — Référence & Date */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="4 · Référence / N° transaction">
                  <FInput value={reference} onChange={setReference} placeholder="REF-12345" />
                </Field>
                <Field label="Date du paiement">
                  <FInput value={datePaiement} onChange={setDatePaiement} type="date" />
                </Field>
              </div>

              {/* Aperçu reçu */}
              {canSubmit && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-4"
                  style={{ background: `${G}08`, border: `1px solid ${G}20` }}>
                  <div className="text-[8.5px] font-black uppercase tracking-widest mb-3"
                    style={{ color: G }}>Aperçu du reçu</div>
                  <div className="space-y-1.5">
                    {[
                      ["Étudiant",  `${eleve?.nom} ${eleve?.prenom}`],
                      ["Matricule", eleve?.matricule ?? ""],
                      ["Tranche",   selectedEch?.libelle ?? ""],
                      ["Montant",   formatGNF(Number(montant))],
                      ["Moyen",     MOYENS.find(m => m.key === moyen)?.label ?? ""],
                      ["Date",      new Date(datePaiement).toLocaleDateString("fr-FR")],
                      ...(reference ? [["Référence", reference]] : []),
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[9px]">
                        <span style={{ color: "rgba(255,255,255,0.35)" }}>{k}</span>
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
            <div className="px-6 py-4 flex gap-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}>
              {!success ? (
                <button onClick={onClose}
                  className="flex-1 rounded-xl py-2.5 text-[10px] font-bold transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                  Annuler
                </button>
              ) : (
                <button onClick={() => setRecuOpen(true)}
                  className="flex-1 rounded-xl py-2.5 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                  <FileText size={11} /> Voir le reçu
                </button>
              )}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex-[2] rounded-xl py-2.5 text-[11px] font-black flex items-center justify-center gap-2 transition-all"
                style={{
                  background: success ? EM : canSubmit ? G : "rgba(255,255,255,0.05)",
                  color: success ? "white" : canSubmit ? "#000" : "rgba(255,255,255,0.2)",
                  border: "none",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                }}>
                {loading ? <Loader2 size={14} className="animate-spin" />
                  : success ? <><Check size={14} /> Paiement enregistré</>
                  : "Valider le paiement"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Reçu viewer — monté hors du drawer */}
    <RecuPaiementViewer
      data={recuData}
      open={recuOpen}
      onClose={() => setRecuOpen(false)} />
  </>
  )
}
