"use client"

import { motion } from "framer-motion"
import {
  Users, FileText, CalendarDays, UserPlus,
  Wallet, Star, TrendingUp, AlertTriangle,
  Briefcase, CheckCircle2,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"
import {
  KPI_RH, STATS_DEPT, TENDANCE_EFFECTIFS,
  CONGES, POSTES_OUVERTS, CONTRATS, EMPLOYES, EVALUATIONS_RH,
  formatGNF,
} from "./rh-mock-data"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const OR = "#F97316"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const ICON_MAP: Record<string, React.ElementType> = {
  Users, FileText, CalendarDays, UserPlus, Wallet, Star, Briefcase,
}

const DEPT_COLORS = [BL, G, EM, AM, PR, OR, RD]

type TabId = "dashboard" | "personnel" | "contrats" | "conges" | "recrutement" | "evaluations"

interface Props { onNavigate: (tab: TabId) => void }

export function RHDashboard({ onNavigate }: Props) {
  const contratsExpirent = CONTRATS.filter(c => c.dateFin && c.statut === "actif" && c.dateFin < "2025-09-01").length
  const congesAttente    = CONGES.filter(c => c.statut === "en_attente").length
  const urgents          = POSTES_OUVERTS.filter(p => p.urgent).length
  const masseTotal       = EMPLOYES.filter(e => e.statut === "actif").reduce((s, e) => s + e.salaireBrut, 0)
  const moyenneNote      = EVALUATIONS_RH.filter(e => e.statut === "finalisé").reduce((s,e,_,a) => s + (e.notePerformance / a.length), 0)

  return (
    <div className="flex flex-col gap-5">

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {KPI_RH.map((kpi, i) => {
          const Icon = ICON_MAP[kpi.icon] ?? Users
          return (
            <motion.div key={kpi.label}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 340, damping: 30 }}
              className="rounded-2xl p-4 flex flex-col gap-3"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between">
                <div className="rounded-xl p-2" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}25` }}>
                  <Icon size={14} style={{ color: kpi.color }} />
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: kpi.positif ? `${EM}12` : `${AM}12`, color: kpi.positif ? EM : AM }}>
                  {kpi.delta}
                </span>
              </div>
              <div>
                <div className="text-[20px] font-black text-white leading-none">{kpi.value}</div>
                <div className="text-[9px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{kpi.label}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Alertes ── */}
      {(congesAttente > 0 || contratsExpirent > 0 || urgents > 0) && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2">
          {congesAttente > 0 && (
            <button onClick={() => onNavigate("conges")}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold"
              style={{ background: `${AM}10`, border: `1px solid ${AM}25`, color: AM }}>
              <CalendarDays size={10} /> {congesAttente} demande{congesAttente > 1 ? "s" : ""} de congé en attente
            </button>
          )}
          {contratsExpirent > 0 && (
            <button onClick={() => onNavigate("contrats")}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold"
              style={{ background: `${OR}10`, border: `1px solid ${OR}25`, color: OR }}>
              <AlertTriangle size={10} /> {contratsExpirent} contrat{contratsExpirent > 1 ? "s" : ""} expirant bientôt
            </button>
          )}
          {urgents > 0 && (
            <button onClick={() => onNavigate("recrutement")}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold"
              style={{ background: `${RD}10`, border: `1px solid ${RD}25`, color: RD }}>
              <Briefcase size={10} /> {urgents} poste{urgents > 1 ? "s" : ""} urgent{urgents > 1 ? "s" : ""} à pourvoir
            </button>
          )}
        </motion.div>
      )}

      {/* ── Charts row 1 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Tendance effectifs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-black text-white">Évolution des effectifs</div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Jun 2024 – Mai 2025</div>
            </div>
            <div className="flex items-center gap-3 text-[7.5px]">
              {[{c:BL,l:"Actifs"},{c:EM,l:"Embauches"},{c:RD,l:"Départs"}].map(x => (
                <div key={x.l} className="flex items-center gap-1">
                  <div className="size-2 rounded-full" style={{ background: x.c }} />
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>{x.l}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={TENDANCE_EFFECTIFS} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                {[{id:"ga",c:BL},{id:"ge",c:EM},{id:"gd",c:RD}].map(g => (
                  <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={g.c} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={g.c} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <XAxis dataKey="mois" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }} itemStyle={{ color: "white" }} />
              <Area type="monotone" dataKey="actifs"    stroke={BL} fill="url(#ga)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="embauches" stroke={EM} fill="url(#ge)" strokeWidth={1.5} dot={false} />
              <Area type="monotone" dataKey="partis"    stroke={RD} fill="url(#gd)" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Répartition par département */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Effectifs par département</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Personnel actif</div>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={STATS_DEPT} dataKey="effectif" cx="50%" cy="50%" innerRadius={28} outerRadius={50} paddingAngle={3}>
                  {STATS_DEPT.map((_, i) => <Cell key={i} fill={DEPT_COLORS[i % DEPT_COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {STATS_DEPT.map((d, i) => (
                <div key={d.dept} className="flex items-center gap-2">
                  <div className="size-2 rounded-full flex-shrink-0" style={{ background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                  <div className="flex-1 text-[8px]" style={{ color: "rgba(255,255,255,0.45)" }}>{d.dept}</div>
                  <div className="text-[9px] font-bold text-white">{d.effectif}</div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ width: 40, background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(d.effectif / 7) * 100}%`, background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Charts row 2 ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Masse salariale par dept */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Masse salariale</div>
          <div className="flex flex-col gap-2">
            {STATS_DEPT.map((d, i) => (
              <div key={d.dept} className="flex items-center gap-2">
                <div className="text-[7.5px] flex-1 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{d.dept.split(" ")[0]}</div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ width: 60, background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(d.masse / masseTotal) * 100}%`, background: DEPT_COLORS[i % DEPT_COLORS.length] }} />
                </div>
                <div className="text-[7.5px] font-bold w-10 text-right" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {Math.round((d.masse / masseTotal) * 100)}%
                </div>
              </div>
            ))}
          </div>
          <div className="pt-2" style={{ borderTop: `1px solid ${BORDER}` }}>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>Total mensuel</div>
            <div className="text-[13px] font-black" style={{ color: G }}>{formatGNF(masseTotal)}</div>
          </div>
        </motion.div>

        {/* Statuts congés */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Congés — statuts</div>
          <div className="flex flex-col gap-2">
            {[
              { lbl: "Approuvés",  val: CONGES.filter(c => c.statut === "approuvé").length,  color: EM },
              { lbl: "En attente", val: CONGES.filter(c => c.statut === "en_attente").length, color: AM },
              { lbl: "Refusés",    val: CONGES.filter(c => c.statut === "refusé").length,     color: RD },
            ].map(s => (
              <div key={s.lbl} className="flex items-center gap-2">
                <div className="size-2 rounded-full" style={{ background: s.color }} />
                <div className="flex-1 text-[8.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>{s.lbl}</div>
                <div className="text-[9px] font-black" style={{ color: s.color }}>{s.val}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            {["annuel","maladie","maternité","paternité"].map(t => (
              <div key={t} className="flex items-center gap-2">
                <div className="text-[7.5px] capitalize flex-1" style={{ color: "rgba(255,255,255,0.3)" }}>{t}</div>
                <div className="text-[8px] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {CONGES.filter(c => c.type === t).length}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pipeline recrutement */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Pipeline recrutement</div>
          <div className="flex flex-col gap-2">
            {[
              { lbl: "Candidatures", color: BL },
              { lbl: "Présélection",  color: AM },
              { lbl: "Entretien",     color: OR },
              { lbl: "Offre",         color: PR },
              { lbl: "Embauché",      color: EM },
            ].map(e => {
              const n = POSTES_OUVERTS.reduce((s, p) => s + (p.nbCandidats > 0 ? 1 : 0), 0)
              const fake = [14, 8, 5, 3, 2][["Candidatures","Présélection","Entretien","Offre","Embauché"].indexOf(e.lbl)]
              return (
                <div key={e.lbl} className="flex items-center gap-2">
                  <div className="text-[8px] w-20 flex-shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>{e.lbl}</div>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(fake / 14) * 100}%`, background: e.color }} />
                  </div>
                  <div className="text-[8.5px] font-bold w-4 text-right" style={{ color: e.color }}>{fake}</div>
                </div>
              )
            })}
          </div>
          <button onClick={() => onNavigate("recrutement")}
            className="text-[8.5px] font-bold mt-auto"
            style={{ color: G }}>Voir le kanban →</button>
        </motion.div>
      </div>

      {/* ── Derniers employés ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${BORDER}` }}>
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="text-[11px] font-black text-white">Personnel récemment ajouté</div>
          <button onClick={() => onNavigate("personnel")}
            className="text-[8.5px] font-bold" style={{ color: G }}>Voir tous →</button>
        </div>
        {EMPLOYES.filter(e => e.statut === "actif").slice(0, 5).map((e, i) => (
          <div key={e.id} className="px-4 py-3 flex items-center gap-4"
            style={{ borderBottom: i < 4 ? `1px solid ${BORDER}` : "none", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
            <div className="size-8 rounded-xl flex items-center justify-center font-black text-[10px] flex-shrink-0"
              style={{ background: `${BL}15`, color: BL }}>
              {e.prenom[0]}{e.nom[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-white">{e.prenom} {e.nom}</div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{e.poste}</div>
            </div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{e.departement}</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>{e.dateEmbauche}</div>
            <div className="flex gap-1">
              {e.roles.map(r => (
                <span key={r} className="text-[7px] px-1.5 py-0.5 rounded-full"
                  style={{ background: `${G}12`, color: G, border: `1px solid ${G}20` }}>{r}</span>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
