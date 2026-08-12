import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Admin-Dialog: einen Ordner intern mit READ/WRITE an einen Nutzer ODER eine
 * Gruppe freigeben. Wirkt auf den gesamten Teilbaum. Bestehende Freigaben
 * werden gelistet und können widerrufen werden.
 */
export const FolderShareDialog = ({ folder, onClose }) => {
  const { authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [shares, setShares] = useState([]);
  const [target, setTarget] = useState('');
  const [permission, setPermission] = useState('READ');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    const [uRes, gRes, sRes] = await Promise.all([
      authFetch('/api/users'),
      authFetch('/api/groups'),
      authFetch(`/api/folders/${folder.id}/shares`)
    ]);
    setUsers(uRes.ok ? await uRes.json() : []);
    setGroups(gRes.ok ? await gRes.json() : []);
    setShares(sRes.ok ? await sRes.json() : []);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try { await load(); } finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, [authFetch, folder.id]);

  const addShare = async () => {
    if (!target) return;
    setBusy(true);
    setError('');
    const [type, id] = target.split(':');
    const body = type === 'user' ? { userId: id, permission } : { groupId: id, permission };
    try {
      const res = await authFetch(`/api/folders/${folder.id}/shares`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      if (res.ok) {
        await load();
        setTarget('');
      } else {
        setError('Freigabe fehlgeschlagen');
      }
    } finally {
      setBusy(false);
    }
  };

  const revoke = async (shareId) => {
    setBusy(true);
    try {
      const res = await authFetch(`/api/folders/${folder.id}/shares/${shareId}`, { method: 'DELETE' });
      if (res.ok) setShares((prev) => prev.filter((s) => s.id !== shareId));
    } finally {
      setBusy(false);
    }
  };

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const box = { background: '#fff', borderRadius: 12, padding: '1.5rem', width: 'min(520px, 92vw)', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' };
  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' };
  const selectStyle = { padding: '0.4rem', borderRadius: 6, border: '1px solid #ccc' };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Ordner teilen — {folder.name}</h3>
        {loading ? (
          <p>Laden...</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
              <select style={{ ...selectStyle, flex: 1, minWidth: 200 }} value={target} onChange={(e) => setTarget(e.target.value)}>
                <option value="">Nutzer oder Gruppe wählen…</option>
                {groups.length > 0 && (
                  <optgroup label="Gruppen">
                    {groups.map((g) => <option key={g.id} value={`group:${g.id}`}>{g.name} ({g.memberCount})</option>)}
                  </optgroup>
                )}
                <optgroup label="Nutzer">
                  {users.map((u) => <option key={u.id} value={`user:${u.id}`}>{u.firstName} {u.lastName}</option>)}
                </optgroup>
              </select>
              <select style={selectStyle} value={permission} onChange={(e) => setPermission(e.target.value)}>
                <option value="READ">Lesen</option>
                <option value="WRITE">Schreiben</option>
              </select>
              <button className="pd-btn-primary" disabled={busy || !target} onClick={addShare}>Teilen</button>
            </div>
            {error && <div className="pd-error" style={{ marginBottom: '0.75rem' }}>{error}</div>}

            <h4 style={{ margin: '0 0 0.5rem' }}>Bestehende Freigaben</h4>
            {shares.length === 0 ? (
              <p style={{ color: '#888' }}>Noch keine internen Freigaben.</p>
            ) : (
              shares.map((s) => (
                <div key={s.id} style={rowStyle}>
                  <span>
                    <i className={`bi ${s.targetType === 'GROUP' ? 'bi-people-fill' : 'bi-person-fill'}`}></i>{' '}
                    {s.targetName}{' '}
                    <small style={{ color: '#888' }}>({s.permission === 'WRITE' ? 'Schreiben' : 'Lesen'})</small>
                  </span>
                  <button className="pd-btn-secondary" disabled={busy} onClick={() => revoke(s.id)}>Entfernen</button>
                </div>
              ))
            )}
          </>
        )}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button className="pd-btn-secondary" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
};
