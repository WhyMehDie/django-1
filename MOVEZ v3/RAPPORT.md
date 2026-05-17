<div align="center">
  <!-- Remplacer par le vrai logo -->
  <img src="https://via.placeholder.com/150x150?text=Logo+EMSI" alt="Logo EMSI" width="150" />
  
  <br/><br/>
  
  <h3>ÉCOLE MAROCAINE DES SCIENCES DE L'INGÉNIEUR</h3>
  <h4>Rapport de Projet de Fin d'Année (PFA) - 3ème année IIR</h4>
  
  <br/><br/>
  
  <h1><strong>MOVEZ : Plateforme Super-App Sportive</strong></h1>
  <h2>Matchmaking, Réservations et Compétitions E-Sportives</h2>
  
  <br/><br/>
  
  <p><strong>Réalisé par :</strong></p>
  <p>[Votre Nom et Prénom]<br/>[Nom de votre binôme (si applicable)]</p>
  
  <br/>
  
  <p><strong>Encadré par :</strong></p>
  <p>Dr. Tarik JAHID</p>
  
  <br/><br/>
  
  <p><strong>Année Universitaire : 2025/2026</strong></p>
</div>

<div style="page-break-after: always;"></div>

---

# Remerciements

Au terme de ce projet de fin d'année, nous tenons à exprimer notre profonde gratitude à notre encadrant, **Dr. Tarik JAHID**, pour son suivi, ses conseils judicieux et son accompagnement tout au long de la réalisation de ce projet. Ses directives nous ont permis de surmonter les défis techniques et de mener à bien notre travail.

Nos remerciements s'adressent également à l'ensemble du corps professoral et administratif de l'**École Marocaine des Sciences de l'Ingénieur (EMSI)** de Rabat, pour la qualité de la formation que nous avons reçue.

Enfin, nous remercions nos familles et nos proches pour leur soutien indéfectible durant nos études et la réalisation de ce projet.

<div style="page-break-after: always;"></div>

---

# Résumé / Abstract

**Résumé :**
Le présent rapport détaille la conception et le développement de **MOVEZ**, une "Super-App" web et mobile dédiée au sport amateur et semi-professionnel. Le projet vise à centraliser plusieurs services essentiels : la recherche d'adversaires de niveau similaire grâce à un système algorithmique basé sur le score ELO, la réservation d'infrastructures sportives et de sessions de coaching, ainsi que l'organisation de tournois avec génération automatique de brackets. Développée selon une architecture découplée (Frontend en React 19 et Backend en Django REST Framework), l'application intègre également des technologies modernes telles que les paiements sécurisés via Stripe et les communications en temps réel via WebSockets.

**Abstract :**
This report details the design and development of **MOVEZ**, a web and mobile "Super-App" dedicated to amateur and semi-professional sports. The project aims to centralize several essential services: finding opponents of similar skill levels using an algorithmic system based on the ELO score, booking sports venues and coaching sessions, and organizing tournaments with automated bracket generation. Developed using a decoupled architecture (Frontend in React 19 and Backend in Django REST Framework), the application also integrates modern technologies such as secure payments via Stripe and real-time communications via WebSockets.

<div style="page-break-after: always;"></div>

---

# Sommaire

