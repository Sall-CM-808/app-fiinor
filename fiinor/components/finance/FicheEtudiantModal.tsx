"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X, CheckCircle2, Clock, AlertTriangle, XCircle,
  Smartphone, Banknote, CreditCard, Wallet, FileText,
  CreditCard as CardIcon, TrendingUp, Bell,
} from "lucide-react"
import { formatGNF, type EleveEcheancier, type StatutPaiement, type MoyenPaiement } from "./finance-mock-data"
import { RecuPaiementViewer } from "./RecuPaiementViewer"
import type { RecuPaiementData } from "./RecuPaiementPDF"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"

const STATUT_CFG: Record<StatutPaiement, { label: string; color: string; icon: React.ElementType }> = {
  payé:      { label: "Payé",      color: EM, icon: CheckCircle2 },
  partiel:   { label: "Partiel",   color: AM, icon: Clock },
  en_retard: { label: "En retard", color: RD, icon: AlertTriangle },
  non_payé:  { label: "Non payé",  color: "rgba(255,255,255,0.3)", icon: XCircle },
}

const MOYEN_ICON: Record<MoyenPaiement, { icon: React.ElementType; color: string }> = {
  espèces:      { icon: Banknote,   color: G },
  virement:     { icon: CreditCard, color: "#6366f1" },
  orange_money: { icon: Smartphone, color: "#f97316" },
  wave:         { icon: Wallet,     color: "#06b6d4" },
  chèque:       { icon: FileText,   color: "rgba(255,255,255,0.4)" },
}

interface FicheEtudiantModalProps {
  eleve: EleveEcheancier | null
  open: boolean
  onClose: () => void
  onPayer?: () => void
}

