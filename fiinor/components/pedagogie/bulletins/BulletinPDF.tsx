"use client"

import {
  Document, Page, View, Text, StyleSheet,
  PDFDownloadLink, Font, Svg, Rect, Path, Line, Circle,
} from "@react-pdf/renderer"
import { Download, Loader2 } from "lucide-react"
import type { BulletinData } from "./BulletinPreview"

/* ─── Fonts — absolute URLs required by @react-pdf/renderer fetch ─── */
const _origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
const _f = (name: string) => `${_origin}/fonts/dm-sans/${name}`
Font.register({
  family: "DM Sans",
  fonts: [
    { src: _f("dm-sans-latin-400-normal.woff"), fontWeight: 400, fontStyle: "normal"  },
    { src: _f("dm-sans-latin-400-italic.woff"),  fontWeight: 400, fontStyle: "italic"  },
    { src: _f("dm-sans-latin-700-normal.woff"), fontWeight: 700, fontStyle: "normal"  },
    { src: _f("dm-sans-latin-700-italic.woff"),  fontWeight: 700, fontStyle: "italic"  },
  ],
})

/* ─── Color tokens ─── */
const C = {
  white:       "#ffffff",
  gray50:      "#f9fafb",
  gray100:     "#f3f4f6",
  gray200:     "#e5e7eb",
  gray400:     "#9ca3af",
  gray600:     "#4b5563",
  gray800:     "#1f2937",
  gray900:     "#111827",
  blue:        "#1e3a5f",
  blueLight:   "#2c5282",
  red:         "#CE1126",
  gold:        "#C9A020",
  green:       "#007A3D",
  noteGreen:   "#059669",
  noteAmber:   "#D97706",
  noteRed:     "#DC2626",
}

const VERDICT_COLOR: Record<string, string> = {
  admis:      "#10B981",
  rattrapage: "#D97706",
  ajourné:    "#DC2626",
  exclu:      "#7C3AED",
}

const MENTION_COLOR: Record<string, string> = {
  "Passable":   "#6B7280",
  "Assez bien": "#3B82F6",
  "Bien":       "#10B981",
  "Très bien":  "#F59E0B",
  "Excellent":  "#7C3AED",
}

/* ─── Helpers ─── */
function noteColor(note: number, max: number): string {
  const r = note / max
  if (r >= 0.7) return C.noteGreen
  if (r >= 0.5) return C.noteAmber
  return C.noteRed
}

function getMention(moy: number): string {
  if (moy >= 16) return "Excellent"
  if (moy >= 14) return "Très bien"
  if (moy >= 12) return "Bien"
  if (moy >= 10) return "Assez bien"
  return "Passable"
}

