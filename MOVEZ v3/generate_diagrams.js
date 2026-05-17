const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const screenshotsDir = path.join(__dirname, 'screenshots');

const diagrams = [
  {
    name: '01_diagramme_cas_utilisation',
    code: `flowchart LR
    U(("Utilisateur (Sportif)"))
    O(("Organisateur"))
    A(("Administrateur"))
    subgraph MOVEZ_System ["Système MOVEZ v3"]
        direction TB
        UC1(["S'inscrire / Se connecter"])
        UC2(["Gérer son Profil & ELO"])
        UC3(["Consulter le Classement (Leaderboard)"])
        UC4(["Rechercher et Matchmaker (Swipe)"])
        UC5(["Réserver un Terrain"])
        UC6(["Payer une réservation (Stripe)"])
        UC7(["S'inscrire à un Tournoi"])
        UC8(["Créer/Gérer un Tournoi"])
        UC9(["Gérer les Terrains & Utilisateurs"])
        UC10(["Modérer les conflits"])
    end
    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    O --> UC1
    O --> UC8
    O --> UC3
    A --> UC9
    A --> UC10
    UC5 -. "<< include >>" .-> UC6
    UC4 -. "<< extend >>" .-> UC5
    UC7 -. "<< include >>" .-> UC6`
  },
  {
    name: '02_classes_uml',
    code: `classDiagram
    class User {
        +Integer id
        +String username
        +String email
        +String password
        +String bio
        +Integer elo_score
        +String avatar
        +login()
        +updateProfile()
    }
    class Terrain {
        +Integer id
        +String name
        +String type_sport
        +String location
        +Float price_per_hour
        +Boolean is_active
        +getAvailability()
    }
    class Reservation {
        +Integer id
        +DateTime start_time
        +DateTime end_time
        +String status
        +Float total_price
        +confirmPayment()
        +cancel()
    }
    class MatchmakingSession {
        +Integer id
        +DateTime created_at
        +String status
        +swipeRight()
        +swipeLeft()
    }
    class Tournament {
        +Integer id
        +String name
        +DateTime start_date
        +DateTime end_date
        +Integer max_participants
        +String status
        +generateBracket()
    }
    class Payment {
        +Integer id
        +Float amount
        +String stripe_id
        +String status
        +DateTime created_at
        +process()
    }
    User "1" -- "*" Reservation : "effectue"
    Reservation "*" -- "1" Terrain : "concerne"
    Reservation "1" -- "1" Payment : "génère"
    User "1" -- "*" MatchmakingSession : "participe"
    MatchmakingSession "*" -- "*" User : "adversaires"
    User "*" -- "*" Tournament : "s'inscrit"
    Tournament "1" -- "*" Reservation : "réserve terrains"`
  },
  {
    name: '03_sequence_asynchrone',
    code: `sequenceDiagram
    actor U as Utilisateur
    participant F as Frontend (React)
    participant B as Backend (Django)
    participant C as Celery Worker
    participant S as Stripe API
    participant DB as Base de Données
    U->>F: Sélectionne un terrain et un créneau
    F->>B: POST /api/reservations/ (Données de résa)
    B->>DB: Vérifie disponibilité
    DB-->>B: Disponible
    B->>DB: Crée Réservation (Statut: PENDING)
    B-->>F: Retourne ID Réservation & Client Secret
    F->>S: Soumet les informations de carte
    S-->>F: Confirme le paiement
    F->>B: Notifie succès du paiement
    B->>C: Tâche asynchrone (verify_payment_task)
    C->>S: Vérifie le statut via Stripe API
    S-->>C: Statut : Succeeded
    C->>DB: Met à jour Réservation (Statut: CONFIRMED)
    C->>B: Déclenche notification WebSocket
    B-->>F: Envoie événement "Reservation_Confirmed"
    F-->>U: Affiche le reçu de réservation`
  },
  {
    name: '04_sequence_matchmaking',
    code: `sequenceDiagram
    actor U1 as Joueur A
    participant F as Frontend (TinderCard)
    participant B as Backend (Django)
    participant M as Moteur Matchmaking
    actor U2 as Joueur B
    U1->>F: Accède à la page Matchmaking
    F->>B: GET /api/matchmaking/profiles
    B->>M: Calcule compatibilité ELO (+/- 200)
    M-->>B: Liste des profils compatibles
    B-->>F: Renvoie les profils (incluant Joueur B)
    F-->>U1: Affiche la carte de Joueur B
    U1->>F: Swipe Droit (Like)
    F->>B: POST /api/matchmaking/swipe (Like, ID: Joueur B)
    B->>DB: Enregistre le Swipe
    alt Si Joueur B a déjà liké Joueur A
        B-->>F: Match ! (WebSocket Event)
        F-->>U1: Animation "It's a Match!"
        B->>U2: Notification de Match
    else Pas encore de réciprocité
        B-->>F: Swipe enregistré
    end
    U1->>F: Fin de la partie (Saisie du score)
    F->>B: POST /api/matchmaking/score
    B->>M: Ajuste l'ELO (Formule K-Factor)
    M-->>B: Nouvel ELO Joueur A (+15), Joueur B (-15)
    B->>DB: Sauvegarde les nouveaux ELO
    B-->>F: Met à jour le Dashboard`
  },
  {
    name: '05_mcd',
    code: `erDiagram
    UTILISATEUR {
        int id PK
        string email
        string username
        int elo_score
        string bio
    }
    TERRAIN {
        int id PK
        string nom
        string type_sport
        float prix_horaire
    }
    RESERVATION {
        int id PK
        datetime date_heure_debut
        datetime date_heure_fin
        string statut
    }
    PAIEMENT {
        int id PK
        float montant
        string statut
        string stripe_id
    }
    TOURNOI {
        int id PK
        string nom
        datetime date_debut
        datetime date_fin
    }
    MATCH {
        int id PK
        int score_joueur1
        int score_joueur2
        datetime date_match
    }
    UTILISATEUR ||--o{ RESERVATION : "effectue"
    TERRAIN ||--o{ RESERVATION : "est réservé pour"
    RESERVATION ||--|| PAIEMENT : "est réglée par"
    UTILISATEUR }o--o{ TOURNOI : "participe à"
    TOURNOI ||--o{ MATCH : "contient"
    UTILISATEUR ||--o{ MATCH : "joue dans"`
  }
];

if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

diagrams.forEach(diagram => {
  const mmdPath = path.join(screenshotsDir, diagram.name + '.mmd');
  const pngPath = path.join(screenshotsDir, diagram.name + '.png');
  fs.writeFileSync(mmdPath, diagram.code);
  console.log(`Generating ${diagram.name}.png...`);
  execSync(`npx mmdc -i "${mmdPath}" -o "${pngPath}" -b transparent`, { stdio: 'inherit' });
  fs.unlinkSync(mmdPath); // Clean up the .mmd file
});
console.log('All diagrams generated successfully.');
