# 🏆 Sport App — Project Documentation

> A full-stack sports platform prototype for matchmaking, tournament management, venue reservations, and coaching sessions.

---

## 📁 Monorepo Structure

```
prototype validation/
├── backend/              # Django REST API
├── frontend/             # React + Vite SPA
├── competitions/         # (reference / planning)
├── matchmaking/
├── reservations/
├── users/
└── super-app-sportive/   # Docker-compose variant
```

---

## 🧱 Tech Stack

### Backend

| Layer | Technology |
|---|---|
| Language | Python 3.x |
| Framework | Django 5.0.6 |
| REST API | Django REST Framework 3.15.2 |
| Authentication | JWT via `djangorestframework-simplejwt` 5.3.1 |
| CORS | `django-cors-headers` 4.4.0 |
| Filtering | `django-filter` 24.2 |
| Image handling | Pillow 10.4.0 |
| Config management | `python-decouple` 3.8 |
| Database (dev) | SQLite (`db.sqlite3`) |
| Database (prod) | MySQL (via `mysqlclient` 2.2.4) |
| Locale | French (`fr-fr`), Timezone `Africa/Algiers` |

### Frontend

| Layer | Technology |
|---|---|
| Language | TypeScript ~5.9 |
| Framework | React 19 |
| Bundler | Vite 8 |
| Routing | React Router DOM v7 |
| State Management | Redux Toolkit + React-Redux |
| HTTP Client | Axios 1.x (with JWT interceptors) |
| UI & Animations | `@react-spring/web`, `lucide-react` |
| Swipe UI | `react-tinder-card` |
| Styling | Vanilla CSS (per-page files) |

---

## 🔐 Authentication

- **Custom user model**: `users.CustomUser` (extends `AbstractBaseUser`)
- **Login**: email + password → returns JWT access + refresh tokens
- **Access token lifetime**: 1 hour
- **Refresh token lifetime**: 7 days
- **Token rotation**: enabled (old refresh token blacklisted on rotation)
- **Storage**: tokens stored in `localStorage` (`access_token`, `refresh_token`)
- **Auto-refresh**: Axios response interceptor silently refreshes on `401` and replays the original request

### User Roles

| Role | Description |
|---|---|
| `JOUEUR` | Player (default) |
| `COACH` | Sports Coach |
| `GERANT` | Venue Manager |
| `ORGANISATEUR` | Tournament Organiser |
| `ADMIN` | Platform Administrator |

### User Fields

`email`, `first_name`, `last_name`, `role`, `avatar`, `bio`, `sport`, `city`, `phone`, `elo_rating` (default 1000), `date_joined`

---

## 🗄️ Data Models

### `users` app — `CustomUser`
Custom Django user using email as the login field. Includes an **ELO rating** system for competitive matchmaking.

---

### `competitions` app

#### `Tournament`
| Field | Type | Notes |
|---|---|---|
| `name` | CharField | |
| `sport` | CharField | |
| `organizer` | FK → CustomUser | |
| `format` | CharField | `SINGLE_ELIMINATION`, `DOUBLE_ELIMINATION`, `ROUND_ROBIN` |
| `status` | CharField | `DRAFT`, `OPEN`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED` |
| `max_participants` | IntegerField | default 8 |
| `start_date / end_date` | DateField | |
| `location`, `description`, `prize` | Misc | |
| `registration_deadline` | DateField | nullable |

#### `TournamentParticipant`
Links a player to a tournament with an optional seed. Unique together on `(tournament, player)`.

#### `Match`
| Field | Notes |
|---|---|
| `tournament`, `round_number`, `match_number` | Bracket position |
| `player1`, `player2`, `winner` | FK → CustomUser |
| `score_player1`, `score_player2` | nullable scores |
| `status` | `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `WALKOVER` |
| `scheduled_at`, `played_at` | timestamps |

---

### `matchmaking` app

#### `PlayerEvaluation`
Players rate each other (1–5 stars) per sport. Unique per evaluator–evaluated pair.

#### `MatchRequest`
A player challenges another to a match. Statuses: `PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`.

#### `EloHistory`
Tracks every change to a player's ELO rating (old value, new value, delta, reason).