/* ─── Styles ─── */
const s = StyleSheet.create({
  page: {
    fontFamily: "DM Sans",
    fontSize: 8,
    color: C.gray900,
    backgroundColor: C.white,
    paddingBottom: 0,
  },

  /* ── Flag strip ── */
  flagStrip: { flexDirection: "row", height: 4 },
  flagRed:   { flex: 1, backgroundColor: C.red   },
  flagGold:  { flex: 1, backgroundColor: C.gold  },
  flagGreen: { flex: 1, backgroundColor: C.green },

  /* ── Header ── */
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 32, paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1, borderBottomColor: C.gray200,
  },
  headerCenter: { flex: 1, alignItems: "center", gap: 2 },
  headerRepublique: {
    fontSize: 6, fontWeight: 700, letterSpacing: 1.5,
    color: C.gray400, textTransform: "uppercase",
  },
  headerMinistere: {
    fontSize: 6, color: C.gray400, textAlign: "center",
  },
  headerDivider: {
    height: 0.5, width: "50%", backgroundColor: C.gray200, marginVertical: 3,
  },
  headerEtablissement: {
    fontSize: 11, fontWeight: 700, color: C.blue,
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  headerVille: {
    fontSize: 6.5, color: C.gray400,
  },
  headerDevise: {
    fontSize: 6.5, color: C.green, fontStyle: "italic",
  },

  /* ── Title band ── */
  titleBand: {
    backgroundColor: C.blue,
    paddingVertical: 8, paddingHorizontal: 32,
    alignItems: "center", gap: 3,
  },
  titleText: {
    fontSize: 11, fontWeight: 700, color: C.white,
    letterSpacing: 2, textTransform: "uppercase",
  },
  titleSub: { fontSize: 7, color: "rgba(255,255,255,0.6)", letterSpacing: 0.5 },

  /* ── Student identity ── */
  identity: {
    paddingHorizontal: 32, paddingVertical: 10,
    backgroundColor: C.gray50,
    borderBottomWidth: 1, borderBottomColor: C.gray200,
    flexDirection: "row", alignItems: "flex-start", gap: 20,
  },
  identityLeft: { flex: 1 },
  identityLabel: {
    fontSize: 6, fontWeight: 700, color: C.gray400,
    letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3,
  },
  identityName: { fontSize: 14, fontWeight: 700, color: C.gray900 },
  identityPrenom: { fontSize: 14, fontWeight: 400, color: C.gray600 },
  identityMeta: {
    flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 3,
  },
  identityMetaItem: { fontSize: 7, color: C.gray600 },
  identityMetaValue: { fontWeight: 700, color: C.gray800 },

  metaBox: {
    minWidth: 80, padding: 8, alignItems: "center",
    backgroundColor: C.white,
    borderWidth: 1, borderColor: C.gray200,
  },
  metaBoxLabel: {
    fontSize: 5.5, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 3,
  },
  metaBoxValue: { fontSize: 8.5, fontWeight: 700, color: C.gray800 },

  /* ── Table ── */
  tableSection: { paddingHorizontal: 32, paddingTop: 12 },
  sectionTitle: {
    fontSize: 6.5, fontWeight: 700, letterSpacing: 2,
    textTransform: "uppercase", color: C.blue, marginBottom: 6,
  },
  tableHead: { flexDirection: "row", backgroundColor: C.blue },
  tableHeadCell: {
    fontSize: 6, fontWeight: 700, color: "rgba(255,255,255,0.8)",
    letterSpacing: 1, textTransform: "uppercase",
    paddingVertical: 6, paddingHorizontal: 6,
  },
  tableRow: { flexDirection: "row", borderBottomWidth: 0.5, borderBottomColor: C.gray100 },
  tableRowEven: { backgroundColor: C.white },
  tableRowOdd:  { backgroundColor: C.gray50 },
  tableCell: { fontSize: 7.5, paddingVertical: 6, paddingHorizontal: 6, color: C.gray900 },
  tableCellCenter: { textAlign: "center" },
  tableCellItalic: { fontStyle: "italic" },

  /* ── Summary ── */
  summary: {
    flexDirection: "row", paddingHorizontal: 32,
    paddingTop: 14, gap: 10, flexWrap: "wrap",
  },
  kpiBox: {
    minWidth: 70, padding: 10, alignItems: "center",
    borderWidth: 1, borderColor: C.gray200,
    borderTopWidth: 3,
  },
  kpiBoxDark: {
    minWidth: 80, padding: 10, alignItems: "center",
    backgroundColor: C.blue,
  },
  kpiLabel: {
    fontSize: 5.5, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", color: C.gray400, marginBottom: 4,
  },
  kpiLabelLight: { color: "rgba(255,255,255,0.55)" },
  kpiValue: { fontSize: 22, fontWeight: 700, lineHeight: 1 },
  kpiSub:   { fontSize: 6, color: C.gray400, marginTop: 3 },
  kpiSubLight: { color: "rgba(255,255,255,0.4)" },

  /* ── Verdict ── */
  verdictBox: {
    flex: 1, minWidth: 120, padding: 10,
    flexDirection: "row", alignItems: "center", gap: 10,
    borderWidth: 1.5,
  },
  verdictCircle: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1.5,
    alignItems: "center", justifyContent: "center",
  },
  verdictLabel: {
    fontSize: 5.5, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", marginBottom: 4,
  },
  verdictValue: {
    fontSize: 15, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  /* ── Jury comment ── */
  comment: {
    marginHorizontal: 32, marginTop: 10,
    padding: 10,
    backgroundColor: C.gray50,
    borderLeftWidth: 3, borderLeftColor: C.blue,
    borderWidth: 0.5, borderColor: C.gray200,
  },
  commentTitle: {
    fontSize: 6, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", color: C.blue, marginBottom: 4,
  },
  commentText: {
    fontSize: 8, fontStyle: "italic", color: C.gray600, lineHeight: 1.6,
  },

  /* ── Footer ── */
  footer: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
    paddingHorizontal: 32, paddingVertical: 12,
    borderTopWidth: 0.5, borderTopColor: C.gray200,
    marginTop: 12,
  },
  footerLabel: {
    fontSize: 6, fontWeight: 700, letterSpacing: 1.5,
    textTransform: "uppercase", color: C.gray400, marginBottom: 3,
  },
  footerValue: { fontSize: 8.5, fontWeight: 600, color: C.gray800 },
  sealCircle: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 1.5, borderColor: C.blue,
    alignItems: "center", justifyContent: "center",
    marginTop: 6,
  },
  sealText: {
    fontSize: 5, fontWeight: 700, textTransform: "uppercase",
    letterSpacing: 0.5, color: C.blue, textAlign: "center",
  },
})

