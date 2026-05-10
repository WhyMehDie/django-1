import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login, clearError } from '../features/auth/authSlice';
import { useAuthModal } from '../context/AuthModalContext';
import './LoginModal.css';

const TEST_ACCOUNTS = [
  { label: 'Admin',       email: 'admin@sport.ma',   password: 'Admin@1234',  color: '#7c3aed' },
  { label: 'Joueur',      email: 'joueur@sport.ma',  password: 'Joueur@1234', color: '#a3e635' },
  { label: 'Joueur 2',    email: 'joueur2@sport.ma', password: 'Joueur@1234', color: '#a3e635' },
  { label: 'Organisateur',email: 'org@sport.ma',     password: 'Org@1234',    color: '#f59e0b' },
];

export default function LoginModal() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isOpen, closeLogin, message } = useAuthModal();
  const { loading, error, accessToken } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  // Close on successful login
  useEffect(() => {
    if (accessToken && isOpen) {
      closeLogin();
    }
  }, [accessToken, isOpen, closeLogin]);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setForm({ email: '', password: '' });
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(form));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) closeLogin();
  };

  return (
    <div className="lmodal-backdrop" onClick={handleBackdropClick}>
      <div className="lmodal-card">
        {/* Close button */}
        <button className="lmodal-close" onClick={closeLogin} aria-label="Fermer">
          ×
        </button>

        {/* Logo */}
        <div className="lmodal-logo">
          <div className="lmodal-logo-img" />
        </div>

        <h2 className="lmodal-title">Connexion</h2>

        {message && (
          <p className="lmodal-message">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="lmodal-form">
          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              id="modal-login-email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
          <div className="field-group">
            <label>Mot de passe</label>
            <input
              type="password"
              id="modal-login-password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="lmodal-submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="lmodal-register">
          Pas de compte ?{' '}
          <button
            className="lmodal-link"
            onClick={() => { closeLogin(); navigate('/register'); }}
          >
            S'inscrire
          </button>
        </p>

        {/* Quick-fill test accounts */}
        <div className="lmodal-test-accounts">
          <p className="lmodal-test-label">Comptes de test</p>
          <div className="lmodal-test-grid">
            {TEST_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="lmodal-test-pill"
                style={{ '--pill': acc.color } as React.CSSProperties}
                onClick={() => setForm({ email: acc.email, password: acc.password })}
              >
                <span className="lmodal-pill-role">{acc.label}</span>
                <span className="lmodal-pill-email">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
