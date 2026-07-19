import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { formatDate } from '../utils/api';

export const SeminarePage = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, archived

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      const res = await fetch('/api/pages?category=SEMINAR&status=published');
      if (res.ok) {
        const data = await res.json();
        // Sort by date
        const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setSeminars(sorted);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcoming = seminars.filter(s => new Date(s.date) >= now);
  const archived = seminars.filter(s => new Date(s.date) < now);
  const displaySeminars = filter === 'upcoming' ? upcoming : archived;

  return (
    <div className="page seminar-page">
      <Navbar />

      <div className="seminar-hero">
        <div className="container">
          <span className="hero-tag">SEMINARE</span>
          <h1>Wissenstransfer & Weiterbildung</h1>
          <p>Praxisnahe Seminare für Ihr Team – von Experten geleitet.</p>
        </div>
      </div>

      <section className="seminar-section">
        <div className="container">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Kommende ({upcoming.length})
            </button>
            <button
              className={`filter-btn ${filter === 'archived' ? 'active' : ''}`}
              onClick={() => setFilter('archived')}
            >
              Vergangene ({archived.length})
            </button>
          </div>

          {loading ? (
            <div className="loading">Laden...</div>
          ) : displaySeminars.length === 0 ? (
            <div className="no-seminars">Keine Seminare vorhanden</div>
          ) : (
            <div className="seminar-list">
              {displaySeminars.map(seminar => (
                <Link key={seminar.id} to={`/seminare/${seminar.slug}`} className="seminar-card">
                  <div className="seminar-card-image">
                    {seminar.coverImageId ? (
                      <img src={`/api/media/${seminar.coverImageId}`} alt={seminar.title} />
                    ) : (
                      <div className="placeholder">📚</div>
                    )}
                  </div>
                  <div className="seminar-card-content">
                    <h2>{seminar.title}</h2>
                    <p className="excerpt">{seminar.excerpt}</p>

                    <div className="seminar-meta">
                      <div className="meta-item">
                        <span className="icon">📅</span>
                        <span>{formatDate(seminar.date)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="icon">📍</span>
                        <span>{seminar.location}</span>
                      </div>
                      {seminar.price && (
                        <div className="meta-item">
                          <span className="icon">💶</span>
                          <span>{seminar.price} EUR</span>
                        </div>
                      )}
                      {seminar.duration && (
                        <div className="meta-item">
                          <span className="icon">⏱</span>
                          <span>{seminar.duration}</span>
                        </div>
                      )}
                    </div>

                    <div className="seminar-card-footer">
                      Mehr erfahren →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
