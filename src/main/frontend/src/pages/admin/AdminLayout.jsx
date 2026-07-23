import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLayout = () => {
  const { user, logout, authFetch, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
    // Alle 60 Sekunden aktualisieren
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, [authFetch]);

  const fetchUnreadCount = async () => {
    try {
      const res = await authFetch('/api/admin/messages/unread-count');
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (err) {
      // Ignore
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/cms', icon: 'bi-grid-1x2-fill' },
    { label: 'Seiten', path: '/admin/cms/seiten', icon: 'bi-file-earmark-richtext' },
    { label: 'Blog', path: '/admin/cms/blog', icon: 'bi-pencil-square' },
    { label: 'News', path: '/admin/cms/news', icon: 'bi-newspaper' },
    { label: 'Seminare', path: '/admin/cms/seminare', icon: 'bi-mortarboard-fill' },
    { label: 'Mediathek', path: '/admin/cms/media', icon: 'bi-images' },
    { label: 'Nachrichten', path: '/admin/cms/nachrichten', icon: 'bi-envelope-fill', badge: unreadCount },
    ...(hasRole('ADMIN') ? [{ label: 'Einstellungen', path: '/admin/cms/einstellungen', icon: 'bi-gear-fill' }] : []),
  ];

  const isNavItemActive = (path) => {
    if (path === '/admin/cms') {
      return location.pathname === '/admin/cms';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <div className="sidebar-brand" onClick={() => navigate('/admin/cms')}>
            <span className="brand-dot">P</span>
            <span>rouDig CMS</span>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className={`bi ${sidebarOpen ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
          </button>
        </div>
        <button
          className="admin-nav-item back-to-home"
          onClick={() => navigate('/admin')}
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '0.5rem' }}
        >
          <i className="bi bi-arrow-left"></i>
          <span>Zur Übersicht</span>
        </button>
        <div className="sidebar-section-label">Content-Management</div>
        <nav className="admin-nav">
          {navItems.map((item, idx) => (
            <button
              key={idx}
              className={`admin-nav-item ${isNavItemActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
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

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
