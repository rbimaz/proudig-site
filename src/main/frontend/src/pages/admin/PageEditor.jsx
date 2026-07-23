import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { slugify } from '../../utils/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MediaPicker } from './MediaPicker';

// Duration-String (30d/12h/45m/30s) <-> Zahl + Einheit
const parseDuration = (s) => {
  const m = /^(\d+)([dhms])$/.exec((s || '').trim());
  return m ? { num: m[1], unit: m[2] } : { num: '', unit: 'd' };
};
const composeDuration = (num, unit) => (num && Number(num) > 0 ? `${parseInt(num, 10)}${unit}` : '');

export const PageEditor = ({ category }) => {
  const { authFetch } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const routeSegment = { BLOG: 'blog', SEMINAR: 'seminare', NEWS: 'news' }[category] || category.toLowerCase();

  const [data, setData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImageId: '',
    tags: '',
    status: 'draft',
    showInHero: false,
    autoArchiveAfter: '',
    ...(category === 'SEMINAR' && {
      date: '',
      endDate: '',
      time: '',
      location: '',
      format: 'online',
      duration: '',
      maxParticipants: '',
      price: '',
      registrationLink: '',
      registrationDeadline: '',
      targetAudience: '',
      prerequisites: ''
    })
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchData();
    }
  }, [id]);

  // Neue News: Auto-Archiv-Feld mit dem konfigurierten Default vorbelegen (falls Leserechte vorhanden)
  useEffect(() => {
    if (isNew && category === 'NEWS') {
      (async () => {
        try {
          const res = await authFetch('/api/admin/settings');
          if (res.ok) {
            const s = await res.json();
            if (s.defaultArchiveAfter) {
              setData(prev => ({ ...prev, autoArchiveAfter: s.defaultArchiveAfter }));
            }
          }
        } catch {
          // z.B. 403 für CONSULTANT — Feld bleibt leer
        }
      })();
    }
  }, [isNew, category]);

  const fetchData = async () => {
    try {
      const res = await authFetch(`/api/admin/pages/${id}`);
      if (res.ok) {
        const page = await res.json();
        // tags kommt als Array vom Backend, das Eingabefeld arbeitet mit kommagetrenntem String
        setData({ ...page, tags: Array.isArray(page.tags) ? page.tags.join(', ') : (page.tags || '') });
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'title') {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  // Payload fürs Backend: tags als Array (List<String>), nicht als String
  const toPayload = () => ({
    ...data,
    category,
    coverImageId: data.coverImageId || null,
    tags: typeof data.tags === 'string'
      ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
      : (Array.isArray(data.tags) ? data.tags : [])
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/admin/pages' : `/api/admin/pages/${id}`;

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload())
      });

      if (res.ok) {
        const result = await res.json();
        setMessage('Entwurf gespeichert');
        if (isNew) {
          navigate(`/admin/cms/${routeSegment}/${result.id}`);
        }
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
      const url = isNew ? '/api/admin/pages' : `/api/admin/pages/${id}/publish`;
      const method = isNew ? 'POST' : 'POST';

      if (isNew) {
        // First save as draft
        const saveRes = await authFetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toPayload())
        });
        if (!saveRes.ok) throw new Error('Speichern fehlgeschlagen');
        const saved = await saveRes.json();

        // Then publish
        const pubRes = await authFetch(`/api/admin/pages/${saved.id}/publish`, {
          method: 'PUT'
        });
        if (pubRes.ok) {
          setMessage('Veröffentlicht');
          navigate(`/admin/cms/${routeSegment}/${saved.id}`);
        } else {
          setMessage('Fehler beim Veröffentlichen');
        }
      } else {
        const res = await authFetch(`/api/admin/pages/${id}/publish`, { method: 'PUT' });
        if (res.ok) {
          setMessage('Veröffentlicht');
          fetchData();
        } else {
          setMessage('Fehler beim Veröffentlichen');
        }
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Fehler: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  const isSeminar = category === 'SEMINAR';

  return (
    <div className="page-editor">
      <div className="editor-header">
        <h1>{isNew ? 'Neue Seite' : 'Bearbeiten'} ({category})</h1>
        {!isNew && (
          <span className={`status-badge ${data.status}`}>
            {data.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
          </span>
        )}
      </div>

      <div className="editor-layout">
        <div className="editor-left">
          <form className="editor-form">
            <div className="form-group">
              <label>Titel</label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Seiten-Titel"
              />
            </div>

            <div className="form-group">
              <label>Slug</label>
              <input
                type="text"
                value={data.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="url-slug"
              />
            </div>

            <div className="form-group">
              <label>Zusammenfassung</label>
              <textarea
                value={data.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Kurze Zusammenfassung"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Titelbild (Mediathek)</label>
              <MediaPicker
                value={data.coverImageId}
                onChange={(id) => handleChange('coverImageId', id)}
              />
            </div>

            <div className="form-group">
              <label>Tags (Komma getrennt)</label>
              <input
                type="text"
                value={data.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            {category === 'NEWS' && (
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={!!data.showInHero}
                    onChange={(e) => handleChange('showInHero', e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  Im Hero anzeigen
                </label>
              </div>
            )}

            {category === 'NEWS' && (
              <div className="form-group">
                <label>Automatisch archivieren nach</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="number"
                    min="1"
                    value={parseDuration(data.autoArchiveAfter).num}
                    onChange={(e) => handleChange('autoArchiveAfter', composeDuration(e.target.value, parseDuration(data.autoArchiveAfter).unit))}
                    placeholder="z.B. 30"
                    style={{ maxWidth: '120px' }}
                  />
                  <select
                    value={parseDuration(data.autoArchiveAfter).unit}
                    onChange={(e) => handleChange('autoArchiveAfter', composeDuration(parseDuration(data.autoArchiveAfter).num, e.target.value))}
                  >
                    <option value="d">Tage</option>
                    <option value="h">Stunden</option>
                    <option value="m">Minuten</option>
                    <option value="s">Sekunden</option>
                  </select>
                </div>
                <small className="form-hint">Leer = kein automatisches Archivieren. Danach bleibt die News per Direktlink erreichbar.</small>
              </div>
            )}

            {isSeminar && (
              <>
                <div className="form-section">
                  <h3>Seminar-Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Startdatum</label>
                      <input
                        type="date"
                        value={data.date}
                        onChange={(e) => handleChange('date', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Enddatum</label>
                      <input
                        type="date"
                        value={data.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Uhrzeit</label>
                    <input
                      type="time"
                      value={data.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Ort</label>
                    <input
                      type="text"
                      value={data.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      placeholder="Berlin oder Online"
                    />
                  </div>

                  <div className="form-group">
                    <label>Format</label>
                    <select value={data.format} onChange={(e) => handleChange('format', e.target.value)}>
                      <option value="online">Online</option>
                      <option value="inperson">Präsenz</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Dauer</label>
                      <input
                        type="text"
                        value={data.duration}
                        onChange={(e) => handleChange('duration', e.target.value)}
                        placeholder="z.B. 2 Tage"
                      />
                    </div>
                    <div className="form-group">
                      <label>Max. Teilnehmer</label>
                      <input
                        type="number"
                        value={data.maxParticipants}
                        onChange={(e) => handleChange('maxParticipants', e.target.value)}
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Preis (EUR)</label>
                    <input
                      type="number"
                      value={data.price}
                      onChange={(e) => handleChange('price', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Anmeldungslink</label>
                    <input
                      type="url"
                      value={data.registrationLink}
                      onChange={(e) => handleChange('registrationLink', e.target.value)}
                      placeholder="https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Anmeldungsfrist</label>
                    <input
                      type="date"
                      value={data.registrationDeadline}
                      onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Zielgruppe</label>
                    <textarea
                      value={data.targetAudience}
                      onChange={(e) => handleChange('targetAudience', e.target.value)}
                      placeholder="Wer sollte teilnehmen?"
                      rows={3}
                    />
                  </div>

                  <div className="form-group">
                    <label>Voraussetzungen</label>
                    <textarea
                      value={data.prerequisites}
                      onChange={(e) => handleChange('prerequisites', e.target.value)}
                      placeholder="Welche Vorkenntnisse sind nötig?"
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label>Inhalt (Markdown)</label>
              <div className="markdown-tabs">
                <button
                  type="button"
                  className={`tab ${!previewMode ? 'active' : ''}`}
                  onClick={() => setPreviewMode(false)}
                >
                  Bearbeiten
                </button>
                <button
                  type="button"
                  className={`tab ${previewMode ? 'active' : ''}`}
                  onClick={() => setPreviewMode(true)}
                >
                  Vorschau
                </button>
                <MediaPicker
                  onInsert={(mediaId, item) =>
                    handleChange('content', `${data.content || ''}\n![${item.name || ''}](/api/media/${mediaId})\n`)
                  }
                />
              </div>
              {!previewMode && (
                <textarea
                  value={data.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Markdown-Inhalt"
                  rows={12}
                  className="markdown-editor"
                />
              )}
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

        {previewMode && (
          <div className="editor-preview">
            <h2>Vorschau</h2>
            <div className="preview-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {data.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
