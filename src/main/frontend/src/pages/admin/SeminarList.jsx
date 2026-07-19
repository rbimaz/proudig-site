import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatDate } from '../../utils/api';

export const SeminarList = () => {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchSeminars();
  }, [authFetch]);

  const fetchSeminars = async () => {
    try {
      const res = await authFetch('/api/admin/pages?category=SEMINAR');
      if (res.ok) {
        const data = await res.json();
        setSeminars(data);
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
        setSeminars(seminars.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await authFetch(`/api/admin/pages/${id}/publish`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchSeminars();
      }
    } catch (err) {
      console.error('Fehler beim Veröffentlichen:', err);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="admin-list-page">
      <div className="list-header">
        <h1>Seminar-Verwaltung</h1>
        <button className="btn-primary" onClick={() => navigate('/admin/seminare/new')}>
          + Neues Seminar
        </button>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Datum</th>
              <th>Ort</th>
              <th>Status</th>
              <th>Teilnehmer</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {seminars.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">Keine Seminare vorhanden</td>
              </tr>
            ) : (
              seminars.map(seminar => (
                <tr key={seminar.id}>
                  <td className="title">{seminar.title}</td>
                  <td>{formatDate(seminar.date)}</td>
                  <td>{seminar.location}</td>
                  <td>
                    <span className={`status-badge ${seminar.status}`}>
                      {seminar.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                    </span>
                  </td>
                  <td>{seminar.maxParticipants || '-'}</td>
                  <td className="actions">
                    <button className="btn-sm" onClick={() => navigate(`/admin/seminare/${seminar.id}`)}>
                      Bearbeiten
                    </button>
                    {seminar.status !== 'published' && (
                      <button className="btn-sm" onClick={() => handlePublish(seminar.id)}>
                        Veröffentlichen
                      </button>
                    )}
                    <button
                      className="btn-sm danger"
                      onClick={() => handleDelete(seminar.id)}
                      disabled={deleting === seminar.id}
                    >
                      {deleting === seminar.id ? 'Wird gelöscht...' : 'Löschen'}
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
