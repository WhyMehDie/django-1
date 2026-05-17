# MOVEZ — Version 1 : Rapport Technique & Fonctionnel

> **Document destiné à :** Analyste / Rédacteur du rapport de projet  
> **Version du système :** Version 1 (MOVEZ V2 codebase)  
> **Date de référence :** Mai 2026  
> **Statut :** Application fonctionnelle — Serveurs actifs en environnement local  

---

## 1. Présentation Générale

**MOVEZ** est une super-application sportive conçue pour centraliser l'ensemble des activités sportives des utilisateurs au sein d'une seule plateforme. Elle permet de gérer les profils d'athlètes, de trouver des adversaires via un système de matchmaking, de réserver des terrains et des coachs, et d'organiser ou participer à des tournois compétitifs.

L'application est développée selon une architecture **full-stack découplée** :

- **Backend** : API REST en Python / Django 5
- **Frontend** : Interface utilisateur en React 19 (TypeScript) avec Vite

---

## 2. Architecture Technique

### 2.1 Vue d'ensemble

```
MOVEZ V2/
├── backend/          → API Django REST (port 8000)
│   ├── users/        → Gestion des comptes et profils
│   ├── matchmaking/  → Système ELO et demandes de matchs
│   ├── reservations/ → Terrains, coachs et réservations
│   ├── competitions/ → Tournois, matchs et sponsors
│   └── sport_app/    → Configuration centrale Django
├── frontend/         → Application React + TypeScript (port 5173)
│   └── src/
│       ├── pages/    → Pages de l'interface
│       ├── features/ → Slices Redux (état global)
│       ├── components/ → Composants réutilisables (Navbar)
│       └── api/      → Couche d'appels HTTP (Axios)
```

### 2.2 Stack Technologique

| Couche | Technologie | Version |
|--------|------------|---------|
| Backend framework | Django | 5.0.6 |
| API REST | Django REST Framework | 3.15.2 |
| Authentification | JWT (SimpleJWT) | 5.3.1 |
| CORS | django-cors-headers | 4.4.0 |
| Filtrage API | django-filter | 24.2 |
| Upload images | Pillow | 10.4.0 |
| Base de données (dev) | SQLite 3 | — |
| Base de données (prod) | MySQL | — |
| Frontend framework | React | 19.2.4 |
| Langage frontend | TypeScript | 5.9.3 |
| Build tool | Vite | 8.0.1 |
| État global | Redux Toolkit | 2.11.2 |
| Requêtes HTTP | Axios | 1.13.6 |
| Routing frontend | React Router DOM | 7.13.2 |
| Icônes | Lucide React | 1.8.0 |
| Animations | React Spring Web | 10.0.3 |

---

## 3. Modules Backend

### 3.1 Module `users` — Gestion des Utilisateurs

Ce module gère l'ensemble du cycle de vie des comptes utilisateurs, de l'inscription à l'authentification JWT.

#### Modèle de données : `CustomUser`

| Champ | Type | Description |
|-------|------|-------------|
| `email` | EmailField (unique) | Identifiant principal de connexion |
| `first_name` | CharField | Prénom |
| `last_name` | CharField | Nom de famille |
| `role` | CharField (choix) | Rôle : JOUEUR, COACH, GÉRANT, ORGANISATEUR, ADMIN |
| `avatar` | ImageField | Photo de profil |
| `bio` | TextField | Biographie libre |
| `sport` | CharField | Sport pratiqué |
| `city` | CharField | Ville de résidence |
| `phone` | CharField | Numéro de téléphone |
| `height` | IntegerField | Taille en cm |
| `weight` | IntegerField | Poids en kg |
| `position` | CharField | Poste préféré (ex : attaquant) |
| `instagram` | CharField | Lien Instagram |
| `cover_photo` | ImageField | Photo de couverture du profil |
| `gallery_1 / gallery_2` | ImageField | Galerie photos personnelle |
| `elo_rating` | IntegerField | Score ELO (défaut: 1000) |
| `date_joined` | DateTimeField | Date d'inscription |

#### Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/users/register/` | Inscription d'un nouvel utilisateur |
| POST | `/api/users/login/` | Connexion et obtention du token JWT |
| POST | `/api/users/login/refresh/` | Rafraîchissement du token |
| POST | `/api/users/logout/` | Déconnexion (blacklist du token) |
| GET/PUT | `/api/users/profile/` | Lecture et modification du profil |
| GET | `/api/users/users/` | Liste des utilisateurs |
| GET/PUT/DELETE | `/api/users/users/<id>/` | Détail d'un utilisateur |

---

### 3.2 Module `matchmaking` — Système de Matchmaking

Ce module permet aux joueurs de se trouver, de se défier et d'évaluer leurs adversaires via un système de classement ELO.

#### Modèles de données

