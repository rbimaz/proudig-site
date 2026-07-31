import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import MarkdownContent from '../components/MarkdownContent';
import { formatDate } from '../utils/api';
import { getOfferingByKey } from '../config/offerings';

// Übersicht einer Leistung: veröffentlichte Offerings mit dem zum :key gehörenden
// Tag als Card-Grid (News-Muster). Der Kopf/Intro kommt optional aus einer CMS-
// Index-Seite (OFFERING-Seite mit Slug = Key); sonst Fallback auf die Config.
// Navbar kommt global aus App.jsx.
export const OfferingOverviewPage = () => {
  const { key } = useParams();
  const offering = getOfferingByKey(key);
  const [posts, setPosts] = useState([]);
  const [indexPage, setIndexPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!offering) {
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setIndexPage(null);

    // Kopf: optionale CMS-Index-Seite (Slug = Key). 404 = Normalfall -> Fallback.
    fetch(`/api/offerings/${encodeURIComponent(key)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active) setIndexPage(data);
      })
      .catch(() => {
        if (active) setIndexPage(null);
      });

    // Grid: veröffentlichte Offerings mit dem Tag, ohne die Index-Seite selbst.
    fetch(`/api/offerings?tag=${encodeURIComponent(offering.tag)}&size=50`)
      .then((res) => (res.ok ? res.json() : { content: [] }))
      .then((data) => {
        if (active) setPosts((data.content || []).filter((p) => p.slug !== key));
      })
      .catch((err) => {
        console.error('Fehler beim Laden:', err);
        if (active) setPosts([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [key, offering]);

  if (!offering) {
    return (
      <div className="page not-found">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1>Leistung nicht gefunden</h1>
          <Link to="/#leistungen">Zurück zu den Leistungen</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const headTitle = indexPage?.title || offering.title;

  return (
    <div className="page news-page">
      <div className="news-hero">
        <div className="container">
          <span className="news-eyebrow">LEISTUNG</span>
          <h1>{headTitle}</h1>
          {indexPage?.excerpt && <p>{indexPage.excerpt}</p>}
        </div>
      </div>

      {indexPage?.content && (
        <section className="offering-intro">
          <div className="container news-post-content">
            <MarkdownContent>{indexPage.content}</MarkdownContent>
          </div>
        </section>
      )}

      <section className="news-list-section">
        <div className="container">
          {loading ? (
            <div className="news-empty">Laden...</div>
          ) : posts.length === 0 ? (
            <div className="news-empty">Noch keine Beiträge zu „{headTitle}"</div>
          ) : (
            <div className="news-list-grid">
              {posts.map((post) => (
                <article key={post.id} className="news-card">
                  {post.coverImageId && (
                    <div className="news-card-image">
                      <img src={`/api/media/${post.coverImageId}`} alt={post.title} />
                    </div>
                  )}
                  <div className="news-card-body">
                    <span className="news-card-date">{formatDate(post.publishedAt || post.createdAt)}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="news-tags">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="news-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <Link to={`/offerings/${offering.key}/${post.slug}`} className="news-more">Mehr lesen →</Link>
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
