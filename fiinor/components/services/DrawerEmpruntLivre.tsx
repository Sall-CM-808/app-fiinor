"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, BookOpen, User, Search, Loader2, Check, AlertTriangle } from "lucide-react"
import { LIVRES } from "./services-mock-data"

const G  = "#C9A84C"
const EM = "#10B981"
const RD = "#EF4444"
const AM = "#F59E0B"
const BL = "#3B82F6"
const BORDER = "rgba(255,255,255,0.07)"

interface DrawerEmpruntLivreProps {
  open: boolean
  onClose: () => void
}

export function DrawerEmpruntLivre({ open, onClose }: DrawerEmpruntLivreProps) {
  const [search, setSearch]       = useState("")
  const [selectedLivre, setSelectedLivre] = useState<string | null>(null)
  const [matricule, setMatricule] = useState("")
  const [eleveNom, setEleveNom]   = useState("")
  const [duree, setDuree]         = useState("14")
  const [loading, setLoading]     = useState(false)
  const [success, setSuccess]     = useState(false)

  useEffect(() => {
    if (open) {
      setSearch(""); setSelectedLivre(null); setMatricule("")
      setEleveNom(""); setDuree("14"); setLoading(false); setSuccess(false)
    }
  }, [open])

  const filteredLivres = LIVRES.filter(l =>
    l.disponibles > 0 &&
    `${l.titre} ${l.auteur} ${l.categorie}`.toLowerCase().includes(search.toLowerCase())
  )

  const selected = LIVRES.find(l => l.id === selectedLivre)
  const canSubmit = selectedLivre && matricule && eleveNom && !loading

  function handleSubmit() {
    if (!canSubmit) return
    setLoading(true)
    setTimeout(() => { setLoading(false); setSuccess(true); setTimeout(onClose, 1400) }, 1800)
  }

  const input = "w-full rounded-xl px-3 py-2.5 text-[10px] text-white bg-transparent outline-none"
  const inputStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }

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
            style={{ width: 420, background: "#07111d", borderLeft: `1px solid ${BORDER}` }}>

            <div className="h-0.5 flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${BL}, ${EM} 60%, transparent)` }} />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${BL}15`, border: `1px solid ${BL}25` }}>
                  <BookOpen size={14} style={{ color: BL }} />
                </div>
                <div>
                  <div className="text-[12px] font-black text-white">Enregistrer un emprunt</div>
                  <div className="text-[8.5px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Bibliothèque universitaire
                  </div>
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
                <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Informations de l'élève
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Matricule *</label>
                    <input value={matricule} onChange={e => setMatricule(e.target.value)}
                      placeholder="UC-2024-XXXX" className={input} style={inputStyle} />
                  </div>
                  <div>
                    <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Nom complet *</label>
                    <input value={eleveNom} onChange={e => setEleveNom(e.target.value)}
                      placeholder="Prénom Nom" className={input} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Livre */}
              <div className="flex flex-col gap-3">
                <div className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Sélectionner un livre
                </div>
                <div className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={inputStyle}>
                  <Search size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Titre, auteur, catégorie…"
                    className="flex-1 bg-transparent text-[10px] text-white placeholder:text-[rgba(255,255,255,0.2)] outline-none" />
                </div>

                {/* Liste livres dispo */}
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                  {filteredLivres.slice(0, 8).map(l => (
                    <button key={l.id} onClick={() => setSelectedLivre(l.id)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all"
                      style={{
                        background: selectedLivre === l.id ? `${BL}12` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${selectedLivre === l.id ? BL + "30" : BORDER}`,
                      }}>
                      <div className="size-8 rounded-lg flex items-center justify-center flex-shrink-0 text-[8px] font-black"
                        style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
                        {l.cote.slice(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9.5px] font-bold text-white truncate">{l.titre}</div>
                        <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>{l.auteur}</div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="text-[8px] font-bold" style={{ color: EM }}>{l.disponibles} dispo.</div>
                        <div className="text-[7.5px]" style={{ color: "rgba(255,255,255,0.25)" }}>{l.categorie}</div>
                      </div>
                    </button>
                  ))}
                  {filteredLivres.length === 0 && (
                    <div className="text-center text-[9px] py-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                      Aucun livre disponible correspondant
                    </div>
                  )}
                </div>

                {/* Livre sélectionné */}
                {selected && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 rounded-xl px-3 py-3"
                    style={{ background: `${BL}08`, border: `1px solid ${BL}25` }}>
                    <BookOpen size={12} style={{ color: BL }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[9.5px] font-black text-white truncate">{selected.titre}</div>
                      <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {selected.auteur} · {selected.editeur}
                      </div>
                    </div>
                    <div className="text-[8px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${EM}12`, color: EM }}>
                      {selected.disponibles} dispo.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Durée */}
              <div>
                <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Durée d'emprunt
                </label>
                <div className="flex gap-2">
                  {[
                    { val: "7",  lbl: "7 jours" },
                    { val: "14", lbl: "14 jours" },
                    { val: "21", lbl: "21 jours" },
                    { val: "30", lbl: "30 jours" },
                  ].map(d => (
                    <button key={d.val} onClick={() => setDuree(d.val)}
                      className="flex-1 py-2 rounded-xl text-[9px] font-bold transition-all"
                      style={{
                        background: duree === d.val ? `${G}15` : "rgba(255,255,255,0.04)",
                        border: `1px solid ${duree === d.val ? G + "30" : BORDER}`,
                        color: duree === d.val ? G : "rgba(255,255,255,0.35)",
                      }}>
                      {d.lbl}
                    </button>
                  ))}
                </div>
                <div className="text-[8px] mt-2 px-1" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Retour prévu : {new Date(Date.now() + parseInt(duree) * 864e5).toLocaleDateString("fr-FR")}
                </div>
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
                  : success ? <><Check size={14} /> Emprunt enregistré</>
                  : "Valider l'emprunt"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
