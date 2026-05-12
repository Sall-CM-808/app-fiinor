"use client"

import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from "@react-pdf/renderer"

export type MatierePDF = {
  id: number; nom: string; code: string; enseignant: string; classe: string
  coeff: number; heures: number; hEffectues: number; inscrits: number; statut: string
}
export type PresenceMapPDF = Record<number, number>

/* ─── Colors (no rgba — only hex) ─── */
const C = {
  bg:      "#07111e",
  card:    "#0d1828",
  alt:     "#101f30",
  border:  "#1b2d45",
  gold:    "#C9A84C",
  goldDim: "#5a4820",
  blue:    "#3B82F6",
  blueDim: "#162b52",
  green:   "#10B981",
  greenDim:"#0a3326",
  orange:  "#F59E0B",
  red:     "#EF4444",
  redDim:  "#3a1010",
  purple:  "#8B5CF6",
  white:   "#FFFFFF",
  g1:      "#b0bec5",
  g2:      "#607080",
  g3:      "#304050",
  g4:      "#182535",
}

/* ─── Styles — no gap, no rgba, no SVG ─── */
const S = StyleSheet.create({
  page:    { fontFamily: "Helvetica", backgroundColor: C.bg, color: C.white },
  content: { paddingHorizontal: 40, paddingTop: 36, paddingBottom: 52 },

  /* ── Cover ── */
  coverPage:    { fontFamily: "Helvetica", backgroundColor: C.bg, color: C.white },
  accent:       { height: 3, backgroundColor: C.gold },
  coverBody:    { paddingHorizontal: 52, paddingTop: 52, paddingBottom: 40 },
  coverPill:    { alignSelf: "flex-start", backgroundColor: C.goldDim, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 24 },
  coverPillTxt: { fontFamily: "Helvetica-Bold", fontSize: 8, color: C.gold, letterSpacing: 2 },
  coverTitle:   { fontFamily: "Helvetica-Bold", fontSize: 36, color: C.white, marginBottom: 10, lineHeight: 1.2 },
  coverSub:     { fontSize: 13, color: C.g2, marginBottom: 36 },
  hr:           { height: 1, backgroundColor: C.goldDim, marginBottom: 28 },

  /* meta row */
  metaRow:      { flexDirection: "row", marginBottom: 48 },
  metaItem:     { marginRight: 40 },
  metaLabel:    { fontFamily: "Helvetica-Bold", fontSize: 7, color: C.g3, letterSpacing: 1.5, marginBottom: 4 },
  metaValue:    { fontFamily: "Helvetica-Bold", fontSize: 14, color: C.white },

  /* kpi row */
  kpiRow:       { flexDirection: "row", marginBottom: 0 },
  kpiCard:      { flex: 1, backgroundColor: C.card, borderRadius: 8, padding: 14, marginRight: 10, borderWidth: 1, borderColor: C.border },
  kpiCardLast:  { flex: 1, backgroundColor: C.card, borderRadius: 8, padding: 14, borderWidth: 1, borderColor: C.border },
  kpiLabel:     { fontFamily: "Helvetica-Bold", fontSize: 7, color: C.g3, letterSpacing: 1.2, marginBottom: 6 },
  kpiVal:       { fontFamily: "Helvetica-Bold", fontSize: 20 },
  kpiSub:       { fontSize: 8, color: C.g2, marginTop: 4 },

  coverFooterRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: C.border, paddingTop: 14, marginTop: 40 },
  coverFooterTxt: { fontSize: 8, color: C.g3 },
  coverFooterBadge: { backgroundColor: C.goldDim, borderRadius: 5, paddingHorizontal: 10, paddingVertical: 4 },
  coverFooterBadgeTxt: { fontFamily: "Helvetica-Bold", fontSize: 8, color: C.gold },

  /* ── Content pages ── */
  pageHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  pageTitle:    { fontFamily: "Helvetica-Bold", fontSize: 17, color: C.white },
  pageSub:      { fontSize: 9, color: C.g3, marginTop: 2 },
  pageDate:     { fontSize: 8, color: C.g3 },

  sectionLabel: { fontFamily: "Helvetica-Bold", fontSize: 7, color: C.gold, letterSpacing: 2, marginBottom: 10, marginTop: 20 },

  /* stat row */
  statRow:      { flexDirection: "row", marginBottom: 18 },
  statCard:     { flex: 1, backgroundColor: C.card, borderRadius: 7, padding: 11, marginRight: 8, borderWidth: 1, borderColor: C.border },
  statCardLast: { flex: 1, backgroundColor: C.card, borderRadius: 7, padding: 11, borderWidth: 1, borderColor: C.border },
  statLabel:    { fontFamily: "Helvetica-Bold", fontSize: 7, color: C.g3, letterSpacing: 1.2, marginBottom: 5 },
  statVal:      { fontFamily: "Helvetica-Bold", fontSize: 16 },

  /* table */
  tbl:       { borderWidth: 1, borderColor: C.border, borderRadius: 6 },
  tHead:     { flexDirection: "row", backgroundColor: C.alt, paddingVertical: 8 },
  tHCell:    { fontFamily: "Helvetica-Bold", fontSize: 7, color: C.g3, letterSpacing: 1, paddingHorizontal: 8 },
  tRow:      { flexDirection: "row", paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.g4 },
  tRowAlt:   { flexDirection: "row", paddingVertical: 9, borderTopWidth: 1, borderTopColor: C.g4, backgroundColor: C.alt },
  tCell:     { fontSize: 9, color: C.g1, paddingHorizontal: 8, justifyContent: "center" },
  tCellBold: { fontFamily: "Helvetica-Bold", fontSize: 9, color: C.white, paddingHorizontal: 8, justifyContent: "center" },

  /* badge */
  badge:    { borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2, alignSelf: "flex-start" },
  badgeTxt: { fontFamily: "Helvetica-Bold", fontSize: 7 },

  /* chart bar row */
  barRow:   { flexDirection: "row", alignItems: "center", marginBottom: 7 },
  barTrack: { height: 7, borderRadius: 3, backgroundColor: C.g4 },
  barFill:  { height: 7, borderRadius: 3 },

  /* footer */
  footer:    { position: "absolute", bottom: 22, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: C.border, paddingTop: 8 },
  footerTxt: { fontSize: 7, color: C.g3 },
})

