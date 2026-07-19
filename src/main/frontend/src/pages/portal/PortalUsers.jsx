import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_OPTIONS = [
  { value: 'USER', label: 'Benutzer' },
  { value: 'CONSULTANT', label: 'Bearbeiter' },
  { value: 'ADMIN', label: 'Administrator' },
];

const emptyUser = { email: '', firstName: '', lastName: '', role: 'USER', password: '', passwordConfirm: '' };

export const PortalUsers = () => {
  const { authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(emptyUser);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [authFetch]);

  // Escape schließt den Dialog und Body-Scroll wird gesperrt, solange er offen ist
  useEffect(() => {
    if (!showCreate) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCreate();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [showCreate]);

  const closeCreate = () => {
    setShowCreate(false);
    setNewUser(emptyUser);
    setShowPassword(false);
  };

  const fetchUsers = async () => {
    try {
      const res = await authFetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.firstName || !newUser.lastName || !newUser.password) {
      setMessage('Bitte alle Felder ausfüllen');
      return;
    }
    if (newUser.password !== newUser.passwordConfirm) {
      setMessage('Passwörter stimmen nicht überein');
      return;
    }

    setCreating(true);
    setMessage('');
    try {
      const res = await authFetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          password: newUser.password,
          roles: [newUser.role]
        })
      });

      if (res.ok) {
        const created = await res.json();
        setUsers([created, ...users]);
        closeCreate();
        setMessage('Benutzer erstellt');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const detail = await res.text();
        setMessage(detail ? 'Fehler beim Erstellen: ' + detail : 'Fehler beim Erstellen');
      }
    } catch (err) {
      setMessage('Fehler: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Benutzer wirklich löschen?')) return;

    try {
      const res = await authFetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        setMessage('Benutzer gelöscht');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Fehler beim Löschen');
    }
  };

  const handleToggleRole = async (userId, role) => {
    const user = users.find(u => u.id === userId);
    const newRoles = user.roles.includes(role)
      ? user.roles.filter(r => r !== role)
      : [...user.roles, role];

    try {
      const res = await authFetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...user, roles: newRoles })
      });

      if (res.ok) {
        fetchUsers();
        setMessage('Rollen aktualisiert');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      setMessage('Fehler beim Aktualisieren');
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  const initials = `${newUser.firstName.charAt(0)}${newUser.lastName.charAt(0)}`.toUpperCase();
  const previewName = `${newUser.firstName} ${newUser.lastName}`.trim();
  const passwordsMatch = newUser.password === newUser.passwordConfirm;

  return (
    <div className="portal-users">
      <div className="users-header">
        <div>
          <h1>Benutzer</h1>
          <p className="subtitle">{users.length} Benutzer</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreate(true)}>
          <i className="bi bi-plus-lg"></i> Neuer Benutzer
        </button>
      </div>

      {showCreate && (
        <div
          className="confirm-dialog-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) closeCreate(); }}
        >
          <div className="user-form-dialog user-create-dialog" role="dialog" aria-modal="true" aria-labelledby="user-form-title">
            <div className="ucd-header">
              <div className={`ucd-avatar ${initials ? 'filled' : ''}`}>{initials || '?'}</div>
              <div className="ucd-heading">
                <h2 id="user-form-title">Neuen Benutzer erstellen</h2>
                <p className="ucd-preview">
                  {previewName ? `Vorschau: ${previewName}` : 'Name erscheint hier als Vorschau.'}
                </p>
              </div>
            </div>
            <form onSubmit={handleCreateUser}>
              <div className="ucd-body">
                <div className="form-group">
                  <label>E-Mail <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-envelope ucd-icon"></i>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="user@example.com"
                      disabled={creating}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Vorname <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-person ucd-icon"></i>
                    <input
                      type="text"
                      value={newUser.firstName}
                      onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                      placeholder="Max"
                      disabled={creating}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Nachname <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-person ucd-icon"></i>
                    <input
                      type="text"
                      value={newUser.lastName}
                      onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                      placeholder="Mustermann"
                      disabled={creating}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Rolle <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-shield ucd-icon"></i>
                    <select
                      className="ucd-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      disabled={creating}
                    >
                      {ROLE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down ucd-chevron"></i>
                  </div>
                </div>
                <div className="form-group">
                  <label>Passwort <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-lock ucd-icon"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      placeholder="Initialpasswort"
                      autoComplete="new-password"
                      disabled={creating}
                    />
                    <button
                      type="button"
                      className="ucd-eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Passwörter verbergen' : 'Passwörter anzeigen'}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Passwort bestätigen <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-lock ucd-icon"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newUser.passwordConfirm}
                      onChange={(e) => setNewUser({ ...newUser, passwordConfirm: e.target.value })}
                      placeholder="Passwort wiederholen"
                      autoComplete="new-password"
                      disabled={creating}
                    />
                  </div>
                  {newUser.passwordConfirm && (
                    <p className={`ucd-match ${passwordsMatch ? 'ok' : 'bad'}`}>
                      <i className={`bi ${passwordsMatch ? 'bi-check-lg' : 'bi-x-lg'}`}></i>
                      {passwordsMatch ? 'Passwörter stimmen überein' : 'Passwörter stimmen nicht überein'}
                    </p>
                  )}
                </div>
              </div>
              <div className="user-form-actions">
                <button type="button" className="btn-secondary" onClick={closeCreate} disabled={creating}>
                  Abbrechen
                </button>
                <button type="submit" disabled={creating} className="btn-primary">
                  {creating ? 'Erstellt...' : 'Erstellen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {message && (
        <div className={`message ${message.includes('Fehler') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Rollen</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <div className="role-badges">
                    {['ADMIN', 'CONSULTANT', 'USER'].map(role => (
                      <button
                        key={role}
                        className={`role-badge ${user.roles?.includes(role) ? 'active' : ''}`}
                        onClick={() => handleToggleRole(user.id, role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </td>
                <td>
                  <button
                    className="btn-sm danger"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Löschen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
