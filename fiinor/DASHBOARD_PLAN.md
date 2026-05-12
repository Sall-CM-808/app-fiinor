# Fiinor Dashboard — Plan d'Implémentation

> Référence visuelle : `public/image-fiinor/Gemini_Generated_Image_xxnv8kxxnv8kxxnv.png`
> Cahier des charges : `fiinor/cahier_charge.md`
> Créé le : Avril 2026

---

## Analyse Visuelle (image de référence)

Le dashboard cible est un **dark mode premium** avec :
- Sidebar gauche avec navigation iconique + labels
- Header avec titre, user info, search bar
- KPI cards en haut (Total Établissements, Effectif, Taux de réussite, Budget)
- Carte du monde interactive avec pins établissements
- Tableau de performances par réseau + classement par région
- Graphiques : ligne (inscriptions 5 ans), barres groupées (budget par secteur), donut (répartition éducative)
- Panel notifications live
- Aesthetic : **dark navy/charcoal + gold accent + vert émeraude** — luxe institutionnel africain

---

## Stack Choisie

| Couche | Technologie | Raison |
|--------|------------|--------|
| Framework | **Next.js 16 + TypeScript** (déjà installé) | App Router, RSC |
| UI Components | **shadcn/ui** (à init) | composants prêts, accessible |
| Charts | **Recharts** | composable, intégré shadcn Chart |
| Animations | **Framer Motion** | micro-interactions + stagger entrée |
| Styling | **Tailwind CSS v4** (déjà installé) | dark theme custom |
| Icons | **Lucide React** | iconLibrary shadcn standard |

---

## Phases d'Implémentation

### Phase 1 — Setup & Design System
> Statut : ✅ Terminé

**1.1 Init shadcn/ui** dans `/fiinor` avec preset `nova` (dark luxury)
```bash
npx shadcn@latest init --preset base-nova
```

**1.2 Installer les dépendances manquantes**
```bash
npm install recharts framer-motion lucide-react
```

**1.3 Design tokens** — CSS variables dans `globals.css` :
- `--color-gold: #C9A84C` (accent doré, marque Fiinor)
- `--color-navy: #0D1117` (fond sombre principal)
- `--color-emerald: #10B981` (indicateurs positifs)
- `--color-sidebar: #111827`
- Font : **DM Sans** (body) + **Syne** (headings)

---

### Phase 2 — Layout Shell (Sidebar + Header)
> Statut : ✅ Terminé

**Fichiers à créer :**
- `app/dashboard/layout.tsx` — layout root avec sidebar collapsible
- `components/sidebar/DashboardSidebar.tsx`
- `components/header/DashboardHeader.tsx`

**Structure Sidebar** (shadcn `Sidebar` component) :
```
Logo Fiinor (A doré + texte)
├── Tableau de Bord [actif]
├── Structure du Groupe
├── Pédagogie & Examens
├── Finances Académiques
├── Services aux Élèves
├── Ressources Humaines
├── Rapports & Analyses
└── Paramètres
```

Animation Framer Motion : `slideInLeft` stagger sur les items nav

**Header** : titre dynamique + badge utilisateur + `Command` palette (search)

---

### Phase 3 — KPI Cards (Stats en haut)
> Statut : ✅ Terminé

**Fichier :** `components/dashboard/KpiCards.tsx`

4 cards shadcn `Card` avec :
- **Total Établissements** : `120` + trend badge `+3.2%` (vert)
- **Effectif Total** : `850,000` + répartition genre
- **Taux de Réussite Global** : gauge radiale `78.5%` (Recharts `RadialBarChart`)
- **Budget Exécuté** : progress bar `12% de 1.2 Mds GNF`

Animation : `useInView` + stagger Framer Motion, chiffres qui s'incrémentent au mount (`useMotionValue` + `useTransform`)

---

### Phase 4 — Carte Mondiale & Tableau Performances
> Statut : ✅ Terminé

**4.1 Carte Monde** (`components/dashboard/WorldMap.tsx`)
- SVG world map statique stylisée + pins réactifs
- Pins : Conakry, Dakar, Abidjan, UK, UAE, USA
- Hover cards avec données établissement (shadcn `HoverCard`)
- Animation : pins `scaleIn` avec stagger, lignes de connexion SVG animées

