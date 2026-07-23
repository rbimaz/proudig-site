import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export const HeroEditor = () => {
  const { authFetch } = useAuth();
  const [data, setData] = useState({
    newLanding: true,
    badge: '',
    title: '',
    titleAccent: '',
    description: '',
    ctaPrimary: { text: '', link: '' },
    ctaSecondary: { text: '', link: '' }
  });
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch('/api/admin/content/HERO');
        if (res.ok) {
          const content = await res.json();
          setData(JSON.parse(content.content || '{}'));
          setStatus(content.status || 'draft');
        }
      } catch (err) {
        console.error('Fehler beim Laden:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authFetch]);

  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleCtaChange = (ctaType, field, value) => {
    setData(prev => ({
      ...prev,
      [ctaType]: { ...prev[ctaType], [field]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/admin/content/HERO', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setStatus('draft');
        setMessage('Entwurf gespeichert');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Fehler beim Speichern');
      }
    } catch (err) {
      setMessage('Fehler: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/admin/content/HERO/publish', {
        method: 'POST'
      });
      if (res.ok) {
        setStatus('published');
        setMessage('Veröffentlicht');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Fehler beim Veröffentlichen');
      }
    } catch (err) {
      setMessage('Fehler: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h1>Hero-Sektion bearbeiten</h1>
        <span className={`status-badge ${status}`}>{status === 'published' ? 'Veröffentlicht' : 'Entwurf'}</span>
      </div>

      <form className="editor-form">
        <div className="form-section">
          <h3>Landing-Variante</h3>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={data.newLanding !== false}
                onChange={(e) => handleChange('newLanding', e.target.checked)}
                style={{ width: 'auto' }}
              />
              Neue Landing (Kugel / News-Box) aktivieren
            </label>
            <p className="field-hint" style={{ margin: '0.4rem 0 0', color: '#718096', fontSize: '0.85rem' }}>
              Aus = alte Landing mit Prozess-Bild. Änderung wirkt nach „Veröffentlichen".
            </p>
          </div>
        </div>

        <div className="form-group">
          <label>Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => handleChange('badge', e.target.value)}
            placeholder="z.B. Digitale Transformation"
          />
        </div>

        <div className="form-group">
          <label>Titel</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Haupttitel"
          />
        </div>

        <div className="form-group">
          <label>Titel (Akzent)</label>
          <input
            type="text"
            value={data.titleAccent}
            onChange={(e) => handleChange('titleAccent', e.target.value)}
            placeholder="Hervorgehobener Teil des Titels"
          />
        </div>

        <div className="form-group">
          <label>Beschreibung</label>
          <textarea
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Beschreibung"
            rows={4}
          />
        </div>

        <div className="form-section">
          <h3>Primärer CTA</h3>
          <div className="form-group">
            <label>Text</label>
            <input
              type="text"
              value={data.ctaPrimary.text}
              onChange={(e) => handleCtaChange('ctaPrimary', 'text', e.target.value)}
              placeholder="Schaltflächen-Text"
            />
          </div>
          <div className="form-group">
            <label>Link</label>
            <input
              type="text"
              value={data.ctaPrimary.link}
              onChange={(e) => handleCtaChange('ctaPrimary', 'link', e.target.value)}
              placeholder="/kontakt"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Sekundärer CTA</h3>
          <div className="form-group">
            <label>Text</label>
            <input
              type="text"
              value={data.ctaSecondary.text}
              onChange={(e) => handleCtaChange('ctaSecondary', 'text', e.target.value)}
              placeholder="Schaltflächen-Text"
            />
          </div>
          <div className="form-group">
            <label>Link</label>
            <input
              type="text"
              value={data.ctaSecondary.link}
              onChange={(e) => handleCtaChange('ctaSecondary', 'link', e.target.value)}
              placeholder="/info"
            />
          </div>
        </div>

        {message && <div className={`message ${message.includes('Fehler') ? 'error' : 'success'}`}>{message}</div>}

        <div className="form-actions">
          <button type="button" onClick={handleSave} disabled={saving} className="btn-secondary">
            {saving ? 'Speichert...' : 'Entwurf speichern'}
          </button>
          <button type="button" onClick={handlePublish} disabled={saving} className="btn-primary">
            {saving ? 'Wird veröffentlicht...' : 'Veröffentlichen'}
          </button>
        </div>
      </form>
    </div>
  );
};
