import { useEffect, useState } from 'react';
import { useAppSelector } from '../app/hooks';
import { Trophy, Settings, Users, LayoutList, Plus, Search, Edit3, Save, CheckCircle, ArrowLeft, Calendar, UserPlus } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import './Organizer.css';

export default function OrganizerDashboardPage() {
  const { user } = useAppSelector((s) => s.auth);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Tournament Management State
  const [activeTournament, setActiveTournament] = useState<any>(null);
  const [bracketView, setBracketView] = useState(false);

  // Load Organizer's Tournaments
  useEffect(() => {
    const fetchMyTournaments = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/competitions/tournaments/');
        const myTournaments = response.data.results.filter((t: any) => t.organizer === user?.id);
        
        // Mock some data if empty so the UI doesn't look barren for testing
        if (myTournaments.length === 0) {
            setTournaments([
                { id: 1, name: 'MOVEZ Summer Wave', sport: 'Surf', status: 'IN_PROGRESS', participants_count: 16, max_participants: 32 },
                { id: 2, name: 'Liga Movez Pro', sport: 'Football', status: 'OPEN', participants_count: 8, max_participants: 16 },
            ]);
        } else {
            setTournaments(myTournaments);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchMyTournaments();
  }, [user]);

  if (user?.role !== 'ORGANISATEUR') {
     return <div className="page-container" style={{ textAlign: 'center', marginTop: '100px' }}><h2>Accès refusé. Réservé aux Organisateurs.</h2></div>;
  }

  const handleManageTournament = (t: any) => {
      setActiveTournament(t);
      setActiveTab('manage');
  };

  return (
    <div className="page-container page-organizer">
      <div className="orga-header banner-glass">
         <div className="oh-hero">
            <h1 className="oh-title">Tableau de bord Organisateur</h1>
            <p className="oh-subtitle">Gérez vos tournois, vos joueurs, les classements et les résultats en temps réel.</p>
         </div>
      </div>

      <div className="orga-body">
         <aside className="orga-sidebar glass">
            <nav className="orga-nav">
               <button className={`orga-nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => {setActiveTab('overview'); setActiveTournament(null); }}>
                  <LayoutList size={20} /> Vue d'ensemble
               </button>
               <button className={`orga-nav-item ${activeTab === 'tournaments' || activeTab === 'manage' ? 'active' : ''}`} onClick={() => { setActiveTab('tournaments'); setActiveTournament(null); }}>
                  <Trophy size={20} /> Mes Tournois
               </button>
               <button className={`orga-nav-item ${activeTab === 'classement' ? 'active' : ''}`} onClick={() => { setActiveTab('classement'); setActiveTournament(null); }}>
                  <Users size={20} /> Joueurs & Classements
               </button>
               <button className={`orga-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => { setActiveTab('settings'); setActiveTournament(null); }}>
                  <Settings size={20} /> Paramètres
               </button>
            </nav>
         </aside>

         <main className="orga-content">
            {activeTab === 'overview' && (
              <div className="tab-pane">
                 <div className="stats-grid">
                    <div className="stat-card glass">
                       <span className="stat-value">{tournaments.length}</span>
                       <span className="stat-label">Tournois créés</span>
                    </div>
                    <div className="stat-card glass">
                       <span className="stat-value">
                         {tournaments.reduce((acc, t: any) => acc + (t.participants_count || 0), 0)}
                       </span>
                       <span className="stat-label">Participants Inscrits</span>
                    </div>
                    <div className="stat-card glass">
                       <span className="stat-value">
                         {tournaments.filter((t:any) => t.status === 'IN_PROGRESS').length}
                       </span>
                       <span className="stat-label">En cours</span>
                    </div>
                 </div>

                 <div className="quick-actions">
                    <h3>Actions rapides</h3>
                    <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                        <button className="btn-primary"><Plus size={18}/> Créer un tournoi</button>
                        <button className="btn-secondary"><UserPlus size={18}/> Inviter Organisateur</button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'tournaments' && (
              <div className="tab-pane">
                 <div className="pane-header">
                    <h2>Mes Tournois</h2>
                    <div className="pane-actions">
                       <div className="search-box">
                         <Search size={16} />
                         <input type="text" placeholder="Rechercher..." />
                       </div>
                    </div>
                 </div>

                 {loading ? <p>Chargement...</p> : (
                   <div className="orga-table-container glass">
                     <table className="orga-table">
                        <thead>
                           <tr>
                              <th>Nom</th>
                              <th>Sport</th>
                              <th>Statut</th>
                              <th>Joueurs</th>
                              <th>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                           {tournaments.map((t: any) => (
                             <tr key={t.id}>
                                <td><strong>{t.name}</strong></td>
                                <td>{t.sport}</td>
                                <td><span className={`status-badge st-${t.status.toLowerCase()}`}>{t.status}</span></td>
                                <td>{t.participants_count} / {t.max_participants}</td>
                                <td>
                                   <div className="table-actions">
                                      <button className="btn-icon-tiny" title="Gérer" onClick={() => handleManageTournament(t)}>
                                          <Settings size={16}/> Gérer
                                      </button>
                                   </div>
                                </td>
                             </tr>
                           ))}
                           {tournaments.length === 0 && (
                             <tr><td colSpan={5} style={{textAlign:'center', padding: '30px'}}>Aucun tournoi trouvé.</td></tr>
                           )}
                        </tbody>
                     </table>
                   </div>
                 )}
              </div>
            )}

            {activeTab === 'manage' && activeTournament && (
               <div className="tab-pane">
                  <button className="btn-secondary" style={{marginBottom: '20px', display: 'flex', gap: '8px', alignItems:'center'}} onClick={() => setActiveTab('tournaments')}>
                      <ArrowLeft size={16} /> Retour à Mes Tournois
                  </button>
                  <div className="pane-header">
                     <h2>Gestion: {activeTournament.name}</h2>
                  </div>
                  
                  <div className="tournament-manage-grid">
                      <div className="tm-card glass">
                          <h3>Détails</h3>
                          <p><strong>Sport :</strong> {activeTournament.sport}</p>
                          <p><strong>Places :</strong> {activeTournament.participants_count} / {activeTournament.max_participants}</p>
                          <p><strong>Status :</strong> {activeTournament.status}</p>
                          <button className="btn-secondary" style={{marginTop: '10px'}}><Edit3 size={16}/> Éditer Infos</button>
                      </div>

                      <div className="tm-card glass">
                          <h3>Arbre et Résultats</h3>
                          <p>Gérez les matchs, les poules et rentrez les scores en temps réel.</p>
                          <button className="btn-primary" style={{marginTop: '10px'}} onClick={() => setBracketView(!bracketView)}>
                              <Trophy size={16}/> {bracketView ? 'Fermer l\'Arbre' : 'Gérer l\'Arbre (Bracket)'}
                          </button>
                      </div>
                  </div>

                  {bracketView && (
                      <div className="bracket-manage-view glass" style={{ marginTop: '30px', padding: '20px', borderRadius: '10px' }}>
                          <h3>Scores du Tour {activeTournament.participants_count >= 8 ? 'Quarts de Finale' : 'Demi-finales'}</h3>
                          <div className="match-list" style={{display:'flex', flexDirection:'column', gap:'15px', marginTop:'20px'}}>
                              <div className="match-edit-row" style={{display:'flex', alignItems:'center', gap:'15px', background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'8px'}}>
                                  <input type="text" defaultValue="Ilyas (1200 Elo)" style={{flex: 1, padding:'8px', borderRadius:'5px', border:'none', background:'rgba(255,255,255,0.1)', color:'white'}}/>
                                  <span>VS</span>
                                  <input type="text" defaultValue="Sara (1180 Elo)" style={{flex: 1, padding:'8px', borderRadius:'5px', border:'none', background:'rgba(255,255,255,0.1)', color:'white'}}/>
                                  <input type="number" placeholder="Score 1" style={{width:'80px', padding:'8px', borderRadius:'5px', border:'none'}}/>
                                  <span>-</span>
                                  <input type="number" placeholder="Score 2" style={{width:'80px', padding:'8px', borderRadius:'5px', border:'none'}}/>
                                  <button className="btn-primary" style={{padding: '8px', minWidth: '40px'}}><CheckCircle size={16}/></button>
                              </div>
                              <div className="match-edit-row" style={{display:'flex', alignItems:'center', gap:'15px', background:'rgba(255,255,255,0.05)', padding:'15px', borderRadius:'8px'}}>
                                  <input type="text" defaultValue="Mehdi (1300 Elo)" style={{flex: 1, padding:'8px', borderRadius:'5px', border:'none', background:'rgba(255,255,255,0.1)', color:'white'}}/>
                                  <span>VS</span>
                                  <input type="text" defaultValue="Youssef (1000 Elo)" style={{flex: 1, padding:'8px', borderRadius:'5px', border:'none', background:'rgba(255,255,255,0.1)', color:'white'}}/>
                                  <input type="number" placeholder="Score 1" style={{width:'80px', padding:'8px', borderRadius:'5px', border:'none'}}/>
                                  <span>-</span>
                                  <input type="number" placeholder="Score 2" style={{width:'80px', padding:'8px', borderRadius:'5px', border:'none'}}/>
                                  <button className="btn-primary" style={{padding: '8px', minWidth: '40px'}}><CheckCircle size={16}/></button>
                              </div>
                          </div>
                      </div>
                  )}
               </div>
            )}

            {activeTab === 'classement' && (
               <div className="tab-pane">
                  <div className="pane-header">
                     <h2>Classement Global & Joueurs</h2>
                     <p style={{color:'var(--text-muted)'}}>Recherchez un joueur pour modifier ses statistiques et son Elo manuellement.</p>
                  </div>
                  
                  <div className="search-box" style={{marginBottom: '20px', width: '100%', maxWidth: '400px'}}>
                         <Search size={16} />
                         <input type="text" placeholder="Rechercher par nom, email..." style={{width: '100%'}}/>
                  </div>

                  <div className="orga-table-container glass">
                     <table className="orga-table">
                        <thead>
                           <tr>
                              <th>Joueur</th>
                              <th>Sport Principal</th>
                              <th>Elo Actuel</th>
                              <th>Matchs Joués</th>
                              <th>Victoires</th>
                              <th>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Ilyas</strong></td>
                                <td>Football</td>
                                <td>1500</td>
                                <td>24</td>
                                <td>18</td>
                                <td><button className="btn-icon-tiny"><Edit3 size={16}/></button></td>
                            </tr>
                            <tr>
                                <td><strong>Sara</strong></td>
                                <td>Tennis</td>
                                <td>1350</td>
                                <td>10</td>
                                <td>7</td>
                                <td><button className="btn-icon-tiny"><Edit3 size={16}/></button></td>
                            </tr>
                            <tr>
                                <td><strong>Mehdi</strong></td>
                                <td>Surf</td>
                                <td>1800</td>
                                <td>42</td>
                                <td>38</td>
                                <td><button className="btn-icon-tiny"><Edit3 size={16}/></button></td>
                            </tr>
                        </tbody>
                     </table>
                   </div>
               </div>
            )}

            {activeTab === 'settings' && (
               <div className="tab-pane">
                  <h2>Paramètres d'Organisation</h2>
                  <div className="mock-area glass" style={{ textAlign: 'left', padding: '30px' }}>
                     <p><strong>Clé d'API d'intégration :</strong> <code>sk_orga_**********</code></p>
                     <p style={{marginTop:'15px'}}><strong>Notifications :</strong> Activées</p>
                     <button className="btn-primary" style={{marginTop: '20px'}}>Regénérer la clé API</button>
                  </div>
               </div>
            )}
         </main>
      </div>
    </div>
  );
}