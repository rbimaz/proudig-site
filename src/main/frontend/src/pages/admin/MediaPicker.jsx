import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const MediaPicker = ({ value, onChange }) => {
  const { authFetch } = useAuth();
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const openPicker = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const res = await authFetch('/api/admin/media');
      if (res.ok) setMedia(await res.json());
    } catch (err) {
      console.error('Fehler beim Laden der Mediathek:', err);
    } finally {
      setLoading(false);
    }
  };

  const pick = (id) => {
    onChange(id);
    setOpen(false);
  };

  const images = media.filter(m => m.contentType?.startsWith('image/'));

  return (
    <div className="media-picker">
      {value ? (
        <div className="media-picker-current">
          <img src={`/api/media/${value}`} alt="Titelbild" />
          <div className="media-picker-actions">
            <button type="button" className="btn-sm" onClick={openPicker}>Ändern</button>
            <button type="button" className="btn-sm danger" onClick={() => onChange('')}>Entfernen</button>
          </div>
        </div>
      ) : (
        <button type="button" className="btn-secondary" onClick={openPicker}>
          Aus Mediathek wählen
        </button>
      )}

      {open && (
        <div className="media-picker-modal" onClick={() => setOpen(false)}>
          <div className="media-picker-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="media-picker-header">
              <h3>Titelbild wählen</h3>
              <button type="button" className="btn-sm" onClick={() => setOpen(false)}>✕</button>
            </div>
            {loading ? (
              <div className="loading">Laden...</div>
            ) : images.length === 0 ? (
              <div className="no-media">Keine Bilder in der Mediathek</div>
            ) : (
              <div className="media-picker-grid">
                {images.map(m => (
                  <button
                    type="button"
                    key={m.id}
                    className={`media-picker-tile ${value === m.id ? 'selected' : ''}`}
                    onClick={() => pick(m.id)}
                  >
                    <img src={`/api/media/${m.id}`} alt={m.name} />
                    <span>{m.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
