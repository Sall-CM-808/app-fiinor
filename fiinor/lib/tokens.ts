/* ═══════════════════════════════════════════════════════════════
   FiiNOR Design Token System — Palette officielle
   Primary : #1d8b93 (teal)  ·  Brand : #b8d070 (lime)
   ═══════════════════════════════════════════════════════════════ */

const tokens = {

  /* ─── DARK (mode par défaut) ─────────────────────────────── */
  dark: {
    /* Surfaces glassmorphism */
    surface0:     "#0d1117",
    surface1:     "rgba(255,255,255,0.06)",
    surface2:     "rgba(255,255,255,0.10)",
    surface3:     "rgba(255,255,255,0.14)",
    surfaceGlass: "rgba(13,17,23,0.92)",

    /* Borders */
    border:       "rgba(255,255,255,0.14)",
    borderStrong: "rgba(255,255,255,0.22)",
    borderFaint:  "rgba(255,255,255,0.06)",

    /* Text */
    textPrimary:  "#ffffff",
    textSecondary:"rgba(255,255,255,0.70)",
    textMuted:    "rgba(255,255,255,0.55)",
    textFaint:    "rgba(255,255,255,0.35)",

    /* ── Brand Primary (teal) */
    teal:         "#1d8b93",
    tealLight:    "#23a8b2",
    tealHover:    "#177880",
    tealActive:   "#12666d",
    tealMuted:    "rgba(29,139,147,0.18)",
    tealFaint:    "rgba(29,139,147,0.08)",

    /* ── Brand Accent (lime) */
    lime:         "#b8d070",
    limeLight:    "#c8dc88",
    limeHover:    "#a2c65e",
    limeDark:     "#8ab445",
    limeMuted:    "rgba(184,208,112,0.18)",
    limeFaint:    "rgba(184,208,112,0.08)",

    /* ── Sémantique Finance (conservé) */
    gold:         "#C9A84C",
    goldLight:    "#E8C97A",
    goldMuted:    "rgba(201,168,76,0.15)",
    goldFaint:    "rgba(201,168,76,0.07)",

    /* ── Couleurs fonctionnelles */
    emerald:      "#40c98b",
    emeraldMuted: "rgba(64,201,139,0.15)",
    red:          "#ef6b6b",
    redMuted:     "rgba(239,107,107,0.15)",
    amber:        "#f0c245",
    amberMuted:   "rgba(240,194,69,0.15)",
    blue:         "#3B82F6",
    blueMuted:    "rgba(59,130,246,0.15)",
    purple:       "#8B5CF6",
    purpleMuted:  "rgba(139,92,246,0.15)",
    orange:       "#F97316",
    orangeMuted:  "rgba(249,115,22,0.15)",
    cyan:         "#1d8b93",
    cyanMuted:    "rgba(29,139,147,0.15)",
  },

  /* ─── LIGHT ──────────────────────────────────────────────── */
  light: {
    /* Surfaces */
    surface0:     "#F5F6F7",
    surface1:     "#FFFFFF",
    surface2:     "#F0F2F4",
    surface3:     "#E5E8EC",
    surfaceGlass: "rgba(255,255,255,0.95)",

    /* Borders */
    border:       "rgba(23,69,72,0.10)",
    borderStrong: "rgba(23,69,72,0.18)",
    borderFaint:  "rgba(23,69,72,0.05)",

    /* Text */
    textPrimary:  "#174548",
    textSecondary:"#1d5c60",
    textMuted:    "#5a8a8e",
    textFaint:    "#8ab0b3",

    /* ── Brand Primary (teal) */
    teal:         "#1d8b93",
    tealLight:    "#23a8b2",
    tealHover:    "#177880",
    tealActive:   "#12666d",
    tealMuted:    "rgba(29,139,147,0.10)",
    tealFaint:    "rgba(29,139,147,0.05)",

    /* ── Brand Accent (lime) */
    lime:         "#8ab445",
    limeLight:    "#b8d070",
    limeHover:    "#a2c65e",
    limeDark:     "#7a9e3a",
    limeMuted:    "rgba(138,180,69,0.12)",
    limeFaint:    "rgba(138,180,69,0.05)",

    /* ── Sémantique Finance */
    gold:         "#b8832a",
    goldLight:    "#C9A84C",
    goldMuted:    "rgba(184,131,42,0.10)",
    goldFaint:    "rgba(184,131,42,0.05)",

    /* ── Couleurs fonctionnelles */
    emerald:      "#2daa72",
    emeraldMuted: "rgba(45,170,114,0.10)",
    red:          "#d94f4f",
    redMuted:     "rgba(217,79,79,0.10)",
    amber:        "#c9982a",
    amberMuted:   "rgba(201,152,42,0.10)",
    blue:         "#2563EB",
    blueMuted:    "rgba(37,99,235,0.10)",
    purple:       "#7C3AED",
    purpleMuted:  "rgba(124,58,237,0.10)",
    orange:       "#EA580C",
    orangeMuted:  "rgba(234,88,12,0.10)",
    cyan:         "#1d8b93",
    cyanMuted:    "rgba(29,139,147,0.10)",
  },

} as const

export default tokens
export type Theme  = keyof typeof tokens
export type Tokens = typeof tokens.dark
