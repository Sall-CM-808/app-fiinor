"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Link2, Copy, Check, TrendingUp, Wallet,
  MousePointerClick, UserCheck, ExternalLink,
  Clock, CheckCircle2, XCircle, RefreshCw,
} from "lucide-react"
import {
  AFFILIATE_LINKS, COMMISSIONS, WALLET_SOLDE, formatGNF,
  type StatutPayout,
} from "./parametres-mock-data"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const STATUT_CFG: Record<StatutPayout, { lbl: string; color: string; icon: React.ElementType }> = {
  en_attente: { lbl: "En attente",  color: AM, icon: Clock          },
  approuvé:   { lbl: "Approuvé",    color: BL, icon: CheckCircle2   },
  payé:       { lbl: "Payé",        color: EM, icon: CheckCircle2   },
  refusé:     { lbl: "Refusé",      color: RD, icon: XCircle        },
}

const SERIE_CLICS = [
  { sem: "S1", clics: 8,  conv: 0 },
  { sem: "S2", clics: 14, conv: 0 },
  { sem: "S3", clics: 22, conv: 1 },
  { sem: "S4", clics: 31, conv: 1 },
  { sem: "S5", clics: 19, conv: 0 },
  { sem: "S6", clics: 27, conv: 1 },
  { sem: "S7", clics: 34, conv: 1 },
  { sem: "S8", clics: 16, conv: 0 },
]

export function AffiliationPage() {
  const [copied, setCopied] = useState<string | null>(null)

  function copyLink(id: string, url: string) {
    navigator.clipboard.writeText(url).catch(() => {})
    setCopied(id)
    setTimeout(() => setCopied(null), 1800)
  }

  const totalClics       = AFFILIATE_LINKS.reduce((s, l) => s + l.clics, 0)
  const totalConversions = AFFILIATE_LINKS.reduce((s, l) => s + l.conversions, 0)
  const enAttente        = COMMISSIONS.filter(c => c.statut === "en_attente").reduce((s, c) => s + c.montant, 0)

  return (
    <div className="flex flex-col gap-4">

      {/* KPIs wallet */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Wallet disponible",  val: formatGNF(WALLET_SOLDE), color: G,  icon: Wallet          },
          { lbl: "En attente",          val: formatGNF(enAttente),    color: AM, icon: Clock           },
          { lbl: "Clics totaux",        val: String(totalClics),      color: BL, icon: MousePointerClick},
          { lbl: "Conversions",         val: String(totalConversions), color: EM, icon: UserCheck       },
        ].map((k, i) => {
          const Icon = k.icon
          return (
            <motion.div key={k.lbl} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="rounded-xl p-2 w-fit" style={{ background: `${k.color}15`, border: `1px solid ${k.color}25` }}>
                <Icon size={13} style={{ color: k.color }} />
              </div>
              <div>
                <div className="text-[16px] font-black" style={{ color: k.color }}>{k.val}</div>
                <div className="text-[8.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{k.lbl}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Graphique clics */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div>
          <div className="text-[11px] font-black text-white">Activité des liens — 8 dernières semaines</div>
          <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Clics et conversions</div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={SERIE_CLICS} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="grClics" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={G}  stopOpacity={0.25} />
                <stop offset="95%" stopColor={G}  stopOpacity={0}    />
              </linearGradient>
            </defs>
            <XAxis dataKey="sem" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
              labelStyle={{ color: "rgba(255,255,255,0.5)" }} />
            <Area type="monotone" dataKey="clics" stroke={G} fill="url(#grClics)" strokeWidth={2} dot={false} name="Clics" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Liens de parrainage */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-4 py-3"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2">
            <Link2 size={11} style={{ color: G }} />
            <span className="text-[10px] font-black text-white">Liens de parrainage</span>
          </div>
          <button className="flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1.5 rounded-xl"
            style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
            <Link2 size={9} /> Nouveau lien
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {AFFILIATE_LINKS.map((l, i) => (
            <div key={l.id} className="px-4 py-4 flex flex-col gap-3"
              style={{ background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] font-black text-white">{l.code}</div>
                    {l.actif
                      ? <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${EM}12`, color: EM }}>actif</span>
                      : <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)" }}>inactif</span>}
                  </div>
                  <div className="text-[7.5px] mt-0.5 font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>{l.url}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => copyLink(l.id, l.url)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[8.5px] font-bold transition-all"
                    style={{ background: copied === l.id ? `${EM}15` : `${G}10`, color: copied === l.id ? EM : G, border: `1px solid ${copied === l.id ? EM+"25" : G+"20"}` }}>
                    {copied === l.id ? <><Check size={9} /> Copié</> : <><Copy size={9} /> Copier</>}
                  </button>
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[8.5px] font-bold"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)", border: `1px solid ${BORDER}` }}>
                    <ExternalLink size={9} /> Ouvrir
                  </button>
                </div>
              </div>
              <div className="flex gap-5 text-[8px]">
                {[
                  { lbl: "Clics",    val: l.clics,                         color: BL },
                  { lbl: "Conversions", val: l.conversions,                color: EM },
                  { lbl: "Commissions",val: formatGNF(l.commissionsGagnees),color: G },
                  { lbl: "Créé le",  val: l.creeLe,                        color: "rgba(255,255,255,0.3)" },
                ].map(stat => (
                  <div key={stat.lbl}>
                    <div style={{ color: "rgba(255,255,255,0.25)" }}>{stat.lbl}</div>
                    <div className="font-bold" style={{ color: stat.color }}>{stat.val}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Historique commissions */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-4 py-3"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2">
            <TrendingUp size={11} style={{ color: G }} />
            <span className="text-[10px] font-black text-white">Historique commissions</span>
          </div>
          <button className="flex items-center gap-1.5 text-[8.5px] font-bold px-2.5 py-1.5 rounded-xl"
            style={{ background: `${G}10`, color: G, border: `1px solid ${G}20` }}>
            <RefreshCw size={9} /> Demander un virement
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {COMMISSIONS.map((c, i) => {
            const sc   = STATUT_CFG[c.statut]
            const Icon = sc.icon
            return (
              <div key={c.id} className="flex items-center gap-4 px-4 py-3"
                style={{ background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                <Icon size={11} style={{ color: sc.color, flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-bold text-white truncate">{c.description}</div>
                  <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {c.date} · {c.type}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] font-black" style={{ color: c.statut === "payé" ? EM : G }}>
                    +{formatGNF(c.montant)}
                  </div>
                  <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold"
                    style={{ background: `${sc.color}10`, color: sc.color }}>{sc.lbl}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
