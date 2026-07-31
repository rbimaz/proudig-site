import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownContent from '../components/MarkdownContent';
import { Footer } from '../components/Footer';

export const StaticPageRenderer = ({ slug: fixedSlug }) => {
  const { slug: paramSlug } = useParams();
  const slug = fixedSlug || paramSlug;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setVisible(false);

    fetch(`/api/pages/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setPage(data);
        setLoading(false);
        // Trigger animation after next frame so the DOM has rendered
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setVisible(true));
        });
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <>
        <div className="static-page-content">
          <div className="static-page-loading">
            <div className="loading-spinner"></div>
            <p>Seite wird geladen...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !page) {
    return (
      <>
        <div className="static-page-content">
          <div className="static-page-error">
            <h2>Seite nicht gefunden</h2>
            <p>Die angeforderte Seite existiert nicht oder wurde noch nicht veröffentlicht.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="static-page-content">
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">{page.title}</h2>
              {page.excerpt && <p className="section-subtitle">{page.excerpt}</p>}
            </div>
            <div className={`content-area static-page-inner ${visible ? 'visible' : ''}`}>
              <MarkdownContent>{page.content}</MarkdownContent>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};
