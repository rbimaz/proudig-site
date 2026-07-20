import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { formatDate } from '../utils/api';

export const NewsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/news?size=50');
      if (res.ok) {
        const data = await res.json();
        setPosts(data.content || []);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page news-page">
      <Navbar />

      <div className="news-hero">
        <div className="container">
          <span className="news-eyebrow">NEWS</span>
          <h1>Neuigkeiten & Aktuelles</h1>
          <p>Was uns bewegt — Updates, Ankündigungen und Einblicke.</p>
        </div>
      </div>

      <section className="news-list-section">
        <div className="container">
          {loading ? (
            <div className="news-empty">Laden...</div>
          ) : posts.length === 0 ? (
            <div className="news-empty">Noch keine News vorhanden</div>
          ) : (
            <div className="news-list-grid">
              {posts.map(post => (
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
                    <Link to={`/news/${post.slug}`} className="news-more">Mehr lesen →</Link>
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
