import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const AdminDashboard = () => {
  const { authFetch } = useAuth();
  const [stats, setStats] = useState({
    contentBlocks: 0,
    blogPosts: 0,
    seminars: 0,
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [contentRes, blogRes, seminarRes] = await Promise.all([
          authFetch('/api/admin/content'),
          authFetch('/api/admin/pages?category=BLOG'),
          authFetch('/api/admin/pages?category=SEMINAR')
        ]);

        const content = contentRes.ok ? await contentRes.json() : [];
        const blog = blogRes.ok ? await blogRes.json() : [];
        const seminar = seminarRes.ok ? await seminarRes.json() : [];

        setStats({
          contentBlocks: content.length || 0,
          blogPosts: blog.length || 0,
          seminars: seminar.length || 0,
          lastUpdated: new Date().toLocaleDateString('de-DE')
        });
      } catch (err) {
        console.error('Fehler beim Laden der Statistiken:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authFetch]);

  if (loading) return <div className="loading"><i className="bi bi-arrow-repeat spin"></i> Laden...</div>;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1><i className="bi bi-grid-1x2-fill"></i> Dashboard</h1>
        <p>Uebersicht der ProuDig-Verwaltung</p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-file-earmark-richtext"></i></div>
          <div className="stat-content">
            <h3>Inhaltsbloecke</h3>
            <p className="stat-number">{stats.contentBlocks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-pencil-square"></i></div>
          <div className="stat-content">
            <h3>Blog-Beitraege</h3>
            <p className="stat-number">{stats.blogPosts}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-mortarboard-fill"></i></div>
          <div className="stat-content">
            <h3>Seminare</h3>
            <p className="stat-number">{stats.seminars}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon"><i className="bi bi-calendar-check"></i></div>
          <div className="stat-content">
            <h3>Zuletzt aktualisiert</h3>
            <p className="stat-value">{stats.lastUpdated}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-welcome">
        <h2>Willkommen im Admin-Bereich</h2>
        <p>Nutzen Sie das Menu links, um Inhalte zu verwalten, Blog-Beitraege zu erstellen oder Seminare zu administrieren.</p>
      </div>
    </div>
  );
};