/* ─── Helpers ─── */
function pCol(p: number) { return p >= 85 ? C.green : p >= 70 ? C.orange : C.red }
function hCol(p: number) { return p >= 90 ? C.green : p >= 60 ? C.blue : C.orange }

/* ─── Cover Page ─── */
function CoverPage({ data, pm }: { data: MatierePDF[]; pm: PresenceMapPDF }) {
  const actives  = data.filter(m => m.statut === "actif").length
  const inscrits = data.reduce((s, m) => s + m.inscrits, 0)
  const vals     = Object.values(pm)
  const avgP     = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  const teachers = new Set(data.map(m => m.enseignant)).size
  const now      = new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })

  return (
    <Page size="A4" style={S.coverPage}>
      <View style={S.accent} />
      <View style={S.coverBody}>
        <View style={S.coverPill}><Text style={S.coverPillTxt}>FIINOR · RAPPORT PÉDAGOGIQUE</Text></View>
        <Text style={S.coverTitle}>{"Catalogue des\nMatières"}</Text>
        <Text style={S.coverSub}>{"Bilan complet des enseignements, coefficients,\nvolumes horaires et taux de présence"}</Text>
        <View style={S.hr} />

        <View style={S.metaRow}>
          {[
            { label: "GÉNÉRÉ LE",        val: now },
            { label: "TOTAL MATIÈRES",   val: String(data.length) },
            { label: "ANNÉE ACADÉMIQUE", val: "2025–2026" },
          ].map((m, i) => (
            <View key={i} style={i < 2 ? S.metaItem : { marginRight: 0 }}>
              <Text style={S.metaLabel}>{m.label}</Text>
              <Text style={S.metaValue}>{m.val}</Text>
            </View>
          ))}
        </View>

        <View style={S.kpiRow}>
          {[
            { label: "MATIÈRES ACTIVES",   val: String(actives),        sub: `${data.length - actives} terminées`, color: C.gold },
            { label: "ÉTUDIANTS INSCRITS", val: String(inscrits),       sub: "Tous programmes",                   color: C.blue },
            { label: "PRÉSENCE MOYENNE",   val: avgP + "%",             sub: "Sur l'ensemble",                    color: pCol(avgP) },
            { label: "ENSEIGNANTS",        val: String(teachers),       sub: "Actifs ce semestre",                color: C.purple },
          ].map((k, i) => (
            <View key={i} style={i < 3 ? S.kpiCard : S.kpiCardLast}>
              <Text style={S.kpiLabel}>{k.label}</Text>
              <Text style={[S.kpiVal, { color: k.color }]}>{k.val}</Text>
              <Text style={S.kpiSub}>{k.sub}</Text>
            </View>
          ))}
        </View>

        <View style={S.coverFooterRow}>
          <Text style={S.coverFooterTxt}>FIINOR Infrastructure Pédagogique · Confidentiel</Text>
          <View style={S.coverFooterBadge}><Text style={S.coverFooterBadgeTxt}>Page 1 — Couverture</Text></View>
        </View>
      </View>
    </Page>
  )
}

