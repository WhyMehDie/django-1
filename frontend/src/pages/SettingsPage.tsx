import React from 'react';
import './SettingsPage.css';

export default function SettingsPage() {
  return (
    <div className="settings-page page-container">
      <div className="settings-header glass">
        <h1>Paramètres</h1>
        <p>Gérez vos préférences et options du site ici.</p>
      </div>
      <div className="settings-content glass">
        <div className="settings-section">
          <h2>Thème</h2>
          <div className="setting-item">
            <label>Mode Sombre</label>
            <input type="checkbox" checked readOnly />
          </div>
        </div>
        <div className="settings-section">
          <h2>Notifications</h2>
          <div className="setting-item">
            <label>Recevoir des emails</label>
            <input type="checkbox" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}
