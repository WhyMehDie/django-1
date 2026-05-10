import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Navigation, Info, Star } from 'lucide-react';
import './MapPage.css';

declare global {
  interface Window {
    L: any;
  }
}

const mockTerrains = [
  { id: 1, name: 'Stade Mohammed V (Annexe)', sport: 'Football', city: 'Casablanca', rating: 4.8, price: '400 DH / h', lat: 33.5828, lng: -7.6433, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Football' },
  { id: 2, name: 'Foot Five Oasis', sport: 'Football', city: 'Casablanca', rating: 4.6, price: '350 DH / h', lat: 33.5650, lng: -7.6350, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Football' },
  { id: 3, name: 'Tanger City Football', sport: 'Football', city: 'Tanger', rating: 4.5, price: '300 DH / h', lat: 35.7595, lng: -5.8340, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Football' },
  { id: 4, name: 'Agadir Beach Volley Club', sport: 'Volleyball', city: 'Agadir', rating: 4.9, price: '150 DH / h', lat: 30.4214, lng: -9.6050, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Volleyball' },
  { id: 5, name: 'Rabat Volley Arena', sport: 'Volleyball', city: 'Rabat', rating: 4.3, price: '200 DH / h', lat: 33.9916, lng: -6.8498, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Volleyball' },
  { id: 6, name: 'Tennis Club de Fès', sport: 'Tennis', city: 'Fès', rating: 4.5, price: '200 DH / h', lat: 34.0331, lng: -5.0003, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Tennis' },
  { id: 7, name: 'Casablanca Tennis Pro', sport: 'Tennis', city: 'Casablanca', rating: 4.7, price: '250 DH / h', lat: 33.5900, lng: -7.6200, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Tennis' },
  { id: 8, name: 'Marrakech Padel Arena', sport: 'Padel', city: 'Marrakech', rating: 4.7, price: '300 DH / h', lat: 31.6295, lng: -8.0245, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Padel' },
  { id: 9, name: 'Oasis Padel Club', sport: 'Padel', city: 'Casablanca', rating: 4.8, price: '350 DH / h', lat: 33.5550, lng: -7.6450, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Padel' },
  { id: 10, name: 'Rabat Streetball Court', sport: 'Basketball', city: 'Rabat', rating: 4.2, price: 'Gratuit', lat: 33.9716, lng: -6.8498, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Basketball' },
  { id: 11, name: 'Marrakech Hoops', sport: 'Basketball', city: 'Marrakech', rating: 4.4, price: '150 DH / h', lat: 31.6395, lng: -8.0145, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Basketball' },
  { id: 12, name: 'Taghazout Surf Spot', sport: 'Surf', city: 'Taghazout', rating: 5.0, price: 'Gratuit', lat: 30.5451, lng: -9.7093, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Surf' },
  { id: 13, name: 'Essaouira Surf Camp', sport: 'Surf', city: 'Essaouira', rating: 4.9, price: 'Gratuit', lat: 31.5125, lng: -9.7700, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Surf' },
  { id: 14, name: 'Tanger City Gym', sport: 'Gymnastics', city: 'Tanger', rating: 4.6, price: '250 DH / mois', lat: 35.7695, lng: -5.8240, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Gymnastics' },
  { id: 15, name: 'Casa Gym Club', sport: 'Gymnastics', city: 'Casablanca', rating: 4.5, price: '300 DH / mois', lat: 33.5728, lng: -7.6333, image: 'https://placehold.co/400x300/1e293b/ffffff?text=Terrain+Gymnastics' },
];

export default function MapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('Tous');
  const [activeTerrain, setActiveTerrain] = useState<any>(null);
  
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const navigate = useNavigate();

  const handleDirections = () => {
    if (activeTerrain) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${activeTerrain.lat},${activeTerrain.lng}`, '_blank');
    }
  };

  const handleReservation = () => {
    // Navigate to reservations page, potentially passing the sport or terrain info in state/query
    navigate('/reservations', { state: { selectedTerrain: activeTerrain } });
  };

  const filteredTerrains = mockTerrains.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport === 'Tous' || t.sport === selectedSport;
    return matchesSearch && matchesSport;
  });

  const uniqueSports = ['Tous', ...Array.from(new Set(mockTerrains.map(t => t.sport)))];

  useEffect(() => {
    // Inject Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Inject Leaflet JS
    if (!document.getElementById('leaflet-js')) {
      const script = document.createElement('script');
      script.id = 'leaflet-js';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else if (window.L) {
      initMap();
    }

    function initMap() {
      if (mapRef.current || !window.L || !mapContainerRef.current) return;
      
      const map = window.L.map(mapContainerRef.current).setView([31.7917, -7.0926], 6); // Center of Morocco
      mapRef.current = map;

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      updateMarkers();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (window.L && mapRef.current) {
      updateMarkers();
    }
  }, [filteredTerrains]);

  useEffect(() => {
    if (activeTerrain && mapRef.current && window.L) {
      mapRef.current.setView([activeTerrain.lat, activeTerrain.lng], 14, { animate: true });
    }
  }, [activeTerrain]);

  const updateMarkers = () => {
    if (!mapRef.current || !window.L) return;

    // Clear existing markers
    markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
    markersRef.current = [];

    // Add new markers
    filteredTerrains.forEach(t => {
      const customIcon = window.L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="marker-pin"><div class="marker-img" style="background-image: url('${t.image}')"></div></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      });

      const marker = window.L.marker([t.lat, t.lng], { icon: customIcon }).addTo(mapRef.current);
      
      marker.bindPopup(`
        <div style="text-align: center;">
          <b>${t.name}</b><br/>
          ${t.city} - ${t.sport}<br/>
          <i>${t.price}</i>
        </div>
      `);

      marker.on('click', () => {
        setActiveTerrain(t);
      });

      markersRef.current.push(marker);
    });
  };

  return (
    <div className="page-container page-map">
      <div className="map-header banner-glass">
        <div className="mh-hero">
          <h1 className="mh-title">Carte des Terrains</h1>
          <p className="mh-subtitle">Trouvez les meilleurs spots pour pratiquer votre sport partout au Maroc.</p>
        </div>
      </div>

      <div className="map-body">
        <aside className="map-sidebar glass">
          <div className="sidebar-filters">
            <div className="search-box">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Chercher une ville ou un terrain..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="sport-filters">
              {uniqueSports.map(sport => (
                <button 
                  key={sport} 
                  className={`sport-chip ${selectedSport === sport ? 'active' : ''}`}
                  onClick={() => setSelectedSport(sport)}
                >
                  {sport}
                </button>
              ))}
            </div>
          </div>

          <div className="terrains-list">
            {filteredTerrains.length === 0 ? (
              <p className="no-results">Aucun terrain trouvé.</p>
            ) : (
              filteredTerrains.map(t => (
                <div 
                  key={t.id} 
                  className={`terrain-card ${activeTerrain?.id === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTerrain(t)}
                >
                  <div className="terrain-img-mini" style={{ backgroundImage: `url(${t.image})` }}></div>
                  <div className="terrain-info">
                    <h4>{t.name}</h4>
                    <p className="terrain-meta"><MapPin size={12} /> {t.city} &bull; {t.sport}</p>
                    <div className="terrain-rating">
                      <Star size={12} className="star-icon" fill="currentColor"/> {t.rating} <span className="price-tag">{t.price}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="map-content glass">
          {activeTerrain && (
            <div className="active-terrain-overlay">
              <h3>{activeTerrain.name}</h3>
              <p><MapPin size={14}/> {activeTerrain.city} | {activeTerrain.sport}</p>
              <div className="ato-actions">
                <button className="btn-primary" onClick={handleDirections}><Navigation size={14}/> S'y rendre</button>
                <button className="btn-secondary" onClick={handleReservation}><Info size={14}/> Détails & Réservation</button>
              </div>
            </div>
          )}
          
          <div className="map-iframe-container">
             <div 
                ref={mapContainerRef} 
                className="osm-iframe" 
                id="map" 
                style={{ width: '100%', height: '100%', borderRadius: '16px', zIndex: 1 }}
             ></div>
          </div>
        </main>
      </div>
    </div>
  );
}