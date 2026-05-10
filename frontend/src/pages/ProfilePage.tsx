import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateProfile } from '../features/auth/authSlice';
import { Camera, MapPin, Activity, Phone, Star, Shield, Target, Ruler, Weight } from 'lucide-react';
import './Profile.css';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
    sport: user?.sport || '',
    city: user?.city || '',
    phone: user?.phone || '',
    height: user?.height || null as number | null,
    weight: user?.weight || null as number | null,
    position: user?.position || '',
    instagram: user?.instagram || '',
  });

  const handleSave = () => {
    dispatch(updateProfile(form));
    setEditing(false);
  };

  const roleLabels: Record<string, string> = {
    JOUEUR: 'Joueur', COACH: 'Coach Sportif',
    GERANT: 'Gérant Complexe', ORGANISATEUR: 'Organisateur', ADMIN: 'Admin',
  };

  // Generate an avatar URL or use the user's uploaded avatar
  const avatarUrl = user?.avatar 
    ? user.avatar 
    : `https://ui-avatars.com/api/?name=${user?.first_name}+${user?.last_name}&background=1F5568&color=fff&size=256&font-size=0.4`;

  // Generic sports background or user cover (use a placeholder here to look nice)
  const coverUrl = user?.cover_photo || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2069&auto=format&fit=crop";

  return (
    <div className="page-container">
      <div className="profile-wrapper">
        {/* Cover Banner */}
        <div className="profile-cover" style={{ backgroundImage: `url(${coverUrl})` }}>
           <div className="profile-cover-overlay"></div>
        </div>

        <div className="profile-main-content glass">
          {/* Avatar floating above */}
          <div className="profile-avatar-container">
            <img src={avatarUrl} alt={user?.full_name} className="profile-avatar-image" />
            <div className="profile-badge-overlay">
              <Shield size={14} className="badge-icon" />
              <span>{roleLabels[user?.role || ''] || user?.role}</span>
            </div>
          </div>

          {editing ? (
            <div className="profile-edit-form">
              <h2 className="edit-title">Modifier le profil</h2>
              <div className="form-row">
                <div className="field-group">
                  <label>Prénom</label>
                  <input value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
                </div>
                <div className="field-group">
                  <label>Nom</label>
                  <input value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
                </div>
              </div>
              <div className="field-group">
                <label>Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Parlez-nous de vous..." />
              </div>
              <div className="form-row">
                <div className="field-group">
                  <label>Sport principal</label>
                  <input value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })} placeholder="Ex: TENNIS" />
                </div>
                <div className="field-group">
                  <label>Ville</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ex: Casablanca" />
                </div>
              </div>
              <div className="form-row">
                <div className="field-group">
                  <label>Poste préféré</label>
                  <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="Ex: Buteur, Meneur..." />
                </div>
                <div className="field-group">
                  <label>Instagram</label>
                  <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} placeholder="@username" />
                </div>
              </div>
              <div className="form-row">
                <div className="field-group">
                  <label>Taille (cm)</label>
                  <input type="number" value={form.height || ''} onChange={(e) => setForm({ ...form, height: e.target.value ? parseInt(e.target.value) : null })} placeholder="Ex: 180" />
                </div>
                <div className="field-group">
                  <label>Poids (kg)</label>
                  <input type="number" value={form.weight || ''} onChange={(e) => setForm({ ...form, weight: e.target.value ? parseInt(e.target.value) : null })} placeholder="Ex: 75" />
                </div>
              </div>
              <div className="field-group">
                <label>Téléphone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+212 6..." />
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleSave}>Enregistrer</button>
                <button className="btn-ghost" onClick={() => setEditing(false)}>Annuler</button>
              </div>
            </div>
          ) : (
            <div className="profile-view-layout">
              <div className="profile-header-info">
                <h1 className="profile-name">{user?.full_name}</h1>
                <p className="profile-email">{user?.email}</p>
                {user?.bio ? (
                  <p className="profile-bio-text">"{user.bio}"</p>
                ) : (
                  <p className="profile-bio-empty">Aucune bio ajoutée.</p>
                )}
              </div>

              <div className="profile-stats-cards">
                <div className="stat-card glass">
                  <Star className="stat-icon elo-icon" size={24} />
                  <div className="stat-data">
                    <span className="stat-value">{user?.elo_rating}</span>
                    <span className="stat-label">Points Elo</span>
                  </div>
                </div>
                <div className="stat-card glass">
                  <Activity className="stat-icon match-icon" size={24} />
                  <div className="stat-data">
                    <span className="stat-value">{user?.average_rating ? `${user.average_rating}/5` : 'N/A'}</span>
                    <span className="stat-label">Note Moyenne</span>
                  </div>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="detail-item">
                  <Activity size={18} className="detail-icon" />
                  <div className="detail-text">
                    <span className="detail-label">Sport</span>
                    <span className="detail-value">{user?.sport || 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Target size={18} className="detail-icon" />
                  <div className="detail-text">
                    <span className="detail-label">Poste</span>
                    <span className="detail-value">{user?.position || 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Ruler size={18} className="detail-icon" />
                  <div className="detail-text">
                    <span className="detail-label">Taille</span>
                    <span className="detail-value">{user?.height ? `${user.height} cm` : 'Non renseignée'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Weight size={18} className="detail-icon" />
                  <div className="detail-text">
                    <span className="detail-label">Poids</span>
                    <span className="detail-value">{user?.weight ? `${user.weight} kg` : 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <MapPin size={18} className="detail-icon" />
                  <div className="detail-text">
                    <span className="detail-label">Ville</span>
                    <span className="detail-value">{user?.city || 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Camera size={18} className="detail-icon" />
                  <div className="detail-text">
                    <span className="detail-label">Instagram</span>
                    <span className="detail-value">{user?.instagram || 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Phone size={18} className="detail-icon" />
                  <div className="detail-text">
                    <span className="detail-label">Contact</span>
                    <span className="detail-value">{user?.phone || 'Non renseigné'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Shield size={18} className="detail-icon" />
                  <div className="detail-text">
                    <span className="detail-label">Membre depuis</span>
                    <span className="detail-value">{new Date(user?.date_joined || '').toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>

              {/* Photos Gallery */}
              {(user?.gallery_1 || user?.gallery_2) && (
                <div className="profile-gallery">
                  <h3 className="gallery-title">Photos</h3>
                  <div className="gallery-grid">
                    {user?.gallery_1 && <img src={user.gallery_1} alt="Gallery 1" className="gallery-img" />}
                    {user?.gallery_2 && <img src={user.gallery_2} alt="Gallery 2" className="gallery-img" />}
                  </div>
                </div>
              )}

              <div className="profile-footer-actions">
                <button className="btn-primary edit-btn" onClick={() => setEditing(true)}>
                  Modifier le profil
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
