import React, { useState } from 'react';

/**
 * Unified Action Button für Portal
 *
 * Einheitliches Button-System:
 * - Ruhezustand: neutral (grau Border, weißer BG, muted Icon)
 * - Hover normal: orange Border/Icon/BG
 * - Hover danger: rot Border/Icon/BG (nur Löschen)
 *
 * @param {string} icon - Bootstrap Icon Klasse (z.B. "bi-folder-symlink")
 * @param {string} label - Accessible Label / Tooltip
 * @param {boolean} danger - Rot statt orange bei Hover
 * @param {function} onClick - Click Handler
 * @param {boolean} disabled - Button deaktiviert
 */
export const ActionButton = ({ icon, label, danger = false, onClick, disabled = false }) => {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const isActive = hovered || focused;

  const baseStyle = {
    width: 34,
    height: 34,
    borderRadius: 8,
    display: 'grid',
    placeItems: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--line)',
    background: '#fff',
    color: 'var(--ink-3)',
    transition: 'all 0.14s ease',
    opacity: disabled ? 0.5 : 1,
  };

  const activeStyle = danger
    ? {
        borderColor: 'var(--danger)',
        color: 'var(--danger)',
        background: 'var(--danger-weak)',
      }
    : {
        borderColor: 'var(--orange)',
        color: 'var(--orange)',
        background: 'var(--orange-weak)',
      };

  const style = {
    ...baseStyle,
    ...(isActive && !disabled ? activeStyle : {}),
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={style}
    >
      <i className={`bi ${icon}`} style={{ fontSize: 16 }} />
    </button>
  );
};

/**
 * Container für Action Buttons in einer Zeile
 */
export const ActionButtonGroup = ({ children }) => (
  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
    {children}
  </div>
);
