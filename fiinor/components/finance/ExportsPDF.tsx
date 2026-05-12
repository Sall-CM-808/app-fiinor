import React from "react"
import {
  Document, Page, Text, View, StyleSheet, Font, Svg, Rect, Circle,
  PDFDownloadLink,
} from "@react-pdf/renderer"
import {
  TRANSACTIONS, ELEVES_ECHEANCIER, LIGNES_BUDGET, TAUX_CLASSE,
  KPI_FINANCE, formatGNF,
} from "./finance-mock-data"

/* ─── Fonts (same as RecuPaiementPDF) ─── */
Font.register({
  family: "DMSans",
  fonts: [
    { src: "/fonts/dm-sans/dm-sans-latin-400-normal.woff", fontWeight: 400 },
    { src: "/fonts/dm-sans/dm-sans-latin-700-normal.woff", fontWeight: 700 },
    { src: "/fonts/dm-sans/dm-sans-latin-400-italic.woff", fontWeight: 400, fontStyle: "italic" },
  ],
})

/* ─── Palette ─── */
const NAVY  = "#0D1F35"
const GOLD  = "#C9A84C"
const EM    = "#10B981"
const RD    = "#EF4444"
const AM    = "#F59E0B"
const BL    = "#3B82F6"
const GREY  = "#64748B"
const GLT   = "#F1F5F9"
const GBK   = "#E2E8F0"
const WHITE = "#FFFFFF"

