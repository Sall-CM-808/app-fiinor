"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Plus, Shield, ChevronDown, ChevronUp,
  Check, X, MoreHorizontal, UserCog, Clock,
} from "lucide-react"
import { UTILISATEURS, ROLES_CFG, type Role, type StatutCompte } from "./parametres-mock-data"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const STATUT_CFG: Record<StatutCompte, { lbl: string; color: string }> = {
  actif:    { lbl: "Actif",    color: EM },
  inactif:  { lbl: "Inactif",  color: AM },
  suspendu: { lbl: "Suspendu", color: RD },
}

export function UtilisateursPage() {
  const [search, setSearch]         = useState("")
  const [filterRole, setFilterRole] = useState<Role | "all">("all")
  const [expanded, setExpanded]     = useState<string | null>(null)

  const filtered = UTILISATEURS.filter(u => {
    const match = `${u.prenom} ${u.nom} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    return match && (filterRole === "all" || u.role === filterRole)
  })

  return (
    <div className="flex flex-col gap-4">

      {/* Stats rôles */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Total comptes", val: UTILISATEURS.length,                                         color: G  },
          { lbl: "Actifs",        val: UTILISATEURS.filter(u => u.statut === "actif").length,       color: EM },
          { lbl: "Admins",        val: UTILISATEURS.filter(u => ["super_admin","admin"].includes(u.role)).length, color: RD },
          { lbl: "Enseignants",   val: UTILISATEURS.filter(u => u.role === "enseignant").length,    color: "#3B82F6" },
        ].map((s, i) => (
          <motion.div key={s.lbl} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl p-3 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[18px] font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[180px] flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nom, email…"
            className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
        </div>
        <div style={{ minWidth: 150 }}>
          <SelectCustom value={filterRole} onChange={v => setFilterRole(v as Role | "all")}
            options={[{ value: "all", label: "Tous les rôles" }, ...Object.entries(ROLES_CFG).map(([k, v]) => ({ value: k, label: v.lbl }))]} />
        </div>
        <button className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
          style={{ background: G, color: "#000" }}>
          <Plus size={11} /> Inviter
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        <div className="grid px-4 py-2.5"
          style={{ gridTemplateColumns: "2.2fr 1.4fr 1.2fr 1.2fr 0.8fr", background: "rgba(0,0,0,0.25)", borderBottom: `1px solid ${BORDER}` }}>
          {["Utilisateur","Rôle","Département","Dernière connexion","Statut"].map(h => (
            <div key={h} className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
          ))}
        </div>

        {filtered.map((u, i) => {
          const rc     = ROLES_CFG[u.role]
          const sc     = STATUT_CFG[u.statut]
          const isOpen = expanded === u.id
          return (
            <div key={u.id}>
              <button onClick={() => setExpanded(isOpen ? null : u.id)}
                className="w-full grid px-4 py-3 items-center text-left transition-colors"
                style={{
                  gridTemplateColumns: "2.2fr 1.4fr 1.2fr 1.2fr 0.8fr",
                  borderBottom: `1px solid ${BORDER}`,
                  background: isOpen ? `${G}03` : i % 2 ? "rgba(255,255,255,0.01)" : "transparent",
                }}>
                {/* Utilisateur */}
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg flex items-center justify-center text-[9px] font-black flex-shrink-0"
                    style={{ background: `${rc.color}15`, color: rc.color }}>
                    {u.prenom[0]}{u.nom[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9.5px] font-bold text-white truncate">{u.prenom} {u.nom}</div>
                    <div className="text-[7.5px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>{u.email}</div>
                  </div>
                </div>
                {/* Rôle */}
                <span className="text-[7.5px] px-1.5 py-0.5 rounded-full w-fit font-bold"
                  style={{ background: `${rc.color}12`, color: rc.color, border: `1px solid ${rc.color}20` }}>
                  {rc.lbl}
                </span>
                {/* Département */}
                <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>{u.unite ?? "—"}</div>
                {/* Connexion */}
                <div className="flex items-center gap-1">
                  <Clock size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.35)" }}>{u.derniereConnexion}</span>
                </div>
                {/* Statut + chevron */}
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${sc.color}12`, color: sc.color, border: `1px solid ${sc.color}20` }}>
                    {sc.lbl}
                  </span>
                  {isOpen ? <ChevronUp size={10} style={{ color: G }} /> : <ChevronDown size={10} style={{ color: "rgba(255,255,255,0.2)" }} />}
                </div>
              </button>

              {/* Détail permissions */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
                    style={{ borderBottom: `1px solid ${BORDER}`, background: `${G}02` }}>
                    <div className="px-6 py-4 flex items-start gap-8 flex-wrap">
                      <div>
                        <div className="text-[8px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Permissions</div>
                        <div className="flex flex-wrap gap-1.5">
                          {rc.perms.map(p => (
                            <span key={p} className="flex items-center gap-1 text-[8px] px-2 py-1 rounded-lg"
                              style={{ background: `${rc.color}10`, color: rc.color, border: `1px solid ${rc.color}20` }}>
                              <Check size={8} /> {p}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[8px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Compte créé le</div>
                        <div className="text-[9px] text-white">{u.creeLe}</div>
                      </div>
                      <div className="ml-auto flex gap-2 self-center">
                        <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[8.5px] font-bold"
                          style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
                          <UserCog size={10} /> Modifier rôle
                        </button>
                        {u.statut === "actif" ? (
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[8.5px] font-bold"
                            style={{ background: "rgba(239,68,68,0.1)", color: RD, border: "1px solid rgba(239,68,68,0.2)" }}>
                            <X size={10} /> Suspendre
                          </button>
                        ) : (
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[8.5px] font-bold"
                            style={{ background: `${EM}10`, color: EM, border: `1px solid ${EM}20` }}>
                            <Check size={10} /> Réactiver
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* RBAC info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="rounded-xl px-4 py-3 flex items-start gap-3"
        style={{ background: `${G}06`, border: `1px solid ${G}15` }}>
        <Shield size={12} style={{ color: G, marginTop: 1, flexShrink: 0 }} />
        <p className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>
          Contrôle d'accès RBAC + scoping par unité structurelle. Chaque utilisateur ne voit que les données
          de sa branche hiérarchique. Les permissions sont vérifiées côté serveur à chaque requête via le
          décorateur <code className="font-mono" style={{ color: G }}>@requiert_permission</code>.
        </p>
      </motion.div>
    </div>
  )
}