---

### `reservations` app

#### `Terrain` (Venue)
Sports field/court with sport type, address, GPS coordinates, price per hour, capacity, and availability flag. Managed by a `GERANT` user.

**Supported sports**: Football, Basketball, Tennis, Padel, Volleyball, Other.

#### `CoachAvailability`
Defines a coach's recurring weekly schedule (day of week + time slot).

#### `Reservation`
Can be either a **Terrain** booking or a **Coaching session**.
| Field | Notes |
|---|---|
| `reservation_type` | `TERRAIN` or `COACHING` |
| `terrain` | FK → Terrain (nullable for coaching) |
| `coach` | FK → CustomUser (nullable for terrain) |
| `date`, `start_time`, `end_time` | booking window |
| `total_price` | DecimalField |
| `status` | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED` |
| `is_paid`, `payment_reference` | payment tracking |
| `split_payment` | bool — split cost between players |

---

## 🌐 API Routes

All routes prefixed with `/api/`

| Prefix | App |
|---|---|
| `/api/auth/` | users — login, register, profile, JWT refresh |
| `/api/matchmaking/` | match requests, player evaluations, ELO history |
| `/api/reservations/` | terrains, reservations, coach availability |
| `/api/competitions/` | tournaments, participants, matches |
| `/admin/` | Django admin panel |
| `/media/` | Uploaded files (avatars, terrain images) |

---

## 🖥️ Frontend Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/login` | `LoginPage` | Email + password login |
| `/register` | `RegisterPage` | New user sign-up with role selection |
| `/` | `DashboardPage` | Protected home / overview |
| `/profile` | `ProfilePage` | View & edit user profile |
| `/matchmaking` | `MatchmakingPage` | Tinder-style swipe to challenge players |
| `/reservations` | `ReservationsPage` | Browse & book terrains or coaching |
| `/tournaments` | `TournamentsPage` | List all tournaments |
| `/tournaments/:id` | `TournamentDetailPage` | Bracket, participants, match results |

All routes except `/login` and `/register` are **protected** — unauthenticated users are redirected to `/login`.

---

## 🗂️ Frontend Architecture

```
src/
├── api/
│   └── axiosInstance.ts      # Axios with Bearer token + auto-refresh interceptors
├── app/
│   ├── store.ts              # Redux store config
│   └── hooks.ts              # Typed useAppSelector / useAppDispatch
├── features/
│   ├── auth/                 # authSlice (login, logout, fetchProfile)
│   ├── competitions/         # tournaments & matches state
│   ├── matchmaking/          # match requests state
│   └── reservations/         # reservations & terrains state
├── components/
│   └── Navbar.tsx            # Top navigation bar
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── DashboardPage.tsx
│   ├── ProfilePage.tsx
│   ├── MatchmakingPage.tsx   # Uses react-tinder-card
│   ├── ReservationsPage.tsx
│   ├── TournamentsPage.tsx
│   └── TournamentDetailPage.tsx
└── App.tsx                   # Router + Redux Provider + ProtectedRoute
```

---

## ⚙️ Configuration

### Backend `.env` (in `backend/`)
```
SECRET_KEY=...
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Optional MySQL for production
USE_MYSQL=False
DB_NAME=sport_app_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
```

### Frontend `.env` (in `frontend/`)
```
VITE_API_URL=http://localhost:8000/api
```

---

## 🚀 Running Locally

### Backend
```powershell
cd backend
.\venv\Scripts\python.exe manage.py runserver
# → http://localhost:8000
```

### Frontend
```powershell
cd frontend
npm run dev
# → http://localhost:5173
```

### Django Admin
```
http://localhost:8000/admin/
```
Create a superuser with:
```powershell
.\venv\Scripts\python.exe manage.py createsuperuser
```

---

## 🐳 Docker (optional)

A `docker-compose.yml` is available in the `super-app-sportive/` folder for containerised deployment.

```powershell
cd super-app-sportive
docker-compose up --build
```

---

## 🔑 Key Design Decisions

