import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchRanking } from '../features/matchmaking/matchmakingSlice';
import { fetchTournaments } from '../features/competitions/competitionsSlice';
import './Dashboard.css';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { ranking } = useAppSelector((s) => s.matchmaking);
  const { tournaments } = useAppSelector((s) => s.competitions);

  useEffect(() => {
    dispatch(fetchRanking());
    dispatch(fetchTournaments({ status: 'OPEN' }));
  }, [dispatch]);

  return (
    <div className="dashboard">
      <div className="dashboard-hero">
        <h1>Bienvenue, <span>{user?.first_name || 'Joueur'}</span></h1>
        <p>Trouvez des partenaires au Maroc, réservez des terrains et participez aux tournois.</p>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-value">{user?.elo_rating ?? 1000}</span>
            <span className="stat-label">Elo Rating</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user?.role}</span>
            <span className="stat-label">Rôle</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{user?.sport || '—'}</span>
            <span className="stat-label">Sport</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dash-section">
          <h2>Accès rapide</h2>
          <div className="quick-links">
            <Link to="/matchmaking" className="quick-card">
              <span>Trouver un partenaire</span>
            </Link>
            <Link to="/reservations" className="quick-card">
              <span>Réserver un terrain</span>
            </Link>
            <Link to="/tournaments" className="quick-card">
              <span>Voir les tournois</span>
            </Link>
            <Link to="/profile" className="quick-card">
              <span>Mon profil</span>
            </Link>
          </div>
        </section>

        <section className="dash-section">
          <h2>Top Classement Elo</h2>
          <div className="ranking-list">
            {ranking.slice(0, 5).map((p, i) => (
              <div key={p.id} className="ranking-row">
                <span className={`rank-badge rank-${i + 1}`}>#{i + 1}</span>
                <span className="rank-name">{p.full_name}</span>
                <span className="rank-sport">{p.sport}</span>
                <span className="rank-elo">{p.elo_rating} pts</span>
              </div>
            ))}
            {ranking.length === 0 && <p className="empty-state">Aucun classement disponible</p>}
          </div>
          <Link to="/matchmaking" className="see-more">Voir tout le classement →</Link>
        </section>

        <section className="dash-section">
          <h2>Tournois ouverts</h2>
          <div className="tournament-list">
            {tournaments.slice(0, 4).map((t) => (
              <Link key={t.id} to={`/tournaments/${t.id}`} className="tournament-card">
                <span className="t-name">{t.name}</span>
                <span className="t-meta">{t.sport} · {t.location}</span>
                <span className="t-dates">{t.start_date} → {t.end_date}</span>
                <span className="t-spots">{t.participants_count}/{t.max_participants} inscrits</span>
              </Link>
            ))}
            {tournaments.length === 0 && <p className="empty-state">Aucun tournoi ouvert</p>}
          </div>
          <Link to="/tournaments" className="see-more">Tous les tournois →</Link>
        </section>
      </div>
    </div>
  );
}
