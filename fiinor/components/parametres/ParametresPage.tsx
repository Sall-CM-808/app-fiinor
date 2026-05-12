"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building2, Users, FlaskConical, FileText, Shield, Link2, Settings2 } from "lucide-react"
import { EtablissementPage }  from "./EtablissementPage"
import { UtilisateursPage }   from "./UtilisateursPage"
import { FormulesPage }       from "./FormulesPage"
import { BulletinsPage }      from "./BulletinsPage"
import { SecuritePage }       from "./SecuritePage"
import { AffiliationPage }    from "./AffiliationPage"

const G = "#C9A84C"

type TabId = "etablissement" | "utilisateurs" | "formules" | "bulletins" | "securite" | "affiliation"

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "etablissement",  label: "Établissement",    icon: Building2     },
  { id: "utilisateurs",   label: "Utilisateurs",     icon: Users         },
  { id: "formules",       label: "Formules",         icon: FlaskConical  },
  { id: "bulletins",      label: "Bulletins",        icon: FileText      },
  { id: "securite",       label: "Sécurité",         icon: Shield        },
  { id: "affiliation",    label: "Affiliation",      icon: Link2         },
]

export function ParametresPage() {
  const [tab, setTab] = useState<TabId>("etablissement")

  const content: Record<TabId, React.ReactNode> = {
    etablissement: <EtablissementPage />,
    utilisateurs:  <UtilisateursPage />,
    formules:      <FormulesPage />,
    bulletins:     <BulletinsPage />,
    securite:      <SecuritePage />,
    affiliation:   <AffiliationPage />,
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 32 }}
        className="flex items-center gap-3">
        <div className="rounded-xl p-2" style={{ background: `${G}12`, border: `1px solid ${G}25` }}>
          <Settings2 size={16} style={{ color: G }} />
        </div>
        <div>
          <h1 className="text-[20px] font-black text-white tracking-tight leading-none">Paramètres</h1>
          <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            Configuration de la plateforme · Tenant : Université de Conakry
          </p>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
        className="flex items-center gap-1 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
        {TABS.map(t => {
          const Icon   = t.icon
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold transition-all relative"
              style={active
                ? { background: `${G}15`, color: G, border: `1px solid ${G}30` }
                : { background: "transparent", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <Icon size={12} />
              {t.label}
              {active && (
                <motion.div layoutId="param-tab-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                  style={{ background: G }} />
              )}
            </button>
          )
        })}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.17, ease: "easeOut" }}>
          {content[tab]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
