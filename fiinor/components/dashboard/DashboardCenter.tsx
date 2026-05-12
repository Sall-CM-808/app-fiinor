"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { MapboxMap } from "@/components/dashboard/MapboxMap"
import { DraggableOverlay } from "@/components/dashboard/DraggableOverlay"
import { Badge } from "@/components/ui/badge"
import { RegionRanking } from "@/components/dashboard/RegionRanking"
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel"
import { LayoutGrid } from "lucide-react"

/* ─── Network data ─── */
const networks = [
  { name: "Groupe Conakry",   region: "Guinée",  rendement: 98.5, satisfaction: 98, delta: 29, sign: "up"    as const, color: "#C9A84C" },
  { name: "Groupe Abidjan",   region: "CI",      rendement: 95.9, satisfaction: 92, delta: 5,  sign: "up"    as const, color: "#10B981" },
  { name: "Réseau Dakar",     region: "Sénégal", rendement: 86.5, satisfaction: 92, delta: 3,  sign: "up"    as const, color: "#3B82F6" },
  { name: "Collèges Amériques",region: "USA",    rendement: 83.9, satisfaction: 90, delta: 4,  sign: "up"    as const, color: "#8B5CF6" },
]

/* ─── Establishments ─── */
const establishments = [
  { short: "LM", name: "Lycée Moderne Conakry",            city: "Conakry", flag: "🇬🇳", score: 96.5, color: "#C9A84C", trend: "+2.3%" },
  { short: "AI", name: "Aether Int. School",               city: "Dubaï",   flag: "🇦🇪", score: 93.1, color: "#8B5CF6", trend: "+1.2%" },
  { short: "UG", name: "Univ. Gam Al Abdel Nasser",        city: "Conakry", flag: "🇬🇳", score: 88.5, color: "#10B981", trend: "+0.8%" },
  { short: "IS", name: "Institut Supérieur Dakar",         city: "Dakar",   flag: "🇸🇳", score: 91.2, color: "#3B82F6", trend: "+1.8%" },
]

type PanelId = "reseau" | "etablissements" | "classement" | "notifications"

const PANEL_LABELS: Record<PanelId, string> = {
  reseau:          "Performance Réseau",
  etablissements:  "Établissements",
  classement:      "Classement Région",
  notifications:   "Notifications",
}

