import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Admin-Dialog: Nutzergruppen verwalten (anlegen, umbenennen, löschen) und
 * Mitglieder zuordnen/entfernen. Gruppen dienen als Ziel für Ordner-Freigaben.
 */
export const GroupsDialog = ({ onClose }) => {
  const { authFetch } = useAuth();
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState('');
  const [openGroupId, setOpenGroupId] = useState(null);
  const [members, setMembers] = useState([]);
  const [addUserId, setAddUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    const res = await authFetch('/api/groups');
    setGroups(res.ok ? await res.json() : []);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [gRes, uRes] = await Promise.all([authFetch('/api/groups'), authFetch('/api/users')]);
        if (!active) return;
        setGroups(gRes.ok ? await gRes.json() : []);
        setUsers(uRes.ok ? await uRes.json() : []);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [authFetch]);

  const createGroup = async () => {
    if (!newName.trim()) return;
    setError('');
    const res = await authFetch('/api/groups', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newName.trim() })
    });
    if (res.ok) { setNewName(''); await loadGroups(); }
    else setError(await res.text() || 'Anlegen fehlgeschlagen');
  };

  const renameGroup = async (g) => {
    const name = prompt('Neuer Gruppenname:', g.name);
    if (!name || name === g.name) return;
    const res = await authFetch(`/api/groups/${g.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name })
    });
    if (res.ok) await loadGroups(); else setError(await res.text() || 'Umbenennen fehlgeschlagen');
  };

  const deleteGroup = async (g) => {
    if (!window.confirm(`Gruppe "${g.name}" löschen? Zugehörige Ordner-Freigaben werden entfernt.`)) return;
    const res = await authFetch(`/api/groups/${g.id}`, { method: 'DELETE' });
    if (res.ok) { if (openGroupId === g.id) setOpenGroupId(null); await loadGroups(); }
  };

  const openMembers = async (g) => {
    if (openGroupId === g.id) { setOpenGroupId(null); return; }
    setOpenGroupId(g.id);
    setAddUserId('');
    const res = await authFetch(`/api/groups/${g.id}/members`);
    setMembers(res.ok ? await res.json() : []);
  };

  const addMember = async (groupId) => {
    if (!addUserId) return;
    const res = await authFetch(`/api/groups/${groupId}/members`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: addUserId })
    });
    if (res.ok) {
      const mRes = await authFetch(`/api/groups/${groupId}/members`);
      setMembers(mRes.ok ? await mRes.json() : []);
      setAddUserId('');
      await loadGroups();
    } else setError(await res.text() || 'Hinzufügen fehlgeschlagen');
  };

  const removeMember = async (groupId, userId) => {
    const res = await authFetch(`/api/groups/${groupId}/members/${userId}`, { method: 'DELETE' });
    if (res.ok) { setMembers((prev) => prev.filter((m) => m.userId !== userId)); await loadGroups(); }
  };

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const box = { background: '#fff', borderRadius: 12, padding: '1.5rem', width: 'min(560px, 92vw)', maxHeight: '82vh', overflow: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' };
  const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' };
  const selectStyle = { padding: '0.4rem', borderRadius: 6, border: '1px solid #ccc' };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>Gruppen verwalten</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input style={{ ...selectStyle, flex: 1 }} placeholder="Neue Gruppe…" value={newName}
                 onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && createGroup()} />
          <button className="pd-btn-primary" onClick={createGroup}>Anlegen</button>
        </div>
        {error && <div className="pd-error" style={{ marginBottom: '0.75rem' }}>{error}</div>}

        {loading ? <p>Laden...</p> : groups.length === 0 ? (
          <p style={{ color: '#888' }}>Noch keine Gruppen.</p>
        ) : groups.map((g) => (
          <div key={g.id} style={{ borderBottom: '1px solid #eee', padding: '0.4rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span><i className="bi bi-people-fill"></i> {g.name} <small style={{ color: '#888' }}>({g.memberCount})</small></span>
              <span style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="pd-btn-secondary" onClick={() => openMembers(g)}>Mitglieder</button>
                <button className="pd-btn-secondary" onClick={() => renameGroup(g)}>Umbenennen</button>
                <button className="pd-btn-secondary" onClick={() => deleteGroup(g)}>Löschen</button>
              </span>
            </div>
            {openGroupId === g.id && (
              <div style={{ padding: '0.5rem 0 0.25rem 1rem' }}>
                {members.length === 0 ? <p style={{ color: '#888', margin: '0.25rem 0' }}>Keine Mitglieder.</p> :
                  members.map((m) => (
                    <div key={m.userId} style={rowStyle}>
                      <span>{m.name} <small style={{ color: '#888' }}>{m.email}</small></span>
                      <button className="pd-btn-secondary" onClick={() => removeMember(g.id, m.userId)}>Entfernen</button>
                    </div>
                  ))}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <select style={{ ...selectStyle, flex: 1 }} value={addUserId} onChange={(e) => setAddUserId(e.target.value)}>
                    <option value="">Mitglied hinzufügen…</option>
                    {users.filter((u) => !members.some((m) => m.userId === u.id))
                      .map((u) => <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>)}
                  </select>
                  <button className="pd-btn-primary" disabled={!addUserId} onClick={() => addMember(g.id)}>Hinzufügen</button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
          <button className="pd-btn-secondary" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
};