| Decision | Rationale |
|---|---|
| Custom user model | Email-based auth + multi-role system + ELO rating from day 1 |
| JWT with blacklisting | Stateless auth with secure logout (refresh token invalidation) |
| SQLite → MySQL switch | Zero-config dev, production-ready via env flag |
| Redux Toolkit | Structured async state for 4 separate feature domains |
| React-tinder-card | Intuitive swipe UX for the matchmaking discovery flow |
| Axios interceptors | Transparent token refresh without user disruption |
| `django-filter` | Easy query filtering on list endpoints (sport, status, city…) |
| Pagination (page size 20) | Protects API from large unbounded result sets |

---

## 🧪 Comptes de Test

> Tous les comptes ci-dessous sont disponibles sur `http://localhost:5173` (frontend) et `http://localhost:8000/admin` (admin Django).

| Email | Mot de passe | Rôle | Nom | Accès Admin |
|---|---|---|---|---|
| `admin@sport.ma` | `Admin@1234` | ADMIN | Admin Sport | ✅ Oui |
| `joueur@sport.ma` | `Joueur@1234` | JOUEUR | Karim Benzema | ❌ Non |
| `joueur2@sport.ma` | `Joueur@1234` | JOUEUR | Riyad Mahrez | ❌ Non |
| `org@sport.ma` | `Org@1234` | ORGANISATEUR | Omar Berrada | ❌ Non |

> [!TIP]
> Pour tester la gestion des tournois, connectez-vous avec `org@sport.ma` (peut créer des tournois et générer des brackets). Pour le panel admin Django, utilisez `admin@sport.ma`.

---

## ⚡ Fonctionnalités Techniques

Détail de toutes les fonctionnalités implémentées, module par module.

---

### 🔐 Module `users` — Authentification & Gestion des utilisateurs

#### Endpoints

| Méthode | URL | Accès | Description |
|---|---|---|---|
| `POST` | `/api/auth/register/` | Public | Inscription → retourne immédiatement les tokens JWT |
| `POST` | `/api/auth/login/` | Public | Connexion email/mot de passe → retourne `access` + `refresh` |
| `POST` | `/api/auth/login/refresh/` | Public | Renouvelle le token d'accès via le refresh token |
| `POST` | `/api/auth/logout/` | Authentifié | Blackliste le refresh token (déconnexion sécurisée) |
| `GET/PATCH` | `/api/auth/profile/` | Authentifié | Récupère ou met à jour le profil de l'utilisateur connecté |
| `GET` | `/api/auth/users/` | Authentifié | Liste publique de tous les utilisateurs actifs (sauf soi-même) |
| `GET` | `/api/auth/users/<id>/` | Authentifié | Détail public d'un utilisateur spécifique |

#### Fonctionnalités clés

- **Inscription avec tokens** : à la création du compte, un `access` + `refresh` token sont renvoyés directement, sans deuxième appel de login.
- **Blacklist JWT** : lors du logout, le refresh token est révoqué en base (`rest_framework_simplejwt.token_blacklist`), empêchant toute réutilisation.
- **Filtres sur la liste utilisateurs** : `role`, `sport`, `city`
- **Recherche full-text** : `first_name`, `last_name`, `sport`, `city`
- **Tri** : par `elo_rating` (défaut : décroissant), `first_name`
- **Profil éditable** : PATCH partiel — le user peut mettre à jour `bio`, `sport`, `city`, `phone`, `avatar`

---

### 🤝 Module `matchmaking` — Mise en relation & Classement ELO

#### Endpoints

| Méthode | URL | Accès | Description |
|---|---|---|---|
| `GET` | `/api/matchmaking/search/` | Authentifié | Recherche de joueurs actifs (rôle `JOUEUR`) |
| `GET` | `/api/matchmaking/ranking/` | Authentifié | Top 50 joueurs classés par ELO |
| `POST` | `/api/matchmaking/evaluate/` | Authentifié | Soumettre une évaluation (1–5 étoiles) pour un joueur |
| `GET` | `/api/matchmaking/evaluations/<user_id>/` | Authentifié | Lire les évaluations reçues par un joueur |
| `GET` | `/api/matchmaking/elo-history/` | Authentifié | Historique ELO du user connecté |
| `GET` | `/api/matchmaking/elo-history/<user_id>/` | Authentifié | Historique ELO d'un user spécifique |
| `GET/POST` | `/api/matchmaking/requests/` | Authentifié | Lister (envoyées + reçues) ou créer une demande de match |
| `PATCH` | `/api/matchmaking/requests/<id>/` | Authentifié (receveur) | Accepter ou refuser une demande de match |

