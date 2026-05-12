import React from "react"
import {
  Document, Page, Text, View, StyleSheet,
  Font, Svg, Rect, Circle,
} from "@react-pdf/renderer"
import type { EleveEcheancier, MoyenPaiement } from "./finance-mock-data"

/* ─── Register fonts ─── */
Font.register({
  family: "DMSans",
  fonts: [
    { src: "/fonts/dm-sans/dm-sans-latin-400-normal.woff", fontWeight: 400 },
    { src: "/fonts/dm-sans/dm-sans-latin-700-normal.woff", fontWeight: 700 },
    { src: "/fonts/dm-sans/dm-sans-latin-400-italic.woff", fontWeight: 400, fontStyle: "italic" },
  ],
})

/* ─── Palette ─── */
const GOLD    = "#C9A84C"
const GOLD_LT = "#f0e4bc"
const EM      = "#10B981"
const RD      = "#EF4444"
const AM      = "#F59E0B"
const NAVY    = "#0D1F35"
const NAVY_LT = "#1A2E48"
const GREY    = "#64748B"
const GREY_LT = "#F1F5F9"
const GREY_BK = "#E2E8F0"
const WHITE   = "#FFFFFF"

/* ─── Styles ─── */
const s = StyleSheet.create({
  page: {
    fontFamily: "DMSans",
    backgroundColor: WHITE,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
  },

  /* Header band */
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 36,
    paddingTop: 28,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  headerLeft: { flexDirection: "column", gap: 4 },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    color: GOLD,
    letterSpacing: 2,
  },
  logoSub: {
    fontSize: 7,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginTop: 2,
  },
  headerRight: { flexDirection: "column", alignItems: "flex-end", gap: 3 },
  docTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: WHITE,
    letterSpacing: 0.5,
  },
  refBadge: {
    backgroundColor: GOLD,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 4,
  },
  refText: {
    fontSize: 8,
    fontWeight: 700,
    color: NAVY,
    letterSpacing: 1,
  },

  /* Gold accent line */
  accentLine: {
    height: 3,
    backgroundColor: GOLD,
  },

  /* Body */
  body: { paddingHorizontal: 36, paddingTop: 24 },

  /* Student card */
  studentCard: {
    backgroundColor: GREY_LT,
    borderRadius: 8,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    borderLeft: `3px solid ${GOLD}`,
  },
  studentLeft: { flexDirection: "column", gap: 3 },
  studentName: { fontSize: 14, fontWeight: 700, color: NAVY },
  studentMeta: { fontSize: 8, color: GREY, letterSpacing: 0.3 },
  classBadge: {
    backgroundColor: GOLD_LT,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  classBadgeText: { fontSize: 7, fontWeight: 700, color: "#7C5C10" },
  studentRight: { flexDirection: "column", alignItems: "flex-end", gap: 2 },
  dateLabel: { fontSize: 7, color: GREY, letterSpacing: 0.5 },
  dateValue: { fontSize: 9, fontWeight: 700, color: NAVY },

  /* Section title */
  sectionTitle: {
    fontSize: 8,
    fontWeight: 700,
    color: GREY,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 16,
  },

  /* Table */
  tableHead: {
    flexDirection: "row",
    backgroundColor: NAVY,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 1,
  },
  tableHeadCell: {
    fontSize: 7,
    fontWeight: 700,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottom: `1px solid ${GREY_BK}`,
    alignItems: "center",
  },
  tableRowAlt: {
    backgroundColor: GREY_LT,
  },
  tableCell: {
    fontSize: 8.5,
    color: NAVY,
  },
  tableCellMuted: {
    fontSize: 7.5,
    color: GREY,
    fontStyle: "italic",
  },

  /* Statut pill */
  pill: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  pillText: { fontSize: 6.5, fontWeight: 700 },

  /* Summary box */
  summaryBox: {
    backgroundColor: NAVY,
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryItem: { flexDirection: "column", alignItems: "center", gap: 2 },
  summaryValue: { fontSize: 14, fontWeight: 700, color: WHITE },
  summaryLabel: { fontSize: 6.5, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" },
  summaryDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.1)" },

  /* Progress bar row */
  progressRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8 },
  progressTrack: { flex: 1, height: 5, backgroundColor: GREY_BK, borderRadius: 3 },
  progressFill: { height: 5, borderRadius: 3 },
  progressLabel: { fontSize: 8, fontWeight: 700, color: NAVY, width: 32, textAlign: "right" },

  /* Payment info row */
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 0,
    marginTop: 12,
    borderRadius: 6,
    overflow: "hidden",
    border: `1px solid ${GREY_BK}`,
  },
  infoCell: {
    width: "50%",
    padding: 10,
    borderBottom: `1px solid ${GREY_BK}`,
  },
  infoCellRight: {
    borderLeft: `1px solid ${GREY_BK}`,
  },
  infoLabel: { fontSize: 6.5, color: GREY, letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 },
  infoValue: { fontSize: 9, fontWeight: 700, color: NAVY },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 16,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 6.5, color: GREY, letterSpacing: 0.3 },
  footerBrand: { fontSize: 7, fontWeight: 700, color: GOLD, letterSpacing: 1 },

  /* Stamp */
  stamp: {
    position: "absolute",
    top: 40,
    right: 36,
    width: 72,
    height: 72,
  },

  /* Watermark */
  watermark: {
    position: "absolute",
    top: "40%",
    left: "20%",
    fontSize: 64,
    fontWeight: 700,
    color: "rgba(201,168,76,0.04)",
    transform: "rotate(-30deg)",
    letterSpacing: 8,
  },
})

