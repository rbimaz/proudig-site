import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/api';

const STATUS_LABELS = {
  DRAFT: 'Entwurf',
  PUBLISHED: 'Veröffentlicht',
  ARCHIVED: 'Archiviert',
  HIDDEN: 'Ausgeblendet'
};
const statusLabel = (s) => STATUS_LABELS[s] || s || '';
const statusClass = (s) => (s || '').toLowerCase();

export const NewsList = () => {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, [authFetch]);

  const fetchPosts = async () => {
    try {
      const res = await authFetch('/api/admin/pages?category=NEWS');
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Wirklich löschen?')) return;
    setDeleting(id);
    try {
      const res = await authFetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
      }
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await authFetch(`/api/admin/pages/${id}/publish`, { method: 'PUT' });
      if (res.ok) fetchPosts();
    } catch (err) {
      console.error('Fehler beim Veröffentlichen:', err);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="admin-list-page">
      <div className="list-header">
        <h1><i className="bi bi-newspaper"></i> News-Verwaltung</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/cms/news/new')}>
          <i className="bi bi-plus-lg"></i> Neuer Beitrag
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Datum</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">Keine News vorhanden</td>
              </tr>
            ) : (
              posts.map(post => (
                <tr key={post.id}>
                  <td className="title">{post.title}</td>
                  <td className="slug">{post.slug}</td>
                  <td>
                    <span className={`status-badge ${statusClass(post.status)}`}>
                      {statusLabel(post.status)}
                    </span>
                  </td>
                  <td>{formatDate(post.createdAt)}</td>
                  <td className="actions">
                    <button className="btn-sm" onClick={() => navigate(`/admin/cms/news/${post.id}`)}>
                      <i className="bi bi-pencil"></i> Bearbeiten
                    </button>
                    {post.status !== 'PUBLISHED' && (
                      <button className="btn-sm" onClick={() => handlePublish(post.id)}>
                        <i className="bi bi-check-circle"></i> Veröffentlichen
                      </button>
                    )}
                    <button
                      className="btn-sm danger"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                    >
                      <i className="bi bi-trash"></i> {deleting === post.id ? 'Wird gelöscht...' : 'Löschen'}
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