**`MatchRequest`** — Demande de match entre deux joueurs

| Champ | Type | Description |
|-------|------|-------------|
| `requester` | ForeignKey (User) | Joueur qui envoie le défi |
| `receiver` | ForeignKey (User) | Joueur qui reçoit le défi |
| `sport` | CharField | Sport concerné |
| `message` | TextField | Message d'accompagnement |
| `status` | CharField (choix) | PENDING / ACCEPTED / REJECTED / COMPLETED |
| `created_at` | DateTimeField | Date de création |

**`PlayerEvaluation`** — Évaluation post-match

| Champ | Type | Description |
|-------|------|-------------|
| `evaluator` | ForeignKey (User) | Utilisateur qui évalue |
| `evaluated` | ForeignKey (User) | Utilisateur évalué |
| `rating` | IntegerField (1–5) | Note attribuée |
| `comment` | TextField | Commentaire libre |
| `sport` | CharField | Sport de référence |

**`EloHistory`** — Historique des variations ELO

| Champ | Type | Description |
|-------|------|-------------|
| `user` | ForeignKey (User) | Joueur concerné |
| `old_rating` | IntegerField | Score avant modification |
| `new_rating` | IntegerField | Score après modification |
| `change` | IntegerField | Variation (+ ou −) |
| `reason` | CharField | Motif du changement |

#### Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/matchmaking/search/` | Recherche de joueurs |
| GET | `/api/matchmaking/ranking/` | Classement ELO global |
| POST | `/api/matchmaking/evaluate/` | Soumettre une évaluation |
| GET | `/api/matchmaking/evaluations/<user_id>/` | Évaluations d'un joueur |
| GET | `/api/matchmaking/elo-history/` | Mon historique ELO |
| GET | `/api/matchmaking/elo-history/<user_id>/` | Historique ELO d'un joueur |
| GET/POST | `/api/matchmaking/requests/` | Lister / créer une demande de match |
| PUT/PATCH | `/api/matchmaking/requests/<id>/` | Accepter / refuser un défi |

---

### 3.3 Module `reservations` — Réservations de Terrains et Coachs

Ce module gère l'inventaire des installations sportives et les sessions de coaching.

#### Modèles de données

**`Terrain`** — Complexe / terrain sportif

| Champ | Type | Description |
|-------|------|-------------|
| `name` | CharField | Nom du terrain |
| `sport` | CharField (choix) | FOOTBALL, BASKETBALL, TENNIS, PADEL, VOLLEYBALL, OTHER |
| `address` | CharField | Adresse |
| `city` | CharField | Ville |
| `price_per_hour` | DecimalField | Tarif horaire |
| `capacity` | IntegerField | Nombre de joueurs max |
| `description` | TextField | Description |
| `image` | ImageField | Photo du terrain |
| `latitude / longitude` | FloatField | Coordonnées GPS |
| `is_available` | BooleanField | Disponibilité |
| `manager` | ForeignKey (User) | Gérant responsable |

**`CoachAvailability`** — Disponibilités d'un coach

| Champ | Type | Description |
|-------|------|-------------|
| `coach` | ForeignKey (User) | Coach concerné |
| `day_of_week` | CharField | Jour (LUN–DIM) |
| `start_time / end_time` | TimeField | Plage horaire |

**`Reservation`** — Réservation (terrain ou coaching)

| Champ | Type | Description |
|-------|------|-------------|
| `player` | ForeignKey (User) | Joueur qui réserve |
| `reservation_type` | CharField | TERRAIN ou COACHING |
| `terrain` | ForeignKey (Terrain) | Terrain réservé |
| `coach` | ForeignKey (User) | Coach réservé |
| `date` | DateField | Date de la session |
| `start_time / end_time` | TimeField | Horaires |
| `total_price` | DecimalField | Prix total calculé |
| `status` | CharField | PENDING / CONFIRMED / CANCELLED / COMPLETED |
| `is_paid` | BooleanField | Statut du paiement |
| `payment_reference` | CharField | Référence de paiement |
| `split_payment` | BooleanField | Paiement partagé (entre joueurs) |
| `notes` | TextField | Notes libres |

#### Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/reservations/terrains/` | Liste des terrains disponibles |
| POST | `/api/reservations/terrains/create/` | Ajouter un terrain |
| GET/PUT/DELETE | `/api/reservations/terrains/<id>/` | Détail d'un terrain |
| GET | `/api/reservations/coaches/` | Liste des coachs |
| GET | `/api/reservations/coaches/<id>/availability/` | Disponibilités d'un coach |
| GET/POST | `/api/reservations/reservations/` | Mes réservations / nouvelle réservation |
| GET/PUT | `/api/reservations/reservations/<id>/` | Détail d'une réservation |
| POST | `/api/reservations/reservations/<id>/cancel/` | Annuler une réservation |