1. [Introduction Générale](#introduction-générale)
2. [Chapitre 1 : Contexte du Projet & Analyse de l'Existant](#chapitre-1--contexte-du-projet--analyse-de-lexistant)
3. [Chapitre 2 : Conception et Modélisation (UML)](#chapitre-2--conception-et-modélisation-uml)
4. [Chapitre 3 : Réalisation et Implémentation](#chapitre-3--réalisation-et-implémentation)
5. [Chapitre 4 : Tests et Déploiement](#chapitre-4--tests-et-déploiement)
6. [Conclusion Générale et Perspectives](#conclusion-générale-et-perspectives)
7. [Bibliographie / Webographie](#bibliographie--webographie)

*(Note: Pensez à générer une liste des figures et tableaux automatique dans votre éditeur de texte final)*

<div style="page-break-after: always;"></div>

---

# Abréviations

- **API** : Application Programming Interface
- **ASGI** : Asynchronous Server Gateway Interface
- **DRF** : Django REST Framework
- **ELO** : Système d'évaluation du niveau de jeu (issu des échecs)
- **EMSI** : École Marocaine des Sciences de l'Ingénieur
- **IIR** : Ingénierie Informatique et Réseaux
- **JWT** : JSON Web Token
- **MCD** : Modèle Conceptuel de Données
- **PFA** : Projet de Fin d'Année
- **SPA** : Single Page Application
- **UML** : Unified Modeling Language

<div style="page-break-after: always;"></div>

---

# Introduction Générale

De nos jours, la pratique sportive amateur souffre d'une fragmentation technologique. Les athlètes utilisent une application pour trouver des partenaires de jeu, une autre pour réserver un terrain de football ou de padel, et encore d'autres canaux (réseaux sociaux, feuilles de calcul) pour organiser et gérer des tournois compétitifs.

**Problématique :**
Comment unifier l'expérience du sportif amateur et professionnel au sein d'un écosystème numérique unique, garantissant des rencontres équitables, une gestion fluide des infrastructures, et une expérience compétitive stimulante ?

**Objectifs du projet :**
Le projet **MOVEZ** a pour objectif de répondre à ce besoin en créant une plateforme web intégrée ("Super-App"). Ce projet consiste à développer une solution full-stack permettant de :
- Mettre en relation des sportifs de même niveau (Matchmaking).
- Numériser et simplifier la réservation de terrains et de coachs avec paiement intégré.
- Fournir un outil professionnel de gestion de tournois sportifs.

Ce rapport est structuré en quatre chapitres : l'analyse de l'existant, la modélisation conceptuelle du système, l'implémentation technique, et enfin les phases de tests et de déploiement.

---

# Chapitre 1 : Contexte du Projet & Analyse de l'Existant

## 1.1 Présentation du cadre du projet
Ce projet s'inscrit dans le cadre du Projet de Fin d'Année (PFA) de la 3ème année de la filière Ingénierie Informatique et Réseaux (IIR) à l'EMSI Rabat. L'objectif académique est de mettre en pratique nos connaissances en développement logiciel, conception orientée objet, et architecture web distribuée.

## 1.2 Étude de l'existant
L'analyse du marché révèle plusieurs acteurs, mais qui restent cantonnés à des niches spécifiques :
- **Playtomic** : Axé exclusivement sur les sports de raquette (Tennis, Padel) et la réservation de terrains.
- **Strava** : Réseau social sportif axé sur les performances individuelles (course, cyclisme) mais dépourvu de réservation d'infrastructures ou de matchmaking direct.
- **Toornament / Challonge** : Moteurs de tournois très puissants, mais déconnectés de la pratique physique réelle et de la réservation de lieux physiques.

**Limites de l'existant :** 
Aucune solution globale ne permet à un joueur de s'inscrire, de swiper pour trouver un adversaire à sa taille (Matchmaking Tinder-like), de réserver conjointement un terrain pour leur rencontre, et de payer sa part via une seule et même application. C'est le vide fonctionnel que MOVEZ vient combler.

---

# Chapitre 2 : Conception et Modélisation (UML)

## 2.1 Spécifications fonctionnelles (Acteurs et Fonctionnalités)

Le système MOVEZ interagit avec **5 acteurs principaux** :

| Acteur | Description | Fonctionnalités principales |
|--------|-------------|----------------------------|
| **Joueur** | Sportif standard (rôle par défaut) | Swiper/défier des adversaires, évaluer post-match, réserver terrains/coachs, s'inscrire aux tournois |
| **Coach** | Entraîneur sportif professionnel | Définir ses disponibilités hebdomadaires, recevoir des réservations de coaching |
| **Gérant** | Propriétaire de complexe sportif | Créer/gérer des terrains, confirmer les réservations, consulter toutes les réservations |
| **Organisateur** | Responsable d'événements | Créer des tournois, définir le format, générer les brackets, saisir les scores |
| **Administrateur** | Superviseur de la plateforme | Accès total : gestion des utilisateurs, litiges, panel Django Admin |

### Liste complète des fonctionnalités par module

**Module Users (6 endpoints)** : Inscription, connexion JWT, refresh token, logout avec blacklist, lecture/modification profil, liste des utilisateurs avec filtres (rôle, sport, ville) et recherche full-text.

**Module Matchmaking (8 endpoints)** : Recherche de joueurs actifs, classement ELO Top 50, soumission d'évaluations (1-5 étoiles, unique par paire), historique ELO, demandes de match bidirectionnelles avec contrôle d'accès (seul le receveur peut accepter/refuser).

**Module Reservations (8 endpoints)** : Catalogue de terrains filtrables, création de terrains (auto-attribution du manager), listing des coachs, disponibilités coach, CRUD réservations avec accès différencié (GERANT/ADMIN voient tout), annulation sécurisée.

**Module Competitions (7 endpoints)** : CRUD tournois avec filtres (sport, status, format), inscription avec contrôles (statut OPEN, capacité max), génération automatique de bracket (mélange aléatoire, calcul logarithmique des rounds), saisie des scores avec détermination automatique du vainqueur, gestion des sponsors.

**Module Payments (2 endpoints)** : Création de sessions Stripe Checkout (montant en MAD), webhook Stripe pour confirmation automatique du paiement (`is_paid = True`, `status = CONFIRMED`).

**Module Chat (WebSocket)** : Consumer asynchrone `ChatConsumer` avec rooms dynamiques (`ws/chat/<room_name>/`), envoi/réception de messages en temps réel via Django Channels.

## 2.2 Diagrammes de cas d'utilisation

> *[Insérer ici l'image de votre diagramme de cas d'utilisation global]*

**Cas d'utilisation majeurs :**
- S'authentifier (inscription/connexion avec gestion JWT).
- Rechercher et défier un joueur (Matchmaking ELO via interface Tinder-like).
- Réserver un terrain et procéder au paiement via Stripe.
- Créer un tournoi, générer le bracket et saisir les scores.
- Consulter le classement ELO global.

## 2.3 Diagramme de classes

> *[Insérer ici l'image de votre diagramme de classes UML]*

Le modèle de données est composé de **10 classes principales** réparties sur 6 applications Django :

**Classe `CustomUser`** (hérite de `AbstractBaseUser` + `PermissionsMixin`) :
`email` (unique, identifiant), `first_name`, `last_name`, `role` (JOUEUR/COACH/GERANT/ORGANISATEUR/ADMIN), `avatar`, `bio`, `sport`, `city`, `phone`, `height`, `weight`, `position`, `instagram`, `cover_photo`, `gallery_1`, `gallery_2`, `elo_rating` (défaut: 1000), `is_active`, `is_staff`, `date_joined`.

**Classe `MatchRequest`** : `requester` (FK→User), `receiver` (FK→User), `sport`, `message`, `status` (PENDING/ACCEPTED/REJECTED/COMPLETED).

**Classe `PlayerEvaluation`** : `evaluator` (FK→User), `evaluated` (FK→User), `rating` (1-5), `comment`, `sport`. Contrainte : `unique_together = ('evaluator', 'evaluated')`.

**Classe `EloHistory`** : `user` (FK→User), `old_rating`, `new_rating`, `change`, `reason`.

**Classe `Terrain`** : `name`, `sport` (FOOTBALL/BASKETBALL/TENNIS/PADEL/VOLLEYBALL/OTHER), `address`, `city`, `price_per_hour`, `capacity`, `description`, `image`, `latitude`, `longitude`, `is_available`, `manager` (FK→User).

**Classe `CoachAvailability`** : `coach` (FK→User), `day_of_week` (LUN-DIM), `start_time`, `end_time`. Contrainte : `unique_together = ('coach', 'day_of_week', 'start_time')`.

**Classe `Reservation`** : `player` (FK→User), `reservation_type` (TERRAIN/COACHING), `terrain` (FK→Terrain, nullable), `coach` (FK→User, nullable), `date`, `start_time`, `end_time`, `total_price`, `status` (PENDING/CONFIRMED/CANCELLED/COMPLETED), `is_paid`, `payment_reference`, `split_payment`, `notes`.

**Classe `Tournament`** : `name`, `sport`, `organizer` (FK→User), `format` (SINGLE_ELIMINATION/DOUBLE_ELIMINATION/ROUND_ROBIN), `status` (DRAFT/OPEN/IN_PROGRESS/COMPLETED/CANCELLED), `max_participants`, `start_date`, `end_date`, `location`, `description`, `prize`, `registration_deadline`.

**Classe `TournamentParticipant`** : `tournament` (FK→Tournament), `player` (FK→User), `seed`. Contrainte : `unique_together = ('tournament', 'player')`.

**Classe `Match`** : `tournament` (FK→Tournament), `round_number`, `match_number`, `player1` (FK→User), `player2` (FK→User), `winner` (FK→User), `score_player1`, `score_player2`, `status` (SCHEDULED/IN_PROGRESS/COMPLETED/WALKOVER). Contrainte : `unique_together = ('tournament', 'round_number', 'match_number')`.

**Classe `Sponsor`** : `name`, `logo_url`, `order`.

## 2.4 Diagrammes de séquence

> *[Insérer ici l'image du diagramme de séquence : Processus de Réservation d'un Terrain]*

**Processus de Réservation :**
1. L'utilisateur navigue vers la page Réservations et sélectionne un terrain.
2. Le frontend affiche un modal (composant React) pour choisir la date et l'heure.
3. Requête `POST /api/reservations/reservations/` au backend avec le token JWT.
4. Le backend crée la réservation avec le statut `PENDING`.
5. (Optionnel) Le frontend appelle `POST /api/payments/create-checkout-session/` pour générer un lien Stripe.
6. L'utilisateur complète le paiement sur la page Stripe hébergée.
7. Le Webhook Stripe (`POST /api/payments/webhook/`) met à jour automatiquement la réservation (`is_paid = True`, `status = CONFIRMED`).

> *[Insérer ici l'image du diagramme de séquence : Processus de Matchmaking]*

**Processus de Matchmaking :**
1. Le joueur accède à la page Matchmaking.
2. Le frontend charge les profils via `GET /api/matchmaking/search/`.
3. Le joueur swipe à droite → `POST /api/matchmaking/requests/` (demande de match).
4. Le receveur consulte ses demandes et accepte via `PATCH /api/matchmaking/requests/<id>/`.
5. Après le match, chaque joueur évalue l'autre via `POST /api/matchmaking/evaluate/`.

## 2.5 Modèle Conceptuel de Données (MCD)

> *[Insérer ici l'image de votre MCD (Méthode Merise) généré à partir de votre base]*

Cardinalités principales :
- Un **User** peut envoyer/recevoir (0,n) **MatchRequest**.
- Un **User** peut effectuer (0,n) **Reservation**.
- Un **Terrain** peut avoir (0,n) **Reservation**.
- Un **Tournament** contient (2,n) **TournamentParticipant** et (1,n) **Match**.
- Un **User** possède (0,n) entrées **EloHistory**.

---

# Chapitre 3 : Réalisation et Implémentation

## 3.1 Environnement de développement

### Dépendances Backend (Python)

| Paquet | Version | Rôle |
|--------|---------|------|
| Django | 5.0.6 | Framework web principal |
| djangorestframework | 3.15.2 | Construction de l'API REST |
| djangorestframework-simplejwt | 5.3.1 | Authentification JWT |
| django-cors-headers | 4.4.0 | Gestion CORS cross-origin |
| django-filter | 24.2 | Filtrage des querysets API |
| Pillow | 10.4.0 | Traitement des images uploadées |
| python-decouple | 3.8 | Variables d'environnement (.env) |
| mysqlclient | 2.2.4 | Connecteur MySQL |
| stripe | — | Passerelle de paiement |
| daphne + channels | — | Serveur ASGI + WebSockets |

### Dépendances Frontend (Node.js)

| Paquet | Version | Rôle |
|--------|---------|------|
| react | 19.2.4 | Bibliothèque UI |
| react-dom | 19.2.4 | Rendu DOM |
| react-router-dom | 7.13.2 | Routing SPA |
| @reduxjs/toolkit | 2.11.2 | État global (Redux) |
| react-redux | 9.2.0 | Liaison React-Redux |
| axios | 1.13.6 | Client HTTP avec intercepteurs |
| react-tinder-card | 1.6.4 | Interface de swipe Matchmaking |
| @react-spring/web | 10.0.3 | Animations fluides |
| lucide-react | 1.8.0 | Icônes vectorielles |
| typescript | 5.9.3 | Typage statique |
| vite | 8.0.1 | Build tool / dev server |

### Outils de développement
- **IDE** : Visual Studio Code
- **Tests API** : Postman
- **Base de données** : SQLite (dev), MySQL (production)
- **Navigateur** : Chrome DevTools

## 3.2 Architecture de l'application

Le projet suit une **architecture découplée (Headless)** :

```
MOVEZ V3/
├── backend/              ← API Django REST (port 8000)
│   ├── users/            ← Authentification & profils
│   ├── matchmaking/      ← ELO, défis, évaluations
│   ├── reservations/     ← Terrains, coachs, réservations
│   ├── competitions/     ← Tournois, brackets, sponsors
│   ├── payments/         ← Stripe Checkout & Webhooks
│   ├── chat/             ← WebSocket consumers
│   └── sport_app/        ← Configuration Django (settings, ASGI)
├── frontend/             ← React SPA (port 5173)
│   └── src/
│       ├── api/          ← axiosInstance avec intercepteurs JWT
│       ├── app/          ← Redux store (4 slices)
│       ├── features/     ← auth, matchmaking, reservations, competitions
│       ├── components/   ← Navbar, LoginModal
│       ├── context/      ← AuthModalContext
│       └── pages/        ← 14 pages (voir ci-dessous)
└── mobile/               ← Squelette React Native (Expo)
```

### Gestion d'état global — Redux Toolkit (4 Slices)

| Slice | État géré |
|-------|-----------|
| `authSlice` | `user`, `accessToken`, `refreshToken`, `loading`, `error` — actions : `register`, `login`, `fetchProfile`, `updateProfile`, `logout` |
| `matchmakingSlice` | `players`, `ranking` — actions : `searchPlayers`, `fetchRanking`, `sendMatchRequest`, `evaluatePlayer` |
| `reservationsSlice` | `terrains`, `reservations` — actions : `fetchTerrains`, `fetchMyReservations`, `createReservation`, `cancelReservation` |
| `competitionsSlice` | `tournaments`, `selectedTournament`, `sponsors` — actions : `fetchTournaments`, `fetchTournamentDetail`, `createTournament`, `registerForTournament`, `generateBracket`, `updateMatchScore`, `fetchSponsors` |

### Pages et Routes Frontend (14 pages)

| Route | Page | Accès |
|-------|------|-------|
| `/` | LandingPage (page d'accueil animée) | Public |
| `/login` | LoginPage | Public |
| `/register` | RegisterPage | Public |
| `/ranking` | RankingPage (classement ELO) | Public |
| `/dashboard` | DashboardPage (accueil connecté) | Protégé |
| `/profile` | ProfilePage (profil complet éditable) | Protégé |
| `/matchmaking` | MatchmakingPage (swipe Tinder-like) | Protégé |
| `/reservations` | ReservationsPage (terrains + modal réservation) | Protégé |
| `/tournaments` | TournamentsPage (liste des tournois) | Protégé |
| `/tournaments/:id` | TournamentDetailPage (bracket + scores) | Protégé |
| `/organizer` | OrganizerDashboardPage | Protégé (Organisateur) |
| `/admin` | AdminDashboardPage | Protégé (Admin) |
| `/map` | MapPage (carte interactive des terrains) | Protégé |
| `/settings` | SettingsPage | Protégé |

### Sécurité
- **JWT** : Access Token (1h), Refresh Token (7 jours) avec rotation et blacklist.
- **Intercepteur Axios** : Renouvelle automatiquement le token en cas de 401 sans interrompre la navigation.
- **ProtectedRoute** : Composant wrapper qui redirige vers `/login` si non authentifié.
- **CORS** : Seules les origines `localhost:5173` et `localhost:3000` sont autorisées.

## 3.3 Interfaces de l'application (Screenshots clés)

L'application MOVEZ adopte un design "Haute Couture" : thème sombre (Deep Purple `#1a1a2e`), effets "Glassmorphism" (`backdrop-filter: blur`), dégradés vibrants Violet/Vert, et suppression d'éléments distrayants (emojis) pour un rendu professionnel.

> *[Insérer Screenshot : Landing Page]*
*Figure 1 : Page d'accueil avec navigation translucide, sphère parallax, et sections Tournois/Terrains/Classement.*

> *[Insérer Screenshot : Dashboard]*
*Figure 2 : Tableau de bord connecté avec stats ELO, accès rapide, Top 5 classement et tournois ouverts.*

> *[Insérer Screenshot : Page de Matchmaking (Tinder UI)]*
*Figure 3 : Interface de swiping (react-tinder-card) — modes Solo Sport et Équipe avec profils ELO.*

> *[Insérer Screenshot : Modal de Réservation]*
*Figure 4 : Modal glassmorphism de réservation de terrain avec sélection de date et créneau horaire.*

> *[Insérer Screenshot : Page Profil]*
*Figure 5 : Profil utilisateur avec cover photo, avatar, statistiques ELO, galerie et formulaire d'édition.*

> *[Insérer Screenshot : Page Tournoi Détail]*
*Figure 6 : Vue détaillée d'un tournoi avec bracket, scores et bouton d'inscription.*

---

# Chapitre 4 : Tests et Déploiement

## 4.1 Stratégie de test
Afin d'assurer la robustesse de l'application, la stratégie de test s'articule autour de trois axes :
- **Tests de l'API (Postman)** : Vérification systématique des 31 endpoints REST. Validation des codes de retour HTTP (`200 OK`, `201 Created`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`).
- **Gestion des erreurs Frontend** : Implémentation d'intercepteurs Axios avec auto-refresh JWT. En cas d'expiration du token, l'intercepteur effectue un `POST /auth/login/refresh/` en arrière-plan, stocke le nouveau token et rejoue la requête originale.
- **Tests d'Intégration** : Validation des flux complets :
  - Inscription → connexion → swipe → demande de match → acceptation → évaluation.
  - Sélection terrain → modal réservation → création → paiement Stripe → webhook confirmation.
  - Création tournoi → inscription joueurs → génération bracket → saisie scores.

## 4.2 Comptes de test

| Rôle | Email | Mot de passe | Accès Admin |
|------|-------|--------------|---------|
| Admin | `admin@sport.ma` | `Admin@1234` | Oui |
| Joueur | `joueur@sport.ma` | `Joueur@1234` | Non |
| Joueur 2 | `joueur2@sport.ma` | `Joueur@1234` | Non |
| Organisateur | `org@sport.ma` | `Org@1234` | Non |

## 4.3 Documentation technique et déploiement

**Démarrage du Backend :**
```bash
cd backend
.\venv\Scripts\python.exe manage.py runserver
# Ou via le script batch : .\start-backend.bat
# → http://localhost:8000/api
# → http://localhost:8000/admin (panel Django)
```

**Démarrage du Frontend :**
```bash
cd frontend
npm run dev
# → http://localhost:5173
```

**Variables d'environnement** (`backend/.env`) :

| Variable | Description |
|----------|-------------|
| `SECRET_KEY` | Clé secrète Django |
| `DEBUG` | Mode debug (True/False) |
| `USE_MYSQL` | Basculer SQLite → MySQL |
| `DB_NAME / DB_USER / DB_PASSWORD` | Identifiants MySQL |
| `CORS_ALLOWED_ORIGINS` | Origines autorisées |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret du webhook Stripe |

---

# Conclusion Générale et Perspectives

Le projet **MOVEZ** nous a permis de traverser l'ensemble du cycle de vie du développement logiciel, de la conception abstraite à la livraison d'un prototype robuste et visuellement abouti. Nous avons réussi à concevoir une architecture distribuée capable de gérer une logique métier complexe : calcul algorithmique d'ELO, génération d'arbres de tournois et gestion fine de l'authentification.

**Perspectives d'évolution :**
1. **Déploiement Cloud** : Hébergement du backend sur AWS/Heroku et du frontend sur Vercel avec une base de données MySQL ou PostgreSQL distante.
2. **Application Mobile Native** : Poursuivre le développement du dossier `/mobile` en utilisant React Native et Expo pour générer les builds iOS et Android, capitalisant ainsi sur l'API DRF déjà existante.
3. **Paiement et Temps Réel** : Finaliser l'intégration du webhook Stripe en production et étendre l'usage des WebSockets (Django Channels) pour ajouter un module de messagerie instantanée (Chat in-app) entre les joueurs.

---

# Bibliographie / Webographie

1. **Documentation Django 5.0** : https://docs.djangoproject.com/
2. **Django REST Framework** : https://www.django-rest-framework.org/
3. **React 19 & React Router** : https://react.dev/
4. **Redux Toolkit** : https://redux-toolkit.js.org/
5. **Stripe API Reference** : https://stripe.com/docs/api
6. **Django Channels (WebSockets)** : https://channels.readthedocs.io/
7. *Apprendre la modélisation UML*, R. Roques, Éditions Eyrolles.
