"use client"

import { motion } from "framer-motion"
import {
  UserCheck, ClipboardList, BookOpen, Bus,
  UtensilsCrossed, HeartPulse, TrendingUp,
  Clock, AlertTriangle, CheckCircle2,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"
import {
  KPI_SERVICES, STATS_INSCRIPTIONS, CANDIDATS,
  EMPRUNTS, LIGNES_TRANSPORT, VISITES, MENUS_SEMAINE,
} from "./services-mock-data"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const OR = "#F97316"
const NAVY = "#0D1F35"
const CARD = "rgba(255,255,255,0.03)"
const BORDER = "rgba(255,255,255,0.07)"

/* ─── KPI icon map ─── */
const ICON_MAP: Record<string, React.ElementType> = {
  UserCheck, ClipboardList, BookOpen, Bus, UtensilsCrossed, HeartPulse,
}

/* ─── Inscription trend data ─── */
const INSCRIPTION_TREND = [
  { mois: "Sep", validés: 120, refusés: 18, attente: 42 },
  { mois: "Oct", validés: 185, refusés: 12, attente: 30 },
  { mois: "Nov", validés: 210, refusés: 9,  attente: 20 },
  { mois: "Déc", validés: 195, refusés: 7,  attente: 15 },
  { mois: "Jan", validés: 230, refusés: 11, attente: 18 },
  { mois: "Fév", validés: 245, refusés: 8,  attente: 10 },
]

/* ─── Emprunt par catégorie ─── */
const EMPRUNTS_CAT = [
  { name: "Informatique", value: 82, color: BL },
  { name: "Droit",        value: 64, color: G  },
  { name: "Médecine",     value: 58, color: EM },
  { name: "Économie",     value: 45, color: AM },
  { name: "Sciences",     value: 38, color: PR },
  { name: "Histoire",     value: 25, color: OR },
]

/* ─── Transport occupation ─── */
const TRANSPORT_OCC = LIGNES_TRANSPORT.map(l => ({
  name: l.numero,
  pct: Math.round((l.inscrits / l.capacite) * 100),
  color: l.inscrits / l.capacite > 0.9 ? RD : l.inscrits / l.capacite > 0.75 ? AM : EM,
}))

type TabId = "dashboard" | "inscriptions" | "bibliotheque" | "transport" | "cafeteria" | "sante"

interface ServicesDashboardProps {
  onNavigate: (tab: TabId) => void
}

export function ServicesDashboard({ onNavigate }: ServicesDashboardProps) {
  const retardsLib  = EMPRUNTS.filter(e => e.statut === "en_retard").length
  const suiviSante  = VISITES.filter(v => v.suiviRequis).length
  const alertParent = VISITES.filter(v => v.alerteParents).length
  const inAttente   = STATS_INSCRIPTIONS.enAttente

  return (
    <div className="flex flex-col gap-5">

      {/* ── KPI Grid 3×2 ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {KPI_SERVICES.map((kpi, i) => {
          const Icon = ICON_MAP[kpi.icon] ?? UserCheck
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 340, damping: 30 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between">
                <div className="rounded-xl p-2"
                  style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}25` }}>
                  <Icon size={14} style={{ color: kpi.color }} />
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: kpi.positif ? `${EM}12` : `${AM}12`,
                    color: kpi.positif ? EM : AM,
                  }}>
                  {kpi.delta}
                </span>
              </div>
              <div>
                <div className="text-[22px] font-black text-white leading-none">{kpi.value}</div>
                <div className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{kpi.label}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Alertes actives ── */}
      {(inAttente > 0 || retardsLib > 0 || suiviSante > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2">
          {inAttente > 0 && (
            <button onClick={() => onNavigate("inscriptions")}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold transition-all"
              style={{ background: `${AM}10`, border: `1px solid ${AM}25`, color: AM }}>
              <Clock size={10} />
              {inAttente} dossier{inAttente > 1 ? "s" : ""} en attente de traitement
            </button>
          )}
          {retardsLib > 0 && (
            <button onClick={() => onNavigate("bibliotheque")}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold transition-all"
              style={{ background: `${RD}10`, border: `1px solid ${RD}25`, color: RD }}>
              <AlertTriangle size={10} />
              {retardsLib} livre{retardsLib > 1 ? "s" : ""} en retard de retour
            </button>
          )}
          {suiviSante > 0 && (
            <button onClick={() => onNavigate("sante")}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold transition-all"
              style={{ background: `${RD}10`, border: `1px solid ${RD}25`, color: RD }}>
              <HeartPulse size={10} />
              {suiviSante} élève{suiviSante > 1 ? "s" : ""} nécessitent un suivi médical
            </button>
          )}
          {alertParent > 0 && (
            <button onClick={() => onNavigate("sante")}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold transition-all"
              style={{ background: `${OR}10`, border: `1px solid ${OR}25`, color: OR }}>
              <AlertTriangle size={10} />
              {alertParent} alerte{alertParent > 1 ? "s" : ""} parents à envoyer
            </button>
          )}
        </motion.div>
      )}

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Trend inscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-black text-white">Flux des inscriptions</div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Sep 2025 – Fév 2026</div>
            </div>
            <div className="flex items-center gap-3 text-[7.5px]">
              {[{c: EM, l:"Validés"},{c: RD, l:"Refusés"},{c: AM, l:"Attente"}].map(x => (
                <div key={x.l} className="flex items-center gap-1">
                  <div className="size-2 rounded-full" style={{ background: x.c }} />
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={INSCRIPTION_TREND} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                {[{id:"gv",c:EM},{id:"gr",c:RD},{id:"ga",c:AM}].map(g => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={g.c} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={g.c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="mois" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
                itemStyle={{ color: "white" }} />
              <Area type="monotone" dataKey="validés"  stroke={EM} fill="url(#gv)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="refusés"  stroke={RD} fill="url(#gr)" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="attente"  stroke={AM} fill="url(#ga)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Emprunts par catégorie */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Emprunts par catégorie</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Bibliothèque · ce semestre</div>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={EMPRUNTS_CAT} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={3}>
                  {EMPRUNTS_CAT.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {EMPRUNTS_CAT.map(e => (
                <div key={e.name} className="flex items-center gap-2">
                  <div className="size-2 rounded-full flex-shrink-0" style={{ background: e.color }} />
                  <div className="flex-1 text-[8.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>{e.name}</div>
                  <div className="text-[8.5px] font-bold text-white">{e.value}</div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ width: 48, background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(e.value / 82) * 100}%`, background: e.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom row ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Taux remplissage transport */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Occupation Transport</div>
          <div className="flex flex-col gap-2.5">
            {TRANSPORT_OCC.map(l => (
              <div key={l.name} className="flex items-center gap-2">
                <div className="text-[8px] font-bold w-6" style={{ color: "rgba(255,255,255,0.4)" }}>{l.name}</div>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${l.pct}%`, background: l.color }} />
                </div>
                <div className="text-[8px] font-bold w-7 text-right" style={{ color: l.color }}>{l.pct}%</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Menu semaine */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-black text-white">Menu cette semaine</div>
            <div className="text-[8px] px-2 py-0.5 rounded-full"
              style={{ background: `${OR}12`, color: OR }}>
              Oct 2025
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {MENUS_SEMAINE.map(m => (
              <div key={m.id} className="flex items-center gap-2">
                <div className="text-[7.5px] font-bold w-8 flex-shrink-0"
                  style={{ color: "rgba(255,255,255,0.35)" }}>{m.jour.slice(0,3)}</div>
                <div className="text-[8.5px] flex-1 truncate text-white">{m.plat}</div>
                <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{m.reservations}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Statuts inscriptions pie */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Statuts inscriptions</div>
          <div className="flex flex-col gap-2">
            {[
              { lbl: "Validés",     val: STATS_INSCRIPTIONS.validés,    color: EM },
              { lbl: "En attente",  val: STATS_INSCRIPTIONS.enAttente,  color: AM },
              { lbl: "En révision", val: STATS_INSCRIPTIONS.enRévision, color: BL },
              { lbl: "Incomplets",  val: STATS_INSCRIPTIONS.incomplets, color: OR },
              { lbl: "Refusés",     val: STATS_INSCRIPTIONS.refusés,    color: RD },
            ].map(s => (
              <div key={s.lbl} className="flex items-center gap-2">
                <div className="size-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <div className="flex-1 text-[8.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>{s.lbl}</div>
                <div className="text-[9px] font-black" style={{ color: s.color }}>{s.val}</div>
                <div className="h-1 rounded-full overflow-hidden" style={{ width: 40, background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(s.val / 30) * 100}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-1" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={10} style={{ color: EM }} />
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                {Math.round((STATS_INSCRIPTIONS.validés / 30) * 100)}% taux de validation
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Derniers candidats ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Derniers dossiers déposés</div>
          <button onClick={() => onNavigate("inscriptions")}
            className="text-[8.5px] font-bold transition-all"
            style={{ color: G }}>
            Voir tous →
          </button>
        </div>
        {CANDIDATS.slice(0, 5).map((c, i) => {
          const statCfg: Record<string, { lbl: string; color: string }> = {
            validé:     { lbl: "Validé",     color: EM },
            en_attente: { lbl: "En attente", color: AM },
            refusé:     { lbl: "Refusé",     color: RD },
            en_révision:{ lbl: "En révision",color: BL },
            incomplet:  { lbl: "Incomplet",  color: OR },
          }
          const sc = statCfg[c.statut]
          return (
            <div key={c.id}
              className="px-4 py-3 flex items-center gap-4"
              style={{ borderBottom: i < 4 ? `1px solid ${BORDER}` : "none", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
              <div className="size-8 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-[10px]"
                style={{ background: `${G}15`, color: G }}>
                {c.prenom[0]}{c.nom[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-white truncate">{c.prenom} {c.nom}</div>
                <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{c.matricule} · {c.filiere}</div>
              </div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>{c.niveau}</div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>{c.dateDepot}</div>
              <div className="px-2 py-0.5 rounded-full text-[7.5px] font-bold"
                style={{ background: `${sc.color}15`, color: sc.color, border: `1px solid ${sc.color}25` }}>
                {sc.lbl}
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