export function FicheEtudiantModal({ eleve, open, onClose, onPayer }: FicheEtudiantModalProps) {
  const [recuOpen, setRecuOpen] = useState(false)
  if (!eleve) return null
  const pct = Math.min(100, Math.round((eleve.totalPaye / eleve.totalDu) * 100))
  const progressColor = pct >= 100 ? EM : pct >= 50 ? AM : RD
  const sCfg = STATUT_CFG[eleve.statut]
  const SIcon = sCfg.icon
  const retardCount = eleve.echeances.filter(e => e.statut === "en_retard").length

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
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", stiffness: 360, damping: 34 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">

            <div className="pointer-events-auto w-full flex flex-col overflow-hidden rounded-2xl"
              style={{
                maxWidth: 560, maxHeight: "90vh",
                background: "#0a1628",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
              }}>

              {/* Gold accent */}
              <div className="h-0.5 w-full flex-shrink-0"
                style={{ background: `linear-gradient(90deg, ${G}, ${EM} 60%, transparent)` }} />

              {/* Header */}
              <div className="flex items-start justify-between px-6 py-4 flex-shrink-0"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-3">
                  {/* Avatar initiales */}
                  <div className="size-11 rounded-xl flex items-center justify-center text-[13px] font-black flex-shrink-0"
                    style={{ background: `${G}15`, border: `1px solid ${G}30`, color: G }}>
                    {eleve.prenom[0]}{eleve.nom[0]}
                  </div>
                  <div>
                    <div className="text-[15px] font-black text-white">
                      {eleve.prenom} {eleve.nom}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[8.5px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {eleve.matricule}
                      </span>
                      <span className="rounded px-1.5 py-0 text-[7px] font-bold"
                        style={{ background: `${G}15`, color: G }}>{eleve.classe}</span>
                      <div className="flex items-center gap-1 rounded-lg px-1.5 py-0.5"
                        style={{ background: `${sCfg.color}12`, border: `1px solid ${sCfg.color}25` }}>
                        <SIcon size={9} style={{ color: sCfg.color }} />
                        <span className="text-[7.5px] font-bold" style={{ color: sCfg.color }}>{sCfg.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={onClose}
                  className="rounded-xl p-2 transition-colors flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                  <X size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
                </button>
              </div>

              {/* Finance summary */}
              <div className="px-6 py-4 flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.015)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  {[
                    { label: "Total dû",    val: eleve.totalDu,                      color: "rgba(255,255,255,0.65)" },
                    { label: "Montant payé", val: eleve.totalPaye,                   color: EM },
                    { label: "Solde restant", val: eleve.totalDu - eleve.totalPaye,  color: eleve.totalDu > eleve.totalPaye ? RD : EM },
                  ].map(k => (
                    <div key={k.label}>
                      <div className="text-[16px] font-black tabular-nums" style={{ color: k.color }}>
                        {formatGNF(k.val)}
                      </div>
                      <div className="text-[7.5px] uppercase tracking-widest mt-0.5"
                        style={{ color: "rgba(255,255,255,0.25)" }}>{k.label}</div>
                    </div>
                  ))}
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${progressColor}, ${progressColor}cc)` }} />
                  </div>
                  <span className="text-[11px] font-black tabular-nums flex-shrink-0"
                    style={{ color: progressColor }}>{pct}%</span>
                </div>
                {retardCount > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-2.5 flex items-center gap-2 rounded-xl px-3 py-2"
                    style={{ background: `${RD}10`, border: `1px solid ${RD}20` }}>
                    <AlertTriangle size={10} style={{ color: RD }} />
                    <span className="text-[8.5px] font-bold" style={{ color: RD }}>
                      {retardCount} tranche{retardCount > 1 ? "s" : ""} en retard
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Timeline */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="text-[8.5px] font-black uppercase tracking-widest mb-4"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  Historique des tranches
                </div>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-px"
                    style={{ background: "rgba(255,255,255,0.07)" }} />

                  <div className="flex flex-col gap-0">
                    {eleve.echeances.map((e, i) => {
                      const cfg = STATUT_CFG[e.statut]
                      const Icon = cfg.icon
                      const mIcon = e.moyen ? MOYEN_ICON[e.moyen] : null

                      return (
                        <motion.div key={e.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + i * 0.06 }}
                          className="flex items-start gap-4 pb-5 relative">

                          {/* Node */}
                          <div className="size-[38px] rounded-xl flex items-center justify-center flex-shrink-0 z-10"
                            style={{
                              background: `${cfg.color}12`,
                              border: `1px solid ${cfg.color}30`,
                            }}>
                            <Icon size={15} style={{ color: cfg.color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 rounded-xl p-3"
                            style={{
                              background: "rgba(255,255,255,0.025)",
                              border: "1px solid rgba(255,255,255,0.06)",
                            }}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10.5px] font-bold text-white">{e.libelle}</span>
                              <span className="text-[10px] font-black tabular-nums" style={{ color: cfg.color }}>
                                {formatGNF(e.montant)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
                                Échéance : {new Date(e.dateEcheance).toLocaleDateString("fr-FR")}
                              </span>
                              {e.datePaiement && (
                                <span className="text-[8px] font-mono" style={{ color: EM }}>
                                  Payé : {new Date(e.datePaiement).toLocaleDateString("fr-FR")}
                                </span>
                              )}
                              {mIcon && (
                                <div className="flex items-center gap-1">
                                  <mIcon.icon size={9} style={{ color: mIcon.color }} />
                                  <span className="text-[7.5px]" style={{ color: mIcon.color }}>
                                    {e.moyen === "orange_money" ? "Orange Money" : e.moyen}
                                  </span>
                                </div>
                              )}
                              {e.reference && (
                                <span className="rounded px-1.5 py-0 text-[7px] font-mono"
                                  style={{ background: `${G}10`, color: G }}>
                                  {e.reference}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex gap-3 flex-shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.2)" }}>
                <button
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9.5px] font-bold transition-all"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }}>
                  <Bell size={11} />
                  Envoyer rappel
                </button>
                {eleve.statut === "payé" && (
                  <button
                    onClick={() => setRecuOpen(true)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[9.5px] font-bold transition-all"
                    style={{ background: `rgba(201,168,76,0.08)`, border: `1px solid rgba(201,168,76,0.2)`, color: G }}>
                    <FileText size={11} />
                    Voir le reçu
                  </button>
                )}
                {eleve.statut !== "payé" && (
                  <button
                    onClick={() => { onClose(); onPayer?.() }}
                    className="flex-1 rounded-xl py-2.5 text-[11px] font-black transition-all"
                    style={{ background: G, color: "#000" }}>
                    Enregistrer un paiement
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    <RecuPaiementViewer
      data={eleve ? { eleve } : null}
      open={recuOpen}
      onClose={() => setRecuOpen(false)} />
  </>
  )
}