/* ─── Table Page ─── */
function TablePage({ data, pm }: { data: MatierePDF[]; pm: PresenceMapPDF }) {
  const now  = new Date().toLocaleDateString("fr-FR")
  const vals = Object.values(pm)
  const avgP = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0
  const avgH = Math.round(data.reduce((s, m) => s + (m.hEffectues / m.heures) * 100, 0) / data.length)
  const avgC = (data.reduce((s, m) => s + m.coeff, 0) / data.length).toFixed(1)
  const totI = data.reduce((s, m) => s + m.inscrits, 0)

  const W = { code: 48, nom: 110, ens: 86, cl: 70, cf: 28, hrs: 86, pres: 62, stat: 52 }

  return (
    <Page size="A4" style={[S.page, S.content]}>
      {/* Header */}
      <View style={S.pageHeader}>
        <View>
          <Text style={S.pageTitle}>Détail des matières</Text>
          <Text style={S.pageSub}>Coefficients, volumes horaires et présences</Text>
        </View>
        <Text style={S.pageDate}>{now}</Text>
      </View>

      {/* Stats */}
      <View style={S.statRow}>
        {[
          { label: "VOL. MOY. COMPLÉTÉ",  val: avgH + "%", color: C.blue },
          { label: "COEFF. MOYEN",        val: avgC,       color: C.gold },
          { label: "INSCRITS TOTAL",      val: String(totI), color: C.green },
          { label: "PRÉSENCE RÉSEAU",     val: avgP + "%", color: pCol(avgP) },
        ].map((s, i) => (
          <View key={i} style={i < 3 ? S.statCard : S.statCardLast}>
            <Text style={S.statLabel}>{s.label}</Text>
            <Text style={[S.statVal, { color: s.color }]}>{s.val}</Text>
          </View>
        ))}
      </View>

      <Text style={S.sectionLabel}>LISTE COMPLÈTE DES MATIÈRES</Text>

      {/* Table */}
      <View style={S.tbl}>
        <View style={S.tHead}>
          <Text style={[S.tHCell, { width: W.code }]}>CODE</Text>
          <Text style={[S.tHCell, { width: W.nom  }]}>MATIÈRE</Text>
          <Text style={[S.tHCell, { width: W.ens  }]}>ENSEIGNANT</Text>
          <Text style={[S.tHCell, { width: W.cl   }]}>CLASSE</Text>
          <Text style={[S.tHCell, { width: W.cf   }]}>CF</Text>
          <Text style={[S.tHCell, { width: W.hrs  }]}>VOL. HORAIRE</Text>
          <Text style={[S.tHCell, { width: W.pres }]}>PRÉSENCE</Text>
          <Text style={[S.tHCell, { width: W.stat }]}>STATUT</Text>
        </View>

        {data.map((m, idx) => {
          const pct     = Math.round((m.hEffectues / m.heures) * 100)
          const p       = pm[m.id] ?? 80
          const row     = idx % 2 === 1 ? S.tRowAlt : S.tRow
          const termine = m.statut === "terminé"
          return (
            <View key={m.id} style={row}>
              <View style={[S.tCellBold, { width: W.code }]}>
                <Text style={{ color: C.gold, fontSize: 8, fontFamily: "Helvetica-Bold" }}>{m.code}</Text>
              </View>
              <View style={[S.tCellBold, { width: W.nom }]}>
                <Text style={{ fontSize: 9 }}>{m.nom}</Text>
              </View>
              <View style={[S.tCell, { width: W.ens }]}>
                <Text style={{ fontSize: 8 }}>{m.enseignant.replace("Prof. ", "")}</Text>
              </View>
              <View style={[S.tCell, { width: W.cl }]}>
                <Text style={{ fontSize: 8 }}>{m.classe}</Text>
              </View>
              <View style={[S.tCell, { width: W.cf }]}>
                <Text style={{ fontFamily: "Helvetica-Bold", color: C.gold }}>{m.coeff}</Text>
              </View>
              <View style={[S.tCell, { width: W.hrs, flexDirection: "column" }]}>
                <Text style={{ fontSize: 8, color: C.g2, marginBottom: 3 }}>{m.hEffectues}h / {m.heures}h</Text>
                <View style={[S.barTrack, { width: 68 }]}>
                  <View style={[S.barFill, { width: Math.max(2, (pct / 100) * 68), backgroundColor: hCol(pct) }]} />
                </View>
              </View>
              <View style={[S.tCell, { width: W.pres, flexDirection: "column" }]}>
                <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: pCol(p), marginBottom: 3 }}>{p}%</Text>
                <View style={[S.barTrack, { width: 48 }]}>
                  <View style={[S.barFill, { width: Math.max(2, (p / 100) * 48), backgroundColor: pCol(p) }]} />
                </View>
              </View>
              <View style={[S.tCell, { width: W.stat }]}>
                <View style={[S.badge, { backgroundColor: termine ? C.greenDim : C.blueDim }]}>
                  <Text style={[S.badgeTxt, { color: termine ? C.green : C.blue }]}>
                    {termine ? "Terminé" : "Actif"}
                  </Text>
                </View>
              </View>
            </View>
          )
        })}
      </View>

      {/* Footer */}
      <View style={S.footer} fixed>
        <Text style={S.footerTxt}>FIINOR · Catalogue des Matières · Confidentiel</Text>
        <Text style={S.footerTxt} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  )
}

