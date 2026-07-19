import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FolderTreeProvider } from '../../contexts/FolderTreeContext';
import { FolderTree } from '../../components/FolderTree';

const PortalLayoutInner = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isDocumentsPage = location.pathname === '/admin/portal/documents';

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/portal', icon: 'bi-grid-1x2-fill' },
    { label: 'Meine Dokumente', path: '/admin/portal/documents', icon: 'bi-folder-fill' },
    { label: 'Geteilt mit mir', path: '/admin/portal/shared', icon: 'bi-share-fill' },
    ...(isAdmin() ? [{ label: 'Benutzer', path: '/admin/portal/users', icon: 'bi-people-fill' }] : [])
  ];

  return (
    <div className="portal-layout">
      <aside className={`portal-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="portal-sidebar-header">
          <div className="sidebar-brand" onClick={() => navigate('/admin/portal')}>
            <span className="brand-dot">P</span>
            <span>ortal</span>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
          </button>
        </div>
        <button
          className="portal-nav-item back-to-home"
          onClick={() => navigate('/admin')}
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.5rem' }}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Zur Übersicht</span>
        </button>
        <div className="sidebar-section-label">Navigation</div>
        <nav className="portal-nav">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className={`portal-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {isDocumentsPage && <FolderTree />}
      </aside>

      <div className="portal-main">
        <header className="portal-topbar">
          <div className="topbar-left">
            <button className="sidebar-toggle-mobile" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <i className="bi bi-list"></i>
            </button>
          </div>
          <div className="topbar-right">
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

        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export const PortalLayout = () => (
  <FolderTreeProvider>
    <PortalLayoutInner />
  </FolderTreeProvider>
);
