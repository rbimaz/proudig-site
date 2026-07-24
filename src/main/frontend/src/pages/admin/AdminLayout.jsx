import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AdminLayout = () => {
  const { user, logout, authFetch, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // User-Menü: Schließen bei Klick außerhalb und bei Escape
  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setUserMenuOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [userMenuOpen]);

  const initials = `${(user?.firstName || '').charAt(0)}${(user?.lastName || '').charAt(0)}`.toUpperCase() || 'U';
  const roleLabel = hasRole('ADMIN') ? 'Administrator' : (hasRole('CONSULTANT') ? 'Redakteur' : 'Benutzer');
  const go = (path) => { setUserMenuOpen(false); navigate(path); };

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
            <div className="user-menu" ref={userMenuRef}>
              <button
                className={`user-menu-trigger ${userMenuOpen ? 'open' : ''}`}
                onClick={() => setUserMenuOpen(o => !o)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="user-avatar-initials">{initials}</span>
                <span className="user-menu-id">
                  <span className="user-name">{user?.firstName} {user?.lastName}</span>
                  <span className="user-role">{roleLabel}</span>
                </span>
                <i className="bi bi-chevron-down user-menu-chevron"></i>
              </button>

              {userMenuOpen && (
                <div className="user-menu-dropdown" role="menu">
                  <div className="user-menu-head">
                    <span className="user-avatar-initials lg">{initials}</span>
                    <div className="user-menu-head-id">
                      <span className="user-name">{user?.firstName} {user?.lastName}</span>
                      <span className="user-email">{user?.email}</span>
                    </div>
                  </div>
                  <div className="user-menu-items">
                    <button role="menuitem" className="user-menu-item" onClick={() => go('/admin/portal/change-password')}>
                      <i className="bi bi-person"></i> Profil
                    </button>
                    {hasRole('ADMIN') && (
                      <button role="menuitem" className="user-menu-item" onClick={() => go('/admin/cms/einstellungen')}>
                        <i className="bi bi-gear"></i> Einstellungen
                      </button>
                    )}
                    <div className="user-menu-sep"></div>
                    <button role="menuitem" className="user-menu-item danger" onClick={() => { setUserMenuOpen(false); handleLogout(); }}>
                      <i className="bi bi-box-arrow-right"></i> Abmelden
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
