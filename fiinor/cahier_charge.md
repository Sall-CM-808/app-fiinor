FIINOR
Cahier des Charges Technique & Fonctionnel
"Une infrastructure pédagogique universelle —
conçue pour gérer un pays, pas une école."
Version 1.0 · Avril 2026 · Confidentiel
Sommaire
01 Présentation du Projet 3
02 Vision & Positionnement Stratégique 4
03 Architecture Technique 5
04 Modules Fonctionnels 6
05 Moteur de Formules de Notation 8
06 Système de Bulletins 9
07 Module Finance Intégré 10
08 Module Affiliation & Parrainage 11
09 Sécurité & Permissions 12
10 Tableau Comparatif Concurrentiel 13
11 Roadmap & Jalons 14
12 Équipe & Gouvernance 15
01 · Présentation du Projet
Fiinor est une plateforme SaaS de gestion éducative multi-tenant conçue pour répondre aux besoins
des établissements scolaires, des universités, des centres de formation professionnelle et des réseaux
d'enseignement à l'échelle régionale et nationale. Le projet est né du constat que les solutions
existantes sur le marché africain sont soit mono-établissement, soit rigides dans leurs règles
pédagogiques, soit dépendantes de logiciels comptables externes — rendant leur adoption complexe et
coûteuse.
Fiinor répond à ces trois lacunes avec une architecture pensée dès la conception pour l'universalité, la
configurabilité et la scalabilité.
Informations Générales
Nom du produit Fiinor
Catégorie SaaS EdTech — Gestion éducative
Modèle Multi-tenant, abonnement mensuel/annuel
Stack principale Python / Django · PostgreSQL · Next.js
Cible principale Guinée, Afrique de l'Ouest, marché francophone
Statut Développement actif — V1 en cours
02 · Vision & Positionnement Stratégique
Là où ses concurrents gèrent une école, Fiinor gère un système éducatif entier. La vision est de devenir
l'infrastructure pédagogique de référence pour l'Afrique francophone — de la salle de classe jusqu'au
ministère.
"Fiinor n'est pas un logiciel scolaire. C'est une infrastructure pédagogique universelle. Les
119 autres projets gèrent une école. Fiinor gère un pays."
Problème résolu
■ Fragmentation : Chaque établissement utilise un outil différent. Zéro interopérabilité.
■ Rigidité pédagogique : Les règles de notation sont codées en dur — impossible de les adapter sans
intervention technique.
■ Dépendances externes : La finance, la comptabilité, l'affiliation sont gérées dans des logiciels
séparés.
■ Mono-tenant : Une installation = un établissement. Pas de vision réseau.
Proposition de valeur
• Une seule plateforme, N organisations complètement isolées
• Moteur de formules programmable — chaque établissement définit ses propres règles
• Finance, comptabilité analytique et affiliation intégrées nativement
• Bulletins versionnés, multilingues, multi-format sur le même moteur
• Hiérarchie éducative infinie — de la classe au réseau national
03 · Architecture Technique
L'architecture de Fiinor suit le paradigme multi-tenant isolé avec séparation stricte des données par
organisation. Chaque tenant possède son propre espace logique, son domaine, ses configurations et
son branding — sur une infrastructure partagée.
Stack Technique
Couche Technologie Rôle
Backend Python / Django REST Framework API RESTful, logique métier, ORM
Base de données PostgreSQL Données relationnelles, multi-tenant via schema
Frontend Next.js / TypeScript Interface utilisateur réactive
Auth JWT + Session + X-Organisation-Id headerIsolation tenant, RBAC
Templates Jinja2 Génération bulletins HTML/PDF
Moteur de règles AST Engine propriétaire (Python) Formules notation, règles admission
Tâches async Celery + Redis Calcul de moyennes, génération PDF
Déploiement Docker / Kubernetes Scalabilité horizontale
Principe Multi-Tenant
L'isolation entre organisations est garantie à trois niveaux : (1) au niveau HTTP via le header
X-Organisation-Id présent dans chaque requête, (2) au niveau ORM via des querysets filtrés
automatiquement par tenant, (3) au niveau données via des contraintes de clés étrangères rattachées à
chaque organisation. Un utilisateur d'une organisation ne peut jamais accéder aux données d'une autre.
04 · Modules Fonctionnels
Structure Éducative
• Modèle hiérarchique récursif UniteStructurelle
• Types : Réseau → Établissement → Faculté → Département → Classe
• Profondeur illimitée — gestion réseau national possible
• Admin unique pour tout le réseau
• Propagation descendante des configurations
Gestion des Personnes (Elements)
• Concept Element + ElementRole : une fiche, N rôles
• Roles : Étudiant, Enseignant, Tuteur, Admin, Directeur…
• Zéro duplication — un enseignant aussi tuteur = 1 fiche, 2 rôles
• Onboarding configurable par type d'établissement
Pédagogie
• Inscription aux matières (et non seulement aux classes)
• Emploi du temps avec créneaux horaires précis
• Volume horaire calculé automatiquement
• Cours liés aux créneaux — présence traçable
• Périodes académiques configurables
Notation & Évaluation
• Évaluations multi-types (DS, examen, TP, oral…)
• Coefficients configurables par évaluation et par matière
• Calcul automatique via moteur de formules (voir §05)
• Historique de calcul immuable et auditable
Admission & Délibération
• Règles d'admission en chaînage booléen (voir §05)
• Décisions : Admis, Rattrapage, Ajourné, Exclu, Custom
• Propagation descendante depuis Faculté vers Promotions
• Workflow de délibération avec approbation
Bulletins Scolaires
• Système 3 couches : Paramétrage + Gabarit + Bulletin versionné
• Formats multiples : /20 français, GPA, crédits ECTS, compétences
• Templates Jinja2 personnalisables par établissement
• Snapshot immuable à la publication — historique inaltérable
05 · Moteur de Formules de Notation
C'est le différenciateur #1 de Fiinor. Aucun concurrent sur le marché africain ne propose un moteur
de formules programmable par l'utilisateur. Les règles de calcul de notes ne sont plus codées en dur
dans le logiciel — elles sont définies par le directeur pédagogique via une interface dédiée, sans ligne
de code.
Architecture du Moteur
Composant Rôle
AST Validator Valide la syntaxe de l'expression avant sauvegarde
Preprocessor Résout les variables contextuelles (notes, absences, crédits...)
Type Checker Vérifie la cohérence des types (nombre vs booléen)
Sandbox Engine Exécute l'expression dans un environnement isolé et sécurisé
Exemples de Formules Configurables
Lycée français classique
moyenne = (DS * 0.3 + examen * 0.7) / 20
École d'ingénieurs (GPA 4.0)
gpa = somme(note * credits) / somme(credits)
Université avec compensation
admis = (moy_semestre >= 10) OR (moy_annee >= 12 AND matieres_sous_10 <= 2)
École avec bonus assiduité
note_finale = (note_brute * coeff) + (presence_pct > 0.9 ? 1.5 : 0)
Les formules s'appliquent à 4 scopes : évaluation individuelle, matière, unité structurelle, et période
académique. Avec propagate_to_children=True, une formule configurée au niveau Faculté se
propage automatiquement à tous les départements et classes.
06 · Système de Bulletins Scolaires
Le moteur de bulletins de Fiinor repose sur une architecture à 3 couches indépendantes qui
permettent une personnalisation totale sans compromettre l'intégrité des données.
Couche 1 — Paramétrage (ParametrageBulletin)
Définit les métriques disponibles via un champ JSON : moyenne, rang, mention, crédits ECTS, GPA,
compétences validées. Supporte les labels multilingues (français, anglais, arabe) et les options
d'affichage (sections visibles, arrondi).
Couche 2 — Gabarit (GabaritBulletin)
Template HTML/CSS Jinja2 versionné, avec logo, palette de couleurs et polices configurables par
établissement. Un gabarit peut être global ou spécifique à une unité structurelle. Chaque version du
gabarit est archivée.
Couche 3 — Bulletin Versionné (BulletinScolaire)
Le bulletin publié est un snapshot immuable. Il capture les métriques calculées, le contexte de calcul
(qui, quand, quelle formule, quelle version), et suit un workflow : draft → published → archived.
L'historique est inaltérable.
Formats supportés sur le même moteur
Établissement Format de notation
Lycée français Moyennes /20, rang, mention (Passable / Bien / Très Bien)
Université technique GPA 4.0, crédits ECTS par UE
École internationale Grades lettres S / A / B / C / D
Centre de formation professionnelle Compétences validées / en cours / non acquises
07 · Module Finance Intégré
Fiinor intègre nativement un module financier complet. Aucune passerelle vers un logiciel comptable
externe n'est nécessaire. Les établissements gèrent en une seule interface les frais de scolarité, la
comptabilité analytique et les paiements.
Modèle Description
Transaction + TransactionLigne Comptabilité en partie double, journaux d'écritures
PlanEcheancier + Echeance Frais de scolarité échelonnés avec suivi des paiements
RapprochementBancaire Rapprochement automatique des opérations bancaires
Journal + PeriodeComptable Comptabilité générale par période académique
ImputationParUnite Budget analytique par département / classe / projet
MoyenPaiement Multi-moyens : espèces, virement, mobile money (Orange Money, Wave)
BudgetPrevisionnel Prévisions budgétaires annuelles par unité
Le module supporte plusieurs devises (GNF, XOF, EUR, USD) et est configuré par organisation. Les
rapports financiers sont exportables en PDF et Excel.
08 · Module Affiliation & Parrainage
Le module Referral est un système SaaS d'affiliation complet intégré nativement dans Fiinor. Il
transforme chaque utilisateur satisfait en ambassadeur commercial — le réseau grandit de manière
organique.
"Notre modèle de croissance est intégré dans le produit. Chaque directeur satisfait devient
un commercial. C'est un réseau d'affiliation pédagogique — unique dans ce secteur."
ReferralAffiliate — Profil affilié avec KYC et informations fiscales
ReferralLink — Liens de parrainage uniques avec tracking UTM intégré
ReferralClick — Suivi des clics avec détection de fraude automatique
ReferralAttribution — Fenêtre d'attribution configurable (défaut : 30 jours)
CommissionPlan + CommissionRule — Plans de commission par type d'abonnement, récurrents ou
ponctuels
AffiliateBalanceEntry — Ledger interne (wallet) — historique de tous les gains
Payout — Workflow de paiement avec approbation avant versement
09 · Sécurité & Permissions
Fiinor implémente un système de contrôle d'accès à base de rôles (RBAC) enrichi d'un scoping par
unité structurelle. Un administrateur de lycée ne peut jamais accéder aux données d'une université sur
la même infrastructure.
• Décorateur @requiert_permission
Chaque endpoint API déclare explicitement sa permission requise.
• Scoping par unité
Les permissions sont contextualisées par branche de la hiérarchie éducative.
• PermissionObjectGrant
Permissions objet-par-objet pour les cas ultra-précis (ex : accès à un dossier étudiant spécifique).
• Audit log complet
Chaque action est tracée : qui, quoi, quand, depuis quelle IP, sur quel objet.
• Isolation tenant
Triple isolation : HTTP header, ORM queryset, contrainte DB.
• Moteur de formules sandboxé
L'exécution des expressions utilisateur se fait dans un environnement isolé — aucun accès au système.
10 · Tableau Comparatif Concurrentiel
Positionnement de Fiinor face aux solutions existantes sur le marché africain et international.
Fonctionnalité Concurrents typiques Fiinor
Multi-tenant 1 instance = 1 école 1 instance = N organisations isolées
Formules notation Hardcodées dans le code Moteur d'expressions programmable par l'utilisateur
Règles d'admission Fixes, non modifiables Chaînage booléen configurable + propagation
Bulletins Template fixe unique 3 couches : paramétrage + gabarit Jinja2 + snapshot verFinance Logiciel externe requis 17 modèles comptables natifs
Affiliation Inexistant Module SaaS complet avec wallet et payout
Gestion des rôles Comptes séparés par rôle 1 Element, N rôles, zéro duplication
Hiérarchie 2-3 niveaux maximum Infinie — de la salle au réseau national
Multi-devise Non ou partiel GNF, XOF, EUR, USD configurables par tenant
Multilingue Langue unique Labels i18n par métrique et par établissement
11 · Roadmap & Jalons
Phase Période Livrables
Phase 1 — Core T1–T2 2026 Multi-tenant, Structure éducative, Gestion des personnes, Notation de base
Phase 2 — Pédagogie T2–T3 2026 Moteur de formules V1, Règles d'admission, Bulletins 3 couches
Phase 3 — Finance T3 2026 Module finance complet, Plan d'échéancier, Mobile money
Phase 4 — Growth T4 2026 Module affiliation complet, Tableau de bord analytics, API publique
Phase 5 — Scale T1 2027 Application mobile, Intégration ministères, Offre réseau national
La roadmap est indicative et peut être ajustée selon les retours des établissements pilotes et les
opportunités de financement. La priorité absolue reste la solidité du core multi-tenant et du moteur de
formules — les deux différenciateurs fondamentaux.
12 · Équipe & Gouvernance
Fiinor est un projet guinéen, conçu et développé localement, avec l'ambition de devenir une référence
africaine.
Valeurs du projet
• Souveraineté technologique — un outil africain pour les réalités africaines
• Configurabilité radicale — zéro hardcoding pédagogique
• Accessibilité financière — modèle tarifaire adapté aux économies locales
• Open roadmap — les établissements pilotes influencent le développement
• Sécurité by design — isolation des données garantie architecturalement
"Fiinor n'est pas une application scolaire de plus.
C'est l'infrastructure que l'Afrique éducative attendait."
Document produit en Avril 2026 — Version 1.0 — Confidentiel