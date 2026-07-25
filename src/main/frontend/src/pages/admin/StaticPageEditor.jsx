import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../../contexts/AuthContext';
import { slugify } from '../../utils/api';
import { MediaPicker } from './MediaPicker';

export const StaticPageEditor = () => {
  const { authFetch } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await authFetch(`/api/admin/pages/${id}`);
      if (res.ok) {
        const page = await res.json();
        setTitle(page.title || '');
        setSlug(page.slug || '');
        setContent(page.content || '');
        setStatus(page.status || 'draft');
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val) => {
    setTitle(val);
    if (isNew) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const method = isNew ? 'POST' : 'PUT';
      const url = isNew ? '/api/admin/pages' : `/api/admin/pages/${id}`;
      const body = { title, slug, category: 'STATIC', content };

      const res = await authFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const result = await res.json();
        setStatus(result.status || 'draft');
        setMessage('Entwurf gespeichert');
        if (isNew) {
          navigate(`/admin/cms/seiten/${result.id}`, { replace: true });
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
      if (isNew) {
        const saveRes = await authFetch('/api/admin/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, slug, category: 'STATIC', content })
        });
        if (!saveRes.ok) throw new Error('Speichern fehlgeschlagen');
        const saved = await saveRes.json();

        const pubRes = await authFetch(`/api/admin/pages/${saved.id}/publish`, { method: 'PUT' });
        if (pubRes.ok) {
          setMessage('Veroeffentlicht');
          setStatus('published');
          navigate(`/admin/cms/seiten/${saved.id}`, { replace: true });
        } else {
          setMessage('Fehler beim Veroeffentlichen');
        }
      } else {
        await authFetch(`/api/admin/pages/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, slug, category: 'STATIC', content })
        });

        const res = await authFetch(`/api/admin/pages/${id}/publish`, { method: 'PUT' });
        if (res.ok) {
          setMessage('Veroeffentlicht');
          setStatus('published');
          fetchData();
        } else {
          setMessage('Fehler beim Veroeffentlichen');
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

  return (
    <div className="static-page-editor">
      <div className="editor-header">
        <h1>{isNew ? 'Neue Seite' : 'Seite bearbeiten'}</h1>
        <div className="editor-header-right">
          {!isNew && (
            <span className={`status-badge ${status}`}>
              {status === 'published' ? 'Veroeffentlicht' : 'Entwurf'}
            </span>
          )}
        </div>
      </div>

      {/* Title & Slug */}
      <div className="static-editor-meta">
        <div className="form-group">
          <label>Seitentitel</label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="z.B. Impressum, Leistungen, Datenschutz"
          />
        </div>
        <div className="form-group">
          <label>Slug (URL-Pfad)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="z.B. impressum"
          />
        </div>
      </div>

      {/* Content (Markdown) */}
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
              setContent(prev => `${prev || ''}\n![${item.name || ''}](/api/media/${mediaId})\n`)
            }
            buttonLabel="+ Bild aus Mediathek"
          />
        </div>
        {!previewMode ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Markdown-Inhalt"
            rows={18}
            className="markdown-editor"
          />
        ) : (
          <div className="preview-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      {message && (
        <div className={`message ${message.includes('Fehler') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => navigate('/admin/cms/seiten')}
        >
          Zurueck
        </button>
        <button type="button" onClick={handleSave} disabled={saving} className="btn-secondary">
          {saving ? 'Speichert...' : 'Entwurf speichern'}
        </button>
        <button type="button" onClick={handlePublish} disabled={saving} className="btn-primary">
          {saving ? 'Wird veroeffentlicht...' : 'Veroeffentlichen'}
        </button>
      </div>
    </div>
  );
};
