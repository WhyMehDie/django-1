import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTournaments, fetchSponsors } from '../features/competitions/competitionsSlice';
import { Trophy, Calendar, MapPin, Zap } from 'lucide-react';
import './Tournaments.css';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon', OPEN: 'Inscriptions ouvertes',
  IN_PROGRESS: 'En cours', COMPLETED: 'Terminé', CANCELLED: 'Annulé',
};
const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#6b7280', OPEN: '#10b981',
  IN_PROGRESS: '#3b82f6', COMPLETED: '#8b5cf6', CANCELLED: '#ef4444',
};

const CONFERENCES = [
  { id: 1, title: 'Sommet eSport MENA 2026', sport: 'eSport', date: '25 Avr 2026', location: 'Casablanca (Hyatt Regency)', desc: 'Le futur du gaming compétitif en Afrique et opportunités professionnelles.' },
  { id: 2, title: 'Masterclass Snooker Pro', sport: 'Snooker', date: '10 Mai 2026', location: 'Rabat (Club de la Capitale)', desc: 'Techniques avancées, gestion du stress et démonstrations avec des professionnels internationaux.' },
  { id: 3, title: 'Préparation Mentale du Sportif', sport: 'Tous sports', date: '12 Juin 2026', location: 'En ligne (Webinaire)', desc: 'Optimisation de la concentration et gestion des défis physiques à haut niveau.' }
];



export default function TournamentsPage() {
  const dispatch = useAppDispatch();
  const { tournaments, sponsors, loading } = useAppSelector((s) => s.competitions);

  useEffect(() => {
    dispatch(fetchTournaments());
    dispatch(fetchSponsors());
  }, [dispatch]);

  const handleConfSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Détails d'inscription envoyés sur votre boîte mail !");
  };

  return (
    <div className="page-container page-tournaments">
      <div className="wave-header">
        <div className="wave-header-content">
          <h1 className="wave-title">Compétitions & Tournois</h1>
          <p className="wave-subtitle">Rejoignez l'élite, participez aux plus grands événements de la communauté.</p>
        </div>
        <div className="wave-svg-container">
          <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="wave-svg">
             <path fill="var(--bg)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,144,864,165.3C960,187,1056,197,1152,192C1248,187,1344,171,1392,160L1440,149.3L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {loading ? <div className="loading-spinner">Chargement...</div> : (
        <div className="tournaments-grid">
          {tournaments.map((t) => (
            <Link key={t.id} to={`/tournaments/${t.id}`} className="tournament-card-lg glass">
              <div className="tc-header">
                <h3 className="tc-name">{t.name}</h3>
                <span className="tc-status" style={{ background: STATUS_COLORS[t.status] }}>
                  {STATUS_LABELS[t.status]}
                </span>
              </div>
              <div className="tc-details">
                <div className="tc-sport">{t.sport}</div>
                {t.location && <div className="tc-location"><MapPin size={14} style={{ marginRight: '4px' }}/> {t.location}</div>}
              </div>
              <div className="tc-dates"><Calendar size={14} style={{ marginRight: '4px' }}/> {t.start_date} → {t.end_date}</div>
              <div className="tc-format"><Zap size={14} style={{ marginRight: '4px' }}/> Format: {t.format.replace('_', ' ')}</div>
              {t.prize && <div className="tc-prize"><Trophy size={14} style={{ marginRight: '4px' }}/> Prix: {t.prize}</div>}
              <div className="tc-participants">
                <div className="participants-bar">
                  <div
                    className="participants-fill"
                    style={{ width: `${(t.participants_count / t.max_participants) * 100}%` }}
                  />
                </div>
                <span>{t.participants_count} / {t.max_participants} inscrits</span>
              </div>
            </Link>
          ))}
          {tournaments.length === 0 && (
            <p className="empty-state">Aucun tournoi disponible pour le moment.</p>
          )}
        </div>
      )}

      {/* Conférences */}
      <div className="section-divider">
        <h2 className="section-title">Conférences & Événements à venir</h2>
        <p className="section-desc">Développez vos connaissances, venez assister et rencontrez les professionnels du secteur.</p>
      </div>
      <div className="conferences-grid">
        {CONFERENCES.map(conf => (
          <div key={conf.id} className="conference-card glass">
            <div className="conf-header">
              <span className="conf-sport">{conf.sport}</span>
              <span className="conf-date">{conf.date}</span>
            </div>
            <h3 className="conf-title">{conf.title}</h3>
            <p className="conf-desc">{conf.desc}</p>
            <div className="conf-footer">
              <span className="conf-location"><MapPin size={16} /> {conf.location}</span>
              <button className="btn-primary conf-btn" onClick={handleConfSubmit}>
                Y Assister
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsors */}
      <div className="sponsors-section">
        <h3 className="sponsors-title">Nos Partenaires & Sponsors Officiels</h3>
        <div className="sponsors-track">
          {sponsors.map(s => (
            <div key={s.id} className="sponsor-item">
              <img src={s.logo} alt={s.name} className="sponsor-logo-img" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