---

### 3.4 Module `competitions` — Tournois et Compétitions

Ce module gère l'organisation, la gestion de bracket et les résultats des tournois.

#### Modèles de données

**`Tournament`** — Tournoi

| Champ | Type | Description |
|-------|------|-------------|
| `name` | CharField | Nom du tournoi |
| `sport` | CharField | Sport |
| `organizer` | ForeignKey (User) | Organisateur |
| `format` | CharField (choix) | SINGLE_ELIMINATION / DOUBLE_ELIMINATION / ROUND_ROBIN |
| `status` | CharField (choix) | DRAFT / OPEN / IN_PROGRESS / COMPLETED / CANCELLED |
| `max_participants` | IntegerField | Nombre max de participants |
| `start_date / end_date` | DateField | Dates de début et fin |
| `location` | CharField | Lieu |
| `description` | TextField | Description |
| `prize` | CharField | Prix/récompense |
| `registration_deadline` | DateField | Date limite d'inscription |

**`TournamentParticipant`** — Inscription à un tournoi

| Champ | Type | Description |
|-------|------|-------------|
| `tournament` | ForeignKey (Tournament) | Tournoi concerné |
| `player` | ForeignKey (User) | Joueur inscrit |
| `seed` | IntegerField | Tête de série |

**`Match`** — Match dans un tournoi

| Champ | Type | Description |
|-------|------|-------------|
| `tournament` | ForeignKey (Tournament) | Tournoi parent |
| `round_number` | IntegerField | Numéro du tour |
| `match_number` | IntegerField | Numéro du match dans le tour |
| `player1 / player2` | ForeignKey (User) | Deux participants |
| `winner` | ForeignKey (User) | Vainqueur du match |
| `score_player1 / score_player2` | IntegerField | Scores |
| `status` | CharField | SCHEDULED / IN_PROGRESS / COMPLETED / WALKOVER |
| `scheduled_at / played_at` | DateTimeField | Dates prévue et effective |

**`Sponsor`** — Sponsor de la plateforme

| Champ | Type | Description |
|-------|------|-------------|
| `name` | CharField | Nom du sponsor |
| `logo_url` | URLField | URL du logo |
| `order` | IntegerField | Ordre d'affichage |

#### Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET/POST | `/api/competitions/tournaments/` | Liste / créer un tournoi |
| GET/PUT/DELETE | `/api/competitions/tournaments/<id>/` | Détail d'un tournoi |
| GET | `/api/competitions/tournaments/<id>/bracket/` | Voir le bracket |
| POST | `/api/competitions/tournaments/<id>/register/` | S'inscrire à un tournoi |
| POST | `/api/competitions/tournaments/<id>/generate-bracket/` | Générer automatiquement le bracket |
| PUT | `/api/competitions/matches/<id>/score/` | Enregistrer le score d'un match |
| GET | `/api/competitions/sponsors/` | Liste des sponsors |

---

## 4. Interface Utilisateur (Frontend)

### 4.1 Pages de l'Application

| Route | Page | Accès |
|-------|------|-------|
| `/login` | Page de connexion | Public |
| `/register` | Page d'inscription | Public |
| `/` | Dashboard principal | Connecté |
| `/profile` | Profil utilisateur complet | Connecté |
| `/matchmaking` | Recherche et défis adversaires | Connecté |
| `/reservations` | Réservation de terrains / coachs | Connecté |
| `/tournaments` | Liste des tournois | Connecté |
| `/tournaments/:id` | Détail + bracket d'un tournoi | Connecté |
| `/organizer` | Dashboard organisateur de tournoi | Connecté |
| `/map` | Carte interactive des terrains | Connecté |
| `/ranking` | Classement ELO global | Connecté |
| `/admin` | Dashboard administrateur | Connecté (Admin) |

### 4.2 Rôles Utilisateur et Accès

| Rôle | Description | Capacités Principales |
|------|-------------|----------------------|
| **JOUEUR** | Sportif standard | Matchmaking, réservations, inscriptions tournois |
| **COACH** | Entraîneur sportif | Définit ses disponibilités, reçoit des réservations coaching |
| **GÉRANT** | Gérant de complexe | Crée et gère des terrains, confirme les réservations |
| **ORGANISATEUR** | Organisateur d'événements | Crée et gère des tournois, génère les brackets |
| **ADMIN** | Administrateur plateforme | Accès total à toutes les fonctionnalités |

### 4.3 État Global (Redux)

Le frontend utilise **Redux Toolkit** avec 4 slices de gestion d'état :

- **`auth`** — Authentification JWT, profil utilisateur connecté
- **`competitions`** — Données des tournois et matchs
- **`matchmaking`** — Demandes de matchs, recherche joueurs, historique ELO
- **`reservations`** — Terrains, coachs, réservations

---

