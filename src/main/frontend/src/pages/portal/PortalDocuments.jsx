import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useFolderTree } from '../../contexts/FolderTreeContext';
import { ActionButton, ActionButtonGroup } from '../../components/ActionButton';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ShareLinkDialog } from './ShareLinkDialog';
import { InternalShareDialog } from './InternalShareDialog';
import { FolderShareDialog } from './FolderShareDialog';
import { GroupsDialog } from './GroupsDialog';

/**
 * Portal "Meine Dokumente" - Option 4 (Toolbar-geführt, kompakt)
 *
 * Design-Prinzipien:
 * 1. Eine Gutter-Achse (40px) für alle Blöcke
 * 2. Kompakte Toolbar (Breadcrumb links, Aktionen rechts)
 * 3. Unified List (Ordner + Dateien in einer Tabelle)
 * 4. Einheitliches Action-Button-System
 */
export const PortalDocuments = () => {
  const { authFetch, user } = useAuth();
  const isStaff = !!user?.roles?.some(r => r === 'ADMIN' || r === 'CONSULTANT');
  const isAdmin = !!user?.roles?.includes('ADMIN');
  const { currentFolderId, setCurrentFolderId, folderPath, setFolderPath, triggerRefresh } = useFolderTree();
  const [folders, setFolders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [shareTarget, setShareTarget] = useState(null);
  const [internalShareTarget, setInternalShareTarget] = useState(null);
  const [folderShareTarget, setFolderShareTarget] = useState(null);
  const [groupsOpen, setGroupsOpen] = useState(false);
  const [updateDocId, setUpdateDocId] = useState(null);
  const [conflict, setConflict] = useState(null);
  // Schreibrecht im aktuellen Ordner: Stammverzeichnis = eigener Bereich; sonst aus dem Ordner-DTO.
  const currentCanWrite = folderPath.length === 0 ? true : (folderPath[folderPath.length - 1]?.canWrite ?? true);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null,
    danger: false
  });
  const fileInputRef = useRef(null);
  const updateInputRef = useRef(null);

  useEffect(() => {
    fetchContent();
  }, [currentFolderId, authFetch]);

  const fetchContent = async () => {
    setLoading(true);
    setError('');
    try {
      const foldersUrl = currentFolderId
        ? `/api/folders/${currentFolderId}/children`
        : '/api/folders';
      const docsUrl = currentFolderId
        ? `/api/documents/folder/${currentFolderId}`
        : '/api/documents';

      const [foldersRes, docsRes] = await Promise.all([
        authFetch(foldersUrl),
        authFetch(docsUrl)
      ]);

      if (foldersRes.ok) setFolders(await foldersRes.json());
      else setFolders([]);
      if (docsRes.ok) setDocuments(await docsRes.json());
      else setDocuments([]);

      // "Mit mir geteilt" nur auf Stammebene laden (geteilte Docs liegen flach).
      if (!currentFolderId) {
        const sharedRes = await authFetch('/api/documents/shared-with-me');
        setSharedWithMe(sharedRes.ok ? await sharedRes.json() : []);
      } else {
        setSharedWithMe([]);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
      setError('Fehler beim Laden der Inhalte');
    } finally {
      setLoading(false);
    }
  };

  const askConflict = (file, existing) =>
    new Promise((resolve) => setConflict({ file, existing, resolve }));

  const dedupName = (name, taken) => {
    if (!taken.has(name)) return name;
    const dot = name.lastIndexOf('.');
    const base = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : '';
    let i = 2;
    while (taken.has(`${base} (${i})${ext}`)) i++;
    return `${base} (${i})${ext}`;
  };

  const uploadOne = async (file, nameOverride) => {
    const formData = new FormData();
    formData.append('file', file, nameOverride || file.name);
    if (currentFolderId) formData.append('folderId', currentFolderId);
    const res = await authFetch('/api/documents', { method: 'POST', body: formData });
    if (res.ok) {
      const newDoc = await res.json();
      setDocuments(prev => [newDoc, ...prev]);
      triggerRefresh();
    } else if (res.status === 403) {
      setError('Keine Berechtigung zum Hochladen in diesem Ordner');
    } else {
      setError('Fehler beim Hochladen: ' + file.name);
    }
  };

  const replaceContent = async (existing, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await authFetch(`/api/documents/${existing.id}/content`, { method: 'PUT', body: formData });
    if (res.ok) {
      const updated = await res.json();
      setDocuments(prev => prev.map(d => d.id === updated.id ? updated : d));
    } else if (res.status === 403) {
      setError('Keine Berechtigung zum Aktualisieren dieser Datei');
    } else {
      setError('Aktualisieren fehlgeschlagen: ' + file.name);
    }
  };

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    if (!currentCanWrite) { setError('Keine Berechtigung zum Hochladen in diesem Ordner'); return; }
    setUploading(true);
    setError('');
    const taken = new Set(documents.map(d => d.fileName));
    for (const file of Array.from(files)) {
      try {
        const existing = documents.find(d => d.fileName === file.name);
        if (existing) {
          const choice = await askConflict(file, existing);
          if (choice === 'cancel') continue;
          if (choice === 'replace') { await replaceContent(existing, file); continue; }
          // 'keep': mit entschärftem Namen hochladen
          const newName = dedupName(file.name, taken);
          taken.add(newName);
          await uploadOne(file, newName);
        } else {
          taken.add(file.name);
          await uploadOne(file);
        }
      } catch (err) {
        console.error('Fehler beim Hochladen:', err);
        setError('Fehler beim Hochladen: ' + err.message);
      }
    }
    setUploading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCreateFolder = async () => {
    const name = prompt('Ordnername:');
    if (!name) return;

    try {
      const res = await authFetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentFolderId: currentFolderId })
      });
      if (res.ok) {
        const newFolder = await res.json();
        setFolders(prev => [newFolder, ...prev]);
        triggerRefresh();
      } else {
        setError('Fehler beim Erstellen des Ordners');
      }
    } catch (err) {
      console.error('Fehler beim Erstellen:', err);
      setError('Fehler beim Erstellen: ' + err.message);
    }
  };

  const handleRenameFolder = async (folder) => {
    const newName = prompt('Neuer Ordnername:', folder.name);
    if (!newName || newName === folder.name) return;

    try {
      const res = await authFetch(`/api/folders/${folder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      if (res.ok) {
        const updatedFolder = await res.json();
        setFolders(prev => prev.map(f => f.id === folder.id ? updatedFolder : f));
        triggerRefresh();
      } else if (res.status === 403) {
        setError('Keine Berechtigung zum Umbenennen');
      } else {
        setError('Fehler beim Umbenennen des Ordners');
      }
    } catch (err) {
      console.error('Fehler beim Umbenennen:', err);
      setError('Fehler beim Umbenennen: ' + err.message);
    }
  };

  const handleDeleteFolder = (folder) => {
    let message = `Ordner "${folder.name}" wirklich löschen?`;
    if (folder.documentCount > 0 || folder.childFolderCount > 0) {
      const parts = [];
      if (folder.documentCount > 0) {
        parts.push(`${folder.documentCount} Datei${folder.documentCount > 1 ? 'en' : ''}`);
      }
      if (folder.childFolderCount > 0) {
        parts.push(`${folder.childFolderCount} Unterordner`);
      }
      message = `Ordner "${folder.name}" enthält ${parts.join(' und ')}.\n\nAlle Inhalte werden unwiderruflich gelöscht!`;
    }

    setConfirmDialog({
      open: true,
      title: 'Ordner löschen',
      message,
      danger: true,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        try {
          const res = await authFetch(`/api/folders/${folder.id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            setFolders(prev => prev.filter(f => f.id !== folder.id));
            triggerRefresh();
          } else if (res.status === 403) {
            setError('Keine Berechtigung zum Löschen');
          } else {
            setError('Fehler beim Löschen des Ordners');
          }
        } catch (err) {
          console.error('Fehler beim Löschen:', err);
          setError('Fehler beim Löschen: ' + err.message);
        }
      }
    });
  };

  const handleDeleteDocument = (doc) => {
    setConfirmDialog({
      open: true,
      title: 'Datei löschen',
      message: `Datei "${doc.fileName}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`,
      danger: true,
      onConfirm: async () => {
        setConfirmDialog(prev => ({ ...prev, open: false }));
        try {
          const res = await authFetch(`/api/documents/${doc.id}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            setDocuments(prev => prev.filter(d => d.id !== doc.id));
            triggerRefresh();
          } else if (res.status === 403) {
            setError('Keine Berechtigung zum Löschen');
          } else if (res.status === 404) {
            setError('Datei nicht gefunden');
          } else {
            setError('Fehler beim Löschen der Datei');
          }
        } catch (err) {
          console.error('Fehler beim Löschen:', err);
          setError('Fehler beim Löschen: ' + err.message);
        }
      }
    });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  const handleDownload = async (doc) => {
    setError('');
    try {
      const res = await authFetch(`/api/documents/${doc.id}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        const status = res.status;
        if (status === 403) {
          setError('Kein Zugriff auf diese Datei');
        } else if (status === 404) {
          setError('Datei nicht gefunden');
        } else {
          setError('Download fehlgeschlagen');
        }
      }
    } catch (err) {
      console.error('Fehler beim Download:', err);
      setError('Download fehlgeschlagen: ' + err.message);
    }
  };

  const handleUpdateContentClick = (doc) => {
    setUpdateDocId(doc.id);
    updateInputRef.current?.click();
  };

  const handleUpdateContentFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !updateDocId) { setUpdateDocId(null); return; }
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await authFetch(`/api/documents/${updateDocId}/content`, { method: 'PUT', body: formData });
      if (res.ok) {
        const updated = await res.json();
        setDocuments(prev => prev.map(d => d.id === updated.id ? updated : d));
      } else if (res.status === 403) {
        setError('Keine Berechtigung zum Aktualisieren dieser Datei');
      } else {
        setError('Aktualisieren fehlgeschlagen');
      }
    } catch (err) {
      setError('Aktualisieren fehlgeschlagen: ' + err.message);
    } finally {
      setUpdateDocId(null);
    }
  };

  const handleOpenFolder = (folder) => {
    setFolderPath(prev => [...prev, { id: folder.id, name: folder.name, canWrite: folder.canWrite }]);
    setCurrentFolderId(folder.id);
  };

  const handleNavigateBack = (index) => {
    if (index < 0) {
      setFolderPath([]);
      setCurrentFolderId(null);
    } else {
      const newPath = folderPath.slice(0, index + 1);
      setFolderPath(newPath);
      setCurrentFolderId(newPath[newPath.length - 1].id);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const formatFolderSize = (folder) => {
    const count = (folder.documentCount || 0) + (folder.childFolderCount || 0);
    return count === 1 ? '1 Element' : `${count} Elemente`;
  };

  // Unified rows: folders first, then files
  const unifiedRows = [
    ...folders.map(f => ({ type: 'folder', data: f })),
    ...documents.map(d => ({ type: 'file', data: d }))
  ];

  return (
    <div className="portal-documents-v2">
      {/* Hidden file input for upload button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleUpload(e.target.files)}
        style={{ display: 'none' }}
      />
      {/* Hidden input for replacing a file's content */}
      <input
        ref={updateInputRef}
        type="file"
        onChange={handleUpdateContentFile}
        style={{ display: 'none' }}
      />

      {/* Title Block - Gutter */}
      <div className="pd-title-block">
        <span className="pd-title-icon"><i className="bi bi-folder-fill"></i></span>
        <h1>Meine Dokumente</h1>
      </div>

      {/* Toolbar Block - Gutter */}
      <div className="pd-toolbar-block">
        <div className="pd-toolbar">
          {/* Breadcrumb left */}
          <div className="pd-breadcrumb">
            <button
              className={`pd-breadcrumb-item ${folderPath.length === 0 ? 'active' : ''}`}
              onClick={() => handleNavigateBack(-1)}
            >
              <i className="bi bi-house-fill"></i>
              <span>Stammverzeichnis</span>
            </button>
            {folderPath.map((item, idx) => (
              <React.Fragment key={item.id}>
                <i className="bi bi-chevron-right pd-breadcrumb-sep"></i>
                <button
                  className={`pd-breadcrumb-item ${idx === folderPath.length - 1 ? 'active' : ''}`}
                  onClick={() => handleNavigateBack(idx)}
                >
                  {item.name}
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Actions right */}
          <div className="pd-toolbar-actions">
            {isAdmin && (
              <button className="pd-btn-secondary" onClick={() => setGroupsOpen(true)}>
                <i className="bi bi-people"></i> Gruppen
              </button>
            )}
            {currentCanWrite && (
              <>
                <button className="pd-btn-secondary" onClick={handleUploadClick} disabled={uploading}>
                  <i className="bi bi-upload"></i> Hochladen
                </button>
                <button className="pd-btn-primary" onClick={handleCreateFolder}>
                  <i className="bi bi-plus-lg"></i> Neuer Ordner
                </button>
              </>
            )}
            {!currentCanWrite && (
              <span className="pd-readonly-hint" style={{ color: '#888', fontSize: '0.9rem' }}>
                <i className="bi bi-eye"></i> Nur Lesezugriff
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="pd-gutter">
          <div className="pd-error">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        </div>
      )}

      {/* Loading state */}
      {(loading || uploading) && (
        <div className="pd-gutter">
          <div className="pd-loading">
            <i className="bi bi-arrow-repeat spin"></i>
            {uploading ? ' Wird hochgeladen...' : ' Laden...'}
          </div>
        </div>
      )}

      {/* Unified List Block - Gutter */}
      {!loading && (
        <div className="pd-list-block">
          <div className="pd-list-card">
            {/* Header row */}
            <div className="pd-list-header">
              <span>NAME</span>
              <span className="pd-col-size">GRÖSSE</span>
              <span className="pd-col-date">HOCHGELADEN</span>
              <span className="pd-col-action">AKTION</span>
            </div>

            {/* Rows */}
            {unifiedRows.length > 0 ? (
              unifiedRows.map((row) => (
                row.type === 'folder' ? (
                  <div
                    key={`folder-${row.data.id}`}
                    className="pd-list-row pd-list-row-folder"
                    onClick={() => handleOpenFolder(row.data)}
                  >
                    <span className="pd-cell-name">
                      <span className="pd-icon-tile"><i className="bi bi-folder-fill"></i></span>
                      <span className="pd-name-text">{row.data.name}</span>
                      {row.data.shared && (
                        <span title="Intern geteilt" style={{ marginLeft: 8, color: '#e8600b' }}>
                          <i className="bi bi-people-fill"></i>
                        </span>
                      )}
                    </span>
                    <span className="pd-col-size pd-cell-meta">{formatFolderSize(row.data)}</span>
                    <span className="pd-col-date pd-cell-meta">—</span>
                    <span className="pd-col-action">
                      <ActionButtonGroup>
                        <ActionButton
                          icon="bi-box-arrow-in-right"
                          label="Öffnen"
                          onClick={(e) => { e.stopPropagation(); handleOpenFolder(row.data); }}
                        />
                        {row.data.canWrite && (
                          <ActionButton
                            icon="bi-pencil"
                            label="Umbenennen"
                            onClick={(e) => { e.stopPropagation(); handleRenameFolder(row.data); }}
                          />
                        )}
                        {isAdmin && (
                          <ActionButton
                            icon="bi-people"
                            label="Intern teilen"
                            onClick={(e) => { e.stopPropagation(); setFolderShareTarget(row.data); }}
                          />
                        )}
                        <ActionButton
                          icon="bi-link-45deg"
                          label="Extern teilen"
                          onClick={(e) => { e.stopPropagation(); setShareTarget({ type: 'FOLDER', id: row.data.id, name: row.data.name }); }}
                        />
                        {row.data.canWrite && (
                          <ActionButton
                            icon="bi-trash"
                            label="Löschen"
                            danger
                            onClick={(e) => { e.stopPropagation(); handleDeleteFolder(row.data); }}
                          />
                        )}
                      </ActionButtonGroup>
                    </span>
                  </div>
                ) : (
                  <div key={`file-${row.data.id}`} className="pd-list-row">
                    <span className="pd-cell-name">
                      <span className="pd-icon-tile pd-icon-tile-file">
                        <i className={`bi ${getFileIcon(row.data.contentType)}`}></i>
                      </span>
                      <span className="pd-name-text">{row.data.fileName}</span>
                    </span>
                    <span className="pd-col-size pd-cell-meta">{formatSize(row.data.fileSize)}</span>
                    <span className="pd-col-date pd-cell-meta">
                      {formatDate(row.data.createdAt)}
                      {isStaff && row.data.uploadedByName && (
                        <span className="pd-uploader"> · {row.data.uploadedByName}</span>
                      )}
                    </span>
                    <span className="pd-col-action">
                      <ActionButtonGroup>
                        <ActionButton
                          icon="bi-download"
                          label="Download"
                          onClick={() => handleDownload(row.data)}
                        />
                        {currentCanWrite && (
                          <ActionButton
                            icon="bi-arrow-repeat"
                            label="Aktualisieren"
                            onClick={() => handleUpdateContentClick(row.data)}
                          />
                        )}
                        <ActionButton
                          icon="bi-link-45deg"
                          label="Extern teilen"
                          onClick={() => setShareTarget({ type: 'DOCUMENT', id: row.data.id, name: row.data.fileName })}
                        />
                        {isAdmin && (
                          <ActionButton
                            icon="bi-people"
                            label="Intern teilen"
                            onClick={() => setInternalShareTarget(row.data)}
                          />
                        )}
                        {currentCanWrite && (
                          <ActionButton
                            icon="bi-trash"
                            label="Löschen"
                            danger
                            onClick={() => handleDeleteDocument(row.data)}
                          />
                        )}
                      </ActionButtonGroup>
                    </span>
                  </div>
                )
              ))
            ) : (
              <div className="pd-empty-state">
                <i className="bi bi-inbox"></i>
                <p>Noch keine Elemente</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mit mir geteilt - nur auf Stammebene und wenn vorhanden */}
      {!loading && !currentFolderId && sharedWithMe.length > 0 && (
        <div className="pd-list-block">
          <div className="pd-title-block" style={{ marginBottom: '0.5rem' }}>
            <span className="pd-title-icon"><i className="bi bi-people-fill"></i></span>
            <h1 style={{ fontSize: '1.1rem' }}>Mit mir geteilt</h1>
          </div>
          <div className="pd-list-card">
            {sharedWithMe.map((doc) => (
              <div key={`shared-${doc.id}`} className="pd-list-row">
                <span className="pd-cell-name">
                  <span className="pd-icon-tile pd-icon-tile-file">
                    <i className={`bi ${getFileIcon(doc.contentType)}`}></i>
                  </span>
                  <span className="pd-name-text">{doc.fileName}</span>
                </span>
                <span className="pd-col-size pd-cell-meta">{formatSize(doc.fileSize)}</span>
                <span className="pd-col-date pd-cell-meta">
                  {formatDate(doc.createdAt)}
                  {doc.uploadedByName && <span className="pd-uploader"> · {doc.uploadedByName}</span>}
                </span>
                <span className="pd-col-action">
                  <ActionButtonGroup>
                    <ActionButton icon="bi-download" label="Download" onClick={() => handleDownload(doc)} />
                  </ActionButtonGroup>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Drop Zone Block - Gutter (nur bei Schreibrecht) */}
      {currentCanWrite && (
        <div className="pd-gutter">
          <div
            className={`pd-dropzone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <i className="bi bi-cloud-arrow-up"></i>
            <span>Dateien hier ablegen</span>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        danger={confirmDialog.danger}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirmDialog}
      />

      {shareTarget && (
        <ShareLinkDialog target={shareTarget} onClose={() => setShareTarget(null)} />
      )}

      {internalShareTarget && (
        <InternalShareDialog doc={internalShareTarget} onClose={() => setInternalShareTarget(null)} />
      )}

      {folderShareTarget && (
        <FolderShareDialog
          folder={folderShareTarget}
          onClose={() => { setFolderShareTarget(null); fetchContent(); }}
        />
      )}

      {groupsOpen && (
        <GroupsDialog onClose={() => setGroupsOpen(false)} />
      )}

      {conflict && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}
          onClick={() => { conflict.resolve('cancel'); setConflict(null); }}
        >
          <div
            style={{ background: '#fff', borderRadius: 12, padding: '1.5rem', width: 'min(460px, 92vw)', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0 }}>Datei existiert bereits</h3>
            <p>Im aktuellen Ordner gibt es bereits <strong>„{conflict.file.name}"</strong>. Was möchtest du tun?</p>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>
              „Ersetzen" aktualisiert den Inhalt der vorhandenen Datei (auch wenn sie von jemand anderem stammt).
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '1rem' }}>
              <button className="pd-btn-secondary" onClick={() => { conflict.resolve('cancel'); setConflict(null); }}>Abbrechen</button>
              <button className="pd-btn-secondary" onClick={() => { conflict.resolve('keep'); setConflict(null); }}>Beide behalten</button>
              <button className="pd-btn-primary" onClick={() => { conflict.resolve('replace'); setConflict(null); }}>Ersetzen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getFileIcon(contentType) {
  if (!contentType) return 'bi-file-earmark';
  if (contentType.includes('pdf')) return 'bi-file-earmark-pdf-fill';
  if (contentType.includes('image')) return 'bi-file-earmark-image-fill';
  if (contentType.includes('word') || contentType.includes('document')) return 'bi-file-earmark-word-fill';
  if (contentType.includes('spreadsheet') || contentType.includes('excel')) return 'bi-file-earmark-excel-fill';
  if (contentType.includes('presentation') || contentType.includes('powerpoint')) return 'bi-file-earmark-ppt-fill';
  if (contentType.includes('zip') || contentType.includes('archive')) return 'bi-file-earmark-zip-fill';
  if (contentType.includes('text')) return 'bi-file-earmark-text-fill';
  return 'bi-file-earmark-fill';
}
