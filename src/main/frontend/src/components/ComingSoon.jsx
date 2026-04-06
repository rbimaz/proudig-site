import React, { useState } from 'react';

const FALLBACK_PASSWORD = 'proudig2026';

export const ComingSoon = ({ onUnlock }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/preview-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (!res.ok) throw new Error('not ok');

      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem('proudig-preview', 'true');
        onUnlock();
        return;
      } else {
        setError('Falsches Passwort');
      }
    } catch {
      // Backend not available — client-side fallback
      if (password === FALLBACK_PASSWORD) {
        sessionStorage.setItem('proudig-preview', 'true');
        onUnlock();
        return;
      }
      setError('Falsches Passwort');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <div className="coming-soon-logo">
          <span className="coming-soon-logo-text">Prou<span>Dig</span></span>
          <span className="coming-soon-logo-dot">.</span>
        </div>

        <h1 className="coming-soon-title">Coming Soon</h1>
        <p className="coming-soon-desc">
          Wir arbeiten an etwas Großem. Unsere neue Website wird bald verfügbar sein.
        </p>
        <p className="coming-soon-sub">
          Prozesse und Digitalisierung — strategisch, maßgeschneidert, innovativ.
        </p>

        {!showLogin ? (
          <button className="coming-soon-btn" onClick={() => setShowLogin(true)}>
            Vorschau anzeigen
          </button>
        ) : (
          <form className="coming-soon-form" onSubmit={handleSubmit}>
            <div className="coming-soon-input-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                className="coming-soon-input"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className="coming-soon-eye"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            <button type="submit" className="coming-soon-submit" disabled={loading}>
              {loading ? '...' : 'Zugang'}
            </button>
            {error && <p className="coming-soon-error">{error}</p>}
          </form>
        )}
      </div>

      <div className="coming-soon-footer">
        <p>&copy; 2026 ProuDig GmbH</p>
      </div>
    </div>
  );
};
