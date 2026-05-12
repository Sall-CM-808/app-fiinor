"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bus, MapPin, Clock, Users, CheckCircle2, XCircle, AlertTriangle } from "lucide-react"
import {
  LIGNES_TRANSPORT, ABONNEMENTS_TRANSPORT,
  type StatutTransport, formatGNF,
} from "./services-mock-data"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const ZONE_COLOR: Record<string, string> = {
  Nord: BL, Sud: EM, Est: G, Ouest: AM, Centre: PR,
}

const STATUT_CFG: Record<StatutTransport, { lbl: string; color: string; icon: React.ElementType }> = {
  actif:    { lbl: "Actif",    color: EM, icon: CheckCircle2 },
  suspendu: { lbl: "Suspendu", color: AM, icon: AlertTriangle },
  expiré:   { lbl: "Expiré",  color: RD, icon: XCircle },
}

type View = "lignes" | "abonnements"

export function TransportPage() {
  const [view, setView]     = useState<View>("lignes")
  const [search, setSearch] = useState("")

  const actifs   = ABONNEMENTS_TRANSPORT.filter(a => a.statut === "actif").length
  const suspendus = ABONNEMENTS_TRANSPORT.filter(a => a.statut === "suspendu").length
  const recettes  = ABONNEMENTS_TRANSPORT.filter(a => a.paye).reduce((s, a) => s + a.tarif, 0)
  const totalInscrits = LIGNES_TRANSPORT.reduce((s, l) => s + l.inscrits, 0)

  const filteredAbos = ABONNEMENTS_TRANSPORT.filter(a =>
    `${a.eleveNom} ${a.eleveMatricule} ${a.ligneNom}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Abonnés actifs",  val: String(actifs),         color: EM },
          { lbl: "Suspendus",       val: String(suspendus),      color: AM },
          { lbl: "Places occupées", val: String(totalInscrits),  color: BL },
          { lbl: "Recettes",        val: formatGNF(recettes),    color: G  },
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

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          {(["lignes","abonnements"] as View[]).map(v => (
            <button key={v} onClick={() => setView(v)}
              className="px-3 py-2 text-[9.5px] font-bold transition-all"
              style={{
                background: view === v ? `${G}15` : "transparent",
                color: view === v ? G : "rgba(255,255,255,0.35)",
                borderRight: v === "lignes" ? `1px solid ${BORDER}` : "none",
              }}>
              {v === "lignes" ? "Lignes" : "Abonnements"}
            </button>
          ))}
        </div>
        {view === "abonnements" && (
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="flex-1 rounded-xl px-3 py-2 text-[10px] bg-transparent text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none"
            style={{ border: `1px solid ${BORDER}` }} />
        )}
      </div>

      {/* Lignes */}
      {view === "lignes" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {LIGNES_TRANSPORT.map((l, i) => {
            const pct = Math.round((l.inscrits / l.capacite) * 100)
            const fillColor = pct > 90 ? RD : pct > 75 ? AM : EM
            const zoneColor = ZONE_COLOR[l.zone] ?? G
            return (
              <motion.div key={l.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: CARD, border: `1px solid ${l.actif ? BORDER : `${RD}20`}` }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="size-9 rounded-xl flex items-center justify-center font-black text-[11px]"
                      style={{ background: `${zoneColor}15`, color: zoneColor, border: `1px solid ${zoneColor}25` }}>
                      {l.numero}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-white">{l.nom}</div>
                      <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {l.arrets.length} arrêts
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[7px] font-bold"
                    style={{
                      background: l.actif ? `${EM}12` : `${RD}12`,
                      color: l.actif ? EM : RD,
                      border: `1px solid ${l.actif ? EM : RD}20`,
                    }}>
                    {l.actif ? "Actif" : "Suspendu"}
                  </div>
                </div>

                {/* Arrêts */}
                <div className="flex items-center gap-1 flex-wrap">
                  {l.arrets.map((a, ai) => (
                    <div key={ai} className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5 text-[7px] px-1.5 py-0.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}>
                        <MapPin size={7} />
                        {a}
                      </div>
                      {ai < l.arrets.length - 1 && <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 8 }}>›</span>}
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <Clock size={9} /> {l.heureDepart} → {l.heureArrivee}
                    </div>
                    <div className="flex items-center gap-1 text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      <Users size={9} /> {l.inscrits}/{l.capacite}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-black" style={{ color: G }}>{formatGNF(l.tarif)}</div>
                    <div className="text-[7px]" style={{ color: "rgba(255,255,255,0.25)" }}>/ mois</div>
                  </div>
                </div>

                {/* Remplissage */}
                <div>
                  <div className="flex justify-between text-[7.5px] mb-1">
                    <span style={{ color: "rgba(255,255,255,0.3)" }}>Occupation</span>
                    <span style={{ color: fillColor }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: fillColor }} />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Abonnements */}
      {view === "abonnements" && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
          <div className="grid px-4 py-2.5"
            style={{
              gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 0.8fr 0.8fr",
              background: "rgba(0,0,0,0.25)",
              borderBottom: `1px solid ${BORDER}`,
            }}>
            {["Élève","Ligne","Zone","Tarif","Paiement","Statut"].map(h => (
              <div key={h} className="text-[8px] font-bold uppercase tracking-wider"
                style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
            ))}
          </div>
          {filteredAbos.map((a, i) => {
            const sc = STATUT_CFG[a.statut]
            const SIcon = sc.icon
            return (
              <div key={a.id} className="grid px-4 py-3 items-center"
                style={{
                  gridTemplateColumns: "2fr 1.5fr 1.2fr 1fr 0.8fr 0.8fr",
                  borderBottom: i < filteredAbos.length - 1 ? `1px solid ${BORDER}` : "none",
                  background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                <div>
                  <div className="text-[9.5px] font-bold text-white">{a.eleveNom}</div>
                  <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{a.eleveMatricule}</div>
                </div>
                <div className="text-[9px] text-white truncate">{a.ligneNom}</div>
                <div>
                  <span className="text-[7.5px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${ZONE_COLOR[a.zone] ?? G}12`, color: ZONE_COLOR[a.zone] ?? G }}>
                    {a.zone}
                  </span>
                </div>
                <div className="text-[9px] font-bold" style={{ color: G }}>{formatGNF(a.tarif)}</div>
                <div>
                  <span className="text-[8px] font-bold" style={{ color: a.paye ? EM : RD }}>
                    {a.paye ? "Payé" : "Impayé"}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full w-fit"
                  style={{ background: `${sc.color}12`, border: `1px solid ${sc.color}20` }}>
                  <SIcon size={8} style={{ color: sc.color }} />
                  <span className="text-[7px] font-bold" style={{ color: sc.color }}>{sc.lbl}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
