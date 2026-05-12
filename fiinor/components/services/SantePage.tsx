"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  HeartPulse, CheckCircle2, Clock, AlertTriangle,
  ExternalLink, Plus, Search, Bell, ChevronDown, ChevronUp,
  User, Stethoscope, Pill, FileText, X, Loader2, Check,
  Phone, CalendarDays, Activity,
} from "lucide-react"
import { VISITES, type StatutSante, type TypeVisite } from "./services-mock-data"
import { SelectCustom, type SelectOption } from "./SelectCustom"

/* ─── Tokens ─── */
const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const PR = "#8B5CF6"
const OR = "#F97316"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const STATUT_CFG: Record<StatutSante, { lbl: string; color: string; icon: React.ElementType }> = {
  traité:      { lbl: "Traité",       color: EM, icon: CheckCircle2 },
  en_suivi:    { lbl: "En suivi",     color: AM, icon: Clock },
  hospitalisé: { lbl: "Hospitalisé",  color: RD, icon: AlertTriangle },
  référé:      { lbl: "Référé",       color: PR, icon: ExternalLink },
}

const TYPE_CFG: Record<TypeVisite, { lbl: string; color: string }> = {
  consultation: { lbl: "Consultation", color: BL },
  urgence:      { lbl: "Urgence",      color: RD },
  certificat:   { lbl: "Certificat",   color: G  },
  vaccination:  { lbl: "Vaccination",  color: EM },
}

/* ════════════════════════════════════
   DRAWER — Nouvelle visite
════════════════════════════════════ */
const MOTIFS_LIST = [
  "Fièvre et maux de tête", "Douleurs abdominales", "Blessure sportive",
  "Contrôle de santé annuel", "Demande de certificat médical",
  "Vaccination programmée", "Malaise en cours", "Allergie cutanée",
  "Demande de dispense EPS", "Autre motif",
]

interface DrawerNouvelleVisiteProps { open: boolean; onClose: () => void }

