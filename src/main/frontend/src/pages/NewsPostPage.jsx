import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate } from '../utils/api';

export const NewsPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/news/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
        const relRes = await fetch('/api/news?size=4');
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelatedPosts((relData.content || []).filter(p => p.id !== data.id).slice(0, 3));
        }
      } else {
        setPost(null);
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
      setPost(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><Navbar /><div className="loading">Laden...</div><Footer /></div>;

  if (!post) {
    return (
      <div className="page not-found">
        <Navbar />
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h1>Beitrag nicht gefunden</h1>
          <Link to="/news">Zurück zu den News</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page news-post-page">
      <Navbar />

      <article className="news-post">
        {post.coverImageId && (
          <div className="news-post-cover">
            <img src={`/api/media/${post.coverImageId}`} alt={post.title} />
          </div>
        )}

        <div className="container news-post-body">
          <div className="news-post-header">
            <Link to="/news" className="news-eyebrow">NEWS</Link>
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {relatedPosts.length > 0 && (
            <section className="news-related">
              <h2>Weitere News</h2>
              <div className="news-related-grid">
                {relatedPosts.map(relPost => (
                  <Link key={relPost.id} to={`/news/${relPost.slug}`} className="news-related-card">
                    <h3>{relPost.title}</h3>
                    <p>{relPost.excerpt}</p>
                    <span className="news-related-date">{formatDate(relPost.publishedAt || relPost.createdAt)}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};
