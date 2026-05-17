import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { register, clearError } from '../features/auth/authSlice';
import './AuthPage.css';

const ROLES = [
  { value: 'JOUEUR', label: 'Joueur' },
  { value: 'COACH', label: 'Coach Sportif' },
  { value: 'GERANT', label: 'Gérant Complexe' },
  { value: 'ORGANISATEUR', label: 'Organisateur' },
];

const SPORTS = ['Football', 'Basketball', 'Tennis', 'Padel', 'Volleyball'];

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, accessToken } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({
    email: '', password: '', password2: '',
    first_name: '', last_name: '', role: 'JOUEUR',
    sport: '', city: '',
  });

  useEffect(() => {
    if (accessToken) navigate('/');
    return () => { dispatch(clearError()); };
  }, [accessToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(register(form));
  };

  return (
    <div className="auth-bg">
      <div className="auth-card wide">
        <div className="auth-logo">
          <img src="/logo.png" alt="Movez" className="auth-logo-img" />
        </div>
        <h1 className="auth-title">Inscription</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="field-group">
              <label>Prénom</label>
              <input id="reg-firstname" type="text" placeholder="Ahmed" value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
            </div>
            <div className="field-group">
              <label>Nom</label>
              <input id="reg-lastname" type="text" placeholder="Benali" value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
            </div>
          </div>
          <div className="field-group">
            <label>Email</label>
            <input id="reg-email" type="email" placeholder="votre@email.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-row">
            <div className="field-group">
              <label>Mot de passe</label>
              <input id="reg-password" type="password" placeholder="••••••••" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="field-group">
              <label>Confirmer MDP</label>
              <input id="reg-password2" type="password" placeholder="••••••••" value={form.password2}
                onChange={(e) => setForm({ ...form, password2: e.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <div className="field-group">
              <label>Rôle</label>
              <select id="reg-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="field-group">
              <label>Sport</label>
              <select id="reg-sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
                <option value="">Choisir...</option>
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="field-group">
            <label>Ville</label>
            <input id="reg-city" type="text" placeholder="Casablanca" value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>
        <p className="auth-link">Déjà inscrit ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  );
}