/* ─── Analytics Page ─── */
function AnalyticsPage({ data, pm }: { data: MatierePDF[]; pm: PresenceMapPDF }) {
  const sorted = [...data].sort((a, b) => (pm[b.id] ?? 0) - (pm[a.id] ?? 0))
  const classes = Array.from(new Set(data.map(m => m.classe)))
  const byClass = classes.map(cl => {
    const g    = data.filter(m => m.classe === cl)
    const avgP = Math.round(g.reduce((s, m) => s + (pm[m.id] ?? 80), 0) / g.length)
    const pct  = Math.round(g.reduce((s, m) => s + m.hEffectues, 0) / g.reduce((s, m) => s + m.heures, 0) * 100)
    return { cl, count: g.length, avgP, pct }
  })
  const alerts = data.filter(m => (pm[m.id] ?? 80) < 80 || (m.hEffectues / m.heures) < 0.5)

  return (
    <Page size="A4" style={[S.page, S.content]}>
      <View style={S.pageHeader}>
        <View>
          <Text style={S.pageTitle}>Analyse & Visualisations</Text>
          <Text style={S.pageSub}>Présence, charge horaire et répartition par classe</Text>
        </View>
        <Text style={S.pageDate}>{new Date().toLocaleDateString("fr-FR")}</Text>
      </View>

      {/* Presence ranking */}
      <Text style={S.sectionLabel}>CLASSEMENT PAR TAUX DE PRÉSENCE</Text>
      <View style={{ backgroundColor: C.card, borderRadius: 7, padding: 14, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, color: C.g2, marginBottom: 10 }}>Toutes matières · plus haute → plus basse présence</Text>
        {sorted.map((m, i) => {
          const p   = pm[m.id] ?? 80
          const col = pCol(p)
          return (
            <View key={m.id} style={S.barRow}>
              <Text style={{ width: 14, fontSize: 7, color: C.g3 }}>{i + 1}</Text>
              <Text style={{ width: 108, fontSize: 8, color: C.white }}>{m.nom}</Text>
              <View style={[S.barTrack, { flex: 1, marginRight: 6 }]}>
                <View style={[S.barFill, { width: (p / 100) * 270, backgroundColor: col }]} />
              </View>
              <Text style={{ width: 28, fontSize: 8, fontFamily: "Helvetica-Bold", color: col }}>{p}%</Text>
            </View>
          )
        })}
      </View>

      {/* By class */}
      <Text style={S.sectionLabel}>SYNTHÈSE PAR CLASSE</Text>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {byClass.map(({ cl, count, avgP, pct }, i) => (
          <View key={cl} style={{
            width: 235, backgroundColor: C.card, borderRadius: 7, padding: 12,
            borderWidth: 1, borderColor: C.border,
            marginRight: i % 2 === 0 ? 10 : 0, marginBottom: 10,
          }}>
            <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: C.white, marginBottom: 8 }}>{cl}</Text>
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              <View style={{ marginRight: 24 }}>
                <Text style={{ fontSize: 7, color: C.g3, marginBottom: 2 }}>MATIÈRES</Text>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 13, color: C.gold }}>{count}</Text>
              </View>
              <View style={{ marginRight: 24 }}>
                <Text style={{ fontSize: 7, color: C.g3, marginBottom: 2 }}>PRÉSENCE</Text>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 13, color: pCol(avgP) }}>{avgP}%</Text>
              </View>
              <View>
                <Text style={{ fontSize: 7, color: C.g3, marginBottom: 2 }}>VOLUME</Text>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 13, color: C.blue }}>{pct}%</Text>
              </View>
            </View>
            <View style={{ marginBottom: 5 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={{ width: 40, fontSize: 7, color: C.g3 }}>Présence</Text>
                <View style={[S.barTrack, { flex: 1 }]}>
                  <View style={[S.barFill, { width: (avgP / 100) * 140, backgroundColor: pCol(avgP) }]} />
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ width: 40, fontSize: 7, color: C.g3 }}>Volume</Text>
                <View style={[S.barTrack, { flex: 1 }]}>
                  <View style={[S.barFill, { width: (pct / 100) * 140, backgroundColor: C.blue }]} />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Alerts */}
      <Text style={[S.sectionLabel, { marginTop: 16 }]}>ALERTES PÉDAGOGIQUES</Text>
      {alerts.length === 0 ? (
        <View style={{ padding: 14, borderRadius: 6, backgroundColor: C.greenDim, borderWidth: 1, borderColor: C.green }}>
          <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 10, color: C.green }}>
            {"✓ Aucune alerte — tous les indicateurs sont dans les normes"}
          </Text>
        </View>
      ) : (
        alerts.map(m => {
          const p   = pm[m.id] ?? 80
          const pct = Math.round((m.hEffectues / m.heures) * 100)
          return (
            <View key={m.id} style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, padding: 10, borderRadius: 6, backgroundColor: C.redDim, borderWidth: 1, borderColor: C.red }}>
              <View style={{ width: 3, height: 28, borderRadius: 2, backgroundColor: C.red, marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: C.white }}>{m.nom}</Text>
                <Text style={{ fontSize: 8, color: C.g2 }}>{m.enseignant} · {m.classe}</Text>
              </View>
              {p < 80 && (
                <View style={[S.badge, { backgroundColor: C.redDim, borderWidth: 1, borderColor: C.red, marginLeft: 6 }]}>
                  <Text style={[S.badgeTxt, { color: C.red }]}>Présence {p}%</Text>
                </View>
              )}
              {pct < 50 && (
                <View style={[S.badge, { backgroundColor: "#3a2a00", borderWidth: 1, borderColor: C.orange, marginLeft: 6 }]}>
                  <Text style={[S.badgeTxt, { color: C.orange }]}>Vol. {pct}%</Text>
                </View>
              )}
            </View>
          )
        })
      )}

      <View style={S.footer} fixed>
        <Text style={S.footerTxt}>FIINOR · Analyse Pédagogique · Confidentiel</Text>
        <Text style={S.footerTxt} render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </Page>
  )
}

