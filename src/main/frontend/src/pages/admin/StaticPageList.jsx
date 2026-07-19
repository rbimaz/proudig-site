import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/api';

export const StaticPageList = () => {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchPages();
  }, [authFetch]);

  const fetchPages = async () => {
    try {
      const res = await authFetch('/api/admin/pages?category=STATIC');
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Wirklich loeschen?')) return;
    setDeleting(id);
    try {
      const res = await authFetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPages(pages.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Fehler beim Loeschen:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await authFetch(`/api/admin/pages/${id}/publish`, {
        method: 'PUT'
      });
      if (res.ok) {
        fetchPages();
      }
    } catch (err) {
      console.error('Fehler beim Veroeffentlichen:', err);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="admin-list-page">
      <div className="list-header">
        <h1><i className="bi bi-file-earmark-richtext"></i> Seiten-Verwaltung</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/cms/seiten/new')}>
          <i className="bi bi-plus-lg"></i> Neue Seite
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Zuletzt bearbeitet</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">Keine Seiten vorhanden</td>
              </tr>
            ) : (
              pages.map(page => (
                <tr key={page.id}>
                  <td className="title">{page.title}</td>
                  <td className="slug">{page.slug}</td>
                  <td>
                    <span className={`status-badge ${page.status}`}>
                      {page.status === 'published' ? 'Veroeffentlicht' : 'Entwurf'}
                    </span>
                  </td>
                  <td>{formatDate(page.updatedAt || page.createdAt)}</td>
                  <td className="actions">
                    <button className="btn-sm" onClick={() => navigate(`/admin/cms/seiten/${page.id}`)}>
                      <i className="bi bi-pencil"></i> Bearbeiten
                    </button>
                    {page.status !== 'published' && (
                      <button className="btn-sm" onClick={() => handlePublish(page.id)}>
                        <i className="bi bi-check-circle"></i> Veroeffentlichen
                      </button>
                    )}
                    <button
                      className="btn-sm danger"
                      onClick={() => handleDelete(page.id)}
                      disabled={deleting === page.id}
                    >
                      {deleting === page.id ? 'Wird geloescht...' : 'Loeschen'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
