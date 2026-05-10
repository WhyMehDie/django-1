import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { useAuthModal } from '../context/AuthModalContext';
import { Trophy, MapPin, Calendar, Users, Star, Zap, X, Home, Medal } from 'lucide-react';
import './LandingPage.css';

const PREVIEW_TOURNAMENTS = [
  { id: 1, name: 'Championnat Padel Casablanca', sport: 'Padel',    status: 'OPEN',        date: '15 Mai 2026', location: 'Casablanca', current: 6, max: 8,  prize: '5000 MAD' },
  { id: 2, name: 'Football 5v5 Rabat Open',      sport: 'Football', status: 'IN_PROGRESS', date: '10 Mai 2026', location: 'Rabat',      current: 8, max: 8,  prize: '3000 MAD' },
  { id: 3, name: 'Tennis Tournament Marrakech',  sport: 'Tennis',   status: 'OPEN',        date: '25 Mai 2026', location: 'Marrakech',  current: 3, max: 16, prize: '8000 MAD' },
];
const PREVIEW_TERRAINS = [
  { id: 1, name: 'Complexe Al Amal',   sport: 'Football',   city: 'Casablanca', price: 150, capacity: 10 },
  { id: 2, name: 'Club de Padel CFC',  sport: 'Padel',      city: 'Rabat',      price: 120, capacity: 4  },
  { id: 3, name: 'Beach Court Agadir', sport: 'Volleyball', city: 'Agadir',     price: 90,  capacity: 12 },
  { id: 4, name: 'Tennis Park Fes',    sport: 'Tennis',     city: 'Fes',        price: 100, capacity: 2  },
];
const PREVIEW_RANKING = [
  { rank: 1, name: 'Hamza B.',   sport: 'Surf',       elo: 1950, city: 'Taghazout'  },
  { rank: 2, name: 'Rachid M.',  sport: 'Padel',      elo: 1880, city: 'Casablanca' },
  { rank: 3, name: 'Mohamed K.', sport: 'Tennis',     elo: 1800, city: 'Marrakech'  },
  { rank: 4, name: 'Tarik J.',   sport: 'Football',   elo: 1750, city: 'Fes'        },
  { rank: 5, name: 'Omar S.',    sport: 'Basketball', elo: 1720, city: 'Tanger'     },
];
const STATUS_COLORS: Record<string, string> = {
  OPEN: '#a3e635', IN_PROGRESS: '#7c3aed',
};
const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Inscriptions ouvertes', IN_PROGRESS: 'En cours',
};

const NAV_LINKS = [
  { label: 'Accueil',      action: 'accueil'     },
  { label: 'Terrains',     action: 'terrains'    },
  { label: 'Matchmaking',  action: 'matchmaking' },
  { label: 'Classement',   action: 'ranking'     },
  { label: 'Reservations', action: 'reservations'},
  { label: 'Tournois',     action: 'tournaments' },
];

