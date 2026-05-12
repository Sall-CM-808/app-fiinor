"use client"

import { motion } from "framer-motion"
import { UtensilsCrossed, Leaf, CheckCircle2, XCircle, CalendarDays } from "lucide-react"
import { MENUS_SEMAINE, ABONNEMENTS_REPAS, formatGNF } from "./services-mock-data"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const OR = "#F97316"
const BL = "#3B82F6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const FORMULE_CFG = {
  mensuel:    { lbl: "Mensuel",    color: G  },
  hebdo:      { lbl: "Hebdo",      color: BL },
  journalier: { lbl: "Journalier", color: OR },
}

const REPAS_LBL: Record<string, string> = {
  petit_dej: "Petit-déj.", dejeuner: "Déjeuner", diner: "Dîner",
}

export function CafeteriaPage() {
  const totalAbos  = ABONNEMENTS_REPAS.length
  const montantTotal = ABONNEMENTS_REPAS.filter(a => a.paye).reduce((s, a) => s + a.montant, 0)
  const repasSemaine = MENUS_SEMAINE.reduce((s, m) => s + m.reservations, 0)
  const nonPayés   = ABONNEMENTS_REPAS.filter(a => !a.paye).length

  return (
    <div className="flex flex-col gap-5">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Abonnés repas",    val: String(totalAbos),       color: OR },
          { lbl: "Réservations/sem", val: String(repasSemaine),    color: EM },
          { lbl: "Recettes",         val: formatGNF(montantTotal), color: G  },
          { lbl: "Impayés",          val: String(nonPayés),        color: RD },
        ].map((s, i) => (
          <motion.div key={s.lbl}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-3 text-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[16px] font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* Menu semaine */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-3 flex items-center gap-2"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <CalendarDays size={13} style={{ color: G }} />
          <span className="text-[11px] font-black text-white">Menu de la semaine</span>
          <span className="ml-auto text-[8px] px-2 py-0.5 rounded-full"
            style={{ background: `${OR}12`, color: OR }}>
            Semaine du 6 Oct 2025
          </span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr" }}>
          {MENUS_SEMAINE.map((m, i) => (
            <div key={m.id}
              className="p-4 flex flex-col gap-2"
              style={{ borderRight: i < 4 ? `1px solid ${BORDER}` : "none" }}>
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-black" style={{ color: G }}>{m.jour}</div>
                {m.vegOption && (
                  <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                    style={{ background: `${EM}12`, border: `1px solid ${EM}20` }}>
                    <Leaf size={7} style={{ color: EM }} />
                    <span className="text-[6.5px] font-bold" style={{ color: EM }}>Végé</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <div>
                  <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Entrée</div>
                  <div className="text-[8.5px] text-white">{m.entree}</div>
                </div>
                <div>
                  <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Plat</div>
                  <div className="text-[9px] font-bold text-white">{m.plat}</div>
                </div>
                <div>
                  <div className="text-[7px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Dessert</div>
                  <div className="text-[8.5px] text-white">{m.dessert}</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                <span className="text-[8px] font-black" style={{ color: G }}>{formatGNF(m.prix)}</span>
                <span className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{m.reservations} rés.</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Abonnements */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-5 py-3 flex items-center gap-2"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <UtensilsCrossed size={13} style={{ color: OR }} />
          <span className="text-[11px] font-black text-white">Abonnements restauration</span>
        </div>
        <div className="grid px-4 py-2.5"
          style={{
            gridTemplateColumns: "2fr 1.2fr 1.5fr 1fr 1fr 1fr 0.8fr",
            background: "rgba(0,0,0,0.15)",
            borderBottom: `1px solid ${BORDER}`,
          }}>
          {["Élève","Formule","Repas inclus","Période","Montant","Repas pris","Paiement"].map(h => (
            <div key={h} className="text-[8px] font-bold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
          ))}
        </div>
        {ABONNEMENTS_REPAS.map((a, i) => {
          const fc = FORMULE_CFG[a.formule]
          const pct = Math.round((a.repasPris / a.repasTotal) * 100)
          return (
            <div key={a.id} className="grid px-4 py-3 items-center"
              style={{
                gridTemplateColumns: "2fr 1.2fr 1.5fr 1fr 1fr 1fr 0.8fr",
                borderBottom: i < ABONNEMENTS_REPAS.length - 1 ? `1px solid ${BORDER}` : "none",
                background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
              }}>
              <div>
                <div className="text-[9.5px] font-bold text-white">{a.eleveNom}</div>
                <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{a.eleveMatricule}</div>
              </div>
              <div>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full"
                  style={{ background: `${fc.color}12`, color: fc.color, border: `1px solid ${fc.color}20` }}>
                  {fc.lbl}
                </span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {a.repasInclus.map(r => (
                  <span key={r} className="text-[7px] px-1 py-0.5 rounded"
                    style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}>
                    {REPAS_LBL[r]}
                  </span>
                ))}
              </div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {a.dateDebut.slice(5)} → {a.dateFin.slice(5)}
              </div>
              <div className="text-[9px] font-bold" style={{ color: G }}>{formatGNF(a.montant)}</div>
              <div>
                <div className="text-[8px] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {a.repasPris}/{a.repasTotal}
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: OR }} />
                </div>
              </div>
              <div className="flex items-center gap-1">
                {a.paye
                  ? <CheckCircle2 size={10} style={{ color: EM }} />
                  : <XCircle size={10} style={{ color: RD }} />}
                <span className="text-[8px] font-bold" style={{ color: a.paye ? EM : RD }}>
                  {a.paye ? "Payé" : "Impayé"}
                </span>
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