/* ─── Helpers ─── */
const MOYEN_LABEL: Record<MoyenPaiement, string> = {
  espèces:      "Espèces",
  virement:     "Virement bancaire",
  orange_money: "Orange Money",
  wave:         "Wave",
  chèque:       "Chèque",
}

const STATUT_CFG = {
  payé:      { label: "Payé",      bg: "#D1FAE5", color: "#065F46" },
  partiel:   { label: "Partiel",   bg: "#FEF3C7", color: "#92400E" },
  en_retard: { label: "En retard", bg: "#FEE2E2", color: "#991B1B" },
  non_payé:  { label: "Non payé",  bg: GREY_BK,   color: GREY },
}

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M GNF`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K GNF`
  return `${n.toLocaleString("fr-FR")} GNF`
}

function fmtDate(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
}

/* ─── QR simulation (pattern géométrique SVG) ─── */
function QRDecoration() {
  const cells: React.ReactElement[] = []
  const pattern = [
    [1,1,1,1,1,1,1,0,1,1,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,0,1,1],
    [1,0,1,1,1,0,1,0,1,1,0,1,0,0,0],
    [1,0,0,0,0,0,1,0,0,0,1,1,1,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1],
    [0,0,0,0,0,0,0,0,0,1,0,1,1,0,0],
    [1,0,1,1,0,1,1,1,1,0,1,1,0,1,1],
    [0,1,1,0,0,1,0,0,1,1,0,0,1,0,1],
    [1,0,0,1,1,0,1,1,0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,0,1],
    [1,1,1,1,1,1,1,0,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,1,0],
    [1,1,1,1,1,1,1,0,1,0,1,1,0,0,1],
  ]
  pattern.forEach((row, r) => row.forEach((cell, c) => {
    if (cell) cells.push(<Rect key={`${r}-${c}`} x={c * 3.5} y={r * 3.5} width={3} height={3} fill={NAVY} />)
  }))
  return (
    <Svg width={56} height={56} viewBox="0 0 52.5 52.5">
      {cells}
    </Svg>
  )
}

/* ─── Stamp SVG ─── */
function StampValidé() {
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <Circle cx={36} cy={36} r={33} fill="none" stroke={EM} strokeWidth={2} strokeDasharray="4 2" />
      <Circle cx={36} cy={36} r={28} fill="none" stroke={EM} strokeWidth={0.5} />
      <Text
        style={{ fontSize: 8, fontWeight: 700, fill: EM, letterSpacing: 2 }}
      />
    </Svg>
  )
}