/* ─── Guinean flag SVG for PDF ─── */
function PdfFlag() {
  return (
    <Svg width={40} height={27} viewBox="0 0 54 36">
      <Rect x={0}  width={18} height={36} fill={C.red}   />
      <Rect x={18} width={18} height={36} fill={C.gold}  />
      <Rect x={36} width={18} height={36} fill={C.green} />
    </Svg>
  )
}

/* ─── Coat of arms SVG for PDF ─── */
function PdfCoat() {
  return (
    <Svg width={38} height={38} viewBox="0 0 52 52">
      <Path d="M8 6 h36 v22 Q44 44 26 50 Q8 44 8 28 Z" fill="none" stroke="#1a3a2a" strokeWidth={1.5} />
      <Line x1={8} y1={22} x2={44} y2={22} stroke="#1a3a2a" strokeWidth={1} />
      <Path d="M8 6 h18 v16 H8 Z" fill={C.red}   opacity={0.85} />
      <Path d="M26 6 h18 v16 H26 Z" fill={C.green} opacity={0.85} />
      <Path d="M8 22 h36 v6 Q44 44 26 50 Q8 44 8 28 Z" fill={C.gold} opacity={0.75} />
    </Svg>
  )
}

/* ─── PDF Document ─── */
export function BulletinPDFDocument({ data }: { data: BulletinData }) {
  const mention     = data.mention ?? getMention(data.moyenneGenerale)
  const mentionColor = MENTION_COLOR[mention] ?? C.gray600
  const vColor      = VERDICT_COLOR[data.verdict] ?? C.gray600

  const COL_WIDTHS = {
    matiere:   "26%",
    coeff:     "8%",
    note:      "9%",
    moy:       "10%",
    rang:      "8%",
    appr:      "26%",
    ens:       "13%",
  }

  return (
    <Document title={`Bulletin — ${data.etudiantNom} ${data.etudiantPrenom}`} author={data.etablissementNom}>
      <Page size="A4" style={s.page}>

        {/* ── Flag strip top ── */}
        <View style={s.flagStrip} fixed>
          <View style={s.flagRed}   />
          <View style={s.flagGold}  />
          <View style={s.flagGreen} />
        </View>

        {/* ── Header ── */}
        <View style={s.header}>
          <PdfFlag />
          <View style={s.headerCenter}>
            <Text style={s.headerRepublique}>République de Guinée</Text>
            <Text style={s.headerMinistere}>
              Ministère de l'Enseignement Supérieur et de la Recherche Scientifique
            </Text>
            <View style={s.headerDivider} />
            <Text style={s.headerEtablissement}>{data.etablissementNom}</Text>
            {data.etablissementVille && (
              <Text style={s.headerVille}>{data.etablissementVille}</Text>
            )}
            <Text style={s.headerDevise}>Travail — Justice — Solidarité</Text>
          </View>
          <PdfCoat />
        </View>

        {/* ── Title band ── */}
        <View style={s.titleBand}>
          <Text style={s.titleText}>Bulletin de Notes</Text>
          <Text style={s.titleSub}>
            {data.semestre}  ·  Année académique {data.anneeAcademique}
          </Text>
        </View>

        {/* ── Identity ── */}
        <View style={s.identity}>
          <View style={s.identityLeft}>
            <Text style={s.identityLabel}>Étudiant(e)</Text>
            <Text>
              <Text style={s.identityName}>{data.etudiantNom} </Text>
              <Text style={s.identityPrenom}>{data.etudiantPrenom}</Text>
            </Text>
            <View style={s.identityMeta}>
              <Text style={s.identityMetaItem}>
                Matricule : <Text style={s.identityMetaValue}>{data.matricule}</Text>
              </Text>
              {data.dateNaissance && (
                <Text style={s.identityMetaItem}>
                  Né(e) le : <Text style={s.identityMetaValue}>
                    {new Date(data.dateNaissance).toLocaleDateString("fr-FR")}
                  </Text>
                </Text>
              )}
              {data.lieuNaissance && (
                <Text style={s.identityMetaItem}>
                  Lieu : <Text style={s.identityMetaValue}>{data.lieuNaissance}</Text>
                </Text>
              )}
            </View>
          </View>

          {/* Meta boxes */}
          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              { label: "Classe",  val: data.classe,  color: C.blue  },
              { label: "Période", val: data.periode, color: C.green },
            ].map(f => (
              <View key={f.label} style={[s.metaBox, { borderTopWidth: 3, borderTopColor: f.color }]}>
                <Text style={[s.metaBoxLabel, { color: f.color }]}>{f.label}</Text>
                <Text style={s.metaBoxValue}>{f.val}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Table ── */}
        <View style={s.tableSection}>
          <Text style={s.sectionTitle}>Résultats par Matière</Text>

          {/* Head */}
          <View style={s.tableHead}>
            {[
              { label: "Matière",      w: COL_WIDTHS.matiere, align: "left"   as const },
              { label: "Coeff.",       w: COL_WIDTHS.coeff,   align: "center" as const },
              { label: "Note /20",     w: COL_WIDTHS.note,    align: "center" as const },
              { label: "Moy. Classe",  w: COL_WIDTHS.moy,     align: "center" as const },
              { label: "Rang",         w: COL_WIDTHS.rang,    align: "center" as const },
              { label: "Appréciation", w: COL_WIDTHS.appr,    align: "left"   as const },
              { label: "Enseignant",   w: COL_WIDTHS.ens,     align: "left"   as const },
            ].map(col => (
              <Text key={col.label} style={[s.tableHeadCell, { width: col.w, textAlign: col.align }]}>
                {col.label}
              </Text>
            ))}
          </View>

          {/* Rows */}
          {data.matieres.map((m, i) => {
            const nc = noteColor(m.noteObtenue, m.noteMax)
            return (
              <View key={m.nom} style={[s.tableRow, i % 2 === 0 ? s.tableRowEven : s.tableRowOdd]}>
                <Text style={[s.tableCell, { width: COL_WIDTHS.matiere, fontWeight: 700 }]}>
                  {m.nom}
                </Text>
                <Text style={[s.tableCell, s.tableCellCenter, { width: COL_WIDTHS.coeff, color: C.gray600 }]}>
                  {m.coefficient}
                </Text>
                <Text style={[s.tableCell, s.tableCellCenter, { width: COL_WIDTHS.note, fontWeight: 700, color: nc, fontSize: 10 }]}>
                  {m.noteObtenue.toFixed(1)}
                </Text>
                <Text style={[s.tableCell, s.tableCellCenter, { width: COL_WIDTHS.moy, color: C.gray600 }]}>
                  {m.moyenneClasse?.toFixed(1) ?? "—"}
                </Text>
                <Text style={[s.tableCell, s.tableCellCenter, {
                  width: COL_WIDTHS.rang,
                  color: m.rang && m.rang <= 3 ? C.gold : C.gray400,
                  fontWeight: m.rang && m.rang <= 3 ? 700 : 400,
                }]}>
                  {m.rang ? `${m.rang}e` : "—"}
                </Text>
                <Text style={[s.tableCell, s.tableCellItalic, { width: COL_WIDTHS.appr, color: C.gray600, fontSize: 7 }]}>
                  {m.appreciation}
                </Text>
                <Text style={[s.tableCell, { width: COL_WIDTHS.ens, color: C.gray400, fontSize: 7 }]}>
                  {m.enseignant}
                </Text>
              </View>
            )
          })}

          {/* Table bottom line */}
          <View style={{ height: 1.5, backgroundColor: C.blue, marginTop: 1 }} />
        </View>

        {/* ── Summary KPIs ── */}
        <View style={s.summary}>

          {/* Moyenne */}
          <View style={s.kpiBoxDark}>
            <Text style={[s.kpiLabel, s.kpiLabelLight]}>Moy. Générale</Text>
            <Text style={[s.kpiValue, { color: noteColor(data.moyenneGenerale, data.moyenneGeneraleMax) }]}>
              {data.moyenneGenerale.toFixed(2)}
            </Text>
            <Text style={[s.kpiSub, s.kpiSubLight]}>/ 20</Text>
          </View>

          {/* Rang */}
          <View style={[s.kpiBox, { borderTopColor: C.gold }]}>
            <Text style={s.kpiLabel}>Rang</Text>
            <Text style={[s.kpiValue, { color: C.gold }]}>{data.rang}e</Text>
            <Text style={s.kpiSub}>sur {data.effectif}</Text>
          </View>

          {/* Mention */}
          <View style={[s.kpiBox, { borderTopColor: mentionColor }]}>
            <Text style={s.kpiLabel}>Mention</Text>
            <Text style={[s.kpiValue, { color: mentionColor, fontSize: 11 }]}>{mention}</Text>
          </View>

          {/* Absences */}
          <View style={[s.kpiBox, { borderTopColor: data.nbAbsences > 5 ? C.noteRed : C.gray200 }]}>
            <Text style={s.kpiLabel}>Absences</Text>
            <Text style={[s.kpiValue, { color: data.nbAbsences > 5 ? C.noteRed : C.gray800, fontSize: 20 }]}>
              {data.nbAbsences}
            </Text>
            <Text style={s.kpiSub}>jour(s)</Text>
          </View>

          {/* Verdict */}
          <View style={[s.verdictBox, {
            backgroundColor: `${vColor}08`,
            borderColor: `${vColor}40`,
            borderLeftWidth: 4, borderLeftColor: vColor,
          }]}>
            <View style={[s.verdictCircle, { borderColor: vColor }]}>
              <Text style={{ fontSize: 10, color: vColor }}>✓</Text>
            </View>
            <View>
              <Text style={[s.verdictLabel, { color: `${vColor}99` }]}>Décision du Jury</Text>
              <Text style={[s.verdictValue, { color: vColor }]}>
                {data.verdict.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Jury comment ── */}
        {data.commentaireJury && (
          <View style={s.comment}>
            <Text style={s.commentTitle}>Appréciation du Conseil de Classe</Text>
            <Text style={s.commentText}>« {data.commentaireJury} »</Text>
          </View>
        )}

        {/* ── Footer ── */}
        <View style={s.footer}>
          <View>
            <Text style={s.footerLabel}>Date de publication</Text>
            <Text style={s.footerValue}>
              Conakry, le {new Date(data.datePublication).toLocaleDateString("fr-FR", {
                day: "2-digit", month: "long", year: "numeric",
              })}
            </Text>
          </View>

          {data.directeur && (
            <View style={{ alignItems: "center" }}>
              <Text style={s.footerLabel}>Le Directeur de l'Établissement</Text>
              <Text style={s.footerValue}>{data.directeur}</Text>
              {data.cachet && (
                <View style={s.sealCircle}>
                  <Text style={s.sealText}>Cachet{"\n"}Officiel</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* ── Flag strip bottom ── */}
        <View style={s.flagStrip} fixed>
          <View style={s.flagRed}   />
          <View style={s.flagGold}  />
          <View style={s.flagGreen} />
        </View>

        {/* Page number */}
        <Text
          fixed
          style={{
            position: "absolute", bottom: 12, right: 32,
            fontSize: 6, color: C.gray400,
          }}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>
    </Document>
  )
}

/* ─── Download button ─── */
export function BulletinDownloadButton({
  data,
  label = "Télécharger PDF",
  iconOnly = false,
  iconSize = 14,
  className,
  style,
}: {
  data: BulletinData
  label?: string
  iconOnly?: boolean
  iconSize?: number
  className?: string
  style?: React.CSSProperties
}) {
  const filename = `bulletin_${data.etudiantNom}_${data.etudiantPrenom}_${data.semestre.replace(/\s+/g, "_")}.pdf`

  return (
    <PDFDownloadLink
      document={<BulletinPDFDocument data={data} />}
      fileName={filename}
      style={{ textDecoration: "none" }}>
      {({ loading }) => (
        <span
          className={className}
          title={iconOnly ? `Télécharger PDF — ${data.etudiantNom} ${data.etudiantPrenom}` : undefined}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            cursor: loading ? "wait" : "pointer",
            ...style,
          }}>
          {loading
            ? <Loader2 size={iconSize} style={{ animation: "spin 1s linear infinite" }} />
            : <Download size={iconSize} />}
          {!iconOnly && (loading ? "Préparation…" : label)}
        </span>
      )}
    </PDFDownloadLink>
  )
}
