import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export const ImpressumEditor = () => {
  const { authFetch } = useAuth();
  const [data, setData] = useState({
    company: '',
    address: { street: '', zip: '', city: '' },
    contact: { phone: '', email: '' },
    register: { court: '', number: '' },
    directors: [],
    vatId: ''
  });
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch('/api/admin/content/IMPRESSUM');
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

  const handleAddressChange = (field, value) => {
    setData(prev => ({
      ...prev,
      address: { ...prev.address, [field]: value }
    }));
  };

  const handleContactChange = (field, value) => {
    setData(prev => ({
      ...prev,
      contact: { ...prev.contact, [field]: value }
    }));
  };

  const handleRegisterChange = (field, value) => {
    setData(prev => ({
      ...prev,
      register: { ...prev.register, [field]: value }
    }));
  };

  const handleDirectorChange = (idx, value) => {
    const updated = [...data.directors];
    updated[idx] = value;
    setData(prev => ({ ...prev, directors: updated }));
  };

  const addDirector = () => {
    setData(prev => ({
      ...prev,
      directors: [...prev.directors, '']
    }));
  };

  const removeDirector = (idx) => {
    setData(prev => ({
      ...prev,
      directors: prev.directors.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/admin/content/IMPRESSUM', {
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
      const res = await authFetch('/api/admin/content/IMPRESSUM/publish', {
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
        <h1>Impressum bearbeiten</h1>
        <span className={`status-badge ${status}`}>{status === 'published' ? 'Veröffentlicht' : 'Entwurf'}</span>
      </div>

      <form className="editor-form">
        <div className="form-group">
          <label>Unternehmensname</label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => handleChange('company', e.target.value)}
            placeholder="ProuDig GmbH"
          />
        </div>

        <div className="form-section">
          <h3>Adresse</h3>
          <div className="form-group">
            <label>Straße und Hausnummer</label>
            <input
              type="text"
              value={data.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="Mustergasse 1"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>PLZ</label>
              <input
                type="text"
                value={data.address.zip}
                onChange={(e) => handleAddressChange('zip', e.target.value)}
                placeholder="12345"
              />
            </div>
            <div className="form-group">
              <label>Stadt</label>
              <input
                type="text"
                value={data.address.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="Berlin"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Kontaktinformation</h3>
          <div className="form-group">
            <label>Telefon</label>
            <input
              type="tel"
              value={data.contact.phone}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              placeholder="+49 30 123456"
            />
          </div>
          <div className="form-group">
            <label>E-Mail</label>
            <input
              type="email"
              value={data.contact.email}
              onChange={(e) => handleContactChange('email', e.target.value)}
              placeholder="info@proudig.de"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Handelsregister</h3>
          <div className="form-group">
            <label>Registergericht</label>
            <input
              type="text"
              value={data.register.court}
              onChange={(e) => handleRegisterChange('court', e.target.value)}
              placeholder="Amtsgericht Berlin"
            />
          </div>
          <div className="form-group">
            <label>Registernummer</label>
            <input
              type="text"
              value={data.register.number}
              onChange={(e) => handleRegisterChange('number', e.target.value)}
              placeholder="HRB 123456"
            />
          </div>
        </div>

        <div className="form-group">
          <label>USt-IdNr.</label>
          <input
            type="text"
            value={data.vatId}
            onChange={(e) => handleChange('vatId', e.target.value)}
            placeholder="DE123456789"
          />
        </div>

        <div className="form-section">
          <div className="admin-section-header">
            <h3>Geschäftsführer</h3>
            <button type="button" onClick={addDirector} className="btn-sm">+ Geschäftsführer hinzufügen</button>
          </div>

          {data.directors.map((director, idx) => (
            <div key={idx} className="director-item">
              <input
                type="text"
                value={director}
                onChange={(e) => handleDirectorChange(idx, e.target.value)}
                placeholder="Name des Geschäftsführers"
              />
              <button type="button" onClick={() => removeDirector(idx)} className="btn-danger">
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