#### Fonctionnalités clés

- **Découverte de joueurs** : la vue `PlayerSearchView` exclut l'utilisateur connecté et ne retourne que les `JOUEUR` actifs.
- **Demandes de match bidirectionnelles** : un user voit toutes les demandes qu'il a envoyées ET reçues dans un seul appel.
- **Contrôle d'accès sur PATCH** : seul le **receveur** peut accepter/refuser une demande ; toute autre tentative retourne `403 Forbidden`.
- **Évaluation unique** : `unique_together = ('evaluator', 'evaluated')` empêche les évaluations multiples.
- **ELO History** : chaque changement de rating est tracé avec `old_rating`, `new_rating`, `change`, et une `reason`.
- **Filtres** : sport, ville, rôle sur la recherche joueurs ; sport sur le classement.

#### UI Frontend — Swipe Matchmaking (`MatchmakingPage.tsx`)

- Interface **Tinder-like** avec `react-tinder-card`
- Swipe **droite** = Match / Swipe **gauche** = Ignoré
- Swipes verticaux désactivés (`preventSwipe: ['up', 'down']`)
- Indicateur visuel animé après chaque swipe
- Bouton **Rafraîchir** quand le deck est épuisé
- Chaque carte affiche : nom, âge, sport (badge), ville (MapPin), bio, et score ELO avec icône étoile

---

### 🏆 Module `competitions` — Tournois & Brackets

#### Endpoints

| Méthode | URL | Accès | Description |
|---|---|---|---|
| `GET` | `/api/competitions/tournaments/` | Authentifié | Liste tous les tournois avec filtres |
| `POST` | `/api/competitions/tournaments/` | Authentifié | Créer un nouveau tournoi |
| `GET/PUT/DELETE` | `/api/competitions/tournaments/<id>/` | Authentifié | Détail, modification, suppression |
| `GET` | `/api/competitions/tournaments/<id>/bracket/` | Authentifié | Récupère le bracket complet du tournoi |
| `POST` | `/api/competitions/tournaments/<id>/register/` | Authentifié | S'inscrire à un tournoi |
| `POST` | `/api/competitions/tournaments/<id>/generate-bracket/` | Organisateur / Admin | Générer le bracket (round 1) |
| `PATCH` | `/api/competitions/matches/<id>/score/` | Organisateur / Admin | Saisir le score et désigner le vainqueur |

#### Fonctionnalités clés

- **Inscription avec contrôles** :
  - Vérifie que le tournoi est en statut `OPEN`
  - Vérifie que la capacité max n'est pas atteinte (`max_participants`)
  - Empêche la double inscription (`get_or_create`)
- **Génération de bracket automatique** :
  - Les participants sont mélangés aléatoirement (`order_by('?')`)
  - Les matchs du Round 1 sont créés par paires
  - Le nombre de rounds est calculé via `math.ceil(math.log2(count))`
  - Le tournoi passe automatiquement en statut `IN_PROGRESS`
  - Les anciens matchs sont supprimés avant régénération
- **Saisie du score** :
  - Seul l'organisateur ou un staff peut saisir les scores
  - Le vainqueur est automatiquement déterminé par comparaison des scores
  - Le match passe en statut `COMPLETED`
- **Filtres sur la liste** : `sport`, `status`, `format`
- **Recherche** : par `name`, `sport`, `location`
- **Tri** : par `start_date`, `created_at`
- **Sérialiseurs différenciés** : `TournamentListSerializer` (léger) pour les listes, `TournamentSerializer` (complet) pour le détail

---

### 🏟️ Module `reservations` — Terrains, Coachs & Réservations

#### Endpoints

