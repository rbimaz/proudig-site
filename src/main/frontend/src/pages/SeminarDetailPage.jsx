import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate } from '../utils/api';

export const SeminarDetailPage = () => {
  const { slug } = useParams();
  const [seminar, setSeminar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeminar();
  }, [slug]);

  const fetchSeminar = async () => {
    try {
      const res = await fetch(`/api/pages/slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setSeminar(data);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><Navbar /><div className="loading">Laden...</div><Footer /></div>;

  if (!seminar) {
    return (
      <div className="page not-found">
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1>Seminar nicht gefunden</h1>
          <Link to="/seminare">Zurück zu den Seminaren</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page seminar-detail-page">
      <Navbar />

      <article className="seminar-detail">
        {seminar.coverImageId && (
          <div className="seminar-detail-cover">
            <img src={`/api/media/${seminar.coverImageId}`} alt={seminar.title} />
          </div>
        )}

        <div className="seminar-detail-container">
          <div className="seminar-detail-header">
            <div className="breadcrumb">
              <Link to="/seminare">Seminare</Link>
              <span>/</span>
              <span>{seminar.title}</span>
            </div>
            <h1>{seminar.title}</h1>
            <p className="subtitle">{seminar.excerpt}</p>
          </div>

          <div className="seminar-detail-layout">
            <div className="seminar-detail-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {seminar.content}
              </ReactMarkdown>
            </div>

            <aside className="seminar-info-box">
              <h3>Seminar-Details</h3>

              {seminar.date && (
                <div className="info-item">
                  <strong>📅 Datum:</strong>
                  <p>
                    {formatDate(seminar.date)}
                    {seminar.endDate && seminar.date !== seminar.endDate && (
                      <> - {formatDate(seminar.endDate)}</>
                    )}
                  </p>
                </div>
              )}

              {seminar.time && (
                <div className="info-item">
                  <strong>⏰ Uhrzeit:</strong>
                  <p>{seminar.time}</p>
                </div>
              )}

              {seminar.location && (
                <div className="info-item">
                  <strong>📍 Ort:</strong>
                  <p>{seminar.location}</p>
                </div>
              )}

              {seminar.format && (
                <div className="info-item">
                  <strong>🖥️ Format:</strong>
                  <p>
                    {seminar.format === 'online' && 'Online'}
                    {seminar.format === 'inperson' && 'Präsenz'}
                    {seminar.format === 'hybrid' && 'Hybrid'}
                  </p>
                </div>
              )}

              {seminar.duration && (
                <div className="info-item">
                  <strong>⏱️ Dauer:</strong>
                  <p>{seminar.duration}</p>
                </div>
              )}

              {seminar.price !== undefined && (
                <div className="info-item">
                  <strong>💶 Preis:</strong>
                  <p>{seminar.price === 0 ? 'Kostenlos' : `${seminar.price} EUR`}</p>
                </div>
              )}

              {seminar.maxParticipants && (
                <div className="info-item">
                  <strong>👥 Max. Teilnehmer:</strong>
                  <p>{seminar.maxParticipants}</p>
                </div>
              )}

              {seminar.targetAudience && (
                <div className="info-item">
                  <strong>🎯 Zielgruppe:</strong>
                  <p>{seminar.targetAudience}</p>
                </div>
              )}

              {seminar.prerequisites && (
                <div className="info-item">
                  <strong>📋 Voraussetzungen:</strong>
                  <p>{seminar.prerequisites}</p>
                </div>
              )}

              {seminar.registrationLink && (
                <a href={seminar.registrationLink} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Jetzt anmelden
                </a>
              )}

              {seminar.registrationDeadline && (
                <p className="registration-deadline">
                  Anmeldungsfrist: {formatDate(seminar.registrationDeadline)}
                </p>
              )}
            </aside>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};