export default function LandingPage() {
  const navigate   = useNavigate();
  const { openLogin } = useAuthModal();
  const { accessToken } = useAppSelector((s) => s.auth);
  const sphereRef  = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (accessToken) navigate('/dashboard');
  }, [accessToken, navigate]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!sphereRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 50;
      const y = (e.clientY / window.innerHeight - 0.5) * 50;
      sphereRef.current.style.transform = `translateX(calc(-50% + ${x}px)) translateY(${y}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Close menu on scroll
  useEffect(() => {
    const onScroll = () => setMenuOpen(false);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-active');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleNavLink = (action: string) => {
    setMenuOpen(false);
    if (action === 'accueil') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(`section-${action}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Protected sections → login popup
      openLogin('Connectez-vous pour acceder a cette section');
    }
  };

  const guard = (msg: string) => openLogin(msg);

  return (
    <div className="lp-root">
      <div className="lp-grid" />
      <div className="lp-sweep" />
      <div className="lp-sphere" ref={sphereRef} />

      {/* ══ SLIDE-DOWN MENU ══ */}
      <div className={`lp-menu-drawer ${menuOpen ? 'open' : ''}`}>
        <div className="lp-menu-inner">
          <button className="lp-menu-close" onClick={() => setMenuOpen(false)}>
            <X size={22} />
          </button>
          <div className="lp-menu-links">
            {NAV_LINKS.map((l) => (
              <button key={l.action} className="lp-menu-link" onClick={() => handleNavLink(l.action)}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="lp-menu-bottom">
            <button className="lp-btn-solid" onClick={() => { setMenuOpen(false); navigate('/register'); }}>
              Creer un compte
            </button>
            <button className="lp-btn-outline" onClick={() => { setMenuOpen(false); openLogin(); }}>
              Se connecter
            </button>
          </div>
        </div>
      </div>
      {menuOpen && <div className="lp-menu-backdrop" onClick={() => setMenuOpen(false)} />}

      {/* NAV */}
      <nav className="lp-nav">
        {/* LOGO — no box, just image + text */}
        <div className="lp-nav-logo">
          <div className="lp-logo-img" />
          <span className="lp-logo-word">
            <span className="lp-logo-mov">MOV</span><span className="lp-logo-ez">EZ</span>
          </span>
        </div>

        {/* RIGHT */}
        <div className="lp-nav-right">
          <button id="lp-login-btn" className="lp-nav-pill" onClick={() => openLogin()}>
            Se connecter
          </button>
          <button
            className={`lp-hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="lp-hero">
        <div className="lp-ghost" aria-hidden>
          <div>MOV</div>
          <div>EZ</div>
        </div>
        <div className="lp-content">
          <h1 className="lp-headline">
            Ton sport<br />
            + ton equipe<br />
            <strong>ta victoire.</strong>
          </h1>
          <p className="lp-sub">
            Trouve des adversaires, reserve des terrains<br />
            et rejoins des tournois — tout en un seul endroit.
          </p>
          <button id="lp-cta" className="lp-cta-circle" onClick={() => navigate('/register')}>
            JOUER
          </button>
        </div>
        <div className="lp-arrow">↓</div>
      </section>

      {/* ══ TOURNAMENTS ══ */}
      <section id="section-tournaments" className="lp-section reveal">
        <div className="lp-section-header">
          <div>
            <h2 className="lp-section-title">Tournois en cours</h2>
            <p className="lp-section-sub">Consultez et inscrivez-vous aux competitions</p>
          </div>
          <button className="lp-see-all" onClick={() => guard('Connectez-vous pour voir tous les tournois')}>
            Voir tout
          </button>
        </div>
        <div className="lp-tournaments-grid">
          {PREVIEW_TOURNAMENTS.map((t) => (
            <div key={t.id} className="lp-t-card glass">
              <div className="lp-t-header">
                <h3 className="lp-t-name">{t.name}</h3>
                <span className="lp-t-status" style={{ background: STATUS_COLORS[t.status] }}>
                  {STATUS_LABELS[t.status]}
                </span>
              </div>
              <div className="lp-t-meta">
                <span><Zap size={13} /> {t.sport}</span>
                <span><MapPin size={13} /> {t.location}</span>
                <span><Calendar size={13} /> {t.date}</span>
              </div>
              <div className="lp-t-prize"><Trophy size={13} /> Prix: {t.prize}</div>
              <div className="lp-t-bar">
                <div className="lp-t-fill" style={{ width: `${(t.current / t.max) * 100}%` }} />
              </div>
              <div className="lp-t-spots">{t.current}/{t.max} inscrits</div>
              <button className="lp-t-btn" onClick={() => guard("Connectez-vous pour vous inscrire a ce tournoi")}>
                S'inscrire
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TERRAINS ══ */}
      <section id="section-terrains" className="lp-section lp-section-alt reveal">
        <div className="lp-section-header">
          <div>
            <h2 className="lp-section-title">Terrains disponibles</h2>
            <p className="lp-section-sub">Reserve ton creneau en quelques clics</p>
          </div>
          <button className="lp-see-all" onClick={() => guard('Connectez-vous pour reserver un terrain')}>
            Voir tout
          </button>
        </div>
        <div className="lp-terrains-grid">
          {PREVIEW_TERRAINS.map((t) => (
            <div key={t.id} className="lp-terrain-card glass">
              <div className="lp-terrain-sport-badge">{t.sport}</div>
              <h3 className="lp-terrain-name">{t.name}</h3>
              <div className="lp-terrain-meta">
                <span><MapPin size={13} /> {t.city}</span>
                <span><Users size={13} /> {t.capacity} joueurs</span>
              </div>
              <div className="lp-terrain-price">{t.price} MAD / heure</div>
              <button className="lp-terrain-btn" onClick={() => guard('Connectez-vous pour reserver ce terrain')}>
                Reserver
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══ RANKING ══ */}
      <section id="section-ranking" className="lp-section reveal">
        <div className="lp-section-header">
          <div>
            <h2 className="lp-section-title">Classement ELO</h2>
            <p className="lp-section-sub">Les meilleurs joueurs de la plateforme</p>
          </div>
        </div>
        <div className="lp-ranking-list">
          {PREVIEW_RANKING.map((p) => (
            <div key={p.rank} className="lp-rank-row glass">
              <span className={`lp-rank-num rank-${p.rank}`}>#{p.rank}</span>
              <div className="lp-rank-info">
                <span className="lp-rank-name">{p.name}</span>
                <span className="lp-rank-city"><MapPin size={11} /> {p.city}</span>
              </div>
              <span className="lp-rank-sport">{p.sport}</span>
              <div className="lp-rank-elo"><Star size={14} /><span>{p.elo}</span></div>
              <button className="lp-rank-challenge" onClick={() => guard('Connectez-vous pour defier ce joueur')}>
                Defier
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <section className="lp-footer">
        <h2>Pret a jouer ?</h2>
        <div className="lp-footer-btns">
          <button className="lp-btn-solid" onClick={() => navigate('/register')}>Creer mon compte</button>
          <button className="lp-btn-outline" onClick={() => openLogin()}>J'ai deja un compte</button>
        </div>
      </section>
    </div>
  );
}
