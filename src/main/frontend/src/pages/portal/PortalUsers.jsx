import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const ROLE_PRIORITY = ['ADMIN', 'CONSULTANT', 'USER'];
const primaryRole = (user) => ROLE_PRIORITY.find(r => user.roles?.includes(r)) || 'USER';

const ROLE_OPTIONS = [
  { value: 'USER', label: 'Benutzer' },
  { value: 'CONSULTANT', label: 'Bearbeiter' },
  { value: 'ADMIN', label: 'Administrator' },
];

const emptyUser = { email: '', firstName: '', lastName: '', role: 'USER', password: '', passwordConfirm: '', forcePasswordChange: false };

export const PortalUsers = () => {
  const { authFetch } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState(emptyUser);
  const [showPassword, setShowPassword] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
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

  // Escape schließt den Bearbeiten-Dialog und sperrt Body-Scroll, solange er offen ist
  useEffect(() => {
    if (!editing) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeEdit();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [editing]);

  const closeCreate = () => {
    setShowCreate(false);
    setNewUser(emptyUser);
    setShowPassword(false);
  };

  const openEdit = (user) => {
    setEditing({
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: primaryRole(user),
    });
  };

  const closeEdit = () => setEditing(null);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editing.firstName || !editing.lastName) {
      setMessage('Bitte Vor- und Nachname ausfüllen');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch(`/api/users/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editing.firstName,
          lastName: editing.lastName,
          roles: [editing.role],
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map(u => (u.id === updated.id ? updated : u)));
        closeEdit();
        setMessage('Benutzer aktualisiert');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const detail = await res.text();
        setMessage(detail ? 'Fehler beim Speichern: ' + detail : 'Fehler beim Speichern');
      }
    } catch (err) {
      setMessage('Fehler: ' + err.message);
    } finally {
      setSaving(false);
    }
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
          roles: [newUser.role],
          forcePasswordChange: newUser.forcePasswordChange
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

  const handleDeleteUser = async () => {
    const id = deleteTarget.id;
    setDeleteTarget(null);
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

  const editInitials = editing ? `${editing.firstName.charAt(0)}${editing.lastName.charAt(0)}`.toUpperCase() : '';
  const editPreviewName = editing ? `${editing.firstName} ${editing.lastName}`.trim() : '';

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
                <label className="ucd-checkbox">
                  <input
                    type="checkbox"
                    checked={newUser.forcePasswordChange}
                    onChange={(e) => setNewUser({ ...newUser, forcePasswordChange: e.target.checked })}
                    disabled={creating}
                  />
                  Passwortänderung beim ersten Login erforderlich
                </label>
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

      {editing && (
        <div
          className="confirm-dialog-backdrop"
          onClick={(e) => { if (e.target === e.currentTarget) closeEdit(); }}
        >
          <div className="user-form-dialog user-create-dialog" role="dialog" aria-modal="true" aria-labelledby="user-edit-title">
            <div className="ucd-header">
              <div className={`ucd-avatar ${editInitials ? 'filled' : ''}`}>{editInitials || '?'}</div>
              <div className="ucd-heading">
                <h2 id="user-edit-title">Benutzer bearbeiten</h2>
                <p className="ucd-preview">
                  {editPreviewName ? `Vorschau: ${editPreviewName}` : 'Name erscheint hier als Vorschau.'}
                </p>
              </div>
            </div>
            <form onSubmit={handleUpdateUser}>
              <div className="ucd-body">
                <div className="form-group">
                  <label>E-Mail</label>
                  <div className="ucd-field">
                    <i className="bi bi-envelope ucd-icon"></i>
                    <input type="email" value={editing.email} readOnly disabled />
                  </div>
                </div>
                <div className="form-group">
                  <label>Vorname <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-person ucd-icon"></i>
                    <input
                      type="text"
                      value={editing.firstName}
                      onChange={(e) => setEditing({ ...editing, firstName: e.target.value })}
                      placeholder="Max"
                      disabled={saving}
                      autoFocus
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Nachname <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-person ucd-icon"></i>
                    <input
                      type="text"
                      value={editing.lastName}
                      onChange={(e) => setEditing({ ...editing, lastName: e.target.value })}
                      placeholder="Mustermann"
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Rolle <span className="req">*</span></label>
                  <div className="ucd-field">
                    <i className="bi bi-shield ucd-icon"></i>
                    <select
                      className="ucd-select"
                      value={editing.role}
                      onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                      disabled={saving}
                    >
                      {ROLE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    <i className="bi bi-chevron-down ucd-chevron"></i>
                  </div>
                </div>
              </div>
              <div className="user-form-actions">
                <button type="button" className="btn-secondary" onClick={closeEdit} disabled={saving}>
                  Abbrechen
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Speichert...' : 'Speichern'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        danger
        title="Benutzer löschen"
        message={deleteTarget ? `»${deleteTarget.firstName} ${deleteTarget.lastName}« wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.` : ''}
        confirmText="Löschen"
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteTarget(null)}
      />

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
                  <div className="user-actions">
                    <button
                      className="btn-sm btn-edit"
                      onClick={() => openEdit(user)}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="btn-sm btn-danger"
                      onClick={() => setDeleteTarget(user)}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