function DrawerNouvelleVisite({ open, onClose }: DrawerNouvelleVisiteProps) {
  const [matricule, setMatricule] = useState("")
  const [eleveNom, setEleveNom]   = useState("")
  const [classe, setClasse]       = useState("")
  const [type, setType]           = useState<TypeVisite>("consultation")
  const [motif, setMotif]         = useState("")
  const [diagnostic, setDiagnostic] = useState("")
  const [traitement, setTraitement] = useState("")
  const [infirmier, setInfirmier]   = useState("")
  const [statut, setStatut]         = useState<StatutSante>("traité")
  const [suiviRequis, setSuiviRequis] = useState(false)
  const [alerteParents, setAlerteParents] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (open) {
      setMatricule(""); setEleveNom(""); setClasse(""); setType("consultation")
      setMotif(""); setDiagnostic(""); setTraitement(""); setInfirmier("")
      setStatut("traité"); setSuiviRequis(false); setAlerteParents(false)
      setLoading(false); setSuccess(false)
    }
  }, [open])

  const canSubmit = matricule && eleveNom && motif && infirmier && !loading

  function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(onClose, 1400) }, 1800)
  }

  const inp = "w-full rounded-xl px-3 py-2.5 text-[10px] text-white bg-transparent outline-none"
  const inpStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 36 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{ width: 440, background: "#07111d", borderLeft: `1px solid ${BORDER}` }}>

            <div className="h-0.5 flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${RD}, ${AM} 60%, transparent)` }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${RD}15`, border: `1px solid ${RD}25` }}>
                  <HeartPulse size={14} style={{ color: RD }} />
                </div>
                <div>
                  <div className="text-[12px] font-black text-white">Nouvelle visite médicale</div>
                  <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>Infirmerie universitaire</div>
                </div>
              </div>
              <button onClick={onClose} className="rounded-xl p-2"
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <X size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5"
              style={{ scrollbarWidth: "thin" }}>

              {/* Élève */}
              <div className="flex flex-col gap-3">
                <div className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  <User size={9} /> Élève
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Matricule *</label>
                    <input value={matricule} onChange={e => setMatricule(e.target.value)}
                      placeholder="UC-2024-XXXX" className={inp} style={inpStyle} />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Nom complet *</label>
                    <input value={eleveNom} onChange={e => setEleveNom(e.target.value)}
                      placeholder="Prénom Nom" className={inp} style={inpStyle} />
                  </div>
                </div>
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Classe / Promotion</label>
                  <input value={classe} onChange={e => setClasse(e.target.value)}
                    placeholder="L1 Informatique" className={inp} style={inpStyle} />
                </div>
              </div>

              {/* Type de visite */}
              <div className="flex flex-col gap-3">
                <div className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  <Activity size={9} /> Type de visite *
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(TYPE_CFG) as [TypeVisite, {lbl:string;color:string}][]).map(([k, cfg]) => (
                    <button key={k} onClick={() => setType(k)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-left transition-all"
                      style={{
                        background: type === k ? `${cfg.color}12` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${type === k ? cfg.color + "30" : BORDER}`,
                      }}>
                      <div className="size-3 rounded-full border-2 flex-shrink-0"
                        style={{ borderColor: type === k ? cfg.color : "rgba(255,255,255,0.2)", background: type === k ? cfg.color : "transparent" }} />
                      <span className="text-[9px] font-bold" style={{ color: type === k ? cfg.color : "rgba(255,255,255,0.45)" }}>
                        {cfg.lbl}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Motif */}
              <div className="flex flex-col gap-2">
                <div className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  <Stethoscope size={9} /> Motif de consultation *
                </div>
                <SelectCustom
                  value={motif}
                  onChange={setMotif}
                  placeholder="Sélectionner un motif"
                  options={MOTIFS_LIST.map(m => ({ value: m, label: m }))}
                  accentColor={RD}
                />
              </div>

              {/* Diagnostic + Traitement */}
              <div className="flex flex-col gap-3">
                <div className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: "rgba(255,255,255,0.3)" }}>
                  <Pill size={9} /> Diagnostic & Traitement
                </div>
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Diagnostic</label>
                  <textarea value={diagnostic} onChange={e => setDiagnostic(e.target.value)}
                    rows={2} placeholder="Observations cliniques…"
                    className={`${inp} resize-none`} style={inpStyle} />
                </div>
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Traitement prescrit</label>
                  <textarea value={traitement} onChange={e => setTraitement(e.target.value)}
                    rows={2} placeholder="Médicaments, repos, référence…"
                    className={`${inp} resize-none`} style={inpStyle} />
                </div>
              </div>

              {/* Infirmier + Statut */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Infirmier responsable *</label>
                  <SelectCustom
                    value={infirmier}
                    onChange={setInfirmier}
                    placeholder="Sélectionner"
                    options={["Mme Diallo","M. Barry","Mme Camara"].map(n => ({ value: n, label: n }))}
                    accentColor={RD}
                  />
                </div>
                <div>
                  <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Statut</label>
                  <SelectCustom
                    value={statut}
                    onChange={v => setStatut(v as StatutSante)}
                    options={(Object.entries(STATUT_CFG) as [StatutSante, {lbl:string;color:string;icon:React.ElementType}][]).map(([k, cfg]) => ({ value: k, label: cfg.lbl }))}
                    accentColor={RD}
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex flex-col gap-2">
                <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Actions requises</div>
                {[
                  { val: suiviRequis, set: setSuiviRequis, lbl: "Suivi médical requis", color: AM },
                  { val: alerteParents, set: setAlerteParents, lbl: "Notifier les parents", color: RD },
                ].map(f => (
                  <button key={f.lbl} onClick={() => f.set(!f.val)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
                    style={{
                      background: f.val ? `${f.color}08` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${f.val ? f.color + "30" : BORDER}`,
                    }}>
                    <div className="size-4 rounded flex items-center justify-center flex-shrink-0"
                      style={{ background: f.val ? f.color : "rgba(255,255,255,0.06)", border: `1px solid ${f.val ? f.color : BORDER}` }}>
                      {f.val && <Check size={9} style={{ color: "#000" }} />}
                    </div>
                    <span className="text-[9.5px]" style={{ color: f.val ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)" }}>
                      {f.lbl}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 flex gap-3 flex-shrink-0"
              style={{ borderTop: `1px solid ${BORDER}`, background: "rgba(0,0,0,0.2)" }}>
              <button onClick={onClose}
                className="flex-1 rounded-xl py-2.5 text-[10px] font-bold"
                style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, color: "rgba(255,255,255,0.4)" }}>
                Annuler
              </button>
              <button onClick={handleSubmit} disabled={!canSubmit}
                className="flex-[2] rounded-xl py-2.5 text-[11px] font-black flex items-center justify-center gap-2 transition-all"
                style={{
                  background: success ? EM : canSubmit ? G : "rgba(255,255,255,0.05)",
                  color: success ? "white" : canSubmit ? "#000" : "rgba(255,255,255,0.2)",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  border: "none",
                }}>
                {loading ? <Loader2 size={14} className="animate-spin" />
                  : success ? <><Check size={14} /> Visite enregistrée</>
                  : "Enregistrer la visite"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ════════════════════════════════════
   PAGE PRINCIPALE
════════════════════════════════════ */
export function SantePage() {
  const [search, setSearch]         = useState("")
  const [filterType, setFilterType] = useState<TypeVisite | "all">("all")
  const [filterStatut, setFilterStatut] = useState<StatutSante | "all">("all")
  const [expanded, setExpanded]     = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notified, setNotified]     = useState<Set<string>>(new Set())

  const filtered = VISITES.filter(v => {
    const match = `${v.eleveNom} ${v.eleveMatricule} ${v.motif} ${v.diagnostic}`.toLowerCase().includes(search.toLowerCase())
    const matchType   = filterType   === "all" || v.type   === filterType
    const matchStatut = filterStatut === "all" || v.statut === filterStatut
    return match && matchType && matchStatut
  })

  const enSuivi  = VISITES.filter(v => v.statut === "en_suivi").length
  const urgences = VISITES.filter(v => v.type   === "urgence").length
  const alertes  = VISITES.filter(v => v.alerteParents).length
  const traités  = VISITES.filter(v => v.statut === "traité").length

  function handleNotify(id: string) {
    setNotified(prev => new Set([...prev, id]))
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Stats 4 KPIs ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { lbl: "Visites ce mois",  val: String(VISITES.length), color: BL },
          { lbl: "Traités",          val: String(traités),        color: EM },
          { lbl: "En suivi",         val: String(enSuivi),        color: AM },
          { lbl: "Urgences",         val: String(urgences),       color: RD },
        ].map((s, i) => (
          <motion.div key={s.lbl}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl p-3 text-center"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-[18px] font-black" style={{ color: s.color }}>{s.val}</div>
            <div className="text-[7.5px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.lbl}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Alertes actives (max 3) ── */}
      <AnimatePresence>
        {VISITES.filter(v => (v.suiviRequis || v.alerteParents) && !notified.has(v.id))
          .slice(0, 3).map((v, i) => (
          <motion.div key={v.id}
            initial={{ opacity: 0, x: -8, height: 0 }} animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, x: 8, height: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl overflow-hidden"
            style={{ background: `${v.alerteParents ? RD : AM}08`, border: `1px solid ${v.alerteParents ? RD : AM}20` }}>
            {v.alerteParents
              ? <AlertTriangle size={12} style={{ color: RD }} />
              : <Clock size={12} style={{ color: AM }} />}
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold text-white">{v.eleveNom}</span>
              <span className="text-[8.5px] ml-2" style={{ color: "rgba(255,255,255,0.5)" }}>{v.eleveClasse}</span>
              <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{v.motif}</div>
              {v.alerteParents && <div className="text-[7.5px] font-bold mt-0.5" style={{ color: RD }}>⚠ Alerte parents requise</div>}
              {v.suiviRequis && !v.alerteParents && <div className="text-[7.5px] font-bold mt-0.5" style={{ color: AM }}>📋 Suivi médical requis</div>}
            </div>
            <button onClick={() => handleNotify(v.id)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[8px] font-bold flex-shrink-0 transition-all"
              style={{ background: `${v.alerteParents ? RD : AM}15`, color: v.alerteParents ? RD : AM, border: `1px solid ${v.alerteParents ? RD : AM}25` }}>
              <Bell size={9} /> Notifié
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex-1 min-w-[180px] flex items-center gap-2 rounded-xl px-3 py-2"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Élève, matricule, motif, diagnostic…"
            className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
        </div>
        <div style={{ minWidth: 140 }}>
          <SelectCustom
            value={filterType}
            onChange={v => setFilterType(v as TypeVisite | "all")}
            options={[{ value: "all", label: "Tous types" }, ...(Object.keys(TYPE_CFG) as TypeVisite[]).map(t => ({ value: t, label: TYPE_CFG[t].lbl }))]}
          />
        </div>
        <div style={{ minWidth: 140 }}>
          <SelectCustom
            value={filterStatut}
            onChange={v => setFilterStatut(v as StatutSante | "all")}
            options={[{ value: "all", label: "Tous statuts" }, ...(Object.keys(STATUT_CFG) as StatutSante[]).map(s => ({ value: s, label: STATUT_CFG[s].lbl }))]}
          />
        </div>
        <button onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold"
          style={{ background: G, color: "#000" }}>
          <Plus size={11} /> Nouvelle visite
        </button>
      </div>

      {/* ── Table avec rows expandables ── */}
      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        {/* Head */}
        <div className="grid px-4 py-2.5"
          style={{
            gridTemplateColumns: "2fr 1.2fr 0.9fr 1.1fr 1.8fr 0.8fr 0.9fr",
            background: "rgba(0,0,0,0.25)",
            borderBottom: `1px solid ${BORDER}`,
          }}>
          {["Élève","Date / Heure","Type","Infirmier","Motif","Suivi","Statut"].map(h => (
            <div key={h} className="text-[8px] font-bold uppercase tracking-wider"
              style={{ color: "rgba(255,255,255,0.3)" }}>{h}</div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-10 text-center text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Aucune visite ne correspond aux filtres
          </div>
        )}

        {filtered.map((v, i) => {
          const sc    = STATUT_CFG[v.statut]
          const tc    = TYPE_CFG[v.type]
          const SIcon = sc.icon
          const isOpen = expanded === v.id
          const rowBg = v.type === "urgence"
            ? "rgba(239,68,68,0.03)"
            : isOpen ? "rgba(201,168,76,0.03)"
            : i % 2 ? "rgba(255,255,255,0.01)" : "transparent"

          return (
            <div key={v.id}>
              {/* Row principale — cliquable */}
              <button
                onClick={() => setExpanded(isOpen ? null : v.id)}
                className="w-full grid px-4 py-3 items-center text-left transition-colors"
                style={{
                  gridTemplateColumns: "2fr 1.2fr 0.9fr 1.1fr 1.8fr 0.8fr 0.9fr",
                  borderBottom: `1px solid ${BORDER}`,
                  background: rowBg,
                }}>
                {/* Élève */}
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg flex items-center justify-center font-black text-[9px] flex-shrink-0"
                    style={{ background: `${tc.color}15`, color: tc.color }}>
                    {v.eleveNom.split(" ").map(n => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-white truncate">{v.eleveNom}</div>
                    <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>{v.eleveClasse}</div>
                  </div>
                </div>
                {/* Date */}
                <div>
                  <div className="text-[9px] text-white">{v.date}</div>
                  <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{v.heure}</div>
                </div>
                {/* Type */}
                <div>
                  <span className="text-[7.5px] px-1.5 py-0.5 rounded-full"
                    style={{ background: `${tc.color}12`, color: tc.color, border: `1px solid ${tc.color}20` }}>
                    {tc.lbl}
                  </span>
                </div>
                {/* Infirmier */}
                <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.45)" }}>{v.infirmier}</div>
                {/* Motif */}
                <div className="text-[8.5px] text-white truncate pr-2">{v.motif}</div>
                {/* Suivi */}
                <div className="flex items-center gap-1">
                  {v.suiviRequis
                    ? <AlertTriangle size={10} style={{ color: AM }} />
                    : <CheckCircle2 size={10} style={{ color: "rgba(255,255,255,0.12)" }} />}
                  {v.alerteParents && <Bell size={10} style={{ color: RD }} />}
                </div>
                {/* Statut + chevron */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full"
                    style={{ background: `${sc.color}12`, border: `1px solid ${sc.color}20` }}>
                    <SIcon size={8} style={{ color: sc.color }} />
                    <span className="text-[7px] font-bold" style={{ color: sc.color }}>{sc.lbl}</span>
                  </div>
                  {isOpen
                    ? <ChevronUp size={11} style={{ color: G }} />
                    : <ChevronDown size={11} style={{ color: "rgba(255,255,255,0.2)" }} />}
                </div>
              </button>

              {/* ── Panneau détail expandable ── */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                    style={{ borderBottom: `1px solid ${BORDER}`, background: "rgba(201,168,76,0.015)" }}>
                    <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-5">

                      {/* Identité */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.25)" }}>
                          <User size={8} /> Identité
                        </div>
                        <div className="text-[10px] font-black text-white">{v.eleveNom}</div>
                        <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>{v.eleveClasse}</div>
                        <div className="text-[8px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>{v.eleveMatricule}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <CalendarDays size={9} style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {v.date} à {v.heure}
                          </span>
                        </div>
                      </div>

                      {/* Diagnostic */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.25)" }}>
                          <Stethoscope size={8} /> Diagnostic
                        </div>
                        <div className="text-[9px] text-white leading-relaxed">{v.diagnostic}</div>
                        <div className="text-[8px] mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                          Motif : {v.motif}
                        </div>
                      </div>

                      {/* Traitement */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.25)" }}>
                          <Pill size={8} /> Traitement
                        </div>
                        <div className="text-[9px] text-white leading-relaxed">{v.traitement}</div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <User size={9} style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {v.infirmier}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[8px] font-bold uppercase tracking-wider flex items-center gap-1"
                          style={{ color: "rgba(255,255,255,0.25)" }}>
                          <FileText size={8} /> Actions
                        </div>
                        {v.suiviRequis && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[8px]"
                            style={{ background: `${AM}10`, color: AM, border: `1px solid ${AM}20` }}>
                            <Clock size={9} /> Suivi médical requis
                          </div>
                        )}
                        {v.alerteParents && (
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[8px]"
                            style={{ background: `${RD}10`, color: RD, border: `1px solid ${RD}20` }}>
                            <AlertTriangle size={9} /> Alerte parents
                          </div>
                        )}
                        <div className="flex gap-1.5 flex-wrap mt-1">
                          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[8px] font-bold transition-all"
                            style={{ background: `${G}10`, color: G, border: `1px solid ${G}20` }}>
                            <FileText size={9} /> Certificat
                          </button>
                          {v.alerteParents && !notified.has(v.id) && (
                            <button onClick={() => handleNotify(v.id)}
                              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[8px] font-bold transition-all"
                              style={{ background: `${RD}10`, color: RD, border: `1px solid ${RD}20` }}>
                              <Bell size={9} /> Notifier
                            </button>
                          )}
                          {notified.has(v.id) && (
                            <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[8px]"
                              style={{ background: `${EM}10`, color: EM }}>
                              <Check size={9} /> Notifié
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Drawer */}
      <DrawerNouvelleVisite open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}
