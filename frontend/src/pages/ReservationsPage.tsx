import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchTerrains, fetchMyReservations, cancelReservation } from '../features/reservations/reservationsSlice';
import './Reservations.css';

export default function ReservationsPage() {
  const dispatch = useAppDispatch();
  const { terrains, reservations, loading } = useAppSelector((s) => s.reservations);
  const [tab, setTab] = useState<'terrains' | 'my'>('terrains');
  const [sportFilter, setSportFilter] = useState('');

  useEffect(() => {
    dispatch(fetchTerrains());
    dispatch(fetchMyReservations());
  }, [dispatch]);

  const handleFilter = () => {
    const params: Record<string, string> = {};
    if (sportFilter) params.sport = sportFilter;
    dispatch(fetchTerrains(params));
  };

  const STATUS_LABEL: Record<string, string> = {
    PENDING: 'En attente', CONFIRMED: 'Confirmé',
    CANCELLED: 'Annulé', COMPLETED: 'Terminé',
  };
  const STATUS_COLOR: Record<string, string> = {
    PENDING: '#f59e0b', CONFIRMED: '#10b981',
    CANCELLED: '#ef4444', COMPLETED: '#6b7280',
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Réservations & Coaching</h1>

      <div className="tab-bar">
        <button className={tab === 'terrains' ? 'tab active' : 'tab'} onClick={() => setTab('terrains')}>
          Terrains disponibles
        </button>
        <button className={tab === 'my' ? 'tab active' : 'tab'} onClick={() => setTab('my')}>
          Mes réservations
        </button>
      </div>

      {tab === 'terrains' && (
        <div>
          <div className="search-bar">
            <select id="res-sport" value={sportFilter} onChange={(e) => setSportFilter(e.target.value)}>
              <option value="">Tous les sports</option>
              {['FOOTBALL', 'BASKETBALL', 'TENNIS', 'PADEL', 'VOLLEYBALL'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button className="btn-primary" onClick={handleFilter}>Filtrer</button>
          </div>
          {loading ? <div className="loading-spinner">Chargement...</div> : (
            <div className="terrains-grid">
              {terrains.map((t) => (
                <div key={t.id} className="terrain-card">
                  <div 
                    className="terrain-image"
                    style={t.image ? { backgroundImage: `url(${t.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                  >
                    {!t.image && 'Terrain'}
                  </div>
                  <div className="terrain-body">
                    <h3>{t.name}</h3>
                    <div className="terrain-sport">{t.sport}</div>
                    <div className="terrain-address">{t.address}, {t.city}</div>
                    <div className="terrain-price">{t.price_per_hour} MAD/h</div>
                    <div className="terrain-capacity">{t.capacity} joueurs max</div>
                    {t.description && <p className="terrain-desc">{t.description}</p>}
                    <button className="btn-primary" style={{ marginTop: '12px' }}>
                      Réserver
                    </button>
                  </div>
                </div>
              ))}
              {terrains.length === 0 && <p className="empty-state">Aucun terrain disponible</p>}
            </div>
          )}
        </div>
      )}

      {tab === 'my' && (
        <div className="my-reservations">
          {reservations.length === 0 ? (
            <p className="empty-state">Vous n'avez aucune réservation.</p>
          ) : (
            reservations.map((r) => (
              <div key={r.id} className="reservation-row">
                <div className="res-type">{r.reservation_type === 'TERRAIN' ? 'Terrain' : 'Coaching'} {r.reservation_type}</div>
                <div className="res-info">
                  <strong>{r.date}</strong> — {r.start_time} à {r.end_time}
                </div>
                <div className="res-price">{r.total_price} MAD</div>
                <span className="res-status" style={{ color: STATUS_COLOR[r.status] }}>
                  {STATUS_LABEL[r.status]}
                </span>
                {r.status === 'PENDING' && (
                  <button className="btn-danger" onClick={() => dispatch(cancelReservation(r.id))}>
                    Annuler
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
