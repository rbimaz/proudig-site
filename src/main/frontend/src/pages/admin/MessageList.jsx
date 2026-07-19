import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateTime } from '../../utils/api';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const MessageList = () => {
  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [authFetch, showUnreadOnly]);

  const fetchMessages = async () => {
    try {
      const url = showUnreadOnly
        ? '/api/admin/messages?unreadOnly=true'
        : '/api/admin/messages';
      const res = await authFetch(url);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(messages.map(m => m.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await authFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(messages.filter(m => m.id !== id));
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setDeleting(true);
    try {
      const res = await authFetch('/api/admin/messages/delete-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedIds)
      });
      if (res.ok) {
        setMessages(messages.filter(m => !selectedIds.includes(m.id)));
        setSelectedIds([]);
      }
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const truncateMessage = (text, maxLength = 60) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  if (loading) return <div className="loading">Laden...</div>;

  return (
    <div className="admin-list-page">
      <div className="list-header">
        <h1>
          <i className="bi bi-envelope-fill"></i> Kontaktanfragen
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount} neu</span>
          )}
        </h1>
        <div className="list-actions">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showUnreadOnly}
              onChange={(e) => setShowUnreadOnly(e.target.checked)}
            />
            Nur ungelesene
          </label>
          {selectedIds.length > 0 && (
            <button
              className="btn-danger"
              onClick={() => setDeleteConfirm({ type: 'batch', count: selectedIds.length })}
              disabled={deleting}
            >
              <i className="bi bi-trash"></i> {selectedIds.length} löschen
            </button>
          )}
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table messages-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedIds.length === messages.length && messages.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="status-col"></th>
              <th>Datum</th>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Unternehmen</th>
              <th>Nachricht</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  {showUnreadOnly ? 'Keine ungelesenen Nachrichten' : 'Keine Nachrichten vorhanden'}
                </td>
              </tr>
            ) : (
              messages.map(msg => (
                <tr
                  key={msg.id}
                  className={msg.isRead ? '' : 'unread'}
                  onClick={() => navigate(`/admin/cms/nachrichten/${msg.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="checkbox-col" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(msg.id)}
                      onChange={() => handleSelect(msg.id)}
                    />
                  </td>
                  <td className="status-col">
                    {!msg.isRead && <span className="unread-dot" title="Ungelesen"></span>}
                  </td>
                  <td className="date">{formatDateTime(msg.createdAt)}</td>
                  <td className="name">{msg.firstName} {msg.lastName}</td>
                  <td className="email">{msg.email}</td>
                  <td className="company">{msg.company || '-'}</td>
                  <td className="message-preview">{truncateMessage(msg.message)}</td>
                  <td className="actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn-sm danger"
                      onClick={() => setDeleteConfirm({ type: 'single', id: msg.id })}
                      disabled={deleting}
                      title="Löschen"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirm && (
        <ConfirmDialog
          title={deleteConfirm.type === 'batch'
            ? `${deleteConfirm.count} Nachrichten löschen?`
            : 'Nachricht löschen?'}
          message="Diese Aktion kann nicht rückgängig gemacht werden."
          confirmLabel="Löschen"
          onConfirm={() => deleteConfirm.type === 'batch'
            ? handleDeleteSelected()
            : handleDelete(deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
          loading={deleting}
        />
      )}
    </div>
  );
};
