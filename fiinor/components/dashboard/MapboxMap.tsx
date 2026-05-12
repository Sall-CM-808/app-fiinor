"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { createPortal } from "react-dom"
import Map, {
  Marker,
  Popup,
  Source,
  Layer,
  type MapRef,
  type LayerProps,
} from "react-map-gl/mapbox"
import { motion, AnimatePresence } from "framer-motion"
import { X, Minus, Maximize2, Minimize2 } from "lucide-react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

/* ─── Établissements / pins ─── */
export interface MapPin {
  id: string
  label: string
  city: string
  country: string
  longitude: number
  latitude: number
  color: string
  etablissements: number
  rendement: number
  satisfaction: string
  students: string
  delta: string
}

const pins: MapPin[] = [
  {
    id: "conakry",
    label: "Lycée Moderne Conakry",
    city: "Conakry",
    country: "Guinée",
    longitude: -13.6773,
    latitude: 9.5371,
    color: "#C9A84C",
    etablissements: 42,
    rendement: 98.5,
    satisfaction: "98%",
    students: "12 000",
    delta: "+2.1%",
  },
  {
    id: "dakar",
    label: "Institut Supérieur Dakar",
    city: "Dakar",
    country: "Sénégal",
    longitude: -17.4441,
    latitude: 14.6928,
    color: "#F59E0B",
    etablissements: 15,
    rendement: 91.2,
    satisfaction: "93%",
    students: "8 600",
    delta: "+1.8%",
  },
  {
    id: "gam",
    label: "Univ. Gam Al Abdel Nasser",
    city: "Conakry",
    country: "Guinée",
    longitude: -13.5784,
    latitude: 9.6412,
    color: "#10B981",
    etablissements: 28,
    rendement: 88.5,
    satisfaction: "92%",
    students: "28 000",
    delta: "+0.8%",
  },
  {
    id: "usa",
    label: "Réseau Amériques",
    city: "New York",
    country: "USA",
    longitude: -74.006,
    latitude: 40.7128,
    color: "#3B82F6",
    etablissements: 12,
    rendement: 83.9,
    satisfaction: "90%",
    students: "8 000",
    delta: "+1.4%",
  },
  {
    id: "uk",
    label: "Réseau Europe",
    city: "Londres",
    country: "UK",
    longitude: -0.1276,
    latitude: 51.5074,
    color: "#8B5CF6",
    etablissements: 8,
    rendement: 91.2,
    satisfaction: "94%",
    students: "5 000",
    delta: "+0.9%",
  },
  {
    id: "uae",
    label: "Aether Int. School",
    city: "Dubaï",
    country: "Émirats Arabes",
    longitude: 55.2708,
    latitude: 25.2048,
    color: "#10B981",
    etablissements: 6,
    rendement: 93.1,
    satisfaction: "95%",
    students: "3 200",
    delta: "+1.2%",
  },
]

/* ─── Lignes de connexion GeoJSON ─── */
function buildConnectionsGeoJSON(pinsData: MapPin[]) {
  const pinMap = Object.fromEntries(pinsData.map((p) => [p.id, p]))
  const pairs = [
    ["conakry", "uk"],
    ["conakry", "usa"],
    ["conakry", "uae"],
    ["dakar", "uk"],
    ["gam", "uae"],
  ]
  return {
    type: "FeatureCollection" as const,
    features: pairs.map(([a, b]) => ({
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [pinMap[a].longitude, pinMap[a].latitude],
          [pinMap[b].longitude, pinMap[b].latitude],
        ],
      },
      properties: {},
    })),
  }
}

const connectionLineLayer: LayerProps = {
  id: "connections",
  type: "line",
  paint: {
    "line-color": "#C9A84C",
    "line-width": 1.5,
    "line-opacity": 0.5,
    "line-dasharray": [3, 5],
  },
}

/* ─── Scan line overlay ─── */
function ScanLine() {
  return (
    <div className="pointer-events-none absolute inset-0" style={{ zIndex: 5 }}>
      <motion.div
        className="absolute inset-x-0 h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, #C9A84C20 20%, #C9A84C55 50%, #C9A84C20 80%, transparent 100%)",
          boxShadow: "0 0 6px #C9A84C40",
        }}
        initial={{ top: "0%" }}
        animate={{ top: "100%" }}
        transition={{ duration: 5, ease: "linear", repeat: Infinity, repeatDelay: 4 }}
      />
    </div>
  )
}

/* ─── Continent colors (iso_3166_1_alpha_3 → continent fill) ─── */
const AFRICA_COUNTRIES = ["DZA","AGO","BEN","BWA","BFA","BDI","CPV","CMR","CAF","TCD","COM","COD","COG","CIV","DJI","EGY","GNQ","ERI","SWZ","ETH","GAB","GMB","GHA","GIN","GNB","KEN","LSO","LBR","LBY","MDG","MWI","MLI","MRT","MUS","MYT","MAR","MOZ","NAM","NER","NGA","REU","RWA","SHN","STP","SEN","SYC","SLE","SOM","ZAF","SDN","SSD","TZA","TGO","TUN","UGA","ESH","ZMB","ZWE"]
const EUROPE_COUNTRIES = ["ALB","AND","AUT","BLR","BEL","BIH","BGR","HRV","CYP","CZE","DNK","EST","FIN","FRA","DEU","GRC","HUN","ISL","IRL","ITA","XKX","LVA","LIE","LTU","LUX","MLT","MDA","MCO","MNE","NLD","MKD","NOR","POL","PRT","ROU","RUS","SMR","SRB","SVK","SVN","ESP","SWE","CHE","UKR","GBR","VAT"]
const ASIA_COUNTRIES = ["AFG","ARM","AZE","BHR","BGD","BTN","BRN","KHM","CHN","GEO","IND","IDN","IRN","IRQ","ISR","JPN","JOR","KAZ","KWT","KGZ","LAO","LBN","MYS","MDV","MNG","MMR","NPL","PRK","OMN","PAK","PHL","QAT","SAU","SGP","KOR","LKA","SYR","TWN","TJK","THA","TLS","TUR","TKM","ARE","UZB","VNM","YEM"]
const AMERICAS_COUNTRIES = ["ATG","ARG","BHS","BRB","BLZ","BOL","BRA","CAN","CHL","COL","CRI","CUB","DMA","DOM","ECU","SLV","GRD","GTM","GUY","HTI","HND","JAM","MEX","NIC","PAN","PRY","PER","KNA","LCA","VCT","SUR","TTO","USA","URY","VEN"]
const OCEANIA_COUNTRIES = ["AUS","FJI","KIR","MHL","FSM","NRU","NZL","PLW","PNG","WSM","SLB","TON","TUV","VUT"]