export function DashboardCenter() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [containerHeight, setContainerHeight] = useState(540)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      setContainerWidth(el.offsetWidth)
      setContainerHeight(el.offsetHeight)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // md = 768-1023px : right side = Notifications only
  // lg+ = 1024px+   : right side = Classement + Notifications
  const measured = containerWidth > 0
  const isLg = containerWidth >= 1024
  const overlayW = isLg ? 300 : 260
  const rightX = containerWidth - overlayW - 12
  // On md, Notifications sits at top-right; on lg+, Classement is top-right and Notifications below
  const notifY = isLg ? 260 : 12

  const [visible, setVisible] = useState<Record<PanelId, boolean>>({
    reseau:         true,
    etablissements: true,
    classement:     true,
    notifications:  true,
  })
  // On md, Classement is hidden by default but user can manually add it via toolbar
  const [mdClassementForced, setMdClassementForced] = useState(false)

  const close = (id: PanelId) => {
    setVisible((v) => ({ ...v, [id]: false }))
    if (id === "classement") setMdClassementForced(false)
  }
  const show = (id: PanelId) => {
    setVisible((v) => ({ ...v, [id]: true }))
    if (id === "classement" && !isLg) setMdClassementForced(true)
  }

  // showClassement = always on lg+, or when user forced it on md
  const showClassement = visible.classement && (isLg || mdClassementForced)

  // Toolbar: show classement button on md only when it's not currently shown
  const hiddenPanels = (Object.keys(visible) as PanelId[]).filter((id) => {
    if (!visible[id]) return true
    if (id === "classement" && !isLg && !mdClassementForced) return true
    return false
  })

  return (
    <div ref={ref} className="flex w-full flex-col">
      {/* ══ CARTE + OVERLAYS ══ */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-border/50 h-[320px] sm:h-[400px] md:h-[480px] lg:h-[540px]"
      >

        {/* Fond carte */}
        <div className="absolute inset-0">
          <MapboxMap />
        </div>

        {/* Badge centre-haut */}
        <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0D1B2A]/80 px-3 py-1 backdrop-blur-md md:px-4 md:py-1.5">
            <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground md:text-[10px]">
              Présence Mondiale
            </span>
            <Badge className="border-0 bg-[#C9A84C]/15 text-[9px] text-[#C9A84C] md:text-[10px]">Réseau Global</Badge>
          </div>
        </div>

        {/* Legend bottom-center — masquée sur xs */}
        <div className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 sm:block">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0D1B2A]/75 px-3 py-1 backdrop-blur-md md:gap-3 md:px-4 md:py-1.5">
            {[
              { city: "Conakry", color: "#C9A84C" },
              { city: "New York", color: "#3B82F6" },
              { city: "Londres",  color: "#8B5CF6" },
              { city: "Dubaï",   color: "#10B981" },
            ].map((p) => (
              <div key={p.city} className="flex items-center gap-1 text-[9px] text-muted-foreground md:gap-1.5 md:text-[10px]">
                <span className="size-1.5 rounded-full md:size-2" style={{ backgroundColor: p.color }} />
                {p.city}
              </div>
            ))}
          </div>
        </div>

        {/* ══ OVERLAYS draggables — md et plus uniquement ══ */}
        <div className="hidden md:block">

          {/* Performance Réseau */}
          {visible.reseau && (
            <DraggableOverlay panelId="reseau" title="Performance Réseau" defaultPosition={{ x: 12, y: 12 }} onClose={() => close("reseau")} width={overlayW} containerWidth={containerWidth} containerHeight={containerHeight}>
              <div className="px-2.5 pb-2 pt-1">
                <div className="space-y-1">
                  {networks.map((net, i) => (
                    <motion.div
                      key={net.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-md bg-white/5 px-2 py-1"
                    >
                      <div className="h-5 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: net.color }} />
                      <div>
                        <div className="text-[10px] font-semibold leading-tight text-foreground">{net.name}</div>
                        <div className="mt-0.5 flex items-center gap-1">
                          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              className="absolute inset-y-0 left-0 rounded-full"
                              style={{ backgroundColor: net.color }}
                              initial={{ width: 0 }}
                              animate={inView ? { width: `${net.rendement}%` } : { width: 0 }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                          <span className="shrink-0 text-[9px] tabular-nums text-white/60">{net.rendement}</span>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold" style={{ color: net.sign === "up" ? "#10B981" : "#EF4444" }}>
                        {net.sign === "up" ? "+" : ""}{net.delta}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </DraggableOverlay>
          )}

          {/* Établissements */}
          {visible.etablissements && (
            <DraggableOverlay panelId="etablissements" title="Établissements Clés" defaultPosition={{ x: 12, y: 196 }} onClose={() => close("etablissements")} width={overlayW} containerWidth={containerWidth} containerHeight={containerHeight}>
              <div className="px-2.5 pb-2 pt-1">
                <div className="space-y-0.5">
                  {establishments.map((est, i) => (
                    <motion.div
                      key={est.short}
                      initial={{ opacity: 0, x: -10 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + i * 0.07, duration: 0.35 }}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 transition-colors hover:bg-white/5"
                    >
                      <div
                        className="flex size-6 shrink-0 items-center justify-center rounded-md text-[9px] font-bold"
                        style={{ backgroundColor: `${est.color}20`, color: est.color }}
                      >
                        {est.short}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[10px] font-semibold text-foreground">{est.name}</div>
                        <div className="text-[8px] text-muted-foreground">{est.flag} {est.city}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[11px] font-bold" style={{ color: est.color }}>{est.score}</div>
                        <div className="text-[8px] text-[#10B981]">{est.trend}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </DraggableOverlay>
          )}

          {/* Classement par Région — lg+ par défaut, md si forcé par l'utilisateur */}
          {showClassement && measured && (
            <DraggableOverlay panelId="classement" title="Classement par Région" defaultPosition={{ x: rightX, y: 12 }} onClose={() => close("classement")} width={overlayW} containerWidth={containerWidth} containerHeight={containerHeight}>
              <RegionRanking />
            </DraggableOverlay>
          )}

          {/* Notifications — toujours visible md+ */}
          {visible.notifications && measured && (
            <DraggableOverlay panelId="notifications" title="Notifications" defaultPosition={{ x: rightX, y: notifY }} onClose={() => close("notifications")} width={overlayW} containerWidth={containerWidth} containerHeight={containerHeight}>
              <NotificationsPanel />
            </DraggableOverlay>
          )}

          {/* Toolbar re-show */}
          {hiddenPanels.length > 0 && (
            <div className="absolute bottom-10 left-1/2 z-30 -translate-x-1/2">
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0D1B2A]/90 px-3 py-1.5 backdrop-blur-md">
                <LayoutGrid className="size-3 text-white/40" />
                {hiddenPanels.map((id) => (
                  <button
                    key={id}
                    onClick={() => show(id)}
                    className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/50 transition-colors hover:border-white/30 hover:text-white/80"
                  >
                    + {PANEL_LABELS[id]}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>{/* end overlays md */}
      </div>{/* end carte */}

      {/* ══ MOBILE ONLY — données en cartes scrollables sous la carte ══ */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:hidden">

        {/* Performance Réseau */}
        <div className="rounded-xl border border-white/10 bg-card/60 p-3 backdrop-blur-md">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Performance par Réseau</p>
          <div className="space-y-2">
            {networks.map((net) => (
              <div key={net.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-lg bg-white/5 px-2.5 py-2">
                <div className="h-6 w-[3px] shrink-0 rounded-full" style={{ backgroundColor: net.color }} />
                <div>
                  <div className="text-[11px] font-semibold text-foreground">{net.name}</div>
                  <div className="mt-0.5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full" style={{ width: `${net.rendement}%`, backgroundColor: net.color }} />
                  </div>
                </div>
                <span className="text-[10px] font-bold" style={{ color: "#10B981" }}>+{net.delta}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Établissements */}
        <div className="rounded-xl border border-white/10 bg-card/60 p-3 backdrop-blur-md">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Établissements Clés</p>
          <div className="space-y-1.5">
            {establishments.map((est) => (
              <div key={est.short} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/5">
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold"
                  style={{ backgroundColor: `${est.color}20`, color: est.color }}
                >
                  {est.short}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-semibold text-foreground">{est.name}</div>
                  <div className="text-[9px] text-muted-foreground">{est.flag} {est.city}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[11px] font-bold" style={{ color: est.color }}>{est.score}</div>
                  <div className="text-[9px] text-[#10B981]">{est.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classement + Notifications pleine largeur sur mobile */}
        <div className="sm:col-span-2">
          <RegionRanking />
        </div>
        <div className="sm:col-span-2">
          <NotificationsPanel />
        </div>

      </div>{/* end mobile cards */}
    </div>
  )
}
