import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { formatDate } from '../utils/api';

export const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog?size=50');
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
    <div className="page blog-page">
      <Navbar />

      <div className="blog-hero">
        <div className="container">
          <span className="hero-tag">BLOG</span>
          <h1>Aktuelle Artikel & Insights</h1>
          <p>Wissen teilen. Impulse setzen. Zukunft gestalten.</p>
        </div>
      </div>

      <section className="blog-section">
        <div className="container">
          {loading ? (
            <div className="loading">Laden...</div>
          ) : posts.length === 0 ? (
            <div className="no-posts">Noch keine Beiträge vorhanden</div>
          ) : (
            <div className="blog-grid">
              {posts.map(post => (
                <article key={post.id} className="blog-card">
                  {post.coverImageId && (
                    <div className="blog-card-image">
                      <img src={`/api/media/${post.coverImageId}`} alt={post.title} />
                    </div>
                  )}
                  <div className="blog-card-content">
                    <span className="blog-date">{formatDate(post.publishedAt || post.createdAt)}</span>
                    <h2>{post.title}</h2>
                    <p className="excerpt">{post.excerpt}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="blog-tags">
                        {post.tags.map((tag, idx) => (
                          <span key={idx} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    <Link to={`/blog/${post.slug}`} className="read-more">
                      Mehr lesen →
                    </Link>
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
