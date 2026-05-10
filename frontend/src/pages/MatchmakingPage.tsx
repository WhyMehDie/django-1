import React, { useState, useRef, useMemo } from 'react';
import TinderCard from 'react-tinder-card';
import { RefreshCcw, X, Heart, Star, MapPin, Users, User, UserPlus, Shield } from 'lucide-react';
import './Matchmaking.css';

/* ───────────────────────────────────────────
   SOLO PLAYERS — only solo/1v1 sports
─────────────────────────────────────────── */
const SOLO_PLAYERS = [
  {
    name: 'Amina', age: 27, sport: 'Tennis', city: 'Fès', elo: 1530,
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    bio: 'Je joue en club depuis 5 ans, très dispo les weekends matin !',
  },
  {
    name: 'Rachid', age: 30, sport: 'Padel', city: 'Casablanca', elo: 1880,
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    bio: 'Compétiteur né. Niveau avancé, rejoignez-moi pour le prochain tournoi local.',
  },
  {
    name: 'Zineb', age: 23, sport: 'Running', city: 'Rabat', elo: 1200,
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    bio: 'Marathonienne en herbe ! Cherche partenaire de footing matinal 🏃‍♀️',
  },
  {
    name: 'Hamza', age: 29, sport: 'Surf', city: 'Taghazout', elo: 1950,
    img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=500&q=80',
    bio: 'Toujours à la recherche des meilleures vagues. Surf session.',
  },
  {
    name: 'Salma', age: 24, sport: 'Padel', city: 'Rabat', elo: 1420,
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    bio: 'Niveau intermédiaire. Dispo le soir après 19h !',
  },
  {
    name: 'Mohamed', age: 28, sport: 'Tennis', city: 'Marrakech', elo: 1800,
    img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=500&q=80',
    bio: 'Grand fan de tennis, cherche partenaires pour monter en classement.',
  },
  {
    name: 'Sofia', age: 21, sport: 'Gymnastics', city: 'Rabat', elo: 1500,
    img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
    bio: "Amoureuse de gym, recherche partenaire pour s'entraîner.",
  },
  {
    name: 'Sara', age: 25, sport: 'Padel', city: 'Marrakech', elo: 1300,
    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=500&q=80',
    bio: "Débutante motivée ! Besoin de partenaires patients pour m'améliorer.",
  },
];

/* ───────────────────────────────────────────
   GROUP TEAMS
─────────────────────────────────────────── */
const GROUP_TEAMS = [
  {
    teamName: 'FC Casablanca Warriors',
    sport: 'Football',
    city: 'Casablanca',
    elo: 1750,
    currentMembers: 9,
    maxMembers: 11,
    captain: 'Youssef',
    img: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=500&q=80',
    bio: 'Équipe sérieuse cherche 2 derniers joueurs pour compléter le squad. Entraînements les mardis et jeudis.',
  },
  {
    teamName: 'Agadir Beach Volley',
    sport: 'Volleyball',
    city: 'Agadir',
    elo: 1350,
    currentMembers: 4,
    maxMembers: 6,
    captain: 'Khadija',
    img: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=500&q=80',
    bio: 'Team de beach volley cherche 2 passeuses. Sessions le weekend sur la plage 🏐',
  },
  {
    teamName: 'Tanger Streetball',
    sport: 'Basketball',
    city: 'Tanger',
    elo: 1720,
    currentMembers: 5,
    maxMembers: 5,
    captain: 'Omar',
    img: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=500&q=80',
    bio: 'Squad complet — cherche équipe adverse pour affrontement ce weekend en 5v5 !',
  },
  {
    teamName: 'Rabat Padel Club',
    sport: 'Padel',
    city: 'Rabat',
    elo: 1560,
    currentMembers: 3,
    maxMembers: 4,
    captain: 'Nadia',
    img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=500&q=80',
    bio: 'Cherche 4ème joueur pour compléter notre équipe de padel. Niveau intermédiaire requis.',
  },
  {
    teamName: 'Marrakech Thunder FC',
    sport: 'Football',
    city: 'Marrakech',
    elo: 1890,
    currentMembers: 11,
    maxMembers: 11,
    captain: 'Tarik',
    img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=500&q=80',
    bio: 'Équipe complète. Cherche adversaires pour match amical en 11v11. Numéro 10 dans l\'âme.',
  },
  {
    teamName: 'Fès Volleyball Elite',
    sport: 'Volleyball',
    city: 'Fès',
    elo: 1600,
    currentMembers: 5,
    maxMembers: 6,
    captain: 'Ilyas',
    img: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?auto=format&fit=crop&w=500&q=80',
    bio: 'Il nous manque un libero ! Niveau avancé, participation aux tournois régionaux.',
  },
];

