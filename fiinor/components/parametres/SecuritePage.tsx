"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Shield, AlertTriangle, Info, CheckCircle2,
  Monitor, X, Lock, Eye, EyeOff, RefreshCw,
} from "lucide-react"
import { AUDIT_LOG, SESSIONS_ACTIVES, ROLES_CFG, type Role } from "./parametres-mock-data"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const NIVEAU_CFG = {
  info:     { color: BL, icon: Info          },
  warning:  { color: AM, icon: AlertTriangle  },
  critical: { color: RD, icon: AlertTriangle  },
}

export function SecuritePage() {
  const [sessions, setSessions]   = useState(SESSIONS_ACTIVES)
  const [showIp, setShowIp]       = useState(false)
  const [filterNiveau, setFilter] = useState<"all" | "info" | "warning" | "critical">("all")

  function revokeSession(id: string) {
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  const filteredLog = AUDIT_LOG.filter(a => filterNiveau === "all" || a.niveau === filterNiveau)

  return (
    <div className="flex flex-col gap-4">

      {/* Isolation tenant */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { titre: "Isolation HTTP",   desc: "Header X-Organisation-Id vérifié sur chaque requête", ok: true },
          { titre: "Isolation ORM",    desc: "Querysets filtrés automatiquement par tenant",         ok: true },
          { titre: "Isolation DB",     desc: "Contraintes FK rattachées à chaque organisation",      ok: true },
        ].map((item, i) => (
          <div key={item.titre} className="flex items-start gap-3 rounded-xl p-3"
            style={{ background: `${EM}06`, border: `1px solid ${EM}15` }}>
            <CheckCircle2 size={13} style={{ color: EM, marginTop: 1, flexShrink: 0 }} />
            <div>
              <div className="text-[9.5px] font-black text-white">{item.titre}</div>
              <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Sessions actives */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between px-4 py-3"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2">
            <Monitor size={11} style={{ color: G }} />
            <span className="text-[10px] font-black text-white">Sessions actives</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: `${G}12`, color: G }}>{sessions.length}</span>
          </div>
          <button onClick={() => setShowIp(!showIp)}
            className="flex items-center gap-1 text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {showIp ? <EyeOff size={10} /> : <Eye size={10} />}
            {showIp ? "Masquer IPs" : "Afficher IPs"}
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: BORDER }}>
          {sessions.map((s, i) => {
            const rc = ROLES_CFG[s.role as Role]
            return (
              <div key={s.id} className="flex items-center gap-4 px-4 py-3"
                style={{ background: s.courante ? `${G}04` : i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-[9.5px] font-bold text-white">{s.utilisateur}</div>
                    {s.courante && (
                      <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold"
                        style={{ background: `${EM}12`, color: EM }}>session courante</span>
                    )}
                    <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: `${rc.color}10`, color: rc.color }}>{rc.lbl}</span>
                  </div>
                  <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {s.device} · Depuis {s.depuis}
                    {showIp && ` · IP: ${s.ip}`}
                  </div>
                </div>
                {!s.courante && (
                  <button onClick={() => revokeSession(s.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[8.5px] font-bold"
                    style={{ background: "rgba(239,68,68,0.08)", color: RD, border: "1px solid rgba(239,68,68,0.15)" }}>
                    <X size={9} /> Révoquer
                  </button>
                )}
              </div>
            )
          })}
          {sessions.length === 0 && (
            <div className="px-4 py-6 text-center text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Toutes les sessions ont été révoquées.
            </div>
          )}
        </div>
      </motion.div>

      {/* Audit log */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between flex-wrap gap-2 px-4 py-3"
          style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-2">
            <Shield size={11} style={{ color: G }} />
            <span className="text-[10px] font-black text-white">Journal d'audit</span>
            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{AUDIT_LOG.length} événements récents</span>
          </div>
          <div className="flex gap-1">
            {(["all","info","warning","critical"] as const).map(n => (
              <button key={n} onClick={() => setFilter(n)}
                className="px-2 py-1 rounded-lg text-[8px] font-bold capitalize"
                style={filterNiveau === n
                  ? { background: n === "all" ? `${G}15` : n === "critical" ? `${RD}20` : n === "warning" ? `${AM}15` : `${BL}15`,
                      color: n === "all" ? G : n === "critical" ? RD : n === "warning" ? AM : BL }
                  : { background: "transparent", color: "rgba(255,255,255,0.25)" }}>
                {n === "all" ? "Tous" : n}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: BORDER }}>
          {filteredLog.map((a, i) => {
            const nc  = NIVEAU_CFG[a.niveau]
            const Icon = nc.icon
            return (
              <div key={a.id} className="grid px-4 py-2.5 items-center gap-3"
                style={{ gridTemplateColumns: "20px 1.6fr 1.2fr 1.8fr 1fr", background: i % 2 ? "rgba(255,255,255,0.01)" : "transparent" }}>
                <Icon size={10} style={{ color: nc.color }} />
                <div>
                  <div className="text-[9px] font-bold text-white">{a.action}</div>
                  <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{a.utilisateur}</div>
                </div>
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full w-fit"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}>{a.module}</span>
                <div className="text-[8px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{a.details}</div>
                <div className="text-[7.5px] text-right" style={{ color: "rgba(255,255,255,0.25)" }}>
                  <div>{showIp ? a.ip : "••.••.••.••"}</div>
                  <div>{a.date}</div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Sécurité moteur formules */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="flex items-start gap-3 px-4 py-3 rounded-xl"
        style={{ background: `${BL}06`, border: `1px solid ${BL}15` }}>
        <Lock size={11} style={{ color: BL, marginTop: 1, flexShrink: 0 }} />
        <p className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Le moteur de formules s'exécute dans un <strong className="text-white">Sandbox Engine</strong> isolé —
          aucun accès au système de fichiers, réseau ou variables d'environnement.
          Chaque expression passe par l'<code className="font-mono" style={{ color: BL }}>AST Validator</code> avant
          sauvegarde, et le <code className="font-mono" style={{ color: BL }}>Type Checker</code> avant exécution.
        </p>
      </motion.div>
    </div>
  )
}
