import { useState, useEffect } from 'react';

// Lädt die für den Hero markierten News (published + showInHero, neueste zuerst).
export const useHeroNews = (enabled = true) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    fetch('/api/news/hero')
      .then(res => (res.ok ? res.json() : []))
      .then(data => { if (active) setItems(Array.isArray(data) ? data : []); })
      .catch(() => { if (active) setItems([]); });
    return () => { active = false; };
  }, [enabled]);

  return items;
};
