import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export const TeamEditor = () => {
  const { authFetch } = useAuth();
  const [data, setData] = useState({
    badge: '',
    title: '',
    description: '',
    members: []
  });
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await authFetch('/api/admin/content/TEAM');
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

  const handleMemberChange = (idx, field, value) => {
    const updated = [...data.members];
    updated[idx] = { ...updated[idx], [field]: value };
    setData(prev => ({ ...prev, members: updated }));
  };

  const addMember = () => {
    setData(prev => ({
      ...prev,
      members: [...prev.members, { name: '', title: '', fokus: '', imageId: '' }]
    }));
  };

  const removeMember = (idx) => {
    setData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== idx)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await authFetch('/api/admin/content/TEAM', {
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
      const res = await authFetch('/api/admin/content/TEAM/publish', {
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
        <h1>Team bearbeiten</h1>
        <span className={`status-badge ${status}`}>{status === 'published' ? 'Veröffentlicht' : 'Entwurf'}</span>
      </div>

      <form className="editor-form">
        <div className="form-group">
          <label>Badge</label>
          <input
            type="text"
            value={data.badge}
            onChange={(e) => handleChange('badge', e.target.value)}
            placeholder="z.B. Unser Team"
          />
        </div>

        <div className="form-group">
          <label>Titel</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Team Titel"
          />
        </div>

        <div className="form-group">
          <label>Beschreibung</label>
          <textarea
            value={data.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Team Beschreibung"
            rows={4}
          />
        </div>

        <div className="form-section">
          <div className="admin-section-header">
            <h3>Team-Mitglieder</h3>
            <button type="button" onClick={addMember} className="btn-sm">+ Mitglied hinzufügen</button>
          </div>

          {data.members.map((member, idx) => (
            <div key={idx} className="member-item">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                  placeholder="Vollständiger Name"
                />
              </div>
              <div className="form-group">
                <label>Titel</label>
                <input
                  type="text"
                  value={member.title}
                  onChange={(e) => handleMemberChange(idx, 'title', e.target.value)}
                  placeholder="z.B. Geschäftsführer"
                />
              </div>
              <div className="form-group">
                <label>Fokus</label>
                <input
                  type="text"
                  value={member.fokus}
                  onChange={(e) => handleMemberChange(idx, 'fokus', e.target.value)}
                  placeholder="Fachbereich oder Spezialgebiet"
                />
              </div>
              <div className="form-group">
                <label>Bild-ID (Mediathek)</label>
                <input
                  type="text"
                  value={member.imageId}
                  onChange={(e) => handleMemberChange(idx, 'imageId', e.target.value)}
                  placeholder="media-id-123"
                />
              </div>
              <button type="button" onClick={() => removeMember(idx)} className="btn-danger">
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
