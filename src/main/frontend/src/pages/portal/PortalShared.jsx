import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const PortalShared = () => {
  const { authFetch } = useAuth();
  const [sharedDocs, setSharedDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSharedDocs();
  }, [authFetch]);

  const fetchSharedDocs = async () => {
    try {
      const res = await authFetch('/api/portal/documents/shared');
      if (res.ok) {
        const data = await res.json();
        setSharedDocs(data);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (docId, filename) => {
    try {
      const res = await authFetch(`/api/portal/documents/${docId}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Fehler beim Download:', err);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="portal-shared">
      <div className="shared-header">
        <h1>Geteilt mit mir</h1>
        <p className="subtitle">{sharedDocs.length} Dateien</p>
      </div>

      {sharedDocs.length === 0 ? (
        <div className="no-shared">
          Keine Dateien wurden mit Ihnen geteilt
        </div>
      ) : (
        <div className="shared-list">
          {sharedDocs.map(doc => (
            <div key={doc.id} className="shared-item">
              <div className="item-info">
                <div className="item-icon">📄</div>
                <div className="item-details">
                  <h3>{doc.filename}</h3>
                  <p className="shared-by">Geteilt von: {doc.sharedByName}</p>
                  <p className="shared-date">
                    Geteilt am: {new Date(doc.sharedAt).toLocaleDateString('de-DE')}
                  </p>
                </div>
              </div>
              <button
                className="btn-primary"
                onClick={() => handleDownload(doc.id, doc.filename)}
              >
                ⬇ Herunterladen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
