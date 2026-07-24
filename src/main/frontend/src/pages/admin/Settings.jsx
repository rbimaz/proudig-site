import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Duration-String (30d/12h/45m/30s) <-> Zahl + Einheit
const parseDuration = (s) => {
  const m = /^(\d+)([dhms])$/.exec((s || '').trim());
  return m ? { num: m[1], unit: m[2] } : { num: '', unit: 'd' };
};
const composeDuration = (num, unit) => (num && Number(num) > 0 ? `${parseInt(num, 10)}${unit}` : '');

const DurationField = ({ value, onChange }) => {
  const parsed = parseDuration(value);
  return (
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <input
        type="number"
        min="1"
        value={parsed.num}
        onChange={(e) => onChange(composeDuration(e.target.value, parsed.unit))}
        placeholder="z.B. 90"
        style={{ maxWidth: '120px' }}
      />
      <select value={parsed.unit} onChange={(e) => onChange(composeDuration(parsed.num, e.target.value))}>
        <option value="d">Tage</option>
        <option value="h">Stunden</option>
        <option value="m">Minuten</option>
        <option value="s">Sekunden</option>
      </select>
    </div>
  );
};

export const Settings = () => {
  const { authFetch } = useAuth();
  const [settings, setSettings] = useState({ defaultArchiveAfter: '', archiveRetention: '90d', lifecycleCron: '0 0 * * * *' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/admin/settings');
        if (res.ok) setSettings(await res.json());
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [authFetch]);

  const update = (field, value) => setSettings(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        setSettings(await res.json());
        setMessage('Einstellungen gespeichert');
      } else {
        const text = await res.text();
        setMessage('Fehler: ' + (text || res.status));
      }
    } catch (err) {
      setMessage('Fehler: ' + err.message);
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const runLifecycleNow = async () => {
    setRunning(true);
    setMessage('');
    try {
      const res = await authFetch('/api/admin/pages/run-lifecycle', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setMessage(`Lebenszyklus ausgeführt: ${data.transitions} Übergänge`);
      } else {
        const text = await res.text();
        setMessage('Fehler: ' + (text || res.status));
      }
    } catch (err) {
      setMessage('Fehler: ' + err.message);
    } finally {
      setRunning(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="admin-list-page">
      <div className="list-header">
        <h1><i className="bi bi-gear-fill"></i> Einstellungen</h1>
      </div>

      <form className="editor-form" style={{ maxWidth: '640px' }}>
        <div className="form-section">
          <h3>News-Lebenszyklus</h3>

          <div className="form-group">
            <label>Standard-Frist bis zur Archivierung (neue News)</label>
            <DurationField value={settings.defaultArchiveAfter} onChange={(v) => update('defaultArchiveAfter', v)} />
            <small className="form-hint">Vorbelegung im News-Editor. Leer = keine Vorbelegung.</small>
          </div>

          <div className="form-group">
            <label>Aufbewahrungsdauer im Archiv (bis Ausblenden)</label>
            <DurationField value={settings.archiveRetention} onChange={(v) => update('archiveRetention', v)} />
            <small className="form-hint">Nach dieser Zeit ab Archivierung wird die News endgültig ausgeblendet (Direktlink 404).</small>
          </div>

          <div className="form-group">
            <label>Lebenszyklus-Zeitplan (Cron)</label>
            <input
              type="text"
              value={settings.lifecycleCron}
              onChange={(e) => update('lifecycleCron', e.target.value)}
              placeholder="0 0 * * * *"
            />
            <small className="form-hint">Spring-Cron (Sek Min Std Tag Monat Wochentag). Wirkt ohne Neustart.</small>
          </div>
        </div>

        {message && <div className={`message ${message.includes('Fehler') ? 'error' : 'success'}`}>{message}</div>}

        <div className="form-actions">
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? 'Speichert...' : 'Speichern'}
          </button>
          <button type="button" onClick={runLifecycleNow} disabled={running} className="btn-secondary">
            <i className="bi bi-arrow-repeat"></i> {running ? 'Läuft...' : 'Jetzt ausführen'}
          </button>
        </div>
        <small className="form-hint">
          „Jetzt ausführen" stößt den Lebenszyklus (Archivieren/Ausblenden) sofort an — sonst läuft er gemäß Cron-Zeitplan.
        </small>
      </form>
    </div>
  );
};
