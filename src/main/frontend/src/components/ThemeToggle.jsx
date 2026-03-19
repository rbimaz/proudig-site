import React from 'react';

const variants = [
  { key: 'light', label: '1' },
  { key: 'dark', label: '2' },
  { key: 'blue', label: '3' },
  { key: 'image', label: '4' },
  { key: 'aoe', label: '5' },
  { key: 'udig', label: '6' },
  { key: 'whitecards', label: '7' },
  { key: 'coder', label: '8' },
  { key: 'saas', label: '9' },
  { key: 'imageblue', label: '10' },
  { key: 'aoe2dash', label: '11' }
];

export const ThemeToggle = ({ theme, onThemeChange }) => {
  return (
    <div className="variant-selector">
      {variants.map((v) => (
        <button
          key={v.key}
          className={`variant-btn ${theme === v.key ? 'variant-btn-active' : ''}`}
          onClick={() => onThemeChange(v.key)}
          aria-label={`Variante ${v.label}`}
          title={`Variante ${v.label}`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
};
