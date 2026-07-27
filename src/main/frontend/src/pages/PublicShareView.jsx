import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

/**
 * Öffentliche, login-freie Seite für externe Freigabe-Links (`/s/:token`).
 * Zeigt bei Dokument-Links einen Download-Button, bei Ordner-Links die Dateiliste.
 */
export const PublicShareView = () => {
  const { token } = useParams();
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetch(`/api/public/shares/${token}`)
      .then(res => (res.ok ? res.json() : Promise.reject(res.status)))
      .then(setMeta)
      .catch(() => setError('Dieser Freigabe-Link ist ungültig.'))
      .finally(() => setLoading(false));
  }, [token]);

  const downloadUrl = (documentId) => {
    const params = new URLSearchParams();
    if (documentId) params.set('documentId', documentId);
    if (password) params.set('password', password);
    const qs = params.toString();
    return `/api/public/shares/${token}/download${qs ? '?' + qs : ''}`;
  };

  const triggerDownload = async (documentId, fileName) => {
    setBusy(true);
    setNotice('');
    try {
      const res = await fetch(downloadUrl(documentId));
      if (!res.ok) {
        if (res.status === 403) setNotice('Passwort erforderlich oder falsch.');
        else if (res.status === 410) setNotice('Der Link ist abgelaufen oder wurde widerrufen.');
        else if (res.status === 429) setNotice('Zu viele Passwortversuche. Bitte später erneut.');
        else setNotice('Download nicht möglich.');
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setNotice('Download nicht möglich.');
    } finally {
      setBusy(false);
    }
  };

  const loadFolderFiles = async () => {
    setBusy(true);
    setNotice('');
    try {
      const params = new URLSearchParams();
      if (password) params.set('password', password);
      const qs = params.toString();
      const res = await fetch(`/api/public/shares/${token}/files${qs ? '?' + qs : ''}`);
      if (!res.ok) {
        if (res.status === 403) setNotice('Passwort erforderlich oder falsch.');
        else if (res.status === 410) setNotice('Der Link ist abgelaufen oder wurde widerrufen.');
        else if (res.status === 429) setNotice('Zu viele Passwortversuche. Bitte später erneut.');
        else setNotice('Dateien konnten nicht geladen werden.');
        return;
      }
      setFiles(await res.json());
    } catch {
      setNotice('Dateien konnten nicht geladen werden.');
    } finally {
      setBusy(false);
    }
  };

  const box = {
    maxWidth: 640, margin: '8vh auto', padding: '2rem',
    background: 'var(--c-white)', border: '1px solid var(--c-border)',
    borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,.06)'
  };

  if (loading) return <div style={box}>Laden…</div>;
  if (error) return <div style={box}><h2>Freigabe nicht verfügbar</h2><p>{error}</p></div>;

  if (!meta.valid) {
    return (
      <div style={box}>
        <h2>Freigabe nicht verfügbar</h2>
        <p>Dieser Link ist abgelaufen oder wurde widerrufen.</p>
      </div>
    );
  }

  const isFolder = meta.targetType === 'FOLDER';

  return (
    <div style={box}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem', marginBottom: '1rem' }}>
        <i className={`bi ${isFolder ? 'bi-folder-fill' : 'bi-file-earmark-text'}`} style={{ fontSize: '1.6rem', color: 'var(--c-accent)' }}></i>
        <h2 style={{ margin: 0 }}>{meta.name}</h2>
      </div>
      <p style={{ color: 'var(--c-text-muted)' }}>
        {isFolder ? 'Freigegebener Ordner' : 'Freigegebenes Dokument'} von ProuDig.
      </p>

      {meta.requiresPassword && (
        <div style={{ margin: '1rem 0' }}>
          <label style={{ display: 'block', marginBottom: '.3rem' }}>Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort eingeben"
            style={{ width: '100%', padding: '.6rem', border: '1px solid var(--c-border)', borderRadius: 8 }}
          />
        </div>
      )}

      {notice && <div style={{ color: 'var(--c-danger)', margin: '.6rem 0' }}>{notice}</div>}

      {!isFolder && (
        <button className="btn-primary" disabled={busy} onClick={() => triggerDownload(null, meta.name)}>
          {busy ? 'Wird geladen…' : 'Herunterladen'}
        </button>
      )}

      {isFolder && !files && (
        <button className="btn-primary" disabled={busy} onClick={loadFolderFiles}>
          {busy ? 'Wird geladen…' : 'Dateien anzeigen'}
        </button>
      )}

      {isFolder && files && (
        <div style={{ marginTop: '1rem' }}>
          {files.length === 0 && <p style={{ color: 'var(--c-text-muted)' }}>Dieser Ordner enthält keine Dateien.</p>}
          {files.map((f) => (
            <div key={f.documentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '.5rem 0', borderBottom: '1px solid var(--c-border)' }}>
              <span><i className="bi bi-file-earmark-text" style={{ marginRight: '.4rem' }}></i>{f.relativePath}</span>
              <button className="btn-secondary" disabled={busy} onClick={() => triggerDownload(f.documentId, f.fileName)}>
                Laden
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
