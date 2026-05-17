import { useState, useEffect } from 'react';
import axios from '../api/axiosInstance';
import { Trophy, Medal, MapPin, Activity } from 'lucide-react';
import './Ranking.css';

interface UserPublic {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  sport: string;
  city: string;
  elo_rating: number;
  avatar: string | null;
}

const CATEGORIES = ['Tous', 'Football', 'Basketball', 'Tennis', 'Padel', 'Volleyball', 'Surf', 'Gymnastics'];

export default function RankingPage() {
  const [rankings, setRankings] = useState<UserPublic[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('Tous');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRankings();
  }, [selectedSport]);

  const fetchRankings = async () => {
    setLoading(true);
    try {
      const params = selectedSport === 'Tous' ? {} : { sport: selectedSport };
      const res = await axios.get('/matchmaking/ranking/', { params });
      setRankings(res.data.results || res.data); // Support both paginated and non-paginated responses
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIndicator = (index: number) => {
    if (index === 0) return <Medal className="rank-icon gold" size={24} />;
    if (index === 1) return <Medal className="rank-icon silver" size={24} />;
    if (index === 2) return <Medal className="rank-icon bronze" size={24} />;
    return <span className="rank-number">{index + 1}</span>;
  };

  return (
    <div className="ranking-page slide-up">
      <div className="ranking-header">
        <h1><Trophy className="header-icon" /> Classement ELO</h1>
        <p>Découvrez les meilleurs joueurs par catégorie de sport</p>
      </div>

      <div className="categories-filter">
        {CATEGORIES.map((sport) => (
          <button
            key={sport}
            className={`btn-category ${selectedSport === sport ? 'active' : ''}`}
            onClick={() => setSelectedSport(sport)}
          >
            {sport}
          </button>
        ))}
      </div>

      <div className="ranking-container">
        {loading ? (
          <div className="loading-state">Chargement du classement...</div>
        ) : rankings.length > 0 ? (
          <div className="ranking-list">
            {rankings.map((user, index) => (
              <div key={user.id} className="ranking-card generic-card">
                <div className="rank-badge">
                  {getRankIndicator(index)}
                </div>
                <div className="player-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.full_name} className="avatar-img" />
                  ) : (
                    <div className="avatar-fallback">{user.first_name?.[0]?.toUpperCase() || '?'}</div>
                  )}
                </div>
                <div className="player-info">
                  <h3 className="player-name">{user.full_name}</h3>
                  <div className="player-details">
                    <span><Activity size={14} /> {user.sport || 'Non spécifié'}</span>
                    <span><MapPin size={14} /> {user.city || 'Non spécifiée'}</span>
                  </div>
                </div>
                <div className="player-score">
                  <div className="elo-value">{user.elo_rating}</div>
                  <div className="elo-label">ELO</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Trophy size={48} className="empty-icon" />
            <p>Aucun joueur classé dans cette catégorie pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}