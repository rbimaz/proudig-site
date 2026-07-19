import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFolderTree } from '../contexts/FolderTreeContext';

const TreeNode = ({ folder, depth, authFetch, currentFolderId, onNavigate, refreshCounter }) => {
  const [expanded, setExpanded] = useState(false);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(refreshCounter);

  const isActive = currentFolderId === folder.id;

  const loadChildren = async () => {
    if (!folder.hasChildren) return;
    setLoading(true);
    try {
      const res = await authFetch(`/api/folders/${folder.id}/children`);
      if (res.ok) {
        setChildren(await res.json());
      }
    } catch (err) {
      console.error('Fehler beim Laden der Unterordner:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reload children when refreshCounter changes and node is expanded
  useEffect(() => {
    if (refreshCounter !== lastRefresh) {
      setLastRefresh(refreshCounter);
      if (expanded) {
        loadChildren();
      }
    }
  }, [refreshCounter]);

  const toggleExpand = async (e) => {
    e.stopPropagation();
    if (!expanded && folder.hasChildren) {
      await loadChildren();
    }
    setExpanded(!expanded);
  };

  const handleClick = () => {
    onNavigate(folder);
  };

  return (
    <>
      <button
        className={`tree-node tree-depth-${Math.min(depth, 4)} ${isActive ? 'active-folder' : ''}`}
        onClick={handleClick}
        title={folder.name}
      >
        {depth > 0 && <span className="tree-guide" />}
        <span
          className={`tree-chevron ${expanded ? 'open' : ''} ${!folder.hasChildren ? 'invisible' : ''}`}
          onClick={folder.hasChildren ? toggleExpand : undefined}
        >
          {loading
            ? <i className="bi bi-arrow-repeat spin" />
            : <i className="bi bi-chevron-right" />
          }
        </span>
        <span className="tree-icon">
          <i className={`bi ${folder.documentCount > 0 || folder.hasChildren ? 'bi-folder-fill' : 'bi-folder'}`} />
        </span>
        <span className="tree-name">{folder.name}</span>
        <span className={`tree-badge ${folder.documentCount > 0 ? 'has-files' : 'empty'}`}>
          {folder.documentCount}
        </span>
      </button>

      {expanded && children.map(child => (
        <TreeNode
          key={child.id}
          folder={child}
          depth={depth + 1}
          authFetch={authFetch}
          currentFolderId={currentFolderId}
          onNavigate={onNavigate}
          refreshCounter={refreshCounter}
        />
      ))}
    </>
  );
};

export const FolderTree = () => {
  const { authFetch } = useAuth();
  const { currentFolderId, folderPath, setFolderPath, setCurrentFolderId, refreshCounter } = useFolderTree();
  const [rootFolders, setRootFolders] = useState([]);
  const [rootDocCount, setRootDocCount] = useState(0);
  const [collapsed, setCollapsed] = useState(false);

  const fetchRootData = useCallback(async () => {
    try {
      const [foldersRes, docsRes] = await Promise.all([
        authFetch('/api/folders'),
        authFetch('/api/documents')
      ]);
      if (foldersRes.ok) setRootFolders(await foldersRes.json());
      if (docsRes.ok) {
        const docs = await docsRes.json();
        setRootDocCount(docs.length);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Ordnerstruktur:', err);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchRootData();
  }, [fetchRootData, refreshCounter]);

  const handleNavigateToFolder = (folder) => {
    const existingIdx = folderPath.findIndex(p => p.id === folder.id);
    if (existingIdx >= 0) {
      const newPath = folderPath.slice(0, existingIdx + 1);
      setFolderPath(newPath);
    } else {
      setFolderPath(prev => [...prev, { id: folder.id, name: folder.name }]);
    }
    setCurrentFolderId(folder.id);
  };

  const handleNavigateToRoot = () => {
    setFolderPath([]);
    setCurrentFolderId(null);
  };

  return (
    <div className="sidebar-tree-section">
      <div className="tree-label">
        <span>Ordnerstruktur</span>
        <button className="tree-collapse" onClick={() => setCollapsed(!collapsed)}>
          <i className={`bi ${collapsed ? 'bi-plus-lg' : 'bi-dash-lg'}`} />
        </button>
      </div>

      {!collapsed && (
        <div className="tree-nodes">
          {/* Root / Stammverzeichnis */}
          <button
            className={`tree-node tree-depth-0 ${currentFolderId === null ? 'active-folder' : ''}`}
            onClick={handleNavigateToRoot}
          >
            <span className={`tree-chevron ${rootFolders.length > 0 ? 'open' : 'invisible'}`}>
              <i className="bi bi-chevron-right" />
            </span>
            <span className="tree-icon"><i className="bi bi-house-fill" /></span>
            <span className="tree-name">Stammverzeichnis</span>
            {rootDocCount > 0 && (
              <span className="tree-badge has-files">{rootDocCount}</span>
            )}
          </button>

          {rootFolders.map(folder => (
            <TreeNode
              key={folder.id}
              folder={folder}
              depth={1}
              authFetch={authFetch}
              currentFolderId={currentFolderId}
              onNavigate={handleNavigateToFolder}
              refreshCounter={refreshCounter}
            />
          ))}
        </div>
      )}
    </div>
  );
};
