import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ConfirmDialog } from '../../components/ConfirmDialog';

const ROLE_LABELS = { ADMIN: 'Admin', CONSULTANT: 'Consultant', CLIENT: 'Customer' };

export const PortalUsers = () => {
  const { authFetch, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [authFetch]);

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

  const handleDeleteUser = async () => {
    const id = deleteTarget.id;
    setDeleteTarget(null);
    try {
      const res = await authFetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
        setMessage('Benutzer gelöscht');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const detail = await res.text();
        setMessage(detail ? 'Fehler beim Löschen: ' + detail : 'Fehler beim Löschen');
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

  const adminCount = users.filter(u => u.roles?.includes('ADMIN')).length;

  return (
    <div className="portal-users">
      <div className="users-header">
        <div>
          <h1>Benutzer</h1>
          <p className="subtitle">{users.length} Benutzer</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/portal/users/new')}>
          <i className="bi bi-plus-lg"></i> Neuer Benutzer
        </button>
      </div>

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
            {users.map(user => {
              const isSelf = !!currentUser?.email && user.email === currentUser.email;
              const isLastAdmin = user.roles?.includes('ADMIN') && adminCount <= 1;
              const deleteDisabled = isSelf || isLastAdmin;
              const deleteTitle = isSelf
                ? 'Sie können Ihr eigenes Konto nicht löschen.'
                : isLastAdmin
                  ? 'Der letzte Administrator kann nicht gelöscht werden.'
                  : undefined;
              return (
              <tr key={user.id}>
                <td>{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>
                  <div className="role-badges">
                    {['ADMIN', 'CONSULTANT', 'CLIENT'].map(role => (
                      <button
                        key={role}
                        className={`role-badge ${user.roles?.includes(role) ? 'active' : ''}`}
                        onClick={() => handleToggleRole(user.id, role)}
                      >
                        {ROLE_LABELS[role]}
                      </button>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="user-actions">
                    <button
                      className="btn-sm btn-edit"
                      onClick={() => navigate(`/admin/portal/users/${user.id}`)}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="btn-sm btn-danger"
                      onClick={() => setDeleteTarget(user)}
                      disabled={deleteDisabled}
                      title={deleteTitle}
                    >
                      Löschen
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
