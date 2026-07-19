import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export const ProzessEditor = () => {
  const { authFetch } = useAuth();
  const [data, setData] = useState({
    label: '',
    title: '',
    steps: [],
    cta: { title: '', description: '', buttonText: '' }
  });
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch('/api/admin/content/PROZESS');
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

  const handleStepChange = (idx, field, value) => {
    const updated = [...data.steps];
    updated[idx] = { ...updated[idx], [field]: value };
    setData(prev => ({ ...prev, steps: updated }));
  };

  const handleCtaChange = (field, value) => {
    setData(prev => ({
      ...prev,
      cta: { ...prev.cta, [field]: value }
    }));
  };

  const addStep = () => {
    const newNumber = (data.steps.length + 1);
    setData(prev => ({
      ...prev,
      steps: [...prev.steps, { number: newNumber, title: '', description: '' }]
    }));
  };

  const removeStep = (idx) => {
    setData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/admin/content/PROZESS', {
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
      const res = await authFetch('/api/admin/content/PROZESS/publish', {
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
        <h1>Prozess bearbeiten</h1>
        <span className={`status-badge ${status}`}>{status === 'published' ? 'Veröffentlicht' : 'Entwurf'}</span>
      </div>

      <form className="editor-form">
        <div className="form-group">
          <label>Label</label>
          <input
            type="text"
            value={data.label}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="z.B. Unser Prozess"
          />
        </div>

        <div className="form-group">
          <label>Titel</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Prozess Titel"
          />
        </div>

        <div className="form-section">
          <div className="admin-section-header">
            <h3>Prozess-Schritte</h3>
            <button type="button" onClick={addStep} className="btn-sm">+ Schritt hinzufügen</button>
          </div>

          {data.steps.map((step, idx) => (
            <div key={idx} className="step-item">
              <div className="form-group">
                <label>Schritt-Nummer</label>
                <input
                  type="number"
                  value={step.number}
                  onChange={(e) => handleStepChange(idx, 'number', parseInt(e.target.value))}
                  placeholder="1"
                />
              </div>
              <div className="form-group">
                <label>Titel</label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(idx, 'title', e.target.value)}
                  placeholder="Schritt-Titel"
                />
              </div>
              <div className="form-group">
                <label>Beschreibung</label>
                <textarea
                  value={step.description}
                  onChange={(e) => handleStepChange(idx, 'description', e.target.value)}
                  placeholder="Schritt-Beschreibung"
                  rows={3}
                />
              </div>
              <button type="button" onClick={() => removeStep(idx)} className="btn-danger">
                Entfernen
              </button>
            </div>
          ))}
        </div>

        <div className="form-section">
          <h3>Call-to-Action</h3>
          <div className="form-group">
            <label>CTA-Titel</label>
            <input
              type="text"
              value={data.cta.title}
              onChange={(e) => handleCtaChange('title', e.target.value)}
              placeholder="CTA Titel"
            />
          </div>
          <div className="form-group">
            <label>CTA-Beschreibung</label>
            <textarea
              value={data.cta.description}
              onChange={(e) => handleCtaChange('description', e.target.value)}
              placeholder="CTA Beschreibung"
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Button-Text</label>
            <input
              type="text"
              value={data.cta.buttonText}
              onChange={(e) => handleCtaChange('buttonText', e.target.value)}
              placeholder="Button-Text"
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
