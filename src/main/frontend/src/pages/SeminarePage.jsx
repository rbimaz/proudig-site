import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { formatDate } from '../utils/api';

export const SeminarePage = () => {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      const res = await fetch('/api/seminare?size=50');
      if (res.ok) {
        const data = await res.json();
        setSeminars(data.content || []);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? (
            <div className="loading">Laden...</div>
          ) : seminars.length === 0 ? (
            <div className="no-seminars">Keine Seminare vorhanden</div>
          ) : (
            <div className="blog-grid">
              {seminars.map(seminar => (
                <article key={seminar.id} className="blog-card">
                  {seminar.coverImageId && (
                    <div className="blog-card-image">
                      <img src={`/api/media/${seminar.coverImageId}`} alt={seminar.title} />
                    </div>
                  )}
                  <div className="blog-card-content">
                    <span className="blog-date">{formatDate(seminar.publishedAt || seminar.createdAt)}</span>
                    <h2>{seminar.title}</h2>
                    <p className="excerpt">{seminar.excerpt}</p>
                    {seminar.tags && seminar.tags.length > 0 && (
                      <div className="blog-tags">
                        {seminar.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <Link to={`/seminare/${seminar.slug}`} className="read-more">Mehr erfahren →</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
