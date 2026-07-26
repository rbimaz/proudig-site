import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Header-User-Menü als Dropdown (Avatar-Initialen + Name + Rolle).
 * Wird einheitlich im CMS- (AdminLayout) und Portal-Layout (PortalLayout) genutzt.
 */
export const UserMenu = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Schließen bei Klick außerhalb und bei Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onClick); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const initials = `${(user?.firstName || '').charAt(0)}${(user?.lastName || '').charAt(0)}`.toUpperCase() || 'U';
  const roleLabel = hasRole('ADMIN') ? 'Administrator' : (hasRole('CONSULTANT') ? 'Redakteur' : 'Benutzer');
  const go = (path) => { setOpen(false); navigate(path); };
  const handleLogout = async () => { setOpen(false); await logout(); navigate('/admin/login'); };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className={`user-menu-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="user-avatar-initials">{initials}</span>
        <span className="user-menu-id">
          <span className="user-name">{user?.firstName} {user?.lastName}</span>
          <span className="user-role">{roleLabel}</span>
        </span>
        <i className="bi bi-chevron-down user-menu-chevron"></i>
      </button>

      {open && (
        <div className="user-menu-dropdown" role="menu">
          <div className="user-menu-head">
            <span className="user-avatar-initials lg">{initials}</span>
            <div className="user-menu-head-id">
              <span className="user-name">{user?.firstName} {user?.lastName}</span>
              <span className="user-email">{user?.email}</span>
            </div>
          </div>
          <div className="user-menu-items">
            <button role="menuitem" className="user-menu-item" onClick={() => go('/admin/portal/profil')}>
              <i className="bi bi-person"></i> Profil
            </button>
            {hasRole('ADMIN') && (
              <button role="menuitem" className="user-menu-item" onClick={() => go('/admin/cms/einstellungen')}>
                <i className="bi bi-gear"></i> Einstellungen
              </button>
            )}
            <div className="user-menu-sep"></div>
            <button role="menuitem" className="user-menu-item danger" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
