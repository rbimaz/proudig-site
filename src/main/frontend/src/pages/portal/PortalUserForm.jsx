import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ROLE_OPTIONS = [
  { value: 'USER', label: 'Benutzer' },
  { value: 'CONSULTANT', label: 'Bearbeiter' },
  { value: 'ADMIN', label: 'Administrator' },
];

const USERS_ROUTE = '/admin/portal/users';

export const PortalUserForm = () => {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const { authFetch, user: currentUser } = useAuth();

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'USER',          // Anlegen: Einzelauswahl
    roles: [],             // Bearbeiten: Mehrfachauswahl
    password: '',
    passwordConfirm: '',
    forcePasswordChange: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [adminCount, setAdminCount] = useState(0);
  const [targetEmail, setTargetEmail] = useState('');
  const [targetHasAdmin, setTargetHasAdmin] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let active = true;
    (async () => {
      try {
        const [userRes, listRes] = await Promise.all([
          authFetch(`/api/users/${id}`),
          authFetch('/api/users'),
        ]);
        if (userRes.ok && active) {
          const u = await userRes.json();
          setForm(f => ({
            ...f,
            email: u.email,
            firstName: u.firstName || '',
            lastName: u.lastName || '',
            roles: ROLE_OPTIONS.map(o => o.value).filter(v => u.roles?.includes(v)),
          }));
          setTargetEmail(u.email);
          setTargetHasAdmin(!!u.roles?.includes('ADMIN'));
        }
        if (listRes.ok && active) {
          const list = await listRes.json();
          setAdminCount(list.filter(x => x.roles?.includes('ADMIN')).length);
        }
      } catch (err) {
        if (active) setMessage('Fehler beim Laden');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [id, isNew, authFetch]);

  const toggleRole = (value) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(value)
        ? prev.roles.filter(r => r !== value)
        : [...prev.roles, value],
    }));
  };

  const isSelf = !isNew && !!targetEmail && targetEmail === currentUser?.email;
  const adminRoleLocked = !isNew && targetHasAdmin && (isSelf || adminCount <= 1);

  const initials = `${form.firstName.charAt(0)}${form.lastName.charAt(0)}`.toUpperCase();
  const previewName = `${form.firstName} ${form.lastName}`.trim();
  const passwordsMatch = form.password === form.passwordConfirm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isNew && (!form.email || !form.firstName || !form.lastName || !form.password)) {
      setMessage('Bitte alle Felder ausfüllen');
      return;
    }
    if (!isNew && (!form.firstName || !form.lastName)) {
      setMessage('Bitte Vor- und Nachname ausfüllen');
      return;
    }
    if (!isNew && form.roles.length === 0) {
      setMessage('Bitte mindestens eine Rolle wählen');
      return;
    }
    if (isNew && form.password !== form.passwordConfirm) {
      setMessage('Passwörter stimmen nicht überein');
      return;
    }
    if (!isNew && form.password && form.password !== form.passwordConfirm) {
      setMessage('Passwörter stimmen nicht überein');
      return;
    }

    setSaving(true);
    setMessage('');
    try {
      let res;
      if (isNew) {
        res = await authFetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            password: form.password,
            roles: [form.role],
            forcePasswordChange: form.forcePasswordChange,
          }),
        });
      } else {
        const payload = {
          firstName: form.firstName,
          lastName: form.lastName,
          roles: form.roles,
        };
        if (form.password) payload.password = form.password;
        res = await authFetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        navigate(USERS_ROUTE);
      } else {
        const detail = await res.text();
        setMessage(detail ? 'Fehler beim Speichern: ' + detail : 'Fehler beim Speichern');
      }
    } catch (err) {
      setMessage('Fehler: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="portal-user-form">
      <div className="user-create-dialog user-form-page">
        <div className="ucd-header">
          <div className={`ucd-avatar ${initials ? 'filled' : ''}`}>{initials || '?'}</div>
          <div className="ucd-heading">
            <h2>{isNew ? 'Neuen Benutzer erstellen' : 'Benutzer bearbeiten'}</h2>
            <p className="ucd-preview">
              {previewName ? `Vorschau: ${previewName}` : 'Name erscheint hier als Vorschau.'}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="ucd-body">
            <div className="form-group">
              <label>E-Mail {isNew && <span className="req">*</span>}</label>
              <div className="ucd-field">
                <i className="bi bi-envelope ucd-icon"></i>
                {isNew ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="user@example.com"
                    disabled={saving}
                    autoFocus
                  />
                ) : (
                  <input type="email" value={form.email} readOnly disabled />
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Vorname <span className="req">*</span></label>
              <div className="ucd-field">
                <i className="bi bi-person ucd-icon"></i>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Max"
                  disabled={saving}
                  autoFocus={!isNew}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Nachname <span className="req">*</span></label>
              <div className="ucd-field">
                <i className="bi bi-person ucd-icon"></i>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Mustermann"
                  disabled={saving}
                />
              </div>
            </div>

            {isNew ? (
              <div className="form-group">
                <label>Rolle <span className="req">*</span></label>
                <div className="ucd-field">
                  <i className="bi bi-shield ucd-icon"></i>
                  <select
                    className="ucd-select"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    disabled={saving}
                  >
                    {ROLE_OPTIONS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                  <i className="bi bi-chevron-down ucd-chevron"></i>
                </div>
              </div>
            ) : (
              <div className="form-group">
                <label>Rollen <span className="req">*</span></label>
                <div className="ucd-roles">
                  {ROLE_OPTIONS.map(({ value, label }) => (
                    <label key={value} className="ucd-checkbox">
                      <input
                        type="checkbox"
                        checked={form.roles.includes(value)}
                        onChange={() => toggleRole(value)}
                        disabled={saving || (value === 'ADMIN' && adminRoleLocked)}
                      />
                      {label}
                    </label>
                  ))}
                </div>
                {adminRoleLocked && (
                  <p className="ucd-hint">
                    {isSelf
                      ? 'Sie können sich Ihre eigene Administratorrolle nicht entziehen.'
                      : 'Die letzte Administratorrolle kann nicht entzogen werden.'}
                  </p>
                )}
              </div>
            )}

            <div className="form-group">
              <label>{isNew ? 'Passwort' : 'Neues Passwort'} {isNew && <span className="req">*</span>}</label>
              <div className="ucd-field">
                <i className="bi bi-lock ucd-icon"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={isNew ? 'Initialpasswort' : 'Leer lassen = unverändert'}
                  autoComplete="new-password"
                  disabled={saving}
                />
                <button
                  type="button"
                  className="ucd-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Passwörter verbergen' : 'Passwörter anzeigen'}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            {(isNew || form.password) && (
              <div className="form-group">
                <label>{isNew ? 'Passwort bestätigen' : 'Neues Passwort bestätigen'} {isNew && <span className="req">*</span>}</label>
                <div className="ucd-field">
                  <i className="bi bi-lock ucd-icon"></i>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.passwordConfirm}
                    onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
                    placeholder="Passwort wiederholen"
                    autoComplete="new-password"
                    disabled={saving}
                  />
                </div>
                {form.passwordConfirm && (
                  <p className={`ucd-match ${passwordsMatch ? 'ok' : 'bad'}`}>
                    <i className={`bi ${passwordsMatch ? 'bi-check-lg' : 'bi-x-lg'}`}></i>
                    {passwordsMatch ? 'Passwörter stimmen überein' : 'Passwörter stimmen nicht überein'}
                  </p>
                )}
              </div>
            )}

            {isNew && (
              <label className="ucd-checkbox">
                <input
                  type="checkbox"
                  checked={form.forcePasswordChange}
                  onChange={(e) => setForm({ ...form, forcePasswordChange: e.target.checked })}
                  disabled={saving}
                />
                Passwortänderung beim ersten Login erforderlich
              </label>
            )}
          </div>

          {message && (
            <div className={`message ${message.includes('Fehler') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}

          <div className="user-form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate(USERS_ROUTE)} disabled={saving}>
              Abbrechen
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Speichert...' : (isNew ? 'Erstellen' : 'Speichern')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
