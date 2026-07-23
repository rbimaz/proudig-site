import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/api';

const pillLabel = (item) => (item.tags && item.tags.length > 0 ? item.tags[0] : 'News');

export const HeroNewsBox = ({ items }) => {
  if (!items || items.length === 0) return null;

  const lead = items[0];
  const more = items.slice(1);
  const multiple = more.length > 0;
  const leadDate = formatDate(lead.publishedAt || lead.createdAt);

  return (
    <aside className="hero-newsbox">
      <div className="hero-newsbox-head">
        <span className="hero-newsbox-eyebrow">
          {multiple ? 'Aktuelle Ankündigungen' : 'Aktuelle Ankündigung'}
        </span>
        {multiple && (
          <span className="hero-newsbox-count">{items.length} Meldungen · {leadDate}</span>
        )}
      </div>

      <div className="hero-newsbox-meta">
        <span className="hero-newsbox-pill">{pillLabel(lead)}</span>
        <span className="hero-newsbox-date">{leadDate}</span>
      </div>
      <h2 className="hero-newsbox-title">{lead.title}</h2>
      <p className="hero-newsbox-excerpt">{lead.excerpt}</p>
      <Link to={`/news/${lead.slug}`} className="hero-newsbox-more">Mehr erfahren →</Link>

      {multiple && (
        <div className="hero-newsbox-list">
          {more.map(n => (
            <Link key={n.id} to={`/news/${n.slug}`} className="hero-newsbox-item">
              <span className="hero-newsbox-item-tag">{pillLabel(n)}</span>
              <span className="hero-newsbox-item-title">{n.title}</span>
              <span className="hero-newsbox-item-arrow">→</span>
            </Link>
          ))}
        </div>
      )}

      <div className="hero-newsbox-foot">
        <Link to="/news" className="hero-newsbox-all">Alle News ansehen →</Link>
      </div>
    </aside>
  );
};
