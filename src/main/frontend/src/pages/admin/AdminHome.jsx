import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AdminHome = () => {
  const { user, logout, isAdmin, hasRole, authFetch } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await authFetch('/api/admin/messages/unread-count');
        if (res.ok) {
          const count = await res.json();
          setUnreadCount(count);
        }
      } catch (e) {
        // Ignore errors
      }
    };
    if (isAdmin()) fetchUnread();
  }, [isAdmin, authFetch]);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleCmsClick = () => {
    navigate('/admin/cms');
  };

  const handlePortalClick = () => {
    navigate('/admin/portal');
  };

  return (
    <div className="admin-home-page">
      <header className="admin-home-header">
        <div className="admin-home-brand">
          <span className="brand-dot">P</span>
          <span>rouDig</span>
        </div>
        <div className="admin-home-user">
          <div className="user-info">
            <i className="bi bi-person-circle user-avatar"></i>
            <div className="user-details">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Abmelden
          </button>
        </div>
      </header>

      <main className="admin-home-main">
        <h1 className="admin-home-welcome">Willkommen, {user?.firstName} {user?.lastName}</h1>
        <p className="admin-home-subtitle">Wählen Sie einen Bereich:</p>

        <div className="admin-home-cards">
          {hasRole('ADMIN') && (
            <div className="admin-home-card" onClick={() => navigate('/admin/portal/users')} role="button" tabIndex={0}>
              <div className="admin-home-card-icon">
                <i className="bi bi-people-fill"></i>
              </div>
              <h2>Benutzerverwaltung</h2>
              <p>Benutzer anlegen, Rollen verwalten</p>
              <span className="admin-home-card-hint">Für Administratoren</span>
            </div>
          )}

          {isAdmin() && (
            <div className="admin-home-card" onClick={handleCmsClick} role="button" tabIndex={0}>
              <div className="admin-home-card-icon">
                <i className="bi bi-file-earmark-richtext"></i>
              </div>
              <h2>Content-Management</h2>
              <p>Website-Inhalte, Blog, Seminare, Mediathek</p>
              <span className="admin-home-card-hint">Für Administratoren</span>
            </div>
          )}

          <div className="admin-home-card" onClick={handlePortalClick} role="button" tabIndex={0}>
            <div className="admin-home-card-icon">
              <i className="bi bi-folder-fill"></i>
            </div>
            <h2>Dokumenten-Portal</h2>
            <p>Dokumente hochladen, teilen, verwalten</p>
            <span className="admin-home-card-hint">Für alle Benutzer</span>
          </div>

          {isAdmin() && (
            <div className="admin-home-card" onClick={() => navigate('/admin/cms/nachrichten')} role="button" tabIndex={0}>
              <div className="admin-home-card-icon">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <h2>Nachrichten</h2>
              <p>Kontaktanfragen bearbeiten</p>
              <span className="admin-home-card-hint">Für Administratoren</span>
              {unreadCount > 0 && <span className="card-badge">{unreadCount}</span>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};