/* ─── Document ─── */
function MatieresDoc({ data, pm }: { data: MatierePDF[]; pm: PresenceMapPDF }) {
  return (
    <Document
      title="FIINOR — Catalogue des Matières"
      author="FIINOR Infrastructure Pédagogique"
      subject="Rapport pédagogique"
      creator="FIINOR"
    >
      <CoverPage data={data} pm={pm} />
      <TablePage data={data} pm={pm} />
      <AnalyticsPage data={data} pm={pm} />
    </Document>
  )
}

/* ─── Export button ─── */
export function PDFExportButton({ matieres, presenceMap }: { matieres: MatierePDF[]; presenceMap: PresenceMapPDF }) {
  const now = new Date().toISOString().slice(0, 10)
  return (
    <PDFDownloadLink
      document={<MatieresDoc data={matieres} pm={presenceMap} />}
      fileName={`fiinor_matieres_${now}.pdf`}
    >
      {({ loading, error }) => (
        <span
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold cursor-pointer select-none transition-all"
          style={error
            ? { background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#F87171" }
            : loading
              ? { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }
              : { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#F87171" }
          }
        >
          <svg viewBox="0 0 16 16" style={{ width: 12, height: 12, fill: "currentColor", flexShrink: 0 }}>
            <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2zM4.5 11h7v1h-7zm0-2h7v1h-7zm0-2h3v1h-3z"/>
          </svg>
          {error ? "Erreur PDF" : loading ? "Génération…" : "Export PDF"}
        </span>
      )}
    </PDFDownloadLink>
  )
}
