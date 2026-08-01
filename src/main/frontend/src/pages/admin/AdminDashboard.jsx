import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState({
    news: 0,
    blogPosts: 0,
    seminars: 0,
    media: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const count = async (url) => {
        try {
          const res = await authFetch(url);
          if (!res.ok) return 0;
          const data = await res.json();
          return Array.isArray(data) ? data.length : 0;
        } catch (err) {
          return 0;
        }
      };
      try {
        const [news, blogPosts, seminars, media, messages] = await Promise.all([
          count('/api/admin/pages?category=NEWS'),
          count('/api/admin/pages?category=BLOG'),
          count('/api/admin/pages?category=SEMINAR'),
          count('/api/admin/media'),
          count('/api/admin/messages')
        ]);
        setStats({ news, blogPosts, seminars, media, messages });
      } catch (err) {
        console.error('Fehler beim Laden der Statistiken:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authFetch]);

  if (loading) return <div className="loading"><i className="bi bi-arrow-repeat spin"></i> Laden...</div>;

  const cards = [
    { label: 'News', icon: 'bi-newspaper', value: stats.news, to: '/admin/cms/news' },
    { label: 'Blog-Beiträge', icon: 'bi-pencil-square', value: stats.blogPosts, to: '/admin/cms/blog' },
    { label: 'Seminare', icon: 'bi-mortarboard-fill', value: stats.seminars, to: '/admin/cms/seminare' },
    { label: 'Mediathek', icon: 'bi-images', value: stats.media, to: '/admin/cms/media' },
    { label: 'Kontaktanfragen', icon: 'bi-envelope-fill', value: stats.messages, to: '/admin/cms/nachrichten' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1><i className="bi bi-grid-1x2-fill"></i> Dashboard</h1>
        <p>Übersicht der ProuDig-Verwaltung</p>
      </div>

      <div className="dashboard-grid">
        {cards.map(card => (
          <Link className="stat-card" key={card.label} to={card.to}>
            <div className="stat-icon"><i className={`bi ${card.icon}`}></i></div>
            <div className="stat-content">
              <h3>{card.label}</h3>
              <p className="stat-number">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
