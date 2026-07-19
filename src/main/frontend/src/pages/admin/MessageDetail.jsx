import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateTime } from '../../utils/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const MessageDetail = () => {
  const { id } = useParams();
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMessage();
  }, [id, authFetch]);

  const fetchMessage = async () => {
    try {
      const res = await authFetch(`/api/admin/messages/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMessage(data);

        // Automatisch als gelesen markieren
        if (!data.isRead) {
          await authFetch(`/api/admin/messages/${id}/read`, { method: 'PUT' });
          setMessage(prev => ({ ...prev, isRead: true }));
        }
      } else {
        setError('Nachricht nicht gefunden');
      }
    } catch (err) {
      setError('Fehler beim Laden der Nachricht');
      console.error('Fehler:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async () => {
    const endpoint = message.isRead
      ? `/api/admin/messages/${id}/unread`
      : `/api/admin/messages/${id}/read`;

    try {
      const res = await authFetch(endpoint, { method: 'PUT' });
      if (res.ok) {
        setMessage(prev => ({ ...prev, isRead: !prev.isRead }));
      }
    } catch (err) {
      console.error('Fehler:', err);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        navigate('/admin/cms/nachrichten');
      }
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) return <div className="loading">Laden...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!message) return null;

  return (
    <div className="admin-detail-page message-detail">
      <div className="detail-header">
        <button className="btn-back" onClick={() => navigate('/admin/cms/nachrichten')}>
          <i className="bi bi-arrow-left"></i> Zurück
        </button>
        <div className="detail-actions">
          <button className="btn-secondary" onClick={handleToggleRead}>
            <i className={`bi ${message.isRead ? 'bi-envelope' : 'bi-envelope-open'}`}></i>
            {message.isRead ? 'Als ungelesen markieren' : 'Als gelesen markieren'}
          </button>
          <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>
            <i className="bi bi-trash"></i> Löschen
          </button>
        </div>
      </div>

      <div className="message-card">
        <div className="message-meta">
          <div className="meta-row">
            <span className="meta-label">Von:</span>
            <span className="meta-value">{message.firstName} {message.lastName}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">E-Mail:</span>
            <a href={`mailto:${message.email}`} className="meta-value email-link">
              {message.email}
              <i className="bi bi-box-arrow-up-right"></i>
            </a>
          </div>
          {message.company && (
            <div className="meta-row">
              <span className="meta-label">Unternehmen:</span>
              <span className="meta-value">{message.company}</span>
            </div>
          )}
          <div className="meta-row">
            <span className="meta-label">Eingegangen:</span>
            <span className="meta-value">{formatDateTime(message.createdAt)}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">Status:</span>
            <span className={`status-badge ${message.isRead ? 'read' : 'unread'}`}>
              {message.isRead ? 'Gelesen' : 'Ungelesen'}
            </span>
          </div>
        </div>

        <div className="message-divider"></div>

        <div className="message-body">
          <h3>Nachricht</h3>
          <div className="message-content">
            {message.message.split('\n').map((line, i) => (
              <p key={i}>{line || '\u00A0'}</p>
            ))}
          </div>
        </div>

        <div className="message-actions">
          <a
            href={`mailto:${message.email}?subject=Re: Ihre Kontaktanfrage bei ProuDig`}
            className="btn-primary"
          >
            <i className="bi bi-reply"></i> Antworten
          </a>
        </div>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Nachricht löschen?"
          message="Diese Aktion kann nicht rückgängig gemacht werden."
          confirmLabel="Löschen"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          loading={deleting}
        />
      )}
    </div>
  );
};
