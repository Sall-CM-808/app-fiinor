"use client"

import { motion } from "framer-motion"
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts"
import {
  INSCRIPTIONS_FILIERE, EMPRUNTS_CATEGORIE, VISITES_TYPE,
  OCCUPATION_TRANSPORT, SERIE_CONSOLIDEE,
} from "./rapports-mock-data"
import { UserCheck, BookOpen, HeartPulse, Bus } from "lucide-react"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const OR = "#F97316"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const totalInscrits = INSCRIPTIONS_FILIERE.reduce((s, f) => s + f.nouvelle + f.reinscription, 0)
const totalEmprunts = EMPRUNTS_CATEGORIE.reduce((s, c) => s + c.nb, 0)

export function RapportPedagogiquePage() {
  return (
    <div className="flex flex-col gap-5">

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Total inscrits",    val: String(totalInscrits), color: EM, icon: UserCheck   },
          { lbl: "Nouvelles inscr.",  val: String(INSCRIPTIONS_FILIERE.reduce((s,f)=>s+f.nouvelle,0)), color: BL, icon: UserCheck },
          { lbl: "Emprunts bibl.",    val: String(totalEmprunts), color: G,  icon: BookOpen    },
          { lbl: "Visites médicales", val: "20",                  color: RD, icon: HeartPulse  },
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
                <div className="text-[18px] font-black" style={{ color: k.color }}>{k.val}</div>
                <div className="text-[8.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{k.lbl}</div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Inscriptions par filière */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="text-[11px] font-black text-white">Inscriptions par filière</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Nouvelles inscriptions vs réinscriptions</div>
          </div>
          <div className="flex gap-3 text-[7.5px]">
            {[{c:BL,l:"Nouvelles"},{c:`${EM}60`,l:"Réinscriptions"}].map(x => (
              <div key={x.l} className="flex items-center gap-1.5">
                <div className="size-2 rounded-full" style={{ background: x.c }} />
                <span style={{ color: "rgba(255,255,255,0.4)" }}>{x.l}</span>
              </div>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={INSCRIPTIONS_FILIERE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="filiere" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 8 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
              labelStyle={{ color: "rgba(255,255,255,0.5)" }} />
            <Bar dataKey="nouvelle"      fill={BL}          radius={[3,3,0,0]} name="Nouvelles"      stackId="a" />
            <Bar dataKey="reinscription" fill={`${EM}55`}   radius={[3,3,0,0]} name="Réinscriptions" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Emprunts + Visites + Transport */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Emprunts par catégorie */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Bibliothèque</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Emprunts par catégorie</div>
          </div>
          <div className="flex flex-col gap-2">
            {EMPRUNTS_CATEGORIE.map(c => (
              <div key={c.cat} className="flex items-center gap-2">
                <div className="size-2 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <div className="flex-1 text-[8px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{c.cat}</div>
                <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(c.nb / totalEmprunts) * 100}%`, background: c.color }} />
                </div>
                <div className="text-[8.5px] font-bold w-5 text-right" style={{ color: c.color }}>{c.nb}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Types visites médicales */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="text-[11px] font-black text-white">Infirmerie</div>
            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Visites par type</div>
          </div>
          <div className="flex items-center gap-3">
            <ResponsiveContainer width={100} height={100}>
              <PieChart>
                <Pie data={VISITES_TYPE} dataKey="nb" cx="50%" cy="50%" innerRadius={24} outerRadius={44} paddingAngle={3}>
                  {VISITES_TYPE.map((v, i) => <Cell key={i} fill={v.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {VISITES_TYPE.map(v => (
                <div key={v.type} className="flex items-center gap-2">
                  <div className="size-2 rounded-full flex-shrink-0" style={{ background: v.color }} />
                  <div className="flex-1 text-[8px]" style={{ color: "rgba(255,255,255,0.45)" }}>{v.type}</div>
                  <div className="text-[9px] font-black" style={{ color: v.color }}>{v.nb}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Occupation transport */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2">
            <Bus size={11} style={{ color: OR }} />
            <div>
              <div className="text-[11px] font-black text-white">Transport</div>
              <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Occupation par ligne</div>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {OCCUPATION_TRANSPORT.map(l => {
              const pct   = Math.round((l.inscrits / l.capacite) * 100)
              const color = pct >= 90 ? RD : pct >= 75 ? AM : EM
              return (
                <div key={l.ligne}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[8px] truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{l.ligne}</div>
                    <div className="text-[8px] font-bold flex-shrink-0 ml-2" style={{ color }}>
                      {l.inscrits}/{l.capacite}
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* Tendance inscriptions 12 mois */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div>
          <div className="text-[11px] font-black text-white">Nouvelles inscriptions — tendance 12 mois</div>
          <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Pic de rentrée Sep & Jan visible</div>
        </div>
        <ResponsiveContainer width="100%" height={130}>
          <LineChart data={SERIE_CONSOLIDEE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis dataKey="mois" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 9 }}
              labelStyle={{ color: "rgba(255,255,255,0.5)" }} />
            <Line type="monotone" dataKey="inscriptions" stroke={PR} strokeWidth={2}
              dot={{ r: 3, fill: PR, strokeWidth: 0 }} activeDot={{ r: 5 }} name="Inscriptions" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
