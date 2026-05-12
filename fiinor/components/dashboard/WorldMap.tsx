"use client"

import { useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { MapPin, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/* ─── Pin data — positions en % du viewBox 1000×500 ─── */
const pins = [
  {
    id: "conakry",
    label: "Lycée Moderne Conakry",
    city: "Conakry",
    country: "Guinée",
    x: 38.5,
    y: 54.5,
    etablissements: 42,
    rendement: 98.5,
    satisfaction: "98%",
    delta: "+2.3%",
    color: "#C9A84C",
    flag: "🇬🇳",
  },
  {
    id: "dakar",
    label: "Institut Supérieur Dakar",
    city: "Dakar",
    country: "Sénégal",
    x: 35.2,
    y: 51.8,
    etablissements: 18,
    rendement: 88.5,
    satisfaction: "92%",
    delta: "+0.2%",
    color: "#10B981",
    flag: "🇸🇳",
  },
  {
    id: "abidjan",
    label: "Université Gam Al Abdel Nasser",
    city: "Abidjan",
    country: "Côte d'Ivoire",
    x: 40.2,
    y: 56.2,
    etablissements: 27,
    rendement: 95.9,
    satisfaction: "95%",
    delta: "+0.5%",
    color: "#3B82F6",
    flag: "🇨🇮",
  },
  {
    id: "uk",
    label: "UK Campus",
    city: "Londres",
    country: "Royaume-Uni",
    x: 47.4,
    y: 23.5,
    etablissements: 6,
    rendement: 91.2,
    satisfaction: "94%",
    delta: "+1.1%",
    color: "#8B5CF6",
    flag: "🇬🇧",
  },
  {
    id: "uae",
    label: "Aether Int. School UAE",
    city: "Dubaï",
    country: "Émirats Arabes",
    x: 63.8,
    y: 44.5,
    etablissements: 4,
    rendement: 93.1,
    satisfaction: "96%",
    delta: "+0.9%",
    color: "#F59E0B",
    flag: "🇦🇪",
  },
  {
    id: "usa",
    label: "Collèges Amériques",
    city: "New York",
    country: "États-Unis",
    x: 21.5,
    y: 34.5,
    etablissements: 3,
    rendement: 83.9,
    satisfaction: "90%",
    delta: "+0.3%",
    color: "#EF4444",
    flag: "🇺🇸",
  },
]

/* ─── Connection lines between pins ─── */
const connections = [
  { from: "conakry", to: "dakar" },
  { from: "conakry", to: "abidjan" },
  { from: "conakry", to: "uk" },
  { from: "conakry", to: "uae" },
  { from: "conakry", to: "usa" },
]

function getPinCoords(id: string) {
  const p = pins.find((pin) => pin.id === id)!
  return { x: (p.x / 100) * 1000, y: (p.y / 100) * 500 }
}

/* ─── Tooltip card ─── */
function PinTooltip({
  pin,
  onClose,
}: {
  pin: (typeof pins)[0]
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 8 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 28 }}
      className="absolute z-30 w-52 rounded-xl border border-border bg-card/95 p-3 shadow-2xl backdrop-blur-sm"
      style={{
        left: `calc(${pin.x}% + 14px)`,
        top: `calc(${pin.y}% - 30px)`,
        maxWidth: "calc(100% - 20px)",
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base">{pin.flag}</span>
            <span className="text-xs font-semibold text-foreground">{pin.city}</span>
          </div>
          <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
            {pin.label}
          </p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5">
        <div className="rounded-lg bg-muted/50 p-1.5 text-center">
          <div className="text-[11px] font-bold text-foreground">{pin.etablissements}</div>
          <div className="text-[9px] text-muted-foreground">Établ.</div>
        </div>
        <div className="rounded-lg bg-muted/50 p-1.5 text-center">
          <div className="text-[11px] font-bold text-foreground">{pin.rendement}</div>
          <div className="text-[9px] text-muted-foreground">Rendemt</div>
        </div>
        <div className="rounded-lg bg-muted/50 p-1.5 text-center">
          <div className="text-[11px] font-bold" style={{ color: pin.color }}>
            {pin.delta}
          </div>
          <div className="text-[9px] text-muted-foreground">Δ</div>
        </div>
      </div>
      {/* Satisfaction */}
      <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Satisfaction</span>
        <span className="font-semibold text-[#10B981]">{pin.satisfaction}</span>
      </div>
      {/* Arrow pointer */}
      <div
        className="absolute -left-1.5 top-5 size-3 rotate-45 rounded-sm border-b border-l border-border bg-card/95"
      />
    </motion.div>
  )
}

/* ─── Main WorldMap component ─── */
export function WorldMap({ fillHeight = false }: { fillHeight?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const [activePin, setActivePin] = useState<string | null>(null)

  const activePinData = pins.find((p) => p.id === activePin) ?? null

  return (
    <Card ref={ref} className={`relative overflow-hidden border-border/50 bg-card${fillHeight ? " flex h-full flex-col" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Présence Mondiale — Établissements Clés
            </CardTitle>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              6 zones géographiques · 100 établissements partenaires
            </p>
          </div>
          <Badge className="border-0 bg-[#C9A84C]/10 text-[11px] text-gold">
            Réseau Global
          </Badge>
        </div>
      </CardHeader>

      <CardContent className={`p-0 pb-2${fillHeight ? " flex-1" : ""}`}>
        {/* Map container */}
        <div className={`relative mx-2 overflow-hidden rounded-xl bg-[#0D1B2A]${fillHeight ? " h-full min-h-[320px]" : ""}`}>
          <svg
            viewBox="0 0 1000 500"
            className="w-full"
            style={{ display: "block" }}
          >
            {/* Ocean */}
            <rect width="1000" height="500" fill="#0D1B2A" />

            {/* Grid lines (latitude/longitude effect) */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line
                key={`h${i}`}
                x1="0"
                y1={i * 55.5}
                x2="1000"
                y2={i * 55.5}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 19 }).map((_, i) => (
              <line
                key={`v${i}`}
                x1={i * 55.5}
                y1="0"
                x2={i * 55.5}
                y2="500"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
            ))}

            {/* ── Continents (simplified paths) ── */}
            {/* North America */}
            <path
              d="M 80 80 L 200 70 L 240 90 L 250 120 L 230 150 L 220 180 L 200 200 L 180 220 L 160 250 L 140 270 L 120 260 L 100 240 L 80 220 L 70 190 L 60 160 L 65 130 L 70 100 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* Central America */}
            <path
              d="M 160 250 L 180 260 L 185 280 L 170 295 L 155 290 L 148 270 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* South America */}
            <path
              d="M 155 290 L 180 285 L 220 300 L 250 340 L 260 390 L 240 440 L 210 460 L 180 450 L 160 420 L 145 380 L 140 330 L 145 300 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* Europe */}
            <path
              d="M 440 60 L 490 55 L 520 70 L 530 90 L 520 110 L 500 120 L 480 130 L 460 125 L 445 110 L 435 90 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* UK separate */}
            <path
              d="M 462 95 L 475 88 L 480 100 L 472 112 L 462 108 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* Africa */}
            <path
              d="M 360 160 L 420 150 L 460 170 L 470 210 L 460 260 L 450 310 L 440 360 L 420 400 L 395 420 L 370 415 L 350 390 L 340 350 L 335 300 L 330 250 L 335 210 L 345 180 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* Middle East / Arabian Peninsula */}
            <path
              d="M 520 160 L 570 155 L 620 170 L 640 200 L 630 230 L 610 240 L 580 235 L 555 220 L 530 200 L 520 180 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* Asia */}
            <path
              d="M 570 55 L 700 50 L 820 60 L 870 90 L 880 130 L 860 170 L 820 190 L 780 200 L 740 210 L 700 200 L 660 190 L 630 170 L 610 150 L 590 130 L 580 100 L 570 75 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* India */}
            <path
              d="M 650 200 L 680 195 L 695 230 L 685 270 L 665 285 L 645 270 L 638 240 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* Southeast Asia */}
            <path
              d="M 760 200 L 820 200 L 850 220 L 840 250 L 810 260 L 775 255 L 755 235 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />
            {/* Australia */}
            <path
              d="M 780 310 L 860 300 L 900 330 L 910 380 L 880 420 L 830 430 L 790 410 L 770 370 L 770 340 Z"
              fill="#1E3A5F"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.8"
            />

            {/* ── Animated connection lines ── */}
            {connections.map((conn, i) => {
              const from = getPinCoords(conn.from)
              const to = getPinCoords(conn.to)
              const pinData = pins.find((p) => p.id === conn.to)!
              return (
                <motion.line
                  key={`${conn.from}-${conn.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={pinData.color}
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  opacity={0}
                  animate={inView ? { opacity: [0, 0.5, 0.2] } : {}}
                  transition={{
                    delay: 1 + i * 0.15,
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                />
              )
            })}

            {/* ── Pins ── */}
            {pins.map((pin, i) => {
              const cx = (pin.x / 100) * 1000
              const cy = (pin.y / 100) * 500
              const isActive = activePin === pin.id

              return (
                <g
                  key={pin.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => setActivePin(isActive ? null : pin.id)}
                >
                  {/* Pulse ring */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={14}
                    fill="none"
                    stroke={pin.color}
                    strokeWidth="1"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={
                      inView
                        ? {
                            opacity: [0.6, 0],
                            scale: [1, 2.2],
                          }
                        : {}
                    }
                    transition={{
                      delay: 0.6 + i * 0.12,
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                    }}
                  />
                  {/* Pin dot */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={isActive ? 9 : 7}
                    fill={pin.color}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      type: "spring" as const,
                      stiffness: 350,
                      damping: 20,
                    }}
                  />
                  {/* Flag label */}
                  <motion.text
                    x={cx + 11}
                    y={cy - 7}
                    fontSize="9"
                    fill="rgba(255,255,255,0.85)"
                    fontFamily="sans-serif"
                    fontWeight="600"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    {pin.city}
                  </motion.text>
                </g>
              )
            })}
          </svg>

          {/* Overlay tooltip */}
          {activePinData && (
            <div className="pointer-events-none absolute inset-0">
              <div className="pointer-events-auto absolute"
                style={{ left: 0, top: 0, width: "100%", height: "100%" }}>
                <PinTooltip
                  pin={activePinData}
                  onClose={() => setActivePin(null)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pb-1">
          {pins.map((pin) => (
            <button
              key={pin.id}
              onClick={() => setActivePin(activePin === pin.id ? null : pin.id)}
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: pin.color }}
              />
              {pin.flag} {pin.city}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
