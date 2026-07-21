import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const MediaLibrary = () => {
  const { authFetch } = useAuth();
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMedia();
  }, [authFetch]);

  const fetchMedia = async () => {
    try {
      const res = await authFetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage('');

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await authFetch('/api/admin/media', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const newMedia = await res.json();
          setMedia(prev => [newMedia, ...prev]);
        }
      } catch (err) {
        setMessage('Fehler beim Hochladen: ' + err.message);
      }
    }

    setUploading(false);
    setMessage('Upload abgeschlossen');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (!confirm('Datei wirklich löschen?')) return;

    try {
      const res = await authFetch(`/api/admin/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMedia(media.filter(m => m.id !== id));
        setMessage('Gelöscht');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Fehler beim Löschen');
    }
  };

  const handleRename = async (item) => {
    const name = window.prompt('Neuer Name', item.name);
    if (!name || name.trim() === '' || name === item.name) return;
    try {
      const res = await authFetch(`/api/admin/media/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() })
      });
      if (res.ok) {
        const updated = await res.json();
        setMedia(media.map(m => (m.id === item.id ? updated : m)));
        setMessage('Umbenannt');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Fehler beim Umbenennen');
      }
    } catch (err) {
      setMessage('Fehler beim Umbenennen');
    }
  };

  const copyUrl = (id) => {
    navigator.clipboard.writeText(`/api/media/${id}`);
    setMessage('URL kopiert');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="media-library">
      <div className="library-header">
        <h1>Mediathek</h1>
        <p className="subtitle">{media.length} Dateien</p>
      </div>

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">📤</div>
          <h2>Dateien hierher ziehen</h2>
          <p>oder</p>
          <label className="upload-button">
            Durchsuchen
            <input
              type="file"
              multiple
              onChange={(e) => handleUpload(e.target.files)}
              disabled={uploading}
              style={{ display: 'none' }}
              accept="image/*,.pdf,.doc,.docx"
            />
          </label>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Fehler') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {uploading && <div className="loading">Wird hochgeladen...</div>}

      <div className="media-grid">
        {media.length === 0 ? (
          <div className="no-media">Keine Dateien vorhanden</div>
        ) : (
          media.map(item => (
            <div key={item.id} className="media-item">
              <div className="media-preview">
                {item.contentType?.startsWith('image/') ? (
                  <img src={`/api/media/${item.id}`} alt={item.name} />
                ) : (
                  <div className="file-icon">{item.name?.split('.').pop() || 'Datei'}</div>
                )}
              </div>
              <div className="media-info">
                <p className="filename">{item.name}</p>
                <div className="media-actions">
                  <button className="btn-sm" onClick={() => handleRename(item)} title="Umbenennen">
                    Umbenennen
                  </button>
                  <button className="btn-sm" onClick={() => copyUrl(item.id)} title="URL kopieren">
                    URL
                  </button>
                  <button className="btn-sm danger" onClick={() => handleDelete(item.id)}>
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
