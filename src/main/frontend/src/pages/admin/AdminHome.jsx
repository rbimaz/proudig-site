import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserMenu } from '../../components/UserMenu';

export const AdminHome = () => {
  const { user, isAdmin, hasRole, authFetch } = useAuth();
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

  const handleCmsClick = () => {
    navigate('/admin/cms');
  };

  const handlePortalClick = () => {
    // Nur ADMIN hat das Portal-Dashboard; Consultants direkt zu den Dokumenten.
    navigate(hasRole('ADMIN') ? '/admin/portal' : '/admin/portal/documents');
  };

  return (
    <div className="admin-home-page">
      <header className="admin-home-header">
        <div className="admin-home-brand">
          <span className="brand-dot">P</span>
          <span>rouDig</span>
        </div>
        <div className="admin-home-user">
          <UserMenu />
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
              <span className="admin-home-card-hint">Administratoren & Consultants</span>
            </div>
          )}

          {(hasRole('ADMIN') || hasRole('CONSULTANT')) && (
            <div className="admin-home-card" onClick={handlePortalClick} role="button" tabIndex={0}>
              <div className="admin-home-card-icon">
                <i className="bi bi-folder-fill"></i>
              </div>
              <h2>Dokumenten-Portal</h2>
              <p>Dokumente hochladen, teilen, verwalten</p>
              <span className="admin-home-card-hint">{hasRole('ADMIN') ? 'Administratoren & Consultants' : 'Eigene & geteilte Dokumente'}</span>
            </div>
          )}

          {isAdmin() && (
            <div className="admin-home-card" onClick={() => navigate('/admin/cms/nachrichten')} role="button" tabIndex={0}>
              <div className="admin-home-card-icon">
                <i className="bi bi-envelope-fill"></i>
              </div>
              <h2>Nachrichten</h2>
              <p>Kontaktanfragen bearbeiten</p>
              <span className="admin-home-card-hint">Administratoren & Consultants</span>
              {unreadCount > 0 && <span className="card-badge">{unreadCount}</span>}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};