const countryFillLayer: LayerProps = {
  id: "country-fills",
  type: "fill",
  "source-layer": "country_boundaries",
  paint: {
    "fill-color": [
      "match",
      ["get", "iso_3166_1_alpha_3"],
      AFRICA_COUNTRIES,   "#1B4D3E",
      EUROPE_COUNTRIES,   "#1E3A5F",
      ASIA_COUNTRIES,     "#2D3561",
      AMERICAS_COUNTRIES, "#1A3A54",
      OCEANIA_COUNTRIES,  "#1E4A3A",
      "#152535"
    ],
    "fill-opacity": 0.95,
  },
}

const countryBorderLayer: LayerProps = {
  id: "country-borders",
  type: "line",
  "source-layer": "country_boundaries",
  paint: {
    "line-color": "#2A6080",
    "line-width": 0.5,
    "line-opacity": 0.5,
  },
}

/* ─── Score → halo color ─── */
function scoreColor(rendement: number) {
  if (rendement >= 90) return "#10B981"
  if (rendement >= 75) return "#C9A84C"
  return "#EF4444"
}

/* ─── Pulse ring — sized and colored by score ─── */
function PulseRing({ rendement }: { rendement: number }) {
  const col = scoreColor(rendement)
  const size = rendement >= 90 ? 28 : rendement >= 75 ? 24 : 20
  return (
    <>
      <span className="pointer-events-none absolute rounded-full" style={{
        width: size, height: size,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        boxShadow: `0 0 0 0 ${col}80`,
        animation: "pulse-ring 2s ease-out infinite",
      }} />
      <span className="pointer-events-none absolute rounded-full opacity-20" style={{
        width: size * 1.8, height: size * 1.8,
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        backgroundColor: col,
        filter: "blur(6px)",
      }} />
    </>
  )
}

/* ─── Single marker ─── */
function PinMarker({
  pin,
  onClick,
  active,
}: {
  pin: MapPin
  onClick: (pin: MapPin) => void
  active: boolean
}) {
  const sc = scoreColor(pin.rendement)
  return (
    <Marker longitude={pin.longitude} latitude={pin.latitude} anchor="center">
      <motion.div
        onClick={() => onClick(pin)}
        whileHover={{ scale: 1.4 }}
        whileTap={{ scale: 0.85 }}
        animate={active ? { scale: [1, 1.3, 1], transition: { duration: 0.4 } } : {}}
        className="relative cursor-pointer"
        style={{ width: 22, height: 22 }}
      >
        <PulseRing rendement={pin.rendement} />
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{
            backgroundColor: pin.color,
            borderColor: sc,
            boxShadow: active
              ? `0 0 0 4px ${sc}40, 0 0 16px ${sc}80`
              : `0 0 8px ${pin.color}80`,
            transform: active ? "scale(1.4)" : "scale(1)",
            transition: "all 0.25s ease",
          }}
        />
        {/* Score badge */}
        <div className="pointer-events-none absolute" style={{
          top: -14, left: "50%", transform: "translateX(-50%)",
          fontSize: 7, fontFamily: "monospace", fontWeight: 700,
          color: sc, whiteSpace: "nowrap",
          textShadow: `0 0 6px ${sc}`,
          opacity: active ? 1 : 0.7,
        }}>
          {pin.rendement}%
        </div>
      </motion.div>
    </Marker>
  )
}