**4.2 Tableau Performances Réseau** (`components/dashboard/NetworkPerformance.tsx`)
- shadcn `Table` custom avec color-coded rendement bars
- Données : Groupe Conakry, Groupe Abidjan, Réseau Dakar, Collèges Amériques

**4.3 Classement par Région** (`components/dashboard/RegionRanking.tsx`)
- Mini-tableau : Conakry, Labé, Kindia, Mamou, Faranah, Kankan, Nzérékoré
- Colonnes : Score moyen, Taux enrollment, Ratio teacher/student
- shadcn `Badge` pour les deltas

---

### Phase 5 — Graphiques Recharts
> Statut : ✅ Terminé

**5.1 Croissance Inscriptions 5 ans** (`components/charts/EnrollmentChart.tsx`)
- `AreaChart` avec gradient emerald, responsive
- Data : Ans 1→5, courbe montante

**5.2 Allocation Budgétaire par Secteur** (`components/charts/BudgetChart.tsx`)
- `BarChart` groupé : Salaires / Infrastructures / Matériel
- Par mois : Jan, Fév, Mar, Avr, Mai
- Couleurs : gold, emerald, slate

**5.3 Répartition Modèle Éducatif** (`components/charts/EducationModelChart.tsx`)
- `PieChart` donut : Public / Privé / Communautaire
- `innerRadius=50`, `paddingAngle=4`

Tous les charts : `useInView` pour déclencher animation à l'apparition, custom `Tooltip` aux couleurs du theme dark

---

### Phase 6 — Établissements Clés & Notifications
> Statut : ✅ Terminé

**6.1 Établissements Clés** (`components/dashboard/KeyEstablishments.tsx`)
- Cards flottantes stylisées
- Données : Lycée Moderne Conakry, Aether Int. School, Université Gam Al Abdel Nasser, Institut Supérieur Dakar
- shadcn `HoverCard` + badges performance

**6.2 Notifications Live** (`components/dashboard/NotificationsPanel.tsx`)
- Liste animée `AnimatePresence` Framer Motion
- shadcn `Avatar` + timestamp relatif
- 3 types : validation rapport, partenariat, bourse

---

### Phase 7 — Finitions & Polissage
> Statut : ✅ Terminé

- **Page transitions** : `app/dashboard/template.tsx` avec Framer Motion fade
- **Skeleton loading states** : shadcn `Skeleton` sur chaque section
- **Responsive** : layout 2-col sur tablette, stack sur mobile
- **Dark mode** : uniquement dark (institutionnel), tokens sémantiques shadcn
- **Accessibilité** : `accessibilityLayer` Recharts, `aria-label` charts, `useReducedMotion`

---

## Architecture Fichiers Finale

```
fiinor/
└── app/
    ├── dashboard/
    │   ├── layout.tsx          ← shell sidebar+header
    │   ├── template.tsx        ← page transitions FM
    │   └── page.tsx            ← dashboard assemblé
    └── globals.css             ← design tokens

components/
├── sidebar/
│   └── DashboardSidebar.tsx
├── header/
│   └── DashboardHeader.tsx
├── dashboard/
│   ├── KpiCards.tsx
│   ├── WorldMap.tsx
│   ├── NetworkPerformance.tsx
│   ├── RegionRanking.tsx
│   ├── KeyEstablishments.tsx
│   └── NotificationsPanel.tsx
└── charts/
    ├── EnrollmentChart.tsx
    ├── BudgetChart.tsx
    └── EducationModelChart.tsx
```

---

## Commandes de Setup (à exécuter dans `/fiinor`)

```bash
# 1. Init shadcn
npx shadcn@latest init --preset base-nova

# 2. Add components
npx shadcn@latest add sidebar card badge table avatar skeleton progress command hover-card

# 3. Deps
npm install recharts framer-motion lucide-react
```

---

## Suivi des Phases

| Phase | Description | Statut |
|-------|-------------|--------|
| 1 | Setup & Design System | ✅ Terminé |
| 2 | Layout Shell (Sidebar + Header) | ✅ Terminé |
| 3 | KPI Cards | ✅ Terminé |
| 4 | Carte Mondiale & Tableaux | ✅ Terminé |
| 5 | Graphiques Recharts | ✅ Terminé |
| 6 | Établissements & Notifications | ✅ Terminé |
| 7 | Finitions & Polissage | ✅ Terminé |
