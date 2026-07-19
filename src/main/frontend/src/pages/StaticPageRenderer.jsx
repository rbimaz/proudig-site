import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
        <div className={`static-page-inner ${visible ? 'visible' : ''}`}
             dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
      <Footer />
    </>
  );
};