## 5. Sécurité et Authentification

- **JWT (JSON Web Token)** : Authentification stateless via access token + refresh token
- **Access Token** : Durée de vie de **1 heure**
- **Refresh Token** : Durée de vie de **7 jours**, rotation automatique
- **Blacklist des tokens** : À chaque déconnexion ou rotation, l'ancien token est blacklisté
- **CORS** configuré pour autoriser uniquement les origines connues (`localhost:5173`, `localhost:3000`)
- **Permissions par défaut** : Tous les endpoints nécessitent une authentification (`IsAuthenticated`)
- **Routes protégées frontend** : Toute route non publique redirige vers `/login` si non connecté

---

## 6. Configuration et Déploiement

### 6.1 Variables d'Environnement (`.env`)

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `SECRET_KEY` | Clé secrète Django | Valeur de développement |
| `DEBUG` | Mode debug | `True` |
| `ALLOWED_HOSTS` | Hôtes autorisés | `localhost,127.0.0.1` |
| `USE_MYSQL` | Activer MySQL | `False` (SQLite utilisé en dev) |
| `DB_NAME / DB_USER / DB_PASSWORD / DB_HOST / DB_PORT` | Config MySQL | — |
| `CORS_ALLOWED_ORIGINS` | Origines CORS autorisées | `http://localhost:5173` |

### 6.2 Lancement de l'Application

```bash
# Backend (port 8000)
python manage.py runserver

# Frontend (port 5173)
npm run dev
```

### 6.3 Endpoints de Base

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Backend | http://localhost:8000/api |
| Django Admin | http://localhost:8000/admin |

### 6.4 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@sport.ma | Admin@1234 |
| Joueur | joueur@sport.ma | Joueur@1234 |

---

## 7. Fonctionnalités — Résumé Complet

### ✅ Implémentées en Version 1

| Fonctionnalité | Module | Statut |
|----------------|--------|--------|
| Inscription / connexion par email | users | ✅ Opérationnel |
| Profil complet (avatar, galerie, bio, stats) | users | ✅ Opérationnel |
| Authentification JWT avec refresh + blacklist | users | ✅ Opérationnel |
| Recherche de joueurs par sport et ville | matchmaking | ✅ Opérationnel |
| Système de défis / demandes de match | matchmaking | ✅ Opérationnel |
| Évaluation post-match (1–5 étoiles) | matchmaking | ✅ Opérationnel |
| Système de score ELO avec historique | matchmaking | ✅ Opérationnel |
| Classement global des joueurs (ELO) | matchmaking | ✅ Opérationnel |
| Listing et détail des terrains sportifs | reservations | ✅ Opérationnel |
| Réservation de terrain (créneau horaire) | reservations | ✅ Opérationnel |
| Réservation de session coaching | reservations | ✅ Opérationnel |
| Disponibilités des coachs | reservations | ✅ Opérationnel |
| Annulation de réservation | reservations | ✅ Opérationnel |
| Paiement partagé de réservation | reservations | ✅ Modèle présent |
| Création de tournois (3 formats) | competitions | ✅ Opérationnel |
| Inscription à un tournoi | competitions | ✅ Opérationnel |
| Génération automatique de bracket | competitions | ✅ Opérationnel |
| Saisie des scores de matchs | competitions | ✅ Opérationnel |
| Dashboard organisateur de tournoi | competitions | ✅ Opérationnel |
| Gestion des sponsors (logo, ordre) | competitions | ✅ Opérationnel |
| Carte interactive des terrains | frontend (MapPage) | ✅ Opérationnel |
| Dashboard administrateur | frontend (AdminPage) | ✅ Opérationnel |
| Interface React avec routing sécurisé | frontend | ✅ Opérationnel |
| État global synchronisé (Redux) | frontend | ✅ Opérationnel |

---

## 8. Localisation

- **Langue de l'interface backend** : Français (`fr-fr`)
- **Fuseau horaire** : `Africa/Algiers` (UTC+1)
- **Choix de sports supportés** : Football, Basketball, Tennis, Padel, Volleyball

---

## 9. Limites Connues de la Version 1

| Limitation | Description |
|------------|-------------|
| Base de données dev | SQLite utilisé en local ; MySQL requis pour la production |
| Paiement | La référence de paiement est stockée mais aucune passerelle de paiement n'est intégrée |
| Notifications | Pas de système de notification en temps réel (WebSocket non implémenté) |
| Carte interactive | La MapPage est présente mais dépend de données GPS non encore peuplées |
| Tests automatisés | Aucune suite de tests (unitaires / intégration) n'est définie à ce stade |
| Upload médias | Les médias sont stockés localement ; pas de CDN ni stockage cloud |

---

*Document généré automatiquement à partir de l'analyse du code source — MOVEZ V2, Mai 2026.*