/* ─── Shared styles ─── */
const shared = StyleSheet.create({
  page: { fontFamily: "DMSans", backgroundColor: WHITE, paddingBottom: 48, paddingHorizontal: 0, paddingTop: 0 },
  header: { backgroundColor: NAVY, paddingHorizontal: 36, paddingTop: 26, paddingBottom: 22, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  logo: { fontSize: 20, fontWeight: 700, color: GOLD, letterSpacing: 2 },
  logoSub: { fontSize: 6.5, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2, marginTop: 3 },
  docTitle: { fontSize: 11, fontWeight: 700, color: WHITE, letterSpacing: 0.5, textAlign: "right" },
  docSub: { fontSize: 7.5, color: "rgba(255,255,255,0.45)", textAlign: "right", marginTop: 3 },
  accent: { height: 3, backgroundColor: GOLD },
  body: { paddingHorizontal: 36, paddingTop: 20 },
  sectionTitle: { fontSize: 7.5, fontWeight: 700, color: GREY, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 8, marginTop: 18 },
  tableHead: { flexDirection: "row", backgroundColor: NAVY, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 7, marginBottom: 1 },
  th: { fontSize: 6.5, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: 0.8, textTransform: "uppercase" },
  row: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 8, borderBottom: `1px solid ${GBK}`, alignItems: "center" },
  rowAlt: { backgroundColor: GLT },
  td: { fontSize: 8, color: NAVY },
  tdMuted: { fontSize: 7.5, color: GREY, fontStyle: "italic" },
  pill: { borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1.5 },
  pillTxt: { fontSize: 6, fontWeight: 700 },
  kpiGrid: { flexDirection: "row", gap: 10, marginBottom: 16 },
  kpiCard: { flex: 1, backgroundColor: NAVY, borderRadius: 8, padding: 14 },
  kpiVal: { fontSize: 15, fontWeight: 700, color: WHITE },
  kpiLbl: { fontSize: 6, color: "rgba(255,255,255,0.35)", letterSpacing: 1.2, textTransform: "uppercase", marginTop: 4 },
  footer: { position: "absolute", bottom: 14, left: 36, right: 36, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  footerTxt: { fontSize: 6.5, color: GREY },
  footerBrand: { fontSize: 7, fontWeight: 700, color: GOLD, letterSpacing: 1 },
  progressTrack: { height: 4, backgroundColor: GBK, borderRadius: 2 },
  progressFill: { height: 4, borderRadius: 2 },
  watermark: { position: "absolute", top: "35%", left: "10%", fontSize: 60, fontWeight: 700, color: "rgba(201,168,76,0.04)", transform: "rotate(-28deg)", letterSpacing: 6 },
})

/* ─── helpers ─── */
const fmt = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Md GNF`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M GNF`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} K GNF`
  return `${n.toLocaleString("fr-FR")} GNF`
}
const fmtD = (d: string) => new Date(d).toLocaleDateString("fr-FR")
const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })

/* ─── Shared Header ─── */
function PdfHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <>
      <View style={shared.header}>
        <View>
          <Text style={shared.logo}>FIINOR</Text>
          <Text style={shared.logoSub}>Système de gestion académique — Université de Conakry</Text>
        </View>
        <View>
          <Text style={shared.docTitle}>{title}</Text>
          <Text style={shared.docSub}>{subtitle}</Text>
          <Text style={[shared.docSub, { marginTop: 2 }]}>Généré le {today}</Text>
        </View>
      </View>
      <View style={shared.accent} />
    </>
  )
}

/* ─── Shared Footer ─── */
function PdfFooter({ pageLabel }: { pageLabel?: string }) {
  return (
    <View style={shared.footer} fixed>
      <Text style={shared.footerTxt}>Fiinor ERP · finances@univ-conakry.edu.gn</Text>
      <Text style={shared.footerBrand}>FIINOR</Text>
      <Text style={shared.footerTxt}>{pageLabel ?? today}</Text>
    </View>
  )
}

/* ══════════════════════════════════════════════════════
   1. JOURNAL COMPTABLE
══════════════════════════════════════════════════════ */
const TYPE_LABELS: Record<string, string> = {
  recette: "Recette", dépense: "Dépense", virement_interne: "Virement"
}
const TYPE_COLORS: Record<string, string> = {
  recette: EM, dépense: RD, virement_interne: GOLD
}

export function JournalComptablePDF({ periode }: { periode: string }) {
  const totalCredits = TRANSACTIONS.filter(t => t.type === "recette").reduce((s, t) => s + t.credit, 0)
  const totalDebits  = TRANSACTIONS.filter(t => t.type === "dépense").reduce((s, t) => s + t.debit, 0)
  const solde = TRANSACTIONS.at(-1)?.solde ?? 0

  return (
    <Document title="Journal Comptable — Fiinor" author="Fiinor ERP">
      <Page size="A4" orientation="landscape" style={shared.page}>
        <PdfHeader title="JOURNAL COMPTABLE" subtitle={`Période : ${periode}`} />
        <View style={shared.body}>
          <Text style={shared.watermark}>FIINOR</Text>

          {/* KPIs */}
          <View style={shared.kpiGrid}>
            {[
              { lbl: "Total crédits",  val: fmt(totalCredits), color: EM },
              { lbl: "Total débits",   val: fmt(totalDebits),  color: RD },
              { lbl: "Solde courant",  val: fmt(solde),        color: GOLD },
              { lbl: "Nb transactions",val: String(TRANSACTIONS.length), color: BL },
            ].map(k => (
              <View key={k.lbl} style={shared.kpiCard}>
                <Text style={[shared.kpiVal, { color: k.color }]}>{k.val}</Text>
                <Text style={shared.kpiLbl}>{k.lbl}</Text>
              </View>
            ))}
          </View>

          <Text style={shared.sectionTitle}>Détail des transactions</Text>

          {/* Table head */}
          <View style={shared.tableHead}>
            {[["Date",1],["Référence",1.4],["Libellé",3],["Unité",2],["Type",1.1],["Débit",1.4],["Crédit",1.4],["Solde",1.4]].map(([h, f]) => (
              <Text key={String(h)} style={[shared.th, { flex: Number(f), textAlign: [5,6,7].includes(Number(f)) ? "right" : "left" }]}>{h}</Text>
            ))}
          </View>

          {TRANSACTIONS.map((tx, i) => (
            <View key={tx.id} style={[shared.row, i % 2 === 1 ? shared.rowAlt : {}]}>
              <Text style={[shared.td, { flex: 1 }]}>{fmtD(tx.date)}</Text>
              <Text style={[shared.tdMuted, { flex: 1.4 }]}>{tx.reference}</Text>
              <Text style={[shared.td, { flex: 3, fontWeight: 700 }]}>{tx.libelle}</Text>
              <Text style={[shared.tdMuted, { flex: 2 }]}>{tx.unite}</Text>
              <View style={{ flex: 1.1 }}>
                <View style={[shared.pill, { backgroundColor: `${TYPE_COLORS[tx.type]}15` }]}>
                  <Text style={[shared.pillTxt, { color: TYPE_COLORS[tx.type] }]}>
                    {TYPE_LABELS[tx.type]}
                  </Text>
                </View>
              </View>
              <Text style={[shared.td, { flex: 1.4, textAlign: "right", color: tx.debit > 0 ? RD : GREY }]}>
                {tx.debit > 0 ? fmt(tx.debit) : "—"}
              </Text>
              <Text style={[shared.td, { flex: 1.4, textAlign: "right", color: tx.credit > 0 ? EM : GREY }]}>
                {tx.credit > 0 ? fmt(tx.credit) : "—"}
              </Text>
              <Text style={[shared.td, { flex: 1.4, textAlign: "right", fontWeight: 700 }]}>
                {fmt(tx.solde)}
              </Text>
            </View>
          ))}
        </View>
        <PdfFooter />
      </Page>
    </Document>
  )
}

/* ══════════════════════════════════════════════════════
   2. BALANCE GÉNÉRALE
══════════════════════════════════════════════════════ */
const COMPTES = [
  { code: "701", libelle: "Frais de scolarité",   debit: 0,          credit: 134_000_000, solde: 134_000_000 },
  { code: "706", libelle: "Droits d'inscription", debit: 0,          credit: 22_500_000,  solde: 22_500_000 },
  { code: "708", libelle: "Autres recettes",       debit: 0,          credit: 9_200_000,   solde: 9_200_000 },
  { code: "611", libelle: "Salaires enseignants",  debit: 68_000_000, credit: 0,           solde: -68_000_000 },
  { code: "612", libelle: "Salaires admin",         debit: 24_500_000, credit: 0,           solde: -24_500_000 },
  { code: "621", libelle: "Fournitures",            debit: 4_200_000,  credit: 0,           solde: -4_200_000 },
  { code: "631", libelle: "Maintenance",            debit: 3_800_000,  credit: 0,           solde: -3_800_000 },
  { code: "641", libelle: "Électricité & eau",      debit: 2_900_000,  credit: 0,           solde: -2_900_000 },
  { code: "651", libelle: "Internet & télécom",     debit: 1_400_000,  credit: 0,           solde: -1_400_000 },
  { code: "512", libelle: "Banque",                 debit: 165_700_000,credit: 102_000_000, solde: 63_700_000 },
  { code: "530", libelle: "Caisse",                 debit: 18_000_000, credit: 12_500_000,  solde: 5_500_000 },
]

export function BalanceGeneralePDF({ periode }: { periode: string }) {
  const totalD = COMPTES.reduce((s, c) => s + c.debit, 0)
  const totalC = COMPTES.reduce((s, c) => s + c.credit, 0)

  return (
    <Document title="Balance Générale — Fiinor" author="Fiinor ERP">
      <Page size="A4" style={shared.page}>
        <PdfHeader title="BALANCE GÉNÉRALE" subtitle={`Période : ${periode}`} />
        <View style={shared.body}>
          <Text style={shared.watermark}>FIINOR</Text>

          {/* KPIs */}
          <View style={shared.kpiGrid}>
            {[
              { lbl: "Total mouvements débit",  val: fmt(totalD), color: RD },
              { lbl: "Total mouvements crédit", val: fmt(totalC), color: EM },
              { lbl: "Solde net",               val: fmt(totalC - totalD), color: totalC >= totalD ? EM : RD },
            ].map(k => (
              <View key={k.lbl} style={shared.kpiCard}>
                <Text style={[shared.kpiVal, { color: k.color }]}>{k.val}</Text>
                <Text style={shared.kpiLbl}>{k.lbl}</Text>
              </View>
            ))}
          </View>

          <Text style={shared.sectionTitle}>Plan comptable</Text>
          <View style={shared.tableHead}>
            {[["Code",0.7],["Compte",3.5],["Débit",1.8],["Crédit",1.8],["Solde",1.8],["Sens",0.8]].map(([h, f]) => (
              <Text key={String(h)} style={[shared.th, { flex: Number(f), textAlign: Number(f) === 0.8 ? "center" : [2,3,4].includes(Number(f)) ? "right" : "left" }]}>{h}</Text>
            ))}
          </View>
          {COMPTES.map((c, i) => (
            <View key={c.code} style={[shared.row, i % 2 === 1 ? shared.rowAlt : {}]}>
              <Text style={[shared.tdMuted, { flex: 0.7 }]}>{c.code}</Text>
              <Text style={[shared.td, { flex: 3.5, fontWeight: 700 }]}>{c.libelle}</Text>
              <Text style={[shared.td, { flex: 1.8, textAlign: "right", color: RD }]}>{fmt(c.debit)}</Text>
              <Text style={[shared.td, { flex: 1.8, textAlign: "right", color: EM }]}>{fmt(c.credit)}</Text>
              <Text style={[shared.td, { flex: 1.8, textAlign: "right", fontWeight: 700, color: c.solde >= 0 ? EM : RD }]}>
                {fmt(Math.abs(c.solde))}
              </Text>
              <View style={{ flex: 0.8, alignItems: "center" }}>
                <View style={[shared.pill, { backgroundColor: c.solde >= 0 ? `${EM}15` : `${RD}12` }]}>
                  <Text style={[shared.pillTxt, { color: c.solde >= 0 ? EM : RD }]}>{c.solde >= 0 ? "C" : "D"}</Text>
                </View>
              </View>
            </View>
          ))}

          {/* Totaux */}
          <View style={[shared.row, { backgroundColor: NAVY, borderRadius: 4, marginTop: 4 }]}>
            <Text style={[shared.th, { flex: 4.2 }]}>TOTAUX</Text>
            <Text style={[shared.th, { flex: 1.8, textAlign: "right", color: "#FCA5A5" }]}>{fmt(totalD)}</Text>
            <Text style={[shared.th, { flex: 1.8, textAlign: "right", color: "#6EE7B7" }]}>{fmt(totalC)}</Text>
            <Text style={[shared.th, { flex: 1.8, textAlign: "right", color: GOLD }]}>{fmt(Math.abs(totalC - totalD))}</Text>
            <Text style={{ flex: 0.8 }} />
          </View>
        </View>
        <PdfFooter />
      </Page>
    </Document>
  )
}

/* ══════════════════════════════════════════════════════
   3. RÉCAPITULATIF PAR CLASSE
══════════════════════════════════════════════════════ */
export function RecapClassePDF({ periode }: { periode: string }) {
  const total = ELEVES_ECHEANCIER.reduce((s, e) => s + e.totalDu, 0)
  const percu = ELEVES_ECHEANCIER.reduce((s, e) => s + e.totalPaye, 0)
  const taux  = Math.round((percu / total) * 100)

  return (
    <Document title="Récapitulatif par Classe — Fiinor" author="Fiinor ERP">
      <Page size="A4" style={shared.page}>
        <PdfHeader title="RÉCAPITULATIF PAR CLASSE" subtitle={`Taux de recouvrement — ${periode}`} />
        <View style={shared.body}>
          <Text style={shared.watermark}>FIINOR</Text>

          {/* Global KPIs */}
          <View style={shared.kpiGrid}>
            {[
              { lbl: "Total attendu",    val: fmt(total),  color: "rgba(255,255,255,0.7)" },
              { lbl: "Total encaissé",   val: fmt(percu),  color: EM },
              { lbl: "Solde impayé",     val: fmt(total - percu), color: RD },
              { lbl: "Taux global",      val: `${taux}%`,  color: taux >= 80 ? EM : taux >= 60 ? AM : RD },
            ].map(k => (
              <View key={k.lbl} style={shared.kpiCard}>
                <Text style={[shared.kpiVal, { color: k.color }]}>{k.val}</Text>
                <Text style={shared.kpiLbl}>{k.lbl}</Text>
              </View>
            ))}
          </View>

          {/* Taux par classe */}
          <Text style={shared.sectionTitle}>Taux de recouvrement par promotion</Text>
          <View style={shared.tableHead}>
            {[["Classe",2],["Effectif",1],["Taux",1.2],["Progression",3],["Statut",1.2]].map(([h, f]) => (
              <Text key={String(h)} style={[shared.th, { flex: Number(f) }]}>{h}</Text>
            ))}
          </View>
          {TAUX_CLASSE.map((c, i) => {
            const color = c.taux >= 80 ? EM : c.taux >= 60 ? AM : RD
            return (
              <View key={c.classe} style={[shared.row, i % 2 === 1 ? shared.rowAlt : {}]}>
                <Text style={[shared.td, { flex: 2, fontWeight: 700 }]}>{c.classe}</Text>
                <Text style={[shared.tdMuted, { flex: 1, textAlign: "center" }]}>{c.effectif} étudiants</Text>
                <Text style={[shared.td, { flex: 1.2, fontWeight: 700, textAlign: "center", color }]}>{c.taux}%</Text>
                <View style={{ flex: 3, paddingRight: 12 }}>
                  <View style={shared.progressTrack}>
                    <View style={[shared.progressFill, { width: `${c.taux}%`, backgroundColor: color }]} />
                  </View>
                </View>
                <View style={{ flex: 1.2 }}>
                  <View style={[shared.pill, { backgroundColor: `${color}15` }]}>
                    <Text style={[shared.pillTxt, { color }]}>
                      {c.taux >= 80 ? "Bon" : c.taux >= 60 ? "Moyen" : "Faible"}
                    </Text>
                  </View>
                </View>
              </View>
            )
          })}

          {/* Détail étudiants */}
          <Text style={shared.sectionTitle}>Détail par étudiant</Text>
          <View style={shared.tableHead}>
            {[["Matricule",1.5],["Nom",2.5],["Classe",1.2],["Total dû",1.5],["Payé",1.5],["Reste",1.5],["Statut",1.2]].map(([h, f]) => (
              <Text key={String(h)} style={[shared.th, { flex: Number(f), textAlign: [3,4,5].includes(Number(f)) ? "right" : "left" }]}>{h}</Text>
            ))}
          </View>
          {ELEVES_ECHEANCIER.map((e, i) => {
            const statutCfg: Record<string, { lbl: string; color: string }> = {
              payé:      { lbl: "Payé",      color: EM },
              partiel:   { lbl: "Partiel",   color: AM },
              en_retard: { lbl: "En retard", color: RD },
              non_payé:  { lbl: "Non payé",  color: GREY },
            }
            const sc = statutCfg[e.statut]
            return (
              <View key={e.id} style={[shared.row, i % 2 === 1 ? shared.rowAlt : {}]}>
                <Text style={[shared.tdMuted, { flex: 1.5 }]}>{e.matricule}</Text>
                <Text style={[shared.td, { flex: 2.5, fontWeight: 700 }]}>{e.nom} {e.prenom}</Text>
                <Text style={[shared.tdMuted, { flex: 1.2 }]}>{e.classe}</Text>
                <Text style={[shared.td, { flex: 1.5, textAlign: "right" }]}>{fmt(e.totalDu)}</Text>
                <Text style={[shared.td, { flex: 1.5, textAlign: "right", color: EM }]}>{fmt(e.totalPaye)}</Text>
                <Text style={[shared.td, { flex: 1.5, textAlign: "right", color: e.totalDu > e.totalPaye ? RD : EM }]}>
                  {fmt(Math.max(0, e.totalDu - e.totalPaye))}
                </Text>
                <View style={{ flex: 1.2 }}>
                  <View style={[shared.pill, { backgroundColor: `${sc.color}15` }]}>
                    <Text style={[shared.pillTxt, { color: sc.color }]}>{sc.lbl}</Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
        <PdfFooter />
      </Page>
    </Document>
  )
}

/* ══════════════════════════════════════════════════════
   4. BUDGET PRÉVISIONNEL VS RÉALISÉ
══════════════════════════════════════════════════════ */
export function BudgetPDF({ periode }: { periode: string }) {
  const depenses  = LIGNES_BUDGET.filter(l => l.type === "dépense")
  const recettes  = LIGNES_BUDGET.filter(l => l.type === "recette")
  const totPrevD  = depenses.reduce((s, l) => s + l.previsionnel, 0)
  const totReelD  = depenses.reduce((s, l) => s + l.realise, 0)
  const totPrevR  = recettes.reduce((s, l) => s + l.previsionnel, 0)
  const totReelR  = recettes.reduce((s, l) => s + l.realise, 0)

  return (
    <Document title="Budget Prévisionnel — Fiinor" author="Fiinor ERP">
      <Page size="A4" style={shared.page}>
        <PdfHeader title="BUDGET PRÉVISIONNEL vs RÉALISÉ" subtitle={`Exercice : ${periode}`} />
        <View style={shared.body}>
          <Text style={shared.watermark}>FIINOR</Text>

          <View style={shared.kpiGrid}>
            {[
              { lbl: "Recettes prévisionnelles", val: fmt(totPrevR), color: "rgba(255,255,255,0.65)" },
              { lbl: "Recettes réalisées",        val: fmt(totReelR), color: EM },
              { lbl: "Dépenses prévisionnelles",  val: fmt(totPrevD), color: "rgba(255,255,255,0.65)" },
              { lbl: "Dépenses réalisées",         val: fmt(totReelD), color: RD },
            ].map(k => (
              <View key={k.lbl} style={shared.kpiCard}>
                <Text style={[shared.kpiVal, { color: k.color }]}>{k.val}</Text>
                <Text style={shared.kpiLbl}>{k.lbl}</Text>
              </View>
            ))}
          </View>

          {(["recette", "dépense"] as const).map(type => {
            const lines = LIGNES_BUDGET.filter(l => l.type === type)
            const accent = type === "recette" ? EM : RD
            return (
              <React.Fragment key={type}>
                <Text style={[shared.sectionTitle, { color: accent }]}>
                  {type === "recette" ? "Recettes" : "Dépenses"} — Prévisionnel vs Réalisé
                </Text>
                <View style={shared.tableHead}>
                  {[["Unité / Libellé",3.5],["Prévisionnel",1.8],["Réalisé",1.8],["Écart",1.5],["Taux",0.9],["Barre",2]].map(([h, f]) => (
                    <Text key={String(h)} style={[shared.th, { flex: Number(f), textAlign: [1,2,3].includes(Number(f)) ? "right" : "left" }]}>{h}</Text>
                  ))}
                </View>
                {lines.map((l, i) => {
                  const pct = Math.min(140, l.pourcentage)
                  const color = l.ecart >= 0 ? EM : RD
                  return (
                    <View key={l.id} style={[shared.row, i % 2 === 1 ? shared.rowAlt : {}]}>
                      <View style={{ flex: 3.5 }}>
                        <Text style={[shared.td, { fontWeight: 700 }]}>{l.unite}</Text>
                        <Text style={[shared.tdMuted, { marginTop: 1 }]}>{l.libelle}</Text>
                      </View>
                      <Text style={[shared.td, { flex: 1.8, textAlign: "right" }]}>{fmt(l.previsionnel)}</Text>
                      <Text style={[shared.td, { flex: 1.8, textAlign: "right", color: accent }]}>{fmt(l.realise)}</Text>
                      <Text style={[shared.td, { flex: 1.5, textAlign: "right", color }]}>
                        {l.ecart >= 0 ? "+" : ""}{fmt(l.ecart)}
                      </Text>
                      <Text style={[shared.td, { flex: 0.9, textAlign: "center", fontWeight: 700, color }]}>{l.pourcentage}%</Text>
                      <View style={{ flex: 2, paddingRight: 6 }}>
                        <View style={shared.progressTrack}>
                          <View style={[shared.progressFill, { width: `${Math.min(100, pct)}%`, backgroundColor: accent }]} />
                        </View>
                      </View>
                    </View>
                  )
                })}
              </React.Fragment>
            )
          })}
        </View>
        <PdfFooter />
      </Page>
    </Document>
  )
}

/* ══════════════════════════════════════════════════════
   EXPORT DOWNLOAD BUTTONS
   Must live in same module as Document components
══════════════════════════════════════════════════════ */
type ExportKey = "journal" | "balance" | "classe" | "budget"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DOCS: Record<ExportKey, (periode: string) => React.ReactElement<any>> = {
  journal: p => <JournalComptablePDF periode={p} />,
  balance: p => <BalanceGeneralePDF periode={p} />,
  classe:  p => <RecapClassePDF periode={p} />,
  budget:  p => <BudgetPDF periode={p} />,
}

const FILE_NAMES: Record<ExportKey, string> = {
  journal: "fiinor-journal-comptable.pdf",
  balance: "fiinor-balance-generale.pdf",
  classe:  "fiinor-recapitulatif-classes.pdf",
  budget:  "fiinor-budget-previsionnel.pdf",
}

interface ExportDownloadButtonProps {
  type: ExportKey
  periode: string
}

export function ExportDownloadButton({ type, periode }: ExportDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={DOCS[type](periode)}
      fileName={FILE_NAMES[type]}
      style={{
        flex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        borderRadius: 12,
        padding: "10px 14px",
        background: "#C9A84C",
        color: "#000",
        fontFamily: "inherit",
        fontSize: 11,
        fontWeight: 900,
        textDecoration: "none",
        border: "none",
        whiteSpace: "nowrap",
        cursor: "pointer",
        minWidth: 0,
      }}>
      {({ loading }) => loading ? "Génération…" : "Télécharger PDF"}
    </PDFDownloadLink>
  )
}
