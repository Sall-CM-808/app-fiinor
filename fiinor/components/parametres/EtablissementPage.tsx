"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Building2, Globe, Palette, Save, Check, Upload, MapPin, Phone, Mail, Link } from "lucide-react"
import { ETABLISSEMENT } from "./parametres-mock-data"
import { SelectCustom } from "../services/SelectCustom"

const G  = "#C9A84C"
const EM = "#10B981"
const BL = "#3B82F6"
const BORDER = "rgba(255,255,255,0.07)"
const CARD   = "rgba(255,255,255,0.03)"

const DEVISES  = ["GNF","XOF","EUR","USD"]
const LANGUES  = [{ value:"fr", label:"Français" },{ value:"en", label:"English" },{ value:"ar", label:"العربية" }]
const FUSEAUX  = ["Africa/Conakry","Africa/Abidjan","Africa/Dakar","Europe/Paris","UTC"]
const TYPES_ET = ["Université","Lycée","Collège","École primaire","Institut technique","Centre de formation"]

const inp = "w-full rounded-xl px-3 py-2.5 text-[10px] text-white bg-transparent outline-none"
const inpStyle = { background: "rgba(255,255,255,0.04)", border: `1px solid ${BORDER}` }

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ background: "rgba(0,0,0,0.2)", borderBottom: `1px solid ${BORDER}` }}>
        <Icon size={12} style={{ color: G }} />
        <span className="text-[10px] font-black text-white">{title}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

