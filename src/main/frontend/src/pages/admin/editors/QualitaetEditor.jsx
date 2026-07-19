import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export const QualitaetEditor = () => {
  const { authFetch } = useAuth();
  const [data, setData] = useState({
    badge: '',
    title: '',
    features: []
  });
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch('/api/admin/content/QUALITAET');
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

  const handleFeatureChange = (idx, field, value) => {
    const updated = [...data.features];
    updated[idx] = { ...updated[idx], [field]: value };
    setData(prev => ({ ...prev, features: updated }));
  };

  const addFeature = () => {
    setData(prev => ({
      ...prev,
      features: [...prev.features, { icon: '', title: '', description: '' }]
    }));
  };

  const removeFeature = (idx) => {
    setData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/admin/content/QUALITAET', {
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
      const res = await authFetch('/api/admin/content/QUALITAET/publish', {
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
        <h1>Qualität bearbeiten</h1>
        <span className={`status-badge ${status}`}>{status === 'published' ? 'Veröffentlicht' : 'Entwurf'}</span>
      </div>

      <form className="editor-form">
        <div className="form-group">
          <label>Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => handleChange('badge', e.target.value)}
            placeholder="z.B. Qualitätsstandards"
          />
        </div>

        <div className="form-group">
          <label>Titel</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Qualitäts-Titel"
          />
        </div>

        <div className="form-section">
          <div className="admin-section-header">
            <h3>Features</h3>
            <button type="button" onClick={addFeature} className="btn-sm">+ Feature hinzufügen</button>
          </div>

          {data.features.map((feature, idx) => (
            <div key={idx} className="feature-item">
              <div className="form-group">
                <label>Icon (Emoji oder CSS-Klasse)</label>
                <input
                  type="text"
                  value={feature.icon}
                  onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                  placeholder="z.B. ✓ oder icon-check"
                />
              </div>
              <div className="form-group">
                <label>Titel</label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                  placeholder="Feature-Titel"
                />
              </div>
              <div className="form-group">
                <label>Beschreibung</label>
                <textarea
                  value={feature.description}
                  onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                  placeholder="Feature-Beschreibung"
                  rows={3}
                />
              </div>
              <button type="button" onClick={() => removeFeature(idx)} className="btn-danger">
                Entfernen
              </button>
            </div>
          ))}
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