/* ───────────────────────────────────────────
   SWIPE CARD — Solo
─────────────────────────────────────────── */
function SoloCard({ player }: { player: typeof SOLO_PLAYERS[0] }) {
  return (
    <div className="tinder-card" style={{ backgroundImage: `url(${player.img})` }}>
      <div className="card-gradient" />
      <div className="card-info">
        <h2>{player.name}, {player.age}</h2>
        <div className="badges">
          <span className="badge"><MapPin size={12} /> {player.city}</span>
          <span className="badge sport-badge"><User size={12} /> {player.sport}</span>
        </div>
        <p className="bio">{player.bio}</p>
        <div className="elo-rating">
          <Star size={16} /> <span>{player.elo} Elo</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   TEAM CARD — Group
─────────────────────────────────────────── */
function TeamCard({ team, onJoin, onChallenge }: {
  team: typeof GROUP_TEAMS[0];
  onJoin: () => void;
  onChallenge: () => void;
}) {
  const isFull = team.currentMembers >= team.maxMembers;
  const spotsLeft = team.maxMembers - team.currentMembers;
  const fillPct = (team.currentMembers / team.maxMembers) * 100;

  return (
    <div className="team-card-wrapper">
      <div className="team-card-img" style={{ backgroundImage: `url(${team.img})` }}>
        <div className="card-gradient" />
        <div className="team-card-overlay">
          <div className="team-sport-badge">
            <Users size={13} /> {team.sport}
          </div>
          <div className="elo-rating">
            <Star size={14} /> {team.elo} Elo
          </div>
        </div>
      </div>

      <div className="team-card-body">
        <div className="team-card-header">
          <div>
            <h2 className="team-name">{team.teamName}</h2>
            <span className="team-city"><MapPin size={12} /> {team.city}</span>
          </div>
          <div className={`team-status-badge ${isFull ? 'full' : 'open'}`}>
            {isFull ? '🔒 Complet' : `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} libre${spotsLeft > 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Member progress bar */}
        <div className="team-members-row">
          <div className="team-members-label">
            <Users size={14} /> Membres: <strong>{team.currentMembers}/{team.maxMembers}</strong>
          </div>
          <div className="team-progress-bar">
            <div className="team-progress-fill" style={{ width: `${fillPct}%`, background: isFull ? '#ef4444' : '#a855f7' }} />
          </div>
        </div>

        {/* Member dots */}
        <div className="team-dots">
          {Array.from({ length: team.maxMembers }).map((_, i) => (
            <div
              key={i}
              className={`team-dot ${i < team.currentMembers ? 'filled' : ''}`}
              style={{ background: i < team.currentMembers ? (isFull ? '#ef4444' : '#a855f7') : undefined }}
            />
          ))}
        </div>

        <p className="team-bio">{team.bio}</p>
        <p className="team-captain"><Shield size={12} /> Capitaine: <strong>{team.captain}</strong></p>

        {/* Action buttons */}
        <div className="team-actions">
          {!isFull ? (
            <button className="btn-join" onClick={onJoin}>
              <UserPlus size={16} /> Rejoindre l'équipe
            </button>
          ) : (
            <button className="btn-challenge" onClick={onChallenge}>
              <Users size={16} /> Défier l'équipe complète
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   MAIN PAGE
─────────────────────────────────────────── */
export default function MatchmakingPage() {
  const [mode, setMode] = useState<'solo' | 'group'>('solo');
  const [currentIndex, setCurrentIndex] = useState(SOLO_PLAYERS.length - 1);
  const [teamIndex, setTeamIndex] = useState(0);
  const [lastDirection, setLastDirection] = useState<string | null>(null);
  const [matchModal, setMatchModal] = useState<any | null>(null);
  const [joinModal, setJoinModal] = useState<typeof GROUP_TEAMS[0] | null>(null);
  const [challengeModal, setChallengeModal] = useState<typeof GROUP_TEAMS[0] | null>(null);

  const currentIndexRef = React.useRef(currentIndex);
  const preventSwipeDirections = useMemo(() => ['up', 'down'], []);

  const childRefs = React.useMemo(
    () => Array(SOLO_PLAYERS.length).fill(0).map(() => React.createRef<any>()),
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  const swiped = (direction: string, index: number) => {
    updateCurrentIndex(index - 1);
    if (direction === 'right') {
      setTimeout(() => setMatchModal(SOLO_PLAYERS[index]), 500);
    }
    setLastDirection(direction);
    setTimeout(() => setLastDirection(null), 1000);
  };

  const outOfFrame = (idx: number) => {
    if (currentIndexRef.current >= idx) updateCurrentIndex(idx - 1);
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < SOLO_PLAYERS.length) {
      const topIdx = currentIndex;
      const ref = childRefs[topIdx].current;
      if (ref?.swipe) {
        setLastDirection(dir);
        setTimeout(() => setLastDirection(null), 1000);
        await ref.swipe(dir);
        swiped(dir, topIdx);
        setTimeout(() => outOfFrame(topIdx), 300);
      }
    }
  };

  const reset = () => {
    updateCurrentIndex(SOLO_PLAYERS.length - 1);
    setLastDirection(null);
    setMatchModal(null);
    window.location.reload();
  };

  const currentTeam = GROUP_TEAMS[teamIndex];

  return (
    <div className="matchmaking-container">
      {/* ── SOLO MATCH MODAL ── */}
      {matchModal && (
        <div className="match-modal-overlay">
          <div className="match-modal glass">
            <h2 className="match-modal-title">C'est un Match ! 🎾</h2>
            <p className="match-modal-subtitle">Vous et {matchModal.name} avez matché.</p>
            <div className="match-modal-avatars">
              <div className="match-avatar" style={{ backgroundImage: `url(https://ui-avatars.com/api/?name=Mo&background=1F5568&color=fff)` }} />
              <div className="match-avatar-vs">VS</div>
              <div className="match-avatar" style={{ backgroundImage: `url(${matchModal.img})` }} />
            </div>
            <textarea className="match-modal-input" placeholder={`Envoyez un message à ${matchModal.name}...`} rows={3} />
            <div className="match-modal-actions">
              <button className="btn-secondary" onClick={() => setMatchModal(null)}>Plus tard</button>
              <button className="btn-primary" onClick={() => { alert('Message envoyé !'); setMatchModal(null); }}>Envoyer</button>
            </div>
          </div>
        </div>
      )}

      {/* ── JOIN TEAM MODAL ── */}
      {joinModal && (
        <div className="match-modal-overlay">
          <div className="match-modal glass">
            <h2 className="match-modal-title" style={{ color: '#a855f7' }}>Rejoindre l'équipe 🏅</h2>
            <p className="match-modal-subtitle">Vous allez envoyer une demande à <strong>{joinModal.teamName}</strong>.</p>
            <div className="team-join-info">
              <span className="badge"><Users size={12} /> {joinModal.currentMembers}/{joinModal.maxMembers} membres</span>
              <span className="badge sport-badge">{joinModal.sport}</span>
            </div>
            <textarea className="match-modal-input" placeholder={`Message pour le capitaine ${joinModal.captain}...`} rows={3} />
            <div className="match-modal-actions">
              <button className="btn-secondary" onClick={() => setJoinModal(null)}>Annuler</button>
              <button className="btn-primary" style={{ background: '#a855f7' }} onClick={() => { alert('Demande envoyée !'); setJoinModal(null); }}>Envoyer la demande</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHALLENGE MODAL ── */}
      {challengeModal && (
        <div className="match-modal-overlay">
          <div className="match-modal glass">
            <h2 className="match-modal-title" style={{ color: '#f59e0b' }}>Défier l'équipe ⚔️</h2>
            <p className="match-modal-subtitle">Lancer un défi à <strong>{challengeModal.teamName}</strong> ({challengeModal.sport}).</p>
            <div className="team-join-info">
              <span className="badge"><Users size={12} /> Équipe complète ({challengeModal.maxMembers}/{challengeModal.maxMembers})</span>
              <span className="badge" style={{ background: 'rgba(245,158,11,0.2)', borderColor: 'rgba(245,158,11,0.4)', color: '#f59e0b' }}>Elo {challengeModal.elo}</span>
            </div>
            <textarea className="match-modal-input" placeholder={`Message de défi pour ${challengeModal.captain}...`} rows={3} />
            <div className="match-modal-actions">
              <button className="btn-secondary" onClick={() => setChallengeModal(null)}>Annuler</button>
              <button className="btn-primary" style={{ background: '#f59e0b', color: '#000' }} onClick={() => { alert('Défi lancé !'); setChallengeModal(null); }}>Lancer le défi ⚔️</button>
            </div>
          </div>
        </div>
      )}

      <div className="glass matching-panel">
        <h1 className="matching-title">Découvrir</h1>
        <p className="matching-subtitle">Trouvez votre prochain adversaire !</p>

        {/* MODE TOGGLE */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'solo' ? 'active' : ''}`}
            onClick={() => setMode('solo')}
            id="mode-solo"
          >
            <User size={16} /> Solo Sport
          </button>
          <button
            className={`mode-btn ${mode === 'group' ? 'active' : ''}`}
            onClick={() => setMode('group')}
            id="mode-group"
          >
            <Users size={16} /> Équipes
          </button>
        </div>

        {/* ──────────── SOLO MODE ──────────── */}
        {mode === 'solo' && (
          <>
            <div className="card-container">
              {!canSwipe && (
                <div className="exhausted-deck">
                  <h3 style={{ fontSize: '20px', color: 'white', marginBottom: '8px' }}>Plus de joueurs !</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Revenez plus tard.</p>
                  <button onClick={reset} className="btn-primary" style={{ marginTop: '16px' }}>
                    <RefreshCcw size={16} /> Recommencer
                  </button>
                </div>
              )}

              {SOLO_PLAYERS.map((player, index) => {
                const isTop = index === currentIndex;
                const isSecond = index === currentIndex - 1;
                const isThird = index === currentIndex - 2;
                const isSwiped = index > currentIndex;

                let transformStyle = 'scale(1) translateY(0)';
                let opacityStyle = 1;

                if (isSwiped) { opacityStyle = 0; transformStyle = 'scale(0) translateY(-100%)'; }
                else if (isSecond) { transformStyle = 'scale(0.95) translateY(20px)'; opacityStyle = 0.9; }
                else if (isThird) { transformStyle = 'scale(0.90) translateY(40px)'; opacityStyle = 0.6; }
                else if (!isTop) { opacityStyle = 0; }

                return (
                  <TinderCard
                    ref={childRefs[index]}
                    className={`swipe ${isSwiped ? 'swiped-hidden' : ''}`}
                    key={player.name}
                    preventSwipe={preventSwipeDirections}
                    onSwipe={(dir) => swiped(dir, index)}
                    onCardLeftScreen={() => outOfFrame(index)}
                  >
                    <div
                      style={{
                        width: '100%', height: '100%',
                        transform: transformStyle, opacity: opacityStyle,
                        pointerEvents: isSwiped ? 'none' : 'auto',
                        transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease',
                      }}
                    >
                      <SoloCard player={player} />
                    </div>
                  </TinderCard>
                );
              })}
            </div>

            {canSwipe && (
              <div className="swipe-buttons">
                <button className="btn-swipe btn-nope" onClick={() => swipe('left')}><X size={28} /></button>
                <button className="btn-swipe btn-like" onClick={() => swipe('right')}><Heart size={28} fill="currentColor" /></button>
              </div>
            )}

            {lastDirection && (
              <div className={`swipe-indicator ${lastDirection}`}>
                {lastDirection === 'right' ? (
                  <div className="indicator-like">MATCH</div>
                ) : (
                  <div className="indicator-nope">NON</div>
                )}
              </div>
            )}
          </>
        )}

        {/* ──────────── GROUP MODE ──────────── */}
        {mode === 'group' && (
          <div className="group-mode">
            <div className="team-counter">
              <span>{teamIndex + 1} / {GROUP_TEAMS.length}</span>
            </div>

            <div className="team-card-scroll">
              <TeamCard
                team={currentTeam}
                onJoin={() => setJoinModal(currentTeam)}
                onChallenge={() => setChallengeModal(currentTeam)}
              />
            </div>

            <div className="team-nav-buttons">
              <button
                className="team-nav-btn"
                disabled={teamIndex === 0}
                onClick={() => setTeamIndex(i => i - 1)}
              >
                ← Précédente
              </button>
              <button
                className="team-nav-btn"
                disabled={teamIndex === GROUP_TEAMS.length - 1}
                onClick={() => setTeamIndex(i => i + 1)}
              >
                Suivante →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
