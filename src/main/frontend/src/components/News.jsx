import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFadeUp } from '../hooks/useFadeUp';
import { formatDate } from '../utils/api';

export const News = () => {
  const { ref, isVisible } = useFadeUp();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/news?size=3');
        if (res.ok) {
          const data = await res.json();
          setPosts(data.content || []);
        }
      } catch (err) {
        console.error('Fehler beim Laden der News:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Sektion nur zeigen, wenn es veröffentlichte News gibt
  if (!loading && posts.length === 0) return null;

  return (
    <section id="news" className="news-section" ref={ref}>
      <div className="news-inner">
        <div className={`news-header fade-up ${isVisible ? 'visible' : ''}`}>
          <div>
            <span className="news-eyebrow">AKTUELLES</span>
            <h2>News</h2>
          </div>
          <button className="news-all" onClick={() => navigate('/news')}>
            Alle News <i className="bi bi-arrow-right"></i>
          </button>
        </div>

        <div className={`news-grid fade-up ${isVisible ? 'visible' : ''}`}>
          {posts.map(post => (
            <article
              key={post.id}
              className="news-card"
              onClick={() => navigate(`/news/${post.slug}`)}
            >
              {post.coverImageId && (
                <div className="news-card-image">
                  <img src={`/api/media/${post.coverImageId}`} alt={post.title} />
                </div>
              )}
              <div className="news-card-body">
                <span className="news-card-date">{formatDate(post.publishedAt || post.createdAt)}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="news-card-more">Mehr lesen →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