export function EtablissementPage() {
  const [nom, setNom]                 = useState(ETABLISSEMENT.nom)
  const [sigle, setSigle]             = useState(ETABLISSEMENT.sigle)
  const [type, setType]               = useState(ETABLISSEMENT.type)
  const [pays, setPays]               = useState(ETABLISSEMENT.pays)
  const [ville, setVille]             = useState(ETABLISSEMENT.ville)
  const [adresse, setAdresse]         = useState(ETABLISSEMENT.adresse)
  const [telephone, setTelephone]     = useState(ETABLISSEMENT.telephone)
  const [email, setEmail]             = useState(ETABLISSEMENT.email)
  const [siteWeb, setSiteWeb]         = useState(ETABLISSEMENT.siteWeb)
  const [devise, setDevise]           = useState(ETABLISSEMENT.devise)
  const [langue, setLangue]           = useState(ETABLISSEMENT.langue)
  const [fuseau, setFuseau]           = useState(ETABLISSEMENT.fuseau)
  const [couleurPrimaire, setCouleurP]= useState(ETABLISSEMENT.couleurPrimaire)
  const [couleurSecondaire, setCouleurS]= useState(ETABLISSEMENT.couleurSecondaire)
  const [saved, setSaved]             = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Identité */}
      <Section title="Identité de l'établissement" icon={Building2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex items-center gap-4">
            <div className="size-16 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${G}12`, border: `1px dashed ${G}30` }}>
              <Building2 size={24} style={{ color: G }} />
            </div>
            <div>
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-[9px] font-bold"
                style={{ background: `${G}12`, color: G, border: `1px solid ${G}25` }}>
                <Upload size={10} /> Changer le logo
              </button>
              <div className="text-[7.5px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                PNG, SVG — max 2 MB · recommandé 200×200px
              </div>
            </div>
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Nom complet *</label>
            <input value={nom} onChange={e => setNom(e.target.value)} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Sigle / Abréviation</label>
            <input value={sigle} onChange={e => setSigle(e.target.value)} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Type d'établissement</label>
            <SelectCustom value={type} onChange={setType} accentColor={G}
              options={TYPES_ET.map(t => ({ value: t, label: t }))} />
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Année académique active</label>
            <input value={ETABLISSEMENT.anneeActive} readOnly className={inp}
              style={{ ...inpStyle, opacity: 0.5, cursor: "not-allowed" }} />
          </div>
        </div>
      </Section>

      {/* Coordonnées */}
      <Section title="Coordonnées & localisation" icon={MapPin}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>
              <MapPin size={9} className="inline mr-1" />Pays
            </label>
            <input value={pays} onChange={e => setPays(e.target.value)} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Ville</label>
            <input value={ville} onChange={e => setVille(e.target.value)} className={inp} style={inpStyle} />
          </div>
          <div className="md:col-span-2">
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Adresse complète</label>
            <input value={adresse} onChange={e => setAdresse(e.target.value)} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Phone size={9} className="inline mr-1" />Téléphone
            </label>
            <input value={telephone} onChange={e => setTelephone(e.target.value)} className={inp} style={inpStyle} />
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Mail size={9} className="inline mr-1" />Email institutionnel
            </label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" className={inp} style={inpStyle} />
          </div>
          <div className="md:col-span-2">
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>
              <Link size={9} className="inline mr-1" />Site web
            </label>
            <input value={siteWeb} onChange={e => setSiteWeb(e.target.value)} className={inp} style={inpStyle} />
          </div>
        </div>
      </Section>

      {/* Localisation & devise */}
      <Section title="Localisation & devise" icon={Globe}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Devise principale</label>
            <SelectCustom value={devise} onChange={setDevise} accentColor={G}
              options={DEVISES.map(d => ({ value: d, label: d }))} />
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Langue de l'interface</label>
            <SelectCustom value={langue} onChange={setLangue} accentColor={G} options={LANGUES} />
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-1.5 block" style={{ color: "rgba(255,255,255,0.4)" }}>Fuseau horaire</label>
            <SelectCustom value={fuseau} onChange={setFuseau} accentColor={G}
              options={FUSEAUX.map(f => ({ value: f, label: f }))} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="text-[8px] font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>Devises acceptées :</div>
          {DEVISES.map(d => (
            <span key={d} className="text-[8px] px-2 py-0.5 rounded-full"
              style={{ background: d === devise ? `${G}15` : "rgba(255,255,255,0.05)", color: d === devise ? G : "rgba(255,255,255,0.35)", border: `1px solid ${d === devise ? G + "30" : BORDER}` }}>
              {d}
            </span>
          ))}
        </div>
      </Section>

      {/* Branding */}
      <Section title="Branding & couleurs" icon={Palette}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[8.5px] font-bold mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>Couleur primaire (accent)</label>
            <div className="flex items-center gap-3">
              <input type="color" value={couleurPrimaire} onChange={e => setCouleurP(e.target.value)}
                className="size-10 rounded-xl cursor-pointer border-0 bg-transparent" />
              <div>
                <div className="text-[11px] font-black text-white">{couleurPrimaire}</div>
                <div className="flex gap-1 mt-1">
                  {["#C9A84C","#10B981","#3B82F6","#8B5CF6","#EF4444","#F97316"].map(c => (
                    <button key={c} onClick={() => setCouleurP(c)}
                      className="size-4 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: couleurPrimaire === c ? "white" : "transparent" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[8.5px] font-bold mb-2 block" style={{ color: "rgba(255,255,255,0.4)" }}>Couleur secondaire (fond)</label>
            <div className="flex items-center gap-3">
              <input type="color" value={couleurSecondaire} onChange={e => setCouleurS(e.target.value)}
                className="size-10 rounded-xl cursor-pointer border-0 bg-transparent" />
              <div className="text-[11px] font-black text-white">{couleurSecondaire}</div>
            </div>
          </div>
          {/* Aperçu */}
          <div className="md:col-span-2">
            <div className="text-[8.5px] font-bold mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>Aperçu</div>
            <div className="rounded-xl p-4 flex items-center gap-3"
              style={{ background: couleurSecondaire, border: `1px solid ${couleurPrimaire}30` }}>
              <div className="size-8 rounded-xl flex items-center justify-center font-black text-[10px]"
                style={{ background: couleurPrimaire, color: couleurSecondaire }}>
                {sigle.slice(0,2)}
              </div>
              <div>
                <div className="font-black text-white text-[11px]">{nom}</div>
                <div className="text-[8px]" style={{ color: couleurPrimaire }}>Fiinor Platform · {type}</div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Save */}
      <div className="flex justify-end">
        <button onClick={handleSave}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[11px] font-black transition-all"
          style={{ background: saved ? EM : G, color: saved ? "white" : "#000" }}>
          {saved ? <><Check size={13} /> Enregistré</> : <><Save size={13} /> Enregistrer les modifications</>}
        </button>
      </div>
    </div>
  )
}