/* ─── Sub-units tab component ─── */
type SubUnit = { name: string; score: number; trend: string; effectif: number }
function SubUnitsTab({ subUnits, pin, sc }: { subUnits: SubUnit[]; pin: MapPin; sc: string }) {
  const [sortKey, setSortKey] = useState<"score" | "trend" | "effectif">("score")
  const [filter, setFilter] = useState<"all" | "ok" | "warn" | "crit">("all")
  const [expandedSub, setExpandedSub] = useState<string | null>(null)

  const sorted = [...subUnits]
    .filter(u => filter === "all" || (filter === "ok" && u.score >= 90) || (filter === "warn" && u.score >= 75 && u.score < 90) || (filter === "crit" && u.score < 75))
    .sort((a, b) => sortKey === "trend" ? parseFloat(b.trend) - parseFloat(a.trend) : sortKey === "effectif" ? b.effectif - a.effectif : b.score - a.score)

  return (
    <div className="px-4 py-3">
      <div className="mb-3 flex items-center gap-2 flex-wrap">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-white/25 mr-1">{sorted.length} unités</span>
        <div className="flex gap-1">
          {(["all", "ok", "warn", "crit"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full px-2 py-0.5 text-[9px] transition-all ${filter === f ? "text-white" : "text-white/30 hover:text-white/50"}`}
              style={{
                backgroundColor: filter === f ? (f === "ok" ? "#10B98130" : f === "warn" ? "#C9A84C30" : f === "crit" ? "#EF444430" : "rgba(255,255,255,0.08)") : "transparent",
                border: `1px solid ${filter === f ? (f === "ok" ? "#10B981" : f === "warn" ? "#C9A84C" : f === "crit" ? "#EF4444" : "rgba(255,255,255,0.2)") : "rgba(255,255,255,0.06)"}`,
              }}>
              {f === "all" ? "Tous" : f === "ok" ? "✓ Bons" : f === "warn" ? "⚠ Moyens" : "✕ Critiques"}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          {(["score", "trend", "effectif"] as const).map(k => (
            <button key={k} onClick={() => setSortKey(k)}
              className={`rounded px-2 py-0.5 text-[9px] transition-all ${sortKey === k ? "bg-white/10 text-white" : "text-white/30 hover:text-white/50"}`}>
              {k === "score" ? "Score ↓" : k === "trend" ? "Tendance ↓" : "Effectif ↓"}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        {sorted.map((u, idx) => {
          const usc = scoreColor(u.score)
          const isExp = expandedSub === u.name
          return (
            <div key={u.name} className="rounded-lg border border-white/5 overflow-hidden"
              style={{ borderColor: isExp ? `${usc}30` : undefined }}>
              <div className="flex items-center gap-3 bg-white/3 px-3 py-2.5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpandedSub(isExp ? null : u.name)}>
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
                  style={{ backgroundColor: `${usc}15`, color: usc }}>#{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-semibold text-white truncate">{u.name}</div>
                  <div className="mt-0.5 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${u.score}%`, backgroundColor: usc }} />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[12px] font-bold tabular-nums" style={{ color: usc }}>{u.score}</div>
                  <div className="text-[9px]" style={{ color: u.trend.startsWith("+") ? "#10B981" : "#EF4444" }}>{u.trend}</div>
                </div>
                <div className="shrink-0 text-[9px] text-white/25 w-20 text-right">{u.effectif.toLocaleString()} étu.</div>
                <span className="text-white/20 text-[10px]">{isExp ? "▲" : "▼"}</span>
              </div>
              {isExp && (
                <div className="grid grid-cols-3 gap-2 bg-white/2 px-3 py-2.5 border-t border-white/5">
                  {[
                    { label: "Score",       val: `${u.score}%`,                                          color: usc },
                    { label: "Tendance",    val: u.trend,                                                color: u.trend.startsWith("+") ? "#10B981" : "#EF4444" },
                    { label: "Effectif",    val: u.effectif.toLocaleString(),                            color: "rgba(255,255,255,0.6)" },
                    { label: "Rang réseau", val: `#${idx + 1}`,                                          color: "rgba(255,255,255,0.4)" },
                    { label: "Statut",      val: u.score >= 90 ? "Excellent" : u.score >= 75 ? "Correct" : "Critique", color: usc },
                    { label: "Parent",      val: pin.city,                                               color: sc },
                  ].map(d => (
                    <div key={d.label} className="rounded-md bg-white/3 px-2 py-1.5">
                      <div className="text-[7px] text-white/25 uppercase tracking-wider">{d.label}</div>
                      <div className="text-[10px] font-bold mt-0.5" style={{ color: d.color }}>{d.val}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
        {sorted.length === 0 && <div className="py-8 text-center text-[11px] text-white/15">Aucune sous-unité pour ce filtre</div>}
      </div>
    </div>
  )
}

/* ─── Edit tab component ─── */
type EditVals = { label: string; city: string; rendement: string; delta: string }
function EditTab({ pin, sc, editVals, setEditVals, saved, setSaved }: {
  pin: MapPin; sc: string
  editVals: EditVals; setEditVals: React.Dispatch<React.SetStateAction<EditVals>>
  saved: boolean; setSaved: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [log, setLog] = useState<{ time: string; field: string; from: string; to: string }[]>([])
  const [status, setStatus] = useState("Actif")
  const [priority, setPriority] = useState("Normal")

  function saveEdit() {
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    const origMap: Record<string, string> = { label: pin.label, city: pin.city, rendement: String(pin.rendement), delta: pin.delta }
    const changes = (Object.keys(origMap) as (keyof EditVals)[])
      .filter(k => editVals[k] !== origMap[k])
      .map(k => ({ time: now, field: k, from: origMap[k], to: editVals[k] }))
    if (changes.length) setLog(l => [...changes, ...l].slice(0, 8))
    setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="flex gap-0 h-full">
      <div className="flex-1 px-4 py-3 overflow-auto">
        <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-white/25">Informations générales</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          {[
            { label: "Nom de l'unité",  key: "label",        type: "text",   span: 2 },
            { label: "Ville",           key: "city",         type: "text" },
            { label: "Pays",            key: "country",      type: "text",   fixed: pin.country },
            { label: "Score (%)",       key: "rendement",    type: "number" },
            { label: "Tendance",        key: "delta",        type: "text" },
            { label: "Satisfaction",    key: "satisfaction", type: "text",   fixed: pin.satisfaction },
            { label: "Étudiants",       key: "students",     type: "text",   fixed: pin.students },
          ].map(f => (
            <div key={f.key} className={f.span === 2 ? "col-span-2" : ""}>
              <label className="mb-1 block text-[9px] text-white/35">{f.label}</label>
              <input type={f.type}
                value={f.fixed ?? editVals[f.key as keyof EditVals] ?? ""}
                readOnly={!!f.fixed}
                onChange={e => !f.fixed && setEditVals(v => ({ ...v, [f.key]: e.target.value }))}
                className={`w-full rounded-lg border px-3 py-2 text-[11px] text-white outline-none transition-colors ${f.fixed ? "border-white/5 bg-white/3 text-white/30 cursor-default" : "border-white/10 bg-white/5 focus:border-white/25"}`}
              />
            </div>
          ))}
        </div>
        <div className="mb-3 text-[9px] font-semibold uppercase tracking-widest text-white/25">Paramètres</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-[9px] text-white/35">Statut</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white outline-none">
              {["Actif", "Suspendu", "En révision", "Archivé"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[9px] text-white/35">Priorité</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white outline-none">
              {["Critique", "Haute", "Normal", "Basse"].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button onClick={saveEdit} className="flex-1 rounded-lg py-2 text-[11px] font-semibold transition-all"
            style={{ backgroundColor: `${sc}25`, color: sc, border: `1px solid ${sc}40` }}>
            {saved ? "✓ Sauvegardé" : "Sauvegarder les modifications"}
          </button>
          <button onClick={() => setEditVals({ label: pin.label, city: pin.city, rendement: String(pin.rendement), delta: pin.delta })}
            className="rounded-lg border border-white/10 px-4 py-2 text-[11px] text-white/40 hover:text-white/70 transition-colors">
            Réinitialiser
          </button>
        </div>
      </div>
      <div className="w-56 shrink-0 border-l border-white/5 px-4 py-3 flex flex-col">
        <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-white/25">Journal des modifications</div>
        {log.length === 0
          ? <div className="flex-1 flex items-center justify-center text-[10px] text-white/15 text-center">Aucune modification<br />depuis l'ouverture</div>
          : <div className="space-y-1.5 overflow-auto">
              {log.map((l, i) => (
                <div key={i} className="rounded-lg border border-white/5 bg-white/3 px-2.5 py-2">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[8px] font-semibold text-white/60">{l.field}</span>
                    <span className="text-[7px] text-white/25">{l.time}</span>
                  </div>
                  <div className="text-[8px] text-white/30 line-through truncate">{l.from}</div>
                  <div className="text-[9px] font-medium truncate" style={{ color: sc }}>{l.to}</div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  )
}

/* ─── Draggable Radar Panel ─── */
const AVG = { rendement: 91, satisfaction: 93, etudiants: 60, etablissements: 50, tendance: 70 }

// Mock sub-units per pin
const SUB_UNITS: Record<string, { name: string; score: number; trend: string; effectif: number }[]> = {
  conakry: [
    { name: "Lycée A. Sékou", score: 97.2, trend: "+1.8%", effectif: 3200 },
    { name: "Collège Central", score: 94.5, trend: "+2.4%", effectif: 2100 },
    { name: "École Primaire Est", score: 91.0, trend: "+0.5%", effectif: 1800 },
  ],
  dakar: [
    { name: "Campus Dakar Nord", score: 93.1, trend: "+1.2%", effectif: 4200 },
    { name: "Institut Tech. Dakar", score: 88.7, trend: "+0.9%", effectif: 2900 },
  ],
  uae: [
    { name: "Faculté d'Ingénierie", score: 94.0, trend: "+1.5%", effectif: 1600 },
    { name: "Faculté de Gestion", score: 92.2, trend: "+0.8%", effectif: 1600 },
  ],
  gam: [
    { name: "Faculté Sciences", score: 86.4, trend: "+0.6%", effectif: 9000 },
    { name: "Faculté Droit", score: 90.1, trend: "+1.1%", effectif: 8200 },
    { name: "École Doctorale", score: 88.9, trend: "+0.4%", effectif: 5000 },
  ],
  uk: [
    { name: "London Campus", score: 92.0, trend: "+1.0%", effectif: 2500 },
    { name: "Manchester Branch", score: 89.5, trend: "+0.7%", effectif: 1800 },
  ],
  usa: [
    { name: "New York Hub", score: 85.1, trend: "+1.5%", effectif: 3800 },
    { name: "Boston Center", score: 82.7, trend: "+1.3%", effectif: 2500 },
  ],
}

function buildAxes(p: MapPin) {
  return [
    { label: "Rendement",      val: p.rendement,                                                             avg: AVG.rendement },
    { label: "Satisfaction",   val: parseFloat(p.satisfaction),                                              avg: AVG.satisfaction },
    { label: "Étudiants",      val: Math.min((parseInt(p.students.replace(/\s/g, "")) / 30000) * 100, 100), avg: AVG.etudiants },
    { label: "Établissements", val: Math.min((p.etablissements / 50) * 100, 100),                            avg: AVG.etablissements },
    { label: "Tendance",       val: Math.min((parseFloat(p.delta) / 3) * 100, 100),                          avg: AVG.tendance },
  ]
}

function RadarSVG({ pin, comparePin, width, height }: { pin: MapPin; comparePin: MapPin | null; width: number; height: number }) {
  const sc = scoreColor(pin.rendement)
  const axes = buildAxes(pin)
  const cmpAxes = comparePin ? buildAxes(comparePin) : null
  const cmpSc = comparePin ? scoreColor(comparePin.rendement) : null
  const N = axes.length
  const R = Math.min(width, height) * 0.3
  const cx = width / 2, cy = height / 2

  function polygon(vals: number[]) {
    return axes.map((_, i) => {
      const a = (Math.PI * 2 * i) / N - Math.PI / 2
      const v = (vals[i] / 100) * R
      return `${cx + Math.cos(a) * v},${cy + Math.sin(a) * v}`
    }).join(" ")
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {[0.25, 0.5, 0.75, 1].map(t => (
        <polygon key={t} points={polygon(axes.map(() => t * 100))}
          fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const a = (Math.PI * 2 * i) / N - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R}
          stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      })}
      {/* Avg */}
      <polygon points={polygon(axes.map(a => a.avg))}
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3" />
      {/* Compare pin */}
      {cmpAxes && cmpSc && (
        <>
          <polygon points={polygon(cmpAxes.map(a => a.val))}
            fill={`${cmpSc}15`} stroke={cmpSc} strokeWidth="1.5" strokeDasharray="4 2" />
          {cmpAxes.map((a, i) => {
            const ang = (Math.PI * 2 * i) / N - Math.PI / 2
            const v = (a.val / 100) * R
            return <circle key={i} cx={cx + Math.cos(ang) * v} cy={cy + Math.sin(ang) * v}
              r="3" fill={cmpSc} opacity={0.7} />
          })}
        </>
      )}
      {/* Main pin */}
      <polygon points={polygon(axes.map(a => a.val))}
        fill={`${sc}22`} stroke={sc} strokeWidth="2" />
      {axes.map((a, i) => {
        const ang = (Math.PI * 2 * i) / N - Math.PI / 2
        const v = (a.val / 100) * R
        return <circle key={i} cx={cx + Math.cos(ang) * v} cy={cy + Math.sin(ang) * v}
          r="3.5" fill={sc} stroke="#070d1a" strokeWidth="1" />
      })}
      {/* Labels */}
      {axes.map((a, i) => {
        const ang = (Math.PI * 2 * i) / N - Math.PI / 2
        const lx = cx + Math.cos(ang) * (R + 20)
        const ly = cy + Math.sin(ang) * (R + 20)
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
          fontSize={Math.max(10, R * 0.13)} fill="rgba(255,255,255,0.5)" fontFamily="monospace">{a.label}</text>
      })}
    </svg>
  )
}

function RadarPanel({ pin, onClose }: { pin: MapPin; onClose: () => void }) {
  const sc = scoreColor(pin.rendement)
  const [pos, setPos] = useState({ x: Math.round(window.innerWidth / 2 - 200), y: Math.round(window.innerHeight / 2 - 220) })
  const [size, setSize] = useState({ w: 400, h: 460 })
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [tab, setTab] = useState<"radar" | "subunits" | "edit" | "nav">("radar")
  const [compareId, setCompareId] = useState<string>("")
  const [editVals, setEditVals] = useState({ label: pin.label, city: pin.city, rendement: String(pin.rendement), delta: pin.delta })
  const [saved, setSaved] = useState(false)
  const prevState = useRef({ pos, size })

  const comparePin = compareId ? pins.find(p => p.id === compareId) ?? null : null
  const subUnits = SUB_UNITS[pin.id] ?? []

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === "INPUT") return
      switch (e.key) {
        case "Escape": onClose(); break
        case "r": case "R": if (maximized) setTab("radar"); break
        case "s": case "S": if (maximized) setTab("subunits"); break
        case "e": case "E": if (maximized) setTab("edit"); break
        case "n": case "N": if (maximized) setTab("nav"); break
        case "Tab": {
          if (!maximized) break
          e.preventDefault()
          const order = ["radar", "subunits", "edit", "nav"] as const
          setTab(prev => order[(order.indexOf(prev) + 1) % order.length])
          break
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [maximized, onClose])

  // Drag
  const dragging = useRef<{ ox: number; oy: number } | null>(null)
  function onDragDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragging.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y }
  }
  function onDragMove(e: React.PointerEvent) {
    if (!dragging.current) return
    setPos({ x: e.clientX - dragging.current.ox, y: e.clientY - dragging.current.oy })
  }
  function onDragUp() { dragging.current = null }

  // Resize
  const resizing = useRef<{ ox: number; oy: number; ow: number; oh: number } | null>(null)
  function onResizeDown(e: React.PointerEvent) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    resizing.current = { ox: e.clientX, oy: e.clientY, ow: size.w, oh: size.h }
  }
  function onResizeMove(e: React.PointerEvent) {
    if (!resizing.current) return
    setSize({
      w: Math.max(340, resizing.current.ow + e.clientX - resizing.current.ox),
      h: Math.max(360, resizing.current.oh + e.clientY - resizing.current.oy),
    })
  }
  function onResizeUp() { resizing.current = null }

  function toggleMaximize() {
    if (maximized) {
      setPos(prevState.current.pos); setSize(prevState.current.size)
    } else {
      prevState.current = { pos, size }
      setPos({ x: 60, y: 60 })
      setSize({ w: window.innerWidth - 120, h: window.innerHeight - 120 })
    }
    setMaximized(v => !v); setMinimized(false)
  }

  const svgW = maximized ? size.w - 340 : size.w - 40
  const svgH = Math.max(180, size.h - (maximized ? 160 : 160))

  const TABS = [
    { id: "radar",    icon: "📊", label: "Radar" },
    { id: "subunits", icon: "🏢", label: "Sous-unités" },
    { id: "edit",     icon: "✏️", label: "Édition" },
    { id: "nav",      icon: "🔗", label: "Navigation" },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.93 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: "fixed", left: pos.x, top: pos.y, width: size.w, zIndex: 9999,
        borderColor: maximized ? `${sc}60` : `${sc}40`,
        background: maximized ? "#08101e" : "rgba(7,13,26,0.98)",
        boxShadow: maximized ? `0 0 0 1px ${sc}30, 0 32px 80px rgba(0,0,0,0.9)` : undefined,
      }}
      className="rounded-xl border select-none"
      onPointerMove={e => { onDragMove(e); onResizeMove(e) }}
      onPointerUp={() => { onDragUp(); onResizeUp() }}
    >
      {/* ── Title bar ── */}
      <div
        className="flex cursor-grab items-center gap-3 rounded-t-xl px-4 active:cursor-grabbing"
        style={{
          borderBottom: `1px solid ${sc}25`,
          background: maximized ? `linear-gradient(90deg, ${sc}18 0%, ${sc}06 60%, transparent 100%)` : `${sc}10`,
          minHeight: maximized ? 56 : 44,
        }}
        onPointerDown={onDragDown}
      >
        {/* Accent dot */}
        {maximized && <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: sc, boxShadow: `0 0 8px ${sc}` }} />}
        <div className="flex-1 min-w-0 pointer-events-none">
          <div className={`truncate font-bold text-white ${maximized ? "text-[15px]" : "text-[12px]"}`}>{pin.label}</div>
          <div className={maximized ? "text-[10px] mt-0.5" : "text-[9px] mt-0.5"} style={{ color: sc }}>📍 {pin.city}, {pin.country}</div>
        </div>
        {/* Score pill */}
        <div className="shrink-0 rounded-full px-3 py-1 font-bold tabular-nums pointer-events-none"
          style={{ backgroundColor: `${sc}20`, color: sc, fontSize: maximized ? 13 : 11, border: `1px solid ${sc}40` }}>
          {pin.rendement}%
        </div>
        <div className="flex items-center gap-1 shrink-0" onPointerDown={e => e.stopPropagation()}>
          <button onClick={() => { setMinimized(v => !v); setMaximized(false) }}
            title={minimized ? "Restaurer" : "Réduire"}
            className="flex size-7 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white transition-all">
            <Minus className="size-3.5" />
          </button>
          <button onClick={toggleMaximize} title={maximized ? "Restaurer" : "Agrandir"}
            className="flex size-7 items-center justify-center rounded-md text-white/40 hover:bg-white/10 hover:text-white transition-all">
            {maximized ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
          <button onClick={onClose} title="Fermer"
            className="flex size-7 items-center justify-center rounded-md text-white/40 hover:bg-red-500/20 hover:text-red-400 transition-all">
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <motion.div animate={{ height: minimized ? 0 : "auto", opacity: minimized ? 0 : 1 }}
        transition={{ duration: 0.2 }} style={{ overflow: "hidden" }}>

        {/* KPI row — always visible */}
        <div className={`grid grid-cols-4 ${maximized ? "gap-3 px-5 pt-4 pb-3" : "gap-1.5 px-3 pt-2.5 pb-2"}`}
          style={{ borderBottom: maximized ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
          {[
            { label: "Étudiants",    val: pin.students },
            { label: "Étab.",        val: String(pin.etablissements) },
            { label: "Satisfaction", val: pin.satisfaction },
            { label: "Tendance",     val: pin.delta, accent: true },
          ].map(s => (
            <div key={s.label} className={`rounded-xl text-center ${
              maximized ? "bg-white/4 border border-white/6 px-3 py-3" : "bg-white/5 px-2 py-1.5"
            }`}>
              <div className={maximized ? "text-[9px] text-white/30 uppercase tracking-widest mb-1" : "text-[8px] text-white/35"}>{s.label}</div>
              <div className={maximized ? "text-[17px] font-bold" : "text-[11px] font-bold"}
                style={{ color: s.accent ? "#10B981" : sc }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Tabs — only in maximized mode */}
        {maximized && (
          <div className="flex gap-0 border-b px-5" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-[11px] font-semibold transition-all border-b-2 -mb-px ${
                  tab === t.id ? "text-white" : "text-white/30 hover:text-white/60 border-transparent"
                }`}
                style={{ borderColor: tab === t.id ? sc : "transparent",
                  background: tab === t.id ? `${sc}08` : "transparent" }}>
                <span className="text-base">{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Tab content ── */}
        <div style={{
          height: maximized ? size.h - 185 : undefined,
          overflow: "auto",
          background: maximized ? "#08101e" : undefined,
        }}>

          {/* ══ RADAR tab ══ */}
          {(!maximized || tab === "radar") && (
            <div className={maximized ? "flex gap-0 h-full" : "px-2 pb-2"}>
              {/* Left: radar */}
              <div className="flex-1 flex flex-col">
                <RadarSVG pin={pin} comparePin={comparePin} width={svgW} height={maximized ? svgH - 90 : svgH} />
                {/* Score history sparkline */}
                {maximized && (() => {
                  const hist = [pin.rendement - 4.2, pin.rendement - 2.8, pin.rendement - 3.5, pin.rendement - 1.2, pin.rendement - 0.5, pin.rendement]
                  const min = Math.min(...hist) - 2, max = Math.max(...hist) + 2
                  const W = svgW, H = 48
                  const pts = hist.map((v, i) => `${(i / (hist.length - 1)) * W},${H - ((v - min) / (max - min)) * H}`).join(" ")
                  return (
                    <div className="px-4 pb-2">
                      <div className="mb-1 text-[8px] font-semibold uppercase tracking-widest text-white/25">Historique 6 mois</div>
                      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
                        <defs>
                          <linearGradient id="hgrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={sc} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={sc} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <polygon points={`0,${H} ${pts} ${W},${H}`} fill="url(#hgrad)" />
                        <polyline points={pts} fill="none" stroke={sc} strokeWidth="1.5" strokeLinejoin="round" />
                        {hist.map((v, i) => {
                          const x = (i / (hist.length - 1)) * W
                          const y = H - ((v - min) / (max - min)) * H
                          return <circle key={i} cx={x} cy={y} r="2.5" fill={sc} />
                        })}
                        {["Nov","Déc","Jan","Fév","Mar","Avr"].map((m, i) => (
                          <text key={m} x={(i / 5) * W} y={H - 2} fontSize="7" fill="rgba(255,255,255,0.25)" textAnchor="middle">{m}</text>
                        ))}
                      </svg>
                    </div>
                  )
                })()}
                {/* Axis score bars */}
                {maximized && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 px-4 pb-3">
                    {buildAxes(pin).map(a => (
                      <div key={a.label}>
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[8px] text-white/35">{a.label}</span>
                          <span className="text-[8px] font-bold tabular-nums" style={{ color: scoreColor(a.val) }}>{a.val.toFixed(0)}</span>
                        </div>
                        <div className="h-1 w-full rounded-full bg-white/5 overflow-hidden">
                          <motion.div className="h-full rounded-full" initial={{ width: 0 }}
                            animate={{ width: `${a.val}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{ backgroundColor: scoreColor(a.val) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right sidebar: compare */}
              {maximized && (
                <div className="w-56 shrink-0 border-l border-white/5 flex flex-col gap-3 px-4 py-3">
                  <div>
                    <div className="mb-1.5 text-[9px] font-semibold uppercase tracking-widest text-white/30">Comparer avec</div>
                    <select value={compareId} onChange={e => setCompareId(e.target.value)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-[11px] text-white/70 outline-none focus:border-white/20">
                      <option value="">— Aucune —</option>
                      {pins.filter(p => p.id !== pin.id).map(p => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                  {comparePin ? (
                    <>
                      <div className="rounded-lg border border-white/5 bg-white/3 px-3 py-2">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[9px] text-white/30">Écart par axe</span>
                          <span className="text-[8px] rounded px-1.5 py-0.5" style={{ backgroundColor: `${scoreColor(comparePin.rendement)}20`, color: scoreColor(comparePin.rendement) }}>{comparePin.city}</span>
                        </div>
                        {buildAxes(pin).map((a, i) => {
                          const cmp = buildAxes(comparePin)[i]
                          const diff = a.val - cmp.val
                          return (
                            <div key={a.label} className="flex items-center gap-2 py-0.5">
                              <span className="w-20 text-[9px] text-white/40 shrink-0">{a.label}</span>
                              <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden relative">
                                <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
                                {diff >= 0
                                  ? <div className="absolute inset-y-0 left-1/2 rounded-r-full" style={{ width: `${Math.min(Math.abs(diff), 50)}%`, backgroundColor: "#10B981" }} />
                                  : <div className="absolute inset-y-0 right-1/2 rounded-l-full" style={{ width: `${Math.min(Math.abs(diff), 50)}%`, backgroundColor: "#EF4444" }} />
                                }
                              </div>
                              <span className="w-8 text-right text-[9px] font-bold tabular-nums shrink-0" style={{ color: diff >= 0 ? "#10B981" : "#EF4444" }}>
                                {diff >= 0 ? "+" : ""}{diff.toFixed(0)}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="rounded-lg border border-white/5 bg-white/3 px-3 py-2 text-[9px]">
                        <div className="text-white/30 mb-1.5">Résumé</div>
                        <div className="flex justify-between"><span className="text-white/40">Score global</span><span className="font-bold" style={{ color: scoreColor(pin.rendement) }}>{pin.rendement}%</span></div>
                        <div className="flex justify-between"><span className="text-white/40">vs {comparePin.city}</span><span className="font-bold" style={{ color: scoreColor(comparePin.rendement) }}>{comparePin.rendement}%</span></div>
                        <div className="mt-1 flex justify-between border-t border-white/5 pt-1">
                          <span className="text-white/30">Différence</span>
                          <span className="font-bold" style={{ color: pin.rendement >= comparePin.rendement ? "#10B981" : "#EF4444" }}>
                            {pin.rendement >= comparePin.rendement ? "+" : ""}{(pin.rendement - comparePin.rendement).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-[10px] text-white/15 text-center px-2">
                      Sélectionne une unité pour superposer son radar
                    </div>
                  )}
                  <div className="mt-auto flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-[9px] text-white/30"><span className="inline-block size-2 rounded-full border border-dashed border-white/30" /> Moy. réseau</div>
                    <div className="flex items-center gap-2 text-[9px]" style={{ color: sc }}><span className="inline-block size-2 rounded-full" style={{ backgroundColor: sc }} /> {pin.city}</div>
                    {comparePin && <div className="flex items-center gap-2 text-[9px]" style={{ color: scoreColor(comparePin.rendement) }}><span className="inline-block size-2 rounded-full border border-dashed" style={{ borderColor: scoreColor(comparePin.rendement) }} /> {comparePin.city}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ SUB-UNITS tab ══ */}
          {maximized && tab === "subunits" && <SubUnitsTab subUnits={subUnits} pin={pin} sc={sc} />}

          {/* ══ EDIT tab ══ */}
          {maximized && tab === "edit" && <EditTab pin={pin} sc={sc} editVals={editVals} setEditVals={setEditVals} saved={saved} setSaved={setSaved} />}

          {/* ══ NAV tab ══ */}
          {maximized && tab === "nav" && (
            <div className="flex gap-0 h-full">
              {/* Actions */}
              <div className="flex-1 px-4 py-3 space-y-2">
                <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-white/25">Actions sur l'unité</div>
                {/* Status banner */}
                <div className="flex items-center gap-3 rounded-lg px-4 py-2.5 mb-3"
                  style={{ backgroundColor: `${sc}12`, border: `1px solid ${sc}25` }}>
                  <span className="size-2 rounded-full animate-pulse" style={{ backgroundColor: sc }} />
                  <span className="text-[11px] font-semibold text-white">Unité active</span>
                  <span className="ml-auto text-[9px]" style={{ color: sc }}>Score {pin.rendement}% · {pin.city}</span>
                </div>
                {[
                  { icon: "🏗️", label: "Voir dans Structure",    sub: "Hiérarchie complète, vue arborescente",       href: "/dashboard/structure", accent: true },
                  { icon: "🗺️", label: "Dashboard principal",    sub: "Vue globale du réseau",                        href: "/dashboard" },
                  { icon: "📈", label: "Rapports & analytics",   sub: "KPIs détaillés, graphiques de performance",    href: "/dashboard" },
                  { icon: "👥", label: "Gestion des utilisateurs",sub: "Accès, rôles, permissions de cette unité",    href: "/dashboard" },
                ].map(a => (
                  <a key={a.label} href={a.href}
                    className="flex items-center gap-3 rounded-lg border px-4 py-3 text-[11px] font-medium text-white hover:bg-white/8 transition-all group"
                    style={{ borderColor: a.accent ? `${sc}30` : "rgba(255,255,255,0.06)", backgroundColor: a.accent ? `${sc}08` : "rgba(255,255,255,0.02)" }}>
                    <span className="text-xl">{a.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold group-hover:text-white transition-colors" style={{ color: a.accent ? sc : "white" }}>{a.label}</div>
                      <div className="text-[9px] text-white/30">{a.sub}</div>
                    </div>
                    <span className="text-white/15 group-hover:text-white/40 transition-colors">→</span>
                  </a>
                ))}
                <div className="pt-1 text-[9px] font-semibold uppercase tracking-widest text-white/25">Export</div>
                <div className="flex gap-2">
                  {[
                    { label: "📄 Export PDF", desc: "Fiche complète" },
                    { label: "📊 Export CSV", desc: "Données brutes" },
                    { label: "🔗 Copier lien", desc: "URL directe" },
                  ].map(e => (
                    <button key={e.label}
                      onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => {})}
                      className="flex-1 rounded-lg border border-white/8 bg-white/3 px-3 py-2 text-center hover:bg-white/6 transition-colors">
                      <div className="text-[10px] font-medium text-white/70">{e.label}</div>
                      <div className="text-[8px] text-white/25">{e.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              {/* Shortcuts + activity */}
              <div className="w-56 shrink-0 border-l border-white/5 px-4 py-3 flex flex-col gap-3">
                <div>
                  <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-white/25">Raccourcis clavier</div>
                  <div className="space-y-1">
                    {[
                      { key: "Esc",   desc: "Fermer" },
                      { key: "Tab",   desc: "Onglet suivant" },
                      { key: "R",     desc: "Radar" },
                      { key: "S",     desc: "Sous-unités" },
                      { key: "E",     desc: "Édition" },
                      { key: "N",     desc: "Navigation" },
                      { key: "⤢",    desc: "Agrandir/réduire" },
                    ].map(k => (
                      <div key={k.key} className="flex items-center gap-2">
                        <kbd className="rounded border border-white/15 bg-white/8 px-2 py-0.5 text-[8px] font-mono text-white/50 min-w-[32px] text-center">{k.key}</kbd>
                        <span className="text-[9px] text-white/35">{k.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/5 pt-3">
                  <div className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-white/25">Activité récente</div>
                  <div className="space-y-1.5">
                    {[
                      { time: "Il y a 2h",  txt: "Score mis à jour" },
                      { time: "Il y a 1j",  txt: "Rapport mensuel généré" },
                      { time: "Il y a 3j",  txt: "Nouveau responsable assigné" },
                      { time: "Il y a 1sem",txt: "Audit qualité effectué" },
                    ].map(a => (
                      <div key={a.txt} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: sc }} />
                        <div>
                          <div className="text-[9px] text-white/50">{a.txt}</div>
                          <div className="text-[7px] text-white/20">{a.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Legend compact */}
        {!maximized && (
          <div className="flex items-center justify-center gap-4 border-t border-white/5 px-3 py-1.5">
            <span className="flex items-center gap-1.5 text-[9px] text-white/30">
              <span className="inline-block size-2 rounded-full border border-dashed border-white/30" /> Moy. réseau
            </span>
            <span className="flex items-center gap-1.5 text-[9px]" style={{ color: sc }}>
              <span className="inline-block size-2 rounded-full" style={{ backgroundColor: sc }} /> {pin.city}
            </span>
          </div>
        )}
      </motion.div>

      {/* Resize handle */}
      {!minimized && !maximized && (
        <div className="absolute bottom-0 right-0 cursor-se-resize" style={{ width: 18, height: 18 }}
          onPointerDown={onResizeDown}>
          <svg width={18} height={18} viewBox="0 0 18 18">
            <line x1="5" y1="16" x2="16" y2="5" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9" y1="16" x2="16" y2="9" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="16" x2="16" y2="13" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </motion.div>
  )
}

/* ─── Popup card ─── */
function PinPopup({ pin, onClose }: { pin: MapPin; onClose: () => void }) {
  return (
    <Popup
      longitude={pin.longitude}
      latitude={pin.latitude}
      anchor="bottom"
      offset={20}
      onClose={onClose}
      closeButton={false}
      className="mapbox-popup-clean"
    >
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="w-52 rounded-xl border border-white/10 bg-[#0D1B2A]/95 p-3 shadow-2xl backdrop-blur-md"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div
            className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold"
            style={{ backgroundColor: `${pin.color}20`, color: pin.color }}
          >
            {pin.label.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[11px] font-semibold leading-tight text-white">
              {pin.label}
            </div>
            <div className="text-[9px] text-white/50">
              {pin.city}, {pin.country}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 text-white/30 transition-colors hover:text-white/70"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-white/10" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "Rendement", val: `${pin.rendement}`, unit: "%" },
            { label: "Satisfaction", val: pin.satisfaction, unit: "" },
            { label: "Étudiants", val: pin.students, unit: "" },
            { label: "Tendance", val: pin.delta, unit: "", accent: true },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-white/5 px-2 py-1.5"
            >
              <div className="text-[8px] text-white/40">{s.label}</div>
              <div
                className="text-[11px] font-bold"
                style={{ color: s.accent ? "#10B981" : pin.color }}
              >
                {s.val}
                {s.unit}
              </div>
            </div>
          ))}
        </div>

        {/* Établissements count */}
        <div className="mt-2 flex items-center justify-between rounded-lg bg-white/5 px-2 py-1.5">
          <span className="text-[8px] text-white/40">Établissements</span>
          <span className="text-[11px] font-bold" style={{ color: pin.color }}>
            {pin.etablissements}
          </span>
        </div>
      </motion.div>
    </Popup>
  )
}

function applyDarkColors(map: mapboxgl.Map) {
  const layers = map.getStyle()?.layers ?? []
  layers.forEach((l) => {
    try {
      if (l.type === "fill" && l.id.startsWith("water")) {
        map.setPaintProperty(l.id, "fill-color", "#071422")
      }
      if (l.type === "background") {
        map.setPaintProperty(l.id, "background-color", "#071422")
      }
    } catch {}
  })
}

const MAP_STYLES = {
  dark:      "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
} as const
type MapMode = keyof typeof MAP_STYLES

/* ─── Inner map — isolated per mode so remount is clean ─── */
function MapInner({ mode, onPinClick, activePin, onClose }: {
  mode: MapMode
  onPinClick: (pin: MapPin) => void
  activePin: MapPin | null
  onClose: () => void
}) {
  const mapRef = useRef<MapRef>(null)
  const connectionsData = buildConnectionsGeoJSON(pins)

  useEffect(() => {
    return () => {
      /* Destroy Mapbox instance before React removes the DOM node */
      const m = mapRef.current?.getMap()
      if (m) { try { m.remove() } catch {} }
    }
  }, [])

  return (
    <>
      <style>{`
        .mapbox-popup-clean .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
          border-radius: 0 !important;
        }
        .mapbox-popup-clean .mapboxgl-popup-tip {
          display: none !important;
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 var(--pulse-color, #C9A84C80); }
          70%  { box-shadow: 0 0 0 10px transparent; }
          100% { box-shadow: 0 0 0 0 transparent; }
        }
      `}</style>

      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 0,
          latitude: 15,
          zoom: 2.2,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={MAP_STYLES[mode]}
        mapboxAccessToken={MAPBOX_TOKEN}
        attributionControl={false}
        onLoad={(e) => {
          if (mode !== "dark") return
          applyDarkColors(e.target)
        }}
      >
        {/* Country fills by continent — dark mode only */}
        {mode === "dark" && (
          <Source
            id="countries"
            type="vector"
            url="mapbox://mapbox.country-boundaries-v1"
          >
            <Layer {...countryFillLayer} />
            <Layer {...countryBorderLayer} />
          </Source>
        )}

        {/* Connection lines */}
        <Source id="connections" type="geojson" data={connectionsData}>
          <Layer {...connectionLineLayer} />
        </Source>

        {/* Pins */}
        {pins.map((pin) => (
          <PinMarker
            key={pin.id}
            pin={pin}
            onClick={onPinClick}
            active={activePin?.id === pin.id}
          />
        ))}

      </Map>
    </>
  )
}

/* ─── Main MapboxMap component ─── */
export function MapboxMap() {
  const [activePin, setActivePin] = useState<MapPin | null>(null)
  const [radarPin, setRadarPin] = useState<MapPin | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<MapMode>("dark")
  const [signalFlash, setSignalFlash] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handlePinClick = useCallback((pin: MapPin) => {
    setActivePin((prev) => (prev?.id === pin.id ? null : pin))
    setRadarPin(pin)
    setSignalFlash(true)
    setTimeout(() => setSignalFlash(false), 600)
  }, [])

  const handleClose = useCallback(() => {
    setActivePin(null)
    setRadarPin(null)
  }, [])

  if (!mounted) return <div className="h-full w-full bg-[#0A1628]" />

  return (
    <div className="relative h-full w-full">
      {/* Scan line */}
      <ScanLine />

      {/* Signal flash overlay */}
      <AnimatePresence>
        {signalFlash && (
          <motion.div
            key="flash"
            className="pointer-events-none absolute inset-0 z-50 rounded-2xl"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ backgroundColor: radarPin ? scoreColor(radarPin.rendement) : "#C9A84C" }}
          />
        )}
      </AnimatePresence>

      {/* Toggle satellite / dark */}
      <div className="absolute right-3 top-3 z-20">
        <button
          onClick={() => setMode((m) => (m === "dark" ? "satellite" : "dark"))}
          className="flex items-center gap-1.5 rounded-full border border-white/20 bg-[#0D1B2A]/80 px-3 py-1.5 text-[10px] font-semibold text-white/70 backdrop-blur-md transition-all hover:border-white/40 hover:text-white"
        >
          {mode === "dark" ? (
            <>
              <span className="inline-block size-2.5 overflow-hidden rounded-sm bg-cover" style={{ backgroundImage: "url('https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/0,20,1.5/20x15?access_token=" + MAPBOX_TOKEN + "')" }} />
              Satellite
            </>
          ) : (
            <>
              <span className="inline-block size-2.5 rounded-sm bg-[#1A3A54]" />
              Carte
            </>
          )}
        </button>
      </div>

      {/* MapInner keyed by mode */}
      <MapInner
        key={mode}
        mode={mode}
        activePin={activePin}
        onPinClick={handlePinClick}
        onClose={handleClose}
      />

      {/* Radar panel — rendered via portal to escape overflow-hidden */}
      {typeof window !== "undefined" && createPortal(
        <AnimatePresence>
          {radarPin && (
            <RadarPanel key={radarPin.id} pin={radarPin} onClose={handleClose} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}