| Méthode | URL | Accès | Description |
|---|---|---|---|
| `GET` | `/api/reservations/terrains/` | Authentifié | Liste des terrains disponibles |
| `POST` | `/api/reservations/terrains/create/` | Authentifié | Créer un terrain (assigne `manager` = user connecté) |
| `GET/PUT/DELETE` | `/api/reservations/terrains/<id>/` | Authentifié | Détail/édition/suppression terrain |
| `GET` | `/api/reservations/coaches/` | Authentifié | Liste des coachs actifs |
| `GET/POST` | `/api/reservations/coaches/<id>/availability/` | Authentifié | Disponibilités d'un coach |
| `GET/POST` | `/api/reservations/reservations/` | Authentifié | Lister ses réservations ou en créer une |
| `GET/PUT/DELETE` | `/api/reservations/reservations/<id>/` | Authentifié | Détail/édition/suppression réservation |
| `POST` | `/api/reservations/reservations/<id>/cancel/` | Authentifié (propriétaire) | Annuler une réservation |

#### Fonctionnalités clés

- **Filtrage automatique** : `TerrainListView` ne retourne que les terrains avec `is_available=True`
- **Attribution du manager** : à la création d'un terrain, le `manager` est automatiquement défini sur l'utilisateur connecté (`perform_create`)
- **Accès différencié aux réservations** :
  - `GERANT` et `ADMIN` voient **toutes** les réservations
  - Les `JOUEUR` et `COACH` voient seulement **leurs propres** réservations
- **Annulation sécurisée** : on ne peut pas annuler une réservation déjà `COMPLETED` ou `CANCELLED`
- **Deux types de réservation** : `TERRAIN` (lié à un `Terrain`) et `COACHING` (lié à un `coach`)
- **Paiement splitté** : champ `split_payment` booléen pour partager le coût entre joueurs
- **Disponibilités coach hebdomadaires** : contrainte unique `(coach, day_of_week, start_time)` pour éviter les doublons dans l'agenda
- **Filtres terrain** : `sport`, `city`, `is_available`, recherche sur `name`, `city`, `address`, tri par `price_per_hour`
- **Géolocalisation** : champs `latitude` / `longitude` sur `Terrain` pour une intégration carte future

---

### 🖥️ Fonctionnalités Frontend (React / Redux)

#### Gestion d'état global avec Redux Toolkit

| Slice | État géré |
|---|---|
| `authSlice` | `user`, `accessToken`, `refreshToken`, `loading`, `error` |
| `competitions` | Tournois, participants, matchs |
| `matchmaking` | Demandes de match, évaluations, classement |
| `reservations` | Terrains, réservations, disponibilités coachs |

#### Auth Redux (`authSlice.ts`)

- **`register`** (thunk async) : inscription → stocke les deux tokens dans `localStorage` + Redux
- **`login`** (thunk async) : connexion → idem
- **`fetchProfile`** (thunk async) : récupère le profil à chaque rechargement si un token existe
- **`updateProfile`** (thunk async) : PATCH partiel du profil, met à jour Redux immédiatement
- **`logout`** (action sync) : vide le store + supprime `access_token` / `refresh_token` du `localStorage`
- **`clearError`** (action sync) : réinitialise les erreurs sans logout

#### Axios Interceptors (`axiosInstance.ts`)

- **Request interceptor** : injecte `Authorization: Bearer <token>` sur chaque requête
- **Response interceptor** : en cas de `401`, tente un refresh silencieux, puis rejoue la requête originale ; si le refresh échoue → supprime les tokens et redirige vers `/login`

#### Route Guard (`ProtectedRoute`)

- Composant wrapper qui vérifie la présence du `accessToken` dans le store Redux
- Redirection automatique vers `/login` si non authentifié, sans flash de contenu

#### Séparation des sérialiseurs (pattern DRF)

| Contexte | Sérialiseur |
|---|---|
| Liste tournois (`GET`) | `TournamentListSerializer` (champs réduits, performant) |
| Détail tournoi (`GET/POST`) | `TournamentSerializer` (champs complets avec participants/matchs) |
| Profil utilisateur | `UserProfileSerializer` (données privées) |
| Liste publique | `UserPublicSerializer` (données visibles par tous) |
