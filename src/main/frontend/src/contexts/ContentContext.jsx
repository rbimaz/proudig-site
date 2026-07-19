import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext({});

export const ContentProvider = ({ children }) => {
  const [blocks, setBlocks] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/content')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const map = {};
        data.forEach(b => { map[b.sectionKey] = JSON.parse(b.content || '{}'); });
        setBlocks(map);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <ContentContext.Provider value={{ blocks, loaded }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
