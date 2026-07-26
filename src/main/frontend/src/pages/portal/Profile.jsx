import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const roleLabelOf = (roles) =>
  roles?.includes('ADMIN') ? 'Admin' : roles?.includes('CONSULTANT') ? 'Consultant' : 'Customer';

export const Profile = () => {
  const { authFetch, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', company: '' });
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [savingPw, setSavingPw] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setForm({ firstName: data.firstName || '', lastName: data.lastName || '', company: data.company || '' });
        } else {
          setProfileMsg({ type: 'error', text: 'Profil konnte nicht geladen werden.' });
        }
      } catch {
        setProfileMsg({ type: 'error', text: 'Profil konnte nicht geladen werden.' });
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setProfileMsg({ type: 'error', text: 'Vor- und Nachname dürfen nicht leer sein.' });
      return;
    }
    setSavingProfile(true);
    try {
      const res = await authFetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setForm({ firstName: data.firstName || '', lastName: data.lastName || '', company: data.company || '' });
        updateUser({ firstName: data.firstName, lastName: data.lastName });
        setProfileMsg({ type: 'success', text: 'Profil gespeichert.' });
      } else {
        const err = await res.json().catch(() => ({}));
        setProfileMsg({ type: 'error', text: err.message || 'Speichern fehlgeschlagen.' });
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Speichern fehlgeschlagen.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.next.length < 3) {
      setPwMsg({ type: 'error', text: 'Das neue Passwort muss mindestens 3 Zeichen lang sein.' });
      return;
    }
    if (pw.next !== pw.confirm) {
      setPwMsg({ type: 'error', text: 'Die Passwörter stimmen nicht überein.' });
      return;
    }
    if (pw.current === pw.next) {
      setPwMsg({ type: 'error', text: 'Das neue Passwort muss sich vom aktuellen unterscheiden.' });
      return;
    }
    setSavingPw(true);
    try {
      const res = await authFetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: pw.current, newPassword: pw.next })
      });
      if (res.ok) {
        setPw({ current: '', next: '', confirm: '' });
        setPwMsg({ type: 'success', text: 'Passwort geändert.' });
      } else {
        const err = await res.json().catch(() => ({}));
        setPwMsg({ type: 'error', text: err.message || 'Passwort konnte nicht geändert werden.' });
      }
    } catch {
      setPwMsg({ type: 'error', text: 'Passwort konnte nicht geändert werden.' });
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="admin-list-page">
      <div className="list-header">
        <h1><i className="bi bi-person-circle"></i> Profil</h1>
      </div>

      <form className="editor-form" style={{ maxWidth: '640px' }} onSubmit={saveProfile}>
        <div className="form-section">
          <h3>Persönliche Daten</h3>
          <div className="form-group">
            <label>Vorname</label>
            <input value={form.firstName} onChange={(e) => setForm(f => ({ ...f, firstName: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Nachname</label>
            <input value={form.lastName} onChange={(e) => setForm(f => ({ ...f, lastName: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Firma</label>
            <input value={form.company} onChange={(e) => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Optional" />
          </div>
          <div className="form-group">
            <label>E-Mail</label>
            <input value={profile?.email || ''} readOnly disabled />
            <small className="form-hint">Die E-Mail ist Ihr Anmeldename und kann hier nicht geändert werden.</small>
          </div>
          <div className="form-group">
            <label>Rolle</label>
            <input value={roleLabelOf(profile?.roles)} readOnly disabled />
          </div>
        </div>

        {profileMsg && <div className={`message ${profileMsg.type}`}>{profileMsg.text}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Speichert...' : 'Speichern'}
          </button>
        </div>
      </form>

      <form className="editor-form" style={{ maxWidth: '640px', marginTop: '1.5rem' }} onSubmit={changePassword}>
        <div className="form-section">
          <h3><i className="bi bi-shield-lock"></i> Sicherheit — Passwort ändern</h3>
          <div className="form-group">
            <label>Aktuelles Passwort</label>
            <input type="password" value={pw.current} autoComplete="current-password"
              onChange={(e) => setPw(p => ({ ...p, current: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Neues Passwort</label>
            <input type="password" value={pw.next} autoComplete="new-password" minLength={3}
              onChange={(e) => setPw(p => ({ ...p, next: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Neues Passwort bestätigen</label>
            <input type="password" value={pw.confirm} autoComplete="new-password" minLength={3}
              onChange={(e) => setPw(p => ({ ...p, confirm: e.target.value }))} />
          </div>
        </div>

        {pwMsg && <div className={`message ${pwMsg.type}`}>{pwMsg.text}</div>}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={savingPw}>
            {savingPw ? 'Ändert...' : 'Passwort ändern'}
          </button>
        </div>
      </form>
    </div>
  );
};
