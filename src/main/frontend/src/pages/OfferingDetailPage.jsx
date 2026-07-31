import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import MarkdownContent from '../components/MarkdownContent';
import { formatDate } from '../utils/api';
import { getOfferingByKey } from '../config/offerings';

// Detailseite eines Offerings unter /offerings/:key/:slug. Inhalt via
// MarkdownContent. Navbar kommt global aus App.jsx.
export const OfferingDetailPage = () => {
  const { key, slug } = useParams();
  const offering = getOfferingByKey(key);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    let active = true;
    setLoading(true);
    fetch(`/api/offerings/${slug}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) setPost(data);
      })
      .catch((err) => {
        console.error('Fehler beim Laden:', err);
        if (active) setPost(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const backTo = offering ? `/offerings/${offering.key}` : '/#leistungen';
  const backLabel = offering ? offering.title : 'Leistungen';

  if (loading) return <div className="loading">Laden...</div>;

  if (!post) {
    return (
      <div className="page not-found">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1>Beitrag nicht gefunden</h1>
          <Link to={backTo}>Zurück zu {backLabel}</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page news-post-page">
      <article className="news-post">
        {post.coverImageId && (
          <div className="news-post-cover">
            <img src={`/api/media/${post.coverImageId}`} alt={post.title} />
          </div>
        )}

        <div className="container news-post-body">
          <div className="news-post-header">
            <Link to={backTo} className="news-eyebrow">{backLabel.toUpperCase()}</Link>
            <h1>{post.title}</h1>
            <div className="news-post-meta">
              <span className="news-post-date">{formatDate(post.publishedAt || post.createdAt)}</span>
              {post.tags && post.tags.length > 0 && (
                <div className="news-tags">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="news-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="news-post-content">
            <MarkdownContent>
              {post.content}
            </MarkdownContent>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};
