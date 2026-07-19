import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { slugify } from '../../utils/api';

const CSS_REFERENCE = [
  {
    group: 'Sektionen',
    classes: [
      { cls: 'section', desc: 'Hauptcontainer fuer eine Sektion' },
      { cls: 'section.alt-bg', desc: 'Sektion mit alternativer Hintergrundfarbe' },
      { cls: 'section-header', desc: 'Container fuer Sektions-Kopfzeile (Tag + Titel + Untertitel)' },
      { cls: 'section-tag', desc: 'Orangene Kategorie-Bezeichnung ueber dem Titel' },
      { cls: 'section-title', desc: 'Sektions-Hauptueberschrift (h2)' },
      { cls: 'section-subtitle', desc: 'Beschreibungstext unter dem Titel' },
    ]
  },
  {
    group: 'Layout',
    classes: [
      { cls: 'container', desc: 'Zentrierter Container mit max-width' },
      { cls: 'grid', desc: 'CSS Grid Layout' },
      { cls: 'grid-2', desc: 'Zweispalten-Grid' },
      { cls: 'grid-3', desc: 'Dreispalten-Grid' },
      { cls: 'card', desc: 'Karte mit Schatten und Rundungen' },
    ]
  },
  {
    group: 'Typographie',
    classes: [
      { cls: 'text-accent', desc: 'Orange Akzentfarbe' },
      { cls: 'text-muted', desc: 'Abgeschwaechte Textfarbe' },
      { cls: 'text-center', desc: 'Zentrierter Text' },
      { cls: 'text-left', desc: 'Linksbuendiger Text' },
    ]
  },
  {
    group: 'Buttons',
    classes: [
      { cls: 'btn-primary', desc: 'Primaerer Button (orange)' },
      { cls: 'btn-secondary', desc: 'Sekundaerer Button (outline)' },
    ]
  },
  {
    group: 'Spezial',
    classes: [
      { cls: 'hero', desc: 'Hero-Bereich der Startseite' },
      { cls: 'process-label', desc: 'Orange Schrittbeschriftung' },
      { cls: 'stat-number', desc: 'Grosse Statistik-Zahl' },
      { cls: 'stat-label', desc: 'Beschriftung unter Statistik' },
    ]
  }
];

const HTML_TEMPLATE = `<section class="section">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">SEITENNAME</span>
      <h2 class="section-title">Seitentitel</h2>
      <p class="section-subtitle">Kurze Beschreibung dieser Seite.</p>
    </div>

    <div class="content-area">
      <p>Hier kommt der Seiteninhalt...</p>
    </div>
  </div>
</section>`;

export const StaticPageEditor = () => {
  const { authFetch } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const previewRef = useRef(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState(HTML_TEMPLATE);
  const [status, setStatus] = useState('draft');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showReference, setShowReference] = useState(false);
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'split'

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
      const body = {
        title,
        slug,
        category: 'STATIC',
        content,
      };

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
        // Save first, then publish
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

  const insertSnippet = (html) => {
    setContent(prev => prev + '\n' + html);
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

      {/* Toolbar */}
      <div className="static-editor-toolbar">
        <div className="tab-group">
          <button
            className={`tab ${activeTab === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            HTML-Editor
          </button>
          <button
            className={`tab ${activeTab === 'split' ? 'active' : ''}`}
            onClick={() => setActiveTab('split')}
          >
            Split-Ansicht
          </button>
          <button
            className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Vorschau
          </button>
        </div>
        <button
          className={`btn-sm ${showReference ? 'active' : ''}`}
          onClick={() => setShowReference(!showReference)}
        >
          CSS-Klassen Referenz
        </button>
      </div>

      <div className="static-editor-body">
        {/* CSS Reference Sidebar */}
        {showReference && (
          <aside className="css-reference-panel">
            <h3>CSS-Klassen Referenz</h3>
            {CSS_REFERENCE.map(group => (
              <div key={group.group} className="ref-group">
                <h4>{group.group}</h4>
                {group.classes.map(item => (
                  <div key={item.cls} className="ref-item" onClick={() => navigator.clipboard?.writeText(item.cls)}>
                    <code>.{item.cls}</code>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            ))}

            <div className="ref-group">
              <h4>Vorlagen</h4>
              <button className="btn-sm" onClick={() => insertSnippet(`<section class="section">\n  <div class="container">\n    <div class="section-header">\n      <span class="section-tag">TAG</span>\n      <h2 class="section-title">Titel</h2>\n      <p class="section-subtitle">Beschreibung</p>\n    </div>\n    <p>Inhalt...</p>\n  </div>\n</section>`)}>
                + Sektion
              </button>
              <button className="btn-sm" onClick={() => insertSnippet(`<div class="grid grid-2">\n  <div class="card">\n    <h3>Karte 1</h3>\n    <p>Inhalt</p>\n  </div>\n  <div class="card">\n    <h3>Karte 2</h3>\n    <p>Inhalt</p>\n  </div>\n</div>`)}>
                + 2-Spalten Grid
              </button>
              <button className="btn-sm" onClick={() => insertSnippet(`<div class="grid grid-3">\n  <div class="card">\n    <h3>Karte 1</h3>\n    <p>Inhalt</p>\n  </div>\n  <div class="card">\n    <h3>Karte 2</h3>\n    <p>Inhalt</p>\n  </div>\n  <div class="card">\n    <h3>Karte 3</h3>\n    <p>Inhalt</p>\n  </div>\n</div>`)}>
                + 3-Spalten Grid
              </button>
            </div>
          </aside>
        )}

        {/* Editor / Preview Area */}
        <div className={`static-editor-main ${activeTab === 'split' ? 'split-mode' : ''}`}>
          {(activeTab === 'editor' || activeTab === 'split') && (
            <div className="html-editor-wrap">
              <textarea
                className="html-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="HTML-Inhalt eingeben..."
                spellCheck={false}
              />
            </div>
          )}
          {(activeTab === 'preview' || activeTab === 'split') && (
            <div className="html-preview-wrap">
              <div className="html-preview-label">Vorschau</div>
              <div
                ref={previewRef}
                className="html-preview-content"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          )}
        </div>
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
