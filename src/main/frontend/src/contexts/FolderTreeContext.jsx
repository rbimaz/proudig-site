import React, { createContext, useContext, useState, useCallback } from 'react';

const FolderTreeContext = createContext(null);

export const useFolderTree = () => {
  const ctx = useContext(FolderTreeContext);
  if (!ctx) throw new Error('useFolderTree must be used within FolderTreeProvider');
  return ctx;
};

export const FolderTreeProvider = ({ children }) => {
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [folderPath, setFolderPath] = useState([]);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const navigateToFolder = useCallback((folderId, path) => {
    setCurrentFolderId(folderId);
    setFolderPath(path || []);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshCounter(c => c + 1);
  }, []);

  return (
    <FolderTreeContext.Provider value={{
      currentFolderId,
      setCurrentFolderId,
      folderPath,
      setFolderPath,
      navigateToFolder,
      refreshCounter,
      triggerRefresh
    }}>
      {children}
    </FolderTreeContext.Provider>
  );
};
