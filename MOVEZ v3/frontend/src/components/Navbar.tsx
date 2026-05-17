import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '../features/auth/authSlice';
import { Users, Calendar, Trophy, LogOut, ChevronDown, LayoutDashboard, MapPin, Shield, Medal, Home, Settings } from 'lucide-react';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/dashboard', icon: Home, label: 'Accueil' },
  { path: '/map', icon: MapPin, label: 'Terrains' },
  { path: '/matchmaking', icon: Users, label: 'Matchmaking' },
  { path: '/ranking', icon: Medal, label: 'Classement' },
  { path: '/reservations', icon: Calendar, label: 'Réservations' },
  { path: '/tournaments', icon: Trophy, label: 'Tournois' },
];

export default function Navbar() {
  const dispatch  = useAppDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');        // → back to landing, NOT /login
  };

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar glass">
      <div className="navbar-container">

        {/* ── BRAND ── */}
        <Link to="/dashboard" className="navbar-brand">
          <div className="nav-logo-img" />
          <span className="nav-brand-name">
            <span className="nav-brand-mov">MOV</span><span className="nav-brand-ez">EZ</span>
          </span>
        </Link>

        {/* ── LINKS ── */}
        <div className="navbar-links">
          {NAV_LINKS.map(({ path, icon: Icon, label }) => (
            <Link key={path} to={path} className={`nav-item ${isActive(path)}`}>
              <Icon size={16} /> <span className="nav-label">{label}</span>
            </Link>
          ))}
          {user?.role === 'ORGANISATEUR' && (
            <Link to="/organizer" className={`nav-item ${isActive('/organizer')}`}>
              <LayoutDashboard size={16} /> <span className="nav-label">Orga</span>
            </Link>
          )}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className={`nav-item ${isActive('/admin')}`}>
              <Shield size={16} /> <span className="nav-label">Admin</span>
            </Link>
          )}
        </div>

        {/* ── USER ── */}
        <div className="navbar-user">
          <Link to="/profile" className="user-chip">
            <span className="user-avatar">{user?.first_name?.[0]?.toUpperCase() || '?'}</span>
            <div className="user-info">
              <span className="user-name">{user?.full_name || 'Profil'}</span>
              <span className="user-role">{user?.role || ''}</span>
            </div>
            <ChevronDown size={14} className="dropdown-icon" />
          </Link>
          <Link to="/settings" className="btn-icon" title="Paramètres">
            <Settings size={18} />
          </Link>
          <button className="btn-icon" onClick={handleLogout} title="Déconnexion">
            <LogOut size={18} />
          </button>
        </div>

      </div>
    </nav>
  );
}
