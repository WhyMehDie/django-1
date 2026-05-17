import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, clearError } from '../features/auth/authSlice';
import './AuthPage.css';

const TEST_ACCOUNTS = [
  { label: 'Admin', email: 'admin@sport.ma', password: 'Admin@1234', color: '#6366f1' },
  { label: 'Joueur', email: 'joueur@sport.ma', password: 'Joueur@1234', color: '#10b981' },
  { label: 'Joueur 2', email: 'joueur2@sport.ma', password: 'Joueur@1234', color: '#10b981' },
  { label: 'Organisateur', email: 'org@sport.ma', password: 'Org@1234', color: '#f59e0b' },
];

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, accessToken } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (accessToken) navigate('/dashboard');
    return () => { dispatch(clearError()); };
  }, [accessToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-img" />
        </div>
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-subtitle">Bienvenue sur la plateforme sportive du Maroc</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              id="login-email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="field-group">
            <label>Mot de passe</label>
            <input
              type="password"
              id="login-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        <p className="auth-link">
          Pas de compte ? <Link to="/register">S'inscrire</Link>
        </p>

        <div className="test-accounts">
          <p className="test-accounts-label">🧪 Comptes de test — cliquez pour remplir</p>
          <div className="test-accounts-grid">
            {TEST_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="test-account-pill"
                style={{ '--pill-color': acc.color } as React.CSSProperties}
                onClick={() => setForm({ email: acc.email, password: acc.password })}
              >
                <span className="pill-role">{acc.label}</span>
                <span className="pill-email">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
