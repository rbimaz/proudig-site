import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Dialog zum Erstellen/Verwalten externer Freigabe-Links für ein Dokument oder einen Ordner.
 * target: { type: 'DOCUMENT' | 'FOLDER', id, name }
 */
export const ShareLinkDialog = ({ target, onClose }) => {
  const { authFetch } = useAuth();
  const [links, setLinks] = useState([]);
  const [password, setPassword] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const queryParam = target.type === 'FOLDER' ? `folderId=${target.id}` : `documentId=${target.id}`;

  const loadLinks = useCallback(async () => {
    try {
      const res = await authFetch(`/api/shares?${queryParam}`);
      if (res.ok) setLinks(await res.json());
    } catch {
      /* ignore */
    }
  }, [authFetch, queryParam]);

  useEffect(() => { loadLinks(); }, [loadLinks]);

  const shareUrl = (token) => `${window.location.origin}/s/${token}`;

  const handleCreate = async () => {
    setBusy(true);
    setError('');
    try {
      const body = {};
      if (target.type === 'FOLDER') body.folderId = target.id; else body.documentId = target.id;
      if (password) body.password = password;
      if (expiresAt) body.expiresAt = new Date(expiresAt).toISOString();
      if (recipientEmail) body.recipientEmail = recipientEmail;
      const res = await authFetch('/api/shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) { setError('Link konnte nicht erstellt werden.'); return; }
      setPassword(''); setExpiresAt(''); setRecipientEmail('');
      await loadLinks();
    } catch {
      setError('Link konnte nicht erstellt werden.');
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async (id) => {
    try {
      const res = await authFetch(`/api/shares/${id}`, { method: 'DELETE' });
      if (res.ok) await loadLinks();
    } catch {
      /* ignore */
    }
  };

  const copy = async (token) => {
    try {
      await navigator.clipboard.writeText(shareUrl(token));
      setCopied(token);
      setTimeout(() => setCopied(''), 1500);
    } catch {
      /* ignore */
    }
  };

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const modal = { width: 'min(560px, 92vw)', maxHeight: '86vh', overflowY: 'auto', background: 'var(--c-white)', borderRadius: 12, padding: '1.5rem' };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
          <h3 style={{ margin: 0 }}>
            <i className={`bi ${target.type === 'FOLDER' ? 'bi-folder-fill' : 'bi-file-earmark-text'}`} style={{ marginRight: '.4rem', color: 'var(--c-accent)' }}></i>
            Extern teilen
          </h3>
          <button className="pd-btn-secondary" onClick={onClose}><i className="bi bi-x-lg"></i></button>
        </div>
        <p style={{ color: 'var(--c-text-muted)', marginTop: 0 }}>{target.name}</p>

        <div style={{ display: 'grid', gap: '.6rem', margin: '1rem 0' }}>
          <div>
            <label>Passwort (optional)</label>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="leer = ohne Passwort" style={{ width: '100%', padding: '.5rem', border: '1px solid var(--c-border)', borderRadius: 8 }} />
          </div>
          <div>
            <label>Ablaufdatum (optional)</label>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} style={{ width: '100%', padding: '.5rem', border: '1px solid var(--c-border)', borderRadius: 8 }} />
          </div>
          <div>
            <label>Empfänger-E-Mail (optional)</label>
            <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="nur zur Zuordnung" style={{ width: '100%', padding: '.5rem', border: '1px solid var(--c-border)', borderRadius: 8 }} />
          </div>
        </div>

        {error && <div style={{ color: 'var(--c-danger)', marginBottom: '.6rem' }}>{error}</div>}

        <button className="pd-btn-primary" disabled={busy} onClick={handleCreate}>
          <i className="bi bi-link-45deg"></i> {busy ? 'Wird erstellt…' : 'Link erstellen'}
        </button>

        <div style={{ marginTop: '1.2rem' }}>
          <h4 style={{ marginBottom: '.4rem' }}>Bestehende Links</h4>
          {links.length === 0 && <p style={{ color: 'var(--c-text-muted)' }}>Noch keine Links.</p>}
          {links.map((l) => (
            <div key={l.id} style={{ padding: '.5rem 0', borderTop: '1px solid var(--c-border)' }}>
              <div style={{ display: 'flex', gap: '.4rem', alignItems: 'center' }}>
                <input readOnly value={shareUrl(l.token)} style={{ flex: 1, padding: '.35rem', border: '1px solid var(--c-border)', borderRadius: 6, fontSize: '.85rem', textDecoration: l.revoked ? 'line-through' : 'none', color: l.revoked ? 'var(--c-text-light)' : 'inherit' }} />
                <button className="pd-btn-secondary" onClick={() => copy(l.token)}>{copied === l.token ? 'Kopiert' : 'Kopieren'}</button>
                {!l.revoked && <button className="pd-btn-secondary" onClick={() => handleRevoke(l.id)} title="Widerrufen"><i className="bi bi-slash-circle"></i></button>}
              </div>
              <div style={{ fontSize: '.78rem', color: 'var(--c-text-muted)', marginTop: '.2rem' }}>
                {l.requiresPassword && <span><i className="bi bi-lock-fill"></i> Passwort · </span>}
                {l.expiresAt ? <span>Ablauf {new Date(l.expiresAt).toLocaleDateString()} · </span> : <span>kein Ablauf · </span>}
                <span>{l.accessCount}× geladen</span>
                {l.revoked && <span style={{ color: 'var(--c-danger)' }}> · widerrufen</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
