import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTournamentDetail, registerForTournament, generateBracket } from '../features/competitions/competitionsSlice';
import { Trophy, Calendar, MapPin, Users, Info } from 'lucide-react';
import './Tournaments.css';

const RANDOM_NAMES = ["Yassine B.", "Karim R.", "Mehdi T.", "Ilias A.", "Amine F.", "Ayoub S.", "Reda M.", "Hicham L.", "Othmane K.", "Adil W.", "Tariq N.", "Zakaria E.", "Nabil J.", "Hassan D.", "Fouad P."];

export default function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedTournament, loading } = useAppSelector((s) => s.competitions);
  const { user } = useAppSelector((s) => s.auth);
  
  // A local state for the "simulated/random" bracket if backend hasn't generated one
  const [demoBracket, setDemoBracket] = useState<any>(null);

  useEffect(() => {
    if (id) dispatch(fetchTournamentDetail(Number(id)));
  }, [id, dispatch]);

  if (loading || !selectedTournament) return <div className="loading-spinner">Chargement...</div>;

  const t = selectedTournament as any;

  // Real bracket from DB
  const byRound = (t.matches || []).reduce((acc: Record<number, typeof t.matches>, m: any) => {
    if (!m) return acc;
    if (!acc[m.round_number]) acc[m.round_number] = [];
    acc[m.round_number]!.push(m);
    return acc;
  }, {});

  const isOrganizer = user?.id === t.organizer;

  // If real bracket doesn't exist, we build a visual one!
  const renderBracket = () => {
    let roundsData: Record<number, any[]> = {};
    const maxP = t.max_participants || 8;
    const realParticipantsCount = t.participants_count || 0;
    
    // We only simulate if there is no backend bracket
    if (Object.keys(byRound).length === 0) {
       let totalRounds = Math.ceil(Math.log2(maxP));
       if (totalRounds < 1) totalRounds = 1;
       if (totalRounds > 5) totalRounds = 5; // limit to 32 players for display
       
       let shuffledNames = [...RANDOM_NAMES].sort(() => 0.5 - Math.random());
       let nameIdx = 0;

       for (let r = 1; r <= totalRounds; r++) {
         roundsData[r] = [];
         let matchCount = Math.pow(2, totalRounds - r);
         for (let m = 0; m < matchCount; m++) {
           // For round 1, we populate some names
           let p1 = "En attente...";
           let p2 = "En attente...";
           
           if (r === 1) {
             // Randomly assign either real people style or left open
             // "create brackets with random anmes and only the one not full leave the places open"
             // Meaning we put some random names to fill it up, but leave some "Open" depending on maxP vs real count
             const filledSoFar = m * 2;
             if (filledSoFar < realParticipantsCount + 3) {
               p1 = shuffledNames[nameIdx % shuffledNames.length]; nameIdx++;
             } else {
               p1 = "Place libre";
             }
             
             if (filledSoFar + 1 < realParticipantsCount + 3) {
                p2 = shuffledNames[nameIdx % shuffledNames.length]; nameIdx++;
             } else {
                p2 = "Place libre";
             }
           } else {
             p1 = "TBD";
             p2 = "TBD";
           }

           roundsData[r].push({
             id: `sim-${r}-${m}`,
             player1_detail: { full_name: p1 },
             player2_detail: { full_name: p2 },
             score_player1: null,
             score_player2: null,
             status: r === 1 ? 'SCHEDULED' : 'DRAFT',
             winner: null
           });
         }
       }
    } else {
       roundsData = byRound;
    }

    return (
      <div className="bracket-wrapper">
         <div className="bracket-tree">
            {Object.entries(roundsData).map(([round, matches]) => (
              <div key={round} className="bracket-round">
                <h3 className="round-title">Round {round}</h3>
                <div className="bracket-matches">
                  {(matches || []).map((m: any) => (
                    <div key={m.id} className={`bracket-match glass ${m.status === 'COMPLETED' ? 'completed' : ''}`}>
                      <div className={`bracket-player ${m.winner === m.player1 ? 'winner' : ''} ${m.player1_detail?.full_name === 'Place libre' ? 'empty-slot' : ''}`}>
                        <span className="player-name">{m.player1_detail?.full_name || 'TBD'}</span>
                        {m.score_player1 !== null && <span className="score">{m.score_player1}</span>}
                      </div>
                      <div className="bracket-divider"></div>
                      <div className={`bracket-player ${m.winner === m.player2 ? 'winner' : ''} ${m.player2_detail?.full_name === 'Place libre' ? 'empty-slot' : ''}`}>
                        <span className="player-name">{m.player2_detail?.full_name || 'TBD'}</span>
                        {m.score_player2 !== null && <span className="score">{m.score_player2}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
         </div>
      </div>
    );
  };

  return (
    <div className="page-container page-tournament-detail">
      <div className="tournament-detail-header banner-glass">
        <div className="td-header-content">
          <span className="td-status-badge">{t.status.replace('_', ' ')}</span>
          <h1 className="td-title">{t.name}</h1>
          <div className="td-meta-grid">
            <span className="td-meta"><Trophy size={16}/> {t.sport} - {t.format.replace('_', ' ')}</span>
            {t.location && <span className="td-meta"><MapPin size={16}/> {t.location}</span>}
            <span className="td-meta"><Calendar size={16}/> {t.start_date} → {t.end_date}</span>
            <span className="td-meta"><Users size={16}/> {t.participants_count} / {t.max_participants} Joueurs</span>
          </div>

          {t.description && (
             <div className="td-description">
               <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
               <p>{t.description}</p>
             </div>
          )}
          
          {t.prize && <p className="td-prize">🏆 Prix: <strong>{t.prize}</strong></p>}

          <div className="t-actions">
            {t.status === 'OPEN' && (
              <button
                className="btn-primary btn-lg"
                onClick={() => dispatch(registerForTournament(t.id))}
              >
                Rejoindre le tournoi
              </button>
            )}
            {isOrganizer && t.status === 'OPEN' && (
              <button
                className="btn-secondary btn-lg"
                onClick={() => dispatch(generateBracket(t.id))}
              >
                Lancer le Tournoi (Générer)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bracket-section">
        <h2 className="section-title">Arbre du Tournoi (Bracket)</h2>
        <p className="section-subtitle">Aperçu interactif des matchs et qualifications.</p>
        {renderBracket()}
      </div>
    </div>
  );
}
