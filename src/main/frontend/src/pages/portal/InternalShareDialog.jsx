import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Admin-Dialog: ein Dokument intern (lesend) mit Nutzern teilen bzw. widerrufen.
 * Getrennt vom externen Freigabe-Link (ShareLinkDialog).
 */
export const InternalShareDialog = ({ doc, onClose }) => {
  const { authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [sharedIds, setSharedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [uRes, sRes] = await Promise.all([
          authFetch('/api/users'),
          authFetch(`/api/documents/${doc.id}/shares`)
        ]);
        const u = uRes.ok ? await uRes.json() : [];
        const s = sRes.ok ? await sRes.json() : [];
        if (!active) return;
        setUsers(u);
        setSharedIds(new Set(s.map((x) => x.userId)));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [authFetch, doc.id]);

  const toggle = async (userId, isShared) => {
    setBusy(userId);
    try {
      if (isShared) {
        const res = await authFetch(`/api/documents/${doc.id}/share/${userId}`, { method: 'DELETE' });
        if (res.ok) setSharedIds((prev) => { const n = new Set(prev); n.delete(userId); return n; });
      } else {
        const res = await authFetch(`/api/documents/${doc.id}/share`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId })
        });
        if (res.ok) setSharedIds((prev) => new Set(prev).add(userId));
      }
    } finally {
      setBusy(null);
    }
  };

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const box = { background: '#fff', borderRadius: 12, padding: '1.5rem', width: 'min(460px, 92vw)', maxHeight: '80vh', overflow: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' };
  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Intern teilen — {doc.fileName}</h3>
        {loading ? (
          <p>Laden...</p>
        ) : (
          <div>
            {users.map((u) => {
              const shared = sharedIds.has(u.id);
              return (
                <div key={u.id} style={rowStyle}>
                  <span>{u.firstName} {u.lastName} <small style={{ color: '#888' }}>({(u.roles || []).join(', ')})</small></span>
                  <button
                    className={shared ? 'pd-btn-secondary' : 'pd-btn-primary'}
                    disabled={busy === u.id}
                    onClick={() => toggle(u.id, shared)}
                  >
                    {shared ? 'Entfernen' : 'Teilen'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button className="pd-btn-secondary" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
};
