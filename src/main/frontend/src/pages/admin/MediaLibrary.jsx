import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/api';

const formatSize = (bytes) => {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1).replace('.', ',')} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
};

const isImage = (item) => item?.contentType?.startsWith('image/');

const typeLabel = (item) => {
  if (!item) return '';
  const ext = item.name?.includes('.') ? item.name.split('.').pop() : null;
  if (ext) return ext.toUpperCase();
  return (item.contentType?.split('/').pop() || 'Datei').toUpperCase();
};

export const MediaLibrary = () => {
  const { authFetch } = useAuth();
  const fileInputRef = useRef(null);

  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [dims, setDims] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('neueste');
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    fetchMedia();
  }, [authFetch]);

  const fetchMedia = async () => {
    try {
      const res = await authFetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data);
        setSelectedId(prev => prev || data[0]?.id || null);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const selected = media.find(m => m.id === selectedId) || null;

  // Abmessungen sind nicht im DTO – für Bilder clientseitig ermitteln
  useEffect(() => {
    setDims(null);
    setRenaming(false);
    if (!selected || !isImage(selected)) return;
    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = `/api/media/${selected.id}`;
  }, [selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let firstId = null;
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await authFetch('/api/admin/media', { method: 'POST', body: formData });
        if (res.ok) {
          const newMedia = await res.json();
          firstId = firstId || newMedia.id;
          setMedia(prev => [newMedia, ...prev]);
        }
      } catch (err) {
        showToast('Fehler beim Hochladen');
      }
    }
    setUploading(false);
    if (firstId) setSelectedId(firstId);
    showToast('Upload abgeschlossen');
  };

  const handleDelete = async (item) => {
    if (!confirm(`„${item.name}" wirklich löschen?`)) return;
    try {
      const res = await authFetch(`/api/admin/media/${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        const rest = media.filter(m => m.id !== item.id);
        setMedia(rest);
        if (selectedId === item.id) setSelectedId(rest[0]?.id || null);
        showToast('Gelöscht');
      } else {
        showToast('Fehler beim Löschen');
      }
    } catch (err) {
      showToast('Fehler beim Löschen');
    }
  };

  const startRename = () => {
    setRenameValue(selected.name);
    setRenaming(true);
  };

  const saveRename = async () => {
    const name = renameValue.trim();
    if (!name || name === selected.name) { setRenaming(false); return; }
    try {
      const res = await authFetch(`/api/admin/media/${selected.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const updated = await res.json();
        setMedia(media.map(m => (m.id === updated.id ? updated : m)));
        showToast('Umbenannt');
      } else {
        showToast('Fehler beim Umbenennen');
      }
    } catch (err) {
      showToast('Fehler beim Umbenennen');
    }
    setRenaming(false);
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(`/api/media/${selected.id}`);
    showToast('URL kopiert');
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const totalSize = media.reduce((sum, m) => sum + (m.fileSize || 0), 0);

  const visibleMedia = media
    .filter(m => (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return sortBy === 'aelteste' ? da - db : db - da;
    });

  if (loading) return <div className="loading">Laden...</div>;

  const isEmpty = media.length === 0;

  return (
    <div className="media-library">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        accept="image/*,.pdf,.doc,.docx"
        onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }}
      />

      <div className="media-head">
        <div>
          <h1>Mediathek</h1>
          <p className="media-count">{media.length} Dateien · {formatSize(totalSize)} gesamt</p>
        </div>
        <button className="media-upload-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          <span className="plus">+</span> {uploading ? 'Lädt…' : 'Datei hochladen'}
        </button>
      </div>

      <div className={`media-layout ${isEmpty ? 'empty' : ''}`}>
        <div className="media-gallery">
          {!isEmpty && (
            <div className="media-toolbar">
              <div className="media-search">
                <svg viewBox="0 0 24 24" className="mt-icn"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>
                <input
                  type="text"
                  placeholder="Suchen…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="media-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="neueste">Neueste</option>
                <option value="aelteste">Älteste</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          )}

          <div
            className={`media-tiles ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {visibleMedia.map(item => (
              <button
                type="button"
                key={item.id}
                className={`media-tile ${item.id === selectedId ? 'selected' : ''}`}
                onClick={() => setSelectedId(item.id)}
              >
                <div className="media-tile-thumb">
                  {isImage(item)
                    ? <img src={`/api/media/${item.id}`} alt={item.name} />
                    : <span className="media-tile-icon">{typeLabel(item)}</span>}
                </div>
                <div className="media-tile-name">{item.name}</div>
              </button>
            ))}

            <button
              type="button"
              className={`media-upload-tile ${isEmpty ? 'big' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg viewBox="0 0 24 24" className="mt-icn up"><path d="M12 16V4M6 10l6-6 6 6" /><path d="M4 20h16" /></svg>
              Hochladen
            </button>
          </div>
        </div>

        {selected ? (
          <aside className="media-panel">
            <div className="media-panel-preview">
              {isImage(selected)
                ? <img src={`/api/media/${selected.id}`} alt={selected.name} />
                : <span className="media-tile-icon big">{typeLabel(selected)}</span>}
            </div>
            <div className="media-panel-body">
              {renaming ? (
                <div className="media-rename">
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') saveRename(); if (e.key === 'Escape') setRenaming(false); }}
                  />
                  <div className="media-rename-actions">
                    <button className="btn-navy" onClick={saveRename}>Speichern</button>
                    <button className="btn-ghost" onClick={() => setRenaming(false)}>Abbrechen</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="media-panel-name">{selected.name}</div>
                  <span className="media-type-pill">{typeLabel(selected)}</span>
                </>
              )}

              <div className="media-meta">
                <div className="media-meta-row"><span>Größe</span><strong>{formatSize(selected.fileSize)}</strong></div>
                {dims && (
                  <div className="media-meta-row"><span>Abmessungen</span><strong>{dims.w} × {dims.h}</strong></div>
                )}
                <div className="media-meta-row"><span>Hochgeladen</span><strong>{formatDate(selected.createdAt)}</strong></div>
              </div>

              <div className="media-url">
                <span className="media-url-text">/api/media/{selected.id}</span>
                <button className="media-url-copy" onClick={copyUrl}>Kopieren</button>
              </div>

              {!renaming && (
                <div className="media-panel-actions">
                  <button className="btn-navy" onClick={startRename}>Umbenennen</button>
                  <button className="btn-delete" onClick={() => handleDelete(selected)}>Löschen</button>
                </div>
              )}
            </div>
          </aside>
        ) : (
          <aside className="media-panel media-panel-empty">
            <p>Keine Datei ausgewählt.</p>
          </aside>
        )}
      </div>

      {toast && <div className="media-toast">{toast}</div>}
    </div>
  );
};
