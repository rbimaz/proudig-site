import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Presentation,
  MessageSquare,
  FileText,
  BookOpen,
  Code,
  Brain
} from './Icons';
import { useFadeUp } from '../hooks/useFadeUp';
import { OFFERINGS } from '../config/offerings';

export const Expertise = () => {
  const { ref, isVisible } = useFadeUp();
  // Welche Leistungen haben veröffentlichten Inhalt? Fail-safe: bis geladen bzw.
  // bei Fehler bleiben die Karten nicht-interaktiv (kein Sprung auf leere Seiten).
  const [contentTags, setContentTags] = useState(null);
  const [seminarsExist, setSeminarsExist] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch('/api/offerings/tags').then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch('/api/seminare?size=1').then((r) => (r.ok ? r.json() : {})).catch(() => ({})),
    ]).then(([tags, sem]) => {
      if (!active) return;
      setContentTags(new Set(Array.isArray(tags) ? tags : []));
      setSeminarsExist((sem?.content?.length ?? 0) > 0 || (sem?.totalElements ?? 0) > 0);
    });
    return () => { active = false; };
  }, []);

  // Ziel + Inhalts-Status je Karte: Weiterbildung -> /seminare (falls Seminare
  // vorhanden), übrige -> /offerings/:key (falls Tag Inhalt hat).
  const cardTarget = (title) => {
    if (title === 'Weiterbildung') {
      return { to: '/seminare', hasContent: seminarsExist };
    }
    const offering = OFFERINGS.find((o) => o.title === title);
    if (!offering) return { to: null, hasContent: false };
    return { to: `/offerings/${offering.key}`, hasContent: contentTags != null && contentTags.has(offering.tag) };
  };

  const items = [
    {
      icon: Presentation,
      title: 'Vorträge',
      description: 'Inspirierende Fachvorträge zu Digitalisierung, KI und Technologie-Trends.'
    },
    {
      icon: MessageSquare,
      title: 'Beratung',
      description: 'Strategische Technologieberatung und Digitalisierungskonzepte — von der Analyse bis zur Umsetzungsbegleitung.'
    },
    {
      icon: FileText,
      title: 'Studien',
      description: 'Wissenschaftlich fundierte Studien und Analysen zu Markttrends, Technologiebewertungen und Machbarkeit.'
    },
    {
      icon: BookOpen,
      title: 'Weiterbildung',
      description: 'Praxisnahe Schulungen und Workshops für Teams — von KI-Grundlagen bis zu spezialisierten Technologie-Trainings.'
    },
    {
      icon: Code,
      title: 'Software-Lösungen',
      description: 'Maßgeschneiderte Softwareentwicklung — von Web- und Mobilanwendungen bis zu komplexen Unternehmensplattformen.'
    },
    {
      icon: Brain,
      title: 'KI-Anwendungen',
      description: 'Entwicklung intelligenter Systeme mit Machine Learning und generativer KI — von der Idee bis zum produktiven Einsatz.'
    }
  ];

  return (
    <section className="expertise" id="leistungen" ref={ref}>
      <div className={`section-container ${isVisible ? 'visible' : ''}`}>
        <div className="section-header">
          <span className="section-tag">LEISTUNGEN</span>
          <h2 className="section-title">Unsere Leistungen</h2>
          <p className="section-subtitle">Wissen vermitteln, Lösungen entwickeln, Zukunft gestalten.</p>
        </div>

        <div className="expertise-grid">
          {items.map((item, index) => {
            const Icon = item.icon;
            const { to, hasContent } = cardTarget(item.title);
            const className = `expertise-card fade-up ${isVisible ? 'visible' : ''}${hasContent ? '' : ' expertise-card--inactive'}`;
            const style = { transitionDelay: `${index * 50}ms` };
            const inner = (
              <>
                <div className="expertise-icon">
                  <Icon width={26} height={26} />
                </div>
                <h3 className="expertise-title">{item.title}</h3>
                <p className="expertise-description">{item.description}</p>
              </>
            );
            // Karte ohne Inhalt: nicht-interaktiv (kein Link, keine Navigation).
            return hasContent ? (
              <Link key={index} to={to} className={className} style={style}>
                {inner}
              </Link>
            ) : (
              <div key={index} className={className} style={style} aria-disabled="true">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