/* ─── Props ─── */
export interface RecuPaiementData {
  eleve: EleveEcheancier
  echeancePaidId?: string
  montantVerse?: number
  moyenPaiement?: MoyenPaiement
  reference?: string
  datePaiement?: string
  numeroRecu?: string
}

/* ─── Document ─── */
export function RecuPaiementPDF({ data }: { data: RecuPaiementData }) {
  const { eleve, echeancePaidId, montantVerse, moyenPaiement, reference, datePaiement, numeroRecu } = data

  const pct = Math.min(100, Math.round((eleve.totalPaye / eleve.totalDu) * 100))
  const progressColor = pct >= 100 ? EM : pct >= 50 ? AM : RD
  const dateEmission = datePaiement ?? new Date().toISOString().split("T")[0]
  const recuNum = numeroRecu ?? `REC-${new Date().getFullYear()}-${String(Math.abs(eleve.id.charCodeAt(5) ?? 1) * 37 + 1000).padStart(5, "0")}`

  return (
    <Document
      title={`Reçu — ${eleve.prenom} ${eleve.nom}`}
      author="Fiinor ERP"
      subject="Reçu de paiement académique"
      creator="Fiinor"
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.logo}>FIINOR</Text>
            <Text style={s.logoSub}>Système de gestion académique</Text>
            <Text style={[s.logoSub, { marginTop: 6, color: "rgba(255,255,255,0.25)" }]}>
              Université de Conakry · République de Guinée
            </Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.docTitle}>REÇU DE PAIEMENT</Text>
            <View style={s.refBadge}>
              <Text style={s.refText}>{recuNum}</Text>
            </View>
            <Text style={[s.logoSub, { marginTop: 6 }]}>
              Émis le {fmtDate(dateEmission)}
            </Text>
          </View>
        </View>

        {/* ── Gold line ── */}
        <View style={s.accentLine} />

        {/* ── Body ── */}
        <View style={s.body}>

          {/* Watermark */}
          <Text style={s.watermark}>FIINOR</Text>

          {/* Student card */}
          <View style={s.studentCard}>
            <View style={s.studentLeft}>
              <Text style={s.studentName}>{eleve.prenom} {eleve.nom}</Text>
              <Text style={s.studentMeta}>Matricule : {eleve.matricule}</Text>
              <View style={s.classBadge}>
                <Text style={s.classBadgeText}>{eleve.classe}</Text>
              </View>
            </View>
            <View style={s.studentRight}>
              <Text style={s.dateLabel}>DATE D'ÉMISSION</Text>
              <Text style={s.dateValue}>{fmtDate(dateEmission)}</Text>
              <View style={{ marginTop: 8 }}>
                <QRDecoration />
              </View>
            </View>
          </View>

          {/* Info grid */}
          {moyenPaiement && (
            <>
              <Text style={s.sectionTitle}>Détails du paiement</Text>
              <View style={s.infoGrid}>
                {[
                  { label: "Moyen de paiement", value: MOYEN_LABEL[moyenPaiement] },
                  { label: "Référence transaction", value: reference ?? "—" },
                  { label: "Montant versé", value: fmt(montantVerse ?? 0) },
                  { label: "Date de paiement", value: fmtDate(datePaiement ?? dateEmission) },
                ].map((item, i) => (
                  <View key={item.label}
                    style={[s.infoCell, i % 2 !== 0 ? s.infoCellRight : {}, i >= 2 ? { borderBottom: "none" } : {}]}>
                    <Text style={s.infoLabel}>{item.label}</Text>
                    <Text style={s.infoValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Echeances table */}
          <Text style={s.sectionTitle}>Détail des tranches</Text>
          <View style={s.tableHead}>
            {["Tranche", "Échéance", "Montant", "Date paiement", "Moyen", "Statut"].map((h, i) => (
              <Text key={h} style={[s.tableHeadCell, {
                flex: [2.5, 1.5, 1.5, 1.5, 1.5, 1][i],
                textAlign: [2, 3].includes(i) ? "right" : "left",
              }]}>{h}</Text>
            ))}
          </View>

          {eleve.echeances.map((ech, i) => {
            const cfg = STATUT_CFG[ech.statut]
            const isTarget = ech.id === echeancePaidId
            return (
              <View key={ech.id}
                style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {},
                  isTarget ? { backgroundColor: "#ECFDF5" } : {}]}>
                <View style={{ flex: 2.5, flexDirection: "row", alignItems: "center", gap: 4 }}>
                  {isTarget && (
                    <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: EM }} />
                  )}
                  <Text style={[s.tableCell, isTarget ? { fontWeight: 700 } : {}]}>{ech.libelle}</Text>
                </View>
                <Text style={[s.tableCell, { flex: 1.5, color: GREY }]}>
                  {fmtDate(ech.dateEcheance)}
                </Text>
                <Text style={[s.tableCell, { flex: 1.5, textAlign: "right", fontWeight: 700 }]}>
                  {fmt(ech.montant)}
                </Text>
                <Text style={[s.tableCell, { flex: 1.5, textAlign: "right", color: GREY }]}>
                  {fmtDate(ech.datePaiement)}
                </Text>
                <Text style={[s.tableCellMuted, { flex: 1.5 }]}>
                  {ech.moyen ? MOYEN_LABEL[ech.moyen] : "—"}
                </Text>
                <View style={{ flex: 1 }}>
                  <View style={[s.pill, { backgroundColor: cfg.bg }]}>
                    <Text style={[s.pillText, { color: cfg.color }]}>{cfg.label}</Text>
                  </View>
                </View>
              </View>
            )
          })}

          {/* Summary */}
          <View style={s.summaryBox}>
            {[
              { label: "Total des frais", value: fmt(eleve.totalDu), color: "rgba(255,255,255,0.7)" },
              null,
              { label: "Montant payé",    value: fmt(eleve.totalPaye), color: "#6EE7B7" },
              null,
              { label: "Solde restant",   value: fmt(Math.max(0, eleve.totalDu - eleve.totalPaye)),
                color: eleve.totalDu <= eleve.totalPaye ? "#6EE7B7" : "#FCA5A5" },
            ].map((item, i) =>
              item === null
                ? <View key={i} style={s.summaryDivider} />
                : (
                  <View key={item.label} style={s.summaryItem}>
                    <Text style={[s.summaryValue, { color: item.color }]}>{item.value}</Text>
                    <Text style={s.summaryLabel}>{item.label}</Text>
                  </View>
                )
            )}
          </View>

          {/* Progress bar */}
          <View style={s.progressRow}>
            <Text style={[s.infoLabel, { width: 80, textAlign: "left" }]}>Recouvrement</Text>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, {
                width: `${pct}%`,
                backgroundColor: progressColor,
              }]} />
            </View>
            <Text style={s.progressLabel}>{pct}%</Text>
          </View>

          {/* Legal notice */}
          <View style={{
            marginTop: 24,
            padding: 10,
            borderRadius: 6,
            backgroundColor: GREY_LT,
            borderLeft: `3px solid ${GREY_BK}`,
          }}>
            <Text style={[s.footerText, { lineHeight: 1.6 }]}>
              Ce document constitue un reçu officiel de paiement émis par le système Fiinor.
              Toute contestation doit être adressée au service des finances dans un délai de 30 jours.
              Document généré électroniquement — signature numérique valide.
            </Text>
          </View>
        </View>

        {/* ── Footer ── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Fiinor ERP · Université de Conakry · finances@univ-conakry.edu.gn
          </Text>
          <Text style={s.footerBrand}>FIINOR</Text>
          <Text style={s.footerText}>{recuNum} · Page 1/1</Text>
        </View>

      </Page>
    </Document>
  )
}
