import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { formatDate } from '../utils/api';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/blog/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
        // Verwandte Beiträge (gleiche Kategorie)
        const relRes = await fetch(`/api/blog?size=4`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelatedPosts((relData.content || []).filter(p => p.id !== data.id).slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Fehler beim Laden:', err);
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
          <Link to="/blog">Zurück zum Blog</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page blog-post-page">
      <Navbar />

      <article className="blog-post">
        {post.coverImageId && (
          <div className="blog-post-cover">
            <img src={`/api/media/${post.coverImageId}`} alt={post.title} />
          </div>
        )}

        <div className="container blog-post-body">
          <div className="blog-post-header">
            <Link to="/blog" className="hero-tag blog-eyebrow">BLOG</Link>
            <h1>{post.title}</h1>
            <div className="blog-post-meta">
              <span className="date">{formatDate(post.publishedAt || post.createdAt)}</span>
              {post.tags && post.tags.length > 0 && (
                <div className="tags">
                  {post.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="blog-post-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {relatedPosts.length > 0 && (
            <section className="related-posts">
              <h2>Ähnliche Artikel</h2>
              <div className="related-grid">
                {relatedPosts.map(relPost => (
                  <Link key={relPost.id} to={`/blog/${relPost.slug}`} className="related-card">
                    <h3>{relPost.title}</h3>
                    <p>{relPost.excerpt}</p>
                    <span className="date">{formatDate(relPost.createdAt)}</span>
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
