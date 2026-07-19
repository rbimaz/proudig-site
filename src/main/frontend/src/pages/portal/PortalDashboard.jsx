import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const PortalDashboard = () => {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState({
    recentUploads: [],
    recentShares: [],
    storageUsed: 0,
    storageTotal: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [uploadsRes, sharesRes, storageRes] = await Promise.all([
          authFetch('/api/portal/uploads/recent'),
          authFetch('/api/portal/shares/recent'),
          authFetch('/api/portal/storage')
        ]);

        const uploads = uploadsRes.ok ? await uploadsRes.json() : [];
        const shares = sharesRes.ok ? await sharesRes.json() : [];
        const storage = storageRes.ok ? await storageRes.json() : { used: 0, total: 0 };

        setStats({
          recentUploads: uploads.slice(0, 5),
          recentShares: shares.slice(0, 5),
          storageUsed: storage.used || 0,
          storageTotal: storage.total || 0
        });
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authFetch]);

  if (loading) return <div className="loading"><i className="bi bi-arrow-repeat spin"></i> Laden...</div>;

  const storagePercent = stats.storageTotal > 0 ? (stats.storageUsed / stats.storageTotal) * 100 : 0;
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="portal-dashboard">
      <div className="dashboard-header">
        <h1><i className="bi bi-grid-1x2-fill"></i> Dashboard</h1>
        <p>Willkommen im ProuDig Portal</p>
      </div>

      <div className="dashboard-grid">
        <div className="storage-card">
          <h3><i className="bi bi-hdd-fill"></i> Speicher</h3>
          <div className="storage-bar">
            <div className="storage-used" style={{ width: `${storagePercent}%` }}></div>
          </div>
          <p className="storage-text">
            {formatBytes(stats.storageUsed)} / {formatBytes(stats.storageTotal)} verwendet
          </p>
        </div>

        <div className="quick-actions">
          <h3><i className="bi bi-lightning-fill"></i> Schnellaktionen</h3>
          <div className="action-buttons">
            <button className="btn-action" onClick={() => window.location.href = '/admin/portal/documents'}>
              <i className="bi bi-cloud-arrow-up"></i> Neue Datei hochladen
            </button>
            <button className="btn-action" onClick={() => window.location.href = '/admin/portal/documents'}>
              <i className="bi bi-folder-plus"></i> Neuer Ordner
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <section className="recent-section">
          <h2><i className="bi bi-clock-history"></i> Zuletzt hochgeladen</h2>
          {stats.recentUploads.length === 0 ? (
            <p className="no-data">Keine Dateien vorhanden</p>
          ) : (
            <ul className="file-list">
              {stats.recentUploads.map(file => (
                <li key={file.id}>
                  <span className="file-icon"><i className="bi bi-file-earmark-fill"></i></span>
                  <span className="file-name">{file.name}</span>
                  <span className="file-date">{new Date(file.createdAt).toLocaleDateString('de-DE')}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="shares-section">
          <h2><i className="bi bi-share-fill"></i> Zuletzt geteilt</h2>
          {stats.recentShares.length === 0 ? (
            <p className="no-data">Keine freigegebenen Dateien</p>
          ) : (
            <ul className="file-list">
              {stats.recentShares.map(share => (
                <li key={share.id}>
                  <span className="file-icon"><i className="bi bi-link-45deg"></i></span>
                  <span className="file-name">{share.documentName}</span>
                  <span className="file-date">Mit {share.sharedWith}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
