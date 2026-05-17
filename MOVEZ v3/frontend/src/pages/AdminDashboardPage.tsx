import { useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { 
  Users, Map as MapIcon, Calendar, TrendingUp, Shield, 
  CheckCircle, Trash2, ShieldCheck, UserX, UserCheck
} from 'lucide-react';
import './AdminDashboard.css';

const mockUsers = [
  { id: 1, name: 'Karim Alaoui', email: 'karim@test.com', role: 'JOUEUR', status: 'ACTIVE', joined: '2023-11-12' },
  { id: 2, name: 'Sara Bennani', email: 'sara@test.com', role: 'ORGANISATEUR', status: 'ACTIVE', joined: '2023-12-05' },
  { id: 3, name: 'Youssef Rami', email: 'youssef@test.com', role: 'JOUEUR', status: 'BANNED', joined: '2024-01-20' },
  { id: 4, name: 'Admin Movez', email: 'admin@movez.ma', role: 'ADMIN', status: 'ACTIVE', joined: '2023-10-01' },
];

const mockTerrains = [
  { id: 101, name: 'Stade Mohammed V (Annexe)', city: 'Casablanca', sport: 'Football', status: 'APPROVED', owner: 'Sara Bennani' },
  { id: 102, name: 'Agadir Beach Volley', city: 'Agadir', sport: 'Volleyball', status: 'APPROVED', owner: 'Omar Tazi' },
  { id: 103, name: 'Nouveau Padel Pro', city: 'Rabat', sport: 'Padel', status: 'PENDING', owner: 'Mehdi Chraibi' },
];

const mockReservations = [
  { id: 501, terrain: 'Stade Mohammed V', user: 'Karim Alaoui', date: '2024-05-12', time: '18:00', status: 'CONFIRMED', price: 400 },
  { id: 502, terrain: 'Nouveau Padel Pro', user: 'Youssef Rami', date: '2024-05-13', time: '10:00', status: 'PENDING', price: 300 },
  { id: 503, terrain: 'Agadir Beach Volley', user: 'Sami Nouri', date: '2024-05-14', time: '14:00', status: 'CANCELLED', price: 150 },
];

export default function AdminDashboardPage() {
  const { user } = useAppSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'terrains' | 'reservations'>('overview');

  const [users, setUsers] = useState(mockUsers);
  const [terrains, setTerrains] = useState(mockTerrains);

  // Mock handlers
  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' } : u
    ));
  };

  const approveTerrain = (id: number) => {
    setTerrains(terrains.map(t => 
      t.id === id ? { ...t, status: 'APPROVED' } : t
    ));
  };

  const deleteTerrain = (id: number) => {
    setTerrains(terrains.filter(t => t.id !== id));
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="page-container admin-unauthorized">
        <ShieldCheck size={64} className="unauth-icon" />
        <h2>Accès Refusé</h2>
        <p>Vous devez être administrateur pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="page-container admin-dashboard-page">
      <div className="admin-header glass banner-glass">
        <div>
          <h1 className="admin-title"><Shield size={28}/> Super Admin Dashboard</h1>
          <p className="admin-subtitle">Gérez les utilisateurs, terrains, réservations et gardez le contrôle total de Movez.</p>
        </div>
      </div>

      <div className="admin-body">
        <aside className="admin-sidebar glass">
          <nav className="admin-nav">
            <button className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <TrendingUp size={20} /> Vue d'ensemble
            </button>
            <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
              <Users size={20} /> Utilisateurs
            </button>
            <button className={`admin-nav-item ${activeTab === 'terrains' ? 'active' : ''}`} onClick={() => setActiveTab('terrains')}>
              <MapIcon size={20} /> Terrains (Validation)
            </button>
            <button className={`admin-nav-item ${activeTab === 'reservations' ? 'active' : ''}`} onClick={() => setActiveTab('reservations')}>
              <Calendar size={20} /> Réservations globales
            </button>
          </nav>
        </aside>

        <main className="admin-content glass">
          {activeTab === 'overview' && (
            <div className="admin-section">
              <h2>Vue d'ensemble</h2>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="stat-icon u-icon"><Users size={24} /></div>
                  <div className="stat-info">
                    <span className="stat-value">{users.length}</span>
                    <span className="stat-label">Utilisateurs inscrits</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon t-icon"><MapIcon size={24} /></div>
                  <div className="stat-info">
                    <span className="stat-value">{terrains.length}</span>
                    <span className="stat-label">Terrains référencés</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon r-icon"><Calendar size={24} /></div>
                  <div className="stat-info">
                    <span className="stat-value">{mockReservations.length}</span>
                    <span className="stat-label">Réservations totales</span>
                  </div>
                </div>
                <div className="admin-stat-card">
                  <div className="stat-icon rev-icon"><TrendingUp size={24} /></div>
                  <div className="stat-info">
                    <span className="stat-value">850 MAD</span>
                    <span className="stat-label">Revenus générés</span>
                  </div>
                </div>
              </div>

              <h3>Récemment Inscrits</h3>
              <div className="admin-recent-list">
                {users.slice(0, 3).map(u => (
                  <div key={u.id} className="recent-item">
                    <div className="avatar-placeholder">{u.name[0]}</div>
                    <div className="recent-info">
                      <h4>{u.name}</h4>
                      <p>{u.email}</p>
                    </div>
                    <span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-section">
              <h2>Gestion des Utilisateurs</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Rôle</th>
                      <th>Statut</th>
                      <th>Date d'inscription</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`role-badge ${u.role.toLowerCase()}`}>{u.role}</span></td>
                        <td>
                          <span className={`status-badge ${u.status.toLowerCase()}`}>
                            {u.status === 'ACTIVE' ? 'Actif' : 'Banni'}
                          </span>
                        </td>
                        <td>{u.joined}</td>
                        <td>
                          {u.role !== 'ADMIN' && (
                            <button 
                              className={`btn-action ${u.status === 'ACTIVE' ? 'btn-ban' : 'btn-unban'}`}
                              onClick={() => toggleUserStatus(u.id)}
                              title={u.status === 'ACTIVE' ? "Bannir l'utilisateur" : "Réactiver l'utilisateur"}
                            >
                              {u.status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'terrains' && (
            <div className="admin-section">
              <h2>Validation des Terrains</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom du terrain</th>
                      <th>Ville</th>
                      <th>Sport</th>
                      <th>Partenaire</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {terrains.map(t => (
                      <tr key={t.id}>
                        <td>#{t.id}</td>
                        <td>{t.name}</td>
                        <td>{t.city}</td>
                        <td>{t.sport}</td>
                        <td>{t.owner}</td>
                        <td>
                          <span className={`status-badge ${t.status.toLowerCase()}`}>
                            {t.status === 'APPROVED' ? 'Approuvé' : 'En attente'}
                          </span>
                        </td>
                        <td className="actions-cell">
                          {t.status === 'PENDING' && (
                            <button className="btn-action btn-approve" onClick={() => approveTerrain(t.id)} title="Approuver">
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button className="btn-action btn-delete" onClick={() => deleteTerrain(t.id)} title="Supprimer">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="admin-section">
              <h2>Toutes les Réservations</h2>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Terrain</th>
                      <th>Joueur</th>
                      <th>Date</th>
                      <th>Heure</th>
                      <th>Prix</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockReservations.map(r => (
                      <tr key={r.id}>
                        <td>#{r.id}</td>
                        <td>{r.terrain}</td>
                        <td>{r.user}</td>
                        <td>{r.date}</td>
                        <td>{r.time}</td>
                        <td>{r.price} MAD</td>
                        <td>
                          <span className={`status-badge ${r.status.toLowerCase()}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}