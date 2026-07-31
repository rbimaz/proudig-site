import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { authFetch, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 3) {
      setError('Das neue Passwort muss mindestens 3 Zeichen lang sein.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (currentPassword === newPassword) {
      setError('Das neue Passwort muss sich vom aktuellen unterscheiden.');
      return;
    }

    setLoading(true);
    try {
      const res = await authFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Passwort konnte nicht geändert werden');
      }

      const email = user?.email;
      setSuccess(true);
      setTimeout(async () => {
        await logout();
        navigate('/admin/login', { state: { email } });
      }, 3000);
    } catch (err) {
      setError(err.message || 'Fehler beim Ändern des Passworts');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="portal-login-page">
        <div className="portal-login-container">
          <div className="portal-login-box" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#FFF4EC', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 1.5rem'
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E8731A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', color: '#1a1a2e' }}>
              Passwort erfolgreich geändert
            </h2>
            <p style={{ color: '#64748b', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
              Sie werden in wenigen Sekunden zur Anmeldung weitergeleitet.
            </p>
            <div style={{
              width: '100%', height: 4, background: '#e2e8f0',
              borderRadius: 2, overflow: 'hidden'
            }}>
              <div style={{
                height: '100%', background: '#E8731A', borderRadius: 2,
                animation: 'shrink 3s linear forwards'
              }} />
            </div>
            <style>{`@keyframes shrink { from { width: 100%; } to { width: 0%; } }`}</style>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="portal-login-page">
      <div className="portal-login-container">
        <div className="portal-login-box">
          <div className="portal-login-header">
            <h1>Passwort ändern</h1>
            <p>Bitte vergeben Sie ein neues Passwort für Ihr Konto.</p>
          </div>
          <form onSubmit={handleSubmit} className="portal-login-form">
            <PasswordField
              id="currentPassword" label="Aktuelles Passwort"
              value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading} placeholder="••••••••"
            />
            <PasswordField
              id="newPassword" label="Neues Passwort"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading} placeholder="Mind. 3 Zeichen" minLength={3}
            />
            <PasswordField
              id="confirmPassword" label="Neues Passwort bestätigen"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading} placeholder="Passwort wiederholen" minLength={3}
            />
            {error && <div className="form-error">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Wird geändert...' : 'Passwort ändern'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Passwortfeld mit eigenem Sichtbarkeits-Toggle (unabhängig je Feld).
function PasswordField({ id, label, value, onChange, placeholder, disabled, minLength }) {
  const [show, setShow] = useState(false);
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required
          disabled={disabled}
          placeholder={placeholder}
          minLength={minLength}
          style={{ paddingRight: '2.5rem', width: '100%' }}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Passwort verbergen' : 'Passwort anzeigen'}
          style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.25rem', lineHeight: 1 }}
        >
          <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`}></i>
        </button>
      </div>
    </div>
  );
}
