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
    setLoading(true);
    try {
      const res = await fetch(`/api/seminare/${slug}`);
      if (res.ok) {
        setSeminar(await res.json());
      } else {
        setSeminar(null);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
      setSeminar(null);
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

      <article className="blog-post">
        {seminar.coverImageId && (
          <div className="blog-post-cover">
            <img src={`/api/media/${seminar.coverImageId}`} alt={seminar.title} />
          </div>
        )}

        <div className="container blog-post-body">
          <div className="blog-post-header">
            <Link to="/seminare" className="hero-tag blog-eyebrow">SEMINARE</Link>
            <h1>{seminar.title}</h1>
            <div className="blog-post-meta">
              <span className="date">{formatDate(seminar.publishedAt || seminar.createdAt)}</span>
              {seminar.tags && seminar.tags.length > 0 && (
                <div className="tags">
                  {seminar.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="blog-post-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {seminar.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};
